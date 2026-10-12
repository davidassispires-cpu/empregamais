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
