(function(){
'use strict';
var page,scheduled=false;
function el(tag,cls,text){var x=document.createElement(tag);x.className=cls||'';if(text!==undefined)x.textContent=text;return x}
function company(){var name=document.getElementById('empresaPublicaNome');var key=new URL(location.href).searchParams.get('empresa');var list=window.emLinkEmpresa?window.emLinkEmpresa.catalogo():typeof window.empresasCadastradas==='function'?window.empresasCadastradas():[];return list.find(function(e){return key&&(e.linkEmpresaSlug===key||(e.linkEmpresaSlugsAnteriores||[]).indexOf(key)>=0)})||list.find(function(e){return name&&[e.nome,e.nomeFantasia,e.nome_fantasia,e.razaoSocial].indexOf(name.textContent)>=0})||{}}
function configure(){
page=document.getElementById('pagina-empresa-publica');if(!page)return;var host=page.querySelector('.empresa-publica'),cab=page.querySelector('.empresa-publica-cab'),top=page.querySelector('.empresa-publica-topo');if(!host||!cab||!top)return;
if(!host.querySelector('.ep-reference-cover')){
var cover=el('div','ep-reference-cover');cab.prepend(cover);
var nav=el('nav','ep-reference-nav');nav.setAttribute('aria-label','Navegação do perfil da empresa');
[['Visão geral','.empresa-publica-sobre'],['Vagas','.empresa-publica-vagas']].forEach(function(row,i){var button=el('button',i===0?'selected':'',row[0]);button.type='button';button.setAttribute('aria-pressed',String(i===0));button.onclick=function(){nav.querySelectorAll('button').forEach(function(x){x.classList.toggle('selected',x===button);x.setAttribute('aria-pressed',String(x===button))});var target=host.querySelector(row[1]);if(target)target.scrollIntoView({behavior:'smooth',block:'start'})};nav.appendChild(button)});cab.appendChild(nav);
var grid=el('div','ep-reference-grid'),about=host.querySelector('.empresa-publica-sobre'),info=host.querySelector('.empresa-publica-info');host.insertBefore(grid,about);if(about)grid.appendChild(about);var summary=el('aside','ep-reference-summary');summary.appendChild(el('h2','','Resumo'));if(info)summary.appendChild(info);grid.appendChild(summary);
var follow=el('button','ep-reference-follow','Seguir empresa');follow.type='button';follow.setAttribute('aria-pressed','false');top.appendChild(follow);
follow.onclick=function(){var e=company(),key='emEmpresaSeguida:'+String(e.cnpj||e.id||e.linkEmpresaSlug||document.getElementById('empresaPublicaNome').textContent);try{var next=localStorage.getItem(key)!=='1';if(next)localStorage.setItem(key,'1');else localStorage.removeItem(key);follow.textContent=next?'✓ Seguindo':'＋ Seguir empresa';follow.setAttribute('aria-pressed',String(next))}catch(err){follow.textContent='Não foi possível salvar';}};
}
var e=company(),cover=host.querySelector('.ep-reference-cover'),saved=e.perfilPublico||e.perfil||{};
try{if(typeof saved==='string')saved=JSON.parse(saved);if(!Object.keys(saved).length){var extra=typeof e.comprovacaoVerificacao==='string'?JSON.parse(e.comprovacaoVerificacao||'{}'):e.comprovacaoVerificacao||{};saved=extra.perfilPublico||JSON.parse(localStorage.getItem('perfilPublicoEmpresaEmpregaMais_'+String(e.cnpj||'').replace(/\D/g,''))||'{}')}}catch(err){saved={}}
var image=e.capa||e.capaPerfil||e.imagemCapa||saved.capa||'';
[['empresaPublicaSobre',saved.sobre],['empresaPublicaFuncionarios',e.funcionarios||e.porte||saved.porte],['empresaPublicaSetor',e.setor||e.segmento||saved.segmento]].forEach(function(row){var node=document.getElementById(row[0]);if(row[1]&&node&&node.textContent!==String(row[1]))node.textContent=row[1]});
var logo=document.getElementById('empresaPublicaLogo');if(logo&&saved.logo&&!logo.getAttribute('src')){logo.src=saved.logo;logo.style.display='block';}
var safe=/^(https?:|data:image\/)/i.test(image)?image:'';
if(cover.dataset.image!==safe){cover.dataset.image=safe;cover.style.backgroundImage=safe?'url("'+safe.replace(/["\\\n\r]/g,'')+'")':'';}
var follow=host.querySelector('.ep-reference-follow'),key='emEmpresaSeguida:'+String(e.cnpj||e.id||e.linkEmpresaSlug||document.getElementById('empresaPublicaNome').textContent);try{var yes=localStorage.getItem(key)==='1';var text=yes?'✓ Seguindo':'＋ Seguir empresa';if(follow.textContent!==text)follow.textContent=text;follow.setAttribute('aria-pressed',String(yes))}catch(err){}
var logo=document.getElementById('empresaPublicaLogo');if(logo&&!logo.getAttribute('src')&&!top.querySelector('.ep-reference-initial')){var initial=el('span','ep-reference-initial',(document.getElementById('empresaPublicaNome').textContent||'E').charAt(0));logo.after(initial)}else if(logo&&logo.getAttribute('src')){var initial=top.querySelector('.ep-reference-initial');if(initial)initial.remove()}
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;configure()})}
function init(){configure();var p=document.getElementById('pagina-empresa-publica');if(p)new MutationObserver(schedule).observe(p,{childList:true,subtree:true});window.addEventListener('popstate',schedule);window.addEventListener('storage',schedule);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();window.addEventListener('load',schedule);
})();
(function(){
 var queued=false;
 function configureTabs(){
  var page=document.getElementById('pagina-empresa-publica');if(!page)return;
  var host=page.querySelector('#emGriffPublic')||page.querySelector('.empresa-publica');if(!host)return;
  var griff=host.id==='emGriffPublic',nav=host.querySelector(griff?'.gp-tabs':'.ep-reference-nav');
  if(!nav||nav.dataset.fourTabs)return;nav.dataset.fourTabs='true';
  var about=host.querySelector(griff?'.gp-content-grid':'.ep-reference-grid'),jobs=host.querySelector(griff?'.gp-vacancies':'.empresa-publica-vagas');
  var countNode=nav.querySelector('span'),count=countNode?countNode.textContent.trim():'';
  var reviews=document.createElement('section');reviews.className='em-company-tab-panel';reviews.innerHTML='<h2>Avaliações da empresa</h2><p>Avaliações ainda não disponíveis.</p>';
  var hires=document.createElement('section');hires.className='em-company-tab-panel';hires.innerHTML='<h2>Contratações</h2><p>Indicadores de contratações ainda não disponíveis.</p>';
  var salaries=document.createElement("section");salaries.className="em-company-tab-panel em-company-announced-pay";
  host.append(reviews,hires,salaries);
  var panels=[about,reviews,jobs,hires,salaries],labels=['Sobre a empresa','Avaliações','Vagas disponíveis','Contratações','Salários'];
  nav.replaceChildren();nav.setAttribute('role','tablist');
  function select(index){
   panels.forEach(function(panel,i){if(panel){panel.hidden=i!==index;panel.classList.add('em-company-switch-panel');}});
   Array.from(nav.children).forEach(function(button,i){button.classList.toggle('selected',i===index);button.setAttribute('aria-selected',String(i===index));button.setAttribute('aria-pressed',String(i===index));button.tabIndex=i===index?0:-1;});
  }
  labels.forEach(function(label,i){
   var button=document.createElement('button');button.type='button';button.id='emCompanyTab-'+i;button.setAttribute('role','tab');button.textContent=label;
   var panel=panels[i];if(panel){if(!panel.id)panel.id='emCompanyPanel-'+i;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',button.id);button.setAttribute('aria-controls',panel.id);}
   if(i===2&&count){var number=document.createElement('span');number.className='em-company-job-count';number.textContent=count;button.appendChild(number);}
   button.onclick=function(){select(i);};
   button.onkeydown=function(event){var next=event.key==='ArrowRight'?(i+1)%panels.length:event.key==='ArrowLeft'?(i+panels.length-1)%panels.length:event.key==='Home'?0:event.key==='End'?panels.length-1:null;if(next!=null){event.preventDefault();select(next);nav.children[next].focus();}};
   nav.appendChild(button);
  });select(0);
 }
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;configureTabs();});}
 function start(){
  var style=document.createElement('style');style.textContent=`
html body #pagina-empresa-publica .em-company-switch-panel[hidden]{display:none!important}
html body #pagina-empresa-publica .em-company-tab-panel{padding:26px;background:#fff;border:1px solid #dce5ef;border-radius:10px;margin:0 0 24px}
html body #pagina-empresa-publica .em-company-tab-panel h2{font-size:20px;color:#173b60;margin:0 0 12px}
html body #pagina-empresa-publica .em-company-tab-panel p{font-size:13px;line-height:1.6;color:#728397;margin:0}
html body #pagina-empresa-publica #emGriffPublic#emGriffPublic .gp-tabs[data-four-tabs] button,
html body #pagina-empresa-publica#pagina-empresa-publica .ep-reference-nav[data-four-tabs] button{flex:1 1 0!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;gap:6px!important;min-width:0!important;font-size:12px!important;min-height:74px!important}
html body #pagina-empresa-publica #emGriffPublic#emGriffPublic .gp-tabs[data-four-tabs] button.selected,
html body #pagina-empresa-publica .ep-reference-nav[data-four-tabs] button.selected{background:#eef6ff!important;border-bottom-color:#0875ee!important}
html body #pagina-empresa-publica .em-company-job-count{font-size:19px!important;color:#1768b4!important;line-height:1!important;order:-1;background:transparent!important;padding:0!important}
@media(max-width:560px){html body #pagina-empresa-publica .gp-tabs[data-four-tabs],html body #pagina-empresa-publica .ep-reference-nav[data-four-tabs]{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important}html body #pagina-empresa-publica .gp-tabs[data-four-tabs] button,html body #pagina-empresa-publica .ep-reference-nav[data-four-tabs] button{min-height:58px!important}}
`;document.head.appendChild(style);configureTabs();var page=document.getElementById('pagina-empresa-publica');if(page)new MutationObserver(schedule).observe(page,{childList:true,subtree:true});window.addEventListener('load',schedule);window.addEventListener('popstate',schedule);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

/* Company history sidebar: real available indicators, no example metrics. */
(function(){
'use strict';
var queued=false;
function node(tag,cls,text){var n=document.createElement(tag);n.className=cls||'';if(text!==undefined)n.textContent=text;return n;}
function configure(){
 var page=document.getElementById('pagina-empresa-publica');if(!page)return;
 var host=page.querySelector('#emGriffPublic')||page.querySelector('.empresa-publica');if(!host)return;
 var summary=host.querySelector('.gp-summary,.ep-reference-summary');if(!summary)return;
 var column=summary.parentElement;
 if(!column.classList.contains('em-company-sidebar')){
  column=node('div','em-company-sidebar');summary.before(column);column.appendChild(summary);
 }
 var card=column.querySelector('.em-company-history');if(card)return;
 card=node('section','em-company-history');card.setAttribute('aria-label','Histórico da empresa');
 card.appendChild(node('h2','','Histórico da empresa'));
 card.appendChild(node('p','em-history-label','Grau de engajamento'));
 var gauge=node('div','em-history-gauge');gauge.setAttribute('aria-hidden','true');
 [24,38,52,66,80].forEach(function(height){var bar=node('span');bar.style.height=height+'%';gauge.appendChild(bar);});card.appendChild(gauge);
 card.appendChild(node('p','em-history-status','Engajamento ainda não disponível'));
 card.appendChild(node('p','em-history-description','O indicador será exibido quando houver dados de atividade da empresa.'));
 var rows=node('dl','em-history-metrics');
 var count=host.querySelectorAll('.gp-job').length;
 if(!host.querySelector('.gp-vacancies')){
  var jobs=host.querySelector('.empresa-publica-vagas'),cards=jobs?jobs.querySelectorAll('.vaga-card'):[];count=cards.length?cards.length:null;
 }
 [['◷','Tempo no site','Não disponível'],['▣','Vagas disponíveis',count===null?'Não disponível':String(count)],['◎','Currículos visualizados','Não disponível']].forEach(function(row){
  var line=node('div'),term=node('dt'),icon=node('span','em-history-icon',row[0]);icon.setAttribute('aria-hidden','true');term.append(icon,node('span','',row[1]));line.append(term,node('dd','',row[2]));rows.appendChild(line);
 });
 card.appendChild(rows);column.prepend(card);
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;configure();});}
function start(){
 var style=node('style');style.textContent=`
html body #pagina-empresa-publica .em-company-sidebar{display:flex;flex-direction:column;gap:16px;min-width:0;align-self:start}
html body #pagina-empresa-publica .em-company-sidebar>.gp-summary,html body #pagina-empresa-publica .em-company-sidebar>.ep-reference-summary{width:100%;box-sizing:border-box}
html body #pagina-empresa-publica .em-company-history{background:#fff;border:1px solid #dce5ef;border-radius:12px;padding:22px;box-shadow:0 3px 12px #17324e06;box-sizing:border-box}
html body #pagina-empresa-publica .em-company-history h2{font:700 18px/1.4 Inter,Arial,sans-serif!important;color:#17324e!important;margin:0 0 16px!important;text-align:left!important}
html body #pagina-empresa-publica .em-history-label{font:600 12px/1.5 Inter,Arial,sans-serif;color:#526b87;margin:0 0 12px}
html body #pagina-empresa-publica .em-history-gauge{height:74px;display:flex;align-items:flex-end;gap:5px;margin-bottom:15px}
html body #pagina-empresa-publica .em-history-gauge span{flex:1;border-radius:4px;background:linear-gradient(130deg,#d9eaff,#abcdf6);clip-path:polygon(0 15%,100% 0,100% 100%,0 100%)}
html body #pagina-empresa-publica .em-history-status{font:700 13px/1.5 Inter,Arial,sans-serif;color:#1768b4;margin:0 0 5px}
html body #pagina-empresa-publica .em-history-description{font:400 12px/1.6 Inter,Arial,sans-serif;color:#728397;margin:0}
html body #pagina-empresa-publica .em-history-metrics{border-top:1px solid #e4ebf4;padding-top:15px;margin:17px 0 0}
html body #pagina-empresa-publica .em-history-metrics>div{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0}
html body #pagina-empresa-publica .em-history-metrics dt{display:flex;align-items:center;gap:8px;font:500 12px/1.5 Inter,Arial,sans-serif;color:#526b87}
html body #pagina-empresa-publica .em-history-metrics dd{font:600 12px/1.5 Inter,Arial,sans-serif;color:#17324e;margin:0;text-align:right}
html body #pagina-empresa-publica .em-history-icon{display:grid;place-items:center;flex:0 0 28px;width:28px;height:28px;background:#eef5fd;border-radius:50%;color:#42678f;font:18px Arial,sans-serif}
@media(max-width:760px){html body #pagina-empresa-publica .em-company-history{padding:20px}}
`;document.head.appendChild(style);configure();var page=document.getElementById('pagina-empresa-publica');if(page)new MutationObserver(schedule).observe(page,{childList:true,subtree:true});window.addEventListener('load',schedule);window.addEventListener('popstate',schedule);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

/* Public company vacancies: compact cards and local filters. */
(function(){
'use strict';
var queued=false;
function el(tag,cls,text){var n=document.createElement(tag);n.className=cls||'';if(text!==undefined)n.textContent=text;return n;}
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function date(v){var raw=v.dataPublicacao||v.publicadaEm||v.criado_em||v.created_at||'',m=String(raw).match(/^(\d{2})\/(\d{2})\/(\d{4})/);return (m?new Date(+m[3],+m[2]-1,+m[1]):new Date(raw)).getTime()||0;}
function setup(){
 var page=document.getElementById('pagina-empresa-publica');if(!page)return;
 var host=page.querySelector('#emGriffPublic')||page.querySelector('.empresa-publica');if(!host)return;
 var section=host.querySelector('.gp-vacancies,.empresa-publica-vagas');if(!section)return;
 var grid=section.querySelector('.gp-jobs')||section.querySelector('#empresaPublicaListaVagas');
 if(!grid){var first=section.querySelector('.vaga-card');if(first)grid=first.parentElement;}
 if(!grid||section.querySelector('.em-company-filters'))return;
 var cards=Array.from(grid.children).filter(function(c){return c.matches('.gp-job,.vaga-card');});
 var all=[];try{all=typeof todasAsVagasPublicas==='function'?todasAsVagasPublicas():[];}catch(e){}
 var entries=cards.map(function(card,index){
  var a=card.querySelector('a[href*="id="]'),id=card.dataset.vagaId||card.dataset.id;
  if(a){try{id=new URL(a.href,location.href).searchParams.get('id')||id;}catch(e){}}
  var v=all.find(function(x){return String(x.id)===String(id);})||{};
  var title=card.querySelector('h3,h2');if(title&&v.cargo||title&&v.titulo)title.textContent=v.cargo||v.titulo;
  if(card.classList.contains('gp-job')){
   var ps=card.querySelectorAll('p');if(ps[0])ps[0].classList.add('em-company-city');
   if(ps[1]){ps[1].className='em-company-tags';ps[1].replaceChildren();[v.modalidade,v.contrato].filter(Boolean).forEach(function(t){ps[1].appendChild(el('span','',t));});}
   var salary=el('p','em-company-salary','Salário: '+(v.salario?String(v.salario):'Não informado'));if(ps[0])ps[0].after(salary);else card.appendChild(salary);
  }
  card.classList.add('em-company-vacancy-card');
  return {card:card,v:v,index:index};
 });
 grid.classList.add('em-company-job-grid');
 var form=el('form','em-company-filters'),fields=el('div','em-company-filter-fields');
 var search=el('input');search.type='search';search.placeholder='Digite o cargo';
 function field(label,input){var wrap=el('label','em-company-filter-field');wrap.append(el('span','',label),input);fields.appendChild(wrap);}
 field('Buscar cargo',search);
 function select(label,key,placeholder){var select=el('select');var option=el('option','',placeholder);option.value='';select.appendChild(option);Array.from(new Set(entries.map(function(e){return e.v[key];}).filter(Boolean))).sort().forEach(function(value){var option=el('option','',value);option.value=value;select.appendChild(option);});field(label,select);return select;}
 var city=select('Cidade','cidade','Todas as cidades'),mode=select('Modalidade','modalidade','Todas'),contract=select('Tipo de contrato','contrato','Todos');
 var submit=el('button','em-company-filter-submit','Filtrar vagas');submit.type='submit';fields.appendChild(submit);
 var clear=el('button','em-company-filter-clear','Limpar filtros');clear.type='button';form.append(fields,clear);grid.before(form);
 var toolbar=el('div','em-company-result-toolbar'),count=el('p');count.setAttribute('role','status');count.setAttribute('aria-live','polite');
 var sortLabel=el('label','','Ordenar por: '),sort=el('select');[['new','Mais recentes'],['old','Mais antigas'],['title','Cargo A–Z']].forEach(function(r){var o=el('option','',r[1]);o.value=r[0];sort.appendChild(o);});sortLabel.appendChild(sort);toolbar.append(count,sortLabel);grid.before(toolbar);
 var empty=el('p','em-company-filter-empty','Nenhuma vaga encontrada para esses filtros.');empty.hidden=true;grid.after(empty);
 function apply(){
  var list=entries.slice().sort(function(a,b){return sort.value==='title'?String(a.v.cargo||a.v.titulo||a.card.textContent).localeCompare(String(b.v.cargo||b.v.titulo||b.card.textContent),'pt-BR'):sort.value==='old'?date(a.v)-date(b.v)||a.index-b.index:date(b.v)-date(a.v)||a.index-b.index;});
  var total=0;list.forEach(function(e){var yes=(!search.value||norm(e.v.cargo||e.v.titulo||e.card.textContent).includes(norm(search.value)))&&(!city.value||e.v.cidade===city.value)&&(!mode.value||e.v.modalidade===mode.value)&&(!contract.value||e.v.contrato===contract.value);e.card.hidden=!yes;if(yes)total++;grid.appendChild(e.card);});
  count.textContent=total+' '+(total===1?'vaga encontrada':'vagas encontradas');empty.hidden=total!==0;
 }
 form.onsubmit=function(event){event.preventDefault();apply();};clear.onclick=function(){form.reset();sort.value='new';apply();};sort.onchange=apply;apply();
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;setup();});}
function start(){
 var style=el('style');style.textContent=`
html body #pagina-empresa-publica .em-company-filters{background:white;border:1px solid #d1e2f5;border-radius:10px;padding:18px;margin:18px 0 16px}
html body #pagina-empresa-publica .em-company-filter-fields{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr auto;gap:12px;align-items:end}
html body #pagina-empresa-publica .em-company-filter-field{display:flex;flex-direction:column;gap:7px;min-width:0;font:600 12px Inter,Arial,sans-serif;color:#17324e}
html body #pagina-empresa-publica .em-company-filters input,html body #pagina-empresa-publica .em-company-filters select,html body #pagina-empresa-publica .em-company-result-toolbar select{box-sizing:border-box;width:100%;height:40px;border:1px solid #cbdcf0;border-radius:6px;background:#fff;padding:0 10px;color:#41556c;font:400 13px Inter,Arial,sans-serif}
html body #pagina-empresa-publica .em-company-filter-submit{height:40px;border:0;border-radius:6px;background:#0875ee;color:white;padding:0 18px;font:600 13px Inter,Arial,sans-serif;cursor:pointer}
html body #pagina-empresa-publica .em-company-filter-clear{display:block;margin:10px 0 0 auto;border:0;background:transparent;padding:0;color:#0875ee;font:400 12px Inter,Arial,sans-serif;text-decoration:underline;cursor:pointer}
html body #pagina-empresa-publica .em-company-result-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 14px;font:400 12px Inter,Arial,sans-serif;color:#526b87}
html body #pagina-empresa-publica .em-company-result-toolbar p{margin:0!important}
html body #pagina-empresa-publica .em-company-result-toolbar label{display:flex;align-items:center;gap:8px;white-space:nowrap}
html body #pagina-empresa-publica .em-company-result-toolbar select{width:150px;height:34px}
html body #pagina-empresa-publica .em-company-job-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important}
html body #pagina-empresa-publica .em-company-vacancy-card{padding:18px!important;min-height:0!important;border:1px solid #d1e2f5!important;border-radius:10px!important;background:#fff!important;position:relative;box-sizing:border-box}
html body #pagina-empresa-publica .em-company-vacancy-card[hidden],html body #pagina-empresa-publica .em-company-filter-empty[hidden]{display:none!important}
html body #pagina-empresa-publica .gp-job.em-company-vacancy-card h3{font:700 16px/1.4 Inter,Arial,sans-serif!important;text-transform:none!important;margin:0 0 9px!important;color:#17324e!important}
html body #pagina-empresa-publica .gp-job .em-company-city{font:400 12px/1.5 Inter,Arial,sans-serif!important;margin:0 0 7px!important;color:#526b87!important}
html body #pagina-empresa-publica .gp-job .em-company-salary{font:600 13px/1.5 Inter,Arial,sans-serif!important;color:#17324e!important;margin:0 0 10px!important}
html body #pagina-empresa-publica .gp-job .em-company-tags{display:flex;flex-wrap:wrap;gap:6px;margin:0 120px 0 0!important;min-height:32px;align-items:center}
html body #pagina-empresa-publica .em-company-tags span{background:#eef5ff;border-radius:20px;padding:5px 10px;color:#1768b4;font:400 11px Inter,Arial,sans-serif}
html body #pagina-empresa-publica .gp-job.em-company-vacancy-card>a{position:absolute;right:18px;bottom:18px;padding:9px 12px!important;border-radius:6px!important;background:#0875ee;color:#fff;font:600 12px Inter,Arial,sans-serif!important;text-decoration:none}
html body #pagina-empresa-publica .em-company-filter-empty{color:#526b87;font:400 13px/1.6 Inter,Arial,sans-serif;background:white;border:1px solid #dce5ef;padding:18px;border-radius:8px}
@media(max-width:900px){html body #pagina-empresa-publica .em-company-filter-fields{grid-template-columns:repeat(2,minmax(0,1fr))}html body #pagina-empresa-publica .em-company-filter-submit{grid-column:1/-1}}
@media(max-width:600px){html body #pagina-empresa-publica .em-company-job-grid{grid-template-columns:1fr!important}html body #pagina-empresa-publica .em-company-result-toolbar{align-items:flex-start;flex-direction:column}html body #pagina-empresa-publica .em-company-filter-fields{grid-template-columns:1fr}}
`;document.head.appendChild(style);setup();var page=document.getElementById('pagina-empresa-publica');if(page)new MutationObserver(schedule).observe(page,{childList:true,subtree:true});window.addEventListener('load',schedule);window.addEventListener('popstate',schedule);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

/* Verified interview experience reviews. */
(function(){
'use strict';
var queued=false;
var BASE='https://mkezlcewyengejdmtppl.supabase.co',KEY='sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR';
var questions=[['comunicacao','Como foi a comunicação durante o processo seletivo?','Comunicação'],['clareza','As etapas e as orientações da entrevista foram claras?','Clareza das etapas'],['organizacao','Como foi a organização e o cumprimento dos horários?','Organização'],['respeito','Você foi tratado com respeito durante a entrevista?','Respeito'],['feedback','Como foi o retorno sobre o andamento ou resultado do processo?','Retorno do processo']];
function el(tag,cls,text){var n=document.createElement(tag);n.className=cls||'';if(text!==undefined)n.textContent=text;return n;}
async function rpc(name,body,secure){
 var token=sessionStorage.getItem('empregaMaisSupabaseAccessToken');if(secure&&!token)throw Error('Entre na sua conta de candidato para verificar sua entrevista.');
 var ctrl=new AbortController(),timer=setTimeout(function(){ctrl.abort();},12000);
 try{var r=await fetch(BASE+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+(secure?token:KEY),'Content-Type':'application/json'},body:JSON.stringify(body),signal:ctrl.signal});var data=await r.json().catch(function(){return null;});if(!r.ok){var message=data&&data.message||'';if(/exceed_egress_quota|restricted|spend caps/i.test(message))throw Error('Avaliações temporariamente indisponíveis. O serviço de dados do site atingiu o limite de uso. Tente novamente após a normalização.');throw Error(r.status===401?'Sua sessão expirou. Entre novamente.':'Não foi possível acessar as avaliações agora. Tente novamente mais tarde.');}return data;}catch(e){if(e.name==='AbortError')throw Error('A conexão demorou. Tente novamente.');throw e;}finally{clearTimeout(timer);}
}
function company(host){
 if(host.id==='emGriffPublic')return {cnpj:'66909443000108',nome:(host.querySelector('.gp-name h1')||{}).textContent||'esta empresa'};
 var q=new URLSearchParams(location.search),name=(document.getElementById('empresaPublicaNome')||{}).textContent||'',list=[];try{list=window.emLinkEmpresa?window.emLinkEmpresa.catalogo():typeof empresasCadastradas==='function'?empresasCadastradas():[];}catch(e){}
 return list.find(function(e){return (q.get('cnpj')&&String(e.cnpj).replace(/\D/g,'')===q.get('cnpj').replace(/\D/g,''))||(q.get('empresa')&&e.linkEmpresaSlug===q.get('empresa'))||[e.nome,e.nomeFantasia,e.nome_fantasia].includes(name);})||{cnpj:q.get('cnpj')||'',nome:name};
}
function setup(){
 var page=document.getElementById('pagina-empresa-publica');if(!page)return;var host=page.querySelector('#emGriffPublic')||page.querySelector('.empresa-publica');if(!host)return;
 var panel=host.querySelector('#emCompanyPanel-1');if(!panel||panel.dataset.processReviews)return;panel.dataset.processReviews='1';
 var companyData=company(host),cnpj=String(companyData.cnpj||'').replace(/\D/g,'');
 panel.replaceChildren();panel.classList.add('em-process-reviews');
 panel.appendChild(el('h2','','Avaliações do processo seletivo'));
 panel.appendChild(el('p','em-review-intro','Experiências de candidatos que participaram de entrevistas concluídas registradas no portal.'));
 var summary=el('div','em-review-summary'),summaryStatus=el('p','','Carregando avaliações…');summary.appendChild(summaryStatus);panel.appendChild(summary);
 async function loadSummary(){summaryStatus.textContent='Carregando avaliações…';try{var data=await rpc('em_process_review_summary',{p_cnpj:cnpj},false);if(!panel.isConnected)return;summary.replaceChildren();if(!data||!data.total){summary.appendChild(el('p','','Ainda não há avaliações verificadas deste processo seletivo.'));return;}var overall=el('div','em-review-overall');overall.append(el('strong','',Number(data.nota).toLocaleString('pt-BR',{maximumFractionDigits:1})),el('span','em-review-stars','★★★★★'),el('span','',data.total+' '+(data.total===1?'avaliação verificada':'avaliações verificadas')));summary.appendChild(overall);var metrics=el('div','em-review-score-grid');questions.forEach(function(q){var row=el('div');row.append(el('strong','',data[q[0]]==null?'—':Number(data[q[0]]).toLocaleString('pt-BR',{maximumFractionDigits:1})),el('span','',q[2]));metrics.appendChild(row);});summary.appendChild(metrics);}catch(e){summaryStatus.textContent=e.message;var retry=el('button','em-review-button','Tentar novamente');retry.type='button';retry.onclick=function(){retry.remove();loadSummary();};summary.appendChild(retry);}}
 var prompt=el('div','em-review-invite');prompt.appendChild(el('h3','','Você participou de uma entrevista nesta empresa?'));prompt.appendChild(el('p','','Avalie sua experiência no processo seletivo.'));
 var stars=el('span','em-review-stars','☆☆☆☆☆');stars.setAttribute('aria-hidden','true');prompt.appendChild(stars);
 var button=el('button','em-review-button','Avaliar entrevista');button.type='button';prompt.appendChild(button);prompt.appendChild(el('p','em-review-rule','Somente participantes de entrevistas concluídas podem avaliar. Uma avaliação por entrevista.'));
 var status=el('p','em-review-status');status.setAttribute('role','status');prompt.appendChild(status);panel.appendChild(prompt);
 var form=el('form','em-review-form');form.hidden=true;
 var interviewLabel=el('label','','Entrevista realizada'),interview=el('select');interview.required=true;interviewLabel.appendChild(interview);form.appendChild(interviewLabel);
 questions.forEach(function(q){var label=el('label','',q[1]),select=el('select');select.name=q[0];select.required=q[0]!=='feedback';[['','Selecione uma nota'],['1','1 — Muito ruim'],['2','2 — Ruim'],['3','3 — Regular'],['4','4 — Bom'],['5','5 — Excelente']].forEach(function(r){var o=el('option','',r[1]);o.value=r[0];select.appendChild(o);});if(q[0]==='feedback'){var o=el('option','','Ainda não recebi retorno / Não se aplica');o.value='';select.appendChild(o);}label.appendChild(select);form.appendChild(label);});
 form.appendChild(el('p','em-review-rule','As perguntas tratam apenas do processo seletivo. Não avaliam salário, benefícios, rotina de trabalho ou desempenho da empresa.'));
 var submit=el('button','em-review-button','Enviar avaliação');submit.type='submit';form.appendChild(submit);prompt.appendChild(form);
 button.onclick=async function(){button.disabled=true;status.textContent='Verificando participação…';try{var list=await rpc('em_process_review_options',{p_cnpj:cnpj},true);if(!panel.isConnected)return;interview.replaceChildren();if(!list||!list.length){form.hidden=true;status.textContent='Não encontramos entrevistas concluídas pendentes de avaliação nesta empresa. A empresa precisa registrar a conclusão da entrevista.';return;}list.forEach(function(i){var o=el('option','',(i.job_title||'Entrevista')+' — '+new Date(i.scheduled_at).toLocaleDateString('pt-BR'));o.value=i.id;interview.appendChild(o);});form.hidden=false;status.textContent='Participação verificada. Avalie sua experiência abaixo.';}catch(e){form.hidden=true;status.textContent=e.message;}finally{button.disabled=false;}};
 form.onsubmit=async function(event){event.preventDefault();if(submit.disabled)return;submit.disabled=true;status.textContent='Enviando avaliação…';try{var scores={};questions.forEach(function(q){var value=form.elements[q[0]].value;scores[q[0]]=value?Number(value):null;});await rpc('em_submit_process_review',{p_interview:interview.value,p_scores:scores},true);form.hidden=true;form.reset();status.textContent='Avaliação enviada. Obrigado por compartilhar sua experiência.';loadSummary();}catch(e){status.textContent=e.message;}finally{submit.disabled=false;}};
 loadSummary();
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;setup();});}
function start(){
 var style=el('style');style.textContent=`
html body #pagina-empresa-publica .em-process-reviews{padding:24px!important}
html body #pagina-empresa-publica .em-review-intro{margin-bottom:20px!important}
html body #pagina-empresa-publica .em-review-summary{padding:18px 0;border-bottom:1px solid #e4ebf4;margin-bottom:22px}
html body #pagina-empresa-publica .em-review-overall{display:flex;align-items:center;flex-wrap:wrap;gap:12px}
html body #pagina-empresa-publica .em-review-overall>strong{font:700 32px Inter,Arial,sans-serif;color:#17324e}
html body #pagina-empresa-publica .em-review-overall>span:last-child{font:400 12px Inter,Arial,sans-serif;color:#728397}
html body #pagina-empresa-publica .em-review-stars{font:28px/1.4 Arial,sans-serif;color:#e7a800;letter-spacing:3px}
html body #pagina-empresa-publica .em-review-score-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;margin-top:22px}
html body #pagina-empresa-publica .em-review-score-grid>div{display:flex;flex-direction:column;gap:5px}
html body #pagina-empresa-publica .em-review-score-grid strong{font:700 20px Inter,Arial,sans-serif;color:#1768b4}
html body #pagina-empresa-publica .em-review-score-grid span{font:400 12px Inter,Arial,sans-serif;color:#526b87}
html body #pagina-empresa-publica .em-review-invite{background:#f3f8ff;border:1px solid #d1e2f5;border-radius:10px;padding:22px}
html body #pagina-empresa-publica .em-review-invite h3{font:700 17px/1.5 Inter,Arial,sans-serif!important;color:#17324e!important;margin:0 0 7px!important}
html body #pagina-empresa-publica .em-review-invite>.em-review-stars{display:block;margin:12px 0}
html body #pagina-empresa-publica .em-review-button{background:#0875ee;color:white;border:0;border-radius:6px;font:600 13px Inter,Arial,sans-serif;padding:11px 18px;cursor:pointer}
html body #pagina-empresa-publica .em-review-button:disabled{opacity:.6;cursor:wait}
html body #pagina-empresa-publica .em-review-rule{font-size:12px!important;line-height:1.6!important;margin:12px 0!important}
html body #pagina-empresa-publica .em-review-status{margin:12px 0!important;color:#17324e!important}
html body #pagina-empresa-publica .em-review-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:18px;border-top:1px solid #d1e2f5;padding-top:18px}
html body #pagina-empresa-publica .em-review-form[hidden]{display:none!important}
html body #pagina-empresa-publica .em-review-form label{display:flex;flex-direction:column;gap:8px;font:600 12px/1.5 Inter,Arial,sans-serif;color:#17324e}
html body #pagina-empresa-publica .em-review-form select{width:100%;min-height:40px;border:1px solid #cbdcf0;border-radius:6px;padding:8px;background:white;color:#41556c;font:400 13px Inter,Arial,sans-serif}
html body #pagina-empresa-publica .em-review-form>label:first-child,html body #pagina-empresa-publica .em-review-form>.em-review-rule{grid-column:1/-1}
html body #pagina-empresa-publica .em-review-form>.em-review-button{justify-self:start}
@media(max-width:600px){html body #pagina-empresa-publica .em-review-form{grid-template-columns:1fr}html body #pagina-empresa-publica .em-review-score-grid{grid-template-columns:repeat(2,minmax(0,1fr))}html body #pagina-empresa-publica .em-review-invite{padding:16px}}
`;document.head.appendChild(style);setup();var page=document.getElementById('pagina-empresa-publica');if(page)new MutationObserver(schedule).observe(page,{childList:true,subtree:true});window.addEventListener('load',schedule);window.addEventListener('popstate',schedule);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

/* Confirmed hires: public aggregates and candidate confirmation. */
(function(){
'use strict';
var queued=false,BASE='https://mkezlcewyengejdmtppl.supabase.co',KEY='sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR';
function el(t,c,s){var n=document.createElement(t);n.className=c||'';if(s!==undefined)n.textContent=s;return n;}
async function rpc(name,body,secure){var token=sessionStorage.getItem('empregaMaisSupabaseAccessToken');if(secure&&!token)throw Error('Entre na sua conta de candidato.');var ctrl=new AbortController(),timer=setTimeout(function(){ctrl.abort();},12000);try{var r=await fetch(BASE+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:KEY,Authorization:'Bearer '+(secure?token:KEY),'Content-Type':'application/json'},body:JSON.stringify(body||{}),signal:ctrl.signal});var data=await r.json().catch(function(){return null;});if(!r.ok)throw Error(/exceed_egress_quota|restricted|spend caps/i.test(data&&data.message||'')?'Indicadores temporariamente indisponíveis. O serviço de dados atingiu o limite de uso.':r.status===401?'Sua sessão expirou. Entre novamente.':'Não foi possível acessar os dados agora. Tente novamente.');return data;}catch(e){if(e.name==='AbortError')throw Error('A conexão demorou. Tente novamente.');throw e;}finally{clearTimeout(timer);}}
function companyCnpj(host){if(host.id==='emGriffPublic')return '66909443000108';var q=new URLSearchParams(location.search);if(q.get('cnpj'))return q.get('cnpj');var name=(document.getElementById('empresaPublicaNome')||{}).textContent,list=[];try{list=window.emLinkEmpresa?window.emLinkEmpresa.catalogo():typeof empresasCadastradas==='function'?empresasCadastradas():[];}catch(e){}var company=list.find(function(e){return q.get('empresa')&&e.linkEmpresaSlug===q.get('empresa')||[e.nome,e.nomeFantasia,e.nome_fantasia].includes(name);});return company&&company.cnpj||'';}
function setupPublic(){
 var page=document.getElementById('pagina-empresa-publica');if(!page)return;var host=page.querySelector('#emGriffPublic')||page.querySelector('.empresa-publica');if(!host)return;var panel=host.querySelector('#emCompanyPanel-3');if(!panel||panel.dataset.hiringDashboard)return;panel.dataset.hiringDashboard='1';panel.classList.add('em-hiring-dashboard');panel.replaceChildren();
 panel.append(el('h2','','Contratações'),el('p','em-hiring-subtitle','Resultados confirmados de processos seletivos realizados pelo portal.'));
 var metrics=el('div','em-hiring-metrics'),values=[];
 [['Contratações confirmadas','Desde o início no portal'],['Nos últimos 90 dias','Confirmadas pela empresa e pelo candidato'],['Última contratação','Confirmação registrada no portal']].forEach(function(row){var card=el('div','em-hiring-card'),value=el('strong','','—');values.push(value);card.append(el('span','',row[0]),value,el('small','',row[1]));metrics.appendChild(card);});panel.appendChild(metrics);
 var layout=el('div','em-hiring-layout'),chartCard=el('section','em-hiring-card'),areasCard=el('section','em-hiring-card');chartCard.appendChild(el('h3','','Contratações por mês'));areasCard.appendChild(el('h3','','Áreas mais contratadas'));var chart=el('div','em-hiring-chart'),areas=el('div','em-hiring-areas');chartCard.appendChild(chart);areasCard.appendChild(areas);layout.append(chartCard,areasCard);panel.appendChild(layout);
 var status=el('p','em-hiring-status','Carregando indicadores…');status.setAttribute('role','status');panel.appendChild(status);
 panel.appendChild(el('p','em-hiring-note','Exibimos apenas contratações confirmadas pela empresa e pelo candidato. Os dados pessoais não são publicados.'));
 var refresh=el('button','em-review-button','Atualizar indicadores');refresh.type='button';panel.appendChild(refresh);
 async function load(){refresh.disabled=true;status.textContent='Carregando indicadores…';try{var data=await rpc('em_hiring_summary',{p_cnpj:companyCnpj(host)},false);if(!panel.isConnected)return;values[0].textContent=data.total;values[1].textContent=data.recent;values[2].textContent=data.last?new Date(data.last).toLocaleDateString('pt-BR',{month:'long',year:'numeric',timeZone:'America/Sao_Paulo'}):'—';chart.replaceChildren();areas.replaceChildren();var max=Math.max.apply(null,data.months.map(function(m){return m.total;}).concat([1]));data.months.forEach(function(m){var col=el('div','em-hiring-month'),value=el('span','',String(m.total)),bar=el('div','em-hiring-bar');bar.style.height=(m.total/max*125)+'px';var date=new Date(m.month+'-15T12:00:00Z'),label=el('span','',date.toLocaleDateString('pt-BR',{month:'short',year:'2-digit',timeZone:'America/Sao_Paulo'}));col.append(value,bar,label);chart.appendChild(col);});if(!data.areas.length)areas.appendChild(el('p','','Ainda não há áreas com contratações confirmadas.'));data.areas.forEach(function(a){var row=el('div','em-hiring-area'),line=el('div'),track=el('div','em-hiring-track'),fill=el('span');fill.style.width=(100*a.total/Math.max(1,data.total))+'%';track.appendChild(fill);line.append(el('span','',a.area),el('strong','',String(a.total)));row.append(line,track);areas.appendChild(row);});status.textContent=data.total?'Indicadores atualizados.':'Ainda não há contratações confirmadas pelo portal.';}catch(e){values.forEach(function(v){v.textContent='—';});chart.replaceChildren();areas.replaceChildren();chart.appendChild(el('p','','Gráfico indisponível no momento.'));areas.appendChild(el('p','','Dados indisponíveis no momento.'));status.textContent=e.message;}finally{refresh.disabled=false;}}
 refresh.onclick=load;load();
}
function setupCandidate(){
 ['pagina-painel-candidato','pagina-candidaturas'].forEach(function(id){var page=document.getElementById(id);if(!page||!page.classList.contains('ativa')||page.querySelector('.em-hire-confirmations'))return;var box=el('section','em-hire-confirmations');box.appendChild(el('h2','','Confirmações de contratação'));box.appendChild(el('p','','Confirme apenas contratações que realmente aconteceram. Sua resposta alimenta os indicadores públicos sem divulgar seus dados.'));var status=el('p');status.setAttribute('role','status');var list=el('div'),refresh=el('button','em-review-button','Verificar contratações');refresh.type='button';box.append(status,list,refresh);page.prepend(box);
 async function load(){refresh.disabled=true;status.textContent='Verificando…';try{var rows=await rpc('em_pending_hires',{},true);list.replaceChildren();status.textContent=rows.length?'Você tem contratações para confirmar.':'Nenhuma contratação pendente de confirmação.';rows.forEach(function(row){var card=el('article','em-hire-confirm-card');card.append(el('strong','',row.cargo),el('p','',row.empresa));[['Sim, fui contratado',true],['Não fui contratado',false]].forEach(function(answer){var b=el('button','em-review-button',answer[0]);b.type='button';b.onclick=async function(){card.querySelectorAll('button').forEach(function(x){x.disabled=true;});try{await rpc('em_confirm_hire',{p_application:row.id,p_confirm:answer[1]},true);await load();}catch(e){status.textContent=e.message;card.querySelectorAll('button').forEach(function(x){x.disabled=false;});}};card.appendChild(b);});list.appendChild(card);});}catch(e){status.textContent=e.message;}finally{refresh.disabled=false;}}
 refresh.onclick=load;
 });
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;setupPublic();setupCandidate();});}
function start(){var style=el('style');style.textContent=`
html body #pagina-empresa-publica .em-hiring-dashboard{background:transparent!important;border:0!important;padding:0!important}
html body #pagina-empresa-publica .em-hiring-dashboard>h2{font-size:24px!important;margin-bottom:8px!important}
html body #pagina-empresa-publica .em-hiring-subtitle{margin-bottom:20px!important}
.em-hiring-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:20px 0}
.em-hiring-card{background:white;border:1px solid #d1e2f5;border-radius:10px;padding:22px;min-width:0;box-sizing:border-box}
.em-hiring-metrics .em-hiring-card{display:flex;flex-direction:column;gap:10px}
.em-hiring-metrics span{font:600 13px Inter,Arial,sans-serif;color:#17324e}
.em-hiring-metrics strong{font:700 28px/1.3 Inter,Arial,sans-serif;color:#0875ee;overflow-wrap:anywhere}
.em-hiring-metrics small{font:400 12px/1.5 Inter,Arial,sans-serif;color:#728397}
.em-hiring-layout{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:18px}
html body #pagina-empresa-publica .em-hiring-card h3{font:700 17px Inter,Arial,sans-serif!important;margin:0 0 22px!important;color:#17324e!important}
.em-hiring-chart{display:flex;align-items:flex-end;gap:14px;min-height:180px;border-bottom:1px solid #d1e2f5;padding:0 8px}
.em-hiring-month{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:8px;min-width:0;font:500 11px Inter,Arial,sans-serif;color:#526b87}
.em-hiring-bar{width:70%;min-height:2px;background:linear-gradient(#0875ee,#168fff);border-radius:3px 3px 0 0}
.em-hiring-month>span:first-child{color:#17324e;font-weight:700}
.em-hiring-month>span:last-child{padding-bottom:9px;text-align:center}
.em-hiring-area{margin-bottom:20px}
.em-hiring-area>div:first-child{display:flex;justify-content:space-between;gap:12px;font:500 13px Inter,Arial,sans-serif;color:#17324e}
.em-hiring-track{height:7px;border-radius:8px;background:#e6edf5;margin-top:10px;overflow:hidden}
.em-hiring-track span{display:block;height:100%;background:#0875ee;border-radius:8px}
html body #pagina-empresa-publica .em-hiring-note{padding:15px 18px;background:#eaf4ff;border:1px solid #d1e2f5;border-radius:8px;margin:20px 0 14px!important;color:#42678f!important}
html body #pagina-empresa-publica .em-hiring-status{margin:16px 0!important}
.em-hire-confirmations{margin:18px 0;padding:22px;border:1px solid #d1e2f5;border-radius:10px;background:white;color:#17324e}
.em-hire-confirmations h2{font-size:18px}.em-hire-confirmations p{font-size:13px;line-height:1.6}
.em-hire-confirm-card{border-top:1px solid #e4ebf4;padding:16px 0}.em-hire-confirm-card button{margin-right:10px;margin-bottom:8px}
@media(max-width:760px){.em-hiring-metrics,.em-hiring-layout{grid-template-columns:1fr}.em-hiring-card{padding:18px}.em-hiring-chart{gap:7px}}
`;document.head.appendChild(style);setupPublic();setupCandidate();new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});window.addEventListener('load',schedule);window.addEventListener('popstate',schedule);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

/* Salaries are the company's published offers, never employee reports or estimates. */
(function(){
'use strict';
var queued=false;
function el(tag,cls,text){var n=document.createElement(tag);n.className=cls||'';if(text!==undefined)n.textContent=text;return n;}
function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
function setup(){
 var page=document.getElementById('pagina-empresa-publica');if(!page)return;
 var host=page.querySelector('#emGriffPublic')||page.querySelector('.empresa-publica');if(!host)return;
 var panel=host.querySelector('.em-company-announced-pay'),jobs=host.querySelector('.gp-vacancies,.empresa-publica-vagas');if(!panel||!jobs)return;
 var all=[];try{all=typeof todasAsVagasPublicas==='function'?todasAsVagasPublicas():[];}catch(e){}
 var ids=Array.from(jobs.querySelectorAll('.gp-job,.vaga-card')).map(function(card){var a=card.querySelector('a[href*="id="]');try{return a?new URL(a.href,location.href).searchParams.get('id'):card.dataset.vagaId||card.dataset.id;}catch(e){return null;}}).filter(Boolean);
 function amount(value){
  var raw=String(value==null?'':value).trim();if(!raw||/(combinar|não informado|nao informado|a definir|hora|di[aá]ria|seman|anual|ano)/i.test(raw))return null;
  var base=raw.split(/\+|comiss[aã]o|benef[ií]cios/i)[0].trim();var matches=base.match(/\d[\d.,]*/g)||[];if(matches.length!==1||/a partir|at[eé]|entre/i.test(base))return null;
  var n=matches[0];if(n.includes(','))n=n.replace(/\./g,'').replace(',','.');else if(/^\d{1,3}(\.\d{3})+$/.test(n))n=n.replace(/\./g,'');var result=Number(n);return Number.isFinite(result)&&result>0?result:null;
 }
 function area(v){return String(v.area||v.areaProfissional||v.categoria||v.setor||'Área não informada').trim();}
 var entries=all.filter(function(v){return ids.includes(String(v.id))&&!['true','1','sim'].includes(String(v.confidencial).toLowerCase())&&amount(v.salario)!==null;});
 var signature=JSON.stringify(entries.map(function(v){return [v.id,area(v),v.salario,v.cidade,v.uf,v.estado];}));if(panel.dataset.paySignature===signature)return;panel.dataset.paySignature=signature;
 panel.replaceChildren();
 var header=el('div','em-pay-header'),intro=el('div');intro.append(el('h2','','Salários anunciados por área'),el('p','em-pay-subtitle','Médias dos salários fixos publicados por esta empresa.'));
 var help=el('details','em-pay-help'),toggle=el('summary','','Como calculamos');help.append(toggle,el('p','em-pay-note','Cada vaga conta uma vez. Comissões, benefícios, faixas salariais e valores a combinar não entram na média. Áreas com uma única vaga mostram apenas o valor desse anúncio.'));header.append(intro,help);panel.appendChild(header);
 if(!entries.length){panel.appendChild(el('p','em-pay-empty','Esta empresa ainda não possui vagas ativas com salário fixo informado para calcular a média por área.'));return;}
 var count=el('p','em-pay-count');count.setAttribute('role','status');count.setAttribute('aria-live','polite');panel.appendChild(count);
 var wrap=el('div','em-pay-table-wrap'),table=el('table','em-pay-table'),caption=el('caption','','Médias dos salários anunciados por área profissional');table.appendChild(caption);
 var head=el('thead'),hr=el('tr');['Área profissional','Média mensal','Faixa anunciada','Vagas no cálculo'].forEach(function(title){var th=el('th','',title);th.scope='col';hr.appendChild(th);});head.appendChild(hr);table.appendChild(head);var body=el('tbody');table.appendChild(body);wrap.appendChild(table);panel.appendChild(wrap);
 var empty=el('p','em-pay-empty','Nenhuma média salarial disponível.');empty.hidden=true;panel.appendChild(empty);
 function money(n){return n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
 function render(){var selected=entries,groups=new Map();selected.forEach(function(v){var key=norm(area(v)),g=groups.get(key)||{label:area(v),values:[]};g.values.push(amount(v.salario));groups.set(key,g);});var rows=Array.from(groups.values()).sort(function(a,b){return a.label.localeCompare(b.label,'pt-BR');});body.replaceChildren();rows.forEach(function(g){var values=g.values,row=el('tr'),mean=values.reduce(function(a,b){return a+b;},0)/values.length;var total=el('td','em-pay-total');total.appendChild(el('span','em-pay-badge',values.length+' '+(values.length===1?'vaga':'vagas')));if(values.length===1)total.appendChild(el('span','em-pay-unique','Valor único'));
 row.append(el('td','',g.label),el('td','em-pay-value',money(mean)),el('td','em-pay-range',values.length===1?money(values[0]):money(Math.min.apply(null,values))+' – '+money(Math.max.apply(null,values))),total);
 Array.from(row.children).forEach(function(cell,i){cell.dataset.label=['Área profissional','Média mensal','Faixa anunciada','Vagas no cálculo'][i];});body.appendChild(row);});count.replaceChildren(el('span','',rows.length+' '+(rows.length===1?'área profissional':'áreas profissionais')),el('span','',selected.length+' '+(selected.length===1?'vaga no cálculo':'vagas no cálculo')));empty.hidden=rows.length>0;wrap.hidden=!rows.length;}
 panel.appendChild(el('p','em-pay-footer','Valores referentes às vagas ativas. Comissões e benefícios não entram no cálculo.'));
 render();
}
function schedule(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;setup();});}
function start(){var style=el('style');style.textContent=`

#pagina-empresa-publica .em-pay-header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:22px}
#pagina-empresa-publica .em-pay-header h2{font:700 26px/1.25 Inter,Arial,sans-serif!important;color:#17324e!important;margin:0 0 8px!important}
#pagina-empresa-publica .em-pay-subtitle{font:400 15px/1.6 Inter,Arial,sans-serif!important;color:#627b98!important;margin:0!important}
.em-pay-help{flex:0 0 auto;max-width:280px}.em-pay-help summary{cursor:pointer;border:1px solid #bdd3ee;border-radius:8px;padding:11px 16px;color:#0968d5;font:600 14px/1.4 Inter,Arial,sans-serif;background:#fff}
.em-pay-help summary:focus-visible{outline:3px solid #92c5ff;outline-offset:3px}
#pagina-empresa-publica .em-company-announced-pay .em-pay-note{margin:12px 0 0!important;padding:14px;background:#eef6ff;border-radius:8px;color:#42678f;font-size:13px!important;line-height:1.6!important}
#pagina-empresa-publica .em-pay-count{display:flex;flex-wrap:wrap;gap:12px 24px;margin:0 0 22px!important;color:#42678f;font:600 15px/1.5 Inter,Arial,sans-serif!important}
.em-pay-count span+span{border-left:1px solid #d1e2f5;padding-left:24px}
.em-pay-table-wrap{overflow-x:auto}.em-pay-table{width:100%;border-collapse:collapse;text-align:left;font:400 15px/1.5 Inter,Arial,sans-serif;color:#526b87}
.em-pay-table caption{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
.em-pay-table th{background:#eff6fe;color:#294f78;font-weight:700;font-size:14px}.em-pay-table td,.em-pay-table th{padding:18px 14px;border-bottom:1px solid #e4ebf4;vertical-align:middle}.em-pay-table td:first-child{font-weight:600;color:#173b60;overflow-wrap:anywhere}.em-pay-table .em-pay-value{font-weight:700;font-size:19px;color:#0865d6;white-space:nowrap}.em-pay-badge{display:inline-block;white-space:nowrap;padding:5px 12px;border-radius:20px;background:#eef6ff;color:#0968d5;font-size:13px;font-weight:600}.em-pay-unique{display:block;color:#728397;font-size:12px;margin-top:5px}
#pagina-empresa-publica .em-pay-footer{margin:18px 0 0!important;font:400 13px/1.6 Inter,Arial,sans-serif!important;color:#627b98!important}
#pagina-empresa-publica .em-pay-empty{padding:25px 0!important}.em-pay-table-wrap[hidden],.em-pay-empty[hidden]{display:none!important}
@media(max-width:700px){#pagina-empresa-publica .em-pay-header{flex-direction:column;gap:14px}#pagina-empresa-publica .em-pay-header h2{font-size:22px!important}.em-pay-help{max-width:100%;width:100%}.em-pay-count span+span{border:0;padding:0}.em-pay-table-wrap{overflow:visible}.em-pay-table,.em-pay-table tbody{display:block;width:100%;min-width:0}.em-pay-table thead{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}.em-pay-table tr{display:block;border:1px solid #d1e2f5;border-radius:10px;margin-bottom:12px;padding:14px;background:#fff}.em-pay-table td{display:flex;justify-content:space-between;align-items:baseline;gap:14px;padding:8px 0;border:0;text-align:right}.em-pay-table td:first-child{display:block;text-align:left;font-size:16px;padding:0 0 12px;border-bottom:1px solid #e4ebf4;margin-bottom:6px}.em-pay-table td:not(:first-child):before{content:attr(data-label);font:500 12px/1.5 Inter,Arial,sans-serif;color:#627b98;text-align:left;flex:0 0 95px}.em-pay-table .em-pay-value{font-size:20px;white-space:normal}.em-pay-table .em-pay-total{flex-wrap:wrap}.em-pay-unique{margin:0;font-size:12px}}
`;document.head.appendChild(style);setup();var page=document.getElementById('pagina-empresa-publica');if(page)new MutationObserver(schedule).observe(page,{childList:true,subtree:true});window.addEventListener('load',schedule);window.addEventListener('popstate',schedule);window.addEventListener('storage',schedule);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
