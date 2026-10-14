(function(){
 'use strict';
 var stages=[
  {key:'todas',label:'Enviadas',filterLabel:'Todas',icon:'send'},
  {key:'analise',label:'Em análise',filterLabel:'Em análise',icon:'clock'},
  {key:'selecionadas',label:'Selecionadas',filterLabel:'Selecionadas',icon:'check'},
  {key:'finalistas',label:'Finalistas',filterLabel:'Finalistas',icon:'flag'}
 ];
 function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();}
 function validStage(key){return stages.some(function(stage){return stage.key===key;})?key:'todas';}
 function currentStage(){return validStage(new URLSearchParams(location.search).get('etapaCandidatura'));}
 function belongs(application){var email=String(sessionStorage.getItem('candidatoEmail')||'').trim().toLowerCase(),owner=String(application.email||application.candidatoEmail||application.emailCandidato||application.candidato_email||'').trim().toLowerCase();return !!email&&owner===email;}
 function classify(application){
  var status=norm(application.status||application.statusProcesso||application.etapa||application.etapaAtual);
  if(/nao selecionad|reprovad|desclassificad|cancelad|contratad|encerrad/.test(status))return 'outras';
  if(/finalista|etapa final/.test(status))return 'finalistas';
  if(/^(pre[- ]?)?selecionad[oa]s?(?:\s|$)/.test(status))return 'selecionadas';
  if(/em analise|em avaliacao|analise curricular|analise de curriculo|^(em )?triagem$/.test(status))return 'analise';
  return 'outras';
 }
 function matches(application,key){key=validStage(key==null?currentStage():key);return key==='todas'||classify(application)===key;}
 function applications(){try{var list=typeof window.carregarCandidaturas==='function'?window.carregarCandidaturas():[];return Array.isArray(list)?list.filter(belongs):[];}catch(ignore){return [];}}
 function counts(list){var result={todas:list.length,analise:0,selecionadas:0,finalistas:0};list.forEach(function(application){var key=classify(application);if(key!=='outras')result[key]++;});return result;}
 function description(total,key){var one=total===1,end={todas:one?'enviada':'enviadas',analise:'em análise',selecionadas:one?'selecionada':'selecionadas',finalistas:one?'finalista':'finalistas'};return total+' '+(one?'candidatura':'candidaturas')+' '+end[validStage(key)];}
 function icon(name){var paths={send:'<path d="m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',check:'<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m7 12 3 3 7-7"/>',flag:'<path d="M5 21V3m0 1h13l-2 5 2 5H5"/>',arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>'};return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[name]+'</svg>';}
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
  toolbar.innerHTML='<div class="cp-application-filter-buttons">'+stages.map(function(stage){return '<button type="button" data-cp-filter="'+stage.key+'" aria-controls="listaCandidaturas" aria-pressed="false">'+stage.filterLabel+'</button>';}).join('')+'</div><p id="cpApplicationResult" role="status" aria-live="polite"></p>';
  toolbar.addEventListener('click',function(event){var button=event.target.closest('[data-cp-filter]');if(button&&toolbar.contains(button))setStage(button.dataset.cpFilter,true);});list.before(toolbar);
 }
 function updateList(total){prepareList();var toolbar=document.getElementById('cpApplicationFilters');if(!toolbar)return;var key=currentStage();toolbar.querySelectorAll('[data-cp-filter]').forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.cpFilter===key));});var result=document.getElementById('cpApplicationResult'),text=description(total,key);if(result.textContent!==text)result.textContent=text;}
 function emptyMessage(){return currentStage()==='todas'?'Você ainda não enviou candidaturas.':'Você ainda não tem candidaturas nesta etapa. Clique em Todas para consultar os demais processos.';}
 function refresh(){var slot=document.querySelector('#pagina-painel-candidato .cp-metrics-slot');if(slot)renderSummary(slot);var page=document.getElementById('pagina-candidaturas');if(page&&page.classList.contains('ativa')&&typeof window.renderizarCandidaturas==='function')window.renderizarCandidaturas();}
 window.EmpregaMaisCandidaturasCandidato={pertence:belongs,classificar:classify,corresponde:matches,contar:counts,filtroAtual:currentStage,prepararLista:prepareList,atualizarLista:updateList,mensagemVazia:emptyMessage,atualizarResumo:renderSummary,abrir:openStage};
 function start(){
  var style=document.createElement('style');style.id='cp-application-stages-style';style.textContent=`
  #pagina-painel-candidato.cp-reference .cp-profile .cp-metrics-slot>.metricas[hidden]{display:none!important}
  #pagina-painel-candidato .cp-application-summary{margin-top:18px;font-family:Montserrat,Arial,sans-serif}
  #pagina-painel-candidato .cp-application-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
  #pagina-painel-candidato .cp-application-heading h2{margin:0!important;font:700 15px/1.4 Montserrat,Arial,sans-serif!important;color:#241b39!important}
  #pagina-painel-candidato .cp-profile .cp-application-all{display:inline-flex!important;align-items:center;gap:5px;padding:4px 0!important;font:600 11px/1.5 Montserrat,Arial,sans-serif!important}
  #pagina-painel-candidato .cp-application-all svg{width:14px;height:14px}
  #pagina-painel-candidato .cp-application-stages{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
  #pagina-painel-candidato .cp-profile .cp-stage-card{display:grid!important;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:9px 8px;min-width:0;width:100%;min-height:86px;padding:12px 14px!important;background:#fff!important;border:1px solid #e3dbea!important;border-radius:10px!important;text-align:left;color:#51258a!important;box-shadow:none!important;transition:background .15s,border-color .15s,transform .15s;cursor:pointer}
  #pagina-painel-candidato .cp-profile .cp-stage-card[data-cp-stage=todas]{background:#f8f4fe!important;border-color:#dac9ed!important}
  #pagina-painel-candidato .cp-stage-icon{display:flex;align-items:center;color:#7951a3}
  #pagina-painel-candidato .cp-stage-icon svg{width:19px;height:19px}
  #pagina-painel-candidato .cp-stage-card strong{font:700 25px/1 Montserrat,Arial,sans-serif!important;color:#51258a!important}
  #pagina-painel-candidato .cp-stage-label{font:600 11px/1.4 Montserrat,Arial,sans-serif!important;color:#514261!important}
  #pagina-painel-candidato .cp-stage-arrow{display:flex;justify-content:flex-end;color:#9477b0}
  #pagina-painel-candidato .cp-stage-arrow svg{width:14px;height:14px}
  #pagina-painel-candidato .cp-profile .cp-stage-card:hover{background:#fbf8ff!important;border-color:#a57acb!important;transform:translateY(-1px)}
  #pagina-painel-candidato .cp-stage-card:focus-visible,#cpApplicationFilters button:focus-visible{outline:2px solid #7540ae!important;outline-offset:3px}
  #cpApplicationFilters{margin:0 0 20px;padding:16px 18px;border:1px solid #ded8e7;border-radius:12px;background:#fff;font-family:Montserrat,Arial,sans-serif}
  #cpApplicationFilters .cp-application-filter-buttons{display:flex;flex-wrap:wrap;gap:8px}
  #cpApplicationFilters button{padding:9px 13px;border:1px solid #e3dbea;border-radius:8px;background:#fff;color:#665572;font:600 12px/1.4 Montserrat,Arial,sans-serif;cursor:pointer}
  #cpApplicationFilters button[aria-pressed=true]{background:#51258a;border-color:#51258a;color:#fff}
  #cpApplicationResult{margin:12px 0 0;color:#82718f;font:400 12px/1.5 Montserrat,Arial,sans-serif}
  @media(max-width:540px){#cpApplicationFilters{padding:14px}#cpApplicationFilters button{padding:9px 11px;font-size:11px}}
  @media(prefers-reduced-motion:reduce){#pagina-painel-candidato .cp-profile .cp-stage-card{transition:none}}
  `;document.head.appendChild(style);
  window.addEventListener('popstate',refresh);window.addEventListener('storage',refresh);document.addEventListener('empregamais:candidato-sincronizado',refresh);refresh();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
