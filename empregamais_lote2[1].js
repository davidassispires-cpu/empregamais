/* EmpregaMais - JavaScript externo - lote 2 */

//
(function(){
var U="https://mkezlcewyengejdmtppl.supabase.co";
var K="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
var KEY="empregaMaisAdminSupabaseToken";
async function validarAdminEM(){
var token="";
try{token=localStorage.getItem(KEY)||"";}catch(e){}
if(!token) return false;
try{
var r=await fetch(U+"/rest/v1/rpc/admin_listar_verificacoes",{
method:"POST",
headers:{
"apikey":K,
"Authorization":"Bearer "+token,
"Content-Type":"application/json"
},
body:"{}"
});
if(!r.ok){
try{localStorage.removeItem(KEY);localStorage.removeItem("empregaMaisPapel");}catch(e){}
return false;
}
try{localStorage.setItem("empregaMaisPapel","admin"); sessionStorage.setItem("empregaMaisPapel","admin");}catch(e){}
return true;
}catch(e){
return false;
}
}
window.validarSessaoAdminSupabaseEM=validarAdminEM;
document.addEventListener("DOMContentLoaded",function(){
validarAdminEM().then(function(ok){
if(ok && typeof carregarVerificacoesAdminSupabaseEM==="function"){
setTimeout(carregarVerificacoesAdminSupabaseEM,150);
}
});
});
})();
//
;
//
(function(){
var U="https://mkezlcewyengejdmtppl.supabase.co";
var K="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
var TOKEN_KEY="empregaMaisAdminSupabaseToken";
function esc(v){
return String(v==null?"":v).replace(/[&amp;<>"']/g,function(c){
return {"&amp;":"&amp;amp;","<":"&amp;lt;",">":"&amp;gt;",'"':"&amp;quot;","'":"&amp;#39;"}[c];
});
}
function dataBR(v){
if(!v) return "-";
try{return new Date(v).toLocaleString("pt-BR");}catch(e){return "-";}
}
async function rpc(nome,body){
var t=localStorage.getItem(TOKEN_KEY)||"";
if(!t) throw new Error("Sess\u00E3o administrativa n\u00E3o encontrada.");
var r=await fetch(U+"/rest/v1/rpc/"+nome,{
method:"POST",
headers:{
"apikey":K,
"Authorization":"Bearer "+t,
"Content-Type":"application/json"
},
body:JSON.stringify(body||{})
});
var txt=await r.text(), d=null;
try{d=txt?JSON.parse(txt):null;}catch(e){d=txt;}
if(!r.ok) throw new Error((d&&d.message)||String(d||("HTTP "+r.status)));
return d;
}
function alvo(){
return document.getElementById("listaVerificacoesAdmin");
}
window.renderizarVerificacoesAdmin=function(){
var box=alvo();
if(!box) return Promise.resolve();
box.innerHTML="<div class='vazio'>Carregando solicita\u00E7\u00F5es de verifica\u00E7\u00E3o...</div>";
return rpc("admin_listar_verificacoes",{}).then(function(lista){
lista=Array.isArray(lista)?lista:[];
var porEmpresa={};
lista.forEach(function(x){
if(!x || x.status!=="em_analise" || !x.empresa_id) return;
var atual=porEmpresa[x.empresa_id];
var nx=new Date(x.enviada_em||0).getTime()||0;
var ax=atual?(new Date(atual.enviada_em||0).getTime()||0):-1;
if(!atual || nx>=ax) porEmpresa[x.empresa_id]=x;
});
var pendentes=Object.keys(porEmpresa).map(function(k){return porEmpresa[k];});
pendentes.sort(function(a,b){
return (new Date(b.enviada_em||0).getTime()||0)-(new Date(a.enviada_em||0).getTime()||0);
});
box.innerHTML="";
if(!pendentes.length){
box.innerHTML="<div class='vazio'>Nenhuma solicita\u00E7\u00E3o de verifica\u00E7\u00E3o aguardando an\u00E1lise.</div>";
return;
}
pendentes.forEach(function(x){
var card=document.createElement("article");
card.className="admin-verificacao-card";
card.innerHTML=
"<div class='admin-verificacao-topo'>"+
"<div><h3>"+esc(x.nome_fantasia||x.razao_social||"Empresa")+"</h3>"+
"<p>"+esc(x.razao_social||"")+"<br/>CNPJ: "+esc(x.cnpj||"-")+"</p></div>"+
"<span class='selo-verificacao pendente'>Em an\u00E1lise</span>"+
"</div>"+
"<div class='admin-verificacao-dados'>"+
"<div><span>Matriz</span><strong>"+esc(x.matriz||"-")+"</strong></div>"+
"<div><span>Setor</span><strong>"+esc(x.setor||"-")+"</strong></div>"+
"<div><span>Site</span><strong>"+esc(x.site||"-")+"</strong></div>"+
"<div><span>E-mail corporativo</span><strong>"+esc(x.email_corporativo||"-")+"</strong></div>"+
"<div><span>Comprova\u00E7\u00E3o</span><strong>"+esc(x.comprovacao||"-")+"</strong></div>"+
"<div><span>Enviada em</span><strong>"+esc(dataBR(x.enviada_em))+"</strong></div>"+
"</div>";
var acoes=document.createElement("div");
acoes.className="admin-verificacao-acoes";
var aprovar=document.createElement("button");
aprovar.type="button";
aprovar.className="btn btn-verde";
aprovar.textContent="\u2713 Aprovar verifica\u00E7\u00E3o";
aprovar.onclick=function(){
if(!confirm("Aprovar a verifica\u00E7\u00E3o desta empresa?")) return;
rpc("admin_aprovar_verificacao",{p_verificacao_id:x.verificacao_id})
.then(function(){
alert("Empresa verificada com sucesso.");
return window.renderizarVerificacoesAdmin();
})
.catch(function(e){alert("Erro ao aprovar: "+e.message);});
};
var rejeitar=document.createElement("button");
rejeitar.type="button";
rejeitar.className="btn btn-perigo";
rejeitar.textContent="Recusar";
rejeitar.onclick=function(){
var motivo=prompt("Informe o motivo da rejei\u00E7\u00E3o:");
if(motivo===null) return;
motivo=String(motivo).trim();
if(!motivo){alert("Informe o motivo da rejei\u00E7\u00E3o.");return;}
rpc("admin_rejeitar_verificacao",{p_verificacao_id:x.verificacao_id,p_motivo:motivo})
.then(function(){
alert("Verifica\u00E7\u00E3o rejeitada.");
return window.renderizarVerificacoesAdmin();
})
.catch(function(e){alert("Erro ao rejeitar: "+e.message);});
};
acoes.appendChild(aprovar);
acoes.appendChild(rejeitar);
card.appendChild(acoes);
box.appendChild(card);
});
}).catch(function(e){
console.error("Verifica\u00E7\u00F5es Supabase:",e);
box.innerHTML="<div class='vazio'>N\u00E3o foi poss\u00EDvel carregar as verifica\u00E7\u00F5es. Atualize a p\u00E1gina e tente novamente.</div>";
});
};
window.carregarVerificacoesAdminSupabaseEM=window.renderizarVerificacoesAdmin;
var irAnterior=window.irPara;
if(typeof irAnterior==="function"){
window.irPara=function(p){
var r=irAnterior.apply(this,arguments);
if(String(p)==="painel-admin" || String(p)==="admin"){
setTimeout(window.renderizarVerificacoesAdmin,180);
}
return r;
};
}
var mostrarAnterior=window.mostrarPagina;
if(typeof mostrarAnterior==="function"){
window.mostrarPagina=function(p){
var r=mostrarAnterior.apply(this,arguments);
if(String(p)==="painel-admin" || String(p)==="admin"){
setTimeout(window.renderizarVerificacoesAdmin,180);
}
return r;
};
}
document.addEventListener("DOMContentLoaded",function(){
if(localStorage.getItem(TOKEN_KEY)){
setTimeout(window.renderizarVerificacoesAdmin,700);
}
});
})();
//
;
//
(function(){
var U="https://mkezlcewyengejdmtppl.supabase.co";
var K="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
var TK="empregaMaisAdminSupabaseToken";
window.renderizarFilaVerificacaoAdminFinalEM=function(){};
function esc(v){
return String(v==null?"":v).replace(/[&amp;<>"']/g,function(c){
return {"&amp;":"&amp;amp;","<":"&amp;lt;",">":"&amp;gt;",'"':"&amp;quot;","'":"&amp;#39;"}[c];
});
}
async function adminRpcEM(nome,body){
var token=localStorage.getItem(TK)||"";
if(!token) throw new Error("Sess\u00E3o do administrador n\u00E3o encontrada.");
var r=await fetch(U+"/rest/v1/rpc/"+nome,{
method:"POST",
headers:{
"apikey":K,
"Authorization":"Bearer "+token,
"Content-Type":"application/json"
},
body:JSON.stringify(body||{})
});
var txt=await r.text(), d=null;
try{d=txt?JSON.parse(txt):null;}catch(e){d=txt;}
if(!r.ok) throw new Error((d&&d.message)||String(d||("HTTP "+r.status)));
return d;
}
window.renderizarVerificacoesAdmin=function(){
var box=document.getElementById("listaVerificacoesAdmin");
if(!box) return Promise.resolve();
box.innerHTML="<div class='vazio'>Carregando solicita\u00E7\u00F5es...</div>";
return adminRpcEM("admin_listar_verificacoes",{}).then(function(lista){
lista=Array.isArray(lista)?lista:[];
var mapa={};
lista.forEach(function(x){
if(!x || String(x.status)!=="em_analise") return;
var chave=String(x.empresa_id||x.cnpj||x.verificacao_id||"");
var atual=mapa[chave];
var novoT=Date.parse(x.enviada_em||"")||0;
var atualT=atual?(Date.parse(atual.enviada_em||"")||0):-1;
if(!atual || novoT>=atualT) mapa[chave]=x;
});
var pendentes=Object.keys(mapa).map(function(k){return mapa[k];});
pendentes.sort(function(a,b){
return (Date.parse(b.enviada_em||"")||0)-(Date.parse(a.enviada_em||"")||0);
});
if(!pendentes.length){
box.innerHTML="<div class='vazio'>Nenhuma solicita\u00E7\u00E3o de verifica\u00E7\u00E3o aguardando an\u00E1lise.</div>";
return;
}
box.innerHTML="";
pendentes.forEach(function(x){
var card=document.createElement("article");
card.className="admin-verificacao-card";
card.innerHTML=
"<div class='admin-verificacao-topo'>"+
"<div><h3>"+esc(x.nome_fantasia||x.razao_social||"Empresa")+"</h3>"+
"<p>"+esc(x.razao_social||"")+"<br/>CNPJ: "+esc(x.cnpj||"-")+"</p></div>"+
"<span class='selo-verificacao pendente'>Em an\u00E1lise</span>"+
"</div>"+
"<div class='admin-verificacao-dados'>"+
"<div><span>E-mail corporativo</span><strong>"+esc(x.email_corporativo||"-")+"</strong></div>"+
"<div><span>Matriz</span><strong>"+esc(x.matriz||"-")+"</strong></div>"+
"<div><span>Setor</span><strong>"+esc(x.setor||"-")+"</strong></div>"+
"<div><span>Site</span><strong>"+esc(x.site||"-")+"</strong></div>"+
"<div><span>Comprova\u00E7\u00E3o</span><strong>"+esc(x.comprovacao||"-")+"</strong></div>"+
"</div>";
var a=document.createElement("div");
a.className="admin-verificacao-acoes";
var ok=document.createElement("button");
ok.type="button"; ok.className="btn btn-verde"; ok.textContent="\u2713 Aprovar verifica\u00E7\u00E3o";
ok.onclick=function(){
if(!confirm("Aprovar a verifica\u00E7\u00E3o desta empresa?")) return;
adminRpcEM("admin_aprovar_verificacao",{p_verificacao_id:x.verificacao_id})
.then(function(){alert("Empresa verificada com sucesso.");return window.renderizarVerificacoesAdmin();})
.catch(function(e){alert("Erro ao aprovar: "+e.message);});
};
var no=document.createElement("button");
no.type="button"; no.className="btn btn-perigo"; no.textContent="Recusar";
no.onclick=function(){
var m=prompt("Informe o motivo da rejei\u00E7\u00E3o:");
if(m===null)return;
m=String(m).trim();
if(!m){alert("Informe o motivo da rejei\u00E7\u00E3o.");return;}
adminRpcEM("admin_rejeitar_verificacao",{p_verificacao_id:x.verificacao_id,p_motivo:m})
.then(function(){alert("Verifica\u00E7\u00E3o rejeitada.");return window.renderizarVerificacoesAdmin();})
.catch(function(e){alert("Erro ao rejeitar: "+e.message);});
};
a.appendChild(ok); a.appendChild(no); card.appendChild(a); box.appendChild(card);
});
}).catch(function(e){
console.error("Admin verifica\u00E7\u00F5es Supabase:",e);
box.innerHTML="<div class='vazio'>Erro ao consultar as verifica\u00E7\u00F5es no Supabase: "+esc(e.message)+"</div>";
});
};
window.carregarVerificacoesAdminSupabaseEM=window.renderizarVerificacoesAdmin;
function tentar(){
if(localStorage.getItem(TK) && document.getElementById("listaVerificacoesAdmin")){
window.renderizarVerificacoesAdmin();
}
}
window.addEventListener("load",function(){
setTimeout(tentar,150);
setTimeout(tentar,700);
setTimeout(tentar,1800);
});
})();
//
;
//
(function(){
function tokenAdminEM(){
try{return localStorage.getItem("empregaMaisAdminSupabaseToken")||"";}catch(e){return "";}
}
function sincronizarPapelAdminEM(){
if(tokenAdminEM()){
try{
localStorage.setItem("empregaMaisPapel","admin");
sessionStorage.setItem("empregaMaisPapel","admin");
}catch(e){}
return true;
}
return false;
}
window.sincronizarPapelAdminEM=sincronizarPapelAdminEM;
var papelAnterior=window.papelAtual;
window.papelAtual=function(){
if(sincronizarPapelAdminEM()) return "admin";
return typeof papelAnterior==="function" ? papelAnterior() : "";
};
var adminAnterior=window.adminEstaLogado;
window.adminEstaLogado=function(){
if(sincronizarPapelAdminEM()) return true;
return typeof adminAnterior==="function" ? adminAnterior() : false;
};
document.addEventListener("DOMContentLoaded",function(){
if(sincronizarPapelAdminEM()){
var q=new URLSearchParams(location.search);
if(q.get("pagina")==="painel-admin"){
setTimeout(function(){
if(typeof mostrarPagina==="function") mostrarPagina("painel-admin");
if(typeof renderizarPainelAdmin==="function") renderizarPainelAdmin();
if(typeof renderizarVerificacoesAdmin==="function") renderizarVerificacoesAdmin();
},250);
}
}
});
})();
//
;
//
(function(){
function abrirPainelAdminEM(){
try{
localStorage.setItem("empregaMaisPapel","admin");
sessionStorage.setItem("empregaMaisPapel","admin");
}catch(e){}
if(typeof mostrarPagina==="function"){
try{mostrarPagina("painel-admin");}catch(e){}
}
if(typeof irPara==="function"){
try{irPara("painel-admin");}catch(e){}
}
var painel=document.getElementById("pagina-painel-admin");
if(painel){
document.querySelectorAll(".pagina").forEach(function(p){
if(p!==painel) p.classList.remove("ativa");
});
painel.classList.add("ativa");
painel.style.display="";
}
if(typeof renderizarPainelAdmin==="function"){
try{renderizarPainelAdmin();}catch(e){}
}
if(typeof renderizarVerificacoesAdmin==="function"){
setTimeout(function(){
try{renderizarVerificacoesAdmin();}catch(e){}
},120);
}
window.scrollTo(0,0);
}
window.abrirPainelAdminEM=abrirPainelAdminEM;
var ultimoToken="";
setInterval(function(){
var t="";
try{t=localStorage.getItem("empregaMaisAdminSupabaseToken")||"";}catch(e){}
if(t && t!==ultimoToken){
ultimoToken=t;
setTimeout(abrirPainelAdminEM,180);
}
if(!t) ultimoToken="";
},250);
document.addEventListener("DOMContentLoaded",function(){
var t="";
try{t=localStorage.getItem("empregaMaisAdminSupabaseToken")||"";}catch(e){}
if(t){
ultimoToken=t;
setTimeout(abrirPainelAdminEM,300);
}
});
})();
//
;
//
(function(){
function esc(v){
return String(v==null?"":v).replace(/[&amp;<>"']/g,function(c){
return {"&amp;":"&amp;amp;","<":"&amp;lt;",">":"&amp;gt;",'"':"&amp;quot;","'":"&amp;#39;"}[c];
});
}
function linha(rotulo,valor){
return "<div style='padding:11px 0;border-bottom:1px solid #eef1f5'>"+
"<div style='font-size:11px;color:#64748b;text-transform:uppercase;margin-bottom:4px'>"+esc(rotulo)+"</div>"+
"<div style='font-size:14px;color:#0f172a;word-break:break-word'>"+esc(valor||"-")+"</div></div>";
}
window.fecharResumoVerificacaoEM=function(){
var m=document.getElementById("modalResumoVerificacaoEM");
if(m) m.remove();
};
window.verResumoVerificacaoEM=function(x){
window.fecharResumoVerificacaoEM();
var modal=document.createElement("div");
modal.id="modalResumoVerificacaoEM";
modal.style.cssText="position:fixed;inset:0;background:rgba(15,23,42,.48);z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px";
var card=document.createElement("div");
card.style.cssText="width:min(760px,100%);max-height:88vh;overflow:auto;background:#fff;border-radius:18px;box-shadow:0 24px 70px rgba(0,0,0,.2);padding:24px";
card.innerHTML=
"<div style='display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:14px'>"+
"<div><div style='font-size:12px;color:#64748b'>SOLICITA\u00C7\u00C3O DE VERIFICA\u00C7\u00C3O</div>"+
"<h2 style='margin:5px 0 0;font-size:24px;color:#0f172a'>"+esc(x.nome_fantasia||x.razao_social||"Empresa")+"</h2></div>"+
"<button type='button' id='fecharResumoEM' style='border:1px solid #dbe2ea;background:#fff;border-radius:9px;padding:8px 11px;cursor:pointer'>Fechar</button>"+
"</div>"+
linha("Raz\u00E3o social",x.razao_social)+
linha("Nome fantasia",x.nome_fantasia)+
linha("CNPJ",x.cnpj)+
linha("E-mail corporativo",x.email_corporativo)+
linha("Site",x.site)+
linha("Matriz",x.matriz)+
linha("Setor",x.setor)+
linha("Comprova\u00E7\u00E3o",x.comprovacao)+
linha("Observa\u00E7\u00E3o da empresa",x.observacao_empresa)+
linha("Enviada em",x.enviada_em ? new Date(x.enviada_em).toLocaleString("pt-BR") : "-")+
"<div style='display:flex;gap:10px;flex-wrap:wrap;margin-top:20px'>"+
"<button type='button' id='aprovarResumoEM' style='border:0;background:#159447;color:#fff;border-radius:9px;padding:11px 16px;font-weight:700;cursor:pointer'>\u2713 Aprovar verifica\u00E7\u00E3o</button>"+
"<button type='button' id='recusarResumoEM' style='border:1px solid #efb4b4;background:#fff;color:#c91e1e;border-radius:9px;padding:11px 16px;font-weight:700;cursor:pointer'>Recusar</button>"+
"</div>";
modal.appendChild(card);
document.body.appendChild(modal);
document.getElementById("fecharResumoEM").onclick=window.fecharResumoVerificacaoEM;
modal.onclick=function(e){if(e.target===modal) window.fecharResumoVerificacaoEM();};
document.getElementById("aprovarResumoEM").onclick=function(){
window.fecharResumoVerificacaoEM();
if(typeof window.aprovarVerificacaoAdminSupabaseEM==="function"){
window.aprovarVerificacaoAdminSupabaseEM(x.verificacao_id);
} else {
var botoes=document.querySelectorAll("#listaVerificacoesAdmin .btn-verde");
for(var i=0;i<botoes.length;i++){
if(botoes[i].dataset.verificacaoId===x.verificacao_id){botoes[i].click();break;}
}
}
};
document.getElementById("recusarResumoEM").onclick=function(){
window.fecharResumoVerificacaoEM();
if(typeof window.rejeitarVerificacaoAdminSupabaseEM==="function"){
window.rejeitarVerificacaoAdminSupabaseEM(x.verificacao_id);
}
};
};
function adicionarBotoesVer(){
var cards=document.querySelectorAll("#listaVerificacoesAdmin .admin-verificacao-card");
cards.forEach(function(card){
if(card.querySelector(".btn-ver-resumo-em")) return;
var acoes=card.querySelector(".admin-verificacao-acoes");
if(!acoes) return;
var titulo=(card.querySelector("h3")||{}).textContent||"";
var lista=window.__ultimaListaVerificacoesEM||[];
var x=lista.find(function(i){return (i.nome_fantasia||i.razao_social||"")===titulo;});
if(!x) return;
var b=document.createElement("button");
b.type="button";
b.className="btn btn-ver-resumo-em";
b.textContent="\uD83D\uDC41 Ver resumo";
b.style.cssText="border:1px solid #cbd5e1;background:#fff;color:#0f172a;border-radius:9px;padding:10px 15px;font-weight:700;cursor:pointer";
b.onclick=function(){window.verResumoVerificacaoEM(x);};
acoes.insertBefore(b,acoes.firstChild);
});
}
var fetchOriginal=window.fetch;
window.fetch=async function(){
var r=await fetchOriginal.apply(this,arguments);
try{
var url=String(arguments[0]||"");
if(url.indexOf("/rpc/admin_listar_verificacoes")>=0 && r.ok){
var clone=r.clone();
clone.json().then(function(d){
if(Array.isArray(d)){
window.__ultimaListaVerificacoesEM=d;
setTimeout(adicionarBotoesVer,80);
setTimeout(adicionarBotoesVer,350);
}
}).catch(function(){});
}
}catch(e){}
return r;
};
var obs=new MutationObserver(function(){adicionarBotoesVer();});
document.addEventListener("DOMContentLoaded",function(){
var box=document.getElementById("listaVerificacoesAdmin");
if(box) obs.observe(box,{childList:true,subtree:true});
setTimeout(adicionarBotoesVer,800);
});
})();
//
;
//
(function(){
var U="https://mkezlcewyengejdmtppl.supabase.co";
var K="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
function tokenEmpresaEM(){
var chaves=[
"empregaMaisSupabaseAccessToken",
"empregaMaisSupabaseEmpresaAccessToken",
"supabaseEmpresaAccessToken"
];
for(var i=0;i<chaves.length;i++){
try{
var t=localStorage.getItem(chaves[i])||sessionStorage.getItem(chaves[i])||"";
if(t) return t;
}catch(e){}
}
try{
for(var j=0;j<localStorage.length;j++){
var k=localStorage.key(j)||"";
if(/supabase/i.test(k) && /token/i.test(k) && !/admin/i.test(k)){
var x=localStorage.getItem(k)||"";
if(x) return x;
}
}
for(var q=0;q<sessionStorage.length;q++){
var ks=sessionStorage.key(q)||"";
if(/supabase/i.test(ks) && /token/i.test(ks) && !/admin/i.test(ks)){
var xs=sessionStorage.getItem(ks)||"";
if(xs) return xs;
}
}
}catch(e){}
return "";
}
async function empresaAtualEM(){
var t=tokenEmpresaEM();
if(!t) return null;
var r=await fetch(U+"/rest/v1/empresas?select=id,verificacao_status,verificada,verificacao_motivo,plano_id,plano_valido_ate,plano_inicio,plano_sem_cobranca&amp;limit=1",{
headers:{"apikey":K,"Authorization":"Bearer "+t}
});
if(!r.ok) return null;
var d=await r.json();
return Array.isArray(d)&&d.length?d[0]:null;
}
function aplicarStatusEM(emp){
if(!emp) return;
var status=String(emp.verificacao_status||"nao_verificada");
var textos={
"verificada":"\u2713 Empresa verificada",
"em_analise":"Em an\u00E1lise",
"rejeitada":"Verifica\u00E7\u00E3o recusada",
"nao_verificada":"Empresa n\u00E3o verificada"
};
var texto=textos[status]||textos.nao_verificada;
var candidatos=document.querySelectorAll(
"#pagina-painel-recrutador [id*='verifica'],#pagina-painel-recrutador [class*='verifica'],"+
"#painel-recrutador [id*='verifica'],#painel-recrutador [class*='verifica']"
);
candidatos.forEach(function(el){
var atual=(el.textContent||"").trim().toLowerCase();
if(atual==="em an\u00E1lise" || atual==="em analise" ||
atual.indexOf("empresa verificada")>=0 ||
atual.indexOf("empresa n\u00E3o verificada")>=0 ||
atual.indexOf("empresa nao verificada")>=0 ||
atual.indexOf("verifica\u00E7\u00E3o recusada")>=0 ||
atual.indexOf("verificacao recusada")>=0){
el.textContent=texto;
el.setAttribute("data-status-supabase",status);
}
});
document.querySelectorAll("#pagina-painel-recrutador *,#painel-recrutador *").forEach(function(el){
if(el.children.length===0 && /^(em an\u00E1lise|em analise)$/i.test((el.textContent||"").trim())){
el.textContent=texto;
el.setAttribute("data-status-supabase",status);
}
});
if(status==="verificada"){
document.querySelectorAll(
"#pagina-painel-recrutador button,#painel-recrutador button,"+
"#pagina-painel-recrutador a,#painel-recrutador a"
).forEach(function(b){
var tx=(b.textContent||"").toLowerCase();
if(tx.indexOf("solicitar verifica\u00E7\u00E3o")>=0 || tx.indexOf("solicitar verificacao")>=0 ||
tx.indexOf("enviar verifica\u00E7\u00E3o")>=0 || tx.indexOf("enviar verificacao")>=0){
b.style.display="none";
}
});
}
if(status==="rejeitada" && emp.verificacao_motivo){
var area=document.querySelector("#pagina-painel-recrutador [data-verificacao-motivo],#painel-recrutador [data-verificacao-motivo]");
if(area) area.textContent=emp.verificacao_motivo;
}
}
window.atualizarStatusVerificacaoRecrutadorEM=async function(){
try{
var emp=await empresaAtualEM();
aplicarStatusEM(emp);
return emp;
}catch(e){
console.error("Status verifica\u00E7\u00E3o recrutador:",e);
return null;
}
};
var ir0=window.irPara;
if(typeof ir0==="function"){
window.irPara=function(p){
var r=ir0.apply(this,arguments);
if(String(p).indexOf("recrut")>=0) setTimeout(window.atualizarStatusVerificacaoRecrutadorEM,180);
return r;
};
}
var mostrar0=window.mostrarPagina;
if(typeof mostrar0==="function"){
window.mostrarPagina=function(p){
var r=mostrar0.apply(this,arguments);
if(String(p).indexOf("recrut")>=0) setTimeout(window.atualizarStatusVerificacaoRecrutadorEM,180);
return r;
};
}
document.addEventListener("DOMContentLoaded",function(){
setTimeout(window.atualizarStatusVerificacaoRecrutadorEM,500);
setTimeout(window.atualizarStatusVerificacaoRecrutadorEM,1400);
});
})();
//
;
//
(function(){
var U="https://mkezlcewyengejdmtppl.supabase.co";
var K="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
var TK="empregaMaisSupabaseAccessToken";
function token(){
try{return sessionStorage.getItem(TK)||"";}catch(e){return "";}
}
function nums(v){return String(v||"").replace(/\D/g,"");}
async function buscar(){
var t=token();
if(!t) return null;
var r=await fetch(U+"/rest/v1/empresas?select=cnpj,verificacao_status,verificada,verificacao_motivo,plano_id,plano_valido_ate,plano_inicio,plano_sem_cobranca&amp;limit=1",{
headers:{"apikey":K,"Authorization":"Bearer "+t}
});
if(!r.ok) throw new Error("HTTP "+r.status);
var a=await r.json();
return Array.isArray(a)&&a.length?a[0]:null;
}
function sincronizarLocal(emp){
if(!emp) return;
var cnpj=nums(emp.cnpj);
try{
var lista=JSON.parse(localStorage.getItem("empresasEmpregaMais")||"[]");
var mudou=false;
lista.forEach(function(x){
if(nums(x.cnpj)===cnpj){
x.verificacaoStatus=emp.verificacao_status||"nao_verificada";
x.statusVerificacao=x.verificacaoStatus;
x.verificada=emp.verificada===true;
x.verificacaoMotivo=emp.verificacao_motivo||"";
var plano=String(emp.plano_id||"basico").toLowerCase().trim();
if(["basico","trimestral","semestral","anual"].indexOf(plano)<0)plano="basico";
x.plano=plano;
x.planoId=plano;
x.plano_id=plano;
if(emp.plano_valido_ate){
x.planoValidoAte=emp.plano_valido_ate;
x.plano_valido_ate=emp.plano_valido_ate;
}
if(emp.plano_inicio){
x.planoInicio=emp.plano_inicio;
x.plano_inicio=emp.plano_inicio;
}
if(typeof emp.plano_sem_cobranca!=="undefined"){
x.planoSemCobranca=emp.plano_sem_cobranca;
x.plano_sem_cobranca=emp.plano_sem_cobranca;
}
x.assinaturaAtiva=plano!=="basico";
mudou=true;
try{
if(["trimestral","semestral","anual"].indexOf(plano)>=0){
sessionStorage.setItem("empregaMaisPlanoConfirmadoV48",JSON.stringify({
id:String(x.cnpj||x.email||"").replace(/\s/g,"").toLowerCase(),
plano:plano,
validoAte:x.planoValidoAte||""
}));
}
}catch(err){}
}
});
if(mudou) localStorage.setItem("empresasEmpregaMais",JSON.stringify(lista));
try{document.dispatchEvent(new Event("empregamais:empresa-sincronizada"));}catch(err){}
}catch(e){console.error("Sincroniza\u00E7\u00E3o local da verifica\u00E7\u00E3o:",e);}
}
function atualizarTela(emp){
if(!emp) return;
var st=String(emp.verificacao_status||"nao_verificada");
var box=document.getElementById("statusVerificacaoPagina");
if(box){
if(st==="verificada" && emp.verificada===true){
box.innerHTML="<h3>\u2713 Empresa verificada</h3><p>Sua empresa foi aprovada pela administra\u00E7\u00E3o e o selo de verifica\u00E7\u00E3o est\u00E1 ativo.</p>";
}else if(st==="rejeitada"){
box.innerHTML="<h3>Status: verifica\u00E7\u00E3o recusada</h3><p>"+String(emp.verificacao_motivo||"Revise os dados e envie novamente.")+"</p>";
}else if(st==="em_analise"){
box.innerHTML="<h3>Status: em an\u00E1lise</h3><p>A administra\u00E7\u00E3o ainda n\u00E3o concluiu a an\u00E1lise da solicita\u00E7\u00E3o.</p>";
}else{
box.innerHTML="<h3>Status: n\u00E3o verificada</h3><p>Preencha os dados abaixo para solicitar a verifica\u00E7\u00E3o.</p>";
}
}
try{if(typeof atualizarMenuVerificacaoEmpresa==="function") atualizarMenuVerificacaoEmpresa();}catch(e){}
try{if(typeof atualizarCardVerificacaoEmpresa==="function") atualizarCardVerificacaoEmpresa();}catch(e){}
try{
var plano=String(emp.plano_id||"basico").toLowerCase();
var nome={basico:"B\u00E1sico",trimestral:"Trimestral",semestral:"Semestral",anual:"Anual"}[plano]||"B\u00E1sico";
document.querySelectorAll(".recrutador-plano-em strong").forEach(function(el){el.textContent=nome;});
document.body.classList.toggle("empresa-premium-v44",plano!=="basico");
if(typeof aplicarVisualPremiumV44==="function")aplicarVisualPremiumV44();
}catch(e){}
}
window.sincronizarVerificacaoEmpresaSupabaseEM=async function(){
try{
var emp=await buscar();
if(!emp) return null;
sincronizarLocal(emp);
atualizarTela(emp);
return emp;
}catch(e){
console.error("EmpregaMais / status Supabase:",e);
return null;
}
};
var ir=window.irPara;
if(typeof ir==="function"){
window.irPara=function(p){
var r=ir.apply(this,arguments);
var pg=String(p||"");
if(pg==="painel-empresa" || pg==="verificacao-empresa" || pg==="perfil-empresa"){
setTimeout(window.sincronizarVerificacaoEmpresaSupabaseEM,100);
setTimeout(window.sincronizarVerificacaoEmpresaSupabaseEM,500);
}
return r;
};
}
document.addEventListener("DOMContentLoaded",function(){
if(token()){
setTimeout(window.sincronizarVerificacaoEmpresaSupabaseEM,250);
setTimeout(window.sincronizarVerificacaoEmpresaSupabaseEM,900);
}
});
})();
//
;
//
(function(){
var abaAtual="visao-geral";
window.abrirAbaAdminEM=function(nome,botao){
abaAtual=nome||"visao-geral";
var pagina=document.getElementById("pagina-painel-admin");
if(!pagina) return;
pagina.querySelectorAll(".admin-aba-conteudo-em").forEach(function(el){
el.classList.toggle("admin-aba-ativa-em",el.getAttribute("data-admin-aba-em")===abaAtual);
});
pagina.querySelectorAll("#adminTabsPrincipaisEM [data-admin-tab-em]").forEach(function(b){
b.classList.toggle("ativo",b.getAttribute("data-admin-tab-em")===abaAtual);
});
if(abaAtual==="verificacoes" && typeof renderizarVerificacoesAdmin==="function"){
setTimeout(renderizarVerificacoesAdmin,80);
}
if(abaAtual==="empresas" && typeof renderizarEmpresasAdminEM==="function"){
setTimeout(renderizarEmpresasAdminEM,80);
}
if(abaAtual==="vagas" && typeof renderizarPainelAdmin==="function"){
setTimeout(renderizarPainelAdmin,80);
}
window.scrollTo({top:0,behavior:"smooth"});
};
function badges(){
var pv=document.getElementById("adminPendentes");
var bv=document.getElementById("adminTabVagasBadgeEM");
if(pv&&bv) bv.textContent=(pv.textContent||"0").trim();
var box=document.getElementById("listaVerificacoesAdmin");
var bver=document.getElementById("adminTabVerificacoesBadgeEM");
if(box&&bver){
var cards=box.querySelectorAll(".admin-verificacao-card").length;
bver.textContent=String(cards);
}
}
function iniciar(){
var pagina=document.getElementById("pagina-painel-admin");
if(!pagina) return;
window.abrirAbaAdminEM(abaAtual);
badges();
var obs=new MutationObserver(badges);
["adminPendentes","listaVerificacoesAdmin"].forEach(function(id){
var el=document.getElementById(id);
if(el) obs.observe(el,{childList:true,subtree:true,characterData:true});
});
}
document.addEventListener("DOMContentLoaded",function(){setTimeout(iniciar,250);});
window.addEventListener("load",function(){setTimeout(iniciar,450);});
window.focarEmpresasAdminEM=function(){window.abrirAbaAdminEM("empresas");};
window.focarVerificacoesAdminEM=function(){window.abrirAbaAdminEM("verificacoes");};
window.focarPlanosAdminEM=function(){window.abrirAbaAdminEM("planos");};
})();
//
;
//
(function(){
var U="https://mkezlcewyengejdmtppl.supabase.co";
var K="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
var TK="empregaMaisAdminSupabaseToken";
var empresas=[];
function token(){try{return localStorage.getItem(TK)||"";}catch(e){return "";}}
async function rpc(nome,body){
var t=token();
if(!t) throw new Error("Sess\u00E3o administrativa n\u00E3o encontrada.");
var r=await fetch(U+"/rest/v1/rpc/"+nome,{
method:"POST",
headers:{"apikey":K,"Authorization":"Bearer "+t,"Content-Type":"application/json"},
body:JSON.stringify(body||{})
});
var txt=await r.text(),d=null;
try{d=txt?JSON.parse(txt):null;}catch(e){d=txt;}
if(!r.ok) throw new Error((d&&d.message)||String(d||("HTTP "+r.status)));
return d;
}
function esc(v){return String(v==null?"":v).replace(/[&amp;<>"']/g,function(c){
return {"&amp;":"&amp;amp;","<":"&amp;lt;",">":"&amp;gt;",'"':"&amp;quot;","'":"&amp;#39;"}[c];
});}
function data(v){if(!v)return "-";try{return new Date(v).toLocaleDateString("pt-BR");}catch(e){return "-";}}
function els(){
return {
empresa:document.getElementById("adminEmpresaPlanoEM"),
plano:document.getElementById("adminPlanoLiberarEM"),
info:document.getElementById("adminPlanoAtualInfoEM"),
liberar:document.getElementById("adminBtnLiberarPlanoEM"),
basico:document.getElementById("adminBtnPlanoBasicoEM")
};
}
function garantirPlanos(){
var e=els(), sel=e.plano;
if(!sel)return;
sel.innerHTML=
"<option value='basico'>B\u00E1sico \u2014 Gratuito</option>"+
"<option value='trimestral'>Trimestral \u2014 R$ 79,90 / 90 dias</option>"+
"<option value='semestral'>Semestral \u2014 R$ 139,90 / 180 dias</option>"+
"<option value='anual'>Anual \u2014 R$ 239,90 / 365 dias</option>";
}
function mostrarAtual(){
var e=els();
if(!e.empresa||!e.info)return;
var id=e.empresa.value;
var x=empresas.find(function(a){return a.empresa_id===id;});
if(!x){
e.info.innerHTML="Selecione uma empresa para visualizar o plano atual.";
return;
}
var nome=x.plano_nome||({basico:"B\u00E1sico",trimestral:"Trimestral",semestral:"Semestral",anual:"Anual"}[x.plano_id||x.plano]||"B\u00E1sico");
e.info.innerHTML=
"<strong>"+esc(x.nome_fantasia||x.razao_social||x.cnpj)+"</strong>"+
" &amp;nbsp;\u2022&amp;nbsp; Plano atual: <strong>"+esc(nome)+"</strong>"+
" &amp;nbsp;\u2022&amp;nbsp; Validade: <strong>"+esc(data(x.plano_valido_ate))+"</strong>"+
(x.plano_sem_cobranca?" &amp;nbsp;\u2022&amp;nbsp; <strong>Libera\u00E7\u00E3o administrativa</strong>":"");
if(e.plano) e.plano.value=x.plano_id||x.plano||"basico";
}
window.carregarEmpresasPlanosSupabaseEM=async function(){
var e=els();
if(!e.empresa)return;
e.empresa.innerHTML="<option value=''>Carregando empresas...</option>";
garantirPlanos();
try{
var lista=await rpc("admin_listar_empresas",{});
empresas=Array.isArray(lista)?lista:[];
e.empresa.innerHTML="<option value=''>Selecione uma empresa</option>";
empresas.forEach(function(x){
var o=document.createElement("option");
o.value=x.empresa_id;
o.textContent=(x.nome_fantasia||x.razao_social||"Empresa")+" \u2014 "+(x.cnpj||"");
e.empresa.appendChild(o);
});
if(!empresas.length)e.empresa.innerHTML="<option value=''>Nenhuma empresa cadastrada</option>";
e.empresa.onchange=mostrarAtual;
mostrarAtual();
}catch(err){
console.error("Empresas/planos Supabase:",err);
e.empresa.innerHTML="<option value=''>Erro ao carregar empresas</option>";
if(e.info)e.info.textContent="Erro: "+err.message;
}
};
async function definir(plano){
var e=els();
var id=e.empresa&&e.empresa.value;
if(!id){alert("Selecione uma empresa.");return;}
var x=empresas.find(function(a){return a.empresa_id===id;});
var nome=x?(x.nome_fantasia||x.razao_social||"empresa"):"empresa";
var rot={basico:"B\u00E1sico",trimestral:"Trimestral",semestral:"Semestral",anual:"Anual"}[plano]||plano;
if(!confirm("Definir o plano "+rot+" para "+nome+"?"))return;
try{
await rpc("admin_definir_plano_empresa",{p_empresa_id:id,p_plano_id:plano});
alert(plano==="basico"?"Empresa retornada ao plano B\u00E1sico.":"Plano "+rot+" liberado com sucesso.");
await window.carregarEmpresasPlanosSupabaseEM();
var ee=els(); if(ee.empresa){ee.empresa.value=id;mostrarAtual();}
}catch(err){alert("Erro ao alterar plano: "+err.message);}
}
function ligar(){
var e=els();
if(!e.empresa)return;
garantirPlanos();
if(e.liberar)e.liberar.onclick=function(ev){ev.preventDefault();definir((els().plano||{}).value||"basico");};
if(e.basico)e.basico.onclick=function(ev){ev.preventDefault();definir("basico");};
window.carregarEmpresasPlanosSupabaseEM();
}
function identificar(){
var sec=document.getElementById("adminLiberarPlanoEM");
if(!sec)return;
var sels=sec.querySelectorAll("select");
if(sels[0]&&!sels[0].id)sels[0].id="adminEmpresaPlanoEM";
if(sels[1]&&!sels[1].id)sels[1].id="adminPlanoLiberarEM";
var divs=sec.querySelectorAll("div");
divs.forEach(function(d){
if(!d.id && /selecione uma empresa para visualizar o plano atual/i.test(d.textContent||""))d.id="adminPlanoAtualInfoEM";
});
sec.querySelectorAll("button").forEach(function(b){
var t=(b.textContent||"").toLowerCase();
if(t.indexOf("liberar plano")>=0)b.id="adminBtnLiberarPlanoEM";
if(t.indexOf("retornar ao plano b\u00E1sico")>=0 || t.indexOf("retornar ao plano basico")>=0)b.id="adminBtnPlanoBasicoEM";
});
ligar();
}
var abrir0=window.abrirAbaAdminEM;
if(typeof abrir0==="function"){
window.abrirAbaAdminEM=function(nome,botao){
var r=abrir0.apply(this,arguments);
if(nome==="planos")setTimeout(identificar,80);
return r;
};
}
document.addEventListener("DOMContentLoaded",function(){setTimeout(identificar,600);});
})();
//