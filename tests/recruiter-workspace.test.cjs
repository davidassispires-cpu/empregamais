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
