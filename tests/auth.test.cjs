const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');

function setup(fetch) {
  function storage() {
    const data = new Map();
    return {getItem:k=>data.get(k) ?? null,setItem:(k,v)=>data.set(k,String(v)),removeItem:k=>data.delete(k)};
  }
  const context = {fetch,console,URLSearchParams,Set,Promise,setTimeout,clearTimeout,sessionStorage:storage(),localStorage:storage(),location:{origin:'https://example.test',pathname:'/novo/',search:'',hash:''},history:{replaceState(){}},document:{getElementById(){return null;},addEventListener(){}},sbCandidaturasCacheEM:[],sbCandidaturasCarregadasEM:false,EMPREGAMAIS_SUPABASE_URL:'https://example.test',EMPREGAMAIS_SB_ADMIN_TOKEN:'adminToken',EMPREGAMAIS_SB_REFRESH:'empregaMaisSupabaseRefreshToken',EMPREGAMAIS_SB_TOKEN:'empregaMaisSupabaseAccessToken'};
  context.window=context;context.addEventListener=()=>{};
  for(const name of ['sbLoginAuthEmpresaEM','sbGarantirSessaoEM','sbJsonEM','sbBuscarMinhaEmpresaEM','loginEmpresa','loginCandidato','cadastrarEmpresa','cadastrarCandidato','sair','atualizarHeaderContextualEM','garantirLoginCandidatoEM'])context[name]=()=>{};
  context.routes=[];context.abrirRota=route=>context.routes.push(route);context.irPara=route=>context.abrirRota(route);
  context.sbTokenEM=()=>context.sessionStorage.getItem(context.EMPREGAMAIS_SB_TOKEN)||context.localStorage.getItem(context.EMPREGAMAIS_SB_TOKEN)||'';
  context.sbRefreshTokenEM=()=>context.sessionStorage.getItem(context.EMPREGAMAIS_SB_REFRESH)||context.localStorage.getItem(context.EMPREGAMAIS_SB_REFRESH)||'';
  context.sbHeadersEM=token=>({apikey:'publishable',...(token?{Authorization:'Bearer '+token}:{})});
  context.sbSalvarSessaoEM=auth=>{context.localStorage.setItem(context.EMPREGAMAIS_SB_TOKEN,auth.access_token);context.localStorage.setItem(context.EMPREGAMAIS_SB_REFRESH,auth.refresh_token);};
  context.ler=(key,defaultValue=[])=>JSON.parse(context.localStorage.getItem(key)||JSON.stringify(defaultValue));
  context.gravar=(key,value)=>context.localStorage.setItem(key,JSON.stringify(value));
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('novo/assets/js/portal-auth.js','utf8'),context);
  return context;
}
const response=(status,data)=>({ok:status<400,status,text:async()=>JSON.stringify(data)});

test('private routes require a server session, even with a forged local role',async()=>{
  const c=setup(async()=>{throw Error('No request expected');});
  c.sessionStorage.setItem('empregaMaisPapel','empresa');
  await c.abrirRota('vagas-empresa');
  assert.deepEqual(c.routes,['login-empresa']);
});
test('concurrent checks refresh an expired token only once',async()=>{
  let refreshes=0,checks=0;
  const c=setup(async url=>{
    if(url.includes('/user')) {checks++;return response(401,{message:'expired'});}
    refreshes++;return response(200,{user:{id:'test-user'},access_token:'new',refresh_token:'refresh-new'});
  });
  c.localStorage.setItem(c.EMPREGAMAIS_SB_TOKEN,'expired');c.localStorage.setItem(c.EMPREGAMAIS_SB_REFRESH,'refresh-old');
  assert.deepEqual(await Promise.all([c.sbGarantirSessaoEM(),c.sbGarantirSessaoEM()]),['new','new']);
  assert.equal(refreshes,1);assert.equal(checks,1);
});
test('a network failure preserves credentials for retry',async()=>{
  const c=setup(async()=>{throw Error('Network unavailable');});
  c.localStorage.setItem(c.EMPREGAMAIS_SB_TOKEN,'existing');
  await assert.rejects(c.sbGarantirSessaoEM(),/Network unavailable/);
  assert.equal(c.localStorage.getItem(c.EMPREGAMAIS_SB_TOKEN),'existing');
});
test('logout clears both token stores and revokes the remote session without removing CVs',async()=>{
  const requests=[];const c=setup(async url=>{requests.push(url);return response(200,{});});
  c.localStorage.setItem(c.EMPREGAMAIS_SB_TOKEN,'local');c.sessionStorage.setItem(c.EMPREGAMAIS_SB_TOKEN,'session');
  c.localStorage.setItem(c.EMPREGAMAIS_SB_REFRESH,'refresh');c.localStorage.setItem('empregaMaisCurriculoOnline_test','{"nome":"Preserved"}');
  await c.sair();
  assert.equal(c.localStorage.getItem(c.EMPREGAMAIS_SB_TOKEN),null);
  assert.equal(c.sessionStorage.getItem(c.EMPREGAMAIS_SB_TOKEN),null);
  assert.equal(c.localStorage.getItem(c.EMPREGAMAIS_SB_REFRESH),null);
  assert.ok(c.localStorage.getItem('empregaMaisCurriculoOnline_test'));
  assert.ok(requests.some(url=>url.endsWith('/logout?scope=global')));
});

 test('CNPJ login requires an authenticated session before saving credentials',async()=>{
  const c=setup(async()=>response(200,{}));
  let request;
  c.sbJsonEM=async(url,options)=>{request={url,body:JSON.parse(options.body)};return {email:'must-not-be-trusted'};};
  await assert.rejects(c.sbLoginAuthEmpresaEM('12.345.678/0001-90','example-password'),/Credenciais inválidas/);
  assert.equal(request.url,'https://example.test/functions/v1/auth-empresa-cnpj');
  assert.equal(request.body.cnpj,'12345678000190');
  assert.equal(c.localStorage.getItem(c.EMPREGAMAIS_SB_TOKEN),null);
  c.sbJsonEM=async()=>({access_token:'verified',refresh_token:'refresh',user:{id:'owner'}});
  const auth=await c.sbLoginAuthEmpresaEM('12345678000190','example-password');
  assert.equal(auth.user.id,'owner');
  assert.equal(c.localStorage.getItem(c.EMPREGAMAIS_SB_TOKEN),'verified');
 });

test('logout during user validation cannot restore the former identity',async()=>{
 let finish;const c=setup(async url=>url.includes('/user')?new Promise(resolve=>{finish=resolve}):response(200,{}));
 c.localStorage.setItem(c.EMPREGAMAIS_SB_TOKEN,'existing');const pending=c.sbGarantirSessaoEM();await c.sair();
 finish(response(200,{id:'former-user'}));assert.equal(await pending,'');assert.equal(c.sbTokenEM(),'');
});
test('logout during token renewal cannot save the late refreshed credentials',async()=>{
 let finish;const c=setup(async url=>url.includes('/token?')?new Promise(resolve=>{finish=resolve}):response(200,{}));
 c.localStorage.setItem(c.EMPREGAMAIS_SB_REFRESH,'refresh-old');const pending=c.sbGarantirSessaoEM();await c.sair();
 finish(response(200,{user:{id:'former-user'},access_token:'late-token',refresh_token:'late-refresh'}));
 assert.equal(await pending,'');assert.equal(c.sbTokenEM(),'');assert.equal(c.sbRefreshTokenEM(),'');
});

test('a company lookup finishing after logout cannot restore its private route or role',async()=>{
 let finish,started;const ready=new Promise(resolve=>{started=resolve});
 const c=setup(async url=>{if(url.includes('/empresas?')){started();return new Promise(resolve=>{finish=resolve})}return response(200,{id:'owner'})});
 c.localStorage.setItem(c.EMPREGAMAIS_SB_TOKEN,'existing');const pending=c.abrirRota('vagas-empresa');await ready;await c.sair();
 finish(response(200,[{id:'company',user_id:'owner'}]));await pending;
 assert.equal(c.sessionStorage.getItem('empregaMaisPapel'),null);assert.equal(c.localStorage.getItem('empregaMaisPapelPersistido'),null);assert.deepEqual(c.routes,['home']);
});
