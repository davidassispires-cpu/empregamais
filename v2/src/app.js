import { renderEmpresaDashboard,hydrateEmpresaDashboard } from './pages/empresa-dashboard.js';
import { renderJobForm,hydrateJobForm } from './pages/job-form.js';
import { renderCandidates,hydrateCandidates } from './pages/candidates.js';
import { renderCompanyHome,hydrateCompanyHome } from './pages/company-home.js';
import { CompanyShell,bindCompanyShell } from './ui/company-shell.js';
import { renderCompanyProfile,hydrateCompanyProfile } from './pages/company-profile.js';
import { renderPlans,hydratePlans } from './pages/plans.js';
import { renderLogin,hydrateLogin } from './pages/login.js';
import { getCompany,logoutCompany } from './services/supabase.js';

const routes={'painel-empresa':[renderCompanyHome,hydrateCompanyHome],'vagas-empresa':[renderEmpresaDashboard,hydrateEmpresaDashboard],'publicar-vaga':[renderJobForm,hydrateJobForm],'candidatos-empresa':[renderCandidates,hydrateCandidates],'minha-empresa':[renderCompanyProfile,hydrateCompanyProfile],'planos':[renderPlans,hydratePlans]};
async function router(){
 const pagina=new URLSearchParams(location.search).get('pagina')||'painel-empresa',app=document.querySelector('#app');
 if(pagina==='login-empresa'){app.innerHTML=renderLogin();await hydrateLogin();return}
 let company=null;try{company=await getCompany()}catch{}
 if(!company){location.replace('./?pagina=login-empresa');return}
 const route=routes[pagina]||routes['painel-empresa'];app.innerHTML=CompanyShell(route[0](),pagina);
 bindCompanyShell(async()=>{await logoutCompany();location.replace('./?pagina=login-empresa')});await route[1]?.();
}
addEventListener('popstate',router);router();
