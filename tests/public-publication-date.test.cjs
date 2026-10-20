const {test}=require('node:test');const assert=require('node:assert/strict');
const {publicationLabel}=require('../vagas-demo.js');
test('publication labels use calendar days in Brasília and preserve date-only values',()=>{
 const now=new Date('2026-10-21T01:00:00Z');
 assert.equal(publicationLabel('2026-10-20',now),'Hoje');
 assert.equal(publicationLabel('2026-10-19',now),'Ontem');
 assert.equal(publicationLabel('2026-10-18',now),'18/10/2026');
 assert.equal(publicationLabel('2026-10-20T02:30:00Z',now),'Ontem');
 assert.equal(publicationLabel('',now),'Não informada');
});
