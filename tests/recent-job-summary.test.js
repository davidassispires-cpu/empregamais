'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const demo = require('../vagas-demo.js');

// Minimal DOM for exercising the real card and modal event handlers without a browser.
function fixture(nativeDialog = true, withBrowser = false, withObserver = false) {
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
    scrollIntoView() { this.scrolledIntoView=true; }
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

test('only featured public vacancies display a logo, without leaving a placeholder on other cards',()=>{
  const env=fixture();
  const normal=env.card(),urgent=env.card({id:'urgent',urgente:true}),featured=env.card({id:'featured',destaque:true});
  assert.equal(normal.querySelector('.em-r4-logo'),null);
  assert.equal(urgent.querySelector('.em-r4-logo'),null);
  assert(featured.querySelector('.em-r4-logo'));
  assert.deepEqual(env.logoRequests,['featured']);
  const badge=featured.querySelector('.em-r4-status');
  assert.equal(badge.textContent,'Destaque');
  assert.equal(badge.getAttribute('data-kind'),'featured');
  const facts=featured.querySelector('.em-r4-facts');
  assert.equal(badge.parentNode,facts);
  assert.equal(facts.firstChild,badge);
  assert.equal(facts.children[1],featured.querySelector('.em-r4-location'));
  for(const card of [normal,urgent,featured]){
    const copy=card.querySelector('.em-r4-copy');
    assert.equal(copy.children[0],card.querySelector('.em-r4-title-line'));
    assert.equal(copy.children[1],card.querySelector('.em-r4-company'));
    assert.equal(card.querySelector('.em-r4-title-line').querySelector('.em-r4-status'),null);
  }
});

test('Ver detalhes opens a summary with the vacancy facts and content without navigating',()=>{
  const env=fixture(),card=env.card(),details=card.querySelector('.em-r4-details');
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
  const env=fixture(),card=env.card(),details=card.querySelector('.em-r4-details');
  details.click();env.doc.getElementById('emRecentJobSummary').querySelector('.em-js-full').click();
  assert.deepEqual(env.routes,[['vaga','real-job']]);
  assert.equal(env.doc.getElementById('emRecentJobSummary'),null);
  details.click();env.doc.getElementById('emRecentJobSummary').querySelector('.em-js-apply').click();
  assert.deepEqual(env.applications,[{id:'real-job',originalButton:true}]);
  assert.equal(env.doc.getElementById('emRecentJobSummary'),null);
});

test('summary keyboard navigation contains focus and Escape closes without leaving an overlay',()=>{
  const env=fixture(),card=env.card(),details=card.querySelector('.em-r4-details');details.click();
  const dialog=env.doc.getElementById('emRecentJobSummary'),close=dialog.querySelector('.em-js-close'),apply=dialog.querySelector('.em-js-apply');
  assert.equal(env.doc.activeElement,close);
  assert(dialog.fire('keydown',{key:'Tab',shiftKey:true}).defaultPrevented);assert.equal(env.doc.activeElement,apply);
  assert(dialog.fire('keydown',{key:'Tab',shiftKey:false}).defaultPrevented);assert.equal(env.doc.activeElement,close);
  dialog.fire('keydown',{key:'Escape'});
  assert.equal(env.doc.getElementById('emRecentJobSummary'),null);assert.equal(env.doc.activeElement,details);
});

test('reopening summaries replaces the previous dialog and the fallback backdrop closes cleanly',()=>{
  const env=fixture(false),one=env.card({id:'one'}),two=env.card({id:'two',cargo:'SEGUNDA VAGA'});
  const first=one.querySelector('.em-r4-details'),second=two.querySelector('.em-r4-details');first.click();second.click();
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
  card.querySelector('.em-r4-details').click();const dialog=env.doc.getElementById('emRecentJobSummary');
  assert(dialog.textContent.includes('Empresa confidencial'));assert(!dialog.textContent.includes('Identidade privada'));
});

test('HTML descriptions remain inert plain text and demo summaries explain their fictional identity',()=>{
  const env=fixture(),card=env.card({id:'demo-publica-99',demoPublica:true,descricao:'<p>Atendimento ao público.</p><script>unsafe()</script><img src=x onerror=unsafe()>'});
  card.querySelector('.em-r4-details').click();const dialog=env.doc.getElementById('emRecentJobSummary');
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
  assert.equal(cards[1].querySelector('.em-r4-details').getAttribute('aria-expanded'),'true');
  assert.equal(cards[1].querySelector('.em-r4-details').getAttribute('aria-haspopup'),null);
  assert.equal(env.doc.activeElement,env.doc.getElementById('emJobPanelTitle'));
  assert.deepEqual(env.routes,[]);
  assert.equal(env.doc.body.querySelector('dialog'),null);
});

test('the right panel exposes the full text, sanitizes rich descriptions and combines benefits',()=>{
  const env=fixture(true,true),description='Atendimento ao cliente. '.repeat(80)+'FIM DA DESCRIÇÃO';
  const requirements='Experiência na função. '.repeat(30)+'FIM DOS REQUISITOS';
  env.render([{id:'long',descricao:'<p>'+description+'</p><script>unsafe()</script>',requisitos:requirements,beneficios:'Vale-transporte',beneficiosTags:['Vale-transporte','Plano de saúde'],beneficiosSelecionados:['Vale-alimentação'],sobreEmpresa:'Informação institucional pública.'}]);
  const panel=env.doc.getElementById('emJobPanel');
  for(const text of ['FIM DA DESCRIÇÃO','FIM DOS REQUISITOS','Plano de saúde','Vale-alimentação','Informação institucional pública.','44 horas semanais','Segunda a sexta'])assert(panel.textContent.includes(text),text);
  assert(!panel.textContent.includes('unsafe'));assert.equal(panel.querySelector('script'),null);
  const benefits=panel.querySelectorAll('.em-jb-section').find(section=>section.firstChild.textContent==='Benefícios');
  assert.equal(benefits.textContent.match(/Vale-transporte/g).length,1);
});

test('filtering and pagination cannot leave details from an invisible vacancy selected',()=>{
  const env=fixture(true,true),cards=env.render([{id:'one'},{id:'two'}]);
  cards[1].querySelector('.em-r4-details').click();
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
  cards[1].querySelector('.em-r4-details').click();
  const updated=env.render([{id:'two',cargo:'TÍTULO ATUALIZADO',descricao:'Descrição atualizada.'},{id:'one'}]);
  const panel=env.doc.getElementById('emJobPanel');
  assert.equal(panel.getAttribute('data-vaga-id'),'two');assert(panel.textContent.includes('TÍTULO ATUALIZADO'));
  assert(!panel.textContent.includes('TÍTULO ANTERIOR'));assert(panel.textContent.includes('Descrição atualizada.'));
  assert.equal(updated[0].getAttribute('data-em-selected'),'true');
});

test('panel applications use the selected real vacancy and saved state stays synchronized',()=>{
  const env=fixture(true,true),cards=env.render([{id:'one'},{id:'two'}]);
  cards[1].querySelector('.em-r4-details').click();
  const panel=env.doc.getElementById('emJobPanel');panel.querySelector('.em-jb-apply').click();
  assert.deepEqual(env.contacts,['two']);assert.deepEqual(env.routes,[]);
  panel.querySelector('.em-jb-save').click();
  assert.equal(cards[1].querySelector('.em-r4-save').getAttribute('aria-pressed'),'true');
  assert.equal(panel.querySelector('.em-jb-save').getAttribute('aria-pressed'),'true');
  panel.querySelector('.em-jb-save').click();
  assert.equal(cards[1].querySelector('.em-r4-save').getAttribute('aria-pressed'),'false');
  delete env.win.abrirContatoExternoVaga;
  panel.querySelector('.em-jb-apply').click();
  assert.deepEqual(env.applications,[{id:'two',originalButton:true}]);
});

test('the inline panel protects confidential identity and prevents applications to demonstrations',()=>{
  const env=fixture(true,true);
  env.render([{id:'demo-publica-99',demoPublica:true,destaque:true,confidencial:true,empresa:'IDENTIDADE PRIVADA',sobreEmpresa:'DADOS PRIVADOS DA EMPRESA'}]);
  const panel=env.doc.getElementById('emJobPanel');
  assert(panel.textContent.includes('Empresa confidencial'));
  assert(!panel.textContent.includes('IDENTIDADE PRIVADA'));assert(!panel.textContent.includes('DADOS PRIVADOS'));
  assert.equal(panel.querySelector('img'),null);
  panel.querySelector('.em-jb-apply').click();
  assert.equal(env.messages.length,1);assert.deepEqual(env.contacts,[]);assert.deepEqual(env.applications,[]);
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
  cards[0].fire('click',{target:cards[0].querySelector('.em-r4-save')});
  assert.equal(env.doc.getElementById('emJobPanel').getAttribute('data-vaga-id'),'two');
});
test('asynchronous pagination updates selection once per animation frame',()=>{
  const env=fixture(true,true,true),cards=env.render([{id:'one'},{id:'two'}]);
  cards[1].querySelector('.em-r4-details').click();
  const observer=env.observers[0];
  assert.equal(observer.target,env.list);assert.deepEqual(observer.options.attributeFilter,['style','hidden']);
  cards[1].style.display='none';observer.callback([]);observer.callback([]);
  assert.equal(env.frames.length,1);
  env.frames.shift()();
  assert.equal(env.doc.getElementById('emJobPanel').getAttribute('data-vaga-id'),'one');
});


