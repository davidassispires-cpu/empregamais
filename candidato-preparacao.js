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
 var core={compatibilidade:compatibility,correspondeAlerta:matchesAlert,validarAlerta:validateAlert,perguntasEntrevista:interviewQuestions,orientarResposta:responseFeedback,corrigirTeste:gradeTest,testes:tests,podeEntrar:canJoin,linkEntrevista:interviewLink,escape:escape};
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
  var p={document:'<path d="M6 3h9l4 4v14H6Z M14 3v5h5M9 12h7M9 16h7"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 11h18"/>',bookmark:'<path d="M6 21V3h12v18l-6-4Z"/>',message:'<path d="M21 11a8 8 0 0 1-8 8H6l-4 3V11a9 9 0 0 1 19 0Z"/><path d="M7 10h10M7 14h7"/>',arrow:'<path d="m9 5 7 7-7 7"/>',bell:'<path d="M5 10a7 7 0 0 1 14 0v5l2 3H3l2-3Z M9 21h6"/>',briefcase:'<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3"/>',check:'<path d="m5 12 4 4 10-10"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',book:'<path d="M12 5c-3-3-7-3-10-1v16c3-2 7-2 10 1 3-3 7-3 10-1V4c-3-2-7-2-10 1Zm0 0v16"/>',video:'<rect x="3" y="5" width="12" height="14" rx="2"/><path d="m15 9 6-4v14l-6-4"/>',pin:'<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',back:'<path d="M19 12H5m6-6-6 6 6 6"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"/>'};
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(p[name]||p.briefcase)+'</svg>';
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
  var names=['Candidaturas','Entrevistas','Vagas salvas','Mensagens'],icons=['document','calendar','bookmark','message'],actions=['applications','interviews','saved','messages'];
  Array.from(summary.children).forEach(function(el,i){if(i>3||el.tagName==='BUTTON')return;var old=el.querySelector('strong'),number=old?old.textContent:'0',button=document.createElement('button');button.type='button';button.dataset.cpAction=actions[i];button.className='cp-overview-card';button.innerHTML='<span class="cp-overview-icon">'+icon(icons[i])+'</span><div><strong'+(i===3?' data-home-message-count':'')+'>'+escape(number)+'</strong><span>'+names[i]+'</span></div><span class="cp-overview-arrow">'+icon('arrow')+'</span>';el.replaceWith(button);});
  var counter=summary.querySelector('[data-home-message-count]'),unread=Number(counter&&counter.textContent)||0,bell=document.querySelector('#cpCandidateHeader .cp-notifications');
  if(bell){bell.querySelector('.cp-notification-dot').hidden=unread<1;bell.setAttribute('aria-label',unread>0?'Abrir mensagens: '+unread+' recebida'+(unread===1?'':'s'):'Abrir mensagens');}
 }
 function enhanceRecommendations(){
  var c=profile();container.querySelectorAll('.em-personal-grid [data-cp-job-id]').forEach(function(card){
   var job=jobById(card.dataset.cpJobId),match=compatibility(job,c),signature=JSON.stringify(match),holder=card.querySelector('.cp-fit-and-alert');
   if(!holder){holder=document.createElement('div');holder.className='cp-fit-and-alert';card.appendChild(holder);}
   if(holder.dataset.signature===signature)return;holder.dataset.signature=signature;
   holder.innerHTML='<button type="button" class="cp-fit-button" data-cp-fit="'+escape(job.id||'')+'">'+icon('target')+'<span>'+(match.percent==null?'Complete o perfil para ver a compatibilidade':match.percent+'% de compatibilidade')+'</span><span class="cp-fit-info" aria-hidden="true">i</span></button><button type="button" class="cp-job-alert" data-cp-alert-job="'+escape(job.id||'')+'">'+icon('bell')+' Avise-me sobre vagas como esta</button>';
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
  if(!workspace)return;clearTimeout(draftTimer);saveCurrentAnswer();workspace.hidden=true;page.classList.remove('cp-tool-active');
  if(focus!==false){var button=container.querySelector('.cp-preparation [data-cp-action="interview"]');if(button)button.focus();}
 }
 function openWorkspace(title,body){
  if(global.irPara&&!page.classList.contains('ativa'))global.irPara('painel-candidato');
  if(identity()!==owner)return;
  workspace.hidden=false;page.classList.add('cp-tool-active');
  workspace.innerHTML='<header class="cp-workspace-head"><button type="button" data-cp-action="close" class="cp-text-button">'+icon('back')+' Voltar à minha área</button><h1 tabindex="-1">'+escape(title)+'</h1></header><div class="cp-workspace-content">'+body+'</div><p class="cp-feedback" role="status" aria-live="polite"></p>';
  workspace.querySelector('h1').focus();workspace.scrollIntoView({block:'start',behavior:'auto'});
 }
 function toolStatus(text){var el=workspace.querySelector('.cp-feedback');if(el)el.textContent=text;}
 function openCompatibility(id){
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
  if(target.dataset.cpFit!=null){openCompatibility(target.dataset.cpFit);return;}
  if(target.dataset.cpAlertJob!=null){openAlerts(target.dataset.cpAlertJob);return;}
  if(target.dataset.cpAlertView){showAlertJobs(target.dataset.cpAlertView);return;}
  if(target.dataset.cpAlertEdit){openAlerts(null,target.dataset.cpAlertEdit);return;}
  if(target.dataset.cpAlertDelete){target.disabled=true;saveAlerts(alerts().filter(function(a){return a.id!==target.dataset.cpAlertDelete;})).then(function(message){openAlerts();toolStatus(message);schedule();}).catch(function(e){toolStatus(e.message);target.disabled=false;});return;}
  if(target.dataset.cpTestStart){startTest(target.dataset.cpTestStart);return;}
  if(target.dataset.cpJobOpen!=null){closeWorkspace(false);global.irPara('vaga',target.dataset.cpJobOpen);return;}
  if(target.dataset.cpApplication!=null){var row=applicationRows().find(function(a){return String(a.id)===target.dataset.cpApplication;}),controller=global.EmpregaMaisCandidaturasCandidato;if(controller)controller.abrir(row?statusKey(row):'todas');return;}
  var action=target.dataset.cpAction;if(!action)return;
  if(action==='close')closeWorkspace();
  else if(action==='interview')interviewSetup();
  else if(action==='resume-interview')renderInterview();
  else if(action==='previous-question'){saveCurrentAnswer();practice.interview.index=Math.max(0,practice.interview.index-1);persistPractice();renderInterview();}
  else if(action==='download-interview')downloadInterview();
  else if(action==='tests')testsSetup();
  else if(action==='resume-test')renderTest();
  else if(action==='next-test')nextTest();
  else if(action==='alerts')openAlerts();
  else if(action==='interview-guide')showInterviewGuide();
  else if(action==='join'){var host=container.querySelector('.cp-next-interview'),next=host&&host.emInterview;if(canJoin(next)&&global.EMInterviews)global.EMInterviews.openRoom(next);else toolStatus('Confira a confirmação e o horário no agendamento.');}
  else if(action==='messages'){closeWorkspace(false);var button=document.querySelector('.cp-header [data-route="messages"]');if(button)button.click();}
  else {closeWorkspace(false);if(action==='applications'||action==='interviews'){if(global.EmpregaMaisCandidaturasCandidato)global.EmpregaMaisCandidaturasCandidato.abrir(action==='interviews'?'entrevista':'todas');}else if(global.irPara)global.irPara({saved:'salvas',search:'home',profile:'perfil',resume:'curriculo'}[action]||'painel-candidato');}
 }
 function mount(){
  page=document.getElementById('pagina-painel-candidato');container=page&&page.querySelector('.container-dashboard');
  if(!container||!container.querySelector('.cp-layout'))return;
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
  applyWorkspaceFont(container);applyWorkspaceFont(document.getElementById('cpCandidateHeader'));
 }
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;mount();});}
 function applyWorkspaceFont(scope){
  if(!scope)return;
  scope.querySelectorAll('h1,h2,h3,h4,p,span,small,strong,button,a,label,legend,input,textarea,dt,dd,li,summary').forEach(function(el){
   if(el.style.getPropertyValue('font-family').indexOf('Montserrat')<0)el.style.setProperty('font-family','Montserrat, Arial, sans-serif','important');
  });
 }
 function start(){
  page=document.getElementById('pagina-painel-candidato');if(!page)return;
  var css=document.getElementById('cp-preparation-styles');if(css)document.head.appendChild(css);
  new MutationObserver(schedule).observe(page,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
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
