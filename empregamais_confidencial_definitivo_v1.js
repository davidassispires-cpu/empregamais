/* EmpregaMais - Confidencialidade pública definitiva v1
   Preserva os dados reais da empresa e altera somente a apresentação pública. */
(function(){
"use strict";
if(window.__EM_CONFIDENCIAL_DEFINITIVO_V1)return;
window.__EM_CONFIDENCIAL_DEFINITIVO_V1=true;

function verdadeiro(v){
 if(v===true||v===1)return true;
 v=String(v==null?"":v).toLowerCase().trim();
 return v==="1"||v==="sim"||v==="true"||v==="confidencial";
}
function confidencial(v){return !!v&&verdadeiro(v.confidencial);}
function localizar(id){
 try{if(typeof window.localizarVagaPortal==="function"){var v=window.localizarVagaPortal(id);if(v)return v;}}catch(e){}
 try{
  if(typeof window.carregarVagasPortal==="function"){
   var a=window.carregarVagasPortal()||[];
   for(var i=0;i<a.length;i++)if(String(a[i].id)===String(id))return a[i];
  }
 }catch(e){}
 return null;
}
function emPainelInterno(el){
 return !!(el&&el.closest&&el.closest("#pagina-painel-empresa,#pagina-candidatos-empresa,#pagina-painel-admin,#pagina-login-admin"));
}
function ocultar(el){
 if(!el)return;
 el.style.setProperty("display","none","important");
 el.onclick=null;
 el.removeAttribute("title");
}
function protegerCard(card,v){
 if(!card||!confidencial(v)||emPainelInterno(card))return;
 card.classList.add("vaga-confidencial-publica-em");
 var nome=card.querySelector(".vaga-empresa,.empresa-vaga,.vaga-card-empresa,[data-campo='empresa']");
 if(nome){
  nome.textContent="Empresa confidencial";
  nome.onclick=null;
  nome.removeAttribute("title");
  nome.removeAttribute("href");
  nome.classList.remove("empresa-link-em","empresa-link-cadastro-em","empresa-verificada-link");
 }
 var logos=card.querySelectorAll(".vaga-logo,.logo-vaga,.vaga-card-logo,.empresa-logo,img[data-logo-empresa]");
 for(var i=0;i<logos.length;i++)ocultar(logos[i]);
 var links=card.querySelectorAll(".empresa-link-em,.empresa-link-cadastro-em,.empresa-verificada-link,[data-empresa-link-em]");
 for(var j=0;j<links.length;j++){
  if(links[j]!==nome){links[j].onclick=null;links[j].removeAttribute("href");links[j].removeAttribute("title");}
 }
 var selos=card.querySelectorAll(".empresa-verificada-mini,.empresa-verificada-v30,.selo-verificado-card-em,.selo-verificacao,.empresa-publica-status-cadastro-em");
 for(var k=0;k<selos.length;k++)ocultar(selos[k]);
}
function vagaDetalhe(){
 try{if(window.vagaAtual&&window.vagaAtual.id)return window.vagaAtual;}catch(e){}
 try{
  var u=new URL(window.location.href),id=u.searchParams.get("id");
  if(id)return localizar(id);
 }catch(e){}
 return null;
}
function protegerDetalhe(v){
 var pagina=document.getElementById("pagina-vaga");
 if(!pagina||!confidencial(v))return;
 pagina.classList.add("vaga-confidencial-em");
 var nome=document.getElementById("detalheEmpresaCab");
 if(nome){
  nome.innerHTML="";
  nome.textContent="Empresa confidencial";
  nome.onclick=null;nome.removeAttribute("href");nome.removeAttribute("title");
  nome.classList.remove("empresa-link-em","empresa-link-cadastro-em","empresa-verificada-link");
 }
 ["logoDetalhe","detalheLogoEmpresa","empresaLateralVerificada","btnConhecerEmpresa"].forEach(function(id){ocultar(document.getElementById(id));});
 var lateral=document.getElementById("empresaLateralNome");
 if(lateral)lateral.textContent="Empresa confidencial";
 var sobre=document.getElementById("detalheSobreEmpresa");
 if(sobre){
  var box=sobre.closest(".empresa-lateral")||sobre.parentElement;
  ocultar(box);
 }
 var privados=pagina.querySelectorAll(".empresa-verificada-mini,.empresa-verificada-v30,.selo-verificado-card-em,.selo-verificacao,.empresa-publica-status-cadastro-em");
 for(var i=0;i<privados.length;i++)ocultar(privados[i]);
}
function aplicar(){
 var cards=document.querySelectorAll(".vaga-card[data-id],.card-destaque[data-id],[data-vaga-id]");
 for(var i=0;i<cards.length;i++){
  var id=cards[i].getAttribute("data-id")||cards[i].getAttribute("data-vaga-id");
  var v=localizar(id);
  if(v)protegerCard(cards[i],v);
 }
 var vd=vagaDetalhe();
 if(vd)protegerDetalhe(vd);
}
var timer=0;
function agendar(){clearTimeout(timer);timer=setTimeout(aplicar,30);}
document.addEventListener("DOMContentLoaded",function(){setTimeout(aplicar,200);});
window.addEventListener("load",function(){setTimeout(aplicar,350);setTimeout(aplicar,900);});
document.addEventListener("click",function(){setTimeout(aplicar,80);},true);
var obs=new MutationObserver(agendar);
if(document.documentElement)obs.observe(document.documentElement,{childList:true,subtree:true});

/* Mantém compatibilidade com as rotinas existentes sem alterar os dados salvos. */
window.vagaEhConfidencialEM=confidencial;
window.aplicarConfidencialPublicoEM=aplicar;
window.aplicarConfidencialDetalheEM=function(v){protegerDetalhe(v||vagaDetalhe());};
})();