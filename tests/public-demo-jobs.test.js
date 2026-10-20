'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const demo = require('../vagas-demo.js');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

function element(className = '') {
  const node = {className, children: [], attributes: {}, textContent:'',
    appendChild(child) { this.children.push(child); child.parentNode = this; return child; },
    insertBefore(child, before) { const i = this.children.indexOf(before); this.children.splice(i < 0 ? 0 : i, 0, child); child.parentNode = this; },
    remove() { if (this.parentNode) this.parentNode.children = this.parentNode.children.filter(n => n !== this); },
    setAttribute(k, v) { this.attributes[k] = String(v); },
    querySelectorAll(selector) {
      const selectors = selector.split(',').map(s => s.trim()), found = [];
      const matches = (node, part) => part[0] === '.' ? node.className.split(' ').includes(part.slice(1)) : part[0] === '#' ? node.id === part.slice(1) : node.tagName === part.toUpperCase();
      const visit = node => node.children.forEach(child => { if (selectors.some(part => matches(child, part))) found.push(child); visit(child); });
      visit(this); return found;
    },
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; },
    get firstChild() { return this.children[0] || null; }
  };
  node.classList = {add(name) { node.className += ' ' + name; },contains(name) { return node.className.split(' ').includes(name); }};
  return node;
}
function fixture(route = '?pagina=home') {
  const page = element(), home = element('ativa'), listeners = {}, messages = [], calls = [];
  const realJob = {id:'real-job',cargo:'Vaga cadastrada',empresa:'Empresa real',status:'ativa',aprovacao:'aprovada',dataPublicacao:new Date().toISOString().slice(0,10),salario:'R$ 3.000,00'};
  const stored = [realJob];
  const win = {
    location:{search:route},
    vagasPadrao:[{id:'vaga1'},{id:'vaga2'}],
    carregarVagasPortal:() => stored,
    aplicarOverrideAdminVaga:job => ({...job}),
    extrairSalarioNumero:() => 3000,
    document:{
      createElement:() => element(),
      getElementById(id) { return id === 'pagina-home' ? home : id === 'pagina-vaga' ? page : page.children.find(n => n.id === id) || null; }
    },
    localStorage:{setItem() { throw Error('Demo jobs must not be persisted'); }},
    fetch() { throw Error('Demo jobs must not call the backend'); },
    addEventListener(name, handler, capture) { listeners[name] = {handler,capture}; },
    mostrarModalSite(...args) { messages.push(args); },
    abrirContatoExternoVaga(job) { calls.push(job.id); },
    abrirVaga(id) { win.vagaAtual = win.localizarVaga(id); return id; },
    criarCardVaga(job, featured) {
      const card = element(featured ? 'em-featured-reference' : 'vaga-card em-lista-final');
      card.setAttribute('data-vaga-id', job.id);
      card.appendChild(element(featured ? 'em-featured-badges' : 'em-lista-cab'));
      return card;
    },
    renderizarVagas() {
      const jobs = win.todasAsVagasPublicas();
      win.cards = jobs.map(job => win.criarCardVaga(job, false));
      win.featured = jobs.filter(job => job.destaque).map(job => win.criarCardVaga(job, true));
    }
  };
  vm.createContext(win);
  function existingFunction(start, end) {
    const i = html.indexOf('function ' + start);
    assert(i >= 0); const j = html.indexOf('function ' + end, i); assert(j > i);
    vm.runInContext(html.slice(i, j), win);
  }
  existingFunction('prazoRestanteVaga45EM(', 'papelAtual(');
  existingFunction('todasAsVagasPublicas(', 'esconderPaginas(');
  existingFunction('localizarVaga(id)', 'inicioDoDiaLocal(');
  return {win, page, home, stored, realJob, listeners, messages, calls};
}

test('the public catalog contains thirty-three distinct samples with the requested badge combinations', () => {
  const jobs = demo.criarVagas('2026-10-17T01:10:00Z');
  assert.equal(jobs.length, 33);
  assert.equal(new Set(jobs.map(j => j.id)).size, 33);
  assert.equal(jobs.filter(j => j.destaque).length, 10);
  assert.equal(jobs.filter(j => j.urgente && j.contratacaoUrgente).length, 5);
  assert.equal(jobs.filter(j => j.confidencial).length, 10);
  assert(jobs.every(demo.ehDemo));
  assert.deepEqual([...new Set(jobs.map(j => j.cidade))].sort(), ['Belo Horizonte','Betim','Contagem']);
  assert.deepEqual([...new Set(jobs.map(j => j.modalidade))].sort(), ['Híbrido','Presencial','Remoto']);
});

test('retired brands disappear while twenty additional samples keep stable identities and confidential logos private', () => {
  const jobs = demo.criarVagas('2026-10-20T00:25:00Z');
  for (const id of [1,4,9,12,13,16,20]) assert(!jobs.some(job => job.id === 'demo-publica-' + String(id).padStart(2,'0')));
  assert(!jobs.some(job => /Araujo|Magazine Luiza/i.test(job.empresa)));
  const added = jobs.filter(job => Number(job.id.slice(-2)) >= 21);
  assert.equal(added.length, 20);
  assert.equal(added.filter(job => !job.confidencial).length, 14);
  assert.equal(added.filter(job => job.confidencial).length, 6);
  assert(added.some(job => !job.destaque && !job.urgente && !job.confidencial));
  for (const job of jobs) {
    if (job.confidencial) {
      assert.equal(job.empresa, 'Empresa confidencial'); assert.equal(job.logo, '');
    } else {
      assert(job.logo, job.id + ': public demonstrations need a logo');
      if (Number(job.id.slice(-2)) >= 21) {
        assert.match(job.logo, /^data:image\/svg\+xml;charset=UTF-8,/);
        assert.match(decodeURIComponent(job.logo.split(',')[1]), /^<svg[^>]*xmlns="http:\/\/www.w3.org\/2000\/svg"/);
      }
    }
  }
  const later = demo.criarVagas('2026-10-21T00:25:00Z');
  assert.deepEqual(later.map(job => [job.id,job.empresa,job.logo]), jobs.map(job => [job.id,job.empresa,job.logo]));
});

test('samples have complete details, valid salary ordering and explicit fictional identity', () => {
  for (const job of demo.criarVagas('2026-10-17T01:10:00Z')) {
    for (const field of ['cargo','cidade','uf','area','modalidade','contrato','salario','descricao','requisitos','beneficios','jornada','horario']) assert(job[field], `${job.id}: ${field}`);
    assert(job.salarioNumero > 0);
    assert.match(job.dataPublicacao, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(job.descricao, /demonstração.*fictícia/s);
    assert.equal(job.empresaEmail, '');
    assert.equal(job.contatoCandidatura, '');
    if (job.confidencial) assert.equal(job.empresa, 'Empresa confidencial');
    else assert.match(job.empresa, /\(Demo\)$/);
  }
});

test('the existing public getter and detail lookup find every sample while keeping the real store intact', () => {
  const env = fixture(), getter = env.win.carregarVagasPortal;
  demo.instalar(env.win);
  const jobs = env.win.todasAsVagasPublicas();
  assert.equal(jobs.length, 34);
  assert.equal(jobs.filter(demo.ehDemo).length, 33);
  assert.equal(env.win.carregarVagasPortal, getter);
  assert.equal(env.stored.length, 1);
  assert.equal(env.stored[0], env.realJob);
  for (const job of jobs) assert.equal(env.win.localizarVaga(job.id).id, job.id);
  assert.equal(jobs.filter(j => j.cidade === 'Betim').length, 11);
  assert.equal(jobs.filter(j => j.modalidade === 'Remoto').length, 4);
  assert.equal(jobs.filter(j => j.contrato === 'Estágio').length, 1);
  assert.equal(jobs.filter(j => j.contrato === 'Jovem Aprendiz').length, 1);
  const sorted = jobs.filter(demo.ehDemo).sort((a,b) => b.salarioNumero-a.salarioNumero);
  assert.equal(sorted[0].cargo, 'Analista de Dados');
  demo.instalar(env.win);
  assert.equal(env.win.todasAsVagasPublicas().length, 34, 'Repeated installation must not duplicate the samples');
});

test('default examples survive confirmed remote refreshes without being written into the remote cache', () => {
  const env = fixture(); demo.instalar(env.win);
  env.stored.splice(0, 1);
  assert.equal(env.win.todasAsVagasPublicas().length, 33);
  env.stored.push({...env.realJob, id:'second-real-job'});
  assert.equal(env.win.todasAsVagasPublicas().length, 34);
  assert.deepEqual(env.stored.map(j => j.id), ['second-real-job']);
});

test('retired company listings stay excluded after remote refresh without changing stored vacancies', () => {
  const env = fixture();
  const removed = ['DROGARIA ARAUJO','Magazine Luiza','Magalu'].map((empresa,index) => ({...env.realJob,id:'retired-' + index,empresa}));
  env.stored.push(...removed);
  demo.instalar(env.win);
  assert.equal(env.win.todasAsVagasPublicas().length, 34);
  assert(!env.win.todasAsVagasPublicas().some(job => removed.includes(job)));
  env.win.renderizarVagas(); assert.equal(env.win.cards.length, 34);
  assert.equal(env.stored.length, 4);
  for (const job of removed) assert(env.stored.includes(job));
  env.stored.push({...env.realJob,id:'new-araujo',empresa:'Drogaria Araújo (Demo)'});
  env.win.renderizarVagas(); assert.equal(env.win.cards.length, 34);
});

test('opening a job does not rebuild the hidden home; returning home still renders all thirty-three samples', () => {
  const env = fixture('?pagina=vaga&id=demo-publica-07');
  env.home.className = '';
  demo.instalar(env.win);
  for (let i = 0; i < 10; i++) env.win.renderizarVagas();
  assert.equal(env.win.cards, undefined);
  assert.equal(env.win.localizarVaga('demo-publica-07').cargo, 'Assistente Financeiro');
  env.home.className = 'ativa';
  env.win.renderizarVagas();
  assert.equal(env.win.cards.length, 34);
  assert.equal(env.win.featured.length, 10);
});

test('both card sections label samples and keep the existing data IDs used for filtering and navigation', () => {
  const env = fixture(); demo.instalar(env.win);
  assert.equal(env.win.cards.length, 34);
  assert.equal(env.win.featured.length, 10);
  for (const card of [...env.win.cards.slice(0,33), ...env.win.featured]) {
    assert.match(card.attributes['data-vaga-id'], /^demo-publica-/);
    const bar = card.querySelector('.em-public-demo-badges'); assert(bar);
    assert(bar.children.some(badge => badge.children.some(text => text.textContent === 'Demonstração')));
  }
  const confidential = env.win.cards.find(c => c.attributes['data-vaga-id'] === 'demo-publica-05');
  assert(confidential.querySelector('.confidential'));
  const featuredInList = env.win.cards.find(c => c.attributes['data-vaga-id'] === 'demo-publica-02');
  assert(featuredInList.querySelector('.featured'));
  assert.equal(env.win.cards.at(-1).querySelector('.em-public-demo-badges'), null, 'Real cards retain their normal presentation');
});

test('demo applications show an explanation before legacy capture handlers while real applications remain available', () => {
  const env = fixture(); demo.instalar(env.win);
  env.win.abrirVaga('demo-publica-02');
  assert(env.win.document.getElementById('emPublicDemoJobNotice'));
  env.win.abrirContatoExternoVaga(env.win.vagaAtual);
  assert.equal(env.calls.length, 0); assert.equal(env.messages.length, 1);
  const button = {textContent:'Candidatar-se',closest:selector => selector === '#pagina-vaga' ? env.page : null};
  let prevented = false, stopped = false;
  env.listeners.click.handler({target:{closest:() => button},preventDefault(){prevented=true;},stopImmediatePropagation(){stopped=true;}});
  assert.equal(env.listeners.click.capture, true); assert(prevented && stopped);
  assert.equal(env.calls.length, 0); assert.equal(env.messages.length, 2);
  env.win.abrirVaga('real-job');
  assert.equal(env.win.document.getElementById('emPublicDemoJobNotice'), null);
  env.win.abrirContatoExternoVaga(env.win.vagaAtual);
  assert.deepEqual(env.calls, ['real-job']);
});

test('the candidate and recruiter demos retain their independent sample datasets', () => {
  for (const route of ['demo-candidato','demo-recrutador']) {
    const env = fixture('?pagina=' + route), originals = env.win.vagasPadrao;
    demo.instalar(env.win);
    assert.equal(env.win.vagasPadrao, originals);
    assert.equal(env.win.__emPublicDemoJobs, undefined);
    assert.equal(Object.keys(env.listeners).length, 0);
  }
});

