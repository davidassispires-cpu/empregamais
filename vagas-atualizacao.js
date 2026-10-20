/* Share recent list reads and refresh after confirmed writes. */
(function () {
  'use strict';
  if (window.__emJobsFreshness) return;
  window.__emJobsFreshness = true;
  var originalSync = window.sincronizarVagasGoogleSheets;
  if (typeof originalSync !== 'function') return;
  var TTL = 120000, active = null, lastSuccess = 0, lastAttempt = 0;
  var lastResult, lastError, queued = false, generation = 0, reads = new Map();
  function copy(value) { return value == null ? value : JSON.parse(JSON.stringify(value)); }
  function scope() {
    return [sessionStorage.getItem('empregaMaisPapel'), sessionStorage.getItem('empresaCnpj'),
      sessionStorage.getItem('candidatoUserId'), sessionStorage.getItem('empregaMaisSupabaseAccessToken'),
      localStorage.getItem('empregaMaisAdminSupabaseToken')].join('|');
  }
  var lastScope = scope();
  function invalidate() { generation++; reads.clear(); lastSuccess = 0; lastAttempt = 0; lastError = null; }
  function checkScope() { var current = scope(); if (current !== lastScope) { lastScope = current; invalidate(); lastResult = undefined; } }
  var originalGet = window.apiEmpregaMaisGet;
  if (typeof originalGet === 'function') {
    window.apiEmpregaMaisGet = function (action) {
      checkScope();
      if (action !== 'listar' && action !== 'listarEmpresas') return originalGet.apply(this, arguments);
      var key = JSON.stringify(Array.from(arguments)), entry = reads.get(key);
      if (entry && entry.promise) return entry.promise.then(copy);
      if (entry && Date.now() - entry.at < TTL) return Promise.resolve(copy(entry.value));
      var version = generation, args = arguments, context = this;
      var pending = Promise.resolve().then(function () { return originalGet.apply(context, args); }).then(function (result) {
        if (result && result.sucesso === true && version === generation) reads.set(key, { at: Date.now(), value: copy(result) });
        else if (reads.get(key) && reads.get(key).promise === pending) reads.delete(key);
        return result;
      }).catch(function (error) { if (reads.get(key) && reads.get(key).promise === pending) reads.delete(key); throw error; });
      reads.set(key, { promise: pending });
      return pending.then(copy);
    };
  }
  window.sincronizarVagasGoogleSheets = function (force) {
    checkScope();
    if (active) { if (force === true) queued = true; return active; }
    if (force === true) invalidate();
    if (lastSuccess && Date.now() - lastSuccess < TTL) return Promise.resolve(lastResult);
    if (lastError && Date.now() - lastAttempt < TTL) return Promise.reject(lastError);
    lastAttempt = Date.now(); var version = generation;
    active = Promise.resolve().then(function () { return originalSync.call(window); }).then(function (result) {
      if (version === generation) { lastSuccess = Date.now(); lastResult = result; lastError = null; }
      return result;
    }).catch(function (error) { if (version === generation) lastError = error; throw error; }).finally(function () {
      active = null;
      if (queued) { queued = false; refresh(true); }
    });
    return active;
  };
  function refresh(force) {
    if (document.hidden || navigator.onLine === false) return;
    return window.sincronizarVagasGoogleSheets(force === true).catch(function (error) {
      console.warn('EmpregaMais: não foi possível atualizar as vagas.', error);
    });
  }
  var originalPost = window.apiEmpregaMaisPost;
  if (typeof originalPost === 'function') {
    window.apiEmpregaMaisPost = function () {
      return Promise.resolve(originalPost.apply(this, arguments)).then(function (result) {
        if (result && result.sucesso === true) {
          invalidate();
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
  document.addEventListener('visibilitychange', function () { if (!document.hidden) resume(); });
  window.addEventListener('storage', function (event) {
    if (event.key === 'vagasEmpregaMais') {
      invalidate();
      if (!document.hidden && typeof window.atualizarTelasAdminEmpregaMais === 'function') window.atualizarTelasAdminEmpregaMais();
    }
  });
  setInterval(resume, TTL);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', resume, { once: true });
  else resume();
})();

/* Keep identical background refreshes from replacing the visible vacancy list. */
(function () {
  'use strict';
  var previousKey = null, rendering = false;
  function install() {
    var original = window.renderizarVagas;
    if (typeof original !== 'function' || original.__emStableJobs) return;
    function stableRender() {
      if (rendering) return;
      var home = document.getElementById('pagina-home');
      var list = document.getElementById('listaVagas');
      if (!home || !home.classList.contains('ativa') || !list) return original.apply(this, arguments);
      var key;
      try {
        var jobs = typeof window.todasAsVagasPublicas === 'function' ? window.todasAsVagasPublicas() : null;
        var inputs = Array.from(home.querySelectorAll('input,select')).map(function (el) {
          return [el.id,el.value,el.checked];
        });
        var proximity = window.emProximidade;
        key = JSON.stringify([jobs,inputs,proximity && [proximity.ativa,proximity.raio,proximity.distancias]]);
      } catch (_) { return original.apply(this, arguments); }
      if (previousKey === key && list.querySelector('article')) return;
      rendering = true;
      var result;
      try { result = original.apply(this, arguments); previousKey = key; }
      finally { rendering = false; }
      return result;
    }
    stableRender.__emStableJobs = true;
    window.renderizarVagas = stableRender;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
