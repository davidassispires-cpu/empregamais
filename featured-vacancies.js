/* Dedicated public page for active featured vacancies. */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root && root.document) api.install(root);
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';
  function enabled(value) {
    return value === true || value === 1 || value === '1' || String(value).toLowerCase() === 'true';
  }
  function timestamp(value) {
    var time = new Date(value || '').getTime();
    return isFinite(time) ? time : 0;
  }
  function selectFeaturedJobs(catalog, now) {
    var seen = new Set(), time = now == null ? Date.now() : new Date(now).getTime();
    return (Array.isArray(catalog) ? catalog : []).filter(function (job) {
      if (!job || job.id == null || !String(job.id).trim()) return false;
      if (!enabled(job.destaque) && !enabled(job.emDestaque) && !enabled(job.destacada)) return false;
      if (job.aprovacao && String(job.aprovacao).toLowerCase() !== 'aprovada') return false;
      if (job.status && !/^(ativa|ativo|publicada|publicado)$/i.test(String(job.status))) return false;
      var until = timestamp(job.destaqueAte);
      if (until && until <= time) return false;
      var id = String(job.id);
      if (seen.has(id)) return false;
      seen.add(id); return true;
    }).sort(function (a, b) {
      return timestamp(b.dataPublicacao || b.publicadaEm || b.criadoEm) -
        timestamp(a.dataPublicacao || a.publicadaEm || a.criadoEm);
    });
  }
  function install(win) {
    if (win.__emFeaturedVacanciesInstalled) return;
    win.__emFeaturedVacanciesInstalled = true;
    var doc = win.document, previousKey = null;
    function active() {
      var page = doc.getElementById('pagina-vagas-destaque');
      return page && page.classList.contains('ativa');
    }
    function render() {
      if (!active() || typeof win.criarCardVaga !== 'function' || typeof win.todasAsVagasPublicas !== 'function') return;
      var list = doc.getElementById('emFeaturedJobsList');
      if (!list) return;
      var catalog = win.todasAsVagasPublicas();
      if (typeof win.statusDaVaga === 'function') catalog = catalog.filter(function (job) { return win.statusDaVaga(job) === 'ativa'; });
      var jobs = selectFeaturedJobs(catalog), key = JSON.stringify(jobs);
      if (previousKey === key) return;
      var cards = jobs.map(function (job) {
        var card = win.criarCardVaga(job, true);
        var companyJobs = card.querySelector('.dz-company-jobs');
        if (companyJobs) companyJobs.onclick = function (event) {
          event.preventDefault(); event.stopPropagation();
          var field = doc.getElementById('filtroPalavra');
          if (field) field.value = job.empresa || '';
          if (typeof win.irPara === 'function') win.irPara('home');
          if (typeof win.filtrarVagas === 'function') win.filtrarVagas();
          var results = doc.getElementById('vagas');
          if (results) results.scrollIntoView({behavior:'smooth',block:'start'});
        };
        return card;
      });
      list.replaceChildren.apply(list, cards);
      previousKey = key;
      var count = doc.getElementById('emFeaturedJobsCount');
      if (count) count.textContent = jobs.length + (jobs.length === 1 ? ' vaga em destaque' : ' vagas em destaque');
      var empty = doc.getElementById('emFeaturedJobsEmpty');
      if (empty) empty.hidden = jobs.length > 0;
      list.setAttribute('aria-busy', 'false');
    }
    win.renderizarVagasDestaque = render;
    var originalRender = win.renderizarVagas;
    if (typeof originalRender === 'function') win.renderizarVagas = function () {
      var result = originalRender.apply(this, arguments);
      render(); return result;
    };
    var back = doc.querySelector('#pagina-vagas-destaque .em-fp-back');
    if (back) back.onclick = function (event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button > 0) return;
      if (typeof win.irPara === 'function') { event.preventDefault(); win.irPara('home'); }
    };
    function refresh() { if (active()) render(); }
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', refresh, {once:true});
    else refresh();
    win.addEventListener('load', refresh, {once:true});
    win.addEventListener('pageshow', refresh);
    win.addEventListener('storage', function (event) { if (event.key === 'vagasEmpregaMais') refresh(); });
  }
  return {selectFeaturedJobs:selectFeaturedJobs,install:install};
});
