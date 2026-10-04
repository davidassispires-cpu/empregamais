/* Administrative pages require a validated Supabase administrator session. */
(function(){
 'use strict';
 const oldToken=adminSbToken;
 window.adminSbToken=adminSbToken=async function(){
  const token=await oldToken();
  const allowed=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/rpc/is_admin',{method:'POST',headers:sbHeadersEM(token),body:'{}'});
  if(allowed!==true)throw Error('Acesso administrativo não autorizado.');return token;
 };
 const oldRoute=abrirRota;
 window.abrirRota=abrirRota=async function(page){
  if(!['painel-admin','admin-visualizador'].includes(page))return oldRoute(page);
  try{await adminSbToken();return oldRoute(page);}catch(error){sessionStorage.removeItem('empregaMaisAdmin');history.replaceState({},'',location.pathname+'?pagina=login-admin');mostrarToast('Entre com uma conta administrativa autorizada.');return oldRoute('login-admin');}
 };
 window.adminConcederPlano=adminConcederPlano=async function(cnpj){
  const company=ler('empregaMaisEmpresas').find(e=>nums(e.cnpj)===nums(cnpj));if(!company?.id){mostrarToast('Empresa não encontrada no Supabase.');return;}
  const plan=document.getElementById('adminPlano_'+nums(cnpj))?.value,days=Number(document.getElementById('adminVigencia_'+nums(cnpj))?.value||30);
  try{const token=await adminSbToken();await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/rpc/admin_conceder_plano_portal',{method:'POST',headers:sbHeadersEM(token),body:JSON.stringify({p_empresa_id:company.id,p_plano:plan,p_dias:days})});await adminCarregarEmpresasSupabaseEM();await adminAba('empresas');mostrarToast('Plano registrado no Supabase.');}catch(error){mostrarToast('Não foi possível conceder o plano: '+error.message);}
 };
 async function updateCompany(cnpj,change){
  const company=ler('empregaMaisEmpresas').find(e=>nums(e.cnpj)===nums(cnpj));if(!company?.id)throw Error('Empresa não encontrada no Supabase.');
  const token=await adminSbToken();
  const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/empresas?id=eq.'+encodeURIComponent(company.id),{method:'PATCH',headers:{...sbHeadersEM(token),Prefer:'return=representation'},body:JSON.stringify(change(company))});
  if(!Array.isArray(rows)||!rows[0])throw Error('O servidor não confirmou a atualização.');
  await adminCarregarEmpresasSupabaseEM();return company;
 }
 window.adminConcederRecurso=adminConcederRecurso=async function(cnpj,type){
  if(!['vagas','destaques','urgentes','confidenciais'].includes(type))return;
  try{await updateCompany(cnpj,c=>({recursos_admin:{...(c.recursosAdmin||{}),[type]:Number(c.recursosAdmin?.[type]||0)+1}}));await adminHistoricoRegistrar('Recurso concedido',cnpj+' · '+type);mostrarToast('Recurso registrado no Supabase.');}catch(error){mostrarToast(error.message);}
 };
 window.adminAlternarEmpresa=adminAlternarEmpresa=async function(cnpj){
  try{const company=await updateCompany(cnpj,c=>({suspensa_admin:!c.suspensaAdmin}));await adminHistoricoRegistrar(company.suspensaAdmin?'Empresa reativada':'Empresa suspensa',cnpj);await adminAba('empresas');mostrarToast('Situação da empresa atualizada.');}catch(error){mostrarToast(error.message);}
 };
 window.adminHistoricoRegistrar=adminHistoricoRegistrar=async function(action,detail){
  try{const token=await adminSbToken();const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/historico_administrativo',{method:'POST',headers:{...sbHeadersEM(token),Prefer:'return=representation'},body:JSON.stringify({acao:String(action).slice(0,200),detalhe:String(detail||'').slice(0,4000)})});if(!rows?.[0])throw Error('Registro não confirmado.');
   const row=rows[0];gravar('empregaMaisHistoricoAdmin',[{id:row.id,acao:row.acao,detalhe:row.detalhe,data:row.criado_em,admin:sessionStorage.getItem('empregaMaisAdminEmail')||'Administrador'},...ler('empregaMaisHistoricoAdmin')].slice(0,300));
  }catch(error){console.warn('O histórico administrativo não foi atualizado.',error);}
 };
 const oldSync=adminSincronizarPainelSupabase;
 window.adminSincronizarPainelSupabase=adminSincronizarPainelSupabase=async function(){
  const token=await adminSbToken();
  const okay=await oldSync();
  const [applications,audit]=await Promise.all([sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/candidaturas?select=*&order=criado_em.desc',{headers:sbHeadersEM(token)}),sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/historico_administrativo?select=*&order=criado_em.desc&limit=300',{headers:sbHeadersEM(token)})]);
  sbEspelharCandidaturasEM(applications.map(sbMapCandidaturaEM));
  gravar('empregaMaisHistoricoAdmin',audit.map(row=>({id:row.id,acao:row.acao,detalhe:row.detalhe,data:row.criado_em,admin:'Administrador'})));return okay;
 };
 const oldTab=adminAba;
 window.adminAba=adminAba=async function(tab,button){
  try{const token=await adminSbToken();const result=await oldTab(tab,button);
   if(['planos','assinaturas','geral'].includes(tab)){
    const requests=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/solicitacoes_planos?select=*&order=criado_em.desc&limit=200',{headers:sbHeadersEM(token)});
    document.getElementById('portalPlanRequestsAdmin')?.remove();const box=document.createElement('section');box.id='portalPlanRequestsAdmin';box.className='portal-plan-requests';
    box.innerHTML='<h3>Solicitações de planos</h3><p>Pedidos registrados no Supabase. A solicitação não confirma pagamento ou assinatura.</p>'+(requests.length?requests.map(r=>{const company=ler('empregaMaisEmpresas').find(e=>String(e.id)===String(r.empresa_id)),candidate=ler('empregaMaisCandidatos').find(c=>String(c.userId)===String(r.user_id));return '<article><div><strong>'+esc(company?.nome||candidate?.nome||'Solicitante')+'</strong><p>'+esc(r.tipo)+' · '+esc(r.plano)+' · '+Number(r.valor).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})+'</p></div><span>'+esc(r.status.replaceAll('_',' '))+'</span></article>';}).join(''):'<p>Nenhuma solicitação registrada.</p>');document.getElementById('adminConteudo')?.appendChild(box);
   }return result;
  }catch(error){mostrarToast('Não foi possível carregar a administração: '+error.message);}
 };
})();
