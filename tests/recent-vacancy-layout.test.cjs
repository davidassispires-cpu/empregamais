'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require.resolve('../vagas-demo.js'),'utf8');
class Element{
 constructor(tag='div',className='',text=''){this.tagName=tag.toUpperCase();this.className=className;this.children=[];this.attributes={};this._text=text;const self=this;this.classList={contains:name=>self.className.split(/\s+/).includes(name),add(...names){self.className=Array.from(new Set(self.className.split(/\s+/).filter(Boolean).concat(names))).join(' ');}};}
 appendChild(child){child.remove();this.children.push(child);child.parentNode=this;return child;}
 remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(child=>child!==this);this.parentNode=null;}
 replaceChildren(...children){this.children.forEach(child=>{child.parentNode=null;});this.children=[];this._text='';children.forEach(child=>this.appendChild(child));}
 set textContent(value){this.replaceChildren();this._text=String(value);}get textContent(){return this._text+this.children.map(child=>child.textContent).join('');}
 set innerHTML(value){this.replaceChildren();this.html=value;}get innerHTML(){return this.html||'';}
 setAttribute(key,value){this.attributes[key]=String(value);}getAttribute(key){return this.attributes[key]||null;}
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
 querySelectorAll(selector){
  const simple=(el,token)=>token.startsWith('.')?el.classList.contains(token.slice(1)):el.tagName===token.toUpperCase();
  const match=(el,tokens)=>{if(!simple(el,tokens.at(-1)))return false;let parent=el.parentNode;for(let i=tokens.length-2;i>=0;i--){while(parent&&!simple(parent,tokens[i]))parent=parent.parentNode;if(!parent)return false;parent=parent.parentNode;}return true;};
  const selectors=selector.split(',').map(item=>item.trim().split(/\s+/)),result=[];
  const walk=parent=>parent.children.forEach(child=>{if(selectors.some(tokens=>match(child,tokens)))result.push(child);walk(child);});walk(this);return result;
 }
}
function fixture(overrides={}){
 const job={id:'real-1',empresa:'Empresa Real',cidade:'Contagem',uf:'MG',modalidade:'Presencial',contrato:'CLT',dataPublicacao:'2026-10-19',...overrides};
 const card=new Element('article','vaga-card em-lista-final');card.setAttribute('data-id',job.id);card.setAttribute('data-empresa',job.empresa);card.setAttribute('data-cidade',job.cidade);
 const header=card.appendChild(new Element('div','em-lista-cab')),company=header.appendChild(new Element('div','em-lista-empresa'));
 company.appendChild(new Element('span','',job.empresa));company.onclick=()=>calls.push('company');
 const logo=header.appendChild(new Element('div','em-lista-logo'));const image=logo.appendChild(new Element('img'));image.setAttribute('src','https://example.test/logo.png');
 card.appendChild(new Element('h3','em-lista-titulo','ASSISTENTE ADMINISTRATIVO'));
 const meta=card.appendChild(new Element('div','em-lista-meta')),place=meta.appendChild(new Element('span','em-lista-meta-item'));place.appendChild(new Element('b','','Contagem/MG'));
 const salary=meta.appendChild(new Element('div','em-lista-salario'));salary.appendChild(new Element('strong','','R$ 2.500,00'));
 card.appendChild(new Element('p','em-lista-resumo','Long description that remains available on the details page.'));
 const actions=card.appendChild(new Element('div','em-lista-acoes')),apply=actions.appendChild(new Element('button','em-lista-ver','Candidatar-se'));
 const save=card.appendChild(new Element('button','em-lista-fav','Salvar vaga')),calls=[];let saved=false;
 apply.onclick=()=>calls.push('apply');save.onclick=()=>{calls.push('save');saved=!saved;};
 const home=new Element('section','ativa');
 const context={doc:{getElementById:()=>home,createElement:tag=>new Element(tag)},win:{vagaEstaSalva:()=>saved,irPara:(route,id)=>calls.push([route,id]),location:{pathname:'/portal/'}},enabled:value=>value===true,isDemo:value=>value.demo===true};
 vm.createContext(context);vm.runInContext(source.slice(source.indexOf('    function recentCard('),source.indexOf('    var makeCard =')),context);
 return {job,card,company,image,apply,save,calls,home,render:featured=>context.recentCard(card,job,featured)};
}
const click={preventDefault(){},stopPropagation(){}};
test('the recent card reuses the actual application, company and saved-job handlers',()=>{
 const f=fixture();f.render(false);
 assert.equal(f.card.querySelector('.em-r4-apply'),f.apply);f.apply.onclick(click);assert.deepEqual(f.calls,['apply']);
 assert.equal(f.card.querySelector('.em-r4-company'),f.company);f.company.onclick();assert.equal(f.calls.at(-1),'company');
 f.card.querySelector('.em-r4-details').onclick(click);assert.equal(JSON.stringify(f.calls.at(-1)),JSON.stringify(['vaga','real-1']));
 f.save.onclick(click);assert.equal(f.calls.filter(call=>call==='save').length,1);assert.equal(f.save.getAttribute('aria-pressed'),'true');
 f.save.onclick(click);assert.equal(f.save.getAttribute('aria-pressed'),'false');
 assert.equal(f.card.getAttribute('data-id'),'real-1');assert.equal(f.card.getAttribute('data-cidade'),'Contagem');
});
test('identity, facts and actions are separate and retain real salary, location and publication',()=>{
 const f=fixture();f.render(false);
 assert(f.card.querySelector('.em-r4-identity'));assert(f.card.querySelector('.em-r4-facts'));assert(f.card.querySelector('.em-r4-actions'));
 assert.equal(f.card.querySelector('.em-r4-logo img'),f.image);
 assert.equal(f.card.querySelector('.em-r4-salary').textContent,'R$ 2.500,00');assert.equal(f.card.querySelector('.em-r4-date').textContent,'Publicada em 19/10/2026');
 assert.equal(f.card.querySelector('.em-r4-location').textContent,'Contagem – MG');assert.equal(f.card.querySelector('.em-r4-modality').textContent,'Presencial');assert.equal(f.card.querySelector('.em-r4-contract').textContent,'CLT');
 assert.equal(f.card.querySelector('.em-lista-resumo'),null);
});
test('confidential jobs expose neither the company logo nor a company profile action',()=>{
 const f=fixture({confidencial:true,empresa:'Private business'});f.render(false);
 assert.equal(f.company.textContent,'Empresa confidencial');assert.equal(f.company.onclick,null);assert.equal(f.card.getAttribute('data-empresa'),'Empresa confidencial');assert.equal(f.card.querySelector('.em-r4-logo img'),null);assert(!f.card.textContent.includes('Private business'));
});
test('a highlighted demo has one quiet status and still identifies itself as a demonstration',()=>{
 const f=fixture({destaque:true,urgente:true,demo:true});f.render(false);
 assert.equal(f.card.querySelectorAll('.em-r4-status').length,1);assert.equal(f.card.querySelector('.em-r4-status').textContent,'Em destaque');assert.match(f.card.querySelector('.em-r4-demo').textContent,/Demonstração/);
});
test('featured carousel cards and cards outside the active home retain their existing presentation',()=>{
 const f=fixture();assert.equal(f.render(true),f.card);assert.equal(f.card.querySelector('.em-r4-identity'),null);
 f.home.className='';f.render(false);assert.equal(f.card.querySelector('.em-r4-identity'),null);
});
test('unavailable dates and salary are never replaced with made-up values',()=>{
 const f=fixture({dataPublicacao:''});f.card.querySelector('.em-lista-salario').remove();f.render(false);
 assert.equal(f.card.querySelector('.em-r4-salary').textContent,'A combinar');assert.match(f.card.querySelector('.em-r4-date').textContent,/não informada/);
});
