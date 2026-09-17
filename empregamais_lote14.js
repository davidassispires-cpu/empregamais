/* EmpregaMais - JavaScript externo - lote 14 */

//
(function(){
var PLANOS_V127={
basico:{
id:"basico",nome:"Básico",pago:false,
logo:false,whatsapp:false,link:false,
vagas:3,destaques:0,urgentes:0,dias:15
},
trimestral:{
id:"trimestral",nome:"Trimestral",pago:true,
logo:true,whatsapp:true,link:true,
vagas:50,destaques:10,urgentes:5,dias:90
},
semestral:{
id:"semestral",nome:"Semestral",pago:true,
logo:true,whatsapp:true,link:true,
vagas:100,destaques:20,urgentes:7,dias:180
},
anual:{
id:"anual",nome:"Anual",pago:true,
logo:true,whatsapp:true,link:true,
vagas:300,destaques:40,urgentes:10,dias:365
}
};
function norm(v){
v=String(v||"").trim().toLowerCase();
if(v==="gratis"||v==="gratuito"||v==="free"||v==="basic"||v==="essencial")return "basico";
if(v==="profissional")return "trimestral";
if(v==="premium")return "anual";
return v;
}
function empresaAtual(){
var e=null;
try{
if(typeof window.empresaLogadaPainelEM==="function"){
e=window.empresaLogadaPainelEM();
if(e&amp;&amp;Object.keys(e).length)return e;
}
}catch(x){}
try{
if(typeof window.obterEmpresaAtual==="function"){
e=window.obterEmpresaAtual();
if(e&amp;&amp;Object.keys(e).length)return e;
}
}catch(x){}
try{
var lista=JSON.parse(localStorage.getItem("empresasEmpregaMais")||"[]");
var c=String(sessionStorage.getItem("empresaCnpj")||"").replace(/\D/g,"");
var m=String(sessionStorage.getItem("empresaEmail")||"").trim().toLowerCase();
for(var i=0;i&lt;lista.length;i++){
var ec=String(lista[i].cnpj||"").replace(/\D/g,"");
var em=String(lista[i].email||"").trim().toLowerCase();
if((c&amp;&amp;ec===c)||(m&amp;&amp;em===m))return lista[i];
}
}catch(x){}
return {};
}
function chavePlano(){
var e=empresaAtual();
var p=norm(e.plano_id||e.planoId||e.plano||e.plano_nome||e.planoNome||"");
if(PLANOS_V127[p])return p;
try{
if(typeof window.planoAtivoEmpresaV38==="function"){
p=norm(window.planoAtivoEmpresaV38());
if(PLANOS_V127[p])return p;
}
}catch(x){}
return "basico";
}
function cfg(){
return PLANOS_V127[chavePlano()]||PLANOS_V127.basico;
}
window.configuracaoPlanoEmpresa=function(plano){
var p=norm(plano),c=PLANOS_V127[p]||PLANOS_V127.basico;
return {
id:c.id,nome:c.nome,preco:0,
vagasMes:c.vagas,destaquesMes:c.destaques,
urgentesMes:c.urgentes,diasVaga:c.dias,
logo:c.logo,
candidatura:c.pago?["email","whatsapp","link"]:["email"]
};
};
window.planoEmpresaAtual=function(){
return window.configuracaoPlanoEmpresa(chavePlano());
};
window.planoPermiteContatoAvancado=function(){
return cfg().pago===true;
};
function limparAvisosAntigos(){
document.querySelectorAll(".aviso-plano-logo-em").forEach(function(x){x.remove()});
var aviso=document.getElementById("contatoUpgradeAviso");
if(aviso){
aviso.classList.toggle("ativo",!cfg().pago);
if(cfg().pago)aviso.style.display="none";
else aviso.style.display="";
}
}
window.aplicarRecursosPlanoPublicacaoEmpregaMais=function(){
var pagina=document.getElementById("pagina-publicar");
if(!pagina)return;
var c=cfg();
var logo=document.getElementById("logoVaga");
if(logo)logo.disabled=!c.logo;
var w=document.getElementById("tipoContatoWhatsapp");
var l=document.getElementById("tipoContatoLink");
var ow=document.getElementById("opcaoContatoWhatsapp");
var ol=document.getElementById("opcaoContatoLink");
if(w)w.disabled=!c.whatsapp;
if(l)l.disabled=!c.link;
if(ow)ow.classList.toggle("bloqueada",!c.whatsapp);
if(ol)ol.classList.toggle("bloqueada",!c.link);
var selo=document.getElementById("contatoPlanoSelo");
if(selo)selo.textContent="Plano "+c.nome;
limparAvisosAntigos();
if(!c.pago){
var re=document.getElementById("tipoContatoEmail");
if(re)re.checked=true;
}
if(typeof window.atualizarTipoContatoVaga==="function"){
window.atualizarTipoContatoVaga();
}
};
window.prepararContatoPublicacao=function(){
var c=cfg(),e=empresaAtual();
var selo=document.getElementById("contatoPlanoSelo");
if(selo)selo.textContent="Plano "+c.nome;
var email=document.getElementById("emailCandidaturaVaga");
if(email&amp;&amp;!email.value&amp;&amp;e)email.value=e.email_corporativo||e.email||"";
var w=document.getElementById("tipoContatoWhatsapp");
var l=document.getElementById("tipoContatoLink");
var ow=document.getElementById("opcaoContatoWhatsapp");
var ol=document.getElementById("opcaoContatoLink");
if(w)w.disabled=!c.whatsapp;
if(l)l.disabled=!c.link;
if(ow)ow.classList.toggle("bloqueada",!c.whatsapp);
if(ol)ol.classList.toggle("bloqueada",!c.link);
limparAvisosAntigos();
if(!c.pago){
var re=document.getElementById("tipoContatoEmail");
if(re)re.checked=true;
}
if(typeof window.atualizarTipoContatoVaga==="function")window.atualizarTipoContatoVaga();
};
function aplicar(){
if(!document.getElementById("pagina-publicar"))return;
window.aplicarRecursosPlanoPublicacaoEmpregaMais();
}
document.addEventListener("DOMContentLoaded",aplicar);
window.addEventListener("load",function(){setTimeout(aplicar,250)});
document.addEventListener("empregamais:empresa-sincronizada",function(){setTimeout(aplicar,80)});
window.EmpregaMaisPlanoEmpresaV127={
atual:chavePlano,
configuracao:cfg
};
})();
//
