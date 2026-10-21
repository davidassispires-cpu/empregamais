const {test} = require('node:test');
const assert = require('node:assert/strict');
const {matchesExtras,seniority,calendarDay} = require('../vacancy-filters.js');
const now = new Date('2026-10-21T01:00:00Z'); // Still October 20 in Brasília.

test('publication filters use Brasília calendar days and preserve date-only dates', () => {
  assert(matchesExtras({dataPublicacao:'2026-10-20'}, {publication:'today'}, now));
  assert(matchesExtras({dataPublicacao:'20/10/2026'}, {publication:'today'}, now));
  assert(!matchesExtras({dataPublicacao:'2026-10-20T02:30:00Z'}, {publication:'today'}, now));
  assert(!matchesExtras({dataPublicacao:'2026-10-21'}, {publication:'today'}, now));
});
test('the last seven days include today and six preceding days, excluding missing dates', () => {
  assert(matchesExtras({dataPublicacao:'2026-10-14'}, {publication:'7'}, now));
  assert(!matchesExtras({dataPublicacao:'2026-10-13'}, {publication:'7'}, now));
  assert(!matchesExtras({dataPublicacao:'invalid'}, {publication:'7'}, now));
  assert(!matchesExtras({}, {publication:'7'}, now));
  assert(matchesExtras({}, {}, now));
  assert.equal(calendarDay('invalid'), null);
});
test('journey, seniority, and publication combine without accepting a partial match', () => {
  const job = {cargo:'Analista de suporte Júnior',jornada:'44 horas semanais',dataPublicacao:'2026-10-19'};
  assert(matchesExtras(job, {journey:'44 horas semanais',seniority:'junior',publication:'3'}, now));
  assert(!matchesExtras(job, {journey:'30 horas semanais',seniority:'junior',publication:'3'}, now));
  assert(!matchesExtras(job, {journey:'44 horas semanais',seniority:'senior',publication:'3'}, now));
  assert(!matchesExtras(job, {journey:'44 horas semanais',seniority:'junior',publication:'today'}, now));
});
test('seniority uses explicit levels or stated title markers and leaves other titles unspecified', () => {
  assert.equal(seniority({cargo:'Analista',senioridade:'Pleno'}), 'mid');
  assert.equal(seniority({cargo:'Analista de Suporte NOC JR'}), 'junior');
  assert.equal(seniority({cargo:'Desenvolvedor Sênior'}), 'senior');
  assert.equal(seniority({cargo:'Gerente de Expansão'}), 'lead');
  assert.equal(seniority({cargo:'Estágio em TI'}), 'entry');
  assert.equal(seniority({cargo:'Assistente Comercial'}), 'unknown');
  assert(matchesExtras({cargo:'Assistente Comercial'}, {journey:'__unknown',seniority:'unknown'}));
});
test('installation waits for existing forms, and retries after returning to the home page', () => {
  const fs = require('node:fs'), vm = require('node:vm');
  const events = {}, winEvents = {}; let queries = 0;
  const document = {readyState:'interactive',addEventListener:(name,fn)=>{events[name]=fn;},querySelector(){queries++;return null;}};
  const window = {document,addEventListener:(name,fn)=>{winEvents[name]=fn;},renderizarVagas:()=>42};
  vm.runInNewContext(fs.readFileSync(require.resolve('../vacancy-filters.js'),'utf8'), {window});
  assert.equal(window.renderizarVagas(),42); assert.equal(queries,0);
  events.DOMContentLoaded(); assert.equal(queries,1);
  assert.equal(window.renderizarVagas(),42); assert.equal(queries,2);
  winEvents.load(); assert.equal(queries,2);
});
