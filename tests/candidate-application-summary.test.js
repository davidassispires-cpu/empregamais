const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function controller(search = '') {
 const context = {window:{},document:{readyState:'loading',addEventListener(){}},location:{search},sessionStorage:{getItem(){return 'ana@example.com';}},URLSearchParams,URL};
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../processo-seletivo-etapas.js'),'utf8'),context);
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../candidato-candidaturas.js'),'utf8'),context);
 return context.window.EmpregaMaisCandidaturasCandidato;
}

test('normalizes application stages and keeps rejection separate from selection', () => {
 const api=controller();
 assert.equal(api.classificar({}),'avaliacao');
 for(const [status,stage] of [['Em análise','avaliacao'],['Em avaliação','avaliacao'],['Candidatura enviada','avaliacao'],['Currículo recebido','avaliacao'],['Selecionada','aprovadas'],['Pré-selecionado','aprovadas'],['Finalista','aprovadas'],['Etapa final','aprovadas'],['Não selecionado','reprovadas'],['Não aprovado','reprovadas'],['Reprovado','reprovadas'],['Contratado','contratadas'],['Entrevista agendada','entrevista'],['Em contato','contato'],['Aguardando análise','avaliacao']]) {
  assert.equal(api.classificar({status}),stage,status);
 }
});

test('uses only the signed-in candidate records', () => {
 const api=controller();
 assert.equal(api.pertence({email:' ANA@example.com '}),true);
 assert.equal(api.pertence({candidatoEmail:'ana@example.com'}),true);
 assert.equal(api.pertence({email:'outra@example.com'}),false);
 assert.equal(api.pertence({}),false);
});

test('shows calendar dates without timestamp fragments in application cards',()=>{
 const api=controller();
 assert.equal(api.data('2026-10-14'),'14/10/2026');
 assert.match(api.data('2026-10-14T12:32:43.733Z'),/^\d{2}\/\d{2}\/\d{4}$/);
 assert.equal(api.data('invalid'),'Data não informada');
});

test('summary totals correspond to the rows shown by each filter', () => {
 const api=controller();
 const mine=[{status:'Em avaliação'},{status:'Selecionado'},{status:'Finalista'},{status:'Não selecionado'},{status:'Entrevista agendada'}];
 const totals=api.contar(mine);
 assert.deepEqual(JSON.parse(JSON.stringify(totals)),{todas:5,avaliacao:1,contato:0,entrevista:1,aprovadas:2,contratadas:0,reprovadas:1});
 for(const key of ['todas','avaliacao','contato','entrevista','aprovadas','contratadas','reprovadas'])assert.equal(mine.filter(item=>api.corresponde(item,key)).length,totals[key]);
});

test('supports direct filter URLs, empty stages and unknown filter values', () => {
 const selected=controller('?pagina=candidaturas&etapaCandidatura=selecionadas');
 assert.equal(selected.filtroAtual(),'aprovadas');
 assert.equal(selected.corresponde({status:'Selecionado'}),true);
 assert.equal(selected.corresponde({status:'Não selecionado'}),false);
 assert.match(selected.mensagemVazia(),/nesta etapa/);
 const invalid=controller('?etapaCandidatura=desconhecida');
 assert.equal(invalid.filtroAtual(),'todas');
 assert.equal(invalid.corresponde({status:'Entrevista agendada'}),true);
});

test('keeps the legacy Premium section hidden for Basic accounts and available for Premium', () => {
 const source=fs.readFileSync(path.join(__dirname,'../empregamais_lote8.js'),'utf8');
 const anchor=source.indexOf('window.EmpregaMaisCentralPremiumV93=');
 const start=source.lastIndexOf('(function(){',anchor);
 const end=source.indexOf('})();',anchor)+5;
 const box={innerHTML:'',hidden:false};
 let premium=false;
 const context={window:{EmpregaMaisPremiumCandidatoV92:{ehPremium(){return premium;}},addEventListener(){}},document:{getElementById(){return box;},addEventListener(){}},sessionStorage:{getItem(){return 'ana@example.com';}},localStorage:{getItem(){return '[]';}},setTimeout(){}};
 vm.runInNewContext(source.slice(start,end),context);
 context.window.EmpregaMaisCentralPremiumV93.atualizar();
 assert.equal(box.hidden,true);
 assert.equal(box.innerHTML,'');
 premium=true;
 context.window.EmpregaMaisCentralPremiumV93.atualizar();
 assert.equal(box.hidden,false);
 assert.match(box.innerHTML,/PREMIUM ATIVO/);
});


test('candidate process details escape content and exclude internal notes',()=>{
 const api=controller();
 const html=api.detalhesPublicos({status:'Em contato',empresa:'<script>alert(1)</script>',data:'2026-10-14',anotacoes:'PRIVATE_RECRUITER_NOTE',historico:[{nota:'PRIVATE_HISTORY'}]});
 assert.match(html,/&lt;script&gt;/);
 assert.doesNotMatch(html,/<script>|PRIVATE_RECRUITER_NOTE|PRIVATE_HISTORY/);
 assert.match(html,/Sem confirmação desta etapa/);
 assert.match(html,/data da mudança de etapa ainda não foi disponibilizada/);
});
test('rejected applications show an explicit ending without marking future stages complete',()=>{
 const html=controller().detalhesPublicos({status:'Reprovado',data:'2026-10-14',statusAtualizadoEm:'2026-10-15'});
 assert.match(html,/Processo encerrado para esta candidatura/);
 assert.match(html,/15\/10\/2026/);
 assert.doesNotMatch(html,/class="is-current"/);
});

test('view receipt is shown only for actual recorded views and keeps the timestamp',()=>{
 const api=controller();
 assert.equal(api.avisoVisualizacao({status:'Em avaliação'}),'');
 assert.equal(api.avisoVisualizacao({visualizada:false}),'');
 const html=api.avisoVisualizacao({visualizadoEm:'2026-10-14T11:15:00Z'});
 assert.match(html,/Candidatura visualizada/);
 assert.match(html,/14\/10\/2026/);
 assert.match(api.avisoVisualizacao({visualizada:true}),/Vista pela empresa/);
 assert.doesNotMatch(api.avisoVisualizacao({visualizada:true}),/Invalid Date/);
});
