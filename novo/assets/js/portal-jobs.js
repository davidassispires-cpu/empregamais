/* +Empregos: authoritative public catalog, cached requests and shareable job pages. */
function textoBuscaPortalEM(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g,' ').trim();
}
function textoContratoPortalEM(value) {
  const text=String(value || '').trim(), normalized=textoBuscaPortalEM(text);
  if (/\bclt\b|efetivo/.test(normalized)) return 'CLT';
  if (/^estagio\b/.test(normalized)) return 'Estágio';
  if (/^temporario\b/.test(normalized)) return 'Temporário';
  if (/^aprendiz|jovem aprendiz/.test(normalized)) return 'Aprendiz';
  if (/^prestador|^pj\b|pessoa juridica/.test(normalized)) return 'Prestador de Serviços';
  if (/^autonomo/.test(normalized)) return 'Autônomo';
  return text.length <= 80 ? text : 'Não informado';
}
function coordenadaPortalEM(value) {
  if (value === '' || value == null) return null;
  const number=Number(value); return Number.isFinite(number) ? number : null;
}
(function () {
  'use strict';
  let catalog=null, pending=null, loadedAt=0, renderPending=null;
  const staleMs=60000;
  async function fetchCatalog(force=false) {
    if (pending) return pending;
    if (!force && catalog && Date.now()-loadedAt < staleMs) return catalog;
    pending=(async()=>{
      const rows=[], pageSize=500;
      for (let offset=0;;offset+=pageSize) {
        const page=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&status=eq.aprovada&order=criado_em.desc,id.asc&limit='+pageSize+'&offset='+offset,{headers:sbHeadersEM(),cache:'no-store'});
        if (!Array.isArray(page)) throw new Error('Resposta inválida ao carregar vagas.');
        rows.push(...page); if (page.length < pageSize) break;
      }
      catalog=rows.map(sbMapVagaEM).filter(Boolean); loadedAt=Date.now();
      // Preserve private company jobs separately; never merge old public rows into a fresh response.
      const privateJobs=(Array.isArray(sbVagasCacheEM)?sbVagasCacheEM:[]).filter(v=>v.status!=='aprovada');
      sbVagasCacheEM=[...catalog,...privateJobs];
      try {
        const light=sbVagasCacheEM.map(v=>({...v,logo:String(v.logo||'').startsWith('data:')?'':v.logo}));
        gravar('empregaMaisVagas',light);
      } catch (error) { console.warn('Cache de vagas indisponível; os resultados permanecem em memória.',error); }
      return catalog;
    })().finally(()=>{pending=null;});
    return pending;
  }
  window.sbCarregarVagasEM=sbCarregarVagasEM=fetchCatalog;
  window.vagasPublicas=vagasPublicas=function () {
    const source=catalog || (Array.isArray(sbVagasCacheEM)?sbVagasCacheEM:[]);
    return source.filter(v=>v.status==='aprovada' && vagaDentroPrazo(v));
  };
  function decorateCards() {
    prepararCardsRecentesEM(); sincronizarFiltrosRecentesEM();
    document.querySelectorAll('#listaVagasPortal .portal-vaga-nova').forEach(card=>{
      card.onkeydown=event=>{if(event.target===card && ['Enter',' '].includes(event.key)){event.preventDefault();abrirVaga(card.dataset.vagaId);}};
    });
  }
  function status(message, error=false) {
    let box=document.getElementById('catalogStatusEM');
    if (!box) { box=document.createElement('div');box.id='catalogStatusEM';box.setAttribute('role','status');document.getElementById('listaVagasPortal')?.before(box); }
    box.textContent=message;box.hidden=!message;box.className=error?'catalog-status erro':'catalog-status';
    if(error){const retry=document.createElement('button');retry.type='button';retry.textContent='Tentar novamente';retry.onclick=()=>{loadedAt=0;renderizarVagasPortal();};box.appendChild(retry);}
  }
  function draw(){_renderizarVagasPortalLocalEM();decorateCards();}
  window.renderizarVagasPortal=renderizarVagasPortal=function () {
    if(!document.getElementById('listaVagasPortal'))return Promise.resolve([]);
    if(catalog){draw();if(Date.now()-loadedAt<staleMs)return Promise.resolve(catalog);}
    if(renderPending)return renderPending;
    if(!catalog)status('Carregando vagas…');
    renderPending=fetchCatalog().then(jobs=>{status('');draw();return jobs;}).catch(error=>{
      console.warn('Não foi possível atualizar o catálogo.',error);
      status(catalog?'Não foi possível atualizar as vagas. Exibindo a última consulta.':'Não foi possível carregar as vagas. Verifique sua conexão.',true);
      return [];
    }).finally(()=>{renderPending=null;});
    return renderPending;
  };
  const openRoute=abrirRota;
  window.abrirRota=abrirRota=function(page){
    if(page!=='vaga')return openRoute(page);
    const id=new URLSearchParams(location.search).get('vaga') || sessionStorage.getItem('vagaAtual');
    if(!id){openRoute('home');mostrarToast('Selecione uma vaga para ver os detalhes.');return;}
    sessionStorage.setItem('vagaAtual',id);
    return (async()=>{
      try {
        const rows=await sbJsonEM(EMPREGAMAIS_SUPABASE_URL+'/rest/v1/vagas?select=*&id=eq.'+encodeURIComponent(id)+'&status=eq.aprovada&limit=1',{headers:sbHeadersEM(),cache:'no-store'});
        const job=Array.isArray(rows)&&rows[0]?sbMapVagaEM(rows[0]):null;
        if(!job || !vagaDentroPrazo(job)){openRoute('home');mostrarToast('Esta vaga não está mais disponível.');return;}
        sbVagasCacheEM=[...(Array.isArray(sbVagasCacheEM)?sbVagasCacheEM:[]).filter(v=>String(v.id)!==String(id)),job];
        openRoute('vaga');
      } catch(error){openRoute('home');mostrarToast('Não foi possível carregar a vaga. Tente novamente.');}
    })();
  };
  document.addEventListener('input',event=>{if(['buscaVagas','buscaCidade'].includes(event.target.id))window.paginaVagasPortalEM=1;});
  document.addEventListener('change',event=>{if(/^filtro|^busca|^ordenarVagas/.test(event.target.id))window.paginaVagasPortalEM=1;});
})();
