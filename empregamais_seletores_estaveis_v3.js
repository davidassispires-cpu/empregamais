/* EmpregaMais - Seletores estáveis do formulário v3
   Interface própria sincronizada com os <select> originais.
   Não altera opções, valores salvos nem regras de negócio. */
(function(){
"use strict";
if(window.__EM_SELETORES_ESTAVEIS_V3)return;
window.__EM_SELETORES_ESTAVEIS_V3=true;
var aberto=null;

function fechar(){
 if(aberto){aberto.classList.remove("em-select-aberto-v3");aberto=null;}
}
function textoOption(op){return String(op&&op.textContent||"").replace(/\s+/g," ").trim();}
function permitido(sel){return sel && !sel.disabled && sel.type!=="hidden";}
function sincronizar(box){
 var sel=box.__select;if(!sel)return;
 var bot=box.querySelector(".em-select-botao-v3");
 var atual=sel.options[sel.selectedIndex];
 if(bot)bot.textContent=textoOption(atual)||"Selecione";
 var lista=box.querySelector(".em-select-lista-v3");if(!lista)return;
 lista.innerHTML="";
 Array.from(sel.options).forEach(function(op,i){
   var b=document.createElement("button");
   b.type="button";b.className="em-select-opcao-v3";
   b.textContent=textoOption(op);
   b.dataset.index=String(i);
   if(op.disabled)b.disabled=true;
   if(i===sel.selectedIndex)b.classList.add("selecionada");
   b.addEventListener("pointerdown",function(e){
     e.preventDefault();e.stopPropagation();
     if(op.disabled)return;
     sel.selectedIndex=i;
     try{sel.dispatchEvent(new Event("input",{bubbles:true}));}catch(_){}
     try{sel.dispatchEvent(new Event("change",{bubbles:true}));}catch(_){}
     sincronizar(box);fechar();
   },true);
   lista.appendChild(b);
 });
 box.classList.toggle("em-select-desabilitado-v3",!permitido(sel));
}
function montar(sel){
 if(!sel||sel.dataset.emSelectV3==="1")return;
 if(sel.closest(".em-select-estavel-v3"))return;
 sel.dataset.emSelectV3="1";
 var box=document.createElement("div");box.className="em-select-estavel-v3";box.__select=sel;
 var bot=document.createElement("button");bot.type="button";bot.className="em-select-botao-v3";
 bot.setAttribute("aria-haspopup","listbox");
 var lista=document.createElement("div");lista.className="em-select-lista-v3";lista.setAttribute("role","listbox");
 sel.parentNode.insertBefore(box,sel);
 box.appendChild(sel);box.appendChild(bot);box.appendChild(lista);
 sel.classList.add("em-select-original-v3");
 bot.addEventListener("pointerdown",function(e){
   e.preventDefault();e.stopPropagation();
   if(!permitido(sel))return;
   var ja=box.classList.contains("em-select-aberto-v3");fechar();
   if(!ja){box.classList.add("em-select-aberto-v3");aberto=box;}
 },true);
 sel.addEventListener("change",function(){sincronizar(box);});
 new MutationObserver(function(){sincronizar(box);}).observe(sel,{childList:true,subtree:true,attributes:true,attributeFilter:["disabled","selected"]});
 sincronizar(box);
}
function aplicar(){
 var f=document.getElementById("formVaga");if(!f)return;
 Array.from(f.querySelectorAll("select")).forEach(montar);
}
document.addEventListener("pointerdown",function(e){
 if(aberto && !e.target.closest(".em-select-estavel-v3"))fechar();
},false);
document.addEventListener("DOMContentLoaded",function(){aplicar();setTimeout(aplicar,400);setTimeout(aplicar,1000);});
window.addEventListener("load",function(){setTimeout(aplicar,250);});
new MutationObserver(function(){setTimeout(aplicar,0);}).observe(document.documentElement,{childList:true,subtree:true});
window.aplicarSeletoresEstaveisEM=aplicar;
})();