(function(){
 'use strict';
 var signature='',queued=false;
 function esc(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 function text(id){var e=document.getElementById(id);return e?e.textContent.trim():'';}
 function truth(v){return ['true','1','sim','confidencial'].includes(String(v||'').trim().toLowerCase());}
 function icon(name){var p={star:'<path d="m12 3 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3L3 9.6l6.2-.9Z"/>',pin:'<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',case:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3"/>',screen:'<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M12 16v5M8 21h8"/>',money:'<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M5 9h1m12 6h1"/>',gift:'<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v9h14v-9M12 8v13M12 8H8a3 3 0 1 1 3-3l1 3Zm0 0h4a3 3 0 1 0-3-3l-1 3Z"/>'};return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p[name]+'</svg>';}
 function data(){var v=window.vagaAtual;try{if(!v&&typeof window.localizarVaga==='function')v=window.localizarVaga(new URLSearchParams(location.search).get('id'));}catch(e){}return v||{};}
 function render(){
  queued=false;var hero=document.getElementById('emVagaHeroV88');if(!hero||!text('detalheCargoCab'))return;
  var v=data(),confidential=truth(v.confidencial)||document.getElementById('pagina-vaga').classList.contains('vaga-confidencial-em'),oldLogo=document.getElementById('logoDetalhe'),company=confidential?'Empresa confidencial':v.empresa||text('detalheEmpresaCab')||'Empresa';
  var logo=!confidential&&oldLogo&&oldLogo.getAttribute('src')||'',date=text('detalhePublicacao'),area=v.area||'',pcd=Array.from(document.querySelectorAll('#detalheTags span')).map(function(e){return e.textContent.trim();}).filter(function(t){return /pcd/i.test(t);}).join(' • ');
  var benefits=Array.from(document.querySelectorAll('#emHeroBeneficiosListaV88 span')).flatMap(function(e){return e.textContent.trim().split(/\s+e\s+(?=assistência|vale|auxílio|plano|seguro)/i);}).filter(Boolean);
  var highlight=document.getElementById('emHeroDestaqueV88'),featured=highlight&&!highlight.hasAttribute('hidden');
  var salary=text('detalheSalario');if(typeof window.formatarSalarioExibicao==='function')salary=window.formatarSalarioExibicao(v.salario||salary);if(/combinar/i.test(salary)||!salary||salary==='-')salary='A combinar';else if(!/^R\$/i.test(salary))salary='R$ '+salary;
  var city=text('detalheCidade'),uf=v.uf||v.estado;if(uf&&city.toLowerCase().indexOf(String(uf).toLowerCase())<0)city+=' • '+uf;
  var model={id:v.id,company:company,title:text('detalheCargoCab'),logo:logo,area:area,pcd:pcd,date:date,featured:featured,benefits:benefits,city:city,contract:text('detalheContrato'),mode:text('detalheModalidade'),salary:salary,confidential:confidential};
  var key=JSON.stringify(model);if(signature===key&&document.getElementById('emJobHeaderReference'))return;signature=key;
  var root=document.getElementById('emJobHeaderReference');if(!root){root=document.createElement('div');root.id='emJobHeaderReference';hero.appendChild(root);}hero.classList.add('em-header-reference');
  var initials=company.split(/\s+/).filter(Boolean).slice(0,2).map(function(w){return w.charAt(0);}).join('').toUpperCase();
  function tile(label,value,name,cls){return '<div class="jh-tile '+(cls||'')+'"><span class="jh-icon">'+icon(name)+'</span><div><span class="jh-label">'+label+'</span><strong class="jh-value">'+esc(value)+'</strong></div></div>';}
  root.innerHTML='<div class="jh-top"><div class="jh-logo" aria-label="'+esc(company)+'">'+esc(initials)+'</div><div><button class="jh-company" type="button">'+esc(company.toUpperCase())+'</button><h1 class="jh-title">'+esc(model.title)+'</h1><div class="jh-subline"><span>'+esc(area)+'</span>'+(pcd?'<span class="jh-pcd">'+esc(pcd.replace(/^PcD:?\s*/i,'Vaga para PcD • '))+'</span>':'')+'</div></div><div class="jh-aside">'+(featured?'<span class="jh-highlight">'+icon('star')+'Vaga em destaque</span>':'')+(date&&date!=='-'?'<small class="jh-date">Publicada em '+esc(date)+'</small>':'')+'</div></div><div class="jh-tiles">'+tile('LOCALIZAÇÃO',city,'pin')+tile('CONTRATO',model.contract,'case')+tile('MODALIDADE',model.mode,'screen')+tile('SALÁRIO',salary,'money','jh-salary')+'</div>'+(benefits.length?'<div class="jh-benefits"><strong class="jh-benefit-label"><span class="jh-icon">'+icon('gift')+'</span>Benefícios desta vaga</strong><div class="jh-benefit-list">'+benefits.map(function(b){return '<span class="jh-benefit">'+esc(b)+'</span>';}).join('')+'</div></div>':'');
  var companyButton=root.querySelector('.jh-company');companyButton.onclick=function(){var original=document.getElementById('detalheEmpresaCab');if(!confidential&&original)original.click();};if(confidential)companyButton.disabled=true;
  if(logo){var image=document.createElement('img');image.alt='Logo de '+company;image.src=logo;image.onerror=function(){var box=this.parentNode;if(box)box.textContent=initials;};root.querySelector('.jh-logo').replaceChildren(image);}
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(render);}}
 function init(){render();var hero=document.getElementById('emVagaHeroV88');if(!hero)return;new MutationObserver(function(records){if(records.some(function(r){var el=r.target.nodeType===1?r.target:r.target.parentElement;return el&&!el.closest('#emJobHeaderReference')&&!(r.type==='attributes'&&r.target===hero);}))schedule();}).observe(hero,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['src','hidden']});
  var publication=document.getElementById('detalhePublicacao');if(publication)new MutationObserver(schedule).observe(publication,{childList:true,characterData:true,subtree:true});window.addEventListener('popstate',schedule);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
