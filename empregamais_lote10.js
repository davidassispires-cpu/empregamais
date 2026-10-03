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
/* v241: construtor legado do painel removido da execução.
   Este bloco era uma segunda implementação completa do dashboard e podia
   substituir o painel novo. As rotinas de ações permanecem nos demais módulos. */
window.montarPainelReferenciaRecrutadorEM=function(){
  return document.getElementById("painelReferenciaRecrutadorEM")||
         document.getElementById("emPainelRecrutadorNovoV1")||null;
};

(function(){
var css="/* EmpregaMais v225 - gestão de processos seletivos */\n.recrutador-processos-head-v225{display:flex;align-items:center;justify-content:space-between;gap:28px;padding:28px 30px 22px;margin:0 0 0;background:#fff;border:1px solid #dbe7ed;border-bottom:0;border-radius:18px 18px 0 0}.recrutador-processos-head-v225>div{min-width:0}.recrutador-processos-kicker-v225{display:block;margin-bottom:7px;font-size:11px;font-weight:800;letter-spacing:1.4px;color:#007f89}.recrutador-processos-head-v225 h2{margin:0 0 5px;font-size:25px;line-height:1.15;color:#003b55}.recrutador-processos-head-v225 p{margin:0;color:#698494;font-size:14px}.recrutador-todas-vagas-v225{flex:0 0 auto;border:1px solid #c9dce5;background:#fff;color:#004a64;border-radius:10px;padding:12px 17px;font-weight:800;cursor:pointer}.recrutador-todas-vagas-v225:hover{background:#f5fafc;border-color:#9fc1cf}.recrutador-processos-head-v225+.recrutador-vagas-box-ref-em{border-top-left-radius:0;border-top-right-radius:0;margin-top:0}.recrutador-vagas-box-ref-em.modo-todas-v225{box-shadow:0 10px 28px rgba(0,57,77,.08)}@media(max-width:760px){.recrutador-processos-head-v225{align-items:flex-start;flex-direction:column;padding:22px 20px}.recrutador-todas-vagas-v225{width:100%}.recrutador-processos-head-v225 h2{font-size:22px}}\n\n/* EmpregaMais v226 - hero corporativo leve do painel da empresa */\n#pagina-painel-empresa .recrutador-boasvindas-ref-em{position:relative;background:#fff!important;border:1px solid #d7e5eb!important;border-top:5px solid #0b6673!important;border-radius:16px!important;box-shadow:0 8px 24px rgba(0,58,76,.06)!important;color:#123f52!important;padding:28px 32px!important;overflow:hidden}\n#pagina-painel-empresa .recrutador-boasvindas-ref-em:before{content:\"PAINEL DA EMPRESA\";display:block;margin-bottom:10px;color:#0b6673;font-size:11px;font-weight:800;letter-spacing:1.35px}\n#pagina-painel-empresa .recrutador-boasvindas-topo-ref-em{align-items:flex-start!important;gap:28px!important}\n#pagina-painel-empresa .recrutador-boasvindas-topo-ref-em h2{color:#073f56!important;font-size:29px!important;line-height:1.18!important;margin:0 0 7px!important;font-weight:750!important}\n#pagina-painel-empresa .recrutador-boasvindas-topo-ref-em p{color:#647f8d!important;font-size:14px!important;line-height:1.55!important;max-width:650px!important}\n#pagina-painel-empresa .recrutador-publicar-ref-em{background:#0b6673!important;color:#fff!important;border:1px solid #0b6673!important;border-radius:9px!important;box-shadow:none!important;font-weight:700!important;padding:12px 18px!important}\n#pagina-painel-empresa .recrutador-publicar-ref-em:hover{background:#084f5a!important;border-color:#084f5a!important}\n#pagina-painel-empresa .recrutador-boasvindas-ref-em .gerenciar-v122,#pagina-painel-empresa .recrutador-boasvindas-ref-em [class*=\"gerenciar\"]{background:#fff!important;color:#0b6673!important;border-color:#9fc3cc!important;box-shadow:none!important}\n#pagina-painel-empresa .plano-resumo-v122,#pagina-painel-empresa .recursos-plano-v122,#pagina-painel-empresa .plano-premium-v44{background:#f6fafb!important;border:1px solid #d6e5ea!important;color:#234e60!important;box-shadow:none!important}\n#pagina-painel-empresa .plano-resumo-v122 strong,#pagina-painel-empresa .recursos-plano-v122 strong,#pagina-painel-empresa .plano-premium-v44 strong{color:#073f56!important}\n#pagina-painel-empresa .recrutador-boasvindas-ref-em .recrutador-cards-ref-em{margin-top:22px!important}\n@media(max-width:760px){#pagina-painel-empresa .recrutador-boasvindas-ref-em{padding:22px 20px!important;border-top-width:4px!important}#pagina-painel-empresa .recrutador-boasvindas-topo-ref-em{flex-direction:column!important}#pagina-painel-empresa .recrutador-boasvindas-topo-ref-em h2{font-size:24px!important}#pagina-painel-empresa .recrutador-publicar-ref-em{width:100%!important}}\n\n/* EmpregaMais v227 - indicadores de desempenho do recrutamento */\n.recrutador-desempenho-v227{margin-top:20px;padding-top:18px;border-top:1px solid #e1ebef}.recrutador-desempenho-head-v227{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:12px}.recrutador-desempenho-head-v227 strong{display:block;color:#123f52;font-size:14px}.recrutador-desempenho-head-v227 span{display:block;color:#7b919c;font-size:11px;margin-top:3px}.periodo-v227{border:1px solid #d5e4e9;background:#f7fafb;border-radius:8px;padding:7px 10px!important;color:#456675!important;font-weight:650;white-space:nowrap}.recrutador-mini-grid-v227{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.recrutador-mini-v227{min-width:0;background:#f8fbfc;border:1px solid #dce8ec;border-radius:11px;padding:12px 14px}.recrutador-mini-v227>span{display:block;color:#627e8b;font-size:11px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.recrutador-mini-v227>strong{display:block;margin:4px 0 1px;color:#073f56;font-size:20px;line-height:1.15}.recrutador-mini-v227>small{display:block;color:#8a9da6;font-size:10px}.recrutador-mini-v227.destaque{border-color:#b9d7dc;background:#f4fafa}.recrutador-mini-v227 .nome-vaga-v227{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:7px}@media(max-width:1050px){.recrutador-mini-grid-v227{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.recrutador-desempenho-head-v227{align-items:flex-start;flex-direction:column}.recrutador-mini-grid-v227{grid-template-columns:1fr}.periodo-v227{align-self:flex-start}}\n";
function instalarEstilosV228(){var id="empregamais-painel-v228";var old=document.getElementById(id);if(old)old.remove();var s=document.createElement("style");s.id=id;s.textContent=css;document.head.appendChild(s);}
function reforcarPainelV228(){instalarEstilosV228();}
/* v238: a rotina antiga chamava montarPainelReferenciaRecrutadorEM novamente em
   250/900/1200/2600ms. Isso reconstruía o DOM e substituía o painel novo.
   Mantemos apenas os estilos; a montagem do painel fica a cargo do fluxo canônico. */
window.EmpregaMaisPainelV228=reforcarPainelV228;
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",reforcarPainelV228);else reforcarPainelV228();
})();


/* EmpregaMais v231 - cards executivos centralizados */
(function(){var id='empregamais-cards-executivos-v231';function instalar(){var s=document.getElementById(id);if(s)s.remove();s=document.createElement('style');s.id=id;s.textContent="\n#pagina-painel-empresa .recrutador-cards-ref-em{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:12px!important;margin-top:20px!important}\n#pagina-painel-empresa .recrutador-card-ref-em{position:relative!important;min-width:0!important;min-height:132px!important;padding:17px 12px 15px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:0!important;text-align:center!important;background:#fff!important;border:1px solid #d9e5ec!important;border-radius:15px!important;box-shadow:0 4px 15px rgba(12,62,91,.045)!important;overflow:hidden!important}\n#pagina-painel-empresa .recrutador-card-ref-em:before{content:\"\";position:absolute;top:0;left:50%;width:48px;height:3px;transform:translateX(-50%);border-radius:0 0 5px 5px;background:#1976b2}\n#pagina-painel-empresa .recrutador-card-ref-em:nth-child(2):before{background:#d78924}\n#pagina-painel-empresa .recrutador-card-ref-em:nth-child(3):before{background:#6953ad}\n#pagina-painel-empresa .recrutador-card-ref-em:nth-child(4):before{background:#168267}\n#pagina-painel-empresa .recrutador-card-ref-em:nth-child(5):before{background:#e26716}\n#pagina-painel-empresa .recrutador-card-icone-ref-em{width:38px!important;height:38px!important;min-width:38px!important;margin:0 auto 9px!important;padding:0!important;display:grid!important;place-items:center!important;border:0!important;border-radius:11px!important;background:#edf6fc!important;color:#176d9d!important;font-size:18px!important;line-height:1!important;box-shadow:none!important}\n#pagina-painel-empresa .recrutador-card-ref-em:nth-child(2) .recrutador-card-icone-ref-em{background:#fff5e8!important;color:#bd7113!important}\n#pagina-painel-empresa .recrutador-card-ref-em:nth-child(3) .recrutador-card-icone-ref-em{background:#f2effb!important;color:#6750a4!important}\n#pagina-painel-empresa .recrutador-card-ref-em:nth-child(4) .recrutador-card-icone-ref-em{background:#eaf8f3!important;color:#13745d!important}\n#pagina-painel-empresa .recrutador-card-ref-em:nth-child(5) .recrutador-card-icone-ref-em{background:#fff0e7!important;color:#d95e0c!important}\n#pagina-painel-empresa .recrutador-card-icone-ref-em svg{width:19px!important;height:19px!important;display:block!important;fill:none!important;stroke:currentColor!important;stroke-width:1.7!important;stroke-linecap:round!important;stroke-linejoin:round!important}\n#pagina-painel-empresa .recrutador-card-ref-em>div:last-child{width:100%!important;display:flex!important;flex-direction:column!important;align-items:center!important}\n#pagina-painel-empresa .recrutador-card-ref-em strong{display:block!important;margin:0 0 5px!important;font-size:28px!important;line-height:1!important;font-weight:800!important;letter-spacing:-.8px!important;color:#0b527e!important;text-align:center!important}\n#pagina-painel-empresa .recrutador-card-ref-em span{display:block!important;margin:0!important;font-size:9.5px!important;line-height:1.2!important;font-weight:800!important;letter-spacing:.045em!important;text-transform:uppercase!important;color:#5e7583!important;text-align:center!important}\n#pagina-painel-empresa .recrutador-card-ref-em:hover{transform:translateY(-2px)!important;border-color:#bfd3df!important;box-shadow:0 8px 22px rgba(12,62,91,.075)!important}\n@media(max-width:1050px){#pagina-painel-empresa .recrutador-cards-ref-em{grid-template-columns:repeat(3,1fr)!important}}\n@media(max-width:760px){#pagina-painel-empresa .recrutador-cards-ref-em{grid-template-columns:repeat(2,1fr)!important}#pagina-painel-empresa .recrutador-card-ref-em{min-height:122px!important}}\n@media(max-width:430px){#pagina-painel-empresa .recrutador-cards-ref-em{grid-template-columns:1fr!important}}\n";document.head.appendChild(s)}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',instalar);else instalar();window.addEventListener('load',function(){setTimeout(instalar,400)});})();
