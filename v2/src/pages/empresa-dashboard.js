import { EmpresaHeader } from '../ui/empresa-header.js';
import { KpiCard } from '../ui/kpi-card.js';

export function renderEmpresaDashboard(){
 const cards=[
  ['Vagas ativas no site','17','Publicadas no portal'],
  ['Em análise','1','Aguardando publicação'],
  ['Vagas encerradas','78','Processos finalizados'],
  ['Vagas em destaque','7 em uso','Vagas ativas'],
  ['Vagas com urgência','4 em uso','Vagas ativas'],
  ['Vagas confidenciais','1 em uso','Vagas ativas']
 ];
 return `<main class="page">${EmpresaHeader()}<section class="kpis">${cards.map(c=>KpiCard(...c)).join('')}</section><section class="panel"><h2>Minhas vagas</h2><p>A estrutura V2 está isolada do código legado. A próxima etapa conecta estes componentes aos dados reais do Supabase.</p></section></main>`;
}
