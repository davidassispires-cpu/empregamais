'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const privacy = fs.readFileSync(path.join(__dirname, '../empregamais_confidencial_definitivo_v1.js'), 'utf8');

function between(source, start, end) {
  const i = source.indexOf(start); assert(i >= 0, start);
  const j = source.indexOf(end, i + start.length); assert(j > i, end);
  return source.slice(i, j);
}
function textNode(value = '', childElementCount = 0) {
  return {writes:0, childElementCount, style:{}, classList:{add(){},remove(){}},removeAttribute(){},
    get textContent() { return value; },
    set textContent(next) { value = next; this.childElementCount = 0; this.writes++; },
    set innerHTML(next) { value = next; this.childElementCount = 0; this.writes++; }
  };
}

test('location highlighting settles after the observer removes its animation class', () => {
  const classes = new Set(['em-perto-active','em-near-attention']);
  let notifications = 0, passes = 0;
  const title = textNode('Encontre vagas perto de você'), cepButton = textNode('Informar CEP');
  const box = {classList:{contains:token => classes.has(token),remove(token) { classes.delete(token); notifications++; }}};
  const context = {box,title,cepButton}; vm.createContext(context);
  const script = between(html, 'function active(){var selected=box.classList.contains("em-perto-active")', '\nnew MutationObserver(active)');
  vm.runInContext(script, context);
  context.active();
  while (notifications && passes < 8) { notifications--; passes++; context.active(); }
  assert.equal(notifications, 0, 'An update must not trigger an endless class-observer loop');
  assert.equal(passes, 1);
  assert.equal(title.writes, 1); assert.equal(cepButton.writes, 1);
  assert.equal(title.textContent, 'Buscando vagas perto de você');
  assert.equal(cepButton.textContent, 'Alterar localização');
});

function distances(active = true) {
  const job = {id:'job-1',cargo:'Assistente',empresa:'Exemplo',modalidade:'Presencial',latitude:1.01,longitude:1.01};
  let label = null, nextTimer = 0;
  const timers = new Map();
  const card = {setAttribute(){},getAttribute:() => job.id,querySelector:selector => selector === '.distancia-cep-final-em' ? label : null,appendChild(node) { label = node; }};
  const home = {classList:{contains:() => active},querySelectorAll:() => [card]};
  const context = {
    sessionStorage:{getItem:key => key === 'candidatoLogado' ? JSON.stringify({latitude:1,longitude:1}) : ''},
    localStorage:{getItem:() => ''},
    document:{getElementById:id => id === 'pagina-home' ? home : null,querySelectorAll:() => [card],createElement:() => textNode(),body:{}},
    carregarVagasPortal:() => [job],criarCardVaga:() => card,
    addEventListener(){},
    setTimeout(fn) { const id = ++nextTimer; timers.set(id, fn); return id; },
    clearTimeout(id) { timers.delete(id); },
    MutationObserver:function () { this.observe = function () {}; }
  };
  context.window = context; vm.createContext(context);
  const i = html.indexOf('function numEM(v)');
  const start = html.lastIndexOf('(function(){', i);
  const marker = html.indexOf('window.EmpregaMaisRecalcularDistancias=aplicarCardsEM;', start);
  const end = html.indexOf('})();', marker) + 5;
  vm.runInContext(html.slice(start, end), context);
  return {context,home,card,job,timers,get label(){return label;}};
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('repeated distance updates keep the existing label when its value has not changed', async () => {
  const env = distances();
  env.context.EmpregaMaisRecalcularDistancias(); await settle();
  assert(env.label); assert.equal(env.label.writes, 1);
  const original = env.label.textContent;
  for (let i = 0; i < 20; i++) env.context.EmpregaMaisRecalcularDistancias();
  await settle();
  assert.equal(env.label.writes, 1, 'Unchanged labels must not keep notifying DOM observers');
  env.job.latitude = 1.03;
  env.context.EmpregaMaisRecalcularDistancias(); await settle();
  assert.equal(env.label.writes, 2);
  assert.notEqual(env.label.textContent, original, 'A changed distance must still be rendered');
});

test('creating twenty cards queues one distance pass instead of twenty scans of the document', () => {
  const env = distances();
  for (let i = 0; i < 20; i++) env.context.criarCardVaga(env.job, false);
  assert.equal(env.timers.size, 1);
});

test('distance callbacks do no rendering work while the home page is hidden', async () => {
  const env = distances(false);
  for (let i = 0; i < 20; i++) env.context.criarCardVaga(env.job, false);
  env.context.EmpregaMaisRecalcularDistancias(); await settle();
  assert.equal(env.timers.size, 0);
  assert.equal(env.label, null);
});

test('confidential detail protection anonymizes once and then leaves the DOM stable', () => {
  const name = textNode('Nome privado', 1), lateral = textNode('Nome privado');
  const page = {classList:{add(){}},querySelectorAll:() => []};
  const context = {document:{getElementById:id => ({'pagina-vaga':page,detalheEmpresaCab:name,empresaLateralNome:lateral})[id] || null},confidencial:v => v.confidencial,ocultar(){}};
  vm.createContext(context);
  vm.runInContext(between(privacy, 'function protegerDetalhe(v){', '\nfunction aplicar(){'), context);
  for (let i = 0; i < 20; i++) context.protegerDetalhe({confidencial:true});
  assert.equal(name.textContent, 'Empresa confidencial'); assert.equal(lateral.textContent, 'Empresa confidencial');
  assert.equal(name.childElementCount, 0);
  assert.equal(name.writes, 1); assert.equal(lateral.writes, 1);
});

test('the older privacy observer also leaves an already anonymized card unchanged', () => {
  const name = textNode('Nome privado', 1);
  const card = {classList:{add(){}},querySelectorAll:selector => selector.includes('.vaga-empresa') ? [name] : []};
  const context = {ehConf:v => v.confidencial}; vm.createContext(context);
  vm.runInContext(between(html, 'function ocultarEmpresaNoCard(card,v){', '\n  function aplicarTudo(){'), context);
  for (let i = 0; i < 20; i++) context.ocultarEmpresaNoCard(card, {confidencial:true});
  assert.equal(name.textContent, 'Empresa confidencial'); assert.equal(name.writes, 1);
});
