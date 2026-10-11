(function(){
 'use strict';
 var queued=false,signature='';
 var icons={
  document:'<path d="M14 2H5v20h14V7Z"/><path d="M14 2v5h5M8 12h8M8 16h6"/>',
  briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4h8v3M3 12h18M10 12v3h4v-3"/>',
  'Área de atuação':'<path d="M5 21V3h14v18M3 21h18M9 21v-4h6v4M9 7h1M14 7h1M9 11h1M14 11h1"/>',
  'Escolaridade':'<path d="m2 9 10-5 10 5-10 5-10-5ZM6 11v6c4 3 8 3 12 0v-6M22 9v8"/>',
  'Experiência':'<circle cx="12" cy="7" r="4"/><path d="M4 21v-3a8 8 0 0 1 16 0v3Z"/>',
  'Jornada':'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>',
  'Horário':'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>'
 };
 function icon(key,cls){return '<svg class="'+cls+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(icons[key]||icons.document)+'</svg>';}
 function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 function text(id){var el=document.getElementById(id);return el?el.textContent.trim():'';}
 function content(value){
  var original=String(value||'').trim();
  return '<p>'+esc(original||'Não informado.')+'</p>';
 }
 function render(){
  queued=false;var page=document.getElementById('pagina-vaga'),box=page&&page.querySelector('.conteudo-vaga-box');if(!box)return;
  var v=window.vagaAtual||{};
  var reading=box.querySelector('.em-job-reading');
  if(!reading){reading=document.createElement('div');reading.className='em-job-reading';box.prepend(reading);}
  ['detalheDescricao','detalheRequisitos','detalheBeneficios'].forEach(function(id){var raw=document.getElementById(id),section=raw&&raw.closest('.bloco-detalhe');if(section&&section.parentElement!==reading)reading.appendChild(section);});
  box.classList.add('em-job-panel');
  page.querySelectorAll('.em-description-icon,.em-job-description-footer').forEach(function(el){el.remove();});
  var infoSection=page.querySelector('.em-job-information');
  if(!infoSection){infoSection=document.createElement('section');infoSection.className='bloco-detalhe em-job-information';infoSection.innerHTML='<h2>'+icon('briefcase','em-info-icon')+'Informações da vaga</h2><dl id="emJobInformation"></dl>';}
  var sidebar=page.querySelector('.aplicar-lateral'),company=sidebar&&(sidebar.querySelector('.em-detail-company-name')||sidebar.querySelector('.empresa-lateral'));

  var layout=page.querySelector('.detalhe-layout'),main=layout&&layout.querySelector(':scope > main');
  var mobile=window.matchMedia('(max-width:800px)').matches;
  if(mobile&&main&&infoSection.nextElementSibling!==box)box.before(infoSection);
  else if(!mobile&&company&&company.nextElementSibling!==infoSection)company.after(infoSection);
  var benefits=Array.from(page.querySelectorAll('#detalheBeneficiosTags span')).map(function(el){return el.textContent.trim();});
  var source={description:text('detalheDescricao'),requirements:text('detalheRequisitos'),benefits:benefits,benefitText:text('detalheBeneficios'),rows:[
   ['Área de atuação',v.area],['Escolaridade',v.escolaridade],['Experiência',v.experiencia],['Jornada',v.jornada],['Horário',v.horario],
   ['PcD',v.pcd],
   ['Profissionais 50+',v.senior50===true||String(v.senior50).toLowerCase()==='true'?'Oportunidade aberta também para profissionais 50+':'']
  ]};
  var next=JSON.stringify(source);if(next===signature)return;signature=next;
  [['detalheDescricao',content(source.description,false)],['detalheRequisitos',content(source.requirements,true)],['detalheBeneficios',benefits.length?'<ul>'+benefits.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul>':content(source.benefitText,true)]].forEach(function(entry){
   var raw=document.getElementById(entry[0]);if(!raw)return;var output=document.getElementById(entry[0]+'List');if(!output){output=document.createElement('div');output.id=entry[0]+'List';output.className='em-job-text';raw.after(output);}output.innerHTML=entry[1];
  });
  var info=document.getElementById('emJobInformation');if(info)info.innerHTML=source.rows.filter(function(row){return row[1]!=null&&String(row[1]).trim()&&String(row[1]).trim()!=='-';}).map(function(row){return '<div><dt>'+icon(row[0],'em-condition-icon')+'<span>'+esc(row[0])+'</span></dt><dd>'+esc(row[1])+'</dd></div>';}).join('');
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(render);}}
 function init(){render();var p=document.getElementById('pagina-vaga');if(p)new MutationObserver(function(records){if(records.some(function(r){var el=r.target.nodeType===1?r.target:r.target.parentElement;return el&&!el.closest('.em-job-text,#emJobInformation');}))schedule();}).observe(p,{subtree:true,childList:true,characterData:true});window.addEventListener('popstate',schedule);window.matchMedia('(max-width:800px)').addEventListener('change',schedule);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

(function(){
 function updateSafety(){
  var root=document.getElementById('emJobEnd'),safe=root&&root.querySelector('.je-safe'),details=safe&&safe.querySelector('details');
  if(!details||safe.dataset.referenceSafety)return;
  safe.dataset.referenceSafety='true';
  var alert=safe.querySelector('.je-alert'),summary=details.querySelector('summary');
  summary.prepend(alert);
  var text=document.createElement('div');text.className='je-safety-heading';
  while(summary.childNodes.length>1)text.appendChild(summary.childNodes[1]);
  summary.appendChild(text);
  var old=details.querySelector('p');if(old)old.remove();
  var body=document.createElement('div');body.className='je-safety-guidance';
  body.innerHTML='<ul><li>Não compre cursos com promessa de contratação.</li><li>Não inclua números de documentos no currículo.</li><li>Desconfie de pedidos de depósitos, transferências, PIX ou compra de materiais.</li><li>Fique atento a atividades, contatos ou pedidos suspeitos.</li></ul><div class="je-safety-note"><span aria-hidden="true">ⓘ</span><p>Mesmo após este alerta, qualquer compartilhamento de dados pessoais ou pagamento realizado será de responsabilidade exclusiva do candidato.</p></div>';
  details.appendChild(body);details.open=true;
  var hint=text.querySelector('span');function syncHint(){if(hint)hint.textContent='Clique para ver orientações de segurança '+(details.open?'⌃':'⌄');}details.addEventListener('toggle',syncHint);syncHint();
 }
 function start(){
  var style=document.createElement('style');style.id='em-safety-reference';
  style.textContent=`
#emJobEnd#emJobEnd .je-safe{position:relative;display:block;padding:0;border:1px solid #e4d6ff;border-radius:18px;overflow:hidden;background:#fff}
#emJobEnd#emJobEnd .je-safe details{width:100%;margin:0}
#emJobEnd#emJobEnd .je-safe summary{display:flex;align-items:center;gap:14px;box-sizing:border-box;min-height:80px;padding:18px 195px 18px 20px;border-radius:16px;color:#18243a;font-size:14px;line-height:1.5}
#emJobEnd#emJobEnd .je-safe summary>span.je-alert{display:grid;margin:0;color:#f05261;font-size:14px;font-weight:400}
#emJobEnd#emJobEnd .je-safety-heading{min-width:0}
#emJobEnd#emJobEnd .je-safety-heading>span{font-size:12px;color:#7539de;font-weight:400;margin-top:3px;display:block}
#emJobEnd#emJobEnd details[open] summary{border-bottom:1px solid #e4d6ff;border-radius:16px 16px 0 0}
#emJobEnd#emJobEnd .je-report{position:absolute;right:20px;top:21px;margin:0;padding:10px 14px;font-size:12px;border-radius:10px}
#emJobEnd#emJobEnd .je-safety-guidance{padding:16px 20px 20px 76px;font-size:12px;line-height:1.6;color:#334563}
#emJobEnd#emJobEnd .je-safety-guidance ul{list-style:none;padding:0;margin:0 0 14px;display:grid;gap:9px}
#emJobEnd#emJobEnd .je-safety-guidance li{position:relative;padding-left:25px}
#emJobEnd#emJobEnd .je-safety-guidance li:before{content:'×';position:absolute;left:0;top:1px;display:grid;place-items:center;width:16px;height:16px;border-radius:50%;background:#fdebec;color:#f05261;font-size:12px;font-weight:600}
#emJobEnd#emJobEnd .je-safety-note{display:flex;gap:9px;align-items:flex-start;padding:11px 14px;background:#faf7ff;border:1px solid #f0e8ff;border-left:3px solid #7539de;border-radius:9px;color:#38225d}
#emJobEnd#emJobEnd .je-safety-note>span{color:#7539de;font-size:15px;line-height:1.5}
#emJobEnd#emJobEnd .je-safety-note p{margin:0;font-size:12px;line-height:1.6;color:inherit}
#emJobEnd#emJobEnd summary:focus-visible{outline:2px solid #7539de;outline-offset:-2px}
@media(max-width:650px){#emJobEnd#emJobEnd .je-safe summary{padding:15px;min-height:78px}#emJobEnd#emJobEnd .je-report{position:static;margin:0 15px 14px 71px}#emJobEnd#emJobEnd .je-safety-guidance{padding:14px 15px 16px}#emJobEnd#emJobEnd .je-safety-heading{font-size:13px}}
`;document.head.appendChild(style);updateSafety();
  var page=document.getElementById('pagina-vaga');if(page)new MutationObserver(updateSafety).observe(page,{childList:true,subtree:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
