(function(){
'use strict';
var scope='#pagina-candidatos-empresa #listaCandidatosEmpresa .em-gc27-card.em-compact-v1';
var css=`#pagina-candidatos-empresa #listaCandidatosEmpresa #gc27Lista{display:grid!important;grid-template-columns:1fr!important;gap:12px!important;container-type:inline-size}
${scope}{padding:14px 18px!important;border:1px solid #d9e6f4!important;border-radius:12px!important;background:#fff!important;box-shadow:none!important;display:block!important;min-width:0!important}
${scope} .em-candidate-row{display:grid!important;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr) minmax(0,.8fr) minmax(0,1.15fr)!important;align-items:center!important;gap:20px!important}
${scope} .em-candidate-row>*{grid-column:auto!important;grid-row:auto!important;min-width:0!important;margin:0!important}
${scope} .em-gc27-person{display:flex!important;gap:12px!important;align-items:center!important}
${scope} .em-gc27-avatar{width:48px!important;height:48px!important;min-width:48px!important;font-size:18px!important;background:#e5f1ff!important;color:#145caa!important;border:0!important}
${scope} .em-gc27-name{text-transform:none!important;font-size:16px!important;line-height:1.3!important;font-weight:750!important;color:#102744!important;overflow-wrap:anywhere!important}
${scope} .em-gc27-info{font-size:11px!important;line-height:1.55!important;color:#647893!important}
${scope} .gc-ref-adherence{display:flex!important;align-items:center!important;justify-content:center!important;gap:12px!important;min-height:84px!important;padding:10px!important;border:0!important;border-radius:10px!important;background:#edf6ff!important;box-sizing:border-box!important}
${scope} .em-match-ring{width:60px;height:60px;flex:none;border-radius:50%;background:conic-gradient(#086be6 calc(var(--match)*1%),#bddfff 0);display:grid;place-items:center}
${scope} .em-match-ring b{display:grid;place-items:center;width:45px;height:45px;border-radius:50%;background:#edf6ff;font-size:21px;line-height:1;color:#102744}
${scope} .em-match-label{font-size:12px;font-weight:700;line-height:1.35;color:#102744}
${scope} .gc-ref-stage-wrap{display:flex!important;flex-direction:column!important;gap:8px!important}
${scope} .gc-ref-stage-wrap label{text-transform:none!important;font-size:11px!important;font-weight:500!important;color:#53657c!important;white-space:normal!important}
${scope} .gc-ref-stage-wrap .em-gc27-stage{width:100%!important;max-width:none!important;height:38px!important;min-height:38px!important;padding:0 9px!important;font-size:11px!important;border-radius:8px!important}
${scope} .em-row-controls{display:flex!important;flex-direction:column!important;gap:8px!important;align-items:stretch!important}
${scope} .em-row-controls .gc-ref-favorite{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;height:34px!important;min-height:34px!important;padding:0 8px!important;border:1px solid #086be6!important;border-radius:8px!important;background:#fff!important;color:#086be6!important;gap:7px!important;font-size:11px!important;font-weight:700!important;box-sizing:border-box!important}
${scope} .gc-ref-favorite span{font-size:11px!important;font-weight:700!important;white-space:nowrap!important}${scope} .gc-ref-favorite svg{width:18px!important;height:18px!important}
${scope} .em-row-controls .gc-ref-favorite.selected{background:#fff7e0!important;border-color:#e8c562!important;color:#986b12!important}
${scope} .em-card-footer{display:flex!important;gap:8px!important;align-items:center!important;width:100%!important}
${scope} .em-card-footer .gc-ref-cv,${scope} .em-card-footer .em-v36-toggle{flex:1!important;width:auto!important;height:36px!important;min-height:36px!important;padding:0 8px!important;border-radius:8px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;font-size:10px!important;white-space:nowrap!important;box-sizing:border-box!important}
${scope} .em-card-footer .gc-ref-cv{border:1px solid #086be6!important;background:white!important;color:#086be6!important}${scope} .em-card-footer .gc-ref-cv svg{width:15px!important;height:15px!important}
${scope} .em-card-footer .em-v36-toggle{border:1px solid #086be6!important;background:#086be6!important;color:white!important;font-weight:700!important}${scope} .em-card-footer .em-v36-toggle span{font-size:10px!important}
${scope} .gc-ref-stage-wrap select[data-stage-color="Entrevista agendada"]{background:#e0f6e8!important;color:#076338!important;border:1px solid #bce5cc!important}
${scope} .gc-ref-stage-wrap select[data-stage-color="Em contato"]{background:#f0e8ff!important;color:#572397!important;border:1px solid #d7c2f7!important}
@container(max-width:800px){${scope} .em-candidate-row{grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:14px!important}${scope} .em-row-controls{grid-column:2!important;grid-row:1!important}${scope} .gc-ref-adherence{grid-column:1!important;grid-row:2!important}${scope} .gc-ref-stage-wrap{grid-column:2!important;grid-row:2!important}}
@media(max-width:600px){${scope}{padding:14px!important}${scope} .em-candidate-row{grid-template-columns:1fr!important;gap:12px!important}${scope} .em-candidate-row>*{grid-column:1!important;grid-row:auto!important}${scope} .em-row-controls{grid-row:4!important}${scope} .gc-ref-adherence{justify-content:flex-start!important}${scope} .em-gc27-name{font-size:16px!important}}
`;
var style=document.createElement('style');style.id='em-candidate-compact-v1';style.textContent=css;document.head.appendChild(style);
function upgrade(){document.querySelectorAll('#listaCandidatosEmpresa .em-gc27-card:not(.em-compact-v1)').forEach(function(card){
var actions=card.querySelector('.gc-ref-actions'),match=card.querySelector('.gc-ref-adherence'),cv=card.querySelector('.gc-ref-cv'),open=card.querySelector('.em-v36-toggle');if(!actions||!match||!cv||!open)return;
var value=match.querySelector('strong'),text=value?value.textContent.trim():'—',score=Number.parseFloat(text),ring=document.createElement('span');ring.className='em-match-ring';ring.style.setProperty('--match',Number.isFinite(score)?Math.max(0,Math.min(100,score)):0);var percent=document.createElement('b');percent.textContent=text;ring.appendChild(percent);var label=document.createElement('span');label.className='em-match-label';label.textContent='Aderência à vaga';match.replaceChildren(ring,label);
var footer=document.createElement('div');footer.className='em-card-footer';footer.append(cv,open);card.appendChild(footer);
var favorite=card.querySelector('.gc-ref-favorite span');if(favorite&&!card.querySelector('.gc-ref-favorite.selected'))favorite.textContent='Favoritar candidato';
var name=card.querySelector('.em-gc27-name');if(name)name.textContent=name.textContent.toLocaleLowerCase('pt-BR').replace(/(^|\s)\S/g,function(c){return c.toLocaleUpperCase('pt-BR')});
var person=card.querySelector('.em-gc27-person'),stage=card.querySelector('.gc-ref-stage-wrap'),fav=card.querySelector('.gc-ref-favorite');if(!person||!stage||!fav)return;var controls=document.createElement('div');controls.className='em-row-controls';controls.append(fav,footer);var row=document.createElement('div');row.className='em-candidate-row';row.append(person,match,stage,controls);card.replaceChildren(row);card.classList.add('em-compact-v1');
});}
var scheduled=false;new MutationObserver(function(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;upgrade();});}).observe(document.body,{childList:true,subtree:true});upgrade();
})();
