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
/* Home compacta: apresentação, cards e filtros responsivos. */
(function(){
 function init(){
  var home=document.getElementById('pagina-home'),list=document.getElementById('listaVagas'),filters=document.getElementById('filtrosLateral');if(!home||!list||!filters||document.getElementById('emHomeProfessional'))return;
  var style=document.createElement('style');style.id='emHomeProfessional';style.textContent=`
html body #pagina-home#pagina-home{background:#f6f7fb!important}
html body #pagina-home#pagina-home :is(h1,h2,h3,p,button,input,select,article,span){font-family:Poppins,sans-serif!important;font-style:normal!important}
html body #pagina-home#pagina-home #emHeroFloripa.hero{padding:28px 24px!important;min-height:0!important}
html body #pagina-home#pagina-home #emHeroFloripa .hero-premium-inner-em{gap:28px!important}
html body #pagina-home#pagina-home #emHeroFloripa h1{font-size:32px!important;margin-bottom:10px!important;line-height:1.2!important}
html body #pagina-home#pagina-home #emHeroFloripa .hero-copy-em p{font-size:14px!important;line-height:1.5!important}
html body #pagina-home#pagina-home #emHeroFloripa .hero-kicker-em{margin-bottom:8px!important}
html body #pagina-home#pagina-home #emHeroFloripa .hero-search-shell-em{padding:16px!important;border-radius:12px!important}
html body #pagina-home#pagina-home #emHeroFloripa .em-hero-chips{margin:10px 0!important}
html body #pagina-home#pagina-home #emHeroFloripa #emHeroRefBusca button{background:#7041c6!important}
html body #pagina-home#pagina-home #listaVagas#listaVagas#listaVagas article.vaga-card.em-lista-final{background:#fff!important;border:1px solid #e2e5ec!important;border-radius:10px!important;box-shadow:none!important;padding:16px 18px!important}
html body #pagina-home#pagina-home #listaVagas#listaVagas#listaVagas .em-lista-titulo{font-size:20px!important;line-height:1.3!important;color:#24334b!important}
html body #pagina-home#pagina-home #listaVagas .em-lista-meta{flex-wrap:wrap!important;gap:8px 14px!important}
html body #pagina-home#pagina-home #listaVagas .em-lista-meta-item{border:0!important}
html body #pagina-home#pagina-home #listaVagas .em-lista-ver{background:#7041c6!important;border-color:#7041c6!important;color:#fff!important}
html body #pagina-home#pagina-home #listaVagas :is(.em-selo-nova-v31,.em-lista-destaque){font-size:10px!important;box-shadow:none!important}
html body #pagina-home#pagina-home #filtrosLateral{background:#fff!important;border:1px solid #e2e5ec!important;border-radius:12px!important;box-shadow:none!important;padding:18px!important}
html body #pagina-home#pagina-home #filtrosLateral :is(input,select){border:1px solid #dce1e9!important;border-radius:7px!important;box-shadow:none!important;min-height:40px!important}
#emHomeFiltersToggle{display:none}
@media(min-width:769px){html body #pagina-home#pagina-home #filtrosLateral{display:block!important}}
@media(max-width:768px){
html body #pagina-home#pagina-home #emHeroFloripa.hero{padding:20px 16px!important}
html body #pagina-home#pagina-home #emHeroFloripa .hero-premium-inner-em{gap:16px!important}
html body #pagina-home#pagina-home #emHeroFloripa h1{font-size:27px!important}
html body #pagina-home#pagina-home #emHeroFloripa .em-hero-chips{display:none!important}
#emHomeFiltersToggle{display:block!important;width:100%;padding:12px 16px;margin:0 0 12px;border:1px solid #d8ccea;border-radius:8px;background:#fff;color:#7041c6;font-weight:600;cursor:pointer}
html body #pagina-home#pagina-home #filtrosLateral{display:none!important;width:100%!important;box-sizing:border-box!important;position:static!important;margin-bottom:16px!important}
html body #pagina-home#pagina-home #filtrosLateral.em-filters-open{display:block!important}
html body #pagina-home#pagina-home #listaVagas#listaVagas#listaVagas .em-lista-titulo{font-size:18px!important}
}`;document.head.appendChild(style);
  style.textContent+="\nhtml body #pagina-home#pagina-home #listaVagas#listaVagas#listaVagas article.vaga-card.em-lista-final{padding:10px 14px!important;border:1px solid #d8e4f2!important;border-left:3px solid #1268e8!important;border-radius:9px!important;min-height:0!important;height:auto!important}\nhtml body #pagina-home#pagina-home #listaVagas#listaVagas#listaVagas .em-lista-titulo{font-size:18px!important;line-height:1.2!important;margin:2px 0 4px!important}\nhtml body #pagina-home#pagina-home #listaVagas#listaVagas#listaVagas .em-lista-cab{min-height:0!important;line-height:16px!important}\nhtml body #pagina-home#pagina-home #listaVagas#listaVagas#listaVagas .em-lista-empresa{font-size:11px!important;line-height:16px!important}\nhtml body #pagina-home#pagina-home #listaVagas#listaVagas#listaVagas .em-lista-meta{margin:0 0 4px!important;gap:5px 12px!important}\nhtml body #pagina-home#pagina-home #listaVagas#listaVagas#listaVagas .em-lista-resumo{font-size:12px!important;line-height:17px!important;height:17px!important;max-height:17px!important;margin:0 0 4px!important}\nhtml body #pagina-home#pagina-home #listaVagas#listaVagas#listaVagas .em-lista-footer{padding-top:5px!important;margin-top:0!important;gap:6px 10px!important}\nhtml body #pagina-home#pagina-home #listaVagas#listaVagas#listaVagas .em-lista-ver{background:#1268e8!important;border-color:#1268e8!important;color:#fff!important;min-height:30px!important;height:30px!important;padding:0 14px!important;font-size:12px!important}\nhtml body #pagina-home#pagina-home #listaVagas#listaVagas#listaVagas .em-lista-ver:hover{background:#0755bd!important;border-color:#0755bd!important}\n";
  style.textContent+="html body #pagina-home#pagina-home .destaque-zero-m6.em-featured-reference,html body #pagina-destaques-v60 .destaque-zero-m6.em-featured-reference{border-top:3px solid #e3a325!important}";
  style.textContent+="\n@media(max-width:900px){\nhtml body #pagina-home#pagina-home,html body #pagina-vaga#pagina-vaga{width:100%!important;max-width:100%!important;box-sizing:border-box!important}\nhtml body #pagina-home#pagina-home .vagas-area,html body #pagina-vaga#pagina-vaga .detalhe-layout{display:grid!important;grid-template-columns:minmax(0,1fr)!important;width:100%!important;min-width:0!important;gap:16px!important;box-sizing:border-box!important}\nhtml body #pagina-home#pagina-home .vagas-area>*,html body #pagina-vaga#pagina-vaga .detalhe-layout>*{min-width:0!important;max-width:100%!important;box-sizing:border-box!important}\nhtml body #pagina-home#pagina-home :is(.home-vagas-caixa,.hero-inner,.destaques-carrossel-em){box-sizing:border-box!important;width:100%!important;min-width:0!important;max-width:100%!important}\nhtml body #pagina-home#pagina-home .home-vagas-caixa{padding:18px 14px!important}\nhtml body #pagina-home#pagina-home #emDestV14{grid-template-columns:minmax(0,1fr)!important;gap:12px!important;margin-bottom:16px!important}\nhtml body #pagina-home#pagina-home #emDestV14 .logos-viewport{display:none!important}\nhtml body #pagina-home#pagina-home #emDestV14 :is(h2,p,.eyebrow){white-space:normal!important}\nhtml body #pagina-home#pagina-home #emDestV14 .all-btn{width:100%!important;grid-column:auto!important}\nhtml body #pagina-home#pagina-home #listaDestaques{display:flex!important;overflow-x:auto!important;overflow-y:hidden!important;scroll-snap-type:x mandatory!important;width:100%!important;max-width:100%!important;gap:12px!important;padding:2px 0 8px!important;box-sizing:border-box!important}\nhtml body #pagina-home#pagina-home #listaDestaques>article{flex:0 0 88%!important;width:88%!important;min-width:0!important;max-width:88%!important;scroll-snap-align:start!important;box-sizing:border-box!important;margin:0!important}\nhtml body #pagina-home#pagina-home #listaDestaques .dz-titulo{font-size:20px!important;line-height:1.3!important}\nhtml body #pagina-home#pagina-home #listaVagas{min-width:0!important;grid-template-columns:minmax(0,1fr)!important}\nhtml body #pagina-home#pagina-home #listaVagas article{min-width:0!important;max-width:100%!important;box-sizing:border-box!important}\nhtml body #pagina-home#pagina-home #listaVagas .em-lista-footer{flex-wrap:wrap!important}\nhtml body #pagina-home#pagina-home #listaVagas .em-lista-titulo{overflow-wrap:anywhere!important}\nhtml body #pagina-home#pagina-home .btn-mobile-filtros{display:none!important}\nhtml body #pagina-home#pagina-home #filtrosLateral#filtrosLateral{display:none!important;width:100%!important;position:static!important;box-sizing:border-box!important;margin:0 0 12px!important}\nhtml body #pagina-home#pagina-home #filtrosLateral#filtrosLateral.em-filters-open{display:block!important}\nhtml body #pagina-home#pagina-home #emHomeFiltersToggle{display:block!important}\nhtml body #pagina-vaga#pagina-vaga .detalhe-layout{padding:16px!important}\nhtml body #pagina-vaga#pagina-vaga #emVagaHeroV88#emVagaHeroV88.em-header-reference>:not(#emJobHeaderReference){display:none!important}\nhtml body #pagina-vaga#pagina-vaga #resumoVagaV27{display:none!important}\nhtml body #pagina-vaga#pagina-vaga #emJobHeaderReference{width:100%!important;min-width:0!important}\nhtml body #pagina-vaga#pagina-vaga #emJobHeaderReference .jh-top{display:grid!important;grid-template-columns:44px minmax(0,1fr)!important;gap:10px!important}\nhtml body #pagina-vaga#pagina-vaga #emJobHeaderReference .jh-top>*{min-width:0!important}\nhtml body #pagina-vaga#pagina-vaga #emJobHeaderReference .jh-logo{width:44px!important;height:44px!important}\nhtml body #pagina-vaga#pagina-vaga #emJobHeaderReference .jh-aside{grid-column:1/-1!important;max-width:100%!important;align-items:flex-start!important}\nhtml body #pagina-vaga#pagina-vaga #emJobHeaderReference .jh-title{font-size:20px!important;overflow-wrap:anywhere!important}\nhtml body #pagina-vaga#pagina-vaga #emJobHeaderReference .jh-company{white-space:normal!important;text-align:left!important}\nhtml body #pagina-vaga#pagina-vaga #emJobHeaderReference .jh-tiles{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important}\nhtml body #pagina-vaga#pagina-vaga #emJobHeaderReference .jh-tile{min-width:0!important}\nhtml body #pagina-vaga#pagina-vaga #emJobHeaderReference .jh-value{white-space:normal!important;overflow-wrap:anywhere!important}\nhtml body #pagina-vaga#pagina-vaga #emJobEnd .je-safe{display:flex!important;flex-direction:column!important;align-items:stretch!important;padding:0!important;gap:0!important}\nhtml body #pagina-vaga#pagina-vaga #emJobEnd .je-safe details{position:static!important;width:100%!important;min-width:0!important;max-width:100%!important;height:auto!important;min-height:0!important;box-sizing:border-box!important}\nhtml body #pagina-vaga#pagina-vaga #emJobEnd .je-safe summary{position:static!important;width:100%!important;min-height:0!important;height:auto!important;padding:16px!important;box-sizing:border-box!important}\nhtml body #pagina-vaga#pagina-vaga #emJobEnd .je-report{position:static!important;margin:0 16px 16px!important;width:calc(100% - 32px)!important}\nhtml body #pagina-vaga#pagina-vaga #emJobEnd .je-tools{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important}\nhtml body #pagina-vaga#pagina-vaga #emJobEnd .je-tools button{min-width:0!important;white-space:normal!important}\nhtml body #pagina-vaga#pagina-vaga #emJobInformation{grid-template-columns:repeat(2,minmax(0,1fr))!important}\nhtml body #pagina-vaga#pagina-vaga .conteudo-vaga-box.em-job-panel{padding:18px!important}\nhtml body #pagina-vaga#pagina-vaga #emPortalVagaBanner#emPortalVagaBanner p{font-size:22px!important;gap:10px!important}\n}\n@media(max-width:520px){\nhtml body #pagina-vaga#pagina-vaga :is(.candidatura-final-fixa-em,.aplicar-bloco-principal){display:none!important}\nhtml body #pagina-vaga#pagina-vaga .mobile-candidatar{box-sizing:border-box!important;left:0!important;right:0!important;width:100%!important;padding:8px 12px calc(8px + env(safe-area-inset-bottom))!important;z-index:3500!important}\nhtml body #pagina-vaga#pagina-vaga #btnCandidatarMobile{background:#1268e8!important;min-height:44px!important}\nhtml body #pagina-vaga#pagina-vaga{padding-bottom:80px!important}\n}\n";
  style.textContent+="html body #pagina-home#pagina-home #emPerto#emPerto#emPerto{padding:12px!important;border:1px solid #d5e4f5!important;background:#f7fbff!important;border-radius:10px!important;box-sizing:border-box!important;margin:0 0 12px!important}html body #pagina-home#pagina-home #emPerto#emPerto>h3,html body #pagina-home#pagina-home #emPerto#emPerto>p{display:none!important}html body #pagina-home#pagina-home #emPerto#emPerto #emPertoForm{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,.75fr) minmax(140px,.8fr)!important;gap:10px!important;align-items:end!important;width:100%!important;border:0!important;background:transparent!important;padding:0!important}html body #pagina-home#pagina-home #emPertoForm>*{min-width:0!important;max-width:100%!important;box-sizing:border-box!important}html body #pagina-home#pagina-home #emPerto#emPerto #emPertoBuscar{grid-column:auto!important;width:100%!important;margin:0!important;height:38px!important;background:#1268e8!important;color:white!important;border-radius:7px!important;white-space:normal!important}html body #pagina-home#pagina-home #emPerto label{position:static!important;width:auto!important;height:auto!important;clip-path:none!important;display:block!important;margin:0 0 5px!important}html body #pagina-home#pagina-home #emPerto input,html body #pagina-home#pagina-home #emPerto select{height:38px!important;min-width:0!important;width:100%!important;box-sizing:border-box!important}html body #pagina-home#pagina-home #emPerto .em-perto-rodape{margin-top:8px!important;font-size:10px!important}html body #pagina-home#pagina-home #emPertoForm:before,html body #pagina-home#pagina-home #emPertoForm:after{content:none!important}@media(max-width:600px){html body #pagina-home#pagina-home #emPerto#emPerto #emPertoForm{grid-template-columns:repeat(2,minmax(0,1fr))!important}html body #pagina-home#pagina-home #emPerto#emPerto #emPertoBuscar{grid-column:1/-1!important}}";
  var section=list.parentElement;while(section.parentElement&&section.parentElement!==home)section=section.parentElement;
  home.querySelectorAll('#empresasContratandoFaixaEM,.senior-home-v18').forEach(function(banner){if(banner.parentElement===home)home.appendChild(banner)});
  var button=document.createElement('button');button.id='emHomeFiltersToggle';button.type='button';button.textContent='Filtrar vagas';button.setAttribute('aria-controls','filtrosLateral');button.setAttribute('aria-expanded','false');
  var anchor=document.createComment('Posição dos filtros no desktop');filters.before(anchor);list.before(button);var mobile=window.matchMedia('(max-width:900px)');function positionFilters(){if(mobile.matches)button.after(filters);else anchor.after(filters);}positionFilters();mobile.addEventListener('change',positionFilters);button.onclick=function(){alternarFiltrosMobile();};
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* Mantém o filtro de proximidade imediatamente antes das vagas recentes. */
(function(){
 var retainedBox=null;
 function position(){var list=document.getElementById('listaVagas'),box=document.getElementById('emPerto')||retainedBox;if(!box||!list)return false;retainedBox=box;
 if(!box.dataset.singleFormReady){var form=box.querySelector('#emPertoForm'),cep=box.querySelector('#emPertoCep'),radius=box.querySelector('#emPertoRaio'),search=box.querySelector('#emPertoBuscar'),local=box.querySelector('#emPertoLocal'),footer=box.querySelector('.em-perto-rodape');if(form&&cep&&radius&&search){var a=document.createElement('div'),b=document.createElement('div');var label=document.createElement('label');label.htmlFor=cep.id;label.textContent='CEP';a.append(label,cep);label=document.createElement('label');label.htmlFor=radius.id;label.textContent='Distância';b.append(label,radius);search.className='';search.textContent='Buscar perto de mim';form.replaceChildren(a,b,search);if(local&&footer){local.className='';local.textContent='Usar minha localização';footer.prepend(local)}box.querySelectorAll('.em-near-head,.busca-proxima-v202,.em-near-compact-copy').forEach(function(el){el.remove()});box.dataset.singleFormReady='1';}}
 box.hidden=false;box.style.setProperty('display','block','important');box.style.setProperty('width','100%','important');box.style.setProperty('grid-column','1 / -1','important');if(list.firstElementChild!==box)list.prepend(box);return true;}

 function init(){position();var parent=document.getElementById('listaVagas');if(parent)new MutationObserver(position).observe(parent,{childList:true});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 window.addEventListener('load',position);
})();
