/* +Empregos authentication. Supabase remains the authority for identity and access. */
(function () {
  'use strict';
  const empresaRotas = new Set(['painel-empresa','vagas-empresa','candidatos-empresa','contratacoes-empresa','perfil-empresa','publicar','central-empresa','painel-conecta']);
  const candidatoRotas = new Set(['painel-candidato','perfil-candidato','curriculo','salvas','candidaturas','candidatar','avaliar-processos']);
  let sessionRequest = null, sessionRequestRevision = -1, verifiedUser = null, routeSequence = 0;
  window.empregosSessionRevisionEM = 0;
  window.mostrarToast = function (message) {
    let toast = document.getElementById('empregosStatusToast');
    if (!toast) { toast = document.createElement('div'); toast.id='empregosStatusToast'; toast.className='empregos-status-toast'; toast.setAttribute('role','status'); toast.setAttribute('aria-live','polite'); document.body.appendChild(toast); }
    toast.textContent=String(message || ''); toast.hidden=false;
    clearTimeout(window.empregosToastTimer);
    window.empregosToastTimer=setTimeout(()=>{toast.hidden=true;},5000);
  };
  const field = id => String(document.getElementById(id)?.value || '').trim();
  const sessionKeys = ['empregaMaisSupabaseAccessToken','empregaMaisSupabaseRefreshToken','empregaMaisPapel','empregaMaisPapelPersistido','empresaSupabaseAuthUserId','empresaSupabaseUserId','empresaSupabaseEmpresaId','empresaUsuarioAdministrador','empresaCnpj','empresaNome','candidatoSupabaseUserId','candidatoEmail','candidatoNome','empregaMaisAdmin','empregaMaisAdminEmail','empregaMaisAdminSupabaseAccessToken','empregaMaisAdminSupabaseRefreshToken'];

  function cleanSecrets() {
    for (const key of ['empregaMaisEmpresas','empregaMaisCandidatos']) {
      const rows = ler(key, []);
      if (!Array.isArray(rows)) continue;
      let changed = false;
      rows.forEach(row => { if (row && ('senha' in row || 'password' in row)) { delete row.senha; delete row.password; changed = true; } });
      if (changed) { try { gravar(key, rows); } catch (error) { console.warn("Não foi possível atualizar o cache de perfil.", error); } }
    }
  }
  function clearSession() {
    window.empregosSessionRevisionEM++;
    verifiedUser = null;
    sessionKeys.forEach(key => { sessionStorage.removeItem(key); localStorage.removeItem(key); });
    sbCandidaturasCacheEM = []; sbCandidaturasCarregadasEM = false;
    // Keep public jobs, saved CVs and drafts. Only session state is discarded.
    localStorage.setItem('empregaMaisLogoutBloqueio', '1');
    sessionStorage.setItem('empregaMaisLogoutBloqueio', '1');
    atualizarHeaderContextualEM();
  }
  function enableSession() {
    window.empregosSessionRevisionEM++;
    localStorage.removeItem('empregaMaisLogoutBloqueio');
    sessionStorage.removeItem('empregaMaisLogoutBloqueio');
  }
  async function validateSession() {
    const revision = window.empregosSessionRevisionEM;
    if (sessionRequest && sessionRequestRevision === revision) return sessionRequest;
    sessionRequestRevision = revision;
    sessionRequest = (async () => {
      const token = sbTokenEM(), refresh = sbRefreshTokenEM();
      if (!token && !refresh) return '';
      if (localStorage.getItem('empregaMaisLogoutBloqueio') === '1') return '';
      try {
        let current = token, user = null;
        if (current) {
          try { user = await sbJsonEM(EMPREGAMAIS_SUPABASE_URL + '/auth/v1/user', {headers: sbHeadersEM(current)}); }
          catch (error) { if (![401,403].includes(error.status)) throw error; current = ''; }
        }
        if (revision !== window.empregosSessionRevisionEM) return '';
        if (!current && refresh) {
          const auth = await sbJsonEM(EMPREGAMAIS_SUPABASE_URL + '/auth/v1/token?grant_type=refresh_token', {method:'POST', headers:sbHeadersEM(), body:JSON.stringify({refresh_token:refresh})});
          if (revision !== window.empregosSessionRevisionEM) return '';
          sbSalvarSessaoEM(auth); user = auth.user; current = auth.access_token;
        }
        if (revision !== window.empregosSessionRevisionEM) return '';
        if (!current || !user?.id) { clearSession(); return ''; }
        verifiedUser = user;
        return current;
      } catch (error) {
        if (revision !== window.empregosSessionRevisionEM) return '';
        if ([400,401,403].includes(error.status)) { clearSession(); return ''; }
        // A network outage is not a logout. Preserve the session for a retry.
        throw error;
      } finally { if (sessionRequestRevision === revision) sessionRequest = null; }
    })();
    return sessionRequest;
  }
  window.sbGarantirSessaoEM = sbGarantirSessaoEM = validateSession;
  window.sbJsonEM = sbJsonEM = async function (url, options) {
    const response = await fetch(url, options);
    const text = await response.text();
    let data;
    try { data = text ? JSON.parse(text) : null; }
    catch (_) { throw new Error('O servidor retornou uma resposta inválida. Tente novamente.'); }
    if (!response.ok) {
      const error = new Error(data?.msg || data?.message || data?.error_description || data?.error || ('Erro ' + response.status));
      error.status = response.status; error.code = data?.code;
      throw error;
    }
    return data;
  };

  window.sbBuscarMinhaEmpresaEM = sbBuscarMinhaEmpresaEM = async function () {
    const token = await validateSession();
    if (!token) return null;
    const uid = verifiedUser.id;
    const own = await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/empresas?select=*&user_id=eq.'+encodeURIComponent(uid)+'&limit=1', {headers:sbHeadersEM(token)});
    if (own?.[0]) return own[0];
    const links = await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/empresa_usuarios?select=empresa_id&user_id=eq.'+encodeURIComponent(uid)+'&ativo=eq.true&limit=1', {headers:sbHeadersEM(token)});
    if (!links?.[0]?.empresa_id) return null;
    const company = await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/empresas?select=*&id=eq.'+encodeURIComponent(links[0].empresa_id)+'&limit=1', {headers:sbHeadersEM(token)});
    return company?.[0] || null;
  };
  async function hydrateCompany() {
    const revision = window.empregosSessionRevisionEM;
    let company = await sbBuscarMinhaEmpresaEM();
    if (revision !== window.empregosSessionRevisionEM) return false;
    if (!company && verifiedUser?.user_metadata?.papel === 'empresa') {
      const base = verifiedUser.user_metadata;
      if (nums(base.cnpj).length === 14) company = await sbInserirEmpresaEM({access_token:sbTokenEM(),user:verifiedUser}, base);
    }
    if (revision !== window.empregosSessionRevisionEM || !company) return false;
    const local = sbEmpresaParaLocalEM(company, ''); delete local.senha;
    sbSalvarEmpresaLocalEM(local);
    sessionStorage.setItem('empregaMaisPapel','empresa'); localStorage.setItem('empregaMaisPapelPersistido','empresa');
    sessionStorage.setItem('empresaCnpj',company.cnpj || ''); sessionStorage.setItem('empresaNome',local.nome);
    sessionStorage.setItem('empresaSupabaseAuthUserId',verifiedUser.id);
    sessionStorage.setItem('empresaSupabaseUserId',company.user_id || ''); sessionStorage.setItem('empresaSupabaseEmpresaId',company.id);
    sessionStorage.setItem('empresaUsuarioAdministrador',String(verifiedUser.id === company.user_id));
    atualizarHeaderContextualEM(); return true;
  }
  async function hydrateCandidate() {
    const revision = window.empregosSessionRevisionEM;
    const token = await validateSession(); if (!token || revision !== window.empregosSessionRevisionEM) return false;
    const rows = await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/candidatos?select=*&user_id=eq.'+encodeURIComponent(verifiedUser.id)+'&limit=1', {headers:sbHeadersEM(token)});
    if (revision !== window.empregosSessionRevisionEM) return false;
    let candidate = rows?.[0];
    if (!candidate && verifiedUser.user_metadata?.papel !== 'empresa') {
      const base = sbCandidatoDoAuthEM({user:verifiedUser}, {nome:verifiedUser.user_metadata?.full_name || '',email:verifiedUser.email});
      await sbUpsertCandidatoSupabaseEM(base,token);
      if (revision !== window.empregosSessionRevisionEM) return false;
      const created = await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/candidatos?select=*&user_id=eq.'+encodeURIComponent(verifiedUser.id)+'&limit=1', {headers:sbHeadersEM(token)});
      candidate = created?.[0];
    }
    if (revision !== window.empregosSessionRevisionEM || !candidate) return false;
    const local = sbMapPerfilCandidatoCloudEM(candidate,{}); delete local.senha;
    sbSalvarCandidatoLocalEM(local);
    sessionStorage.setItem('empregaMaisPapel','candidato'); localStorage.setItem('empregaMaisPapelPersistido','candidato');
    sessionStorage.setItem('candidatoNome',local.nome); sessionStorage.setItem('candidatoEmail',local.email); sessionStorage.setItem('candidatoSupabaseUserId',local.userId);
    gravar('empregaMaisCurriculoOnline_'+local.email,local.curriculoOnline || {});
    gravar('empregaMaisSalvas_'+local.email,local.vagasSalvas || []);
    if (local.curriculoArquivo) gravar('empregaMaisCurriculo_'+local.email,local.curriculoArquivo);
    atualizarHeaderContextualEM(); return true;
  }
  async function busy(form, messageId, action) {
    if (form?.dataset.authBusy === '1') return;
    if (form) form.dataset.authBusy = '1';
    const button = form?.querySelector('[type="submit"]'); if (button) button.disabled = true;
    try { await action(); }
    catch (error) { msg('#'+messageId, /invalid login|invalid credentials/i.test(error.message) ? 'Dados de acesso incorretos. Confira e tente novamente.' : error.message); }
    finally { if (form) delete form.dataset.authBusy; if (button) button.disabled = false; cleanSecrets(); }
  }
  window.loginEmpresa = loginEmpresa = async function (event) {
    event.preventDefault();
    return busy(event.target,'msgLoginEmpresa',async () => {
      const credential = field('loginEmpresaCnpj'), password = document.getElementById('loginEmpresaSenha').value;
      if (!credential || !password) throw new Error('Informe o CNPJ ou e-mail e sua senha.');
      enableSession(); msg('#msgLoginEmpresa','Entrando...');
      const auth = await sbLoginAuthEmpresaEM(credential,password); verifiedUser = auth.user;
      if (!await hydrateCompany()) throw new Error('Este acesso não está vinculado a uma empresa.');
      irPara('painel-empresa');
    });
  };
  window.loginCandidato = loginCandidato = async function (event) {
    event.preventDefault();
    return busy(event.target,'msgLoginCandidato',async () => {
      enableSession(); msg('#msgLoginCandidato','Entrando...');
      const auth = await sbLoginAuthCandidatoEM(field('loginCandEmail').toLowerCase(),document.getElementById('loginCandSenha').value); verifiedUser = auth.user;
      if (!await hydrateCandidate()) throw new Error('Este acesso não tem um perfil de candidato.');
      const returnRoute = sessionStorage.getItem('retornoCandidatura') === '1' ? 'candidatar' : 'painel-candidato';
      const selected = sessionStorage.getItem('vagaSelecionada'); if (selected) sessionStorage.setItem('vagaAtual',selected);
      sessionStorage.removeItem('retornoCandidatura'); irPara(returnRoute);
    });
  };
  window.cadastrarEmpresa = cadastrarEmpresa = async function (event) {
    event.preventDefault();
    return busy(event.target,'msgCadastroEmpresa',async () => {
      const password = document.getElementById('cadEmpresaSenha').value;
      if (password.length < 8 || password !== document.getElementById('cadEmpresaSenha2').value) throw new Error('Use uma senha de pelo menos 8 caracteres e confirme a mesma senha.');
      const base = {papel:'empresa',nome:field('cadEmpresaNome'),cnpj:nums(field('cadEmpresaCnpj')),email:field('cadEmpresaEmail').toLowerCase(),emailCandidaturas:field('cadEmpresaEmailCandidaturas').toLowerCase() || field('cadEmpresaEmail').toLowerCase(),telefone:field('cadEmpresaTelefone')};
      if (base.cnpj.length !== 14 || base.nome.length < 2 || nums(base.telefone).length < 10) throw new Error('Confira o nome, o CNPJ e o telefone da empresa.');
      enableSession(); msg('#msgCadastroEmpresa','Criando sua conta...');
      const auth = await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/auth/v1/signup?redirect_to='+encodeURIComponent(location.origin+location.pathname+'?pagina=login-empresa'),{method:'POST',headers:sbHeadersEM(),body:JSON.stringify({email:base.email,password,data:base})});
      if (!auth?.access_token) { msg('#msgCadastroEmpresa','Confira seu e-mail para confirmar o cadastro. Depois, entre com seu e-mail e senha.',true); return; }
      sbSalvarSessaoEM(auth); verifiedUser = auth.user;
      if (!await hydrateCompany()) throw new Error('Não foi possível concluir o perfil da empresa. Entre novamente para tentar concluir.');
      irPara('painel-empresa');
    });
  };
  window.cadastrarCandidato = cadastrarCandidato = async function (event) {
    event.preventDefault();
    return busy(event.target,'msgCadastroCandidato',async () => {
      const password = document.getElementById('cadCandSenha').value;
      if (password.length < 8 || password !== document.getElementById('cadCandSenha2').value) throw new Error('Use uma senha de pelo menos 8 caracteres e confirme a mesma senha.');
      enableSession(); msg('#msgCadastroCandidato','Criando sua conta...');
      const auth = await sbCadastrarAuthCandidatoEM(field('cadCandEmail').toLowerCase(),password,field('cadCandNome'),field('cadCandTelefone'),field('cadCandCidade'));
      if (!auth?.access_token) { msg('#msgCadastroCandidato','Confira seu e-mail para confirmar o cadastro. Depois, entre na sua conta.',true); return; }
      verifiedUser = auth.user; if (!await hydrateCandidate()) throw new Error('Não foi possível concluir seu perfil. Entre novamente para tentar concluir.');
      irPara('painel-candidato');
    });
  };
  const previousCompanyLogin = sbLoginAuthEmpresaEM;
  window.sbLoginAuthEmpresaEM = sbLoginAuthEmpresaEM = async function (credential,password) {
    const cnpj=String(credential||'').replace(/\D/g,'');
    if (cnpj.length !== 14 || String(credential).includes('@')) return previousCompanyLogin(credential,password);
    const auth=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/functions/v1/auth-empresa-cnpj',{method:'POST',headers:sbHeadersEM(),body:JSON.stringify({cnpj,password})});
    if (!auth?.access_token || !auth?.user) throw new Error('Credenciais inválidas.');
    sbSalvarSessaoEM(auth); return auth;
  };
  window.recuperarAcessoEmpregosEM = async function (role) {
    const messageId = role === 'empresa' ? '#msgLoginEmpresa' : '#msgLoginCandidato';
    const email = role === 'empresa' ? field('loginEmpresaCnpj') : field('loginCandEmail');
    const cnpj=role==='empresa' && !email.includes('@') ? email.replace(/\D/g,'') : '';
    if (cnpj.length!==14 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg(messageId,'Informe o e-mail da sua conta para receber o link de recuperação.'); return; }
    try {
      const redirect=location.origin+location.pathname+'?pagina=recuperar-senha&tipo='+role;
      const endpoint=cnpj.length===14 ? '/functions/v1/recuperar-senha-empresa' : '/auth/v1/recover?redirect_to='+encodeURIComponent(redirect);
      await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+endpoint,{method:'POST',headers:sbHeadersEM(),body:JSON.stringify(cnpj.length===14?{cnpj}:{email})});
      msg(messageId,'Se houver uma conta correspondente, o link será enviado ao e-mail registrado.',true);
    } catch (error) { msg(messageId,error.message); }
  };
  window.atualizarSenhaEmpregosEM = async function (event) {
    event.preventDefault();
    return busy(event.target,'msgRecuperarSenha',async () => {
      if (sessionStorage.getItem('empregosRecovery') !== '1') throw new Error('Abra o link de recuperação enviado ao seu e-mail.');
      const password = document.getElementById('novaSenhaEmpregos').value;
      if (password.length < 8 || password !== document.getElementById('confirmarSenhaEmpregos').value) throw new Error('Use uma senha de pelo menos 8 caracteres e confirme a mesma senha.');
      const token = await validateSession(); if (!token) throw new Error('O link de recuperação expirou. Solicite um novo link.');
      await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/auth/v1/user',{method:'PUT',headers:sbHeadersEM(token),body:JSON.stringify({password})});
      sessionStorage.removeItem('empregosRecovery');
      const companyRecovery=new URLSearchParams(location.search).get('tipo')==='empresa';
      await sair();
      irPara(companyRecovery?'login-empresa':'login-candidato'); msg(companyRecovery?'#msgLoginEmpresa':'#msgLoginCandidato','Senha atualizada. Entre novamente com sua nova senha.',true);
    });
  };
  window.sair = sair = window.empregaiAuthLogoutEM = async function () {
    const token = sbTokenEM(), adminToken = sessionStorage.getItem(EMPREGAMAIS_SB_ADMIN_TOKEN);
    clearSession(); routeSequence++; irPara('home');
    await Promise.allSettled([...new Set([token,adminToken].filter(Boolean))].map(value => sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/auth/v1/logout?scope=global',{method:'POST',headers:sbHeadersEM(value)})));
  };
  const originalRoute = abrirRota;
  window.abrirRota = abrirRota = async function (route) {
    const sequence = ++routeSequence;
    const role = empresaRotas.has(route) ? 'empresa' : candidatoRotas.has(route) ? 'candidato' : '';
    if (!role) return originalRoute(route);
    try {
      const token = await validateSession();
      const allowed = token && (role === 'empresa' ? await hydrateCompany() : await hydrateCandidate());
      if (sequence !== routeSequence) return;
      if (!allowed) {
        if (route === 'candidatar') sessionStorage.setItem('retornoCandidatura','1');
        const login = 'login-'+role;
        history.replaceState({},'',location.pathname+'?pagina='+login);
        return originalRoute(login);
      }
      return originalRoute(route);
    } catch (error) {
      if (sequence !== routeSequence) return;
      mostrarToast('Não foi possível validar sua sessão. Confira sua conexão e tente novamente.');
      return originalRoute('login-'+role);
    }
  };
  window.addEventListener('storage',event => {
    if (event.key === 'empregaMaisLogoutBloqueio' && event.newValue === '1') { clearSession(); irPara('home'); }
  });
  cleanSecrets();
  document.addEventListener('DOMContentLoaded',() => {
    garantirLoginCandidatoEM();
    const login = document.getElementById('formLoginCandidato');
    login?.querySelector('label')?.setAttribute('for','loginCandEmail');
    const labels = login?.querySelectorAll('label'); if (labels?.[1]) labels[1].htmlFor='loginCandSenha';
    if (login && !login.querySelector('[data-recovery]')) {
      const button=document.createElement('button');button.type='button';button.dataset.recovery='1';button.className='auth-link';button.textContent='Esqueci minha senha';button.onclick=()=>recuperarAcessoEmpregosEM('candidato');login.appendChild(button);
    }
    const hash = new URLSearchParams(location.hash.slice(1));
    if (hash.get('access_token') && hash.get('refresh_token')) {
      enableSession(); sbSalvarSessaoEM({access_token:hash.get('access_token'),refresh_token:hash.get('refresh_token')});
      const recovery = hash.get('type') === 'recovery';
      history.replaceState({},'',location.pathname+(recovery?'?pagina=recuperar-senha&tipo='+(new URLSearchParams(location.search).get('tipo')==='empresa'?'empresa':'candidato'):location.search));
      if (recovery) { sessionStorage.setItem('empregosRecovery','1'); originalRoute('recuperar-senha'); }
    }
    if (sbTokenEM() || sbRefreshTokenEM()) validateSession().then(async token => {
      if (!token) return;
      const role=localStorage.getItem('empregaMaisPapelPersistido');
      if (role==='empresa') await hydrateCompany(); else if (role==='candidato') await hydrateCandidate();
      atualizarHeaderContextualEM();
    }).catch(()=>{});
  });
})();
