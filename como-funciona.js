(function(global){
'use strict';
const iconNodes={"file-text":[["path",{"d":"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"}],["path",{"d":"M14 2v5a1 1 0 0 0 1 1h5"}],["path",{"d":"M10 9H8"}],["path",{"d":"M16 13H8"}],["path",{"d":"M16 17H8"}]],"search":[["path",{"d":"m21 21-4.34-4.34"}],["circle",{"cx":"11","cy":"11","r":"8"}]],"send":[["path",{"d":"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"}],["path",{"d":"m21.854 2.147-10.94 10.939"}]],"briefcase-business":[["path",{"d":"M12 12h.01"}],["path",{"d":"M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"}],["path",{"d":"M22 13a18.15 18.15 0 0 1-20 0"}],["rect",{"width":"20","height":"14","x":"2","y":"6","rx":"2"}]],"inbox":[["polyline",{"points":"22 12 16 12 14 15 10 15 8 12 2 12"}],["path",{"d":"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"}]],"list-checks":[["path",{"d":"M13 5h8"}],["path",{"d":"M13 12h8"}],["path",{"d":"M13 19h8"}],["path",{"d":"m3 17 2 2 4-4"}],["path",{"d":"m3 7 2 2 4-4"}]],"mail":[["path",{"d":"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"}],["rect",{"x":"2","y":"4","width":"20","height":"16","rx":"2"}]],"external-link":[["path",{"d":"M15 3h6v6"}],["path",{"d":"M10 14 21 3"}],["path",{"d":"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"}]],"message-circle":[["path",{"d":"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"}]],"building-2":[["path",{"d":"M10 12h4"}],["path",{"d":"M10 8h4"}],["path",{"d":"M14 21v-3a2 2 0 0 0-4 0v3"}],["path",{"d":"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"}],["path",{"d":"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"}]],"folder-open":[["path",{"d":"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"}]],"check":[["path",{"d":"M20 6 9 17l-5-5"}]],"chevron-left":[["path",{"d":"m15 18-6-6 6-6"}]],"chevron-right":[["path",{"d":"m9 18 6-6-6-6"}]],"pause":[["rect",{"x":"14","y":"3","width":"5","height":"18","rx":"1"}],["rect",{"x":"5","y":"3","width":"5","height":"18","rx":"1"}]],"play":[["path",{"d":"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"}]],"arrow-right":[["path",{"d":"M5 12h14"}],["path",{"d":"m12 5 7 7-7 7"}]],"shield-check":[["path",{"d":"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"}],["path",{"d":"m9 12 2 2 4-4"}]],"layout-dashboard":[["rect",{"width":"7","height":"9","x":"3","y":"3","rx":"1"}],["rect",{"width":"7","height":"5","x":"14","y":"3","rx":"1"}],["rect",{"width":"7","height":"9","x":"14","y":"12","rx":"1"}],["rect",{"width":"7","height":"5","x":"3","y":"16","rx":"1"}]],"graduation-cap":[["path",{"d":"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"}],["path",{"d":"M22 10v6"}],["path",{"d":"M6 12.5V16a6 3 0 0 0 12 0v-3.5"}]],"sliders-horizontal":[["path",{"d":"M10 5H3"}],["path",{"d":"M12 19H3"}],["path",{"d":"M14 3v4"}],["path",{"d":"M16 17v4"}],["path",{"d":"M21 12h-9"}],["path",{"d":"M21 19h-5"}],["path",{"d":"M21 5h-7"}],["path",{"d":"M8 10v4"}],["path",{"d":"M8 12H3"}]]};
function esc(value){return String(value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function icon(name){return '<svg class="cf-guide-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+iconNodes[name].map(function(node){return '<'+node[0]+' '+Object.entries(node[1]).map(function(attr){return attr[0]+'="'+esc(attr[1])+'"';}).join(' ')+'></'+node[0]+'>';}).join('')+'</svg>';}
const profiles={
candidato:{
 title:'Sua candidatura, passo a passo.',lead:'Prepare seu currículo, encontre uma oportunidade e envie sua candidatura pelo canal indicado em cada vaga.',
 primary:['Cadastrar currículo grátis','cadastro-curriculo'],secondary:['Buscar vagas','home'],
 steps:[
 {icon:'file-text',title:'Prepare seu currículo',short:'Organize seus dados e sua experiência.',text:'Crie sua conta e complete seu currículo com experiências, formação e contatos atualizados.',graphic:'curriculum'},
 {icon:'search',title:'Encontre uma oportunidade',short:'Busque por cargo, cidade e modalidade.',text:'Use os filtros para encontrar vagas e leia as atividades, os requisitos e as condições do anúncio.',graphic:'search'},
 {icon:'send',title:'Envie e acompanhe',short:'Siga as orientações da vaga.',text:'Clique em Candidatar-se e siga o canal informado. As candidaturas pelo portal ficam na área do candidato.',graphic:'apply'}
 ],
 faq:[['Preciso pagar para me candidatar?','O cadastro de currículo e a candidatura às vagas são gratuitos.'],['Como envio meu currículo?','Abra a vaga, confira os requisitos e clique em Candidatar-se. O anúncio indica o envio pelo portal, e-mail, WhatsApp ou site externo.'],['Onde acompanho minha candidatura?','Consulte sua área do candidato para candidaturas feitas pelo portal. Para envios por e-mail, WhatsApp ou site externo, acompanhe diretamente pelo canal indicado pela empresa.'],['Posso atualizar meu currículo?','Sim. Acesse sua área do candidato e mantenha as informações profissionais e os contatos atualizados.']]
},
empresa:{
 title:'Seu recrutamento, mais organizado.',lead:'Publique sua vaga, confira as candidaturas recebidas e organize cada etapa pelo painel da empresa.',
 primary:['Cadastre sua empresa grátis','cadastro-empresa'],secondary:['Acessar painel','login-empresa'],
 steps:[
 {icon:'briefcase-business',title:'Publique sua vaga',short:'Apresente a oportunidade com clareza.',text:'Cadastre sua empresa e informe cargo, atividades, requisitos, localização e forma de recebimento das candidaturas.',graphic:'publish'},
 {icon:'inbox',title:'Analise as candidaturas',short:'Consulte e organize os currículos recebidos.',text:'Na aba Candidaturas, selecione a vaga e abra Ver candidatura para consultar o currículo e os dados profissionais.',graphic:'review'},
 {icon:'list-checks',title:'Gerencie o processo',short:'Acompanhe as etapas de seleção.',text:'Atualize a etapa dos candidatos no painel e organize a análise, as entrevistas e os próximos passos da seleção.',graphic:'manage'}
 ],
 faq:[['Posso começar gratuitamente?','Sim. Crie sua conta empresarial e consulte os limites e condições do plano gratuito na página de planos.'],['Como recebo as candidaturas?','Defina na publicação o canal disponível para a vaga: portal, e-mail, WhatsApp ou site externo. Os envios feitos pelo portal ficam na área empresarial.'],['Onde encontro os currículos recebidos?','Acesse Candidaturas no painel da empresa, selecione uma vaga e abra Ver candidatura para consultar o currículo recebido pelo portal.'],['Posso alterar as etapas da seleção?','Use os recursos de etapas disponíveis no painel para organizar a análise e acompanhar o andamento de cada candidato.'],['Como funcionam destaque, urgência e confidencialidade?','Consulte na página de planos os recursos incluídos em sua modalidade e as condições dos serviços adicionais.'],['O selo de empresa verificada é automático?','Não. A empresa envia as informações solicitadas, e o selo depende de análise e aprovação.']]
}
};

// State is independent of DOM and timers so the navigation can be checked directly.
function createController(onChange,options){
 options=options||{};
 let audience=options.audience==='empresa'?'empresa':'candidato';
 const positions={candidato:0,empresa:0};
 let paused=!!options.paused,hovered=false,focused=false,visible=true;
 function state(){return {audience:audience,index:positions[audience],paused:paused};}
 function emit(reason){onChange(state(),reason);}
 return {
  state:state,
  selectAudience:function(value){if(!profiles[value])return;audience=value;emit('audience');},
  select:function(index){if(!Number.isInteger(index)||index<0||index>=profiles[audience].steps.length)return;positions[audience]=index;emit('manual');},
  next:function(){positions[audience]=(positions[audience]+1)%profiles[audience].steps.length;emit('manual');},
  previous:function(){positions[audience]=(positions[audience]+profiles[audience].steps.length-1)%profiles[audience].steps.length;emit('manual');},
  togglePaused:function(){paused=!paused;emit('pause');},
  setHovered:function(value){hovered=!!value;},setFocused:function(value){focused=!!value;},setVisible:function(value){visible=!!value;},
  tick:function(){if(paused||hovered||focused||!visible)return;positions[audience]=(positions[audience]+1)%profiles[audience].steps.length;emit('auto');}
 };
}
function rect(x,y,w,h,fill,stroke,rx){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx||8)+'" fill="'+fill+'"'+(stroke?' stroke="'+stroke+'"':'')+'/>';}
function label(x,y,value,size,color,weight){return '<text x="'+x+'" y="'+y+'" font-size="'+(size||14)+'" fill="'+(color||'#43566f')+'" font-weight="'+(weight||500)+'">'+esc(value)+'</text>';}
function symbol(name,x,y,size,color){return '<g transform="translate('+x+' '+y+')" color="'+color+'">'+icon(name).replace('class="cf-guide-icon"','width="'+size+'" height="'+size+'"')+'</g>';}
function compactGraphic(kind,accent,soft,line){
 let body=rect(8,8,304,224,'#fff',line,10)+rect(8,8,304,42,soft,null,10)+label(26,36,'+Empregos',19,accent,800);
 const rows={curriculum:['Dados e contatos','Experiências','Formação'],search:['Cargo ou palavra-chave','Cidade e modalidade','Vagas disponíveis'],publish:['Cargo e atividades','Requisitos e benefícios','Canal de candidatura'],review:['Currículos recebidos','Em análise','Selecionados'],manage:['Análise','Entrevista','Resultado']};
 if(kind==='apply'){
  [['Portal','layout-dashboard'],['E-mail','mail'],['WhatsApp','message-circle'],['Site externo','external-link']].forEach(function(item,index){const x=20+(index%2)*146,y=65+Math.floor(index/2)*78;body+=rect(x,y,134,66,soft,null,7)+symbol(item[1],x+55,y+9,24,accent)+'<text x="'+(x+67)+'" y="'+(y+53)+'" text-anchor="middle" fill="#43566f" font-size="16" font-weight="600">'+item[0]+'</text>';});
 }else rows[kind].forEach(function(text,index){let y=65+index*51;body+=rect(20,y,280,39,soft,null,7)+symbol(kind==='search'?'search':kind==='review'?'file-text':'check',33,y+10,20,accent)+label(66,y+26,text,16,'#43566f',600);});
 return '<svg class="cf-guide-compact-graphic" viewBox="0 0 320 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustração da etapa" font-family="Montserrat, Arial, sans-serif"><title>Visão geral da etapa</title>'+body+'</svg>';
}
function graphic(kind,audience){
 const accent=audience==='empresa'?'#1767b8':'#703baa',soft=audience==='empresa'?'#eef6fd':'#f5f0fb',line=audience==='empresa'?'#dce8f4':'#e5dcf0';
 let body=rect(8,8,464,302,'#fff',line,12)+rect(8,8,464,43,soft,null,12)+label(28,36,'+Empregos',18,accent,800);
 const names={curriculum:'Currículo profissional',search:'Busca de vagas',apply:'Envio da candidatura',publish:'Publicação da vaga',review:'Análise de currículos',manage:'Etapas da seleção'};
 body+=label(242,35,names[kind],14,'#43566f',600);
 if(kind==='curriculum'){
  body+=symbol('file-text',31,73,34,accent)+label(82,89,'Seu currículo, organizado',19,'#21364e',700)+label(82,111,'Informações profissionais atualizadas',13);
  ['Dados e contatos','Experiências profissionais','Formação e habilidades'].forEach(function(text,i){const y=136+i*47;body+=rect(28,y,424,38,soft,null,7)+symbol('check',43,y+10,18,accent)+label(73,y+24,text,15);});
 }else if(kind==='search'){
  body+=label(28,79,'Cargo ou palavra-chave',13)+label(270,79,'Cidade',13)+rect(28,90,224,37,'#fff',line,6)+label(42,113,'O que você procura?',14,'#79859a')+rect(270,90,182,37,'#fff',line,6)+label(284,113,'Onde quer trabalhar?',14,'#79859a');
  body+=rect(28,144,424,126,'#fff',line,8)+symbol('briefcase-business',44,161,22,accent)+label(79,179,'Confira as vagas disponíveis',17,'#21364e',700);
  body+=label(45,209,'Local  ·  Modalidade  ·  Contrato',14)+label(45,237,'Leia os requisitos antes de se candidatar',13);
 }else if(kind==='apply'){
  body+=symbol('file-text',34,72,29,accent)+label(78,92,'Siga o canal informado na vaga',18,'#21364e',700);
  [['Portal','layout-dashboard'],['E-mail','mail'],['WhatsApp','message-circle'],['Site externo','external-link']].forEach(function(item,i){let x=28+(i%2)*220,y=119+Math.floor(i/2)*75;body+=rect(x,y,204,62,soft,line,8)+symbol(item[1],x+17,y+19,24,accent)+label(x+54,y+38,item[0],15,'#43566f',600);});
  body+=label(44,292,'Cada anúncio apresenta suas instruções de envio.',13);
 }else if(kind==='publish'){
  body+=symbol('briefcase-business',31,72,28,accent)+label(75,93,'Informações da oportunidade',19,'#21364e',700);
  [['Cargo e atividades',119],['Requisitos e benefícios',166],['Local e forma de candidatura',213]].forEach(function(item){body+=rect(28,item[1],424,37,soft,null,7)+label(43,item[1]+24,item[0],15)+symbol('check',419,item[1]+9,18,accent);});
  body+=label(44,284,'Revise os dados antes de publicar.',13);
 }else if(kind==='review'){
  body+=symbol('inbox',31,72,28,accent)+label(74,92,'Candidaturas da vaga',19,'#21364e',700);
  [['Currículo recebido','Aguardando análise'],['Currículo em avaliação','Em análise'],['Currículo selecionado','Entrevista']].forEach(function(item,i){const y=120+i*49;body+=rect(28,y,424,41,'#fff',line,7)+symbol('file-text',41,y+10,21,accent)+label(73,y+26,item[0],14)+rect(286,y+9,153,24,soft,null,5)+label(296,y+25,item[1],12,accent,600);});
  body+=label(43,289,'Abra Ver candidatura para consultar o currículo.',13);
 }else{
  ['Análise','Entrevista','Resultado'].forEach(function(text,i){const x=28+i*145;body+=rect(x,92,133,166,soft,line,8)+label(x+14,118,text,15,accent,700);for(let row=0;row<2;row++){body+=rect(x+11,134+row*49,111,38,'#fff',line,6)+symbol('file-text',x+22,145+row*49,18,accent)+label(x+48,157+row*49,'Currículo',12);}});
  body+=label(45,290,'Acompanhe e atualize as etapas pelo painel.',13);
 }
 return '<svg class="cf-guide-desktop-graphic" viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc(names[kind])+': ilustração da etapa" font-family="Montserrat, Arial, sans-serif"><title>'+esc(names[kind])+'</title>'+body+'</svg>'+compactGraphic(kind,accent,soft,line);
}
if(typeof module!=='undefined'&&module.exports)module.exports={createController:createController,graphic:graphic,profiles:profiles};
if(typeof document==='undefined')return;
function boot(){
 const page=document.getElementById('pagina-como-funciona');
 if(!page||page.querySelector('#comoFuncionaV106'))return;
 const root=document.createElement('div');root.id='comoFuncionaV106';root.dataset.publico='candidato';
 root.innerHTML='<div class="cf-guide-shell"><div class="cf-guide-tabs" role="tablist" aria-label="Como funciona para cada público"><button class="cf-guide-tab" id="cfGuideCandidateTab" role="tab" type="button" data-guide-audience="candidato" aria-controls="cfGuidePanel" aria-selected="true">Para candidatos</button><button class="cf-guide-tab" id="cfGuideCompanyTab" role="tab" type="button" data-guide-audience="empresa" aria-controls="cfGuidePanel" aria-selected="false" tabindex="-1">Para empresas</button></div><div id="cfGuidePanel" role="tabpanel" aria-labelledby="cfGuideCandidateTab"><header class="cf-guide-hero"><span class="cf-guide-kicker">COMO FUNCIONA NO +EMPREGOS</span><h1 id="cfGuideTitle"></h1><p id="cfGuideLead"></p><div class="cf-guide-actions" id="cfGuideHeroActions"></div></header><section class="cf-guide-section" aria-label="Etapas do processo"><div class="cf-guide-carousel" role="region" aria-roledescription="carrossel" aria-label="Passo a passo do portal"><div class="cf-guide-stage" id="cfGuideStage"></div><div class="cf-guide-controls"><button class="cf-guide-control" data-guide-control="previous" type="button" aria-label="Etapa anterior">'+icon('chevron-left')+'</button><span class="cf-guide-counter" id="cfGuideCounter"></span><button class="cf-guide-control" data-guide-control="next" type="button" aria-label="Próxima etapa">'+icon('chevron-right')+'</button><button class="cf-guide-control" id="cfGuidePause" data-guide-control="pause" type="button"></button></div></div><div class="cf-guide-grid cf-guide-steps" id="cfGuideSteps" role="group" aria-label="Escolher etapa"></div><p class="cf-guide-sr" id="cfGuideStatus" aria-live="polite"></p></section><div id="cfGuideDetails"></div><section class="cf-guide-section"><div class="cf-guide-heading"><h2>Dúvidas frequentes</h2><p>Informações para continuar com segurança e clareza.</p></div><div class="cf-guide-faq" id="cfGuideFaq"></div></section><section class="cf-guide-final"><h2 id="cfGuideFinalTitle"></h2><p id="cfGuideFinalText"></p><div class="cf-guide-actions" id="cfGuideFinalActions"></div></section></div></div>';
 page.replaceChildren(root);
 function action(label,route,secondary){return '<a class="cf-guide-button'+(secondary?' secondary':'')+'" href="'+(route==='home'?'./':'?pagina='+route)+'" data-guide-route="'+route+'">'+esc(label)+(secondary?'':icon('arrow-right'))+'</a>';}
 function heading(title,text){return '<div class="cf-guide-heading"><h2>'+title+'</h2><p>'+text+'</p></div>';}
 function card(name,title,text){return '<article class="cf-guide-card"><span class="cf-guide-icon-box">'+icon(name)+'</span><h3>'+title+'</h3><p>'+text+'</p></article>';}
 function checklist(items){return '<ul class="cf-guide-list">'+items.map(function(text){return '<li>'+icon('check')+'<span>'+text+'</span></li>';}).join('')+'</ul>';}
 function details(audience){
  if(audience==='candidato')return '<section class="cf-guide-section">'+heading('Quatro formas de enviar seu currículo','O canal de candidatura é escolhido pela empresa e aparece no anúncio.')+'<div class="cf-guide-grid four">'+card('layout-dashboard','Pelo portal','Acesse sua conta e conclua o envio na vaga.')+card('mail','Por e-mail','Envie seu currículo ao endereço informado.')+card('message-circle','Pelo WhatsApp','Use o contato e siga as orientações do anúncio.')+card('external-link','Por site externo','Acesse o link indicado e conclua o cadastro.')+'</div></section><section class="cf-guide-section">'+heading('Prepare uma candidatura profissional','Dados atualizados e uma apresentação objetiva ajudam a mostrar sua experiência.')+'<div class="cf-guide-grid two"><article class="cf-guide-card"><span class="cf-guide-icon-box">'+icon('file-text')+'</span><h3>Revise seu currículo</h3>'+checklist(['Telefone e e-mail atualizados.','Experiências e atividades bem descritas.','Formação e habilidades relevantes.','Arquivo legível e escrita revisada.'])+'</article><article class="cf-guide-card"><span class="cf-guide-icon-box">'+icon('mail')+'</span><h3>Apresente-se com clareza</h3><p>Personalize a mensagem com seu nome e a vaga escolhida.</p><blockquote class="cf-guide-message">Olá! Meu nome é [seu nome] e tenho interesse na vaga de [cargo], anunciada no +Empregos.<br><br>Encaminho meu currículo para avaliação e fico à disposição para conversar.</blockquote></article></div><div class="cf-guide-note">'+icon('shield-check')+'<span>As candidaturas são gratuitas. Não realize pagamentos para participar de processos seletivos.</span></div></section>';
  return '<section class="cf-guide-section">'+heading('Seu painel, organizado por tarefa','Encontre os recursos que precisa em cada momento do recrutamento.')+'<div class="cf-guide-grid">'+card('briefcase-business','Minhas vagas','Consulte suas publicações e gerencie o status das oportunidades.')+card('folder-open','Candidaturas','Veja os currículos recebidos pelo portal e acompanhe a seleção.')+card('building-2','Perfil empresarial','Apresente sua marca e mantenha os dados da empresa atualizados.')+'</div></section><section class="cf-guide-section">'+heading('Antes de publicar sua oportunidade','Uma descrição completa facilita a avaliação dos candidatos.')+'<div class="cf-guide-grid two"><article class="cf-guide-card"><span class="cf-guide-icon-box">'+icon('list-checks')+'</span><h3>Prepare as informações da vaga</h3>'+checklist(['Cargo, atividades e requisitos.','Cidade, modalidade e contrato.','Salário, benefícios e jornada.','Canal de recebimento das candidaturas.'])+'</article><article class="cf-guide-card"><span class="cf-guide-icon-box">'+icon('sliders-horizontal')+'</span><h3>Escolha os recursos da divulgação</h3><p>Confira os limites do seu plano e as condições de destaque, urgência e confidencialidade.</p>'+action('Conhecer planos','planos',true)+'</article></div></section>';
 }
 let lastAudience='',lastSlide='';
 const initial=new URLSearchParams(location.search).get('publico');
 const reducedMotion=global.matchMedia&&global.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const controller=createController(render,{audience:initial,paused:reducedMotion});
 function render(state,reason){
  const profile=profiles[state.audience],step=profile.steps[state.index],company=state.audience==='empresa';
  root.dataset.publico=state.audience;
  if(lastAudience!==state.audience){
   root.querySelectorAll('[data-guide-audience]').forEach(function(tab){let selected=tab.dataset.guideAudience===state.audience;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});
   root.querySelector('#cfGuidePanel').setAttribute('aria-labelledby',company?'cfGuideCompanyTab':'cfGuideCandidateTab');
   root.querySelector('#cfGuideTitle').textContent=profile.title;root.querySelector('#cfGuideLead').textContent=profile.lead;
   const actions=action(profile.primary[0],profile.primary[1],false)+action(profile.secondary[0],profile.secondary[1],true);
   root.querySelector('#cfGuideHeroActions').innerHTML=actions;root.querySelector('#cfGuideFinalActions').innerHTML=actions;
   root.querySelector('#cfGuideDetails').innerHTML=details(state.audience);
   root.querySelector('#cfGuideFinalTitle').textContent=company?'Comece seu próximo processo seletivo':'Pronto para encontrar sua oportunidade?';
   root.querySelector('#cfGuideFinalText').textContent=company?'Cadastre sua empresa ou acesse o painel do recrutador.':'Organize seu currículo e explore as vagas disponíveis.';
   root.querySelector('#cfGuideFaq').innerHTML=profile.faq.map(function(item){return '<details><summary>'+esc(item[0])+icon('chevron-right')+'</summary><p>'+esc(item[1])+'</p></details>';}).join('');
   root.querySelector('#cfGuideSteps').innerHTML=profile.steps.map(function(item,index){return '<button class="cf-guide-step" type="button" data-guide-step="'+index+'" aria-controls="cfGuideStage" aria-pressed="false"><span class="cf-guide-icon-box">'+icon(item.icon)+'</span><span class="cf-guide-step-title">'+esc(item.title)+'</span><span class="cf-guide-step-desc">'+esc(item.short)+'</span></button>';}).join('');
   lastAudience=state.audience;
  }
  const slideKey=state.audience+':'+state.index;
  if(lastSlide!==slideKey){root.querySelector('#cfGuideStage').innerHTML='<div class="cf-guide-stage-copy"><span class="cf-guide-stage-meta">ETAPA '+String(state.index+1).padStart(2,'0')+' DE 03</span><h3>'+esc(step.title)+'</h3><p>'+esc(step.text)+'</p></div><div class="cf-guide-graphic">'+graphic(step.graphic,state.audience)+'<p class="cf-guide-graphic-note">Ilustração do fluxo no portal</p></div>';lastSlide=slideKey;}
  root.querySelectorAll('[data-guide-step]').forEach(function(button){button.setAttribute('aria-pressed',String(Number(button.dataset.guideStep)===state.index));});
  root.querySelector('#cfGuideCounter').textContent=(state.index+1)+' de 3';
  const pause=root.querySelector('#cfGuidePause');pause.innerHTML=icon(state.paused?'play':'pause')+'<span>'+(state.paused?'Reproduzir slides':'Pausar slides')+'</span>';
  pause.setAttribute('aria-label',state.paused?'Reproduzir slides automaticamente':'Pausar slides automáticos');
  if(reason==='manual'||reason==='audience')root.querySelector('#cfGuideStatus').textContent=step.title+'. Etapa '+(state.index+1)+' de 3.';
 }
 render(controller.state(),'initial');
 root.addEventListener('click',function(event){
  const tab=event.target.closest('[data-guide-audience]');if(tab){controller.selectAudience(tab.dataset.guideAudience);if(new URLSearchParams(location.search).get('pagina')==='como-funciona'){const url=new URL(location.href);if(tab.dataset.guideAudience==='empresa')url.searchParams.set('publico','empresa');else url.searchParams.delete('publico');history.replaceState(history.state,'',url);}return;}
  const step=event.target.closest('[data-guide-step]');if(step){controller.select(Number(step.dataset.guideStep));return;}
  const control=event.target.closest('[data-guide-control]');if(control){if(control.dataset.guideControl==='pause'){controller.togglePaused();if(!controller.state().paused){controller.setFocused(false);controller.setHovered(false);}}else if(control.dataset.guideControl==='next')controller.next();else controller.previous();return;}
  const route=event.target.closest('[data-guide-route]');if(route&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&!event.altKey&&typeof global.irPara==='function'){event.preventDefault();global.irPara(route.dataset.guideRoute);if(route.dataset.guideRoute==='home')setTimeout(function(){if(typeof global.rolarVagas==='function')global.rolarVagas();},150);}
 });
 root.querySelector('.cf-guide-tabs').addEventListener('keydown',function(event){if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();let audience=event.key==='Home'?'candidato':event.key==='End'?'empresa':controller.state().audience==='empresa'?'candidato':'empresa';root.querySelector('[data-guide-audience="'+audience+'"]').click();root.querySelector('[data-guide-audience="'+audience+'"]').focus();});
 const carousel=root.querySelector('.cf-guide-carousel');carousel.addEventListener('mouseenter',function(){controller.setHovered(true);});carousel.addEventListener('mouseleave',function(){controller.setHovered(false);});
 root.addEventListener('focusin',function(event){controller.setFocused(!!event.target.closest('.cf-guide-carousel,.cf-guide-steps'));});root.addEventListener('focusout',function(event){const next=event.relatedTarget;controller.setFocused(!!(next&&next.closest&&next.closest('.cf-guide-carousel,.cf-guide-steps')));});
 let inView=true;if(typeof IntersectionObserver!=='undefined'){const observer=new IntersectionObserver(function(entries){inView=entries[0].intersectionRatio>=.15;},{threshold:.15});observer.observe(carousel);}
 setInterval(function(){controller.setVisible(!document.hidden&&inView&&page.classList.contains('ativa'));controller.tick();},6500);
 global.addEventListener('popstate',function(){if(new URLSearchParams(location.search).get('pagina')==='como-funciona')controller.selectAudience(new URLSearchParams(location.search).get('publico')==='empresa'?'empresa':'candidato');});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})(typeof window!=='undefined'?window:globalThis);
