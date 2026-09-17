/* EmpregaMais - JavaScript externo - lote 12 */

//
(function(){
var vagaUrgenteSelecionadaV9=null;
function normalizarPlanoV9(v){
return String(v||"").trim().toLowerCase();
}
function empresaV9(){
try{
if(typeof empresaLogadaPainelEM==="function")return empresaLogadaPainelEM()||{};
}catch(e){}
try{
var lista=typeof empresasCadastradas==="function"?(empresasCadastradas()||[]):[];
var c=String(sessionStorage.getItem("empresaCnpj")||"").replace(/\D/g,"");
var m=String(sessionStorage.getItem("empresaEmail")||"").trim().toLowerCase();
for(var i=0;i<lista.length;i++){
if((c&&String(lista[i].cnpj||"").replace(/\D/g,"")===c)||(m&&String(lista[i].email||"").trim().toLowerCase()===m))return lista[i];
}
}catch(e){}
return{};
}
window.planoAtualEmpresaV9=function(){
var e=empresaV9();
return normalizarPlanoV9(e.plano||localStorage.getItem("planoEmpresaEmpregaMais")||"gratuito");
};
window.empresaAssinanteV9=function(){
var p=window.planoAtualEmpresaV9();
return ["trimestral","semestral","anual"].indexOf(p)>=0;
};
window.empresaVerificadaV9=function(){
var e=empresaV9();
return window.empresaAssinanteV9() && (
e.verificada===true ||
normalizarPlanoV9(e.verificacaoStatus)==="verificada" ||
normalizarPlanoV9(e.verificacaoStatus)==="verificado"
);
};
function vagasMesAtualV9(){
var vagas=[];
try{vagas=typeof vagasDaEmpresa==="function"?(vagasDaEmpresa()||[]):[];}catch(e){}
var agora=new Date(), mes=agora.getMonth(), ano=agora.getFullYear(), n=0;
for(var i=0;i<vagas.length;i++){
var raw=vagas[i].criadoEm||vagas[i].dataCriacao||vagas[i].data||vagas[i].publicadaEm||"";
var d=new Date(raw);
if(!isNaN(d.getTime())&&d.getMonth()===mes&&d.getFullYear()===ano)n++;
}
return n;
}
window.podePublicarVagaV9=function(){
if(window.empresaAssinanteV9())return true;
return vagasMesAtualV9()<3;
};
window.resumoPlanoEmpresaV9=function(){
if(window.empresaAssinanteV9()){
return {pago:true,limite:null,dias:null,usadas:vagasMesAtualV9()};
}
return {pago:false,limite:3,dias:15,usadas:vagasMesAtualV9()};
};
function localizarVagaV9(id){
var vagas=[];
try{vagas=typeof carregarVagas==="function"?(carregarVagas()||[]):[];}catch(e){}
if(!vagas.length){
try{vagas=JSON.parse(localStorage.getItem("vagasEmpregaMais")||"[]");}catch(e){}
}
for(var i=0;i<vagas.length;i++)if(String(vagas[i].id)===String(id))return vagas[i];
return null;
}
function salvarVagaV9(vaga){
var chaves=["vagasEmpregaMais","vagas"];
for(var k=0;k<chaves.length;k++){
try{
var a=JSON.parse(localStorage.getItem(chaves[k])||"[]"),achou=false;
if(!Array.isArray(a))continue;
for(var i=0;i<a.length;i++){
if(String(a[i].id)===String(vaga.id)){a[i]=Object.assign({},a[i],vaga);achou=true;break;}
}
if(achou)localStorage.setItem(chaves[k],JSON.stringify(a));
}catch(e){}
}
try{
if(typeof salvarVagas==="function"){
var lista=typeof carregarVagas==="function"?(carregarVagas()||[]):[];
for(var j=0;j<lista.length;j++)if(String(lista[j].id)===String(vaga.id)){lista[j]=Object.assign({},lista[j],vaga);break;}
salvarVagas(lista);
}
}catch(e){}
}
window.abrirContratacaoUrgenteV9=function(id){
var vaga=localizarVagaV9(id);
if(!vaga){alert("N\u00E3o foi poss\u00EDvel localizar esta vaga.");return false;}
if(String(vaga.status||"").toLowerCase()==="encerrada"){
alert("Uma vaga encerrada nao pode receber o selo de Contrata\u00E7\u00E3o Urgente.");return false;
}
if(vaga.contratacaoUrgente===true){
alert("O selo de Contrata\u00E7\u00E3o Urgente ja esta ativo nesta vaga.");return false;
}
vagaUrgenteSelecionadaV9=String(id);
var m=document.getElementById("modalUrgenteV9");
if(m)m.style.display="flex";
};
window.fecharUrgenteV9=function(){
var m=document.getElementById("modalUrgenteV9");if(m)m.style.display="none";
vagaUrgenteSelecionadaV9=null;
};
window.iniciarPagamentoUrgenteV9=function(){
if(!vagaUrgenteSelecionadaV9)return;
var vaga=localizarVagaV9(vagaUrgenteSelecionadaV9);
if(!vaga)return;
vaga.contratacaoUrgentePagamentoStatus="aguardando_pagamento";
vaga.contratacaoUrgenteValor=9.90;
vaga.contratacaoUrgenteSolicitadoEm=new Date().toISOString();
salvarVagaV9(vaga);
fecharUrgenteV9();
alert("Solicitacao criada. O selo sera ativado somente apos a confirmacao do pagamento de R$ 9,90. A integracao do pagamento sera conectada nesta etapa.");
try{
if(typeof montarPainelReferenciaRecrutadorEM==="function")montarPainelReferenciaRecrutadorEM();
}catch(e){}
};
window.confirmarPagamentoUrgenteV9=function(id,referencia){
var vaga=localizarVagaV9(id);if(!vaga)return false;
vaga.contratacaoUrgente=true;
vaga.contratacaoUrgentePagamentoStatus="pago";
vaga.contratacaoUrgentePagamentoReferencia=String(referencia||"");
vaga.contratacaoUrgenteAtivadoEm=new Date().toISOString();
salvarVagaV9(vaga);
return true;
};
window.botaoUrgenteV9=function(vaga){
if(!vaga||!vaga.id)return"";
if(vaga.contratacaoUrgente===true)return "<span class='em-urgente-v9'>&amp;#9889; CONTRATA\u00C7\u00C3O URGENTE</span>";
if(String(vaga.contratacaoUrgentePagamentoStatus||"")==="aguardando_pagamento")
return "<span class='em-urgente-pendente-v9'>Aguardando pagamento - R$ 9,90</span>";
return "<span class='em-urgente-acoes-v10'><button class='em-previa-btn-v10' type='button' onclick='abrirPreviaUrgenteV10(&amp;quot;"+String(vaga.id).replace(/"/g,"&amp;quot;")+"&amp;quot;)'>Previa</button><button class='em-urgente-btn-v9' type='button' onclick='abrirContratacaoUrgenteV9(&amp;quot;"+String(vaga.id).replace(/"/g,"&amp;quot;")+"&amp;quot;)'>&amp;#9889; Contrata\u00E7\u00E3o Urgente - R$ 9,90</button></span>";
};
window.aplicarRegrasVagaGratuitaV9=function(vaga){
if(!vaga||window.empresaAssinanteV9())return vaga;
vaga.planoPublicacao="gratuito";
vaga.duracaoDias=15;
if(!vaga.expiraEm){
var base=new Date(vaga.criadoEm||vaga.dataCriacao||new Date().toISOString());
base.setDate(base.getDate()+15);
vaga.expiraEm=base.toISOString();
}
return vaga;
};
function inserirResumoGratisV9(){
if(window.empresaAssinanteV9())return;
var p=document.getElementById("pagina-painel-empresa");
if(!p)return;
var alvo=p.querySelector(".recrutador-main-ref-em")||p;
if(alvo.querySelector(".em-limite-gratis-v9"))return;
var r=window.resumoPlanoEmpresaV9(),d=document.createElement("div");
d.className="em-limite-gratis-v9";
d.innerHTML="<strong>Plano Gratuito:</strong> "+r.usadas+" de 3 vagas utilizadas neste mes. Cada vaga gratuita permanece ativa por ate 15 dias.";
alvo.insertBefore(d,alvo.firstChild);
}
function injetarUrgenteNasVagasV9(){
var p=document.getElementById("pagina-painel-empresa");if(!p)return;
var vagas=[];
try{vagas=typeof vagasDaEmpresa==="function"?(vagasDaEmpresa()||[]):[];}catch(e){}
var linhas=p.querySelectorAll("tr");
for(var i=0;i<linhas.length;i++){
var linha=linhas[i],texto=linha.textContent||"";
var vaga=null;
for(var j=0;j<vagas.length;j++){
var titulo=String(vagas[j].cargo||vagas[j].titulo||vagas[j].vaga||"");
if(titulo&&texto.indexOf(titulo)>=0){vaga=vagas[j];break;}
}
if(!vaga||linha.querySelector(".em-urgente-btn-v9,.em-urgente-v9,.em-urgente-pendente-v9"))continue;
var cells=linha.querySelectorAll("td");if(!cells.length)continue;
var acoes=cells[cells.length-1];
var wrap=document.createElement("span");
wrap.innerHTML=window.botaoUrgenteV9(vaga);
if(wrap.firstChild)acoes.insertBefore(wrap.firstChild,acoes.firstChild);
}
}
function atualizarPainelV9(){
setTimeout(function(){inserirResumoGratisV9();injetarUrgenteNasVagasV9();},80);
}
document.addEventListener("DOMContentLoaded",atualizarPainelV9);
var oldIr=window.irPara;
if(typeof oldIr==="function"&&!window.regrasPlanoRotaV9){
window.regrasPlanoRotaV9=true;
window.irPara=function(p){
if(p==="publicar"&&!window.podePublicarVagaV9()){
alert("O Plano Gratuito permite at\u00E9 3 vagas por mes. Para publicar novas oportunidades, escolha um dos planos de assinatura.");
oldIr.call(this,"planos");return false;
}
var r=oldIr.apply(this,arguments);
if(p==="painel-empresa")atualizarPainelV9();
return r;
};
}
})();
//