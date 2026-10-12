/* Refresh the shared jobs without changing login, filters or local drafts. */
(function () {
  'use strict';
  if (window.__emJobsFreshness) return;
  window.__emJobsFreshness = true;
  var originalSync = window.sincronizarVagasGoogleSheets;
  if (typeof originalSync !== 'function') return;
  var active = null, lastAttempt = 0, queued = false;

  // All existing callers share the current request, avoiding out-of-order writes.
  window.sincronizarVagasGoogleSheets = function () {
    if (active) return active;
    lastAttempt = Date.now();
    active = Promise.resolve().then(function () {
      return originalSync.call(window);
    }).finally(function () {
      active = null;
      if (queued) {
        queued = false;
        refresh(true);
      }
    });
    return active;
  };

  function refresh(force) {
    if (document.hidden || navigator.onLine === false) return;
    if (!force && Date.now() - lastAttempt < 15000) return;
    return window.sincronizarVagasGoogleSheets().catch(function (error) {
      console.warn('EmpregaMais: não foi possível atualizar as vagas.', error);
    });
  }

  var originalPost = window.apiEmpregaMaisPost;
  if (typeof originalPost === 'function') {
    window.apiEmpregaMaisPost = function () {
      return Promise.resolve(originalPost.apply(this, arguments)).then(function (result) {
        if (result && result.sucesso === true) {
          // A read started before publication must finish before the next read.
          if (active) queued = true;
          else refresh(true);
        }
        return result;
      });
    };
  }

  function resume() { refresh(false); }
  window.addEventListener('focus', resume);
  window.addEventListener('pageshow', resume);
  window.addEventListener('online', function () { refresh(true); });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) resume();
  });
  window.addEventListener('storage', function (event) {
    if (event.key === 'vagasEmpregaMais' && !document.hidden &&
        typeof window.atualizarTelasAdminEmpregaMais === 'function') {
      window.atualizarTelasAdminEmpregaMais();
    }
  });
  setInterval(resume, 60000);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resume, {once: true});
  } else resume();
})();
