/* Candidate-only dashboard tools. Practice answers never enter recruiter records. */
(function(global){
 'use strict';
 function norm(v){return String(v==null?'':v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
 function list(v){return (Array.isArray(v)?v:String(v||'').split(/[,;\n|]+/)).map(norm).filter(Boolean);}
 function words(v){return norm(Array.isArray(v)?v.join(' '):v).split(/[^a-z0-9]+/).filter(function(w){return w.length>2&&!/^(para|com|dos|das|uma|por|que|de|em|na|no|como|mais|anos|ano)$/.test(w);});}
 function overlap(a,b){var x=Array.from(new Set(words(a))),y=new Set(words(b));return x.length?x.filter(function(w){return y.has(w);}).length/x.length:0;}
 function escape(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 function compatibility(job,profile){
  job=job||{};profile=profile||{};
  var role=profile.cargoDesejado||profile.objetivo||'',skills=profile.habilidadesProfissionais||profile.habilidades||'',experience=profile.experienciaProfissional||'',city=profile.cidadeProfissional||profile.cidade||'',modes=list(profile.modalidadePreferida||profile.modalidades);
  var requirements=job.competencias||job.habilidades||job.requisitos||'',remote=norm(job.modalidade)==='remoto';
  function row(label,weight,a,b,match){return {label:label,weight:weight,available:!!words(a).length&&!!words(b).length,match:Math.max(0,Math.min(1,match)),profile:String(Array.isArray(a)?a.join(', '):a||''),job:String(Array.isArray(b)?b.join(', '):b||'')};}
  var criteria=[
   row('Cargo de interesse',30,role,job.cargo||job.titulo,overlap(role,job.cargo||job.titulo)),
   row('Área profissional',10,profile.areaProfissional,job.area,norm(profile.areaProfissional)===norm(job.area)?1:0),
   row('Habilidades em comum',25,skills,requirements,overlap(skills,requirements)),
   row('Localização',15,remote?'':city,job.cidade,list(city).indexOf(norm(job.cidade))>=0?1:0),
   row('Modalidade preferida',10,modes,job.modalidade,modes.indexOf(norm(job.modalidade))>=0?1:0),
   row('Experiência em comum',10,experience,requirements,overlap(requirements,experience))
  ];
  var available=criteria.filter(function(c){return c.available;}),weight=available.reduce(function(s,c){return s+c.weight;},0),points=available.reduce(function(s,c){return s+c.weight*c.match;},0);
  return {percent:weight>=45&&available.length>=2?Math.round(points/weight*100):null,coverage:weight,criteria:criteria};
 }
 function matchesAlert(job,alert){
  var role=norm(alert.cargo),cities=list(alert.cidades||alert.cidade),modes=list(alert.modalidades);
  return (!role||overlap(role,job.cargo||job.titulo)>=.5)&&(!cities.length||norm(job.modalidade)==='remoto'||cities.indexOf(norm(job.cidade))>=0)&&(!modes.length||modes.indexOf(norm(job.modalidade))>=0);
 }
 function validateAlert(value){
  var cargo=String(value.cargo||'').trim().slice(0,100),cidade=String(value.cidade||'').trim().slice(0,160),modalidades=list(value.modalidades).filter(function(v){return ['presencial','hibrido','remoto'].indexOf(v)>=0;});
  if(!cargo&&!cidade&&!modalidades.length)throw Error('Escolha pelo menos um cargo, cidade ou modalidade.');
  return {cargo:cargo,cidade:cidade,modalidades:modalidades.map(function(v){return {presencial:'Presencial',hibrido:'Híbrido',remoto:'Remoto'}[v];})};
 }
 function interviewLink(interview){var raw=String((interview||{}).instructions||'').match(/^\[Online externo\] ([^\n]+)/);try{var u=new URL(raw&&raw[1]);return u.protocol==='https:'?u.href:'';}catch(ignore){return '';}}
 function canJoin(interview,now){interview=interview||{};var at=Date.parse(interview.scheduled_at);return interview.state==='confirmed'&&!!interviewLink(interview)&&Number.isFinite(at)&&(now==null?Date.now():now)>=at&&(now==null?Date.now():now)<=at+((Number(interview.duration_minutes)||30)+60)*60000;}
 function interviewQuestions(role){
  var type=norm(role),specific;
  if(/administr|assistente|escritorio/.test(type))specific=[
   ['rotina','Como você organiza documentos e prioridades quando várias tarefas chegam ao mesmo tempo?','Escolha uma situação real e explique como definiu as prioridades.'],
   ['excel','Conte como você utilizou Excel ou outra ferramenta para facilitar uma rotina.','Apresente o problema, a ferramenta utilizada e o resultado. Se ainda não utilizou, explique o que está aprendendo.']
  ];
  else if(/recursos humanos|\brh\b|recrut/.test(type))specific=[
   ['selecao','Como você organizaria a triagem de currículos para uma vaga com muitas candidaturas?','Explique critérios relacionados à vaga, organização e comunicação com os candidatos.'],
   ['sigilo','Como você cuida de informações pessoais e documentos no trabalho?','Descreva cuidados de acesso, armazenamento e compartilhamento.']
  ];
  else if(/vend|comerc|atend|recepc/.test(type))specific=[
   ['cliente','Como você lidaria com um cliente insatisfeito?','Mostre como ouviria a pessoa, entenderia o problema e buscaria uma solução.'],
   ['vendas','Conte uma situação em que você precisou explicar uma solução ou convencer alguém.','Explique a necessidade da pessoa, sua abordagem e o que aconteceu.']
  ];
  else specific=[
   ['prioridade','Como você organiza suas atividades quando precisa cumprir um prazo?','Use um exemplo de trabalho, estudo, projeto ou atividade voluntária.'],
   ['aprendizagem','Conte uma situação em que você precisou aprender algo novo.','Explique como buscou informação, praticou e aplicou o aprendizado.']
  ];
  return [
   ['apresentacao','Conte sobre você e sua trajetória para a função de '+(String(role||'seu interesse').slice(0,100))+'.','Foque nas experiências, conhecimentos e interesses relacionados ao cargo.'],
   ['situacao','Conte uma situação difícil que você resolveu em equipe.','Use a estrutura: situação, sua responsabilidade, ação e resultado.']
  ].concat(specific,[
   ['motivacao','O que desperta seu interesse nesta função?','Relacione o cargo aos seus conhecimentos e objetivos. Evite inventar informações sobre a empresa.'],
   ['fechamento','Que pergunta você faria ao recrutador ao final da entrevista?','Você pode perguntar sobre a rotina, os desafios ou as próximas etapas da seleção.']
  ]).map(function(q){return {id:q[0],text:q[1],hint:q[2]};});
 }
 function responseFeedback(text){
  text=String(text||'').trim();var n=text.split(/\s+/).filter(Boolean).length,t=norm(text),strengths=[],suggestions=[];
  if(n>=30&&n<=180)strengths.push('Sua resposta tem uma extensão adequada para praticar uma apresentação objetiva.');
  if(/\b(organizei|resolvi|realizei|aprendi|criei|atendi|melhorei|planejei|entreguei|ajudei|participei)\b/.test(t))strengths.push('Você descreveu ações da sua experiência em primeira pessoa.');
  if(/\d/.test(text))strengths.push('Você incluiu informações concretas. Confira se os números são verdadeiros e relevantes.');
  if(n<30)suggestions.push('Desenvolva a resposta com um exemplo real e explique sua participação.');
  if(n>180)suggestions.push('Reduza os detalhes e destaque as informações mais relacionadas à pergunta.');
  if(!/\b(organizei|resolvi|realizei|aprendi|criei|atendi|melhorei|planejei|entreguei|ajudei|participei)\b/.test(t))suggestions.push('Explique o que você fez, usando ações concretas.');
  if(!/resultado|consegui|melhor|reduz|aument|econom|entreg|aprend/.test(t))suggestions.push('Inclua o resultado ou o aprendizado dessa experiência.');
  if(!suggestions.length)suggestions.push('Pratique a resposta em voz alta e confira se ela responde diretamente à pergunta.');
  return {words:n,strengths:strengths,suggestions:suggestions};
 }
 var tests={
  portugues:{title:'Português profissional',questions:[
   ['Qual frase está adequada para um e-mail profissional?',['Segue em anexo os documentos solicitado.','Seguem em anexo os documentos solicitados.','Segue os documento solicitado.'],1,'O verbo e os adjetivos concordam com “documentos”, no plural.'],
   ['Complete: “A entrevista acontecerá ___ 14h.”',['as','às','ás'],1,'Na indicação de horário, usamos “às”, com crase.'],
   ['Qual mensagem é mais clara para confirmar uma entrevista?',['Ok.','Confirmo minha presença na entrevista de 18/10, às 14h30. Obrigado pelo convite.','Acho que talvez eu vou.'],1,'A mensagem confirma a presença e informa data e horário.'],
   ['Qual frase está correta?',['Fazem dois anos que trabalho na área.','Faz dois anos que trabalho na área.','Faz dois ano que trabalho na área.'],1,'O verbo “fazer”, indicando tempo decorrido, fica no singular.'],
   ['Qual alternativa expressa uma solicitação respeitosa?',['Me manda isso agora.','Envie logo.','Poderia, por favor, confirmar o horário da reunião?'],2,'A solicitação informa o que se deseja com clareza e cordialidade.']
  ]},
  logica:{title:'Raciocínio lógico',questions:[
   ['Qual é o próximo número: 2, 4, 8, 16, ...?',['20','24','32'],2,'Cada número é o dobro do anterior: 16 × 2 = 32.'],
   ['Um produto custa R$ 200 e recebe 10% de desconto. Qual é o preço final?',['R$ 190','R$ 180','R$ 170'],1,'10% de 200 é 20. O preço final é 200 − 20 = 180.'],
   ['Três pessoas dividem igualmente 24 tarefas. Quantas tarefas cabem a cada uma?',['6','8','12'],1,'24 ÷ 3 = 8 tarefas por pessoa.'],
   ['Uma reunião começa às 9h20 e dura 45 minutos. Quando termina?',['9h55','10h05','10h15'],1,'Somando 45 minutos a 9h20, chegamos a 10h05.'],
   ['Todos os documentos da pasta A foram revisados. O documento X está na pasta A. O que podemos concluir?',['X foi revisado.','X não foi revisado.','A pasta A está vazia.'],0,'Se todos os documentos da pasta foram revisados, isso inclui o documento X.']
  ]},
  excel:{title:'Excel básico',questions:[
   ['Qual fórmula soma os valores de A1 até A5 no Excel em português?',['=SOMA(A1:A5)','=SOMAR(A1+A5)','=TOTAL(A1:A5)'],0,'SOMA adiciona os valores do intervalo. Os dois-pontos indicam A1 até A5.'],
   ['O que acontece ao aplicar um filtro a uma tabela?',['Os dados são apagados.','Apenas as linhas que atendem ao critério ficam visíveis.','Todas as células viram texto.'],1,'O filtro controla as linhas exibidas, preservando os dados.'],
   ['Qual função calcula a média de B1 até B4?',['=MÉDIA(B1:B4)','=SOMA(B1:B4)','=MAIOR(B1:B4)'],0,'MÉDIA retorna a média aritmética dos valores do intervalo.'],
   ['O que significa a referência $A$1?',['Uma célula vazia.','Uma referência absoluta à coluna A e à linha 1.','Um valor monetário.'],1,'O símbolo $ fixa a coluna e a linha ao copiar a fórmula.'],
   ['Qual recurso organiza nomes de A a Z?',['Mesclar células.','Classificar em ordem crescente.','Congelar painéis.'],1,'A classificação crescente ordena textos alfabeticamente, de A a Z.']
  ]},
  atendimento:{title:'Atendimento ao cliente',questions:[
   ['Um cliente relata um problema. Qual é a melhor primeira atitude?',['Interromper e explicar a regra.','Ouvir, confirmar o entendimento e buscar informações.','Dizer que ele está errado.'],1,'Ouvir e entender o problema ajuda a encontrar uma solução adequada.'],
   ['Você ainda não sabe a resposta para uma dúvida. O que fazer?',['Inventar uma resposta para agilizar.','Consultar a informação correta e combinar um retorno.','Ignorar a pergunta.'],1,'Confirmar a informação e informar quando haverá retorno preserva a confiança.'],
   ['Um cliente pede algo que você não pode autorizar. Qual conduta é adequada?',['Prometer mesmo sem poder cumprir.','Explicar o limite e consultar a pessoa responsável por alternativas.','Encerrar a conversa.'],1,'Explique o que pode fazer e procure alternativas dentro da sua responsabilidade.'],
   ['Como encerrar um atendimento?',['Confirmar se a dúvida foi resolvida e informar os próximos passos.','Desligar sem aviso.','Mudar de assunto.'],0,'Uma confirmação final reduz dúvidas e ajuda a pessoa a saber como continuar.'],
   ['Dois clientes aguardam e um caso exige investigação. Como organizar?',['Abandonar o caso mais difícil.','Informar a previsão de retorno e organizar os atendimentos por prioridade.','Atender apenas quem reclama mais.'],1,'Uma previsão honesta e uma fila organizada ajudam a atender com respeito.']
  ]}
 };
 function gradeTest(topic,answers){var exam=tests[topic];if(!exam)throw Error('Escolha um teste disponível.');answers=Array.isArray(answers)?answers:[];var correct=exam.questions.filter(function(q,i){return Number.isInteger(answers[i])&&answers[i]===q[2];}).length;return {correct:correct,total:exam.questions.length,percent:Math.round(correct/exam.questions.length*100)};}
 function premiumAccess(candidate,now){if(!candidate)return false;var plan=norm(candidate.plano_candidato||candidate.planoCandidato||candidate.plano);if(['premium','trimestral','semestral','anual'].indexOf(plan)<0)return false;var until=candidate.premium_valido_ate||candidate.premiumValidoAte||candidate.plano_valido_ate;if(until){var at=Date.parse(until);if(!Number.isFinite(at)||at<(now==null?Date.now():now))return false;}return true;}
 function urgentJob(job,now){
  job=job||{};var marked=[job.contratacaoUrgente,job.urgente].some(function(flag){return ['true','1','sim','yes'].indexOf(norm(flag))>=0;});
  var until=job.urgenteAte||job.urgente_ate;
  return marked&&(!until||Number.isFinite(Date.parse(until))&&Date.parse(until)>(now==null?Date.now():now));
 }
 function lowCompetition(job,now){
  job=job||{};
  var raw=job.dataPublicacao||job.publicadaEm||job.created_at||job.criado_em||job.criadoEm||job.dataCriacao;
  if(!raw)return false;
  var m=String(raw).match(/^(\d{2})\/(\d{2})\/(\d{4})$/),published=m?new Date(+m[3],+m[2]-1,+m[1]).getTime():Date.parse(raw);
  var at=now==null?Date.now():now,total=null;
  [job.totalCandidaturas,job.candidaturas_count].some(function(n){if((typeof n==='number'||typeof n==='string'&&/^\d+$/.test(n))&&Number.isSafeInteger(Number(n))&&Number(n)>=0){total=Number(n);return true;}return false;});
  var status=norm(job.status),approval=norm(job.aprovacao),until=Date.parse(job.expiraEm||job.expira_em||'');
  if(['encerrada','encerrado','pausada','pausado','inativa','inativo','expirada','expirado','rascunho','excluida'].indexOf(status)>=0||['pendente','reprovada','rejeitada','em analise'].indexOf(approval)>=0||Number.isFinite(until)&&until<=at)return false;
  return Number.isFinite(published)&&at-published>=86400000&&total!==null&&total<15;
 }
 function lowCompetitionBadge(job){
  var access=global.EmpregaMaisPremiumCandidatoV92,premium=false;
  try{premium=access&&typeof access.ehPremium==='function'?!!access.ehPremium():premiumAccess(global.obterCandidatoAtual?global.obterCandidatoAtual():null);}catch(ignore){}
  return premium&&lowCompetition(job)?'<span class="cp-low-competition" title="Publicada há pelo menos 24 horas e com menos de 15 candidaturas"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 4v16h16M7 9l5 5 7-8M14 6h5v5"/></svg>Baixa concorrência</span>':'';
 }
 function jobBadges(job,now){
  job=job||{};var at=now==null?Date.now():now,items=[];
  function flag(value){return ['true','1','sim','yes','confidencial'].indexOf(norm(value))>=0;}
  function active(value,until){return flag(value)&&(!until||Number.isFinite(Date.parse(until))&&Date.parse(until)>at);}
  function badge(kind,label,path){items.push('<span class="cp-job-badge" data-job-badge="'+kind+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">'+path+'</svg>'+label+'</span>');}
  var raw=job.dataPublicacao||job.publicadaEm||job.created_at||job.criado_em||job.criadoEm||job.dataCriacao,m=String(raw||'').match(/^(\d{2})\/(\d{2})\/(\d{4})$/),published=m?new Date(+m[3],+m[2]-1,+m[1]).getTime():Date.parse(raw||'');
  if(Number.isFinite(published)&&at>=published&&at-published<2*86400000)badge('nova','Nova','<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>');
  if(active(job.destaque||job.emDestaque||job.destacada,job.destaqueAte||job.destaque_ate||job.fimDestaque))badge('destaque','Destaque','<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/>');
  if(flag(job.confidencial))badge('confidencial','Confidencial','<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>');
  if(urgentJob(job,at))badge('urgente','Contratação urgente','<path d="M13 3c1 5-4 5-2 9 1-2 3-3 4-5 3 3 5 6 4 10a7 7 0 0 1-13-1C5 11 8 7 13 3Z"/>');
  if(job.demo===true)badge('demo','Demonstração','<circle cx="12" cy="12" r="9"/><path d="M12 10v7M12 7h.01"/>');
  var content=items.join('')+lowCompetitionBadge(job);
  return content?'<div class="cp-job-badges" aria-label="Sinalizações da vaga">'+content+'</div>':'';
 }
 function recommendedJobs(rows,candidate,now){
  if(!premiumAccess(candidate,now))return [];
  var seen=new Set(),at=now==null?Date.now():now;
  return (Array.isArray(rows)?rows:[]).filter(function(job){
   if(!job||job.id==null||seen.has(String(job.id)))return false;
   if(['encerrada','encerrado','pausada','pausado','inativa','inativo','expirada','expirado','rascunho','excluida'].indexOf(norm(job.status))>=0)return false;
   if(['pendente','reprovada','rejeitada','em analise'].indexOf(norm(job.aprovacao))>=0)return false;
   var until=Date.parse(job.expiraEm||job.expira_em||'');if(Number.isFinite(until)&&until<=at)return false;
   seen.add(String(job.id));return true;
  }).map(function(job){return {job:job,match:compatibility(job,candidate)};}).filter(function(item){
   return item.match.percent!=null&&item.match.percent>=60;
  }).sort(function(a,b){return b.match.percent-a.match.percent||(Date.parse(b.job.dataPublicacao||b.job.criadoEm)||0)-(Date.parse(a.job.dataPublicacao||a.job.criadoEm)||0);});
 }
 var core={baixaConcorrencia:lowCompetition,seloBaixaConcorrencia:lowCompetitionBadge,selosVaga:jobBadges,temPremium:premiumAccess,vagaUrgente:urgentJob,recomendarVagas:recommendedJobs,compatibilidade:compatibility,correspondeAlerta:matchesAlert,validarAlerta:validateAlert,perguntasEntrevista:interviewQuestions,orientarResposta:responseFeedback,corrigirTeste:gradeTest,testes:tests,podeEntrar:canJoin,linkEntrevista:interviewLink,escape:escape};
 global.EmpregaMaisPreparacao=core;
 if(typeof module!=='undefined'&&module.exports)module.exports=core;
 if(!global.document)return;

 var page,container,workspace,extra,practiceOwner='',practice=null,scheduled=false,owner='',draftTimer=null,formHandlers={};
 // Local wizard steps must not trigger the portal's legacy global submit loader.
 // Delegation also preserves the controls when legacy formatting replaces a node.
 function bindToolForm(form){
  formHandlers[form.id]=form.onsubmit;
  form.onsubmit=function(event){event.preventDefault();};
  var button=form.querySelector('button[type="submit"]');
  if(button){button.type='button';button.dataset.cpLocalSubmit=form.id;}
 }
 function submitToolForm(form){
  if(!form||!formHandlers[form.id])return;
  if(typeof form.checkValidity==='function'&&!form.checkValidity()){if(form.reportValidity)form.reportValidity();return;}
  formHandlers[form.id].call(form,{currentTarget:form,preventDefault:function(){}});
 }
 function identity(){return norm(sessionStorage.getItem('candidatoUserId')||sessionStorage.getItem('candidatoEmail'));}
 function demo(){return new URLSearchParams(location.search).get('pagina')==='demo-candidato';}
 function profile(){try{return global.obterCandidatoAtual?global.obterCandidatoAtual()||{}:{};}catch(ignore){return {};}}
 function read(key,fallback){try{var value=JSON.parse(localStorage.getItem(key)||'null');return value==null?fallback:value;}catch(ignore){return fallback;}}
 function jobs(){try{var rows=global.todasAsVagasPublicas?global.todasAsVagasPublicas():global.carregarVagasPortal?global.carregarVagasPortal():[];var seen=new Set();return (Array.isArray(rows)?rows:[]).filter(function(j){if(!j||j.id==null||seen.has(String(j.id)))return false;seen.add(String(j.id));return true;});}catch(ignore){return [];}}
 function applicationRows(){var email=norm(sessionStorage.getItem('candidatoEmail'));try{return (global.carregarCandidaturas?global.carregarCandidaturas():[]).filter(function(a){return !!email&&norm(a.email||a.candidatoEmail||a.emailCandidato||a.candidato_email)===email;});}catch(ignore){return [];}}
 function jobById(id){return jobs().find(function(j){return String(j.id)===String(id);})||{};}
 function alerts(){var rows=profile().alertasVagas;return Array.isArray(rows)?rows.filter(function(a){return a&&a.id;}).slice(0,20):[];}
 function practiceKey(){return 'emCandidatePracticeV1:'+identity();}
 function loadPractice(){var saved=read(practiceKey(),{}),interview=saved.interview,test=saved.test;
  if(!interview||typeof interview.role!=='string'||!Array.isArray(interview.answers))interview=null;
  if(!test||!tests[test.topic]||!Array.isArray(test.answers)||!Number.isInteger(test.index)||test.index<0||test.index>=tests[test.topic].questions.length)test=null;
  practice={interview:interview,test:test,history:Array.isArray(saved.history)?saved.history.filter(function(h){return h&&typeof h.title==='string';}).slice(0,10):[]};practiceOwner=identity();
 }
 function persistPractice(){if(practiceOwner!==identity()||!identity())return false;try{localStorage.setItem(practiceKey(),JSON.stringify(practice));return true;}catch(ignore){return false;}}
 async function saveAlerts(rows){
  var expected=identity(),email=norm(sessionStorage.getItem('candidatoEmail'));
  if(!expected||!email)throw Error('Entre no painel do candidato para salvar suas preferências.');
  var profiles=read('candidatosEmpregaMais',[]);if(!Array.isArray(profiles))profiles=[];
  var index=profiles.findIndex(function(p){return norm(p.email)===email;}),current=Object.assign({},index<0?profile():profiles[index],{email:email,alertasVagas:rows});
  if(index<0)profiles.push(current);else profiles[index]=current;
  localStorage.setItem('candidatosEmpregaMais',JSON.stringify(profiles));
  document.dispatchEvent(new Event('empregamais:candidato-sincronizado'));
  if(!demo()&&global.EmpregaMaisPerfilCloud&&sessionStorage.getItem('candidatoUserId')&&sessionStorage.getItem('empregaMaisSupabaseAccessToken')){
   await global.EmpregaMaisPerfilCloud.flush();
   if(expected!==identity())throw Error('Sua conta mudou. Abra novamente seus alertas.');
   return 'Preferências salvas na sua conta. As oportunidades aparecem aqui no painel.';
  }
  return demo()?'Alerta salvo nesta demonstração.':'Preferências salvas neste navegador. As oportunidades aparecem aqui no painel.';
 }
 function icon(name){
  var p={analysis:'<rect x="3" y="14" width="4" height="8" rx="1" fill="#0080c9" stroke="none"/><rect x="10" y="9" width="4" height="13" rx="1" fill="#93c5fd" stroke="none"/><rect x="17" y="3" width="4" height="19" rx="1" fill="#0080c9" stroke="none"/>',document:'<path d="M6 3h9l4 4v14H6Z M14 3v5h5M9 12h7M9 16h7"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 11h18"/>',bookmark:'<path d="M6 21V3h12v18l-6-4Z"/>',message:'<rect x="2" y="4" width="20" height="16" rx="3" fill="#f8fbff"/><path d="m3 6 9 7 9-7"/>',arrow:'<path d="m9 5 7 7-7 7"/>',bell:'<path d="M5 10a7 7 0 0 1 14 0v5l2 3H3l2-3Z M9 21h6"/>',briefcase:'<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3"/>',check:'<path d="m5 12 4 4 10-10"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',book:'<path d="M12 5c-3-3-7-3-10-1v16c3-2 7-2 10 1 3-3 7-3 10-1V4c-3-2-7-2-10 1Zm0 0v16"/>',video:'<rect x="3" y="5" width="12" height="14" rx="2"/><path d="m15 9 6-4v14l-6-4"/>',pin:'<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',back:'<path d="M19 12H5m6-6-6 6 6 6"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>'};
  p.fire='<path d="M12 3c0 5-6 6-6 12a6 6 0 0 0 12 0c0-4-2-6-4-8 0 4-2 5-2 5s-2-4 0-9Z"/>';
  p.document='<rect x="4" y="2" width="16" height="21" rx="2" fill="#eff6ff" stroke="#0080c9"/><rect x="6" y="3" width="12" height="18" rx="1" fill="#f8fbff" stroke="none"/><rect x="8" y="6" width="3" height="3" rx=".4" stroke="#0080c9"/><path d="M8 13h8M8 17h8" stroke="#0080c9"/>';p.calendar='<rect x="2" y="4" width="20" height="18" rx="3" fill="#eff6ff" stroke="#34333d"/><path d="M3 10h18M7 2v5M17 2v5" stroke="#0080c9" stroke-width="2.3"/><path d="M3 8V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1" stroke="#0080c9"/><g fill="#0080c9" stroke="none"><rect x="6" y="13" width="2.5" height="2.5" rx=".4"/><rect x="11" y="13" width="2.5" height="2.5" rx=".4"/><rect x="16" y="13" width="2.5" height="2.5" rx=".4"/><rect x="6" y="17" width="2.5" height="2.5" rx=".4"/><rect x="11" y="17" width="2.5" height="2.5" rx=".4"/><rect x="16" y="17" width="2.5" height="2.5" rx=".4"/></g>';return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(p[name]||p.briefcase)+'</svg>';
 }
 function formatDate(value){var d=new Date(value);return value&&!isNaN(d.getTime())?d.toLocaleDateString('pt-BR'):'Data não informada';}
 function stableHTML(el,html){if(el.dataset.cpHtml===html)return;el.innerHTML=html;el.dataset.cpHtml=html;}
 function statusLabel(a){var workflow=global.EmpregaMaisCandidaturasCandidato;return workflow?workflow.rotulo(a):String(a.status||a.statusProcesso||'Em avaliação');}
 function statusKey(a){var workflow=global.EmpregaMaisCandidaturasCandidato;return workflow?workflow.classificar(a):'avaliacao';}
 function renderLatest(){
  var host=container.querySelector('.cp-latest'),rows=applicationRows().slice().sort(function(a,b){return (Date.parse(b.statusAtualizadoEm||b.atualizadoEm||b.data)||0)-(Date.parse(a.statusAtualizadoEm||a.atualizadoEm||a.data)||0);}).slice(0,3);
  var html='<div class="cp-section-head"><div><h2>Últimas candidaturas</h2><p>Acompanhe as atualizações dos seus processos.</p></div><button type="button" data-cp-action="applications" class="cp-text-button">Ver todas →</button></div>';
  html+=rows.length?'<div class="cp-latest-list">'+rows.map(function(a){
   var job=jobById(a.vagaId||a.vaga_id),title=a.vagaTitulo||a.tituloVaga||a.vaga||job.cargo||'Processo seletivo',at=a.statusAtualizadoEm||a.atualizadoEm||a.atualizado_em;
   return '<article><span class="cp-small-icon">'+icon('briefcase')+'</span><div><h3>'+escape(title)+'</h3><p>'+escape(a.empresa||job.empresa||'Empresa')+'</p><small>'+(at?'Atualizada em '+formatDate(at):'Enviada em '+formatDate(a.data||a.dataCandidatura))+'</small></div><div class="cp-application-end"><span class="cp-status-chip cp-status-'+escape(statusKey(a))+'">'+escape(statusLabel(a))+'</span><button type="button" class="cp-text-button" data-cp-application="'+escape(a.id||'')+'">Acompanhar →</button></div></article>';
  }).join('')+'</div>':'<div class="cp-empty"><span class="cp-small-icon">'+icon('document')+'</span><p>Suas candidaturas aparecerão aqui depois que você se candidatar a uma vaga.</p><button type="button" data-cp-action="search">Buscar vagas</button></div>';
  stableHTML(host,html);
 }
 function renderAlertCard(){
  var host=container.querySelector('.cp-alert-card'),items=alerts(),available=jobs(),newIds=new Set();
  items.forEach(function(a){var seen=new Set((a.vistas||[]).map(String));available.filter(function(j){return matchesAlert(j,a)&&!seen.has(String(j.id));}).forEach(function(j){newIds.add(String(j.id));});});
  var current=items[0]||{},p=profile(),modalities=current.modalidades||p.modalidadePreferida||[],interests=[current.cargo||p.cargoDesejado||p.areaProfissional,current.cidade||p.cidadeProfissional||p.cidade,Array.isArray(modalities)?modalities.join(' / '):modalities].filter(Boolean);
  var chips=interests.length?'<div class="cp-alert-interests" aria-label="Preferências de oportunidades">'+interests.map(function(value){return '<span>'+escape(value)+'</span>';}).join('')+'</div>':'';
  stableHTML(host,'<span class="cp-feature-icon">'+icon('bell')+'</span><h2>Vagas do seu interesse</h2><p>'+(items.length?'Você tem '+items.length+' alerta'+(items.length===1?'':'s')+' ativo'+(items.length===1?'':'s')+'.':'Receba oportunidades de acordo com seu perfil.')+'</p>'+chips+(newIds.size?'<strong class="cp-alert-new">'+newIds.size+' oportunidade'+(newIds.size===1?'':'s')+' para conferir</strong>':'')+'<button type="button" data-cp-action="alerts" class="cp-primary">'+(items.length?'Gerenciar alertas':'Configurar alertas')+'</button><small>Atualizações aqui no painel.</small>');
 }
 function renderPracticeCard(){
  var history=practice&&practice.history||[],last=history[0],info=extra.querySelector('.cp-practice-history');
  var text=last?'Último treino: '+last.title+' · '+formatDate(last.at):'';info.hidden=!last;
  if(info.textContent!==text)info.textContent=text;
 }
 function enhanceMetrics(){
  var summary=container.querySelector('.cp-home-summary');if(!summary)return;
  var originalInterview=(summary.children[1]&&summary.children[1].querySelector('strong')||{}).textContent||'0';
  var names=['Candidaturas','Em análise','Entrevista','Mensagem'],icons=['document','analysis','calendar','message'],actions=['applications','analysis','interviews','messages'];
  Array.from(summary.children).forEach(function(el,i){if(i>3||el.tagName==='BUTTON')return;var old=el.querySelector('strong'),number=i===1?applicationRows().filter(function(a){return statusKey(a)==='avaliacao';}).length:i===2?originalInterview:old?old.textContent:'0',button=document.createElement('button');button.type='button';button.dataset.cpAction=actions[i];button.className='cp-overview-card';button.innerHTML='<span class="cp-overview-icon">'+icon(icons[i])+'</span><div><strong'+(i===3?' data-home-message-count':'')+'>'+escape(number)+'</strong><span>'+names[i]+'</span></div><span class="cp-overview-arrow">'+icon('arrow')+'</span>';el.replaceWith(button);});
  var metricRows=applicationRows(),metricValues=[metricRows.length,metricRows.filter(function(a){return statusKey(a)==='avaliacao';}).length,metricRows.filter(function(a){return statusKey(a)==='entrevista';}).length];
  summary.querySelectorAll('.cp-overview-card').forEach(function(card,i){var value=card.querySelector('strong');if(i<3&&value&&value.textContent!==String(metricValues[i]))value.textContent=String(metricValues[i]);});
  var counter=summary.querySelector('[data-home-message-count]'),unread=Number(counter&&counter.textContent)||0,bell=document.querySelector('#cpCandidateHeader .cp-notifications');
  if(bell){bell.querySelector('.cp-notification-dot').hidden=unread<1;bell.setAttribute('aria-label',unread>0?'Abrir mensagens: '+unread+' recebida'+(unread===1?'':'s'):'Abrir mensagens');}
 }
 function hasCompatibilityAccess(){try{var api=global.EmpregaMaisPremiumCandidatoV92;return api&&typeof api.ehPremium==='function'?!!api.ehPremium():premiumAccess(profile());}catch(ignore){return false;}}
 function compatibilityMarkup(job,c,allowed){
  var fit=allowed?compatibility(job,c):null;
  var badge=allowed?'<span class="cp-fit-premium-label">PREMIUM</span>':'<span class="cp-fit-premium-label">RECURSO PREMIUM</span>';
  var score=allowed?(fit.percent==null?'Complete seu perfil':fit.percent+'%'):'Conheça sua compatibilidade';
  var detail=allowed?(fit.percent==null?'Adicione informações para calcular.':'Compatibilidade com seu perfil · Ver critérios'):'Compare seu perfil com os requisitos da vaga.';
  return '<button type="button" class="cp-fit-button cp-fit-panel '+(allowed?'is-unlocked':'is-locked')+'" data-cp-fit="'+escape(job.id||'')+'">'+icon('target')+'<span class="cp-fit-copy">'+badge+'<strong>'+score+'</strong><small>'+detail+'</small>'+(allowed&&fit.percent!=null?'<span class="cp-fit-meter" aria-hidden="true"><span style="width:'+Math.max(0,Math.min(100,fit.percent))+'%"></span></span>':'')+'</span><span class="cp-fit-panel-action">'+(allowed?'Ver análise →':'Conhecer Premium →')+'</span></button>';
 }
 function enhanceRecommendations(){
  var c=profile();container.querySelectorAll('.em-personal-grid [data-cp-job-id]').forEach(function(card){
   var job=jobById(card.dataset.cpJobId),allowed=hasCompatibilityAccess(),signature=JSON.stringify([allowed,allowed?compatibility(job,c):null]),holder=card.querySelector('.cp-fit-and-alert');
   if(!holder){holder=document.createElement('div');holder.className='cp-fit-and-alert';card.appendChild(holder);}
   if(holder.dataset.signature===signature)return;holder.dataset.signature=signature;
   holder.innerHTML=compatibilityMarkup(job,c,allowed)+'<button type="button" class="cp-job-alert" data-cp-alert-job="'+escape(job.id||'')+'">'+icon('bell')+' Avise-me sobre vagas como esta</button>';
  });
 }
 function enhanceInterview(){
  var host=container.querySelector('.cp-next-interview');if(!host)return;
  var next=host.emInterview,actions=host.querySelector('.cp-interview-extra');
  if(!next){if(actions)actions.remove();return;}
  if(!actions){actions=document.createElement('div');actions.className='cp-interview-extra';host.appendChild(actions);}
  stableHTML(actions,'<button type="button" data-cp-action="interview-guide">'+icon('book')+' Ver orientações</button>'+(canJoin(next)?'<button type="button" data-cp-action="join" class="cp-primary">'+icon('video')+' Entrar na entrevista</button>':''));
 }
 function closeWorkspace(focus){
  if(!workspace)return;clearTimeout(draftTimer);saveCurrentAnswer();workspace.hidden=true;workspace.dataset.cpView='';if(page.classList.contains('cp-tool-active')||page.classList.contains('cp-recommendations-active'))page.classList.remove('cp-tool-active','cp-recommendations-active');
  syncProfessionalNav();
  if(focus!==false){var button=container.querySelector('.cp-preparation [data-cp-action="interview"]');if(button)button.focus();}
 }
 function openWorkspace(title,body,header){
  if(global.irPara&&!page.classList.contains('ativa'))global.irPara('painel-candidato');
  if(identity()!==owner)return;
  workspace.hidden=false;workspace.dataset.cpView='';page.classList.add('cp-tool-active');
  var backToRecommendations=page.classList.contains('cp-recommendations-active')&&title!=='Recomendações';
  workspace.innerHTML=(header||'<header class="cp-workspace-head"><button type="button" data-cp-action="'+(backToRecommendations?'recommendations':'close')+'" class="cp-text-button">'+icon('back')+(backToRecommendations?' Voltar às recomendações':' Voltar à minha área')+'</button><h1 tabindex="-1">'+escape(title)+'</h1></header>')+'<div class="cp-workspace-content">'+body+'</div><p class="cp-feedback" role="status" aria-live="polite"></p>';
  workspace.querySelector('h1').focus({preventScroll:true});
  (container.querySelector('.cp-demo-plans')||workspace).scrollIntoView({block:'start',behavior:'auto'});
 }
 function syncProfessionalNav(){
  var toolbar=document.querySelector('#cpCandidateHeader .cp-toolbar');if(!toolbar)return;
  var nav=toolbar.querySelector('.cp-professional-nav'),allowed=!!identity()&&hasCompatibilityAccess();
  if(!allowed){if(nav)nav.remove();return;}
  if(!nav){
   nav=document.createElement('nav');nav.className='cp-professional-nav';nav.setAttribute('aria-label','Recursos do candidato Premium');
   nav.innerHTML=[['tests','Testes e avaliações','Testes','book'],['simulator','Simulador de entrevistas','Simulador','video'],['results','Resultados','Resultados','analysis']].map(function(item){return '<button type="button" data-cp-professional-view="'+item[0]+'" aria-label="'+item[1]+'">'+icon(item[3])+'<span class="cp-professional-full">'+item[1]+'</span><span class="cp-professional-short">'+item[2]+'</span></button>';}).join('');
   nav.addEventListener('click',function(event){var button=event.target.closest('[data-cp-professional-view]');if(!button||!nav.contains(button))return;event.preventDefault();openProfessional(button.dataset.cpProfessionalView);});
   toolbar.insertBefore(nav,toolbar.querySelector('.cp-notifications'));
  }
  var selected=page&&page.classList.contains('ativa')&&workspace&&!workspace.hidden?workspace.dataset.cpView:'';
  nav.querySelectorAll('[data-cp-professional-view]').forEach(function(button){if(selected==='professional-'+button.dataset.cpProfessionalView){if(button.getAttribute('aria-current')!=='page')button.setAttribute('aria-current','page');}else if(button.hasAttribute('aria-current'))button.removeAttribute('aria-current');});
 }
 function openProfessional(view){
  if(['tests','simulator','results'].indexOf(view)<0)return;
  if(!identity()||!hasCompatibilityAccess()){closeWorkspace(false);if(global.irPara)global.irPara('premium-candidato');return;}
  if(!page||!page.classList.contains('ativa')||page.classList.contains('cp-messages-active')){var home=document.querySelector('#cpCandidateHeader [data-route="painel-candidato"]');if(home)home.click();else if(global.irPara)global.irPara('painel-candidato');}
  mount();if(!workspace||owner!==identity())return;
  page.classList.remove('cp-recommendations-active');
  if(!global.EMProfessionalTools)return view==='simulator'?interviewSetup():testsSetup();
  var titles={tests:'Testes e avaliações',simulator:'Simulador de entrevistas',results:'Seus resultados'};
  openWorkspace(titles[view]||titles.tests,'<section id="emCandidateProfessionalTools" aria-label="Recursos profissionais"></section>');
  workspace.dataset.cpView='professional-'+view;syncProfessionalNav();
  global.EMProfessionalTools.mount(workspace.querySelector('#emCandidateProfessionalTools'),{role:'candidate',view:view,profile:profile(),jobs:jobs(),applications:applicationRows(),demo:demo(),navigate:openProfessional});
 }
 function toolStatus(text){var el=workspace.querySelector('.cp-feedback');if(el)el.textContent=text;}
 function recommendationIcon(name){var paths={crown:'<path d="m3 7 5 4 4-7 4 7 5-4-3 13H6Z"/><path d="M7 22h10"/>',pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',office:'<path d="M4 22V3h13v19M17 11h4v11M2 22h21M8 7h1m3 0h1M8 11h1m3 0h1M8 15h1m3 0h1M9 22v-4h4v4"/>',document:'<path d="M5 2h10l4 4v16H5ZM14 2v6h5M8 12h8M8 16h8"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="m12 12 9-9M16 3h5v5"/>',skills:'<path d="m12 2 3 5 6 1-2 6 1 6-6-1-5 3-3-5-5-2 3-5 1-6 6 1Z"/><circle cx="12" cy="12" r="3"/>'};return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.target)+'</svg>';}
 function recommendationCompanyLogo(job,conf){
  var demo=job.demo||/^demo[-_]/i.test(String(job.id||''))||/demonstra[cç][aã]o/i.test(String(job.empresa||''));
  if(conf||!demo)return icon('briefcase');
  var retail=String(job.empresa||'').indexOf('Varejo')>=0;
  var initials=retail?'VD':'ED',color=retail?'#5b4b8a':'#00689d';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" role="img" aria-label="'+escape('Logo fictícia de '+(job.empresa||'Empresa Demonstração'))+'" style="width:30px;height:30px;max-width:none;flex:none"><rect width="40" height="40" rx="8" fill="'+color+'"/><path d="M8 10h24" stroke="#fff" stroke-opacity=".45" stroke-width="2"/><text x="20" y="27" text-anchor="middle" fill="#fff" font-family="Poppins,sans-serif" font-size="16" font-weight="700" letter-spacing="-1">'+initials+'</text></svg>';
 }
 function recommendationIndicator(percent,id){
  if(typeof percent!=='number'||!Number.isFinite(percent))return '';
  var value=Math.max(0,Math.min(100,percent));
  return '<div class="cp-recommendation-fit cp-match-column"><span class="cp-recommendation-premium">'+recommendationIcon('crown')+'PREMIUM</span><div class="cp-match-ring" role="meter" aria-label="Aderência ao perfil" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+value+'" style="--cp-match:'+value+'%"><strong>'+value+'<span>%</span></strong></div><span class="cp-match-title">Aderência ao perfil</span><button type="button" class="cp-match-analysis" data-cp-fit="'+escape(id)+'">Ver análise <span aria-hidden="true">›</span></button></div>';
 }
 function recommendationsHeader(){
  return '<header class="cp-recommendations-hero cp-recommendations-elegant" aria-labelledby="cpRecommendationsTitle"><div class="cp-recommendations-hero-copy"><button type="button" class="cp-recommendations-back" data-cp-action="close">'+icon('back')+' Voltar à minha área</button><div class="cp-recommendations-title-row"><h1 id="cpRecommendationsTitle" tabindex="-1">Vagas recomendadas para você</h1><span class="cp-recommendations-premium-badge">PREMIUM</span></div><p>Oportunidades com pelo menos 60% de aderência ao seu perfil.</p></div></header>';
 }
 function openRecommendations(refresh){
  if(refresh!==true){if(global.irPara&&(!page||!page.classList.contains('ativa')))global.irPara('painel-candidato');mount();}
  if(!workspace||!identity())return;
  var candidate=profile(),allowed=premiumAccess(candidate),rows=allowed?recommendedJobs(jobs(),candidate):[];
  var html='';
  if(!allowed){
   html+='<section class="cp-recommendations-empty"><h2>Suas recomendações estão no Premium</h2><p>Receba uma seleção de vagas para o seu perfil, organizada por compatibilidade, e consulte os critérios de cada indicação.</p><div class="cp-tool-actions"><button type="button" class="cp-primary" data-cp-action="premium">Conhecer Premium →</button><button type="button" data-cp-action="search">Explorar todas as vagas</button></div></section>';
  }else if(!rows.length){
   html+='<section class="cp-recommendations-empty"><h2>Nenhuma recomendação por enquanto</h2><p>Atualize seus cargos de interesse e suas habilidades. Novas recomendações aparecerão quando houver vagas com pelo menos 60% de aderência. Você pode explorar todas as oportunidades na busca.</p><div class="cp-tool-actions"><button type="button" class="cp-primary" data-cp-action="profile">Atualizar meu perfil</button><button type="button" data-cp-action="search">Explorar todas as vagas</button></div></section>';
  }else{
   html+='<div class="cp-section-head"><p>'+rows.length+' oportunidade'+(rows.length===1?' recomendada':'s recomendadas')+' · Maior compatibilidade primeiro</p><button type="button" class="cp-text-button" data-cp-action="profile">Atualizar meu perfil →</button></div><div class="cp-recommendations-grid">'+rows.map(function(item){
    var job=item.job,fit=item.match,conf=typeof global.vagaEhConfidencialEM==='function'?global.vagaEhConfidencialEM(job):['true','1','sim','confidencial'].indexOf(norm(job.confidencial))>=0;
    var reasons=fit.criteria.filter(function(c){return c.available&&c.match>=.5;}).slice(0,3).map(function(c){return '<span>'+recommendationIcon(c.label.indexOf('Habilidade')>=0?'skills':'target')+escape(c.label)+'</span>';}).join('');
    var salary=typeof global.formatarSalarioExibicao==='function'?global.formatarSalarioExibicao(job.salario):job.salario;
    if(salary&&/\d/.test(salary)&&!/R\$/.test(salary))salary='R$ '+salary;
    return '<article class="cp-recommendation-card"><div class="cp-recommendation-top"><span class="cp-small-icon">'+recommendationCompanyLogo(job,conf)+'</span><div class="cp-recommendation-heading"><h2>'+escape(job.cargo||job.titulo||'Vaga')+'</h2><p>'+escape(conf?'Empresa confidencial':job.empresa||'Empresa')+'</p></div></div>'+recommendationIndicator(fit.percent,job.id)+'<div class="cp-recommendation-chips"><span>'+recommendationIcon('pin')+escape(job.cidade||'Local não informado')+(job.uf?' – '+escape(job.uf):'')+'</span><span>'+recommendationIcon('office')+escape(job.modalidade||'Modalidade não informada')+'</span><span>'+recommendationIcon('document')+escape(job.contrato||'Contrato não informado')+'</span>'+'</div>'+jobBadges(job)+'<strong class="cp-recommendation-salary">'+escape(salary||'Salário a combinar')+'</strong><div class="cp-recommendation-reasons" aria-label="Critérios em comum">'+reasons+'</div><div class="cp-recommendation-footer"><small>'+(job.dataPublicacao||job.criadoEm?'Publicada em '+formatDate(job.dataPublicacao||job.criadoEm):'Data não informada')+'</small><div><a class="cp-text-button cp-recommendation-view" href="?pagina=vaga&amp;id='+encodeURIComponent(job.id)+'">Ver vaga</a><button type="button" class="cp-primary" data-cp-apply-job="'+escape(job.id)+'">Candidatar-se agora</button></div></div></article>';
   }).join('')+'</div>';
  }
  if(refresh===true)stableHTML(workspace.querySelector('.cp-workspace-content'),html);
  else{openWorkspace('Recomendações',html,recommendationsHeader());workspace.dataset.cpView='recommendations';page.classList.add('cp-recommendations-active');}
 }
 core.abrirRecomendacoes=openRecommendations;
 function applyRecommendedJob(id){
  if(!premiumAccess(profile())){openRecommendations();return;}
  var item=recommendedJobs(jobs(),profile()).find(function(row){return String(row.job.id)===String(id);});
  if(!item){toolStatus('Esta vaga não está mais disponível nas suas recomendações.');return;}
  // The existing application dialog also reads the selected job after opening.
  global.vagaAtual=item.job;
  if(global.EmpregaMaisCandidaturaV94&&typeof global.EmpregaMaisCandidaturaV94.abrir==='function')global.EmpregaMaisCandidaturaV94.abrir(item.job);
  else if(typeof global.abrirCandidaturaProtegida==='function')global.abrirCandidaturaProtegida(item.job.id);
  else{closeWorkspace(false);global.irPara('candidatura',item.job.id);}
 }
 function openCompatibility(id){
  if(!hasCompatibilityAccess()){openWorkspace('Compatibilidade de perfil · Premium','<div class="cp-tool-intro"><span class="cp-feature-icon">'+icon('target')+'</span><div><h2>Encontre oportunidades com mais informação</h2><p>Compare as informações do seu perfil com os requisitos de cada vaga.</p></div></div><p>No Premium, você vê o percentual de compatibilidade e os critérios considerados na análise. O indicador é uma orientação e não garante contratação.</p><div class="cp-tool-actions"><button type="button" class="cp-primary" data-cp-action="premium">Conhecer Premium →</button><button type="button" data-cp-job-open="'+escape(id)+'">Continuar vendo a vaga</button></div>');return;}

  var job=jobById(id),match=compatibility(job,profile());
  openWorkspace('Entenda sua compatibilidade','<div class="cp-tool-intro"><span class="cp-feature-icon">'+icon('target')+'</span><div><h2>'+escape(job.cargo||job.titulo||'Vaga')+'</h2><p>'+(match.percent==null?'Preencha mais informações no seu perfil para calcular.':match.percent+'% de compatibilidade com as informações disponíveis.')+'</p></div></div><p>O indicador compara informações do seu perfil com o anúncio. A pontuação considera apenas os critérios disponíveis e não representa uma previsão de contratação.</p><div class="cp-criteria">'+match.criteria.map(function(c){return '<article><div><strong>'+c.label+'</strong><small>Peso: '+c.weight+'</small></div><span>'+(!c.available?'Informação insuficiente':c.match>=.8?'Em comum':c.match>0?'Em parte':'Sem correspondência')+'</span><dl><dt>Seu perfil</dt><dd>'+escape(c.profile||'Não informado')+'</dd><dt>Vaga</dt><dd>'+escape(c.job||'Não informado')+'</dd></dl></article>';}).join('')+'</div><p class="cp-muted">Habilidades e experiência são comparadas por termos em comum. Confira também os requisitos completos da vaga.</p><div class="cp-tool-actions"><button type="button" data-cp-action="profile">Atualizar meu perfil</button><button type="button" class="cp-primary" data-cp-job-open="'+escape(id)+'">Ver vaga →</button></div>');
 }
 function openAlerts(jobId,editId){
  var items=alerts(),existing=items.find(function(a){return a.id===editId;}),job=jobId?jobById(jobId):{},c=profile();
  var value=existing||{cargo:job.cargo||c.cargoDesejado||'',cidade:job.cidade||c.cidadeProfissional||c.cidade||'',modalidades:job.modalidade?[job.modalidade]:Array.isArray(c.modalidadePreferida)?c.modalidadePreferida:[c.modalidadePreferida].filter(Boolean)};
  openWorkspace('Meus alertas de vagas','<p>Escolha as oportunidades que deseja acompanhar. Os alertas são atualizados quando você abre o painel e novas vagas são carregadas.</p><form id="cpAlertForm" class="cp-tool-form" data-edit-id="'+escape(editId||'')+'"><label>Cargo de interesse<input name="cargo" maxlength="100" value="'+escape(value.cargo)+'" placeholder="Ex.: Assistente Administrativo"></label><label>Cidades de interesse<input name="cidade" maxlength="160" value="'+escape(value.cidade)+'" placeholder="Ex.: Belo Horizonte, Contagem"></label><fieldset><legend>Modalidades — pode escolher mais de uma</legend><div class="cp-checkboxes">'+['Presencial','Híbrido','Remoto'].map(function(m){return '<label><input type="checkbox" name="modalidade" value="'+m+'" '+(list(value.modalidades).indexOf(norm(m))>=0?'checked':'')+'>'+m+'</label>';}).join('')+'</div></fieldset><button type="submit" class="cp-primary">'+(existing?'Salvar alterações':'Criar alerta')+'</button></form><h2>Alertas ativos</h2><div class="cp-alert-list">'+(items.length?items.map(function(a){var count=jobs().filter(function(j){return matchesAlert(j,a);}).length;return '<article><div><h3>'+escape(a.cargo||'Todos os cargos')+'</h3><p>'+escape(a.cidade||'Todas as cidades')+' · '+escape((a.modalidades||[]).join(', ')||'Todas as modalidades')+'</p><small>'+count+' vaga'+(count===1?'':'s')+' disponível'+(count===1?'':'s')+'</small></div><div class="cp-tool-actions"><button type="button" data-cp-alert-view="'+escape(a.id)+'">Ver vagas</button><button type="button" data-cp-alert-edit="'+escape(a.id)+'">Editar</button><button type="button" data-cp-alert-delete="'+escape(a.id)+'" class="cp-text-button">Excluir</button></div></article>';}).join(''):'<p class="cp-muted">Você ainda não criou alertas.</p>')+'</div>');
  workspace.querySelector('form').onsubmit=async function(event){
   event.preventDefault();var form=event.currentTarget,button=form.querySelector('[data-cp-local-submit]');if(button.disabled)return;
   try{
    var value=validateAlert({cargo:form.elements.cargo.value,cidade:form.elements.cidade.value,modalidades:Array.from(form.querySelectorAll('[name=modalidade]:checked')).map(function(el){return el.value;})}),rows=alerts(),old=rows.find(function(a){return a.id===form.dataset.editId;});
    if(!old&&rows.length>=20)throw Error('Você pode manter até 20 alertas. Edite ou exclua um deles para criar outro.');
    var newAlert=Object.assign({},value,{id:old?old.id:'alert-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),criadoEm:old?old.criadoEm:new Date().toISOString(),vistas:jobs().filter(function(j){return matchesAlert(j,value);}).map(function(j){return String(j.id);})});
    rows=old?rows.map(function(a){return a.id===old.id?newAlert:a;}):rows.concat(newAlert);
    button.disabled=true;toolStatus('Salvando seu alerta…');var notice=await saveAlerts(rows);if(identity()!==owner)return;openAlerts();toolStatus(notice);schedule();
   }catch(error){toolStatus(error.message+' Suas preferências locais foram preservadas.');}finally{button.disabled=false;}
  };
  bindToolForm(workspace.querySelector('form'));
 }
 async function showAlertJobs(id){
  var item=alerts().find(function(a){return a.id===id;});if(!item)return;
  var rows=jobs().filter(function(j){return matchesAlert(j,item);});
  openWorkspace('Vagas do seu alerta','<div class="cp-section-head"><div><h2>'+escape(item.cargo||'Todas as oportunidades')+'</h2><p>'+rows.length+' vaga'+(rows.length===1?'':'s')+' disponível'+(rows.length===1?'':'s')+'</p></div><button type="button" data-cp-action="alerts">Gerenciar alertas</button></div><div class="cp-alert-results">'+(rows.length?rows.map(function(j){var confidential=global.vagaEhConfidencialEM&&global.vagaEhConfidencialEM(j);return '<article><span class="cp-small-icon">'+icon('briefcase')+'</span><h3>'+escape(j.cargo||j.titulo)+'</h3><p>'+escape(confidential?'Empresa confidencial':j.empresa||'Empresa')+'</p><p>'+escape([j.cidade,j.uf].filter(Boolean).join(' – '))+' · '+escape(j.modalidade||'')+'</p><strong>'+escape(j.salario||'Salário a combinar')+'</strong><button type="button" class="cp-primary" data-cp-job-open="'+escape(j.id)+'">Ver vaga →</button></article>';}).join(''):'<p>Nenhuma vaga atende aos seus critérios neste momento. Você pode ajustar seu alerta.</p>')+'</div>');
  try{await saveAlerts(alerts().map(function(a){return a.id===id?Object.assign({},a,{vistas:Array.from(new Set((a.vistas||[]).concat(rows.map(function(j){return String(j.id);}))))}):a;}));}catch(error){toolStatus('As vagas foram exibidas. Não foi possível sincronizar a leitura na sua conta.');}
  schedule();
 }
 function showInterviewGuide(){
  var host=container.querySelector('.cp-next-interview'),next=host&&host.emInterview;
  openWorkspace('Prepare-se para sua entrevista','<div class="cp-tool-intro"><span class="cp-feature-icon">'+icon('calendar')+'</span><div><h2>'+escape(next&&next.job_title||'Sua próxima oportunidade')+'</h2><p>'+(next?escape(new Date(next.scheduled_at).toLocaleString('pt-BR')):'Confira a data no agendamento.')+'</p></div></div>'+(next?'<section class="cp-company-guidance"><h3>Orientações da empresa</h3><p>'+escape(String(next.instructions||'').replace(/^\[Online externo\] [^\n]*\n?/,'').replace(/^\[Presencial\]\s*/, '')||'Nenhuma orientação adicional informada.')+'</p></section>':'')+'<div class="cp-guide-grid"><article><h3>Antes da entrevista</h3><ul><li>Leia a descrição e os requisitos da vaga.</li><li>Separe exemplos reais das suas experiências.</li><li>Prepare uma pergunta sobre a rotina e as próximas etapas.</li></ul></article><article><h3>No horário marcado</h3><ul><li>Confira o local ou o link informado pela empresa.</li><li>Se for online, teste a internet, a câmera e o microfone.</li><li>Escolha um ambiente tranquilo e tenha seu currículo à mão.</li></ul></article></div><div class="cp-tool-actions"><button type="button" class="cp-primary" data-cp-action="interview">Simular entrevista</button>'+(next&&canJoin(next)?'<button type="button" class="cp-primary" data-cp-action="join">Entrar na entrevista</button>':'<button type="button" data-cp-action="interviews">Ver agendamento</button>')+'</div>');
 }
 function saveCurrentAnswer(){
  if(!workspace||!practice||!practice.interview||practice.interview.finishedAt)return;
  var answer=workspace.querySelector('#cpInterviewAnswer');if(!answer)return;
  practice.interview.answers[practice.interview.index]=answer.value.slice(0,4000);persistPractice();
 }
 function interviewSetup(){
  var draft=practice.interview,resumable=draft&&!draft.finishedAt,role=profile().cargoDesejado||'';
  openWorkspace('Simular entrevista','<div class="cp-tool-intro"><span class="cp-feature-icon">'+icon('message')+'</span><div><h2>Treine suas respostas com calma</h2><p>Seis perguntas por cargo, uma de cada vez.</p></div></div><p>Ao concluir, você recebe orientações automáticas de clareza e estrutura. Use experiências reais de trabalho, estudo ou projetos.</p><form id="cpInterviewSetup" class="cp-tool-form"><label>Cargo para o qual deseja se preparar<input name="cargo" required maxlength="100" value="'+escape(role)+'" placeholder="Ex.: Assistente Administrativo"></label><button type="submit" class="cp-primary">Começar simulação</button></form>'+(resumable?'<div class="cp-resume"><p>Você tem um treino em andamento para <strong>'+escape(draft.role)+'</strong>.</p><button type="button" data-cp-action="resume-interview">Retomar treino</button></div>':'')+'<p class="cp-muted">Suas respostas ficam neste navegador, vinculadas à sua conta. Você pode baixar um resumo ao terminar.</p>'+historyMarkup());
  workspace.querySelector('form').onsubmit=function(event){event.preventDefault();var role=event.currentTarget.elements.cargo.value.trim();if(!role){toolStatus('Informe o cargo que deseja praticar.');return;}practice.interview={role:role.slice(0,100),index:0,answers:[],startedAt:new Date().toISOString()};persistPractice();renderInterview();};
  bindToolForm(workspace.querySelector('form'));
 }
 function historyMarkup(){return practice.history.length?'<section class="cp-practice-records"><h2>Meus últimos treinos</h2>'+practice.history.slice(0,5).map(function(h){return '<p><strong>'+escape(h.title)+'</strong> · '+formatDate(h.at)+(h.percent!=null?' · '+Number(h.percent)+'% de acertos':'')+'</p>';}).join('')+'</section>':'';}
 function feedbackMarkup(answer){var f=responseFeedback(answer);return '<div class="cp-response-feedback">'+(f.strengths.length?'<h4>Pontos observados</h4><ul>'+f.strengths.map(function(t){return '<li>'+escape(t)+'</li>';}).join('')+'</ul>':'')+'<h4>Para aprimorar</h4><ul>'+f.suggestions.map(function(t){return '<li>'+escape(t)+'</li>';}).join('')+'</ul></div>';}
 function renderInterview(){
  var draft=practice.interview;if(!draft)return interviewSetup();if(draft.finishedAt)return interviewSummary();
  var questions=interviewQuestions(draft.role);draft.index=Math.max(0,Math.min(questions.length-1,Number(draft.index)||0));var q=questions[draft.index];
  openWorkspace('Simular entrevista','<div class="cp-training-progress"><span>'+escape(draft.role)+'</span><strong>Pergunta '+(draft.index+1)+' de '+questions.length+'</strong><progress max="'+questions.length+'" value="'+(draft.index+1)+'" aria-label="Progresso da entrevista"></progress></div><form id="cpInterviewForm" class="cp-tool-form"><label for="cpInterviewAnswer" class="cp-question-title">'+escape(q.text)+'</label><details class="cp-question-hint"><summary>Ver dica para responder</summary><p>'+escape(q.hint)+'</p></details><textarea id="cpInterviewAnswer" name="resposta" maxlength="4000" required minlength="20" rows="7" placeholder="Escreva sua resposta aqui.">'+escape(draft.answers[draft.index]||'')+'</textarea><small>Use pelo menos 20 caracteres. O rascunho é salvo neste navegador.</small><div class="cp-tool-actions">'+(draft.index?'<button type="button" data-cp-action="previous-question">Pergunta anterior</button>':'')+'<button type="submit" class="cp-primary">'+(draft.index===questions.length-1?'Concluir e ver orientações':'Próxima pergunta')+' '+icon('arrow')+'</button></div></form>');
  workspace.querySelector('textarea').addEventListener('input',function(){clearTimeout(draftTimer);draftTimer=setTimeout(function(){draftTimer=null;saveCurrentAnswer();},300);});
  workspace.querySelector('form').onsubmit=function(event){
   event.preventDefault();saveCurrentAnswer();if((draft.answers[draft.index]||'').trim().length<20){toolStatus('Desenvolva um pouco mais sua resposta antes de continuar.');return;}
   if(draft.index<questions.length-1){draft.index++;persistPractice();renderInterview();}else{draft.finishedAt=new Date().toISOString();practice.history.unshift({title:'Entrevista · '+draft.role,at:draft.finishedAt});practice.history=practice.history.slice(0,10);persistPractice();interviewSummary();schedule();}
  };
  bindToolForm(workspace.querySelector('form'));
 }
 function interviewSummary(){
  var draft=practice.interview;if(!draft)return interviewSetup();var qs=interviewQuestions(draft.role);
  openWorkspace('Seu treino de entrevista','<div class="cp-complete"><span class="cp-feature-icon">'+icon('check')+'</span><h2>Treino concluído!</h2><p>'+escape(draft.role)+' · '+qs.length+' perguntas respondidas</p></div><p>Revise as sugestões e pratique em voz alta. As orientações usam critérios de extensão e estrutura das respostas.</p><div class="cp-answer-review">'+qs.map(function(q,i){return '<details'+(i===0?' open':'')+'><summary>'+escape(q.text)+'</summary><h4>Sua resposta</h4><p class="cp-answer-text">'+escape(draft.answers[i]||'')+'</p>'+feedbackMarkup(draft.answers[i])+'</details>';}).join('')+'</div><div class="cp-tool-actions"><button type="button" class="cp-primary" data-cp-action="download-interview">'+icon('download')+' Baixar meu resumo</button><button type="button" data-cp-action="interview">Nova simulação</button><button type="button" data-cp-action="tests">Praticar testes</button></div>');
 }
 function downloadInterview(){
  var draft=practice.interview;if(!draft||!draft.finishedAt)return;
  var text='MEU TREINO DE ENTREVISTA — +Empregos\nCargo: '+draft.role+'\nData: '+formatDate(draft.finishedAt)+'\n\n'+interviewQuestions(draft.role).map(function(q,i){var f=responseFeedback(draft.answers[i]);return (i+1)+'. '+q.text+'\n\n'+(draft.answers[i]||'')+'\n\nSugestões:\n'+f.suggestions.map(function(s){return '• '+s;}).join('\n');}).join('\n\n----------------\n\n');
  var url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='meu-treino-entrevista.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);
 }
 function testsSetup(){
  var draft=practice.test;
  openWorkspace('Praticar testes','<div class="cp-tool-intro"><span class="cp-feature-icon">'+icon('book')+'</span><div><h2>Aprenda com cada resposta</h2><p>Cinco questões por tema, com explicações.</p></div></div><div class="cp-test-topics">'+Object.keys(tests).map(function(key){return '<button type="button" data-cp-test-start="'+key+'"><span class="cp-small-icon">'+icon(key==='atendimento'?'message':'book')+'</span><strong>'+tests[key].title+'</strong><small>5 questões · No seu ritmo</small>'+icon('arrow')+'</button>';}).join('')+'</div>'+(draft&&!draft.finishedAt?'<div class="cp-resume"><p>Há um teste de '+escape(tests[draft.topic]&&tests[draft.topic].title||'prática')+' em andamento.</p><button type="button" data-cp-action="resume-test">Retomar teste</button></div>':'')+'<p class="cp-muted">Esses exercícios são para praticar conhecimentos. Os resultados ficam neste navegador, vinculados à sua conta.</p>'+historyMarkup());
 }
 function startTest(topic){if(!tests[topic])return;practice.test={topic:topic,index:0,answers:[],startedAt:new Date().toISOString()};persistPractice();renderTest();}
 function renderTest(){
  var draft=practice.test,exam=draft&&tests[draft.topic];if(!exam)return testsSetup();if(draft.finishedAt)return testSummary();
  var q=exam.questions[draft.index],choice=draft.answers[draft.index],answered=Number.isInteger(choice);
  openWorkspace(exam.title,'<div class="cp-training-progress"><span>Praticar testes</span><strong>Questão '+(draft.index+1)+' de '+exam.questions.length+'</strong><progress max="'+exam.questions.length+'" value="'+(draft.index+1)+'" aria-label="Progresso do teste"></progress></div><form id="cpTestForm" class="cp-tool-form"><fieldset><legend class="cp-question-title">'+escape(q[0])+'</legend><div class="cp-test-options">'+q[1].map(function(option,i){return '<label class="'+(answered&&i===q[2]?'cp-correct-option':'')+'"><input type="radio" name="resposta" value="'+i+'" '+(choice===i?'checked':'')+' '+(answered?'disabled':'')+' required><span>'+escape(option)+'</span></label>';}).join('')+'</div></fieldset>'+(answered?'<div class="cp-test-explanation" role="status"><strong>'+(choice===q[2]?'Resposta correta!':'Confira a resposta correta')+'</strong><p>'+escape(q[3])+'</p></div><button type="button" class="cp-primary" data-cp-action="next-test">'+(draft.index===exam.questions.length-1?'Ver meu resultado':'Próxima questão')+' '+icon('arrow')+'</button>':'<button type="submit" class="cp-primary">Conferir resposta</button>')+'</form>');
  workspace.querySelector('form').onsubmit=function(event){event.preventDefault();var selected=event.currentTarget.querySelector('[name=resposta]:checked');if(!selected){toolStatus('Escolha uma resposta antes de conferir.');return;}draft.answers[draft.index]=Number(selected.value);persistPractice();renderTest();};
  bindToolForm(workspace.querySelector('form'));
 }
 function nextTest(){
  var draft=practice.test,exam=draft&&tests[draft.topic];if(!exam||!Number.isInteger(draft.answers[draft.index]))return;
  if(draft.index<exam.questions.length-1){draft.index++;persistPractice();renderTest();return;}
  var grade=gradeTest(draft.topic,draft.answers);draft.finishedAt=new Date().toISOString();practice.history.unshift({title:exam.title,at:draft.finishedAt,percent:grade.percent});practice.history=practice.history.slice(0,10);persistPractice();testSummary();schedule();
 }
 function testSummary(){
  var draft=practice.test,exam=draft&&tests[draft.topic];if(!exam)return testsSetup();var grade=gradeTest(draft.topic,draft.answers);
  openWorkspace('Seu resultado de prática','<div class="cp-complete"><span class="cp-feature-icon">'+icon('check')+'</span><h2>'+grade.correct+' de '+grade.total+' respostas corretas</h2><strong>'+grade.percent+'% de acertos</strong><p>'+exam.title+'</p></div><div class="cp-answer-review">'+exam.questions.map(function(q,i){return '<details><summary>'+escape(q[0])+'</summary><p><strong>Sua resposta:</strong> '+escape(q[1][draft.answers[i]]||'Sem resposta')+'</p><p><strong>Resposta correta:</strong> '+escape(q[1][q[2]])+'</p><p>'+escape(q[3])+'</p></details>';}).join('')+'</div><div class="cp-tool-actions"><button type="button" class="cp-primary" data-cp-test-start="'+draft.topic+'">Praticar novamente</button><button type="button" data-cp-action="tests">Escolher outro teste</button></div>');
 }
 function click(event){
  var target=event.target.closest('button');if(!target||!page.contains(target))return;
  if(target.dataset.cpLocalSubmit){event.preventDefault();event.stopPropagation();submitToolForm(target.closest('form'));return;}
  if(target.dataset.cpAction==='premium'){closeWorkspace(false);global.irPara('premium-candidato');return;}
  if(target.dataset.cpFit!=null){openCompatibility(target.dataset.cpFit);return;}
  if(target.dataset.cpAlertJob!=null){openAlerts(target.dataset.cpAlertJob);return;}
  if(target.dataset.cpAlertView){showAlertJobs(target.dataset.cpAlertView);return;}
  if(target.dataset.cpAlertEdit){openAlerts(null,target.dataset.cpAlertEdit);return;}
  if(target.dataset.cpAlertDelete){target.disabled=true;saveAlerts(alerts().filter(function(a){return a.id!==target.dataset.cpAlertDelete;})).then(function(message){openAlerts();toolStatus(message);schedule();}).catch(function(e){toolStatus(e.message);target.disabled=false;});return;}
  if(target.dataset.cpTestStart){startTest(target.dataset.cpTestStart);return;}
  if(target.dataset.cpApplyJob!=null){applyRecommendedJob(target.dataset.cpApplyJob);return;}
  if(target.dataset.cpJobOpen!=null){closeWorkspace(false);global.irPara('vaga',target.dataset.cpJobOpen);return;}
  if(target.dataset.cpApplication!=null){var row=applicationRows().find(function(a){return String(a.id)===target.dataset.cpApplication;}),controller=global.EmpregaMaisCandidaturasCandidato;if(controller)controller.abrir(row?statusKey(row):'todas');return;}
  var action=target.dataset.cpAction;if(!action)return;
  if(action==='recommendations')openRecommendations();
  else if(action==='recommendations-list'){
   var results=workspace&&workspace.querySelector('.cp-recommendations-grid,.cp-recommendations-empty');
   if(results){results.tabIndex=-1;results.focus({preventScroll:true});results.scrollIntoView({block:'start',behavior:'auto'});}
  }
  else if(action==='close')closeWorkspace();
  else if(action==='interview')openProfessional('simulator');
  else if(action==='resume-interview')renderInterview();
  else if(action==='previous-question'){saveCurrentAnswer();practice.interview.index=Math.max(0,practice.interview.index-1);persistPractice();renderInterview();}
  else if(action==='download-interview')downloadInterview();
  else if(action==='tests')openProfessional('tests');
  else if(action==='professional-results')openProfessional('results');
  else if(action==='resume-test')renderTest();
  else if(action==='next-test')nextTest();
  else if(action==='alerts')openAlerts();
  else if(action==='interview-guide')showInterviewGuide();
  else if(action==='join'){var host=container.querySelector('.cp-next-interview'),next=host&&host.emInterview;if(canJoin(next)&&global.EMInterviews)global.EMInterviews.openRoom(next);else toolStatus('Confira a confirmação e o horário no agendamento.');}
  else if(action==='messages'){closeWorkspace(false);var button=document.querySelector('.cp-header [data-route="messages"]');if(button)button.click();}
  else {closeWorkspace(false);if(action==='applications'||action==='analysis'||action==='interviews'){if(global.EmpregaMaisCandidaturasCandidato)global.EmpregaMaisCandidaturasCandidato.abrir(action==='interviews'?'entrevista':action==='analysis'?'avaliacao':'todas');}else if(global.irPara)global.irPara({saved:'salvas',search:'home',profile:'perfil',resume:'curriculo'}[action]||'painel-candidato');}
 }
 function mount(){
  page=document.getElementById('pagina-painel-candidato');container=page&&page.querySelector('.container-dashboard');
  syncProfessionalNav();
  if(workspace&&String(workspace.dataset.cpView).indexOf('professional-')===0&&!hasCompatibilityAccess())closeWorkspace(false);
  if(!container||!container.querySelector('.cp-layout')||!page.classList.contains('ativa'))return;
  if(!identity()){if(extra)extra.hidden=true;return;}
  if(owner!==identity()){if(workspace)closeWorkspace(false);owner=identity();loadPractice();}
  if(!page.classList.contains('cp-enhanced'))page.classList.add('cp-enhanced');
  if(!extra){
   extra=document.createElement('div');extra.className='cp-value-sections';extra.innerHTML='<div class="cp-follow-grid"><section class="cp-latest cp-panel" aria-label="Últimas candidaturas"></section><section class="cp-alert-card cp-panel" aria-label="Alertas de vagas"></section></div><section class="cp-preparation" aria-labelledby="cpPreparationTitle"><h2 id="cpPreparationTitle">Prepare-se para sua próxima oportunidade</h2><div class="cp-preparation-grid"><article class="cp-preparation-card cp-panel"><span class="cp-feature-icon">'+icon('video')+'</span><div class="cp-preparation-copy"><h3>Simulador de entrevista</h3><p>Pratique suas respostas e ganhe confiança.</p><small class="cp-practice-history" hidden></small><button type="button" class="cp-text-button cp-practice-tests" data-cp-action="tests">Praticar testes →</button></div><button type="button" class="cp-text-button" data-cp-action="interview">Começar treino →</button></article><article class="cp-preparation-card cp-resume-card cp-panel"><span class="cp-feature-icon">'+icon('document')+'</span><div class="cp-preparation-copy"><h3>Meu currículo</h3><p>Mantenha suas experiências atualizadas.</p></div><button type="button" class="cp-text-button" data-cp-action="resume">Atualizar currículo →</button></article></div></section>';
   var layout=container.querySelector('.cp-layout'),opportunities=layout.querySelector('.cp-opportunities');if(opportunities)opportunities.before(extra);else layout.appendChild(extra);
   var follow=extra.querySelector('.cp-follow-grid'),summary=container.querySelector('.cp-home-summary');
   if(summary)summary.after(follow);
   workspace=document.createElement('section');workspace.id='cpPreparationWorkspace';workspace.className='cp-workspace cp-panel';workspace.hidden=true;container.appendChild(workspace);
   page.addEventListener('click',click);
   page.addEventListener('keydown',function(event){
    if(event.key!=='Enter'||!workspace.contains(event.target)||event.target.tagName==='TEXTAREA'||event.target.tagName==='BUTTON')return;
    var form=event.target.closest('form');if(form&&formHandlers[form.id]){event.preventDefault();submitToolForm(form);}
   });
   var header=document.querySelector('.cp-header');if(header)header.addEventListener('click',function(e){if(e.target.closest('[data-route]'))closeWorkspace(false);},true);
  }
  extra.hidden=false;
  enhanceMetrics();renderLatest();renderAlertCard();renderPracticeCard();enhanceRecommendations();enhanceInterview();
  if(workspace&&workspace.dataset.cpView==='recommendations'&&page.classList.contains('cp-recommendations-active'))openRecommendations(true);
  applyWorkspaceFont(container);applyWorkspaceFont(document.getElementById('cpCandidateHeader'));
  var prep=container.querySelector('.cp-preparation');if(prep&&!prep.querySelector('[data-cp-action="professional-results"]')){var link=document.createElement('button');link.type='button';link.className='cp-text-button';link.dataset.cpAction='professional-results';link.textContent='Testes recebidos e meus resultados';prep.appendChild(link);}
 }
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;mount();});}
 function applyOrangePalette(scope){
  if(!scope)return;
  function orange(value){return value.replace(/rgba?\(([^)]+)\)/g,function(match,parts){var nums=parts.split(/[,\s/]+/).map(Number),r=nums[0]/255,g=nums[1]/255,b=nums[2]/255,max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;if(d<.03)return match;var h=max===r?((g-b)/d+6)%6:max===g?(b-r)/d+2:(r-g)/d+4;h*=60;if(h<245||h>315)return match;var l=(max+min)/2,s=d/(1-Math.abs(2*l-1));return 'hsla(21,'+Math.round(s*100)+'%,'+Math.round(l*100)+'%,'+(nums[3]==null?1:nums[3])+')';});}
  scope.querySelectorAll('*').forEach(function(el){var cs=getComputedStyle(el);['color','background-color','border-top-color','border-right-color','border-bottom-color','border-left-color','background-image'].forEach(function(prop){var value=cs.getPropertyValue(prop),next=orange(value);if(next!==value)el.style.setProperty(prop,next,'important');});});
 }
 function applyWorkspaceFont(scope){
  if(!scope)return;
  scope.querySelectorAll('h1,h2,h3,h4,p,span,small,strong,button,a,label,legend,input,textarea,dt,dd,li,summary').forEach(function(el){
   var family="Poppins,sans-serif";
   if(el.style.getPropertyValue('font-family')!==family)el.style.setProperty('font-family',family,'important');
  });
 }
 function start(){
  page=document.getElementById('pagina-painel-candidato');if(!page)return;
  var css=document.getElementById('cp-preparation-styles');if(css)document.head.appendChild(css);
  new MutationObserver(function(records){if(records.some(function(r){return r.type!=='attributes'||r.oldValue!==r.target.getAttribute('class');}))schedule();}).observe(page,{childList:true,subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['class']});
  ['empregamais:candidato-sincronizado','empregamais:candidaturas-sincronizadas','empregamais:atividade-candidato'].forEach(function(e){document.addEventListener(e,schedule);});
  global.addEventListener('storage',schedule);global.addEventListener('focus',schedule);global.addEventListener('load',schedule);
  global.addEventListener('pagehide',saveCurrentAnswer);
  global.addEventListener('popstate',function(){closeWorkspace(false);schedule();});
  var list=document.getElementById('listaVagas');if(list)new MutationObserver(schedule).observe(list,{childList:true});
  setInterval(function(){if(page.classList.contains('ativa')&&!document.hidden)schedule();},60000);
  mount();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})(typeof window!=='undefined'?window:globalThis);

/* Candidate profile editor. Sensitive data never enters resume/localStorage. */
(function(){
 if(typeof document==='undefined')return;
 'use strict';
 var dialog,opener,demoPrivate={},photo='',busy=false;
 var BASE='https://mkezlcewyengejdmtppl.supabase.co',KEY='sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR';
 var choices={identidade_genero:['Mulher cisgênero','Homem cisgênero','Mulher transgênero','Homem transgênero','Não binário','Outra','Prefiro não responder'],orientacao_sexual:['Assexual','Bissexual','Heterossexual','Homossexual','Pansexual','Outra','Prefiro não responder'],cor_raca:['Branca','Preta','Parda','Amarela','Indígena','Prefiro não responder']};
 function demo(){return new URLSearchParams(location.search).get('pagina')==='demo-candidato';}
 function owner(){return demo()?'demo-candidato':sessionStorage.getItem('candidatoUserId')||'';}
 function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 function current(){return window.obterCandidatoAtual&&window.obterCandidatoAtual()||{};}
 function read(k,f){try{return JSON.parse(localStorage.getItem(k)||'null')||f;}catch(e){return f;}}
 async function request(path,options){
  var token=sessionStorage.getItem('empregaMaisSupabaseAccessToken');if(!token)throw Error('Entre novamente na sua conta para salvar o perfil.');
  options=options||{};var res=await fetch(BASE+'/rest/v1/'+path,Object.assign({},options,{headers:Object.assign({apikey:KEY,Authorization:'Bearer '+token,'Content-Type':'application/json'},options.headers||{})}));
  if(!res.ok)throw Error('Não foi possível salvar ou carregar os dados privados. Tente novamente.');
  var text=await res.text();return text?JSON.parse(text):null;
 }
 function field(name,label,type,value,extra){return '<label>'+label+'<input name="'+name+'" type="'+(type||'text')+'" value="'+esc(value)+'" '+(extra||'')+'></label>';}
 function select(name,label){return '<label>'+label+'<select name="'+name+'"><option value="">Selecione (opcional)</option>'+choices[name].map(function(x){return '<option>'+esc(x)+'</option>';}).join('')+'</select></label>';}
 function status(text){dialog.querySelector('[role=status]').textContent=text;}
 function age(value){if(!value)return '';var d=new Date(value+'T12:00:00'),now=new Date();var n=now.getFullYear()-d.getFullYear();if(now.getMonth()<d.getMonth()||(now.getMonth()===d.getMonth()&&now.getDate()<d.getDate()))n--;return n>=0?n+' anos':'';}
 function profileIcon(name){var paths={"lock":"<rect x=\"5\" y=\"10\" width=\"14\" height=\"11\" rx=\"2\"/><path d=\"M8 10V7a4 4 0 0 1 8 0v3M12 14v3\"/>","user":"<circle cx=\"12\" cy=\"7\" r=\"4\"/><path d=\"M4 22v-3a8 8 0 0 1 16 0v3Z\"/>","pin":"<path d=\"M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z\"/><circle cx=\"12\" cy=\"10\" r=\"3\"/>","group":"<circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M2 22v-3a7 7 0 0 1 14 0v3M17 3a4 4 0 0 1 0 8m2 5a6 6 0 0 1 3 6\"/>","camera":"<path d=\"M3 7h4l2-4h6l2 4h4v14H3Z\"/><circle cx=\"12\" cy=\"13\" r=\"4\"/>","trash":"<path d=\"M4 6h16M9 6V3h6v3M6 6l1 16h10l1-16M10 10v8m4-8v8\"/>","document":"<path d=\"M5 2h10l4 4v16H5ZM14 2v6h5M8 12h8M8 16h6\"/>","check":"<path d=\"m4 12 5 5L20 5\"/>"};return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.user)+'</svg>';}
 function styles(){if(document.getElementById('emCandidateProfileStyle'))return;var el=document.createElement('style');el.id='emCandidateProfileStyle';el.textContent=`
 #emCandidateProfile{width:min(720px,calc(100vw - 32px));max-height:calc(100dvh - 32px);box-sizing:border-box;padding:0;border:1px solid #d3def3;border-radius:18px;background:#fff;color:#34333d;box-shadow:0 24px 80px #29575133;overflow:auto}
 #emCandidateProfile::backdrop{background:#0080c966}
 #emCandidateProfile *{box-sizing:border-box;font-family:Poppins,sans-serif!important}
 #emCandidateProfile .ep-head{display:flex;justify-content:space-between;gap:16px;padding:24px 28px;border-bottom:1px solid #e9eef8}
 #emCandidateProfile h2{font-size:23px!important;margin:0 0 6px;font-weight:700!important}#emCandidateProfile h3{font-size:16px!important;margin:0 0 12px;font-weight:650!important}
 #emCandidateProfile p{font-size:12px!important;line-height:1.7;color:#64748b!important;margin:0 0 14px}
 #emCandidateProfile button{cursor:pointer;border-radius:9px;border:1px solid #d3def3;background:#fff;color:#0080c9;padding:11px 15px;font-size:12px!important;font-weight:600!important}
 #emCandidateProfile button:disabled{opacity:.6;cursor:wait}#emCandidateProfile .ep-primary{background:linear-gradient(135deg,#0080c9,#0080c9);color:white;border-color:transparent}
 #emCandidateProfile section{padding:24px 28px;border-bottom:1px solid #e9eef8}#emCandidateProfile .ep-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
 #emCandidateProfile label{display:grid;gap:8px;font-size:12px!important;color:#374151!important;font-weight:500!important}
 #emCandidateProfile input,#emCandidateProfile select{width:100%;min-height:43px;padding:10px 12px;border:1px solid #d3def3;border-radius:8px;background:#fff;font-size:13px!important;color:#374151!important}
 #emCandidateProfile input:disabled{background:#f5f6fb}#emCandidateProfile .ep-consent{display:flex;align-items:flex-start;gap:10px;margin:18px 0;line-height:1.6}
 #emCandidateProfile .ep-consent input{width:18px;min-height:18px;height:18px;flex:0 0 18px;accent-color:#0080c9}
 #emCandidateProfile .ep-footer{padding:20px 28px;display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap}#emCandidateProfile [role=status]{padding:0 28px;font-size:12px;line-height:1.6}
 #emCandidateProfile .ep-photo{display:flex;gap:16px;align-items:center;margin-bottom:20px}#emCandidateProfile .ep-photo img{width:64px;height:64px;border-radius:50%;object-fit:cover}#emCandidateProfile input[type=file]{border:0;padding:0;font-size:11px!important}
 #emCandidateProfile :focus-visible{outline:3px solid #a4bef1;outline-offset:2px}#emCandidateProfile small{font-size:11px!important}
 @media(max-width:540px){#emCandidateProfile .ep-grid{grid-template-columns:1fr}#emCandidateProfile section,#emCandidateProfile .ep-head{padding:20px}#emCandidateProfile .ep-photo{align-items:flex-start;flex-direction:column}}
 
 /* Profile is a normal SPA tab, alongside the candidate navigation. */
 html body #pagina-perfil.ep-inline-profile-page>:not(#emCandidateProfile){display:none!important}
 html body #pagina-perfil.ep-inline-profile-page #emCandidateProfile{
 display:block!important;position:static!important;inset:auto!important;transform:none!important;
 width:calc(100% - 48px)!important;max-width:980px!important;max-height:none!important;
 height:auto!important;overflow:visible!important;margin:0 auto 32px!important;
 border:1px solid #d3def3!important;border-radius:14px!important;box-shadow:0 4px 20px #23494506!important;
 }
 @media(max-width:540px){html body #pagina-perfil.ep-inline-profile-page #emCandidateProfile{width:calc(100% - 28px)!important}}

 /* Approved petroleum profile layout. */
 html body #pagina-perfil.ep-inline-profile-page #emCandidateProfile#emCandidateProfile{width:calc(100% - 48px)!important;max-width:1220px!important;background:transparent!important;border:0!important;box-shadow:none!important}
 #emCandidateProfile#emCandidateProfile .ep-head{display:grid;grid-template-columns:minmax(0,1fr) 240px auto;align-items:center;gap:24px;padding:20px 28px;min-height:145px;background:linear-gradient(110deg,#f4f7fa,#edf3f7);border:1px solid #dce5ea;border-radius:12px;margin-bottom:20px}
 #emCandidateProfile#emCandidateProfile .ep-eyebrow{font-size:10px;color:#0080c9;letter-spacing:2px;font-weight:650;display:block;margin-bottom:10px}
 #emCandidateProfile#emCandidateProfile h2{font-size:30px!important;color:#0080c9!important;line-height:1.2;margin:0 0 8px}
 #emCandidateProfile#emCandidateProfile .ep-head p{margin:0!important;color:#64748b!important;font-size:13px!important}
 #emCandidateProfile#emCandidateProfile .ep-hero-art svg{width:100%;height:120px;display:block}
 #emCandidateProfile#emCandidateProfile form{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(0,1fr);gap:18px}
 #emCandidateProfile#emCandidateProfile form>section,#emCandidateProfile#emCandidateProfile .ep-photo-card{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:22px 24px;box-shadow:0 3px 10px #0080c904;margin:0;min-width:0}
 #emCandidateProfile#emCandidateProfile .ep-photo-card{grid-column:1/-1;display:flex;align-items:center;gap:20px;min-height:112px}
 #emCandidateProfile#emCandidateProfile .ep-avatar-placeholder{display:grid;place-items:center;width:76px;height:76px;flex:0 0 76px;background:#edf3f7;color:#0080c9;font-size:24px;font-weight:700;border-radius:50%}
 #emCandidateProfile#emCandidateProfile .ep-photo img{width:76px;height:76px;object-fit:cover;flex:0 0 76px;border-radius:50%}
 #emCandidateProfile#emCandidateProfile .ep-photo-copy{flex:1;min-width:0}
 #emCandidateProfile#emCandidateProfile .ep-photo-copy strong{font-size:18px;font-weight:700;color:#0080c9}
 #emCandidateProfile#emCandidateProfile .ep-photo-copy p{margin:5px 0 0!important;font-size:13px!important;color:#64748b!important}
 #emCandidateProfile#emCandidateProfile [hidden]{display:none!important}
 #emCandidateProfile#emCandidateProfile h3{display:flex;gap:12px;align-items:center;margin:0 0 18px;font-size:17px!important;color:#0080c9!important;font-weight:700!important}
 #emCandidateProfile#emCandidateProfile h3>span{font-size:15px;font-weight:500;color:#64748b}
 #emCandidateProfile#emCandidateProfile h3 svg{width:24px;height:24px;flex:0 0 24px;color:#0080c9}
 #emCandidateProfile#emCandidateProfile label{font-size:12px!important;color:#374151!important;gap:8px!important}
 #emCandidateProfile#emCandidateProfile .ep-grid{gap:20px 18px}
 #emCandidateProfile#emCandidateProfile input,#emCandidateProfile#emCandidateProfile select{font-size:13px!important;color:#374151!important;border:1px solid #d1d5db!important;border-radius:8px;min-height:44px;padding:11px 12px;background:#fff}
 #emCandidateProfile#emCandidateProfile input:disabled{background:#f8fbff;color:#0080c9!important}
 #emCandidateProfile#emCandidateProfile .ep-contact-card .ep-grid{grid-template-columns:repeat(6,minmax(0,1fr));gap:20px 14px}
 #emCandidateProfile#emCandidateProfile .ep-contact-card label{grid-column:span 2}
 #emCandidateProfile#emCandidateProfile .ep-contact-card label[data-field=email],#emCandidateProfile#emCandidateProfile .ep-contact-card label[data-field=telefone]{grid-column:span 3}
 #emCandidateProfile#emCandidateProfile .ep-diversity-card{grid-column:1/-1}
 #emCandidateProfile#emCandidateProfile .ep-diversity-card>.ep-grid{grid-template-columns:repeat(3,minmax(0,1fr));margin-top:16px}
 #emCandidateProfile#emCandidateProfile .ep-diversity-card p,#emCandidateProfile#emCandidateProfile .ep-consent{color:#64748b!important;font-size:12px!important}
 #emCandidateProfile#emCandidateProfile details{font-size:12px;color:#0080c9;margin:10px 0}
 #emCandidateProfile#emCandidateProfile summary{cursor:pointer}
 #emCandidateProfile#emCandidateProfile .ep-consent{display:flex;gap:10px;margin:20px 0 12px;align-items:flex-start}
 #emCandidateProfile#emCandidateProfile .ep-consent input{width:18px;min-height:18px;flex:0 0 18px;padding:0;accent-color:#0080c9}
 #emCandidateProfile#emCandidateProfile button{display:inline-flex;justify-content:center;align-items:center;gap:9px;padding:11px 16px;min-height:40px;border:1px solid #93c5fd;background:#fff;color:#0080c9!important;border-radius:8px;font-size:12px!important;font-weight:600!important;white-space:nowrap}
 #emCandidateProfile#emCandidateProfile button svg{width:19px;height:19px;flex:0 0 19px}
 #emCandidateProfile#emCandidateProfile .ep-primary{background:linear-gradient(110deg,#0080c9,#0080c9)!important;border-color:#0080c9!important;color:#fff!important;box-shadow:0 2px 7px #0080c910}
 #emCandidateProfile#emCandidateProfile .ep-footer{grid-column:1/-1;padding:0;display:flex;gap:12px;margin:0}
 #emCandidateProfile#emCandidateProfile [data-resume]{margin-right:auto}
 #emCandidateProfile#emCandidateProfile [role=status]{grid-column:1/-1;padding:0;color:#0080c9}
 #emCandidateProfile#emCandidateProfile [role=status]:empty{display:none}
 #emCandidateProfile#emCandidateProfile :focus-visible{outline:3px solid #93c5fd;outline-offset:2px}
 html body.cp-shell-active{--candidate-primary:#34333d;--candidate-accent:#34333d;--candidate-soft:#eff6ff}
 html body.cp-shell-active #cpCandidateHeader#cpCandidateHeader .cp-navigation button[aria-current=page]{background:linear-gradient(110deg,#34333d,#34333d)!important;color:#fff!important;box-shadow:0 3px 10px #26524d1a!important}
 html body.cp-shell-active #cpCandidateHeader#cpCandidateHeader .cp-navigation button[aria-current=page]:hover{background:#34333d!important}
 html body.cp-shell-active #cpCandidateHeader#cpCandidateHeader .cp-notification-dot{background:#34333d}
 @layer site-typography{
 #emCandidateProfile#emCandidateProfile label{color:#374151!important} #emCandidateProfile#emCandidateProfile p,#emCandidateProfile#emCandidateProfile small{color:#64748b!important}
 #emCandidateProfile#emCandidateProfile .ep-primary,#emCandidateProfile#emCandidateProfile .ep-primary span{color:#fff!important}
 }
 @media(max-width:1100px){
 #emCandidateProfile#emCandidateProfile .ep-head{grid-template-columns:minmax(0,1fr) 150px auto;gap:16px}
 #emCandidateProfile#emCandidateProfile form{grid-template-columns:1fr}
 #emCandidateProfile#emCandidateProfile .ep-photo-card{gap:14px;flex-wrap:wrap}
 }
 @media(max-width:700px){
 #emCandidateProfile#emCandidateProfile .ep-head{grid-template-columns:minmax(0,1fr) auto;padding:20px;min-height:130px}
 #emCandidateProfile#emCandidateProfile .ep-hero-art{display:none}
 #emCandidateProfile#emCandidateProfile h2{font-size:26px!important}
 #emCandidateProfile#emCandidateProfile form>section,#emCandidateProfile#emCandidateProfile .ep-photo-card{padding:20px}
 #emCandidateProfile#emCandidateProfile .ep-diversity-card>.ep-grid{grid-template-columns:1fr}
 #emCandidateProfile#emCandidateProfile .ep-photo-copy{flex-basis:calc(100% - 96px)}
 #emCandidateProfile#emCandidateProfile .ep-footer{flex-wrap:wrap}
 }
 @media(max-width:540px){
 html body #pagina-perfil.ep-inline-profile-page #emCandidateProfile#emCandidateProfile{width:calc(100% - 28px)!important}
 #emCandidateProfile#emCandidateProfile .ep-head{grid-template-columns:1fr;gap:14px}
 #emCandidateProfile#emCandidateProfile .ep-head>button{justify-self:start}
 #emCandidateProfile#emCandidateProfile .ep-grid,#emCandidateProfile#emCandidateProfile .ep-contact-card .ep-grid{grid-template-columns:1fr}
 #emCandidateProfile#emCandidateProfile .ep-contact-card label{grid-column:1!important}
 #emCandidateProfile#emCandidateProfile .ep-footer button{flex:1 1 auto}
 #emCandidateProfile#emCandidateProfile [data-resume]{margin-right:0}
 }
`;document.head.appendChild(el);}
 function refresh(){var p=current();if(window.EmpregaMaisAtualizarPainelCloud)window.EmpregaMaisAtualizarPainelCloud();document.dispatchEvent(new Event('empregamais:candidato-sincronizado'));document.querySelectorAll('.cp-name,.cp-greeting-name').forEach(function(n){n.textContent=p.nome||'';});document.querySelectorAll('.cp-location').forEach(function(n){n.textContent=[p.cidade,p.uf].filter(Boolean).join(' – ');});document.querySelectorAll('.cp-avatar,.cp-user-avatar').forEach(function(n){if(/^data:image\/(jpeg|png|webp);base64,/.test(p.fotoPerfil||'')){n.style.setProperty('background-image','url("'+p.fotoPerfil+'")','important');n.style.backgroundSize='cover';n.style.backgroundPosition='center';n.textContent='';}else{n.style.removeProperty('background-image');n.textContent=String(p.nome||'').split(/\s+/).filter(Boolean).slice(0,2).map(function(s){return s[0];}).join('').toUpperCase();}});}
 async function open(){
  if(busy)return;if(dialog&&dialog.isConnected)dialog.remove();styles();opener=document.activeElement;if(window.irPara)window.irPara('perfil');var p=current(),uid=owner();photo=p.fotoPerfil||'';
  dialog=document.createElement('section');dialog.id='emCandidateProfile';dialog.setAttribute('aria-labelledby','epTitle');
  var today=new Date().toLocaleDateString('en-CA');
  dialog.innerHTML='<div class="ep-head"><div><h2 id="epTitle">Meu perfil</h2><p>Atualize seus dados pessoais e suas preferências.</p></div><button type="button" data-close aria-label="Voltar ao painel">← Voltar</button></div><form><section><h3>Dados pessoais</h3><div class="ep-photo"><img alt="Foto do perfil" hidden><label>Foto de perfil (opcional)<input type="file" name="foto" accept="image/jpeg,image/png,image/webp"></label><button type="button" data-remove-photo>Remover foto</button></div><div class="ep-grid">'+field('nome','Nome completo','text',p.nome,'required maxlength="150" autocomplete="name"')+field('nome_social','Nome social (opcional)','text','','maxlength="120"')+field('data_nascimento','Data de nascimento (opcional)','date','','min="1900-01-01" max="'+today+'"')+'<label>Idade calculada<input name="idade" disabled></label>'+field('email','E-mail da conta','email',p.email||sessionStorage.getItem('candidatoEmail'),'disabled')+field('telefone','Celular / WhatsApp','tel',p.telefone,'maxlength="30" autocomplete="tel"')+field('cep','CEP','text',p.cep,'inputmode="numeric" maxlength="9" autocomplete="postal-code"')+field('cidade','Cidade','text',p.cidade,'required maxlength="120" autocomplete="address-level2"')+field('uf','Estado (UF)','text',p.uf,'required minlength="2" maxlength="2" pattern="[A-Za-z]{2}" autocomplete="address-level1"')+'</div><p>O e-mail identifica sua conta. A data de nascimento e o nome social ficam privados nesta seção.</p></section><section><h3>Diversidade · opcional</h3><p>Você pode deixar estes campos em branco sem impedir suas candidaturas. As respostas ficam privadas e não são usadas para calcular aderência, classificar ou eliminar candidatos.</p><details><summary>Por que pedimos essas informações?</summary><p>Este espaço permite registrar voluntariamente sua autodeclaração para iniciativas de diversidade e inclusão. Atualmente, as respostas ficam acessíveis somente a você e não são compartilhadas com empresas.</p></details><div class="ep-grid">'+select('identidade_genero','Identidade de gênero')+select('orientacao_sexual','Orientação sexual')+select('cor_raca','Cor ou raça')+'</div><label class="ep-consent"><input type="checkbox" name="consentimento"><span>Autorizo o EmpregaMais a armazenar minhas respostas opcionais de diversidade no meu perfil privado. Posso retirar esta autorização e excluir as respostas a qualquer momento.</span></label><button type="button" data-clear>Excluir respostas de diversidade</button></section><div role="status" aria-live="polite"></div><div class="ep-footer"><button type="button" data-resume>Editar currículo</button><button type="button" data-close>Cancelar</button><button class="ep-primary" type="submit">Salvar alterações</button></div></form>';
  
  /* Build real independent cards while preserving named form fields and handlers. */
  var head=dialog.querySelector('.ep-head');head.querySelector('h2').insertAdjacentHTML('beforebegin','<span class="ep-eyebrow">PERFIL DO CANDIDATO</span>');
  var heroArt=document.createElement('div');heroArt.className='ep-hero-art';heroArt.setAttribute('aria-hidden','true');heroArt.innerHTML="<svg viewBox=\"0 0 280 150\" aria-hidden=\"true\"><rect x=\"12\" y=\"40\" width=\"245\" height=\"95\" rx=\"36\" fill=\"#e2ebf2\" opacity=\".55\"/><rect x=\"52\" y=\"18\" width=\"174\" height=\"114\" rx=\"9\" fill=\"#fff\" stroke=\"#0080c9\"/><circle cx=\"90\" cy=\"61\" r=\"24\" fill=\"#edf3f7\"/><circle cx=\"90\" cy=\"54\" r=\"9\" fill=\"#0080c9\"/><path d=\"M72 78c2-20 34-20 36 0\" fill=\"#0080c9\"/><g stroke=\"#b6cbd8\" stroke-width=\"5\" stroke-linecap=\"round\"><path d=\"M126 44h68M126 60h57M126 76h53M72 111h98\"/></g><circle cx=\"225\" cy=\"27\" r=\"20\" fill=\"#0080c9\"/><path d=\"m225 15 3 5 6-1 1 6 4 3-4 4-1 6-6-1-3 4-3-4-6 1-1-6-4-4 4-3 1-6 6 1Z\" fill=\"#fff\"/><circle cx=\"225\" cy=\"28\" r=\"4\" fill=\"#0080c9\"/></svg>";head.insertBefore(heroArt,head.querySelector('[data-close]'));head.querySelector('[data-close]').textContent='← Voltar ao painel';
  var profileForm=dialog.querySelector('form'),personal=profileForm.querySelector('section'),photoRow=personal.querySelector('.ep-photo'),grid=personal.querySelector('.ep-grid'),diversity=profileForm.querySelectorAll('section')[1];
  personal.classList.add('ep-personal-card');personal.querySelector('h3').innerHTML=profileIcon('user')+'Dados pessoais';
  var contact=document.createElement('section');contact.className='ep-contact-card';contact.innerHTML='<h3>'+profileIcon('pin')+'Contato e localização</h3><div class="ep-grid"></div>';personal.after(contact);
  ['email','telefone','cep','cidade','uf'].forEach(function(name){var input=grid.querySelector('[name="'+name+'"]');if(input){input.closest('label').dataset.field=name;contact.querySelector('.ep-grid').appendChild(input.closest('label'));}});
  var personalNote=personal.querySelector('p');if(personalNote)personalNote.remove();
  personal.querySelector('h3').insertAdjacentHTML('afterend','<p class="ep-privacy-note">'+profileIcon('lock')+'<span><strong>Fique tranquilo!</strong> Seu nome social e sua data de nascimento ficam privados nesta seção. O e-mail identifica sua conta e pode ser usado na recuperação de acesso. Nome e contato podem ser exibidos às empresas nas suas candidaturas.</span></p>');
  profileForm.prepend(photoRow);photoRow.classList.add('ep-photo-card');photoRow.querySelector('label').hidden=true;
  photoRow.insertAdjacentHTML('afterbegin','<span class="ep-avatar-placeholder">'+esc(String(p.nome||'').split(/\\s+/).filter(Boolean).slice(0,2).map(function(x){return x[0];}).join('').toUpperCase())+'</span>');
  var photoCopy=document.createElement('div');photoCopy.className='ep-photo-copy';photoCopy.innerHTML='<strong class="ep-photo-name">'+esc(p.nome||'Seu perfil')+'</strong><p>Foto de perfil opcional</p>';photoRow.insertBefore(photoCopy,photoRow.querySelector('[data-remove-photo]'));
  var addPhoto=document.createElement('button');addPhoto.type='button';addPhoto.className='ep-primary ep-add-photo';addPhoto.innerHTML=profileIcon('camera')+'Adicionar foto';addPhoto.onclick=function(){profileForm.elements.foto.click();};photoRow.insertBefore(addPhoto,photoRow.querySelector('[data-remove-photo]'));
  photoRow.querySelector('[data-remove-photo]').innerHTML=profileIcon('trash')+'Remover';
  diversity.classList.add('ep-diversity-card');diversity.querySelector('h3').innerHTML=profileIcon('group')+'Diversidade <span>· opcional</span>';
  diversity.querySelector('[data-clear]').innerHTML=profileIcon('trash')+'Excluir respostas';
  dialog.querySelector('[data-resume]').innerHTML=profileIcon('document')+'Editar currículo';
  dialog.querySelector('[type=submit]').innerHTML=profileIcon('check')+'Salvar alterações';
  dialog.querySelectorAll('.ep-primary').forEach(function(button){button.style.setProperty('color','#fff','important');});

  var profilePage=document.getElementById('pagina-perfil');if(!profilePage){status('Não foi possível abrir a aba Perfil.');return;}profilePage.classList.add('ep-inline-profile-page');profilePage.appendChild(dialog);var form=dialog.querySelector('form'),ready=false;
  function close(){if(busy)return;dialog.remove();dialog=null;if(window.irPara)window.irPara('painel-candidato');}
  dialog.addEventListener('cancel',function(e){e.preventDefault();close();});dialog.querySelectorAll('[data-close]').forEach(function(b){b.onclick=close;});
  dialog.querySelector('[data-resume]').onclick=function(){close();if(window.irPara)window.irPara('curriculo');};
  function preview(){var img=dialog.querySelector('.ep-photo img');img.hidden=!photo;var placeholder=dialog.querySelector('.ep-avatar-placeholder');if(placeholder)placeholder.hidden=!!photo;if(photo)img.src=photo;else img.removeAttribute('src');}preview();
  dialog.querySelector('[data-remove-photo]').onclick=function(){photo='';form.elements.foto.value='';preview();};
  form.elements.foto.onchange=async function(){var file=this.files[0];if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024){status('Escolha uma imagem JPG, PNG ou WebP de até 5 MB.');this.value='';return;}try{var bitmap=await createImageBitmap(file),canvas=document.createElement('canvas'),scale=Math.min(1,240/Math.max(bitmap.width,bitmap.height));canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);photo=canvas.toDataURL('image/jpeg',.8);bitmap.close();preview();}catch(e){status('Não foi possível abrir essa foto. Escolha outra imagem.');}};
  form.elements.data_nascimento.onchange=function(){form.elements.idade.value=age(this.value);};
  form.elements.consentimento.onchange=function(){if(!this.checked)Object.keys(choices).forEach(function(k){form.elements[k].value='';});};
  form.elements.cep.onchange=async function(){var cep=this.value.replace(/\D/g,'');if(cep.length!==8)return;var original=this.value;try{var res=await fetch('https://viacep.com.br/ws/'+cep+'/json/'),data=await res.json();if(dialog&&form.elements.cep.value===original&&!data.erro){form.elements.cidade.value=data.localidade;form.elements.uf.value=data.uf;}}catch(e){if(dialog)status('Preencha cidade e estado manualmente.');}};
  dialog.querySelector('[data-clear]').onclick=async function(){if(!ready||busy)return;Object.keys(choices).forEach(function(k){form.elements[k].value='';});form.elements.consentimento.checked=false;busy=true;try{if(demo())demoPrivate=Object.assign({},demoPrivate,{identidade_genero:'',orientacao_sexual:'',cor_raca:'',consentimento_em:null,consentimento_versao:null});else await request('candidato_dados_privados?user_id=eq.'+encodeURIComponent(uid),{method:'PATCH',body:JSON.stringify({identidade_genero:'',orientacao_sexual:'',cor_raca:'',consentimento_em:null,consentimento_versao:null,atualizado_em:new Date().toISOString()})});status('Respostas de diversidade excluídas.');}catch(e){status(e.message);}finally{busy=false;}};
  form.onsubmit=async function(e){
   e.preventDefault();if(!ready||busy)return;if(uid!==owner()){status('Sua conta mudou. Feche e abra novamente o perfil.');return;}
   var f=form.elements,hasDiversity=Object.keys(choices).some(function(k){return !!f[k].value;});if(hasDiversity&&!f.consentimento.checked){status('Autorize o armazenamento das respostas de diversidade ou deixe os campos em branco.');f.consentimento.focus();return;}
   var privateData={user_id:uid,nome_social:f.nome_social.value.trim(),data_nascimento:f.data_nascimento.value||null,consentimento_em:hasDiversity?new Date().toISOString():null,consentimento_versao:hasDiversity?'perfil-diversidade-v1':null,atualizado_em:new Date().toISOString()};Object.keys(choices).forEach(function(k){privateData[k]=f[k].value;});
   busy=true;form.querySelector('[type=submit]').disabled=true;status('Salvando seu perfil…');
   try{
    if(demo())demoPrivate=privateData;else{var rows=await request('candidato_dados_privados?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(privateData)});if(!rows||rows.length!==1)throw Error('Os dados privados não foram salvos.');}
    if(uid!==owner())throw Error('Sua conta mudou durante o salvamento. Abra novamente o perfil.');
    var email=sessionStorage.getItem('candidatoEmail'),list=read('candidatosEmpregaMais',[]),index=list.findIndex(function(c){return c.email===email;}),next=Object.assign({},current(),{nome:f.nome.value.trim(),telefone:f.telefone.value.trim(),cep:f.cep.value.replace(/\D/g,''),cidade:f.cidade.value.trim(),uf:f.uf.value.toUpperCase(),fotoPerfil:photo});
    if(index<0)list.push(next);else list[index]=next;localStorage.setItem('candidatosEmpregaMais',JSON.stringify(list));sessionStorage.setItem('candidatoNome',next.nome);sessionStorage.setItem('candidatoTelefone',next.telefone);sessionStorage.setItem('candidatoCep',next.cep);
    var cv=read('empregaMaisDadosCurriculoV87:'+email,{});Object.assign(cv,{cvNomeV87:next.nome,cvTelefoneV87:next.telefone,cvEmailV87:email,cvCidadePessoalV87:next.cidade});localStorage.setItem('empregaMaisDadosCurriculoV87:'+email,JSON.stringify(cv));
    if(!demo()){if(!window.EmpregaMaisPerfilCloud)throw Error('Dados privados salvos; os dados pessoais aguardam sincronização.');await window.EmpregaMaisPerfilCloud.flush();}
    refresh();var photoName=dialog.querySelector('.ep-photo-name');if(photoName)photoName.textContent=next.nome;status(demo()?'Perfil atualizado nesta demonstração. Diversidade permanece somente nesta sessão.':'Perfil e dados privados salvos na sua conta.');
   }catch(error){status(error.message);}finally{busy=false;form.querySelector('[type=submit]').disabled=false;}
  };
  form.querySelector('[type=submit]').disabled=true;status('Carregando seus dados privados…');
  try{if(!uid)throw Error('Entre na sua conta para editar o perfil.');var rows=demo()?[demoPrivate]:await request('candidato_dados_privados?select=*&user_id=eq.'+encodeURIComponent(uid)+'&limit=1');if(!dialog||uid!==owner())return;var data=rows&&rows[0]||{};['nome_social','data_nascimento'].concat(Object.keys(choices)).forEach(function(k){form.elements[k].value=data[k]||'';});form.elements.idade.value=age(data.data_nascimento);form.elements.consentimento.checked=!!data.consentimento_em;ready=true;form.querySelector('[type=submit]').disabled=false;status('');}catch(e){if(dialog)status(e.message);}
 }
 document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button,a');if(!b||b.closest('#emCandidateProfile')||b.classList.contains('cp-greeting'))return;var action=b.getAttribute('data-cp-action'),route=b.getAttribute('data-route'),inline=b.getAttribute('onclick')||'';if(action==='profile'||route==='perfil'||(/irPara\(['"]perfil['"]\)/.test(inline)&&b.closest('#pagina-painel-candidato'))){e.preventDefault();e.stopImmediatePropagation();open();}},true);
 window.EmpregaMaisEditarPerfilCandidato=open;
 function ensureProfileTab(){var page=document.getElementById('pagina-perfil');if(page&&page.classList.contains('ativa')&&(!dialog||!dialog.isConnected))open();}
 if(document.body)new MutationObserver(ensureProfileTab).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
 window.addEventListener('popstate',ensureProfileTab);
 setTimeout(ensureProfileTab,0);

 document.addEventListener('empregamais:candidato-sincronizado',function(){var p=current();document.querySelectorAll('.cp-avatar,.cp-user-avatar').forEach(function(n){if(/^data:image\/(jpeg|png|webp);base64,/.test(p.fotoPerfil||'')){n.style.setProperty('background-image','url("'+p.fotoPerfil+'")','important');n.style.backgroundSize='cover';n.style.backgroundPosition='center';n.textContent='';}});});
})();


/* Legacy portal readability only; public text sizes and colors are set in CSS. */
(function(){
 if(typeof document==='undefined')return;
 'use strict';
 var sizes=new WeakMap(),colors=new WeakSet(),observed=new WeakSet(),queued=false;
 function rgb(s){var n=String(s).match(/[\d.]+/g);return n&&n.length>=3?n.slice(0,3).map(Number):null;}
 function luminance(c){return c.reduce(function(n,v,i){v/=255;return n+[.2126,.7152,.0722][i]*(v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4));},0);}
 function background(el){for(var n=el;n;){var s=getComputedStyle(n);if(s.backgroundImage!=='none')return null;var v=s.backgroundColor,c=rgb(v);if(c&&(!/^rgba/.test(v)||Number((v.match(/[\d.]+/g)||[])[3])>=1)&&v!=='transparent')return c;n=n.parentElement||(n.getRootNode&&n.getRootNode().host);}return [255,255,255];}
 function watch(root){if(observed.has(root))return;observed.add(root);new MutationObserver(schedule).observe(root,{childList:true,subtree:true});}
 function scan(root){watch(root);var updates=[];root.querySelectorAll('*').forEach(function(el){
  if(el.closest('#pagina-home,#pagina-vaga,#pagina-vagas-destaque,header.topo,footer,.em-vf-popover'))return;
  if(el.shadowRoot)scan(el.shadowRoot);
  if(el.closest('#emCandidateProfile,.m3-welcome,#emCandidateAccountMenu,#listaVagas .em-r4-footer-badge,#listaVagas .em-r4-terms,#listaDestaques .dz-work-meta,svg,script,style,h1,h2,h3,h4,h5,h6,[aria-hidden=true],.fa,.fas,.far,.fab,.material-icons,.material-symbols-outlined'))return;
  var text=Array.from(el.childNodes).some(function(n){return n.nodeType===3&&n.textContent.trim();});
  if(!text&&!el.matches('input:not([type=checkbox]):not([type=radio]),textarea,select'))return;
  var style=getComputedStyle(el),size=parseFloat(style.fontSize);
  if(!sizes.has(el)&&size>=8&&size<=14){sizes.set(el,size);updates.push(function(){el.style.setProperty('font-size',(size+1)+'px','important');});}
  // Resume fields have explicit title/value colors, including before wizard setup.
  if(colors.has(el)||!style.color||el.closest('#curriculoOnlineV84,#cvResumeWizard'))return;var action=el.closest('button,a,[role="button"]');if(action&&(action.classList.contains('ep-primary')||action.getAttribute('aria-pressed')==='true'||action.getAttribute('aria-current')==='page'||getComputedStyle(action).backgroundImage!=='none'))return;var c=rgb(style.color);if(!c)return;
  var backgroundColor=background(el);if(!backgroundColor)return;var l=luminance(c),bg=luminance(backgroundColor),contrast=(Math.max(l,bg)+.05)/(Math.min(l,bg)+.05);
  if(bg>.65&&l>.105&&contrast<5&&Math.max.apply(null,c)-Math.min.apply(null,c)<100){updates.push(function(){el.style.setProperty('color','var(--candidate-contrast-ink, #74639b)','important');});colors.add(el);}
 });updates.forEach(function(update){update();});}
 function schedule(){if(queued)return;queued=true;setTimeout(function(){queued=false;if(document.body)scan(document.body);},120);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
 window.addEventListener('load',schedule);window.addEventListener('resize',schedule);
 document.addEventListener('empregamais:candidato-sincronizado',schedule);
})();


/* Candidate account dropdown, anchored to the persistent toolbar. */
(function(){
 if(typeof document==='undefined')return;
 'use strict';var panel,trigger;
 function esc(v){return String(v||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
 function icon(type){
 var art={
 bell:'<path d="M6 17h12l-2-3V9a4 4 0 0 0-8 0v5Z" fill="#eff6ff"/><path d="M6 17h12l-2-3V9a4 4 0 0 0-8 0v5ZM10 19a2 2 0 0 0 4 0" stroke="#34333d"/><circle cx="12" cy="4" r="1" fill="#34333d" stroke="none"/><path d="m19 5 1-1m0 4 2-.3m-3-6 .5-1" stroke="#93c5fd"/>',
 key:'<path d="m12 2 8 3v7c0 5-8 10-8 10S4 17 4 12V5Z" fill="#eff6ff" stroke="#34333d"/><path d="m12 11-3 6m1-2 2 1" stroke="#34333d"/><circle cx="13" cy="9" r="1.8" stroke="#34333d"/>',
 mail:'<rect x="6" y="3" width="12" height="13" rx="1.5" fill="#eff6ff" stroke="#93c5fd"/><path d="M9 7h6M9 10h6" stroke="#93c5fd"/><path d="m3 10 9 7 9-7v11H3Z" fill="#f8fcfe" stroke="#34333d"/><path d="m3 10 3-2m15 2-3-2" stroke="#34333d"/>',
 crown:'<path d="m2 8 5 3 5-8 5 8 5-3-3 11H5Z" fill="#0080c9" stroke="#0080c9"/><path d="M5 22h14" stroke="#0080c9"/><g fill="#0080c9" stroke="none"><circle cx="2" cy="7" r="1.4"/><circle cx="12" cy="2.5" r="1.4"/><circle cx="22" cy="7" r="1.4"/></g>',
 power:'<path d="M12 2v10M6 5a9 9 0 1 0 12 0" stroke="currentColor"/>'
 };return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(art[type]||art.key)+'</svg>';
 }
 function close(focus){if(panel)panel.remove();panel=null;if(trigger){trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus();}}
 function place(){if(!panel||!trigger)return;var r=trigger.getBoundingClientRect();panel.style.top=Math.min(r.bottom+10,innerHeight-120)+'px';panel.style.right=Math.max(12,innerWidth-r.right)+'px';}
 function go(route){close();if(route==='profile'){window.EmpregaMaisEditarPerfilCandidato();return;}if(window.irPara)window.irPara(route);if(route==='painel-candidato')setTimeout(function(){var b=document.querySelector('[data-cp-action="alerts"]');if(b)b.click();},80);}
 function info(key){
  close();window.EmpregaMaisEditarPerfilCandidato();setTimeout(function(){
 if(typeof document==='undefined')return;
   var host=document.getElementById('emCandidateProfile');if(!host)return;var old=host.querySelector('.em-account-details');if(old)old.remove();var card=document.createElement('section');card.className='em-account-details';card.tabIndex=-1;
   var texts={access:['Dados de acesso','Seu e-mail de acesso é o informado no perfil. Para alterar sua senha, use a opção Recuperar senha.'],communications:['Comunicações','As mensagens das empresas e os convites de entrevista ficam disponíveis na aba Mensagens. Seus alertas de vagas podem ser ajustados em Alertas de vagas.'],visibility:['Visibilidade do currículo','O envio de uma candidatura compartilha seu currículo com a empresa responsável pela vaga. Os dados de diversidade ficam privados e não são incluídos no currículo.'],status:['Status da conta','Você está conectado à sua conta de candidato. Encerrar sessão desconecta este dispositivo e preserva seus dados.']},copy=texts[key];
   card.innerHTML='<h3>'+icon(key==='visibility'?'eye':'gear')+copy[0]+'</h3><p>'+copy[1]+'</p>';
   if(key==='access'){var reset=document.createElement('button');reset.type='button';reset.textContent='Recuperar senha';reset.onclick=function(){if(window.EmpregaMaisRecuperarSenhaV1)window.EmpregaMaisRecuperarSenhaV1.abrir('candidato');else{var link=document.querySelector('[onclick*="Recupera"],[onclick*="recupera"]');if(link)link.click();else card.querySelector('p').textContent='Na página de acesso do candidato, escolha Esqueci minha senha para receber o link de redefinição.';}};card.appendChild(reset);}
   host.querySelector('form').prepend(card);card.scrollIntoView({behavior:'smooth',block:'center'});card.focus();
  },100);
 }
 function open(button,keyboard){
  if(panel){close(true);return;}trigger=button;var p=window.obterCandidatoAtual&&window.obterCandidatoAtual()||{},name=p.nome||sessionStorage.getItem('candidatoNome')||'Minha conta',completion=(document.querySelector('.cp-completion')||{}).textContent||'Confira seu currículo';
  panel=document.createElement('section');panel.id='emCandidateAccountMenu';panel.setAttribute('aria-label','Minha conta');
  var photo=/^data:image\/(jpeg|png|webp);base64,/.test(p.fotoPerfil||'')?'<img alt="" src="'+p.fotoPerfil+'">':'<span class="em-account-initials">'+esc(name.split(/\s+/).filter(Boolean).slice(0,2).map(function(x){return x[0];}).join('').toUpperCase())+'</span>';
  panel.innerHTML='<div class="em-account-top"><span class="em-account-avatar">'+photo+'</span><div><strong>'+esc(name)+'</strong><small>Minha conta</small></div><button type="button" data-account="close" aria-label="Fechar menu">×</button></div><div class="em-account-links">'+[['alerts','Alertas de vagas','bell'],['access','Dados de acesso','key'],['communications','Comunicações','mail'],['premium-candidato','Conhecer Premium','crown']].map(function(r){return '<button type="button" data-account="'+r[0]+'">'+'<span class="em-account-card-icon">'+icon(r[2])+'</span><span>'+r[1]+'</span></button>';}).join('')+'</div><button type="button" class="em-account-logout" data-account="logout">'+icon('power')+'Encerrar sessão</button>';
  var footer=document.createElement('div');footer.className='em-account-footer';footer.appendChild(panel.querySelector('.em-account-logout'));panel.appendChild(footer);panel.querySelectorAll('.em-account-initials').forEach(function(el){el.style.setProperty('color','#fff','important');});panel.querySelectorAll('*').forEach(function(el){el.style.setProperty('font-family','Poppins,sans-serif','important');});document.body.appendChild(panel);button.setAttribute('aria-controls',panel.id);button.setAttribute('aria-expanded','true');place();
  panel.onclick=function(e){var b=e.target.closest('[data-account]');if(!b)return;var key=b.dataset.account;if(key==='close')close(true);else if(key==='logout'){close();if(window.sairTodasContas)window.sairTodasContas();}else if(['access','communications','visibility','status'].includes(key))info(key);else go(key==='alerts'?'painel-candidato':key);};
  if(keyboard)panel.querySelector('[data-account=alerts]').focus();
 }
 var style=document.createElement('style');style.textContent=`
 #emCandidateAccountMenu{position:fixed;z-index:10050;box-sizing:border-box;width:410px;max-width:calc(100vw - 24px);padding:0;background:#fff;border:1px solid #93c5fd;border-radius:10px;box-shadow:0 9px 21px #29575124;color:#34333d;font-family:Poppins,sans-serif}
 #emCandidateAccountMenu *{box-sizing:border-box}
 #emCandidateAccountMenu:before{content:'';position:absolute;top:-9px;right:60px;width:16px;height:16px;background:white;border-left:1px solid #93c5fd;border-top:1px solid #93c5fd;transform:rotate(45deg)}
 #emCandidateAccountMenu .em-account-top{position:relative;display:flex;align-items:center;gap:14px;min-height:83px;padding:18px;border-bottom:1px solid #eff6ff;background:white;border-radius:10px 10px 0 0}
 #emCandidateAccountMenu .em-account-avatar{display:grid;place-items:center;width:49px;height:49px;flex:0 0 49px;border-radius:50%;background:radial-gradient(circle at 32% 30%,#0080c9,#34333d);color:#fff}
 #emCandidateAccountMenu .em-account-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%}
 #emCandidateAccountMenu .em-account-initials{font-size:18px!important;font-weight:500!important;color:white!important}
 #emCandidateAccountMenu .em-account-top>div{flex:1;min-width:0}
 #emCandidateAccountMenu .em-account-top strong{display:block;font-size:18px!important;line-height:1.2;font-weight:700!important;color:#34333d!important}
 #emCandidateAccountMenu .em-account-top small{display:block;font-size:14px!important;line-height:1.3;margin-top:3px;color:#0080c9!important}
 #emCandidateAccountMenu button{cursor:pointer;box-shadow:none;letter-spacing:normal;text-transform:none}
 #emCandidateAccountMenu .em-account-top>button{align-self:flex-start;padding:0;border:0;background:none;color:#0080c9!important;font-size:26px!important;font-weight:300;line-height:1}
 #emCandidateAccountMenu .em-account-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:14px 12px}
 #emCandidateAccountMenu .em-account-links>button{display:flex;align-items:center;gap:11px;width:100%;height:74px;margin:0;padding:9px 8px;border:1px solid #d5e5f5;border-radius:8px;background:#fff;text-align:left;color:#34333d!important;font-size:12px!important;font-weight:600!important;line-height:1.2}
 #emCandidateAccountMenu .em-account-links>button>span:last-child{white-space:nowrap;color:#34333d!important;font-size:12px!important;font-weight:600!important}
 #emCandidateAccountMenu .em-account-card-icon{display:grid;place-items:center;width:53px;height:55px;flex:0 0 53px;border-radius:9px;background:linear-gradient(135deg,#f8fbff,#eff6ff);color:#34333d!important}
 #emCandidateAccountMenu .em-account-card-icon svg{width:34px;height:34px;flex:none}
 #emCandidateAccountMenu .em-account-links>button:hover{background:#f8fcfe;border-color:#93c5fd}
 #emCandidateAccountMenu .em-account-footer{display:flex;justify-content:flex-end;padding:11px 13px 13px;border-top:1px solid #eff6ff}
 #emCandidateAccountMenu .em-account-logout{display:flex;align-items:center;justify-content:center;gap:10px;width:auto;min-height:33px;padding:7px 12px;margin:0;border:1px solid #0080c9;border-radius:8px;background:white;color:#34333d!important;font-size:12px!important;font-weight:500!important}
 #emCandidateAccountMenu .em-account-logout svg{width:19px;height:19px}
 #emCandidateAccountMenu button:focus{outline:none}
 #emCandidateAccountMenu button:focus-visible{outline:2px solid #0080c9;outline-offset:2px}
 #emCandidateProfile .em-account-details{grid-column:1/-1}
 @media(max-width:440px){#emCandidateAccountMenu{right:12px!important;width:calc(100vw - 24px)}#emCandidateAccountMenu .em-account-links>button{gap:7px;padding:7px}#emCandidateAccountMenu .em-account-card-icon{width:40px;flex-basis:40px;height:48px}#emCandidateAccountMenu .em-account-card-icon svg{width:30px;height:30px}#emCandidateAccountMenu .em-account-links>button>span:last-child{font-size:11px!important}}
 @media(max-height:480px){#emCandidateAccountMenu{max-height:calc(100dvh - 85px);overflow:auto}#emCandidateAccountMenu:before{display:none}}

 /* Smaller account card without shrinking the labels. */
 #emCandidateAccountMenu{width:370px}
 #emCandidateAccountMenu .em-account-top{min-height:70px;padding:12px 15px;gap:11px}
 #emCandidateAccountMenu .em-account-avatar{width:42px;height:42px;flex-basis:42px}
 #emCandidateAccountMenu .em-account-top strong{font-size:16px!important}
 #emCandidateAccountMenu .em-account-top small{font-size:12px!important}
 #emCandidateAccountMenu .em-account-links{padding:10px;gap:7px}
 #emCandidateAccountMenu .em-account-links>button{height:62px;padding:7px;gap:8px}
 #emCandidateAccountMenu .em-account-card-icon{width:40px;height:44px;flex-basis:40px}
 #emCandidateAccountMenu .em-account-card-icon svg{width:29px;height:29px}
 #emCandidateAccountMenu .em-account-links>button>span:last-child{font-size:11.5px!important}
 #emCandidateAccountMenu .em-account-footer{padding:9px 11px}
 html body.cp-shell-active #cpCandidateHeader .cp-greeting{gap:9px!important;padding:0 3px 0 12px!important}
 html body.cp-shell-active #cpCandidateHeader .cp-user-avatar{width:36px!important;height:36px!important;flex-basis:36px!important;font-size:15px!important}
 html body.cp-shell-active #cpCandidateHeader .cp-greeting-name{font-size:14px!important}
 html body.cp-shell-active #cpCandidateHeader .cp-account-chevron{width:16px!important;height:16px!important}
 @media(max-width:390px){#emCandidateAccountMenu{width:calc(100vw - 24px)}#emCandidateAccountMenu .em-account-card-icon{width:32px;flex-basis:32px}#emCandidateAccountMenu .em-account-links>button{gap:6px}#emCandidateAccountMenu .em-account-links>button>span:last-child{font-size:10.5px!important}}
`;document.head.appendChild(style);
 document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('#cpCandidateHeader .cp-greeting');if(b){e.preventDefault();e.stopImmediatePropagation();open(b,e.detail===0);}else if(panel&&!panel.contains(e.target))close();},true);
 document.addEventListener('keydown',function(e){if(!panel)return;if(e.key==='Escape'){e.preventDefault();close(true);}if(e.key==='Tab'){var items=Array.from(panel.querySelectorAll('button')),first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 window.addEventListener('resize',place);window.addEventListener('popstate',function(){close();});
})();

/* Model 3: presentation layer; existing data, navigation and actions are retained. */
(function(){
 if(typeof document==='undefined')return;
 'use strict';
 var queued=false;
 function go(route){var b=document.querySelector('#cpCandidateHeader [data-route="'+route+'"]');if(b)b.click();else if(route==='home'&&typeof window.irPara==='function')window.irPara('home');}
 function art(){return '<svg viewBox="0 0 560 310" fill="none" aria-hidden="true"><defs><linearGradient id="m3body" x1="110" y1="96" x2="350" y2="310" gradientUnits="userSpaceOnUse"><stop stop-color="#0080c9"/><stop offset=".5" stop-color="#3786b6"/><stop offset="1" stop-color="#3786b6"/></linearGradient><linearGradient id="m3flap" x1="110" y1="84" x2="290" y2="190" gradientUnits="userSpaceOnUse"><stop stop-color="#0080c9"/><stop offset=".3" stop-color="#0080c9"/><stop offset="1" stop-color="#3786b6"/></linearGradient><linearGradient id="m3sheet" x1="340" y1="92" x2="490" y2="296" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#eff6ff"/></linearGradient><linearGradient id="m3gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d5e5f5"/><stop offset=".5" stop-color="#93c5fd"/><stop offset="1" stop-color="#0080c9"/></linearGradient><linearGradient id="m3line"><stop stop-color="#d5e5f5"/><stop offset="1" stop-color="#93c5fd"/></linearGradient><filter id="m3depth" x="-30%" y="-30%" width="170%" height="180%"><feDropShadow dx="3" dy="9" stdDeviation="5" flood-color="#3786b6" flood-opacity=".18"/></filter></defs><g fill="#93c5fd" fill-opacity=".16" stroke="#d5e5f5" stroke-opacity=".22"><ellipse cx="167" cy="95" rx="72" ry="34" transform="rotate(-40 167 95)"/><ellipse cx="319" cy="85" rx="84" ry="42" transform="rotate(-34 319 85)"/><ellipse cx="464" cy="191" rx="87" ry="63" transform="rotate(-24 464 191)"/><circle cx="70" cy="236" r="17"/></g><path d="m42 287 257-84 226 80" stroke="#93c5fd" opacity=".12"/><ellipse cx="296" cy="288" rx="204" ry="12" fill="#3786b6" opacity=".22"/><g transform="translate(8 0) rotate(7 240 190)" filter="url(#m3depth)"><path d="M191 94V68c0-32 84-32 84 0v27" stroke="#3786b6" stroke-width="20"/><path d="M191 90V68c0-27 84-27 84 0v22" stroke="#0080c9" stroke-width="12"/><path d="M194 70c0-23 76-23 78-2" stroke="#93c5fd" stroke-opacity=".5" stroke-width="2"/><rect x="119" y="101" width="240" height="183" rx="20" fill="#3786b6" stroke="#3786b6" stroke-width="3"/><rect x="108" y="94" width="240" height="183" rx="19" fill="url(#m3body)" stroke="#0080c9" stroke-opacity=".55" stroke-width="1.5"/><path d="M113 108c0-10 7-18 19-18h191c15 0 23 8 23 23v62c0 11-8 17-20 18l-193-1c-15-1-20-8-20-20Z" fill="url(#m3flap)" stroke="#0080c9" stroke-opacity=".65" stroke-width="1.5"/><path d="M118 112v58c0 10 7 16 18 17h183" stroke="#93c5fd" opacity=".2"/><path d="M119 200v52c0 10 6 16 18 16h178" stroke="#93c5fd" opacity=".25"/><path d="M335 203v55" stroke="#3786b6" stroke-width="3" opacity=".6"/><rect x="219" y="172" width="33" height="43" rx="6" fill="#3786b6" transform="translate(2 3)"/><rect x="219" y="172" width="33" height="43" rx="6" fill="url(#m3gold)" stroke="#d5e5f5" stroke-width="1.6"/><path d="M223 178v29" stroke="#d5e5f5" stroke-opacity=".45" stroke-width="2"/></g><g transform="translate(361 104) rotate(12 65 90)" filter="url(#m3depth)"><rect x="3" y="3" width="136" height="185" rx="9" fill="#93c5fd"/><rect width="136" height="185" rx="9" fill="url(#m3sheet)" stroke="#f8fbff"/><circle cx="40" cy="37" r="20" fill="#eff6ff"/><circle cx="40" cy="30" r="8" fill="#0080c9"/><path d="M25 48c0-23 30-23 30 0-9 7-20 7-30 0Z" fill="#3786b6"/><g stroke="#93c5fd" stroke-width="5" stroke-linecap="round" opacity=".25" transform="translate(1 2)"><path d="M71 30h33M71 44h30M20 73h92M20 89h92M20 105h92M20 121h76M20 137h67M20 153h45"/></g><g stroke="url(#m3line)" stroke-width="5" stroke-linecap="round"><path d="M71 30h33M71 44h30M20 73h92M20 89h92M20 105h92M20 121h76M20 137h67M20 153h45"/></g></g><g filter="url(#m3depth)"><circle cx="479" cy="256" r="29" fill="#0080c9"/><circle cx="477" cy="252" r="29" fill="url(#m3gold)" stroke="#d5e5f5" stroke-width="1.3"/><path d="m465 252 8 8 16-18" stroke="#0080c9" stroke-opacity=".3" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" transform="translate(1 2)"/><path d="m465 252 8 8 16-18" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g></svg>';}
 function icon(name){var paths={"home": "<rect x=\"4\" y=\"4\" width=\"9\" height=\"9\" rx=\"2\" fill=\"var(--nav-fill)\"/><rect x=\"19\" y=\"4\" width=\"9\" height=\"9\" rx=\"2\" fill=\"var(--nav-accent)\" stroke=\"var(--nav-accent)\"/><rect x=\"4\" y=\"19\" width=\"9\" height=\"9\" rx=\"2\" fill=\"var(--nav-fill)\"/><rect x=\"19\" y=\"19\" width=\"9\" height=\"9\" rx=\"2\" fill=\"var(--nav-fill)\"/>", "case": "<path d=\"M11 9V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v3\"/><rect x=\"3\" y=\"9\" width=\"26\" height=\"20\" rx=\"4\" fill=\"var(--nav-fill)\"/><path d=\"M3 14c5 5 21 5 26 0\"/><rect x=\"13\" y=\"15\" width=\"6\" height=\"6\" rx=\"1.5\" fill=\"var(--nav-accent)\" stroke=\"var(--nav-accent)\"/><path d=\"M7 25h7\" opacity=\".4\"/>", "search": "<circle cx=\"13\" cy=\"13\" r=\"10\" fill=\"var(--nav-fill)\"/><circle cx=\"13\" cy=\"13\" r=\"6.5\" stroke-opacity=\".35\"/><path d=\"m21 21 8 8\" stroke-width=\"3.2\"/><path d=\"m11 14 2 2 4-5\" stroke=\"var(--nav-accent)\" stroke-width=\"2.2\"/>", "chat": "<path d=\"M7 5h18a4 4 0 0 1 4 4v13a4 4 0 0 1-4 4H13l-8 4v-7a4 4 0 0 1-2-3V9a4 4 0 0 1 4-4Z\" fill=\"var(--nav-fill)\"/><path d=\"M8 11h16M8 16h11\" stroke-opacity=\".7\"/><circle cx=\"23\" cy=\"21\" r=\"3.2\" fill=\"var(--nav-accent)\" stroke=\"var(--nav-accent)\"/>", "resume": "<path d=\"M9 3h13l5 5v21H9Z\" fill=\"var(--nav-fill)\"/><path d=\"M21 3v6h6M5 7v22a2 2 0 0 0 2 2h15\" stroke-opacity=\".4\"/><rect x=\"13\" y=\"12\" width=\"4\" height=\"4\" rx=\".7\" fill=\"var(--nav-accent)\" stroke=\"var(--nav-accent)\"/><path d=\"M13 21h10M13 25h7\"/>", "saved": "<path d=\"M8 3h16v27l-8-5-8 5Z\" fill=\"var(--nav-fill)\"/><path d=\"m16 8 1.7 3.2 3.5.6-2.5 2.5.5 3.6-3.2-1.7-3.2 1.7.5-3.6-2.5-2.5 3.5-.6Z\" fill=\"var(--nav-accent)\" stroke=\"var(--nav-accent)\" stroke-width=\"1\"/>", "user": "<circle cx=\"16\" cy=\"10\" r=\"6\" fill=\"var(--nav-fill)\"/><path d=\"M5 29v-3a11 11 0 0 1 22 0v3Z\" fill=\"var(--nav-fill)\"/><path d=\"m21 24 2 2 5-5\" stroke=\"var(--nav-accent)\" stroke-width=\"2.3\"/>", "crown": "<path d=\"m3 10 7 5 6-10 6 10 7-5-4 16H7Z\" fill=\"var(--nav-fill)\"/><path d=\"M8 30h16\"/><circle cx=\"16\" cy=\"4\" r=\"2\" fill=\"var(--nav-accent)\" stroke=\"none\"/><path d=\"m16 17 2 3-2 3-2-3Z\" fill=\"var(--nav-accent)\" stroke=\"var(--nav-accent)\"/>"};return '<svg class="m3-nav-svg" viewBox="0 0 32 32" fill="none" stroke="var(--nav-stroke)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.resume)+'</svg>';}
 function model4Icon(name){var paths={"home": "<path d=\"m3 10 9-7 9 7v11H3Z\"/><path d=\"M9 21v-8h6v8\"/>", "user": "<circle cx=\"12\" cy=\"7\" r=\"4\"/><path d=\"M4 21v-2a8 8 0 0 1 16 0v2\"/>", "chat": "<path d=\"M5 3h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9l-6 4V5a2 2 0 0 1 2-2Z\"/>", "resume": "<path d=\"M5 2h9l5 5v15H5Z\"/><path d=\"M14 2v6h5M8 12h8M8 16h8M8 19h5\"/>", "case": "<rect x=\"3\" y=\"7\" width=\"18\" height=\"14\" rx=\"2\"/><path d=\"M8 7V3h8v4M3 12c5 4 13 4 18 0M10 12v4h4v-4\"/>", "search": "<circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"12\" r=\"5\"/><path d=\"m12 12 9-9M16 3h5v5\"/>", "saved": "<path d=\"M6 3h12v19l-6-4-6 4Z\"/>", "crown": "<path d=\"M3 8 7 3h10l4 5-9 13Z\"/><path d=\"M3 8h18M7 3l2 5 3 13 3-13 2-5\"/>", "help": "<path d=\"M4 14v-3a8 8 0 0 1 16 0v3M5 13H2v7h4v-7ZM19 13h3v7h-4v-7ZM19 20c0 2-3 2-5 2\"/>", "plus": "<path d=\"M12 4v16M4 12h16\"/>"};return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||paths.resume)+'</svg>';}
 function organizePremiumMenu(nav,premium){
  if(!premium)return;
  if(nav.querySelector('.m4-menu-group'))return;
  var routes={};nav.querySelectorAll('button[data-route]').forEach(function(b){routes[b.dataset.route]=b;});
  var brand=nav.querySelector('.m3-brand'),action=document.createElement('button');action.type='button';action.className='m4-resume-action';action.innerHTML=model4Icon('plus')+'<span>Atualizar currículo</span>';action.onclick=function(){go('curriculo');};brand.after(action);
  [['PAINEL',['painel-candidato']],['ÁREA PESSOAL',['perfil','messages']],['ÁREA PROFISSIONAL',['curriculo','candidaturas','recommendations','salvas']],['MEU PLANO',['premium-candidato']]].forEach(function(group){
   var section=document.createElement('div');section.className='m4-menu-group';section.setAttribute('role','group');section.setAttribute('aria-label',group[0]);var title=document.createElement('div');title.className='m4-menu-caption';title.textContent=group[0];section.appendChild(title);
   group[1].forEach(function(route){var button=routes[route];if(!button)return;var label=button.querySelector('span:not(.cp-card-icon):not(.cp-message-count)');var labels={'painel-candidato':'Visão geral',perfil:'Meu perfil',curriculo:'Meu currículo'};if(labels[route]&&label)label.textContent=labels[route];if(route==='premium-candidato'){button.innerHTML='<span class="cp-card-icon" data-m3="4">'+model4Icon('crown')+'</span><span class="m4-plan-copy"><strong>Premium</strong><small>Gerenciar assinatura</small></span><span class="m4-plan-status">Ativo</span><span class="m4-plan-chevron" aria-hidden="true">›</span>';button.classList.add('m4-plan-card');}section.appendChild(button);});
   nav.insertBefore(section,nav.querySelector('.m3-help'));
  });
  var support=document.createElement('details');support.className='m4-support';support.innerHTML='<summary>'+model4Icon('help')+'<span>Ajuda e suporte</span></summary><p>Atualize seus dados em Meu perfil, suas experiências em Meu currículo e acompanhe cada processo em Candidaturas.</p>';nav.appendChild(support);
 }
 function paint(){
  queued=false;var p=document.getElementById('pagina-painel-candidato'),nav=document.querySelector('#cpCandidateHeader .cp-navigation');if(!p||!nav)return;
  if(!nav.querySelector('.m3-brand')){var brand=document.createElement('div');brand.className='m3-brand';brand.innerHTML='Emprega<span>Mais</span>';nav.prepend(brand);var help=document.createElement('section');help.className='m3-help';help.innerHTML='<strong>Deixe seu perfil ainda mais completo</strong><p>Aumente suas chances de ser encontrado pelas empresas.</p><svg viewBox="0 0 210 125" fill="none" aria-hidden="true"><defs><linearGradient id="m3hair" x2="1" y2="1"><stop stop-color="#34333d"/><stop offset="1" stop-color="#34333d"/></linearGradient><linearGradient id="m3top" x2="1" y2="1"><stop stop-color="#93c5fd"/><stop offset="1" stop-color="#0080c9"/></linearGradient><linearGradient id="m3laptop" x2="1" y2="1"><stop stop-color="#34333d"/><stop offset="1" stop-color="#34333d"/></linearGradient></defs><path d="M103 91c-5-14-3-20 5-30 7-8 7-18 9-28 5-24 35-31 49-16 13 3 16 14 18 26 2 12 17 14 17 27 0 8-9 13-6 24 2 9-8 17-19 17h-63Z" fill="url(#m3hair)"/><path d="M132 65c-18 2-26 14-31 28L88 110h46l4-34Z" fill="#0080c9"/><path d="M151 67c18 0 32 11 36 29l3 22h-69l1-22c1-16 7-26 18-29Z" fill="url(#m3top)"/><path d="M140 55v17c4 7 14 7 19-1l-6-17" fill="#d5e5f5"/><path d="M129 28c-9 7-8 23-3 30 5 8 18 10 25 2 7-6 11-22 5-30Z" fill="#eff6ff"/><path d="M125 23c11-13 27-9 34 5 2 3 3 8 1 15-8-2-12-8-13-15-2 10-9 16-16 17l-3-8-2 10-5-6Z" fill="url(#m3hair)"/><path d="M131 49c2 3 5 5 8 5" stroke="#93c5fd" stroke-linecap="round"/><path d="m145 99-15 16-38-2-8 5h54l19-13" fill="#d5e5f5"/><path d="m157 82-12 17 12 9 16-24" fill="#93c5fd"/><path d="m172 86-13 22" stroke="#0080c9" stroke-opacity=".5"/><path d="M23 70c-1-3 1-5 4-5h56c3 0 5 2 5 4l10 48H35Z" fill="url(#m3laptop)"/><path d="m29 69 58 1 8 43H40Z" fill="#34333d"/><ellipse cx="60" cy="92" rx="4" ry="5" fill="#eff6ff" transform="rotate(-10 60 92)"/><path d="M34 116h75l4 3H36Z" fill="#93c5fd"/><path d="M13 119h189" stroke="#d5e5f5"/></svg><button type="button">Completar perfil</button>';help.querySelector('button').onclick=function(){go('curriculo');};nav.appendChild(help);}
  var premium=false;try{var premiumApi=window.EmpregaMaisPremiumCandidatoV92;premium=premiumApi&&typeof premiumApi.ehPremium==='function'?!!premiumApi.ehPremium():!!(window.EmpregaMaisPreparacao&&window.EmpregaMaisPreparacao.temPremium(window.obterCandidatoAtual?window.obterCandidatoAtual():null));}catch(ignore){}
  var menuModel=premium?'4':'2';if(nav.dataset.menuModel!==menuModel)nav.dataset.menuModel=menuModel;
  var types={'painel-candidato':'home',curriculo:'resume',candidaturas:'case',home:'search',recommendations:'search',messages:'chat',perfil:'user',salvas:'saved','premium-candidato':'crown'};
  nav.querySelectorAll('button[data-route]').forEach(function(b){var holder=b.querySelector('.cp-card-icon');if(holder&&holder.dataset.m3!==menuModel){holder.innerHTML=premium?model4Icon(types[b.dataset.route]):icon(types[b.dataset.route]);holder.dataset.m3=menuModel;}});
  organizePremiumMenu(nav,premium);
  var intro=p.querySelector('.cp-home-intro');if(intro&&!intro.dataset.m3){intro.dataset.m3='1';intro.innerHTML='<div class="m3-welcome"><small>BEM-VINDO AO EMPREGAMAIS</small><h1>Olá, <span class="m3-name">Candidato</span></h1><p>Encontre sua próxima oportunidade.</p><button type="button">Buscar vagas <span aria-hidden="true">→</span></button></div><div class="m3-art">'+art()+'</div><div class="m3-motto">DISCIPLINA HOJE,<br>GRANDES CONQUISTAS<br>AMANHÃ.<i></i></div>';intro.querySelector('button').onclick=function(){go('home');};}
  nav.querySelectorAll('.cp-message-count').forEach(function(badge){var styles={'background':'#dc2626','color':'#fff','border':'0','border-radius':'50%','box-shadow':'none','width':'20px','height':'20px','min-width':'20px','padding':'0','font-size':'11px','font-weight':'700','line-height':'20px'};Object.keys(styles).forEach(function(key){if(badge.style.getPropertyValue(key)!==styles[key])badge.style.setProperty(key,styles[key],'important');});});
  var motto=p.querySelector('.m3-motto');if(motto)motto.style.setProperty('color','#625d50','important');
  var name=p.querySelector('.cp-name'),target=p.querySelector('.m3-name'),first=(name&&name.textContent.trim().split(/\s+/)[0])||'Candidato';if(target&&target.textContent!==first)target.textContent=first;
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(paint);}}
 function start(){paint();var p=document.getElementById('pagina-painel-candidato');if(p)new MutationObserver(schedule).observe(p,{childList:true,subtree:true,characterData:true});document.addEventListener('empregamais:candidato-sincronizado',schedule);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

/* Completed résumé and unseen recommendations — reference option 3. */
(function(){
 'use strict';
 if(typeof document==='undefined')return;
 var queued=false,currentIds=[],ownerKey='',lastNav=null,lastSignature='';
 function readSeen(){try{return JSON.parse(localStorage.getItem(ownerKey)||'[]');}catch(e){return [];}}
 function refresh(){
  queued=false;
  var nav=document.querySelector('#cpCandidateHeader .cp-navigation');if(!nav)return;
  var c=window.obterCandidatoAtual?window.obterCandidatoAtual()||{}:{},email=String(sessionStorage.getItem('candidatoEmail')||c.email||'').trim().toLowerCase();
  ownerKey='emRecommendationSeenV1:'+email;
  var saved=false;try{saved=!!(window.curriculoCadastrado&&window.curriculoCadastrado());}catch(e){}
  var complete=[!!(c.nome||sessionStorage.getItem('candidatoNome')),!!email,!!c.telefone,!!(c.cidadeProfissional||c.cidade),!!(c.cargoDesejado||c.areaProfissional),!!c.escolaridadeProfissional,!!c.experienciaProfissional,!!c.habilidadesProfissionais,saved].every(Boolean);
  var core=window.EmpregaMaisPreparacao,rows=window.todasAsVagasPublicas?window.todasAsVagasPublicas():[];
  var recommended=core&&core.recomendarVagas?core.recomendarVagas(rows,c):[];
  currentIds=recommended.map(function(x){return String(x.job.id);});
  var seen=readSeen();if(!Array.isArray(seen))seen=[];
  var count=currentIds.filter(function(id){return seen.indexOf(id)<0;}).length;
  var resume=nav.querySelector('button[data-route="curriculo"]'),rec=nav.querySelector('button[data-route="recommendations"]');
  if(!resume||!rec)return;
  var signature=JSON.stringify([complete,count,email]);
  if(lastNav===nav&&lastSignature===signature&&(!complete||resume.querySelector('.cp-resume-state')))return;
  lastNav=nav;lastSignature=signature;
  resume.classList.toggle('cp-resume-complete',complete);
  var state=resume.querySelector('.cp-resume-state');
  if(complete&&!state){state=document.createElement('span');state.className='cp-resume-state';state.innerHTML='<small>100% preenchido</small><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="currentColor"/><path d="m7 12 3 3 7-7" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';resume.appendChild(state);}
  else if(!complete&&state)state.remove();
  var badge=rec.querySelector('.cp-recommendation-count');
  if(count){if(!badge){badge=document.createElement('span');badge.className='cp-recommendation-count';rec.appendChild(badge);}badge.textContent=String(count);badge.setAttribute('aria-label',count+(count===1?' nova vaga recomendada':' novas vagas recomendadas'));}else if(badge)badge.remove();
  function css(el,values){if(el)Object.keys(values).forEach(function(k){el.style.setProperty(k,values[k],'important');});}
  css(resume,complete?{display:'grid','grid-template-columns':'24px minmax(0,1fr) 20px','column-gap':'8px','row-gap':'3px','align-items':'center','min-height':'62px',padding:'9px 10px',background:'#edf5ff',border:'1px solid #a8c9fa','border-radius':'7px',color:'#243b63',position:'relative'}:{display:'flex','min-height':'',padding:'',background:'',border:'','border-radius':''});
  if(complete){css(resume.querySelector('.cp-card-icon'),{'grid-column':'1','grid-row':'1/3'});css(resume.querySelector('span:not(.cp-card-icon):not(.cp-resume-state)'),{'grid-column':'2','grid-row':'1','font-weight':'700'});css(state,{display:'contents'});css(state.querySelector('small'),{'grid-column':'2','grid-row':'2','font-size':'11px','line-height':'1.3',color:'#0080c9','white-space':'nowrap'});css(state.querySelector('svg'),{'grid-column':'3','grid-row':'1/3',width:'19px',height:'19px',color:'#2858a0'});}
  css(badge,{display:'inline-grid','place-items':'center','margin-left':'auto','flex':'0 0 auto','min-width':'20px',height:'20px',padding:'0 4px','border-radius':'20px',background:'#dc2626',color:'#fff','font-size':'11px','font-weight':'700','line-height':'20px'});
  var notice=nav.querySelector('.cp-recommendation-notice');
  if(count){if(!notice){notice=document.createElement('button');notice.type='button';notice.className='cp-recommendation-notice';notice.innerHTML='<strong>Novas vagas recomendadas para seu perfil</strong><small></small><span aria-hidden="true">›</span>';notice.onclick=function(){rec.click();};rec.after(notice);}notice.querySelector('small').textContent=count+(count===1?' nova vaga':' novas vagas');}else if(notice)notice.remove();
  if(notice&&count){css(notice,{position:'relative',display:'block',height:'auto',flex:'0 0 auto',width:'100%','box-sizing':'border-box',margin:'3px 0 7px',padding:'9px 21px 9px 10px',border:'1px solid #fed3b0','border-left':'3px solid #f28b36','border-radius':'6px',background:'#fff','text-align':'left','white-space':'normal','min-height':'0',color:'#243b63'});css(notice.querySelector('strong'),{display:'block','font-size':'11px','font-weight':'600','line-height':'1.45',color:'#243b63'});css(notice.querySelector('small'),{display:'block','margin-top':'4px','font-size':'11px','line-height':'1.3',color:'#62738a'});css(notice.querySelector('span'),{position:'absolute',right:'8px',top:'50%',transform:'translateY(-50%)',color:'#ed7825','font-size':'23px'});}
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(refresh);}}
 document.addEventListener('click',function(e){if(!e.target.closest||!e.target.closest('#cpCandidateHeader button[data-route="recommendations"]'))return;var seen=readSeen();if(!Array.isArray(seen))seen=[];try{localStorage.setItem(ownerKey,JSON.stringify(Array.from(new Set(seen.concat(currentIds)))));}catch(ignore){}lastSignature='';schedule();},true);
 var style=document.createElement('style');style.textContent=`
 html body.cp-shell-active #cpCandidateHeader .cp-navigation button.cp-resume-complete{position:relative!important;display:grid!important;grid-template-columns:24px minmax(0,1fr) 20px!important;column-gap:10px!important;row-gap:3px!important;align-items:center!important;min-height:60px!important;padding:10px 12px!important;background:#edf5ff!important;border:1px solid #a8c9fa!important;border-radius:7px!important;color:#243b63!important}
 #cpCandidateHeader .cp-resume-complete>.cp-card-icon{grid-column:1;grid-row:1/3}
 #cpCandidateHeader .cp-resume-complete>span:not(.cp-card-icon):not(.cp-resume-state){grid-column:2;grid-row:1;font-weight:700!important}
 #cpCandidateHeader .cp-resume-state{display:contents!important}
 #cpCandidateHeader .cp-resume-state small{grid-column:2;grid-row:2;font:500 11px/1.3 Poppins,sans-serif!important;color:#0080c9!important}
 #cpCandidateHeader .cp-resume-state svg{grid-column:3;grid-row:1/3;width:20px!important;height:20px!important;color:#2858a0!important}
 #cpCandidateHeader .cp-recommendation-count{display:inline-grid!important;place-items:center!important;margin-left:auto!important;flex:0 0 auto!important;min-width:20px!important;height:20px!important;padding:0 4px!important;border-radius:20px!important;background:#dc2626!important;color:#fff!important;font:700 11px/20px Poppins,sans-serif!important}
 html body.cp-shell-active #cpCandidateHeader .cp-navigation button.cp-recommendation-notice{position:relative!important;display:block!important;width:100%!important;box-sizing:border-box!important;margin:3px 0 7px!important;padding:10px 23px 10px 11px!important;border:1px solid #fed3b0!important;border-left:3px solid #f28b36!important;border-radius:6px!important;background:#fff!important;text-align:left!important;white-space:normal!important;min-height:0!important;color:#243b63!important}
 #cpCandidateHeader .cp-recommendation-notice strong{display:block!important;font:600 11px/1.45 Poppins,sans-serif!important;color:#243b63!important}
 #cpCandidateHeader .cp-recommendation-notice small{display:block!important;margin-top:4px!important;font:500 11px/1.3 Poppins,sans-serif!important;color:#62738a!important}
 #cpCandidateHeader .cp-recommendation-notice>span{position:absolute;right:9px;top:50%;transform:translateY(-50%);color:#ed7825!important;font-size:23px!important}
 #cpCandidateHeader .cp-recommendation-notice:focus-visible{outline:2px solid #0080c9!important;outline-offset:2px!important}
 `;document.head.appendChild(style);
 function start(){refresh();var root=document.getElementById('pagina-painel-candidato');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true,characterData:true});}
 document.addEventListener('empregamais:candidato-sincronizado',schedule);window.addEventListener('storage',function(){lastSignature='';schedule();});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();


