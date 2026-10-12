(function(){
'use strict';
var style=document.createElement('style');style.id='em-professional-candidate-tabs';style.textContent=`
html body #emCandidateDetails{font-family:Inter,Arial,sans-serif!important;border:1px solid #e1e7ef!important;border-radius:16px!important;box-shadow:0 24px 80px #10274430!important}
html body #emCandidateDetails .em-wide-tabs{display:flex!important;gap:0!important;border-bottom:1px solid #e0e7f0!important}
html body #emCandidateDetails .em-wide-tabs button{flex:1!important;border:0!important;border-bottom:2px solid transparent!important;border-radius:0!important;outline:none!important;background:transparent!important;color:#66768d!important;font:500 13px/1.3 Inter,Arial,sans-serif!important;padding:13px 6px!important}
html body #emCandidateDetails .em-wide-tabs button.active{border-bottom-color:#086be6!important;color:#086be6!important;font-weight:700!important;background:transparent!important}
html body #emCandidateDetails .em-wide-tabs button:focus-visible{outline:2px solid #86bfff!important;outline-offset:-3px!important}
html body #emCandidateDetails .em-wide-overview{grid-template-columns:1fr 1.08fr 1fr!important;gap:16px!important;align-items:stretch!important}
html body #emCandidateDetails .em-wide-block{border:1px solid #e0e7f0!important;border-radius:12px!important;padding:18px!important;background:#fff!important}
html body #emCandidateDetails .em-wide-block h3{font:700 17px/1.35 Inter,Arial,sans-serif!important;color:#162b48!important;margin-bottom:16px!important}
html body #emCandidateDetails .em-wide-block p{font:400 12px/1.55 Inter,Arial,sans-serif!important;color:#63738b!important;margin:10px 0!important}
html body #emCandidateDetails .em-wide-block svg{width:19px!important;height:19px!important}
html body #emCandidateDetails .em-wide-workflow .em-gc27-stagebox{display:flex!important}
html body #emCandidateDetails .em-wide-workflow .em-gc27-stagebox strong{font:500 12px/1.4 Inter,Arial,sans-serif!important;color:#65758e!important}
html body #emCandidateDetails .em-wide-workflow select{display:block!important;width:100%!important;border:1px solid #d4dfec!important;background:#fff!important;color:#20354f!important;border-radius:8px!important;font-size:13px!important;height:40px!important}
html body #emCandidateDetails .em-wide-panels>section:not([hidden]){min-height:240px;box-sizing:border-box}
html body #emCandidateDetails [data-detail-panel="notes"],html body #emCandidateDetails [data-detail-panel="resume"],html body #emCandidateDetails [data-detail-panel="history"],html body #emCandidateDetails [data-detail-panel="messages"]{border:1px solid #e0e7f0;border-radius:12px;padding:18px;background:#fff}
html body #emCandidateDetails [data-detail-panel] h3{font:700 17px/1.4 Inter,Arial,sans-serif!important;color:#162b48!important;margin:0 0 16px!important}
html body #emCandidateDetails [data-detail-panel="notes"] textarea,html body #emCandidateDetails [data-detail-panel="messages"] textarea{width:100%!important;box-sizing:border-box!important;border:1px solid #d6e1ee!important;background:#fbfcfe!important;border-radius:9px!important;padding:12px!important;font:400 13px/1.5 Inter,Arial,sans-serif!important;height:100px!important}
html body #emCandidateDetails [data-detail-panel="notes"] button,html body #emCandidateDetails [data-detail-panel="messages"] button{border-radius:8px!important;padding:10px 18px!important;font:600 12px/1.4 Inter,Arial,sans-serif!important}
html body #emCandidateDetails [data-detail-panel="history"]>p{position:relative;margin:0 0 0 8px!important;padding:14px 18px!important;border-left:2px solid #e0e7f0!important;color:#526780!important;font:400 13px/1.5 Inter,Arial,sans-serif!important}
html body #emCandidateDetails [data-detail-panel="history"]>p:before{content:'';position:absolute;left:-5px;top:20px;width:8px;height:8px;border-radius:50%;background:#0876ef}
html body #emCandidateDetails .em-pro-empty{padding:22px;border:1px dashed #d9e3ef;border-radius:10px;background:#fafcfe;color:#73849a;font:400 13px/1.5 Inter,Arial,sans-serif}
@media(max-width:700px){html body #emCandidateDetails .em-wide-overview{grid-template-columns:1fr!important}html body #emCandidateDetails .em-wide-tabs button{flex:1 1 30%!important;font-size:12px!important}}
`;
document.head.appendChild(style);
function upgrade(){var modal=document.getElementById('emCandidateDetails');if(!modal||modal.dataset.professionalTabs)return;var panels=modal.querySelector('.em-wide-panels'),tabs=modal.querySelector('.em-wide-tabs'),overview=modal.querySelector('[data-detail-panel="overview"]');if(!panels||!tabs||!overview)return;modal.dataset.professionalTabs='true';
var message=overview.querySelector('.em-candidate-message');if(message){var panel=document.createElement('section');panel.dataset.detailPanel='messages';panel.hidden=true;panel.appendChild(message);panels.appendChild(panel);var tab=Array.from(tabs.querySelectorAll('button')).find(function(b){return b.textContent.trim()==='Mensagens'});if(tab)tab.onclick=function(){tabs.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b===tab)});panels.querySelectorAll('[data-detail-panel]').forEach(function(p){p.hidden=p!==panel});var input=panel.querySelector('textarea');if(input)input.focus();};}
var resume=panels.querySelector('[data-detail-panel="resume"]');if(resume&&!resume.querySelector('h3')){var title=document.createElement('h3');title.textContent='Currículo do candidato';resume.prepend(title);}
}
new MutationObserver(upgrade).observe(document.body,{childList:true,subtree:true});upgrade();
})();


/* Contact details belong beside the candidate identity; keep the overview compact. */
(function(){
var css=document.createElement('style');css.id='em-candidate-contact-header';
css.textContent=`
html body #emCandidateDetails.em-candidate-reference-v55 .em-candidate-modal-head{display:flex!important;align-items:flex-start!important;gap:16px!important;padding:16px 24px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-candidate-modal-head>div:first-child{flex:1!important;min-height:100px!important;padding-left:84px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-candidate-modal-head small{left:-84px!important;margin-bottom:12px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-wide-avatar{width:66px!important;height:66px!important;top:42px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-header-contact{flex:0 1 330px!important;min-width:0!important;padding:24px 0 0!important;min-height:0!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-header-contact p{display:flex;align-items:center;gap:8px;margin:0 0 5px!important;font-size:14px!important;line-height:1.4!important;color:#20354f!important;overflow-wrap:anywhere}
html body #emCandidateDetails.em-candidate-reference-v55 .em-header-contact svg{width:16px;height:16px;flex-shrink:0;color:#0876ef}
html body #emCandidateDetails.em-candidate-reference-v55 .em-header-contact .em-wide-contact-actions{display:flex!important;margin:8px 0 0!important;padding:0!important;gap:6px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-header-contact .em-wide-contact-actions button{height:auto!important;min-height:30px!important;padding:5px 9px!important;font-size:13px!important;flex:1}
html body #emCandidateDetails.em-candidate-reference-v55 .em-detail-city{display:none!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-wide-overview{grid-template-columns:minmax(0,1.2fr) minmax(0,1fr)!important;gap:16px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-wide-overview .em-wide-block{min-height:0!important;padding:14px 16px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px 16px!important;align-content:start!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary>h3,html body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary>.em-wide-document-actions{grid-column:1/-1!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-wide-overview h3{margin:0 0 10px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary h4{margin:0!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary h4 small{margin:0 0 4px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary .em-detail-summary p{margin:0 0 8px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary .em-detail-summary svg{padding:0!important;width:16px!important;height:16px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary .em-gc27-tags{margin:0!important;align-content:start}
html body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary .em-gc27-tag{padding:4px 8px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary .em-wide-match{margin:0!important;padding:8px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary .em-detail-meter{margin:4px 0!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary .em-wide-document-actions{margin:0!important;padding:0!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary .em-wide-document-actions>small{margin:0!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-wide-workflow .em-wide-hint{margin:5px 0 8px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-wide-workflow .em-detail-note{margin:10px 0 0!important;padding-top:10px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-detail-note p{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
html body #emCandidateDetails.em-candidate-reference-v55 .em-wide-tabs button{flex:1 1 auto!important;white-space:nowrap!important}
html body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-candidate-modal-body{flex:0 0 auto!important;overflow:visible!important}
html body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact{height:auto!important;max-height:none!important}
html body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-panels>section{min-height:0!important}
@media(max-width:760px){
html body #emCandidateDetails.em-candidate-reference-v55 .em-candidate-modal-head{flex-wrap:wrap!important;padding:12px 16px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-header-contact{flex:1 1 100%!important;order:4;padding:0!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-header-contact p{display:inline-flex;margin-right:12px!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-wide-overview{grid-template-columns:1fr!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-wide-tabs{flex-wrap:wrap!important;overflow:visible!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-wide-tabs button{white-space:normal!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-candidate-modal-head>div:first-child{padding-left:0!important;min-height:0!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-candidate-modal-head small{left:0!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-wide-avatar{display:none!important}
html body #emCandidateDetails.em-candidate-reference-v55 .em-wide-footer{padding:10px 16px!important;gap:8px!important}
}
`;
document.head.appendChild(css);
function compact(){
 var modal=document.getElementById('emCandidateDetails');if(!modal)return;
 var overview=modal.querySelector('[data-detail-panel="overview"]'),head=modal.querySelector('.em-candidate-modal-head');
 if(!overview||!head)return;
 if(!modal.dataset.contactInHeader){
  var contact=overview.querySelector('.em-wide-block');
  if(contact&&contact.querySelector('h3')&&contact.querySelector('h3').textContent.trim()==='Contato'){
   modal.dataset.contactInHeader='true';
   var info=document.createElement('div');info.className='em-header-contact';info.setAttribute('aria-label','Contato do candidato');
   Array.from(contact.querySelectorAll(':scope>p')).forEach(function(p){info.appendChild(p)});
   var actions=contact.querySelector('.em-wide-contact-actions');if(actions)info.appendChild(actions);
   head.insertBefore(info,head.querySelector('.em-wide-favorite')||head.querySelector('[data-close]'));
   contact.remove();
   var summary=overview.querySelector('.em-wide-block:not(.em-wide-workflow)');if(summary)summary.classList.add('em-compact-summary');
  }
 }
 var interview=modal.querySelector('.em-wide-tabs button:last-child');
 if(interview&&interview.textContent.trim()==='Entrevistas'){interview.textContent='Agendar entrevista online';interview.setAttribute('aria-label','Agendar entrevista online');}
 var compactOverview=!overview.hidden;
 if(modal.classList.contains('em-overview-compact')!==compactOverview)modal.classList.toggle('em-overview-compact',compactOverview);
}
new MutationObserver(compact).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']});compact();
})();

(function(){var style=document.createElement('style');style.id='em-candidate-footer-fit';style.textContent="\n/* Fit the overview footer inside common laptop viewports without scaling text. */\n@media(min-width:761px){\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact{position:fixed!important;inset:12px 0 auto!important;margin:0 auto!important;width:min(1160px,calc(100vw - 32px))!important;max-height:calc(100dvh - 24px)!important;box-sizing:border-box!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-candidate-modal-head{padding:12px 24px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-candidate-modal-head>div:first-child{min-height:82px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-candidate-modal-head small{margin-bottom:8px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-avatar{top:34px!important;width:60px!important;height:60px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-header-contact{display:grid!important;grid-template-columns:1fr 1fr!important;column-gap:12px!important;padding-top:12px!important;flex-basis:380px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-header-contact>p:nth-child(3),html body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-header-contact>.em-wide-contact-actions{grid-column:1/-1!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-header-contact>.em-wide-contact-actions{margin-top:3px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-tabs button{padding:10px 6px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-candidate-modal-body{padding:10px 24px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-overview{align-items:start!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-block{padding:12px 16px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-overview h3{margin-bottom:6px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-compact-summary{gap:8px 16px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-workflow .em-gc27-stagebox{gap:5px!important;margin:0!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-workflow .em-wide-hint{margin:4px 0 6px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-detail-note{padding-top:8px!important;margin-top:8px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-detail-note>div{padding:8px 10px!important;margin-top:5px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-detail-note p{margin:0 0 4px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-footer{padding:10px 24px!important;min-height:64px!important;flex-shrink:0!important}\n}\n";document.head.appendChild(style);})();


(function(){
'use strict';
var style=document.createElement('style');style.id='em-approved-candidate-design';style.textContent="\n/* Approved recruiter overview design. */\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-wide-overview{align-items:stretch!important;background:transparent!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-wide-overview>.em-wide-block{border:1px solid #dce6f1!important;border-radius:12px!important;background:#fff!important;box-shadow:0 3px 12px #15304f04!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-wide-overview h3{font:700 18px/1.35 Inter,Arial,sans-serif!important;color:#15304f!important;letter-spacing:0!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary{display:flex!important;flex-direction:column!important;gap:10px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-facts{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px 18px}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-fact{min-width:0}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-fact small{display:block!important;font-size:14px!important;color:#617594!important;line-height:1.4!important;margin:0 0 4px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-fact h4,html body #emCandidateDetails.em-candidate-reference-v55 .em-summary-fact p{font:600 16px/1.4 Inter,Arial,sans-serif!important;color:#15304f!important;margin:0!important;overflow-wrap:anywhere}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-fact svg{width:17px!important;height:17px!important;padding:0!important;background:transparent!important;vertical-align:middle!important;margin-right:7px!important;color:#526781!important;box-sizing:border-box!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-skills{border-top:1px solid #e0e8f2;padding-top:8px}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-skills>small{display:block!important;margin-bottom:6px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-skills .em-gc27-tags{display:flex!important;flex-wrap:wrap!important;gap:6px!important;margin:0!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-skills .em-gc27-tag{font:500 14px/1.4 Inter,Arial,sans-serif!important;padding:5px 10px!important;border-radius:20px!important;background:#edf5ff!important;color:#0876ef!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-compact-summary>.em-wide-document-actions{margin-top:auto!important;padding-top:8px!important;border-top:1px solid #e0e8f2!important;gap:4px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-wide-document{background:#f7fbff!important;color:#0876ef!important;font-weight:600!important;border-radius:8px!important;justify-content:flex-start!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-wide-document>svg:last-child{margin-left:auto!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-wide-workflow .em-gc27-stage{background-color:#fff!important;border-color:#d3dfed!important;border-radius:8px!important;color:#20354f!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-detail-save{background:#0876ef!important;border-radius:8px!important;box-shadow:none!important;font-weight:600!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-detail-note>div{background:#f5f9ff!important;border-color:#e7eef7!important;border-radius:9px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-wide-tabs button{font-weight:500!important;color:#526781!important;border-radius:0!important;background:transparent!important;box-shadow:none!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-wide-tabs button.active{color:#0876ef!important;font-weight:600!important;border-bottom:2px solid #0876ef!important;background:transparent!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-wide-tabs button.em-interview-cta{background:#edf5ff!important;color:#0876ef!important;border-radius:8px!important;padding:9px 12px!important;margin:3px 0 5px 8px!important;border-bottom:0!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-interview-cta svg{width:18px;height:18px;flex-shrink:0}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-wide-footer{border-top:1px solid #dfe8f3!important;background:#fff!important}\n@media(min-width:761px){\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-overview{align-items:stretch!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-compact-summary{gap:8px!important}\n}\n@media(max-width:460px){html body #emCandidateDetails.em-candidate-reference-v55 .em-summary-facts{grid-template-columns:1fr!important}}\n";document.head.appendChild(style);
function refine(){
 var modal=document.getElementById('emCandidateDetails');if(!modal)return;
 var summary=modal.querySelector('.em-compact-summary');
 if(summary&&!summary.dataset.organizedFacts){
  var role=summary.querySelector('h4'),detail=summary.querySelector('.em-detail-summary');
  if(role&&detail){
   summary.dataset.organizedFacts='true';
   var facts=document.createElement('div');facts.className='em-summary-facts';
   var roleField=document.createElement('div');roleField.className='em-summary-fact';
   roleField.appendChild(role);facts.appendChild(roleField);
   var rows=Array.from(detail.querySelectorAll(':scope>p'));
   rows.forEach(function(row,index){
    var field=document.createElement('div');field.className='em-summary-fact';
    var label=document.createElement('small');label.textContent=index===0?'Tempo de experiência':'Escolaridade';
    field.appendChild(label);field.appendChild(row);facts.appendChild(field);
   });
   var skills=document.createElement('div');skills.className='em-summary-skills';
   var skillsLabel=detail.querySelector('small');if(skillsLabel)skills.appendChild(skillsLabel);
   var tags=summary.querySelector('.em-gc27-tags');if(tags)skills.appendChild(tags);
   detail.remove();
   var title=summary.querySelector('h3');title.after(facts,skills);
  }
 }
 var interview=Array.from(modal.querySelectorAll('.em-wide-tabs button')).find(function(button){return button.textContent.trim()==='Agendar entrevista online'});
 if(interview&&!interview.classList.contains('em-interview-cta')){
  interview.classList.add('em-interview-cta');
  var icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('fill','none');icon.setAttribute('stroke','currentColor');icon.setAttribute('stroke-width','1.8');icon.setAttribute('aria-hidden','true');
  icon.innerHTML='<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 11h18"/>';interview.prepend(icon);
 }
}
new MutationObserver(refine).observe(document.body,{childList:true,subtree:true});refine();
})();


(function(){
'use strict';
var style=document.createElement('style');style.id='em-reference-final-correction';style.textContent="\n/* Final reference alignment: reserve footer space, with no panel scaling. */\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-overview{grid-template-columns:1fr 1fr!important;align-items:stretch!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-wide-overview h3{font-size:20px!important;font-weight:700!important;color:#102744!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-fact p,html body #emCandidateDetails.em-candidate-reference-v55 .em-summary-fact h4{font-weight:600!important;color:#102744!important;line-height:1.35!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-fact small{margin-bottom:3px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-fact svg{width:19px!important;height:19px!important;margin-right:8px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-facts{gap:9px 18px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-skills{padding-top:7px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-summary-skills>small{margin-bottom:5px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-wide-document{font-weight:600!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-detail-note p{font-weight:600!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-wide-workflow .em-gc27-stage{background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18'%3E%3Ccircle cx='9' cy='9' r='6' fill='%230876ef'/%3E%3C/svg%3E\"),url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23526781' stroke-width='1.8'%3E%3Cpath d='m7 10 5 5 5-5'/%3E%3C/svg%3E\")!important;background-position:12px center,right 12px center!important;background-size:18px 18px,16px 16px!important;padding-left:38px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55 .em-wide-footer{flex-shrink:0!important;min-height:60px!important;box-sizing:border-box!important}\n@media(min-width:761px){\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact{height:auto!important;max-height:calc(100dvh - 24px)!important;display:flex!important;inset:12px 0 auto!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-candidate-modal-body{flex:1 1 auto!important;min-height:0!important;padding:8px 24px!important;overflow:visible!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-candidate-modal-head{padding:10px 24px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-candidate-modal-head>div:first-child{min-height:76px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-candidate-modal-head h2{font-size:28px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-tabs button{font-size:14px!important;padding:9px 6px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-footer{padding:8px 24px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-block{padding:12px 16px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-compact-summary{gap:7px!important}\n}\n@media(min-width:761px) and (max-height:680px){\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-candidate-modal-head small{margin-bottom:5px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-overview h3{margin:0 0 4px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-block{padding:10px 14px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-summary-facts{gap:7px 16px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-summary-skills{padding-top:6px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-workflow .em-detail-note{padding-top:6px!important;margin-top:6px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-detail-note>div{padding:7px 9px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-overview-compact .em-wide-document-actions{padding-top:6px!important}\n}\n";document.head.appendChild(style);
function icon(kind){
 var el=document.createElementNS('http://www.w3.org/2000/svg','svg');el.setAttribute('viewBox','0 0 24 24');el.setAttribute('fill','none');el.setAttribute('stroke','currentColor');el.setAttribute('stroke-width','1.7');el.setAttribute('aria-hidden','true');
 el.innerHTML=kind==='clock'?'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>':'<path d="m2 9 10-5 10 5-10 5-10-5Z"/><path d="M6 11v6c4 3 8 3 12 0v-6M22 9v7"/>';return el;
}
function correct(){
 var modal=document.getElementById('emCandidateDetails');if(!modal)return;
 var facts=modal.querySelector('.em-summary-facts');
 if(facts&&!facts.dataset.referenceValues){
  facts.dataset.referenceValues='true';
  Array.from(facts.querySelectorAll('.em-summary-fact')).forEach(function(field){
   var label=field.querySelector('small'),value=field.querySelector('p');
   if(!label||!value)return;
   var text=value.textContent.trim();
   if(label.textContent==='Tempo de experiência'){
    if(text==='Tempo de experiência não informado'){value.textContent='Não informado';}
    value.prepend(icon('clock'));
   }else if(label.textContent==='Escolaridade'){
    var old=value.querySelector('svg');if(old)old.remove();
    if(text==='Escolaridade não informada')value.textContent='Não informada';
    value.prepend(icon('education'));
   }
  });
 }
}
new MutationObserver(correct).observe(document.body,{childList:true,subtree:true});correct();
})();


(function(){
'use strict';
var style=document.createElement('style');style.id='em-contact-below-name';style.textContent="\n/* Contact actions directly below the candidate name and application title. */\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact .em-candidate-modal-head{gap:14px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact .em-header-contact{display:flex!important;flex-direction:column!important;gap:6px!important;flex:0 1 280px!important;padding:24px 0 0!important;min-height:0!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact .em-header-contact>p{margin:0!important;line-height:1.4!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact .em-name-contact-row{display:flex!important;gap:8px!important;align-items:stretch!important;flex-wrap:wrap!important;margin-top:9px!important;padding:0!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact .em-name-contact-row .em-wide-contact-actions{display:flex!important;gap:8px!important;padding:0!important;margin:0!important;flex:0 0 auto!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact .em-name-contact-row .em-wide-contact-actions button{width:auto!important;min-width:90px!important;height:36px!important;min-height:36px!important;padding:6px 12px!important;font:600 14px/1.4 Inter,Arial,sans-serif!important;border-radius:8px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact .em-name-contact-row svg{width:16px!important;height:16px!important;flex-shrink:0!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact .em-phone-card{display:flex!important;align-items:center!important;gap:7px!important;min-height:36px!important;box-sizing:border-box!important;border:1px solid #dce6f1!important;border-radius:8px!important;padding:6px 10px!important;background:#f7faff!important;color:#20354f!important;font-size:14px!important;line-height:1.4!important;margin:0!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact .em-phone-card svg{color:#0876ef!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact .em-phone-card .em-phone-label{color:#617594!important;font-size:12px!important;margin-right:2px!important}\n@media(max-width:760px){\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact .em-header-contact{padding:0!important;flex:1 1 100%!important;gap:4px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact .em-name-contact-row{gap:6px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact .em-name-contact-row .em-wide-contact-actions{flex:1 1 auto!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact .em-name-contact-row .em-wide-contact-actions button{flex:1!important}\n}\n";document.head.appendChild(style);
function moveContact(){
 var modal=document.getElementById('emCandidateDetails');if(!modal||modal.dataset.nameContact)return;
 var head=modal.querySelector('.em-candidate-modal-head'),contact=modal.querySelector('.em-header-contact');
 if(!head||!contact)return;
 var identity=head.querySelector('div'),actions=contact.querySelector('.em-wide-contact-actions');
 if(!identity||!actions)return;
 modal.dataset.nameContact='true';modal.classList.add('em-name-contact');
 var row=document.createElement('div');row.className='em-name-contact-row';row.setAttribute('aria-label','Ações de contato e telefone');
 row.appendChild(actions);
 var phone=Array.from(contact.querySelectorAll(':scope>p')).find(function(p){return p.querySelector('svg path[d^="M20 16"]')});
 if(!phone)phone=contact.querySelectorAll(':scope>p')[1];
 if(phone){
  phone.className='em-phone-card';
  var label=document.createElement('span');label.className='em-phone-label';label.textContent='Telefone';
  var value=phone.querySelector('span');if(value){if(value.textContent.trim()==='Telefone não informado')value.textContent='Não informado';phone.insertBefore(label,value);}else phone.appendChild(label);
  row.appendChild(phone);
 }
 identity.appendChild(row);
}
new MutationObserver(moveContact).observe(document.body,{childList:true,subtree:true});moveContact();
})();
