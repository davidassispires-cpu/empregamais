(function(){
 'use strict';
 var queued=false,signature='';
 function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 function text(id){var el=document.getElementById(id);return el?el.textContent.trim():'';}
 function content(value,list){
  var lines=String(value||'').split(/\r?\n/).map(function(x){return x.trim();}).filter(Boolean);
  if(!lines.length)return '<p>Não informado.</p>';
  var result='',items=[];
  function flush(){if(items.length){result+='<ul>'+items.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>';items=[];}}
  lines.forEach(function(line){var bullet=/^(?:[-*•✓]\s+|\d+[.)]\s+)/.test(line);if(bullet||list)items.push(line.replace(/^(?:[-*•✓]\s+|\d+[.)]\s+)/,''));else{flush();result+='<p>'+esc(line)+'</p>';}});flush();return result;
 }
 function render(){
  queued=false;var page=document.getElementById('pagina-vaga'),box=page&&page.querySelector('.conteudo-vaga-box');if(!box)return;
  var v=window.vagaAtual||{},hero=page.querySelector('.jh-tiles .jh-tile .jh-value');
  var infoSection=page.querySelector('.em-job-information'),footer=page.querySelector('.em-job-description-footer');
  if(!infoSection){infoSection=document.createElement('section');infoSection.className='bloco-detalhe em-job-information';infoSection.innerHTML='<h2>Informações da vaga</h2><dl id="emJobInformation"></dl>';}
  if(infoSection.parentElement!==box)box.appendChild(infoSection);
  if(!footer){footer=document.createElement('div');footer.className='em-job-description-footer';footer.innerHTML='<small>Candidatura gratuita</small><button class="btn" type="button">Candidatar-se</button>';footer.querySelector('button').onclick=function(){var b=document.getElementById('btnCandidatar');if(b)b.click();};}
  if(footer.parentElement!==box)box.appendChild(footer);
  var benefits=Array.from(page.querySelectorAll('#detalheBeneficiosTags span')).map(function(el){return el.textContent.trim();});
  var source={description:text('detalheDescricao'),requirements:text('detalheRequisitos'),benefits:benefits,benefitText:text('detalheBeneficios'),rows:[
   ['Área de atuação',v.area],['Escolaridade',v.escolaridade],['Experiência',v.experiencia],['Jornada',v.jornada],['Horário',v.horario],
   ['Modalidade',v.modalidade||text('detalheModalidade')],['Contrato',v.contrato||text('detalheContrato')],
   ['Localização',hero?hero.textContent.trim():text('detalheCidade')],['Salário',text('detalheSalario')],['PcD',v.pcd],
   ['Profissionais 50+',v.senior50===true||String(v.senior50).toLowerCase()==='true'?'Oportunidade aberta também para profissionais 50+':'']
  ]};
  var next=JSON.stringify(source);if(next===signature)return;signature=next;
  [['detalheDescricao',content(source.description,false)],['detalheRequisitos',content(source.requirements,true)],['detalheBeneficios',benefits.length?'<ul>'+benefits.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>':content(source.benefitText,true)]].forEach(function(entry){
   var raw=document.getElementById(entry[0]);if(!raw)return;var output=document.getElementById(entry[0]+'List');if(!output){output=document.createElement('div');output.id=entry[0]+'List';output.className='em-job-text';raw.after(output);}output.innerHTML=entry[1];
  });
  var info=document.getElementById('emJobInformation');if(info)info.innerHTML=source.rows.filter(function(row){return row[1]!=null&&String(row[1]).trim()&&String(row[1]).trim()!=='-';}).map(function(row){return '<div><dt>'+esc(row[0])+':</dt><dd>'+esc(row[1])+'</dd></div>';}).join('');
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(render);}}
 function init(){render();var p=document.getElementById('pagina-vaga');if(p)new MutationObserver(function(records){if(records.some(function(r){var el=r.target.nodeType===1?r.target:r.target.parentElement;return el&&!el.closest('.em-job-text,#emJobInformation');}))schedule();}).observe(p,{subtree:true,childList:true,characterData:true});window.addEventListener('popstate',schedule);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
