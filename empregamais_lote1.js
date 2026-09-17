/* EmpregaMais - JavaScript externo - lote 1 v1 */

//
(function(){
"use strict";
var SB_URL="https://mkezlcewyengejdmtppl.supabase.co";
var SB_KEY="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
var TK="empregaMaisSupabaseAccessToken";
var RK="empregaMaisSupabaseRefreshToken";
function nums(v){return String(v||"").replace(/\D/g,"");}
function authEmail(cnpj){return nums(cnpj)+"@auth.empregamais.com.br";}
function token(){try{return sessionStorage.getItem(TK)||"";}catch(e){return "";}}
function clearToken(){try{sessionStorage.removeItem(TK);sessionStorage.removeItem(RK);}catch(e){}}
function req(path,opt){
opt=opt||{};
opt.headers=Object.assign({"apikey":SB_KEY,"Content-Type":"application/json"},opt.headers||{});
return fetch(SB_URL+path,opt).then(async function(r){
var txt=await r.text(), data={};
try{data=txt?JSON.parse(txt):{};}catch(e){data={message:txt};}
if(!r.ok) throw new Error(data.msg||data.message||data.error_description||data.error||("HTTP "+r.status));
return data;
});
}
function authReq(path,opt){
opt=opt||{};
opt.headers=Object.assign({"Authorization":"Bearer "+token()},opt.headers||{});
return req(path,opt);
}
function saveSession(a){
if(!a||!a.access_token) throw new Error("Sess\u00E3o n\u00E3o criada pelo Supabase.");
sessionStorage.setItem(TK,a.access_token);
if(a.refresh_token) sessionStorage.setItem(RK,a.refresh_token);
}
function clearLegacySession(){
try{
["empresaLogadaEmpregaMais","empresaAtualEmpregaMais","empresaNome","empresaCnpj","empresaEmail"].forEach(function(k){sessionStorage.removeItem(k);});
if(sessionStorage.getItem("empregaMaisPapel")==="empresa") sessionStorage.removeItem("empregaMaisPapel");
}catch(e){}
}
function getEmpresa(){
return authReq("/rest/v1/empresas?select=*&amp;limit=1",{method:"GET"}).then(function(a){return Array.isArray(a)&amp;&amp;a.length?a[0]:null;});
}
function userValid(){
if(!token()) return Promise.resolve(false);
return authReq("/auth/v1/user",{method:"GET"}).then(function(u){return !!(u&amp;&amp;u.id);}).catch(function(){return false;});
}
function companySessionValid(){
return userValid().then(function(ok){
if(!ok) return false;
return getEmpresa().then(function(e){return !!(e&amp;&amp;e.id);}).catch(function(){return false;});
});
}
function localCompany(cnpj,senha){
try{
var arr=JSON.parse(localStorage.getItem("empresasEmpregaMais")||"[]");
return arr.find(function(x){return nums(x.cnpj)===cnpj &amp;&amp; String(x.senha||"")===String(senha||"");})||null;
}catch(e){return null;}
}
function safePayload(local,userId,cnpj){
local=local||{};
return {
user_id:userId,
nome:String(local.nome||local.nomeFantasia||"Empresa"),
nome_fantasia:String(local.nomeFantasia||local.nome||"Empresa"),
razao_social:String(local.razaoSocial||local.nome||local.nomeFantasia||"Empresa"),
cnpj:cnpj,
email:String(local.email||""),
email_corporativo:String(local.emailCorporativo||local.email||""),
sobre:String(local.sobre||""),
sobre_institucional:String(local.sobreInstitucional||local.sobre||""),
site:String(local.site||""),
matriz:String(local.matriz||local.cidade||""),
setor:String(local.setor||""),
funcionarios:String(local.funcionarios||""),
faturamento:String(local.faturamento||""),
logo_url:String(local.logo||local.logo_url||""),
plano:"basico",
plano_id:"basico",
plano_nome:"B\u00E1sico",
plano_liberado_admin:false,
plano_sem_cobranca:false,
verificacao_status:"nao_verificada",
verificada:false,
aprovacao_automatica_suspensa:false
};
}
function insertEmpresa(payload){
return authReq("/rest/v1/empresas",{
method:"POST",
headers:{"Prefer":"return=representation"},
body:JSON.stringify(payload)
}).then(function(a){return Array.isArray(a)&amp;&amp;a.length?a[0]:null;});
}
function enterFromRemote(e){
if(!e||!e.id) throw new Error("Empresa n\u00E3o encontrada no Supabase.");
try{
var plano=String(e.plano_id||e.plano||"basico").toLowerCase().trim();
if(["basico","trimestral","semestral","anual"].indexOf(plano)&lt;0)plano="basico";
e.plano=plano;
e.planoId=plano;
e.plano_id=plano;
if(e.plano_valido_ate)e.planoValidoAte=e.plano_valido_ate;
if(e.plano_inicio)e.planoInicio=e.plano_inicio;
e.assinaturaAtiva=plano!=="basico";
sessionStorage.setItem("empregaMaisEmpresaRemotaV49",JSON.stringify(e));
var lista=JSON.parse(localStorage.getItem("empresasEmpregaMais")||"[]");
var cnpj=String(e.cnpj||"").replace(/\D/g,"");
var achou=false;
lista.forEach(function(x){
if(String(x.cnpj||"").replace(/\D/g,"")===cnpj){
x.plano=plano;x.planoId=plano;x.plano_id=plano;
x.planoValidoAte=e.plano_valido_ate||e.planoValidoAte||"";
x.plano_valido_ate=x.planoValidoAte;
x.planoInicio=e.plano_inicio||e.planoInicio||"";
x.plano_inicio=x.planoInicio;
x.planoSemCobranca=e.plano_sem_cobranca===true;
x.plano_sem_cobranca=e.plano_sem_cobranca===true;
x.assinaturaAtiva=plano!=="basico";
x.verificada=e.verificada===true;
x.verificacaoStatus=e.verificacao_status||x.verificacaoStatus||"";
achou=true;
}
});
if(!achou){
lista.push({
id:e.id,
nome:e.nome_fantasia||e.nome||"Empresa",
nomeFantasia:e.nome_fantasia||e.nome||"Empresa",
razaoSocial:e.razao_social||"",
cnpj:e.cnpj||"",
email:e.email||e.email_corporativo||"",
plano:plano,planoId:plano,plano_id:plano,
planoValidoAte:e.plano_valido_ate||"",
plano_valido_ate:e.plano_valido_ate||"",
assinaturaAtiva:plano!=="basico",
verificada:e.verificada===true,
verificacaoStatus:e.verificacao_status||""
});
}
localStorage.setItem("empresasEmpregaMais",JSON.stringify(lista));
}catch(x){console.warn("V49 snapshot empresa:",x);}
try{
sessionStorage.setItem("empregaMaisPapel","empresa");
sessionStorage.setItem("empresaNome",e.nome_fantasia||e.nome||"Empresa");
sessionStorage.setItem("empresaCnpj",e.cnpj||"");
sessionStorage.setItem("empresaEmail",e.email||e.email_corporativo||"");
}catch(x){}
if(typeof window.entrarComoEmpresa==="function"){
try{window.entrarComoEmpresa(e);}catch(x){}
}
try{sessionStorage.setItem("empregaMaisEmpresaRemotaV49",JSON.stringify(e));}catch(x){}
if(typeof window.irPara==="function") window.irPara("painel-empresa");
}
function fail(msg,e){
console.error("EmpregaMais/Supabase:",e||msg);
clearToken(); clearLegacySession();
alert(msg);
}
window.loginEmpresa=function(ev){
if(ev) ev.preventDefault();
clearToken(); clearLegacySession();
var cnpj=nums(document.getElementById("loginEmpresaCnpj").value);
var senha=String(document.getElementById("loginEmpresaSenha").value||"");
if(cnpj.length!==14||!senha){alert("Informe CNPJ e senha.");return false;}
req("/auth/v1/token?grant_type=password",{
method:"POST",body:JSON.stringify({email:authEmail(cnpj),password:senha})
}).then(function(a){
saveSession(a);
return getEmpresa().then(function(e){return {auth:a,empresa:e};});
}).then(function(x){
if(x.empresa){enterFromRemote(x.empresa);return;}
var old=localCompany(cnpj,senha);
if(!old) throw new Error("Usu\u00E1rio autenticado, mas a empresa ainda n\u00E3o possui cadastro.");
return insertEmpresa(safePayload(old,x.auth.user.id,cnpj)).then(enterFromRemote);
}).catch(function(loginErr){
var old=localCompany(cnpj,senha);
if(!old) throw loginErr;
return req("/auth/v1/signup",{
method:"POST",body:JSON.stringify({email:authEmail(cnpj),password:senha})
}).then(function(a){
saveSession(a);
if(!a.user||!a.user.id) throw new Error("O Supabase n\u00E3o retornou o usu\u00E1rio criado.");
return insertEmpresa(safePayload(old,a.user.id,cnpj));
}).then(enterFromRemote);
}).catch(function(e){
fail("N\u00E3o foi poss\u00EDvel entrar. A empresa n\u00E3o foi autenticada pelo Supabase.",e);
});
return false;
};
var oldIrPara=window.irPara;
window.irPara=function(page){
var p=String(page||"");
var protectedPage=["painel-empresa","perfil-empresa","verificacao-empresa","publicar-vaga"].indexOf(p)&gt;=0;
if(!protectedPage) return oldIrPara.apply(this,arguments);
var args=arguments, self=this;
companySessionValid().then(function(ok){
if(ok) oldIrPara.apply(self,args);
else{
clearToken(); clearLegacySession();
oldIrPara.call(self,"login-empresa");
}
});
return false;
};
window.addEventListener("load",function(){
companySessionValid().then(function(ok){
if(!ok) clearLegacySession();
});
});
})();
//
;
//
(function(){
var SB_URL_V="https://mkezlcewyengejdmtppl.supabase.co";
var SB_KEY_V="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
var TK_V="empregaMaisSupabaseAccessToken";
function val(id){
var e=document.getElementById(id);
return e ? String(e.value||"").trim() : "";
}
function tokenV(){
try{return sessionStorage.getItem(TK_V)||"";}catch(e){return "";}
}
function rpcVerificacao(payload){
var tk=tokenV();
if(!tk) return Promise.reject(new Error("Sess\u00E3o da empresa n\u00E3o encontrada."));
return fetch(SB_URL_V+"/rest/v1/rpc/solicitar_verificacao_empresa",{
method:"POST",
headers:{
"apikey":SB_KEY_V,
"Authorization":"Bearer "+tk,
"Content-Type":"application/json"
},
body:JSON.stringify(payload)
}).then(async function(r){
var txt=await r.text(), data=null;
try{data=txt?JSON.parse(txt):null;}catch(e){data=txt;}
if(!r.ok){
var msg=(data&amp;&amp;(data.message||data.msg||data.error_description))||String(data||("HTTP "+r.status));
throw new Error(msg);
}
return data;
});
}
window.enviarVerificacaoEmpresa=function(event){
if(event) event.preventDefault();
var payload={
p_razao_social: val("verRazaoSocial") || val("verificacaoRazaoSocial"),
p_nome_fantasia: val("verNomeFantasia") || val("verificacaoNomeFantasia"),
p_email_corporativo: val("verEmailCorporativo") || val("verificacaoEmailCorporativo"),
p_site: val("verSite") || val("verificacaoSite"),
p_matriz: val("verMatriz") || val("verificacaoMatriz"),
p_setor: val("verSetor") || val("verificacaoSetor"),
p_funcionarios: val("verFuncionarios") || val("verificacaoFuncionarios"),
p_faturamento: val("verFaturamento") || val("verificacaoFaturamento"),
p_comprovacao: val("verComprovacao") || val("verificacaoComprovacao"),
p_sobre_institucional: val("verSobreInstitucional") || val("verificacaoSobreInstitucional")
};
rpcVerificacao(payload).then(function(){
if(typeof mostrarToast==="function") mostrarToast("Solicita\u00E7\u00E3o de verifica\u00E7\u00E3o enviada.");
alert("Solicita\u00E7\u00E3o enviada para an\u00E1lise com sucesso.");
if(typeof irPara==="function") irPara("painel-empresa");
}).catch(function(e){
console.error("EmpregaMais / verifica\u00E7\u00E3o Supabase:",e);
alert("N\u00E3o foi poss\u00EDvel enviar a verifica\u00E7\u00E3o ao Supabase: "+e.message);
});
return false;
};
document.addEventListener("submit",function(e){
var f=e.target;
if(!f) return;
var id=String(f.id||"").toLowerCase();
if(id.indexOf("verific")&gt;=0){
e.preventDefault();
e.stopImmediatePropagation();
window.enviarVerificacaoEmpresa(e);
}
},true);
})();
//
;
//
(function(){
function campoV(id){
var el=document.getElementById(id);
return el ? String(el.value||"").trim() : "";
}
window.enviarVerificacaoEmpresa=function(event){
if(event){
event.preventDefault();
event.stopPropagation();
}
var tk="";
try{tk=sessionStorage.getItem("empregaMaisSupabaseAccessToken")||"";}catch(e){}
if(!tk){
alert("Sua sess\u00E3o do Supabase expirou. Entre novamente.");
return false;
}
var payload={
p_razao_social:campoV("verificaRazaoSocial"),
p_nome_fantasia:campoV("verificaNomeFantasia"),
p_email_corporativo:campoV("verificaEmailCorporativo"),
p_site:campoV("verificaSite"),
p_matriz:campoV("verificaMatriz"),
p_setor:campoV("verificaSetor"),
p_funcionarios:campoV("verificaFuncionarios"),
p_faturamento:campoV("verificaFaturamento"),
p_comprovacao:campoV("verificaComprovacao"),
p_sobre_institucional:campoV("verificaSobre")
};
fetch("https://mkezlcewyengejdmtppl.supabase.co/rest/v1/rpc/solicitar_verificacao_empresa",{
method:"POST",
headers:{
"apikey":"sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR",
"Authorization":"Bearer "+tk,
"Content-Type":"application/json"
},
body:JSON.stringify(payload)
})
.then(async function(r){
var txt=await r.text();
var data=null;
try{data=txt?JSON.parse(txt):null;}catch(e){data=txt;}
if(!r.ok){
var msg=(data&amp;&amp;data.message)||String(data||("HTTP "+r.status));
throw new Error(msg);
}
return data;
})
.then(function(){
alert("Solicita\u00E7\u00E3o de verifica\u00E7\u00E3o enviada para an\u00E1lise.");
if(typeof preencherFormularioVerificacaoEmpresa==="function"){
try{preencherFormularioVerificacaoEmpresa();}catch(e){}
}
if(typeof atualizarMenuVerificacaoEmpresa==="function"){
try{atualizarMenuVerificacaoEmpresa();}catch(e){}
}
setTimeout(function(){
if(typeof irPara==="function") irPara("painel-empresa");
},300);
})
.catch(function(e){
console.error("EmpregaMais / verifica\u00E7\u00E3o Supabase:",e);
alert("Erro ao enviar a verifica\u00E7\u00E3o ao Supabase: "+e.message);
});
return false;
};
})();
//
;
//
(function(){
var U="https://mkezlcewyengejdmtppl.supabase.co";
var K="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
var AT="empregaMaisAdminSupabaseToken";
function el(id){return document.getElementById(id);}
function v(id){var x=el(id);return x?String(x.value||"").trim():"";}
function tok(){try{return localStorage.getItem(AT)||"";}catch(e){return "";}}
function setTok(t){try{localStorage.setItem(AT,t||"");}catch(e){}}
function clearTok(){try{localStorage.removeItem(AT);}catch(e){}}
async function call(path,opt){
opt=opt||{};
opt.headers=Object.assign({"apikey":K,"Content-Type":"application/json"},opt.headers||{});
var r=await fetch(U+path,opt), txt=await r.text(), d=null;
try{d=txt?JSON.parse(txt):null;}catch(e){d=txt;}
if(!r.ok) throw new Error((d&amp;&amp;(d.message||d.msg||d.error_description))||String(d||("HTTP "+r.status)));
return d;
}
function rpc(name,body){
var t=tok();
if(!t) return Promise.reject(new Error("Administrador n\u00E3o autenticado no Supabase."));
return call("/rest/v1/rpc/"+name,{
method:"POST",
headers:{"Authorization":"Bearer "+t},
body:JSON.stringify(body||{})
});
}
function adminEmail(){
return v("adminEmail")||v("loginAdminEmail")||v("emailAdmin");
}
function adminSenha(){
return v("adminSenha")||v("loginAdminSenha")||v("senhaAdmin");
}
window.loginAdminSupabaseEM=function(event){
if(event) event.preventDefault();
var email="admin@empregamais.com.br", senha=adminSenha();
if(!senha){alert("Informe a senha do administrador.");return false;}
call("/auth/v1/token?grant_type=password",{
method:"POST",body:JSON.stringify({email:email,password:senha})
}).then(function(a){
if(!a||!a.access_token) throw new Error("Sess\u00E3o administrativa n\u00E3o criada.");
setTok(a.access_token);
try{if(a.refresh_token)localStorage.setItem("empregaMaisAdminSupabaseRefreshToken",a.refresh_token);}catch(e){}
return rpc("admin_listar_verificacoes",{});
}).then(function(){
try{localStorage.setItem("empregaMaisPapel","admin"); sessionStorage.setItem("empregaMaisPapel","admin");}catch(e){}
if(typeof irPara==="function") irPara("admin");
setTimeout(window.carregarVerificacoesAdminSupabaseEM,100);
}).catch(function(e){
clearTok();
console.error("Admin Supabase:",e);
alert("N\u00E3o foi poss\u00EDvel entrar como administrador: "+e.message);
});
return false;
};
function esc(x){
return String(x==null?"":x).replace(/[&amp;&lt;&gt;"']/g,function(c){
return {"&amp;":"&amp;amp;","&lt;":"&amp;lt;","&gt;":"&amp;gt;",'"':"&amp;quot;","'":"&amp;#39;"}[c];
});
}
window.carregarVerificacoesAdminSupabaseEM=function(){
return rpc("admin_listar_verificacoes",{}).then(function(lista){
lista=Array.isArray(lista)?lista:[];
var alvo=el("adminVerificacoesLista")||el("listaVerificacoesAdmin")||
document.querySelector("[data-admin-verificacoes]")||
document.querySelector("#admin .verificacoes-lista");
if(!alvo){
var painel=el("pagina-admin")||el("admin")||document.querySelector(".pagina-admin");
if(!painel) return;
alvo=document.createElement("div");
alvo.id="adminVerificacoesLista";
alvo.style.marginTop="24px";
painel.appendChild(alvo);
}
var pendentes=lista.filter(function(x){return x.status==="em_analise";});
var html='&lt;div style="background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:20px;"&gt;'+
'&lt;h3 style="margin:0 0 16px;"&gt;Verifica\u00E7\u00F5es de empresas&lt;/h3&gt;';
if(!pendentes.length){
html+='&lt;p style="margin:0;color:#6b7280;"&gt;Nenhuma solicita\u00E7\u00E3o aguardando an\u00E1lise.&lt;/p&gt;';
}else{
pendentes.forEach(function(x){
html+='&lt;div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;margin-bottom:12px;"&gt;'+
'&lt;strong&gt;'+esc(x.nome_fantasia||x.razao_social||"Empresa")+'&lt;/strong&gt;'+
'&lt;div style="margin-top:8px;font-size:14px;line-height:1.6;"&gt;'+
'&lt;b&gt;Raz\u00E3o social:&lt;/b&gt; '+esc(x.razao_social)+'&lt;br/&gt;'+
'&lt;b&gt;CNPJ:&lt;/b&gt; '+esc(x.cnpj)+'&lt;br/&gt;'+
'&lt;b&gt;E-mail:&lt;/b&gt; '+esc(x.email_corporativo)+'&lt;br/&gt;'+
'&lt;b&gt;Site:&lt;/b&gt; '+esc(x.site)+'&lt;br/&gt;'+
'&lt;b&gt;Matriz:&lt;/b&gt; '+esc(x.matriz)+'&lt;br/&gt;'+
'&lt;b&gt;Setor:&lt;/b&gt; '+esc(x.setor)+'&lt;br/&gt;'+
'&lt;b&gt;Comprova\u00E7\u00E3o:&lt;/b&gt; '+esc(x.comprovacao)+
'&lt;/div&gt;'+
'&lt;div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;"&gt;'+
'&lt;button type="button" onclick="aprovarVerificacaoAdminSupabaseEM(\''+esc(x.verificacao_id)+'\')" style="padding:9px 14px;border:0;border-radius:8px;cursor:pointer;"&gt;Aprovar&lt;/button&gt;'+
'&lt;button type="button" onclick="rejeitarVerificacaoAdminSupabaseEM(\''+esc(x.verificacao_id)+'\')" style="padding:9px 14px;border:1px solid #d1d5db;border-radius:8px;cursor:pointer;background:#fff;"&gt;Rejeitar&lt;/button&gt;'+
'&lt;/div&gt;&lt;/div&gt;';
});
}
html+='&lt;/div&gt;';
alvo.innerHTML=html;
}).catch(function(e){
console.error("Listagem Admin Supabase:",e);
});
};
window.aprovarVerificacaoAdminSupabaseEM=function(id){
if(!confirm("Aprovar a verifica\u00E7\u00E3o desta empresa?")) return;
rpc("admin_aprovar_verificacao",{p_verificacao_id:id}).then(function(){
alert("Empresa verificada com sucesso.");
return window.carregarVerificacoesAdminSupabaseEM();
}).catch(function(e){alert("Erro ao aprovar: "+e.message);});
};
window.rejeitarVerificacaoAdminSupabaseEM=function(id){
var motivo=prompt("Informe o motivo da rejei\u00E7\u00E3o:");
if(motivo===null) return;
motivo=String(motivo).trim();
if(!motivo){alert("Informe o motivo da rejei\u00E7\u00E3o.");return;}
rpc("admin_rejeitar_verificacao",{p_verificacao_id:id,p_motivo:motivo}).then(function(){
alert("Verifica\u00E7\u00E3o rejeitada.");
return window.carregarVerificacoesAdminSupabaseEM();
}).catch(function(e){alert("Erro ao rejeitar: "+e.message);});
};
var oldIr=window.irPara;
window.irPara=function(page){
var r=oldIr.apply(this,arguments);
if(String(page)==="admin" &amp;&amp; tok()){
setTimeout(window.carregarVerificacoesAdminSupabaseEM,120);
}
return r;
};
})();
//
;
//
(function(){
function acharCampoAdmin(tipo){
var sels = tipo==="email" ? [
"#adminEmail","#loginAdminEmail","#emailAdmin",
"#adminUsuario","#loginAdminUsuario","#usuarioAdmin",
"input[name='adminEmail']","input[name='adminUsuario']"
] : [
"#adminSenha","#loginAdminSenha","#senhaAdmin",
"input[name='adminSenha']","input[type='password']"
];
for(var i=0;i&lt;sels.length;i++){
var e=document.querySelector(sels[i]);
if(e) return e;
}
var painel=document.getElementById("pagina-login-admin")||
document.getElementById("login-admin")||
document.querySelector("[data-pagina='login-admin']")||
document.querySelector(".login-admin");
if(painel){
return tipo==="email"
? painel.querySelector("input[type='email'],input[type='text']")
: painel.querySelector("input[type='password']");
}
return null;
}
function autenticarAdminFinalEM(ev){
if(ev){
ev.preventDefault();
ev.stopPropagation();
if(ev.stopImmediatePropagation) ev.stopImmediatePropagation();
}
var senhaEl=acharCampoAdmin("senha");
var email="admin@empregamais.com.br";
var senha=senhaEl?String(senhaEl.value||""):"";
if(!senha){
alert("Informe a senha do administrador.");
return false;
}
fetch("https://mkezlcewyengejdmtppl.supabase.co/auth/v1/token?grant_type=password",{
method:"POST",
headers:{
"apikey":"sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR",
"Content-Type":"application/json"
},
body:JSON.stringify({email:email,password:senha})
})
.then(async function(r){
var txt=await r.text(), d={};
try{d=txt?JSON.parse(txt):{};}catch(e){d={message:txt};}
if(!r.ok) throw new Error(d.msg||d.message||d.error_description||"Credenciais inv\u00E1lidas.");
if(!d.access_token) throw new Error("O Supabase n\u00E3o criou a sess\u00E3o administrativa.");
localStorage.setItem("empregaMaisAdminSupabaseToken",d.access_token);
if(d.refresh_token)localStorage.setItem("empregaMaisAdminSupabaseRefreshToken",d.refresh_token);
return fetch("https://mkezlcewyengejdmtppl.supabase.co/rest/v1/rpc/admin_listar_verificacoes",{
method:"POST",
headers:{
"apikey":"sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR",
"Authorization":"Bearer "+d.access_token,
"Content-Type":"application/json"
},
body:"{}"
});
})
.then(async function(r){
var txt=await r.text(), d=null;
try{d=txt?JSON.parse(txt):null;}catch(e){d=txt;}
if(!r.ok) throw new Error((d&amp;&amp;d.message)||String(d||"Usu\u00E1rio sem permiss\u00E3o administrativa."));
localStorage.setItem("empregaMaisPapel","admin"); sessionStorage.setItem("empregaMaisPapel","admin");
if(typeof irPara==="function") irPara("admin");
setTimeout(function(){
if(typeof carregarVerificacoesAdminSupabaseEM==="function"){
carregarVerificacoesAdminSupabaseEM();
}
},150);
})
.catch(function(e){
localStorage.removeItem("empregaMaisAdminSupabaseToken");
console.error("EmpregaMais / Admin Supabase:",e);
alert("N\u00E3o foi poss\u00EDvel entrar no Admin: "+e.message);
});
return false;
}
window.loginAdminSupabaseEM=autenticarAdminFinalEM;
document.addEventListener("submit",function(ev){
var f=ev.target;
if(!f) return;
var txt=((f.id||"")+" "+(f.className||"")+" "+(f.getAttribute("action")||"")).toLowerCase();
var dentroAdmin=!!f.closest("#pagina-login-admin,#login-admin,.login-admin,[data-pagina='login-admin']");
if(txt.indexOf("admin")&gt;=0 || dentroAdmin){
autenticarAdminFinalEM(ev);
}
},true);
document.addEventListener("click",function(ev){
var b=ev.target &amp;&amp; ev.target.closest ? ev.target.closest("button,input[type='submit'],a") : null;
if(!b) return;
var txt=((b.id||"")+" "+(b.className||"")+" "+(b.getAttribute("onclick")||"")+" "+(b.textContent||"")).toLowerCase();
var dentroAdmin=!!b.closest("#pagina-login-admin,#login-admin,.login-admin,[data-pagina='login-admin']");
if((dentroAdmin &amp;&amp; (txt.indexOf("entr")&gt;=0 || txt.indexOf("login")&gt;=0)) ||
txt.indexOf("loginadmin")&gt;=0 || txt.indexOf("entraradmin")&gt;=0){
autenticarAdminFinalEM(ev);
}
},true);
})();
//
