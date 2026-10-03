import { renderEmpresaDashboard,hydrateEmpresaDashboard } from './pages/empresa-dashboard.js';
import { renderJobForm,hydrateJobForm } from './pages/job-form.js';
import { renderCandidates,hydrateCandidates } from './pages/candidates.js';
import { renderCompanyHome,hydrateCompanyHome } from './pages/company-home.js';
import { CompanyShell,bindCompanyShell } from './ui/company-shell.js';
import { renderCompanyProfile,hydrateCompanyProfile } from './pages/company-profile.js';
import { renderPlans,hydratePlans } from './pages/plans.js';
import { renderLogin,hydrateLogin } from './pages/login.js';
import { renderRegister,hydrateRegister } from './pages/register.js';
import { renderResetPassword,hydrateResetPassword } from './pages/reset-password.js';
import { getCompany,getCompanyJobs,planUsage,logoutCompany } from './services/supabase.js';

const routes={'painel-empresa':[renderCompanyHome,hydrateCompanyHome],'vagas-empresa':[renderEmpresaDashboard,hydrateEmpresaDashboard],'publicar-vaga':[renderJobForm,hydrateJobForm],'candidatos-empresa':[renderCandidates,hydrateCandidates],'minha-empresa':[renderCompanyProfile,hydrateCompanyProfile],'planos':[renderPlans,hydratePlans]};
async function router(){
 const pagina=new URLSearchParams(location.search).get('pagina')||'painel-empresa',app=document.querySelector('#app');
 if(pagina==='login-empresa'){app.innerHTML=renderLogin();await hydrateLogin();return}
 if(pagina==='cadastro-empresa'){app.innerHTML=renderRegister();hydrateRegister();return}
 if(pagina==='redefinir-senha'){app.innerHTML=renderResetPassword();hydrateResetPassword();return}
 let company=null;try{company=await getCompany()}catch{}
 if(pagina==='publicar-vaga'&&company&&!new URLSearchParams(location.search).get('editar')){try{const usage=planUsage(company,await getCompanyJobs(company));if(usage.expirado&&usage.plano.nome!=='Grátis'){location.replace('./?pagina=planos');return}}catch{}}
 if(!company){location.replace('./?pagina=login-empresa');return}
 const route=routes[pagina]||routes['painel-empresa'];app.innerHTML=CompanyShell(route[0](),pagina);
 bindCompanyShell(async()=>{await logoutCompany();location.replace('./?pagina=login-empresa')});try{const usage=planUsage(company,await getCompanyJobs(company));if(usage.expirado&&usage.plano.nome!=='Grátis'){document.querySelectorAll('.top-publish').forEach(a=>{a.href='./?pagina=planos';a.textContent='Renovar plano';a.title='Seu plano venceu. Renove para publicar novas vagas.'})}}catch{}await route[1]?.();
}
addEventListener('popstate',router);router();
