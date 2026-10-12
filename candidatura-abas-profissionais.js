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

/* Approved contact and tab button design; keep existing click handlers. */
(function(){
'use strict';
var scope='html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished';
var style=document.createElement('style');style.textContent=`
${scope} .em-name-contact-row{gap:10px!important;align-items:center!important}
${scope} .em-name-contact-row .em-wide-contact-actions{gap:10px!important}
${scope} .em-name-contact-row .em-wide-contact-actions button{height:42px!important;min-height:42px!important;padding:9px 15px!important;border-radius:8px!important;font-size:14px!important;background:white!important;border:1px solid #92bfff!important;color:#086be6!important;box-shadow:none!important}
${scope} .em-name-contact-row .em-wide-contact-actions button.em-contact-whatsapp{border-color:#73c79c!important;color:#14834b!important}
${scope} .em-name-contact-row .em-wide-contact-actions button:disabled{opacity:.45!important;cursor:not-allowed!important}
${scope} .em-name-contact-row svg{width:19px!important;height:19px!important}
${scope} .em-phone-card{min-height:42px!important;padding:9px 13px!important;border-radius:8px!important;background:#f7faff!important;color:#425775!important}
${scope} .em-phone-card .em-phone-label{font-size:13px!important;padding-right:10px!important;border-right:1px solid #cfdeef!important;margin-right:3px!important}
${scope} .em-wide-tabs{display:flex!important;align-items:center!important;flex-wrap:nowrap!important;gap:12px!important;border-bottom:1px solid #d4e2f2!important;padding:0!important;margin-bottom:20px!important;background:white!important}
${scope} .em-wide-tabs button{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;flex:1 1 auto!important;padding:15px 6px!important;min-height:48px!important;border:0!important;border-bottom:3px solid transparent!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;color:#526781!important;font-size:14px!important;font-weight:600!important;white-space:nowrap!important}
${scope} .em-wide-tabs button.active{color:#086be6!important;border-bottom-color:#086be6!important}
${scope} .em-wide-tabs button svg{width:20px!important;height:20px!important;flex-shrink:0!important}
${scope} .em-wide-tabs button.em-interview-cta{flex:0 0 auto!important;margin-left:12px!important;padding:11px 16px!important;min-height:44px!important;border:1px solid #086be6!important;border-radius:8px!important;background:#086be6!important;color:white!important;white-space:normal!important;text-align:center!important}
${scope} button:focus-visible{outline:3px solid #9cc8ff!important;outline-offset:2px!important}
@media(max-width:1050px){${scope} .em-wide-tabs{flex-wrap:wrap!important;gap:0 8px!important}${scope} .em-wide-tabs button.em-interview-cta{margin:8px 0 10px!important;flex:1 1 100%!important}}
@media(max-width:600px){${scope} .em-wide-tabs button:not(.em-interview-cta){flex:1 1 28%!important;font-size:13px!important;padding:12px 6px!important}${scope} .em-phone-card{flex:1 1 100%!important}${scope} .em-name-contact-row .em-wide-contact-actions{width:100%!important}}
`;document.head.appendChild(style);
var paths={'Visão geral':'M4 21v-3a8 8 0 0 1 16 0v3M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8','Currículo':'M5 3h10l4 4v14H5ZM14 3v5h5M8 12h8M8 16h6','Mensagens':'M4 4h16v13H9l-5 4ZM8 10h1M12 10h1M16 10h1','Anotações':'M8 4H5v17h14V4h-3M8 3h8v4H8ZM8 11h8M8 15h6','Histórico':'M12 8v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18'};
function refine(){var modal=document.getElementById('emCandidateDetails');if(!modal)return;modal.classList.add('em-actions-polished');modal.querySelectorAll('.em-wide-tabs button').forEach(function(button){var label=button.textContent.trim();if(!paths[label]||button.querySelector('svg'))return;var icon=document.createElementNS('http://www.w3.org/2000/svg','svg');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('fill','none');icon.setAttribute('stroke','currentColor');icon.setAttribute('stroke-width','1.8');icon.setAttribute('stroke-linecap','round');icon.setAttribute('stroke-linejoin','round');icon.setAttribute('aria-hidden','true');var path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',paths[label]);icon.appendChild(path);button.prepend(icon);});modal.querySelectorAll('.em-name-contact-row .em-wide-contact-actions button').forEach(function(button){if(/whatsapp/i.test(button.textContent))button.classList.add('em-contact-whatsapp');});}
new MutationObserver(refine).observe(document.body,{childList:true,subtree:true});refine();
})();

/* Match the approved job-management palette and typography. Visual only. */
(function(){'use strict';var style=document.createElement('style');style.id='em-candidate-job-design-match';style.textContent="\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished button,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished input,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished textarea,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished select,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished p,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished span,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished small,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished strong,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished h2,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished h3,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished h4{font-family:Inter,Arial,sans-serif!important;font-style:normal!important;letter-spacing:-.015em!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished{background:#fff!important;border-color:#d9e3ef!important;border-radius:18px!important;color:#10254c!important;box-shadow:0 22px 70px #15355230!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished::backdrop{background:#142b46a6!important;backdrop-filter:blur(2px)}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-candidate-modal-head h2{color:#10254c!important;font-size:28px!important;font-weight:750!important;letter-spacing:-.035em!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-candidate-modal-head small{color:#526b90!important;font-size:12px!important;font-weight:600!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-candidate-modal-head p,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-header-contact p{color:#526b90!important;font-size:13px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-avatar{background:#edf5ff!important;color:#1265f5!important;box-shadow:none!important;border:1px solid #e1ebfa!important;border-radius:16px!important;font-weight:650!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-tabs{border-bottom-color:#d8e1ef!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-tabs button{color:#526b90!important;font-size:13px!important;font-weight:600!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-tabs button.active{color:#1265f5!important;border-bottom-color:#1265f5!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-tabs button.em-interview-cta{background:#1265f5!important;border-color:#1265f5!important;color:white!important;border-radius:8px!important;font-weight:650!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-name-contact-row .em-wide-contact-actions button,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-favorite,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-footer button{color:#1265f5!important;border-color:#b7d1f8!important;background:white!important;font-weight:600!important;font-size:13px!important;border-radius:8px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-name-contact-row .em-wide-contact-actions button.em-contact-whatsapp{border-color:#b7dcc7!important;color:#1c784c!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-phone-card{background:#f5f7fa!important;border-color:#e2e8f1!important;color:#526b90!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-block{background:white!important;border:1px solid #d8e1ef!important;border-radius:10px!important;box-shadow:none!important;padding:18px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-block h3{font-size:18px!important;line-height:1.35!important;font-weight:750!important;color:#10254c!important;letter-spacing:-.025em!important;margin:0 0 14px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-overview p,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-overview h4{font-size:14px!important;line-height:1.55!important;color:#183253!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-overview small,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-overview .em-gc27-stagebox strong,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-overview .em-wide-hint{font-size:12px!important;line-height:1.5!important;color:#526b90!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-compact-summary h4{font-weight:600!important;color:#10254c!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-compact-summary svg{color:#526b90!important;stroke-width:1.8}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-gc27-tag{font-size:12px!important;color:#2864bf!important;background:#edf5ff!important;border:1px solid #e2ecfb!important;padding:6px 10px!important;border-radius:7px!important;font-weight:500!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-workflow .em-gc27-stage{border-color:#d8e1ef!important;background-color:white!important;color:#183253!important;font-family:Inter,Arial,sans-serif!important;font-size:14px!important;border-radius:8px!important;box-shadow:none!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-cards{gap:10px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-cards .em-stage-card{background:white!important;border:1px solid #d8e1ef!important;border-left:4px solid var(--stage-color)!important;border-radius:9px!important;padding:11px 10px!important;gap:10px!important;min-height:66px!important;box-shadow:none!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-card .em-stage-icon{width:34px!important;height:34px!important;flex-basis:34px!important;border-radius:50%!important;background:var(--stage-bg)!important;color:var(--stage-color)!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-card .em-stage-icon svg{width:20px!important;height:20px!important;stroke-width:1.8}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-card .em-stage-label{color:#10254c!important;font-size:12px!important;font-weight:600!important;line-height:1.4!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-card[data-stage=\"Em avaliação\"]{--stage-color:#d99b00!important;--stage-bg:#fff8eb!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-card[data-stage=\"Em contato\"]{--stage-color:#1265f5!important;--stage-bg:#edf5ff!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-card[data-stage=\"Entrevista agendada\"]{--stage-color:#7953b2!important;--stage-bg:#f3edfc!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-card[data-stage=\"Aprovado\"]{--stage-color:#1c784c!important;--stage-bg:#e7f5ed!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-card[data-stage=\"Contratado\"]{--stage-color:#087e88!important;--stage-bg:#edf8fa!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-card[data-stage=\"Reprovado\"]{--stage-color:#e7354c!important;--stage-bg:#fff0f3!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-cards .em-stage-card[aria-pressed=\"true\"]{background:#eff6ff!important;border-color:#1265f5!important;border-left-color:var(--stage-color)!important;box-shadow:0 0 0 1px #1265f5!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-card[aria-pressed=\"true\"]:after{background:#1265f5!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-help{font-size:11px!important;color:#526b90!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-footer{background:white!important;border-top:1px solid #e0e7ef!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-footer small{color:#526b90!important;font-size:12px!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-footer b{color:#10254c!important;font-size:14px!important;font-weight:650!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished button:focus-visible,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished select:focus-visible,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished textarea:focus-visible{outline:3px solid #9cc8ff!important;outline-offset:2px!important}\n@media(max-width:600px){html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-candidate-modal-head h2{font-size:23px!important}html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-block{padding:14px!important}html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-block h3{font-size:17px!important}html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-overview p,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-overview h4{font-size:13px!important}html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-cards .em-stage-card{padding:10px 8px!important;gap:8px!important}html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-card .em-stage-label{font-size:11px!important}}\n";document.head.appendChild(style);})();

/* Keep workflow cards inside the scrolling body; native select is replaced by cards. */
(function(){'use strict';var s=document.createElement('style');s.id='em-candidate-scroll-repair';s.textContent="\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished[open]{display:flex!important;flex-direction:column!important;overflow:hidden!important;min-height:0!important;height:calc(100dvh - 32px)!important;max-height:calc(100dvh - 32px)!important;box-sizing:border-box!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished>.em-candidate-modal-head,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished>.em-wide-tabs,html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished>.em-wide-footer{flex:0 0 auto!important;position:relative!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished>.em-candidate-modal-body{display:block!important;flex:1 1 0!important;min-height:0!important;height:0!important;max-height:none!important;overflow:auto!important;overflow-x:hidden!important;position:relative!important;isolation:isolate;box-sizing:border-box!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-panels{min-height:0!important;max-height:none!important;height:auto!important;overflow:visible!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-overview{height:auto!important;min-height:0!important;align-items:start!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-workflow{min-height:0!important;height:auto!important;overflow:visible!important;box-sizing:border-box!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-wide-workflow select.em-stage-native{display:none!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished .em-stage-cards{position:relative!important;min-height:0!important;height:auto!important;overflow:visible!important}\nhtml body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished>.em-wide-footer{z-index:1!important;min-height:0!important;background:white!important}\n@media(max-width:700px){html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished[open]{height:calc(100dvh - 16px)!important;max-height:calc(100dvh - 16px)!important}}\n";document.head.appendChild(s);})();

/* Unified candidate dialog presentation. Styles only; preserve tab and scheduling handlers. */
(function(){
  if(document.getElementById('em-candidate-unified-panels'))return;
  var s=document.createElement('style');s.id='em-candidate-unified-panels';
  var q='html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished';
  s.textContent=`
Q{--em-ink:#10254c;--em-muted:#526b90;--em-blue:#1265f5;--em-line:#e1e9f4;--em-soft:#f6f9fe}
Q .em-wide-panels, Q .em-wide-panels :is(p,span,small,label,li,a,input,textarea,button,h3,h4){font-family:Inter,Arial,sans-serif!important;font-style:normal!important;box-sizing:border-box}
Q .em-candidate-modal-body{background:var(--em-soft)!important;padding:22px!important}
Q .em-wide-panels>[data-detail-panel]:not([data-detail-panel="overview"]){border:1px solid var(--em-line)!important;border-radius:16px!important;background:#fff!important;padding:24px!important;min-height:260px!important;color:var(--em-muted)!important;font-size:14px!important;line-height:1.65!important;box-shadow:0 3px 12px rgba(16,37,76,.025)!important}
Q .em-wide-panels [hidden]{display:none!important}
Q .em-wide-panels h3{color:var(--em-ink)!important;font-size:18px!important;font-weight:700!important;line-height:1.4!important;letter-spacing:-.3px!important;margin:0 0 18px!important}
Q .em-wide-panels h4{color:var(--em-ink)!important;font-size:15px!important;font-weight:600!important;line-height:1.5!important}
Q .em-wide-panels p{font-size:14px!important;line-height:1.65!important;color:var(--em-muted)!important;overflow-wrap:anywhere}
Q .em-wide-panels small{font-size:12px!important;line-height:1.5!important;color:var(--em-muted)!important}
Q .em-wide-panels label{display:block;font-size:13px!important;font-weight:600!important;color:var(--em-ink)!important;margin-bottom:8px}
Q .em-wide-panels textarea{width:100%!important;min-height:140px!important;height:160px!important;max-height:35dvh!important;resize:vertical!important;border:1px solid #d5e0ef!important;border-radius:12px!important;padding:14px 16px!important;background:#fbfcff!important;color:var(--em-ink)!important;font-size:14px!important;line-height:1.6!important;box-shadow:none!important}
Q .em-wide-panels textarea::placeholder{color:#778aa7!important}
Q .em-wide-panels :is(textarea,input,button,a):focus-visible{outline:3px solid #b8d3ff!important;outline-offset:3px!important}
Q .em-wide-panels>[data-detail-panel]:not([data-detail-panel="overview"]) button{min-height:42px!important;padding:10px 18px!important;border:1px solid #d4e2f7!important;border-radius:10px!important;background:#f1f6ff!important;color:#125cc8!important;font-size:14px!important;font-weight:600!important;line-height:1.4!important;cursor:pointer;transition:background .15s,border-color .15s}
Q .em-wide-panels>[data-detail-panel]:not([data-detail-panel="overview"]) button:hover:not(:disabled){background:#e6efff!important;border-color:#a7c6fb!important}
Q .em-wide-panels>[data-detail-panel]:not([data-detail-panel="overview"]) button:disabled{opacity:.55!important;cursor:default}
Q [data-detail-panel="notes"] [data-gc27-save],Q [data-detail-panel="messages"] button[type="submit"]{background:var(--em-blue)!important;border-color:var(--em-blue)!important;color:white!important;margin-top:14px!important}
Q [data-detail-panel="notes"] [data-gc27-save]:hover:not(:disabled),Q [data-detail-panel="messages"] button[type="submit"]:hover:not(:disabled){background:#0756d9!important;border-color:#0756d9!important}
Q [data-detail-panel="resume"]>button{display:flex!important;align-items:center!important;gap:10px!important;width:100%!important;text-align:left!important;margin:12px 0!important;padding:16px 18px!important;min-height:58px!important}
Q [data-detail-panel="resume"]>p{padding:18px!important;border:1px dashed #cfdded!important;border-radius:12px!important;background:var(--em-soft)!important}
Q [data-detail-panel="messages"] .em-candidate-message{border:0!important;padding:0!important;background:transparent!important;margin:0!important}
Q [data-detail-panel="messages"] .em-candidate-message>p{margin:0 0 18px!important}
Q [data-detail-panel="messages"] :is(.em-message-list,.em-messages-list){border:1px solid var(--em-line)!important;border-radius:12px!important;background:var(--em-soft)!important;padding:16px!important;margin-bottom:18px!important}
Q [data-detail-panel="history"]>p{position:relative!important;margin:0 0 0 7px!important;padding:12px 16px 22px 22px!important;border-left:2px solid #d6e5fc!important;background:transparent!important}
Q [data-detail-panel="history"]>p::before{content:'';position:absolute;left:-6px;top:18px;width:10px;height:10px;border-radius:50%;background:var(--em-blue);box-shadow:0 0 0 4px #eef5ff}
Q [data-detail-panel="history"]>p:last-child{padding-bottom:12px!important}
Q .em-wide-footer{padding:14px 22px!important;border-top:1px solid var(--em-line)!important;gap:12px!important}
Q .em-wide-footer button{border-radius:10px!important;font-family:Inter,Arial,sans-serif!important;font-size:13px!important;min-height:38px!important}
Q .em-wide-tabs{padding-left:22px!important;padding-right:22px!important;overflow-x:auto!important;flex-wrap:nowrap!important}
Q .em-wide-tabs button{white-space:nowrap!important;flex-shrink:0!important}
@media(max-width:700px){Q .em-candidate-modal-body{padding:14px!important}Q .em-wide-panels>[data-detail-panel]:not([data-detail-panel="overview"]){padding:18px!important;min-height:220px!important}Q .em-wide-tabs{padding-left:14px!important;padding-right:14px!important}Q .em-wide-footer{padding:12px 14px!important}}
`.replace(/Q(?=[\s.{>])/g,q);
  document.head.appendChild(s);
})();

/* Apply approved image proportions and inline SVG decoration without replacing controls. */
(function(){
'use strict';
var q='html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished.em-image-approved';
var style=document.createElement('style');style.id='em-approved-candidate-image';
style.textContent=`
Q{width:min(1030px,calc(100vw - 32px))!important;max-width:1030px!important;padding:0!important;border-radius:14px!important;border:1px solid #e1e9f4!important;inset:0!important;margin:auto!important;color:#10254c!important}
Q[open]{height:min(950px,calc(100dvh - 32px))!important;max-height:calc(100dvh - 32px)!important}
Q::backdrop{background:rgba(33,57,85,.44)!important;backdrop-filter:blur(1px)}
Q .em-candidate-modal-head{padding:30px 30px 16px!important;min-height:164px!important;gap:20px!important;align-items:flex-start!important;position:relative!important;border:0!important}
Q .em-candidate-modal-head>div:first-child{flex:1!important;padding-left:122px!important;position:relative!important;min-height:118px!important;display:block!important}
Q .em-candidate-modal-head>div:first-child>small{display:none!important}
Q .em-candidate-modal-head h2{font:700 28px/1.25 Inter,Arial,sans-serif!important;color:#10254c!important;margin:0 0 4px!important;letter-spacing:-.6px!important}
Q .em-candidate-modal-head p{font-size:16px!important;line-height:1.5!important;margin:0!important;color:#526b90!important}
Q .em-detail-city{display:flex!important;align-items:center!important;gap:6px!important;margin:6px 0 0!important;font-size:14px!important}
Q .em-wide-avatar{position:absolute!important;top:0!important;left:0!important;width:94px!important;height:94px!important;border:0!important;border-radius:14px!important;display:grid!important;place-items:center!important;background:#deedff!important;color:#125cc8!important;font:650 30px/1 Inter,Arial,sans-serif!important}
Q .em-header-contact{display:none!important}
Q .em-name-contact-row{margin-top:12px!important;gap:10px!important}
Q .em-phone-card{display:none!important}
Q .em-name-contact-row .em-wide-contact-actions button{height:40px!important;min-height:40px!important;border:1px solid #b7d1f8!important;color:#1265f5!important;background:#fff!important;border-radius:7px!important;padding:8px 13px!important;font-size:14px!important;min-width:0!important}
Q .em-name-contact-row .em-wide-contact-actions button.em-contact-whatsapp{color:#1265f5!important;border-color:#b7d1f8!important}
Q .em-candidate-modal-head .em-interview-cta{align-self:flex-end!important;flex:0 0 auto!important;margin:0 0 10px!important;display:flex!important;align-items:center!important;gap:10px!important;min-height:48px!important;padding:12px 18px!important;background:#1265f5!important;border:1px solid #1265f5!important;color:white!important;border-radius:8px!important;font:600 14px/1.4 Inter,Arial,sans-serif!important}
Q .em-candidate-modal-head>[data-close]{position:absolute!important;right:20px!important;top:18px!important;width:28px!important;height:28px!important;padding:4px!important;background:transparent!important;border:0!important;color:#526b90!important}
Q .em-wide-favorite{position:absolute!important;right:60px!important;top:18px!important;border:0!important;background:transparent!important;font-size:11px!important;color:#526b90!important}
Q .em-wide-tabs{padding:0 30px!important;margin:0!important;border-bottom:1px solid #dbe5f2!important;gap:30px!important;min-height:52px!important}
Q .em-wide-tabs button{padding:14px 5px!important;min-height:52px!important;font-size:14px!important;font-weight:600!important;border-radius:0!important;background:transparent!important;color:#526b90!important}
Q .em-wide-tabs button.active{color:#1265f5!important;border-bottom:2px solid #1265f5!important}
Q .em-candidate-modal-body{background:#fff!important;padding:22px 30px 18px!important}
Q .em-wide-overview{display:grid!important;grid-template-columns:1fr 1.08fr!important;gap:22px!important;align-items:stretch!important}
Q .em-wide-block{padding:20px 16px!important;border:1px solid #dce6f2!important;border-radius:10px!important;background:white!important;box-shadow:none!important;min-width:0!important}
Q .em-wide-panels .em-wide-block h3{display:flex!important;align-items:center!important;gap:12px!important;font-size:18px!important;line-height:1.4!important;font-weight:700!important;margin:0 0 14px!important;color:#10254c!important}
Q .em-image-icon{width:22px!important;height:22px!important;flex:0 0 22px!important;color:#173768!important;vertical-align:middle}
Q .em-summary-facts{display:flex!important;flex-direction:column!important;gap:0!important}
Q .em-summary-fact{padding:16px 0!important;border-bottom:1px solid #dce6f2!important;min-width:0!important}
Q .em-summary-fact small{display:block!important;color:#10254c!important;font-size:15px!important;font-weight:650!important;margin-bottom:6px!important}
Q .em-summary-fact h4,Q .em-summary-fact p{font-size:14px!important;line-height:1.55!important;margin:0!important;color:#526b90!important}
Q .em-summary-fact h4{font-weight:650!important;color:#10254c!important}
Q .em-summary-skills{padding:16px 0!important;border-bottom:1px solid #dce6f2!important}
Q .em-summary-skills>small{display:flex!important;align-items:center!important;gap:12px!important;color:#10254c!important;font-size:15px!important;font-weight:650!important;margin:0 0 12px!important}
Q .em-gc27-tags{gap:9px!important;display:flex!important;flex-wrap:wrap!important}
Q .em-gc27-tag{background:#e1efff!important;color:#1265f5!important;border:0!important;border-radius:7px!important;padding:7px 12px!important;font-size:13px!important;font-weight:500!important}
Q .em-wide-document-actions{padding-top:16px!important;margin-top:0!important}
Q .em-wide-document{border:1px solid #b7d1f8!important;border-radius:7px!important;min-height:52px!important;color:#1265f5!important;background:white!important;padding:12px 16px!important;font-size:14px!important}
Q .em-wide-workflow .em-gc27-stagebox>strong{display:none!important}
Q .em-image-process-caption{margin:0 0 12px!important;color:#526b90!important;font-size:14px!important}
Q .em-stage-cards{gap:10px!important;margin:0 0 16px!important}
Q .em-stage-cards .em-stage-card{min-height:94px!important;padding:13px 12px!important;gap:10px!important;border:1px solid #dce6f2!important;border-left:4px solid var(--stage-color)!important;border-radius:7px!important;align-items:flex-start!important}
Q .em-stage-card .em-stage-icon{width:40px!important;height:40px!important;flex-basis:40px!important;border-radius:50%!important}
Q .em-stage-card .em-stage-label{font-size:13px!important;line-height:1.4!important;font-weight:650!important;display:block!important;padding-right:7px!important}
Q .em-stage-description{display:block!important;font:400 12px/1.5 Inter,Arial,sans-serif!important;color:#526b90!important;margin-top:6px!important}
Q .em-stage-card:after{content:''!important;position:absolute!important;right:10px!important;top:14px!important;width:16px!important;height:16px!important;border:1.5px solid #a8bbd3!important;border-radius:50%!important;background:white!important;box-sizing:border-box!important}
Q .em-stage-cards .em-stage-card[aria-pressed="true"]{background:#edf5ff!important;border-color:#1265f5!important;box-shadow:none!important}
Q .em-stage-card[aria-pressed="true"]:after{border:2px solid #1265f5!important;background:#1265f5!important;box-shadow:inset 0 0 0 3px white!important}
Q .em-stage-card[data-stage="Em avaliação"]{--stage-color:#8295b4!important;--stage-bg:#f0f3f8!important}
Q .em-stage-card[data-stage="Em contato"]{--stage-color:#1265f5!important;--stage-bg:#dcecff!important}
Q .em-stage-card[data-stage="Entrevista agendada"]{--stage-color:#e49a0c!important;--stage-bg:#fff5e2!important}
Q .em-stage-card[data-stage="Aprovado"]{--stage-color:#20b777!important;--stage-bg:#e4f7ee!important}
Q .em-stage-card[data-stage="Contratado"]{--stage-color:#1db7b0!important;--stage-bg:#e3f7f5!important}
Q .em-stage-card[data-stage="Reprovado"]{--stage-color:#ef3b58!important;--stage-bg:#ffe9ee!important}
Q .em-stage-help{font-size:12px!important;margin-bottom:12px!important}
Q .em-wide-workflow .em-wide-hint{font-size:12px!important;margin:14px 0 10px!important}
Q .em-detail-save{display:block!important;margin:0 0 18px auto!important;padding:10px 16px!important;min-height:40px!important;background:#1265f5!important;border:1px solid #1265f5!important;color:white!important;border-radius:7px!important;font:600 13px/1.4 Inter,Arial,sans-serif!important}
Q .em-detail-feedback:empty{display:none!important}
Q .em-wide-workflow .em-detail-note{border:1px solid #dce6f2!important;border-radius:9px!important;padding:16px!important;margin:0!important;background:#fff!important}
Q .em-detail-note>small{display:flex!important;align-items:center!important;gap:12px!important;font-size:15px!important;font-weight:650!important;color:#10254c!important;margin-bottom:12px!important}
Q .em-detail-note>div{border:0!important;background:transparent!important;padding:0 0 0 34px!important}
Q .em-detail-note p{font-weight:400!important;font-size:14px!important;margin:0!important}
Q .em-detail-note>div>small{display:none!important}
Q .em-wide-footer{padding:16px 30px!important;min-height:68px!important;gap:20px!important;align-items:center!important}
Q .em-wide-footer small,Q .em-wide-footer b{font-size:12px!important;font-weight:400!important;color:#526b90!important}
Q .em-wide-footer button{margin-left:auto!important;min-height:38px!important;padding:8px 20px!important;background:#f6f8fb!important;border-color:#d5e0ef!important;color:#10254c!important;border-radius:7px!important}
@media(max-width:760px){Q{width:calc(100vw - 16px)!important}Q[open]{height:calc(100dvh - 16px)!important;max-height:calc(100dvh - 16px)!important}Q .em-candidate-modal-head{padding:22px 16px 12px!important;flex-wrap:wrap!important;gap:10px!important}Q .em-candidate-modal-head>div:first-child{padding-left:74px!important;min-height:104px!important;flex-basis:100%!important}Q .em-wide-avatar{width:60px!important;height:60px!important;font-size:23px!important}Q .em-candidate-modal-head h2{font-size:22px!important}Q .em-candidate-modal-head p{font-size:13px!important}Q .em-candidate-modal-head .em-interview-cta{width:100%!important;justify-content:center!important;margin:0!important}Q .em-wide-tabs{padding:0 16px!important;gap:18px!important}Q .em-candidate-modal-body{padding:16px!important}Q .em-wide-overview{grid-template-columns:1fr!important;gap:16px!important}Q .em-wide-footer{padding:12px 16px!important;flex-wrap:wrap!important;gap:10px!important}Q .em-stage-cards .em-stage-card{min-height:94px!important}Q .em-wide-favorite{display:none!important}}
@media(max-width:380px){Q .em-stage-cards{grid-template-columns:1fr!important}Q .em-name-contact-row .em-wide-contact-actions{gap:5px!important}Q .em-name-contact-row .em-wide-contact-actions button{padding:7px!important;font-size:12px!important}}
`.replace(/Q(?=[\s.{[:>])/g,q);document.head.appendChild(style);
var paths={file:'M14 3H6v18h12V7zM14 3v5h5M9 12h6M9 16h6',process:'M4 12h3v9H4zM10 8h3v13h-3zM16 3h3v18h-3z',star:'m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-3-5.5 3 1-6.2L3 9.6l6.2-.9z',note:'M5 3h14v18H5zM8 7h8M8 11h8M8 15h5',phone:'M20 16v4C10 22 2 12 4 4h4l2 5-2 2 5 5 2-2z',contact:'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M13 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',calendar:'M3 5h18v16H3zM8 3v4M16 3v4M3 11h18',check:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18M8 12l3 3 5-6',briefcase:'M3 7h18v14H3zM8 7V4h8v3M3 12h18M10 12v3h4v-3',cross:'M6 6l12 12M18 6 6 18'};
function svg(kind){var n=document.createElementNS('http://www.w3.org/2000/svg','svg');n.setAttribute('viewBox','0 0 24 24');n.setAttribute('fill','none');n.setAttribute('stroke','currentColor');n.setAttribute('stroke-width','1.8');n.setAttribute('stroke-linecap','round');n.setAttribute('stroke-linejoin','round');n.setAttribute('aria-hidden','true');n.classList.add('em-image-icon');var p=document.createElementNS(n.namespaceURI,'path');p.setAttribute('d',paths[kind]);n.appendChild(p);return n;}
var stageInfo={'Em avaliação':['file','Candidatura recebida e em análise.'],'Em contato':['contact','Entramos em contato com o candidato.'],'Entrevista agendada':['calendar','Entrevista marcada com o candidato.'],'Aprovado':['check','Candidato aprovado no processo seletivo.'],'Contratado':['briefcase','Candidato efetivado na empresa.'],'Reprovado':['cross','Candidato não selecionado.']};
function decorate(){var m=document.getElementById('emCandidateDetails');if(!m||!m.classList.contains('em-actions-polished'))return;m.classList.add('em-image-approved');var head=m.querySelector('.em-candidate-modal-head'),cta=m.querySelector('.em-interview-cta');if(head&&cta&&cta.parentNode!==head)head.appendChild(cta);
m.querySelectorAll('.em-wide-block h3,.em-summary-skills>small,.em-detail-note>small').forEach(function(n){if(n.querySelector('.em-image-icon'))return;var kind=n.closest('.em-detail-note')?'note':n.closest('.em-summary-skills')?'star':n.closest('.em-wide-workflow')?'process':'file';n.prepend(svg(kind));});
var workflow=m.querySelector('.em-wide-workflow');if(workflow&&!workflow.querySelector('.em-image-process-caption')){var caption=document.createElement('p');caption.className='em-image-process-caption';caption.textContent='Selecione a etapa da candidatura';var title=workflow.querySelector('h3');if(title)title.after(caption);}
m.querySelectorAll('.em-stage-card').forEach(function(b){if(b.dataset.imageDecorated)return;var info=stageInfo[b.dataset.stage],label=b.querySelector('.em-stage-label'),icon=b.querySelector('.em-stage-icon');if(!info||!label||!icon)return;b.dataset.imageDecorated='true';icon.replaceChildren(svg(info[0]));var text=document.createElement('small');text.className='em-stage-description';text.textContent=info[1];label.appendChild(text);});
var actions=m.querySelector('.em-wide-contact-actions'),phone=m.querySelector('.em-phone-card');if(false /* Phone is displayed as contact text, without a call button. */){var value=phone.querySelector('span:not(.em-phone-label)'),number=value?value.textContent.replace(/[^0-9+]/g,''):'';var b=document.createElement('button');b.type='button';b.dataset.imageCall='true';b.appendChild(svg('phone'));b.appendChild(document.createTextNode('Ligar'));b.disabled=!number;b.onclick=function(){if(number)location.href='tel:'+number;};actions.appendChild(b);}
}
var queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;decorate();});}new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});decorate();
})();

/* Single horizontal candidate card: compact overview without clipping content. */
(function(){
var q='html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished.em-image-approved';
var s=document.createElement('style');s.id='em-candidate-horizontal-card';
s.textContent=`
@media(min-width:761px){
Q{width:min(1200px,calc(100vw - 40px))!important;max-width:1200px!important}
Q[open]{height:auto!important;max-height:calc(100dvh - 24px)!important}
Q .em-candidate-modal-head{padding:18px 24px 10px!important;min-height:110px!important;gap:14px!important}
Q .em-candidate-modal-head>div:first-child{padding-left:92px!important;min-height:88px!important}
Q .em-wide-avatar{width:74px!important;height:74px!important;font-size:26px!important;border-radius:12px!important}
Q .em-candidate-modal-head h2{font-size:26px!important}
Q .em-candidate-modal-head p{font-size:14px!important}
Q .em-detail-city{font-size:13px!important;margin-top:3px!important}
Q .em-name-contact-row{margin-top:8px!important}
Q .em-name-contact-row .em-wide-contact-actions button{height:34px!important;min-height:34px!important;font-size:13px!important;padding:6px 11px!important}
Q .em-candidate-modal-head .em-interview-cta{min-height:40px!important;padding:9px 14px!important;font-size:13px!important;margin-bottom:4px!important}
Q .em-wide-tabs{padding:0 24px!important;min-height:42px!important;gap:24px!important}
Q .em-wide-tabs button{min-height:42px!important;padding:10px 4px!important;font-size:13px!important}
Q>.em-candidate-modal-body{flex:0 1 auto!important;height:auto!important;min-height:0!important;max-height:none!important;padding:14px 24px!important;overflow:auto!important;scrollbar-width:none!important}
Q>.em-candidate-modal-body::-webkit-scrollbar{width:0;height:0}
Q .em-wide-overview{grid-template-columns:minmax(0,1fr) minmax(0,1.16fr)!important;gap:24px!important;align-items:start!important}
Q .em-wide-overview>.em-wide-block{border:0!important;border-radius:0!important;padding:0!important;background:transparent!important}
Q .em-wide-overview>.em-wide-workflow{border-left:1px solid #e1e9f4!important;padding-left:24px!important}
Q .em-wide-panels .em-wide-block h3{font-size:17px!important;margin-bottom:10px!important;gap:9px!important}
Q .em-summary-fact{padding:9px 0!important}
Q .em-summary-fact small{font-size:13px!important;margin-bottom:3px!important}
Q .em-summary-fact h4,Q .em-summary-fact p{font-size:13px!important;line-height:1.45!important}
Q .em-summary-skills{padding:10px 0!important}
Q .em-summary-skills>small{font-size:13px!important;margin-bottom:8px!important}
Q .em-gc27-tag{font-size:12px!important;padding:5px 9px!important}
Q .em-wide-document-actions{padding-top:10px!important}
Q .em-wide-document{min-height:40px!important;padding:8px 12px!important;font-size:13px!important}
Q .em-image-process-caption{font-size:13px!important;margin-bottom:8px!important}
Q .em-stage-cards{gap:8px!important;margin-bottom:8px!important}
Q .em-stage-cards .em-stage-card{min-height:70px!important;padding:9px 10px!important;gap:8px!important}
Q .em-stage-card .em-stage-icon{width:32px!important;height:32px!important;flex-basis:32px!important}
Q .em-stage-card .em-stage-label{font-size:12px!important;padding-right:12px!important}
Q .em-stage-description{font-size:11px!important;line-height:1.4!important;margin-top:3px!important}
Q .em-stage-card:after{width:14px!important;height:14px!important;right:8px!important;top:11px!important}
Q .em-stage-help{display:none!important}
Q .em-wide-workflow .em-wide-hint{display:inline-block!important;margin:8px 0!important;font-size:11px!important}
Q .em-detail-save{display:inline-flex!important;float:right!important;min-height:34px!important;padding:7px 12px!important;font-size:12px!important;margin:2px 0 10px!important}
Q .em-detail-feedback{clear:both!important;font-size:12px!important;margin:4px 0!important}
Q .em-wide-workflow .em-detail-note{clear:both!important;padding:10px 12px!important}
Q .em-detail-note>small{font-size:13px!important;margin-bottom:6px!important;gap:8px!important}
Q .em-detail-note>div{padding-left:30px!important}
Q .em-detail-note p{font-size:12px!important;line-height:1.4!important}
Q .em-wide-footer{padding:10px 24px!important;min-height:48px!important}
Q .em-wide-footer small,Q .em-wide-footer b{font-size:11px!important}
Q .em-wide-footer button{min-height:32px!important;padding:6px 16px!important;font-size:12px!important}
Q .em-wide-panels>[data-detail-panel]:not([data-detail-panel="overview"]){min-height:220px!important;padding:18px!important}
}
@media(min-width:761px) and (max-height:700px){
Q .em-summary-facts{display:grid!important;grid-template-columns:1fr 1fr!important;gap:0 16px!important}
Q .em-summary-fact:first-child{grid-column:1/-1!important}
Q .em-stage-cards .em-stage-card{min-height:62px!important;padding:8px 9px!important}
Q .em-stage-description{line-height:1.3!important}
Q .em-wide-workflow .em-detail-note{padding:8px 10px!important}
Q .em-candidate-modal-head{padding-top:14px!important;min-height:104px!important}
}
@media(min-width:761px) and (max-height:550px){
Q .em-stage-description{display:none!important}
Q .em-stage-cards .em-stage-card{min-height:44px!important;align-items:center!important}
Q .em-wide-workflow .em-detail-note{display:none!important}
Q .em-candidate-modal-head>div:first-child{min-height:80px!important}
Q .em-wide-avatar{height:60px!important;width:60px!important}
Q .em-candidate-modal-head{min-height:94px!important}
}
`.replace(/Q(?=[\s.{[:>])/g,q);document.head.appendChild(s);
})();

/* Remove only the History navigation item; retain candidature records. */
(function(){
'use strict';
function removeHistoryTab(){
var modal=document.getElementById('emCandidateDetails');if(!modal)return;
var tabs=modal.querySelector('.em-wide-tabs');if(!tabs)return;
Array.from(tabs.querySelectorAll('button')).forEach(function(button){
if(button.textContent.trim()!=='Histórico')return;
if(button.classList.contains('active')){
var overview=tabs.querySelector('button');if(overview&&overview!==button)overview.click();
}
button.remove();
});
}
var queued=false;
new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;removeHistoryTab();});}).observe(document.body,{childList:true,subtree:true});
removeHistoryTab();
})();

/* Isolate candidate tab panels from legacy display overrides. */
(function(){
'use strict';
var keys={'Visão geral':'overview','Currículo':'resume','Mensagens':'messages','Anotações':'notes'};
var style=document.createElement('style');style.id='em-candidate-isolated-tabs';
style.textContent='html body #emCandidateDetails#emCandidateDetails .em-wide-panels>[data-detail-panel][hidden]{display:none!important}html body #emCandidateDetails#emCandidateDetails .em-wide-panels>[data-detail-panel]:not([hidden]):not([data-detail-panel="overview"]){display:block!important}';
document.head.appendChild(style);
function activate(modal,key,focus){
var panels=modal.querySelector('.em-wide-panels'),tabs=modal.querySelector('.em-wide-tabs');
if(!panels||!tabs||!panels.querySelector('[data-detail-panel="'+key+'"]'))return;
modal.dataset.activeCandidateTab=key;
panels.querySelectorAll(':scope>[data-detail-panel]').forEach(function(panel){
var selected=panel.dataset.detailPanel===key;
panel.hidden=!selected;
panel.style.setProperty('display',selected?(key==='overview'?'grid':'block'):'none','important');
panel.setAttribute('aria-hidden',String(!selected));
});
tabs.querySelectorAll('button').forEach(function(button){
var buttonKey=keys[button.textContent.trim()];if(!buttonKey)return;
var selected=buttonKey===key;button.classList.toggle('active',selected);button.setAttribute('aria-selected',String(selected));
});
if(focus&&key==='messages'){var input=panels.querySelector('[data-detail-panel="messages"] textarea');if(input)input.focus();}
}
document.addEventListener('click',function(event){
var button=event.target.closest('button');if(!button)return;
var tabs=button.closest('#emCandidateDetails .em-wide-tabs');if(!tabs)return;
var key=keys[button.textContent.trim()];if(!key)return;
event.preventDefault();event.stopImmediatePropagation();
activate(tabs.closest('#emCandidateDetails'),key,true);
},true);
function sync(){
var modal=document.getElementById('emCandidateDetails');if(!modal)return;
var active=modal.querySelector('.em-wide-tabs button.active');
activate(modal,modal.dataset.activeCandidateTab||(active&&keys[active.textContent.trim()])||'overview',false);
}
var queued=false;
new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;sync();});}).observe(document.body,{childList:true,subtree:true});
sync();
})();

/* Compact wide dialog with the candidate phone beside WhatsApp. */
(function(){
'use strict';
var q='html body #emCandidateDetails.em-candidate-reference-v55.em-name-contact.em-actions-polished.em-image-approved.em-final-compact';
var s=document.createElement('style');s.id='em-candidate-final-compact';
s.textContent=`
Q{width:min(1320px,calc(100vw - 32px))!important;max-width:1320px!important}
Q .em-detail-note,Q [data-image-call],Q .em-wide-contact-actions [data-gc27-tel]{display:none!important}
Q .em-name-contact-row{display:flex!important;flex-wrap:nowrap!important;gap:10px!important;align-items:center!important;margin-top:7px!important}
Q .em-name-contact-row .em-wide-contact-actions{display:flex!important;flex-wrap:nowrap!important;width:auto!important;gap:8px!important;flex:0 0 auto!important}
Q .em-name-contact-row .em-wide-contact-actions button{width:auto!important;flex:0 0 auto!important;min-width:0!important}
Q .em-name-contact-row .em-phone-card{display:inline-flex!important;align-items:center!important;gap:7px!important;background:#f7faff!important;border:1px solid #dce6f1!important;border-radius:7px!important;min-height:34px!important;padding:6px 10px!important;margin:0!important;font:500 13px/1.4 Inter,Arial,sans-serif!important;color:#526b90!important;white-space:nowrap!important}
Q .em-phone-card .em-phone-label{display:none!important}
Q .em-phone-card svg{width:16px!important;height:16px!important;color:#1265f5!important}
@media(min-width:761px){
Q[open]{height:auto!important;max-height:calc(100dvh - 20px)!important}
Q .em-candidate-modal-head{padding:14px 22px 8px!important;min-height:100px!important;gap:12px!important}
Q .em-candidate-modal-head>div:first-child{padding-left:78px!important;min-height:78px!important}
Q .em-wide-avatar{width:62px!important;height:62px!important;font-size:24px!important}
Q .em-candidate-modal-head h2{font-size:25px!important;margin-bottom:2px!important}
Q .em-candidate-modal-head p{font-size:13px!important;line-height:1.35!important}
Q .em-detail-city{font-size:12px!important;margin-top:3px!important}
Q .em-candidate-modal-head .em-interview-cta{align-self:center!important;margin:20px 0 0!important;min-height:38px!important;font-size:13px!important}
Q .em-wide-tabs{min-height:40px!important;padding:0 22px!important}
Q .em-wide-tabs button{min-height:40px!important;padding:9px 4px!important}
Q>.em-candidate-modal-body{height:auto!important;flex:0 0 auto!important;padding:12px 22px!important;overflow:visible!important;max-height:none!important}
Q .em-wide-overview{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr)!important;gap:22px!important}
Q .em-wide-overview>.em-wide-workflow{padding-left:22px!important}
Q .em-summary-facts{display:grid!important;grid-template-columns:1fr 1fr!important;gap:0 14px!important}
Q .em-summary-fact:first-child{grid-column:1/-1!important}
Q .em-summary-fact{padding:8px 0!important}
Q .em-summary-skills{padding:9px 0!important}
Q .em-stage-cards .em-stage-card{min-height:64px!important;padding:8px 10px!important}
Q .em-wide-workflow .em-wide-hint{margin:6px 0!important}
Q .em-detail-save{display:flex!important;width:auto!important;float:none!important;min-height:34px!important;margin:4px 0 0 auto!important;padding:7px 18px!important}
Q .em-wide-footer{min-height:46px!important;padding:9px 22px!important}
}
@media(max-width:760px){Q .em-name-contact-row{flex-wrap:wrap!important}Q .em-name-contact-row .em-phone-card{font-size:12px!important}Q .em-candidate-modal-head{min-height:0!important}Q .em-candidate-modal-head>div:first-child{min-height:0!important}Q .em-detail-save{width:auto!important}}
`.replace(/Q(?=[\s.{[:>])/g,q);document.head.appendChild(s);
function compact(){
var m=document.getElementById('emCandidateDetails');if(!m)return;m.classList.add('em-final-compact');
m.querySelectorAll('[data-image-call]').forEach(function(button){button.remove();});
m.querySelectorAll('.em-detail-note').forEach(function(note){note.remove();});
}
var queued=false;new MutationObserver(function(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;compact();});}).observe(document.body,{childList:true,subtree:true});compact();
})();
