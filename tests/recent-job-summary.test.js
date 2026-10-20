'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const demo = require('../vagas-demo.js');

// Minimal DOM for exercising the real card and modal event handlers without a browser.
function fixture(nativeDialog = true, withBrowser = false, withObserver = false, setup = null) {
  const doc = {activeElement:null, readyState:'complete'};
  class Element {
    constructor(tag) { this.tagName=tag.toUpperCase(); this.className=''; this.children=[]; this.attributes={}; this.listeners={}; this.style={}; this._text=''; this.open=false; }
    get classList() { return {contains:name=>this.className.split(/\s+/).includes(name),add:(...names)=>{this.className=[...new Set(this.className.split(/\s+/).concat(names))].filter(Boolean).join(' ');}}; }
    get textContent() { return this._text + this.children.map(child=>child.textContent).join(''); }
    set textContent(value) { this.replaceChildren(); this._text=String(value); }
    set innerHTML(value) { this.replaceChildren(); this._text=''; this.htmlAssigned=String(value); }
    get firstChild() { return this.children[0] || null; }
    get isConnected() { let node=this; while(node.parentNode)node=node.parentNode;return node===doc.body; }
    setAttribute(name,value) { this.attributes[name]=String(value);if(name==='id')this.id=String(value);if(name==='open')this.open=true; }
    getAttribute(name) { return this.attributes[name] ?? null; }
    removeAttribute(name) { delete this.attributes[name]; }
    appendChild(child) { child.remove();this.children.push(child);child.parentNode=this;return child; }
    insertBefore(child,before) { child.remove();const at=this.children.indexOf(before);this.children.splice(at<0?this.children.length:at,0,child);child.parentNode=this;return child; }
    replaceChildren(...children) { this.children.forEach(child=>{child.parentNode=null;});this.children=[];this._text='';children.forEach(child=>this.appendChild(child)); }
    remove() { if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(child=>child!==this);this.parentNode=null;} }
    querySelectorAll(selector) {
      const simple=(node,part)=>part[0]==='.'?node.classList.contains(part.slice(1)):part[0]==='#'?node.id===part.slice(1):node.tagName===part.toUpperCase();
      const matches=(node,parts)=>{
        if(!simple(node,parts.at(-1)))return false;
        let ancestor=node.parentNode;
        for(let i=parts.length-2;i>=0;i--){while(ancestor&&!simple(ancestor,parts[i]))ancestor=ancestor.parentNode;if(!ancestor)return false;ancestor=ancestor.parentNode;}
        return true;
      };
      const selectors=selector.split(',').map(part=>part.trim().split(/\s+/));
      const found=[];
      const visit=node=>node.children.forEach(child=>{if(selectors.some(parts=>matches(child,parts)))found.push(child);visit(child);});
      visit(this);return found;
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    closest(selector) {
      const parts=selector.split(',').map(part=>part.trim());let node=this;
      while(node){if(parts.some(part=>part[0]==='.'?node.classList.contains(part.slice(1)):node.tagName===part.toUpperCase()))return node;node=node.parentNode;}
      return null;
    }
    addEventListener(type,handler) { (this.listeners[type] ||= []).push(handler); }
    fire(type,properties={}) {
      const event={target:this,preventDefault(){this.defaultPrevented=true;},stopPropagation(){this.stopped=true;},...properties};
      if(typeof this['on'+type]==='function')this['on'+type](event);
      (this.listeners[type]||[]).forEach(handler=>handler(event));return event;
    }
    click() { this.fire('click'); }
    focus() { doc.activeElement=this; }
    scrollIntoView(options) { this.scrolledIntoView=true; this.scrollOptions=options; }
    showModal() { this.open=true; }
    close() { this.open=false;this.fire('close'); }
    getBoundingClientRect() { return {left:100,top:100,right:700,bottom:600}; }
  }
  doc.createElement=tag=>{const node=new Element(tag);if(tag==='dialog'&&!nativeDialog)node.showModal=undefined;return node;};
  doc.body=doc.createElement('body');
  doc.getElementById=id=>doc.body.querySelector('#'+id);
  const home=doc.createElement('main');home.id='pagina-home';home.className='ativa';doc.body.appendChild(home);
  const routes=[],applications=[],logoRequests=[],contacts=[],messages=[],scrolls=[],listeners={},saved=new Set(),observers=[],frames=[];
  let list=null,column=null,sidebar=null,filterInput=null,renderJobs=[];
  if(withBrowser){
    const area=doc.createElement('div');area.className='vagas-area';home.appendChild(area);
    column=doc.createElement('div');area.appendChild(column);
    const toolbar=doc.createElement('div');toolbar.className='vagas-toolbar';column.appendChild(toolbar);
    list=doc.createElement('div');list.id='listaVagas';column.appendChild(list);
    sidebar=doc.createElement('aside');sidebar.id='filtrosLateral';area.appendChild(sidebar);
    filterInput=doc.createElement('input');filterInput.id='filtroPalavra';filterInput.value='';sidebar.appendChild(filterInput);
  }
  const make=(tag,className,text)=>{const el=doc.createElement(tag);el.className=className;if(text!=null)el.textContent=text;return el;};
  const win={
    document:doc,location:{search:'?pagina=home',pathname:'/empregamais/'},vagasPadrao:[],
    innerWidth:1200,scrollY:0,matchMedia(){return {matches:win.innerWidth<=900};},
    scrollTo(x,y){scrolls.push([x,y]);win.scrollY=y;},
    addEventListener(type,handler){(listeners[type] ||= []).push(handler);},
    renderizarVagas(){if(list){list.replaceChildren();renderJobs.forEach(job=>list.appendChild(win.criarCardVaga(makeJob(job),false)));}},
    filtrarVagas(){},alternarFiltrosMobile(){},abrirFiltrosEFocar(id){doc.getElementById(id).focus();},
    irPara:(...args)=>routes.push(args),
    vagaEhConfidencialEM:job=>!!job.confidencial,vagaEstaSalva:id=>saved.has(id),
    alternarFavorito(id){if(saved.has(id))saved.delete(id);else saved.add(id);},
    abrirContatoExternoVaga:job=>contacts.push(job.id),mostrarModalSite:(...args)=>messages.push(args),
    fetch(){throw Error('A summary must not make network requests');},
    logoPreviaDestaqueEM(job){logoRequests.push(job.id);const wrap=make('div','');wrap.appendChild(make('img',''));return wrap;},
    criarCardVaga(job,featured){
      const card=make('article',featured?'em-featured-reference':'vaga-card em-lista-final');
      card.setAttribute('data-vaga-id',job.id);
      const heading=make('div','em-lista-cab');heading.appendChild(make('h3','em-lista-titulo',job.cargo));
      const company=make('div','em-lista-empresa');company.appendChild(make('span','',job.empresa));heading.appendChild(company);card.appendChild(heading);
      const pay=make('div','em-lista-salario');pay.appendChild(make('strong','',job.salario));card.appendChild(pay);
      const place=make('span','em-lista-meta-item');place.appendChild(make('b','',job.cidade+' – '+job.uf));card.appendChild(place);
      const apply=make('button','em-lista-ver','Candidatar-se');apply.onclick=function(){applications.push({id:job.id,originalButton:this===apply});};card.appendChild(apply);
      return card;
    }
  };
  if(withObserver){
    win.MutationObserver=class {constructor(callback){this.callback=callback;observers.push(this);}observe(target,options){this.target=target;this.options=options;}};
    win.requestAnimationFrame=function(callback){assert.equal(this,win);frames.push(callback);};
  }
  if (setup) setup(win,doc);
  demo.instalar(win);
  function makeJob(overrides={}) {
    return {id:'real-job',cargo:'ANALISTA DE RECURSOS HUMANOS',empresa:'Empresa Exemplo',cidade:'Contagem',uf:'MG',modalidade:'Híbrido',contrato:'CLT',salario:'R$ 3.800,00',dataPublicacao:'2026-10-19',jornada:'44 horas semanais',horario:'Segunda a sexta',descricao:'Recrutamento e seleção.',requisitos:'Experiência com recrutamento.',beneficios:'Vale-transporte; vale-alimentação.',...overrides};
  }
  function card(overrides={}) {
    const node=win.criarCardVaga(makeJob(overrides),false);(list||home).appendChild(node);if(list)win.filtrarVagas();return node;
  }
  function render(jobs){renderJobs=jobs;win.renderizarVagas();return [...list.children];}
  return {doc,win,card,render,list,column,sidebar,filterInput,routes,applications,logoRequests,contacts,messages,scrolls,listeners,observers,frames};
}

test('public vacancy previews display the company logo on ordinary and featured jobs',()=>{
  const env=fixture();
  const normal=env.card(),urgent=env.card({id:'urgent',urgente:true}),featured=env.card({id:'featured',destaque:true});
  assert(normal.querySelector('.em-r4-logo'));
  assert(urgent.querySelector('.em-r4-logo'));
  assert(featured.querySelector('.em-r4-logo'));
  assert.deepEqual(env.logoRequests,['real-job','urgent','featured']);
  const badge=featured.querySelector('.em-r4-footer-featured');
  assert.equal(badge.textContent,'Destaque');
  assert(badge.classList.contains('em-r4-footer-badge'));
  const facts=featured.querySelector('.em-r4-facts');
  assert.equal(badge.parentNode,featured.querySelector('.em-r4-footer-badges'));
  assert(featured.querySelector('.em-r4-footer').querySelector('.em-r4-date'));
  assert(urgent.querySelector('.em-r4-footer-urgent'));
  const both=env.card({id:'both',urgente:true,destaque:true});
  assert.equal(both.querySelectorAll('.em-r4-footer-badge').length,2);
  assert.equal(featured.firstChild,featured.querySelector('.em-r4-heading'));
  assert.equal(facts.firstChild,featured.querySelector('.em-r4-location'));
  assert.equal(featured.querySelector('.em-r4-journey'),null);
  assert.equal(featured.querySelector('.em-r2-benefits'),null);
  assert.equal(featured.querySelector('.em-r4-save'),null);
  assert.equal(featured.querySelector('.em-r4-details'),null);
  assert.equal(featured.querySelector('.em-lista-ver'),null);
  for(const card of [normal,urgent,featured]){
    const copy=card.querySelector('.em-r4-copy');
    assert.equal(copy.children[0],card.querySelector('.em-r4-title-line'));
    assert.equal(copy.children[1],card.querySelector('.em-r4-company'));
    assert.equal(card.querySelector('.em-r4-title-line').querySelectorAll('.em-r4-status').length,0);
    assert.equal(card.querySelectorAll('.em-r4-footer-badge').length,card===normal?0:1);
  }
});

test('the job title opens a summary with the vacancy facts and content without navigating',()=>{
  const env=fixture(),card=env.card(),details=card.querySelector('.em-r4-title-select');
  details.click();
  const dialog=env.doc.getElementById('emRecentJobSummary');
  assert(dialog&&dialog.open);
  for(const text of ['ANALISTA DE RECURSOS HUMANOS','Empresa Exemplo','Contagem – MG','R$ 3.800,00','Híbrido','CLT','44 horas semanais','Segunda a sexta','Recrutamento e seleção.','Experiência com recrutamento.','Vale-transporte; vale-alimentação.'])assert(dialog.textContent.includes(text),text);
  assert.deepEqual(env.routes,[]);
  assert.equal(details.getAttribute('aria-expanded'),'true');
  assert.equal(dialog.getAttribute('aria-labelledby'),'emRecentSummaryTitle');
  dialog.querySelector('.em-js-close').click();
  assert.equal(env.doc.getElementById('emRecentJobSummary'),null);
  assert.equal(details.getAttribute('aria-expanded'),'false');
  assert.equal(env.doc.activeElement,details);
  assert.equal(env.doc.body.style.overflow,undefined);
});

test('summary actions open the full vacancy or reuse the original application action',()=>{
  const env=fixture(),card=env.card(),details=card.querySelector('.em-r4-title-select');
  details.click();env.doc.getElementById('emRecentJobSummary').querySelector('.em-js-full').click();
  assert.deepEqual(env.routes,[['vaga','real-job']]);
  assert.equal(env.doc.getElementById('emRecentJobSummary'),null);
  details.click();env.doc.getElementById('emRecentJobSummary').querySelector('.em-js-apply').click();
  assert.deepEqual(env.applications,[{id:'real-job',originalButton:true}]);
  assert.equal(env.doc.getElementById('emRecentJobSummary'),null);
});

test('summary keyboard navigation contains focus and Escape closes without leaving an overlay',()=>{
  const env=fixture(),card=env.card(),details=card.querySelector('.em-r4-title-select');details.click();
  const dialog=env.doc.getElementById('emRecentJobSummary'),close=dialog.querySelector('.em-js-close'),apply=dialog.querySelector('.em-js-apply');
  assert.equal(env.doc.activeElement,close);
  assert(dialog.fire('keydown',{key:'Tab',shiftKey:true}).defaultPrevented);assert.equal(env.doc.activeElement,apply);
  assert(dialog.fire('keydown',{key:'Tab',shiftKey:false}).defaultPrevented);assert.equal(env.doc.activeElement,close);
  dialog.fire('keydown',{key:'Escape'});
  assert.equal(env.doc.getElementById('emRecentJobSummary'),null);assert.equal(env.doc.activeElement,details);
});

test('reopening summaries replaces the previous dialog and the fallback backdrop closes cleanly',()=>{
  const env=fixture(false),one=env.card({id:'one'}),two=env.card({id:'two',cargo:'SEGUNDA VAGA'});
  const first=one.querySelector('.em-r4-title-select'),second=two.querySelector('.em-r4-title-select');first.click();second.click();
  assert.equal(env.doc.body.querySelectorAll('dialog').length,1);
  assert.equal(env.doc.body.querySelectorAll('.em-job-summary-backdrop').length,1);
  assert.equal(first.getAttribute('aria-expanded'),'false');
  assert(env.doc.getElementById('emRecentJobSummary').textContent.includes('SEGUNDA VAGA'));
  env.doc.body.querySelector('.em-job-summary-backdrop').click();
  assert.equal(env.doc.body.querySelectorAll('dialog').length,0);
  assert.equal(env.doc.body.querySelectorAll('.em-job-summary-backdrop').length,0);
  assert.equal(env.doc.activeElement,second);
});

test('confidential featured jobs do not expose the company or logo in the card or summary',()=>{
  const env=fixture(),card=env.card({destaque:true,confidencial:true,empresa:'Identidade privada'});
  assert.equal(card.querySelector('.em-r4-logo'),null);assert.equal(env.logoRequests.length,0);
  card.querySelector('.em-r4-title-select').click();const dialog=env.doc.getElementById('emRecentJobSummary');
  assert(dialog.textContent.includes('Empresa confidencial'));assert(!dialog.textContent.includes('Identidade privada'));
});

test('HTML descriptions remain inert plain text and demo summaries explain their fictional identity',()=>{
  const env=fixture(),card=env.card({id:'demo-publica-99',demoPublica:true,descricao:'<p>Atendimento ao público.</p><script>unsafe()</script><img src=x onerror=unsafe()>'});
  card.querySelector('.em-r4-title-select').click();const dialog=env.doc.getElementById('emRecentJobSummary');
  assert(dialog.textContent.includes('Atendimento ao público.'));assert(!dialog.textContent.includes('unsafe'));
  assert.equal(dialog.querySelector('script'),null);assert.equal(dialog.querySelector('img'),null);
  assert(dialog.querySelector('.em-js-demo').textContent.includes('não recebe candidaturas reais'));
});
test('the desktop browser keeps results on the left and switches the complete panel without navigation',()=>{
  const env=fixture(true,true),cards=env.render([{id:'one',cargo:'PRIMEIRA VAGA'},{id:'two',cargo:'SEGUNDA VAGA'}]);
  const root=env.doc.getElementById('emJobBrowser'),panel=env.doc.getElementById('emJobPanel');
  assert.equal(root.children[0],env.column);assert.equal(root.children[1],panel);
  assert.equal(panel.getAttribute('data-vaga-id'),'one');
  env.win.scrollY=460;env.list.scrollTop=120;panel.scrollTop=160;
  cards[1].querySelector('.em-r4-title-select').click();
  assert.equal(panel.getAttribute('data-vaga-id'),'two');assert.equal(panel.scrollTop,0);
  assert.equal(env.win.scrollY,460);assert.equal(env.list.scrollTop,120);assert.deepEqual(env.scrolls,[]);
  assert.equal(cards[0].getAttribute('data-em-selected'),'false');assert.equal(cards[1].getAttribute('data-em-selected'),'true');
  assert.equal(cards[1].querySelector('.em-r4-title-select').getAttribute('aria-expanded'),'true');
  assert.equal(cards[1].querySelector('.em-r4-title-select').getAttribute('aria-haspopup'),null);
  assert.equal(env.doc.activeElement,env.doc.getElementById('emJobPanelTitle'));
  assert.deepEqual(env.routes,[]);
  assert.equal(env.doc.body.querySelector('dialog'),null);
});

test('similar-company cards expand below the vacancy and keep navigation and saving bound to the other job',()=>{
  const env=fixture(true,true),cards=env.render([
    {id:'one',cargo:'Analista Financeiro',area:'Finanças',empresaCnpj:'12345678000190'},
    {id:'two',cargo:'Assistente Financeiro',area:'FINANCAS',empresaCnpj:'12345678000190'},
    {id:'other-company',area:'Finanças',empresaCnpj:'98765432000190'},
    {id:'other-area',cargo:'Programador',area:'Informática',empresaCnpj:'12345678000190'}
  ]);
  const toggle=cards[0].querySelector('.em-r4-similar-toggle'),list=cards[0].querySelector('.em-r4-similar-list');
  assert(toggle);assert.equal(toggle.textContent,'Exibir vagas similares dessa empresa');
  assert.equal(list.hidden,true);assert.equal(toggle.getAttribute('aria-controls'),list.id);
  assert.equal(cards[2].querySelector('.em-r4-similar'),null);assert.equal(cards[3].querySelector('.em-r4-similar'),null);
  assert.equal(list.querySelectorAll('.em-r4-similar-card').length,1);
  assert.equal(list.querySelector('.em-r4-similar-open').getAttribute('href'),'/empregamais/?pagina=vaga&id=two');
  assert.equal(toggle.fire('click').stopped,true);assert.equal(list.hidden,false);
  assert.equal(toggle.getAttribute('aria-expanded'),'true');
  assert.equal(env.doc.getElementById('emJobPanel').getAttribute('data-vaga-id'),'one');
  const save=list.querySelector('.em-r4-similar-save');save.click();
  assert.equal(env.win.vagaEstaSalva('two'),true);assert.equal(env.win.vagaEstaSalva('one'),false);
  assert.equal(save.getAttribute('aria-pressed'),'true');
  env.win.filtrarVagas();assert.equal(cards[0].querySelector('.em-r4-similar-list'),list);assert.equal(list.hidden,false);
  cards[2].querySelector('.em-r4-title-select').click();
  cards[0].fire('click',{target:list.querySelector('.em-r4-similar-company')});
  assert.equal(env.doc.getElementById('emJobPanel').getAttribute('data-vaga-id'),'other-company');
  toggle.click();assert.equal(list.hidden,true);assert.equal(toggle.getAttribute('aria-expanded'),'false');
});

test('similar vacancies use the full public catalog while excluding closed, expired, confidential and unapproved jobs',()=>{
  const env=fixture(true,true),base={empresa:'Empresa Exemplo',empresaCnpj:'12345678000190',cargo:'Analista',area:'Administração'};
  const peer={...base,id:'off-page',cargo:'Assistente',status:'ativa',aprovacao:'aprovada'};
  let catalog=[peer,{...peer},{...peer,id:'closed',status:'encerrada'},{...peer,id:'paused',status:'pausada'},
    {...peer,id:'expired',expiraEm:'2000-01-01'},{...peer,id:'pending',aprovacao:'pendente'},
    {...peer,id:'private',confidencial:true},{...peer,id:'demo-publica-91',demoPublica:true},
    {...peer,id:'different-area',area:'Tecnologia'}];
  env.win.todasAsVagasPublicas=()=>catalog;
  const cards=env.render([{...base,id:'one'}]),list=cards[0].querySelector('.em-r4-similar-list');
  assert.equal(list.querySelectorAll('.em-r4-similar-card').length,1);
  assert.equal(list.querySelector('.em-r4-similar-open').getAttribute('href'),'/empregamais/?pagina=vaga&id=off-page');
  catalog=[];env.win.filtrarVagas();assert.equal(cards[0].querySelector('.em-r4-similar'),null);
  env.win.todasAsVagasPublicas=()=>[peer];
  const hidden=env.render([{...base,id:'private-origin',confidencial:true}]);
  assert.equal(hidden[0].querySelector('.em-r4-similar'),null);
});

test('similar titles match without an area and public demo jobs never group with real company jobs',()=>{
  const env=fixture(true,true),cards=env.render([
    {id:'one',cargo:'Auxiliar Administrativo',area:'',empresa:'Empresa Exemplo'},
    {id:'two',cargo:'AUXILIAR ADMINISTRATIVO',area:'',empresa:'Empresa Exemplo'},
    {id:'demo-publica-91',demoPublica:true,cargo:'Auxiliar Administrativo',area:'',empresa:'Empresa Exemplo'},
    {id:'demo-publica-92',demoPublica:true,cargo:'Auxiliar Administrativo',area:'',empresa:'Empresa Exemplo'},
    {id:'unknown-one',empresa:'Empresa',area:'Logística'},
    {id:'unknown-two',empresa:'Empresa',area:'Logística'}
  ]);
  assert.equal(cards[0].querySelectorAll('.em-r4-similar-open').length,1);
  assert.equal(cards[2].querySelectorAll('.em-r4-similar-open').length,1);
  assert.equal(cards[2].querySelector('.em-r4-similar-open').getAttribute('href'),'/empregamais/?pagina=vaga&id=demo-publica-92');
  assert.equal(cards[4].querySelector('.em-r4-similar'),null);
});

test('the selected panel follows job priority and urgency takes precedence over highlight',()=>{
  const env=fixture(true,true),cards=env.render([{id:'standard'},{id:'featured',destaque:true},{id:'urgent',destaque:true,urgente:true}]);
  const panel=env.doc.getElementById('emJobPanel');
  assert.equal(panel.getAttribute('data-em-priority'),'standard');
  cards[1].querySelector('.em-r4-title-select').click();assert.equal(panel.getAttribute('data-em-priority'),'featured');
  cards[2].querySelector('.em-r4-title-select').click();assert.equal(panel.getAttribute('data-em-priority'),'urgent');
  assert.equal(cards[2].getAttribute('data-em-priority'),'urgent');
  env.render([]);assert.equal(panel.getAttribute('data-em-priority'),null);
});

test('the right panel exposes the full text, sanitizes rich descriptions and combines benefits',()=>{
  const env=fixture(true,true),description='Atendimento ao cliente. '.repeat(80)+'FIM DA DESCRIÇÃO';
  const requirements='Experiência na função. '.repeat(30)+'FIM DOS REQUISITOS';
  env.render([{id:'long',descricao:'<p>'+description+'</p><script>unsafe()</script>',requisitos:requirements,beneficios:'Vale-transporte',beneficiosTags:['Vale-transporte','Plano de saúde'],beneficiosSelecionados:['Vale-alimentação'],sobreEmpresa:'Informação institucional pública.'}]);
  const panel=env.doc.getElementById('emJobPanel');
  for(const text of ['FIM DA DESCRIÇÃO','FIM DOS REQUISITOS','Plano de saúde','Vale-alimentação','Informação institucional pública.','44 horas semanais','Segunda a sexta'])assert(panel.textContent.includes(text),text);
  assert(!panel.textContent.includes('unsafe'));assert.equal(panel.querySelector('script'),null);
  const benefits=panel.querySelectorAll('.em-jb-section').find(section=>section.querySelector('h3').textContent==='Benefícios');
  assert.equal(benefits.textContent.match(/Vale-transporte/g).length,1);
});

test('filtering and pagination cannot leave details from an invisible vacancy selected',()=>{
  const env=fixture(true,true),cards=env.render([{id:'one'},{id:'two'}]);
  cards[1].querySelector('.em-r4-title-select').click();
  cards[1].style.display='none';env.win.filtrarVagas();
  const panel=env.doc.getElementById('emJobPanel');
  assert.equal(panel.getAttribute('data-vaga-id'),'one');
  cards[0].setAttribute('hidden','');env.win.filtrarVagas();
  assert.equal(panel.getAttribute('data-vaga-id'),null);
  assert(panel.textContent.includes('Nenhuma vaga corresponde'));
  assert(cards.every(card=>card.getAttribute('data-em-selected')==='false'));
  cards[0].removeAttribute('hidden');env.win.filtrarVagas();
  assert.equal(panel.getAttribute('data-vaga-id'),'one');
});

test('rerendering retains the selected vacancy by ID and refreshes its details',()=>{
  const env=fixture(true,true),cards=env.render([{id:'one'},{id:'two',cargo:'TÍTULO ANTERIOR'}]);
  cards[1].querySelector('.em-r4-title-select').click();
  const updated=env.render([{id:'two',cargo:'TÍTULO ATUALIZADO',descricao:'Descrição atualizada.'},{id:'one'}]);
  const panel=env.doc.getElementById('emJobPanel');
  assert.equal(panel.getAttribute('data-vaga-id'),'two');assert(panel.textContent.includes('TÍTULO ATUALIZADO'));
  assert(!panel.textContent.includes('TÍTULO ANTERIOR'));assert(panel.textContent.includes('Descrição atualizada.'));
  assert.equal(updated[0].getAttribute('data-em-selected'),'true');
});

test('panel applications use the selected real vacancy and saved state stays synchronized',()=>{
  const env=fixture(true,true),cards=env.render([{id:'one'},{id:'two'}]);
  cards[1].querySelector('.em-r4-title-select').click();
  const panel=env.doc.getElementById('emJobPanel'),applyButtons=panel.querySelectorAll('.em-jb-apply');
  assert.equal(applyButtons.length,2);
  applyButtons.forEach(button=>button.click());
  assert.deepEqual(env.contacts,['two','two']);assert.deepEqual(env.routes,[]);
  panel.querySelector('.em-jb-save').click();
  assert.equal(cards[1].__emJobEntry.save.getAttribute('aria-pressed'),'true');
  assert.equal(panel.querySelector('.em-jb-save').getAttribute('aria-pressed'),'true');
  panel.querySelector('.em-jb-save').click();
  assert.equal(cards[1].__emJobEntry.save.getAttribute('aria-pressed'),'false');
  delete env.win.abrirContatoExternoVaga;
  panel.querySelector('.em-jb-apply-bottom').click();
  assert.deepEqual(env.applications,[{id:'two',originalButton:true}]);
});

test('the inline panel protects confidential identity and prevents applications to demonstrations',()=>{
  const env=fixture(true,true);
  env.render([{id:'demo-publica-99',demoPublica:true,destaque:true,confidencial:true,empresa:'IDENTIDADE PRIVADA',sobreEmpresa:'DADOS PRIVADOS DA EMPRESA'}]);
  const panel=env.doc.getElementById('emJobPanel');
  assert(panel.textContent.includes('Empresa confidencial'));
  assert(!panel.textContent.includes('IDENTIDADE PRIVADA'));assert(!panel.textContent.includes('DADOS PRIVADOS'));
  assert.equal(panel.querySelector('img'),null);
  panel.querySelectorAll('.em-jb-apply').forEach(button=>button.click());
  assert.equal(env.messages.length,2);assert.deepEqual(env.contacts,[]);assert.deepEqual(env.applications,[]);
  assert(panel.querySelector('.em-jb-demo').textContent.includes('não recebe candidaturas reais'));
});

test('mobile opens one vacancy and returns to the same list position without a scroll lock',()=>{
  const env=fixture(true,true);env.win.innerWidth=390;env.win.scrollY=680;
  const cards=env.render([{id:'one'},{id:'two'}]),root=env.doc.getElementById('emJobBrowser'),panel=env.doc.getElementById('emJobPanel');
  assert.equal(root.getAttribute('data-view'),'list');assert.equal(panel.getAttribute('data-vaga-id'),null);
  const button=cards[1].querySelector('.em-r4-title-select');button.click();
  assert.equal(root.getAttribute('data-view'),'details');assert.equal(panel.getAttribute('data-vaga-id'),'two');
  assert.equal(panel.scrolledIntoView,true);env.win.scrollY=900;
  panel.querySelector('.em-jb-back').click();
  assert.equal(root.getAttribute('data-view'),'list');assert.equal(env.win.scrollY,680);
  assert.equal(env.doc.activeElement,button);assert.deepEqual(env.list.children,cards);
  assert.equal(env.doc.body.style.overflow,undefined);
});

test('the browser preserves real filter fields and allows selecting cards without hijacking their buttons',()=>{
  const env=fixture(true,true),cards=env.render([{id:'one'},{id:'two'}]);
  const filters=env.doc.getElementById('emJobBrowserFilters');
  assert.equal(env.sidebar.parentNode,filters);assert.equal(env.doc.getElementById('filtroPalavra'),env.filterInput);
  env.filterInput.value='Analista';env.win.alternarFiltrosMobile();assert.equal(filters.open,true);
  env.win.alternarFiltrosMobile();assert.equal(filters.open,false);
  env.win.abrirFiltrosEFocar('filtroPalavra');assert.equal(filters.open,true);assert.equal(env.filterInput.value,'Analista');
  cards[1].fire('click',{target:cards[1]});
  assert.equal(env.doc.getElementById('emJobPanel').getAttribute('data-vaga-id'),'two');
  cards[0].fire('click',{target:cards[0].querySelector('.em-r4-title-select')});
  assert.equal(env.doc.getElementById('emJobPanel').getAttribute('data-vaga-id'),'two');
});
test('asynchronous pagination updates selection once per animation frame',()=>{
  const env=fixture(true,true,true),cards=env.render([{id:'one'},{id:'two'}]);
  cards[1].querySelector('.em-r4-title-select').click();
  const observer=env.observers[0];
  assert.equal(observer.target,env.list);assert.deepEqual(observer.options.attributeFilter,['style','hidden']);
  cards[1].style.display='none';observer.callback([]);observer.callback([]);
  assert.equal(env.frames.length,1);
  env.frames.shift()();
  assert.equal(env.doc.getElementById('emJobPanel').getAttribute('data-vaga-id'),'one');
});




test('vacancy tabs switch content in place and compare actual listed jobs',()=>{
 const env=fixture(true,true);
 env.render([{id:'one',sobreEmpresa:'Empresa com atuação regional.'},{id:'two',salario:'R$ 4.000,00'}]);
 const panel=env.doc.getElementById('emJobPanel'), tabs=panel.querySelectorAll('.em-jb-tab');
 assert.equal(tabs.length,4);
 const views=panel.querySelectorAll('.em-jb-body');
 assert.equal(views[0].hidden,false); assert.equal(views[1].hidden,true);
 tabs[1].click(); assert.equal(views[0].hidden,true);assert.equal(views[1].hidden,false);
 assert.match(views[1].textContent,/Empresa com atuação regional/);
 tabs[2].click();assert.match(views[2].textContent,/Ainda não há avaliações/);
 tabs[3].click();assert.equal(tabs[3].getAttribute('aria-selected'),'true');assert.equal(views[3].hidden,false);
 assert.match(views[3].textContent,/4.000,00/);
 assert.equal(env.routes.length,0);
});


test('essential facts appear once in the header while additional details remain available',()=>{
 const env=fixture(true,true);env.render([{id:'one',area:'Administração',escolaridade:'Ensino médio',experiencia:'Desejável'}]);
 const panel=env.doc.getElementById('emJobPanel'),body=panel.querySelector('.em-jb-body');
 const primary=panel.querySelector('.em-jb-header-meta'),extra=body.querySelector('.em-jb-extra');
 assert.equal(primary.children.length,4);
 assert.equal(panel.querySelectorAll('.em-jb-header-pay').length,1);
 assert.equal(body.querySelector('.em-jb-pay'),null);
 assert(extra);assert.equal(extra.tagName,'DETAILS');assert.equal(extra.getAttribute('open'),null);
 assert.match(extra.textContent,/Horário/);assert.match(extra.textContent,/Experiência/);
 assert.match(extra.textContent,/Jornada/);
 assert(!primary.textContent.includes('Escolaridade'));
});

test('whole cards select a vacancy and clearly mark only the open job',()=>{
 const env=fixture(true,true),cards=env.render([{id:'one',cargo:'ATENDENTE'},{id:'two',cargo:'AUXILIAR',destaque:true}]);
 for(const card of cards){assert.equal(card.querySelector('.em-r4-details'),null);assert.equal(card.querySelector('.em-lista-ver'),null);}
 cards[1].fire('click');
 const panel=env.doc.getElementById('emJobPanel');
 assert.equal(panel.getAttribute('data-vaga-id'),'two');
 assert.equal(panel.querySelector('.em-jb-context-title').textContent,'AUXILIAR');
 assert.equal(cards[1].querySelector('.em-r4-open-state').getAttribute('aria-hidden'),'false');
 assert.equal(cards[0].querySelector('.em-r4-open-state').getAttribute('aria-hidden'),'true');
 assert.equal(cards[1].querySelector('.em-r4-title-select').getAttribute('aria-current'),'true');
 cards[0].fire('click');
 assert.equal(panel.getAttribute('data-vaga-id'),'one');
 assert.equal(cards[1].querySelector('.em-r4-open-state').getAttribute('aria-hidden'),'true');
 assert.equal(cards[0].querySelector('.em-r4-open-state').getAttribute('aria-hidden'),'false');
 assert.deepEqual(env.routes,[]);
});

test('locating the open job returns to the current card without resetting its details',()=>{
 const env=fixture(true,true),cards=env.render([{id:'one'},{id:'two'}]);
 cards[1].fire('click');
 const panel=env.doc.getElementById('emJobPanel');panel.scrollTop=190;
 panel.querySelector('.em-jb-locate').click();
 assert.equal(cards[1].scrolledIntoView,true);
 assert.deepEqual(cards[1].scrollOptions,{block:'nearest',inline:'nearest',behavior:'auto'});
 assert.equal(env.doc.activeElement,cards[1].querySelector('.em-r4-title-select'));
 assert.equal(panel.getAttribute('data-vaga-id'),'two');assert.equal(panel.scrollTop,190);
 const refreshed=env.render([{id:'one'},{id:'two',cargo:'CARGO ATUALIZADO'}]);
 panel.querySelector('.em-jb-locate').click();
 assert.equal(refreshed[1].scrolledIntoView,true);
 assert.equal(env.doc.activeElement,refreshed[1].querySelector('.em-r4-title-select'));
 assert.equal(panel.querySelector('.em-jb-context-title').textContent,'CARGO ATUALIZADO');
});

test('mobile can locate the open job in the list and retain its selection',()=>{
 const env=fixture(true,true);env.win.innerWidth=600;
 const cards=env.render([{id:'one'},{id:'two'}]);cards[1].fire('click');
 const root=env.doc.getElementById('emJobBrowser'),panel=env.doc.getElementById('emJobPanel');
 assert.equal(root.getAttribute('data-view'),'details');
 panel.querySelector('.em-jb-locate').click();
 assert.equal(root.getAttribute('data-view'),'list');assert.equal(cards[1].scrolledIntoView,true);
 assert.equal(env.doc.activeElement,cards[1].querySelector('.em-r4-title-select'));
 assert.equal(cards[1].getAttribute('data-em-selected'),'true');
 assert.equal(panel.getAttribute('data-vaga-id'),'two');assert.equal(env.doc.body.style.overflow,undefined);
});

test('verification explanations open on hover and focus, stay reachable, and close with Escape or outside clicks',async()=>{
 const env=fixture(true,true),cards=env.render([{id:'demo-publica-91',demoPublica:true,empresa:'Postos Ipiranga (Demo)'}]);
 const seal=cards[0].querySelector('.em-company-verification');
 seal.fire('mouseenter');
 const tip=env.doc.getElementById('emCompanyVerificationCard');
 assert(tip);assert.equal(tip.hidden,false);assert.equal(tip.getAttribute('role'),'tooltip');
 assert.match(tip.textContent,/Demonstração/);assert.match(tip.textContent,/sem vínculo/);
 assert.equal(seal.getAttribute('aria-expanded'),'true');
 seal.fire('mouseleave');tip.fire('mouseenter');
 await new Promise(resolve=>setTimeout(resolve,180));assert.equal(tip.hidden,false);
 const escape={key:'Escape',preventDefault(){},stopPropagation(){}};
 env.listeners.keydown.forEach(handler=>handler(escape));
 assert.equal(tip.hidden,true);assert.equal(seal.getAttribute('aria-expanded'),'false');
 seal.focus();seal.fire('focus');assert.equal(tip.hidden,false);
 env.listeners.click.forEach(handler=>handler({target:env.doc.body}));
 assert.equal(tip.hidden,true);assert.deepEqual(env.routes,[]);
});

test('the verification button supports touch without navigating or changing the selected vacancy',()=>{
 const env=fixture(true,true);env.win.innerWidth=390;
 const cards=env.render([{id:'one'},{id:'demo-publica-92',demoPublica:true,empresa:'Carrefour (Demo)'}]);
 cards[1].querySelector('.em-r4-title-select').click();
 const panel=env.doc.getElementById('emJobPanel'),seal=panel.querySelector('.em-company-verification');
 seal.click();assert.equal(env.doc.getElementById('emCompanyVerificationCard').hidden,false);
 assert.equal(panel.getAttribute('data-vaga-id'),'demo-publica-92');assert.deepEqual(env.routes,[]);
 env.render([{id:'three'}]);assert.equal(env.doc.getElementById('emCompanyVerificationCard').hidden,true);
});

test('company links use a stable demo profile and expose only that company public demonstration jobs',()=>{
 const env=fixture(true,true),page=env.doc.createElement('main');page.id='pagina-empresa-publica';env.doc.body.appendChild(page);
 const job=env.win.vagasPadrao.find(job=>job.empresa==='Postos Ipiranga (Demo)');
 const cards=env.render([job]);
 const company=cards[0].querySelector('.em-company-profile-link');
 assert.equal(cards[0].__emJobEntry.info.company,job.empresa);
 assert.match(company.getAttribute('href'),/id=demo-empresa-postos-ipiranga/);
 company.click();assert.deepEqual(env.routes,[['empresa-publica','demo-empresa-postos-ipiranga']]);
 env.win.abrirPerfilEmpresaPublica('demo-empresa-postos-ipiranga');
 const profile=env.doc.getElementById('emDemoCompanyProfile');
 assert(profile);assert.equal(page.getAttribute('data-em-demo-profile'),'true');
 assert.match(profile.textContent,/Postos Ipiranga \(Demo\)/);assert.match(profile.textContent,/fictícias/);
 assert(!profile.textContent.includes('Drogaria Araujo'));assert(!profile.textContent.includes('Empresa confidencial'));
 const expected=env.win.vagasPadrao.filter(job=>!job.confidencial&&job.empresa==='Postos Ipiranga (Demo)');
 assert.equal(profile.querySelectorAll('.em-dc-job').length,expected.length);
 profile.querySelector('.em-dc-job a').click();assert.deepEqual(env.routes.at(-1),['vaga',expected[0].id]);
});

test('direct demo company URLs render their profile without an account or remote calls',()=>{
 const shown=[];
 const env=fixture(true,false,false,(win,doc)=>{
  win.location.search='?pagina=empresa-publica&id=demo-empresa-carrefour';
  win.mostrarPagina=name=>{shown.push(name);doc.getElementById('pagina-home').className='';};
  const page=doc.createElement('main');page.id='pagina-empresa-publica';doc.body.appendChild(page);
 });
 assert.deepEqual(shown,['empresa-publica']);
 assert.match(env.doc.getElementById('emDemoCompanyTitle').textContent,/Carrefour/);
 assert(env.doc.getElementById('emDemoCompanyProfile').querySelector('.em-company-verification'));
});

test('registered company links retain the existing profile renderer and confidential jobs reveal no identity',()=>{
 const existing=[];const record={cnpj:'12345678000190',verificada:true};
 const env=fixture(true,true,false,win=>{
  win.empresaDaVagaEM=job=>job.empresaCnpj===record.cnpj?record:null;
  win.empresaEstaVerificada=company=>company.verificada;
  win.empresaPodeTerPerfilPublicoEM=()=>true;
  win.abrirPerfilEmpresaPublica=id=>existing.push(id);
 });
 const cards=env.render([{id:'real',empresaCnpj:record.cnpj},{id:'private',demoPublica:true,confidencial:true,empresa:'IDENTIDADE PRIVADA'}]);
 const seal=cards[0].querySelector('.em-company-verification');assert(seal);seal.fire('mouseenter');
 assert(!env.doc.getElementById('emCompanyVerificationCard').textContent.includes('Demonstração:'));
 cards[0].querySelector('.em-company-profile-link').click();assert.deepEqual(env.routes,[['empresa-publica',record.cnpj]]);
 env.win.abrirPerfilEmpresaPublica(record.cnpj);assert.deepEqual(existing,[record.cnpj]);
 assert.equal(cards[1].querySelector('.em-company-verification'),null);
 assert.equal(cards[1].querySelector('.em-company-profile-link'),null);assert(!cards[1].textContent.includes('IDENTIDADE PRIVADA'));
});

test('opening a company from a fallback summary removes the dialog before navigation',()=>{
 const env=fixture(),card=env.card({id:'demo-publica-93',demoPublica:true,empresa:'Magazine Luiza (Demo)'});
 card.querySelector('.em-r4-title-select').click();
 const dialog=env.doc.getElementById('emRecentJobSummary');assert(dialog.open);
 dialog.querySelector('.em-company-profile-link').click();
 assert.equal(env.doc.getElementById('emRecentJobSummary'),null);
 assert.deepEqual(env.routes,[['empresa-publica','demo-empresa-magazine-luiza']]);
});
