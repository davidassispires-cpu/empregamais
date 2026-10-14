(function(){
 'use strict';
 var workflow=window.EmpregaMaisEtapasCandidatura;
 var stages=[{key:'todas',label:'Enviadas',filterLabel:'Todas',icon:'send'}].concat(workflow.etapas);
 function validStage(key){return workflow.filtro(key);}
 function currentStage(){return validStage(new URLSearchParams(location.search).get('etapaCandidatura'));}
 function belongs(application){var email=String(sessionStorage.getItem('candidatoEmail')||'').trim().toLowerCase(),owner=String(application.email||application.candidatoEmail||application.emailCandidato||application.candidato_email||'').trim().toLowerCase();return !!email&&owner===email;}
 function classify(application){
  return workflow.classificar(application);
 }
 function label(application){var stage=workflow.etapa(application);return stage?stage.label:String(application.status||application.statusProcesso||application.status_processo||'Em avaliação');}
 function matches(application,key){key=validStage(key==null?currentStage():key);return key==='todas'||classify(application)===key;}
 function applications(){try{var list=typeof window.carregarCandidaturas==='function'?window.carregarCandidaturas():[];return Array.isArray(list)?list.filter(belongs):[];}catch(ignore){return [];}}
 function counts(list){var result={todas:list.length,avaliacao:0,contato:0,entrevista:0,aprovadas:0,contratadas:0,reprovadas:0};list.forEach(function(application){var key=classify(application);if(key!=='outras')result[key]++;});return result;}
 function description(total,key){var one=total===1,end={todas:one?'enviada':'enviadas',avaliacao:'em avaliação',contato:'em contato',entrevista:'com entrevista agendada',aprovadas:one?'aprovada':'aprovadas',contratadas:one?'com contratação':'com contratações',reprovadas:one?'reprovada':'reprovadas'};return total+' '+(one?'candidatura':'candidaturas')+' '+end[validStage(key)];}
 function icon(name){var paths={send:'<path d="m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',check:'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m7 12 3 3 7-7"/>',flag:'<path d="M5 21V3m0 1h13l-2 5 2 5H5"/>',arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>'};paths.message='<path d="M21 11a8 8 0 0 1-8 8H5l-3 3V11a9 9 0 0 1 18 0Z"/><path d="M7 10h10M7 14h6"/>';paths.calendar='<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 11h18m-13 5 2 2 4-4"/>';paths.briefcase='<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V4h8v3M3 12h18M10 12v3h4v-3"/>';paths.close='<circle cx="12" cy="12" r="9"/><path d="m8 8 8 8m0-8-8 8"/>';return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[name]+'</svg>';}
 function setStage(key,push){var url=new URL(location.href);url.searchParams.set('etapaCandidatura',validStage(key));history[push?'pushState':'replaceState']({},'',url.toString());if(typeof window.renderizarCandidaturas==='function')window.renderizarCandidaturas();}
 function openStage(key){if(typeof window.irPara==='function')window.irPara('candidaturas');setStage(key,false);var heading=document.querySelector('#pagina-candidaturas .page-header');if(heading)heading.scrollIntoView({block:'start',behavior:'auto'});}
 function renderSummary(slot){
  if(!slot)return;
  var legacy=slot.querySelector('.metricas');if(legacy){legacy.hidden=true;legacy.setAttribute('aria-hidden','true');}
  var summary=slot.querySelector('.cp-application-summary');
  if(!summary){
   summary=document.createElement('section');summary.className='cp-application-summary';summary.setAttribute('aria-label','Resumo das candidaturas');
   summary.innerHTML='<div class="cp-application-heading"><h2>Candidaturas</h2><button type="button" class="cp-application-all" data-cp-stage="todas">Ver todas '+icon('arrow')+'</button></div><div class="cp-application-stages">'+stages.map(function(stage){return '<button type="button" class="cp-stage-card" data-cp-stage="'+stage.key+'"><span class="cp-stage-icon">'+icon(stage.icon)+'</span><strong data-cp-count="'+stage.key+'">0</strong><span class="cp-stage-label">'+stage.label+'</span><span class="cp-stage-arrow">'+icon('arrow')+'</span></button>';}).join('')+'</div>';
   summary.addEventListener('click',function(event){var button=event.target.closest('[data-cp-stage]');if(button&&summary.contains(button))openStage(button.dataset.cpStage);});slot.prepend(summary);
  }
  var totals=counts(applications());stages.forEach(function(stage){var number=summary.querySelector('[data-cp-count="'+stage.key+'"]'),text=String(totals[stage.key]);if(number.textContent!==text)number.textContent=text;var button=number.closest('button');button.setAttribute('aria-label',description(totals[stage.key],stage.key)+'. Ver candidaturas.');});
 }
 function prepareList(){
  var list=document.getElementById('listaCandidaturas');if(!list)return;
  var toolbar=document.getElementById('cpApplicationFilters');if(toolbar)return;
  toolbar=document.createElement('section');toolbar.id='cpApplicationFilters';toolbar.className='cp-application-filters';toolbar.setAttribute('aria-label','Filtrar candidaturas por etapa');
  toolbar.innerHTML='<div class="cp-application-filter-buttons">'+stages.map(function(stage){return '<button type="button" data-cp-filter="'+stage.key+'" aria-controls="listaCandidaturas" aria-pressed="false"><strong data-cp-filter-count="'+stage.key+'">0</strong><span>'+(stage.filterLabel||stage.label)+'</span></button>';}).join('')+'</div><div class="cp-application-result-row"><p id="cpApplicationResult" role="status" aria-live="polite"></p><div class="cp-application-sync"><span id="cpApplicationSyncState" role="status" aria-live="polite"></span><button type="button" id="cpApplicationRefresh">Atualizar</button></div></div>';
  toolbar.addEventListener('click',function(event){var button=event.target.closest('[data-cp-filter]');if(button&&toolbar.contains(button))setStage(button.dataset.cpFilter,true);});
  toolbar.querySelector('#cpApplicationRefresh').onclick=function(){if(window.EmpregaMaisCandidaturasCloud)window.EmpregaMaisCandidaturasCloud.sincronizar(true);};list.before(toolbar);
 }
 function updateList(total){prepareList();var toolbar=document.getElementById('cpApplicationFilters');if(!toolbar)return;var key=currentStage(),totals=counts(applications());toolbar.querySelectorAll('[data-cp-filter]').forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.cpFilter===key));button.querySelector('[data-cp-filter-count]').textContent=String(totals[button.dataset.cpFilter]);button.setAttribute('aria-label',description(totals[button.dataset.cpFilter],button.dataset.cpFilter));});var result=document.getElementById('cpApplicationResult'),text=description(total,key);if(result.textContent!==text)result.textContent=text;if(window.EmpregaMaisCandidaturasCloud)window.EmpregaMaisCandidaturasCloud.atualizarIndicador();}
 function emptyMessage(){return currentStage()==='todas'?'Você ainda não enviou candidaturas.':'Você ainda não tem candidaturas nesta etapa. Clique em Todas para consultar os demais processos.';}
 function refresh(){var slot=document.querySelector('#pagina-painel-candidato .cp-metrics-slot');if(slot)renderSummary(slot);var page=document.getElementById('pagina-candidaturas');if(page&&page.classList.contains('ativa')&&typeof window.renderizarCandidaturas==='function')window.renderizarCandidaturas();}
 window.EmpregaMaisCandidaturasCandidato={pertence:belongs,classificar:classify,rotulo:label,corresponde:matches,contar:counts,filtroAtual:currentStage,prepararLista:prepareList,atualizarLista:updateList,mensagemVazia:emptyMessage,atualizarResumo:renderSummary,abrir:openStage,atualizar:refresh};
 function start(){
  var style=document.createElement('style');style.id='cp-application-stages-style';style.textContent=`
  #pagina-painel-candidato.cp-reference .cp-profile .cp-metrics-slot>.metricas[hidden]{display:none!important}
  #pagina-painel-candidato #centralPremiumV93[hidden]{display:none!important}
  #pagina-painel-candidato .cp-application-summary{margin-top:18px;font-family:Montserrat,Arial,sans-serif}
  #pagina-painel-candidato .cp-application-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
  #pagina-painel-candidato .cp-application-heading h2{margin:0!important;font:700 15px/1.4 Montserrat,Arial,sans-serif!important;color:#241b39!important}
  #pagina-painel-candidato .cp-profile .cp-application-all{display:inline-flex!important;align-items:center;gap:5px;padding:4px 0!important;font:600 11px/1.5 Montserrat,Arial,sans-serif!important}
  #pagina-painel-candidato .cp-application-all svg{width:14px;height:14px}
  #pagina-painel-candidato .cp-application-stages{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  #pagina-painel-candidato .cp-profile .cp-stage-card{display:grid!important;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:9px 8px;min-width:0;width:100%;min-height:86px;padding:12px 14px!important;background:#fff!important;border:1px solid #e3dbea!important;border-radius:10px!important;text-align:left;color:#51258a!important;box-shadow:none!important;transition:background .15s,border-color .15s,transform .15s;cursor:pointer}
  #pagina-painel-candidato .cp-profile .cp-stage-card[data-cp-stage=todas]{grid-column:1/-1;grid-template-columns:auto auto 1fr auto;min-height:56px;background:#f8f4fe!important;border-color:#dac9ed!important}
  #pagina-painel-candidato .cp-stage-icon{display:flex;align-items:center;color:#7951a3}
  #pagina-painel-candidato .cp-stage-icon svg{width:19px;height:19px}
  #pagina-painel-candidato .cp-stage-card strong{font:700 25px/1 Montserrat,Arial,sans-serif!important;color:#51258a!important}
  #pagina-painel-candidato .cp-stage-label{font:600 11px/1.4 Montserrat,Arial,sans-serif!important;color:#514261!important}
  #pagina-painel-candidato .cp-stage-arrow{display:flex;justify-content:flex-end;color:#9477b0}
  #pagina-painel-candidato .cp-stage-arrow svg{width:14px;height:14px}
  #pagina-painel-candidato .cp-profile .cp-stage-card:hover{background:#fbf8ff!important;border-color:#a57acb!important;transform:translateY(-1px)}
  #pagina-painel-candidato .cp-stage-card:focus-visible,#cpApplicationFilters button:focus-visible{outline:2px solid #7540ae!important;outline-offset:3px}
  #cpApplicationFilters{margin:0 0 20px;padding:16px 18px;border:1px solid #ded8e7;border-radius:12px;background:#fff;font-family:Montserrat,Arial,sans-serif}
  #pagina-candidaturas>.container-menor{max-width:1180px}
  #cpApplicationFilters .cp-application-filter-buttons{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:9px}
  #cpApplicationFilters [data-cp-filter]{display:flex;flex-direction:column;align-items:flex-start;justify-content:space-between;gap:10px;min-width:0;min-height:88px;text-align:left}
  #cpApplicationFilters [data-cp-filter] strong{font-size:24px;line-height:1}
  #cpApplicationFilters button{padding:9px 13px;border:1px solid #e3dbea;border-radius:8px;background:#fff;color:#665572;font:600 12px/1.4 Montserrat,Arial,sans-serif;cursor:pointer}
  #cpApplicationFilters button[aria-pressed=true]{background:#51258a;border-color:#51258a;color:#fff}
  #cpApplicationFilters .cp-application-result-row{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-top:14px}
  #cpApplicationResult{margin:0;color:#82718f;font:400 12px/1.5 Montserrat,Arial,sans-serif}
  #cpApplicationFilters .cp-application-sync{display:flex;align-items:center;flex-wrap:wrap;gap:10px;font:400 11px/1.5 Montserrat,Arial,sans-serif;color:#82718f}
  #cpApplicationRefresh{width:auto;min-height:34px}
  #cpApplicationRefresh:disabled{opacity:.6;cursor:wait}
  #pagina-candidaturas .candidatura-atualizacao{display:block;margin-top:5px;font-size:11px;color:#82718f}
  #pagina-candidaturas .status-processo{white-space:normal;text-align:center}
  @media(max-width:1000px){#cpApplicationFilters .cp-application-filter-buttons{grid-template-columns:repeat(4,minmax(0,1fr))}}
  @media(max-width:540px){#cpApplicationFilters{padding:14px}#cpApplicationFilters button{padding:9px 11px;font-size:11px}#cpApplicationFilters .cp-application-filter-buttons{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}#cpApplicationFilters [data-cp-filter]{min-height:76px;gap:6px}#cpApplicationFilters [data-cp-filter=todas]{grid-column:1/-1;flex-direction:row;align-items:center;justify-content:flex-start;gap:12px;min-height:50px}#cpApplicationFilters .cp-application-result-row{align-items:flex-start;flex-direction:column}#pagina-candidaturas .candidatura-top{gap:12px;flex-wrap:wrap}}
  @media(prefers-reduced-motion:reduce){#pagina-painel-candidato .cp-profile .cp-stage-card{transition:none}}
  `;document.head.appendChild(style);
  window.addEventListener('popstate',refresh);window.addEventListener('storage',refresh);document.addEventListener('empregamais:candidato-sincronizado',refresh);document.addEventListener('empregamais:candidaturas-sincronizadas',refresh);refresh();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
