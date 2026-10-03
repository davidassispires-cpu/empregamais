import { renderEmpresaDashboard,hydrateEmpresaDashboard } from './pages/empresa-dashboard.js';

const routes = {
  'painel-empresa': renderEmpresaDashboard,
  'vagas-empresa': renderEmpresaDashboard
};

function router(){
  const pagina=new URLSearchParams(location.search).get('pagina')||'painel-empresa';
  const render=routes[pagina]||renderEmpresaDashboard;
  document.querySelector('#app').innerHTML=render();
  if(pagina==='painel-empresa'||pagina==='vagas-empresa')hydrateEmpresaDashboard();
}
addEventListener('popstate',router);
router();
