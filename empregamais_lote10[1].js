/* EmpregaMais - JavaScript externo - lote 10 */

//
(function(){
function txtRefEM(v){
var s=String(v==null?"":v);
if(typeof escaparTexto==="function")return escaparTexto(s);
return s.replace(/&amp;/g,"&amp;amp;").replace(/&lt;/g,"&amp;lt;").replace(/&gt;/g,"&amp;gt;").replace(/"/g,"&amp;quot;");
}
function dataRefEM(v){
var s=String(v||"");
var m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);
return m?(m[3]+"/"+m[2]+"/"+m[1]):(s||"-");
}
function valorRefEM(v,campos,padrao){
for(var i=0;i&lt;campos.length;i++){
if(v[campos[i]]!==undefined&amp;&amp;v[campos[i]]!==null&amp;&amp;String(v[campos[i]]).trim()!=="")return v[campos[i]];
}
return padrao;
}
function vagasEmpresaRefEM(){
try{return typeof vagasDaEmpresa==="function"?(vagasDaEmpresa()||[]):[];}catch(e){return[];}
}
function candidaturasRefEM(){
try{return typeof carregarCandidaturas==="function"?(carregarCandidaturas()||[]):[];}catch(e){return[];}
}
function pertenceRefEM(c,ids){
return ids.indexOf(String(c.vagaId||c.idVaga||""))&gt;=0;
}
function abrirCandRefEM(id){
try{sessionStorage.setItem("vagaCandidatosSelecionada",String(id));}catch(e){}
if(typeof abrirCandidatosDaVaga==="function"){abrirCandidatosDaVaga(id);return;}
if(typeof irPara==="function")irPara("candidatos-empresa");
}
function verVagaRefEM(id){
if(typeof abrirVaga==="function"){abrirVaga(id);return;}
if(typeof abrirDetalheVaga==="function"){abrirDetalheVaga(id);return;}
}
function editarVagaRefEM(id){
if(typeof editarVagaEmpresa==="function"){editarVagaEmpresa(id);return;}
if(typeof editarVaga==="function"){editarVaga(id);return;}
}
function encerrarVagaRefEM(id){
if(typeof encerrarVagaEmpresa==="function"){encerrarVagaEmpresa(id);return;}
if(typeof encerrarVaga==="function"){encerrarVaga(id);return;}
}
window.montarPainelReferenciaRecrutadorEM=function(){
var pagina=document.getElementById("pagina-painel-empresa");
if(!pagina)return;
var anterior=document.getElementById("painelReferenciaRecrutadorEM");
if(anterior)anterior.remove();
var emp={};
try{emp=typeof empresaLogadaPainelEM==="function"?(empresaLogadaPainelEM()||{}):{};}catch(e){}
var nome=emp.nomeFantasia||emp.nome||emp.razaoSocial||sessionStorage.getItem("empresaNome")||"Sua empresa";
var vagas=vagasEmpresaRefEM();
var ids=vagas.map(function(v){return String(v.id);});
var cs=candidaturasRefEM().filter(function(c){return pertenceRefEM(c,ids);});
var aprovadas=vagas.filter(function(v){
return String(v.aprovacao||"").toLowerCase()==="aprovada"&amp;&amp;String(v.status||"").toLowerCase()!=="encerrada";
});
var pendentes=vagas.filter(function(v){
return String(v.aprovacao||"").toLowerCase()==="pendente"&amp;&amp;String(v.status||"").toLowerCase()!=="encerrada";
});
var encerradas=vagas.filter(function(v){
return String(v.status||"").toLowerCase()==="encerrada";
});
var processo=cs.filter(function(c){
var s=String(c.status||"").toLowerCase();
return s.indexOf("entrevista")&gt;=0||s==="selecionado"||s==="aprovado"||s.indexOf("pr\u00e9-selecionado")&gt;=0;
}).length;
var contratados=cs.filter(function(c){return String(c.status||"").toLowerCase()==="contratado";}).length;
var shell=document.createElement("div");
shell.id="painelReferenciaRecrutadorEM";
shell.className="recrutador-shell-ref-em";
shell.innerHTML=
"&lt;aside class='recrutador-sidebar-ref-em sidebar-v124'&gt;"+
"&lt;div class='sidebar-marca-v124'&gt;&lt;span class='sidebar-logo-v124'&gt;E+&lt;/span&gt;&lt;span&gt;&lt;b&gt;Emprega&lt;span&gt;Mais&lt;/span&gt;&lt;/b&gt;&lt;small&gt;PARA EMPRESAS&lt;/small&gt;&lt;/span&gt;&lt;/div&gt;"+
"&lt;button class='ativo' type='button' data-ref-nav='painel'&gt;&lt;span class='icone-ref-em'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;path d='M3 11.5 12 4l9 7.5M5.5 10v10h13V10M9 20v-6h6v6'/&gt;&lt;/svg&gt;&lt;/span&gt;Visão geral&lt;/button&gt;"+
"&lt;button type='button' data-ref-nav='aprovadas'&gt;&lt;span class='icone-ref-em'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;rect x='3' y='7' width='18' height='13' rx='2'/&gt;&lt;path d='M8 7V5h8v2M3 12h18M10 12v2h4v-2'/&gt;&lt;/svg&gt;&lt;/span&gt;Minhas vagas&lt;/button&gt;"+
"&lt;button type='button' data-ref-nav='candidaturas'&gt;&lt;span class='icone-ref-em'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;circle cx='9' cy='8' r='3'/&gt;&lt;path d='M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 6.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 4.8V20'/&gt;&lt;/svg&gt;&lt;/span&gt;Candidaturas&lt;/button&gt;"+
"&lt;button type='button' data-ref-nav='publicar-lateral'&gt;&lt;span class='icone-ref-em'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;circle cx='12' cy='12' r='9'/&gt;&lt;path d='M12 7v10M7 12h10'/&gt;&lt;/svg&gt;&lt;/span&gt;Publicar vaga&lt;/button&gt;"+
"&lt;button type='button' data-ref-nav='empresa'&gt;&lt;span class='icone-ref-em'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;path d='M4 21V4h11v17M15 9h5v12M8 8h3M8 12h3M8 16h3M18 13h.01M18 17h.01'/&gt;&lt;/svg&gt;&lt;/span&gt;Perfil da empresa&lt;/button&gt;"+
"&lt;button type='button' data-ref-nav='planos'&gt;&lt;span class='icone-ref-em'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;rect x='3' y='5' width='18' height='14' rx='2'/&gt;&lt;path d='M3 10h18M7 15h4'/&gt;&lt;/svg&gt;&lt;/span&gt;Planos e pagamentos&lt;/button&gt;"+
"&lt;button type='button' data-ref-nav='verificacao-v124'&gt;&lt;span class='icone-ref-em'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;path d='M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z'/&gt;&lt;path d='m8.5 12 2.2 2.2 4.8-5'/&gt;&lt;/svg&gt;&lt;/span&gt;Verificação&lt;/button&gt;"+
"&lt;button type='button' data-ref-nav='config-v124'&gt;&lt;span class='icone-ref-em'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;circle cx='12' cy='12' r='3'/&gt;&lt;path d='M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v4H21a1.7 1.7 0 0 0-1.6 1Z'/&gt;&lt;/svg&gt;&lt;/span&gt;Configurações&lt;/button&gt;"+
"&lt;button type='button' data-ref-nav='ajuda'&gt;&lt;span class='icone-ref-em'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;circle cx='12' cy='12' r='9'/&gt;&lt;path d='M9.7 9a2.5 2.5 0 1 1 3.8 2.1c-1 .6-1.5 1.1-1.5 2.4M12 17h.01'/&gt;&lt;/svg&gt;&lt;/span&gt;Ajuda e suporte&lt;/button&gt;"+
"&lt;div class='ajuda-card-v124'&gt;&lt;div class='headset-v124'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;path d='M4 13v-2a8 8 0 0 1 16 0v2'/&gt;&lt;path d='M5 12H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v-7H5ZM19 12h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2v-7h1Z'/&gt;&lt;path d='M18 19c-1 2-3 2-5 2'/&gt;&lt;/svg&gt;&lt;/div&gt;&lt;strong&gt;Precisa de ajuda?&lt;/strong&gt;&lt;p&gt;Nossa equipe está pronta para te atender.&lt;/p&gt;&lt;button class='suporte-v124' type='button'&gt;Falar com o suporte&lt;/button&gt;&lt;/div&gt;"+
"&lt;button class='sair-ref-em' type='button' data-ref-nav='sair'&gt;&lt;span class='icone-ref-em'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;path d='M10 5H5v14h5M14 8l4 4-4 4M8 12h10'/&gt;&lt;/svg&gt;&lt;/span&gt;Sair&lt;/button&gt;"+
"&lt;/aside&gt;"+"&lt;main class='recrutador-main-ref-em'&gt;"+
"&lt;section class='recrutador-boasvindas-ref-em'&gt;"+
"&lt;div class='recrutador-boasvindas-topo-ref-em'&gt;"+
"&lt;div&gt;&lt;h2&gt;Ol\u00e1, "+txtRefEM(nome)+"!&lt;/h2&gt;&lt;p&gt;Gerencie suas vagas, acompanhe candidaturas e encontre os melhores talentos.&lt;/p&gt;&lt;/div&gt;"+
"&lt;button class='recrutador-publicar-ref-em' type='button' data-ref-publicar='+'&gt;+ &amp;nbsp; Publicar nova vaga&lt;/button&gt;"+
"&lt;/div&gt;"+
"&lt;div class='recrutador-cards-ref-em'&gt;"+
"&lt;div class='recrutador-card-ref-em'&gt;&lt;div class='recrutador-card-icone-ref-em'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;rect x='3' y='7' width='18' height='13' rx='2'/&gt;&lt;path d='M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12h18M10 12v2h4v-2'/&gt;&lt;/svg&gt;&lt;/div&gt;&lt;div&gt;&lt;strong&gt;"+aprovadas.length+"&lt;/strong&gt;&lt;span&gt;Vagas ativas&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;"+
"&lt;div class='recrutador-card-ref-em'&gt;&lt;div class='recrutador-card-icone-ref-em'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;circle cx='8' cy='8' r='3'/&gt;&lt;circle cx='16.5' cy='9' r='2.5'/&gt;&lt;path d='M2.5 19v-2a5 5 0 0 1 5-5h1a5 5 0 0 1 5 5v2M14 13h2.5a4.5 4.5 0 0 1 4.5 4.5V19'/&gt;&lt;/svg&gt;&lt;/div&gt;&lt;div&gt;&lt;strong&gt;"+pendentes.length+"&lt;/strong&gt;&lt;span&gt;Em aprova\u00e7\u00e3o&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;"+
"&lt;div class='recrutador-card-ref-em'&gt;&lt;div class='recrutador-card-icone-ref-em'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;path d='M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z'/&gt;&lt;circle cx='12' cy='12' r='2.8'/&gt;&lt;/svg&gt;&lt;/div&gt;&lt;div&gt;&lt;strong&gt;"+cs.length+"&lt;/strong&gt;&lt;span&gt;Candidaturas&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;"+
"&lt;div class='recrutador-card-ref-em'&gt;&lt;div class='recrutador-card-icone-ref-em'&gt;&lt;svg viewBox='0 0 24 24' aria-hidden='true'&gt;&lt;rect x='5' y='3' width='14' height='18' rx='2'/&gt;&lt;path d='M9 7h6M9 11h6M9 15h4'/&gt;&lt;/svg&gt;&lt;/div&gt;&lt;div&gt;&lt;strong&gt;"+processo+"&lt;/strong&gt;&lt;span&gt;Em processo&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;"+
"&lt;div class='recrutador-card-ref-em'&gt;&lt;div class='recrutador-card-icone-ref-em'&gt;&amp;#10003;&lt;/div&gt;&lt;div&gt;&lt;strong&gt;"+contratados+"&lt;/strong&gt;&lt;span&gt;Contratados&lt;/span&gt;&lt;/div&gt;&lt;/div&gt;"+
"&lt;/div&gt;"+
"&lt;/section&gt;"+
"&lt;section class='recrutador-vagas-box-ref-em'&gt;"+
"&lt;div class='recrutador-tabs-ref-em'&gt;"+
"&lt;button class='ativo' type='button' data-ref-tab='aprovadas'&gt;Vagas aprovadas &lt;span class='contador-ref-em'&gt;"+aprovadas.length+"&lt;/span&gt;&lt;/button&gt;"+
"&lt;button type='button' data-ref-tab='pendentes'&gt;Vagas em aprova\u00e7\u00e3o &lt;span class='contador-ref-em'&gt;"+pendentes.length+"&lt;/span&gt;&lt;/button&gt;"+
"&lt;button type='button' data-ref-tab='encerradas'&gt;Vagas encerradas &lt;span class='contador-ref-em'&gt;"+encerradas.length+"&lt;/span&gt;&lt;/button&gt;"+
"&lt;div class='recrutador-busca-ref-em'&gt;&lt;input type='search' id='buscaPainelRefEM' placeholder='Buscar vaga, cargo ou cidade...' /&gt;&lt;/div&gt;"+
"&lt;/div&gt;"+
"&lt;div class='recrutador-tabela-wrap-ref-em'&gt;&lt;table class='recrutador-tabela-ref-em'&gt;"+
"&lt;thead&gt;&lt;tr&gt;&lt;th&gt;T\u00edtulo da vaga&lt;/th&gt;&lt;th&gt;Cidade&lt;/th&gt;&lt;th&gt;Modalidade&lt;/th&gt;&lt;th&gt;Sal\u00e1rio&lt;/th&gt;&lt;th&gt;Publicada em&lt;/th&gt;&lt;th&gt;Status&lt;/th&gt;&lt;th&gt;Candidaturas&lt;/th&gt;&lt;th&gt;A\u00e7\u00f5es&lt;/th&gt;&lt;/tr&gt;&lt;/thead&gt;"+
"&lt;tbody id='corpoTabelaPainelRefEM'&gt;&lt;/tbody&gt;"+
"&lt;/table&gt;&lt;/div&gt;"+
"&lt;div class='recrutador-rodape-tabela-ref-em'&gt;&lt;span id='textoRodapePainelRefEM'&gt;&lt;/span&gt;&lt;div class='recrutador-paginacao-ref-em'&gt;&lt;button type='button' disabled='disabled'&gt;&amp;#8249;&lt;/button&gt;&lt;button class='ativo' type='button'&gt;1&lt;/button&gt;&lt;button type='button' disabled='disabled'&gt;&lt;/button&gt;&lt;/div&gt;&lt;/div&gt;"+
"&lt;/section&gt;"+
"&lt;/main&gt;";
var filhos=pagina.children;
for(var i=0;i&lt;filhos.length;i++){filhos[i].style.display="none";}
pagina.appendChild(shell);
var aba="aprovadas";
var busca="";
function listaAtual(){
return aba==="pendentes"?pendentes:(aba==="encerradas"?encerradas:aprovadas);
}
function renderTabela(){
var corpo=document.getElementById("corpoTabelaPainelRefEM");
if(!corpo)return;
corpo.innerHTML="";
var lista=listaAtual().filter(function(v){
if(!busca)return true;
var s=(String(valorRefEM(v,["cargo","titulo","vaga"],""))+" "+String(valorRefEM(v,["cidade"],""))+" "+String(valorRefEM(v,["empresa","empresaNome"],""))).toLowerCase();
return s.indexOf(busca)&gt;=0;
});
lista.forEach(function(v){
var titulo=valorRefEM(v,["cargo","titulo","vaga"],"Vaga");
var empresa=valorRefEM(v,["empresa","empresaNome"],"");
var cidade=valorRefEM(v,["cidade"],"-");
var uf=valorRefEM(v,["uf","estado"],"");
var local=String(cidade)+(uf&amp;&amp;String(cidade).toLowerCase().indexOf(String(uf).toLowerCase())&lt;0?" - "+uf:"");
var modalidade=valorRefEM(v,["modalidade"],"-");
var salario=valorRefEM(v,["salario","sal\u00e1rio"],"A combinar");
var publicada=valorRefEM(v,["data","dataPublicacao","publicadaEm","created_at"],"");
var n=0;
try{n=typeof contarCandidaturasVaga==="function"?contarCandidaturasVaga(v.id):0;}catch(e){}
var st=aba==="pendentes"?"Em aprova\u00e7\u00e3o":(aba==="encerradas"?"Encerrada":"Ativa");
var cls=aba==="pendentes"?"pendente":(aba==="encerradas"?"encerrada":"");
var tr=document.createElement("tr");
tr.innerHTML=
"&lt;td&gt;&lt;strong&gt;"+txtRefEM(titulo)+"&lt;/strong&gt;"+(empresa?"&lt;small&gt;"+txtRefEM(empresa)+"&lt;/small&gt;":"")+"&lt;/td&gt;"+
"&lt;td&gt;"+txtRefEM(local)+"&lt;/td&gt;&lt;td&gt;"+txtRefEM(modalidade)+"&lt;/td&gt;&lt;td&gt;"+txtRefEM(salario)+"&lt;/td&gt;"+
"&lt;td&gt;"+txtRefEM(dataRefEM(publicada))+"&lt;/td&gt;&lt;td&gt;&lt;span class='recrutador-status-ref-em "+cls+"'&gt;"+st+"&lt;/span&gt;&lt;/td&gt;"+
"&lt;td&gt;&lt;button class='recrutador-cand-ref-em' type='button'&gt;"+n+"&lt;/button&gt;&lt;/td&gt;"+
"&lt;td&gt;&lt;button class='recrutador-acao-ref-em ver' type='button'&gt;Ver&lt;/button&gt;&lt;button class='recrutador-acao-ref-em editar' type='button'&gt;Editar&lt;/button&gt;"+(aba!=="encerradas"?"&lt;button class='recrutador-acao-ref-em encerrar' type='button'&gt;Encerrar&lt;/button&gt;":"")+"&lt;/td&gt;";
tr.querySelector(".recrutador-cand-ref-em").onclick=function(){abrirCandRefEM(v.id);};
tr.querySelector(".ver").onclick=function(){verVagaRefEM(v.id);};
tr.querySelector(".editar").onclick=function(){editarVagaRefEM(v.id);};
var be=tr.querySelector(".encerrar");if(be)be.onclick=function(){encerrarVagaRefEM(v.id);};
corpo.appendChild(tr);
});
if(!lista.length)corpo.innerHTML="&lt;tr&gt;&lt;td class='vazio-ref-em' colspan='8'&gt;Nenhuma vaga encontrada.&lt;/td&gt;&lt;/tr&gt;";
var rod=document.getElementById("textoRodapePainelRefEM");
if(rod)rod.textContent="Mostrando "+lista.length+" de "+listaAtual().length+" vagas";
}
shell.querySelector("[data-ref-publicar]").onclick=function(){irPara("publicar");};
shell.querySelector("[data-ref-nav='publicar-lateral']").onclick=function(){irPara("publicar");};
shell.querySelector("[data-ref-nav='verificacao-v124']").onclick=function(){
var alvo=document.getElementById("pagina-verificacao-empresa")||document.getElementById("pagina-perfil-empresa-em");
if(alvo){ if(document.getElementById("pagina-verificacao-empresa"))irPara("verificacao-empresa"); else irPara("perfil-empresa"); }
};
shell.querySelector("[data-ref-nav='config-v124']").onclick=function(){irPara("perfil-empresa");};
shell.querySelector(".suporte-v124").onclick=function(){
var bt=shell.querySelector("[data-ref-nav='ajuda']");if(bt)bt.click();
};
shell.querySelector("[data-ref-nav='painel']").onclick=function(){window.scrollTo(0,0);};
shell.querySelector("[data-ref-nav='aprovadas']").onclick=function(){aba="aprovadas";ativarTab("aprovadas");};
shell.querySelector("[data-ref-nav='candidaturas']").onclick=function(){irPara("candidatos-empresa");};
shell.querySelector("[data-ref-nav='empresa']").onclick=function(){irPara("perfil-empresa");};
shell.querySelector("[data-ref-nav='planos']").onclick=function(){irPara("planos");};
shell.querySelector("[data-ref-nav='ajuda']").onclick=function(){
if(document.getElementById("pagina-contato"))irPara("contato");else alert("Entre em contato com o suporte do EmpregaMais.");
};
shell.querySelector("[data-ref-nav='sair']").onclick=function(){
if(typeof sairEmpresa==="function"){sairEmpresa();return;}
if(typeof logoutEmpresa==="function"){logoutEmpresa();return;}
sessionStorage.clear();irPara("login-empresa");
};
function ativarTab(nova){
aba=nova;
var tabs=shell.querySelectorAll("[data-ref-tab]");
for(var j=0;j&lt;tabs.length;j++)tabs[j].classList.toggle("ativo",tabs[j].getAttribute("data-ref-tab")===nova);
renderTabela();
}
var tabs=shell.querySelectorAll("[data-ref-tab]");
for(var k=0;k&lt;tabs.length;k++){
tabs[k].onclick=function(){ativarTab(this.getAttribute("data-ref-tab"));};
}
var inp=document.getElementById("buscaPainelRefEM");
inp.oninput=function(){busca=String(this.value||"").toLowerCase().trim();renderTabela();};
renderTabela();
}
var antigaIrPara=window.irPara;
if(typeof antigaIrPara==="function"&amp;&amp;!window.irParaPainelRefPatchedEM){
window.irParaPainelRefPatchedEM=true;
window.irPara=function(pagina){
var r=antigaIrPara.apply(this,arguments);
if(pagina==="painel-empresa")setTimeout(window.montarPainelReferenciaRecrutadorEM,120);
return r;
};
}
document.addEventListener("DOMContentLoaded",function(){setTimeout(window.montarPainelReferenciaRecrutadorEM,500);});
window.addEventListener("load",function(){setTimeout(window.montarPainelReferenciaRecrutadorEM,700);});
})();
//