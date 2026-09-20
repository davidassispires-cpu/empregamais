/* EmpregaMais - JavaScript externo - lote 4 */

//
(function(){
var U="https://mkezlcewyengejdmtppl.supabase.co";
var K="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
var TK="empregaMaisAdminSupabaseToken";
var cache=[];
function $id(x){return document.getElementById(x);}
function token(){try{return localStorage.getItem(TK)||"";}catch(e){return "";}}
function esc(v){return String(v==null?"":v).replace(/[&amp;<>"']/g,function(c){
return {"&amp;":"&amp;amp;","<":"&amp;lt;",">":"&amp;gt;",'"':"&amp;quot;","'":"&amp;#39;"}[c];
});}
function dt(v){if(!v)return "-";try{return new Date(v).toLocaleDateString("pt-BR");}catch(e){return "-";}}
async function rpc(nome,body){
var t=token();
if(!t) throw new Error("Sess\u00E3o administrativa n\u00E3o encontrada.");
var r=await fetch(U+"/rest/v1/rpc/"+nome,{
method:"POST",
headers:{"apikey":K,"Authorization":"Bearer "+t,"Content-Type":"application/json"},
body:JSON.stringify(body||{})
});
var tx=await r.text(),d=null;
try{d=tx?JSON.parse(tx):null;}catch(e){d=tx;}
if(!r.ok) throw new Error((d&&d.message)||String(d||("HTTP "+r.status)));
return d;
}
function montarPlanos(){
var p=$id("adminPlanoEscolhidoEM");
if(!p)return;
p.innerHTML=
"<option value='basico'>B\u00E1sico \u2014 Gratuito</option>"+
"<option value='trimestral'>Trimestral \u2014 R$ 79,90 / 90 dias</option>"+
"<option value='semestral'>Semestral \u2014 R$ 139,90 / 180 dias</option>"+
"<option value='anual'>Anual \u2014 R$ 239,90 / 365 dias</option>";
}
function resumo(){
var sel=$id("adminPlanoEmpresaBuscaEM"), box=$id("adminPlanoResumoEM");
if(!sel||!box)return;
var x=cache.find(function(e){return e.empresa_id===sel.value;});
if(!x){
box.innerHTML="Selecione uma empresa para visualizar o plano atual.";
return;
}
var pid=x.plano_id||x.plano||"basico";
var nomes={basico:"B\u00E1sico",trimestral:"Trimestral",semestral:"Semestral",anual:"Anual"};
box.innerHTML=
"<strong>"+esc(x.nome_fantasia||x.razao_social||x.cnpj)+"</strong>"+
"<br/>Plano atual: <strong>"+esc(x.plano_nome||nomes[pid]||pid)+"</strong>"+
" &amp;nbsp;\u2022&amp;nbsp; Validade: <strong>"+esc(dt(x.plano_valido_ate))+"</strong>"+
(x.plano_sem_cobranca?" &amp;nbsp;\u2022&amp;nbsp; <strong>Libera\u00E7\u00E3o administrativa</strong>":"");
var p=$id("adminPlanoEscolhidoEM");
if(p)p.value=pid;
}
window.preencherEmpresasPlanoAdminEM=async function(){
var sel=$id("adminPlanoEmpresaBuscaEM");
if(!sel)return;
montarPlanos();
sel.innerHTML="<option value=''>Carregando empresas...</option>";
try{
var d=await rpc("admin_listar_empresas",{});
cache=Array.isArray(d)?d:[];
sel.innerHTML="<option value=''>Selecione uma empresa</option>";
cache.forEach(function(x){
var o=document.createElement("option");
o.value=x.empresa_id;
o.textContent=(x.nome_fantasia||x.razao_social||"Empresa")+" \u2014 "+(x.cnpj||"");
sel.appendChild(o);
});
if(!cache.length)sel.innerHTML="<option value=''>Nenhuma empresa cadastrada</option>";
sel.onchange=resumo;
resumo();
}catch(e){
console.error("admin_listar_empresas:",e);
sel.innerHTML="<option value=''>Erro ao carregar empresas</option>";
var box=$id("adminPlanoResumoEM");
if(box)box.textContent="Erro ao consultar Supabase: "+e.message;
}
};
window.liberarPlanoAdminEM=async function(){
var e=$id("adminPlanoEmpresaBuscaEM"),p=$id("adminPlanoEscolhidoEM");
if(!e||!e.value){alert("Selecione uma empresa.");return;}
if(!p||!p.value){alert("Selecione um plano.");return;}
var x=cache.find(function(a){return a.empresa_id===e.value;});
var nome=x?(x.nome_fantasia||x.razao_social||"empresa"):"empresa";
if(!confirm("Liberar o plano selecionado para "+nome+"?"))return;
try{
await rpc("admin_definir_plano_empresa",{p_empresa_id:e.value,p_plano_id:p.value});
alert("Plano liberado com sucesso.");
var id=e.value;
await window.preencherEmpresasPlanoAdminEM();
e=$id("adminPlanoEmpresaBuscaEM"); if(e){e.value=id;resumo();}
}catch(err){alert("Erro ao liberar plano: "+err.message);}
};
window.retornarPlanoBasicoAdminEM=async function(){
var e=$id("adminPlanoEmpresaBuscaEM");
if(!e||!e.value){alert("Selecione uma empresa.");return;}
if(!confirm("Retornar esta empresa ao plano B\u00E1sico?"))return;
try{
await rpc("admin_definir_plano_empresa",{p_empresa_id:e.value,p_plano_id:"basico"});
alert("Empresa retornada ao plano B\u00E1sico.");
var id=e.value;
await window.preencherEmpresasPlanoAdminEM();
e=$id("adminPlanoEmpresaBuscaEM"); if(e){e.value=id;resumo();}
}catch(err){alert("Erro ao retornar ao B\u00E1sico: "+err.message);}
};
function ligar(){
montarPlanos();
var sec=$id("adminLiberarPlanoEM");
if(sec){
sec.querySelectorAll("button").forEach(function(b){
var t=(b.textContent||"").toLowerCase();
if(t.indexOf("liberar plano")>=0){
b.onclick=function(ev){ev.preventDefault();window.liberarPlanoAdminEM();};
}
if(t.indexOf("retornar ao plano b\u00E1sico")>=0||t.indexOf("retornar ao plano basico")>=0){
b.onclick=function(ev){ev.preventDefault();window.retornarPlanoBasicoAdminEM();};
}
});
}
window.preencherEmpresasPlanoAdminEM();
}
var abrir=window.abrirAbaAdminEM;
if(typeof abrir==="function"){
window.abrirAbaAdminEM=function(n,b){
var r=abrir.apply(this,arguments);
if(n==="planos")setTimeout(ligar,100);
return r;
};
}
document.addEventListener("DOMContentLoaded",function(){setTimeout(ligar,700);});
})();
//
;
//
(function(){
var U="https://mkezlcewyengejdmtppl.supabase.co";
var K="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
var cacheFinal=[];
function E(id){return document.getElementById(id);}
function adminTokenFinal(){
try{
return localStorage.getItem("empregaMaisAdminSupabaseToken")||
sessionStorage.getItem("empregaMaisAdminSupabaseToken")||"";
}catch(e){return "";}
}
async function renovarAdminFinal(){
var rt="";
try{rt=localStorage.getItem("empregaMaisAdminSupabaseRefreshToken")||"";}catch(e){}
if(!rt)return "";
try{
var r=await fetch(U+"/auth/v1/token?grant_type=refresh_token",{
method:"POST",
headers:{"apikey":K,"Content-Type":"application/json"},
body:JSON.stringify({refresh_token:rt})
});
var tx=await r.text(),d={};
try{d=tx?JSON.parse(tx):{};}catch(e){d={};}
if(!r.ok||!d.access_token)return "";
localStorage.setItem("empregaMaisAdminSupabaseToken",d.access_token);
if(d.refresh_token)localStorage.setItem("empregaMaisAdminSupabaseRefreshToken",d.refresh_token);
localStorage.setItem("empregaMaisPapel","admin");
sessionStorage.setItem("empregaMaisPapel","admin");
return d.access_token;
}catch(e){return "";}
}
function esc(v){return String(v==null?"":v).replace(/[&amp;<>"']/g,function(c){
return {"&amp;":"&amp;amp;","<":"&amp;lt;",">":"&amp;gt;",'"':"&amp;quot;","'":"&amp;#39;"}[c];
});}
function dataBR(v){if(!v)return "\u2014";try{return new Date(v).toLocaleDateString("pt-BR");}catch(e){return "\u2014";}}
async function rpcFinal(nome,body){
var tk=adminTokenFinal();
if(!tk)tk=await renovarAdminFinal();
if(!tk) throw new Error("Sess\u00E3o administrativa expirada. Entre novamente no Admin.");
async function chamar(token){
return fetch(U+"/rest/v1/rpc/"+nome,{
method:"POST",
headers:{
"apikey":K,
"Authorization":"Bearer "+token,
"Content-Type":"application/json"
},
body:JSON.stringify(body||{})
});
}
var r=await chamar(tk);
if(r.status===401||r.status===403){
var novo=await renovarAdminFinal();
if(novo)r=await chamar(novo);
}
var tx=await r.text(), d=null;
try{d=tx?JSON.parse(tx):null;}catch(e){d=tx;}
if(!r.ok) throw new Error((d&&d.message)||String(d||("HTTP "+r.status)));
return d;
}
function montarOpcoesPlanosFinal(){
var p=E("adminPlanoEscolhidoEM");
if(!p)return;
var atual=p.value||"basico";
p.innerHTML=
"<option value='basico'>B\u00E1sico \u2014 Gratuito</option>"+
"<option value='trimestral'>Trimestral \u2014 R$ 79,90 / 90 dias</option>"+
"<option value='semestral'>Semestral \u2014 R$ 139,90 / 180 dias</option>"+
"<option value='anual'>Anual \u2014 R$ 239,90 / 365 dias</option>";
if(["basico","trimestral","semestral","anual"].indexOf(atual)>=0)p.value=atual;
}
window.resumoPlanoAdminSupabaseFinalEM=function(){
var sel=E("adminPlanoEmpresaBuscaEM"), box=E("adminPlanoResumoEM");
if(!sel||!box)return;
var x=cacheFinal.find(function(a){return String(a.empresa_id)===String(sel.value);});
if(!x){
box.innerHTML="Selecione uma empresa para visualizar o plano atual.";
return;
}
var pid=x.plano_id||x.plano||"basico";
var nomes={basico:"B\u00E1sico",trimestral:"Trimestral",semestral:"Semestral",anual:"Anual"};
box.innerHTML=
"<strong>"+esc(x.nome_fantasia||x.razao_social||x.cnpj)+"</strong>"+
" &amp;nbsp; \u2022 &amp;nbsp; Plano atual: <strong>"+esc(x.plano_nome||nomes[pid]||pid)+"</strong>"+
" &amp;nbsp; \u2022 &amp;nbsp; V\u00E1lido at\u00E9: <strong>"+esc(dataBR(x.plano_valido_ate))+"</strong>"+
(x.plano_sem_cobranca?" &amp;nbsp; \u2022 &amp;nbsp; <strong>Libera\u00E7\u00E3o administrativa</strong>":"");
var p=E("adminPlanoEscolhidoEM"); if(p)p.value=pid;
};
var carregando=false, carregado=false;
window.carregarPlanosAdminSupabaseFinalEM=async function(forcar){
var sel=E("adminPlanoEmpresaBuscaEM"), box=E("adminPlanoResumoEM");
if(!sel)return;
if(carregando)return;
if(carregado&&!forcar)return;
carregando=true;
montarOpcoesPlanosFinal();
sel.innerHTML="<option value=''>Consultando empresas no Supabase...</option>";
if(box)box.textContent="Consultando empresas cadastradas...";
try{
var lista=await rpcFinal("admin_listar_empresas",{});
cacheFinal=Array.isArray(lista)?lista:[];
sel.innerHTML="<option value=''>Selecione uma empresa</option>";
cacheFinal.forEach(function(x){
var o=document.createElement("option");
o.value=x.empresa_id;
o.textContent=(x.nome_fantasia||x.razao_social||"Empresa")+" \u2014 "+(x.cnpj||"");
sel.appendChild(o);
});
if(!cacheFinal.length){
sel.innerHTML="<option value=''>Nenhuma empresa retornada pelo Supabase</option>";
if(box)box.textContent="A consulta funcionou, mas n\u00E3o retornou empresas.";
}else{
if(box)box.textContent=cacheFinal.length+" empresa(s) carregada(s). Selecione uma empresa.";
}
carregado=true;
}catch(err){
console.error("PLANOS ADMIN FINAL:",err);
sel.innerHTML="<option value=''>ERRO \u2014 clique para tentar novamente</option>";
if(box)box.innerHTML="<strong>Erro ao buscar empresas:</strong> "+esc(err.message);
carregado=false;
}finally{carregando=false;}
};
window.liberarPlanoAdminSupabaseFinalEM=async function(planoForcado){
var sel=E("adminPlanoEmpresaBuscaEM"), p=E("adminPlanoEscolhidoEM");
if(!sel||!sel.value){alert("Selecione uma empresa.");return;}
var plano=planoForcado||((p&&p.value)||"basico");
var x=cacheFinal.find(function(a){return String(a.empresa_id)===String(sel.value);});
var nome=x?(x.nome_fantasia||x.razao_social||"empresa"):"empresa";
if(!confirm((plano==="basico"?"Retornar ":"Liberar plano ")+
({basico:"B\u00E1sico",trimestral:"Trimestral",semestral:"Semestral",anual:"Anual"}[plano]||plano)+
" para "+nome+"?"))return;
try{
await rpcFinal("admin_definir_plano_empresa",{p_empresa_id:sel.value,p_plano_id:plano});
alert(plano==="basico"?"Empresa retornada ao plano B\u00E1sico.":"Plano liberado com sucesso.");
var id=sel.value; carregado=false;
await window.carregarPlanosAdminSupabaseFinalEM(true);
sel=E("adminPlanoEmpresaBuscaEM");
if(sel){sel.value=id;window.resumoPlanoAdminSupabaseFinalEM();}
}catch(err){alert("Erro ao alterar plano: "+err.message);}
};
function bindFinal(){
var sec=E("adminLiberarPlanoEM"), sel=E("adminPlanoEmpresaBuscaEM");
if(!sec||!sel)return false;
montarOpcoesPlanosFinal();
sel.onfocus=function(){window.carregarPlanosAdminSupabaseFinalEM(false);};
sel.onclick=function(){window.carregarPlanosAdminSupabaseFinalEM(false);};
sel.onchange=window.resumoPlanoAdminSupabaseFinalEM;
sec.querySelectorAll("button").forEach(function(b){
var t=(b.textContent||"").toLowerCase();
if(t.indexOf("liberar plano")>=0){
b.onclick=function(ev){ev.preventDefault();window.liberarPlanoAdminSupabaseFinalEM();};
}
if(t.indexOf("retornar ao plano b\u00E1sico")>=0||t.indexOf("retornar ao plano basico")>=0){
b.onclick=function(ev){ev.preventDefault();window.liberarPlanoAdminSupabaseFinalEM("basico");};
}
});
window.carregarPlanosAdminSupabaseFinalEM(false);
return true;
}
var tentativas=0;
var timer=setInterval(function(){
tentativas++;
if(bindFinal()||tentativas>40)clearInterval(timer);
},250);
document.addEventListener("click",function(ev){
var tab=ev.target&&ev.target.closest?ev.target.closest("[data-admin-tab-em='planos']"):null;
if(tab)setTimeout(function(){bindFinal();window.carregarPlanosAdminSupabaseFinalEM(true);},120);
},true);
})();
//
;
//
(function(){
var U="https://mkezlcewyengejdmtppl.supabase.co";
var K="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
var TK="empregaMaisAdminSupabaseToken";
var assinantesCacheEM=[];
var empresasCacheEM=[];
function token(){
try{return localStorage.getItem(TK)||sessionStorage.getItem(TK)||"";}catch(e){return "";}
}
async function rpc(nome,body){
var t=token();
if(!t)throw new Error("Sess\u00E3o administrativa n\u00E3o encontrada.");
var r=await fetch(U+"/rest/v1/rpc/"+nome,{
method:"POST",
headers:{"apikey":K,"Authorization":"Bearer "+t,"Content-Type":"application/json"},
body:JSON.stringify(body||{})
});
var tx=await r.text(),d=null;
try{d=tx?JSON.parse(tx):null;}catch(e){d=tx;}
if(!r.ok)throw new Error((d&&d.message)||String(d||("HTTP "+r.status)));
return d;
}
function esc(v){return String(v==null?"":v).replace(/[&amp;<>"']/g,function(c){
return {"&amp;":"&amp;amp;","<":"&amp;lt;",">":"&amp;gt;",'"':"&amp;quot;","'":"&amp;#39;"}[c];
});}
function brl(v){return Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});}
function dataBR(v){
if(!v)return "\u2014"; var d=new Date(v); return isNaN(d.getTime())?"\u2014":d.toLocaleDateString("pt-BR");
}
function nums(v){return String(v||"").replace(/\D/g,"");}
function norm(v){return String(v||"").trim().toLowerCase();}
function bool(v){return v===true||String(v).toLowerCase()==="true"||String(v)==="1";}
function parseDataVaga(v){
var x=v.dataPublicacao||v.publicadoEm||v.publicadaEm||v.criadoEm||v.criado_em||v.data||"";
if(!x)return null;
if(x instanceof Date)return x;
var t=String(x).trim(),m;
if((m=t.match(/^(\d{2})\/(\d{2})\/(\d{4})/))) return new Date(+m[3],+m[2]-1,+m[1]);
if((m=t.match(/^(\d{4})-(\d{2})-(\d{2})/))) return new Date(+m[1],+m[2]-1,+m[3]);
var d=new Date(t); return isNaN(d.getTime())?null:d;
}
function vagaDaEmpresa(v,a){
var vc=nums(v.empresaCnpj||v.cnpj||v.cnpjEmpresa);
var ac=nums(a.cnpj);
if(vc&&ac)return vc===ac;
var vn=norm(v.empresa||v.empresaNome||v.nomeEmpresa);
var an=norm(a.nome_fantasia||a.razao_social);
return !!(vn&&an&&vn===an);
}
function statsVagas(vagas,a){
var hoje=new Date(),mes=hoje.getMonth(),ano=hoje.getFullYear(),qtd=0,destaques=0;
vagas.forEach(function(v){
if(!vagaDaEmpresa(v,a))return;
var d=parseDataVaga(v);
if(d&&d.getMonth()===mes&&d.getFullYear()===ano)qtd++;
var ativa=norm(v.status||"ativa")!=="encerrada"&&norm(v.status)!=="excluida";
if(ativa&&bool(v.destaque))destaques++;
});
return {mes:qtd,destaques:destaques};
}
async function carregarVagas(){
try{
if(typeof apiEmpregaMaisGet==="function"){
var r=await apiEmpregaMaisGet("listar");
if(r&&r.sucesso===true&&Array.isArray(r.vagas))return r.vagas;
}
}catch(e){console.warn("Assinantes / vagas remotas:",e);}
try{return typeof carregarVagasPortal==="function"?(carregarVagasPortal()||[]):[];}catch(e){return [];}
}
async function carregarEmpresasForm(){
try{
var d=await rpc("admin_listar_empresas",{});
empresasCacheEM=Array.isArray(d)?d:[];
var sel=document.getElementById("adminAssinaturaEmpresaEM");
if(!sel)return;
sel.innerHTML="<option value=''>Selecione uma empresa</option>";
empresasCacheEM.forEach(function(x){
var o=document.createElement("option");
o.value=x.empresa_id;
o.textContent=(x.nome_fantasia||x.razao_social||"Empresa")+" \u2014 "+(x.cnpj||"");
sel.appendChild(o);
});
}catch(e){console.error(e);}
}
function atualizarValorPadrao(){
var p=document.getElementById("adminAssinaturaPlanoEM");
var v=document.getElementById("adminAssinaturaValorEM");
if(!p||!v)return;
v.value={trimestral:"79,90",semestral:"139,90",anual:"239,90"}[p.value]||"";
}
window.carregarAssinantesAdminEM=async function(forcar){
var lista=document.getElementById("adminAssinantesListaEM");
var status=document.getElementById("adminAssinantesStatusEM");
if(!lista)return;
status.textContent="Atualizando dados...";
try{
var respostas=await Promise.all([rpc("admin_listar_assinantes",{}),carregarVagas(),carregarEmpresasForm()]);
assinantesCacheEM=Array.isArray(respostas[0])?respostas[0]:[];
var vagas=Array.isArray(respostas[1])?respostas[1]:[];
var receita=0,vencendo=0,totalVagasMes=0;
assinantesCacheEM.forEach(function(a){
if(a.origem==="pagamento")receita+=Number(a.valor_pago||0);
if(Number(a.dias_restantes)>=0&&Number(a.dias_restantes)<=30)vencendo++;
totalVagasMes+=statsVagas(vagas,a).mes;
});
var set=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v;};
set("admAssinantesAtivosEM",assinantesCacheEM.length);
set("admReceitaAssinantesEM",brl(receita));
set("admAssinantesVencendoEM",vencendo);
set("admVagasMesAssinantesEM",totalVagasMes);
if(!assinantesCacheEM.length){
lista.innerHTML="<div class='admin-assinantes-vazio-em'>Nenhuma assinatura ativa registrada ainda.</div>";
status.textContent="Consulta conclu\u00EDda. N\u00E3o h\u00E1 assinaturas ativas cadastradas.";
return;
}
lista.innerHTML=assinantesCacheEM.map(function(a){
var st=statsVagas(vagas,a);
var nome=a.nome_fantasia||a.razao_social||"Empresa";
var plano={trimestral:"Trimestral",semestral:"Semestral",anual:"Anual"}[a.plano_id]||a.plano_id||"\u2014";
var cortesia=a.origem==="cortesia_admin";
return "<article class='admin-assinante-card-em'>"+
"<div class='admin-assinante-cab-em'><div><h4>"+esc(nome)+"</h4><p>CNPJ "+esc(a.cnpj||"\u2014")+"</p></div>"+
"<span class='admin-assinante-selo-em"+(cortesia?" cortesia":"")+"'>"+(cortesia?"Cortesia":"Pago")+"</span></div>"+
"<div class='admin-assinante-dados-em'>"+
"<div class='admin-assinante-dado-em'><small>Plano</small><strong>"+esc(plano)+"</strong></div>"+
"<div class='admin-assinante-dado-em'><small>Valor pago</small><strong>"+brl(a.valor_pago)+"</strong></div>"+
"<div class='admin-assinante-dado-em'><small>Encerramento</small><strong>"+dataBR(a.termina_em)+"<br/>"+Number(a.dias_restantes||0)+" dia(s)</strong></div>"+
"<div class='admin-assinante-dado-em'><small>Vagas neste m\u00EAs</small><strong>"+st.mes+"</strong></div>"+
"<div class='admin-assinante-dado-em'><small>Em destaque</small><strong>"+st.destaques+"</strong></div>"+
"</div></article>";
}).join("");
status.textContent=assinantesCacheEM.length+" assinatura(s) ativa(s) carregada(s).";
}catch(e){
console.error("Admin assinantes:",e);
status.textContent="Erro ao consultar assinaturas: "+e.message;
lista.innerHTML="<div class='admin-assinantes-vazio-em'>N\u00E3o foi poss\u00EDvel carregar os assinantes.</div>";
}
};
window.registrarAssinaturaPagaAdminEM=async function(){
var empresa=document.getElementById("adminAssinaturaEmpresaEM");
var plano=document.getElementById("adminAssinaturaPlanoEM");
var valor=document.getElementById("adminAssinaturaValorEM");
var pg=document.getElementById("adminAssinaturaPagamentoEM");
if(!empresa||!empresa.value){alert("Selecione a empresa.");return;}
var n=Number(String(valor.value||"").replace(/\./g,"").replace(",","."));
if(!isFinite(n)||n<0){alert("Informe um valor pago v\u00E1lido.");return;}
var x=empresasCacheEM.find(function(a){return String(a.empresa_id)===String(empresa.value);});
var nome=x?(x.nome_fantasia||x.razao_social||"empresa"):"empresa";
if(!confirm("Registrar assinatura "+plano.options[plano.selectedIndex].text+" para "+nome+"?"))return;
try{
await rpc("admin_registrar_assinatura",{
p_empresa_id:empresa.value,
p_plano_id:plano.value,
p_valor_pago:n,
p_forma_pagamento:pg?pg.value:null
});
alert("Assinatura paga registrada com sucesso.");
await window.carregarAssinantesAdminEM(true);
}catch(e){alert("Erro ao registrar assinatura: "+e.message);}
};
function ligar(){
var p=document.getElementById("adminAssinaturaPlanoEM");
if(p&&!p.dataset.ligado){p.dataset.ligado="1";p.onchange=atualizarValorPadrao;}
}
document.addEventListener("DOMContentLoaded",function(){setTimeout(ligar,350);});
window.addEventListener("load",function(){setTimeout(ligar,600);});
var abrir=window.abrirAbaAdminEM;
if(typeof abrir==="function"){
window.abrirAbaAdminEM=function(nome,botao){
var r=abrir.apply(this,arguments);
if(nome==="assinantes"){
setTimeout(function(){ligar();window.carregarAssinantesAdminEM(false);},80);
}
return r;
};
}
})();
//
;
//
(function(){
var U="https://mkezlcewyengejdmtppl.supabase.co",K="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR",TK="empregaMaisAdminSupabaseToken",CE=[],CA=[],CV=[];
function tk(){try{return localStorage.getItem(TK)||sessionStorage.getItem(TK)||"";}catch(x){return"";}}
async function rpc(n,b){var t=tk();if(!t)throw Error("Sess\u00E3o administrativa n\u00E3o encontrada.");var r=await fetch(U+"/rest/v1/rpc/"+n,{method:"POST",headers:{"apikey":K,"Authorization":"Bearer "+t,"Content-Type":"application/json"},body:JSON.stringify(b||{})}),z=await r.text(),d;try{d=z?JSON.parse(z):null;}catch(x){d=z;}if(!r.ok)throw Error((d&&d.message)||String(d||r.status));return d;}
function e(v){return String(v==null?"":v).replace(/[&amp;<>"']/g,function(c){return{"&amp;":"&amp;amp;","<":"&amp;lt;",">":"&amp;gt;",'"':"&amp;quot;","'":"&amp;#39;"}[c];});}
function dg(v){return String(v||"").replace(/\D/g,"");}function nm(v){return String(v||"").trim().toLowerCase();}function bv(v){return v===true||String(v).toLowerCase()==="true"||String(v)==="1";}
function nome(x){return x.nome_fantasia||x.razao_social||x.nome||"Empresa";}function ini(x){var a=nome(x).split(/\s+/);return((a[0]||"E")[0]+(a[1]||"")[0]).toUpperCase();}
function lg(x,c){return x.logo_url?"<div class='"+c+"'><img alt='' src='"+e(x.logo_url)+"'/></div>":"<div class='"+c+"'>"+e(ini(x))+"</div>";}
function brl(v){return Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});}function dt(v){if(!v)return"\u2014";var d=new Date(v);return isNaN(d.getTime())?"\u2014":d.toLocaleDateString("pt-BR");}
function pn(x){return x.plano_nome||({basico:"B\u00E1sico",trimestral:"Trimestral",semestral:"Semestral",anual:"Anual"}[x.plano_id||x.plano]||x.plano_id||x.plano||"B\u00E1sico");}
function ass(x){return CA.find(function(a){return String(a.empresa_id)===String(x.empresa_id);})||null;}
function ve(v,x){var a=dg(v.empresaCnpj||v.cnpj||v.cnpjEmpresa),b=dg(x.cnpj);if(a&&b)return a===b;return nm(v.empresa||v.empresaNome||v.nomeEmpresa)===nm(nome(x));}
function pd(v){var x=v.dataPublicacao||v.publicadoEm||v.publicadaEm||v.criadoEm||v.criado_em||v.data||"",m;if(!x)return null;x=String(x).trim();if((m=x.match(/^(\d{2})\/(\d{2})\/(\d{4})/)))return new Date(+m[3],+m[2]-1,+m[1]);if((m=x.match(/^(\d{4})-(\d{2})-(\d{2})/)))return new Date(+m[1],+m[2]-1,+m[3]);var d=new Date(x);return isNaN(d.getTime())?null:d;}
function st(x){var vs=CV.filter(function(v){return ve(v,x);}),h=new Date(),mes=0,dest=0,at=0,an=0;vs.forEach(function(v){var d=pd(v),q=nm(v.status||"");if(d&&d.getMonth()===h.getMonth()&&d.getFullYear()===h.getFullYear())mes++;if(bv(v.destaque))dest++;if(q.indexOf("pend")>=0||q.indexOf("an")===0)an++;if(q==="ativa"||q==="aprovada"||q==="publicada"||!q)at++;});
var cs=[];try{cs=typeof carregarCandidaturas==="function"?(carregarCandidaturas()||[]):JSON.parse(localStorage.getItem("candidaturasEmpregaMais")||"[]");}catch(z){cs=[];}
var ids=vs.map(function(v){return String(v.id||v.vagaId||"");});
var ce=cs.filter(function(c){return ids.indexOf(String(c.vagaId||c.idVaga||""))>=0;});
var aprov=ce.filter(function(c){return nm(c.status)==="aprovado";}).length;
function etapaCandAdminEM(c){
 var s=nm(c.status_processo||c.statusProcesso||c.etapa||c.status);
 if(window.EmpregaMaisEtapasCandidatoEM&&typeof window.EmpregaMaisEtapasCandidatoEM.normalizar==="function")return window.EmpregaMaisEtapasCandidatoEM.normalizar(s);
 if(s==="contratada")return"contratado";if(s==="selecionada")return"selecionado";if(s==="em entrevista")return"entrevista";if(s==="aprovada")return"aprovado";
 return s;
}
var contrat=ce.filter(function(c){return etapaCandAdminEM(c)==="contratado"||c.contratadoPeloEmpregaMais===true||c.contratado_pelo_empregamais===true;}).length;
var entrev=ce.filter(function(c){return etapaCandAdminEM(c)==="entrevista";}).length;
var selec=ce.filter(function(c){return etapaCandAdminEM(c)==="selecionado";}).length;
return{vs:vs,mes:mes,dest:dest,at:at,an:an,cands:ce.length,entrev:entrev,selec:selec,aprov:aprov,contrat:contrat,candidaturas:ce};}
async function vagas(){try{if(typeof apiEmpregaMaisGet==="function"){var r=await apiEmpregaMaisGet("listar");if(r&&r.sucesso===true&&Array.isArray(r.vagas))return r.vagas;}}catch(x){}try{return typeof carregarVagasPortal==="function"?(carregarVagasPortal()||[]):[];}catch(x){return[];}}
function inf(k,v){return"<div class='admin-empresa-info-item-em'><small>"+e(k)+"</small><strong>"+e(v||"\u2014")+"</strong></div>";}
window.carregarEmpresasMasterEM=async function(){var l=document.getElementById("adminEmpresasMasterListaEM"),q=document.getElementById("adminEmpresasMasterStatusEM");if(!l)return;try{var r=await Promise.all([rpc("admin_listar_empresas",{}),rpc("admin_listar_assinantes",{}),vagas()]);CE=Array.isArray(r[0])?r[0]:[];CA=Array.isArray(r[1])?r[1]:[];CV=Array.isArray(r[2])?r[2]:[];renderEmpresasMasterEM(CE);q.textContent=CE.length+" empresa(s) cadastrada(s). Clique para abrir o painel individual.";}catch(x){q.textContent="Erro: "+x.message;}};
window.renderEmpresasMasterEM=function(a){var l=document.getElementById("adminEmpresasMasterListaEM");if(!l)return;l.innerHTML=a.length?a.map(function(x){var A=ass(x),S=st(x),V=x.verificada===true||x.verificacao_status==="verificada";return"<article class='admin-empresa-master-card-em' onclick='abrirFichaEmpresaAdminEM(\""+e(x.empresa_id)+"\")'><div class='admin-empresa-master-cab-em'>"+lg(x,"admin-empresa-master-logo-em")+"<div><h3>"+e(nome(x))+"</h3><div class='cnpj'>"+e(x.cnpj||"CNPJ n\u00E3o informado")+"</div></div></div><div class='admin-empresa-master-tags-em'><span class='admin-empresa-master-tag-em "+(V?"ok":"")+"'>"+(V?"Verificada":"N\u00E3o verificada")+"</span><span class='admin-empresa-master-tag-em plano'>"+e(pn(x))+"</span>"+(A?"<span class='admin-empresa-master-tag-em'>"+(A.origem==="pagamento"?"Assinante":"Cortesia")+"</span>":"")+"</div><div class='admin-empresa-master-rodape-em'><span>Vagas no m\u00EAs<br/><strong>"+S.mes+"</strong></span><span>Destaques<br/><strong>"+S.dest+"</strong></span><span>Ativas<br/><strong>"+S.at+"</strong></span><span>Contratados<br/><strong>"+S.contrat+"</strong></span></div></article>";}).join(""):"<div class='vazio'>Nenhuma empresa encontrada.</div>";};
window.filtrarEmpresasMasterEM=function(){var q=nm((document.getElementById("adminBuscaEmpresasMasterEM")||{}).value);renderEmpresasMasterEM(CE.filter(function(x){return nm(nome(x)).indexOf(q)>=0||dg(x.cnpj).indexOf(dg(q))>=0;}));};
window.abrirFichaEmpresaAdminEM=function(id){var x=CE.find(function(y){return String(y.empresa_id)===String(id);});if(!x)return;var A=ass(x),S=st(x),V=x.verificada===true||x.verificacao_status==="verificada",m=document.getElementById("adminEmpresasMasterEM"),f=document.getElementById("adminEmpresaFichaEM"),c=document.getElementById("adminEmpresaFichaConteudoEM");m.classList.add("oculto");f.classList.remove("oculto");var vh=S.vs.slice(0,20).map(function(v){return"<div class='admin-empresa-vaga-linha-em'><div><strong>"+e(v.cargo||v.titulo||"Vaga")+"</strong><br/><span>"+e(v.cidade||"")+" "+e(v.uf||"")+"</span></div><span>"+e(v.status||"\u2014")+(bv(v.destaque)?" \u00B7 Destaque":"")+"</span></div>";}).join("")||"<div class='vazio'>Nenhuma vaga localizada.</div>";c.innerHTML="<div class='admin-empresa-ficha-cab-em'><div class='admin-empresa-ficha-identidade-em'>"+lg(x,"admin-empresa-ficha-logo-em")+"<div><span class='admin-eyebrow-em'>PAINEL INDIVIDUAL DA EMPRESA</span><h2>"+e(nome(x))+"</h2><p>CNPJ "+e(x.cnpj||"\u2014")+"</p></div></div><div class='admin-empresa-ficha-status-em'><span class='admin-empresa-master-tag-em "+(V?"ok":"")+"'>"+(V?"Verificada":"N\u00E3o verificada")+"</span><span class='admin-empresa-master-tag-em plano'>"+e(pn(x))+"</span></div></div><div class='admin-empresa-ficha-grid-em'><div class='admin-empresa-ficha-metrica-em'><span>Vagas neste m\u00EAs</span><strong>"+S.mes+"</strong></div><div class='admin-empresa-ficha-metrica-em'><span>Candidaturas</span><strong>"+S.cands+"</strong></div><div class='admin-empresa-ficha-metrica-em'><span>Entrevistas</span><strong>"+S.entrev+"</strong></div><div class='admin-empresa-ficha-metrica-em'><span>Selecionados</span><strong>"+S.selec+"</strong></div><div class='admin-empresa-ficha-metrica-em'><span>Aprovados</span><strong>"+S.aprov+"</strong></div><div class='admin-empresa-ficha-metrica-em admin-metrica-contratados-em'><span>Contratados pelo portal</span><strong>"+S.contrat+"</strong></div></div><div class='admin-empresa-ficha-secoes-em'><section class='admin-empresa-ficha-bloco-em'><h3>Cadastro da empresa</h3><div class='admin-empresa-info-grid-em'>"+inf("Raz\u00E3o social",x.razao_social)+inf("Nome fantasia",x.nome_fantasia)+inf("CNPJ",x.cnpj)+inf("E-mail",x.email_corporativo||x.email)+inf("Site",x.site)+inf("Matriz",x.matriz)+inf("Setor",x.setor)+inf("Funcion\u00E1rios",x.funcionarios)+"</div></section><section class='admin-empresa-ficha-bloco-em'><h3>Assinatura e plano</h3><div class='admin-empresa-info-grid-em'>"+inf("Plano atual",pn(x))+inf("Tipo",A?(A.origem==="pagamento"?"Assinatura paga":"Cortesia administrativa"):"Sem assinatura registrada")+inf("Valor pago",A?brl(A.valor_pago):"R$ 0,00")+inf("In\u00EDcio",A?dt(A.inicio_em):dt(x.plano_inicio))+inf("Vencimento",A?dt(A.termina_em):dt(x.plano_valido_ate))+inf("Tempo restante",A?(Number(A.dias_restantes||0)+" dia(s)"):"\u2014")+inf("Pagamento",A?(A.forma_pagamento||"\u2014"):"\u2014")+"</div></section><section class='admin-empresa-ficha-bloco-em'><h3>Verifica\u00E7\u00E3o</h3><div class='admin-empresa-info-grid-em'>"+inf("Status",x.verificacao_status||"n\u00E3o verificada")+inf("Resultado",V?"Verificada":"Pendente / n\u00E3o verificada")+"</div></section><section class='admin-empresa-ficha-bloco-em'><h3>Atividade</h3><div class='admin-empresa-info-grid-em'>"+inf("Vagas cadastradas",S.vs.length)+inf("Publicadas no m\u00EAs",S.mes)+inf("Ativas",S.at)+inf("Em destaque",S.dest)+inf("Candidaturas recebidas",S.cands)+inf("Entrevistas",S.entrev)+inf("Selecionados",S.selec)+inf("Aprovados",S.aprov)+inf("Contratados pelo portal",S.contrat)+"</div></section><section class='admin-empresa-ficha-bloco-em admin-empresa-ficha-vagas-em'><h3>Vagas da empresa</h3>"+vh+"</section></div>";window.scrollTo({top:0,behavior:"smooth"});};
window.fecharFichaEmpresaAdminEM=function(){var m=document.getElementById("adminEmpresasMasterEM"),f=document.getElementById("adminEmpresaFichaEM");if(m)m.classList.remove("oculto");if(f)f.classList.add("oculto");};
var aa=window.abrirAbaAdminEM;if(typeof aa==="function"){window.abrirAbaAdminEM=function(a,b){var r=aa.apply(this,arguments);if(a==="empresas")setTimeout(function(){fecharFichaEmpresaAdminEM();carregarEmpresasMasterEM();},100);return r;};}
document.addEventListener("DOMContentLoaded",function(){setTimeout(function(){var p=document.getElementById("pagina-painel-admin");if(p&&p.classList.contains("ativa")){var b=document.querySelector("#adminTabsPrincipaisEM [data-admin-tab-em='empresas']");if(b)abrirAbaAdminEM("empresas",b);}},700);});
})();
//
;
//
(function(){
var U="https://mkezlcewyengejdmtppl.supabase.co";
var K="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
var cache={};
function dig(v){return String(v||"").replace(/\D/g,"");}
function norm(v){return String(v||"").trim().toLowerCase();}
function esc(v){return String(v==null?"":v).replace(/[&amp;<>"']/g,function(c){return{"&amp;":"&amp;amp;","<":"&amp;lt;",">":"&amp;gt;",'"':"&amp;quot;","'":"&amp;#39;"}[c];});}
function vagaAtual(){
try{
var u=new URL(window.location.href),id=u.searchParams.get("id");
return typeof vagaPorIdEM==="function"?vagaPorIdEM(id):(typeof localizarVaga==="function"?localizarVaga(id):null);
}catch(e){return null;}
}
async function listarEmpresasPublicas(){
if(cache.__lista)return cache.__lista;
var r=await fetch(U+"/rest/v1/empresas?select=id,nome_fantasia,razao_social&amp;verificada=eq.true&amp;plano_id=in.(trimestral,semestral,anual)",{
headers:{"apikey":K}
});
if(!r.ok)return [];
cache.__lista=await r.json();return cache.__lista;
}
async function resolverEmpresaId(vaga){
if(!vaga)return "";
if(vaga.empresa_id||vaga.empresaId)return vaga.empresa_id||vaga.empresaId;
var nome=norm(vaga.empresa||vaga.empresaNome||vaga.nomeEmpresa);
if(!nome)return "";
var ls=await listarEmpresasPublicas();
var x=ls.find(function(a){return norm(a.nome_fantasia)===nome||norm(a.razao_social)===nome;});
return x?x.id:"";
}
async function perfil(id){
if(!id)return null;if(cache[id])return cache[id];
var r=await fetch(U+"/rest/v1/rpc/perfil_publico_empresa",{
method:"POST",headers:{"apikey":K,"Content-Type":"application/json"},body:JSON.stringify({p_empresa_id:id})
});
if(!r.ok)return null;
var d=await r.json();var x=Array.isArray(d)?d[0]:d;
cache[id]=x||null;return cache[id];
}
async function vagasEmpresa(p,vagaRef){
var arr=[];
try{
if(typeof apiEmpregaMaisGet==="function"){
var r=await apiEmpregaMaisGet("listar");
if(r&&r.sucesso===true&&Array.isArray(r.vagas))arr=r.vagas;
}
}catch(e){}
if(!arr.length){try{arr=typeof carregarVagasPortal==="function"?(carregarVagasPortal()||[]):[];}catch(e){}}
var nomes=[norm(p.nome_fantasia),norm(p.razao_social)].filter(Boolean);
return arr.filter(function(v){
var n=norm(v.empresa||v.empresaNome||v.nomeEmpresa);
var ok=nomes.indexOf(n)>=0;
var st=norm(v.status||""),ap=norm(v.aprovacao||"");
return ok && st!=="encerrada" && st!=="excluida" && (ap===""||ap==="aprovada");
});
}
function setTxt(id,v){var el=document.getElementById(id);if(el)el.textContent=v||"N\u00E3o informado";}
async function abrir(id){
var p=await perfil(id);
if(!p)return;
setTxt("empresaPublicaNome",p.nome_fantasia||p.razao_social||"Empresa");
setTxt("empresaPublicaRazaoSocial",p.razao_social||"");
setTxt("empresaPublicaMatriz",p.matriz);
setTxt("empresaPublicaFuncionarios",p.funcionarios);
setTxt("empresaPublicaSetor",p.setor);
setTxt("empresaPublicaSobre",p.sobre_institucional||"Informa\u00E7\u00F5es n\u00E3o fornecidas.");
var fat=document.getElementById("empresaPublicaFaturamento");
if(fat&&fat.parentElement)fat.parentElement.style.display="none";
var logo=document.getElementById("empresaPublicaLogo");
if(logo){if(p.logo_url){logo.src=p.logo_url;logo.style.display="block";}else logo.style.display="none";}
var siteAnt=document.getElementById("empresaPublicaSiteSeguroEM");if(siteAnt)siteAnt.remove();
if(p.site){
var alvo=document.getElementById("empresaPublicaSobre");
if(alvo&&alvo.parentElement){
var a=document.createElement("a");a.id="empresaPublicaSiteSeguroEM";a.className="empresa-publica-site-em";a.target="_blank";a.rel="noopener noreferrer";a.href=p.site;a.textContent="Visitar site oficial";alvo.parentElement.appendChild(a);
}
}
var vs=await vagasEmpresa(p);
setTxt("empresaPublicaTotalVagas",String(vs.length));
var bloco=document.getElementById("empresaPublicaListaVagas");
if(bloco){
bloco.innerHTML="";
vs.forEach(function(v){try{bloco.appendChild(criarCardVaga(v,false));}catch(e){}});
if(!vs.length)bloco.innerHTML="<div class='vazio'>Esta empresa n\u00E3o possui vagas abertas no momento.</div>";
}
if(typeof mostrarPagina==="function")mostrarPagina("empresa-publica");
}
async function conectarDetalhe(){
var nome=document.getElementById("detalheEmpresaCab");if(!nome)return;
var v=vagaAtual();if(!v)return;
var id=await resolverEmpresaId(v);if(!id)return;
var p=await perfil(id);if(!p)return;
nome.onclick=null;nome.classList.remove("empresa-sem-perfil-publico-em");
nome.classList.add("empresa-link-plano-pago-em");nome.title="Ver perfil da empresa";
nome.onclick=function(ev){if(ev){ev.preventDefault();ev.stopPropagation();}abrir(id);};
}
window.abrirPerfilEmpresaSupabaseEM=abrir;
if(typeof abrirVaga==="function"){
var av=abrirVaga;
abrirVaga=function(){var r=av.apply(this,arguments);setTimeout(conectarDetalhe,220);return r;};
}
window.addEventListener("load",function(){setTimeout(conectarDetalhe,700);});
document.addEventListener("click",function(){setTimeout(conectarDetalhe,100);});
})();
//
;
//
(function(){
function esc(v){return String(v==null?"":v).replace(/[&amp;<>"']/g,function(c){return{"&amp;":"&amp;amp;","<":"&amp;lt;",">":"&amp;gt;",'"':"&amp;quot;","'":"&amp;#39;"}[c];});}
function rolar(id){var e=document.getElementById(id);if(e)e.scrollIntoView({behavior:"smooth",block:"start"});}
window.rolarPerfilEmpresaEM=rolar;
function reconstruir(){
var pag=document.getElementById("pagina-empresa-publica");if(!pag)return;
var nome=document.getElementById("empresaPublicaNome");
var sobre=document.getElementById("empresaPublicaSobre");
var matriz=document.getElementById("empresaPublicaMatriz");
var func=document.getElementById("empresaPublicaFuncionarios");
var setor=document.getElementById("empresaPublicaSetor");
var total=document.getElementById("empresaPublicaTotalVagas");
var lista=document.getElementById("empresaPublicaListaVagas");
if(!nome||!sobre||!lista)return;
var topo=pag.querySelector(".empresa-publica-premium-topo-em");
if(topo&&!topo.querySelector(".empresa-publica-nav-em")){
var nav=document.createElement("nav");nav.className="empresa-publica-nav-em";
nav.innerHTML="<button onclick='rolarPerfilEmpresaEM(\"empresaPerfilSobreEM\")' type='button'>Sobre</button><button onclick='rolarPerfilEmpresaEM(\"empresaPerfilVagasEM\")' type='button'>Vagas</button><button onclick='rolarPerfilEmpresaEM(\"empresaPerfilResumoEM\")' type='button'>Informa\u00E7\u00F5es da empresa</button>";
var inn=topo.querySelector(".empresa-publica-premium-inner-em")||topo;inn.appendChild(nav);
}
var sobreCard=sobre.closest(".empresa-publica-card-em")||sobre.parentElement;
if(sobreCard)sobreCard.id="empresaPerfilSobreEM";
var listaCard=lista.closest(".empresa-publica-card-em")||lista.parentElement;
if(listaCard)listaCard.id="empresaPerfilVagasEM";
var side=pag.querySelector(".empresa-publica-sidebar-em");
if(side)side.id="empresaPerfilResumoEM";
if(sobreCard){
var h=sobreCard.querySelector("h2");if(h)h.textContent="Sobre a "+nome.textContent;
}
if(listaCard){
var h2=listaCard.querySelector("h2");if(h2)h2.textContent="Vagas abertas";
}
var cards=Array.prototype.slice.call(lista.children);
if(cards.length){
var frag=document.createDocumentFragment();
cards.forEach(function(card){
if(card.classList&&card.classList.contains("vazio")){frag.appendChild(card);return;}
var titulo=card.querySelector(".vaga-titulo");
var cidade=card.querySelector(".tags .tag,.vaga-local,.localidade");
var id=card.getAttribute("data-id")||"";
var linha=document.createElement("article");linha.className="empresa-publica-vaga-premium-em";
linha.innerHTML="<div><h3>"+esc(titulo?titulo.textContent:"Vaga")+"</h3><p>"+esc(cidade?cidade.textContent:"")+"</p></div><button type='button'>Ver vaga</button>";
linha.querySelector("button").onclick=function(){if(typeof abrirVaga==="function")abrirVaga(id);};
frag.appendChild(linha);
});
lista.innerHTML="";lista.appendChild(frag);
}
if(side){
var card=side.querySelector(".empresa-publica-card-em")||side;
card.innerHTML="<h2>Resumo da empresa</h2><div class='empresa-publica-resumo-em'>"+
"<div class='empresa-publica-resumo-item-em'><small>Matriz</small><strong>"+esc(matriz?matriz.textContent:"N\u00E3o informada")+"</strong></div>"+
"<div class='empresa-publica-resumo-item-em'><small>Funcion\u00E1rios</small><strong>"+esc(func?func.textContent:"N\u00E3o informado")+"</strong></div>"+
"<div class='empresa-publica-resumo-item-em'><small>Setor</small><strong>"+esc(setor?setor.textContent:"N\u00E3o informado")+"</strong></div>"+
"<div class='empresa-publica-resumo-item-em'><small>Vagas abertas</small><strong>"+esc(total?total.textContent:"0")+"</strong></div>"+
"</div>";
var site=document.getElementById("empresaPublicaSiteSeguroEM");
if(site){site.className="empresa-publica-site-novo-em";card.appendChild(site);}
}
}
var obsTimer=0,obsExecutando=false;
var obs=new MutationObserver(function(muts){
if(obsExecutando)return;
var precisa=false;
for(var i=0;i<muts.length;i++){
 if(muts[i].addedNodes&&muts[i].addedNodes.length){precisa=true;break;}
}
if(!precisa)return;
var p=document.getElementById("pagina-empresa-publica");
if(p&&p.style.display!=="none"){
 clearTimeout(obsTimer);
 obsTimer=setTimeout(function(){
  obsExecutando=true;
  try{reconstruir();}finally{setTimeout(function(){obsExecutando=false;},0);}
 },80);
}
});
document.addEventListener("DOMContentLoaded",function(){
var p=document.getElementById("pagina-empresa-publica");
if(p)obs.observe(p,{subtree:true,childList:true});
});
window.addEventListener("load",function(){setTimeout(reconstruir,1000);});
})();
//
;
//
(function(){
var enviando=false;
function el(id){return document.getElementById(id);}
function val(id){var x=el(id);return x?String(x.value||"").trim():"";}
function status(msg){var x=el("statusPublicacaoModernaEM");if(x)x.textContent=msg||"";}
function falha(msg,id){
status("");
alert(msg);
var x=id?el(id):null;if(x){x.focus();try{x.scrollIntoView({behavior:"smooth",block:"center"});}catch(e){}}
}
function validar(){
var req=[
["cargoVaga","Informe o cargo da vaga."],["estadoVaga","Selecione o estado."],
["cidadeVaga","Selecione a cidade."],["areaVaga","Selecione a \u00E1rea profissional."],
["contratoVaga","Selecione o tipo de contrato."],["escolaridadeVaga","Informe a escolaridade m\u00EDnima."],
["experienciaVaga","Informe a experi\u00EAncia exigida."],["jornadaVaga","Selecione a jornada de trabalho."],
["descricaoVaga","Escreva a descri\u00E7\u00E3o da vaga."],["requisitosVaga","Informe os requisitos da vaga."]
];
for(var i=0;i<req.length;i++){if(!val(req[i][0])){falha(req[i][1],req[i][0]);return false;}}
var cepNumeros=val("cepVaga").replace(/\D/g,"");
if(cepNumeros.length!==8){falha("Informe um CEP válido do local de trabalho.","cepVaga");return false;}
var r=document.querySelector("input[name='tipoContatoVaga']:checked");
var tipo=r?r.value:"email";
if(tipo==="email"&&!val("emailCandidaturaVaga")){falha("Informe o e-mail para receber as candidaturas.","emailCandidaturaVaga");return false;}
if(tipo==="whatsapp"&&typeof normalizarWhatsappVaga==="function"&&normalizarWhatsappVaga(val("whatsappCandidaturaVaga")).length<10){falha("Informe um WhatsApp v\u00E1lido com DDI e DDD.","whatsappCandidaturaVaga");return false;}
if(tipo==="link"&&!/^https?:\/\//i.test(val("linkCandidaturaVaga"))){falha("Informe um link completo come\u00E7ando com https://","linkCandidaturaVaga");return false;}
return true;
}
function montar(empresa,plano){
var r=document.querySelector("input[name='tipoContatoVaga']:checked"),tipo=r?r.value:"email",cont="";
if(tipo==="email")cont=val("emailCandidaturaVaga");
if(tipo==="whatsapp")cont=typeof normalizarWhatsappVaga==="function"?normalizarWhatsappVaga(val("whatsappCandidaturaVaga")):val("whatsappCandidaturaVaga");
if(tipo==="link")cont=val("linkCandidaturaVaga");
var sal=val("salarioVaga")||"Sal\u00E1rio a combinar";
var dias=(plano&&plano.diasVaga)||30;
return {
id:"vaga_"+Date.now(),empresa:empresa.nomeFantasia||empresa.nome||empresa.razaoSocial||"Empresa",
empresaCnpj:empresa.cnpj||"",empresaEmail:empresa.email||empresa.email_corporativo||"",
tipoContato:tipo,contatoCandidatura:cont,cargo:val("cargoVaga"),estado:val("estadoVaga"),uf:val("estadoVaga"),
cidade:val("cidadeVaga"),cep:val("cepVaga").replace(/\D/g,""),
rua:val("ruaVagaV130"),logradouro:val("ruaVagaV130"),bairro:val("bairroVagaV130"),
enderecoVisibilidade:val("enderecoVisibilidadeV130")||"bairro",
enderecoPublico:(val("enderecoVisibilidadeV130")==="completo"
? [val("ruaVagaV130"),val("bairroVagaV130"),val("cidadeVaga"),val("estadoVaga")].filter(Boolean).join(" · ")
: (val("enderecoVisibilidadeV130")==="cidade"
? [val("cidadeVaga"),val("estadoVaga")].filter(Boolean).join(" · ")
: [val("bairroVagaV130"),val("cidadeVaga"),val("estadoVaga")].filter(Boolean).join(" · "))),    latitude:(typeof coordenadasCepVagaEM!=="undefined"&&coordenadasCepVagaEM)?coordenadasCepVagaEM.latitude:"",
longitude:(typeof coordenadasCepVagaEM!=="undefined"&&coordenadasCepVagaEM)?coordenadasCepVagaEM.longitude:"",
area:val("areaVaga"),contrato:val("contratoVaga"),modalidade:val("modalidadeVaga"),
escolaridade:val("escolaridadeVaga"),experiencia:val("experienciaVaga"),jornada:val("jornadaVaga"),
beneficiosTags:typeof beneficiosTagsSelecionados==="function"?beneficiosTagsSelecionados():[],
pcd:val("pcdVaga"),salario:sal,salarioNumero:typeof extrairSalarioNumero==="function"?extrairSalarioNumero(sal):0,
descricao:val("descricaoVaga"),requisitos:val("requisitosVaga"),beneficios:val("beneficiosVaga"),
sobreEmpresa:val("sobreEmpresaVaga"),logo:typeof logoAtual!=="undefined"?logoAtual:"",
planoDias:dias,planoId:(plano&&plano.id)||"basico",planoNome:(plano&&plano.nome)||"B\u00E1sico",
planoPreco:(plano&&plano.preco)||0,dataPublicacao:typeof dataHoje==="function"?dataHoje():"",
expiraEm:typeof calcularExpiracao==="function"?calcularExpiracao(dias):"",visualizacoes:0,destaque:false,
status:"ativa",aprovacao:"pendente",jaFoiAprovada:false,edicoesAposAprovacao:0,
confidencial:!!(el("vagaConfidencialEM")&&el("vagaConfidencialEM").checked&&typeof planoPermiteConfidencialEM==="function"&&planoPermiteConfidencialEM()),
contratacaoUrgente:!!(el("contratacaoUrgenteEmpregaMais")&&el("contratacaoUrgenteEmpregaMais").checked)
};
}
function salvarEdicaoSeguraEM(id,event){
var vagas=[];
try{vagas=typeof carregarVagasPortal==="function"?(carregarVagasPortal()||[]):[];}catch(e){vagas=[];}
if(!Array.isArray(vagas))vagas=[];
var idx=vagas.findIndex(function(v){return String(v&&v.id||"")===String(id||"");});
if(idx<0){falha("Não foi possível localizar a vaga original para edição.");return false;}
var original=vagas[idx];
try{
 if(typeof vagaPertenceEmpresaAtual==="function"&&!vagaPertenceEmpresaAtual(original)){
  falha("Esta vaga não pertence à empresa conectada.");return false;
 }
}catch(e){}
var aprov=String(original.aprovacao||original.statusAprovacao||"").toLowerCase();
var jaAprovada=original.jaFoiAprovada===true||aprov==="aprovada"||aprov==="aprovado";
var edicoes=parseInt(original.edicoesAposAprovacao||0,10)||0;
if(jaAprovada&&edicoes>=1){
 falha("Esta vaga já utilizou a edição permitida após a aprovação.");return false;
}
if(typeof publicarVagaAntesAdminEM!=="function"){
 falha("Não foi possível iniciar o salvamento da edição.");return false;
}
/* Mantém a identidade e o histórico da vaga durante o fluxo legado de edição. */
try{window.vagaEdicaoId=String(original.id);}catch(e){}
try{sessionStorage.setItem("empregaMaisVagaEdicaoId",String(original.id));}catch(e){}
function finalizarEdicaoSeguraEM(res){
 if(res===false)return res;
 var atualizadas=[];
 try{atualizadas=typeof carregarVagasPortal==="function"?(carregarVagasPortal()||[]):[];}catch(e){atualizadas=[];}
 if(Array.isArray(atualizadas)){
  var pos=atualizadas.findIndex(function(v){return String(v&&v.id||"")===String(original.id);});
  /* Remove eventual duplicata criada pelo fluxo antigo durante a edição. */
  if(pos>=0){
   atualizadas=atualizadas.filter(function(v,i){
    if(i===pos)return true;
    var mesmoId=String(v&&v.id||"")===String(original.id);
    var criadoNaEdicao=String(v&&v.id||"")!==String(original.id) &&
     String(v&&v.empresaCnpj||"")===String(original.empresaCnpj||"") &&
     String(v&&v.cargo||v&&v.titulo||"")===String(original.cargo||original.titulo||"") &&
     Math.abs((new Date(v&&v.dataAtualizacao||v&&v.updated_at||0)).getTime()-(new Date()).getTime())<120000;
    return !mesmoId&&!criadoNaEdicao;
   });
   pos=atualizadas.findIndex(function(v){return String(v&&v.id||"")===String(original.id);});
  }
  if(pos>=0){
   /* A edição nunca cria uma segunda identidade nem devolve uma vaga já aprovada
      para a fila pendente. Mantém também o histórico de edição pós-aprovação. */
   atualizadas[pos].id=original.id;
   if(jaAprovada){
    atualizadas[pos].aprovacao="aprovada";
    atualizadas[pos].jaFoiAprovada=true;
    atualizadas[pos].edicoesAposAprovacao=edicoes+1;
   }else{
    atualizadas[pos].aprovacao=original.aprovacao||atualizadas[pos].aprovacao||"pendente";
    atualizadas[pos].jaFoiAprovada=original.jaFoiAprovada===true;
    atualizadas[pos].edicoesAposAprovacao=edicoes;
   }
   try{if(typeof salvarVagasPortal==="function")salvarVagasPortal(atualizadas);}catch(e){}
  }
 }
 try{sessionStorage.removeItem("empregaMaisVagaEdicaoId");}catch(e){}
 try{window.vagaEdicaoId="";}catch(e){}
 try{var h=document.getElementById("vagaEditandoId");if(h)h.value="";}catch(e){}
 try{if(typeof montarPainelReferenciaRecrutadorEM==="function")montarPainelReferenciaRecrutadorEM();}catch(e){}
 return res;
}
var retorno=publicarVagaAntesAdminEM(event);
/* Só finaliza a referência e os contadores quando o salvamento realmente conclui. */
if(retorno&&typeof retorno.then==="function"){
 return retorno.then(finalizarEdicaoSeguraEM);
}
return finalizarEdicaoSeguraEM(retorno);
}
async function enviar(event){
if(event){event.preventDefault();event.stopPropagation();if(event.stopImmediatePropagation)event.stopImmediatePropagation();}
if(enviando)return false;
if(typeof modoPublicacaoAdminEM!=="undefined"&&modoPublicacaoAdminEM)return false;
if(typeof empresaEstaLogada==="function"&&!empresaEstaLogada()){if(typeof irPara==="function")irPara("login-empresa");return false;}
var idEdicaoAtual="";
try{
 idEdicaoAtual=String(
  (typeof vagaEdicaoId!=="undefined"&&vagaEdicaoId) ||
  ((document.getElementById("vagaEditandoId")||{}).value) ||
  sessionStorage.getItem("empregaMaisVagaEdicaoId") || ""
 );
}catch(e){}
if(idEdicaoAtual){
 return salvarEdicaoSeguraEM(idEdicaoAtual,event);
}
if(!validar())return false;
var empresa=typeof obterEmpresaAtual==="function"?obterEmpresaAtual():null;
if(!empresa){falha("N\u00E3o foi poss\u00EDvel identificar a empresa logada.");return false;}
var plano=typeof planoEmpresaAtual==="function"?planoEmpresaAtual():null;
if(plano&&typeof contarVagasEmpresaMes==="function"&&contarVagasEmpresaMes(empresa.cnpj)>=plano.vagasMes){
falha("O limite mensal de vagas do seu plano foi atingido.");return false;
}
var vaga=montar(empresa,plano),btn=el("btnSalvarVaga");
enviando=true;if(btn){btn.disabled=true;btn.classList.add("publicando-em");btn.textContent="Enviando vaga...";}status("Salvando e enviando para aprova\u00E7\u00E3o\u2026");
try{
var resp;
if(typeof apiEmpregaMaisPost==="function")resp=await apiEmpregaMaisPost({acao:"publicar",vaga:vaga});
else{
resp=await fetch(EMPREGAMAIS_API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({acao:"publicar",vaga:vaga})}).then(function(r){return r.json();});
}
if(!resp||resp.sucesso!==true)throw new Error((resp&&resp.erro)||"O servidor n\u00E3o confirmou a publica\u00E7\u00E3o.");
var vagas=typeof carregarVagasPortal==="function"?carregarVagasPortal():[];
var existe=vagas.some(function(v){return String(v.id)===String(vaga.id);});
if(!existe){vagas.unshift(vaga);if(typeof salvarVagasPortal==="function")salvarVagasPortal(vagas);}
try{if(typeof sincronizarVagasGoogleSheets==="function")await sincronizarVagasGoogleSheets();}catch(e){}
var form=el("formVaga");if(form)form.reset();
try{
 if(typeof window.limparRascunhoVagaV145==="function")window.limparRascunhoVagaV145();
 localStorage.removeItem("empregaMaisBackupEdicaoV148");
}catch(e){}
if(typeof logoAtual!=="undefined")logoAtual="";
var prev=el("previewLogo");if(prev)prev.style.display="none";
if(typeof prepararContatoPublicacao==="function")prepararContatoPublicacao();
status("Vaga enviada com sucesso.");
if(typeof mostrarModalSite==="function"){
mostrarModalSite("Vaga enviada com sucesso!","A oportunidade foi salva e enviada para aprova\u00E7\u00E3o administrativa.","sucesso","Ir para minhas vagas",function(){irPara("painel-empresa");});
}else{alert("Vaga enviada com sucesso!");if(typeof irPara==="function")irPara("painel-empresa");}
}catch(err){
console.error("Falha ao publicar vaga:",err);
falha("N\u00E3o foi poss\u00EDvel publicar a vaga. O formul\u00E1rio foi mantido. Tente novamente.");
}finally{
enviando=false;if(btn){btn.disabled=false;btn.classList.remove("publicando-em");btn.textContent="Enviar vaga para aprova\u00E7\u00E3o";}
}
return false;
}
function instalar(){
var form=el("formVaga");if(!form||form.dataset.publicacaoModernaEM==="1")return;
form.dataset.publicacaoModernaEM="1";
form.removeAttribute("onsubmit");
form.addEventListener("submit",enviar,true);
var a=form.querySelector(".acoes-publicar-estaveis");
if(a&&!el("statusPublicacaoModernaEM")){var st=document.createElement("span");st.id="statusPublicacaoModernaEM";st.setAttribute("aria-live","polite");a.insertBefore(st,a.firstChild);}
}
document.addEventListener("DOMContentLoaded",instalar);
window.addEventListener("load",function(){setTimeout(instalar,300);});
})();
//
;
//
(function(){
var timer=null;
function paginaPesadaDeFormulario(){
var pub=document.getElementById("pagina-publicar");
if(pub&&(pub.classList.contains("ativa")||getComputedStyle(pub).display!=="none"))return true;
var cad=document.getElementById("pagina-cadastro-empresa");
if(cad&&(cad.classList.contains("ativa")||getComputedStyle(cad).display!=="none"))return true;
return false;
}
function atualizarLeve(){
if(paginaPesadaDeFormulario())return;
clearTimeout(timer);
timer=setTimeout(function(){
try{if(typeof tornarEmpresasClicaveisEM==="function")tornarEmpresasClicaveisEM();}catch(e){}
try{if(typeof conectarCardsAoCadastroEmpresaEM==="function")conectarCardsAoCadastroEmpresaEM();}catch(e){}
try{if(typeof conectarDetalheAoCadastroEmpresaEM==="function")conectarDetalheAoCadastroEmpresaEM();}catch(e){}
try{if(typeof aplicarSegurancaDetalheEM==="function")aplicarSegurancaDetalheEM();}catch(e){}
},180);
}
document.addEventListener("DOMContentLoaded",function(){
var alvo=document.querySelector("main");
if(!alvo)return;
var obs=new MutationObserver(function(muts){
if(paginaPesadaDeFormulario())return;
var relevante=false;
for(var i=0;i<muts.length;i++){
if(muts[i].addedNodes&&muts[i].addedNodes.length){relevante=true;break;}
}
if(relevante)atualizarLeve();
});
obs.observe(alvo,{childList:true,subtree:true});
});
})();
//
;
//
(function(){
function logoutAdminEmpregaMais(e){
if(e){ e.preventDefault(); e.stopPropagation(); }
try {
localStorage.removeItem("empregaMaisAdminSupabaseToken");
localStorage.removeItem("empregaMaisPapel");
sessionStorage.removeItem("empregaMaisAdminSupabaseToken");
sessionStorage.removeItem("empregaMaisPapel");
} catch(err){}
try {
if (window.supabaseClient && window.supabaseClient.auth) {
Promise.resolve(window.supabaseClient.auth.signOut()).finally(finalizar);
return false;
}
if (window.supabase && window.supabase.auth && typeof window.supabase.auth.signOut === "function") {
Promise.resolve(window.supabase.auth.signOut()).finally(finalizar);
return false;
}
} catch(err){}
finalizar();
return false;
}
function finalizar(){
try {
if(typeof fecharPainelAdminEM === "function") fecharPainelAdminEM();
} catch(e){}
try {
if(typeof mostrarPagina === "function") {
mostrarPagina("home");
setTimeout(function(){ location.reload(); }, 80);
return;
}
} catch(e){}
location.href = location.pathname;
}
function instalar(){
var seletores = [
"#btnLogoutAdmin",
"#btnSairAdmin",
"[data-admin-logout]",
".btn-logout-admin",
".admin-logout",
"#painelAdmin button"
];
var candidatos = document.querySelectorAll(seletores.join(","));
candidatos.forEach(function(el){
var txt=(el.textContent||"").trim().toLowerCase();
var id=(el.id||"").toLowerCase();
var cls=(el.className||"").toString().toLowerCase();
if(txt==="sair" || txt.indexOf("deslog")>=0 || txt.indexOf("logout")>=0 ||
id.indexOf("logout")>=0 || id.indexOf("sairadmin")>=0 ||
cls.indexOf("logout")>=0){
if(el.dataset.logoutAdminCorrigido==="1") return;
el.dataset.logoutAdminCorrigido="1";
el.addEventListener("click", logoutAdminEmpregaMais, true);
}
});
}
document.addEventListener("DOMContentLoaded", instalar);
document.addEventListener("click", function(e){
var el=e.target && e.target.closest ? e.target.closest("button,a") : null;
if(!el) return;
var txt=(el.textContent||"").trim().toLowerCase();
var contexto=el.closest("#painelAdmin,.admin-panel,.painel-admin,[data-pagina='admin']");
if(contexto && (txt==="sair" || txt.indexOf("deslog")>=0 || txt.indexOf("logout")>=0)){
logoutAdminEmpregaMais(e);
}
}, true);
window.logoutAdminEmpregaMais = logoutAdminEmpregaMais;
})();
//
;
//
(function(){
var U="https://mkezlcewyengejdmtppl.supabase.co";
var K="sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR";
var TK="empregaMaisAdminSupabaseToken";
var saindo=false;
function limparAdmin(){
try{
localStorage.removeItem(TK);
localStorage.removeItem("empregaMaisAdminSupabaseRefreshToken");
localStorage.removeItem("empregaMaisPapel");
sessionStorage.removeItem(TK);
sessionStorage.removeItem("empregaMaisAdminSupabaseRefreshToken");
sessionStorage.removeItem("empregaMaisPapel");
}catch(e){}
}
async function sairAdminRealEM(ev){
if(ev){
ev.preventDefault();
ev.stopPropagation();
if(ev.stopImmediatePropagation) ev.stopImmediatePropagation();
}
if(saindo) return false;
saindo=true;
var token="";
try{
token=localStorage.getItem(TK)||sessionStorage.getItem(TK)||"";
}catch(e){}
limparAdmin();
if(token){
try{
await fetch(U+"/auth/v1/logout",{
method:"POST",
headers:{
"apikey":K,
"Authorization":"Bearer "+token,
"Content-Type":"application/json"
}
});
}catch(e){
console.warn("Logout remoto do Admin:",e);
}
}
limparAdmin();
try{
if(typeof sairModoPublicacaoAdminEM==="function") sairModoPublicacaoAdminEM();
}catch(e){}
try{
location.href=location.origin+location.pathname;
}catch(e){
location.reload();
}
return false;
}
window.logoutAdminEmpregaMais=sairAdminRealEM;
window.sairAdminEmpregaMais=sairAdminRealEM;
window.logoutAdminSupabaseEM=sairAdminRealEM;
document.addEventListener("click",function(ev){
var b=ev.target&&ev.target.closest?ev.target.closest("button,a,input[type='button'],input[type='submit']"):null;
if(!b)return;
var texto=((b.textContent||b.value||"")+" "+(b.id||"")+" "+(b.className||"")+" "+(b.getAttribute("onclick")||"")).toLowerCase();
var painel=b.closest("#pagina-admin,#admin,.pagina-admin,.admin-panel,.painel-admin,[data-pagina='admin']");
if(painel && (
texto.indexOf("sair")>=0 ||
texto.indexOf("logout")>=0 ||
texto.indexOf("deslog")>=0
)){
sairAdminRealEM(ev);
}
},true);
})();
//
;
//
function alternarSenhaPortalEmpresaEM(id,b){var c=document.getElementById(id);if(!c)return;var m=c.type==="password";c.type=m?"text":"password";b.innerHTML=m?"&amp;#128584;":"&amp;#128065;";}
function abrirCadastroEmpresaProfissionalEM(){var m=document.getElementById("cadastroEmpresaModalEM");if(m){m.classList.add("ativo");m.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";}}
function fecharCadastroEmpresaProfissionalEM(){var m=document.getElementById("cadastroEmpresaModalEM");if(m){m.classList.remove("ativo");m.setAttribute("aria-hidden","true");document.body.style.overflow="";}}
function loginEmpresaProfissionalEM(e){
if(e&&typeof e.preventDefault==="function")e.preventDefault();
if(e&&typeof e.stopPropagation==="function")e.stopPropagation();
var campoAcesso=document.getElementById("loginEmpresaIdentificadorEM");
var campoSenha=document.getElementById("loginEmpresaSenhaEM");
var acesso=String(campoAcesso?campoAcesso.value:"").trim();
var senha=String(campoSenha?campoSenha.value:"");
if(!acesso||!senha){
alert("Informe o CNPJ ou e-mail corporativo e a senha.");
return false;
}
var numeros=acesso.replace(/\D/g,"");
var email=acesso.toLowerCase();
if(acesso.indexOf("@")!==-1){
var lista=[];
try{lista=empresasCadastradas()||[];}catch(err){lista=[];}
var empresa=null;
for(var i=0;i<lista.length;i++){
if(
String(lista[i].email||"").trim().toLowerCase()===email &&
String(lista[i].senha||"")===senha
){
empresa=lista[i];
break;
}
}
if(!empresa){
alert("E-mail corporativo ou senha incorretos.");
return false;
}
entrarComoEmpresa(empresa);
irPara("painel-empresa");
return false;
}
if(numeros.length!==14){
alert("Informe um CNPJ v\u00E1lido ou o e-mail corporativo.");
return false;
}
var campoCnpjOriginal=document.getElementById("loginEmpresaCnpj");
var campoSenhaOriginal=document.getElementById("loginEmpresaSenha");
if(!campoCnpjOriginal||!campoSenhaOriginal||typeof loginEmpresa!=="function"){
alert("N\u00E3o foi poss\u00EDvel iniciar o login da empresa.");
return false;
}
campoCnpjOriginal.value=numeros;
campoSenhaOriginal.value=senha;
var eventoSeguro={
preventDefault:function(){},
stopPropagation:function(){}
};
loginEmpresa(eventoSeguro);
return false;
}
function cadastrarEmpresaProfissionalEM(e){
e.preventDefault();var c=String(document.getElementById("cadEmpresaCnpjEM").value||"").replace(/\D/g,""),cpf=String(document.getElementById("cadEmpresaCpfEM").value||"").replace(/\D/g,""),em=String(document.getElementById("cadEmpresaEmailEM").value||"").trim().toLowerCase(),s=document.getElementById("cadEmpresaSenhaEM").value,sc=document.getElementById("cadEmpresaConfirmarSenhaEM").value;
if(c.length!==14){alert("Informe um CNPJ com 14 n\u00FAmeros.");return;}if(cpf.length!==11){alert("Informe um CPF com 11 n\u00FAmeros.");return;}if(s.length<6){alert("A senha deve possuir pelo menos 6 caracteres.");return;}if(s!==sc){alert("As senhas n\u00E3o coincidem.");return;}
var l=empresasCadastradas();for(var i=0;i<l.length;i++){if(String(l[i].cnpj||"").replace(/\D/g,"")===c){alert("Este CNPJ j\u00E1 possui cadastro.");return;}if(String(l[i].email||"").trim().toLowerCase()===em){alert("Este e-mail corporativo j\u00E1 possui cadastro.");return;}}
var x={id:"empresa_"+new Date().getTime(),nome:document.getElementById("cadEmpresaNomeEM").value,cnpj:c,cpf:cpf,responsavel:document.getElementById("cadEmpresaResponsavelEM").value,cargoResponsavel:document.getElementById("cadEmpresaCargoEM").value,email:em,telefone:document.getElementById("cadEmpresaTelefoneEM").value,telefoneEmpresa:document.getElementById("cadEmpresaTelefoneFixoEM").value,cep:document.getElementById("cadEmpresaCepEM").value,cidade:document.getElementById("cadEmpresaCidadeEM").value,uf:document.getElementById("cadEmpresaUfEM").value,setor:document.getElementById("cadEmpresaSetorEM").value,funcionarios:document.getElementById("cadEmpresaFuncionariosEM").value,sobre:document.getElementById("cadEmpresaSobreEM").value,plano:"essencial",verificacaoStatus:"nao_verificada",verificada:false,aprovacaoAutomaticaSuspensa:false,senha:s};
l.push(x);salvarArray("empresasEmpregaMais",l);entrarComoEmpresa(x);fecharCadastroEmpresaProfissionalEM();irPara("publicar");return false;
}
document.addEventListener("DOMContentLoaded",function(){var m=document.getElementById("cadastroEmpresaModalEM");if(m)m.addEventListener("click",function(e){if(e.target===m)fecharCadastroEmpresaProfissionalEM();});});
//
;
//
(function(){
function protegerLoginEmpresaEM(){
var form=document.querySelector("#pagina-login-empresa .portal-login-card-em form");
if(!form||form.dataset.loginProfissionalProtegidoEM==="1")return;
form.dataset.loginProfissionalProtegidoEM="1";
form.removeAttribute("onsubmit");
form.addEventListener("submit",function(ev){
ev.preventDefault();
ev.stopPropagation();
loginEmpresaProfissionalEM(ev);
return false;
},true);
}
document.addEventListener("DOMContentLoaded",protegerLoginEmpresaEM);
window.addEventListener("load",protegerLoginEmpresaEM);
setTimeout(protegerLoginEmpresaEM,300);
})();
//
;
//
(function(){
function instalarLoginEmpresaSemSubmitEM(){
var form=document.getElementById("formLoginEmpresaProfissionalEM");
if(!form||form.dataset.semSubmitEM==="1")return;
form.dataset.semSubmitEM="1";
form.setAttribute("action","javascript:void(0)");
form.addEventListener("submit",function(ev){
ev.preventDefault();
ev.stopImmediatePropagation();
return false;
},true);
var campos=form.querySelectorAll("input");
for(var i=0;i<campos.length;i++){
campos[i].addEventListener("keydown",function(ev){
if(ev.key==="Enter"){
ev.preventDefault();
ev.stopPropagation();
loginEmpresaProfissionalEM(null);
return false;
}
},true);
}
}
document.addEventListener("DOMContentLoaded",instalarLoginEmpresaSemSubmitEM);
window.addEventListener("load",instalarLoginEmpresaSemSubmitEM);
setTimeout(instalarLoginEmpresaSemSubmitEM,300);
})();
//