const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
function setup(load){
 const requests=[],saved=new Map();const c={console,window:{},EMPREGAMAIS_SUPABASE_URL:'https://example.test',sbHeadersEM:()=>({}),sbCarregarCandidaturasEM:load,sessionStorage:{getItem:()=>null},gravar:(key,value)=>saved.set(key,value),sbJsonEM:async(url)=>{requests.push(url);if(url.endsWith('/rpc/is_admin'))return true;return[]}};
 for(const name of ['abrirRota','adminConcederPlano','adminConcederRecurso','adminAlternarEmpresa','adminHistoricoRegistrar','adminTabelaDenuncias','adminResolverDenuncia','adminSuspenderDenuncia','adminAba'])c[name]=()=>{};
 c.adminSbToken=async()=> 'token';c.adminSincronizarPainelSupabase=async()=>true;
 vm.createContext(c);vm.runInContext(fs.readFileSync('novo/assets/js/portal-admin.js','utf8'),c);return{c,requests,saved};
}
test('admin refresh delegates to the complete application and message loader',async()=>{
 let called=0,render=null,token=null;const a=setup(async(value,credential)=>{called++;render=value;token=credential;return[{id:'application',mensagens:[{texto:'Conversa'}]}]});
 assert.equal(await a.c.adminSincronizarPainelSupabase(),true);assert.equal(called,1);assert.equal(render,false);assert.equal(token,'token');
 assert.equal(a.requests.some(url=>url.includes('/candidaturas?')),false);assert.ok(a.saved.has('empregaMaisHistoricoAdmin'));
});
test('admin synchronization propagates application load failures',async()=>{
 const a=setup(async()=>{throw Error('offline')});await assert.rejects(a.c.adminSincronizarPainelSupabase(),/offline/);assert.equal(a.saved.has('empregaMaisHistoricoAdmin'),false);
});
