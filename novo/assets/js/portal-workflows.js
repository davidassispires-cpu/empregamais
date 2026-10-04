/* Persisted publication, company catalog, applications, conversations and plan requests. */
function coletarDadosPublicacaoPortalEM() {
 const value=id=>document.getElementById(id)?.value.trim()||'';
 return {quantidadeContratacoes:Number(value('quantidadeVagas'))||1,logradouro:value('logradouroVaga'),bairro:value('bairroVaga'),numero:value('numeroVaga'),complemento:value('complementoVaga'),tipoLocal:document.querySelector('input[name="tipoLocalVaga"]:checked')?.value||'propria',locais:[...document.querySelectorAll('#listaLocaisVaga .em-local-chip b')].map(el=>el.textContent.trim()),vagaParaCliente:!!document.getElementById('vagaParaCliente')?.checked,empresaContratante:value('empresaContratanteVaga'),perguntasEliminatorias:perguntasEliminatoriasPublicacaoEM()};
}
(function(){
 'use strict';
 let companyRequest=null,applicationRequest=null;
 const rest='/rest/v1/';
 const sessionRevision=()=>Number(window.empregosSessionRevisionEM)||0;
 const checkSession=revision=>{if(revision!==sessionRevision())throw Error('A sessão foi alterada. Entre novamente para atualizar.');};
 async function allRows(path,token){
  const rows=[],size=500;
  for(let offset=0;;offset+=size){const page=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+rest+path+'&limit='+size+'&offset='+offset,{headers:sbHeadersEM(token),cache:'no-store'});if(!Array.isArray(page))throw Error('Resposta inválida do servidor.');rows.push(...page);if(page.length<size)return rows;}
 }
 window.sbCarregarVagasEmpresaAtualEM=sbCarregarVagasEmpresaAtualEM=function(){
  if(companyRequest)return companyRequest;
  companyRequest=(async()=>{
   const revision=sessionRevision();
   const token=await sbGarantirSessaoEM();if(!token)throw Error('Entre na conta da empresa.');
   const company=await sbBuscarMinhaEmpresaEM();if(!company)throw Error('Empresa não encontrada.');
   const jobs=(await allRows('vagas?select=*&empresa_id=eq.'+encodeURIComponent(company.id)+'&order=criado_em.desc,id.asc',token)).map(sbMapVagaEM);
   checkSession(revision);
   const other=(Array.isArray(sbVagasCacheEM)?sbVagasCacheEM:[]).filter(v=>String(v.empresaId)!==String(company.id));
   sbVagasCacheEM=[...other,...jobs];
   try{gravar('empregaMaisVagas',sbVagasCacheEM);}catch(error){console.warn('Cache de vagas indisponível.',error);}
   return jobs;
  })().finally(()=>{companyRequest=null;});return companyRequest;
 };
 async function loadApplications(token,revision){
  const [applications,messages]=await Promise.all([allRows('candidaturas?select=*&order=criado_em.desc,id.asc',token),allRows('mensagens_candidaturas?select=*&order=criado_em.asc,id.asc',token)]);
  checkSession(revision);
  const byApplication=new Map();
  messages.forEach(m=>{if(!byApplication.has(m.candidatura_id))byApplication.set(m.candidatura_id,[]);byApplication.get(m.candidatura_id).push({id:m.id,autor:m.autor,texto:m.texto,data:m.criado_em,remetenteUserId:m.remetente_user_id});});
  const mapped=applications.map(row=>({...sbMapCandidaturaEM(row),mensagens:byApplication.get(row.id)||[]}));
  sbEspelharCandidaturasEM(mapped);return mapped;
 }
 window.sbCarregarCandidaturasEM=sbCarregarCandidaturasEM=function(render=true,authorizedToken=''){
  const renderRows=rows=>{
   if(render!==false){if(papelAtual()==='empresa')renderizarCandidatosEmpresa();else if(papelAtual()==='candidato'){renderizarCandidaturasCandidato();atualizarPainelCandidato();}}
   return rows;
  };
  // Admin authentication has its own validated token and must not reuse a company request.
  if(authorizedToken)return loadApplications(authorizedToken,sessionRevision()).then(renderRows);
  if(applicationRequest)return applicationRequest.then(renderRows);
  applicationRequest=(async()=>{
   const revision=sessionRevision();
   const token=await sbGarantirSessaoEM();if(!token)return [];
   return loadApplications(token,revision);
  })().finally(()=>{applicationRequest=null;});return applicationRequest.then(renderRows);
 };
 const updateApplication=sbAtualizarCandidaturaEM;
 window.sbAtualizarCandidaturaEM=sbAtualizarCandidaturaEM=async function(application,patch){
  const current=candidaturas().find(row=>row.id===application.id)||application;
  const messages=Array.isArray(current.mensagens)?current.mensagens.slice():[];
  const updated=await updateApplication(application,patch);
  updated.mensagens=messages;
  sbEspelharCandidaturasEM(candidaturas().map(row=>row.id===updated.id?updated:row));
  return updated;
 };
 window.enviarMensagemCandidaturaEM=enviarMensagemCandidaturaEM=async function(id){
  const input=document.getElementById('chatTextoEM_'+id),text=input?.value.trim()||'';
  if(!text){mostrarToast('Digite uma mensagem antes de enviar.');return;}
  if(text.length>4000){mostrarToast('A mensagem deve ter até 4.000 caracteres.');return;}
  if(input?.dataset.sending==='1')return;if(input)input.dataset.sending='1';
  try{
   const token=await sbGarantirSessaoEM();if(!token)throw Error('Sua sessão expirou. Entre novamente.');
   const author=papelAtual()==='empresa'?'empresa':'candidato';
   const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+rest+'mensagens_candidaturas',{method:'POST',headers:{...sbHeadersEM(token),Prefer:'return=representation'},body:JSON.stringify({candidatura_id:id,autor:author,texto:text})});
   if(!Array.isArray(rows)||!rows[0])throw Error('O servidor não confirmou o envio.');
   await sbCarregarCandidaturasEM(false);if(input)input.value='';
   const application=candidaturas().find(c=>c.id===id);
   if(author==='empresa'){
    const old=document.querySelector('.recruta-andamento-modal-em .em-modal-mensagens .chat-em-box');
    if(old&&application){const wrap=document.createElement('div');wrap.innerHTML=renderChatCandidaturaEM(application,'empresa');old.replaceWith(wrap.firstElementChild);}else abrirFichaCandidato(id);
   }else renderizarCandidaturasCandidato();
   mostrarToast('Mensagem enviada.');
  }catch(error){mostrarToast('Não foi possível enviar: '+error.message);}finally{if(input)delete input.dataset.sending;}
 };
 function publicationFields(){
  const panel=document.querySelector('#formVaga .job-card[data-panel="2"] .job-grid')||document.querySelector('#formVaga .job-card[data-panel="2"]');
  if(!panel||document.getElementById('candidaturaTipoVaga'))return;
  const group=document.createElement('div');group.className='full portal-publication-options';
  group.innerHTML='<h3>Prazo e recebimento de candidaturas</h3><div class="portal-fields"><label>Encerramento<input id="dataEncerramentoVaga" type="date"></label><label>Salário máximo (opcional)<input id="salarioMaxVaga" inputmode="decimal" placeholder="Ex.: R$ 3.500,00"></label><label>Entrada (opcional)<input id="horarioEntradaVaga" type="time"></label><label>Saída (opcional)<input id="horarioSaidaVaga" type="time"></label><label class="full">Como receber candidatos<select id="candidaturaTipoVaga"><option value="portal">Pelo +Empregos</option><option value="email">Por e-mail</option><option value="whatsapp">Por WhatsApp</option><option value="externo">No site da empresa</option></select></label><label class="portal-destination" data-type="email" hidden>E-mail para candidaturas<input id="candidaturaEmailVaga" type="email"></label><label class="portal-destination" data-type="whatsapp" hidden>WhatsApp do recrutador<input id="candidaturaWhatsappVaga" type="tel" placeholder="DDD + número"></label><label class="portal-destination" data-type="externo" hidden>Link de candidatura<input id="candidaturaLinkVaga" type="url" placeholder="https://"></label></div><p>Vagas pelo portal têm acompanhamento de etapas. Nos outros canais, o candidato conclui o envio no destino informado.</p>';
  panel.appendChild(group);
  const select=group.querySelector('select');select.onchange=()=>group.querySelectorAll('.portal-destination').forEach(el=>{const active=el.dataset.type===select.value;el.hidden=!active;el.querySelector('input').required=active;});
 }
 const prepare=prepararPublicacao;
 window.prepararPublicacao=prepararPublicacao=function(){publicationFields();const result=prepare.apply(this,arguments);const id=sessionStorage.getItem('vagaEdicao'),job=id?vagasDaEmpresa().find(v=>String(v.id)===id):null;
  const set=(id,value)=>{const field=document.getElementById(id);if(field)field.value=value||'';};
  set('candidaturaTipoVaga',job?.candidaturaTipo||'portal');set('candidaturaEmailVaga',job?.candidaturaEmail||'');set('candidaturaWhatsappVaga',job?.candidaturaWhatsapp||'');set('candidaturaLinkVaga',job?.candidaturaLink||'');
  set('salarioMaxVaga',job?.salarioMax||'');set('horarioEntradaVaga',job?.horarioEntrada||'');set('horarioSaidaVaga',job?.horarioSaida||'');set('dataEncerramentoVaga',job?.dataEncerramento||dataEncerramentoAutomaticaEM());
  document.getElementById('candidaturaTipoVaga')?.onchange();return result;
 };
 window.enviarDenuncia=enviarDenuncia=async function(event){
  event.preventDefault();const job=vagaAtual(),form=document.getElementById('formDenuncia');if(!job||!form||form.dataset.sending==='1')return;
  const motivo=document.getElementById('denunciaMotivo')?.value||'',detalhes=document.getElementById('denunciaDetalhes')?.value.trim()||'';
  if(!motivo){msg('#msgDenuncia','Selecione o motivo da denúncia.');return;}
  const button=form.querySelector('button[type="submit"]');form.dataset.sending='1';if(button)button.disabled=true;
  try{const token=await sbGarantirSessaoEM();await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+rest+'denuncias_vagas',{method:'POST',headers:{...sbHeadersEM(token),Prefer:'return=minimal'},body:JSON.stringify({vaga_id:job.id,motivo,detalhes})});
   msg('#msgDenuncia','Denúncia recebida pela equipe para análise.',true);setTimeout(fecharDenuncia,900);
  }catch(error){msg('#msgDenuncia','Não foi possível enviar a denúncia: '+error.message);}finally{delete form.dataset.sending;if(button)button.disabled=false;}
 };
 const getPublication=sbDadosVagaAtualEM;
 window.sbDadosVagaAtualEM=sbDadosVagaAtualEM=async function(){
  const data=await getPublication();
  if(!data.cargo||!data.descricao||!data.requisitos)throw Error('Preencha cargo, descrição e requisitos.');
  if(data.candidaturaTipo==='email'&&!/^[^\s@'"<>]+@[^\s@'"<>]+\.[^\s@'"<>]+$/.test(data.candidaturaEmail))throw Error('Informe um e-mail válido para candidaturas.');
  if(data.candidaturaTipo==='whatsapp'&&nums(data.candidaturaWhatsapp).length<10)throw Error('Informe o WhatsApp com DDD.');
  if(data.candidaturaTipo==='externo'){let url;try{url=new URL(data.candidaturaLink);}catch{throw Error('Informe um link completo, começando com https://.');}if(!['https:','http:'].includes(url.protocol))throw Error('Link de candidatura inválido.');}
  if(data.salarioMax && valorSalario(data.salarioMax)<valorSalario(data.salario))throw Error('O salário máximo deve ser maior ou igual ao mínimo.');
  return data;
 };
 async function requestPlan(type,plan,method='pix'){
  const token=await sbGarantirSessaoEM();if(!token){irPara(type==='empresa'?'login-empresa':'login-candidato');return null;}
  const request=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+rest+'rpc/solicitar_plano',{method:'POST',headers:sbHeadersEM(token),body:JSON.stringify({p_tipo:type,p_plano:plan,p_forma:method})});
  if(!request?.id)throw Error('O servidor não confirmou a solicitação.');
  return request;
 }
 window.criarPedidoPlanoCheckout=criarPedidoPlanoCheckout=async function(plan){
  const modal=document.getElementById('emCheckoutPlano'),button=modal?.querySelector('.em-checkout-primary');if(button)button.disabled=true;
  try{const method=modal?.querySelector('input[name="emFormaPagamento"]:checked')?.value||'pix';const request=await requestPlan('empresa',plan,method);if(!request)return;
   const local={id:request.id,empresaCnpj:sessionStorage.getItem('empresaCnpj'),empresa:sessionStorage.getItem('empresaNome'),plano:request.plano,valor:Number(request.valor),formaPagamento:request.forma_pagamento,status:'aguardando_atendimento',criadoEm:request.criado_em};
   gravar('empregaMaisPedidosPlano',[local,...ler('empregaMaisPedidosPlano').filter(p=>p.id!==local.id)]);modal?.remove();mostrarToast('Solicitação registrada. A ativação depende da confirmação do pagamento pela administração.');
  }catch(error){mostrarToast(error.message);}finally{if(button)button.disabled=false;}
 };
 window.continuarPagamentoPlano=continuarPagamentoPlano=function(){document.getElementById('emCheckoutPlano')?.remove();mostrarToast('O pagamento online ainda não está configurado. Nenhuma cobrança foi realizada.');};
 window.assinarPremiumCandidatoEM=assinarPremiumCandidatoEM=async function(period='mensal'){try{const request=await requestPlan('candidato',period);if(request)mostrarToast('Solicitação de Premium registrada. Aguarde a confirmação de pagamento pela administração.');}catch(error){mostrarToast(error.message);}};
 const checkout=abrirCheckoutPlano;
 window.abrirCheckoutPlano=abrirCheckoutPlano=function(plan,pending){checkout(plan,pending);const modal=document.getElementById('emCheckoutPlano');if(!modal)return;modal.querySelector('h2').textContent='Solicitar plano '+(PLANOS_EMPRESA[plan]?.nome||plan);modal.querySelector('.em-checkout-sub').textContent='Registre sua solicitação. O pagamento online ainda não está configurado; nenhuma cobrança será realizada aqui.';modal.querySelector('.em-checkout-primary').textContent='Registrar solicitação →';};
 const selectPlan=selecionarPlano;
 window.selecionarPlano=selecionarPlano=async function(plan){
  if(plan==='basico'){mostrarToast('O plano gratuito já está disponível ao cadastrar sua empresa. Mudanças de assinatura são gerenciadas pela administração.');return;}
  if(papelAtual()==='empresa'){try{await sbGarantirSessaoEM();}catch(error){mostrarToast(error.message);return;}}
  return selectPlan(plan);
 };
 document.addEventListener('DOMContentLoaded',publicationFields);
})();
(function(){
 const planCurrent=planoEmpresaAtual;
 window.planoEmpresaAtual=planoEmpresaAtual=function(){const company=empresaLogada();if(company?.planoValidoAte&&Date.parse(company.planoValidoAte)<=Date.now())return PLANOS_EMPRESA.basico;return planCurrent();};
 window.usoPlanoEmpresa=usoPlanoEmpresa=function(){
  const company=empresaLogada()||{},plan=planoEmpresaAtual(),now=new Date(),free=plan.nome==='Grátis',start=free?new Date(now.getFullYear(),now.getMonth(),1):new Date(company.planoAtivadoEm||company.criadoEm||now),end=free?new Date(now.getFullYear(),now.getMonth()+1,1):new Date(company.planoValidoAte||now.getTime()+Number(plan.dias)*86400000);
  const jobs=vagasDaEmpresa().filter(v=>Date.parse(v.criadoEm)>=start.getTime()&&Date.parse(v.criadoEm)<end.getTime());
  return {vagas:jobs.length,destaques:jobs.filter(v=>v.destaque).length,urgentes:jobs.filter(v=>v.urgente).length,confidenciais:jobs.filter(v=>v.confidencial).length,inicio:start,fim:end};
 };
 window.saldoPlano=saldoPlano=function(){const plan=planoEmpresaAtual(),usage=usoPlanoEmpresa(),extra=empresaLogada()?.recursosAdmin||{};return{plano:plan,uso:usage,...Object.fromEntries(['vagas','destaques','urgentes','confidenciais'].map(key=>[key,Math.max(0,Number(plan[key])+Number(extra[key]||0)-usage[key])]))};};
})();
