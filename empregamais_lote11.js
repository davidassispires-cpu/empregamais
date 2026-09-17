/* EmpregaMais - JavaScript externo - lote 11 */

//
(function(){
function chaveEmpresaPerfilEM(){
var c=String(sessionStorage.getItem("empresaCnpj")||"").replace(/\D/g,"");
var e=String(sessionStorage.getItem("empresaEmail")||"").trim().toLowerCase();
return c||e||"empresa";
}
function assinantePerfilPublicoEM(){
var emp=empresaAtualPerfilEM();
var plano="";
try{
if(typeof planoAtualRecrutadorEM==="function"){
plano=String(planoAtualRecrutadorEM(emp)||"").toLowerCase();
}
}catch(e){}
if(!plano){
plano=String(
emp.plano ||
localStorage.getItem("planoEmpresaEmpregaMais") ||
""
).toLowerCase();
}
if(["trimestral","semestral","anual"].indexOf(plano)&gt;=0)return true;
if(typeof planoPagoRecrutadorEM==="function"){
try{return !!planoPagoRecrutadorEM(plano);}catch(e){}
}
return false;
}
function bloquearPerfilPublicoEM(){
var pub=document.getElementById("formPerfilPublicoEM");
if(!pub)return;
pub.setAttribute("data-perfil-rascunho-em","1");
}
function perfilSalvoEM(){
try{return JSON.parse(localStorage.getItem("perfilPublicoEmpresaEmpregaMais_"+chaveEmpresaPerfilEM())||"{}");}catch(e){return{};}
}
function empresaAtualPerfilEM(){
try{
if(typeof empresaLogadaPainelEM==="function")return empresaLogadaPainelEM()||{};
}catch(e){}
var lista=[];
try{lista=typeof empresasCadastradas==="function"?(empresasCadastradas()||[]):[];}catch(e){}
var c=String(sessionStorage.getItem("empresaCnpj")||"").replace(/\D/g,"");
var mail=String(sessionStorage.getItem("empresaEmail")||"").toLowerCase();
for(var i=0;i&lt;lista.length;i++){
if((c&amp;&amp;String(lista[i].cnpj||"").replace(/\D/g,"")===c)||(mail&amp;&amp;String(lista[i].email||"").toLowerCase()===mail))return lista[i];
}
return{};
}
function escPerfilEM(v){
return String(v==null?"":v).replace(/&amp;/g,"&amp;amp;").replace(/&lt;/g,"&amp;lt;").replace(/&gt;/g,"&amp;gt;").replace(/"/g,"&amp;quot;");
}
function preencher(id,v){var el=document.getElementById(id);if(el)el.value=v||"";}
function abrirPaginaPerfilEditorEM(){
var p=document.getElementById("pagina-perfil-empresa-em");if(!p)return;
var paginas=document.querySelectorAll("[id^='pagina-']");
for(var i=0;i&lt;paginas.length;i++)paginas[i].style.display="none";
p.style.display="block";
var emp=empresaAtualPerfilEM(), pf=perfilSalvoEM();
preencher("perfilNomeEM",pf.nome||emp.nomeFantasia||emp.nome||"");
preencher("perfilSegmentoEM",pf.segmento||emp.segmento||"");
preencher("perfilCidadeEM",pf.cidade||emp.cidade||"");
preencher("perfilUfEM",pf.uf||emp.uf||"");
preencher("perfilPorteEM",pf.porte||"");
preencher("perfilFundacaoEM",pf.fundacao||"");
preencher("perfilSloganEM",pf.slogan||"");
preencher("perfilMissaoEM",pf.missao||"");
preencher("perfilVisaoEM",pf.visao||"");
preencher("perfilValoresEM",pf.valores||"");
preencher("perfilSobreEM",pf.sobre||emp.sobre||"");
preencher("perfilCulturaEM",pf.cultura||"");
preencher("perfilBeneficiosEM",pf.beneficios||"");
preencher("perfilCarreiraEM",pf.carreira||"");
preencher("perfilAmbienteEM",pf.ambiente||"");
preencher("perfilModalidadesEM",pf.modalidades||"");
preencher("perfilAreasEM",pf.areas||"");
preencher("perfilSiteEM",pf.site||"");
preencher("perfilLinkedinEM",pf.linkedin||"");
preencher("perfilInstagramEM",pf.instagram||"");
preencher("perfilFacebookEM",pf.facebook||"");
preencher("perfilVideoEM",pf.video||"");
preencher("perfilEmailPublicoEM",pf.emailPublico||"");
preencher("perfilLogoEM",pf.logo||emp.logo||"");
preencher("perfilCapaEM",pf.capa||"");
preencher("contaRazaoEM",emp.razaoSocial||emp.nome||"");
preencher("contaCnpjEM",emp.cnpj||sessionStorage.getItem("empresaCnpj")||"");
preencher("contaResponsavelEM",emp.responsavel||emp.nomeResponsavel||"");
preencher("contaEmailEM",emp.email||sessionStorage.getItem("empresaEmail")||"");
preencher("contaTelefoneEM",emp.telefone||emp.whatsapp||"");
preencher("contaCepEM",emp.cep||"");
preencher("contaCidadeEM",emp.cidadeAdministrativa||emp.cidade||"");
preencher("contaUfEM",emp.ufAdministrativa||emp.uf||"");
if(!assinantePerfilPublicoEM()){
bloquearPerfilPublicoEM();
}
window.scrollTo(0,0);
}
window.abaDadosEmpresaEM=function(aba){
if(aba!=="conta"&amp;&amp;!assinantePerfilPublicoEM()){
bloquearPerfilPublicoEM();
}
var pub=document.getElementById("formPerfilPublicoEM"),conta=document.getElementById("formDadosContaEM");
var tp=document.getElementById("tabPerfilPublicoEM"),tc=document.getElementById("tabDadosContaEM");
var publico=aba!=="conta";
if(pub)pub.style.display=publico?"block":"none";
if(conta)conta.style.display=publico?"none":"block";
if(tp)tp.classList.toggle("ativo",publico);
if(tc)tc.classList.toggle("ativo",!publico);
};
window.salvarPerfilPublicoEmpresaEM=function(){
var perfilPodePublicarEM=assinantePerfilPublicoEM();
function v(id){var e=document.getElementById(id);return e?String(e.value||"").trim():"";}
var pf={
nome:v("perfilNomeEM"),segmento:v("perfilSegmentoEM"),cidade:v("perfilCidadeEM"),uf:v("perfilUfEM").toUpperCase(),
porte:v("perfilPorteEM"),fundacao:v("perfilFundacaoEM"),slogan:v("perfilSloganEM"),sobre:v("perfilSobreEM"),
missao:v("perfilMissaoEM"),visao:v("perfilVisaoEM"),valores:v("perfilValoresEM"),cultura:v("perfilCulturaEM"),
beneficios:v("perfilBeneficiosEM"),carreira:v("perfilCarreiraEM"),ambiente:v("perfilAmbienteEM"),
modalidades:v("perfilModalidadesEM"),areas:v("perfilAreasEM"),site:v("perfilSiteEM"),
linkedin:v("perfilLinkedinEM"),instagram:v("perfilInstagramEM"),facebook:v("perfilFacebookEM"),
video:v("perfilVideoEM"),emailPublico:v("perfilEmailPublicoEM"),logo:v("perfilLogoEM"),capa:v("perfilCapaEM"),
publicado:true,atualizadoEm:new Date().toISOString()
};
localStorage.setItem("perfilPublicoEmpresaEmpregaMais_"+chaveEmpresaPerfilEM(),JSON.stringify(pf));
alert("Perfil publico salvo com sucesso.");
};
window.salvarDadosContaEmpresaEM=function(){
var emp=empresaAtualPerfilEM();
function v(id){var e=document.getElementById(id);return e?String(e.value||"").trim():"";}
emp.razaoSocial=v("contaRazaoEM");
emp.responsavel=v("contaResponsavelEM");
emp.email=v("contaEmailEM");
emp.telefone=v("contaTelefoneEM");
emp.cep=v("contaCepEM");
emp.cidadeAdministrativa=v("contaCidadeEM");
emp.ufAdministrativa=v("contaUfEM").toUpperCase();
try{
var lista=empresasCadastradas()||[];
var c=String(emp.cnpj||"").replace(/\D/g,"");
for(var i=0;i&lt;lista.length;i++)if(String(lista[i].cnpj||"").replace(/\D/g,"")===c){lista[i]=Object.assign({},lista[i],emp);break;}
salvarArray("empresasEmpregaMais",lista);
}catch(e){}
alert("Dados da conta salvos.");
};
window.visualizarPerfilPublicoEmpresaEM=function(){
var visualizacaoSomentePreviaEM=!assinantePerfilPublicoEM();
var pf=perfilSalvoEM(),emp=empresaAtualPerfilEM();
if(!pf.nome)pf.nome=emp.nomeFantasia||emp.nome||"Empresa";
var vagas=[];
try{vagas=typeof vagasDaEmpresa==="function"?(vagasDaEmpresa()||[]):[];}catch(e){}
vagas=vagas.filter(function(x){return String(x.aprovacao||"").toLowerCase()==="aprovada"&amp;&amp;String(x.status||"").toLowerCase()!=="encerrada";});
var vagasHtml=vagas.map(function(x){
var titulo=x.cargo||x.titulo||x.vaga||"Vaga";
var local=(x.cidade||"")+(x.uf?" - "+x.uf:"");
return "&lt;div class='empresa-publica-vaga-em'&gt;&lt;div&gt;&lt;strong&gt;"+escPerfilEM(titulo)+"&lt;/strong&gt;&lt;small&gt;"+escPerfilEM(local)+" &amp;bull; "+escPerfilEM(x.modalidade||"")+"&lt;/small&gt;&lt;/div&gt;&lt;button type='button' data-vaga-publica-em='"+escPerfilEM(x.id)+"'&gt;Ver vaga&lt;/button&gt;&lt;/div&gt;";
}).join("");
var logo=pf.logo?"&lt;img class='empresa-publica-logo-em' src='"+escPerfilEM(pf.logo)+"' alt='Logo da empresa'/&gt;":"&lt;div class='empresa-publica-logo-em'&gt;&lt;/div&gt;";
var capa=pf.capa?" style='background-image:url(&amp;quot;"+escPerfilEM(pf.capa)+"&amp;quot;)'":"";
var html="&lt;button class='empresa-perfil-voltar-em' type='button' onclick='abrirEditorPerfilEmpresaEM()'&gt;&amp;#8592; Voltar&lt;/button&gt;"+
"&lt;section class='empresa-publica-hero-em'&gt;&lt;div class='empresa-publica-capa-em'"+capa+"&gt;&lt;/div&gt;&lt;div class='empresa-publica-info-em'&gt;"+logo+
"&lt;h1&gt;"+escPerfilEM(pf.nome)+"&lt;/h1&gt;"+(pf.slogan?"&lt;p class='empresa-publica-slogan-v21'&gt;"+escPerfilEM(pf.slogan)+"&lt;/p&gt;":"")+"&lt;div class='empresa-publica-meta-em'&gt;"+escPerfilEM(pf.segmento||"Empresa")+" &amp;bull; "+escPerfilEM([pf.cidade,pf.uf].filter(Boolean).join(" / "))+"&lt;/div&gt;"+
"&lt;span class='empresa-publica-selo-em'&gt;Perfil da empresa&lt;/span&gt;&lt;/div&gt;&lt;/section&gt;"+
"&lt;div class='empresa-publica-grid-em'&gt;&lt;section class='empresa-publica-box-em'&gt;&lt;h3&gt;Sobre a empresa&lt;/h3&gt;&lt;p&gt;"+escPerfilEM(pf.sobre||"A empresa ainda nao adicionou uma apresentacao.")+"&lt;/p&gt;"+
(pf.missao?"&lt;h3&gt;Missao&lt;/h3&gt;&lt;p&gt;"+escPerfilEM(pf.missao)+"&lt;/p&gt;":"")+
(pf.visao?"&lt;h3&gt;Visao&lt;/h3&gt;&lt;p&gt;"+escPerfilEM(pf.visao)+"&lt;/p&gt;":"")+
(pf.valores?"&lt;h3&gt;Valores&lt;/h3&gt;&lt;p&gt;"+escPerfilEM(pf.valores)+"&lt;/p&gt;":"")+
"&lt;h3&gt;Cultura e ambiente&lt;/h3&gt;&lt;p&gt;"+escPerfilEM(pf.cultura||"Informacao ainda nao adicionada.")+"&lt;/p&gt;"+
(pf.ambiente?"&lt;h3&gt;Como e trabalhar aqui&lt;/h3&gt;&lt;p&gt;"+escPerfilEM(pf.ambiente)+"&lt;/p&gt;":"")+
"&lt;h3&gt;Beneficios&lt;/h3&gt;&lt;p&gt;"+escPerfilEM(pf.beneficios||"Informacao ainda nao adicionada.")+"&lt;/p&gt;"+
(pf.carreira?"&lt;h3&gt;Carreira e desenvolvimento&lt;/h3&gt;&lt;p&gt;"+escPerfilEM(pf.carreira)+"&lt;/p&gt;":"")+"&lt;/section&gt;"+
"&lt;aside class='empresa-publica-box-em'&gt;&lt;h3&gt;Informacoes&lt;/h3&gt;&lt;div class='empresa-publica-lista-em'&gt;"+
(pf.porte?"&lt;span&gt;&lt;strong&gt;Porte:&lt;/strong&gt; "+escPerfilEM(pf.porte)+"&lt;/span&gt;":"")+
(pf.fundacao?"&lt;span&gt;&lt;strong&gt;Fundacao:&lt;/strong&gt; "+escPerfilEM(pf.fundacao)+"&lt;/span&gt;":"")+
(pf.modalidades?"&lt;span&gt;&lt;strong&gt;Trabalho:&lt;/strong&gt; "+escPerfilEM(pf.modalidades)+"&lt;/span&gt;":"")+
(pf.areas?"&lt;span&gt;&lt;strong&gt;Areas que mais contratam:&lt;/strong&gt; "+escPerfilEM(pf.areas)+"&lt;/span&gt;":"")+
(pf.site?"&lt;span&gt;&lt;strong&gt;Site:&lt;/strong&gt; "+escPerfilEM(pf.site)+"&lt;/span&gt;":"")+
(pf.linkedin?"&lt;span&gt;&lt;strong&gt;LinkedIn:&lt;/strong&gt; "+escPerfilEM(pf.linkedin)+"&lt;/span&gt;":"")+
(pf.instagram?"&lt;span&gt;&lt;strong&gt;Instagram:&lt;/strong&gt; "+escPerfilEM(pf.instagram)+"&lt;/span&gt;":"")+
(pf.facebook?"&lt;span&gt;&lt;strong&gt;Facebook:&lt;/strong&gt; "+escPerfilEM(pf.facebook)+"&lt;/span&gt;":"")+
(pf.video?"&lt;span&gt;&lt;strong&gt;Video institucional:&lt;/strong&gt; "+escPerfilEM(pf.video)+"&lt;/span&gt;":"")+
(pf.emailPublico?"&lt;span&gt;&lt;strong&gt;Contato:&lt;/strong&gt; "+escPerfilEM(pf.emailPublico)+"&lt;/span&gt;":"")+
"&lt;/div&gt;&lt;/aside&gt;&lt;/div&gt;"+
"&lt;section class='empresa-publica-box-em empresa-publica-vagas-em'&gt;&lt;h3&gt;Vagas abertas &lt;span&gt;("+vagas.length+")&lt;/span&gt;&lt;/h3&gt;"+(vagasHtml||"&lt;p&gt;Nenhuma oportunidade aberta no momento.&lt;/p&gt;")+"&lt;/section&gt;";
var pagina=document.getElementById("pagina-perfil-publico-empresa-em"),box=document.getElementById("conteudoPerfilPublicoEmpresaEM");
var paginas=document.querySelectorAll("[id^='pagina-']");
for(var i=0;i&lt;paginas.length;i++)paginas[i].style.display="none";
box.innerHTML=html;pagina.style.display="block";window.scrollTo(0,0);
var bs=box.querySelectorAll("[data-vaga-publica-em]");
for(var j=0;j&lt;bs.length;j++)bs[j].onclick=function(){
var id=this.getAttribute("data-vaga-publica-em");
if(typeof irPara==="function"){irPara("vaga",id);return;}
if(typeof abrirVaga==="function"){abrirVaga(id);return;}
if(typeof abrirDetalheVaga==="function")abrirDetalheVaga(id);
};
};
window.abrirEditorPerfilEmpresaEM=abrirPaginaPerfilEditorEM;
var old=window.irPara;
if(typeof old==="function"&amp;&amp;!window.perfilEmpresaRotaPatchEM){
window.perfilEmpresaRotaPatchEM=true;
window.irPara=function(pagina){
if(pagina==="perfil-empresa"){abrirPaginaPerfilEditorEM();return false;}
return old.apply(this,arguments);
};
}
})();
//
