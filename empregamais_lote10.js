/* EmpregaMais - JavaScript externo - lote 10 */

//
(function(){
function txtRefEM(v){
var s=String(v==null?"":v);
if(typeof escaparTexto==="function")return escaparTexto(s);
return s.replace(/&amp;/g,"&amp;amp;").replace(/</g,"&amp;lt;").replace(/>/g,"&amp;gt;").replace(/"/g,"&amp;quot;");
}
function dataRefEM(v){
var s=String(v||"");
var m=s.match(/^(\d{4})-(\d{2})-(\d{2})/);
return m?(m[3]+"/"+m[2]+"/"+m[1]):(s||"-");
}
function valorRefEM(v,campos,padrao){
for(var i=0;i<campos.length;i++){
if(v[campos[i]]!==undefined&&v[campos[i]]!==null&&String(v[campos[i]]).trim()!=="")return v[campos[i]];
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
return ids.indexOf(String(c.vagaId||c.idVaga||""))>=0;
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
function normStatusRefEM(v){
return String(v==null?"":v).trim().toLowerCase()
.normalize?String(v==null?"":v).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""):String(v==null?"":v).trim().toLowerCase();
}
function aprovacaoRefEM(v){
var a=normStatusRefEM(v.aprovacao||v.statusAprovacao||v.status_aprovacao||v.approvalStatus||"");
var st=normStatusRefEM(v.status||"");
if(a==="aprovado")a="aprovada";
if(a==="reprovada"||a==="reprovado")a="rejeitada";
if(a==="aguardando aprovacao"||a==="em analise")a="pendente";
if(!a){
 if(st==="pendente"||st==="em analise")a="pendente";
 else if(st==="aprovada"||st==="aprovado"||st==="publicada"||st==="ativa")a="aprovada";
 else if(st==="rejeitada"||st==="reprovada"||st==="reprovado")a="rejeitada";
}
return a;
}
function encerradaRefEM(v){
var st=normStatusRefEM(v.status||"");
return st==="encerrada"||st==="excluida"||st==="cancelada"||v.ativa===false;
}
var aprovadas=vagas.filter(function(v){
return !encerradaRefEM(v)&&aprovacaoRefEM(v)==="aprovada";
});
var pendentes=vagas.filter(function(v){
return !encerradaRefEM(v)&&aprovacaoRefEM(v)==="pendente";
});
var encerradas=vagas.filter(function(v){
return encerradaRefEM(v);
});
var processo=cs.filter(function(c){
var s=String(c.status||"").toLowerCase();
return s.indexOf("entrevista")>=0||s==="selecionado"||s==="aprovado"||s.indexOf("pr\u00e9-selecionado")>=0;
}).length;
var contratados=cs.filter(function(c){return String(c.status||"").toLowerCase()==="contratado";}).length;
var shell=document.createElement("div");
shell.id="painelReferenciaRecrutadorEM";
shell.className="recrutador-shell-ref-em";
shell.innerHTML=
"<aside class='recrutador-sidebar-ref-em sidebar-v124'>"+
"<div class='sidebar-marca-v124'><span class='sidebar-logo-v124'>E+</span><span><b>Emprega<span>Mais</span></b><small>PARA EMPRESAS</small></span></div>"+
"<button class='ativo' type='button' data-ref-nav='painel'><span class='icone-ref-em'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M3 11.5 12 4l9 7.5M5.5 10v10h13V10M9 20v-6h6v6'/></svg></span>Visão geral</button>"+
"<button type='button' data-ref-nav='aprovadas'><span class='icone-ref-em'><svg viewBox='0 0 24 24' aria-hidden='true'><rect x='3' y='7' width='18' height='13' rx='2'/><path d='M8 7V5h8v2M3 12h18M10 12v2h4v-2'/></svg></span>Minhas vagas</button>"+
"<button type='button' data-ref-nav='candidaturas'><span class='icone-ref-em'><svg viewBox='0 0 24 24' aria-hidden='true'><circle cx='9' cy='8' r='3'/><path d='M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M16 6.5a3 3 0 0 1 0 5.8M17 14a5 5 0 0 1 3.5 4.8V20'/></svg></span>Candidaturas</button>"+
"<button type='button' data-ref-nav='publicar-lateral'><span class='icone-ref-em'><svg viewBox='0 0 24 24' aria-hidden='true'><circle cx='12' cy='12' r='9'/><path d='M12 7v10M7 12h10'/></svg></span>Publicar vaga</button>"+
"<button type='button' data-ref-nav='empresa'><span class='icone-ref-em'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M4 21V4h11v17M15 9h5v12M8 8h3M8 12h3M8 16h3M18 13h.01M18 17h.01'/></svg></span>Perfil da empresa</button>"+
"<button type='button' data-ref-nav='planos'><span class='icone-ref-em'><svg viewBox='0 0 24 24' aria-hidden='true'><rect x='3' y='5' width='18' height='14' rx='2'/><path d='M3 10h18M7 15h4'/></svg></span>Planos e pagamentos</button>"+
"<button type='button' data-ref-nav='verificacao-v124'><span class='icone-ref-em'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6l8-3Z'/><path d='m8.5 12 2.2 2.2 4.8-5'/></svg></span>Verificação</button>"+
"<button type='button' data-ref-nav='config-v124'><span class='icone-ref-em'><svg viewBox='0 0 24 24' aria-hidden='true'><circle cx='12' cy='12' r='3'/><path d='M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v4H21a1.7 1.7 0 0 0-1.6 1Z'/></svg></span>Configurações</button>"+
"<button type='button' data-ref-nav='ajuda'><span class='icone-ref-em'><svg viewBox='0 0 24 24' aria-hidden='true'><circle cx='12' cy='12' r='9'/><path d='M9.7 9a2.5 2.5 0 1 1 3.8 2.1c-1 .6-1.5 1.1-1.5 2.4M12 17h.01'/></svg></span>Ajuda e suporte</button>"+
"<div class='ajuda-card-v124'><div class='headset-v124'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M4 13v-2a8 8 0 0 1 16 0v2'/><path d='M5 12H4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2v-7H5ZM19 12h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2v-7h1Z'/><path d='M18 19c-1 2-3 2-5 2'/></svg></div><strong>Precisa de ajuda?</strong><p>Nossa equipe está pronta para te atender.</p><button class='suporte-v124' type='button'>Falar com o suporte</button></div>"+
"<button class='sair-ref-em' type='button' data-ref-nav='sair'><span class='icone-ref-em'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M10 5H5v14h5M14 8l4 4-4 4M8 12h10'/></svg></span>Sair</button>"+
"</aside>"+"<main class='recrutador-main-ref-em'>"+
"<section class='recrutador-boasvindas-ref-em'>"+
"<div class='recrutador-boasvindas-topo-ref-em'>"+
"<div><h2>Ol\u00e1, "+txtRefEM(nome)+"!</h2><p>Gerencie suas vagas, acompanhe candidaturas e encontre os melhores talentos.</p></div>"+
"<button class='recrutador-publicar-ref-em' type='button' data-ref-publicar='+'>+ &nbsp; Publicar nova vaga</button>"+
"</div>"+
"<div class='recrutador-cards-ref-em'>"+
"<div class='recrutador-card-ref-em'><div class='recrutador-card-icone-ref-em'><svg viewBox='0 0 24 24' aria-hidden='true'><rect x='3' y='7' width='18' height='13' rx='2'/><path d='M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7M3 12h18M10 12v2h4v-2'/></svg></div><div><strong>"+aprovadas.length+"</strong><span>Vagas ativas</span></div></div>"+
"<div class='recrutador-card-ref-em'><div class='recrutador-card-icone-ref-em'><svg viewBox='0 0 24 24' aria-hidden='true'><circle cx='8' cy='8' r='3'/><circle cx='16.5' cy='9' r='2.5'/><path d='M2.5 19v-2a5 5 0 0 1 5-5h1a5 5 0 0 1 5 5v2M14 13h2.5a4.5 4.5 0 0 1 4.5 4.5V19'/></svg></div><div><strong>"+pendentes.length+"</strong><span>Em aprova\u00e7\u00e3o</span></div></div>"+
"<div class='recrutador-card-ref-em'><div class='recrutador-card-icone-ref-em'><svg viewBox='0 0 24 24' aria-hidden='true'><path d='M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z'/><circle cx='12' cy='12' r='2.8'/></svg></div><div><strong>"+cs.length+"</strong><span>Candidaturas</span></div></div>"+
"<div class='recrutador-card-ref-em'><div class='recrutador-card-icone-ref-em'><svg viewBox='0 0 24 24' aria-hidden='true'><rect x='5' y='3' width='14' height='18' rx='2'/><path d='M9 7h6M9 11h6M9 15h4'/></svg></div><div><strong>"+processo+"</strong><span>Em processo</span></div></div>"+
"<div class='recrutador-card-ref-em'><div class='recrutador-card-icone-ref-em'>&#10003;</div><div><strong>"+contratados+"</strong><span>Contratados</span></div></div>"+
"</div>"+
"</section>"+
"<section class='recrutador-vagas-box-ref-em'>"+
"<div class='recrutador-tabs-ref-em'>"+
"<button class='ativo' type='button' data-ref-tab='aprovadas'>Vagas aprovadas <span class='contador-ref-em'>"+aprovadas.length+"</span></button>"+
"<button type='button' data-ref-tab='pendentes'>Vagas em aprova\u00e7\u00e3o <span class='contador-ref-em'>"+pendentes.length+"</span></button>"+
"<button type='button' data-ref-tab='encerradas'>Vagas encerradas <span class='contador-ref-em'>"+encerradas.length+"</span></button>"+
"<div class='recrutador-busca-ref-em'><input type='search' id='buscaPainelRefEM' placeholder='Buscar vaga, cargo ou cidade...' /></div>"+
"</div>"+
"<div class='recrutador-tabela-wrap-ref-em'><table class='recrutador-tabela-ref-em'>"+
"<thead><tr><th>T\u00edtulo da vaga</th><th>Cidade</th><th>Modalidade</th><th>Sal\u00e1rio</th><th>Publicada em</th><th>Status</th><th>Candidaturas</th><th>A\u00e7\u00f5es</th></tr></thead>"+
"<tbody id='corpoTabelaPainelRefEM'></tbody>"+
"</table></div>"+
"<div class='recrutador-rodape-tabela-ref-em'><span id='textoRodapePainelRefEM'></span><div class='recrutador-paginacao-ref-em'><button type='button' disabled='disabled'>&#8249;</button><button class='ativo' type='button'>1</button><button type='button' disabled='disabled'></button></div></div>"+
"</section>"+
"</main>";
var filhos=pagina.children;
for(var i=0;i<filhos.length;i++){filhos[i].style.display="none";}
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
return s.indexOf(busca)>=0;
});
lista.forEach(function(v){
var titulo=valorRefEM(v,["cargo","titulo","vaga"],"Vaga");
var empresa=valorRefEM(v,["empresa","empresaNome"],"");
var cidade=valorRefEM(v,["cidade"],"-");
var uf=valorRefEM(v,["uf","estado"],"");
var local=String(cidade)+(uf&&String(cidade).toLowerCase().indexOf(String(uf).toLowerCase())<0?" - "+uf:"");
var modalidade=valorRefEM(v,["modalidade"],"-");
var salario=valorRefEM(v,["salario","sal\u00e1rio"],"A combinar");
var publicada=valorRefEM(v,["data","dataPublicacao","publicadaEm","created_at"],"");
var n=0;
try{n=typeof contarCandidaturasVaga==="function"?contarCandidaturasVaga(v.id):0;}catch(e){}
var st=aba==="pendentes"?"Em aprova\u00e7\u00e3o":(aba==="encerradas"?"Encerrada":"Ativa");
var cls=aba==="pendentes"?"pendente":(aba==="encerradas"?"encerrada":"");
var tr=document.createElement("tr");
tr.setAttribute("data-vaga-id",String(v.id||""));
tr.innerHTML=
"<td><strong>"+txtRefEM(titulo)+"</strong>"+(empresa?"<small>"+txtRefEM(empresa)+"</small>":"")+"</td>"+
"<td>"+txtRefEM(local)+"</td><td>"+txtRefEM(modalidade)+"</td><td>"+txtRefEM(salario)+"</td>"+
"<td>"+txtRefEM(dataRefEM(publicada))+"</td><td><span class='recrutador-status-ref-em "+cls+"'>"+st+"</span></td>"+
"<td><button class='recrutador-cand-ref-em' type='button'>"+n+"</button></td>"+
"<td><button class='recrutador-acao-ref-em ver' type='button'>Ver</button><button class='recrutador-acao-ref-em editar' type='button'>Editar</button>"+(aba!=="encerradas"?"<button class='recrutador-acao-ref-em encerrar' type='button'>Encerrar</button>":"")+"</td>";
tr.querySelector(".recrutador-cand-ref-em").onclick=function(){abrirCandRefEM(v.id);};
tr.querySelector(".ver").onclick=function(){verVagaRefEM(v.id);};
tr.querySelector(".editar").onclick=function(){editarVagaRefEM(v.id);};
var be=tr.querySelector(".encerrar");if(be)be.onclick=function(){encerrarVagaRefEM(v.id);};
corpo.appendChild(tr);
});
if(!lista.length)corpo.innerHTML="<tr><td class='vazio-ref-em' colspan='8'>Nenhuma vaga encontrada.</td></tr>";
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
for(var j=0;j<tabs.length;j++)tabs[j].classList.toggle("ativo",tabs[j].getAttribute("data-ref-tab")===nova);
renderTabela();
}
var tabs=shell.querySelectorAll("[data-ref-tab]");
for(var k=0;k<tabs.length;k++){
tabs[k].onclick=function(){ativarTab(this.getAttribute("data-ref-tab"));};
}
var inp=document.getElementById("buscaPainelRefEM");
inp.oninput=function(){busca=String(this.value||"").toLowerCase().trim();renderTabela();};
renderTabela();
}
var antigaIrPara=window.irPara;
if(typeof antigaIrPara==="function"&&!window.irParaPainelRefPatchedEM){
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