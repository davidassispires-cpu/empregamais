const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];const ler=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k))||d}catch{return d}},gravar=(k,v)=>localStorage.setItem(k,JSON.stringify(v)),nums=v=>(v||'').replace(/\D/g,'');function irPara(p='home'){const url=p==='home'?location.pathname:location.pathname+'?pagina='+encodeURIComponent(p);if(location.pathname+location.search!==url)history.pushState({},'',url);abrirRota(p)}function mostrarPagina(id){$$('.pagina').forEach(x=>x.classList.remove('ativa'));let el=$('#pagina-'+id);if(!el){id='home';el=$('#pagina-home');if(location.search)history.replaceState({},'',location.pathname)}if(el)el.classList.add('ativa');document.querySelectorAll('.menu-drop').forEach(x=>x.classList.remove('aberto'));scrollTo(0,0)}function papelAtual(){return sessionStorage.getItem('empregaMaisPapel')||''}function abrirRota(p){const solicitada=p;if(p==='painel-empresa'&&papelAtual()!=='empresa')p='login-empresa';if(p==='painel-candidato'&&papelAtual()!=='candidato')p='login-candidato';if(p==='perfil-empresa'&&papelAtual()!=='empresa')p='login-empresa';if(p==='painel-admin'&&sessionStorage.getItem('empregaMaisAdmin')!=='1')p='login-admin';if(p==='publicar'&&papelAtual()!=='empresa')p='login-empresa';if(p==='candidatos-empresa'&&papelAtual()!=='empresa')p='login-empresa';if(p==='candidaturas'&&papelAtual()!=='candidato')p='login-candidato';if((p==='curriculo'||p==='salvas'||p==='perfil-candidato'||p==='premium-candidato'||p==='avaliar-processos')&&papelAtual()!=='candidato')p='login-candidato';if(p==='candidatar'&&papelAtual()!=='candidato')p='login-candidato';if(p!==solicitada){const url=p==='home'?location.pathname:location.pathname+'?pagina='+encodeURIComponent(p);history.replaceState({},'',url)}mostrarPagina(p||'home');if(p==='publicar')setTimeout(prepararPublicacao,0);if(p==='candidatos-empresa')setTimeout(renderizarCandidatosEmpresa,0);if(p==='candidaturas')setTimeout(renderizarCandidaturasCandidato,0);if(p==='perfil-candidato')setTimeout(carregarPerfilCandidato,0);if(p==='curriculo')setTimeout(()=>{renderizarCurriculo();configurarUploadCurriculo();carregarCurriculoOnlineEM()},0);if(p==='salvas')setTimeout(renderizarSalvas,0);if(p==='senior')setTimeout(renderizarVagasSenior,0);if(p==='perfil-empresa')setTimeout(()=>{carregarPerfilEmpresa();renderPerfilVerificacaoEmpresaEM()},0);if(p==='central-empresa')setTimeout(renderCentralEmpresaEM,0);if(p==='empresa-publica')setTimeout(renderizarEmpresaPublica,0);if(p==='painel-admin')setTimeout(()=>adminAba('geral'),0);if(p==='home')setTimeout(renderizarVagasPortal,0);if(p==='planos')setTimeout(renderizarPlanosModeloB,0);if(p==='plano-detalhe')setTimeout(renderizarDetalhesPlano,0);if(p==='vaga')setTimeout(renderizarVagaDetalhe,0);if(p==='candidatar')setTimeout(prepararCandidatura,0);if(p==='painel-empresa'){const e=$('#empresaSaudacao');if(e)e.textContent='Olá, '+(sessionStorage.getItem('empresaNome')||'empresa')+'. Gerencie suas vagas e candidatos.';setTimeout(renderizarPainelEmpresa,0)}if(p==='premium-candidato')setTimeout(atualizarPremiumCandidatoEM,0);if(p==='avaliar-processos')setTimeout(renderizarAvaliacoesProcessosEM,0);if(p==='painel-candidato'){setTimeout(atualizarPainelCandidato,0);const e=$('#candidatoSaudacao');if(e)e.textContent='Olá, '+(sessionStorage.getItem('candidatoNome')||'candidato')+'. Acompanhe sua jornada profissional.'}}
function atualizarPremiumCandidatoEM(){const c=candidatoLogado(),ativo=candidatoPremiumAtivoEM(c),pag=document.getElementById('pagina-premium-candidato');if(!pag)return;pag.classList.toggle('premium-ativo',ativo);pag.querySelectorAll('.premium-comparativo-card.premium').forEach(el=>el.classList.toggle('plano-ativo',ativo));const btn=pag.querySelector('.premium-comparativo-card.premium button');if(btn){btn.textContent=ativo?'Premium ativo':'Conhecer planos Premium';btn.disabled=ativo}}
function assinarPremiumCandidatoEM(periodo='mensal'){const opcoes={mensal:{nome:'Premium Mensal',valor:29.90},trimestral:{nome:'Premium Trimestral',valor:79.90},semestral:{nome:'Premium Semestral',valor:149.90}},pl=opcoes[periodo]||opcoes.mensal,cs=ler('empregaMaisCandidatos'),email=sessionStorage.getItem('candidatoEmail')||'',i=cs.findIndex(x=>String(x.email||'').toLowerCase()===email.toLowerCase());if(i<0){alert('Entre na sua conta de candidato para assinar o Premium.');irPara('login-candidato');return}const pedidos=ler('empregaMaisPedidosPremiumCandidato');pedidos.unshift({id:'PREM-'+Date.now(),candidatoEmail:email,candidatoNome:cs[i].nome||sessionStorage.getItem('candidatoNome')||'Candidato',plano:pl.nome,periodo,valor:pl.valor,status:'aguardando_pagamento',criadoEm:new Date().toISOString()});gravar('empregaMaisPedidosPremiumCandidato',pedidos);alert('Seu pedido do '+pl.nome+' foi criado. A etapa de pagamento será conectada ao checkout do portal.');}
function lerRota(){abrirRota(new URLSearchParams(location.search).get('pagina')||'home')}function msg(id,t,ok=false){const e=$(id);if(!e)return;e.textContent=t;e.className='form-msg '+(ok?'ok':'erro')}function entrar(tipo,d){const retorno=tipo==='candidato'?sessionStorage.getItem('retornoCandidatura'):null,salvar=tipo==='candidato'?sessionStorage.getItem('retornoSalvarVaga'):null,vaga=tipo==='candidato'?sessionStorage.getItem('vagaSelecionada'):null,plano=tipo==='empresa'?sessionStorage.getItem('planoPretendido'):null,token=sessionStorage.getItem('empregaMaisSupabaseAccessToken')||localStorage.getItem('empregaMaisSupabaseAccessToken'),refresh=sessionStorage.getItem('empregaMaisSupabaseRefreshToken')||localStorage.getItem('empregaMaisSupabaseRefreshToken'),draft=localStorage.getItem('empregaMaisRascunhoVaga');sessionStorage.clear();if(token)sessionStorage.setItem('empregaMaisSupabaseAccessToken',token);if(refresh)sessionStorage.setItem('empregaMaisSupabaseRefreshToken',refresh);if(draft)localStorage.setItem('empregaMaisRascunhoVaga',draft);sessionStorage.setItem('empregaMaisPapel',tipo);sessionStorage.setItem(tipo+'Nome',d.nome);if(tipo==='empresa'){sessionStorage.setItem('empresaCnpj',d.cnpj);if(plano)sessionStorage.setItem('planoPretendido',plano)}else{sessionStorage.setItem('candidatoEmail',d.email);if(retorno)sessionStorage.setItem('retornoCandidatura',retorno);if(salvar)sessionStorage.setItem('retornoSalvarVaga',salvar);if(vaga)sessionStorage.setItem('vagaSelecionada',vaga)}irPara('painel-'+tipo)}function cadastrarEmpresa(e){e.preventDefault();const senha=$('#cadEmpresaSenha').value,nome=$('#cadEmpresaNome').value.trim(),email=$('#cadEmpresaEmail').value.trim().toLowerCase(),telefone=$('#cadEmpresaTelefone').value.trim(),cnpj=nums($('#cadEmpresaCnpj').value);if(nome.length<2)return msg('#msgCadastroEmpresa','Informe o nome da empresa.');if(cnpj.length!==14)return msg('#msgCadastroEmpresa','Informe um CNPJ com 14 números.');if(!email.includes('@'))return msg('#msgCadastroEmpresa','Informe um e-mail válido.');if(nums(telefone).length<10)return msg('#msgCadastroEmpresa','Informe um telefone válido.');if(senha.length<6)return msg('#msgCadastroEmpresa','A senha deve ter pelo menos 6 caracteres.');if(senha!==$('#cadEmpresaSenha2').value)return msg('#msgCadastroEmpresa','As senhas não conferem.');const lista=ler('empregaMaisEmpresas');if(lista.some(x=>x.cnpj===cnpj))return msg('#msgCadastroEmpresa','Já existe uma empresa cadastrada com este CNPJ.');if(lista.some(x=>(x.email||'').toLowerCase()===email))return msg('#msgCadastroEmpresa','Já existe uma empresa cadastrada com este e-mail.');const d={id:'empresa_'+Date.now(),nome,cnpj,email,telefone,senha,plano:'basico',planoStatus:'ativo',criadoEm:new Date().toISOString()};lista.push(d);gravar('empregaMaisEmpresas',lista);entrar('empresa',d)}function loginEmpresa(e){e.preventDefault();const acesso=($('#loginEmpresaCnpj').value||'').trim(),senha=$('#loginEmpresaSenha').value,cnpj=nums(acesso),email=acesso.toLowerCase(),d=ler('empregaMaisEmpresas').find(x=>((cnpj.length===14&&x.cnpj===cnpj)||((x.email||'').toLowerCase()===email))&&x.senha===senha);if(!d)return msg('#msgLoginEmpresa','CNPJ/e-mail ou senha incorretos.');entrar('empresa',d);if(sessionStorage.getItem('planoPretendido'))setTimeout(()=>irPara('planos'),30)}function cadastrarCandidato(e){e.preventDefault();return cadastrarCandidatoSupabaseEM(e)}
function loginCandidato(e){e.preventDefault();return loginCandidatoSupabaseEM(e)}
function candidatoPremiumAtivoEM(c){c=c||candidatoLogado();return !!(c&&(c.premium||c.premiumAtivo||c.premiumCortesiaAdmin||c.planoCandidato))}
function candidatoLogado(){const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase();return ler('empregaMaisCandidatos').find(c=>(c.email||'').toLowerCase()===email)||null}
function carregarPerfilCandidato(){const c=candidatoLogado();if(!c)return;const p=c.perfil||{},set=(id,v)=>{const e=$('#'+id);if(e)e.value=v||''};set('candPerfilNome',c.nome);set('candPerfilTelefone',c.telefone);set('candPerfilEmail',c.email);set('candPerfilCidade',c.cidade);set('candPerfilUf',p.uf);set('candPerfilNascimento',p.nascimento);set('candPerfilTitulo',p.titulo);set('candPerfilArea',p.area);set('candPerfilEscolaridade',p.escolaridade);set('candPerfilExperiencia',p.experiencia);set('candPerfilPretensao',p.pretensao);set('candPerfilModalidade',p.modalidade);set('candPerfilDisponibilidade',p.disponibilidade);set('candPerfilResumo',p.resumo);set('candPerfilCompetencias',p.competencias);set('candPerfilLinkedin',p.linkedin);set('candPerfilPortfolio',p.portfolio)}
function salvarPerfilCandidato(e){e.preventDefault();const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),a=ler('empregaMaisCandidatos'),i=a.findIndex(c=>(c.email||'').toLowerCase()===email);if(i<0)return msg('#msgPerfilCandidato','Não foi possível localizar seu cadastro.');const val=id=>$('#'+id)?.value.trim()||'',nome=val('candPerfilNome'),telefone=val('candPerfilTelefone'),cidade=val('candPerfilCidade'),linkedin=val('candPerfilLinkedin'),portfolio=val('candPerfilPortfolio');if(nome.length<3)return msg('#msgPerfilCandidato','Informe seu nome completo.');if(nums(telefone).length<10)return msg('#msgPerfilCandidato','Informe um telefone válido.');if(cidade.length<2)return msg('#msgPerfilCandidato','Informe sua cidade.');if(linkedin&&!/^https?:\/\//i.test(linkedin))return msg('#msgPerfilCandidato','O LinkedIn deve começar com http:// ou https://.');if(portfolio&&!/^https?:\/\//i.test(portfolio))return msg('#msgPerfilCandidato','O portfólio deve começar com http:// ou https://.');const p={uf:val('candPerfilUf').toUpperCase(),nascimento:val('candPerfilNascimento'),titulo:val('candPerfilTitulo'),area:val('candPerfilArea'),escolaridade:val('candPerfilEscolaridade'),experiencia:val('candPerfilExperiencia'),pretensao:val('candPerfilPretensao'),modalidade:val('candPerfilModalidade'),disponibilidade:val('candPerfilDisponibilidade'),resumo:val('candPerfilResumo'),competencias:val('candPerfilCompetencias'),linkedin,portfolio};a[i]={...a[i],nome,telefone,cidade,perfil:p,perfilAtualizadoEm:new Date().toISOString()};gravar('empregaMaisCandidatos',a);sessionStorage.setItem('candidatoNome',a[i].nome);msg('#msgPerfilCandidato','Perfil profissional salvo com sucesso.',true);atualizarPainelCandidato()}
function empresaLogada(){const c=sessionStorage.getItem('empresaCnpj')||'';return ler('empregaMaisEmpresas').find(e=>e.cnpj===c)||null}
function abaPerfilEmpresa(aba,btn){const pub=$('#perfilPublico'),conta=$('#perfilConta');if(pub)pub.classList.toggle('oculto',aba!=='publico');if(conta)conta.classList.toggle('oculto',aba!=='conta');document.querySelectorAll('.perfil-tabs button').forEach(b=>b.classList.remove('ativo'));btn?.classList.add('ativo')}
function carregarPerfilEmpresa(){const e=empresaLogada();if(!e)return;const p=e.perfil||{},set=(id,v)=>{const x=$('#'+id);if(x)x.value=v||''};const mapa={perfilNome:p.nome||e.nome,perfilSegmento:p.segmento,perfilCidade:p.cidade||e.cidade,perfilUf:p.uf||e.uf,perfilPorte:p.porte,perfilFuncionarios:p.funcionarios,perfilFrequenciaContratacao:p.frequenciaContratacao,perfilResponsavelContratacoes:p.responsavelContratacoes,perfilUsaAts:p.usaAts,perfilAtsNome:p.atsNome,perfilSiteRecrutamento:p.siteRecrutamento||p.site,perfilAnunciaSite:p.anunciaSite,perfilPaginaCarreiras:p.paginaCarreiras,perfilFundacao:p.fundacao,perfilSlogan:p.slogan,perfilSobre:p.sobre,perfilMissao:p.missao,perfilVisao:p.visao,perfilValores:p.valores,perfilCultura:p.cultura,perfilAmbiente:p.ambiente,perfilBeneficios:p.beneficios,perfilCarreira:p.carreira,perfilModalidades:p.modalidades,perfilAreas:p.areas,perfilSite:p.site,perfilLinkedin:p.linkedin,perfilInstagram:p.instagram,perfilFacebook:p.facebook,perfilVideo:p.video,perfilEmailPublico:p.emailPublico,perfilLogo:p.logo,perfilCapa:p.capa,perfilRazao:e.razaoSocial,perfilCnpj:e.cnpj,perfilResponsavel:e.responsavel,contaFuncaoResponsavel:e.funcaoResponsavel||e.funcao_responsavel||'',perfilEmailConta:e.email,perfilTelefone:e.telefone,perfilCep:e.cep,perfilCidadeConta:e.cidade,perfilUfConta:e.uf};Object.entries(mapa).forEach(([id,v])=>set(id,v))}
function salvarPerfilEmpresa(ev){ev.preventDefault();const c=sessionStorage.getItem('empresaCnpj')||'',a=ler('empregaMaisEmpresas'),i=a.findIndex(e=>e.cnpj===c);if(i<0)return msg('#msgPerfilEmpresa','Sua sessão de empresa não foi localizada.');const anterior=JSON.parse(JSON.stringify(a[i]||{})),v=id=>$('#'+id)?.value.trim()||'',nome=v('perfilNome'),email=v('contaEmail').toLowerCase(),telefone=v('contaTelefone');if(nome.length<2)return msg('#msgPerfilEmpresa','Informe o nome da empresa.');if(email&&!email.includes('@'))return msg('#msgPerfilEmpresa','Informe um e-mail válido.');if(telefone&&nums(telefone).length<10)return msg('#msgPerfilEmpresa','Informe um telefone válido.');if(email&&a.some((x,k)=>k!==i&&(x.email||'').toLowerCase()===email))return msg('#msgPerfilEmpresa','Este e-mail já está vinculado a outra empresa.');const urlOk=x=>!x||/^https?:\/\//i.test(x),urls=[['Site',v('perfilSite')],['LinkedIn',v('perfilLinkedin')],['Instagram',v('perfilInstagram')],['Facebook',v('perfilFacebook')],['Vídeo institucional',v('perfilVideo')]];const ruim=urls.find(x=>!urlOk(x[1]));if(ruim)return msg('#msgPerfilEmpresa',ruim[0]+' deve começar com http:// ou https://.');a[i].nome=nome||a[i].nome;a[i].razaoSocial=v('contaRazao');a[i].responsavel=v('contaResponsavel');a[i].funcaoResponsavel=v('contaFuncaoResponsavel');a[i].email=email||a[i].email;a[i].telefone=v('contaTelefone');a[i].cep=v('contaCep');a[i].cidade=v('contaCidade')||v('perfilCidade');a[i].uf=(v('contaUf')||v('perfilUf')).toUpperCase();a[i].perfil={nome:v('perfilNome'),segmento:v('perfilSegmento'),cidade:v('perfilCidade'),uf:v('perfilUf').toUpperCase(),porte:v('perfilPorte'),funcionarios:v('perfilFuncionarios'),frequenciaContratacao:v('perfilFrequenciaContratacao'),responsavelContratacoes:v('perfilResponsavelContratacoes'),usaAts:v('perfilUsaAts'),atsNome:v('perfilAtsNome'),siteRecrutamento:v('perfilSiteRecrutamento'),anunciaSite:v('perfilAnunciaSite'),paginaCarreiras:v('perfilPaginaCarreiras'),fundacao:v('perfilFundacao'),slogan:v('perfilSlogan'),sobre:v('perfilSobre'),missao:v('perfilMissao'),visao:v('perfilVisao'),valores:v('perfilValores'),cultura:v('perfilCultura'),ambiente:v('perfilAmbiente'),beneficios:v('perfilBeneficios'),carreira:v('perfilCarreira'),modalidades:v('perfilModalidades'),areas:v('perfilAreas'),site:v('perfilSite'),linkedin:v('perfilLinkedin'),instagram:v('perfilInstagram'),facebook:v('perfilFacebook'),video:v('perfilVideo'),emailPublico:v('perfilEmailPublico'),logo:v('perfilLogo'),capa:v('perfilCapa')};a[i].perfilAtualizadoEm=new Date().toISOString();
const statusAntes=anterior.verificada||anterior.verificacaoStatus==='aprovada'?'aprovada':(anterior.verificacaoStatus||'');
const norm=x=>String(x||'').trim().toLowerCase();
const criticosAntes=[anterior.nome,anterior.razaoSocial,anterior.cnpj,anterior.cep,anterior.cidade,anterior.uf,anterior.perfil?.nome,anterior.perfil?.cidade,anterior.perfil?.uf];
const criticosDepois=[a[i].nome,a[i].razaoSocial,a[i].cnpj,a[i].cep,a[i].cidade,a[i].uf,a[i].perfil?.nome,a[i].perfil?.cidade,a[i].perfil?.uf];
const alterouCritico=criticosAntes.some((x,k)=>norm(x)!==norm(criticosDepois[k]));
gravar('empregaMaisEmpresas',a);sessionStorage.setItem('empresaNome',a[i].nome);
/* Qualquer envio pelo fluxo de verificação precisa passar novamente pelo Admin. */
iniciarSolicitacaoVerificacaoEM(a,i,statusAntes==='aprovada'?'reanálise':'envio')}
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
 if($('#empresaPublicaSobre'))$('#empresaPublicaSobre').textContent=p.sobre||'A empresa ainda não adicionou uma apresentação.';
 const inst=$('#empresaPublicaInstitucional');if(inst){const itens=[['Missão',p.missao,'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="m15 9 5-5m0 0v4m0-4h-4"/></svg>'],['Visão',p.visao,'<svg viewBox="0 0 24 24"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></svg>'],['Valores',p.valores,'<svg viewBox="0 0 24 24"><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3Z"/></svg>'],['Cultura',p.cultura,'<svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c.5-4.3 2.4-6.5 5.5-6.5s5 2.2 5.5 6.5M14 14.5c4.1-.8 6.4 1 7 5.5"/></svg>'],['Ambiente e jeito de trabalhar',p.ambiente,'<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V4h8v3M3 12h18"/></svg>'],['Benefícios',p.beneficios,'<svg viewBox="0 0 24 24"><path d="M12 21s-8-4.7-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.3-8 11-8 11Z"/></svg>'],['Carreira e desenvolvimento',p.carreira,'<svg viewBox="0 0 24 24"><path d="M4 19V9m6 10V5m6 14v-7m4 7V3"/><path d="m3 7 6-4 6 5 6-6"/></svg>'],['Modalidades de trabalho',p.modalidades,'<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8m-4-3v3"/></svg>'],['Áreas que mais contratam',p.areas,'<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M9 6V4h6v2m-11 6h16"/></svg>']];inst.innerHTML=itens.filter(x=>x[1]).map(x=>'<section><div class="empresa-inst-icone">'+x[2]+'</div><div><h3>'+x[0]+'</h3><p>'+esc(x[1])+'</p></div></section>').join('')}
 const links=$('#empresaPublicaLinks');if(links){const arr=[['Site',p.site],['LinkedIn',p.linkedin],['Instagram',p.instagram],['Facebook',p.facebook],['Vídeo institucional',p.video],['E-mail',p.emailPublico?'mailto:'+p.emailPublico:'']].filter(x=>x[1]);links.innerHTML=arr.map(x=>'<a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(x[1])+'">'+x[0]+'</a>').join('')}
 const vs=vagasPublicas().filter(v=>(v.empresaCnpj===c||v.cnpj===c)&&!v.confidencial),cands=candidaturas().filter(x=>vs.some(v=>v.id===x.vagaId)),entrevistas=cands.filter(x=>String(x.status||'').toLowerCase().includes('entrevista')),contratados=cands.filter(x=>String(x.status||'').toLowerCase().includes('contrat')),avs=ler('empregaMaisAvaliacoesEmpresa').filter(x=>nums(x.empresaCnpj||'')===nums(c)),sals=ler('empregaMaisSalariosEmpresa').filter(x=>nums(x.empresaCnpj||'')===nums(c));
 if($('#empresaPublicaQtd'))$('#empresaPublicaQtd').textContent=vs.length;if($('#empresaPublicaQtdTexto'))$('#empresaPublicaQtdTexto').textContent=vs.length+' oportunidade(s) disponível(is)';empresaPublicaVagasPaginaEM=1;renderEmpresaPublicaVagasEM(vs,1);
 if($('#empresaPublicaAvaliacoesQtd'))$('#empresaPublicaAvaliacoesQtd').textContent=avs.length;if($('#empresaPublicaContratadosQtd'))$('#empresaPublicaContratadosQtd').textContent=contratados.length;
 const ab=$('#empresaPublicaAvaliacoes');if(ab){
  const mediaCampo=(campo,fallback='nota')=>avs.length?avs.reduce((s,x)=>s+Number(x[campo]||x[fallback]||0),0)/avs.length:0;
  const media=mediaCampo('nota'),criterios=[['Oportunidade de crescimento','crescimento'],['Equilíbrio vida e trabalho','equilibrio'],['Ambiente de trabalho','ambiente'],['Benefícios','beneficios']],recom=avs.length?Math.round(avs.filter(x=>x.recomenda==='sim').length/avs.length*100):0,aprova=avs.length?Math.round(avs.filter(x=>x.aprovaLideranca==='sim'||x.aprovaDiretoria==='sim').length/avs.length*100):0;
  ab.innerHTML=avs.length?'<div class="empresa-avaliacoes-pro"><div class="empresa-avaliacoes-pro-top"><small>'+avs.length+' AVALIAÇÃO(ÕES)</small><div class="empresa-avaliacoes-resumo"><div class="empresa-avaliacoes-geral"><strong>'+media.toFixed(1).replace('.',',')+'</strong><div class="estrelas">'+[1,2,3,4,5].map(n=>n<=Math.round(media)?'★':'☆').join('')+'</div><span>Nota geral da experiência</span></div><div class="empresa-avaliacoes-criterios">'+criterios.map(x=>{const m=mediaCampo(x[1]);return '<div><b>'+x[0]+'</b><strong>'+m.toFixed(1).replace('.',',')+'</strong><i style="--pct:'+Math.round(m/5*100)+'%"></i></div>'}).join('')+'</div></div></div><div class="empresa-avaliacoes-indicadores"><div><strong><em>●</em>'+recom+'%</strong><span>Recomendariam esta empresa</span></div><div><strong><em>●</em>'+aprova+'%</strong><span>Aprovam a experiência com a liderança</span></div></div><div class="empresa-avaliacoes-lista-pro">'+avs.map(x=>'<article><header><div><b>Candidato verificado</b><span class="avaliacao-verificada">✓ Participou do processo seletivo</span></div><strong>'+Number(x.nota||0).toFixed(1).replace('.',',')+' ★</strong></header>'+(x.comentario?'<p>'+esc(x.comentario)+'</p>':'')+'<footer><span>Comunicação '+(x.comunicacao||'-')+'/5</span><span>Clareza '+(x.clareza||'-')+'/5</span><span>Organização '+(x.organizacao||'-')+'/5</span><span>Respeito '+(x.respeito||'-')+'/5</span><span>Feedback '+(x.feedback||'-')+'/5</span></footer></article>').join('')+'</div></div>':empresaPublicaVazioEM('Ainda não há avaliações','Somente candidatos que participaram de processos seletivos desta empresa podem publicar uma avaliação.','★')
 }
 const sb=$('#empresaPublicaSalarios');if(sb)sb.innerHTML=sals.length?'<div class="empresa-publica-lista">'+sals.map(x=>'<article><strong>'+esc(x.cargo||'Cargo')+'</strong><p>'+esc(x.salario||x.valor||'Salário informado')+'</p></article>').join('')+'</div>':empresaPublicaVazioEM('Salários','Informações salariais compartilhadas no portal aparecerão aqui.','R$');
 const eb=$('#empresaPublicaEntrevistas');if(eb)eb.innerHTML=entrevistas.length?'<div class="empresa-publica-kpi-big"><strong>'+entrevistas.length+'</strong><span>processo(s) com etapa de entrevista registrado(s) nesta empresa</span></div>':empresaPublicaVazioEM('Entrevistas','Ainda não há entrevistas registradas publicamente para esta empresa.','▤');
 const cb=$('#empresaPublicaContratados');if(cb)cb.innerHTML=contratados.length?'<div class="empresa-publica-kpi-big sucesso"><strong>'+contratados.length+'</strong><span>contratação(ões) realizada(s) pelo EmpregaMais</span></div>':empresaPublicaVazioEM('Contratados pelo site','Quando uma contratação for concluída pelo EmpregaMais, o total aparecerá aqui.','✓');
 atualizarSeguirEmpresaEM();
}
function abrirPublicacao(){if(papelAtual()!=='empresa'){irPara('login-empresa');return}sessionStorage.removeItem('vagaEdicao');const f=$('#formVaga');if(f)f.reset();irPara('publicar')}function sair(){const tema=sessionStorage.getItem('temaEmpregaMais');sessionStorage.clear();if(tema)sessionStorage.setItem('temaEmpregaMais',tema);irPara('home')}addEventListener('popstate',lerRota);addEventListener('DOMContentLoaded',()=>{lerRota();$('#formCadastroEmpresa')?.addEventListener('submit',cadastrarEmpresa);$('#formLoginEmpresa')?.addEventListener('submit',loginEmpresa);$('#formCadastroCandidato')?.addEventListener('submit',cadastrarCandidato);$('#formLoginCandidato')?.addEventListener('submit',async e=>{e.preventDefault();e.stopImmediatePropagation();await loginCandidato(e)});$('#formVaga')?.addEventListener('submit',publicarVagaNova);$('#formCandidatura')?.addEventListener('submit',enviarCandidatura);$('#formCurriculo')?.addEventListener('submit',salvarCurriculoLocal);$('#formCurriculoOnline')?.addEventListener('submit',salvarCurriculoOnlineEM);$('#formLoginAdmin')?.addEventListener('submit',loginAdmin);$('#formPerfilEmpresa')?.addEventListener('submit',salvarPerfilEmpresa);$('#formPerfilCandidato')?.addEventListener('submit',salvarPerfilCandidato)});function mostrarEtapa(n){$('#formVaga .job-card').forEach(x=>x.classList.toggle('ativo',+x.dataset.panel===n));$$$('#jobProgress .job-step').forEach(x=>{const k=+x.dataset.step;x.classList.toggle('ativo',k===n);x.classList.toggle('feito',k<n)});if(n===4)montarRevisao();scrollTo(0,0)}function proximaEtapa(n){const p=document.querySelector('#formVaga .job-card[data-panel="'+n+'"]');if(!p)return;for(const e of p.querySelectorAll('[required]'))if(!e.checkValidity()){e.reportValidity();return}mostrarEtapa(n+1)}function moedaVagaInput(e){let n=e.target.value.replace(/\D/g,'');if(!n){e.target.value='';return}e.target.value=(Number(n)/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}function configurarSalarioVaga(){['salarioVaga'].forEach(id=>{const e=$('#'+id);if(e&&!e.dataset.moeda){e.addEventListener('input',moedaVagaInput);e.dataset.moeda='1'}});const c=$('#salarioCombinarVaga');if(c&&!c.dataset.bind){c.addEventListener('change',()=>{['salarioVaga'].forEach(id=>{const e=$('#'+id);if(e){e.disabled=c.checked;if(c.checked)e.value=''}})});c.dataset.bind='1'}}function beneficiosSelecionados(){const a=[];document.querySelectorAll('.beneficio-check:checked').forEach(c=>{const id=c.dataset.valor,val=id?($('#'+id)?.value.trim()||''):'';a.push(c.value+(val?' - '+val:''))});const outros=$('#beneficiosVaga')?.value.trim();if(outros)a.push(outros);return a}function aplicarBeneficiosVaga(v){document.querySelectorAll('.beneficio-check').forEach(c=>{c.checked=false;const id=c.dataset.valor;if(id&&$('#'+id))$('#'+id).value=''});const itens=Array.isArray(v.beneficiosLista)?v.beneficiosLista:[];itens.forEach(txt=>{document.querySelectorAll('.beneficio-check').forEach(c=>{if(txt===c.value||txt.startsWith(c.value+' - ')){c.checked=true;const id=c.dataset.valor;if(id&&$('#'+id))$('#'+id).value=txt.slice(c.value.length+3)}})});if($('#beneficiosVaga'))$('#beneficiosVaga').value=v.beneficiosOutros||(!itens.length?v.beneficios||'':'')}function montarRevisao(){const v=id=>$('#'+id)?.value.trim()||'',nome=v('empresaVaga'),cargo=v('cargoVaga'),cidade=v('cidadeVaga'),uf=v('estadoVaga'),sal=v('salarioVaga'),comb=$('#salarioCombinarVaga')?.checked,faixa=comb?'A combinar':sal,benef=beneficiosSelecionados(),flags=[$('#senior50Vaga')?.checked?'Profissionais 50+':'',$('#vagaConfidencial')?.checked?'Vaga confidencial':'',$('#vagaDestaque')?.checked?'Destaque':'',$('#vagaUrgente')?.checked?'Urgente':''].filter(Boolean);$('#reviewVaga').innerHTML='<div class="review-grid"><div><span>Título</span><strong>'+esc(String(cargo).toLocaleUpperCase('pt-BR'))+'</strong></div><div><span>Empresa</span><strong>'+esc(nome)+'</strong></div><div><span>Área</span><strong>'+esc(v('areaVaga'))+'</strong></div><div><span>Contrato</span><strong>'+esc(v('contratoVaga'))+'</strong></div><div><span>Modalidade</span><strong>'+esc(v('modalidadeVaga'))+'</strong></div><div><span>Localização</span><strong>'+esc(cidade+(uf?' - '+uf:''))+'</strong></div><div><span>Salário</span><strong>'+esc(faixa||'Não informado')+'</strong></div><div><span>Jornada</span><strong>'+esc(v('jornadaVaga')||'Não informada')+'</strong></div><div><span>Horário</span><strong>'+esc('Não informado')+'</strong></div><div><span>Escolaridade</span><strong>'+esc(v('escolaridadeVaga'))+'</strong></div><div><span>Experiência</span><strong>'+esc(v('experienciaVaga'))+'</strong></div><div><span>PcD</span><strong>'+esc(v('pcdVaga'))+'</strong></div></div>'+(flags.length?'<div class="review-flags">'+flags.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div>':'')+'<div class="review-texto"><h4>Descrição</h4><p>'+esc(v('descricaoVaga')).replace(/\n/g,'<br>')+'</p><h4>Requisitos</h4><p>'+esc(v('requisitosVaga')).replace(/\n/g,'<br>')+'</p><h4>Benefícios</h4><div class="beneficios-tags">'+(benef.length?benef.map(x=>'<span class="beneficio-tag">'+esc(x)+'</span>').join(''):'<span>Não informados</span>')+'</div></div>';$('#previewVaga').innerHTML='<div class="preview-vaga-cab"><span>PRÉVIA PARA O CANDIDATO</span><h3>'+esc(String(cargo).toLocaleUpperCase('pt-BR'))+'</h3><button type="button" class="empresa-link">'+esc($('#vagaConfidencial')?.checked?'Empresa confidencial':nome)+'</button></div><div class="detalhe-tags"><span>'+esc(v('contratoVaga'))+'</span><span>'+esc(v('modalidadeVaga'))+'</span>'+(flags.includes('Urgente')?'<span>Urgente</span>':'')+(flags.includes('Destaque')?'<span>Destaque</span>':'')+'</div><strong class="preview-salario">'+esc(faixa||'Salário a combinar')+'</strong><p>'+esc(v('descricaoVaga')).replace(/\n/g,'<br>')+'</p>'}function prepararPublicacao(){if(papelAtual()!=='empresa'){irPara('login-empresa');return}const editId=sessionStorage.getItem('vagaEdicao'),existe=editId&&vagasDaEmpresa().some(v=>v.id===editId);if(editId&&!existe)sessionStorage.removeItem('vagaEdicao');const e=$('#empresaVaga');if(e)e.value=sessionStorage.getItem('empresaNome')||'';atualizarOpcoesPlano();configurarSalarioVaga();if(!editId||!existe){}mostrarEtapa(1)}function publicarVagaNova(e){e.preventDefault();if(papelAtual()!=='empresa'||!sessionStorage.getItem('empresaCnpj')){msg('#msgPublicarVaga','Sua sessão de empresa expirou. Entre novamente para publicar.');setTimeout(()=>irPara('login-empresa'),700);return}const v=id=>$('#'+id)?.value.trim()||'',lista=ler('empregaMaisVagas'),editId=sessionStorage.getItem('vagaEdicao');const dados={empresa:v('empresaVaga'),empresaCnpj:sessionStorage.getItem('empresaCnpj')||'',cargo:v('cargoVaga'),area:v('areaVaga'),contrato:v('contratoVaga'),modalidade:v('modalidadeVaga'),quantidadeContratacoes:v('quantidadeVagas')||'1',cep:v('cepVaga'),estado:v('estadoVaga'),cidade:v('cidadeVaga'),dataEncerramento:'',escolaridade:v('escolaridadeVaga'),experiencia:v('experienciaVaga'),jornada:v('jornadaVaga'),pcd:v('pcdVaga'),salario:$('#salarioCombinarVaga')?.checked?'A combinar':v('salarioVaga'),salarioMax:'',salarioCombinar:!!$('#salarioCombinarVaga')?.checked,horarioEntrada:'',horarioSaida:'',descricao:v('descricaoVaga'),requisitos:v('requisitosVaga'),beneficios:beneficiosSelecionados().join(' · '),beneficiosLista:beneficiosSelecionados().filter(x=>x!==v('beneficiosVaga')),beneficiosOutros:v('beneficiosVaga'),sobreEmpresa:v('sobreEmpresaVaga'),senior50:$('#senior50Vaga').checked,confidencial:$('#vagaConfidencial').checked,destaque:$('#vagaDestaque').checked,urgente:$('#vagaUrgente').checked};const gratuito=planoEmpresaAtual().nome==='Grátis';if(gratuito&&dados.destaque&&!editId){dados.destaqueSolicitado=true;dados.destaque=false}if(gratuito&&dados.urgente&&!editId){dados.urgenciaSolicitada=true;dados.urgente=false}const erroPlano=validarRecursosPlano(dados,editId);if(erroPlano){msg('#msgPublicarVaga',erroPlano);mostrarEtapa(4);return}if(editId){const i=lista.findIndex(x=>x.id===editId&&x.empresaCnpj===dados.empresaCnpj);if(i<0){sessionStorage.removeItem('vagaEdicao');msg('#msgPublicarVaga','Não foi possível localizar esta vaga para edição. Nenhuma alteração foi salva.');return}if(i>=0){const anterior=lista[i],precisaReanalise=anterior.status==='aprovada',novoStatus=precisaReanalise?'pendente':anterior.status;lista[i]={...anterior,...dados,status:novoStatus,editadoEm:new Date().toISOString(),edicoesAposAprovacao:(precisaReanalise?(anterior.edicoesAposAprovacao||0)+1:(anterior.edicoesAposAprovacao||0)),motivoReprovacao:''};sessionStorage.removeItem('vagaEdicao');gravar('empregaMaisVagas',lista);$('#formVaga').reset();msg('#msgPublicarVaga',precisaReanalise?'Alterações salvas. A vaga voltou para análise.':'Alterações salvas com sucesso.',true);setTimeout(()=>irPara('painel-empresa'),900);return}}const novaId='vaga_'+Date.now();lista.unshift({id:novaId,...dados,status:'pendente',criadoEm:new Date().toISOString(),edicoesAposAprovacao:0});if(gratuito){const extras=ler('empregaMaisExtras');if(dados.destaqueSolicitado)extras.unshift({id:'extra_'+Date.now()+'_d',vagaId:novaId,empresaCnpj:dados.empresaCnpj,tipo:'destaque',valor:19.90,dias:7,status:'aguardando_pagamento',criadoEm:new Date().toISOString()});if(dados.urgenciaSolicitada)extras.unshift({id:'extra_'+Date.now()+'_u',vagaId:novaId,empresaCnpj:dados.empresaCnpj,tipo:'urgencia',valor:9.90,status:'aguardando_pagamento',criadoEm:new Date().toISOString()});gravar('empregaMaisExtras',extras)}gravar('empregaMaisVagas',lista);$('#formVaga').reset();msg('#msgPublicarVaga','Vaga enviada para análise.',true);setTimeout(()=>irPara('painel-empresa'),900)}function vagasDaEmpresa(){const c=nums(sessionStorage.getItem('empresaCnpj')||''),nome=(sessionStorage.getItem('empresaNome')||'').trim().toLowerCase(),todas=ler('empregaMaisVagas');return todas.filter(v=>{const vc=nums(v.empresaCnpj||v.cnpj||'');const vn=String(v.empresa||v.empresaNome||'').trim().toLowerCase();return (c&&vc===c)||(!vc&&nome&&vn===nome)})}function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}function atualizarContaSidebarEmpresaEM(){
 const e=empresaLogada(),nome=e?.nome||sessionStorage.getItem('empresaNome')||'Empresa';
 const plano=(typeof planoEmpresaAtual==='function'?planoEmpresaAtual()?.nome:'')||'Ativo';
 const n=document.getElementById('empSideAccountName'),a=document.getElementById('empSideAccountAvatar'),p=document.getElementById('empSideAccountPlan');
 if(n)n.textContent=nome;if(a)a.textContent=(nome.trim()[0]||'E').toUpperCase();if(p)p.textContent='· Plano '+plano;
}
function renderizarPainelEmpresa(){setTimeout(atualizarContaSidebarEmpresaEM,0);const empresa=empresaLogada(),todas=vagasDaEmpresa(),f=$('#filtroVagasEmpresa')?.value||'',lista=f?todas.filter(v=>v.status===f):todas,plano=planoEmpresaAtual(),uso=usoPlanoEmpresa(),pago=plano.nome!=='Grátis',cands=candidaturas().filter(c=>todas.some(v=>v.id===c.vagaId)),entrevistas=cands.filter(c=>grupoEtapa(c.status)==='Entrevista').length,contratados=cands.filter(c=>grupoEtapa(c.status)==='Contratados').length,ativas=todas.filter(v=>v.status==='aprovada'&&vagaDentroPrazo(v)).length;const pagina=$('#pagina-painel-empresa');pagina?.classList.toggle('gratis',!pago);pagina?.classList.toggle('pago',pago);const nome=empresa?.nome||sessionStorage.getItem('empresaNome')||'Empresa';if($('#empresaPainelOla'))$('#empresaPainelOla').textContent='Olá, '+nome+'!';if($('#empProNome'))$('#empProNome').textContent=nome;if($('#empProPlanoHero'))$('#empProPlanoHero').textContent='Plano '+plano.nome;const logoPro=$('#empProLogo');if(logoPro){if(empresa?.logo){logoPro.innerHTML='<img src="'+esc(empresa.logo)+'" alt="Logo da empresa">'}else logoPro.textContent=String(nome).charAt(0).toUpperCase()}if($('#empProLocal'))$('#empProLocal').textContent='⌖ '+esc([empresa?.cidade,empresa?.estado||empresa?.uf].filter(Boolean).join(' - ')||'Localização não informada');if($('#empProSetor'))$('#empProSetor').textContent='▥ '+esc(empresa?.setor||'Empresa');if($('#empProFuncionarios'))$('#empProFuncionarios').textContent='♟ '+esc(empresa?.funcionarios||'Equipe');if($('#empresaSideNome'))$('#empresaSideNome').textContent=nome;if($('#empresaSidePlano'))$('#empresaSidePlano').textContent='Plano '+plano.nome;if($('#empresaSideVigencia'))$('#empresaSideVigencia').textContent=vigenciaTextoEmpresaEM(empresa);if($('#empresaSaudacao'))$('#empresaSaudacao').textContent='Gerencie suas vagas, acompanhe as candidaturas e encontre os melhores talentos para o seu time.';if($('#empresaPlanoBadge'))$('#empresaPlanoBadge').innerHTML='<strong>Plano '+esc(plano.nome)+'</strong><br><small>'+uso.vagas+' de '+plano.vagas+' vaga(s) usada(s) no mês</small>';if($('#lockTalentos'))$('#lockTalentos').textContent=(plano.nome==='Semestral'||plano.nome==='Anual')?'':'🔒';if($('#lockRelatorios'))$('#lockRelatorios').textContent=plano.nome==='Anual'?'':'🔒';const metricas=$('#empresaMetricasNovas');const pendentes=todas.filter(v=>v.status==='pendente').length,processo=cands.filter(c=>!['Contratados','Reprovados'].includes(grupoEtapa(c.status))).length;if(metricas){const valores=[ativas,pendentes,cands.length,processo,contratados];metricas.querySelectorAll('.kpi-num').forEach((el,n)=>{el.textContent=valores[n]??0})}if($('#heroCandidaturas'))$('#heroCandidaturas').textContent=cands.length;if($('#heroProcesso'))$('#heroProcesso').textContent=processo;if($('#heroContratacoes'))$('#heroContratacoes').textContent=contratados;const sideCand=$('#empresaSideCandidatos');if(sideCand){sideCand.textContent=cands.length;sideCand.classList.toggle('tem-valor',cands.length>0)}const resumo=$('#empresaResumoRecursos');const disp=Math.max(0,plano.vagas-uso.vagas),vigRaw=(empresa?.planoValidoAte||empresa?.planoFim||empresa?.planoAte||empresa?.vigenciaAte||''),vig=vigRaw?(isNaN(new Date(vigRaw))?String(vigRaw):new Date(vigRaw).toLocaleDateString('pt-BR')):'—',dias=vigRaw&&!isNaN(new Date(vigRaw))?Math.max(0,Math.ceil((new Date(vigRaw)-new Date())/86400000)):null;if($('#empProVigencia'))$('#empProVigencia').textContent=vig;if($('#empProDias'))$('#empProDias').textContent=dias===null?'Plano ativo':dias+' dias restantes';if(resumo){const pv=plano.vagas?Math.min(100,uso.vagas/plano.vagas*100):0,pd=plano.destaques?Math.min(100,uso.destaques/plano.destaques*100):0,pu=plano.urgentes?Math.min(100,uso.urgentes/plano.urgentes*100):0;resumo.innerHTML='<div class="emp-plan-head"><i>♛</i><div><span>SEU PLANO</span><h2>Plano '+esc(plano.nome)+' <b>ATIVO</b></h2><p>Recursos completos para potencializar seu recrutamento.</p></div><button onclick="irPara(\'planos\')">Gerenciar plano →</button></div><div class="emp-plan-usage"><div><span>Vagas utilizadas</span><strong>'+uso.vagas+' <small>/ '+plano.vagas+'</small></strong><i><b style="width:'+pv+'%"></b></i><em>'+disp+' disponíveis</em></div><div><span>Destaques utilizados</span><strong>'+uso.destaques+' <small>/ '+plano.destaques+'</small></strong><i><b style="width:'+pd+'%"></b></i><em>'+Math.max(0,plano.destaques-uso.destaques)+' disponíveis</em></div><div><span>Urgentes utilizados</span><strong>'+uso.urgentes+' <small>/ '+plano.urgentes+'</small></strong><i><b style="width:'+pu+'%"></b></i><em>'+Math.max(0,plano.urgentes-uso.urgentes)+' disponíveis</em></div><ul><li>✓ Vagas conforme seu plano</li><li>✓ Destaque nas buscas</li><li>✓ Tag de vaga urgente</li><li>✓ Perfil verificado</li><li>✓ Suporte prioritário</li></ul></div>'};const recentes=$('#empresaVagasRecentes');if(recentes){const a=todas.slice().sort((a,b)=>new Date(b.criadoEm||0)-new Date(a.criadoEm||0)).slice(0,pago?5:3);recentes.innerHTML=a.length?a.map(v=>'<div class="empresa-vaga-linha"><div><strong>'+esc(tituloVaga(v))+'</strong><small>'+esc(v.cidade||'')+(v.estado?' - '+esc(v.estado):'')+'</small></div><span class="empresa-status '+esc(v.status||'')+'">'+esc(({aprovada:'Ativa',pendente:'Em análise',encerrada:'Encerrada',reprovada:'Reprovada',suspensa:'Suspensa'}[v.status]||v.status||''))+'</span><b>'+cands.filter(c=>c.vagaId===v.id).length+' candidatos</b><button class="btn" onclick="abrirGestaoVaga(\''+v.id+'\')">•••</button></div>').join(''):'<div class="vagas-vazio">Nenhuma vaga publicada ainda.</div>'}const cr=$('#empresaCandidatosRecentes');if(cr){const a=cands.slice().sort((a,b)=>new Date(b.criadoEm||0)-new Date(a.criadoEm||0)).slice(0,5);cr.innerHTML=a.length?a.map(c=>'<div class="empresa-candidato-linha"><div class="empresa-avatar">'+esc((c.candidato||c.nome||'C').charAt(0).toUpperCase())+'</div><div><strong>'+esc(c.candidato||c.nome||'Candidato')+'</strong><small>'+esc(c.status||'Em avaliação')+'</small></div><small>'+new Date(c.criadoEm||Date.now()).toLocaleDateString('pt-BR')+'</small></div>').join(''):'<div class="vagas-vazio">Nenhuma candidatura recebida.</div>'}const ex=$('#empresaGratisExtras');if(ex)ex.innerHTML=!pago?'<div class="gratis-recursos-grid"><article class="gratis-recurso"><strong>★ Destaque de vaga</strong><p>Dê mais visibilidade a uma oportunidade por 7 dias.</p><b>R$ 19,90</b><button onclick="abrirPublicacao()">Usar em uma vaga</button></article><article class="gratis-recurso"><strong>⚡ Contratação urgente</strong><p>Identifique uma oportunidade que precisa de contratação rápida.</p><b>R$ 9,90</b><button onclick="abrirPublicacao()">Usar em uma vaga</button></article></div>':'';const abertasBox=$('#empresaVagasAbertasPainel');if(abertasBox){const abertas=todas.filter(v=>v.status==='aprovada'&&vagaDentroPrazo(v)).slice().sort((a,b)=>new Date(b.criadoEm||0)-new Date(a.criadoEm||0)),porPagina=8,totalPag=Math.max(1,Math.ceil(abertas.length/porPagina));let pag=Math.max(1,Math.min(totalPag,Number(abertasBox.dataset.pagina||1)));abertasBox.dataset.pagina=pag;const inicio=(pag-1)*porPagina,visiveis=abertas.slice(inicio,inicio+porPagina),renderCard=v=>{const vc=cands.filter(c=>c.vagaId===v.id),selecionados=vc.filter(c=>grupoEtapa(c.status)==='Selecionados').length,naoVisualizados=vc.filter(c=>!(c.visualizado||c.visualizada||c.curriculoVisualizado||c.vistoPelaEmpresa||c.vistoEm||c.visualizadoEm)).length,local=[v.cidade,v.estado||v.uf].filter(Boolean).join(' - '),data=v.criadoEm?new Date(v.criadoEm).toLocaleDateString('pt-BR'):'—',diasRestantes=(()=>{const base=new Date(v.criadoEm||Date.now());base.setDate(base.getDate()+30);return Math.max(0,Math.ceil((base-new Date())/86400000))})();return '<article class="emp-open-vaga-card emp-vaga-selecao-card"><div class="emp-vaga-selecao-top"><div class="emp-vaga-selecao-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 6V4.8C9 3.8 9.8 3 10.8 3h2.4c1 0 1.8.8 1.8 1.8V6"/><rect x="3" y="6" width="18" height="14" rx="2.5"/><path d="M3 11.5c5.5 2.2 12.5 2.2 18 0M10 12h4v2h-4z"/></svg></div><div class="emp-vaga-selecao-titulo"><div><h3>'+esc(tituloVaga(v))+'</h3><span class="emp-vaga-selecao-status">● Vaga ativa</span><span class="emp-vaga-recurso-tags">'+(v.destaque?'<em class="destaque">★ Destaque</em>':'')+(v.urgente?'<em class="urgente">⚡ Urgente</em>':'')+(v.confidencial?'<em class="confidencial">◉ Confidencial</em>':'')+'</span></div><p>⌖ '+esc(local||'Localização não informada')+' <i></i> '+esc(v.modalidade||'Modalidade não informada')+' <i></i> Publicada em '+data+'</p></div><button class="emp-vaga-menu" type="button" onclick="abrirMenuVagaEM(event,\''+v.id+'\')" aria-label="Mais opções">⋮</button></div><div class="emp-vaga-selecao-metricas"><div class="azul" role="button" tabindex="0" title="Ver todas as candidaturas" onclick="abrirMetricaVagaEM(event,\''+v.id+'\',\'todos\')" onkeydown="if(event.keyCode===13||event.keyCode===32)abrirMetricaVagaEM(event,\''+v.id+'\',\'todos\')"><i>♟</i><strong>'+vc.length+'</strong><span>Candidaturas<br>recebidas</span></div><div class="verde" role="button" tabindex="0" title="Ver candidatos selecionados" onclick="abrirMetricaVagaEM(event,\''+v.id+'\',\'selecionados\')" onkeydown="if(event.keyCode===13||event.keyCode===32)abrirMetricaVagaEM(event,\''+v.id+'\',\'selecionados\')"><i>♟</i><strong>'+selecionados+'</strong><span>Selecionados</span></div><div class="laranja" role="button" tabindex="0" title="Ver candidaturas ainda não visualizadas" onclick="abrirMetricaVagaEM(event,\''+v.id+'\',\'nao-visualizados\')" onkeydown="if(event.keyCode===13||event.keyCode===32)abrirMetricaVagaEM(event,\''+v.id+'\',\'nao-visualizados\')"><i>▤</i><strong>'+naoVisualizados+'</strong><span>Ainda não<br>visualizados</span></div></div><div class="emp-vaga-selecao-actions"><button class="primary" onclick="abrirGestaoVaga(\''+v.id+'\')">♟ &nbsp; Gerenciar processo seletivo <b>→</b></button><button class="emp-vaga-mais-opcoes" onclick="abrirMenuVagaEM(event,\''+v.id+'\')">Mais opções <span>⌄</span></button></div></article>'};abertasBox.innerHTML=abertas.length?'<div class="emp-open-vagas-grid">'+visiveis.map(renderCard).join('')+'</div>'+(totalPag>1?'<div class="emp-open-vagas-pagination"><span>Mostrando '+(inicio+1)+'–'+Math.min(inicio+porPagina,abertas.length)+' de '+abertas.length+' vagas</span><div><button '+(pag===1?'disabled':'')+' onclick="mudarPaginaVagasAbertasEM(-1)">← Anterior</button><b>Página '+pag+' de '+totalPag+'</b><button '+(pag===totalPag?'disabled':'')+' onclick="mudarPaginaVagasAbertasEM(1)">Próxima →</button></div></div>':''):'<div class="emp-open-vagas-empty"><strong>Nenhuma vaga em aberto</strong><span>Quando uma vaga for aprovada e publicada, ela aparecerá aqui.</span><button onclick="abrirPublicacao()">＋ Publicar nova vaga</button></div>'};const at=$('#empresaAtalhos');if(at)at.innerHTML='<button onclick="abrirPublicacao()"><i>＋</i><div><strong>Publicar nova vaga</strong><p>Divulgue uma nova oportunidade.</p></div><b>›</b></button><button onclick="focarVagasEmpresa()"><i>▣</i><div><strong>Gerenciar vagas</strong><p>Edite, pause ou encerre suas vagas.</p></div><b>›</b></button><button onclick="irPara(\'candidatos-empresa\')"><i>♟</i><div><strong>Ver candidatos</strong><p>Acompanhe todas as candidaturas.</p></div><b>›</b></button><button onclick="irPara(\'candidatos-empresa\')"><i>✓</i><div><strong>Processos seletivos</strong><p>Gerencie as etapas dos candidatos.</p></div><b>›</b></button>';const side=$('#empresaSideUpgrade');if(side)side.innerHTML=!pago?'<strong>Conheça os planos</strong><p>Amplie os recursos do seu recrutamento.</p><button onclick="irPara(\'planos\')">Ver planos →</button>':('<strong>♛ Plano '+esc(plano.nome)+'</strong><p>'+esc(vigenciaTextoEmpresaEM(empresa))+'</p>'+(plano.nome!=='Anual'?'<button onclick="irPara(\'planos\')">Fazer upgrade →</button>':''));const box=$('#listaVagasEmpresa');if(!box)return;if(!lista.length){box.innerHTML='<div class="vagas-vazio"><strong>Nenhuma vaga encontrada</strong><span>Quando você publicar uma vaga, ela aparecerá aqui.</span><button class="btn btn-azul" onclick="abrirPublicacao()">Publicar uma vaga</button></div>';return}box.innerHTML=lista.map(v=>{const total=cands.filter(c=>c.vagaId===v.id).length,status=v.status||'pendente',local=[v.cidade,v.estado].filter(Boolean).join(' - ')||'Local não informado',mod=v.modalidade||'Modalidade não informada',contrato=v.contrato||v.tipoContrato||'',sal=v.salario||v.faixaSalarial||'',data=v.criadoEm||v.data||v.dataCadastro||'',dataTxt=data?new Date(data).toLocaleDateString('pt-BR'):'—';return '<article class="vaga-empresa-card vaga-card-pro"><div class="vaga-card-main"><div class="vaga-card-status"><span class="vaga-status '+esc(status)+'">'+esc(status)+'</span><span class="vaga-card-id">ID '+esc(String(v.id||'').slice(-6).toUpperCase())+'</span></div><h3>'+esc(tituloVaga(v))+'</h3><div class="vaga-card-meta"><span>'+esc(local)+'</span><i>•</i><span>'+esc(mod)+'</span>'+(contrato?'<i>•</i><span>'+esc(contrato)+'</span>':'')+'</div><div class="vaga-card-info"><span><small>CANDIDATURAS</small><strong>'+total+'</strong></span><span><small>PUBLICADA EM</small><strong>'+dataTxt+'</strong></span>'+(sal?'<span><small>SALÁRIO</small><strong>'+esc(sal)+'</strong></span>':'')+'</div></div><div class="vaga-card-actions"><button class="vaga-btn-editar" onclick="editarVaga(\''+v.id+'\')"><svg viewBox="0 0 24 24"><path d="M4 20h4l11-11-4-4L4 16zM13.5 6.5l4 4"/></svg><span>Editar vaga</span></button><button class="vaga-btn-gerenciar" onclick="abrirGestaoVaga(\''+v.id+'\')"><svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.5-3.5 2.4-5.5 5.5-5.5s5 2 5.5 5.5"/><circle cx="17" cy="9" r="2.2"/><path d="M15.5 14.5c2.8-.2 4.5 1.3 5 4"/></svg><span>Gerenciar candidaturas</span></button></div></article>'}).join('')}
function mudarPaginaVagasAbertasEM(delta){const box=document.getElementById('empresaVagasAbertasPainel');if(!box)return;box.dataset.pagina=Math.max(1,Number(box.dataset.pagina||1)+Number(delta||0));renderizarPainelEmpresa();setTimeout(()=>{document.querySelector('.emp-open-vagas')?.scrollIntoView({behavior:'smooth',block:'start'})},50)}
function abrirResumoEmpresa(tipo){if(tipo==='plano')return irPara('planos');if(tipo==='vagas')return focarVagasEmpresa();if(tipo==='destaques'){const f=$('#filtroVagasEmpresa');if(f)f.value='aprovada';return focarVagasEmpresa()}if(tipo==='urgencias')return focarVagasEmpresa()}

function abrirRecursoEmpresa(tipo){const p=planoEmpresaAtual();if(tipo==='talentos'&&p.nome!=='Semestral'&&p.nome!=='Anual'){alert('O Banco de talentos está disponível nos planos Semestral e Anual.');return irPara('planos')}if(tipo==='relatorios'&&p.nome!=='Anual'){alert('Os relatórios avançados estão disponíveis no plano Anual.');return irPara('planos')}if(tipo==='talentos')return irPara('candidatos-empresa');if(tipo==='relatorios')return alert('A área de relatórios da empresa será exibida com os dados do seu recrutamento.')}


function candidaturas(){return ler('empregaMaisCandidaturas')}
function abrirGestaoVaga(id){sessionStorage.setItem('vagaCandidatosSelecionada',id);sessionStorage.removeItem('filtroNaoVisualizadosEM');irPara('candidatos-empresa')}
function abrirMetricaVagaEM(event,id,tipo){
 if(event){event.preventDefault();event.stopPropagation();}
 sessionStorage.setItem('vagaCandidatosSelecionada',id);
 sessionStorage.removeItem('filtroNaoVisualizadosEM');
 if(tipo==='selecionados')sessionStorage.setItem('filtroCandidatos','Selecionados');
 else {sessionStorage.setItem('filtroCandidatos','Todos');if(tipo==='nao-visualizados')sessionStorage.setItem('filtroNaoVisualizadosEM','1');}
 irPara('candidatos-empresa');
}
function voltarGestaoVagaEM(){sessionStorage.removeItem('vagaCandidatosSelecionada');irPara('painel-empresa');setTimeout(()=>{const alvo=document.getElementById('empresaVagasRecentes');if(alvo)alvo.scrollIntoView({behavior:'smooth',block:'start'})},120)}
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
 const vagas=vagasDaEmpresa(),id=sessionStorage.getItem('vagaCandidatosSelecionada')||'',vaga=id?vagas.find(v=>v.id===id):null;
 const busca=($('#buscaCandidatoEmpresa')?.value||'').toLowerCase();
 const todosBase=candidaturas().filter(c=>vagas.some(v=>v.id===c.vagaId)),filtroNaoVisualizados=sessionStorage.getItem('filtroNaoVisualizadosEM')==='1',todosVaga=(vaga?todosBase.filter(c=>c.vagaId===vaga.id):todosBase),todos=filtroNaoVisualizados?todosVaga.filter(c=>!(c.visualizado||c.visualizada||c.curriculoVisualizado||c.vistoPelaEmpresa||c.vistoEm||c.visualizadoEm)):todosVaga;
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
  const infoCards='<div class="recruta-cand-info"><div><span><i class="em-info-ico em-ico-doc" aria-hidden="true"></i>Currículo enviado</span><strong>'+(c.curriculoOrigem==='online'?'Currículo online':c.curriculo?.nome?'Arquivo anexado':'Perfil EmpregaMais')+'</strong></div><div class="recruta-aderencia-card"><span><i class="em-info-ico em-ico-target" aria-hidden="true"></i>Aderência à vaga</span><div class="recruta-aderencia-linha" style="--aderencia:'+Math.max(0,Math.min(100,adPct))+'"><strong>'+adPct+'%</strong></div><small class="recruta-aderencia-nivel">'+adNivel+'</small><div class="recruta-aderencia-barra"><i style="width:'+Math.max(0,Math.min(100,adPct))+'%"></i></div></div><div><span><i class="em-info-ico em-ico-calendar" aria-hidden="true"></i>Última atualização</span><strong>'+new Date(c.atualizadoEm||c.criadoEm||Date.now()).toLocaleDateString('pt-BR')+'</strong></div></div>';
  const actions='<footer class="recruta-cand-actions recruta-acoes-unificadas"><button class="btn btn-azul" onclick="abrirFichaCandidato(\''+c.id+'\')"><i class="em-btn-ico em-ico-doc" aria-hidden="true"></i>Ver currículo</button><button class="btn" onclick="abrirFichaCandidato(\''+c.id+'\')"><i class="em-btn-ico em-ico-user" aria-hidden="true"></i>Ver perfil</button>'+(c.telefone?'<button class="btn recruta-whatsapp" onclick="contatarWhats(\''+c.id+'\')"><i class="em-btn-ico em-ico-whatsapp" aria-hidden="true"></i>WhatsApp</button>':'')+(c.email?'<a class="btn link-btn" href="mailto:'+esc(c.email)+'"><i class="em-btn-ico em-ico-mail" aria-hidden="true"></i>E-mail</a>':'')+'<button class="btn" onclick="abrirEntrevista(\''+c.id+'\')"><i class="em-btn-ico em-ico-calendar" aria-hidden="true"></i>Agendar entrevista</button></footer>';

  return '<article class="recruta-cand-card status-'+String(c.status||'Em avaliação').toLowerCase().replace(/[^a-z0-9]+/g,'-')+'"><header class="recruta-cand-head"><div class="recruta-cand-ident"><div class="recruta-cand-monograma">'+esc(nomeCard.charAt(0).toUpperCase())+'</div><div><h3>'+esc(nomeCard)+'</h3><p>'+esc([c.curriculo?.cidade||c.perfilProfissional?.cidade||'',vc.modalidade||''].filter(Boolean).join(' · '))+'</p><div class="recruta-cand-meta"><span>'+(c.curriculoOrigem==='online'?'Currículo online':c.curriculo?.nome?'Currículo anexado':'Perfil EmpregaMais')+'</span><span>Candidatura '+(c.criadoEm?new Date(c.criadoEm).toLocaleDateString('pt-BR'):'—')+'</span></div></div></div></header><div class="recruta-cand-preview-info">'+infoCards+'</div>'+actions+'<button type="button" class="recruta-preview-andamento" onclick="alternarAndamentoRecrutadorEM(this)" aria-expanded="false"><span>Etapas do processo</span><b>Ver andamento</b><i>↗</i></button><div class="recruta-andamento">'+informacoesProcesso+linha+infoCards+actions+'</div></article>';
 }).join(''):'<div class="vagas-vazio">Nenhum candidato encontrado com estes filtros.</div>';
 box.innerHTML=html;
}

function alternarAndamentoRecrutadorEM(btn){
 const card=btn?.closest('.recruta-cand-card'),box=card?.querySelector('.recruta-andamento');if(!box||!card)return;
 document.querySelector('.recruta-andamento-modal-em')?.remove();
 const nome=card.querySelector('.recruta-cand-head h3')?.textContent?.trim()||'Candidato';
 const local=card.querySelector('.recruta-cand-ident p')?.textContent?.trim()||'';
 const data=card.querySelectorAll('.recruta-cand-meta span')[1]?.textContent?.replace('Candidatura ','')?.trim()||'';
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
function abrirFichaCandidato(id){const c=candidaturas().find(x=>x.id===id);if(!c)return;const p=c.perfilProfissional||{},curr=c.curriculo||null,online=c.curriculoOrigem==='online'?(curr||{}):{},box=$('#fichaCandidatoConteudo');if(!box)return;const linha=(t,v)=>v?'<div class="ficha-linha"><span>'+t+'</span><strong>'+esc(v)+'</strong></div>':'';const cvLinha=(t,v)=>v?'<div><small>'+t+'</small><strong>'+esc(v)+'</strong></div>':'';const exps=Array.isArray(online.experiencias)?online.experiencias:[],forms=Array.isArray(online.formacoes)?online.formacoes:[],cursos=Array.isArray(online.cursos)?online.cursos:[];const cvOnline=c.curriculoOrigem==='online'?'<section class="ficha-cv-online"><div class="ficha-cv-title"><div class="ficha-cv-identidade"><div class="ficha-cv-monograma">'+esc((online.nome||c.candidato||'C').trim().charAt(0).toUpperCase())+'</div><div><span>CURRÍCULO EMPREGAMAIS</span><h3>'+esc(online.nome||c.candidato||'Candidato')+'</h3><p>'+esc(online.titulo||online.objetivo||'Perfil profissional')+'</p></div></div><b>✓ Currículo online</b></div><div class="ficha-cv-grid">'+cvLinha('E-mail',online.email||c.email)+cvLinha('Telefone',online.telefone||c.telefone)+cvLinha('Cidade',[online.cidade,online.uf].filter(Boolean).join(' - '))+cvLinha('Área de atuação',online.area)+cvLinha('Objetivo',online.objetivo)+cvLinha('Pretensão salarial',online.pretensao)+'</div>'+(online.resumo?'<div class="ficha-cv-bloco"><h4>Resumo profissional</h4><p>'+esc(online.resumo)+'</p></div>':'')+(exps.length?'<div class="ficha-cv-bloco"><h4>Experiência profissional</h4>'+exps.map(x=>'<article><strong>'+esc(x.cargo||'Experiência')+'</strong><span>'+esc(x.empresa||'')+(x.inicio?' · '+esc(x.inicio):'')+(x.atual?' — Atual':x.fim?' — '+esc(x.fim):'')+'</span>'+(x.atividades?'<p>'+esc(x.atividades)+'</p>':'')+'</article>').join('')+'</div>':'')+(forms.length?'<div class="ficha-cv-bloco"><h4>Formação</h4>'+forms.map(x=>'<article><strong>'+esc(x.curso||x.formacao||'Formação')+'</strong><span>'+esc(x.instituicao||'')+'</span></article>').join('')+'</div>':'')+(cursos.length?'<div class="ficha-cv-bloco"><h4>Cursos e qualificações</h4>'+cursos.map(x=>'<article><strong>'+esc(x.nome||x.curso||'Curso')+'</strong><span>'+esc(x.instituicao||'')+'</span></article>').join('')+'</div>':'')+(online.competencias?'<div class="ficha-cv-bloco"><h4>Competências</h4><p>'+esc(online.competencias)+'</p></div>':'')+(online.idiomas?'<div class="ficha-cv-bloco"><h4>Idiomas</h4><p>'+esc(online.idiomas)+'</p></div>':'')+'</section>':'';box.innerHTML='<div class="ficha-topo"><div class="ficha-avatar">'+esc((c.candidato||'C').charAt(0).toUpperCase())+'</div><div><span class="ficha-status">'+esc(c.status||'Em avaliação')+'</span><h2>'+esc(c.candidato||'Candidato')+'</h2><p>'+esc(c.email||'')+(c.telefone?' · '+esc(formatarTelefoneBR_EM(c.telefone)):'')+'</p></div></div>'+cvOnline+(c.curriculoOrigem!=='online'?'<div class="ficha-grid">'+linha('Título profissional',p.titulo)+linha('Área',p.area)+linha('Escolaridade',p.escolaridade)+linha('Experiência',p.experiencia)+'</div>':'')+(p.resumo?'<section><h3>Resumo profissional</h3><p>'+esc(p.resumo)+'</p></section>':'')+(p.competencias?'<section><h3>Competências</h3><p>'+esc(p.competencias)+'</p></section>':'')+(c.entrevista&&!c.entrevista.encerrada?'<section class="entrevista-resumo"><h3>Entrevista agendada</h3><p><strong>'+new Date(c.entrevista.data+'T'+c.entrevista.hora).toLocaleString('pt-BR')+'</strong> · '+esc(c.entrevista.formato)+(c.entrevista.local?'<br>'+esc(c.entrevista.local):'')+'</p></section>':'')+'<section class="ficha-curriculo"><h3>Currículo utilizado</h3><p>'+(c.curriculoOrigem==='online'?'<strong>Currículo online EmpregaMais anexado à candidatura</strong>':c.curriculoOrigem==='cadastrado'&&curr?'Arquivo cadastrado: <strong>'+esc(curr.nome)+'</strong>':'Perfil profissional do EmpregaMais')+'</p><button type="button" class="btn btn-azul" style="margin-top:10px" onclick="abrirCurriculoFormatadoEM(\''+c.id+'\')">▤ Ver currículo formatado / Baixar PDF</button></section><div class="ficha-links">'+(p.linkedin||online.linkedin?'<a class="btn" target="_blank" rel="noopener noreferrer" href="'+esc(p.linkedin||online.linkedin)+'">LinkedIn</a>':'')+(c.telefone?'<button class="btn btn-azul" onclick="contatarWhats(\''+c.id+'\')">WhatsApp</button>':'')+(c.email?'<a class="btn" href="mailto:'+esc(c.email)+'">E-mail</a>':'')+'<button class="btn btn-chat-em" onclick="abrirChatCandidatoEM(\''+c.id+'\')">💬 Mensagens</button></div>'+renderChatCandidaturaEM(c,'empresa');$('#modalFichaCandidato').classList.add('ficha-ampla');$('#modalFichaCandidato').classList.remove('oculto')}function abrirCurriculoFormatadoEM(id){const c=candidaturas().find(x=>x.id===id);if(!c)return;const o=c.curriculoOrigem==='online'?(c.curriculo||{}):{},p=c.perfilProfissional||{},nome=o.nome||c.candidato||'Candidato',titulo=o.titulo||p.titulo||o.objetivo||'Perfil profissional',cont=[o.email||c.email,o.telefone||c.telefone,[o.cidade,o.uf].filter(Boolean).join(' - ')].filter(Boolean),sec=(t,v)=>v?'<section><h2>'+t+'</h2><p>'+esc(v)+'</p></section>':'',exp=Array.isArray(o.experiencias)?o.experiencias:[],form=Array.isArray(o.formacoes)?o.formacoes:[],cursos=Array.isArray(o.cursos)?o.cursos:[];const folha='<div class="cv-doc-head"><h1>'+esc(nome)+'</h1><h3>'+esc(titulo)+'</h3><p>'+cont.map(esc).join(' • ')+'</p></div>'+sec('Objetivo profissional',o.objetivo)+sec('Resumo profissional',o.resumo||p.resumo)+(exp.length?'<section><h2>Experiência profissional</h2>'+exp.map(x=>'<article><h4>'+esc(x.cargo||'Experiência')+'</h4><b>'+esc(x.empresa||'')+'</b><small>'+esc(x.inicio||'')+(x.atual?' — Atual':x.fim?' — '+esc(x.fim):'')+'</small>'+(x.atividades?'<p>'+esc(x.atividades)+'</p>':'')+'</article>').join('')+'</section>':'')+(form.length?'<section><h2>Formação acadêmica</h2>'+form.map(x=>'<article><h4>'+esc(x.curso||x.formacao||'Formação')+'</h4><b>'+esc(x.instituicao||'')+'</b></article>').join('')+'</section>':'')+(cursos.length?'<section><h2>Cursos e qualificações</h2>'+cursos.map(x=>'<article><h4>'+esc(x.nome||x.curso||'Curso')+'</h4><b>'+esc(x.instituicao||'')+'</b></article>').join('')+'</section>':'')+sec('Competências',o.competencias||p.competencias)+sec('Idiomas',o.idiomas);const w=window.open('','_blank');if(!w){alert('Permita pop-ups para visualizar o currículo.');return}w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>Currículo - '+esc(nome)+'</title><style>@page{size:A4;margin:14mm}*{box-sizing:border-box}body{margin:0;background:#edf1f4;font-family:Arial,sans-serif;color:#263746}.bar{position:sticky;top:0;z-index:5;display:flex;justify-content:space-between;align-items:center;padding:12px 22px;background:#123e5d;color:#fff}.bar strong{font-size:14px}.bar button{border:0;border-radius:7px;background:#fff;color:#123e5d;padding:9px 14px;font-weight:700;cursor:pointer}.page{width:210mm;min-height:297mm;margin:24px auto;padding:20mm 18mm;background:#fff;box-shadow:0 5px 25px #0002}.cv-doc-head{padding-bottom:18px;border-bottom:3px solid #176f86}.cv-doc-head h1{margin:0;color:#123e5d;font-size:30px}.cv-doc-head h3{margin:5px 0;color:#437087;font-size:15px}.cv-doc-head p{font-size:11px;color:#607887}section{margin-top:22px}section h2{margin:0 0 9px;color:#176f86;font-size:14px;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid #d9e3e8;padding-bottom:5px}section p{font-size:12px;line-height:1.65;margin:0}article{margin:11px 0}article h4{font-size:13px;margin:0 0 3px}article b,article small{display:block;font-size:11px;color:#617786;margin-top:2px}article p{margin-top:6px}@media print{body{background:#fff}.bar{display:none}.page{width:auto;min-height:0;margin:0;padding:0;box-shadow:none}}</style></head><body><div class="bar"><strong>Currículo EmpregaMais</strong><button onclick="window.print()">Baixar / Salvar em PDF</button></div><main class="page">'+folha+'</main></body></html>');w.document.close()}
function fecharFichaCandidato(){const m=$('#modalFichaCandidato');m?.classList.add('oculto');m?.classList.remove('ficha-ampla')}function filtrarCandidatos(g){sessionStorage.setItem('filtroCandidatos',g);renderizarCandidatosEmpresa()}
function abrirEntrevista(id){const c=candidaturas().find(x=>x.id===id);if(!c)return;if(['Contratado','Reprovado'].includes(c.status)){alert('Este processo já foi encerrado para o candidato.');return}if(c.entrevista?.encerrada){c.entrevista=null}$('#entrevistaCandidaturaId').value=id;$('#entrevistaCandidatoNome').textContent='Candidato: '+(c.candidato||c.nome||'');$('#entrevistaData').value=c.entrevista?.data||'';$('#entrevistaHora').value=c.entrevista?.hora||'';$('#entrevistaFormato').value=c.entrevista?.formato||'Online';$('#entrevistaLocal').value=c.entrevista?.local||'';$('#entrevistaObs').value=c.entrevista?.observacoes||'';$('#modalEntrevista').classList.remove('oculto')}
function fecharEntrevista(){$('#modalEntrevista')?.classList.add('oculto')}
function salvarEntrevista(e){e.preventDefault();const id=$('#entrevistaCandidaturaId').value,a=candidaturas(),i=a.findIndex(c=>c.id===id);if(i<0)return;if(['Contratado','Reprovado'].includes(a[i].status)){alert('Este processo já foi encerrado para o candidato.');fecharEntrevista();return}const data=$('#entrevistaData').value,hora=$('#entrevistaHora').value,quando=new Date(data+'T'+hora);if(!data||!hora||Number.isNaN(quando.getTime())||quando<=new Date()){alert('Escolha uma data e horário futuros para a entrevista.');return}const agora=new Date().toISOString();a[i].entrevista={data,hora,formato:$('#entrevistaFormato').value,local:$('#entrevistaLocal').value.trim(),observacoes:$('#entrevistaObs').value.trim(),agendadaEm:agora};a[i].status='Entrevista agendada';a[i].atualizadoEm=agora;a[i].historico=Array.isArray(a[i].historico)?a[i].historico:[];a[i].historico.push({status:'Entrevista agendada',data:agora});gravar('empregaMaisCandidaturas',a);fecharEntrevista();renderizarCandidatosEmpresa()}
function mudarEtapaCandidato(id,status){const a=candidaturas(),i=a.findIndex(c=>c.id===id);if(i<0)return;const anterior=a[i].status||'Em avaliação',fluxo=['Selecionado','Em contato','Entrevista agendada','Aprovado','Contratado'];if(anterior===status)return;if(anterior==='Reprovado'||anterior==='Contratado'){alert('Este processo já foi encerrado e não pode voltar para uma etapa anterior.');renderizarCandidatosEmpresa();return}const pa=fluxo.indexOf(anterior),pn=fluxo.indexOf(status);if(pa>=0&&(status==='Em avaliação'||(pn>=0&&pn<pa))){alert('Após selecionar o candidato, não é possível retornar para uma etapa anterior.');renderizarCandidatosEmpresa();return}if(anterior!=='Em avaliação'&&status==='Reprovado'){if(!confirm('Deseja encerrar este candidato como Não selecionado? Esta ação não poderá ser desfeita.')){renderizarCandidatosEmpresa();return}}a[i].status=status;a[i].atualizadoEm=new Date().toISOString();a[i].historico=Array.isArray(a[i].historico)?a[i].historico:[];a[i].historico.push({status,data:a[i].atualizadoEm});if(status==='Contratado'&&!a[i].contratadoEm)a[i].contratadoEm=a[i].atualizadoEm;if(a[i].entrevista&&['Reprovado','Contratado'].includes(status))a[i].entrevista={...a[i].entrevista,encerrada:true,encerradaEm:a[i].atualizadoEm};gravar('empregaMaisCandidaturas',a);const filtroAtual=sessionStorage.getItem('filtroCandidatos')||'Todos';if(filtroAtual!=='Todos'&&grupoEtapa(status)!==filtroAtual)sessionStorage.setItem('filtroCandidatos',grupoEtapa(status));renderizarCandidatosEmpresa()}
function contatarWhats(id){const c=candidaturas().find(x=>x.id===id),v=ler('empregaMaisVagas').find(x=>x.id===c?.vagaId);if(!c||!c.telefone)return;let f=nums(c.telefone);if(f.length<10){alert('O telefone deste candidato está incompleto.');return}if(f.length<=11)f='55'+f;const texto='Olá, '+(c.candidato||c.nome||'')+'! Meu nome é [SEU NOME] e falo em nome da '+(sessionStorage.getItem('empresaNome')||'empresa')+'. Recebemos seu currículo para a vaga de '+tituloVaga(v||{})+' pelo EmpregaMais e gostaríamos de conversar sobre o processo seletivo.';window.open('https://wa.me/'+f+'?text='+encodeURIComponent(texto),'_blank')}
function atualizarPainelCandidato(){const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),apps=candidaturas().filter(c=>(c.email||'').toLowerCase()===email),curr=ler(chaveCurriculo(),null),cvOnline=dadosCurriculoOnlineEM(),ids=salvas(),perfil=candidatoLogado()?.perfil||{},entrev=apps.filter(c=>grupoEtapa(c.status)==='Entrevista').length;const set=(id,v)=>{const e=$('#'+id);if(e)e.textContent=v};const nomeCand=sessionStorage.getItem('candidatoNome')||candidatoLogado()?.nome||'Candidato';set('candSideNome',nomeCand);set('candSideAvatar',String(nomeCand).charAt(0).toUpperCase());set('candHeroTitulo','Olá, '+String(nomeCand).split(' ')[0]+'!');const camposPerfil=[perfil.titulo,perfil.area,perfil.escolaridade,perfil.experiencia,perfil.resumo,perfil.competencias,perfil.modalidade,candidatoLogado()?.cidade],preenchidos=camposPerfil.filter(Boolean).length,pct=Math.round(preenchidos/camposPerfil.length*100);set('candPerfilProgressoTexto',pct+'% completo');const barra=$('#candPerfilProgressoBarra');if(barra)barra.style.width=pct+'%';const cvCampos=[cvOnline.nome,cvOnline.titulo,cvOnline.email,cvOnline.telefone,cvOnline.cidade,cvOnline.uf,cvOnline.area,cvOnline.objetivo,cvOnline.escolaridade,cvOnline.competencias],cvPreenchidos=cvCampos.filter(v=>String(v||'').trim()).length,cvExtras=(Array.isArray(cvOnline.experiencias)&&cvOnline.experiencias.length?1:0)+(Array.isArray(cvOnline.formacoes)&&cvOnline.formacoes.length?1:0),cvTotal=cvCampos.length+2,cvPct=Math.min(100,Math.round((cvPreenchidos+cvExtras)/cvTotal*100)),cvExiste=cvPreenchidos>0||cvExtras>0,cvStatus=!cvExiste?'Pendente':cvPct>=80?'Completo':cvPct+'% completo';set('candMetricaCurriculo',cvStatus);set('candMetricaCandidaturas',apps.length);set('candMetricaEntrevistas',entrev);set('candMetricaSalvas',ids.length);const cvSmall=document.querySelector('#candMetricaCurriculo')?.parentElement?.querySelector('small');if(cvSmall)cvSmall.textContent=!cvExiste?'Crie seu currículo online':cvPct>=80?'Currículo online atualizado':'Continue preenchendo seu currículo';const cvKpi=document.querySelector('#candMetricaCurriculo')?.closest('article');if(cvKpi){cvKpi.classList.toggle('curriculo-completo',cvExiste&&cvPct>=80);cvKpi.classList.toggle('curriculo-parcial',cvExiste&&cvPct<80);cvKpi.classList.toggle('curriculo-pendente',!cvExiste);cvKpi.setAttribute('aria-label',cvExiste&&cvPct>=80?'Currículo completo. Abrir currículo online':!cvExiste?'Currículo pendente. Criar currículo online':'Currículo '+cvPct+'% completo. Continuar preenchimento');}const jornada=$('#resumoJornadaCandidato');if(jornada)jornada.innerHTML=apps.length?apps.slice().sort((a,b)=>new Date(b.criadoEm||0)-new Date(a.criadoEm||0)).slice(0,4).map(c=>{const v=ler('empregaMaisVagas').find(x=>x.id===c.vagaId)||{};return'<div class="jornada-item"><div><strong>'+esc(tituloVaga(v)||c.vagaTitulo||'Vaga')+'</strong><span>'+esc(v.confidencial?'Empresa confidencial':v.empresa||'')+'</span></div><span class="vaga-status">'+esc(c.status||'Em avaliação')+'</span></div>'}).join(''):'<div class="vagas-vazio"><strong>Nenhuma candidatura ainda</strong><span>Encontre uma oportunidade e acompanhe o processo por aqui.</span></div>';const rec=$('#vagasRecomendadasCandidato');if(rec){const area=String(perfil.area||'').toLowerCase(),cidade=String(candidatoLogado()?.cidade||'').toLowerCase(),mod=perfil.modalidade||'',aplicadas=new Set(apps.map(c=>c.vagaId));let vagas=vagasPublicas().filter(v=>!aplicadas.has(v.id));vagas.sort((a,b)=>{const pa=(area&&String(a.area||'').toLowerCase().includes(area)?3:0)+(cidade&&String(a.cidade||'').toLowerCase()===cidade?2:0)+(mod&&a.modalidade===mod?1:0),pb=(area&&String(b.area||'').toLowerCase().includes(area)?3:0)+(cidade&&String(b.cidade||'').toLowerCase()===cidade?2:0)+(mod&&b.modalidade===mod?1:0);return pb-pa||new Date(b.criadoEm||0)-new Date(a.criadoEm||0)});rec.innerHTML=vagas.length?vagas.slice(0,4).map(cardVagaPortal).join(''):'<div class="vagas-vazio"><strong>Sem recomendações no momento</strong><span>Complete seu perfil e volte em breve.</span></div>'}try{atualizarSeguirEmpresaEM()}catch(e){} }

async function sincronizarCandidatoLogadoSupabaseEM(){
 const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),userId=sessionStorage.getItem('candidatoSupabaseUserId')||'';
 if(!email&&!userId)return null;
 try{
  const t=await sbGarantirSessaoEM();if(!t)return null;
  const filtro=userId?'user_id=eq.'+encodeURIComponent(userId):'email=eq.'+encodeURIComponent(email);
  const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/candidatos?select=*&'+filtro+'&limit=1',{method:'GET',headers:sbHeadersEM(t)});
  const x=Array.isArray(rows)?rows[0]:null;if(!x)return null;
  const atual=sbSalvarCandidatoLocalEM({id:x.id||'',userId:x.user_id||'',nome:x.nome||'',email:String(x.email||'').toLowerCase(),telefone:x.telefone||'',cidade:x.cidade||'',perfil:(x.perfil&&typeof x.perfil==='object')?x.perfil:{},premium:x.premium===true,premiumAtivo:x.premium===true,premiumCortesiaAdmin:x.premium_cortesia_admin===true,planoCandidato:x.premium===true?'premium':'',premiumAtivadoEm:x.premium_ativado_em||'',premiumValidoAte:x.premium_valido_ate||'',criadoEm:x.criado_em||'',atualizadoEm:x.atualizado_em||''});
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


function avaliacoesProcessosEM(){return ler('empregaMaisAvaliacoesProcessos',[])}
function renderizarAvaliacoesProcessosEM(){
 const box=document.getElementById('listaAvaliacoesProcessosEM');if(!box)return;
 const cand=candidatoLogado(),premium=candidatoPremiumAtivoEM(cand);
 if(!premium){box.innerHTML='<div class="cand-avaliacao-bloqueio"><h3>Recurso exclusivo Premium</h3><p>Assine o Premium para avaliar os processos seletivos dos quais você participou.</p><button onclick="irPara(\'premium-candidato\')">Conhecer Premium</button></div>';return}
 const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),vagas=ler('empregaMaisVagas'),avs=avaliacoesProcessosEM();
 const lista=candidaturas().filter(c=>(c.email||'').toLowerCase()===email);
 box.innerHTML=lista.length?lista.map(c=>{const v=vagas.find(x=>String(x.id)===String(c.vagaId))||{},nome=v.confidencial?'Empresa confidencial':(v.empresa||'Empresa'),ja=avs.find(a=>String(a.candidaturaId)===String(c.id)&&a.candidatoEmail===email);return '<article class="cand-avaliacao-card"><div><h3>'+esc(tituloVaga(v)||c.vagaTitulo||'Processo seletivo')+'</h3><p>'+esc(nome)+' · '+esc(c.status||'Em avaliação')+'</p><small>Candidatura '+(c.criadoEm?new Date(c.criadoEm).toLocaleDateString('pt-BR'):'')+'</small></div>'+(ja?'<button class="avaliado" disabled>✓ Avaliado · '+ja.nota+'/5</button>':'<button onclick="abrirAvaliacaoProcessoEM(\''+c.id+'\')">Avaliar processo</button>')+'</article>'}).join(''):'<div class="cand-avaliacao-bloqueio"><h3>Nenhum processo para avaliar</h3><p>Quando você participar de um processo seletivo, ele aparecerá aqui.</p><button onclick="irPara(\'home\')">Buscar vagas</button></div>';
}
let avaliacaoProcessoNotaEM=0;
function abrirAvaliacaoProcessoEM(id){
 const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),c=candidaturas().find(x=>String(x.id)===String(id)&&(x.email||'').toLowerCase()===email);if(!c)return;
 if(!candidatoPremiumAtivoEM(candidatoLogado())){irPara('premium-candidato');return}
 if(avaliacoesProcessosEM().some(a=>String(a.candidaturaId)===String(id)&&a.candidatoEmail===email)){alert('Você já avaliou este processo seletivo.');return}
 const v=ler('empregaMaisVagas').find(x=>String(x.id)===String(c.vagaId))||{};avaliacaoProcessoNotaEM=0;
 document.getElementById('avaliacaoProcessoModalEM')?.remove();const m=document.createElement('div');m.id='avaliacaoProcessoModalEM';m.className='avaliacao-processo-modal';
 m.innerHTML='<div class="avaliacao-processo-backdrop" onclick="fecharAvaliacaoProcessoEM()"></div><div class="avaliacao-processo-dialog"><button class="avaliacao-processo-fechar" onclick="fecharAvaliacaoProcessoEM()">×</button><h2>Avaliar processo seletivo</h2><p>'+esc(tituloVaga(v)||c.vagaTitulo||'Vaga')+' · '+esc(v.confidencial?'Empresa confidencial':(v.empresa||'Empresa'))+'</p><label>Sua experiência</label><div class="avaliacao-estrelas">'+[1,2,3,4,5].map(n=>'<button type="button" data-nota="'+n+'" onclick="selecionarNotaProcessoEM('+n+')">★</button>').join('')+'</div><label>Conte como foi o processo<textarea id="avaliacaoProcessoComentarioEM" maxlength="800" placeholder="Ex.: comunicação da empresa, clareza das etapas, retorno recebido..."></textarea></label><div class="avaliacao-processo-acoes"><button onclick="fecharAvaliacaoProcessoEM()">Cancelar</button><button class="primario" onclick="salvarAvaliacaoProcessoEM(\''+id+'\')">Enviar avaliação</button></div></div>';document.body.appendChild(m);
}
function selecionarNotaProcessoEM(n){avaliacaoProcessoNotaEM=n;document.querySelectorAll('#avaliacaoProcessoModalEM [data-nota]').forEach(b=>b.classList.toggle('ativa',Number(b.dataset.nota)<=n))}
function fecharAvaliacaoProcessoEM(){document.getElementById('avaliacaoProcessoModalEM')?.remove();avaliacaoProcessoNotaEM=0}
function salvarAvaliacaoProcessoEM(id){
 if(avaliacaoProcessoNotaEM<1){alert('Selecione uma nota de 1 a 5 estrelas.');return}
 const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),c=candidaturas().find(x=>String(x.id)===String(id)&&(x.email||'').toLowerCase()===email);if(!c)return;
 const lista=avaliacoesProcessosEM();if(lista.some(a=>String(a.candidaturaId)===String(id)&&a.candidatoEmail===email)){fecharAvaliacaoProcessoEM();return}
 lista.unshift({id:'AVP-'+Date.now(),candidaturaId:c.id,vagaId:c.vagaId,candidatoEmail:email,nota:avaliacaoProcessoNotaEM,comentario:(document.getElementById('avaliacaoProcessoComentarioEM')?.value||'').trim(),criadoEm:new Date().toISOString()});gravar('empregaMaisAvaliacoesProcessos',lista);fecharAvaliacaoProcessoEM();renderizarAvaliacoesProcessosEM();
}
function renderizarCandidaturasCandidato(){const box=$('#listaCandidaturas');if(!box)return;const email=(sessionStorage.getItem('candidatoEmail')||'').toLowerCase(),a=candidaturas().filter(c=>(c.email||'').toLowerCase()===email).sort((x,y)=>new Date(y.criadoEm||0)-new Date(x.criadoEm||0)),grupo=c=>grupoEtapa(c.status),emProcesso=a.filter(c=>['Selecionados','Em contato','Entrevista','Aprovados'].includes(grupo(c))).length,emAnalise=a.filter(c=>grupo(c)==='Em avaliação').length,finalizadas=a.filter(c=>['Contratados','Reprovados'].includes(grupo(c))).length;box.innerHTML='<div class="cand-page-resumo"><div><small>TOTAL DE CANDIDATURAS</small><strong>'+a.length+'</strong></div><div><small>EM ANÁLISE</small><strong>'+emAnalise+'</strong></div><div><small>EM PROCESSO</small><strong>'+emProcesso+'</strong></div><div><small>FINALIZADAS</small><strong>'+finalizadas+'</strong></div></div><div class="cand-page-toolbar"><div><strong>Acompanhe seus processos</strong><span>Veja em qual etapa está cada candidatura.</span></div><select id="candFiltroStatus" onchange="filtrarCandidaturasPaginaEM()"><option value="">Todos os status</option><option value="Em avaliação">Em análise</option><option value="Selecionados">Selecionado</option><option value="Em contato">Em contato</option><option value="Entrevista">Entrevista</option><option value="Aprovados">Aprovado</option><option value="Contratados">Contratado</option><option value="Reprovados">Processo encerrado</option></select></div><div id="candListaElegante">'+(a.length?a.map(c=>{const v=ler('empregaMaisVagas').find(x=>x.id===c.vagaId)||{},etapas=['Candidatura enviada','Em análise','Selecionado','Em contato','Entrevista','Aprovado','Contratado'],g=grupo(c),idx=({'Em avaliação':1,'Selecionados':2,'Em contato':3,'Entrevista':4,'Aprovados':5,'Contratados':6}[g]??1),reprov=g==='Reprovados',logo=logoEmpresaVaga(v),nome=v.confidencial?'Empresa confidencial':(v.empresa||'Empresa'),emp=ler('empregaMaisEmpresas').find(e=>nums(e.cnpj||'')===nums(v.empresaCnpj||v.cnpj||''))||{},ver= !v.confidencial&&(emp.verificada||emp.verificacaoStatus==='aprovada'),data=c.criadoEm?new Date(c.criadoEm).toLocaleDateString('pt-BR'):'',linhaBase=reprov?'<div class="cand-processo-encerrado cand-nao-selecionado"><b>Não selecionado</b><span>Seu perfil não foi selecionado para continuar neste processo seletivo.</span></div>':'<div class="candidatura-timeline">'+etapas.map((e,i)=>{const canon=['Candidatura enviada','Em avaliação','Selecionado','Em contato','Entrevista agendada','Aprovado','Contratado'][i],dt=sbDataEtapaCandidaturaEM(c,canon)||(i===0?c.criadoEm:'');const concluida=i<idx||(g==='Contratados'&&i===idx),classe=concluida?'feito '+(i===idx?'atual-final ':''):i===idx?'atual ':'';return '<div class="'+classe+'"><i>'+(concluida?'✓':'')+'</i><span>'+e+'</span><small>'+(dt?new Date(dt).toLocaleDateString('pt-BR'):(i===1&&g==='Em avaliação'?'Aguardando retorno':'—'))+'</small></div>'}).join('')+'</div>';const linha=reprov?linhaBase:'<div class="cand-processo-snippet"><div><span>PROCESSO SELETIVO</span><strong>'+esc(etapas[idx]||'Em análise')+(g==='Contratados'?' ✓':'')+'</strong><small>Acompanhe as atualizações desta candidatura.</small></div><button type="button" onclick="alternarTimelineCandidatoEM(this)">Ver andamento completo →</button></div><div class="cand-timeline-detalhe">'+linhaBase+'</div>',entrevista=c.entrevista&&!c.entrevista.encerrada?'<div class="entrevista-resumo"><strong>Entrevista agendada</strong><span>'+new Date(c.entrevista.data+'T'+c.entrevista.hora).toLocaleString('pt-BR')+' · '+esc(c.entrevista.formato||'')+'</span>'+(c.entrevista.local?'<span>'+esc(c.entrevista.local)+'</span>':'')+(c.entrevista.observacoes?'<small>'+esc(c.entrevista.observacoes)+'</small>':'')+'</div>':'';return '<article class="candidato-card candidatura-card candidatura-acompanhamento cand-elegante" data-cand-grupo="'+esc(g)+'"><div class="cand-card-head"><div class="cand-identidade">'+(logo?'<img src="'+esc(logo)+'" alt="">':'<div class="cand-logo-fallback">'+esc(nome.charAt(0).toUpperCase())+'</div>')+'<div><h3>'+esc(tituloVaga(v)||c.vagaTitulo||'Vaga')+'</h3><p>'+esc(nome)+(ver?' <span class="empresa-verificada-card" title="Empresa verificada">✓</span>':'')+'</p><small>'+esc(v.cidade||'')+(v.estado?' - '+esc(v.estado):'')+(v.modalidade?' · '+esc(v.modalidade):'')+'</small></div></div><div class="cand-status-col"><span class="cand-status cand-status-'+(reprov?'encerrado':g==='Contratados'?'contratado':g==='Aprovados'?'aprovado':g==='Entrevista'?'entrevista':'andamento')+'">'+esc(c.status||'Em avaliação')+'</span><small>Candidatou-se'+(data?' em '+data:'')+'</small></div></div>'+linha+entrevista+'<div class="cand-card-bottom"><div class="cand-envio-ok"><b>ⓘ Sua candidatura foi enviada com sucesso!</b><span>A empresa está analisando seu perfil. Você será notificado sobre as próximas etapas.</span></div><div class="cand-card-actions">'+(v.id?'<button type="button" onclick="abrirVaga(\''+v.id+'\')">◉ Ver vaga</button>':'')+'<button type="button" onclick="irPara(\'curriculo-candidato\')">▤ Ver currículo enviado</button><button type="button" class="cand-retirar" onclick="retirarCandidaturaEM(\''+c.id+'\')">♲ Retirar candidatura</button></div></div>'+'</article>'}).join(''):'<div class="vagas-vazio"><strong>Você ainda não possui candidaturas</strong><span>Quando se candidatar a uma vaga, o andamento aparecerá aqui.</span></div>')+'</div>'}
function filtrarCandidaturasPaginaEM(){const f=document.getElementById('candFiltroStatus')?.value||'';document.querySelectorAll('#candListaElegante [data-cand-grupo]').forEach(x=>x.style.display=!f||x.dataset.candGrupo===f?'':'none')}
function vagasPublicas(){return ler('empregaMaisVagas').filter(v=>v.status==='aprovada'&&vagaDentroPrazo(v))}
function tituloVaga(v){return String(v.cargo||v.titulo||'Vaga').toLocaleUpperCase('pt-BR')}function preencherAreasPortal(){const el=$('#filtroArea');if(!el||el.options.length>1)return;[...new Set(vagasPublicas().map(v=>v.area).filter(Boolean))].sort().forEach(x=>el.add(new Option(x,x)))}function textoDataVaga(v){const d=new Date(v.criadoEm||Date.now()),dias=Math.max(0,Math.floor((Date.now()-d.getTime())/86400000));return dias===0?'Publicada hoje':dias===1?'Publicada ontem':'Publicada há '+dias+' dias'}function textoPrazoVaga(v){if(!v.dataEncerramento)return'';const hoje=new Date();hoje.setHours(0,0,0,0);const fim=new Date(v.dataEncerramento+'T00:00:00'),dias=Math.ceil((fim-hoje)/86400000);if(dias<0)return'Inscrições encerradas';if(dias===0)return'Último dia';if(dias===1)return'Encerra amanhã';return'Encerra em '+dias+' dias'}function vagaDentroPrazo(v){if(!v.dataEncerramento)return true;return new Date(v.dataEncerramento+'T23:59:59')>=new Date()}function destaqueAtivo(v){return !!v.destaque&&(!v.destaqueAte||new Date(v.destaqueAte)>=new Date())}function logoEmpresaVaga(v){if(v.confidencial)return'';const c=nums(v.empresaCnpj||v.cnpj||'');const emp=ler('empregaMaisEmpresas').find(e=>nums(e.cnpj||'')===c);return v.logo||v.logoUrl||v.empresaLogo||emp?.logo||emp?.perfil?.logo||''}
function cardVagaPortal(v){
 const logo=logoEmpresaVaga(v),nome=v.confidencial?'Empresa confidencial':(v.empresa||'Empresa');
 const empVer=ler('empregaMaisEmpresas').find(e=>nums(e.cnpj||'')===nums(v.empresaCnpj||v.cnpj||''))||{};
 const verificada=!v.confidencial&&(empVer.verificada===true||empVer.verificacaoStatus==='aprovada');
 const sal=v.salarioCombinar?'Salário a combinar':(v.salarioMax?(v.salario+' a '+v.salarioMax):(v.salario||'Salário a combinar'));
 const desc=String(v.descricao||'').trim();
 const nova48=(()=>{const d=new Date(v.criadoEm||v.data||v.dataPublicacao||0);return !isNaN(d)&&Date.now()-d.getTime()>=0&&Date.now()-d.getTime()<=48*60*60*1000})();
 const tags=(nova48?'<span class="vaga-selo nova-selo">NOVA</span>':'')+(destaqueAtivo(v)?'<span class="vaga-selo destaque-selo">EM DESTAQUE</span>':'')+(v.urgente?'<span class="vaga-selo urgente-selo">URGENTE</span>':'')+(v.senior50?'<span class="vaga-selo senior-selo">50+</span>':'');
 const seloEmpresa=verificada?'<span class="empresa-verificada-card" title="Empresa verificada" aria-label="Empresa verificada">✓</span>':'';
 return '<article class="vaga-card portal-vaga portal-vaga-nova '+(destaqueAtivo(v)?'destaque':'')+'" onclick="abrirVaga(\''+v.id+'\')"><div class="vaga-card-topo"><div class="vaga-selos">'+tags+'</div><button type="button" class="vaga-favorito" aria-label="Salvar vaga" onclick="event.stopPropagation();alternarSalvarVagaCard(\''+v.id+'\')">'+(vagaEstaSalva(v.id)?'♥':'♡')+'</button></div><div class="vaga-identidade">'+(logo?'<img class="vaga-logo" src="'+esc(logo)+'" alt="Logo '+esc(nome)+'" loading="lazy" onerror="this.style.display=\'none\'">':'<div class="vaga-logo vaga-logo-fallback">'+esc(nome.charAt(0).toUpperCase())+'</div>')+'<div class="vaga-identidade-copy"><h3>'+esc(tituloVaga(v))+'</h3><p>'+esc(nome)+seloEmpresa+'</p></div></div><div class="vaga-meta"><span><i class="meta-ico">⌖</i>'+esc(v.cidade||'')+(v.estado?' - '+esc(v.estado):'')+'</span><span><i class="meta-ico">▣</i>'+esc(v.modalidade||'')+'</span><span><i class="meta-ico">▤</i>'+esc(v.contrato||'')+'</span></div>'+(desc?'<div class="vaga-resumo-area"><small>SOBRE A VAGA</small><p class="vaga-resumo">'+esc(desc.slice(0,120))+(desc.length>120?'…':'')+'</p></div>':'<div class="vaga-resumo-area"><small>SOBRE A VAGA</small><p class="vaga-resumo">Confira os detalhes completos desta oportunidade.</p></div>')+'<div class="vaga-salario-data"><small class="data-card">Publicada '+esc(textoDataVaga(v).replace(/^Publicada\s*/i,''))+'</small></div><div class="vaga-card-rodape"><div class="vaga-rodape-salario"><small>Salário</small><strong class="salario-card">'+esc(sal)+'</strong></div><button type="button" class="vaga-ver-btn" onclick="event.stopPropagation();abrirVaga(\''+v.id+'\')">Ver vaga <b>→</b></button></div></article>';
}
function alternarSalvarVagaCard(id){if(papelAtual()!=='candidato'){sessionStorage.setItem('retornoSalvarVaga',id);irPara('login-candidato');return}sessionStorage.setItem('vagaAtual',id);alternarSalvarVaga();setTimeout(renderizarVagasPortal,0)}
function renderizarVagasPortal(){const box=$('#listaVagasPortal');if(!box)return;preencherAreasPortal();const q=($('#buscaVagas')?.value||'').toLowerCase(),cidade=($('#buscaCidade')?.value||'').toLowerCase(),mod=$('#buscaModalidade')?.value||'',area=$('#filtroArea')?.value||'',contrato=$('#filtroContrato')?.value||'',pcd=$('#filtroPcd')?.value||'',escolar=$('#filtroEscolaridade')?.value||'',salario=Number($('#filtroSalario')?.value||0);const todas=vagasPublicas(),lista=todas.filter(v=>((tituloVaga(v))+' '+(v.area||'')+' '+(v.empresa||'')).toLowerCase().includes(q)&&((v.cidade||'')+' '+(v.estado||'')).toLowerCase().includes(cidade)&&(!mod||v.modalidade===mod)&&(!area||v.area===area)&&(!contrato||v.contrato===contrato)&&(!pcd||String(v.pcd||'').includes(pcd))&&(!escolar||v.escolaridade===escolar)&&(!salario||valorSalario(v.salarioMax||v.salario)>=salario)),ordem=$('#ordenarVagas')?.value||'recentes';lista.sort((a,b)=>ordem==='salario-maior'?valorSalario(b.salarioMax||b.salario)-valorSalario(a.salarioMax||a.salario):ordem==='salario-menor'?(valorSalario(a.salario||a.salarioMax)||Infinity)-(valorSalario(b.salario||b.salarioMax)||Infinity):ordem==='encerramento'?(a.dataEncerramento?new Date(a.dataEncerramento):new Date('2999-12-31'))-(b.dataEncerramento?new Date(b.dataEncerramento):new Date('2999-12-31')):new Date(b.criadoEm||0)-new Date(a.criadoEm||0));$('#qtdVagasPortal').textContent=lista.length+' vaga'+(lista.length===1?' encontrada':'s encontradas');const ativos=$('#filtrosAtivosEM');if(ativos){const filtros=[['filtroArea','Área'],['buscaModalidade','Modalidade'],['filtroContrato','Contrato'],['filtroEscolaridade','Escolaridade'],['filtroSalario','Salário'],['filtroPcd','PcD']].map(([id,rot])=>{const el=$('#'+id),val=el?.value;if(!val)return'';const texto=el.options?.[el.selectedIndex]?.text||val;return '<button type="button" onclick="removerFiltroAtivoEM(\''+id+'\')"><span>'+esc(texto)+'</span><b>×</b></button>'}).filter(Boolean);ativos.innerHTML=filtros.length?'<span>Filtros ativos:</span>'+filtros.join(''):''}box.innerHTML=lista.length?lista.map(cardVagaPortal).join(''):'<div class="vagas-vazio"><strong>Nenhuma vaga encontrada</strong><span>Tente alterar os filtros.</span></div>';const dest=$('#listaDestaques'),d=todas.filter(destaqueAtivo).slice(0,8);if(dest)renderDestaquesEM(d);}function valorSalario(x){if(!x)return 0;let t=String(x).replace(/[^0-9,.]/g,'');if(t.includes(','))t=t.replace(/\./g,'').replace(',','.');else if((t.match(/\./g)||[]).length>1)t=t.replace(/\./g,'');return Number(t)||0}function removerFiltroAtivoEM(id){const e=$('#'+id);if(e)e.value='';renderizarVagasPortal()}function limparFiltrosVagas(){['buscaVagas','buscaCidade'].forEach(id=>{const e=$('#'+id);if(e)e.value=''});['buscaModalidade','filtroArea','filtroContrato','filtroPcd','filtroEscolaridade','filtroSalario','ordenarVagas'].forEach(id=>{const e=$('#'+id);if(e)e.value=''});renderizarVagasPortal()}function abrirVaga(id){sessionStorage.setItem('vagaAtual',id);irPara('vaga')}
function abrirEmpresaPublica(cnpj){if(!cnpj)return;sessionStorage.setItem('empresaPublicaSelecionada',cnpj);irPara('empresa-publica')}
function vagaAtual(){return ler('empregaMaisVagas').find(v=>v.id===sessionStorage.getItem('vagaAtual'))}
function calcularAderenciaCurriculoEM(v,d){if(!v||!d)return null;const norm=x=>cvNormaliza(String(x||'')),texto=norm([d.titulo,d.objetivo,d.resumo,d.competencias,d.idiomas,...(d.experiencias||[]).flatMap(x=>[x.cargo,x.empresa,x.atividades]),...(d.formacoes||[]).flatMap(x=>[x.curso,x.instituicao,x.status]),...(d.cursos||[]).flatMap(x=>[x.nome,x.instituicao])].join(' ')),itens=[];let ganho=0,total=0;const add=(nome,peso,status,det)=>{total+=peso;if(status==='sim')ganho+=peso;else if(status==='parcial')ganho+=peso*.5;itens.push({nome,status,det})};const cargo=norm(tituloVaga(v)),area=norm(v.area);if(cargo||area){const termos=(cargo+' '+area).split(/\s+/).filter(x=>x.length>3),hits=termos.filter(x=>texto.includes(x)).length;add('Cargo e área',24,hits>=Math.max(1,Math.ceil(termos.length*.45))?'sim':hits?'parcial':'nao',hits?'Há relação com seu histórico profissional.':'Não identificamos relação clara no currículo.')}if(v.escolaridade){const escV=norm(v.escolaridade),forms=(d.formacoes||[]).map(x=>norm(x.curso+' '+x.status)).join(' ');add('Formação / escolaridade',18,forms?(escV.includes('superior')&&forms?'sim':texto.includes(escV)?'sim':'parcial'):'info',forms?'Formação cadastrada comparada com a exigência da vaga.':'Formação não informada no currículo.')}if(v.modalidade){const mods=(d.modalidades||[]).map(norm);add('Modalidade',14,mods.length?(mods.includes(norm(v.modalidade))?'sim':'nao'):'info',mods.length?'Preferência: '+d.modalidades.join(', '):'Preferência de modalidade não informada.')}if(v.cidade){const mesma=norm(d.cidade)===norm(v.cidade),prox=!!d.cidadesProximas,mud=!!d.mudanca;add('Localização',14,mesma||prox||mud?'sim':'nao',mesma?'A vaga é na sua cidade.':prox?'Você aceita trabalhar em cidades próximas.':mud?'Você informou disponibilidade para mudança.':'Localização não compatível com as preferências informadas.')}const req=norm(v.requisitos),comp=(d.competencias||'').split(',').map(norm).filter(Boolean);if(req&&comp.length){const hits=comp.filter(x=>x.length>2&&req.includes(x));add('Competências',20,hits.length>=Math.max(1,Math.ceil(comp.length*.3))?'sim':hits.length?'parcial':'nao',hits.length?hits.length+' competência(s) do currículo aparecem nos requisitos.':'Nenhuma competência cadastrada foi identificada literalmente nos requisitos.')}if(/cnh|habilita/.test(req)){const ok=d.cnh==='sim';add('CNH',10,ok?'sim':'nao',ok?'CNH informada no currículo.':'A vaga menciona habilitação e o currículo não informa CNH.')}if(/ve[ií]culo|carro|moto/.test(req)){const ok=d.veiculo==='sim';add('Veículo',10,ok?'sim':'nao',ok?'Veículo próprio informado.':'A vaga menciona veículo e o currículo não informa veículo próprio.')}if(!total)return null;return{percentual:Math.round(ganho/total*100),itens}}
function alternarDetalhesAderenciaEM(btn){const card=btn?.closest('.aderencia-card'),pop=card?.querySelector('.aderencia-popover');if(!pop)return;const aberto=!pop.classList.contains('oculto');document.querySelectorAll('.aderencia-popover').forEach(x=>x.classList.add('oculto'));pop.classList.toggle('oculto',aberto);btn.setAttribute('aria-expanded',String(!aberto))}
document.addEventListener('click',function(e){if(!e.target.closest('.aderencia-card'))document.querySelectorAll('.aderencia-popover').forEach(x=>x.classList.add('oculto'))});
function aderenciaVagaAtualHTML(v){if(papelAtual()!=='candidato')return'';const d=dadosCurriculoOnlineEM();if(!d||!d.nome)return'<div class="aderencia-card aderencia-sem-cv"><b>Compatibilidade com a vaga</b><p>Crie seu Currículo EmpregaMais para comparar seu perfil profissional com os requisitos desta oportunidade.</p><button onclick="irPara(\'curriculo\')">Criar currículo online</button></div>';const a=calcularAderenciaCurriculoEM(v,d);if(!a)return'';const cls=a.percentual>=90?'aderencia-excelente':a.percentual>=75?'aderencia-alta':a.percentual>=50?'aderencia-media':a.percentual>=30?'aderencia-baixa':'aderencia-muito-baixa',detalhes='<div class="aderencia-itens">'+a.itens.map(x=>'<div class="'+x.status+'"><i>'+(x.status==='sim'?'✓':x.status==='nao'?'×':x.status==='parcial'?'~':'?')+'</i><span><b>'+esc(x.nome)+'</b><small>'+esc(x.det)+'</small></span></div>').join('')+'</div><small class="aderencia-nota">A aderência é apenas uma referência de compatibilidade e não determina a decisão do recrutador.</small>';return'<div class="aderencia-card aderencia-resumida '+cls+'"><div class="aderencia-top"><div><span>ADERÊNCIA À VAGA</span><b>'+a.percentual+'%</b></div><p>Comparação automática entre os requisitos cadastrados pela empresa e seu Currículo EmpregaMais.</p></div><div class="aderencia-bar"><i style="width:'+a.percentual+'%"></i></div><button type="button" class="aderencia-detalhes-btn" aria-expanded="false" onclick="event.stopPropagation();alternarDetalhesAderenciaEM(this)">Ver detalhes da aderência <b>›</b></button><div class="aderencia-popover oculto" onclick="event.stopPropagation()"><div class="aderencia-popover-head"><div><small>ANÁLISE DE COMPATIBILIDADE</small><strong>Detalhes da aderência</strong></div><button type="button" aria-label="Fechar" onclick="this.closest(\'.aderencia-popover\').classList.add(\'oculto\')">×</button></div>'+detalhes+'</div></div>'}
function renderizarVagaDetalhe(){const v=vagaAtual();if(!v||v.status!=='aprovada'||!vagaDentroPrazo(v)){irPara('home');return}const emp=ler('empregaMaisEmpresas').find(e=>nums(e.cnpj||'')===nums(v.empresaCnpj||''))||{},logo=logoEmpresaVaga(v),nome=v.confidencial?'Empresa confidencial':(v.empresa||'Empresa'),verificada=!v.confidencial&&(emp.verificada||emp.verificacaoStatus==='aprovada'),sal=v.salarioCombinar?'Salário a combinar':(v.salarioMax?(v.salario+' a '+v.salarioMax):(v.salario||'Salário a combinar')),beneficios=Array.isArray(v.beneficiosLista)&&v.beneficiosLista.length?v.beneficiosLista.map(x=>'<span class="beneficio-tag">'+esc(x)+'</span>').join(''):'<p>'+esc(v.beneficios||'Não informado').replace(/\n/g,'<br>')+'</p>',empresaClick=!v.confidencial&&v.empresaCnpj?' onclick="abrirEmpresaPublica(\''+v.empresaCnpj+'\')"':'';const validade=dataFimPadraoVagaEM(v),diasRestantes=Math.max(0,Math.ceil((validade-new Date())/86400000));const hero=$('#vagaHeroDetalhe');if(hero)hero.innerHTML='<div class="vaga-hero-identidade vaga-hero-op2">'+(logo?'<img src="'+esc(logo)+'" class="vaga-hero-logo" alt="Logo '+esc(nome)+'">':'<div class="vaga-hero-logo vaga-logo-fallback">'+esc(nome.charAt(0).toUpperCase())+'</div>')+'<div class="vaga-hero-texto"><h1>'+esc(tituloVaga(v))+'</h1><button class="vaga-hero-empresa"'+empresaClick+'>'+esc(nome)+(verificada?' <span class="em-verificado-wrap" tabindex="0"><b class="em-verificado-check" aria-label="Empresa verificada">✓</b><span class="em-verificado-label">Empresa verificada</span><span class="em-verificado-pop" role="tooltip"><strong><i>✓</i> Empresa verificada</strong><small>Esta empresa passou por um processo de verificação no EmpregaMais.</small></span></span>':'')+'</button><div class="vaga-hero-selos">'+(v.area?'<span class="hero-area">♙ '+esc(v.area)+'</span>':'')+(destaqueAtivo(v)?'<span class="hero-destaque"><i class="selo-icone">★</i> Vaga em destaque</span>':'')+(v.urgente?'<span class="hero-urgente"><i class="selo-icone">ϟ</i> Urgente</span>':'')+(v.senior50?'<span class="hero-50mais"><i class="selo-icone">♟</i> Vaga para 50+</span>':'')+'</div></div><div class="vaga-hero-valores" aria-label="Diferenciais da empresa"><span><i>◇</i><small>Tradição</small></span><span><i>♡</i><small>Qualidade</small></span><span><i>♧</i><small>Confiança</small></span></div></div><div class="vaga-info-grid"><div><i class="info-svg"><svg viewBox="0 0 24 24"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg></i><strong>'+esc(localizacaoPublicaVagaEM(v))+'</strong><small>Localização</small><button type="button" class="em-local-detalhes-btn" onclick="event.stopPropagation();abrirDetalhesLocalVagaEM(event)">Ver no mapa</button><div class="em-local-popover oculto" role="dialog"><div class="em-local-pop-head"><span>⌖</span><div><small>LOCAL DE TRABALHO</small><strong>'+esc(localizacaoPublicaVagaEM(v))+'</strong></div><button type="button" onclick="event.stopPropagation();fecharDetalhesLocalVagaEM()">×</button></div><p>A localização exibida respeita as informações disponibilizadas pela empresa.</p></div></div><div><i class="info-svg"><svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></svg></i><strong>'+esc(v.contrato||'Não informado')+'</strong><small>Contrato</small></div><div><i class="info-svg"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="13" rx="2"/><path d="M8 21h8M12 18v3"/></svg></i><strong>'+esc(v.modalidade||'Não informado')+'</strong><small>Modalidade</small></div><div><i class="info-svg"><svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M16 10h5v5h-5a2.5 2.5 0 0 1 0-5Z"/></svg></i><strong>'+esc(sal)+'</strong><small>Salário</small></div><div><i class="info-svg"><svg viewBox="0 0 24 24"><path d="M5 20V10M12 20V4M19 20v-7"/></svg></i><strong>'+esc(v.area||'Não informado')+'</strong><small>Área</small></div></div>';const conteudo=$('#vagaConteudoDetalhe');if(conteudo)conteudo.innerHTML='<nav class="vaga-tabs"><a href="#vaga-sobre">▤ Sobre a vaga</a><a href="#vaga-requisitos">▣ Requisitos</a><a href="#vaga-beneficios">♡ Benefícios</a><a href="#vaga-empresa-info">▥ Sobre a empresa</a></nav><section id="vaga-sobre"><h2>Descrição da vaga</h2><div class="vaga-texto">'+esc(v.descricao||'Não informado').replace(/\n/g,'<br>')+'</div></section><section id="vaga-requisitos"><h2>Requisitos</h2><div class="vaga-texto">'+esc(v.requisitos||'Não informado').replace(/\n/g,'<br>')+'</div></section><section id="vaga-beneficios"><h2>Benefícios</h2><div class="beneficios-tags">'+beneficios+'</div></section><section><h2>Informações complementares</h2><div class="vaga-complementares"><span><b>Escolaridade</b>'+esc(v.escolaridade||'Não informado')+'</span><span><b>Experiência</b>'+esc(v.experiencia||'Não informado')+'</span><span><b>Jornada</b>'+esc(v.jornada||'Não informado')+'</span><span><b>PcD</b>'+esc(v.pcd||'Não informado')+'</span></div></section>';const acao=$('#vagaAcaoDetalhe');if(acao)acao.innerHTML=aderenciaVagaAtualHTML(v)+'<h2>Gostou desta vaga?</h2><p>Candidate-se agora e faça parte desta oportunidade.</p><button class="vaga-candidatar-principal" onclick="iniciarCandidatura()">Candidatar-se <b>→</b></button><button class="vaga-salvar-principal" onclick="alternarSalvarVaga()">'+(vagaEstaSalva(v.id)?'♥ Vaga salva':'♡ Salvar vaga')+'</button><div class="vaga-publicacao">'+textoDataVaga(v)+(textoPrazoVaga(v)?' · '+textoPrazoVaga(v):'')+'</div><button class="denunciar-vaga" onclick="denunciarVaga()">Denunciar vaga</button>';const side=$('#vagaEmpresaSide');if(side)side.innerHTML=v.confidencial?'':('<h2 id="vaga-empresa-info">Sobre a empresa</h2><div class="empresa-side-identidade">'+(logo?'<img src="'+esc(logo)+'" alt="">':'<div class="empresa-side-logo vaga-logo-fallback">'+esc(nome.charAt(0).toUpperCase())+'</div>')+'<div><strong>'+esc(nome)+(verificada?' <b class="check-verificado">✓</b>':'')+'</strong><p>'+esc(emp.sobre||'Conheça mais sobre esta empresa e suas oportunidades.')+'</p></div></div><div class="empresa-side-dados">'+(emp.setor?'<span>▣ '+esc(emp.setor)+'</span>':'')+(v.cidade?'<span>⌖ '+esc(v.cidade)+(v.estado?' - '+esc(v.estado):'')+'</span>':'')+(verificada?'<span>✓ Empresa verificada</span>':'')+'</div>'+(v.empresaCnpj?'<button onclick="abrirEmpresaPublica(\''+v.empresaCnpj+'\')">Ver perfil da empresa →</button>':''));
const rel=vagasPublicas().filter(x=>x.id!==v.id&&(x.area===v.area||x.cidade===v.cidade)).slice(0,10),box=$('#vagasRelacionadas');if(box)box.innerHTML=rel.length?rel.map(cardVagaPortal).join(''):'<div class="vagas-vazio">Nenhuma vaga relacionada no momento.</div>'}function denunciarVaga(){const v=vagaAtual();if(!v)return;const m=$('#modalDenuncia');if(!m)return;$('#denunciaMotivo').value='';$('#denunciaDetalhes').value='';msg('#msgDenuncia','');m.classList.remove('oculto')}
function fecharDenuncia(){$('#modalDenuncia')?.classList.add('oculto')}
function enviarDenuncia(e){e.preventDefault();const v=vagaAtual();if(!v)return;const motivo=$('#denunciaMotivo')?.value||'',detalhes=$('#denunciaDetalhes')?.value.trim()||'';if(!motivo)return msg('#msgDenuncia','Selecione o motivo da denúncia.');const a=ler('empregaMaisDenuncias');a.unshift({id:'den_'+Date.now(),vagaId:v.id,vaga:tituloVaga(v),motivo,detalhes,status:'pendente',criadoEm:new Date().toISOString()});gravar('empregaMaisDenuncias',a);msg('#msgDenuncia','Denúncia enviada para análise. Obrigado por ajudar a manter o portal seguro.',true);setTimeout(fecharDenuncia,900)}
function iniciarCandidatura(){const v=vagaAtual();if(!v||v.status!=='aprovada'||!vagaDentroPrazo(v)){alert('Esta vaga não está mais recebendo candidaturas.');irPara('home');return}if(papelAtual()!=='candidato'){sessionStorage.setItem('retornoCandidatura','1');irPara('login-candidato');return}irPara('candidatar')}
function voltarVagaAtual(){irPara('vaga')}
function prepararCandidatura(){const v=vagaAtual();if(!v||v.status!=='aprovada'||!vagaDentroPrazo(v)){irPara('home');return}const c=candidatoLogado()||{},p=c.perfil||{},curr=ler(chaveCurriculo(),null),online=dadosCurriculoOnlineEM(),itens=itensProgressoCurriculoEM(online),pct=Math.round(itens.filter(x=>x.ok).length/itens.length*100),temOnline=itens.some(x=>x.ok);$('#candidaturaTitulo').textContent=tituloVaga(v)+' · '+(v.confidencial?'Empresa confidencial':v.empresa||'');$('#candNome').value=c.nome||sessionStorage.getItem('candidatoNome')||'';$('#candEmail').value=c.email||sessionStorage.getItem('candidatoEmail')||'';$('#candTelefone').value=c.telefone||'';const nr=$('#candApplyNomeResumo'),cr=$('#candApplyContatoResumo'),av=$('#candApplyAvatar');if(nr)nr.textContent=$('#candNome').value||'Candidato';if(cr)cr.textContent=[$('#candEmail').value,$('#candTelefone').value].filter(Boolean).join(' · ');if(av)av.textContent=($('#candNome').value||'C').charAt(0).toUpperCase();const r=$('#candidaturaPerfilResumo');if(r)r.innerHTML='<strong>'+esc(p.titulo||online.titulo||'Perfil profissional')+'</strong><span>'+esc([p.area||online.area,c.cidade||online.cidade,p.experiencia].filter(Boolean).join(' · ')||'Revise seus dados antes de enviar.')+'</span>';const onlineRadio=document.querySelector('input[name="candCvVisual"][value="online"]'),fileRadio=document.querySelector('input[name="candCvVisual"][value="cadastrado"]'),badge=$('#candCvOnlineBadge');if(onlineRadio)onlineRadio.disabled=!temOnline;if(fileRadio)fileRadio.disabled=!curr;if(badge)badge.textContent=pct===100?'✓ Currículo completo · Recomendado':(temOnline?'Seu currículo está '+pct+'% completo · Complete antes de enviar':'Você ainda não criou seu Currículo EmpregaMais');const criar=$('#candCriarCurriculoBtn');if(criar)criar.classList.toggle('oculto',temOnline);const origem=temOnline?'online':(curr?'cadastrado':'perfil');const radio=document.querySelector('input[name="candCvVisual"][value="'+origem+'"]');if(radio)radio.checked=true;selecionarCurriculoCandidaturaEM(origem);const perfilAderencia={...p,...online},dadosAderencia={curriculoOrigem:temOnline?'online':'perfil',curriculo:online,perfilProfissional:perfilAderencia,cidade:c.cidade||online.cidade||''},analiseAderencia=calcularAderenciaCurriculoEM(v,online),aderencia=analiseAderencia?.percentual??0,ap=$('#candAderenciaPct'),at=$('#candAderenciaTexto'),ac=$('#candAderenciaTopo'),ao=$('#candAderenciaOrientacao');if(ap)ap.textContent=aderencia+'%';if(at)at.textContent=aderencia>=80?'Alta compatibilidade':aderencia>=60?'Boa compatibilidade':aderencia>=50?'Compatibilidade moderada':'Baixa compatibilidade';if(ac){ac.classList.remove('baixa','boa','aderencia-muito-baixa','aderencia-baixa','aderencia-media','aderencia-alta','aderencia-excelente');ac.classList.add(aderencia>=90?'aderencia-excelente':aderencia>=75?'aderencia-alta':aderencia>=50?'aderencia-media':aderencia>=30?'aderencia-baixa':'aderencia-muito-baixa')}if(ao){const itensAd=(analiseAderencia?.itens||[]).map(x=>({ok:x.status==='sim',parcial:x.status==='parcial',nome:x.nome,det:x.det,status:x.status})),faltam=itensAd.filter(x=>!x.ok),atende=itensAd.filter(x=>x.ok);ao.classList.toggle('nao-recomendada',aderencia<50);ao.innerHTML='<div class="cand-ad-head"><strong>'+(aderencia<50?'⚠ Candidatura não recomendada neste momento':'Análise de compatibilidade')+'</strong><button type="button" onclick="toggleDetalhesAderenciaEM()">×</button></div><div class="cand-ad-cols"><div><b>✓ Compatível</b>'+atende.map(x=>'<span class="ok"><i>✓</i><span>'+esc(x.nome)+'<small>'+esc(x.det||'Compatível com a vaga.')+'</small></span></span>').join('')+'</div><div><b>'+(faltam.length?'! Pontos sem compatibilidade':'✓ Todos os critérios')+'</b>'+(faltam.length?faltam.map(x=>'<span class="'+(x.parcial?'partial':'miss')+'"><i>'+(x.parcial?'~':'!')+'</i><span>'+esc(x.nome)+'<small>'+esc(x.det||'Não identificado no currículo.')+'</small></span></span>').join(''):'<span class="ok">Seu currículo atende aos critérios analisados.</span>')+'</div></div>'+(aderencia<50?'<button class="cand-ad-improve" type="button" onclick="irPara(\'curriculo\')">Melhorar meu currículo →</button>':'')}window._candAderenciaAtualEM={pct:aderencia,vagaId:v.id};const ck=$('#candApplyChecklist');if(ck){const telefone=Boolean($('#candTelefone').value),email=Boolean($('#candEmail').value),cvok=origem==='online'?pct===100:(origem==='cadastrado'?Boolean(curr):Boolean(p.titulo||p.area||p.resumo));ck.innerHTML='<strong>Antes de enviar</strong><div><span class="'+(email?'ok':'alerta')+'">'+(email?'✓':'!')+' E-mail '+(email?'atualizado':'não informado')+'</span><span class="'+(telefone?'ok':'alerta')+'">'+(telefone?'✓':'!')+' Telefone '+(telefone?'atualizado':'não informado')+'</span><span class="'+(cvok?'ok':'alerta')+'">'+(cvok?'✓':'!')+' Currículo '+(cvok?'pronto para envio':'pode ser melhorado')+'</span></div>'}}
function selecionarCurriculoCandidaturaEM(v){const s=$('#candCurriculoOpcao');if(s)s.value=v;document.querySelectorAll('.cand-cv-options label').forEach(x=>x.classList.toggle('selecionado',x.querySelector('input')?.checked))}
function enviarCandidatura(e){e.preventDefault();if(papelAtual()!=='candidato'||!candidatoLogado()){msg('#msgCandidatura','Sua sessão de candidato expirou. Entre novamente para continuar.');setTimeout(()=>irPara('login-candidato'),700);return}const v=vagaAtual();if(!v||v.status!=='aprovada'||!vagaDentroPrazo(v))return msg('#msgCandidatura','Esta vaga não está mais recebendo candidaturas.');const a=candidaturas(),email=$('#candEmail').value.trim().toLowerCase();if(a.some(c=>c.vagaId===v.id&&(c.email||'').toLowerCase()===email))return msg('#msgCandidatura','Você já se candidatou a esta vaga.');const c=candidatoLogado()||{},p=c.perfil||{},curr=ler(chaveCurriculo(),null),online=dadosCurriculoOnlineEM(),origem=$('#candCurriculoOpcao')?.value||'perfil';if(origem==='cadastrado'&&!curr)return msg('#msgCandidatura','Cadastre um currículo antes de selecionar esta opção.');if(origem==='online'&&!itensProgressoCurriculoEM(online).some(x=>x.ok))return msg('#msgCandidatura','Crie seu Currículo EmpregaMais antes de selecionar esta opção.');a.unshift({id:'cand_'+Date.now(),vagaId:v.id,vagaTitulo:tituloVaga(v),candidato:$('#candNome').value.trim(),email:$('#candEmail').value.trim(),telefone:$('#candTelefone').value.trim(),mensagem:$('#candMensagem').value.trim(),curriculoOrigem:origem,curriculo:origem==='cadastrado'?{...curr,enviadoEm:new Date().toISOString()}:(origem==='online'?{...online,enviadoEm:new Date().toISOString(),tipo:'curriculo_online'}:null),perfilProfissional:origem==='perfil'?{titulo:p.titulo||'',area:p.area||'',escolaridade:p.escolaridade||'',experiencia:p.experiencia||'',resumo:p.resumo||'',competencias:p.competencias||'',linkedin:p.linkedin||'',portfolio:p.portfolio||''}:null,status:'Em avaliação',criadoEm:new Date().toISOString()});gravar('empregaMaisCandidaturas',a);msg('#msgCandidatura','Candidatura enviada com sucesso.',true);setTimeout(()=>irPara('candidaturas'),800)}

function chaveCurriculo(){return'empregaMaisCurriculo_'+(sessionStorage.getItem('candidatoEmail')||'')}
function renderizarCurriculo(){const d=ler(chaveCurriculo(),null),n=$('#curriculoNomeExibicao'),det=$('#curriculoDetalheExibicao'),b=$('#curriculoBadge'),x=$('#btnExcluirCurriculo');if(!n)return;if(d){n.textContent=d.nome;det.textContent='Currículo cadastrado em '+new Date(d.data).toLocaleDateString('pt-BR');b.textContent='Cadastrado';b.className='curriculo-ok';x.classList.remove('oculto')}else{n.textContent='Nenhum currículo cadastrado';det.textContent='Envie um arquivo PDF, DOC ou DOCX.';b.textContent='Não cadastrado';b.className='';x.classList.add('oculto')}}
function configurarUploadCurriculo(){const z=$('#dropCurriculo'),i=$('#arquivoCurriculo');if(!z||!i||z.dataset.bind)return;z.addEventListener('click',e=>{if(e.target!==i)i.click()});['dragenter','dragover'].forEach(ev=>z.addEventListener(ev,e=>{e.preventDefault();z.classList.add('arrastando')}));['dragleave','drop'].forEach(ev=>z.addEventListener(ev,e=>{e.preventDefault();z.classList.remove('arrastando')}));z.addEventListener('drop',e=>{const f=e.dataTransfer?.files?.[0];if(f){const dt=new DataTransfer();dt.items.add(f);i.files=dt.files;mostrarArquivoCurriculo(f)}});i.addEventListener('change',()=>{if(i.files[0])mostrarArquivoCurriculo(i.files[0])});z.dataset.bind='1'}function mostrarArquivoCurriculo(f){const z=$('#dropCurriculo');if(!z||!f)return;const p=z.querySelector('p');if(p)p.textContent=f.name+' · '+(f.size/1024/1024).toFixed(2)+' MB'}function salvarCurriculoLocal(e){e.preventDefault();const f=$('#arquivoCurriculo').files[0];if(!f)return;if(f.size>5*1024*1024)return msg('#msgCurriculo','O arquivo deve ter no máximo 5 MB.');const ext=(f.name.split('.').pop()||'').toLowerCase();if(!['pdf','doc','docx'].includes(ext))return msg('#msgCurriculo','Envie um arquivo PDF, DOC ou DOCX.');gravar(chaveCurriculo(),{nome:f.name,tamanho:f.size,tipo:f.type,data:new Date().toISOString()});msg('#msgCurriculo','Currículo cadastrado.',true);renderizarCurriculo();atualizarPainelCandidato()}
function excluirCurriculo(){const d=ler(chaveCurriculo(),null);if(!d)return;if(candidaturas().some(c=>(c.email||'').toLowerCase()===(sessionStorage.getItem('candidatoEmail')||'').toLowerCase()&&c.curriculoOrigem==='cadastrado')){if(!confirm('Excluir o currículo do seu perfil? As candidaturas já enviadas manterão apenas o registro do arquivo usado naquele momento.'))return}else if(!confirm('Excluir seu currículo cadastrado?'))return;localStorage.removeItem(chaveCurriculo());renderizarCurriculo();atualizarPainelCandidato()}
function chaveSalvas(){return'empregaMaisSalvas_'+(sessionStorage.getItem('candidatoEmail')||'')}
function salvas(){return ler(chaveSalvas())}
function vagaEstaSalva(id){return salvas().includes(id)}
function alternarSalvarVaga(){const v=vagaAtual();if(!v||v.status!=='aprovada'||!vagaDentroPrazo(v)){alert('Esta vaga não está mais disponível para salvar.');irPara('home');return}if(papelAtual()!=='candidato'){sessionStorage.setItem('vagaSelecionada',v.id);sessionStorage.setItem('retornoSalvarVaga','1');irPara('login-candidato');return}let a=salvas();a=a.includes(v.id)?a.filter(x=>x!==v.id):[v.id,...a];gravar(chaveSalvas(),a);renderizarVagaDetalhe()}
function renderizarSalvas(){const box=$('#listaVagasSalvas');if(!box)return;const ids=salvas(),publicas=vagasPublicas(),a=publicas.filter(v=>ids.includes(v.id)),validos=new Set(a.map(v=>v.id));if(ids.some(id=>!validos.has(id)))gravar(chaveSalvas(),ids.filter(id=>validos.has(id)));box.innerHTML=a.length?a.map(cardVagaPortal).join(''):'<div class="vagas-vazio"><strong>Nenhuma vaga salva</strong><span>Use o botão “Salvar vaga” para guardar oportunidades.</span></div>'}

const PLANOS_EMPRESA={basico:{nome:'Grátis',vagas:3,destaques:0,urgentes:0,confidenciais:0},mensal:{nome:'Mensal',vagas:6,destaques:1,urgentes:1,confidenciais:0},trimestral:{nome:'Trimestral',vagas:12,destaques:3,urgentes:3,confidenciais:2},semestral:{nome:'Semestral',vagas:25,destaques:5,urgentes:5,confidenciais:4},anual:{nome:'Anual',vagas:60,destaques:10,urgentes:10,confidenciais:8}};
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
function renderizarPlanosAtuais(){if(papelAtual()!=='empresa')return;const c=sessionStorage.getItem('empresaCnpj'),e=ler('empregaMaisEmpresas').find(x=>x.cnpj===c),atual=e?.plano||'basico',pendentes=ler('empregaMaisPedidosPlano').filter(x=>x.empresaCnpj===c&&x.status==='aguardando_pagamento');document.querySelectorAll('.plano-card').forEach(card=>card.classList.remove('plano-atual'));document.querySelectorAll('.plano-card button').forEach(b=>{const m=(b.getAttribute('onclick')||'').match(/selecionarPlano\('([^']+)'\)/);if(!m)return;const p=m[1];b.disabled=false;b.textContent=p==='basico'?'Começar grátis':'Escolher plano';if(p===atual){b.closest('.plano-card')?.classList.add('plano-atual');b.textContent='Plano atual';b.disabled=true}else if(pendentes.some(x=>x.plano===p)){b.textContent='Aguardando pagamento';b.disabled=true}})}function ativarPedidoPlano(id){const ps=ler('empregaMaisPedidosPlano'),i=ps.findIndex(x=>x.id===id);if(i<0||ps[i].status==='ativo')return;const es=ler('empregaMaisEmpresas'),j=es.findIndex(e=>e.cnpj===ps[i].empresaCnpj);if(j<0)return;es[j].plano=ps[i].plano;es[j].planoStatus='ativo';es[j].planoAtivadoEm=new Date().toISOString();delete es[j].planoPretendido;ps.forEach((x,k)=>{if(k!==i&&x.empresaCnpj===ps[i].empresaCnpj&&x.status==='aguardando_pagamento')x.status='cancelado'});ps[i].status='ativo';ps[i].ativadoEm=new Date().toISOString();gravar('empregaMaisEmpresas',es);gravar('empregaMaisPedidosPlano',ps);adminAba('planos')}function planoEmpresaAtual(){const c=sessionStorage.getItem('empresaCnpj'),e=ler('empregaMaisEmpresas').find(x=>x.cnpj===c);return PLANOS_EMPRESA[e?.plano]||PLANOS_EMPRESA.basico}function chaveMes(d){const x=new Date(d||Date.now());return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')}function usoPlanoEmpresa(){const c=sessionStorage.getItem('empresaCnpj')||'',mes=chaveMes(),vs=ler('empregaMaisVagas').filter(v=>v.empresaCnpj===c&&chaveMes(v.criadoEm)===mes&&v.status!=='excluida');return{vagas:vs.length,destaques:vs.filter(v=>v.destaque).length,urgentes:vs.filter(v=>v.urgente).length,confidenciais:vs.filter(v=>v.confidencial).length}}function saldoPlano(){const p=planoEmpresaAtual(),u=usoPlanoEmpresa();return{plano:p,uso:u,vagas:Math.max(0,p.vagas-u.vagas),destaques:Math.max(0,p.destaques-u.destaques),urgentes:Math.max(0,p.urgentes-u.urgentes),confidenciais:Math.max(0,p.confidenciais-u.confidenciais)}}function atualizarOpcoesPlano(){const x=saldoPlano(),set=(id,t)=>{const e=$('#'+id);if(e)e.textContent=t};const gratuito=x.plano&&x.plano.nome==='Grátis';set('saldoDestaque',gratuito?'R$ 19,90 · 7 dias':'('+x.destaques+' disponível(is) no mês)');set('saldoUrgente',gratuito?'R$ 9,90':'('+x.urgentes+' disponível(is) no mês)');set('saldoConfidencial','('+x.confidenciais+' disponível(is) no mês)');const r=$('#resumoPlanoPublicacao');if(r)r.innerHTML='<strong>Plano '+x.plano.nome+'</strong><span>'+x.vagas+' de '+x.plano.vagas+' publicação(ões) disponível(is) neste mês</span>';[['vagaDestaque','destaques'],['vagaUrgente','urgentes'],['vagaConfidencial','confidenciais']].forEach(([id,k])=>{const e=$('#'+id);if(!e)return;const pago=gratuito&&(id==='vagaDestaque'||id==='vagaUrgente');e.disabled=!pago&&x[k]<=0});const a=$('#avisoLimitePlano');if(a)a.textContent=x.vagas<=0?'Você atingiu o limite de publicações do seu plano neste mês.':''}function validarRecursosPlano(dados,editId){const x=saldoPlano(),lista=ler('empregaMaisVagas'),ant=editId?lista.find(v=>v.id===editId):null;if(!editId&&x.vagas<=0)return'Limite mensal de vagas atingido para o plano '+x.plano.nome+'.';const gratuito=x.plano&&x.plano.nome==='Grátis';if(dados.destaque&&!(ant&&ant.destaque)&&gratuito)return'';if(dados.urgente&&!(ant&&ant.urgente)&&gratuito)return'';if(dados.destaque&&!(ant&&ant.destaque)&&x.destaques<=0&&!gratuito)return'Seu plano não possui Destaque disponível neste mês.';if(dados.urgente&&!(ant&&ant.urgente)&&x.urgentes<=0&&!gratuito)return'Seu plano não possui marcação Urgente disponível neste mês.';if(dados.confidencial&&!(ant&&ant.confidencial)&&x.confidenciais<=0)return'Seu plano não possui vaga Confidencial disponível neste mês.';return''}

function alternarSenhaAdmin(btn){const campo=$('#adminSenha');if(!campo)return;const mostrar=campo.type==='password';campo.type=mostrar?'text':'password';btn.textContent=mostrar?'Ocultar':'Mostrar';btn.setAttribute('aria-label',mostrar?'Ocultar senha':'Mostrar senha')}
/* EMPREGAMAIS-ADMIN-SUPABASE-AUTH-V1 */
async function loginAdmin(e){
 e.preventDefault();
 const email=$('#adminEmail').value.trim().toLowerCase(),senha=$('#adminSenha').value;
 if(email!=='admin@empregamais.com.br'){msg('#msgLoginAdmin','Esta conta não possui acesso administrativo.');return}
 msg('#msgLoginAdmin','Validando acesso...');
 try{
  const a=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/auth/v1/token?grant_type=password",{method:"POST",headers:sbHeadersEM(),body:JSON.stringify({email:email,password:senha})});
  if(!a||!a.access_token||!a.user){throw new Error('Sessão administrativa inválida.')}
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
function removerBeneficioAdminEM(){const tipo=document.getElementById('grantTipo')?.value,idx=Number(document.getElementById('grantPessoa')?.value),beneficio=document.getElementById('grantBeneficio')?.value;if(!confirm('Remover este benefício do cadastro selecionado?'))return;if(tipo==='empresa'){const a=ler('empregaMaisEmpresas'),x=a[idx];if(!x)return alert('Selecione uma empresa.');if(beneficio==='plano'){x.plano='basico';x.planoLiberadoAdmin=false;x.planoSemCobranca=false;x.assinaturaAtiva=false;x.planoStatus='inativo';x.planoValidoAte=''}else if(beneficio==='destaque'){x.creditosDestaqueAdmin=0}else if(beneficio==='urgencia'){x.creditosUrgenciaAdmin=0}gravar('empregaMaisEmpresas',a);registrarConcessaoAdminEM({tipo,nome:x.nome||x.razaoSocial||'Empresa',email:x.email||'',beneficio:'Removido: '+beneficio,plano:'',quantidade:0,fim:'',obs:'Benefício removido pelo administrador',acao:'remocao'})}else{const a=ler('empregaMaisCandidatos'),x=a[idx];if(!x)return alert('Selecione um candidato.');x.premium=false;x.premiumAtivo=false;x.premiumCortesiaAdmin=false;x.planoCandidato='';x.premiumStatus='Inativa';x.premiumAte='';gravar('empregaMaisCandidatos',a);registrarConcessaoAdminEM({tipo,nome:x.nome||'Candidato',email:x.email||'',beneficio:'Premium removido',plano:'',quantidade:0,fim:'',obs:'Assinatura removida pelo administrador',acao:'remocao'})}fecharConcessaoAdminEM();adminAba('planos')}
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
 if(aba==='empresas'){out.innerHTML='<div class="admin-bloco admin2-empresas-lista"><div class="admin2-lista-head"><div><h2>Empresas cadastradas</h2><p class="admin-sub">Consulte as empresas cadastradas no EmpregaMais.</p></div><span>'+es.length+' empresa(s)</span></div>'+adminEmpresaCards(es)+'</div>';return}
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

window.addEventListener('popstate',lerRota);

(function(){function iniciarNavegacao(){document.querySelectorAll('[data-rota]').forEach(function(el){el.addEventListener('click',function(ev){ev.preventDefault();var rota=el.getAttribute('data-rota');if(typeof irPara==='function')irPara(rota);else location.href=location.pathname+'?pagina='+encodeURIComponent(rota);});});var rota=new URLSearchParams(location.search).get('pagina');if(rota&&typeof abrirRota==='function')abrirRota(rota);}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciarNavegacao);else iniciarNavegacao();})();

/* =========================================================
   EMPREGAMAIS — SUPABASE REAL / EMPRESAS + AUTH
   Banco central: projeto EmpregaMais
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
function sbSalvarSessaoEM(a){if(a?.access_token){sessionStorage.setItem(EMPREGAMAIS_SB_TOKEN,a.access_token);localStorage.setItem(EMPREGAMAIS_SB_TOKEN,a.access_token)}if(a?.refresh_token){sessionStorage.setItem(EMPREGAMAIS_SB_REFRESH,a.refresh_token);localStorage.setItem(EMPREGAMAIS_SB_REFRESH,a.refresh_token)}}
function sbTokenEM(){return sessionStorage.getItem(EMPREGAMAIS_SB_TOKEN)||localStorage.getItem(EMPREGAMAIS_SB_TOKEN)||""}
function sbRefreshTokenEM(){return sessionStorage.getItem(EMPREGAMAIS_SB_REFRESH)||localStorage.getItem(EMPREGAMAIS_SB_REFRESH)||""}
async function sbGarantirSessaoEM(){
 const token=sbTokenEM(),refresh=sbRefreshTokenEM();
 if(token){try{await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/auth/v1/user",{method:"GET",headers:sbHeadersEM(token)});return token}catch(e){}}
 if(!refresh)return "";
 try{const a=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:sbHeadersEM(),body:JSON.stringify({refresh_token:refresh})});sbSalvarSessaoEM(a);return a.access_token||""}catch(e){return ""}
}
function sbCadastrarAuthEmpresaEM(cnpj,senha){return sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/auth/v1/signup",{method:"POST",headers:sbHeadersEM(),body:JSON.stringify({email:sbEmailEmpresaEM(cnpj),password:senha})}).then(a=>{sbSalvarSessaoEM(a);return a})}
function sbLoginAuthEmpresaEM(cnpj,senha){return sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/auth/v1/token?grant_type=password",{method:"POST",headers:sbHeadersEM(),body:JSON.stringify({email:sbEmailEmpresaEM(cnpj),password:senha})}).then(a=>{sbSalvarSessaoEM(a);return a})}
function sbBuscarMinhaEmpresaEM(){const token=sbTokenEM();if(!token)return Promise.resolve(null);return sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/empresas?select=*&limit=1",{method:"GET",headers:sbHeadersEM(token)}).then(a=>Array.isArray(a)&&a.length?a[0]:null)}
function sbEmpresaParaLocalEM(e,senha){if(!e)return null;return{id:e.id||"",userId:e.user_id||"",nome:e.nome||e.nome_fantasia||"",nomeFantasia:e.nome_fantasia||"",razaoSocial:e.razao_social||"",cnpj:nums(e.cnpj||""),email:e.email||"",emailCorporativo:e.email_corporativo||"",sobre:e.sobre||"",sobreInstitucional:e.sobre_institucional||"",site:e.site||"",matriz:e.matriz||"",setor:e.setor||"",funcionarios:e.funcionarios||"",faturamento:e.faturamento||"",logo:e.logo_url||"",plano:e.plano_id||e.plano||"basico",planoStatus:e.plano_status||e.assinatura_status||"ativo",planoLiberadoAdmin:e.plano_liberado_admin===true,planoSemCobranca:e.plano_sem_cobranca===true,planoAtivadoEm:e.plano_ativado_em||e.assinatura_inicio||"",planoValidoAte:e.plano_valido_ate||e.assinatura_fim||"",assinaturaAtiva:e.assinatura_ativa===true||((e.plano_id||e.plano||"basico")!=="basico"&&!["cancelado","inativo","expirado"].includes(String(e.plano_status||e.assinatura_status||"ativo").toLowerCase())),verificacaoStatus:e.verificacao_status||"nao_verificada",verificada:e.verificada===true,verificacaoEnviadaEm:e.verificacao_enviada_em||"",verificacaoMotivo:e.verificacao_motivo||"",aprovacaoAutomaticaSuspensa:e.aprovacao_automatica_suspensa===true,senha:senha||""}}
function sbInserirEmpresaEM(auth,base){const token=auth.access_token,uid=auth.user&&auth.user.id;return sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/empresas",{method:"POST",headers:Object.assign(sbHeadersEM(token),{"Prefer":"return=representation"}),body:JSON.stringify({user_id:uid,nome:base.nome||"",cnpj:nums(base.cnpj),email:base.email||"",sobre:base.sobre||"",plano:"basico",plano_id:"basico",verificacao_status:"nao_verificada",verificada:false,plano_liberado_admin:false,plano_sem_cobranca:false,aprovacao_automatica_suspensa:false})}).then(a=>Array.isArray(a)?a[0]:a)}
function sbSalvarEmpresaLocalEM(emp){if(!emp)return;const lista=ler("empregaMaisEmpresas");const i=lista.findIndex(x=>nums(x.cnpj)===nums(emp.cnpj));if(i>=0)lista[i]=Object.assign({},lista[i],emp);else lista.push(emp);gravar("empregaMaisEmpresas",lista)}

cadastrarEmpresa=function(e){e.preventDefault();const senha=$("#cadEmpresaSenha").value,nome=$("#cadEmpresaNome").value.trim(),email=$("#cadEmpresaEmail").value.trim().toLowerCase(),telefone=$("#cadEmpresaTelefone").value.trim(),cnpj=nums($("#cadEmpresaCnpj").value);if(nome.length<2)return msg("#msgCadastroEmpresa","Informe o nome da empresa.");if(cnpj.length!==14)return msg("#msgCadastroEmpresa","Informe um CNPJ com 14 números.");if(!email.includes("@"))return msg("#msgCadastroEmpresa","Informe um e-mail válido.");if(nums(telefone).length<10)return msg("#msgCadastroEmpresa","Informe um telefone válido.");if(senha.length<6)return msg("#msgCadastroEmpresa","A senha deve ter pelo menos 6 caracteres.");if(senha!==$("#cadEmpresaSenha2").value)return msg("#msgCadastroEmpresa","As senhas não conferem.");const base={nome,cnpj,email,telefone,senha};sbCadastrarAuthEmpresaEM(cnpj,senha).then(auth=>{if(!auth.access_token||!auth.user?.id)throw new Error("O Supabase não criou a sessão da empresa.");return sbInserirEmpresaEM(auth,base)}).then(remota=>{const d=sbEmpresaParaLocalEM(remota,senha);sbSalvarEmpresaLocalEM(d);entrar("empresa",d);mostrarToast("Empresa cadastrada com sucesso.");if(sessionStorage.getItem("planoPretendido"))setTimeout(()=>irPara("planos"),30)}).catch(err=>{console.error("Supabase cadastro empresa:",err);msg("#msgCadastroEmpresa",/already|registered|exists/i.test(err.message)?"Este CNPJ já possui cadastro no Supabase.":err.message)})};

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
    modalidade:v.modalidade||'', cep:v.cep||'', estado:v.estado||'', cidade:v.cidade||'',
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
    edicoesAposAprovacao:Number(v.edicoes_apos_aprovacao||0), logo:v.logo||v.logo_url||''
  };
}
function sbUsuarioAtualEM(){const t=sbTokenEM();if(!t)return Promise.reject(new Error('Sessão Supabase ausente.'));return sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/auth/v1/user',{method:'GET',headers:sbHeadersEM(t)})}
function sbCarregarVagasEM(){
  const t=sbTokenEM();
  const locaisAntes=ler('empregaMaisVagas');
  const publico=sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&status=eq.aprovada&order=criado_em.desc',{method:'GET',headers:sbHeadersEM()}).catch(()=>[]);
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
    sbVagasCacheEM=[...mapa.values()].map(v=>v?.cargo!==undefined&&v?.empresaCnpj!==undefined?v:sbMapVagaEM(v)).filter(Boolean);
    gravar('empregaMaisVagas',sbVagasCacheEM);
    return sbVagasCacheEM
  })
}
function sbEmpresaAtualEM(){
  return sbUsuarioAtualEM().then(u=>sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/empresas?select=*&user_id=eq.'+encodeURIComponent(u.id)+'&limit=1',{method:'GET',headers:sbHeadersEM(sbTokenEM())}).then(a=>Array.isArray(a)&&a[0]?a[0]:null))
}
function sbDadosVagaAtualEM(){
  const v=id=>$('#'+id)?.value.trim()||'';
  return sbEmpresaAtualEM().then(emp=>{
    if(!emp)throw new Error('Empresa não encontrada no Supabase.');
    return {empresaId:emp.id,userId:emp.user_id,empresa:v('empresaVaga')||emp.nome_fantasia||emp.nome||'',empresaCnpj:emp.cnpj||sessionStorage.getItem('empresaCnpj')||'',cargo:v('cargoVaga'),area:v('areaVaga'),contrato:v('contratoVaga'),modalidade:v('modalidadeVaga'),cep:v('cepVaga'),estado:v('estadoVaga'),cidade:v('cidadeVaga'),dataEncerramento:''||null,escolaridade:v('escolaridadeVaga'),experiencia:v('experienciaVaga'),jornada:v('jornadaVaga'),pcd:v('pcdVaga'),salario:$('#salarioCombinarVaga')?.checked?'A combinar':v('salarioVaga'),salarioMax:'',salarioCombinar:!!$('#salarioCombinarVaga')?.checked,horarioEntrada:'',horarioSaida:'',descricao:v('descricaoVaga'),requisitos:v('requisitosVaga'),beneficios:beneficiosSelecionados().join(' · '),beneficiosLista:beneficiosSelecionados().filter(x=>x!==v('beneficiosVaga')),beneficiosOutros:v('beneficiosVaga'),sobreEmpresa:v('sobreEmpresaVaga'),senior50:!!$('#senior50Vaga')?.checked,confidencial:!!$('#vagaConfidencial')?.checked,destaque:!!$('#vagaDestaque')?.checked,urgente:!!$('#vagaUrgente')?.checked,logo:window.__empregaMaisLogoVagaUrl||''}
  })
}
function sbVagaPayloadEM(d,editId){
  const gratuito=planoEmpresaAtual().nome==='Grátis';
  if(gratuito&&d.destaque&&!editId){d.destaque_solicitado=true;d.destaque=false}
  if(gratuito&&d.urgente&&!editId){d.urgencia_solicitada=true;d.urgente=false}
  return {user_id:d.userId,empresa_id:d.empresaId,empresa:d.empresa,empresa_cnpj:nums(d.empresaCnpj),cargo:d.cargo,area:d.area,contrato:d.contrato,modalidade:d.modalidade,cep:d.cep,estado:d.estado,cidade:d.cidade,data_encerramento:d.dataEncerramento||dataEncerramentoAutomaticaEM(),escolaridade:d.escolaridade,experiencia:d.experiencia,jornada:d.jornada,pcd:d.pcd,salario:d.salario,salario_max:d.salarioMax,salario_combinar:d.salarioCombinar,horario_entrada:d.horarioEntrada,horario_saida:d.horarioSaida,descricao:d.descricao,requisitos:d.requisitos,beneficios:d.beneficios,beneficios_lista:d.beneficiosLista||[],beneficios_outros:d.beneficiosOutros,sobre_empresa:d.sobreEmpresa,senior50:d.senior50,confidencial:d.confidencial,destaque:d.destaque,urgente:d.urgente,destaque_solicitado:d.destaque_solicitado||false,urgencia_solicitada:d.urgencia_solicitada||false,logo:d.logo||null,status:'pendente'}
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
publicarVagaNova=async function(e){
  e.preventDefault();
  const tokenAtivo=await sbGarantirSessaoEM();
  if(!tokenAtivo){msg('#msgPublicarVaga','Não foi possível renovar sua sessão. Seus dados da vaga foram preservados; entre novamente para continuar.');salvarRascunhoVagaEM();setTimeout(()=>irPara('login-empresa'),1200);return}
  const fim=$('#dataEncerramentoVaga')?.value||'';
  if(fim&&new Date(fim+'T23:59:59')<new Date()){msg('#msgPublicarVaga','A data de encerramento precisa ser futura.');mostrarEtapa(2);return}
  const editId=sessionStorage.getItem('vagaEdicao');
  const btn=$('#btnPublicarVaga');if(btn){btn.disabled=true;btn.textContent='Enviando...'}
  try{
    const dados=await sbDadosVagaAtualEM(), payload=sbVagaPayloadEM(dados,editId);
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
    sessionStorage.removeItem('vagaEdicao');localStorage.removeItem('empregaMaisRascunhoVaga');$('#formVaga')?.reset();await sbCarregarVagasEM();msg('#msgPublicarVaga',editId?'Alterações salvas. A vaga voltou para análise.':'Vaga enviada para análise.',true);setTimeout(()=>irPara('painel-empresa'),900)
  }catch(err){console.error('EmpregaMais/Supabase vaga:',err);msg('#msgPublicarVaga',err.message||'Não foi possível salvar a vaga.')}finally{if(btn){btn.disabled=false;btn.textContent='Publicar vaga'}}
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

function atualizarMenusTopo(){const p=papelAtual();document.body.classList.toggle('tem-empresa',p==='empresa');document.body.classList.toggle('tem-candidato',p==='candidato')}
function fecharMenusTopo(){document.querySelectorAll('.menu-drop').forEach(x=>x.classList.remove('aberto'))}
function alternarMenuTopo(tipo,event){event?.stopPropagation();const alvo=document.querySelector('.menu-drop-'+tipo),abrir=!alvo?.classList.contains('aberto');fecharMenusTopo();atualizarMenusTopo();if(abrir)alvo?.classList.add('aberto')}
function rotaMenuTopo(rota){fecharMenusTopo();irPara(rota)}
document.addEventListener('click',e=>{if(!e.target.closest('.menu-drop'))fecharMenusTopo()});
window.addEventListener('DOMContentLoaded',atualizarMenusTopo);

const DETALHES_PLANOS={
basico:{nome:'Grátis',etiqueta:'PARA COMEÇAR',preco:'R$ 0,00',periodo:'Sem mensalidade',resumo:'Recursos essenciais para começar a divulgar vagas.',beneficios:[['3 vagas por mês','Publique até 3 novas vagas em cada mês.'],['Candidaturas ilimitadas','Receba candidaturas nas vagas publicadas sem limite de quantidade.'],['Acesso aos currículos','Consulte o currículo ou perfil enviado pelo candidato.'],['Gestão de candidatos','Organize os candidatos pelas etapas do processo seletivo.'],['Perfil da empresa','Mantenha as informações públicas da empresa no portal.'],['Painel do recrutador','Acompanhe suas vagas e candidatos em um único ambiente.'],['Histórico das vagas','Consulte as oportunidades cadastradas e seus respectivos status.'],['1 usuário','Acesso destinado a um usuário da empresa.'],['Destaque avulso','Pode ser adquirido por R$ 19,90 e permanece em destaque por 7 dias.'],['Urgência avulsa','Pode ser adquirida por R$ 9,90 para identificar a oportunidade como contratação urgente.']]},
mensal:{nome:'Mensal',etiqueta:'30 DIAS',preco:'R$ 49,90',periodo:'Plano mensal',resumo:'Mais publicações e recursos de visibilidade durante o mês.',beneficios:[['6 vagas por mês','Publique até 6 novas vagas durante o mês de vigência.'],['Formas de candidatura','Escolha como receber candidatos: pelo EmpregaMais ou por e-mail com currículo anexado e endereço do recrutador oculto. Também é possível direcionar a candidatura pelo WhatsApp ou para o site de carreiras da empresa.'],['Painel completo','Gerencie vagas e acompanhe os candidatos recebidos.'],['Página exclusiva da empresa','Apresente as informações públicas cadastradas no perfil empresarial.'],['Gestão completa de candidatos','Organize o processo seletivo e altere a etapa de cada candidato.'],['Estatísticas completas','Acompanhe os indicadores disponibilizados no painel.'],['1 Destaque por mês','Uma vaga pode utilizar o recurso de destaque incluído no plano.'],['1 Urgente por mês','Uma vaga pode receber a identificação de contratação urgente.'],['Currículos online completos','Visualize o currículo online do candidato diretamente no EmpregaMais, com dados profissionais organizados para análise.'],['Contato direto com candidatos','Entre em contato com o candidato pelo WhatsApp ou por e-mail a partir do ambiente de recrutamento.'],['Mensagens dentro do EmpregaMais','Use o canal de comunicação do portal para centralizar conversas relacionadas ao processo seletivo.'],['Agendamento de entrevistas','Agende entrevistas diretamente pelo gerenciamento do candidato e mantenha o processo organizado.'],['Gestão do processo seletivo','Acompanhe e atualize as etapas de cada candidatura, da análise até a contratação.'],['Aderência à vaga','Consulte a estimativa de aderência entre as informações do currículo do candidato e os requisitos da oportunidade.']]},
trimestral:{nome:'Trimestral',etiqueta:'3 MESES',preco:'R$ 99,00',periodo:'Pagamento único · 3 meses',resumo:'Capacidade ampliada para recrutamento durante três meses.',beneficios:[['12 vagas por mês','Publique até 12 vagas por mês, chegando a até 36 publicações durante os três meses.'],['Formas de candidatura','Escolha como receber candidatos: pelo EmpregaMais ou por e-mail com currículo anexado e endereço do recrutador oculto. Também é possível direcionar a candidatura pelo WhatsApp ou para o site de carreiras da empresa.'],['Todos os recursos do painel','Use as ferramentas de gerenciamento de vagas e candidatos.'],['3 Destaques por mês','Até 3 vagas por mês podem utilizar o recurso de destaque.'],['3 Urgentes por mês','Até 3 vagas por mês podem receber a identificação de contratação urgente.'],['2 vagas confidenciais por mês','Publique até 2 vagas por mês sem exibir publicamente a identidade da empresa.'],['1 usuário','Acesso destinado a um usuário da empresa.'],['Currículos online completos','Visualize o currículo online do candidato diretamente no EmpregaMais, com dados profissionais organizados para análise.'],['Contato direto com candidatos','Entre em contato com o candidato pelo WhatsApp ou por e-mail a partir do ambiente de recrutamento.'],['Mensagens dentro do EmpregaMais','Use o canal de comunicação do portal para centralizar conversas relacionadas ao processo seletivo.'],['Agendamento de entrevistas','Agende entrevistas diretamente pelo gerenciamento do candidato e mantenha o processo organizado.'],['Gestão do processo seletivo','Acompanhe e atualize as etapas de cada candidatura, da análise até a contratação.'],['Aderência à vaga','Consulte a estimativa de aderência entre as informações do currículo do candidato e os requisitos da oportunidade.']]},
semestral:{nome:'Semestral',etiqueta:'6 MESES',preco:'R$ 179,90',periodo:'Pagamento único · 6 meses',resumo:'Maior volume de vagas e recursos para processos seletivos recorrentes.',beneficios:[['25 vagas por mês','Publique até 25 vagas por mês, chegando a até 150 durante seis meses.'],['Formas de candidatura','Escolha como receber candidatos: pelo EmpregaMais ou por e-mail com currículo anexado e endereço do recrutador oculto. Também é possível direcionar a candidatura pelo WhatsApp ou para o site de carreiras da empresa.'],['5 Destaques por mês','Até 5 vagas por mês podem receber destaque.'],['5 Urgentes por mês','Até 5 vagas por mês podem receber a identificação de contratação urgente.'],['4 vagas confidenciais por mês','Até 4 vagas por mês podem ocultar a identidade da empresa.'],['Banco de talentos','Acesso ao recurso de banco de talentos incluído neste plano.'],['2 usuários','Permite acesso de até 2 usuários da empresa.'],['Currículos online completos','Visualize o currículo online do candidato diretamente no EmpregaMais, com dados profissionais organizados para análise.'],['Contato direto com candidatos','Entre em contato com o candidato pelo WhatsApp ou por e-mail a partir do ambiente de recrutamento.'],['Mensagens dentro do EmpregaMais','Use o canal de comunicação do portal para centralizar conversas relacionadas ao processo seletivo.'],['Agendamento de entrevistas','Agende entrevistas diretamente pelo gerenciamento do candidato e mantenha o processo organizado.'],['Gestão do processo seletivo','Acompanhe e atualize as etapas de cada candidatura, da análise até a contratação.'],['Aderência à vaga','Consulte a estimativa de aderência entre as informações do currículo do candidato e os requisitos da oportunidade.']]},
anual:{nome:'Anual',etiqueta:'12 MESES',preco:'R$ 329,00',periodo:'Pagamento único · 12 meses',resumo:'Maior capacidade de publicação para recrutamento ao longo do ano.',beneficios:[['60 vagas por mês','Publique até 60 vagas por mês, chegando a até 720 durante os 12 meses.'],['Formas de candidatura','Escolha como receber candidatos: pelo EmpregaMais ou por e-mail com currículo anexado e endereço do recrutador oculto. Também é possível direcionar a candidatura pelo WhatsApp ou para o site de carreiras da empresa.'],['10 Destaques por mês','Até 10 vagas por mês podem receber destaque.'],['10 Urgentes por mês','Até 10 vagas por mês podem receber a identificação de contratação urgente.'],['8 vagas confidenciais por mês','Até 8 vagas por mês podem ocultar a identidade da empresa.'],['Banco de talentos','Acesso ao recurso de banco de talentos incluído neste plano.'],['5 usuários','Permite acesso de até 5 usuários da empresa.'],['Currículos online completos','Visualize o currículo online do candidato diretamente no EmpregaMais, com dados profissionais organizados para análise.'],['Contato direto com candidatos','Entre em contato com o candidato pelo WhatsApp ou por e-mail a partir do ambiente de recrutamento.'],['Mensagens dentro do EmpregaMais','Use o canal de comunicação do portal para centralizar conversas relacionadas ao processo seletivo.'],['Agendamento de entrevistas','Agende entrevistas diretamente pelo gerenciamento do candidato e mantenha o processo organizado.'],['Gestão do processo seletivo','Acompanhe e atualize as etapas de cada candidatura, da análise até a contratação.'],['Aderência à vaga','Consulte a estimativa de aderência entre as informações do currículo do candidato e os requisitos da oportunidade.']]}
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
function selecionarAbaPlano(chave){if(!DETALHES_PLANOS[chave])chave='basico';planoBAtual=chave;const d=DETALHES_PLANOS[chave];document.querySelectorAll('.planos-b-tabs button').forEach(b=>b.classList.toggle('ativo',b.dataset.plano===chave));const set=(id,t)=>{const e=document.getElementById(id);if(e)e.textContent=t};set('planoBTag',d.etiqueta);set('planoBNome','Plano '+d.nome);set('planoBResumo',d.resumo);set('planoBPreco',d.preco);set('planoBPeriodo',d.periodo);const precoBox=document.querySelector('.plano-b-preco');if(precoBox){let pg=precoBox.querySelector('.em-pagamento-plano');if(pg)pg.remove();if(chave!=='basico'){const periodo=document.getElementById('planoBPeriodo');periodo.insertAdjacentHTML('afterend',emPagamentoPlano(chave));}}set('planoBTituloBeneficios','O que está incluído no plano '+d.nome+'?');const l=document.getElementById('planoBLista');if(l){const icons=['▣','★','⚡','◈','♟','◉','▥','◌'];l.innerHTML='<div class="plano-recursos-grid">'+d.beneficios.map((x,i)=>'<article class="plano-recurso-card"><i>'+icons[i%icons.length]+'</i><div><strong>'+esc(x[0])+'</strong><p>'+esc(x[1])+'</p></div></article>').join('')+'</div>'+(chave!=='basico'?'<div class="plano-resultados"><i>◆</i><div><strong>Mais resultados para sua empresa</strong><p>Publique mais vagas, destaque suas oportunidades e encontre talentos com mais agilidade.</p></div></div>':'');}const bt=document.getElementById('planoBEscolher');if(bt){bt.textContent=chave==='basico'?'Começar grátis →':'Escolher este plano →';bt.type='button';bt.dataset.plano=chave;bt.onclick=null;}}
function renderizarPlanosModeloB(){renderizarPlanosAtuais();selecionarAbaPlano(planoBAtual||'trimestral')}

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

/* EMPREGAMAIS-EMPRESA-VAGAS-USERID-V5 */
function vagasDaEmpresa(){
 const uid=sessionStorage.getItem('empresaSupabaseUserId')||'';
 const cnpj=nums(sessionStorage.getItem('empresaCnpj')||'');
 const fonte=sbVagasCacheEM.length?sbVagasCacheEM:ler('empregaMaisVagas');
 return fonte.filter(v=>(uid&&String(v.userId||'')===uid)||(!uid&&cnpj&&nums(v.empresaCnpj||'')===cnpj))
}
const _loginEmpresaUserIdV5=loginEmpresa;
loginEmpresa=function(e){
 e.preventDefault();
 const cnpj=nums($('#loginEmpresaCnpj')?.value||''),senha=$('#loginEmpresaSenha')?.value||'';
 if(cnpj.length!==14)return msg('#msgLoginEmpresa','Informe um CNPJ válido.');
 if(!senha)return msg('#msgLoginEmpresa','Informe sua senha.');
 msg('#msgLoginEmpresa','Entrando...');
 sbLoginAuthEmpresaEM(cnpj,senha).then(auth=>{
   if(auth?.user?.id)sessionStorage.setItem('empresaSupabaseUserId',auth.user.id);
   return sbBuscarMinhaEmpresaEM()
 }).then(remota=>{
   if(!remota)throw new Error('Cadastro da empresa não encontrado no Supabase.');
   if(nums(remota.cnpj)!==cnpj)throw new Error('O cadastro autenticado não corresponde ao CNPJ informado.');
   if(remota.user_id)sessionStorage.setItem('empresaSupabaseUserId',remota.user_id);
   const d=sbEmpresaParaLocalEM(remota,senha);sbSalvarEmpresaLocalEM(d);
   entrar('empresa',d);
   if(remota.user_id)sessionStorage.setItem('empresaSupabaseUserId',remota.user_id);
   msg('#msgLoginEmpresa','');
   if(sessionStorage.getItem('planoPretendido'))setTimeout(()=>irPara('planos'),30)
 }).catch(err=>{console.error('Supabase login empresa:',err);const texto=/rate limit/i.test(err.message)?'O Supabase bloqueou temporariamente novas tentativas. Aguarde alguns minutos e tente novamente.':/invalid login|invalid credentials/i.test(err.message)?'CNPJ ou senha incorretos.':'Não foi possível entrar: '+err.message;msg('#msgLoginEmpresa',texto)})
};
async function sbCarregarVagasEmpresaAtualEM(){
 const t=await sbGarantirSessaoEM();if(!t)throw new Error('Sessão da empresa expirada.');
 const u=await sbUsuarioAtualEM();sessionStorage.setItem('empresaSupabaseUserId',u.id);
 const locais=ler('empregaMaisVagas');
 const a=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&user_id=eq.'+encodeURIComponent(u.id)+'&order=criado_em.desc',{method:'GET',headers:sbHeadersEM(t)});
 const proprias=(Array.isArray(a)?a:[]).map(sbMapVagaEM).filter(Boolean);
 const uid=String(u.id||''),cnpj=nums(sessionStorage.getItem('empresaCnpj')||'');
 const locaisDaEmpresa=locais.filter(v=>String(v.userId||v.user_id||'')===uid||(cnpj&&nums(v.empresaCnpj||v.cnpj||'')===cnpj));
 const mapa=new Map();
 locaisDaEmpresa.forEach(v=>mapa.set(String(v.id),v));
 proprias.forEach(v=>mapa.set(String(v.id),v));
 sbVagasCacheEM=[...mapa.values()];
 gravar('empregaMaisVagas',sbVagasCacheEM);
 return sbVagasCacheEM
}

/* EMPREGAMAIS-ADMIN-RLS-DIAGNOSTICO-V6 */
async function adminCarregarVagasSupabase(){
 const t=await adminSbToken();
 const u=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/auth/v1/user',{method:'GET',headers:sbHeadersEM(t)});
 const a=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&order=criado_em.desc',{method:'GET',headers:sbHeadersEM(t)});
 const vs=(Array.isArray(a)?a:[]).map(sbMapVagaEM);
 if(!vs.length){
   const err=new Error('A sessão ADM está autenticada, mas o Supabase não liberou nenhuma vaga para este usuário. A política RLS atual só permite à empresa ver as próprias vagas e ao público ver vagas aprovadas.');
   err.code='ADMIN_RLS_SEM_ACESSO';err.userId=u?.id||'';throw err
 }
 sbVagasCacheEM=vs;gravar('empregaMaisVagas',vs);return vs
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
 const papel=papelAtual(),body=document.body;body.classList.remove('sessao-empresa','sessao-candidato','sessao-publica');body.classList.add(papel==='empresa'?'sessao-empresa':papel==='candidato'?'sessao-candidato':'sessao-publica');
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

/* EMPREGAMAIS — DESTAQUES — RENDERIZAÇÃO E NAVEGAÇÃO V7 */
let indiceDestaquesEM=0;
function renderDestaquesEM(lista){
 const el=document.getElementById('listaDestaques');if(!el)return;
 const arr=Array.isArray(lista)?lista:[],total=arr.length;
 if(indiceDestaquesEM>Math.max(0,total-4))indiceDestaquesEM=0;
 const qtd=window.innerWidth<=700?1:window.innerWidth<=1050?2:4;
 let vis=[];for(let i=0;i<Math.min(qtd,total);i++)vis.push(arr[(indiceDestaquesEM+i)%total]);
 el.innerHTML=vis.map(cardVagaPortal).join('');
 el.dataset.quantidade=String(vis.length);
}
function moverDestaques(dir){
 const el=document.getElementById('listaDestaques');if(!el)return;
 const cards=el.querySelectorAll('.portal-vaga-nova');
 if(cards.length<1)return;
 const todas=vagasPublicas().filter(destaqueAtivo).slice(0,8);
 if(todas.length<=4)return;
 indiceDestaquesEM+=dir;
 if(indiceDestaquesEM>todas.length-4)indiceDestaquesEM=0;
 if(indiceDestaquesEM<0)indiceDestaquesEM=todas.length-4;
 renderDestaquesEM(todas);
}
(function(){let timer=null,pausado=false;function iniciar(){clearInterval(timer);timer=setInterval(function(){const el=document.getElementById('listaDestaques');if(!el||pausado)return;const total=vagasPublicas().filter(destaqueAtivo).slice(0,8).length;if(total>4)moverDestaques(1)},4500)}document.addEventListener('mouseover',function(e){if(e.target.closest&&e.target.closest('#listaDestaques'))pausado=true});document.addEventListener('mouseout',function(e){if(e.target.closest&&e.target.closest('#listaDestaques'))pausado=false});iniciar()})();

/* EMPREGAMAIS-VERIFICACAO-EMPRESA-V1 */
function iniciarSolicitacaoVerificacaoEM(lista,i,motivo='envio'){
 const emp=lista[i];if(!emp)return;
 emp.verificacaoStatus='pendente';emp.verificada=false;emp.verificacaoEnviadaEm=new Date().toISOString();emp.verificacaoMotivo=motivo==='reanálise'?'Dados da empresa alterados — aguardando reanálise':'';
 gravar('empregaMaisEmpresas',lista);
 (async()=>{try{const token=await sbGarantirSessaoEM();if(!token)throw new Error('Sessão da empresa indisponível.');const body={verificacao_status:'pendente',verificada:false,verificacao_enviada_em:emp.verificacaoEnviadaEm,verificacao_motivo:emp.verificacaoMotivo};const filtros=[];if(emp.id)filtros.push('id=eq.'+encodeURIComponent(emp.id));if(emp.userId)filtros.push('user_id=eq.'+encodeURIComponent(emp.userId));if(emp.cnpj)filtros.push('cnpj=eq.'+encodeURIComponent(nums(emp.cnpj)));let atualizado=null;for(const filtro of filtros){const r=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/empresas?'+filtro,{method:'PATCH',headers:Object.assign(sbHeadersEM(token),{'Prefer':'return=representation'}),body:JSON.stringify(body)});if(Array.isArray(r)&&r.length){atualizado=r[0];break}}if(!atualizado)throw new Error('A solicitação não foi gravada no cadastro da empresa.');const remoto=sbEmpresaParaLocalEM(atualizado,emp.senha||'');if(remoto)sbSalvarEmpresaLocalEM(remoto);}catch(err){console.error('Não foi possível sincronizar a reanálise da empresa no Supabase:',err);emp.verificacaoStatus='erro_sincronizacao';gravar('empregaMaisEmpresas',lista);const m=document.getElementById('msgPerfilEmpresa');if(m){m.textContent='Não foi possível enviar a solicitação para análise. Tente novamente.';m.className='form-msg erro'}}})();
 const m=document.getElementById('msgPerfilEmpresa');if(m){m.textContent='';m.className='form-msg'}
 const modal=document.getElementById('emVerificacaoModal');if(modal){const titulo=modal.querySelector('#emVerificacaoTitulo'),intro=modal.querySelector('.em-verificacao-dialog>p');if(titulo)titulo.textContent=motivo==='reanálise'?'Alterações enviadas para nova análise':'Verificação iniciada com sucesso';if(intro)intro.innerHTML=motivo==='reanálise'?'As alterações foram enviadas com sucesso. Sua empresa voltou para <strong>análise</strong> e o prazo é de <strong>até 48 horas</strong>. O selo ficará temporariamente suspenso até a nova aprovação.':'Recebemos as informações da sua empresa com sucesso. A solicitação foi enviada para <strong>análise</strong>, com prazo de <strong>até 48 horas</strong> para conclusão.';modal.classList.add('aberto');modal.setAttribute('aria-hidden','false');document.body.classList.add('em-modal-aberto')}
}
function concluirSolicitacaoVerificacaoEM(){
 const modal=document.getElementById('emVerificacaoModal');if(modal){modal.classList.remove('aberto');modal.setAttribute('aria-hidden','true')}document.body.classList.remove('em-modal-aberto');irPara('painel-empresa')
}
function renderStatusVerificacaoEmpresaEM(){
 const box=document.getElementById('empresaVerificacaoStatus');if(!box)return;const emp=empresaLogada();if(!emp){box.innerHTML='';return}
 const s=emp.verificada||emp.verificacaoStatus==='aprovada'?'aprovada':(emp.verificacaoStatus||'nao_verificada');
 if(s==='pendente'||s==='em_analise'){box.innerHTML='<div class="em-ver-status em-ver-pendente"><span class="em-ver-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span><div><small>VERIFICAÇÃO DA EMPRESA</small><strong>Aguardando análise</strong><p>Sua solicitação foi recebida e está em análise. O prazo para conclusão é de até 48 horas. O selo de Empresa Verificada será liberado após a aprovação.</p></div><b>EM ANÁLISE</b></div>';return}
 if(s==='aprovada'){box.innerHTML='<div class="em-ver-status em-ver-aprovada"><span class="em-ver-icon"><svg viewBox="0 0 24 24"><path d="M7 12.5l3.2 3.2L17.5 8.5"/><circle cx="12" cy="12" r="9"/></svg></span><div><small>VERIFICAÇÃO DA EMPRESA</small><strong>Empresa verificada</strong><p>Sua empresa passou pela análise e o selo de verificação está ativo.</p></div><b>VERIFICADA</b></div>';return}
 box.innerHTML=''
}
const _renderizarPainelEmpresaVerEM=renderizarPainelEmpresa;
renderizarPainelEmpresa=function(){const r=_renderizarPainelEmpresaVerEM.apply(this,arguments);renderStatusVerificacaoEmpresaEM();return r};


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
 setTimeout(()=>{renderPerfilVerificacaoEmpresaEM()},80);
}

/* EMPREGAMAIS-PERFIL-VERIFICACAO-ISOLADA-V2 */
function renderPerfilVerificacaoEmpresaEM(){
 const pagina=document.getElementById('pagina-perfil-empresa'),emp=empresaLogada();if(!pagina||!emp)return;
 let box=document.getElementById('perfilVerificacaoEmpresaEM');
 if(!box){box=document.createElement('section');box.id='perfilVerificacaoEmpresaEM';box.className='perfil-verificacao-em';const shell=pagina.querySelector('.perfil-wizard-shell');if(shell)shell.insertBefore(box,shell.firstChild)}
 const s=emp.verificada||emp.verificacaoStatus==='aprovada'?'aprovada':(emp.verificacaoStatus||'nao_verificada');
 pagina.classList.toggle('modo-verificacao',s==='pendente'||s==='em_analise'||s==='aprovada');
 const formulario=pagina.querySelector('.perfil-wizard-head'),progresso=document.getElementById('perfilProgress'),layout=pagina.querySelector('.perfil-wizard-layout-split');
 const ocultar=s==='pendente'||s==='em_analise'||s==='aprovada';
 [formulario,progresso,layout].forEach(x=>{if(x)x.style.display=ocultar?'none':''});
 if(!ocultar){box.innerHTML='';box.style.display='none';return}
 box.style.display='block';
 if(s==='aprovada'){
  const p=emp.perfil||{};
  box.innerHTML='<div class="pv-top pv-aprovada"><button type="button" class="pv-voltar" onclick="irPara(\'painel-empresa\')">← Meu painel</button><span class="pv-kicker">VERIFICAÇÃO DA EMPRESA</span><div class="pv-title"><div class="pv-clock pv-check"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m7.5 12.2 3 3 6-6.4"/></svg></div><div><h1>Empresa verificada</h1><p><strong>'+esc(p.nome||emp.nome||'Sua empresa')+'</strong> foi aprovada na verificação do EmpregaMais. O selo de confiança está ativo no perfil empresarial.</p></div><b class="pv-approved-badge">VERIFICADA</b></div></div><div class="pv-approved-card"><div class="pv-seal"><svg viewBox="0 0 24 24"><path d="M12 3l2.2 1.7 2.8-.2.8 2.7 2.3 1.6-1 2.6 1 2.6-2.3 1.6-.8 2.7-2.8-.2L12 21l-2.2-1.7-2.8.2-.8-2.7-2.3-1.6 1-2.6-1-2.6 2.3-1.6.8-2.7 2.8.2z"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/></svg></div><div><span>STATUS ATUAL</span><h2>Selo Empresa Verificada ativo</h2><p>Seu perfil passou pela análise. Caso dados cadastrais importantes sejam alterados, a empresa poderá retornar automaticamente para reanálise.</p></div><button type="button" onclick="editarPerfilEmAnaliseEM()">Atualizar dados da empresa</button></div>';
  return;
 }
 const p=emp.perfil||{},data=emp.verificacaoEnviadaEm?new Date(emp.verificacaoEnviadaEm).toLocaleDateString('pt-BR'):'Recentemente';
 const nome=p.nome||emp.nome||'Sua empresa',local=[p.cidade||emp.cidade,p.uf||emp.uf].filter(Boolean).join(' - ')||'Não informado';
 box.innerHTML='<div class="pv-top"><button type="button" class="pv-voltar" onclick="irPara(\'painel-empresa\')">← Meu painel</button><span class="pv-kicker">VERIFICAÇÃO DA EMPRESA</span><div class="pv-title"><div class="pv-clock"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></div><div><h1>Sua empresa está em análise</h1><p>Recebemos os dados de <strong>'+esc(nome)+'</strong>. Nossa equipe está verificando as informações antes de liberar o selo Empresa Verificada. O prazo para conclusão da análise é de até 48 horas.</p></div><b>EM ANÁLISE</b></div></div>'+
 '<div class="pv-grid"><main><article class="pv-card pv-progress-card"><div class="pv-card-head"><div><span>STATUS DA SOLICITAÇÃO</span><h2>Acompanhamento da verificação</h2></div><small>Enviado em '+esc(data)+'</small></div><div class="pv-steps"><div class="feito"><i>✓</i><b>Dados enviados</b><small>Informações recebidas</small></div><span></span><div class="ativo"><i>2</i><b>Em análise</b><small>Validação pelo EmpregaMais</small></div><span></span><div><i>3</i><b>Empresa verificada</b><small>Liberação do selo</small></div></div><div class="pv-info">Você pode continuar usando o portal normalmente enquanto a análise acontece. Se precisar, seus dados ainda podem ser editados antes da aprovação.</div></article>'+
 '<article class="pv-card"><div class="pv-card-head"><div><span>DADOS ENVIADOS</span><h2>Resumo da empresa</h2></div><button type="button" onclick="editarPerfilEmAnaliseEM()">Editar informações</button></div><div class="pv-data"><div><small>Empresa</small><strong>'+esc(nome)+'</strong></div><div><small>CNPJ</small><strong>'+esc(emp.cnpj||'Não informado')+'</strong></div><div><small>Segmento</small><strong>'+esc(p.segmento||'Não informado')+'</strong></div><div><small>Localização</small><strong>'+esc(local)+'</strong></div><div><small>Responsável</small><strong>'+esc(emp.responsavel||'Não informado')+'</strong></div><div><small>Função / cargo</small><strong>'+esc(emp.funcaoResponsavel||emp.funcao_responsavel||'Não informado')+'</strong></div><div><small>E-mail</small><strong>'+esc(emp.email||'Não informado')+'</strong></div></div></article></main>'+
 '<aside><article class="pv-badge"><span>EMPRESA VERIFICADA</span><div class="pv-seal"><svg viewBox="0 0 24 24"><path d="M12 3l2.2 1.7 2.8-.2.8 2.7 2.3 1.6-1 2.6 1 2.6-2.3 1.6-.8 2.7-2.8-.2L12 21l-2.2-1.7-2.8.2-.8-2.7-2.3-1.6 1-2.6-1-2.6 2.3-1.6.8-2.7 2.8.2z"/><path d="m8.5 12 2.2 2.2 4.8-4.8"/></svg></div><h2>Mais confiança para sua marca empregadora</h2><p>Após a aprovação, o selo identifica sua empresa como verificada dentro do EmpregaMais.</p></article>'+
 '<article class="pv-benefits"><span>BENEFÍCIOS DA VERIFICAÇÃO</span><div><i>✓</i><p><b>Selo de Empresa Verificada</b><small>Identificação visual no perfil e nas áreas compatíveis do portal.</small></p></div><div><i>✓</i><p><b>Mais credibilidade</b><small>Ajuda candidatos a reconhecerem um perfil empresarial analisado.</small></p></div><div><i>✓</i><p><b>Perfil mais confiável</b><small>Reforça a identidade institucional apresentada aos profissionais.</small></p></div><div><i>✓</i><p><b>Destaque de confiança</b><small>O selo acompanha a presença da empresa onde a verificação for exibida.</small></p></div></article></aside></div>';
}
function editarPerfilEmAnaliseEM(){
 const pagina=document.getElementById('pagina-perfil-empresa'),box=document.getElementById('perfilVerificacaoEmpresaEM');pagina?.classList.remove('modo-verificacao');if(box)box.style.display='none';
 ['.perfil-wizard-head','#perfilProgress','.perfil-wizard-layout-split'].forEach(s=>{const x=pagina?.querySelector(s);if(x)x.style.display=''});
 perfilEmpresaEtapa(1);carregarPerfilEmpresa();window.scrollTo(0,0);
}

/* Atualiza automaticamente a tela de verificacao enquanto ela estiver aberta. */
(function(){
 if(window.__emVerificacaoAutoRefresh)return;window.__emVerificacaoAutoRefresh=true;
 setInterval(function(){
  const pg=document.getElementById('pagina-perfil-empresa');
  if(pg&&pg.classList.contains('ativa')&&document.getElementById('perfilVerificacaoEmpresaEM')?.style.display!=='none')renderPerfilVerificacaoEmpresaEM();
 },5000);
})();


/* EMPREGAMAIS-CHAT-CANDIDATURA-V1 */
function chatLiberadoEM(c){const t=new Date(c?.criadoEm||0).getTime();return !t||Date.now()-t>=600000}
function mensagensCandidaturaEM(c){return Array.isArray(c?.mensagens)?c.mensagens:[]}
function nomeEmpresaCandidaturaEM(c){const v=ler('empregaMaisVagas').find(x=>x.id===c?.vagaId)||{};return v.confidencial?'Empresa responsável pela vaga':(v.empresa||sessionStorage.getItem('empresaNome')||'empresa')}
function mensagemPadraoCandidaturaEM(c){return 'Olá, '+(c.candidato||c.nome||'candidato')+'!\n\nAgradecemos o seu interesse em fazer parte da '+nomeEmpresaCandidaturaEM(c)+'.\n\nRecebemos a sua inscrição e, caso seu currículo atenda aos pré-requisitos solicitados, em breve entraremos em contato para falarmos sobre os próximos passos.\n\nLembrando que você pode acompanhar o andamento do seu processo seletivo pelo portal EmpregaMais.'}
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
 if(autor==='empresa'){abrirFichaCandidato(id)}else renderizarCandidaturasCandidato()
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
 return {nome:cvVal('cvNome'),titulo:cvVal('cvTitulo'),email:cvVal('cvEmail'),telefone:cvVal('cvTelefone'),cep:cvVal('cvCep'),bairro:cvVal('cvBairro'),cidade:cvVal('cvCidade'),uf:cvVal('cvUf'),area:cvVal('cvArea'),objetivo:cvVal('cvObjetivo'),modalidades:[...document.querySelectorAll('.cv-modalidade-check:checked')].map(x=>x.value),pretensao:cvVal('cvPretensao'),resumo:cvVal('cvResumo'),cnh:cvVal('cvCnh'),categoriasCnh:[...document.querySelectorAll('.cv-cnh-check:checked')].map(x=>x.value),veiculo:cvVal('cvVeiculo'),tipoVeiculo:cvVal('cvTipoVeiculo'),regiaoMinhaCidade:document.getElementById('cvRegiaoMinhaCidade')?.checked!==false,cidadesProximas:!!document.getElementById('cvCidadesProximas')?.checked,viagens:!!document.getElementById('cvViagens')?.checked,mudanca:!!document.getElementById('cvMudanca')?.checked,competencias:cvVal('cvCompetencias'),idiomas:cvVal('cvIdiomas'),linkedin:cvVal('cvLinkedin'),portfolio:cvVal('cvPortfolio'),experiencias:ex,formacoes:fo,cursos:cu,atualizadoEm:new Date().toISOString()}
}
function salvarCurriculoOnlineEM(e){if(e?.preventDefault)e.preventDefault();if(!document.getElementById('formCurriculoOnline'))return;const d=coletarCurriculoOnlineEM();gravar(chaveCurriculoOnlineEM(),d);const s=document.getElementById('cvSaveStatus');if(s)s.textContent='✓ Alterações salvas';const t=document.getElementById('cvSalvoEm');if(t)t.textContent='Salvo agora';atualizarPreviewCurriculoEM(d);atualizarProgressoCurriculoEM(d);return d}
function salvarCurriculoOnlineManualEM(){const form=document.getElementById('formCurriculoOnline');if(!form)return;if(!validarObrigatoriosEM(form))return;const d=salvarCurriculoOnlineEM();const s=document.getElementById('cvSaveStatus');if(s)s.textContent='✓ Currículo online salvo';const t=document.getElementById('cvSalvoEm');if(t)t.textContent='Salvo agora';const btn=form.querySelector('.cv-savebar .btn');if(btn){const original=btn.textContent;btn.textContent='✓ Currículo salvo';btn.classList.add('cv-saved');setTimeout(()=>{btn.textContent=original;btn.classList.remove('cv-saved')},2200)}abrirSucessoCurriculoEM();return d}

function carregarCurriculoOnlineEM(){
 const d=dadosCurriculoOnlineEM(),u=candidatoLogado()||{},p=u.perfil||{};const set=(id,v)=>{const e=document.getElementById(id);if(e)e.value=v||''};
 set('cvNome',d.nome||u.nome);set('cvTitulo',d.titulo||p.titulo);set('cvEmail',d.email||u.email||sessionStorage.getItem('candidatoEmail'));set('cvTelefone',d.telefone||u.telefone);set('cvCep',d.cep);set('cvBairro',d.bairro);set('cvCidade',d.cidade||u.cidade);set('cvUf',d.uf||p.uf);set('cvArea',d.area||p.area);set('cvObjetivo',d.objetivo||p.titulo);const mods=Array.isArray(d.modalidades)?d.modalidades:(d.modalidade?[d.modalidade]:(p.modalidade?[p.modalidade]:[]));document.querySelectorAll('.cv-modalidade-check').forEach(x=>x.checked=mods.includes(x.value));atualizarModalidadesCV(false);set('cvPretensao',d.pretensao||p.pretensao);set('cvResumo',d.resumo||p.resumo);set('cvCnh',d.cnh);const cats=Array.isArray(d.categoriasCnh)?d.categoriasCnh:(d.categoriaCnh?String(d.categoriaCnh).split(''):[]);document.querySelectorAll('.cv-cnh-check').forEach(x=>x.checked=cats.includes(x.value));atualizarCategoriasCnhCV(false);set('cvVeiculo',d.veiculo);set('cvTipoVeiculo',d.tipoVeiculo);const chk=(id,v)=>{const e=document.getElementById(id);if(e)e.checked=!!v};chk('cvRegiaoMinhaCidade',d.regiaoMinhaCidade!==false);chk('cvCidadesProximas',d.cidadesProximas);chk('cvViagens',d.viagens===true||d.viagens==='sim');chk('cvMudanca',d.mudanca);set('cvCompetencias',d.competencias||p.competencias);set('cvIdiomas',d.idiomas);alternarMobilidadeCV();set('cvLinkedin',d.linkedin||p.linkedin);set('cvPortfolio',d.portfolio||p.portfolio);
 const ex=document.getElementById('cvExperiencias'),fo=document.getElementById('cvFormacoes'),cu=document.getElementById('cvCursos');if(ex){ex.innerHTML='';(d.experiencias?.length?d.experiencias:[{}]).forEach(adicionarExperienciaCV)}if(fo){fo.innerHTML='';(d.formacoes?.length?d.formacoes:[{}]).forEach(adicionarFormacaoCV)}if(cu){cu.innerHTML='';(d.cursos?.length?d.cursos:[]).forEach(adicionarCursoCV)}
 atualizarCidadeRegiaoCV();document.querySelectorAll('#formCurriculoOnline input,#formCurriculoOnline textarea,#formCurriculoOnline select').forEach(x=>{if(!x.dataset.cvbind){x.addEventListener('input',()=>{clearTimeout(window.cvAutoSave);window.cvAutoSave=setTimeout(salvarCurriculoOnlineEM,450)});x.dataset.cvbind='1'}});const atual=coletarCurriculoOnlineEM();atualizarPreviewCurriculoEM(atual);atualizarProgressoCurriculoEM(atual)
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

async function buscarCepCurriculoEM(){
 const cep=nums(cvVal('cvCep')),aj=document.getElementById('cvCepAjuda');if(cep.length!==8){if(aj){aj.textContent='Informe um CEP com 8 dígitos.';aj.classList.add('erro')}return}
 if(aj){aj.textContent='Buscando endereço...';aj.classList.remove('erro')}
 try{const res=await fetch('https://viacep.com.br/ws/'+cep+'/json/');if(!res.ok)throw 0;const d=await res.json();if(d.erro)throw 0;
 const bairro=document.getElementById('cvBairro'),cidade=document.getElementById('cvCidade'),uf=document.getElementById('cvUf');
 if(d.bairro&&bairro)bairro.value=d.bairro;if(d.localidade&&cidade)cidade.value=d.localidade;if(d.uf&&uf)uf.value=d.uf;
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
 return sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/auth/v1/signup",{method:"POST",headers:sbHeadersEM(),body:JSON.stringify({email:email,password:senha,data:{papel:"candidato",nome:nome,telefone:telefone,cidade:cidade}})}).then(a=>{sbSalvarSessaoEM(a);return a})
}
function sbLoginAuthCandidatoEM(email,senha){
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
 if(sessionStorage.getItem("retornoCandidatura")==="1"){sessionStorage.removeItem("retornoCandidatura");sessionStorage.removeItem("retornoSalvarVaga");setTimeout(()=>irPara("candidatar"),30);return}
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
const _sairSupabaseCandidatoV1=sair;
sair=function(){
 const papel=papelAtual();
 if(papel==="candidato"){
   const t=sbTokenEM();if(t)fetch(EMPREGAMAIS_SUPABASE_URL+"/auth/v1/logout",{method:"POST",headers:sbHeadersEM(t)}).catch(()=>{});
   sessionStorage.removeItem(EMPREGAMAIS_SB_TOKEN);localStorage.removeItem(EMPREGAMAIS_SB_TOKEN);
   sessionStorage.removeItem(EMPREGAMAIS_SB_REFRESH);localStorage.removeItem(EMPREGAMAIS_SB_REFRESH);
 }
 return _sairSupabaseCandidatoV1()
};


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
 if(origem==="online"&&!itensProgressoCurriculoEM(online).some(x=>x.ok))return msg("#msgCandidatura","Crie seu Currículo EmpregaMais antes de selecionar esta opção.");
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
  try{d=sbSalvarCandidatoLocalEM(await sbUpsertCandidatoSupabaseEM(d,auth.access_token))}
  catch(syncErr){console.error("Sincronização do cadastro do candidato:",syncErr);msg("#msgLoginCandidato","Conta autenticada, mas não foi possível sincronizar seu cadastro. Atualize a página e tente novamente.");return}
  concluirEntradaCandidatoSupabaseEM(d)
 }catch(err){
  console.error("Login candidato / Supabase:",err);
  const t=/email not confirmed/i.test(err.message)?"Confirme seu e-mail antes de entrar.":/already|registered|exists/i.test(err.message)?"Sua conta já existe no Supabase. Tente entrar novamente.":/invalid login|invalid credentials/i.test(err.message)?"E-mail ou senha incorretos.":("Não foi possível entrar: "+err.message);
  msg("#msgLoginCandidato",t)
 }
}

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
 const legado=ler("empregaMaisCandidaturas").slice(),token=await sbGarantirSessaoEM();if(!token)return candidaturas();
 sbCandidaturasCarregandoEM=true;
 try{
  let rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/candidaturas?select=*&order=criado_em.desc",{method:"GET",headers:sbHeadersEM(token)});rows=Array.isArray(rows)?rows:[];
  if(papelAtual()==="candidato"){
   const u=await sbUsuarioAtualEM(),email=String(sessionStorage.getItem("candidatoEmail")||u.email||"").toLowerCase(),ids=new Set(rows.map(x=>x.id));
   const antigas=legado.filter(c=>String(c.email||"").toLowerCase()===email&&!ids.has(c.id));
   for(const c of antigas){
    const v=(sbVagasCacheEM.length?sbVagasCacheEM:ler("empregaMaisVagas")).find(x=>x.id===c.vagaId);if(!v?.userId)continue;
    const criado=c.criadoEm||new Date().toISOString(),hist=Array.isArray(c.historico)&&c.historico.length?c.historico:[{status:"Candidatura enviada",data:criado},{status:c.status||"Em avaliação",data:c.atualizadoEm||criado}];
    try{
     const payload={id:c.id,vaga_id:c.vagaId,candidato_user_id:u.id,empresa_user_id:v.userId,candidato_nome:c.candidato||c.nome||"",candidato_email:c.email||u.email||"",candidato_telefone:c.telefone||"",status:c.status||"Em avaliação",historico:hist,entrevista:c.entrevista||null,curriculo:c.curriculo||null,perfil_profissional:c.perfilProfissional||null,curriculo_origem:c.curriculoOrigem||"",aderencia:Number.isFinite(c.aderencia)?c.aderencia:calcularAderenciaCandidatoEM(c,v),criado_em:criado,atualizado_em:c.atualizadoEm||criado,contratado_em:c.contratadoEm||null};
     const ins=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+"/rest/v1/candidaturas",{method:"POST",headers:Object.assign(sbHeadersEM(token),{"Prefer":"return=representation"}),body:JSON.stringify(payload)});if(Array.isArray(ins)&&ins[0])rows.push(ins[0])
    }catch(err){console.warn("Candidatura antiga não migrada:",c.id,err)}
   }
  }
  sbEspelharCandidaturasEM(rows.map(sbMapCandidaturaEM));
  if(renderizar!==false){if(papelAtual()==="empresa"&&document.getElementById("listaCandidatosEmpresa"))renderizarCandidatosEmpresa();if(papelAtual()==="candidato"){if(document.getElementById("listaCandidaturas"))renderizarCandidaturasCandidato();if(document.getElementById("candMetricaCandidaturas"))atualizarPainelCandidato()}}
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
const ADMIN2_TITULOS_EM={geral:['Visão geral','Acompanhe o EmpregaMais em um único lugar.'],pendencias:['Central de pendências','Tudo que precisa de uma ação administrativa.'],vagas:['Gestão de vagas','Analise e acompanhe todas as oportunidades do portal.'],empresas:['Empresas','Cadastros, planos e situação das empresas.'],verificacoes:['Verificações','Analise empresas que aguardam verificação ou reanálise.'],candidatos:['Candidatos','Cadastros e recursos dos profissionais.'],contratacoes:['Contratações','Acompanhe as contratações registradas no portal.'],planos:['Planos e assinaturas','Controle solicitações, vigências e concessões.'],'premium-candidatos':['Premium para candidatos','Conceda, acompanhe e remova acessos Premium dos candidatos.'],extras:['Extras','Destaques, urgências e benefícios adicionais.'],financeiro:['Financeiro','Visão administrativa das movimentações do portal.'],denuncias:['Denúncias','Analise ocorrências enviadas para moderação.'],relatorios:['Relatórios','Indicadores consolidados do EmpregaMais.'],historico:['Histórico administrativo','Registro das ações realizadas no painel.'],configuracoes:['Configurações','Controles administrativos e regras do portal.']};
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
   '<button type="button" class="btn btn-chat-em" onclick="abrirChatCandidatoEM(\''+esc(c.id)+'\')">Mensagens</button>'+
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
  const curr=c.curriculoOrigem==='online'?'Currículo online':c.curriculo?.nome?'Currículo anexado':'Perfil EmpregaMais';
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
    respostas.flat().forEach(v=>{if(v?.id) mapa.set(String(v.id),v?.cargo!==undefined&&v?.empresaCnpj!==undefined?v:sbMapVagaEM(v))});
    const consolidado=[...mapa.values()].filter(Boolean);
    sbVagasCacheEM=consolidado;
    gravar('empregaMaisVagas',consolidado);
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
    }catch(e){console.warn('EmpregaMais: usando vagas locais.',e)}
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

  const renderPortalSeguro=function(){
    const box=$('#listaVagasPortal');if(!box)return;
    const desenhar=()=>{try{_renderizarVagasPortalLocalEM()}catch(e){console.error('EmpregaMais: erro ao renderizar vagas.',e)}};
    if(Array.isArray(sbVagasCacheEM)&&sbVagasCacheEM.length){desenhar();return}
    carregarVagasSeguro().then(desenhar).catch(desenhar);
  };
  window.renderizarVagasPortal=renderPortalSeguro;
  renderizarVagasPortal=renderPortalSeguro;

  window.recarregarVagasEmpresaSeguroEM=async function(){
    await carregarEmpresaSeguro().catch(e=>console.warn('EmpregaMais: sincronização de vagas falhou.',e));
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
