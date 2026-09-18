/* EmpregaMais - Controles selecionáveis do formulário de vaga - v1
   Restaura a interação dos campos nativos sem alterar valores, regras de plano ou envio. */
(function(){
"use strict";
if(window.__EM_CONTROLES_VAGA_V1)return;
window.__EM_CONTROLES_VAGA_V1=true;

function form(){return document.getElementById("formVaga");}
function pagina(){return document.getElementById("pagina-publicar");}
function visivel(el){
 if(!el)return false;
 var r=el.getBoundingClientRect(),s=getComputedStyle(el);
 return s.display!=="none"&&s.visibility!=="hidden"&&r.width>0&&r.height>0;
}
function bloqueioLegitimo(el){
 if(!el)return true;
 if(el.id==="vagaConfidencialEM")return el.disabled;
 if(el.id==="tipoContatoWhatsapp"||el.id==="tipoContatoLink")return el.disabled;
 return false;
}
function restaurar(){
 var f=form(); if(!f)return;
 f.querySelectorAll("select,input[type='radio'],input[type='checkbox']").forEach(function(el){
   if(bloqueioLegitimo(el))return;
   el.style.setProperty("pointer-events","auto","important");
   el.style.setProperty("position",getComputedStyle(el).position==="static"?"relative":getComputedStyle(el).position,"important");
   el.style.setProperty("z-index","3","important");
 });
 f.querySelectorAll("select").forEach(function(el){
   if(bloqueioLegitimo(el))return;
   /* Só remove disabled indevido dos selects comuns do formulário.
      Estado/cidade podem ser habilitados por suas próprias rotinas de CEP. */
   if(el.id!=="cidadeVaga" && el.id!=="estadoVaga"){
     el.disabled=false;
     el.removeAttribute("disabled");
   }
 });
}
function elementoControle(t){
 if(!t||!t.closest)return null;
 return t.closest("#formVaga select,#formVaga input[type='radio'],#formVaga input[type='checkbox']");
}
/* Bloqueia overlays transparentes que estejam cobrindo controles visíveis,
   sem substituir o comportamento nativo do select. */
function liberarPonto(e){
 var c=elementoControle(e.target);
 if(!c)return;
 restaurar();
}
document.addEventListener("pointerdown",liberarPonto,true);
document.addEventListener("focusin",liberarPonto,true);
document.addEventListener("change",function(e){
 var c=elementoControle(e.target); if(!c)return;
 c.dataset.emUltimaSelecao=String(c.value||c.checked||"");
},true);

var obs=new MutationObserver(function(m){
 var p=pagina(); if(!p||!visivel(p))return;
 var precisa=false;
 for(var i=0;i<m.length;i++){
   if(m[i].type==="childList"||m[i].attributeName==="disabled"||m[i].attributeName==="style"){precisa=true;break;}
 }
 if(precisa)setTimeout(restaurar,0);
});
function iniciar(){
 restaurar();
 var f=form();
 if(f)obs.observe(f,{subtree:true,childList:true,attributes:true,attributeFilter:["disabled","style","class"]});
 setTimeout(restaurar,250);setTimeout(restaurar,800);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",iniciar);
else iniciar();
window.addEventListener("load",function(){setTimeout(restaurar,200);});
window.restaurarControlesVagaEM=restaurar;
})();