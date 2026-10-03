import { EmpresaHeader } from '../ui/empresa-header.js';
import { KpiCard } from '../ui/kpi-card.js';
import { getCompany,getCompanyJobs,jobStatus } from '../services/supabase.js';

let jobsCache=[];
export function renderEmpresaDashboard(){
 return `<main class="page">${EmpresaHeader()}<section id="kpis" class="kpis"><article class="kpi"><span>CARREGANDO</span><strong>—</strong><small>Buscando dados reais</small></article></section><section class="panel"><div class="panel-title"><div><h2>Minhas vagas</h2><p>Gerencie, pesquise e acompanhe suas oportunidades.</p></div></div><div class="toolbar"><label class="search"><span>⌕</span><input id="jobSearch" placeholder="Buscar por vaga ou localização"></label><select id="jobStatusFilter"><option value="">Todos os status</option><option>Ativa</option><option>Em análise</option><option>Encerrada</option></select><select id="jobOrder"><option value="recent">Mais recentes</option><option value="az">A–Z</option></select></div><div class="table-head"><span>VAGA</span><span>STATUS</span><span>CANDIDATURAS</span><span>VISUALIZAÇÕES</span><span>AÇÕES</span></div><div id="jobs"><p>Carregando vagas...</p></div></section></main>`;
}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function val(v,...keys){for(const k of keys)if(v?.[k]!=null)return v[k];return ''}
function renderRows(){
 const box=document.querySelector('#jobs');if(!box)return;
 const q=(document.querySelector('#jobSearch')?.value||'').trim().toLowerCase(),st=document.querySelector('#jobStatusFilter')?.value||'',ord=document.querySelector('#jobOrder')?.value||'recent';
 let vs=jobsCache.filter(v=>{const txt=[val(v,'titulo','cargo'),v.cidade,val(v,'uf','estado')].join(' ').toLowerCase();return(!q||txt.includes(q))&&(!st||jobStatus(v)===st)});
 if(ord==='az')vs.sort((a,b)=>String(val(a,'titulo','cargo')).localeCompare(String(val(b,'titulo','cargo')),'pt-BR'));
 box.innerHTML=vs.length?vs.map(v=>`<article class="job-row"><div class="job-main"><strong>${esc(val(v,'titulo','cargo')||'Vaga')}</strong><small>${esc([v.cidade,val(v,'uf','estado')].filter(Boolean).join(' - ')||'Localização não informada')} · ${esc(v.modalidade||'Modalidade não informada')}</small></div><span class="status status-${jobStatus(v).toLowerCase().replaceAll(' ','-').replace('á','a')}">${jobStatus(v)}</span><div class="metric"><strong>${esc(val(v,'candidaturas_count','total_candidaturas')||0)}</strong><small>Candidaturas</small></div><div class="metric"><strong>${esc(val(v,'visualizacoes','views')||0)}</strong><small>Visualizações</small></div><div class="actions"><a href="./?pagina=candidatos-empresa&vaga=${encodeURIComponent(v.id||'')}" class="action primary">Gerenciar</a><a href="./?pagina=publicar-vaga&editar=${encodeURIComponent(v.id||'')}" class="action">Editar</a><button class="action more" type="button" data-job="${esc(v.id||'')}">•••</button></div></article>`).join(''):'<div class="empty"><strong>Nenhuma vaga encontrada</strong><p>Ajuste os filtros ou publique uma nova oportunidade.</p></div>';
}
export async function hydrateEmpresaDashboard(){
 const k=document.querySelector('#kpis'),jobs=document.querySelector('#jobs');if(!k||!jobs)return;
 try{
  const company=await getCompany();
  if(!company){k.innerHTML='';jobs.innerHTML='<div class="empty"><strong>Sessão empresarial necessária</strong><p>Entre pela versão atual do portal para autenticar a empresa. A V2 reutiliza a mesma sessão do Supabase.</p></div>';return}
  jobsCache=await getCompanyJobs(company);
  const ativa=jobsCache.filter(v=>jobStatus(v)==='Ativa').length,analise=jobsCache.filter(v=>jobStatus(v)==='Em análise').length,enc=jobsCache.filter(v=>jobStatus(v)==='Encerrada').length;
  const destaque=jobsCache.filter(v=>jobStatus(v)==='Ativa'&&(v.destaque===true||v.em_destaque===true)).length,urgente=jobsCache.filter(v=>jobStatus(v)==='Ativa'&&(v.urgente===true||v.urgencia===true)).length,confid=jobsCache.filter(v=>jobStatus(v)==='Ativa'&&v.confidencial===true).length;
  k.innerHTML=[['Vagas ativas no site',ativa,'Publicadas no portal'],['Em análise',analise,'Aguardando publicação'],['Vagas encerradas',enc,'Processos finalizados'],['Vagas em destaque',destaque+' em uso','Vagas ativas'],['Vagas com urgência',urgente+' em uso','Vagas ativas'],['Vagas confidenciais',confid+' em uso','Vagas ativas']].map(c=>KpiCard(...c)).join('');
  renderRows();
  document.querySelector('#jobSearch').oninput=renderRows;document.querySelector('#jobStatusFilter').onchange=renderRows;document.querySelector('#jobOrder').onchange=renderRows;
 }catch(e){console.error(e);jobs.innerHTML='<div class="empty error"><strong>Não foi possível carregar as vagas</strong><p>'+esc(e.message)+'</p></div>'}
}