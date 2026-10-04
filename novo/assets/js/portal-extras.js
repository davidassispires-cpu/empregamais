/* Persistent visibility requests; prices and activation are controlled by the database. */
(function(){
 'use strict';
 const root=EMPREGAMAIS_SUPABASE_URL+'/rest/v1/';
 const types={destaque:{name:'Destaque por 7 dias',price:19.90},urgencia:{name:'Selo de urgência',price:9.90}};
 let loading=null,lastRequested=false;
 const money=value=>Number(value).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
 const map=row=>({id:row.id,vagaId:row.vaga_id,empresaId:row.empresa_id,tipo:row.tipo,valor:Number(row.valor),dias:row.dias,status:row.status,criadoEm:row.criado_em,ativadoEm:row.ativado_em,canceladoEm:row.cancelado_em});
 function storeRequests(rows){
  const previous=ler('empregaMaisExtras'),legacy=previous.filter(r=>String(r.id).startsWith('extra_'));
  if(legacy.length)gravar('empregaMaisExtrasLegado',[...ler('empregaMaisExtrasLegado'),...legacy].filter((r,i,all)=>all.findIndex(x=>x.id===r.id)===i));
  gravar('empregaMaisExtras',rows.map(map));return rows.map(map);
 }
 window.carregarExtrasPortalEM=async function(token){
  if(loading)return loading;
  loading=(async()=>{token=token||await sbGarantirSessaoEM();if(!token)throw Error('Entre na conta da empresa.');const rows=[];
   for(let offset=0;;offset+=500){const page=await sbJsonEM(root+'solicitacoes_extras?select=*&order=criado_em.desc,id.asc&limit=500&offset='+offset,{headers:sbHeadersEM(token),cache:'no-store'});if(!Array.isArray(page))throw Error('Resposta inválida do servidor.');rows.push(...page);if(page.length<500)break;}
   return storeRequests(rows);
  })().finally(()=>{loading=null;});return loading;
 };
 function active(job,type){return type==='urgencia'?!!job.urgente:!!job.destaque&&(!job.destaqueAte||Date.parse(job.destaqueAte)>Date.now());}
 function available(job){return ['pendente','aprovada'].includes(job.status)&&(!job.dataEncerramento||Date.parse(job.dataEncerramento+'T23:59:59')>=Date.now());}
 function renderCompany(requests){
  const host=document.getElementById('empresaVagasPagina');if(!host)return;
  let panel=document.getElementById('portalExtrasEmpresa');if(!panel){panel=document.createElement('section');panel.id='portalExtrasEmpresa';panel.className='portal-extras';host.appendChild(panel);}
  const jobs=vagasDaEmpresa(),eligible=jobs.filter(available);
  panel.innerHTML='<h2>Visibilidade das vagas</h2><p>Solicite destaque ou urgência para uma vaga. Nenhuma cobrança é feita aqui; a ativação depende da confirmação do pagamento pela administração.</p>'+(eligible.length?'<label>Escolha a vaga<select id="portalExtraVaga">'+eligible.map(v=>'<option value="'+esc(v.id)+'">'+esc(tituloVaga(v))+'</option>').join('')+'</select></label><div class="portal-extra-actions">'+Object.entries(types).map(([type,t])=>'<button type="button" data-extra-type="'+type+'">Solicitar '+esc(t.name.toLowerCase())+' · '+money(t.price)+'</button>').join('')+'</div>':'<p>Publique uma vaga para solicitar recursos de visibilidade.</p>')+'<h3>Solicitações registradas</h3>'+(requests.length?requests.map(r=>'<article><div><strong>'+esc(types[r.tipo]?.name||r.tipo)+'</strong><p>'+esc(tituloVaga(jobs.find(v=>String(v.id)===String(r.vagaId))||{}))+' · '+money(r.valor)+'</p></div><span>'+esc({aguardando_pagamento:'Aguardando confirmação',ativo:'Ativo',cancelado:'Cancelado'}[r.status]||r.status)+'</span></article>').join(''):'<p>Nenhuma solicitação registrada.</p>');
  const select=panel.querySelector('select');
  if(select){const update=()=>{const job=eligible.find(v=>String(v.id)===select.value);panel.querySelectorAll('[data-extra-type]').forEach(b=>{const type=b.dataset.extraType;b.disabled=!job||active(job,type)||requests.some(r=>String(r.vagaId)===select.value&&r.tipo===type&&r.status==='aguardando_pagamento');});};select.onchange=update;update();
   panel.querySelectorAll('[data-extra-type]').forEach(b=>{b.onclick=()=>window.solicitarExtraVagaPortalEM(select.value,b.dataset.extraType,b);});
  }
 }
 window.solicitarExtraVagaPortalEM=async function(id,type,button){
  if(!types[type]||button?.disabled)return;if(button)button.disabled=true;
  try{const token=await sbGarantirSessaoEM();if(!token)throw Error('Sua sessão expirou. Entre novamente.');
   const rows=await sbJsonEM(root+'solicitacoes_extras',{method:'POST',headers:{...sbHeadersEM(token),Prefer:'return=representation'},body:JSON.stringify({vaga_id:id,tipo:type})});
   if(!Array.isArray(rows)||!rows[0]?.id)throw Error('O servidor não confirmou a solicitação.');
   mostrarToast('Solicitação registrada. Aguarde a confirmação de pagamento pela administração.');
   try{renderCompany(await window.carregarExtrasPortalEM(token));}catch(error){mostrarToast('Solicitação salva. Não foi possível atualizar a lista: '+error.message);}
  }catch(error){mostrarToast(error.code==='23505'?'Já existe uma solicitação pendente para este recurso.':error.message);}finally{if(button?.isConnected)button.disabled=false;}
 };
 const payload=sbVagaPayloadEM;
 window.sbVagaPayloadEM=sbVagaPayloadEM=function(data,id){
  const wanted={destaque:!!data.destaque,urgente:!!data.urgente},result=payload({...data},id),old=id?vagasDaEmpresa().find(v=>String(v.id)===String(id)):null,balance=saldoPlano();
  if(planoEmpresaAtual().nome==='Grátis')for(const [flag,request,budget,oldRequest] of [['destaque','destaque_solicitado','destaques','destaqueSolicitado'],['urgente','urgencia_solicitada','urgentes','urgenciaSolicitada']]){
   const included=wanted[flag]&&(!!old?.[flag]||Number(balance[budget])>0);result[flag]=included;result[request]=wanted[flag]&&!included||!!old?.[oldRequest];
  }
  lastRequested=result.destaque_solicitado||result.urgencia_solicitada;return result;
 };
 const confirmation=abrirConfirmacaoVagaAnaliseEM;
 window.abrirConfirmacaoVagaAnaliseEM=abrirConfirmacaoVagaAnaliseEM=function(edit){const result=confirmation(edit);if(lastRequested){const p=document.getElementById('emVagaAnaliseTexto');if(p)p.textContent+=' Os recursos avulsos solicitados foram registrados e aguardam confirmação de pagamento. Nenhuma cobrança foi realizada.';}return result;};
 const renderJobs=renderVagasEmpresaPaginaEM;
 window.renderVagasEmpresaPaginaEM=renderVagasEmpresaPaginaEM=async function(){
  try{await sbCarregarVagasEmpresaAtualEM();}catch(error){mostrarToast('Não foi possível atualizar suas vagas: '+error.message);return;}
  const result=await renderJobs.apply(this,arguments);
  try{renderCompany(await window.carregarExtrasPortalEM());}catch(error){const panel=document.getElementById('portalExtrasEmpresa');if(panel)panel.textContent='Não foi possível carregar as solicitações. '+error.message;else mostrarToast('Não foi possível carregar os recursos: '+error.message);}return result;
 };
 const sync=adminSincronizarPainelSupabase;
 window.adminSincronizarPainelSupabase=adminSincronizarPainelSupabase=async function(){const token=await adminSbToken();await window.carregarExtrasPortalEM(token);return sync.apply(this,arguments);};
 async function adminReview(id,action){
  if(action==='ativar'&&!confirm('Confirme que o pagamento deste extra foi recebido. Ativar o recurso na vaga?'))return;
  try{const token=await adminSbToken();await sbJsonEM(root+'rpc/admin_analisar_extra_portal',{method:'POST',headers:sbHeadersEM(token),body:JSON.stringify({p_id:id,p_acao:action})});await adminAba('extras');mostrarToast('Solicitação atualizada no Supabase.');}catch(error){mostrarToast('Não foi possível atualizar: '+error.message);}
 }
 window.adminAtivarExtra=adminAtivarExtra=id=>adminReview(id,'ativar');
 window.adminRejeitarExtra=adminRejeitarExtra=id=>adminReview(id,'cancelar');
 window.adminTabelaExtras=adminTabelaExtras=function(requests,jobs){
  if(!requests.length)return '<div class="vagas-vazio">Nenhuma solicitação registrada no Supabase.</div>';
  return '<div class="admin-lista">'+requests.map(r=>{const job=jobs.find(v=>String(v.id)===String(r.vagaId)),pending=r.status==='aguardando_pagamento',eligible=job&&job.status==='aprovada'&&available(job);return '<div class="admin-linha"><div><strong>'+esc(types[r.tipo]?.name||r.tipo)+'</strong><small>'+esc(job?tituloVaga(job):'Vaga indisponível')+' · '+money(r.valor)+' · '+esc({aguardando_pagamento:'Aguardando confirmação',ativo:'Ativo',cancelado:'Cancelado'}[r.status]||r.status)+'</small></div><div class="admin-empresa-resumo">'+(pending?'<button class="btn" '+(eligible?'':'disabled')+' onclick="adminAtivarExtra(\''+r.id+'\')">Confirmar pagamento e ativar</button><button class="btn" onclick="adminRejeitarExtra(\''+r.id+'\')">Cancelar solicitação</button>':'')+'</div></div>';}).join('')+'</div>';
 };
})();
