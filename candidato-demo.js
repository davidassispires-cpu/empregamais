/* Opens the existing candidate pages with isolated demonstration data. */
(function(){
  'use strict';
  if(new URLSearchParams(location.search).get('pagina')!=='demo-candidato')return;
  var demoRevision='';
  try{if(document.currentScript&&document.currentScript.src)demoRevision=new URL(document.currentScript.src,location.href).searchParams.get('v')||'';}catch(ignore){}
  document.documentElement.classList.add('em-candidate-demo');
  var demoStyle=document.createElement('style');
  demoStyle.textContent='html.em-candidate-demo #pagina-candidaturas .emi-candidate,html.em-candidate-demo #pagina-candidaturas .em-hire-confirmations,html.em-candidate-demo #pagina-candidaturas .em-candidate-inbox,html.em-candidate-demo #pagina-painel-candidato .emi-candidate,html.em-candidate-demo #pagina-painel-candidato .em-hire-confirmations{display:none!important}'+
    '@layer site-typography{html.em-candidate-demo .pagina>.cp-demo-plans{box-sizing:border-box!important;width:calc(100% - 52px)!important;max-width:1548px!important;margin:8px auto 18px!important}}'+
    '@media(max-width:850px){@layer site-typography{html.em-candidate-demo .pagina>.cp-demo-plans{width:calc(100% - 28px)!important}}}';
  document.head.appendChild(demoStyle);
  var demoPlan=new URLSearchParams(location.search).get('planoCandidato')==='premium'?'premium':'gratuito';
  var backing=window.localStorage,prefix='emCandidatePreviewV2:'+demoPlan+':',ready=false;
  function storage(name){
    var values=new Map();try{var saved=JSON.parse(backing.getItem(prefix+name)||'[]');if(Array.isArray(saved))values=new Map(saved);}catch(ignore){}
    function persist(){try{backing.setItem(prefix+name,JSON.stringify(Array.from(values.entries())));}catch(ignore){}}
    return {getItem:function(k){return values.has(String(k))?values.get(String(k)):null;},setItem:function(k,v){values.set(String(k),String(v));persist();},removeItem:function(k){values.delete(String(k));persist();},clear:function(){values.clear();persist();},key:function(i){return Array.from(values.keys())[i]||null;},get length(){return values.size;}};
  }
  Object.defineProperty(window,'localStorage',{value:storage('local'),configurable:true});
  Object.defineProperty(window,'sessionStorage',{value:storage('session'),configurable:true});
  sessionStorage.removeItem('empregaMaisPapel');
  var profile={"id": "demo-candidato", "nome": "Ana Exemplo", "email": "ana@example.com", "telefone": "(31) 90000-0000", "whatsapp": "(31) 90000-0000", "cep": "30000000", "cidade": "Belo Horizonte", "uf": "MG", "bairro": "Centro", "endereco": "Rua de Demonstração, 100 — endereço fictício", "dataNascimento": "1998-05-12", "areaProfissional": "Administrativo", "cargoDesejado": "Assistente Administrativo", "cargosDesejados": ["Assistente Administrativo", "Assistente de Atendimento"], "escolaridadeProfissional": "Superior em andamento", "experienciaProfissional": "3 anos em atendimento e rotinas administrativas", "habilidadesProfissionais": "Excel, atendimento e organização", "modalidadePreferida": "Presencial", "modalidadesPreferidas": ["Presencial", "Híbrido"], "cidadeProfissional": "Belo Horizonte", "pretensaoSalarial": "R$ 2.500,00", "disponibilidade": "Imediata", "resumoProfissional": "Profissional de demonstração com experiência em atendimento ao cliente, organização de documentos e apoio administrativo. Conhecimentos de Excel, controle de planilhas e acompanhamento de demandas. Busca contribuir com uma equipe colaborativa e desenvolver sua carreira na área administrativa.", "linkedin": "https://example.com/demo/ana-linkedin", "portfolio": "https://example.com/demo/ana-portfolio"};
  var now=new Date(),date=now.toISOString().slice(0,10);
  var day=86400000,urgentUntil=new Date(now.getTime()+7*day).toISOString(),featuredUntil=new Date(now.getTime()+15*day).toISOString();
  function demoJob(number,daysAgo,details){
    var published=new Date(now.getTime()-daysAgo*day).toISOString();
    return Object.assign({id:'demo-'+number,demo:true,empresa:'Empresa Demonstração',empresaCnpj:'00000000000100',uf:'MG',contrato:'CLT',modalidade:'Presencial',status:'ativa',aprovacao:'aprovada',totalCandidaturas:20,dataPublicacao:published,criadoEm:published,expiraEm:new Date(now.getTime()+45*day).toISOString(),descricao:'Vaga de demonstração para conhecer o portal. Esta oportunidade é fictícia.',requisitos:'Boa comunicação, organização e conhecimentos relacionados ao cargo.',beneficios:'Vale-transporte e vale-alimentação.'},details);
  }
  var jobs=[
    demoJob(1,0,{cargo:'Assistente Administrativo',cidade:'Belo Horizonte',area:'Administrativo',salario:'R$ 2.500,00',contratacaoUrgente:true,urgente:true,urgenteAte:urgentUntil,totalCandidaturas:8,requisitos:'Organização, atendimento e conhecimentos de Excel.'}),
    demoJob(2,3,{cargo:'Analista de Recursos Humanos',cidade:'Contagem',area:'Recursos Humanos',modalidade:'Híbrido',salario:'R$ 3.800,00',destaque:true,destaqueAte:featuredUntil,requisitos:'Boa comunicação e experiência em rotinas de RH.'}),
    demoJob(3,.15,{cargo:'Auxiliar de E-commerce',cidade:'Betim',area:'Comercial',salario:'R$ 2.200,00',empresa:'Comércio Demonstração',totalCandidaturas:5,requisitos:'Atendimento ao cliente, cadastro de produtos e organização de pedidos.'}),
    demoJob(4,4,{cargo:'Vendedor de Loja',cidade:'Belo Horizonte',area:'Comercial',salario:'R$ 2.100,00 + comissão',empresa:'Varejo Demonstração',contratacaoUrgente:true,urgente:true,urgenteAte:urgentUntil}),
    demoJob(5,5,{cargo:'Auxiliar de Logística',cidade:'Contagem',area:'Logística',salario:'R$ 2.350,00',empresa:'Empresa confidencial',confidencial:true,confidencialAte:featuredUntil}),
    demoJob(6,.5,{cargo:'Operador de Caixa',cidade:'Betim',area:'Atendimento',salario:'R$ 1.950,00',empresa:'Varejo Demonstração',totalCandidaturas:4}),
    demoJob(7,6,{cargo:'Assistente Financeiro',cidade:'Belo Horizonte',area:'Financeiro',modalidade:'Híbrido',salario:'R$ 2.900,00',destaque:true,destaqueAte:featuredUntil,totalCandidaturas:12,requisitos:'Excel, contas a pagar e receber e organização de documentos.'}),
    demoJob(8,3,{cargo:'Recepcionista',cidade:'Ibirité',area:'Atendimento',salario:'R$ 2.000,00',empresa:'Empresa confidencial',confidencial:true,confidencialAte:featuredUntil}),
    demoJob(9,2.5,{cargo:'Auxiliar de Produção',cidade:'Contagem',area:'Produção',salario:'R$ 2.180,00',empresa:'Indústria Demonstração',contratacaoUrgente:true,urgente:true,urgenteAte:urgentUntil,totalCandidaturas:32}),
    demoJob(10,7,{cargo:'Analista de Marketing',cidade:'Nova Lima',area:'Marketing',modalidade:'Remoto',salario:'R$ 4.200,00',destaque:true,destaqueAte:featuredUntil}),
    demoJob(11,.25,{cargo:'Atendente de Relacionamento',cidade:'Ribeirão das Neves',area:'Atendimento',salario:'R$ 1.980,00',empresa:'Serviços Demonstração'}),
    demoJob(12,9,{cargo:'Assistente Comercial',cidade:'Sabará',area:'Comercial',salario:'R$ 2.600,00',requisitos:'Atendimento, elaboração de propostas e conhecimentos de Excel.'})
  ];
  function seed(k,v){if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify(v));}
  seed('candidatosEmpregaMais',[profile]);
  // Fill the isolated preview curriculum; retain edits made by returning visitors.
  function completeDemoRecord(key,defaults){
    var existing={};try{existing=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(ignore){}
    Object.keys(defaults).forEach(function(k){if(existing[k]==null||existing[k]===''||(Array.isArray(existing[k])&&!existing[k].length))existing[k]=defaults[k];});
    localStorage.setItem(key,JSON.stringify(existing));return existing;
  }
  completeDemoRecord("empregaMaisCurriculoOnline:"+profile.email,{"nome": "Ana Exemplo", "email": "ana@example.com", "telefone": "(31) 90000-0000", "cidade": "Belo Horizonte", "endereco": "Rua de Demonstração, 100 — endereço fictício", "resumo": "Profissional de demonstração com experiência em atendimento ao cliente, organização de documentos e apoio administrativo. Conhecimentos de Excel, controle de planilhas e acompanhamento de demandas. Busca contribuir com uma equipe colaborativa e desenvolver sua carreira na área administrativa.", "objetivo": "Atuar como Assistente Administrativo ou Assistente de Atendimento em Belo Horizonte e região.", "area": "Administrativo", "cursos": "Excel intermediário — Escola de Cursos Demonstração, 40 horas, 2025. Atendimento ao cliente — Centro de Formação Exemplo, 20 horas, 2024.", "habilidades": "Excel, Word, atendimento ao cliente, organização de documentos, controle de planilhas, comunicação e trabalho em equipe.", "idiomas": "Português nativo; Inglês básico.", "complementares": "Perfil inteiramente fictício para testar o portal. Disponibilidade para início imediato e atuação em Belo Horizonte ou Contagem.", "modalidade": "Presencial", "modalidades": ["Presencial", "Híbrido"], "jornada": "Integral", "jornadas": ["Integral"], "contrato": "CLT", "contratos": ["CLT"], "cidadePreferida": "Belo Horizonte e Contagem", "pretensao": "R$ 2.500,00", "disponibilidade": "Imediata", "linkedin": "https://example.com/demo/ana-linkedin", "portfolio": "https://example.com/demo/ana-portfolio", "experiencias": [{"empresa": "Serviços Demonstração Ltda.", "cargo": "Assistente Administrativo", "inicio": "2024-01", "fim": "", "atual": true, "aindaNoCargo": true, "atividades": "Organização de documentos, atualização de planilhas, atendimento a clientes e fornecedores, controle de agendas e apoio às rotinas financeiras e administrativas."}, {"empresa": "Comércio Exemplo Ltda.", "cargo": "Assistente de Atendimento", "inicio": "2023-01", "fim": "2023-12", "atividades": "Atendimento presencial e digital, acompanhamento de pedidos, cadastro de clientes e encaminhamento de solicitações à equipe responsável."}], "formacoes": [{"instituicao": "Faculdade Demonstração", "curso": "Administração", "nivel": "Superior", "status": "Em andamento — conclusão prevista em 2027", "inicio": "2023-02", "fim": "2027-12"}, {"instituicao": "Escola Exemplo", "curso": "Ensino Médio", "nivel": "Ensino Médio", "status": "Concluído em 2016"}]});
  completeDemoRecord("empregaMaisDadosCurriculoV87:"+profile.email,{"cvNomeV87": "Ana Exemplo", "cvTelefoneV87": "(31) 90000-0000", "cvEmailV87": "ana@example.com", "cvCidadePessoalV87": "Belo Horizonte", "cvEnderecoV87": "Rua de Demonstração, 100 — endereço fictício"});
  completeDemoRecord("empregaMaisCurriculoExtrasV85:"+profile.email,{"cvModalidadeV85": "Presencial", "cvCidadeV85": "Belo Horizonte e Contagem", "cvSalarioV85": "R$ 2.500,00", "cvDisponibilidadeV85": "Imediata", "cvLinkedinV85": "https://example.com/demo/ana-linkedin", "cvPortfolioV85": "https://example.com/demo/ana-portfolio"});

  // Refresh only the isolated job fixtures so returning demos see every example.
  localStorage.setItem('vagasEmpregaMais',JSON.stringify(jobs));
  seed('candidaturasEmpregaMais',[{id:'demo-cand-1',vagaId:'demo-1',vaga:'Assistente Administrativo',empresa:'Empresa Demonstração',email:profile.email,nome:profile.nome,candidato:profile.nome,cidade:profile.cidade,status:'Em avaliação',data:date},{id:'demo-cand-2',vagaId:'demo-2',vaga:'Analista de Recursos Humanos',empresa:'Empresa Demonstração',email:profile.email,nome:profile.nome,candidato:profile.nome,cidade:profile.cidade,status:'Entrevista agendada',data:date}]);
  seed('favoritosEmpregaMais_'+profile.email,['demo-1','demo-2']);
  function sampleResume(){
    var stream='BT /F1 18 Tf 50 780 Td (Curriculo de demonstracao) Tj 0 -35 Td /F1 13 Tf (Ana Exemplo) Tj 0 -24 Td (Belo Horizonte - MG | ana@example.com) Tj 0 -35 Td (Assistente Administrativo) Tj 0 -25 Td (Experiencia: atendimento e rotinas administrativas.) Tj 0 -25 Td (Competencias: Excel, organizacao e comunicacao.) Tj ET';
    var objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>','<< /Length '+stream.length+' >>\nstream\n'+stream+'\nendstream','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'],pdf='%PDF-1.4\n',offsets=[0];
    objects.forEach(function(o,i){offsets.push(pdf.length);pdf+=(i+1)+' 0 obj\n'+o+'\nendobj\n';});var xref=pdf.length;pdf+='xref\n0 6\n0000000000 65535 f \n';offsets.slice(1).forEach(function(o){pdf+=String(o).padStart(10,'0')+' 00000 n \n';});pdf+='trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF';return 'data:application/pdf;base64,'+btoa(pdf);
  }
  seed('curriculoEmpregaMais_'+profile.email,{nome:'Curriculo-Demonstracao.pdf',data:date,dados:sampleResume()});
  var realFetch=window.fetch;
  window.fetch=function(input,options){var url=String(input&&input.url||input);if(/supabase\.co|script\.google\.com/.test(url)){var data=/\/candidatos\?/.test(url)?[Object.assign({user_id:'demo-candidato',perfil:profile},profile)]:/\/auth\/v1\/user/.test(url)?{id:'demo-candidato'}:{sucesso:true,demo:true,vagas:jobs,candidaturas:demoApplications()};return Promise.resolve(new Response(JSON.stringify(data),{status:200,headers:{'Content-Type':'application/json'}}));}return realFetch.call(this,input,options);};
  function status(message){var el=document.getElementById('emCandidateDemoNotice');if(el)el.textContent=message||'Demonstração do candidato · Dados fictícios. Alterações somente nesta prévia.';}
  function demoApplications(){
    var workflow=window.EmpregaMaisEtapasCandidatura;
    if(workflow&&typeof workflow.demo==='function')return workflow.demo();
    try{var rows=JSON.parse(localStorage.getItem('candidaturasEmpregaMais')||'[]');if(Array.isArray(rows))return rows;}catch(ignore){}
    return [];
  }
  function saveDemoApplications(rows){
    var workflow=window.EmpregaMaisEtapasCandidatura;
    if(workflow&&typeof workflow.salvarDemo==='function')workflow.salvarDemo(rows);
    else localStorage.setItem('candidaturasEmpregaMais',JSON.stringify(rows));
  }
  function boot(){
    if(ready)return;
    var savedProfiles;try{savedProfiles=JSON.parse(localStorage.getItem('candidatosEmpregaMais')||'[]');}catch(ignore){}
    var savedProfile=Array.isArray(savedProfiles)&&savedProfiles.find(function(item){return item&&item.email==='ana@example.com';});
    if(savedProfile)profile=Object.assign({},profile,savedProfile);
    else localStorage.setItem('candidatosEmpregaMais',JSON.stringify([profile]));
    profile.plano_candidato=demoPlan==='premium'?'premium':'basico';profile.planoCandidato=profile.plano_candidato;profile.plano=profile.plano_candidato;profile.premium_valido_ate=demoPlan==='premium'?new Date(Date.now()+365*86400000).toISOString():null;localStorage.setItem('candidatosEmpregaMais',JSON.stringify([profile]));
    sessionStorage.setItem('empregaMaisPapel','candidato');sessionStorage.setItem('candidatoNome',profile.nome);sessionStorage.setItem('candidatoEmail',profile.email);sessionStorage.setItem('candidatoTelefone',profile.telefone);sessionStorage.setItem('candidatoCep',profile.cep);
    window.candidatoEstaLogado=function(){return true;};window.empresaEstaLogada=function(){return false;};
    window.carregarVagasPortal=function(){return jobs;};window.salvarVagasPortal=function(list){jobs=list;};window.vagasPadrao=[];
    window.sincronizarVagasGoogleSheets=function(){return Promise.resolve(jobs);};
    var previewApplications=demoApplications();
    var viewedExample=previewApplications.find(function(a){return a.email===profile.email&&a.id==='demo-c0';})||previewApplications.find(function(a){return a.email===profile.email;});
    if(viewedExample&&!viewedExample.visualizadoEm){viewedExample.visualizada=true;viewedExample.visualizadoEm=new Date(Date.now()-30*60000).toISOString();saveDemoApplications(previewApplications);}
    window.carregarCandidaturas=function(){return demoApplications();};window.salvarCandidaturas=saveDemoApplications;
    window.apiEmpregaMaisGet=function(){return Promise.resolve({sucesso:true,demo:true,vagas:jobs,candidaturas:window.carregarCandidaturas()});};window.apiEmpregaMaisPost=function(){status('Alteração simulada na demonstração do candidato.');return Promise.resolve({sucesso:true,demo:true});};
    if(window.EmpregaMaisPerfilCloud){window.EmpregaMaisPerfilCloud.refresh=function(){return Promise.resolve(profile);};window.EmpregaMaisPerfilCloud.hydrate=function(){return Promise.resolve(profile);};window.EmpregaMaisPerfilCloud.flush=function(){status('Perfil salvo apenas na demonstração.');return Promise.resolve(profile);};}
    var originalOpen=window.abrirRota,allowed=['painel-candidato','perfil','curriculo','candidaturas','salvas','premium-candidato','home','vaga','candidatura'];
    function open(route,id,push){if(route==='demo-recrutador'){location.href=location.pathname+'?pagina=demo-recrutador&abaPainel=candidates';return;}if(allowed.indexOf(route)<0)route='painel-candidato';var url=new URL(location.href);url.searchParams.set('pagina','demo-candidato');url.searchParams.set('abaCandidato',route);if(id)url.searchParams.set('id',id);else url.searchParams.delete('id');history[push?'pushState':'replaceState']({},'',url.toString());try{originalOpen.call(window,route,id);}catch(error){console.error('Falha ao abrir a prévia do candidato:',error);}
    var target=document.getElementById('pagina-'+route);if(target&&!target.classList.contains('ativa')){document.querySelectorAll('.pagina.ativa').forEach(function(item){item.classList.remove('ativa');});target.classList.add('ativa');}
    url.searchParams.set('pagina','demo-candidato');history.replaceState({},'',url.toString());demoWidgets();}
    window.irPara=function(route,id){open(route,id,true);};window.abrirRota=function(route,id){open(route==='demo-candidato'?new URLSearchParams(location.search).get('abaCandidato')||'painel-candidato':route,id,false);};
    document.addEventListener('click',function(event){var link=event.target.closest('a[href]');if(!link)return;var url=new URL(link.href,location.href),route=url.searchParams.get('pagina');if(url.origin===location.origin&&url.pathname===location.pathname&&allowed.indexOf(route)>=0){event.preventDefault();event.stopImmediatePropagation();window.irPara(route,url.searchParams.get('id'));}},true);
    window.sairCandidato=function(){location.href=location.pathname+'?pagina=demo-recrutador';};
    window.addEventListener('popstate',function(){var p=new URLSearchParams(location.search);open(p.get('abaCandidato')||'painel-candidato',p.get('id'),false);});
    open(new URLSearchParams(location.search).get('abaCandidato')||'painel-candidato',new URLSearchParams(location.search).get('id'),false);
    function demoWidgets(){
      var route=new URLSearchParams(location.search).get('abaCandidato')||'painel-candidato';
      var active=document.getElementById('pagina-'+route);
      var host=active&&(active.querySelector('.container-dashboard,.container-menor')||active);
      // Keep the selector on the current tab, ahead of any Premium summary cards.
      if(demoPanel&&host&&(demoPanel.parentNode!==host||host.firstElementChild!==demoPanel))host.prepend(demoPanel);
      document.querySelectorAll('#pagina-painel-candidato,#pagina-candidaturas').forEach(function(root){root.querySelectorAll('.emi-candidate,.em-hire-confirmations,.em-candidate-inbox').forEach(function(box){box.style.setProperty('display','none','important');});});
    }
    var demoPanel=document.createElement('section');demoPanel.className='cp-demo-plans';demoPanel.setAttribute('aria-label','Selecionar acesso de demonstração');
    demoPanel.innerHTML='<div><strong>Demonstração do candidato</strong><p>Dados fictícios · Sem cobrança. Compare os recursos de cada acesso.</p></div><nav aria-label="Plano da demonstração"></nav>';
    ['gratuito','premium'].forEach(function(plan){var link=document.createElement('a'),url=new URL(location.href);url.searchParams.set('pagina','demo-candidato');url.searchParams.set('abaCandidato','painel-candidato');url.searchParams.set('planoCandidato',plan);url.searchParams.delete('id');if(demoRevision)url.searchParams.set('versaoDemo',demoRevision);link.href=url.toString();link.textContent=plan==='premium'?'Painel Premium':'Painel gratuito';if(plan===demoPlan)link.setAttribute('aria-current','page');demoPanel.querySelector('nav').appendChild(link);});
    ready=true;
    demoWidgets();
    if(window.MutationObserver)document.querySelectorAll('#pagina-painel-candidato,#pagina-candidaturas').forEach(function(root){new MutationObserver(demoWidgets).observe(root,{childList:true,subtree:true});});
  }
  // Open as soon as the DOM and page scripts are ready; images and remote fonts
  // must not leave the demo showing only the public header and footer.
  document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);},{once:true});
  window.addEventListener('load',function(){setTimeout(boot,0);});
})();
