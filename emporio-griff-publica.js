(function(){
'use strict';
var CNPJ='66909443000108';
function esc(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function company(){try{return typeof empresaPorCnpj==='function'&&empresaPorCnpj(CNPJ)||{};}catch(e){return {};}}
function jobs(){try{return (typeof todasAsVagasPublicas==='function'?todasAsVagasPublicas():[]).filter(function(v){var id=String(v.empresaCnpj||v.cnpj||'').replace(/\D/g,''),name=String(v.empresa||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();return !['true','1','sim'].includes(String(v.confidencial).toLowerCase())&&(id===CNPJ||(!id&&/^emporio griff(?: aliancas)?$/.test(name)));});}catch(e){return [];}}
function render(){
var page=document.getElementById('pagina-empresa-publica');if(!page)return;
var e=company(),list=jobs(),root=document.getElementById('emGriffPublic');if(!root){root=document.createElement('section');root.id='emGriffPublic';page.appendChild(root);}page.classList.add('em-griff-public');
root.innerHTML='<a href="?pagina=home">← Buscar vagas</a><div class="gp-hero"><span class="gp-verified">✓ Empresa verificada</span><h1>Empório Griff Alianças</h1><p>Conheça a empresa e acompanhe suas oportunidades no EmpregaMais.</p>'+(e.sobreInstitucional||e.sobre||e.descricao?'<p>'+esc(e.sobreInstitucional||e.sobre||e.descricao)+'</p>':'')+'<p><a href="https://www.emporiogriff.com.br/" target="_blank" rel="noopener noreferrer">Visitar site da empresa ↗</a></p></div><h2>Vagas disponíveis <small>('+list.length+')</small></h2><div class="gp-jobs">'+list.map(function(v){return '<article class="gp-job"><h3>'+esc(String(v.cargo||v.titulo||'Vaga').toUpperCase())+'</h3><p>'+esc([v.cidade,v.uf||v.estado].filter(Boolean).join(' · '))+'</p><p>'+esc([v.modalidade,v.contrato].filter(Boolean).join(' · '))+'</p><a href="?pagina=vaga&amp;id='+encodeURIComponent(v.id)+'">Ver vaga →</a></article>';}).join('')+'</div>'+(list.length?'':'<p>Nenhuma vaga aberta no momento. Volte em breve para consultar novas oportunidades.</p>');
if(typeof mostrarPagina==='function')mostrarPagina('empresa-publica');
}
window.emAbrirGriffPublica=function(){var u=new URL(location.href);u.search='';u.searchParams.set('pagina','empresa-publica');u.searchParams.set('cnpj',CNPJ);history.pushState({},'',u);render();window.scrollTo({top:0,behavior:'smooth'});};
function resolve(){var q=new URLSearchParams(location.search);if(q.get('pagina')==='empresa-publica'&&q.get('cnpj')===CNPJ)render();else{var p=document.getElementById('pagina-empresa-publica');if(p)p.classList.remove('em-griff-public');}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',resolve);else resolve();window.addEventListener('load',resolve);window.addEventListener('popstate',resolve);
})();
