(function(global){
 'use strict';
 var FIELD='preSelecionadoRecrutador';
 function jobId(row){return String(row.vagaId||row.vaga_id||row.idVaga||'');}
 function selected(row){return !!row&&(Object.prototype.hasOwnProperty.call(row,FIELD)?row[FIELD]===true:row.favoritoRecrutador===true);}
 function update(rows,id,job,value,ownedJobs){
  id=String(id||'');job=String(job||'');
  if(typeof value!=='boolean'||!id||!job||!ownedJobs.map(String).includes(job))throw Error('Reabra uma vaga da sua empresa para organizar as candidaturas.');
  var found=false;
  var result=rows.map(function(row){if(String(row.id)!==id||jobId(row)!==job)return row;found=true;var next=Object.assign({},row);next[FIELD]=value;return next;});
  if(!found)throw Error('Esta candidatura não está disponível nesta vaga.');
  return result;
 }
 var core={selected:selected,update:update,jobId:jobId};
 if(typeof module!=='undefined'&&module.exports)module.exports=core;
 if(!global.document)return;
 var document=global.document,owner='',only=false,refresh=null,queued=false,focusRequest=null;
 function currentJob(){return String(global.sessionStorage.getItem('vagaCandidatosSelecionada')||'');}
 function jobs(){try{return (global.vagasDaEmpresa()||[]).map(function(job){return String(job.id);});}catch(ignore){return [];}}
 function scope(job){return String(global.sessionStorage.getItem('empresaCnpj')||global.sessionStorage.getItem('empresaEmail')||'demo')+'\n'+String(job||'');}
 function adopt(job){var key=scope(job);if(owner!==key){owner=key;only=false;refresh=null;focusRequest=null;}}
 function allowed(job){return global.sessionStorage.getItem('empregaMaisPapel')!=='candidato'&&!!job&&job===currentJob()&&jobs().includes(job);}
 function rows(){try{return global.carregarCandidaturas()||[];}catch(ignore){return [];}}
 function active(job){adopt(job);return allowed(String(job))&&only;}
 function filtered(list,job){return active(job)?list.filter(selected):list;}
 function attach(job,callback){adopt(job);refresh=callback;}
 function redraw(){if(refresh)refresh();else if(typeof global.renderizarCandidatosEmpresa==='function')global.renderizarCandidatosEmpresa();schedule();}
 function feedback(message){var status=document.getElementById('emPreselectionStatus');if(status&&status.textContent!==message)status.textContent=message;}
 function toggle(id,job){
  job=String(job||'');if(!allowed(job))return false;
  var list=rows(),row=list.find(function(item){return String(item.id)===String(id)&&jobId(item)===job;});
  if(!row)return false;
  try{global.salvarCandidaturas(update(list,id,job,!selected(row),jobs()));focusRequest=String(id);redraw();feedback('Pré-seleção atualizada. Marcação interna da empresa.');return true;}
  catch(error){feedback('Não foi possível salvar a pré-seleção. Tente novamente.');return false;}
 }
 function changeFilter(){var job=currentJob();if(!allowed(job))return;adopt(job);only=!only;redraw();}
 function icon(){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m8 12 3 3 6-7"/><rect x="3" y="3" width="18" height="18" rx="4"/></svg>';}
 function paint(button,isSelected){
  var label=isSelected?'Pré-selecionado':'Pré-selecionar';
  if(button.getAttribute('aria-pressed')!==String(isSelected))button.setAttribute('aria-pressed',String(isSelected));
  var span=button.querySelector('span');if(span&&span.textContent!==label)span.textContent=label;
  if(button.classList.contains('selected')!==isSelected)button.classList.toggle('selected',isSelected);
  var description=isSelected?'Remover da pré-seleção interna desta vaga':'Pré-selecionar para análise interna desta vaga';
  if(button.getAttribute('aria-label')!==description)button.setAttribute('aria-label',description);
  button.title=description+'. Esta marcação é visível apenas para a empresa.';
 }
 function prepare(button,row,job){
  if(!button.dataset.rpsToggle){button.type='button';button.onclick=null;button.classList.add('em-preselect-button');button.dataset.rpsToggle=String(row.id);button.dataset.rpsJob=job;button.innerHTML=icon()+'<span></span>';}
  paint(button,selected(row));
 }
 function enhance(){
  queued=false;var job=currentJob(),host=document.getElementById('listaCandidatosEmpresa');if(!host||!allowed(job))return;
  adopt(job);var all=rows().filter(function(row){return jobId(row)===job;}),byId=new Map(all.map(function(row){return [String(row.id),row];}));
  var toolbar=host.querySelector('.em-gc27-tools'),favorite=host.querySelector('#gc27Favoritos');
  if(toolbar&&favorite&&toolbar.querySelector('#gcRefLocal')&&!favorite.dataset.rpsFilter){
   favorite.onclick=null;favorite.dataset.rpsFilter='1';favorite.title='Exibir as candidaturas pré-selecionadas pela empresa';favorite.innerHTML=icon()+'<span></span>';
  }
  if(toolbar&&!host.querySelector('.em-preselection-note')){
   var note=document.createElement('p');note.className='em-preselection-note';note.textContent='A pré-seleção é interna e ajuda a empresa a organizar a análise dos currículos. O candidato vê apenas as alterações em “Etapa do processo”.';toolbar.after(note);
   var status=document.createElement('p');status.id='emPreselectionStatus';status.className='em-preselection-feedback';status.setAttribute('role','status');status.setAttribute('aria-live','polite');toolbar.after(status);
  }
  var filter=host.querySelector('[data-rps-filter]');
  if(filter){var text='Pré-selecionados ('+all.filter(selected).length+')';if(filter.getAttribute('aria-pressed')!==String(only))filter.setAttribute('aria-pressed',String(only));var count=filter.querySelector('span');if(count.textContent!==text)count.textContent=text;}
  host.querySelectorAll('.em-gc27-card').forEach(function(card){
   var stage=card.querySelector('[data-gc27-stage]'),row=stage&&byId.get(String(stage.dataset.gc27Stage));if(!row)return;
   var button=card.querySelector('.gc-ref-favorite');if(button)prepare(button,row,job);
  });
  var modal=document.getElementById('emCandidateDetails'),modalStage=modal&&modal.querySelector('[data-gc27-stage]'),modalRow=modal&&byId.get(String(modal.dataset.rpsApplication||modalStage&&modalStage.dataset.gc27Stage||'')),modalButton=modal&&modal.querySelector('.em-wide-favorite');
  if(modalButton&&modalRow)prepare(modalButton,modalRow,job);
  if(focusRequest){var target=modal&&modal.open&&modalButton&&modalButton.dataset.rpsToggle===focusRequest?modalButton:Array.from(host.querySelectorAll('[data-rps-toggle]')).find(function(button){return button.dataset.rpsToggle===focusRequest;})||filter;if(target){target.focus({preventScroll:true});focusRequest=null;}}
 }
 function schedule(){if(!queued){queued=true;global.requestAnimationFrame(enhance);}}
 global.EMRecruiterPreselection={core:core,filtered:filtered,active:active,attach:attach,toggle:toggle,changeFilter:changeFilter};
 function start(){
  var host=document.getElementById('listaCandidatosEmpresa');
  if(global.MutationObserver){var observer=new global.MutationObserver(schedule);if(host)observer.observe(host,{childList:true,subtree:true});observer.observe(document.body,{childList:true});}
  document.addEventListener('click',function(event){var button=event.target.closest&&event.target.closest('[data-rps-toggle],[data-rps-filter]');if(!button)return;event.preventDefault();if(button.dataset.rpsToggle)toggle(button.dataset.rpsToggle,button.dataset.rpsJob);else changeFilter();});
  ['empregamais:candidaturas-sincronizadas','empregamais:candidaturas-atualizadas','empregamais:empresa-sincronizada'].forEach(function(name){document.addEventListener(name,schedule);});
  var style=document.createElement('style');style.id='em-recruiter-preselection-style';style.textContent=`
@layer candidate-palette{
#pagina-candidatos-empresa #listaCandidatosEmpresa .em-gc27-card .em-preselect-button,#emCandidateDetails .em-wide-favorite.em-preselect-button{display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;min-height:32px!important;height:auto!important;padding:6px 10px!important;border:1px solid #a8c9ef!important;border-radius:8px!important;background:#fff!important;color:#086be6!important;font-family:inherit!important;font-size:12px!important;font-weight:600!important;line-height:1.2!important;cursor:pointer!important}
#pagina-candidatos-empresa #listaCandidatosEmpresa .em-preselect-button span{font-size:12px!important;line-height:1.2!important}
#pagina-candidatos-empresa #listaCandidatosEmpresa .em-preselect-button svg,#emCandidateDetails .em-wide-favorite.em-preselect-button svg{width:15px!important;height:15px!important;flex:none!important}
#pagina-candidatos-empresa #listaCandidatosEmpresa .em-preselect-button[aria-pressed=true],#emCandidateDetails .em-wide-favorite.em-preselect-button[aria-pressed=true]{background:#eaf4ff!important;border-color:#086be6!important;color:#0753ad!important}
#pagina-candidatos-empresa #listaCandidatosEmpresa [data-rps-filter]{white-space:nowrap!important;min-height:42px!important;padding:8px 10px!important;font-size:12px!important}
#pagina-candidatos-empresa #listaCandidatosEmpresa [data-rps-filter][aria-pressed=true]{background:#eaf4ff!important;border-color:#086be6!important;color:#0753ad!important}
#pagina-candidatos-empresa #listaCandidatosEmpresa .em-gc27-tools:has([data-rps-filter]){grid-template-columns:minmax(200px,1fr) minmax(140px,.65fr) minmax(130px,.6fr) auto!important}
#pagina-candidatos-empresa #listaCandidatosEmpresa .em-preselection-feedback{min-height:0!important;margin:0!important;color:#52657a!important;font-size:12px!important;line-height:1.4!important}
#pagina-candidatos-empresa #listaCandidatosEmpresa .em-preselection-feedback:not(:empty){margin:0 0 10px!important}
#pagina-candidatos-empresa #listaCandidatosEmpresa .em-preselection-note{margin:0 0 14px!important;color:#52657a!important;font-size:12px!important;line-height:1.55!important}
#pagina-candidatos-empresa #listaCandidatosEmpresa [data-rps-toggle]:focus-visible,#pagina-candidatos-empresa #listaCandidatosEmpresa [data-rps-filter]:focus-visible{outline:3px solid #90bcf4!important;outline-offset:2px!important}
@media(max-width:1100px){#pagina-candidatos-empresa #listaCandidatosEmpresa .em-gc27-tools:has([data-rps-filter]){grid-template-columns:repeat(2,minmax(0,1fr))!important}}
@media(max-width:520px){#pagina-candidatos-empresa #listaCandidatosEmpresa .em-gc27-tools:has([data-rps-filter]){grid-template-columns:minmax(0,1fr)!important}}
}`;
  document.head.appendChild(style);schedule();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(typeof window!=='undefined'?window:globalThis);
