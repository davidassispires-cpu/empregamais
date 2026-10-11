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
  host.append(reviews,hires);
  var panels=[about,reviews,jobs,hires],labels=['Sobre a empresa','Avaliações','Vagas disponíveis','Contratações'];
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
   button.onkeydown=function(event){var next=event.key==='ArrowRight'?(i+1)%4:event.key==='ArrowLeft'?(i+3)%4:event.key==='Home'?0:event.key==='End'?3:null;if(next!=null){event.preventDefault();select(next);nav.children[next].focus();}};
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
