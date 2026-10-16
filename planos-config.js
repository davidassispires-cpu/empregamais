(function (root) {
  'use strict';
  var catalog = {
    basico: {id:'basico',nome:'Grátis',preco:0,meses:0,dias:30,vagas:3,destaques:0,urgentes:0,confidenciais:0,pago:false,logo:false,whatsapp:false,link:false},
    mensal: {id:'mensal',nome:'Mensal',preco:49.90,meses:1,dias:30,vagas:8,destaques:0,urgentes:0,confidenciais:0,pago:true,logo:true,whatsapp:true,link:true},
    trimestral: {id:'trimestral',nome:'Trimestral',preco:129.90,meses:3,dias:90,vagas:30,destaques:2,urgentes:2,confidenciais:1,pago:true,logo:true,whatsapp:true,link:true},
    semestral: {id:'semestral',nome:'Semestral',preco:239.90,meses:6,dias:180,vagas:70,destaques:4,urgentes:4,confidenciais:2,pago:true,logo:true,whatsapp:true,link:true},
    anual: {id:'anual',nome:'Anual',preco:399.90,meses:12,dias:365,vagas:150,destaques:6,urgentes:6,confidenciais:3,pago:true,logo:true,whatsapp:true,link:true}
  };
  var services = {
    destaque:{nome:'Destacar vaga',titulo:'Vaga em destaque',dias:15,preco:29.90,campo:'destaques'},
    urgente:{nome:'Marcar como urgente',titulo:'Vaga urgente',dias:7,preco:19.90,campo:'urgentes'},
    confidencial:{nome:'Tornar confidencial',titulo:'Vaga confidencial',dias:15,preco:17.90,campo:'confidenciais'}
  };
  function normalize(key) {
    key=String(key||'basico').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/^plano\s+/,'').trim();
    return ({essencial:'basico',gratis:'basico',gratuito:'basico',free:'basico',basic:'basico',profissional:'trimestral',premium:'anual'})[key]||key;
  }
  function get(key) { return catalog[normalize(key)]||catalog.basico; }
  function companyKey(e,now) {
    e=e||{};var key=normalize(e.plano_id||e.planoId||e.plano||e.plano_nome||e.planoNome);
    var end=Date.parse(e.plano_valido_ate||e.planoValidoAte||e.planoFim||e.planoTesteAte||'');
    if(e.suspensa_admin||/^(inativa|bloqueada|suspensa|cancelada)$/i.test(String(e.status||''))||Number.isFinite(end)&&end<=(now||Date.now()))return 'basico';
    return catalog[key]?key:'basico';
  }
  function money(n) {return Number(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
  function period(key) {var p=get(key);return p.meses?p.meses+' '+(p.meses===1?'mês':'meses'):'Sem mensalidade';}
  function quotaText(key) {var p=get(key);return p.vagas+' vagas '+(p.pago?'durante '+period(key):'por mês');}
  function configuration(key) {
    var p=get(key);return Object.assign({},p,{vagasMes:p.vagas,limiteVagas:p.vagas,vagasPeriodo:p.vagas,destaquesMes:p.destaques,limiteDestaques:p.destaques,urgentesMes:p.urgentes,confidenciaisMes:p.confidenciais,diasVaga:45,candidatura:p.pago?['portal','email','whatsapp','link']:['email']});
  }
  function addMonths(start,n) {
    var d=new Date(start),day=d.getUTCDate();if(!Number.isFinite(d.getTime()))return null;
    d.setUTCDate(1);d.setUTCMonth(d.getUTCMonth()+n);
    var last=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();d.setUTCDate(Math.min(day,last));return d;
  }
  function cycle(start,now) {
    var a=new Date(start),t=new Date(now==null?Date.now():now);if(!Number.isFinite(a.getTime()))a=new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth(),1));
    var n=Math.max(0,(t.getUTCFullYear()-a.getUTCFullYear())*12+t.getUTCMonth()-a.getUTCMonth());
    if(addMonths(a,n)>t)n=Math.max(0,n-1);
    return {inicio:addMonths(a,n).toISOString(),fim:addMonths(a,n+1).toISOString()};
  }
  function publicationStart(e,now) {
    var p=get(companyKey(e,now)),t=new Date(now==null?Date.now():now);
    return p.pago?(e.plano_inicio||e.planoInicio||e.planoLiberadoEm||e.plano_liberado_em||e.criado_em||e.criadoEm||new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth(),1)).toISOString()):new Date(t.getFullYear(),t.getMonth(),1).toISOString();
  }
  function owns(e,v) {
    var eid=e.id||e.empresa_id||e.empresaId,vid=v.empresa_id||v.empresaId;
    if(eid&&vid)return String(eid)===String(vid);
    var c=String(e.cnpj||'').replace(/\D/g,''),vc=String(v.empresaCnpj||v.empresa_cnpj||v.cnpj||'').replace(/\D/g,'');
    return !!c&&!!vc&&c===vc;
  }
  function publicationCount(e,jobs,now) {
    var start=Date.parse(publicationStart(e,now));return (jobs||[]).filter(function(v){var raw=v.criado_em||v.criadoEm||v.dataCriacao||v.dataPublicacao||v.created_at||v.data;var t=Date.parse(raw||'');return owns(e,v)&&Number.isFinite(t)&&t>=start;}).length;
  }
  function serviceActive(job,key,now) {
    var flag=key==='urgente'?(job.urgente||job.contratacaoUrgente):job[key];var on=flag===true||flag===1||flag==='true'||flag==='1';
    var end=job[key+'_ate']||job[key+'Ate'];return on&&(!end||Date.parse(end)>(now||Date.now()));
  }
  var balance=null,pending=null,lastToken='',lastAt=0;
  async function rpc(name,payload) {
    var token=root.sessionStorage&&root.sessionStorage.getItem('empregaMaisSupabaseAccessToken');
    if(!token)throw Error('Entre na conta da empresa para confirmar esta contratação.');
    var response=await root.fetch('https://mkezlcewyengejdmtppl.supabase.co/rest/v1/rpc/'+name,{method:'POST',headers:{'Content-Type':'application/json',apikey:'sb_publishable_8YnXpzGX8zj-tvzvcMYdyw_FVBhQutR',Authorization:'Bearer '+token},body:JSON.stringify(payload||{}),signal:AbortSignal.timeout(20000)});
    var data=await response.json();if(!response.ok)throw Error(data.message||'Não foi possível consultar o saldo da empresa.');return data;
  }
  async function refreshBalance(force) {
    var token=root.sessionStorage&&root.sessionStorage.getItem('empregaMaisSupabaseAccessToken');if(!token){balance=null;lastToken='';return null;}
    if(token!==lastToken){balance=null;lastAt=0;lastToken=token;}
    if(!force&&balance&&Date.now()-lastAt<30000)return balance;if(pending)return pending;
    pending=rpc('em_plan_balance').then(function(data){balance=data;lastAt=Date.now();if(root.document)root.document.dispatchEvent(new CustomEvent('empregamais:saldo-plano',{detail:data}));return data;}).finally(function(){pending=null;});return pending;
  }
  function cachedBalance(e) {
    if(!balance)return null;var eid=e&&(e.id||e.empresa_id||e.empresaId);if(eid&&String(eid)!==String(balance.empresa_id))return null;return balance;
  }
  function available(e,key) {var p=get(companyKey(e)),b=cachedBalance(e);if(!p[services[key].campo])return 0;return b&&b.servicos&&b.servicos[key]?b.servicos[key].disponiveis:null;}
  function resources(key,previous) {
    var p=get(key),list=(previous||[]).filter(function(x){return !/Destaque|Urgente|Urgência|Confidencial/i.test(x[1]);});
    Object.keys(services).forEach(function(k){var s=services[k],n=p[s.campo];list.push([n?'especial':'avulso',n?n+' '+({destaque:n===1?'vaga em destaque':'vagas em destaque',urgente:n===1?'vaga urgente':'vagas urgentes',confidencial:n===1?'vaga confidencial':'vagas confidenciais'})[k]+' por mês — '+s.dias+' dias':s.titulo+' — '+money(s.preco)+' por ativação']);});return list;
  }
  function basicTable(adapter) {var out={};Object.keys(catalog).forEach(function(k){out[k]=adapter(catalog[k],k);});return out;}
  var api={catalog:catalog,services:services,normalize:normalize,get:get,companyKey:companyKey,money:money,period:period,quotaText:quotaText,configuration:configuration,addMonths:addMonths,cycle:cycle,publicationStart:publicationStart,publicationCount:publicationCount,owns:owns,serviceActive:serviceActive,resources:resources,table:basicTable,rpc:rpc,refreshBalance:refreshBalance,cachedBalance:cachedBalance,available:available,requestService:function(id,key){return rpc('solicitar_servico_vaga',{p_vaga_id:id,p_servico:key});}};
  root.EMPlanos=api;if(typeof module==='object'&&module.exports)module.exports=api;
  if(root.document){root.document.addEventListener('empregamais:empresa-sincronizada',function(){refreshBalance(true).catch(function(){});});root.document.addEventListener('DOMContentLoaded',function(){refreshBalance().catch(function(){});});}
})(typeof window==='object'?window:globalThis);
