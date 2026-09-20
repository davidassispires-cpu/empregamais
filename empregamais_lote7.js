/* EmpregaMais - JavaScript externo - lote 7 */

//
(function(){
function limparUrgenciaDaPontaV59(){
var corpo=document.getElementById("corpoTabelaPainelRefEM");
if(!corpo)return;
var cells=corpo.querySelectorAll("td:last-child");
for(var i=0;i<cells.length;i++){
var filhos=cells[i].children;
for(var j=filhos.length-1;j>=0;j--){
var el=filhos[j];
if(el.classList&&el.classList.contains("acao-menu-v54"))continue;
var cls=String(el.className||"").toLowerCase();
var txt=String(el.textContent||"").toLowerCase();
if(
cls.indexOf("urgente")>=0 ||
cls.indexOf("contratacao")>=0 ||
txt.indexOf("contrata")>=0 && txt.indexOf("urgente")>=0
){
el.style.display="none";
}
}
}
}
window.limparUrgenciaDaPontaV59=limparUrgenciaDaPontaV59;
window.addEventListener("load",function(){
setTimeout(limparUrgenciaDaPontaV59,150);
setTimeout(limparUrgenciaDaPontaV59,700);
});
var corpo=document.getElementById("corpoTabelaPainelRefEM");
if(corpo&&window.MutationObserver){
var timer=0;
new MutationObserver(function(){
clearTimeout(timer);
timer=setTimeout(limparUrgenciaDaPontaV59,40);
}).observe(corpo,{childList:true,subtree:true});
}
})();
//
;
//
(function(){
var timerV60=null;
var pausadoV60=false;
function listaV60(){return document.getElementById("listaDestaques");}
function prepararCabecalhoV60(){
var lista=listaV60();if(!lista)return;
var sec=lista.closest("section")||lista.parentElement;
if(!sec)return;
sec.id=sec.id||"secao-destaques";
if(sec.querySelector(".cabecalho-destaques-v60"))return;
var titulo=null,els=sec.querySelectorAll("h1,h2,h3");
for(var i=0;i<els.length;i++){
if(String(els[i].textContent||"").toLowerCase().indexOf("vagas em destaque")>=0){titulo=els[i];break;}
}
if(!titulo)return;
var p=titulo.nextElementSibling;
var wrap=document.createElement("div");wrap.className="cabecalho-destaques-v60";
var textos=document.createElement("div");
titulo.parentNode.insertBefore(wrap,titulo);
textos.appendChild(titulo);
if(p&&p.tagName&&p.tagName.toLowerCase()==="p")textos.appendChild(p);
wrap.appendChild(textos);
var b=document.createElement("button");b.type="button";b.className="ver-todos-destaques-v60";
b.innerHTML="Ver todas as vagas em destaque <svg viewBox='0 0 24 24'><path d='M5 12h14M13 6l6 6-6 6'/></svg>";
b.onclick=function(){abrirPaginaDestaquesV60();};
wrap.appendChild(b);
}
function iniciarCarrosselV60(){
var lista=listaV60();if(!lista)return;
lista.classList.add("carrossel-destaques-v60");
if(timerV60)clearInterval(timerV60);
timerV60=setInterval(function(){
if(!lista.isConnected){
 clearInterval(timerV60);
 timerV60=null;
 return;
}
var paginaDestaques=document.getElementById("pagina-destaques-v60");
var home=document.getElementById("pagina-home");
var visivel=(paginaDestaques&amp;&amp;paginaDestaques.classList.contains("ativa")) ||
            (home&amp;&amp;home.classList.contains("ativa")&amp;&amp;home.contains(lista));
if(!visivel||document.hidden||pausadoV60||lista.children.length&lt;2)return;
var primeiro=lista.querySelector(".vaga-card")||lista.firstElementChild;
if(!primeiro)return;
var passo=primeiro.getBoundingClientRect().width+16;
var limite=lista.scrollWidth-lista.clientWidth-8;
if(lista.scrollLeft>=limite){
lista.scrollTo({left:0,behavior:"smooth"});
}else{
lista.scrollBy({left:passo,behavior:"smooth"});
}
},3600);
lista.onmouseenter=function(){pausadoV60=true;};
lista.onmouseleave=function(){pausadoV60=false;};
lista.ontouchstart=function(){pausadoV60=true;};
lista.ontouchend=function(){setTimeout(function(){pausadoV60=false;},1800);};
}
function garantirPaginaV60(){
var p=document.getElementById("pagina-destaques-v60");if(p)return p;
p=document.createElement("main");p.id="pagina-destaques-v60";
p.innerHTML="<div class='pagina-destaques-inner-v60'>"+
"<button type='button' class='voltar-destaques-v60'>&amp;#8592; Voltar para vagas</button>"+
"<div class='hero-destaques-v60'><small>OPORTUNIDADES EM EVIDENCIA</small>"+
"<h1>Vagas em destaque</h1><p>Confira as oportunidades que estao em destaque no EmpregaMais.</p></div>"+
"<div class='grade-destaques-v60' id='gradeDestaquesV60'></div></div>";
var rodape=document.querySelector("footer");
if(rodape&&rodape.parentNode)rodape.parentNode.insertBefore(p,rodape);
else document.body.appendChild(p);
p.querySelector(".voltar-destaques-v60").onclick=function(){history.back();};
return p;
}
function vagasDestaqueV60(){
var a=[];
try{a=carregarVagasPortal()||[];}catch(e){}
return a.filter(function(v){
var d=v.destaque===true||String(v.destaque).toLowerCase()==="true";
var s=String(v.status||"").toLowerCase();
return d&&s!=="encerrada"&&s!=="excluida"&&s!=="cancelada";
});
}
function renderPaginaV60(){
var grade=document.getElementById("gradeDestaquesV60");if(!grade)return;
grade.innerHTML="";
var a=vagasDestaqueV60();
if(!a.length){
grade.innerHTML="<div class='vazio-destaques-v60'>Nenhuma vaga em destaque disponivel no momento.</div>";
return;
}
for(var i=0;i<a.length;i++){
try{grade.appendChild(criarCardVaga(a[i]));}catch(e){}
}
}
function esconderPaginasV60(){
if(typeof window.esconderPaginas==="function"){window.esconderPaginas();return;}
document.querySelectorAll(".pagina").forEach(function(el){el.classList.remove("ativa");});
}
window.abrirPaginaDestaquesV60=function(semHistorico){
var p=garantirPaginaV60();
esconderPaginasV60();
p.classList.add("ativa");
p.style.removeProperty("display");
renderPaginaV60();
if(!semHistorico){
try{history.pushState({pagina:"destaques-v60"},"","?pagina=vagas-em-destaque");}catch(e){}
}
window.scrollTo({top:0,behavior:"smooth"});
};
function rotaInicialV60(){
var q="";
try{q=new URLSearchParams(location.search).get("pagina")||"";}catch(e){}
if(q==="vagas-em-destaque")setTimeout(function(){abrirPaginaDestaquesV60(true);},80);
}
window.addEventListener("popstate",function(){
var q="";
try{q=new URLSearchParams(location.search).get("pagina")||"";}catch(e){}
if(q==="vagas-em-destaque"){abrirPaginaDestaquesV60(true);return;}
var p=document.getElementById("pagina-destaques-v60");
if(p){p.classList.remove("ativa");p.style.removeProperty("display");}
try{if(typeof irPara==="function")irPara(q||"inicio");}catch(e){location.reload();}
});
function aplicarV60(){
prepararCabecalhoV60();
iniciarCarrosselV60();
}
window.addEventListener("load",function(){
garantirPaginaV60();rotaInicialV60();
setTimeout(aplicarV60,250);setTimeout(aplicarV60,1100);
});
var lista=listaV60();
if(lista&&window.MutationObserver){
var tm=0;
new MutationObserver(function(){clearTimeout(tm);tm=setTimeout(aplicarV60,100);})
.observe(lista,{childList:true});
}
})();
//
;
//
(function(){
function sim(v){return v===true||v===1||String(v||'').toLowerCase()==='true'||String(v||'').toLowerCase()==='sim';}
function atualizarPaginaV27(){
var v=window.vagaAtual;if(!v)return;
var tags=document.getElementById('detalheTags');
if(tags){
var antigo=document.getElementById('detalheSelosV27');if(antigo)antigo.remove();
var box=document.createElement('div');box.id='detalheSelosV27';box.className='detalhe-selos-v27';
var urgente=sim(v.urgente)||sim(v.contratacaoUrgente)||sim(v.prioridadeUrgente);
if(urgente){var u=document.createElement('div');u.className='detalhe-selo-v27 urgente';u.innerHTML='<span class="ico">&amp;#10148;</span><span>CONTRATA\u00C7\u00C3O URGENTE</span>';box.appendChild(u);}
if(box.children.length)tags.parentNode.insertBefore(box,tags.nextSibling);
}
var cidade=document.getElementById('detalheCidade');if(cidade){var c=v.cidade||'';var uf=v.uf||v.estado||'';cidade.textContent=(c+(uf?' - '+uf:'')).toUpperCase();}
['detalheContrato','detalheModalidade'].forEach(function(id){var e=document.getElementById(id);if(e)e.textContent=String(e.textContent||'').toUpperCase();});
var lateral=document.querySelector('#pagina-vaga .aplicar-bloco-principal');
if(lateral){
var old=document.getElementById('resumoVagaV27');if(old)old.remove();
var r=document.createElement('div');r.id='resumoVagaV27';r.className='resumo-vaga-v27';
function esc(x){return String(x==null?'-':x).replace(/[&amp;<>"']/g,function(m){return {'&amp;':'&amp;amp;','<':'&amp;lt;','>':'&amp;gt;','"':'&amp;quot;',"'":'&amp;#39;'}[m];});}
var loc=((v.cidade||'')+((v.uf||v.estado)?' - '+(v.uf||v.estado):'')).toUpperCase();
r.innerHTML='<h3>Resumo da vaga</h3>'+
'<div class="resumo-linha-v27"><span>Empresa</span><strong>'+esc(v.empresa||'-')+'</strong></div>'+
'<div class="resumo-linha-v27"><span>Localiza\u00E7\u00E3o</span><strong>'+esc(loc||'-')+'</strong></div>'+
'<div class="resumo-linha-v27"><span>Contrata\u00E7\u00E3o</span><strong>'+esc(String(v.contrato||'-').toUpperCase())+'</strong></div>'+
'<div class="resumo-linha-v27"><span>Modalidade</span><strong>'+esc(String(v.modalidade||'-').toUpperCase())+'</strong></div>'+
'<div class="resumo-linha-v27"><span>Sal\u00E1rio</span><strong>'+esc(typeof formatarSalarioExibicao==='function'?formatarSalarioExibicao(v.salario):(v.salario||'-'))+'</strong></div>';
lateral.appendChild(r);
}
}
if(typeof abrirVaga==='function'){
var abrirVagaV26=abrirVaga;
abrirVaga=function(id){var ret=abrirVagaV26(id);setTimeout(atualizarPaginaV27,0);return ret;};
}
})();
//
;
//
(function(){
var svgRocket='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.2-2 4-2 4s2.8-.5 4-2c.7-.8.7-2 0-2.7-.7-.7-1.9-.7-2.7 0z"/><path d="M9 15l-3-3s1.5-3.5 4-6c2.5-2.5 6.5-3.5 9-3-0.5 2.5-1.5 6.5-4 9-2.5 2.5-6 4-6 4z"/><circle cx="14" cy="8" r="1.5"/></svg>';
var svgStar='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.8l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 2.8z"/></svg>';
var icons=[
'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M15 8.5c-.8-.7-1.8-1-3-1-1.7 0-3 .8-3 2s1.2 1.8 3 2 3 1 3 2.2-1.3 2.3-3 2.3c-1.3 0-2.4-.4-3.2-1.2M12 5.5v13"/></svg>',
'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 12h18"/></svg>',
'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 21V5a2 2 0 012-2h8a2 2 0 012 2v16M8 7h2M8 11h2M8 15h2M16 9h2a2 2 0 012 2v10M2 21h20"/></svg>',
'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1116 0z"/><circle cx="12" cy="10" r="2.5"/></svg>'
];
function fixText(s){
if(!s||!/[\u00C3\u00C2\u00E2]/.test(s))return s;
try{return decodeURIComponent(escape(s));}catch(e){return s;}
}
function repararTexto(root){
root=root||document.body;if(!root)return;
var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false),n;
while((n=w.nextNode())){var t=fixText(n.nodeValue);if(t!==n.nodeValue)n.nodeValue=t;}
}
function empresaDaVaga(v){
var lista=[];try{lista=typeof empresasCadastradas==='function'?(empresasCadastradas()||[]):[];}catch(e){}
var nome=String(v.empresa||v.nomeEmpresa||'').trim().toLowerCase();
var cnpj=String(v.cnpj||v.empresaCnpj||'').replace(/\D/g,'');
var email=String(v.emailEmpresa||v.empresaEmail||'').trim().toLowerCase();
for(var i=0;i<lista.length;i++){
var e=lista[i]||{};
if(cnpj&&String(e.cnpj||'').replace(/\D/g,'')===cnpj)return e;
if(email&&String(e.email||'').trim().toLowerCase()===email)return e;
if(nome&&String(e.nome||e.nomeFantasia||'').trim().toLowerCase()===nome)return e;
}
return null;
}
function verificadaPublica(v){
var e=empresaDaVaga(v);if(!e)return false;
var p=String(e.plano||'').trim().toLowerCase();
var st=String(e.verificacaoStatus||'').trim().toLowerCase();
return ['trimestral','semestral','anual'].indexOf(p)>=0 && (e.verificada===true||st==='verificada'||st==='verificado'||st==='aprovada'||st==='aprovado');
}
function aplicarV30(){
var p=document.getElementById('pagina-vaga');if(!p)return;
var selos=p.querySelectorAll('.detalhe-selo-v27');
for(var i=0;i<selos.length;i++){
var ic=selos[i].querySelector('.ico');if(ic)ic.innerHTML=selos[i].classList.contains('urgente')?svgRocket:svgStar;
}
var itens=p.querySelectorAll('.info-faixa .info-item');
for(var j=0;j<itens.length&&j<4;j++){
var old=itens[j].querySelector('.info-icone-v30');if(old)old.remove();
var sp=document.createElement('span');sp.className='info-icone-v30';sp.innerHTML=icons[j];itens[j].insertBefore(sp,itens[j].firstChild);
}
var v=window.vagaAtual||{};
}
if(typeof abrirVaga==='function'){
var originalV30=abrirVaga;
abrirVaga=function(id){var r=originalV30(id);setTimeout(aplicarV30,20);setTimeout(aplicarV30,180);return r;};
}
document.addEventListener('DOMContentLoaded',function(){setTimeout(aplicarV30,250);});
})();
//
;
//
(function(){

document.addEventListener('DOMContentLoaded',function(){
setTimeout(aplicarCabecalhoPremiumV73,300);
});
})();
//
;
//
(function(){
function prepararSeloVerificadoV74(){
var selo=document.querySelector('#pagina-vaga .empresa-verificada-v30');
if(!selo)return;
selo.setAttribute('tabindex','0');
selo.setAttribute('role','button');
selo.setAttribute(
'aria-label',
'Empresa verificada. Os dados cadastrais da empresa foram validados pelo EmpregaMais.'
);
selo.setAttribute(
'title',
'Empresa verificada pelo EmpregaMais'
);
}
if(document.readyState==='loading'){
document.addEventListener('DOMContentLoaded',function(){
setTimeout(prepararSeloVerificadoV74,250);
});
}else{
setTimeout(prepararSeloVerificadoV74,250);
}
var paginaV74=document.getElementById('pagina-vaga');
if(paginaV74 && window.MutationObserver){
var timerV74=null;
var obsV74=new MutationObserver(function(muts){
var precisa=false;
for(var i=0;i<muts.length;i++){
if(muts[i].addedNodes&&muts[i].addedNodes.length){precisa=true;break;}
}
if(!precisa)return;
clearTimeout(timerV74);
timerV74=setTimeout(prepararSeloVerificadoV74,80);
});
obsV74.observe(paginaV74,{childList:true,subtree:true});
}
})();
//
;
//
(function(){
var seletorLegadoV76=[
".distancia-vaga-em",
".distancia-automatica-em",
".distancia-cep-final-em",
".distancia-card-fixa-em",
".ativar-distancia-em"
].join(",");
function limparDistanciasDuplicadasV76(raiz){
raiz=raiz||document;
var cards=raiz.querySelectorAll
? raiz.querySelectorAll("#listaVagas .vaga-card,#listaDestaques .card-destaque")
: [];
for(var i=0;i<cards.length;i++){
var card=cards[i];
var antigas=card.querySelectorAll(seletorLegadoV76);
for(var a=0;a<antigas.length;a++){
antigas[a].remove();
}
var canonicas=card.querySelectorAll(".local-distancia-card-em");
for(var c=1;c<canonicas.length;c++){
canonicas[c].remove();
}
}
}
function atualizarUnicaDistanciaV76(){
if(typeof aplicarDistanciaCanonicaCardsEM==="function"){
try{ aplicarDistanciaCanonicaCardsEM(); }catch(e){}
}
limparDistanciasDuplicadasV76(document);
}
window.EmpregaMaisAtualizarDistanciaUnica=atualizarUnicaDistanciaV76;
window.addEventListener("load",function(){
[150,700,1400,2400].forEach(function(ms){
setTimeout(atualizarUnicaDistanciaV76,ms);
});
});
var alvo=document.getElementById("pagina-home");
if(alvo&&window.MutationObserver){
var timerV76=null;
new MutationObserver(function(muts){
var precisa=false;
for(var i=0;i<muts.length;i++)if(muts[i].addedNodes&&muts[i].addedNodes.length){precisa=true;break;}
if(!precisa)return;
clearTimeout(timerV76);
timerV76=setTimeout(atualizarUnicaDistanciaV76,80);
}).observe(alvo,{childList:true,subtree:true});
}
})();
//
;
//
(function(){
function emailCandidatoAderenciaV77(){
var candidatos=[
sessionStorage.getItem("candidatoEmail"),
localStorage.getItem("candidatoEmail"),
document.getElementById("perfilEmail")&&document.getElementById("perfilEmail").value
];
for(var i=0;i<candidatos.length;i++){
var e=String(candidatos[i]||"").trim().toLowerCase();
if(e)return e;
}
return "";
}
function perfilCandidatoAderenciaV77(){
var email=emailCandidatoAderenciaV77();
if(!email)return null;
var lista=[];
try{lista=JSON.parse(localStorage.getItem("candidatosEmpregaMais")||"[]");}catch(e){}
if(!Array.isArray(lista))lista=[];
for(var i=0;i<lista.length;i++){
if(String(lista[i].email||"").trim().toLowerCase()===email)return lista[i];
}
return null;
}
function vagaAtualAderenciaV77(){
if(typeof vagaAtual!=="undefined" && vagaAtual && vagaAtual.cargo)return vagaAtual;
var params=new URLSearchParams(location.search);
var id=params.get("id");
if(!id)return null;
var fontes=[];
try{
if(typeof vagasPublicadas==="function")fontes=fontes.concat(vagasPublicadas()||[]);
}catch(e){}
try{
if(typeof vagasAprovadas==="function")fontes=fontes.concat(vagasAprovadas()||[]);
}catch(e){}
try{
if(typeof vagasPadrao!=="undefined" && Array.isArray(vagasPadrao))fontes=fontes.concat(vagasPadrao);
}catch(e){}
for(var i=0;i<fontes.length;i++){
if(String(fontes[i].id||"")===String(id))return fontes[i];
}
return null;
}
function campoV77(obj,nomes){
for(var i=0;i<nomes.length;i++){
var v=obj&&obj[nomes[i]];
if(v!==undefined && v!==null && String(v).trim()!=="")return v;
}
return "";
}
function normalizarVagaAderenciaV77(v){
if(!v)return null;
var copia={};
Object.keys(v).forEach(function(k){copia[k]=v[k];});
copia.cargo=campoV77(v,["cargo","titulo","vaga","funcao"]);
copia.area=campoV77(v,["area","areaAtuacao","categoria","setor"]);
copia.experiencia=campoV77(v,["experiencia","experienciaExigida","nivelExperiencia"]);
copia.escolaridade=campoV77(v,["escolaridade","formacao","escolaridadeMinima"]);
copia.requisitos=campoV77(v,["requisitos","requisito","qualificacoes"]);
copia.descricao=campoV77(v,["descricao","descricaoVaga","atividades"]);
copia.modalidade=campoV77(v,["modalidade","modeloTrabalho","tipoTrabalho"]);
copia.cidade=campoV77(v,["cidade","municipio","localidade"]);
return copia;
}
function renderV77(){
var pct=document.getElementById("aderenciaPercentualEM");
var barra=document.getElementById("aderenciaBarraEM");
var resumo=document.getElementById("aderenciaResumoEM");
var criterios=document.getElementById("aderenciaCriteriosEM");
var btn=document.getElementById("aderenciaPerfilBtnEM");
if(!pct||!barra||!resumo||!criterios)return false;
var c=perfilCandidatoAderenciaV77();
if(!c){
pct.textContent="--%"; barra.style.width="0%"; criterios.innerHTML="";
resumo.textContent="Entre na sua conta de candidato para calcular a compatibilidade com esta vaga.";
if(btn)btn.style.display="none";
return false;
}
var faltando=[];
if(!String(c.areaProfissional||"").trim())faltando.push("área");
if(!String(c.cargoDesejado||"").trim())faltando.push("cargo desejado");
if(!String(c.escolaridadeProfissional||"").trim())faltando.push("escolaridade");
if(!String(c.experienciaProfissional||"").trim())faltando.push("experiência");
if(!String(c.habilidadesProfissionais||"").trim())faltando.push("habilidades");
if(faltando.length){
pct.textContent="--%"; barra.style.width="0%"; criterios.innerHTML="";
resumo.textContent="Complete no seu perfil: "+faltando.join(", ")+".";
if(btn)btn.style.display="inline-flex";
return false;
}
var v=normalizarVagaAderenciaV77(vagaAtualAderenciaV77());
if(!v){
pct.textContent="--%"; barra.style.width="0%"; criterios.innerHTML="";
resumo.textContent="Carregando os dados da vaga para calcular a compatibilidade...";
return false;
}
var r=calcularAderenciaVagaEM(v,c);
pct.textContent=r.percentual+"%";
barra.style.width=r.percentual+"%";
if(btn)btn.style.display="none";
resumo.textContent=(r.percentual>=80?"Alta aderência":r.percentual>=60?"Boa aderência":r.percentual>=40?"Aderência moderada":"Baixa aderência")+
". Compatibilidade calculada com os dados salvos no seu perfil.";
criterios.innerHTML="";
r.itens.forEach(function(it){
var div=document.createElement("div");
div.className="aderencia-criterio-em"+(it.ok?"":" nao");
div.innerHTML="<i>"+(it.ok?"✓":"–")+"</i><span>"+it.nome+"</span>";
criterios.appendChild(div);
});
return true;
}
window.renderizarAderenciaVagaEM=renderV77;
window.renderizarAderenciaFinalEM=renderV77;
if(typeof salvarPerfilCandidato==="function"){
var salvarAntesV77=salvarPerfilCandidato;
salvarPerfilCandidato=function(event){
var r=salvarAntesV77.apply(this,arguments);
[0,80,250].forEach(function(ms){setTimeout(renderV77,ms);});
return r;
};
}
if(typeof abrirVaga==="function"){
var abrirAntesV77=abrirVaga;
abrirVaga=function(id){
var r=abrirAntesV77.apply(this,arguments);
[0,80,250,600,1200].forEach(function(ms){setTimeout(renderV77,ms);});
return r;
};
}
window.addEventListener("load",function(){
[100,350,800,1500,2500].forEach(function(ms){setTimeout(renderV77,ms);});
});
window.addEventListener("popstate",function(){
[50,250,700].forEach(function(ms){setTimeout(renderV77,ms);});
});
})();
//
;
//
(function(){
function candidatoPremiumAtivoV78(){
var email="";
try{ email=(sessionStorage.getItem("candidatoEmail")||localStorage.getItem("candidatoEmail")||"").trim().toLowerCase(); }catch(e){}
if(!email)return false;
var lista=[];
try{ lista=JSON.parse(localStorage.getItem("candidatosEmpregaMais")||"[]"); }catch(e){}
if(!Array.isArray(lista))return false;
var c=lista.find(function(x){return String(x.email||"").trim().toLowerCase()===email;});
if(!c)return false;
var status=String(c.plano_candidato||c.planoCandidato||c.plano||"gratuito").toLowerCase();
var fim=c.premium_valido_ate||c.premiumValidoAte||c.plano_valido_ate||"";
var ativo=(status==="premium"||status==="trimestral"||status==="semestral");
if(ativo && fim){
var d=new Date(fim);
if(!isNaN(d.getTime()) && d.getTime()<Date.now())ativo=false;
}
return ativo;
}
window.candidatoPremiumAtivoV78=candidatoPremiumAtivoV78;
window.atualizarStatusPremiumCandidatoV78=function(){
var el=document.getElementById("premiumStatusCandidatoV78");
if(!el)return;
el.textContent=candidatoPremiumAtivoV78()?"Plano atual: Premium ativo":"Plano atual: Gratuito";
};
window.premiumPagamentoIndisponivelV78=function(){
alert("Os planos Premium já estão apresentados no portal. A contratação será liberada assim que o pagamento e a assinatura do candidato forem conectados ao sistema.");
};
function bloquearAderenciaV78(){
if(candidatoPremiumAtivoV78())return false;
var box=document.querySelector("#pagina-vaga .aderencia-vaga-em");
if(!box)return false;
box.innerHTML='<div class="premium-lock-aderencia-v78"><div class="premium-lock-icon-v78">🔒</div><strong>Aderência à vaga é um recurso Premium</strong><p>Descubra o quanto esta oportunidade combina com o seu perfil e veja os critérios de compatibilidade.</p><button id="premiumConhecerBtnV78" type="button">Conhecer o Premium</button></div>'; var pb=document.getElementById("premiumConhecerBtnV78"); if(pb)pb.onclick=function(){irPara("premium-candidato");};
return true;
}
window.bloquearAderenciaV78=bloquearAderenciaV78;
var aderenciaAnteriorV78=window.renderizarAderenciaVagaEM;
window.renderizarAderenciaVagaEM=function(){
if(bloquearAderenciaV78())return false;
return typeof aderenciaAnteriorV78==="function"?aderenciaAnteriorV78.apply(this,arguments):false;
};
window.renderizarAderenciaFinalEM=window.renderizarAderenciaVagaEM;
window.addEventListener("load",function(){
setTimeout(bloquearAderenciaV78,350);
setTimeout(bloquearAderenciaV78,1000);
});
})();
//
;
//
(function(){
function abrirPlanoV81(){
var botaoPlano=document.querySelector("#pagina-painel-empresa .empresa-painel-nav-em button[data-empresa-aba-em='plano']");
if(botaoPlano && typeof abrirAbaEmpresaEM==="function"){
abrirAbaEmpresaEM("plano",botaoPlano);
try{botaoPlano.scrollIntoView({behavior:"smooth",block:"nearest"});}catch(e){}
return;
}
if(typeof irPara==="function")irPara("planos");
}
function prepararV81(){
document.querySelectorAll("#pagina-painel-empresa .plano-premium-btn-v44").forEach(function(btn){
btn.type="button";
btn.onclick=function(ev){
if(ev){ev.preventDefault();ev.stopPropagation();}
abrirPlanoV81();
};
btn.setAttribute("aria-label","Gerenciar plano da empresa");
});
}
window.abrirGerenciarPlanoEmpresaV81=abrirPlanoV81;
window.addEventListener("load",function(){
setTimeout(prepararV81,950);
setTimeout(prepararV81,1800);
});
var alvo=document.getElementById("pagina-painel-empresa");
if(alvo&&window.MutationObserver){
var tmV81=0;
new MutationObserver(function(muts){
var mudou=false;
for(var i=0;i<muts.length;i++)if(muts[i].addedNodes&&muts[i].addedNodes.length){mudou=true;break;}
if(!mudou)return;
clearTimeout(tmV81);tmV81=setTimeout(prepararV81,80);
}).observe(alvo,{childList:true,subtree:true});
}
})();
//
;
//
(function(){
var PLANOS={
basico:{nome:"Plano Gratuito",preco:"R$ 0,00",periodo:"uso gratuito",vagas:3,destaques:0,urgentes:0,
beneficios:["Painel do recrutador","3 publicações por mês","Recebimento de candidaturas","Gestão básica de candidatos","Estatísticas básicas"]},
trimestral:{nome:"Plano Trimestral",preco:"R$ 79,90",periodo:"3 meses",vagas:50,destaques:10,urgentes:5,
beneficios:["Painel completo do recrutador","50 vagas durante a vigência","Até 10 vagas em destaque simultaneamente","5 selos Contratação Urgente por mês","Publicação Confidencial incluída","Empresa Verificada após validação","Página Exclusiva da Empresa","Perfil institucional, cultura e benefícios","Gestão completa de candidatos","Estatísticas completas"]},
semestral:{nome:"Plano Semestral",preco:"R$ 139,90",periodo:"6 meses",vagas:100,destaques:20,urgentes:7,
beneficios:["Painel completo do recrutador","100 vagas durante a vigência","Até 20 vagas em destaque simultaneamente","7 selos Contratação Urgente por mês","Publicação Confidencial incluída","Empresa Verificada após validação","Página Exclusiva da Empresa","Perfil institucional, cultura e benefícios","Gestão completa de candidatos","Estatísticas completas","Suporte prioritário"]},
anual:{nome:"Plano Anual",preco:"R$ 239,90",periodo:"12 meses",vagas:300,destaques:40,urgentes:10,
beneficios:["Painel completo do recrutador","300 vagas durante a vigência","Até 40 vagas em destaque simultaneamente","10 selos Contratação Urgente por mês","Publicação Confidencial incluída","Empresa Verificada após validação","Página Exclusiva da Empresa","Perfil institucional, cultura e benefícios","Gestão completa de candidatos","Estatísticas completas","Suporte prioritário"]}
};
function chaveAtual(){
try{
var r=typeof resumoPlanoEmpresaV9==="function"?resumoPlanoEmpresaV9():null;
var x=String(r&&r.plano||"").toLowerCase();
if(PLANOS[x])return x;
}catch(e){}
try{
var e=typeof empresaLogadaPainelEM==="function"?(empresaLogadaPainelEM()||{}):{};
var x2=String(e.plano_id||e.plano||e.planoId||"basico").toLowerCase();
if(PLANOS[x2])return x2;
}catch(e){}
return "basico";
}
function dadosEmpresa(){
try{return typeof empresaLogadaPainelEM==="function"?(empresaLogadaPainelEM()||{}):{};}catch(e){return{};}
}
function dataBR(v){
if(!v)return "—";
var d=new Date(v);if(isNaN(d.getTime()))return String(v);
return d.toLocaleDateString("pt-BR");
}
function vagasUsadas(){
try{return typeof vagasDaEmpresa==="function"?(vagasDaEmpresa()||[]).length:0;}catch(e){return 0;}
}
function destaquesUsados(){
try{return (vagasDaEmpresa()||[]).filter(function(v){return v.destaque===true||String(v.destaque)==="true";}).length;}catch(e){return 0;}
}
function urgentesUsados(){
try{return (vagasDaEmpresa()||[]).filter(function(v){return v.contratacaoUrgente===true||v.urgente===true||String(v.contratacaoUrgente)==="true";}).length;}catch(e){return 0;}
}
function ganhos(de,para){
var a=PLANOS[de],b=PLANOS[para],g=[];
if(b.vagas>a.vagas)g.push((b.vagas-a.vagas)+" vagas adicionais de capacidade");
if(b.destaques>a.destaques)g.push("Até "+b.destaques+" vagas em destaque simultaneamente");
if(b.urgentes>a.urgentes)g.push(b.urgentes+" selos de Contratação Urgente por mês");
if(de==="trimestral"&&para==="semestral")g.push("Mais 3 meses de vigência");
if(de==="trimestral"&&para==="anual")g.push("Mais 9 meses de vigência");
if(de==="semestral"&&para==="anual")g.push("Mais 6 meses de vigência");
if(de==="basico")g.push("Recursos profissionais e página institucional da empresa");
if((para==="semestral"||para==="anual")&&de!=="semestral"&&de!=="anual")g.push("Suporte prioritário");
return g;
}
function cardUpgrade(de,para,recomendado){
var p=PLANOS[para],gs=ganhos(de,para);
return "<article class='central-upgrade-card-v82"+(recomendado?" recomendado":"")+"'>"+
(recomendado?"<div class='central-upgrade-selo-v82'>MELHOR EVOLUÇÃO</div>":"")+
"<span>UPGRADE</span><h4>"+p.nome+"</h4><div class='central-upgrade-preco-v82'>"+p.preco+" <small>/ "+p.periodo+"</small></div>"+
"<p>Amplie os recursos disponíveis para os seus processos seletivos.</p>"+
"<div class='central-ganhos-v82'><strong>O que sua empresa passa a ganhar</strong>"+
gs.map(function(x){return "<div>"+x+"</div>";}).join("")+"</div>"+
"<button class='central-upgrade-btn-v82' type='button' data-upgrade-v82='"+para+"'>Fazer upgrade para "+p.nome.replace("Plano ","")+"</button></article>";
}
function montar(){
var shell=document.getElementById("painelReferenciaRecrutadorEM");if(!shell)return;
var main=shell.querySelector(".recrutador-main-ref-em");if(!main)return;
var old=document.getElementById("centralPlanosEmpresaV82");if(old)old.remove();
var ch=chaveAtual(),p=PLANOS[ch],e=dadosEmpresa();
var inicio=e.plano_inicio||e.planoInicio||e.plano_liberado_em||"";
var fim=e.plano_valido_ate||e.planoValidoAte||"";
var central=document.createElement("section");
central.id="centralPlanosEmpresaV82";central.className="central-planos-v82";
var beneficios=p.beneficios.map(function(x){return "<div class='central-beneficio-v82'><b>✓</b><span>"+x+"</span></div>";}).join("");
var upgrades="";
if(ch==="basico")upgrades=cardUpgrade(ch,"trimestral",false)+cardUpgrade(ch,"semestral",false)+cardUpgrade(ch,"anual",true);
if(ch==="trimestral")upgrades=cardUpgrade(ch,"semestral",false)+cardUpgrade(ch,"anual",true);
if(ch==="semestral")upgrades=cardUpgrade(ch,"anual",true);
central.innerHTML=
"<div class='central-planos-top-v82'><div><small>PLANOS E PAGAMENTOS</small><h2>Central da sua assinatura</h2><p>Consulte seu plano atual, recursos disponíveis e opções de upgrade.</p></div><button class='central-planos-voltar-v82' type='button'>← Voltar ao painel</button></div>"+
"<div class='central-plano-atual-v82'><div class='central-plano-atual-head-v82'><div class='central-plano-ident-v82'><div class='central-plano-icone-v82'>♛</div><div><span>SEU PLANO ATUAL</span><h3>"+p.nome+"</h3></div></div><div class='central-plano-datas-v82'><span class='central-plano-ativo-v82'>✓ ATIVO</span><strong>"+(fim?"Válido até "+dataBR(fim):(ch==="basico"?"Sem prazo de assinatura":"Assinatura ativa"))+"</strong>"+(inicio?"Início: "+dataBR(inicio):"")+"</div></div>"+
"<div class='central-uso-v82'><div class='central-uso-item-v82'><small>PUBLICAÇÕES</small><strong>"+vagasUsadas()+" / "+p.vagas+"</strong><em>vagas utilizadas</em></div><div class='central-uso-item-v82'><small>DESTAQUES</small><strong>"+destaquesUsados()+" / "+p.destaques+"</strong><em>simultâneos</em></div><div class='central-uso-item-v82'><small>URGENTES</small><strong>"+urgentesUsados()+" / "+p.urgentes+"</strong><em>recursos do plano</em></div><div class='central-uso-item-v82'><small>VIGÊNCIA</small><strong>"+p.periodo+"</strong><em>"+p.preco+"</em></div></div></div>"+
"<div class='central-beneficios-v82'><div class='central-section-title-v82'><div><h3>Tudo que está incluído no seu plano</h3><p>Recursos atualmente liberados para a sua empresa.</p></div></div><div class='central-beneficios-grid-v82'>"+beneficios+"</div></div>"+
(ch==="anual"?
"<div class='central-maximo-v82'><strong>✓ Sua empresa já está no plano mais completo</strong><p>O Plano Anual oferece a maior capacidade de publicações, destaques e recursos atualmente disponíveis no EmpregaMais.</p></div>":
"<div class='central-upgrade-v82'><div class='central-upgrade-intro-v82'><span>EVOLUA SEU PLANO</span><h3>Mais recursos para continuar recrutando</h3><p>Veja o que sua empresa ganha ao migrar para um plano superior.</p></div><div class='central-upgrade-grid-v82"+(ch==="semestral"?" unico":"")+"'>"+upgrades+"</div></div>")+
"<div class='central-aviso-valores-v82'>Valores e condições exibidos nesta fase são provisórios e poderão ser atualizados antes do lançamento comercial.</div>";
main.appendChild(central);
central.querySelector(".central-planos-voltar-v82").onclick=function(){fechar();};
central.querySelectorAll("[data-upgrade-v82]").forEach(function(b){
b.onclick=function(){
var destino=PLANOS[this.getAttribute("data-upgrade-v82")];
alert("O upgrade para "+destino.nome+" será conectado ao pagamento quando a etapa comercial do portal for ativada.");
};
});
}
function abrir(){
montar();
var shell=document.getElementById("painelReferenciaRecrutadorEM");if(!shell)return;
var main=shell.querySelector(".recrutador-main-ref-em");if(!main)return;
Array.from(main.children).forEach(function(x){x.style.display=x.id==="centralPlanosEmpresaV82"?"block":"none";});
var c=document.getElementById("centralPlanosEmpresaV82");if(c)c.classList.add("ativa");
shell.querySelectorAll("[data-ref-nav]").forEach(function(b){b.classList.toggle("ativo",b.getAttribute("data-ref-nav")==="planos");});
window.scrollTo(0,0);
}
function fechar(){
var shell=document.getElementById("painelReferenciaRecrutadorEM");if(!shell)return;
var main=shell.querySelector(".recrutador-main-ref-em");if(!main)return;
Array.from(main.children).forEach(function(x){x.style.display=x.id==="centralPlanosEmpresaV82"?"none":"";});
shell.querySelectorAll("[data-ref-nav]").forEach(function(b){b.classList.toggle("ativo",b.getAttribute("data-ref-nav")==="painel");});
window.scrollTo(0,0);
}
window.abrirCentralPlanosEmpresaV82=abrir;
window.abrirGerenciarPlanoEmpresaV81=abrir;
document.addEventListener("click",function(ev){
var b=ev.target.closest&&ev.target.closest("#painelReferenciaRecrutadorEM [data-ref-nav='planos']");
if(!b)return;
ev.preventDefault();ev.stopPropagation();ev.stopImmediatePropagation();abrir();
},true);
})();
//
;
//
(function(){
var executandoV83=false;
function garantirDistanciaPreviaV83(){
if(executandoV83)return;
executandoV83=true;
try{
if(typeof aplicarDistanciaCanonicaCardsEM==="function"){
aplicarDistanciaCanonicaCardsEM();
}else if(typeof atualizarDistanciaCanonicaEM==="function"){
atualizarDistanciaCanonicaEM();
}
document.querySelectorAll("#pagina-home .vaga-card, #pagina-home .card-destaque").forEach(function(card){
var canonicas=card.querySelectorAll(".local-distancia-card-em");
for(var i=1;i<canonicas.length;i++)canonicas[i].remove();
card.querySelectorAll(".distancia-vaga-em,.distancia-automatica-em,.distancia-cep-final-em,.distancia-card-fixa-em,.ativar-distancia-em").forEach(function(el){
el.remove();
});
if(canonicas[0]){
canonicas[0].style.display="flex";
canonicas[0].removeAttribute("hidden");
}
});
}catch(e){}
executandoV83=false;
}
window.EmpregaMaisAtualizarDistanciaPreviaV83=garantirDistanciaPreviaV83;
window.addEventListener("load",function(){
[150,500,1000,1800,3000].forEach(function(ms){
setTimeout(garantirDistanciaPreviaV83,ms);
});
});
var home=document.getElementById("pagina-home");
if(home){
var timerV83=null;
new MutationObserver(function(muts){
var precisa=false;
for(var i=0;i<muts.length;i++)if(muts[i].addedNodes&&muts[i].addedNodes.length){precisa=true;break;}
if(!precisa)return;
clearTimeout(timerV83);
timerV83=setTimeout(garantirDistanciaPreviaV83,120);
}).observe(home,{childList:true,subtree:true});
}
})();
//