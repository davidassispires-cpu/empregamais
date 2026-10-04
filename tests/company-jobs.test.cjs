const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync('novo/assets/js/app.js','utf8');
const start=source.indexOf('async function confirmarEncerrarVagaEM('),end=source.indexOf('\nasync function alternarRecursoVagaEM',start);
test('a zero-row response cannot close a job locally or announce success',async()=>{
 const job={id:'real-job',status:'aprovada'},button={disabled:false};let alert='',closed=false,written=false;
 const c={console:{error(){}},Date,String,Object,Array,Error,URLSearchParams,location:{search:'?pagina=vagas-empresa'},vagasDaEmpresa:()=>[job],sbGarantirSessaoEM:async()=> 'valid',EMPREGAMAIS_SUPABASE_URL:'https://example.test',sbHeadersEM:()=>({}),sbJsonEM:async()=>[],ler:()=>[job],gravar(){written=true},sbVagasCacheEM:[job],fecharEncerrarVagaEM(){closed=true},sbCarregarVagasEM(){},renderizarPainelEmpresa(){},renderVagasEmpresaPaginaEM(){},document:{createElement(){throw Error('Success UI must not be created')}},alert:m=>{alert=m}};
 vm.createContext(c);vm.runInContext(source.slice(start,end),c);await c.confirmarEncerrarVagaEM(job.id,button);assert.equal(job.status,'aprovada');assert.equal(written,false);assert.equal(closed,false);assert.equal(button.disabled,false);assert.match(alert,/não confirmou/);
});
