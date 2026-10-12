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
