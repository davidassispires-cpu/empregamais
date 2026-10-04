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
'<div class="endereco-linha-v130">'+
'<div class="endereco-campo-v130"><label for="ruaVagaV130">Rua / logradouro</label><input class="campo" id="ruaVagaV130" type="text" readonly="readonly" placeholder="Preenchido automaticamente pelo CEP"/></div>'+
'<div class="endereco-campo-v130"><label for="bairroVagaV130">Bairro</label><input class="campo" id="bairroVagaV130" type="text" readonly="readonly" placeholder="Preenchido automaticamente"/></div>'+
'</div>'+
'<div class="endereco-status-v130">O número do imóvel não é solicitado pelo EmpregaMais.</div>'+
'<div class="privacidade-endereco-v130">'+
'<strong>O que deseja mostrar aos candidatos?</strong>'+
'<div class="privacidade-opcoes-v130">'+
'<div class="privacidade-opcao-v130"><input id="enderecoCompletoV130" name="enderecoVisibilidadeRadioV130" type="radio" value="completo"/><label for="enderecoCompletoV130"><span><b>Endereço do local de trabalho</b><small>Mostra rua/logradouro, bairro, cidade e estado — sem número.</small></span></label></div>'+
'<div class="privacidade-opcao-v130"><input checked="checked" id="enderecoBairroV130" name="enderecoVisibilidadeRadioV130" type="radio" value="bairro"/><label for="enderecoBairroV130"><span><b>Somente cidade e bairro</b><small>Oculta a rua. O candidato verá bairro, cidade e estado.</small></span></label></div>'+
'<div class="privacidade-opcao-v130"><input id="enderecoCidadeV150" name="enderecoVisibilidadeRadioV130" type="radio" value="cidade"/><label for="enderecoCidadeV150"><span><b>Somente cidade</b><small>Mostra apenas a cidade e o estado ao candidato.</small></span></label></div>'+
'</div>'+
'<div class="endereco-preview-v150" id="enderecoPreviewV150"></div>'+
'</div>'+
'<input id="enderecoVisibilidadeV130" type="hidden" value="bairro"/>';
grupo.appendChild(box);
function atualizarPreviewV150(){
var marcado=box.querySelector("input[name='enderecoVisibilidadeRadioV130']:checked");
var modo=marcado?marcado.value:"bairro";
var h=document.getElementById("enderecoVisibilidadeV130");
if(h)h.value=modo;

function valorCampo(ids){
for(var i=0;i<ids.length;i++){
var el=document.getElementById(ids[i]);
if(!el)continue;
var v=String(el.value||"").trim();
if(v)return v;
}
return "";
}
function textoSelect(id){
var el=document.getElementById(id);
if(!el)return "";
if(el.tagName==="SELECT" && el.selectedIndex>=0){
var op=el.options[el.selectedIndex];
var t=String((op&&op.textContent)||"").trim();
if(t && !/^selecione/i.test(t))return t;
}
return String(el.value||"").trim();
}

var geo=window.__enderecoCepUltimoV130||{};
var rua=String(geo.rua||geo.logradouro||"").trim() ||
valorCampo(["ruaVagaV130","logradouroVaga","ruaVaga","enderecoVaga","logradouroLocalVaga"]);
var bairro=String(geo.bairro||"").trim() ||
valorCampo(["bairroVagaV130","bairroVaga","bairroLocalVaga"]);
var cidade=String(geo.cidade||geo.localidade||"").trim() || textoSelect("cidadeVaga");
var estado=String(geo.uf||geo.estado||"").trim() || textoSelect("estadoVaga");

var partes;
if(modo==="completo")partes=[rua,bairro,cidade,estado];
else if(modo==="cidade")partes=[cidade,estado];
else partes=[bairro,cidade,estado];

var exibido=partes.filter(function(v){return String(v||"").trim();}).join(" · ");
var prev=document.getElementById("enderecoPreviewV150");
if(prev)prev.innerHTML="<strong>O candidato verá:</strong> "+(exibido||"preencha o CEP para visualizar.");
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
geo=geo||{};
window.__enderecoCepUltimoV130={
rua:geo.rua||geo.logradouro||geo.street||geo.address||"",
bairro:geo.bairro||geo.neighborhood||"",
cidade:geo.cidade||geo.localidade||geo.city||"",
uf:geo.uf||geo.estado||geo.state||""
};
var rua=document.getElementById("ruaVagaV130");
var bairro=document.getElementById("bairroVagaV130");
if(rua)rua.value=window.__enderecoCepUltimoV130.rua;
if(bairro)bairro.value=window.__enderecoCepUltimoV130.bairro;
if(geo && typeof window.preencherEstadoCidadePeloCepV151==="function"){
window.preencherEstadoCidadePeloCepV151(
geo.uf || geo.estado || "",
geo.cidade || geo.localidade || ""
);
}
setTimeout(function(){
if(typeof window.atualizarPreviewEnderecoV150==="function")window.atualizarPreviewEnderecoV150();
},180);
var estado=document.getElementById("estadoVaga");
if(estado&&geo&&geo.uf){
var alvo=Array.from(estado.options||[]).find(function(o){
return String(o.value||"").toUpperCase()===String(geo.uf).toUpperCase() ||
String(o.textContent||"").toUpperCase().indexOf(String(geo.uf).toUpperCase())>=0;
});
if(alvo && estado.value!==alvo.value){
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