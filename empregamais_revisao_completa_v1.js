/* EmpregaMais - Revisão completa da vaga v1
   Amplia apenas o conteúdo da prévia/revisão. Não altera envio/publicação. */
(function(){
"use strict";
if(window.__EM_REVISAO_COMPLETA_V1)return;
window.__EM_REVISAO_COMPLETA_V1=true;
function el(id){return document.getElementById(id)}
function val(id){var x=el(id);return x?String(x.value||"").trim():""}
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
function bloco(t,v){v=String(v||"").trim();return v?'<div class="preview-vaga-bloco"><h3>'+esc(t)+'</h3><p>'+esc(v)+'</p></div>':""}
function chip(v){v=String(v||"").trim();return v?'<span>'+esc(v)+'</span>':""}
function endereco(){
 var modo=(document.querySelector('input[name="visibilidadeEnderecoVaga"]:checked')||document.querySelector('input[name="visibilidadeEndereco"]:checked')||{}).value||"";
 var rua=val("ruaVagaV130")||val("ruaVaga"), bairro=val("bairroVagaV130")||val("bairroVaga");
 var cidade=val("cidadeVaga"), estado=val("estadoVaga");
 if(/completo|endereco|local/i.test(modo) && rua)return [rua,bairro,cidade,estado].filter(Boolean).join(" · ");
 if(/bairro/i.test(modo) && bairro)return [bairro,cidade,estado].filter(Boolean).join(" · ");
 return [cidade,estado].filter(Boolean).join(" · ");
}
function formacoes(){
 try{
  if(Array.isArray(window.formacoesAceitas)&&window.formacoesAceitas.length)return window.formacoesAceitas;
 }catch(e){}
 var x=el("formacoesAceitasVaga")||el("areasFormacaoVaga")||el("formacoesAceitas");
 if(x&&x.value)return String(x.value).split(/[,;|]/).map(function(s){return s.trim()}).filter(Boolean);
 return [];
}
function aplicar(){
 var modal=el("modalPreviewEstavel"), box=el("conteudoPreviewEstavel");
 if(!modal||!box||!modal.classList.contains("ativo"))return;
 if(box.dataset.revisaoCompletaV1==="1")return;
 var cargo=val("cargoVaga"); if(!cargo)return;
 var conf=el("vagaConfidencialEM"), confidencial=!!(conf&&conf.checked);
 var empresa=confidencial?"Empresa confidencial":(val("empresaVaga")||((el("nomeEmpresaTopo")||{}).textContent)||"Empresa");
 var salario=val("salarioVaga");
 var salarioTxt=salario;
 try{if(salario&&typeof formatarSalarioExibicao==="function")salarioTxt=formatarSalarioExibicao(salario)}catch(e){}
 if(!salarioTxt)salarioTxt="A combinar";
 var beneficios=[];
 try{if(typeof beneficiosTagsSelecionados==="function")beneficios=beneficiosTagsSelecionados()||[]}catch(e){}
 var fs=formacoes();
 var meta=chip(endereco())+chip(val("modalidadeVaga"))+chip(val("contratoVaga"))+chip(val("areaVaga"))+
          chip(val("escolaridadeVaga"))+chip(val("experienciaVaga"))+chip(val("jornadaVaga"))+chip(val("pcdVaga"));
 var html='<div class="preview-vaga-empresa">'+esc(String(empresa).trim())+'</div>'+
          '<h2>'+esc(cargo)+'</h2><div class="preview-vaga-meta">'+meta+'</div>'+
          '<div class="preview-vaga-salario">Salário: '+esc(salarioTxt)+'</div>'+
          bloco("Descrição da vaga",val("descricaoVaga"))+
          bloco("Requisitos",val("requisitosVaga"));
 if(fs.length)html+='<div class="preview-vaga-bloco"><h3>Áreas de formação aceitas</h3><div class="beneficios-tags">'+fs.map(chip).join("")+'</div></div>';
 var benefTexto=val("beneficiosVaga");
 if(benefTexto||beneficios.length)html+='<div class="preview-vaga-bloco"><h3>Benefícios</h3>'+(benefTexto?'<p>'+esc(benefTexto)+'</p>':"")+(beneficios.length?'<div class="beneficios-tags">'+beneficios.map(chip).join("")+'</div>':"")+'</div>';
 html+=bloco("Sobre a empresa",val("sobreEmpresaVaga"));
 box.innerHTML=html;
 box.dataset.revisaoCompletaV1="1";
 var aviso=document.createElement("div"); aviso.className="aviso-revisao-v223";
 aviso.innerHTML='<strong>Revise os dados da vaga.</strong> Confira as informações abaixo. A vaga só será enviada depois da sua confirmação e ficará <strong>aguardando aprovação do administrador</strong>.';
 box.insertBefore(aviso,box.firstChild);
}
var obs=new MutationObserver(function(){
 var box=el("conteudoPreviewEstavel"); if(box)delete box.dataset.revisaoCompletaV1;
 setTimeout(aplicar,0);
});
function iniciar(){
 var m=el("modalPreviewEstavel"); if(m)obs.observe(m,{attributes:true,attributeFilter:["class","aria-hidden"]});
 document.addEventListener("click",function(e){
  if(e.target&&e.target.closest&&e.target.closest("#btnSalvarVaga"))setTimeout(aplicar,60);
 },true);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",iniciar);else iniciar();
})();