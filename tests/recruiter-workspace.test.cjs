const {test}=require('node:test');const assert=require('node:assert/strict');const core=require('../recruiter-workspace.js');
test('operational metrics use only applications and interviews belonging to the company jobs',()=>{
 const jobs=[{id:'own'}],apps=[{id:'a',vagaId:'own',status:'Em avaliação'},{id:'b',vagaId:'own',status:'Reprovado'},{id:'c',vagaId:'other',status:'Contratado'}];
 const now=Date.parse('2026-10-18T12:00Z'),rows=[{job_ref:'own',scheduled_at:'2026-10-18T13:00Z',state:'invited'},{job_ref:'own',scheduled_at:'2026-10-18T13:00Z',state:'cancelled'},{job_ref:'own',scheduled_at:'2026-10-17T13:00Z',state:'confirmed'},{job_ref:'other',scheduled_at:'2026-10-18T13:00Z',state:'confirmed'}];
 const s=core.summary(jobs,apps,rows,now);assert.equal(s.apps.length,2);assert.equal(s.counts.contratadas,0);assert.equal(s.counts.reprovadas,1);assert.equal(s.unseen,1);assert.equal(s.next.length,1);assert.equal(s.awaitingConfirmation,1);
});
test('selection stage is not an appointment and an invalid date never becomes an upcoming interview',()=>{
 const s=core.summary([{id:'j'}],[{id:'a',vagaId:'j',status:'Entrevista agendada'}],[{job_ref:'j',scheduled_at:'invalid',state:'invited'}]);assert.equal(s.counts.entrevista,1);assert.equal(s.next.length,0);assert.equal(core.date(''),null);assert.equal(core.date('31/10/2026').getDate(),31);
});
test('missing view counts and zero views never fabricate conversion statistics',()=>{
 const rows=core.performance([{id:'a'},{id:'b',views:0},{id:'c',views:100}],[{vagaId:'c',status:'Contratado'},{vagaId:'c',status:'Reprovado'}]);assert.equal(rows[0].views,null);assert.equal(rows[0].conversion,null);assert.equal(rows[1].conversion,null);assert.equal(rows[2].conversion,2);assert.equal(rows[2].hired,1);assert.equal(core.stage({status:'Não aprovado'}),'reprovadas');
});
test('profile completion identifies missing items without pretending verification approval',()=>{const s=core.completion({nome:'Empresa',cnpj:'123',email:'x@example.com'});assert.equal(s.percent,30);assert.ok(s.missing.includes('Responsável'));assert.ok(s.missing.includes('Logo'));});
test('CSV preserves separators and neutralizes spreadsheet formulas',()=>{const value=core.csv([['=HYPERLINK("bad")','A;B','+cmd','@SUM(1)','normal']]);assert.ok(value.startsWith('\ufeff'));assert.ok(value.includes('"\'=HYPERLINK(""bad"")"'));assert.ok(value.includes('"A;B"'));assert.ok(value.includes('"\'+cmd"'));});

const company={cnpj:'12.345.678/0001-90',nome:'Empresa exemplo',nomeFantasia:'Empresa exemplo',razaoSocial:'Empresa Exemplo Ltda.',email:'login@example.com',emailCorporativo:'contato@example.com',telefoneEmpresa:'(31) 99999-9999',cidade:'Belo Horizonte',uf:'MG',plano:'anual',verificada:false};
const fields=()=>Object.assign(core.verificationData(company),{responsavelNome:'Pessoa Exemplo',responsavelCargo:'Proprietário',responsavelEmail:'pessoa@example.com',responsavelTelefone:'(31) 98888-8888',comprovacao:'Sou proprietário; o contato consta no canal oficial da empresa.'});
test('autofill combines registered data, public profile and the legacy representative without losing partially nested profiles',()=>{
 const e={...company,estado:'Minas Gerais',uf:'',perfilPublico:{segmento:'Comércio'},comprovacaoVerificacao:JSON.stringify({nome:'Responsável cadastrado',cargo:'Diretora',email:'rh@example.com',telefone:'31988888888',comprovacao:'Canal oficial cadastrado.',perfilPublico:{porte:'21 a 50 colaboradores',sobre:'Apresentação já cadastrada.',logo:'https://example.com/logo.png'}})};
 const v=core.verificationData(e),p=core.completion(e);
 assert.equal(v.responsavelNome,'Responsável cadastrado');assert.equal(v.responsavelEmail,'rh@example.com');assert.equal(v.sobre,'Apresentação já cadastrada.');assert.equal(v.segmento,'Comércio');assert.equal(v.uf,'MG');assert.equal(p.percent,100);assert.equal(p.filled,10);assert.deepEqual(p.missing,[]);
});
test('autofill never borrows data from another company and preserves nonempty current fields',()=>{
 const e={cnpj:company.cnpj,nome:'Atual',email:'login@example.com'};
 const v=core.verificationData(e,[{cnpj:'99.999.999/0001-99',telefone:'31911111111',responsavelNome:'Outra empresa'},{cnpj:'12345678000190',nome:'Desatualizado',telefone:'31999999999',perfilPublico:{segmento:'Serviços'}}]);
 assert.equal(v.nomeFantasia,'Atual');assert.equal(v.telefoneEmpresa,'31999999999');assert.equal(v.responsavelNome,'');assert.equal(v.segmento,'Serviços');assert.equal(v.responsavelEmail,'login@example.com');
});
test('completion reports the exact remaining item and does not count a partial representative as complete',()=>{
 const e={...fields(),segmento:'Comércio',porte:'Pequena',sobre:'Apresentação',logo:'https://example.com/logo.png',responsavelCargo:''};
 assert.equal(core.completion(e).percent,90);assert.deepEqual(core.completion(e).missing,['Responsável']);e.responsavelCargo='RH';assert.equal(core.completion(e).percent,100);
});
test('request validation distinguishes missing submission fields from optional public profile items',()=>{
 const v=fields();assert.deepEqual(core.verificationErrors(v,true),[]);
 const errors=core.verificationErrors({...v,razaoSocial:'',uf:'XX',responsavelTelefone:'123',comprovacao:''},false);
 assert.deepEqual(errors.map(e=>e.field),['razaoSocial','responsavelTelefone','uf','comprovacao','confirmacao']);
});
test('verification request preserves account login, plan, profile content and evidence metadata while setting only pending state',()=>{
 const source={...company,endereco:JSON.stringify({rua:'Rua de exemplo',cidade:'Belo Horizonte',uf:'MG'}),perfilPublico:{missao:'Missão preservada',beneficios:['Vale-transporte'],logo:'https://example.com/logo.png'},comprovacaoVerificacao:JSON.stringify({analiseAnterior:'Histórico preservado'})};
 const v={...fields(),emailCorporativo:'novo-contato@example.com'};
 const next=core.verificationUpdate(source,v,{request:true,confirmed:true,now:'2026-10-19T12:00:00Z'}),proof=JSON.parse(next.comprovacaoVerificacao);
 assert.equal(next.verificada,false);assert.equal(next.verificacaoStatus,'em_analise');assert.equal(next.verificacaoPendente,true);assert.equal(next.verificacaoEnviadaEm,'2026-10-19T12:00:00Z');assert.equal(next.email,'login@example.com');assert.equal(next.emailCorporativo,'novo-contato@example.com');assert.equal(next.plano,'anual');assert.equal(next.perfilPublico.missao,'Missão preservada');assert.deepEqual(next.perfilPublico.beneficios,['Vale-transporte']);assert.equal(proof.analiseAnterior,'Histórico preservado');assert.equal(proof.contatosDeclaradosCorretos,true);assert.equal(JSON.parse(next.endereco).rua,'Rua de exemplo');assert.equal(source.verificacaoStatus,undefined);assert.equal(source.perfilPublico.atualizadoEm,undefined);
});
test('saving approved-company details preserves approval and requires no new verification request',()=>{
 const e={...company,verificada:true,verificacaoStatus:'aprovada',statusVerificacao:'aprovada'};
 const next=core.verificationUpdate(e,{...fields(),responsavelNome:'Contato atualizado'},{request:false});
 assert.equal(next.verificada,true);assert.equal(next.verificacaoStatus,'aprovada');assert.equal(next.responsavelNome,'Contato atualizado');assert.throws(()=>core.verificationUpdate(e,fields(),{request:true,confirmed:true}),/já foi verificada/);assert.throws(()=>core.verificationUpdate({...company,verificacaoStatus:'em_analise'},fields(),{request:true,confirmed:true}),/em análise/);
});
test('verification updates cannot change the company identity',()=>{assert.throws(()=>core.verificationUpdate(company,{...fields(),cnpj:'99999999000199'}),/CNPJ/);});
test('official site links accept web URLs and reject executable protocols on both save and request',()=>{assert.equal(core.verificationUpdate(company,{...fields(),site:'https://example.com'}).site,'https://example.com');for(const request of [false,true])assert.throws(()=>core.verificationUpdate(company,{...fields(),site:'javascript:alert(1)'},{request,confirmed:true}),/site oficial/);});
test('failed or unconfirmed submissions never mutate the company or fabricate a pending status',async()=>{
 for(const result of [{sucesso:false,erro:'Serviço indisponível'},{}])await assert.rejects(core.submitVerification(company,fields(),{request:true,confirmed:true,transport:async()=>result}));
 assert.equal(company.verificacaoStatus,undefined);assert.equal(company.verificada,false);
 let calls=0;await assert.rejects(core.submitVerification(company,{...fields(),comprovacao:''},{request:true,confirmed:true,transport:async()=>{calls++;return {sucesso:true};}}));assert.equal(calls,0);
});
test('a confirmed submission sends the request and rejects a response for another company',async()=>{
 let received;const saved=await core.submitVerification(company,fields(),{request:true,confirmed:true,transport:async next=>{received=next;return {sucesso:true,empresa:{...next,id:'saved-id'}};}});
 assert.equal(received.verificacaoStatus,'em_analise');assert.equal(saved.id,'saved-id');assert.equal(saved.verificada,false);
 await assert.rejects(core.submitVerification(company,fields(),{transport:async()=>({sucesso:true,empresa:{cnpj:'99999999000199'}})}),/não corresponde/);
});

test('marking an owned application as Contratado adds it to hires and changing its stage removes it',()=>{
 const jobs=[{id:'own',status:'encerrada'}],rows=[{id:'candidate',vagaId:'own',status:'Aprovado'},{id:'other',vagaId:'other-company',status:'Contratado'}];
 assert.equal(core.hiredApplications(jobs,rows).length,0);
 Object.assign(rows[0],{status:'Contratado',contratadoEm:'2026-10-19T12:00:00Z'});
 assert.deepEqual(core.hiredApplications(jobs,rows).map(c=>c.id),['candidate']);
 rows[0].status='Em entrevista';assert.equal(core.hiredApplications(jobs,rows).length,0);
});
test('hire filters use current records and match candidate, job and hiring month together',()=>{
 const jobs=[{id:1},{id:2}],rows=[{id:'a',vaga_id:'1',candidatoNome:'Júlia Exemplo',status:'Contratado',hired_at:'2026-10-19T12:00:00Z'},{id:'b',idVaga:2,nome:'Outra pessoa',status:'Contratada',dataContratacao:'2026-09-15T12:00:00Z'}];
 assert.deepEqual(core.hiredApplications(jobs,rows,{query:'julia',job:'1',month:'2026-10'}).map(c=>c.id),['a']);
 assert.equal(core.hiredApplications(jobs,rows,{month:'2026-11'}).length,0);
 rows[0].nome='Nome atualizado';assert.equal(core.hiredApplications(jobs,rows,{query:'atualizado'}).length,1);
});
test('hires preserve missing dates without inventing them and put recent hires first',()=>{
 const rows=[{id:'old',vagaId:'j',status:'Contratado',contratado_em:'2026-09-10T12:00:00Z'},{id:'unknown',vagaId:'j',status:'Contratado'},{id:'new',vagaId:'j',status:'Contratado',contratadoEm:'2026-10-19T12:00:00Z'}];
 assert.deepEqual(core.hiredApplications([{id:'j'}],rows).map(c=>c.id),['new','old','unknown']);assert.equal(core.hiredOn(rows[1]),null);assert.equal(core.hiredApplications([{id:'j'}],rows,{month:'2026-10'}).length,1);assert.equal(rows[0].id,'old');
});

