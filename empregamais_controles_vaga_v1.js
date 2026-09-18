/* EmpregaMais - Controles selecionáveis do formulário de vaga - v2
   Corrige seleção nativa sem reescrever valores nem regras de negócio. */
(function(){
"use strict";
if(window.__EM_CONTROLES_VAGA_V2)return;
window.__EM_CONTROLES_VAGA_V2=true;

function form(){return document.getElementById("formVaga");}
function protegido(el){
 return !!el && (
   el.id==="vagaConfidencialEM" ||
   el.id==="tipoContatoWhatsapp" ||
   el.id==="tipoContatoLink"
 );
}
function preparar(){
 var f=form();if(!f)return;
 f.querySelectorAll("select").forEach(function(el){
   if(protegido(el))return;
   if(el.id!=="cidadeVaga"&&el.id!=="estadoVaga"){
     el.disabled=false;el.removeAttribute("disabled");
   }
   el.style.setProperty("pointer-events","auto","important");
   el.style.setProperty("position","relative","important");
   el.style.setProperty("z-index","20","important");
   el.style.setProperty("-webkit-appearance","auto","important");
   el.style.setProperty("appearance","auto","important");
 });
 f.querySelectorAll("input[type='radio'],input[type='checkbox']").forEach(function(el){
   if(protegido(el)&&el.disabled)return;
   el.style.setProperty("pointer-events","auto","important");
   el.style.setProperty("position","relative","important");
   el.style.setProperty("z-index","20","important");
 });
}
/* O V1 observava o atributo style e, ao preparar um campo, disparava o próprio
   observer novamente. V2 não observa style/class e não toca no select durante
   pointerdown, deixando o navegador concluir a escolha da option. */
var obs=new MutationObserver(function(m){
 var precisa=false;
 for(var i=0;i<m.length;i++){
   if(m[i].type==="childList" || (m[i].type==="attributes"&&m[i].attributeName==="disabled")){
     precisa=true;break;
   }
 }
 if(precisa)setTimeout(preparar,0);
});
function iniciar(){
 preparar();
 var f=form();
 if(f)obs.observe(f,{subtree:true,childList:true,attributes:true,attributeFilter:["disabled"]});
 setTimeout(preparar,300);
 setTimeout(preparar,1000);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",iniciar);
else iniciar();
window.addEventListener("load",function(){setTimeout(preparar,200);});
window.restaurarControlesVagaEM=preparar;
})();