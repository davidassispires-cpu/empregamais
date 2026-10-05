/* EmpregaMais - Benefícios adicionais v1
   Corrige ícone de Cesta básica e acrescenta Celular corporativo + Convênio com o Sesc.
   Não altera a rotina de persistência: usa os mesmos checkboxes do bloco V128. */
(function(){
"use strict";
if(window.__EM_BENEFICIOS_ADICIONAIS_V1)return;
window.__EM_BENEFICIOS_ADICIONAIS_V1=true;
function cardHtml(id,icone,nome){
 return '<div class="beneficio-v128">'+
 '<input type="checkbox" id="benV128_'+id+'" value="'+nome+'" data-nome="'+nome+'"/>'+
 '<label for="benV128_'+id+'"><span>'+icone+'</span><span>'+nome+'</span></label></div>';
}
function sincronizar(box){
 var hidden=document.getElementById("beneficiosVaga"); if(!hidden)return;
 var nomes=[];
 box.querySelectorAll('.beneficio-v128 input[type="checkbox"]:checked').forEach(function(inp){
   var nome=inp.getAttribute("data-nome")||inp.value;
   var card=inp.closest(".beneficio-v128"), valor=card&&card.querySelector(".beneficio-valor-v179");
   if(valor&&valor.value.trim())nome+=": "+valor.value.trim();
   nomes.push(nome);
 });
 var outro=box.querySelector("#beneficiosOutroV128"); if(outro&&outro.value.trim())nomes.push(outro.value.trim());
 hidden.value=nomes.join(", ");
 box.dataset.beneficios=hidden.value;
 var cont=box.querySelector(".beneficios-contador-v128");
 if(cont){var n=box.querySelectorAll('.beneficio-v128 input[type="checkbox"]:checked').length;cont.textContent=n+(n===1?" benefício selecionado":" benefícios selecionados");}
}
function aplicar(){
 var box=document.getElementById("beneficiosCardsV128"); if(!box)return false;
 var cesta=box.querySelector('#benV128_cesta_basica');
 if(cesta){
   var lab=box.querySelector('label[for="benV128_cesta_basica"]');
   var ico=lab&&lab.querySelector("span");
   if(ico)ico.innerHTML="🧺";
 }
 var grid=box.querySelector(".beneficios-grid-v128"); if(!grid)return false;
 if(!document.getElementById("benV128_celular_corporativo"))grid.insertAdjacentHTML("beforeend",cardHtml("celular_corporativo","📱","Celular corporativo"));
 if(!document.getElementById("benV128_convenio_sesc"))grid.insertAdjacentHTML("beforeend",cardHtml("convenio_sesc","🤝","Convênio com o Sesc"));
 if(!box.dataset.beneficiosAdicionaisV1){
   box.dataset.beneficiosAdicionaisV1="1";
   box.addEventListener("change",function(e){
     if(e.target&&(/benV128_(celular_corporativo|convenio_sesc)/).test(e.target.id||""))sincronizar(box);
   });
 }
 return true;
}
var n=0,t=setInterval(function(){n++;if(aplicar()||n>80)clearInterval(t)},100);
document.addEventListener("DOMContentLoaded",function(){setTimeout(aplicar,100)});
})();