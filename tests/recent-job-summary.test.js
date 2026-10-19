'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const demo = require('../vagas-demo.js');

// Minimal DOM for exercising the real card and modal event handlers without a browser.
function fixture(nativeDialog = true) {
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
    addEventListener(type,handler) { (this.listeners[type] ||= []).push(handler); }
    fire(type,properties={}) {
      const event={target:this,preventDefault(){this.defaultPrevented=true;},stopPropagation(){this.stopped=true;},...properties};
      if(typeof this['on'+type]==='function')this['on'+type](event);
      (this.listeners[type]||[]).forEach(handler=>handler(event));return event;
    }
    click() { this.fire('click'); }
    focus() { doc.activeElement=this; }
    showModal() { this.open=true; }
    close() { this.open=false;this.fire('close'); }
    getBoundingClientRect() { return {left:100,top:100,right:700,bottom:600}; }
  }
  doc.createElement=tag=>{const node=new Element(tag);if(tag==='dialog'&&!nativeDialog)node.showModal=undefined;return node;};
  doc.body=doc.createElement('body');
  doc.getElementById=id=>doc.body.querySelector('#'+id);
  const home=doc.createElement('main');home.id='pagina-home';home.className='ativa';doc.body.appendChild(home);
  const routes=[],applications=[],logoRequests=[];
  const make=(tag,className,text)=>{const el=doc.createElement(tag);el.className=className;if(text!=null)el.textContent=text;return el;};
  const win={
    document:doc,location:{search:'?pagina=home',pathname:'/empregamais/'},vagasPadrao:[],
    addEventListener(){},renderizarVagas(){},irPara:(...args)=>routes.push(args),
    vagaEhConfidencialEM:job=>!!job.confidencial,vagaEstaSalva:()=>false,
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
  demo.instalar(win);
  function card(overrides={}) {
    const job={id:'real-job',cargo:'ANALISTA DE RECURSOS HUMANOS',empresa:'Empresa Exemplo',cidade:'Contagem',uf:'MG',modalidade:'Híbrido',contrato:'CLT',salario:'R$ 3.800,00',dataPublicacao:'2026-10-19',jornada:'44 horas semanais',horario:'Segunda a sexta',descricao:'Recrutamento e seleção.',requisitos:'Experiência com recrutamento.',beneficios:'Vale-transporte; vale-alimentação.',...overrides};
    const node=win.criarCardVaga(job,false);home.appendChild(node);return node;
  }
  return {doc,win,card,routes,applications,logoRequests};
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
  assert.equal(badge.parentNode,featured.querySelector('.em-r4-title').parentNode);
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
