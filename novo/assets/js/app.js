function removerAnunciarVagaGratisHeaderEM(){
 const candidatos=[...document.querySelectorAll('header a,header button,nav a,nav button,.header a,.header button,.topo a,.topo button')];
 candidatos.forEach(el=>{
  const texto=String(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
  if(texto==='anunciar vaga grátis'||texto==='anunciar vaga gratis')el.remove();
 })
}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];const ler=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k))||d}catch{return d}},gravar=(k,v)=>localStorage.setItem(k,JSON.stringify(v)),nums=v=>(v||'').replace(/\D/g,'');function irPara(p='home'){const url=p==='home'?location.pathname:location.pathname+'?pagina='+encodeURIComponent(p);if(location.pathname+location.search!==url)history.pushState({},'',url);abrirRota(p)}function mostrarPagina(id){const mesmaPagina=$('#pagina-'+id)?.classList.contains('ativa');document.querySelectorAll('.pagina').forEach(x=>x.classList.remove('ativa'));let el=$('#pagina-'+id);if(!el){id='home';el=$('#pagina-home');if(location.search)history.replaceState({},'',location.pathname)}if(el)el.classList.add('ativa');document.querySelectorAll('.menu-drop').forEach(x=>x.classList.remove('aberto'));if(!mesmaPagina)scrollTo(0,0)}function papelAtual(){
 if(localStorage.getItem('empregaMaisLogoutBloqueio')==='1'||sessionStorage.getItem('empregaMaisLogoutBloqueio')==='1')return '';
 const sessao=sessionStorage.getItem('empregaMaisPapel')||'';
 if(sessao)return sessao;
 const token=sessionStorage.getItem('empregaMaisSupabaseAccessToken')||localStorage.getItem('empregaMaisSupabaseAccessToken')||sessionStorage.getItem('empregaMaisSupabaseRefreshToken')||localStorage.getItem('empregaMaisSupabaseRefreshToken');
 return token?(localStorage.getItem('empregaMaisPapelPersistido')||''):''
}
function adminVisualizacaoAtivaEM(){return sessionStorage.getItem('empregaMaisAdmin')==='1'&&!!sessionStorage.getItem('empregaMaisAdminVisualizacao')}
function adminVisualizacaoPerfilEM(){return sessionStorage.getItem('empregaMaisAdminVisualizacao')||''}
function adminVisualizacaoSnapshotEM(){
 if(sessionStorage.getItem('empregaMaisAdminVisualizacaoSnapshot'))return;
 const keys=['empregaMaisPapel','empresaCnpj','empresaNome','candidatoEmail','candidatoNome','candidatoPremiumVerificadoEM','empregaMaisAdminPlanoSimulado'];
 const obj={};keys.forEach(k=>obj[k]=sessionStorage.getItem(k));
 sessionStorage.setItem('empregaMaisAdminVisualizacaoSnapshot',JSON.stringify(obj))
}
function adminRestaurarVisualizacaoEM(){
 try{
  const snap=JSON.parse(sessionStorage.getItem('empregaMaisAdminVisualizacaoSnapshot')||'{}');
  ['empregaMaisPapel','empresaCnpj','empresaNome','candidatoEmail','candidatoNome','candidatoPremiumVerificadoEM','empregaMaisAdminPlanoSimulado'].forEach(k=>{
   if(snap[k]===null||snap[k]===undefined)sessionStorage.removeItem(k);else sessionStorage.setItem(k,snap[k])
  })
 }catch(_){}
 sessionStorage.removeItem('empregaMaisAdminVisualizacao');
 sessionStorage.removeItem('empregaMaisAdminVisualizacaoSnapshot');
 document.getElementById('adminVisualizacaoBarraEM')?.remove()
}
function garantirAdminVisualizadorEM(){
 if(document.getElementById('pagina-admin-visualizador'))return;
 if(!document.getElementById('estiloAdminVisualizadorEM')){
  const st=document.createElement('style');st.id='estiloAdminVisualizadorEM';st.textContent=
  '#pagina-admin-visualizador{font-family:Montserrat,Arial,sans-serif;background:#f6f7fb;min-height:100vh;padding:28px}'+
  '.admvis-wrap{max-width:1220px;margin:0 auto}.admvis-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;margin-bottom:22px}.admvis-head h1{margin:0;color:#16354b;font-size:28px}.admvis-head p{margin:7px 0 0;color:#697b88;font-size:12px;line-height:1.55}.admvis-note{display:flex;gap:11px;padding:14px 16px;border:1px solid #d8e4ec;border-radius:14px;background:#fff;margin-bottom:20px}.admvis-note b{display:block;color:#24465d;font-size:12px}.admvis-note span{display:block;color:#748590;font-size:10.5px;line-height:1.5;margin-top:3px}'+
  '.admvis-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.admvis-card{background:#fff;border:1px solid #e1e7ec;border-radius:17px;padding:18px;box-shadow:0 8px 24px rgba(31,58,74,.05)}.admvis-card h3{margin:0;color:#183a51;font-size:15px}.admvis-card p{margin:6px 0 14px;color:#7a8994;font-size:10.5px;line-height:1.5}.admvis-chip{display:inline-flex;margin-bottom:12px;padding:5px 8px;border-radius:999px;background:#f0f4f7;color:#526b7b;font-size:8.5px;font-weight:800;text-transform:uppercase}.admvis-actions{display:grid;gap:7px}.admvis-actions button{border:1px solid #dce4ea;border-radius:10px;background:#fff;color:#294b61;padding:9px 10px;text-align:left;font:700 10.5px Montserrat;cursor:pointer}.admvis-actions button.pri{background:#173f5b;color:#fff;border-color:#173f5b}.admvis-back{border:0;border-radius:10px;background:#eaf0f4;color:#294a60;padding:10px 13px;font:700 10.5px Montserrat;cursor:pointer}'+
  '#adminVisualizacaoBarraEM{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:999999;display:flex;align-items:center;gap:12px;padding:10px 12px 10px 14px;border-radius:14px;background:#142f42;color:#fff;box-shadow:0 12px 34px rgba(0,0,0,.25);font:600 10.5px Montserrat}#adminVisualizacaoBarraEM strong{color:#fff}#adminVisualizacaoBarraEM button{border:0;border-radius:9px;padding:8px 10px;font:700 9.5px Montserrat;cursor:pointer}#adminVisualizacaoBarraEM .voltar{background:#fff;color:#17384e}#adminVisualizacaoBarraEM .sair{background:#294b61;color:#fff}'+
  '@media(max-width:900px){.admvis-grid{grid-template-columns:1fr 1fr}}@media(max-width:620px){#pagina-admin-visualizador{padding:16px}.admvis-grid{grid-template-columns:1fr}.admvis-head{flex-direction:column}#adminVisualizacaoBarraEM{width:calc(100% - 22px);flex-wrap:wrap}}';
  document.head.appendChild(st)
 }
 const sec=document.createElement('section');sec.id='pagina-admin-visualizador';sec.className='pagina';
 sec.innerHTML=
 '<div class="admvis-wrap"><div class="admvis-head"><div><h1>Visualizador de planos e acessos</h1><p>Acesse as experiências do portal como candidato, empresa, Premium e Conecta sem alterar a assinatura real.</p></div><button class="admvis-back" type="button" onclick="irPara(\'painel-admin\')">← Voltar ao Admin</button></div>'+
 '<div class="admvis-note"><div>◉</div><div><b>Modo de simulação administrativa</b><span>Você pode navegar pelas telas de cada perfil. Ações que alteram dados reais ficam bloqueadas durante a simulação.</span></div></div>'+
 '<div class="admvis-grid">'+
 '<article class="admvis-card"><span class="admvis-chip">Candidato</span><h3>Candidato gratuito</h3><p>Painel, currículo, candidaturas e vagas salvas.</p><div class="admvis-actions"><button class="pri" onclick="adminVisualizarComoEM(\'candidato-gratis\',\'painel-candidato\')">Abrir painel</button><button onclick="adminVisualizarComoEM(\'candidato-gratis\',\'curriculo\')">Currículo</button><button onclick="adminVisualizarComoEM(\'candidato-gratis\',\'candidaturas\')">Candidaturas</button><button onclick="adminVisualizarComoEM(\'candidato-gratis\',\'salvas\')">Vagas salvas</button></div></article>'+
 '<article class="admvis-card"><span class="admvis-chip">Premium</span><h3>Candidato Premium</h3><p>Recursos Premium e avaliação de processos seletivos.</p><div class="admvis-actions"><button class="pri" onclick="adminVisualizarComoEM(\'candidato-premium\',\'painel-candidato\')">Abrir painel Premium</button><button onclick="adminVisualizarComoEM(\'candidato-premium\',\'premium-candidato\')">Página Premium</button><button onclick="adminVisualizarComoEM(\'candidato-premium\',\'avaliar-processos\')">Avaliar processos</button></div></article>'+
 '<article class="admvis-card"><span class="admvis-chip">Empresa</span><h3>Empresa gratuita</h3><p>Painel básico, vagas e publicação no plano gratuito.</p><div class="admvis-actions"><button class="pri" onclick="adminVisualizarComoEM(\'empresa-gratis\',\'painel-empresa\')">Abrir painel</button><button onclick="adminVisualizarComoEM(\'empresa-gratis\',\'vagas-empresa\')">Minhas vagas</button><button onclick="adminVisualizarComoEM(\'empresa-gratis\',\'publicar\')">Publicar vaga</button></div></article>'+
 '<article class="admvis-card"><span class="admvis-chip">Empresa Premium</span><h3>Empresa Premium</h3><p>Indicadores, processos seletivos, candidatos e contratações.</p><div class="admvis-actions"><button class="pri" onclick="adminVisualizarComoEM(\'empresa-premium\',\'painel-empresa\')">Abrir painel Premium</button><button onclick="adminVisualizarComoEM(\'empresa-premium\',\'candidatos-empresa\')">Processos seletivos</button><button onclick="adminVisualizarComoEM(\'empresa-premium\',\'contratacoes-empresa\')">Contratações</button><button onclick="adminVisualizarComoEM(\'empresa-premium\',\'perfil-empresa\')">Minha empresa</button></div></article>'+
 '<article class="admvis-card"><span class="admvis-chip">Integração</span><h3>+Empregos Conecta</h3><p>Integração ATS, vagas sincronizadas, histórico e perfil da empresa.</p><div class="admvis-actions"><button class="pri" onclick="adminVisualizarComoEM(\'conecta\',\'painel-conecta\')">Abrir Painel Conecta</button><button onclick="irPara(\'emprego-conecta\')">Página do Conecta</button></div></article>'+
 '<article class="admvis-card"><span class="admvis-chip">Admin</span><h3>Administrador</h3><p>Volte ao ambiente administrativo real quando terminar os testes.</p><div class="admvis-actions"><button class="pri" onclick="adminRestaurarVisualizacaoEM();irPara(\'painel-admin\')">Abrir painel administrativo</button></div></article>'+
 '</div></div>';
 document.body.appendChild(sec)
}
function adminVisualizarComoEM(perfil,rota){
 if(sessionStorage.getItem('empregaMaisAdmin')!=='1'){irPara('login-admin');return}
 adminVisualizacaoSnapshotEM();sessionStorage.setItem('empregaMaisAdminVisualizacao',perfil);
 const empresas=ler('empregaMaisEmpresas',[]),candidatos=ler('empregaMaisCandidatos',[]);
 if(perfil.startsWith('empresa')||perfil==='conecta'){
  const e=empresas[0];sessionStorage.setItem('empregaMaisPapel','empresa');
  if(e){sessionStorage.setItem('empresaCnpj',e.cnpj||'');sessionStorage.setItem('empresaNome',e.nome||'Empresa')}
  sessionStorage.setItem('empregaMaisAdminPlanoSimulado',perfil==='empresa-gratis'?'basico':'anual')
 }else{
  const cand=candidatos[0];sessionStorage.setItem('empregaMaisPapel','candidato');
  if(cand){sessionStorage.setItem('candidatoEmail',cand.email||'');sessionStorage.setItem('candidatoNome',cand.nome||'Candidato')}
  if(perfil==='candidato-premium')sessionStorage.setItem('candidatoPremiumVerificadoEM','1');else sessionStorage.removeItem('candidatoPremiumVerificadoEM')
 }
 irPara(rota)
}
function atualizarBarraAdminVisualizacaoEM(){
 let b=document.getElementById('adminVisualizacaoBarraEM');
 if(!adminVisualizacaoAtivaEM()){b?.remove();return}
 if(!b){b=document.createElement('div');b.id='adminVisualizacaoBarraEM';document.body.appendChild(b)}
 const nomes={'candidato-gratis':'Candidato gratuito','candidato-premium':'Candidato Premium','empresa-gratis':'Empresa gratuita','empresa-premium':'Empresa Premium','conecta':'+Empregos Conecta'};
 b.innerHTML='<strong>Modo de visualização: '+(nomes[adminVisualizacaoPerfilEM()]||'Admin')+'</strong><button class="voltar" type="button" onclick="irPara(\'admin-visualizador\')">Visualizador</button><button class="sair" type="button" onclick="adminRestaurarVisualizacaoEM();irPara(\'painel-admin\')">Encerrar</button>'
}
function inserirAtalhoVisualizadorAdminEM(){
 if(sessionStorage.getItem('empregaMaisAdmin')!=='1')return;
 const out=document.getElementById('adminConteudo');if(!out||document.getElementById('adminVisualizadorAtalhoEM'))return;
 const b=document.createElement('button');b.id='adminVisualizadorAtalhoEM';b.type='button';b.className='btn';b.textContent='Visualizar planos e acessos';b.style.cssText='margin:0 0 16px;border:0;border-radius:10px;padding:10px 14px;background:#173f5b;color:#fff;font:700 11px Montserrat;cursor:pointer';b.onclick=()=>irPara('admin-visualizador');out.prepend(b)
}
document.addEventListener('click',function(ev){
 if(!adminVisualizacaoAtivaEM())return;
 const el=ev.target.closest('button,input[type="submit"],a');if(!el)return;
 if(el.closest('#adminVisualizacaoBarraEM')||el.closest('#pagina-admin-visualizador'))return;
 const txt=String(el.textContent||el.value||'').trim().toLowerCase();
 if(/salvar|excluir|remover|aprovar|reprovar|publicar|candidatar|contratar|encerrar|reabrir|ativar|assinar|pagar|enviar/.test(txt)){
  ev.preventDefault();ev.stopImmediatePropagation();alert('Modo de visualização administrativa: esta ação foi bloqueada para não alterar dados reais.')
 }
},true);
window.adminVisualizarComoEM=adminVisualizarComoEM;window.adminRestaurarVisualizacaoEM=adminRestaurarVisualizacaoEM;


/* EMPREGAMAI-TEMA-EMPRESA-AZUL-LARANJA-GLOBAL-V1 */
function garantirTemaEmpresaAzulLaranjaEM(){
 if(!document.getElementById('fonteInterEmpresaGlobalEM')){
  const l=document.createElement('link');l.id='fonteInterEmpresaGlobalEM';l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(l)
 }
 document.getElementById('estiloTemaEmpresaGlobalEM')?.remove();
 const st=document.createElement('style');st.id='estiloTemaEmpresaGlobalEM';
 st.textContent=
 ':root{--emp-blue:#0E5FD8;--emp-blue-dark:#0B3475;--emp-blue-soft:#EAF3FF;--emp-orange:#FF6B17;--emp-orange-soft:#FFF0E5;--emp-bg:#F4F8FD;--emp-card:#FFFFFF;--emp-text:#174D96;--emp-muted:#6D7D96;--emp-line:#DCE7F4}'+
 '#pagina-painel-empresa,#pagina-vagas-empresa,#pagina-candidatos-empresa,#pagina-contratacoes-empresa,#pagina-perfil-empresa,#pagina-publicar,#pagina-central-empresa,#pagina-painel-conecta{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;background:var(--emp-bg)!important;color:var(--emp-text)!important}'+
 '#pagina-painel-empresa *,#pagina-vagas-empresa *,#pagina-candidatos-empresa *,#pagina-contratacoes-empresa *,#pagina-perfil-empresa *,#pagina-publicar *,#pagina-central-empresa *,#pagina-painel-conecta *{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}'+
 '#pagina-vagas-empresa h1,#pagina-vagas-empresa h2,#pagina-candidatos-empresa h1,#pagina-candidatos-empresa h2,#pagina-contratacoes-empresa h1,#pagina-contratacoes-empresa h2,#pagina-perfil-empresa h1,#pagina-perfil-empresa h2,#pagina-publicar h1,#pagina-publicar h2,#pagina-central-empresa h1,#pagina-central-empresa h2,#pagina-painel-conecta h1,#pagina-painel-conecta h2{color:var(--emp-blue-dark)!important;letter-spacing:-.35px!important}'+
 '#pagina-vagas-empresa p,#pagina-candidatos-empresa p,#pagina-contratacoes-empresa p,#pagina-perfil-empresa p,#pagina-publicar p,#pagina-central-empresa p,#pagina-painel-conecta p{color:var(--emp-muted)!important}'+
 '#pagina-vagas-empresa .card,#pagina-vagas-empresa article,#pagina-candidatos-empresa .card,#pagina-candidatos-empresa article,#pagina-contratacoes-empresa .card,#pagina-contratacoes-empresa article,#pagina-perfil-empresa .card,#pagina-perfil-empresa article,#pagina-publicar .card,#pagina-publicar article,#pagina-central-empresa .card,#pagina-central-empresa article,#pagina-painel-conecta .conecta-card{border-color:var(--emp-line)!important;box-shadow:0 8px 22px rgba(18,64,125,.045)!important}'+
 '#pagina-vagas-empresa button,#pagina-candidatos-empresa button,#pagina-contratacoes-empresa button,#pagina-perfil-empresa button,#pagina-publicar button,#pagina-central-empresa button,#pagina-painel-conecta button{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}'+
 '#pagina-vagas-empresa .btn-primary,#pagina-vagas-empresa .primary,#pagina-vagas-empresa button[type="submit"],#pagina-candidatos-empresa .btn-primary,#pagina-candidatos-empresa .primary,#pagina-candidatos-empresa button[type="submit"],#pagina-contratacoes-empresa .btn-primary,#pagina-contratacoes-empresa .primary,#pagina-contratacoes-empresa button[type="submit"],#pagina-perfil-empresa .btn-primary,#pagina-perfil-empresa .primary,#pagina-perfil-empresa button[type="submit"],#pagina-publicar .btn-primary,#pagina-publicar .primary,#pagina-publicar button[type="submit"],#pagina-central-empresa .btn-primary,#pagina-central-empresa .primary,#pagina-central-empresa button[type="submit"]{background:linear-gradient(135deg,#FF7A1A,#FF5A08)!important;color:#fff!important;border-color:transparent!important;box-shadow:0 8px 18px rgba(255,94,10,.18)!important}'+
 '#pagina-vagas-empresa input,#pagina-vagas-empresa select,#pagina-vagas-empresa textarea,#pagina-candidatos-empresa input,#pagina-candidatos-empresa select,#pagina-candidatos-empresa textarea,#pagina-contratacoes-empresa input,#pagina-contratacoes-empresa select,#pagina-perfil-empresa input,#pagina-perfil-empresa select,#pagina-perfil-empresa textarea,#pagina-publicar input,#pagina-publicar select,#pagina-publicar textarea,#pagina-central-empresa input,#pagina-central-empresa select,#pagina-central-empresa textarea,#pagina-painel-conecta input,#pagina-painel-conecta select,#pagina-painel-conecta textarea{border-color:#D6E4F4!important;background:#fff!important;color:#223B5E!important;box-shadow:none!important}'+
 '#pagina-vagas-empresa input:focus,#pagina-vagas-empresa select:focus,#pagina-candidatos-empresa input:focus,#pagina-candidatos-empresa select:focus,#pagina-perfil-empresa input:focus,#pagina-perfil-empresa textarea:focus,#pagina-publicar input:focus,#pagina-publicar select:focus,#pagina-publicar textarea:focus,#pagina-painel-conecta input:focus,#pagina-painel-conecta select:focus{border-color:#75A9EA!important;outline:3px solid rgba(14,95,216,.08)!important}'+

 /* Minhas vagas */
 '#pagina-vagas-empresa .evp-summary article{background:#fff!important;border:1px solid var(--emp-line)!important;border-radius:16px!important;box-shadow:0 8px 22px rgba(18,64,125,.04)!important}'+
 '#pagina-vagas-empresa .evp-summary article span{color:#6B7E99!important}#pagina-vagas-empresa .evp-summary article strong{color:var(--emp-blue-dark)!important}#pagina-vagas-empresa .evp-summary article:nth-child(3) strong,#pagina-vagas-empresa .evp-summary article:nth-child(4) strong{color:#D95A13!important}'+
 '#pagina-vagas-empresa .evp-board{background:#fff!important;border:1px solid var(--emp-line)!important;border-radius:18px!important;box-shadow:0 10px 24px rgba(22,67,125,.035)!important}'+
 '#pagina-vagas-empresa .evp-vaga{border-color:#EDF2F7!important}#pagina-vagas-empresa .evp-vaga:hover{background:#F7FBFF!important}'+
 '#pagina-vagas-empresa .evp-title strong{color:#174D96!important}#pagina-vagas-empresa .evp-actions .manage{background:var(--emp-blue)!important;color:#fff!important;border-color:var(--emp-blue)!important}#pagina-vagas-empresa .evp-actions .edit{background:var(--emp-orange-soft)!important;color:#C95715!important;border-color:#FFD5BC!important}'+

 /* Candidatos/processos */
 '#pagina-candidatos-empresa .processo-card,#pagina-candidatos-empresa .recruta-cand-card,#pagina-candidatos-empresa .recruta-vaga-card,#pagina-candidatos-empresa .central-processos-card{background:#fff!important;border:1px solid var(--emp-line)!important;border-radius:16px!important;box-shadow:0 8px 22px rgba(18,64,125,.04)!important}'+
 '#pagina-candidatos-empresa .recruta-cand-card{border-left:4px solid var(--emp-blue)!important}#pagina-candidatos-empresa .recruta-cand-card.aprovado,#pagina-candidatos-empresa .recruta-cand-card.contratado{border-left-color:#2BAE75!important}'+
 '#pagina-candidatos-empresa .recruta-cand-card h3,#pagina-candidatos-empresa .processo-card h3{color:#174D96!important}'+
 '#pagina-candidatos-empresa .recruta-cand-card button,#pagina-candidatos-empresa .processo-card button{border-radius:9px!important}'+
 '#pagina-candidatos-empresa .recruta-cand-card .btn-aprovar{background:#E7F7EF!important;color:#237355!important;border-color:#CDEBDB!important}#pagina-candidatos-empresa .recruta-cand-card .btn-reprovar{background:#FFF1ED!important;color:#C34E31!important;border-color:#F6D7CF!important}'+

 /* Contratacoes */
 '#pagina-contratacoes-empresa .contratacao-card,#pagina-contratacoes-empresa .contratacoes-card{background:#fff!important;border:1px solid var(--emp-line)!important;border-radius:16px!important;box-shadow:0 8px 22px rgba(18,64,125,.04)!important}'+

 /* Perfil empresa */
 '#pagina-perfil-empresa .perfil-empresa-card,#pagina-perfil-empresa .empresa-perfil-card,#pagina-perfil-empresa .painel-card{background:#fff!important;border:1px solid var(--emp-line)!important;border-radius:16px!important;box-shadow:0 8px 22px rgba(18,64,125,.04)!important}'+
 '#pagina-perfil-empresa label{color:#36577F!important;font-weight:650!important}'+

 /* Publicar vaga */
 '#pagina-publicar .form-section,#pagina-publicar .vaga-etapa,#pagina-publicar .publicar-card,#pagina-publicar .bloco-form{background:#fff!important;border-color:var(--emp-line)!important;border-radius:16px!important;box-shadow:0 8px 22px rgba(18,64,125,.035)!important}'+
 '#pagina-publicar .opcao-card.selecionado,#pagina-publicar .beneficio-card.selecionado{border-color:var(--emp-blue)!important;background:var(--emp-blue-soft)!important}'+
 '#pagina-publicar .opcao-card:hover,#pagina-publicar .beneficio-card:hover{border-color:#AFCBED!important}'+

 /* Conecta: paleta oficial roxo + azul petróleo + lilás + branco quente + menta */
 '#pagina-painel-conecta{--conecta-roxo:#6F2DBD!important;--conecta-roxo-escuro:#5B1FA6!important;--conecta-petroleo:#183B56!important;--conecta-petroleo-2:#2C5877!important;--conecta-lilas:#F5EEFC!important;--conecta-lilas-2:#EFE5FA!important;--conecta-bg:#FCFAFE!important;--conecta-muted:#786D86!important;--conecta-menta:#DDF5EA!important;--conecta-verde:#1E8E5A!important;background:var(--conecta-bg)!important;color:var(--conecta-petroleo)!important;font-family:Montserrat,Arial,sans-serif!important}'+
 '#pagina-painel-conecta *{font-family:Montserrat,Arial,sans-serif!important}'+
 '#pagina-painel-conecta .conecta-side{background:#5B1FA6!important;color:#fff!important}'+
 '#pagina-painel-conecta .conecta-side *{color:inherit}'+
 '#pagina-painel-conecta .conecta-brand-site>small{color:rgba(255,255,255,.72)!important}'+
 '#pagina-painel-conecta .conecta-brand-logo span{color:#2F80ED!important}'+
 '#pagina-painel-conecta .conecta-brand-logo strong{color:#123B6D!important}'+
 '#pagina-painel-conecta .conecta-side-company-logo{color:#5B1FA6!important;background:#fff!important}'+
 '#pagina-painel-conecta .conecta-nav button.ativo .conecta-nav-ico{color:#5B1FA6!important;background:#fff!important;border-color:#fff!important}'+
 '#pagina-painel-conecta .conecta-nav button.ativo .conecta-nav-ico svg{stroke:#5B1FA6!important}'+
 '#pagina-painel-conecta .conecta-brand b{color:#EAD8FF!important}'+
 '#pagina-painel-conecta .conecta-brand strong{white-space:nowrap!important;font-size:21px!important;letter-spacing:-.55px!important}'+
 '#pagina-painel-conecta .conecta-nav button{color:rgba(255,255,255,.9)!important}'+
 '#pagina-painel-conecta .conecta-nav button.ativo,#pagina-painel-conecta .conecta-nav button:hover{background:rgba(255,255,255,.14)!important;color:#fff!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)!important}'+
 '#pagina-painel-conecta .conecta-top h1,#pagina-painel-conecta h1,#pagina-painel-conecta h2,#pagina-painel-conecta .conecta-card-head h3,#pagina-painel-conecta .conecta-plans-hero h3,#pagina-painel-conecta .conecta-plan-name{color:var(--conecta-petroleo)!important}'+
 '#pagina-painel-conecta .conecta-top p,#pagina-painel-conecta .conecta-card-head p,#pagina-painel-conecta .conecta-plan-desc,#pagina-painel-conecta .conecta-plan-note{color:var(--conecta-muted)!important}'+
 '#pagina-painel-conecta .conecta-btn.sec{background:var(--conecta-lilas)!important;color:var(--conecta-roxo-escuro)!important}'+
 '#pagina-painel-conecta .conecta-btn.pri{background:linear-gradient(135deg,#6F2DBD,#5B1FA6)!important;color:#fff!important;box-shadow:0 8px 20px rgba(111,45,189,.19)!important}'+
 '#pagina-painel-conecta .conecta-hero{background:linear-gradient(135deg,#6F2DBD 0%,#5B1FA6 58%,#183B56 100%)!important;color:#fff!important}'+
 '#pagina-painel-conecta .conecta-hero h2,#pagina-painel-conecta .conecta-hero h3,#pagina-painel-conecta .conecta-hero p,#pagina-painel-conecta .conecta-hero strong,#pagina-painel-conecta .conecta-hero b,#pagina-painel-conecta .conecta-hero small,#pagina-painel-conecta .conecta-hero span{color:#fff!important}'+
 '#pagina-painel-conecta .conecta-kpi{background:#fff!important;border-color:#E7DDF3!important;box-shadow:0 8px 22px rgba(24,59,86,.055)!important}'+
 '#pagina-painel-conecta .conecta-kpi span,#pagina-painel-conecta .conecta-kpi small{color:var(--conecta-muted)!important}'+
 '#pagina-painel-conecta .conecta-kpi strong{color:var(--conecta-petroleo)!important}'+
 '#pagina-painel-conecta .conecta-card{border-color:#E7DDF3!important;box-shadow:0 8px 22px rgba(24,59,86,.045)!important}'+
 '#pagina-painel-conecta .conecta-integracao-icon{background:linear-gradient(135deg,#6F2DBD,#5B1FA6)!important}'+
 '#pagina-painel-conecta .conecta-integracao-status{background:var(--conecta-menta)!important;color:var(--conecta-verde)!important}'+
 '#pagina-painel-conecta .conecta-form-section-title i{background:var(--conecta-lilas)!important;color:var(--conecta-roxo-escuro)!important}'+
 '#pagina-painel-conecta .conecta-opcional-badge{background:var(--conecta-lilas)!important;color:var(--conecta-roxo-escuro)!important}'+
 '#pagina-painel-conecta .conecta-integracao-card .conecta-field label{color:var(--conecta-petroleo)!important;font-weight:850!important}'+
 '#pagina-painel-conecta input,#pagina-painel-conecta select,#pagina-painel-conecta textarea{border-color:#DED4E8!important;color:#243A4C!important;background:#fff!important}'+
 '#pagina-painel-conecta input:focus,#pagina-painel-conecta select:focus,#pagina-painel-conecta textarea:focus{border-color:#7F4BC3!important;outline:3px solid rgba(111,45,189,.08)!important}'+
 '#pagina-painel-conecta .conecta-sistema-info{background:linear-gradient(90deg,#F5EEFC,#fff)!important;border-color:#E4D9EE!important}'+
 '#pagina-painel-conecta .conecta-sistema-info strong{color:var(--conecta-petroleo)!important}'+
 '#pagina-painel-conecta .conecta-sistema-info:after{background:var(--conecta-menta)!important;color:var(--conecta-verde)!important}'+
 '#pagina-painel-conecta .conecta-plans-hero{background:linear-gradient(135deg,#fff 0%,#F5EEFC 72%,#F0F7FA 100%)!important;border-color:#E7DDF3!important}'+
 '#pagina-painel-conecta .conecta-plans-trial{border-color:#DDE7EC!important;background:#fff!important}'+
 '#pagina-painel-conecta .conecta-plans-trial small{color:var(--conecta-petroleo-2)!important}'+
 '#pagina-painel-conecta .conecta-plans-trial strong{color:var(--conecta-roxo)!important}'+
 '#pagina-painel-conecta .conecta-plans-launch{background:linear-gradient(90deg,#6F2DBD 0%,#5B1FA6 58%,#2C5877 100%)!important;color:#fff!important;box-shadow:0 10px 24px rgba(79,38,126,.18)!important}'+
 '#pagina-painel-conecta .conecta-plans-launch b,#pagina-painel-conecta .conecta-plans-launch span{color:#fff!important}'+
 '#pagina-painel-conecta .conecta-plan-card{border-color:#E7DDF3!important;box-shadow:0 10px 26px rgba(24,59,86,.05)!important}'+
 '#pagina-painel-conecta .conecta-plan-card:hover{border-color:#BDA9D2!important;box-shadow:0 15px 34px rgba(24,59,86,.09)!important}'+
 '#pagina-painel-conecta .conecta-plan-card.recomendado{border-color:#6F2DBD!important;box-shadow:0 16px 36px rgba(111,45,189,.13)!important}'+
 '#pagina-painel-conecta .conecta-plan-badge{background:var(--conecta-petroleo)!important;color:#fff!important}'+
 '#pagina-painel-conecta .conecta-plan-price{color:var(--conecta-petroleo)!important}'+
 '#pagina-painel-conecta .conecta-plan-price strong{color:var(--conecta-roxo)!important}'+
 '#pagina-painel-conecta .conecta-plan-list{border-color:#EAE2F0!important}'+
 '#pagina-painel-conecta .conecta-plan-list span{color:#506475!important}'+
 '#pagina-painel-conecta .conecta-plan-list span b{color:var(--conecta-verde)!important}'+
 '#pagina-painel-conecta .conecta-plan-status{border-color:#DDE7EC!important;background:linear-gradient(90deg,#fff,#F7FBFC)!important}'+
 '#pagina-painel-conecta .conecta-plan-status strong{color:var(--conecta-petroleo)!important}'+
 '#pagina-painel-conecta .conecta-status.ok,#pagina-painel-conecta .conecta-next-state{background:var(--conecta-menta)!important;color:var(--conecta-verde)!important}'+
 '#pagina-painel-conecta .conecta-card-head button,#pagina-painel-conecta .conecta-job-select button{background:var(--conecta-lilas)!important;color:var(--conecta-roxo-escuro)!important}'+
 '#pagina-painel-conecta .conecta-profile-preview-cover{background:linear-gradient(135deg,#6F2DBD,#183B56)!important}'+
'#pagina-painel-conecta .conecta-hero{background:linear-gradient(135deg,#FFFFFF 0%,#FBF8FE 58%,#F1E8FB 100%)!important;border:1px solid #E6DAF0!important;box-shadow:0 16px 38px rgba(24,59,86,.08)!important;color:var(--conecta-petroleo)!important;padding:27px 28px!important}'+
'#pagina-painel-conecta .conecta-hero:before{height:4px!important;background:linear-gradient(90deg,#6F2DBD 0%,#9E6ED6 55%,#55D995 100%)!important;box-shadow:none!important}'+
'#pagina-painel-conecta .conecta-hero h2,#pagina-painel-conecta .conecta-hero h3,#pagina-painel-conecta .conecta-hero strong,#pagina-painel-conecta .conecta-hero b{color:var(--conecta-petroleo)!important}'+
'#pagina-painel-conecta .conecta-hero p{color:#5F7080!important;font-size:13px!important;line-height:1.65!important}'+
'#pagina-painel-conecta .conecta-hero-kicker{color:var(--conecta-roxo-escuro)!important;font-size:10px!important;letter-spacing:.12em!important}'+
'#pagina-painel-conecta .conecta-dot{background:#42BF7D!important;box-shadow:0 0 0 5px #DDF5EA!important}'+
'#pagina-painel-conecta .conecta-hero-health{gap:9px!important;margin-top:17px!important}'+
'#pagina-painel-conecta .conecta-hero-health span{background:#fff!important;border:1px solid #E4D9ED!important;color:#536878!important;padding:8px 10px!important;box-shadow:0 4px 12px rgba(24,59,86,.035)!important}'+
'#pagina-painel-conecta .conecta-hero-health i{background:#43BD7B!important;box-shadow:0 0 0 4px #E5F7ED!important}'+
'#pagina-painel-conecta .conecta-source{background:#fff!important;border:1px solid #E1D5EA!important;color:var(--conecta-petroleo)!important;border-radius:17px!important;padding:17px 18px!important;box-shadow:0 10px 24px rgba(24,59,86,.055)!important}'+
'#pagina-painel-conecta .conecta-source small{color:#8B7C95!important;font-size:9.5px!important;font-weight:800!important}'+
'#pagina-painel-conecta .conecta-source strong{color:var(--conecta-petroleo)!important;font-size:12.5px!important}'+
'#pagina-painel-conecta .conecta-source span{color:#71808E!important;font-size:10.5px!important}'+
'#pagina-painel-conecta .conecta-source-status{background:var(--conecta-menta)!important;color:var(--conecta-verde)!important;border:1px solid #CAEBD9!important}'+
'#pagina-painel-conecta .conecta-next{border:1px solid #E3D9EB!important;border-left:4px solid #6F2DBD!important;border-radius:18px!important;background:#fff!important;box-shadow:0 12px 30px rgba(24,59,86,.055)!important;padding:20px 22px!important}'+
'#pagina-painel-conecta .conecta-next-kicker{color:var(--conecta-petroleo-2)!important;font-size:10px!important}'+
'#pagina-painel-conecta .conecta-next h3{color:var(--conecta-petroleo)!important;font-size:16px!important}'+
'#pagina-painel-conecta .conecta-next p{color:#637687!important;font-size:11.5px!important}'+
'#pagina-painel-conecta .conecta-next-meta span{background:#F6F1FA!important;color:#607181!important;border:1px solid #ECE3F2!important;padding:6px 9px!important}'+
'#pagina-painel-conecta .conecta-next-note{color:#8794A0!important;font-size:10px!important}'+
'#pagina-painel-conecta .conecta-kpis{gap:12px!important;margin:16px 0!important}'+
'#pagina-painel-conecta .conecta-kpi{position:relative!important;overflow:hidden!important;border:1px solid #E4DCEB!important;border-radius:17px!important;padding:18px 18px 17px!important;background:#fff!important;box-shadow:0 8px 22px rgba(24,59,86,.045)!important;transition:.18s ease!important}'+
'#pagina-painel-conecta .conecta-kpi:before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,#6F2DBD,#A777DA)}'+
'#pagina-painel-conecta .conecta-kpi:nth-child(2):before{background:linear-gradient(180deg,#2C5877,#6D9CB8)}#pagina-painel-conecta .conecta-kpi:nth-child(3):before{background:linear-gradient(180deg,#D99A32,#F0C46B)}#pagina-painel-conecta .conecta-kpi:nth-child(4):before{background:linear-gradient(180deg,#4AAE7C,#7CD0A5)}'+
'#pagina-painel-conecta .conecta-kpi span{color:#657887!important;font-size:10px!important;font-weight:800!important}'+
'#pagina-painel-conecta .conecta-kpi strong{color:var(--conecta-petroleo)!important;font-size:29px!important;margin:8px 0 4px!important}'+
'#pagina-painel-conecta .conecta-kpi small{color:#8796A2!important;font-size:10.5px!important;line-height:1.4!important}'+
'#pagina-painel-conecta .conecta-kpi.clickable:hover{transform:translateY(-2px)!important;border-color:#CDBBDD!important;box-shadow:0 13px 28px rgba(24,59,86,.08)!important}'+
'#pagina-painel-conecta .conecta-grid{gap:18px!important;margin-top:18px!important}'+
'#pagina-painel-conecta .conecta-card{border:1px solid #E4DCEB!important;border-radius:18px!important;background:#fff!important;box-shadow:0 10px 28px rgba(24,59,86,.045)!important}'+
'#pagina-painel-conecta .conecta-card-head h3{color:var(--conecta-petroleo)!important;font-size:16px!important}'+
'#pagina-painel-conecta .conecta-card-head p{color:#778895!important;font-size:11px!important}'+
'#pagina-painel-conecta .conecta-health{background:#F8FAFB!important;border:1px solid #E8EEF1!important;border-radius:13px!important;padding:13px!important}'+
'#pagina-painel-conecta .conecta-health strong{color:var(--conecta-petroleo)!important;font-size:11.5px!important}'+
'#pagina-painel-conecta .conecta-health small{color:#7F8D99!important;font-size:10px!important}'+
'@media(max-width:900px){#pagina-painel-conecta .conecta-hero{grid-template-columns:1fr!important}#pagina-painel-conecta .conecta-grid{grid-template-columns:1fr!important}}'+
'@media(max-width:620px){#pagina-painel-conecta .conecta-hero{padding:20px!important}#pagina-painel-conecta .conecta-hero h2{font-size:21px!important}#pagina-painel-conecta .conecta-kpi strong{font-size:25px!important}}'+

 '@media(max-width:700px){#pagina-vagas-empresa .evp-summary{grid-template-columns:1fr 1fr!important}#pagina-candidatos-empresa .recruta-cand-card{border-left-width:3px!important}}';
 document.head.appendChild(st)
}
/* EMPREGAMAI-CANDIDATO-LOGIN-PAGINA-GUARD-V1 */
function garantirLoginCandidatoEM(){
 if(document.getElementById('pagina-login-candidato'))return;
 if(!document.getElementById('estiloLoginCandidatoGuardEM')){
  const st=document.createElement('style');st.id='estiloLoginCandidatoGuardEM';
  st.textContent=
  '#pagina-login-candidato{font-family:Montserrat,Arial,sans-serif;background:#f5faff;min-height:calc(100vh - 76px);padding:38px 18px;color:#173f61}'+
  '#pagina-login-candidato *{box-sizing:border-box}.cand-login-shell-em{width:min(1080px,100%);margin:0 auto;display:grid;grid-template-columns:minmax(0,.9fr) minmax(380px,.7fr);background:#fff;border:1px solid #d8eaf6;border-radius:24px;overflow:hidden;box-shadow:0 20px 55px rgba(31,104,150,.10)}'+
  '.cand-login-brand-em{padding:52px 48px;background:linear-gradient(145deg,#eaf6ff 0%,#dcefff 100%);display:flex;flex-direction:column;justify-content:center}.cand-login-brand-em small{font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#2588cc}.cand-login-brand-em h1{margin:10px 0 12px;font-size:38px;line-height:1.08;letter-spacing:-1px;color:#123d63}.cand-login-brand-em p{margin:0;color:#5d7b91;font-size:14px;line-height:1.7}.cand-login-points-em{display:grid;gap:11px;margin-top:28px}.cand-login-points-em span{display:flex;align-items:center;gap:10px;color:#315b78;font-size:12px;font-weight:650}.cand-login-points-em i{width:27px;height:27px;border-radius:9px;background:#fff;color:#1986cd;display:grid;place-items:center;font-style:normal;box-shadow:0 3px 9px rgba(31,110,163,.08)}'+
  '.cand-login-form-side-em{padding:46px 42px;display:flex;align-items:center}.cand-login-card-em{width:100%}.cand-login-back-em{border:0;background:transparent;color:#66859a;font:700 11px Montserrat;cursor:pointer;padding:0;margin-bottom:28px}.cand-login-card-em>span{display:block;color:#2588cc;font-size:10px;font-weight:800;letter-spacing:.11em;text-transform:uppercase}.cand-login-card-em h2{margin:8px 0 7px;color:#173f61;font-size:29px}.cand-login-card-em>p{margin:0 0 24px;color:#6b8496;font-size:12.5px;line-height:1.55}.cand-login-form-em{display:grid;gap:14px}.cand-login-field-em label{display:block;margin-bottom:7px;color:#315b78;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.045em}.cand-login-field-em input{width:100%;height:50px;border:1px solid #cfe2ef;border-radius:12px;background:#fff;padding:0 14px;color:#203f55;font:500 14px Montserrat;outline:none}.cand-login-field-em input:focus{border-color:#299be4;box-shadow:0 0 0 4px rgba(41,155,228,.09)}.cand-login-submit-em{height:50px;border:0;border-radius:12px;background:#299be4;color:#fff;font:800 13px Montserrat;cursor:pointer;box-shadow:0 9px 22px rgba(41,155,228,.20)}.cand-login-msg-em{min-height:18px;color:#b14555;font-size:11px}.cand-login-create-em{margin-top:18px;padding-top:17px;border-top:1px solid #e6eff5;color:#6c8495;font-size:11px}.cand-login-create-em button{border:0;background:transparent;color:#1685ca;font:800 11px Montserrat;cursor:pointer;padding:0}'+
  '@media(max-width:780px){#pagina-login-candidato{padding:16px 10px}.cand-login-shell-em{grid-template-columns:1fr}.cand-login-brand-em{padding:28px 24px}.cand-login-brand-em h1{font-size:29px}.cand-login-form-side-em{padding:28px 22px}}';
  document.head.appendChild(st)
 }
 const sec=document.createElement('section');sec.id='pagina-login-candidato';sec.className='pagina';
 sec.innerHTML='<div class="cand-login-shell-em"><aside class="cand-login-brand-em"><small>Área do candidato</small><h1>Entre e continue sua jornada profissional.</h1><p>Acesse seu currículo, candidaturas, vagas salvas e oportunidades recomendadas em um só lugar.</p><div class="cand-login-points-em"><span><i>✓</i> Acompanhe suas candidaturas</span><span><i>▣</i> Mantenha seu currículo atualizado</span><span><i>♡</i> Salve oportunidades para ver depois</span></div></aside><main class="cand-login-form-side-em"><div class="cand-login-card-em"><button class="cand-login-back-em" type="button" onclick="irPara(\'home\')">← Voltar para vagas</button><span>Acesso do candidato</span><h2>Entrar na sua conta</h2><p>Use o e-mail e a senha cadastrados no +Empregos.</p><form id="formLoginCandidato" class="cand-login-form-em"><div class="cand-login-field-em"><label>E-mail</label><input id="loginCandEmail" type="email" autocomplete="email" placeholder="seuemail@exemplo.com" required></div><div class="cand-login-field-em"><label>Senha</label><input id="loginCandSenha" type="password" autocomplete="current-password" placeholder="Sua senha" required></div><button class="cand-login-submit-em" type="submit">Entrar</button><div id="msgLoginCandidato" class="cand-login-msg-em"></div></form><div class="cand-login-create-em">Ainda não tem conta? <button type="button" onclick="irPara(\'cadastro-candidato\')">Criar currículo grátis</button></div></div></main></div>';
 const ref=document.getElementById('pagina-home')||document.querySelector('.pagina'),host=ref?.parentElement||document.body;
 const footer=[...host.children].find(x=>x.tagName==='FOOTER'||x.id==='footer'||x.id==='rodape'||x.classList?.contains('site-footer')||x.classList?.contains('rodape'));
 if(footer)host.insertBefore(sec,footer);else host.appendChild(sec)
}
window.garantirLoginCandidatoEM=garantirLoginCandidatoEM;

function abrirRota(p){garantirEstiloTextoVagaEM();setTimeout(removerAnunciarVagaGratisHeaderEM,30);const solicitada=p;if(p==='admin-visualizador'&&sessionStorage.getItem('empregaMaisAdmin')!=='1')p='login-admin';if(p==='admin-visualizador')garantirAdminVisualizadorEM();if(p==='painel-empresa'&&papelAtual()!=='empresa')p='login-empresa';if(p==='painel-conecta'&&papelAtual()!=='empresa')p='login-conecta';if(p==='painel-candidato'&&papelAtual()!=='candidato')p='login-candidato';if(p==='perfil-empresa'&&papelAtual()!=='empresa')p='login-empresa';if(p==='painel-admin'&&sessionStorage.getItem('empregaMaisAdmin')!=='1')p='login-admin';if(p==='publicar'&&papelAtual()!=='empresa')p='login-empresa';if(p==='candidatos-empresa'&&papelAtual()!=='empresa')p='login-empresa';if(p==='contratacoes-empresa'&&papelAtual()!=='empresa')p='login-empresa';if(p==='candidaturas'&&papelAtual()!=='candidato')p='login-candidato';if((p==='curriculo'||p==='salvas'||p==='perfil-candidato'||p==='premium-candidato'||p==='avaliar-processos')&&papelAtual()!=='candidato')p='login-candidato';if(p==='candidatar'&&papelAtual()!=='candidato')p='login-candidato';if(p!==solicitada){const url=p==='home'?location.pathname:location.pathname+'?pagina='+encodeURIComponent(p);history.replaceState({},'',url)}if(p==='login-candidato')garantirLoginCandidatoEM();if(p==='login-conecta')garantirLoginConectaEM();if(p==='cadastro-conecta')garantirCadastroConectaEM();if(p==='painel-conecta')garantirPainelConectaEM();mostrarPagina(p||'home');if(['painel-empresa','vagas-empresa','candidatos-empresa','contratacoes-empresa','perfil-empresa','publicar','central-empresa','painel-conecta'].includes(p))setTimeout(garantirTemaEmpresaAzulLaranjaEM,0);setTimeout(atualizarBarraAdminVisualizacaoEM,10);if(p==='login-empresa'||p==='login-candidato'){[0,80,250,700].forEach(ms=>setTimeout(aplicarAbaConectaLoginEM,ms));}setTimeout(atualizarLauncherConectaEM,20);setTimeout(garantirAcessoConectaHeaderEM,40);if(p==='cadastro-empresa')setTimeout(()=>{try{reformularCadastroEmpresaProEM()}catch(e){console.error('Cadastro empresa Pro:',e)}},0);if(p==='publicar')setTimeout(prepararPublicacao,0);if(p==='vagas-empresa')setTimeout(()=>{if(typeof window.renderVagasEmpresaPaginaEM==='function')window.renderVagasEmpresaPaginaEM()},0);if(p==='candidatos-empresa')setTimeout(()=>{if(sessionStorage.getItem('vagaCandidatosSelecionada'))renderizarCandidatosEmpresa();else if(typeof window.renderCentralProcessosEmpresaEM==='function')window.renderCentralProcessosEmpresaEM();},0);if(p==='contratacoes-empresa')setTimeout(()=>{if(typeof window.renderContratacoesEmpresaEM==='function')window.renderContratacoesEmpresaEM()},0);if(p==='candidaturas')setTimeout(async()=>{try{await sbCarregarCandidaturasEM(false)}catch(e){console.warn('Sincronização candidaturas candidato:',e)}renderizarCandidaturasCandidato()},0);if(p==='perfil-candidato')setTimeout(carregarPerfilCandidato,0);if(p==='curriculo')setTimeout(async()=>{try{await sincronizarCandidatoLogadoSupabaseEM()}catch(e){console.warn('Sincronização currículo:',e)}renderizarCurriculo();configurarUploadCurriculo();carregarCurriculoOnlineEM()},0);if(p==='salvas')setTimeout(renderizarSalvas,0);if(p==='senior')setTimeout(renderizarVagasSenior,0);if(p==='perfil-empresa')setTimeout(()=>{carregarPerfilEmpresa();mostrarPerfilEmpresaNormalEM()},0);if(p==='central-empresa')setTimeout(renderCentralEmpresaEM,0);if(p==='empresa-publica')setTimeout(renderizarEmpresaPublica,0);if(p==='painel-admin')setTimeout(async()=>{await adminAba('geral');inserirAtalhoVisualizadorAdminEM()},0);if(p==='home')setTimeout(async()=>{await sincronizarAvaliacoesEmpresasSupabaseEM();renderizarVagasPortal()},0);if(p==='como-funciona'){[60,250,700,1400].forEach(ms=>setTimeout(aplicarAbaConectaComoFuncionaEM,ms));}if(p==='emprego-conecta')setTimeout(()=>{aplicarMensagemComercialConectaEM();if(typeof window.irConectaRhSlideEM==='function')window.irConectaRhSlideEM(0)},80);if(p==='painel-conecta')setTimeout(async()=>{normalizarOrdemPainelConectaEM();await renderPainelConectaEM();iniciarAutoRefreshConectaEM();atualizarLauncherConectaEM()},0);else pararAutoRefreshConectaEM();if(p==='planos')setTimeout(renderizarPlanosModeloB,0);if(p==='plano-detalhe')setTimeout(renderizarDetalhesPlano,0);if(p==='vaga')setTimeout(()=>sincronizarCandidatoLogadoSupabaseEM().finally(renderizarVagaDetalhe),0);if(p==='candidatar')setTimeout(()=>sincronizarCandidatoLogadoSupabaseEM().finally(prepararCandidatura),0);if(p==='painel-empresa'){document.getElementById('empConectaLauncherEM')?.remove();document.getElementById('empConectaMenuEM')?.remove();setTimeout(renderizarPainelEmpresa,0)}if(p==='premium-candidato')setTimeout(atualizarPremiumCandidatoEM,0);if(p==='avaliar-processos')setTimeout(renderizarAvaliacoesProcessosEM,0);if(p==='painel-candidato'){setTimeout(atualizarPainelCandidato,0);const e=$('#candidatoSaudacao');if(e)e.textContent='Olá, '+(sessionStorage.getItem('candidatoNome')||'candidato')+'. Acompanhe sua jornada profissional.'}}
function atualizarPremiumCandidatoEM(){const c=candidatoLogado(),ativo=candidatoPremiumAtivoEM(c),pag=document.getElementById('pagina-premium-candidato');if(!pag)return;pag.classList.toggle('premium-ativo',ativo);pag.querySelectorAll('.premium-comparativo-card.premium').forEach(el=>el.classList.toggle('plano-ativo',ativo));const btn=pag.querySelector('.premium-comparativo-card.premium button');if(btn){btn.textContent=ativo?'Premium ativo':'Conhecer planos Premium';btn.disabled=ativo}}
function assinarPremiumCandidatoEM(periodo='mensal'){const opcoes={mensal:{nome:'Premium Mensal',valor:29.90},trimestral:{nome:'Premium Trimestral',valor:79.90},semestral:{nome:'Premium Semestral',valor:149.90}},pl=opcoes[periodo]||opcoes.mensal,cs=ler('empregaMaisCandidatos'),email=sessionStorage.getItem('candidatoEmail')||'',i=cs.findIndex(x=>String(x.email||'').toLowerCase()===email.toLowerCase());if(i<0){alert('Entre na sua conta de candidato para assinar o Premium.');irPara('login-candidato');return}const pedidos=ler('empregaMaisPedidosPremiumCandidato');pedidos.unshift({id:'PREM-'+Date.now(),candidatoEmail:email,candidatoNome:cs[i].nome||sessionStorage.getItem('candidatoNome')||'Candidato',plano:pl.nome,periodo,valor:pl.valor,status:'aguardando_pagamento',criadoEm:new Date().toISOString()});gravar('empregaMaisPedidosPremiumCandidato',pedidos);alert('Seu pedido do '+pl.nome+' foi criado. A etapa de pagamento será conectada ao checkout do portal.');}


/* EMPREGOS-CONECTA-COMO-FUNCIONA-V1 */
function garantirAbaConectaComoFuncionaPersistenteEM(){
 if(window.__comoConectaObserverEM)return;
 const alvo=document.body;
 if(!alvo)return;
 let timer=null;
 const tentar=()=>{
  const pagina=document.getElementById('pagina-como-funciona');
  if(!pagina)return;
  const rota=(new URLSearchParams(location.search).get('pagina')||'');
  if(rota!=='como-funciona'&&!pagina.classList.contains('ativa'))return;
  if(document.getElementById('comoConectaTabEM')&&document.getElementById('comoConectaConteudoEM'))return;
  clearTimeout(timer);timer=setTimeout(()=>{try{aplicarAbaConectaComoFuncionaEM()}catch(e){console.warn('Aba Conecta / Como funciona:',e)}},80);
 };
 window.__comoConectaObserverEM=new MutationObserver(tentar);
 window.__comoConectaObserverEM.observe(alvo,{childList:true,subtree:true});
 document.addEventListener('DOMContentLoaded',()=>setTimeout(tentar,120),{once:true});
 window.addEventListener('load',()=>setTimeout(tentar,220),{once:true});
 setTimeout(tentar,300)
}
function aplicarAbaConectaComoFuncionaEM(){
 const pagina=document.getElementById('pagina-como-funciona');if(!pagina)return;
 if(pagina.querySelector('[data-cfv3-tab="conecta"]'))return;
 if(document.getElementById('comoConectaTabEM')&&document.getElementById('comoConectaConteudoEM'))return;
 document.getElementById('comoConectaConteudoEM')?.remove();
 document.getElementById('comoConectaTabEM')?.remove();

 const clicaveis=[...pagina.querySelectorAll('button,a,[role="button"]')];
 const cand=clicaveis.find(el=>/^\s*Para candidatos\b/i.test((el.textContent||'').trim()));
 const emp=clicaveis.find(el=>/^\s*Para empresas\b/i.test((el.textContent||'').trim()));
 if(!cand||!emp)return;

 const ancestraisCand=[];let x=cand.parentElement;
 while(x&&x!==pagina){ancestraisCand.push(x);x=x.parentElement}
 let tabs=emp.parentElement;
 while(tabs&&tabs!==pagina&&!ancestraisCand.includes(tabs))tabs=tabs.parentElement;
 if(!tabs||tabs===pagina)tabs=cand.parentElement;
 if(!tabs)return;

 tabs.classList.add('como-tabs-tres-em');
 const estiloAntigo=document.getElementById('estiloComoConectaEM');if(estiloAntigo)estiloAntigo.remove();
 const st=document.createElement('style');st.id='estiloComoConectaEM';
 st.textContent=
 '.como-tabs-tres-em{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:12px!important;align-items:stretch!important;width:100%!important}'+
 '.como-tabs-tres-em>button,.como-tabs-tres-em>a,.como-tabs-tres-em>[role="button"]{width:100%!important;min-width:0!important;height:100%!important}'+
 '#comoConectaTabEM{display:flex!important;align-items:center!important;gap:11px!important;padding:12px 15px!important;border:1px solid #DCCAE7!important;border-radius:14px!important;background:linear-gradient(180deg,#FBF7FD 0%,#F5ECFA 100%)!important;color:#5D1A85!important;text-align:left!important;cursor:pointer!important;font-family:Montserrat,Arial,sans-serif!important;box-shadow:0 7px 18px rgba(91,30,140,.055)!important}'+
 '#comoConectaTabEM .como-conecta-ico{width:39px;height:39px;flex:0 0 39px;border-radius:11px;background:#f1e6f7;color:#6d1aa2;display:grid;place-items:center;font-size:18px;font-weight:800}'+
 '#comoConectaTabEM strong{display:block;color:#5a1780;font-size:14px;line-height:1.2}#comoConectaTabEM small{display:block;margin-top:3px;color:#887593;font-size:11px;line-height:1.3}'+
 '#comoConectaTabEM.ativo{border-color:#6d1aa2!important;box-shadow:inset 0 0 0 1px #6d1aa2!important;background:#fbf7fd!important}'+
 '#comoConectaConteudoEM{margin-top:24px;font-family:Montserrat,Arial,sans-serif}'+
 '#comoConectaConteudoEM .cc-hero{border:1px solid #dac8e6;border-radius:20px;background:linear-gradient(135deg,#fbf7fd 0%,#fff 100%);padding:30px;display:flex;justify-content:space-between;align-items:center;gap:28px}'+
 '#comoConectaConteudoEM .cc-kicker{display:block;color:#6e1c9e;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px}'+
 '#comoConectaConteudoEM h2{margin:0;color:#43105f;font-size:30px;line-height:1.16;letter-spacing:-.5px}#comoConectaConteudoEM .cc-hero p{margin:10px 0 0;color:#76647f;font-size:13px;line-height:1.65;max-width:860px}'+
 '#comoConectaConteudoEM .cc-hero button{flex:0 0 auto;border:0;border-radius:11px;background:#6a1c99;color:#fff;padding:13px 18px;font:750 11px Montserrat;cursor:pointer;box-shadow:0 8px 20px rgba(106,28,153,.16)}'+
 '#comoConectaConteudoEM .cc-passos{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:18px}#comoConectaConteudoEM .cc-passos article{padding:20px;border:1px solid #e3d6ea;border-top:3px solid #d7b8e8;border-radius:16px;background:#fff;min-height:180px}'+
 '#comoConectaConteudoEM .cc-passos i{display:grid;place-items:center;width:38px;height:38px;border-radius:10px;background:#f1e6f7;color:#6d1aa2;font-style:normal;font-weight:800;font-size:12px;margin-bottom:15px}'+
 '#comoConectaConteudoEM .cc-passos b{display:block;color:#6e1c9e;font-size:9px;letter-spacing:.1em;margin-bottom:6px}#comoConectaConteudoEM .cc-passos strong{display:block;color:#3f244e;font-size:13px;margin-bottom:7px}#comoConectaConteudoEM .cc-passos span{display:block;color:#85758d;font-size:11px;line-height:1.55}'+
 '#pagina-como-funciona .como-conecta-ocultar-em{display:none!important}'+
 '@media(max-width:900px){.como-tabs-tres-em{grid-template-columns:repeat(3,minmax(180px,1fr))!important;overflow-x:auto!important}.como-tabs-tres-em>*{min-width:180px!important}#comoConectaConteudoEM .cc-passos{grid-template-columns:1fr 1fr}#comoConectaConteudoEM .cc-hero{align-items:flex-start;flex-direction:column}}@media(max-width:560px){.como-tabs-tres-em{grid-template-columns:1fr!important;overflow:visible!important}.como-tabs-tres-em>*{min-width:0!important}#comoConectaConteudoEM .cc-passos{grid-template-columns:1fr}#comoConectaConteudoEM .cc-hero{padding:22px}#comoConectaConteudoEM h2{font-size:24px}}';
 document.head.appendChild(st);

 const btn=document.createElement('button');btn.type='button';btn.id='comoConectaTabEM';
 btn.innerHTML='<span class="como-conecta-ico">↗</span><span><strong>Conecta</strong><small>Integração automática de vagas</small></span>';
 tabs.appendChild(btn);

 const conteudo=document.createElement('section');conteudo.id='comoConectaConteudoEM';conteudo.style.display='none';
 conteudo.innerHTML='<div class="cc-hero"><div><span class="cc-kicker">+EMPREGOS CONECTA</span><h2>Conecte suas vagas ao +Empregos sem mudar seu processo seletivo.</h2><p>O Conecta integra o portal de carreiras ou ATS da empresa ao +Empregos. Por padrão, toda candidatura continua sendo direcionada ao portal de origem. Em vagas específicas, a empresa pode substituir o destino por e-mail ou WhatsApp sem alterar as demais oportunidades.</p></div><button type="button" onclick="irPara(\'emprego-conecta\')">Conhecer o Conecta →</button></div><div class="cc-passos"><article><i>01</i><b>ORIGEM DAS VAGAS</b><strong>Conecte seu portal ou ATS</strong><span>Informe a página de carreiras, feed ou sistema utilizado pela empresa para centralizar a origem das oportunidades.</span></article><article><i>02</i><b>SINCRONIZAÇÃO</b><strong>Atualizações automáticas</strong><span>Novas vagas, alterações e encerramentos podem acompanhar a origem cadastrada sem exigir republicação manual.</span></article><article><i>03</i><b>DISTRIBUIÇÃO</b><strong>Publique no +Empregos</strong><span>As vagas sincronizadas ganham uma nova vitrine e podem alcançar candidatos em diferentes cidades e regiões.</span></article><article><i>04</i><b>ACOMPANHAMENTO</b><strong>Veja o desempenho</strong><span>Acompanhe visualizações, cliques, candidatos encaminhados e o histórico das sincronizações diretamente no Painel Conecta.</span></article></div>';
 tabs.insertAdjacentElement('afterend',conteudo);

 const apos=[];let n=conteudo.nextElementSibling;while(n){apos.push(n);n=n.nextElementSibling}
 const restaurar=()=>{
  conteudo.style.display='none';btn.classList.remove('ativo');
  apos.forEach(el=>el.classList.remove('como-conecta-ocultar-em'))
 };
 cand.addEventListener('click',()=>setTimeout(restaurar,0));
 emp.addEventListener('click',()=>setTimeout(restaurar,0));
 btn.addEventListener('click',()=>{
  pagina.querySelectorAll('.como-tabs-tres-em .ativo,.como-tabs-tres-em .active,.como-tabs-tres-em .selected,.como-tabs-tres-em .selecionado').forEach(el=>{if(el!==btn)el.classList.remove('ativo','active','selected','selecionado')});
  btn.classList.add('ativo');conteudo.style.display='block';apos.forEach(el=>el.classList.add('como-conecta-ocultar-em'))
 })
}
garantirAbaConectaComoFuncionaPersistenteEM();
function aplicarAbaConectaLoginEM(){
 document.getElementById('loginConectaTabEM')?.remove();
 document.querySelectorAll('#pagina-login-candidato button,#pagina-login-candidato a,#pagina-login-empresa button,#pagina-login-empresa a').forEach(el=>{
  const txt=String(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
  const rota=(el.getAttribute('onclick')||'')+' '+(el.getAttribute('href')||'')+' '+(el.dataset?.pagina||'');
  if(txt==='conecta'||txt==='+empregos conecta'||rota.includes('login-conecta'))el.remove();
 });
 ['pagina-login-candidato','pagina-login-empresa'].forEach(id=>{
  const pag=document.getElementById(id);if(!pag)return;
  pag.querySelectorAll('[style*="grid-template-columns"],.login-acessos-conecta-fallback-em').forEach(box=>{
   if(box.classList.contains('login-acessos-conecta-fallback-em'))box.remove();
   else{
    const botoes=[...box.children].filter(x=>x.tagName==='BUTTON'||x.tagName==='A');
    if(botoes.length===2)box.style.setProperty('grid-template-columns','repeat(2,minmax(0,1fr))','important');
   }
  });
 });
}
/* EMPREGOS-CONECTA-ACESSO-HEADER-V1 */
function garantirAcessoConectaHeaderEM(){
 document.getElementById('acessoConectaRodapeEM')?.remove();
 document.getElementById('empConectaLauncherEM')?.remove();
 document.getElementById('empConectaMenuEM')?.remove();
 document.querySelectorAll('.btn-anunciar-vaga,.anunciar-card-topo').forEach(el=>el.remove());

 const topo=document.querySelector('.topo');
 const acoes=topo?.querySelector('.acoes');
 if(!topo||!acoes)return false;

 const empresa=topo.querySelector('.menu-drop-empresa');
 const candidato=topo.querySelector('.menu-drop-candidato');
 if(!empresa||!candidato)return false;

 if(!document.getElementById('estiloAcessosTopoSimplesEM')){
  const st=document.createElement('style');st.id='estiloAcessosTopoSimplesEM';
  st.textContent=
   '.topo .acoes{display:flex!important;align-items:center!important;gap:8px!important}'+
   '.topo .header-acesso-publico-em{margin:0!important}'+
   '.topo .header-acesso-publico-em>.menu-drop-gatilho,.topo .header-acesso-simples-em{height:42px!important;min-width:auto!important;width:auto!important;padding:0 16px!important;border:1px solid #d8e2ea!important;border-radius:10px!important;background:#fff!important;color:#17394f!important;box-shadow:none!important;font:700 13px/1 Montserrat,Arial,sans-serif!important;display:flex!important;align-items:center!important;justify-content:center!important;cursor:pointer!important;transition:.18s ease!important}'+
   '.topo .header-acesso-publico-em>.menu-drop-gatilho:hover,.topo .header-acesso-simples-em:hover{background:#f5f8fb!important;border-color:#b8c9d7!important;transform:translateY(-1px)!important}'+
   '.topo .header-acesso-publico-em .login-card-icone,.topo .header-acesso-publico-em .login-card-seta,.topo .header-acesso-publico-em .login-card-texto small{display:none!important}'+
   '.topo .header-acesso-publico-em .login-card-texto{display:block!important;line-height:1!important}'+
   '.topo .header-acesso-publico-em .login-card-texto b{font-size:13px!important;font-weight:750!important;color:#17394f!important}'+
   '.topo .header-acesso-conecta-em{border-color:#d7c5e6!important;color:#651b99!important;background:#faf6fd!important}'+
   '.topo .header-acesso-conecta-em:hover{background:#f1e8f8!important;border-color:#b991d4!important}'+
   'body.sessao-empresa .header-acesso-publico-em,body.sessao-candidato .header-acesso-publico-em{display:none!important}'+
   '@media(max-width:860px){.topo .header-acesso-publico-em>.menu-drop-gatilho,.topo .header-acesso-simples-em{padding:0 10px!important;font-size:12px!important}}';
  document.head.appendChild(st)
 }

 empresa.classList.add('header-acesso-publico-em');
 candidato.classList.add('header-acesso-publico-em');

 const btnEmpresa=empresa.querySelector('.menu-drop-gatilho');
 const btnCandidato=candidato.querySelector('.menu-drop-gatilho');
 if(btnEmpresa){
  const b=btnEmpresa.querySelector('.login-card-texto b')||btnEmpresa.querySelector('b');
  if(b)b.textContent='Empresa';
  btnEmpresa.setAttribute('aria-label','Acessar área da empresa');
 }
 if(btnCandidato){
  const b=btnCandidato.querySelector('.login-card-texto b')||btnCandidato.querySelector('b');
  if(b)b.textContent='Candidato';
  btnCandidato.setAttribute('aria-label','Acessar área do candidato');
 }

 if(empresa.parentElement!==acoes)acoes.insertBefore(empresa,candidato);
 if(candidato.parentElement!==acoes)acoes.appendChild(candidato);

 let conecta=document.getElementById('headerConectaLoginEM');
 if(!conecta){
  conecta=document.createElement('button');
  conecta.id='headerConectaLoginEM';
  conecta.type='button';
  conecta.className='header-acesso-simples-em header-acesso-conecta-em header-acesso-publico-em';
  conecta.textContent='Conecta';
  conecta.setAttribute('aria-label','Acessar Conecta');
  conecta.addEventListener('click',ev=>{ev.preventDefault();ev.stopPropagation();irPara('login-conecta')});
 }
 if(conecta.parentElement!==acoes||candidato.nextElementSibling!==conecta)acoes.insertBefore(conecta,candidato.nextSibling);

 return true
}
function iniciarAcessoConectaHeaderEM(){
 let tentativas=0;
 const tentar=()=>{tentativas++;if(garantirAcessoConectaHeaderEM()||tentativas>24)return;setTimeout(tentar,250)};
 tentar();
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(iniciarAcessoConectaHeaderEM,80),{once:true});
window.addEventListener('load',()=>setTimeout(iniciarAcessoConectaHeaderEM,120),{once:true});
const observaHeaderConectaEM=new MutationObserver(()=>{if(!document.getElementById('headerConectaLoginEM'))setTimeout(garantirAcessoConectaHeaderEM,80)});
setTimeout(()=>{if(document.body)observaHeaderConectaEM.observe(document.body,{childList:true,subtree:true})},150);
setTimeout(iniciarAcessoConectaHeaderEM,300);

/* EMPREGOS-CONECTA-LOGIN-V1 */
function garantirLoginConectaEM(){
 if(document.getElementById('pagina-login-conecta'))return;
 if(!document.getElementById('estiloLoginConectaEM')){
  const st=document.createElement('style');st.id='estiloLoginConectaEM';
  st.textContent=
  '#pagina-login-conecta{font-family:Montserrat,Arial,sans-serif;background:#f7f4fa;min-height:calc(100vh - 76px);width:100%;margin:0;padding:0;color:#2f2039}'+
  '#pagina-login-conecta *{box-sizing:border-box}'+
  '.conecta-login-shell{min-height:calc(100vh - 76px);display:grid;grid-template-columns:minmax(0,1.08fr) minmax(430px,.92fr);background:#fff}'+
  '.conecta-login-brand{position:relative;overflow:hidden;padding:58px clamp(34px,6vw,88px);background:linear-gradient(145deg,#55147f 0%,#3f0d65 58%,#2d084a 100%);color:#fff;display:flex;justify-content:center;flex-direction:column}.conecta-login-brand:before{content:"";position:absolute;width:420px;height:420px;border-radius:50%;right:-160px;top:-120px;background:rgba(255,255,255,.055)}'+
  '.conecta-login-brand-inner{position:relative;z-index:1;max-width:680px}.conecta-login-logo{display:inline-flex;align-items:center;gap:10px;font-size:25px;font-weight:750;color:#fff}.conecta-login-logo b{color:#dcbcf1}.conecta-login-logo i{width:12px;height:12px;border-radius:50%;background:#b66be0;box-shadow:0 0 0 7px rgba(182,107,224,.13)}'+
  '.conecta-login-eyebrow{display:block;margin-top:52px;color:#d9b8ed;font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}.conecta-login-brand h1{margin:13px 0 14px;font-size:clamp(34px,4.2vw,56px);line-height:1.06;letter-spacing:-1.7px;color:#fff}.conecta-login-brand p{max-width:610px;margin:0;color:rgba(255,255,255,.76);font-size:15px;line-height:1.75}'+
  '.conecta-login-brand,.conecta-login-brand h1,.conecta-login-brand p,.conecta-login-brand span,.conecta-login-brand strong,.conecta-login-brand small,.conecta-login-brand b{color:#fff!important}.conecta-login-brand .conecta-login-eyebrow{color:#ead9f8!important}.conecta-login-brand>div>p{color:rgba(255,255,255,.88)!important}.conecta-login-brand .conecta-login-logo span,.conecta-login-brand .conecta-login-logo b{color:#fff!important}.conecta-login-benefits{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin-top:32px}.conecta-login-benefits div{padding:14px;border:1px solid rgba(255,255,255,.18);border-radius:14px;background:rgba(255,255,255,.075)}.conecta-login-brand .conecta-login-benefits strong{display:block;color:#fff!important;font-size:11.5px}.conecta-login-brand .conecta-login-benefits small{display:block;margin-top:5px;color:rgba(255,255,255,.86)!important;font-size:9.5px;line-height:1.45}.conecta-login-brand .conecta-login-benefits div *{color:#fff!important}'+
  '.conecta-login-side{padding:54px clamp(30px,5vw,72px);display:flex;align-items:center;justify-content:center;background:#fcfbfd}.conecta-login-card{width:min(470px,100%)}.conecta-login-card>a{display:inline-flex;margin-bottom:34px;color:#7f6e89;text-decoration:none;font-size:11px;font-weight:650}.conecta-login-card .kicker{display:block;color:#6b1c99;font-size:10px;font-weight:800;letter-spacing:.13em;text-transform:uppercase}.conecta-login-card h2{margin:8px 0 7px;color:#311442;font-size:30px}.conecta-login-card>p{margin:0 0 26px;color:#82748b;font-size:12.5px;line-height:1.6}'+
  '.conecta-login-form{display:grid;gap:15px}.conecta-login-field label{display:block;margin-bottom:7px;color:#4c3b57;font-size:11px;font-weight:700}.conecta-login-field input{width:100%;height:49px;border:1px solid #ded3e6;border-radius:12px;background:#fff;padding:0 14px;color:#31223a;font:500 13px Montserrat;outline:none}.conecta-login-field input:focus{border-color:#7c2cad;box-shadow:0 0 0 4px rgba(124,44,173,.08)}'+
  '.conecta-login-pass{position:relative}.conecta-login-pass input{padding-right:76px}.conecta-login-pass button{position:absolute;right:8px;top:8px;height:33px;border:0;border-radius:8px;background:#f2ebf6;color:#671b96;padding:0 10px;font:700 9.5px Montserrat;cursor:pointer}.conecta-login-submit{height:50px;border:0;border-radius:12px;background:linear-gradient(135deg,#6f1da2,#53127d);color:#fff;font:750 12px Montserrat;cursor:pointer;box-shadow:0 10px 24px rgba(85,20,127,.2)}'+
  '.conecta-login-msg{min-height:18px;font-size:10.5px;color:#a33b53}.conecta-login-msg.ok{color:#237452}.conecta-login-links{display:flex;justify-content:space-between;gap:15px;margin-top:17px}.conecta-login-links button{border:0;background:transparent;color:#6a268f;font:650 10.5px Montserrat;cursor:pointer}.conecta-login-new{margin-top:20px;padding:16px;border:1px solid #eadff0;border-radius:14px;background:#faf7fc;text-align:center}.conecta-login-new span{display:block;color:#45304f;font-size:11px;font-weight:750;margin-bottom:9px}.conecta-login-new button{width:100%;min-height:43px;border:1px solid #d9c9e3;border-radius:10px;background:#fff;color:#651b93;font:800 11px Montserrat;cursor:pointer}.conecta-login-new small{display:block;margin-top:8px;color:#91839a;font-size:9.5px;line-height:1.45}.conecta-login-note{margin-top:20px;padding-top:18px;border-top:1px solid #eee7f2;color:#978b9e;font-size:9.8px;line-height:1.6}'+
  '@media(max-width:900px){.conecta-login-shell{grid-template-columns:1fr}.conecta-login-brand{padding:38px 24px}.conecta-login-benefits{grid-template-columns:1fr 1fr 1fr}.conecta-login-side{padding:36px 22px 50px}}@media(max-width:560px){.conecta-login-benefits{grid-template-columns:1fr}.conecta-login-brand h1{font-size:29px}.conecta-login-card h2{font-size:25px}}';
  document.head.appendChild(st)
 }
 const sec=document.createElement('section');sec.id='pagina-login-conecta';sec.className='pagina';
 sec.innerHTML='<div class="conecta-login-shell"><aside class="conecta-login-brand"><div class="conecta-login-brand-inner"><div class="conecta-login-logo"><i></i><span>+Empregos<b>Conecta</b></span></div><span class="conecta-login-eyebrow">Área exclusiva para empresas conectadas</span><h1>Suas vagas, seu ATS, mais alcance.</h1><p>Acompanhe vagas sincronizadas, tráfego de candidatos e desempenho da distribuição em um painel criado para operações de recrutamento em escala.</p><div class="conecta-login-benefits"><div><strong>Sincronização automática</strong><small>Vagas atualizadas sem trabalho manual.</small></div><div><strong>Métricas de aquisição</strong><small>Visualizações, cliques e candidatos enviados.</small></div><div><strong>Seu processo preservado</strong><small>O candidato continua no seu ATS ou site de carreiras.</small></div></div></div></aside><main class="conecta-login-side"><div class="conecta-login-card"><a href="javascript:void(0)" onclick="irPara(\'emprego-conecta\')">← Voltar para +Empregos Conecta</a><span class="kicker">Acesso Conecta</span><h2>Entrar no Painel Conecta</h2><p>Use o CNPJ e a senha do seu acesso empresarial ao Conecta.</p><form class="conecta-login-form" onsubmit="loginConectaEM(event)"><div class="conecta-login-field"><label>CNPJ</label><input id="conectaLoginCnpjEM" inputmode="numeric" autocomplete="username" placeholder="00.000.000/0000-00" required></div><div class="conecta-login-field"><label>Senha</label><div class="conecta-login-pass"><input id="conectaLoginSenhaEM" type="password" autocomplete="current-password" placeholder="Digite sua senha" required><button type="button" onclick="alternarSenhaConectaEM(this)">Mostrar</button></div></div><button id="conectaLoginBtnEM" class="conecta-login-submit" type="submit">Acessar Painel Conecta</button><div id="conectaLoginMsgEM" class="conecta-login-msg"></div></form><div class="conecta-login-links"><button type="button" onclick="irPara(\'contato\')">Preciso de ajuda</button><button type="button" onclick="irPara(\'cadastro-conecta\')">Criar acesso Conecta</button></div><div class="conecta-login-new"><span>Ainda não usa o Conecta?</span><button type="button" onclick="irPara(\'cadastro-conecta\')">Criar meu acesso empresarial</button><small>O cadastro é independente dos planos tradicionais do +Empregos.</small></div><div class="conecta-login-note">Seu acesso ao Conecta é empresarial e não exige contratação prévia de outro plano.</div></div></main></div>';
 const ref=document.getElementById('pagina-home')||document.querySelector('.pagina'),host=ref?.parentElement||document.body;
 const footer=[...host.children].find(x=>x.tagName==='FOOTER'||x.id==='footer'||x.id==='rodape'||x.classList?.contains('site-footer')||x.classList?.contains('rodape'));
 if(footer)host.insertBefore(sec,footer);else host.appendChild(sec)
}

function garantirCadastroConectaEM(){
 if(document.getElementById('pagina-cadastro-conecta'))return;
 garantirLoginConectaEM();
 if(!document.getElementById('conectaCadastroStyleEM')){
  const st=document.createElement('style');st.id='conectaCadastroStyleEM';st.textContent=
  '#pagina-cadastro-conecta{background:#f8f6fb;min-height:100vh}'+
  '#pagina-cadastro-conecta .conecta-login-brand h1{max-width:560px}'+
  '.conecta-cadastro-card{width:min(560px,100%)}'+
  '.conecta-cadastro-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}'+
  '.conecta-cadastro-grid .full{grid-column:1/-1}'+
  '.conecta-cadastro-intro{display:flex;gap:9px;align-items:flex-start;margin:14px 0 18px;padding:12px;border-radius:12px;background:#f7f0fb;border:1px solid #eadcf1;color:#6f6078;font-size:10.5px;line-height:1.5}'+
  '.conecta-cadastro-intro i{width:22px;height:22px;border-radius:7px;background:#e8daf2;color:#6b1c9b;display:grid;place-items:center;font-style:normal;font-weight:900;flex:0 0 22px}'+
  '.conecta-cadastro-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:22px}'+
  '.conecta-cadastro-steps div{padding:10px;border:1px solid rgba(255,255,255,.18);border-radius:12px;background:rgba(255,255,255,.07)}'+
  '.conecta-cadastro-steps b{display:block;color:#fff;font-size:10.5px;margin-bottom:4px}'+
  '.conecta-cadastro-steps small{color:rgba(255,255,255,.78);font-size:9px;line-height:1.4}'+
  '@media(max-width:620px){.conecta-cadastro-grid{grid-template-columns:1fr}.conecta-cadastro-grid .full{grid-column:auto}.conecta-cadastro-steps{grid-template-columns:1fr}}';
  document.head.appendChild(st)
 }
 const sec=document.createElement('section');sec.id='pagina-cadastro-conecta';sec.className='pagina';
 sec.innerHTML='<div class="conecta-login-shell"><aside class="conecta-login-brand"><div class="conecta-login-brand-inner"><div class="conecta-login-logo"><i></i><span>+Empregos<b>Conecta</b></span></div><span class="conecta-login-eyebrow">Cadastro empresarial Conecta</span><h1>Crie seu acesso. Conecte suas vagas.</h1><p>O Conecta possui cadastro próprio. Você não precisa contratar outro plano do +Empregos para configurar sua integração e conhecer o sistema.</p><div class="conecta-cadastro-steps"><div><b>1 · Crie o acesso</b><small>Cadastre a empresa e o responsável.</small></div><div><b>2 · Conecte a origem</b><small>Informe seu ATS ou portal de carreiras.</small></div><div><b>3 · Conheça por 7 dias</b><small>O período começa quando a integração for ativada.</small></div></div></div></aside><main class="conecta-login-side"><div class="conecta-login-card conecta-cadastro-card"><a href="javascript:void(0)" onclick="irPara(\'login-conecta\')">← Já tenho acesso ao Conecta</a><span class="kicker">Novo acesso empresarial</span><h2>Criar acesso ao Conecta</h2><p>Cadastre os dados básicos da empresa. A contratação do Conecta pode ser definida depois.</p><div class="conecta-cadastro-intro"><i>✓</i><span>Seu período de experiência não começa agora. Os 7 dias passam a contar somente quando a primeira integração for configurada e ativada.</span></div><form class="conecta-login-form" onsubmit="cadastrarConectaEM(event)"><div class="conecta-cadastro-grid"><div class="conecta-login-field"><label>CNPJ</label><input id="conectaCadCnpjEM" inputmode="numeric" autocomplete="username" placeholder="00.000.000/0000-00" required></div><div class="conecta-login-field"><label>Empresa</label><input id="conectaCadNomeEM" placeholder="Nome da empresa" required></div><div class="conecta-login-field"><label>Responsável</label><input id="conectaCadResponsavelEM" autocomplete="name" placeholder="Nome do responsável" required></div><div class="conecta-login-field"><label>WhatsApp</label><input id="conectaCadTelefoneEM" inputmode="tel" placeholder="(31) 99999-9999" required></div><div class="conecta-login-field full"><label>E-mail corporativo</label><input id="conectaCadEmailEM" type="email" autocomplete="email" placeholder="rh@empresa.com.br" required></div><div class="conecta-login-field"><label>Senha</label><div class="conecta-login-pass"><input id="conectaCadSenhaEM" type="password" autocomplete="new-password" placeholder="Mínimo de 6 caracteres" required><button type="button" onclick="alternarSenhaCampoConectaEM(\'conectaCadSenhaEM\',this)">Mostrar</button></div></div><div class="conecta-login-field"><label>Confirmar senha</label><div class="conecta-login-pass"><input id="conectaCadSenha2EM" type="password" autocomplete="new-password" placeholder="Repita a senha" required><button type="button" onclick="alternarSenhaCampoConectaEM(\'conectaCadSenha2EM\',this)">Mostrar</button></div></div></div><button id="conectaCadBtnEM" class="conecta-login-submit" type="submit">Criar acesso ao Conecta</button><div id="conectaCadMsgEM" class="conecta-login-msg"></div></form><div class="conecta-login-note">Ao criar o acesso, a empresa entra no Conecta sem assinatura prévia. Depois você configura a origem das vagas e inicia a experiência de 7 dias.</div></div></main></div>';
 const ref=document.getElementById('pagina-home')||document.querySelector('.pagina'),host=ref?.parentElement||document.body;
 const footer=[...host.children].find(x=>x.tagName==='FOOTER'||x.id==='footer'||x.id==='rodape'||x.classList?.contains('site-footer')||x.classList?.contains('rodape'));
 if(footer)host.insertBefore(sec,footer);else host.appendChild(sec)
}
function alternarSenhaCampoConectaEM(id,btn){const input=document.getElementById(id);if(!input)return;const mostrar=input.type==='password';input.type=mostrar?'text':'password';if(btn)btn.textContent=mostrar?'Ocultar':'Mostrar'}
async function cadastrarConectaEM(ev){
 ev.preventDefault();
 const val=id=>(document.getElementById(id)?.value||'').trim();
 const cnpj=nums(val('conectaCadCnpjEM')),nome=val('conectaCadNomeEM'),responsavel=val('conectaCadResponsavelEM'),telefone=val('conectaCadTelefoneEM'),email=val('conectaCadEmailEM').toLowerCase(),senha=val('conectaCadSenhaEM'),senha2=val('conectaCadSenha2EM');
 const btn=document.getElementById('conectaCadBtnEM'),msgEl=document.getElementById('conectaCadMsgEM');
 const setMsg=(t,ok=false)=>{if(msgEl){msgEl.textContent=t;msgEl.classList.toggle('ok',ok)}};
 if(cnpj.length!==14)return setMsg('Informe um CNPJ válido.');
 if(nome.length<2)return setMsg('Informe o nome da empresa.');
 if(responsavel.length<3)return setMsg('Informe o nome do responsável.');
 if(!email.includes('@'))return setMsg('Informe um e-mail corporativo válido.');
 if(nums(telefone).length<10)return setMsg('Informe um WhatsApp válido.');
 if(senha.length<6)return setMsg('A senha deve ter pelo menos 6 caracteres.');
 if(senha!==senha2)return setMsg('As senhas não conferem.');
 try{
  if(btn){btn.disabled=true;btn.textContent='Criando acesso...'}setMsg('Criando seu acesso empresarial ao Conecta...');
  const auth=await sbCadastrarAuthEmpresaEM(cnpj,senha);
  if(!auth?.access_token||!auth?.user?.id)throw new Error('A conta foi criada, mas a sessão ainda não está disponível.');
  let remota=await sbInserirEmpresaEM(auth,{nome,cnpj,email,emailCandidaturas:email,telefone,senha});
  if(!remota?.id)throw new Error('Não foi possível concluir o cadastro da empresa.');
  try{
   const atualizada=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/empresas?id=eq.'+encodeURIComponent(remota.id),{method:'PATCH',headers:Object.assign(sbHeadersEM(auth.access_token),{'Prefer':'return=representation'}),body:JSON.stringify({responsavel:responsavel,telefone:telefone})});
   if(Array.isArray(atualizada)&&atualizada[0])remota=atualizada[0]
  }catch(_){}
  const d=sbEmpresaParaLocalEM(remota,senha);d.responsavel=responsavel;sbSalvarEmpresaLocalEM(d);
  sessionStorage.setItem('empregaMaisPapel','empresa');localStorage.setItem('empregaMaisPapelPersistido','empresa');sessionStorage.setItem('empresaNome',d.nome||nome);sessionStorage.setItem('empresaCnpj',d.cnpj||cnpj);
  const inicial={cadastro_origem:'conecta',plano_conecta:'teste_pendente',trial_status:'aguardando_integracao',ativo:false,frequencia:'60'};
  conectaSalvarEmpresaLocalEM(inicial);
  try{await conectaSalvarEmpresaCloudEM(inicial)}catch(err){console.warn('Conecta: status inicial não salvo no servidor:',err)}
  await conectaHidratarEmpresaSessaoEM();
  setMsg('Acesso criado. Vamos configurar sua integração.',true);
  if(typeof window.mostrarToast==='function')window.mostrarToast('Acesso ao Conecta criado com sucesso.');
  irPara('painel-conecta');setTimeout(()=>conectaAbaEM('integracao'),180)
 }catch(err){
  console.error('Cadastro Conecta:',err);
  const m=String(err?.message||'');
  setMsg(/already|registered|exists|duplicate/i.test(m)?'Este CNPJ já possui acesso. Tente entrar no Conecta.':'Não foi possível criar o acesso: '+m)
 }finally{if(btn){btn.disabled=false;btn.textContent='Criar acesso ao Conecta'}}
}
window.garantirCadastroConectaEM=garantirCadastroConectaEM;window.cadastrarConectaEM=cadastrarConectaEM;window.alternarSenhaCampoConectaEM=alternarSenhaCampoConectaEM;

function alternarSenhaConectaEM(btn){const input=document.getElementById('conectaLoginSenhaEM');if(!input)return;const mostrar=input.type==='password';input.type=mostrar?'text':'password';btn.textContent=mostrar?'Ocultar':'Mostrar'}
async function loginConectaEM(ev){
 ev.preventDefault();
 const cnpj=nums(document.getElementById('conectaLoginCnpjEM')?.value||''),senha=document.getElementById('conectaLoginSenhaEM')?.value||'',msgEl=document.getElementById('conectaLoginMsgEM'),btn=document.getElementById('conectaLoginBtnEM');
 const setMsg=(t,ok=false)=>{if(msgEl){msgEl.textContent=t;msgEl.classList.toggle('ok',ok)}};
 if(cnpj.length!==14)return setMsg('Informe um CNPJ válido.');
 if(!senha)return setMsg('Informe sua senha.');
 try{
  btn.disabled=true;btn.textContent='Entrando...';setMsg('Validando acesso...');
  await sbLoginAuthEmpresaEM(cnpj,senha);
  const remota=await sbBuscarMinhaEmpresaEM();if(!remota)throw new Error('Cadastro da empresa não encontrado.');
  if(nums(remota.cnpj)!==cnpj)throw new Error('O cadastro autenticado não corresponde ao CNPJ informado.');
  const d=sbEmpresaParaLocalEM(remota,senha);sbSalvarEmpresaLocalEM(d);
  sessionStorage.setItem('empregaMaisPapel','empresa');localStorage.setItem('empregaMaisPapelPersistido','empresa');sessionStorage.setItem('empresaNome',d.nome||'Empresa');sessionStorage.setItem('empresaCnpj',d.cnpj||cnpj);
  setMsg('Acesso autorizado.',true);irPara('painel-conecta')
 }catch(err){
  console.error('Login Conecta:',err);
  setMsg(/invalid login|invalid credentials/i.test(err.message)?'CNPJ ou senha incorretos.':'Não foi possível entrar: '+err.message)
 }finally{btn.disabled=false;btn.textContent='Acessar Painel Conecta'}
}
window.loginConectaEM=loginConectaEM;window.alternarSenhaConectaEM=alternarSenhaConectaEM;

/* EMPREGOS-CONECTA-PAINEL-V1 */
async function conectaHidratarEmpresaSessaoEM(){
 try{
  const token=await sbGarantirSessaoEM();
  if(!token)return null;
  const remota=await sbBuscarMinhaEmpresaEM();
  if(!remota?.id)return null;
  const atualLocal=(ler('empregaMaisEmpresas')||[]).find(x=>nums(x.cnpj)===nums(remota.cnpj))||{};
  const d=sbEmpresaParaLocalEM(remota,atualLocal.senha||'');
  if(!d)return null;
  // Preserve campos locais que não retornem do banco, sem sobrescrever conecta_config remoto.
  if((!d.conectaConfig||!Object.keys(d.conectaConfig).length)&&atualLocal.conectaConfig)d.conectaConfig=atualLocal.conectaConfig;
  if(!d.perfil&&atualLocal.perfil)d.perfil=atualLocal.perfil;
  sbSalvarEmpresaLocalEM(d);
  sessionStorage.setItem('empregaMaisPapel','empresa');
  localStorage.setItem('empregaMaisPapelPersistido','empresa');
  sessionStorage.setItem('empresaCnpj',d.cnpj||nums(remota.cnpj||''));
  sessionStorage.setItem('empresaNome',d.nome||remota.nome||'Empresa');
  return d
 }catch(err){
  console.warn('Conecta: não foi possível restaurar a empresa da sessão:',err);
  return null
 }
}
window.conectaHidratarEmpresaSessaoEM=conectaHidratarEmpresaSessaoEM;

function conectaConfigEM(){
 const e=empresaLogada?.()||{},p=e.perfil||{},cfg=(e.conectaConfig&&typeof e.conectaConfig==='object')?e.conectaConfig:{};
 return {url:String(cfg.url||p.conectaUrl||p.siteRecrutamento||p.paginaCarreiras||'').trim(),sistema:String(cfg.sistema||p.conectaSistema||'auto').trim()||'auto',tipo:String(cfg.tipo||p.conectaTipo||'portal').trim()||'portal',ativo:cfg.ativo===true||p.conectaAtivo===true,ultima:String(cfg.ultima||p.conectaUltimaSync||''),ultimoTesteOk:cfg.ultimoTesteOk===true,ultimaQtdEncontrada:Number(cfg.ultimaQtdEncontrada||0),frequencia:String(cfg.frequencia||p.conectaFrequencia||'60'),destinoPadrao:String(cfg.destinoPadrao||'externo'),destinoEmail:String(cfg.destinoEmail||e.emailCandidaturas||e.email||''),destinoWhatsapp:String(cfg.destinoWhatsapp||e.telefone||''),destinoLinkBase:String(cfg.destinoLinkBase||''),planoConecta:String(cfg.plano_conecta||''),trialInicio:String(cfg.trial_inicio||''),trialFim:String(cfg.trial_fim||''),trialStatus:String(cfg.trial_status||''),trialLimiteVagas:Math.max(1,Math.min(10,Number(cfg.trial_limite_vagas||10))),trialLimiteOrigens:Number(cfg.trial_limite_origens||1),trialSelectedUrls:Array.isArray(cfg.trial_selected_urls)?cfg.trial_selected_urls.map(x=>String(x||'')).filter(Boolean).slice(0,10):[]}
}
function conectaTrialInfoEM(cfg=conectaConfigEM()){const fim=cfg.trialFim?new Date(cfg.trialFim):null,isTrial=cfg.planoConecta==='teste_gratis',ok=!!(fim&&!Number.isNaN(fim.getTime())),ativo=isTrial&&cfg.trialStatus!=='expirado'&&ok&&fim>Date.now();return{isTrial,ativo,expirado:isTrial&&!ativo,dias:ativo?Math.max(1,Math.ceil((fim-Date.now())/86400000)):0,fim,limite:cfg.trialLimiteVagas||10,selectedUrls:cfg.trialSelectedUrls||[]}}
async function conectaIniciarTesteGratisEM(){try{const token=await sbGarantirSessaoEM();if(!token){irPara('login-conecta');return false}const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/rpc/conecta_start_my_trial',{method:'POST',headers:Object.assign(sbHeadersEM(token),{'Content-Type':'application/json'}),body:'{}'}),remoto=Array.isArray(rows)?rows[0]:rows;if(remoto)sbSalvarEmpresaLocalEM(sbEmpresaParaLocalEM(remoto,''));await conectaHidratarEmpresaSessaoEM();conectaRegistrarHistoricoEM('teste','Período gratuito do Conecta iniciado',{detalhe:'7 dias · 1 origem · até 10 vagas escolhidas'});await renderPainelConectaEM();return true}catch(err){console.error(err);alert('Não foi possível iniciar o período gratuito. '+String(err?.message||''));return false}}
async function conectaSalvarSelecaoTesteEM(){const trial=conectaTrialInfoEM();if(!trial.ativo)return alert('O período gratuito não está ativo.');const urls=[...document.querySelectorAll('#conectaSecVagasEM input[data-conecta-trial-url]:checked')].map(x=>x.dataset.conectaTrialUrl).filter(Boolean);if(urls.length>trial.limite)return alert('No teste grátis você pode selecionar até '+trial.limite+' vagas.');const btn=document.getElementById('conectaSalvarSelecaoEM');try{if(btn){btn.disabled=true;btn.textContent='Salvando...'}const token=await sbGarantirSessaoEM();if(!token)throw Error('Sessão da empresa expirada.');const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/rpc/conecta_save_my_trial_selection',{method:'POST',headers:Object.assign(sbHeadersEM(token),{'Content-Type':'application/json'}),body:JSON.stringify({p_urls:urls})}),remoto=Array.isArray(rows)?rows[0]:rows;if(remoto)sbSalvarEmpresaLocalEM(sbEmpresaParaLocalEM(remoto,''));await conectaHidratarEmpresaSessaoEM();conectaRegistrarHistoricoEM('selecao','Vagas do teste gratuito selecionadas',{detalhe:urls.length+' de '+trial.limite+' vagas'});if(typeof window.mostrarToast==='function')window.mostrarToast('Seleção salva: '+urls.length+' de '+trial.limite+' vagas.');await renderPainelConectaEM();if(urls.length){await sincronizarAgoraConectaEM()}}catch(err){console.error(err);alert('Não foi possível salvar a seleção. '+String(err?.message||''))}finally{if(btn){btn.disabled=false;btn.textContent='Salvar seleção'}}}
function conectaContarSelecaoTesteEM(){const lim=conectaTrialInfoEM().limite,checks=[...document.querySelectorAll('#conectaSecVagasEM input[data-conecta-trial-url]:checked')];if(checks.length>lim){checks.pop().checked=false;return conectaContarSelecaoTesteEM()}const el=document.getElementById('conectaTrialContadorEM');if(el)el.textContent=checks.length+' / '+lim+' selecionadas'}
window.conectaIniciarTesteGratisEM=conectaIniciarTesteGratisEM;window.conectaSalvarSelecaoTesteEM=conectaSalvarSelecaoTesteEM;window.conectaContarSelecaoTesteEM=conectaContarSelecaoTesteEM;

function conectaSalvarEmpresaLocalEM(patch={}){
 const cnpj=sessionStorage.getItem('empresaCnpj')||'',a=ler('empregaMaisEmpresas'),i=a.findIndex(e=>String(e.cnpj||'')===String(cnpj));
 if(i<0)return null;
 a[i].conectaConfig=Object.assign({},a[i].conectaConfig||{},patch);
 a[i].perfilAtualizadoEm=new Date().toISOString();
 gravar('empregaMaisEmpresas',a);
 return a[i]
}
async function conectaSalvarEmpresaCloudEM(config){
 const token=await sbGarantirSessaoEM();if(!token)throw new Error('Sessão da empresa expirada.');
 const rows=await sbJsonEM(
  EMPREGAMAIS_SUPABASE_URL+'/rest/v1/rpc/conecta_save_my_config',
  {method:'POST',headers:Object.assign(sbHeadersEM(token),{'Content-Type':'application/json'}),body:JSON.stringify({p_config:config})}
 );
 const remoto=Array.isArray(rows)?rows[0]:rows;
 if(remoto){const local=sbEmpresaParaLocalEM(remoto,'');sbSalvarEmpresaLocalEM(local)}
 return remoto
}
function conectaUuidValidoEM(v){return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(v||''))}
async function conectaRegistrarMetricaEM(evento,vaga){
 try{
  const v=vaga||vagaAtual?.();if(!v||!conectaUuidValidoEM(v.id)||!conectaUuidValidoEM(v.empresaId||v.empresa_id))return;
  const token=sbTokenEM?.()||'';
  await sbJsonEM(
   EMPREGAMAIS_SUPABASE_URL+'/rest/v1/conecta_metricas_eventos',
   {method:'POST',headers:Object.assign(sbHeadersEM(token||undefined),{'Prefer':'return=minimal'}),body:JSON.stringify({vaga_id:v.id,empresa_id:v.empresaId||v.empresa_id,evento})}
  )
 }catch(err){console.warn('Métrica Conecta indisponível:',err)}
}
function conectaRegistrarVisualizacaoEM(v){
 if(!v?.id)return;
 const chave='conecta:view:'+String(v.id);
 if(sessionStorage.getItem(chave))return;
 sessionStorage.setItem(chave,'1');
 conectaRegistrarMetricaEM('visualizacao',v)
}
async function conectaMetricasEmpresaEM(empresaId=''){
 try{
  const token=await sbGarantirSessaoEM();if(!token)return {visualizacoes:0,cliques:0,enviados:0,conversao:0,porVaga:{}};
  let id=String(empresaId||'').trim();
  if(!id){const emp=await sbBuscarMinhaEmpresaEM();id=String(emp?.id||'').trim()}
  if(!id)return {visualizacoes:0,cliques:0,enviados:0,conversao:0,porVaga:{}};
  const desde=new Date(Date.now()-30*86400000).toISOString();
  // Métricas pertencem às vagas da integração Conecta atualmente ativa,
  // não a todo o histórico da empresa. Isso impede herdar números de uma
  // origem anterior quando a empresa troca de portal/ATS.
  const vagasAtuais=conectaVagasEmpresaEM();
  const idsAtuais=new Set(vagasAtuais.map(v=>String(v.id||'')).filter(conectaUuidValidoEM));
  if(!idsAtuais.size)return {visualizacoes:0,cliques:0,enviados:0,conversao:0,porVaga:{}};
  const rows=await sbJsonEM(
   EMPREGAMAIS_SUPABASE_URL+'/rest/v1/conecta_metricas_eventos?select=vaga_id,evento,criado_em&empresa_id=eq.'+encodeURIComponent(id)+'&criado_em=gte.'+encodeURIComponent(desde),
   {method:'GET',headers:sbHeadersEM(token)}
  );
  const lista=(Array.isArray(rows)?rows:[]).filter(x=>idsAtuais.has(String(x.vaga_id||''))),porVaga={};
  let visualizacoes=0,cliques=0,enviados=0;
  lista.forEach(x=>{
   const id=String(x.vaga_id||'');if(!porVaga[id])porVaga[id]={visualizacoes:0,cliques:0,enviados:0};
   if(x.evento==='visualizacao'){visualizacoes++;porVaga[id].visualizacoes++}
   else if(x.evento==='clique_candidatar'){cliques++;porVaga[id].cliques++}
   else if(x.evento==='envio_externo'){enviados++;porVaga[id].enviados++}
  });
  return {visualizacoes,cliques,enviados,conversao:visualizacoes?Math.round(enviados/visualizacoes*1000)/10:0,porVaga}
 }catch(err){console.warn('Métricas do Conecta não carregadas:',err);return {visualizacoes:0,cliques:0,enviados:0,conversao:0,porVaga:{}}}
}
function conectaDestinoLabelEM(tipo){
 const t=String(tipo||'externo').toLowerCase();
 return t==='whatsapp'?'WhatsApp':t==='email'?'E-mail':t==='portal'?'Portal +Empregos':'Site da empresa'
}
function conectaVagasEmpresaEM(){
 const todas=typeof vagasDaEmpresa==='function'?vagasDaEmpresa():[];
 return todas.filter(v=>{
  if(!v)return false;
  const gerenciada=v.conectaManaged===true||v.conecta_managed===true||v.importada===true||v.origem==='integracao'||v.origem==='conecta'||v.fonte==='integracao'||v.fonte==='conecta';
  if(!gerenciada)return false;
  // Vagas encerradas de uma origem anterior permanecem no histórico, mas não
  // pertencem mais à integração atualmente exibida no painel.
  if(String(v.status||'').toLowerCase()==='encerrada')return false;
  return true;
 })
}
function conectaDescobertasEM(){
 try{
  const cnpj=sessionStorage.getItem('empresaCnpj')||'';
  const raw=sessionStorage.getItem('empregaMaisConectaDescobertas:'+cnpj)||'';
  const data=raw?JSON.parse(raw):null;
  return data&&typeof data==='object'?data:{jobs:[],jobs_found:0,provider:'',checked_at:''}
 }catch(_){return{jobs:[],jobs_found:0,provider:'',checked_at:''}}
}
function conectaSalvarDescobertasEM(data){
 const cnpj=sessionStorage.getItem('empresaCnpj')||'';
 const jobs=Array.isArray(data?.jobs)?data.jobs.slice(0,300):[];
 const payload={jobs,jobs_found:Number(data?.jobs_found||jobs.length||0),provider:String(data?.provider||''),checked_at:String(data?.checked_at||new Date().toISOString()),source_url:String(data?.source_url||'')};
 try{sessionStorage.setItem('empregaMaisConectaDescobertas:'+cnpj,JSON.stringify(payload))}catch(_){}
 return payload
}
function conectaAbrirVagaDescobertaEM(url){
 try{const u=new URL(String(url||''));if(/^https?:$/.test(u.protocol))window.open(u.toString(),'_blank','noopener,noreferrer')}catch(_){}
}
window.conectaAbrirVagaDescobertaEM=conectaAbrirVagaDescobertaEM;
function conectaHistoricoEM(){
 const cnpj=sessionStorage.getItem('empresaCnpj')||'';
 return (ler('empregaMaisConectaHistorico',[])||[]).filter(x=>String(x.cnpj||'')===String(cnpj)).slice(0,30)
}
function conectaRegistrarHistoricoEM(tipo,mensagem,extra={}){
 const a=ler('empregaMaisConectaHistorico',[])||[];
 a.unshift(Object.assign({id:'CON-'+Date.now(),cnpj:sessionStorage.getItem('empresaCnpj')||'',tipo,mensagem,data:new Date().toISOString()},extra||{}));
 gravar('empregaMaisConectaHistorico',a.slice(0,300))
}
function conectaPerfilEmpresaEM(){
 const e=empresaLogada?.()||{},cfg=(e.conectaConfig&&typeof e.conectaConfig==='object')?e.conectaConfig:{};
 const p=(cfg.perfil&&typeof cfg.perfil==='object')?cfg.perfil:((e.perfil&&typeof e.perfil==='object')?e.perfil:{});
 return {nome:String(p.nome||e.nome||sessionStorage.getItem('empresaNome')||'').trim(),segmento:String(p.segmento||e.setor||'').trim(),slogan:String(p.slogan||'').trim(),site:String(p.site||e.site||'').trim(),paginaCarreiras:String(p.paginaCarreiras||p.siteRecrutamento||cfg.url||'').trim(),linkedin:String(p.linkedin||'').trim(),instagram:String(p.instagram||'').trim(),cidade:String(p.cidade||e.cidade||'').trim(),uf:String(p.uf||e.uf||'').trim().toUpperCase(),sobre:String(p.sobre||e.sobreInstitucional||e.sobre||'').trim(),cultura:String(p.cultura||'').trim(),beneficios:String(p.beneficios||'').trim(),logo:String(p.logo||e.logo||'').trim(),capa:String(p.capa||'').trim()}
}
function conectaPerfilImagemSelecionadaEM(input,idHidden,idPreview,tipo){
 const arq=input.files&&input.files[0];if(!arq)return;
 if(!/^image\/(png|jpeg|webp)$/i.test(arq.type)){alert('Selecione uma imagem JPG, PNG ou WebP.');input.value='';return}
 if(arq.size>1536*1024){alert('A imagem deve ter no máximo 1,5 MB.');input.value='';return}
 const r=new FileReader();r.onload=()=>{const h=document.getElementById(idHidden),box=document.getElementById(idPreview);if(h)h.value=r.result;if(box){box.innerHTML='<img src="'+esc(r.result)+'" alt="'+(tipo==='logo'?'Logo':'Capa')+' da empresa">';box.classList.add('tem-imagem')}};r.readAsDataURL(arq)
}
const CONECTA_SEGMENTOS_EMPRESA_EM=[
 'Administração e serviços corporativos','Agronegócio','Alimentação e restaurantes','Arquitetura e construção',
 'Atacado e distribuição','Automotivo','Bancos e serviços financeiros','Beleza e estética','Comércio e varejo',
 'Comunicação, mídia e publicidade','Consultoria','Educação','Energia e utilidades','Engenharia','Farmacêutico',
 'Hotelaria e turismo','Indústria','Jurídico','Logística e transportes','Mineração','Saúde','Segurança',
 'Serviços gerais e facilities','Tecnologia e software','Telecomunicações','Terceiro setor','Outros'
];
function conectaSegmentosPerfilHtmlEM(valor){
 const atual=String(valor||'').split(',').map(x=>x.trim()).filter(Boolean)[0]||'';
 const label=atual||'Selecione o segmento da empresa';
 const opcoes=CONECTA_SEGMENTOS_EMPRESA_EM.map(s=>'<button class="conecta-segmento-opcao '+(atual===s?'ativo':'')+'" type="button" onclick="conectaSelecionarSegmentoPerfilEM(\''+String(s).replace(/'/g,"\\'")+'\')">'+esc(s)+'</button>').join('');
 return '<div class="conecta-segmento-picker"><input id="conectaPerfilSegmentoEM" type="hidden" value="'+esc(atual)+'"><button id="conectaSegmentoTriggerEM" class="conecta-segmento-trigger" type="button" onclick="conectaAlternarSegmentosPerfilEM()"><span>'+esc(label)+'</span><b>⌄</b></button><div id="conectaSegmentoMenuEM" class="conecta-segmento-menu">'+opcoes+'</div></div>';
}
function conectaAlternarSegmentosPerfilEM(){
 document.getElementById('conectaSegmentoMenuEM')?.classList.toggle('aberto');
}
function conectaSelecionarSegmentoPerfilEM(valor){
 const hidden=document.getElementById('conectaPerfilSegmentoEM'),trigger=document.getElementById('conectaSegmentoTriggerEM'),menu=document.getElementById('conectaSegmentoMenuEM');
 if(hidden)hidden.value=valor;
 if(trigger){const s=trigger.querySelector('span');if(s)s.textContent=valor}
 if(menu){menu.querySelectorAll('.conecta-segmento-opcao').forEach(btn=>btn.classList.toggle('ativo',btn.textContent.trim()===valor));menu.classList.remove('aberto')}
}
window.conectaAlternarSegmentosPerfilEM=conectaAlternarSegmentosPerfilEM;
window.conectaSelecionarSegmentoPerfilEM=conectaSelecionarSegmentoPerfilEM;
document.addEventListener('click',function(ev){
 const picker=ev.target.closest?.('.conecta-segmento-picker');
 if(!picker)document.getElementById('conectaSegmentoMenuEM')?.classList.remove('aberto');
});
async function salvarPerfilEmpresaConectaEM(ev){
 ev.preventDefault();const v=id=>(document.getElementById(id)?.value||'').trim(),urlOk=x=>!x||/^https?:\/\//i.test(x);
 const perfil={nome:v('conectaPerfilNomeEM'),segmento:v('conectaPerfilSegmentoEM'),slogan:v('conectaPerfilSloganEM'),site:v('conectaPerfilSiteEM'),paginaCarreiras:v('conectaPerfilCarreirasEM'),linkedin:v('conectaPerfilLinkedinEM'),instagram:v('conectaPerfilInstagramEM'),cidade:v('conectaPerfilCidadeEM'),uf:v('conectaPerfilUfEM').toUpperCase(),sobre:v('conectaPerfilSobreEM'),cultura:v('conectaPerfilCulturaEM'),beneficios:v('conectaPerfilBeneficiosEM'),logo:v('conectaPerfilLogoEM'),capa:v('conectaPerfilCapaEM')};
 if(perfil.nome.length<2)return alert('Informe o nome que será exibido no perfil da empresa.');
 const ruim=[['Site',perfil.site],['Página de carreiras',perfil.paginaCarreiras],['LinkedIn',perfil.linkedin],['Instagram',perfil.instagram]].find(x=>!urlOk(x[1]));if(ruim)return alert(ruim[0]+' deve começar com http:// ou https://.');
 if(perfil.uf&&perfil.uf.length!==2)return alert('Informe a UF com 2 letras.');
 const lista=ler('empregaMaisEmpresas')||[],cnpj=sessionStorage.getItem('empresaCnpj')||'',i=lista.findIndex(x=>String(x.cnpj||'')===String(cnpj));if(i<0)return alert('Empresa da sessão não encontrada.');
 const cfgNovo=Object.assign({},lista[i].conectaConfig||{},{perfil});lista[i].conectaConfig=cfgNovo;lista[i].perfil=Object.assign({},lista[i].perfil||{},perfil);lista[i].perfilAtualizadoEm=new Date().toISOString();gravar('empregaMaisEmpresas',lista);
 const btn=document.getElementById('conectaPerfilSalvarEM'),m=document.getElementById('conectaPerfilMsgEM');
 try{if(btn){btn.disabled=true;btn.textContent='Salvando...'}if(m){m.textContent='Sincronizando perfil...';m.className='conecta-profile-msg'}await conectaSalvarEmpresaCloudEM(cfgNovo);conectaRegistrarHistoricoEM('perfil','Perfil público da empresa atualizado');if(m){m.textContent='Perfil salvo com sucesso.';m.className='conecta-profile-msg ok'}if(typeof window.mostrarToast==='function')window.mostrarToast('Perfil da empresa atualizado.');renderPainelConectaEM()}catch(err){console.error('Perfil Conecta:',err);if(m){m.textContent='Salvo localmente, mas a sincronização não foi concluída.';m.className='conecta-profile-msg erro'}}finally{if(btn){btn.disabled=false;btn.textContent='Salvar perfil da empresa'}}
}
window.conectaPerfilImagemSelecionadaEM=conectaPerfilImagemSelecionadaEM;window.salvarPerfilEmpresaConectaEM=salvarPerfilEmpresaConectaEM;

function conectaDetectarSistemaEM(url){
 const u=String(url||'').toLowerCase();
 if(u.includes('abler.com.br'))return'abler';
 if(u.includes('gupy.io')||u.includes('gupy.com.br'))return'gupy';
 if(u.includes('solides.com.br'))return'solides';
 if(u.includes('pandape.com')||u.includes('pandape.info'))return'pandape';
 if(u.includes('myworkdayjobs.com')||u.includes('workday.com'))return'workday';
 if(u.includes('greenhouse.io'))return'greenhouse';
 if(u.includes('lever.co'))return'lever';
 if(u.includes('yapp.rec.br'))return'yapp';
 if(u.includes('smartrecruiters.com'))return'smartrecruiters';
 if(u.includes('icims.com'))return'icims';
 if(u.includes('taleo.net')||u.includes('oraclecloud.com'))return'oracle';
 if(u.includes('successfactors.com')||u.includes('successfactors.eu'))return'successfactors';
 if(u.includes('ashbyhq.com'))return'ashby';
 if(u.includes('workable.com'))return'workable';
 if(u.includes('teamtailor.com'))return'teamtailor';
 if(u.includes('bamboohr.com'))return'bamboohr';
 if(u.includes('inhire.app')||u.includes('inhire.io'))return'inhire';
 if(u.includes('jobconvo.com'))return'jobconvo';
 if(u.includes('recrutei.com.br'))return'recrutei';
 if(u.includes('vagas.com.br'))return'vagas';
 return u?'portal':'auto'
}
function conectaSistemaInfoEM(sistema){
 const mapa={
  auto:['Detectar automaticamente','Cole a URL e o Conecta tentará reconhecer o sistema.'],
  abler:['Abler','Portal público e, quando habilitado, API com chave de integração segura.'],
  gupy:['Gupy','Página pública e integrações por API/token ou webhook, quando disponíveis.'],
  solides:['Sólides','Integração conforme os recursos liberados na conta da empresa.'],
  pandape:['Pandapé','Integração conforme o ambiente e os recursos contratados pela empresa.'],
  workday:['Workday','Portal/tenant e integração corporativa por API ou feed, conforme configuração.'],
  greenhouse:['Greenhouse','Job Board público e APIs autenticadas quando necessário.'],
  lever:['Lever','Portal Lever e Postings API para vagas públicas.'],
  yapp:['YAPP','Página pública de carreiras YAPP com leitura automática das vagas disponíveis.'],
  portal:['Portal próprio / outro','URL pública, feed JSON/XML ou API própria. O Conecta tenta uma leitura genérica quando o fornecedor não é reconhecido.']
 };
 const x=mapa[sistema]||mapa.portal;return{nome:x[0],metodo:x[1]}
}
function conectaAtualizarSistemaEM(origem){
 const url=document.getElementById('conectaUrlEM')?.value||'';
 const sel=document.getElementById('conectaSistemaEM');if(!sel)return;
 if(origem==='url'&&sel.value==='auto'){
  const det=conectaDetectarSistemaEM(url);
  if(det!=='auto')sel.value=det
 }
 const sistema=sel.value==='auto'?conectaDetectarSistemaEM(url):sel.value;
 const info=conectaSistemaInfoEM(sistema),box=document.getElementById('conectaSistemaInfoEM');
 if(box)box.innerHTML='<strong>'+esc(info.nome)+'</strong><span>'+esc(info.metodo)+'</span>';
 const tipo=document.getElementById('conectaTipoEM');
 if(tipo&&sistema!=='auto'&&sistema!=='portal')tipo.value='ats'
}
window.conectaAtualizarSistemaEM=conectaAtualizarSistemaEM;

function garantirPainelConectaEM(){
 if(document.getElementById('pagina-painel-conecta'))return;
 if(!document.getElementById('estiloPainelConectaEM')){
  const st=document.createElement('style');st.id='estiloPainelConectaEM';st.textContent=
  '#pagina-painel-conecta{font-family:Montserrat,Arial,sans-serif;background:#f7f5fb;min-height:calc(100vh - 76px);color:#30233f;width:100%;max-width:none;margin:0;padding:0;position:relative;clear:both}'+
  '#pagina-painel-conecta *{box-sizing:border-box}'+
  '.conecta-app{display:grid;grid-template-columns:240px minmax(0,1fr);min-height:calc(100vh - 76px);align-items:stretch}'+
  '.conecta-side{background:#5b1fa6;color:#fff;padding:22px 14px 18px;display:flex;flex-direction:column;gap:18px;min-height:100%;align-self:stretch;overflow:auto;box-shadow:10px 0 28px rgba(45,17,72,.08)}'+
  '.conecta-brand{padding:6px 12px 20px;border-bottom:1px solid rgba(255,255,255,.14)}'+
  '.conecta-brand small{display:block;font-size:9.5px;letter-spacing:.13em;text-transform:uppercase;opacity:.72;margin-bottom:7px;font-weight:700}'+
  '.conecta-brand strong{display:block;font-size:22px;line-height:1.15;letter-spacing:-.55px}.conecta-brand strong b{color:#ead8ff}'+
  '.conecta-brand-site{padding-bottom:16px;border-bottom:1px solid rgba(255,255,255,.14)}.conecta-brand-logo{display:inline-flex;align-items:center;gap:3px;padding:9px 12px;border-radius:13px;background:#fff;box-shadow:0 8px 22px rgba(31,12,48,.14)}.conecta-brand-logo span{font-size:25px;line-height:1;color:#2f80ed!important;font-weight:900}.conecta-brand-logo strong{font-size:22px!important;line-height:1!important;letter-spacing:-.65px!important;color:#123b6d!important;font-weight:850!important;white-space:nowrap!important}.conecta-brand-site>small{margin:10px 2px 0!important;color:rgba(255,255,255,.72)!important;font-size:9.3px!important;line-height:1.45!important;letter-spacing:.04em!important;text-transform:none!important;font-weight:600!important}'+
  '.conecta-side-company{display:grid;grid-template-columns:44px minmax(0,1fr);gap:11px;align-items:center;padding:12px;border:1px solid rgba(255,255,255,.15);border-radius:16px;background:linear-gradient(180deg,rgba(255,255,255,.11),rgba(255,255,255,.065));box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 10px 24px rgba(35,13,57,.10)}.conecta-side-company-logo{width:44px;height:44px;border-radius:12px;overflow:hidden;display:grid;place-items:center;background:#fff;color:#6f2dbd!important;font-weight:900;font-size:16px;border:1px solid rgba(255,255,255,.45)}.conecta-side-company-logo img{width:100%;height:100%;object-fit:contain;padding:5px;box-sizing:border-box}.conecta-side-company-info{min-width:0}.conecta-side-company-info small{display:flex;align-items:center;gap:6px;margin-bottom:4px;color:#dff8ec!important;font-size:8.5px;font-weight:800;letter-spacing:.07em;text-transform:uppercase}.conecta-side-company-info small:before{content:"";width:7px;height:7px;border-radius:50%;background:#64dfa0;box-shadow:0 0 0 4px rgba(100,223,160,.13)}.conecta-side-company-info strong{display:block;color:#fff!important;font-size:12.5px;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.conecta-side-company-info span{display:block;margin-top:3px;color:rgba(255,255,255,.6)!important;font-size:9.3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
  '.conecta-side *{color:inherit}.conecta-nav{display:grid;gap:14px}.conecta-nav-group{display:grid;gap:7px}.conecta-nav-group-title{display:block;padding:0 10px 2px;color:rgba(255,255,255,.48)!important;font:800 8.5px/1.2 Montserrat,Arial,sans-serif;letter-spacing:.12em;text-transform:uppercase}.conecta-nav button{appearance:none;position:relative;border:1px solid transparent;background:transparent;color:rgba(255,255,255,.90)!important;border-radius:15px;padding:9px 10px;text-align:left;font:650 12.5px/1.2 Montserrat,Arial,sans-serif;cursor:pointer;display:grid;grid-template-columns:38px minmax(0,1fr) 18px;gap:10px;align-items:center;min-height:54px;transition:background .18s ease,border-color .18s ease,transform .18s ease,box-shadow .18s ease}.conecta-nav button:after{content:"›";font:700 18px/1 Arial,sans-serif;color:rgba(255,255,255,.42);text-align:center;transition:.18s ease}.conecta-nav button:hover{background:rgba(255,255,255,.09);border-color:rgba(255,255,255,.11);color:#fff!important;transform:translateX(2px)}.conecta-nav button.ativo{background:linear-gradient(90deg,rgba(255,255,255,.19),rgba(255,255,255,.11));border-color:rgba(255,255,255,.26);color:#fff!important;box-shadow:0 9px 22px rgba(42,14,66,.16),inset 0 1px 0 rgba(255,255,255,.10)}.conecta-nav button.ativo:before{content:"";position:absolute;left:-16px;top:13px;bottom:13px;width:3px;border-radius:0 4px 4px 0;background:#b9f0d6;box-shadow:0 0 12px rgba(185,240,214,.65)}.conecta-nav button.ativo:after{color:#fff;transform:translateX(2px)}.conecta-nav-ico{width:38px;height:38px;border-radius:11px;display:grid;place-items:center;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.10);transition:.18s ease}.conecta-nav button.ativo .conecta-nav-ico{background:#fff;color:#6f2dbd!important;border-color:#fff;box-shadow:0 6px 16px rgba(35,12,55,.16)}.conecta-nav-ico svg{width:20px;height:20px;display:block;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.conecta-nav-label{display:grid;gap:2px}.conecta-nav-label b{font-size:12.5px;font-weight:750;color:inherit!important}.conecta-nav-label small{font-size:9.2px;line-height:1.25;color:rgba(255,255,255,.58)!important;font-weight:500}.conecta-nav button.ativo .conecta-nav-label small{color:rgba(255,255,255,.72)!important}'+
  '.conecta-side-foot{margin-top:auto;padding:14px;border:1px solid rgba(255,255,255,.16);border-radius:16px;background:linear-gradient(180deg,rgba(255,255,255,.10),rgba(255,255,255,.06));box-shadow:inset 0 1px 0 rgba(255,255,255,.07)}.conecta-side-foot small{display:block;opacity:.7;font-size:9px;letter-spacing:.06em;font-weight:700}.conecta-side-foot strong{display:block;margin-top:5px;font-size:12.5px}.conecta-side-foot button{margin-top:12px;width:100%;border:1px solid rgba(255,255,255,.25);border-radius:10px;padding:9px;background:rgba(255,255,255,.12);color:#fff;font:700 10.5px Montserrat;cursor:pointer;transition:.18s ease}.conecta-side-foot button:hover{background:#fff;color:#5b1fa6}'+
  '.conecta-main{padding:30px 34px 50px;min-width:0}.conecta-top{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:24px}.conecta-top-identidade{display:flex;align-items:center;gap:15px;min-width:0}.conecta-top-logo{width:62px;height:62px;flex:0 0 62px;border:1px solid #e5dcec;border-radius:15px;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;box-shadow:0 7px 20px rgba(70,30,92,.08)}.conecta-top-logo img{width:100%;height:100%;object-fit:contain;padding:7px;box-sizing:border-box}.conecta-top-logo span{display:flex;width:100%;height:100%;align-items:center;justify-content:center;background:#f4ecfa;color:#651b99;font-size:23px;font-weight:800;text-transform:uppercase}.conecta-top-texto{min-width:0}.conecta-top h1{margin:0;font-size:28px;color:#35104f;letter-spacing:-.6px}.conecta-top p{margin:6px 0 0;color:#7a6b87;font-size:13px}.conecta-top-actions{display:flex;gap:10px}.conecta-btn{border:0;border-radius:11px;padding:11px 15px;font:700 12px Montserrat;cursor:pointer}.conecta-btn.sec{background:#eee7f5;color:#4b1478}.conecta-btn.pri{background:#5b168d;color:#fff;box-shadow:0 8px 20px rgba(91,22,141,.18)}.conecta-btn[disabled]{opacity:.45;cursor:not-allowed;box-shadow:none}'+
  '.conecta-hero{position:relative;background:linear-gradient(135deg,#5c178e 0%,#45106e 52%,#351052 100%);color:#fff;border-radius:20px;padding:24px 26px;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(260px,.7fr);gap:24px;align-items:center;box-shadow:0 18px 46px rgba(61,18,89,.16);overflow:hidden}.conecta-hero:before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:rgba(255,255,255,.16)}.conecta-hero.health-ok:before{background:#55d995;box-shadow:0 0 20px rgba(85,217,149,.85)}.conecta-hero.health-warn:before{background:#f2bb4d;box-shadow:0 0 18px rgba(242,187,77,.7)}.conecta-hero.health-err:before{background:#ef6676;box-shadow:0 0 18px rgba(239,102,118,.7)}'+
  '.conecta-hero h2,.conecta-hero h3,.conecta-hero strong,.conecta-hero b{color:#fff!important}'+
  '.conecta-hero-kicker{display:inline-flex;align-items:center;gap:7px;font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#f0dcff!important}.conecta-dot{width:8px;height:8px;border-radius:50%;background:#9cf0c9;box-shadow:0 0 0 5px rgba(156,240,201,.12)}'+
  '.conecta-hero h2{font-size:24px;line-height:1.18;margin:12px 0 8px}.conecta-hero p{margin:0;color:rgba(255,255,255,.86)!important;font-size:13px;line-height:1.6;max-width:670px}.conecta-hero-health{display:flex;flex-wrap:wrap;gap:8px;margin-top:15px}.conecta-hero-health span{display:inline-flex;align-items:center;gap:7px;padding:7px 9px;border:1px solid rgba(255,255,255,.14);border-radius:999px;background:rgba(255,255,255,.08);color:#f8f3fb!important;font-size:9.5px;font-weight:700}.conecta-hero-health i{width:7px;height:7px;border-radius:50%;background:#56d894;box-shadow:0 0 0 4px rgba(86,216,148,.13)}.conecta-hero.health-warn .conecta-hero-health i{background:#f2bb4d;box-shadow:0 0 0 4px rgba(242,187,77,.13)}.conecta-hero.health-err .conecta-hero-health i{background:#ef6676;box-shadow:0 0 0 4px rgba(239,102,118,.13)}.conecta-source{border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.08);border-radius:15px;padding:15px;color:#fff!important}.conecta-source small{display:block;color:rgba(255,255,255,.72)!important;font-size:10px;text-transform:uppercase;letter-spacing:.08em}.conecta-source strong{display:block;margin-top:5px;font-size:13px;color:#fff!important;word-break:break-word}.conecta-source span{display:block;margin-top:7px;color:#eadff2!important;font-size:11px}.conecta-source-status{display:inline-flex!important;align-items:center;gap:7px;margin-top:11px!important;padding:6px 9px;border-radius:999px;background:rgba(64,210,132,.15);color:#c9f8df!important;font-weight:800}.conecta-source-status.warn{background:rgba(242,187,77,.16);color:#ffe4a7!important}.conecta-source-status.err{background:rgba(239,102,118,.16);color:#ffd2d8!important}'+
  '.conecta-next{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:center;margin:18px 0;padding:18px 20px;border:1px solid #e4d9eb;border-radius:16px;background:linear-gradient(135deg,#fff 0%,#fbf8fd 100%);box-shadow:0 10px 26px rgba(66,18,96,.05)}.conecta-next-kicker{display:inline-flex;align-items:center;gap:7px;margin-bottom:7px;color:#6b238f;font:800 9.5px Montserrat;text-transform:uppercase;letter-spacing:.08em}.conecta-next-kicker i{width:8px;height:8px;border-radius:50%;background:#8C55B2;box-shadow:0 0 0 4px #F0E8F6}.conecta-next.ready .conecta-next-kicker i{background:#46bd7b;box-shadow:0 0 0 4px #e8f7ef}.conecta-next h3{margin:0;color:#351649;font-size:15px}.conecta-next-title{display:flex;align-items:center;gap:9px;flex-wrap:wrap}.conecta-next-state{display:inline-flex;align-items:center;gap:6px;padding:5px 8px;border-radius:999px;background:#e8f8ef;color:#24724c;font:800 9px Montserrat,Arial,sans-serif;text-transform:uppercase;letter-spacing:.04em}.conecta-next-state.warn{background:#fff3d8;color:#8d6418}.conecta-next-state.err{background:#ffe8eb;color:#a53b4a}.conecta-next p{margin:5px 0 0;color:#806f89;font-size:11px;line-height:1.55}.conecta-next-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.conecta-next-meta span{display:inline-flex;padding:5px 8px;border-radius:999px;background:#f1ebf6;color:#6b5476;font-size:9.5px}.conecta-next-actions{display:flex;gap:9px;align-items:center}.conecta-next-actions button{white-space:nowrap}.conecta-next-note{margin-top:9px;color:#9b8ea3;font-size:9.5px;line-height:1.45}.conecta-kpis{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin:18px 0}.conecta-kpi{background:#fff;border:1px solid #ebe4f1;border-radius:16px;padding:17px 18px}.conecta-kpi span{display:block;color:#84778f;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}.conecta-kpi strong{display:block;margin:7px 0 3px;font-size:27px;color:#421260;letter-spacing:-.6px}.conecta-kpi small{color:#9a8da4;font-size:10.5px}.conecta-kpi.clickable{position:relative;cursor:pointer;padding-right:38px;transition:.18s ease}.conecta-kpi.clickable:after{content:"›";position:absolute;right:16px;bottom:15px;width:23px;height:23px;border-radius:50%;display:grid;place-items:center;background:#f2eaf7;color:#6b238f;font:800 18px/1 Arial,sans-serif;transition:.18s ease}.conecta-kpi.clickable:hover{transform:translateY(-2px);border-color:#d9c5e6;box-shadow:0 10px 26px rgba(80,28,110,.09)}.conecta-kpi.clickable:hover:after{background:#6b238f;color:#fff;transform:translateX(2px)}'+
  '.conecta-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(280px,.55fr);gap:16px}.conecta-card{background:#fff;border:1px solid #ebe4f1;border-radius:17px;padding:18px}.conecta-card-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:14px}.conecta-card-head h3{margin:0;font-size:17px;line-height:1.25;color:#2f173e}.conecta-card-head p{margin:5px 0 0;color:#6f6279;font-size:12px;line-height:1.45}.conecta-card-head button{border:0;background:#f2ecf7;color:#5a1888;border-radius:9px;padding:8px 10px;font:700 10px Montserrat;cursor:pointer}'+
  '.conecta-vagas-search{display:flex;align-items:center;gap:10px;margin:2px 0 15px;padding:10px 12px;border:1px solid #e4dbea;border-radius:13px;background:#fbf9fd}.conecta-vagas-search-icon{width:32px;height:32px;flex:0 0 32px;border-radius:9px;display:grid;place-items:center;background:#f0e8f6;color:#64208f;font-size:16px}.conecta-vagas-search input{flex:1;min-width:0;border:0!important;outline:0!important;background:transparent!important;box-shadow:none!important;padding:0!important;height:32px;font:500 13px Montserrat,Arial,sans-serif!important;color:#2f2138!important}.conecta-vagas-search input::placeholder{color:#9a8da3}.conecta-vagas-search button{border:0;background:transparent;color:#6f6279;font:700 10.5px Montserrat,Arial,sans-serif;cursor:pointer;padding:7px 8px;border-radius:8px}.conecta-vagas-search button:hover{background:#f0e8f6;color:#5b168d}.conecta-vagas-search-count{white-space:nowrap;padding:6px 9px;border-radius:999px;background:#f1ebf6;color:#5b168d;font:800 9.5px Montserrat,Arial,sans-serif}.conecta-search-empty{display:none;padding:24px 14px;text-align:center;color:#81748a;font-size:11.5px}.conecta-table{display:grid}.conecta-row{display:grid;grid-template-columns:minmax(0,1.65fr) 105px 110px 105px;gap:14px;align-items:center;padding:14px 4px;border-top:1px solid #f0ebf3}.conecta-row:first-child{border-top:0}.conecta-row>div{min-width:0}.conecta-row strong{display:block;font-size:13.5px;line-height:1.42;color:#2f2138;font-weight:750;letter-spacing:-.1px}.conecta-row small{display:block;margin-top:4px;font-size:11.5px;line-height:1.35;color:#6f6279}.conecta-row>span:not(.conecta-status){font-size:11.5px;line-height:1.35;color:#75687f}.conecta-status{display:inline-flex!important;justify-content:center;align-items:center;border-radius:999px;padding:6px 9px;font-size:11px!important;line-height:1.1;font-weight:750!important}.conecta-status.ok{background:#eaf8f1;color:#24724c}.conecta-status.pend{background:#fff3d7;color:#8e6518}.conecta-status.err{background:#ffe8eb;color:#a53b4a}'+
  '.conecta-empty{padding:28px 14px;text-align:center;border:1px dashed #ddd0e7;border-radius:13px;color:#8d7c99}.conecta-empty b{display:block;color:#4c2761;margin-bottom:5px;font-size:12px}.conecta-empty span{font-size:11px}'+
  '.conecta-trial{margin:0 0 18px;padding:16px 18px;border:1px solid #e1d3eb;border-radius:15px;background:#fbf7fe;display:flex;justify-content:space-between;gap:16px;align-items:center}.conecta-trial strong{display:block;color:#4b1767;font-size:13px}.conecta-trial span{display:block;margin-top:4px;color:#76637f;font-size:10.5px}.conecta-trial b{color:#6b238f}.conecta-trial.exp{border-color:#ecd9dd;background:#fff8f9}.conecta-job-select{display:grid;grid-template-columns:28px minmax(0,1fr) auto;gap:11px;align-items:center;padding:12px 5px;border-top:1px solid #f0ebf3}.conecta-job-select input{width:18px;height:18px;accent-color:#6b238f}.conecta-job-select strong{display:block;color:#3c2d46;font-size:12px}.conecta-job-select small{display:block;margin-top:3px;color:#8a7c93;font-size:10px;word-break:break-all}.conecta-job-select button{border:0;background:#f2ecf7;color:#5a1888;border-radius:9px;padding:8px 10px;font:700 10px Montserrat;cursor:pointer}.conecta-select-head{display:flex;justify-content:space-between;gap:12px;align-items:center;margin:0 0 12px;padding:12px 14px;border-radius:12px;background:#f6f0fa}.conecta-select-head strong{color:#4b1767;font-size:12px}.conecta-select-head span{color:#6b238f;font-size:11px;font-weight:800}'+
  '.conecta-status-box{display:grid;gap:12px}.conecta-health{display:flex;gap:10px;align-items:center;padding:12px;border-radius:12px;background:#f7f3fa}.conecta-health i{width:11px;height:11px;border-radius:50%;background:#53c38b;box-shadow:0 0 0 4px #e3f7ed}.conecta-health.off i{background:#c6b8cf;box-shadow:0 0 0 4px #f0ebf3}.conecta-health strong{display:block;font-size:12px}.conecta-health small{display:block;margin-top:3px;color:#8c8094;font-size:10px}'+
  '.conecta-section{display:none}.conecta-section.ativo{display:block}.conecta-settings{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.conecta-field{display:grid;gap:6px}.conecta-field.full{grid-column:1/-1}.conecta-field label{font-size:10px;font-weight:800;color:#66536f;text-transform:uppercase;letter-spacing:.05em}.conecta-field input,.conecta-field select{width:100%;border:1px solid #dfd5e6;background:#fff;border-radius:10px;padding:11px 12px;font:500 12px Montserrat;color:#3d2b47;outline:none}.conecta-field input:focus,.conecta-field select:focus{border-color:#7d36a9;box-shadow:0 0 0 3px rgba(125,54,169,.08)}'+
  '.conecta-integracao-card{padding:0!important;overflow:hidden;background:#fff!important;border:1px solid #e2d8e9!important;box-shadow:0 18px 44px rgba(68,24,95,.07)}.conecta-integracao-head{display:flex;align-items:center;gap:15px;padding:22px 24px;border-bottom:1px solid #ece5f0;background:linear-gradient(180deg,#fff 0%,#fbf8fd 100%)}.conecta-integracao-icon{width:46px;height:46px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(135deg,#6b1c9b,#8f4fba);color:#fff;font-size:20px;box-shadow:0 9px 22px rgba(91,22,141,.22)}.conecta-integracao-head h3{margin:0;color:#2f143f;font-size:19px;letter-spacing:-.25px}.conecta-integracao-head p{margin:5px 0 0;color:#75677e;font-size:12px;line-height:1.55}.conecta-integracao-status{margin-left:auto;display:inline-flex;align-items:center;gap:8px;padding:8px 11px;border-radius:999px;background:#f5eff9;color:#6b238f;font:800 10px Montserrat}.conecta-integracao-status i{width:8px;height:8px;border-radius:50%;background:#b8a7c1}.conecta-integracao-status.ok i{background:#43bd7b;box-shadow:0 0 0 4px #e7f7ee}.conecta-integracao-body{padding:24px;background:#fcfbfd}.conecta-form-section{position:relative;border:1px solid #e8e0ed;border-radius:18px;background:#fff;padding:22px;margin-bottom:18px;box-shadow:0 7px 20px rgba(54,24,72,.035)}.conecta-form-section:last-of-type{margin-bottom:0}.conecta-form-section-title{display:flex;align-items:flex-start;gap:14px;margin-bottom:20px;padding-bottom:17px;border-bottom:1px solid #f0eaf3}.conecta-form-section-title i{width:42px;height:42px;border-radius:13px;display:grid;place-items:center;background:linear-gradient(145deg,#f5eef9,#ede2f5);color:#641b94;font-style:normal;font-weight:900;font-size:14px;flex:0 0 42px;border:1px solid #eadcf1;box-shadow:inset 0 1px 0 #fff}.conecta-form-section-title strong{display:flex;align-items:center;gap:8px;flex-wrap:wrap;color:#2f173e;font-size:15px;line-height:1.35}.conecta-form-section-title span{display:block;margin-top:4px;color:#81748a;font-size:11.5px;line-height:1.5}.conecta-opcional-badge{display:inline-flex;align-items:center;padding:4px 8px;border-radius:999px;background:#f1ebf6;color:#6b238f;font:800 8.5px/1 Montserrat,Arial,sans-serif;font-style:normal;text-transform:uppercase;letter-spacing:.06em}.conecta-form-section-opcional{background:linear-gradient(180deg,#fff,#fdfbfe)}.conecta-integracao-card .conecta-settings{gap:17px 16px}.conecta-integracao-card .conecta-field{gap:7px}.conecta-integracao-card .conecta-field label{font-size:12.5px;line-height:1.25;color:#2f173e;font-weight:850;text-transform:uppercase;letter-spacing:.055em;margin-bottom:2px}.conecta-integracao-card .conecta-field label:after{content:"";display:inline-block;width:18px;height:2px;margin-left:7px;vertical-align:middle;border-radius:999px;background:#8a3fba;opacity:.55}.conecta-integracao-card .conecta-field input,.conecta-integracao-card .conecta-field select{min-height:52px;border:1px solid #dcd1e4;border-radius:13px;padding:0 15px;font:500 14px/1.25 Montserrat,Arial,sans-serif;color:#2f2933;background:#fff;transition:.18s ease;box-shadow:0 1px 0 rgba(45,22,59,.02)}.conecta-integracao-card .conecta-field input::placeholder{color:#a89bad;font-weight:450}.conecta-integracao-card .conecta-field input:hover,.conecta-integracao-card .conecta-field select:hover{border-color:#c7b5d3}.conecta-integracao-card .conecta-field input:focus,.conecta-integracao-card .conecta-field select:focus{border-color:#7b2fa5;box-shadow:0 0 0 4px rgba(123,47,165,.09)}.conecta-field-help{margin-top:1px;color:#8c7f94;font-size:10.5px;line-height:1.5}.conecta-sistema-info{grid-column:1/-1;display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:11px;padding:13px 14px;border:1px solid #e3d8ea;border-radius:13px;background:linear-gradient(90deg,#faf6fc,#fff)}.conecta-sistema-info:before{content:"✓";width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:#eee3f5;color:#6a2196;font-weight:900}.conecta-sistema-info strong{display:block;color:#391d49;font-size:12px}.conecta-sistema-info span{grid-column:2;display:block;color:#7d6f86;font-size:10.5px;line-height:1.45}.conecta-sistema-info:after{content:"COMPATÍVEL";grid-column:3;grid-row:1/3;align-self:center;padding:6px 8px;border-radius:999px;background:#eaf8f1;color:#26744d;font:800 8.5px Montserrat}.conecta-destino-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:17px}.conecta-destino-option{border:1px solid #e1d7e8;background:#fff;border-radius:14px;padding:13px;text-align:left;cursor:pointer;transition:.18s ease;color:#3e2a49}.conecta-destino-option:hover{border-color:#bfa7ce;transform:translateY(-1px)}.conecta-destino-option.ativo{border-color:#7426a2;background:#f7f0fb;box-shadow:0 0 0 3px rgba(116,38,162,.07)}.conecta-destino-option b{display:block;font-size:11.5px;color:#3c1b4f;margin-bottom:4px}.conecta-destino-option small{display:block;font-size:9.5px;line-height:1.45;color:#887a91}.conecta-destino-option i{display:grid;place-items:center;width:29px;height:29px;margin-bottom:9px;border-radius:9px;background:#f1e8f7;color:#6c2099;font-style:normal;font-size:14px}.conecta-destino-select-hidden{position:absolute!important;opacity:0!important;pointer-events:none!important;width:1px!important;height:1px!important}.conecta-monitor-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.9fr);gap:16px}.conecta-monitor-note{border:1px solid #e6dcec;border-radius:14px;background:#faf7fc;padding:15px}.conecta-monitor-note strong{display:block;color:#3c1b4f;font-size:12px;margin-bottom:5px}.conecta-monitor-note span{display:block;color:#81738a;font-size:10.5px;line-height:1.55}.conecta-resumo-integracao{margin-top:18px;border:1px solid #e6dcec;border-radius:16px;background:linear-gradient(135deg,#faf6fc,#fff);padding:16px}.conecta-resumo-integracao>strong{display:block;color:#371947;font-size:13px;margin-bottom:11px}.conecta-resumo-itens{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.conecta-resumo-itens span{display:flex;align-items:center;gap:7px;padding:9px 10px;border-radius:10px;background:#fff;border:1px solid #eee7f2;color:#6f6178;font-size:9.8px;font-weight:700}.conecta-resumo-itens span:before{content:"✓";display:grid;place-items:center;width:18px;height:18px;border-radius:50%;background:#e8f7ef;color:#278054;font-size:10px}.conecta-integracao-actions{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:18px 24px;border-top:1px solid #eee7f2;background:#fff}.conecta-integracao-actions .conecta-btn.pri{min-width:205px;min-height:46px;font-size:12px;border-radius:12px;background:linear-gradient(135deg,#6f1da2,#54127e)}@media(max-width:900px){.conecta-destino-grid,.conecta-resumo-itens{grid-template-columns:repeat(2,minmax(0,1fr))}.conecta-monitor-grid{grid-template-columns:1fr}}@media(max-width:620px){.conecta-integracao-head{align-items:flex-start;flex-wrap:wrap}.conecta-integracao-status{margin-left:61px}.conecta-integracao-body{padding:14px}.conecta-form-section{padding:16px}.conecta-destino-grid,.conecta-resumo-itens{grid-template-columns:1fr}.conecta-integracao-actions{align-items:stretch;flex-direction:column}.conecta-integracao-actions .conecta-btn.pri{width:100%}}'+
  '.conecta-modal{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:20px}.conecta-modal-back{position:absolute;inset:0;background:rgba(30,14,40,.58);backdrop-filter:blur(3px)}.conecta-modal-card{position:relative;z-index:1;width:min(620px,calc(100vw - 32px));max-height:calc(100vh - 40px);overflow:auto;background:#fff;border:1px solid #e5dbea;border-radius:18px;padding:22px;box-shadow:0 28px 80px rgba(37,12,53,.28)}.conecta-modal-card h3{margin:0;color:#35104f;font-size:19px}.conecta-modal-card>p{margin:6px 0 18px;color:#81728a;font-size:11.5px}.conecta-modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:18px;padding-top:16px;border-top:1px solid #eee7f2}.conecta-modal-actions button{border:0;border-radius:10px;padding:10px 15px;font:700 11px Montserrat,Arial,sans-serif;cursor:pointer}.conecta-modal-actions .cancelar{background:#f1ecf4;color:#5e4a69}.conecta-modal-actions .salvar{background:#5b168d;color:#fff}.conecta-vaga-acao{border:1px solid #5b168d!important;background:#fff!important;color:#421260!important;border-radius:8px!important;padding:7px 11px!important;font:700 10.5px Montserrat,Arial,sans-serif!important;cursor:pointer!important}.conecta-vaga-acao:hover{background:#f5eef9!important}' +
  '.conecta-history{display:grid}.conecta-history article{display:grid;grid-template-columns:12px minmax(0,1fr) auto;gap:11px;align-items:start;padding:12px 0;border-top:1px solid #f0ebf3}.conecta-history article:first-child{border-top:0}.conecta-history i{width:8px;height:8px;border-radius:50%;background:#6f2ca0;margin-top:4px}.conecta-history strong{display:block;font-size:11.5px}.conecta-history span{display:block;margin-top:3px;color:#897b93;font-size:10.5px}.conecta-history small{color:#a293aa;font-size:9.5px;white-space:nowrap}'+
  '.conecta-profile-layout{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(300px,.75fr);gap:18px;align-items:start}.conecta-profile-form{display:grid;gap:16px}.conecta-profile-block{background:#fff;border:1px solid #ebe4f1;border-radius:18px;padding:20px}.conecta-profile-block h3{margin:0 0 5px;color:#3a174e;font-size:16px}.conecta-profile-block>p{margin:0 0 17px;color:#8b7e94;font-size:11px;line-height:1.55}.conecta-profile-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.conecta-profile-field{display:grid;gap:6px}.conecta-profile-field.full{grid-column:1/-1}.conecta-profile-field label{font-size:10px;font-weight:800;color:#66536f;text-transform:uppercase;letter-spacing:.05em}.conecta-profile-field input,.conecta-profile-field textarea{width:100%;border:1px solid #dfd5e6;background:#fff;border-radius:10px;padding:11px 12px;font:500 12px Montserrat;color:#3d2b47;outline:none}.conecta-profile-field textarea{min-height:105px;resize:vertical;line-height:1.55}.conecta-profile-field input:focus,.conecta-profile-field textarea:focus{border-color:#7d36a9;box-shadow:0 0 0 3px rgba(125,54,169,.08)}.conecta-segmento-picker{position:relative}.conecta-segmento-trigger{width:100%;min-height:44px;border:1px solid #dfd5e6;background:#fff;border-radius:10px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px;text-align:left;color:#3d2b47;font:500 12px Montserrat,Arial,sans-serif;cursor:pointer}.conecta-segmento-trigger:hover{border-color:#c9b8d4}.conecta-segmento-trigger:focus{border-color:#7d36a9;box-shadow:0 0 0 3px rgba(125,54,169,.08);outline:0}.conecta-segmento-trigger b{font-size:14px;color:#6b238f;font-weight:800}.conecta-segmento-menu{display:none;position:absolute;z-index:50;left:0;right:0;top:calc(100% + 7px);max-height:320px;overflow:auto;padding:6px;border:1px solid #ddd0e6;border-radius:13px;background:#fff;box-shadow:0 16px 38px rgba(48,20,63,.16)}.conecta-segmento-menu.aberto{display:block}.conecta-segmento-opcao{display:block;width:100%;border:0;background:#fff;text-align:left;padding:10px 12px;border-radius:8px;cursor:pointer;color:#3f3347;font:500 12px/1.35 Montserrat,Arial,sans-serif}.conecta-segmento-opcao:hover{background:#f7f2fa;color:#5b1e8c}.conecta-segmento-opcao.ativo{background:#f1e8f7;color:#5b1e8c;font-weight:700}.conecta-profile-media{display:grid;grid-template-columns:150px minmax(0,1fr);gap:14px}.conecta-profile-upload{border:1px solid #dfd5e6;border-radius:14px;background:#fbf9fd;padding:12px}.conecta-profile-upload strong{display:block;font-size:11px;color:#4a2a5b;margin-bottom:9px}.conecta-profile-preview{display:grid;place-items:center;overflow:hidden;height:108px;border:1px dashed #d8cbe1;border-radius:12px;background:#fff;color:#9a8ba3;font:700 10px Montserrat}.conecta-profile-preview img{width:100%;height:100%;object-fit:contain}.conecta-profile-preview.capa img{object-fit:cover}.conecta-profile-upload label{display:flex;justify-content:center;margin-top:9px;border-radius:9px;background:#efe7f5;color:#5b168d;padding:9px 10px;font:750 10px Montserrat;cursor:pointer}.conecta-profile-upload input[type=file]{display:none}.conecta-profile-preview-card{position:sticky;top:94px;background:#fff;border:1px solid #e7deed;border-radius:20px;overflow:hidden;box-shadow:0 14px 34px rgba(60,28,77,.08)}.conecta-profile-preview-cover{height:142px;background:linear-gradient(135deg,#6d22a0,#3c105f);overflow:hidden}.conecta-profile-preview-cover img{width:100%;height:100%;object-fit:cover}.conecta-profile-preview-body{padding:0 20px 22px}.conecta-profile-preview-logo{width:82px;height:82px;margin-top:-42px;border:5px solid #fff;border-radius:18px;background:#fff;box-shadow:0 7px 18px rgba(51,22,66,.12);overflow:hidden;display:grid;place-items:center;color:#6a2c8e;font-weight:850}.conecta-profile-preview-logo img{width:100%;height:100%;object-fit:contain}.conecta-profile-preview-body h3{margin:13px 0 5px;font-size:18px;color:#331644}.conecta-profile-preview-meta{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 13px}.conecta-profile-preview-meta span{padding:5px 7px;border-radius:7px;background:#f4eff7;color:#6b5576;font-size:9.5px}.conecta-profile-preview-body p{margin:0;color:#786a80;font-size:11px;line-height:1.6}.conecta-profile-link{display:inline-flex;margin-top:14px;color:#6c1f9c;font-size:10.5px;font-weight:750;text-decoration:none}.conecta-docs{display:grid;gap:16px}.conecta-docs-hero{padding:24px;border:1px solid #e5d9ed;border-radius:18px;background:linear-gradient(135deg,#fff 0%,#faf6fc 100%);box-shadow:0 8px 24px rgba(72,29,96,.045)}.conecta-docs-hero span{display:block;color:#741da5;font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase}.conecta-docs-hero h2{margin:8px 0;color:#35104f;font-size:22px}.conecta-docs-hero p{margin:0;color:#6f6279;font-size:12.5px;line-height:1.65;max-width:900px}.conecta-docs-alert{display:grid;grid-template-columns:34px minmax(0,1fr);gap:12px;align-items:start;padding:15px 16px;border:1px solid #eadcf1;border-radius:14px;background:#fbf8fd}.conecta-docs-alert i{width:34px;height:34px;border-radius:10px;background:#efe3f6;color:#6b238f;display:grid;place-items:center;font-style:normal;font-weight:800}.conecta-docs-alert strong{display:block;color:#4b1c62;font-size:12px;margin-bottom:3px}.conecta-docs-alert span{display:block;color:#76677f;font-size:10.5px;line-height:1.5}.conecta-docs-nav{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px}.conecta-docs-nav button{border:1px solid #e5dbea;border-radius:11px;background:#fff;color:#5c4468;padding:10px 11px;font:700 10px Montserrat,Arial,sans-serif;cursor:pointer}.conecta-docs details{border:1px solid #e5dbea;border-radius:14px;background:#fff;overflow:hidden}.conecta-docs summary{list-style:none;cursor:pointer;padding:16px 18px;color:#35104f;font-size:13px;font-weight:800;display:flex;justify-content:space-between;gap:12px}.conecta-docs summary::-webkit-details-marker{display:none}.conecta-docs summary:after{content:"+";width:24px;height:24px;border-radius:8px;background:#f2e9f7;color:#6b238f;display:grid;place-items:center}.conecta-docs details[open] summary:after{content:"−"}.conecta-docs details[open] summary{border-bottom:1px solid #eee4f2;background:#fcfafd}.conecta-doc-body{padding:18px;color:#586775;font-size:11.5px;line-height:1.65}.conecta-doc-body h4{margin:16px 0 6px;color:#432455;font-size:12px}.conecta-doc-body h4:first-child{margin-top:0}.conecta-doc-body p{margin:0 0 10px}.conecta-doc-body ul,.conecta-doc-body ol{margin:7px 0 12px;padding-left:20px}.conecta-doc-body li{margin:5px 0}.conecta-doc-status{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.conecta-doc-status div{padding:12px;border:1px solid #ebe2ef;border-radius:11px;background:#fcfbfd}.conecta-doc-status b{display:block;color:#4e235f;font-size:10.5px}.conecta-doc-status span{display:block;margin-top:3px;color:#7c6e84;font-size:9.5px;line-height:1.4}.conecta-doc-table{width:100%;border-collapse:collapse;margin:10px 0}.conecta-doc-table th,.conecta-doc-table td{padding:10px;border-bottom:1px solid #eee7f1;text-align:left;vertical-align:top}.conecta-doc-table th{color:#5b246e;font-size:10px;text-transform:uppercase}.conecta-doc-table td{color:#63717d;font-size:10.5px}.conecta-doc-ok{color:#24724f!important;font-weight:700}.conecta-doc-warn{color:#9a6a12!important;font-weight:700}.conecta-doc-info{color:#6b238f!important;font-weight:700}.conecta-profile-actions{display:flex;align-items:center;gap:12px}.conecta-profile-msg{font-size:10.5px;color:#75667e}.conecta-profile-msg.ok{color:#287650}.conecta-profile-msg.erro{color:#a13c51}.conecta-plans-wrap{display:flex;flex-direction:column;gap:18px}.conecta-plans-hero{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(260px,.65fr);gap:16px;padding:24px;border:1px solid #e6dcec;border-radius:18px;background:linear-gradient(135deg,#fff 0%,#f8f1fc 100%);box-shadow:0 12px 30px rgba(73,25,99,.05)}.conecta-plans-hero h3{margin:0 0 7px;color:#321441;font-size:21px;letter-spacing:-.3px}.conecta-plans-hero p{margin:0;color:#75677e;font-size:12px;line-height:1.65;max-width:720px}.conecta-plans-trial{align-self:stretch;display:flex;flex-direction:column;justify-content:center;padding:16px;border:1px solid #e2d6e9;border-radius:14px;background:#fff}.conecta-plans-trial small{display:block;color:#7f7188;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.08em}.conecta-plans-trial strong{display:block;margin:5px 0 3px;color:#5e178e;font-size:19px}.conecta-plans-trial span{color:#7d6f86;font-size:10.5px;line-height:1.5}.conecta-plans-launch{display:flex;align-items:center;gap:11px;padding:14px 16px;border-radius:14px;background:#5e178e;color:#fff;box-shadow:0 10px 24px rgba(94,23,142,.18)}.conecta-plans-launch b{font-size:12px}.conecta-plans-launch span{font-size:10.5px;line-height:1.5;opacity:.9}.conecta-plan-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.conecta-plan-card{position:relative;display:flex;flex-direction:column;min-height:430px;padding:21px;border:1px solid #e5dce9;border-radius:18px;background:#fff;box-shadow:0 10px 26px rgba(53,24,68,.045);transition:.18s ease}.conecta-plan-card:hover{transform:translateY(-2px);border-color:#ccb7d9;box-shadow:0 15px 34px rgba(70,25,96,.08)}.conecta-plan-card.recomendado{border:1.5px solid #7b2ca8;box-shadow:0 16px 36px rgba(97,31,139,.12)}.conecta-plan-badge{position:absolute;top:-11px;left:18px;padding:6px 10px;border-radius:999px;background:#6c1c9a;color:#fff;font-size:8.5px;font-weight:900;text-transform:uppercase;letter-spacing:.06em}.conecta-plan-name{margin:2px 0 4px;color:#311441;font-size:18px}.conecta-plan-desc{min-height:42px;color:#81738a;font-size:10.5px;line-height:1.5}.conecta-plan-price{margin:16px 0 2px;color:#2f153f}.conecta-plan-price small{display:block;margin-bottom:3px;color:#8a7c92;font-size:9.5px;font-weight:700}.conecta-plan-price strong{font-size:32px;letter-spacing:-1.1px;color:#5e178e}.conecta-plan-price em{font-style:normal;font-size:10.5px;color:#75677e}.conecta-plan-normal{margin-bottom:15px;color:#85768d;font-size:10px}.conecta-plan-normal s{margin-right:4px}.conecta-plan-list{display:flex;flex-direction:column;gap:9px;margin:0 0 20px;padding:15px 0;border-top:1px solid #f0eaf3;border-bottom:1px solid #f0eaf3}.conecta-plan-list span{display:flex;gap:8px;align-items:flex-start;color:#5e5067;font-size:10.5px;line-height:1.45}.conecta-plan-list span b{color:#4f8b6d}.conecta-plan-card .conecta-btn{margin-top:auto;width:100%;min-height:43px}.conecta-plan-note{text-align:center;color:#8a7c91;font-size:9.5px;line-height:1.5}.conecta-plan-status{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 18px;border:1px solid #e9e2ed;border-radius:14px;background:#fff}.conecta-plan-status strong{display:block;color:#3b1b4c;font-size:12px}.conecta-plan-status span{display:block;margin-top:3px;color:#83758b;font-size:10.5px}.conecta-plan-status .conecta-btn{white-space:nowrap}'+
  '@media(max-width:980px){.conecta-plan-grid{grid-template-columns:1fr}.conecta-plans-hero{grid-template-columns:1fr}.conecta-docs-nav{grid-template-columns:1fr 1fr}.conecta-doc-status{grid-template-columns:1fr}.conecta-app{grid-template-columns:1fr}.conecta-side{position:relative;padding:16px}.conecta-brand{border-bottom:0;padding-bottom:4px}.conecta-nav{display:flex;overflow:auto;gap:8px;padding-bottom:3px}.conecta-nav-group{display:contents}.conecta-nav-group-title{display:none}.conecta-nav button{white-space:nowrap;display:flex;grid-template-columns:none;min-height:48px;min-width:max-content;padding:7px 10px}.conecta-nav button:after,.conecta-nav button.ativo:before{display:none}.conecta-nav-ico{width:34px;height:34px;flex:0 0 34px}.conecta-nav-label small{display:none}.conecta-side-foot{display:none}.conecta-main{padding:20px}.conecta-hero{grid-template-columns:1fr}.conecta-kpis{grid-template-columns:repeat(2,1fr)}.conecta-grid{grid-template-columns:1fr}.conecta-profile-layout{grid-template-columns:1fr}.conecta-profile-preview-card{position:relative;top:auto}}'+
  '@media(max-width:620px){.conecta-next{grid-template-columns:1fr}.conecta-next-actions{width:100%}.conecta-next-actions .conecta-btn{flex:1}.conecta-integracao-head{align-items:flex-start;padding:17px}.conecta-integracao-status{margin-left:0}.conecta-integracao-head{flex-wrap:wrap}.conecta-integracao-body{padding:14px}.conecta-form-section{padding:14px}.conecta-integracao-actions{padding:14px}.conecta-integracao-actions .conecta-btn.pri{width:100%}.conecta-main{padding:14px}.conecta-top{align-items:flex-start;flex-direction:column}.conecta-top-identidade{width:100%;gap:12px}.conecta-top-logo{width:54px;height:54px;flex-basis:54px;border-radius:13px}.conecta-top-actions{width:100%}.conecta-top-actions .conecta-btn{flex:1}.conecta-kpis{grid-template-columns:1fr 1fr;gap:9px}.conecta-kpi{padding:13px}.conecta-kpi strong{font-size:22px}.conecta-row{grid-template-columns:minmax(0,1fr) 96px;gap:10px;padding:13px 2px}.conecta-row strong{font-size:13px}.conecta-row small{font-size:11px}.conecta-status{font-size:10.5px!important}.conecta-row>:nth-child(3),.conecta-row>:nth-child(4){display:none}.conecta-settings{grid-template-columns:1fr}.conecta-field.full{grid-column:auto}.conecta-profile-grid,.conecta-profile-media{grid-template-columns:1fr}.conecta-profile-field.full{grid-column:auto}}';
  document.head.appendChild(st)
 }
 const sec=document.createElement('section');sec.id='pagina-painel-conecta';sec.className='pagina';
 sec.innerHTML='<div class="conecta-app">'+
  '<aside class="conecta-side"><div class="conecta-brand conecta-brand-site"><div class="conecta-brand-logo"><span>+</span><strong>Empregos</strong></div><small>Conecta · integração e gestão automática de vagas</small></div>'+
  '<div class="conecta-side-company"><div class="conecta-side-company-logo" id="conectaSideLogoEM">E</div><div class="conecta-side-company-info"><small>Conecta ativo</small><strong id="conectaSideEmpresaTopoEM">Minha empresa</strong><span id="conectaSidePlanoEM">Conta empresarial</span></div></div>'+
  '<nav class="conecta-nav">'+
  '<div class="conecta-nav-group"><span class="conecta-nav-group-title">Operação</span>'+
  '<button class="ativo" data-conecta-tab="geral" onclick="conectaAbaEM(\'geral\',this)"><span class="conecta-nav-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg></span><span class="conecta-nav-label"><b>Visão geral</b><small>Resumo da operação</small></span></button>'+
  '<button data-conecta-tab="integracao" onclick="conectaAbaEM(\'integracao\',this)"><span class="conecta-nav-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 12h8"/><path d="M9 7 6 4 3 7l3 3 3-3Z"/><path d="m15 17 3 3 3-3-3-3-3 3Z"/><path d="M6 10v2a5 5 0 0 0 5 5h4"/></svg></span><span class="conecta-nav-label"><b>Integração</b><small>Origem e sincronização</small></span></button>'+
  '<button data-conecta-tab="vagas" onclick="conectaAbaEM(\'vagas\',this)"><span class="conecta-nav-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/><path d="M10 12v2h4v-2"/></svg></span><span class="conecta-nav-label"><b>Vagas sincronizadas</b><small>Oportunidades integradas</small></span></button>'+
  '<button data-conecta-tab="historico" onclick="conectaAbaEM(\'historico\',this)"><span class="conecta-nav-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v6h6"/><path d="M12 7v5l3 2"/></svg></span><span class="conecta-nav-label"><b>Histórico</b><small>Execuções e alterações</small></span></button>'+
  '</div>'+
  '<div class="conecta-nav-group"><span class="conecta-nav-group-title">Empresa e conta</span>'+
  '<button data-conecta-tab="perfil" onclick="conectaAbaEM(\'perfil\',this)"><span class="conecta-nav-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21V6l8-3 8 3v15"/><path d="M9 21v-5h6v5"/><path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01"/></svg></span><span class="conecta-nav-label"><b>Perfil da empresa</b><small>Identidade pública</small></span></button>'+
  '<button data-conecta-tab="planos" onclick="conectaAbaEM(\'planos\',this)"><span class="conecta-nav-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 7 5-7 5-7-5 7-5Z"/><path d="m5 12 7 5 7-5"/><path d="m5 16 7 5 7-5"/></svg></span><span class="conecta-nav-label"><b>Planos</b><small>Capacidade e assinatura</small></span></button>'+
  '<button data-conecta-tab="config" onclick="conectaAbaEM(\'config\',this)"><span class="conecta-nav-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.4.3.7.7.6 1.2v3.6c.1.5-.2.9-.6 1.2Z"/></svg></span><span class="conecta-nav-label"><b>Configurações</b><small>Preferências do Conecta</small></span></button>'+
  '<button data-conecta-tab="docs" onclick="conectaAbaEM(\'docs\',this)"><span class="conecta-nav-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5a3 3 0 0 1 3-3h12v18H7a3 3 0 0 0-3 3V5Z"/><path d="M4 20a3 3 0 0 1 3-3h12"/><path d="M9 7h6M9 11h6"/></svg></span><span class="conecta-nav-label"><b>Documentação</b><small>Ajuda e boas práticas</small></span></button>'+
  '</div>'+
  '</nav>'+
  '<div class="conecta-side-foot"><small>CONTA CONECTA</small><strong>Ambiente empresarial</strong><button type="button" onclick="conectaAbaEM(\'docs\')">Abrir central de ajuda</button></div></aside>'+
  '<main class="conecta-main"><div class="conecta-top"><div class="conecta-top-identidade"><div class="conecta-top-logo" id="conectaTopLogoEM" aria-label="Logo da empresa"><span>E</span></div><div class="conecta-top-texto"><h1 id="conectaTituloEM">Painel Conecta</h1><p id="conectaSubtituloEM">Gerencie sua integração de vagas em um só lugar.</p></div></div><div class="conecta-top-actions"><button class="conecta-btn sec" type="button" onclick="conectaAbaEM(\'integracao\')">Configurar integração</button><button class="conecta-btn pri" id="conectaSyncBtnEM" type="button" onclick="sincronizarAgoraConectaEM()">Sincronizar agora</button></div></div>'+
  '<div id="conectaSecGeralEM" class="conecta-section ativo"></div><div id="conectaSecIntegracaoEM" class="conecta-section"></div><div id="conectaSecVagasEM" class="conecta-section"></div><div id="conectaSecHistoricoEM" class="conecta-section"></div><div id="conectaSecPerfilEM" class="conecta-section"></div><div id="conectaSecPlanosEM" class="conecta-section"></div><div id="conectaSecConfigEM" class="conecta-section"></div><div id="conectaSecDocsEM" class="conecta-section"></div>'+
  '</main></div>';
 const paginaReferencia=
  document.getElementById('pagina-painel-empresa')||
  document.getElementById('pagina-home')||
  document.querySelector('.pagina');
 const hostPaginas=paginaReferencia?.parentElement;
 if(!hostPaginas)return;

 const paginasExistentes=[...hostPaginas.children].filter(el=>el!==sec&&el.classList?.contains('pagina'));
 const ultimaPagina=paginasExistentes[paginasExistentes.length-1]||null;
 const footerDireto=[...hostPaginas.children].find(el=>
   el.tagName==='FOOTER'||
   el.id==='footer'||
   el.id==='rodape'||
   el.classList?.contains('site-footer')||
   el.classList?.contains('rodape')
 )||null;

 if(footerDireto)hostPaginas.insertBefore(sec,footerDireto);
 else if(ultimaPagina)ultimaPagina.insertAdjacentElement('afterend',sec);
 else hostPaginas.appendChild(sec)
}
function normalizarOrdemPainelConectaEM(){
 const sec=document.getElementById('pagina-painel-conecta');if(!sec)return;
 const ref=document.getElementById('pagina-painel-empresa')||document.getElementById('pagina-home')||document.querySelector('.pagina:not(#pagina-painel-conecta)');
 const host=ref?.parentElement;if(!host||sec.parentElement!==host)return;
 const footer=[...host.children].find(el=>el.tagName==='FOOTER'||el.id==='footer'||el.id==='rodape'||el.classList?.contains('site-footer')||el.classList?.contains('rodape'));
 if(footer&&sec.compareDocumentPosition(footer)&Node.DOCUMENT_POSITION_PRECEDING)host.insertBefore(sec,footer)
}
function atualizarLauncherConectaEM(){
 const btn=document.getElementById('empConectaLauncherEM');
 if(!btn)return;
 const p=new URLSearchParams(location.search).get('pagina')||'';
 btn.style.display=p==='painel-conecta'?'none':'flex';
}
function conectaAbaEM(aba,btn){
 garantirPainelConectaEM();
 const mapa={geral:'conectaSecGeralEM',integracao:'conectaSecIntegracaoEM',vagas:'conectaSecVagasEM',historico:'conectaSecHistoricoEM',perfil:'conectaSecPerfilEM',planos:'conectaSecPlanosEM',config:'conectaSecConfigEM',docs:'conectaSecDocsEM'};
 document.querySelectorAll('#pagina-painel-conecta .conecta-section').forEach(x=>x.classList.remove('ativo'));
 document.getElementById(mapa[aba]||mapa.geral)?.classList.add('ativo');
 document.querySelectorAll('#pagina-painel-conecta [data-conecta-tab]').forEach(x=>x.classList.toggle('ativo',x.dataset.conectaTab===aba));
 const titulos={geral:['Painel Conecta','Gerencie sua integração de vagas em um só lugar.'],integracao:['Integração','Defina a origem e como o +Empregos deve ler suas vagas.'],vagas:['Vagas sincronizadas','Acompanhe o que entrou pela integração.'],historico:['Histórico de sincronização','Veja as últimas execuções e alterações.'],perfil:['Perfil da empresa','Monte a página institucional exibida aos candidatos.'],planos:['Planos Conecta','Escolha a capacidade ideal para o volume de vagas da sua empresa.'],config:['Configurações','Ajuste frequência e preferências da integração.'],docs:['Documentação do Conecta','Configuração, sincronização, segurança, falhas e boas práticas.']};
 const t=titulos[aba]||titulos.geral;
 const h=document.getElementById('conectaTituloEM'),p=document.getElementById('conectaSubtituloEM');if(h)h.textContent=t[0];if(p)p.textContent=t[1];
 renderPainelConectaEM()
}
function conectaSelecionarPlanoEM(codigo,nome){try{localStorage.setItem('empregaMaisConectaPlanoInteresse',String(codigo||''))}catch(_){}const texto=nome==='Conecta Enterprise'?'Interesse em '+nome+' registrado. A contratação personalizada será concluída com a equipe +Empregos.':nome+' selecionado. A etapa de pagamento ainda será conectada; nenhum valor foi cobrado.';if(typeof window.mostrarToast==='function')window.mostrarToast(texto);else alert(texto)}
window.conectaSelecionarPlanoEM=conectaSelecionarPlanoEM;
function conectaDataEM(v){try{return v?new Date(v).toLocaleString('pt-BR'):'—'}catch(_){return'—'}}
function conectaMetricasCacheEM(){
 try{return JSON.parse(sessionStorage.getItem('empregaMaisConectaMetricasCache')||'null')||{visualizacoes:0,cliques:0,enviados:0,conversao:0,porVaga:{}}}
 catch(_){return{visualizacoes:0,cliques:0,enviados:0,conversao:0,porVaga:{}}}
}
function conectaAplicarMetricasKpiEM(metricas){
 const m=metricas||{visualizacoes:0,cliques:0,enviados:0,conversao:0};
 const mapa={conectaKpiVisualizacoesEM:m.visualizacoes,conectaKpiCliquesEM:m.cliques,conectaKpiEnviadosEM:m.enviados,conectaKpiConversaoEM:String(m.conversao).replace('.',',')+'%'};
 Object.entries(mapa).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.textContent=String(v)})
}
async function conectaAtualizarMetricasAsyncEM(empresaId){
 try{
  const m=await conectaMetricasEmpresaEM(empresaId);
  try{sessionStorage.setItem('empregaMaisConectaMetricasCache',JSON.stringify(m))}catch(_){}
  conectaAplicarMetricasKpiEM(m)
 }catch(err){console.warn('Conecta: métricas em segundo plano indisponíveis:',err)}
}

function conectaNormalizarBuscaEM(v){
 return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
}
function filtrarVagasConectaEM(valor){
 const box=document.getElementById('conectaListaVagasEM');if(!box)return;
 const q=conectaNormalizarBuscaEM(valor);
 const rows=[...box.querySelectorAll('.conecta-row[data-conecta-search]')];
 let visiveis=0;
 rows.forEach(row=>{
  const ok=!q||conectaNormalizarBuscaEM(row.dataset.conectaSearch).includes(q);
  row.style.display=ok?'':'none';
  if(ok)visiveis++;
 });
 const count=document.getElementById('conectaBuscaCountEM');if(count)count.textContent=visiveis+' de '+rows.length;
 const empty=document.getElementById('conectaBuscaVaziaEM');if(empty)empty.style.display=visiveis?'none':'block';
}
function limparBuscaVagasConectaEM(){
 const input=document.getElementById('conectaBuscaVagasEM');if(input){input.value='';input.focus()}filtrarVagasConectaEM('');
}
window.filtrarVagasConectaEM=filtrarVagasConectaEM;
window.limparBuscaVagasConectaEM=limparBuscaVagasConectaEM;
async function renderPainelConectaEM(opcoes={}){
 garantirPainelConectaEM();
 // Renderiza imediatamente com o estado local. A atualização remota acontece
 // depois que a estrutura já está visível, evitando tela vazia/lenta no F5.
 const carregarRemoto=opcoes.carregarRemoto!==false;
 const e=empresaLogada?.()||{},cfg=conectaConfigEM(),vagas=conectaVagasEmpresaEM(),hist=conectaHistoricoEM(),metricas=conectaMetricasCacheEM();
 const trial=conectaTrialInfoEM(cfg);
 const ativas=vagas.filter(v=>v.status==='aprovada'&&vagaDentroPrazo(v)).length;
 const atencao=vagas.filter(v=>v.status==='aprovada'&&!vagaDentroPrazo(v)).length;
 const pend=vagas.filter(v=>['pendente','em_analise','analise'].includes(String(v.status||'').toLowerCase())).length;
 const erros=vagas.filter(v=>['erro','falha','rejeitada'].includes(String(v.status||'').toLowerCase())).length;
 const nome=e.nome||sessionStorage.getItem('empresaNome')||'Minha empresa';
 const perfilConecta=typeof conectaPerfilEmpresaEM==='function'?conectaPerfilEmpresaEM():(e.perfil||{});
 const logoEmpresa=String(perfilConecta.logo||e.logo||e.logoUrl||e.perfil?.logo||'').trim();
 const logoTopo=document.getElementById('conectaTopLogoEM');
 if(logoTopo){logoTopo.innerHTML=logoEmpresa?'<img src="'+esc(logoEmpresa)+'" alt="Logo '+esc(nome)+'">':'<span>'+esc((String(nome).trim().charAt(0)||'E').toUpperCase())+'</span>';logoTopo.title=nome}
 const plano=(typeof planoEmpresaAtual==='function'?planoEmpresaAtual()?.nome:'')||e.planoNome||e.plano||'Ativo';
 const conectado=!!cfg.url;
 const ultimaMs=cfg.ultima?new Date(cfg.ultima).getTime():0,freqMin=Math.max(30,Number(cfg.frequencia||60)),agoraMs=Date.now(),limiteAtrasoMs=Math.max(freqMin*2,120)*60000;
 const syncAtrasada=!!(conectado&&ultimaMs&&agoraMs-ultimaMs>limiteAtrasoMs);
 const saude=(!conectado?'idle':(erros>0?'err':(!ultimaMs||syncAtrasada?'warn':'ok')));
 const saudeTexto=saude==='ok'?'Conecta ativo':saude==='warn'?'Conecta requer atenção':saude==='err'?'Conecta com erro':'Configuração pendente';
 const saudeResumo=saude==='ok'?'Integração funcionando normalmente.':saude==='warn'?(syncAtrasada?'Sincronização atrasada.':'Aguardando a primeira sincronização.'):(saude==='err'?'A integração precisa de atenção.':'Conecte seu portal de carreiras ao +Empregos.');
 const saudeDetalhe=saude==='ok'?(vagas.length+' vaga(s) sincronizada(s) e acompanhamento automático ativo.'):(saude==='warn'?'Revise o status da sincronização para manter as vagas atualizadas.':(saude==='err'?erros+' vaga(s) com erro precisam ser verificadas.':'Informe a origem das vagas para centralizar a publicação e reduzir trabalho manual da equipe de recrutamento.'));
 const sideTopo=document.getElementById('conectaSideEmpresaTopoEM');if(sideTopo)sideTopo.textContent=nome;
 const sidePlano=document.getElementById('conectaSidePlanoEM');if(sidePlano)sidePlano.textContent=trial.isTrial?(trial.ativo?'Período de experiência':'Teste encerrado'):('Plano '+plano);
 const sideLogo=document.getElementById('conectaSideLogoEM');if(sideLogo){sideLogo.innerHTML=logoEmpresa?'<img src="'+esc(logoEmpresa)+'" alt="Logo '+esc(nome)+'">':esc((String(nome).trim().charAt(0)||'E').toUpperCase())}
 const sync=document.getElementById('conectaSyncBtnEM');if(sync){sync.disabled=!conectado||trial.expirado;sync.title=trial.expirado?'Período gratuito encerrado':(conectado?'Detectar e sincronizar vagas escolhidas':'Configure uma origem antes de sincronizar')}
 const ult=vagas.slice().sort((a,b)=>new Date(b.atualizadoEm||b.criadoEm||0)-new Date(a.atualizadoEm||a.criadoEm||0)).slice(0,6);
 const linhas=ult.length?ult.map(v=>'<div class="conecta-row"><div><strong>'+esc(tituloVaga(v)||'Vaga')+'</strong><small>'+esc([v.cidade,v.estado||v.uf].filter(Boolean).join(' - ')||'Local não informado')+'</small></div><span class="conecta-status '+(v.status==='aprovada'?'ok':String(v.status||'').toLowerCase().includes('erro')?'err':'pend')+'">'+esc(v.status||'Pendente')+'</span><span>'+esc(conectaDestinoLabelEM(v.candidaturaTipo||cfg.destinoPadrao))+'</span><button class="conecta-vaga-acao" type="button" onclick="abrirDestinoVagaConectaEM(\''+String(v.id).replace(/'/g,'')+'\')">Configurar</button></div>').join(''):'<div class="conecta-empty"><b>Nenhuma vaga sincronizada ainda</b><span>'+(conectado?'A origem está configurada. Execute a primeira sincronização e acompanhe aqui as vagas identificadas.':'Configure a integração para começar a receber vagas automaticamente.')+'</span></div>';
 const trialBanner=trial.isTrial?'<div class="conecta-trial '+(trial.expirado?'exp':'')+'"><div><strong>'+(trial.ativo?'Período gratuito do Conecta':'Período gratuito encerrado')+'</strong><span>'+(trial.ativo?('<b>'+trial.dias+' dia(s) restante(s)</b> · 1 origem · até '+trial.limite+' vagas escolhidas pela empresa'):'A sincronização foi pausada até a ativação de um plano.')+'</span></div>'+(trial.ativo?'<button class="conecta-btn sec" type="button" onclick="conectaAbaEM(\'vagas\')">Escolher vagas</button>':'')+'</div>':'';
 const planosBox=document.getElementById('conectaSecPlanosEM');if(planosBox){
  const planoAtual=String(cfg.planoConecta||'').toLowerCase();
  const nomePlano=planoAtual==='essencial'?'Conecta Essencial':planoAtual==='profissional'?'Conecta Profissional':planoAtual==='escala'?'Conecta Escala':(trial.ativo?'Período de experiência':'Nenhum plano ativo');
  const statusPlano=trial.ativo?trial.dias+' dia(s) restante(s) no período gratuito':(planoAtual&&planoAtual!=='teste_gratis'?nomePlano:'Escolha um plano para manter a sincronização ativa após o teste.');
  planosBox.innerHTML='<div class="conecta-plans-wrap">'+
   '<section class="conecta-plans-hero"><div><h3>Planos do +Empregos Conecta</h3><p>Todos os planos mantêm o funcionamento principal do Conecta: sincronização automática, atualização das vagas, histórico, monitoramento e definição do destino das candidaturas. A diferença está principalmente na capacidade de vagas e origens.</p></div><div class="conecta-plans-trial"><small>Status da conta</small><strong>'+esc(nomePlano)+'</strong><span>'+esc(statusPlano)+'</span></div></section>'+
   '<div class="conecta-plans-launch"><b>OFERTA DE LANÇAMENTO</b><span>Condição especial nos 3 primeiros meses. A partir do 4º mês, passa a valer o preço mensal normal de cada plano.</span></div>'+
   '<section class="conecta-plan-grid">'+
    '<article class="conecta-plan-card"><h3 class="conecta-plan-name">Conecta Essencial</h3><p class="conecta-plan-desc">Para empresas com menor volume de vagas e uma operação mais enxuta de recrutamento.</p><div class="conecta-plan-price"><small>Lançamento · 3 primeiros meses</small><strong>R$ 79</strong><em>/mês</em></div><div class="conecta-plan-normal"><b>A partir do 4º mês:</b> <strong>R$ 149/mês</strong></div><div class="conecta-plan-list"><span><b>✓</b>Até 20 vagas ativas sincronizadas</span><span><b>✓</b>Sincronização automática</span><span><b>✓</b>Monitoramento e histórico</span><span><b>✓</b>Portal, e-mail, WhatsApp ou link externo</span><span><b>✓</b>Perfil empresarial no +Empregos</span><span><b>✓</b>5 vagas em destaque grátis por mês</span><span><b>✓</b>5 ativações de urgência grátis por mês</span><span><b>✓</b>Vaga confidencial sempre grátis</span><span><b>+</b>Após a franquia: R$ 9,90 por Destaque ou Urgência</span></div><button class="conecta-btn sec" type="button" onclick="conectaSelecionarPlanoEM(\'essencial\',\'Conecta Essencial\')">Escolher Essencial</button></article>'+
    '<article class="conecta-plan-card recomendado"><span class="conecta-plan-badge">Mais escolhido</span><h3 class="conecta-plan-name">Conecta Profissional</h3><p class="conecta-plan-desc">Para empresas com recrutamento recorrente e um volume maior de oportunidades abertas.</p><div class="conecta-plan-price"><small>Lançamento · 3 primeiros meses</small><strong>R$ 149</strong><em>/mês</em></div><div class="conecta-plan-normal"><b>A partir do 4º mês:</b> <strong>R$ 299/mês</strong></div><div class="conecta-plan-list"><span><b>✓</b>Até 60 vagas ativas sincronizadas</span><span><b>✓</b>Sincronização automática</span><span><b>✓</b>Monitoramento e histórico</span><span><b>✓</b>Portal, e-mail, WhatsApp ou link externo</span><span><b>✓</b>Perfil empresarial no +Empregos</span><span><b>✓</b>5 vagas em destaque grátis por mês</span><span><b>✓</b>5 ativações de urgência grátis por mês</span><span><b>✓</b>Vaga confidencial sempre grátis</span><span><b>+</b>Após a franquia: R$ 9,90 por Destaque ou Urgência</span></div><button class="conecta-btn pri" type="button" onclick="conectaSelecionarPlanoEM(\'profissional\',\'Conecta Profissional\')">Escolher Profissional</button></article>'+
    '<article class="conecta-plan-card"><h3 class="conecta-plan-name">Conecta Escala</h3><p class="conecta-plan-desc">Para operações com alto volume de vagas e maior demanda de recrutamento.</p><div class="conecta-plan-price"><small>Lançamento · 3 primeiros meses</small><strong>R$ 249</strong><em>/mês</em></div><div class="conecta-plan-normal"><b>A partir do 4º mês:</b> <strong>R$ 499/mês</strong></div><div class="conecta-plan-list"><span><b>✓</b>Até 150 vagas ativas sincronizadas</span><span><b>✓</b>Sincronização automática</span><span><b>✓</b>Monitoramento e histórico</span><span><b>✓</b>Portal, e-mail, WhatsApp ou link externo</span><span><b>✓</b>Perfil empresarial no +Empregos</span><span><b>✓</b>5 vagas em destaque grátis por mês</span><span><b>✓</b>5 ativações de urgência grátis por mês</span><span><b>✓</b>Vaga confidencial sempre grátis</span><span><b>+</b>Após a franquia: R$ 9,90 por Destaque ou Urgência</span></div><button class="conecta-btn sec" type="button" onclick="conectaSelecionarPlanoEM(\'escala\',\'Conecta Escala\')">Escolher Escala</button></article>'+
   '</section>'+
   '<div class="conecta-plan-status"><div><strong>Precisa de uma operação maior?</strong><span>Empresas com mais de 150 vagas podem solicitar uma configuração personalizada do Conecta.</span></div><button class="conecta-btn sec" type="button" onclick="conectaSelecionarPlanoEM(\'enterprise\',\'Conecta Enterprise\')">Falar sobre Enterprise</button></div>'+
   '<p class="conecta-plan-note">Os valores de lançamento valem pelos 3 primeiros meses da contratação. O preço normal fica visível antes da ativação do plano.</p>'+
  '</div>'
 }
 const geral=document.getElementById('conectaSecGeralEM');if(geral)geral.innerHTML=trialBanner+
  '<section class="conecta-hero health-'+saude+'"><div><span class="conecta-hero-kicker"><i class="conecta-dot"></i>'+esc(saudeTexto)+'</span><h2>'+esc(saudeResumo)+'</h2><p>'+esc(saudeDetalhe)+'</p>'+(conectado?'<div class="conecta-hero-health"><span><i></i>Origem conectada</span><span><i></i>Sincronização automática '+(saude==='ok'?'ativa':'monitorada')+'</span><span><i></i>'+(cfg.ultima?'Última execução registrada':'Aguardando primeira execução')+'</span></div>':'')+'</div><div class="conecta-source"><small>ORIGEM ATUAL</small><strong>'+esc(cfg.url||'Nenhuma origem configurada')+'</strong><span>'+esc(conectado?'Tipo: '+cfg.tipo+' · frequência: '+cfg.frequencia+' min':'Acesse “Integração” para começar')+'</span>'+(conectado?'<span class="conecta-source-status '+(saude==='warn'?'warn':saude==='err'?'err':'')+'">'+(saude==='ok'?'✓ Tudo funcionando':saude==='warn'?'! Atenção necessária':'! Verificar integração')+'</span>':'')+'</div></section>'+
  (conectado?'<section class="conecta-next '+((vagas.length||cfg.ultima)?'ready':'')+'"><div><span class="conecta-next-kicker"><i></i>'+(saude==='ok'?'SINCRONIZAÇÃO ATIVA':saude==='warn'?'STATUS DA SINCRONIZAÇÃO':saude==='err'?'ATENÇÃO NA INTEGRAÇÃO':'PRÓXIMO PASSO')+'</span><div class="conecta-next-title"><h3>'+(vagas.length?vagas.length+' vaga(s) sincronizada(s) no +Empregos.':(cfg.ultima?(cfg.ultimaQtdEncontrada?cfg.ultimaQtdEncontrada+' vaga(s) detectada(s) na origem.':'Origem validada com sucesso.'):'Execute a primeira sincronização.'))+'</h3>'+(saude==='ok'?'<span class="conecta-next-state">✓ Tudo certo</span>':saude==='warn'?'<span class="conecta-next-state warn">Atenção</span>':saude==='err'?'<span class="conecta-next-state err">Verificar</span>':'')+'</div><p>'+(saude==='ok'?'As vagas já foram importadas e o Conecta acompanha automaticamente novas vagas, alterações e encerramentos.':(saude==='warn'?(syncAtrasada?'A última sincronização está fora do intervalo esperado. Execute uma verificação agora.':'A origem está configurada e aguarda a primeira sincronização.'):(saude==='err'?'Existem vagas com erro. Abra as vagas sincronizadas para revisar os registros.':'Sua origem já está configurada. Agora inicie a primeira sincronização.')))+'</p><div class="conecta-next-meta"><span>Sistema: '+esc(conectaSistemaInfoEM(cfg.sistema==='auto'?conectaDetectarSistemaEM(cfg.url):cfg.sistema).nome)+'</span><span>Frequência: '+esc(cfg.frequencia)+' min</span><span>'+(cfg.ultima?'Última execução: '+esc(conectaDataEM(cfg.ultima)):'Nenhuma sincronização executada')+'</span></div><div class="conecta-next-note">'+(saude==='ok'?'Nenhuma ação é necessária agora. O Conecta continuará acompanhando a origem automaticamente.':(saude==='warn'?'Uma nova sincronização ajuda a confirmar que a origem continua respondendo normalmente.':saude==='err'?'Revise as vagas com erro e a origem configurada antes da próxima rotina automática.':'O Conecta executará a importação e manterá as vagas atualizadas automaticamente.'))+'</div></div><div class="conecta-next-actions"><button class="conecta-btn sec" type="button" onclick="conectaAbaEM(\'integracao\')">Revisar configuração</button>'+(vagas.length?'<button class="conecta-btn pri" type="button" onclick="conectaAbaEM(\'vagas\')">Ver vagas sincronizadas</button>':'<button class="conecta-btn pri" type="button" onclick="sincronizarAgoraConectaEM()">Sincronizar agora</button>')+'</div></section>':'')+
  '<div class="conecta-kpis"><article class="conecta-kpi clickable" role="button" tabindex="0" onclick="conectaAbaEM(\'vagas\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();conectaAbaEM(\'vagas\')}"><span>Vagas sincronizadas</span><strong>'+vagas.length+'</strong><small>Total identificado pela integração</small></article><article class="conecta-kpi"><span>Ativas no portal</span><strong>'+ativas+'</strong><small>Disponíveis para candidatos</small></article><article class="conecta-kpi clickable" role="button" tabindex="0" onclick="abrirResumoKpiConectaEM(\'atencao\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();abrirResumoKpiConectaEM(\'atencao\')}"><span>Requer atenção</span><strong>'+atencao+'</strong><small>Prazo vencido ou revisão necessária</small></article><article class="conecta-kpi clickable" role="button" tabindex="0" onclick="abrirResumoKpiConectaEM(\'erro\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();abrirResumoKpiConectaEM(\'erro\')}"><span>Com erro</span><strong>'+erros+'</strong><small>Falhas reais da integração</small></article></div>'+
  '<div class="conecta-kpis"><article class="conecta-kpi clickable" role="button" tabindex="0" onclick="abrirResumoKpiConectaEM(\'visualizacoes\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();abrirResumoKpiConectaEM(\'visualizacoes\')}"><span>Visualizações</span><strong id="conectaKpiVisualizacoesEM">'+metricas.visualizacoes+'</strong><small>Últimos 30 dias</small></article><article class="conecta-kpi clickable" role="button" tabindex="0" onclick="abrirResumoKpiConectaEM(\'cliques\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();abrirResumoKpiConectaEM(\'cliques\')}"><span>Cliques em candidatar</span><strong id="conectaKpiCliquesEM">'+metricas.cliques+'</strong><small>Intenção de candidatura</small></article><article class="conecta-kpi clickable" role="button" tabindex="0" onclick="abrirResumoKpiConectaEM(\'enviados\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();abrirResumoKpiConectaEM(\'enviados\')}"><span>Candidatos enviados</span><strong id="conectaKpiEnviadosEM">'+metricas.enviados+'</strong><small>Encaminhados ao site/ATS</small></article><article class="conecta-kpi"><span>Conversão</span><strong id="conectaKpiConversaoEM">'+String(metricas.conversao).replace('.',',')+'%</strong><small>Visualizações → enviados</small></article></div>'+
    '<div class="conecta-grid"><section class="conecta-card"><div class="conecta-card-head"><div><h3>Últimas vagas sincronizadas</h3><p>Movimentações mais recentes da integração.</p></div><button onclick="conectaAbaEM(\'vagas\')">Ver todas</button></div><div class="conecta-table">'+linhas+'</div></section><aside class="conecta-card"><div class="conecta-card-head"><div><h3>Saúde da integração</h3><p>Status operacional</p></div></div><div class="conecta-status-box"><div class="conecta-health '+(conectado?'':'off')+'"><i></i><div><strong>'+(conectado?'Origem configurada':'Aguardando configuração')+'</strong><small>'+(conectado?'Pronta para sincronização':'Cadastre a URL do portal de carreiras')+'</small></div></div><div class="conecta-health '+(cfg.ultima?'':'off')+'"><i></i><div><strong>Última sincronização</strong><small>'+esc(cfg.ultima?conectaDataEM(cfg.ultima):'Ainda não executada')+'</small></div></div><div class="conecta-health"><i></i><div><strong>Plano '+esc(plano)+'</strong><small>Conta empresarial ativa</small></div></div></div></aside></div>';
 conectaAtualizarMetricasAsyncEM(e.id||'');
 const integ=document.getElementById('conectaSecIntegracaoEM');if(integ)integ.innerHTML=
 '<section class="conecta-card conecta-integracao-card">'+
 '<div class="conecta-integracao-head"><div class="conecta-integracao-icon">⌁</div><div><h3>Configuração da integração</h3><p>Defina a origem das vagas, o destino das candidaturas e a rotina de monitoramento.</p></div><span class="conecta-integracao-status '+(conectado?'ok':'')+'"><i></i>'+(conectado?'Integração configurada':'Aguardando configuração')+'</span></div>'+
 '<form novalidate onsubmit="salvarConfiguracaoConectaEM(event)"><div class="conecta-integracao-body">'+
 '<section class="conecta-form-section"><div class="conecta-form-section-title"><i>01</i><div><strong>Fonte das vagas</strong><span>Informe o portal de carreiras, ATS ou feed que o Conecta deverá acompanhar.</span></div></div>'+
 '<div class="conecta-settings">'+
 '<div class="conecta-field"><label>Sistema utilizado</label><select id="conectaSistemaEM" onchange="conectaAtualizarSistemaEM(\'select\')"><option value="auto" '+(cfg.sistema==='auto'?'selected':'')+'>Detectar automaticamente</option><option value="abler" '+(cfg.sistema==='abler'?'selected':'')+'>Abler</option><option value="gupy" '+(cfg.sistema==='gupy'?'selected':'')+'>Gupy</option><option value="solides" '+(cfg.sistema==='solides'?'selected':'')+'>Sólides</option><option value="pandape" '+(cfg.sistema==='pandape'?'selected':'')+'>Pandapé</option><option value="workday" '+(cfg.sistema==='workday'?'selected':'')+'>Workday</option><option value="greenhouse" '+(cfg.sistema==='greenhouse'?'selected':'')+'>Greenhouse</option><option value="lever" '+(cfg.sistema==='lever'?'selected':'')+'>Lever</option><option value="yapp" '+(cfg.sistema==='yapp'?'selected':'')+'>YAPP</option><option value="portal" '+(cfg.sistema==='portal'?'selected':'')+'>Portal próprio / outro</option></select><small class="conecta-field-help">Se não souber qual tecnologia é utilizada, mantenha a detecção automática.</small></div>'+
 '<div class="conecta-field"><label>URL do portal de carreiras / ATS</label><input id="conectaUrlEM" type="url" value="'+esc(cfg.url)+'" placeholder="https://empresa.com/carreiras" oninput="conectaAtualizarSistemaEM(\'url\')" required><small class="conecta-field-help">Cole o endereço oficial onde as vagas da empresa ficam publicadas.</small></div>'+
 '<div id="conectaSistemaInfoEM" class="conecta-sistema-info"><strong>'+esc(conectaSistemaInfoEM(cfg.sistema==='auto'?conectaDetectarSistemaEM(cfg.url):cfg.sistema).nome)+'</strong><span>'+esc(conectaSistemaInfoEM(cfg.sistema==='auto'?conectaDetectarSistemaEM(cfg.url):cfg.sistema).metodo)+'</span></div>'+
 '<div class="conecta-field"><label>Tipo de origem</label><select id="conectaTipoEM"><option value="portal" '+(cfg.tipo==='portal'?'selected':'')+'>Portal de carreiras</option><option value="ats" '+(cfg.tipo==='ats'?'selected':'')+'>ATS / sistema de recrutamento</option><option value="feed" '+(cfg.tipo==='feed'?'selected':'')+'>Feed / API pública</option></select><small class="conecta-field-help">Classifica a fonte utilizada pela empresa para a leitura das vagas.</small></div>'+
 '<div class="conecta-field"><label>Identificação da origem</label><input value="'+esc(conectaSistemaInfoEM(cfg.sistema==='auto'?conectaDetectarSistemaEM(cfg.url):cfg.sistema).nome)+'" readonly><small class="conecta-field-help">O sistema detectado permanece vinculado a esta integração.</small></div>'+
 '</div></section>'+
 '<section class="conecta-form-section conecta-form-section-opcional"><div class="conecta-form-section-title"><i>02</i><div><strong>Destino padrão das candidaturas <em class="conecta-opcional-badge">Opcional</em></strong><span>Escolha o fluxo padrão. O destino individual de cada vaga continua podendo ser alterado depois.</span></div></div>'+
 '<select id="conectaDestinoPadraoEM" class="conecta-destino-select-hidden" aria-hidden="true"><option value="externo" '+(cfg.destinoPadrao==='externo'?'selected':'')+'>Site da empresa</option><option value="whatsapp" '+(cfg.destinoPadrao==='whatsapp'?'selected':'')+'>WhatsApp</option><option value="email" '+(cfg.destinoPadrao==='email'?'selected':'')+'>E-mail</option><option value="portal" '+(cfg.destinoPadrao==='portal'?'selected':'')+'>Portal +Empregos</option></select>'+
 '<div class="conecta-destino-grid">'+
 '<button class="conecta-destino-option '+(cfg.destinoPadrao==='portal'?'ativo':'')+'" type="button" data-destino="portal" onclick="conectaSelecionarDestinoPadraoEM(\'portal\')"><i>▣</i><b>Portal +Empregos</b><small>Candidatura acompanhada dentro do portal.</small></button>'+
 '<button class="conecta-destino-option '+(cfg.destinoPadrao==='email'?'ativo':'')+'" type="button" data-destino="email" onclick="conectaSelecionarDestinoPadraoEM(\'email\')"><i>✉</i><b>E-mail</b><small>Envio para o endereço definido pela empresa.</small></button>'+
 '<button class="conecta-destino-option '+(cfg.destinoPadrao==='whatsapp'?'ativo':'')+'" type="button" data-destino="whatsapp" onclick="conectaSelecionarDestinoPadraoEM(\'whatsapp\')"><i>◉</i><b>WhatsApp</b><small>Direcionamento para um número configurado.</small></button>'+
 '<button class="conecta-destino-option '+((cfg.destinoPadrao||'externo')==='externo'?'ativo':'')+'" type="button" data-destino="externo" onclick="conectaSelecionarDestinoPadraoEM(\'externo\')"><i>↗</i><b>Link externo</b><small>ATS, formulário ou página própria da empresa.</small></button>'+
 '</div>'+
 '<div class="conecta-settings"><div class="conecta-field"><label>E-mail padrão</label><input id="conectaDestinoEmailEM" type="email" value="'+esc(cfg.destinoEmail)+'" placeholder="rh@empresa.com.br"><small class="conecta-field-help">Utilizado quando uma vaga for direcionada por e-mail.</small></div>'+
 '<div class="conecta-field"><label>WhatsApp padrão</label><input id="conectaDestinoWhatsappEM" value="'+esc(cfg.destinoWhatsapp)+'" placeholder="5531999999999"><small class="conecta-field-help">Informe DDI + DDD + número, somente números.</small></div>'+
 '<div class="conecta-field full"><label>Link base opcional</label><input id="conectaDestinoLinkBaseEM" type="url" value="'+esc(cfg.destinoLinkBase)+'" placeholder="https://empresa.com/carreiras"><small class="conecta-field-help">Funciona como alternativa para vagas que não tragam um link individual.</small></div></div></section>'+
 '<section class="conecta-form-section"><div class="conecta-form-section-title"><i>03</i><div><strong>Monitoramento e frequência</strong><span>Defina com que frequência o Conecta deve verificar a origem e procurar alterações.</span></div></div>'+
 '<div class="conecta-monitor-grid"><div class="conecta-field"><label>Frequência de verificação</label><select id="conectaFreqEM"><option value="30" '+(cfg.frequencia==='30'?'selected':'')+'>A cada 30 minutos</option><option value="60" '+(cfg.frequencia==='60'?'selected':'')+'>A cada 1 hora</option><option value="180" '+(cfg.frequencia==='180'?'selected':'')+'>A cada 3 horas</option><option value="360" '+(cfg.frequencia==='360'?'selected':'')+'>A cada 6 horas</option></select><small class="conecta-field-help">Essa frequência orienta o ciclo de monitoramento configurado para a integração.</small></div>'+
 '<div class="conecta-monitor-note"><strong>Sincronização automática</strong><span>A origem permanece configurada para acompanhamento automático. Alterações identificadas podem atualizar as vagas sem recadastro manual.</span></div></div>'+
 '<div class="conecta-resumo-integracao"><strong>Resumo da integração</strong><div class="conecta-resumo-itens"><span>Origem configurada</span><span>Sistema identificado</span><span>Destino definido</span><span>Monitoramento ativo</span></div></div></section>'+
 '</div><div class="conecta-integracao-actions"><span id="conectaConfigMsgEM" class="conecta-profile-msg"></span><button id="conectaConfigSalvarEM" class="conecta-btn pri" type="submit">Salvar configuração</button></div></form></section>'; const vagasBox=document.getElementById('conectaSecVagasEM');if(vagasBox){
 const desc=conectaDescobertasEM(),jobs=Array.isArray(desc.jobs)?desc.jobs:[],qtd=Number(desc.jobs_found||jobs.length||0),sel=new Set(trial.selectedUrls||[]);
 if(trial.ativo){const rows=jobs.length?jobs.map((j,i)=>{const u=String(j.url||'');return '<label class="conecta-job-select"><input type="checkbox" data-conecta-trial-url="'+esc(u)+'" '+(sel.has(u)?'checked':'')+' onchange="conectaContarSelecaoTesteEM()"><div><strong>'+esc(j.title||('Vaga encontrada '+(i+1)))+'</strong><small>'+esc(u)+'</small></div><button type="button" onclick="event.preventDefault();conectaAbrirVagaDescobertaEM(\''+u.replace(/'/g,'')+'\')">Ver origem</button></label>'}).join(''):'<div class="conecta-empty"><b>Descubra as vagas da origem</b><span>Clique em “Atualizar lista” para ler o portal e depois escolha até '+trial.limite+' vagas.</span></div>';vagasBox.innerHTML='<div class="conecta-trial"><div><strong>Teste grátis · escolha suas vagas</strong><span>O Conecta detecta todas as vagas, mas somente as <b>até '+trial.limite+' escolhidas</b> serão publicadas e acompanhadas.</span></div><button class="conecta-btn sec" type="button" onclick="sincronizarAgoraConectaEM()">Atualizar lista</button></div><section class="conecta-card"><div class="conecta-card-head"><div><h3>'+(qtd?qtd+' vaga(s) encontradas':'Vagas disponíveis')+'</h3><p>Marque as oportunidades que deseja sincronizar.</p></div><button id="conectaSalvarSelecaoEM" type="button" onclick="conectaSalvarSelecaoTesteEM()">Salvar seleção</button></div><div class="conecta-select-head"><strong>Seleção do teste gratuito</strong><span id="conectaTrialContadorEM">'+sel.size+' / '+trial.limite+' selecionadas</span></div>'+rows+'</section>'}
 else{const rows=vagas.length?vagas.map(v=>{const titulo=tituloVaga(v)||'Vaga',local=[v.cidade,v.estado||v.uf].filter(Boolean).join(' - ')||v.candidaturaLink||'Origem conectada',destino=conectaDestinoLabelEM(v.candidaturaTipo||cfg.destinoPadrao),busca=[titulo,v.cidade,v.estado,v.uf,v.status,destino].filter(Boolean).join(' ');return '<div class="conecta-row" data-conecta-search="'+esc(busca)+'"><div><strong>'+esc(titulo)+'</strong><small>'+esc(local)+'</small></div><span class="conecta-status '+(v.status==='aprovada'?'ok':'pend')+'">'+esc(v.status||'Pendente')+'</span><span>'+esc(destino)+'</span><button class="conecta-vaga-acao" type="button" onclick="abrirDestinoVagaConectaEM(\''+String(v.id).replace(/'/g,'')+'\')">Configurar</button></div>'}).join(''):'';vagasBox.innerHTML=(trial.expirado?trialBanner:'')+'<section class="conecta-card"><div class="conecta-card-head"><div><h3>'+(vagas.length?vagas.length+' vaga(s) sincronizada(s)':'Vagas sincronizadas')+'</h3><p>'+(trial.expirado?'Sincronização pausada.':'Acompanhe as oportunidades integradas.')+'</p></div></div>'+(vagas.length?'<div class="conecta-vagas-search"><span class="conecta-vagas-search-icon">⌕</span><input id="conectaBuscaVagasEM" type="search" autocomplete="off" placeholder="Buscar por nome da vaga, cidade, UF, status ou destino..." oninput="filtrarVagasConectaEM(this.value)"><span class="conecta-vagas-search-count" id="conectaBuscaCountEM">'+vagas.length+' de '+vagas.length+'</span><button type="button" onclick="limparBuscaVagasConectaEM()">Limpar</button></div>':'')+'<div class="conecta-table" id="conectaListaVagasEM">'+(rows||linhas)+'<div class="conecta-search-empty" id="conectaBuscaVaziaEM">Nenhuma vaga encontrada com esse termo.</div></div></section>'}
 } const histBox=document.getElementById('conectaSecHistoricoEM');if(histBox)histBox.innerHTML='<section class="conecta-card"><div class="conecta-card-head"><div><h3>Histórico</h3><p>Registro das ações do Conecta nesta empresa.</p></div></div><div class="conecta-history">'+(hist.length?hist.map(x=>'<article><i></i><div><strong>'+esc(x.mensagem||x.tipo||'Atualização')+'</strong><span>'+esc(x.detalhe||'')+'</span></div><small>'+conectaDataEM(x.data)+'</small></article>').join(''):'<div class="conecta-empty"><b>Nenhuma sincronização registrada</b><span>O histórico começará a aparecer quando a integração for configurada e executada.</span></div>')+'</div></section>';
 const perfil=conectaPerfilEmpresaEM(),perfilBox=document.getElementById('conectaSecPerfilEM');if(perfilBox)perfilBox.innerHTML=
 '<div class="conecta-profile-layout"><form class="conecta-profile-form" onsubmit="salvarPerfilEmpresaConectaEM(event)"><section class="conecta-profile-block"><h3>Identidade da empresa</h3><p>Logo e capa que vão acompanhar sua página institucional e fortalecer a apresentação das vagas.</p><div class="conecta-profile-media">'+
 '<div class="conecta-profile-upload"><strong>Logo</strong><div id="conectaPerfilLogoPreviewEM" class="conecta-profile-preview logo">'+(perfil.logo?'<img src="'+esc(perfil.logo)+'" alt="Logo">':'<span>Sua logo</span>')+'</div><label>Enviar logo<input type="file" accept="image/png,image/jpeg,image/webp" onchange="conectaPerfilImagemSelecionadaEM(this,\'conectaPerfilLogoEM\',\'conectaPerfilLogoPreviewEM\',\'logo\')"></label><input id="conectaPerfilLogoEM" type="hidden" value="'+esc(perfil.logo)+'"></div>'+
 '<div class="conecta-profile-upload"><strong>Imagem de capa</strong><div id="conectaPerfilCapaPreviewEM" class="conecta-profile-preview capa">'+(perfil.capa?'<img src="'+esc(perfil.capa)+'" alt="Capa">':'<span>Imagem de capa</span>')+'</div><label>Enviar capa<input type="file" accept="image/png,image/jpeg,image/webp" onchange="conectaPerfilImagemSelecionadaEM(this,\'conectaPerfilCapaEM\',\'conectaPerfilCapaPreviewEM\',\'capa\')"></label><input id="conectaPerfilCapaEM" type="hidden" value="'+esc(perfil.capa)+'"></div></div></section>'+
 '<section class="conecta-profile-block"><h3>Informações públicas</h3><p>Dados que o candidato verá ao conhecer a empresa.</p><div class="conecta-profile-grid">'+
 '<div class="conecta-profile-field"><label>Nome exibido</label><input id="conectaPerfilNomeEM" value="'+esc(perfil.nome)+'" required></div><div class="conecta-profile-field"><label>Segmento da empresa</label>'+conectaSegmentosPerfilHtmlEM(perfil.segmento)+'</div>'+
 '<div class="conecta-profile-field full"><label>Slogan</label><input id="conectaPerfilSloganEM" maxlength="120" value="'+esc(perfil.slogan)+'" placeholder="Uma frase curta sobre a empresa"></div><div class="conecta-profile-field"><label>Cidade</label><input id="conectaPerfilCidadeEM" value="'+esc(perfil.cidade)+'"></div><div class="conecta-profile-field"><label>UF</label><input id="conectaPerfilUfEM" maxlength="2" value="'+esc(perfil.uf)+'"></div>'+
 '<div class="conecta-profile-field full"><label>Sobre a empresa</label><textarea id="conectaPerfilSobreEM" maxlength="1400" placeholder="Conte quem é a empresa, o que faz e por que trabalhar nela.">'+esc(perfil.sobre)+'</textarea></div><div class="conecta-profile-field full"><label>Cultura e ambiente</label><textarea id="conectaPerfilCulturaEM" maxlength="1000" placeholder="Como é trabalhar na empresa?">'+esc(perfil.cultura)+'</textarea></div><div class="conecta-profile-field full"><label>Benefícios e diferenciais</label><textarea id="conectaPerfilBeneficiosEM" maxlength="1000" placeholder="Benefícios, programas e diferenciais.">'+esc(perfil.beneficios)+'</textarea></div></div></section>'+
 '<section class="conecta-profile-block"><h3>Links oficiais</h3><p>Conecte a página do +Empregos aos canais oficiais da empresa.</p><div class="conecta-profile-grid"><div class="conecta-profile-field"><label>Site institucional</label><input id="conectaPerfilSiteEM" type="url" value="'+esc(perfil.site)+'" placeholder="https://empresa.com.br"></div><div class="conecta-profile-field"><label>Página de carreiras</label><input id="conectaPerfilCarreirasEM" type="url" value="'+esc(perfil.paginaCarreiras)+'" placeholder="https://empresa.com.br/carreiras"></div><div class="conecta-profile-field"><label>LinkedIn</label><input id="conectaPerfilLinkedinEM" type="url" value="'+esc(perfil.linkedin)+'" placeholder="https://linkedin.com/company/..."></div><div class="conecta-profile-field"><label>Instagram</label><input id="conectaPerfilInstagramEM" type="url" value="'+esc(perfil.instagram)+'" placeholder="https://instagram.com/..."></div></div></section>'+
 '<div class="conecta-profile-actions"><button id="conectaPerfilSalvarEM" class="conecta-btn pri" type="submit">Salvar perfil da empresa</button><span id="conectaPerfilMsgEM" class="conecta-profile-msg"></span></div></form>'+
 '<aside class="conecta-profile-preview-card"><div class="conecta-profile-preview-cover">'+(perfil.capa?'<img src="'+esc(perfil.capa)+'" alt="">':'')+'</div><div class="conecta-profile-preview-body"><div class="conecta-profile-preview-logo">'+(perfil.logo?'<img src="'+esc(perfil.logo)+'" alt="">':esc((perfil.nome||'E').charAt(0).toUpperCase()))+'</div><h3>'+esc(perfil.nome||'Sua empresa')+'</h3><div class="conecta-profile-preview-meta">'+(perfil.segmento?'<span>'+esc(perfil.segmento)+'</span>':'')+([perfil.cidade,perfil.uf].filter(Boolean).length?'<span>'+esc([perfil.cidade,perfil.uf].filter(Boolean).join(' - '))+'</span>':'')+'</div><p>'+esc(perfil.slogan||perfil.sobre||'Complete o perfil para apresentar sua empresa aos candidatos.')+'</p>'+(perfil.site?'<a class="conecta-profile-link" href="'+esc(perfil.site)+'" target="_blank" rel="noopener">Visitar site da empresa ↗</a>':'')+'</div></aside></div>';
 const conf=document.getElementById('conectaSecConfigEM');if(conf)conf.innerHTML='<section class="conecta-card"><div class="conecta-card-head"><div><h3>Preferências do Conecta</h3><p>Controles gerais da integração.</p></div></div><div class="conecta-status-box"><div class="conecta-health '+(conectado?'':'off')+'"><i></i><div><strong>Integração '+(conectado?'configurada':'não configurada')+'</strong><small>'+esc(cfg.url||'Nenhuma fonte definida')+'</small></div></div><div class="conecta-health"><i></i><div><strong>Publicação passa por análise</strong><small>As vagas sincronizadas entram no fluxo de revisão antes da publicação.</small></div></div></div></section>'
 const docs=document.getElementById('conectaSecDocsEM');if(docs)docs.innerHTML=
 '<div class="conecta-docs">'+
 '<section class="conecta-docs-hero"><span>GUIA COMPLETO</span><h2>Documentação do +EmpregosConecta</h2><p>Entenda como configurar, validar, acompanhar e manter sua integração de vagas com segurança.</p></section>'+
 '<div class="conecta-docs-alert"><i>!</i><div><strong>Importante sobre disponibilidade</strong><span>Integrações dependem das regras e da tecnologia do sistema de origem. APIs e feeds oficiais tendem a ser mais estáveis; leitura de páginas públicas pode exigir manutenção quando o portal ou ATS muda sua estrutura.</span></div></div>'+
 '<div class="conecta-docs-nav"><button onclick="document.getElementById(\'docConectaInicio\')?.scrollIntoView({behavior:\'smooth\'})">Primeiros passos</button><button onclick="document.getElementById(\'docConectaSync\')?.scrollIntoView({behavior:\'smooth\'})">Sincronização</button><button onclick="document.getElementById(\'docConectaFalhas\')?.scrollIntoView({behavior:\'smooth\'})">Falhas e continuidade</button><button onclick="document.getElementById(\'docConectaFaq\')?.scrollIntoView({behavior:\'smooth\'})">FAQ</button></div>'+
 '<details id="docConectaInicio" open><summary>1. Visão geral e primeiros passos</summary><div class="conecta-doc-body"><p>O Conecta liga a origem das vagas da empresa ao +Empregos. A empresa continua administrando o processo seletivo no ambiente que já utiliza.</p><h4>Fluxo básico</h4><ol><li>Habilite um plano Conecta.</li><li>Acesse <b>Integração</b>.</li><li>Informe sistema, URL oficial e tipo de origem.</li><li>Defina a frequência desejada.</li><li>Configure o destino padrão das candidaturas, se necessário.</li><li>Salve e execute a validação inicial.</li></ol></div></details>'+
 '<details><summary>2. Tipos de integração e estabilidade</summary><div class="conecta-doc-body"><table class="conecta-doc-table"><thead><tr><th>Origem</th><th>Funcionamento</th><th>Estabilidade</th></tr></thead><tbody><tr><td>API oficial</td><td>Dados estruturados via autenticação/token.</td><td class="conecta-doc-ok">Alta</td></tr><tr><td>Feed JSON/XML</td><td>Leitura periódica de endpoint estruturado.</td><td class="conecta-doc-ok">Alta</td></tr><tr><td>Portal público</td><td>Leitura das páginas públicas.</td><td class="conecta-doc-warn">Pode exigir manutenção</td></tr><tr><td>ATS externo</td><td>Depende dos recursos oferecidos pelo fornecedor.</td><td class="conecta-doc-info">Varia</td></tr></tbody></table><p><b>Disponibilidade atual:</b> a validação real já existe para Abler. Outros provedores exibidos no painel devem ser considerados disponíveis apenas quando o respectivo conector estiver habilitado para a operação.</p></div></details>'+
 '<details id="docConectaSync"><summary>3. Sincronização e frequência</summary><div class="conecta-doc-body"><h4>Sincronizar agora</h4><p>O painel envia a origem configurada ao serviço de integração para testar acesso e identificar vagas.</p><h4>Frequência</h4><p>A frequência escolhida representa a periodicidade desejada. A execução automática depende do agendador e do conector estarem habilitados para a conta.</p><div class="conecta-doc-status"><div><b>Saudável</b><span>Origem acessível e rotina normal.</span></div><div><b>Atenção</b><span>Queda de volume ou resposta inesperada.</span></div><div><b>Erro</b><span>Origem indisponível, credencial vencida ou formato incompatível.</span></div></div><h4>Criação, atualização e encerramento</h4><p>Essas automações dependem do conector completo de cada sistema. Em conectores apenas de validação, o painel confirma a origem, mas não executa todo o ciclo automaticamente.</p></div></details>'+
 '<details><summary>4. Destino das candidaturas</summary><div class="conecta-doc-body"><ul><li><b>Site/ATS:</b> redirecionamento para a vaga externa.</li><li><b>WhatsApp:</b> direcionamento para o número configurado.</li><li><b>E-mail:</b> envio para o endereço definido.</li><li><b>Portal +Empregos:</b> candidatura interna quando habilitada.</li></ul><p>O destino individual da vaga tem prioridade sobre o destino padrão.</p></div></details>'+
 '<details id="docConectaFalhas"><summary>5. Falhas, interrupções e continuidade</summary><div class="conecta-doc-body"><p>Nenhuma integração externa é imune a interrupções. Mudanças no ATS, URL, API ou HTML podem exigir ajuste.</p><h4>Causas comuns</h4><ul><li>Mudança de URL ou estrutura do portal.</li><li>Token/API alterado ou expirado.</li><li>Captcha, proteção anti-bot ou limite de requisições.</li><li>Indisponibilidade do ATS.</li><li>Mudança de HTML em leitura de página pública.</li></ul><h4>O que fazer</h4><ol><li>Confira Visão geral e Histórico.</li><li>Execute “Sincronizar agora”.</li><li>Confirme URL e credenciais.</li><li>Valide se o ATS mudou de estrutura.</li><li>Acione manutenção do conector quando necessário.</li></ol><p>Uma queda repentina de muitas vagas para zero deve ser investigada antes de qualquer encerramento em massa.</p></div></details>'+
 '<details><summary>6. Segurança</summary><div class="conecta-doc-body"><ul><li>Use apenas URLs oficiais.</li><li>Não exponha tokens ou segredos em campos públicos.</li><li>Credenciais privadas devem ficar no backend seguro.</li><li>Revogue imediatamente credenciais comprometidas.</li><li>Mantenha o acesso vinculado à conta empresarial autenticada.</li></ul></div></details>'+
 '<details><summary>7. Boas práticas</summary><div class="conecta-doc-body"><ul><li>Prefira API ou feed oficial quando disponível.</li><li>Mantenha uma URL de carreiras estável.</li><li>Monitore o volume de vagas sincronizadas.</li><li>Teste destinos de candidatura após mudanças.</li><li>Avise antes de migrar de ATS ou domínio.</li><li>Revise o Histórico após alterações importantes.</li></ul></div></details>'+
 '<details><summary>8. Métricas do painel</summary><div class="conecta-doc-body"><p>O painel pode acompanhar vagas identificadas, publicadas, em análise, com erro, visualizações, cliques e candidatos enviados. A disponibilidade de cada métrica depende dos eventos efetivamente registrados pelo fluxo de candidatura.</p></div></details>'+
 '<details id="docConectaFaq"><summary>9. Perguntas frequentes</summary><div class="conecta-doc-body"><h4>A integração pode parar?</h4><p>Sim. Mudanças externas podem interromper o conector; por isso histórico e monitoramento são essenciais.</p><h4>Troquei de ATS. Preciso configurar novamente?</h4><p>Sim. A nova origem precisa ser validada e o conector correspondente deve estar disponível.</p><h4>O Conecta substitui meu ATS?</h4><p>Não. Ele complementa sua operação e amplia a distribuição das vagas.</p><h4>Posso usar mais de uma origem?</h4><p>Depende do plano e da configuração contratada.</p></div></details>'+
 '</div>';


 // Atualiza sessão e vagas em segundo plano somente depois da primeira pintura.
 // A segunda renderização usa os dados remotos, sem iniciar nova leitura e sem
 // alterar a lógica de sincronização automática.
 if(carregarRemoto){
  Promise.allSettled([
   conectaHidratarEmpresaSessaoEM(),
   sbCarregarVagasEmpresaAtualEM()
  ]).then(resultados=>{
   const falhas=resultados.filter(x=>x.status==='rejected');
   if(falhas.length)console.warn('Conecta: atualização remota parcial:',falhas.map(x=>x.reason));
   const rota=new URLSearchParams(location.search).get('pagina')||'home';
   if(rota==='painel-conecta')renderPainelConectaEM({carregarRemoto:false});
  }).catch(err=>console.warn('Conecta: atualização remota não concluída:',err));
 }
}
function conectaSelecionarDestinoPadraoEM(tipo){
 const sel=document.getElementById('conectaDestinoPadraoEM');if(sel)sel.value=tipo;
 document.querySelectorAll('#conectaSecIntegracaoEM .conecta-destino-option').forEach(btn=>btn.classList.toggle('ativo',btn.dataset.destino===tipo));
}
window.conectaSelecionarDestinoPadraoEM=conectaSelecionarDestinoPadraoEM;
async function salvarConfiguracaoConectaEM(e){
 if(e&&typeof e.preventDefault==='function')e.preventDefault();
 const val=id=>(document.getElementById(id)?.value||'').trim();
 const url=val('conectaUrlEM');
 const sistemaSelecionado=document.getElementById('conectaSistemaEM')?.value||'auto';
 const sistema=sistemaSelecionado==='auto'?conectaDetectarSistemaEM(url):sistemaSelecionado;
 const tipo=document.getElementById('conectaTipoEM')?.value||'portal';
 const frequencia=document.getElementById('conectaFreqEM')?.value||'60';
 const destinoPadrao=document.getElementById('conectaDestinoPadraoEM')?.value||'externo';
 const destinoEmail=val('conectaDestinoEmailEM');
 const destinoWhatsapp=nums(val('conectaDestinoWhatsappEM'));
 const destinoLinkBase=val('conectaDestinoLinkBaseEM');
 const btn=document.getElementById('conectaConfigSalvarEM');
 const msg=document.getElementById('conectaConfigMsgEM');
 const setMsg=(texto,tipoMsg='')=>{if(msg){msg.textContent=texto;msg.className='conecta-profile-msg'+(tipoMsg?' '+tipoMsg:'')}};
 if(!/^https?:\/\//i.test(url)){setMsg('Informe uma URL válida.','erro');alert('Informe uma URL válida começando com http:// ou https://');return false}
 if(destinoEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(destinoEmail)){setMsg('O e-mail opcional é inválido.','erro');alert('Revise o e-mail padrão ou deixe o campo vazio.');return false}
 if(destinoLinkBase&&!/^https?:\/\//i.test(destinoLinkBase)){setMsg('O link opcional é inválido.','erro');alert('Revise o link base opcional ou deixe o campo vazio.');return false}
 const config=Object.assign({},empresaLogada?.()?.conectaConfig||{},{url,sistema,tipo,frequencia,ativo:true,ultima:conectaConfigEM().ultima||'',destinoPadrao,destinoEmail,destinoWhatsapp,destinoLinkBase});
 try{
  if(btn){btn.disabled=true;btn.textContent='Salvando...'}
  setMsg('Salvando configuração...');
  conectaSalvarEmpresaLocalEM(config);
  await conectaSalvarEmpresaCloudEM(config);
  await conectaHidratarEmpresaSessaoEM();
  conectaRegistrarHistoricoEM('configuracao','Integração configurada',{detalhe:conectaSistemaInfoEM(sistema).nome+' · '+url});
  const cfgPosSalvar=conectaConfigEM();
  if(!cfgPosSalvar.planoConecta||cfgPosSalvar.planoConecta==='teste_pendente'){
   setMsg('Integração configurada. Iniciando seus 7 dias de experiência...');
   await conectaIniciarTesteGratisEM();
  }
  setMsg('Configuração salva com sucesso.','ok');
  if(typeof window.mostrarToast==='function')window.mostrarToast('Configuração do +Empregos Conecta salva.');
  await renderPainelConectaEM();
  return true
 }catch(err){
  console.error('Configuração Conecta:',err);
  setMsg('Não foi possível salvar no servidor.','erro');
  alert('Não foi possível salvar a configuração do Conecta. '+(err?.message||''));
  return false
 }finally{
  if(btn){btn.disabled=false;btn.textContent='Salvar configuração'}
 }
}
function abrirDestinoVagaConectaEM(id){
 const v=conectaVagasEmpresaEM().find(x=>String(x.id)===String(id));if(!v)return;
 document.getElementById('conectaDestinoModalEM')?.remove();
 const cfg=conectaConfigEM(),tipo=v.candidaturaTipo||cfg.destinoPadrao||'externo';
 const modal=document.createElement('div');modal.id='conectaDestinoModalEM';modal.className='conecta-modal';
 modal.innerHTML='<div class="conecta-modal-back" onclick="this.parentElement.remove()"></div><section class="conecta-modal-card"><h3>Destino da candidatura</h3><p>'+esc(tituloVaga(v)||'Vaga')+'</p><div class="conecta-settings">'+
 '<div class="conecta-field full"><label>Tipo</label><select id="conectaVagaDestinoTipoEM"><option value="externo" '+(tipo==='externo'?'selected':'')+'>Site da empresa</option><option value="whatsapp" '+(tipo==='whatsapp'?'selected':'')+'>WhatsApp</option><option value="email" '+(tipo==='email'?'selected':'')+'>E-mail</option><option value="portal" '+(tipo==='portal'?'selected':'')+'>Portal +Empregos</option></select></div>'+
 '<div class="conecta-field full"><label>Link da vaga</label><input id="conectaVagaDestinoLinkEM" value="'+esc(v.candidaturaLink||'')+'" placeholder="https://empresa.com/vaga/..."></div>'+
 '<div class="conecta-field"><label>WhatsApp</label><input id="conectaVagaDestinoWhatsappEM" value="'+esc(v.candidaturaWhatsapp||cfg.destinoWhatsapp||'')+'"></div>'+
 '<div class="conecta-field"><label>E-mail</label><input id="conectaVagaDestinoEmailEM" type="email" value="'+esc(v.candidaturaEmail||cfg.destinoEmail||'')+'"></div></div>'+
 '<div class="conecta-modal-actions"><button class="cancelar" type="button" onclick="document.getElementById(\'conectaDestinoModalEM\')?.remove()">Cancelar</button><button class="salvar" type="button" onclick="salvarDestinoVagaConectaEM(\''+String(v.id).replace(/'/g,'')+'\')">Salvar</button></div></section>';
 document.body.appendChild(modal)
}
async function salvarDestinoVagaConectaEM(id){
 const tipo=document.getElementById('conectaVagaDestinoTipoEM')?.value||'externo';
 const link=(document.getElementById('conectaVagaDestinoLinkEM')?.value||'').trim();
 const whatsapp=nums(document.getElementById('conectaVagaDestinoWhatsappEM')?.value||'');
 const email=(document.getElementById('conectaVagaDestinoEmailEM')?.value||'').trim();
 try{
  const token=await sbGarantirSessaoEM();if(!token)throw new Error('Sessão expirada.');
  const rows=await sbJsonEM(
   EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?id=eq.'+encodeURIComponent(id),
   {method:'PATCH',headers:Object.assign(sbHeadersEM(token),{'Prefer':'return=representation'}),body:JSON.stringify({candidatura_tipo:tipo,candidatura_link:link||null,candidatura_whatsapp:whatsapp||null,candidatura_email:email||null,editado_em:new Date().toISOString()})}
  );
  const remoto=Array.isArray(rows)?rows[0]:null;
  const vagas=ler('empregaMaisVagas')||[],i=vagas.findIndex(v=>String(v.id)===String(id));
  if(i>=0){
   vagas[i]=Object.assign({},vagas[i],remoto?sbMapVagaEM(remoto):{candidaturaTipo:tipo,candidaturaLink:link,candidaturaWhatsapp:whatsapp,candidaturaEmail:email});
   gravar('empregaMaisVagas',vagas)
  }
  document.getElementById('conectaDestinoModalEM')?.remove();
  conectaRegistrarHistoricoEM('destino','Destino de candidatura alterado',{detalhe:conectaDestinoLabelEM(tipo)});
  renderPainelConectaEM();
  if(typeof window.mostrarToast==='function')window.mostrarToast('Destino da candidatura atualizado.')
 }catch(err){console.error(err);alert('Não foi possível atualizar esta vaga.')}
}
window.abrirDestinoVagaConectaEM=abrirDestinoVagaConectaEM;
window.salvarDestinoVagaConectaEM=salvarDestinoVagaConectaEM;

async function abrirResumoKpiConectaEM(tipo){
 document.getElementById('conectaKpiModalEM')?.remove();
 const vagas=conectaVagasEmpresaEM();
 const titulos={analise:'Vagas em análise',atencao:'Vagas que requerem atenção',erro:'Vagas com erro',visualizacoes:'Visualizações por vaga',cliques:'Cliques em candidatar por vaga',enviados:'Candidatos enviados por vaga'};
 const descricoes={analise:'Oportunidades aguardando análise ou publicação.',atencao:'Vagas sincronizadas normalmente, mas com alguma condição que precisa ser revisada pela empresa.',erro:'Falhas reais de integração ou publicação que precisam ser corrigidas.',visualizacoes:'Visualizações registradas nos últimos 30 dias.',cliques:'Cliques no botão de candidatura nos últimos 30 dias.',enviados:'Encaminhamentos para site ou ATS nos últimos 30 dias.'};
 let itens=[];
 if(tipo==='analise'){
  itens=vagas.filter(v=>['pendente','em_analise','analise'].includes(String(v.status||'').toLowerCase())).map(v=>({nome:tituloVaga(v)||'Vaga',meta:[v.cidade,v.estado||v.uf].filter(Boolean).join(' - ')||'Local não informado',valor:String(v.status||'Em análise')}));
 }else if(tipo==='atencao'){
  itens=vagas.filter(v=>v.status==='aprovada'&&!vagaDentroPrazo(v)).map(v=>({nome:tituloVaga(v)||'Vaga',meta:v.dataEncerramento?('Data de encerramento atingida em '+new Date(v.dataEncerramento+'T12:00:00').toLocaleDateString('pt-BR')):'Prazo da vaga encerrado',valor:'Revisar'}));
 }else if(tipo==='erro'){
  itens=vagas.filter(v=>['erro','falha','rejeitada'].includes(String(v.status||'').toLowerCase())).map(v=>({nome:tituloVaga(v)||'Vaga',meta:[v.cidade,v.estado||v.uf].filter(Boolean).join(' - ')||'Local não informado',valor:String(v.status||'Erro')}));
 }else{
  const metricas=await conectaMetricasEmpresaEM(),campo=tipo==='visualizacoes'?'visualizacoes':tipo==='cliques'?'cliques':'enviados';
  itens=vagas.map(v=>({nome:tituloVaga(v)||'Vaga',meta:[v.cidade,v.estado||v.uf].filter(Boolean).join(' - ')||'Local não informado',valor:Number(metricas.porVaga?.[String(v.id)]?.[campo]||0)})).filter(x=>x.valor>0).sort((a,b)=>b.valor-a.valor);
 }
 const lista=itens.length?itens.map(x=>'<div style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:center;padding:15px 0;border-top:1px solid #eee7f2"><div><strong style="display:block;color:#35213f;font-size:15px;line-height:1.45;font-weight:750">'+esc(x.nome)+'</strong><small style="display:block;margin-top:5px;color:#706278;font-size:13px;line-height:1.5;font-weight:500">'+esc(x.meta)+'</small></div><b style="color:#5b168d;font-size:13.5px;font-weight:800">'+esc(String(x.valor))+'</b></div>').join(''):'<div class="conecta-empty"><b>Nenhum registro neste indicador</b><span>Quando houver movimentação, os detalhes aparecerão aqui.</span></div>';
 const modal=document.createElement('div');modal.id='conectaKpiModalEM';modal.className='conecta-modal';
 modal.innerHTML='<div class="conecta-modal-back" onclick="this.parentElement.remove()"></div><section class="conecta-modal-card"><h3>'+esc(titulos[tipo]||'Detalhes')+'</h3><p>'+esc(descricoes[tipo]||'')+'</p><div>'+lista+'</div><div class="conecta-modal-actions"><button class="cancelar" type="button" onclick="document.getElementById(\'conectaKpiModalEM\')?.remove()">Fechar</button>'+(tipo==='analise'||tipo==='atencao'||tipo==='erro'?'<button class="salvar" type="button" onclick="document.getElementById(\'conectaKpiModalEM\')?.remove();conectaAbaEM(\'vagas\')">Ver vagas</button>':'')+'</div></section>';
 document.body.appendChild(modal)
}
window.abrirResumoKpiConectaEM=abrirResumoKpiConectaEM;

async function sincronizarAgoraConectaEM(){
 const cfg=conectaConfigEM(),trial=conectaTrialInfoEM(cfg);if(!cfg.url){conectaAbaEM('integracao');return}if(trial.expirado)return alert('Seu período gratuito do Conecta terminou.');
 const btn=document.getElementById('conectaSyncBtnEM');try{if(btn){btn.disabled=true;btn.textContent='Lendo portal...'}const token=await sbGarantirSessaoEM();if(!token)throw Error('Sessão da empresa expirada.');
 const r=await fetch(EMPREGAMAIS_SUPABASE_URL+'/functions/v1/conecta-sync',{method:'POST',headers:Object.assign(sbHeadersEM(token),{'Content-Type':'application/json'}),body:JSON.stringify({url:cfg.url,sistema:cfg.sistema||conectaDetectarSistemaEM(cfg.url)})}),data=await r.json().catch(()=>({}));if(!r.ok||data?.ok!==true)throw Error(data?.message||data?.error||('HTTP '+r.status));
 const agora=data.checked_at||new Date().toISOString(),qtd=Number(data.jobs_found||0),pd=String(data.provider||'').toLowerCase(),origemPortal=/^https?:\/\//i.test(String(cfg.url||''))&&(cfg.tipo==='portal'||String(cfg.site_url_original||'').trim()||pd==='portal'||pd==='portal_generico'),patch={ultima:agora,conectaUltimaSync:agora,ultimoTesteOk:true,ultimaQtdEncontrada:qtd,tipo:origemPortal?'portal':cfg.tipo,sistema:origemPortal?'portal':((pd&&pd!=='portal_generico')?pd:cfg.sistema),site_url_original:origemPortal?String(cfg.url||cfg.site_url_original||''):cfg.site_url_original,ativo:true};
 conectaSalvarEmpresaLocalEM(patch);await conectaSalvarEmpresaCloudEM(Object.assign({},empresaLogada?.()?.conectaConfig||{},patch));conectaSalvarDescobertasEM(data);await conectaHidratarEmpresaSessaoEM();const ta=conectaTrialInfoEM();
 if(ta.ativo&&ta.selectedUrls.length===0){conectaRegistrarHistoricoEM('descoberta','Vagas encontradas na origem',{detalhe:qtd+' vaga(s) · aguardando seleção'});if(typeof window.mostrarToast==='function')window.mostrarToast(qtd+' vaga(s) encontradas. Escolha até '+ta.limite+'.');await renderPainelConectaEM();conectaAbaEM('vagas');return}
 if(btn)btn.textContent='Sincronizando...';const emp=await sbBuscarMinhaEmpresaEM(),fila=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/rpc/conecta_enqueue_my_company',{method:'POST',headers:Object.assign(sbHeadersEM(token),{'Content-Type':'application/json'}),body:'{}'});let wd=null;
 try{const wr=await fetch(EMPREGAMAIS_SUPABASE_URL+'/functions/v1/conecta-worker',{method:'POST',headers:Object.assign(sbHeadersEM(token),{'Content-Type':'application/json'}),body:JSON.stringify({batch:3})});wd=await wr.json().catch(()=>null);if(!wr.ok)throw Error(wd?.message||wd?.error||('HTTP '+wr.status))}catch(x){console.warn('Worker seguirá pela fila:',x)}
 try{await sbCarregarVagasEmpresaAtualEM()}catch(_){}conectaRegistrarHistoricoEM('sincronizacao','Sincronização solicitada',{detalhe:qtd+' vaga(s) detectada(s) · fila '+String(fila||'criada')});await renderPainelConectaEM();const re=Array.isArray(wd?.results)?wd.results.find(x=>String(x.empresa_id||'')===String(emp?.id||'')):null,st=re?.stats||null,txt=st?'Sincronização concluída: '+Number(st.inserted||0)+' nova(s), '+Number(st.updated||0)+' atualizada(s) e '+Number(st.closed||0)+' encerrada(s).':'Origem validada e sincronização colocada na fila.';if(typeof window.mostrarToast==='function')window.mostrarToast(txt);else alert(txt);conectaAbaEM('vagas')
 }catch(err){console.error(err);conectaRegistrarHistoricoEM('erro','Falha na sincronização',{detalhe:String(err?.message||err)});alert('Não foi possível sincronizar o Conecta: '+String(err?.message||err))}finally{if(btn){btn.disabled=false;btn.textContent='Sincronizar agora'}}
}

let conectaAutoRefreshTimerEM=null;
let conectaAutoRefreshRodandoEM=false;
function pararAutoRefreshConectaEM(){
 if(conectaAutoRefreshTimerEM){clearInterval(conectaAutoRefreshTimerEM);conectaAutoRefreshTimerEM=null}
}
function iniciarAutoRefreshConectaEM(){
 pararAutoRefreshConectaEM();
 conectaAutoRefreshTimerEM=setInterval(async()=>{
  const pagina=new URLSearchParams(location.search).get('pagina')||'home';
  if(pagina!=='painel-conecta'||!document.getElementById('pagina-painel-conecta')?.classList.contains('ativa')){pararAutoRefreshConectaEM();return}
  if(conectaAutoRefreshRodandoEM)return;
  conectaAutoRefreshRodandoEM=true;
  try{
   await renderPainelConectaEM();
  }catch(err){
   console.warn('Conecta: atualização automática do painel indisponível:',err)
  }finally{
   conectaAutoRefreshRodandoEM=false
  }
 },60000)
}
window.iniciarAutoRefreshConectaEM=iniciarAutoRefreshConectaEM;
window.pararAutoRefreshConectaEM=pararAutoRefreshConectaEM;

window.conectaAbaEM=conectaAbaEM;
window.salvarConfiguracaoConectaEM=salvarConfiguracaoConectaEM;
window.sincronizarAgoraConectaEM=sincronizarAgoraConectaEM;
window.renderPainelConectaEM=renderPainelConectaEM;

function aplicarMensagemComercialConectaEM(){
 const pagina=document.getElementById('pagina-emprego-conecta');if(!pagina)return;
 pagina.dataset.conectaLandingV4='1';
 document.getElementById('estiloConectaLandingV2EM')?.remove();

 const svg=(tipo)=>{
  const base='viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  const m={
   publicar:'<svg '+base+'><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/><path d="M10 13h5M10 17h5"/></svg>',
   editar:'<svg '+base+'><path d="M4 20h4l11-11-4-4L4 16z"/><path d="m13 6 4 4"/></svg>',
   excluir:'<svg '+base+'><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"/><path d="M10 11v5M14 11v5"/></svg>',
   fluxo:'<svg '+base+'><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M8 6h8M7 8l4 8M17 8l-4 8"/></svg>',
   api:'<svg '+base+'><path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/></svg>',
   feed:'<svg '+base+'><circle cx="5" cy="19" r="1"/><path d="M4 11a9 9 0 0 1 9 9M4 5a15 15 0 0 1 15 15"/></svg>',
   webhook:'<svg '+base+'><circle cx="6" cy="6" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7.5 7.5 10.5 16M16.5 7.5 13.5 16M8 6h8"/></svg>',
   portal:'<svg '+base+'><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 6h.01M10 6h.01"/></svg>',
   alcance:'<svg '+base+'><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>',
   alvo:'<svg '+base+'><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 2v2M22 12h-2M12 22v-2M2 12h2"/></svg>',
   canais:'<svg '+base+'><circle cx="5" cy="12" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="m7 11 10-5M7 13l10 5"/></svg>',
   usuarios:'<svg '+base+'><circle cx="9" cy="8" r="3"/><path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6"/><circle cx="17" cy="9" r="2"/><path d="M16 14c3 0 4.5 1.6 5 4"/></svg>',
   olho:'<svg '+base+'><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.5"/></svg>',
   clique:'<svg '+base+'><path d="m5 3 7 16 2-6 6-2z"/></svg>',
   envio:'<svg '+base+'><path d="m3 11 18-8-8 18-2-7z"/><path d="m11 14 10-11"/></svg>',
   conversao:'<svg '+base+'><path d="M4 18V9M10 18V5M16 18v-7M22 18V3"/></svg>',
   email:'<svg '+base+'><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
   whatsapp:'<svg '+base+'><path d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.1A8.5 8.5 0 1 1 20 11.5z"/><path d="M8.5 8.5c1 3 3 5 6 6"/></svg>',
   destaque:'<svg '+base+'><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
   urgente:'<svg '+base+'><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
   confidencial:'<svg '+base+'><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>'
  };return m[tipo]||m.fluxo;
 };

 const st=document.createElement('style');st.id='estiloConectaLandingV2EM';
 st.textContent=
 '#pagina-emprego-conecta{--c:#6d1aa2;--cd:#42105f;--cs:#f4eafa;--ink:#2c2331;--muted:#6f6575;--line:#e7dceb;--ok:#16825b;background:#faf9fb!important;color:var(--ink)!important;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;padding:0!important}'+
 '#pagina-emprego-conecta *{box-sizing:border-box;font-family:inherit}.cc4-wrap{width:min(1180px,calc(100% - 40px));margin:0 auto}.cc4-section{padding:58px 0}.cc4-section.alt{background:#fff;border-top:1px solid #efe8f2;border-bottom:1px solid #efe8f2}.cc4-kicker{display:inline-flex;align-items:center;gap:7px;color:var(--c);font-size:11px;font-weight:850;letter-spacing:.07em;text-transform:uppercase}.cc4-kicker:before{content:"";width:7px;height:7px;border-radius:50%;background:#8b39b7}.cc4-title{margin:7px 0 8px;color:#32143f;font-size:28px;line-height:1.2;letter-spacing:-.3px}.cc4-text{margin:0;color:var(--muted);font-size:15px;line-height:1.65}.cc4-head{max-width:760px;margin-bottom:26px}'+
 '.cc4-icon{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:#f1e6f7;color:var(--c);flex:0 0 44px}.cc4-icon svg{width:22px;height:22px}.cc4-card{background:#fff;border:1px solid var(--line);border-radius:17px;padding:20px;box-shadow:0 8px 24px rgba(70,28,90,.045)}.cc4-card h3{margin:0 0 6px;color:#382440;font-size:16px}.cc4-card p{margin:0;color:#6f6577;font-size:13px;line-height:1.55}.cc4-card small{display:block;margin-top:9px;color:var(--c);font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:.04em}'+
 '.cc4-hero{padding:62px 0 48px;background:linear-gradient(145deg,#fbf8fd,#fff 58%,#f1e5f7)}.cc4-hero-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(390px,.85fr);gap:34px;align-items:center}.cc4-hero h1{margin:12px 0 12px;color:#351442;font-size:42px;line-height:1.06;letter-spacing:-1.2px}.cc4-hero h1 em{font-style:normal;color:#7424a4}.cc4-hero p{margin:0;max-width:700px;color:#675d6e;font-size:17px;line-height:1.65}.cc4-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}.cc4-btn{border:0;border-radius:11px;padding:13px 17px;font-size:12.5px;font-weight:800;cursor:pointer}.cc4-btn.pri{background:linear-gradient(135deg,#7421a6,#53127b);color:#fff}.cc4-btn.sec{background:#fff;color:#5d2677;border:1px solid #dac9e3}.cc4-mini{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:22px}.cc4-mini div{padding:11px 12px;border:1px solid #eadff0;border-radius:12px;background:rgba(255,255,255,.8)}.cc4-mini strong{display:block;color:#40214d;font-size:13px}.cc4-mini span{display:block;margin-top:3px;color:#7b7082;font-size:11.5px;line-height:1.35}.cc4-hero-panel{background:#fff;border:1px solid #dfd1e5;border-radius:20px;padding:22px;box-shadow:0 18px 45px rgba(70,27,90,.09)}.cc4-hero-panel>strong{display:block;color:#3b2843;font-size:14px;margin-bottom:13px}.cc4-flow{display:grid;gap:10px}.cc4-flow article{display:grid;grid-template-columns:44px 1fr auto;gap:12px;align-items:center;padding:14px;border:1px solid #eee6f1;border-radius:14px;background:#fcfbfd}.cc4-flow .cc4-icon{width:44px;height:44px}.cc4-flow h3{margin:0;color:#33233a;font-size:15px}.cc4-flow p{margin:3px 0 0;color:#756b7b;font-size:12.5px;line-height:1.45}.cc4-flow b{font-size:10.5px;color:var(--ok);text-transform:uppercase}.cc4-note{margin-top:12px;padding:13px 14px;border-radius:12px;background:#f5edf8;color:#665a6d;font-size:12.5px;line-height:1.5}'+
 '.cc4-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.cc4-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.cc4-feature{display:flex;gap:13px;align-items:flex-start}.cc4-feature .cc4-icon{margin-top:1px}.cc4-feature div:last-child{min-width:0}.cc4-feature strong{display:block;color:#37243f;font-size:15px}.cc4-feature span{display:block;margin-top:4px;color:#706676;font-size:12.5px;line-height:1.5}'+
 '.cc4-integration{display:grid;grid-template-columns:minmax(0,1fr) minmax(330px,.8fr);gap:18px}.cc4-methods{display:grid;grid-template-columns:1fr 1fr;gap:11px}.cc4-method{display:flex;gap:12px}.cc4-method .cc4-icon{width:42px;height:42px}.cc4-int-side{display:grid;gap:9px}.cc4-int-step{display:grid;grid-template-columns:34px 1fr;gap:11px;align-items:start;padding:14px 15px;border:1px solid var(--line);border-radius:14px;background:#fff}.cc4-int-step i{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:#f1e6f7;color:var(--c);font-style:normal;font-size:11px;font-weight:850}.cc4-int-step strong{display:block;color:#392641;font-size:14px}.cc4-int-step span{display:block;margin-top:3px;color:#716777;font-size:12px;line-height:1.45}.cc4-info{margin-top:12px;padding:13px 15px;border-radius:12px;background:#f4edf8;color:#63556a;font-size:12.5px;line-height:1.5}'+
 '.cc4-attract{background:linear-gradient(135deg,#551279,#7a25aa);border-radius:20px;padding:26px;color:#fff}.cc4-attract *{color:#fff!important}.cc4-attract-top{display:flex;justify-content:space-between;gap:24px;align-items:flex-end;margin-bottom:20px}.cc4-attract-top h2{margin:6px 0 0;font-size:27px}.cc4-attract-top p{margin:0;max-width:520px;color:rgba(255,255,255,.82)!important;font-size:14px;line-height:1.55}.cc4-attract-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.cc4-attract-card{padding:15px;border-radius:14px;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.14)}.cc4-attract-card .cc4-icon{background:rgba(255,255,255,.14);color:#fff;margin-bottom:10px}.cc4-attract-card strong{display:block;font-size:14px}.cc4-attract-card span{display:block;margin-top:4px;color:rgba(255,255,255,.8)!important;font-size:12px;line-height:1.45}'+
 '.cc4-metrics{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:18px;align-items:start}.cc4-kpis{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.cc4-kpi{padding:15px;border:1px solid var(--line);border-radius:14px;background:#fff}.cc4-kpi span{display:block;color:#7b7082;font-size:11.5px}.cc4-kpi strong{display:block;margin-top:4px;color:#471c5a;font-size:23px}.cc4-dashboard{padding:18px;border:1px solid var(--line);border-radius:18px;background:#fff}.cc4-dashboard-head{display:flex;justify-content:space-between;gap:12px;align-items:center}.cc4-dashboard-head strong{font-size:14px;color:#38243f}.cc4-dashboard-head span{font-size:11px;color:#817586}.cc4-chart{height:150px;display:flex;align-items:flex-end;gap:9px;padding:18px 10px 8px;margin-top:14px;border-radius:13px;background:#faf7fb}.cc4-bar{flex:1;background:linear-gradient(180deg,#934dbc,#6a1d99);border-radius:7px 7px 2px 2px;min-height:24px;position:relative}.cc4-bar:after{content:attr(data-l);position:absolute;left:50%;bottom:-20px;transform:translateX(-50%);font-size:9px;color:#7c7082}.cc4-dashboard-note{margin-top:26px;color:#776b7e;font-size:11.5px;line-height:1.5}'+
 '.cc4-destinos{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.cc4-destino{display:flex;gap:13px}.cc4-extra{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.cc4-extra .cc4-card{position:relative;overflow:hidden}.cc4-extra .cc4-card:before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:var(--c)}.cc4-extra .urgente:before{background:#dc4b3d}.cc4-extra .confidencial:before{background:#68717a}.cc4-cta{padding:42px 0 58px}.cc4-cta-box{display:flex;justify-content:space-between;gap:22px;align-items:center;padding:26px;border-radius:19px;background:#351442;color:#fff}.cc4-cta-box h2{margin:0 0 6px;color:#fff;font-size:24px}.cc4-cta-box p{margin:0;color:rgba(255,255,255,.82);font-size:13.5px;line-height:1.55}.cc4-cta-box .cc4-btn{background:#fff;color:#5d1a83}'+
 '@media(max-width:920px){.cc4-hero-grid,.cc4-integration,.cc4-metrics{grid-template-columns:1fr}.cc4-grid4,.cc4-attract-grid{grid-template-columns:1fr 1fr}.cc4-grid3,.cc4-destinos,.cc4-extra{grid-template-columns:1fr 1fr}}@media(max-width:620px){.cc4-wrap{width:calc(100% - 22px)}.cc4-section{padding:44px 0}.cc4-hero{padding:42px 0}.cc4-hero h1{font-size:34px}.cc4-hero p{font-size:15px}.cc4-mini,.cc4-grid4,.cc4-grid3,.cc4-attract-grid,.cc4-destinos,.cc4-extra,.cc4-kpis,.cc4-methods{grid-template-columns:1fr}.cc4-flow article{grid-template-columns:44px 1fr}.cc4-flow b{grid-column:2}.cc4-attract-top,.cc4-cta-box{align-items:flex-start;flex-direction:column}.cc4-title{font-size:25px}.cc4-logo{min-width:132px;height:58px;font-size:15px}}';
 document.head.appendChild(st);

 // Conecta V5: composição SaaS centralizada, baseada em cards.
 const st5=document.createElement('style');st5.id='estiloConectaLandingV5EM';document.getElementById(st5.id)?.remove();
 st5.textContent=
 '.cc4-wrap{width:min(1120px,calc(100% - 40px))!important}.cc4-hero{padding:64px 0 52px!important;background:linear-gradient(180deg,#fbf8fd 0%,#fff 100%)!important}.cc4-hero-grid{display:flex!important;flex-direction:column!important;gap:30px!important;text-align:center!important}.cc4-hero-grid>div:first-child{max-width:900px;margin:0 auto}.cc4-hero h1{font-size:44px!important;line-height:1.08!important;max-width:880px!important;margin:14px auto!important}.cc4-hero p{max-width:790px!important;margin:0 auto!important;font-size:15.5px!important}.cc4-actions{justify-content:center!important}.cc4-mini{grid-template-columns:repeat(3,1fr)!important;max-width:900px!important;margin:26px auto 0!important}.cc4-mini div{text-align:center!important;padding:17px 14px!important;border-radius:16px!important;background:#fff!important;box-shadow:0 7px 22px rgba(70,28,90,.05)!important}.cc4-hero-panel{width:100%!important;max-width:980px!important;margin:0 auto!important;padding:24px!important}.cc4-hero-panel>strong{text-align:center!important;font-size:15px!important}.cc4-flow{grid-template-columns:repeat(3,1fr)!important;gap:12px!important}.cc4-flow article{display:flex!important;flex-direction:column!important;text-align:center!important;justify-content:flex-start!important;padding:20px 15px!important}.cc4-flow article .cc4-icon{margin:0 auto 4px!important}.cc4-flow b{margin-top:auto!important;padding-top:8px!important}.cc4-note{text-align:center!important}.cc4-section{padding:58px 0!important}.cc4-head{max-width:760px!important;margin:0 auto 28px!important;text-align:center!important}.cc4-title{font-size:30px!important}.cc4-text{font-size:14px!important}.cc4-grid4 .cc4-feature,.cc4-method,.cc4-destino{display:flex!important;flex-direction:column!important;align-items:center!important;text-align:center!important}.cc4-grid4 .cc4-icon,.cc4-method .cc4-icon,.cc4-destino .cc4-icon,.cc4-extra .cc4-icon{margin:0 auto 11px!important}.cc4-integration{display:block!important}.cc4-methods{grid-template-columns:repeat(4,1fr)!important}.cc4-int-side{grid-template-columns:repeat(4,1fr)!important;margin-top:14px!important}.cc4-int-step{display:flex!important;flex-direction:column!important;align-items:center!important;text-align:center!important}.cc4-info{max-width:900px!important;margin:18px auto 0!important;text-align:center!important}.cc4-attract{text-align:center!important;padding:32px!important}.cc4-attract-top{display:block!important}.cc4-attract-top p{max-width:700px!important;margin:10px auto 0!important}.cc4-attract-card{text-align:center!important;padding:20px 14px!important}.cc4-attract-card .cc4-icon{margin:0 auto 10px!important}.cc4-metrics{grid-template-columns:1fr!important;max-width:940px!important;margin:0 auto!important;text-align:center!important}.cc4-kpis{grid-template-columns:repeat(4,1fr)!important}.cc4-dashboard{text-align:left!important}.cc4-destinos,.cc4-extra{max-width:940px!important;margin:0 auto!important}.cc4-extra .cc4-card{text-align:center!important}.cc4-cta-box{text-align:center!important;flex-direction:column!important;justify-content:center!important}.cc4-cta-box .cc4-btn{margin:0 auto!important}'+
 '#conectaSegurancaCandidaturaEM{background:linear-gradient(180deg,#f8f1fd,#fff)!important;border:0!important}#conectaSegurancaCandidaturaEM .cc4-wrap{max-width:980px!important;padding:36px!important;border:1px solid #dfcdea!important;border-radius:24px!important;background:#fff!important;box-shadow:0 14px 40px rgba(92,32,124,.08)!important}#conectaSegurancaCandidaturaEM .cc4-head{margin-bottom:20px!important}#conectaSegurancaCandidaturaEM .cc4-title{font-size:32px!important}#conectaSegurancaCandidaturaEM .cc4-info{font-size:14px!important;padding:18px!important;border:1px solid #eadcf2!important;background:#f8f2fb!important;color:#4e315b!important}'+
 '@media(max-width:920px){.cc4-flow,.cc4-methods,.cc4-int-side,.cc4-kpis{grid-template-columns:1fr 1fr!important}}@media(max-width:620px){.cc4-hero h1{font-size:32px!important}.cc4-mini,.cc4-flow,.cc4-methods,.cc4-int-side,.cc4-kpis{grid-template-columns:1fr!important}#conectaSegurancaCandidaturaEM .cc4-wrap{padding:25px 18px!important}.cc4-title,#conectaSegurancaCandidaturaEM .cc4-title{font-size:25px!important}}';
 document.head.appendChild(st5);

 const stLogos=document.createElement('style');stLogos.id='estiloConectaLogosEM';document.getElementById(stLogos.id)?.remove();
 stLogos.textContent='.cc4-logos{padding:44px 0!important;background:#faf9fb!important;overflow:hidden!important}.cc4-logos-head{text-align:center!important;margin-bottom:22px!important}.cc4-logos-head h2{margin:0!important;color:#173f50!important;font-size:25px!important}.cc4-logo-track-wrap{width:100%!important;overflow:hidden!important;mask-image:linear-gradient(to right,transparent,#000 8%,#000 92%,transparent)!important;-webkit-mask-image:linear-gradient(to right,transparent,#000 8%,#000 92%,transparent)!important}.cc4-logo-track{display:flex!important;flex-direction:row!important;align-items:center!important;gap:14px!important;width:max-content!important;animation:cc4LogoMarqueeEM 28s linear infinite!important;will-change:transform!important}.cc4-logo-track:hover{animation-play-state:paused!important}.cc4-logo{display:flex!important;align-items:center!important;justify-content:center!important;flex:0 0 150px!important;height:64px!important;padding:0 18px!important;border:1px solid #e6ddec!important;border-radius:14px!important;background:#fff!important;color:#435765!important;font-size:13px!important;font-weight:750!important;white-space:nowrap!important;box-shadow:0 5px 16px rgba(55,30,70,.04)!important}@keyframes cc4LogoMarqueeEM{from{transform:translateX(0)}to{transform:translateX(calc(-50% - 7px))}}@media(max-width:620px){.cc4-logos{padding:32px 0!important}.cc4-logo{flex-basis:130px!important;height:58px!important}.cc4-logo-track{animation-duration:22s!important}}';
 document.head.appendChild(stLogos);
 const stMulti=document.createElement('style');stMulti.id='estiloConectaMulticanalEM';document.getElementById(stMulti.id)?.remove();stMulti.textContent='.conecta-multicanal-em{background:linear-gradient(180deg,#fff,#faf5fd)!important}.conecta-multicanal-em .cc4-head{max-width:850px!important}.conecta-multicanal-em .cc4-title{font-size:34px!important}.conecta-multicanal-em .cc4-grid4{max-width:1040px!important;margin:0 auto!important}.conecta-multicanal-em .cc4-card{min-height:185px!important;justify-content:center!important}.conecta-multicanal-em .cc4-info{margin-top:22px!important;background:#5f1d83!important;color:#fff!important;border-color:#5f1d83!important;padding:18px 24px!important;border-radius:14px!important}@media(max-width:620px){.conecta-multicanal-em .cc4-title{font-size:27px!important}}';document.head.appendChild(stMulti);

 pagina.innerHTML=
 '<section class="cc4-hero"><div class="cc4-wrap cc4-hero-grid"><div><span class="cc4-kicker">+Empregos Conecta</span><h1>Suas vagas conectadas. <em>Seus candidatos no processo oficial da sua empresa.</em></h1><p>Conectamos o portal de carreiras ou ATS da sua empresa ao +Empregos e cuidamos da publicação, atualização, encerramento e distribuição das vagas. O trabalho da sua equipe passa a ser focar no que realmente importa: acompanhar, selecionar e gerenciar candidatos.</p><div class="cc4-mini"><div><strong>Sem cadastro manual</strong><span>Publique no seu sistema e deixe a sincronização com a gente.</span></div><div><strong>Vagas sempre atualizadas</strong><span>Alterações e encerramentos acompanham automaticamente a origem.</span></div><div><strong>Foco nos candidatos</strong><span>Sua equipe cuida da seleção enquanto o Conecta cuida das vagas.</span></div></div><div class="cc4-actions"><button class="cc4-btn pri" type="button" onclick="solicitarPlanoIntegracaoEM(\'conecta\')">Quero conectar minhas vagas</button><button class="cc4-btn sec" type="button" onclick="irPara(\'login-conecta\')">Acessar Painel Conecta</button></div></div><aside class="cc4-hero-panel"><strong>Depois de conectado</strong><div class="cc4-flow"><article><div class="cc4-icon">'+svg('publicar')+'</div><div><h3>Publicou na origem</h3><p>A vaga é identificada e preparada para aparecer no +Empregos.</p></div><b>Automático</b></article><article><div class="cc4-icon">'+svg('editar')+'</div><div><h3>Alterou a vaga</h3><p>Título, descrição, localidade e demais dados acompanham a origem.</p></div><b>Sincronizado</b></article><article><div class="cc4-icon">'+svg('excluir')+'</div><div><h3>Encerrou ou excluiu</h3><p>A oportunidade deixa de ser exibida conforme o status na origem.</p></div><b>Automático</b></article></div><div class="cc4-note">A equipe continua trabalhando no sistema de sempre. O Conecta cuida da atualização no +Empregos.</div></aside></div></section>'+

 '<section id="conectaSegurancaTopoEM" class="cc4-section alt"><div class="cc4-wrap"><div class="cc4-head"><span class="cc4-kicker">Segurança e controle</span><h2 class="cc4-title">O candidato volta para o ambiente oficial da sua empresa</h2><p class="cc4-text">O +Empregos amplia a descoberta das vagas, mas não precisa substituir o processo seletivo da empresa. Ao se candidatar, o profissional pode ser direcionado para a vaga oficial no seu portal ou ATS, mantendo formulários, etapas e regras no ambiente que sua equipe já utiliza.</p></div><div class="cc4-grid4"><article class="cc4-card cc4-feature"><div class="cc4-icon">'+svg('portal')+'</div><div><strong>Portal oficial</strong><span>A candidatura pode ser concluída diretamente na origem da vaga.</span></div></article><article class="cc4-card cc4-feature"><div class="cc4-icon">'+svg('fluxo')+'</div><div><strong>Processo preservado</strong><span>Seu ATS, formulários e etapas continuam fazendo parte da seleção.</span></div></article><article class="cc4-card cc4-feature"><div class="cc4-icon">'+svg('usuarios')+'</div><div><strong>Empresa no controle</strong><span>O Conecta amplia o alcance sem tomar o lugar do processo da empresa.</span></div></article><article class="cc4-card cc4-feature"><div class="cc4-icon">'+svg('canais')+'</div><div><strong>Origem vinculada</strong><span>A vaga permanece ligada ao canal oficial usado na integração.</span></div></article></div><div class="cc4-info"><strong>+Empregos → candidato encontra a vaga → portal oficial da empresa → candidatura.</strong></div></div></section>'+'<section class="cc4-section alt"><div class="cc4-wrap"><div class="cc4-head"><span class="cc4-kicker">Automação</span><h2 class="cc4-title">Uma única rotina para o RH</h2><p class="cc4-text">A empresa não precisa cadastrar, editar ou encerrar a mesma vaga em dois lugares.</p></div><div class="cc4-grid4"><article class="cc4-card cc4-feature"><div class="cc4-icon">'+svg('publicar')+'</div><div><strong>Publicação</strong><span>Publique no portal ou ATS da empresa. O Conecta acompanha a origem.</span></div></article><article class="cc4-card cc4-feature"><div class="cc4-icon">'+svg('editar')+'</div><div><strong>Atualização</strong><span>As alterações feitas na vaga podem ser refletidas no +Empregos.</span></div></article><article class="cc4-card cc4-feature"><div class="cc4-icon">'+svg('excluir')+'</div><div><strong>Encerramento</strong><span>Quando a vaga termina na origem, ela pode ser retirada automaticamente.</span></div></article><article class="cc4-card cc4-feature"><div class="cc4-icon">'+svg('fluxo')+'</div><div><strong>Processo preservado</strong><span>O candidato segue o destino definido pela empresa.</span></div></article></div></div></section>'+

 '<section class="cc4-section"><div class="cc4-wrap"><div class="cc4-head"><span class="cc4-kicker">Integração</span><h2 class="cc4-title">Como conectamos suas vagas</h2><p class="cc4-text">Você informa a origem das oportunidades. Nós validamos a tecnologia disponível e configuramos a conexão adequada.</p></div><div class="cc4-integration"><div><div class="cc4-methods"><article class="cc4-card cc4-method"><div class="cc4-icon">'+svg('api')+'</div><div><h3>API / ATS</h3><p>Conexão estruturada quando o sistema oferece API ou integração própria.</p></div></article><article class="cc4-card cc4-method"><div class="cc4-icon">'+svg('feed')+'</div><div><h3>Feed de vagas</h3><p>Leitura de feeds estruturados disponibilizados pela plataforma.</p></div></article><article class="cc4-card cc4-method"><div class="cc4-icon">'+svg('webhook')+'</div><div><h3>Webhook / eventos</h3><p>Quando disponível, recebemos alterações assim que acontecem.</p></div></article><article class="cc4-card cc4-method"><div class="cc4-icon">'+svg('portal')+'</div><div><h3>Página de carreiras</h3><p>Em portais públicos, as vagas também podem ser identificadas diretamente na fonte.</p></div></article></div><div class="cc4-info">A empresa não precisa desenvolver a integração do zero. Nossa equipe configura, valida e testa a origem antes da ativação.</div></div><div class="cc4-int-side"><article class="cc4-int-step"><i>01</i><div><strong>Informe a origem</strong><span>Portal, ATS, feed ou página de vagas.</span></div></article><article class="cc4-int-step"><i>02</i><div><strong>Validamos a tecnologia</strong><span>Identificamos a melhor forma de conexão.</span></div></article><article class="cc4-int-step"><i>03</i><div><strong>Conferimos as vagas</strong><span>Títulos, links, localidades e demais campos.</span></div></article><article class="cc4-int-step"><i>04</i><div><strong>Ativamos a sincronização</strong><span>Novas vagas, alterações e encerramentos acompanham a origem.</span></div></article></div></div></div></section>'+

 '<section class="cc4-section conecta-multicanal-em"><div class="cc4-wrap"><div class="cc4-head"><span class="cc4-kicker">Mais alcance, menos trabalho</span><h2 class="cc4-title">Chega de ficar anunciando vagas em diversos portais.</h2><p class="cc4-text">O +Empregos Conecta faz esse trabalho por você. Sua empresa mantém a vaga no canal oficial e o Conecta ajuda a ampliar a distribuição e o alcance das oportunidades, preservando o destino oficial da candidatura.</p></div><div class="cc4-grid4"><article class="cc4-card cc4-feature"><div class="cc4-icon">'+svg('canais')+'</div><div><strong>Mais canais</strong><span>Amplie a presença das oportunidades sem repetir o mesmo trabalho operacional.</span></div></article><article class="cc4-card cc4-feature"><div class="cc4-icon">'+svg('portal')+'</div><div><strong>Com segurança</strong><span>O candidato pode seguir para o portal oficial ou ATS da empresa para concluir a candidatura.</span></div></article><article class="cc4-card cc4-feature"><div class="cc4-icon">'+svg('alcance')+'</div><div><strong>Mais alcance</strong><span>Leve suas vagas a mais candidatos e regiões por meio da estratégia de distribuição.</span></div></article><article class="cc4-card cc4-feature"><div class="cc4-icon">'+svg('usuarios')+'</div><div><strong>Aumente seu banco de currículos</strong><span>Mais candidatos descobrindo suas oportunidades significa mais profissionais entrando no seu processo de recrutamento.</span></div></article></div><div class="cc4-info"><strong>Você publica uma vez. O Conecta amplia a distribuição. Sua empresa continua no controle do processo.</strong></div></div></section>'+'<section class="cc4-section alt"><div class="cc4-wrap"><div class="cc4-attract"><div class="cc4-attract-top"><div><span class="cc4-kicker">Atração de candidatos</span><h2>Atração e distribuição</h2></div><p>Depois de sincronizada, a vaga entra na estratégia de alcance do +Empregos sem alterar o processo da empresa.</p></div><div class="cc4-attract-grid"><article class="cc4-attract-card"><div class="cc4-icon">'+svg('alcance')+'</div><strong>Alcance nacional</strong><span>Divulgação para candidatos em diferentes regiões do Brasil.</span></article><article class="cc4-attract-card"><div class="cc4-icon">'+svg('alvo')+'</div><strong>Segmentação</strong><span>Campanhas podem considerar localização, área e perfil da vaga.</span></article><article class="cc4-attract-card"><div class="cc4-icon">'+svg('canais')+'</div><strong>Mais canais</strong><span>Portal, mídia digital e canais externos de descoberta, quando aplicável.</span></article><article class="cc4-attract-card"><div class="cc4-icon">'+svg('usuarios')+'</div><strong>Processo preservado</strong><span>Mais alcance sem mudar o destino da candidatura.</span></article></div></div></div></section>'+

 '<section class="cc4-section"><div class="cc4-wrap"><div class="cc4-metrics"><div><span class="cc4-kicker">Gráficos e indicadores</span><h2 class="cc4-title">Desempenho das vagas</h2><p class="cc4-text">No Painel Conecta, a empresa acompanha os principais indicadores da distribuição para entender o alcance das oportunidades e o interesse dos candidatos.</p><div class="cc4-kpis"><article class="cc4-kpi"><span>Visualizações</span><strong>1.284</strong></article><article class="cc4-kpi"><span>Cliques em candidatar</span><strong>326</strong></article><article class="cc4-kpi"><span>Candidatos enviados</span><strong>198</strong></article><article class="cc4-kpi"><span>Conversão</span><strong>15,4%</strong></article></div></div><div class="cc4-dashboard"><div class="cc4-dashboard-head"><strong>Exemplo de desempenho</strong><span>Visão ilustrativa do painel</span></div><div class="cc4-chart"><div class="cc4-bar" data-l="Seg" style="height:38%"></div><div class="cc4-bar" data-l="Ter" style="height:55%"></div><div class="cc4-bar" data-l="Qua" style="height:72%"></div><div class="cc4-bar" data-l="Qui" style="height:64%"></div><div class="cc4-bar" data-l="Sex" style="height:88%"></div><div class="cc4-bar" data-l="Sáb" style="height:48%"></div><div class="cc4-bar" data-l="Dom" style="height:34%"></div></div><div class="cc4-dashboard-note">Os números desta página são apenas ilustrativos. O Painel Conecta utiliza os dados reais da operação da empresa.</div></div></div></div></section>'+

 '<section class="cc4-section alt"><div class="cc4-wrap"><div class="cc4-head"><span class="cc4-kicker">Candidaturas</span><h2 class="cc4-title">Destino das candidaturas</h2><p class="cc4-text">O padrão é manter a candidatura no portal de origem. Se necessário, uma vaga específica pode usar e-mail ou WhatsApp.</p></div><div class="cc4-destinos"><article class="cc4-card cc4-destino"><div class="cc4-icon">'+svg('portal')+'</div><div><h3>Portal de origem</h3><p>O candidato segue para a página oficial da oportunidade no ATS ou portal da empresa.</p><small>Destino padrão</small></div></article><article class="cc4-card cc4-destino"><div class="cc4-icon">'+svg('email')+'</div><div><h3>E-mail</h3><p>Dados e currículo podem ser enviados ao endereço definido para aquela vaga.</p><small>Exceção por vaga</small></div></article><article class="cc4-card cc4-destino"><div class="cc4-icon">'+svg('whatsapp')+'</div><div><h3>WhatsApp</h3><p>O candidato abre uma mensagem pronta com identificação da vaga e acesso ao currículo.</p><small>Exceção por vaga</small></div></article></div><div class="cc4-info">A empresa pode manter um e-mail e WhatsApp padrão e substituir o contato somente nas vagas que precisarem de uma regra diferente.</div></div></section>'+

 '<section class="cc4-section"><div class="cc4-wrap"><div class="cc4-head"><span class="cc4-kicker">Serviços adicionais</span><h2 class="cc4-title">Recursos por vaga</h2><p class="cc4-text">Ative somente quando a oportunidade precisar de mais visibilidade, velocidade ou discrição.</p></div><div class="cc4-extra"><article class="cc4-card"><div class="cc4-icon">'+svg('destaque')+'</div><h3>Destaque de vaga</h3><p>Mais evidência dentro do portal e nas áreas de maior visibilidade.</p><small>Mais visibilidade</small></article><article class="cc4-card urgente"><div class="cc4-icon">'+svg('urgente')+'</div><h3>Urgência</h3><p>Sinalização especial para vagas com necessidade de contratação rápida.</p><small>Contratação imediata</small></article><article class="cc4-card confidencial"><div class="cc4-icon">'+svg('confidencial')+'</div><h3>Vaga confidencial</h3><p>Publique a oportunidade sem exibir o nome da empresa quando necessário.</p><small>Privacidade por vaga</small></article></div></div></section>'+

 '<section class="cc4-logos"><div class="cc4-wrap"><div class="cc4-logos-head"><h2>Empresas</h2></div><div class="cc4-logo-track-wrap"><div class="cc4-logo-track"><div class="cc4-logo">Mercado Livre</div><div class="cc4-logo">Localiza</div><div class="cc4-logo">Magalu</div><div class="cc4-logo">Natura</div><div class="cc4-logo">Ambev</div><div class="cc4-logo">Renner</div><div class="cc4-logo">Vivo</div><div class="cc4-logo">iFood</div><div class="cc4-logo">RaiaDrogasil</div><div class="cc4-logo">Mercado Livre</div><div class="cc4-logo">Localiza</div><div class="cc4-logo">Magalu</div><div class="cc4-logo">Natura</div><div class="cc4-logo">Ambev</div><div class="cc4-logo">Renner</div><div class="cc4-logo">Vivo</div><div class="cc4-logo">iFood</div><div class="cc4-logo">RaiaDrogasil</div></div></div></div></section>'+ '<section class="cc4-cta"><div class="cc4-wrap"><div class="cc4-cta-box"><div><h2>Menos trabalho operacional. Mais alcance para suas vagas.</h2><p>Conecte o sistema da empresa ao +Empregos e centralize sincronização, distribuição e acompanhamento em uma única operação.</p></div><button class="cc4-btn" type="button" onclick="solicitarPlanoIntegracaoEM(\'conecta\')">Falar sobre o Conecta</button></div></div></section>';
}
let conectaShowcaseIndiceEM=0;
let conectaShowcaseTimerEM=null;
function renderConectaShowcaseEM(){
 const box=document.getElementById('conectaShowcaseEM');if(!box)return;
 const slides=[...box.querySelectorAll('.conecta-slide-em')];
 const dots=[...box.querySelectorAll('.conecta-showcase-dots-em button')];
 if(!slides.length)return;
 conectaShowcaseIndiceEM=(conectaShowcaseIndiceEM+slides.length)%slides.length;
 slides.forEach((el,i)=>el.classList.toggle('ativo',i===conectaShowcaseIndiceEM));
 dots.forEach((el,i)=>el.classList.toggle('ativo',i===conectaShowcaseIndiceEM));
 const atual=document.getElementById('conectaShowcaseAtualEM');
 if(atual)atual.textContent=String(conectaShowcaseIndiceEM+1).padStart(2,'0');
 const progress=document.getElementById('conectaShowcaseProgressEM');
 if(progress){progress.style.animation='none';void progress.offsetWidth;progress.style.animation='conectaShowcaseProgressEM 6s linear forwards'}
}
function moverConectaShowcaseEM(dir=1){
 conectaShowcaseIndiceEM+=Number(dir)||1;
 renderConectaShowcaseEM();
 iniciarConectaShowcaseEM();
}
function irConectaShowcaseEM(i){
 conectaShowcaseIndiceEM=Number(i)||0;
 renderConectaShowcaseEM();
 iniciarConectaShowcaseEM();
}
function iniciarConectaShowcaseEM(){
 clearInterval(conectaShowcaseTimerEM);
 const box=document.getElementById('conectaShowcaseEM');if(!box)return;
 conectaShowcaseTimerEM=setInterval(()=>{
   conectaShowcaseIndiceEM++;
   renderConectaShowcaseEM();
 },6000);
 if(!box.dataset.showcaseBind){
   box.dataset.showcaseBind='1';
   box.addEventListener('mouseenter',()=>clearInterval(conectaShowcaseTimerEM));
   box.addEventListener('mouseleave',iniciarConectaShowcaseEM);
   box.addEventListener('focusin',()=>clearInterval(conectaShowcaseTimerEM));
   box.addEventListener('focusout',iniciarConectaShowcaseEM);
 }
 renderConectaShowcaseEM();
}
window.moverConectaShowcaseEM=moverConectaShowcaseEM;
window.irConectaShowcaseEM=irConectaShowcaseEM;
window.iniciarConectaShowcaseEM=iniciarConectaShowcaseEM;

function lerRota(){
 const params=new URLSearchParams(location.search);
 const pagina=params.get('pagina')||'home';
 const vaga=params.get('vaga')||'';
 if(pagina==='candidatos-empresa'){
  if(vaga)sessionStorage.setItem('vagaCandidatosSelecionada',String(vaga));
  else{
   sessionStorage.removeItem('vagaCandidatosSelecionada');
   sessionStorage.removeItem('filtroNaoVisualizadosEM');
   sessionStorage.setItem('filtroCandidatos','Todos');
  }
 }
 abrirRota(pagina);
 if(pagina==='candidatos-empresa'){
  setTimeout(function(){
   if(vaga&&typeof renderizarCandidatosEmpresa==='function')renderizarCandidatosEmpresa();
   else if(!vaga&&typeof renderCentralProcessosEmpresaEM==='function')renderCentralProcessosEmpresaEM();
  },30);
 }
}function msg(id,t,ok=false){const e=$(id);if(!e)return;e.textContent=t;e.className='form-msg '+(ok?'ok':'erro')}function entrar(tipo,d){const retorno=tipo==='candidato'?sessionStorage.getItem('retornoCandidatura'):null,salvar=tipo==='candidato'?sessionStorage.getItem('retornoSalvarVaga'):null,vaga=tipo==='candidato'?sessionStorage.getItem('vagaSelecionada'):null,plano=tipo==='empresa'?sessionStorage.getItem('planoPretendido'):null,token=sessionStorage.getItem('empregaMaisSupabaseAccessToken')||localStorage.getItem('empregaMaisSupabaseAccessToken'),refresh=sessionStorage.getItem('empregaMaisSupabaseRefreshToken')||localStorage.getItem('empregaMaisSupabaseRefreshToken'),draft=localStorage.getItem('empregaMaisRascunhoVaga');sessionStorage.clear();if(token)sessionStorage.setItem('empregaMaisSupabaseAccessToken',token);if(refresh)sessionStorage.setItem('empregaMaisSupabaseRefreshToken',refresh);if(draft)localStorage.setItem('empregaMaisRascunhoVaga',draft);sessionStorage.setItem('empregaMaisPapel',tipo);localStorage.setItem('empregaMaisPapelPersistido',tipo);sessionStorage.setItem(tipo+'Nome',d.nome);if(tipo==='empresa'){sessionStorage.setItem('empresaCnpj',d.cnpj);if(plano)sessionStorage.setItem('planoPretendido',plano)}else{sessionStorage.setItem('candidatoEmail',d.email);if(retorno)sessionStorage.setItem('retornoCandidatura',retorno);if(salvar)sessionStorage.setItem('retornoSalvarVaga',salvar);if(vaga)sessionStorage.setItem('vagaSelecionada',vaga)}irPara('painel-'+tipo)}function cadastrarEmpresa(e){e.preventDefault();const senha=$('#cadEmpresaSenha').value,nome=$('#cadEmpresaNome').value.trim(),email=$('#cadEmpresaEmail').value.trim().toLowerCase(),telefone=$('#cadEmpresaTelefone').value.trim(),cnpj=nums($('#cadEmpresaCnpj').value);if(nome.length<2)return msg('#msgCadastroEmpresa','Informe o nome da empresa.');if(cnpj.length!==14)return msg('#msgCadastroEmpresa','Informe um CNPJ com 14 números.');if(!email.includes('@'))return msg('#msgCadastroEmpresa','Informe um e-mail válido.');if(nums(telefone).length<10)return msg('#msgCadastroEmpresa','Informe um telefone válido.');if(senha.length<6)return msg('#msgCadastroEmpresa','A senha deve ter pelo menos 6 caracteres.');if(senha!==$('#cadEmpresaSenha2').value)return msg('#msgCadastroEmpresa','As senhas não conferem.');const lista=ler('empregaMaisEmpresas');if(lista.some(x=>x.cnpj===cnpj))return msg('#msgCadastroEmpresa','Já existe uma empresa cadastrada com este CNPJ.');if(lista.some(x=>(x.email||'').toLowerCase()===email))return msg('#msgCadastroEmpresa','Já existe uma empresa cadastrada com este e-mail.');const d={id:'empresa_'+Date.now(),nome,cnpj,email,telefone,senha,plano:'basico',planoStatus:'ativo',criadoEm:new Date().toISOString()};lista.push(d);gravar('empregaMaisEmpresas',lista);entrar('empresa',d)}function loginEmpresa(e){e.preventDefault();const acesso=($('#loginEmpresaCnpj').value||'').trim(),senha=$('#loginEmpresaSenha').value,cnpj=nums(acesso),email=acesso.toLowerCase(),d=ler('empregaMaisEmpresas').find(x=>((cnpj.length===14&&x.cnpj===cnpj)||((x.email||'').toLowerCase()===email))&&x.senha===senha);if(!d)return msg('#msgLoginEmpresa','CNPJ/e-mail ou senha incorretos.');entrar('empresa',d);if(sessionStorage.getItem('planoPretendido'))setTimeout(()=>irPara('planos'),30)}function cadastrarCandidato(e){e.preventDefault();return cadastrarCandidatoSupabaseEM(e)}
function loginCandidato(e){e.preventDefault();return loginCandidatoSupabaseEM(e)}
function candidatoPremiumAtivoEM(c){if(adminVisualizacaoAtivaEM()&&adminVisualizacaoPerfilEM()==='candidato-premium')return true;if(adminVisualizacaoAtivaEM()&&adminVisualizacaoPerfilEM()==='candidato-gratis')return false;c=c||candidatoLogado();return !!(c&&c.premium===true&&sessionStorage.getItem('candidatoPremiumVerificadoEM')==='1')}
function candidatoLogado(){const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase();return ler('empregaMaisCandidatos').find(c=>(c.email||'').toLowerCase()===email)||null}
function candidaturaPertenceCandidatoAtualEM(c){
 if(!c)return false;
 const atual=candidatoLogado()||{};
 const uid=String(sessionStorage.getItem('candidatoSupabaseUserId')||atual.userId||'').trim();
 const cUid=String(c.candidatoUserId||c.candidato_user_id||'').trim();
 if(uid&&cUid)return uid===cUid;
 const email=String(sessionStorage.getItem('candidatoEmail')||atual.email||'').trim().toLowerCase();
 const cEmail=String(c.email||c.candidatoEmail||c.candidato_email||'').trim().toLowerCase();
 return !!(email&&cEmail&&email===cEmail)
}
function candidaturasDoCandidatoAtualEM(){
 return (candidaturas()||[]).filter(candidaturaPertenceCandidatoAtualEM)
}
function carregarPerfilCandidato(){const c=candidatoLogado();if(!c)return;const p=c.perfil||{},set=(id,v)=>{const e=$('#'+id);if(e)e.value=v||''};set('candPerfilNome',c.nome);set('candPerfilTelefone',c.telefone);set('candPerfilEmail',c.email);set('candPerfilCidade',c.cidade);set('candPerfilUf',p.uf);set('candPerfilNascimento',p.nascimento);set('candPerfilTitulo',p.titulo);set('candPerfilArea',p.area);set('candPerfilEscolaridade',p.escolaridade);set('candPerfilExperiencia',p.experiencia);set('candPerfilPretensao',p.pretensao);set('candPerfilModalidade',p.modalidade);set('candPerfilDisponibilidade',p.disponibilidade);set('candPerfilResumo',p.resumo);set('candPerfilCompetencias',p.competencias);set('candPerfilLinkedin',p.linkedin);set('candPerfilPortfolio',p.portfolio)}
function salvarPerfilCandidato(e){e.preventDefault();const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),a=ler('empregaMaisCandidatos'),i=a.findIndex(c=>(c.email||'').toLowerCase()===email);if(i<0)return msg('#msgPerfilCandidato','Não foi possível localizar seu cadastro.');const val=id=>$('#'+id)?.value.trim()||'',nome=val('candPerfilNome'),telefone=val('candPerfilTelefone'),cidade=val('candPerfilCidade'),linkedin=val('candPerfilLinkedin'),portfolio=val('candPerfilPortfolio');if(nome.length<3)return msg('#msgPerfilCandidato','Informe seu nome completo.');if(nums(telefone).length<10)return msg('#msgPerfilCandidato','Informe um telefone válido.');if(cidade.length<2)return msg('#msgPerfilCandidato','Informe sua cidade.');if(linkedin&&!/^https?:\/\//i.test(linkedin))return msg('#msgPerfilCandidato','O LinkedIn deve começar com http:// ou https://.');if(portfolio&&!/^https?:\/\//i.test(portfolio))return msg('#msgPerfilCandidato','O portfólio deve começar com http:// ou https://.');const p={uf:val('candPerfilUf').toUpperCase(),nascimento:val('candPerfilNascimento'),titulo:val('candPerfilTitulo'),area:val('candPerfilArea'),escolaridade:val('candPerfilEscolaridade'),experiencia:val('candPerfilExperiencia'),pretensao:val('candPerfilPretensao'),modalidade:val('candPerfilModalidade'),disponibilidade:val('candPerfilDisponibilidade'),resumo:val('candPerfilResumo'),competencias:val('candPerfilCompetencias'),linkedin,portfolio};a[i]={...a[i],nome,telefone,cidade,perfil:p,perfilAtualizadoEm:new Date().toISOString()};gravar('empregaMaisCandidatos',a);sessionStorage.setItem('candidatoNome',a[i].nome);msg('#msgPerfilCandidato','Perfil profissional salvo com sucesso.',true);atualizarPainelCandidato()}
function empresaLogada(){const c=sessionStorage.getItem('empresaCnpj')||'';return ler('empregaMaisEmpresas').find(e=>e.cnpj===c)||null}
function abaPerfilEmpresa(aba,btn){const pub=$('#perfilPublico'),conta=$('#perfilConta');if(pub)pub.classList.toggle('oculto',aba!=='publico');if(conta)conta.classList.toggle('oculto',aba!=='conta');document.querySelectorAll('.perfil-tabs button').forEach(b=>b.classList.remove('ativo'));btn?.classList.add('ativo')}
function carregarPerfilEmpresa(){const e=empresaLogada();if(!e)return;const p=e.perfil||{},set=(id,v)=>{const x=$('#'+id);if(x)x.value=v||''};const mapa={perfilNome:p.nome||e.nome,perfilSegmento:p.segmento,perfilCidade:p.cidade||e.cidade,perfilUf:p.uf||e.uf,perfilPorte:p.porte,perfilFuncionarios:p.funcionarios,perfilFrequenciaContratacao:p.frequenciaContratacao,perfilResponsavelContratacoes:p.responsavelContratacoes,perfilUsaAts:p.usaAts,perfilAtsNome:p.atsNome,perfilSiteRecrutamento:p.siteRecrutamento||p.site,perfilAnunciaSite:p.anunciaSite,perfilPaginaCarreiras:p.paginaCarreiras,perfilFundacao:p.fundacao,perfilSlogan:p.slogan,perfilSobre:p.sobre,perfilMissao:p.missao,perfilVisao:p.visao,perfilValores:p.valores,perfilCultura:p.cultura,perfilAmbiente:p.ambiente,perfilBeneficios:p.beneficios,perfilCarreira:p.carreira,perfilModalidades:p.modalidades,perfilAreas:p.areas,perfilSite:p.site,perfilLinkedin:p.linkedin,perfilInstagram:p.instagram,perfilFacebook:p.facebook,perfilVideo:p.video,perfilEmailPublico:p.emailPublico,perfilLogo:p.logo,perfilCapa:p.capa,perfilRazao:e.razaoSocial,perfilCnpj:e.cnpj,perfilResponsavel:e.responsavel,contaFuncaoResponsavel:e.funcaoResponsavel||e.funcao_responsavel||'',perfilEmailConta:e.email,contaEmailCandidaturas:e.emailCandidaturas||e.email,perfilTelefone:e.telefone,perfilCep:e.cep,perfilCidadeConta:e.cidade,perfilUfConta:e.uf};Object.entries(mapa).forEach(([id,v])=>set(id,v))}
function salvarPerfilEmpresa(ev){ev.preventDefault();const c=sessionStorage.getItem('empresaCnpj')||'',a=ler('empregaMaisEmpresas'),i=a.findIndex(e=>e.cnpj===c);if(i<0)return msg('#msgPerfilEmpresa','Sua sessão de empresa não foi localizada.');const anterior=JSON.parse(JSON.stringify(a[i]||{})),v=id=>$('#'+id)?.value.trim()||'',nome=v('perfilNome'),email=v('contaEmail').toLowerCase(),telefone=v('contaTelefone');if(nome.length<2)return msg('#msgPerfilEmpresa','Informe o nome da empresa.');if(email&&!email.includes('@'))return msg('#msgPerfilEmpresa','Informe um e-mail válido.');if(telefone&&nums(telefone).length<10)return msg('#msgPerfilEmpresa','Informe um telefone válido.');if(email&&a.some((x,k)=>k!==i&&(x.email||'').toLowerCase()===email))return msg('#msgPerfilEmpresa','Este e-mail já está vinculado a outra empresa.');const urlOk=x=>!x||/^https?:\/\//i.test(x),urls=[['Site',v('perfilSite')],['LinkedIn',v('perfilLinkedin')],['Instagram',v('perfilInstagram')],['Facebook',v('perfilFacebook')],['Vídeo institucional',v('perfilVideo')]];const ruim=urls.find(x=>!urlOk(x[1]));if(ruim)return msg('#msgPerfilEmpresa',ruim[0]+' deve começar com http:// ou https://.');a[i].nome=nome||a[i].nome;a[i].razaoSocial=v('contaRazao');a[i].responsavel=v('contaResponsavel');a[i].funcaoResponsavel=v('contaFuncaoResponsavel');a[i].email=email||a[i].email;a[i].emailCorporativo=email||a[i].emailCorporativo||a[i].email;a[i].emailCandidaturas=(v('contaEmailCandidaturas')||a[i].emailCandidaturas||a[i].email).toLowerCase();a[i].telefone=v('contaTelefone');a[i].cep=v('contaCep');a[i].logradouro=v('contaLogradouro')||a[i].logradouro||'';a[i].bairro=v('contaBairro')||a[i].bairro||'';a[i].numero=v('contaNumero')||a[i].numero||'';a[i].complemento=v('contaComplemento')||a[i].complemento||'';a[i].cidade=v('contaCidade')||v('perfilCidade');a[i].uf=(v('contaUf')||v('perfilUf')).toUpperCase();a[i].perfil={nome:v('perfilNome'),segmento:v('perfilSegmento'),cidade:v('perfilCidade'),uf:v('perfilUf').toUpperCase(),porte:v('perfilPorte'),funcionarios:v('perfilFuncionarios'),frequenciaContratacao:v('perfilFrequenciaContratacao'),responsavelContratacoes:v('perfilResponsavelContratacoes'),usaAts:v('perfilUsaAts'),atsNome:v('perfilAtsNome'),siteRecrutamento:v('perfilSiteRecrutamento'),anunciaSite:v('perfilAnunciaSite'),paginaCarreiras:v('perfilPaginaCarreiras'),fundacao:v('perfilFundacao'),slogan:v('perfilSlogan'),sobre:v('perfilSobre'),missao:v('perfilMissao'),visao:v('perfilVisao'),valores:v('perfilValores'),cultura:v('perfilCultura'),ambiente:v('perfilAmbiente'),beneficios:v('perfilBeneficios'),carreira:v('perfilCarreira'),modalidades:v('perfilModalidades'),areas:v('perfilAreas'),site:v('perfilSite'),linkedin:v('perfilLinkedin'),instagram:v('perfilInstagram'),facebook:v('perfilFacebook'),video:v('perfilVideo'),emailPublico:v('perfilEmailPublico'),logo:v('perfilLogo'),capa:v('perfilCapa')};a[i].perfilAtualizadoEm=new Date().toISOString();
const statusAntes=anterior.verificada||anterior.verificacaoStatus==='aprovada'?'aprovada':(anterior.verificacaoStatus||'');
const norm=x=>String(x||'').trim().toLowerCase();
const criticosAntes=[anterior.nome,anterior.razaoSocial,anterior.cnpj,anterior.cep,anterior.cidade,anterior.uf,anterior.perfil?.nome,anterior.perfil?.cidade,anterior.perfil?.uf];
const criticosDepois=[a[i].nome,a[i].razaoSocial,a[i].cnpj,a[i].cep,a[i].cidade,a[i].uf,a[i].perfil?.nome,a[i].perfil?.cidade,a[i].perfil?.uf];
const alterouCritico=criticosAntes.some((x,k)=>norm(x)!==norm(criticosDepois[k]));
gravar('empregaMaisEmpresas',a);sessionStorage.setItem('empresaNome',a[i].nome);
sincronizarDadosEmpresaBasicosEM(a[i]).catch(err=>console.warn('Dados da empresa não sincronizados:',err));
if(statusAntes==='aprovada'&&alterouCritico){iniciarSolicitacaoVerificacaoEM(a,i,'reanálise');return}
msg('#msgPerfilEmpresa','Dados da empresa salvos com sucesso.',true)}
function visualizarMinhaEmpresa(){const e=empresaLogada();if(!e)return;sessionStorage.setItem('empresaPublicaSelecionada',e.cnpj);irPara('empresa-publica')}
function candidaturaPodeAvaliarEmpresaEM(c){const s=String(c?.status||'').toLowerCase();return !!c&&c.vagaId&&!s.includes('reprov')&&['em contato','entrevista','aprovado','contratado'].some(x=>s.includes(x))}
function abrirAvaliacaoEmpresaEM(candidaturaId){const cand=candidaturas().find(x=>String(x.id)===String(candidaturaId));if(!cand||!candidaturaPodeAvaliarEmpresaEM(cand))return alert('A avaliação fica disponível após sua participação efetiva no processo seletivo.');const vaga=ler('empregaMaisVagas').find(v=>String(v.id)===String(cand.vagaId));if(!vaga)return;const cnpj=vaga.empresaCnpj||vaga.cnpj||'',exist=ler('empregaMaisAvaliacoesEmpresa').find(x=>String(x.candidaturaId)===String(cand.id));if(exist)return alert('Você já avaliou este processo seletivo.');let modal=document.getElementById('modalAvaliacaoEmpresaEM');if(!modal){modal=document.createElement('div');modal.id='modalAvaliacaoEmpresaEM';modal.className='avaliacao-empresa-modal';document.body.appendChild(modal)}modal.innerHTML='<div class="avaliacao-empresa-card"><button class="avaliacao-fechar" type="button" onclick="fecharAvaliacaoEmpresaEM()">×</button><span class="avaliacao-kicker">AVALIAÇÃO VERIFICADA</span><h2>Avalie o processo seletivo</h2><p>Sua avaliação ajuda outros candidatos. Seu nome não será exibido publicamente.</p><form onsubmit="salvarAvaliacaoEmpresaEM(event,\''+esc(cand.id)+'\',\''+esc(cnpj)+'\')"><div class="avaliacao-criterios">'+[['comunicacao','Comunicação'],['clareza','Clareza da vaga'],['organizacao','Organização do processo'],['respeito','Respeito ao candidato'],['feedback','Retorno / feedback']].map(x=>'<label><span>'+x[1]+'</span><select name="'+x[0]+'" required><option value="">Nota</option><option value="5">5 - Excelente</option><option value="4">4 - Muito bom</option><option value="3">3 - Bom</option><option value="2">2 - Regular</option><option value="1">1 - Ruim</option></select></label>').join('')+'</div><label class="avaliacao-recomenda">Você recomendaria participar de um processo seletivo nesta empresa?<select name="recomenda" required><option value="">Selecione</option><option value="sim">Sim</option><option value="nao">Não</option></select></label><label class="avaliacao-comentario">Conte como foi sua experiência <small>Opcional</small><textarea name="comentario" maxlength="700" placeholder="Compartilhe sua experiência sem incluir dados pessoais..."></textarea></label><div class="avaliacao-regras">Sua avaliação será identificada publicamente como <b>Candidato verificado</b>. Não publique nomes, telefones, e-mails ou conteúdo ofensivo.</div><button class="avaliacao-enviar" type="submit">Publicar avaliação</button></form></div>';modal.classList.add('aberto')}
function fecharAvaliacaoEmpresaEM(){document.getElementById('modalAvaliacaoEmpresaEM')?.classList.remove('aberto')}
function salvarAvaliacaoEmpresaEM(ev,candidaturaId,empresaCnpj){ev.preventDefault();const f=ev.currentTarget,fd=new FormData(f),notas=['comunicacao','clareza','organizacao','respeito','feedback'].map(k=>Number(fd.get(k))),media=notas.reduce((a,b)=>a+b,0)/notas.length,arr=ler('empregaMaisAvaliacoesEmpresa');if(arr.some(x=>String(x.candidaturaId)===String(candidaturaId)))return alert('Este processo já foi avaliado.');arr.unshift({id:'av_'+Date.now(),candidaturaId,empresaCnpj,nota:Number(media.toFixed(1)),comunicacao:notas[0],clareza:notas[1],organizacao:notas[2],respeito:notas[3],feedback:notas[4],recomenda:fd.get('recomenda'),comentario:String(fd.get('comentario')||'').trim(),verificada:true,data:new Date().toISOString()});gravar('empregaMaisAvaliacoesEmpresa',arr);fecharAvaliacaoEmpresaEM();alert('Avaliação publicada. Obrigado por compartilhar sua experiência.');try{renderizarCandidaturasCandidato()}catch(e){}}
function seguidoresEmpresaEM(){return ler('empregaMaisSeguidoresEmpresa')}
function candidatoSegueEmpresaEM(cnpj){const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase();return !!email&&seguidoresEmpresaEM().some(x=>(x.candidatoEmail||'').toLowerCase()===email&&nums(x.empresaCnpj||'')===nums(cnpj||''))}
function atualizarSeguirEmpresaEM(){const cnpj=sessionStorage.getItem('empresaPublicaSelecionada')||'',btn=$('#btnSeguirEmpresaEM'),txt=$('#empresaPublicaSeguidoresTexto'),email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),seguindo=candidatoSegueEmpresaEM(cnpj),total=seguidoresEmpresaEM().filter(x=>nums(x.empresaCnpj||'')===nums(cnpj)).length;if(btn){btn.classList.toggle('seguindo',seguindo);btn.textContent=seguindo?'✓ Seguindo':'+ Seguir empresa'}if(txt)txt.textContent=total?total+' candidato'+(total===1?' segue':'s seguem')+' esta empresa':'Conheça a empresa e acompanhe suas oportunidades';const badge=$('#candEmpresasSeguidasBadge');if(badge&&email){const qtd=seguidoresEmpresaEM().filter(x=>(x.candidatoEmail||'').toLowerCase()===email).length;badge.textContent=qtd;badge.classList.toggle('oculto',!qtd)}}
function toggleSeguirEmpresaEM(){if(papelAtual()!=='candidato'){sessionStorage.setItem('retornoSeguirEmpresa','1');alert('Entre na sua conta de candidato para seguir esta empresa.');return irPara('login-candidato')}const cnpj=sessionStorage.getItem('empresaPublicaSelecionada')||'',email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase();if(!cnpj||!email)return;let arr=seguidoresEmpresaEM(),i=arr.findIndex(x=>(x.candidatoEmail||'').toLowerCase()===email&&nums(x.empresaCnpj||'')===nums(cnpj));if(i>=0)arr.splice(i,1);else arr.unshift({id:'seg_'+Date.now(),empresaCnpj:cnpj,candidatoEmail:email,criadoEm:new Date().toISOString(),alertaNovaVaga:true,alertaCompatibilidade:true});gravar('empregaMaisSeguidoresEmpresa',arr);atualizarSeguirEmpresaEM()}
function empresasSeguidasCandidatoEM(){const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),ids=seguidoresEmpresaEM().filter(x=>(x.candidatoEmail||'').toLowerCase()===email).map(x=>nums(x.empresaCnpj||''));return ler('empregaMaisEmpresas').filter(e=>ids.includes(nums(e.cnpj||'')))}
function abrirEmpresasSeguidasEM(){if(papelAtual()!=='candidato')return irPara('login-candidato');let modal=$('#modalEmpresasSeguidasEM');if(!modal){modal=document.createElement('div');modal.id='modalEmpresasSeguidasEM';modal.className='empresas-seguidas-modal';document.body.appendChild(modal)}const es=empresasSeguidasCandidatoEM();modal.innerHTML='<div class="empresas-seguidas-card"><header><div><span>ACOMPANHAMENTO</span><h2>Empresas que sigo</h2><p>Acompanhe empresas e veja rapidamente suas novas oportunidades.</p></div><button type="button" onclick="fecharEmpresasSeguidasEM()">×</button></header><div class="empresas-seguidas-lista">'+(es.length?es.map(e=>{const p=e.perfil||{},cn=e.cnpj||'',vs=vagasPublicas().filter(v=>nums(v.empresaCnpj||v.cnpj||'')===nums(cn));return '<article><div class="empresas-seguidas-logo">'+(p.logo?'<img src="'+esc(p.logo)+'" alt="">':'<b>'+esc((p.nome||e.nome||'E').charAt(0))+'</b>')+'</div><div><strong>'+esc(p.nome||e.nome||'Empresa')+'</strong><span>'+vs.length+' vaga'+(vs.length===1?' aberta':'s abertas')+'</span></div><button type="button" onclick="abrirEmpresaPublica(\''+esc(cn)+'\');fecharEmpresasSeguidasEM()">Ver empresa</button></article>'}).join(''):'<div class="empresas-seguidas-vazio"><b>Você ainda não segue nenhuma empresa.</b><span>Ao seguir uma empresa, ela aparecerá aqui para facilitar o acompanhamento das novas vagas.</span></div>')+'</div></div>';modal.classList.add('aberto');atualizarSeguirEmpresaEM()}
function fecharEmpresasSeguidasEM(){$('#modalEmpresasSeguidasEM')?.classList.remove('aberto')}
function empresaPublicaAbaEM(aba,btn){document.querySelectorAll('#empresaPublicaTabs button').forEach(x=>x.classList.toggle('ativo',x===btn));document.querySelectorAll('#pagina-empresa-publica [data-empresa-pane]').forEach(x=>x.classList.toggle('ativo',x.dataset.empresaPane===aba))}
function empresaPublicaVazioEM(titulo,texto,icone){return '<div class="empresa-publica-empty"><div class="empresa-publica-empty-icon">'+icone+'</div><h3>'+esc(titulo)+'</h3><p>'+esc(texto)+'</p></div>'}
let empresaPublicaVagasPaginaEM=1;
function renderEmpresaPublicaVagasEM(vs,pagina){const porPagina=3,totalPaginas=Math.max(1,Math.ceil(vs.length/porPagina));empresaPublicaVagasPaginaEM=Math.max(1,Math.min(Number(pagina)||1,totalPaginas));const ini=(empresaPublicaVagasPaginaEM-1)*porPagina,box=$('#empresaPublicaVagas'),pag=$('#empresaPublicaVagasPaginacao');if(box)box.innerHTML=vs.length?vs.slice(ini,ini+porPagina).map(cardVagaPortal).join(''):empresaPublicaVazioEM('Nenhuma vaga aberta','Esta empresa não possui oportunidades públicas no momento.','▣');if(pag)pag.innerHTML=vs.length>porPagina?'<button type="button" '+(empresaPublicaVagasPaginaEM===1?'disabled':'')+' onclick="mudarPaginaVagasEmpresaEM('+(empresaPublicaVagasPaginaEM-1)+')">← Anterior</button><span>Página <b>'+empresaPublicaVagasPaginaEM+'</b> de '+totalPaginas+'</span><button type="button" '+(empresaPublicaVagasPaginaEM===totalPaginas?'disabled':'')+' onclick="mudarPaginaVagasEmpresaEM('+(empresaPublicaVagasPaginaEM+1)+')">Próxima →</button>':''}
function mudarPaginaVagasEmpresaEM(pagina){const c=sessionStorage.getItem('empresaPublicaSelecionada')||'',vs=vagasPublicas().filter(v=>(v.empresaCnpj===c||v.cnpj===c)&&!v.confidencial);renderEmpresaPublicaVagasEM(vs,pagina);document.querySelector('[data-empresa-pane="vagas"]')?.scrollIntoView({behavior:'smooth',block:'start'})}
function renderizarEmpresaPublica(){
 const c=sessionStorage.getItem('empresaPublicaSelecionada'),e=ler('empregaMaisEmpresas').find(x=>x.cnpj===c);if(!e)return irPara('home');
 const p=e.perfil||{},ok=e.verificada===true||e.verificacaoStatus==='aprovada',nome=p.nome||e.nome||'Empresa';
 if($('#empresaPublicaNome'))$('#empresaPublicaNome').textContent=nome;if($('#empresaPublicaSlogan'))$('#empresaPublicaSlogan').textContent=p.slogan||'';
 const selo=$('#empresaPublicaSelo');if(selo){selo.hidden=!ok;selo.style.display=ok?'inline-flex':'none'}
 const img=$('#empresaPublicaLogo');if(img){if(p.logo){img.src=p.logo;img.style.display='block'}else{img.removeAttribute('src');img.style.display='none';img.parentElement?.classList.add('sem-logo')}}
 const capa=$('#empresaPublicaCapa');if(capa)capa.style.backgroundImage=p.capa?'url("'+p.capa.replace(/"/g,'')+'")':'';
 const info=$('#empresaPublicaInfo');if(info)info.innerHTML='<div><span>Matriz</span><strong>'+esc((p.cidade||e.cidade||'Não informado')+(p.uf||e.uf?' - '+(p.uf||e.uf):''))+'</strong></div><div><span>Funcionários</span><strong>'+esc(p.porte||'Não informado')+'</strong></div><div><span>Setor</span><strong>'+esc(p.segmento||'Não informado')+'</strong></div><div><span>Fundação</span><strong>'+esc(p.fundacao||'Não informado')+'</strong></div>';
 const vagasEmpresaTodas=ler('empregaMaisVagas').filter(v=>nums(v.empresaCnpj||v.cnpjEmpresa||v.cnpj||'')===nums(c)||String(v.empresaId||'')===String(e.id||'')),vagasEmpresaAbertas=vagasPublicas().filter(v=>(nums(v.empresaCnpj||v.cnpjEmpresa||v.cnpj||'')===nums(c)||String(v.empresaId||'')===String(e.id||''))&&!v.confidencial);const dataEmpresa=e.criadoEm||e.createdAt||e.dataCadastro||e.cadastradoEm||'';let tempoEmpresa='Não informado';if(dataEmpresa){const meses=Math.max(0,Math.floor((Date.now()-new Date(dataEmpresa).getTime())/2629800000));tempoEmpresa=meses>=12?Math.floor(meses/12)+' '+(Math.floor(meses/12)===1?'ano':'anos'):(meses||1)+' '+((meses||1)===1?'mês':'meses')}const datasVagas=vagasEmpresaTodas.map(v=>v.criadoEm||v.createdAt||v.dataPublicacao||v.publicadoEm).filter(Boolean).map(d=>new Date(d)).filter(d=>!isNaN(d));const ultimaVaga=datasVagas.length?new Date(Math.max(...datasVagas.map(d=>d.getTime()))):null;const ultimaTexto=ultimaVaga?textoDataVaga({criadoEm:ultimaVaga.toISOString()}).replace(/^Publicada\s*/i,''):'Nenhuma';if($('#empresaSobreTempoEM'))$('#empresaSobreTempoEM').textContent=tempoEmpresa;if($('#empresaSobrePublicadasEM'))$('#empresaSobrePublicadasEM').textContent=vagasEmpresaTodas.length;if($('#empresaSobreAbertasEM'))$('#empresaSobreAbertasEM').textContent=vagasEmpresaAbertas.length;if($('#empresaSobreUltimaEM'))$('#empresaSobreUltimaEM').textContent=ultimaTexto;const resumoVer=$('#empresaSobreVerificadaEM');if(resumoVer){resumoVer.hidden=!ok;resumoVer.style.display=ok?'flex':'none'};
 if($('#empresaPublicaSobre'))$('#empresaPublicaSobre').textContent=p.sobre||'A empresa ainda não adicionou uma apresentação.';
 const inst=$('#empresaPublicaInstitucional');if(inst){const itens=[['Missão',p.missao,'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m15 9 5-5m0 0v4m0-4h-4"/></svg>'],['Visão',p.visao,'<svg viewBox="0 0 24 24"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>'],['Valores',p.valores,'<svg viewBox="0 0 24 24"><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3Z"/></svg>'],['Cultura',p.cultura,'<svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c.5-4.3 2.4-6.5 5.5-6.5s5 2.2 5.5 6.5M14 14.5c4.1-.8 6.4 1 7 5.5"/></svg>'],['Ambiente e jeito de trabalhar',p.ambiente,'<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18"/></svg>'],['Benefícios',p.beneficios,'<svg viewBox="0 0 24 24"><path d="M12 21s-8-4.7-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.3-8 11-8 11Z"/></svg>'],['Carreira e desenvolvimento',p.carreira,'<svg viewBox="0 0 24 24"><path d="M4 19V9m6 10V5m6 14v-7m4 7V3"/><path d="m3 7 6-4 6 5 6-6"/></svg>'],['Modalidades de trabalho',p.modalidades,'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8m-4-3v3"/></svg>'],['Áreas que mais contratam',p.areas,'<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M9 6V4h6v2m-11 6h16"/></svg>']];inst.innerHTML=itens.filter(x=>x[1]).map(x=>'<section><div class="empresa-inst-icone">'+x[2]+'</div><div><h3>'+x[0]+'</h3><p>'+esc(x[1])+'</p></div></section>').join('')}
 const links=$('#empresaPublicaLinks');if(links){const arr=[['Site',p.site],['LinkedIn',p.linkedin],['Instagram',p.instagram],['Facebook',p.facebook],['Vídeo institucional',p.video],['E-mail',p.emailPublico?'mailto:'+p.emailPublico:'']].filter(x=>x[1]);links.innerHTML=arr.map(x=>'<a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(x[1])+'">'+x[0]+'</a>').join('')}
 const vs=vagasPublicas().filter(v=>(v.empresaCnpj===c||v.cnpj===c)&&!v.confidencial),cands=candidaturas().filter(x=>vs.some(v=>v.id===x.vagaId)),entrevistas=cands.filter(x=>String(x.status||'').toLowerCase().includes('entrevista')),contratados=cands.filter(x=>String(x.status||'').toLowerCase().includes('contrat')),avs=avaliacoesEmpresaConsolidadasEM(c),sals=ler('empregaMaisSalariosEmpresa').filter(x=>nums(x.empresaCnpj||'')===nums(c));
 if($('#empresaPublicaQtd'))$('#empresaPublicaQtd').textContent=vs.length;if($('#empresaPublicaQtdTexto'))$('#empresaPublicaQtdTexto').textContent=vs.length+' oportunidade(s) disponível(is)';empresaPublicaVagasPaginaEM=1;renderEmpresaPublicaVagasEM(vs,1);
 if($('#empresaPublicaAvaliacoesQtd'))$('#empresaPublicaAvaliacoesQtd').textContent=avs.length;if($('#empresaPublicaContratadosQtd'))$('#empresaPublicaContratadosQtd').textContent=contratados.length;
 const ab=$('#empresaPublicaAvaliacoes');if(ab){
  const mediaCampo=(campo,fallback='nota')=>avs.length?avs.reduce((s,x)=>s+Number(x[campo]||x[fallback]||0),0)/avs.length:0;
  const media=mediaCampo('nota'),criterios=[['Oportunidade de crescimento','crescimento'],['Equilíbrio vida e trabalho','equilibrio'],['Ambiente de trabalho','ambiente'],['Benefícios','beneficios']],recom=avs.length?Math.round(avs.filter(x=>x.recomenda==='sim').length/avs.length*100):0,aprova=avs.length?Math.round(avs.filter(x=>x.aprovaLideranca==='sim'||x.aprovaDiretoria==='sim').length/avs.length*100):0;
  ab.innerHTML=avs.length?'<div class="empresa-avaliacoes-pro"><div class="empresa-avaliacoes-pro-top"><small>'+avs.length+' AVALIAÇÃO(ÕES)</small><div class="empresa-avaliacoes-resumo"><div class="empresa-avaliacoes-geral"><strong>'+media.toFixed(1).replace('.',',')+'</strong><div class="estrelas">'+[1,2,3,4,5].map(n=>n<=Math.round(media)?'★':'☆').join('')+'</div><span>Nota geral da experiência</span></div><div class="empresa-avaliacoes-criterios">'+criterios.map(x=>{const m=mediaCampo(x[1]);return '<div><b>'+x[0]+'</b><strong>'+m.toFixed(1).replace('.',',')+'</strong><i style="--pct:'+Math.round(m/5*100)+'%"></i></div>'}).join('')+'</div></div></div><div class="empresa-avaliacoes-indicadores"><div><strong><em>●</em>'+recom+'%</strong><span>Recomendariam esta empresa</span></div><div><strong><em>●</em>'+aprova+'%</strong><span>Aprovam a experiência com a liderança</span></div></div><div class="empresa-avaliacoes-lista-pro">'+avs.map(x=>'<article><header><div><b>Candidato verificado</b><span class="avaliacao-verificada">✓ Participou do processo seletivo</span></div><strong>'+Number(x.nota||0).toFixed(1).replace('.',',')+' ★</strong></header>'+(x.comentario?'<p>'+esc(x.comentario)+'</p>':'')+'<footer><span>Crescimento '+(x.crescimento||'-')+'/5</span><span>Equilíbrio '+(x.equilibrio||'-')+'/5</span><span>Ambiente '+(x.ambiente||'-')+'/5</span><span>Benefícios '+(x.beneficios||'-')+'/5</span></footer></article>').join('')+'</div></div>':empresaPublicaVazioEM('Ainda não há avaliações','Somente candidatos que participaram de processos seletivos desta empresa podem publicar uma avaliação.','★')
 }
 const sb=$('#empresaPublicaSalarios');if(sb)sb.innerHTML=sals.length?'<div class="empresa-publica-lista">'+sals.map(x=>'<article><strong>'+esc(x.cargo||'Cargo')+'</strong><p>'+esc(x.salario||x.valor||'Salário informado')+'</p></article>').join('')+'</div>':empresaPublicaVazioEM('Salários','Informações salariais compartilhadas no portal aparecerão aqui.','R$');
 const eb=$('#empresaPublicaEntrevistas');if(eb)eb.innerHTML=entrevistas.length?'<div class="empresa-publica-kpi-big"><strong>'+entrevistas.length+'</strong><span>processo(s) com etapa de entrevista registrado(s) nesta empresa</span></div>':empresaPublicaVazioEM('Entrevistas','Ainda não há entrevistas registradas publicamente para esta empresa.','▤');
 const cb=$('#empresaPublicaContratados');if(cb)cb.innerHTML=contratados.length?'<div class="empresa-publica-kpi-big sucesso"><strong>'+contratados.length+'</strong><span>contratação(ões) realizada(s) pelo + Empregos</span></div>':empresaPublicaVazioEM('Contratados pelo site','Quando uma contratação for concluída pelo + Empregos, o total aparecerá aqui.','✓');
 atualizarSeguirEmpresaEM();
}
function abrirPublicacao(){if(papelAtual()!=='empresa'){irPara('login-empresa');return}sessionStorage.removeItem('vagaEdicao');const f=$('#formVaga');if(f)f.reset();irPara('publicar')}function sair(){const tema=sessionStorage.getItem('temaEmpregaMais');sessionStorage.clear();localStorage.removeItem('empregaMaisPapelPersistido');if(tema)sessionStorage.setItem('temaEmpregaMais',tema);irPara('home')}addEventListener('popstate',lerRota);addEventListener('DOMContentLoaded',async()=>{/* A rota inicial já é preparada pelo inicializador de navegação. Restaurar a sessão não deve reabrir a HOME nem alterar a posição da página. */try{if(localStorage.getItem('empregaMaisLogoutBloqueio')!=='1'&&sessionStorage.getItem('empregaMaisLogoutBloqueio')!=='1'){const cand=await sbRestaurarSessaoCandidatoEM();if(!cand)await sbRestaurarSessaoEmpresaEM()}}catch(e){console.warn('Restauração da sessão:',e)}$('#formCadastroEmpresa')?.addEventListener('submit',cadastrarEmpresa);$('#formLoginEmpresa')?.addEventListener('submit',loginEmpresa);$('#formCadastroCandidato')?.addEventListener('submit',cadastrarCandidato);$('#formLoginCandidato')?.addEventListener('submit',async e=>{e.preventDefault();e.stopImmediatePropagation();await loginCandidato(e)});$('#formVaga')?.addEventListener('submit',publicarVagaNova);$('#formCandidatura')?.addEventListener('submit',enviarCandidatura);$('#formCurriculo')?.addEventListener('submit',salvarCurriculoLocal);$('#formCurriculoOnline')?.addEventListener('submit',salvarCurriculoOnlineEM);$('#formLoginAdmin')?.addEventListener('submit',loginAdmin);$('#formPerfilEmpresa')?.addEventListener('submit',salvarPerfilEmpresa);$('#formPerfilCandidato')?.addEventListener('submit',salvarPerfilCandidato)});function mostrarEtapa(n){$('#formVaga .job-card').forEach(x=>x.classList.toggle('ativo',+x.dataset.panel===n));$('#jobProgress .job-step').forEach(x=>{const k=+x.dataset.step;x.classList.toggle('ativo',k===n);x.classList.toggle('feito',k<n)});if(n===4)montarRevisao();scrollTo(0,0)}function proximaEtapa(n){const p=document.querySelector('#formVaga .job-card[data-panel="'+n+'"]');if(!p)return;for(const e of p.querySelectorAll('[required]'))if(!e.checkValidity()){e.reportValidity();return}mostrarEtapa(n+1)}function moedaVagaInput(e){let n=e.target.value.replace(/\D/g,'');if(!n){e.target.value='';return}e.target.value=(Number(n)/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}function configurarSalarioVaga(){['salarioVaga'].forEach(id=>{const e=$('#'+id);if(e&&!e.dataset.moeda){e.addEventListener('input',moedaVagaInput);e.dataset.moeda='1'}});const c=$('#salarioCombinarVaga');if(c&&!c.dataset.bind){c.addEventListener('change',()=>{['salarioVaga'].forEach(id=>{const e=$('#'+id);if(e){e.disabled=c.checked;if(c.checked)e.value=''}})});c.dataset.bind='1'}}function beneficiosSelecionados(){const a=[];document.querySelectorAll('.beneficio-check:checked').forEach(c=>{const id=c.dataset.valor,val=id?($('#'+id)?.value.trim()||''):'';a.push(c.value+(val?' - '+val:''))});const outros=$('#beneficiosVaga')?.value.trim();if(outros)a.push(outros);return a}function aplicarBeneficiosVaga(v){document.querySelectorAll('.beneficio-check').forEach(c=>{c.checked=false;const id=c.dataset.valor;if(id&&$('#'+id))$('#'+id).value=''});const itens=Array.isArray(v.beneficiosLista)?v.beneficiosLista:[];itens.forEach(txt=>{document.querySelectorAll('.beneficio-check').forEach(c=>{if(txt===c.value||txt.startsWith(c.value+' - ')){c.checked=true;const id=c.dataset.valor;if(id&&$('#'+id))$('#'+id).value=txt.slice(c.value.length+3)}})});if($('#beneficiosVaga'))$('#beneficiosVaga').value=v.beneficiosOutros||(!itens.length?v.beneficios||'':'')}function montarRevisao(){const v=id=>$('#'+id)?.value.trim()||'',nome=v('empresaVaga'),cargo=v('cargoVaga'),cidade=v('cidadeVaga'),uf=v('estadoVaga'),sal=v('salarioVaga'),comb=$('#salarioCombinarVaga')?.checked,faixa=comb?'A combinar':sal,benef=beneficiosSelecionados(),flags=[$('#senior50Vaga')?.checked?'Profissionais 50+':'',$('#vagaConfidencial')?.checked?'Vaga confidencial':'',$('#vagaDestaque')?.checked?'Destaque':'',$('#vagaUrgente')?.checked?'Urgente':''].filter(Boolean);$('#reviewVaga').innerHTML='<div class="review-grid"><div><span>Título</span><strong>'+esc(String(cargo).toLocaleUpperCase('pt-BR'))+'</strong></div><div><span>Empresa</span><strong>'+esc(nome)+'</strong></div><div><span>Área</span><strong>'+esc(v('areaVaga'))+'</strong></div><div><span>Contrato</span><strong>'+esc(v('contratoVaga'))+'</strong></div><div><span>Modalidade</span><strong>'+esc(v('modalidadeVaga'))+'</strong></div><div><span>Localização</span><strong>'+esc(cidade+(uf?' - '+uf:''))+'</strong></div><div><span>Salário</span><strong>'+esc(faixa||'Não informado')+'</strong></div><div><span>Jornada</span><strong>'+esc(v('jornadaVaga')||'Não informada')+'</strong></div><div><span>Horário</span><strong>'+esc('Não informado')+'</strong></div><div><span>Escolaridade</span><strong>'+esc(v('escolaridadeVaga'))+'</strong></div><div><span>Experiência</span><strong>'+esc(v('experienciaVaga'))+'</strong></div><div><span>PcD</span><strong>'+esc(v('pcdVaga'))+'</strong></div></div>'+(flags.length?'<div class="review-flags">'+flags.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div>':'')+'<div class="review-texto"><h4>Descrição</h4><p>'+esc(v('descricaoVaga')).replace(/\n/g,'<br>')+'</p><h4>Requisitos</h4><p>'+esc(v('requisitosVaga')).replace(/\n/g,'<br>')+'</p><h4>Benefícios</h4><div class="beneficios-tags">'+(benef.length?benef.map(x=>'<span class="beneficio-tag">'+esc(x)+'</span>').join(''):'<span>Não informados</span>')+'</div></div>';$('#previewVaga').innerHTML='<div class="preview-vaga-cab"><span>PRÉVIA PARA O CANDIDATO</span><h3>'+esc(String(cargo).toLocaleUpperCase('pt-BR'))+'</h3><button type="button" class="empresa-link">'+esc($('#vagaConfidencial')?.checked?'Empresa confidencial':nome)+'</button></div><div class="detalhe-tags"><span>'+esc(v('contratoVaga'))+'</span><span>'+esc(v('modalidadeVaga'))+'</span>'+(flags.includes('Urgente')?'<span>Urgente</span>':'')+(flags.includes('Destaque')?'<span>Destaque</span>':'')+'</div><strong class="preview-salario">'+esc(faixa||'Salário a combinar')+'</strong><p>'+esc(v('descricaoVaga')).replace(/\n/g,'<br>')+'</p>'}function prepararPublicacao(){if(papelAtual()!=='empresa'){irPara('login-empresa');return}const editId=sessionStorage.getItem('vagaEdicao'),vagaEdit=editId?vagasDaEmpresa().find(v=>v.id===editId):null,existe=!!vagaEdit;if(editId&&!existe)sessionStorage.removeItem('vagaEdicao');
 const emp=typeof empresaLogada==='function'?(empresaLogada()||{}):{},p=emp.perfil||{},setSeVazio=(id,val)=>{const el=$('#'+id);if(el&&!el.value&&val)el.value=val};
 const e=$('#empresaVaga');if(e)e.value=vagaEdit?.empresa||p.nome||emp.nome||sessionStorage.getItem('empresaNome')||'';
 if(!vagaEdit){
   setSeVazio('sobreEmpresaVaga',p.sobre||p.resumo||emp.sobre);
   setSeVazio('cepVaga',emp.cep||p.cep);setSeVazio('logradouroVaga',emp.logradouro||p.logradouro);
   setSeVazio('bairroVaga',emp.bairro||p.bairro);setSeVazio('numeroVaga',emp.numero||p.numero);
   setSeVazio('complementoVaga',emp.complemento||p.complemento);setSeVazio('cidadeVaga',emp.cidade||p.cidade);
   setSeVazio('estadoVaga',emp.estado||emp.uf||p.estado||p.uf);
   const logo=p.logo||emp.logo||emp.logoUrl||emp.logo_url||'';
   if(logo&&!window.__empregaMaisLogoVagaUrl){window.__empregaMaisLogoVagaUrl=logo;const prev=$('#logoVagaPreview');if(prev)prev.innerHTML='<img src="'+esc(logo)+'" alt="Logo da empresa" style="max-width:100%;max-height:110px;object-fit:contain"><small>Logo do cadastro da empresa</small>'}
 }
 atualizarOpcoesPlano();configurarSalarioVaga();carregarPerguntasEliminatoriasEM(vagaEdit?.perguntasEliminatorias||[]);prepararLocalizacaoPublicacaoEM(vagaEdit);mostrarEtapa(1)}
function prepararLocalizacaoPublicacaoEM(vagaEdit){
 const cep=document.getElementById('cepVaga'),cidade=document.getElementById('cidadeVaga'),uf=document.getElementById('estadoVaga'),logradouro=document.getElementById('logradouroVaga'),bairro=document.getElementById('bairroVaga'),numero=document.getElementById('numeroVaga'),complemento=document.getElementById('complementoVaga'),preview=document.getElementById('previewLocalVaga');
 const emp=typeof empresaLogada==='function'?(empresaLogada()||{}):{},p=emp.perfil||{};
 const set=(el,val)=>{if(el&&val!=null)el.value=val||''};
 if(vagaEdit){set(cep,vagaEdit.cep);set(cidade,vagaEdit.cidade);set(uf,vagaEdit.estado||vagaEdit.uf);set(logradouro,vagaEdit.logradouro);set(bairro,vagaEdit.bairro);set(numero,vagaEdit.numero);set(complemento,vagaEdit.complemento)}
 else{if(!cidade?.value)set(cidade,emp.cidade||p.cidade);if(!uf?.value)set(uf,emp.estado||emp.uf||p.estado||p.uf);if(!cep?.value)set(cep,emp.cep||p.cep);if(!logradouro?.value)set(logradouro,emp.logradouro||p.logradouro);if(!bairro?.value)set(bairro,emp.bairro||p.bairro)}
 const atualizar=()=>{if(!preview)return;const partes=[bairro?.value,cidade?.value,uf?.value].filter(Boolean);preview.textContent=partes.length?partes.join(' - '):'Informe a cidade e o estado da vaga'};
 const buscar=async()=>{const n=String(cep?.value||'').replace(/\D/g,'');if(n.length!==8){atualizar();return}try{const r=await fetch('https://viacep.com.br/ws/'+n+'/json/');const d=await r.json();if(d.erro)return;set(logradouro,d.logradouro);set(bairro,d.bairro);set(cidade,d.localidade);set(uf,d.uf);atualizar()}catch(err){console.warn('CEP da vaga:',err)}};
 if(cep&&!cep.dataset.cepVagaBind){cep.dataset.cepVagaBind='1';cep.addEventListener('blur',buscar);cep.addEventListener('change',buscar)}
 [cidade,uf,bairro,logradouro,numero].forEach(el=>{if(el&&!el.dataset.localVagaBind){el.dataset.localVagaBind='1';el.addEventListener('input',atualizar)}});atualizar()
}function adicionarPerguntaEliminatoriaEM(d={}){
 const box=document.getElementById('perguntasEliminatoriasLista');if(!box)return;
 const row=document.createElement('div');row.className='em-pergunta-eliminatoria';
 row.innerHTML='<input class="em-pergunta-texto" maxlength="180" placeholder="Ex.: Possui CNH B?" value="'+esc(d.pergunta||'')+'"><select class="em-pergunta-esperada"><option value="sim" '+(d.esperada!=='nao'?'selected':'')+'>Resposta esperada: Sim</option><option value="nao" '+(d.esperada==='nao'?'selected':'')+'>Resposta esperada: Não</option></select><button type="button" onclick="this.parentElement.remove()" aria-label="Remover pergunta">×</button>';
 box.appendChild(row)
}
function alternarPerguntasEliminatoriasEM(ativo){
 const conteudo=document.getElementById('perguntasEliminatoriasConteudo'),toggle=document.getElementById('usarPerguntasEliminatoriasEM');
 if(toggle)toggle.checked=!!ativo;if(conteudo)conteudo.hidden=!ativo;
 if(ativo&&!document.querySelector('#perguntasEliminatoriasLista .em-pergunta-eliminatoria'))adicionarPerguntaEliminatoriaEM()
}
function perguntasEliminatoriasPublicacaoEM(){
 if(!document.getElementById('usarPerguntasEliminatoriasEM')?.checked)return[];
 return [...document.querySelectorAll('#perguntasEliminatoriasLista .em-pergunta-eliminatoria')].map((r,i)=>({id:'p'+(i+1),pergunta:r.querySelector('.em-pergunta-texto')?.value.trim()||'',esperada:r.querySelector('.em-pergunta-esperada')?.value||'sim'})).filter(x=>x.pergunta)
}
function carregarPerguntasEliminatoriasEM(lista=[]){
 const box=document.getElementById('perguntasEliminatoriasLista');if(!box)return;box.innerHTML='';
 const itens=Array.isArray(lista)?lista:[];itens.forEach(adicionarPerguntaEliminatoriaEM);alternarPerguntasEliminatoriasEM(!!itens.length)
}
function publicarVagaNova(e){e.preventDefault();if(papelAtual()!=='empresa'||!sessionStorage.getItem('empresaCnpj')){msg('#msgPublicarVaga','Sua sessão de empresa expirou. Entre novamente para publicar.');setTimeout(()=>irPara('login-empresa'),700);return}const v=id=>$('#'+id)?.value.trim()||'',lista=ler('empregaMaisVagas'),editId=sessionStorage.getItem('vagaEdicao');const dados={empresa:v('empresaVaga'),empresaCnpj:sessionStorage.getItem('empresaCnpj')||'',cargo:v('cargoVaga'),area:v('areaVaga'),contrato:v('contratoVaga'),modalidade:v('modalidadeVaga'),quantidadeContratacoes:v('quantidadeVagas')||'1',cep:v('cepVaga'),logradouro:v('logradouroVaga'),bairro:v('bairroVaga'),numero:v('numeroVaga'),complemento:v('complementoVaga'),estado:v('estadoVaga'),cidade:v('cidadeVaga'),dataEncerramento:'',escolaridade:v('escolaridadeVaga'),experiencia:v('experienciaVaga'),jornada:v('jornadaVaga'),pcd:v('pcdVaga'),salario:$('#salarioCombinarVaga')?.checked?'A combinar':v('salarioVaga'),salarioMax:'',salarioCombinar:!!$('#salarioCombinarVaga')?.checked,horarioEntrada:'',horarioSaida:'',descricao:v('descricaoVaga'),requisitos:v('requisitosVaga'),beneficios:beneficiosSelecionados().join(' · '),beneficiosLista:beneficiosSelecionados().filter(x=>x!==v('beneficiosVaga')),beneficiosOutros:v('beneficiosVaga'),sobreEmpresa:v('sobreEmpresaVaga'),perguntasEliminatorias:perguntasEliminatoriasPublicacaoEM(),senior50:$('#senior50Vaga').checked,confidencial:$('#vagaConfidencial').checked,destaque:$('#vagaDestaque').checked,urgente:$('#vagaUrgente').checked};const gratuito=planoEmpresaAtual().nome==='Grátis';if(gratuito&&dados.destaque&&!editId){dados.destaqueSolicitado=true;dados.destaque=false}if(gratuito&&dados.urgente&&!editId){dados.urgenciaSolicitada=true;dados.urgente=false}const erroPlano=validarRecursosPlano(dados,editId);if(erroPlano){msg('#msgPublicarVaga',erroPlano);mostrarEtapa(4);return}if(editId){const i=lista.findIndex(x=>x.id===editId&&x.empresaCnpj===dados.empresaCnpj);if(i<0){sessionStorage.removeItem('vagaEdicao');msg('#msgPublicarVaga','Não foi possível localizar esta vaga para edição. Nenhuma alteração foi salva.');return}if(i>=0){const anterior=lista[i],precisaReanalise=anterior.status==='aprovada',novoStatus=precisaReanalise?'pendente':anterior.status;lista[i]={...anterior,...dados,status:novoStatus,editadoEm:new Date().toISOString(),edicoesAposAprovacao:(precisaReanalise?(anterior.edicoesAposAprovacao||0)+1:(anterior.edicoesAposAprovacao||0)),motivoReprovacao:''};sessionStorage.removeItem('vagaEdicao');gravar('empregaMaisVagas',lista);$('#formVaga').reset();msg('#msgPublicarVaga',precisaReanalise?'Alterações salvas. A vaga voltou para análise.':'Alterações salvas com sucesso.',true);setTimeout(()=>irPara('painel-empresa'),900);return}}const novaId='vaga_'+Date.now();lista.unshift({id:novaId,...dados,status:'pendente',criadoEm:new Date().toISOString(),edicoesAposAprovacao:0});if(gratuito){const extras=ler('empregaMaisExtras');if(dados.destaqueSolicitado)extras.unshift({id:'extra_'+Date.now()+'_d',vagaId:novaId,empresaCnpj:dados.empresaCnpj,tipo:'destaque',valor:19.90,dias:7,status:'aguardando_pagamento',criadoEm:new Date().toISOString()});if(dados.urgenciaSolicitada)extras.unshift({id:'extra_'+Date.now()+'_u',vagaId:novaId,empresaCnpj:dados.empresaCnpj,tipo:'urgencia',valor:9.90,status:'aguardando_pagamento',criadoEm:new Date().toISOString()});gravar('empregaMaisExtras',extras)}gravar('empregaMaisVagas',lista);$('#formVaga').reset();msg('#msgPublicarVaga','Vaga enviada para análise.',true);setTimeout(()=>irPara('painel-empresa'),900)}function vagasDaEmpresa(){const c=nums(sessionStorage.getItem('empresaCnpj')||''),nome=(sessionStorage.getItem('empresaNome')||'').trim().toLowerCase(),todas=ler('empregaMaisVagas');return todas.filter(v=>{const vc=nums(v.empresaCnpj||v.cnpj||'');const vn=String(v.empresa||v.empresaNome||'').trim().toLowerCase();return (c&&vc===c)||(!vc&&nome&&vn===nome)})}function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}function inserirAcessoConectaPainelEmpresaEM(){
 // O Conecta possui acesso próprio pela área de login e não faz parte do painel do recrutador.
 document.getElementById('empConectaLauncherEM')?.remove();
 document.getElementById('empConectaMenuEM')?.remove();
}
function atualizarContaSidebarEmpresaEM(){
 const e=empresaLogada(),nome=e?.nome||sessionStorage.getItem('empresaNome')||'Empresa';
 const plano=(typeof planoEmpresaAtual==='function'?planoEmpresaAtual()?.nome:'')||'Ativo';
 const n=document.getElementById('empSideAccountName'),a=document.getElementById('empSideAccountAvatar'),p=document.getElementById('empSideAccountPlan');
 if(n)n.textContent=nome;if(a)a.textContent=(nome.trim()[0]||'E').toUpperCase();if(p)p.textContent='· Plano '+plano;
}
/* painel antigo do recrutador removido: mantido apenas o painel simples atual */

function mudarPaginaVagasAbertasEM(delta){const box=document.getElementById('empresaVagasAbertasPainel');if(!box)return;box.dataset.pagina=Math.max(1,Number(box.dataset.pagina||1)+Number(delta||0));renderizarPainelEmpresa();setTimeout(()=>{document.querySelector('.emp-open-vagas')?.scrollIntoView({behavior:'smooth',block:'start'})},50)}
function abrirResumoEmpresa(tipo){if(tipo==='plano')return irPara('planos');if(tipo==='vagas')return focarVagasEmpresa();if(tipo==='destaques'){const f=$('#filtroVagasEmpresa');if(f)f.value='aprovada';return focarVagasEmpresa()}if(tipo==='urgencias')return focarVagasEmpresa()}

function abrirRecursoEmpresa(tipo){const p=planoEmpresaAtual();if(tipo==='talentos'&&p.nome!=='Semestral'&&p.nome!=='Anual'){alert('O Banco de talentos está disponível nos planos Semestral e Anual.');return irPara('planos')}if(tipo==='relatorios'&&p.nome!=='Anual'){alert('Os relatórios avançados estão disponíveis no plano Anual.');return irPara('planos')}if(tipo==='talentos')return irPara('candidatos-empresa');if(tipo==='relatorios')return alert('A área de relatórios da empresa será exibida com os dados do seu recrutamento.')}


function candidaturas(){return ler('empregaMaisCandidaturas')}
function abrirGestaoVaga(id){
 const vagaId=String(id||'');if(!vagaId)return;
 sessionStorage.setItem('vagaCandidatosSelecionada',vagaId);
 sessionStorage.removeItem('filtroNaoVisualizadosEM');
 sessionStorage.setItem('filtroCandidatos','Todos');

 const detailUrl=location.pathname+'?pagina=candidatos-empresa&vaga='+encodeURIComponent(vagaId);
 if(location.pathname+location.search!==detailUrl){
  history.pushState({pagina:'candidatos-empresa',vaga:vagaId},'',detailUrl);
 }

 try{abrirRota('candidatos-empresa')}catch(err){console.error('[+ Empregos] rota candidaturas:',err)}

 const abrirDetalhe=function(){
  const c=document.getElementById('psCentralView');
  const d=document.getElementById('psCandidateView');
  if(c){c.hidden=true;c.style.display='none';}
  if(d){d.hidden=false;d.removeAttribute('hidden');d.style.display='block';}
  if(typeof renderizarCandidatosEmpresa==='function')renderizarCandidatosEmpresa();
 };
 abrirDetalhe();
 setTimeout(abrirDetalhe,80);
}
function abrirMetricaVagaEM(event,id,tipo){
 if(event){event.preventDefault();event.stopPropagation();}
 const vagaId=String(id||'');if(!vagaId)return;
 sessionStorage.setItem('vagaCandidatosSelecionada',vagaId);
 sessionStorage.removeItem('filtroNaoVisualizadosEM');
 const filtros={
  'todos':'Todos',
  'em-analise':'Em avaliação',
  'selecionados':'Selecionados',
  'entrevistas':'Entrevista',
  'contratados':'Contratados'
 };
 sessionStorage.setItem('filtroCandidatos',filtros[tipo]||'Todos');
 if(tipo==='nao-visualizados')sessionStorage.setItem('filtroNaoVisualizadosEM','1');
 irPara('candidatos-empresa');
 setTimeout(()=>{if(typeof renderizarCandidatosEmpresa==='function')renderizarCandidatosEmpresa()},60);
}
function voltarGestaoVagaEM(){
 sessionStorage.removeItem('vagaCandidatosSelecionada');
 sessionStorage.removeItem('filtroNaoVisualizadosEM');
 sessionStorage.setItem('filtroCandidatos','Todos');
 const params=new URLSearchParams(location.search);
 if(params.get('pagina')==='candidatos-empresa'&&params.get('vaga')){
  history.back();
  return;
 }
 const url=location.pathname+'?pagina=candidatos-empresa';
 history.replaceState({pagina:'candidatos-empresa'},'',url);
 abrirRota('candidatos-empresa');
 setTimeout(function(){if(typeof renderCentralProcessosEmpresaEM==='function')renderCentralProcessosEmpresaEM()},30);
}
function grupoEtapa(s){s=(s||'Em avaliação').toLowerCase();if(s.includes('contrat'))return'Contratados';if(s.includes('reprov'))return'Reprovados';if(s.includes('aprov'))return'Aprovados';if(s.includes('selecion'))return'Selecionados';if(s.includes('entrevista'))return'Entrevista';if(s.includes('contato'))return'Em contato';return'Em avaliação'}
function classeEtapaEM(s){const g=grupoEtapa(s);return {'Em avaliação':'etapa-analise','Selecionados':'etapa-selecionado','Em contato':'etapa-contato','Entrevista':'etapa-entrevista','Aprovados':'etapa-aprovado','Contratados':'etapa-contratado','Reprovados':'etapa-reprovado'}[g]||'etapa-analise'}
function emNormAderencia(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9+#. ]+/g,' ')}
function emTokensAderencia(s){const stop=new Set(['para','com','das','dos','uma','uns','que','por','nos','nas','ser','ter','sua','seu','vaga','empresa','trabalho','atividades','requisitos','desejavel','necessario','necessaria','experiencia']);return [...new Set(emNormAderencia(s).split(/\s+/).filter(x=>x.length>2&&!stop.has(x)))]}
function emExpandirTermosAderencia(s){let x=' '+emNormAderencia(s)+' ';const grupos=[['marketplace','mercado livre','shopee','magalu','ecommerce','e commerce'],['excel','planilha','planilhas','spreadsheet'],['atendimento','sac','suporte','cliente','clientes'],['vendas','comercial','televendas','negociacao'],['logistica','frete','fretes','expedicao'],['cadastro','catalogo','produto','produtos'],['rh','recursos humanos','recrutamento','selecao'],['financeiro','financas','contas','faturamento'],['desenvolvedor','programador','developer','software'],['administrativo','administracao','assistente administrativo']];grupos.forEach(g=>{if(g.some(t=>x.includes(' '+t+' ')))x+=' '+g.join(' ')+' '});return x}
function emFonteCurriculoAderencia(c){const cv=c?.curriculo||{},p=c?.perfilProfissional||{};if(c?.curriculoOrigem==='online')return cv;if(c?.curriculoOrigem==='perfil')return p;return cv&&typeof cv==='object'?cv:p}
function emTextoCurriculoAderencia(c){const d=emFonteCurriculoAderencia(c),arr=[d.titulo,d.area,d.objetivo,d.resumo,d.competencias,d.experiencia,d.escolaridade,d.idiomas,(d.experiencias||[]).map(x=>[x.cargo,x.empresa,x.atividades].join(' ')).join(' '),(d.formacoes||[]).map(x=>[x.curso,x.formacao,x.status,x.instituicao].join(' ')).join(' '),(d.cursos||[]).map(x=>[x.nome,x.curso,x.instituicao].join(' ')).join(' ')];return emExpandirTermosAderencia(arr.join(' '))}
function analisarAderenciaDetalhadaEM(c,v){const d=emFonteCurriculoAderencia(c),txt=emTextoCurriculoAderencia(c),items=[];let ganho=0,total=0;const add=(nome,peso,status,det)=>{total+=peso;if(status==='sim')ganho+=peso;else if(status==='parcial')ganho+=peso*.5;items.push({nome,peso,status,ok:status==='sim',det})};const match=(s,min=.35)=>{const ts=emTokensAderencia(emExpandirTermosAderencia(s));if(!ts.length)return null;const hits=ts.filter(x=>txt.includes(x));return{ratio:hits.length/ts.length,hits,ok:hits.length/ts.length>=min,parcial:hits.length>0}};
 const prof=match([v?.cargo,v?.area].join(' '),.35);if(prof)add('Experiência relacionada ao cargo / área',30,prof.ok?'sim':prof.parcial?'parcial':'nao',prof.hits.length?'Correspondências: '+prof.hits.slice(0,6).join(', ')+'.':'Não foram encontradas correspondências suficientes no currículo.');
 const req=match([v?.requisitos,v?.descricao].join(' '),.22);if(req)add('Competências e conhecimentos',25,req.ok?'sim':req.parcial?'parcial':'nao',req.hits.length?req.hits.length+' termo(s) relacionado(s) foram identificados.':'Não foram identificadas competências relacionadas suficientes.');
 const ev=emNormAderencia(v?.escolaridade),ec=emNormAderencia(d?.escolaridade||((d?.formacoes||[]).map(x=>[x.formacao,x.curso,x.status].join(' ')).join(' ')));if(ev){const livre=/nao exigida|nao exige/.test(ev),ok=livre||(!ec?false:(ev.includes('superior')&&/superior|graduacao|bacharel|tecnologo|licenciatura/.test(ec))||(ev.includes('medio')&&/medio|superior|graduacao|tecnico/.test(ec))||ec.includes(ev));add('Escolaridade / formação',15,ok?'sim':ec?'parcial':'nao',ok?'Formação compatível com a exigência informada.':ec?'Há formação informada, mas a equivalência é parcial.':'Escolaridade não identificada no currículo enviado.')}
 const expReq=emNormAderencia(v?.experiencia),expTxt=emNormAderencia([d?.experiencia,(d?.experiencias||[]).map(x=>[x.inicio,x.fim,x.atual,x.cargo].join(' ')).join(' ')].join(' '));if(expReq&&!/nao exigida|sem experiencia/.test(expReq)){const numsReq=Number((expReq.match(/\d+/)||[0])[0]),numsCv=(expTxt.match(/\d+/g)||[]).map(Number),ok=numsReq?numsCv.some(n=>n>=numsReq):Boolean(expTxt);add('Experiência mínima',10,ok?'sim':expTxt?'parcial':'nao',ok?'O currículo contém experiência compatível.':expTxt?'Experiência informada, mas não foi possível confirmar integralmente o tempo exigido.':'Tempo de experiência não identificado.')}
 const cidade=emNormAderencia(v?.cidade),cc=emNormAderencia(d?.cidade||c?.cidade),mod=emNormAderencia(v?.modalidade),cm=emNormAderencia(d?.modalidade||(Array.isArray(d?.modalidades)?d.modalidades.join(' '):''));const remoto=/remot/.test(mod),locOk=remoto||!cidade||!cc||cidade===cc,modOk=!mod||!cm||cm.includes(mod)||mod.includes(cm);add('Localização e modalidade',10,locOk&&modOk?'sim':locOk||modOk?'parcial':'nao',remoto?'A vaga é remota.':locOk&&modOk?'Localização/modalidade compatíveis.':'Há divergência ou informação insuficiente de localização/modalidade.');
 const desc=match([v?.descricao,v?.requisitos].join(' '),.14);if(desc)add('Atividades e contexto da vaga',10,desc.ok?'sim':desc.parcial?'parcial':'nao',desc.hits.length?'O histórico possui termos relacionados às atividades da vaga.':'Pouca correspondência textual com as atividades descritas.');
 const percentual=total?Math.round(ganho/total*100):0;return{percentual:Math.max(0,Math.min(100,percentual)),itens:items,fonte:c?.curriculoOrigem||'perfil'}}
function calcularAderenciaCandidatoEM(c,v){return analisarAderenciaDetalhadaEM(c,v).percentual}
function formatarTelefoneBR_EM(v){const n=String(v||'').replace(/\D/g,'').replace(/^55(?=\d{10,11}$)/,'').slice(0,11);if(n.length===11)return '('+n.slice(0,2)+') '+n.slice(2,7)+'-'+n.slice(7);if(n.length===10)return '('+n.slice(0,2)+') '+n.slice(2,6)+'-'+n.slice(6);return String(v||'')}
function renderizarCandidatosEmpresa(){
 const box=$('#listaCandidatosEmpresa');if(!box)return;
 const vagas=vagasDaEmpresa(),id=sessionStorage.getItem('vagaCandidatosSelecionada')||'',vaga=id?vagas.find(v=>String(v.id)===String(id)):null;
 const busca=($('#buscaCandidatoEmpresa')?.value||'').toLowerCase();
 const todosBase=candidaturas().filter(c=>vagas.some(v=>String(v.id)===String(c.vagaId))),filtroNaoVisualizados=sessionStorage.getItem('filtroNaoVisualizadosEM')==='1',todosVaga=(vaga?todosBase.filter(c=>String(c.vagaId)===String(vaga.id)):todosBase),todos=filtroNaoVisualizados?todosVaga.filter(c=>!(c.visualizado||c.visualizada||c.curriculoVisualizado||c.vistoPelaEmpresa||c.vistoEm||c.visualizadoEm)):todosVaga;
 const grupos=['Todos','Em avaliação','Selecionados','Em contato','Entrevista','Aprovados','Contratados','Reprovados'],filtro=sessionStorage.getItem('filtroCandidatos')||'Todos';
 const cont=g=>g==='Todos'?todos.length:todos.filter(c=>grupoEtapa(c.status)===g).length,ordem=$('#ordenarCandidatosEmpresa')?.value||'recentes';
 todos.sort((a,b)=>ordem==='nome'?String(a.candidato||a.nome||'').localeCompare(String(b.candidato||b.nome||''),'pt-BR'):ordem==='antigos'?new Date(a.criadoEm||0)-new Date(b.criadoEm||0):new Date(b.criadoEm||0)-new Date(a.criadoEm||0));
 let html='<div class="processo-head processo-head-pro"><div class="processo-head-copy">'+(vaga?'<button class="cand-voltar-vagas" type="button" onclick="voltarGestaoVagaEM()">← Minhas vagas</button>':'')+'<small class="processo-kicker">PROCESSO SELETIVO</small><h2>'+(vaga?esc(tituloVaga(vaga)):'Todas as candidaturas')+(filtroNaoVisualizados?' · Ainda não visualizados':'')+'</h2><span><b>'+todos.length+'</b> candidatura(s)'+(vaga?' recebida(s) para esta vaga':' recebida(s) em todas as vagas')+'</span></div><div class="processo-head-tools"><input class="campo processo-busca" type="search" placeholder="Buscar candidato" value="'+esc($('#buscaCandidatoEmpresa')?.value||'')+'" oninput="const b=document.getElementById(\'buscaCandidatoEmpresa\');if(b)b.value=this.value;renderizarCandidatosEmpresa()"><select class="campo processo-ordem" onchange="const o=document.getElementById(\'ordenarCandidatosEmpresa\');if(o)o.value=this.value;renderizarCandidatosEmpresa()"><option value="recentes" '+(ordem==='recentes'?'selected':'')+'>Mais recentes</option><option value="antigos" '+(ordem==='antigos'?'selected':'')+'>Mais antigos</option><option value="nome" '+(ordem==='nome'?'selected':'')+'>Nome A–Z</option></select>'+(vaga?'<button class="btn processo-todas" type="button" onclick="sessionStorage.removeItem(\'vagaCandidatosSelecionada\');renderizarCandidatosEmpresa()">Todas as candidaturas</button>':'')+'</div></div><div class="candidatos-empresa-filtro-vaga candidatos-empresa-filtro-vaga-pro"><label><span>Vaga</span><select class="campo" onchange="selecionarVagaCandidaturasEmpresaEM(this.value)"><option value="">Todas as vagas</option>'+vagas.map(v=>'<option value="'+esc(v.id)+'" '+(id===v.id?'selected':'')+'>'+esc(tituloVaga(v))+'</option>').join('')+'</select></label></div><div class="etapas-tabs etapas-tabs-pro">'+grupos.map(g=>'<button class="'+(g==='Todos'?'etapa-todos':classeEtapaEM(g))+' '+(filtro===g?'ativo':'')+'" onclick="filtrarCandidatos(\''+g+'\')">'+g+' ('+cont(g)+')</button>').join('')+'</div>';

 const lista=todos.filter(c=>(filtro==='Todos'||grupoEtapa(c.status)===filtro)&&((c.candidato||c.nome||'')+' '+(c.email||'')+' '+(vagas.find(v=>v.id===c.vagaId)?.cargo||'')).toLowerCase().includes(busca));
 html+=lista.length?lista.map(c=>{
  const nomeExibicao=String(c.curriculo?.nome||c.candidato||c.nome||'Candidato').trim(),partesNome=nomeExibicao.split(/\s+/).filter(Boolean),nomeCard=partesNome.slice(0,2).join(' ')||nomeExibicao;
  const vc=vagas.find(v=>v.id===c.vagaId)||{},adPct=calcularAderenciaCandidatoEM(c,vc),adNivel=adPct>=80?'Alta aderência':adPct>=60?'Boa aderência':adPct>=40?'Aderência moderada':'Baixa aderência';
  const fluxo=['Selecionado','Em contato','Entrevista agendada','Aprovado','Contratado'],pos=fluxo.indexOf(c.status);
  const opcoes=(c.status==='Em avaliação'?['Em avaliação','Selecionado','Em contato','Entrevista agendada','Aprovado','Contratado','Reprovado']:c.status==='Reprovado'?['Reprovado']:fluxo.filter((x,k)=>k>=Math.max(0,pos)).concat(c.status==='Contratado'?[]:['Reprovado']));
  const rot=x=>x==='Reprovado'?'Não selecionado':x==='Entrevista agendada'?'Entrevista':x;
  const linha=c.status==='Reprovado'?'<div class="cand-fluxo-encerrado">Processo encerrado · candidato não selecionado</div>':'<div class="recruta-etapas-v6 status-'+String(c.status||'Em avaliação').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'>'+['Candidatura enviada','Em análise'].concat(fluxo).map((x,k)=>{
   const etapaPos=k-2,feito=k===0||(k===1&&c.status!=='Em avaliação')||(k>=2&&etapaPos<pos),atual=(c.status==='Em avaliação'&&k===1)||(k>=2&&etapaPos===pos),liberada=k>=2&&!feito&&!atual&&k===Math.max(2,pos+3)&&c.status!=='Contratado';
   const classe=(feito?'feito ':atual?'atual ':liberada?'proxima ':'')+'etapa-'+k;
   const nomes=k===0?['Candidatura enviada']:k===1?['Em avaliação']:k===2?['Selecionado']:k===3?['Em contato']:k===4?['Entrevista agendada']:k===5?['Aprovado']:['Contratado'];
   const dt=sbDataEtapaCandidaturaEM(c,nomes)||(k===0||k===1?c.criadoEm:'');
   return '<button type="button" '+(liberada?'onclick="mudarEtapaCandidato(\''+c.id+'\',\''+x+'\')"':'disabled')+' class="'+classe+'"><i>'+(feito?'✓':atual?'●':(k+1))+'</i><span>'+rot(x)+'</span><small>'+((dt?new Date(dt).toLocaleDateString('pt-BR'):'—'))+'</small></button>';
  }).join('')+'</div><div class="cand-fluxo-aviso"><b>ⓘ Etapa atual: '+rot(c.status||'Em avaliação')+'.</b><span>Clique na próxima etapa disponível para avançar o candidato. O painel do candidato será atualizado automaticamente.</span></div>';

  const informacoesProcesso='<section class="recruta-processo-head"><div class="recruta-etapa-resumo"><small>ETAPA ATUAL</small><div><strong>'+rot(c.status||'Em avaliação')+'</strong><span>· desde '+(c.criadoEm?new Date(c.criadoEm).toLocaleDateString('pt-BR'):'—')+'</span></div></div><div class="recruta-processo-controles"><label class="recruta-alterar-etapa"><span>Alterar etapa</span><select class="cand-status-select status-'+String(c.status||'Em avaliação').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'" onchange="mudarEtapaCandidato(\''+c.id+'\',this.value)">'+opcoes.map(x=>'<option value="'+x+'" '+(c.status===x?'selected':'')+'>'+rot(x)+'</option>').join('')+'</select></label><button type="button" class="recruta-toggle-andamento" onclick="alternarAndamentoRecrutadorEM(this)" aria-expanded="true">Ver andamento ↑</button></div></section>';
  const infoCards='<div class="recruta-cand-info"><div class="recruta-info-curriculo"><span><i class="em-info-ico em-ico-doc" aria-hidden="true"></i>Currículo enviado</span><strong>'+(c.curriculoOrigem==='online'?'Currículo online':c.curriculo?.nome?'Arquivo anexado':'Perfil + Empregos')+'</strong><small>Documento recebido na candidatura</small></div><div class="recruta-aderencia-card recruta-info-aderencia"><span><i class="em-info-ico em-ico-target" aria-hidden="true"></i>Aderência à vaga</span><div class="recruta-aderencia-score"><strong>'+adPct+'%</strong><small>'+adNivel+'</small></div><div class="recruta-aderencia-barra" style="--aderencia:'+Math.max(0,Math.min(100,adPct))+'"><i style="width:'+Math.max(0,Math.min(100,adPct))+'%"></i></div></div><div class="recruta-info-atualizacao"><span><i class="em-info-ico em-ico-calendar" aria-hidden="true"></i>Última atualização</span><strong>'+new Date(c.atualizadoEm||c.criadoEm||Date.now()).toLocaleDateString('pt-BR')+'</strong><small>Dados mais recentes do candidato</small></div></div>';
  const actions='<footer class="recruta-cand-actions recruta-acoes-unificadas"><button class="btn btn-azul" onclick="abrirCurriculoFormatadoEM(\''+c.id+'\')"><i class="em-btn-ico em-ico-doc" aria-hidden="true"></i>Ver currículo</button><button type="button" class="btn recruta-atualizar-processo" onclick="alternarAndamentoRecrutadorEM(this)"><i class="em-btn-ico" aria-hidden="true">↻</i>Atualizar processo seletivo</button>'+(c.telefone?'<button class="btn recruta-whatsapp" onclick="contatarWhats(\''+c.id+'\')"><i class="em-btn-ico em-ico-whatsapp" aria-hidden="true"></i>WhatsApp</button>':'')+'</footer>';

  return '<article class="recruta-cand-card status-'+String(c.status||'Em avaliação').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'"><header class="recruta-cand-head"><div class="recruta-cand-ident"><div class="recruta-cand-ident-copy"><h3>'+esc(nomeCard)+'</h3><p>'+esc([c.curriculo?.cidade||c.perfilProfissional?.cidade||'',vc.modalidade||''].filter(Boolean).join(' · '))+'</p><div class="meta-inline"><span>Candidatura '+(c.criadoEm?new Date(c.criadoEm).toLocaleDateString('pt-BR'):'—')+'</span></div></div></div><div class="recruta-cand-status"><small>STATUS DA CANDIDATURA</small><strong>'+rot(c.status||'Em avaliação')+'</strong><span class="recruta-cand-vaga-status">'+esc(tituloVaga(vc)||vc.cargo||'Vaga')+'</span></div></header><div class="recruta-cand-preview-info">'+infoCards+'</div>'+actions+'<div class="recruta-andamento">'+informacoesProcesso+linha+infoCards+actions+'</div></article>';
 }).join(''):'<div class="vagas-vazio">Nenhum candidato encontrado com estes filtros.</div>';
 box.innerHTML=html;
}

function alternarAndamentoRecrutadorEM(btn){
 const card=btn?.closest('.recruta-cand-card'),box=card?.querySelector('.recruta-andamento');if(!box||!card)return;
 document.querySelector('.recruta-andamento-modal-em')?.remove();
 const nome=card.querySelector('.recruta-cand-head h3')?.textContent?.trim()||'Candidato';
 const local=card.querySelector('.recruta-cand-ident p')?.textContent?.trim()||'';
 const data=card.querySelector('.recruta-cand-ident .meta-inline span:last-child')?.textContent?.replace('Candidatura ','')?.trim()||'';
 const etapa=card.querySelector('.recruta-etapa-resumo strong')?.textContent?.trim()||'Em avaliação';
 const inicial=nome.charAt(0).toUpperCase();
 const processo=box.querySelector('.recruta-processo-head')?.outerHTML||box.innerHTML;
 const modal=document.createElement('div');modal.className='recruta-andamento-modal-em recruta-modal-exemplo1';
 modal.innerHTML='<div class="recruta-andamento-modal-backdrop" data-fechar></div><section class="recruta-andamento-modal-dialog" role="dialog" aria-modal="true" aria-label="Andamento do processo seletivo"><header class="recruta-modal-candidato-head"><div class="recruta-modal-avatar">'+esc(inicial)+'</div><div class="recruta-modal-ident"><h3>'+esc(nome)+'</h3><p>'+esc(local)+'</p>'+(data?'<span>▣ Candidatura em '+esc(data)+'</span>':'')+'</div><button type="button" aria-label="Fechar" data-fechar>×</button></header><nav class="recruta-modal-tabs"><button class="ativo" type="button">☷ <span>Andamento do processo</span></button><button type="button" disabled>▤ <span>Currículo</span></button><button type="button" disabled>▧ <span>Anotações</span></button></nav><div class="recruta-andamento-modal-body"><section class="recruta-modal-processo-clean"><h4>Etapas do processo seletivo</h4>'+processo+'<section class="recruta-modal-observacao"><h4>Observações do recrutador</h4><div><i>▧</i><p><strong>Etapa atual: '+esc(etapa)+'</strong><span>Use o andamento do processo para acompanhar e atualizar esta candidatura.</span></p></div></section></section></div><footer class="recruta-modal-footer">'+(card.querySelector('.recruta-whatsapp')?'<button type="button" class="btn recruta-modal-whatsapp">WhatsApp</button>':'')+(card.querySelector('a[href^="mailto:"]')?'<button type="button" class="btn recruta-modal-email">E-mail</button>':'')+'<button type="button" class="btn recruta-modal-agendar">Agendar entrevista</button><button type="button" class="btn btn-azul" data-fechar>Fechar</button></footer></section>';
 document.body.appendChild(modal);document.body.classList.add('recruta-modal-aberto');btn.setAttribute('aria-expanded','true');
 const origWhats=card.querySelector('.recruta-whatsapp'),origMail=card.querySelector('a[href^="mailto:"]'),origAgenda=[...card.querySelectorAll('.recruta-cand-actions .btn')].find(x=>/Agendar entrevista/i.test(x.textContent));
 modal.querySelector('.recruta-modal-whatsapp')?.addEventListener('click',()=>origWhats?.click());
 modal.querySelector('.recruta-modal-email')?.addEventListener('click',()=>origMail?.click());
 modal.querySelector('.recruta-modal-agendar')?.addEventListener('click',()=>origAgenda?.click());
 const fechar=()=>{modal.remove();document.body.classList.remove('recruta-modal-aberto');btn.setAttribute('aria-expanded','false')};
 modal.querySelectorAll('[data-fechar]').forEach(x=>x.addEventListener('click',fechar));
 const escFechar=e=>{if(e.key==='Escape'){fechar();document.removeEventListener('keydown',escFechar)}};document.addEventListener('keydown',escFechar);
}
function selecionarVagaCandidaturasEmpresaEM(id){if(id)sessionStorage.setItem('vagaCandidatosSelecionada',id);else sessionStorage.removeItem('vagaCandidatosSelecionada');renderizarCandidatosEmpresa()}
function registrarVisualizacaoCurriculoEM(c){
 if(!c)return;const empresa=empresaLogada?.()||{},email=String(c.email||c.curriculo?.email||'').trim().toLowerCase();if(!email)return;
 const key='empregaMaisVisualizacoesCurriculo',a=ler(key,[]),agora=new Date().toISOString(),cnpj=empresa.cnpj||sessionStorage.getItem('empresaCnpj')||'',nome=empresa.nome||empresa.nomeFantasia||sessionStorage.getItem('empresaNome')||'Empresa';
 const recente=a.find(x=>String(x.candidatoEmail||'').toLowerCase()===email&&nums(x.empresaCnpj||'')===nums(cnpj)&&Date.now()-new Date(x.visualizadoEm||0).getTime()<86400000);
 if(recente)recente.visualizadoEm=agora;else a.unshift({id:'CVV-'+Date.now(),candidatoEmail:email,empresaCnpj:cnpj,empresaNome:nome,vagaId:c.vagaId||'',visualizadoEm:agora});
 gravar(key,a.slice(0,500));
}
function renderizarVisualizacoesCurriculoCandidatoEM(){
 const box=document.getElementById('candCvViewsConteudo'),btn=document.getElementById('candCvViewsAcao');if(!box)return;
 const c=candidatoLogado(),ativo=candidatoPremiumAtivoEM(c);
 if(!ativo){box.innerHTML='<div class="cand-cv-views-lock"><b>★ Exclusivo Premium</b><span>Assine o Premium para descobrir quais empresas visualizaram seu currículo.</span></div>';if(btn){btn.textContent='Conhecer Premium →';btn.onclick=()=>irPara('premium-candidato')}return}
 const email=String(c?.email||sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),a=ler('empregaMaisVisualizacoesCurriculo',[]).filter(x=>String(x.candidatoEmail||'').toLowerCase()===email).sort((x,y)=>new Date(y.visualizadoEm||0)-new Date(x.visualizadoEm||0)).slice(0,8);
 if(btn){btn.textContent='Premium ativo ✓';btn.onclick=null}
 box.innerHTML=a.length?a.map(x=>'<article><div class="cand-cv-view-logo">'+esc((x.empresaNome||'E').charAt(0).toUpperCase())+'</div><div><strong>'+esc(x.empresaNome||'Empresa')+'</strong><span>Visualizou seu currículo · '+new Date(x.visualizadoEm).toLocaleDateString('pt-BR')+'</span></div></article>').join(''):'<div class="cand-cv-views-empty"><b>Nenhuma visualização registrada ainda</b><span>Quando uma empresa acessar seu currículo, ela aparecerá aqui.</span></div>';
}
function abrirFichaCandidato(id){
 const c=candidaturas().find(x=>x.id===id);if(!c)return;
 registrarVisualizacaoCurriculoEM(c);
 const p=c.perfilProfissional||{},curr=c.curriculo||null,online=c.curriculoOrigem==='online'?(curr||{}):{},box=$('#fichaCandidatoConteudo');if(!box)return;
 const vaga=(typeof vagasDaEmpresa==='function'?vagasDaEmpresa():[]).find(v=>String(v.id)===String(c.vagaId))||{};
 const fonte=c.curriculoOrigem==='online'?online:p;
 const exps=Array.isArray(online.experiencias)?online.experiencias:[],forms=Array.isArray(online.formacoes)?online.formacoes:[],cursos=Array.isArray(online.cursos)?online.cursos:[];
 const nome=online.nome||c.candidato||c.nome||'Candidato';
 const titulo=online.titulo||p.titulo||online.objetivo||p.area||'Perfil profissional';
 const cidade=[online.cidade||p.cidade||c.cidade,online.uf||p.uf].filter(Boolean).join(' - ');
 const telefone=online.telefone||c.telefone||'';
 const email=online.email||c.email||'';
 const adPct=typeof calcularAderenciaCandidatoEM==='function'?calcularAderenciaCandidatoEM(c,vaga):0;
 const adNivel=adPct>=80?'Alta aderência':adPct>=60?'Boa aderência':adPct>=40?'Aderência moderada':'Baixa aderência';
 const status=rot?rot(c.status||'Em avaliação'):(c.status||'Em avaliação');
 const sec=(titulo,conteudo)=>conteudo?'<section class="cand-dossie-secao"><h3>'+titulo+'</h3>'+conteudo+'</section>':'';
 const texto=(v)=>v?'<p>'+esc(v)+'</p>':'';
 const experiencia=exps.length?exps.map(x=>'<article class="cand-dossie-item"><div><strong>'+esc(x.cargo||'Experiência profissional')+'</strong><span>'+esc(x.empresa||'')+'</span></div><small>'+esc(x.inicio||'')+(x.atual?' — Atual':x.fim?' — '+esc(x.fim):'')+'</small>'+(x.atividades?'<p>'+esc(x.atividades)+'</p>':'')+'</article>').join(''):(p.experiencia?'<article class="cand-dossie-item"><p>'+esc(p.experiencia)+'</p></article>':'');
 const formacao=forms.length?forms.map(x=>'<article class="cand-dossie-item"><div><strong>'+esc(x.curso||x.formacao||'Formação')+'</strong><span>'+esc(x.instituicao||'')+'</span></div></article>').join(''):(p.escolaridade?'<article class="cand-dossie-item"><p>'+esc(p.escolaridade)+'</p></article>':'');
 const cursosHtml=cursos.length?cursos.map(x=>'<article class="cand-dossie-item compacto"><div><strong>'+esc(x.nome||x.curso||'Curso')+'</strong><span>'+esc(x.instituicao||'')+'</span></div></article>').join(''):'';
 const chips=[online.area||p.area,online.pretensao,online.idiomas].filter(Boolean).map(x=>'<span>'+esc(x)+'</span>').join('');
 const origem=c.curriculoOrigem==='online'?'Currículo online + Empregos':c.curriculoOrigem==='cadastrado'&&curr?'Arquivo anexado · '+esc(curr.nome||'Currículo'):'Perfil profissional + Empregos';
 const dataCand=c.criadoEm?new Date(c.criadoEm).toLocaleDateString('pt-BR'):'—';
 const dataAtual=new Date(c.atualizadoEm||c.criadoEm||Date.now()).toLocaleDateString('pt-BR');

 box.innerHTML=
 '<div class="cand-dossie">'+
  '<header class="cand-dossie-topo">'+
   '<div class="cand-dossie-ident"><div class="cand-dossie-avatar">'+esc(nome.charAt(0).toUpperCase())+'</div><div><span>CANDIDATO À VAGA</span><h2>'+esc(nome)+'</h2><p>'+esc(titulo)+(cidade?' · '+esc(cidade):'')+'</p></div></div>'+
   '<div class="cand-dossie-status"><small>STATUS ATUAL</small><strong>'+esc(status)+'</strong><span>Candidatura em '+dataCand+'</span></div>'+
  '</header>'+
  '<div class="cand-dossie-resumo">'+
   '<article><span>CURRÍCULO</span><strong>'+origem+'</strong><small>Atualizado em '+dataAtual+'</small></article>'+
   '<article class="aderencia"><span>ADERÊNCIA À VAGA</span><strong>'+adPct+'%</strong><small>'+adNivel+'</small><i><b style="width:'+Math.max(0,Math.min(100,adPct))+'%"></b></i></article>'+
   '<article><span>CONTATO</span><strong>'+esc(email||'Não informado')+'</strong><small>'+esc(telefone?formatarTelefoneBR_EM(telefone):'Telefone não informado')+'</small></article>'+
  '</div>'+
  '<div class="cand-dossie-layout">'+
   '<main class="cand-dossie-main">'+
    '<div class="cand-dossie-title"><div><span>CURRÍCULO DO CANDIDATO</span><h3>Informações profissionais</h3></div><button type="button" onclick="abrirCurriculoFormatadoEM(\''+c.id+'\')">Abrir versão completa / PDF ↗</button></div>'+
    (chips?'<div class="cand-dossie-chips">'+chips+'</div>':'')+
    sec('Resumo profissional',texto(online.resumo||p.resumo))+
    sec('Objetivo profissional',texto(online.objetivo))+
    sec('Experiência profissional',experiencia)+
    sec('Formação acadêmica',formacao)+
    sec('Cursos e qualificações',cursosHtml)+
    sec('Competências',texto(online.competencias||p.competencias))+
    sec('Idiomas',texto(online.idiomas))+
   '</main>'+
   '<aside class="cand-dossie-side">'+
    '<section><span>PROCESSO SELETIVO</span><h3>'+esc(tituloVaga(vaga)||'Vaga')+'</h3><p>'+esc([vaga.cidade,vaga.estado||vaga.uf,vaga.modalidade].filter(Boolean).join(' · '))+'</p></section>'+
    '<section class="cand-dossie-side-info"><div><span>Etapa atual</span><strong>'+esc(status)+'</strong></div><div><span>Aderência</span><strong>'+adPct+'%</strong></div><div><span>Recebido em</span><strong>'+dataCand+'</strong></div></section>'+
    '<section class="cand-dossie-side-actions">'+
      (telefone?'<button class="whats" onclick="contatarWhats(\''+c.id+'\')">WhatsApp</button>':'')+
      (email?'<a href="mailto:'+esc(email)+'">Enviar e-mail</a>':'')+
      '<button onclick="abrirEntrevista(\''+c.id+'\')">Agendar entrevista</button>'+
      '<button onclick="abrirChatCandidatoEM(\''+c.id+'\')">Mensagens</button>'+
    '</section>'+
    (c.entrevista&&!c.entrevista.encerrada?'<section class="cand-dossie-entrevista"><span>ENTREVISTA AGENDADA</span><strong>'+new Date(c.entrevista.data+'T'+c.entrevista.hora).toLocaleString('pt-BR')+'</strong><small>'+esc(c.entrevista.formato||'')+(c.entrevista.local?' · '+esc(c.entrevista.local):'')+'</small></section>':'')+
   '</aside>'+
  '</div>'+
  '<div class="cand-dossie-chat">'+renderChatCandidaturaEM(c,'empresa')+'</div>'+
 '</div>';
 $('#modalFichaCandidato').classList.add('ficha-ampla','cand-dossie-modal');
 $('#modalFichaCandidato').classList.remove('oculto');
}function abrirCurriculoFormatadoEM(id){const c=candidaturas().find(x=>x.id===id);if(!c)return;registrarVisualizacaoCurriculoEM(c);const o=c.curriculoOrigem==='online'?(c.curriculo||{}):{},p=c.perfilProfissional||{},nome=o.nome||c.candidato||'Candidato',titulo=o.titulo||p.titulo||o.objetivo||'Perfil profissional',cont=[o.email||c.email,o.telefone||c.telefone,[o.cidade,o.uf].filter(Boolean).join(' - ')].filter(Boolean),sec=(t,v)=>v?'<section><h2>'+t+'</h2><p>'+esc(v)+'</p></section>':'',exp=Array.isArray(o.experiencias)?o.experiencias:[],form=Array.isArray(o.formacoes)?o.formacoes:[],cursos=Array.isArray(o.cursos)?o.cursos:[];const folha='<div class="cv-doc-head"><h1>'+esc(nome)+'</h1><h3>'+esc(titulo)+'</h3><p>'+cont.map(esc).join(' • ')+'</p></div>'+sec('Objetivo profissional',o.objetivo)+sec('Resumo profissional',o.resumo||p.resumo)+(exp.length?'<section><h2>Experiência profissional</h2>'+exp.map(x=>'<article><h4>'+esc(x.cargo||'Experiência')+'</h4><b>'+esc(x.empresa||'')+'</b><small>'+esc(x.inicio||'')+(x.atual?' — Atual':x.fim?' — '+esc(x.fim):'')+'</small>'+(x.atividades?'<p>'+esc(x.atividades)+'</p>':'')+'</article>').join('')+'</section>':'')+(form.length?'<section><h2>Formação acadêmica</h2>'+form.map(x=>'<article><h4>'+esc(x.curso||x.formacao||'Formação')+'</h4><b>'+esc(x.instituicao||'')+'</b></article>').join('')+'</section>':'')+(cursos.length?'<section><h2>Cursos e qualificações</h2>'+cursos.map(x=>'<article><h4>'+esc(x.nome||x.curso||'Curso')+'</h4><b>'+esc(x.instituicao||'')+'</b></article>').join('')+'</section>':'')+sec('Competências',o.competencias||p.competencias)+sec('Idiomas',o.idiomas);const w=window.open('','_blank');if(!w){alert('Permita pop-ups para visualizar o currículo.');return}w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Currículo - '+esc(nome)+'</title><style>@page{size:A4;margin:14mm}*{box-sizing:border-box}body{margin:0;background:#edf1f4;font-family:Arial,sans-serif;color:#263746}.bar{position:sticky;top:0;z-index:5;display:flex;justify-content:space-between;align-items:center;padding:12px 22px;background:#123e5d;color:#fff}.bar strong{font-size:14px}.bar button{border:0;border-radius:7px;background:#fff;color:#123e5d;padding:9px 14px;font-weight:700;cursor:pointer}.page{width:210mm;min-height:297mm;margin:24px auto;padding:20mm 18mm;background:#fff;box-shadow:0 5px 25px #0002}.cv-doc-head{padding-bottom:18px;border-bottom:3px solid #176f86}.cv-doc-head h1{margin:0;color:#123e5d;font-size:30px}.cv-doc-head h3{margin:5px 0;color:#437087;font-size:15px}.cv-doc-head p{font-size:11px;color:#607887}section{margin-top:22px}section h2{margin:0 0 9px;color:#176f86;font-size:14px;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #d9e3e8;padding-bottom:5px}section p{font-size:12px;line-height:1.65;margin:0}article{margin:11px 0}article h4{font-size:13px;margin:0 0 3px}article b,article small{display:block;font-size:11px;color:#617786;margin-top:2px}article p{margin-top:6px}@media print{body{background:#fff}.bar{display:none}.page{width:auto;min-height:0;margin:0;padding:0;box-shadow:none}}</style></head><body><div class="bar"><strong>Currículo + Empregos</strong><button onclick="window.print()">Baixar / Salvar em PDF</button></div><main class="page">'+folha+'</main></body></html>');w.document.close()}
function fecharFichaCandidato(){const m=$('#modalFichaCandidato');m?.classList.add('oculto');m?.classList.remove('ficha-ampla')}function filtrarCandidatos(g){sessionStorage.setItem('filtroCandidatos',g);renderizarCandidatosEmpresa()}
function abrirEntrevista(id){const c=candidaturas().find(x=>x.id===id);if(!c)return;if(['Contratado','Reprovado'].includes(c.status)){alert('Este processo já foi encerrado para o candidato.');return}if(c.entrevista?.encerrada){c.entrevista=null}$('#entrevistaCandidaturaId').value=id;$('#entrevistaCandidatoNome').textContent='Candidato: '+(c.candidato||c.nome||'');$('#entrevistaData').value=c.entrevista?.data||'';$('#entrevistaHora').value=c.entrevista?.hora||'';$('#entrevistaFormato').value=c.entrevista?.formato||'Online';$('#entrevistaLocal').value=c.entrevista?.local||'';$('#entrevistaObs').value=c.entrevista?.observacoes||'';$('#modalEntrevista').classList.remove('oculto')}
function fecharEntrevista(){$('#modalEntrevista')?.classList.add('oculto')}
function salvarEntrevista(e){e.preventDefault();const id=$('#entrevistaCandidaturaId').value,a=candidaturas(),i=a.findIndex(c=>c.id===id);if(i<0)return;if(['Contratado','Reprovado'].includes(a[i].status)){alert('Este processo já foi encerrado para o candidato.');fecharEntrevista();return}const data=$('#entrevistaData').value,hora=$('#entrevistaHora').value,quando=new Date(data+'T'+hora);if(!data||!hora||Number.isNaN(quando.getTime())||quando<=new Date()){alert('Escolha uma data e horário futuros para a entrevista.');return}const agora=new Date().toISOString();a[i].entrevista={data,hora,formato:$('#entrevistaFormato').value,local:$('#entrevistaLocal').value.trim(),observacoes:$('#entrevistaObs').value.trim(),agendadaEm:agora};a[i].status='Entrevista agendada';a[i].atualizadoEm=agora;a[i].historico=Array.isArray(a[i].historico)?a[i].historico:[];a[i].historico.push({status:'Entrevista agendada',data:agora});gravar('empregaMaisCandidaturas',a);fecharEntrevista();renderizarCandidatosEmpresa()}
function mudarEtapaCandidato(id,status){const a=candidaturas(),i=a.findIndex(c=>c.id===id);if(i<0)return;const anterior=a[i].status||'Em avaliação',fluxo=['Selecionado','Em contato','Entrevista agendada','Aprovado','Contratado'];if(anterior===status)return;if(anterior==='Reprovado'||anterior==='Contratado'){alert('Este processo já foi encerrado e não pode voltar para uma etapa anterior.');renderizarCandidatosEmpresa();return}const pa=fluxo.indexOf(anterior),pn=fluxo.indexOf(status);if(pa>=0&&(status==='Em avaliação'||(pn>=0&&pn<pa))){alert('Após selecionar o candidato, não é possível retornar para uma etapa anterior.');renderizarCandidatosEmpresa();return}if(anterior!=='Em avaliação'&&status==='Reprovado'){if(!confirm('Deseja encerrar este candidato como Não selecionado? Esta ação não poderá ser desfeita.')){renderizarCandidatosEmpresa();return}}a[i].status=status;a[i].atualizadoEm=new Date().toISOString();a[i].historico=Array.isArray(a[i].historico)?a[i].historico:[];a[i].historico.push({status,data:a[i].atualizadoEm});if(status==='Contratado'&&!a[i].contratadoEm)a[i].contratadoEm=a[i].atualizadoEm;if(a[i].entrevista&&['Reprovado','Contratado'].includes(status))a[i].entrevista={...a[i].entrevista,encerrada:true,encerradaEm:a[i].atualizadoEm};gravar('empregaMaisCandidaturas',a);const filtroAtual=sessionStorage.getItem('filtroCandidatos')||'Todos';if(filtroAtual!=='Todos'&&grupoEtapa(status)!==filtroAtual)sessionStorage.setItem('filtroCandidatos',grupoEtapa(status));renderizarCandidatosEmpresa()}
function contatarWhats(id){const c=candidaturas().find(x=>x.id===id),v=ler('empregaMaisVagas').find(x=>x.id===c?.vagaId);if(!c||!c.telefone)return;let f=nums(c.telefone);if(f.length<10){alert('O telefone deste candidato está incompleto.');return}if(f.length<=11)f='55'+f;const texto='Olá, '+(c.candidato||c.nome||'')+'! Meu nome é [SEU NOME] e falo em nome da '+(sessionStorage.getItem('empresaNome')||'empresa')+'. Recebemos seu currículo para a vaga de '+tituloVaga(v||{})+' pelo + Empregos e gostaríamos de conversar sobre o processo seletivo.';window.open('https://wa.me/'+f+'?text='+encodeURIComponent(texto),'_blank')}
function atualizarPainelCandidato(){const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),apps=candidaturasDoCandidatoAtualEM(),curr=ler(chaveCurriculo(),null),cvOnline=dadosCurriculoOnlineEM(),ids=salvas(),perfil=candidatoLogado()?.perfil||{},entrev=apps.filter(c=>grupoEtapa(c.status)==='Entrevista').length;const set=(id,v)=>{const e=$('#'+id);if(e)e.textContent=v};const nomeCand=sessionStorage.getItem('candidatoNome')||candidatoLogado()?.nome||'Candidato';set('candSideNome',nomeCand);set('candSideAvatar',String(nomeCand).charAt(0).toUpperCase());set('candHeroTitulo','Olá, '+String(nomeCand).split(' ')[0]+'!');const camposPerfil=[perfil.titulo,perfil.area,perfil.escolaridade,perfil.experiencia,perfil.resumo,perfil.competencias,perfil.modalidade,candidatoLogado()?.cidade],preenchidos=camposPerfil.filter(Boolean).length,pct=Math.round(preenchidos/camposPerfil.length*100);set('candPerfilProgressoTexto',pct+'% completo');const barra=$('#candPerfilProgressoBarra');if(barra)barra.style.width=pct+'%';const cvCampos=[cvOnline.nome,cvOnline.titulo,cvOnline.email,cvOnline.telefone,cvOnline.cidade,cvOnline.uf,cvOnline.area,cvOnline.objetivo,cvOnline.escolaridade,cvOnline.competencias],cvPreenchidos=cvCampos.filter(v=>String(v||'').trim()).length,cvExtras=(Array.isArray(cvOnline.experiencias)&&cvOnline.experiencias.length?1:0)+(Array.isArray(cvOnline.formacoes)&&cvOnline.formacoes.length?1:0),cvTotal=cvCampos.length+2,cvPct=Math.min(100,Math.round((cvPreenchidos+cvExtras)/cvTotal*100)),cvExiste=cvPreenchidos>0||cvExtras>0,cvStatus=!cvExiste?'Pendente':cvPct>=80?'Completo':cvPct+'% completo';set('candMetricaCurriculo',cvStatus);set('candMetricaCandidaturas',apps.length);set('candMetricaEntrevistas',entrev);set('candMetricaSalvas',ids.length);const cvSmall=document.querySelector('#candMetricaCurriculo')?.parentElement?.querySelector('small');if(cvSmall)cvSmall.textContent=!cvExiste?'Crie seu currículo online':cvPct>=80?'Currículo online atualizado':'Continue preenchendo seu currículo';const cvKpi=document.querySelector('#candMetricaCurriculo')?.closest('article');if(cvKpi){cvKpi.classList.toggle('curriculo-completo',cvExiste&&cvPct>=80);cvKpi.classList.toggle('curriculo-parcial',cvExiste&&cvPct<80);cvKpi.classList.toggle('curriculo-pendente',!cvExiste);cvKpi.setAttribute('aria-label',cvExiste&&cvPct>=80?'Currículo completo. Abrir currículo online':!cvExiste?'Currículo pendente. Criar currículo online':'Currículo '+cvPct+'% completo. Continuar preenchimento');}const jornada=$('#resumoJornadaCandidato');if(jornada)jornada.innerHTML=apps.length?apps.slice().sort((a,b)=>new Date(b.criadoEm||0)-new Date(a.criadoEm||0)).slice(0,4).map(c=>{const v=ler('empregaMaisVagas').find(x=>x.id===c.vagaId)||{};return'<div class="jornada-item"><div><strong>'+esc(tituloVaga(v)||c.vagaTitulo||'Vaga')+'</strong><span>'+esc(v.confidencial?'Empresa confidencial':v.empresa||'')+'</span></div><span class="vaga-status">'+esc(c.status||'Em avaliação')+'</span></div>'}).join(''):'<div class="vagas-vazio"><strong>Nenhuma candidatura ainda</strong><span>Encontre uma oportunidade e acompanhe o processo por aqui.</span></div>';const rec=$('#vagasRecomendadasCandidato');if(rec){const area=String(perfil.area||'').toLowerCase(),cidade=String(candidatoLogado()?.cidade||'').toLowerCase(),mod=perfil.modalidade||'',aplicadas=new Set(apps.map(c=>c.vagaId));let vagas=vagasPublicas().filter(v=>!aplicadas.has(v.id));vagas.sort((a,b)=>{const pa=(area&&String(a.area||'').toLowerCase().includes(area)?3:0)+(cidade&&String(a.cidade||'').toLowerCase()===cidade?2:0)+(mod&&a.modalidade===mod?1:0),pb=(area&&String(b.area||'').toLowerCase().includes(area)?3:0)+(cidade&&String(b.cidade||'').toLowerCase()===cidade?2:0)+(mod&&b.modalidade===mod?1:0);return pb-pa||new Date(b.criadoEm||0)-new Date(a.criadoEm||0)});rec.innerHTML=vagas.length?vagas.slice(0,4).map(cardVagaPortal).join(''):'<div class="vagas-vazio"><strong>Sem recomendações no momento</strong><span>Complete seu perfil e volte em breve.</span></div>'}try{atualizarSeguirEmpresaEM()}catch(e){} }

async function sincronizarCandidatoLogadoSupabaseEM(){
 const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),userId=sessionStorage.getItem('candidatoSupabaseUserId')||'';
 if(!email&&!userId)return null;
 try{
  const t=await sbGarantirSessaoEM();if(!t)return null;
  const filtro=userId?'user_id=eq.'+encodeURIComponent(userId):'email=eq.'+encodeURIComponent(email);
  const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/candidatos?select=*&'+filtro+'&limit=1',{method:'GET',headers:sbHeadersEM(t)});
  const x=Array.isArray(rows)?rows[0]:null;if(!x){sessionStorage.setItem('candidatoPremiumVerificadoEM','0');return null;}
  sessionStorage.setItem('candidatoPremiumVerificadoEM',x.premium===true?'1':'0');
  const atual=sbSalvarCandidatoLocalEM(sbMapPerfilCandidatoCloudEM(x,candidatoLogado()||{}));
  const cloudEmail=String(atual.email||email||'').toLowerCase();
  if(cloudEmail){
   gravar('empregaMaisCurriculoOnline_'+cloudEmail,atual.curriculoOnline||{});
   if(atual.curriculoArquivo)gravar('empregaMaisCurriculo_'+cloudEmail,atual.curriculoArquivo);
   else localStorage.removeItem('empregaMaisCurriculo_'+cloudEmail);
   gravar('empregaMaisSalvas_'+cloudEmail,atual.vagasSalvas||[]);
  }
  return atual
 }catch(err){console.error('Sincronização candidato logado / Supabase:',err);return null}
}
const _atualizarPainelCandidatoLocalEM=atualizarPainelCandidato;
atualizarPainelCandidato=async function(){
 await sincronizarCandidatoLogadoSupabaseEM();
 _atualizarPainelCandidatoLocalEM();
 const c=candidatoLogado(),ativo=candidatoPremiumAtivoEM(c),nav=document.querySelector('.cand-premium-nav span'),pagina=document.getElementById('pagina-painel-candidato');
 if(nav)nav.textContent=ativo?'Premium ✓':'Premium';
 const side=document.querySelector('.cand-side-user small');
 if(side)side.textContent=ativo?'Candidato Premium':'Área do candidato';
 if(pagina)pagina.classList.toggle('cand-dashboard-premium',ativo);
 renderizarVisualizacoesCurriculoCandidatoEM();
 let faixa=document.getElementById('candPremiumStatusCard');
 if(!faixa&&pagina){
  const hero=pagina.querySelector('.cand-dashboard-hero');
  if(hero){faixa=document.createElement('section');faixa.id='candPremiumStatusCard';faixa.className='cand-premium-status-card';hero.insertAdjacentElement('afterend',faixa)}
 }
 if(faixa){
  if(!ativo){faixa.hidden=true}
  else{
   faixa.hidden=false;
   const ate=c?.premiumValidoAte?new Date(c.premiumValidoAte).toLocaleDateString('pt-BR'):'Sem prazo definido',origem=c?.premiumCortesiaAdmin?'Cortesia administrativa':'Assinatura Premium';
   faixa.innerHTML='<div class="cand-premium-status-icon">★</div><div class="cand-premium-status-copy"><span>EMPREGAMAIS PREMIUM</span><strong>Seu Premium está ativo</strong><p>'+esc(origem)+' · acesso liberado até <b>'+esc(ate)+'</b></p></div><div class="cand-premium-status-badge"><i></i><span>STATUS</span><b>ATIVO</b></div><button type="button" onclick="irPara(\'premium-candidato\')">Ver benefícios →</button>';
  }
 }
 const titulo=document.getElementById('candHeroTitulo'),saudacao=document.getElementById('candidatoSaudacao');
 if(ativo&&titulo)titulo.textContent='Olá, '+String(c?.nome||sessionStorage.getItem('candidatoNome')||'Candidato').split(' ')[0]+'! Seu Premium está ativo.';
 if(ativo&&saudacao)saudacao.textContent='Aproveite seus recursos Premium para acompanhar sua jornada profissional com mais inteligência e controle.';
}
const _atualizarPremiumCandidatoLocalEM=atualizarPremiumCandidatoEM;
atualizarPremiumCandidatoEM=async function(){await sincronizarCandidatoLogadoSupabaseEM();_atualizarPremiumCandidatoLocalEM()}


async function migrarAvaliacoesLocaisSupabaseEM(){
 const locais=[...ler('empregaMaisAvaliacoesEmpresa',[]),...ler('empregaMaisAvaliacoesProcessos',[])],map=new Map();
 locais.forEach(a=>{const k=String(a.candidaturaId||a.id||'');if(k&&Number(a.nota)>0&&nums(a.empresaCnpj||a.cnpj||''))map.set(k,a)});
 if(!map.size)return;
 const t=await sbGarantirSessaoEM();if(!t)return;
 const uid=sessionStorage.getItem('candidatoSupabaseUserId')||candidatoLogado()?.userId||'';
 for(const a of map.values()){
  const id=String(a.id||('AV-MIG-'+String(a.candidaturaId||Date.now())));
  const body={id,candidatura_id:String(a.candidaturaId||''),vaga_id:String(a.vagaId||''),empresa_cnpj:nums(a.empresaCnpj||a.cnpj||''),candidato_user_id:uid||null,candidato_email:a.candidatoEmail||'',nota:Number(a.nota),comunicacao:Number(a.comunicacao||0),clareza:Number(a.clareza||0),organizacao:Number(a.organizacao||0),respeito:Number(a.respeito||0),feedback:Number(a.feedback||0),crescimento:Number(a.crescimento||0),equilibrio:Number(a.equilibrio||0),ambiente:Number(a.ambiente||0),beneficios:Number(a.beneficios||0),recomenda:a.recomenda||'',aprova_lideranca:a.aprovaLideranca||a.aprova_lideranca||'',comentario:a.comentario||'',verificada:a.verificada!==false,criado_em:a.criadoEm||a.data||new Date().toISOString()};
  try{await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/avaliacoes_empresas?on_conflict=candidatura_id',{method:'POST',headers:Object.assign(sbHeadersEM(t),{'Prefer':'resolution=ignore-duplicates,return=minimal'}),body:JSON.stringify(body)})}catch(e){console.warn('Migração de avaliação antiga:',e)}
 }
}
async function sincronizarAvaliacoesEmpresasSupabaseEM(){
 try{
  await migrarAvaliacoesLocaisSupabaseEM();
  const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/avaliacoes_empresas?select=*&verificada=eq.true&order=criado_em.desc',{method:'GET',headers:sbHeadersEM()});
  const av=(Array.isArray(rows)?rows:[]).map(x=>({id:x.id,candidaturaId:x.candidatura_id,vagaId:x.vaga_id,empresaCnpj:x.empresa_cnpj,candidatoEmail:x.candidato_email,nota:Number(x.nota||0),comunicacao:x.comunicacao,clareza:x.clareza,organizacao:x.organizacao,respeito:x.respeito,feedback:x.feedback,crescimento:x.crescimento,equilibrio:x.equilibrio,ambiente:x.ambiente,beneficios:x.beneficios,recomenda:x.recomenda,aprovaLideranca:x.aprova_lideranca,comentario:x.comentario,verificada:x.verificada===true,criadoEm:x.criado_em,data:x.criado_em}));
  gravar('empregaMaisAvaliacoesEmpresa',av);gravar('empregaMaisAvaliacoesProcessos',av);return av;
 }catch(e){console.error('Avaliações / Supabase:',e);return ler('empregaMaisAvaliacoesEmpresa',[])}
}
async function salvarAvaliacaoEmpresaSupabaseEM(a){
 const t=await sbGarantirSessaoEM();if(!t)throw new Error('Sessão do candidato ausente.');
 const uid=sessionStorage.getItem('candidatoSupabaseUserId')||candidatoLogado()?.userId||'';
 const body={id:a.id,candidatura_id:String(a.candidaturaId||''),vaga_id:String(a.vagaId||''),empresa_cnpj:nums(a.empresaCnpj||''),candidato_user_id:uid||null,candidato_email:a.candidatoEmail||'',nota:Number(a.nota),comunicacao:a.comunicacao||0,clareza:a.clareza||0,organizacao:a.organizacao||0,respeito:a.respeito||0,feedback:a.feedback||0,crescimento:a.crescimento||0,equilibrio:a.equilibrio||0,ambiente:a.ambiente||0,beneficios:a.beneficios||0,recomenda:a.recomenda||'',aprova_lideranca:a.aprovaLideranca||'',comentario:a.comentario||'',verificada:true};
 await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/avaliacoes_empresas',{method:'POST',headers:Object.assign(sbHeadersEM(t),{'Prefer':'return=minimal'}),body:JSON.stringify(body)});
}
function avaliacoesProcessosEM(){return ler('empregaMaisAvaliacoesProcessos',[])}
function processosAvaliaveisEM(){
 const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase();
 /* Avaliação só é liberada quando o processo já teve desfecho. */
 const finais=new Set(['Contratados','Reprovados','Encerrados','Processo encerrado','Finalizado','Finalizados']);
 return candidaturasDoCandidatoAtualEM().filter(c=>(c.email||'').toLowerCase()===email&&finais.has(grupoEtapa(c.status)));
}
function renderizarAvaliacoesProcessosEM(){
 const box=document.getElementById('listaAvaliacoesProcessosEM');if(!box)return;
 const cand=candidatoLogado(),premium=candidatoPremiumAtivoEM(cand);
 if(!premium){box.innerHTML='<div class="cand-avaliacao-bloqueio"><span>★ PREMIUM</span><h3>Recurso exclusivo Premium</h3><p>Assine o Premium para avaliar processos seletivos dos quais você realmente participou.</p><button onclick="irPara(\'premium-candidato\')">Conhecer Premium</button></div>';return}
 const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),vagas=ler('empregaMaisVagas'),avs=avaliacoesProcessosEM(),lista=processosAvaliaveisEM();
 const feitas=avs.filter(a=>a.candidatoEmail===email),media=feitas.length?feitas.reduce((s,a)=>s+Number(a.nota||0),0)/feitas.length:0;
 box.innerHTML='<div class="cand-avaliacao-resumo-pro"><div><small>PROCESSOS DISPONÍVEIS</small><strong>'+lista.filter(c=>!avs.some(a=>String(a.candidaturaId)===String(c.id)&&a.candidatoEmail===email)).length+'</strong><span>Aguardando sua avaliação</span></div><div><small>AVALIAÇÕES ENVIADAS</small><strong>'+feitas.length+'</strong><span>Experiências compartilhadas</span></div><div><small>SUA MÉDIA GERAL</small><strong>'+(feitas.length?media.toFixed(1).replace('.',','):'—')+'</strong><span>'+(feitas.length?'de 5 estrelas':'Avalie seu primeiro processo')+'</span></div></div>'+
 (lista.length?'<div class="cand-avaliacao-grid-pro">'+lista.map(c=>{const v=vagas.find(x=>String(x.id)===String(c.vagaId))||{},nome=v.confidencial?'Empresa confidencial':(v.empresa||'Empresa'),ja=avs.find(a=>String(a.candidaturaId)===String(c.id)&&a.candidatoEmail===email),logo=logoEmpresaVaga(v),data=c.criadoEm?new Date(c.criadoEm).toLocaleDateString('pt-BR'):'';return '<article class="cand-avaliacao-card-pro"><div class="cand-avaliacao-empresa"><div class="cand-avaliacao-logo">'+(logo?'<img src="'+esc(logo)+'" alt="">':'<b>'+esc(nome.charAt(0))+'</b>')+'</div><div><small>PROCESSO SELETIVO</small><h3>'+esc(tituloVaga(v)||c.vagaTitulo||'Processo seletivo')+'</h3><p>'+esc(nome)+'</p></div></div><div class="cand-avaliacao-meta"><span>▣ '+esc(c.status||'Em avaliação')+'</span>'+(data?'<span>◷ Candidatura em '+data+'</span>':'')+'</div>'+(ja?'<div class="cand-avaliacao-concluida"><strong>'+Number(ja.nota||0).toFixed(1).replace('.',',')+' ★</strong><span>AVALIAÇÃO ENVIADA</span><small>Obrigado por compartilhar sua experiência.</small></div>':'<div class="cand-avaliacao-pendente"><p>Avalie comunicação, clareza, organização, respeito e retorno da empresa durante o processo.</p><button onclick="abrirAvaliacaoProcessoEM(\''+c.id+'\')">Avaliar este processo →</button></div>')+'</article>'}).join('')+'</div>':'<div class="cand-avaliacao-bloqueio"><h3>Nenhum processo para avaliar</h3><p>Quando você participar de um processo seletivo, ele aparecerá aqui.</p><button onclick="irPara(\'home\')">Buscar vagas</button></div>');
}
let avaliacaoProcessoNotaEM=0;
function abrirAvaliacaoProcessoEM(id){
 const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),c=candidaturas().find(x=>String(x.id)===String(id)&&(x.email||'').toLowerCase()===email);if(!c)return;
 if(!candidatoPremiumAtivoEM(candidatoLogado()))return irPara('premium-candidato');
 const finais=new Set(['Contratados','Reprovados','Encerrados','Processo encerrado','Finalizado','Finalizados']);if(!finais.has(grupoEtapa(c.status))){alert('A avaliação fica disponível após o encerramento do processo seletivo.');return}
 if(avaliacoesProcessosEM().some(a=>String(a.candidaturaId)===String(id)&&a.candidatoEmail===email)){alert('Você já avaliou este processo seletivo.');return}
 const v=ler('empregaMaisVagas').find(x=>String(x.id)===String(c.vagaId))||{};avaliacaoProcessoNotaEM=0;
 document.getElementById('avaliacaoProcessoModalEM')?.remove();const m=document.createElement('div');m.id='avaliacaoProcessoModalEM';m.className='avaliacao-processo-modal';
 const criterio=(nome,key,txt)=>'<div class="avp-criterio"><div><b>'+nome+'</b><small>'+txt+'</small></div><select id="avp-'+key+'"><option value="5">5 — Excelente</option><option value="4">4 — Muito bom</option><option value="3">3 — Bom</option><option value="2">2 — Regular</option><option value="1">1 — Ruim</option></select></div>';
 m.innerHTML='<div class="avaliacao-processo-backdrop" onclick="fecharAvaliacaoProcessoEM()"></div><div class="avaliacao-processo-dialog avaliacao-processo-dialog-pro"><button class="avaliacao-processo-fechar" onclick="fecharAvaliacaoProcessoEM()">×</button><span class="avp-kicker">AVALIAÇÃO VERIFICADA</span><h2>Como foi este processo seletivo?</h2><p class="avp-sub">'+esc(tituloVaga(v)||c.vagaTitulo||'Vaga')+' · '+esc(v.confidencial?'Empresa confidencial':(v.empresa||'Empresa'))+'</p><div class="avp-geral"><div><b>Nota geral da experiência</b><small>Considere sua experiência como um todo.</small></div><div class="avaliacao-estrelas">'+[1,2,3,4,5].map(n=>'<button type="button" data-nota="'+n+'" onclick="selecionarNotaProcessoEM('+n+')">★</button>').join('')+'</div></div><div class="avp-criterios">'+'<div class="avp-secao-titulo"><b>AVALIAÇÃO DO PROCESSO SELETIVO</b><small>Avalie somente sua experiência durante a seleção.</small></div>'+criterio('Comunicação','comunicacao','Contato e orientações da empresa')+criterio('Clareza','clareza','Transparência sobre etapas e vaga')+criterio('Organização','organizacao','Pontualidade e condução do processo')+criterio('Respeito','respeito','Tratamento recebido como candidato')+criterio('Feedback','feedback','Qualidade do retorno recebido')+'<div class="avp-secao-titulo avp-secao-empresa"><b>AVALIAÇÃO DA EMPRESA</b><small>Uma visão separada sobre a experiência e percepção da empresa.</small></div>'+criterio('Oportunidade de crescimento','crescimento','Perspectiva de desenvolvimento e carreira')+criterio('Equilíbrio vida e trabalho','equilibrio','Conciliação com a vida pessoal e familiar')+criterio('Ambiente de trabalho','ambiente','Sua percepção sobre cultura e ambiente')+criterio('Benefícios','beneficios','Atratividade dos benefícios apresentados')+'</div><div class="avp-binarios"><label><span>Recomendaria participar de processos desta empresa?</span><select id="avp-recomenda"><option value="sim">Sim</option><option value="nao">Não</option></select></label><label><span>Aprova a experiência com a liderança/recrutamento?</span><select id="avp-aprova"><option value="sim">Sim</option><option value="nao">Não</option></select></label></div><label class="avp-comentario"><b>Conte como foi sua experiência</b><textarea id="avaliacaoProcessoComentarioEM" maxlength="800" placeholder="Compartilhe sua percepção sobre comunicação, etapas, entrevista e retorno. Não inclua dados pessoais."></textarea><small>Até 800 caracteres</small></label><div class="avaliacao-processo-acoes"><button onclick="fecharAvaliacaoProcessoEM()">Cancelar</button><button class="primario" onclick="salvarAvaliacaoProcessoEM(\''+id+'\')">Publicar avaliação</button></div></div>';document.body.appendChild(m);
}
function selecionarNotaProcessoEM(n){avaliacaoProcessoNotaEM=n;document.querySelectorAll('#avaliacaoProcessoModalEM [data-nota]').forEach(b=>b.classList.toggle('ativa',Number(b.dataset.nota)<=n))}
function fecharAvaliacaoProcessoEM(){document.getElementById('avaliacaoProcessoModalEM')?.remove();avaliacaoProcessoNotaEM=0}
async function salvarAvaliacaoProcessoEM(id){
 if(avaliacaoProcessoNotaEM<1){alert('Selecione uma nota geral de 1 a 5 estrelas.');return}
 const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),c=candidaturas().find(x=>String(x.id)===String(id)&&(x.email||'').toLowerCase()===email);if(!c)return;
 const lista=avaliacoesProcessosEM();if(lista.some(a=>String(a.candidaturaId)===String(id)&&a.candidatoEmail===email)){fecharAvaliacaoProcessoEM();return}
 const get=k=>Number(document.getElementById('avp-'+k)?.value||0),criterios={comunicacao:get('comunicacao'),clareza:get('clareza'),organizacao:get('organizacao'),respeito:get('respeito'),feedback:get('feedback'),crescimento:get('crescimento'),equilibrio:get('equilibrio'),ambiente:get('ambiente'),beneficios:get('beneficios')};
 const vagaAval=ler('empregaMaisVagas').find(x=>String(x.id)===String(c.vagaId))||(Array.isArray(window.sbVagasCacheEM)?window.sbVagasCacheEM.find(x=>String(x.id)===String(c.vagaId)):null)||{},empresaCnpjAval=vagaAval.empresaCnpj||vagaAval.cnpj||'';lista.unshift({id:'AVP-'+Date.now(),candidaturaId:c.id,vagaId:c.vagaId,empresaCnpj:empresaCnpjAval,candidatoEmail:email,nota:avaliacaoProcessoNotaEM,...criterios,recomenda:document.getElementById('avp-recomenda')?.value||'',aprovaLideranca:document.getElementById('avp-aprova')?.value||'',comentario:(document.getElementById('avaliacaoProcessoComentarioEM')?.value||'').trim(),verificada:true,criadoEm:new Date().toISOString()});gravar('empregaMaisAvaliacoesProcessos',lista);
 try{await salvarAvaliacaoEmpresaSupabaseEM(lista[0])}catch(e){console.error('Não foi possível centralizar a avaliação:',e);alert('Não foi possível publicar a avaliação no servidor. Tente novamente.');return}
 /* também alimenta o perfil público da empresa quando houver CNPJ */
 const v=ler('empregaMaisVagas').find(x=>String(x.id)===String(c.vagaId))||{},cnpj=v.empresaCnpj||v.cnpj||'';
 if(cnpj){const ea=ler('empregaMaisAvaliacoesEmpresa');if(!ea.some(x=>String(x.candidaturaId)===String(c.id))){ea.unshift({id:'av_'+Date.now(),candidaturaId:c.id,empresaCnpj:cnpj,nota:avaliacaoProcessoNotaEM,...criterios,recomenda:document.getElementById('avp-recomenda')?.value||'',aprovaLideranca:document.getElementById('avp-aprova')?.value||'',comentario:(document.getElementById('avaliacaoProcessoComentarioEM')?.value||'').trim(),verificada:true,data:new Date().toISOString()});gravar('empregaMaisAvaliacoesEmpresa',ea)}}
 fecharAvaliacaoProcessoEM();renderizarAvaliacoesProcessosEM();
}
function renderizarCandidaturasCandidato(){const box=$('#listaCandidaturas');if(!box)return;const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),a=candidaturasDoCandidatoAtualEM().sort((x,y)=>new Date(y.criadoEm||0)-new Date(x.criadoEm||0)),grupo=c=>grupoEtapa(c.status),emProcesso=a.filter(c=>['Selecionados','Em contato','Entrevista','Aprovados'].includes(grupo(c))).length,emAnalise=a.filter(c=>grupo(c)==='Em avaliação').length,finalizadas=a.filter(c=>['Contratados','Reprovados'].includes(grupo(c))).length;box.innerHTML='<div class="cand-page-resumo"><div><small>TOTAL DE CANDIDATURAS</small><strong>'+a.length+'</strong></div><div><small>EM ANÁLISE</small><strong>'+emAnalise+'</strong></div><div><small>EM PROCESSO</small><strong>'+emProcesso+'</strong></div><div><small>FINALIZADAS</small><strong>'+finalizadas+'</strong></div></div><div class="cand-page-toolbar"><div><strong>Acompanhe seus processos</strong><span>Veja em qual etapa está cada candidatura.</span></div><select id="candFiltroStatus" onchange="filtrarCandidaturasPaginaEM()"><option value="">Todos os status</option><option value="Em avaliação">Em análise</option><option value="Selecionados">Selecionado</option><option value="Em contato">Em contato</option><option value="Entrevista">Entrevista</option><option value="Aprovados">Aprovado</option><option value="Contratados">Contratado</option><option value="Reprovados">Processo encerrado</option></select></div><div id="candListaElegante">'+(a.length?a.map(c=>{const v=ler('empregaMaisVagas').find(x=>x.id===c.vagaId)||{},etapas=['Candidatura enviada','Em análise','Selecionado','Em contato','Entrevista','Aprovado','Contratado'],g=grupo(c),idx=({'Em avaliação':1,'Selecionados':2,'Em contato':3,'Entrevista':4,'Aprovados':5,'Contratados':6}[g]??1),reprov=g==='Reprovados',logo=logoEmpresaVaga(v),nome=v.confidencial?'Empresa confidencial':(v.empresa||'Empresa'),emp=ler('empregaMaisEmpresas').find(e=>nums(e.cnpj||'')===nums(v.empresaCnpj||v.cnpj||''))||{},ver= !v.confidencial&&(emp.verificada||emp.verificacaoStatus==='aprovada'),data=c.criadoEm?new Date(c.criadoEm).toLocaleDateString('pt-BR'):'',linhaBase=reprov?'<div class="cand-processo-encerrado cand-nao-selecionado"><b>Não selecionado</b><span>Seu perfil não foi selecionado para continuar neste processo seletivo.</span></div>':'<div class="candidatura-timeline">'+etapas.map((e,i)=>{const canon=['Candidatura enviada','Em avaliação','Selecionado','Em contato','Entrevista agendada','Aprovado','Contratado'][i],dt=sbDataEtapaCandidaturaEM(c,canon)||(i===0?c.criadoEm:'');const concluida=i<idx||(g==='Contratados'&&i===idx),classe=concluida?'feito '+(i===idx?'atual-final ':''):i===idx?'atual ':'';return '<div class="'+classe+'"><i>'+(concluida?'✓':'')+'</i><span>'+e+'</span><small>'+(dt?new Date(dt).toLocaleDateString('pt-BR'):(i===1&&g==='Em avaliação'?'Aguardando retorno':'—'))+'</small></div>'}).join('')+'</div>';const linha=reprov?linhaBase:'<div class="cand-processo-snippet"><div><span>PROCESSO SELETIVO</span><strong>'+esc(etapas[idx]||'Em análise')+(g==='Contratados'?' ✓':'')+'</strong><small>Acompanhe as atualizações desta candidatura.</small></div><button type="button" onclick="alternarTimelineCandidatoEM(this)">Ver andamento completo →</button></div><div class="cand-timeline-detalhe">'+linhaBase+'</div>',entrevista=c.entrevista&&!c.entrevista.encerrada?'<div class="entrevista-resumo"><strong>Entrevista agendada</strong><span>'+new Date(c.entrevista.data+'T'+c.entrevista.hora).toLocaleString('pt-BR')+' · '+esc(c.entrevista.formato||'')+'</span>'+(c.entrevista.local?'<span>'+esc(c.entrevista.local)+'</span>':'')+(c.entrevista.observacoes?'<small>'+esc(c.entrevista.observacoes)+'</small>':'')+'</div>':'';return '<article class="candidato-card candidatura-card candidatura-acompanhamento cand-elegante" data-cand-grupo="'+esc(g)+'"><div class="cand-card-head"><div class="cand-identidade">'+(logo?'<img src="'+esc(logo)+'" alt="">':'<div class="cand-logo-fallback">'+esc(nome.charAt(0).toUpperCase())+'</div>')+'<div><h3>'+esc(tituloVaga(v)||c.vagaTitulo||'Vaga')+'</h3><p>'+esc(nome)+(ver?' <span class="empresa-verificada-card" title="Empresa verificada">✓</span>':'')+'</p><small>'+esc(v.cidade||'')+(v.estado?' - '+esc(v.estado):'')+(v.modalidade?' · '+esc(v.modalidade):'')+'</small></div></div><div class="cand-status-col"><span class="cand-status cand-status-'+(reprov?'encerrado':g==='Contratados'?'contratado':g==='Aprovados'?'aprovado':g==='Entrevista'?'entrevista':'andamento')+'">'+esc(c.status||'Em avaliação')+'</span><small>Candidatou-se'+(data?' em '+data:'')+'</small></div></div>'+linha+entrevista+'<div class="cand-card-bottom"><div class="cand-envio-ok"><b>ⓘ Sua candidatura foi enviada com sucesso!</b><span>A empresa está analisando seu perfil. Você será notificado sobre as próximas etapas.</span></div><div class="cand-card-actions">'+(v.id?'<button type="button" onclick="abrirVaga(\''+v.id+'\')">◉ Ver vaga</button>':'')+'<button type="button" onclick="irPara(\'curriculo-candidato\')">▤ Ver currículo enviado</button><button type="button" class="cand-retirar" onclick="retirarCandidaturaEM(\''+c.id+'\')">♲ Retirar candidatura</button></div></div>'+'</article>'}).join(''):'<div class="vagas-vazio"><strong>Você ainda não possui candidaturas</strong><span>Quando se candidatar a uma vaga, o andamento aparecerá aqui.</span></div>')+'</div>'}
function filtrarCandidaturasPaginaEM(){const f=document.getElementById('candFiltroStatus')?.value||'';document.querySelectorAll('#candListaElegante [data-cand-grupo]').forEach(x=>x.style.display=!f||x.dataset.candGrupo===f?'':'none')}
function vagasPublicas(){return ler('empregaMaisVagas').filter(v=>v.status==='aprovada'&&vagaDentroPrazo(v))}
function tituloVaga(v){return String(v.cargo||v.titulo||'Vaga').toLocaleUpperCase('pt-BR')}function preencherAreasPortal(){const el=$('#filtroArea');if(!el||el.options.length>1)return;[...new Set(vagasPublicas().map(v=>v.area).filter(Boolean))].sort().forEach(x=>el.add(new Option(x,x)))}function textoDataVaga(v){const d=new Date(v.criadoEm||Date.now()),dias=Math.max(0,Math.floor((Date.now()-d.getTime())/86400000));return dias===0?'Publicada hoje':dias===1?'Publicada ontem':'Publicada há '+dias+' dias'}function textoPrazoVaga(v){if(!v.dataEncerramento)return'';const hoje=new Date();hoje.setHours(0,0,0,0);const fim=new Date(v.dataEncerramento+'T00:00:00'),dias=Math.ceil((fim-hoje)/86400000);if(dias<0)return'Inscrições encerradas';if(dias===0)return'Último dia';if(dias===1)return'Encerra amanhã';return'Encerra em '+dias+' dias'}function vagaDentroPrazo(v){if(!v.dataEncerramento)return true;return new Date(v.dataEncerramento+'T23:59:59')>=new Date()}function destaqueAtivo(v){return !!v.destaque&&(!v.destaqueAte||new Date(v.destaqueAte)>=new Date())}function empresaAssinanteVaga(v){if(v.confidencial)return false;const c=nums(v.empresaCnpj||v.cnpj||'');const emp=ler('empregaMaisEmpresas').find(e=>nums(e.cnpj||'')===c)||{};return !!((emp.plano&&emp.plano!=='basico')||emp.planoLiberadoAdmin||emp.assinaturaAtiva)}function logoEmpresaVaga(v){
 if(!v||v.confidencial)return'';
 const c=nums(v.empresaCnpj||v.cnpj||''),nome=String(v.empresa||'').trim().toLowerCase();
 const emp=ler('empregaMaisEmpresas').find(e=>(v.empresaId&&String(e.id||'')===String(v.empresaId))||(c&&nums(e.cnpj||'')===c)||(nome&&[e.nome,e.nomeFantasia,e.razaoSocial].some(n=>String(n||'').trim().toLowerCase()===nome)))||{};
 const logo=v.logo||v.logoUrl||v.empresaLogo||emp.logo||emp.logoUrl||emp.perfil?.logo||'';
 /* Vaga em destaque sempre pode exibir a logo; nas demais permanece a regra do plano. */
 if(destaqueAtivo(v))return logo;
 if(!v.empresaId&&!v.empresa_id&&logo)return logo;
 return empresaAssinanteVaga(v)?logo:'';
}
let localizacaoCandidatoEM=null,localizacaoCandidatoSolicitadaEM=false,geocodeDistanciaEmAndamento=false;
function distanciaKmEM(aLat,aLng,bLat,bLng){
 const vals=[aLat,aLng,bLat,bLng].map(Number);if(vals.some(n=>!Number.isFinite(n)))return null;
 const [la1,lo1,la2,lo2]=vals.map(n=>n*Math.PI/180),dLat=la2-la1,dLng=lo2-lo1;
 const h=Math.sin(dLat/2)**2+Math.cos(la1)*Math.cos(la2)*Math.sin(dLng/2)**2;
 return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
}
function candidatoLogadoDistanciaEM(){return papelAtual()==='candidato'}
function coordsCandidatoCadastroEM(){
 if(!candidatoLogadoDistanciaEM())return null;
 const d=dadosCurriculoOnlineEM?.()||{};
 const lat=Number(d.latitude??d.lat),lng=Number(d.longitude??d.lng??d.lon);
 return Number.isFinite(lat)&&Number.isFinite(lng)?{latitude:lat,longitude:lng}:null
}
async function geocodificarEnderecoDistanciaEM(partes){
 const q=partes.filter(Boolean).map(x=>String(x).trim()).filter(Boolean).join(', ');
 if(!q)return null;
 const chave='empregaMaisGeo_'+q.toLowerCase(),cache=ler(chave,null);
 if(cache&&Number.isFinite(Number(cache.latitude))&&Number.isFinite(Number(cache.longitude)))return cache;
 try{
  const u='https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q='+encodeURIComponent(q+', Brasil');
  const r=await fetch(u,{headers:{'Accept':'application/json','Accept-Language':'pt-BR'}});
  if(!r.ok)return null;const a=await r.json(),x=Array.isArray(a)&&a[0],latitude=Number(x?.lat),longitude=Number(x?.lon);
  if(!Number.isFinite(latitude)||!Number.isFinite(longitude))return null;
  const c={latitude,longitude};gravar(chave,c);return c
 }catch(e){return null}
}
async function prepararCoordenadasDistanciaEM(){
 if(geocodeDistanciaEmAndamento||!candidatoLogadoDistanciaEM())return;
 geocodeDistanciaEmAndamento=true;
 try{
  if(!localizacaoCandidatoEM){
   const pronta=coordsCandidatoCadastroEM();
   if(pronta)localizacaoCandidatoEM=pronta;
   else{
    const d=dadosCurriculoOnlineEM?.()||{},u=candidatoLogado?.()||{},p=u.perfil||{};
    localizacaoCandidatoEM=await geocodificarEnderecoDistanciaEM([d.bairro,d.cidade||u.cidade,d.uf||p.uf])
      ||await geocodificarEnderecoDistanciaEM([d.cidade||u.cidade,d.uf||p.uf]);
   }
  }
  const todas=vagasPublicas?.()||[];
  for(const v of todas){
   if(String(v?.modalidade||'').toLowerCase().includes('remot'))continue;
   if(Number.isFinite(Number(v.latitude))&&Number.isFinite(Number(v.longitude)))continue;
   const c=await geocodificarEnderecoDistanciaEM([v.bairro,v.cidade,v.estado||v.uf])
      ||await geocodificarEnderecoDistanciaEM([v.cidade,v.estado||v.uf]);
   if(c){v.latitude=c.latitude;v.longitude=c.longitude}
  }
 }finally{geocodeDistanciaEmAndamento=false}
 atualizarDistanciaCandidatoEM();
}
function normalizarLocalEM(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase()}
function localPreferidoCandidatoEM(){
 const manual=ler('empregaMaisLocalPreferido',null);
 if(manual&&manual.cidade)return {cidade:String(manual.cidade||'').trim(),uf:String(manual.uf||'').trim().toUpperCase(),fonte:'manual'};
 if(!candidatoLogadoDistanciaEM())return null;
 const d=dadosCurriculoOnlineEM?.()||{},u=candidatoLogado?.()||{},p=u.perfil||{};
 const cidade=String(d.cidade||u.cidade||p.cidade||'').trim(),uf=String(d.uf||u.uf||p.uf||'').trim().toUpperCase();
 return cidade?{cidade,uf,fonte:'perfil'}:null
}
function distanciaNumericaVagaEM(v){
 if(!localizacaoCandidatoEM)return null;
 const d=distanciaKmEM(localizacaoCandidatoEM.latitude,localizacaoCandidatoEM.longitude,v?.latitude,v?.longitude);
 return Number.isFinite(d)?d:null
}
function distanciaVagaTextoEM(v){
 const d=distanciaNumericaVagaEM(v);if(d==null)return'';
 if(d<1)return Math.max(100,Math.round(d*1000))+' m de você';
 return (d<10?d.toFixed(1):Math.round(d))+' km de você'
}
function prioridadeLocalVagaEM(v){
 const pref=localPreferidoCandidatoEM();if(!pref)return 50;
 const vc=normalizarLocalEM(v?.cidade),vu=String(v?.estado||v?.uf||'').trim().toUpperCase();
 const pc=normalizarLocalEM(pref.cidade),pu=String(pref.uf||'').trim().toUpperCase();
 const remoto=normalizarLocalEM(v?.modalidade).includes('remot');
 if(vc&&pc&&vc===pc&&(pu?vu===pu:true))return 0;
 const dist=distanciaNumericaVagaEM(v);
 if(dist!=null&&dist<=25)return 1;
 if(dist!=null&&dist<=50)return 2;
 if(pu&&vu===pu)return 3;
 if(remoto)return 4;
 return 5
}
function atualizarBarraLocalHomeEM(){
 const bar=document.getElementById('homeLocalPreferidoEM');if(!bar)return;
 const pref=localPreferidoCandidatoEM();
 const ico='<span class="home-local-icone-em" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></svg></span>';
 if(!pref){bar.innerHTML=ico+'<div class="home-local-copy-em"><div class="home-local-titulo-em"><b>Encontre oportunidades perto de você</b><span class="home-local-status-em">LOCALIZAÇÃO</span></div><small>Entre como candidato e informe sua cidade para priorizarmos vagas da sua região.</small></div><button class="home-local-btn-em" type="button" onclick="irPara(\'login-candidato\')">Entrar como candidato</button>';return}
 const local=esc(pref.cidade)+(pref.uf?' - '+esc(pref.uf):'');
 bar.innerHTML=ico+'<div class="home-local-copy-em"><div class="home-local-titulo-em"><b>Vagas em '+local+' e região</b><span class="home-local-status-em ativo"><i></i> LOCALIZAÇÃO ATIVA</span></div><small>Estamos priorizando oportunidades próximas ao seu perfil, sem ocultar vagas de todo o Brasil.</small></div><button class="home-local-btn-em" type="button" onclick="document.getElementById(\'buscaCidade\')?.focus()">Alterar localização</button>'
}
function atualizarDistanciaCandidatoEM(){
 try{renderizarVagasPortal()}catch(e){}
 try{if(sessionStorage.getItem('vagaAtual'))renderizarVagaDetalhe()}catch(e){}
}
function solicitarLocalizacaoCandidatoEM(){
 if(!candidatoLogadoDistanciaEM())return;
 const salva=coordsCandidatoCadastroEM();if(salva){localizacaoCandidatoEM=salva;prepararCoordenadasDistanciaEM();return}
 prepararCoordenadasDistanciaEM();
 if(localizacaoCandidatoSolicitadaEM||!navigator.geolocation)return;
 localizacaoCandidatoSolicitadaEM=true;
 navigator.geolocation.getCurrentPosition(p=>{localizacaoCandidatoEM={latitude:p.coords.latitude,longitude:p.coords.longitude};prepararCoordenadasDistanciaEM()},()=>{}, {enableHighAccuracy:false,timeout:8000,maximumAge:600000});
}
function notaPublicaEmpresaEM(cnpj){
 const alvo=nums(cnpj||'');if(!alvo)return null;
 const diretas=ler('empregaMaisAvaliacoesEmpresa',[]),processos=ler('empregaMaisAvaliacoesProcessos',[]),vagas=[...ler('empregaMaisVagas',[]),...(Array.isArray(window.sbVagasCacheEM)?window.sbVagasCacheEM:[])],map=new Map();
 diretas.forEach(a=>{if(nums(a.empresaCnpj||a.cnpj||'')===alvo&&Number(a.nota)>0)map.set(String(a.candidaturaId||a.id),a)});
 processos.forEach(a=>{const v=vagas.find(x=>String(x.id)===String(a.vagaId)),vc=nums(a.empresaCnpj||a.cnpj||v?.empresaCnpj||v?.cnpj||'');if(vc===alvo&&Number(a.nota)>0&&!map.has(String(a.candidaturaId||a.id)))map.set(String(a.candidaturaId||a.id),a)});
 const av=[...map.values()];if(!av.length)return null;
 return {media:av.reduce((n,a)=>n+Number(a.nota||0),0)/av.length,total:av.length};
}
function seloNotaEmpresaEM(cnpj,verificada){
 if(!verificada)return'';const n=notaPublicaEmpresaEM(cnpj);return n?'<span class="empresa-nota-card" title="'+n.total+' avaliação'+(n.total===1?'':'ões')+'">★ '+n.media.toFixed(1).replace('.',',')+'</span>':'';
}
function candidaturaFacilEM(v){
 const tipo=normalizarTipoCandidaturaEM(v);
 const link=String(v?.candidaturaLink||v?.candidatura_link||'').trim();
 if(tipo==='portal')return !link;
 return tipo==='email'||tipo==='whatsapp';
}
function candidaturaWhatsAppAtivaEM(v){
 return normalizarTipoCandidaturaEM(v)==='whatsapp'||!!nums(v?.candidaturaWhatsapp||v?.candidatura_whatsapp||'');
}
function selosCandidaturaVagaEM(v){
 const itens=[];
 if(candidaturaFacilEM(v))itens.push('<span class="vaga-selo candidatura-facil-selo" title="Esta vaga oferece uma forma simplificada de candidatura.">CANDIDATURA FÁCIL</span>');
 if(candidaturaWhatsAppAtivaEM(v))itens.push('<span class="vaga-selo candidatura-whatsapp-selo" title="Esta empresa também recebe candidaturas pelo WhatsApp.">CANDIDATURA VIA WHATSAPP</span>');
 return itens.join('');
}
function filtroCandidaturaAtendeEM(v,filtro){
 if(!filtro)return true;
 if(filtro==='facil')return candidaturaFacilEM(v);
 if(filtro==='whatsapp')return candidaturaWhatsAppAtivaEM(v);
 return true;
}
function garantirFiltroCandidaturaEM(){
 if(document.getElementById('filtroCandidatura'))return;
 const ancora=document.getElementById('filtroPcd')||document.getElementById('filtroContrato')||document.getElementById('filtroEscolaridade');
 if(!ancora||!ancora.parentElement)return;
 const wrap=document.createElement('div');
 wrap.className='filtro-candidatura-em';
 wrap.innerHTML='<label for="filtroCandidatura">Forma de candidatura</label><select id="filtroCandidatura"><option value="">Todas</option><option value="facil">Candidate-se fácil</option><option value="whatsapp">Candidatura via WhatsApp</option></select>';
 const bloco=ancora.closest('.filtro-grupo,.filtro-item,.campo-filtro,label')||ancora.parentElement;
 bloco.insertAdjacentElement('afterend',wrap);
 wrap.querySelector('select').addEventListener('change',function(){window.paginaVagasPortalEM=1;renderizarVagasPortal();});
}
function instalarEstilosSelosCandidaturaEM(){
 if(document.getElementById('estilosSelosCandidaturaEM'))return;
 const st=document.createElement('style');st.id='estilosSelosCandidaturaEM';
 st.textContent='.vaga-selo{font-size:12px!important;font-weight:800!important;line-height:1!important;padding:7px 11px!important;min-height:29px!important;border-radius:8px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;letter-spacing:.02em!important}.candidatura-facil-selo{background:#1f7dd6!important;color:#fff!important;border:1px solid #1f7dd6!important;box-shadow:0 2px 7px rgba(31,125,214,.16)!important}.candidatura-whatsapp-selo{background:#20a764!important;color:#fff!important;border:1px solid #20a764!important;box-shadow:0 2px 7px rgba(32,167,100,.16)!important}.destaque-selo{font-size:12px!important;padding:7px 11px!important;min-height:29px!important}.urgente-selo{font-size:12px!important;padding:7px 11px!important;min-height:29px!important}.vaga-selos-linha-em{display:flex;align-items:center;flex-wrap:wrap;gap:7px}.vaga-selos-empresa,.vaga-selos-identidade,.vaga-hero-selos{align-items:center;flex-wrap:wrap;gap:7px}.vaga-candidatura-canais-em{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:7px;margin:0 0 14px}#vagaAcaoDetalhe{text-align:center!important}#vagaAcaoDetalhe>h2,#vagaAcaoDetalhe>.vaga-candidatura-explica-em,#vagaAcaoDetalhe>.vaga-candidatura-seguranca{text-align:center!important}#vagaAcaoDetalhe .vaga-candidatar-principal,#vagaAcaoDetalhe .vaga-candidatar-whatsapp-em,#vagaAcaoDetalhe .vaga-candidatar-externo-em{margin-left:auto!important;margin-right:auto!important}#vagaAcaoDetalhe .vaga-candidatura-seguranca{display:block!important;width:100%!important}.vaga-candidatura-explica-em{font-size:13px;line-height:1.45;color:#53656f;margin:0 0 12px}.vaga-candidatar-whatsapp-em{width:100%;border:1px solid #20a764;background:#20a764;color:#fff;border-radius:11px;padding:13px 14px;font:800 13px Montserrat,Arial,sans-serif;cursor:pointer;margin-top:8px}.vaga-candidatar-whatsapp-em:hover{filter:brightness(.96)}.vaga-candidatar-externo-em{width:100%;border:1px solid #c7d9e1;background:#fff;color:#194f63;border-radius:11px;padding:12px 14px;font:700 13px Montserrat,Arial,sans-serif;cursor:pointer}.filtro-candidatura-em{display:grid;gap:7px;margin-top:12px}.filtro-candidatura-em label{font:700 12px Montserrat,Arial,sans-serif;color:#445b67}.filtro-candidatura-em select{width:100%;min-height:40px;border:1px solid #ccdbe2;border-radius:9px;background:#fff;padding:0 10px;font:500 13px Montserrat,Arial,sans-serif;color:#304a57}@media(max-width:640px){.vaga-selo{font-size:11px!important;padding:6px 9px!important;min-height:27px!important}}';
 document.head.appendChild(st);
}
function acoesCandidaturaDetalheEM(v){
 const facil=candidaturaFacilEM(v),whats=candidaturaWhatsAppAtivaEM(v),tipo=normalizarTipoCandidaturaEM(v),numero=nums(v?.candidaturaWhatsapp||v?.candidatura_whatsapp||'');
 const selosHTML=selosCandidaturaVagaEM(v),selos=selosHTML?'<div class="vaga-candidatura-canais-em">'+selosHTML+'</div>':'';
 let texto='Confira a forma de candidatura disponível para esta oportunidade.';
 let botoes='';
 if(facil){
  texto='Candidate-se pelo + Empregos usando seu currículo online ou enviando seu currículo.';
  botoes+='<button class="vaga-candidatar-principal" onclick="iniciarCandidatura()"><span>Candidatar-se pelo site</span><b>→</b></button>';
 }
 if(whats&&numero){
  if(facil)texto+=' A empresa também recebe candidaturas pelo WhatsApp.';
  else texto='Esta empresa recebe candidaturas pelo WhatsApp. Você será direcionado para uma conversa com mensagem de apresentação pronta.';
  botoes+='<button class="vaga-candidatar-whatsapp-em" onclick="iniciarCandidatura()">Candidatar-se via WhatsApp →</button>';
 }
 if(tipo==='externo'){
  texto='A candidatura continua no site de recrutamento da empresa.';
  botoes='<button class="vaga-candidatar-externo-em" onclick="iniciarCandidatura()">Candidatar-se no site da empresa →</button>';
 }
 if(tipo==='email'){
  texto='Esta empresa recebe candidaturas por e-mail.';
  botoes='<button class="vaga-candidatar-principal" onclick="iniciarCandidatura()"><span>Ver instruções de candidatura</span><b>→</b></button>';
 }
 if(!botoes)botoes='<button class="vaga-candidatar-principal" onclick="iniciarCandidatura()"><span>Candidatar-se agora</span><b>→</b></button>';
 return selos+'<h2>Gostou desta vaga?</h2><p class="vaga-candidatura-explica-em">'+texto+'</p>'+botoes+'<small class="vaga-candidatura-seguranca">'+(facil?'Seu perfil será enviado à empresa após a confirmação.':'Confira as instruções antes de concluir sua candidatura.')+'</small>';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){instalarEstilosSelosCandidaturaEM();garantirFiltroCandidaturaEM();});else{instalarEstilosSelosCandidaturaEM();setTimeout(garantirFiltroCandidaturaEM,0);}
window.addEventListener('load',function(){setTimeout(garantirFiltroCandidaturaEM,200);});

/* MAISEMPREGOS-ROTACAO-VAGAS-ACESSO-V1 */
const MAIS_EMPREGOS_ORDEM_ACESSO_SEED=(Date.now()^Math.floor(Math.random()*2147483647))>>>0;
function ordemVagaPorAcessoEM(v){
 const s=String(v?.id||v?.cargo||v?.empresa||'')+'|'+MAIS_EMPREGOS_ORDEM_ACESSO_SEED;
 let h=2166136261>>>0;
 for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
 return h>>>0;
}

function cardVagaPortal(v){
 const nome=v.confidencial?'Empresa confidencial':(v.empresa||'Empresa');
 const empresas=ler('empregaMaisEmpresas');
 const nomeNorm=String(v.empresa||'').trim().toLowerCase();
 const emp=empresas.find(e=>(v.empresaId&&String(e.id||'')===String(v.empresaId))||(nums(v.empresaCnpj||v.cnpj||'')&&nums(e.cnpj||'')===nums(v.empresaCnpj||v.cnpj||''))||(nomeNorm&&[e.nome,e.nomeFantasia,e.razaoSocial].some(n=>String(n||'').trim().toLowerCase()===nomeNorm)))||{};
 const logoExplicita=v.logo||v.logoUrl||v.empresaLogo||'';
 const vagaImportadaComLogo=!v.empresaId&&!v.empresa_id&&!!logoExplicita;
 const logo=!v.confidencial&&(destaqueAtivo(v)||empresaAssinanteVaga(v)||vagaImportadaComLogo)?(logoExplicita||emp.logo||emp.logoUrl||emp.perfil?.logo||''):'';
 const verificada=!v.confidencial&&(emp.verificada===true||emp.verificacaoStatus==='aprovada');
 const temSalario=!v.salarioCombinar&&!!String(v.salario||'').trim();
 const sal=temSalario?(v.salarioMax?(v.salario+' a '+v.salarioMax):v.salario):'';
 const salarioMeta=temSalario?'<span class="vaga-salario-meta"><i class="meta-ico">R$</i>'+esc(sal)+'</span>':'';
 const desc=String(v.descricao||'').trim();
 const dataPublicacao='<small class="data-card-em">Publicada '+esc(textoDataVaga(v).replace(/^Publicada\s*/i,''))+'</small>';
 const tags=v.urgente?'<span class="vaga-selo urgente-selo">CONTRATAÇÃO URGENTE</span>':(destaqueAtivo(v)?'<span class="vaga-selo destaque-selo">EM DESTAQUE</span>':'');
 const seloEmpresa=verificada?'<span class="empresa-verificada-card" title="Empresa verificada" aria-label="Empresa verificada">✓</span>'+seloNotaEmpresaEM(v.empresaCnpj||v.cnpj,verificada):'';
 const logoHtml=logo?'<img src="'+esc(logo)+'" class="vaga-logo vaga-logo-recente" alt="Logo '+esc(nome)+'">':'';
 return '<article class="vaga-card portal-vaga portal-vaga-nova '+(logo?'com-logo ':'sem-logo ')+(destaqueAtivo(v)?'destaque ':'')+(v.urgente?'urgente':'')+'" onclick="abrirVaga(\''+v.id+'\')"><div class="vaga-card-corpo"><div class="vaga-identidade">'+logoHtml+'<div class="vaga-conteudo"><div class="vaga-empresa-linha"><span class="vaga-empresa-nome">'+esc(nome)+seloEmpresa+'</span><div class="vaga-selos vaga-selos-empresa vaga-selos-linha-em">'+tags+selosCandidaturaVagaEM(v)+'</div></div><h3>'+esc(tituloVaga(v))+'</h3><div class="vaga-meta"><span><i class="meta-ico meta-local" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="9" r="2.4"/></svg></i>'+esc(v.cidade||'')+(v.estado?' - '+esc(v.estado):'')+(distanciaVagaTextoEM(v)?'<small class="vaga-distancia-em"> · '+esc(distanciaVagaTextoEM(v))+'</small>':'')+'</span><span><i class="meta-ico meta-modalidade" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 21h8M12 18v3"/></svg></i>'+esc(v.modalidade||'')+'</span><span><i class="meta-ico meta-contrato" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></svg></i>'+esc(v.contrato||'')+'</span>'+salarioMeta+'</div><p class="vaga-resumo">'+esc(desc?desc.slice(0,240):'Confira os detalhes completos desta oportunidade.')+(desc.length>240?'…':'')+'</p></div></div></div><aside class="vaga-card-acao"><button type="button" class="vaga-ver-btn" onclick="event.stopPropagation();abrirVaga(\''+v.id+'\')">Ver vaga</button>'+dataPublicacao+'</aside></article>';
}
function cardVagaDestaqueEM(v){
 const logo=logoEmpresaVaga(v),nome=v.confidencial?'Empresa confidencial':(v.empresa||'Empresa');
 const empVer=ler('empregaMaisEmpresas').find(e=>nums(e.cnpj||'')===nums(v.empresaCnpj||v.cnpj||''))||{};
 const verificada=!v.confidencial&&(empVer.verificada===true||empVer.verificacaoStatus==='aprovada');
 const sal=v.salarioCombinar?'A combinar':(v.salarioMax?(v.salario+' a '+v.salarioMax):(v.salario||'A combinar'));
 const desc=String(v.descricao||'').trim();
 const tags=v.urgente?'<span class="vaga-selo urgente-selo">CONTRATAÇÃO URGENTE</span>':(destaqueAtivo(v)?'<span class="vaga-selo destaque-selo">EM DESTAQUE</span>':'');
 const seloEmpresa=verificada?'<span class="empresa-verificada-card" title="Empresa verificada" aria-label="Empresa verificada">✓</span>'+seloNotaEmpresaEM(v.empresaCnpj||v.cnpj,verificada):'';
 const logoHtml=logo?'<img src="'+esc(logo)+'" class="vaga-logo" alt="Logo '+esc(nome)+'">':'<div class="vaga-logo vaga-logo-fallback">'+esc(nome.charAt(0).toUpperCase())+'</div>';
 const localidade=[String(v.cidade||'').trim(),String(v.estado||'').trim()].filter(Boolean).join(' - ');
 const metaDestaque=[
  localidade?'<span class="vaga-meta-local"><i class="meta-ico">⌖</i>'+esc(localidade)+'</span>':'',
  String(v.modalidade||'').trim()?'<span class="vaga-meta-modalidade"><i class="meta-ico">▣</i>'+esc(v.modalidade)+'</span>':'',
  String(v.contrato||'').trim()?'<span class="vaga-meta-contrato"><i class="meta-ico">▤</i>'+esc(v.contrato)+'</span>':''
 ].filter(Boolean).join('');
 const dataTexto=String(textoDataVaga(v)||'').replace(/^Publicada\s*/i,'').trim();
 return '<article class="vaga-card portal-vaga portal-vaga-nova '+(destaqueAtivo(v)?'destaque ':'')+(v.urgente?'urgente':'')+'" onclick="abrirVaga(\''+v.id+'\')"><div class="vaga-destaque-selos-topo">'+tags+selosCandidaturaVagaEM(v)+'</div><div class="vaga-identidade">'+logoHtml+'<div class="vaga-identidade-copy"><h3>'+esc(tituloVaga(v))+'</h3><p>'+esc(nome)+seloEmpresa+'</p></div></div>'+(metaDestaque?'<div class="vaga-meta">'+metaDestaque+'</div>':'')+(desc?'<div class="vaga-resumo-area"><small>SOBRE A VAGA</small><p class="vaga-resumo">'+esc(desc.slice(0,120))+(desc.length>120?'…':'')+'</p></div>':'')+'<div class="vaga-card-rodape"><div class="vaga-rodape-salario"><small>Salário</small><strong class="salario-card">'+esc(sal)+'</strong></div><small class="data-card-em">Publicada '+esc(dataTexto)+'</small><button type="button" class="vaga-ver-btn" onclick="event.stopPropagation();abrirVaga(\''+v.id+'\')">Ver vaga</button></div></article>';
}
function alternarSalvarVagaCard(id){if(papelAtual()!=='candidato'){sessionStorage.setItem('retornoSalvarVaga',id);irPara('login-candidato');return}sessionStorage.setItem('vagaAtual',id);alternarSalvarVaga();setTimeout(renderizarVagasPortal,0)}
function renderizarVagasPortal(){const box=$('#listaVagasPortal');if(!box)return;if(candidatoLogadoDistanciaEM()&&!localizacaoCandidatoEM)setTimeout(solicitarLocalizacaoCandidatoEM,0);preencherAreasPortal();garantirFiltroCandidaturaEM();atualizarBarraLocalHomeEM();const q=($('#buscaVagas')?.value||'').toLowerCase(),cidade=($('#buscaCidade')?.value||'').toLowerCase(),mod=$('#buscaModalidade')?.value||'',area=$('#filtroArea')?.value||'',contrato=$('#filtroContrato')?.value||'',pcd=$('#filtroPcd')?.value||'',escolar=$('#filtroEscolaridade')?.value||'',salario=Number($('#filtroSalario')?.value||0),candidaturaFiltro=$('#filtroCandidatura')?.value||'';const todas=vagasPublicas(),lista=todas.filter(v=>((tituloVaga(v))+' '+(v.area||'')+' '+(v.empresa||'')).toLowerCase().includes(q)&&((v.cidade||'')+' '+(v.estado||'')).toLowerCase().includes(cidade)&&(!mod||v.modalidade===mod)&&(!area||v.area===area)&&(!contrato||v.contrato===contrato)&&(!pcd||String(v.pcd||'').includes(pcd))&&(!escolar||v.escolaridade===escolar)&&(!salario||valorSalario(v.salarioMax||v.salario)>=salario)&&filtroCandidaturaAtendeEM(v,candidaturaFiltro)),ordem=$('#ordenarVagas')?.value||'recentes';lista.sort((a,b)=>{
 if(ordem==='salario-maior')return valorSalario(b.salarioMax||b.salario)-valorSalario(a.salarioMax||a.salario);
 if(ordem==='salario-menor')return (valorSalario(a.salario||a.salarioMax)||Infinity)-(valorSalario(b.salario||b.salarioMax)||Infinity);
 if(ordem==='encerramento')return (a.dataEncerramento?new Date(a.dataEncerramento):new Date('2999-12-31'))-(b.dataEncerramento?new Date(b.dataEncerramento):new Date('2999-12-31'));
 if(!cidade){
  const pa=prioridadeLocalVagaEM(a),pb=prioridadeLocalVagaEM(b);if(pa!==pb)return pa-pb;
  const da=distanciaNumericaVagaEM(a),db=distanciaNumericaVagaEM(b);
  if(da!=null&&db!=null&&Math.abs(da-db)>.5)return da-db;
 }
 return ordemVagaPorAcessoEM(a)-ordemVagaPorAcessoEM(b)
});const totalPublicadas=todas.length,totalHero=document.getElementById('homeTotalVagasEM'),btnHero=document.getElementById('homeBuscarQtdEM');if(totalHero)totalHero.textContent=totalPublicadas.toLocaleString('pt-BR')+' vaga'+(totalPublicadas===1?' disponível':'s disponíveis');if(btnHero)btnHero.textContent='Pesquisar '+lista.length.toLocaleString('pt-BR')+' vaga'+(lista.length===1?'':'s');$('#qtdVagasPortal').textContent=lista.length+' vaga'+(lista.length===1?' encontrada':'s encontradas');const ativos=$('#filtrosAtivosEM');if(ativos){const filtros=[['filtroArea','Área'],['buscaModalidade','Modalidade'],['filtroContrato','Contrato'],['filtroEscolaridade','Escolaridade'],['filtroSalario','Salário'],['filtroPcd','PcD'],['filtroCandidatura','Forma de candidatura']].map(([id,rot])=>{const el=$('#'+id),val=el?.value;if(!val)return'';const texto=el.options?.[el.selectedIndex]?.text||val;return '<button type="button" onclick="removerFiltroAtivoEM(\''+id+'\')"><span>'+esc(texto)+'</span><b>×</b></button>'}).filter(Boolean);ativos.innerHTML=filtros.length?'<span>Filtros ativos:</span>'+filtros.join(''):''}const porPagina=10,totalPaginas=Math.max(1,Math.ceil(lista.length/porPagina));window.paginaVagasPortalEM=Math.min(Math.max(1,Number(window.paginaVagasPortalEM||1)),totalPaginas);const inicio=(window.paginaVagasPortalEM-1)*porPagina,paginaLista=lista.slice(inicio,inicio+porPagina);box.innerHTML=paginaLista.length?paginaLista.map(cardVagaPortal).join(''):'<div class="vagas-vazio"><strong>Nenhuma vaga encontrada</strong><span>Tente alterar os filtros.</span></div>';renderPaginacaoVagasPortalEM(lista.length,totalPaginas);if(paginaLista.length){const atual=paginaLista.find(v=>v.id===window.vagaPreviewRecenteEM)||paginaLista[0];window.vagaPreviewRecenteEM=atual.id;renderPreviewVagaRecenteEM(atual.id)}else{const p=$('#previewVagaPortal');if(p)p.innerHTML='<div class="recentes-preview-vazio"><strong>Nenhuma vaga para visualizar</strong><span>Altere os filtros para encontrar oportunidades.</span></div>'}const dest=$('#listaDestaques'),d=vagasDestaqueOrdenadasEM();if(dest){renderDestaquesEM(d);carregarDestaquesPublicosEM().then(()=>renderDestaquesEM(vagasDestaqueOrdenadasEM())).catch(()=>{});} }function renderPreviewVagaRecenteEM(id){
 const box=document.getElementById('previewVagaPortal');if(!box)return;
 const v=vagasPublicas().find(x=>x.id===id);if(!v)return;
 window.vagaPreviewRecenteEM=id;
 document.querySelectorAll('#listaVagasPortal .portal-vaga-nova').forEach(card=>card.classList.toggle('recente-selecionada',card.getAttribute('data-vaga-id')===String(id)));
 const nome=v.confidencial?'Empresa confidencial':(v.empresa||'Empresa'),sal=v.salarioCombinar?'Salário a combinar':(v.salarioMax?(v.salario+' a '+v.salarioMax):(v.salario||'Salário a combinar'));
 const cnpj=nums(v.empresaCnpj||v.cnpj||''),emp=ler('empregaMaisEmpresas').find(e=>nums(e.cnpj||'')===cnpj)||{},plano=String(emp.plano||emp.planoId||'basico').toLowerCase(),status=String(emp.planoStatus||emp.assinaturaStatus||'ativo').toLowerCase(),planoPago=plano!=='basico'&&!['cancelado','inativo','expirado'].includes(status),logo=(destaqueAtivo(v)||planoPago)?logoEmpresaVaga(v):'';
 const desc=String(v.descricao||'Confira todos os detalhes desta oportunidade na página completa da vaga.').trim();
 const previewTag=v.urgente?'<span class="vaga-selo urgente-selo rec-prev-selo">CONTRATAÇÃO URGENTE</span>':(destaqueAtivo(v)?'<span class="vaga-selo destaque-selo rec-prev-selo">EM DESTAQUE</span>':'');
 const req=String(v.requisitos||v.requisito||'').trim();
 box.innerHTML='<div class="rec-prev-head"><div class="rec-prev-company">'+(logo?'<img class="rec-prev-logo" src="'+esc(logo)+'" alt="Logo '+esc(nome)+'">':'<div class="rec-prev-logo rec-prev-logo-fallback">'+esc(nome.charAt(0).toUpperCase())+'</div>')+'<div><div class="vaga-selos vaga-selos-linha-em">'+previewTag+selosCandidaturaVagaEM(v)+'</div><h3>'+esc(tituloVaga(v))+'</h3><div class="rec-prev-empresa">'+esc(nome)+'</div></div></div><div class="rec-prev-local">⌖ '+esc(v.cidade||'')+(v.estado?' - '+esc(v.estado):'')+'</div><div class="rec-prev-chips"><span>'+esc(v.modalidade||'Não informado')+'</span><span>'+esc(v.contrato||'Não informado')+'</span></div><div class="rec-prev-actions"><button class="rec-prev-primary" type="button" onclick="abrirVaga(\''+v.id+'\')">Ver vaga completa →</button><button class="rec-prev-save" type="button" aria-label="Salvar vaga" onclick="alternarSalvarVagaCard(\''+v.id+'\');renderPreviewVagaRecenteEM(\''+v.id+'\')">'+(vagaEstaSalva(v.id)?'♥':'♡')+'</button></div></div><div class="rec-prev-body"><div class="rec-prev-section"><h4>Salário</h4><span class="rec-prev-salario">'+esc(sal)+'</span><small class="rec-prev-data">'+esc(textoDataVaga(v))+'</small></div><div class="rec-prev-section"><h4>Sobre a vaga</h4><p>'+esc(desc.slice(0,900))+(desc.length>900?'…':'')+'</p></div>'+(req?'<div class="rec-prev-section"><h4>Requisitos</h4><p>'+esc(req.slice(0,650))+(req.length>650?'…':'')+'</p></div>':'')+'<button class="rec-prev-primary" type="button" onclick="abrirVaga(\''+v.id+'\')">Ver todos os detalhes da vaga →</button></div>';
}
function selecionarVagaRecenteEM(id){
 renderPreviewVagaRecenteEM(id);
 const box=document.getElementById('listaVagasPortal');
 if(box)box.querySelectorAll('.portal-vaga-nova').forEach(card=>card.classList.toggle('recente-selecionada',card.dataset.vagaId===String(id)));
}
function valorSalario(x){if(!x)return 0;let t=String(x).replace(/[^0-9,.]/g,'');if(t.includes(','))t=t.replace(/\./g,'').replace(',','.');else if((t.match(/\./g)||[]).length>1)t=t.replace(/\./g,'');return Number(t)||0}function removerFiltroAtivoEM(id){const e=$('#'+id);if(e)e.value='';renderizarVagasPortal()}function limparFiltrosVagas(){['buscaVagas','buscaCidade'].forEach(id=>{const e=$('#'+id);if(e)e.value=''});['buscaModalidade','filtroArea','filtroContrato','filtroPcd','filtroEscolaridade','filtroSalario','filtroCandidatura','ordenarVagas'].forEach(id=>{const e=$('#'+id);if(e)e.value=''});renderizarVagasPortal()}function registrarVagaVisualizadaEM(id){
 if(!id)return;
 let hist=[];
 try{hist=JSON.parse(localStorage.getItem('empregaMaisVagasVisualizadas')||'[]')}catch(_){}
 hist=Array.isArray(hist)?hist.filter(x=>String(x.id)!==String(id)):[];
 hist.unshift({id:String(id),vistoEm:new Date().toISOString()});
 try{localStorage.setItem('empregaMaisVagasVisualizadas',JSON.stringify(hist.slice(0,20)))}catch(_){}
}
function vagasVisualizadasEM(){
 let hist=[];try{hist=JSON.parse(localStorage.getItem('empregaMaisVagasVisualizadas')||'[]')}catch(e){}
 const vagas=vagasPublicas();return (Array.isArray(hist)?hist:[]).map(h=>({h,v:vagas.find(x=>String(x.id)===String(h.id))})).filter(x=>x.v);
}
function renderVagasVisualizadasCandidatoEM(){
 const box=document.getElementById('vagasVisualizadasCandidatoEM');if(!box)return;const itens=vagasVisualizadasEM().slice(0,5);
 box.innerHTML=itens.length?itens.map(({v,h})=>'<article onclick="abrirVaga(\''+v.id+'\')"><div><strong>'+esc(tituloVaga(v))+'</strong><span>'+esc(v.confidencial?'Empresa confidencial':(v.empresa||'Empresa'))+' · '+esc(v.cidade||'Local não informado')+(v.estado?' - '+esc(v.estado):'')+'</span></div><small>Visto recentemente</small><button type="button">Ver vaga →</button></article>').join(''):'<div class="cand-vistas-vazio"><strong>Nenhuma vaga visualizada ainda</strong><span>As vagas que você abrir aparecerão automaticamente aqui.</span></div>';
}
async function abrirVaga(id){
 id=String(id||'').trim();
 if(!id)return;
 registrarVagaVisualizadaEM(id);
 sessionStorage.setItem('vagaAtual',id);

 let atual=null;
 try{atual=typeof vagaAtual==='function'?vagaAtual():null}catch(_){}
 if(!atual){
   try{
     const rows=await sbJsonEM(
       EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&id=eq.'+encodeURIComponent(id)+'&limit=1',
       {method:'GET',headers:Object.assign(sbHeadersEM(),{'Cache-Control':'no-cache','Pragma':'no-cache'}),cache:'no-store'}
     );
     const remota=Array.isArray(rows)?rows[0]:null;
     if(remota){
       const normalizada=sbMapVagaEM(remota);
       if(normalizada){
         const mapa=new Map((Array.isArray(sbVagasCacheEM)?sbVagasCacheEM:[]).filter(Boolean).map(v=>[String(v.id),v]));
         mapa.set(String(normalizada.id),normalizada);
         sbVagasCacheEM=[...mapa.values()];
       }
     }
   }catch(e){
     console.warn('+ Empregos: não foi possível carregar a vaga selecionada diretamente.',e);
   }
 }

 const encontrada=typeof vagaAtual==='function'?vagaAtual():null;
 if(!encontrada){
   console.error('+ Empregos: vaga selecionada não encontrada.',id);
   return;
 }

 irPara('vaga');
 setTimeout(solicitarLocalizacaoCandidatoEM,60);
 setTimeout(renderVagasVisualizadasCandidatoEM,80);
}
function abrirEmpresaPublica(cnpj){if(!cnpj)return;sessionStorage.setItem('empresaPublicaSelecionada',cnpj);irPara('empresa-publica')}
function vagaAtual(){
 const id=String(sessionStorage.getItem('vagaAtual')||'');
 if(!id)return null;
 const cache=Array.isArray(typeof sbVagasCacheEM!=='undefined'?sbVagasCacheEM:null)?sbVagasCacheEM:[];
 const locais=Array.isArray(ler('empregaMaisVagas'))?ler('empregaMaisVagas'):[];
 return cache.find(v=>String(v?.id)===id)||locais.find(v=>String(v?.id)===id)||null;
}
function calcularAderenciaCurriculoEM(v,d){if(!v||!d)return null;const norm=x=>cvNormaliza(String(x||'')),texto=norm([d.titulo,d.objetivo,d.resumo,d.competencias,d.idiomas,...(d.experiencias||[]).flatMap(x=>[x.cargo,x.empresa,x.atividades]),...(d.formacoes||[]).flatMap(x=>[x.curso,x.instituicao,x.status]),...(d.cursos||[]).flatMap(x=>[x.nome,x.instituicao])].join(' ')),itens=[];let ganho=0,total=0;const add=(nome,peso,status,det)=>{total+=peso;if(status==='sim')ganho+=peso;else if(status==='parcial')ganho+=peso*.5;itens.push({nome,status,det})};const cargo=norm(tituloVaga(v)),area=norm(v.area);if(cargo||area){const termos=(cargo+' '+area).split(/\s+/).filter(x=>x.length>3),hits=termos.filter(x=>texto.includes(x)).length;add('Cargo e área',24,hits>=Math.max(1,Math.ceil(termos.length*.45))?'sim':hits?'parcial':'nao',hits?'Há relação com seu histórico profissional.':'Não identificamos relação clara no currículo.')}if(v.escolaridade){const escV=norm(v.escolaridade),forms=(d.formacoes||[]).map(x=>norm(x.curso+' '+x.status)).join(' ');add('Formação / escolaridade',18,forms?(escV.includes('superior')&&forms?'sim':texto.includes(escV)?'sim':'parcial'):'info',forms?'Formação cadastrada comparada com a exigência da vaga.':'Formação não informada no currículo.')}if(v.modalidade){const mods=(d.modalidades||[]).map(norm);add('Modalidade',14,mods.length?(mods.includes(norm(v.modalidade))?'sim':'nao'):'info',mods.length?'Preferência: '+d.modalidades.join(', '):'Preferência de modalidade não informada.')}if(v.cidade){const mesma=norm(d.cidade)===norm(v.cidade),prox=!!d.cidadesProximas,mud=!!d.mudanca;add('Localização',14,mesma||prox||mud?'sim':'nao',mesma?'A vaga é na sua cidade.':prox?'Você aceita trabalhar em cidades próximas.':mud?'Você informou disponibilidade para mudança.':'Localização não compatível com as preferências informadas.')}const req=norm(v.requisitos),comp=(d.competencias||'').split(',').map(norm).filter(Boolean);if(req&&comp.length){const hits=comp.filter(x=>x.length>2&&req.includes(x));add('Competências',20,hits.length>=Math.max(1,Math.ceil(comp.length*.3))?'sim':hits.length?'parcial':'nao',hits.length?hits.length+' competência(s) do currículo aparecem nos requisitos.':'Nenhuma competência cadastrada foi identificada literalmente nos requisitos.')}if(/cnh|habilita/.test(req)){const ok=d.cnh==='sim';add('CNH',10,ok?'sim':'nao',ok?'CNH informada no currículo.':'A vaga menciona habilitação e o currículo não informa CNH.')}if(/ve[ií]culo|carro|moto/.test(req)){const ok=d.veiculo==='sim';add('Veículo',10,ok?'sim':'nao',ok?'Veículo próprio informado.':'A vaga menciona veículo e o currículo não informa veículo próprio.')}if(!total)return null;return{percentual:Math.round(ganho/total*100),itens}}
function alternarDetalhesAderenciaEM(btn){const card=btn?.closest('.aderencia-card'),pop=card?.querySelector('.aderencia-popover');if(!pop)return;const aberto=!pop.classList.contains('oculto');document.querySelectorAll('.aderencia-popover').forEach(x=>x.classList.add('oculto'));pop.classList.toggle('oculto',aberto);btn.setAttribute('aria-expanded',String(!aberto))}
document.addEventListener('click',function(e){if(!e.target.closest('.aderencia-card'))document.querySelectorAll('.aderencia-popover').forEach(x=>x.classList.add('oculto'))});
function aderenciaVagaAtualHTML(v){if(papelAtual()!=='candidato'||!candidatoPremiumAtivoEM())return'';const d=dadosCurriculoOnlineEM();if(!d||!d.nome)return'<div class="aderencia-card aderencia-sem-cv"><b>Compatibilidade com a vaga</b><p>Crie seu Currículo + Empregos para comparar seu perfil profissional com os requisitos desta oportunidade.</p><button onclick="irPara(\'curriculo\')">Criar currículo online</button></div>';const a=calcularAderenciaCurriculoEM(v,d);if(!a)return'';const cls=a.percentual>=90?'aderencia-excelente':a.percentual>=75?'aderencia-alta':a.percentual>=50?'aderencia-media':a.percentual>=30?'aderencia-baixa':'aderencia-muito-baixa',detalhes='<div class="aderencia-itens">'+a.itens.map(x=>'<div class="'+x.status+'"><i>'+(x.status==='sim'?'✓':x.status==='nao'?'×':x.status==='parcial'?'~':'?')+'</i><span><b>'+esc(x.nome)+'</b><small>'+esc(x.det)+'</small></span></div>').join('')+'</div><small class="aderencia-nota">A aderência é apenas uma referência de compatibilidade e não determina a decisão do recrutador.</small>';return'<div class="aderencia-card aderencia-resumida '+cls+'"><div class="aderencia-top"><div><span>ADERÊNCIA À VAGA</span><b>'+a.percentual+'%</b></div><p>Comparação automática entre os requisitos cadastrados pela empresa e seu Currículo + Empregos.</p></div><div class="aderencia-bar"><i style="width:'+a.percentual+'%"></i></div><button type="button" class="aderencia-detalhes-btn" aria-expanded="false" onclick="event.stopPropagation();alternarDetalhesAderenciaEM(this)">Ver detalhes da aderência <b>›</b></button><div class="aderencia-popover oculto" onclick="event.stopPropagation()"><div class="aderencia-popover-head"><div><small>ANÁLISE DE COMPATIBILIDADE</small><strong>Detalhes da aderência</strong></div><button type="button" aria-label="Fechar" onclick="this.closest(\'.aderencia-popover\').classList.add(\'oculto\')">×</button></div>'+detalhes+'</div></div>'}

function limparLinhaTextoVagaEM(linha=''){
 let s=String(linha??'').replace(/\uFFFD/g,'').replace(/\u00a0/g,' ').trim();
 // remove resíduos comuns de Markdown/emoji quebrado vindos de importações sem alterar o conteúdo útil
 s=s.replace(/\*{1,3}([^*\n]+?)\*{1,3}/g,'$1');
 s=s.replace(/^\*{1,3}\s*/,'').replace(/\s*\*{1,3}$/,'');
 s=s.replace(/^(?:\?{2,8}|¿{1,8}|!{2,})\s*/,'');
 s=s.replace(/\s+(?:\?{2,8}|¿{2,8})\s*$/,'');
 try{s=s.replace(/^(?:[\p{Extended_Pictographic}\u2600-\u27BF]\uFE0F?\s*)+/gu,'')}catch(_){}
 s=s.replace(/^[\s·•▪◦]+/,'').replace(/[ \t]{2,}/g,' ').trim();
 return s
}
function tituloBlocoTextoVagaEM(linha=''){
 const s=limparLinhaTextoVagaEM(linha).replace(/:$/,'').trim();
 const mapa={
  'responsabilidades':'Responsabilidades',
  'responsabilidades e atribuições':'Responsabilidades e atribuições',
  'principais responsabilidades':'Principais responsabilidades',
  'atividades':'Atividades',
  'principais atividades':'Principais atividades',
  'principais funções':'Principais funções',
  'principais funcoes':'Principais funções',
  'atribuições':'Atribuições',
  'atribuicoes':'Atribuições',
  'requisitos':'Requisitos',
  'requisitos e qualificações':'Requisitos e qualificações',
  'requisitos e qualificacoes':'Requisitos e qualificações',
  'qualificações':'Qualificações',
  'qualificacoes':'Qualificações',
  'o que buscamos':'O que buscamos',
  'benefícios':'Benefícios',
  'beneficios':'Benefícios',
  'oferecemos':'Oferecemos',
  'o que oferecemos':'O que oferecemos',
  'remuneração e benefícios':'Remuneração e benefícios',
  'remuneracao e beneficios':'Remuneração e benefícios',
  'salário e benefícios':'Salário e benefícios',
  'salario e beneficios':'Salário e benefícios',
  'horário':'Horário',
  'horario':'Horário',
  'horário de trabalho':'Horário de trabalho',
  'horario de trabalho':'Horário de trabalho',
  'jornada':'Jornada',
  'jornada de trabalho':'Jornada de trabalho',
  'escala':'Escala',
  'local':'Local',
  'local de trabalho':'Local de trabalho',
  'contrato':'Contrato',
  'salário':'Salário',
  'salario':'Salário'
 };
 return mapa[s.toLocaleLowerCase('pt-BR')]||''
}
function normalizarTextoVagaEM(texto=''){
 return String(texto??'')
  .replace(/\r/g,'')
  .replace(/\u00a0/g,' ')
  .replace(/<br\s*\/?\s*>/gi,'\n')
  .replace(/[ \t]+\n/g,'\n')
  .replace(/\n[ \t]+/g,'\n')
  .replace(/[ \t]{2,}/g,' ')
  .replace(/\n{3,}/g,'\n\n')
  .trim()
}
function formatarTextoVagaEM(texto=''){
 const base=normalizarTextoVagaEM(texto);
 if(!base)return '<p>Não informado</p>';
 const linhas=base.split('\n');
 let html='',listaAberta=false;
 const fecharLista=()=>{if(listaAberta){html+='</div>';listaAberta=false}};
 for(const original of linhas){
  if(!String(original).trim()){fecharLista();continue}
  const eraItem=/^\s*(?:[-–—•▪◦]+|\*{1,2})\s*/.test(original);
  let linha=limparLinhaTextoVagaEM(original.replace(/^\s*(?:[-–—•▪◦]+|\*{1,2})\s*/, ''));
  if(!linha)continue;
  const titulo=tituloBlocoTextoVagaEM(linha);
  if(titulo){
   fecharLista();
   html+='<h3 class="vaga-texto-subtitulo">'+esc(titulo)+'</h3>';
   continue
  }
  if(eraItem){
   if(!listaAberta){html+='<div class="vaga-texto-lista">';listaAberta=true}
   html+='<div class="vaga-texto-item">'+esc(linha)+'</div>';
   continue
  }
  fecharLista();
  html+='<p>'+esc(linha)+'</p>'
 }
 fecharLista();
 return html||'<p>Não informado</p>'
}
function descricaoPrincipalVagaEM(texto=''){
 const base=normalizarTextoVagaEM(texto);
 if(!base)return '';
 const linhas=base.split('\n');
 const manter=[];
 const cortarEm=new Set([
  'Requisitos','Requisitos e qualificações','Qualificações','O que buscamos',
  'Benefícios','Oferecemos','O que oferecemos','Remuneração e benefícios','Salário e benefícios',
  'Horário','Horário de trabalho','Jornada','Jornada de trabalho','Escala','Contrato','Salário'
 ]);
 for(const original of linhas){
  const limpa=limparLinhaTextoVagaEM(String(original).replace(/^\s*(?:[-–—•▪◦]+|\*{1,2})\s*/, ''));
  const titulo=tituloBlocoTextoVagaEM(limpa);
  if(titulo&&cortarEm.has(titulo))break;
  manter.push(original);
 }
 return normalizarTextoVagaEM(manter.join('\n'))
}
function formatarDescricaoPrincipalVagaEM(texto=''){
 const principal=descricaoPrincipalVagaEM(texto);
 return formatarTextoVagaEM(principal||texto)
}
function limparBeneficioVagaEM(texto=''){
 return limparLinhaTextoVagaEM(String(texto??'').replace(/^\s*[-–—•▪◦]+\s*/,'')).replace(/[;,.]\s*$/,'').trim()
}
function beneficioRealVagaEM(texto=''){
 const s=limparBeneficioVagaEM(texto);
 if(!s)return false;
 const n=s.toLocaleLowerCase('pt-BR');
 if(/^(sal[aá]rio|remunera[cç][aã]o|perfil|perfil desejado|requisitos?|atividades?|responsabilidades?|jornada|hor[aá]rio|escala|contrato|vaga tempor[aá]ria|vaga efetiva|profissional|experi[eê]ncia|escolaridade|local de trabalho|localiza[cç][aã]o)\b/.test(n))return false;
 if(/\b(tempor[aá]ri[oa]|perfil desejado|senso de urg[eê]ncia|foco em resultados|ambiente din[aâ]mico)\b/.test(n)&&!/\b(vale|seguro|plano|assist[eê]ncia|aux[ií]lio|benef[ií]cio|refei[cç][aã]o|alimenta[cç][aã]o|transporte|fretado|estacionamento|plr|previd[eê]ncia|day off|celular|bonifica[cç][aã]o|premia[cç][aã]o|comiss[aã]o|combust[ií]vel|cesta|conv[eê]nio|creche|wellhub|gympass|totalpass)\b/.test(n))return false;
 return /\b(vale(?:[- ]?(?:transporte|refei[cç][aã]o|alimenta[cç][aã]o|combust[ií]vel))?|refei[cç][aã]o|alimenta[cç][aã]o|seguro de vida|plano (?:de )?(?:sa[uú]de|m[eé]dico|odontol[oó]gico)|assist[eê]ncia (?:m[eé]dica|odontol[oó]gica)|odontol[oó]gica|m[eé]dica|cesta b[aá]sica|fretado|estacionamento|plr|participa[cç][aã]o nos lucros|previd[eê]ncia privada|day off|celular corporativo|aux[ií]lio|ajuda de custo|bonifica[cç][aã]o|premia[cç][aã]o|comiss[aã]o|conv[eê]nio|creche|wellhub|gympass|totalpass|benef[ií]cio)\b/.test(n)
}
function resumirBeneficioVagaEM(texto=''){
 let s=limparBeneficioVagaEM(texto);
 if(!beneficioRealVagaEM(s))return '';
 if(s.length<=72)return s;
 const partes=s.split(/[:–—]/);
 if(partes.length>1&&beneficioRealVagaEM(partes[0]))return partes[0].trim();
 const corte=s.search(/[,;(]/);
 if(corte>18)return s.slice(0,corte).trim();
 return s.slice(0,72).trim().replace(/[\s,;:.-]+$/,'')
}
function beneficiosVagaHTML_EM(v){
 const origem=Array.isArray(v?.beneficiosLista)&&v.beneficiosLista.length
  ?v.beneficiosLista
  :String(v?.beneficios||'').split(/\n|\||;/);
 const itens=[...new Set(origem.map(resumirBeneficioVagaEM).filter(Boolean))];
 if(itens.length)return itens.map(x=>'<span class="beneficio-tag">'+esc(x)+'</span>').join('');
 const bruto=normalizarTextoVagaEM(v?.beneficios||'');
 return bruto?'<div class="vaga-texto vaga-texto-formatada">'+formatarTextoVagaEM(bruto)+'</div>':'<span class="beneficio-tag">Não informado</span>'
}
function garantirEstiloTextoVagaEM(){
 if(document.getElementById('estiloTextoVagaEM'))return;
 const style=document.createElement('style');
 style.id='estiloTextoVagaEM';
 style.textContent=
 '#vagaConteudoDetalhe{font-family:Montserrat,Arial,sans-serif;color:#334155}'+
 '.vaga-resumo,.rec-prev-section p,.review-texto p,#modalAdminVaga section p,.preview-vaga p,.detalhe-vaga p{font-family:Montserrat,Arial,sans-serif;font-size:15px;font-weight:400;line-height:1.5;color:#334155;letter-spacing:0}'+
 '#vagaConteudoDetalhe section{margin:0;padding:20px 0;border-top:1px solid #e8edf3}'+
 '#vagaConteudoDetalhe section:first-of-type{border-top:0}'+
 '#vagaConteudoDetalhe section h2{font:700 18.5px/1.3 Montserrat,Arial,sans-serif;letter-spacing:-.15px;color:#12385f;margin:0 0 10px;padding:0}'+
 '.vaga-texto.vaga-texto-formatada{font:400 15.5px/1.58 Montserrat,Arial,sans-serif;color:#334155;letter-spacing:0;margin:0;max-width:none}'+
 '.vaga-texto.vaga-texto-formatada p{font:400 15.5px/1.58 Montserrat,Arial,sans-serif;color:#334155;margin:0 0 12px;padding:0}'+
 '.vaga-texto.vaga-texto-formatada .vaga-texto-subtitulo{font:700 16.5px/1.4 Montserrat,Arial,sans-serif;color:#163b67;margin:24px 0 12px;padding:0}'+
 '.vaga-texto.vaga-texto-formatada .vaga-texto-subtitulo:first-child{margin-top:0}'+
 '.vaga-texto.vaga-texto-formatada .vaga-texto-lista{display:grid;gap:7px;margin:0 0 18px;padding:0}'+
 '.vaga-texto.vaga-texto-formatada .vaga-texto-item{font:400 15.5px/1.55 Montserrat,Arial,sans-serif;color:#334155;margin:0;padding:0}'+
 '.vaga-texto.vaga-texto-formatada .vaga-texto-item:before{content:none}'+
 '#vaga-sobre,#vaga-requisitos,#vaga-beneficios{scroll-margin-top:100px}'+
 '#vaga-beneficios .beneficios-tags{display:flex;flex-wrap:wrap;align-items:flex-start;gap:6px;margin:0;padding:0}'+
 '#vaga-beneficios .beneficio-tag{font:600 13px/1.35 Montserrat,Arial,sans-serif;color:#235d5b;max-width:100%;white-space:normal;overflow-wrap:anywhere;padding:7px 10px;border-radius:8px}'+
 '.vaga-complementares{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;min-width:0}'+
 '.vaga-complementares span{display:block;min-width:0;max-width:100%;overflow:hidden;overflow-wrap:anywhere;word-break:normal;white-space:normal;font:400 14px/1.4 Montserrat,Arial,sans-serif;color:#334155;padding:11px 12px}'+
 '.vaga-complementares span b{display:block;font:700 10px/1.2 Montserrat,Arial,sans-serif;letter-spacing:.4px;text-transform:uppercase;color:#526579;margin:0 0 5px}'+
 '@media(max-width:700px){.vaga-resumo,.rec-prev-section p,.review-texto p,#modalAdminVaga section p,.preview-vaga p,.detalhe-vaga p{font-size:14.5px;line-height:1.55}#vagaConteudoDetalhe section{padding:17px 0}#vagaConteudoDetalhe section h2{font-size:17.5px;margin-bottom:10px}.vaga-texto.vaga-texto-formatada,.vaga-texto.vaga-texto-formatada p,.vaga-texto.vaga-texto-formatada .vaga-texto-item{font-size:15px;line-height:1.55}.vaga-texto.vaga-texto-formatada p{margin-bottom:11px}.vaga-texto.vaga-texto-formatada .vaga-texto-subtitulo{font-size:16px;margin-top:21px;margin-bottom:11px}.vaga-texto.vaga-texto-formatada .vaga-texto-lista{gap:6px;margin-bottom:16px}.vaga-complementares{grid-template-columns:1fr}.vaga-complementares span{font-size:13.5px}}';
 document.head.appendChild(style)
}

function renderizarVagaDetalhe(){garantirEstiloTextoVagaEM();const v=vagaAtual();if(!v||v.status!=='aprovada'||!vagaDentroPrazo(v)){irPara('home');return}conectaRegistrarVisualizacaoEM(v);const totalCandidaturasVaga=candidaturas().filter(c=>String(c.vagaId)===String(v.id)).length;const emp=ler('empregaMaisEmpresas').find(e=>nums(e.cnpj||'')===nums(v.empresaCnpj||''))||{},logo=!v.confidencial?logoEmpresaVaga(v):'',nome=v.confidencial?'Empresa confidencial':(v.empresa||'Empresa'),verificada=!v.confidencial&&(emp.verificada||emp.verificacaoStatus==='aprovada'),sal=v.salarioCombinar?'Salário a combinar':(v.salarioMax?(v.salario+' a '+v.salarioMax):(v.salario||'Salário a combinar')),beneficios=beneficiosVagaHTML_EM(v),empresaClick=!v.confidencial&&v.empresaCnpj?' onclick="abrirEmpresaPublica(\''+v.empresaCnpj+'\')"':'';const validade=dataFimPadraoVagaEM(v),diasRestantes=Math.max(0,Math.ceil((validade-new Date())/86400000));const hero=$('#vagaHeroDetalhe');if(hero){hero.classList.toggle('vaga-destaque-hero',destaqueAtivo(v));hero.classList.toggle('vaga-normal-hero',!destaqueAtivo(v));hero.innerHTML='<div class="vaga-hero-identidade vaga-hero-op2 vaga-hero-ref">'+(logo?'<img src="'+esc(logo)+'" class="vaga-hero-logo" alt="Logo '+esc(nome)+'">':'<div class="vaga-hero-logo vaga-logo-fallback">'+esc(nome.charAt(0).toUpperCase())+'</div>')+'<div class="vaga-hero-texto"><h1>'+esc(tituloVaga(v))+'</h1><div class="vaga-hero-empresa-linha"><button class="vaga-hero-empresa"'+empresaClick+'>'+esc(nome)+'</button>'+(verificada?seloNotaEmpresaEM(v.empresaCnpj||v.cnpj,verificada)+'<span class="em-status-info em-status-verificada" tabindex="0"><b class="em-verificado-check">✓</b><span class="em-verificado-label">Empresa verificada</span><span class="em-status-pop" role="tooltip"><span class="em-status-pop-icon">✓</span><div><strong>Empresa verificada</strong><p>Esta empresa teve seus dados de cadastro analisados pelo + Empregos. O selo ajuda a identificar empresas com informações verificadas na plataforma.</p><small>O selo não representa garantia sobre a contratação ou o processo seletivo.</small></div></span></span>':v.confidencial?'<span class="em-status-info em-status-confidencial" tabindex="0"><b class="em-confidencial-check">◈</b><span class="em-confidencial-label">Processo confidencial</span><span class="em-status-pop" role="tooltip"><span class="em-status-pop-icon">◈</span><div><strong>Processo seletivo confidencial</strong><p>A empresa optou por não divulgar sua identidade nesta etapa. Isso pode ocorrer em contratações estratégicas, substituições internas ou processos que exigem maior discrição.</p><small>As informações da vaga continuam disponíveis para você avaliar a oportunidade antes de se candidatar.</small></div></span></span>':'')+'</div><div class="vaga-hero-selos">'+(v.area?'<span class="hero-area"><i>▥</i> '+esc(v.area)+'</span>':'')+(destaqueAtivo(v)?'<span class="hero-destaque"><i class="selo-icone">★</i> Vaga em destaque</span>':'')+(v.urgente?'<span class="hero-urgente"><i class="selo-icone">ϟ</i> Contratação urgente</span>':'')+(v.senior50?'<span class="hero-50mais"><i class="selo-icone">♙</i> Vaga para 50+</span>':'')+selosCandidaturaVagaEM(v)+'</div></div></div><div class="vaga-info-grid vaga-info-ref"><div><i class="info-svg"><svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></i><strong>'+esc(localizacaoPublicaVagaEM(v))+'</strong><small>Localização</small>'+(distanciaVagaTextoEM(v)?'<span class="vaga-distancia-detalhe">⌖ '+esc(distanciaVagaTextoEM(v))+'</span>':'')+'</div><div><i class="info-svg"><svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></svg></i><strong>'+esc(v.contrato||'Não informado')+'</strong><small>Contrato</small></div><div><i class="info-svg"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 21h8M12 18v3"/></svg></i><strong>'+esc(v.modalidade||'Não informado')+'</strong><small>Modalidade</small></div><div><i class="info-svg"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M16 10h5v5h-5a2.5 2.5 0 0 1 0-5Z"/></svg></i><strong>'+esc(sal)+'</strong><small>Salário</small></div></div>';}const conteudo=$('#vagaConteudoDetalhe');if(conteudo)conteudo.innerHTML='<nav class="vaga-tabs"><a href="#vaga-sobre">▤ Sobre a vaga</a><a href="#vaga-requisitos">▣ Requisitos</a><a href="#vaga-beneficios">♡ Benefícios</a><a href="#vaga-empresa-info">▥ Sobre a empresa</a><span class="vaga-tabs-publicacao">◷ '+esc(textoDataVaga(v))+(textoPrazoVaga(v)?' · '+esc(textoPrazoVaga(v)):'')+'</span></nav><section id="vaga-sobre"><h2>Descrição da vaga</h2><div class="vaga-texto vaga-texto-formatada">'+formatarDescricaoPrincipalVagaEM(v.descricao||'Não informado')+'</div></section><section id="vaga-requisitos"><h2>Requisitos</h2><div class="vaga-texto vaga-texto-formatada">'+formatarTextoVagaEM(v.requisitos||'Não informado')+'</div></section><section id="vaga-beneficios"><h2>Benefícios</h2><div class="beneficios-tags">'+beneficios+'</div></section><section><h2>Informações complementares</h2><div class="vaga-complementares"><span><b>Escolaridade</b>'+esc(v.escolaridade||'Não informado')+'</span><span><b>Experiência</b>'+esc(v.experiencia||'Não informado')+'</span><span><b>Jornada</b>'+esc(v.jornada||'Não informado')+'</span><span><b>PcD</b>'+esc(v.pcd||'Não informado')+'</span></div></section>';const acao=$('#vagaAcaoDetalhe');if(acao)acao.innerHTML=aderenciaVagaAtualHTML(v)+acoesCandidaturaDetalheEM(v)+'<button class="denunciar-vaga" onclick="denunciarVaga()">⚑ Denunciar vaga</button>';const side=$('#vagaEmpresaSide');if(side)side.innerHTML=v.confidencial?'':('<div class="empresa-premium-faixa">♛ Empresa em destaque</div><h2 id="vaga-empresa-info">Sobre a empresa</h2><div class="empresa-premium-logo">'+(logo?'<img src="'+esc(logo)+'" alt="'+esc(nome)+'">':'<div class="empresa-side-logo vaga-logo-fallback">'+esc(nome.charAt(0).toUpperCase())+'</div>')+'</div><strong class="empresa-premium-nome">'+esc(nome)+(verificada?' <b class="check-verificado">✓</b>':'')+'</strong><div class="empresa-premium-meta">'+(emp.setor?'<span>▣ '+esc(emp.setor)+'</span>':'')+(v.cidade?'<span>⌖ '+esc(v.cidade)+(v.estado?' - '+esc(v.estado):'')+'</span>':'')+(verificada?'<span>✓ Empresa verificada</span>':'')+'</div><p class="empresa-premium-sobre" id="empresaPremiumSobre">'+esc(emp.sobre||'Conheça mais sobre esta empresa e suas oportunidades.')+'</p><button type="button" class="empresa-premium-vermais" onclick="var p=document.getElementById(\'empresaPremiumSobre\');var a=p.classList.toggle(\'aberto\');this.textContent=a?\'Ver menos⌃\':\'Ver mais⌄\'">Ver mais⌄</button>'+(v.empresaCnpj?'<button class="empresa-premium-perfil" onclick="abrirEmpresaPublica(\''+v.empresaCnpj+'\')">Ver perfil da empresa →</button>':''));
const candidatasRelacionadas=vagasPublicas().filter(x=>x.id!==v.id),rel=[...candidatasRelacionadas.filter(x=>x.area===v.area||x.cidade===v.cidade),...candidatasRelacionadas.filter(x=>x.area!==v.area&&x.cidade!==v.cidade)].filter((x,i,a)=>a.findIndex(y=>String(y.id)===String(x.id))===i).slice(0,10),box=$('#vagasRelacionadas');if(box){box.innerHTML=rel.length?'<button class="rel-nav rel-prev" type="button" onclick="moverRelacionadasEM(-1)" aria-label="Vagas anteriores">‹</button><div class="rel-track">'+rel.map(cardVagaRelacionadaEM).join('')+'</div><button class="rel-nav rel-next" type="button" onclick="moverRelacionadasEM(1)" aria-label="Próximas vagas">›</button>':'<div class="vagas-vazio">Nenhuma vaga relacionada no momento.</div>'}}function cardVagaRelacionadaEM(v){
 const nome=v.confidencial?'Empresa confidencial':(v.empresa||'Empresa'),sal=v.salarioCombinar?'A combinar':(v.salarioMax?(v.salario+' a '+v.salarioMax):(v.salario||'A combinar')),emp=ler('empregaMaisEmpresas').find(e=>nums(e.cnpj||'')===nums(v.empresaCnpj||v.cnpj||''))||{},ver=!v.confidencial&&(emp.verificada===true||emp.verificacaoStatus==='aprovada'),logo=!v.confidencial?logoEmpresaVaga(v):'',urg=!!v.urgente;
 return '<article class="rel-card '+(urg?'rel-urgente ':'')+(v.destaque?'rel-featured':'')+'" onclick="abrirVaga(\''+v.id+'\')"><div class="rel-top">'+(urg?'<span class="rel-urgente-selo">CONTRATAÇÃO URGENTE</span>':v.destaque?'<span class="rel-destaque">EM DESTAQUE</span>':'<span></span>')+'<span class="rel-save">♡</span></div><div class="rel-identidade">'+(logo?'<img src="'+esc(logo)+'" alt="">':'<div class="rel-logo-fallback">'+esc((nome||'E').charAt(0).toUpperCase())+'</div>')+'<div><h3>'+esc(tituloVaga(v))+'</h3><p class="rel-empresa">'+esc(nome)+(ver&&!v.confidencial?' <b>✓</b>':'')+'</p></div></div><div class="rel-meta"><span>⌖ '+esc(v.cidade||'Não informado')+(v.estado?' - '+esc(v.estado):'')+'</span><span>▣ '+esc(v.contrato||'Não informado')+'</span><span>▱ '+esc(v.modalidade||'Não informado')+'</span><span>◇ '+esc(v.area||'Área não informada')+'</span></div><div class="rel-footer"><div><small>SALÁRIO</small><strong>'+esc(sal)+'</strong></div><button type="button">Ver vaga <b>→</b></button></div></article>'
}function moverRelacionadasEM(dir){const t=document.querySelector('#vagasRelacionadas .rel-track');if(!t)return;const card=t.querySelector('.rel-card'),gap=14;t.scrollBy({left:dir*((card?card.getBoundingClientRect().width:320)+gap),behavior:'smooth'})}function denunciarVaga(){const v=vagaAtual();if(!v)return;const m=$('#modalDenuncia');if(!m)return;$('#denunciaMotivo').value='';$('#denunciaDetalhes').value='';msg('#msgDenuncia','');m.classList.remove('oculto')}
function fecharDenuncia(){$('#modalDenuncia')?.classList.add('oculto')}
function enviarDenuncia(e){e.preventDefault();const v=vagaAtual();if(!v)return;const motivo=$('#denunciaMotivo')?.value||'',detalhes=$('#denunciaDetalhes')?.value.trim()||'';if(!motivo)return msg('#msgDenuncia','Selecione o motivo da denúncia.');const a=ler('empregaMaisDenuncias');a.unshift({id:'den_'+Date.now(),vagaId:v.id,vaga:tituloVaga(v),motivo,detalhes,status:'pendente',criadoEm:new Date().toISOString()});gravar('empregaMaisDenuncias',a);msg('#msgDenuncia','Denúncia enviada para análise. Obrigado por ajudar a manter o portal seguro.',true);setTimeout(fecharDenuncia,900)}
function iniciarCandidatura(){
 const v=vagaAtual();
 if(!v||v.status!=='aprovada'||!vagaDentroPrazo(v)){alert('Esta vaga não está mais recebendo candidaturas.');irPara('home');return}
 conectaRegistrarMetricaEM('clique_candidatar',v);
 sessionStorage.setItem('vagaSelecionada',String(v.id));
 sessionStorage.setItem('vagaAtual',String(v.id));
 if(papelAtual()!=='candidato'){
   sessionStorage.setItem('retornoCandidatura','1');
   irPara('login-candidato');
   return;
 }
 irPara('candidatar');
}
function voltarVagaAtual(){irPara('vaga')}
function normalizarTipoCandidaturaEM(v){const t=String(v?.candidaturaTipo||v?.candidatura_tipo||'portal').toLowerCase();if(t.includes('whats'))return'whatsapp';if(t.includes('link')||t.includes('extern')||t.includes('site'))return'externo';if(t.includes('email')||t.includes('e-mail'))return'email';return'portal'}
function restaurarCandidaturaInternaEM(){const form=document.getElementById('formCandidatura');if(!form)return;form.classList.remove('cand-fluxo-externo');form.querySelectorAll('.cand-apply-person,.candidatura-resumo,.cand-apply-section,.cand-apply-curriculos,.cand-apply-checklist,.cand-aderencia-orientacao,.cand-apply-message,.cand-apply-privacy').forEach(x=>x.style.removeProperty('display'));const ext=document.getElementById('candFluxoExternoEM');if(ext)ext.remove();const submit=form.querySelector('button[type="submit"]');if(submit){submit.style.display='';submit.textContent='Enviar candidatura →'}const h=document.querySelector('#pagina-candidatar .cand-apply-head-copy span');if(h)h.textContent='ENVIAR CANDIDATURA';const p=document.querySelector('#pagina-candidatar .cand-apply-head-copy p');if(p)p.textContent='Revise as informações antes de enviar sua candidatura.'}
function renderizarCandidaturaExternaEM(v,tipo){
 const form=document.getElementById('formCandidatura');if(!form)return;restaurarCandidaturaInternaEM();form.classList.add('cand-fluxo-externo');form.querySelectorAll('.cand-apply-person,.candidatura-resumo,.cand-apply-section,.cand-apply-curriculos,.cand-apply-checklist,.cand-aderencia-orientacao,.cand-apply-message,.cand-apply-privacy').forEach(x=>x.style.setProperty('display','none','important'));const ader=document.getElementById('candAderenciaTopo');if(ader)ader.style.display='none';const perguntas=document.getElementById('candPerguntasEliminatoriasEM');if(perguntas)perguntas.hidden=true;
 const nome=candidatoLogado()?.nome||sessionStorage.getItem('candidatoNome')||'Candidato',cargo=tituloVaga(v),empresa=v.confidencial?'a empresa':(v.empresa||'a empresa');
 const box=document.createElement('section');box.id='candFluxoExternoEM';box.className='cand-fluxo-externo-box';
 if(tipo==='whatsapp'){const numero=nums(v.candidaturaWhatsapp||v.candidatura_whatsapp||'');const mensagem='Olá! Meu nome é '+nome+'. Encontrei a vaga de '+cargo+' da '+empresa+' no + Empregos e gostaria de me candidatar. Estou entrando em contato pelo + Empregos para demonstrar meu interesse na oportunidade. Segue meu currículo para avaliação. Obrigado!';box.innerHTML='<div class="cand-ext-icon whatsapp">WA</div><span>CANDIDATURA VIA WHATSAPP</span><h3>Esta empresa recebe currículos pelo WhatsApp.</h3><p>Ao continuar, você será direcionado para uma conversa com o recrutador. A mensagem de apresentação já estará preenchida; anexe seu currículo no WhatsApp antes de enviar.</p><div class="cand-ext-message"><small>MENSAGEM PRONTA</small><p>'+esc(mensagem)+'</p></div><button type="button" class="cand-ext-primary whatsapp" '+(numero?'onclick="abrirWhatsAppCandidaturaEM(\''+numero+'\')"':'disabled')+'>Continuar pelo WhatsApp →</button>'+(numero?'':'<em>O WhatsApp desta vaga não foi informado pela empresa.</em>');form.insertBefore(box,form.querySelector('.form-msg'));const h=document.querySelector('#pagina-candidatar .cand-apply-head-copy span');if(h)h.textContent='CANDIDATURA VIA WHATSAPP';}
 else if(tipo==='email'){const email=String(v.candidaturaEmail||v.candidatura_email||'').trim();box.innerHTML='<div class="cand-ext-icon">✉</div><span>CANDIDATURA VIA E-MAIL</span><h3>Esta empresa recebe candidaturas por e-mail.</h3><p>Ao continuar, seu aplicativo de e-mail será aberto com o destinatário preenchido.</p><button type="button" class="cand-ext-primary" '+(email?'onclick="abrirEmailCandidaturaEM(\''+esc(email)+'\')"':'disabled')+'>Continuar por e-mail →</button>'+(email?'':'<em>O e-mail de candidatura desta vaga não foi informado.</em>');form.insertBefore(box,form.querySelector('.form-msg'));const h=document.querySelector('#pagina-candidatar .cand-apply-head-copy span');if(h)h.textContent='CANDIDATURA VIA E-MAIL';}
 else {const link=String(v.candidaturaLink||v.candidatura_link||'').trim();box.innerHTML='<div class="cand-ext-icon">↗</div><span>CANDIDATURA NO SITE DA EMPRESA</span><h3>O processo continua no portal da empresa.</h3><p>Ao continuar, você será direcionado para o site de recrutamento da empresa para preencher seus dados e concluir a candidatura.</p><div class="cand-ext-note"><b>Você está saindo do + Empregos</b><small>A conclusão da candidatura acontecerá no site da empresa. O + Empregos não consegue confirmar o envio após o redirecionamento.</small></div><button type="button" class="cand-ext-primary" '+(link?'onclick="abrirPortalCandidaturaEM()"':'disabled')+'>Continuar para o site da empresa →</button>'+(link?'':'<em>O link de candidatura desta vaga não foi informado pela empresa.</em>');form.insertBefore(box,form.querySelector('.form-msg'));const h=document.querySelector('#pagina-candidatar .cand-apply-head-copy span');if(h)h.textContent='CANDIDATURA NO SITE DA EMPRESA';}
 const t=document.getElementById('candidaturaTitulo');if(t)t.textContent=cargo+' · '+empresa;const p=document.querySelector('#pagina-candidatar .cand-apply-head-copy p');if(p)p.textContent=tipo==='whatsapp'?'Envie seu currículo diretamente ao recrutador pelo WhatsApp.':'Continue a candidatura no ambiente de recrutamento da empresa.';const submit=form.querySelector('button[type="submit"]');if(submit)submit.style.display='none'
}
function abrirWhatsAppCandidaturaEM(numero){if(papelAtual()!=='candidato'){iniciarCandidatura();return}const v=vagaAtual();conectaRegistrarMetricaEM('envio_externo',v);const nome=candidatoLogado()?.nome||sessionStorage.getItem('candidatoNome')||'Candidato',cargo=tituloVaga(v),empresa=v?.confidencial?'a empresa':(v?.empresa||'a empresa'),mensagem='Olá! Meu nome é '+nome+'. Encontrei a vaga de '+cargo+' da '+empresa+' no + Empregos e gostaria de me candidatar. Estou entrando em contato pelo + Empregos para demonstrar meu interesse na oportunidade. Segue meu currículo para avaliação. Obrigado!';window.open('https://wa.me/'+nums(numero)+'?text='+encodeURIComponent(mensagem),'_blank','noopener')}
function abrirEmailCandidaturaEM(email){const v=vagaAtual();conectaRegistrarMetricaEM('envio_externo',v);const assunto='Candidatura - '+tituloVaga(v);location.href='mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent(assunto)}
window.abrirEmailCandidaturaEM=abrirEmailCandidaturaEM;
function abrirPortalCandidaturaEM(){if(papelAtual()!=='candidato'){iniciarCandidatura();return}const v=vagaAtual(),link=String(v?.candidaturaLink||v?.candidatura_link||'').trim();if(!link)return;let url=link;if(!/^https?:\/\//i.test(url))url='https://'+url;try{const u=new URL(url);if(!['http:','https:'].includes(u.protocol))return;conectaRegistrarMetricaEM('envio_externo',v);window.open(u.href,'_blank','noopener')}catch(e){alert('O link de candidatura informado pela empresa é inválido.')}}
function prepararCandidatura(){const v=vagaAtual();if(!v||v.status!=='aprovada'||!vagaDentroPrazo(v)){irPara('home');return}const tipo=normalizarTipoCandidaturaEM(v);if(tipo!=='portal'){renderizarCandidaturaExternaEM(v,tipo);return}restaurarCandidaturaInternaEM();const c=candidatoLogado()||{},p=c.perfil||{},curr=ler(chaveCurriculo(),null),online=dadosCurriculoOnlineEM(),itens=itensProgressoCurriculoEM(online),pct=Math.round(itens.filter(x=>x.ok).length/itens.length*100),temOnline=itens.some(x=>x.ok);$('#candidaturaTitulo').textContent=tituloVaga(v)+' · '+(v.confidencial?'Empresa confidencial':v.empresa||'');$('#candNome').value=c.nome||sessionStorage.getItem('candidatoNome')||'';$('#candEmail').value=c.email||sessionStorage.getItem('candidatoEmail')||'';$('#candTelefone').value=c.telefone||'';const nr=$('#candApplyNomeResumo'),cr=$('#candApplyContatoResumo'),av=$('#candApplyAvatar');if(nr)nr.textContent=$('#candNome').value||'Candidato';if(cr)cr.textContent=[$('#candEmail').value,$('#candTelefone').value].filter(Boolean).join(' · ');if(av)av.textContent=($('#candNome').value||'C').charAt(0).toUpperCase();const r=$('#candidaturaPerfilResumo');if(r)r.innerHTML='<strong>'+esc(p.titulo||online.titulo||'Perfil profissional')+'</strong><span>'+esc([p.area||online.area,c.cidade||online.cidade,p.experiencia].filter(Boolean).join(' · ')||'Revise seus dados antes de enviar.')+'</span>';const onlineRadio=document.querySelector('input[name="candCvVisual"][value="online"]'),fileRadio=document.querySelector('input[name="candCvVisual"][value="cadastrado"]'),badge=$('#candCvOnlineBadge');if(onlineRadio)onlineRadio.disabled=!temOnline;if(fileRadio)fileRadio.disabled=!curr;if(badge)badge.textContent=pct===100?'✓ Currículo completo · Recomendado':(temOnline?'Seu currículo está '+pct+'% completo · Complete antes de enviar':'Você ainda não criou seu Currículo + Empregos');const criar=$('#candCriarCurriculoBtn');if(criar)criar.classList.toggle('oculto',temOnline);const origem=temOnline?'online':(curr?'cadastrado':'perfil');const radio=document.querySelector('input[name="candCvVisual"][value="'+origem+'"]');if(radio)radio.checked=true;selecionarCurriculoCandidaturaEM(origem);renderizarPerguntasCandidaturaEM(v);const premium=candidatoPremiumAtivoEM(c),perfilAderencia={...p,...online},dadosAderencia={curriculoOrigem:temOnline?'online':'perfil',curriculo:online,perfilProfissional:perfilAderencia,cidade:c.cidade||online.cidade||''},analiseAderencia=premium?calcularAderenciaCurriculoEM(v,online):null,aderencia=analiseAderencia?.percentual??0,ap=$('#candAderenciaPct'),at=$('#candAderenciaTexto'),ac=$('#candAderenciaTopo'),ao=$('#candAderenciaOrientacao');if(ac)ac.style.display=premium?'':'none';if(!premium){if(ao){ao.innerHTML='';ao.classList.add('oculto')}const ab=$('#candAderenciaDetalhesBtn');if(ab)ab.style.display='none';window._candAderenciaAtualEM=null}else{if(ap)ap.textContent=aderencia+'%';if(at)at.textContent=aderencia>=80?'Alta compatibilidade':aderencia>=60?'Boa compatibilidade':aderencia>=50?'Compatibilidade moderada':'Baixa compatibilidade';if(ac){ac.classList.remove('baixa','boa','aderencia-muito-baixa','aderencia-baixa','aderencia-media','aderencia-alta','aderencia-excelente');ac.classList.add(aderencia>=90?'aderencia-excelente':aderencia>=75?'aderencia-alta':aderencia>=50?'aderencia-media':aderencia>=30?'aderencia-baixa':'aderencia-muito-baixa')}if(ao){const itensAd=(analiseAderencia?.itens||[]).map(x=>({ok:x.status==='sim',parcial:x.status==='parcial',nome:x.nome,det:x.det,status:x.status})),faltam=itensAd.filter(x=>!x.ok),atende=itensAd.filter(x=>x.ok);ao.classList.toggle('nao-recomendada',aderencia<50);ao.innerHTML='<div class="cand-ad-head"><strong>'+(aderencia<50?'⚠ Candidatura não recomendada neste momento':'Análise de compatibilidade')+'</strong><button type="button" onclick="toggleDetalhesAderenciaEM()">×</button></div><div class="cand-ad-cols"><div><b>✓ Compatível</b>'+atende.map(x=>'<span class="ok"><i>✓</i><span>'+esc(x.nome)+'<small>'+esc(x.det||'Compatível com a vaga.')+'</small></span></span>').join('')+'</div><div><b>'+(faltam.length?'! Pontos sem compatibilidade':'✓ Todos os critérios')+'</b>'+(faltam.length?faltam.map(x=>'<span class="'+(x.parcial?'partial':'miss')+'"><i>'+(x.parcial?'~':'!')+'</i><span>'+esc(x.nome)+'<small>'+esc(x.det||'Não identificado no currículo.')+'</small></span></span>').join(''):'<span class="ok">Seu currículo atende aos critérios analisados.</span>')+'</div></div>'+(aderencia<50?'<button class="cand-ad-improve" type="button" onclick="irPara(\'curriculo\')">Melhorar meu currículo →</button>':'')}window._candAderenciaAtualEM={pct:aderencia,vagaId:v.id};}const ck=$('#candApplyChecklist');if(ck){const telefone=Boolean($('#candTelefone').value),email=Boolean($('#candEmail').value),cvok=origem==='online'?pct===100:(origem==='cadastrado'?Boolean(curr):Boolean(p.titulo||p.area||p.resumo));ck.innerHTML='<strong>Antes de enviar</strong><div><span class="'+(email?'ok':'alerta')+'">'+(email?'✓':'!')+' E-mail '+(email?'atualizado':'não informado')+'</span><span class="'+(telefone?'ok':'alerta')+'">'+(telefone?'✓':'!')+' Telefone '+(telefone?'atualizado':'não informado')+'</span><span class="'+(cvok?'ok':'alerta')+'">'+(cvok?'✓':'!')+' Currículo '+(cvok?'pronto para envio':'pode ser melhorado')+'</span></div>'}}
function selecionarCurriculoCandidaturaEM(v){const s=$('#candCurriculoOpcao');if(s)s.value=v;document.querySelectorAll('.cand-cv-options label').forEach(x=>x.classList.toggle('selecionado',x.querySelector('input')?.checked))}
function renderizarPerguntasCandidaturaEM(v){
 let box=document.getElementById('candPerguntasEliminatoriasEM');
 if(!box){const form=document.getElementById('formCandidatura');if(!form)return;box=document.createElement('section');box.id='candPerguntasEliminatoriasEM';box.className='cand-perguntas-eliminatorias';const btn=form.querySelector('button[type="submit"]');if(btn)btn.parentElement?.insertAdjacentElement('beforebegin',box);else form.appendChild(box)}
 const qs=Array.isArray(v?.perguntasEliminatorias)?v.perguntasEliminatorias:[];box.hidden=!qs.length;
 box.innerHTML=qs.length?'<span>PERGUNTAS DA EMPRESA</span><h3>Antes de enviar, responda:</h3>'+qs.map((q,i)=>'<label><b>'+esc(q.pergunta)+'</b><select class="cand-resposta-eliminatoria" data-id="'+esc(q.id||('p'+i))+'" required><option value="">Selecione</option><option value="sim">Sim</option><option value="nao">Não</option></select></label>').join(''):''
}
function respostasPerguntasCandidaturaEM(v){
 const qs=Array.isArray(v?.perguntasEliminatorias)?v.perguntasEliminatorias:[],els=[...document.querySelectorAll('.cand-resposta-eliminatoria')];
 return qs.map((q,i)=>{const el=els.find(x=>x.dataset.id===String(q.id||('p'+i))),resposta=el?.value||'';return{id:q.id||('p'+i),pergunta:q.pergunta,resposta,esperada:q.esperada||'sim',compativel:resposta===(q.esperada||'sim')}})
}
function enviarCandidatura(e){e.preventDefault();if(papelAtual()!=='candidato'||!candidatoLogado()){msg('#msgCandidatura','Sua sessão de candidato expirou. Entre novamente para continuar.');setTimeout(()=>irPara('login-candidato'),700);return}const v=vagaAtual();if(!v||v.status!=='aprovada'||!vagaDentroPrazo(v))return msg('#msgCandidatura','Esta vaga não está mais recebendo candidaturas.');const a=candidaturas(),email=$('#candEmail').value.trim().toLowerCase();if(a.some(c=>c.vagaId===v.id&&(c.email||'').toLowerCase()===email))return msg('#msgCandidatura','Você já se candidatou a esta vaga.');const c=candidatoLogado()||{},p=c.perfil||{},curr=ler(chaveCurriculo(),null),online=dadosCurriculoOnlineEM(),origem=$('#candCurriculoOpcao')?.value||'perfil',respostasEliminatorias=respostasPerguntasCandidaturaEM(v);if(respostasEliminatorias.some(x=>!x.resposta))return msg('#msgCandidatura','Responda todas as perguntas da empresa antes de enviar.');if(origem==='cadastrado'&&!curr)return msg('#msgCandidatura','Cadastre um currículo antes de selecionar esta opção.');if(origem==='online'&&!itensProgressoCurriculoEM(online).some(x=>x.ok))return msg('#msgCandidatura','Crie seu Currículo + Empregos antes de selecionar esta opção.');a.unshift({id:'cand_'+Date.now(),vagaId:v.id,vagaTitulo:tituloVaga(v),candidato:$('#candNome').value.trim(),email:$('#candEmail').value.trim(),telefone:$('#candTelefone').value.trim(),mensagem:$('#candMensagem').value.trim(),curriculoOrigem:origem,curriculo:origem==='cadastrado'?{...curr,enviadoEm:new Date().toISOString()}:(origem==='online'?{...online,enviadoEm:new Date().toISOString(),tipo:'curriculo_online'}:null),perfilProfissional:origem==='perfil'?{titulo:p.titulo||'',area:p.area||'',escolaridade:p.escolaridade||'',experiencia:p.experiencia||'',resumo:p.resumo||'',competencias:p.competencias||'',linkedin:p.linkedin||'',portfolio:p.portfolio||''}:null,respostasEliminatorias,triagemEliminatoria:respostasEliminatorias.length?(respostasEliminatorias.every(x=>x.compativel)?'compatível':'revisar'):'sem_perguntas',status:'Em avaliação',criadoEm:new Date().toISOString()});gravar('empregaMaisCandidaturas',a);msg('#msgCandidatura','Candidatura enviada com sucesso.',true);setTimeout(()=>irPara('candidaturas'),800)}

function chaveCurriculo(){return'empregaMaisCurriculo_'+(sessionStorage.getItem('candidatoEmail')||'')}
function renderizarCurriculo(){const d=ler(chaveCurriculo(),null),n=$('#curriculoNomeExibicao'),det=$('#curriculoDetalheExibicao'),b=$('#curriculoBadge'),x=$('#btnExcluirCurriculo');if(!n)return;if(d){n.textContent=d.nome;det.textContent='Currículo cadastrado em '+new Date(d.data).toLocaleDateString('pt-BR');b.textContent='Cadastrado';b.className='curriculo-ok';x.classList.remove('oculto')}else{n.textContent='Nenhum currículo cadastrado';det.textContent='Envie um arquivo PDF, DOC ou DOCX.';b.textContent='Não cadastrado';b.className='';x.classList.add('oculto')}}
function configurarUploadCurriculo(){const z=$('#dropCurriculo'),i=$('#arquivoCurriculo');if(!z||!i||z.dataset.bind)return;z.addEventListener('click',e=>{if(e.target!==i)i.click()});['dragenter','dragover'].forEach(ev=>z.addEventListener(ev,e=>{e.preventDefault();z.classList.add('arrastando')}));['dragleave','drop'].forEach(ev=>z.addEventListener(ev,e=>{e.preventDefault();z.classList.remove('arrastando')}));z.addEventListener('drop',e=>{const f=e.dataTransfer?.files?.[0];if(f){const dt=new DataTransfer();dt.items.add(f);i.files=dt.files;mostrarArquivoCurriculo(f)}});i.addEventListener('change',()=>{if(i.files[0])mostrarArquivoCurriculo(i.files[0])});z.dataset.bind='1'}function mostrarArquivoCurriculo(f){const z=$('#dropCurriculo');if(!z||!f)return;const p=z.querySelector('p');if(p)p.textContent=f.name+' · '+(f.size/1024/1024).toFixed(2)+' MB'}function salvarCurriculoLocal(e){e.preventDefault();const f=$('#arquivoCurriculo').files[0];if(!f)return;if(f.size>5*1024*1024)return msg('#msgCurriculo','O arquivo deve ter no máximo 5 MB.');const ext=(f.name.split('.').pop()||'').toLowerCase();if(!['pdf','doc','docx'].includes(ext))return msg('#msgCurriculo','Envie um arquivo PDF, DOC ou DOCX.');gravar(chaveCurriculo(),{nome:f.name,tamanho:f.size,tipo:f.type,data:new Date().toISOString()});msg('#msgCurriculo','Currículo cadastrado.',true);renderizarCurriculo();atualizarPainelCandidato()}
function excluirCurriculo(){const d=ler(chaveCurriculo(),null);if(!d)return;if(candidaturas().some(c=>(c.email||'').toLowerCase()===(sessionStorage.getItem('candidatoEmail')||'').toLowerCase()&&c.curriculoOrigem==='cadastrado')){if(!confirm('Excluir o currículo do seu perfil? As candidaturas já enviadas manterão apenas o registro do arquivo usado naquele momento.'))return}else if(!confirm('Excluir seu currículo cadastrado?'))return;localStorage.removeItem(chaveCurriculo());renderizarCurriculo();atualizarPainelCandidato()}
function chaveSalvas(){return'empregaMaisSalvas_'+(sessionStorage.getItem('candidatoEmail')||'')}
function salvas(){return ler(chaveSalvas())}
function vagaEstaSalva(id){return salvas().includes(id)}
function alternarSalvarVaga(){const v=vagaAtual();if(!v||v.status!=='aprovada'||!vagaDentroPrazo(v)){alert('Esta vaga não está mais disponível para salvar.');irPara('home');return}if(papelAtual()!=='candidato'){sessionStorage.setItem('vagaSelecionada',v.id);sessionStorage.setItem('retornoSalvarVaga','1');irPara('login-candidato');return}let a=salvas();a=a.includes(v.id)?a.filter(x=>x!==v.id):[v.id,...a];gravar(chaveSalvas(),a);renderizarVagaDetalhe()}
function renderizarSalvas(){const box=$('#listaVagasSalvas');if(!box)return;const ids=salvas(),publicas=vagasPublicas(),a=publicas.filter(v=>ids.includes(v.id)),validos=new Set(a.map(v=>v.id));if(ids.some(id=>!validos.has(id)))gravar(chaveSalvas(),ids.filter(id=>validos.has(id)));box.innerHTML=a.length?a.map(cardVagaPortal).join(''):'<div class="vagas-vazio"><strong>Nenhuma vaga salva</strong><span>Use o botão “Salvar vaga” para guardar oportunidades.</span></div>'}


/* EMPREGAMAIS-PAINEL-RECRUTADOR-SIMPLES-V1 */
function garantirPainelRecrutadorSimplesEM(){
 const pagina=document.getElementById('pagina-painel-empresa');if(!pagina)return null;
 if(!document.getElementById('fonteInterEmpregaiEM')){const l=document.createElement('link');l.id='fonteInterEmpregaiEM';l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';document.head.appendChild(l)}
 document.getElementById('estiloPainelRecrutadorSimplesEM')?.remove();
 {
  const st=document.createElement('style');st.id='estiloPainelRecrutadorSimplesEM';st.textContent=
  '#pagina-painel-empresa{--emp-blue:#0E5FD8;--emp-blue-dark:#0B3475;--emp-blue-soft:#EAF3FF;--emp-orange:#FF6B17;--emp-orange-soft:#FFF0E5;--emp-bg:#F4F8FD;--emp-card:#FFFFFF;--emp-text:#174D96;--emp-muted:#6D7D96;--emp-line:#DCE7F4;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;background:var(--emp-bg)!important;min-height:100vh!important;padding:0!important}#pagina-painel-empresa~#empConectaLauncherEM,#empConectaLauncherEM{display:none!important}'+
  '#emPainelRecrutadorSimplesEM{display:grid;grid-template-columns:226px minmax(0,1fr);min-height:calc(100vh - 70px);color:var(--emp-text);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important}#emPainelRecrutadorSimplesEM *{box-sizing:border-box;font-family:inherit}'+
  '.emrs-side{background:linear-gradient(180deg,#F8FBFF 0%,#EEF5FF 100%)!important;color:#174D96!important;padding:22px 14px!important;display:flex!important;flex-direction:column!important;gap:18px!important;border-right:1px solid #DCE7F4!important;box-shadow:6px 0 22px rgba(18,64,125,.035)!important}.emrs-side *{color:inherit!important}.emrs-brand{padding:4px 10px 18px!important;border-bottom:1px solid #DCE7F4!important}.emrs-brand small{display:block!important;color:#7B8DA5!important;font-size:10px!important;letter-spacing:.04em!important;text-transform:none!important;margin-bottom:6px!important;font-weight:500!important}.emrs-brand strong{font-size:19px!important;line-height:1.25!important;color:#174D96!important;font-weight:750!important;letter-spacing:-.3px!important}.emrs-nav{display:grid!important;gap:6px!important}.emrs-nav button{position:relative!important;border:1px solid transparent!important;border-radius:11px!important;background:transparent!important;color:#496583!important;padding:11px 12px!important;text-align:left!important;font:600 12px/1.25 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;cursor:pointer!important;display:flex!important;align-items:center!important;gap:10px!important;transition:background .18s ease,border-color .18s ease,color .18s ease,box-shadow .18s ease!important}.emrs-nav button:hover{background:#FFFFFF!important;color:#174D96!important;border-color:#D8E5F3!important;box-shadow:0 5px 14px rgba(18,64,125,.045)!important}.emrs-nav button.ativo{background:#FFFFFF!important;color:#0E5FD8!important;border-color:#D8E5F3!important;box-shadow:0 7px 18px rgba(18,64,125,.06)!important;transform:none!important}.emrs-nav button.ativo:before{content:""!important;position:absolute!important;left:-1px!important;top:9px!important;bottom:9px!important;width:3px!important;border-radius:0 4px 4px 0!important;background:#FF6B17!important}.emrs-nav button i,.emrs-nav button span,.emrs-nav button b{color:inherit!important}.emrs-nav i{font-style:normal!important;width:24px!important;height:24px!important;border-radius:8px!important;display:grid!important;place-items:center!important;text-align:center!important;color:#0E5FD8!important;background:#EAF3FF!important;font-size:12px!important;flex:0 0 24px!important}.emrs-nav button.ativo i{color:#D95A13!important;background:#FFF0E5!important}.emrs-account{margin-top:auto!important;padding:13px!important;border:1px solid #DCE7F4!important;border-radius:12px!important;background:rgba(255,255,255,.72)!important;box-shadow:0 6px 16px rgba(18,64,125,.035)!important}.emrs-account strong{display:block!important;color:#174D96!important;font-size:11.5px!important;font-weight:700!important;text-transform:uppercase!important;letter-spacing:.03em!important}.emrs-account span{display:block!important;color:#7A8CA3!important;font-size:10px!important;margin-top:4px!important}'+
  '.emrs-main{padding:22px 26px 42px;min-width:0;background:linear-gradient(180deg,#F6F9FE 0%,#F4F7FB 100%)}.emrs-top{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:22px;align-items:center;margin-bottom:18px;padding:24px 26px;background:linear-gradient(120deg,#FFFFFF 0%,#F1F7FF 65%,#FFF3E9 140%);border:1px solid #DCE8F7;border-radius:20px;box-shadow:0 12px 32px rgba(18,64,125,.07);position:relative;overflow:hidden}.emrs-top:after{content:"";position:absolute;right:-65px;top:-95px;width:260px;height:260px;border-radius:50%;border:40px solid rgba(14,95,216,.06)}.emrs-top-left,.emrs-top-actions{position:relative;z-index:1}.emrs-top h1{margin:0;color:#174D96;font-size:25px;line-height:1.2;letter-spacing:.01em;font-weight:800;text-transform:uppercase}.emrs-top p{margin:6px 0 0;color:#5D7190;font-size:11.5px;line-height:1.5;font-weight:400}.emrs-top-left{display:flex;align-items:center;gap:14px;min-width:0}.emrs-top-avatar{width:50px;height:50px;flex:0 0 50px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(135deg,#0D63D8,#0B3D87);color:#fff;font-size:17px;font-weight:800;border:1px solid rgba(255,255,255,.55);box-shadow:0 10px 22px rgba(13,63,137,.16)}.emrs-top-text{min-width:0}.emrs-top-kicker{display:block;margin-bottom:4px;color:#0E5FD8;font-size:9.5px;font-weight:750;letter-spacing:.08em;text-transform:uppercase}.emrs-top-actions{display:flex;align-items:center;gap:10px}.emrs-plan-pill{display:flex;align-items:center;gap:7px;padding:8px 10px;border:1px solid #CCE0F9;border-radius:10px;background:rgba(255,255,255,.78);color:#174D96;font-size:10px;font-weight:650;white-space:nowrap}.emrs-plan-pill i{width:7px;height:7px;border-radius:50%;background:#2BAE75}.emrs-top-divider{height:34px;width:1px;background:#D4E2F3}.emrs-primary{border:0!important;border-radius:12px!important;background:linear-gradient(135deg,#FF7A1A,#FF5A08)!important;color:#fff!important;padding:12px 18px!important;font:700 11px Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif!important;cursor:pointer!important;box-shadow:0 10px 22px rgba(255,94,10,.22)!important;letter-spacing:-.05px!important}.emrs-primary:hover{background:#F15F0C!important}.emrs-secondary{border:1px solid #D6E4F4;border-radius:9px;background:#fff;color:#0E5FD8;padding:9px 12px;font:600 10.5px Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer}'+
  '.emrs-kpis{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:14px!important;margin-bottom:18px!important}.emrs-kpi{position:relative!important;min-height:122px!important;padding:18px 20px!important;border:1px solid rgba(25,67,122,.08)!important;border-radius:20px!important;background:rgba(255,255,255,.985)!important;box-shadow:0 8px 24px rgba(15,55,110,.055),0 1px 2px rgba(15,55,110,.03)!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;text-align:center!important;overflow:hidden!important;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease!important}.emrs-kpi:hover{transform:translateY(-3px)!important;box-shadow:0 14px 34px rgba(15,55,110,.09),0 2px 4px rgba(15,55,110,.04)!important;border-color:rgba(14,95,216,.14)!important}.emrs-kpi:before{content:""!important;position:absolute!important;left:18px!important;right:18px!important;top:0!important;width:auto!important;height:3px!important;border-radius:0 0 10px 10px!important;background:linear-gradient(90deg,#0E5FD8,#49A0FF)!important}.emrs-kpi:nth-child(3):before,.emrs-kpi:nth-child(4):before{background:linear-gradient(90deg,#FF7A1A,#FF5A08)!important}.emrs-kpi span{display:block!important;margin:0 0 7px!important;color:#536A89!important;font-family:Montserrat,Arial,sans-serif!important;font-size:9.5px!important;font-weight:700!important;line-height:1.25!important;text-transform:uppercase!important;letter-spacing:.075em!important;text-align:center!important;width:100%!important}.emrs-kpi strong{display:block!important;margin:0!important;color:#0E5FD8!important;font-family:Montserrat,Arial,sans-serif!important;font-size:32px!important;line-height:1!important;font-weight:800!important;letter-spacing:-.75px!important;text-align:center!important;width:100%!important}.emrs-kpi:nth-child(3) strong,.emrs-kpi:nth-child(4) strong{color:#D95A13!important}.emrs-kpi small{display:block!important;margin-top:8px!important;color:#536A89!important;font-family:Montserrat,Arial,sans-serif!important;font-size:9.5px!important;line-height:1.35!important;font-weight:700!important;letter-spacing:.045em!important;text-align:center!important;width:100%!important}.emrs-kpi-icon{position:absolute!important;left:16px!important;top:16px!important;width:38px!important;height:38px!important;border-radius:12px!important;background:linear-gradient(135deg,#F0F6FF,#E2EEFF)!important;color:var(--emp-blue)!important;display:grid!important;place-items:center!important;box-shadow:inset 0 0 0 1px rgba(14,95,216,.07)!important}.emrs-kpi:nth-child(3) .emrs-kpi-icon,.emrs-kpi:nth-child(4) .emrs-kpi-icon{background:linear-gradient(135deg,#FFF4EA,#FFE5D1)!important;color:var(--emp-orange)!important;box-shadow:inset 0 0 0 1px rgba(255,107,23,.08)!important}.emrs-kpi-icon svg{width:17px!important;height:17px!important;fill:none!important;stroke:currentColor!important;stroke-width:1.8!important;stroke-linecap:round!important;stroke-linejoin:round!important}'+
  '.emrs-grid{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(320px,.5fr);gap:16px;align-items:start}.emrs-card{background:rgba(255,255,255,.98)!important;border:1px solid #E1E9F2!important;border-radius:18px!important;padding:20px!important;box-shadow:0 10px 24px rgba(22,67,125,.035)!important}.emrs-card-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;margin-bottom:16px}.emrs-card-head h2{margin:0!important;color:#174D96!important;font-size:16px!important;font-weight:750!important;letter-spacing:-.2px!important}.emrs-card-head p{margin:5px 0 0!important;color:#7C8CA1!important;font-size:11px!important;line-height:1.5!important}.emrs-card-head button{border:0;background:var(--emp-blue-soft);color:var(--emp-blue);border-radius:8px;padding:7px 10px;font:650 10px Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer}.emrs-card-head button:hover{background:#DDEEFF}'+
  '.emrs-plan{display:grid;gap:14px}.emrs-plan-title{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:12px;padding:2px 0 12px;border-bottom:1px solid #E8EEF6}.emrs-plan-title>div{min-width:0}.emrs-plan-title small{display:block!important;margin-bottom:4px!important;color:#7C8CA1!important;font-size:8.5px!important;font-weight:700!important;letter-spacing:.08em!important;text-transform:uppercase!important}.emrs-plan-title strong{display:block!important;font-size:17px!important;line-height:1.2!important;color:#174D96!important;font-weight:800!important;letter-spacing:-.25px!important}.emrs-plan-title>span{display:inline-flex!important;align-items:center!important;gap:6px!important;padding:6px 9px!important;border:1px solid #CFEADB!important;border-radius:999px!important;background:#F0FAF5!important;color:#267052!important;font-size:8.5px!important;font-weight:800!important;text-transform:uppercase!important;letter-spacing:.05em!important}.emrs-plan-title>span:before{content:"";width:6px;height:6px;border-radius:50%;background:#2BAE75;box-shadow:0 0 0 3px rgba(43,174,117,.10)}.emrs-usage{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.emrs-use{position:relative!important;border:1px solid #E1E9F3!important;border-radius:14px!important;padding:13px 14px 12px!important;background:linear-gradient(180deg,#FFFFFF 0%,#F9FBFE 100%)!important;box-shadow:0 5px 14px rgba(23,68,125,.035)!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;align-items:center!important;text-align:center!important}.emrs-use:before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:#0E5FD8}.emrs-use:nth-child(2):before,.emrs-use:nth-child(3):before{background:#FF6B17}.emrs-use span{display:block!important;color:#667A95!important;font-family:Montserrat,Arial,sans-serif!important;font-size:9px!important;font-weight:700!important;letter-spacing:.04em!important;text-transform:uppercase!important;text-align:center!important;width:100%!important}.emrs-use strong{display:block!important;color:#0E5FD8!important;font-family:Montserrat,Arial,sans-serif!important;font-size:21px!important;line-height:1!important;font-weight:800!important;margin-top:7px!important;letter-spacing:-.45px!important;text-align:center!important;width:100%!important}.emrs-use:nth-child(2) strong,.emrs-use:nth-child(3) strong{color:#C95712!important}.emrs-use small{display:block!important;margin-top:6px!important;color:#91A0B2!important;font-family:Montserrat,Arial,sans-serif!important;font-size:9.5px!important;line-height:1.3!important;font-weight:500!important;text-align:center!important;width:100%!important}.emrs-bar{height:5px!important;background:#E8EEF6!important;border-radius:999px!important;overflow:hidden!important;margin-top:10px!important;width:100%!important}.emrs-bar b{display:block!important;height:100%!important;background:linear-gradient(90deg,#0E5FD8,#4A9EFF)!important;border-radius:999px!important}.emrs-use:nth-child(2) .emrs-bar b,.emrs-use:nth-child(3) .emrs-bar b{background:linear-gradient(90deg,#FF6B17,#FF9A4B)!important}.emrs-plan-foot{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:12px!important;align-items:center!important;padding-top:13px!important;border-top:1px solid #E8EEF6!important}.emrs-plan-foot small{display:block!important;color:#6E8098!important;font-size:9.5px!important;line-height:1.55!important}.emrs-plan-foot .emrs-secondary{min-height:36px!important;padding:0 13px!important;border:1px solid #CFE0F4!important;border-radius:10px!important;background:#F7FAFE!important;color:#0E5FD8!important;font:700 10px Montserrat,Arial,sans-serif!important;box-shadow:none!important}.emrs-plan-foot .emrs-secondary:hover{background:#EEF5FF!important;border-color:#BDD4F0!important;transform:translateY(-1px)}'+
  '.emrs-list{display:grid}.emrs-row{display:grid;grid-template-columns:minmax(0,1fr) 96px 100px 34px;gap:12px;align-items:center;padding:14px 8px;border-top:1px solid #ECF1F6;transition:.16s ease;border-radius:10px}.emrs-row:hover{background:#F6FAFF;transform:translateX(2px)}.emrs-row:first-child{border-top:0}.emrs-row strong{display:block!important;color:#174D96!important;font-size:11.5px!important;font-weight:700!important}.emrs-row small{display:block!important;margin-top:4px!important;color:#7D8CA1!important;font-size:10.5px!important}.emrs-status{display:inline-flex;justify-content:center;align-items:center;min-width:82px;padding:5px 8px;border-radius:999px;background:#EEF4FA;color:#53708E;font-size:8.5px;font-weight:800}.emrs-status.ativa{background:#E5F6ED;color:#237355}.emrs-status.analise{background:#FFF0E4;color:#C95816}.emrs-row button{border:1px solid #DDE7F2;background:#F8FBFF;color:#0F5FD7;width:30px;height:30px;border-radius:8px;cursor:pointer}.emrs-empty{padding:24px;text-align:center;border:1px dashed #D8E4F2;border-radius:12px;color:#78889D;font-size:10.5px}'+
  '.emrs-shortcuts{display:grid;gap:8px}.emrs-shortcuts button{display:flex;justify-content:space-between;align-items:center;border:1px solid #DFE8F3;background:#fff;border-radius:12px;padding:11px 12px;color:#174D96;font:650 10.5px Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;cursor:pointer;transition:.18s ease!important}.emrs-shortcuts button:first-child{background:var(--emp-orange);border-color:var(--emp-orange);color:#fff}.emrs-shortcuts button span{color:inherit;font-size:12px}.emrs-kpi:hover{transform:translateY(-2px)!important;box-shadow:0 14px 28px rgba(25,67,122,.07)!important}.emrs-card-head button{transition:.18s ease!important}.emrs-card-head button:hover{transform:translateY(-1px)}.emrs-shortcuts button:hover{transform:translateY(-1px);border-color:#C9DAEC;background:#F9FBFE}.emrs-plan-title span{box-shadow:inset 0 0 0 1px rgba(38,112,82,.08)}'+
  '@media(max-width:980px){#emPainelRecrutadorSimplesEM{grid-template-columns:1fr}.emrs-side{padding:15px}.emrs-nav{display:flex;overflow:auto}.emrs-nav button{white-space:nowrap}.emrs-account{display:none}.emrs-main{padding:20px}.emrs-grid{grid-template-columns:1fr}}@media(max-width:640px){.emrs-main{padding:14px}.emrs-top{grid-template-columns:1fr;padding:16px}.emrs-top-actions{width:100%;flex-wrap:wrap}.emrs-top-divider{display:none}.emrs-top .emrs-primary{flex:1}.emrs-kpis{grid-template-columns:1fr 1fr!important}.emrs-usage{grid-template-columns:1fr 1fr}.emrs-row{grid-template-columns:minmax(0,1fr) 76px 30px}.emrs-row>:nth-child(3){display:none}}';
  document.head.appendChild(st)
 }
 let app=document.getElementById('emPainelRecrutadorSimplesEM');
 if(!app){
  pagina.innerHTML='<div id="emPainelRecrutadorSimplesEM">'+
   '<aside class="emrs-side"><div class="emrs-brand"><small>Área da empresa</small><strong>Empregaí Empresas</strong></div><nav class="emrs-nav"><button class="ativo" onclick="irPara(\'painel-empresa\')"><i>⌂</i>Visão geral</button><button onclick="irPara(\'vagas-empresa\')"><i>▤</i>Minhas vagas</button><button onclick="irPara(\'candidatos-empresa\')"><i>◎</i>Candidaturas</button><button onclick="irPara(\'contratacoes-empresa\')"><i>✓</i>Contratações</button><button onclick="irPara(\'perfil-empresa\')"><i>□</i>Minha empresa</button></nav><div class="emrs-account"><strong id="emrsEmpresaNome">Empresa</strong><span id="emrsPlanoNome">Plano ativo</span></div></aside>'+
   '<main class="emrs-main"><header class="emrs-top"><div class="emrs-top-left"><div class="emrs-top-avatar" id="emrsAvatar">E</div><div class="emrs-top-text"><span class="emrs-top-kicker">Painel do recrutador</span><h1 id="emrsOla">Painel do recrutador</h1><p>Gerencie vagas, candidaturas e recursos da sua empresa em um só lugar.</p></div></div><div class="emrs-top-actions"><div class="emrs-plan-pill"><i></i><span id="emrsPlanoTopo">Plano ativo</span></div><span class="emrs-top-divider"></span><button class="emrs-primary" onclick="irPara(\'publicar\')" >+ Publicar nova vaga</button></div></header>'+
   '<section class="emrs-kpis"><article class="emrs-kpi"><div class="emrs-kpi-icon"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="14" rx="2.5"/><path d="M9 6V4.8A1.8 1.8 0 0 1 10.8 3h2.4A1.8 1.8 0 0 1 15 4.8V6"/></svg></div><span>Vagas ativas</span><strong id="emrsAtivas">0</strong><small>Publicadas agora</small></article><article class="emrs-kpi"><div class="emrs-kpi-icon"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.6-3.6 2.5-5.5 5.5-5.5s4.9 1.9 5.5 5.5"/><path d="M16 8h5M18.5 5.5V10.5"/></svg></div><span>Candidaturas</span><strong id="emrsCands">0</strong><small>Total recebido</small></article><article class="emrs-kpi"><div class="emrs-kpi-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg></div><span>Em análise</span><strong id="emrsAnalise">0</strong><small>Vagas aguardando</small></article><article class="emrs-kpi"><div class="emrs-kpi-icon"><svg viewBox="0 0 24 24"><path d="M5 12.5l4 4L19 7"/><circle cx="12" cy="12" r="9"/></svg></div><span>Contratações</span><strong id="emrsContratados">0</strong><small>Registradas</small></article></section>'+
   '<section class="emrs-grid"><div><section class="emrs-card"><div class="emrs-card-head"><div><h2>Vagas recentes</h2><p>Últimas oportunidades da empresa.</p></div><button onclick="irPara(\'vagas-empresa\')">Ver todas</button></div><div id="emrsVagas" class="emrs-list"></div></section></div>'+
   '<aside><section class="emrs-card"><div class="emrs-card-head"><div><h2>Seu plano</h2><p>Uso dos recursos durante a assinatura.</p></div></div><div id="emrsPlano" class="emrs-plan"></div></section><section class="emrs-card" style="margin-top:14px"><div class="emrs-card-head"><div><h2>Acesso rápido</h2><p>Principais ações do recrutador.</p></div></div><div class="emrs-shortcuts"><button onclick="irPara(\'candidatos-empresa\')">Ver candidaturas <span>›</span></button><button onclick="irPara(\'vagas-empresa\')">Gerenciar vagas <span>›</span></button><button onclick="irPara(\'perfil-empresa\')">Dados da empresa <span>›</span></button><button onclick="irPara(\'planos\')">Gerenciar plano <span>›</span></button></div></section></aside></section>'+
   '</main></div>';
  app=document.getElementById('emPainelRecrutadorSimplesEM')
 }
 return app
}
function renderizarPainelEmpresa(){
 const app=garantirPainelRecrutadorSimplesEM();if(!app)return;
 const empresa=empresaLogada()||{},todas=vagasDaEmpresa(),plano=planoEmpresaAtual(),uso=usoPlanoEmpresa();
 const cands=candidaturas().filter(c=>todas.some(v=>String(v.id)===String(c.vagaId)));
 const ativas=todas.filter(v=>v.status==='aprovada'&&vagaDentroPrazo(v)).length;
 const analise=todas.filter(v=>['pendente','em_analise','analise'].includes(String(v.status||'').toLowerCase())).length;
 const contratados=cands.filter(c=>grupoEtapa(c.status)==='Contratados').length;
 const nome=empresa.nome||sessionStorage.getItem('empresaNome')||'Empresa';
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
 set('emrsEmpresaNome',nome);set('emrsPlanoNome','Plano '+plano.nome);set('emrsPlanoTopo','Plano '+plano.nome);set('emrsOla',nome);set('emrsAvatar',(String(nome).trim()[0]||'E').toUpperCase());set('emrsAtivas',ativas);set('emrsCands',cands.length);set('emrsAnalise',analise);set('emrsContratados',contratados);
 const pct=(a,b)=>b?Math.min(100,Math.round(a/b*100)):0;
 const disp=Math.max(0,plano.vagas-uso.vagas),destaques=Math.max(0,plano.destaques-uso.destaques),urgentes=Math.max(0,plano.urgentes-uso.urgentes),conf=Math.max(0,plano.confidenciais-uso.confidenciais);
 const planBox=document.getElementById('emrsPlano');
 if(planBox)planBox.innerHTML='<div class="emrs-plan-title"><div><small>Assinatura atual</small><strong>Plano '+esc(plano.nome)+'</strong></div><span>Ativo</span></div><div class="emrs-usage">'+
  '<div class="emrs-use"><span>Vagas</span><strong>'+uso.vagas+' / '+plano.vagas+'</strong><small>'+disp+' disponíveis</small><div class="emrs-bar"><b style="width:'+pct(uso.vagas,plano.vagas)+'%"></b></div></div>'+
  '<div class="emrs-use"><span>Destaques</span><strong>'+uso.destaques+' / '+plano.destaques+'</strong><small>'+destaques+' disponíveis</small><div class="emrs-bar"><b style="width:'+pct(uso.destaques,plano.destaques)+'%"></b></div></div>'+
  '<div class="emrs-use"><span>Urgências</span><strong>'+uso.urgentes+' / '+plano.urgentes+'</strong><small>'+urgentes+' disponíveis</small><div class="emrs-bar"><b style="width:'+pct(uso.urgentes,plano.urgentes)+'%"></b></div></div>'+
  '<div class="emrs-use"><span>Confidenciais</span><strong>'+uso.confidenciais+' / '+plano.confidenciais+'</strong><small>'+conf+' disponíveis</small><div class="emrs-bar"><b style="width:'+pct(uso.confidenciais,plano.confidenciais)+'%"></b></div></div></div>'+
  '<div class="emrs-plan-foot"><small>Recursos disponíveis neste ciclo de assinatura.</small><button class="emrs-secondary" onclick="irPara(\'planos\')">Gerenciar plano</button></div>';
 const box=document.getElementById('emrsVagas'),recentes=todas.slice().sort((a,b)=>new Date(b.criadoEm||0)-new Date(a.criadoEm||0)).slice(0,6);
 if(box)box.innerHTML=recentes.length?recentes.map(v=>{
  const qtd=cands.filter(c=>String(c.vagaId)===String(v.id)).length,st=String(v.status||'').toLowerCase(),cls=st==='aprovada'?'ativa':st==='pendente'?'analise':'',rot=st==='aprovada'?'Ativa':st==='pendente'?'Em análise':(v.status||'—');
  return '<div class="emrs-row"><div><strong>'+esc(tituloVaga(v)||'Vaga')+'</strong><small>'+esc([v.cidade,v.estado||v.uf].filter(Boolean).join(' - ')||'Local não informado')+'</small></div><span class="emrs-status '+cls+'">'+esc(rot)+'</span><small>'+qtd+' candidato(s)</small><button onclick="abrirGestaoVaga(\''+String(v.id).replace(/'/g,'')+'\')">•••</button></div>'
 }).join(''):'<div class="emrs-empty">Nenhuma vaga publicada ainda.</div>';
 document.getElementById('empConectaLauncherEM')?.remove();document.getElementById('empConectaMenuEM')?.remove();
}

const PLANOS_EMPRESA={basico:{nome:'Grátis',dias:30,vagas:3,destaques:0,urgentes:0,confidenciais:0},mensal:{nome:'Mensal',dias:30,vagas:6,destaques:1,urgentes:1,confidenciais:0},trimestral:{nome:'Trimestral',dias:90,vagas:12,destaques:3,urgentes:3,confidenciais:2},semestral:{nome:'Semestral',dias:180,vagas:25,destaques:5,urgentes:5,confidenciais:4},anual:{nome:'Anual',dias:365,vagas:60,destaques:10,urgentes:10,confidenciais:8}};
function selecionarPlano(p){
 if(papelAtual()!=='empresa'){sessionStorage.setItem('planoPretendido',p);irPara('login-empresa');return}
 const empresas=ler('empregaMaisEmpresas'),cnpj=sessionStorage.getItem('empresaCnpj'),i=empresas.findIndex(e=>e.cnpj===cnpj);
 if(i<0){sessionStorage.setItem('planoPretendido',p);irPara('login-empresa');return}
 if(p==='basico'){empresas[i].plano='basico';empresas[i].planoStatus='ativo';empresas[i].planoAtivadoEm=new Date().toISOString();gravar('empregaMaisEmpresas',empresas);msg('#msgPlano','Plano Grátis ativado.',true);renderizarPlanosAtuais();return}
 const pendente=ler('empregaMaisPedidosPlano').find(x=>x.empresaCnpj===cnpj&&x.plano===p&&x.status==='aguardando_pagamento');
 abrirCheckoutPlano(p,pendente);
}
function abrirCheckoutPlano(p,pendente){
 document.getElementById('emCheckoutPlano')?.remove();
 const valor=({mensal:49.9,trimestral:99,semestral:179.9,anual:329}[p]||0),pix=valor*.94,moeda=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
 const box=document.createElement('div');box.id='emCheckoutPlano';box.className='em-checkout-overlay';
 box.innerHTML='<div class="em-checkout-modal"><button class="em-checkout-x" type="button" aria-label="Fechar">×</button><span class="em-checkout-kicker">RESUMO DA COMPRA</span><h2>Plano '+esc(PLANOS_EMPRESA[p]?.nome||p)+'</h2><p class="em-checkout-sub">Revise seu plano e escolha como deseja pagar.</p><div class="em-checkout-price"><span>Valor do plano</span><strong>'+moeda(valor)+'</strong></div><label class="em-checkout-pay ativo"><input type="radio" name="emFormaPagamento" value="pix" checked><div><b>Pix · 6% de desconto</b><small>'+moeda(pix)+' à vista</small></div></label><label class="em-checkout-pay"><input type="radio" name="emFormaPagamento" value="cartao"><div><b>Cartão de crédito</b><small>3x de '+moeda(valor/3)+' sem juros</small></div></label>'+(pendente?'<div class="em-checkout-alert"><b>Você já possui uma compra deste plano em andamento.</b><span>Você pode continuar com ela ou cancelar e iniciar uma nova.</span></div>':'')+'<div class="em-checkout-actions">'+(pendente?'<button type="button" class="em-checkout-secondary" data-action="cancelar">Cancelar pedido e fazer novo</button>':'')+'<button type="button" class="em-checkout-primary" data-action="'+(pendente?'continuar':'confirmar')+'">'+(pendente?'Continuar pagamento':'Continuar para pagamento')+' →</button></div></div>';
 document.body.appendChild(box);
 box.querySelector('.em-checkout-x').onclick=()=>box.remove(); box.onclick=e=>{if(e.target===box)box.remove()};
 box.querySelectorAll('.em-checkout-pay').forEach(l=>l.onclick=()=>{box.querySelectorAll('.em-checkout-pay').forEach(x=>x.classList.remove('ativo'));l.classList.add('ativo')});
 box.querySelector('[data-action="continuar"]')?.addEventListener('click',()=>continuarPagamentoPlano(p,pendente?.id));
 box.querySelector('[data-action="confirmar"]')?.addEventListener('click',()=>criarPedidoPlanoCheckout(p));
 box.querySelector('[data-action="cancelar"]')?.addEventListener('click',()=>{const ps=ler('empregaMaisPedidosPlano'),x=ps.find(v=>v.id===pendente?.id);if(x)x.status='cancelado';gravar('empregaMaisPedidosPlano',ps);box.remove();abrirCheckoutPlano(p,null)});
}
function criarPedidoPlanoCheckout(p){
 const cnpj=sessionStorage.getItem('empresaCnpj'),empresas=ler('empregaMaisEmpresas'),empresa=empresas.find(e=>e.cnpj===cnpj);if(!empresa)return;
 const modal=document.getElementById('emCheckoutPlano'),forma=modal?.querySelector('input[name="emFormaPagamento"]:checked')?.value||'pix';
 const pedido={id:'plano_'+Date.now(),empresaCnpj:cnpj,empresa:empresa.nome,plano:p,valor:({mensal:49.9,trimestral:99,semestral:179.9,anual:329}[p]||0),formaPagamento:forma,status:'aguardando_pagamento',criadoEm:new Date().toISOString()};
 const pedidos=ler('empregaMaisPedidosPlano');pedidos.unshift(pedido);gravar('empregaMaisPedidosPlano',pedidos);empresa.planoPretendido=p;gravar('empregaMaisEmpresas',empresas);modal?.remove();continuarPagamentoPlano(p,pedido.id);
}
function continuarPagamentoPlano(p,id){
 document.getElementById('emCheckoutPlano')?.remove();
 const aviso=document.createElement('div');aviso.className='em-checkout-overlay';aviso.id='emCheckoutPlano';aviso.innerHTML='<div class="em-checkout-modal em-checkout-confirm"><button class="em-checkout-x" type="button">×</button><div class="em-checkout-ok">✓</div><h2>Pedido pronto para pagamento</h2><p>Seu Plano '+esc(PLANOS_EMPRESA[p]?.nome||p)+' foi reservado. A integração do pagamento poderá continuar a partir deste pedido.</p><button type="button" class="em-checkout-primary">Entendi</button></div>';document.body.appendChild(aviso);aviso.querySelectorAll('button').forEach(b=>b.onclick=()=>aviso.remove());renderizarPlanosAtuais();
}
function renderizarPlanosAtuais(){if(papelAtual()!=='empresa')return;const c=sessionStorage.getItem('empresaCnpj'),e=ler('empregaMaisEmpresas').find(x=>x.cnpj===c),atual=e?.plano||'basico',pendentes=ler('empregaMaisPedidosPlano').filter(x=>x.empresaCnpj===c&&x.status==='aguardando_pagamento');document.querySelectorAll('.plano-card').forEach(card=>card.classList.remove('plano-atual'));document.querySelectorAll('.plano-card button').forEach(b=>{const m=(b.getAttribute('onclick')||'').match(/selecionarPlano\('([^']+)'\)/);if(!m)return;const p=m[1];b.disabled=false;b.textContent=p==='basico'?'Começar grátis':'Escolher plano';if(p===atual){b.closest('.plano-card')?.classList.add('plano-atual');b.textContent='Plano atual';b.disabled=true}else if(pendentes.some(x=>x.plano===p)){b.textContent='Aguardando pagamento';b.disabled=true}})}function ativarPedidoPlano(id){const ps=ler('empregaMaisPedidosPlano'),i=ps.findIndex(x=>x.id===id);if(i<0||ps[i].status==='ativo')return;const es=ler('empregaMaisEmpresas'),j=es.findIndex(e=>e.cnpj===ps[i].empresaCnpj);if(j<0)return;es[j].plano=ps[i].plano;es[j].planoStatus='ativo';es[j].planoAtivadoEm=new Date().toISOString();delete es[j].planoPretendido;ps.forEach((x,k)=>{if(k!==i&&x.empresaCnpj===ps[i].empresaCnpj&&x.status==='aguardando_pagamento')x.status='cancelado'});ps[i].status='ativo';ps[i].ativadoEm=new Date().toISOString();gravar('empregaMaisEmpresas',es);gravar('empregaMaisPedidosPlano',ps);adminAba('planos')}function planoEmpresaAtual(){const sim=sessionStorage.getItem('empregaMaisAdminPlanoSimulado');if(adminVisualizacaoAtivaEM()&&sim&&PLANOS_EMPRESA[sim])return PLANOS_EMPRESA[sim];const c=sessionStorage.getItem('empresaCnpj'),e=ler('empregaMaisEmpresas').find(x=>x.cnpj===c);return PLANOS_EMPRESA[e?.plano]||PLANOS_EMPRESA.basico}function chaveMes(d){const x=new Date(d||Date.now());return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')}function usoPlanoEmpresa(){const c=sessionStorage.getItem('empresaCnpj')||'',e=ler('empregaMaisEmpresas').find(x=>x.cnpj===c)||{},p=planoEmpresaAtual(),fimRaw=e.planoValidoAte||e.planoFim||e.planoAte||e.vigenciaAte||'',fim=fimRaw&&!isNaN(new Date(fimRaw))?new Date(fimRaw):new Date(),inicioRaw=e.planoAtivadoEm||e.planoInicio||e.criadoEm||'',inicio=inicioRaw&&!isNaN(new Date(inicioRaw))?new Date(inicioRaw):new Date(fim.getTime()-(Number(p.dias||30)*86400000));if(!fimRaw)fim.setTime(inicio.getTime()+(Number(p.dias||30)*86400000));const vs=ler('empregaMaisVagas').filter(v=>{if(v.empresaCnpj!==c||v.status==='excluida')return false;const d=new Date(v.criadoEm||0);return !isNaN(d)&&d>=inicio&&d<=fim});return{vagas:vs.length,destaques:vs.filter(v=>v.destaque).length,urgentes:vs.filter(v=>v.urgente).length,confidenciais:vs.filter(v=>v.confidencial).length,inicio,fim}}function saldoPlano(){const p=planoEmpresaAtual(),u=usoPlanoEmpresa();return{plano:p,uso:u,vagas:Math.max(0,p.vagas-u.vagas),destaques:Math.max(0,p.destaques-u.destaques),urgentes:Math.max(0,p.urgentes-u.urgentes),confidenciais:Math.max(0,p.confidenciais-u.confidenciais)}}function atualizarOpcoesPlano(){const x=saldoPlano(),set=(id,t)=>{const e=$('#'+id);if(e)e.textContent=t};const gratuito=x.plano&&x.plano.nome==='Grátis';set('saldoDestaque',gratuito?'R$ 19,90 · 7 dias':'('+x.destaques+' disponível(is) no plano)');set('saldoUrgente',gratuito?'R$ 9,90':'('+x.urgentes+' disponível(is) no mês)');set('saldoConfidencial','('+x.confidenciais+' disponível(is) no mês)');const r=$('#resumoPlanoPublicacao');if(r)r.innerHTML='<strong>Plano '+x.plano.nome+'</strong><span>'+x.vagas+' de '+x.plano.vagas+' publicação(ões) disponível(is) neste plano</span>';[['vagaDestaque','destaques'],['vagaUrgente','urgentes'],['vagaConfidencial','confidenciais']].forEach(([id,k])=>{const e=$('#'+id);if(!e)return;const pago=gratuito&&(id==='vagaDestaque'||id==='vagaUrgente');e.disabled=!pago&&x[k]<=0});const a=$('#avisoLimitePlano');if(a)a.textContent=x.vagas<=0?'Você atingiu o limite de publicações do seu plano neste mês.':''}function validarRecursosPlano(dados,editId){const x=saldoPlano(),lista=ler('empregaMaisVagas'),ant=editId?lista.find(v=>v.id===editId):null;if(!editId&&x.vagas<=0)return'Limite mensal de vagas atingido para o plano '+x.plano.nome+'.';const gratuito=x.plano&&x.plano.nome==='Grátis';if(dados.destaque&&!(ant&&ant.destaque)&&gratuito)return'';if(dados.urgente&&!(ant&&ant.urgente)&&gratuito)return'';if(dados.destaque&&!(ant&&ant.destaque)&&x.destaques<=0&&!gratuito)return'Seu plano não possui Destaque disponível neste mês.';if(dados.urgente&&!(ant&&ant.urgente)&&x.urgentes<=0&&!gratuito)return'Seu plano não possui marcação Urgente disponível neste mês.';if(dados.confidencial&&!(ant&&ant.confidencial)&&x.confidenciais<=0)return'Seu plano não possui vaga Confidencial disponível neste mês.';return''}

function alternarSenhaAdmin(btn){const campo=$('#adminSenha');if(!campo)return;const mostrar=campo.type==='password';campo.type=mostrar?'text':'password';btn.textContent=mostrar?'Ocultar':'Mostrar';btn.setAttribute('aria-label',mostrar?'Ocultar senha':'Mostrar senha')}
/* EMPREGAMAIS-ADMIN-SUPABASE-AUTH-V1 */
async function loginAdmin(e){
 e.preventDefault();
 const email=$('#adminEmail').value.trim().toLowerCase(),senha=$('#adminSenha').value;
 msg('#msgLoginAdmin','Validando acesso...');
 try{
  const a=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/auth/v1/token?grant_type=password",{method:"POST",headers:sbHeadersEM(),body:JSON.stringify({email:email,password:senha})});
  if(!a||!a.access_token||!a.user){throw new Error('Sessão administrativa inválida.')}
  const permissao=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/rpc/is_admin",{method:"POST",headers:sbHeadersEM(a.access_token),body:"{}"});
  if(permissao!==true){throw new Error('Acesso administrativo não autorizado.')}
  sessionStorage.setItem(EMPREGAMAIS_SB_ADMIN_TOKEN,a.access_token);
  if(a.refresh_token)sessionStorage.setItem(EMPREGAMAIS_SB_ADMIN_REFRESH,a.refresh_token);
  sessionStorage.setItem('empregaMaisAdmin','1');
  sessionStorage.setItem('empregaMaisAdminEmail',email);
  irPara('painel-admin');
 }catch(err){
  sessionStorage.removeItem('empregaMaisAdmin');
  sessionStorage.removeItem('empregaMaisAdminEmail');
  const detalhe=String(err&&err.message||'').toLowerCase();
  if(detalhe.includes('email not confirmed'))msg('#msgLoginAdmin','O e-mail administrativo ainda não foi confirmado no Supabase.');
  else if(detalhe.includes('invalid login credentials'))msg('#msgLoginAdmin','E-mail ou senha administrativa incorretos.');
  else if(detalhe.includes('não autorizado')||detalhe.includes('nao autorizado'))msg('#msgLoginAdmin','Esta conta não possui acesso administrativo.');
  else msg('#msgLoginAdmin','Não foi possível autenticar o administrador agora. Tente novamente.');
 }
}
function sairAdmin(){sessionStorage.removeItem('empregaMaisAdmin');sessionStorage.removeItem('empregaMaisAdminEmail');sessionStorage.removeItem(EMPREGAMAIS_SB_ADMIN_TOKEN);sessionStorage.removeItem(EMPREGAMAIS_SB_ADMIN_REFRESH);irPara('home')}
function adminTabelaVagas(a){return a.length?'<div class="admin-lista">'+a.map(v=>{const st=({pendente:'Em análise',aprovada:'Aprovada',reprovada:'Reprovada',encerrada:'Encerrada',suspensa:'Suspensa'}[v.status]||v.status||'');return'<div class="admin-linha"><div><strong>'+esc(tituloVaga(v))+'</strong><small>'+esc(v.confidencial?'Empresa confidencial':v.empresa||'')+' · '+esc(v.cidade||'')+(v.estado?' - '+esc(v.estado):'')+'</small></div><div class="admin-empresa-resumo"><span class="vaga-status '+esc(v.status||'')+'">'+esc(st)+'</span><button class="btn" onclick="adminVerVaga(\''+v.id+'\')">Analisar vaga</button></div></div>'}).join('')+'</div>':'<div class="vagas-vazio">Nenhuma vaga encontrada.</div>'}
function adminVerVaga(id){const v=ler('empregaMaisVagas').find(x=>x.id===id),box=$('#adminVagaConteudo');if(!v||!box)return;const hist=Array.isArray(v.historicoModeracao)?v.historicoModeracao:[],sal=v.salarioCombinar?'A combinar':(v.salarioMax?(v.salario+' a '+v.salarioMax):(v.salario||'Não informado'));box.innerHTML='<div class="admin-vaga-top"><span class="vaga-status '+esc(v.status||'')+'">'+esc(({pendente:'Em análise',aprovada:'Aprovada',reprovada:'Reprovada',encerrada:'Encerrada',suspensa:'Suspensa'}[v.status]||v.status||''))+'</span><h2>'+esc(tituloVaga(v))+'</h2><p>'+esc(v.empresa||'')+' · '+esc(v.cidade||'')+(v.estado?' - '+esc(v.estado):'')+'</p></div><div class="ficha-grid"><div class="ficha-linha"><span>Área</span><strong>'+esc(v.area||'Não informada')+'</strong></div><div class="ficha-linha"><span>Contrato</span><strong>'+esc(v.contrato||'Não informado')+'</strong></div><div class="ficha-linha"><span>Modalidade</span><strong>'+esc(v.modalidade||'Não informada')+'</strong></div><div class="ficha-linha"><span>Salário</span><strong>'+esc(sal)+'</strong></div><div class="ficha-linha"><span>Escolaridade</span><strong>'+esc(v.escolaridade||'Não informada')+'</strong></div><div class="ficha-linha"><span>Experiência</span><strong>'+esc(v.experiencia||'Não informada')+'</strong></div></div><section><h3>Descrição</h3><p>'+esc(v.descricao||'Não informada').replace(/\n/g,'<br>')+'</p></section><section><h3>Requisitos</h3><p>'+esc(v.requisitos||'Não informados').replace(/\n/g,'<br>')+'</p></section>'+(v.motivoReprovacao?'<section class="motivo-reprovacao"><h3>Motivo da reprovação</h3><p>'+esc(v.motivoReprovacao)+'</p></section>':'')+(hist.length?'<section><h3>Histórico da moderação</h3><div class="historico-candidato">'+hist.slice().reverse().map(x=>'<div><strong>'+esc(x.acao)+'</strong><span>'+new Date(x.data).toLocaleString('pt-BR')+(x.motivo?' · '+esc(x.motivo):'')+'</span></div>').join('')+'</div></section>':'')+'<div class="admin-modal-acoes">'+(v.status!=='aprovada'&&v.status!=='encerrada'?'<button class="btn btn-azul" onclick="adminAprovarVaga(\''+v.id+'\')">Aprovar vaga</button>':'')+(v.status!=='reprovada'&&v.status!=='encerrada'?'<button class="btn btn-perigo" onclick="adminReprovarVaga(\''+v.id+'\')">Reprovar vaga</button>':'')+'</div>';$('#modalAdminVaga').classList.remove('oculto')}
function fecharAdminVaga(){$('#modalAdminVaga')?.classList.add('oculto')}
function adminRegistrarModeracao(id,status,motivo){const a=ler('empregaMaisVagas'),i=a.findIndex(v=>v.id===id);if(i<0)return;a[i].status=status;a[i].moderadoEm=new Date().toISOString();a[i].historicoModeracao=Array.isArray(a[i].historicoModeracao)?a[i].historicoModeracao:[];a[i].historicoModeracao.push({acao:status==='aprovada'?'Aprovada':'Reprovada',motivo:motivo||'',data:a[i].moderadoEm});if(status==='reprovada')a[i].motivoReprovacao=motivo;else a[i].motivoReprovacao='';gravar('empregaMaisVagas',a);fecharAdminVaga();adminAba('vagas')}
function adminAprovarVaga(id){const v=ler('empregaMaisVagas').find(x=>x.id===id);if(!v)return;if(v.status==='encerrada'){alert('Uma vaga encerrada não pode ser republicada diretamente. A empresa deve duplicá-la para uma nova publicação.');return}if(v.dataEncerramento&&!vagaDentroPrazo(v)){alert('Esta vaga está com o prazo de candidatura vencido. Solicite à empresa a correção da data antes da aprovação.');return}if(confirm(v.status==='suspensa'?'Reativar e aprovar esta vaga no portal?':'Aprovar esta vaga e publicá-la no portal?'))adminRegistrarModeracao(id,'aprovada','')}
function adminReprovarVaga(id){const v=ler('empregaMaisVagas').find(x=>x.id===id);if(!v||v.status==='encerrada'){if(v?.status==='encerrada')alert('Esta vaga já foi encerrada pela empresa.');return}const motivo=prompt('Informe o motivo da reprovação para a empresa:');if(motivo===null)return;if(!motivo.trim()){alert('Informe o motivo da reprovação.');return}adminRegistrarModeracao(id,'reprovada',motivo.trim())}
function adminTabelaPessoas(a,tipo){return a.length?'<div class="admin-lista">'+a.map(x=>'<div class="admin-linha"><div><strong>'+esc(x.nome||'Sem nome')+'</strong><small>'+esc(x.email||'')+(tipo==='empresa'&&x.cnpj?' · '+esc(x.cnpj):'')+'</small></div></div>').join('')+'</div>':'<div class="vagas-vazio">Nenhum cadastro encontrado.</div>'}
function adminTabelaEmpresas(es,vs,cands){return es.length?'<div class="admin-lista">'+es.map(e=>{const vagas=vs.filter(v=>v.empresaCnpj===e.cnpj),contr=cands.filter(c=>{const v=vs.find(v=>v.id===c.vagaId);return v&&v.empresaCnpj===e.cnpj&&grupoEtapa(c.status)==='Contratados'}).length;return'<div class="admin-linha"><div><strong>'+esc(e.nome||'Empresa')+'</strong><small>'+esc(e.cnpj||'')+' · Plano '+esc((PLANOS_EMPRESA[e.plano||'basico']||PLANOS_EMPRESA.basico).nome)+'</small></div><div class="admin-empresa-resumo"><span>'+vagas.length+' vaga(s)</span><span>'+contr+' contratação(ões)</span></div></div>'}).join('')+'</div>':'<div class="vagas-vazio">Nenhuma empresa cadastrada.</div>'}
function adminTabelaContratacoes(a){return a.length?'<div class="admin-lista">'+a.map(c=>{const v=ler('empregaMaisVagas').find(x=>x.id===c.vagaId)||{};return'<div class="admin-linha"><div><strong>'+esc(c.candidato||c.nome||'Candidato')+'</strong><small>'+esc(tituloVaga(v)||c.vagaTitulo||'')+' · '+esc(v.empresa||'')+'</small></div><span class="vaga-status aprovada">Contratado</span></div>'}).join('')+'</div>':'<div class="vagas-vazio">Nenhuma contratação registrada.</div>'}
function adminCentralAssinaturasEM(es,cs,pedidos){const planoEmp=e=>(PLANOS_EMPRESA[e.plano||'basico']||PLANOS_EMPRESA.basico).nome,empAss=es.filter(e=>(e.plano&&e.plano!=='basico')||e.planoLiberadoAdmin||e.assinaturaAtiva),candAss=cs.filter(x=>x.premium||x.premiumAtivo||x.premiumCortesiaAdmin||x.planoCandidato),ativas=empAss.length+candAss.length,cortesias=empAss.filter(x=>x.planoLiberadoAdmin).length+candAss.filter(x=>x.premiumCortesiaAdmin).length;return '<div class="admin-subscriptions"><div class="admin-sub-hero"><div><span>GESTÃO COMERCIAL</span><h2>Planos e assinaturas</h2><p>Acompanhe empresas e candidatos com planos ativos, cortesias e solicitações em um único lugar.</p></div><div class="admin-sub-hero-icon">◇</div></div><div class="admin-sub-kpis"><article><span>ASSINATURAS ATIVAS</span><b>'+ativas+'</b><small>Empresas e candidatos</small></article><article><span>EMPRESAS ASSINANTES</span><b>'+empAss.length+'</b><small>Planos empresariais</small></article><article><span>CANDIDATOS ASSINANTES</span><b>'+candAss.length+'</b><small>Premium e planos</small></article><article><span>CORTESIAS ADM</span><b>'+cortesias+'</b><small>Sem cobrança</small></article><article><span>SOLICITAÇÕES</span><b>'+pedidos.length+'</b><small>Pedidos registrados</small></article></div><div class="admin-grant"><div class="admin-grant-head"><div><span>CONCESSÕES ADMINISTRATIVAS</span><h3>Conceder planos e benefícios</h3><p>Libere gratuitamente planos pagos, vagas em destaque, urgência e assinatura para candidatos.</p></div><button onclick="abrirConcessaoAdminEM()">+ Nova concessão</button></div><div class="admin-grant-history" id="adminGrantHistory">'+adminHistoricoConcessoesEM()+'</div></div><div class="admin-sub-toolbar"><div class="admin-sub-tabs"><button class="ativo" onclick="filtrarAssinaturasAdminEM(\'todos\',this)">Todos</button><button onclick="filtrarAssinaturasAdminEM(\'empresa\',this)">Empresas <b>'+empAss.length+'</b></button><button onclick="filtrarAssinaturasAdminEM(\'candidato\',this)">Candidatos <b>'+candAss.length+'</b></button></div><label>⌕ <input id="adminBuscaAssinatura" placeholder="Buscar por nome, e-mail, CNPJ ou plano" oninput="filtrarAssinaturasAdminEM(null,null)"></label></div><div class="admin-sub-table-wrap"><table class="admin-sub-table"><thead><tr><th>Assinante</th><th>Tipo</th><th>Plano</th><th>Status</th><th>Origem</th><th>Vigência</th></tr></thead><tbody id="adminAssinaturasLista">'+adminLinhasAssinaturasEM(empAss,candAss)+'</tbody></table></div><div class="admin-sub-bottom"><section><div class="admin-sub-title"><div><span>EMPRESAS</span><h3>Assinaturas empresariais</h3></div><b>'+empAss.length+'</b></div>'+adminCardsAssinaturaEmpresaEM(empAss,planoEmp)+'</section><section><div class="admin-sub-title"><div><span>CANDIDATOS</span><h3>Assinaturas de candidatos</h3></div><b>'+candAss.length+'</b></div>'+adminCardsAssinaturaCandidatoEM(candAss)+'</section></div><div class="admin-sub-requests"><div><span>SOLICITAÇÕES DE PLANO</span><h3>Pedidos e movimentações</h3><p>'+pedidos.length+' solicitação(ões) registrada(s) no portal.</p></div><button onclick="adminAba(\'financeiro\')">Abrir financeiro →</button></div></div>'}

function abrirConcessaoAdminEM(){let m=document.getElementById('adminGrantModal');if(!m){m=document.createElement('div');m.id='adminGrantModal';m.className='admin-grant-modal';document.body.appendChild(m)}const es=ler('empregaMaisEmpresas'),cs=ler('empregaMaisCandidatos');m.innerHTML='<div class="admin-grant-card"><button class="admin-grant-x" onclick="fecharConcessaoAdminEM()">×</button><span>CONCESSÃO ADMINISTRATIVA</span><h2>Liberar benefício</h2><p>O benefício será registrado como cortesia administrativa, sem cobrança.</p><label>Beneficiário<select id="grantTipo" onchange="atualizarBeneficiariosGrantEM()"><option value="empresa">Empresa</option><option value="candidato">Candidato</option></select></label><label>Empresa ou candidato<select id="grantPessoa"></select></label><label>Benefício<select id="grantBeneficio" onchange="atualizarCamposGrantEM()"><option value="plano">Plano pago</option><option value="destaque">Vagas em destaque</option><option value="urgencia">Vagas urgentes</option></select></label><label id="grantPlanoWrap">Plano<select id="grantPlano">'+Object.entries(PLANOS_EMPRESA).filter(([k])=>k!=='basico').map(([k,v])=>'<option value="'+esc(k)+'">'+esc(v.nome)+'</option>').join('')+'</select></label><label id="grantQtdWrap" style="display:none">Quantidade<input id="grantQtd" type="number" min="1" value="1"></label><label>Duração<select id="grantDuracao"><option value="30">30 dias</option><option value="90">3 meses</option><option value="180">6 meses</option><option value="365">1 ano</option><option value="0">Sem prazo definido</option></select></label><label>Observação administrativa<textarea id="grantObs" rows="2" placeholder="Opcional"></textarea></label><div class="admin-grant-actions"><button onclick="fecharConcessaoAdminEM()">Cancelar</button><button class="danger" id="grantRemoverBtn" onclick="removerBeneficioAdminEM()">Remover benefício</button><button class="prim" onclick="concederBeneficioAdminEM()">Conceder gratuitamente</button></div></div>';m.classList.add('aberto');atualizarBeneficiariosGrantEM()}
function fecharConcessaoAdminEM(){document.getElementById('adminGrantModal')?.classList.remove('aberto')}
function atualizarBeneficiariosGrantEM(){const tipo=document.getElementById('grantTipo')?.value,p=document.getElementById('grantPessoa');if(!p)return;const a=tipo==='empresa'?ler('empregaMaisEmpresas'):ler('empregaMaisCandidatos');p.innerHTML=a.map((x,i)=>'<option value="'+i+'">'+esc(x.nome||x.razaoSocial||x.email||('Cadastro '+(i+1)))+' — '+esc(x.email||x.cnpj||'')+'</option>').join('');const ben=document.getElementById('grantBeneficio');if(tipo==='candidato'&&ben){ben.innerHTML='<option value="plano">Assinatura Premium</option>'}else if(ben){ben.innerHTML='<option value="plano">Plano pago</option><option value="destaque">Vagas em destaque</option><option value="urgencia">Vagas urgentes</option>'}atualizarCamposGrantEM()}
function atualizarCamposGrantEM(){const b=document.getElementById('grantBeneficio')?.value,t=document.getElementById('grantTipo')?.value;const pw=document.getElementById('grantPlanoWrap'),qw=document.getElementById('grantQtdWrap');if(pw)pw.style.display=b==='plano'&&t==='empresa'?'':'none';if(qw)qw.style.display=b!=='plano'?'':'none'}
function concederBeneficioAdminEM(){const tipo=document.getElementById('grantTipo')?.value,idx=Number(document.getElementById('grantPessoa')?.value),beneficio=document.getElementById('grantBeneficio')?.value,dias=Number(document.getElementById('grantDuracao')?.value||0),fim=dias?new Date(Date.now()+dias*86400000).toISOString():'',obs=document.getElementById('grantObs')?.value||'';if(tipo==='empresa'){const a=ler('empregaMaisEmpresas'),x=a[idx];if(!x)return alert('Selecione uma empresa.');if(beneficio==='plano'){x.plano=document.getElementById('grantPlano')?.value||'mensal';x.planoLiberadoAdmin=true;x.planoSemCobranca=true;x.assinaturaAtiva=true;x.planoStatus='ativo';x.planoAtivadoEm=new Date().toISOString();x.planoValidoAte=fim}else{const q=Math.max(1,Number(document.getElementById('grantQtd')?.value||1));if(beneficio==='destaque')x.creditosDestaqueAdmin=Number(x.creditosDestaqueAdmin||0)+q;if(beneficio==='urgencia')x.creditosUrgenciaAdmin=Number(x.creditosUrgenciaAdmin||0)+q}gravar('empregaMaisEmpresas',a);registrarConcessaoAdminEM({tipo,nome:x.nome||x.razaoSocial||'Empresa',email:x.email||'',beneficio,plano:x.plano,quantidade:beneficio==='plano'?1:Number(document.getElementById('grantQtd')?.value||1),fim,obs})}else{const a=ler('empregaMaisCandidatos'),x=a[idx];if(!x)return alert('Selecione um candidato.');x.premium=true;x.premiumAtivo=true;x.premiumCortesiaAdmin=true;x.planoCandidato='Premium';x.premiumStatus='Ativa';x.premiumAte=fim;gravar('empregaMaisCandidatos',a);registrarConcessaoAdminEM({tipo,nome:x.nome||'Candidato',email:x.email||'',beneficio:'Premium',plano:'Premium',quantidade:1,fim,obs})}fecharConcessaoAdminEM();adminAba('planos')}
function removerBeneficioAdminEM(){const tipo=document.getElementById('grantTipo')?.value,idx=Number(document.getElementById('grantPessoa')?.value),beneficio=document.getElementById('grantBeneficio')?.value;if(!confirm('Remover este benefício do cadastro selecionado?'))return;if(tipo==='empresa'){const a=ler('empregaMaisEmpresas'),x=a[idx];if(!x)return alert('Selecione uma empresa.');if(beneficio==='plano'){x.plano='basico';x.planoLiberadoAdmin=false;x.planoSemCobranca=false;x.assinaturaAtiva=false;x.planoStatus='inativo';x.planoValidoAte=''}else if(beneficio==='destaque'){x.creditosDestaqueAdmin=0}else if(beneficio==='urgencia'){x.creditosUrgenciaAdmin=0}gravar('empregaMaisEmpresas',a);registrarConcessaoAdminEM({tipo,nome:x.nome||x.razaoSocial||'Empresa',email:x.email||'',beneficio:'Removido: '+beneficio,plano:'',quantidade:0,fim:'',obs:'Benefício removido pelo administrador',acao:'remocao'})}else{const a=ler('empregaMaisCandidatos'),x=a[idx];if(!x)return alert('Selecione um candidato.');x.premium=false;x.premiumAtivo=false;x.premiumCortesiaAdmin=false;x.planoCandidato='';x.premiumStatus='Inativa';x.premiumAte='';x.premiumAtivadoEm='';x.premiumValidoAte='';gravar('empregaMaisCandidatos',a);registrarConcessaoAdminEM({tipo,nome:x.nome||'Candidato',email:x.email||'',beneficio:'Premium removido',plano:'',quantidade:0,fim:'',obs:'Assinatura removida pelo administrador',acao:'remocao'})}fecharConcessaoAdminEM();adminAba('planos')}
function registrarConcessaoAdminEM(x){const a=ler('empregaMaisConcessoesAdmin');a.unshift(Object.assign({id:'CONC-'+Date.now(),data:new Date().toISOString(),origem:'Cortesia ADM',valor:0},x));gravar('empregaMaisConcessoesAdmin',a)}
function adminHistoricoConcessoesEM(){const a=ler('empregaMaisConcessoesAdmin');if(!a.length)return '<div class="admin-grant-empty">Nenhuma concessão administrativa registrada ainda.</div>';return a.slice(0,8).map(x=>'<div class="admin-grant-row"><i>'+esc((x.nome||'?').charAt(0))+'</i><div><b>'+esc(x.nome)+'</b><small>'+esc(x.tipo==='empresa'?'Empresa':'Candidato')+' · '+esc(x.beneficio==='plano'?(x.plano||'Plano'):x.beneficio)+(x.quantidade>1?' · '+x.quantidade+' créditos':'')+'</small></div><span><b>'+(x.acao==='remocao'?'Removido pelo ADM':'Cortesia ADM')+'</b><small>'+new Date(x.data).toLocaleDateString('pt-BR')+(x.fim?' → '+new Date(x.fim).toLocaleDateString('pt-BR'):' · sem prazo')+'</small></span></div>').join('')}
function adminLinhasAssinaturasEM(es,cs){const rows=[...es.map(e=>({tipo:'empresa',nome:e.nome||e.razaoSocial||'Empresa',sub:e.email||e.cnpj||'',plano:(PLANOS_EMPRESA[e.plano||'basico']||PLANOS_EMPRESA.basico).nome,status:e.assinaturaStatus||'Ativa',origem:e.planoLiberadoAdmin?'Cortesia ADM':'Assinatura',vig:e.planoValidoAte||e.assinaturaFim||''})),...cs.map(x=>({tipo:'candidato',nome:x.nome||'Candidato',sub:x.email||'',plano:x.planoCandidato||'Premium',status:x.premiumStatus||'Ativa',origem:x.premiumCortesiaAdmin?'Cortesia ADM':'Assinatura',vig:x.premiumAte||x.assinaturaFim||''}))];window.__adminAssinaturasEM=rows;return rows.length?rows.map(adminLinhaAssinaturaEM).join(''):'<tr><td colspan="6"><div class="admin-empty">Nenhuma assinatura ativa encontrada.</div></td></tr>'}
function adminLinhaAssinaturaEM(x){return '<tr data-tipo="'+x.tipo+'" data-busca="'+esc(cvNormaliza(x.nome+' '+x.sub+' '+x.plano))+'"><td><strong>'+esc(x.nome)+'</strong><small>'+esc(x.sub)+'</small></td><td><span class="admin-sub-type '+x.tipo+'">'+(x.tipo==='empresa'?'Empresa':'Candidato')+'</span></td><td><b>'+esc(x.plano)+'</b></td><td><span class="admin-sub-status">● '+esc(x.status)+'</span></td><td>'+esc(x.origem)+'</td><td>'+esc(x.vig?new Date(x.vig).toLocaleDateString('pt-BR'):'—')+'</td></tr>'}
function filtrarAssinaturasAdminEM(tipo,btn){if(tipo)window.__adminSubFiltro=tipo;if(btn){document.querySelectorAll('.admin-sub-tabs button').forEach(x=>x.classList.remove('ativo'));btn.classList.add('ativo')}const f=window.__adminSubFiltro||'todos',q=cvNormaliza(document.getElementById('adminBuscaAssinatura')?.value||'');document.querySelectorAll('#adminAssinaturasLista tr[data-tipo]').forEach(tr=>{tr.style.display=(f==='todos'||tr.dataset.tipo===f)&&(!q||tr.dataset.busca.includes(q))?'':'none'})}
function adminCardsAssinaturaEmpresaEM(a,planoEmp){return a.length?'<div class="admin-sub-mini">'+a.slice(0,6).map(e=>'<article><i>'+esc((e.nome||'E').charAt(0))+'</i><div><b>'+esc(e.nome||'Empresa')+'</b><small>'+esc(planoEmp(e))+(e.planoLiberadoAdmin?' · Cortesia':'')+'</small></div><span>Ativa</span></article>').join('')+'</div>':'<div class="admin-empty">Nenhuma empresa assinante.</div>'}
function adminCardsAssinaturaCandidatoEM(a){return a.length?'<div class="admin-sub-mini">'+a.slice(0,6).map(x=>'<article><i>'+esc((x.nome||'C').charAt(0))+'</i><div><b>'+esc(x.nome||'Candidato')+'</b><small>'+esc(x.planoCandidato||'Premium')+(x.premiumCortesiaAdmin?' · Cortesia':'')+'</small></div><span>Ativa</span></article>').join('')+'</div>':'<div class="admin-empty">Nenhum candidato assinante.</div>'}
function adminPlanos(es){return es.length?'<div class="admin-lista">'+es.map(e=>'<div class="admin-linha"><div><strong>'+esc(e.nome||'Empresa')+'</strong><small>'+esc(e.cnpj||'')+'</small></div><span>'+esc((PLANOS_EMPRESA[e.plano||'basico']||PLANOS_EMPRESA.basico).nome)+'</span></div>').join('')+'</div>':'<div class="vagas-vazio">Nenhuma empresa cadastrada.</div>'}
function adminTabelaDenuncias(ds,vs){return ds.length?'<div class="admin-lista">'+ds.map(d=>{const v=vs.find(x=>x.id===d.vagaId)||{},pend=d.status==='pendente';return'<div class="admin-linha"><div><strong>'+esc(tituloVaga(v)||d.vaga||'Vaga')+'</strong><small>'+esc(d.motivo||'Denúncia sem descrição')+' · '+esc(pend?'Pendente':d.status==='resolvida'?'Resolvida':'Descartada')+'</small></div><div class="admin-empresa-resumo">'+(v.id?'<button class="btn" onclick="adminVerVaga(\''+v.id+'\')">Ver vaga</button>':'')+(pend?'<button class="btn btn-perigo" onclick="adminSuspenderDenuncia(\''+d.id+'\')">Suspender vaga</button><button class="btn" onclick="adminResolverDenuncia(\''+d.id+'\',\'descartada\')">Descartar</button>':'<span class="vaga-status">'+esc(d.status)+'</span>')+'</div></div>'}).join('')+'</div>':'<div class="vagas-vazio">Nenhuma denúncia registrada.</div>'}
function adminResolverDenuncia(id,status){const a=ler('empregaMaisDenuncias'),i=a.findIndex(d=>d.id===id);if(i<0)return;a[i].status=status;a[i].resolvidaEm=new Date().toISOString();gravar('empregaMaisDenuncias',a);adminAba('denuncias')}
function adminSuspenderDenuncia(id){const ds=ler('empregaMaisDenuncias'),i=ds.findIndex(d=>d.id===id);if(i<0)return;if(!confirm('Suspender esta vaga enquanto a denúncia é analisada?'))return;const vs=ler('empregaMaisVagas'),j=vs.findIndex(v=>v.id===ds[i].vagaId);if(j>=0){vs[j].status='suspensa';vs[j].suspensaEm=new Date().toISOString();vs[j].historicoModeracao=Array.isArray(vs[j].historicoModeracao)?vs[j].historicoModeracao:[];vs[j].historicoModeracao.push({acao:'Suspensa por denúncia',motivo:ds[i].motivo||'',data:vs[j].suspensaEm});gravar('empregaMaisVagas',vs)}ds[i].status='resolvida';ds[i].acao='vaga_suspensa';ds[i].resolvidaEm=new Date().toISOString();gravar('empregaMaisDenuncias',ds);adminAba('denuncias')}
function adminAtivarExtra(id){const extras=ler('empregaMaisExtras'),i=extras.findIndex(x=>x.id===id);if(i<0)return;const ex=extras[i],vs=ler('empregaMaisVagas'),vi=vs.findIndex(v=>v.id===ex.vagaId);if(vi<0)return;if(ex.status!=='aguardando_pagamento')return;if(vs[vi].status!=='aprovada'){alert('A vaga precisa estar aprovada antes da ativação do extra.');return}ex.status='ativo';ex.ativadoEm=new Date().toISOString();if(ex.tipo==='destaque'){vs[vi].destaque=true;vs[vi].destaqueAte=new Date(Date.now()+Number(ex.dias||7)*86400000).toISOString()}if(ex.tipo==='urgencia')vs[vi].urgente=true;gravar('empregaMaisExtras',extras);gravar('empregaMaisVagas',vs);adminAba('extras')}function adminRejeitarExtra(id){const extras=ler('empregaMaisExtras'),i=extras.findIndex(x=>x.id===id);if(i<0)return;extras[i].status='cancelado';extras[i].canceladoEm=new Date().toISOString();gravar('empregaMaisExtras',extras);adminAba('extras')}function adminTabelaExtras(extras,vs){if(!extras.length)return '<div class="vagas-vazio">Nenhuma solicitação de destaque ou urgência.</div>';return '<div class="admin-lista">'+extras.map(x=>{const v=vs.find(y=>y.id===x.vagaId)||{};const nome=x.tipo==='destaque'?'Destaque por 7 dias':'Selo de urgência';return '<div class="admin-linha"><div><strong>'+esc(nome)+'</strong><small>'+esc(v.cargo||'Vaga')+' · R$ '+Number(x.valor||0).toFixed(2).replace('.',',')+' · '+(x.status==='ativo'?'Ativo':'Aguardando pagamento')+'</small></div></div>'}).join('')+'</div>'}
/* EMPREGAMAIS-ADMIN-SUPABASE-MODERACAO-V3 */
async function adminSbToken(){if(sessionStorage.getItem('empregaMaisAdmin')!=='1')throw new Error('Sessão administrativa ausente.');let t=sessionStorage.getItem(EMPREGAMAIS_SB_ADMIN_TOKEN)||'',r=sessionStorage.getItem(EMPREGAMAIS_SB_ADMIN_REFRESH)||'';if(t){try{const u=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/auth/v1/user',{method:'GET',headers:sbHeadersEM(t)});if(u?.id)return t}catch(e){}}if(r){try{const a=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:sbHeadersEM(),body:JSON.stringify({refresh_token:r})});if(a?.access_token){sessionStorage.setItem(EMPREGAMAIS_SB_ADMIN_TOKEN,a.access_token);if(a.refresh_token)sessionStorage.setItem(EMPREGAMAIS_SB_ADMIN_REFRESH,a.refresh_token);return a.access_token}}catch(e){}}throw new Error('Sessão administrativa expirada.')}
async function abrirImportadorAdminEM(){try{await adminSbToken();window.location.href='importar-vagas.html?v=4.0'}catch(e){alert('Sua sessão administrativa precisa ser renovada. Entre novamente no painel administrativo.');irPara('login-admin')}}
async function adminCarregarEmpresasSupabaseEM(){const t=await adminSbToken();const a=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/empresas?select=*&order=criado_em.desc',{method:'GET',headers:sbHeadersEM(t)});const remotas=(Array.isArray(a)?a:[]).map(x=>sbEmpresaParaLocalEM(x,''));const locais=ler('empregaMaisEmpresas'),map=new Map();locais.forEach(x=>map.set(nums(x.cnpj)||x.id,x));remotas.forEach(x=>{const k=nums(x.cnpj)||x.id,ant=map.get(k)||{};map.set(k,Object.assign({},ant,x,{senha:ant.senha||''}))});const todas=[...map.values()];gravar('empregaMaisEmpresas',todas);return todas}
async function adminCarregarVagasSupabase(){const t=await adminSbToken();const a=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&order=criado_em.desc',{method:'GET',headers:sbHeadersEM(t)});const vs=(Array.isArray(a)?a:[]).map(sbMapVagaEM);gravar('empregaMaisVagas',vs);return vs}
async function adminAtualizarStatusSupabase(id,status,motivo){const t=await adminSbToken(),body={status:status,motivo_reprovacao:motivo||null,editado_em:new Date().toISOString()};await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:Object.assign(sbHeadersEM(t),{'Prefer':'return=representation'}),body:JSON.stringify(body)});await adminCarregarVagasSupabase();adminHistoricoRegistrar(status==='aprovada'?'Vaga aprovada':status==='reprovada'?'Vaga reprovada':'Status da vaga alterado',id+(motivo?' · '+motivo:''));fecharAdminVaga();await adminAba('vagas')}
async function adminAprovarVaga(id){const v=ler('empregaMaisVagas').find(x=>x.id===id);if(!v)return;if(v.status==='encerrada'){alert('Uma vaga encerrada não pode ser republicada diretamente.');return}if(v.dataEncerramento&&!vagaDentroPrazo(v)){alert('Esta vaga está com o prazo de candidatura vencido. Solicite à empresa a correção da data.');return}if(!confirm(v.status==='suspensa'?'Reativar e aprovar esta vaga no portal?':'Aprovar esta vaga e publicá-la no portal?'))return;try{await adminAtualizarStatusSupabase(id,'aprovada','');alert('Vaga aprovada e atualizada no Supabase.')}catch(err){console.error('ADM aprovação Supabase:',err);alert('Não foi possível aprovar no banco: '+err.message)}}
async function adminReprovarVaga(id){const v=ler('empregaMaisVagas').find(x=>x.id===id);if(!v||v.status==='encerrada')return;const motivo=prompt('Informe o motivo da reprovação para a empresa:');if(motivo===null)return;if(!motivo.trim()){alert('Informe o motivo da reprovação.');return}try{await adminAtualizarStatusSupabase(id,'reprovada',motivo.trim());alert('Vaga reprovada e atualizada no Supabase.')}catch(err){console.error('ADM reprovação Supabase:',err);alert('Não foi possível reprovar no banco: '+err.message)}}
async function adminPatchVaga(id,body){const t=await adminSbToken();await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:Object.assign(sbHeadersEM(t),{'Prefer':'return=representation'}),body:JSON.stringify(Object.assign({},body,{editado_em:new Date().toISOString()}))});await adminCarregarVagasSupabase()}
async function adminAlternarDestaqueVaga(id){const v=ler('empregaMaisVagas').find(x=>x.id===id);if(!v)return;try{await adminPatchVaga(id,{destaque:!v.destaque,destaque_solicitado:false});adminHistoricoRegistrar(v.destaque?'Destaque removido':'Vaga destacada',tituloVaga(v));adminVerVaga(id)}catch(e){alert('Não foi possível alterar o destaque: '+e.message)}}
async function adminAlternarUrgenciaVaga(id){const v=ler('empregaMaisVagas').find(x=>x.id===id);if(!v)return;try{await adminPatchVaga(id,{urgente:!v.urgente,urgencia_solicitada:false});adminHistoricoRegistrar(v.urgente?'Urgência removida':'Urgência adicionada',tituloVaga(v));adminVerVaga(id)}catch(e){alert('Não foi possível alterar a urgência: '+e.message)}}
async function adminExcluirVaga(id){const v=ler('empregaMaisVagas').find(x=>x.id===id);if(!v||!confirm('Excluir definitivamente a vaga “'+tituloVaga(v)+'”? Esta ação não poderá ser desfeita.'))return;try{const t=await adminSbToken();await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?id=eq.'+encodeURIComponent(id),{method:'DELETE',headers:Object.assign(sbHeadersEM(t),{'Prefer':'return=representation'})});adminHistoricoRegistrar('Vaga excluída',tituloVaga(v));await adminCarregarVagasSupabase();fecharAdminVaga();await adminAba('vagas')}catch(e){alert('Não foi possível excluir a vaga: '+e.message)}}
function adminEditarVaga(id){const v=ler('empregaMaisVagas').find(x=>x.id===id);if(!v)return;const box=$('#adminVagaConteudo');box.innerHTML='<div class="admin-vaga-top"><h2>Editar vaga</h2><p>Altere os dados e salve diretamente no Supabase.</p></div><div class="ficha-grid"><label class="ficha-linha"><span>Cargo</span><input id="admEdCargo" value="'+esc(v.cargo||'')+'"></label><label class="ficha-linha"><span>Empresa</span><input id="admEdEmpresa" value="'+esc(v.empresa||'')+'"></label><label class="ficha-linha"><span>Área</span><input id="admEdArea" value="'+esc(v.area||'')+'"></label><label class="ficha-linha"><span>Cidade</span><input id="admEdCidade" value="'+esc(v.cidade||'')+'"></label><label class="ficha-linha"><span>UF</span><input id="admEdEstado" value="'+esc(v.estado||'')+'"></label><label class="ficha-linha"><span>Salário</span><input id="admEdSalario" value="'+esc(v.salario||'')+'"></label></div><label style="display:block;margin-top:14px"><b>Descrição</b><textarea id="admEdDescricao" style="width:100%;min-height:130px;margin-top:7px">'+esc(v.descricao||'')+'</textarea></label><label style="display:block;margin-top:14px"><b>Requisitos</b><textarea id="admEdRequisitos" style="width:100%;min-height:110px;margin-top:7px">'+esc(v.requisitos||'')+'</textarea></label><label style="display:block;margin-top:14px"><b>Logo da empresa</b><input type="file" id="admEdLogo" accept="image/png,image/jpeg,image/webp" style="display:block;margin-top:7px"></label>'+(v.logo?'<img src="'+esc(v.logo)+'" alt="Logo atual" style="width:80px;height:80px;object-fit:contain;border:1px solid #dce6e8;border-radius:12px;margin-top:10px;padding:5px">':'')+'<div class="admin-modal-acoes"><button class="btn" onclick="adminVerVaga(\''+id+'\')">Cancelar</button><button class="btn btn-azul" id="admSalvarEdicao">Salvar alterações</button></div>';document.getElementById('admSalvarEdicao').onclick=async function(){let logo=v.logo||null,file=document.getElementById('admEdLogo').files[0];if(file){if(file.size>700000)return alert('A logo deve ter no máximo 700 KB.');logo=await new Promise((ok,fail)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=fail;r.readAsDataURL(file)})}const body={cargo:document.getElementById('admEdCargo').value.trim(),empresa:document.getElementById('admEdEmpresa').value.trim(),area:document.getElementById('admEdArea').value.trim(),cidade:document.getElementById('admEdCidade').value.trim(),estado:document.getElementById('admEdEstado').value.trim(),salario:document.getElementById('admEdSalario').value.trim(),descricao:document.getElementById('admEdDescricao').value.trim(),requisitos:document.getElementById('admEdRequisitos').value.trim(),logo:logo};try{this.disabled=true;this.textContent='Salvando...';await adminPatchVaga(id,body);adminHistoricoRegistrar('Vaga editada',body.cargo);adminVerVaga(id)}catch(e){this.disabled=false;this.textContent='Salvar alterações';alert('Não foi possível salvar: '+e.message)}}}
async function adminSolicitarCorrecaoVaga(id){const motivo=prompt('Informe o que a empresa precisa corrigir:');if(motivo===null||!motivo.trim())return;try{await adminAtualizarStatusSupabase(id,'pendente',motivo.trim());adminHistoricoRegistrar('Correção solicitada',id+' · '+motivo.trim());alert('Solicitação de correção registrada.')}catch(err){alert('Não foi possível registrar a solicitação: '+err.message)}}
const adminVerVagaLocal=adminVerVaga;
adminVerVaga=function(id){adminVerVagaLocal(id);const box=$('#adminVagaConteudo'),v=ler('empregaMaisVagas').find(x=>x.id===id);if(!box||!v)return;const a=box.querySelector('.admin-modal-acoes');if(!a)return;const add=(txt,cls,fn)=>{const b=document.createElement('button');b.className='btn '+(cls||'');b.textContent=txt;b.onclick=fn;a.appendChild(b)};add('Editar vaga','',()=>adminEditarVaga(id));add(v.destaque?'Retirar destaque':'Colocar em destaque','',()=>adminAlternarDestaqueVaga(id));add(v.urgente?'Remover urgência':'Marcar como urgente','',()=>adminAlternarUrgenciaVaga(id));if(v.status!=='encerrada')add('Solicitar correção','admin-correcao-btn',()=>adminSolicitarCorrecaoVaga(id));add('Excluir vaga','btn-perigo',()=>adminExcluirVaga(id))}
async function adminCarregarCandidatosSupabaseEM(){
 const t=await adminSbToken();
 const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/candidatos?select=*&order=criado_em.desc',{method:'GET',headers:sbHeadersEM(t)});
 const todas=(Array.isArray(rows)?rows:[]).map(x=>({id:x.id||'',userId:x.user_id||'',nome:x.nome||'',email:String(x.email||'').toLowerCase(),telefone:x.telefone||'',cidade:x.cidade||'',perfil:(x.perfil&&typeof x.perfil==='object')?x.perfil:{},premium:x.premium===true,premiumAtivo:x.premium===true,premiumCortesiaAdmin:x.premium_cortesia_admin===true,planoCandidato:x.premium===true?'premium':'',premiumAtivadoEm:x.premium_ativado_em||'',premiumValidoAte:x.premium_valido_ate||'',criadoEm:x.criado_em||'',atualizadoEm:x.atualizado_em||''}));
 gravar('empregaMaisCandidatos',todas);return todas
}
async function adminSincronizarPainelSupabase(){let ok=true;try{await adminCarregarVagasSupabase()}catch(err){console.error('ADM sincronização vagas Supabase:',err);ok=false}try{await adminCarregarEmpresasSupabaseEM()}catch(err){console.error('ADM sincronização empresas Supabase:',err);ok=false}try{await adminCarregarCandidatosSupabaseEM()}catch(err){console.error('ADM sincronização candidatos Supabase:',err);ok=false}return ok}
/* EMPREGAMAIS-ADMIN-CENTRAL-FUNCOES-V2 */
function adminHistoricoRegistrar(acao,detalhe){const a=ler('empregaMaisHistoricoAdmin');a.unshift({id:'adm_'+Date.now(),acao,detalhe:detalhe||'',data:new Date().toISOString(),admin:sessionStorage.getItem('empregaMaisAdminEmail')||'Administrador'});gravar('empregaMaisHistoricoAdmin',a.slice(0,300))}
function adminConcederPlano(cnpj){const sel=document.getElementById('adminPlano_'+nums(cnpj)),vig=document.getElementById('adminVigencia_'+nums(cnpj));if(!sel)return;const es=ler('empregaMaisEmpresas'),i=es.findIndex(e=>nums(e.cnpj)===nums(cnpj));if(i<0)return alert('Empresa não encontrada.');const dias=Number(vig?.value||30),agora=new Date(),fim=new Date(agora.getTime()+dias*86400000);es[i].plano=sel.value;es[i].planoStatus='ativo';es[i].planoLiberadoAdmin=true;es[i].planoSemCobranca=true;es[i].planoAtivadoEm=agora.toISOString();es[i].planoValidoAte=fim.toISOString();gravar('empregaMaisEmpresas',es);adminHistoricoRegistrar('Plano concedido', (es[i].nome||'Empresa')+' · '+(PLANOS_EMPRESA[sel.value]?.nome||sel.value)+' · cortesia '+dias+' dias');alert('Plano liberado como cortesia administrativa.');adminAba('empresas')}
function adminConcederRecurso(cnpj,tipo){const es=ler('empregaMaisEmpresas'),i=es.findIndex(e=>nums(e.cnpj)===nums(cnpj));if(i<0)return;es[i].recursosAdmin=es[i].recursosAdmin||{};es[i].recursosAdmin[tipo]=Number(es[i].recursosAdmin[tipo]||0)+1;gravar('empregaMaisEmpresas',es);adminHistoricoRegistrar('Recurso concedido',(es[i].nome||'Empresa')+' · +1 '+tipo);alert('Recurso administrativo concedido.')}
function adminAlternarEmpresa(cnpj){const es=ler('empregaMaisEmpresas'),i=es.findIndex(e=>nums(e.cnpj)===nums(cnpj));if(i<0)return;es[i].suspensaAdmin=!es[i].suspensaAdmin;gravar('empregaMaisEmpresas',es);adminHistoricoRegistrar(es[i].suspensaAdmin?'Empresa suspensa':'Empresa reativada',es[i].nome||cnpj);adminAba('empresas')}
function adminPremiumCandidato(email){const cs=ler('empregaMaisCandidatos'),i=cs.findIndex(x=>(x.email||'').toLowerCase()===String(email).toLowerCase());if(i<0)return;const dias=Number(prompt('Quantos dias de Premium gratuito?', '30'));if(!dias||dias<1)return;cs[i].premium=true;cs[i].premiumCortesiaAdmin=true;cs[i].premiumAtivadoEm=new Date().toISOString();cs[i].premiumValidoAte=new Date(Date.now()+dias*86400000).toISOString();gravar('empregaMaisCandidatos',cs);adminHistoricoRegistrar('Premium concedido',(cs[i].nome||email)+' · '+dias+' dias');adminAba('candidatos')}
function adminRemoverPremium(email){const cs=ler('empregaMaisCandidatos'),i=cs.findIndex(x=>(x.email||'').toLowerCase()===String(email).toLowerCase());if(i<0)return;cs[i].premium=false;cs[i].premiumCortesiaAdmin=false;gravar('empregaMaisCandidatos',cs);adminHistoricoRegistrar('Premium removido',cs[i].nome||email);adminAba('candidatos')}
function adminFormatarCnpjEM(v){const n=nums(v||'');return n.length===14?n.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,'$1.$2.$3/$4-$5'):(v||'CNPJ não informado')}
function adminLogoEmpresaEM(e){const logo=e.logo||e.perfil?.logo||'';return logo?'<img src="'+esc(logo)+'" alt="Logo de '+esc(e.nome||'empresa')+'">':'<span>'+esc(String(e.nome||'E').trim().charAt(0).toUpperCase()||'E')+'</span>'}
function adminEmpresaCards(es){if(!es.length)return '<div class="admin-empty">Nenhuma empresa cadastrada.</div>';return '<div class="admin2-empresas-grid">'+es.map(e=>'<article class="admin2-empresa-card"><div class="admin2-empresa-logo">'+adminLogoEmpresaEM(e)+'</div><div class="admin2-empresa-info"><h3>'+esc(e.nome||e.nomeFantasia||'Empresa')+'</h3><p>'+esc(adminFormatarCnpjEM(e.cnpj))+'</p></div><button class="admin2-ver-empresa" type="button" onclick="adminAbrirEmpresaEM(\''+esc(e.cnpj||'')+'\')">Ver empresa →</button></article>').join('')+'</div>'}
function adminAbrirEmpresaEM(cnpj){const e=ler('empregaMaisEmpresas').find(x=>nums(x.cnpj)===nums(cnpj));if(!e)return alert('Empresa não encontrada.');const out=document.getElementById('adminConteudo');if(!out)return;const p=PLANOS_EMPRESA[e.plano||'basico']||PLANOS_EMPRESA.basico,id=nums(e.cnpj),status=e.verificada||e.verificacaoStatus==='aprovada'?'Verificada':e.verificacaoStatus==='pendente'||e.verificacaoStatus==='em_analise'?'Em análise':e.verificacaoStatus==='reprovada'?'Reprovada':'Não verificada',vs=ler('empregaMaisVagas').filter(v=>nums(v.empresaCnpj||v.cnpjEmpresa||'')===id||String(v.empresaId||'')===String(e.id||''));admin2AtualizarCabecalhoEM('empresas');const t=document.getElementById('admin2Titulo'),sub=document.getElementById('admin2Subtitulo');if(t)t.textContent=e.nome||e.nomeFantasia||'Empresa';if(sub)sub.textContent='Cadastro completo e controles administrativos da empresa.';out.innerHTML='<button class="admin2-voltar-empresas" type="button" onclick="adminAba(\'empresas\')">← Voltar para empresas</button><section class="admin2-empresa-detalhe"><header><div class="admin2-empresa-logo grande">'+adminLogoEmpresaEM(e)+'</div><div><span class="admin-pill">'+esc(status)+'</span><h2>'+esc(e.nome||e.nomeFantasia||'Empresa')+'</h2><p>'+esc(adminFormatarCnpjEM(e.cnpj))+'</p></div></header><div class="admin2-ficha-grid"><div><small>E-mail</small><strong>'+esc(e.email||'Não informado')+'</strong></div><div><small>E-mail corporativo</small><strong>'+esc(e.emailCorporativo||'Não informado')+'</strong></div><div><small>Razão social</small><strong>'+esc(e.razaoSocial||'Não informada')+'</strong></div><div><small>Setor</small><strong>'+esc(e.setor||'Não informado')+'</strong></div><div><small>Matriz / Localização</small><strong>'+esc(e.matriz||'Não informada')+'</strong></div><div><small>Funcionários</small><strong>'+esc(e.funcionarios||'Não informado')+'</strong></div><div><small>Site</small><strong>'+esc(e.site||'Não informado')+'</strong></div><div><small>Plano atual</small><strong>'+esc(p.nome||e.plano||'Grátis')+(e.planoLiberadoAdmin?' · Cortesia ADM':'')+'</strong></div><div><small>Status do plano</small><strong>'+esc(e.planoStatus||'Ativo')+'</strong></div><div><small>Vagas vinculadas</small><strong>'+vs.length+'</strong></div><div><small>Verificação</small><strong>'+esc(status)+'</strong></div><div><small>Validade do plano</small><strong>'+esc(e.planoValidoAte?new Date(e.planoValidoAte).toLocaleDateString('pt-BR'):'Não informada')+'</strong></div></div>'+(e.sobre||e.sobreInstitucional?'<div class="admin2-sobre"><small>Sobre a empresa</small><p>'+esc(e.sobreInstitucional||e.sobre)+'</p></div>':'')+'<div class="admin2-controle"><h3>Controle administrativo</h3><p>Recursos e concessões ficam concentrados dentro da ficha da empresa.</p><div class="admin-form-inline"><select id="adminPlano_'+id+'"><option value="basico">Grátis</option><option value="mensal">Mensal</option><option value="trimestral">Trimestral</option><option value="semestral">Semestral</option><option value="anual">Anual</option></select><select id="adminVigencia_'+id+'"><option value="30">30 dias</option><option value="90">90 dias</option><option value="180">180 dias</option><option value="365">365 dias</option></select><button onclick="adminConcederPlano(\''+esc(e.cnpj||'')+'\')">Liberar plano</button></div><div class="admin-tools"><button onclick="adminConcederRecurso(\''+esc(e.cnpj||'')+'\',\'destaques\')">+ Destaque</button><button onclick="adminConcederRecurso(\''+esc(e.cnpj||'')+'\',\'urgentes\')">+ Urgente</button><button onclick="adminConcederRecurso(\''+esc(e.cnpj||'')+'\',\'vagas\')">+ Vaga</button><button onclick="adminAlternarEmpresa(\''+esc(e.cnpj||'')+'\')">'+(e.suspensaAdmin?'Reativar empresa':'Suspender empresa')+'</button></div></div></section>'}
function adminCandidatoCards(cs){if(!cs.length)return '<div class="admin-empty">Nenhum candidato cadastrado.</div>';return cs.map(x=>'<div class="admin-table-card"><div><h3>'+esc(x.nome||'Candidato')+' '+(x.premium?'<span class="admin-pill">PREMIUM</span>':'')+'</h3><p>'+esc(x.email||'')+(x.cidade?' · '+esc(x.cidade):'')+'</p></div><div class="admin-tools">'+(x.premium?'<button onclick="adminRemoverPremium(\''+esc(x.email||'')+'\')">Remover Premium</button>':'<button onclick="adminPremiumCandidato(\''+esc(x.email||'')+'\')">Liberar Premium grátis</button>')+'</div></div>').join('')}
function adminPremiumCandidatosPainelEM(cs){const ativos=cs.filter(c=>candidatoPremiumAtivoEM(c));return '<div class="admin-premium-cand"><div class="admin-premium-hero"><div><span>PREMIUM CANDIDATOS</span><h2>Conceder acesso Premium</h2><p>Libere Premium como cortesia administrativa e acompanhe os acessos ativos.</p></div><div><b>'+ativos.length+'</b><small>Premium ativo(s)</small></div></div><div class="admin-premium-toolbar"><label>Buscar candidato<input id="adminBuscaPremiumCand" type="search" placeholder="Nome ou e-mail" oninput="adminFiltrarPremiumCandidatosEM()"></label><span>'+cs.length+' candidato(s) cadastrado(s)</span></div><div id="adminPremiumCandLista" class="admin-premium-list">'+adminPremiumCandidatoLinhasEM(cs)+'</div></div>'}
function adminPremiumCandidatoLinhasEM(cs){if(!cs.length)return '<div class="admin-empty">Nenhum candidato cadastrado.</div>';return cs.map(c=>{const ativo=candidatoPremiumAtivoEM(c),ate=c.premiumValidoAte?new Date(c.premiumValidoAte).toLocaleDateString('pt-BR'):'Sem data definida';return '<article class="admin-premium-row" data-premium-busca="'+esc(((c.nome||'')+' '+(c.email||'')).toLowerCase())+'"><div class="admin-premium-avatar">'+esc(String(c.nome||'C').trim().charAt(0).toUpperCase())+'</div><div class="admin-premium-ident"><strong>'+esc(c.nome||'Candidato')+'</strong><span>'+esc(c.email||'')+'</span></div><div class="admin-premium-status '+(ativo?'ativo':'gratis')+'"><small>PLANO</small><b>'+(ativo?'Premium':'Gratuito')+'</b>'+(ativo?'<span>até '+ate+'</span>':'<span>Sem assinatura Premium</span>')+'</div><div class="admin-premium-actions">'+(ativo?'<button class="remover" onclick="adminRemoverPremiumEM2(\''+esc(c.email||'')+'\')">Remover Premium</button>':'<button onclick="adminConcederPremiumEM2(\''+esc(c.email||'')+'\',30)">30 dias</button><button onclick="adminConcederPremiumEM2(\''+esc(c.email||'')+'\',90)">90 dias</button><button onclick="adminConcederPremiumEM2(\''+esc(c.email||'')+'\',365)">1 ano</button>')+'</div></article>'}).join('')}
function adminFiltrarPremiumCandidatosEM(){const q=(document.getElementById('adminBuscaPremiumCand')?.value||'').trim().toLowerCase();document.querySelectorAll('#adminPremiumCandLista .admin-premium-row').forEach(el=>el.style.display=!q||String(el.dataset.premiumBusca||'').includes(q)?'grid':'none')}
async function adminConcederPremiumEM2(email,dias){
 const cs=ler('empregaMaisCandidatos'),i=cs.findIndex(x=>(x.email||'').toLowerCase()===String(email).toLowerCase());if(i<0)return;
 const agora=new Date().toISOString(),fim=new Date(Date.now()+Number(dias)*86400000).toISOString();
 try{
  const t=await adminSbToken();
  await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/candidatos?email=eq.'+encodeURIComponent(String(email).toLowerCase()),{method:'PATCH',headers:Object.assign(sbHeadersEM(t),{'Prefer':'return=representation'}),body:JSON.stringify({premium:true,premium_cortesia_admin:true,premium_ativado_em:agora,premium_valido_ate:fim})});
  await adminCarregarCandidatosSupabaseEM();
  const atual=ler('empregaMaisCandidatos').find(x=>(x.email||'').toLowerCase()===String(email).toLowerCase());
  if(!atual?.premium)throw new Error('O Premium não foi confirmado pelo banco de dados.');
  adminHistoricoRegistrar('Premium concedido',(atual.nome||email)+' · '+dias+' dias');
  await adminAba('premium-candidatos')
 }catch(err){console.error('Premium candidato / Supabase:',err);alert('Não foi possível conceder o Premium: '+err.message);await adminAba('premium-candidatos')}
}
async function adminRemoverPremiumEM2(email){
 const cs=ler('empregaMaisCandidatos'),i=cs.findIndex(x=>(x.email||'').toLowerCase()===String(email).toLowerCase());if(i<0)return;
 try{
  const t=await adminSbToken();
  await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/candidatos?email=eq.'+encodeURIComponent(String(email).toLowerCase()),{method:'PATCH',headers:Object.assign(sbHeadersEM(t),{'Prefer':'return=representation'}),body:JSON.stringify({premium:false,premium_cortesia_admin:false,premium_ativado_em:null,premium_valido_ate:null})});
  await adminCarregarCandidatosSupabaseEM();
  const atual=ler('empregaMaisCandidatos').find(x=>(x.email||'').toLowerCase()===String(email).toLowerCase());
  if(atual?.premium)throw new Error('A remoção do Premium não foi confirmada pelo banco de dados.');
  adminHistoricoRegistrar('Premium removido',atual?.nome||email);
  await adminAba('premium-candidatos')
 }catch(err){console.error('Remoção Premium candidato / Supabase:',err);alert('Não foi possível remover o Premium: '+err.message);await adminAba('premium-candidatos')}
}
async function adminAba(aba,btn){if(sessionStorage.getItem('empregaMaisAdmin')!=='1'){irPara('login-admin');return}document.querySelectorAll('[data-admin-tab]').forEach(b=>b.classList.toggle('ativo',b.dataset.adminTab===aba));const out=$('#adminConteudo');if(!out)return;if(!window.__adminSbSyncing){window.__adminSbSyncing=true;await adminSincronizarPainelSupabase();window.__adminSbSyncing=false}const vs=ler('empregaMaisVagas'),es=ler('empregaMaisEmpresas'),cs=ler('empregaMaisCandidatos'),cands=candidaturas(),pend=vs.filter(v=>v.status==='pendente'),contr=cands.filter(c=>grupoEtapa(c.status)==='Contratados'),den=ler('empregaMaisDenuncias'),hist=ler('empregaMaisHistoricoAdmin'),pedidos=ler('empregaMaisPedidosPlano'),extras=ler('empregaMaisExtras');const badge=$('#adminBadgeVagas');if(badge){badge.textContent=pend.length||'';badge.style.display=pend.length?'grid':'none'}
 if(aba==='geral'){out.innerHTML='<div class="admin-metricas"><article role="button" tabindex="0" onclick="adminAba(\'vagas\')"><span>Vagas em análise</span><strong>'+pend.length+'</strong></article><article role="button" tabindex="0" onclick="adminAba(\'vagas\')"><span>Vagas publicadas</span><strong>'+vs.filter(v=>v.status==='aprovada').length+'</strong></article><article role="button" tabindex="0" onclick="adminAba(\'empresas\')"><span>Empresas</span><strong>'+es.length+'</strong></article><article role="button" tabindex="0" onclick="adminAba(\'candidatos\')"><span>Candidatos</span><strong>'+cs.length+'</strong></article><article role="button" tabindex="0" onclick="adminAba(\'contratacoes\')"><span>Contratações</span><strong>'+contr.length+'</strong></article></div><h2 class="admin-dashboard-title">Ações rápidas</h2><div class="admin-acoes-rapidas"><button class="admin-acao-card" onclick="adminAba(\'vagas\')"><b>Analisar vagas</b><small>'+pend.length+' aguardando moderação</small></button><button class="admin-acao-card" onclick="adminAba(\'empresas\')"><b>Gerenciar empresas</b><small>Planos, recursos e contas</small></button><button class="admin-acao-card" onclick="adminAba(\'candidatos\')"><b>Gerenciar candidatos</b><small>Premium e cadastros</small></button><button class="admin-acao-card" onclick="adminAba(\'denuncias\')"><b>Denúncias</b><small>'+den.filter(d=>d.status==='pendente').length+' pendente(s)</small></button></div><div class="admin-section-grid"><div class="admin-bloco"><h2>Vagas aguardando análise</h2>'+(pend.length?adminTabelaVagas(pend.slice(0,5)):'<div class="admin-empty">Nenhuma vaga aguardando análise.</div>')+'</div><div class="admin-bloco"><h2>Atividade administrativa</h2><div class="admin-mini-list">'+(hist.length?hist.slice(0,6).map(x=>'<div class="admin-mini-item"><div><strong>'+esc(x.acao)+'</strong><small>'+esc(x.detalhe||'')+'</small></div></div>').join(''):'<div class="admin-empty">Nenhuma ação registrada.</div>')+'</div></div></div>';return}
 if(aba==='vagas'){out.innerHTML='<div class="admin-bloco"><h2>Gestão de vagas</h2><p class="admin-sub">Analise, aprove, reprove, suspenda e acompanhe as oportunidades do portal.</p>'+adminTabelaVagas(vs)+'</div>';return}
 if(aba==='empresas'){out.innerHTML='<div class="admin-bloco admin2-empresas-lista"><div class="admin2-lista-head"><div><h2>Empresas cadastradas</h2><p class="admin-sub">Consulte as empresas cadastradas no + Empregos.</p></div><span>'+es.length+' empresa(s)</span></div>'+adminEmpresaCards(es)+'</div>';return}
 if(aba==='candidatos'){out.innerHTML='<div class="admin-bloco"><h2>Candidatos</h2><p class="admin-sub">Controle cadastros e libere Premium como cortesia administrativa.</p>'+adminCandidatoCards(cs)+'</div>';return}
 if(aba==='contratacoes'){out.innerHTML='<div class="admin-bloco"><h2>Contratações registradas</h2>'+adminTabelaContratacoes(contr)+'</div>';return}
 if(aba==='denuncias'){out.innerHTML='<div class="admin-bloco"><h2>Denúncias e moderação</h2>'+adminTabelaDenuncias(den,vs)+'</div>';return}
 if(aba==='extras'){out.innerHTML='<div class="admin-bloco"><h2>Extras e benefícios</h2>'+adminTabelaExtras(extras,vs)+'</div>';return}
 if(aba==='planos'){out.innerHTML=adminCentralAssinaturasEM(es,cs,pedidos);return}
 if(aba==='premium-candidatos'){out.innerHTML=adminPremiumCandidatosPainelEM(cs);return}
 if(aba==='financeiro'){out.innerHTML='<div class="admin-bloco"><h2>Financeiro</h2><div class="admin-metricas"><article><span>Pedidos de plano</span><strong>'+pedidos.length+'</strong></article><article><span>Extras solicitados</span><strong>'+extras.length+'</strong></article><article><span>Cortesias de plano</span><strong>'+es.filter(e=>e.planoLiberadoAdmin).length+'</strong></article><article><span>Premium cortesia</span><strong>'+cs.filter(x=>x.premiumCortesiaAdmin).length+'</strong></article></div></div>';return}
 if(aba==='relatorios'){out.innerHTML='<div class="admin-bloco"><h2>Relatórios do portal</h2><p class="admin-sub">Vagas: '+vs.length+' · Empresas: '+es.length+' · Candidatos: '+cs.length+' · Candidaturas: '+cands.length+' · Contratações: '+contr.length+'</p></div>';return}
 if(aba==='historico'){out.innerHTML='<div class="admin-bloco"><h2>Histórico administrativo</h2>'+(hist.length?'<div class="admin-lista">'+hist.map(x=>'<div class="admin-linha"><div><strong>'+esc(x.acao)+'</strong><small>'+esc(x.detalhe||'')+' · '+new Date(x.data).toLocaleString('pt-BR')+'</small></div></div>').join('')+'</div>':'<div class="admin-empty">Nenhuma ação administrativa registrada.</div>')+'</div>';return}
 if(aba==='configuracoes'){out.innerHTML='<div class="admin-bloco"><h2>Configurações administrativas</h2><div class="admin-warning">Esta área centralizará regras globais do portal. Alterações sensíveis serão adicionadas somente quando estiverem persistidas com segurança no Supabase.</div><div class="admin-table-card"><div><h3>Moderação de vagas</h3><p>Aprovação, reprovação, suspensão e histórico.</p></div><span class="admin-pill">ATIVO</span></div><div class="admin-table-card"><div><h3>Concessões administrativas</h3><p>Planos empresariais, recursos extras e Premium para candidatos.</p></div><span class="admin-pill">ATIVO</span></div></div>';return}
}
function renderizarVagasSenior(){const box=$('#listaVagasSenior');if(!box)return;const a=vagasPublicas().filter(v=>v.senior50);box.innerHTML=a.length?a.map(v=>'<article class="vaga-card portal-vaga" onclick="abrirVaga(\''+v.id+'\')"><span class="tag">50+</span><h3>'+esc(tituloVaga(v))+'</h3><p>'+esc(v.confidencial?'Empresa confidencial':v.empresa||'')+'</p><div class="vaga-meta"><span>'+esc(v.cidade||'')+'</span><span>'+esc(v.modalidade||'')+'</span></div></article>').join(''):'<div class="vagas-vazio"><strong>Nenhuma vaga 50+ publicada agora</strong><span>Novas oportunidades aparecerão aqui quando forem aprovadas.</span></div>'}
function filtrarSenior(){renderizarVagasSenior();document.querySelector('#listaVagasSenior')?.scrollIntoView({behavior:'smooth'})}


(function(){function iniciarNavegacao(){document.querySelectorAll('[data-rota]').forEach(function(el){el.addEventListener('click',function(ev){ev.preventDefault();var rota=el.getAttribute('data-rota');if(typeof irPara==='function')irPara(rota);else location.href=location.pathname+'?pagina='+encodeURIComponent(rota);});});var rota=new URLSearchParams(location.search).get('pagina');if(rota&&typeof abrirRota==='function')abrirRota(rota);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciarNavegacao);else iniciarNavegacao();})();

/* =========================================================
   EMPREGAMAIS — SUPABASE REAL / EMPRESAS + AUTH
   Banco central: projeto + Empregos
========================================================= */
const EMPREGAMAIS_SUPABASE_URL="https://mkezlcewyengejdmtppl.supabase.co";
const EMPREGAMAIS_SUPABASE_KEY="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
const EMPREGAMAIS_SB_TOKEN="empregaMaisSupabaseAccessToken";
const EMPREGAMAIS_SB_REFRESH="empregaMaisSupabaseRefreshToken";
const EMPREGAMAIS_SB_ADMIN_TOKEN="empregaMaisAdminSupabaseAccessToken";
const EMPREGAMAIS_SB_ADMIN_REFRESH="empregaMaisAdminSupabaseRefreshToken";
function sbEmailEmpresaEM(cnpj){return nums(cnpj)+"@auth.empregamais.com.br"}
function sbHeadersEM(token){const h={"apikey":EMPREGAMAIS_SUPABASE_KEY,"Content-Type":"application/json"};if(token)h.Authorization="Bearer "+token;return h}
function sbJsonEM(url,opt){return fetch(url,opt).then(async r=>{const t=await r.text();let j={};try{j=t?JSON.parse(t):{}}catch(e){}if(!r.ok)throw new Error(j.msg||j.message||j.error_description||j.error||("Erro "+r.status));return j})}
function sbSalvarSessaoEM(a){if(localStorage.getItem('empregaMaisLogoutBloqueio')==='1'||sessionStorage.getItem('empregaMaisLogoutBloqueio')==='1')return;if(a?.access_token){sessionStorage.setItem(EMPREGAMAIS_SB_TOKEN,a.access_token);localStorage.setItem(EMPREGAMAIS_SB_TOKEN,a.access_token)}if(a?.refresh_token){sessionStorage.setItem(EMPREGAMAIS_SB_REFRESH,a.refresh_token);localStorage.setItem(EMPREGAMAIS_SB_REFRESH,a.refresh_token)}}
function sbTokenEM(){return sessionStorage.getItem(EMPREGAMAIS_SB_TOKEN)||localStorage.getItem(EMPREGAMAIS_SB_TOKEN)||""}
function sbRefreshTokenEM(){return sessionStorage.getItem(EMPREGAMAIS_SB_REFRESH)||localStorage.getItem(EMPREGAMAIS_SB_REFRESH)||""}
async function sbGarantirSessaoEM(){
 if(localStorage.getItem('empregaMaisLogoutBloqueio')==='1'||sessionStorage.getItem('empregaMaisLogoutBloqueio')==='1'){
  [EMPREGAMAIS_SB_TOKEN,EMPREGAMAIS_SB_REFRESH].forEach(k=>{sessionStorage.removeItem(k);localStorage.removeItem(k)});
  sessionStorage.removeItem('empregaMaisPapel');localStorage.removeItem('empregaMaisPapelPersistido');
  return "";
 }
 const token=sbTokenEM(),refresh=sbRefreshTokenEM();
 if(token){try{await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/auth/v1/user",{method:"GET",headers:sbHeadersEM(token)});return token}catch(e){}}
 if(!refresh){
  sessionStorage.removeItem(EMPREGAMAIS_SB_TOKEN);localStorage.removeItem(EMPREGAMAIS_SB_TOKEN);
  sessionStorage.removeItem('empregaMaisPapel');localStorage.removeItem('empregaMaisPapelPersistido');
  return "";
 }
 try{
  const a=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:sbHeadersEM(),body:JSON.stringify({refresh_token:refresh})});
  sbSalvarSessaoEM(a);return a.access_token||""
 }catch(e){
  sessionStorage.removeItem(EMPREGAMAIS_SB_TOKEN);localStorage.removeItem(EMPREGAMAIS_SB_TOKEN);
  sessionStorage.removeItem(EMPREGAMAIS_SB_REFRESH);localStorage.removeItem(EMPREGAMAIS_SB_REFRESH);
  sessionStorage.removeItem('empregaMaisPapel');localStorage.removeItem('empregaMaisPapelPersistido');
  return ""
 }
}
function sbCadastrarAuthEmpresaEM(cnpj,senha){localStorage.removeItem('empregaMaisLogoutBloqueio');sessionStorage.removeItem('empregaMaisLogoutBloqueio');return sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/auth/v1/signup",{method:"POST",headers:sbHeadersEM(),body:JSON.stringify({email:sbEmailEmpresaEM(cnpj),password:senha})}).then(a=>{sbSalvarSessaoEM(a);return a})}
async function sbLoginAuthEmpresaEM(credencial,senha){
 localStorage.removeItem('empregaMaisLogoutBloqueio');
 sessionStorage.removeItem('empregaMaisLogoutBloqueio');
 const bruto=String(credencial||'').trim(),cnpj=nums(bruto),digitado=bruto.toLowerCase();
 let emailAuth=cnpj.length===14?sbEmailEmpresaEM(cnpj):digitado;
 const emailAuthLegado=cnpj.length===14?(cnpj+"@auth.maisempregos.com.br"):'';

 if(cnpj.length!==14&&digitado.includes('@')){
  const locais=ler('empregaMaisEmpresas')||[];
  const empLocal=locais.find(e=>[
   e.email,e.emailCorporativo,e.email_corporativo,e.emailCandidaturas,e.email_candidaturas
  ].some(v=>String(v||'').trim().toLowerCase()===digitado));
  if(empLocal&&nums(empLocal.cnpj).length===14)emailAuth=sbEmailEmpresaEM(nums(empLocal.cnpj));
 }

 try{
  const a=await sbJsonEM(
   EMPREGAMAIS_SUPABASE_URL+"/auth/v1/token?grant_type=password",
   {method:"POST",headers:sbHeadersEM(),body:JSON.stringify({email:emailAuth,password:senha})}
  );
  sbSalvarSessaoEM(a);return a
 }catch(err){
  if(emailAuthLegado&&emailAuthLegado!==emailAuth){
   try{
    const a=await sbJsonEM(
     EMPREGAMAIS_SUPABASE_URL+"/auth/v1/token?grant_type=password",
     {method:"POST",headers:sbHeadersEM(),body:JSON.stringify({email:emailAuthLegado,password:senha})}
    );
    sbSalvarSessaoEM(a);return a
   }catch(_){}
  }
  if(emailAuth!==digitado&&digitado.includes('@')){
   try{
    const a=await sbJsonEM(
     EMPREGAMAIS_SUPABASE_URL+"/auth/v1/token?grant_type=password",
     {method:"POST",headers:sbHeadersEM(),body:JSON.stringify({email:digitado,password:senha})}
    );
    sbSalvarSessaoEM(a);return a
   }catch(_){}
  }
  throw err
 }
}
function sbBuscarMinhaEmpresaEM(){const token=sbTokenEM();if(!token)return Promise.resolve(null);return sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/empresas?select=*&limit=1",{method:"GET",headers:sbHeadersEM(token)}).then(a=>Array.isArray(a)&&a.length?a[0]:null)}
function sbEmpresaParaLocalEM(e,senha){if(!e)return null;return{id:e.id||"",userId:e.user_id||"",nome:e.nome||e.nome_fantasia||"",nomeFantasia:e.nome_fantasia||"",razaoSocial:e.razao_social||"",cnpj:nums(e.cnpj||""),email:e.email||e.email_corporativo||"",emailCorporativo:e.email_corporativo||e.email||"",emailCandidaturas:e.email_candidaturas||e.email||e.email_corporativo||"",telefone:e.telefone||"",responsavel:e.responsavel||"",funcaoResponsavel:e.funcao_responsavel||"",cep:e.cep||"",logradouro:e.logradouro||"",bairro:e.bairro||"",numero:e.numero||"",complemento:e.complemento||"",cidade:e.cidade||"",uf:e.uf||"",sobre:e.sobre||"",sobreInstitucional:e.sobre_institucional||"",site:e.site||"",matriz:e.matriz||"",setor:e.setor||"",funcionarios:e.funcionarios||"",faturamento:e.faturamento||"",logo:e.logo_url||"",plano:e.plano_id||e.plano||"basico",planoStatus:e.plano_status||e.assinatura_status||"ativo",planoLiberadoAdmin:e.plano_liberado_admin===true,planoSemCobranca:e.plano_sem_cobranca===true,planoAtivadoEm:e.plano_ativado_em||e.assinatura_inicio||"",planoValidoAte:e.plano_valido_ate||e.assinatura_fim||"",assinaturaAtiva:e.assinatura_ativa===true||((e.plano_id||e.plano||"basico")!=="basico"&&!["cancelado","inativo","expirado"].includes(String(e.plano_status||e.assinatura_status||"ativo").toLowerCase())),verificacaoStatus:e.verificacao_status||"nao_verificada",verificada:e.verificada===true,verificacaoEnviadaEm:e.verificacao_enviada_em||"",verificacaoMotivo:e.verificacao_motivo||"",aprovacaoAutomaticaSuspensa:e.aprovacao_automatica_suspensa===true,conectaConfig:(()=>{const cfg=(e.conecta_config&&typeof e.conecta_config==="object")?Object.assign({},e.conecta_config):{};if(e.conecta_last_sync_at){cfg.ultima=e.conecta_last_sync_at;cfg.conectaUltimaSync=e.conecta_last_sync_at}if(e.conecta_last_sync_status)cfg.ultimoStatus=e.conecta_last_sync_status;if(e.conecta_last_sync_error!==undefined)cfg.ultimoErro=e.conecta_last_sync_error||"";if(e.conecta_next_sync_at)cfg.proxima=e.conecta_next_sync_at;if(e.conecta_sync_enabled!==undefined)cfg.syncEnabled=e.conecta_sync_enabled===true;return cfg})(),senha:senha||""}}
function sbInserirEmpresaEM(auth,base){const token=auth.access_token,uid=auth.user&&auth.user.id;return sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/empresas",{method:"POST",headers:Object.assign(sbHeadersEM(token),{"Prefer":"return=representation"}),body:JSON.stringify({user_id:uid,nome:base.nome||"",cnpj:nums(base.cnpj),email:base.email||"",email_corporativo:base.email||"",email_candidaturas:base.emailCandidaturas||base.email||"",telefone:base.telefone||"",sobre:base.sobre||"",plano:"basico",plano_id:"basico",verificacao_status:"nao_verificada",verificada:false,plano_liberado_admin:false,plano_sem_cobranca:false,aprovacao_automatica_suspensa:false})}).then(a=>Array.isArray(a)?a[0]:a)}
function sbSalvarEmpresaLocalEM(emp){if(!emp)return;const lista=ler("empregaMaisEmpresas");const i=lista.findIndex(x=>nums(x.cnpj)===nums(emp.cnpj));if(i>=0)lista[i]=Object.assign({},lista[i],emp);else lista.push(emp);gravar("empregaMaisEmpresas",lista)}

cadastrarEmpresa=function(e){e.preventDefault();const senha=$("#cadEmpresaSenha").value,nome=$("#cadEmpresaNome").value.trim(),email=$("#cadEmpresaEmail").value.trim().toLowerCase(),telefone=$("#cadEmpresaTelefone").value.trim(),cnpj=nums($("#cadEmpresaCnpj").value),emailCandidaturas=($("#cadEmpresaEmailCandidaturas")?.value||email).trim().toLowerCase();if(nome.length<2)return msg("#msgCadastroEmpresa","Informe o nome da empresa.");if(cnpj.length!==14)return msg("#msgCadastroEmpresa","Informe um CNPJ com 14 números.");if(!email.includes("@"))return msg("#msgCadastroEmpresa","Informe um e-mail corporativo válido.");if(!emailCandidaturas.includes("@"))return msg("#msgCadastroEmpresa","Informe um e-mail válido para recebimento de candidaturas.");if(nums(telefone).length<10)return msg("#msgCadastroEmpresa","Informe um telefone válido.");if(senha.length<6)return msg("#msgCadastroEmpresa","A senha deve ter pelo menos 6 caracteres.");if(senha!==$("#cadEmpresaSenha2").value)return msg("#msgCadastroEmpresa","As senhas não conferem.");const base={nome,cnpj,email,emailCandidaturas,telefone,senha};sbCadastrarAuthEmpresaEM(cnpj,senha).then(auth=>{if(!auth.access_token||!auth.user?.id)throw new Error("O Supabase não criou a sessão da empresa.");return sbInserirEmpresaEM(auth,base)}).then(remota=>{const d=sbEmpresaParaLocalEM(remota,senha);sbSalvarEmpresaLocalEM(d);entrar("empresa",d);mostrarToast("Empresa cadastrada com sucesso.");if(sessionStorage.getItem("planoPretendido"))setTimeout(()=>irPara("planos"),30)}).catch(err=>{console.error("Supabase cadastro empresa:",err);msg("#msgCadastroEmpresa",/already|registered|exists/i.test(err.message)?"Este CNPJ já possui cadastro no Supabase.":err.message)})};

loginEmpresa=function(e){e.preventDefault();const cnpj=nums($("#loginEmpresaCnpj").value),senha=$("#loginEmpresaSenha").value;if(cnpj.length!==14)return msg("#msgLoginEmpresa","Informe um CNPJ válido.");if(!senha)return msg("#msgLoginEmpresa","Informe sua senha.");msg("#msgLoginEmpresa","Entrando...");sbLoginAuthEmpresaEM(cnpj,senha).then(()=>sbBuscarMinhaEmpresaEM()).then(remota=>{if(!remota)throw new Error("Cadastro da empresa não encontrado no Supabase.");if(nums(remota.cnpj)!==cnpj)throw new Error("O cadastro autenticado não corresponde ao CNPJ informado.");const d=sbEmpresaParaLocalEM(remota,senha);sbSalvarEmpresaLocalEM(d);entrar("empresa",d);msg("#msgLoginEmpresa","");if(sessionStorage.getItem("planoPretendido"))setTimeout(()=>irPara("planos"),30)}).catch(err=>{console.error("Supabase login empresa:",err);const texto=/rate limit/i.test(err.message)?"O Supabase bloqueou temporariamente novas tentativas. Aguarde alguns minutos e tente novamente.":/invalid login|invalid credentials/i.test(err.message)?"CNPJ ou senha incorretos.":"Não foi possível entrar: "+err.message;msg("#msgLoginEmpresa",texto)})};

async function validarSessaoSupabaseEmpresaEM(){const token=await sbGarantirSessaoEM();if(!token)return false;try{const u=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/auth/v1/user",{method:"GET",headers:sbHeadersEM(token)});const e=await sbBuscarMinhaEmpresaEM();return !!(u?.id&&e?.id)}catch(err){return false}}
window.addEventListener("load",()=>{if(sessionStorage.getItem(EMPREGAMAIS_SB_TOKEN))validarSessaoSupabaseEmpresaEM()});

/* =========================================================
   EMPREGAMAIS — VAGAS NO SUPABASE
   Fonte persistente: public.vagas
========================================================= */
let sbVagasCacheEM=[];

function sbMapVagaEM(v){
  if(!v)return null;
  return {
    id:v.id, empresaId:v.empresa_id, userId:v.user_id,
    empresa:v.empresa||'', empresaCnpj:v.empresa_cnpj||'',
    cargo:v.cargo||'', area:v.area||'', contrato:v.contrato||'',
    modalidade:v.modalidade||'', cep:v.cep||'', estado:v.estado||'', cidade:v.cidade||'', latitude:Number(v.latitude??v.lat)||null, longitude:Number(v.longitude??v.lng)||null,
    dataEncerramento:v.data_encerramento||'', escolaridade:v.escolaridade||'',
    experiencia:v.experiencia||'', jornada:v.jornada||'', pcd:v.pcd||'',
    salario:v.salario||'', salarioMax:v.salario_max||'', salarioCombinar:!!v.salario_combinar,
    horarioEntrada:v.horario_entrada||'', horarioSaida:v.horario_saida||'',
    descricao:v.descricao||'', requisitos:v.requisitos||'', beneficios:v.beneficios||'',
    beneficiosLista:Array.isArray(v.beneficios_lista)?v.beneficios_lista:[],
    beneficiosOutros:v.beneficios_outros||'', sobreEmpresa:v.sobre_empresa||'',
    senior50:!!v.senior50, confidencial:!!v.confidencial, destaque:!!v.destaque, urgente:!!v.urgente,
    destaqueSolicitado:!!v.destaque_solicitado, urgenciaSolicitada:!!v.urgencia_solicitada,
    status:v.status||'pendente', criadoEm:v.criado_em||'', editadoEm:v.editado_em||'',
    destaqueAte:v.destaque_ate||'', motivoReprovacao:v.motivo_reprovacao||'',
    edicoesAposAprovacao:Number(v.edicoes_apos_aprovacao||0), logo:v.logo||v.logo_url||'', candidaturaTipo:v.candidatura_tipo||'portal', candidaturaEmail:v.candidatura_email||'', candidaturaWhatsapp:v.candidatura_whatsapp||'', candidaturaLink:v.candidatura_link||''
  };
}
function sbUsuarioAtualEM(){const t=sbTokenEM();if(!t)return Promise.reject(new Error('Sessão Supabase ausente.'));return sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/auth/v1/user',{method:'GET',headers:sbHeadersEM(t)})}
async function sbSincronizarEmpresasPublicasEM(){
 try{
  const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/empresas?select=id,nome,nome_fantasia,cnpj,logo_url,plano,plano_id,plano_liberado_admin,verificada,verificacao_status',{method:'GET',headers:sbHeadersEM()});
  if(!Array.isArray(rows))return;
  rows.forEach(e=>{
   const local=sbEmpresaParaLocalEM(e,'');if(!local)return;
   const lista=ler('empregaMaisEmpresas')||[];
   const atual=lista.find(x=>nums(x.cnpj)===nums(local.cnpj));
   // A consulta pública não traz conecta_config nem os demais dados privados.
   // Preserve o que já existe localmente para não "desconectar" o Conecta.
   if(atual){
    if(atual.conectaConfig&&Object.keys(atual.conectaConfig).length)local.conectaConfig=atual.conectaConfig;
    if(atual.perfil)local.perfil=atual.perfil;
    if(atual.email)local.email=atual.email;
    if(atual.emailCorporativo)local.emailCorporativo=atual.emailCorporativo;
    if(atual.emailCandidaturas)local.emailCandidaturas=atual.emailCandidaturas;
    if(atual.telefone)local.telefone=atual.telefone;
    if(atual.cidade)local.cidade=atual.cidade;
    if(atual.uf)local.uf=atual.uf;
   }
   sbSalvarEmpresaLocalEM(local)
  });
 }catch(e){console.warn('Empresas públicas não sincronizadas para logos:',e)}
}
function sbCarregarVagasEM(){
  const t=sbTokenEM();
  sbSincronizarEmpresasPublicasEM().then(()=>{try{renderizarVagasPortal()}catch(e){}});
  const locaisAntes=ler('empregaMaisVagas');
  const publico=sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&status=eq.aprovada&order=criado_em.desc',{method:'GET',headers:Object.assign(sbHeadersEM(),{'Cache-Control':'no-cache','Pragma':'no-cache'}),cache:'no-store'}).catch(()=>[]);
  const proprio=t?sbUsuarioAtualEM().then(u=>sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&user_id=eq.'+encodeURIComponent(u.id)+'&order=criado_em.desc',{method:'GET',headers:sbHeadersEM(t)})).catch(()=>[]):Promise.resolve([]);
  return Promise.all([publico,proprio]).then(r=>{
    const mapa=new Map();
    r.flat().forEach(v=>{if(v&&v.id)mapa.set(String(v.id),v)});
    /* Nunca apagar as vagas locais da empresa se a consulta remota vier vazia,
       falhar por RLS ou estiver temporariamente indisponível. */
    locaisAntes.forEach(v=>{
      if(!v?.id)return;
      const ehPublica=v.status==='aprovada';
      if(!mapa.has(String(v.id)) && ehPublica)mapa.set(String(v.id),v);
    });
    /* A fonte remota usa snake_case; sempre normalizar os registros do Supabase
       antes de gravar/renderizar. Isso evita que vagas públicas aprovadas sumam
       por ficarem sem dataEncerramento/criadoEm no cache local. */
    sbVagasCacheEM=[...mapa.values()].map(v=>{
      const remoto=v&&('data_encerramento' in v||'criado_em' in v||'empresa_id' in v||'candidatura_tipo' in v);
      return remoto?sbMapVagaEM(v):v;
    }).filter(Boolean);
    gravar('empregaMaisVagas',sbVagasCacheEM);
    return sbVagasCacheEM
  })
}
function sbEmpresaAtualEM(){return sbBuscarMinhaEmpresaEM()}
async function geocodificarVagaEM(d){
 if(!d||String(d.modalidade||'').toLowerCase().includes('remot'))return {latitude:null,longitude:null};
 const cep=nums(d.cep||'');let q='';
 if(cep.length===8)q=cep+', Brasil';else q=[d.cidade,d.estado,'Brasil'].filter(Boolean).join(', ');
 if(!q)return {latitude:null,longitude:null};
 try{
  const url='https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=br&q='+encodeURIComponent(q);
  const r=await fetch(url,{headers:{'Accept':'application/json','Accept-Language':'pt-BR'}});
  if(!r.ok)return {latitude:null,longitude:null};const a=await r.json(),x=Array.isArray(a)&&a[0];
  const latitude=Number(x?.lat),longitude=Number(x?.lon);
  return Number.isFinite(latitude)&&Number.isFinite(longitude)?{latitude,longitude}:{latitude:null,longitude:null};
 }catch(e){console.warn('+ Empregos: geocodificação da vaga indisponível.',e);return {latitude:null,longitude:null}}
}
function sbDadosVagaAtualEM(){
  const v=id=>$('#'+id)?.value.trim()||'';
  return sbEmpresaAtualEM().then(emp=>{
    if(!emp)throw new Error('Empresa não encontrada no Supabase.');
    return {empresaId:emp.id,userId:emp.user_id,empresa:v('empresaVaga')||emp.nome_fantasia||emp.nome||'',empresaCnpj:emp.cnpj||sessionStorage.getItem('empresaCnpj')||'',cargo:v('cargoVaga'),area:v('areaVaga'),contrato:v('contratoVaga'),modalidade:v('modalidadeVaga'),cep:v('cepVaga'),estado:v('estadoVaga'),cidade:v('cidadeVaga'),dataEncerramento:''||null,escolaridade:v('escolaridadeVaga'),experiencia:v('experienciaVaga'),jornada:v('jornadaVaga'),pcd:v('pcdVaga'),salario:$('#salarioCombinarVaga')?.checked?'A combinar':v('salarioVaga'),salarioMax:'',salarioCombinar:!!$('#salarioCombinarVaga')?.checked,horarioEntrada:'',horarioSaida:'',descricao:v('descricaoVaga'),requisitos:v('requisitosVaga'),beneficios:beneficiosSelecionados().join(' · '),beneficiosLista:beneficiosSelecionados().filter(x=>x!==v('beneficiosVaga')),beneficiosOutros:v('beneficiosVaga'),sobreEmpresa:v('sobreEmpresaVaga'),senior50:!!$('#senior50Vaga')?.checked,confidencial:!!$('#vagaConfidencial')?.checked,destaque:!!$('#vagaDestaque')?.checked,urgente:!!$('#vagaUrgente')?.checked,logo:window.__empregaMaisLogoVagaUrl||'',latitude:null,longitude:null}
  })
}
function sbVagaPayloadEM(d,editId){
  const gratuito=planoEmpresaAtual().nome==='Grátis';
  if(gratuito&&d.destaque&&!editId){d.destaque_solicitado=true;d.destaque=false}
  if(gratuito&&d.urgente&&!editId){d.urgencia_solicitada=true;d.urgente=false}
  return {user_id:d.userId,empresa_id:d.empresaId,empresa:d.empresa,empresa_cnpj:nums(d.empresaCnpj),cargo:d.cargo,area:d.area,contrato:d.contrato,modalidade:d.modalidade,cep:d.cep,estado:d.estado,cidade:d.cidade,latitude:d.latitude??null,longitude:d.longitude??null,data_encerramento:d.dataEncerramento||dataEncerramentoAutomaticaEM(),escolaridade:d.escolaridade,experiencia:d.experiencia,jornada:d.jornada,pcd:d.pcd,salario:d.salario,salario_max:d.salarioMax,salario_combinar:d.salarioCombinar,horario_entrada:d.horarioEntrada,horario_saida:d.horarioSaida,descricao:d.descricao,requisitos:d.requisitos,beneficios:d.beneficios,beneficios_lista:d.beneficiosLista||[],beneficios_outros:d.beneficiosOutros,sobre_empresa:d.sobreEmpresa,senior50:d.senior50,confidencial:d.confidencial,destaque:d.destaque,urgente:d.urgente,destaque_solicitado:d.destaque_solicitado||false,urgencia_solicitada:d.urgencia_solicitada||false,logo:d.logo||null,candidatura_tipo:d.candidaturaTipo||'portal',candidatura_email:d.candidaturaEmail||null,candidatura_whatsapp:d.candidaturaWhatsapp||null,candidatura_link:d.candidaturaLink||null,status:'pendente'}
}

/* EMPREGAMAIS-LOGO-STORAGE-V1 */
window.__empregaMaisLogoVagaUrl=window.__empregaMaisLogoVagaUrl||'';
async function uploadLogoVagaEM(file){
 if(!file)return window.__empregaMaisLogoVagaUrl||'';
 if(file.size>2*1024*1024)throw new Error('A logo deve ter no máximo 2MB.');
 if(!/^image\/(png|jpeg|svg\+xml)$/i.test(file.type))throw new Error('Envie a logo em PNG, JPG ou SVG.');
 const token=await sbGarantirSessaoEM();if(!token)throw new Error('Sua sessão expirou. Entre novamente para enviar a logo.');
 const u=await sbUsuarioAtualEM(),ext=(file.name.split('.').pop()||'png').toLowerCase().replace(/[^a-z0-9]/g,'')||'png';
 const path=u.id+'/logo-vaga-'+Date.now()+'.'+ext;
 const r=await fetch(EMPREGAMAIS_SUPABASE_URL+'/storage/v1/object/logos-empresas/'+encodeURI(path),{method:'POST',headers:{apikey:EMPREGAMAIS_SUPABASE_KEY,Authorization:'Bearer '+token,'Content-Type':file.type,'x-upsert':'true'},body:file});
 if(!r.ok){let m='';try{m=(await r.json()).message||''}catch(e){}throw new Error(m||'Não foi possível enviar a logo.')}
 const url=EMPREGAMAIS_SUPABASE_URL+'/storage/v1/object/public/logos-empresas/'+path;
 window.__empregaMaisLogoVagaUrl=url;return url
}
function prepararUploadLogoVagaEM(){
 const input=document.getElementById('logoVagaInput'),preview=document.getElementById('logoVagaPreview');if(!input||input.dataset.storageLogo)return;input.dataset.storageLogo='1';
 input.addEventListener('change',async()=>{const file=input.files&&input.files[0];if(!file)return;try{if(preview)preview.innerHTML='<span>Enviando logo...</span>';const url=await uploadLogoVagaEM(file);if(preview)preview.innerHTML='<img src="'+esc(url)+'" alt="Prévia da logo" style="max-width:100%;max-height:110px;object-fit:contain"><small>Logo salva</small>'}catch(err){input.value='';window.__empregaMaisLogoVagaUrl='';if(preview)preview.innerHTML='<span>'+esc(err.message)+'</span>'}})
}
addEventListener('DOMContentLoaded',prepararUploadLogoVagaEM);

/* EMPREGAMAIS-RASCUNHO-SESSAO-V1 */
function salvarRascunhoVagaEM(){
 const f=document.getElementById('formVaga');if(!f)return;
 const d={};f.querySelectorAll('input:not([type="file"]),select,textarea').forEach(el=>{if(!el.id)return;if(el.type==='checkbox'||el.type==='radio')d[el.id]={checked:el.checked,value:el.value};else d[el.id]=el.value});
 d._etapa=Number(document.querySelector('#formVaga .job-card.ativo')?.dataset.panel||1);try{localStorage.setItem('empregaMaisRascunhoVaga',JSON.stringify(d))}catch(e){}
}
function restaurarRascunhoVagaEM(){
 let d;try{d=JSON.parse(localStorage.getItem('empregaMaisRascunhoVaga')||'null')}catch(e){}if(!d)return;
 const f=document.getElementById('formVaga');if(!f)return;
 Object.keys(d).forEach(id=>{if(id==='_etapa')return;const el=document.getElementById(id);if(!el)return;const v=d[id];if(v&&typeof v==='object'&&('checked'in v)){el.checked=!!v.checked}else el.value=v});
 if(typeof mostrarEtapa==='function')mostrarEtapa(d._etapa||1);
}
addEventListener('DOMContentLoaded',()=>{const f=document.getElementById('formVaga');if(f&&!f.dataset.rascunhoSessao){f.dataset.rascunhoSessao='1';f.addEventListener('input',()=>{clearTimeout(window.__emDraftT);window.__emDraftT=setTimeout(salvarRascunhoVagaEM,250)});f.addEventListener('change',salvarRascunhoVagaEM);restaurarRascunhoVagaEM()}});
function abrirConfirmacaoVagaAnaliseEM(edicao){
 let modal=document.getElementById('emVagaAnaliseModal');
 if(!modal){
  modal=document.createElement('div');modal.id='emVagaAnaliseModal';modal.className='em-vaga-analise-modal';
  modal.innerHTML='<div class="em-vaga-analise-backdrop"></div><div class="em-vaga-analise-dialog" role="dialog" aria-modal="true" aria-labelledby="emVagaAnaliseTitulo"><div class="em-vaga-analise-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 7 9.5 17.5 4 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div><span class="em-vaga-analise-kicker">ENVIO CONCLUÍDO</span><h2 id="emVagaAnaliseTitulo">Vaga enviada para análise</h2><p id="emVagaAnaliseTexto"></p><div class="em-vaga-analise-info"><strong>O que acontece agora?</strong><span>Nossa equipe revisará as informações do anúncio antes da publicação.</span></div><button type="button" onclick="fecharConfirmacaoVagaAnaliseEM()">Entendi, voltar ao painel</button></div>';
  document.body.appendChild(modal);
 }
 const p=modal.querySelector('#emVagaAnaliseTexto');
 if(p)p.textContent=edicao?'Suas alterações foram salvas com sucesso. A vaga voltou para análise e passará por uma nova revisão antes de ser publicada novamente.':'Recebemos sua vaga com sucesso. Antes de ser publicada no + Empregos, ela passará por uma revisão para garantir a qualidade e a segurança das informações apresentadas aos candidatos.';
 modal.classList.add('aberto');document.body.classList.add('em-modal-aberto');
}
function fecharConfirmacaoVagaAnaliseEM(){
 document.getElementById('emVagaAnaliseModal')?.classList.remove('aberto');document.body.classList.remove('em-modal-aberto');irPara('painel-empresa');
}

publicarVagaNova=async function(e){
  e.preventDefault();
  const tokenAtivo=await sbGarantirSessaoEM();
  if(!tokenAtivo){msg('#msgPublicarVaga','Não foi possível renovar sua sessão. Seus dados da vaga foram preservados; entre novamente para continuar.');salvarRascunhoVagaEM();setTimeout(()=>irPara('login-empresa'),1200);return}
  const fim=$('#dataEncerramentoVaga')?.value||'';
  if(fim&&new Date(fim+'T23:59:59')<new Date()){msg('#msgPublicarVaga','A data de encerramento precisa ser futura.');mostrarEtapa(2);return}
  const editId=sessionStorage.getItem('vagaEdicao');
  const btn=$('#btnPublicarVaga');if(btn){btn.disabled=true;btn.textContent='Enviando...'}
  try{
    const dados=await sbDadosVagaAtualEM(), coordenadas=await geocodificarVagaEM(dados);Object.assign(dados,coordenadas);const payload=sbVagaPayloadEM(dados,editId);
    const erroPlano=validarRecursosPlano(Object.assign({},dados,{destaque:payload.destaque,urgente:payload.urgente}),editId);
    if(erroPlano)throw new Error(erroPlano);
    if(editId){
      const antigo=sbVagasCacheEM.find(v=>v.id===editId)||ler('empregaMaisVagas').find(v=>v.id===editId);
      if(!antigo)throw new Error('Não foi possível localizar esta vaga para edição.');
      const precisaReanalise=antigo.status==='aprovada';
      payload.status=precisaReanalise?'pendente':antigo.status||'pendente';
      payload.editado_em=new Date().toISOString();
      payload.edicoes_apos_aprovacao=precisaReanalise?Number(antigo.edicoesAposAprovacao||0)+1:Number(antigo.edicoesAposAprovacao||0);
      payload.motivo_reprovacao=null;
      const r=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?id=eq.'+encodeURIComponent(editId),{method:'PATCH',headers:Object.assign(sbHeadersEM(sbTokenEM()),{'Prefer':'return=representation'}),body:JSON.stringify(payload)});
      if(!Array.isArray(r)||!r[0])throw new Error('O Supabase não confirmou a alteração da vaga.');
    }else{
      const r=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas',{method:'POST',headers:Object.assign(sbHeadersEM(sbTokenEM()),{'Prefer':'return=representation'}),body:JSON.stringify(payload)});
      if(!Array.isArray(r)||!r[0])throw new Error('O Supabase não confirmou a publicação da vaga.');
    }
    sessionStorage.removeItem('vagaEdicao');localStorage.removeItem('empregaMaisRascunhoVaga');$('#formVaga')?.reset();await sbCarregarVagasEM();msg('#msgPublicarVaga','',true);abrirConfirmacaoVagaAnaliseEM(Boolean(editId))
  }catch(err){console.error('+ Empregos/Supabase vaga:',err);msg('#msgPublicarVaga',err.message||'Não foi possível salvar a vaga.')}finally{if(btn){btn.disabled=false;btn.textContent='Publicar vaga'}}
};
vagasDaEmpresa=function(){
 const c=nums(sessionStorage.getItem('empresaCnpj')||'');
 const uid=String(sessionStorage.getItem('empresaSupabaseUserId')||'');
 const fonte=sbVagasCacheEM.length?sbVagasCacheEM:ler('empregaMaisVagas');
 return fonte.filter(v=>{
   const vc=nums(v.empresaCnpj||v.cnpj||'');
   const vu=String(v.userId||v.user_id||'');
   return (uid&&vu===uid)||(c&&vc===c)
 })
};
const _renderizarVagasPortalLocalEM=renderizarVagasPortal;
renderizarVagasPortal=function(){const box=$('#listaVagasPortal');if(box&&sbVagasCacheEM.length)return _renderizarVagasPortalLocalEM();if(box&&!sbVagasCacheEM.length)sbCarregarVagasEM().then(()=>{try{_renderizarVagasPortalLocalEM()}catch(e){console.error(e)}}).catch(e=>{console.error('Supabase vagas:',e);try{_renderizarVagasPortalLocalEM()}catch(x){}})};
document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>{if(sbTokenEM())sbCarregarVagasEM().catch(()=>{});else sbCarregarVagasEM().catch(()=>{})},250)});

function alternarSenhaEmpresa(btn){const input=document.getElementById('loginEmpresaSenha');if(!input)return;const mostrar=input.type==='password';input.type=mostrar?'text':'password';btn.textContent=mostrar?'◌':'◉';btn.setAttribute('aria-label',mostrar?'Ocultar senha':'Mostrar senha')}
function recuperarSenhaEmpresa(){const cnpj=nums(document.getElementById('loginEmpresaCnpj')?.value||'');if(cnpj.length!==14){msg('#msgLoginEmpresa','Informe seu CNPJ para recuperar a senha.');return}const email=sbEmailEmpresaEM(cnpj);msg('#msgLoginEmpresa','Solicitando recuperação de senha...');sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/auth/v1/recover',{method:'POST',headers:sbHeadersEM(),body:JSON.stringify({email})}).then(()=>msg('#msgLoginEmpresa','Solicitação enviada. Se a conta permitir recuperação por e-mail, verifique a caixa de entrada cadastrada.',true)).catch(err=>msg('#msgLoginEmpresa',/rate limit/i.test(err.message)?'Limite temporário de e-mails do Supabase atingido. Tente novamente mais tarde.':'Não foi possível iniciar a recuperação: '+err.message))}

function atalhoArea(area){const f=document.getElementById('filtroArea');if(f){f.value=area;renderizarVagasPortal();document.querySelector('.home-recentes')?.scrollIntoView({behavior:'smooth'})}}

function alternarSenhaCandidato(btn){const input=document.getElementById('loginCandSenha');if(!input)return;const ver=input.type==='password';input.type=ver?'text':'password';btn.textContent=ver?'◌':'◉';btn.setAttribute('aria-label',ver?'Ocultar senha':'Mostrar senha')}
function recuperarSenhaCandidato(){const email=(document.getElementById('loginCandEmail')?.value||'').trim();if(!email){msg('#msgLoginCandidato','Informe seu e-mail para recuperar a senha.');return}msg('#msgLoginCandidato','A recuperação de senha será disponibilizada quando a autenticação do candidato estiver conectada ao Supabase.')}

function atualizarMenusTopo(){const p=papelAtual(),b=document.body,emp=p==='empresa',cand=p==='candidato';b.classList.toggle('tem-empresa',emp);b.classList.toggle('tem-candidato',cand);b.classList.toggle('sessao-empresa',emp);b.classList.toggle('sessao-candidato',cand);b.classList.toggle('sessao-publica',!emp&&!cand)}
function fecharMenusTopo(){document.querySelectorAll('.menu-drop').forEach(x=>x.classList.remove('aberto'))}
function alternarMenuTopo(tipo,event){event?.stopPropagation();const alvo=document.querySelector('.menu-drop-'+tipo),abrir=!alvo?.classList.contains('aberto');fecharMenusTopo();atualizarMenusTopo();if(abrir)alvo?.classList.add('aberto')}
function rotaMenuTopo(rota){fecharMenusTopo();irPara(rota)}
document.addEventListener('click',e=>{if(!e.target.closest('.menu-drop'))fecharMenusTopo()});
window.addEventListener('DOMContentLoaded',atualizarMenusTopo);

const DETALHES_PLANOS={
basico:{nome:'Grátis',etiqueta:'PARA COMEÇAR',preco:'R$ 0,00',periodo:'Sem mensalidade',resumo:'Recursos essenciais para começar a divulgar vagas.',beneficios:[['3 vagas por mês','Publique até 3 novas vagas em cada mês.'],['Candidaturas ilimitadas','Receba candidaturas nas vagas publicadas sem limite de quantidade.'],['Acesso aos currículos','Consulte o currículo ou perfil enviado pelo candidato.'],['Gestão de candidatos','Organize os candidatos pelas etapas do processo seletivo.'],['Perfil da empresa','Mantenha as informações públicas da empresa no portal.'],['Painel do recrutador','Acompanhe suas vagas e candidatos em um único ambiente.'],['Histórico das vagas','Consulte as oportunidades cadastradas e seus respectivos status.'],['1 usuário','Acesso destinado a um usuário da empresa.'],['Destaque avulso','Pode ser adquirido por R$ 19,90 e permanece em destaque por 7 dias.'],['Urgência avulsa','Pode ser adquirida por R$ 9,90 para identificar a oportunidade como contratação urgente.']]},
mensal:{nome:'Mensal',etiqueta:'30 DIAS',preco:'R$ 49,90',periodo:'Plano mensal',resumo:'Mais publicações e recursos de visibilidade durante o mês.',beneficios:[['6 vagas por mês','Publique até 6 novas vagas durante o mês de vigência.'],['Formas de candidatura','Escolha como receber candidatos: pelo + Empregos ou por e-mail com currículo anexado e endereço do recrutador oculto. Também é possível direcionar a candidatura pelo WhatsApp ou para o site de carreiras da empresa.'],['Painel completo','Gerencie vagas e acompanhe os candidatos recebidos.'],['Página exclusiva da empresa','Apresente as informações públicas cadastradas no perfil empresarial.'],['Gestão completa de candidatos','Organize o processo seletivo e altere a etapa de cada candidato.'],['Estatísticas completas','Acompanhe os indicadores disponibilizados no painel.'],['1 Destaque por mês','Uma vaga pode utilizar o recurso de destaque incluído no plano.'],['1 Urgente por mês','Uma vaga pode receber a identificação de contratação urgente.'],['Currículos online completos','Visualize o currículo online do candidato diretamente no + Empregos, com dados profissionais organizados para análise.'],['Contato direto com candidatos','Entre em contato com o candidato pelo WhatsApp ou por e-mail a partir do ambiente de recrutamento.'],['Mensagens dentro do + Empregos','Use o canal de comunicação do portal para centralizar conversas relacionadas ao processo seletivo.'],['Agendamento de entrevistas','Agende entrevistas diretamente pelo gerenciamento do candidato e mantenha o processo organizado.'],['Gestão do processo seletivo','Acompanhe e atualize as etapas de cada candidatura, da análise até a contratação.'],['Aderência à vaga','Consulte a estimativa de aderência entre as informações do currículo do candidato e os requisitos da oportunidade.'],['Indicadores de recrutamento e desempenho','Acompanhe candidaturas, candidatos em análise, entrevistas, contratações e o andamento dos processos seletivos pelo painel.']]},
trimestral:{nome:'Trimestral',etiqueta:'3 MESES',preco:'R$ 99,00',periodo:'Pagamento único · 3 meses',resumo:'Capacidade ampliada para recrutamento durante três meses.',beneficios:[['12 vagas por mês','Publique até 12 vagas por mês, chegando a até 36 publicações durante os três meses.'],['Formas de candidatura','Escolha como receber candidatos: pelo + Empregos ou por e-mail com currículo anexado e endereço do recrutador oculto. Também é possível direcionar a candidatura pelo WhatsApp ou para o site de carreiras da empresa.'],['Todos os recursos do painel','Use as ferramentas de gerenciamento de vagas e candidatos.'],['3 Destaques por mês','Até 3 vagas por mês podem utilizar o recurso de destaque.'],['3 Urgentes por mês','Até 3 vagas por mês podem receber a identificação de contratação urgente.'],['2 vagas confidenciais por mês','Publique até 2 vagas por mês sem exibir publicamente a identidade da empresa.'],['1 usuário','Acesso destinado a um usuário da empresa.'],['Currículos online completos','Visualize o currículo online do candidato diretamente no + Empregos, com dados profissionais organizados para análise.'],['Contato direto com candidatos','Entre em contato com o candidato pelo WhatsApp ou por e-mail a partir do ambiente de recrutamento.'],['Mensagens dentro do + Empregos','Use o canal de comunicação do portal para centralizar conversas relacionadas ao processo seletivo.'],['Agendamento de entrevistas','Agende entrevistas diretamente pelo gerenciamento do candidato e mantenha o processo organizado.'],['Gestão do processo seletivo','Acompanhe e atualize as etapas de cada candidatura, da análise até a contratação.'],['Aderência à vaga','Consulte a estimativa de aderência entre as informações do currículo do candidato e os requisitos da oportunidade.'],['Indicadores de recrutamento e desempenho','Acompanhe candidaturas, candidatos em análise, entrevistas, contratações e o andamento dos processos seletivos pelo painel.']]},
semestral:{nome:'Semestral',etiqueta:'6 MESES',preco:'R$ 179,90',periodo:'Pagamento único · 6 meses',resumo:'Maior volume de vagas e recursos para processos seletivos recorrentes.',beneficios:[['25 vagas por mês','Publique até 25 vagas por mês, chegando a até 150 durante seis meses.'],['Formas de candidatura','Escolha como receber candidatos: pelo + Empregos ou por e-mail com currículo anexado e endereço do recrutador oculto. Também é possível direcionar a candidatura pelo WhatsApp ou para o site de carreiras da empresa.'],['5 Destaques por mês','Até 5 vagas por mês podem receber destaque.'],['5 Urgentes por mês','Até 5 vagas por mês podem receber a identificação de contratação urgente.'],['4 vagas confidenciais por mês','Até 4 vagas por mês podem ocultar a identidade da empresa.'],['Banco de talentos','Acesso ao recurso de banco de talentos incluído neste plano.'],['2 usuários','Permite acesso de até 2 usuários da empresa.'],['Currículos online completos','Visualize o currículo online do candidato diretamente no + Empregos, com dados profissionais organizados para análise.'],['Contato direto com candidatos','Entre em contato com o candidato pelo WhatsApp ou por e-mail a partir do ambiente de recrutamento.'],['Mensagens dentro do + Empregos','Use o canal de comunicação do portal para centralizar conversas relacionadas ao processo seletivo.'],['Agendamento de entrevistas','Agende entrevistas diretamente pelo gerenciamento do candidato e mantenha o processo organizado.'],['Gestão do processo seletivo','Acompanhe e atualize as etapas de cada candidatura, da análise até a contratação.'],['Aderência à vaga','Consulte a estimativa de aderência entre as informações do currículo do candidato e os requisitos da oportunidade.'],['Indicadores de recrutamento e desempenho','Acompanhe candidaturas, candidatos em análise, entrevistas, contratações e o andamento dos processos seletivos pelo painel.']]},
anual:{nome:'Anual',etiqueta:'12 MESES',preco:'R$ 329,00',periodo:'Pagamento único · 12 meses',resumo:'Maior capacidade de publicação para recrutamento ao longo do ano.',beneficios:[['60 vagas por mês','Publique até 60 vagas por mês, chegando a até 720 durante os 12 meses.'],['Formas de candidatura','Escolha como receber candidatos: pelo + Empregos ou por e-mail com currículo anexado e endereço do recrutador oculto. Também é possível direcionar a candidatura pelo WhatsApp ou para o site de carreiras da empresa.'],['10 Destaques por mês','Até 10 vagas por mês podem receber destaque.'],['10 Urgentes por mês','Até 10 vagas por mês podem receber a identificação de contratação urgente.'],['8 vagas confidenciais por mês','Até 8 vagas por mês podem ocultar a identidade da empresa.'],['Banco de talentos','Acesso ao recurso de banco de talentos incluído neste plano.'],['5 usuários','Permite acesso de até 5 usuários da empresa.'],['Currículos online completos','Visualize o currículo online do candidato diretamente no + Empregos, com dados profissionais organizados para análise.'],['Contato direto com candidatos','Entre em contato com o candidato pelo WhatsApp ou por e-mail a partir do ambiente de recrutamento.'],['Mensagens dentro do + Empregos','Use o canal de comunicação do portal para centralizar conversas relacionadas ao processo seletivo.'],['Agendamento de entrevistas','Agende entrevistas diretamente pelo gerenciamento do candidato e mantenha o processo organizado.'],['Gestão do processo seletivo','Acompanhe e atualize as etapas de cada candidatura, da análise até a contratação.'],['Aderência à vaga','Consulte a estimativa de aderência entre as informações do currículo do candidato e os requisitos da oportunidade.'],['Indicadores de recrutamento e desempenho','Acompanhe candidaturas, candidatos em análise, entrevistas, contratações e o andamento dos processos seletivos pelo painel.']]}
};
function emPagamentoPlano(chave){
 if(chave==='basico')return '';
 const valor=valorPlano(chave),pix=valor*.94,parcela=valor/3,moeda=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
 return '<div class="em-pagamento-plano em-pay-clean">'+
 '<div class="em-pay-clean-title"><strong>Formas de pagamento</strong><span>Escolha a melhor opção para sua empresa</span></div>'+
 '<div class="em-pay-clean-row"><span>Pix <b>6% OFF</b></span><strong>'+moeda(pix)+'</strong><small>à vista</small></div>'+
 '<div class="em-pay-clean-row"><span>Cartão de crédito</span><strong>3x de '+moeda(parcela)+'</strong><small>sem juros</small></div>'+
 '</div>';
}
function verDetalhesPlano(plano){sessionStorage.setItem('planoDetalhe',plano);irPara('plano-detalhe')}
function renderizarDetalhesPlano(){const chave=sessionStorage.getItem('planoDetalhe')||'basico',d=DETALHES_PLANOS[chave]||DETALHES_PLANOS.basico,p=PLANOS_EMPRESA[chave]||PLANOS_EMPRESA.basico;const set=(id,t)=>{const e=document.getElementById(id);if(e)e.textContent=t};set('planoDetalheNome','Plano '+d.nome);set('planoDetalheResumo',d.resumo);set('planoDetalheEtiqueta',d.etiqueta);set('planoDetalhePreco',d.preco);set('planoDetalhePeriodo',d.periodo);const topo=document.querySelector('.plano-detalhe-top>div');if(topo){let pg=topo.querySelector('.em-pagamento-plano');if(pg)pg.remove();if(chave!=='basico')topo.insertAdjacentHTML('beforeend',emPagamentoPlano(chave));}const b=document.getElementById('planoDetalheBeneficios');if(b)b.innerHTML=d.beneficios.map((x,i)=>'<article class="beneficio-detalhado"><i>'+(i===0?'✓':'•')+'</i><div><strong>'+esc(x[0])+'</strong><p>'+esc(x[1])+'</p></div></article>').join('');const r=document.getElementById('planoDetalheResumoLateral');if(r)r.innerHTML='<div class="plano-resumo-item"><span>Vagas/mês</span><b>'+p.vagas+'</b></div><div class="plano-resumo-item"><span>Destaques/mês</span><b>'+p.destaques+'</b></div><div class="plano-resumo-item"><span>Urgências/mês</span><b>'+p.urgentes+'</b></div><div class="plano-resumo-item"><span>Confidenciais/mês</span><b>'+p.confidenciais+'</b></div><div class="plano-resumo-item"><span>Valor</span><b>'+esc(d.preco)+'</b></div>';['planoDetalheEscolher','planoDetalheEscolher2'].forEach(id=>{const x=document.getElementById(id);if(x)x.onclick=()=>selecionarPlano(chave)})}

let planoBAtual='trimestral';
const PLANO_PERSONALIZADO_EM={
 nome:'Personalizado',
 etiqueta:'SOB MEDIDA',
 preco:'Sob consulta',
 periodo:'Configuração conforme a operação',
 resumo:'Uma solução flexível para empresas que precisam de mais volume, usuários ou condições diferentes dos planos padrão.',
 beneficios:[
  ['Volume de vagas sob medida','Defina uma capacidade de publicação adequada ao ritmo de contratação da sua empresa.'],
  ['Quantidade de usuários ajustável','Inclua os recrutadores e profissionais que precisam participar da operação.'],
  ['Recursos de visibilidade','Configure vagas em destaque e contratação urgente de acordo com a demanda.'],
  ['Vagas confidenciais','Estruture processos estratégicos sem exibir publicamente a identidade da empresa quando necessário.'],
  ['Currículos e contato com candidatos','Centralize a análise dos perfis e utilize os canais disponíveis para avançar o contato.'],
  ['Gestão do processo seletivo','Organize candidatos, entrevistas, etapas e histórico dos processos em um único ambiente.'],
  ['Banco de talentos','Avalie a inclusão de recursos para manter e consultar profissionais relevantes para futuras oportunidades.'],
  ['Condições comerciais personalizadas','Valores, vigência e limites são definidos conforme a configuração solicitada.']
 ]
};
function selecionarAbaPlano(chave){
 const personalizado=chave==='personalizado';
 if(!personalizado&&!DETALHES_PLANOS[chave])chave='basico';
 planoBAtual=chave;
 const d=personalizado?PLANO_PERSONALIZADO_EM:DETALHES_PLANOS[chave];
 document.querySelectorAll('.planos-clean-tabs button').forEach(b=>b.classList.toggle('ativo',b.dataset.plano===chave));
 const set=(id,t)=>{const e=document.getElementById(id);if(e)e.textContent=t};
 set('planoBTag',d.etiqueta);set('planoBNome',personalizado?'Plano Personalizado':'Plano '+d.nome);set('planoBResumo',d.resumo);set('planoBPreco',d.preco);set('planoBPeriodo',d.periodo);
 const precoBox=document.querySelector('.plano-b-preco');
 if(precoBox){
  precoBox.querySelector('.em-pagamento-plano')?.remove();
  precoBox.querySelector('.plano-valor-pratico')?.remove();
  if(!personalizado&&chave!=='basico'){const periodo=document.getElementById('planoBPeriodo');periodo?.insertAdjacentHTML('afterend',emPagamentoPlano(chave));}
  const praticos=personalizado?
   [['Estrutura para sua realidade','A solução é dimensionada a partir do volume de vagas, tamanho da equipe e rotina de recrutamento.'],['Mais usuários e escala','Ajuste acessos e capacidade para operações com mais recrutadores ou processos simultâneos.'],['Condições alinhadas à operação','Vigência, recursos e limites podem ser combinados em uma proposta específica para a empresa.']]:
   chave==='basico'?
   [['Primeiros processos organizados','Use o painel para publicar suas primeiras vagas, receber candidaturas e acompanhar os candidatos.'],['Recebimento sem limite de candidatos','As vagas publicadas podem receber candidaturas sem limite de quantidade.']]:
   [['Mais visibilidade para oportunidades','Use os recursos incluídos no plano para ampliar a exposição das vagas que precisam de maior alcance.'],['Sinalização de prioridade','Identifique posições que precisam ser preenchidas com mais rapidez.']]
    .concat((PLANOS_EMPRESA[chave]?.confidenciais||0)>0?[['Recrutamento estratégico','Conduza substituições ou contratações sensíveis sem exibir publicamente a identidade da empresa.']]:[])
    .concat([['Processos centralizados','Acompanhe análise, entrevistas e contratação mantendo as etapas organizadas.'],['Comunicação com profissionais','Consulte currículos e utilize os canais disponíveis para avançar o contato com candidatos.']]);
  precoBox.insertAdjacentHTML('beforeend','<div class="plano-valor-pratico"><span>'+(personalizado?'COMO FUNCIONA':'BENEFÍCIOS NA PRÁTICA')+'</span>'+praticos.map((x,i)=>'<article><i>'+(['★','⚡','◈','✓','↗'][i%5])+'</i><div><strong>'+esc(x[0])+'</strong><p>'+esc(x[1])+'</p></div></article>').join('')+'</div>');
 }
 set('planoBTituloBeneficios',personalizado?'O que pode ser configurado?':'O que está incluído no plano '+d.nome+'?');
 const l=document.getElementById('planoBLista');
 if(l){
  const icons=['▣','★','⚡','◈','♟','◉','▥','◌'];
  l.innerHTML='<div class="plano-recursos-grid">'+d.beneficios.map((x,i)=>'<article class="plano-recurso-card"><i>'+icons[i%icons.length]+'</i><div><strong>'+esc(x[0])+'</strong><p>'+esc(x[1])+'</p></div></article>').join('')+'</div>'+(!personalizado&&chave!=='basico'?'<div class="plano-resultados"><i>◆</i><div><strong>Mais estrutura para recrutar</strong><p>Use os recursos do plano para divulgar oportunidades e conduzir seus processos com mais organização.</p></div></div>':'');
 }
 const bt=document.getElementById('planoBEscolher');
 if(bt){
  bt.type='button';bt.dataset.plano=chave;bt.disabled=false;
  bt.textContent=personalizado?'Solicitar proposta →':chave==='basico'?'Começar grátis →':'Escolher este plano →';
  bt.onclick=personalizado?()=>irPara('contato'):()=>selecionarPlano(chave);
 }
}
function inserirBeneficiosVisibilidadePlanosEM(){
 const pagina=document.getElementById('pagina-planos');if(!pagina)return;
 let box=document.getElementById('beneficiosVisibilidadePlanosEM');
 if(!box){
  box=document.createElement('section');box.id='beneficiosVisibilidadePlanosEM';box.className='beneficios-visibilidade-planos-em';
  box.innerHTML='<div class="bvp-head"><span>BENEFÍCIOS PARA TODAS AS EMPRESAS</span><h2>Mais visibilidade quando sua vaga precisar.</h2><p>Além dos recursos do plano, toda empresa recebe uma franquia mensal para destacar oportunidades e sinalizar contratações prioritárias.</p></div><div class="bvp-grid"><article><i>★</i><div><span>VAGA EM DESTAQUE</span><strong>5 grátis por mês</strong><p>Dê mais visibilidade às vagas que precisam alcançar mais candidatos.</p><small>Após as 5 gratuitas: <b>R$ 9,90 por ativação</b></small></div></article><article><i>⚡</i><div><span>CONTRATAÇÃO URGENTE</span><strong>5 grátis por mês</strong><p>Sinalize as oportunidades que precisam de contratação com maior rapidez.</p><small>Após as 5 gratuitas: <b>R$ 9,90 por ativação</b></small></div></article><article class="gratis"><i>◈</i><div><span>VAGA CONFIDENCIAL</span><strong>Sempre grátis</strong><p>Oculte a identidade da empresa em processos que exigem mais discrição.</p><small><b>Sem cobrança e sem consumir créditos.</b></small></div></article></div><div class="bvp-note"><b>Todo mês:</b> 5 Destaques + 5 Urgências gratuitos. Os saldos são independentes.</div>';
  const alvo=pagina.querySelector('.planos-clean-shell,.planos-clean,.planos-wrap,.planos-container')||pagina.firstElementChild;
  if(alvo)alvo.insertAdjacentElement('afterend',box);else pagina.appendChild(box);
 }
 if(!document.getElementById('beneficiosVisibilidadePlanosStyleEM')){const st=document.createElement('style');st.id='beneficiosVisibilidadePlanosStyleEM';st.textContent='#beneficiosVisibilidadePlanosEM{width:min(1180px,calc(100% - 40px));margin:42px auto 60px;padding:36px;border:1px solid #dbe8ed;border-radius:24px;background:#f8fbfc;color:#153f50}.bvp-head{text-align:center;max-width:760px;margin:0 auto 26px}.bvp-head>span{font-size:10px;font-weight:850;letter-spacing:.1em;color:#0b789c}.bvp-head h2{font-size:30px;line-height:1.15;margin:8px 0;color:#153f50}.bvp-head p{font-size:13.5px;line-height:1.6;color:#617786;margin:0}.bvp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.bvp-grid article{display:flex;gap:14px;padding:23px;border:1px solid #dfe9ed;border-radius:17px;background:#fff;box-shadow:0 7px 20px rgba(25,66,83,.05)}.bvp-grid article>i{display:grid;place-items:center;flex:0 0 42px;height:42px;border-radius:12px;background:#e8f5fa;color:#087fa8;font-style:normal;font-size:18px}.bvp-grid article.gratis>i{background:#e9f8f1;color:#17845e}.bvp-grid article span{display:block;font-size:9px;font-weight:850;letter-spacing:.07em;color:#738894}.bvp-grid article strong{display:block;margin:5px 0 7px;font-size:20px;color:#123f52}.bvp-grid article p{margin:0 0 12px;font-size:12px;line-height:1.5;color:#647985}.bvp-grid article small{display:block;padding-top:10px;border-top:1px solid #edf1f3;font-size:10.5px;color:#5d707a}.bvp-note{text-align:center;margin-top:17px;padding:13px;border-radius:12px;background:#eaf6fa;color:#315a6b;font-size:12px}@media(max-width:800px){#beneficiosVisibilidadePlanosEM{padding:25px 18px}.bvp-grid{grid-template-columns:1fr}.bvp-head h2{font-size:25px}}';document.head.appendChild(st)}
}
function renderizarPlanosModeloB(){renderizarPlanosAtuais();selecionarAbaPlano(planoBAtual||'trimestral');setTimeout(inserirBeneficiosVisibilidadePlanosEM,0)}

const ORDEM_PLANOS=['basico','mensal','trimestral','semestral','anual'];
function podeUpgradePlano(atual,novo){return ORDEM_PLANOS.indexOf(novo)>ORDEM_PLANOS.indexOf(atual)}
function diasPlano(chave){return {basico:0,mensal:30,trimestral:90,semestral:180,anual:365}[chave]||0}
function valorPlano(chave){return {basico:0,mensal:49.90,trimestral:99,semestral:179.90,anual:329}[chave]||0}
function calcularCreditoUpgrade(empresa,novo){const atual=empresa?.plano||'basico';if(atual==='basico'||!podeUpgradePlano(atual,novo))return 0;const inicio=new Date(empresa.planoAtivadoEm||empresa.planoInicio||0);if(!inicio.getTime())return 0;const total=diasPlano(atual),passados=Math.max(0,(Date.now()-inicio.getTime())/86400000),restantes=Math.max(0,total-passados);return Math.max(0,Math.min(valorPlano(atual),valorPlano(atual)*(restantes/total)))}

function abrirMetricaEmpresa(tipo){
 if(tipo==='vagas'){focarVagasEmpresa();return}
 if(tipo==='candidatos'){sessionStorage.setItem('filtroCandidatos','Todos');sessionStorage.removeItem('vagaCandidatosSelecionada');irPara('candidatos-empresa');return}
 if(tipo==='processo'){sessionStorage.setItem('filtroCandidatos','Em contato');sessionStorage.removeItem('vagaCandidatosSelecionada');irPara('candidatos-empresa');return}
 if(tipo==='entrevistas'){sessionStorage.setItem('filtroCandidatos','Entrevista');sessionStorage.removeItem('vagaCandidatosSelecionada');irPara('candidatos-empresa');return}
 if(tipo==='contratacoes'){sessionStorage.setItem('filtroCandidatos','Contratados');sessionStorage.removeItem('vagaCandidatosSelecionada');irPara('candidatos-empresa')}
}


/* EMPREGAMAIS-VAGAS-SYNC-CONTEXTO-V4 */
async function sbCarregarVagasEmpresaAtualEM(){
 const t=await sbGarantirSessaoEM();if(!t)throw new Error('Sessão da empresa expirada.');
 const u=await sbUsuarioAtualEM();
 const a=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&user_id=eq.'+encodeURIComponent(u.id)+'&order=criado_em.desc',{method:'GET',headers:sbHeadersEM(t)});
 const proprias=(Array.isArray(a)?a:[]).map(sbMapVagaEM),publicas=ler('empregaMaisVagas').filter(v=>v.status==='aprovada'&&!proprias.some(p=>p.id===v.id));
 sbVagasCacheEM=[...proprias,...publicas];gravar('empregaMaisVagas',sbVagasCacheEM);return proprias
}
const _renderizarPainelEmpresaSyncV4=renderizarPainelEmpresa;
renderizarPainelEmpresa=async function(){
 const box=$('#empresaVagasRecentes');if(box)box.innerHTML='<div class="vagas-vazio">Carregando suas vagas...</div>';
 try{await sbCarregarVagasEmpresaAtualEM()}catch(err){console.error('Painel empresa / Supabase:',err)}
 return _renderizarPainelEmpresaSyncV4()
};
const _adminAbaSyncV4=adminAba;
adminAba=async function(aba,btn){
 if(sessionStorage.getItem('empregaMaisAdmin')!=='1'){irPara('login-admin');return}
 const out=$('#adminConteudo');if(out&&aba==='vagas')out.innerHTML='<div class="admin-bloco"><h2>Gestão de vagas</h2><div class="admin-empty">Carregando vagas do Supabase...</div></div>';
 try{if(aba==='planos'||aba==='empresas'||aba==='financeiro')await adminCarregarEmpresasSupabaseEM();if(aba==='vagas'||aba==='geral'||aba==='contratacoes'||aba==='denuncias'||aba==='relatorios')await adminCarregarVagasSupabase()}catch(err){console.error('ADM / Supabase:',err);if(aba==='vagas'){if(out)out.innerHTML='<div class="admin-bloco"><h2>Não foi possível carregar as vagas</h2><div class="admin-warning">O acesso administrativo ao Supabase foi bloqueado: '+esc(err.message)+'.</div></div>';return}}
 return _adminAbaSyncV4(aba,btn)
};

/* EMPREGAMAIS-EMPRESA-EQUIPE-V6 */
function vagasDaEmpresa(){
 const uid=sessionStorage.getItem('empresaSupabaseUserId')||'';
 const empresaId=sessionStorage.getItem('empresaSupabaseEmpresaId')||'';
 const cnpj=nums(sessionStorage.getItem('empresaCnpj')||'');
 const fonte=sbVagasCacheEM.length?sbVagasCacheEM:ler('empregaMaisVagas');
 return fonte.filter(v=>(empresaId&&String(v.empresaId||'')===empresaId)||(uid&&String(v.userId||'')===uid)||(!uid&&cnpj&&nums(v.empresaCnpj||'')===cnpj))
}
loginEmpresa=function(e){
 e.preventDefault();
 const form=e?.currentTarget||e?.target||document.getElementById('formLoginEmpresa');
 const campoCredencial=
   form?.querySelector('#loginEmpresaCnpj')||
   form?.querySelector('[name="cnpj"]')||
   form?.querySelector('[name="email"]')||
   form?.querySelector('[name="usuario"]')||
   form?.querySelector('input[type="text"]:not([disabled])')||
   form?.querySelector('input[type="email"]:not([disabled])')||
   document.getElementById('loginEmpresaCnpj');
 const campoSenha=
   form?.querySelector('#loginEmpresaSenha')||
   form?.querySelector('input[type="password"]')||
   document.getElementById('loginEmpresaSenha');

 const credencial=String(campoCredencial?.value||'').trim();
 const cnpj=nums(credencial);
 const senha=String(campoSenha?.value||'');

 if(!credencial)return msg('#msgLoginEmpresa','Informe o CNPJ ou e-mail do usuário.');
 if(cnpj.length!==14&&!credencial.includes('@'))return msg('#msgLoginEmpresa','Informe um CNPJ válido ou um e-mail.');
 if(!senha)return msg('#msgLoginEmpresa','Informe sua senha.');

 msg('#msgLoginEmpresa','Entrando...');
 sbLoginAuthEmpresaEM(credencial,senha).then(auth=>{
   if(auth?.user?.id)sessionStorage.setItem('empresaSupabaseAuthUserId',auth.user.id);
   return sbBuscarMinhaEmpresaEM()
 }).then(remota=>{
   if(!remota)throw new Error('Usuário não está vinculado a uma empresa ativa.');
   if(cnpj.length===14&&nums(remota.cnpj)!==cnpj)throw new Error('O cadastro autenticado não corresponde ao CNPJ informado.');
   sessionStorage.setItem('empresaSupabaseUserId',remota.user_id||'');
   sessionStorage.setItem('empresaSupabaseEmpresaId',remota.id||'');
   const d=sbEmpresaParaLocalEM(remota,senha);
   sbSalvarEmpresaLocalEM(d);
   entrar('empresa',d);
   sessionStorage.setItem('empresaSupabaseUserId',remota.user_id||'');
   sessionStorage.setItem('empresaSupabaseEmpresaId',remota.id||'');
   const authUid=sessionStorage.getItem('empresaSupabaseAuthUserId')||'';
   sessionStorage.setItem('empresaUsuarioAdministrador',String(authUid===String(remota.user_id||'')));
   msg('#msgLoginEmpresa','');
   if(sessionStorage.getItem('planoPretendido'))setTimeout(()=>irPara('planos'),30)
 }).catch(err=>{
   console.error('Supabase login empresa:',err);
   const texto=/rate limit/i.test(err.message)
     ?'O Supabase bloqueou temporariamente novas tentativas. Aguarde alguns minutos e tente novamente.'
     :/invalid login|invalid credentials/i.test(err.message)
       ?'CNPJ/e-mail ou senha incorretos.'
       :'Não foi possível entrar: '+err.message;
   msg('#msgLoginEmpresa',texto)
 })
};
async function sbCarregarVagasEmpresaAtualEM(){
 const t=await sbGarantirSessaoEM();if(!t)throw new Error('Sessão da empresa expirada.');
 const emp=await sbBuscarMinhaEmpresaEM();if(!emp)throw new Error('Empresa não encontrada.');
 sessionStorage.setItem('empresaSupabaseUserId',emp.user_id||'');
 sessionStorage.setItem('empresaSupabaseEmpresaId',emp.id||'');
 const locais=ler('empregaMaisVagas');
 const a=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&empresa_id=eq.'+encodeURIComponent(emp.id)+'&order=criado_em.desc',{method:'GET',headers:sbHeadersEM(t)});
 const proprias=(Array.isArray(a)?a:[]).map(sbMapVagaEM).filter(Boolean);
 const empresaId=String(emp.id||''),uid=String(emp.user_id||''),cnpj=nums(emp.cnpj||'');
 const locaisDaEmpresa=locais.filter(v=>String(v.empresaId||'')===empresaId||String(v.userId||v.user_id||'')===uid||(cnpj&&nums(v.empresaCnpj||v.cnpj||'')===cnpj));
 const mapa=new Map();locaisDaEmpresa.forEach(v=>mapa.set(String(v.id),v));proprias.forEach(v=>mapa.set(String(v.id),v));
 sbVagasCacheEM=[...mapa.values()];gravar('empregaMaisVagas',sbVagasCacheEM);return sbVagasCacheEM
}
/* EMPREGAMAIS-ADMIN-RLS-DIAGNOSTICO-V6 */
async function adminCarregarVagasSupabase(){
 const t=await adminSbToken();
 const u=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/auth/v1/user',{method:'GET',headers:sbHeadersEM(t)});
 const a=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&order=criado_em.desc',{method:'GET',headers:sbHeadersEM(t)});
 const remotas=(Array.isArray(a)?a:[]).map(sbMapVagaEM).filter(Boolean);
 if(!remotas.length){
   const err=new Error('A sessão ADM está autenticada, mas o Supabase não liberou nenhuma vaga para este usuário. A política RLS atual só permite à empresa ver as próprias vagas e ao público ver vagas aprovadas.');
   err.code='ADMIN_RLS_SEM_ACESSO';err.userId=u?.id||'';throw err
 }
 /* Uma leitura administrativa pode ser parcial por contexto/RLS. Nunca substituir
    todo o cache por essa resposta: consolidar por ID evita a vaga aparecer no
    primeiro desenho e sumir quando outra sincronização termina. */
 const locais=Array.isArray(ler('empregaMaisVagas'))?ler('empregaMaisVagas'):[];
 const mapa=new Map();
 locais.forEach(v=>{if(v?.id)mapa.set(String(v.id),v)});
 if(Array.isArray(sbVagasCacheEM))sbVagasCacheEM.forEach(v=>{if(v?.id)mapa.set(String(v.id),v)});
 remotas.forEach(v=>{if(v?.id)mapa.set(String(v.id),v)});
 sbVagasCacheEM=[...mapa.values()];
 gravar('empregaMaisVagas',sbVagasCacheEM);
 return remotas
}

/* EMPREGAMAIS-PAINEL-AUTOREFRESH-V1
   Mantém o painel da empresa sincronizado sem F5.
   Consulta apenas enquanto a página do painel está aberta. */
let empresaPainelAutoRefreshTimerEM=null,empresaPainelAutoRefreshBusyEM=false,empresaPainelAssinaturaEM='';
function empresaPainelEstaAbertoEM(){return !!document.querySelector('#pagina-painel-empresa.ativa')&&papelAtual()==='empresa'}
function empresaPainelAssinaturaVagasEM(vs){return (vs||[]).map(v=>[v.id,v.status,v.editadoEm||'',v.motivoReprovacao||''].join(':')).sort().join('|')}
async function empresaPainelAtualizarSemF5EM(forcar){
 if(!empresaPainelEstaAbertoEM()||empresaPainelAutoRefreshBusyEM)return;
 empresaPainelAutoRefreshBusyEM=true;
 try{
   const vs=await sbCarregarVagasEmpresaAtualEM(),sig=empresaPainelAssinaturaVagasEM(vs);
   if(forcar||sig!==empresaPainelAssinaturaEM){empresaPainelAssinaturaEM=sig;_renderizarPainelEmpresaSyncV4()}
 }catch(e){console.warn('Atualização automática do painel:',e)}
 finally{empresaPainelAutoRefreshBusyEM=false}
}
function empresaPainelIniciarAutoRefreshEM(){
 if(empresaPainelAutoRefreshTimerEM)clearInterval(empresaPainelAutoRefreshTimerEM);
 empresaPainelAssinaturaEM='';
 setTimeout(()=>empresaPainelAtualizarSemF5EM(true),300);
 empresaPainelAutoRefreshTimerEM=setInterval(()=>empresaPainelAtualizarSemF5EM(false),5000)
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&empresaPainelEstaAbertoEM())empresaPainelAtualizarSemF5EM(false)});
const _abrirRotaAutoRefreshEM=abrirRota;
abrirRota=function(p){
 const r=_abrirRotaAutoRefreshEM(p);
 if(p==='painel-empresa')empresaPainelIniciarAutoRefreshEM();
 else if(empresaPainelAutoRefreshTimerEM){clearInterval(empresaPainelAutoRefreshTimerEM);empresaPainelAutoRefreshTimerEM=null}
 return r
};
if(new URLSearchParams(location.search).get('pagina')==='painel-empresa')setTimeout(empresaPainelIniciarAutoRefreshEM,700);

/* EMPREGAMAIS-VAGA-VALIDADE-30D-V1 */
function dataFimPadraoVagaEM(v){const base=new Date(v.criadoEm||Date.now());base.setDate(base.getDate()+30);return base}

/* EMPREGAMAIS-HEADER-CONTEXTUAL-V1 */
function atualizarHeaderContextualEM(){
 const papel=papelAtual(),body=document.body,emp=papel==='empresa',cand=papel==='candidato';body.classList.toggle('tem-empresa',emp);body.classList.toggle('tem-candidato',cand);body.classList.toggle('sessao-empresa',emp);body.classList.toggle('sessao-candidato',cand);body.classList.toggle('sessao-publica',!emp&&!cand);
 if(papel==='empresa'){const e=empresaLogada(),nome=e?.nome||sessionStorage.getItem('empresaNome')||'Empresa',plano=(typeof planoEmpresaAtual==='function'?planoEmpresaAtual()?.nome:'')||'Conta da empresa';const n=document.getElementById('topoEmpresaNome'),p=document.getElementById('topoEmpresaPlano'),a=document.getElementById('topoEmpresaAvatar');if(n)n.textContent=nome;if(p)p.textContent='Plano '+plano;if(a)a.textContent=(nome.trim()[0]||'E').toUpperCase()}
 if(papel==='candidato'){const nome=sessionStorage.getItem('candidatoNome')||'Candidato',n=document.getElementById('topoCandidatoNome'),a=document.getElementById('topoCandidatoAvatar');if(n)n.textContent=nome;if(a)a.textContent=(nome.trim()[0]||'C').toUpperCase()}
}
addEventListener('DOMContentLoaded',atualizarHeaderContextualEM);
const _irParaHeaderContextualEM=irPara;irPara=function(p){const r=_irParaHeaderContextualEM(p);setTimeout(atualizarHeaderContextualEM,0);return r};

/* EMPREGAMAIS-PERFIL-EMPRESA-WIZARD-V1 */
function perfilEmpresaEtapa(n){document.querySelectorAll('#formPerfilEmpresa .perfil-step').forEach(x=>x.classList.toggle('ativo',+x.dataset.perfilPanel===n));document.querySelectorAll('#perfilProgress [data-perfil-step]').forEach(x=>{const k=+x.dataset.perfilStep;x.classList.toggle('ativo',k===n);x.classList.toggle('feito',k<n)});document.querySelector('#pagina-perfil-empresa')?.scrollIntoView({behavior:'auto',block:'start'})}
function prepararChoicesPerfilEmpresa(){document.querySelectorAll('#formPerfilEmpresa .perfil-choice-row').forEach(g=>{if(g.dataset.ready)return;g.dataset.ready='1';const inp=document.getElementById(g.dataset.target);g.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{b.classList.toggle('ativo');if(inp)inp.value=[...g.querySelectorAll('button.ativo')].map(x=>x.textContent.trim()).join(', ')}));if(inp?.value){const vals=inp.value.split(',').map(x=>x.trim());g.querySelectorAll('button').forEach(b=>b.classList.toggle('ativo',vals.includes(b.textContent.trim())))}})}
const _carregarPerfilEmpresaWizard=carregarPerfilEmpresa;carregarPerfilEmpresa=function(){const r=_carregarPerfilEmpresaWizard();setTimeout(()=>{perfilEmpresaEtapa(1);prepararChoicesPerfilEmpresa()},0);return r};
addEventListener('DOMContentLoaded',prepararChoicesPerfilEmpresa);
(function(){
 if(window.__empPerfilNavReady)return;window.__empPerfilNavReady=true;
 document.addEventListener('click',function(ev){
   const btn=ev.target.closest('#pagina-perfil-empresa #perfilProgress [data-perfil-step]');
   if(!btn)return;
   ev.preventDefault();
   const n=Number(btn.dataset.perfilStep||0);
   if(n>=1&&n<=7){
     if(n===7&&typeof montarRevisaoPerfilEmpresa==='function')montarRevisaoPerfilEmpresa();
     perfilEmpresaEtapa(n);
     const card=document.querySelector('#pagina-perfil-empresa .perfil-wizard-layout-split');
     if(card)card.scrollIntoView({behavior:'smooth',block:'start'});
   }
 },true);
})();

/* EMPREGAMAIS-PERFIL-EMPRESA-WIZARD-V2 */
function montarRevisaoPerfilEmpresa(){const box=document.getElementById('perfilEmpresaRevisao');if(!box)return;const emp=empresaLogada()||{},p=emp.perfil||{},campo=(id,fallback='')=>document.getElementById(id)?.value?.trim()||fallback||'Não informado';const aviso=document.getElementById('msgPerfilEmpresa');if(aviso){aviso.textContent='';aviso.className='form-msg'}const dados=[['Empresa',campo('perfilNome',p.nome||emp.nome)],['CNPJ',campo('contaCnpj',emp.cnpj)],['Porte',campo('perfilPorte',p.porte)],['Segmento',campo('perfilSegmento',p.segmento)],['Áreas de atuação',campo('perfilAreas',p.areas)],['Modalidades',campo('perfilModalidades',p.modalidades)],['Localização',[campo('perfilCidade',p.cidade||emp.cidade),campo('perfilUf',p.uf||emp.uf)].filter(x=>x!=='Não informado').join(' - ')||'Não informado'],['Site',campo('perfilSite',p.site)],['Responsável',campo('contaResponsavel',emp.responsavel)],['Função / cargo',campo('contaFuncaoResponsavel',emp.funcaoResponsavel||emp.funcao_responsavel)],['E-mail da conta',campo('contaEmail',emp.email)]];box.innerHTML=dados.map(x=>'<div><span>'+esc(x[0])+'</span><strong>'+esc(x[1])+'</strong></div>').join('')}
function prepararCepPerfilEmpresa(){const cep=document.getElementById('contaCep');if(!cep||cep.dataset.cepPerfil)return;cep.dataset.cepPerfil='1';cep.addEventListener('blur',async()=>{const n=cep.value.replace(/\D/g,'');if(n.length!==8)return;try{const r=await fetch('https://viacep.com.br/ws/'+n+'/json/'),d=await r.json();if(d.erro)return;const set=(id,val)=>{const e=document.getElementById(id);if(e&&!e.value)e.value=val||''};set('contaLogradouro',d.logradouro);set('contaBairro',d.bairro);set('perfilCidade',d.localidade);set('perfilUf',d.uf);const cc=document.getElementById('contaCidade'),cu=document.getElementById('contaUf');if(cc)cc.value=d.localidade||'';if(cu)cu.value=d.uf||''}catch(e){console.warn('CEP da empresa:',e)}})}
addEventListener('DOMContentLoaded',prepararCepPerfilEmpresa);

/* EMPREGAMAIS-VAGA-30-DIAS-PUBLICACAO-V2 */
function dataEncerramentoAutomaticaEM(){const d=new Date();d.setDate(d.getDate()+30);return d.toISOString().slice(0,10)}

/* EMPREGAMAIS-LOCAL-CORPORATIVO-V7 */
(function(){
 const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
 function atualizarLocalCorporativo(){
  const tipo=q('input[name="tipoLocalVaga"]:checked')?.value||'propria',aj=q('#localAjudaVaga'),multi=q('#multiplosLocaisVaga');
  qa('.em-endereco-campo,.em-cidade-campo').forEach(el=>el.style.display=tipo==='remoto'||tipo==='multiplos'?'none':'');
  if(multi)multi.classList.toggle('ativo',tipo==='multiplos');
  if(aj)aj.textContent=tipo==='propria'?'Selecione ou informe a unidade onde o profissional trabalhará.':tipo==='outro'?'Informe o endereço do cliente, filial ou local onde o profissional trabalhará.':tipo==='remoto'?'Vaga remota: informe no anúncio a abrangência desejada, como Brasil, estado ou região.':'Adicione abaixo todas as localidades desta oportunidade.';
 }
 document.addEventListener('change',e=>{
  if(e.target?.name==='tipoLocalVaga')atualizarLocalCorporativo();
  if(e.target?.id==='vagaParaCliente'){const box=q('#vagaClienteCampos');if(box)box.classList.toggle('ativo',e.target.checked)}
 });
 document.addEventListener('click',e=>{
  if(e.target?.id==='adicionarLocalVaga'){const nome=prompt('Informe a cidade, unidade ou região:');if(!nome?.trim())return;const item=document.createElement('span');item.className='em-local-chip';item.innerHTML='<b>'+nome.trim().replace(/[<>]/g,'')+'</b><button type="button" aria-label="Remover">×</button>';item.querySelector('button').onclick=()=>item.remove();q('#listaLocaisVaga')?.appendChild(item)}
 });
 document.addEventListener('DOMContentLoaded',atualizarLocalCorporativo);
})();


/* EMPREGAMAIS-PLANOS-CLICK-FIX-V3 */
function escolherPlanoAtual(plano){
 const p=plano||document.getElementById('planoBEscolher')?.dataset.plano||planoBAtual||'basico';
 sessionStorage.setItem('planoPretendido',p);
 if(papelAtual()!=='empresa'){irPara('login-empresa');return;}
 selecionarPlano(p);
}
document.addEventListener('click',function(e){
 const btn=e.target.closest('#planoBEscolher');
 if(!btn)return;
 e.preventDefault();
 e.stopPropagation();
 escolherPlanoAtual(btn.dataset.plano);
},false);

/* EMPREGAMAIS — DESTAQUES — RENDERIZAÇÃO E NAVEGAÇÃO V8: uma única linha */
let indiceDestaquesEM=0;
let sbDestaquesPublicosEM=[];
function vagasDestaqueOrdenadasEM(){
 const base=Array.isArray(sbDestaquesPublicosEM)&&sbDestaquesPublicosEM.length?sbDestaquesPublicosEM:vagasPublicas();
 const mapa=new Map();
 [...base,...vagasPublicas()].forEach(v=>{if(v?.id&&destaqueAtivo(v)&&v.status==='aprovada'&&vagaDentroPrazo(v))mapa.set(String(v.id),v)});
 return [...mapa.values()]
  .sort((a,b)=>new Date(b.criadoEm||b.dataPublicacao||b.data||0)-new Date(a.criadoEm||a.dataPublicacao||a.data||0));
}
async function carregarDestaquesPublicosEM(){
 try{
  const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&status=eq.aprovada&destaque=eq.true&order=criado_em.desc',{method:'GET',headers:sbHeadersEM()});
  if(Array.isArray(rows)){
   sbDestaquesPublicosEM=rows.map(sbMapVagaEM).filter(v=>v&&vagaDentroPrazo(v)&&destaqueAtivo(v));
   const geral=new Map((Array.isArray(sbVagasCacheEM)?sbVagasCacheEM:[]).filter(v=>v?.id).map(v=>[String(v.id),v]));
   sbDestaquesPublicosEM.forEach(v=>geral.set(String(v.id),v));
   sbVagasCacheEM=[...geral.values()];
   gravar('empregaMaisVagas',sbVagasCacheEM);
  }
 }catch(e){console.warn('+ Empregos: não foi possível atualizar os destaques públicos.',e)}
 return sbDestaquesPublicosEM;
}
function quantidadeDestaquesVisiveisEM(){return window.innerWidth<=700?1:window.innerWidth<=1050?2:4}
function aplicarLayoutDestaquesDesktopEM(el){
 if(!el)return;
 const mobile=window.innerWidth<=700,tablet=!mobile&&window.innerWidth<=1050;
 el.style.setProperty('display',mobile?'block':'grid','important');
 el.style.setProperty('grid-template-columns',mobile?'1fr':tablet?'repeat(2,minmax(0,1fr))':'repeat(4,minmax(0,1fr))','important');
 el.style.setProperty('gap',mobile?'0':'14px','important');
 el.style.setProperty('width','100%','important');
 el.style.setProperty('overflow','visible','important');
 el.querySelectorAll('.portal-vaga-nova').forEach(card=>{
  card.style.setProperty('width','100%','important');
  card.style.setProperty('max-width','none','important');
  card.style.setProperty('min-width','0','important');
  card.style.setProperty('height',mobile?'auto':tablet?'430px':'440px','important');
  card.style.setProperty('min-height',mobile?'0':tablet?'430px':'440px','important');
  card.style.setProperty('max-height',mobile?'none':tablet?'430px':'440px','important');
  card.style.setProperty('aspect-ratio','auto','important');
  card.style.setProperty('margin','0','important');
  card.style.setProperty('box-sizing','border-box','important');
 });
}
function renderDestaquesEM(lista){
 const el=document.getElementById('listaDestaques');if(!el)return;
 const arr=Array.isArray(lista)?lista:[],total=arr.length,qtd=quantidadeDestaquesVisiveisEM();
 if(window.innerWidth<=700){
  if(total&&indiceDestaquesEM>=total)indiceDestaquesEM=0;
  if(indiceDestaquesEM<0)indiceDestaquesEM=Math.max(0,total-1);
  el.innerHTML=total?cardVagaDestaqueEM(arr[indiceDestaquesEM]):'';
  el.dataset.quantidade=String(total?1:0);
  aplicarLayoutDestaquesDesktopEM(el);
  prepararDestaquesMobileEM(el,total);
  const faixa=document.getElementById('destaquesFaixaEM');if(faixa)faixa.classList.add('oculto');
  return;
 }
 if(indiceDestaquesEM>Math.max(0,total-qtd))indiceDestaquesEM=0;
 const vis=[];for(let i=0;i<Math.min(qtd,total);i++)vis.push(arr[(indiceDestaquesEM+i)%total]);
 el.innerHTML=vis.map(cardVagaDestaqueEM).join('');
 el.dataset.quantidade=String(vis.length);
 aplicarLayoutDestaquesDesktopEM(el);
 const faixa=document.getElementById('destaquesFaixaEM');if(faixa)faixa.classList.add('oculto');
}
function prepararDestaquesMobileEM(el,total){
 const wrap=el.parentNode;if(!wrap)return;
 let prev=wrap.querySelector('.destaques-mobile-seta.anterior');
 let next=wrap.querySelector('.destaques-mobile-seta.proxima');
 let dots=wrap.querySelector('.destaques-mobile-dots');
 if(!prev){prev=document.createElement('button');prev.type='button';prev.className='destaques-mobile-seta anterior';prev.innerHTML='‹';prev.setAttribute('aria-label','Vaga em destaque anterior');wrap.appendChild(prev)}
 if(!next){next=document.createElement('button');next.type='button';next.className='destaques-mobile-seta proxima';next.innerHTML='›';next.setAttribute('aria-label','Próxima vaga em destaque');wrap.appendChild(next)}
 if(!dots){dots=document.createElement('div');dots.className='destaques-mobile-dots';wrap.appendChild(dots)}
 prev.hidden=total<2;next.hidden=total<2;
 prev.onclick=()=>moverDestaques(-1);next.onclick=()=>moverDestaques(1);
 const max=Math.min(total,8);
 dots.innerHTML=Array.from({length:max},(_,i)=>'<button type="button" class="destaques-mobile-ponto'+(i===indiceDestaquesEM?' ativo':'')+'" aria-label="Ir para vaga em destaque '+(i+1)+'"></button>').join('');
 [...dots.querySelectorAll('.destaques-mobile-ponto')].forEach((b,i)=>b.onclick=()=>{indiceDestaquesEM=i;renderDestaquesEM(vagasDestaqueOrdenadasEM())});
}
function moverDestaques(dir){
 const el=document.getElementById('listaDestaques');if(!el)return;
 const cards=el.querySelectorAll('.portal-vaga-nova');if(cards.length<1)return;
 const todas=vagasDestaqueOrdenadasEM(),qtd=quantidadeDestaquesVisiveisEM();
 if(todas.length<=qtd)return;
 indiceDestaquesEM+=dir;
 if(indiceDestaquesEM>todas.length-qtd)indiceDestaquesEM=0;
 if(indiceDestaquesEM<0)indiceDestaquesEM=todas.length-qtd;
 renderDestaquesEM(todas);
}
let indiceFaixaDestaquesEM=0;
function quantidadeFaixaDestaquesEM(){return window.innerWidth<=560?1:window.innerWidth<=900?2:4}
function cardDestaqueMiniEM(v){
 const logo=logoEmpresaVaga(v),nome=v.confidencial?'Empresa confidencial':(v.empresa||'Empresa');
 const logoHtml=logo?'<img class="destaque-mini-logo" src="'+esc(logo)+'" alt="">':'<span class="destaque-mini-logo fallback">'+esc(nome.charAt(0).toUpperCase())+'</span>';
 return '<article class="destaque-mini-em" onclick="abrirVaga(\''+v.id+'\')"><div class="destaque-mini-top">'+logoHtml+'<div class="destaque-mini-copy"><h3>'+esc(tituloVaga(v))+'</h3><p>'+esc(nome)+'</p><span class="destaque-mini-local">⌖ '+esc(v.cidade||'')+(v.estado?' - '+esc(v.estado):'')+'</span></div></div><div class="destaque-mini-tags"><span>'+esc(v.modalidade||'Não informado')+'</span><span>'+esc(v.contrato||'Não informado')+'</span></div></article>';
}
function renderFaixaDestaquesEM(lista){
 const box=document.getElementById('listaDestaquesFaixaEM'),wrap=document.getElementById('destaquesFaixaEM');if(!box||!wrap)return;
 const arr=Array.isArray(lista)?lista:[];
 const idsPrincipais=new Set(Array.from(document.querySelectorAll('#listaDestaques .portal-vaga-nova')).map(card=>String(card.getAttribute('data-vaga-id')||'')).filter(Boolean));
 const principaisAtuais=[];for(let i=0;i<Math.min(quantidadeDestaquesVisiveisEM(),arr.length);i++)principaisAtuais.push(arr[(indiceDestaquesEM+i)%arr.length]);
 const idsExcluir=new Set([...idsPrincipais,...principaisAtuais.map(v=>String(v.id))]);
 const restantes=arr.filter(v=>!idsExcluir.has(String(v.id)));
 if(!restantes.length){wrap.classList.add('oculto');box.innerHTML='';return}
 wrap.classList.remove('oculto');const qtd=quantidadeFaixaDestaquesEM();if(indiceFaixaDestaquesEM>=restantes.length)indiceFaixaDestaquesEM=0;
 const vis=[];for(let i=0;i<Math.min(qtd,restantes.length);i++)vis.push(restantes[(indiceFaixaDestaquesEM+i)%restantes.length]);
 box.innerHTML=vis.map(cardDestaqueMiniEM).join('');
}
function moverFaixaDestaquesEM(dir){
 const todas=vagasDestaqueOrdenadasEM();
 const principais=[];for(let i=0;i<Math.min(quantidadeDestaquesVisiveisEM(),todas.length);i++)principais.push(String(todas[(indiceDestaquesEM+i)%todas.length]?.id||''));
 const restantes=todas.filter(v=>!principais.includes(String(v.id)));
 if(restantes.length<2)return;
 indiceFaixaDestaquesEM=(indiceFaixaDestaquesEM+dir+restantes.length)%restantes.length;
 renderFaixaDestaquesEM(todas);
}

(function(){let timer=null,pausado=false;function iniciar(){clearInterval(timer);timer=setInterval(function(){const el=document.getElementById('listaDestaques');if(!el||pausado)return;const total=vagasDestaqueOrdenadasEM().length;if(total>quantidadeDestaquesVisiveisEM())moverDestaques(1)},4500)}document.addEventListener('mouseover',function(e){if(e.target.closest&&e.target.closest('#listaDestaques'))pausado=true});document.addEventListener('mouseout',function(e){if(e.target.closest&&e.target.closest('#listaDestaques'))pausado=false});iniciar()})();

/* EMPREGAMAIS-VERIFICACAO-EMPRESA-V1 */
function iniciarSolicitacaoVerificacaoEM(lista,i,motivo='envio'){
 const emp=lista[i];if(!emp)return;
 emp.verificacaoStatus='em_analise';emp.verificada=false;emp.verificacaoEnviadaEm=new Date().toISOString();emp.verificacaoMotivo=motivo==='reanálise'?'Dados da empresa alterados — aguardando reanálise':'';
 gravar('empregaMaisEmpresas',lista);
 (async()=>{try{const token=await sbGarantirSessaoEM();if(!token)throw new Error('Sessão da empresa indisponível.');const body={verificacao_status:'em_analise',verificada:false,verificacao_enviada_em:emp.verificacaoEnviadaEm,verificacao_motivo:emp.verificacaoMotivo};const filtros=[];if(emp.id)filtros.push('id=eq.'+encodeURIComponent(emp.id));if(emp.userId)filtros.push('user_id=eq.'+encodeURIComponent(emp.userId));if(emp.cnpj)filtros.push('cnpj=eq.'+encodeURIComponent(nums(emp.cnpj)));let atualizado=null;for(const filtro of filtros){const r=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/empresas?'+filtro,{method:'PATCH',headers:Object.assign(sbHeadersEM(token),{'Prefer':'return=representation'}),body:JSON.stringify(body)});if(Array.isArray(r)&&r.length){atualizado=r[0];break}}if(!atualizado)throw new Error('A solicitação não foi gravada no cadastro da empresa.');const remoto=sbEmpresaParaLocalEM(atualizado,emp.senha||'');if(remoto)sbSalvarEmpresaLocalEM(remoto);}catch(err){console.error('Não foi possível sincronizar a reanálise da empresa no Supabase:',err);emp.verificacaoStatus='erro_sincronizacao';gravar('empregaMaisEmpresas',lista);const m=document.getElementById('msgPerfilEmpresa');if(m){m.textContent='Não foi possível enviar a solicitação para análise. Tente novamente.';m.className='form-msg erro'}}})();
 const m=document.getElementById('msgPerfilEmpresa');if(m){m.textContent='';m.className='form-msg'}
 const modal=document.getElementById('emVerificacaoModal');if(modal){const titulo=modal.querySelector('#emVerificacaoTitulo'),intro=modal.querySelector('.em-verificacao-dialog>p');if(titulo)titulo.textContent=motivo==='reanálise'?'Alterações enviadas para nova análise':'Verificação iniciada com sucesso';if(intro)intro.innerHTML=motivo==='reanálise'?'As alterações foram enviadas com sucesso. Sua empresa voltou para <strong>análise</strong> e o prazo é de <strong>até 48 horas</strong>. O selo ficará temporariamente suspenso até a nova aprovação.':'Recebemos as informações da sua empresa com sucesso. A solicitação foi enviada para <strong>análise</strong>, com prazo de <strong>até 48 horas</strong> para conclusão.';modal.classList.add('aberto');modal.setAttribute('aria-hidden','false');document.body.classList.add('em-modal-aberto')}
}
function concluirSolicitacaoVerificacaoEM(){
 const modal=document.getElementById('emVerificacaoModal');if(modal){modal.classList.remove('aberto');modal.setAttribute('aria-hidden','true')}document.body.classList.remove('em-modal-aberto');irPara('painel-empresa')
}
function renderStatusVerificacaoEmpresaEM(){
 const box=document.getElementById('empresaVerificacaoStatus');if(!box)return;const emp=empresaLogada(),pagina=document.getElementById('pagina-painel-empresa');if(!emp){box.innerHTML='';pagina?.classList.remove('empresa-verificada-painel');return}
 const s=emp.verificada||emp.verificacaoStatus==='aprovada'?'aprovada':(emp.verificacaoStatus||'nao_verificada');
 const aprovada=s==='aprovada';pagina?.classList.toggle('empresa-verificada-painel',aprovada);
 if(s==='pendente'||s==='em_analise'){box.style.display='';box.innerHTML='<div class="em-ver-status em-ver-pendente"><span class="em-ver-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span><div><small>VERIFICAÇÃO DA EMPRESA</small><strong>Aguardando análise</strong><p>Sua solicitação foi recebida e está em análise. O prazo para conclusão é de até 48 horas. O selo de Empresa Verificada será liberado após a aprovação.</p></div><b>EM ANÁLISE</b></div>';return}
 /* Depois da aprovação, o status passa a ser o selo compacto junto ao nome da empresa. */
 box.innerHTML='';box.style.display='none'
}
function atualizarVerificacaoSidebarPainelEM(){
 const pagina=document.getElementById('pagina-painel-empresa'),emp=empresaLogada();if(!pagina||!emp)return;
 const verificada=emp.verificada===true||emp.verificacaoStatus==='aprovada';
 const status=emp.verificacaoStatus||'nao_verificada';
 const nav=pagina.querySelector('.emp-dash-side nav');
 let btn=document.getElementById('empresaSideVerificarEM');
 if(!verificada&&nav){
  if(!btn){
   btn=document.createElement('button');
   btn.type='button';
   btn.id='empresaSideVerificarEM';
   btn.className='emp-side-verificar-em';
   btn.onclick=abrirVerificacaoEmpresaEM;
   btn.innerHTML='<i aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3l2.2 1.7 2.8-.2.8 2.7 2.3 1.6-1 2.6 1 2.6-2.3 1.6-.8 2.7-2.8-.2L12 21l-2.2-1.7-2.8.2-.8-2.7-2.3-1.6 1-2.6-1-2.6 2.3-1.6.8-2.7 2.8.2z"/><path d="M8.5 12h7"/></svg></i><span><b>Verificar empresa</b><small></small></span><em>›</em>';
   nav.appendChild(btn);
  }
  const small=btn.querySelector('small');
  if(small)small.textContent=(status==='pendente'||status==='em_analise')?'Em análise':'Concluir verificação';
  btn.classList.toggle('em-analise',status==='pendente'||status==='em_analise');
  btn.style.display='';
 }else if(btn){
  btn.remove();
 }

 const nome=document.getElementById('empProNome');
 let selo=document.getElementById('empresaPainelSeloVerificadaEM');
 if(verificada&&nome){
  if(!selo){
   selo=document.createElement('span');
   selo.id='empresaPainelSeloVerificadaEM';
   selo.className='empresa-painel-selo-verificada';
   selo.innerHTML='<i>✓</i><span>Empresa verificada</span>';
   nome.insertAdjacentElement('afterend',selo);
  }
  selo.style.display='inline-flex';
 }else if(selo){
  selo.remove();
 }
}

const _renderizarPainelEmpresaVerEM=renderizarPainelEmpresa;
renderizarPainelEmpresa=function(){const r=_renderizarPainelEmpresaVerEM.apply(this,arguments);renderStatusVerificacaoEmpresaEM();setTimeout(atualizarVerificacaoSidebarPainelEM,0);return r};


/* EMPREGAMAIS — acesso inteligente à verificação empresarial */
async function abrirVerificacaoEmpresaEM(){
 let emp=empresaLogada();
 try{
  const token=await sbGarantirSessaoEM();
  if(token){
   const remota=await sbBuscarMinhaEmpresaEM();
   if(remota){const atual=sbEmpresaParaLocalEM(remota,emp?.senha||'');if(atual){sbSalvarEmpresaLocalEM(atual);emp=atual}}
  }
 }catch(err){console.warn('Não foi possível atualizar o status da verificação:',err)}
 irPara('perfil-empresa');
 setTimeout(()=>mostrarVerificacaoEmpresaAbaEM(),120);
}

function atualizarAbasMinhaEmpresaEM(aba){
 const pagina=document.getElementById('pagina-perfil-empresa');if(!pagina)return;
 pagina.dataset.perfilTab=aba;
 pagina.querySelectorAll('.perfil-empresa-tabs button').forEach(b=>b.classList.toggle('ativo',b.dataset.tab===aba));
}
function mostrarPerfilEmpresaNormalEM(){
 const pagina=document.getElementById('pagina-perfil-empresa'),emp=empresaLogada();if(!pagina||!emp)return;
 pagina.classList.remove('perfil-bloqueado-ate-verificacao','modo-verificacao');
 atualizarAbasMinhaEmpresaEM('cadastro');
 const box=document.getElementById('perfilVerificacaoEmpresaEM');
 if(box)box.style.display='none';
 const head=pagina.querySelector('.perfil-wizard-head'),progresso=document.getElementById('perfilProgress'),layout=pagina.querySelector('.perfil-wizard-layout-split');
 [head,progresso,layout].forEach(x=>{if(x)x.style.display=''});
 setTimeout(()=>{prepararEmailCandidaturasMinhaEmpresaEM();carregarPerfilEmpresa()},0);
}
function mostrarVerificacaoEmpresaAbaEM(){
 const pagina=document.getElementById('pagina-perfil-empresa');if(!pagina)return;
 atualizarAbasMinhaEmpresaEM('verificacao');
 renderPerfilVerificacaoEmpresaEM();
}
window.mostrarPerfilEmpresaNormalEM=mostrarPerfilEmpresaNormalEM;
window.mostrarVerificacaoEmpresaAbaEM=mostrarVerificacaoEmpresaAbaEM;

/* EMPREGAMAIS-PERFIL-VERIFICACAO-ISOLADA-V2 */
function renderPerfilVerificacaoEmpresaEM(){
 const pagina=document.getElementById('pagina-perfil-empresa'),emp=empresaLogada();if(!pagina||!emp)return;
 let box=document.getElementById('perfilVerificacaoEmpresaEM');
 if(!box){box=document.createElement('section');box.id='perfilVerificacaoEmpresaEM';box.className='perfil-verificacao-em';const shell=pagina.querySelector('.perfil-wizard-shell');if(shell)shell.insertBefore(box,shell.firstChild)}
 const s=emp.verificada||emp.verificacaoStatus==='aprovada'||emp.verificacaoStatus==='verificada'?'aprovada':(emp.verificacaoStatus||'nao_verificada');
 pagina.classList.add('modo-verificacao');
 const formulario=pagina.querySelector('.perfil-wizard-head'),progresso=document.getElementById('perfilProgress'),layout=pagina.querySelector('.perfil-wizard-layout-split');
 [formulario,progresso,layout].forEach(x=>{if(x)x.style.display='none'});
 box.style.display='block';
 if(s==='nao_verificada'||s==='rejeitada'||s==='erro_sincronizacao'){
  const rejeitada=s==='rejeitada',erro=s==='erro_sincronizacao';
  const statusAviso=rejeitada?'<div class="pv-form-alert pv-form-alert-erro"><b>Verificação não aprovada</b><span>Revise os dados abaixo e envie novamente para análise.</span></div>':erro?'<div class="pv-form-alert pv-form-alert-erro"><b>Não foi possível concluir o último envio</b><span>Revise os dados e tente enviar novamente.</span></div>':'';
  box.innerHTML='<div class="pv-top pv-form-top"><button type="button" class="pv-voltar" onclick="irPara(\'painel-empresa\')">← Meu painel</button><span class="pv-kicker">VERIFICAÇÃO DA EMPRESA</span><div class="pv-title"><div class="pv-clock"><svg viewBox="0 0 24 24"><path d="M12 3l2.2 1.7 2.8-.2.8 2.7 2.3 1.6-1 2.6 1 2.6-2.3 1.6-.8 2.7-2.8-.2L12 21l-2.2-1.7-2.8.2-.8-2.7-2.3-1.6 1-2.6-1-2.6 2.3-1.6.8-2.7 2.8.2z"/></svg></div><div><h1>Verificar empresa</h1><p>Os dados básicos da conta já estão cadastrados. Agora informe somente os dados necessários para validar a empresa e liberar o selo <strong>Empresa Verificada</strong>.</p></div></div></div>'+statusAviso+
  '<div class="pv-verificacao-form-grid"><main><article class="pv-card"><div class="pv-card-head"><div><span>DADOS BÁSICOS DA CONTA</span><h2>Já cadastrados</h2></div><small>Não é necessário preencher novamente</small></div><div class="pv-data pv-data-basicos"><div><small>Empresa</small><strong>'+esc(emp.nome||'Não informado')+'</strong></div><div><small>CNPJ</small><strong>'+esc(emp.cnpj||'Não informado')+'</strong></div><div><small>E-mail corporativo</small><strong>'+esc(emp.emailCorporativo||emp.email||'Não informado')+'</strong></div><div><small>Telefone</small><strong>'+esc(emp.telefone||'Não informado')+'</strong></div><div><small>E-mail para candidaturas</small><strong>'+esc(emp.emailCandidaturas||emp.email||'Não informado')+'</strong></div></div><button type="button" class="pv-editar-basicos" onclick="mostrarPerfilEmpresaNormalEM()">Editar dados básicos em Minha Empresa</button></article>'+
  '<article class="pv-card pv-ver-form-card"><div class="pv-card-head"><div><span>DADOS PARA VERIFICAÇÃO</span><h2>Confirme a identidade da empresa</h2></div></div><form id="formVerificacaoEmpresaSeparadaEM" onsubmit="enviarVerificacaoEmpresaSeparadaEM(event)"><div class="pv-form-campos"><label><span>Razão social *</span><input id="verRazaoSocialEM" required value="'+esc(emp.razaoSocial||'')+'" placeholder="Razão social registrada no CNPJ"></label><label><span>Responsável pela empresa *</span><input id="verResponsavelEM" required value="'+esc(emp.responsavel||'')+'" placeholder="Nome do responsável"></label><label><span>Função / cargo *</span><input id="verFuncaoResponsavelEM" required value="'+esc(emp.funcaoResponsavel||'')+'" placeholder="Ex.: RH, Sócio, Gerente"></label><label><span>CEP *</span><input id="verCepEM" required value="'+esc(emp.cep||'')+'" inputmode="numeric" placeholder="00000-000"></label><label class="pv-form-wide"><span>Endereço *</span><input id="verLogradouroEM" required value="'+esc(emp.logradouro||'')+'" placeholder="Rua / avenida"></label><label><span>Número *</span><input id="verNumeroEM" required value="'+esc(emp.numero||'')+'" placeholder="Número"></label><label><span>Complemento</span><input id="verComplementoEM" value="'+esc(emp.complemento||'')+'" placeholder="Sala, bloco..."></label><label><span>Bairro *</span><input id="verBairroEM" required value="'+esc(emp.bairro||'')+'" placeholder="Bairro"></label><label><span>Cidade *</span><input id="verCidadeEM" required value="'+esc(emp.cidade||'')+'" placeholder="Cidade"></label><label><span>UF *</span><input id="verUfEM" required maxlength="2" value="'+esc(emp.uf||'')+'" placeholder="UF"></label></div><label class="pv-confirmacao"><input id="verConfirmacaoEM" type="checkbox" required><span>Confirmo que os dados acima correspondem à empresa cadastrada e podem ser analisados pelo + Empregos.</span></label><div id="msgVerificacaoEmpresaSeparadaEM" class="form-msg"></div><button type="submit" class="pv-enviar-verificacao">Enviar empresa para verificação →</button></form></article></main><aside><article class="pv-benefits"><span>O QUE É ANALISADO</span><div><i>✓</i><p><b>Identidade da empresa</b><small>Conferência entre CNPJ, razão social e cadastro.</small></p></div><div><i>✓</i><p><b>Responsável e endereço</b><small>Dados usados para validar a origem da conta empresarial.</small></p></div><div><i>✓</i><p><b>Sem repetir seu cadastro</b><small>E-mail, telefone e CNPJ já cadastrados são apenas exibidos para conferência.</small></p></div></article></aside></div>';
  setTimeout(prepararCepVerificacaoEmpresaEM,0);
  return;
 }
 if(s==='aprovada'){
  const p=emp.perfil||{};
  box.innerHTML='<div class="pv-top pv-aprovada"><button type="button" class="pv-voltar" onclick="irPara(\'painel-empresa\')">← Meu painel</button><span class="pv-kicker">VERIFICAÇÃO DA EMPRESA</span><div class="pv-title"><div class="pv-clock pv-check"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m7.5 12.2 3 3 6-6.4"/></svg></div><div><h1>Empresa verificada</h1><p><strong>'+esc(p.nome||emp.nome||'Sua empresa')+'</strong> foi aprovada na verificação do + Empregos. O selo de confiança está ativo no perfil empresarial.</p></div><b class="pv-approved-badge">VERIFICADA</b></div></div><div class="pv-approved-card"><div class="pv-seal"><svg viewBox="0 0 24 24"><path d="M12 3l2.2 1.7 2.8-.2.8 2.7 2.3 1.6-1 2.6 1 2.6-2.3 1.6-.8 2.7-2.8-.2L12 21l-2.2-1.7-2.8.2-.8-2.7-2.3-1.6 1-2.6-1-2.6 2.3-1.6.8-2.7 2.8.2z"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/></svg></div><div><span>STATUS ATUAL</span><h2>Selo Empresa Verificada ativo</h2><p>Seu perfil passou pela análise. Caso dados cadastrais importantes sejam alterados, a empresa poderá retornar automaticamente para reanálise.</p></div><button type="button" onclick="editarPerfilEmAnaliseEM()">Atualizar dados da empresa</button></div>';
  return;
 }
 const p=emp.perfil||{},data=emp.verificacaoEnviadaEm?new Date(emp.verificacaoEnviadaEm).toLocaleDateString('pt-BR'):'Recentemente';
 const nome=p.nome||emp.nome||'Sua empresa',local=[p.cidade||emp.cidade,p.uf||emp.uf].filter(Boolean).join(' - ')||'Não informado';
 box.innerHTML='<div class="pv-top"><button type="button" class="pv-voltar" onclick="irPara(\'painel-empresa\')">← Meu painel</button><span class="pv-kicker">VERIFICAÇÃO DA EMPRESA</span><div class="pv-title"><div class="pv-clock"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div><div><h1>Sua empresa está em análise</h1><p>Recebemos os dados de <strong>'+esc(nome)+'</strong>. Nossa equipe está verificando as informações antes de liberar o selo Empresa Verificada. O prazo para conclusão da análise é de até 48 horas.</p></div><b>EM ANÁLISE</b></div></div>'+
 '<div class="pv-grid"><main><article class="pv-card pv-progress-card"><div class="pv-card-head"><div><span>STATUS DA SOLICITAÇÃO</span><h2>Acompanhamento da verificação</h2></div><small>Enviado em '+esc(data)+'</small></div><div class="pv-steps"><div class="feito"><i>✓</i><b>Dados enviados</b><small>Informações recebidas</small></div><span></span><div class="ativo"><i>2</i><b>Em análise</b><small>Validação pelo + Empregos</small></div><span></span><div><i>3</i><b>Empresa verificada</b><small>Liberação do selo</small></div></div><div class="pv-info">Você pode continuar usando o portal normalmente enquanto a análise acontece. Se precisar, seus dados ainda podem ser editados antes da aprovação.</div></article>'+
 '<article class="pv-card"><div class="pv-card-head"><div><span>DADOS ENVIADOS</span><h2>Resumo da empresa</h2></div><button type="button" onclick="editarPerfilEmAnaliseEM()">Editar informações</button></div><div class="pv-data"><div><small>Empresa</small><strong>'+esc(nome)+'</strong></div><div><small>CNPJ</small><strong>'+esc(emp.cnpj||'Não informado')+'</strong></div><div><small>Segmento</small><strong>'+esc(p.segmento||'Não informado')+'</strong></div><div><small>Localização</small><strong>'+esc(local)+'</strong></div><div><small>Responsável</small><strong>'+esc(emp.responsavel||'Não informado')+'</strong></div><div><small>Função / cargo</small><strong>'+esc(emp.funcaoResponsavel||emp.funcao_responsavel||'Não informado')+'</strong></div><div><small>E-mail</small><strong>'+esc(emp.email||'Não informado')+'</strong></div></div></article></main>'+
 '<aside><article class="pv-badge"><span>EMPRESA VERIFICADA</span><div class="pv-seal"><svg viewBox="0 0 24 24"><path d="M12 3l2.2 1.7 2.8-.2.8 2.7 2.3 1.6-1 2.6 1 2.6-2.3 1.6-.8 2.7-2.8-.2L12 21l-2.2-1.7-2.8.2-.8-2.7-2.3-1.6 1-2.6-1-2.6 2.3-1.6.8-2.7 2.8.2z"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/></svg></div><h2>Mais confiança para sua marca empregadora</h2><p>Após a aprovação, o selo identifica sua empresa como verificada dentro do + Empregos.</p></article>'+
 '<article class="pv-benefits"><span>BENEFÍCIOS DA VERIFICAÇÃO</span><div><i>✓</i><p><b>Selo de Empresa Verificada</b><small>Identificação visual no perfil e nas áreas compatíveis do portal.</small></p></div><div><i>✓</i><p><b>Mais credibilidade</b><small>Ajuda candidatos a reconhecerem um perfil empresarial analisado.</small></p></div><div><i>✓</i><p><b>Perfil mais confiável</b><small>Reforça a identidade institucional apresentada aos profissionais.</small></p></div><div><i>✓</i><p><b>Destaque de confiança</b><small>O selo acompanha a presença da empresa onde a verificação for exibida.</small></p></div></article></aside></div>';
}
function editarPerfilEmAnaliseEM(){
 const pagina=document.getElementById('pagina-perfil-empresa'),box=document.getElementById('perfilVerificacaoEmpresaEM');atualizarAbasMinhaEmpresaEM('cadastro');pagina?.classList.remove('modo-verificacao');if(box)box.style.display='none';
 ['.perfil-wizard-head','#perfilProgress','.perfil-wizard-layout-split'].forEach(s=>{const x=pagina?.querySelector(s);if(x)x.style.display=''});
 perfilEmpresaEtapa(1);carregarPerfilEmpresa();window.scrollTo(0,0);
}

/* Atualiza automaticamente a tela de verificacao enquanto ela estiver aberta. */
(function(){
 if(window.__emVerificacaoAutoRefresh)return;window.__emVerificacaoAutoRefresh=true;
 setInterval(function(){
  const pg=document.getElementById('pagina-perfil-empresa');
  if(pg&&pg.classList.contains('ativa')&&pg.dataset.perfilTab==='verificacao'&&document.getElementById('perfilVerificacaoEmpresaEM')?.style.display!=='none')renderPerfilVerificacaoEmpresaEM();
 },5000);
})();


/* EMPREGAMAIS-CHAT-CANDIDATURA-V1 */
function chatLiberadoEM(c){const t=new Date(c?.criadoEm||0).getTime();return !t||Date.now()-t>=600000}
function mensagensCandidaturaEM(c){return Array.isArray(c?.mensagens)?c.mensagens:[]}
function nomeEmpresaCandidaturaEM(c){const v=ler('empregaMaisVagas').find(x=>x.id===c?.vagaId)||{};return v.confidencial?'Empresa responsável pela vaga':(v.empresa||sessionStorage.getItem('empresaNome')||'empresa')}
function mensagemPadraoCandidaturaEM(c){return 'Olá, '+(c.candidato||c.nome||'candidato')+'!\n\nAgradecemos o seu interesse em fazer parte da '+nomeEmpresaCandidaturaEM(c)+'.\n\nRecebemos a sua inscrição e, caso seu currículo atenda aos pré-requisitos solicitados, em breve entraremos em contato para falarmos sobre os próximos passos.\n\nLembrando que você pode acompanhar o andamento do seu processo seletivo pelo portal + Empregos.'}
function renderChatCandidaturaEM(c,visao){
 const msgs=mensagensCandidaturaEM(c),lib=chatLiberadoEM(c),rest=Math.max(0,Math.ceil((600000-(Date.now()-new Date(c.criadoEm||0).getTime()))/60000));
 const hist=msgs.length?msgs.map(m=>'<div class="chat-em-msg '+(m.autor===visao?'minha':'outra')+'"><small>'+esc(m.autor==='empresa'?nomeEmpresaCandidaturaEM(c):(c.candidato||'Candidato'))+'</small><p>'+esc(m.texto||'').replace(/\n/g,'<br>')+'</p><time>'+new Date(m.data).toLocaleString('pt-BR')+'</time></div>').join(''):'<div class="chat-em-vazio">Nenhuma mensagem nesta conversa ainda.</div>';
 if(visao==='empresa'&&!lib)return '<section class="chat-em-box"><div class="chat-em-head"><div><span>CONVERSA DO PROCESSO SELETIVO</span><h3>Mensagens com '+esc(c.candidato||'candidato')+'</h3></div><b>Disponível em '+rest+' min</b></div><div class="chat-em-bloqueado">A primeira mensagem será liberada 10 minutos após o recebimento da candidatura.</div></section>';
 const composer=visao==='empresa'?'<div class="chat-em-compose"><textarea id="chatTextoEM_'+c.id+'" rows="5">'+esc(msgs.length?'':mensagemPadraoCandidaturaEM(c))+'</textarea><div><button type="button" class="btn" onclick="restaurarMensagemPadraoEM(\''+c.id+'\')">Restaurar mensagem padrão</button><button type="button" class="btn btn-azul" onclick="enviarMensagemCandidaturaEM(\''+c.id+'\',\'empresa\')">Enviar mensagem</button></div></div>':'<div class="chat-em-compose"><textarea id="chatTextoEM_'+c.id+'" rows="3" placeholder="Digite sua mensagem para a empresa..."></textarea><div><button type="button" class="btn btn-azul" onclick="enviarMensagemCandidaturaEM(\''+c.id+'\',\'candidato\')">Enviar mensagem</button></div></div>';
 return '<section class="chat-em-box"><div class="chat-em-head"><div><span>MENSAGENS</span><h3>'+(visao==='empresa'?'Conversa com '+esc(c.candidato||'candidato'):'Conversa sobre esta candidatura')+'</h3></div><b>'+msgs.length+' mensagem(ns)</b></div><div class="chat-em-historico">'+hist+'</div>'+composer+'</section>'
}
function abrirChatCandidatoEM(id){
 const c=candidaturas().find(x=>x.id===id);if(!c)return;
 if(!chatLiberadoEM(c)){const rest=Math.max(1,Math.ceil((600000-(Date.now()-new Date(c.criadoEm||0).getTime()))/60000));alert('As mensagens serão liberadas em aproximadamente '+rest+' minuto(s).');return}
 abrirFichaCandidato(id);setTimeout(()=>document.querySelector('#fichaCandidatoConteudo .chat-em-box')?.scrollIntoView({behavior:'smooth',block:'center'}),100)
}
function restaurarMensagemPadraoEM(id){const c=candidaturas().find(x=>x.id===id),el=document.getElementById('chatTextoEM_'+id);if(c&&el)el.value=mensagemPadraoCandidaturaEM(c)}
function enviarMensagemCandidaturaEM(id,autor){
 const a=candidaturas(),i=a.findIndex(x=>x.id===id);if(i<0)return;
 if(autor==='empresa'&&!chatLiberadoEM(a[i]))return alert('A mensagem ainda não foi liberada.');
 const el=document.getElementById('chatTextoEM_'+id),texto=(el?.value||'').trim();if(!texto)return alert('Digite uma mensagem antes de enviar.');
 a[i].mensagens=mensagensCandidaturaEM(a[i]);a[i].mensagens.push({id:'msg_'+Date.now(),autor,texto,data:new Date().toISOString(),lidaEmpresa:autor==='empresa',lidaCandidato:autor==='candidato'});
 a[i].ultimaMensagemEm=new Date().toISOString();gravar('empregaMaisCandidaturas',a);
 if(autor==='empresa'){
  const chatModal=document.querySelector('.recruta-andamento-modal-em .em-modal-mensagens .chat-em-box');
  if(chatModal){
   const wrap=document.createElement('div');wrap.innerHTML=renderChatCandidaturaEM(a[i],'empresa');
   const novo=wrap.firstElementChild;if(novo)chatModal.replaceWith(novo);
  }else abrirFichaCandidato(id)
 }else renderizarCandidaturasCandidato()
}


/* CENTRAL DA EMPRESA V1 */
function renderCentralEmpresaEM(){
 const emp=empresaLogada();if(!emp)return;
 const vagas=vagasDaEmpresa(),ids=new Set(vagas.map(v=>v.id)),apps=candidaturas().filter(a=>ids.has(a.vagaId));
 const ativas=vagas.filter(v=>v.status==='aprovada'&&vagaDentroPrazo(v)).length;
 const entrevistas=apps.filter(a=>grupoEtapa(a.status)==='Entrevista').length,contratados=apps.filter(a=>grupoEtapa(a.status)==='Contratados').length;
 const plano=emp.plano||sessionStorage.getItem('empresaPlano')||'Grátis',nome=emp.perfil?.nome||emp.nome||sessionStorage.getItem('empresaNome')||'Minha empresa';
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set('ceEmpresaNome',nome);set('cePlanoAtual',plano);set('cePlanoNome','Plano '+plano);set('ceVagasAtivas',ativas);set('ceVagasTotal',vagas.length+' processos cadastrados');set('ceCandidaturas',apps.length);set('ceEntrevistas',entrevistas);set('ceContratacoes',contratados);
 const funil=document.getElementById('ceFunil'),etapas=[['Em avaliação','Em avaliação'],['Em contato','Em contato'],['Entrevistas','Entrevista'],['Aprovados','Aprovados'],['Contratados','Contratados']];
 if(funil)funil.innerHTML=etapas.map(([n,g])=>{const q=apps.filter(a=>grupoEtapa(a.status)===g).length,p=apps.length?Math.round(q/apps.length*100):0;return'<div><div><b>'+n+'</b><strong>'+q+'</strong></div><span><i style="width:'+p+'%"></i></span><small>'+p+'% das candidaturas</small></div>'}).join('');
 const unidades=document.getElementById('ceUnidades'),filiais=Array.isArray(emp.filiais)?emp.filiais:[];
 if(unidades)unidades.innerHTML='<article class="matriz"><i>▦</i><div><span>MATRIZ</span><h3>'+esc(nome)+'</h3><p>'+esc([emp.perfil?.cidade||emp.cidade,emp.perfil?.uf||emp.uf].filter(Boolean).join(' - ')||'Localização não informada')+'</p></div><b>'+ativas+' vagas ativas</b></article>'+filiais.map(f=>'<article><i>⌖</i><div><span>FILIAL</span><h3>'+esc(f.nome||'Unidade')+'</h3><p>'+esc([f.cidade,f.uf].filter(Boolean).join(' - '))+'</p></div><b>Ver operação</b></article>').join('')+(filiais.length?'':'<button class="ce-add-filial" type="button">＋ Adicionar filial</button>');
 const uso=document.getElementById('ceUsoPlano');if(uso){const limite=plano.toLowerCase().includes('gr')?3:25,pc=Math.min(100,Math.round(ativas/limite*100));uso.innerHTML='<div><span><b>Vagas ativas</b><em>'+ativas+' / '+limite+'</em></span><i><b style="width:'+pc+'%"></b></i></div><div><span><b>Destaques utilizados</b><em>'+vagas.filter(v=>v.destaque).length+'</em></span></div><div><span><b>Vagas urgentes</b><em>'+vagas.filter(v=>v.urgente).length+'</em></span></div>'}
 const rec=document.getElementById('ceRecursosConta');if(rec)rec.innerHTML='<div><i>✓</i><span><b>Perfil empresarial</b><small>Identidade e marca empregadora</small></span></div><div><i>✓</i><span><b>Gestão de candidatos</b><small>Funil completo do processo seletivo</small></span></div><div><i>✓</i><span><b>Mensagens internas</b><small>Converse com candidatos pelo portal</small></span></div><div><i>✓</i><span><b>Matriz e filiais</b><small>Operação centralizada por unidade</small></span></div>';
 const ativ=document.getElementById('ceAtividade');if(ativ){const itens=apps.slice().sort((a,b)=>new Date(b.atualizadoEm||b.criadoEm||0)-new Date(a.atualizadoEm||a.criadoEm||0)).slice(0,6);ativ.innerHTML=itens.length?itens.map(a=>{const v=vagas.find(x=>x.id===a.vagaId)||{};return'<div><i>♟</i><span><b>'+esc(a.candidato||a.nome||'Candidato')+'</b><small>'+esc(tituloVaga(v))+' · '+esc(a.status||'Em avaliação')+'</small></span><time>'+new Date(a.atualizadoEm||a.criadoEm).toLocaleDateString('pt-BR')+'</time></div>'}).join(''):'<div class="ce-empty">As atividades dos seus processos seletivos aparecerão aqui.</div>'}
}


/* CONSTRUTOR DE CURRICULO ONLINE EMPREGAMAIS */
function chaveCurriculoOnlineEM(){return 'empregaMaisCurriculoOnline_'+(sessionStorage.getItem('candidatoEmail')||'anon').toLowerCase()}
function dadosCurriculoOnlineEM(){return ler(chaveCurriculoOnlineEM(),{})||{}}
function cvVal(id){return document.getElementById(id)?.value?.trim()||''}
function itemExperienciaCV(d={}){return '<article class="cv-repeat-item"><button type="button" onclick="this.parentElement.remove();salvarCurriculoOnlineEM()">×</button><div class="cv-fields"><label>Cargo<input class="campo cv-exp-cargo" value="'+esc(d.cargo||'')+'"></label><label>Empresa<input class="campo cv-exp-empresa" value="'+esc(d.empresa||'')+'"></label><label>Data de início <small class="cv-date-label">Mês e ano</small><input class="campo cv-exp-inicio" type="month" value="'+esc(d.inicio||'')+'"></label><label>Data de término <small class="cv-date-label">Mês e ano</small><input class="campo cv-exp-fim" type="month" value="'+esc(d.fim||'')+'" '+(d.atual?'disabled':'')+'></label><label class="full cv-inline-check"><input type="checkbox" class="cv-exp-atual" '+(d.atual?'checked':'')+' onchange="alternarEmpregoAtualCV(this)"><span>Trabalho atualmente nesta empresa</span></label><label class="full">Atividades<textarea class="campo cv-exp-ativ" rows="3">'+esc(d.atividades||'')+'</textarea></label></div></article>'}
function itemFormacaoCV(d={}){return '<article class="cv-repeat-item"><button type="button" onclick="this.parentElement.remove();salvarCurriculoOnlineEM()">×</button><div class="cv-fields"><label>Curso / formação<input class="campo cv-for-curso" value="'+esc(d.curso||'')+'"></label><label class="cv-inst-field">Instituição<div class="cv-inst-search"><input class="campo cv-for-inst" autocomplete="off" value="'+esc(d.instituicao||'')+'" placeholder="Comece a digitar o nome da instituição" oninput="buscarInstituicaoCV(this)" onfocus="buscarInstituicaoCV(this)"><div class="cv-inst-results oculto"></div></div><small class="cv-inst-hint">Busque pelo nome ou sigla. Se não encontrar, continue digitando manualmente.</small></label><label>Situação<select class="campo cv-for-status" onchange="alternarSituacaoFormacaoCV(this)"><option value="">Selecione</option><option value="Concluído" '+(d.status==='Concluído'?'selected':'')+'>Concluído</option><option value="Cursando" '+(d.status==='Cursando'?'selected':'')+'>Cursando</option><option value="Interrompido" '+(d.status==='Interrompido'?'selected':'')+'>Interrompido</option></select></label><label><span class="cv-for-date-title">'+(d.status==='Cursando'?'Previsão de conclusão':'Data de conclusão')+'</span> <small class="cv-date-label">Mês e ano</small><input class="campo cv-for-fim" type="month" value="'+esc(d.fim||'')+'"></label></div></article>'}
function itemCursoCV(d={}){return '<article class="cv-repeat-item"><button type="button" onclick="this.parentElement.remove();salvarCurriculoOnlineEM()">×</button><div class="cv-fields"><label>Curso / certificação<input class="campo cv-cur-nome" value="'+esc(d.nome||'')+'"></label><label>Instituição<input class="campo cv-cur-inst" value="'+esc(d.instituicao||'')+'"></label><label>Carga horária<input class="campo cv-cur-carga" value="'+esc(d.carga||'')+'" placeholder="Ex.: 40 horas"></label><label>Conclusão<input class="campo cv-cur-fim" value="'+esc(d.conclusao||'')+'"></label></div></article>'}
function adicionarExperienciaCV(d={}){document.getElementById('cvExperiencias')?.insertAdjacentHTML('beforeend',itemExperienciaCV(d))}
function adicionarFormacaoCV(d={}){document.getElementById('cvFormacoes')?.insertAdjacentHTML('beforeend',itemFormacaoCV(d))}
function adicionarCursoCV(d={}){document.getElementById('cvCursos')?.insertAdjacentHTML('beforeend',itemCursoCV(d))}
function coletarCurriculoOnlineEM(){
 const ex=[...document.querySelectorAll('#cvExperiencias .cv-repeat-item')].map(x=>({cargo:x.querySelector('.cv-exp-cargo')?.value||'',empresa:x.querySelector('.cv-exp-empresa')?.value||'',inicio:x.querySelector('.cv-exp-inicio')?.value||'',fim:x.querySelector('.cv-exp-fim')?.value||'',atual:!!x.querySelector('.cv-exp-atual')?.checked,atividades:x.querySelector('.cv-exp-ativ')?.value||''}));
 const fo=[...document.querySelectorAll('#cvFormacoes .cv-repeat-item')].map(x=>({curso:x.querySelector('.cv-for-curso')?.value||'',instituicao:x.querySelector('.cv-for-inst')?.value||'',status:x.querySelector('.cv-for-status')?.value||'',fim:x.querySelector('.cv-for-fim')?.value||''}));
 const cu=[...document.querySelectorAll('#cvCursos .cv-repeat-item')].map(x=>({nome:x.querySelector('.cv-cur-nome')?.value||'',instituicao:x.querySelector('.cv-cur-inst')?.value||'',carga:x.querySelector('.cv-cur-carga')?.value||'',conclusao:x.querySelector('.cv-cur-fim')?.value||''}));
 return {nome:cvVal('cvNome'),titulo:cvVal('cvTitulo'),email:cvVal('cvEmail'),telefone:cvVal('cvTelefone'),cep:cvVal('cvCep'),logradouro:cvVal('cvLogradouro'),bairro:cvVal('cvBairro'),cidade:cvVal('cvCidade'),uf:cvVal('cvUf'),area:cvVal('cvArea'),objetivo:cvVal('cvObjetivo'),modalidades:[...document.querySelectorAll('.cv-modalidade-check:checked')].map(x=>x.value),pretensao:cvVal('cvPretensao'),resumo:cvVal('cvResumo'),cnh:cvVal('cvCnh'),categoriasCnh:[...document.querySelectorAll('.cv-cnh-check:checked')].map(x=>x.value),veiculo:cvVal('cvVeiculo'),tipoVeiculo:cvVal('cvTipoVeiculo'),regiaoMinhaCidade:document.getElementById('cvRegiaoMinhaCidade')?.checked!==false,cidadesProximas:!!document.getElementById('cvCidadesProximas')?.checked,viagens:!!document.getElementById('cvViagens')?.checked,mudanca:!!document.getElementById('cvMudanca')?.checked,competencias:cvVal('cvCompetencias'),idiomas:cvVal('cvIdiomas'),linkedin:cvVal('cvLinkedin'),portfolio:cvVal('cvPortfolio'),experiencias:ex,formacoes:fo,cursos:cu,atualizadoEm:new Date().toISOString()}
}
function salvarCurriculoOnlineEM(e){if(e?.preventDefault)e.preventDefault();if(!document.getElementById('formCurriculoOnline'))return;const d=coletarCurriculoOnlineEM();gravar(chaveCurriculoOnlineEM(),d);const s=document.getElementById('cvSaveStatus');if(s)s.textContent='✓ Alterações salvas';const t=document.getElementById('cvSalvoEm');if(t)t.textContent='Salvo agora';atualizarPreviewCurriculoEM(d);atualizarProgressoCurriculoEM(d);return d}
function salvarCurriculoOnlineManualEM(){const form=document.getElementById('formCurriculoOnline');if(!form)return;if(!validarObrigatoriosEM(form))return;const d=salvarCurriculoOnlineEM();const s=document.getElementById('cvSaveStatus');if(s)s.textContent='✓ Currículo online salvo';const t=document.getElementById('cvSalvoEm');if(t)t.textContent='Salvo agora';const btn=form.querySelector('.cv-savebar .btn');if(btn){const original=btn.textContent;btn.textContent='✓ Currículo salvo';btn.classList.add('cv-saved');setTimeout(()=>{btn.textContent=original;btn.classList.remove('cv-saved')},2200)}abrirSucessoCurriculoEM();return d}

function carregarCurriculoOnlineEM(){
 const d=dadosCurriculoOnlineEM(),u=candidatoLogado()||{},p=u.perfil||{};const set=(id,v)=>{const e=document.getElementById(id);if(e)e.value=v||''};
 set('cvNome',d.nome||u.nome);set('cvTitulo',d.titulo||p.titulo);set('cvEmail',d.email||u.email||sessionStorage.getItem('candidatoEmail'));set('cvTelefone',d.telefone||u.telefone);set('cvCep',d.cep);set('cvLogradouro',d.logradouro);set('cvBairro',d.bairro);set('cvCidade',d.cidade||u.cidade);set('cvUf',d.uf||p.uf);set('cvArea',d.area||p.area);set('cvObjetivo',d.objetivo||p.titulo);const mods=Array.isArray(d.modalidades)?d.modalidades:(d.modalidade?[d.modalidade]:(p.modalidade?[p.modalidade]:[]));document.querySelectorAll('.cv-modalidade-check').forEach(x=>x.checked=mods.includes(x.value));atualizarModalidadesCV(false);set('cvPretensao',d.pretensao||p.pretensao);set('cvResumo',d.resumo||p.resumo);set('cvCnh',d.cnh);const cats=Array.isArray(d.categoriasCnh)?d.categoriasCnh:(d.categoriaCnh?String(d.categoriaCnh).split(''):[]);document.querySelectorAll('.cv-cnh-check').forEach(x=>x.checked=cats.includes(x.value));atualizarCategoriasCnhCV(false);set('cvVeiculo',d.veiculo);set('cvTipoVeiculo',d.tipoVeiculo);const chk=(id,v)=>{const e=document.getElementById(id);if(e)e.checked=!!v};chk('cvRegiaoMinhaCidade',d.regiaoMinhaCidade!==false);chk('cvCidadesProximas',d.cidadesProximas);chk('cvViagens',d.viagens===true||d.viagens==='sim');chk('cvMudanca',d.mudanca);set('cvCompetencias',d.competencias||p.competencias);set('cvIdiomas',d.idiomas);alternarMobilidadeCV();set('cvLinkedin',d.linkedin||p.linkedin);set('cvPortfolio',d.portfolio||p.portfolio);
 const ex=document.getElementById('cvExperiencias'),fo=document.getElementById('cvFormacoes'),cu=document.getElementById('cvCursos');if(ex){ex.innerHTML='';(d.experiencias?.length?d.experiencias:[{}]).forEach(adicionarExperienciaCV)}if(fo){fo.innerHTML='';(d.formacoes?.length?d.formacoes:[{}]).forEach(adicionarFormacaoCV)}if(cu){cu.innerHTML='';(d.cursos?.length?d.cursos:[]).forEach(adicionarCursoCV)}
 atualizarCidadeRegiaoCV();prepararBuscaCepCurriculoEM();document.querySelectorAll('#formCurriculoOnline input,#formCurriculoOnline textarea,#formCurriculoOnline select').forEach(x=>{if(!x.dataset.cvbind){x.addEventListener('input',()=>{clearTimeout(window.cvAutoSave);window.cvAutoSave=setTimeout(salvarCurriculoOnlineEM,450)});x.dataset.cvbind='1'}});const atual=coletarCurriculoOnlineEM();atualizarPreviewCurriculoEM(atual);atualizarProgressoCurriculoEM(atual)
}
function itensProgressoCurriculoEM(d){return[{nome:'Nome completo',ok:!!d.nome,alvo:'cvNome'},{nome:'Título profissional',ok:!!d.titulo,alvo:'cvTitulo'},{nome:'E-mail',ok:!!d.email,alvo:'cvEmail'},{nome:'Telefone',ok:!!d.telefone,alvo:'cvTelefone'},{nome:'Cidade',ok:!!d.cidade,alvo:'cvCidade'},{nome:'Área de atuação',ok:!!d.area,alvo:'cvArea'},{nome:'Objetivo profissional',ok:!!d.objetivo,alvo:'cvObjetivo'},{nome:'Resumo profissional',ok:!!d.resumo,alvo:'cvResumo'},{nome:'Competências',ok:!!d.competencias,alvo:'cvCompetencias'},{nome:'Experiência profissional',ok:!!d.experiencias?.some(x=>x.cargo),alvo:'cvExperiencias'},{nome:'Formação acadêmica',ok:!!d.formacoes?.some(x=>x.curso),alvo:'cvFormacoes'}]}
function atualizarProgressoCurriculoEM(d){const itens=itensProgressoCurriculoEM(d),pct=Math.round(itens.filter(x=>x.ok).length/itens.length*100),t=document.getElementById('cvProgressoTexto'),b=document.getElementById('cvProgressoBarra'),card=document.querySelector('.cv-progress-card'),estado=document.getElementById('cvProgressoEstado'),badge=document.getElementById('cvCompleteBadge');let nivel='inicio',rotulo='Começando';if(pct>=100){nivel='completo';rotulo='Currículo completo'}else if(pct>=90){nivel='final';rotulo='Reta final'}else if(pct>=70){nivel='avancado';rotulo='Bom progresso'}else if(pct>=40){nivel='desenvolvimento';rotulo='Em desenvolvimento'}if(t)t.textContent=pct+'% completo';if(estado)estado.textContent=rotulo;if(b){b.style.width=pct+'%';b.dataset.nivel=nivel}if(card){card.dataset.progresso=nivel;card.classList.toggle('cv-chegou-100',pct===100&&localStorage.getItem('empregaMaisCv100Celebrado')!=='1')}if(badge)badge.classList.toggle('oculto',pct<100);if(pct===100&&localStorage.getItem('empregaMaisCv100Celebrado')!=='1'){localStorage.setItem('empregaMaisCv100Celebrado','1');setTimeout(()=>card?.classList.remove('cv-chegou-100'),1800)}const db=document.getElementById('cvProgressDetailBar'),dp=document.getElementById('cvProgressDetailPct');if(db)db.style.width=pct+'%';if(dp)dp.textContent=pct+'%'}
function abrirDetalhesProgressoCV(){const d=dadosCurriculoOnlineEM(),itens=itensProgressoCurriculoEM(d),faltam=itens.filter(x=>!x.ok),pct=Math.round((itens.length-faltam.length)/itens.length*100),m=document.getElementById('cvProgressModal'),lista=document.getElementById('cvProgressPendencias'),res=document.getElementById('cvProgressResumo'),ok=document.getElementById('cvProgressCompleto'),bar=document.getElementById('cvProgressDetailBar'),pt=document.getElementById('cvProgressDetailPct');if(res)res.textContent=faltam.length?'Faltam '+faltam.length+' '+(faltam.length===1?'informação':'informações')+' para completar seu currículo.':'Seu currículo está completo.';if(bar)bar.style.width=pct+'%';if(pt)pt.textContent=pct+'%';if(lista)lista.innerHTML=faltam.map((x,i)=>'<button onclick="irParaPendenciaCV(\''+x.alvo+'\')"><i>'+String(i+1).padStart(2,'0')+'</i><span><b>'+esc(x.nome)+'</b><small>Preencha esta informação para aumentar a completude.</small></span><em>Preencher →</em></button>').join('');ok?.classList.toggle('oculto',!!faltam.length);m?.classList.remove('oculto');document.body.classList.add('cv-modal-open')}
function fecharDetalhesProgressoCV(){document.getElementById('cvProgressModal')?.classList.add('oculto');document.body.classList.remove('cv-modal-open')}
function irParaPendenciaCV(id){fecharDetalhesProgressoCV();const e=document.getElementById(id);e?.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>{(e?.matches?.('input,textarea,select')?e:e?.querySelector?.('input,textarea,select'))?.focus()},500)}
function cvPeriodo(v){if(!v)return'';const [a,m]=v.split('-');return m+'/'+a}
function htmlCurriculoEM(d){const sec=(t,x,cl='')=>x?'<section class="cv-pro-section '+cl+'"><h3><span>'+t+'</span></h3>'+x+'</section>':'';const local=esc([d.bairro,d.cidade,d.uf].filter(Boolean).join(' · '));const contato='<div class="cv-pro-contact">'+(local?'<span><i>⌖</i>'+local+'</span>':'')+(d.telefone?'<span><i>☎</i>'+esc(d.telefone)+'</span>':'')+(d.email?'<span><i>✉</i>'+esc(d.email)+'</span>':'')+'</div>';const exp=(d.experiencias||[]).filter(x=>x.cargo||x.empresa).map(x=>'<article class="cv-pro-item"><div class="cv-pro-item-head"><div><b>'+esc(x.cargo)+'</b><strong>'+esc(x.empresa)+'</strong></div><small>'+esc(cvPeriodo(x.inicio))+(x.atual?' — Atual':(x.fim?' — '+esc(cvPeriodo(x.fim)):''))+'</small></div><p>'+esc(x.atividades)+'</p></article>').join('');const form=(d.formacoes||[]).filter(x=>x.curso).map(x=>'<article class="cv-pro-item cv-pro-item-compact"><div class="cv-pro-item-head"><div><b>'+esc(x.curso)+'</b><strong>'+esc(x.instituicao)+'</strong></div><small>'+esc([x.status,x.fim&&cvPeriodo(x.fim)].filter(Boolean).join(' · '))+'</small></div></article>').join('');const cursos=(d.cursos||[]).filter(x=>x.nome).map(x=>'<article class="cv-pro-item cv-pro-item-compact"><div class="cv-pro-item-head"><div><b>'+esc(x.nome)+'</b><strong>'+esc(x.instituicao)+'</strong></div><small>'+esc([x.carga,x.conclusao].filter(Boolean).join(' · '))+'</small></div></article>').join('');return '<div class="cv-pro-accent"></div><header class="cv-pro-header"><div class="cv-pro-name"><span>CURRÍCULO PROFISSIONAL</span><h1>'+esc(d.nome||'Seu nome')+'</h1><h2>'+esc(d.titulo||d.objetivo||'Título profissional')+'</h2></div>'+contato+mobilidadeCabecalhoCurriculoHTML(d)+'</header><main class="cv-pro-body">'+sec('Objetivo profissional',d.objetivo?'<p>'+esc(d.objetivo)+'</p>':'','cv-pro-objective')+sec('Resumo profissional',d.resumo?'<p>'+esc(d.resumo)+'</p>':'')+sec('Experiência profissional',exp)+sec('Formação acadêmica',form)+sec('Cursos e certificações',cursos)+sec('Competências',d.competencias?'<p class="cv-tags">'+d.competencias.split(',').filter(x=>x.trim()).map(x=>'<i>'+esc(x.trim())+'</i>').join('')+'</p>':'')+sec('Idiomas',d.idiomas?'<p>'+esc(d.idiomas)+'</p>':'')+sec('Preferências e disponibilidade',(Array.isArray(d.modalidades)&&d.modalidades.length?'<div class="cv-pro-preferences"><b>Modalidade</b><span>'+d.modalidades.map(esc).join(' · ')+'</span></div>':'')+regiaoInteresseCurriculoHTML(d))+'</main>'}
function nivelConteudoCurriculoEM(d){const ex=(d.experiencias||[]).filter(x=>x.cargo||x.empresa),fo=(d.formacoes||[]).filter(x=>x.curso),cu=(d.cursos||[]).filter(x=>x.nome);let pontos=(d.objetivo||'').length+(d.resumo||'').length+(d.competencias||'').length+(d.idiomas||'').length;pontos+=ex.reduce((s,x)=>s+(x.atividades||'').length+90,0)+fo.length*70+cu.length*55;if(pontos<520)return'leve';if(pontos>1500||ex.length>3||fo.length>2||cu.length>4)return'denso';return'normal'}
function diagramarCurriculoEM(p,d,a4=false){if(!p)return;p.classList.remove('cv-layout-leve','cv-layout-normal','cv-layout-denso','cv-a4-compact','cv-a4-ultra','cv-a4-max');p.classList.add('cv-layout-'+nivelConteudoCurriculoEM(d));const ajustar=()=>{const limite=a4?p.clientHeight:1123;if(p.scrollHeight>limite)p.classList.add('cv-a4-compact');requestAnimationFrame(()=>{if(p.scrollHeight>limite)p.classList.add('cv-a4-ultra');requestAnimationFrame(()=>{if(p.scrollHeight>limite)p.classList.add('cv-a4-max')})})};requestAnimationFrame(ajustar)}
function atualizarPreviewCurriculoEM(d){const p=document.getElementById('cvPreview');if(p){p.innerHTML=htmlCurriculoEM(d);p.classList.add('cv-preview-pagina');diagramarCurriculoEM(p,d,false)}}
function visualizarCurriculoEM(){const d=salvarCurriculoOnlineEM(),m=document.getElementById('modalCurriculoPreview'),p=document.getElementById('cvPreviewModal');if(p){p.innerHTML=htmlCurriculoEM(d);diagramarCurriculoEM(p,d,true)}m?.classList.remove('oculto');document.body.classList.add('cv-modal-open')}function fecharPreviewCurriculoEM(){document.getElementById('modalCurriculoPreview')?.classList.add('oculto');document.body.classList.remove('cv-modal-open')}
function focarEditorCurriculoEM(){document.getElementById('cvEditor')?.scrollIntoView({behavior:'smooth',block:'start'})}

function prepararBuscaCepCurriculoEM(){
 const cep=document.getElementById('cvCep');
 if(!cep||cep.dataset.cepAutoEM==='1')return;
 cep.dataset.cepAutoEM='1';
 let ultimo='';
 const tentar=()=>{
  const n=nums(cep.value);
  if(n.length!==8){ultimo='';return}
  if(n===ultimo)return;
  ultimo=n;
  clearTimeout(window.cvCepTimerEM);
  window.cvCepTimerEM=setTimeout(()=>buscarCepCurriculoEM(),180)
 };
 cep.addEventListener('input',tentar);
 cep.addEventListener('paste',()=>setTimeout(tentar,0));
 cep.addEventListener('change',tentar);
 cep.addEventListener('blur',()=>{
  const n=nums(cep.value);
  if(n.length===8&&n!==ultimo){ultimo=n;buscarCepCurriculoEM()}
 });
}
async function buscarCepCurriculoEM(){
 const cep=nums(cvVal('cvCep')),aj=document.getElementById('cvCepAjuda'),cepEl=document.getElementById('cvCep');if(cep.length!==8){if(aj){aj.textContent='Informe um CEP com 8 dígitos.';aj.classList.add('erro')}return}
 if(cepEl)cepEl.value=cep.replace(/^(\d{5})(\d{3})$/,'$1-$2')
 if(aj){aj.textContent='Buscando endereço...';aj.classList.remove('erro')}
 try{const res=await fetch('https://viacep.com.br/ws/'+cep+'/json/');if(!res.ok)throw 0;const d=await res.json();if(d.erro)throw 0;
 const logradouro=document.getElementById('cvLogradouro'),bairro=document.getElementById('cvBairro'),cidade=document.getElementById('cvCidade'),uf=document.getElementById('cvUf');
 if(d.logradouro&&logradouro)logradouro.value=d.logradouro;if(d.bairro&&bairro)bairro.value=d.bairro;if(d.localidade&&cidade)cidade.value=d.localidade;if(d.uf&&uf)uf.value=d.uf;
 const geral=!d.bairro;if(bairro)bairro.readOnly=!geral;if(cidade)cidade.readOnly=false;if(uf)uf.readOnly=false;
 atualizarCidadeRegiaoCV();if(aj){aj.textContent=geral?'CEP geral localizado. Preencha o bairro manualmente e confira cidade/UF.':'Endereço localizado. Bairro, cidade e UF preenchidos automaticamente.';aj.classList.remove('erro')}
 salvarCurriculoOnlineEM();
 }catch(e){if(aj){aj.textContent='Não foi possível localizar este CEP. Preencha bairro, cidade e UF manualmente.';aj.classList.add('erro')}['cvBairro','cvCidade','cvUf'].forEach(id=>{const x=document.getElementById(id);if(x)x.readOnly=false})}
}

function alternarMobilidadeCV(){const c=document.getElementById('cvCnh')?.value==='sim',v=document.getElementById('cvVeiculo')?.value==='sim';document.getElementById('cvCategoriaWrap')?.classList.toggle('oculto',!c);document.getElementById('cvTipoVeiculoWrap')?.classList.toggle('oculto',!v);if(!c){document.querySelectorAll('.cv-cnh-check').forEach(x=>x.checked=false);atualizarCategoriasCnhCV(false)}if(!v){const x=document.getElementById('cvTipoVeiculo');if(x)x.value=''}}function atualizarCategoriasCnhCV(salvar=true){const a=[...document.querySelectorAll('.cv-cnh-check:checked')].map(x=>x.value),r=document.getElementById('cvCategoriaResultado');if(r)r.textContent=a.length?'Categoria selecionada: '+a.join(''):'Selecione uma ou mais categorias.';if(salvar)salvarCurriculoOnlineEM()}
function mobilidadeCurriculoHTML(d){const a=[];if(d.cnh==='sim'){const cats=Array.isArray(d.categoriasCnh)?d.categoriasCnh.join(''):(d.categoriaCnh||'');a.push('CNH'+(cats?': '+esc(cats):''));}else if(d.cnh==='nao')a.push('CNH: Não possui');if(d.veiculo==='sim')a.push('Veículo próprio'+(d.tipoVeiculo?': '+esc(d.tipoVeiculo):''));else if(d.veiculo==='nao')a.push('Veículo próprio: Não');return a.length?'<p>'+a.join(' · ')+'</p>':''}

function atualizarCidadeRegiaoCV(){const e=document.getElementById('cvRegiaoCidadeTexto'),cidade=cvVal('cvCidade'),uf=cvVal('cvUf');if(e)e.textContent=cidade?(cidade+(uf?' / '+uf:'')):'Cidade ainda não informada'}
function regiaoInteresseCurriculoHTML(d){const a=[];if(d.regiaoMinhaCidade!==false&&d.cidade)a.push('⌖ '+esc(d.cidade+(d.uf?' / '+d.uf:'')));if(d.cidadesProximas)a.push('Aceita trabalhar em cidades próximas');if(d.viagens===true)a.push('Disponibilidade para viagens de trabalho');if(d.mudanca)a.push('Aceita mudança de cidade ou estado');return a.length?'<div class="cv-region-list">'+a.map(x=>'<p>✓ '+x+'</p>').join('')+'</div>':''}

function alternarModalidadesCV(){document.getElementById('cvModalidadeMenu')?.classList.toggle('oculto')}
function atualizarModalidadesCV(salvar=true){const a=[...document.querySelectorAll('.cv-modalidade-check:checked')].map(x=>x.value),t=document.getElementById('cvModalidadeTrigger'),tags=document.getElementById('cvModalidadeTags');if(t)t.innerHTML=(a.length?a.join(' · '):'Selecionar modalidades')+' <b>⌄</b>';if(tags)tags.innerHTML=a.map(x=>'<span>'+esc(x)+'</span>').join('');if(salvar&&document.getElementById('formCurriculoOnline'))salvarCurriculoOnlineEM()}
document.addEventListener('click',e=>{const m=document.getElementById('cvModalidadeMenu'),f=document.querySelector('.cv-modalidade-field');if(m&&f&&!f.contains(e.target))m.classList.add('oculto')});

document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('modalCurriculoPreview')?.classList.contains('oculto'))fecharPreviewCurriculoEM()});

document.addEventListener('change',e=>{if(e.target?.classList?.contains('cv-cnh-check'))atualizarCategoriasCnhCV()});

function mobilidadeCabecalhoCurriculoHTML(d){const a=[];if(d.cnh==='sim'){const cats=Array.isArray(d.categoriasCnh)?d.categoriasCnh.join(''):(d.categoriaCnh||'');a.push('<span><b>CNH</b> '+esc(cats||'Sim')+'</span>')}else if(d.cnh==='nao')a.push('<span><b>CNH</b> Não possui</span>');if(d.veiculo==='sim')a.push('<span><b>Veículo próprio</b> '+esc(d.tipoVeiculo||'Sim')+'</span>');else if(d.veiculo==='nao')a.push('<span><b>Veículo próprio</b> Não</span>');return a.length?'<div class="cv-header-mobility">'+a.join('')+'</div>':''}

/* AUTOCOMPLETE DE INSTITUICOES DE ENSINO - base oficial MEC/e-MEC */
const CV_IES_MEC_URL='https://dadosabertos.mec.gov.br/images/conteudo/Ind-ensino-superior/2022/PDA_Lista_Instituicoes_Ensino_Superior_do_Brasil_EMEC.csv';
let cvIesCache=null,cvIesCarregando=null;
function cvNormaliza(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function cvParseCSV(text){const rows=[];let row=[],v='',q=false;for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'){if(q&&text[i+1]==='"'){v+='"';i++}else q=!q}else if((ch===';'||ch===',')&&!q){row.push(v);v=''}else if((ch==='\n'||ch==='\r')&&!q){if(ch==='\r'&&text[i+1]==='\n')i++;row.push(v);v='';if(row.some(Boolean))rows.push(row);row=[]}else v+=ch}if(v||row.length){row.push(v);rows.push(row)}return rows}
async function carregarInstituicoesMEC(){if(cvIesCache)return cvIesCache;if(cvIesCarregando)return cvIesCarregando;cvIesCarregando=(async()=>{try{const res=await fetch(CV_IES_MEC_URL);if(!res.ok)throw new Error('MEC');const txt=await res.text(),rows=cvParseCSV(txt);if(rows.length<2)throw new Error('CSV');const head=rows[0].map(cvNormaliza),idxNome=head.findIndex(x=>x.includes('nome')&&(x.includes('ies')||x.includes('institu'))),idxSigla=head.findIndex(x=>x.includes('sigla')),idxMun=head.findIndex(x=>x.includes('municip')),idxSit=head.findIndex(x=>x.includes('situac'));const seen=new Set(),out=[];for(const r of rows.slice(1)){const nome=(r[idxNome]||'').trim();if(!nome)continue;const sit=idxSit>=0?(r[idxSit]||''):'';if(sit&&/extint|inativ/i.test(sit))continue;const key=cvNormaliza(nome);if(seen.has(key))continue;seen.add(key);out.push({nome,sigla:idxSigla>=0?(r[idxSigla]||'').trim():'',municipio:idxMun>=0?(r[idxMun]||'').trim():''})}cvIesCache=out;return out}catch(e){cvIesCache=[];return[]}})();return cvIesCarregando}
async function buscarInstituicaoCV(input){const box=input.closest('.cv-inst-search')?.querySelector('.cv-inst-results');if(!box)return;const q=input.value.trim();if(q.length<2){box.innerHTML='<div class="cv-inst-info">Digite pelo menos 2 letras para buscar.</div>';box.classList.remove('oculto');return}box.innerHTML='<div class="cv-inst-info">Buscando instituições...</div>';box.classList.remove('oculto');const ies=await carregarInstituicoesMEC();if(input.value.trim()!==q)return;const n=cvNormaliza(q),res=ies.filter(x=>cvNormaliza(x.nome+' '+x.sigla).includes(n)).slice(0,8);if(!ies.length){box.innerHTML='<div class="cv-inst-info"><b>Busca oficial indisponível agora.</b><small>Você pode preencher o nome da instituição manualmente.</small></div>';return}box.innerHTML=res.length?res.map(x=>'<button type="button" onclick="selecionarInstituicaoCV(this)" data-nome="'+esc(x.nome)+'"><span><b>'+esc(x.nome)+'</b>'+(x.sigla?'<em>'+esc(x.sigla)+'</em>':'')+'</span>'+(x.municipio?'<small>'+esc(x.municipio)+'</small>':'')+'</button>').join(''):'<div class="cv-inst-info"><b>Instituição não encontrada.</b><small>Continue digitando para cadastrar manualmente.</small></div>'}
function selecionarInstituicaoCV(btn){const wrap=btn.closest('.cv-inst-search'),inp=wrap?.querySelector('.cv-for-inst');if(inp)inp.value=btn.dataset.nome||'';wrap?.querySelector('.cv-inst-results')?.classList.add('oculto');salvarCurriculoOnlineEM()}
document.addEventListener('click',e=>{document.querySelectorAll('.cv-inst-results').forEach(x=>{if(!x.closest('.cv-inst-search')?.contains(e.target))x.classList.add('oculto')})});

function alternarEmpregoAtualCV(chk){const item=chk.closest('.cv-repeat-item'),fim=item?.querySelector('.cv-exp-fim');if(fim){fim.disabled=chk.checked;if(chk.checked)fim.value=''}salvarCurriculoOnlineEM()}
function alternarSituacaoFormacaoCV(sel){const item=sel.closest('.cv-repeat-item'),titulo=item?.querySelector('.cv-for-date-title');if(titulo)titulo.textContent=sel.value==='Cursando'?'Previsão de conclusão':sel.value==='Interrompido'?'Data de interrupção':'Data de conclusão';salvarCurriculoOnlineEM()}

/* VALIDACAO GLOBAL EMPREGAMAIS */
let emPrimeiroCampoInvalido=null;
function nomeCampoEM(el){const lab=el.closest('label');if(lab){const t=[...lab.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent.trim()).filter(Boolean).join(' ');if(t)return t.replace(/[?:*]+$/,'').trim()}return el.getAttribute('aria-label')||el.getAttribute('placeholder')||el.name||'Informação obrigatória'}
function abrirValidacaoEM(campos,titulo='Revise as informações'){const m=document.getElementById('emValidationModal'),l=document.getElementById('emValidationList'),t=document.getElementById('emValidationTitle');if(!m||!l)return;emPrimeiroCampoInvalido=campos[0]||null;t.textContent=titulo;l.innerHTML=campos.slice(0,8).map(x=>'<div><i>!</i><span>Preencha <b>'+esc(nomeCampoEM(x))+'</b></span></div>').join('')+(campos.length>8?'<small>e mais '+(campos.length-8)+' informação(ões).</small>':'');campos.forEach(x=>x.classList.add('em-campo-pendente'));m.classList.remove('oculto');document.body.classList.add('em-modal-open')}
function fecharValidacaoEM(){document.getElementById('emValidationModal')?.classList.add('oculto');document.body.classList.remove('em-modal-open')}
function revisarValidacaoEM(){const x=emPrimeiroCampoInvalido;fecharValidacaoEM();if(x){x.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>x.focus?.(),350)}}
function validarObrigatoriosEM(form){const campos=[...form.querySelectorAll('input,select,textarea')].filter(x=>x.required&&!x.disabled&&x.type!=='hidden'&&!x.checkValidity());if(campos.length){abrirValidacaoEM(campos,'Faltam algumas informações');return false}return true}
document.addEventListener('invalid',e=>{if(!e.target.closest('form'))return;e.preventDefault()},true);
document.addEventListener('submit',e=>{const f=e.target;if(!(f instanceof HTMLFormElement))return;if(!validarObrigatoriosEM(f)){e.preventDefault();e.stopImmediatePropagation()}},true);
document.addEventListener('input',e=>e.target?.classList?.remove('em-campo-pendente'),true);
document.addEventListener('change',e=>e.target?.classList?.remove('em-campo-pendente'),true);
document.addEventListener('click',e=>{const m=document.getElementById('emValidationModal');if(e.target===m)fecharValidacaoEM()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('emValidationModal')?.classList.contains('oculto'))fecharValidacaoEM()});

function abrirSucessoCurriculoEM(){document.getElementById('cvSuccessModal')?.classList.remove('oculto');document.body.classList.add('cv-success-open')}
function fecharSucessoCurriculoEM(){document.getElementById('cvSuccessModal')?.classList.add('oculto');document.body.classList.remove('cv-success-open')}
document.addEventListener('click',e=>{const m=document.getElementById('cvSuccessModal');if(e.target===m)fecharSucessoCurriculoEM()});


/* EMPREGAMAIS-ADMIN-CENTRAL-PENDENCIAS-V1 */
function adminColetarPendenciasEM(){
 const vs=ler('empregaMaisVagas'),es=ler('empregaMaisEmpresas'),den=ler('empregaMaisDenuncias'),pedidos=ler('empregaMaisPedidosPlano'),extras=ler('empregaMaisExtras'),premium=ler('empregaMaisPedidosPremiumCandidato');
 const vagas=vs.filter(v=>v.status==='pendente');
 const statusVerificacao=e=>String(e?.verificacaoStatus||e?.verificacao_status||'').trim().toLowerCase().replace(/[ -]+/g,'_');
 const verificacoes=es.filter(e=>['pendente','em_analise','em_análise','aguardando_analise','aguardando_análise'].includes(statusVerificacao(e))||(e.verificada!==true&&!!(e.verificacaoEnviadaEm||e.verificacao_enviada_em)));
 const denuncias=den.filter(d=>d.status==='pendente');
 const planos=pedidos.filter(x=>!['ativo','aprovado','pago','concluido','cancelado','reprovado'].includes(String(x.status||'').toLowerCase()));
 const extrasPend=extras.filter(x=>!['ativo','concluido','cancelado','reprovado'].includes(String(x.status||'').toLowerCase()));
 const premiumPend=premium.filter(x=>!['ativo','aprovado','pago','concluido','cancelado','reprovado'].includes(String(x.status||'').toLowerCase()));
 return {vagas,verificacoes,denuncias,planos,extras:extrasPend,premium:premiumPend,total:vagas.length+verificacoes.length+denuncias.length+planos.length+extrasPend.length+premiumPend.length};
}
function adminAtualizarBadgePendenciasEM(){
 const p=adminColetarPendenciasEM(),b=document.getElementById('adminBadgePendencias');
 if(b){b.textContent=p.total||'';b.style.display=p.total?'grid':'none'}
 return p;
}
function adminRenderPendenciasEM(){
 const p=adminAtualizarBadgePendenciasEM(),sec=(titulo,qtd,html,aba)=>qtd?'<section class="admin-bloco"><h2>'+titulo+' <span class="admin-pill">'+qtd+'</span></h2>'+html+(aba?'<div style="margin-top:12px"><button class="btn" onclick="adminAba(\''+aba+'\')">Abrir área completa</button></div>':'')+'</section>':'';
 if(!p.total)return '<div class="admin-bloco"><h2>Central de pendências</h2><div class="admin-empty">Tudo em dia. Não há nenhuma pendência no portal.</div></div>';
 const esPend=p.verificacoes.map(e=>Object.assign({},e,{verificacaoStatus:e.verificacaoStatus||'pendente'}));
 const planosHtml='<div class="admin-lista">'+p.planos.concat(p.premium).map(x=>'<div class="admin-linha"><div><strong>'+esc(x.empresaNome||x.candidatoNome||x.nome||'Solicitação de plano')+'</strong><small>'+esc(x.plano||x.tipo||'Plano')+' · '+esc(x.status||'Pendente')+'</small></div></div>').join('')+'</div>';
 return '<div class="admin-bloco"><h2>Central de pendências</h2><p class="admin-sub">Tudo que exige atenção administrativa aparece aqui automaticamente.</p><div class="admin-warning"><strong>'+p.total+'</strong> pendência(s) aguardando ação.</div></div>'+
 sec('Vagas aguardando análise',p.vagas.length,adminTabelaVagas(p.vagas),'vagas')+
 sec('Verificações de empresas',p.verificacoes.length,adminVerificacoesEmpresasEM(esPend),'verificacoes')+
 sec('Denúncias pendentes',p.denuncias.length,adminTabelaDenuncias(p.denuncias,ler('empregaMaisVagas')),'denuncias')+
 sec('Solicitações de planos',p.planos.length+p.premium.length,planosHtml,'planos')+
 sec('Extras aguardando ação',p.extras.length,adminTabelaExtras(p.extras,ler('empregaMaisVagas')),'extras');
}

/* EMPREGAMAIS-ADMIN-VERIFICACAO-EMPRESAS-V1 */
async function adminCarregarEmpresasSupabaseEM(){
 const t=await adminSbToken();
 const a=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/empresas?select=*&order=criado_em.desc',{method:'GET',headers:sbHeadersEM(t)});
 const remotas=(Array.isArray(a)?a:[]).map(e=>sbEmpresaParaLocalEM(e,'')).filter(Boolean);
 const locais=ler('empregaMaisEmpresas'),map=new Map();
 const chave=e=>nums(e?.cnpj||'')||e?.userId||e?.id||String(e?.email||'').toLowerCase();
 locais.forEach(e=>{const k=chave(e);if(k)map.set(k,e)});
 remotas.forEach(e=>{const k=chave(e);if(!k)return;const ant=map.get(k)||{};map.set(k,Object.assign({},ant,e,{senha:ant.senha||''}))});
 const es=[...map.values()];
 gravar('empregaMaisEmpresas',es);
 return es;
}
async function adminAtualizarVerificacaoEmpresaEM(cnpj,status,motivo){
 const t=await adminSbToken(),agora=new Date().toISOString();
 const body={verificacao_status:status,verificada:status==='aprovada',verificacao_motivo:motivo||null};
 const r=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/empresas?cnpj=eq.'+encodeURIComponent(nums(cnpj)),{method:'PATCH',headers:Object.assign(sbHeadersEM(t),{'Prefer':'return=representation'}),body:JSON.stringify(body)});
 if(!Array.isArray(r)||!r.length)throw new Error('Empresa não encontrada ou alteração não permitida.');
 await adminCarregarEmpresasSupabaseEM();
 const e=ler('empregaMaisEmpresas').find(x=>nums(x.cnpj)===nums(cnpj))||{};
 adminHistoricoRegistrar(status==='aprovada'?'Empresa verificada':'Verificação de empresa reprovada',(e.nome||cnpj)+(motivo?' · '+motivo:''));
 await adminAba('verificacoes');
}
async function adminAprovarVerificacaoEmpresaEM(cnpj){
 const e=ler('empregaMaisEmpresas').find(x=>nums(x.cnpj)===nums(cnpj));if(!e)return;
 if(!confirm('Aprovar a verificação de “'+(e.nome||'esta empresa')+'” e liberar o selo Empresa Verificada?'))return;
 try{await adminAtualizarVerificacaoEmpresaEM(cnpj,'aprovada','');alert('Empresa aprovada. O selo Empresa Verificada foi liberado.')}catch(err){console.error('ADM verificação empresa:',err);alert('Não foi possível aprovar a verificação: '+err.message)}
}
async function adminReprovarVerificacaoEmpresaEM(cnpj){
 const e=ler('empregaMaisEmpresas').find(x=>nums(x.cnpj)===nums(cnpj));if(!e)return;
 const motivo=prompt('Informe o motivo da reprovação para a empresa:');if(motivo===null)return;if(!motivo.trim())return alert('Informe o motivo da reprovação.');
 try{await adminAtualizarVerificacaoEmpresaEM(cnpj,'reprovada',motivo.trim());alert('Verificação reprovada. O motivo ficará registrado para a empresa.')}catch(err){console.error('ADM verificação empresa:',err);alert('Não foi possível reprovar a verificação: '+err.message)}
}
function adminVerificacoesEmpresasEM(es){
 const ordem={pendente:0,em_analise:0,reprovada:1,aprovada:2,nao_verificada:3};
 const a=es.filter(e=>['pendente','em_analise','reprovada','aprovada'].includes(e.verificacaoStatus)||e.verificada).slice().sort((x,y)=>(ordem[x.verificacaoStatus]??9)-(ordem[y.verificacaoStatus]??9));
 if(!a.length)return '<div class="admin-empty">Nenhuma solicitação de verificação recebida.</div>';
 return '<div class="admin-lista">'+a.map(e=>{const s=e.verificada||e.verificacaoStatus==='aprovada'?'aprovada':e.verificacaoStatus,rot=s==='aprovada'?'Verificada':s==='reprovada'?'Reprovada':'Aguardando análise',p=e.perfil||{};return '<div class="admin-linha admin-verificacao-linha"><div><strong>'+esc(p.nome||e.nome||'Empresa')+'</strong><small>CNPJ '+esc(e.cnpj||'Não informado')+(e.email?' · '+esc(e.email):'')+(e.verificacaoEnviadaEm?' · Enviada em '+new Date(e.verificacaoEnviadaEm).toLocaleString('pt-BR'):'')+'</small>'+(e.verificacaoMotivo?'<small><b>Motivo:</b> '+esc(e.verificacaoMotivo)+'</small>':'')+'</div><div class="admin-empresa-resumo"><span class="vaga-status '+(s==='aprovada'?'aprovada':s==='reprovada'?'reprovada':'pendente')+'">'+rot+'</span>'+(s!=='aprovada'?'<button class="btn btn-azul" onclick="adminAprovarVerificacaoEmpresaEM(\''+esc(e.cnpj||'')+'\')">Aprovar verificação</button>':'')+(s!=='reprovada'?'<button class="btn btn-perigo" onclick="adminReprovarVerificacaoEmpresaEM(\''+esc(e.cnpj||'')+'\')">Reprovar</button>':'')+'</div></div>'}).join('')+'</div>';
}
const _adminSincronizarPainelSupabaseVerEM=adminSincronizarPainelSupabase;
adminSincronizarPainelSupabase=async function(){
 const ok=await _adminSincronizarPainelSupabaseVerEM();
 try{await adminCarregarEmpresasSupabaseEM()}catch(err){console.error('ADM sincronização empresas:',err)}
 return ok;
};
const _adminAbaVerificacaoEM=adminAba;
adminAba=async function(aba,btn){
 if(aba!=='verificacoes')return _adminAbaVerificacaoEM(aba,btn);
 if(sessionStorage.getItem('empregaMaisAdmin')!=='1'){irPara('login-admin');return}
 document.querySelectorAll('[data-admin-tab]').forEach(b=>b.classList.toggle('ativo',b.dataset.adminTab===aba));
 const out=$('#adminConteudo');if(!out)return;
 try{await adminCarregarEmpresasSupabaseEM()}catch(err){console.error('ADM empresas:',err)}
 const es=ler('empregaMaisEmpresas'),pend=es.filter(e=>{const st=String(e.verificacaoStatus||e.verificacao_status||'').toLowerCase().replace(/[ -]+/g,'_');return ['pendente','em_analise','em_análise','aguardando_analise','aguardando_análise'].includes(st)||(e.verificada!==true&&!!(e.verificacaoEnviadaEm||e.verificacao_enviada_em))});
 const badge=$('#adminBadgeVerificacoes');if(badge){badge.textContent=pend.length||'';badge.style.display=pend.length?'grid':'none'}
 out.innerHTML='<div class="admin-bloco"><h2>Verificações de empresas</h2><p class="admin-sub">Analise as solicitações enviadas pelas empresas. A aprovação libera o selo Empresa Verificada no perfil e nas vagas.</p><div class="admin-warning">'+pend.length+' solicitação(ões) aguardando análise.</div>'+adminVerificacoesEmpresasEM(es)+'</div>';
};


/* EMPREGAMAIS-SELO-VERIFICADA-VAGAS-V1
   A empresa aprovada exibe selo automaticamente em todos os cards.
*/

/* EMPREGAMAIS-TOOLTIP-EMPRESA-VERIFICADA-V1 */


/* EMPREGAMAIS-UPLOAD-IMAGENS-PERFIL-V1 */
function perfilAtualizarPreviewImagemEM(idPreview,valor,tipo){
 const box=document.getElementById(idPreview);if(!box)return;
 if(valor){box.innerHTML='<img src="'+esc(valor)+'" alt="Pré-visualização '+esc(tipo)+'">';box.classList.add('tem-imagem')}
 else{box.innerHTML='<span>'+(tipo==='logo'?'LOGO':'CAPA')+'</span>';box.classList.remove('tem-imagem')}
}
function perfilImagemSelecionadaEM(input,idHidden,idPreview,tipo){
 const arq=input.files&&input.files[0];if(!arq)return;
 if(!/^image\/(png|jpeg|webp)$/i.test(arq.type)){alert('Selecione uma imagem JPG, PNG ou WebP.');input.value='';return}
 if(arq.size>2*1024*1024){alert('A imagem deve ter no máximo 2 MB.');input.value='';return}
 const r=new FileReader();r.onload=()=>{const h=document.getElementById(idHidden);if(h)h.value=r.result;perfilAtualizarPreviewImagemEM(idPreview,r.result,tipo);const b=input.closest('.perfil-upload-box')?.querySelector('.perfil-upload-btn');if(b)b.textContent=tipo==='logo'?'↻ Trocar logo':'↻ Trocar imagem de capa'};r.readAsDataURL(arq);
}
const _preencherPerfilEmpresaUploadEM=preencherPerfilEmpresa;
preencherPerfilEmpresa=function(){const r=_preencherPerfilEmpresaUploadEM.apply(this,arguments);const e=empresaLogada(),p=e?.perfil||{};perfilAtualizarPreviewImagemEM('perfilLogoPreview',p.logo||'','logo');perfilAtualizarPreviewImagemEM('perfilCapaPreview',p.capa||'','capa');const bl=document.querySelector('#perfilLogoArquivo')?.closest('.perfil-upload-box')?.querySelector('.perfil-upload-btn'),bc=document.querySelector('#perfilCapaArquivo')?.closest('.perfil-upload-box')?.querySelector('.perfil-upload-btn');if(bl)bl.textContent=p.logo?'↻ Trocar logo':'↑ Enviar logo';if(bc)bc.textContent=p.capa?'↻ Trocar imagem de capa':'↑ Enviar imagem de capa';return r};
/* fim EMPREGAMAIS-UPLOAD-IMAGENS-PERFIL-V1 */

function retirarCandidaturaEM(id){if(!confirm('Deseja realmente retirar esta candidatura?'))return;const a=candidaturas(),x=a.find(c=>String(c.id)===String(id));if(!x)return;if(x.status&&grupoEtapa(x.status)!=='Em avaliação')return alert('Esta candidatura já avançou no processo e não pode mais ser retirada por aqui.');gravar('empregaMaisCandidaturas',a.filter(c=>String(c.id)!==String(id)));renderizarCandidaturasCandidato();}


/* EMPREGAMAIS-CANDIDATO-SUPABASE-AUTH-V1 */
function sbCadastrarAuthCandidatoEM(email,senha,nome,telefone,cidade){
 localStorage.removeItem('empregaMaisLogoutBloqueio');sessionStorage.removeItem('empregaMaisLogoutBloqueio');
 return sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/auth/v1/signup",{method:"POST",headers:sbHeadersEM(),body:JSON.stringify({email:email,password:senha,data:{papel:"candidato",nome:nome,telefone:telefone,cidade:cidade}})}).then(a=>{sbSalvarSessaoEM(a);return a})
}
function sbLoginAuthCandidatoEM(email,senha){
 localStorage.removeItem('empregaMaisLogoutBloqueio');sessionStorage.removeItem('empregaMaisLogoutBloqueio');
 return sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/auth/v1/token?grant_type=password",{method:"POST",headers:sbHeadersEM(),body:JSON.stringify({email:email,password:senha})}).then(a=>{sbSalvarSessaoEM(a);return a})
}
function sbSalvarCandidatoLocalEM(d){
 const a=ler("empregaMaisCandidatos"),email=String(d.email||"").toLowerCase(),i=a.findIndex(x=>String(x.email||"").toLowerCase()===email);
 if(i>=0)a[i]={...a[i],...d,senha:a[i].senha||""};else a.push(d);
 gravar("empregaMaisCandidatos",a);return i>=0?a[i]:d
}
async function sbUpsertCandidatoSupabaseEM(d,token){
 if(!d?.userId||!token)return d;
 const payload={user_id:d.userId,nome:d.nome||"",email:String(d.email||"").toLowerCase(),telefone:d.telefone||"",cidade:d.cidade||"",perfil:(d.perfil&&typeof d.perfil==="object")?d.perfil:{}};
 const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/candidatos?on_conflict=user_id",{method:"POST",headers:Object.assign(sbHeadersEM(token),{"Prefer":"resolution=merge-duplicates,return=representation"}),body:JSON.stringify(payload)});
 const x=Array.isArray(rows)?rows[0]:rows;if(!x)return d;
 return Object.assign({},d,{id:x.id||d.id,userId:x.user_id||d.userId,nome:x.nome||d.nome,email:String(x.email||d.email||"").toLowerCase(),telefone:x.telefone||d.telefone,cidade:x.cidade||d.cidade,perfil:(x.perfil&&typeof x.perfil==="object")?x.perfil:(d.perfil||{}),premium:x.premium===true,premiumAtivo:x.premium===true,premiumCortesiaAdmin:x.premium_cortesia_admin===true,planoCandidato:x.premium===true?"premium":"",premiumAtivadoEm:x.premium_ativado_em||"",premiumValidoAte:x.premium_valido_ate||"",criadoEm:x.criado_em||d.criadoEm,atualizadoEm:x.atualizado_em||""})
}
function sbCandidatoDoAuthEM(auth,fallback){
 const u=auth?.user||auth||{},m=u.user_metadata||{},f=fallback||{};
 return {id:f.id||("candidato_"+(u.id||Date.now())),userId:u.id||f.userId||"",nome:m.nome||f.nome||"",email:String(u.email||f.email||"").toLowerCase(),telefone:m.telefone||f.telefone||"",cidade:m.cidade||f.cidade||"",perfil:f.perfil||{},criadoEm:f.criadoEm||u.created_at||new Date().toISOString()}
}
function concluirEntradaCandidatoSupabaseEM(d){
 if(d.userId)sessionStorage.setItem("candidatoSupabaseUserId",d.userId);
 entrar("candidato",d);
 if(d.userId)sessionStorage.setItem("candidatoSupabaseUserId",d.userId);
 if(sessionStorage.getItem("retornoCandidatura")==="1"){
 const vagaRetorno=sessionStorage.getItem("vagaSelecionada");
 if(vagaRetorno)sessionStorage.setItem("vagaAtual",vagaRetorno);
 sessionStorage.removeItem("retornoCandidatura");
 sessionStorage.removeItem("retornoSalvarVaga");
 setTimeout(()=>irPara("candidatar"),30);
 return
}
 if(sessionStorage.getItem("retornoSalvarVaga")==="1"){sessionStorage.removeItem("retornoSalvarVaga");const id=sessionStorage.getItem("vagaSelecionada");if(id)sessionStorage.setItem("vagaAtual",id);setTimeout(()=>{const v=vagaAtual();if(v&&v.status==="aprovada"&&vagaDentroPrazo(v)){let a=salvas();if(!a.includes(v.id))gravar(chaveSalvas(),[v.id,...a]);irPara("vaga")}else irPara("home")},30)}
}
async function cadastrarCandidatoSupabaseEM(e){
 e.preventDefault();
 const senha=$("#cadCandSenha").value,nome=$("#cadCandNome").value.trim(),email=$("#cadCandEmail").value.trim().toLowerCase(),telefone=$("#cadCandTelefone").value.trim(),cidade=$("#cadCandCidade").value.trim();
 if(nome.length<3)return msg("#msgCadastroCandidato","Informe seu nome completo.");
 if(!email.includes("@"))return msg("#msgCadastroCandidato","Informe um e-mail válido.");
 if(nums(telefone).length<10)return msg("#msgCadastroCandidato","Informe um celular válido.");
 if(cidade.length<2)return msg("#msgCadastroCandidato","Informe sua cidade.");
 if(senha.length<6)return msg("#msgCadastroCandidato","A senha deve ter pelo menos 6 caracteres.");
 if(senha!==$("#cadCandSenha2").value)return msg("#msgCadastroCandidato","As senhas não conferem.");
 msg("#msgCadastroCandidato","Criando sua conta...");
 sbCadastrarAuthCandidatoEM(email,senha,nome,telefone,cidade).then(async auth=>{
   let d=sbSalvarCandidatoLocalEM(sbCandidatoDoAuthEM(auth,{nome,email,telefone,cidade}));
   if(!auth?.access_token){msg("#msgCadastroCandidato","Cadastro criado. Confirme seu e-mail para ativar a conta.",true);return}
   d=sbSalvarCandidatoLocalEM(await sbUpsertCandidatoSupabaseEM(d,auth.access_token));
   concluirEntradaCandidatoSupabaseEM(d)
 }).catch(err=>{console.error("Cadastro candidato / Supabase:",err);const t=/already|registered|exists/i.test(err.message)?"Já existe uma conta com este e-mail.":("Não foi possível criar a conta: "+err.message);msg("#msgCadastroCandidato",t)})
}
/* Logout de candidato/empresa consolidado no EMPREGAMAI-AUTH-SESSION-GUARD-V6. */

/* EMPREGAMAIS-CANDIDATURAS-SUPABASE-SYNC-V1 */
let sbCandidaturasCacheEM=[],sbCandidaturasCarregadasEM=false,sbCandidaturasCarregandoEM=false,sbCandidaturasTimerEM=null;
function sbMapCandidaturaEM(r){
 if(!r)return null;
 return {id:r.id,vagaId:r.vaga_id,candidatoUserId:r.candidato_user_id||"",empresaUserId:r.empresa_user_id||"",candidato:r.candidato_nome||"",nome:r.candidato_nome||"",email:r.candidato_email||"",telefone:r.candidato_telefone||"",status:r.status||"Em avaliação",historico:Array.isArray(r.historico)?r.historico:[],entrevista:r.entrevista||null,curriculo:r.curriculo||null,perfilProfissional:r.perfil_profissional||null,curriculoOrigem:r.curriculo_origem||"",aderencia:r.aderencia,criadoEm:r.criado_em||"",atualizadoEm:r.atualizado_em||"",contratadoEm:r.contratado_em||""}
}
function sbEspelharCandidaturasEM(a){sbCandidaturasCacheEM=(a||[]).filter(Boolean);sbCandidaturasCarregadasEM=true;gravar("empregaMaisCandidaturas",sbCandidaturasCacheEM);return sbCandidaturasCacheEM}
candidaturas=function(){return sbCandidaturasCarregadasEM?sbCandidaturasCacheEM:ler("empregaMaisCandidaturas")}
async function sbCarregarCandidaturasEM(renderizar){
 if(sbCandidaturasCarregandoEM)return sbCandidaturasCacheEM;
 const token=await sbGarantirSessaoEM();if(!token)return candidaturas();
 sbCandidaturasCarregandoEM=true;
 try{
  const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/candidaturas?select=*&order=criado_em.desc",{method:"GET",headers:sbHeadersEM(token)});
  sbEspelharCandidaturasEM(Array.isArray(rows)?rows.map(sbMapCandidaturaEM):[]);
  if(renderizar!==false){
   if(papelAtual()==="empresa"&&document.getElementById("listaCandidatosEmpresa"))renderizarCandidatosEmpresa();
   if(papelAtual()==="candidato"){if(document.getElementById("listaCandidaturas"))renderizarCandidaturasCandidato();if(document.getElementById("candMetricaCandidaturas"))atualizarPainelCandidato()}
  }
  return sbCandidaturasCacheEM
 }finally{sbCandidaturasCarregandoEM=false}
}
function sbHistoricoComEM(c,status,data,extra){
 const h=Array.isArray(c?.historico)?c.historico.slice():[];
 h.push(Object.assign({status:status,data:data||new Date().toISOString()},extra||{}));return h
}
async function sbAtualizarCandidaturaEM(c,patch){
 const token=await sbGarantirSessaoEM();if(!token)throw new Error("Sua sessão expirou. Entre novamente.");
 const body={};
 if("status" in patch)body.status=patch.status;
 if("historico" in patch)body.historico=patch.historico;
 if("entrevista" in patch)body.entrevista=patch.entrevista;
 if("atualizadoEm" in patch)body.atualizado_em=patch.atualizadoEm;
 if("contratadoEm" in patch)body.contratado_em=patch.contratadoEm||null;
 const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/candidaturas?id=eq."+encodeURIComponent(c.id),{method:"PATCH",headers:Object.assign(sbHeadersEM(token),{"Prefer":"return=representation"}),body:JSON.stringify(body)});
 if(!Array.isArray(rows)||!rows[0])throw new Error("A candidatura não pôde ser atualizada.");
 const novo=sbMapCandidaturaEM(rows[0]),a=candidaturas().slice(),i=a.findIndex(x=>x.id===novo.id);if(i>=0)a[i]=novo;else a.unshift(novo);sbEspelharCandidaturasEM(a);return novo
}
function sbDataEtapaCandidaturaEM(c,statuses){
 const nomes=Array.isArray(statuses)?statuses:[statuses],h=Array.isArray(c?.historico)?c.historico:[];
 const x=h.find(e=>nomes.includes(e.status));return x?.data||""
}
enviarCandidatura=async function(e){
 e.preventDefault();
 if(papelAtual()!=="candidato"||!candidatoLogado()){msg("#msgCandidatura","Sua sessão de candidato expirou. Entre novamente para continuar.");setTimeout(()=>irPara("login-candidato"),700);return}
 const v=vagaAtual();if(!v||v.status!=="aprovada"||!vagaDentroPrazo(v))return msg("#msgCandidatura","Esta vaga não está mais recebendo candidaturas.");
 const email=$("#candEmail").value.trim().toLowerCase(),c=candidatoLogado()||{},p=c.perfil||{},curr=ler(chaveCurriculo(),null),online=dadosCurriculoOnlineEM(),origem=$("#candCurriculoOpcao")?.value||"perfil";
 if(origem==="cadastrado"&&!curr)return msg("#msgCandidatura","Cadastre um currículo antes de selecionar esta opção.");
 if(origem==="online"&&!itensProgressoCurriculoEM(online).some(x=>x.ok))return msg("#msgCandidatura","Crie seu Currículo + Empregos antes de selecionar esta opção.");
 try{
  msg("#msgCandidatura","Enviando candidatura...");
  const token=await sbGarantirSessaoEM();if(!token)throw new Error("Sua sessão expirou. Entre novamente.");
  const u=await sbUsuarioAtualEM();await sbCarregarCandidaturasEM(false);
  if(candidaturas().some(x=>x.vagaId===v.id&&(x.candidatoUserId===u.id||String(x.email||"").toLowerCase()===email)))throw new Error("Você já se candidatou a esta vaga.");
  if(!v.userId)throw new Error("Não foi possível identificar a empresa responsável por esta vaga.");
  const agora=new Date().toISOString(),id="cand_"+Date.now()+"_"+Math.random().toString(36).slice(2,8),cv=origem==="cadastrado"?{...curr,enviadoEm:agora}:(origem==="online"?{...online,enviadoEm:agora,tipo:"curriculo_online"}:null),perfil=origem==="perfil"?{titulo:p.titulo||"",area:p.area||"",escolaridade:p.escolaridade||"",experiencia:p.experiencia||"",resumo:p.resumo||"",competencias:p.competencias||"",linkedin:p.linkedin||"",portfolio:p.portfolio||""}:null;
  const payload={id:id,vaga_id:v.id,candidato_user_id:u.id,empresa_user_id:v.userId,candidato_nome:$("#candNome").value.trim(),candidato_email:$("#candEmail").value.trim(),candidato_telefone:$("#candTelefone").value.trim(),status:"Em avaliação",historico:[{status:"Candidatura enviada",data:agora},{status:"Em avaliação",data:agora}],entrevista:null,curriculo:cv,perfil_profissional:perfil,curriculo_origem:origem,aderencia:calcularAderenciaCandidatoEM({curriculoOrigem:origem,curriculo:cv,perfilProfissional:perfil},v),criado_em:agora,atualizado_em:agora};
  const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/candidaturas",{method:"POST",headers:Object.assign(sbHeadersEM(token),{"Prefer":"return=representation"}),body:JSON.stringify(payload)});
  const novo=sbMapCandidaturaEM(Array.isArray(rows)?rows[0]:rows);if(!novo)throw new Error("O Supabase não retornou a candidatura criada.");
  sbEspelharCandidaturasEM([novo,...candidaturas().filter(x=>x.id!==novo.id)]);msg("#msgCandidatura","Candidatura enviada com sucesso.",true);setTimeout(()=>irPara("candidaturas"),800)
 }catch(err){console.error("Candidatura Supabase:",err);msg("#msgCandidatura",err.message||"Não foi possível enviar sua candidatura.")}
};
mudarEtapaCandidato=async function(id,status){
 const a=candidaturas(),i=a.findIndex(c=>c.id===id);if(i<0)return;const c=a[i],anterior=c.status||"Em avaliação",fluxo=["Selecionado","Em contato","Entrevista agendada","Aprovado","Contratado"];
 if(anterior===status)return;
 if(anterior==="Reprovado"||anterior==="Contratado"){alert("Este processo já foi encerrado e não pode voltar para uma etapa anterior.");renderizarCandidatosEmpresa();return}
 const pa=fluxo.indexOf(anterior),pn=fluxo.indexOf(status);if(pa>=0&&(status==="Em avaliação"||(pn>=0&&pn<pa))){alert("Após selecionar o candidato, não é possível retornar para uma etapa anterior.");renderizarCandidatosEmpresa();return}
 if(anterior!=="Em avaliação"&&status==="Reprovado"&&!confirm("Deseja encerrar este candidato como Não selecionado? Esta ação não poderá ser desfeita.")){renderizarCandidatosEmpresa();return}
 const agora=new Date().toISOString(),entrevista=c.entrevista&&["Reprovado","Contratado"].includes(status)?{...c.entrevista,encerrada:true,encerradaEm:agora}:c.entrevista;
 try{
  await sbAtualizarCandidaturaEM(c,{status:status,historico:sbHistoricoComEM(c,status,agora),atualizadoEm:agora,contratadoEm:status==="Contratado"?(c.contratadoEm||agora):c.contratadoEm,entrevista:entrevista});
  const filtroAtual=sessionStorage.getItem("filtroCandidatos")||"Todos";if(filtroAtual!=="Todos"&&grupoEtapa(status)!==filtroAtual)sessionStorage.setItem("filtroCandidatos",grupoEtapa(status));renderizarCandidatosEmpresa()
 }catch(err){console.error("Etapa candidatura Supabase:",err);alert("Não foi possível atualizar a etapa: "+err.message);await sbCarregarCandidaturasEM(true)}
};
salvarEntrevista=async function(e){
 e.preventDefault();const id=$("#entrevistaCandidaturaId").value,c=candidaturas().find(x=>x.id===id);if(!c)return;
 if(["Contratado","Reprovado"].includes(c.status)){alert("Este processo já foi encerrado para o candidato.");fecharEntrevista();return}
 const data=$("#entrevistaData").value,hora=$("#entrevistaHora").value,quando=new Date(data+"T"+hora);if(!data||!hora||Number.isNaN(quando.getTime())||quando<=new Date()){alert("Escolha uma data e horário futuros para a entrevista.");return}
 const agora=new Date().toISOString(),entrevista={data:data,hora:hora,formato:$("#entrevistaFormato").value,local:$("#entrevistaLocal").value.trim(),observacoes:$("#entrevistaObs").value.trim(),agendadaEm:agora};
 try{await sbAtualizarCandidaturaEM(c,{status:"Entrevista agendada",historico:sbHistoricoComEM(c,"Entrevista agendada",agora,{entrevista:{data:data,hora:hora}}),entrevista:entrevista,atualizadoEm:agora,contratadoEm:c.contratadoEm});fecharEntrevista();renderizarCandidatosEmpresa()}catch(err){console.error("Entrevista Supabase:",err);alert("Não foi possível agendar a entrevista: "+err.message)}
};
function sbAtualizarPaineisCandidaturasEM(){if(!["empresa","candidato"].includes(papelAtual()))return;sbCarregarCandidaturasEM(true).catch(err=>console.warn("Sincronização de candidaturas:",err))}
window.addEventListener("focus",()=>sbAtualizarPaineisCandidaturasEM());
document.addEventListener("visibilitychange",()=>{if(!document.hidden)sbAtualizarPaineisCandidaturasEM()});
window.addEventListener("load",()=>{setTimeout(sbAtualizarPaineisCandidaturasEM,900);if(!sbCandidaturasTimerEM)sbCandidaturasTimerEM=setInterval(()=>{if(!document.hidden)sbAtualizarPaineisCandidaturasEM()},12000)});


/* EMPREGAMAIS-CANDIDATO-LEGADO-MIGRACAO-AUTH-V2 */
const _loginCandidatoSupabaseV1=loginCandidato;
async function loginCandidatoSupabaseEM(e){
 e.preventDefault();const email=$("#loginCandEmail").value.trim().toLowerCase(),senha=$("#loginCandSenha").value;
 if(!email.includes("@"))return msg("#msgLoginCandidato","Informe um e-mail válido.");if(!senha)return msg("#msgLoginCandidato","Informe sua senha.");
 msg("#msgLoginCandidato","Entrando...");
 const candidatosLegados=ler("empregaMaisCandidatos");
 const legadoEmail=candidatosLegados.find(x=>String(x.email||"").trim().toLowerCase()===email);
 const legadoSenha=legadoEmail&&String(legadoEmail.senha??"")===String(senha);
 try{
  let auth;
  try{auth=await sbLoginAuthCandidatoEM(email,senha)}
  catch(loginErr){
   if(!/invalid login|invalid credentials/i.test(loginErr.message||""))throw loginErr;
   if(!legadoEmail)throw loginErr;
   if(!legadoSenha){
    msg("#msgLoginCandidato","Encontramos seu cadastro antigo, mas a senha salva nele não corresponde à informada. Use a senha original desse cadastro.");
    return
   }
   msg("#msgLoginCandidato","Migrando seu cadastro antigo...");
   auth=await sbCadastrarAuthCandidatoEM(email,senha,legadoEmail.nome||"",legadoEmail.telefone||"",legadoEmail.cidade||"");
   if(!auth?.access_token){msg("#msgLoginCandidato","Sua conta foi migrada para o Supabase. Confirme seu e-mail para entrar.",true);return}
  }
  const base=legadoEmail||{email};
  let d=sbSalvarCandidatoLocalEM(sbCandidatoDoAuthEM(auth,base));
  try{
   /* Primeiro carrega/migra o registro remoto. Só depois faz upsert.
      Isso impede que um perfil vazio do login sobrescreva os dados legados deste navegador. */
   const remoto=await sbBuscarCandidatoCloudEM(auth.access_token);
   if(remoto){
    /* Em outro navegador o Supabase e a fonte oficial: primeiro espelha o registro remoto
       no cache local e somente depois executa a migracao de qualquer legado existente. */
    d=sbSalvarCandidatoLocalEM(sbMapPerfilCandidatoCloudEM(remoto,d));
    const cloudEmail=String(d.email||email).toLowerCase();
    gravar("empregaMaisCurriculoOnline_"+cloudEmail,d.curriculoOnline||{});
    if(d.curriculoArquivo)gravar("empregaMaisCurriculo_"+cloudEmail,d.curriculoArquivo);
    gravar("empregaMaisSalvas_"+cloudEmail,d.vagasSalvas||[]);
    d=await sbMigrarESincronizarCandidatoCloudEM(d,auth.access_token);
   }else d=sbSalvarCandidatoLocalEM(await sbUpsertCandidatoSupabaseEM(d,auth.access_token));
  }
  catch(syncErr){console.error("Sincronização do cadastro do candidato:",syncErr);msg("#msgLoginCandidato","Conta autenticada, mas não foi possível sincronizar seu cadastro. Atualize a página e tente novamente.");return}
  concluirEntradaCandidatoSupabaseEM(d)
 }catch(err){
  console.error("Login candidato / Supabase:",err);
  const t=/email not confirmed/i.test(err.message)?"Confirme seu e-mail antes de entrar.":/already|registered|exists/i.test(err.message)?"Sua conta já existe no Supabase. Tente entrar novamente.":/invalid login|invalid credentials/i.test(err.message)?"E-mail ou senha incorretos.":("Não foi possível entrar: "+err.message);
  msg("#msgLoginCandidato",t)
 }
}

/* EMPREGAMAIS-USUARIOS-EMPRESA-V1 */
function limiteUsuariosEmpresaEM(plano){return ({basico:1,mensal:1,trimestral:1,semestral:2,anual:5})[String(plano||'basico').toLowerCase()]||1}
async function sbRestaurarSessaoEmpresaEM(){
 if(localStorage.getItem('empregaMaisLogoutBloqueio')==='1'||sessionStorage.getItem('empregaMaisLogoutBloqueio')==='1')return false;
 const token=await sbGarantirSessaoEM();if(!token)return false;
 try{
  const u=await sbUsuarioAtualEM(),emp=await sbBuscarMinhaEmpresaEM();if(!emp?.id)return false;
  const d=sbEmpresaParaLocalEM(emp,'');sbSalvarEmpresaLocalEM(d);
  sessionStorage.setItem('empregaMaisPapel','empresa');localStorage.setItem('empregaMaisPapelPersistido','empresa');sessionStorage.setItem('empresaNome',d.nome||'Empresa');sessionStorage.setItem('empresaCnpj',d.cnpj||'');
  sessionStorage.setItem('empresaSupabaseAuthUserId',u.id||'');sessionStorage.setItem('empresaSupabaseUserId',emp.user_id||'');sessionStorage.setItem('empresaSupabaseEmpresaId',emp.id||'');
  sessionStorage.setItem('empresaUsuarioAdministrador',String(String(u.id||'')===String(emp.user_id||'')));
  await Promise.all([sbCarregarVagasEmpresaAtualEM().catch(()=>[]),sbCarregarCandidaturasEM(false).catch(()=>[])]);
  return true
 }catch(e){return false}
}
async function carregarUsuariosEmpresaEM(){
 const box=document.getElementById('empresaUsuariosListaEM'),resumo=document.getElementById('empresaUsuariosResumoEM');if(!box)return;
 const token=await sbGarantirSessaoEM(),emp=await sbBuscarMinhaEmpresaEM();if(!token||!emp)return;
 const admin=sessionStorage.getItem('empresaUsuarioAdministrador')==='true',limite=limiteUsuariosEmpresaEM(emp.plano_id||emp.plano);
 const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/empresa_usuarios?select=id,nome,email,papel,ativo,criado_em&empresa_id=eq.'+encodeURIComponent(emp.id)+'&order=criado_em.asc',{method:'GET',headers:sbHeadersEM(token)}).catch(()=>[]);
 const ativos=(Array.isArray(rows)?rows:[]).filter(x=>x.ativo!==false);
 if(resumo)resumo.textContent=(1+ativos.length)+' de '+limite+' usuários utilizados';
 box.innerHTML='<article class="emp-user-row principal"><div><b>Administrador principal</b><span>'+esc(emp.email||emp.email_corporativo||'Conta principal da empresa')+'</span></div><em>Administrador</em></article>'+ativos.map(x=>'<article class="emp-user-row"><div><b>'+esc(x.nome||'Recrutador')+'</b><span>'+esc(x.email||'')+'</span></div><em>Recrutador</em>'+(admin?'<button type="button" onclick="removerUsuarioEmpresaEM(\''+x.id+'\')">Remover</button>':'')+'</article>').join('');
 const form=document.getElementById('empresaUsuarioFormEM');if(form)form.hidden=!admin||1+ativos.length>=limite;
 const aviso=document.getElementById('empresaUsuariosLimiteEM');if(aviso)aviso.textContent=admin?(1+ativos.length>=limite?'Limite do seu plano atingido. Para adicionar mais usuários, altere o plano.':'O novo recrutador acessará esta mesma empresa com e-mail e senha próprios.'):'Somente o administrador principal pode gerenciar os usuários.';
}
async function abrirUsuariosEmpresaEM(){const m=document.getElementById('modalUsuariosEmpresaEM');if(!m)return;m.classList.remove('oculto');await carregarUsuariosEmpresaEM()}
function fecharUsuariosEmpresaEM(){document.getElementById('modalUsuariosEmpresaEM')?.classList.add('oculto')}
async function adicionarUsuarioEmpresaEM(e){
 e.preventDefault();const nome=document.getElementById('empUserNomeEM')?.value.trim()||'',email=document.getElementById('empUserEmailEM')?.value.trim().toLowerCase()||'',senha=document.getElementById('empUserSenhaEM')?.value||'',msgEl=document.getElementById('empresaUsuariosMsgEM');
 try{if(msgEl)msgEl.textContent='Criando acesso...';const t=await sbGarantirSessaoEM();const r=await fetch(EMPREGAMAIS_SUPABASE_URL+'/functions/v1/gerenciar-usuario-empresa',{method:'POST',headers:Object.assign(sbHeadersEM(t),{'Content-Type':'application/json'}),body:JSON.stringify({action:'create',nome,email,senha})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Não foi possível criar o usuário.');e.target.reset();if(msgEl)msgEl.textContent='Usuário criado com sucesso.';await carregarUsuariosEmpresaEM()}catch(err){if(msgEl)msgEl.textContent=err.message}
}
async function removerUsuarioEmpresaEM(id){
 if(!confirm('Remover o acesso deste recrutador?'))return;const msgEl=document.getElementById('empresaUsuariosMsgEM');
 try{const t=await sbGarantirSessaoEM();const r=await fetch(EMPREGAMAIS_SUPABASE_URL+'/functions/v1/gerenciar-usuario-empresa',{method:'POST',headers:Object.assign(sbHeadersEM(t),{'Content-Type':'application/json'}),body:JSON.stringify({action:'deactivate',id})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Não foi possível remover o usuário.');if(msgEl)msgEl.textContent='Acesso removido.';await carregarUsuariosEmpresaEM()}catch(err){if(msgEl)msgEl.textContent=err.message}
}

/* EMPREGAMAIS-CANDIDATO-CLOUD-V1
   Supabase e a fonte oficial; localStorage funciona apenas como cache/migracao do navegador atual. */
function sbMapPerfilCandidatoCloudEM(x,d={}){
 return Object.assign({},d,{
  id:x.id||d.id,userId:x.user_id||d.userId,nome:x.nome||d.nome||"",
  email:String(x.email||d.email||"").toLowerCase(),telefone:x.telefone||d.telefone||"",
  cidade:x.cidade||d.cidade||"",perfil:(x.perfil&&typeof x.perfil==="object")?x.perfil:{},
  curriculoOnline:(x.curriculo_online&&typeof x.curriculo_online==="object")?x.curriculo_online:{},
  curriculoArquivo:(x.curriculo_arquivo&&typeof x.curriculo_arquivo==="object")?x.curriculo_arquivo:null,
  vagasSalvas:Array.isArray(x.vagas_salvas)?x.vagas_salvas:[],
  perfilAtualizadoEm:x.perfil_atualizado_em||"",premium:x.premium===true,premiumAtivo:x.premium===true,
  premiumCortesiaAdmin:x.premium_cortesia_admin===true,planoCandidato:x.premium===true?"premium":"",
  premiumAtivadoEm:x.premium_ativado_em||"",premiumValidoAte:x.premium_valido_ate||"",
  criadoEm:x.criado_em||d.criadoEm,atualizadoEm:x.atualizado_em||""
 })
}
async function sbBuscarCandidatoCloudEM(token){
 const u=await sbUsuarioAtualEM(),rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/candidatos?user_id=eq."+encodeURIComponent(u.id)+"&select=*&limit=1",{method:"GET",headers:sbHeadersEM(token)});
 return Array.isArray(rows)&&rows[0]?rows[0]:null
}
async function sbRestaurarSessaoCandidatoEM(){
 if(localStorage.getItem('empregaMaisLogoutBloqueio')==='1'||sessionStorage.getItem('empregaMaisLogoutBloqueio')==='1')return false;
 const token=await sbGarantirSessaoEM();if(!token)return false;
 let remoto=null;
 try{remoto=await sbBuscarCandidatoCloudEM(token)}catch(e){return false}
 if(!remoto?.user_id)return false;
 const cloud=sbMapPerfilCandidatoCloudEM(remoto,{});
 sbSalvarCandidatoLocalEM(cloud);
 const email=String(cloud.email||"").toLowerCase();
 sessionStorage.setItem("empregaMaisPapel","candidato");
 localStorage.setItem("empregaMaisPapelPersistido","candidato");
 sessionStorage.setItem("candidatoNome",cloud.nome||"Candidato");
 sessionStorage.setItem("candidatoEmail",email);
 sessionStorage.setItem("candidatoSupabaseUserId",cloud.userId||remoto.user_id);
 if(cloud.userId)sessionStorage.setItem("candidatoSupabaseUserId",cloud.userId);
 gravar("empregaMaisCurriculoOnline_"+email,cloud.curriculoOnline||{});
 if(cloud.curriculoArquivo)gravar("empregaMaisCurriculo_"+email,cloud.curriculoArquivo);
 else localStorage.removeItem("empregaMaisCurriculo_"+email);
 gravar("empregaMaisSalvas_"+email,cloud.vagasSalvas||[]);
 try{await sbCarregarCandidaturasEM(false)}catch(e){console.warn("Candidaturas não restauradas:",e)}
 return true
}
async function sbMigrarESincronizarCandidatoCloudEM(d,token){
 const remoto=await sbBuscarCandidatoCloudEM(token);if(!remoto)return d;
 const email=String(remoto.email||d.email||"").toLowerCase();
 /* Captura o legado ANTES de qualquer espelhamento do Supabase.
    Aceita também chaves antigas com variações de maiúsculas/espaços no e-mail. */
 const todosCandidatos=ler("empregaMaisCandidatos",[]);
 const legado=Array.isArray(todosCandidatos)?todosCandidatos.find(x=>String(x.email||"").trim().toLowerCase()===email):null;
 const localPerfil=(legado?.perfil&&Object.keys(legado.perfil).length?legado.perfil:(d?.perfil&&Object.keys(d.perfil).length?d.perfil:null));
 const acharChave=(prefixo)=>{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)||"";if(k.toLowerCase()===(prefixo+email).toLowerCase())return k}return prefixo+email};
 const localCv=ler(acharChave("empregaMaisCurriculoOnline_"),{});
 const localArq=ler(acharChave("empregaMaisCurriculo_"),null);
 const localSalvas=ler(acharChave("empregaMaisSalvas_"),[]);
 const remotoCv=remoto.curriculo_online&&Object.keys(remoto.curriculo_online).length;
 const remotoPerfil=remoto.perfil&&Object.keys(remoto.perfil).length;
 const patch={};
 if(!remotoPerfil&&localPerfil)patch.perfil=localPerfil;
 if(!remotoCv&&localCv&&Object.keys(localCv).length)patch.curriculo_online=localCv;
 if(!remoto.curriculo_arquivo&&localArq)patch.curriculo_arquivo=localArq;
 if((!Array.isArray(remoto.vagas_salvas)||!remoto.vagas_salvas.length)&&localSalvas.length)patch.vagas_salvas=localSalvas;
 if(Object.keys(patch).length){
  patch.atualizado_em=new Date().toISOString();
  const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/candidatos?user_id=eq."+encodeURIComponent(remoto.user_id),{method:"PATCH",headers:Object.assign(sbHeadersEM(token),{"Prefer":"return=representation"}),body:JSON.stringify(patch)});
  if(Array.isArray(rows)&&rows[0])Object.assign(remoto,rows[0])
 }
 const cloud=sbMapPerfilCandidatoCloudEM(remoto,d);sbSalvarCandidatoLocalEM(cloud);
 gravar("empregaMaisCurriculoOnline_"+email,cloud.curriculoOnline||{});
 if(cloud.curriculoArquivo)gravar("empregaMaisCurriculo_"+email,cloud.curriculoArquivo);
 gravar("empregaMaisSalvas_"+email,cloud.vagasSalvas||[]);
 return cloud
}
async function sbPatchCandidatoCloudEM(patch){
 const token=await sbGarantirSessaoEM();if(!token)throw new Error("Sua sessão expirou. Entre novamente.");
 const u=await sbUsuarioAtualEM(),body=Object.assign({},patch,{atualizado_em:new Date().toISOString()});
 const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/candidatos?user_id=eq."+encodeURIComponent(u.id),{method:"PATCH",headers:Object.assign(sbHeadersEM(token),{"Prefer":"return=representation"}),body:JSON.stringify(body)});
 if(!Array.isArray(rows)||!rows[0])throw new Error("Não foi possível sincronizar os dados do candidato.");
 const atual=sbSalvarCandidatoLocalEM(sbMapPerfilCandidatoCloudEM(rows[0],candidatoLogado()||{}));return atual
}
const _concluirEntradaCandidatoCloudBaseEM=concluirEntradaCandidatoSupabaseEM;
concluirEntradaCandidatoSupabaseEM=function(d){
 const token=sbTokenEM();
 if(!token)return _concluirEntradaCandidatoCloudBaseEM(d);
 sbMigrarESincronizarCandidatoCloudEM(d,token).then(cloud=>{
  _concluirEntradaCandidatoCloudBaseEM(cloud);
  setTimeout(async()=>{
   try{
    await sincronizarCandidatoLogadoSupabaseEM();
    await sbCarregarCandidaturasEM(true);
   }catch(e){console.error("Sincronização pós-login candidato:",e)}
  },120)
 }).catch(err=>{console.error("Sincronização cloud candidato:",err);_concluirEntradaCandidatoCloudBaseEM(d)})
};
const _salvarPerfilCandidatoLocalBaseEM=salvarPerfilCandidato;
salvarPerfilCandidato=async function(e){
 e.preventDefault();const val=id=>$("#"+id)?.value.trim()||"",nome=val("candPerfilNome"),telefone=val("candPerfilTelefone"),cidade=val("candPerfilCidade"),linkedin=val("candPerfilLinkedin"),portfolio=val("candPerfilPortfolio");
 if(nome.length<3)return msg("#msgPerfilCandidato","Informe seu nome completo.");if(nums(telefone).length<10)return msg("#msgPerfilCandidato","Informe um telefone válido.");if(cidade.length<2)return msg("#msgPerfilCandidato","Informe sua cidade.");if(linkedin&&!/^https?:\/\//i.test(linkedin))return msg("#msgPerfilCandidato","O LinkedIn deve começar com http:// ou https://.");if(portfolio&&!/^https?:\/\//i.test(portfolio))return msg("#msgPerfilCandidato","O portfólio deve começar com http:// ou https://.");
 const perfil={uf:val("candPerfilUf").toUpperCase(),nascimento:val("candPerfilNascimento"),titulo:val("candPerfilTitulo"),area:val("candPerfilArea"),escolaridade:val("candPerfilEscolaridade"),experiencia:val("candPerfilExperiencia"),pretensao:val("candPerfilPretensao"),modalidade:val("candPerfilModalidade"),disponibilidade:val("candPerfilDisponibilidade"),resumo:val("candPerfilResumo"),competencias:val("candPerfilCompetencias"),linkedin,portfolio};
 try{const d=await sbPatchCandidatoCloudEM({nome,telefone,cidade,perfil,perfil_atualizado_em:new Date().toISOString()});sessionStorage.setItem("candidatoNome",d.nome);msg("#msgPerfilCandidato","Perfil profissional salvo com sucesso.",true);atualizarPainelCandidato()}catch(err){console.error(err);msg("#msgPerfilCandidato","Não foi possível salvar seu perfil. Tente novamente.")}
};
const _salvarCurriculoOnlineCloudBaseEM=salvarCurriculoOnlineEM;
salvarCurriculoOnlineEM=function(e){
 const d=_salvarCurriculoOnlineCloudBaseEM(e);
 if(d&&papelAtual()==="candidato")sbPatchCandidatoCloudEM({curriculo_online:d}).catch(err=>console.error("Currículo online cloud:",err));
 return d
};
const _salvarCurriculoLocalCloudBaseEM=salvarCurriculoLocal;
salvarCurriculoLocal=function(e){
 _salvarCurriculoLocalCloudBaseEM(e);
 const d=ler(chaveCurriculo(),null);if(d&&papelAtual()==="candidato")sbPatchCandidatoCloudEM({curriculo_arquivo:d}).catch(err=>console.error("Currículo anexado cloud:",err))
};
const _excluirCurriculoCloudBaseEM=excluirCurriculo;
excluirCurriculo=function(){
 _excluirCurriculoCloudBaseEM();
 if(papelAtual()==="candidato")sbPatchCandidatoCloudEM({curriculo_arquivo:null}).catch(err=>console.error("Exclusão currículo cloud:",err))
};
const _alternarSalvarVagaCloudBaseEM=alternarSalvarVaga;
alternarSalvarVaga=function(){
 _alternarSalvarVagaCloudBaseEM();
 if(papelAtual()==="candidato")sbPatchCandidatoCloudEM({vagas_salvas:salvas()}).catch(err=>console.error("Vagas salvas cloud:",err))
};

/* EMPREGAMAIS-CANDIDATO-LOGIN-GUARD-V1 */
document.addEventListener("submit",async function(e){
 const f=e.target;if(!f||f.id!=="formLoginCandidato")return;
 e.preventDefault();e.stopImmediatePropagation();
 if(f.dataset.emLoginExecutando==="1")return;
 f.dataset.emLoginExecutando="1";
 try{await loginCandidato(e)}finally{delete f.dataset.emLoginExecutando}
},true);

/* EMPREGAMAIS-CANDIDATURAS-LEGADO-MIGRACAO-V1 */
const _sbCarregarCandidaturasBaseEM=sbCarregarCandidaturasEM;
sbCarregarCandidaturasEM=async function(renderizar){
 if(sbCandidaturasCarregandoEM)return sbCandidaturasCacheEM;
 const legado=(ler("empregaMaisCandidaturas")||[]).slice(),token=await sbGarantirSessaoEM();
 if(!token)return candidaturas();
 sbCandidaturasCarregandoEM=true;
 try{
  let rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/candidaturas?select=*&order=criado_em.desc",{method:"GET",headers:sbHeadersEM(token)});
  rows=Array.isArray(rows)?rows:[];
  if(papelAtual()==="candidato"){
   const u=await sbUsuarioAtualEM();
   const email=String(sessionStorage.getItem("candidatoEmail")||u.email||"").trim().toLowerCase();
   const ids=new Set(rows.map(x=>String(x.id||"")));
   const antigas=legado.filter(c=>{
    const ce=String(c.email||c.candidatoEmail||"").trim().toLowerCase();
    const uid=String(c.candidatoUserId||c.candidato_user_id||"");
    return (uid&&uid===String(u.id))||(ce&&email&&ce===email)
   }).filter(c=>!ids.has(String(c.id||"")));
   for(const c of antigas){
    let v=(sbVagasCacheEM.length?sbVagasCacheEM:ler("empregaMaisVagas")).find(x=>String(x.id)===String(c.vagaId||c.vaga_id));
    if((!v||!v.userId)&&String(c.vagaId||c.vaga_id)){
     try{
      const vr=await sbJsonEM(
       EMPREGAMAIS_SUPABASE_URL+"/rest/v1/vagas?select=id,user_id&id=eq."+encodeURIComponent(c.vagaId||c.vaga_id),
       {method:"GET",headers:sbHeadersEM(token)}
      );
      const raw=Array.isArray(vr)?vr[0]:null;
      if(raw)v={...(v||{}),id:raw.id,userId:raw.user_id};
     }catch(e){console.warn("Vaga da candidatura antiga não localizada:",c.vagaId||c.vaga_id,e)}
    }
    if(!v?.userId)continue;
    const criado=c.criadoEm||c.criado_em||new Date().toISOString();
    const hist=Array.isArray(c.historico)&&c.historico.length?c.historico:[
      {status:"Candidatura enviada",data:criado},
      {status:c.status||"Em avaliação",data:c.atualizadoEm||c.atualizado_em||criado}
    ];
    try{
     const payload={
      id:c.id,
      vaga_id:c.vagaId||c.vaga_id,
      candidato_user_id:u.id,
      empresa_user_id:v.userId,
      candidato_nome:c.candidato||c.nome||c.candidato_nome||"",
      candidato_email:c.email||c.candidatoEmail||u.email||"",
      candidato_telefone:c.telefone||c.candidato_telefone||"",
      status:c.status||"Em avaliação",
      historico:hist,
      entrevista:c.entrevista||null,
      curriculo:c.curriculo||null,
      perfil_profissional:c.perfilProfissional||c.perfil_profissional||null,
      curriculo_origem:c.curriculoOrigem||c.curriculo_origem||"",
      aderencia:Number.isFinite(Number(c.aderencia))?Number(c.aderencia):calcularAderenciaCandidatoEM(c,v),
      criado_em:criado,
      atualizado_em:c.atualizadoEm||c.atualizado_em||criado,
      contratado_em:c.contratadoEm||c.contratado_em||null
     };
     if(!payload.id)delete payload.id;
     const ins=await sbJsonEM(
      EMPREGAMAIS_SUPABASE_URL+"/rest/v1/candidaturas",
      {method:"POST",headers:Object.assign(sbHeadersEM(token),{"Prefer":"return=representation"}),body:JSON.stringify(payload)}
     );
     if(Array.isArray(ins)&&ins[0]){rows.push(ins[0]);ids.add(String(ins[0].id||""))}
    }catch(err){console.warn("Candidatura antiga não migrada:",c.id,err)}
   }
   const remotasMapeadas=rows.map(sbMapCandidaturaEM).filter(Boolean);
   const remotoIds=new Set(remotasMapeadas.map(x=>String(x.id||"")));
   const legadoDoCandidato=legado.filter(c=>{
    const ce=String(c.email||c.candidatoEmail||"").trim().toLowerCase();
    const uid=String(c.candidatoUserId||c.candidato_user_id||"");
    return (uid&&uid===String(u.id))||(ce&&email&&ce===email)
   }).filter(c=>!remotoIds.has(String(c.id||"")));
   const legadoNormalizado=legadoDoCandidato.map(c=>({
    id:c.id||("local_"+String(c.vagaId||c.vaga_id||"")+"_"+Date.now()),
    vagaId:c.vagaId||c.vaga_id,
    candidatoUserId:c.candidatoUserId||c.candidato_user_id||u.id,
    empresaUserId:c.empresaUserId||c.empresa_user_id||"",
    candidato:c.candidato||c.nome||c.candidato_nome||"",
    nome:c.candidato||c.nome||c.candidato_nome||"",
    email:c.email||c.candidatoEmail||c.candidato_email||email,
    telefone:c.telefone||c.candidato_telefone||"",
    status:c.status||"Em avaliação",
    historico:Array.isArray(c.historico)?c.historico:[],
    entrevista:c.entrevista||null,
    curriculo:c.curriculo||null,
    perfilProfissional:c.perfilProfissional||c.perfil_profissional||null,
    curriculoOrigem:c.curriculoOrigem||c.curriculo_origem||"",
    aderencia:c.aderencia,
    criadoEm:c.criadoEm||c.criado_em||"",
    atualizadoEm:c.atualizadoEm||c.atualizado_em||"",
    contratadoEm:c.contratadoEm||c.contratado_em||""
   }));
   sbEspelharCandidaturasEM([...remotasMapeadas,...legadoNormalizado]);
  }else{
   sbEspelharCandidaturasEM(rows.map(sbMapCandidaturaEM));
  }
  if(renderizar!==false){
   if(papelAtual()==="empresa"&&document.getElementById("listaCandidatosEmpresa"))renderizarCandidatosEmpresa();
   if(papelAtual()==="candidato"){
    if(document.getElementById("listaCandidaturas"))renderizarCandidaturasCandidato();
    if(document.getElementById("candMetricaCandidaturas"))atualizarPainelCandidato()
   }
  }
  return sbCandidaturasCacheEM
 }finally{sbCandidaturasCarregandoEM=false}
};

/* EMPREGAMAIS-ADMIN-CENTRAL-PENDENCIAS-ROTA-V1 */
const _adminAbaPendenciasEM=adminAba;
adminAba=async function(aba,btn){
 if(aba!=='pendencias'){const r=await _adminAbaPendenciasEM(aba,btn);adminAtualizarBadgePendenciasEM();return r}
 if(sessionStorage.getItem('empregaMaisAdmin')!=='1'){irPara('login-admin');return}
 document.querySelectorAll('[data-admin-tab]').forEach(b=>b.classList.toggle('ativo',b.dataset.adminTab===aba));
 const out=document.getElementById('adminConteudo');if(!out)return;
 out.innerHTML='<div class="admin-bloco"><h2>Central de pendências</h2><div class="admin-empty">Atualizando pendências...</div></div>';
 try{await adminSincronizarPainelSupabase()}catch(err){console.error('ADM pendências:',err)}
 out.innerHTML=adminRenderPendenciasEM();
};

/* EMPREGAMAIS — NOVO PAINEL ADMINISTRATIVO V1 */
const ADMIN2_TITULOS_EM={geral:['Visão geral','Acompanhe o + Empregos em um único lugar.'],pendencias:['Central de pendências','Tudo que precisa de uma ação administrativa.'],vagas:['Gestão de vagas','Analise e acompanhe todas as oportunidades do portal.'],empresas:['Empresas','Cadastros, planos e situação das empresas.'],verificacoes:['Verificações','Analise empresas que aguardam verificação ou reanálise.'],candidatos:['Candidatos','Cadastros e recursos dos profissionais.'],contratacoes:['Contratações','Acompanhe as contratações registradas no portal.'],planos:['Planos e assinaturas','Controle solicitações, vigências e concessões.'],'premium-candidatos':['Premium para candidatos','Conceda, acompanhe e remova acessos Premium dos candidatos.'],extras:['Extras','Destaques, urgências e benefícios adicionais.'],financeiro:['Financeiro','Visão administrativa das movimentações do portal.'],denuncias:['Denúncias','Analise ocorrências enviadas para moderação.'],relatorios:['Relatórios','Indicadores consolidados do + Empregos.'],historico:['Histórico administrativo','Registro das ações realizadas no painel.'],configuracoes:['Configurações','Controles administrativos e regras do portal.']};
function admin2AtualizarCabecalhoEM(aba){const d=ADMIN2_TITULOS_EM[aba]||ADMIN2_TITULOS_EM.geral,t=document.getElementById('admin2Titulo'),p=document.getElementById('admin2Subtitulo');if(t)t.textContent=d[0];if(p)p.textContent=d[1];}
async function adminAtualizarNovoPainelEM(){const ativo=document.querySelector('[data-admin-tab].ativo')?.dataset.adminTab||'geral',sync=document.getElementById('admin2Sync');if(sync)sync.textContent='Atualizando dados…';try{await adminSincronizarPainelSupabase();await adminAba(ativo);if(sync)sync.textContent='Dados atualizados agora'}catch(err){console.error('Atualização do painel:',err);if(sync)sync.textContent='Não foi possível concluir a atualização'}}
const _adminAbaCabecalhoEM=adminAba;
adminAba=async function(aba,btn){admin2AtualizarCabecalhoEM(aba);if(aba==='pendencias'){if(sessionStorage.getItem('empregaMaisAdmin')!=='1'){irPara('login-admin');return}document.querySelectorAll('[data-admin-tab]').forEach(b=>b.classList.toggle('ativo',b.dataset.adminTab===aba));const out=document.getElementById('adminConteudo');if(!out)return;out.innerHTML='<div class="admin-bloco"><h2>Atualizando pendências…</h2><p class="admin-sub">Buscando as solicitações mais recentes.</p></div>';try{await adminCarregarEmpresasSupabaseEM();await adminCarregarVagasSupabase()}catch(err){console.error('ADM pendências Supabase:',err)}out.innerHTML=adminRenderPendenciasEM();try{adminAtualizarBadgePendenciasEM()}catch(e){}return}const r=await _adminAbaCabecalhoEM(aba,btn);try{adminAtualizarBadgePendenciasEM()}catch(e){}return r};

function vigenciaTextoEmpresaEM(e){const v=e?.planoFim||e?.planoAte||e?.vigenciaAte;if(!v)return 'Plano ativo';const d=new Date(v);return isNaN(d)?'Plano ativo':'Ativo até '+d.toLocaleDateString('pt-BR')}

/* EMPREGAMAIS — EXPORTAÇÃO DE VAGAS ADMIN */
function adminExportarVagasCSV(){
 if(sessionStorage.getItem('empregaMaisAdmin')!=='1'){irPara('login-admin');return}
 const vagas=ler('empregaMaisVagas')||[];
 if(!vagas.length){alert('Não há vagas para exportar.');return}
 const cols=[
  ['ID',v=>v.id],['Cargo',v=>v.cargo],['Empresa',v=>v.empresa||v.empresaNome],['CNPJ',v=>v.empresaCnpj||v.cnpjEmpresa],
  ['Área',v=>v.area],['Cidade',v=>v.cidade],['UF',v=>v.uf],['Salário',v=>v.salario],['Contrato',v=>v.contrato],
  ['Modalidade',v=>v.modalidade],['Status',v=>v.status],['Destaque',v=>v.destaque?'Sim':'Não'],['Urgente',v=>v.urgente?'Sim':'Não'],
  ['Data de publicação',v=>v.dataPublicacao||v.criadoEm||v.data],['Descrição',v=>v.descricao],['Requisitos',v=>v.requisitos]
 ];
 const csv=[cols.map(c=>c[0]),...vagas.map(v=>cols.map(c=>c[1](v)??''))].map(row=>row.map(x=>'"'+String(x).replace(/"/g,'""').replace(/\r?\n/g,' ')+'"').join(';')).join('\r\n');
 const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='empregamais-vagas-'+new Date().toISOString().slice(0,10)+'.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}


/* EMPREGAMAIS-CENTRAL-MENSAGENS-CANDIDATO-V1 */
function conversasCandidatoEM(){
 const email=String(sessionStorage.getItem('candidatoEmail')||'').toLowerCase();
 return candidaturas().filter(c=>String(c.email||'').toLowerCase()===email&&mensagensCandidaturaEM(c).some(m=>m.autor==='empresa'));
}
function mensagensNaoLidasCandidatoEM(){
 return conversasCandidatoEM().reduce((n,c)=>n+mensagensCandidaturaEM(c).filter(m=>m.autor==='empresa'&&!m.lidaCandidato).length,0);
}
function atualizarSinoMensagensCandidatoEM(){
 const n=mensagensNaoLidasCandidatoEM(),badge=document.getElementById('candMsgSideBadge');
 if(badge){badge.textContent=n>99?'99+':n;badge.classList.toggle('oculto',!n)}
 let sino=document.getElementById('candMsgSinoTopoEM');
 const topo=document.querySelector('.sessao-candidato-topo');
 if(topo&&!sino){sino=document.createElement('button');sino.type='button';sino.id='candMsgSinoTopoEM';sino.className='cand-msg-sino';sino.innerHTML='🔔<b class="oculto">0</b>';sino.onclick=abrirCentralMensagensCandidatoEM;topo.prepend(sino)}
 if(sino){const b=sino.querySelector('b');if(b){b.textContent=n>99?'99+':n;b.classList.toggle('oculto',!n)}}
}
function abrirCentralMensagensCandidatoEM(id){
 const modal=document.getElementById('modalCentralMensagensCandidatoEM');if(!modal)return;
 modal.classList.remove('oculto');document.body.classList.add('cand-msg-open');
 renderCentralMensagensCandidatoEM(id);
}
function fecharCentralMensagensCandidatoEM(){document.getElementById('modalCentralMensagensCandidatoEM')?.classList.add('oculto');document.body.classList.remove('cand-msg-open')}
function renderCentralMensagensCandidatoEM(id){
 const conv=conversasCandidatoEM().sort((a,b)=>new Date(b.ultimaMensagemEm||b.criadoEm||0)-new Date(a.ultimaMensagemEm||a.criadoEm||0));
 const lista=document.getElementById('candMsgConversasEM'),main=document.getElementById('candMsgConteudoEM');if(!lista||!main)return;
 if(!conv.length){lista.innerHTML='<div class="cand-msg-list-empty">Nenhuma conversa ainda.</div>';main.innerHTML='<div class="cand-msg-empty"><b>🔔</b><strong>Nenhuma mensagem recebida</strong><span>Quando uma empresa enviar uma mensagem, ela aparecerá aqui e o sino será sinalizado.</span></div>';return}
 const ativo=conv.find(c=>c.id===id)||conv[0];
 lista.innerHTML=conv.map(c=>{const ms=mensagensCandidaturaEM(c),last=ms[ms.length-1]||{},nl=ms.filter(m=>m.autor==='empresa'&&!m.lidaCandidato).length,v=ler('empregaMaisVagas').find(x=>x.id===c.vagaId)||{};return '<button type="button" class="'+(c.id===ativo.id?'ativo':'')+'" onclick="abrirConversaCandidatoEM(\''+c.id+'\')"><i>💬</i><span><strong>'+esc(nomeEmpresaCandidaturaEM(c))+'</strong><b>'+esc(tituloVaga(v)||c.vagaTitulo||'Vaga')+'</b><small>'+esc(last.texto||'')+'</small></span>'+(nl?'<em>'+nl+'</em>':'')+'</button>'}).join('');
 abrirConversaCandidatoEM(ativo.id,true);
}
function abrirConversaCandidatoEM(id,semLista){
 const a=candidaturas(),i=a.findIndex(c=>c.id===id);if(i<0)return;const c=a[i],msgs=mensagensCandidaturaEM(c);
 msgs.forEach(m=>{if(m.autor==='empresa')m.lidaCandidato=true});a[i].mensagens=msgs;gravar('empregaMaisCandidaturas',a);
 const main=document.getElementById('candMsgConteudoEM');if(main){const v=ler('empregaMaisVagas').find(x=>x.id===c.vagaId)||{};main.innerHTML='<div class="cand-msg-conv-head"><div><span>'+esc(nomeEmpresaCandidaturaEM(c))+'</span><h3>'+esc(tituloVaga(v)||c.vagaTitulo||'Vaga')+'</h3></div></div>'+renderChatCandidaturaEM(c,'candidato')}
 atualizarSinoMensagensCandidatoEM();if(!semLista)renderCentralMensagensCandidatoEM(id);
}
const _enviarMensagemCandidaturaEMCentral=enviarMensagemCandidaturaEM;
enviarMensagemCandidaturaEM=function(id,autor){_enviarMensagemCandidaturaEMCentral(id,autor);setTimeout(()=>{atualizarSinoMensagensCandidatoEM();if(autor==='candidato'&&!document.getElementById('modalCentralMensagensCandidatoEM')?.classList.contains('oculto'))renderCentralMensagensCandidatoEM(id)},0)}
document.addEventListener('DOMContentLoaded',()=>setTimeout(atualizarSinoMensagensCandidatoEM,100));
setInterval(()=>{if(papelAtual()==='candidato')atualizarSinoMensagensCandidatoEM()},5000);

function toggleDetalhesAderenciaEM(){
 const box=document.getElementById('candAderenciaOrientacao'),btn=document.getElementById('candAderenciaDetalhesBtn');if(!box)return;
 const abrir=box.classList.contains('oculto');box.classList.toggle('oculto',!abrir);if(btn)btn.textContent=abrir?'Ocultar análise':'Ver análise';
}

/* EMPREGAMAIS-ADERENCIA-PREMIUM-CANDIDATO-V2 */
(function(){
 const originalAderencia=aderenciaVagaAtualHTML;
 aderenciaVagaAtualHTML=function(v){
  /* Visitante deslogado não deve ver nem o bloco nem qualquer cálculo de aderência. */
  if(papelAtual()!=='candidato'||!candidatoLogado())return '';
  /* Aderência é benefício pago: plano grátis não renderiza nem o card bloqueado. */
  if(!candidatoPremiumAtivoEM())return '';
  return originalAderencia(v);
 };
 const originalRenderVaga=renderizarVagaDetalhe;
 renderizarVagaDetalhe=async function(){
  if(papelAtual()==='candidato')await sincronizarCandidatoLogadoSupabaseEM();
  return originalRenderVaga();
 };
 const originalPreparar=prepararCandidatura;
 prepararCandidatura=async function(){
  if(papelAtual()==='candidato')await sincronizarCandidatoLogadoSupabaseEM();
  return originalPreparar();
 };
})();

/* EMPREGAMAIS-PERFIL-RECRUTAMENTO-EMPRESA-V1 */
function atualizarCamposRecrutamentoEmpresaEM(){
 const ats=document.getElementById('perfilUsaAts')?.value==='sim';
 const vagas=document.getElementById('perfilAnunciaSite')?.value==='sim';
 document.getElementById('perfilAtsNomeWrap')?.classList.toggle('visivel',ats);
 document.getElementById('perfilPaginaCarreirasWrap')?.classList.toggle('visivel',vagas);
}
const _carregarPerfilEmpresaRecrutamentoEM=carregarPerfilEmpresa;
carregarPerfilEmpresa=function(){
 const r=_carregarPerfilEmpresaRecrutamentoEM.apply(this,arguments);
 setTimeout(()=>{atualizarCamposRecrutamentoEmpresaEM()},0);
 return r;
};
addEventListener('DOMContentLoaded',atualizarCamposRecrutamentoEmpresaEM);

/* EMPREGAMAIS-FORM-VAGA-REF-V1 */
function sincronizarConfidencialVagaEM(checked){
 const principal=document.getElementById('vagaConfidencial');
 if(principal)principal.checked=!!checked;
}
document.addEventListener('change',e=>{
 if(e.target?.id==='vagaConfidencial'){
  const x=document.getElementById('vagaConfidencialEtapa2');if(x)x.checked=e.target.checked;
 }
});

/* EMPREGAMAIS-CONFIDENCIAL-SOMENTE-PLANO-PAGO-V1 */
function empresaTemPlanoPagoEM(){
 const e=typeof empresaLogada==='function'?empresaLogada():null;
 const chave=String(e?.plano||sessionStorage.getItem('empresaPlano')||'basico').toLowerCase();
 const status=String(e?.planoStatus||e?.assinaturaStatus||'ativo').toLowerCase();
 return !['basico','gratis','grátis','free',''].includes(chave)&&!['cancelado','inativo','expirado'].includes(status);
}
function atualizarConfidencialPlanoEM(){
 const pago=empresaTemPlanoPagoEM(),box=document.getElementById('vagaConfidencialPlanoBox'),inp=document.getElementById('vagaConfidencialEtapa2'),txt=document.getElementById('vagaConfidencialPlanoTexto');
 if(inp){inp.disabled=!pago;if(!pago)inp.checked=false}
 if(box)box.classList.toggle('bloqueado',!pago);
 if(txt)txt.textContent=pago?'O candidato verá “Empresa confidencial” no anúncio.':'Recurso disponível exclusivamente nos planos pagos.';
 if(!pago){const principal=document.getElementById('vagaConfidencial');if(principal)principal.checked=false}
}
const _sincronizarConfidencialVagaEMPlano=sincronizarConfidencialVagaEM;
sincronizarConfidencialVagaEM=function(checked){
 if(checked&&!empresaTemPlanoPagoEM()){atualizarConfidencialPlanoEM();return false}
 return _sincronizarConfidencialVagaEMPlano.call(this,checked);
};
document.addEventListener('DOMContentLoaded',()=>setTimeout(atualizarConfidencialPlanoEM,0));

/* EMPREGAMAIS-LOCAL-DETALHES-CANDIDATO-V1 */
function localizacaoPublicaVagaEM(v){
 if(!v)return'Localização não informada';
 const tipo=v.exibicaoEndereco||v.exibicao_endereco||v.tipoExibicaoEndereco||'cidade';
 const cidade=String(v.cidade||'').trim(),uf=String(v.estado||v.uf||'').trim(),bairro=String(v.bairro||'').trim(),rua=String(v.logradouro||v.endereco||'').trim(),numero=String(v.numero||'').trim();
 const cidadeUf=[cidade,uf].filter(Boolean).join(' - ');
 if(tipo==='completo'){
  const linha=[rua,numero].filter(Boolean).join(', ');
  return [linha,bairro,cidadeUf].filter(Boolean).join(' — ')||cidadeUf||'Localização não informada';
 }
 if(tipo==='bairro_cidade')return [bairro,cidadeUf].filter(Boolean).join(' — ')||cidadeUf||'Localização não informada';
 return cidadeUf||'Localização não informada';
}
function abrirDetalhesLocalVagaEM(ev){
 const pop=ev?.currentTarget?.parentElement?.querySelector('.em-local-popover');if(!pop)return;
 document.querySelectorAll('.em-local-popover').forEach(x=>{if(x!==pop)x.classList.add('oculto')});
 pop.classList.remove('oculto');document.body.classList.add('em-local-pop-open');
}
function fecharDetalhesLocalVagaEM(){document.querySelectorAll('.em-local-popover').forEach(x=>x.classList.add('oculto'));document.body.classList.remove('em-local-pop-open')}
document.addEventListener('click',e=>{if(!e.target.closest('.vaga-info-grid>div:first-child'))fecharDetalhesLocalVagaEM()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')fecharDetalhesLocalVagaEM()});

/* EMPREGAMAIS-CANDIDATURA-SNIPPET-V1 */
function alternarTimelineCandidatoEM(btn){const card=btn&&btn.closest('.candidatura-card');if(!card)return;const box=card.querySelector('.cand-timeline-detalhe');if(!box)return;const aberto=box.classList.toggle('aberto');btn.textContent=aberto?'Ocultar andamento ↑':'Ver andamento completo →';}

/* EMPREGAMAIS-CANDIDATOS-COMPACTOS-V1 */
function alternarProcessoCandidatoEmpresaEM(btn){const card=btn?.closest('.recruta-cand-card');if(!card)return;const box=card.querySelector('.recruta-extra');if(!box)return;const aberto=box.classList.toggle('aberto');btn.classList.toggle('ativo',aberto);}


/* EMPREGAMAIS-MENU-VAGA-RECURSOS-V1 */
function fecharMenuVagaEM(){document.querySelectorAll('.emp-vaga-popover').forEach(x=>x.remove());if(window._empMenuVagaScroll){window.removeEventListener('scroll',window._empMenuVagaScroll,true);window.removeEventListener('resize',window._empMenuVagaScroll);window._empMenuVagaScroll=null}}
function abrirMenuVagaEM(ev,id){
 ev?.preventDefault();ev?.stopPropagation();fecharMenuVagaEM();
 const v=vagasDaEmpresa().find(x=>String(x.id)===String(id));if(!v)return;
 const box=document.createElement('div');box.className='emp-vaga-popover';
 box.innerHTML='<div class="emp-vaga-popover-head"><strong>Opções da vaga</strong><small>'+esc(tituloVaga(v))+'</small></div>'+
 '<button type="button" onclick="fecharMenuVagaEM();editarVaga(\''+id+'\')"><i class="editar">✎</i><span><b>Editar vaga</b><small>Alterar informações da oportunidade</small></span></button>'+
 '<button type="button" onclick="alternarRecursoVagaEM(\''+id+'\',\'destaque\')"><i class="dest">★</i><span><b>'+(v.destaque?'Retirar destaque':'Adicionar destaque')+'</b><small>'+(v.destaque?'A vaga deixará de receber destaque':'Dar mais visibilidade à oportunidade')+'</small></span></button>'+
 '<button type="button" onclick="alternarRecursoVagaEM(\''+id+'\',\'urgente\')"><i class="urg">⚡</i><span><b>'+(v.urgente?'Retirar urgência':'Marcar como urgente')+'</b><small>'+(v.urgente?'Remover sinalização de urgência':'Sinalizar contratação prioritária')+'</small></span></button>'+
 '<button type="button" onclick="alternarRecursoVagaEM(\''+id+'\',\'confidencial\')"><i class="conf">◉</i><span><b>'+(v.confidencial?'Retirar confidencial':'Tornar confidencial')+'</b><small>'+(v.confidencial?'Voltar a identificar a empresa':'Ocultar a identificação da empresa')+'</small></span></button>'+
 (v.status==='encerrada'?'<button type="button" class="encerrada" disabled><i>✓</i><span><b>Vaga encerrada</b><small>Esta vaga não pode ser reaberta</small></span></button>':'<button type="button" class="encerrar" onclick="abrirEncerrarVagaEM(\''+id+'\')"><i>×</i><span><b>Encerrar vaga</b><small>Finalizar esta publicação definitivamente</small></span></button>');
 document.body.appendChild(box);
 const r=ev.currentTarget.getBoundingClientRect(),w=box.offsetWidth||300,left=Math.min(innerWidth-w-12,Math.max(12,r.right-w)),top=Math.min(innerHeight-(box.offsetHeight||330)-12,Math.max(12,r.bottom+7));
 box.style.left=left+'px';box.style.top=top+'px';
 window._empMenuVagaScroll=()=>fecharMenuVagaEM();
 window.addEventListener('scroll',window._empMenuVagaScroll,true);
 window.addEventListener('resize',window._empMenuVagaScroll);
 setTimeout(()=>document.addEventListener('click',fecharMenuVagaEM,{once:true}),0)
}
function abrirEncerrarVagaEM(id){
 fecharMenuVagaEM();
 const v=vagasDaEmpresa().find(x=>String(x.id)===String(id));if(!v||v.status==='encerrada')return;
 document.getElementById('modalEncerrarVagaEM')?.remove();
 const m=document.createElement('div');m.id='modalEncerrarVagaEM';m.className='modal-encerrar-vaga-em';
 m.innerHTML='<div class="modal-encerrar-vaga-backdrop" onclick="fecharEncerrarVagaEM()"></div><div class="modal-encerrar-vaga-dialog" role="dialog" aria-modal="true" aria-labelledby="tituloEncerrarVagaEM"><button class="modal-encerrar-fechar" type="button" onclick="fecharEncerrarVagaEM()">×</button><div class="modal-encerrar-icone">!</div><small class="modal-encerrar-kicker">ENCERRAR VAGA</small><h2 id="tituloEncerrarVagaEM">Encerrar esta vaga?</h2><p>A vaga <strong>'+esc(tituloVaga(v))+'</strong> será encerrada definitivamente e deixará de receber novas candidaturas.</p><div class="modal-encerrar-alerta"><b>Esta ação não pode ser desfeita.</b><span>Depois de confirmada, a vaga não poderá ser reaberta. Para anunciar novamente, será necessário criar uma nova vaga.</span></div><div class="modal-encerrar-acoes"><button type="button" class="modal-encerrar-cancelar" onclick="fecharEncerrarVagaEM()">Cancelar</button><button type="button" class="modal-encerrar-confirmar" onclick="confirmarEncerrarVagaEM(\''+id+'\',this)">Sim, encerrar vaga</button></div></div>';
 document.body.appendChild(m);document.body.classList.add('modal-encerrar-vaga-aberto');
}
function fecharEncerrarVagaEM(){document.getElementById('modalEncerrarVagaEM')?.remove();document.body.classList.remove('modal-encerrar-vaga-aberto')}
async function confirmarEncerrarVagaEM(id,btn){
 const v=vagasDaEmpresa().find(x=>String(x.id)===String(id));if(!v||v.status==='encerrada'){fecharEncerrarVagaEM();return}
 if(btn){btn.disabled=true;btn.textContent='Encerrando...'}
 const agora=new Date().toISOString();
 try{
  const token=await sbGarantirSessaoEM();if(!token)throw new Error('Sua sessão expirou. Entre novamente.');
  await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:Object.assign(sbHeadersEM(token),{'Prefer':'return=minimal'}),body:JSON.stringify({status:'encerrada',encerrada_em:agora})});
  const locais=ler('empregaMaisVagas'),i=locais.findIndex(x=>String(x.id)===String(id));if(i>=0){locais[i].status='encerrada';locais[i].encerradaEm=agora;gravar('empregaMaisVagas',locais)}
  const ci=sbVagasCacheEM.findIndex(x=>String(x.id)===String(id));if(ci>=0){sbVagasCacheEM[ci].status='encerrada';sbVagasCacheEM[ci].encerradaEm=agora}
  fecharEncerrarVagaEM();await sbCarregarVagasEM();renderizarPainelEmpresa();
  const ok=document.createElement('div');ok.className='modal-encerrar-vaga-em';ok.id='modalEncerrarVagaEM';ok.innerHTML='<div class="modal-encerrar-vaga-backdrop"></div><div class="modal-encerrar-vaga-dialog"><div class="modal-encerrar-icone" style="background:#edf8f3;border-color:#c9e8da;color:#168064">✓</div><small class="modal-encerrar-kicker">PROCESSO FINALIZADO</small><h2>Vaga encerrada</h2><p>A vaga foi encerrada com sucesso e não poderá ser reaberta.</p><div class="modal-encerrar-acoes" style="grid-template-columns:1fr"><button type="button" class="modal-encerrar-cancelar" onclick="fecharEncerrarVagaEM()">Entendi</button></div></div>';document.body.appendChild(ok);document.body.classList.add('modal-encerrar-vaga-aberto');
 }catch(err){console.error('Encerrar vaga:',err);if(btn){btn.disabled=false;btn.textContent='Sim, encerrar vaga'}alert(err.message||'Não foi possível encerrar a vaga.')}
}
async function alternarRecursoVagaEM(id,recurso){
 const v=vagasDaEmpresa().find(x=>String(x.id)===String(id));if(!v||!['destaque','urgente','confidencial'].includes(recurso))return;
 const novo=!v[recurso],plano=planoEmpresaAtual();
 if(novo&&(recurso==='destaque'||recurso==='urgente')&&plano.nome==='Grátis'){fecharMenuVagaEM();alert((recurso==='destaque'?'Destaque':'Urgência')+' é um recurso adicional no plano Grátis. Ative o adicional correspondente antes de usar nesta vaga.');return}
 const teste={destaque:!!v.destaque,urgente:!!v.urgente,confidencial:!!v.confidencial};teste[recurso]=novo;
 const erro=validarRecursosPlano(teste,v.id);if(erro){fecharMenuVagaEM();alert(erro);return}
 try{
  const token=await sbGarantirSessaoEM();if(!token)throw new Error('Sua sessão expirou. Entre novamente.');
  await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:Object.assign(sbHeadersEM(token),{'Prefer':'return=minimal'}),body:JSON.stringify({[recurso]:novo})});
  const locais=ler('empregaMaisVagas'),i=locais.findIndex(x=>String(x.id)===String(id));if(i>=0){locais[i][recurso]=novo;gravar('empregaMaisVagas',locais)}
  const ci=sbVagasCacheEM.findIndex(x=>String(x.id)===String(id));if(ci>=0)sbVagasCacheEM[ci][recurso]=novo;
  fecharMenuVagaEM();await sbCarregarVagasEM();renderizarPainelEmpresa()
 }catch(err){console.error('Alteração de recurso da vaga:',err);alert(err.message||'Não foi possível atualizar este recurso agora.')}
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')fecharMenuVagaEM()});


/* EMPREGAMAIS-EDITAR-VAGA-FIX-V2 */
function editarVaga(id){
 if(papelAtual()!=='empresa'){irPara('login-empresa');return}
 const fonte=sbVagasCacheEM.length?sbVagasCacheEM:ler('empregaMaisVagas');
 const vaga=fonte.find(v=>String(v.id)===String(id))||vagasDaEmpresa().find(v=>String(v.id)===String(id));
 if(!vaga){alert('Não foi possível localizar esta vaga para edição.');return}
 sessionStorage.setItem('vagaEdicao',String(vaga.id));
 irPara('publicar');
 setTimeout(()=>{
   const set=(id,val)=>{const el=document.getElementById(id);if(el&&val!==undefined&&val!==null)el.value=val};
   set('empresaVaga',vaga.empresa||sessionStorage.getItem('empresaNome')||'');
   set('cargoVaga',vaga.cargo||'');
   set('areaVaga',vaga.area||'');
   set('contratoVaga',vaga.contrato||vaga.tipoContrato||'');
   set('modalidadeVaga',vaga.modalidade||'');
   set('quantidadeVagas',vaga.quantidadeContratacoes||vaga.quantidadeVagas||'1');
   set('cepVaga',vaga.cep||'');
   set('estadoVaga',vaga.estado||vaga.uf||'');
   set('cidadeVaga',vaga.cidade||'');
   set('dataEncerramentoVaga',vaga.dataEncerramento?String(vaga.dataEncerramento).slice(0,10):'');
   set('escolaridadeVaga',vaga.escolaridade||'');
   set('experienciaVaga',vaga.experiencia||'');
   set('jornadaVaga',vaga.jornada||'');
   set('pcdVaga',vaga.pcd||'');
   set('salarioVaga',vaga.salario||'');
   set('descricaoVaga',vaga.descricao||'');
   set('requisitosVaga',vaga.requisitos||'');
   set('beneficiosVaga',vaga.beneficiosOutros||'');
   set('sobreEmpresaVaga',vaga.sobreEmpresa||'');
   const checks=[
     ['senior50Vaga',!!vaga.senior50],
     ['vagaConfidencial',!!vaga.confidencial],
     ['vagaDestaque',!!vaga.destaque],
     ['vagaUrgente',!!vaga.urgente]
   ];
   checks.forEach(([eid,val])=>{const el=document.getElementById(eid);if(el)el.checked=val});
   const sc=document.getElementById('salarioCombinarVaga');
   if(sc)sc.checked=!!vaga.salarioCombinar||String(vaga.salario||'').toLowerCase().includes('combinar');
   if(typeof configurarSalarioVaga==='function')configurarSalarioVaga();
   if(typeof aplicarBeneficiosVaga==='function')aplicarBeneficiosVaga(vaga);
   if(typeof atualizarOpcoesPlano==='function')atualizarOpcoesPlano();
   if(typeof montarRevisao==='function')montarRevisao();
   if(typeof mostrarEtapa==='function')mostrarEtapa(1);
 },120);
}

/* EMPREGAMAIS — ANDAMENTO DO CANDIDATO PRO V3
   Modal ampliado em página única + timeline completa + análise detalhada de aderência.
*/
(function(){
 const STYLE_ID='em-andamento-pro-v3-style';
 if(!document.getElementById(STYLE_ID)){
  const s=document.createElement('style');s.id=STYLE_ID;s.textContent=String.raw`
body.recruta-modal-aberto{overflow:hidden!important}
.recruta-andamento-modal-em{position:fixed!important;inset:0!important;z-index:99999!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:20px!important}
.recruta-andamento-modal-em .recruta-andamento-modal-backdrop{position:absolute!important;inset:0!important;background:rgba(9,31,48,.58)!important;backdrop-filter:blur(5px)!important}
.recruta-andamento-modal-em .recruta-andamento-modal-dialog{position:relative!important;width:min(1180px,calc(100vw - 28px))!important;max-height:calc(100vh - 28px)!important;overflow:hidden!important;background:#f7fafc!important;border:1px solid #cbdce7!important;border-radius:22px!important;box-shadow:0 28px 80px rgba(8,35,55,.28)!important;display:flex!important;flex-direction:column!important;color:#163d58!important}
.recruta-andamento-modal-em .recruta-andamento-modal-dialog>header{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;padding:22px 28px!important;background:#fff!important;border-bottom:1px solid #dce7ee!important}
.recruta-andamento-modal-em header small{display:block!important;color:#087b88!important;font-size:10px!important;font-weight:800!important;letter-spacing:.12em!important;margin-bottom:5px!important}
.recruta-andamento-modal-em header h3{margin:0!important;color:#123d59!important;font-size:25px!important;line-height:1.15!important;font-weight:700!important}
.recruta-andamento-modal-em header p{margin:6px 0 0!important;color:#708497!important;font-size:12px!important}
.recruta-andamento-modal-em header p b{color:#08785f!important;font-weight:700!important}
.recruta-andamento-modal-em header>button{width:40px!important;height:40px!important;flex:0 0 40px!important;border:1px solid #cbdde8!important;border-radius:11px!important;background:#fff!important;color:#355b72!important;font-size:22px!important;cursor:pointer!important}
.recruta-andamento-modal-em .recruta-andamento-modal-body{overflow:auto!important;padding:22px 26px 26px!important}
.recruta-andamento-modal-em .em-modal-pro-shell{display:grid!important;gap:18px!important}
.recruta-andamento-modal-em .em-modal-section{background:#fff!important;border:1px solid #d3e1e9!important;border-radius:16px!important;overflow:hidden!important}
.recruta-andamento-modal-em .em-modal-section-head{padding:15px 18px!important;border-bottom:1px solid #e4edf2!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important}
.recruta-andamento-modal-em .em-modal-section-head small{margin:0!important;color:#718799!important;font-size:9px!important;letter-spacing:.1em!important;font-weight:800!important}
.recruta-andamento-modal-em .em-modal-section-head strong{color:#173f5b!important;font-size:15px!important;font-weight:700!important}
.recruta-andamento-modal-em .em-modal-timeline{padding:24px 20px 18px!important;display:grid!important;grid-template-columns:repeat(7,minmax(90px,1fr))!important;gap:0!important;position:relative!important}
.recruta-andamento-modal-em .em-modal-timeline:before{content:"";position:absolute!important;left:7.2%!important;right:7.2%!important;top:45px!important;height:2px!important;background:#dbe6ec!important}
.recruta-andamento-modal-em .em-tl-item{position:relative!important;z-index:1!important;text-align:center!important;min-width:0!important}
.recruta-andamento-modal-em .em-tl-dot{width:38px!important;height:38px!important;margin:0 auto 9px!important;border-radius:50%!important;border:3px solid #d1e0e8!important;background:#fff!important;display:grid!important;place-items:center!important;color:#7390a0!important;font-size:12px!important;font-weight:700!important}
.recruta-andamento-modal-em .em-tl-item.feito .em-tl-dot{background:#e8f7f1!important;border-color:#20a276!important;color:#147b5d!important}
.recruta-andamento-modal-em .em-tl-item.atual .em-tl-dot{background:#087f8e!important;border-color:#087f8e!important;color:#fff!important;box-shadow:0 0 0 6px rgba(8,127,142,.10)!important}
.recruta-andamento-modal-em .em-tl-item.atual .em-tl-label{color:#08765f!important;font-weight:800!important}
.recruta-andamento-modal-em .em-tl-label{display:block!important;color:#45657a!important;font-size:11px!important;line-height:1.25!important;font-weight:600!important}
.recruta-andamento-modal-em .em-tl-date{display:block!important;color:#8aa0ae!important;font-size:9px!important;margin-top:5px!important}
.recruta-andamento-modal-em .em-tl-date.vazio{color:#aebbc4!important}
.recruta-andamento-modal-em .em-overview-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:12px!important;padding:16px 18px!important}
.recruta-andamento-modal-em .em-overview-card{min-height:105px!important;border:1px solid #bcd7ee!important;border-radius:13px!important;background:#f4f9fd!important;padding:16px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;text-align:center!important}
.recruta-andamento-modal-em .em-overview-card span{color:#5f788b!important;font-size:10px!important;margin-bottom:7px!important}
.recruta-andamento-modal-em .em-overview-card strong{color:#103f5e!important;font-size:18px!important;font-weight:700!important}
.recruta-andamento-modal-em .em-overview-card small{color:#7890a0!important;font-size:9px!important;margin-top:5px!important}
.recruta-andamento-modal-em .em-adherence-wrap{padding:18px!important;display:grid!important;grid-template-columns:210px minmax(0,1fr)!important;gap:20px!important;align-items:stretch!important}
.recruta-andamento-modal-em .em-adherence-score{border:1px solid #bcd7ee!important;border-radius:15px!important;background:#f5faff!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:13px!important;padding:18px!important}
.recruta-andamento-modal-em .em-adherence-ring{width:82px!important;height:82px!important;border-radius:50%!important;display:grid!important;place-items:center!important;position:relative!important;background:conic-gradient(#078b8f calc(var(--pct)*1%),#dfe8ed 0)!important}
.recruta-andamento-modal-em .em-adherence-ring:after{content:"";position:absolute!important;width:62px!important;height:62px!important;border-radius:50%!important;background:#fff!important}
.recruta-andamento-modal-em .em-adherence-ring b{position:relative!important;z-index:1!important;color:#123f5d!important;font-size:18px!important}
.recruta-andamento-modal-em .em-adherence-score-text strong{display:block!important;color:#0d5476!important;font-size:14px!important}
.recruta-andamento-modal-em .em-adherence-score-text small{display:block!important;color:#6e8493!important;font-size:10px!important;margin-top:4px!important}
.recruta-andamento-modal-em .em-adherence-copy{border:1px solid #d3e1e9!important;border-radius:15px!important;padding:16px 18px!important;background:#fff!important}
.recruta-andamento-modal-em .em-adherence-copy h4{margin:0 0 6px!important;color:#173f5b!important;font-size:14px!important}
.recruta-andamento-modal-em .em-adherence-copy p{margin:0 0 13px!important;color:#647b8d!important;font-size:11px!important;line-height:1.55!important}
.recruta-andamento-modal-em .em-adherence-meter{height:8px!important;border-radius:999px!important;background:#e5edf1!important;overflow:hidden!important}
.recruta-andamento-modal-em .em-adherence-meter i{display:block!important;height:100%!important;border-radius:999px!important;background:linear-gradient(90deg,#07818b,#21a463)!important}
.recruta-andamento-modal-em .em-analysis-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;padding:16px 18px 18px!important}
.recruta-andamento-modal-em .em-analysis-item{border:1px solid #d7e4eb!important;border-radius:12px!important;background:#fbfdfe!important;padding:12px 13px!important;display:grid!important;grid-template-columns:27px 1fr auto!important;gap:10px!important;align-items:start!important}
.recruta-andamento-modal-em .em-analysis-item>i{width:27px!important;height:27px!important;border-radius:8px!important;display:grid!important;place-items:center!important;background:#edf4f8!important;color:#517188!important;font-style:normal!important;font-weight:800!important}
.recruta-andamento-modal-em .em-analysis-item.sim>i{background:#e6f7ef!important;color:#16835f!important}
.recruta-andamento-modal-em .em-analysis-item.parcial>i{background:#fff5df!important;color:#b37b15!important}
.recruta-andamento-modal-em .em-analysis-item.nao>i{background:#fff0f0!important;color:#bd5157!important}
.recruta-andamento-modal-em .em-analysis-item>div b{display:block!important;color:#244a63!important;font-size:11px!important;font-weight:700!important}
.recruta-andamento-modal-em .em-analysis-item>div small{display:block!important;color:#748b9a!important;font-size:9.5px!important;line-height:1.4!important;margin-top:3px!important}
.recruta-andamento-modal-em .em-analysis-status{font-size:9px!important;font-weight:800!important;white-space:nowrap!important;padding:4px 7px!important;border-radius:999px!important;background:#eef4f7!important;color:#627b8b!important}
.recruta-andamento-modal-em .sim .em-analysis-status{background:#e7f7ef!important;color:#177a5d!important}
.recruta-andamento-modal-em .parcial .em-analysis-status{background:#fff5e2!important;color:#9c701c!important}
.recruta-andamento-modal-em .nao .em-analysis-status{background:#fff0f0!important;color:#b34c53!important}
.recruta-andamento-modal-em .em-modal-actions{display:flex!important;flex-wrap:wrap!important;gap:9px!important;padding:14px 18px 18px!important;border-top:1px solid #e4edf2!important;background:#fbfdfe!important}
.recruta-andamento-modal-em .em-modal-actions .btn{min-height:43px!important;padding:0 16px!important;border-radius:10px!important;font-size:11px!important;font-weight:600!important;border:1px solid #c8dbe7!important;background:#fff!important;color:#244b64!important;cursor:pointer!important}
.recruta-andamento-modal-em .em-modal-actions .btn-azul{background:#078f9d!important;border-color:#078f9d!important;color:#fff!important}
.recruta-andamento-modal-em .em-modal-actions .recruta-whatsapp{background:#16ae68!important;border-color:#16ae68!important;color:#fff!important}
.recruta-andamento-modal-em .em-modal-actions .btn-chat-em{background:#edf8f8!important;border-color:#c9e4e5!important;color:#08747d!important}
.recruta-andamento-modal-em .em-modal-status{padding:12px 18px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:15px!important;border-top:1px solid #e4edf2!important}
.recruta-andamento-modal-em .em-modal-status span{font-size:10px!important;color:#6c8494!important;text-transform:uppercase!important;letter-spacing:.08em!important;font-weight:800!important}
.recruta-andamento-modal-em .em-modal-status b{padding:7px 12px!important;border-radius:999px!important;background:#e8f7ef!important;color:#14795b!important;font-size:10px!important}
.recruta-andamento-modal-em .em-modal-note{margin:0 18px 18px!important;padding:11px 13px!important;border-radius:10px!important;background:#f2f7fa!important;color:#708696!important;font-size:10px!important;line-height:1.5!important}
@media(max-width:850px){
 .recruta-andamento-modal-em{padding:10px!important}
 .recruta-andamento-modal-em .recruta-andamento-modal-dialog{width:calc(100vw - 14px)!important;max-height:calc(100vh - 14px)!important;border-radius:16px!important}
 .recruta-andamento-modal-em .recruta-andamento-modal-dialog>header{padding:17px!important}
 .recruta-andamento-modal-em .recruta-andamento-modal-body{padding:13px!important}
 .recruta-andamento-modal-em .em-modal-timeline{grid-template-columns:repeat(4,minmax(70px,1fr))!important;row-gap:18px!important}
 .recruta-andamento-modal-em .em-modal-timeline:before{display:none!important}
 .recruta-andamento-modal-em .em-overview-grid,.recruta-andamento-modal-em .em-adherence-wrap,.recruta-andamento-modal-em .em-analysis-grid{grid-template-columns:1fr!important}
}
`;document.head.appendChild(s)
 }
 function etapaInfo(c){
  const steps=[
   {label:'Candidatura enviada',keys:['Candidatura enviada']},
   {label:'Em avaliação',keys:['Em avaliação']},
   {label:'Selecionado',keys:['Selecionado']},
   {label:'Em contato',keys:['Em contato']},
   {label:'Entrevista',keys:['Entrevista agendada','Entrevista']},
   {label:'Aprovado',keys:['Aprovado']},
   {label:'Contratado',keys:['Contratado']}
  ];
  const hist=Array.isArray(c?.historico)?c.historico:[];
  const status=String(c?.status||'Em avaliação');
  const cur=status==='Reprovado'?-1:(status==='Entrevista agendada'?4:steps.findIndex((x,i)=>x.keys.includes(status)));
  return steps.map((x,i)=>{
   const h=hist.find(z=>x.keys.includes(z?.status));
   const feito=cur>i||(cur===6&&i===6);
   const atual=cur===i;
   return {label:x.label,data:h?.data||'',feito,atual};
  })
 }
 function acharCandidatura(btn){
  const card=btn?.closest('.recruta-cand-card');if(!card)return null;
  const nome=card.querySelector('.recruta-cand-head h3')?.textContent?.trim()||'';
  const meta=card.querySelector('.recruta-cand-meta')?.textContent||'';
  const data=(meta.match(/(\d{2}\/\d{2}\/\d{4})/)||[])[1]||'';
  const local=(card.querySelector('.recruta-cand-ident p')?.textContent||'').split('·')[0].trim();
  const vagas=vagasDaEmpresa();
  let arr=candidaturas().filter(c=>String(c.candidato||c.nome||'').trim().split(/\s+/).slice(0,2).join(' ')===nome);
  if(local)arr=arr.filter(c=>{const v=vagas.find(x=>x.id===c.vagaId)||{};return String(c.curriculo?.cidade||c.perfilProfissional?.cidade||'').trim()===local||String(v.modalidade||'').trim()===local});
  if(data)arr=arr.filter(c=>c.criadoEm&&new Date(c.criadoEm).toLocaleDateString('pt-BR')===data);
  return arr[0]||null
 }
 function statusRotulo(s){return s==='Reprovado'?'Não selecionado':s==='Entrevista agendada'?'Entrevista':s||'Em avaliação'}
 function dataBr(d){return d?new Date(d).toLocaleDateString('pt-BR'):'—'}
 function montarAnalise(c,v){
  let a=null;try{a=analisarAderenciaDetalhadaEM(c,v)}catch(e){}
  if(!a){
   const p=Number(c?.aderencia||0);a={percentual:p,itens:[],fonte:c?.curriculoOrigem||'perfil'}
  }
  const pct=Math.max(0,Math.min(100,Number(a.percentual)||0));
  const nivel=pct>=80?'Alta aderência':pct>=60?'Boa aderência':pct>=40?'Aderência moderada':'Baixa aderência';
  const fonte=a.fonte==='online'?'Currículo online':a.fonte==='cadastrado'?'Currículo anexado':'Perfil profissional';
  const itens=Array.isArray(a.itens)?a.itens:[];
  const total=itens.length,ok=itens.filter(x=>x.status==='sim').length,par=itens.filter(x=>x.status==='parcial').length;
  const intro=total?('Foram comparados '+total+' critérios do currículo com os dados cadastrados nesta vaga. '+ok+' apresentam correspondência direta'+(par?' e '+par+' correspondência parcial.':'.')):'A aderência foi calculada com os dados profissionais disponíveis no momento da candidatura.';
  const lista=itens.map(x=>{
   const st=x.status==='sim'?'Correspondente':x.status==='parcial'?'Parcial':'Não identificado';
   const ic=x.status==='sim'?'✓':x.status==='parcial'?'~':'×';
   return '<div class="em-analysis-item '+esc(x.status||'nao')+'"><i>'+ic+'</i><div><b>'+esc(x.nome||'Critério analisado')+'</b><small>'+esc(x.det||'Comparação realizada com os dados disponíveis.')+'</small></div><span class="em-analysis-status">'+st+'</span></div>'
  }).join('');
  return {pct,nivel,fonte,intro,lista,total}
 }
 function montarAcoes(c){
  return '<div class="em-modal-actions">'+
   '<button type="button" class="btn btn-azul" onclick="abrirFichaCandidato(\''+esc(c.id)+'\')"><i class="em-btn-ico em-ico-doc"></i>Ver currículo</button>'+
   '<button type="button" class="btn" onclick="abrirFichaCandidato(\''+esc(c.id)+'\')"><i class="em-btn-ico em-ico-user"></i>Ver perfil</button>'+
   (c.telefone?'<button type="button" class="btn recruta-whatsapp" onclick="contatarWhats(\''+esc(c.id)+'\')"><i class="em-btn-ico em-ico-whatsapp"></i>WhatsApp</button>':'')+
   (c.email?'<a class="btn" href="mailto:'+esc(c.email)+'"><i class="em-btn-ico em-ico-mail"></i>E-mail</a>':'')+
   '<button type="button" class="btn" onclick="abrirEntrevista(\''+esc(c.id)+'\')"><i class="em-btn-ico em-ico-calendar"></i>Agendar entrevista</button>'+
   '</div>'
 }
 window.alternarAndamentoRecrutadorEM=function(btn){
  const c=acharCandidatura(btn);if(!c)return;
  const v=vagasDaEmpresa().find(x=>String(x.id)===String(c.vagaId))||{};
  document.querySelector('.recruta-andamento-modal-em')?.remove();
  const nome=String(c.candidato||c.nome||'Candidato').trim();
  const etapas=etapaInfo(c),analise=montarAnalise(c,v);
  const modal=document.createElement('div');modal.className='recruta-andamento-modal-em';
  const tl=etapas.map((x,i)=>'<div class="em-tl-item '+(x.feito?'feito ':'')+(x.atual?'atual':'')+'"><div class="em-tl-dot">'+(x.feito?'✓':(i+1))+'</div><span class="em-tl-label">'+esc(x.label)+'</span><small class="em-tl-date '+(!x.data?'vazio':'')+'">'+dataBr(x.data)+'</small></div>').join('');
  const local=[c.curriculo?.cidade||c.perfilProfissional?.cidade,v.estado||v.uf].filter(Boolean).join(' - ');
  const curr=c.curriculoOrigem==='online'?'Currículo online':c.curriculo?.nome?'Currículo anexado':'Perfil + Empregos';
  const ultimo=dataBr(c.atualizadoEm||c.criadoEm);
  modal.innerHTML='<div class="recruta-andamento-modal-backdrop" data-fechar></div>'+
   '<section class="recruta-andamento-modal-dialog" role="dialog" aria-modal="true" aria-label="Andamento do candidato">'+
    '<header><div><small>PROCESSO SELETIVO</small><h3>Andamento do candidato</h3><p>'+esc(nome)+' <span>·</span> Etapa atual: <b>'+esc(statusRotulo(c.status))+'</b></p></div><button type="button" aria-label="Fechar" data-fechar>×</button></header>'+
    '<div class="recruta-andamento-modal-body"><div class="em-modal-pro-shell">'+
     '<section class="em-modal-section"><div class="em-modal-section-head"><div><small>LINHA DO TEMPO</small><strong>Evolução da candidatura</strong></div><span class="em-analysis-status">'+esc(statusRotulo(c.status))+'</span></div><div class="em-modal-timeline">'+tl+'</div>'+(c.status==='Reprovado'?'<p class="em-modal-note">Este processo foi encerrado como <b>não selecionado</b>. A linha do tempo preserva o histórico registrado pela empresa.</p>':'')+'</section>'+
     '<section class="em-modal-section"><div class="em-modal-section-head"><div><small>RESUMO DA CANDIDATURA</small><strong>Dados principais</strong></div></div><div class="em-overview-grid">'+
      '<div class="em-overview-card"><span>Currículo enviado</span><strong>'+esc(curr)+'</strong><small>Fonte utilizada na candidatura</small></div>'+
      '<div class="em-overview-card"><span>Localidade</span><strong>'+esc(local||'Não informada')+'</strong><small>Informação disponível no currículo</small></div>'+
      '<div class="em-overview-card"><span>Última atualização</span><strong>'+ultimo+'</strong><small>Última movimentação registrada</small></div>'+
     '</div></section>'+
     '<section class="em-modal-section"><div class="em-modal-section-head"><div><small>ANÁLISE DE ADERÊNCIA</small><strong>Por que este percentual foi calculado?</strong></div><span class="em-analysis-status">'+esc(analise.nivel)+'</span></div>'+
      '<div class="em-adherence-wrap"><div class="em-adherence-score"><div class="em-adherence-ring" style="--pct:'+analise.pct+'"><b>'+analise.pct+'%</b></div><div class="em-adherence-score-text"><strong>'+esc(analise.nivel)+'</strong><small>Índice de compatibilidade</small></div></div><div class="em-adherence-copy"><h4>Como chegamos a '+analise.pct+'%</h4><p>'+esc(analise.intro)+' Fonte considerada: <b>'+esc(analise.fonte)+'</b>. A pontuação é uma referência técnica e não substitui a avaliação do recrutador.</p><div class="em-adherence-meter"><i style="width:'+analise.pct+'%"></i></div></div></div>'+
      (analise.lista?'<div class="em-analysis-grid">'+analise.lista+'</div>':'<p class="em-modal-note">Não há critérios detalhados suficientes para exibir a decomposição desta aderência.</p>')+
     '</section>'+
     montarAcoes(c)+
     '<section class="em-modal-section em-modal-mensagens"><div class="em-modal-section-head"><div><small>COMUNICAÇÃO</small><strong>Mensagens do processo seletivo</strong></div></div>'+renderChatCandidaturaEM(c,'empresa')+'</section>'+
    '</div></div></section>';
  document.body.appendChild(modal);document.body.classList.add('recruta-modal-aberto');
  const fechar=()=>{modal.remove();document.body.classList.remove('recruta-modal-aberto');};
  modal.querySelectorAll('[data-fechar]').forEach(x=>x.addEventListener('click',fechar));
  const escFechar=e=>{if(e.key==='Escape'){fechar();document.removeEventListener('keydown',escFechar)}};
  document.addEventListener('keydown',escFechar);
  setTimeout(()=>modal.querySelector('.recruta-andamento-modal-body')?.scrollTo({top:0,behavior:'instant'}),0);
 };
})();


/* EMPREGAMAIS — RECUPERAÇÃO DE VAGAS E AÇÕES V8 */
(function(){
  const carregarVagasSeguro = async function(){
    const locais = Array.isArray(ler('empregaMaisVagas')) ? ler('empregaMaisVagas') : [];
    const mapa = new Map();
    locais.forEach(v=>{if(v?.id) mapa.set(String(v.id),v)});
    const req=[sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&status=eq.aprovada&order=criado_em.desc',{method:'GET',headers:sbHeadersEM()}).catch(()=>[])];
    const token=sbTokenEM();
    if(token) req.push(sbUsuarioAtualEM().then(u=>{
      if(u?.id) sessionStorage.setItem('empresaSupabaseUserId',u.id);
      return sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&user_id=eq.'+encodeURIComponent(u.id)+'&order=criado_em.desc',{method:'GET',headers:sbHeadersEM(token)});
    }).catch(()=>[]));
    const respostas=await Promise.all(req);
    respostas.flat().forEach(v=>{
      if(!v?.id)return;
      const remoto=('data_encerramento' in v)||('criado_em' in v)||('empresa_id' in v)||('candidatura_tipo' in v);
      mapa.set(String(v.id),remoto?sbMapVagaEM(v):v);
    });
    const consolidado=[...mapa.values()].filter(Boolean);
    sbVagasCacheEM=consolidado;
    try{
      const leves=consolidado.map(v=>{
        if(!v||typeof v!=='object')return v;
        const x={...v};
        if(typeof x.logo==='string'&&x.logo.startsWith('data:image/'))x.logo='';
        if(typeof x.logoUrl==='string'&&x.logoUrl.startsWith('data:image/'))x.logoUrl='';
        if(typeof x.empresaLogo==='string'&&x.empresaLogo.startsWith('data:image/'))x.empresaLogo='';
        return x;
      });
      localStorage.setItem('empregaMaisVagas',JSON.stringify(leves));
    }catch(e){
      console.warn('+ Empregos: cache local de vagas indisponível; usando memória.',e);
    }
    return consolidado;
  };
  window.sbCarregarVagasEM=carregarVagasSeguro;
  sbCarregarVagasEM=carregarVagasSeguro;

  async function carregarEmpresaSeguro(){
    const locais=Array.isArray(ler('empregaMaisVagas'))?ler('empregaMaisVagas'):[];
    const cnpj=nums(sessionStorage.getItem('empresaCnpj')||'');
    let uid=String(sessionStorage.getItem('empresaSupabaseUserId')||''),remotas=[];
    try{
      const token=await sbGarantirSessaoEM();
      if(token){
        const u=await sbUsuarioAtualEM();
        uid=String(u?.id||uid);
        if(uid)sessionStorage.setItem('empresaSupabaseUserId',uid);
        const a=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&user_id=eq.'+encodeURIComponent(uid)+'&order=criado_em.desc',{method:'GET',headers:sbHeadersEM(token)});
        remotas=Array.isArray(a)?a.map(sbMapVagaEM).filter(Boolean):[];
      }
    }catch(e){console.warn('+ Empregos: usando vagas locais.',e)}
    const empresaMap=new Map();
    locais.forEach(v=>{
      if(!v?.id)return;
      const vc=nums(v.empresaCnpj||v.cnpj||''),vu=String(v.userId||v.user_id||'');
      if((uid&&vu===uid)||(cnpj&&vc===cnpj))empresaMap.set(String(v.id),v);
    });
    remotas.forEach(v=>empresaMap.set(String(v.id),v));
    const geral=new Map((Array.isArray(sbVagasCacheEM)?sbVagasCacheEM:[]).filter(v=>v?.id).map(v=>[String(v.id),v]));
    locais.forEach(v=>{if(v?.id)geral.set(String(v.id),v)});
    remotas.forEach(v=>{if(v?.id)geral.set(String(v.id),v)});
    sbVagasCacheEM=[...geral.values()];
    gravar('empregaMaisVagas',sbVagasCacheEM);
    return [...empresaMap.values()];
  }
  window.sbCarregarVagasEmpresaAtualEM=carregarEmpresaSeguro;
  sbCarregarVagasEmpresaAtualEM=carregarEmpresaSeguro;

  window.vagasDaEmpresa=function(){
    const locais=Array.isArray(ler('empregaMaisVagas'))?ler('empregaMaisVagas'):[];
    const cache=Array.isArray(sbVagasCacheEM)?sbVagasCacheEM:[];
    const uid=String(sessionStorage.getItem('empresaSupabaseUserId')||''),cnpj=nums(sessionStorage.getItem('empresaCnpj')||''),mapa=new Map();
    [...locais,...cache].forEach(v=>{if(v?.id)mapa.set(String(v.id),v)});
    return [...mapa.values()].filter(v=>{
      const vc=nums(v.empresaCnpj||v.cnpj||''),vu=String(v.userId||v.user_id||'');
      return (uid&&vu===uid)||(cnpj&&vc===cnpj);
    });
  };
  vagasDaEmpresa=window.vagasDaEmpresa;

  window.vagasPublicas=function(){
    const locais=Array.isArray(ler('empregaMaisVagas'))?ler('empregaMaisVagas'):[];
    const cache=Array.isArray(sbVagasCacheEM)?sbVagasCacheEM:[],mapa=new Map();
    [...locais,...cache].forEach(v=>{if(v?.id)mapa.set(String(v.id),v)});
    return [...mapa.values()].filter(v=>v.status==='aprovada'&&vagaDentroPrazo(v));
  };
  vagasPublicas=window.vagasPublicas;

  let homeVagasCargaEM=null;
  const renderPortalSeguro=function(){
    const box=$('#listaVagasPortal');if(!box)return Promise.resolve([]);
    const desenhar=()=>{try{_renderizarVagasPortalLocalEM()}catch(e){console.error('+ Empregos: erro ao renderizar vagas.',e)}};
    /* HOME: desenha o cache imediatamente e mantém uma única sincronização em voo.
       Chamadas concorrentes reutilizam a mesma Promise e não provocam uma sequência
       de redesenhos com conjuntos diferentes de vagas. */
    if(Array.isArray(sbVagasCacheEM)&&sbVagasCacheEM.length)desenhar();
    if(homeVagasCargaEM)return homeVagasCargaEM;
    homeVagasCargaEM=carregarVagasSeguro()
      .then(vs=>{desenhar();return vs})
      .catch(e=>{console.warn('+ Empregos: não foi possível atualizar as vagas do banco.',e);desenhar();return []})
      .finally(()=>{homeVagasCargaEM=null});
    return homeVagasCargaEM;
  };
  window.renderizarVagasPortal=renderPortalSeguro;
  renderizarVagasPortal=renderPortalSeguro;

  window.recarregarVagasEmpresaSeguroEM=async function(){
    await carregarEmpresaSeguro().catch(e=>console.warn('+ Empregos: sincronização de vagas falhou.',e));
    try{renderizarPainelEmpresa()}catch(e){console.error(e)}
  };

  document.addEventListener('DOMContentLoaded',()=>{
    setTimeout(()=>{
      carregarVagasSeguro().then(()=>{
        try{
          if(papelAtual()==='empresa')renderizarPainelEmpresa();
          else renderizarVagasPortal();
        }catch(e){console.error(e)}
      }).catch(()=>{});
    },350);
  });
})();

function prepararCardsRecentesEM(){
 const box=document.getElementById('listaVagasPortal');if(!box)return;
 box.querySelectorAll('.portal-vaga-nova').forEach(card=>{
   const inline=card.getAttribute('onclick')||'',m=inline.match(/abrirVaga\('([^']+)'\)/);
   if(!m)return;
   card.dataset.vagaId=m[1];
   card.setAttribute('role','button');
   card.setAttribute('tabindex','0');
 });
}
const _renderizarVagasPortalSplitEM=renderizarVagasPortal;
renderizarVagasPortal=function(){
 const resultado=_renderizarVagasPortalSplitEM();
 const finalizar=()=>{prepararCardsRecentesEM();sincronizarFiltrosRecentesEM()};
 if(resultado&&typeof resultado.then==='function')resultado.then(finalizar).catch(()=>finalizar());
 else finalizar();
 return resultado;
};

function renderPaginacaoVagasPortalEM(total,totalPaginas){
 const box=document.getElementById('paginacaoVagasPortal');if(!box)return;
 if(total<=10){box.innerHTML='';return}
 const atual=Number(window.paginaVagasPortalEM||1),numsPag=[];for(let p=1;p<=totalPaginas;p++){if(p===1||p===totalPaginas||Math.abs(p-atual)<=1)numsPag.push(p)}
 let html='<button type="button" '+(atual<=1?'disabled':'')+' onclick="irPaginaVagasPortalEM('+(atual-1)+')">← Anterior</button>',ultimo=0;
 numsPag.forEach(p=>{if(ultimo&&p-ultimo>1)html+='<span class="pag-reticencias">…</span>';html+='<button type="button" class="'+(p===atual?'ativo':'')+'" onclick="irPaginaVagasPortalEM('+p+')">'+p+'</button>';ultimo=p});
 html+='<button type="button" '+(atual>=totalPaginas?'disabled':'')+' onclick="irPaginaVagasPortalEM('+(atual+1)+')">Próxima →</button>';box.innerHTML=html;
}
function irPaginaVagasPortalEM(p){window.paginaVagasPortalEM=Math.max(1,Number(p)||1);renderizarVagasPortal();setTimeout(()=>document.querySelector('.home-recentes-cab')?.scrollIntoView({behavior:'smooth',block:'start'}),30)}
function resetPaginaVagasPortalEM(){window.paginaVagasPortalEM=1}
function filtrarRecentesLateralEM(id,valor){
 const campo=document.getElementById(id);
 if(campo){campo.value=valor;resetPaginaVagasPortalEM();renderizarVagasPortal()}
}
function sincronizarFiltrosRecentesEM(){
 [['filtroPalavraLateral','buscaVagas'],['filtroCidadeLateral','buscaCidade'],['filtroModalidadeLateral','buscaModalidade']].forEach(([lateral,original])=>{
  const a=document.getElementById(lateral),b=document.getElementById(original);
  if(a&&b)a.value=b.value;
 });
 [['modalidadeRecenteEM','buscaModalidade'],['contratoRecenteEM','filtroContrato']].forEach(([name,id])=>{
  const atual=document.getElementById(id)?.value||'';
  document.querySelectorAll('input[name="'+name+'"]').forEach(radio=>{radio.checked=radio.value===atual});
 });
 const contrato=document.querySelector('input[name="contratoRecenteEM"]:checked');
 const outros=contrato?.closest('.recentes-mais-tipos');if(outros)outros.open=true;
 atualizarContadorFiltrosRecentesEM();
}
function atualizarContadorFiltrosRecentesEM(){
 const ids=['buscaVagas','buscaCidade','buscaModalidade','filtroContrato','filtroArea','filtroSalario'];
 const quantidade=ids.filter(id=>!!document.getElementById(id)?.value).length;
 const contador=document.getElementById('filtrosContadorEM');
 if(contador){contador.textContent=String(quantidade);contador.setAttribute('aria-label',quantidade+' filtros selecionados')}
}
function alternarFiltrosRecentesEM(botao){
 const painel=document.getElementById('filtrosVagasLateral');if(!painel)return;
 const aberto=painel.classList.toggle('aberto');
 botao.setAttribute('aria-expanded',String(aberto));
}
document.addEventListener('DOMContentLoaded',()=>{
 ['buscaVagas','buscaCidade','buscaModalidade'].forEach(id=>{
  document.getElementById(id)?.addEventListener('input',sincronizarFiltrosRecentesEM);
  document.getElementById(id)?.addEventListener('change',sincronizarFiltrosRecentesEM);
 });
setTimeout(solicitarLocalizacaoCandidatoEM,700);

 sincronizarFiltrosRecentesEM();
});

/* EMPREGAMAIS — AVALIAÇÕES NO PAINEL DA EMPRESA V1 */
function avaliacoesEmpresaLogadaEM(){
 const emp=empresaLogada(),cnpj=nums(emp?.cnpj||sessionStorage.getItem('empresaCnpj')||''),nome=String(emp?.nome||sessionStorage.getItem('empresaNome')||'').trim().toLowerCase();
 return ler('empregaMaisAvaliacoesProcessos',[]).filter(a=>{
   const ac=nums(a.empresaCnpj||a.cnpj||''),an=String(a.empresa||a.empresaNome||'').trim().toLowerCase();
   return (cnpj&&ac===cnpj)||(!ac&&nome&&an===nome);
 });
}
function atualizarBadgeAvaliacoesEmpresaEM(){
 const el=document.getElementById('empresaSideAvaliacoes');if(!el)return;
 const n=avaliacoesEmpresaLogadaEM().length;el.textContent=n?String(n):'';
}
function abrirAvaliacoesEmpresaEM(){
 const modal=document.getElementById('modalAvaliacoesEmpresaEM'),box=document.getElementById('conteudoAvaliacoesEmpresaEM');if(!modal||!box)return;
 const a=avaliacoesEmpresaLogadaEM();
 if(!a.length){box.innerHTML='<div class="emp-av-head"><span>REPUTAÇÃO DA EMPRESA</span><h2>Avaliações dos processos seletivos</h2><p>Acompanhe a experiência dos candidatos que participaram dos seus processos.</p></div><div class="emp-av-vazio"><strong>Nenhuma avaliação recebida</strong><span>Quando candidatos elegíveis avaliarem seus processos seletivos, as avaliações aparecerão aqui.</span></div>';modal.classList.remove('oculto');return}
 const campos=['notaGeral','comunicacao','clareza','agilidade','experiencia'];
 const media=campo=>{const vs=a.map(x=>Number(x[campo]||x.notas?.[campo]||0)).filter(Boolean);return vs.length?vs.reduce((s,n)=>s+n,0)/vs.length:0};
 const geral=media('notaGeral')||a.reduce((s,x)=>s+Number(x.nota||0),0)/a.length;
 const stars=n=>'★'.repeat(Math.max(0,Math.min(5,Math.round(n))))+'☆'.repeat(Math.max(0,5-Math.round(n)));
 box.innerHTML='<div class="emp-av-head"><span>REPUTAÇÃO DA EMPRESA</span><h2>Avaliações dos processos seletivos</h2><p>Feedback dos candidatos sobre a experiência de recrutamento da sua empresa.</p></div><div class="emp-av-resumo"><div class="emp-av-nota"><strong>'+geral.toFixed(1).replace('.',',')+'</strong><b>'+stars(geral)+'</b><small>'+a.length+' avaliação'+(a.length===1?'':'ões')+'</small></div><div class="emp-av-criterios"><div><span>Comunicação</span><b>'+media('comunicacao').toFixed(1).replace('.',',')+'</b></div><div><span>Clareza do processo</span><b>'+media('clareza').toFixed(1).replace('.',',')+'</b></div><div><span>Agilidade</span><b>'+media('agilidade').toFixed(1).replace('.',',')+'</b></div><div><span>Experiência geral</span><b>'+media('experiencia').toFixed(1).replace('.',',')+'</b></div></div></div><div class="emp-av-lista">'+a.slice().reverse().map(x=>{const n=Number(x.notaGeral||x.nota||0);return '<article class="emp-av-item"><div class="emp-av-item-top"><div><h3>'+esc(x.vaga||x.cargo||'Processo seletivo')+'</h3><small>'+esc(x.data||x.criadoEm||'Avaliação de candidato')+'</small></div><span class="estrelas">'+stars(n)+'</span></div>'+(x.comentario?'<p>'+esc(x.comentario)+'</p>':'')+'</article>'}).join('')+'</div>';
 modal.classList.remove('oculto');
}
function fecharAvaliacoesEmpresaEM(){document.getElementById('modalAvaliacoesEmpresaEM')?.classList.add('oculto')}
document.addEventListener('DOMContentLoaded',()=>setTimeout(atualizarBadgeAvaliacoesEmpresaEM,500));

/* EMPREGAMAIS-AVALIACOES-SYNC-V4 */
function avaliacoesEmpresaConsolidadasEM(cnpj){
 const alvo=nums(cnpj||''),diretas=ler('empregaMaisAvaliacoesEmpresa',[]),processos=ler('empregaMaisAvaliacoesProcessos',[]),vagas=[...ler('empregaMaisVagas',[]),...(Array.isArray(window.sbVagasCacheEM)?window.sbVagasCacheEM:[])],map=new Map();
 diretas.forEach(a=>{if(nums(a.empresaCnpj||'')===alvo)map.set(String(a.candidaturaId||a.id),a)});
 processos.forEach(a=>{
   const v=vagas.find(x=>String(x.id)===String(a.vagaId));
   const vc=nums(v?.empresaCnpj||v?.cnpj||a.empresaCnpj||'');
   if(vc!==alvo)return;
   const k=String(a.candidaturaId||a.id);
   if(!map.has(k))map.set(k,{...a,empresaCnpj:vc,data:a.data||a.criadoEm});
 });
 return [...map.values()].sort((a,b)=>new Date(b.data||b.criadoEm||0)-new Date(a.data||a.criadoEm||0));
}


/* EMPREGAMAI-PUBLICACAO-AJUSTES-V91 */
(function(){
 const svgs={
  'Vale Alimentação':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v8m3-8v8M5 7h7M8.5 11v10M16 3c-2 3-2 7 1 9v9m0-18v9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Vale Refeição':'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h2m14 0h2M12 3v2m0 14v2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  'Vale Transporte':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 17h12l1-3V7c0-2-2-3-7-3S5 5 5 7v7l1 3Zm1 0v3m10-3v3M8 8h8M8 13h.01M16 13h.01" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Auxílio Combustível':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V5h9v16M7 8h5v4H7m7-4h2l3 3v7a2 2 0 0 1-4 0v-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Plano de Saúde':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20S4 15 4 9a4 4 0 0 1 7-2.6A4 4 0 0 1 18 9c0 6-6 11-6 11Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 12h6m-3-3v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  'Plano Odontológico':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4c2 0 2.5 1 4 1s2-1 4-1c3 0 4 3 3 6-.8 2.5-2 4-2.5 7-.4 2-1 3-2 3-1.5 0-1.2-4-2.5-4s-1 4-2.5 4c-1 0-1.6-1-2-3C7 14 5.8 12.5 5 10 4 7 5 4 8 4Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  'Seguro de Vida':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9 12h6m-3-3v6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  'Auxílio Home Office':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H4zM8 20h8m-4-4v4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="m8 11 4-3 4 3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Gympass / Wellhub':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4m3-6v8m10-8v8m3-6v4M7 12h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  'Participação nos Lucros':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19V9m7 10V5m7 14v-7M3 19h18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="m5 7 6-4 5 3 4-3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Bônus por desempenho':'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v10m3-8.5c-.8-1-5-1.2-5 1 0 2.5 5 1.2 5 4 0 2.2-4.2 2-5 1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  'Auxílio Creche':'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 20c.5-4 2.5-6 6-6s5.5 2 6 6M8 5 6 3m10 2 2-2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  'Vale Cultura':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Day Off':'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2m0-14-2 2M7 17l-2 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  'Horário Flexível':'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  'Estacionamento':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 21V3h7a5 5 0 0 1 0 10H9v8M9 6v4h4a2 2 0 0 0 0-4H9Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
 };
 function ajustarPublicacao(){
   const bloco=document.querySelector('#pagina-publicar .em-confidencial-cliente');
   if(bloco)bloco.remove();
   document.querySelectorAll('#pagina-publicar .em-benefit-card').forEach(card=>{
     const check=card.querySelector('.beneficio-check'),icone=card.querySelector('.em-benefit-icon');
     if(check&&icone&&svgs[check.value])icone.innerHTML=svgs[check.value];
   });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ajustarPublicacao);
 else ajustarPublicacao();
})();


/* EMPREGAMAI-FORM-VAGA-3-ETAPAS-V10 */
(function(){
 function reconstruirFormularioVagaEM(){
  const form=document.getElementById('formVaga'),progress=document.getElementById('jobProgress');
  if(!form||form.dataset.formV10==='1')return;
  const p2=form.querySelector('.job-card[data-panel="2"]'),p3=form.querySelector('.job-card[data-panel="3"]'),p4=form.querySelector('.job-card[data-panel="4"]');
  if(!p2||!p3||!p4)return;
  form.dataset.formV10='1';
  if(progress){
   progress.innerHTML='<div class="job-step ativo" data-step="1"><b>1</b><span>Vaga</span></div><div class="job-step" data-step="2"><b>2</b><span>Detalhes</span></div><div class="job-step" data-step="3"><b>3</b><span>Revisar</span></div>';
  }
  const actions2=p2.querySelector('.job-actions');
  const tituloDesc=document.createElement('div');
  tituloDesc.className='em-form-section-divider';
  tituloDesc.innerHTML='<span>02</span><div><b>Descrição, requisitos e benefícios</b><small>Complete as informações que ajudam o candidato a entender a oportunidade.</small></div>';
  if(actions2)actions2.before(tituloDesc);
  [...p3.children].forEach(el=>{if(!el.classList.contains('job-actions'))actions2?actions2.before(el):p2.appendChild(el)});
  p3.remove();
  p4.dataset.panel='3';
  if(actions2){
   const back=actions2.querySelector('button:first-child'),next=actions2.querySelector('button:last-child');
   if(back)back.setAttribute('onclick','mostrarEtapa(1)');
   if(next){next.setAttribute('onclick','proximaEtapa(2)');next.innerHTML='Revisar vaga →'}
  }
  const actions3=p4.querySelector('.job-actions');
  if(actions3){const back=actions3.querySelector('button:first-child');if(back)back.setAttribute('onclick','mostrarEtapa(2)')}
  const p1=form.querySelector('.job-card[data-panel="1"]'),a1=p1?.querySelector('.job-actions button:last-child');
  if(a1)a1.innerHTML='Continuar →';
 }
 const mostrarOriginal=window.mostrarEtapa;
 window.mostrarEtapa=function(n){
  const form=document.getElementById('formVaga');
  if(form?.dataset.formV10==='1'){
   document.querySelectorAll('#formVaga .job-card').forEach(x=>x.classList.toggle('ativo',+x.dataset.panel===n));
   document.querySelectorAll('#jobProgress .job-step').forEach(x=>{const k=+x.dataset.step;x.classList.toggle('ativo',k===n);x.classList.toggle('feito',k<n)});
   if(n===3&&typeof montarRevisao==='function')montarRevisao();
   window.scrollTo(0,0);return;
  }
  return mostrarOriginal?.(n);
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',reconstruirFormularioVagaEM);
 else reconstruirFormularioVagaEM();
})();


/* EMPREGAMAI-LOCAL-PUBLICO-PRO-V14 */
(function(){
 function modernizarLocalPublico(){
  const box=document.querySelector('#pagina-publicar .em-privacidade-local');
  if(!box||box.dataset.proV14==='1')return;
  box.dataset.proV14='1';
  const icons={
   completo:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20H4V10.5Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M9 20v-6h6v6" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
   bairro:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V9l5-3v14m0-8 6-4v12m0-7 5-2v9M2 20h20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
   cidade:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'
  };
  box.querySelectorAll('.em-local-opcoes label').forEach(label=>{
   const input=label.querySelector('input[type=radio]'); if(!input)return;
   const key=input.value, b=label.querySelector('b'), small=label.querySelector('small');
   const wrap=document.createElement('span');wrap.className='em-local-pro-copy';
   if(b)wrap.appendChild(b);if(small)wrap.appendChild(small);
   const icon=document.createElement('span');icon.className='em-local-pro-icon';icon.innerHTML=icons[key]||icons.cidade;
   const check=document.createElement('span');check.className='em-local-pro-check';check.innerHTML='<svg viewBox="0 0 20 20"><path d="m5 10 3 3 7-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
   label.insertBefore(icon,input.nextSibling);label.appendChild(wrap);label.appendChild(check);
  });
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',modernizarLocalPublico);else modernizarLocalPublico();
})();


/* EMPREGAMAI-ENDERECO-EMPRESA-PADRAO-V22 */
async function preencherEnderecoEmpresaNaVagaEM(vagaEdit){
 if(vagaEdit)return;
 const emp=typeof empresaLogada==='function'?(empresaLogada()||{}):{},p=emp.perfil||{};
 const get=id=>document.getElementById(id),set=(id,val)=>{const el=get(id);if(el&&!el.value&&val)el.value=val};
 set('cepVaga',emp.cep||p.cep);set('logradouroVaga',emp.logradouro||p.logradouro);set('bairroVaga',emp.bairro||p.bairro);
 set('numeroVaga',emp.numero||p.numero);set('complementoVaga',emp.complemento||p.complemento);
 set('cidadeVaga',emp.cidade||p.cidade);set('estadoVaga',emp.uf||emp.estado||p.uf||p.estado);
 const cep=String(get('cepVaga')?.value||emp.cep||p.cep||'').replace(/\D/g,'');
 if(cep.length===8&&(!get('logradouroVaga')?.value||!get('bairroVaga')?.value)){
  try{
   const r=await fetch('https://viacep.com.br/ws/'+cep+'/json/'),d=await r.json();
   if(!d.erro){set('logradouroVaga',d.logradouro);set('bairroVaga',d.bairro);set('cidadeVaga',d.localidade);set('estadoVaga',d.uf)}
  }catch(e){console.warn('Endereço padrão da empresa:',e)}
 }
 const preview=get('previewLocalVaga');if(preview){const partes=[get('bairroVaga')?.value,get('cidadeVaga')?.value,get('estadoVaga')?.value].filter(Boolean);if(partes.length)preview.textContent=partes.join(' - ')}
}
const _prepararPublicacaoEnderecoEmpresaEM=prepararPublicacao;
prepararPublicacao=function(){
 const r=_prepararPublicacaoEnderecoEmpresaEM();
 const editId=sessionStorage.getItem('vagaEdicao'),vagaEdit=editId?vagasDaEmpresa().find(v=>v.id===editId):null;
 setTimeout(()=>preencherEnderecoEmpresaNaVagaEM(vagaEdit),0);
 return r
};




/* EMPREGAMAIS-VAGAS-EMPRESA-JS-V1 */
function renderVagasEmpresaPaginaEM(){
 const box=document.getElementById('empresaVagasPagina');if(!box)return;
 const vagas=(typeof vagasDaEmpresa==='function'?vagasDaEmpresa():[]).filter(Boolean);
 const cs=(typeof candidaturas==='function'?candidaturas():[]).filter(Boolean);
 const status=v=>v.status==='aprovada'&&(!v.dataEncerramento||new Date(v.dataEncerramento+'T23:59:59')>=new Date())?'Ativa':['pendente','em_analise','analise'].includes(v.status)?'Em análise':'Encerrada';
 const ativa=vagas.filter(v=>status(v)==='Ativa').length,analise=vagas.filter(v=>status(v)==='Em análise').length,enc=vagas.filter(v=>status(v)==='Encerrada').length;
 const esc2=s=>String(s==null?'':s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
 const rows=vagas.map(v=>{const cand=cs.filter(x=>String(x.vagaId)===String(v.id));const st=status(v),cl=st==='Em análise'?'analise':st==='Encerrada'?'encerrada':'';return '<article class="evp-vaga" data-titulo="'+esc2((v.cargo||v.titulo||'')+' '+(v.cidade||''))+'" data-status="'+esc2(st)+'"><div class="evp-title"><strong>'+esc2(v.cargo||v.titulo||'Vaga')+'</strong><small>'+esc2([v.cidade,v.estado||v.uf].filter(Boolean).join(' - ')||'Localização não informada')+' · '+esc2(v.modalidade||'Modalidade não informada')+' · '+esc2(v.dataPublicacao||v.data||'')+'</small></div><span class="evp-status '+cl+'">'+st+'</span><div class="evp-metric"><strong>'+cand.length+'</strong><span>Candidaturas</span></div><div class="evp-metric"><strong>'+esc2(v.visualizacoes||0)+'</strong><span>Visualizações</span></div><div class="evp-actions"><button class="manage" onclick="abrirGestaoVaga(\''+esc2(v.id)+'\')">Gerenciar processo</button><button class="edit" onclick="editarVaga(\''+esc2(v.id)+'\')">Editar</button><button class="view" onclick="sessionStorage.setItem(\'vagaSelecionada\',\''+esc2(v.id)+'\');irPara(\'vaga\')">Ver vaga</button></div></article>'}).join('');
 box.innerHTML='<div class="evp-summary"><article><span>TOTAL DE VAGAS</span><strong>'+vagas.length+'</strong><small>Todas as oportunidades</small></article><article><span>ATIVAS</span><strong>'+ativa+'</strong><small>Publicadas no portal</small></article><article><span>EM ANÁLISE</span><strong>'+analise+'</strong><small>Aguardando publicação</small></article><article><span>ENCERRADAS</span><strong>'+enc+'</strong><small>Processos finalizados</small></article></div><section class="evp-board"><div class="evp-tools"><input id="evpBusca" placeholder="Buscar vaga por cargo ou localização"><select id="evpStatus"><option value="">Todos os status</option><option>Ativa</option><option>Em análise</option><option>Encerrada</option></select><select><option>Mais recentes</option></select></div><div class="evp-table-head"><span>VAGA</span><span>STATUS</span><span>CANDIDATURAS</span><span>VISUALIZAÇÕES</span><span>AÇÕES</span></div><div id="evpLista">'+(rows||'<div class="evp-empty"><strong>Nenhuma vaga cadastrada</strong><span>Publique uma nova vaga para começar.</span></div>')+'</div></section>';
 const filtrar=()=>{const q=(document.getElementById('evpBusca').value||'').toLowerCase(),s=document.getElementById('evpStatus').value;box.querySelectorAll('.evp-vaga').forEach(el=>el.style.display=(!q||el.dataset.titulo.toLowerCase().includes(q))&&(!s||el.dataset.status===s)?'grid':'none')};document.getElementById('evpBusca').oninput=filtrar;document.getElementById('evpStatus').onchange=filtrar;
}
window.renderVagasEmpresaPaginaEM=renderVagasEmpresaPaginaEM;

/* EMPREGAMAIS-PROCESSOS-CANONICO-JS-V113 */
function statusProcessoCanonicoEM(v){
 if(v.status==='aprovada'&&vagaDentroPrazo(v))return ['Ativa',''];
 if(['pendente','em_analise','analise'].includes(v.status))return ['Em análise','analise'];
 return ['Encerrada','encerrada'];
}
function alternarVistaProcessosEM(detalhe){
 const central=document.getElementById('psCentralView'),cand=document.getElementById('psCandidateView');
 if(central)central.hidden=!!detalhe;if(cand)cand.hidden=!detalhe;
}
function renderCentralProcessosEmpresaEM(){
 alternarVistaProcessosEM(false);
 const box=document.getElementById('psCentralConteudo');if(!box)return;
 const vagasRaw=typeof vagasDaEmpresa==='function'?vagasDaEmpresa():[];
 const vagas=Array.isArray(vagasRaw)?vagasRaw.filter(Boolean):[];
 const candRaw=typeof candidaturas==='function'?candidaturas():[];
 const cs=(Array.isArray(candRaw)?candRaw:[]).filter(c=>c&&vagas.some(v=>String(v.id)===String(c.vagaId)));
 const busca=String(document.getElementById('psv2Busca')?.value||'').toLowerCase(),filtro=document.getElementById('psv2Status')?.value||'todos',ordem=document.getElementById('psv2Ordem')?.value||'recentes';
 const ativas=vagas.filter(v=>statusProcessoCanonicoEM(v)[0]==='Ativa').length,analise=vagas.filter(v=>statusProcessoCanonicoEM(v)[0]==='Em análise').length;
 let lista=vagas.filter(v=>{const st=statusProcessoCanonicoEM(v)[0].toLowerCase(),txt=(tituloVaga(v)+' '+(v.cidade||'')+' '+(v.estado||v.uf||'')).toLowerCase();return(filtro==='todos'||st===filtro)&&(!busca||txt.includes(busca))});
 lista.sort((x,y)=>ordem==='az'?tituloVaga(x).localeCompare(tituloVaga(y),'pt-BR'):ordem==='antigos'?new Date(x.criadoEm||0)-new Date(y.criadoEm||0):new Date(y.criadoEm||0)-new Date(x.criadoEm||0));
 const summary='<div class="psv2-summary"><article><i>▣</i><div><span>PROCESSOS</span><strong>'+vagas.length+'</strong><small>Total cadastrado</small></div></article><article><i>●</i><div><span>ATIVOS</span><strong>'+ativas+'</strong><small>Recrutamentos em andamento</small></div></article><article><i>◷</i><div><span>EM ANÁLISE</span><strong>'+analise+'</strong><small>Aguardando publicação</small></div></article><article><i>♟</i><div><span>CANDIDATURAS</span><strong>'+cs.length+'</strong><small>Recebidas em todos os processos</small></div></article></div>';
 const toolbar='<div class="psv2-toolbar"><input id="psv2Busca" type="search" placeholder="Buscar processo por cargo ou localização" value="'+esc(document.getElementById('psv2Busca')?.value||'')+'" oninput="renderCentralProcessosEmpresaEM()"><select id="psv2Status" onchange="renderCentralProcessosEmpresaEM()"><option value="todos">Todos os status</option><option value="ativa" '+(filtro==='ativa'?'selected':'')+'>Ativas</option><option value="em análise" '+(filtro==='em análise'?'selected':'')+'>Em análise</option><option value="encerrada" '+(filtro==='encerrada'?'selected':'')+'>Encerradas</option></select><select id="psv2Ordem" onchange="renderCentralProcessosEmpresaEM()"><option value="recentes" '+(ordem==='recentes'?'selected':'')+'>Mais recentes</option><option value="antigos" '+(ordem==='antigos'?'selected':'')+'>Mais antigos</option><option value="az" '+(ordem==='az'?'selected':'')+'>Cargo A–Z</option></select></div>';
 const rows=lista.map(v=>{const vc=cs.filter(c=>c.vagaId===v.id),av=vc.filter(c=>grupoEtapa(c.status)==='Em avaliação').length,se=vc.filter(c=>grupoEtapa(c.status)==='Selecionados').length,en=vc.filter(c=>grupoEtapa(c.status)==='Entrevista').length,co=vc.filter(c=>grupoEtapa(c.status)==='Contratados').length,st=statusProcessoCanonicoEM(v),local=[v.cidade,v.estado||v.uf].filter(Boolean).join(' - ')||'Localização não informada',dt=v.criadoEm?new Date(v.criadoEm).toLocaleDateString('pt-BR'):'—';return '<article class="psv2-row psv2-row-pro"><div class="psv2-job psv2-job-click" role="button" tabindex="0" title="Ver candidaturas desta vaga" onclick="abrirGestaoVaga(\''+v.id+'\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();abrirGestaoVaga(\''+v.id+'\')}"><div class="psv2-job-top"><div class="psv2-title-wrap"><h3>'+esc(tituloVaga(v))+'</h3><span class="psv2-status '+st[1]+'">'+(st[0]==='Ativa'?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 12.5 10.5 15.5 16.8 9.2"/><circle cx="12" cy="12" r="9"/></svg>':st[0]==='Em análise'?'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M8 12h8"/></svg>')+'<span>'+st[0]+'</span></span></div></div><div class="psv2-job-meta"><span><i>⌖</i>'+esc(local)+'</span><span><i>▣</i>'+esc(v.modalidade||'Modalidade não informada')+'</span><span><i>◷</i>'+dt+'</span></div><div class="psv2-tags">'+(v.destaque?'<em>★ Destaque</em>':'')+(v.urgente?'<em>⚡ Urgente</em>':'')+(v.confidencial?'<em>Confidencial</em>':'')+'</div></div><div class="psv2-funnel"><div class="total psv2-funnel-click" role="button" tabindex="0" title="Ver todas as candidaturas" onclick="abrirMetricaVagaEM(event,\''+v.id+'\',\'todos\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \')abrirMetricaVagaEM(event,\''+v.id+'\',\'todos\')"><strong>'+vc.length+'</strong><span>Candidaturas</span></div><div class="psv2-funnel-click" role="button" tabindex="0" title="Ver candidatos em análise" onclick="abrirMetricaVagaEM(event,\''+v.id+'\',\'em-analise\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \')abrirMetricaVagaEM(event,\''+v.id+'\',\'em-analise\')"><strong>'+av+'</strong><span>Em análise</span></div><div class="psv2-funnel-click" role="button" tabindex="0" title="Ver candidatos selecionados" onclick="abrirMetricaVagaEM(event,\''+v.id+'\',\'selecionados\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \')abrirMetricaVagaEM(event,\''+v.id+'\',\'selecionados\')"><strong>'+se+'</strong><span>Selecionados</span></div><div class="psv2-funnel-click" role="button" tabindex="0" title="Ver entrevistas" onclick="abrirMetricaVagaEM(event,\''+v.id+'\',\'entrevistas\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \')abrirMetricaVagaEM(event,\''+v.id+'\',\'entrevistas\')"><strong>'+en+'</strong><span>Entrevistas</span></div><div class="psv2-funnel-click" role="button" tabindex="0" title="Ver contratados" onclick="abrirMetricaVagaEM(event,\''+v.id+'\',\'contratados\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \')abrirMetricaVagaEM(event,\''+v.id+'\',\'contratados\')"><strong>'+co+'</strong><span>Contratados</span></div></div><div class="psv2-actions"><button class="main psv2-manage-pro" type="button" data-ps-gerenciar="'+esc(v.id)+'" onclick="abrirGestaoVaga(\''+v.id+'\')"><i aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.5-3.5 2.4-5.5 5.5-5.5s5 2 5.5 5.5"/><path d="M17 8v6M14 11h6"/></svg></i><span>Ver candidaturas</span><b>→</b></button></div></article>'}).join('');
 box.innerHTML=summary+'<section class="psv2-workspace">'+toolbar+'<div class="psv2-list-head"><span>PROCESSO / VAGA</span><span>ANDAMENTO DOS CANDIDATOS</span><span>AÇÕES</span></div><div class="psv2-list">'+(rows||'<div class="psv2-empty"><strong>Nenhum processo encontrado</strong><span>Publique uma vaga para iniciar um processo seletivo.</span></div>')+'</div></section>';
}
window.renderCentralProcessosEmpresaEM=renderCentralProcessosEmpresaEM;
function iniciarCentralProcessosEmpresaEM(){
 const pagina=document.getElementById('pagina-candidatos-empresa');
 const central=document.getElementById('psCentralConteudo');
 if(!pagina||!central)return;
 const rota=new URLSearchParams(location.search).get('pagina');
 if(rota!=='candidatos-empresa')return;
 if(sessionStorage.getItem('vagaCandidatosSelecionada'))return;
 try{renderCentralProcessosEmpresaEM()}catch(err){
  console.error('[+ Empregos] Falha ao renderizar Central de Processos:',err);
  central.innerHTML='<div class="psv2-empty"><strong>Não foi possível carregar os processos.</strong><span>Atualize a página. Se o problema continuar, abra o console para diagnóstico.</span></div>';
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(iniciarCentralProcessosEmpresaEM,0));
else setTimeout(iniciarCentralProcessosEmpresaEM,0);
window.addEventListener('pageshow',()=>setTimeout(iniciarCentralProcessosEmpresaEM,0));
function abrirCentralProcessosEmpresaEM(){sessionStorage.removeItem('vagaCandidatosSelecionada');sessionStorage.removeItem('filtroNaoVisualizadosEM');sessionStorage.setItem('filtroCandidatos','Todos');irPara('candidatos-empresa');setTimeout(renderCentralProcessosEmpresaEM,30)}
const renderizarCandidatosEmpresaDetalheEM=renderizarCandidatosEmpresa;
renderizarCandidatosEmpresa=function(){
 const id=sessionStorage.getItem('vagaCandidatosSelecionada');
 if(!id)return renderCentralProcessosEmpresaEM();
 alternarVistaProcessosEM(true);
 const v=vagasDaEmpresa().find(x=>String(x.id)===String(id)),t=document.getElementById('psCandidateTitle');if(t&&v)t.textContent=tituloVaga(v);
 return renderizarCandidatosEmpresaDetalheEM();
};


/* EMPREGAMAI-PAINEL-TOPO-PREMIUM-V105 — topo + resumo do plano mais compacto, forte e profissional */
(function(){
 const id='empregamai-painel-topo-premium-v105';
 if(document.getElementById(id))return;
 const st=document.createElement('style');
 st.id=id;
 st.textContent=`
#pagina-painel-empresa .emp-top-clean-v94{
 min-height:116px!important;
 padding:17px 24px!important;
 display:grid!important;
 grid-template-columns:minmax(0,1fr) auto!important;
 gap:24px!important;
 align-items:center!important;
 background:#fff!important;
 border:1px solid #d9e5eb!important;
 border-left:4px solid #176b87!important;
 border-radius:14px!important;
 box-shadow:0 4px 14px rgba(18,54,75,.045)!important;
 color:#173f50!important
}
#pagina-painel-empresa .emp-hero-company-v97{
 display:flex!important;align-items:center!important;gap:16px!important;min-width:0!important
}
#pagina-painel-empresa .emp-hero-logo-v97{
 width:58px!important;height:58px!important;min-width:58px!important;
 border:1px solid #d6e2e9!important;border-radius:12px!important;
 background:#fff!important;color:#176b87!important;
 display:grid!important;place-items:center!important;
 font-size:21px!important;font-weight:800!important;
 box-shadow:0 2px 8px rgba(18,54,75,.035)!important
}
#pagina-painel-empresa .emp-top-clean-v94 .emp-rec-hero-copy>span{
 margin:0 0 4px!important;color:#466675!important;font-size:11.5px!important;
 line-height:1.2!important;font-weight:700!important;letter-spacing:.065em!important
}
#pagina-painel-empresa .emp-top-clean-v94 .emp-rec-hero-copy h1{
 margin:0 0 6px!important;color:#123d54!important;font-size:28px!important;
 line-height:1.1!important;font-weight:750!important;letter-spacing:-.025em!important
}
#pagina-painel-empresa .emp-top-clean-v94 .emp-rec-hero-copy>p{
 max-width:720px!important;margin:0!important;color:#506a78!important;
 font-size:14.5px!important;line-height:1.48!important;font-weight:500!important
}
#pagina-painel-empresa .emp-top-clean-v94 .emp-rec-hero-actions{
 display:flex!important;align-items:center!important;justify-content:flex-end!important;
 gap:9px!important;margin:0!important
}
#pagina-painel-empresa .emp-top-clean-v94 .emp-rec-hero-actions button{
 height:42px!important;min-height:42px!important;padding:0 16px!important;
 border:1px solid #c9d9e1!important;border-radius:9px!important;
 background:#fff!important;color:#176b87!important;
 font-size:13px!important;font-weight:650!important;white-space:nowrap!important;
 box-shadow:none!important
}
#pagina-painel-empresa .emp-top-clean-v94 .emp-rec-hero-actions .primary{
 background:#176b87!important;border-color:#176b87!important;color:#fff!important
}
#pagina-painel-empresa .emp-top-clean-v94 .emp-rec-hero-actions button:hover{
 transform:translateY(-1px)!important;box-shadow:0 5px 12px rgba(23,107,135,.12)!important
}

#pagina-painel-empresa .emp-plan-overview-v100{
 display:grid!important;
 grid-template-columns:minmax(165px,1.08fr) repeat(4,minmax(128px,.82fr)) minmax(155px,.98fr) 132px!important;
 gap:9px!important;align-items:stretch!important;
 width:100%!important;min-height:0!important;
 margin:12px 0 19px!important;padding:10px!important;
 background:#fff!important;border:1px solid #d9e5eb!important;border-radius:14px!important;
 box-shadow:0 4px 14px rgba(18,54,75,.035)!important;overflow:visible!important
}
#pagina-painel-empresa .emp-plan-overview-ident,
#pagina-painel-empresa .emp-plan-overview-metric,
#pagina-painel-empresa .emp-plan-overview-vigencia{
 min-width:0!important;min-height:88px!important;height:auto!important;
 padding:11px 12px!important;border:1px solid #dde7ec!important;border-radius:11px!important;
 background:#fbfcfd!important;box-shadow:none!important
}
#pagina-painel-empresa .emp-plan-overview-ident{
 display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:10px!important;align-items:center!important;
 background:#f7fafc!important
}
#pagina-painel-empresa .emp-plan-overview-metric{
 display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;
 grid-template-rows:auto auto!important;column-gap:9px!important;row-gap:4px!important;align-items:center!important
}
#pagina-painel-empresa .emp-plan-overview-vigencia{
 display:grid!important;grid-template-columns:34px minmax(0,1fr)!important;gap:9px!important;align-items:center!important;
 background:#f8fafc!important
}
#pagina-painel-empresa .emp-plan-overview-ident>i,
#pagina-painel-empresa .emp-plan-overview-metric>i,
#pagina-painel-empresa .emp-plan-overview-vigencia>i{
 width:34px!important;height:34px!important;min-width:34px!important;flex:0 0 34px!important;
 border-radius:9px!important;font-size:15px!important;font-weight:700!important
}
#pagina-painel-empresa .emp-plan-overview-v100 span{
 display:block!important;margin:0!important;color:#425d6b!important;
 font-size:12px!important;line-height:1.28!important;font-weight:600!important
}
#pagina-painel-empresa .emp-plan-overview-ident span,
#pagina-painel-empresa .emp-plan-overview-vigencia span{
 color:#607580!important;font-size:10.5px!important;line-height:1.25!important;
 font-weight:700!important;letter-spacing:.045em!important
}
#pagina-painel-empresa .emp-plan-overview-v100 strong{
 display:block!important;margin:2px 0!important;color:#103b53!important;
 font-size:29px!important;line-height:1!important;font-weight:750!important;letter-spacing:-.02em!important
}
#pagina-painel-empresa .emp-plan-overview-ident strong{
 font-size:17px!important;line-height:1.18!important;font-weight:700!important;letter-spacing:-.01em!important
}
#pagina-painel-empresa .emp-plan-overview-vigencia strong{
 font-size:15px!important;line-height:1.2!important;font-weight:700!important;letter-spacing:0!important
}
#pagina-painel-empresa .emp-plan-overview-v100 small{
 display:block!important;margin:4px 0 0!important;color:#617783!important;
 font-size:11px!important;line-height:1.35!important;font-weight:500!important
}
#pagina-painel-empresa .emp-plan-overview-v100 small b{
 font-weight:700!important;color:#314f60!important
}
#pagina-painel-empresa .emp-plan-overview-metric>div{
 display:block!important;grid-column:2!important;grid-row:1/3!important;min-width:0!important
}
#pagina-painel-empresa .emp-plan-overview-metric>div>strong,
#pagina-painel-empresa .emp-plan-overview-metric>div>span,
#pagina-painel-empresa .emp-plan-overview-metric>div>small{
 position:static!important;width:auto!important;margin-left:0!important;padding-top:0!important;border-top:0!important
}
#pagina-painel-empresa .emp-plan-overview-manage{
 align-self:stretch!important;justify-self:stretch!important;
 display:flex!important;align-items:center!important;justify-content:center!important;gap:9px!important;
 width:100%!important;height:auto!important;min-height:88px!important;margin:0!important;padding:12px!important;
 border:1px solid #cbdde5!important;border-radius:11px!important;
 background:#f2f8fb!important;color:#176b87!important;
 font-size:12.5px!important;line-height:1.3!important;font-weight:700!important;white-space:normal!important;
 box-shadow:none!important
}
#pagina-painel-empresa .emp-plan-overview-manage b{font-size:16px!important;font-weight:600!important}
#pagina-painel-empresa .emp-plan-overview-manage:hover{
 background:#eaf4f8!important;border-color:#aac8d3!important;transform:translateY(-1px)!important
}

@media(max-width:1320px){
 #pagina-painel-empresa .emp-plan-overview-v100{grid-template-columns:repeat(3,minmax(0,1fr))!important}
 #pagina-painel-empresa .emp-plan-overview-manage{min-height:76px!important}
}
@media(max-width:900px){
 #pagina-painel-empresa .emp-top-clean-v94{grid-template-columns:1fr!important;gap:14px!important}
 #pagina-painel-empresa .emp-top-clean-v94 .emp-rec-hero-actions{justify-content:flex-start!important}
}
@media(max-width:760px){
 #pagina-painel-empresa .emp-plan-overview-v100{grid-template-columns:repeat(2,minmax(0,1fr))!important}
 #pagina-painel-empresa .emp-plan-overview-ident,
 #pagina-painel-empresa .emp-plan-overview-metric,
 #pagina-painel-empresa .emp-plan-overview-vigencia,
 #pagina-painel-empresa .emp-plan-overview-manage{min-height:82px!important}
}
@media(max-width:520px){
 #pagina-painel-empresa .emp-top-clean-v94{padding:15px!important}
 #pagina-painel-empresa .emp-hero-company-v97{align-items:flex-start!important}
 #pagina-painel-empresa .emp-top-clean-v94 .emp-rec-hero-copy h1{font-size:23px!important}
 #pagina-painel-empresa .emp-top-clean-v94 .emp-rec-hero-copy>p{font-size:13.5px!important}
 #pagina-painel-empresa .emp-top-clean-v94 .emp-rec-hero-actions{display:grid!important;grid-template-columns:1fr 1fr!important;width:100%!important}
 #pagina-painel-empresa .emp-top-clean-v94 .emp-rec-hero-actions button{width:100%!important;padding:0 10px!important}
 #pagina-painel-empresa .emp-plan-overview-v100{grid-template-columns:1fr!important;padding:8px!important}
}
`;
 document.head.appendChild(st);
})();


/* EMPREGAMais-CADASTRO-VERIFICACAO-SEPARADOS-V1 */
function instalarEstilosCadastroVerificacaoSeparadosEM(){
 if(document.getElementById('estilosCadastroVerificacaoSeparadosEM'))return;
 const st=document.createElement('style');st.id='estilosCadastroVerificacaoSeparadosEM';
 st.textContent='.cad-empresa-email-candidaturas-em{display:grid;gap:7px;margin:12px 0}.cad-empresa-email-candidaturas-em>label:first-child{font:700 13px Montserrat,Arial,sans-serif;color:#344f5e}.cad-empresa-email-candidaturas-em input[type="email"]{width:100%;min-height:46px;border:1px solid #cbd8df;border-radius:10px;padding:0 13px;font:500 14px Montserrat,Arial,sans-serif;background:#fff;color:#263f4c}.cad-empresa-email-candidaturas-em small{font:500 11.5px/1.45 Montserrat,Arial,sans-serif;color:#697d88}.cad-email-mesmo-em{display:flex!important;align-items:center;gap:8px;font:600 12px Montserrat,Arial,sans-serif;color:#536a76}.cad-email-mesmo-em input{width:16px!important;height:16px!important}.pv-verificacao-form-grid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:18px;margin-top:18px}.pv-verificacao-form-grid main{display:grid;gap:16px}.pv-data-basicos{grid-template-columns:repeat(2,minmax(0,1fr))}.pv-editar-basicos{margin-top:14px;border:1px solid #c6d8e1;background:#fff;color:#174e65;border-radius:9px;padding:10px 13px;font:700 12px Montserrat,Arial,sans-serif;cursor:pointer}.pv-form-campos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.pv-form-campos label{display:grid;gap:6px}.pv-form-campos label span{font:700 11.5px Montserrat,Arial,sans-serif;color:#536a76}.pv-form-campos input{width:100%;min-height:43px;border:1px solid #cad8df;border-radius:9px;padding:0 12px;font:500 13px Montserrat,Arial,sans-serif;color:#2f4652;background:#fff}.pv-form-wide{grid-column:1/-1}.pv-confirmacao{display:flex!important;align-items:flex-start;gap:9px;margin:16px 0;font:500 12px/1.45 Montserrat,Arial,sans-serif;color:#526772}.pv-confirmacao input{margin-top:2px}.pv-enviar-verificacao{width:100%;border:0;border-radius:10px;background:#174f67;color:#fff;padding:13px 16px;font:800 13px Montserrat,Arial,sans-serif;cursor:pointer}.pv-form-alert{margin:14px 0;padding:12px 14px;border-radius:10px;display:grid;gap:3px}.pv-form-alert-erro{background:#fff2f2;border:1px solid #f3caca;color:#8a3030}.pv-form-alert b{font:800 12px Montserrat,Arial,sans-serif}.pv-form-alert span{font:500 12px Montserrat,Arial,sans-serif}@media(max-width:850px){.pv-verificacao-form-grid{grid-template-columns:1fr}.pv-verificacao-form-grid aside{order:-1}.pv-form-campos,.pv-data-basicos{grid-template-columns:1fr}.pv-form-wide{grid-column:auto}}';
 document.head.appendChild(st);
}
function prepararCadastroEmpresaSeparadoEM(){
 instalarEstilosCadastroVerificacaoSeparadosEM();
 const email=document.getElementById('cadEmpresaEmail'),fone=document.getElementById('cadEmpresaTelefone');if(!email||document.getElementById('cadEmpresaEmailCandidaturas'))return;
 const labelEmail=email.closest('label');if(labelEmail){const txt=labelEmail.querySelector('span,strong,b');if(txt&&/e-mail/i.test(txt.textContent||''))txt.textContent='E-mail corporativo';}
 const wrap=document.createElement('div');wrap.className='cad-empresa-email-candidaturas-em';
 wrap.innerHTML='<label for="cadEmpresaEmailCandidaturas">E-mail para recebimento de candidaturas</label><input id="cadEmpresaEmailCandidaturas" type="email" autocomplete="email" required placeholder="Ex.: rh@suaempresa.com.br"><small>Este endereço será o padrão para vagas que recebem currículos por e-mail. Ele é separado do e-mail corporativo da conta.</small><label class="cad-email-mesmo-em"><input id="cadEmpresaMesmoEmailEM" type="checkbox"> <span>Usar o mesmo e-mail corporativo para candidaturas</span></label>';
 const ancora=(fone?.closest('label,.campo,.form-field,.form-group')||fone?.parentElement||labelEmail);
 if(ancora)ancora.insertAdjacentElement('afterend',wrap);
 const rec=wrap.querySelector('#cadEmpresaEmailCandidaturas'),same=wrap.querySelector('#cadEmpresaMesmoEmailEM');
 const sync=()=>{if(same.checked){rec.value=email.value.trim().toLowerCase();rec.readOnly=true}else rec.readOnly=false};
 same.addEventListener('change',sync);email.addEventListener('input',()=>{if(same.checked)sync()});
}
function prepararEmailCandidaturasMinhaEmpresaEM(){
 const email=document.getElementById('contaEmail');if(!email||document.getElementById('contaEmailCandidaturas'))return;
 const wrap=document.createElement('label');wrap.className='perfil-email-candidaturas-em';
 wrap.innerHTML='<span>E-mail para candidaturas</span><input id="contaEmailCandidaturas" type="email" placeholder="rh@suaempresa.com.br"><small>Este é o endereço padrão usado nas vagas que recebem currículos por e-mail.</small>';
 const ancora=email.closest('label,.perfil-campo,.form-field,.form-group')||email.parentElement;
 if(ancora)ancora.insertAdjacentElement('afterend',wrap);
 const emp=empresaLogada();wrap.querySelector('input').value=emp?.emailCandidaturas||emp?.email||'';
}
async function sincronizarDadosEmpresaBasicosEM(emp){
 if(!emp)return;
 const token=await sbGarantirSessaoEM();if(!token)return;
 const body={nome:emp.nome||'',email:emp.email||'',email_corporativo:emp.emailCorporativo||emp.email||'',email_candidaturas:emp.emailCandidaturas||emp.email||'',telefone:emp.telefone||'',razao_social:emp.razaoSocial||'',responsavel:emp.responsavel||'',funcao_responsavel:emp.funcaoResponsavel||'',cep:emp.cep||'',logradouro:emp.logradouro||'',bairro:emp.bairro||'',numero:emp.numero||'',complemento:emp.complemento||'',cidade:emp.cidade||'',uf:emp.uf||''};
 const filtro=emp.id?'id=eq.'+encodeURIComponent(emp.id):'cnpj=eq.'+encodeURIComponent(nums(emp.cnpj||''));
 const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/empresas?'+filtro,{method:'PATCH',headers:Object.assign(sbHeadersEM(token),{'Prefer':'return=representation'}),body:JSON.stringify(body)});
 if(Array.isArray(rows)&&rows[0]){const atualizado=sbEmpresaParaLocalEM(rows[0],emp.senha||'');if(atualizado)sbSalvarEmpresaLocalEM(atualizado)}
}
function prepararCepVerificacaoEmpresaEM(){
 const cep=document.getElementById('verCepEM');if(!cep||cep.dataset.bindCep)return;cep.dataset.bindCep='1';
 cep.addEventListener('blur',async()=>{const n=nums(cep.value);if(n.length!==8)return;try{const r=await fetch('https://viacep.com.br/ws/'+n+'/json/'),d=await r.json();if(d.erro)return;const set=(id,v)=>{const el=document.getElementById(id);if(el&&!el.value)el.value=v||''};set('verLogradouroEM',d.logradouro);set('verBairroEM',d.bairro);set('verCidadeEM',d.localidade);set('verUfEM',d.uf)}catch(e){}});
}
async function enviarVerificacaoEmpresaSeparadaEM(ev){
 ev.preventDefault();
 const cnpj=sessionStorage.getItem('empresaCnpj')||'',lista=ler('empregaMaisEmpresas'),i=lista.findIndex(x=>nums(x.cnpj)===nums(cnpj));if(i<0)return;
 const v=id=>document.getElementById(id)?.value.trim()||'',dados={razaoSocial:v('verRazaoSocialEM'),responsavel:v('verResponsavelEM'),funcaoResponsavel:v('verFuncaoResponsavelEM'),cep:v('verCepEM'),logradouro:v('verLogradouroEM'),numero:v('verNumeroEM'),complemento:v('verComplementoEM'),bairro:v('verBairroEM'),cidade:v('verCidadeEM'),uf:v('verUfEM').toUpperCase()};
 const m=document.getElementById('msgVerificacaoEmpresaSeparadaEM');
 const erro=t=>{if(m){m.textContent=t;m.className='form-msg erro'}};
 if(!dados.razaoSocial||!dados.responsavel||!dados.funcaoResponsavel)return erro('Preencha razão social, responsável e função/cargo.');
 if(nums(dados.cep).length!==8||!dados.logradouro||!dados.numero||!dados.bairro||!dados.cidade||dados.uf.length!==2)return erro('Complete o endereço da empresa para continuar.');
 Object.assign(lista[i],dados);gravar('empregaMaisEmpresas',lista);
 if(m){m.textContent='Enviando dados para análise...';m.className='form-msg'}
 try{
  await sincronizarDadosEmpresaBasicosEM(lista[i]);
  iniciarSolicitacaoVerificacaoEM(lista,i,'envio');
 }catch(err){
  console.error('Verificação da empresa:',err);
  erro('Não foi possível enviar a verificação agora. Tente novamente.');
 }
}
document.addEventListener('DOMContentLoaded',()=>{instalarEstilosCadastroVerificacaoSeparadosEM();prepararCadastroEmpresaSeparadoEM()});
window.addEventListener('load',()=>setTimeout(prepararCadastroEmpresaSeparadoEM,150));


/* EMPREGAMAI-CADASTRO-EMPRESA-PRO-V1 */
function instalarEstilosCadastroEmpresaProEM(){
 if(document.getElementById('estilosCadastroEmpresaProEM'))return;
 const st=document.createElement('style');st.id='estilosCadastroEmpresaProEM';
 st.textContent='.em-cadastro-empresa-pro{background:#f3f7f9!important;min-height:100vh!important;color:#183745}.em-cadastro-empresa-pro h1{font:800 clamp(30px,3vw,44px)/1.08 Montserrat,Arial,sans-serif!important;color:#123e50!important;letter-spacing:-.035em!important}.em-cad-shell{width:min(1180px,calc(100% - 40px));margin:48px auto 64px;display:grid;grid-template-columns:minmax(0,1.55fr) minmax(300px,.85fr);gap:24px;align-items:stretch}.em-cad-form-pro{background:#fff;border:1px solid #d8e4e9;border-radius:20px;padding:30px;box-shadow:0 16px 45px rgba(18,62,80,.08);display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px!important;align-content:start}.em-cad-form-intro{grid-column:1/-1;padding-bottom:20px;margin-bottom:2px;border-bottom:1px solid #e5edf1}.em-cad-form-intro>span{display:inline-flex;padding:6px 9px;border-radius:7px;background:#e8f3f5;color:#0b7180;font:800 10px Montserrat,Arial,sans-serif;letter-spacing:.08em}.em-cad-form-intro h2{margin:12px 0 6px;font:800 23px/1.2 Montserrat,Arial,sans-serif;color:#173f51}.em-cad-form-intro p{margin:0;max-width:690px;font:500 13px/1.55 Montserrat,Arial,sans-serif;color:#647983}.em-cad-form-pro .em-cad-field,.em-cad-form-pro>label{display:grid!important;gap:7px!important;margin:0!important;align-content:start}.em-cad-form-pro .em-cad-field>span,.em-cad-form-pro>label>span{font:700 12.5px/1.3 Montserrat,Arial,sans-serif!important;color:#274b5a!important}.em-cad-form-pro input:not([type="checkbox"]){width:100%!important;min-height:48px!important;border:1px solid #c8d8df!important;border-radius:10px!important;background:#fff!important;padding:0 13px!important;font:500 14px Montserrat,Arial,sans-serif!important;color:#203f4d!important;outline:none!important;transition:.18s ease!important}.em-cad-form-pro input:not([type="checkbox"]):focus{border-color:#138496!important;box-shadow:0 0 0 3px rgba(19,132,150,.11)!important}.em-cad-form-pro input[readonly]{background:#f4f8fa!important;color:#637985!important}.em-cad-help{display:block;font:500 10.5px/1.4 Montserrat,Arial,sans-serif!important;color:#7a8e98!important;margin:0!important}.em-cad-field-candidaturas{grid-column:1/-1!important;background:#f7fbfc;border:1px solid #dbe9ed;border-radius:12px;padding:14px 15px!important}.em-cad-same,.cad-email-mesmo-em{display:flex!important;align-items:center!important;gap:8px!important;margin-top:3px!important;font:600 11.5px Montserrat,Arial,sans-serif!important;color:#4d6874!important}.em-cad-same input,.cad-email-mesmo-em input{width:16px!important;height:16px!important;accent-color:#108396}.em-cad-submit{grid-column:1/-1!important;justify-self:start!important;min-height:48px!important;border:0!important;border-radius:10px!important;background:#0d8190!important;color:#fff!important;padding:0 23px!important;font:800 13px Montserrat,Arial,sans-serif!important;box-shadow:0 8px 18px rgba(13,129,144,.18)!important;cursor:pointer!important}.em-cad-submit:hover{transform:translateY(-1px);filter:brightness(.97)}.em-cad-msg{grid-column:1/-1!important;margin:0!important}.em-cad-aside{border-radius:20px;padding:32px;background:linear-gradient(160deg,#0d5969,#0b7780);color:#fff;box-shadow:0 16px 45px rgba(15,76,91,.14);display:flex;flex-direction:column;min-height:100%}.em-cad-aside-badge{align-self:flex-start;padding:6px 9px;border:1px solid rgba(255,255,255,.28);border-radius:7px;background:rgba(255,255,255,.08);font:800 10px Montserrat,Arial,sans-serif;letter-spacing:.08em}.em-cad-aside h2{margin:18px 0 10px;font:800 24px/1.25 Montserrat,Arial,sans-serif;color:#fff!important}.em-cad-aside>p{margin:0 0 25px;font:500 13px/1.6 Montserrat,Arial,sans-serif;color:rgba(255,255,255,.8)!important}.em-cad-benefits{display:grid;gap:14px}.em-cad-benefits>div{display:grid;grid-template-columns:27px 1fr;gap:10px;align-items:start;padding:12px 0;border-top:1px solid rgba(255,255,255,.12)}.em-cad-benefits i{width:25px;height:25px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.12);font-style:normal;font-weight:800}.em-cad-benefits span{display:grid;gap:3px}.em-cad-benefits b{font:700 12.5px Montserrat,Arial,sans-serif}.em-cad-benefits small{font:500 11px/1.45 Montserrat,Arial,sans-serif;color:rgba(255,255,255,.72)}.em-cad-security{margin-top:auto;padding-top:22px;display:grid;gap:4px;border-top:1px solid rgba(255,255,255,.15)}.em-cad-security b{font:700 11.5px Montserrat,Arial,sans-serif}.em-cad-security span{font:500 10.5px/1.45 Montserrat,Arial,sans-serif;color:rgba(255,255,255,.68)}@media(max-width:900px){.em-cad-shell{grid-template-columns:1fr;width:min(720px,calc(100% - 26px));margin:28px auto 44px}.em-cad-aside{min-height:auto}.em-cad-form-pro{padding:22px}}@media(max-width:620px){.em-cad-form-pro{grid-template-columns:1fr;padding:18px;border-radius:14px}.em-cad-form-pro .em-cad-field,.em-cad-form-pro>label,.em-cad-field-candidaturas,.em-cad-submit,.em-cad-msg{grid-column:1!important}.em-cad-shell{width:calc(100% - 18px);gap:14px}.em-cad-aside{padding:22px;border-radius:14px}.em-cad-form-intro h2{font-size:20px}.em-cad-aside h2{font-size:21px}}';
 document.head.appendChild(st);
}
function reformularCadastroEmpresaProEM(){
 if(document.getElementById('pagina-cadastro-empresa')?.dataset.cadastroV4==='1')return;
 instalarEstilosCadastroEmpresaProEM();
 const nome=document.getElementById('cadEmpresaNome');if(!nome)return;
 const form=nome.closest('form');if(!form||form.dataset.emCadastroPro==='1')return;
 form.dataset.emCadastroPro='1';
 const pagina=form.closest('[id^="pagina-"]')||form.parentElement?.parentElement||form.parentElement;
 pagina?.classList.add('em-cadastro-empresa-pro');
 const email=document.getElementById('cadEmpresaEmail'),telefone=document.getElementById('cadEmpresaTelefone'),senha=document.getElementById('cadEmpresaSenha'),senha2=document.getElementById('cadEmpresaSenha2'),cnpj=document.getElementById('cadEmpresaCnpj');
 const rotulo=(el,texto,ajuda='')=>{const lab=el?.closest('label');if(!lab)return;lab.classList.add('em-cad-field');let titulo=lab.querySelector(':scope > span,:scope > strong,:scope > b');if(!titulo){titulo=document.createElement('span');lab.insertBefore(titulo,el)}titulo.textContent=texto;if(ajuda&&!lab.querySelector('.em-cad-help')){const small=document.createElement('small');small.className='em-cad-help';small.textContent=ajuda;lab.appendChild(small)}};
 rotulo(nome,'Nome da empresa');rotulo(cnpj,'CNPJ','Use o CNPJ da empresa responsável pela conta.');rotulo(email,'E-mail corporativo','Usado para comunicações da conta e segurança.');rotulo(telefone,'Telefone corporativo');rotulo(senha,'Crie uma senha');rotulo(senha2,'Confirme a senha');
 let emailCand=document.getElementById('cadEmpresaEmailCandidaturas');
 if(!emailCand){const lab=document.createElement('label');lab.className='em-cad-field em-cad-field-candidaturas';lab.innerHTML='<span>E-mail para recebimento de candidaturas</span><input id="cadEmpresaEmailCandidaturas" type="email" autocomplete="email" required placeholder="rh@suaempresa.com.br"><small class="em-cad-help">Será o e-mail padrão para vagas que recebem currículos por e-mail.</small><label class="em-cad-same"><input id="cadEmpresaMesmoEmailEM" type="checkbox"><span>Usar o mesmo e-mail corporativo</span></label>';const alvo=telefone?.closest('label')||email?.closest('label');if(alvo)alvo.insertAdjacentElement('afterend',lab);else form.appendChild(lab);emailCand=lab.querySelector('#cadEmpresaEmailCandidaturas')}else{const antigo=emailCand.closest('.cad-empresa-email-candidaturas-em');if(antigo)antigo.classList.add('em-cad-field-candidaturas','em-cad-field')}
 const mesmo=document.getElementById('cadEmpresaMesmoEmailEM');if(mesmo&&email){const sincronizar=()=>{emailCand.readOnly=mesmo.checked;if(mesmo.checked)emailCand.value=email.value.trim().toLowerCase()};mesmo.onchange=sincronizar;email.addEventListener('input',()=>{if(mesmo.checked)sincronizar()})}
 form.classList.add('em-cad-form-pro');
 if(!form.querySelector('.em-cad-form-intro')){const intro=document.createElement('div');intro.className='em-cad-form-intro';intro.innerHTML='<span>CONTA DA EMPRESA</span><h2>Dados básicos para começar</h2><p>Crie o acesso da sua empresa. A verificação empresarial será uma etapa separada e poderá ser concluída depois.</p>';form.insertBefore(intro,form.firstChild)}
 if(!form.closest('.em-cad-shell')){const shell=document.createElement('div');shell.className='em-cad-shell';form.parentNode.insertBefore(shell,form);shell.appendChild(form);const aside=document.createElement('aside');aside.className='em-cad-aside';aside.innerHTML='<div class="em-cad-aside-badge">EMPREGAÍ PARA EMPRESAS</div><h2>Comece a recrutar com uma conta profissional.</h2><p>O cadastro inicial é simples. Depois, você poderá completar o perfil, publicar vagas e solicitar a verificação da empresa.</p><div class="em-cad-benefits"><div><i>✓</i><span><b>Cadastro rápido</b><small>Somente os dados essenciais para criar a conta.</small></span></div><div><i>✓</i><span><b>E-mails separados</b><small>Conta corporativa e recebimento de currículos ficam organizados.</small></span></div><div><i>✓</i><span><b>Verificação depois</b><small>A validação da empresa é feita em uma etapa própria.</small></span></div><div><i>✓</i><span><b>Gestão de vagas</b><small>Publique e acompanhe seus processos seletivos pelo painel.</small></span></div></div><div class="em-cad-security"><b>Ambiente empresarial</b><span>Seus dados cadastrais ficam vinculados à conta da empresa.</span></div>';shell.appendChild(aside)}
 const submit=form.querySelector('button[type="submit"],input[type="submit"]');if(submit){submit.classList.add('em-cad-submit');if(submit.tagName==='BUTTON')submit.textContent='Criar conta da empresa'}
 const msgBox=document.getElementById('msgCadastroEmpresa');if(msgBox)msgBox.classList.add('em-cad-msg');
 const title=pagina?.querySelector('h1');if(title)title.textContent='Cadastre sua empresa';
 const subt=[...(pagina?.querySelectorAll('p')||[])].find(p=>/publicar|gerenciar|oportunidades/i.test(p.textContent||''));if(subt)subt.textContent='Crie sua conta empresarial e comece a publicar oportunidades no + Empregos.';
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(reformularCadastroEmpresaProEM,0));
window.addEventListener('load',()=>setTimeout(reformularCadastroEmpresaProEM,120));
document.addEventListener('click',e=>{const b=e.target.closest('button,a');if(b&&/cadastrar empresa|criar conta da empresa/i.test(b.textContent||''))setTimeout(reformularCadastroEmpresaProEM,120)});


/* EMPREGAMAI-CADASTRO-EMPRESA-PRO-ROUTE-FIX-V1 */
setTimeout(()=>{try{if(new URLSearchParams(location.search).get('pagina')==='cadastro-empresa')reformularCadastroEmpresaProEM()}catch(e){console.error(e)}},80);


/* EMPREGAMAI-CADASTRO-EMPRESA-LARGURA-FIX-V1 */
(function(){
 const st=document.createElement('style');
 st.id='estilosCadastroEmpresaLarguraFixEM';
 st.textContent='.em-cad-shell{width:min(1180px,calc(100vw - 64px))!important;max-width:none!important;margin:34px 0 48px 50%!important;transform:translateX(-50%)!important;grid-template-columns:minmax(0,2fr) minmax(320px,.9fr)!important;gap:22px!important;align-items:start!important}.em-cad-form-pro{width:100%!important;max-width:none!important;min-width:0!important;padding:26px 28px!important;gap:15px 18px!important}.em-cad-form-pro>label,.em-cad-form-pro>.em-cad-field,.em-cad-form-pro .em-cad-field{width:100%!important;max-width:none!important;min-width:0!important}.em-cad-form-pro input:not([type="checkbox"]){width:100%!important;max-width:none!important;min-width:0!important}.em-cad-form-intro{padding-bottom:16px!important}.em-cad-form-intro h2{font-size:22px!important;margin:9px 0 5px!important}.em-cad-form-intro p{font-size:12.5px!important}.em-cad-field-candidaturas{padding:12px 14px!important}.em-cad-aside{width:100%!important;min-height:0!important;padding:27px 28px!important}.em-cad-aside h2{font-size:22px!important;margin:14px 0 8px!important}.em-cad-aside>p{font-size:12.5px!important;margin-bottom:18px!important}.em-cad-benefits{gap:5px!important}.em-cad-benefits>div{padding:9px 0!important}.em-cad-security{padding-top:14px!important;margin-top:14px!important}.em-cad-submit{margin-top:2px!important}@media(max-width:1000px){.em-cad-shell{width:min(920px,calc(100vw - 32px))!important;grid-template-columns:minmax(0,1.7fr) minmax(280px,.8fr)!important}}@media(max-width:820px){.em-cad-shell{width:calc(100vw - 22px)!important;grid-template-columns:1fr!important;margin-top:22px!important}.em-cad-aside{order:2!important}.em-cad-form-pro{padding:22px!important}}@media(max-width:620px){.em-cad-form-pro{grid-template-columns:1fr!important;padding:17px!important}.em-cad-shell{width:calc(100vw - 14px)!important}.em-cad-aside{padding:20px!important}}';
 document.head.appendChild(st);
})();


/* EMPREGAMAI-CADASTRO-EMPRESA-ESTRUTURA-FIX-V2 */
function corrigirEstruturaCadastroEmpresaEM(){
 if(document.getElementById('pagina-cadastro-empresa')?.dataset.cadastroV4==='1')return;
 const nome=document.getElementById('cadEmpresaNome');if(!nome)return;
 const form=nome.closest('form');if(!form)return;
 const pagina=form.closest('[id^="pagina-"]')||document.getElementById('pagina-cadastro-empresa');if(!pagina)return;

 instalarEstilosCadastroEmpresaProEM();

 let shell=form.closest('.em-cad-shell');
 if(!shell){
   reformularCadastroEmpresaProEM();
   shell=form.closest('.em-cad-shell');
 }
 if(!shell)return;

 /* tira o cadastro do container estreito legado */
 if(shell.parentElement!==pagina){
   pagina.appendChild(shell);
 }

 /* esconde apenas wrappers antigos que ficaram vazios após mover o formulário */
 [...pagina.children].forEach(el=>{
   if(el===shell)return;
   if(el.contains(shell))return;
   const temCampo=el.querySelector?.('#cadEmpresaNome,#cadEmpresaCnpj,#cadEmpresaEmail,#cadEmpresaTelefone,#cadEmpresaSenha,#cadEmpresaSenha2');
   if(!temCampo && el.classList?.contains('form-card') && !el.textContent.trim())el.style.display='none';
 });

 /* identifica corretamente cada bloco de campo, mesmo quando não é <label> */
 const campo=(el)=>{
   if(!el)return null;
   return el.closest('.campo,.form-field,.form-group,label')||el.parentElement;
 };
 const mapa=[
   [document.getElementById('cadEmpresaNome'),'Nome da empresa'],
   [document.getElementById('cadEmpresaCnpj'),'CNPJ'],
   [document.getElementById('cadEmpresaEmail'),'E-mail corporativo'],
   [document.getElementById('cadEmpresaTelefone'),'Telefone corporativo'],
   [document.getElementById('cadEmpresaSenha'),'Crie uma senha'],
   [document.getElementById('cadEmpresaSenha2'),'Confirme a senha']
 ];
 mapa.forEach(([el,titulo])=>{
   const bloco=campo(el);if(!bloco)return;
   bloco.classList.add('em-cad-field','em-cad-field-fix');
   let tx=bloco.querySelector(':scope > label,:scope > span,:scope > strong,:scope > b');
   if(tx && tx!==el)tx.textContent=titulo;
 });

 let rec=document.getElementById('cadEmpresaEmailCandidaturas');
 if(!rec){
   const box=document.createElement('div');
   box.className='em-cad-field em-cad-field-candidaturas em-cad-email-rec-fix';
   box.innerHTML='<label for="cadEmpresaEmailCandidaturas">E-mail para recebimento de candidaturas</label><input id="cadEmpresaEmailCandidaturas" type="email" required autocomplete="email" placeholder="rh@suaempresa.com.br"><small class="em-cad-help">Este será o e-mail padrão para vagas que recebem currículos por e-mail.</small><label class="em-cad-same"><input id="cadEmpresaMesmoEmailEM" type="checkbox"><span>Usar o mesmo e-mail corporativo</span></label>';
   const senhaBloco=campo(document.getElementById('cadEmpresaSenha'));
   if(senhaBloco)form.insertBefore(box,senhaBloco);else form.appendChild(box);
   rec=box.querySelector('#cadEmpresaEmailCandidaturas');
 }
 const recBox=rec.closest('.cad-empresa-email-candidaturas-em,.em-cad-field-candidaturas')||rec.parentElement;
 if(recBox){
   recBox.classList.add('em-cad-field','em-cad-field-candidaturas','em-cad-email-rec-fix');
   const senhaBloco=campo(document.getElementById('cadEmpresaSenha'));
   if(senhaBloco && recBox.nextElementSibling!==senhaBloco)form.insertBefore(recBox,senhaBloco);
 }

 const email=document.getElementById('cadEmpresaEmail'),mesmo=document.getElementById('cadEmpresaMesmoEmailEM');
 if(email&&rec&&mesmo){
   const sync=()=>{rec.readOnly=mesmo.checked;if(mesmo.checked)rec.value=email.value.trim().toLowerCase()};
   mesmo.onchange=sync;
   email.addEventListener('input',()=>{if(mesmo.checked)sync()});
 }

 form.classList.add('em-cad-form-pro','em-cad-form-fix-v2');
 shell.classList.add('em-cad-shell-fix-v2');
}
(function(){
 const st=document.createElement('style');st.id='estilosCadastroEmpresaEstruturaFixV2';
 st.textContent='.em-cadastro-empresa-pro .em-cad-shell-fix-v2{width:min(1220px,calc(100vw - 48px))!important;max-width:1220px!important;margin:32px auto 56px!important;transform:none!important;position:relative!important;left:auto!important;right:auto!important;grid-template-columns:minmax(0,1.8fr) minmax(330px,.85fr)!important;gap:24px!important;padding:0!important}.em-cad-form-fix-v2{width:100%!important;max-width:none!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:16px 18px!important}.em-cad-form-fix-v2 .em-cad-field-fix{width:100%!important;min-width:0!important;max-width:none!important;display:grid!important;gap:7px!important}.em-cad-form-fix-v2 .em-cad-field-fix input{width:100%!important;max-width:none!important;min-width:0!important}.em-cad-email-rec-fix{grid-column:1/-1!important}.em-cad-email-rec-fix>input{width:100%!important}.em-cad-aside{min-width:0!important}@media(max-width:900px){.em-cadastro-empresa-pro .em-cad-shell-fix-v2{width:min(760px,calc(100vw - 24px))!important;grid-template-columns:1fr!important}.em-cad-aside{order:2}}@media(max-width:620px){.em-cad-form-fix-v2{grid-template-columns:1fr!important}.em-cad-email-rec-fix{grid-column:1!important}}';
 document.head.appendChild(st);
})();

const _reformularCadastroEmpresaProEMV2=reformularCadastroEmpresaProEM;
reformularCadastroEmpresaProEM=function(){
 const r=_reformularCadastroEmpresaProEMV2.apply(this,arguments);
 setTimeout(corrigirEstruturaCadastroEmpresaEM,0);
 return r;
};
setTimeout(corrigirEstruturaCadastroEmpresaEM,120);


/* EMPREGAMAI-CADASTRO-EMPRESA-VISUAL-FINAL-V3 */
(function(){
 const st=document.createElement('style');
 st.id='estilosCadastroEmpresaVisualFinalV3';
 st.textContent=
 '#pagina-cadastro-empresa{width:100%!important;max-width:none!important;margin:0!important;padding:0!important;background:#f5f8fa!important;overflow:visible!important}'+
 '#pagina-cadastro-empresa>.container,#pagina-cadastro-empresa>.wrap,#pagina-cadastro-empresa>.conteudo,#pagina-cadastro-empresa>.page-inner,#pagina-cadastro-empresa .container,#pagina-cadastro-empresa .wrap{max-width:none!important;width:100%!important}'+
 '#pagina-cadastro-empresa .em-cad-shell{width:min(1120px,calc(100vw - 48px))!important;max-width:1120px!important;margin:36px auto 56px!important;transform:none!important;left:auto!important;right:auto!important;display:grid!important;grid-template-columns:minmax(0,1.75fr) minmax(320px,.85fr)!important;gap:24px!important;align-items:start!important}'+
 '#pagina-cadastro-empresa .em-cad-form-pro{width:100%!important;max-width:none!important;min-width:0!important;padding:28px 30px!important;border:1px solid #d8e4ea!important;border-radius:18px!important;box-shadow:0 12px 32px rgba(20,60,78,.08)!important;background:#fff!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:16px 20px!important}'+
 '#pagina-cadastro-empresa .em-cad-form-pro .em-cad-field,#pagina-cadastro-empresa .em-cad-form-pro>label,#pagina-cadastro-empresa .em-cad-form-pro .campo,#pagina-cadastro-empresa .em-cad-form-pro .form-field,#pagina-cadastro-empresa .em-cad-form-pro .form-group{width:100%!important;max-width:none!important;min-width:0!important}'+
 '#pagina-cadastro-empresa .em-cad-form-pro input:not([type="checkbox"]){width:100%!important;max-width:none!important;min-width:0!important;height:46px!important;border-radius:9px!important;border:1px solid #c9d8df!important;background:#fff!important;color:#263f4c!important;font:500 14px Montserrat,Arial,sans-serif!important}'+
 '#pagina-cadastro-empresa .em-cad-form-pro input:not([type="checkbox"]):focus{border-color:#19748a!important;box-shadow:0 0 0 3px rgba(25,116,138,.10)!important}'+
 '#pagina-cadastro-empresa .em-cad-form-intro{padding-bottom:16px!important;margin-bottom:0!important}'+
 '#pagina-cadastro-empresa .em-cad-form-intro>span{background:#eaf3f6!important;color:#195d72!important}'+
 '#pagina-cadastro-empresa .em-cad-form-intro h2{color:#173f51!important;font-size:23px!important}'+
 '#pagina-cadastro-empresa .em-cad-form-intro p{color:#667b86!important}'+
 '#pagina-cadastro-empresa .em-cad-field-candidaturas{grid-column:1/-1!important;background:#f7fafc!important;border:1px solid #d9e6eb!important;border-radius:11px!important;padding:14px 16px!important}'+
 '#pagina-cadastro-empresa .em-cad-same,#pagina-cadastro-empresa .cad-email-mesmo-em{color:#4f6874!important}'+
 '#pagina-cadastro-empresa .em-cad-submit{background:#17657a!important;color:#fff!important;border-radius:9px!important;box-shadow:none!important;padding:0 22px!important;height:46px!important}'+
 '#pagina-cadastro-empresa .em-cad-submit:hover{background:#124f61!important}'+
 '#pagina-cadastro-empresa .em-cad-aside{width:100%!important;min-width:0!important;background:#164f61!important;border-radius:18px!important;padding:28px!important;box-shadow:0 12px 32px rgba(20,60,78,.10)!important;color:#fff!important}'+
 '#pagina-cadastro-empresa .em-cad-aside-badge{background:#fff!important;color:#164f61!important;border-color:#fff!important}'+
 '#pagina-cadastro-empresa .em-cad-aside h2{font-size:23px!important;color:#fff!important}'+
 '#pagina-cadastro-empresa .em-cad-aside>p{color:rgba(255,255,255,.82)!important}'+
 '#pagina-cadastro-empresa .em-cad-benefits>div{border-color:rgba(255,255,255,.14)!important}'+
 '#pagina-cadastro-empresa .em-cad-benefits i{background:#fff!important;color:#164f61!important}'+
 '#pagina-cadastro-empresa .em-cad-benefits b{color:#fff!important}'+
 '#pagina-cadastro-empresa .em-cad-benefits small{color:rgba(255,255,255,.74)!important}'+
 '#pagina-cadastro-empresa .em-cad-security span{color:rgba(255,255,255,.72)!important}'+
 '#pagina-cadastro-empresa .page-hero,#pagina-cadastro-empresa .hero,#pagina-cadastro-empresa>section:first-child{background:#eef5f7!important;color:#173f51!important;padding:34px 0!important;min-height:auto!important}'+
 '#pagina-cadastro-empresa .page-hero h1,#pagina-cadastro-empresa .hero h1,#pagina-cadastro-empresa>section:first-child h1{color:#173f51!important;font-size:38px!important}'+
 '#pagina-cadastro-empresa .page-hero p,#pagina-cadastro-empresa .hero p,#pagina-cadastro-empresa>section:first-child p{color:#607681!important}'+
 '@media(max-width:980px){#pagina-cadastro-empresa .em-cad-shell{width:min(760px,calc(100vw - 28px))!important;grid-template-columns:1fr!important}#pagina-cadastro-empresa .em-cad-aside{order:2!important}}'+
 '@media(max-width:640px){#pagina-cadastro-empresa .em-cad-shell{width:calc(100vw - 16px)!important;margin:18px auto 34px!important}#pagina-cadastro-empresa .em-cad-form-pro{grid-template-columns:1fr!important;padding:18px!important}#pagina-cadastro-empresa .em-cad-field-candidaturas{grid-column:1!important}#pagina-cadastro-empresa .em-cad-aside{padding:20px!important}#pagina-cadastro-empresa .page-hero,#pagina-cadastro-empresa .hero,#pagina-cadastro-empresa>section:first-child{padding:24px 16px!important}#pagina-cadastro-empresa .page-hero h1,#pagina-cadastro-empresa .hero h1,#pagina-cadastro-empresa>section:first-child h1{font-size:30px!important}}';
 document.head.appendChild(st);
})();


/* EMPREGAMAI-CADASTRO-EMPRESA-FINAL-WIDE-V4 */
(function(){
 const st=document.createElement('style');
 st.id='estilosCadastroEmpresaFinalWideV4';
 st.textContent=
 '#pagina-cadastro-empresa .em-cad-shell{width:min(1180px,calc(100vw - 64px))!important;max-width:1180px!important;margin:48px auto 64px!important;grid-template-columns:minmax(0,1.9fr) minmax(360px,.9fr)!important;gap:28px!important}'+
 '#pagina-cadastro-empresa .em-cad-form-pro{padding:30px 34px!important;grid-template-columns:repeat(2,minmax(250px,1fr))!important;column-gap:22px!important;row-gap:18px!important}'+
 '#pagina-cadastro-empresa .em-cad-form-pro .campo,#pagina-cadastro-empresa .em-cad-form-pro .form-field,#pagina-cadastro-empresa .em-cad-form-pro .form-group,#pagina-cadastro-empresa .em-cad-form-pro label{min-width:0!important;width:100%!important;max-width:none!important}'+
 '#pagina-cadastro-empresa .em-cad-form-pro input:not([type="checkbox"]){width:100%!important;min-width:0!important;max-width:none!important;height:48px!important}'+
 '#pagina-cadastro-empresa .em-cad-field-candidaturas{grid-column:1/-1!important;width:100%!important}'+
 '#pagina-cadastro-empresa .em-cad-aside{padding:30px 32px!important}'+
 '#pagina-cadastro-empresa .em-cad-aside h2{max-width:320px!important}'+
 '#pagina-cadastro-empresa .em-cad-benefits small{color:rgba(255,255,255,.82)!important}'+
 '#pagina-cadastro-empresa .em-cad-aside>p{color:rgba(255,255,255,.88)!important}'+
 '#pagina-cadastro-empresa .em-cad-aside-badge{background:rgba(255,255,255,.12)!important;color:#fff!important;border:1px solid rgba(255,255,255,.22)!important}'+
 '#pagina-cadastro-empresa .em-cad-form-pro .em-cad-field-fix>label,#pagina-cadastro-empresa .em-cad-form-pro .em-cad-field-fix>span,#pagina-cadastro-empresa .em-cad-form-pro>label{font-size:13px!important;line-height:1.25!important;white-space:normal!important}'+
 '#pagina-cadastro-empresa .em-cad-form-pro .em-cad-field-fix{overflow:visible!important}'+
 '@media(max-width:1050px){#pagina-cadastro-empresa .em-cad-shell{width:min(940px,calc(100vw - 32px))!important;grid-template-columns:minmax(0,1.6fr) minmax(320px,.85fr)!important}#pagina-cadastro-empresa .em-cad-form-pro{grid-template-columns:repeat(2,minmax(210px,1fr))!important;padding:26px!important}}'+
 '@media(max-width:850px){#pagina-cadastro-empresa .em-cad-shell{width:min(720px,calc(100vw - 24px))!important;grid-template-columns:1fr!important}#pagina-cadastro-empresa .em-cad-form-pro{grid-template-columns:repeat(2,minmax(0,1fr))!important}#pagina-cadastro-empresa .em-cad-aside{order:2!important}}'+
 '@media(max-width:620px){#pagina-cadastro-empresa .em-cad-form-pro{grid-template-columns:1fr!important;padding:18px!important}#pagina-cadastro-empresa .em-cad-shell{width:calc(100vw - 16px)!important;margin:20px auto 38px!important}}';
 document.head.appendChild(st);
})();

function bindCadastroEmpresaV4EM(){
 const pg=document.getElementById('pagina-cadastro-empresa');
 if(!pg||pg.dataset.cadastroV4!=='1')return;
 const e=document.getElementById('cadEmpresaEmail'),r=document.getElementById('cadEmpresaEmailCandidaturas'),c=document.getElementById('cadEmpresaMesmoEmailEM');
 if(!e||!r||!c||c.dataset.bindV4==='1')return;
 c.dataset.bindV4='1';
 const sync=()=>{r.readOnly=c.checked;if(c.checked)r.value=e.value.trim().toLowerCase()};
 c.addEventListener('change',sync);
 e.addEventListener('input',()=>{if(c.checked)sync()});
}
document.addEventListener('DOMContentLoaded',bindCadastroEmpresaV4EM);
window.addEventListener('load',()=>setTimeout(bindCadastroEmpresaV4EM,50));


/* EMPREGAI-DESTAQUES-UNICO-V9
   Fonte única de comportamento visual dos cards em destaque.
   Os overrides V1-V6 antigos foram removidos para evitar conflito. */
document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>carregarDestaquesPublicosEM().then(()=>renderDestaquesEM(vagasDestaqueOrdenadasEM())).catch(()=>{}),250));
window.addEventListener('resize',()=>{clearTimeout(window.__emResizeDest);window.__emResizeDest=setTimeout(()=>{const el=document.getElementById('listaDestaques');if(el)renderDestaquesEM(vagasDestaqueOrdenadasEM())},120)});

(function(){
 const st=document.createElement('style');
 st.id='empregaiDestaquesUnicoV9';
 st.textContent=`
 #listaDestaques{gap:18px!important;align-items:stretch!important}
 #listaDestaques .portal-vaga-nova{position:relative!important;display:flex!important;flex-direction:column!important;min-width:0!important;height:440px!important;min-height:440px!important;max-height:440px!important;padding:20px 22px 18px!important;background:#fff!important;border:1px solid #dbe7f0!important;border-left:5px solid #1597e5!important;border-radius:20px!important;box-shadow:0 12px 32px rgba(28,75,105,.07)!important;overflow:hidden!important;color:#123f68!important;aspect-ratio:auto!important}
 #listaDestaques .vaga-destaque-selos-topo{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:6px!important;min-height:31px!important;height:auto!important;margin:0 0 15px!important;overflow:visible!important}
 #listaDestaques .vaga-selo{font:800 10px/1 Montserrat,Arial,sans-serif!important;min-height:30px!important;height:auto!important;padding:8px 11px!important;border-radius:8px!important;letter-spacing:.02em!important}
 #listaDestaques .destaque-selo{background:#eef9ff!important;color:#0879bf!important;border:1px solid #55bdf2!important;box-shadow:none!important}
 #listaDestaques .candidatura-facil-selo{background:#f4f8fb!important;color:#48677f!important;border:1px solid #d7e2e9!important;box-shadow:none!important}
 #listaDestaques .vaga-identidade{display:grid!important;grid-template-columns:84px minmax(0,1fr)!important;gap:16px!important;align-items:center!important;height:auto!important;min-height:92px!important;flex:0 0 auto!important;margin:0 0 16px!important}
 #listaDestaques .vaga-logo{width:84px!important;height:84px!important;min-width:84px!important;border-radius:16px!important;border:1px solid #dbe5ec!important;background:#fff!important;object-fit:contain!important;padding:8px!important}
 #listaDestaques .vaga-logo-fallback{display:flex!important;align-items:center!important;justify-content:center!important;font-size:30px!important;font-weight:800!important;color:#06477b!important;background:#f7fbfd!important;padding:0!important}
 #listaDestaques .vaga-identidade-copy{min-width:0!important;display:flex!important;flex-direction:column!important}
 #listaDestaques .vaga-identidade-copy h3{order:2!important;margin:7px 0 0!important;color:#063d70!important;font:800 18px/1.22 Montserrat,Arial,sans-serif!important;letter-spacing:-.35px!important;white-space:normal!important;text-overflow:clip!important;display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:unset!important;min-height:44px!important;max-height:none!important;overflow:visible!important}
 #listaDestaques .vaga-identidade-copy p{order:1!important;margin:0!important;color:#56738a!important;font:500 12px/1.35 Montserrat,Arial,sans-serif!important;white-space:normal!important;overflow:visible!important}
 #listaDestaques .vaga-meta{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;height:auto!important;min-height:84px!important;flex:0 0 auto!important;margin:0 0 14px!important;overflow:visible!important}
 #listaDestaques .vaga-meta>span{display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;min-width:0!important;height:38px!important;padding:0 10px!important;border:1px solid #dce8ef!important;border-radius:12px!important;background:#f7fbfd!important;color:#244f70!important;font:700 11px/1.2 Montserrat,Arial,sans-serif!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
 #listaDestaques .vaga-meta>.vaga-meta-local{grid-column:1/-1!important;border-color:#62c4f2!important;background:#eefaff!important;color:#064b78!important}
 #listaDestaques .vaga-resumo-area{height:auto!important;min-height:60px!important;flex:1 1 auto!important;padding:0 0 12px!important;margin:0!important;border:0!important;overflow:hidden!important}
 #listaDestaques .vaga-resumo-area>small{display:block!important;margin-bottom:7px!important;color:#6f8597!important;font:800 9px/1 Montserrat,Arial,sans-serif!important;letter-spacing:.09em!important}
 #listaDestaques .vaga-resumo-area .vaga-resumo{margin:0!important;color:#49677e!important;font:500 12px/1.48 Montserrat,Arial,sans-serif!important;display:-webkit-box!important;-webkit-box-orient:vertical!important;-webkit-line-clamp:2!important;overflow:hidden!important;min-height:35px!important;max-height:36px!important}
 #listaDestaques .vaga-card-rodape{height:auto!important;min-height:74px!important;max-height:none!important;flex:0 0 auto!important;margin-top:auto!important;padding:12px 0 0!important;border-top:1px solid #e5edf2!important;display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;grid-template-areas:"date date" "salary button"!important;grid-template-rows:auto auto!important;align-items:end!important;gap:8px 12px!important;overflow:visible!important;background:#fff!important}
 #listaDestaques .vaga-rodape-salario{grid-area:salary!important;min-width:0!important;overflow:visible!important}
 #listaDestaques .vaga-rodape-salario small{display:block!important;margin-bottom:6px!important;color:#6f8597!important;font:800 9px/1 Montserrat,Arial,sans-serif!important;text-transform:uppercase!important;letter-spacing:.08em!important}
 #listaDestaques .vaga-rodape-salario .salario-card{display:block!important;color:#073f70!important;font:800 18px/1.1 Montserrat,Arial,sans-serif!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
 #listaDestaques .data-card-em{grid-area:date!important;display:block!important;text-align:right!important;justify-self:end!important;margin:0!important;color:#70879a!important;font:500 10px/1.3 Montserrat,Arial,sans-serif!important;white-space:nowrap!important}
 #listaDestaques .vaga-ver-btn{grid-area:button!important;display:flex!important;align-items:center!important;justify-content:center!important;min-width:116px!important;width:auto!important;height:43px!important;min-height:43px!important;padding:0 18px!important;margin:0!important;border:0!important;border-radius:11px!important;background:#078bc9!important;color:#fff!important;font:800 11px/1 Montserrat,Arial,sans-serif!important;box-shadow:none!important}
 #listaDestaques .vaga-ver-btn:hover{background:#057bb3!important;transform:translateY(-1px)!important}
 @media(max-width:1050px) and (min-width:701px){#listaDestaques .portal-vaga-nova{height:430px!important;min-height:430px!important;max-height:430px!important}}
 @media(max-width:700px){#listaDestaques .portal-vaga-nova{height:auto!important;min-height:0!important;max-height:none!important;padding:18px!important;border-radius:18px!important}#listaDestaques .vaga-identidade{grid-template-columns:74px minmax(0,1fr)!important;gap:13px!important}#listaDestaques .vaga-logo{width:74px!important;height:74px!important;min-width:74px!important}#listaDestaques .vaga-identidade-copy h3{font-size:17px!important}#listaDestaques .vaga-meta{grid-template-columns:1fr 1fr!important;min-height:84px!important}}
 `;
 document.head.appendChild(st);
})();

/* EMPREGAMAI-CONFIRMACAO-DESATIVAR-NOTIFICACOES-V1 */
(function(){
  function aplicarConfirmacaoDesativarNotificacoesEM(){
    const btn=document.getElementById('emPushDesativar');
    if(!btn||btn.dataset.emConfirmacaoDesativar==='1'||typeof btn.onclick!=='function')return;
    const acaoOriginal=btn.onclick;
    btn.dataset.emConfirmacaoDesativar='1';
    btn.onclick=async function(ev){
      ev?.preventDefault?.();
      ev?.stopPropagation?.();
      const ok=typeof window.confirmarAcaoEmpregaiEM==='function'
        ?await window.confirmarAcaoEmpregaiEM({
          titulo:'Desativar notificações?',
          texto:'Você deixará de receber neste celular alertas de novas vagas, mensagens e atualizações dos seus processos seletivos.',
          confirmarTexto:'Sim, desativar',
          cancelarTexto:'Cancelar',
          perigo:false
        })
        :window.confirm('Deseja realmente desativar as notificações neste celular?');
      if(!ok)return;
      return acaoOriginal.call(btn,ev);
    };
  }

  document.addEventListener('DOMContentLoaded',()=>{
    aplicarConfirmacaoDesativarNotificacoesEM();
    const obs=new MutationObserver(aplicarConfirmacaoDesativarNotificacoesEM);
    obs.observe(document.body,{childList:true,subtree:true});
  });

  window.addEventListener('load',()=>setTimeout(aplicarConfirmacaoDesativarNotificacoesEM,200));
})();


/* EMPREGAMAI-AUTH-SESSION-GUARD-V6
   Autoridade única para logout de candidato/empresa.
   - bloqueia restauração e refresh durante a saída;
   - revoga a sessão no Supabase;
   - limpa credenciais locais duas vezes contra corridas assíncronas;
   - sincroniza logout entre abas;
   - mantém a interface pública coerente mesmo em pageshow/visibilitychange. */
(function(){
  const AUTH_GUARD_VERSION='6.0.0';
  const LOGOUT_FLAG='empregaMaisLogoutBloqueio';
  const LOGOUT_EVENT='empregaMaisLogoutEvento';
  const PROJECT_REF='mkezlcewyengejdmtppl';
  let logoutExecutando=false;
  let canalLogout=null;

  window.EMPREGAMAIS_AUTH_GUARD_VERSION=AUTH_GUARD_VERSION;

  function instalarCssConfirmacaoLogoutEM(){
    if(document.getElementById('emConfirmacaoAcoesCss'))return;
    const st=document.createElement('style');
    st.id='emConfirmacaoAcoesCss';
    st.textContent=
      '.em-confirmacao-acao-modal{position:fixed;inset:0;z-index:999999;display:grid;place-items:center;padding:20px}'+
      '.em-confirmacao-acao-backdrop{position:absolute;inset:0;background:rgba(8,25,43,.52);backdrop-filter:blur(2px)}'+
      '.em-confirmacao-acao-card{position:relative;width:min(420px,100%);background:#fff;border:1px solid #dbe7ee;border-radius:20px;padding:26px;box-shadow:0 24px 70px rgba(8,38,61,.24);text-align:center;font-family:Montserrat,Arial,sans-serif}'+
      '.em-confirmacao-acao-icone{width:52px;height:52px;margin:0 auto 14px;border-radius:50%;display:grid;place-items:center;background:#eaf6fd;color:#117eaf;font-size:22px;font-weight:800}'+
      '.em-confirmacao-acao-card h3{margin:0;color:#153f59;font-size:20px;line-height:1.2;font-weight:800}'+
      '.em-confirmacao-acao-card p{margin:10px auto 20px;color:#5d7484;font-size:14px;line-height:1.55;max-width:340px}'+
      '.em-confirmacao-acao-botoes{display:grid;grid-template-columns:1fr 1fr;gap:10px}'+
      '.em-confirmacao-acao-botoes button{min-height:44px;border-radius:11px;padding:0 16px;font:700 13px/1 Montserrat,Arial,sans-serif;cursor:pointer}'+
      '.em-confirmacao-cancelar{background:#fff;color:#476173;border:1px solid #cedde6}'+
      '.em-confirmacao-confirmar{background:#0d86ba;color:#fff;border:1px solid #0d86ba}'+
      '@media(max-width:520px){.em-confirmacao-acao-card{padding:22px 18px;border-radius:17px}.em-confirmacao-acao-botoes{grid-template-columns:1fr}.em-confirmacao-cancelar{order:2}}';
    document.head.appendChild(st);
  }

  window.confirmarAcaoEmpregaiEM=function(opcoes){
    instalarCssConfirmacaoLogoutEM();
    const o=Object.assign({
      titulo:'Confirmar ação',
      texto:'Deseja continuar?',
      confirmarTexto:'Confirmar',
      cancelarTexto:'Cancelar'
    },opcoes||{});

    return new Promise(resolve=>{
      document.getElementById('emConfirmacaoAcaoModal')?.remove();
      const modal=document.createElement('div');
      modal.id='emConfirmacaoAcaoModal';
      modal.className='em-confirmacao-acao-modal';
      modal.innerHTML=
        '<div class="em-confirmacao-acao-backdrop"></div>'+
        '<div class="em-confirmacao-acao-card" role="dialog" aria-modal="true">'+
          '<div class="em-confirmacao-acao-icone">↪</div>'+
          '<h3>'+esc(o.titulo)+'</h3>'+
          '<p>'+esc(o.texto)+'</p>'+
          '<div class="em-confirmacao-acao-botoes">'+
            '<button type="button" class="em-confirmacao-cancelar">'+esc(o.cancelarTexto)+'</button>'+
            '<button type="button" class="em-confirmacao-confirmar">'+esc(o.confirmarTexto)+'</button>'+
          '</div>'+
        '</div>';

      const fechar=valor=>{modal.remove();resolve(valor)};
      modal.querySelector('.em-confirmacao-cancelar').onclick=()=>fechar(false);
      modal.querySelector('.em-confirmacao-confirmar').onclick=()=>fechar(true);
      modal.querySelector('.em-confirmacao-acao-backdrop').onclick=()=>fechar(false);
      document.body.appendChild(modal);
    });
  };

  function marcarLogoutEM(propagar=true){
    try{localStorage.setItem(LOGOUT_FLAG,'1')}catch(_){}
    try{sessionStorage.setItem(LOGOUT_FLAG,'1')}catch(_){}
    if(propagar){
      const evento=String(Date.now());
      try{localStorage.setItem(LOGOUT_EVENT,evento)}catch(_){}
      try{canalLogout?.postMessage({tipo:'logout',evento})}catch(_){}
    }
  }

  function chaveAuthSupabaseEM(k){
    return k==='empregaMaisSupabaseAccessToken'||
      k==='empregaMaisSupabaseRefreshToken'||
      k===EMPREGAMAIS_SB_TOKEN||
      k===EMPREGAMAIS_SB_REFRESH||
      /^sb-[a-z0-9]+-auth-token$/i.test(String(k||''))||
      String(k||'')==='supabase.auth.token';
  }

  function removerChavesAuthDinamicasEM(storage){
    try{
      const apagar=[];
      for(let i=0;i<storage.length;i++){
        const k=storage.key(i);
        if(chaveAuthSupabaseEM(k))apagar.push(k);
      }
      apagar.forEach(k=>storage.removeItem(k));
    }catch(_){}
  }

  function limparSessaoEmpregaiEM(opcoes){
    const o=Object.assign({propagar:false},opcoes||{});
    const tema=(()=>{try{return sessionStorage.getItem('temaEmpregaMais')||''}catch(_){return ''}})();

    marcarLogoutEM(o.propagar);

    const remover=[
      'empregaMaisSupabaseAccessToken','empregaMaisSupabaseRefreshToken',
      'empregaMaisPapel','empregaMaisPapelPersistido','empregaMaisGooglePapel',
      'empresaSupabaseAuthUserId','empresaSupabaseUserId','empresaSupabaseEmpresaId',
      'empresaUsuarioAdministrador','empresaCnpj','empresaNome',
      'candidatoSupabaseUserId','candidatoEmail','candidatoNome',
      'googleCandidatoPendente','googleEmpresaPendente','googleEmailPendente','googleNomePendente',
      'candidatoPremiumVerificadoEM','retornoCandidatura','retornoSalvarVaga','vagaSelecionada','vagaAtual'
    ];

    remover.forEach(k=>{
      try{sessionStorage.removeItem(k)}catch(_){}
      try{localStorage.removeItem(k)}catch(_){}
    });

    removerChavesAuthDinamicasEM(sessionStorage);
    removerChavesAuthDinamicasEM(localStorage);

    try{sessionStorage.setItem(LOGOUT_FLAG,'1')}catch(_){}
    try{localStorage.setItem(LOGOUT_FLAG,'1')}catch(_){}
    if(tema)try{sessionStorage.setItem('temaEmpregaMais',tema)}catch(_){}

    try{
      if(typeof sbCandidaturasCacheEM!=='undefined')sbCandidaturasCacheEM=[];
      if(typeof sbCandidaturasCarregadasEM!=='undefined')sbCandidaturasCarregadasEM=false;
      if(typeof sbVagasCacheEM!=='undefined')sbVagasCacheEM=[];
    }catch(_){}
  }

  function aplicarEstadoPublicoEM(){
    try{
      document.body.classList.remove('tem-empresa','tem-candidato','sessao-empresa','sessao-candidato');
      document.body.classList.add('sessao-publica');
      document.querySelectorAll('.menu-drop,.sessao-conta-menu').forEach(x=>x.classList.remove('aberto'));
      if(typeof atualizarMenusTopo==='function')atualizarMenusTopo();
      if(typeof atualizarHeaderContextualEM==='function')atualizarHeaderContextualEM();
    }catch(_){}
  }

  async function revogarSessaoSupabaseEM(token){
    if(!token)return true;
    const ctrl=new AbortController();
    const timer=setTimeout(()=>ctrl.abort(),3000);
    try{
      const r=await fetch(EMPREGAMAIS_SUPABASE_URL+'/auth/v1/logout?scope=global',{
        method:'POST',
        headers:sbHeadersEM(token),
        signal:ctrl.signal,
        cache:'no-store',
        credentials:'omit',
        keepalive:true
      });
      return r.ok||r.status===401||r.status===403;
    }catch(_){
      return false;
    }finally{
      clearTimeout(timer);
    }
  }

  async function logoutDefinitivoEmpregaiEM(){
    if(logoutExecutando)return;
    logoutExecutando=true;

    const token=typeof sbTokenEM==='function'?sbTokenEM():'';

    /* O bloqueio entra ANTES de qualquer await. Assim nenhum refresh/restauração
       concorrente pode regravar a sessão enquanto o logout está em andamento. */
    marcarLogoutEM(true);
    limparSessaoEmpregaiEM({propagar:false});
    aplicarEstadoPublicoEM();

    try{await revogarSessaoSupabaseEM(token)}catch(_){}

    /* Segunda limpeza: protege contra callbacks que já estavam em voo antes do bloqueio. */
    limparSessaoEmpregaiEM({propagar:false});
    aplicarEstadoPublicoEM();

    const destino=location.origin+location.pathname+'?logout=1&authv='+encodeURIComponent(AUTH_GUARD_VERSION);
    location.replace(destino);
  }

  async function pedirLogoutEmpregaiEM(){
    const ok=await window.confirmarAcaoEmpregaiEM({
      titulo:'Sair da sua conta?',
      texto:'Você será desconectado do Empregaí neste dispositivo.',
      confirmarTexto:'Sim, sair',
      cancelarTexto:'Cancelar'
    });
    if(!ok)return;
    await logoutDefinitivoEmpregaiEM();
  }

  function protegerEstadoDeslogadoEM(){
    let bloqueado=false;
    try{bloqueado=localStorage.getItem(LOGOUT_FLAG)==='1'||sessionStorage.getItem(LOGOUT_FLAG)==='1'}catch(_){}
    if(!bloqueado)return;
    limparSessaoEmpregaiEM({propagar:false});
    aplicarEstadoPublicoEM();
  }

  function receberLogoutOutraAbaEM(){
    marcarLogoutEM(false);
    limparSessaoEmpregaiEM({propagar:false});
    aplicarEstadoPublicoEM();
    const q=new URLSearchParams(location.search);
    if(q.get('logout')!=='1')location.replace(location.origin+location.pathname+'?logout=1&authv='+encodeURIComponent(AUTH_GUARD_VERSION));
  }

  try{
    if('BroadcastChannel' in window){
      canalLogout=new BroadcastChannel('empregai-auth-'+PROJECT_REF);
      canalLogout.onmessage=e=>{if(e?.data?.tipo==='logout')receberLogoutOutraAbaEM()};
    }
  }catch(_){}

  window.addEventListener('storage',e=>{if(e.key===LOGOUT_EVENT&&e.newValue)receberLogoutOutraAbaEM()});
  window.addEventListener('pageshow',protegerEstadoDeslogadoEM);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)protegerEstadoDeslogadoEM()});

  window.empregaiAuthLogoutEM=pedirLogoutEmpregaiEM;
  window.sair=pedirLogoutEmpregaiEM;
  try{sair=pedirLogoutEmpregaiEM}catch(_){}

  /* O marcador na URL é tratado antes das rotinas de restauração do DOMContentLoaded. */
  if(new URLSearchParams(location.search).get('logout')==='1'){
    marcarLogoutEM(false);
    limparSessaoEmpregaiEM({propagar:false});
    aplicarEstadoPublicoEM();
    history.replaceState({},'',location.pathname);
  }

  document.addEventListener('DOMContentLoaded',protegerEstadoDeslogadoEM);
})();


/* EMPREGAMAI-CURRICULO-EMPRESA-PRO-V2 */
(function(){
  function enderecoCurriculoEmpresaEM(o,p){
    o=o||{};p=p||{};
    const logradouro=String(o.logradouro||p.logradouro||'').trim();
    const bairro=String(o.bairro||p.bairro||'').trim();
    const cidade=String(o.cidade||p.cidade||'').trim();
    const uf=String(o.uf||p.uf||'').trim().toUpperCase();
    const cep=String(o.cep||p.cep||'').trim();

    const local=[cidade,uf].filter(Boolean).join(' - ');
    const partes=[];
    if(logradouro)partes.push(logradouro);
    if(bairro)partes.push(bairro);
    if(local)partes.push(local);
    if(cep)partes.push('CEP '+cep);

    return partes.join(' · ');
  }

  abrirCurriculoFormatadoEM=function(id){
    const c=candidaturas().find(x=>x.id===id);
    if(!c)return;

    registrarVisualizacaoCurriculoEM(c);

    const o=c.curriculoOrigem==='online'?(c.curriculo||{}):{};
    const p=c.perfilProfissional||{};
    const nome=o.nome||c.candidato||'Candidato';
    const titulo=o.titulo||p.titulo||o.objetivo||'Perfil profissional';
    const email=o.email||c.email||'';
    const telefone=o.telefone||c.telefone||'';
    const endereco=enderecoCurriculoEmpresaEM(o,p);
    const exp=Array.isArray(o.experiencias)?o.experiencias:[];
    const form=Array.isArray(o.formacoes)?o.formacoes:[];
    const cursos=Array.isArray(o.cursos)?o.cursos:[];
    const competencias=String(o.competencias||p.competencias||'')
      .split(/[,;\n]+/).map(x=>x.trim()).filter(Boolean);
    const idiomas=String(o.idiomas||'').trim();

    const secTexto=(tituloSec,valor)=>{
      const v=String(valor||'').trim();
      return v?'<section class="cv-pro-section"><h2>'+esc(tituloSec)+'</h2><p>'+esc(v)+'</p></section>':'';
    };

    const experiencias=exp.length
      ?'<section class="cv-pro-section"><h2>Experiência profissional</h2>'+
       exp.map(x=>'<article class="cv-pro-item">'+
         '<div class="cv-pro-item-head"><div><h3>'+esc(x.cargo||'Experiência profissional')+'</h3><strong>'+esc(x.empresa||'')+'</strong></div>'+
         '<span>'+esc(x.inicio||'')+(x.atual?' - Atual':x.fim?' - '+esc(x.fim):'')+'</span></div>'+
         (x.atividades?'<p>'+esc(x.atividades)+'</p>':'')+
       '</article>').join('')+
       '</section>'
      :'';

    const formacao=form.length
      ?'<section class="cv-pro-side-section"><h2>Formação</h2>'+
       form.map(x=>'<article><strong>'+esc(x.curso||x.formacao||'Formação')+'</strong>'+
         (x.instituicao?'<span>'+esc(x.instituicao)+'</span>':'')+
         ((x.inicio||x.fim||x.status)?'<small>'+esc([x.inicio,x.fim||x.status].filter(Boolean).join(' - '))+'</small>':'')+
       '</article>').join('')+
       '</section>'
      :'';

    const cursosHtml=cursos.length
      ?'<section class="cv-pro-side-section"><h2>Cursos e qualificações</h2>'+
       cursos.map(x=>'<article><strong>'+esc(x.nome||x.curso||'Curso')+'</strong>'+
         (x.instituicao?'<span>'+esc(x.instituicao)+'</span>':'')+
         ((x.carga||x.conclusao)?'<small>'+esc([x.carga,x.conclusao].filter(Boolean).join(' · '))+'</small>':'')+
       '</article>').join('')+
       '</section>'
      :'';

    const competenciasHtml=competencias.length
      ?'<section class="cv-pro-side-section"><h2>Competências</h2><div class="cv-pro-tags">'+
       competencias.map(x=>'<span>'+esc(x)+'</span>').join('')+
       '</div></section>'
      :'';

    const idiomasHtml=idiomas
      ?'<section class="cv-pro-side-section"><h2>Idiomas</h2><p>'+esc(idiomas)+'</p></section>'
      :'';

    const contato=[
      email?'<span><b>E-mail</b>'+esc(email)+'</span>':'',
      telefone?'<span><b>Telefone</b>'+esc(telefone)+'</span>':'',
      endereco?'<span class="endereco"><b>Endereço</b>'+esc(endereco)+'</span>':''
    ].filter(Boolean).join('');

    const folha=
      '<header class="cv-pro-header">'+
        '<div class="cv-pro-brand"><span>EMPREGAÍ</span><small>Currículo profissional</small></div>'+
        '<div class="cv-pro-ident"><h1>'+esc(nome)+'</h1><h3>'+esc(titulo)+'</h3></div>'+
        '<div class="cv-pro-contato">'+contato+'</div>'+
      '</header>'+
      '<div class="cv-pro-layout">'+
        '<aside class="cv-pro-side">'+
          formacao+
          cursosHtml+
          competenciasHtml+
          idiomasHtml+
        '</aside>'+
        '<main class="cv-pro-main">'+
          secTexto('Objetivo profissional',o.objetivo)+
          secTexto('Resumo profissional',o.resumo||p.resumo)+
          experiencias+
        '</main>'+
      '</div>'+
      '<footer class="cv-pro-footer"><span>Currículo gerado pelo + Empregos</span><span>Dados fornecidos pelo candidato</span></footer>';

    const w=window.open('','_blank');
    if(!w){alert('Permita pop-ups para visualizar o currículo.');return}

    w.document.write(
      '<!doctype html><html><head><meta charset="utf-8">'+
      '<meta name="viewport" content="width=device-width,initial-scale=1">'+
      '<title>Currículo - '+esc(nome)+'</title>'+
      '<link rel="preconnect" href="https://fonts.googleapis.com">'+
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'+
      '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">'+
      '<style>'+
      '@page{size:A4;margin:0}'+
      '*{box-sizing:border-box}'+
      'html,body{margin:0;padding:0}'+
      'body{background:#e9eef2;color:#273845;font-family:"Montserrat",Arial,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}'+
      '.bar{position:sticky;top:0;z-index:20;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:12px 22px;background:#123e5d;color:#fff;font-family:"Montserrat",Arial,sans-serif}'+
      '.bar strong{font-size:13px;font-weight:700}.bar button{border:0;border-radius:9px;background:#fff;color:#123e5d;padding:10px 15px;font-family:"Montserrat",Arial,sans-serif;font-size:12px;font-weight:700;cursor:pointer}'+
      '.page{width:210mm;min-height:297mm;margin:22px auto;background:#fff;box-shadow:0 10px 35px rgba(22,49,67,.15);overflow:hidden}'+
      '.cv-pro-header{background:#123e5d;color:#fff;padding:18mm 17mm 10mm}'+
      '.cv-pro-brand{display:flex;align-items:center;justify-content:space-between;margin-bottom:10mm;padding-bottom:5mm;border-bottom:1px solid rgba(255,255,255,.22)}'+
      '.cv-pro-brand span{font-size:11px;font-weight:800;letter-spacing:.17em}.cv-pro-brand small{font-size:9px;font-weight:500;opacity:.78}'+
      '.cv-pro-ident h1{margin:0;font-size:27px;line-height:1.12;font-weight:800;letter-spacing:-.03em}.cv-pro-ident h3{margin:5px 0 0;font-size:13px;font-weight:500;color:#cfe9f4}'+
      '.cv-pro-contato{display:grid;grid-template-columns:1fr 1fr;gap:7px 18px;margin-top:9mm;padding-top:5mm;border-top:1px solid rgba(255,255,255,.16)}'+
      '.cv-pro-contato span{display:flex;flex-direction:column;gap:2px;font-size:9.5px;line-height:1.4;color:#f4fbff;min-width:0}.cv-pro-contato span.endereco{grid-column:1/-1}.cv-pro-contato b{font-size:7.5px;letter-spacing:.09em;text-transform:uppercase;color:#94cbe1;font-weight:700}'+
      '.cv-pro-layout{display:grid;grid-template-columns:62mm 1fr;min-height:205mm}'+
      '.cv-pro-side{background:#f3f7f9;padding:11mm 9mm 12mm 17mm;border-right:1px solid #dfe9ee}.cv-pro-main{padding:11mm 17mm 12mm 12mm}'+
      '.cv-pro-section{margin:0 0 9mm}.cv-pro-section h2,.cv-pro-side-section h2{margin:0 0 5mm;color:#176f86;font-size:10px;line-height:1.2;font-weight:800;text-transform:uppercase;letter-spacing:.09em}'+
      '.cv-pro-section h2{padding-bottom:3mm;border-bottom:1px solid #d7e2e8}.cv-pro-section>p{margin:0;color:#405461;font-size:9.4px;line-height:1.72;text-align:justify}'+
      '.cv-pro-item{margin:0 0 7mm}.cv-pro-item:last-child{margin-bottom:0}.cv-pro-item-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.cv-pro-item h3{margin:0;color:#213d4f;font-size:10.4px;font-weight:700}.cv-pro-item strong{display:block;margin-top:2px;color:#527083;font-size:8.8px;font-weight:600}.cv-pro-item-head>span{white-space:nowrap;color:#78909d;font-size:8px;font-weight:600}.cv-pro-item p{margin:3mm 0 0;color:#4d606c;font-size:8.9px;line-height:1.62;text-align:justify}'+
      '.cv-pro-side-section{margin:0 0 8mm}.cv-pro-side-section article{margin:0 0 4.5mm}.cv-pro-side-section article strong{display:block;color:#263f50;font-size:9px;line-height:1.4;font-weight:700}.cv-pro-side-section article span,.cv-pro-side-section article small{display:block;margin-top:1.5px;color:#687d89;font-size:7.9px;line-height:1.45}.cv-pro-side-section p{margin:0;color:#536874;font-size:8.6px;line-height:1.55}'+
      '.cv-pro-tags{display:flex;flex-wrap:wrap;gap:4px}.cv-pro-tags span{display:inline-flex;padding:5px 7px;border:1px solid #c8dce5;border-radius:999px;background:#fff;color:#3e6072;font-size:7.5px;font-weight:600}'+
      '.cv-pro-footer{display:flex;justify-content:space-between;gap:20px;padding:5mm 17mm;border-top:1px solid #e2eaee;color:#83949e;font-size:7.5px;font-weight:500}'+
      '@media print{body{background:#fff}.bar{display:none}.page{width:210mm;min-height:297mm;margin:0;box-shadow:none}.cv-pro-section,.cv-pro-item,.cv-pro-side-section{break-inside:avoid}}'+
      '</style></head><body>'+
      '<div class="bar"><strong>Currículo profissional · + Empregos</strong><button onclick="window.print()">Baixar / Salvar em PDF</button></div>'+
      '<main class="page">'+folha+'</main>'+
      '</body></html>'
    );

    w.document.close();
  };
})();


/* MAISEMPREGOS-PLANOS-INTEGRACAO-V1 */
function solicitarPlanoIntegracaoEM(plano){
 const nomes={
  essencial:'Integração Essencial',
  pro:'Integração Pro',
  enterprise:'Integração Enterprise'
 };
 const nome=nomes[plano]||'Integração de vagas';
 try{
  sessionStorage.setItem('interessePlanoIntegracaoEM',plano);
  sessionStorage.setItem('interessePlanoIntegracaoNomeEM',nome);
 }catch(_){}
 irPara('contato');
 setTimeout(()=>{
  const assunto=document.querySelector('#pagina-contato input[name="assunto"],#pagina-contato #contatoAssunto');
  const mensagem=document.querySelector('#pagina-contato textarea[name="mensagem"],#pagina-contato #contatoMensagem');
  if(assunto&&!assunto.value)assunto.value='Plano '+nome;
  if(mensagem&&!mensagem.value)mensagem.value='Tenho interesse no plano '+nome+' para sincronizar automaticamente as vagas do portal de carreiras da minha empresa com o +Empregos.';
 },80);
}


/* EMPREGOS-CONECTA-LAUNCHER-GUARD */
document.addEventListener('DOMContentLoaded',()=>{
 setTimeout(inserirAcessoConectaPainelEmpresaEM,300);
 const obs=new MutationObserver(()=>{if(papelAtual()==='empresa')inserirAcessoConectaPainelEmpresaEM()});
 obs.observe(document.body,{childList:true,subtree:true})
});
window.addEventListener('load',()=>setTimeout(inserirAcessoConectaPainelEmpresaEM,500));

/* EMPREGOS-HEADER-SEM-ANUNCIAR-GRATIS */
document.addEventListener('DOMContentLoaded',()=>{
 removerAnunciarVagaGratisHeaderEM();
 const obsAnuncioHeaderEM=new MutationObserver(()=>removerAnunciarVagaGratisHeaderEM());
 obsAnuncioHeaderEM.observe(document.body,{childList:true,subtree:true})
});
window.addEventListener('load',removerAnunciarVagaGratisHeaderEM);

/* EMPREGAMAIS-CONNECTA-PRECO-4MES-V2 */
(function(){if(document.getElementById('conectaPreco4MesStyleEM'))return;const s=document.createElement('style');s.id='conectaPreco4MesStyleEM';s.textContent='.conecta-plan-normal{margin:10px 0 14px!important;padding:10px 12px!important;border:1px solid #e3ccef!important;border-radius:10px!important;background:#faf4fd!important;color:#5f3970!important;font-size:10px!important}.conecta-plan-normal b{font-weight:750!important}.conecta-plan-normal strong{display:inline!important;margin-left:4px!important;color:#5d1c80!important;font-size:15px!important;font-weight:850!important;text-decoration:none!important}';document.head.appendChild(s)})();




/* EMPREGAI-LOCAL-COR-LARANJA-V1 */
(function(){
 if(document.getElementById('empregaiLocalCorLaranjaV1'))return;
 const st=document.createElement('style');
 st.id='empregaiLocalCorLaranjaV1';
 st.textContent=`
 #homeLocalPreferidoEM{border-left-color:#ff5a0a!important}
 #homeLocalPreferidoEM .home-local-icone-em{background:#fff1e7!important;border-color:#ffc69f!important;color:#ff5a0a!important}
 #homeLocalPreferidoEM .home-local-icone-em svg{stroke:#ff5a0a!important}
 #homeLocalPreferidoEM .home-local-status-em{background:#fff0e5!important;color:#f05a14!important;border-color:#ffc69f!important}
 #homeLocalPreferidoEM .home-local-status-em.ativo{background:#fff0e5!important;color:#f05a14!important;border-color:#ffc69f!important}
 #homeLocalPreferidoEM .home-local-btn-em{background:linear-gradient(135deg,#ff4b0a,#ff6909)!important;border-color:#ff4b0a!important;color:#fff!important;box-shadow:0 8px 20px rgba(255,82,8,.24)!important}
 #homeLocalPreferidoEM .home-local-btn-em:hover{background:linear-gradient(135deg,#f04400,#ff5900)!important;border-color:#f04400!important;color:#fff!important}
 `;
 document.head.appendChild(st);
})();
