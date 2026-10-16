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
 function lowBadge(v){var core=window.EmpregaMaisPreparacao;return core&&typeof core.seloBaixaConcorrencia==='function'?core.seloBaixaConcorrencia(v):'';}
 function card(v,ref){
  var el=document.createElement('article');el.className='em-rec-card';var title=v.cargo||v.titulo||'Vaga',city=v.cidade||'Local não informado',uf=v.uf||v.estado||'';if(uf&&norm(city).indexOf(norm(uf))<0)city+=' • '+uf;
  el.innerHTML='<h3 class="em-rec-title" title="'+esc(title)+'">'+esc(String(title).toUpperCase())+'</h3><p class="em-rec-company">'+esc(String(['true','1','sim','confidencial'].includes(norm(v.confidencial))?'Empresa confidencial':v.empresa||'Empresa').toUpperCase())+'</p><button type="button" class="em-rec-bookmark" aria-label="Salvar vaga: '+esc(title)+'" aria-pressed="'+saved(v.id)+'">'+icon('bookmark')+'</button><div class="em-rec-location">'+icon('pin')+'<span title="'+esc(city)+'">'+esc(city)+'</span></div><div class="em-rec-meta"><span>'+icon('building')+esc(v.modalidade||'Não informada')+'</span><span>'+icon('case')+esc(norm(v.contrato).includes('clt')?'CLT':v.contrato||'Não informado')+'</span></div><span class="em-rec-reason">'+esc(reason(ref,v))+'</span><div class="em-rec-bottom"><strong class="em-rec-salary">'+esc(salary(v))+'</strong><small class="em-rec-date">'+esc(published(v))+'</small><a class="em-rec-open" href="?pagina=vaga&amp;id='+encodeURIComponent(v.id)+'">Ver vaga '+icon('right')+'</a></div>';
  var low=lowBadge(v);if(low)el.querySelector('.em-rec-bottom').insertAdjacentHTML('beforebegin',low);
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
  var premium=false;try{var access=window.EmpregaMaisPremiumCandidatoV92;premium=!!(access&&typeof access.ehPremium==='function'&&access.ehPremium());}catch(ignore){}
  var latest=ctx.logged&&!premium;
  function publicationTime(v){var raw=v.dataPublicacao||v.criado_em||v.criadoEm||v.publicadaEm||v.dataCriacao||'',m=String(raw).match(/^(\d{2})\/(\d{2})\/(\d{4})$/),d=m?new Date(+m[3],+m[2]-1,+m[1]):new Date(raw);return isNaN(d.getTime())?0:d.getTime();}
  var previousHome=document.getElementById('emPersonalHome');if(previousHome)previousHome.remove();
  var sections=[null,mount('emPersonalDashboard',dashboard,dashboard&&dashboard.querySelector('.painel-candidato-grid'))];
  var seen=new Set(),jobs=(typeof window.todasAsVagasPublicas==='function'?window.todasAsVagasPublicas():[]).filter(function(v){if(v.id==null||seen.has(String(v.id)))return false;seen.add(String(v.id));return true;}).map(function(v){return {v:v,match:latest?{score:0,reasons:[]}:rank(v,ctx)};}).filter(function(x){return latest||x.match.score>0||new URLSearchParams(location.search).get('pagina')==='demo-candidato';}).sort(function(a,b){return (latest?0:b.match.score-a.match.score)||publicationTime(b.v)-publicationTime(a.v);}).slice(0,4);
  sections.forEach(function(section,index){
   if(!section)return;
   var hidden=index===1?!ctx.logged:!ctx.logged&&!ctx.refs.length;section.hidden=hidden;if(hidden)return;
   var title=latest?'Últimas vagas anunciadas':ctx.logged?'Vagas recomendadas para você':'Relacionadas às vagas que você viu';
   var subtitle=latest?'Confira as oportunidades mais recentes do site.':ctx.logged?'Sugestões com base nas informações do seu perfil.':'Sugestões com base nas suas visitas recentes neste navegador.';
   var html='<div class="em-personal-head"><div><h2>'+title+'</h2><p>'+subtitle+'</p></div>'+(ctx.logged?'<button type="button" class="cp-recommendations-link" data-cp-action="'+(latest?'search':'recommendations')+'">'+(latest?'Ver todas as vagas':'Ver recomendações')+' →</button>':'')+'</div>';
   if(!jobs.length)html+='<p class="em-personal-empty">'+(latest?'Nenhuma vaga disponível no momento.':ctx.logged?'Ainda não encontramos vagas compatíveis. Complete seu perfil e confira as oportunidades disponíveis.':'Ainda não encontramos outras vagas relacionadas às suas visitas.')+'</p>';
   else html+='<div class="em-personal-grid">'+jobs.slice(0,2).map(function(x){
    var v=x.v,conf=typeof window.vagaEhConfidencialEM==='function'?window.vagaEhConfidencialEM(v):v.confidencial===true;
    return '<article data-cp-job-id="'+esc(v.id)+'"><span class="cp-job-symbol"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 21V3h12v18M17 10h3v11M3 21h19M8 7h2M12 7h2M8 11h2M12 11h2M8 15h2M12 15h2"/></svg></span><h3>'+esc(v.cargo||v.titulo||'Vaga')+'</h3><p>'+esc(conf?'Empresa confidencial':v.empresa||'Empresa')+'</p><small>'+esc(v.cidade||'Local não informado')+(v.uf?' – '+esc(v.uf):'')+'</small><strong class="cp-recommended-salary">'+esc(v.salario||'Salário a combinar')+'</strong>'+(window.EmpregaMaisPreparacao?window.EmpregaMaisPreparacao.seloBaixaConcorrencia(v):'')+'<div class="em-personal-reasons">'+[v.contrato||'Contrato não informado',v.modalidade||'Modalidade não informada'].map(function(r){return '<span>'+esc(r)+'</span>';}).join('')+'</div><div class="cp-fit-and-alert"></div><button type="button" class="cp-job-apply" data-cp-overview-apply="'+esc(v.id)+'">Quero me candidatar</button></article>';
   }).join('')+'</div>';
   if(hashes[section.id]!==html){section.innerHTML=html;hashes[section.id]=html;}
  });
 }
 var queued=false;function schedule(){if(queued)return;queued=true;setTimeout(function(){queued=false;render();},100);}
 function start(){
  var style=document.createElement('style');style.textContent=`
.em-personal-recs{box-sizing:border-box;background:#fff;border:1px solid #e1e7ef;border-radius:12px;padding:20px;margin:18px 0;color:#0080c9;font-family:Inter,Arial,sans-serif}
#emPersonalHome{max-width:1180px;width:calc(100% - 32px);margin:20px auto}
.em-personal-recs[hidden]{display:none!important}
.em-personal-head{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-bottom:16px}
.em-personal-head h2{font-size:22px;line-height:1.3;margin:0 0 5px;color:#0080c9}
.em-personal-head p,.em-personal-empty{font-size:12px;line-height:1.6;color:#728296;margin:0}
.em-personal-head>a{font-size:12px;white-space:nowrap;color:#0080c9;text-decoration:none}
.em-personal-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.em-personal-grid article{display:flex;flex-direction:column;min-width:0;padding:16px;border:1px solid #e2e9f1;border-radius:9px;background:#fff}
.em-personal-grid h3{font-size:14px;line-height:1.4;margin:0 0 7px;color:#0080c9;overflow-wrap:anywhere}
.em-personal-grid p{font-size:11px;line-height:1.5;margin:0 0 8px;color:#5f7287}
.em-personal-grid small{font-size:10px;line-height:1.5;color:#7b8b9d}
.em-personal-reasons{display:flex;flex-wrap:wrap;gap:5px;margin:12px 0}
.em-personal-reasons span{font-size:10px;line-height:1.5;padding:4px 7px;border-radius:5px;color:#0080c9;background:#eef2fb}
.em-personal-grid article>a{margin-top:auto;align-self:flex-start;font-size:12px;font-weight:600;text-decoration:none;color:#0080c9;padding:6px 0}
.em-personal-recs a:focus-visible{outline:2px solid #0080c9;outline-offset:3px}
@media(max-width:1000px){.em-personal-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:560px){.em-personal-recs{padding:16px}.em-personal-head{align-items:flex-start;flex-direction:column;gap:8px}.em-personal-head h2{font-size:19px}.em-personal-grid{grid-template-columns:1fr}}
`;document.head.appendChild(style);
  ['pagina-home','pagina-painel-candidato'].forEach(function(id){var p=document.getElementById(id);if(p)new MutationObserver(schedule).observe(p,{attributes:true,attributeFilter:['class']});});
  ['listaVagas','emRecentHeaderHistory'].forEach(function(id){var el=document.getElementById(id);if(el)new MutationObserver(schedule).observe(el,{childList:true,subtree:true});});
  document.addEventListener('click',function(event){
   var button=event.target.closest('#emPersonalDashboard [data-cp-overview-apply]');if(!button)return;
   event.preventDefault();
   var id=button.dataset.cpOverviewApply;
   var available=typeof window.todasAsVagasPublicas==='function'?window.todasAsVagasPublicas():[];
   var job=available.find(function(item){return String(item.id)===String(id);});
   if(!job){alert('Esta vaga não está mais disponível. Atualize as oportunidades.');return;}
   window.vagaAtual=job;
   if(window.EmpregaMaisCandidaturaV94&&typeof window.EmpregaMaisCandidaturaV94.abrir==='function')window.EmpregaMaisCandidaturaV94.abrir(job);
   else if(typeof window.abrirCandidaturaProtegida==='function')window.abrirCandidaturaProtegida(job.id);
   else if(typeof window.irPara==='function')window.irPara('candidatura',job.id);
  });
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

/* Painel do candidato: navegação horizontal e resumo pessoal. */
(function(){
 'use strict';
 var page,container,signature='',candidateHeader,messageTab=false;
 function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 function svg(name){var paths={bell:'<path d="M5 10a7 7 0 0 1 14 0v5l2 3H3l2-3Z M9 21h6"/>',document:'<path d="M6 3h9l4 4v14H6Z M14 3v5h5M9 12h7M9 16h7"/>',bookmark:'<path d="M6 21V4h12v17l-6-4Z"/>',crown:'<path d="m3 6 4 5 5-8 5 8 4-5-2 14H5Z"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18"/>',home:'<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7"/>',case:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',user:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="9" r="3"/><path d="M6 19c0-6 12-6 12 0"/>',chat:'<path d="M21 11a8 8 0 0 1-8 8H6l-4 3V11a9 9 0 0 1 19 0Z"/><path d="M7 10h10M7 14h7"/>',heart:'<path d="M20 4c-3-3-6-1-8 1-2-2-5-4-8-1-5 5 2 11 8 16 6-5 13-11 8-16Z"/>',star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>'};return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[name]+'</svg>'}
 function go(route){if(route!=='painel-candidato')messageTab=false;if(typeof window.irPara==='function')window.irPara(route)}
 function profile(){try{return typeof window.obterCandidatoAtual==='function'?window.obterCandidatoAtual()||{}:{}}catch(e){return {}}}
 var activityOwner='',activityAt=0,activityBusy=false;
 function refreshHomeActivity(){
  var host=container&&container.querySelector('.cp-home-activity');if(!host)return;
  var demo=new URLSearchParams(location.search).get('pagina')==='demo-candidato',uid=sessionStorage.getItem('candidatoUserId')||sessionStorage.getItem('candidatoEmail')||'',api=window.EMInterviews;
  if(activityBusy||activityOwner===uid&&Date.now()-activityAt<60000)return;
  if(!demo&&(!api||!sessionStorage.getItem('empregaMaisSupabaseAccessToken'))){host.querySelector('.cp-next-interview p').textContent='Consulte seus agendamentos na aba Candidaturas.';host.querySelector('.cp-recent-message p').textContent='Consulte os contatos na aba Mensagens.';return;}
  activityOwner=uid;activityAt=Date.now();activityBusy=true;
  function paint(interviews,messages){if(uid!==(sessionStorage.getItem('candidatoUserId')||sessionStorage.getItem('candidatoEmail')||''))return;
   var next=interviews.filter(function(x){return ['invited','confirmed','reschedule_requested'].indexOf(x.state)>=0&&Date.parse(x.scheduled_at)+(Number(x.duration_minutes)||30)*60000+3600000>=Date.now();}).sort(function(a,b){return Date.parse(a.scheduled_at)-Date.parse(b.scheduled_at);})[0];
   var interview=host.querySelector('.cp-next-interview'),message=host.querySelector('.cp-recent-message');
   interview.emInterview=next||null;
   var interviewDate=next?new Date(next.scheduled_at):null;
   interview.innerHTML='<header class="cp-interview-head"><h3>'+svg('calendar')+' Próxima entrevista</h3>'+(next?'<span class="cp-interview-mode">'+esc(String(next.instructions||'').startsWith('[Presencial]')?'Presencial':'Online')+'</span>':'')+'</header>'+(next?'<div class="cp-interview-summary"><div class="cp-interview-date"><strong>'+esc(interviewDate.toLocaleDateString('pt-BR',{day:'2-digit'}))+'</strong><span>'+esc(interviewDate.toLocaleDateString('pt-BR',{month:'short'}).replace('.','').toUpperCase())+'</span></div><div class="cp-interview-copy"><strong class="cp-interview-time">'+esc(interviewDate.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}))+'</strong><p>'+esc(next.job_title)+'</p></div></div><div class="cp-interview-footer"><button type="button" class="cp-interview-booking">Ver agendamento</button></div>':'<p>Você ainda não tem entrevistas futuras agendadas.</p>');
   if(next)interview.querySelector('button').onclick=function(){go('candidaturas');};
   var m=messages[0];message.innerHTML='<h3>'+svg('chat')+' Mensagem recente</h3>'+(m?'<strong>'+esc(m.company_name)+'</strong><p>'+esc(String(m.body).slice(0,130))+(String(m.body).length>130?'…':'')+'</p><button type="button">Ler mensagem →</button>':'<p>As mensagens das empresas aparecerão aqui.</p>');if(m)message.querySelector('button').onclick=function(){candidateHeader.querySelector('[data-route="messages"]').click();};
   var count=container.querySelector('[data-home-message-count]');if(count)count.textContent=String(messages.length);var badge=candidateHeader.querySelector('.cp-message-count');if(badge){badge.textContent=String(messages.length);badge.hidden=!messages.length;}
   document.dispatchEvent(new Event('empregamais:atividade-candidato'));
  }
  if(demo){paint([{state:'invited',scheduled_at:new Date(new Date().getFullYear(),new Date().getMonth(),18,14,30).toISOString(),job_title:'Assistente Administrativo',instructions:'[Online externo] Demonstração'}],[{company_name:'Empresa Demonstração',body:'Confira as orientações para sua entrevista.'}]);activityBusy=false;return;}
  Promise.all([api.api('em_interviews?select=id,state,scheduled_at,duration_minutes,job_title,instructions&order=scheduled_at.asc&limit=100'),api.api('em_candidate_messages?select=company_name,body,sent_at&state=eq.sent&order=sent_at.desc&limit=100')]).then(function(rows){paint(rows[0],rows[1]);}).catch(function(){host.querySelector('.cp-next-interview').emInterview=null;host.querySelector('.cp-next-interview').innerHTML='<h3>Próxima entrevista</h3><p>Não foi possível atualizar. Consulte Candidaturas.</p>';host.querySelector('.cp-recent-message').innerHTML='<h3>Mensagem recente</h3><p>Não foi possível atualizar. Consulte Mensagens.</p>';}).finally(function(){activityBusy=false;});
 }
 function update(){
  if(!container||!page.classList.contains('ativa'))return;
  if(window.EmpregaMaisCandidaturasCandidato)window.EmpregaMaisCandidaturasCandidato.atualizarResumo(container.querySelector('.cp-metrics-slot'));
  var summary=container.querySelector('.cp-home-summary');if(summary){var applications=[];try{applications=(window.carregarCandidaturas()||[]).filter(function(a){return window.EmpregaMaisCandidaturasCandidato&&window.EmpregaMaisCandidaturasCandidato.pertence(a);});}catch(ignore){}var interviews=applications.filter(function(a){return window.EmpregaMaisCandidaturasCandidato.classificar(a)==='entrevista';}).length,favorites=[];try{favorites=window.carregarFavoritos?window.carregarFavoritos()||[]:[];}catch(ignore){}[applications.length,interviews,favorites.length].forEach(function(n,i){summary.querySelectorAll('strong')[i].textContent=String(n);});}
  refreshHomeActivity();
  var c=profile(),name=c.nome||sessionStorage.getItem('candidatoNome')||'Candidato',email=sessionStorage.getItem('candidatoEmail')||'',saved=false;try{saved=typeof window.curriculoCadastrado==='function'&&window.curriculoCadastrado()}catch(e){}
  var fields=[name,c.cargoDesejado||c.areaProfissional||'Seu próximo passo profissional',c.cidadeProfissional||c.cidade||'',c.uf||c.estado||'',c.telefone||'',c.escolaridadeProfissional||'',c.experienciaProfissional||'',c.habilidadesProfissionais||'',email,saved,c.modalidadePreferida,c.disponibilidadeInicio,c.disponibilidade],next=JSON.stringify(fields);if(next===signature)return;signature=next;
  var score=Math.round([name!=='Candidato',!!email,!!c.telefone,!!(c.cidadeProfissional||c.cidade),!!(c.cargoDesejado||c.areaProfissional),!!c.escolaridadeProfissional,!!c.experienciaProfissional,!!c.habilidadesProfissionais,!!saved].filter(Boolean).length/9*100);
  container.querySelector('.cp-name').textContent=name;container.querySelector('.cp-role').textContent=fields[1];container.querySelector('.cp-location').textContent=[fields[2],fields[3]].filter(Boolean).join(' – ');container.querySelector('.cp-avatar').textContent=name.split(/\s+/).filter(Boolean).slice(0,2).map(function(n){return n[0]}).join('').toUpperCase();container.querySelector('.cp-avatar').style.setProperty('--completion',score+'%');container.querySelector('.cp-completion').textContent=score+'% completo';candidateHeader.querySelector('.cp-greeting-name').textContent='Minha conta';candidateHeader.querySelector('.cp-user-avatar').textContent=container.querySelector('.cp-avatar').textContent;container.querySelector('.cp-avatar-box>small').textContent=score===100?'Perfil completo':'Complete seu perfil';
  var skills=container.querySelector('.cp-profile-skills');if(skills){skills.replaceChildren();[c.areaProfissional].concat(String(c.habilidadesProfissionais||'').split(',').slice(0,2)).filter(Boolean).forEach(function(x){var chip=document.createElement('span');chip.textContent=String(x).trim();skills.appendChild(chip);});}
  var objective=container.querySelector('.cp-profile-objective');if(objective){var modalities=Array.isArray(c.modalidadePreferida)?c.modalidadePreferida.join(' • '):c.modalidadePreferida||'Modalidade não informada';objective.querySelector('p').textContent=(c.areaProfissional||c.cargoDesejado||'Defina sua área de interesse')+' • '+modalities;objective.querySelector('small').textContent='Disponibilidade: '+(c.disponibilidadeInicio||c.disponibilidade||'não informada');}
  var city=container.querySelector('#cpSearchCity');if(!city.value)city.value=fields[2];
 }
 function navigationArt(index){
  return svg(['home','document','search','user','chat','bookmark','crown'][index]).replace('<svg ','<svg class="cp-nav-icon" ');
 }
 function sidebarCardIcon(type){
 var shapes={
 home:'<path d="m5 21 15-13 15 13" fill="#d8edf6"/><path d="M8 19v16h24V19L20 9Z" fill="#e1f1f8" stroke="currentColor"/><path d="M17 35V24h7v11" fill="#75b5ce" stroke="currentColor"/>',
 document:'<path d="M9 5h16l7 7v23H9Z" fill="#dceff7" stroke="currentColor"/><path d="M25 5v8h7M14 18h11M14 23h8M14 28h8" stroke="currentColor"/><circle cx="30" cy="29" r="8" fill="#fff" stroke="currentColor"/><circle cx="30" cy="27" r="2" fill="currentColor" stroke="none"/><path d="M26 33a4 4 0 0 1 8 0" stroke="currentColor"/>',
 search:'<circle cx="17" cy="17" r="11" fill="#d9edf6" stroke="currentColor"/><path d="m25 25 10 10" stroke="currentColor" stroke-width="3.5"/>',
 chat:'<rect x="5" y="10" width="29" height="23" rx="3" fill="#dceef6" stroke="currentColor"/><path d="m6 12 13.5 11L33 12" stroke="currentColor"/><circle cx="33" cy="10" r="6.5" fill="#0080c9" stroke="#fff"/>',
 bookmark:'<path d="M11 5h19v30l-9.5-7L11 35Z" fill="#deeff7" stroke="currentColor"/>',
 user:'<circle cx="18" cy="12" r="7" fill="#b4d8e9" stroke="currentColor"/><path d="M5 33v-3a13 13 0 0 1 26 0v3Z" fill="#97c7dd" stroke="currentColor"/><circle cx="31" cy="30" r="8" fill="#0080c9" stroke="#fff"/><path d="m27 33 1-4 5-5 3 3-5 5Z" fill="#fff" stroke="none"/>',
 resume:'<path d="M10 5h15l7 7v23H10Z" fill="#d8edf6" stroke="currentColor"/><path d="M25 5v8h7M15 18h6M15 23h12M15 28h12" stroke="currentColor"/>',
 crown:'<path d="m5 12 8 6 7-12 7 12 8-6-4 20H9Z" fill="#add5e6" stroke="currentColor"/><path d="M10 36h20M10 27h20" stroke="currentColor"/>'
 };return '<span class="cp-card-icon"><svg class="cp-nav-icon" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">'+(shapes[type]||shapes.resume)+'</svg></span>';
 }
 function setup(){
  page=document.getElementById('pagina-painel-candidato');if(!page)return;container=page.querySelector('.container-dashboard');if(!container)return;
  if(container.querySelector('.cp-layout')){var existingInbox=container.querySelector('.em-candidate-inbox');if(existingInbox&&existingInbox!==container.lastElementChild)container.appendChild(existingInbox);update();return}
  page.classList.add('cp-reference');
  if(new URLSearchParams(location.search).get('pagina')==='demo-candidato')page.dataset.cpDemo='true';
  var nav=document.createElement('nav');nav.className='cp-navigation';nav.setAttribute('aria-label','Área do candidato');
  var routes=[['home','Minha área','painel-candidato','Gestão'],['document','Candidaturas','candidaturas'],['search','Recomendações','recommendations'],['chat','Mensagens','messages'],['bookmark','Vagas salvas','salvas'],['user','Editar perfil','perfil','Perfil do candidato'],['document','Currículo','curriculo'],['crown','Premium','premium-candidato']];
  nav.innerHTML=routes.map(function(r,i){return (r[3]?'<div class="cp-nav-label cp-nav-section-label">'+r[3]+'</div>':'')+'<button type="button" data-route="'+r[2]+'" '+(i===0?'aria-current="page"':'')+'>'+sidebarCardIcon(r[2]==='curriculo'?'resume':r[0])+'<span>'+r[1]+'</span>'+(r[2]==='messages'?'<small class="cp-message-count" hidden></small>':'')+'</button>';}).join('');
  var toolbar=document.createElement('div');toolbar.className='cp-toolbar';toolbar.innerHTML='<strong>+Empregos</strong><span class="cp-toolbar-context">Portal do candidato</span><button type="button" class="cp-notifications" data-route="messages" aria-label="Abrir mensagens">'+svg('bell')+'<span class="cp-notification-dot" hidden></span></button><button type="button" class="cp-greeting" data-route="perfil" aria-label="Abrir minha conta"><span class="cp-user-avatar" aria-hidden="true"></span><span class="cp-greeting-name">Minha conta</span><svg class="cp-account-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 9 7 7 7-7"/></svg></button>';
  var header=document.createElement('div');header.id='cpCandidateHeader';header.className='cp-header';header.append(toolbar,nav);page.prepend(header);
  candidateHeader=header;var initialName=profile().nome||sessionStorage.getItem('candidatoNome')||'Candidato';header.querySelector('.cp-user-avatar').textContent=initialName.split(/\s+/).filter(Boolean).slice(0,2).map(function(n){return n[0];}).join('').toUpperCase();
  // Keep one persistent shell while the existing SPA renders each section.
  document.body.insertBefore(header,document.body.firstChild);
  header.addEventListener('click',function(event){
   var button=event.target.closest('[data-route]');if(!button)return;
   if(button.dataset.route==='recommendations'){
    messageTab=false;go('painel-candidato');
    if(window.EmpregaMaisPreparacao&&window.EmpregaMaisPreparacao.abrirRecomendacoes)window.EmpregaMaisPreparacao.abrirRecomendacoes();
    syncShell();return;
   }
   messageTab=button.dataset.route==='messages';
   go(messageTab?'painel-candidato':button.dataset.route);syncShell();
  });
  var empty=document.createElement('section');empty.className='cp-message-empty';empty.innerHTML='<h2>Mensagens</h2><p>Nenhuma mensagem recebida nesta demonstração.</p>';container.appendChild(empty);
  function syncShell(){
   var active=document.querySelector('.pagina.ativa'),route=active&&active.id.replace('pagina-','');
   var logged=typeof window.candidatoEstaLogado==='function'&&window.candidatoEstaLogado();
   var enabled=!!logged&&['painel-candidato','candidaturas','home','curriculo','perfil','salvas','premium-candidato','vaga','candidatura'].indexOf(route)>=0;
   header.hidden=!enabled;document.body.classList.toggle('cp-shell-active',enabled);
   document.querySelectorAll('.cp-tab-content').forEach(function(p){if(p!==active)p.classList.remove('cp-tab-content')});
   if(!enabled)return;
   if(!active.classList.contains('cp-tab-content'))active.classList.add('cp-tab-content');
   if(route!=='painel-candidato')messageTab=false;
   page.classList.toggle('cp-messages-active',messageTab);
   var selected=messageTab?'messages':route==='painel-candidato'&&page.classList.contains('cp-recommendations-active')?'recommendations':route;
   nav.querySelectorAll('[data-route]').forEach(function(b){if(b.dataset.route===selected)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  }
  var shellPending=false;
  new MutationObserver(function(records){if(shellPending||!records.some(function(r){return r.oldValue!==r.target.getAttribute('class')}))return;shellPending=true;requestAnimationFrame(function(){shellPending=false;syncShell()})}).observe(document.body,{subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['class']});
  window.addEventListener('popstate',function(){messageTab=false;syncShell()});
  syncShell();
  var banner=container.querySelector('.premium-chamada-painel-v79');if(banner){banner.classList.add('cp-banner');banner.querySelector('strong').textContent='Encontre oportunidades que combinam com você';banner.querySelector('p').textContent='Complete seu perfil e conheça as ferramentas para organizar sua busca por emprego.';var close=document.createElement('button');close.type='button';close.className='cp-banner-close';close.setAttribute('aria-label','Fechar destaque');close.textContent='×';close.onclick=function(){banner.hidden=true};banner.appendChild(close)}
  var search=document.createElement('form');search.className='cp-search';search.innerHTML='<label for="cpSearchRole">O que?<input id="cpSearchRole" placeholder="Digite cargo ou área profissional" type="search"></label><label for="cpSearchCity">Onde?<input id="cpSearchCity" placeholder="Cidade" type="text"></label><button type="submit">Encontrar vagas</button>';
  search.onsubmit=function(event){event.preventDefault();go('home');[['filtroPalavra','cpSearchRole'],['filtroCidade','cpSearchCity']].forEach(function(pair){var target=document.getElementById(pair[0]);if(target)target.value=container.querySelector('#'+pair[1]).value});if(typeof window.filtrarVagas==='function')window.filtrarVagas();var list=document.getElementById('vagas');if(list)list.scrollIntoView({behavior:'smooth'})};
  if(banner)banner.after(search);else container.prepend(search);
  var layout=document.createElement('div');layout.className='cp-layout';layout.innerHTML='<aside class="cp-profile"><div class="cp-profile-identity"><div class="cp-avatar-box"><div class="cp-avatar"></div><span class="cp-completion"></span><small>Perfil preenchido</small></div><div><h1 class="cp-name"></h1><p class="cp-role"></p><small class="cp-location"></small></div></div><div class="cp-profile-links"><button type="button" data-route="curriculo">Atualizar currículo</button><button type="button" data-route="premium-candidato">Conhecer Premium</button></div><div class="cp-metrics-slot"></div></aside><div class="cp-opportunities"><div class="cp-recommendations-slot"></div></div>';
  search.after(layout);layout.querySelector('.cp-profile-identity>div:last-child').insertAdjacentHTML('beforeend','<div class="cp-profile-skills"></div>');
  var intro=document.createElement('div');intro.className='cp-home-intro';intro.innerHTML='<h1>Meu painel</h1><p>Acompanhe suas candidaturas e encontre sua próxima oportunidade.</p>';layout.before(intro);
  var summary=document.createElement('section');summary.className='cp-home-summary';summary.setAttribute('aria-label','Resumo da sua busca');summary.innerHTML='<article>'+svg('document')+'<div><strong>0</strong><span>Candidaturas</span></div></article><article>'+svg('calendar')+'<div><strong>0</strong><span>Entrevistas</span></div></article><article>'+svg('bookmark')+'<div><strong>0</strong><span>Vagas salvas</span></div></article>';layout.querySelector('.cp-profile').after(summary);
  summary.insertAdjacentHTML('beforeend','<article>'+svg('chat')+'<div><strong data-home-message-count>0</strong><span>Mensagens</span></div></article>');
  var objective=document.createElement('section');objective.className='cp-profile-objective';objective.innerHTML='<h3>Objetivo profissional</h3><p></p><small></small>';layout.querySelector('.cp-profile-identity').appendChild(objective);
  var activity=document.createElement('aside');activity.className='cp-home-activity';activity.innerHTML='<section class="cp-next-interview"><h3>Próxima entrevista</h3><p>Consultando sua agenda…</p></section><section class="cp-recent-message"><h3>Mensagem recente</h3><p>Consultando mensagens…</p></section>';layout.querySelector('.cp-opportunities').appendChild(activity);
  var metrics=container.querySelector('.metricas');if(metrics)layout.querySelector('.cp-metrics-slot').appendChild(metrics);
  var rec=document.getElementById('emPersonalDashboard');if(!rec){rec=document.createElement('section');rec.id='emPersonalDashboard';rec.className='em-personal-recs';rec.innerHTML='<div class="em-personal-head"><h2>Vagas recomendadas para você</h2></div><p>Carregando oportunidades…</p>'}layout.querySelector('.cp-recommendations-slot').appendChild(rec);
  var cards=container.querySelector('.painel-candidato-grid');if(cards){cards.classList.add('cp-shortcuts');var guideTitle=document.createElement('div');guideTitle.className='cp-strengthen-heading';guideTitle.innerHTML='<h2>Para fortalecer seu perfil</h2><p>Mantenha suas informações atualizadas e apresente suas qualificações.</p>';cards.before(guideTitle);cards.innerHTML='<article class="painel-card">'+svg('user')+'<div><h3>Revise suas experiências</h3><p>Confira se suas experiências estão completas e atualizadas.</p><button type="button" data-route="curriculo">Atualizar currículo →</button></div></article><article class="painel-card">'+svg('chat')+'<div><h3>Cursos e certificações</h3><p>Inclua os conhecimentos relevantes para sua área.</p><button type="button" data-route="curriculo">Revisar conhecimentos →</button></div></article>';}
  page.addEventListener('click',function(event){var button=event.target.closest('[data-route]');if(!button)return;var route=button.dataset.route;if(route==='messages'){var inbox=page.querySelector('.em-candidate-inbox');if(inbox){inbox.scrollIntoView({behavior:'smooth'});var refresh=inbox.querySelector('button');if(refresh)refresh.click()}}else go(route)});
  new MutationObserver(function(){if(page.classList.contains('ativa'))update()}).observe(page,{attributes:true,attributeFilter:['class']});
  window.addEventListener('storage',update);document.addEventListener('empregamais:candidato-sincronizado',update);document.addEventListener('empregamais:candidaturas-sincronizadas',update);
  if(typeof window.renderizarPainelCandidato==='function'){var original=window.renderizarPainelCandidato;window.renderizarPainelCandidato=function(){var result=original.apply(this,arguments);update();return result}}
  function placeServiceSections(){page.querySelectorAll(':scope > .emi-candidate,:scope > .em-hire-confirmations,:scope > .em-candidate-inbox').forEach(function(section){container.appendChild(section)});}
  placeServiceSections();
  new MutationObserver(placeServiceSections).observe(page,{childList:true});
  var inbox=container.querySelector('.em-candidate-inbox');if(inbox)container.appendChild(inbox);
  update();
 }
 var style=document.createElement('style');style.id='cp-reference-design';style.textContent=`
#pagina-painel-candidato[data-cp-demo=true] .emi-candidate,#pagina-painel-candidato[data-cp-demo=true] .em-hire-confirmations,#pagina-painel-candidato[data-cp-demo=true] .em-candidate-inbox{display:none!important}
#pagina-painel-candidato.cp-reference .emi-candidate,#pagina-painel-candidato.cp-reference .em-hire-confirmations{margin:22px 0!important;border:1px solid #d8dde7!important;border-radius:12px!important;padding:20px!important;box-sizing:border-box!important}
body:has(#pagina-painel-candidato.cp-reference.ativa)>header{display:none!important}
#pagina-painel-candidato.cp-reference{background:#f6f7f9!important;padding:0!important;color:#1b2539;font-family:Inter,Arial,sans-serif}
#pagina-painel-candidato.cp-reference>.page-header,#pagina-painel-candidato.cp-reference .painel-candidato-abas-em{display:none!important}
.cp-header{background:white;border-bottom:1px solid #dde2ec}
.cp-toolbar{background:#0080c9;color:#fff;display:flex;justify-content:space-between;align-items:center;padding:12px max(24px,calc((100% - 1170px)/2));gap:20px}
.cp-toolbar strong{font:800 24px Inter,Arial,sans-serif}.cp-toolbar button{border:0;border-radius:24px;padding:9px 22px;background:#fff;color:#0080c9;font:600 13px Inter,Arial,sans-serif;cursor:pointer}
.cp-navigation{max-width:1170px;margin:18px auto 14px;gap:6px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}
.cp-navigation button{border:0;background:#fff;color:#0080c9;padding:18px 8px 14px;display:flex;flex-direction:column;align-items:center;gap:8px;font:500 13px Inter,Arial,sans-serif;cursor:pointer;position:relative}
.cp-navigation svg{width:29px;height:29px}.cp-navigation button[aria-current=page]{background:#0080c9;color:#fff}.cp-navigation button[aria-current=page]:after{content:'';position:absolute;bottom:-1px;border-left:9px solid transparent;border-right:9px solid transparent;border-bottom:9px solid #fff}.cp-navigation button:hover{background:#eaeffa;color:#0080c9}
#pagina-painel-candidato.cp-reference .container-dashboard{max-width:1170px!important;width:calc(100% - 40px)!important;padding:24px 0!important;margin:auto!important}
#pagina-painel-candidato.cp-reference .cp-banner{position:relative;display:flex!important;flex-direction:column!important;text-align:center!important;align-items:center!important;justify-content:center!important;background:#0080c9!important;color:#fff!important;min-height:140px!important;border:0!important;border-radius:0!important;padding:24px 45px!important;box-sizing:border-box;margin:0 0 24px!important;gap:14px!important}
#pagina-painel-candidato.cp-reference .cp-banner[hidden]{display:none!important}
.cp-banner .premium-chamada-icone-v79,.cp-banner .premium-chamada-texto-v79>span{display:none!important}.cp-banner .premium-chamada-texto-v79 strong{color:#fff!important;font:700 18px/1.5 Inter,Arial,sans-serif!important}.cp-banner .premium-chamada-texto-v79 p{color:#dae4f8!important;font:13px/1.6 Inter,Arial,sans-serif!important;margin-top:5px!important}
#pagina-painel-candidato.cp-reference .cp-banner>button:not(.cp-banner-close){border:0!important;border-radius:24px!important;background:#fff!important;color:#0080c9!important;padding:11px 24px!important;font:700 13px Inter,Arial,sans-serif!important}
#pagina-painel-candidato.cp-reference .cp-banner-close{position:absolute!important;right:14px;top:8px;background:transparent!important;color:#fff!important;border:0!important;font-size:25px!important;padding:0!important;min-width:30px!important}
.cp-search{display:flex;align-items:center;gap:18px;max-width:770px;margin:0 auto 28px;background:white;border:1px solid #d8dde7;border-radius:16px;padding:12px 16px;box-sizing:border-box}.cp-search label{display:grid;gap:4px;flex:1;min-width:0;font:500 12px Inter,Arial,sans-serif;color:#0080c9}.cp-search label+label{border-left:1px solid #d8dde7;padding-left:20px}.cp-search input{width:100%;border:0;background:white;padding:0;outline-offset:4px;font:14px Inter,Arial,sans-serif;color:#1b2539;min-width:0;box-sizing:border-box}.cp-search input::placeholder{font-style:normal;color:#9992a5}.cp-search>button{border:0;border-radius:24px;background:#0080c9;color:#fff;font:700 13px Inter,Arial,sans-serif;padding:12px 19px;cursor:pointer}
.cp-layout{display:grid;grid-template-columns:minmax(300px,.8fr) minmax(0,1.2fr);gap:28px;align-items:start;margin-bottom:24px}.cp-profile{background:#fff;border:1px solid #d8dde7;border-radius:14px;padding:24px;min-width:0}.cp-profile-identity{display:flex;align-items:flex-start;gap:24px}.cp-avatar-box{position:relative;flex:0 0 86px;text-align:center}.cp-avatar{width:86px;height:86px;border-radius:50%;display:grid;place-items:center;font:700 25px Inter,Arial,sans-serif;background:linear-gradient(#f0f4fb,#f0f4fb) padding-box,conic-gradient(#0080c9 var(--completion),#dfe4ee 0) border-box;border:5px solid transparent;color:#0080c9;box-sizing:border-box}.cp-completion{display:table;background:#0080c9;border-radius:20px;padding:3px 9px;color:white;font:600 11px Inter,Arial,sans-serif;margin:-12px auto 0;position:relative}.cp-avatar-box>small{font:10px Inter,Arial,sans-serif;color:#82718f;margin-top:8px;display:block}.cp-profile .cp-name{font:700 21px/1.35 Inter,Arial,sans-serif!important;color:#1b2539!important;margin:0 0 5px!important;overflow-wrap:anywhere}.cp-role{font:14px/1.5 Inter,Arial,sans-serif;color:#364054;margin:0 0 5px}.cp-location{font:12px/1.5 Inter,Arial,sans-serif;color:#82718f}.cp-profile button{border:0;background:transparent;color:#0080c9;font:600 12px Inter,Arial,sans-serif;padding:8px 0;cursor:pointer;display:block}.cp-profile-links{display:flex;gap:20px;margin:18px 0 8px;border-top:1px solid #e7ecf5;padding-top:12px}
#pagina-painel-candidato.cp-reference .cp-profile .metricas{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important;margin:12px 0 0!important}.cp-profile .metrica{background:#f4f6fb!important;border:0!important;border-radius:9px!important;padding:13px!important;box-shadow:none!important}.cp-profile .metrica span{font:12px Inter,Arial,sans-serif!important;color:#82718f!important}.cp-profile .metrica strong{font:700 19px Inter,Arial,sans-serif!important;color:#0080c9!important}
#pagina-painel-candidato.cp-reference #emPersonalDashboard{margin:0!important;padding:24px!important;border-color:#d8dde7!important;border-radius:14px!important;min-width:0}#pagina-painel-candidato.cp-reference .em-personal-head h2{font:700 22px/1.4 Inter,Arial,sans-serif!important;color:#1b2539!important}#pagina-painel-candidato.cp-reference .em-personal-head{align-items:start;flex-wrap:wrap}#pagina-painel-candidato.cp-reference .em-personal-grid{grid-template-columns:1fr!important;gap:0!important}#pagina-painel-candidato.cp-reference .em-personal-grid article{border:0!important;border-radius:0!important;padding:18px 0!important;border-bottom:1px solid #e7ecf5!important}#pagina-painel-candidato.cp-reference .em-personal-grid article:last-child{border-bottom:0!important}#pagina-painel-candidato.cp-reference .em-personal-grid h3{font:600 17px Inter,Arial,sans-serif!important;color:#0080c9!important}#pagina-painel-candidato.cp-reference .em-personal-grid p{font-size:14px!important}#pagina-painel-candidato.cp-reference .em-personal-grid small{font-size:12px!important}#pagina-painel-candidato.cp-reference .em-personal-grid article>a{color:#0080c9!important}
#pagina-painel-candidato.cp-reference .cp-shortcuts{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:16px!important}#pagina-painel-candidato.cp-reference .cp-shortcuts .painel-card{border:1px solid #d8dde7!important;border-radius:12px!important;padding:20px!important;background:#fff!important;box-shadow:none!important}#pagina-painel-candidato.cp-reference .cp-shortcuts h3{font:700 16px Inter,Arial,sans-serif!important;color:#1b2539!important}#pagina-painel-candidato.cp-reference .cp-shortcuts .btn{background:#eff3fa!important;color:#0080c9!important;border:1px solid #d2dcf0!important;font:600 12px Inter,Arial,sans-serif!important;border-radius:8px!important}
#pagina-painel-candidato.cp-reference button:focus-visible,#pagina-painel-candidato.cp-reference a:focus-visible{outline:2px solid #0080c9!important;outline-offset:3px}
@media(max-width:850px){.cp-layout{grid-template-columns:1fr;gap:18px}.cp-navigation{overflow-x:auto;display:flex}.cp-navigation button{flex:0 0 115px}#pagina-painel-candidato.cp-reference .cp-shortcuts{grid-template-columns:1fr 1fr!important}}
@media(max-width:540px){#pagina-painel-candidato.cp-reference .container-dashboard{width:calc(100% - 28px)!important}.cp-search{flex-wrap:wrap;gap:14px;border-radius:12px}.cp-search label{flex:1 1 100%}.cp-search label+label{border-left:0;border-top:1px solid #e7ecf5;padding:12px 0 0}.cp-search>button{width:100%}.cp-profile{padding:18px}.cp-profile-identity{gap:16px}.cp-profile .cp-name{font-size:19px!important}#pagina-painel-candidato.cp-reference .cp-shortcuts{grid-template-columns:1fr!important}#pagina-painel-candidato.cp-reference .cp-banner{padding:22px!important}.cp-toolbar{padding:12px 16px}}
`;
 style.textContent+=`
.cp-header[hidden]{display:none!important}
body.cp-shell-active>header.topo{display:none!important}
body.cp-shell-active>.cp-header{display:block;background:#fff}
body.cp-shell-active .cp-tab-content{min-height:65vh;background:#f6f7f9!important}
body.cp-shell-active .cp-tab-content>.page-header{display:none!important}
body.cp-shell-active #pagina-home.cp-tab-content> :not(#vagas){display:none!important}
body.cp-shell-active #pagina-home.cp-tab-content #vagas{padding-top:24px!important}
.cp-navigation button{border-radius:10px}
.cp-navigation button:focus-visible{outline:3px solid #87a3dc;outline-offset:2px}
.cp-message-empty{display:none;padding:24px;border:1px solid #d8dde7;border-radius:12px;background:#fff}
#pagina-painel-candidato.cp-messages-active>.container-dashboard> :not(.em-candidate-inbox):not(.cp-message-empty){display:none!important}
#pagina-painel-candidato.cp-messages-active>.container-dashboard>.em-candidate-inbox{display:block!important}
#pagina-painel-candidato.cp-messages-active[data-cp-demo=true] .cp-message-empty{display:block!important}
#pagina-painel-candidato.cp-messages-active>.container-dashboard:not(:has(.em-candidate-inbox))>.cp-message-empty{display:block!important}
@media(max-width:850px){.cp-navigation{margin:14px 14px 12px;padding:3px;gap:6px}.cp-navigation button{flex:0 0 105px}}
`;
 style.textContent+=`
#pagina-painel-candidato.cp-reference:not(.cp-messages-active) .cp-banner,#pagina-painel-candidato.cp-reference .cp-search,#pagina-painel-candidato .cp-profile-links,#pagina-painel-candidato .cp-metrics-slot{display:none!important}
#pagina-painel-candidato.cp-reference .cp-layout{display:grid!important;grid-template-columns:1fr!important;gap:18px!important}
.cp-home-intro{margin:0 0 22px}.cp-home-intro h1{font:750 30px/1.3 Inter,Arial,sans-serif;margin:0 0 7px;color:#243247}.cp-home-intro p{font:14px/1.5 Inter,Arial,sans-serif;margin:0;color:#64748b}
#pagina-painel-candidato.cp-reference .cp-profile{padding:24px 28px!important;width:100%;border-color:#d8e0e5;min-height:150px}
#pagina-painel-candidato.cp-reference .cp-profile-identity{align-items:center!important;gap:28px!important}
#pagina-painel-candidato.cp-reference .cp-profile-identity>div:last-child{display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:24px;align-items:center;flex:1;min-width:0}
#pagina-painel-candidato.cp-reference .cp-profile-identity .cp-name,#pagina-painel-candidato .cp-profile-identity .cp-role,#pagina-painel-candidato .cp-profile-identity .cp-location,#pagina-painel-candidato .cp-profile-skills{grid-column:1}
#pagina-painel-candidato.cp-reference .cp-profile-identity button{grid-column:2;grid-row:1/5;padding:11px 18px!important;border:1px solid #0080c9!important;border-radius:8px;background:#fff;color:#0080c9;font-size:12px}
.cp-profile-skills{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}.cp-profile-skills span{font:500 11px/1.5 Inter,Arial,sans-serif;background:#edf4fb;color:#243247;padding:6px 10px;border-radius:8px}
.cp-home-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.cp-home-summary article{display:flex;align-items:center;gap:22px;border:1px solid #d8e0e5;background:#fff;padding:18px 24px;border-radius:12px}.cp-home-summary svg{width:32px;height:32px;color:#0080c9;flex:none}.cp-home-summary strong{display:block;font:750 25px/1.2 Inter,Arial,sans-serif;color:#243247}.cp-home-summary span{display:block;font:12px/1.5 Inter,Arial,sans-serif;color:#43516a;margin-top:4px}
#pagina-painel-candidato.cp-reference #emPersonalDashboard{padding:8px 0!important;border:0!important;background:transparent!important}
#pagina-painel-candidato.cp-reference .em-personal-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:16px!important}
#pagina-painel-candidato.cp-reference .em-personal-grid article{border:1px solid #d8e0e5!important;border-radius:12px!important;padding:22px!important;background:#fff!important}
body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-grid h3{color:#243247!important;font-weight:700!important}
.cp-recommended-salary{font:700 16px/1.4 Inter,Arial,sans-serif;color:#0080c9;margin:10px 0}
body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-grid article>a{background:#0080c9!important;color:#fff!important;border-radius:8px;padding:9px 18px!important;align-self:flex-end}
#pagina-painel-candidato.cp-reference .cp-shortcuts{grid-template-columns:repeat(2,minmax(0,1fr))!important}
#pagina-painel-candidato.cp-reference .cp-shortcuts .painel-card{display:flex;align-items:center;gap:20px;background:#edf4fb!important;border-color:#d4e2f1!important;padding:22px!important}.cp-shortcuts .painel-card>svg{width:36px;height:36px;color:#0080c9;flex:none}.cp-shortcuts .painel-card p{font:12px/1.6 Inter,Arial,sans-serif;color:#64748b;margin:6px 0 0}
@media(max-width:650px){#pagina-painel-candidato.cp-reference .cp-profile{padding:18px!important}.cp-home-summary{gap:8px}.cp-home-summary article{padding:12px;gap:8px;flex-direction:column;align-items:flex-start}.cp-home-summary span{font-size:10px}#pagina-painel-candidato.cp-reference .em-personal-grid,#pagina-painel-candidato.cp-reference .cp-shortcuts{grid-template-columns:1fr!important}#pagina-painel-candidato.cp-reference .cp-profile-identity{gap:16px!important}#pagina-painel-candidato.cp-reference .cp-profile-identity>div:last-child{display:block}#pagina-painel-candidato.cp-reference .cp-profile-identity button{margin-top:10px}}
`;
 style.textContent+=`
body.cp-shell-active .cp-header{border:0!important;background:#f7faff!important;padding-bottom:8px}
body.cp-shell-active .cp-header .cp-navigation{gap:12px!important;padding:4px!important}
body.cp-shell-active .cp-header .cp-navigation button{border:1px solid #d7e3f0!important;border-radius:11px!important;box-shadow:0 3px 9px #0080c908!important;min-height:84px;padding:15px 8px!important;font-weight:650!important;transition:transform .15s,border-color .15s}
body.cp-shell-active .cp-header .cp-navigation button:hover{transform:translateY(-2px);border-color:#adc5df!important}
body.cp-shell-active .cp-header .cp-navigation button[aria-current=page]{background:linear-gradient(130deg,#0080c9,#0080c9)!important;border-color:#0080c9!important}
body.cp-shell-active .cp-header .cp-navigation button:after{display:none!important}
.cp-message-count{position:absolute;right:14px;top:9px;background:#0080c9;color:#fff;border-radius:50%;font:700 10px/20px Inter,Arial,sans-serif;min-width:20px;height:20px}.cp-message-count[hidden]{display:none!important}
#pagina-painel-candidato.cp-reference .cp-profile-identity{display:grid!important;grid-template-columns:90px minmax(0,1fr) minmax(240px,.85fr)!important}
#pagina-painel-candidato.cp-reference .cp-profile-identity>div:nth-child(2){display:grid!important;grid-template-columns:minmax(0,1fr) auto;column-gap:12px;align-items:center}
#pagina-painel-candidato.cp-reference .cp-profile-objective{border-left:1px solid #d8e0e5;padding-left:24px}.cp-profile-objective h3{font:700 12px/1.4 Inter,Arial,sans-serif;color:#243247;margin:0 0 10px}.cp-profile-objective p{font:12px/1.6 Inter,Arial,sans-serif;color:#43516a;margin:0 0 10px}.cp-profile-objective small{font:11px/1.5 Inter,Arial,sans-serif;color:#526575}
#pagina-painel-candidato .cp-home-summary{grid-template-columns:repeat(4,minmax(0,1fr))!important}
#pagina-painel-candidato .cp-opportunities{display:grid;grid-template-columns:minmax(0,2fr) minmax(260px,1fr);gap:18px;align-items:start}
.cp-home-activity{display:grid;gap:14px}.cp-home-activity>section{border:1px solid #d8e0e5;background:#fff;border-radius:11px;padding:18px}.cp-home-activity .cp-next-interview{background:#edf4fb;border-color:#d4e2f1}.cp-home-activity h3{display:flex;gap:10px;align-items:center;font:700 14px/1.4 Inter,Arial,sans-serif;color:#243247;margin:0 0 12px}.cp-home-activity h3 svg{width:22px;height:22px;color:#0080c9}.cp-home-activity strong{font:700 16px/1.4 Inter,Arial,sans-serif;color:#243247}.cp-home-activity p{font:12px/1.6 Inter,Arial,sans-serif;color:#526575;margin:8px 0}.cp-home-activity small{font:11px/1.5 Inter,Arial,sans-serif;color:#64748b}.cp-home-activity button{display:block;margin-top:12px;padding:8px 12px;border:1px solid #0080c9;background:#fff;border-radius:7px;color:#0080c9;font:600 11px/1.5 Inter,Arial,sans-serif;cursor:pointer}.cp-recent-message button{border:0;padding:0;color:#0080c9}
#pagina-painel-candidato.cp-reference .cp-shortcuts .painel-card button{padding:0;margin-top:8px;border:0;background:transparent;color:#0080c9;font:600 11px/1.5 Inter,Arial,sans-serif;cursor:pointer}
@media(max-width:950px){#pagina-painel-candidato .cp-opportunities{grid-template-columns:1fr}.cp-home-activity{grid-template-columns:1fr 1fr}#pagina-painel-candidato.cp-reference .cp-profile-identity{grid-template-columns:90px 1fr!important}.cp-profile-objective{grid-column:1/-1;border-left:0!important;border-top:1px solid #d8e0e5;padding:16px 0 0!important}}
@media(max-width:650px){#pagina-painel-candidato .cp-home-summary{grid-template-columns:repeat(2,minmax(0,1fr))!important}.cp-home-activity{grid-template-columns:1fr}#pagina-painel-candidato.cp-reference .cp-profile-identity>div:nth-child(2){display:block!important}.cp-home-summary article{flex-direction:row!important;align-items:center!important}}
@media(prefers-reduced-motion:reduce){body.cp-shell-active .cp-header .cp-navigation button{transition:none!important}}
`;
 style.textContent+=`
body.cp-shell-active{background:#f1f6fc!important}
body.cp-shell-active .cp-header .cp-navigation{max-width:1170px;margin-top:16px!important;gap:12px!important}
body.cp-shell-active .cp-header .cp-navigation button{min-height:84px!important;font:650 14px/1.4 Inter,Arial,sans-serif!important;border-radius:10px!important;box-shadow:0 4px 12px #0080c90a!important}
body.cp-shell-active .cp-header .cp-navigation button svg{width:30px!important;height:30px!important}
#pagina-painel-candidato.cp-reference .cp-home-intro h1{font:750 32px/1.2 Inter,Arial,sans-serif!important;margin-bottom:8px!important}
#pagina-painel-candidato.cp-reference .cp-home-intro p{font:15px/1.5 Inter,Arial,sans-serif!important}
#pagina-painel-candidato.cp-reference .cp-profile{padding:22px 28px!important;box-shadow:0 4px 12px #0080c909!important;border:1px solid #dce6f2!important}
#pagina-painel-candidato.cp-reference .cp-profile-identity{grid-template-columns:105px minmax(0,1.2fr) minmax(230px,1fr) auto!important;gap:20px!important}
#pagina-painel-candidato.cp-reference .cp-profile-identity>div:nth-child(2){display:block!important}
#pagina-painel-candidato.cp-reference .cp-profile-identity>.cp-avatar-box{width:105px!important}
body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-avatar{width:74px!important;height:74px!important;margin:auto!important;background:#d7e7f8!important;border:0!important;color:#0080c9!important;font-size:28px!important}
body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-completion{margin:8px auto 0!important;color:#0080c9!important;background:#d7e7f8!important;font-size:10px!important}
#pagina-painel-candidato.cp-reference .cp-avatar-box>small{display:none!important}
#pagina-painel-candidato.cp-reference .cp-profile .cp-name{font:750 24px/1.25 Inter,Arial,sans-serif!important}
#pagina-painel-candidato.cp-reference .cp-role{font:15px/1.5 Inter,Arial,sans-serif!important}.cp-location{font-size:13px!important}
#pagina-painel-candidato.cp-reference .cp-profile-identity>button{grid-column:auto!important;grid-row:auto!important;align-self:center;padding:10px 16px!important;white-space:nowrap}
#pagina-painel-candidato.cp-reference .cp-profile-objective{align-self:stretch;display:flex;justify-content:center;flex-direction:column;padding-left:24px!important}
#pagina-painel-candidato.cp-reference .cp-profile-objective h3{font-size:13px!important}.cp-profile-objective p{font-size:13px!important}.cp-profile-objective small{font-size:12px!important}
#pagina-painel-candidato .cp-home-summary article{box-shadow:0 4px 12px #0080c909!important;border-color:#dce6f2!important;padding:18px 24px!important;gap:18px!important}.cp-home-summary strong{font-size:23px!important}.cp-home-summary span{font-size:13px!important}
#pagina-painel-candidato.cp-reference #emPersonalDashboard{background:#fff!important;border:1px solid #dce6f2!important;border-radius:12px!important;padding:18px!important;box-shadow:0 4px 12px #0080c909!important}
#pagina-painel-candidato.cp-reference .em-personal-head h2{font:750 19px/1.3 Inter,Arial,sans-serif!important}.em-personal-head p{font-size:12px!important}
#pagina-painel-candidato.cp-reference .em-personal-grid{gap:12px!important}
#pagina-painel-candidato.cp-reference .em-personal-grid article{padding:16px!important;border-color:#e1e7ef!important;border-radius:10px!important}
body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-grid h3{font:700 15px/1.4 Inter,Arial,sans-serif!important}
#pagina-painel-candidato.cp-reference .em-personal-grid p{font-size:12px!important}.em-personal-grid small{font-size:11px!important}
#pagina-painel-candidato.cp-reference .em-personal-reasons span{background:#edf4fb!important;color:#0080c9!important}
body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-grid article>a{width:100%!important;text-align:center!important;padding:10px 12px!important;margin-top:12px!important;font-size:12px!important;background:linear-gradient(110deg,#0080c9,#0080c9)!important}
#pagina-painel-candidato .cp-home-activity>section{box-shadow:0 4px 12px #0080c909!important;padding:18px!important;border-radius:12px!important}.cp-home-activity h3{font-size:14px!important}.cp-home-activity p{font-size:12px!important}.cp-home-activity strong{font-size:18px!important}
.cp-strengthen-heading{padding:18px 20px 10px;background:#fff;border:1px solid #dce6f2;border-bottom:0;border-radius:12px 12px 0 0}.cp-strengthen-heading h2{margin:0 0 5px;font:750 19px/1.3 Inter,Arial,sans-serif;color:#243247}.cp-strengthen-heading p{margin:0;font:12px/1.5 Inter,Arial,sans-serif;color:#64748b}
#pagina-painel-candidato.cp-reference .cp-shortcuts{background:#fff!important;border:1px solid #dce6f2!important;border-top:0!important;padding:0 16px 16px!important;border-radius:0 0 12px 12px!important;margin-top:0!important;gap:14px!important}
#pagina-painel-candidato.cp-reference .cp-shortcuts .painel-card{background:#fff!important;padding:14px!important;border:1px solid #d7e3f0!important;border-radius:10px!important}.cp-shortcuts h3{font-size:13px!important}.cp-shortcuts .painel-card>svg{background:#edf4fb;border-radius:8px;padding:8px;width:42px!important;height:42px!important}
@media(max-width:1000px){#pagina-painel-candidato.cp-reference .cp-profile-identity{grid-template-columns:90px minmax(0,1fr) auto!important}#pagina-painel-candidato.cp-reference .cp-profile-objective{grid-column:2/3!important;grid-row:2!important;border-left:0!important;border-top:0!important;padding:0!important}#pagina-painel-candidato.cp-reference .cp-profile-identity>button{grid-column:3!important;grid-row:1/3!important}}
@media(max-width:650px){#pagina-painel-candidato.cp-reference .cp-profile-identity{grid-template-columns:75px minmax(0,1fr)!important}#pagina-painel-candidato.cp-reference .cp-profile-identity>button{grid-column:2!important;grid-row:3!important;justify-self:start;margin-top:6px}#pagina-painel-candidato.cp-reference .cp-profile .cp-name{font-size:20px!important}}
`;
 style.textContent+=`
/* Referência aprovada: tipografia Inter com prioridade sobre regras legadas. */
html body.cp-shell-active .cp-header *,html body.cp-shell-active #pagina-painel-candidato.cp-reference *,html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-shortcuts .painel-card *{font-family:Inter,Arial,sans-serif!important;letter-spacing:normal!important}
html body.cp-shell-active .cp-header .cp-toolbar{background:#fff!important;color:#091331!important;min-height:52px!important;padding:10px max(24px,calc((100% - 1170px)/2))!important}
html body.cp-shell-active .cp-toolbar>strong{font-size:25px!important;font-weight:800!important;color:#0080c9!important}.cp-toolbar>strong>span{color:#0080c9!important}
html body.cp-shell-active .cp-toolbar .cp-greeting{background:#fff!important;color:#091331!important;font-size:12px!important;font-weight:600!important;padding:7px 12px!important}
html body.cp-shell-active .cp-header{background:#eff5fc!important;padding-bottom:0!important}
html body.cp-shell-active .cp-header .cp-navigation{margin:16px auto 14px!important;max-width:1170px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference{background:linear-gradient(120deg,#f3f7fc,#eaf2fb)!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .container-dashboard{padding-top:10px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-home-intro{margin-bottom:14px!important}.cp-home-intro h1{color:#080c2a!important;font-weight:800!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-profile{min-height:135px!important;padding:18px 28px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-profile .cp-name{color:#080c2a!important;font-weight:750!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-profile .cp-role{font-size:15px!important;color:#243247!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-profile-skills span{background:#e3eefb!important;color:#0080c9!important;font-size:11px!important;font-weight:600!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-profile-identity>button{font-size:12px!important;font-weight:600!important;padding:10px 18px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-home-summary article{padding:16px 22px!important;min-height:74px!important}.cp-home-summary svg{width:31px!important;height:31px!important;color:#0080c9!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-home-summary strong{font-size:23px!important;color:#080c2a!important}.cp-home-summary span{font-size:13px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-opportunities{grid-template-columns:minmax(0,2fr) minmax(290px,1fr)!important;gap:14px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference #emPersonalDashboard{padding:16px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-head{margin-bottom:12px!important}.em-personal-head h2{color:#080c2a!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-grid article{position:relative!important;padding:16px!important;min-height:185px!important}
.cp-job-symbol{position:absolute;top:16px;left:16px;width:48px;height:52px;display:grid;place-items:center;background:#e7f0fb;border-radius:8px;color:#0080c9}.cp-job-symbol svg{width:28px;height:28px}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-grid article h3,html body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-grid article>p,html body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-grid article>small{margin-left:60px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-grid h3{font-size:14px!important;line-height:1.35!important;margin-bottom:6px!important;color:#080c2a!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-grid p{font-size:12px!important;margin-bottom:4px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-grid small{font-size:11px!important;margin-bottom:14px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-recommended-salary{font-size:13px!important;color:#080c2a!important;border-top:1px solid #e2e8f0;padding-top:12px;margin:4px 0 0!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-reasons{margin:8px 0 0!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-reasons span{background:transparent!important;padding:0 10px 0 0!important;font-size:11px!important;color:#243247!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .em-personal-grid article>a{padding:9px 12px!important;margin-top:12px!important;font-size:13px!important;font-weight:600!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-home-activity>section{padding:16px 18px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-next-interview{position:relative;min-height:135px!important;padding-right:118px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-next-interview h3{font-size:14px!important;white-space:nowrap;gap:8px!important}.cp-next-interview h3 svg{width:22px!important;height:22px!important;flex:none}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-next-interview strong{font-size:19px!important;font-weight:750!important}.cp-next-interview p{margin:7px 0 4px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-next-interview button{position:absolute;right:14px;top:50%;transform:translateY(-50%);max-width:110px;font-size:10px!important;padding:9px 10px!important;margin:0!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-recent-message{min-height:125px!important}.cp-recent-message strong{font-size:13px!important;font-weight:500!important}.cp-recent-message h3{font-size:13px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-strengthen-heading{padding:14px 18px 10px!important}.cp-strengthen-heading h2{font-size:19px!important;color:#080c2a!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-shortcuts .painel-card{padding:12px 14px!important;gap:14px!important}
html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-shortcuts h3{font-size:13px!important;font-weight:700!important;margin:0!important}.cp-shortcuts p{font-size:11px!important}
@media(max-width:950px){html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-opportunities{grid-template-columns:1fr!important}}
@media(max-width:650px){html body.cp-shell-active .cp-header .cp-navigation{margin:12px 14px!important}html body.cp-shell-active #pagina-painel-candidato.cp-reference .cp-next-interview{padding-right:125px!important}}
`;
 style.textContent+=`
html body.cp-shell-active.em-candidato-logado #pagina-painel-candidato.cp-reference.cp-tab-content :is(h1,h2,h3,h4,p,span,small,strong,a,button,dt,dd),html body.cp-shell-active.em-candidato-logado .cp-header :is(button,span,strong,small){font-family:Inter,Arial,sans-serif!important;letter-spacing:normal!important}
html body.cp-shell-active.em-candidato-logado #pagina-painel-candidato.cp-reference.cp-tab-content .cp-next-interview button{white-space:nowrap!important;max-width:none!important;right:12px!important;font-size:10px!important;padding:8px 10px!important}
`;

 style.textContent+=`
html body.cp-shell-active .cp-header .cp-navigation{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:10px!important;max-width:1170px;margin:18px auto 14px!important;padding:5px!important;overflow:visible!important}
html body.cp-shell-active .cp-header .cp-navigation button{min-width:0!important;min-height:0!important;padding:12px 8px 14px!important;gap:9px!important;border:1px solid #d8e5ff!important;border-radius:16px!important;background:linear-gradient(180deg,#fff,#fbfcff)!important;color:#202c44!important;box-shadow:0 4px 14px #0080c90b!important;font:650 13px/1.3 Inter,Arial,sans-serif!important;transition:transform .15s,box-shadow .15s!important}
html body.cp-shell-active .cp-header .cp-navigation .cp-nav-art{display:block!important;width:100%!important;max-width:112px!important;height:auto!important;aspect-ratio:250/280;flex:none;overflow:hidden;border-radius:12px}
html body.cp-shell-active .cp-header .cp-navigation button[aria-current=page]{background:linear-gradient(145deg,#0080c9,#0080c9)!important;color:#fff!important;border-color:#82aafa!important;box-shadow:0 0 0 3px #d4e2ff,0 6px 18px #0080c922!important}
html body.cp-shell-active .cp-header .cp-navigation button:hover{transform:translateY(-2px);border-color:#8aabee!important;box-shadow:0 6px 18px #0080c919!important}
html body.cp-shell-active .cp-header .cp-navigation button:focus-visible{outline:3px solid #0080c9!important;outline-offset:4px!important}
html body.cp-shell-active .cp-header .cp-navigation button>span{white-space:nowrap!important;font-size:13px!important;line-height:1.3!important}
html body.cp-shell-active .cp-header .cp-navigation .cp-message-count{top:9px;right:9px;min-width:22px;height:22px;font:700 11px/22px Inter,Arial,sans-serif;background:#0080c9;color:#fff}
@media(max-width:1200px){html body.cp-shell-active .cp-header .cp-navigation{margin-left:14px!important;margin-right:14px!important}}
@media(max-width:850px){html body.cp-shell-active .cp-header .cp-navigation{display:flex!important;overflow-x:auto!important;gap:10px!important;padding:6px!important;scroll-snap-type:x proximity}html body.cp-shell-active .cp-header .cp-navigation button{flex:0 0 128px!important;scroll-snap-align:start}html body.cp-shell-active .cp-header .cp-navigation .cp-nav-art{max-width:88px!important}}
@media(max-width:480px){html body.cp-shell-active .cp-header .cp-navigation button{flex-basis:112px!important;padding:10px 6px 12px!important}html body.cp-shell-active .cp-header .cp-navigation button>span{font-size:11px!important}html body.cp-shell-active .cp-header .cp-navigation .cp-nav-art{max-width:76px!important}}
@media(prefers-reduced-motion:reduce){html body.cp-shell-active .cp-header .cp-navigation button{transition:none!important;transform:none!important}}
`;
 document.head.appendChild(style);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();window.addEventListener('load',setup,{once:true});
})();

