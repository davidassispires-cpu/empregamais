(function(){
'use strict';
var scope='#pagina-candidatos-empresa #listaCandidatosEmpresa .em-gc27-card.em-compact-v1';
var css=`${scope}{padding:18px!important;border-radius:14px!important;display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:16px!important;box-shadow:none!important;align-items:center!important}
${scope} .em-gc27-main{grid-column:1/-1!important;grid-template-columns:minmax(0,1fr) auto!important;gap:12px!important}
${scope} .em-gc27-avatar{width:48px!important;height:48px!important;min-width:48px!important;font-size:18px!important;background:#e5f1ff!important;color:#145caa!important}
${scope} .em-gc27-person{gap:12px!important}
${scope} .em-gc27-name{text-transform:none!important;font-size:17px!important;line-height:1.3!important;overflow-wrap:anywhere!important}
${scope} .em-gc27-info{font-size:11px!important;line-height:1.5!important}
${scope} .gc-ref-application-group{width:auto!important;margin:0!important;align-self:start!important}
${scope} .gc-ref-application-group .gc-ref-favorite{height:36px!important;min-height:36px!important;padding:7px 11px!important;border:1px solid #086be6!important;border-radius:8px!important;color:#086be6!important;font-weight:700!important;font-size:12px!important}
${scope} .gc-ref-favorite span{font-size:12px!important;font-weight:700!important}
${scope} .gc-ref-favorite svg{width:20px!important;height:20px!important}
${scope} .gc-ref-actions{grid-column:1/-1!important;display:grid!important;grid-template-columns:minmax(0,1.08fr) minmax(0,1fr)!important;align-items:center!important;gap:18px!important;border:0!important;padding:0!important;margin:0!important}
${scope} .gc-ref-adherence{justify-content:flex-start!important;gap:13px!important;min-height:104px!important;padding:12px 14px!important;border-left:6px solid #086be6!important;border-radius:9px!important;background:linear-gradient(110deg,#e3f3ff,#eff8ff)!important}
${scope} .em-match-ring{width:76px;height:76px;flex:none;border-radius:50%;background:conic-gradient(#086be6 calc(var(--match)*1%),#bddfff 0);display:grid;place-items:center}
${scope} .em-match-ring b{display:grid;place-items:center;width:57px;height:57px;border-radius:50%;background:#eff8ff;font-size:23px;line-height:1;color:#102744}
${scope} .em-match-label{font-size:14px;font-weight:750;line-height:1.35;color:#102744}
${scope} .gc-ref-stage-wrap label{text-transform:none!important;font-size:12px!important;font-weight:500!important;color:#53657c!important}
${scope} .gc-ref-stage-wrap .em-gc27-stage{height:40px!important;min-height:40px!important;font-size:12px!important;border-radius:8px!important}
${scope} .em-card-footer{grid-column:1/-1;display:flex;justify-content:flex-end;gap:10px;align-items:center}
${scope} .em-card-footer .gc-ref-cv{width:auto!important;min-height:38px!important;height:38px!important;padding:0 14px!important;border:1px solid #086be6!important;border-radius:8px!important;white-space:nowrap!important;font-size:12px!important}
${scope} .em-card-footer .em-v36-toggle{width:auto!important;min-height:38px!important;height:38px!important;padding:0 16px!important;border-radius:8px!important;background:#086be6!important;color:white!important;font-size:12px!important;font-weight:700!important}
${scope} .em-card-footer .em-v36-toggle span{font-size:12px!important}
${scope} .gc-ref-stage-wrap select[data-stage-color="Entrevista agendada"]{background:#e0f6e8!important;color:#076338!important;border-color:#bce5cc!important}
${scope} .gc-ref-stage-wrap select[data-stage-color="Em contato"]{background:#f0e8ff!important;color:#572397!important;border-color:#d7c2f7!important}
@media(max-width:1150px){${scope} .em-gc27-main{grid-template-columns:1fr!important}${scope} .gc-ref-application-group{justify-self:end!important}${scope} .gc-ref-adherence{gap:9px!important;padding:10px!important}${scope} .em-match-ring{width:64px;height:64px}${scope} .em-match-ring b{width:48px;height:48px;font-size:20px}${scope} .em-match-label{font-size:12px}}
@media(max-width:600px){${scope}{padding:15px!important;gap:14px!important}${scope} .em-gc27-main{grid-template-columns:1fr!important}${scope} .gc-ref-actions{grid-template-columns:1fr!important;gap:12px!important}${scope} .gc-ref-stage-wrap{grid-column:auto!important}${scope} .gc-ref-adherence{min-height:86px!important}${scope} .em-card-footer>*{flex:1!important;padding:0 8px!important}${scope} .em-card-footer .gc-ref-cv svg{display:none!important}}
`;
css+=`#pagina-candidatos-empresa #listaCandidatosEmpresa #gc27Lista{grid-template-columns:minmax(0,1fr)!important;gap:12px!important}
@media(min-width:1001px){
${scope}{grid-template-columns:minmax(190px,1fr) 180px 180px 260px!important;grid-template-rows:auto auto!important;column-gap:18px!important;row-gap:8px!important;padding:16px 18px!important}
${scope} .em-gc27-main,${scope} .gc-ref-actions,${scope} .gc-ref-application-group{display:contents!important}
${scope} .em-gc27-person{grid-column:1!important;grid-row:1/3!important}
${scope} .gc-ref-adherence{grid-column:2!important;grid-row:1/3!important;min-height:80px!important;padding:9px 10px!important;gap:9px!important}
${scope} .em-match-ring{width:58px;height:58px}${scope} .em-match-ring b{width:43px;height:43px;font-size:20px}${scope} .em-match-label{font-size:12px}
${scope} .gc-ref-stage-wrap{grid-column:3!important;grid-row:1/3!important;gap:7px!important}
${scope} .gc-ref-favorite{grid-column:4!important;grid-row:1!important;justify-self:end!important;width:auto!important;min-height:32px!important;height:32px!important}
${scope} .em-card-footer{grid-column:4!important;grid-row:2!important;gap:8px!important}
${scope} .em-card-footer .gc-ref-cv,${scope} .em-card-footer .em-v36-toggle{font-size:11px!important;height:34px!important;min-height:34px!important;padding:0 10px!important}
${scope} .em-card-footer .em-v36-toggle span{font-size:11px!important}
}
@media(min-width:601px) and (max-width:1000px){${scope}{grid-template-columns:1fr!important}${scope} .em-gc27-main{grid-template-columns:minmax(0,1fr) auto!important}${scope} .gc-ref-actions{grid-template-columns:1fr 1fr!important}${scope} .gc-ref-adherence{min-height:80px!important}}
`;
var style=document.createElement('style');style.id='em-candidate-compact-v1';style.textContent=css;document.head.appendChild(style);
function upgrade(){document.querySelectorAll('#listaCandidatosEmpresa .em-gc27-card:not(.em-compact-v1)').forEach(function(card){
var actions=card.querySelector('.gc-ref-actions'),match=card.querySelector('.gc-ref-adherence'),cv=card.querySelector('.gc-ref-cv'),open=card.querySelector('.em-v36-toggle');if(!actions||!match||!cv||!open)return;
var value=match.querySelector('strong'),text=value?value.textContent.trim():'—',score=Number.parseFloat(text),ring=document.createElement('span');ring.className='em-match-ring';ring.style.setProperty('--match',Number.isFinite(score)?Math.max(0,Math.min(100,score)):0);var percent=document.createElement('b');percent.textContent=text;ring.appendChild(percent);var label=document.createElement('span');label.className='em-match-label';label.textContent='Aderência à vaga';match.replaceChildren(ring,label);
var footer=document.createElement('div');footer.className='em-card-footer';footer.append(cv,open);card.appendChild(footer);
var favorite=card.querySelector('.gc-ref-favorite span');if(favorite&&!card.querySelector('.gc-ref-favorite.selected'))favorite.textContent='Favoritar candidato';
var name=card.querySelector('.em-gc27-name');if(name)name.textContent=name.textContent.toLocaleLowerCase('pt-BR').replace(/(^|\s)\S/g,function(c){return c.toLocaleUpperCase('pt-BR')});
card.classList.add('em-compact-v1');
});}
var scheduled=false;new MutationObserver(function(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;upgrade();});}).observe(document.body,{childList:true,subtree:true});upgrade();
})();
