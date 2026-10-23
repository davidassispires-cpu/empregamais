/* Compact public vacancy filters, sharing the existing search and pagination. */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root && root.document) {
    root.EmpregaMaisVacancyFilters = api;
    var started = false;
    function start() { started = true; api.install(root); }
    if (root.document.readyState === 'complete') start();
    else {
      root.document.addEventListener('DOMContentLoaded', start, {once:true});
      root.addEventListener('load', function () { if (!started) start(); }, {once:true});
    }
    var render = root.renderizarVagas;
    if (typeof render === 'function') root.renderizarVagas = function () {
      var result = render.apply(this, arguments); if (started) api.install(root); return result;
    };
  }
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';
  function normalize(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  }
  function calendarDay(value) {
    if (!value) return null;
    var text = String(value), match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
    if (match) return Date.UTC(+match[1], +match[2] - 1, +match[3]);
    match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(text);
    if (match) return Date.UTC(+match[3], +match[2] - 1, +match[1]);
    var date = new Date(value);
    if (!isFinite(date.getTime())) return null;
    var parts = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date), result = {};
    parts.forEach(function (part) { result[part.type] = part.value; });
    return Date.UTC(+result.year, +result.month - 1, +result.day);
  }
  function seniority(job) {
    var explicit = normalize(job.senioridade || job.nivelProfissional || job.nivelExperiencia);
    var title = normalize(job.cargo || job.titulo);
    var value = explicit || title;
    if (/\b(estagio|estagiario|estagiaria|aprendiz)\b/.test(value)) return 'entry';
    if (/\b(junior|jr)\b/.test(value)) return 'junior';
    if (/\b(pleno|pl)\b/.test(value)) return 'mid';
    if (/\b(senior|sr)\b/.test(value)) return 'senior';
    if (/\b(lider|lideranca|supervisor|supervisora|coordenador|coordenadora|gerente|diretor|diretora|gestor|gestora)\b/.test(value)) return 'lead';
    return 'unknown';
  }
  function journey(job) { return String(job.jornada || job.cargaHoraria || '').trim(); }
  function matchesExtras(job, filters, now) {
    job = job || {}; filters = filters || {};
    if (filters.publication) {
      var published = calendarDay(job.dataPublicacao || job.publicadaEm || job.criadoEm || job.criado_em || job.dataCriacao);
      var today = calendarDay(now || new Date());
      if (published == null || today == null) return false;
      var age = Math.round((today - published) / 86400000), limit = filters.publication === 'today' ? 1 : Number(filters.publication);
      if (age < 0 || age >= limit) return false;
    }
    if (filters.journey && normalize(journey(job) || '__unknown') !== normalize(filters.journey)) return false;
    if (filters.seniority && seniority(job) !== filters.seniority) return false;
    return true;
  }

  function install(win) {
    var doc = win.document, controls = doc.querySelector('#pagina-home .em-job-browser-controls');
    if (!controls || doc.getElementById('emVacancyFilterBar')) return;
    var extra = {publication:'',journey:'',seniority:''}, opened = null, distanceControl = doc.getElementById('emPerto');
    var configs = [
      {key:'mode',label:'Modelo de trabalho',field:'filtroModalidade',all:'Todos os modelos'},
      {key:'distance',label:'Km de você'},
      {key:'publication',label:'Publicação',options:[['','Qualquer data'],['today','Publicadas hoje'],['3','Últimos 3 dias'],['7','Últimos 7 dias'],['15','Últimos 15 dias'],['30','Últimos 30 dias']]},
      {key:'salary',label:'Salário',field:'filtroSalario',all:'Qualquer salário'},
      {key:'area',label:'Área',field:'filtroArea',all:'Todas as áreas',search:true},
      {key:'contract',label:'Contrato',field:'filtroContrato',all:'Todos os contratos'},
      {key:'journey',label:'Jornada'},
      {key:'seniority',label:'Senioridade',options:[['','Todos os níveis'],['entry','Estágio / Aprendiz'],['junior','Júnior'],['mid','Pleno'],['senior','Sênior'],['lead','Liderança'],['unknown','Não informada']]},
      {key:'pcd',label:'PcD',field:'filtroPcd',all:'Todas as vagas'}
    ];
    function node(tag, className, text) {
      var element = doc.createElement(tag); element.className = className || '';
      if (text != null) element.textContent = text;
      return element;
    }
    var bar = node('section', 'em-vf-bar'); bar.id = 'emVacancyFilterBar'; bar.setAttribute('aria-label', 'Filtrar vagas');
    var row = node('div', 'em-vf-row'), active = node('div', 'em-vf-active'); active.hidden = true;
    bar.appendChild(row); bar.appendChild(active);
    var legacy = doc.getElementById('emJobBrowserFilters');
    var homeFilters = doc.getElementById('emHomeVacancyFilters');
    var recentHeader = doc.querySelector('#vagas .em-recent-header-main');
    var quickFilters = doc.querySelector('#vagas .filtros-chips-home');
    if (recentHeader && !doc.getElementById('emRecentSteps')) {
      var steps = node('aside', 'em-recent-steps'); steps.id = 'emRecentSteps';
      steps.setAttribute('aria-label', 'Como encontrar sua próxima oportunidade');
      var paths = ['<path d="M14 2H5v20h14V7Z"/><path d="M14 2v5h5M8 12h8M8 16h6"/>', '<path d="m22 2-7 20-4-9-9-4L22 2ZM11 13 22 2"/>', '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>'];
      [['Crie seu currículo grátis', 'Preencha seu perfil profissional.'], ['Candidate-se com um clique', 'Encontre a vaga ideal para você.'], ['Acompanhe suas candidaturas', 'Veja as novidades do processo.']].forEach(function (copy, i) {
        var card = node('div', 'em-recent-step');
        var icon = node('span', 'em-step-icon'); icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + paths[i] + '</svg>';
        var text = node('div', 'em-step-copy'); text.appendChild(node('strong', '', copy[0])); text.appendChild(node('span', '', copy[1]));
        var number = node('span', 'em-step-number', '0' + (i + 1)); number.setAttribute('aria-hidden', 'true');
        card.appendChild(icon); card.appendChild(text); card.appendChild(number); steps.appendChild(card);
      });
      recentHeader.appendChild(steps); recentHeader.classList.add('em-has-recent-steps');
    }
    if (recentHeader) {
      if (quickFilters) recentHeader.insertBefore(bar, quickFilters);
      else recentHeader.appendChild(bar);
    } else controls.insertBefore(bar, legacy || null);
    if (legacy) legacy.classList.add('em-vf-advanced');
    var counter = doc.getElementById('contador');
    if (counter) { counter.setAttribute('role', 'status'); counter.setAttribute('aria-live', 'polite'); }

    function catalog() { return typeof win.todasAsVagasPublicas === 'function' ? win.todasAsVagasPublicas() : []; }
    function field(config) { return config.field && doc.getElementById(config.field); }
    function value(config) {
      if (config.key === 'distance') return win.emProximidade && win.emProximidade.ativa ? String(win.emProximidade.raio) : '';
      var input = field(config); return input ? input.value : extra[config.key] || '';
    }
    function options(config) {
      if (config.options) return config.options;
      if (config.key === 'journey') {
        var unique = new Map();
        catalog().forEach(function (job) { var text = journey(job); unique.set(normalize(text || '__unknown'), text || 'Não informada'); });
        return [['','Todas as jornadas']].concat(Array.from(unique.entries()).sort(function (a,b) { return a[1].localeCompare(b[1], 'pt-BR'); }));
      }
      var input = field(config);
      return input ? Array.from(input.options).map(function (option) { return [option.value, option.value ? option.textContent.trim() : config.all]; }) : [];
    }
    function selectedText(config) {
      if (config.key === 'distance') {
        var radius = win.emProximidade && win.emProximidade.raio;
        return isFinite(radius) ? 'Até ' + radius + ' km de você' : 'Distância ativa';
      }
      var selected = options(config).find(function (option) { return normalize(option[0]) === normalize(value(config)); });
      return selected ? selected[1] : value(config);
    }
    function close(restoreFocus) {
      if (!opened) return;
      var previous = opened; opened = null;
      previous.panel.hidden = true; previous.button.setAttribute('aria-expanded', 'false');
      if (restoreFocus) previous.button.focus();
    }
    function position(config) {
      var rect = config.button.getBoundingClientRect(), panel = config.panel;
      panel.style.width = Math.min(config.key === 'distance' ? 340 : 300, win.innerWidth - 32) + 'px';
      panel.style.left = Math.max(16, Math.min(rect.left, win.innerWidth - panel.offsetWidth - 16)) + 'px';
      var below = win.innerHeight - rect.bottom - 16;
      panel.style.top = (below >= panel.offsetHeight || rect.top < panel.offsetHeight + 24 ?
        Math.max(16, Math.min(rect.bottom + 8, win.innerHeight - panel.offsetHeight - 16)) : rect.top - panel.offsetHeight - 8) + 'px';
    }
    function change(config, selected) {
      var input = field(config);
      if (input) { input.value = selected; input.dispatchEvent(new win.Event('change', {bubbles:true})); }
      else extra[config.key] = selected;
      if (typeof win.filtrarVagas === 'function') win.filtrarVagas();
      sync();
    }
    function remove(config) {
      if (config.key === 'distance') { var clear = doc.getElementById('emPertoLimpar'); if (clear) clear.click(); }
      else change(config, '');
      sync();
    }
    function sync() {
      active.replaceChildren();
      var chosen = configs.filter(function (config) { return !!value(config); });
      configs.forEach(function (config) {
        var selected = !!value(config);
        config.button.setAttribute('data-active', String(selected)); config.count.hidden = !selected;
        config.button.title = selected ? config.label + ': ' + selectedText(config) : config.label;
        config.button.setAttribute('aria-description', selected ? selectedText(config) : 'Nenhum filtro selecionado');
        config.panel.querySelectorAll('input[type=radio]').forEach(function (radio) { radio.checked = normalize(radio.value) === normalize(value(config)); });
      });
      chosen.forEach(function (config) {
        var text = selectedText(config), chip = node('button', 'em-vf-chip', text);
        chip.type = 'button'; chip.setAttribute('aria-label', 'Remover filtro: ' + text);
        chip.appendChild(node('span', '', '×')); chip.onclick = function () { remove(config); }; active.appendChild(chip);
      });
      var known = doc.getElementById('emFilterSalaryKnown');
      if (known && known.checked) {
        var chip = node('button', 'em-vf-chip', 'Salário informado ×'); chip.type = 'button';
        chip.onclick = function () { known.checked = false; win.filtrarVagas(); }; active.appendChild(chip);
      }
      var hasBase = ['filtroPalavra','filtroCidade'].some(function (id) { return !!(doc.getElementById(id) || {}).value; });
      active.hidden = !chosen.length && !(known && known.checked) && !hasBase;
      if (!active.hidden) {
        var clear = node('button', 'em-vf-clear-all', 'Limpar filtros'); clear.type = 'button';
        clear.onclick = function () {
          close(false); extra.publication = extra.journey = extra.seniority = ''; win.emBuscaCargoAplicado = '';
          var original = doc.querySelector('#filtrosLateral .limpar-link');
          if (original) original.click();
          configs.forEach(function (config) { var input = field(config); if (input) input.value = ''; });
          if (known) known.checked = false;
          if (win.emProximidade && win.emProximidade.ativa) { var distanceClear = doc.getElementById('emPertoLimpar'); if (distanceClear) distanceClear.click(); }
          ['filtroPalavra','filtroCidade'].forEach(function (id) { var input = doc.getElementById(id); if (input) input.value = ''; });
          win.filtrarVagas();
        };
        active.appendChild(clear);
      }
    }
    function fill(config) {
      if (config.key === 'distance' && !distanceControl) distanceControl = doc.getElementById('emPerto');
      var panel = config.panel; panel.replaceChildren();
      var heading = node('div', 'em-vf-panel-heading'), title = node('h3', '', config.label); title.id = config.panel.id + '-title';
      var reset = node('button', 'em-vf-reset', 'Limpar'); reset.type = 'button'; reset.onclick = function () { remove(config); };
      heading.appendChild(title); heading.appendChild(reset); panel.appendChild(heading);
      if (config.key === 'distance') {
        if (distanceControl) {
          panel.appendChild(distanceControl);
          var locationButton = distanceControl.querySelector('#emPertoLocal'), footer = distanceControl.querySelector('.em-perto-rodape');
          if (locationButton && footer) footer.insertBefore(locationButton, footer.firstChild);
        }
      } else {
        var search;
        if (config.search) {
          search = node('input', 'em-vf-search'); search.type = 'search'; search.placeholder = 'Buscar área profissional'; search.setAttribute('aria-label', search.placeholder); panel.appendChild(search);
        }
        var list = node('div', 'em-vf-options'); list.setAttribute('role', 'radiogroup'); list.setAttribute('aria-label', config.label);
        options(config).forEach(function (option) {
          var label = node('label', 'em-vf-option'), radio = node('input'); radio.type = 'radio'; radio.name = 'em-vf-' + config.key; radio.value = option[0];
          radio.checked = normalize(value(config)) === normalize(option[0]);
          radio.onchange = function () { if (radio.checked) change(config, radio.value); };
          label.appendChild(radio); label.appendChild(node('span', '', option[1])); list.appendChild(label);
        });
        panel.appendChild(list);
        if (search) {
          var empty = node('p', 'em-vf-search-empty', 'Nenhuma área encontrada.'); empty.hidden = true; panel.appendChild(empty);
          search.oninput = function () {
            var found = 0, query = normalize(search.value);
            list.querySelectorAll('label').forEach(function (label) { label.hidden = !!label.querySelector('input').value && !normalize(label.textContent).includes(query); if (!label.hidden && label.querySelector('input').value) found++; });
            empty.hidden = found > 0 || !query;
          };
        }
      }
      var done = node('button', 'em-vf-done', 'Ver vagas'); done.type = 'button'; done.onclick = function () { close(true); }; panel.appendChild(done);
    }
    configs.forEach(function (config) {
      var button = node('button', 'em-vf-trigger'); button.type = 'button';
      button.setAttribute('aria-label', config.label);
      button.appendChild(node('span', 'em-vf-label', config.label));
      config.count = node('span', 'em-vf-count', '1'); config.count.hidden = true; config.count.setAttribute('aria-hidden', 'true'); button.appendChild(config.count);
      var arrow = node('span', 'em-vf-chevron'); arrow.setAttribute('aria-hidden', 'true'); button.appendChild(arrow);
      var panel = node('div', 'em-vf-popover'); panel.id = 'emVacancyFilter-' + config.key; panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-labelledby', panel.id + '-title');
      config.button = button; config.panel = panel; button.setAttribute('aria-controls', panel.id); button.setAttribute('aria-expanded', 'false'); button.setAttribute('aria-haspopup', 'dialog');
      button.onclick = function () {
        if (opened === config) { close(true); return; }
        close(false); fill(config); panel.hidden = false; opened = config; button.setAttribute('aria-expanded', 'true'); position(config);
        var first = panel.querySelector('input[type=search]') || panel.querySelector('input:checked') || panel.querySelector('input,button'); if (first) first.focus();
      };
      row.appendChild(button); doc.body.appendChild(panel);
      if (config.key === 'distance' && distanceControl) panel.appendChild(distanceControl);
    });

    function cards() { return Array.from(doc.querySelectorAll('#listaVagas .vaga-card')); }
    function applyExtraFilters(captureBase) {
      var all = cards(), total = 0;
      all.forEach(function (card) {
        if (captureBase) card.setAttribute('data-em-base-filtered', card.style.display === 'none' || card.hidden ? '1' : '0');
        var job = card.__emJobEntry && card.__emJobEntry.job || {};
        var hidden = card.getAttribute('data-em-base-filtered') === '1' || !matchesExtras(job, extra);
        card.setAttribute('data-oculto-filtro-em', hidden ? '1' : '0');
        if (hidden) card.style.setProperty('display', 'none', 'important'); else total++;
      });
      if (counter) counter.innerHTML = '<strong>' + total + '</strong> vaga(s) encontrada(s)';
      var empty = doc.getElementById('semVaga'); if (empty) empty.style.display = total ? 'none' : 'block';
      return total;
    }
    var originalFilter = win.filtrarVagas;
    win.filtrarVagas = function () {
      var result = typeof originalFilter === 'function' ? originalFilter.apply(this, arguments) : undefined;
      applyExtraFilters(true); sync(); return result;
    };
    var originalPage = win.aplicarPaginacaoVagasEM;
    if (typeof originalPage === 'function') win.aplicarPaginacaoVagasEM = function () {
      applyExtraFilters(false); var result = originalPage.apply(this, arguments); sync(); return result;
    };
    var clearLegacy = doc.querySelector('#filtrosLateral .limpar-link');
    if (clearLegacy) clearLegacy.addEventListener('click', function () { extra.publication = extra.journey = extra.seniority = ''; }, true);
    doc.addEventListener('click', function (event) { if (opened && !opened.panel.contains(event.target) && !opened.button.contains(event.target)) close(false); });
    doc.addEventListener('keydown', function (event) { if (event.key === 'Escape' && opened) { event.preventDefault(); close(true); } });
    win.addEventListener('resize', function () { if (opened) position(opened); });
    win.addEventListener('scroll', function (event) {
      if (!opened || opened.panel.contains(event.target)) return;
      var rect = opened.button.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > win.innerHeight) close(false);
      else position(opened);
    }, true);
    doc.addEventListener('change', function (event) {
      if (event.target.id === 'emPertoRaio' && win.emProximidade && win.emProximidade.ativa) {
        win.emProximidade.raio = Number(event.target.value) || Infinity;
        win.renderizarVagas(); sync();
      }
    });
    win.filtrarVagas(); sync();
  }
  return {install:install,matchesExtras:matchesExtras,seniority:seniority,calendarDay:calendarDay};
});

/* Company carousel: keep original company filtering and support keyboard/touch. */
(function(){
 if(typeof document==='undefined')return;
 function init(){
  var scheduled=false;
  function enhance(){
   scheduled=false;
   var section=document.getElementById('emFaixaLogosV41'),track=section&&section.querySelector('.em-logos-linha-v41');
   if(!track)return;
   if(!section.querySelector('.em-company-arrow')){
    track.setAttribute('role','group');track.setAttribute('aria-label','Carrossel de empresas com vagas abertas');
    [-1,1].forEach(function(direction){
     var b=document.createElement('button');b.type='button';b.className='em-company-arrow';b.dataset.direction=direction;b.setAttribute('aria-label',direction<0?'Empresas anteriores':'Próximas empresas');
     b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+(direction<0?'m15 6-6 6 6 6':'m9 6 6 6-6 6')+'"/></svg>';
     b.onclick=function(){track.scrollBy({left:direction*track.clientWidth,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});};
     section.appendChild(b);
    });
    track.addEventListener('scroll',update,{passive:true});
    if(typeof ResizeObserver!=='undefined')new ResizeObserver(update).observe(track);
   }
   update();
   function update(){section.querySelectorAll('.em-company-arrow').forEach(function(b){b.disabled=Number(b.dataset.direction)<0?track.scrollLeft<=2:track.scrollLeft>=track.scrollWidth-track.clientWidth-2;});}
  }
  new MutationObserver(function(){if(!scheduled){scheduled=true;requestAnimationFrame(enhance);}}).observe(document.body,{childList:true,subtree:true});
  enhance();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* Approved full-width pagination below list and preview. */
(function(){
 if(typeof document==='undefined')return;
 function mount(){
  var queued=false;
  function position(){
   queued=false;
   var browser=document.getElementById('emJobBrowser'),pager=document.getElementById('paginacaoVagasEM');
   if(!browser||!pager)return;
   var container=pager.closest('.em-pagination-container');
   if(!container)return;
   if(browser.nextElementSibling!==container)browser.insertAdjacentElement('afterend',container);
   container.classList.add('em-pagination-fullwidth');
  }
  new MutationObserver(function(){if(!queued){queued=true;requestAnimationFrame(position);}}).observe(document.body,{childList:true,subtree:true});
  position();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
