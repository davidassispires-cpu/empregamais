(function(){
 'use strict';
 var stages=[
  {key:'avaliacao',label:'Em avaliação',group:'Em avaliação',icon:'clock'},
  {key:'contato',label:'Em contato',group:'Em contato',icon:'message'},
  {key:'entrevista',label:'Entrevista agendada',group:'Entrevista',icon:'calendar'},
  {key:'aprovadas',label:'Aprovado',group:'Aprovados',icon:'check'},
  {key:'contratadas',label:'Contratado',group:'Contratados',icon:'briefcase'},
  {key:'reprovadas',label:'Reprovado',group:'Reprovados',icon:'close'}
 ];
 function norm(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();}
 function classify(application){
  application=application||{};
  var status=norm(typeof application==='string'?application:application.status||application.statusProcesso||application.status_processo||application.etapa||application.etapaAtual);
  if(/nao selecionad|nao aprovad|reprovad|desclassificad|encerrad/.test(status))return 'reprovadas';
  if(/contratad/.test(status))return 'contratadas';
  if(/entrevista/.test(status))return 'entrevista';
  if(/contato/.test(status))return 'contato';
  if(/aprovad|^(pre[- ]?)?selecionad|finalista|etapa final/.test(status))return 'aprovadas';
  if(!status||/avaliacao|analise|triagem|curriculo recebido|candidatura enviada|recebid/.test(status))return 'avaliacao';
  return 'outras';
 }
 function stage(application){var key=classify(application);return stages.find(function(item){return item.key===key;});}
 function group(status){var item=stage(status);return item?item.group:'Em avaliação';}
 function filter(key){var aliases={analise:'avaliacao',selecionadas:'aprovadas',finalistas:'aprovadas'};key=aliases[key]||key;return key==='todas'||stages.some(function(item){return item.key===key;})?key:'todas';}
 window.EmpregaMaisEtapasCandidatura={etapas:stages,classificar:classify,etapa:stage,grupo:group,filtro:filter};
})();
