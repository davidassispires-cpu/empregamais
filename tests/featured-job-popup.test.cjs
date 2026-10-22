'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {jobDetails,publicText} = require('../featured-vacancies.js');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('featured detail preserves the complete description and requirements without preview limits', () => {
  const description = 'Responsabilidade detalhada.\n'.repeat(180) + 'ÚLTIMA INFORMAÇÃO';
  const requirements = 'Requisito completo.\n'.repeat(80) + 'ÚLTIMO REQUISITO';
  const result = jobDetails({id:'real-1',cargo:'Analista',descricao:description,requisitos:requirements});
  assert.equal(result.description,description);
  assert.equal(result.requirements,requirements);
  assert.equal(result.demo,false);
});

test('public content is plain text, HTML lists retain line breaks and executable markup is omitted', () => {
  assert.equal(publicText('<p>Texto &amp; conteúdo</p><ul><li>Primeiro</li><li>Segundo</li></ul><script>alert(1)</script><style>body{display:none}</style>'), 'Texto & conteúdo\nPrimeiro\nSegundo');
  assert.equal(publicText({nome:'Vale-refeição',internalToken:'secret'}),'Vale-refeição');
});

test('confidential jobs do not expose the company identity or company presentation', () => {
  const result = jobDetails({id:'real-2',confidencial:true,empresa:'Empresa privada',sobreEmpresa:'Nome e dados da empresa',
    recrutadorEmail:'privado@example.com',logo:'private-logo.svg',cnpj:'123',internalNotes:'Não publicar'});
  assert.equal(result.company,'Empresa confidencial');
  assert.equal(result.about,'');
  assert(!JSON.stringify(result).includes('privado@example.com'));
  assert(!JSON.stringify(result).includes('Empresa privada'));
  assert(!JSON.stringify(result).includes('private-logo'));
  assert(!JSON.stringify(result).includes('Não publicar'));
});

test('benefits are collected from supported public fields and repeated items appear once', () => {
  const result = jobDetails({id:'demo-publica-1',beneficiosTags:['Vale-transporte'],beneficios:'Vale-transporte;Plano de saúde',
    beneficiosSelecionados:[{nome:'Vale-refeição'}],benefits:['plano de saúde','Gympass']});
  assert.deepEqual(result.benefits,['Vale-transporte','Plano de saúde','Vale-refeição','Gympass']);
  assert.equal(result.demo,true);
});

test('facts retain public values, publication uses the Brazilian calendar and salary stays readable', () => {
  const result = jobDetails({id:'1',cidade:'Betim',uf:'mg',salario:5500,contrato:'Efetivo – CLT',dataPublicacao:'2026-10-22',
    jornada:'44 horas semanais',horario:'08h às 17h',experiencia:'2 anos',area:'Tecnologia',pcd:'Não exclusiva para PcD'},
    {education:'Superior completo'});
  assert.equal(result.location,'Betim – MG');
  assert.match(result.salary,/5\.500,00/);
  assert.equal(result.contract,'CLT');
  assert.equal(result.date,'22/10/2026');
  assert.deepEqual(result.facts,[['Área','Tecnologia'],['Jornada','44 horas semanais'],['Horário','08h às 17h'],
    ['Experiência','2 anos'],['Escolaridade','Superior completo']]);
  assert.equal(jobDetails({id:'2',dataPublicacao:'invalid'}).date,'Não informada');
});

function legacyNavigation(popupEnabled) {
  const source = fs.readFileSync(path.join(__dirname,'../empregamais_lote9.js'),'utf8');
  const clickStart = source.indexOf('/* Corrige CTA Candidatar-se nos cards da lista V203 */');
  const clickEnd = source.indexOf('/* Rodapé profissional dos cards de vaga V204 */',clickStart);
  const mobileStart = source.indexOf('/* Mobile: garante abertura da vaga pelo CTA Candidatar-se V205 */');
  const mobileEnd = source.indexOf('\n(function(){\n var pending=false;',mobileStart);
  assert(clickStart >= 0 && clickEnd > clickStart && mobileStart >= 0 && mobileEnd > mobileStart);
  const handlers = [], navigations = [];
  const document = {readyState:'complete',getElementById:()=>null,
    addEventListener:(type,handler)=>handlers.push([type,handler])};
  const window = {irPara:(page,id)=>navigations.push({page,id}),
    addEventListener:(type,handler)=>handlers.push([type,handler])};
  const location = {pathname:'/empregamais/',assign:url=>navigations.push({url})};
  vm.runInNewContext(source.slice(clickStart,clickEnd)+source.slice(mobileStart,mobileEnd),
    {window,document,location,URL});
  const card = {getAttribute:name=>name==='data-vaga-id'?'job-exact-id':
    name==='data-em-featured-popup'&&popupEnabled?'true':null};
  const button = {textContent:'Candidatar-se',closest:selector=>selector==='#pagina-vaga'?null:card};
  const event = {target:{closest:()=>button},preventDefault(){},stopPropagation(){},stopImmediatePropagation(){}};
  assert.equal(handlers.length,3);
  handlers.forEach(([,handler])=>handler(event));
  return navigations;
}

test('legacy click and mobile pointer handlers yield to the featured popup', () => {
  assert.deepEqual(legacyNavigation(true),[]);
});

test('legacy routing keeps working for cards outside the popup integration', () => {
  assert.deepEqual(legacyNavigation(false),[
    {page:'vaga',id:'job-exact-id'},
    {url:'/empregamais/?pagina=vaga&id=job-exact-id'},
    {url:'/empregamais/?pagina=vaga&id=job-exact-id'}
  ]);
});
