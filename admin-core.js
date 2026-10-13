(function (root) {
  'use strict';
  const normalize = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function filter(rows, query, status, statusOf = row => row.status) {
    const q = normalize(query).trim();
    return rows.filter(row => (!status || String(statusOf(row)) === status) && (!q || Object.values(row).some(v => typeof v !== 'object' && normalize(v).includes(q))));
  }
  function csv(headers, rows) {
    const cell = value => {
      let text = String(value ?? '');
      if (/^[\s]*[=+@-]/.test(text) || /^[\t\r]/.test(text)) text = "'" + text;
      return '"' + text.replace(/"/g, '""') + '"';
    };
    return '\ufeff' + [headers, ...rows].map(row => row.map(cell).join(';')).join('\r\n');
  }
  function safeUrl(value) { try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; } catch (_) { return ''; } }
  function date(value) { if (!value) return '—'; const d = new Date(value); return Number.isFinite(d.getTime()) ? d.toLocaleDateString('pt-BR', {timeZone:'America/Sao_Paulo'}) : '—'; }
  function planActive(row, now = Date.now()) { const end = Date.parse(row.plano_valido_ate || ''); return !row.suspensa_admin && Number.isFinite(end) && end > now ? row.plano_id || 'basico' : 'basico'; }
  function rowId(row) { return String(row.id || row.verificacao_id || row.assinatura_id || ''); }
  function demoSeed(now = Date.now()) {
    const time = offset => new Date(now + offset * 86400000).toISOString();
    const names = ['AURORA LOGÍSTICA','HORIZONTE TECNOLOGIA','MINAS SERVIÇOS','NOVA ROTA COMÉRCIO','VALE ATENDIMENTO','OFICINA DO FUTURO'];
    const companies = names.map((name,i) => ({id:'empresa-exemplo-'+i,nome_fantasia:name,nome:name,cnpj:'0000000000000'+i,email:'empresa'+i+'@example.com',cidade:['Belo Horizonte','Contagem','Betim'][i%3],uf:'MG',telefone:'Exemplo',plano_id:['trimestral','anual','mensal','semestral','basico','basico'][i],plano_inicio:time(-12),plano_valido_ate:time(i===4?-1:75),verificada:i<2,verificacao_status:i<2?'verificada':i<4?'em_analise':'nao_verificada',suspensa_admin:i===5,criado_em:time(-20-i)}));
    const jobs = Array.from({length:18},(_,i) => ({id:'vaga-exemplo-'+i,cargo:['ASSISTENTE ADMINISTRATIVO','AUXILIAR DE LOGÍSTICA','DESENVOLVEDOR FRONT-END','ATENDENTE','ANALISTA FINANCEIRO','OPERADOR DE PRODUÇÃO'][i%6],empresa:companies[i%6].nome_fantasia,empresa_id:companies[i%6].id,cidade:companies[i%6].cidade,estado:'MG',contrato:'Efetivo',modalidade:i%4===0?'Híbrido':'Presencial',status:i<3?'pendente':i===3?'suspensa':'aprovada',criado_em:time(-i),data_encerramento:time(45-i).slice(0,10),salario:[2100,1850,4200,1750,3100,1950][i%6],destaque:i%5===0,urgente:i===1,confidencial:false,descricao:'Vaga de exemplo para testar o painel administrativo. Este registro não é uma oportunidade real.',requisitos:'Organização, boa comunicação e experiência na área.',beneficios:'Vale-transporte e vale-alimentação.'}));
    const candidates = ['Ana Exemplo','João Exemplo','Marina Exemplo','Carlos Exemplo','Júlia Exemplo','Paulo Exemplo','Lívia Exemplo','Rafael Exemplo'].map((nome,i)=>({id:'candidato-exemplo-'+i,nome,email:'candidato'+i+'@example.com',cidade:['Belo Horizonte','Contagem','Betim'][i%3],telefone:'Exemplo',premium:i<2,premium_valido_ate:i<2?time(25):null,criado_em:time(-i-1)}));
    const applications = candidates.map((c,i)=>({id:'candidatura-exemplo-'+i,vaga_id:jobs[i].id,candidato_nome:c.nome,candidato_email:c.email,status:['Aguardando análise','Em entrevista','Contratado','Reprovado'][i%4],aderencia:70+i*3,criado_em:time(-i)}));
    const verifications = companies.slice(2,4).map((e,i)=>({verificacao_id:'verificacao-exemplo-'+i,empresa_id:e.id,nome_fantasia:e.nome_fantasia,cnpj:e.cnpj,status:'em_analise',enviada_em:time(-2),comprovacao:'Documento de exemplo. Nenhum arquivo real está anexado.',observacao_empresa:'Solicitação para testar a análise administrativa.'}));
    const subscriptions = companies.slice(0,2).map((e,i)=>({assinatura_id:'assinatura-exemplo-'+i,empresa_id:e.id,nome_fantasia:e.nome_fantasia,plano_id:e.plano_id,valor_pago:i?399.9:129.9,status:'ativa',inicio_em:time(-12),termina_em:time(75),origem:'Exemplo',forma_pagamento:'Pix'}));
    const reports = [{id:'denuncia-exemplo-0',vaga_id:jobs[7].id,motivo:'Vaga duplicada',detalhes:'Registro de exemplo para testar a moderação.',status:'pendente',criado_em:time(-1)},{id:'denuncia-exemplo-1',vaga_id:jobs[8].id,motivo:'Informações falsas ou enganosas',detalhes:'Relato fictício. Sem denúncia real.',status:'pendente',criado_em:time(-2)}];
    const history = [{id:'historico-exemplo-0',acao:'Prévia criada',detalhe:'Registros de exemplo disponíveis para testar as telas.',criado_em:time(0)}];
    return {version:1,companies,jobs,candidates,applications,verifications,subscriptions,reports,history};
  }
  function validDemo(data) { return data?.version === 1 && ['companies','jobs','candidates','applications','verifications','subscriptions','reports','history'].every(k => Array.isArray(data[k]) && data[k].length <= 5000 && data[k].every(r => r && typeof r === 'object' && !Array.isArray(r))); }
  function applyDemo(data, change, now = Date.now()) {
    if (!validDemo(data)) throw Error('Dados da prévia inválidos.');
    const copy = JSON.parse(JSON.stringify(data));
    const {kind,id,action,reason = '',plan = 'basico',days = 30} = change;
    const row = copy[kind]?.find(r => rowId(r) === String(id));
    if (!row) throw Error('Registro não encontrado.');
    const at = new Date(now).toISOString();
    const end = new Date(now + days * 86400000).toISOString();
    if (['reject','rejectVerification'].includes(action) && !reason.trim()) throw Error('Informe o motivo da decisão.');
    if (['grantPlan','premium'].includes(action) && (!Number.isInteger(days) || days < 1 || days > 730)) throw Error('Informe uma duração entre 1 e 730 dias.');
    if (kind === 'jobs' && ['approve','reject','pause','resume'].includes(action)) {
      if (['approve','resume'].includes(action) && row.data_encerramento && Date.parse(row.data_encerramento + 'T23:59:59-03:00') <= now) throw Error('Esta vaga já encerrou o prazo.');
      row.status = {approve:'aprovada',reject:'reprovada',pause:'suspensa',resume:'aprovada'}[action];
      row.motivo_reprovacao = action === 'reject' ? reason.trim() : null;
    } else if (kind === 'companies' && ['suspend','restore'].includes(action)) {
      row.suspensa_admin = action === 'suspend';
    } else if (kind === 'companies' && action === 'grantPlan') {
      if (!['basico','mensal','trimestral','semestral','anual'].includes(plan)) throw Error('Plano inválido.');
      Object.assign(row,{plano_id:plan,plano_inicio:at,plano_valido_ate:end});
      copy.subscriptions = copy.subscriptions.filter(s => s.empresa_id !== row.id);
      if (plan !== 'basico') copy.subscriptions.unshift({assinatura_id:'cortesia-'+now,empresa_id:row.id,nome_fantasia:row.nome_fantasia,plano_id:plan,valor_pago:0,status:'ativa',inicio_em:at,termina_em:end,origem:'cortesia_admin'});
    } else if (kind === 'candidates' && ['premium','removePremium'].includes(action)) {
      row.premium = action === 'premium'; row.premium_valido_ate = action === 'premium' ? end : null;
    } else if (kind === 'verifications' && ['approveVerification','rejectVerification'].includes(action)) {
      if (row.status !== 'em_analise') throw Error('Esta solicitação já foi analisada.');
      const company = copy.companies.find(e => e.id === row.empresa_id);
      const approved = action === 'approveVerification';
      for (const v of copy.verifications.filter(v => v.empresa_id === row.empresa_id && (approved ? v.status === 'em_analise' : rowId(v) === rowId(row)))) Object.assign(v,{status:approved?'verificada':'rejeitada',motivo_admin:approved?null:reason.trim(),analisada_em:at});
      if (company) Object.assign(company,{verificada:approved,verificacao_status:approved?'verificada':'rejeitada'});
    } else if (kind === 'reports' && ['resolve','discard','suspendJob'].includes(action)) {
      if (row.status !== 'pendente') throw Error('Esta denúncia já foi analisada.');
      if (action === 'suspendJob') { const job = copy.jobs.find(v => v.id === row.vaga_id); if (!job) throw Error('Vaga não encontrada.'); job.status='suspensa'; }
      Object.assign(row,{status:action==='discard'?'descartada':'resolvida',acao:action,resolvida_em:at});
    } else throw Error('Ação inválida para este registro.');
    copy.history.unshift({id:'historico-'+now+'-'+copy.history.length,acao:action,detalhe:kind+' · '+id+(reason?' · '+reason:''),criado_em:at});
    return copy;
  }
  const api = {normalize,escape,filter,csv,safeUrl,date,planActive,rowId,demoSeed,validDemo,applyDemo};
  root.EMAdminCore = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window === 'object' ? window : globalThis);
