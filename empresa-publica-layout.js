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
try{if(typeof saved==='string')saved=JSON.parse(saved);if(!Object.keys(saved).length){var extra=typeof e.comprovacaoVerificacao==='string'?JSON.parse(e.comprovacaoVerificacao||'{}'):e.comprovacaoVerificacao||{};saved=extra.perfilPublico||JSON.parse(localStorage.getItem('perfilPublicoEmpresaEmpregaMais_'+String(e.cnpj||'').replace(/\\D/g,''))||'{}')}}catch(err){saved={}}
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