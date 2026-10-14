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
 function applicationDate(value){var text=String(value||'');if(/^\d{4}-\d{2}-\d{2}$/.test(text))return text.slice(8,10)+'/'+text.slice(5,7)+'/'+text.slice(0,4);var date=new Date(text);return isNaN(date.getTime())?'Data não informada':date.toLocaleDateString('pt-BR');}
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
  var heading=document.createElement('div');heading.className='cp-applications-intro';heading.innerHTML='<span>SEU PRÓXIMO PASSO</span><h1>Minhas candidaturas</h1><p>Acompanhe cada processo seletivo, confira a etapa atual e veja as orientações da empresa.</p>';list.before(heading);
  toolbar.innerHTML='<div class="cp-application-filter-buttons">'+stages.map(function(stage){return '<button type="button" data-cp-filter="'+stage.key+'" aria-controls="listaCandidaturas" aria-pressed="false"><strong data-cp-filter-count="'+stage.key+'">0</strong><span>'+(stage.filterLabel||stage.label)+'</span></button>';}).join('')+'</div><div class="cp-application-result-row"><p id="cpApplicationResult" role="status" aria-live="polite"></p><div class="cp-application-sync"><span id="cpApplicationSyncState" role="status" aria-live="polite"></span><button type="button" id="cpApplicationRefresh">Atualizar</button></div></div>';
  toolbar.addEventListener('click',function(event){var button=event.target.closest('[data-cp-filter]');if(button&&toolbar.contains(button))setStage(button.dataset.cpFilter,true);});
  toolbar.querySelector('#cpApplicationRefresh').onclick=function(){if(window.EmpregaMaisCandidaturasCloud)window.EmpregaMaisCandidaturasCloud.sincronizar(true);};list.before(toolbar);
 }
 function safe(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});}
 function publicDetails(a){
  var stage=classify(a),job={};try{job=typeof window.localizarVaga==='function'?window.localizarVaga(a.vagaId||a.vaga_id)||{}:{}}catch(ignore){}
  var hints={avaliacao:'A empresa está avaliando sua candidatura. Aguarde uma atualização por aqui.',contato:'Sua candidatura está em contato. Confira as mensagens e orientações da empresa.',entrevista:'Sua candidatura está na etapa de entrevista. Confira abaixo se o convite já foi disponibilizado.',aprovadas:'Você foi aprovado nesta seleção. Aguarde as orientações da empresa sobre os próximos passos.',contratadas:'A empresa marcou sua candidatura como contratada.',reprovadas:'Sua participação neste processo foi encerrada. Você pode continuar buscando novas oportunidades.'};
  var steps=[{key:'enviada',label:'Candidatura enviada'}].concat(workflow.etapas.filter(function(x){return x.key!=='reprovadas'}));
  var timeline='<ol class="cp-process-steps">'+steps.map(function(x){return '<li class="'+(x.key===stage?'is-current':'')+'"><span>'+icon(x.key===stage?'clock':x.key==='enviada'?'send':'flag')+'</span><div><strong>'+safe(x.label)+'</strong><small>'+(x.key==='enviada'?applicationDate(a.data||a.dataCandidatura):x.key===stage?'Etapa atual':'Sem confirmação desta etapa')+'</small></div></li>'}).join('')+'</ol>';
  var history='<li><strong>Candidatura enviada</strong><span>'+safe(applicationDate(a.data||a.dataCandidatura))+'</span></li>';
  if(a.statusAtualizadoEm)history+='<li><strong>'+safe(label(a))+'</strong><span>'+safe(applicationDate(a.statusAtualizadoEm))+'</span></li>';
  var interview=a.entrevista||{},when=interview.data||interview.scheduled_at||a.dataEntrevista;
  var interviewText=when?'<p><strong>Data e horário:</strong> '+safe(new Date(when).toLocaleString('pt-BR'))+'</p><p>'+safe(interview.orientacoes||interview.instructions||'Confira o convite da entrevista para confirmar sua presença e acessar o link.')+'</p>':'<p>O convite com data, horário, formato e orientações aparecerá quando a empresa disponibilizar o agendamento.</p>';
  return '<div class="cp-process-note"><strong>'+safe(label(a))+'</strong><p>'+safe(hints[stage]||'Aguarde as próximas informações da empresa.')+'</p></div><div class="cp-process-grid"><section><h4>Etapas do processo</h4>'+timeline+(stage==='reprovadas'?'<p class="cp-process-ended">Processo encerrado para esta candidatura.</p>':'')+'<small>O fluxo pode variar conforme a empresa. Apenas a etapa atual foi confirmada.</small></section><section><h4>Sobre a oportunidade</h4><dl><dt>Empresa</dt><dd>'+safe(a.empresa||job.empresa||'Não informada')+'</dd><dt>Localização</dt><dd>'+safe(a.cidade||job.cidade||'Não informada')+'</dd><dt>Modalidade</dt><dd>'+safe(a.modalidade||job.modalidade||'Não informada')+'</dd><dt>Contrato</dt><dd>'+safe(a.contrato||job.contrato||'Não informado')+'</dd><dt>Salário anunciado</dt><dd>'+safe(job.salario||a.salario||'Não informado')+'</dd></dl></section><section><h4>Entrevista</h4>'+interviewText+'</section><section><h4>Retorno da empresa</h4><p>'+safe(a.feedbackCandidato||a.retornoCandidato||'Nenhum retorno adicional disponibilizado pela empresa.')+'</p><small>Confira também a aba Mensagens do painel.</small></section><section class="cp-process-history"><h4>Histórico da candidatura</h4><ul>'+history+'</ul>'+(!a.statusAtualizadoEm?'<small>A data da mudança de etapa ainda não foi disponibilizada.</small>':'')+'</section></div>';
 }
 var processDialog,processTrigger;
 function closeProcess(){if(processDialog&&processDialog.open)processDialog.close();}
 function openProcess(a,trigger){
  if(!processDialog){
   processDialog=document.createElement('dialog');processDialog.className='cp-process-modal';processDialog.setAttribute('aria-labelledby','cpProcessTitle');
   processDialog.innerHTML='<header class="cp-process-modal-header"><div><span>ACOMPANHAMENTO DA CANDIDATURA</span><h2 id="cpProcessTitle"></h2><p class="cp-process-modal-subtitle"></p></div><button type="button" class="cp-process-modal-close" aria-label="Fechar acompanhamento">'+icon('close')+'</button></header><div class="cp-process-body"></div><footer class="cp-process-modal-footer"><button type="button">Fechar</button></footer>';
   document.body.appendChild(processDialog);
   processDialog.querySelector('.cp-process-modal-close').onclick=closeProcess;
   processDialog.querySelector('footer button').onclick=closeProcess;
   processDialog.addEventListener('click',function(event){if(event.target===processDialog){var rect=processDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeProcess();}});
   processDialog.addEventListener('close',function(){document.body.classList.remove('cp-process-modal-open');if(processTrigger&&processTrigger.isConnected)processTrigger.focus();});
  }
  processTrigger=trigger;
  processDialog.querySelector('h2').textContent=a.vagaTitulo||a.tituloVaga||a.vaga||a.titulo||'Processo seletivo';
  processDialog.querySelector('.cp-process-modal-subtitle').textContent=(a.empresa||'Empresa não informada')+' • Candidatura enviada em '+applicationDate(a.data||a.dataCandidatura);
  processDialog.querySelector('.cp-process-body').innerHTML=publicDetails(a);
  if(!processDialog.open)processDialog.showModal();
  document.body.classList.add('cp-process-modal-open');processDialog.scrollTop=0;processDialog.querySelector('.cp-process-modal-close').focus();
 }
 function enhanceList(){
  var list=document.getElementById('listaCandidaturas');if(!list)return;
  var rows=applications().filter(function(a){return matches(a)});
  list.querySelectorAll('.candidatura-item').forEach(function(card,i){
   var a=rows[i];if(!a||card.querySelector('.cp-process-details'))return;
   var details=document.createElement('div');details.className='cp-process-details';
   var button=document.createElement('button');button.type='button';button.className='cp-process-trigger';button.setAttribute('aria-haspopup','dialog');
   button.innerHTML='Acompanhar processo '+icon('arrow');button.onclick=function(){openProcess(a,button);};
   details.appendChild(button);card.appendChild(details);
  });
 }
 function updateList(total){prepareList();enhanceList();var toolbar=document.getElementById('cpApplicationFilters');if(!toolbar)return;var key=currentStage(),totals=counts(applications());toolbar.querySelectorAll('[data-cp-filter]').forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.cpFilter===key));button.querySelector('[data-cp-filter-count]').textContent=String(totals[button.dataset.cpFilter]);button.setAttribute('aria-label',description(totals[button.dataset.cpFilter],button.dataset.cpFilter));});var result=document.getElementById('cpApplicationResult'),text=description(total,key);if(result.textContent!==text)result.textContent=text;if(window.EmpregaMaisCandidaturasCloud)window.EmpregaMaisCandidaturasCloud.atualizarIndicador();}
 function emptyMessage(){return currentStage()==='todas'?'Você ainda não enviou candidaturas.':'Você ainda não tem candidaturas nesta etapa. Clique em Todas para consultar os demais processos.';}
 function refresh(){var slot=document.querySelector('#pagina-painel-candidato .cp-metrics-slot');if(slot)renderSummary(slot);var page=document.getElementById('pagina-candidaturas');if(page&&page.classList.contains('ativa')&&typeof window.renderizarCandidaturas==='function')window.renderizarCandidaturas();}
 window.EmpregaMaisCandidaturasCandidato={detalhesPublicos:publicDetails,pertence:belongs,classificar:classify,rotulo:label,data:applicationDate,corresponde:matches,contar:counts,filtroAtual:currentStage,prepararLista:prepareList,atualizarLista:updateList,mensagemVazia:emptyMessage,atualizarResumo:renderSummary,abrir:openStage,atualizar:refresh};
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

  #pagina-candidaturas>.container-menor{width:calc(100% - 40px)!important;max-width:1100px!important;margin:0 auto!important;padding:30px 0 48px!important}
  .cp-applications-intro{margin:0 0 24px;font-family:Inter,Arial,sans-serif;color:#241b39}.cp-applications-intro>span{font-size:10px;font-weight:700;letter-spacing:.12em;color:#7951a3}.cp-applications-intro h1{font:750 28px/1.3 Inter,Arial,sans-serif;margin:7px 0 9px}.cp-applications-intro p{font-size:14px;color:#786a89;margin:0;line-height:1.6}
  #pagina-candidaturas .candidatura-item{padding:22px!important;border:1px solid #e3dbea!important;border-radius:14px!important;background:#fff!important;margin-bottom:16px!important;font-family:Inter,Arial,sans-serif}
  #pagina-candidaturas #listaCandidaturas{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;align-items:start}
  #pagina-candidaturas #listaCandidaturas>.candidatura-item{min-width:0;margin:0!important}
  #pagina-candidaturas #listaCandidaturas>.vazio{grid-column:1/-1}
  #pagina-candidaturas #listaCandidaturas .candidatura-top{display:flex;flex-wrap:wrap;gap:12px}
  #pagina-candidaturas #listaCandidaturas .cp-process-grid{grid-template-columns:1fr}
  #pagina-candidaturas #listaCandidaturas .cp-process-history{grid-column:auto}
  @media(max-width:760px){#pagina-candidaturas #listaCandidaturas{grid-template-columns:1fr}}
  .cp-process-details{margin-top:18px;border-top:1px solid #eee8f4}.cp-process-details>summary{display:flex;align-items:center;justify-content:space-between;gap:12px;list-style:none;cursor:pointer;padding:16px 0 0;color:#63339b;font:650 13px Inter,Arial,sans-serif}.cp-process-details>summary::-webkit-details-marker{display:none}.cp-process-details summary svg{width:18px;height:18px}.cp-process-details[open] summary svg{transform:rotate(90deg)}.cp-process-details>summary:focus-visible{outline:2px solid #7540ae;outline-offset:4px}
  .cp-process-trigger{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:16px 0 0;border:0;background:transparent;color:#63339b;font:650 13px Inter,Arial,sans-serif;cursor:pointer;text-align:left}.cp-process-trigger svg{width:18px;height:18px}.cp-process-trigger:focus-visible{outline:2px solid #7540ae;outline-offset:4px}
  body.cp-process-modal-open{overflow:hidden}.cp-process-modal{box-sizing:border-box;width: min(860px,calc(100% - 40px));max-height:calc(100dvh - 48px);margin:auto;padding:0;border:1px solid #e3dbea;border-radius:18px;background:#fff;color:#30213f;box-shadow:0 24px 90px #241b3940;font-family:Inter,Arial,sans-serif;overflow:auto}.cp-process-modal::backdrop{background:#241b3999;backdrop-filter:blur(3px)}.cp-process-modal-header{position:sticky;top:0;z-index:1;display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:24px 28px 20px;background:#fff;border-bottom:1px solid #eee8f4}.cp-process-modal-header>div{min-width:0}.cp-process-modal-header span{font-size:10px;font-weight:700;letter-spacing:.1em;color:#7951a3}.cp-process-modal-header h2{margin:8px 0;font:700 22px/1.3 Inter,Arial,sans-serif;overflow-wrap:anywhere}.cp-process-modal-subtitle{margin:0;font-size:12px;line-height:1.6;color:#82718f}.cp-process-modal-close{display:grid;place-items:center;flex:0 0 36px;width:36px;height:36px;padding:6px;border:1px solid #e3dbea;border-radius:10px;background:#faf8fd;color:#63339b;cursor:pointer}.cp-process-modal-close svg{width:22px;height:22px}.cp-process-modal .cp-process-body{padding:24px 28px}.cp-process-modal-footer{display:flex;justify-content:flex-end;padding:16px 28px;border-top:1px solid #eee8f4}.cp-process-modal-footer button{padding:10px 24px;border:0;border-radius:9px;background:#63339b;color:#fff;font:600 13px Inter,Arial,sans-serif;cursor:pointer}.cp-process-modal button:focus-visible{outline:2px solid #7540ae;outline-offset:3px}
  @media(max-width:600px){.cp-process-modal{width:calc(100% - 20px);max-height:calc(100dvh - 24px);border-radius:14px}.cp-process-modal-header{padding:18px}.cp-process-modal-header h2{font-size:19px}.cp-process-modal .cp-process-body{padding:18px}.cp-process-modal-footer{padding:14px 18px}}
  .cp-process-body{padding-top:18px;color:#5f536d;font:400 13px/1.6 Inter,Arial,sans-serif}.cp-process-note{padding:16px 18px;border-radius:10px;background:#f7f2fc;border:1px solid #e7dcf3}.cp-process-note strong{color:#51258a}.cp-process-note p{margin:4px 0 0}
  .cp-process-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:22px}.cp-process-grid section{min-width:0}.cp-process-grid h4{margin:0 0 14px;font-size:14px;color:#30213f}.cp-process-grid p{margin:0 0 10px;overflow-wrap:anywhere}.cp-process-grid small{font-size:11px;color:#8b7f96}.cp-process-steps{list-style:none;margin:0;padding:0}.cp-process-steps li{display:flex;gap:12px;padding:0 0 16px;position:relative}.cp-process-steps li>span{display:grid;place-items:center;flex:0 0 30px;height:30px;border-radius:50%;background:#f4f1f7;color:#9c90aa}.cp-process-steps svg{width:16px;height:16px}.cp-process-steps strong,.cp-process-steps small{display:block}.cp-process-steps strong{font-size:12px}.cp-process-steps .is-current>span{background:#62329b;color:#fff}.cp-process-steps .is-current strong{color:#62329b}.cp-process-grid dl{display:grid;grid-template-columns:auto 1fr;gap:10px 18px;margin:0}.cp-process-grid dt{color:#8b7f96}.cp-process-grid dd{margin:0;overflow-wrap:anywhere;font-weight:600}.cp-process-history{grid-column:1/-1;border-top:1px solid #eee8f4;padding-top:18px}.cp-process-history ul{list-style:none;padding:0;margin:0}.cp-process-history li{display:flex;justify-content:space-between;gap:15px;margin:0 0 12px}.cp-process-history li strong{font-size:12px}.cp-process-history li span{font-size:11px}.cp-process-ended{color:#9d4052}
  @media(max-width:600px){#pagina-candidaturas>.container-menor{width:calc(100% - 28px)!important;padding-top:22px!important}.cp-applications-intro h1{font-size:24px}.cp-process-grid{grid-template-columns:1fr}.cp-process-history{grid-column:auto}#pagina-candidaturas .candidatura-item{padding:17px!important}.cp-process-grid dl{grid-template-columns:1fr;gap:3px}.cp-process-grid dd{margin-bottom:9px}}
  @media(prefers-reduced-motion:reduce){#pagina-painel-candidato .cp-profile .cp-stage-card{transition:none}}
  `;document.head.appendChild(style);
  window.addEventListener('popstate',refresh);window.addEventListener('storage',refresh);document.addEventListener('empregamais:candidato-sincronizado',refresh);document.addEventListener('empregamais:candidaturas-sincronizadas',refresh);refresh();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
