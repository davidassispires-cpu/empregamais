import { renderEmpresaDashboard,hydrateEmpresaDashboard } from './pages/empresa-dashboard.js';
import { renderJobForm,hydrateJobForm } from './pages/job-form.js';
import { renderCandidates,hydrateCandidates } from './pages/candidates.js';
import { renderCompanyHome,hydrateCompanyHome } from './pages/company-home.js';
import { CompanyShell,bindCompanyShell } from './ui/company-shell.js';

const routes={
 'painel-empresa':[renderCompanyHome,hydrateCompanyHome],
 'vagas-empresa':[renderEmpresaDashboard,hydrateEmpresaDashboard],
 'publicar-vaga':[renderJobForm,hydrateJobForm],
 'candidatos-empresa':[renderCandidates,hydrateCandidates]
};
async function router(){
 const pagina=new URLSearchParams(location.search).get('pagina')||'painel-empresa',route=routes[pagina]||routes['painel-empresa'];
 document.querySelector('#app').innerHTML=CompanyShell(route[0](),pagina);
 bindCompanyShell();await route[1]?.();
}
addEventListener('popstate',router);router();
