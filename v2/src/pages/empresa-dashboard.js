import { EmpresaHeader } from '../ui/empresa-header.js';
import { KpiCard } from '../ui/kpi-card.js';
import { getCompany,getCompanyJobs,jobStatus } from '../services/supabase.js';

export function renderEmpresaDashboard(){
 return `<main class="page">${EmpresaHeader()}<section id="kpis" class="kpis"><article class="kpi"><span>CARREGANDO</span><strong>—</strong><small>Buscando dados reais</small></article></section><section class="panel"><div class="panel-title"><div><h2>Minhas vagas</h2><p>Dados carregados diretamente do Supabase.</p></div></div><div id="jobs"><p>Carregando vagas...</p></div></section></main>`;
}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
export async function hydrateEmpresaDashboard(){
 const k=document.querySelector('#kpis'),jobs=document.querySelector('#jobs');if(!k||!jobs)return;
 try{
  const company=await getCompany();
  if(!company){k.innerHTML='';jobs.innerHTML='<div class="empty"><strong>Sessão empresarial necessária</strong><p>Entre pela versão atual do portal para autenticar a empresa. A V2 reutiliza a mesma sessão segura do Supabase.</p></div>';return}
  const vs=await getCompanyJobs(company);
  const ativa=vs.filter(v=>jobStatus(v)==='Ativa').length,analise=vs.filter(v=>jobStatus(v)==='Em análise').length,enc=vs.filter(v=>jobStatus(v)==='Encerrada').length;
  const destaque=vs.filter(v=>jobStatus(v)==='Ativa'&&(v.destaque===true||v.em_destaque===true)).length;
  const urgente=vs.filter(v=>jobStatus(v)==='Ativa'&&(v.urgente===true||v.urgencia===true)).length;
  const confid=vs.filter(v=>jobStatus(v)==='Ativa'&&v.confidencial===true).length;
  const cards=[['Vagas ativas no site',ativa,'Publicadas no portal'],['Em análise',analise,'Aguardando publicação'],['Vagas encerradas',enc,'Processos finalizados'],['Vagas em destaque',destaque+' em uso','Vagas ativas'],['Vagas com urgência',urgente+' em uso','Vagas ativas'],['Vagas confidenciais',confid+' em uso','Vagas ativas']];
  k.innerHTML=cards.map(c=>KpiCard(...c)).join('');
  jobs.innerHTML=vs.length?'<div class="jobs-list">'+vs.map(v=>`<article class="job-row"><div><strong>${esc(v.titulo||v.cargo||'Vaga')}</strong><small>${esc([v.cidade,v.uf||v.estado].filter(Boolean).join(' - ')||'Localização não informada')}</small></div><span class="status">${jobStatus(v)}</span></article>`).join('')+'</div>':'<div class="empty"><strong>Nenhuma vaga encontrada</strong><p>As novas vagas da empresa aparecerão aqui.</p></div>';
 }catch(e){console.error(e);jobs.innerHTML='<div class="empty error"><strong>Não foi possível carregar as vagas</strong><p>'+esc(e.message)+'</p></div>'}
}
