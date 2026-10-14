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
  var previousHome=document.getElementById('emPersonalHome');if(previousHome)previousHome.remove();
  var sections=[null,mount('emPersonalDashboard',dashboard,dashboard&&dashboard.querySelector('.painel-candidato-grid'))];
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

/* Painel do candidato: navegação horizontal e resumo pessoal. */
(function(){
 'use strict';
 var page,container,signature='',candidateHeader,messageTab=false;
 function svg(name){var paths={home:'<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7"/>',case:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18"/>',search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',user:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="9" r="3"/><path d="M6 19c0-6 12-6 12 0"/>',chat:'<path d="M21 11a8 8 0 0 1-8 8H6l-4 3V11a9 9 0 0 1 19 0Z"/><path d="M7 10h10M7 14h7"/>',heart:'<path d="M20 4c-3-3-6-1-8 1-2-2-5-4-8-1-5 5 2 11 8 16 6-5 13-11 8-16Z"/>',star:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>'};return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+paths[name]+'</svg>'}
 function go(route){if(route!=='painel-candidato')messageTab=false;if(typeof window.irPara==='function')window.irPara(route)}
 function profile(){try{return typeof window.obterCandidatoAtual==='function'?window.obterCandidatoAtual()||{}:{}}catch(e){return {}}}
 function update(){
  if(!container||!page.classList.contains('ativa'))return;
  if(window.EmpregaMaisCandidaturasCandidato)window.EmpregaMaisCandidaturasCandidato.atualizarResumo(container.querySelector('.cp-metrics-slot'));
  var c=profile(),name=c.nome||sessionStorage.getItem('candidatoNome')||'Candidato',email=sessionStorage.getItem('candidatoEmail')||'',saved=false;try{saved=typeof window.curriculoCadastrado==='function'&&window.curriculoCadastrado()}catch(e){}
  var fields=[name,c.cargoDesejado||c.areaProfissional||'Seu próximo passo profissional',c.cidadeProfissional||c.cidade||'',c.uf||c.estado||'',c.telefone||'',c.escolaridadeProfissional||'',c.experienciaProfissional||'',c.habilidadesProfissionais||'',email,saved],next=JSON.stringify(fields);if(next===signature)return;signature=next;
  var score=Math.round([name!=='Candidato',!!email,!!c.telefone,!!(c.cidadeProfissional||c.cidade),!!(c.cargoDesejado||c.areaProfissional),!!c.escolaridadeProfissional,!!c.experienciaProfissional,!!c.habilidadesProfissionais,!!saved].filter(Boolean).length/9*100);
  container.querySelector('.cp-name').textContent=name;container.querySelector('.cp-role').textContent=fields[1];container.querySelector('.cp-location').textContent=[fields[2],fields[3]].filter(Boolean).join(' · ');container.querySelector('.cp-avatar').textContent=name.split(/\s+/).filter(Boolean).slice(0,2).map(function(n){return n[0]}).join('').toUpperCase();container.querySelector('.cp-avatar').style.setProperty('--completion',score+'%');container.querySelector('.cp-completion').textContent=score+'%';container.querySelector('.cp-greeting').textContent='Olá, '+name.split(' ')[0];
  var city=container.querySelector('#cpSearchCity');if(!city.value)city.value=fields[2];
 }
 function setup(){
  page=document.getElementById('pagina-painel-candidato');if(!page)return;container=page.querySelector('.container-dashboard');if(!container)return;
  if(container.querySelector('.cp-layout')){var existingInbox=container.querySelector('.em-candidate-inbox');if(existingInbox&&existingInbox!==container.lastElementChild)container.appendChild(existingInbox);update();return}
  page.classList.add('cp-reference');
  if(new URLSearchParams(location.search).get('pagina')==='demo-candidato')page.dataset.cpDemo='true';
  var nav=document.createElement('nav');nav.className='cp-navigation';nav.setAttribute('aria-label','Área do candidato');
  var routes=[['home','Minha área','painel-candidato'],['case','Candidaturas','candidaturas'],['search','Buscar vagas','home'],['user','Currículo','curriculo'],['chat','Mensagens','messages'],['heart','Vagas salvas','salvas'],['star','Premium','premium-candidato']];
  nav.innerHTML=routes.map(function(r,i){return '<button type="button" data-route="'+r[2]+'" '+(i===0?'aria-current="page"':'')+'>'+svg(r[0])+'<span>'+r[1]+'</span></button>'}).join('');
  var toolbar=document.createElement('div');toolbar.className='cp-toolbar';toolbar.innerHTML='<strong>+Empregos</strong><button type="button" class="cp-greeting" data-route="perfil">Minha conta</button>';
  var header=document.createElement('div');header.className='cp-header';header.append(toolbar,nav);page.prepend(header);
  candidateHeader=header;
  // Keep one persistent shell while the existing SPA renders each section.
  document.body.insertBefore(header,document.body.firstChild);
  header.addEventListener('click',function(event){
   var button=event.target.closest('[data-route]');if(!button)return;
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
   active.classList.add('cp-tab-content');
   if(route!=='painel-candidato')messageTab=false;
   page.classList.toggle('cp-messages-active',messageTab);
   nav.querySelectorAll('[data-route]').forEach(function(b){if(b.dataset.route===(messageTab?'messages':route))b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  }
  var shellPending=false;
  new MutationObserver(function(records){if(shellPending||!records.some(function(r){return r.oldValue!==r.target.getAttribute('class')}))return;shellPending=true;requestAnimationFrame(function(){shellPending=false;syncShell()})}).observe(document.body,{subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['class']});
  window.addEventListener('popstate',function(){messageTab=false;syncShell()});
  syncShell();
  var banner=container.querySelector('.premium-chamada-painel-v79');if(banner){banner.classList.add('cp-banner');banner.querySelector('strong').textContent='Encontre oportunidades que combinam com você';banner.querySelector('p').textContent='Complete seu perfil e conheça as ferramentas para organizar sua busca por emprego.';var close=document.createElement('button');close.type='button';close.className='cp-banner-close';close.setAttribute('aria-label','Fechar destaque');close.textContent='×';close.onclick=function(){banner.hidden=true};banner.appendChild(close)}
  var search=document.createElement('form');search.className='cp-search';search.innerHTML='<label for="cpSearchRole">O que?<input id="cpSearchRole" placeholder="Digite cargo ou área profissional" type="search"></label><label for="cpSearchCity">Onde?<input id="cpSearchCity" placeholder="Cidade" type="text"></label><button type="submit">Encontrar vagas</button>';
  search.onsubmit=function(event){event.preventDefault();go('home');[['filtroPalavra','cpSearchRole'],['filtroCidade','cpSearchCity']].forEach(function(pair){var target=document.getElementById(pair[0]);if(target)target.value=container.querySelector('#'+pair[1]).value});if(typeof window.filtrarVagas==='function')window.filtrarVagas();var list=document.getElementById('vagas');if(list)list.scrollIntoView({behavior:'smooth'})};
  if(banner)banner.after(search);else container.prepend(search);
  var layout=document.createElement('div');layout.className='cp-layout';layout.innerHTML='<aside class="cp-profile"><div class="cp-profile-identity"><div class="cp-avatar-box"><div class="cp-avatar"></div><span class="cp-completion"></span><small>Perfil preenchido</small></div><div><h1 class="cp-name"></h1><p class="cp-role"></p><small class="cp-location"></small><button type="button" data-route="perfil">Editar meu perfil</button></div></div><div class="cp-profile-links"><button type="button" data-route="curriculo">Atualizar currículo</button><button type="button" data-route="premium-candidato">Conhecer Premium</button></div><div class="cp-metrics-slot"></div></aside><div class="cp-opportunities"><div class="cp-recommendations-slot"></div></div>';
  search.after(layout);var metrics=container.querySelector('.metricas');if(metrics)layout.querySelector('.cp-metrics-slot').appendChild(metrics);
  var rec=document.getElementById('emPersonalDashboard');if(!rec){rec=document.createElement('section');rec.id='emPersonalDashboard';rec.className='em-personal-recs';rec.innerHTML='<div class="em-personal-head"><h2>Vagas recomendadas para você</h2></div><p>Carregando oportunidades…</p>'}layout.querySelector('.cp-recommendations-slot').appendChild(rec);
  var cards=container.querySelector('.painel-candidato-grid');if(cards){cards.classList.add('cp-shortcuts');cards.querySelectorAll('h3').forEach(function(h){h.textContent=h.textContent.replace(/[^\p{L}\p{N}\s]/gu,'').trim()})}
  page.addEventListener('click',function(event){var button=event.target.closest('[data-route]');if(!button)return;var route=button.dataset.route;if(route==='messages'){var inbox=page.querySelector('.em-candidate-inbox');if(inbox){inbox.scrollIntoView({behavior:'smooth'});var refresh=inbox.querySelector('button');if(refresh)refresh.click()}}else go(route)});
  new MutationObserver(function(){if(page.classList.contains('ativa'))update()}).observe(page,{attributes:true,attributeFilter:['class']});
  window.addEventListener('storage',update);document.addEventListener('empregamais:candidato-sincronizado',update);
  if(typeof window.renderizarPainelCandidato==='function'){var original=window.renderizarPainelCandidato;window.renderizarPainelCandidato=function(){var result=original.apply(this,arguments);update();return result}}
  function placeServiceSections(){page.querySelectorAll(':scope > .emi-candidate,:scope > .em-hire-confirmations,:scope > .em-candidate-inbox').forEach(function(section){container.appendChild(section)});}
  placeServiceSections();
  new MutationObserver(placeServiceSections).observe(page,{childList:true});
  var inbox=container.querySelector('.em-candidate-inbox');if(inbox)container.appendChild(inbox);
  update();
 }
 var style=document.createElement('style');style.id='cp-reference-design';style.textContent=`
#pagina-painel-candidato[data-cp-demo=true] .emi-candidate,#pagina-painel-candidato[data-cp-demo=true] .em-hire-confirmations,#pagina-painel-candidato[data-cp-demo=true] .em-candidate-inbox{display:none!important}
#pagina-painel-candidato.cp-reference .emi-candidate,#pagina-painel-candidato.cp-reference .em-hire-confirmations{margin:22px 0!important;border:1px solid #ded8e7!important;border-radius:12px!important;padding:20px!important;box-sizing:border-box!important}
body:has(#pagina-painel-candidato.cp-reference.ativa)>header{display:none!important}
#pagina-painel-candidato.cp-reference{background:#f7f6f9!important;padding:0!important;color:#241b39;font-family:Inter,Arial,sans-serif}
#pagina-painel-candidato.cp-reference>.page-header,#pagina-painel-candidato.cp-reference .painel-candidato-abas-em{display:none!important}
.cp-header{background:white;border-bottom:1px solid #e2ddec}
.cp-toolbar{background:#51258a;color:#fff;display:flex;justify-content:space-between;align-items:center;padding:12px max(24px,calc((100% - 1170px)/2));gap:20px}
.cp-toolbar strong{font:800 24px Inter,Arial,sans-serif}.cp-toolbar button{border:0;border-radius:24px;padding:9px 22px;background:#fff;color:#51258a;font:600 13px Inter,Arial,sans-serif;cursor:pointer}
.cp-navigation{max-width:1170px;margin:18px auto 14px;gap:6px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr))}
.cp-navigation button{border:0;background:#fff;color:#51258a;padding:18px 8px 14px;display:flex;flex-direction:column;align-items:center;gap:8px;font:500 13px Inter,Arial,sans-serif;cursor:pointer;position:relative}
.cp-navigation svg{width:29px;height:29px}.cp-navigation button[aria-current=page]{background:#51258a;color:#fff}.cp-navigation button[aria-current=page]:after{content:'';position:absolute;bottom:-1px;border-left:9px solid transparent;border-right:9px solid transparent;border-bottom:9px solid #fff}.cp-navigation button:hover{background:#f1eafa;color:#51258a}
#pagina-painel-candidato.cp-reference .container-dashboard{max-width:1170px!important;width:calc(100% - 40px)!important;padding:24px 0!important;margin:auto!important}
#pagina-painel-candidato.cp-reference .cp-banner{position:relative;display:flex!important;flex-direction:column!important;text-align:center!important;align-items:center!important;justify-content:center!important;background:#51258a!important;color:#fff!important;min-height:140px!important;border:0!important;border-radius:0!important;padding:24px 45px!important;box-sizing:border-box;margin:0 0 24px!important;gap:14px!important}
#pagina-painel-candidato.cp-reference .cp-banner[hidden]{display:none!important}
.cp-banner .premium-chamada-icone-v79,.cp-banner .premium-chamada-texto-v79>span{display:none!important}.cp-banner .premium-chamada-texto-v79 strong{color:#fff!important;font:700 18px/1.5 Inter,Arial,sans-serif!important}.cp-banner .premium-chamada-texto-v79 p{color:#e7daf8!important;font:13px/1.6 Inter,Arial,sans-serif!important;margin-top:5px!important}
#pagina-painel-candidato.cp-reference .cp-banner>button:not(.cp-banner-close){border:0!important;border-radius:24px!important;background:#fff!important;color:#51258a!important;padding:11px 24px!important;font:700 13px Inter,Arial,sans-serif!important}
#pagina-painel-candidato.cp-reference .cp-banner-close{position:absolute!important;right:14px;top:8px;background:transparent!important;color:#fff!important;border:0!important;font-size:25px!important;padding:0!important;min-width:30px!important}
.cp-search{display:flex;align-items:center;gap:18px;max-width:770px;margin:0 auto 28px;background:white;border:1px solid #ded8e7;border-radius:16px;padding:12px 16px;box-sizing:border-box}.cp-search label{display:grid;gap:4px;flex:1;min-width:0;font:500 12px Inter,Arial,sans-serif;color:#51258a}.cp-search label+label{border-left:1px solid #ded8e7;padding-left:20px}.cp-search input{width:100%;border:0;background:white;padding:0;outline-offset:4px;font:14px Inter,Arial,sans-serif;color:#241b39;min-width:0;box-sizing:border-box}.cp-search input::placeholder{font-style:normal;color:#9992a5}.cp-search>button{border:0;border-radius:24px;background:#51258a;color:#fff;font:700 13px Inter,Arial,sans-serif;padding:12px 19px;cursor:pointer}
.cp-layout{display:grid;grid-template-columns:minmax(300px,.8fr) minmax(0,1.2fr);gap:28px;align-items:start;margin-bottom:24px}.cp-profile{background:#fff;border:1px solid #ded8e7;border-radius:14px;padding:24px;min-width:0}.cp-profile-identity{display:flex;align-items:flex-start;gap:24px}.cp-avatar-box{position:relative;flex:0 0 86px;text-align:center}.cp-avatar{width:86px;height:86px;border-radius:50%;display:grid;place-items:center;font:700 25px Inter,Arial,sans-serif;background:linear-gradient(#f5f0fb,#f5f0fb) padding-box,conic-gradient(#7540ae var(--completion),#e6dfee 0) border-box;border:5px solid transparent;color:#7540ae;box-sizing:border-box}.cp-completion{display:table;background:#7540ae;border-radius:20px;padding:3px 9px;color:white;font:600 11px Inter,Arial,sans-serif;margin:-12px auto 0;position:relative}.cp-avatar-box>small{font:10px Inter,Arial,sans-serif;color:#82718f;margin-top:8px;display:block}.cp-profile .cp-name{font:700 21px/1.35 Inter,Arial,sans-serif!important;color:#241b39!important;margin:0 0 5px!important;overflow-wrap:anywhere}.cp-role{font:14px/1.5 Inter,Arial,sans-serif;color:#443654;margin:0 0 5px}.cp-location{font:12px/1.5 Inter,Arial,sans-serif;color:#82718f}.cp-profile button{border:0;background:transparent;color:#7540ae;font:600 12px Inter,Arial,sans-serif;padding:8px 0;cursor:pointer;display:block}.cp-profile-links{display:flex;gap:20px;margin:18px 0 8px;border-top:1px solid #eee7f5;padding-top:12px}
#pagina-painel-candidato.cp-reference .cp-profile .metricas{display:grid!important;grid-template-columns:1fr 1fr!important;gap:10px!important;margin:12px 0 0!important}.cp-profile .metrica{background:#f7f4fb!important;border:0!important;border-radius:9px!important;padding:13px!important;box-shadow:none!important}.cp-profile .metrica span{font:12px Inter,Arial,sans-serif!important;color:#82718f!important}.cp-profile .metrica strong{font:700 19px Inter,Arial,sans-serif!important;color:#51258a!important}
#pagina-painel-candidato.cp-reference #emPersonalDashboard{margin:0!important;padding:24px!important;border-color:#ded8e7!important;border-radius:14px!important;min-width:0}#pagina-painel-candidato.cp-reference .em-personal-head h2{font:700 22px/1.4 Inter,Arial,sans-serif!important;color:#241b39!important}#pagina-painel-candidato.cp-reference .em-personal-head{align-items:start;flex-wrap:wrap}#pagina-painel-candidato.cp-reference .em-personal-grid{grid-template-columns:1fr!important;gap:0!important}#pagina-painel-candidato.cp-reference .em-personal-grid article{border:0!important;border-radius:0!important;padding:18px 0!important;border-bottom:1px solid #eee7f5!important}#pagina-painel-candidato.cp-reference .em-personal-grid article:last-child{border-bottom:0!important}#pagina-painel-candidato.cp-reference .em-personal-grid h3{font:600 17px Inter,Arial,sans-serif!important;color:#7540ae!important}#pagina-painel-candidato.cp-reference .em-personal-grid p{font-size:14px!important}#pagina-painel-candidato.cp-reference .em-personal-grid small{font-size:12px!important}#pagina-painel-candidato.cp-reference .em-personal-grid article>a{color:#7540ae!important}
#pagina-painel-candidato.cp-reference .cp-shortcuts{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:16px!important}#pagina-painel-candidato.cp-reference .cp-shortcuts .painel-card{border:1px solid #ded8e7!important;border-radius:12px!important;padding:20px!important;background:#fff!important;box-shadow:none!important}#pagina-painel-candidato.cp-reference .cp-shortcuts h3{font:700 16px Inter,Arial,sans-serif!important;color:#241b39!important}#pagina-painel-candidato.cp-reference .cp-shortcuts .btn{background:#f4effa!important;color:#7540ae!important;border:1px solid #e0d2f0!important;font:600 12px Inter,Arial,sans-serif!important;border-radius:8px!important}
#pagina-painel-candidato.cp-reference button:focus-visible,#pagina-painel-candidato.cp-reference a:focus-visible{outline:2px solid #7540ae!important;outline-offset:3px}
@media(max-width:850px){.cp-layout{grid-template-columns:1fr;gap:18px}.cp-navigation{overflow-x:auto;display:flex}.cp-navigation button{flex:0 0 115px}#pagina-painel-candidato.cp-reference .cp-shortcuts{grid-template-columns:1fr 1fr!important}}
@media(max-width:540px){#pagina-painel-candidato.cp-reference .container-dashboard{width:calc(100% - 28px)!important}.cp-search{flex-wrap:wrap;gap:14px;border-radius:12px}.cp-search label{flex:1 1 100%}.cp-search label+label{border-left:0;border-top:1px solid #eee7f5;padding:12px 0 0}.cp-search>button{width:100%}.cp-profile{padding:18px}.cp-profile-identity{gap:16px}.cp-profile .cp-name{font-size:19px!important}#pagina-painel-candidato.cp-reference .cp-shortcuts{grid-template-columns:1fr!important}#pagina-painel-candidato.cp-reference .cp-banner{padding:22px!important}.cp-toolbar{padding:12px 16px}}
`;
 style.textContent+=`
.cp-header[hidden]{display:none!important}
body.cp-shell-active>header.topo{display:none!important}
body.cp-shell-active>.cp-header{display:block;background:#fff}
body.cp-shell-active .cp-tab-content{min-height:65vh;background:#f7f6f9!important}
body.cp-shell-active .cp-tab-content>.page-header{display:none!important}
body.cp-shell-active #pagina-home.cp-tab-content> :not(#vagas){display:none!important}
body.cp-shell-active #pagina-home.cp-tab-content #vagas{padding-top:24px!important}
.cp-navigation button{border-radius:10px}
.cp-navigation button:focus-visible{outline:3px solid #aa87dc;outline-offset:2px}
.cp-message-empty{display:none;padding:24px;border:1px solid #ded8e7;border-radius:12px;background:#fff}
#pagina-painel-candidato.cp-messages-active>.container-dashboard> :not(.em-candidate-inbox):not(.cp-message-empty){display:none!important}
#pagina-painel-candidato.cp-messages-active>.container-dashboard>.em-candidate-inbox{display:block!important}
#pagina-painel-candidato.cp-messages-active[data-cp-demo=true] .cp-message-empty{display:block!important}
#pagina-painel-candidato.cp-messages-active>.container-dashboard:not(:has(.em-candidate-inbox))>.cp-message-empty{display:block!important}
@media(max-width:850px){.cp-navigation{margin:14px 14px 12px;padding:3px;gap:6px}.cp-navigation button{flex:0 0 105px}}
`;
 document.head.appendChild(style);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();window.addEventListener('load',setup,{once:true});
})();
