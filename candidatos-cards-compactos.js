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
css+=`${scope} .gc-ref-adherence{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:6px!important;min-height:80px!important;padding:0 18px!important;border-left:1px solid #e4eaf2!important;border-radius:0!important;background:#fff!important}
${scope} .em-match-overline{font-size:9px;font-weight:650;letter-spacing:1.4px;color:#758199;line-height:1.3}
${scope} .em-match-score{font-size:29px;font-weight:750;color:#102744;line-height:1.05;letter-spacing:-1px}${scope} .em-match-score small{font-size:17px!important;font-weight:650!important;color:#102744!important}
${scope} .em-match-ticks{display:grid;grid-template-columns:repeat(20,minmax(0,1fr));gap:3px;width:100%;max-width:180px;height:12px}${scope} .em-match-ticks i{display:block;background:#e1e6ee;border-radius:2px}${scope} .em-match-ticks i.filled{background:#0876ef}
${scope} .em-match-caption{font-size:10px;color:#7c8ba2;line-height:1.3}
${scope} .gc-ref-stage-wrap{border-left:1px solid #e4eaf2!important;padding-left:18px!important}${scope} .em-row-controls{border-left:1px solid #e4eaf2!important;padding-left:18px!important}
@media(max-width:600px){${scope} .gc-ref-adherence,${scope} .gc-ref-stage-wrap,${scope} .em-row-controls{border-left:0!important;padding-left:0!important}${scope} .gc-ref-adherence{padding:10px 0!important}}
`;
css+=`${scope} .gc-ref-adherence .em-match-overline{display:block!important;font:650 9px/1.3 Inter,Arial,sans-serif!important;letter-spacing:1.2px!important;white-space:nowrap!important;color:#758199!important;margin:0!important}
${scope} .gc-ref-adherence .em-match-score{display:block!important;font:750 29px/1.05 Inter,Arial,sans-serif!important;letter-spacing:-.8px!important;color:#102744!important;white-space:nowrap!important;margin:0!important}
${scope} .gc-ref-adherence .em-match-score small{display:inline!important;font:650 17px/1 Inter,Arial,sans-serif!important;letter-spacing:0!important;color:#102744!important;vertical-align:baseline!important;margin:0!important}
${scope} .gc-ref-adherence .em-match-caption{display:block!important;font:400 9px/1.3 Inter,Arial,sans-serif!important;color:#7c8ba2!important;white-space:nowrap!important;margin:0!important}
${scope} .gc-ref-adherence .em-match-ticks{display:grid!important;grid-template-columns:repeat(20,minmax(0,1fr))!important;gap:3px!important;height:12px!important;width:100%!important;max-width:180px!important;margin:0!important}
${scope} .gc-ref-adherence .em-match-ticks i{display:block!important;min-width:0!important;height:12px!important;border-radius:2px!important;background:#e1e6ee!important}${scope} .gc-ref-adherence .em-match-ticks i.filled{background:#0876ef!important}
${scope}{box-shadow:0 4px 14px #16395c06!important}${scope} .gc-ref-adherence{padding:0 14px!important;min-height:80px!important}
`;
var style=document.createElement('style');style.id='em-candidate-compact-v1';style.textContent=css;document.head.appendChild(style);
function upgrade(){document.querySelectorAll('#listaCandidatosEmpresa .em-gc27-card:not(.em-compact-v1)').forEach(function(card){
var actions=card.querySelector('.gc-ref-actions'),match=card.querySelector('.gc-ref-adherence'),cv=card.querySelector('.gc-ref-cv'),open=card.querySelector('.em-v36-toggle');if(!actions||!match||!cv||!open)return;
var value=match.querySelector('strong'),text=value?value.textContent.trim():'—',score=Number.parseFloat(text);
var overline=document.createElement('span');overline.className='em-match-overline';overline.textContent='ADERÊNCIA À VAGA';
var number=document.createElement('span');number.className='em-match-score';number.textContent=Number.isFinite(score)?String(score):'—';if(Number.isFinite(score)){var symbol=document.createElement('small');symbol.textContent='%';number.appendChild(symbol);}
var ticks=document.createElement('span');ticks.className='em-match-ticks';ticks.setAttribute('aria-hidden','true');for(var t=0;t<20;t++){var tick=document.createElement('i');if(Number.isFinite(score)&&t<Math.round(Math.max(0,Math.min(100,score))/5))tick.className='filled';ticks.appendChild(tick);}
var caption=document.createElement('span');caption.className='em-match-caption';caption.textContent='Compatibilidade do perfil';match.replaceChildren(overline,number,ticks,caption);
var footer=document.createElement('div');footer.className='em-card-footer';footer.append(cv,open);card.appendChild(footer);
var favorite=card.querySelector('.gc-ref-favorite span');if(favorite&&!card.querySelector('.gc-ref-favorite.selected'))favorite.textContent='Favoritar candidato';
var name=card.querySelector('.em-gc27-name');if(name)name.textContent=name.textContent.toLocaleLowerCase('pt-BR').replace(/(^|\s)\S/g,function(c){return c.toLocaleUpperCase('pt-BR')});
var originalDetails=card.querySelector('[data-gc27-expand]');var person=card.querySelector('.em-gc27-person'),stage=card.querySelector('.gc-ref-stage-wrap'),fav=card.querySelector('.gc-ref-favorite');if(!person||!stage||!fav)return;var controls=document.createElement('div');controls.className='em-row-controls';controls.append(fav,footer);var row=document.createElement('div');row.className='em-candidate-row';row.append(person,match,stage,controls);card.replaceChildren(row);if(originalDetails){originalDetails.hidden=true;card.appendChild(originalDetails);}card.classList.add('em-compact-v1');
});}
var scheduled=false;new MutationObserver(function(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;upgrade();});}).observe(document.body,{childList:true,subtree:true});upgrade();
})();
