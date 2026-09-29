/* EMPREGAMAIS - VISAO GERAL REFINO VISUAL V1 */
(function(){
'use strict';

function carregarMontserratEM(){
 if(document.getElementById('emMontserratFont'))return;
 const link=document.createElement('link');
 link.id='emMontserratFont';
 link.rel='stylesheet';
 link.href='https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap';
 document.head.appendChild(link);
}

function aplicarRefinoVisaoGeralEM(){
 if(document.getElementById('emVisaoGeralRefinoV1'))return;
 carregarMontserratEM();
 const st=document.createElement('style');
 st.id='emVisaoGeralRefinoV1';
 st.textContent=`
 #pagina-painel-empresa,
 #pagina-painel-empresa button,
 #pagina-painel-empresa input,
 #pagina-painel-empresa select,
 #pagina-painel-empresa textarea{font-family:'Montserrat','Segoe UI',Arial,sans-serif!important}

 #pagina-painel-empresa{font-weight:400!important;color:#173b4d!important}
 #pagina-painel-empresa p,
 #pagina-painel-empresa small,
 #pagina-painel-empresa span{font-weight:400}
 #pagina-painel-empresa h1,
 #pagina-painel-empresa h2,
 #pagina-painel-empresa h3,
 #pagina-painel-empresa strong{font-weight:600!important;letter-spacing:-.015em}

 /* Indicadores principais: menos linhas e mais respiro */
 #empresaMetricasNovas{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:14px!important;background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important}
 #empresaMetricasNovas>button{position:relative!important;min-height:124px!important;padding:20px 18px!important;border:1px solid #e3ebef!important;border-radius:18px!important;background:#fff!important;box-shadow:0 7px 22px rgba(31,65,82,.055)!important;text-align:left!important;overflow:hidden!important;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease!important}
 #empresaMetricasNovas>button:hover{transform:translateY(-2px)!important;border-color:#cedde4!important;box-shadow:0 12px 28px rgba(31,65,82,.085)!important}
 #empresaMetricasNovas>button:before,
 #empresaMetricasNovas>button:after{display:none!important}
 #empresaMetricasNovas>button>*{border:0!important}
 #empresaMetricasNovas .kpi-num{display:block!important;margin:7px 0 5px!important;font-size:32px!important;line-height:1!important;font-weight:600!important;letter-spacing:-.045em!important;color:#153f55!important}
 #empresaMetricasNovas>button div>span{display:block!important;margin:0 0 8px!important;font-size:12px!important;line-height:1.25!important;font-weight:500!important;color:#4c6776!important}
 #empresaMetricasNovas>button div>small{display:block!important;font-size:10.5px!important;line-height:1.4!important;color:#81939d!important}
 #empresaMetricasNovas>button i{opacity:.82!important;border:0!important;box-shadow:none!important}

 /* Plano atual: uma superfície principal, sem grade de divisórias pesadas */
 #empresaResumoRecursos{border:1px solid #e4ecef!important;border-radius:20px!important;background:#fff!important;box-shadow:0 8px 26px rgba(31,65,82,.055)!important;overflow:hidden!important}
 #empresaResumoRecursos .emp-plan-head{padding:24px 26px 20px!important;border:0!important;border-bottom:1px solid #eef2f4!important;background:#fff!important}
 #empresaResumoRecursos .emp-plan-head span{font-size:10px!important;letter-spacing:.13em!important;color:#66808e!important}
 #empresaResumoRecursos .emp-plan-head h2{margin:5px 0 7px!important;font-size:22px!important;line-height:1.2!important;color:#173e52!important}
 #empresaResumoRecursos .emp-plan-head p{margin:0!important;font-size:12px!important;line-height:1.55!important;color:#758a96!important}
 #empresaResumoRecursos .emp-plan-head button{min-height:40px!important;padding:0 15px!important;border:1px solid #d9e5ea!important;border-radius:10px!important;background:#fff!important;color:#1e6178!important;font-size:11px!important;font-weight:500!important;box-shadow:none!important}
 #empresaResumoRecursos .emp-plan-usage{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important;padding:20px 24px 24px!important;background:#fff!important}
 #empresaResumoRecursos .emp-plan-usage>div{padding:16px 17px!important;border:0!important;border-radius:14px!important;background:#f7fafb!important;box-shadow:none!important}
 #empresaResumoRecursos .emp-plan-usage>div>span{font-size:10.5px!important;color:#6d8491!important}
 #empresaResumoRecursos .emp-plan-usage>div>strong{display:block!important;margin:7px 0 10px!important;font-size:21px!important;color:#173f53!important}
 #empresaResumoRecursos .emp-plan-usage>div>i{height:5px!important;border:0!important;border-radius:999px!important;background:#e7eef1!important;overflow:hidden!important}
 #empresaResumoRecursos .emp-plan-usage>div>em{margin-top:8px!important;font-size:9.5px!important;font-style:normal!important;color:#82949e!important}
 #empresaResumoRecursos .emp-plan-usage>ul{grid-column:1/-1!important;display:flex!important;flex-wrap:wrap!important;gap:8px 18px!important;margin:4px 0 0!important;padding:0!important;border:0!important;list-style:none!important}
 #empresaResumoRecursos .emp-plan-usage>ul li{padding:0!important;border:0!important;background:transparent!important;font-size:10.5px!important;color:#607884!important}

 /* Blocos da visão geral: borda sutil, sem efeito de tabela */
 #pagina-painel-empresa .emp-open-vagas,
 #pagina-painel-empresa #empresaAtalhos,
 #pagina-painel-empresa .emp-performance,
 #pagina-painel-empresa .emp-recent-activity{border-color:#e5ecef!important;box-shadow:0 7px 24px rgba(31,65,82,.045)!important}

 #pagina-painel-empresa .emp-open-vagas{border-radius:20px!important}
 #pagina-painel-empresa .emp-open-vagas-head{border-bottom:0!important;padding-bottom:8px!important;margin-bottom:18px!important}
 #pagina-painel-empresa .emp-open-vagas-head h2{font-size:23px!important;font-weight:600!important}
 #pagina-painel-empresa .emp-open-vagas-head p{font-size:11.5px!important;font-weight:400!important;line-height:1.55!important;color:#748994!important}

 /* Remove aparência excessivamente pesada em linhas e cards internos */
 #pagina-painel-empresa .empresa-vaga-linha,
 #pagina-painel-empresa .empresa-candidato-linha{border-color:#edf2f4!important;box-shadow:none!important}
 #pagina-painel-empresa .empresa-vaga-linha strong,
 #pagina-painel-empresa .empresa-candidato-linha strong{font-weight:500!important}

 @media(max-width:1180px){
  #empresaMetricasNovas{grid-template-columns:repeat(3,minmax(0,1fr))!important}
 }
 @media(max-width:820px){
  #empresaMetricasNovas{grid-template-columns:repeat(2,minmax(0,1fr))!important}
  #empresaResumoRecursos .emp-plan-usage{grid-template-columns:1fr!important}
  #empresaResumoRecursos .emp-plan-usage>ul{grid-column:1!important}
 }
 @media(max-width:540px){
  #pagina-painel-empresa{font-size:14px!important}
  #empresaMetricasNovas{grid-template-columns:1fr!important;gap:11px!important}
  #empresaMetricasNovas>button{min-height:104px!important;padding:17px!important;border-radius:15px!important}
  #empresaMetricasNovas .kpi-num{font-size:29px!important}
  #empresaResumoRecursos{border-radius:16px!important}
  #empresaResumoRecursos .emp-plan-head{padding:20px!important}
  #empresaResumoRecursos .emp-plan-usage{padding:16px 18px 20px!important}
 }
 `;
 document.head.appendChild(st);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',aplicarRefinoVisaoGeralEM);
else aplicarRefinoVisaoGeralEM();
window.aplicarRefinoVisaoGeralEM=aplicarRefinoVisaoGeralEM;
})();
