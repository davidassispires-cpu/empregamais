'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync(require.resolve('../candidato-demo.js'),'utf8');
function createContext(search,sharedLocal){
 const nativeLocal=sharedLocal||new Map([['real-account','untouched']]),nativeSession=new Map([['empregaMaisPapel','empresa']]);
 const wrap=map=>({getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)});
 const listeners={},calls=[],notice={textContent:''},created=[];
 function element(tag){
  const attrs=new Map(),classes=new Set();
  const el={tagName:tag.toUpperCase(),children:[],parentNode:null,style:{setProperty(){}},
   classList:{contains:c=>classes.has(c),add:c=>classes.add(c),remove:c=>classes.delete(c)},
   setAttribute(k,v){attrs.set(k,String(v));},getAttribute:k=>attrs.get(k)||null,
   querySelector(selector){return selector==='nav'?this.children.find(c=>c.tagName==='NAV')||null:selector.includes('container-')?this.contentHost||null:null;},
   querySelectorAll(){return [];},
   appendChild(child){if(child.parentNode){const list=child.parentNode.children;list.splice(list.indexOf(child),1);}this.children.push(child);child.parentNode=this;return child;},
   prepend(child){this.appendChild(child);this.children.pop();this.children.unshift(child);},
   get firstElementChild(){return this.children[0]||null;},
   get isConnected(){return this.root||!!(this.parentNode&&this.parentNode.isConnected);},
   set innerHTML(html){this.html=html;if(html.includes('<nav'))this.appendChild(element('nav'));}
  };
  created.push(el);return el;
 }
 const pages=new Map(['painel-candidato','candidaturas','premium-candidato','curriculo','perfil','salvas','home','vaga','candidatura'].map(route=>{
  const page=element('div');page.id='pagina-'+route;page.root=true;
  if(route==='painel-candidato'||route==='candidaturas'){page.contentHost=element('div');page.appendChild(page.contentHost);}
  return [route,page];
 }));
 const originalFetch=()=>{calls.push('real-fetch');return Promise.resolve(new Response('{}'))};
 function navigate(url){const next=new URL(url,ctx.location.href);ctx.location.href=next.href;ctx.location.search=next.search;ctx.location.pathname=next.pathname;}
 const ctx={location:{search,href:'https://example.com/'+search,pathname:'/',origin:'https://example.com'},localStorage:wrap(nativeLocal),sessionStorage:wrap(nativeSession),fetch:originalFetch,URLSearchParams,URL,Response,Promise,Map,Date,JSON,Object,btoa:s=>Buffer.from(s,'binary').toString('base64'),setTimeout:fn=>fn(),history:{pushState(a,b,url){navigate(url)},replaceState(a,b,url){navigate(url)}},document:{documentElement:{classList:{add(){}}},head:{appendChild(){}},getElementById(id){return id==='emCandidateDemoNotice'?notice:[...pages.values()].find(p=>p.id===id)||null},createElement:element,querySelectorAll(selector){return selector==='.pagina.ativa'?[...pages.values()].filter(p=>p.classList.contains('ativa')):selector==='#pagina-painel-candidato,#pagina-candidaturas'?[pages.get('painel-candidato'),pages.get('candidaturas')]:[]},addEventListener(type,fn){listeners["document:"+type]=fn;}},addEventListener(type,fn){listeners[type]=fn},abrirRota(route,id){calls.push([route,id])},EmpregaMaisPerfilCloud:{refresh(){throw Error('Real profile refresh must not run')}}};
 ctx.window=ctx;vm.createContext(ctx);vm.runInContext(source,ctx);return {ctx,listeners,calls,nativeLocal,nativeSession,originalFetch,pages,get panel(){return created.find(el=>el.className==='cp-demo-plans');}};
}
for(const route of ['demo-recrutador','painel-empresa','painel-candidato','home']){
 const env=createContext('?pagina='+route);
 assert.equal(env.ctx.fetch,env.originalFetch);
 assert.equal(env.ctx.localStorage.getItem('real-account'),'untouched');
 assert.equal(env.ctx.sessionStorage.getItem('empregaMaisPapel'),'empresa');
 assert.equal(Object.keys(env.listeners).length,0,'Other pages must have no demo behavior');
 assert.equal(env.nativeLocal.size,1);
}
const early=createContext('?pagina=demo-candidato');
early.listeners['document:DOMContentLoaded']();
assert.equal(early.calls[0][0],'painel-candidato','Open before images and fonts finish loading');
const earlyCalls=early.calls.length;
early.listeners.load();
assert.equal(early.calls.length,earlyCalls,'The load fallback must not open a second time');
const env=createContext('?pagina=demo-candidato');
assert.equal(env.ctx.sessionStorage.getItem('empregaMaisPapel'),null,'No demo login during the application startup');
assert.equal(env.nativeSession.get('empregaMaisPapel'),'empresa','The real session must be preserved');
env.ctx.localStorage.setItem('candidatosEmpregaMais','[]');
env.listeners.load();
assert.equal(env.ctx.sessionStorage.getItem('empregaMaisPapel'),'candidato');
assert.equal(env.calls[0][0],'painel-candidato','Reuse the existing candidate route');
const candidates=JSON.parse(env.ctx.localStorage.getItem('candidatosEmpregaMais'));
assert.equal(candidates[0].nome,'Ana Exemplo');
assert.equal(candidates[0].plano_candidato,'basico');
assert.equal(candidates[0].premium_valido_ate,null);
assert.equal(env.panel.parentNode,env.pages.get('painel-candidato').contentHost);
const planLinks=env.panel.querySelector('nav').children;
assert.deepEqual(planLinks.map(link=>link.textContent),['Painel gratuito','Painel Premium']);
assert.equal(planLinks[0].getAttribute('aria-current'),'page');
assert.equal(planLinks[1].getAttribute('aria-current'),null);
assert.equal(env.ctx.carregarCandidaturas().length,2);
assert.equal(env.ctx.carregarVagasPortal().length,2);
const cv=JSON.parse(env.ctx.localStorage.getItem('curriculoEmpregaMais_ana@example.com'));
assert(Buffer.from(cv.dados.split(',')[1],'base64').toString('binary').startsWith('%PDF-1.4'));
env.ctx.irPara('candidaturas');
assert.equal(env.calls.at(-1)[0],'candidaturas');
assert.equal(new URL(env.ctx.location.href).searchParams.get('pagina'),'demo-candidato');
assert.equal(env.panel.parentNode,env.pages.get('candidaturas').contentHost,'The plan selector follows application tabs');
env.ctx.irPara('premium-candidato');
assert.equal(env.panel.parentNode,env.pages.get('premium-candidato'),'Opening Premium must not hide the return to the free demo');
assert.equal(env.pages.get('premium-candidato').firstElementChild,env.panel);
for(const link of planLinks){
 const url=new URL(link.href);
 assert.equal(url.searchParams.get('pagina'),'demo-candidato');
 assert.equal(url.searchParams.get('abaCandidato'),'painel-candidato','Both choices return to the selected plan dashboard');
}
env.ctx.irPara('curriculo');assert.equal(env.calls.at(-1)[0],'curriculo');
env.ctx.irPara('painel-admin');assert.equal(env.calls.at(-1)[0],'painel-candidato');
assert.equal(env.nativeLocal.get('real-account'),'untouched');
assert([...env.nativeLocal.keys()].every(k=>k==='real-account'||k.startsWith('emCandidatePreviewV2:')));

// Switch plans through independent page loads, preserving each demo's edits.
candidates[0].nome='Configuração do gratuito';
env.ctx.localStorage.setItem('candidatosEmpregaMais',JSON.stringify(candidates));
const premium=createContext(new URL(planLinks[1].href).search,env.nativeLocal);
premium.listeners.load();
const premiumProfile=JSON.parse(premium.ctx.localStorage.getItem('candidatosEmpregaMais'))[0];
assert.equal(premiumProfile.plano_candidato,'premium');
assert.ok(Date.parse(premiumProfile.premium_valido_ate)>Date.now());
assert.equal(premiumProfile.nome,'Ana Exemplo','Premium settings stay separate from the free demo');
assert.equal(premium.panel.querySelector('nav').children[1].getAttribute('aria-current'),'page');
const returned=createContext(new URL(premium.panel.querySelector('nav').children[0].href).search,env.nativeLocal);
returned.listeners.load();
const returnedProfile=JSON.parse(returned.ctx.localStorage.getItem('candidatosEmpregaMais'))[0];
assert.equal(returnedProfile.plano_candidato,'basico');
assert.equal(returnedProfile.premium_valido_ate,null);
assert.equal(returnedProfile.nome,'Configuração do gratuito');

const deep=createContext('?pagina=demo-candidato&planoCandidato=premium&abaCandidato=premium-candidato&id=demo-1');
deep.listeners.load();
assert.equal(deep.panel.parentNode,deep.pages.get('premium-candidato'),'A direct Premium tab link also offers both dashboards');
assert.equal(new URL(deep.panel.querySelector('nav').children[0].href).searchParams.has('id'),false);
deep.ctx.history.replaceState({},'','?pagina=demo-candidato&planoCandidato=premium&abaCandidato=candidaturas');
deep.listeners.popstate();
assert.equal(deep.panel.parentNode,deep.pages.get('candidaturas').contentHost,'Browser back/forward keeps the selector in the active tab');
(async()=>{
 const response=await env.ctx.fetch('https://example.supabase.co/rest/v1/candidatos?user_id=eq.demo');
 assert.equal((await response.json())[0].nome,'Ana Exemplo');
 await env.ctx.EmpregaMaisPerfilCloud.refresh();
 assert(!env.calls.includes('real-fetch'));
 console.log('PASS: existing company and production pages untouched; real session preserved; candidate demo uses existing routes, isolated sample data, resume and local backend responses.');
})().catch(e=>{console.error(e);process.exitCode=1;});

