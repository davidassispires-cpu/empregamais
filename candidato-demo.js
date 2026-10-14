/* Opens the existing candidate pages with isolated demonstration data. */
(function(){
  'use strict';
  if(new URLSearchParams(location.search).get('pagina')!=='demo-candidato')return;
  document.documentElement.classList.add('em-candidate-demo');
  var demoStyle=document.createElement('style');
  demoStyle.textContent='html.em-candidate-demo #pagina-candidaturas .emi-candidate,html.em-candidate-demo #pagina-candidaturas .em-hire-confirmations,html.em-candidate-demo #pagina-candidaturas .em-candidate-inbox,html.em-candidate-demo #pagina-painel-candidato .emi-candidate,html.em-candidate-demo #pagina-painel-candidato .em-hire-confirmations{display:none!important}';
  document.head.appendChild(demoStyle);
  var backing=window.localStorage,prefix='emCandidatePreviewV1:',ready=false;
  function storage(name){
    var values=new Map();try{var saved=JSON.parse(backing.getItem(prefix+name)||'[]');if(Array.isArray(saved))values=new Map(saved);}catch(ignore){}
    function persist(){try{backing.setItem(prefix+name,JSON.stringify(Array.from(values.entries())));}catch(ignore){}}
    return {getItem:function(k){return values.has(String(k))?values.get(String(k)):null;},setItem:function(k,v){values.set(String(k),String(v));persist();},removeItem:function(k){values.delete(String(k));persist();},clear:function(){values.clear();persist();},key:function(i){return Array.from(values.keys())[i]||null;},get length(){return values.size;}};
  }
  Object.defineProperty(window,'localStorage',{value:storage('local'),configurable:true});
  Object.defineProperty(window,'sessionStorage',{value:storage('session'),configurable:true});
  sessionStorage.removeItem('empregaMaisPapel');
  var profile={id:'demo-candidato',nome:'Ana Exemplo',email:'ana@example.com',telefone:'(31) 90000-0000',cep:'30000000',cidade:'Belo Horizonte',uf:'MG',areaProfissional:'Administrativo',cargoDesejado:'Assistente Administrativo',escolaridadeProfissional:'Superior em andamento',experienciaProfissional:'3 anos em atendimento e rotinas administrativas',habilidadesProfissionais:'Excel, atendimento e organização',modalidadePreferida:'Presencial',cidadeProfissional:'Belo Horizonte'};
  var now=new Date(),date=now.toISOString().slice(0,10);
  var jobs=[{id:'demo-1',cargo:'Assistente Administrativo',empresa:'Empresa Demonstração',empresaCnpj:'00000000000100',cidade:'Belo Horizonte',uf:'MG',area:'Administrativo',contrato:'CLT',modalidade:'Presencial',salario:'R$ 2.500,00',status:'ativa',aprovacao:'aprovada',dataPublicacao:date,criadoEm:now.toISOString(),expiraEm:new Date(Date.now()+45*86400000).toISOString(),descricao:'Oportunidade fictícia para visualizar o painel do candidato.',requisitos:'Organização, atendimento e conhecimentos de Excel.',beneficios:'Vale-transporte e vale-alimentação.'},{id:'demo-2',cargo:'Analista de Recursos Humanos',empresa:'Empresa Demonstração',empresaCnpj:'00000000000100',cidade:'Contagem',uf:'MG',area:'Recursos Humanos',contrato:'CLT',modalidade:'Híbrido',salario:'R$ 3.800,00',status:'ativa',aprovacao:'aprovada',dataPublicacao:date,criadoEm:now.toISOString(),expiraEm:new Date(Date.now()+45*86400000).toISOString(),descricao:'Vaga fictícia para conhecer as candidaturas e as vagas salvas.',requisitos:'Boa comunicação e experiência em rotinas de RH.',beneficios:'Vale-transporte.'}];
  function seed(k,v){if(!localStorage.getItem(k))localStorage.setItem(k,JSON.stringify(v));}
  seed('candidatosEmpregaMais',[profile]);seed('vagasEmpregaMais',jobs);
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
    url.searchParams.set('pagina','demo-candidato');history.replaceState({},'',url.toString());}
    window.irPara=function(route,id){open(route,id,true);};window.abrirRota=function(route,id){open(route==='demo-candidato'?new URLSearchParams(location.search).get('abaCandidato')||'painel-candidato':route,id,false);};
    document.addEventListener('click',function(event){var link=event.target.closest('a[href]');if(!link)return;var url=new URL(link.href,location.href),route=url.searchParams.get('pagina');if(url.origin===location.origin&&url.pathname===location.pathname&&allowed.indexOf(route)>=0){event.preventDefault();event.stopImmediatePropagation();window.irPara(route,url.searchParams.get('id'));}},true);
    window.sairCandidato=function(){location.href=location.pathname+'?pagina=demo-recrutador';};
    window.addEventListener('popstate',function(){var p=new URLSearchParams(location.search);open(p.get('abaCandidato')||'painel-candidato',p.get('id'),false);});
    open(new URLSearchParams(location.search).get('abaCandidato')||'painel-candidato',new URLSearchParams(location.search).get('id'),false);
    function demoWidgets(){document.querySelectorAll('#pagina-painel-candidato,#pagina-candidaturas').forEach(function(root){root.querySelectorAll('.emi-candidate,.em-hire-confirmations,.em-candidate-inbox').forEach(function(box){box.style.setProperty('display','none','important');});});}
    ready=true;
    demoWidgets();
    if(window.MutationObserver)document.querySelectorAll('#pagina-painel-candidato,#pagina-candidaturas').forEach(function(root){new MutationObserver(demoWidgets).observe(root,{childList:true,subtree:true});});
  }
  window.addEventListener('load',function(){setTimeout(boot,0);});
})();


/* EmpregaMais: somente tons verdes viram azul no painel do candidato.
   Preserva integralmente os elementos roxos e os SVGs roxos. */
(function(){
  'use strict';
  if(new URLSearchParams(location.search).get('pagina')!=='demo-candidato')return;
  var rootId='pagina-painel-candidato', azul='#173B70', azulClaro='#E5F0FC';
  function verde(value){
    var match=String(value||'').match(/^rgba?\\(\\s*(\\d+)[, ]+\\s*(\\d+)[, ]+\\s*(\\d+)/i);
    if(!match)return false;
    var r=+match[1]/255,g=+match[2]/255,b=+match[3]/255;
    var max=Math.max(r,g,b),min=Math.min(r,g,b),delta=max-min;
    if(delta<.09||max===0)return false;
    var hue=0;
    if(max===r)hue=((g-b)/delta)%6;
    else if(max===g)hue=(b-r)/delta+2;
    else hue=(r-g)/delta+4;
    hue=(hue*60+360)%360;
    return hue>=75&&hue<=170&&g>r*1.10;
  }
  function aplicar(){
    var root=document.getElementById(rootId);
    if(!root||root.hidden||getComputedStyle(root).display==='none')return;
    root.querySelectorAll('*').forEach(function(el){
      if(el.dataset.emGreenToBlue==='1')return;
      var style=getComputedStyle(el),changed=false;
      [['backgroundColor','background-color'],['color','color'],['borderTopColor','border-top-color'],['borderRightColor','border-right-color'],['borderBottomColor','border-bottom-color'],['borderLeftColor','border-left-color']].forEach(function(pair){
        if(verde(style[pair[0]])){el.style.setProperty(pair[1],pair[1]==='background-color'&&style.backgroundColor.match(/rgba?\\(\\s*2[0-5]\\d[, ]+\\s*2[0-5]\\d/)?azulClaro:azul,'important');changed=true;}
      });
      if(el instanceof SVGElement){
        ['fill','stroke'].forEach(function(prop){if(verde(style[prop])){el.style.setProperty(prop,azul,'important');changed=true;}});
      }
      if(changed)el.dataset.emGreenToBlue='1';
    });
  }
  function iniciar(){
    var root=document.getElementById(rootId);if(!root)return;
    var scheduled=false;
    function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){scheduled=false;aplicar();});}
    new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
    schedule();
    document.addEventListener('click',schedule,true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);else iniciar();
})();
