(function(){
'use strict';
var style=document.createElement('style');style.id='em-stable-candidate-dialog';style.textContent=`
html body #emCandidateDetails[open]{display:flex!important;flex-direction:column!important;width:min(1200px,calc(100vw - 32px))!important;height:calc(100dvh - 32px)!important;max-height:calc(100dvh - 32px)!important;min-height:0!important;box-sizing:border-box!important;overflow:hidden!important;padding:0!important}
html body #emCandidateDetails .em-candidate-modal-head{flex:none!important;padding:16px 24px!important}
html body #emCandidateDetails .em-wide-tabs{flex:none!important;margin:0 24px!important;gap:22px!important;flex-wrap:wrap!important}
html body #emCandidateDetails .em-wide-tabs button{padding:10px 2px!important}
html body #emCandidateDetails .em-candidate-modal-body{flex:1 1 0!important;min-height:0!important;max-height:none!important;overflow:hidden!important;padding:14px 24px!important;box-sizing:border-box!important}
html body #emCandidateDetails .em-wide-panels{width:100%!important;overflow:visible!important}
html body #emCandidateDetails .em-wide-block{padding:14px!important}
html body #emCandidateDetails .em-wide-block h3{font-size:16px!important;margin:0 0 12px!important}
html body #emCandidateDetails .em-wide-block p{margin:8px 0!important;line-height:1.45!important}
html body #emCandidateDetails .em-wide-contact-actions,html body #emCandidateDetails .em-wide-document-actions{margin-top:12px!important;gap:7px!important}
html body #emCandidateDetails .em-wide-match{margin-top:12px!important;padding:10px!important}
html body #emCandidateDetails .em-wide-footer{flex:none!important;padding:10px 24px!important}
html body #emCandidateDetails textarea{resize:none!important;max-height:120px!important}
@media(max-width:700px){html body #emCandidateDetails[open]{width:calc(100vw - 16px)!important;height:calc(100dvh - 16px)!important;max-height:calc(100dvh - 16px)!important}html body #emCandidateDetails .em-candidate-modal-head{padding:12px 16px!important}html body #emCandidateDetails .em-wide-tabs{margin:0 16px!important;gap:12px!important}html body #emCandidateDetails .em-candidate-modal-body{padding:12px 16px!important}html body #emCandidateDetails .em-wide-footer{padding:10px 16px!important}}
`;
document.head.appendChild(style);
var active=null,resize=null,changes=null,pending=false;
function fit(){pending=false;var modal=active;if(!modal||!modal.open)return;var body=modal.querySelector('.em-candidate-modal-body'),panels=modal.querySelector('.em-wide-panels');if(!body||!panels)return;panels.style.zoom='1';var cs=getComputedStyle(body),available=body.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);var needed=panels.scrollHeight;if(available>0&&needed>available)panels.style.zoom=String(Math.min(1,available/needed));}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(fit);}
function install(){var modal=document.getElementById('emCandidateDetails');if(modal===active)return;if(resize)resize.disconnect();if(changes)changes.disconnect();active=modal;if(!modal)return;resize=new ResizeObserver(schedule);resize.observe(modal);var body=modal.querySelector('.em-candidate-modal-body');if(body)resize.observe(body);changes=new MutationObserver(schedule);changes.observe(modal,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden','open']});modal.addEventListener('click',schedule);schedule();}
new MutationObserver(install).observe(document.body,{childList:true});window.addEventListener('resize',schedule);install();
})();
