(function () {
  'use strict';
  const C = window.EMAdminCore, catalog = window.EMAdminCatalog;
  const supportAssetVersion=document.currentScript?new URL(document.currentScript.src).search:'?v=20261018-support-2';
  const $ = id => document.getElementById(id), E = C.escape;
  const preview = new URLSearchParams(location.search).get('modo') === 'previa';
  const DEMO_KEY = 'maisempregos.adm.previa.v1', SESSION_KEY = 'maisempregos.adm.session.v1', PREF_KEY = 'maisempregos.adm.preferences.v1';
  const BASE = 'https://mkezlcewyengejdmtppl.supabase.co', KEY = 'sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR';
  function stored(storage, key, fallback) { try { return JSON.parse(storage.getItem(key)) ?? fallback; } catch (_) { return fallback; } }
  function save(storage, key, value) { storage.setItem(key, JSON.stringify(value)); }
  let prefs = stored(localStorage, PREF_KEY, {pageSize:15});
  if (![15,25,50].includes(Number(prefs.pageSize))) prefs.pageSize = 15;
  let demo = preview ? stored(localStorage, DEMO_KEY, null) : null;
  if (preview && !C.validDemo(demo)) demo = C.demoSeed();
  let session = preview ? null : stored(sessionStorage, SESSION_KEY, null);
  let state = {section:'overview',query:'',filter:'',page:0,rows:[],total:0,sequence:0}, toastTimer;
  const sections = {
    overview:['Visão geral','Acompanhe o portal e o que precisa da sua atenção.','overview'],
    jobs:['Vagas','Revise publicações e acompanhe o status das vagas.','jobs'],
    companies:['Empresas','Gerencie os cadastros e o acesso das empresas.','companies'],
    candidates:['Candidatos','Consulte os perfis e os benefícios dos candidatos.','candidates'],
    applications:['Candidaturas','Acompanhe os processos seletivos do portal.','applications'],
    verifications:['Verificações','Analise as solicitações de verificação das empresas.','shield'],
    subscriptions:['Assinaturas ativas','Consulte os planos ativos, a validade e a origem.','subscriptions'],
    plans:['Planos e benefícios','Consulte os valores e as cotas definidas para o portal.','plans'],
    reports:['Denúncias','Revise os relatos e registre suas decisões de moderação.','reports'],
    support:['Suporte às empresas','Responda e acompanhe os chamados recebidos.','applications'],
    history:['Histórico','Acompanhe as decisões administrativas registradas.','history'],
    settings:['Configurações','Ajuste as preferências deste painel.','settings']
  };
  const iconPaths = {
    overview:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    jobs:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v3M3 12h18M10 12v3h4v-3"/>',
    companies:'<path d="M4 21V4h11v17M15 10h5v11M2 21h20M7 7h1m3 0h1M7 11h1m3 0h1M7 15h1m3 0h1M9 21v-3h3v3"/>',
    candidates:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-3a8 8 0 0 1 16 0v3"/>',
    applications:'<path d="M8 4H5v17h14V4h-3M9 2h6v5H9zM8 12h8M8 16h5"/>',
    shield:'<path d="M12 2l8 3v6c0 5-8 11-8 11S4 16 4 11V5zM8 12l3 3 5-6"/>',
    subscriptions:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M7 15h4M15 15h2"/>',
    plans:'<path d="M3 8l5 4 4-8 4 8 5-4-3 12H6z"/>',
    reports:'<path d="M12 3L2 20h20zM12 9v5m0 3v.3"/>',
    history:'<path d="M3 11a9 9 0 1 1 2 7M3 4v7h7M12 7v5l3 2"/>',
    settings:'<path d="M4 7h16M4 17h16"/><circle cx="8" cy="7" r="3" fill="currentColor" stroke="none"/><circle cx="16" cy="17" r="3" fill="currentColor" stroke="none"/>'
  };
  const icon = name => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(iconPaths[name]||iconPaths.overview)+'</svg>';
  const labels = {aprovada:'Publicada',pendente:'Aguardando análise',suspensa:'Suspensa',reprovada:'Reprovada',ativa:'Ativa',em_analise:'Em análise',verificada:'Verificada',rejeitada:'Rejeitada',nao_verificada:'Não verificada',resolvida:'Resolvida',descartada:'Descartada',cortesia_admin:'Cortesia do ADM',basico:'Grátis',mensal:'Mensal',trimestral:'Trimestral',semestral:'Semestral',anual:'Anual',approve:'Vaga aprovada',reject:'Vaga reprovada',pause:'Vaga suspensa',resume:'Vaga reativada',suspend:'Empresa suspensa',restore:'Empresa reativada',grantPlan:'Plano concedido',premium:'Premium concedido',removePremium:'Premium removido',approveVerification:'Verificação aprovada',rejectVerification:'Verificação rejeitada',resolve:'Denúncia resolvida',discard:'Denúncia descartada',suspendJob:'Vaga suspensa por denúncia'};
  const label = value => labels[value] || String(value || '—');
  const money = value => Number(value || 0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const status = (row, kind) => kind === 'companies' ? row.suspensa_admin ? 'suspensa' : 'ativa' : kind === 'candidates' ? row.premium && Date.parse(row.premium_valido_ate||'')>Date.now() ? 'premium' : 'padrao' : row.status || '';
  function badge(value) {
    const text = label(value), key = C.normalize(value);
    const style = /pendente|analise|aguardando/.test(key)?'pending':/rejeit|reprov|suspens|descart/.test(key)?'danger':/premium|entrevista/.test(key)?'purple':/padrao|nao_verificada/.test(key)?'neutral':'';
    return '<span class="badge '+style+'">'+E(text)+'</span>';
  }
  function toast(text, error = false) { clearTimeout(toastTimer); $('toast').hidden=false; $('toast').textContent=text; $('toast').classList.toggle('error',error); toastTimer=setTimeout(()=>{$('toast').hidden=true;},6500); }
  function showConnection(message) { $('connectionNotice').hidden=!message; $('connectionNotice').textContent=message; }
  function sessionSave(value) { session=value; if(value) save(sessionStorage,SESSION_KEY,value); else sessionStorage.removeItem(SESSION_KEY); }
  function errorMessage(error) { return error?.name==='TimeoutError'||error?.name==='AbortError' ? 'O serviço não respondeu a tempo. Tente novamente ou abra a prévia.' : error?.message || 'Não foi possível concluir a operação.'; }
  let refreshing;
  async function renew() {
    if (refreshing) return refreshing;
    refreshing = (async()=>{
      if(!session?.refresh_token) throw Error('Sua sessão expirou. Entre novamente.');
      const data=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token:session.refresh_token},auth:false,retry:false});
      sessionSave({access_token:data.access_token,refresh_token:data.refresh_token,email:data.user?.email||session.email});
    })().finally(()=>{refreshing=null;});
    return refreshing;
  }
  async function request(path,{method='GET',body,auth=true,retry=true,count=false}={}) {
    if(preview) throw Error('A prévia não acessa o banco de dados.');
    if(auth&&!session?.access_token) throw Error('Entre na sua conta administrativa.');
    const headers={apikey:KEY,'Content-Type':'application/json'};
    if(auth)headers.Authorization='Bearer '+session.access_token;
    if(count)headers.Prefer='count=exact';
    const response=await fetch(BASE+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(12000),cache:'no-store'});
    if(response.status===401&&auth&&retry){await renew();return request(path,{method,body,auth,retry:false,count});}
    const text=await response.text();let data=null;try{data=text?JSON.parse(text):null;}catch(_){throw Error('O servidor retornou uma resposta inválida.');}
    if(!response.ok){
      const message=response.status===401?'E-mail ou senha incorretos.':response.status===403?'Sua conta não tem autorização administrativa.':response.status===429?'O serviço atingiu o limite de uso. A prévia continua disponível.':response.status>=500?'O banco está indisponível no momento. A prévia continua disponível.':data?.message||data?.error_description||data?.msg||'Não foi possível concluir a consulta.';
      throw Error(message);
    }
    if(count){const range=response.headers.get('content-range')||'',total=Number(range.split('/')[1]);return {rows:data||[],total:Number.isFinite(total)?total:(data||[]).length};}
    return data;
  }
  const rpc = (name, body={}) => request('/rest/v1/rpc/'+name,{method:'POST',body});
  const sources = {
    jobs:{table:'vagas',fields:'id,cargo,empresa,empresa_id,cidade,estado,contrato,modalidade,status,criado_em,data_encerramento,salario,destaque,urgente,confidencial,descricao,requisitos,beneficios,motivo_reprovacao',search:['cargo','empresa','cidade'],order:'criado_em.desc'},
    companies:{table:'empresas',fields:'id,nome,nome_fantasia,razao_social,cnpj,email,email_corporativo,cidade,uf,telefone,plano_id,plano_inicio,plano_valido_ate,verificada,verificacao_status,suspensa_admin,criado_em',search:['nome','nome_fantasia','cnpj','email'],order:'criado_em.desc'},
    candidates:{table:'candidatos',fields:'id,nome,email,telefone,cidade,premium,premium_valido_ate,criado_em',search:['nome','email','cidade'],order:'criado_em.desc'},
    applications:{table:'candidaturas',fields:'id,vaga_id,candidato_nome,candidato_email,status,aderencia,criado_em',search:['candidato_nome','candidato_email'],order:'criado_em.desc'},
    verifications:{rpc:'admin_listar_verificacoes'},subscriptions:{rpc:'admin_listar_assinantes'},
    reports:{table:'denuncias_vagas',fields:'id,vaga_id,job_ref,motivo,detalhes,status,acao,criado_em,resolvida_em',search:['motivo','detalhes'],order:'criado_em.desc'},
    history:{table:'historico_administrativo',fields:'id,acao,detalhe,criado_em',search:['acao','detalhe'],order:'criado_em.desc'}
  };
  async function getList(kind,{query='',filter='',page=0,size=prefs.pageSize}={}) {
    if(preview){const all=C.filter(demo[kind]||[],query,filter,r=>status(r,kind));return {rows:all.slice(page*size,(page+1)*size),total:all.length};}
    const source=sources[kind];
    if(source.rpc){const all=C.filter(await rpc(source.rpc),query,filter,r=>status(r,kind));return {rows:all.slice(page*size,(page+1)*size),total:all.length};}
    const params=new URLSearchParams({select:source.fields,order:source.order,limit:String(size),offset:String(page*size)});
    if(filter){if(kind==='companies')params.set('suspensa_admin','eq.'+(filter==='suspensa'));else if(kind==='candidates'){if(filter==='premium'){params.set('premium','eq.true');params.set('premium_valido_ate','gt.'+new Date().toISOString());}else params.set('or','(premium.eq.false,premium.is.null,premium_valido_ate.is.null,premium_valido_ate.lte.'+new Date().toISOString()+')');}else params.set('status','eq.'+filter);}
    const q=query.replace(/[,*().%\\"']/g,' ').trim().slice(0,100);
    if(q){const search='('+source.search.map(field=>field+'.ilike.*'+q+'*').join(',')+')';if(params.has('or')){params.set('and','(or'+params.get('or')+',or'+search+')');params.delete('or');}else params.set('or',search);}
    return request('/rest/v1/'+source.table+'?'+params,{count:true});
  }
  async function count(kind, filter='') {
    if(preview)return C.filter(demo[kind]||[],'',filter,r=>status(r,kind)).length;
    if(sources[kind].rpc)return C.filter(await rpc(sources[kind].rpc),'',filter,r=>status(r,kind)).length;
    const params=new URLSearchParams({select:'id',limit:'1'});if(filter)params.set('status','eq.'+filter);
    return (await request('/rest/v1/'+sources[kind].table+'?'+params,{count:true})).total;
  }
  const loading = '<div class="loading"><span class="spinner" aria-hidden="true"></span>Carregando dados do painel…</div>';
  const empty = (title, text='') => '<div class="empty"><strong>'+E(title)+'</strong>'+E(text)+'</div>';
  function panel(title,body,link) {return '<section class="panel"><div class="panel-heading"><div><h2>'+E(title)+'</h2></div>'+(link?'<button class="button small" data-go="'+E(link)+'">Ver todos →</button>':'')+'</div>'+body+'</section>';}
  async function overview(sequence) {
    const tasks=[count('companies'),count('candidates'),count('jobs'),count('applications'),count('jobs','pendente'),count('verifications','em_analise'),count('reports','pendente'),getList('jobs',{filter:'pendente',size:5}),getList('history',{size:5})];
    const results=await Promise.allSettled(tasks);if(sequence!==state.sequence)return;
    const value=i=>results[i].status==='fulfilled'?results[i].value:null;
    const metricData=[['Empresas','companies','companies'],['Candidatos','candidates','candidates'],['Vagas','jobs','jobs'],['Candidaturas','applications','applications']];
    const metrics='<div class="metrics">'+metricData.map((m,i)=>'<button class="metric" data-go="'+m[1]+'"><span class="metric-top">'+m[0]+'<span class="metric-icon">'+icon(m[2])+'</span></span><b>'+E(value(i)??'—')+'</b><small>Ver '+m[0].toLowerCase()+' →</small></button>').join('')+'</div>';
    const attention='<div class="attention-list">'+[['Vagas para aprovação','jobs','jobs',4,'pendente'],['Empresas para verificação','verifications','shield',5,'em_analise'],['Denúncias para análise','reports','reports',6,'pendente']].map(m=>'<button class="attention" data-go="'+m[1]+'" data-filter="'+m[5]+'"><span class="attention-icon">'+icon(m[2])+'</span><span><strong>'+m[0]+'</strong><small>Abrir fila de análise →</small></span><b>'+E(value(m[3])??'—')+'</b></button>').join('')+'</div>';
    const pending=value(7);const jobs=pending?.rows.length?pending.rows.map(row=>'<div class="list-row"><div><strong>'+E(row.cargo)+'</strong><small>'+E(row.empresa)+' · '+E(row.cidade)+'</small></div><button class="button small" data-detail="jobs" data-id="'+E(C.rowId(row))+'">Analisar</button></div>').join(''):empty(pending?'Tudo em dia por aqui':'Fila indisponível',pending?'Nenhuma vaga aguardando aprovação.':'Tente atualizar o painel.');
    const recent=value(8);const history=recent?.rows.length?recent.rows.map(row=>'<div class="list-row"><div><strong>'+E(label(row.acao))+'</strong><small>'+E(C.date(row.criado_em))+'</small></div></div>').join(''):empty(recent?'Nenhuma ação registrada':'Histórico indisponível');
    $('content').innerHTML=metrics+'<div class="dashboard-grid"><div>'+panel('Vagas aguardando aprovação',jobs,'jobs')+panel('Atividade recente',history,'history')+'</div><div>'+panel('Precisa da sua atenção',attention)+panel('Gestão do portal','<div class="panel-body"><p style="font-size:12px;margin:0;color:#64758b">Revise os cadastros, acompanhe as assinaturas e mantenha as oportunidades atualizadas.</p><button class="button primary" data-go="companies" style="margin-top:18px">Gerenciar empresas →</button></div>')+'</div></div>';
    state.overviewJobs=pending?.rows||[];
    if(results.some(r=>r.status==='rejected'))showConnection('Alguns dados não puderam ser carregados. Os indicadores indisponíveis aparecem como “—”. Use Atualizar para tentar novamente.');
    updated();
  }
  const filters={jobs:[['pendente','Aguardando aprovação'],['aprovada','Publicadas'],['suspensa','Suspensas'],['reprovada','Reprovadas'],['encerrada','Encerradas']],companies:[['ativa','Ativas'],['suspensa','Suspensas']],candidates:[['premium','Premium ativo'],['padrao','Sem Premium ativo']],applications:[['Aguardando análise','Aguardando análise'],['Em entrevista','Em entrevista'],['Contratado','Contratado'],['Reprovado','Reprovado']],verifications:[['em_analise','Em análise'],['verificada','Verificadas'],['rejeitada','Rejeitadas']],reports:[['pendente','Pendentes'],['resolvida','Resolvidas'],['descartada','Descartadas']]};
  function listShell(kind) {
    $('content').innerHTML='<section class="panel"><div class="toolbar"><label class="search"><span class="sr-only" hidden>Pesquisar registros</span><input id="tableSearch" aria-label="Pesquisar registros" placeholder="Pesquisar nesta área…" value="'+E(state.query)+'"></label>'+(filters[kind]?'<select id="tableFilter" aria-label="Filtrar por status"><option value="">Todos os status</option>'+filters[kind].map(([v,l])=>'<option value="'+E(v)+'" '+(v===state.filter?'selected':'')+'>'+E(l)+'</option>').join('')+'</select>':'')+'<button id="export" class="button" type="button">Exportar página</button></div><div id="listContent">'+loading+'</div><div id="pagination"></div></section>'+(kind==='subscriptions'?'<div class="note">São exibidas as assinaturas ativas. Valores de cortesia ficam separados dos pagamentos. A cobrança automática ainda não está conectada ao portal.</div>':'');
    let searchTimer;$('tableSearch').oninput=event=>{state.query=event.target.value;state.page=0;clearTimeout(searchTimer);searchTimer=setTimeout(()=>loadList(kind),250);};
    if($('tableFilter'))$('tableFilter').onchange=event=>{state.filter=event.target.value;state.page=0;loadList(kind);};
    $('export').onclick=exportPage;
  }
  const columns={jobs:['Vaga','Empresa','Local','Status','Publicada em','Ações'],companies:['Empresa','Plano atual','Verificação','Status','Cadastro','Ações'],candidates:['Candidato','Cidade','Benefício','Cadastro','Ações'],applications:['Candidato','Vaga','Etapa','Cadastro','Ações'],verifications:['Empresa','Solicitação','Status','Ações'],subscriptions:['Empresa','Plano','Valor registrado','Validade','Origem','Ações'],reports:['Motivo','Referência da vaga','Status','Enviada em','Ações'],history:['Ação','Detalhe','Data']};
  function actionButton(kind,row,action,title,style='') {return '<button type="button" class="button small '+style+'" data-action="'+action+'" data-kind="'+kind+'" data-id="'+E(C.rowId(row))+'">'+E(title)+'</button>';}
  function actions(kind,row,detail=true) {
    const out=detail?['<button class="button small" data-detail="'+kind+'" data-id="'+E(C.rowId(row))+'">Ver detalhes</button>']:[];
    if(kind==='jobs'){if(row.status==='pendente')out.push(actionButton(kind,row,'approve','Aprovar','primary'),actionButton(kind,row,'reject','Reprovar','danger'));else if(row.status==='aprovada')out.push(actionButton(kind,row,'pause','Suspender','danger'));else if(row.status==='suspensa')out.push(actionButton(kind,row,'resume','Reativar'));}
    if(kind==='companies')out.push(actionButton(kind,row,'grantPlan','Conceder plano'),actionButton(kind,row,row.suspensa_admin?'restore':'suspend',row.suspensa_admin?'Reativar':'Suspender',row.suspensa_admin?'':'danger'));
    if(kind==='candidates')out.push(actionButton(kind,row,status(row,kind)==='premium'?'removePremium':'premium',status(row,kind)==='premium'?'Remover Premium':'Conceder Premium'));
    if(kind==='verifications'&&row.status==='em_analise')out.push(actionButton(kind,row,'approveVerification','Aprovar','primary'),actionButton(kind,row,'rejectVerification','Rejeitar','danger'));
    if(kind==='reports'&&row.status==='pendente')out.push(actionButton(kind,row,'resolve','Resolver'),actionButton(kind,row,'discard','Descartar'),actionButton(kind,row,'suspendJob','Suspender vaga','danger'));
    return '<div class="actions">'+out.join('')+'</div>';
  }
  function rowCells(kind,row,plain=false) {
    const strong=(text,sub='')=>plain?text+(sub?' · '+sub:''):'<strong>'+E(text)+'</strong>'+(sub?'<small>'+E(sub)+'</small>':'');
    const B=v=>plain?label(v):badge(v), A=()=>plain?'':actions(kind,row);
    switch(kind){
      case 'jobs':return [strong(row.cargo),E(row.empresa),E([row.cidade,row.estado].filter(Boolean).join(' – ')),B(row.status),C.date(row.criado_em),A()];
      case 'companies':return [strong(row.nome_fantasia||row.nome,row.email||row.email_corporativo||''),E(label(C.planActive(row))),B(row.verificada?'verificada':row.verificacao_status||'nao_verificada'),B(status(row,kind)),C.date(row.criado_em),A()];
      case 'candidates':return [strong(row.nome,row.email),E(row.cidade),B(status(row,kind)==='premium'?'Premium ativo':'Padrão'),C.date(row.criado_em),A()];
      case 'applications':return [strong(row.candidato_nome,row.candidato_email),E(row.vaga_id),B(row.status),C.date(row.criado_em),A()];
      case 'verifications':return [strong(row.nome_fantasia||row.razao_social,row.cnpj),C.date(row.enviada_em),B(row.status),A()];
      case 'subscriptions':return [strong(row.nome_fantasia||row.razao_social),E(label(row.plano_id)),money(row.valor_pago),C.date(row.termina_em),E(label(row.origem)),A()];
      case 'reports':return [strong(row.motivo),E(row.vaga_id||row.job_ref),B(row.status),C.date(row.criado_em),A()];
      case 'history':return [strong(label(row.acao)),E(row.detalhe),C.date(row.criado_em)];
      default:return [];
    }
  }
  function table(kind,rows) {
    if(!rows.length)return empty('Nenhum registro encontrado','Tente mudar a pesquisa ou o filtro.');
    return '<div class="table-scroll"><table><thead><tr>'+columns[kind].map(c=>'<th scope="col">'+E(c)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+rowCells(kind,row).map((cell,i)=>'<td data-label="'+E(columns[kind][i])+'"><div>'+cell+'</div></td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  }
  async function loadList(kind) {
    const sequence=++state.sequence;$('listContent').innerHTML=loading;$('pagination').innerHTML='';state.rows=[];$('export').disabled=true;
    try{
      const result=await getList(kind,{query:state.query,filter:state.filter,page:state.page});if(sequence!==state.sequence)return;
      if(!result.rows.length&&state.page>0){state.page--;return loadList(kind);}
      state.rows=result.rows;state.total=result.total;$('listContent').innerHTML=table(kind,result.rows);$('export').disabled=!result.rows.length;
      const from=result.total?state.page*prefs.pageSize+1:0,to=Math.min((state.page+1)*prefs.pageSize,result.total);
      $('pagination').innerHTML='<div class="pager"><span>'+from+'–'+to+' de '+result.total+' registros</span><div class="actions"><button class="button small" id="previousPage" '+(state.page===0?'disabled':'')+'>← Anterior</button><button class="button small" id="nextPage" '+(to>=result.total?'disabled':'')+'>Próxima →</button></div></div>';
      $('previousPage').onclick=()=>{state.page--;loadList(kind);};$('nextPage').onclick=()=>{state.page++;loadList(kind);};updated();
    }catch(error){if(sequence!==state.sequence)return;$('listContent').innerHTML=empty('Dados indisponíveis',errorMessage(error));showConnection(errorMessage(error));}
  }
  function updated() { $('updatedAt').textContent='Atualizado às '+new Date().toLocaleTimeString('pt-BR',{timeZone:'America/Sao_Paulo',hour:'2-digit',minute:'2-digit'}); }
  function plans() {
    $('content').innerHTML='<div class="note">As vagas dos planos pagos valem para todo o período contratado. As cotas de destaque, urgência e confidencialidade são mensais. Cada vaga fica publicada por até 45 dias.</div><div class="plan-grid">'+Object.values(catalog).map(p=>'<section class="panel plan-card"><span class="plan-name">'+E(p.nome)+'</span><div class="plan-price">'+money(p.preco)+'</div><p>'+(p.meses?'Por '+p.meses+' '+(p.meses===1?'mês':'meses'):'Sem mensalidade')+'</p><div class="plan-features"><div><strong>'+p.vagas+' vagas</strong> '+(p.pago?'durante o período':'por mês')+'</div><div>Destaques: <strong>'+p.destaques+' por mês</strong></div><div>Urgentes: <strong>'+p.urgentes+' por mês</strong></div><div>Confidenciais: <strong>'+p.confidenciais+' por mês</strong></div></div></section>').join('')+'</div><div class="note">Serviços avulsos: R$ 9,90 por ativação. Destaque e confidencialidade: 15 dias. Urgência: 7 dias. No mensal, os três serviços são contratados por fora. Para liberar um plano como cortesia, abra o cadastro da empresa.</div>';updated();
  }
  function settings() {
    $('content').innerHTML=panel('Preferências do painel','<div class="panel-body"><form id="preferencesForm" class="settings-form"><label>Registros por página<select id="pageSize">'+[15,25,50].map(n=>'<option value="'+n+'" '+(Number(prefs.pageSize)===n?'selected':'')+'>'+n+' registros</option>').join('')+'</select></label><small>Esta preferência é salva neste navegador e afeta apenas a exibição do painel.</small><div><button class="button primary" type="submit">Salvar preferência</button></div></form></div>')+panel(preview?'Dados de exemplo':'Sua sessão','<div class="panel-body"><p style="font-size:12px;color:#64758b">'+(preview?'Você pode reiniciar os registros de exemplo para testar os fluxos novamente.':'Conta administrativa: '+E(session?.email||''))+'</p><button id="'+(preview?'resetDemo':'settingsSignOut')+'" class="button '+(preview?'danger':'')+'">'+(preview?'Reiniciar prévia':'Sair do painel')+'</button></div>');
    $('preferencesForm').onsubmit=e=>{e.preventDefault();prefs={pageSize:Number($('pageSize').value)};try{save(localStorage,PREF_KEY,prefs);toast('Preferência salva.');}catch(_){toast('Não foi possível salvar a preferência neste navegador.',true);}};
    if(preview)$('resetDemo').onclick=()=>{openDialog('Reiniciar a prévia','<div class="dialog-form"><p>Os testes feitos neste navegador serão substituídos pelos dados de exemplo iniciais.</p></div>','<button id="confirmReset" class="button danger">Reiniciar dados de exemplo</button>');$('confirmReset').onclick=()=>{const next=C.demoSeed();try{save(localStorage,DEMO_KEY,next);demo=next;$('recordDialog').close();go('overview');toast('Prévia reiniciada.');}catch(_){toast('Não foi possível salvar a prévia neste navegador.',true);}};};
    else $('settingsSignOut').onclick=signOut;
    updated();
  }
  function supportInbox(){
    const container=document.createElement('section');container.id='emAdminSupport';$('content').replaceChildren(container);
    const ready=()=>{if(!container.isConnected||!window.EMSupport)return;window.EMSupport.mount(container,{admin:true,demo:preview,company:{cnpj:'00000000000100'},request});};
    if(window.EMSupport){ready();return;}const script=document.createElement('script');script.src='recruiter-support.js?v=20261020-poppins-global'+supportAssetVersion;script.onload=ready;script.onerror=()=>{container.textContent='Não foi possível carregar os chamados. Atualize a página.';};document.head.appendChild(script);
  }
  function go(section,filter='') {
    if(!sections[section])section='overview';state={section,query:'',filter,page:0,rows:[],total:0,sequence:state.sequence+1};showConnection('');
    $('pageTitle').textContent=sections[section][0];$('pageSubtitle').textContent=sections[section][1];
    document.querySelectorAll('.nav-button').forEach(b=>{const active=b.dataset.go===section;b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
    const hash='#'+section;if(location.hash!==hash)history.replaceState(null,'',location.pathname+location.search+hash);
    if(section==='support')supportInbox();else if(section==='overview'){$('content').innerHTML=loading;overview(state.sequence);}else if(section==='plans')plans();else if(section==='settings')settings();else{listShell(section);loadList(section);}
  }
  function openDialog(title,body,actions='') { $('dialogTitle').textContent=title;$('dialogContent').innerHTML=body;$('dialogActions').innerHTML=actions;if(!$('recordDialog').open)$('recordDialog').showModal(); }
  function findRow(kind,id) { return (preview?demo[kind]:kind==='jobs'&&state.section==='overview'?state.overviewJobs:state.rows)?.find(r=>C.rowId(r)===String(id)); }
  const detailFields={jobs:[['Cargo','cargo'],['Empresa','empresa'],['Cidade','cidade'],['Modalidade','modalidade'],['Contrato','contrato'],['Salário','salario','money'],['Status','status','label'],['Prazo','data_encerramento','date'],['Descrição','descricao'],['Requisitos','requisitos'],['Benefícios','beneficios'],['Motivo da reprovação','motivo_reprovacao']],companies:[['Empresa','nome_fantasia'],['Razão social','razao_social'],['CNPJ','cnpj'],['E-mail','email'],['E-mail corporativo','email_corporativo'],['Telefone','telefone'],['Cidade','cidade'],['UF','uf'],['Plano','plano_id','label'],['Válido até','plano_valido_ate','date']],candidates:[['Nome','nome'],['E-mail','email'],['Telefone','telefone'],['Cidade','cidade'],['Premium até','premium_valido_ate','date'],['Cadastro','criado_em','date']],applications:[['Candidato','candidato_nome'],['E-mail','candidato_email'],['Vaga','vaga_id'],['Etapa','status'],['Aderência registrada','aderencia'],['Candidatura','criado_em','date']],verifications:[['Empresa','nome_fantasia'],['CNPJ','cnpj'],['Status','status','label'],['Observação da empresa','observacao_empresa'],['Comprovação','comprovacao','url'],['Motivo da decisão','motivo_admin']],subscriptions:[['Empresa','nome_fantasia'],['Plano','plano_id','label'],['Valor registrado','valor_pago','money'],['Origem','origem','label'],['Forma de pagamento','forma_pagamento'],['Início','inicio_em','date'],['Válido até','termina_em','date']],reports:[['Motivo','motivo'],['Relato','detalhes'],['Referência da vaga','vaga_id'],['Referência externa','job_ref'],['Status','status','label'],['Enviada em','criado_em','date']]};
  function detail(kind,id) {
    const row=findRow(kind,id);if(!row){toast('Registro não encontrado. Atualize esta área.',true);return;}
    const fields=(detailFields[kind]||[]).filter(([,key])=>row[key]!==undefined&&row[key]!==null&&row[key]!=='');
    const body='<dl class="detail-list">'+fields.map(([title,key,type])=>{const value=row[key],url=type==='url'?C.safeUrl(value):'';const out=url?'<a href="'+E(url)+'" target="_blank" rel="noopener noreferrer">Abrir comprovante ↗</a>':E(type==='date'?C.date(value):type==='money'?money(value):type==='label'?label(value):value);return '<div><dt>'+title+'</dt><dd>'+out+'</dd></div>';}).join('')+'</dl>';
    openDialog('Detalhes do registro',body,actions(kind,row,false));
  }
  function confirmAction(kind,id,action) {
    const row=findRow(kind,id);if(!row){toast('Registro não encontrado.',true);return;}
    const titles={approve:'Aprovar vaga',reject:'Reprovar vaga',pause:'Suspender vaga',resume:'Reativar vaga',suspend:'Suspender empresa',restore:'Reativar empresa',grantPlan:'Conceder plano como cortesia',premium:'Conceder Premium ao candidato',removePremium:'Remover Premium',approveVerification:'Aprovar verificação',rejectVerification:'Rejeitar verificação',resolve:'Resolver denúncia',discard:'Descartar denúncia',suspendJob:'Suspender vaga denunciada'};
    const requireReason=['reject','rejectVerification'].includes(action),grant=action==='grantPlan',duration=grant||action==='premium';
    const name=row.cargo||row.nome_fantasia||row.nome||row.motivo||rowId(row);
    const description=action==='grantPlan'?'A cortesia não registra pagamento. Ela substitui o plano ativo da empresa pelo plano e prazo escolhidos.':action==='suspendJob'?'A vaga indicada na denúncia será suspensa e o relato será marcado como resolvido.':action==='approveVerification'?'A empresa receberá o selo de verificação. Confirme após analisar a comprovação.':'Confirme a alteração deste registro.';
    openDialog(titles[action]||'Confirmar alteração','<form id="actionForm" class="dialog-form"><p><strong>'+E(name)+'</strong></p><p>'+E(description)+'</p>'+(grant?'<label>Plano<select id="grantPlan">'+Object.values(catalog).map(p=>'<option value="'+p.id+'" '+(p.id==='mensal'?'selected':'')+'>'+p.nome+'</option>').join('')+'</select></label>':'')+(duration?'<label>Validade em dias<input id="grantDays" type="number" min="1" max="730" step="1" value="30" required></label>':'')+(requireReason?'<label>Motivo da decisão<textarea id="actionReason" maxlength="2000" required placeholder="Explique o motivo para registrar a decisão"></textarea></label>':'')+'<p id="actionError" class="form-error" role="alert"></p></form>','<button class="button" id="cancelAction">Cancelar</button><button id="confirmAction" form="actionForm" type="submit" class="button primary">'+(preview?'Simular alteração':'Confirmar alteração')+'</button>');
    $('cancelAction').onclick=()=>$('recordDialog').close();
    if(grant)$('grantPlan').onchange=()=>{$('grantDays').value=catalog[$('grantPlan').value].dias||30;};
    $('actionForm').onsubmit=async event=>{
      event.preventDefault();const button=$('confirmAction');button.disabled=true;button.textContent='Salvando…';$('actionError').textContent='';
      const change={kind,id,action,reason:requireReason?$('actionReason').value.trim():'',plan:grant?$('grantPlan').value:undefined,days:duration?Number($('grantDays').value):30};
      try{
        if(requireReason&&!change.reason)throw Error('Informe o motivo da decisão.');
        if(duration&&(!Number.isInteger(change.days)||change.days<1||change.days>730))throw Error('Informe uma validade entre 1 e 730 dias.');
        if(preview){const next=C.applyDemo(demo,change);save(localStorage,DEMO_KEY,next);demo=next;}else await realAction(change);
        $('recordDialog').close();toast(preview?'Alteração simulada e salva neste navegador.':'Alteração confirmada no servidor.');
        refreshCurrent();
      }catch(error){$('actionError').textContent=errorMessage(error);}
      finally{button.disabled=false;button.textContent=preview?'Simular alteração':'Confirmar alteração';}
    };
  }
  async function realAction(change) {
    const {kind,id,action,reason,plan,days}=change;
    if(kind==='companies'&&action==='grantPlan')return rpc('admin_conceder_plano_portal',{p_empresa_id:id,p_plano:plan,p_dias:days});
    if(kind==='verifications')return rpc(action==='approveVerification'?'admin_aprovar_verificacao':'admin_rejeitar_verificacao',action==='approveVerification'?{p_verificacao_id:id}:{p_verificacao_id:id,p_motivo:reason});
    if(kind==='reports')return rpc('admin_resolver_denuncia_portal',{p_id:id,p_acao:{resolve:'resolver',discard:'descartar',suspendJob:'suspender'}[action]});
    return rpc('admin_painel_operar',{p_tipo:{jobs:'vaga',companies:'empresa',candidates:'candidato'}[kind],p_id:id,p_acao:action,p_motivo:reason||null,p_dias:days});
  }
  function exportPage() {
    const kind=state.section;if(!state.rows.length||!columns[kind])return;
    const headings=columns[kind].filter(x=>x!=='Ações');
    const rows=state.rows.map(row=>rowCells(kind,row,true).slice(0,headings.length).map(value=>{const node=document.createElement('textarea');node.innerHTML=value;return node.value;}));
    const url=URL.createObjectURL(new Blob([C.csv(headings,rows)],{type:'text/csv;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;link.download='maisempregos-adm-'+kind+(preview?'-exemplo':'')+'.csv';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    toast('Exportação da página atual concluída.');
  }
  function refreshCurrent() {showConnection('');if(sources[state.section])loadList(state.section);else if(state.section==='overview'){$('content').innerHTML=loading;overview(++state.sequence);}else go(state.section);}
  function dashboard() {
    $('loginPanel').hidden=true;$('dashboard').hidden=false;$('previewNotice').hidden=!preview;$('sessionLabel').textContent=preview?'Prévia · dados de exemplo':session?.email||'Administrador';
    $('navigation').innerHTML=Object.entries(sections).map(([key,[name,,glyph]])=>'<button type="button" class="nav-button" data-go="'+key+'">'+icon(glyph)+'<span>'+E(name)+'</span></button>').join('');
    go(location.hash.slice(1)||'overview');
  }
  async function signOut() {
    if(!preview&&session)try{await request('/auth/v1/logout',{method:'POST'});}catch(_){}
    sessionSave(null);state.sequence++;$('dashboard').hidden=true;$('loginPanel').hidden=false;$('content').innerHTML='';$('loginPassword').value='';location.href='admin.html';
  }
  function rowId(row){return C.rowId(row);}
  $('closeDialog').onclick=()=>$('recordDialog').close();$('recordDialog').addEventListener('click',event=>{if(event.target===$('recordDialog')){const r=$('recordDialog').getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)$('recordDialog').close();}});
  document.addEventListener('click',event=>{
    const goButton=event.target.closest?.('[data-go]');if(goButton){go(goButton.dataset.go,goButton.dataset.filter||'');return;}
    const detailButton=event.target.closest?.('[data-detail]');if(detailButton){detail(detailButton.dataset.detail,detailButton.dataset.id);return;}
    const actionButton=event.target.closest?.('[data-action]');if(actionButton)confirmAction(actionButton.dataset.kind,actionButton.dataset.id,actionButton.dataset.action);
  });
  $('signOut').onclick=signOut;$('refresh').onclick=refreshCurrent;
  $('loginForm').onsubmit=async event=>{
    event.preventDefault();const button=$('loginSubmit');button.disabled=true;button.textContent='Entrando…';$('loginError').textContent='';
    try{
      const auth=await request('/auth/v1/token?grant_type=password',{method:'POST',body:{email:$('loginEmail').value.trim(),password:$('loginPassword').value},auth:false});
      if(!auth?.access_token)throw Error('Não foi possível criar a sessão administrativa.');
      sessionSave({access_token:auth.access_token,refresh_token:auth.refresh_token,email:auth.user?.email||$('loginEmail').value.trim()});
      if(await rpc('is_admin')!==true)throw Error('Esta conta não tem autorização de administrador.');
      $('loginPassword').value='';dashboard();
    }catch(error){sessionSave(null);$('loginError').textContent=errorMessage(error);}
    finally{button.disabled=false;button.textContent='Entrar no painel';}
  };
  async function start() {
    if(preview){dashboard();return;}
    if(session?.access_token){try{if(await rpc('is_admin')===true){dashboard();return;}throw Error('Esta conta não tem autorização de administrador.');}catch(error){sessionSave(null);$('loginError').textContent=errorMessage(error);}}
  }
  start();
})();
