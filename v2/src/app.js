import { renderEmpresaDashboard,hydrateEmpresaDashboard } from './pages/empresa-dashboard.js';
import { renderJobForm,hydrateJobForm } from './pages/job-form.js';
import { renderCandidates,hydrateCandidates } from './pages/candidates.js';

const routes={
 'painel-empresa':[renderEmpresaDashboard,hydrateEmpresaDashboard],
 'vagas-empresa':[renderEmpresaDashboard,hydrateEmpresaDashboard],
 'publicar-vaga':[renderJobForm,hydrateJobForm],
 'candidatos-empresa':[renderCandidates,hydrateCandidates]
};
async function router(){
 const pagina=new URLSearchParams(location.search).get('pagina')||'painel-empresa',route=routes[pagina]||routes['painel-empresa'];
 document.querySelector('#app').innerHTML=route[0]();
 await route[1]?.();
}
addEventListener('popstate',router);router();
