/* EmpregaMais - JavaScript externo - lote 13 */

//
(function(){
function criarEnderecoV130(){
var cep=document.getElementById("cepVaga");
if(!cep || document.getElementById("enderecoCepV130"))return;
var grupo=cep.closest(".grupo");
if(!grupo)return;
var box=document.createElement("div");
box.id="enderecoCepV130";
box.className="endereco-cep-v130";
box.innerHTML=
'&lt;div class="endereco-linha-v130"&gt;'+
'&lt;div class="endereco-campo-v130"&gt;&lt;label for="ruaVagaV130"&gt;Rua / logradouro&lt;/label&gt;&lt;input class="campo" id="ruaVagaV130" type="text" readonly="readonly" placeholder="Preenchido automaticamente pelo CEP"/&gt;&lt;/div&gt;'+
'&lt;div class="endereco-campo-v130"&gt;&lt;label for="bairroVagaV130"&gt;Bairro&lt;/label&gt;&lt;input class="campo" id="bairroVagaV130" type="text" readonly="readonly" placeholder="Preenchido automaticamente"/&gt;&lt;/div&gt;'+
'&lt;/div&gt;'+
'&lt;div class="endereco-status-v130"&gt;O número do imóvel não é solicitado pelo EmpregaMais.&lt;/div&gt;'+
'&lt;div class="privacidade-endereco-v130"&gt;'+
'&lt;strong&gt;O que deseja mostrar aos candidatos?&lt;/strong&gt;'+
'&lt;div class="privacidade-opcoes-v130"&gt;'+
'&lt;div class="privacidade-opcao-v130"&gt;&lt;input id="enderecoCompletoV130" name="enderecoVisibilidadeRadioV130" type="radio" value="completo"/&gt;&lt;label for="enderecoCompletoV130"&gt;&lt;span&gt;&lt;b&gt;Endereço do local de trabalho&lt;/b&gt;&lt;small&gt;Mostra rua/logradouro, bairro, cidade e estado — sem número.&lt;/small&gt;&lt;/span&gt;&lt;/label&gt;&lt;/div&gt;'+
'&lt;div class="privacidade-opcao-v130"&gt;&lt;input checked="checked" id="enderecoBairroV130" name="enderecoVisibilidadeRadioV130" type="radio" value="bairro"/&gt;&lt;label for="enderecoBairroV130"&gt;&lt;span&gt;&lt;b&gt;Somente cidade e bairro&lt;/b&gt;&lt;small&gt;Oculta a rua. O candidato verá bairro, cidade e estado.&lt;/small&gt;&lt;/span&gt;&lt;/label&gt;&lt;/div&gt;'+
'&lt;div class="privacidade-opcao-v130"&gt;&lt;input id="enderecoCidadeV150" name="enderecoVisibilidadeRadioV130" type="radio" value="cidade"/&gt;&lt;label for="enderecoCidadeV150"&gt;&lt;span&gt;&lt;b&gt;Somente cidade&lt;/b&gt;&lt;small&gt;Mostra apenas a cidade e o estado ao candidato.&lt;/small&gt;&lt;/span&gt;&lt;/label&gt;&lt;/div&gt;'+
'&lt;/div&gt;'+
'&lt;div class="endereco-preview-v150" id="enderecoPreviewV150"&gt;&lt;/div&gt;'+
'&lt;/div&gt;'+
'&lt;input id="enderecoVisibilidadeV130" type="hidden" value="bairro"/&gt;';
grupo.appendChild(box);
function atualizarPreviewV150(){
var marcado=box.querySelector("input[name='enderecoVisibilidadeRadioV130']:checked");
var modo=marcado?marcado.value:"bairro";
var h=document.getElementById("enderecoVisibilidadeV130");
if(h)h.value=modo;
var rua=(document.getElementById("ruaVagaV130")||{}).value||"";
var bairro=(document.getElementById("bairroVagaV130")||{}).value||"";
var cidade=(document.getElementById("cidadeVaga")||{}).value||"";
var estado=(document.getElementById("estadoVaga")||{}).value||"";
var partes=modo==="completo" ? [rua,bairro,cidade,estado] :
modo==="cidade" ? [cidade,estado] :
[bairro,cidade,estado];
var exibido=partes.filter(Boolean).join(" · ");
var prev=document.getElementById("enderecoPreviewV150");
if(prev)prev.innerHTML="&lt;strong&gt;O candidato verá:&lt;/strong&gt; "+(exibido||"preencha o CEP para visualizar.");
}
box.querySelectorAll("input[name='enderecoVisibilidadeRadioV130']").forEach(function(r){
r.addEventListener("change",atualizarPreviewV150);
});
["cidadeVaga","estadoVaga"].forEach(function(id){
var e=document.getElementById(id);
if(e)e.addEventListener("change",atualizarPreviewV150);
});
window.atualizarPreviewEnderecoV150=atualizarPreviewV150;
atualizarPreviewV150();
}
window.preencherEnderecoCepV130=function(geo){
criarEnderecoV130();
var rua=document.getElementById("ruaVagaV130");
var bairro=document.getElementById("bairroVagaV130");
if(rua)rua.value=geo&amp;&amp;geo.rua?geo.rua:"";
if(bairro)bairro.value=geo&amp;&amp;geo.bairro?geo.bairro:"";
if(geo &amp;&amp; typeof window.preencherEstadoCidadePeloCepV151==="function"){
window.preencherEstadoCidadePeloCepV151(
geo.uf || geo.estado || "",
geo.cidade || geo.localidade || ""
);
}
setTimeout(function(){
if(typeof window.atualizarPreviewEnderecoV150==="function")window.atualizarPreviewEnderecoV150();
},180);
var estado=document.getElementById("estadoVaga");
if(estado&amp;&amp;geo&amp;&amp;geo.uf){
var alvo=Array.from(estado.options||[]).find(function(o){
return String(o.value||"").toUpperCase()===String(geo.uf).toUpperCase() ||
String(o.textContent||"").toUpperCase().indexOf(String(geo.uf).toUpperCase())&gt;=0;
});
if(alvo &amp;&amp; estado.value!==alvo.value){
estado.value=alvo.value;
estado.dispatchEvent(new Event("change",{bubbles:true}));
}
}
};
function instalar(){
criarEnderecoV130();
var cep=document.getElementById("cepVaga");
if(!cep || cep.dataset.enderecoV130==="1")return;
cep.dataset.enderecoV130="1";
var t=null;
cep.addEventListener("input",function(){
clearTimeout(t);
var n=String(cep.value||"").replace(/\D/g,"");
if(n.length!==8)return;
t=setTimeout(async function(){
var status=document.getElementById("cepStatusEM");
if(status){status.style.color="#667b8f";status.textContent="Buscando endereço...";}
var geo=typeof localizarCepEM==="function"?await localizarCepEM(n):null;
if(geo){
if(typeof coordenadasCepVagaEM!=="undefined")coordenadasCepVagaEM=geo;
window.preencherEnderecoCepV130(geo);
if(status){
status.style.color="#13804d";
status.textContent="Endereço localizado"+(geo.rua?" — "+geo.rua:"")+(geo.bairro?" · "+geo.bairro:"")+(geo.cidade?" · "+geo.cidade+"/"+geo.uf:"");
}
}else if(status){
status.style.color="#a96b00";
status.textContent="Não foi possível localizar este CEP.";
}
},350);
});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",instalar);
else instalar();
window.addEventListener("load",function(){setTimeout(instalar,150)});
})();
//
