const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function setup(options={}){
 const storage=new Map();let toast='';
 const c={console,Date,Number,String,Promise,Object,window:{},document:{getElementById:()=>null,createElement(){}},EMPREGAMAIS_SUPABASE_URL:'https://example.test',sbHeadersEM:()=>({}),sbGarantirSessaoEM:async()=>options.token===null?null:'valid',sbJsonEM:options.request||async function(){return[]},ler:key=>storage.get(key)||[],gravar:(k,v)=>storage.set(k,v),esc:x=>String(x||''),tituloVaga:v=>v.cargo||'Vaga',vagasDaEmpresa:()=>options.jobs||[],planoEmpresaAtual:()=>({nome:'Grátis'}),saldoPlano:()=>options.balance||{destaques:0,urgentes:0},mostrarToast:m=>{toast=m},sbVagaPayloadEM:(d,id)=>({destaque:!!d.destaque,urgente:!!d.urgente,destaque_solicitado:false,urgencia_solicitada:false}),abrirConfirmacaoVagaAnaliseEM(){},renderVagasEmpresaPaginaEM(){},adminSincronizarPainelSupabase(){},adminSbToken:async()=> 'admin',adminAba(){},adminAtivarExtra(){},adminRejeitarExtra(){},adminTabelaExtras(){},confirm:()=>true};
 vm.createContext(c);vm.runInContext(fs.readFileSync('novo/assets/js/portal-extras.js','utf8'),c);return{c,storage,toast:()=>toast};
}
test('free-plan paid extras remain requests and preserve included credits',()=>{
 const a=setup();const p=a.c.sbVagaPayloadEM({destaque:true,urgente:true},null);assert.equal(p.destaque,false);assert.equal(p.urgente,false);assert.equal(p.destaque_solicitado,true);assert.equal(p.urgencia_solicitada,true);
 const b=setup({balance:{destaques:1,urgentes:1}});const included=b.c.sbVagaPayloadEM({destaque:true,urgente:true},null);assert.equal(included.destaque,true);assert.equal(included.urgente,true);assert.equal(included.destaque_solicitado,false);assert.equal(included.urgencia_solicitada,false);
});
test('failed or unconfirmed extra requests never announce success',async()=>{
 for(const request of [async()=>{throw Error('offline')},async()=>[]]){const a=setup({request});const button={disabled:false,isConnected:true};await a.c.window.solicitarExtraVagaPortalEM('job','destaque',button);assert.doesNotMatch(a.toast(),/^Solicitação registrada/);assert.equal(button.disabled,false);}
});
test('an extra request sends only job and type; its price comes from the server',async()=>{
 const calls=[];const a=setup({request:async(url,opt)=>{calls.push({url,opt});return[{id:'real',vaga_id:'job',tipo:'destaque',valor:19.90,status:'aguardando_pagamento'}]}});
 await a.c.window.solicitarExtraVagaPortalEM('job','destaque',{disabled:false,isConnected:true});assert.deepEqual(JSON.parse(calls[0].opt.body),{vaga_id:'job',tipo:'destaque'});assert.match(a.toast(),/^Solicitação registrada/);assert.equal(a.storage.get('empregaMaisExtras')[0].valor,19.90);
});
test('expired session cannot create an extra request',async()=>{let calls=0;const a=setup({token:null,request:async()=>{calls++;return[]}});await a.c.window.solicitarExtraVagaPortalEM('job','urgencia',{disabled:false,isConnected:true});assert.equal(calls,0);assert.match(a.toast(),/sessão expirou/);});
