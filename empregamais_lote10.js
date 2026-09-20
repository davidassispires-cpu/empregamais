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
var proprias=[];
try{
 if(typeof vagasDaEmpresa==="function"){
  proprias=vagasDaEmpresa()||[];
  if(Array.isArray(proprias)&&proprias.length)return proprias;
 }
}catch(e){}
var todas=[];
try{todas=typeof carregarVagasPortal==="function"?(carregarVagasPortal()||[]):[];}catch(e){todas=[];}
if(!Array.isArray(todas))return [];
try{
 if(typeof vagaPertenceEmpresaAtual==="function"){
  return todas.filter(function(v){
   try{return vagaPertenceEmpresaAtual(v);}catch(x){return false;}
  });
 }
}catch(e){}
return proprias;
}
function candidaturasRefEM(){
try{return typeof carregarCandidaturas==="function"?(carregarCandidaturas()||[]):[];}catch(e){return[];}
}
function idVagaCandRefEM(c){
return String(c&&(
 c.vagaId||c.idVaga||c.vaga_id||c.jobId||c.job_id||
 (c.vaga&&c.vaga.id)||""
)||"");
}
function pertenceRefEM(c,ids){
return ids.indexOf(idVagaCandRefEM(c))>=0;
}
function abrirCandRefEM(id){
var vagaId=String(id||"");
if(!vagaId)return;
try{
 var vagas=vagasEmpresaRefEM();
 var pertence=vagas.some(function(v){return String(v&&v.id||"")===vagaId;});
 if(!pertence){alert("Não foi possível localizar esta vaga entre as vagas da empresa.");return;}
}catch(e){}
try{sessionStorage.setItem("vagaCandidatosSelecionada",vagaId);}catch(e){}
if(typeof abrirCandidatosDaVaga==="function"){abrirCandidatosDaVaga(vagaId);return;}
if(typeof irPara==="function"){
 irPara("candidatos-empresa");
 setTimeout(function(){
  try{document.dispatchEvent(new CustomEvent("empregamais:filtrar-candidaturas",{detail:{vagaId:vagaId}}));}catch(e){}
 },80);
}
}
function normEtapaCandRefEM(v){
var s=String(v||"").trim().toLowerCase();
try{s=s.normalize("NFD").replace(/[\u0300-\u036f]/g,"");}catch(e){}
var mapa={
 "candidatura enviada":"em avaliacao","enviada":"em avaliacao","pendente":"em avaliacao",
 "em analise":"em avaliacao","em avaliacao":"em avaliacao","avaliacao":"em avaliacao",
 "selecionada":"selecionado","selecionado":"selecionado",
 "contato":"em contato","em contato":"em contato",
 "entrevista":"entrevista","em entrevista":"entrevista",
 "aprovada":"aprovado","aprovado":"aprovado",
 "rejeitada":"reprovado","rejeitado":"reprovado","reprovada":"reprovado","reprovado":"reprovado",
 "contratada":"contratado","contratado":"contratado"
};
return mapa[s]||s||"em avaliacao";
}
window.EmpregaMaisEtapasCandidatoEM={
ordem:["em avaliacao","selecionado","em contato","entrevista","aprovado","reprovado","contratado"],
normalizar:normEtapaCandRefEM
};
function idCandRefEM(c){
return String(c&&(c.id||c.candidaturaId||c.candidatura_id||c.applicationId||c.application_id)||"");
}
function salvarEtapaCandLocalRefEM(id,etapa){
var lista=candidaturasRefEM(),alvo=null,idx=-1;
if(!Array.isArray(lista))lista=[];
for(var i=0;i<lista.length;i++){
 if(String(idCandRefEM(lista[i]))===String(id)){idx=i;alvo=lista[i];break;}
}
if(idx<0)return false;
var normal=normEtapaCandRefEM(etapa);
alvo.status=normal;
alvo.etapa=normal;
alvo.statusProcesso=normal;
alvo.status_processo=normal;
alvo.atualizadoEm=new Date().toISOString();
try{
 if(typeof salvarCandidaturas==="function")salvarCandidaturas(lista);
 else localStorage.setItem("candidaturasEmpregaMais",JSON.stringify(lista));
}catch(e){return false;}
return true;
}
window.atualizarEtapaCandidaturaEM=async function(id,etapa){
var normal=normEtapaCandRefEM(etapa);
if(window.EmpregaMaisEtapasCandidatoEM.ordem.indexOf(normal)<0)throw new Error("Etapa de recrutamento inválida.");
var confirmado=false,resp=null;
try{
 if(typeof apiEmpregaMaisPost==="function"){
  resp=await apiEmpregaMaisPost({acao:"atualizar_candidatura",id:id,status:normal,etapa:normal});
  confirmado=!!(resp&&resp.sucesso===true);
 }
}catch(e){}
if(typeof apiEmpregaMaisPost==="function"&&!confirmado)throw new Error((resp&&resp.erro)||"O servidor não confirmou a alteração.");
if(!salvarEtapaCandLocalRefEM(id,normal))throw new Error("Não foi possível localizar a candidatura.");
try{document.dispatchEvent(new CustomEvent("empregamais:candidatura-atualizada",{detail:{id:String(id),status:normal}}));}catch(e){}
try{if(typeof montarPainelReferenciaRecrutadorEM==="function")montarPainelReferenciaRecrutadorEM();}catch(e){}
return true;
};
function curriculoCandRefEM(c){
if(!c)return null;
var url=c.curriculoUrl||c.curriculo_url||c.cvUrl||c.cv_url||c.arquivoCurriculo||c.arquivo_curriculo||"";
var online=c.curriculo||c.curriculoOnline||c.curriculo_online||c.cv||null;
return {url:String(url||""),online:online};
}
function marcarCurriculoVisualizadoRefEM(c){
var id=idCandRefEM(c);if(!id)return false;
/* Só a empresa dona da vaga pode registrar a visualização do currículo. */
try{
 var vagaId=idVagaCandRefEM(c),vagas=vagasEmpresaRefEM();
 if(!vagaId||!vagas.some(function(v){return String(v&&v.id||"")===String(vagaId);})){return false;}
}catch(e){return false;}
var lista=candidaturasRefEM();if(!Array.isArray(lista))return false;
var idx=lista.findIndex(function(x){return idCandRefEM(x)===id;});if(idx<0)return false;
var agora=new Date().toISOString();
lista[idx].visualizada=true;
lista[idx].curriculo_visualizado=true;
lista[idx].visualizado_em=lista[idx].visualizado_em||agora;
lista[idx].visualizadoEm=lista[idx].visualizadoEm||agora;
try{
 if(typeof salvarCandidaturas==="function")salvarCandidaturas(lista);
 else localStorage.setItem("candidaturasEmpregaMais",JSON.stringify(lista));
}catch(e){return false;}
try{
 if(typeof apiEmpregaMaisPost==="function"){
  apiEmpregaMaisPost({acao:"visualizar_candidatura",id:id,visualizada:true,visualizado_em:agora}).catch(function(){});
 }
}catch(e){}
try{document.dispatchEvent(new CustomEvent("empregamais:candidatura-atualizada",{detail:{id:id,visualizada:true}}));}catch(e){}
return true;
}
window.abrirCurriculoCandidaturaEM=function(candidatura){
if(!candidatura)return false;
var cv=curriculoCandRefEM(candidatura);
if(!marcarCurriculoVisualizadoRefEM(candidatura)){
 alert("Não foi possível validar esta candidatura para a empresa conectada.");return false;
}
if(cv.url){
 try{window.open(cv.url,"_blank","noopener");return true;}catch(e){}
}
if(cv.online){
 try{
  if(typeof abrirCurriculoCandidato==="function"){abrirCurriculoCandidato(candidatura);return true;}
  if(typeof visualizarCurriculoCandidato==="function"){visualizarCurriculoCandidato(candidatura);return true;}
 }catch(e){}
}
alert("Esta candidatura não possui currículo anexado ou currículo online disponível.");
return false;
};
function dadosContatoCandRefEM(c){
var vagaId=idVagaCandRefEM(c),vaga=null;
try{vaga=vagasEmpresaRefEM().find(function(v){return String(v&&v.id||"")===String(vagaId);})||null;}catch(e){}
var nome=String(c&& (c.nome||c.candidatoNome||c.candidato_nome||c.nomeCandidato)||"candidato(a)").trim();
var empresa=String(vaga&&(vaga.empresa||vaga.empresaNome)||"nossa empresa").trim();
var cargo=String(vaga&&(vaga.cargo||vaga.titulo)||c&&(c.cargoVaga||c.vaga||c.titulo)||"oportunidade").trim();
var tel=String(c&&(c.whatsapp||c.telefone||c.celular||c.phone)||"").replace(/\D/g,"");
var email=String(c&&(c.email||c.candidato_email||c.candidatoEmail)||"").trim();
var msg="Olá, "+nome+"! Meu nome é [SEU NOME] e falo em nome da "+empresa+". Recebemos seu currículo pelo EmpregaMais para a vaga de "+cargo+" e gostaríamos de conversar com você sobre o processo seletivo.";
return{vaga:vaga,nome:nome,empresa:empresa,cargo:cargo,telefone:tel,email:email,mensagem:msg};
}
window.contatarCandidatoEmpregaMais=async function(candidatura,canal){
if(!candidatura)return false;
var d=dadosContatoCandRefEM(candidatura);
if(!d.vaga){alert("Não foi possível validar a vaga desta candidatura.");return false;}
var ch=String(canal||"").toLowerCase(),destino="";
if(ch==="whatsapp"){
 if(!d.telefone){alert("O candidato não possui WhatsApp/telefone cadastrado.");return false;}
 var n=d.telefone;if(n.length===10||n.length===11)n="55"+n;
 destino="https://wa.me/"+n+"?text="+encodeURIComponent(d.mensagem);
}else if(ch==="email"){
 if(!d.email){alert("O candidato não possui e-mail cadastrado.");return false;}
 destino="mailto:"+encodeURIComponent(d.email)+"?subject="+encodeURIComponent("Processo seletivo - "+d.cargo)+"&body="+encodeURIComponent(d.mensagem);
}else if(ch==="ligacao"||ch==="telefone"){
 if(!d.telefone){alert("O candidato não possui telefone cadastrado.");return false;}
 destino="tel:+"+(d.telefone.length===10||d.telefone.length===11?"55":"")+d.telefone;
}else{alert("Selecione WhatsApp, e-mail ou ligação.");return false;}
var idCand=idCandRefEM(candidatura);
if(idCand){
 try{await window.atualizarEtapaCandidaturaEM(idCand,"em contato");}
 catch(e){console.warn("EmpregaMais - contato aberto sem atualização de etapa:",e);}
}
try{
 var registro={id:idCand,vagaId:idVagaCandRefEM(candidatura),canal:ch,data:new Date().toISOString()};
 var hist=JSON.parse(localStorage.getItem("empregaMaisHistoricoContatos")||"[]");
 if(!Array.isArray(hist))hist=[];
 hist.push(registro);if(hist.length>500)hist=hist.slice(-500);
 localStorage.setItem("empregaMaisHistoricoContatos",JSON.stringify(hist));
}catch(e){}
if(ch==="whatsapp"){window.open(destino,"_blank","noopener");}else{window.location.href=destino;}
return true;
};
window.mensagemContatoCandidatoEmpregaMais=function(candidatura){
return dadosContatoCandRefEM(candidatura).mensagem;
};
window.registrarContratacaoEmpregaMais=async function(candidatura){
if(!candidatura)return false;
var id=idCandRefEM(candidatura),vagaId=idVagaCandRefEM(candidatura);
if(!id||!vagaId){alert("Não foi possível identificar a candidatura ou a vaga.");return false;}
var vaga=null;
try{vaga=vagasEmpresaRefEM().find(function(v){return String(v&&v.id||"")===String(vagaId);})||null;}catch(e){}
if(!vaga){alert("Esta candidatura não pertence a uma vaga da empresa conectada.");return false;}
var agora=new Date().toISOString(),resp=null;
try{
 if(typeof apiEmpregaMaisPost==="function"){
  resp=await apiEmpregaMaisPost({acao:"registrar_contratacao",candidaturaId:id,vagaId:vagaId,dataContratacao:agora});
  if(!resp||resp.sucesso!==true)throw new Error((resp&&resp.erro)||"Contratação não confirmada pelo servidor.");
 }
 await window.atualizarEtapaCandidaturaEM(id,"contratado");
}catch(e){alert(e&&e.message?e.message:"Não foi possível registrar a contratação.");return false;}
var lista=candidaturasRefEM();
if(Array.isArray(lista)){
 var pos=lista.findIndex(function(x){return idCandRefEM(x)===String(id);});
 if(pos>=0){
  lista[pos].contratadoPeloEmpregaMais=true;
  lista[pos].contratado_pelo_empregamais=true;
  lista[pos].dataContratacao=agora;
  lista[pos].data_contratacao=agora;
  try{
   if(typeof salvarCandidaturas==="function")salvarCandidaturas(lista);
   else localStorage.setItem("candidaturasEmpregaMais",JSON.stringify(lista));
  }catch(e){}
 }
}
try{
 var hist=JSON.parse(localStorage.getItem("empregaMaisContratacoes")||"[]");if(!Array.isArray(hist))hist=[];
 if(!hist.some(function(x){return String(x.candidaturaId||"")===String(id);})){
  hist.push({candidaturaId:String(id),vagaId:String(vagaId),empresaCnpj:vaga.empresaCnpj||vaga.cnpj||"",cargo:vaga.cargo||vaga.titulo||"",dataContratacao:agora});
  localStorage.setItem("empregaMaisContratacoes",JSON.stringify(hist));
 }
}catch(e){}
try{if(typeof montarPainelReferenciaRecrutadorEM==="function")montarPainelReferenciaRecrutadorEM();}catch(e){}
try{if(typeof carregarEmpresasMasterEM==="function")carregarEmpresasMasterEM();}catch(e){}
try{document.dispatchEvent(new CustomEvent("empregamais:contratacao-registrada",{detail:{candidaturaId:String(id),vagaId:String(vagaId),data:agora}}));}catch(e){}
return true;
};
function verVagaRefEM(id){
if(typeof abrirVaga==="function"){abrirVaga(id);return;}
if(typeof abrirDetalheVaga==="function"){abrirDetalheVaga(id);return;}
}
function editarVagaRefEM(id){
var vaga=null;
try{
 var lista=typeof carregarVagasPortal==="function"?(carregarVagasPortal()||[]):[];
 if(Array.isArray(lista))vaga=lista.find(function(v){return String(v&&v.id||"")===String(id||"");})||null;
}catch(e){}
if(!vaga){alert("Não foi possível localizar esta vaga para edição.");return;}
try{
 if(typeof vagaPertenceEmpresaAtual==="function"&&!vagaPertenceEmpresaAtual(vaga)){
  alert("Esta vaga não pertence à empresa conectada.");return;
 }
}catch(e){}
try{sessionStorage.setItem("empregaMaisVagaEdicaoId",String(id));}catch(e){}
try{
 var oculto=document.getElementById("vagaEditandoId");
 if(!oculto){
  oculto=document.createElement("input");oculto.type="hidden";oculto.id="vagaEditandoId";oculto.name="vagaEditandoId";
  var form=document.getElementById("formVaga");if(form)form.appendChild(oculto);
 }
 if(oculto)oculto.value=String(id);
}catch(e){}
try{window.vagaEdicaoId=String(id);}catch(e){}
if(typeof editarVagaEmpresa==="function"){editarVagaEmpresa(id);return;}
if(typeof editarVaga==="function"){editarVaga(id);return;}
alert("A edição desta vaga ainda não está disponível nesta versão.");
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
var s=normEtapaCandRefEM(c.status_processo||c.statusProcesso||c.etapa||c.status);
return ["selecionado","em contato","entrevista","aprovado"].indexOf(s)>=0;
}).length;
var contratados=cs.filter(function(c){
return normEtapaCandRefEM(c.status_processo||c.statusProcesso||c.etapa||c.status)==="contratado";
}).length;
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
/* Mantém apenas a navegação protegida principal. Recursos auxiliares
   escutam um evento central, sem empilhar novas sobrescritas de irPara. */
if(!window.EmpregaMaisNavegacaoCentralEM){
window.EmpregaMaisNavegacaoCentralEM=function(pagina){
try{document.dispatchEvent(new CustomEvent("empregamais:navegacao",{detail:{pagina:String(pagina||"")}}));}catch(e){}
};
}
document.addEventListener("empregamais:navegacao",function(ev){
var pagina=String((ev&&ev.detail&&ev.detail.pagina)||"");
if(pagina==="painel-empresa")setTimeout(window.montarPainelReferenciaRecrutadorEM,120);
});
document.addEventListener("DOMContentLoaded",function(){setTimeout(window.montarPainelReferenciaRecrutadorEM,500);});
window.addEventListener("load",function(){setTimeout(window.montarPainelReferenciaRecrutadorEM,700);});
})();
//