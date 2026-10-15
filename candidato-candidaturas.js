(function(){
 'use strict';
 var workflow=window.EmpregaMaisEtapasCandidatura;
 var stages=[{key:'todas',label:'Enviadas',filterLabel:'Todas',icon:'send'}].concat(workflow.etapas);
 function filterIcon(key){var paths={"todas":"<path d=\"M8 3h8l4 4v14H8Z\"/><path d=\"M16 3v5h4M5 6H3v15h2M11 12h6M11 16h6\"/>","avaliacao":"<path d=\"M6 3h9l4 4v5M15 3v5h4M6 3v18h6M9 11h3\"/><circle cx=\"15\" cy=\"16\" r=\"4\"/><path d=\"m18 19 3 3\"/>","contato":"<path d=\"M13 15H7l-4 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3\"/><path d=\"M13 10h6a3 3 0 0 1 3 3v8l-4-3h-5a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3Z\"/><path d=\"M6 8h7\"/>","entrevista":"<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M7 2v6M17 2v6M3 11h18M7 15h2\"/><circle cx=\"17\" cy=\"18\" r=\"5\" fill=\"var(--filter-icon-bg,#eaf2f7)\"/><path d=\"M17 15v3l2 1\"/>","aprovadas":"<path d=\"m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6Z\"/><path d=\"m7 12 3 3 6-7\"/>","contratadas":"<rect x=\"2\" y=\"7\" width=\"20\" height=\"14\" rx=\"3\"/><path d=\"M8 7V3h8v4M2 12h20M9 12v3h4\"/><path d=\"m15 18 2 2 5-6\" stroke-width=\"2.5\"/>","reprovadas":"<path d=\"M5 3h10l4 4v6M15 3v5h4M5 3v18h6M8 12h5M8 16h3\"/><circle cx=\"17\" cy=\"18\" r=\"5\"/><path d=\"m15 16 4 4m0-4-4 4\"/>","refresh":"<path d=\"M20 8a8 8 0 1 0 1 8M20 3v6h-6\"/>"};return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[key]||paths.todas)+'</svg>';}
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
  var oldHeader=document.querySelector('#pagina-candidaturas>.page-header');if(oldHeader)oldHeader.hidden=true;
  var heading=document.createElement('section');heading.className='cp-applications-intro cp-applications-hero';heading.setAttribute('aria-label','Minhas candidaturas');
  heading.innerHTML="<div class=\"cp-applications-hero-copy\"><button type=\"button\" class=\"cp-applications-back\"><span aria-hidden=\"true\">←</span> Voltar ao painel</button><div class=\"cp-applications-kicker\">PROCESSOS SELETIVOS <span>ACOMPANHAMENTO</span></div><h1>Minhas candidaturas</h1><p>Acompanhe atualizações, entrevistas e orientações das empresas.</p><div class=\"cp-applications-chips\"><span><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M6 9a6 6 0 0 1 12 0v7l2 3H4l2-3ZM10 22h4\"/></svg>Atualizações</span><span><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" aria-hidden=\"true\"><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M2 22v-3a7 7 0 0 1 14 0v3ZM17 3a4 4 0 0 1 0 8m2 5a6 6 0 0 1 3 6\"/></svg>Entrevistas</span><span><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M21 15a4 4 0 0 1-4 4H9l-6 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z\"/><path d=\"M7 11h.01m5 0h.01m5 0h.01\"/></svg>Mensagens</span></div></div><div class=\"cp-applications-art\" aria-hidden=\"true\"><svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 440 260\" aria-hidden=\"true\"><defs><linearGradient id=\"appPaper\" x2=\"1\" y2=\"1\"><stop stop-color=\"#fff\"/><stop offset=\"1\" stop-color=\"#f3f8fa\"/></linearGradient><linearGradient id=\"appTile\" x2=\"1\" y2=\"1\"><stop stop-color=\"#79aabd\"/><stop offset=\"1\" stop-color=\"#245e73\"/></linearGradient><filter id=\"appShadow\" x=\"-40%\" y=\"-30%\" width=\"180%\" height=\"180%\"><feDropShadow dx=\"0\" dy=\"6\" stdDeviation=\"7\" flood-color=\"#285467\" flood-opacity=\".18\"/></filter></defs>\n<path d=\"M22 240C-10 120 65 35 190 27S360 0 434 60\" fill=\"none\" stroke=\"#bedce7\"/>\n\n<g transform=\"translate(132 13) rotate(-5 120 120)\" filter=\"url(#appShadow)\"><rect x=\"9\" y=\"7\" width=\"235\" height=\"245\" rx=\"12\" fill=\"#a9cdda\"/><rect width=\"235\" height=\"245\" rx=\"12\" fill=\"url(#appPaper)\"/><rect x=\"68\" y=\"-4\" width=\"100\" height=\"19\" rx=\"6\" fill=\"#39768a\"/><text x=\"22\" y=\"43\" font-family=\"Montserrat,Arial\" font-size=\"14\" font-weight=\"700\" fill=\"#123946\">Sua candidatura</text><text x=\"22\" y=\"59\" font-family=\"Montserrat,Arial\" font-size=\"8\" fill=\"#52727e\">Acompanhe o processo seletivo</text><path d=\"M21 74h192\" stroke=\"#d8e9ef\"/><path d=\"M32 96v103\" stroke=\"#bbd7e2\" stroke-width=\"3\"/>\n<g fill=\"#39768a\"><circle cx=\"32\" cy=\"98\" r=\"10\"/><circle cx=\"32\" cy=\"142\" r=\"10\"/><circle cx=\"32\" cy=\"186\" r=\"10\"/></g><g stroke=\"#fff\" fill=\"none\" stroke-width=\"2\" stroke-linecap=\"round\"><path d=\"m27 98 4 4 7-8\"/><circle cx=\"32\" cy=\"142\" r=\"4\"/><path d=\"M28 184h8m-8 4h6\"/></g>\n<g font-family=\"Montserrat,Arial\" font-size=\"10\" font-weight=\"700\" fill=\"#174e61\"><text x=\"53\" y=\"100\">Candidatura enviada</text><text x=\"53\" y=\"144\">Avaliação do perfil</text><text x=\"53\" y=\"188\">Entrevista</text></g><g stroke=\"#c6e0e9\" stroke-width=\"4\" stroke-linecap=\"round\"><path d=\"M55 111h132M55 155h114M55 199h126\"/></g><rect x=\"22\" y=\"220\" width=\"192\" height=\"9\" rx=\"4\" fill=\"#e1eef3\"/><rect x=\"22\" y=\"220\" width=\"68\" height=\"9\" rx=\"4\" fill=\"#79aabd\"/></g>\n<g transform=\"translate(345 49) rotate(8)\" filter=\"url(#appShadow)\"><rect width=\"64\" height=\"64\" rx=\"17\" fill=\"url(#appTile)\"/><g fill=\"none\" stroke=\"#fff\" stroke-width=\"3\"><rect x=\"16\" y=\"20\" width=\"32\" height=\"29\" rx=\"4\"/><path d=\"M23 15v10m18-10v10M16 30h32m-23 8h4m6 0h4\"/></g></g>\n<g transform=\"translate(99 199) rotate(-8)\" filter=\"url(#appShadow)\"><rect width=\"60\" height=\"50\" rx=\"13\" fill=\"#e8f2f6\" stroke=\"#fff\"/><path d=\"M15 13h29v21H29l-9 6v-6h-5Zm7 7h15m-15 7h11\" fill=\"none\" stroke=\"#39768a\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></g><g transform=\"translate(322 190)\" filter=\"url(#appShadow)\"><rect x=\"7\" y=\"10\" width=\"86\" height=\"55\" rx=\"8\" fill=\"#245e73\"/><rect width=\"86\" height=\"55\" rx=\"8\" fill=\"url(#appTile)\" stroke=\"#82b4c5\"/><path d=\"M29 0v-12c0-6 28-6 28 0V0M0 22h86\" fill=\"none\" stroke=\"#174e61\" stroke-width=\"5\"/><rect x=\"35\" y=\"19\" width=\"16\" height=\"18\" rx=\"3\" fill=\"#aed2de\" stroke=\"#e7f3f7\"/></g></svg></div><div class=\"cp-applications-rail\"><strong>Seu próximo passo</strong><span>Confira as etapas de cada candidatura.</span></div>";
  heading.querySelector('button').onclick=function(){window.irPara('painel-candidato');};list.before(heading);

  toolbar.innerHTML='<div class="cp-application-filter-buttons">'+stages.map(function(stage){return '<button type="button" data-cp-filter="'+stage.key+'" aria-controls="listaCandidaturas" aria-pressed="false"><span class="cp-filter-icon">'+filterIcon(stage.key)+'</span><span class="cp-filter-copy"><strong data-cp-filter-count="'+stage.key+'">0</strong><span class="cp-filter-label">'+(stage.filterLabel||stage.label)+'</span></span></button>';}).join('')+'</div><div class="cp-application-result-row"><p id="cpApplicationResult" role="status" aria-live="polite"></p><div class="cp-application-sync"><span id="cpApplicationSyncState" role="status" aria-live="polite"></span><button type="button" id="cpApplicationRefresh">'+filterIcon('refresh')+'<span>Atualizar</span></button></div></div>';
  toolbar.addEventListener('click',function(event){var button=event.target.closest('[data-cp-filter]');if(button&&toolbar.contains(button))setStage(button.dataset.cpFilter,true);});
  toolbar.querySelector('#cpApplicationRefresh').onclick=function(){if(window.EmpregaMaisCandidaturasCloud)window.EmpregaMaisCandidaturasCloud.sincronizar(true);};list.before(toolbar);
 }
 function safe(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]});}
 function publicDetails(a){
  var stage=classify(a),job={};try{job=typeof window.localizarVaga==='function'?window.localizarVaga(a.vagaId||a.vaga_id)||{}:{}}catch(ignore){}
  var hints={avaliacao:'A empresa está avaliando sua candidatura. Aguarde uma atualização por aqui.',contato:'Sua candidatura está em contato. Confira as mensagens e orientações da empresa.',entrevista:'Sua candidatura está na etapa de entrevista. Confira abaixo se o convite já foi disponibilizado.',aprovadas:'Você foi aprovado nesta seleção. Aguarde as orientações da empresa sobre os próximos passos.',contratadas:'A empresa marcou sua candidatura como contratada.',reprovadas:'Sua participação neste processo foi encerrada. Você pode continuar buscando novas oportunidades.'};
  var steps=[{key:'enviada',label:'Candidatura enviada'}].concat(workflow.etapas.filter(function(x){return x.key!=='reprovadas'}));
  var timeline='<ol class="cp-process-steps">'+steps.map(function(x){return '<li class="'+(x.key===stage?'is-current':'')+'"><span>'+icon(x.key===stage?'clock':x.key==='enviada'?'send':'flag')+'</span><div><strong>'+safe(x.label)+'</strong><small>'+(x.key==='enviada'?applicationDate(a.data||a.dataCandidatura):x.key===stage?'Etapa atual':'Sem confirmação desta etapa')+'</small></div></li>'}).join('')+'</ol>';
  var interview=a.entrevista||{},when=interview.data||interview.scheduled_at||a.dataEntrevista;
  var interviewText=when?'<p><strong>Data e horário:</strong> '+safe(new Date(when).toLocaleString('pt-BR'))+'</p><p>'+safe(interview.orientacoes||interview.instructions||'Confira o convite da entrevista para confirmar sua presença e acessar o link.')+'</p>':'<p>O convite com data, horário, formato e orientações aparecerá quando a empresa disponibilizar o agendamento.</p>';
  return '<div class="cp-process-note"><strong>'+safe(label(a))+'</strong><p>'+safe(hints[stage]||'Aguarde as próximas informações da empresa.')+'</p></div><div class="cp-process-grid"><section><h4>Etapas do processo</h4>'+timeline+(stage==='reprovadas'?'<p class="cp-process-ended">Processo encerrado para esta candidatura.</p>':'')+'<small>O fluxo pode variar conforme a empresa. Apenas a etapa atual foi confirmada.</small></section><section><h4>Sobre a oportunidade</h4><dl><dt>Empresa</dt><dd>'+safe(a.empresa||job.empresa||'Não informada')+'</dd><dt>Localização</dt><dd>'+safe(a.cidade||job.cidade||'Não informada')+'</dd><dt>Modalidade</dt><dd>'+safe(a.modalidade||job.modalidade||'Não informada')+'</dd><dt>Contrato</dt><dd>'+safe(a.contrato||job.contrato||'Não informado')+'</dd><dt>Salário anunciado</dt><dd>'+safe(job.salario||a.salario||'Não informado')+'</dd></dl></section><section><h4>Entrevista</h4>'+interviewText+'</section><section><h4>Retorno da empresa</h4><p>'+safe(a.feedbackCandidato||a.retornoCandidato||'Nenhum retorno adicional disponibilizado pela empresa.')+'</p><small>Confira também a aba Mensagens do painel.</small></section></div>';
 }
 function fullJobDetails(a){
  var v={};try{v=typeof window.localizarVaga==='function'?window.localizarVaga(a.vagaId||a.vaga_id)||{}:{};}catch(ignore){}
  function value(key){var x=v[key]!=null&&v[key]!==''?v[key]:a[key];return Array.isArray(x)?x.join(', '):x;}
  var rows=[['Empresa',v.confidencial?'Empresa confidencial':value('empresa')],['Localização',[value('cidade'),value('uf')].filter(Boolean).join(' – ')],['Salário',value('salario')||'Não informado'],['Modalidade',value('modalidade')],['Contrato',value('contrato')],['Área de atuação',value('area')],['Jornada',value('jornada')],['Horário',value('horario')],['Escolaridade',value('escolaridade')],['Experiência',value('experiencia')],['Vagas disponíveis',value('quantidade')||value('numeroVagas')],['Publicação',value('dataPublicacao')?applicationDate(value('dataPublicacao')):'']];
  function text(key){var x=value(key);return x?'<p>'+safe(Array.isArray(x)?x.join('\n'):x)+'</p>':'<p class="cp-job-empty">Não informado pela empresa.</p>';}
  return '<div class="cp-full-job"><aside class="cp-job-facts"><h3>'+icon('briefcase')+' Informações da vaga</h3><dl>'+rows.filter(function(r){return r[1]!=null&&r[1]!=='';}).map(function(r){return '<div><dt>'+safe(r[0])+'</dt><dd>'+safe(r[1])+'</dd></div>';}).join('')+'</dl></aside><div class="cp-job-description"><section><h3>Descrição da vaga</h3>'+text('descricao')+'</section><section><h3>Requisitos</h3>'+text('requisitos')+'</section><section><h3>Benefícios</h3>'+text('beneficios')+'</section></div></div>';
 }
 var processGeneration=0;
 function buildProcessTabs(a){
  var body=processDialog.querySelector('.cp-process-body');body.innerHTML=publicDetails(a);
  var note=body.querySelector('.cp-process-note'),sections=body.querySelectorAll('.cp-process-grid>section');
  var nav=document.createElement('div');nav.className='cp-process-tabs';nav.setAttribute('role','tablist');nav.setAttribute('aria-label','Informações da candidatura');
  var content=document.createElement('div');content.className='cp-process-tab-content';
  var names=['Etapas do processo','Sobre a vaga','Mensagens'],icons=['flag','briefcase','message'];
  names.forEach(function(name,i){var tab=document.createElement('button');tab.type='button';tab.id='cpProcessTab'+i;tab.setAttribute('role','tab');tab.setAttribute('aria-controls','cpProcessPane'+i);tab.innerHTML=icon(icons[i])+name;nav.appendChild(tab);var pane=document.createElement('section');pane.id='cpProcessPane'+i;pane.setAttribute('role','tabpanel');pane.setAttribute('aria-labelledby',tab.id);pane.tabIndex=0;content.appendChild(pane);tab.onclick=function(){select(i);};tab.onkeydown=function(e){if(['ArrowRight','ArrowLeft','Home','End'].indexOf(e.key)<0)return;e.preventDefault();var n=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;select(n);nav.children[n].focus();};});
  function select(i){Array.from(nav.children).forEach(function(tab,n){tab.setAttribute('aria-selected',String(n===i));tab.tabIndex=n===i?0:-1;content.children[n].hidden=n!==i;content.dataset.activeTab=String(i);});}
  var stages=content.children[0];stages.append(note,sections[0]);sections[0].querySelector('h4').textContent='Sua jornada nesta seleção';
  var support=document.createElement('div');support.className='cp-process-support';support.innerHTML='<section class="cp-interview-preview"><h4>Entrevista</h4><p role="status">Carregando agendamento…</p></section><section class="cp-message-preview"><h4>Mensagens da empresa</h4><p>Confira os contatos sobre esta candidatura na aba Mensagens.</p><button type="button">Ver mensagens '+icon('arrow')+'</button></section>';support.querySelector('button').onclick=function(){select(2);};stages.appendChild(support);var messageIcon=document.createElement('span');messageIcon.className='cp-support-icon';messageIcon.innerHTML=icon('message');support.querySelector('.cp-message-preview').prepend(messageIcon);
  content.children[1].innerHTML=fullJobDetails(a);
  content.children[2].innerHTML='<h3>Mensagens desta candidatura</h3><p class="cp-messages-state" role="status">Carregando mensagens…</p><div class="cp-process-messages"></div>';
  body.replaceChildren(nav,content);select(0);
  var generation=++processGeneration,job=String(a.vagaId||a.vaga_id||''),demo=new URLSearchParams(location.search).get('pagina')==='demo-candidato',api=window.EMInterviews;
  function current(){return generation===processGeneration&&processDialog.open;}
  function messages(rows){if(!current())return;var pane=content.children[2],state=pane.querySelector('.cp-messages-state'),list=pane.querySelector('.cp-process-messages');state.textContent=rows.length?'Mensagens enviadas pela empresa.':'Nenhuma mensagem da empresa para esta candidatura.';list.innerHTML=rows.map(function(m){return '<article><strong>'+safe(m.company_name||a.empresa)+'</strong><small>'+safe(new Date(m.sent_at).toLocaleString('pt-BR'))+'</small><p>'+safe(m.body)+'</p></article>';}).join('');if(rows.length){var preview=support.querySelector('.cp-message-preview');preview.querySelector('h4').textContent='Mensagem da empresa';preview.querySelector('p').textContent=String(rows[0].body).slice(0,140)+(String(rows[0].body).length>140?'…':'');}}
  function interview(rows){if(!current())return;var host=support.querySelector('.cp-interview-preview'),i=rows.find(function(x){return ['invited','confirmed','reschedule_requested'].indexOf(x.state)>=0;});if(!i){host.innerHTML='<h4>Entrevista</h4><p>Nenhuma entrevista agendada para esta candidatura.</p>';return;}
   var linkMatch=String(i.instructions||'').match(/^\[Online externo\] ([^\n]+)/),validLink=false;try{validLink=!!linkMatch&&new URL(linkMatch[1]).protocol==='https:';}catch(ignore){}
   var at=Date.parse(i.scheduled_at),canJoin=validLink&&!demo&&i.state==='confirmed'&&Date.now()>=at&&Date.now()<=at+(Number(i.duration_minutes)+60)*60000,active=at+Number(i.duration_minutes)*60000>Date.now();
   host.innerHTML='<div class="cp-interview-heading">'+icon('calendar')+'<h4>Sua entrevista está agendada</h4></div><strong>'+safe(new Date(at).toLocaleString('pt-BR',{day:'2-digit',month:'long',hour:'2-digit',minute:'2-digit'}))+'</strong><p>'+safe(String(i.instructions||'').startsWith('[Presencial]')?'Presencial':'Online')+' • '+safe(i.duration_minutes)+' minutos</p><p>'+safe(i.state==='confirmed'?'Presença confirmada':i.state==='reschedule_requested'?'Reagendamento solicitado':'Aguardando sua confirmação')+'</p><div class="cp-interview-buttons">'+(active&&i.state!=='confirmed'?'<button type="button" data-confirm>Confirmar presença</button>':'')+'<button type="button" data-join '+(!canJoin?'disabled':'')+'>Acessar entrevista</button></div><small>O acesso fica disponível no horário marcado, após a confirmação.</small><p class="cp-interview-feedback" role="status"></p>';
   var confirm=host.querySelector('[data-confirm]');if(confirm)confirm.onclick=async function(){confirm.disabled=true;try{if(!demo){if(!api)throw Error('Atualize a página para carregar o agendamento.');await api.manage('confirm',{id:i.id});}i.state='confirmed';interview([i]);}catch(e){host.querySelector('.cp-interview-feedback').textContent=e.message;confirm.disabled=false;}};
   var calendarIcon=document.createElement('span');calendarIcon.className='cp-support-icon';calendarIcon.innerHTML=icon('calendar');host.prepend(calendarIcon);
   host.querySelector('[data-join]').onclick=function(){if(canJoin&&api)api.openRoom(i);};
  }
  if(demo){setTimeout(function(){messages([{company_name:a.empresa,sent_at:new Date().toISOString(),body:'Olá, Ana! Acompanhe as orientações e atualizações do seu processo por aqui. Esta mensagem é uma demonstração.'}]);interview(classify(a)==='entrevista'?[{id:'demo-interview',scheduled_at:new Date(Date.now()+86400000).toISOString(),duration_minutes:30,state:'invited',instructions:'[Online externo] https://meet.google.com/'}]:[]);},0);return;}
  if(!api){content.children[2].querySelector('.cp-messages-state').textContent='Atualize a página para carregar as mensagens.';support.querySelector('.cp-interview-preview p').textContent='Atualize a página para consultar o agendamento.';return;}
  api.api('em_candidate_messages?select=company_name,body,sent_at&state=eq.sent&job_ref=eq.'+encodeURIComponent(job)+'&order=sent_at.desc&limit=50').then(messages).catch(function(){if(current())content.children[2].querySelector('.cp-messages-state').textContent='Não foi possível carregar as mensagens. Reabra o acompanhamento para tentar novamente.';});
  api.api('em_interviews?select=id,scheduled_at,duration_minutes,state,instructions&application_ref=eq.'+encodeURIComponent(a.id)+'&job_ref=eq.'+encodeURIComponent(job)+'&order=scheduled_at.desc&limit=10').then(interview).catch(function(){if(current())support.querySelector('.cp-interview-preview p').textContent='Não foi possível carregar o agendamento. Reabra o acompanhamento para tentar novamente.';});
 }
 var processDialog,processTrigger;
 function closeProcess(){if(processDialog&&processDialog.open)processDialog.close();}
 function openProcess(a,trigger){
  if(!processDialog){
   processDialog=document.createElement('dialog');processDialog.className='cp-process-modal';processDialog.setAttribute('aria-labelledby','cpProcessTitle');
   processDialog.innerHTML='<header class="cp-process-modal-header"><div><span>ACOMPANHAMENTO DA CANDIDATURA</span><h2 id="cpProcessTitle"></h2><p class="cp-process-modal-subtitle"></p></div><button type="button" class="cp-process-modal-close" aria-label="Fechar acompanhamento">'+icon('close')+'</button></header><div class="cp-process-body"></div>';
   document.body.appendChild(processDialog);
   processDialog.querySelector('.cp-process-modal-close').onclick=closeProcess;
   processDialog.addEventListener('click',function(event){if(event.target===processDialog){var rect=processDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeProcess();}});
   processDialog.addEventListener('close',function(){document.body.classList.remove('cp-process-modal-open');if(processTrigger&&processTrigger.isConnected)processTrigger.focus();});
  }
  processTrigger=trigger;
  processDialog.querySelector('h2').textContent=a.vagaTitulo||a.tituloVaga||a.vaga||a.titulo||'Processo seletivo';
  processDialog.querySelector('.cp-process-modal-subtitle').textContent=(a.empresa||'Empresa não informada')+' • Candidatura enviada em '+applicationDate(a.data||a.dataCandidatura);
  buildProcessTabs(a);
  if(!processDialog.open)processDialog.showModal();
  document.body.classList.add('cp-process-modal-open');processDialog.scrollTop=0;processDialog.querySelector('.cp-process-modal-close').focus();
 }
 function viewNotice(a){
  var value=a.visualizadoEm||a.visualizado_em||a.first_viewed_at, date=value?new Date(value):null;
  if(!value&&a.visualizada!==true&&a.curriculo_visualizado!==true)return '';
  return '<div class="cp-application-viewed"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><div><strong>Candidatura visualizada</strong><small>'+ (date&&!isNaN(date.getTime())?'Vista pela empresa em '+safe(date.toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})):'Vista pela empresa')+'</small></div></div>';
 }
 function enhanceList(){
  var list=document.getElementById('listaCandidaturas');if(!list)return;
  var rows=applications().filter(function(a){return matches(a)});
  list.querySelectorAll('.candidatura-item').forEach(function(card,i){
   var a=rows[i];if(!a||card.querySelector('.cp-process-details'))return;
   var notice=viewNotice(a);if(notice){var holder=document.createElement('div');holder.innerHTML=notice;card.querySelector('.candidatura-top').after(holder.firstChild);}
   var details=document.createElement('div');details.className='cp-process-details';
   var button=document.createElement('button');button.type='button';button.className='cp-process-trigger';button.setAttribute('aria-haspopup','dialog');
   button.innerHTML='Acompanhar processo '+icon('arrow');button.onclick=function(){openProcess(a,button);};
   details.appendChild(button);card.appendChild(details);
  });
 }
 function updateList(total){prepareList();enhanceList();var toolbar=document.getElementById('cpApplicationFilters');if(!toolbar)return;var key=currentStage(),totals=counts(applications());toolbar.querySelectorAll('[data-cp-filter]').forEach(function(button){button.setAttribute('aria-pressed',String(button.dataset.cpFilter===key));button.querySelector('[data-cp-filter-count]').textContent=String(totals[button.dataset.cpFilter]);button.setAttribute('aria-label',description(totals[button.dataset.cpFilter],button.dataset.cpFilter));});var result=document.getElementById('cpApplicationResult'),text=description(total,key);if(result.textContent!==text)result.textContent=text;if(window.EmpregaMaisCandidaturasCloud)window.EmpregaMaisCandidaturasCloud.atualizarIndicador();}
 function emptyMessage(){return currentStage()==='todas'?'Você ainda não enviou candidaturas.':'Você ainda não tem candidaturas nesta etapa. Clique em Todas para consultar os demais processos.';}
 function refresh(){var slot=document.querySelector('#pagina-painel-candidato .cp-metrics-slot');if(slot)renderSummary(slot);var page=document.getElementById('pagina-candidaturas');if(page&&page.classList.contains('ativa')&&typeof window.renderizarCandidaturas==='function')window.renderizarCandidaturas();}
 window.EmpregaMaisCandidaturasCandidato={dadosVaga:fullJobDetails,avisoVisualizacao:viewNotice,detalhesPublicos:publicDetails,pertence:belongs,classificar:classify,rotulo:label,data:applicationDate,corresponde:matches,contar:counts,filtroAtual:currentStage,prepararLista:prepareList,atualizarLista:updateList,mensagemVazia:emptyMessage,atualizarResumo:renderSummary,abrir:openStage,atualizar:refresh};
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
  #pagina-candidaturas>.page-header[hidden]{display:none!important}
  #pagina-candidaturas .cp-applications-hero{position:relative;isolation:isolate;display:grid;grid-template-columns:minmax(0,1fr) 150px;gap:24px;align-items:center;background:linear-gradient(110deg,#42216f,#7540ae 85%,#8755c5);border-radius:12px;padding:20px 28px;margin:0 0 18px;color:#fff;overflow:hidden;box-sizing:border-box;font-family:Montserrat,Arial,sans-serif}
  .cp-applications-hero:after{content:'';position:absolute;z-index:-1;width:450px;height:450px;border:1px solid #ffffff22;border-radius:50%;right:-300px;bottom:-300px;box-shadow:0 0 0 60px #ffffff09}
  .cp-applications-hero-copy{min-width:0}.cp-applications-back{display:inline-flex;gap:10px;align-items:center;border:1px solid #c8a4ed99;border-radius:7px;background:#ffffff08;color:#fff;padding:9px 15px;font:600 13px Montserrat,Arial,sans-serif;cursor:pointer}.cp-applications-back:focus-visible{outline:2px solid #fff;outline-offset:4px}
  .cp-applications-kicker{font:600 12px Montserrat,Arial,sans-serif;color:#e8d7ff;letter-spacing:1.3px;margin:12px 0 10px;display:flex;align-items:center;gap:16px}.cp-applications-kicker span{font:700 11px Montserrat,Arial,sans-serif;color:#fff;background:#9867ce70;border-radius:20px;padding:7px 13px;letter-spacing:.5px}
  #pagina-candidaturas .cp-applications-hero h1{font:750 32px/1.2 Montserrat,Arial,sans-serif;color:#fff;margin:0 0 8px;letter-spacing:-.8px}#pagina-candidaturas .cp-applications-hero p{font:400 13px/1.7 Montserrat,Arial,sans-serif;color:#f4ebff;margin:0;max-width:850px}
  .cp-applications-hero-icon{display:grid;place-items:center;width:110px;height:110px;justify-self:center;border-radius:50%;background:#ffffff12;border:1px solid #ffffff30;color:#ebd9ff}.cp-applications-hero-icon svg{width:52px;height:52px}
  @media(max-width:760px){.cp-applications-kicker{font-size:10px;letter-spacing:.5px;flex-wrap:wrap;gap:8px}}
  @media(max-width:600px){#pagina-candidaturas .cp-applications-hero{grid-template-columns:1fr;gap:16px}.cp-applications-hero-icon{justify-self:start}}
  @media(max-width:480px){#pagina-candidaturas .cp-applications-hero{padding:20px}#pagina-candidaturas .cp-applications-hero h1{font-size:28px}}
  #pagina-candidaturas .candidatura-item{padding:22px!important;border:1px solid #e3dbea!important;border-radius:14px!important;background:#fff!important;margin-bottom:16px!important;font-family:Inter,Arial,sans-serif}
  #pagina-candidaturas #listaCandidaturas{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;align-items:start}
  #pagina-candidaturas #listaCandidaturas>.candidatura-item{min-width:0;margin:0!important}
  #pagina-candidaturas #listaCandidaturas>.vazio{grid-column:1/-1}
  #pagina-candidaturas #listaCandidaturas .candidatura-top{display:flex;flex-wrap:wrap;gap:12px}
  #pagina-candidaturas #listaCandidaturas .cp-process-grid{grid-template-columns:1fr}
  #pagina-candidaturas #listaCandidaturas .cp-process-history{grid-column:auto}
  @media(max-width:760px){#pagina-candidaturas #listaCandidaturas{grid-template-columns:1fr}}
  .cp-process-details{margin-top:18px;border-top:1px solid #eee8f4}.cp-process-details>summary{display:flex;align-items:center;justify-content:space-between;gap:12px;list-style:none;cursor:pointer;padding:16px 0 0;color:#63339b;font:650 13px Inter,Arial,sans-serif}.cp-process-details>summary::-webkit-details-marker{display:none}.cp-process-details summary svg{width:18px;height:18px}.cp-process-details[open] summary svg{transform:rotate(90deg)}.cp-process-details>summary:focus-visible{outline:2px solid #7540ae;outline-offset:4px}
  #pagina-candidaturas .cp-application-viewed{display:flex;align-items:center;gap:10px;margin-top:14px;padding:10px 12px;background:#e8f5f1;border:1px solid #cce7df;border-radius:9px;color:#0f766e;font:12px/1.5 Inter,Arial,sans-serif}.cp-application-viewed svg{width:20px;height:20px;flex:0 0 20px}.cp-application-viewed strong,.cp-application-viewed small{display:block}.cp-application-viewed small{font-size:11px}
  .cp-process-trigger{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:16px 0 0;border:0;background:transparent;color:#63339b;font:650 13px Inter,Arial,sans-serif;cursor:pointer;text-align:left}.cp-process-trigger svg{width:18px;height:18px}.cp-process-trigger:focus-visible{outline:2px solid #7540ae;outline-offset:4px}
  body.cp-process-modal-open{overflow:hidden}.cp-process-modal{box-sizing:border-box;width: min(860px,calc(100% - 40px));max-height:calc(100dvh - 48px);margin:auto;padding:0;border:1px solid #e3dbea;border-radius:18px;background:#fff;color:#30213f;box-shadow:0 24px 90px #241b3940;font-family:Inter,Arial,sans-serif;overflow:auto}.cp-process-modal::backdrop{background:#241b3999;backdrop-filter:blur(3px)}.cp-process-modal-header{position:sticky;top:0;z-index:1;display:flex;align-items:flex-start;justify-content:space-between;gap:18px;padding:24px 28px 20px;background:#fff;border-bottom:1px solid #eee8f4}.cp-process-modal-header>div{min-width:0}.cp-process-modal-header span{font-size:10px;font-weight:700;letter-spacing:.1em;color:#7951a3}.cp-process-modal-header h2{margin:8px 0;font:700 22px/1.3 Inter,Arial,sans-serif;overflow-wrap:anywhere}.cp-process-modal-subtitle{margin:0;font-size:12px;line-height:1.6;color:#82718f}.cp-process-modal-close{display:grid;place-items:center;flex:0 0 36px;width:36px;height:36px;padding:6px;border:1px solid #e3dbea;border-radius:10px;background:#faf8fd;color:#63339b;cursor:pointer}.cp-process-modal-close svg{width:22px;height:22px}.cp-process-modal .cp-process-body{padding:24px 28px}.cp-process-modal-footer{display:flex;justify-content:flex-end;padding:16px 28px;border-top:1px solid #eee8f4}.cp-process-modal-footer button{padding:10px 24px;border:0;border-radius:9px;background:#63339b;color:#fff;font:600 13px Inter,Arial,sans-serif;cursor:pointer}.cp-process-modal button:focus-visible{outline:2px solid #7540ae;outline-offset:3px}
  @media(max-width:600px){.cp-process-modal{width:calc(100% - 20px);max-height:calc(100dvh - 24px);border-radius:14px}.cp-process-modal-header{padding:18px}.cp-process-modal-header h2{font-size:19px}.cp-process-modal .cp-process-body{padding:18px}.cp-process-modal-footer{padding:14px 18px}}
  .cp-process-body{padding-top:18px;color:#5f536d;font:400 13px/1.6 Inter,Arial,sans-serif}.cp-process-note{padding:16px 18px;border-radius:10px;background:#f7f2fc;border:1px solid #e7dcf3}.cp-process-note strong{color:#51258a}.cp-process-note p{margin:4px 0 0}
  .cp-process-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:22px}.cp-process-grid section{min-width:0}.cp-process-grid h4{margin:0 0 14px;font-size:14px;color:#30213f}.cp-process-grid p{margin:0 0 10px;overflow-wrap:anywhere}.cp-process-grid small{font-size:11px;color:#8b7f96}.cp-process-steps{list-style:none;margin:0;padding:0}.cp-process-steps li{display:flex;gap:12px;padding:0 0 16px;position:relative}.cp-process-steps li>span{display:grid;place-items:center;flex:0 0 30px;height:30px;border-radius:50%;background:#f4f1f7;color:#9c90aa}.cp-process-steps svg{width:16px;height:16px}.cp-process-steps strong,.cp-process-steps small{display:block}.cp-process-steps strong{font-size:12px}.cp-process-steps .is-current>span{background:#62329b;color:#fff}.cp-process-steps .is-current strong{color:#62329b}.cp-process-grid dl{display:grid;grid-template-columns:auto 1fr;gap:10px 18px;margin:0}.cp-process-grid dt{color:#8b7f96}.cp-process-grid dd{margin:0;overflow-wrap:anywhere;font-weight:600}.cp-process-history{grid-column:1/-1;border-top:1px solid #eee8f4;padding-top:18px}.cp-process-history ul{list-style:none;padding:0;margin:0}.cp-process-history li{display:flex;justify-content:space-between;gap:15px;margin:0 0 12px}.cp-process-history li strong{font-size:12px}.cp-process-history li span{font-size:11px}.cp-process-ended{color:#9d4052}
  @media(max-width:600px){#pagina-candidaturas>.container-menor{width:calc(100% - 28px)!important;padding-top:22px!important}.cp-applications-intro h1{font-size:24px}.cp-process-grid{grid-template-columns:1fr}.cp-process-history{grid-column:auto}#pagina-candidaturas .candidatura-item{padding:17px!important}.cp-process-grid dl{grid-template-columns:1fr;gap:3px}.cp-process-grid dd{margin-bottom:9px}}

  html body dialog.cp-process-modal[open]{position:fixed!important;inset:0!important;margin:auto!important;box-sizing:border-box!important;max-width:calc(100vw - 32px)!important;max-height:calc(100dvh - 40px)!important;height:fit-content!important;min-height:0!important}
  @media(min-width:900px) and (max-height:650px){.cp-process-modal .cp-process-modal-header{padding:12px 20px!important}.cp-process-modal .cp-process-body{padding:10px 20px 14px!important}.cp-process-modal .cp-process-grid{gap:10px 16px!important}.cp-process-modal .cp-process-steps li{gap:4px!important}.cp-process-modal .cp-process-grid>section:first-child{padding-bottom:8px!important}}
  @media(min-width:900px){
   dialog.cp-process-modal{width:min(1100px,calc(100vw - 48px));max-height:calc(100dvh - 40px);overflow:auto;border-radius:16px}
   .cp-process-modal .cp-process-modal-header{position:static;padding:18px 24px 14px;align-items:center}
   .cp-process-modal .cp-process-modal-header h2{font-size:21px;margin:5px 0}
   .cp-process-modal .cp-process-body{padding:14px 24px 20px;font-size:12px;line-height:1.5}
   .cp-process-modal .cp-process-note{padding:10px 14px}
   .cp-process-modal .cp-process-grid{grid-template-columns:1fr 1fr 1fr;gap:12px 20px;margin-top:12px}
   .cp-process-modal .cp-process-grid>section:first-child{grid-column:1/-1;padding-bottom:12px;border-bottom:1px solid #eee8f4}
   .cp-process-modal .cp-process-grid h4{margin-bottom:9px;font-size:13px}
   .cp-process-modal .cp-process-steps{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}
   .cp-process-modal .cp-process-steps li{display:flex;flex-direction:column;gap:7px;padding:0;align-items:flex-start}
   .cp-process-modal .cp-process-steps li>span{flex:0 0 28px;width:28px;height:28px}
   .cp-process-modal .cp-process-steps strong{font-size:11px;line-height:1.4}
   .cp-process-modal .cp-process-steps small{font-size:10px;line-height:1.4}
   .cp-process-modal .cp-process-grid>section:first-child>small{display:block;margin-top:8px}
   .cp-process-modal .cp-process-grid dl{gap:6px 12px;font-size:11px}
   .cp-process-modal .cp-process-grid p{margin-bottom:7px}
   .cp-process-modal .cp-process-history{padding-top:12px}
   .cp-process-modal .cp-process-history ul{display:flex;gap:28px;flex-wrap:wrap}
   .cp-process-modal .cp-process-history li{display:flex;flex-direction:column;gap:3px;margin-bottom:6px}
   .cp-process-modal .cp-process-modal-footer{padding:10px 24px}
  }

  .cp-process-modal .cp-process-tabs{display:flex;gap:24px;border-bottom:1px solid #dce4e7;margin-bottom:18px}.cp-process-tabs button{display:flex;align-items:center;gap:9px;border:0;border-bottom:3px solid transparent;background:transparent;color:#43516a;padding:12px 8px;font:600 13px Inter,Arial,sans-serif;cursor:pointer}.cp-process-tabs button svg{width:23px;height:23px;color:#0f766e}.cp-process-tabs button[aria-selected=true]{color:#63339b;border-bottom-color:#63339b}.cp-process-tabs button[aria-selected=true] svg{color:#63339b}
  .cp-process-modal .cp-process-tab-content>[hidden]{display:none!important}.cp-process-tab-content h3,.cp-process-tab-content h4{color:#243247;font-size:15px;margin:16px 0 12px}.cp-process-tab-content .cp-process-note{margin-bottom:18px}.cp-process-tab-content .cp-process-steps{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}.cp-process-tab-content .cp-process-steps li{flex-direction:column;gap:7px;padding-bottom:0}.cp-process-tab-content .cp-process-steps li>span{flex:none;width:32px;height:32px}
  .cp-process-support{display:grid;grid-template-columns:1.4fr 1fr;gap:16px;margin-top:20px}.cp-process-support>section{padding:18px;border:1px solid #cce7df;border-radius:11px;background:#fff;min-width:0}.cp-process-support .cp-interview-preview{background:#e8f5f1}.cp-process-support h4{margin:0 0 9px;font-size:14px}.cp-process-support p{margin:8px 0;line-height:1.6}.cp-interview-heading{display:flex;gap:10px;align-items:center}.cp-interview-heading svg{width:27px;height:27px;color:#0f766e}.cp-interview-heading h4{margin:0 0 8px}.cp-interview-preview>strong{font-size:21px;color:#243247}.cp-interview-buttons{display:flex;flex-wrap:wrap;gap:9px;margin:14px 0 8px}.cp-interview-buttons button{border:1px solid #63339b;border-radius:8px;padding:10px 13px;background:#fff;color:#63339b;font-weight:600;cursor:pointer}.cp-interview-buttons [data-join]{background:#63339b;color:#fff}.cp-interview-buttons button:disabled{opacity:.5;cursor:default}.cp-message-preview button{display:inline-flex;align-items:center;gap:8px;border:0;background:transparent;color:#0f766e;padding:8px 0;font-weight:700;cursor:pointer}.cp-message-preview button svg{width:17px;height:17px}.cp-process-tab-content small{font-size:11px;color:#64748b}.cp-process-tab-content dl{display:grid;grid-template-columns:180px 1fr;gap:12px}.cp-process-tab-content dd{margin:0;font-weight:600;overflow-wrap:anywhere}.cp-process-tab-content dt{color:#64748b}.cp-process-messages article{padding:16px;background:#e8f5f1;border:1px solid #cce7df;border-radius:10px;margin:12px 0}.cp-process-messages small{display:block;margin-top:4px}.cp-process-messages p{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.7}
  @media(max-width:700px){.cp-process-modal .cp-process-tabs{gap:5px;justify-content:space-between}.cp-process-tabs button{padding:10px 3px;font-size:11px;gap:5px}.cp-process-tabs button svg{width:18px;height:18px}.cp-process-tab-content .cp-process-steps{grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.cp-process-support{grid-template-columns:1fr}.cp-process-tab-content dl{grid-template-columns:1fr;gap:5px}.cp-process-tab-content dd{margin-bottom:10px}}

  /* Layout da referência: dimensões explícitas evitam estilos globais nos cards. */
  html body dialog.cp-process-modal[open]{width:min(1030px,calc(100vw - 48px))!important;background:#fff!important;border-radius:14px!important;color:#243247!important}
  html body .cp-process-modal *{box-sizing:border-box}
  html body .cp-process-modal .cp-process-modal-header{display:flex!important;position:static!important;background:#fff!important;color:#243247!important;padding:22px 28px 10px!important;border:0!important;min-height:0!important;height:auto!important;gap:18px!important}
  html body .cp-process-modal .cp-process-modal-header h2{font:750 25px/1.25 Inter,Arial,sans-serif!important;margin:8px 0 5px!important;color:#243247!important}
  html body .cp-process-modal .cp-process-modal-header>div>span{font:650 10px/1.5 Inter,Arial,sans-serif!important;color:#63339b!important}
  html body .cp-process-modal .cp-process-modal-close{background:#fff!important;border:1px solid #cbd5e1!important;width:34px!important;height:34px!important;border-radius:6px!important;padding:6px!important;flex:0 0 34px!important}
  html body .cp-process-modal .cp-process-modal-close svg{width:20px!important;height:20px!important}
  html body .cp-process-modal .cp-process-body{padding:0 28px 24px!important;font:400 12px/1.5 Inter,Arial,sans-serif!important}
  html body .cp-process-modal .cp-process-tabs{gap:36px!important;margin:0 0 16px!important;padding:0!important;background:#fff!important}
  html body .cp-process-modal .cp-process-tabs button{padding:16px 12px 13px!important;background:transparent!important;border-radius:0!important;font:650 13px/1.4 Inter,Arial,sans-serif!important;min-height:0!important}
  html body .cp-process-modal .cp-process-note{display:block!important;padding:12px 16px!important;margin-bottom:18px!important;border-radius:8px!important;background:#e8f5f1!important;border:0!important;min-height:0!important}
  html body .cp-process-modal .cp-process-note strong{font-size:15px!important;color:#0f766e!important}.cp-process-modal .cp-process-note p{margin:3px 0 0!important;font-size:12px!important}
  html body .cp-process-modal .cp-process-tab-content h4{font:700 17px/1.4 Inter,Arial,sans-serif!important;margin:0 0 18px!important;color:#243247!important}
  html body .cp-process-modal .cp-process-steps{gap:0!important;margin:0 0 12px!important;padding:0!important}
  html body .cp-process-modal .cp-process-steps li{position:relative!important;align-items:center!important;text-align:center!important;gap:7px!important;padding:0 6px!important;background:transparent!important;border:0!important;min-height:0!important}
  html body .cp-process-modal .cp-process-steps li:not(:last-child):after{content:'';position:absolute;top:17px;left:calc(50% + 20px);width:calc(100% - 40px);border-top:2px solid #d8e0e5}
  html body .cp-process-modal .cp-process-steps li>span{position:relative;z-index:1;width:36px!important;height:36px!important;flex:none!important;border:1px solid #d8e0e5!important;background:#fff!important;color:#8995a6!important}
  html body .cp-process-modal .cp-process-steps li:first-child>span{background:#0f766e!important;color:#fff!important;border-color:#0f766e!important}
  html body .cp-process-modal .cp-process-steps li.is-current>span{background:#63339b!important;border-color:#63339b!important;color:#fff!important;box-shadow:0 0 0 4px #f1e8fc}
  html body .cp-process-modal .cp-process-steps strong{font-size:11px!important;line-height:1.4!important;color:#243247!important}
  html body .cp-process-modal .cp-process-steps small{font-size:10px!important;line-height:1.4!important}
  html body .cp-process-modal .cp-process-support{grid-template-columns:1.45fr 1fr!important;gap:14px!important;margin-top:20px!important}
  html body .cp-process-modal .cp-process-support>section{position:relative!important;display:block!important;padding:18px 18px 16px 90px!important;border:1px solid #bfe0da!important;border-radius:9px!important;min-height:0!important;height:auto!important;box-shadow:none!important;color:#243247!important}
  html body .cp-process-modal .cp-support-icon{position:absolute;left:20px;top:22px;display:grid;place-items:center;width:52px;height:52px;border-radius:9px;background:#d7efeb;color:#0f766e}
  html body .cp-process-modal .cp-support-icon svg{width:30px!important;height:30px!important}
  html body .cp-process-modal .cp-interview-heading>svg{display:none!important}
  html body .cp-process-modal .cp-process-support h4{font:700 13px/1.4 Inter,Arial,sans-serif!important;margin:0 0 7px!important}
  html body .cp-process-modal .cp-interview-preview>strong{font:750 20px/1.35 Inter,Arial,sans-serif!important;display:block!important;margin:0!important}
  html body .cp-process-modal .cp-process-support p{font:400 12px/1.55 Inter,Arial,sans-serif!important;margin:5px 0!important;min-height:0!important;overflow-wrap:anywhere}
  html body .cp-process-modal .cp-interview-buttons{display:flex!important;gap:8px!important;margin:12px 0 7px!important}
  html body .cp-process-modal .cp-interview-buttons button{width:auto!important;min-height:0!important;height:auto!important;padding:9px 12px!important;border-radius:6px!important;font:650 11px/1.4 Inter,Arial,sans-serif!important}
  html body .cp-process-modal .cp-message-preview button{width:auto!important;margin:10px 0 0!important;padding:4px 0!important;font:700 12px/1.4 Inter,Arial,sans-serif!important;background:transparent!important;color:#0f766e!important}
  @media(max-width:700px){html body .cp-process-modal .cp-process-modal-header{padding:16px 18px 8px!important}html body .cp-process-modal .cp-process-modal-header h2{font-size:20px!important}html body .cp-process-modal .cp-process-body{padding:0 18px 18px!important}html body .cp-process-modal .cp-process-tabs{gap:4px!important}html body .cp-process-modal .cp-process-tabs button{font-size:10px!important;padding:12px 3px!important}html body .cp-process-modal .cp-process-support{grid-template-columns:1fr!important}html body .cp-process-modal .cp-process-steps li:nth-child(3):after{display:none}html body .cp-process-modal .cp-process-support>section{padding-left:78px!important}.cp-support-icon{left:14px!important;width:46px!important;height:46px!important}}

  /* Mesmo quadro em todas as abas; apoios compactos no computador. */
  @media(min-width:701px){
   html body dialog.cp-process-modal[open]{display:flex!important;flex-direction:column!important;height:min(570px,calc(100dvh - 40px))!important;max-height:calc(100dvh - 40px)!important;overflow:hidden!important}
   html body .cp-process-modal .cp-process-modal-header{flex:0 0 auto!important;padding:17px 24px 7px!important}
   html body .cp-process-modal .cp-process-modal-header h2{font-size:23px!important;margin:5px 0!important}
   html body .cp-process-modal .cp-process-body{flex:1 1 auto!important;min-height:0!important;display:flex!important;flex-direction:column!important;padding:0 24px 16px!important;overflow:hidden!important}
   html body .cp-process-modal .cp-process-tabs{flex:0 0 auto!important;margin-bottom:12px!important}
   html body .cp-process-modal .cp-process-tabs button{padding:12px 10px!important}
   html body .cp-process-modal .cp-process-tab-content{flex:1 1 auto!important;min-height:0!important;overflow:auto!important;scrollbar-width:thin}
   html body .cp-process-modal .cp-process-note{padding:9px 13px!important;margin-bottom:12px!important}
   html body .cp-process-modal .cp-process-tab-content h4{margin-bottom:12px!important;font-size:15px!important}
   html body .cp-process-modal .cp-process-support{margin-top:12px!important;gap:12px!important}
   html body .cp-process-modal .cp-process-support>section{padding:13px 14px 12px 70px!important}
   html body .cp-process-modal .cp-support-icon{left:14px!important;top:15px!important;width:42px!important;height:42px!important}
   html body .cp-process-modal .cp-support-icon svg{width:25px!important;height:25px!important}
   html body .cp-process-modal .cp-process-support h4{font-size:12px!important;margin-bottom:5px!important}
   html body .cp-process-modal .cp-interview-preview>strong{font-size:17px!important}
   html body .cp-process-modal .cp-process-support p{font-size:11px!important;line-height:1.4!important;margin:4px 0!important}
   html body .cp-process-modal .cp-interview-buttons{margin:8px 0 5px!important;gap:6px!important}
   html body .cp-process-modal .cp-interview-buttons button{padding:7px 9px!important;font-size:10px!important}
   html body .cp-process-modal .cp-process-support small{font-size:10px!important;line-height:1.35!important}
   html body .cp-process-modal .cp-message-preview button{margin-top:7px!important;font-size:11px!important}
  }
  @media(min-width:701px) and (max-height:650px){html body .cp-process-modal .cp-process-note p{display:none!important}html body .cp-process-modal .cp-process-steps li>span{width:28px!important;height:28px!important}html body .cp-process-modal .cp-process-steps li:not(:last-child):after{top:13px!important}html body .cp-process-modal .cp-process-steps li{gap:4px!important}html body .cp-process-modal .cp-process-support{margin-top:8px!important}}
  @media(max-width:700px){html body dialog.cp-process-modal[open]{height:calc(100dvh - 32px)!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}html body .cp-process-modal .cp-process-modal-header{flex:none!important}html body .cp-process-modal .cp-process-body{flex:1!important;min-height:0!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}html body .cp-process-modal .cp-process-tabs{flex:none!important}html body .cp-process-modal .cp-process-tab-content{flex:1!important;min-height:0!important;overflow:auto!important}}

  @media(min-width:701px){
   html body .cp-process-modal .cp-process-tab-content[data-active-tab="0"]{overflow:visible!important;flex:1 1 auto!important}
   html body .cp-process-modal #cpProcessPane0{height:100%;display:flex;flex-direction:column;min-height:0;gap:0}
   html body .cp-process-modal #cpProcessPane0[hidden]{display:none!important}
   html body .cp-process-modal #cpProcessPane0>.cp-process-note{flex:none!important;margin-bottom:10px!important;padding:8px 12px!important}
   html body .cp-process-modal #cpProcessPane0>section{flex:none!important}
   html body .cp-process-modal #cpProcessPane0>section>h4{font-size:14px!important;margin:0 0 10px!important}
   html body .cp-process-modal #cpProcessPane0>section>small{display:block;font-size:10px!important;margin-top:6px!important}
   html body .cp-process-modal #cpProcessPane0 .cp-process-support{margin-top:10px!important;align-items:start!important}
   html body .cp-process-modal #cpProcessPane0 .cp-process-support>section{padding:10px 12px 10px 62px!important}
   html body .cp-process-modal #cpProcessPane0 .cp-support-icon{width:34px!important;height:34px!important;left:13px!important;top:12px!important}
   html body .cp-process-modal #cpProcessPane0 .cp-support-icon svg{width:22px!important;height:22px!important}
   html body .cp-process-modal #cpProcessPane0 .cp-interview-preview>strong{font-size:16px!important}
   html body .cp-process-modal #cpProcessPane0 .cp-process-support p{font-size:10px!important;line-height:1.3!important;margin:3px 0!important}
   html body .cp-process-modal #cpProcessPane0 .cp-interview-buttons{margin:6px 0!important;flex-wrap:nowrap!important}
   html body .cp-process-modal #cpProcessPane0 .cp-interview-buttons button{padding:6px 8px!important;white-space:nowrap!important}
   html body .cp-process-modal #cpProcessPane0 .cp-interview-feedback:empty{display:none!important}
   html body .cp-process-modal #cpProcessPane0 .cp-process-support small{font-size:9px!important}
  }

  html body .cp-process-modal .cp-full-job{display:grid;grid-template-columns:280px minmax(0,1fr);gap:18px;align-items:start;color:#243247}
  html body .cp-process-modal .cp-full-job h3{display:flex;align-items:center;gap:8px;margin:0 0 13px;font:700 14px/1.4 Inter,Arial,sans-serif;color:#243247}
  html body .cp-process-modal .cp-full-job h3 svg{width:20px;height:20px;color:#0f766e}
  html body .cp-process-modal .cp-job-facts{padding:16px;background:#e8f5f1;border:1px solid #cce7df;border-radius:10px}
  html body .cp-process-modal .cp-job-facts dl{display:grid;grid-template-columns:1fr;gap:10px;margin:0}
  html body .cp-process-modal .cp-job-facts dl>div{display:grid;grid-template-columns:100px 1fr;gap:9px}
  html body .cp-process-modal .cp-job-facts dt{font-size:11px;color:#526575}
  html body .cp-process-modal .cp-job-facts dd{font-size:11px;line-height:1.5;font-weight:600;margin:0;overflow-wrap:anywhere}
  html body .cp-process-modal .cp-job-description{display:grid;gap:12px}
  html body .cp-process-modal .cp-job-description>section{padding:15px 17px;border:1px solid #d8e0e5;border-radius:10px;background:#fff}
  html body .cp-process-modal .cp-job-description p{font:400 12px/1.7 Inter,Arial,sans-serif;margin:0;white-space:pre-wrap;overflow-wrap:anywhere}
  html body .cp-process-modal .cp-job-description .cp-job-empty{color:#64748b;font-size:11px}
  @media(max-width:700px){html body .cp-process-modal .cp-full-job{grid-template-columns:1fr}html body .cp-process-modal .cp-job-facts dl{grid-template-columns:1fr 1fr}html body .cp-process-modal .cp-job-facts dl>div{grid-template-columns:1fr;gap:2px}}
  @media(prefers-reduced-motion:reduce){#pagina-painel-candidato .cp-profile .cp-stage-card{transition:none}}
  /* Applications header follows the compact illustrated resume header. */
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-hero{
 display:grid!important;grid-template-columns:minmax(0,1fr) 33%!important;gap:12px 16px!important;
 padding:20px 24px 12px!important;min-height:0!important;border:1px solid #bcd8e3!important;border-radius:16px!important;
 background:radial-gradient(ellipse at 84% 15%,#d6e9f1 0,transparent 58%),linear-gradient(115deg,#f6fafc,#e5f0f5)!important;
 box-shadow:0 5px 20px #2854670a!important;overflow:hidden!important;color:#123946!important;
}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-hero:after{width:420px;height:420px;right:-90px;bottom:25px;border-color:#83b0c555;box-shadow:0 0 0 75px #8cb9cc12;pointer-events:none}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-hero-copy{grid-column:1;grid-row:1;min-height:216px;display:flex;flex-direction:column;justify-content:center;min-width:0;z-index:1}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-back{align-self:flex-start;border:0!important;background:transparent!important;color:#39768a!important;font-size:11px!important;padding:0!important;min-height:24px;margin:0!important}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-kicker{display:flex;align-items:center;flex-wrap:wrap;color:#456675!important;font-size:10px!important;font-weight:600;letter-spacing:.7px;margin:10px 0 8px!important;gap:10px}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-kicker span{background:#ffffffaa!important;color:#245e73!important;border:1px solid #83b0c5!important;border-radius:7px;padding:4px 9px;font-size:9px!important}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-hero h1{font-size:clamp(23px,2.4vw,32px)!important;line-height:1.12!important;font-weight:750!important;color:#123946!important;letter-spacing:-.7px!important;margin:0 0 9px!important}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-hero p{font-size:12px!important;line-height:1.55!important;font-weight:500!important;color:#52727e!important;max-width:560px!important;margin:0!important}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:13px}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-chips span{display:inline-flex;align-items:center;gap:6px;background:#fff5!important;border:1px solid #b6d3e0;border-radius:18px;padding:5px 10px;font-size:10px!important;color:#245e73!important}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-chips span:before{content:'○';display:grid;place-items:center;width:17px;height:17px;border-radius:50%;background:#dcecf3;color:#39768a;font-size:10px}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-art{grid-column:2;grid-row:1;display:flex;align-items:center;justify-content:center;min-width:0;max-height:216px}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-art svg{display:block;width:100%!important;height:100%!important;max-height:216px;overflow:visible}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-rail{grid-column:1/-1;grid-row:2;display:flex;align-items:center;gap:18px;min-height:40px;padding:9px 14px;border:1px solid #cde1ea;border-radius:11px;background:#ffffffba}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-rail strong{color:#123946!important;font-size:12px!important;font-weight:700!important;white-space:nowrap}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-rail span{color:#52727e!important;font-size:10px!important;border-left:1px solid #bdd6e1;padding-left:18px}
@media(max-width:760px){
 html body #pagina-candidaturas#pagina-candidaturas .cp-applications-hero{padding:18px 18px 12px!important;grid-template-columns:minmax(0,1fr) 29%!important}
 html body #pagina-candidaturas#pagina-candidaturas .cp-applications-hero h1{font-size:24px!important}
 html body #pagina-candidaturas#pagina-candidaturas .cp-applications-art{max-height:180px;align-self:center}
 html body #pagina-candidaturas#pagina-candidaturas .cp-applications-hero-copy{min-height:0}
}
@media(max-width:540px){
 html body #pagina-candidaturas#pagina-candidaturas .cp-applications-hero{grid-template-columns:1fr!important;gap:14px!important;padding:18px 16px 12px!important}
 html body #pagina-candidaturas#pagina-candidaturas .cp-applications-art{display:none}
 html body #pagina-candidaturas#pagina-candidaturas .cp-applications-hero h1{font-size:25px!important}
 html body #pagina-candidaturas#pagina-candidaturas .cp-applications-chips{gap:5px}
 html body #pagina-candidaturas#pagina-candidaturas .cp-applications-chips span{font-size:9px!important;padding:4px 7px}
 html body #pagina-candidaturas#pagina-candidaturas .cp-applications-rail{gap:9px;padding:9px 10px;flex-wrap:wrap}
 html body #pagina-candidaturas#pagina-candidaturas .cp-applications-rail span{border:0;padding:0}
}

/* Compact geometry and independent HTML feature cards. */
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-hero{height:280px!important;grid-template-rows:minmax(0,1fr) auto!important}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-hero-copy{min-height:0!important}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-chips{gap:10px!important;margin-top:14px!important}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-chips span{min-height:36px!important;border-radius:9px!important;padding:7px 12px!important;font-weight:600!important;background:#ffffff88!important}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-chips span:before{display:none!important}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-chips svg{width:19px!important;height:19px!important;flex:0 0 19px!important;color:#245e73!important}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-art{height:100%!important;max-height:216px!important;min-height:0!important}
html body #pagina-candidaturas#pagina-candidaturas .cp-applications-art>svg{width:100%!important;height:100%!important;max-height:216px!important}
@layer site-typography{
 #pagina-candidaturas#pagina-candidaturas .cp-applications-hero p{color:#52727e!important}
 #pagina-candidaturas#pagina-candidaturas .cp-applications-kicker span,#pagina-candidaturas#pagina-candidaturas .cp-applications-chips span{color:#245e73!important}
 #pagina-candidaturas#pagina-candidaturas .cp-applications-rail span{color:#52727e!important}
}
@media(max-width:760px){html body #pagina-candidaturas#pagina-candidaturas .cp-applications-hero{height:auto!important;min-height:250px!important}}
@media(max-width:540px){html body #pagina-candidaturas#pagina-candidaturas .cp-applications-hero{height:auto!important;min-height:0!important}html body #pagina-candidaturas#pagina-candidaturas .cp-applications-chips span{min-height:30px!important;padding:5px 7px!important}html body #pagina-candidaturas#pagina-candidaturas .cp-applications-chips svg{width:15px!important;height:15px!important;flex-basis:15px!important}}

/* Compact SVG status filters: petroleum palette. */
html body #cpApplicationFilters#cpApplicationFilters{padding:14px 16px!important;border:1px solid #cddfe9!important;border-radius:12px!important;background:#fff!important;box-shadow:0 3px 14px #174e6105!important}
html body #cpApplicationFilters#cpApplicationFilters .cp-application-filter-buttons{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:8px!important}
html body #cpApplicationFilters#cpApplicationFilters [data-cp-filter]{--filter-icon-bg:#eaf2f7;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:flex-start!important;gap:9px!important;height:66px!important;min-height:66px!important;min-width:0!important;padding:9px 10px!important;border:1px solid #cddfe9!important;border-radius:9px!important;background:#fff!important;color:#245e73!important;text-align:left!important;grid-column:auto!important;box-shadow:none!important;transition:background .15s,border-color .15s}
html body #cpApplicationFilters#cpApplicationFilters [data-cp-filter]:hover{background:#f3f8fa!important;border-color:#80adbf!important}
html body #cpApplicationFilters#cpApplicationFilters .cp-filter-icon{display:grid!important;place-items:center!important;flex:0 0 34px!important;width:34px!important;height:36px!important;background:var(--filter-icon-bg)!important;color:inherit!important;border-radius:8px!important}
html body #cpApplicationFilters#cpApplicationFilters .cp-filter-icon svg{display:block!important;width:25px!important;height:25px!important;color:inherit!important}
html body #cpApplicationFilters#cpApplicationFilters .cp-filter-copy{display:flex!important;flex-direction:column!important;justify-content:center!important;gap:3px!important;min-width:0!important;color:inherit!important}
html body #cpApplicationFilters#cpApplicationFilters [data-cp-filter] strong{display:block!important;font:700 24px/1 Montserrat,Arial,sans-serif!important;color:inherit!important}
html body #cpApplicationFilters#cpApplicationFilters .cp-filter-label{font:500 10px/1.3 Montserrat,Arial,sans-serif!important;color:inherit!important;overflow-wrap:normal!important;white-space:normal!important}
html body #cpApplicationFilters#cpApplicationFilters [data-cp-filter=contratadas]{--filter-icon-bg:#dfefef;background:#f1f8f8!important;border-color:#badbdf!important;color:#246375!important}
html body #cpApplicationFilters#cpApplicationFilters [data-cp-filter][aria-pressed=true]{--filter-icon-bg:#ffffff24;background:linear-gradient(120deg,#245e73,#174e61)!important;border-color:#245e73!important;color:#fff!important;box-shadow:0 2px 6px #174e611a!important}
html body #cpApplicationFilters#cpApplicationFilters .cp-application-result-row{margin-top:12px!important;gap:10px!important}
html body #cpApplicationFilters#cpApplicationFilters #cpApplicationResult{font-size:12px!important;font-weight:500!important;color:#638092!important}
html body #cpApplicationFilters#cpApplicationFilters .cp-application-sync{font-size:10px!important;color:#748a98!important}
html body #cpApplicationFilters#cpApplicationFilters #cpApplicationRefresh{display:inline-flex!important;align-items:center!important;gap:7px!important;padding:7px 11px!important;border:1px solid #c5dae5!important;border-radius:8px!important;color:#315f75!important;background:#fff!important;font-size:11px!important;min-height:32px!important}
html body #cpApplicationFilters#cpApplicationFilters #cpApplicationRefresh svg{width:18px!important;height:18px!important}
html body #cpApplicationFilters#cpApplicationFilters [data-cp-filter]:focus-visible{outline:3px solid #93bdcf!important;outline-offset:3px!important}
@layer site-typography{#cpApplicationFilters#cpApplicationFilters .cp-filter-label,#cpApplicationFilters#cpApplicationFilters .cp-filter-copy{color:inherit!important}}
@media(min-width:1001px) and (max-width:1200px){html body #cpApplicationFilters#cpApplicationFilters [data-cp-filter]{gap:6px!important;padding:8px!important}html body #cpApplicationFilters#cpApplicationFilters .cp-filter-icon{width:28px!important;flex-basis:28px!important}html body #cpApplicationFilters#cpApplicationFilters .cp-filter-label{font-size:9px!important}}
@media(max-width:1000px){html body #cpApplicationFilters#cpApplicationFilters .cp-application-filter-buttons{grid-template-columns:repeat(4,minmax(0,1fr))!important}}
@media(max-width:540px){html body #cpApplicationFilters#cpApplicationFilters{padding:12px!important}html body #cpApplicationFilters#cpApplicationFilters .cp-application-filter-buttons{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important}html body #cpApplicationFilters#cpApplicationFilters [data-cp-filter]{height:62px!important;min-height:62px!important}html body #cpApplicationFilters#cpApplicationFilters [data-cp-filter=todas]{grid-column:1/-1!important;height:54px!important;min-height:54px!important}html body #cpApplicationFilters#cpApplicationFilters [data-cp-filter=todas] .cp-filter-copy{flex-direction:row!important;align-items:center!important;gap:10px!important}html body #cpApplicationFilters#cpApplicationFilters .cp-filter-label{font-size:11px!important}}
@media(prefers-reduced-motion:reduce){html body #cpApplicationFilters#cpApplicationFilters [data-cp-filter]{transition:none}}
`;document.head.appendChild(style);
  window.addEventListener('popstate',refresh);window.addEventListener('storage',refresh);document.addEventListener('empregamais:candidato-sincronizado',refresh);document.addEventListener('empregamais:candidaturas-sincronizadas',refresh);refresh();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
