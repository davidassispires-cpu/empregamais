(function(){
 'use strict';
 var current=null,cleanup=function(){};
 function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();}
 function esc(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 function icon(name){var paths={pin:'<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',building:'<path d="M5 21V3h10v18M15 9h4v12M3 21h18M8 7h1m2 0h1M8 11h1m2 0h1M8 15h1m2 0h1M9 21v-3h3v3"/>',case:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3"/>',bookmark:'<path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4Z"/>',right:'<path d="M5 12h14m-6-6 6 6-6 6"/>',prev:'<path d="m14 5-7 7 7 7"/>',next:'<path d="m10 5 7 7-7 7"/>'};return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[name]+'</svg>';}
 function date(v){var raw=v.dataPublicacao||v.criado_em||v.publicadaEm||v.dataCriacao;if(!raw)return null;var match=String(raw).match(/^(\d{2})\/(\d{2})\/(\d{4})$/),d=match?new Date(+match[3],+match[2]-1,+match[1]):new Date(raw);return isNaN(d)?null:d;}
 function published(v){var d=date(v);if(!d)return 'Data de publicação não informada';var today=new Date();today.setHours(0,0,0,0);d.setHours(0,0,0,0);var days=Math.round((today-d)/86400000);if(days<0)return 'Publicada em '+d.toLocaleDateString('pt-BR');return days===0?'Publicada hoje':days===1?'Publicada há 1 dia':'Publicada há '+days+' dias';}
 function reason(ref,v){if(norm(ref.area)&&norm(ref.area)===norm(v.area))return 'Mesma área';if(norm(ref.cidade)&&norm(ref.cidade)===norm(v.cidade))return 'Na mesma cidade';if(norm(ref.modalidade)&&norm(ref.modalidade)===norm(v.modalidade))return 'Mesma modalidade';if(norm(ref.contrato)&&norm(ref.contrato)===norm(v.contrato))return 'Mesmo tipo de contrato';return 'Outra oportunidade';}
 function saved(id){try{return typeof window.carregarFavoritos==='function'&&(window.carregarFavoritos()||[]).some(function(x){return String(x)===String(id);});}catch(e){return false;}}
 function salary(v){var formatted=typeof window.formatarSalarioExibicao==='function'?window.formatarSalarioExibicao(v.salario):String(v.salario||'A combinar');if(!formatted||norm(formatted).includes('combinar'))return 'Salário a combinar';return /^R\$/.test(formatted)?formatted:'R$ '+formatted;}
 function card(v,ref){
  var el=document.createElement('article');el.className='em-rec-card';var title=v.cargo||v.titulo||'Vaga',city=v.cidade||'Local não informado',uf=v.uf||v.estado||'';if(uf&&norm(city).indexOf(norm(uf))<0)city+=' • '+uf;
  el.innerHTML='<h3 class="em-rec-title" title="'+esc(title)+'">'+esc(String(title).toUpperCase())+'</h3><p class="em-rec-company">'+esc(String(['true','1','sim','confidencial'].includes(norm(v.confidencial))?'Empresa confidencial':v.empresa||'Empresa').toUpperCase())+'</p><button type="button" class="em-rec-bookmark" aria-label="Salvar vaga: '+esc(title)+'" aria-pressed="'+saved(v.id)+'">'+icon('bookmark')+'</button><div class="em-rec-location">'+icon('pin')+'<span title="'+esc(city)+'">'+esc(city)+'</span></div><div class="em-rec-meta"><span>'+icon('building')+esc(v.modalidade||'Não informada')+'</span><span>'+icon('case')+esc(norm(v.contrato).includes('clt')?'CLT':v.contrato||'Não informado')+'</span></div><span class="em-rec-reason">'+esc(reason(ref,v))+'</span><div class="em-rec-bottom"><strong class="em-rec-salary">'+esc(salary(v))+'</strong><small class="em-rec-date">'+esc(published(v))+'</small><a class="em-rec-open" href="?pagina=vaga&amp;id='+encodeURIComponent(v.id)+'">Ver vaga '+icon('right')+'</a></div>';
  el.querySelector('.em-rec-open').onclick=function(e){if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();window.irPara('vaga',v.id);};
  var bookmark=el.querySelector('.em-rec-bookmark');bookmark.onclick=function(){if(typeof window.alternarFavorito==='function')window.alternarFavorito(v.id);paintBookmarks();};bookmark.dataset.jobId=String(v.id);
  return el;
 }
 function paintBookmarks(){document.querySelectorAll('#emRecommendedCarousel .em-rec-bookmark').forEach(function(button){var active=saved(button.dataset.jobId);button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',(active?'Remover vaga salva: ':'Salvar vaga: ')+button.closest('article').querySelector('h3').textContent);});}
 window.renderizarRecomendacoesVaga=function(ref){
  var section=document.getElementById('secaoRecomendacoesVaga');if(!section||!ref)return;cleanup();current=ref;section.classList.add('em-rec-section');section.innerHTML='<div id="emRecommendedCarousel"><div class="em-rec-header"><div><h2>Outras vagas que podem interessar a você</h2><p class="em-rec-subtitle">Explore oportunidades semelhantes e compare os principais detalhes.</p></div><a class="em-rec-more" href="?pagina=home#vagas">Ver mais oportunidades '+icon('right')+'</a></div><div class="em-rec-wrap"><button class="em-rec-arrow em-rec-prev" type="button" aria-label="Vagas anteriores">'+icon('prev')+'</button><div class="em-rec-track" id="listaRecomendacoesVaga" tabindex="0" role="region" aria-label="Carrossel de vagas recomendadas"></div><button class="em-rec-arrow em-rec-next" type="button" aria-label="Próximas vagas">'+icon('next')+'</button></div><div class="em-rec-dots" aria-label="Páginas de recomendações"></div></div>';
  var root=section.firstChild,track=root.querySelector('.em-rec-track'),prev=root.querySelector('.em-rec-prev'),next=root.querySelector('.em-rec-next'),dots=root.querySelector('.em-rec-dots'),seen=new Set();
  var jobs=(typeof window.todasAsVagasPublicas==='function'?window.todasAsVagasPublicas():[]).filter(function(v){if(!v.id||String(v.id)===String(ref.id)||seen.has(String(v.id)))return false;seen.add(String(v.id));return true;});
  jobs.sort(function(a,b){var score=typeof window.pontuacaoRecomendacaoVaga==='function'?window.pontuacaoRecomendacaoVaga(ref,b)-window.pontuacaoRecomendacaoVaga(ref,a):0;return score||((date(b)||0)-(date(a)||0));});jobs=jobs.slice(0,12);jobs.forEach(function(v){track.appendChild(card(v,ref));});
  root.querySelector('.em-rec-more').onclick=function(e){if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();window.irPara('home');var list=document.getElementById('vagas');if(list)list.scrollIntoView({behavior:motion()});};
  function motion(){return window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';}
  function perPage(){return window.innerWidth<=560?1:window.innerWidth<=900?2:4;}
  function step(){var first=track.firstElementChild;return first?first.getBoundingClientRect().width+16:0;}
  function page(){var span=step()*perPage();if(track.scrollLeft>1&&track.scrollLeft>=track.scrollWidth-track.clientWidth-2)return Math.max(0,Math.ceil(jobs.length/perPage())-1);return span?Math.round(track.scrollLeft/span):0;}
  function move(p){track.scrollTo({left:p*perPage()*step(),behavior:motion()});}
  function update(){var pages=Math.ceil(jobs.length/perPage()),at=page();if(dots.childElementCount!==pages){dots.replaceChildren();for(var i=0;i<pages;i++){var dot=document.createElement('button');dot.type='button';dot.className='em-rec-dot';dot.setAttribute('aria-label','Ir para página '+(i+1));dot.dataset.page=String(i);dot.onclick=function(){move(Number(this.dataset.page));};dots.appendChild(dot);}}dots.hidden=pages<=1;Array.from(dots.children).forEach(function(d,i){d.setAttribute('aria-current',String(i===at));});prev.disabled=track.scrollLeft<2;next.disabled=track.scrollLeft>=track.scrollWidth-track.clientWidth-2;prev.hidden=next.hidden=jobs.length<=perPage();}
  prev.onclick=function(){move(Math.max(0,page()-1));};next.onclick=function(){move(page()+1);};track.onkeydown=function(e){if(e.target!==track)return;if(e.key==='ArrowRight'){e.preventDefault();next.click();}if(e.key==='ArrowLeft'){e.preventDefault();prev.click();}};
  track.addEventListener('scroll',update,{passive:true});var observer=typeof ResizeObserver==='function'?new ResizeObserver(update):null;if(observer)observer.observe(track);window.addEventListener('resize',update);cleanup=function(){if(observer)observer.disconnect();window.removeEventListener('resize',update);};
  if(!jobs.length){track.innerHTML='<p class="em-rec-empty">Ainda não encontramos outras vagas disponíveis.</p>';prev.hidden=next.hidden=true;dots.hidden=true;}else requestAnimationFrame(update);
 };
 function init(){var ref=window.vagaAtual;try{if(!ref&&typeof window.localizarVaga==='function')ref=window.localizarVaga(new URLSearchParams(location.search).get('id'));}catch(e){}if(ref&&new URLSearchParams(location.search).get('pagina')==='vaga')window.renderizarRecomendacoesVaga(ref);}
 window.moverRecomendacoes=function(direction){var selector=direction<0?'.em-rec-prev':'.em-rec-next',b=document.querySelector('#emRecommendedCarousel '+selector);if(b)b.click();};
 window.addEventListener('storage',paintBookmarks);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

(function(){
 'use strict';
 function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
 function esc(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 function read(k,f){try{return JSON.parse(localStorage.getItem(k)||'null')||f;}catch(e){return f;}}
 function words(v){return norm(Array.isArray(v)?v.join(' '):v).split(/[^a-z0-9]+/).filter(function(w){return w.length>2&&!/^(para|com|dos|das|uma|por|que|de|em|na|no)$/.test(w);});}
 function overlap(a,b){var x=words(a),y=new Set(words(b));return x.length?x.filter(function(w){return y.has(w);}).length/x.length:0;}
 function context(){
  var logged=typeof window.candidatoEstaLogado==='function'&&window.candidatoEstaLogado();
  if(logged){
   var c=typeof window.obterCandidatoAtual==='function'?window.obterCandidatoAtual()||{}:{},email=norm(sessionStorage.getItem('candidatoEmail')),cv=read('empregaMaisCurriculoOnline:'+email,{});
   return {logged:true,refs:[{area:c.areaProfissional||cv.area,cargo:c.cargoDesejado||cv.objetivo,cidade:c.cidadeProfissional||c.cidade||cv.cidade,modalidade:c.modalidadePreferida||cv.modalidade,skills:c.habilidadesProfissionais||cv.habilidades||cv.competencias,experiencia:c.experienciaProfissional||(cv.experiencias||[]).map(function(x){return x.cargo||'';}).join(' ')}]};
  }
  var history=read('emViewedJobsV1',[]),jobs=typeof window.todasAsVagasPublicas==='function'?window.todasAsVagasPublicas():[];
  return {logged:false,refs:(Array.isArray(history)?history:[]).slice(0,5).map(function(h){return jobs.find(function(v){return String(v.id)===String(h.id);});}).filter(Boolean)};
 }
 function rank(v,ctx){
  var best={score:0,reasons:[]};ctx.refs.forEach(function(p){
   var score=0,reasons=[],role=overlap(p.cargo,v.cargo||v.titulo);
   if(role>=.5){score+=50*role;reasons.push(ctx.logged?'Cargo do seu interesse':'Cargo semelhante ao que você viu');}
   if(norm(p.area)&&norm(p.area)===norm(v.area)){score+=35;reasons.push(ctx.logged?'Na sua área de interesse':'Área de uma vaga que você viu');}
   var skill=overlap(p.skills,v.competencias||v.habilidades||v.requisitos);if(skill>0){score+=Math.min(25,25*skill);reasons.push('Competências em comum');}
   if(overlap(p.experiencia,v.cargo||v.titulo)>=.5){score+=20;reasons.push('Cargo presente na sua experiência');}
   if(norm(p.cidade)&&norm(p.cidade)===norm(v.cidade)){score+=12;reasons.push(ctx.logged?'Na sua cidade':'Na cidade de uma vaga que você viu');}
   if(ctx.logged&&norm(p.modalidade)&&norm(p.modalidade)===norm(v.modalidade)){score+=8;reasons.push('Sua modalidade preferida');}
   if(score>best.score)best={score:score,reasons:reasons};
  });
  var near=window.emProximidade,d=near&&near.distancias&&near.distancias[String(v.id)];
  if(ctx.logged&&near&&near.ativa&&Number.isFinite(d)&&d<=near.raio){best.score+=15;best.reasons.unshift('A '+d.toFixed(1).replace('.',',')+' km de você');}
  return best;
 }
 window.emRankPersonalJob=rank;
 var hashes={};
 function mount(id,parent,before){var el=document.getElementById(id);if(!el&&parent){el=document.createElement('section');el.id=id;el.className='em-personal-recs';parent.insertBefore(el,before||null);}return el;}
 function render(){
  var ctx=context(),home=document.getElementById('vagas'),dashboard=document.querySelector('#pagina-painel-candidato .container-dashboard');
  var sections=[mount('emPersonalHome',home&&home.parentNode,home),mount('emPersonalDashboard',dashboard,dashboard&&dashboard.querySelector('.painel-candidato-grid'))];
  var seen=new Set(),jobs=(typeof window.todasAsVagasPublicas==='function'?window.todasAsVagasPublicas():[]).filter(function(v){if(v.id==null||seen.has(String(v.id)))return false;seen.add(String(v.id));return true;}).map(function(v){return {v:v,match:rank(v,ctx)};}).filter(function(x){return x.match.score>0;}).sort(function(a,b){return b.match.score-a.match.score||String(b.v.dataPublicacao||'').localeCompare(String(a.v.dataPublicacao||''));}).slice(0,4);
  sections.forEach(function(section,index){
   if(!section)return;
   var hidden=index===1?!ctx.logged:!ctx.logged&&!ctx.refs.length;section.hidden=hidden;if(hidden)return;
   var title=ctx.logged?'Vagas recomendadas para você':'Relacionadas às vagas que você viu';
   var subtitle=ctx.logged?'Sugestões com base nas informações do seu perfil.':'Sugestões com base nas suas visitas recentes neste navegador.';
   var html='<div class="em-personal-head"><div><h2>'+title+'</h2><p>'+subtitle+'</p></div>'+(ctx.logged?'<a href="?pagina=perfil">Ajustar meu perfil →</a>':'')+'</div>';
   if(!jobs.length)html+='<p class="em-personal-empty">'+(ctx.logged?'Ainda não encontramos vagas compatíveis. Complete seu perfil e confira as oportunidades disponíveis.':'Ainda não encontramos outras vagas relacionadas às suas visitas.')+'</p>';
   else html+='<div class="em-personal-grid">'+jobs.map(function(x){
    var v=x.v,conf=typeof window.vagaEhConfidencialEM==='function'?window.vagaEhConfidencialEM(v):v.confidencial===true;
    return '<article><h3>'+esc(v.cargo||v.titulo||'Vaga')+'</h3><p>'+esc(conf?'Empresa confidencial':v.empresa||'Empresa')+'</p><small>'+esc(v.cidade||'Local não informado')+' · '+esc(v.modalidade||'Modalidade não informada')+'</small><div class="em-personal-reasons">'+x.match.reasons.slice(0,2).map(function(r){return '<span>'+esc(r)+'</span>';}).join('')+'</div><a href="?pagina=vaga&amp;id='+encodeURIComponent(v.id)+'">Ver vaga →</a></article>';
   }).join('')+'</div>';
   if(hashes[section.id]!==html){section.innerHTML=html;hashes[section.id]=html;}
  });
 }
 var queued=false;function schedule(){if(queued)return;queued=true;setTimeout(function(){queued=false;render();},100);}
 function start(){
  var style=document.createElement('style');style.textContent=`
.em-personal-recs{box-sizing:border-box;background:#fff;border:1px solid #e1e7ef;border-radius:12px;padding:20px;margin:18px 0;color:#183553;font-family:Montserrat,Arial,sans-serif}
#emPersonalHome{max-width:1180px;width:calc(100% - 32px);margin:20px auto}
.em-personal-recs[hidden]{display:none!important}
.em-personal-head{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:16px}
.em-personal-head h2{font-size:22px;line-height:1.3;margin:0 0 5px;color:#183553}
.em-personal-head p,.em-personal-empty{font-size:12px;line-height:1.6;color:#728296;margin:0}
.em-personal-head>a{font-size:12px;white-space:nowrap;color:#7540ae;text-decoration:none}
.em-personal-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.em-personal-grid article{display:flex;flex-direction:column;min-width:0;padding:16px;border:1px solid #e2e9f1;border-radius:9px;background:#fff}
.em-personal-grid h3{font-size:14px;line-height:1.4;margin:0 0 7px;color:#173b60;overflow-wrap:anywhere}
.em-personal-grid p{font-size:11px;line-height:1.5;margin:0 0 8px;color:#5f7287}
.em-personal-grid small{font-size:10px;line-height:1.5;color:#7b8b9d}
.em-personal-reasons{display:flex;flex-wrap:wrap;gap:5px;margin:12px 0}
.em-personal-reasons span{font-size:10px;line-height:1.5;padding:4px 7px;border-radius:5px;color:#673498;background:#f4eefb}
.em-personal-grid article>a{margin-top:auto;align-self:flex-start;font-size:12px;font-weight:600;text-decoration:none;color:#1768b4;padding:6px 0}
.em-personal-recs a:focus-visible{outline:2px solid #7540ae;outline-offset:3px}
@media(max-width:1000px){.em-personal-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){.em-personal-recs{padding:16px}.em-personal-head{align-items:flex-start;flex-direction:column;gap:8px}.em-personal-head h2{font-size:19px}.em-personal-grid{grid-template-columns:1fr}}
`;document.head.appendChild(style);
  ['pagina-home','pagina-painel-candidato'].forEach(function(id){var p=document.getElementById(id);if(p)new MutationObserver(schedule).observe(p,{attributes:true,attributeFilter:['class']});});
  ['listaVagas','emRecentHeaderHistory'].forEach(function(id){var el=document.getElementById(id);if(el)new MutationObserver(schedule).observe(el,{childList:true,subtree:true});});
  window.addEventListener('storage',schedule);window.addEventListener('popstate',schedule);window.addEventListener('load',schedule);document.addEventListener('submit',function(){setTimeout(schedule,700);},true);
  render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

(function(){
 var pending=false;
 function paint(){
  document.querySelectorAll('.favorito,.em-lista-fav,#btnSalvarDetalhe').forEach(function(button){
   var text=button.textContent||'',filled=text.indexOf('♥')>=0||text.indexOf('❤')>=0;
   if(!/[♥♡❤]/.test(text))return;
   var label=text.replace(/[♥♡❤]/g,'').trim(),svg='<svg class="em-save-marker" viewBox="0 0 24 24" width="19" height="19" fill="'+(filled?'currentColor':'none')+'" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17l-6-4Z"/></svg>';
   button.innerHTML=svg+(label?' <span>'+label+'</span>':'');
   button.setAttribute('aria-label',filled?'Remover vaga salva':'Salvar vaga');button.setAttribute('aria-pressed',String(filled));button.title=filled?'Vaga salva — clique para remover':'Salvar vaga';
  });
 }
 function schedule(){if(pending)return;pending=true;requestAnimationFrame(function(){pending=false;paint();});}
 function start(){var style=document.createElement('style');style.textContent='.em-save-marker{vertical-align:middle;flex-shrink:0;pointer-events:none}.favorito .em-save-marker,.em-lista-fav .em-save-marker{width:19px!important;height:19px!important}';document.head.appendChild(style);paint();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true,characterData:true});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
