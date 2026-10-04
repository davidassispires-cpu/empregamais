/* EMPREGAMAIS - MINHAS VAGAS + NAVEGACAO RECRUTADOR V3 */
(function(){
'use strict';

function empresaLogadaEM(){
 try{
  if(typeof window.papelAtual==='function')return window.papelAtual()==='empresa';
 }catch(_){}
 return document.body.classList.contains('sessao-empresa')||document.body.classList.contains('tem-empresa');
}

function carregarCoreMinhasVagasEM(){
 if(document.querySelector('script[data-em-minhas-vagas-core]'))return;
 const s=document.createElement('script');
 s.src='./assets/js/minhas-vagas-gestao-core.js?v=2-20260928';
 s.async=false;
 s.dataset.emMinhasVagasCore='1';
 document.head.appendChild(s);
}

function carregarRefinoVisaoGeralEM(){
 if(document.querySelector('script[data-em-visao-geral-refino]'))return;
 const s=document.createElement('script');
 s.src='./assets/js/visao-geral-refino.js?v=1-20260928';
 s.async=false;
 s.dataset.emVisaoGeralRefino='1';
 document.head.appendChild(s);
}

function inserirCssNavegacaoEM(){
 if(document.getElementById('emNavRecrutadorV2Css'))return;
 const st=document.createElement('style');
 st.id='emNavRecrutadorV2Css';
 st.textContent=`
 body.sessao-empresa .menu-empresa-logada,
 body.tem-empresa .menu-empresa-logada,
 body.sessao-empresa .menu-publico,
 body.tem-empresa .menu-publico{display:none!important}
 body.sessao-empresa .topo-inner,
 body.tem-empresa .topo-inner{justify-content:space-between!important}
 `;
 document.head.appendChild(st);
}

function iconeMaletaEM(){
 return '<span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"/></svg></span>';
}

function ajustarNavegacaoRecrutadorEM(){
 if(!empresaLogadaEM())return;
 inserirCssNavegacaoEM();
 const grupo=document.querySelector('#pagina-painel-empresa .emp-side-group');
 if(!grupo)return;
 const botoes=[...grupo.querySelectorAll(':scope > button')];
 const texto=b=>(b.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
 const btnProcesso=botoes.find(b=>texto(b).startsWith('processo seletivo'));
 const btnMinhas=botoes.find(b=>texto(b).startsWith('minhas vagas'));
 const btnCandidatos=botoes.find(b=>texto(b).startsWith('candidatos'));
 const btnMensagens=botoes.find(b=>texto(b).startsWith('mensagens'));
 const jaMinhas=[...grupo.querySelectorAll(':scope > button')].some(b=>texto(b).startsWith('minhas vagas'));

 if(btnMinhas){
  btnMinhas.setAttribute('onclick',"sessionStorage.removeItem('vagaCandidatosSelecionada');irPara('vagas-empresa')");
 }
 if(btnProcesso){
  btnProcesso.setAttribute('onclick',"if(typeof abrirCentralProcessosEmpresaEM==='function'){abrirCentralProcessosEmpresaEM()}else{sessionStorage.removeItem('vagaCandidatosSelecionada');irPara('candidatos-empresa')}");
  if(!jaMinhas){
   const b=document.createElement('button');
   b.type='button';
   b.className='em-side-minhas-vagas';
   b.setAttribute('onclick',"irPara('vagas-empresa')");
   b.innerHTML=iconeMaletaEM()+'Minhas vagas';
   grupo.insertBefore(b,btnProcesso);
  }
 }
 if(btnCandidatos){
  btnCandidatos.setAttribute('onclick',"sessionStorage.setItem('filtroCandidatos','Todos');sessionStorage.removeItem('vagaCandidatosSelecionada');irPara('candidatos-empresa')");
 }
 if(btnMensagens)btnMensagens.remove();

 const rota=new URLSearchParams(location.search).get('pagina')||'painel-empresa';
 [...grupo.querySelectorAll(':scope > button')].forEach(b=>b.classList.remove('ativo'));
 const atual=[...grupo.querySelectorAll(':scope > button')].find(b=>{
  const t=texto(b);
  if(rota==='painel-empresa')return t.startsWith('visão geral')||t.startsWith('visao geral');
  if(rota==='vagas-empresa')return t.startsWith('minhas vagas');
  if(rota==='candidatos-empresa')return t.startsWith('processo seletivo')||t.startsWith('candidatos');
  if(rota==='contratacoes-empresa')return t.startsWith('contratações')||t.startsWith('contratacoes');
  return false;
 });
 if(atual)atual.classList.add('ativo');
}

carregarCoreMinhasVagasEM();
carregarRefinoVisaoGeralEM();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ajustarNavegacaoRecrutadorEM,350));
else setTimeout(ajustarNavegacaoRecrutadorEM,350);
window.addEventListener('popstate',()=>setTimeout(ajustarNavegacaoRecrutadorEM,120));
window.addEventListener('pageshow',()=>setTimeout(ajustarNavegacaoRecrutadorEM,120));
setInterval(()=>{try{ajustarNavegacaoRecrutadorEM()}catch(_){}},2500);
window.ajustarNavegacaoRecrutadorEM=ajustarNavegacaoRecrutadorEM;
})();
