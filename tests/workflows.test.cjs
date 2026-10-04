const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
function setup(options={}){
 const input={value:'Mensagem real',dataset:{}};let toast='';
 const c={console,Map,Date,Number,String,Promise,URL,planoEmpresaAtual:()=>({nome:'Mensal'}),usoPlanoEmpresa(){},saldoPlano(){},empresaLogada:()=>options.company||{},vagasDaEmpresa:()=>[],PLANOS_EMPRESA:{basico:{nome:'Grátis',vagas:3,destaques:0,urgentes:0,confidenciais:0}},window:{},document:{addEventListener(){},querySelector(){return null},querySelectorAll(){return[]},getElementById(id){return id.startsWith('chatTextoEM_')?input:null}},sessionStorage:{getItem(){return null}},EMPREGAMAIS_SUPABASE_URL:'https://example.test',sbHeadersEM:()=>({}),sbGarantirSessaoEM:async()=> 'valid',sbBuscarMinhaEmpresaEM:async()=>({id:'company'}),sbVagasCacheEM:[{id:'deleted',empresaId:'company'},{id:'other',empresaId:'other'}],sbMapVagaEM:r=>r,sbJsonEM:options.request||(async()=>[]),gravar(){},sbAtualizarCandidaturaEM(){},sbCarregarVagasEmpresaAtualEM(){},sbCarregarCandidaturasEM(){},enviarMensagemCandidaturaEM(){},prepararPublicacao(){},sbDadosVagaAtualEM:async()=>options.publication||{},criarPedidoPlanoCheckout(){},continuarPagamentoPlano(){},assinarPremiumCandidatoEM(){},selecionarPlano(){},abrirCheckoutPlano(){},papelAtual:()=> 'candidato',mostrarToast:m=>{toast=m},irPara(){},nums:x=>String(x||'').replace(/\D/g,''),valorSalario:x=>Number(x)||0};vm.createContext(c);vm.runInContext(fs.readFileSync('novo/assets/js/portal-workflows.js','utf8'),c);return {c,input,toast:()=>toast};
}
test('company catalog queries the company id and replaces removed jobs',async()=>{const urls=[];const {c}=setup({request:async url=>{urls.push(url);return[{id:'live',empresaId:'company'}]}});const rows=await c.sbCarregarVagasEmpresaAtualEM();assert.equal(rows.length,1);assert.match(urls[0],/empresa_id=eq.company/);assert.equal(c.sbVagasCacheEM.some(v=>v.id==='deleted'),false);assert.equal(c.sbVagasCacheEM.some(v=>v.id==='other'),true);});
test('failed message submission keeps the draft and does not announce success',async()=>{const {c,input,toast}=setup({request:async()=>{throw Error('offline')}});await c.enviarMensagemCandidaturaEM('application');assert.equal(input.value,'Mensagem real');assert.match(toast(),/Não foi possível enviar/);assert.equal(input.dataset.sending,undefined);});
test('publication rejects dangerous external schemes and invalid salary ranges',async()=>{const a=setup({publication:{cargo:'Analista',descricao:'Atividades',requisitos:'Experiência',candidaturaTipo:'externo',candidaturaLink:'javascript:alert(1)'}});await assert.rejects(a.c.sbDadosVagaAtualEM(),/Link de candidatura inválido/);const b=setup({publication:{cargo:'Analista',descricao:'Atividades',requisitos:'Experiência',candidaturaTipo:'portal',salario:'5000',salarioMax:'2000'}});await assert.rejects(b.c.sbDadosVagaAtualEM(),/salário máximo/);});

test("expired paid plans use free limits",()=>{const {c}=setup({company:{planoValidoAte:"2020-01-01"}});assert.equal(c.planoEmpresaAtual().nome,"Grátis");assert.equal(c.saldoPlano().vagas,3);});

function reportSetup(request){
 const {c}=setup({request});let message='',closed=false;const button={disabled:false},form={dataset:{},querySelector:()=>button};
 const fields={formDenuncia:form,denunciaMotivo:{value:'Outro motivo'},denunciaDetalhes:{value:'Descrição da ocorrência'}};
 c.document.getElementById=id=>fields[id]||null;c.vagaAtual=()=>({id:'job'});c.msg=(id,text)=>{message=text};c.fecharDenuncia=()=>{closed=true};c.setTimeout=fn=>fn();
 return {c,form,button,message:()=>message,closed:()=>closed};
}
test('report failure preserves the form without a success message or closing it',async()=>{const a=reportSetup(async()=>{throw Error('offline')});await a.c.enviarDenuncia({preventDefault(){}});assert.match(a.message(),/Não foi possível enviar/);assert.equal(a.closed(),false);assert.equal(a.button.disabled,false);});
test('report waits for server acknowledgement and blocks concurrent submissions',async()=>{let finish,calls=0;const a=reportSetup(async()=>{calls++;return new Promise(resolve=>{finish=resolve})});const pending=a.c.enviarDenuncia({preventDefault(){}});await Promise.resolve();assert.equal(a.message(),'');assert.equal(a.button.disabled,true);await a.c.enviarDenuncia({preventDefault(){}});assert.equal(calls,1);finish(null);await pending;assert.match(a.message(),/recebida/);assert.equal(a.closed(),true);assert.equal(a.form.dataset.sending,undefined);});

test('changing an application stage preserves the loaded conversation',async()=>{
 const {c}=setup();let rows=[{id:'application',status:'Em avaliação',mensagens:[{id:'message',texto:'Conversa existente'}]}];
 // Reload the module after installing the original server-backed updater.
 c.candidaturas=()=>rows;c.sbEspelharCandidaturasEM=value=>{rows=value};
 c.sbAtualizarCandidaturaEM=async()=>{const updated={id:'application',status:'Entrevista'};rows=[updated];return updated};
 vm.runInContext(fs.readFileSync('novo/assets/js/portal-workflows.js','utf8'),c);
 const updated=await c.sbAtualizarCandidaturaEM(rows[0],{status:'Entrevista'});
 assert.equal(updated.status,'Entrevista');assert.equal(rows[0].mensagens[0].texto,'Conversa existente');
});

test('a visible application refresh renders even while a silent refresh is running',async()=>{
 let finish,calls=0,rendered=0;const gate=new Promise(resolve=>{finish=resolve});
 const {c}=setup({request:async()=>{calls++;await gate;return[]}});
 c.sbEspelharCandidaturasEM=()=>{};c.renderizarCandidaturasCandidato=()=>{rendered++};c.atualizarPainelCandidato=()=>{};
 const silent=c.sbCarregarCandidaturasEM(false);const visible=c.sbCarregarCandidaturasEM(true);
 finish();await Promise.all([silent,visible]);assert.equal(calls,2);assert.equal(rendered,1);
});
