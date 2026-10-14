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

(function(){
 var workflow=window.EmpregaMaisEtapasCandidatura;
 // Both demonstration panels use these fictional applications, outside real account storage.
 var backing=window.localStorage,demoKey='emApplicationDemoV1';
 function demoApplications(){
  var saved;try{saved=JSON.parse(backing.getItem(demoKey)||'null');}catch(ignore){}
  if(Array.isArray(saved)&&saved.length)return saved;
  var date=new Date().toISOString(),rows=['Ana Exemplo','Bruno Exemplo','Carla Exemplo','Diego Exemplo','Elisa Exemplo','Felipe Exemplo'].map(function(name,i){return {id:'demo-c'+i,vagaId:i%2?'demo-2':'demo-1',vaga:i%2?'Analista de Recursos Humanos':'Assistente Administrativo',empresa:'Empresa Demonstração',nome:name,candidato:name,email:i===0?'ana@example.com':'candidato'+(i+1)+'@example.com',cidade:i%2?'Contagem':'Belo Horizonte',modalidade:i%2?'Híbrido':'Presencial',contrato:'CLT',status:workflow.etapas[i%3].label,data:new Date(Date.now()-i*86400000).toISOString()};});
  rows.push({id:'demo-ana-rh',vagaId:'demo-2',vaga:'Analista de Recursos Humanos',empresa:'Empresa Demonstração',nome:'Ana Exemplo',candidato:'Ana Exemplo',email:'ana@example.com',cidade:'Contagem',modalidade:'Híbrido',contrato:'CLT',status:'Entrevista agendada',data:date});
  saveDemo(rows);return rows;
 }
 function saveDemo(rows){try{backing.setItem(demoKey,JSON.stringify(rows));}catch(ignore){}document.dispatchEvent(new Event('empregamais:candidaturas-sincronizadas'));}
 workflow.demo=demoApplications;workflow.salvarDemo=saveDemo;workflow.chaveDemo=demoKey;
})();
