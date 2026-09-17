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
if(["trimestral","semestral","anual"].indexOf(plano)>=0)return true;
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
for(var i=0;i<lista.length;i++){
if((c&&String(lista[i].cnpj||"").replace(/\D/g,"")===c)||(mail&&String(lista[i].email||"").toLowerCase()===mail))return lista[i];
}
return{};
}
function escPerfilEM(v){
return String(v==null?"":v).replace(/&amp;/g,"&amp;amp;").replace(/</g,"&amp;lt;").replace(/>/g,"&amp;gt;").replace(/"/g,"&amp;quot;");
}
function preencher(id,v){var el=document.getElementById(id);if(el)el.value=v||"";}
function abrirPaginaPerfilEditorEM(){
var p=document.getElementById("pagina-perfil-empresa-em");if(!p)return;
var paginas=document.querySelectorAll("[id^='pagina-']");
for(var i=0;i<paginas.length;i++)paginas[i].style.display="none";
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
if(aba!=="conta"&&!assinantePerfilPublicoEM()){
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
for(var i=0;i<lista.length;i++)if(String(lista[i].cnpj||"").replace(/\D/g,"")===c){lista[i]=Object.assign({},lista[i],emp);break;}
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
vagas=vagas.filter(function(x){return String(x.aprovacao||"").toLowerCase()==="aprovada"&&String(x.status||"").toLowerCase()!=="encerrada";});
var vagasHtml=vagas.map(function(x){
var titulo=x.cargo||x.titulo||x.vaga||"Vaga";
var local=(x.cidade||"")+(x.uf?" - "+x.uf:"");
return "<div class='empresa-publica-vaga-em'><div><strong>"+escPerfilEM(titulo)+"</strong><small>"+escPerfilEM(local)+" &amp;bull; "+escPerfilEM(x.modalidade||"")+"</small></div><button type='button' data-vaga-publica-em='"+escPerfilEM(x.id)+"'>Ver vaga</button></div>";
}).join("");
var logo=pf.logo?"<img class='empresa-publica-logo-em' src='"+escPerfilEM(pf.logo)+"' alt='Logo da empresa'/>":"<div class='empresa-publica-logo-em'></div>";
var capa=pf.capa?" style='background-image:url(&amp;quot;"+escPerfilEM(pf.capa)+"&amp;quot;)'":"";
var html="<button class='empresa-perfil-voltar-em' type='button' onclick='abrirEditorPerfilEmpresaEM()'>&amp;#8592; Voltar</button>"+
"<section class='empresa-publica-hero-em'><div class='empresa-publica-capa-em'"+capa+"></div><div class='empresa-publica-info-em'>"+logo+
"<h1>"+escPerfilEM(pf.nome)+"</h1>"+(pf.slogan?"<p class='empresa-publica-slogan-v21'>"+escPerfilEM(pf.slogan)+"</p>":"")+"<div class='empresa-publica-meta-em'>"+escPerfilEM(pf.segmento||"Empresa")+" &amp;bull; "+escPerfilEM([pf.cidade,pf.uf].filter(Boolean).join(" / "))+"</div>"+
"<span class='empresa-publica-selo-em'>Perfil da empresa</span></div></section>"+
"<div class='empresa-publica-grid-em'><section class='empresa-publica-box-em'><h3>Sobre a empresa</h3><p>"+escPerfilEM(pf.sobre||"A empresa ainda nao adicionou uma apresentacao.")+"</p>"+
(pf.missao?"<h3>Missao</h3><p>"+escPerfilEM(pf.missao)+"</p>":"")+
(pf.visao?"<h3>Visao</h3><p>"+escPerfilEM(pf.visao)+"</p>":"")+
(pf.valores?"<h3>Valores</h3><p>"+escPerfilEM(pf.valores)+"</p>":"")+
"<h3>Cultura e ambiente</h3><p>"+escPerfilEM(pf.cultura||"Informacao ainda nao adicionada.")+"</p>"+
(pf.ambiente?"<h3>Como e trabalhar aqui</h3><p>"+escPerfilEM(pf.ambiente)+"</p>":"")+
"<h3>Beneficios</h3><p>"+escPerfilEM(pf.beneficios||"Informacao ainda nao adicionada.")+"</p>"+
(pf.carreira?"<h3>Carreira e desenvolvimento</h3><p>"+escPerfilEM(pf.carreira)+"</p>":"")+"</section>"+
"<aside class='empresa-publica-box-em'><h3>Informacoes</h3><div class='empresa-publica-lista-em'>"+
(pf.porte?"<span><strong>Porte:</strong> "+escPerfilEM(pf.porte)+"</span>":"")+
(pf.fundacao?"<span><strong>Fundacao:</strong> "+escPerfilEM(pf.fundacao)+"</span>":"")+
(pf.modalidades?"<span><strong>Trabalho:</strong> "+escPerfilEM(pf.modalidades)+"</span>":"")+
(pf.areas?"<span><strong>Areas que mais contratam:</strong> "+escPerfilEM(pf.areas)+"</span>":"")+
(pf.site?"<span><strong>Site:</strong> "+escPerfilEM(pf.site)+"</span>":"")+
(pf.linkedin?"<span><strong>LinkedIn:</strong> "+escPerfilEM(pf.linkedin)+"</span>":"")+
(pf.instagram?"<span><strong>Instagram:</strong> "+escPerfilEM(pf.instagram)+"</span>":"")+
(pf.facebook?"<span><strong>Facebook:</strong> "+escPerfilEM(pf.facebook)+"</span>":"")+
(pf.video?"<span><strong>Video institucional:</strong> "+escPerfilEM(pf.video)+"</span>":"")+
(pf.emailPublico?"<span><strong>Contato:</strong> "+escPerfilEM(pf.emailPublico)+"</span>":"")+
"</div></aside></div>"+
"<section class='empresa-publica-box-em empresa-publica-vagas-em'><h3>Vagas abertas <span>("+vagas.length+")</span></h3>"+(vagasHtml||"<p>Nenhuma oportunidade aberta no momento.</p>")+"</section>";
var pagina=document.getElementById("pagina-perfil-publico-empresa-em"),box=document.getElementById("conteudoPerfilPublicoEmpresaEM");
var paginas=document.querySelectorAll("[id^='pagina-']");
for(var i=0;i<paginas.length;i++)paginas[i].style.display="none";
box.innerHTML=html;pagina.style.display="block";window.scrollTo(0,0);
var bs=box.querySelectorAll("[data-vaga-publica-em]");
for(var j=0;j<bs.length;j++)bs[j].onclick=function(){
var id=this.getAttribute("data-vaga-publica-em");
if(typeof irPara==="function"){irPara("vaga",id);return;}
if(typeof abrirVaga==="function"){abrirVaga(id);return;}
if(typeof abrirDetalheVaga==="function")abrirDetalheVaga(id);
};
};
window.abrirEditorPerfilEmpresaEM=abrirPaginaPerfilEditorEM;
var old=window.irPara;
if(typeof old==="function"&&!window.perfilEmpresaRotaPatchEM){
window.perfilEmpresaRotaPatchEM=true;
window.irPara=function(pagina){
if(pagina==="perfil-empresa"){abrirPaginaPerfilEditorEM();return false;}
return old.apply(this,arguments);
};
}
})();
//