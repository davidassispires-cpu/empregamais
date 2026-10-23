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
  function normalizeSearch(value) {
    return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/\s+/g, ' ');
  }
  function filterFeaturedJobs(jobs, query) {
    var term = normalizeSearch(query && query.term), city = normalizeSearch(query && query.city);
    var words = term ? term.split(' ') : [];
    return (Array.isArray(jobs) ? jobs : []).filter(function (job) {
      var text = normalizeSearch([job.cargo, job.empresa, job.area, job.descricao, job.resumo, job.modalidade, job.contrato].join(' '));
      var location = normalizeSearch([job.cidade, job.estado, job.uf].join(' '));
      return words.every(function (word) { return text.indexOf(word) !== -1; }) && (!city || location.indexOf(city) !== -1);
    });
  }
  function publicText(value) {
    if (Array.isArray(value)) return value.map(publicText).filter(Boolean).join('\n');
    if (value && typeof value === 'object') return publicText(value.nome || value.label || value.texto || '');
    return String(value == null ? '' : value)
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
      .replace(/<br\s*\/?\s*>|<\/(?:p|div|li)>/gi, '\n').replace(/<[^>]*>/g, '')
      .replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#39;/g, "'")
      .replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  }
  function publicationDate(value) {
    if (!value) return 'Não informada';
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
    var date = new Date(match ? value + 'T12:00:00-03:00' : value);
    return isNaN(date.getTime()) ? 'Não informada' : date.toLocaleDateString('pt-BR', {timeZone:'America/Sao_Paulo'});
  }
  function jobDetails(job, options) {
    options = options || {};
    var confidential = options.confidential == null ? enabled(job.confidencial) : options.confidential;
    var salary = options.salary || job.salario;
    if (typeof salary === 'number') salary = salary.toLocaleString('pt-BR', {style:'currency',currency:'BRL'});
    var city = publicText(job.cidade), uf = publicText(job.uf || job.estado);
    if (uf.length !== 2) uf = '';
    var benefits = [], seen = new Set();
    [job.beneficiosTags, job.beneficios, job.beneficiosSelecionados, job.benefits].forEach(function (source) {
      publicText(source).split(/[;|\n]+/).forEach(function (item) {
        item = item.replace(/^\s*[•·*-]\s*/, '').trim();
        var key = item.toLocaleLowerCase('pt-BR');
        if (item && !seen.has(key)) { seen.add(key); benefits.push(item); }
      });
    });
    var description = publicText(job.descricao || job.descricaoVaga || job.resumo);
    return {
      id:String(job.id || ''), title:publicText(job.cargo || job.titulo) || 'Vaga de emprego',
      company:confidential ? 'Empresa confidencial' : publicText(job.empresa) || 'Empresa', confidential:!!confidential,
      demo:enabled(job.demo) || enabled(job.demonstracao) || /^demo[-_]/i.test(String(job.id || '')),
      location:options.location || [city, uf.toUpperCase()].filter(Boolean).join(' – ') || 'Não informada',
      salary:publicText(salary) || 'A combinar', modality:publicText(job.modalidade) || 'Não informada',
      contract:publicText(job.contrato || job.tipoContrato).replace(/^Efetivo\s*[–-]\s*CLT$/i, 'CLT'),
      date:publicationDate(job.dataPublicacao || job.publicadaEm || job.criadoEm),
      description:description || 'A empresa não informou a descrição desta vaga.',
      requirements:publicText(job.requisitos || job.requisitosVaga || job.qualificacoes) || 'Não informados.',
      activities:publicText(job.atividades || job.responsabilidades), benefits:benefits,
      about:confidential ? '' : publicText(job.sobreEmpresa || job.descricaoEmpresa),
      facts:[['Área',job.area],['Jornada',job.jornada],['Horário',job.horario],['Experiência',job.experiencia],
        ['Escolaridade',options.education || job.escolaridade || job.escolaridadeMinima],['Vaga para PcD',job.pcd]]
        .map(function (pair) { return [pair[0],publicText(pair[1])]; })
        .filter(function (pair) { return pair[1] && pair[1] !== 'Não exclusiva para PcD'; })
    };
  }
  function installPopup(win) {
    var doc = win.document;
    if (typeof doc.createElement !== 'function') return;
    var current = null, pendingClick = null;
    var icons = {
      close:'M6 6l12 12M6 18 18 6', location:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM12 7v6M9 10h6',
      salary:'M2 5h20v14H2ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
      work:'M3 7h18v14H3ZM8 7V3h8v4M3 12h18', save:'M6 3h12v18l-6-4-6 4V3Z',
      share:'m10 13 4-4M8 15l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0M16 9l1-1a3.5 3.5 0 0 1 5 5l-4 4a3.5 3.5 0 0 1-5 0'
    };
    function node(tag, className, text) {
      var el = doc.createElement(tag); el.className = className;
      if (text != null) el.textContent = text;
      return el;
    }
    function icon(name) {
      var svg = doc.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('fill','none'); svg.setAttribute('stroke','currentColor');
      svg.setAttribute('stroke-width','1.7'); svg.setAttribute('stroke-linecap','round'); svg.setAttribute('stroke-linejoin','round'); svg.setAttribute('aria-hidden','true');
      var path = doc.createElementNS('http://www.w3.org/2000/svg','path'); path.setAttribute('d',icons[name]); svg.appendChild(path); return svg;
    }
    function closePopup(restoreFocus) {
      if (!current) return;
      var old = current; current = null;
      if (old.dialog.open && typeof old.dialog.close === 'function') old.dialog.close();
      old.dialog.remove();
      doc.documentElement.classList.remove('em-featured-popup-open');
      doc.body.classList.remove('em-featured-popup-open');
      if (old.trigger) old.trigger.setAttribute('aria-expanded','false');
      var trigger = old.trigger;
      if (trigger && !trigger.isConnected) {
        var replacement = Array.from(doc.querySelectorAll('#listaDestaques .em-featured-reference,#emFeaturedJobsList .em-featured-reference')).find(function (card) {
          return card.__emFeaturedPopupJob && String(card.__emFeaturedPopupJob.id) === old.jobId;
        });
        trigger = replacement && replacement.querySelector('.dz-botao');
      }
      if (restoreFocus !== false && trigger && trigger.isConnected && typeof trigger.focus === 'function') trigger.focus({preventScroll:true});
    }
    function openPopup(job, card, trigger) {
      closePopup(false);
      var options = {}, salary = card && card.querySelector('.dz-salario strong');
      if (salary) options.salary = salary.textContent;
      if (typeof win.vagaEhConfidencialEM === 'function') options.confidential = win.vagaEhConfidencialEM(job);
      if (typeof win.textoEscolaridadeVaga === 'function') options.education = win.textoEscolaridadeVaga(job);
      var info = jobDetails(job, options);
      var dialog = node('dialog','em-featured-job-popup'); dialog.id = 'emFeaturedJobPopup';
      dialog.setAttribute('aria-labelledby','emFeaturedPopupTitle'); dialog.setAttribute('aria-modal','true');
      var header = node('header','em-fjp-header'), top = node('div','em-fjp-top');
      top.appendChild(node('span','em-fjp-eyebrow','Detalhes da vaga'));
      var close = node('button','em-fjp-close'); close.type = 'button'; close.setAttribute('aria-label','Fechar detalhes da vaga'); close.setAttribute('autofocus',''); close.appendChild(icon('close'));
      close.onclick = function () { closePopup(); }; top.appendChild(close); header.appendChild(top);
      var identity = node('div','em-fjp-identity'), heading = node('div','em-fjp-heading');
      var title = node('h2','em-fjp-title',info.title); title.id = 'emFeaturedPopupTitle'; heading.appendChild(title);
      var company = node('div','em-fjp-company'), companyLink = !info.confidential && card && card.querySelector('.em-company-profile-link');
      if (companyLink) {
        var link = node('a','em-fjp-company-link',info.company); link.href = companyLink.href || '#';
        link.onclick = function (event) {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault(); closePopup(false); companyLink.click();
        }; company.appendChild(link);
      } else company.appendChild(node('span','',info.company));
      var rating = !info.confidential && card && card.querySelector('.em-company-demo-rating');
      if (rating) company.appendChild(rating.cloneNode(true));
      heading.appendChild(company); identity.appendChild(heading);
      var sourceLogo = !info.confidential && card && card.querySelector('.dz-logo img');
      if (sourceLogo) { var logo = node('img','em-fjp-logo'); logo.src = sourceLogo.src; logo.alt = ''; identity.appendChild(logo); }
      header.appendChild(identity); dialog.appendChild(header);
      var body = node('div','em-fjp-body'), facts = node('div','em-fjp-main-facts');
      [['Localização',info.location,'location'],['Salário',info.salary,'salary'],['Modalidade',info.modality,'work'],['Contrato',info.contract || 'Não informado','work']].forEach(function (fact) {
        var box = node('div','em-fjp-fact'), copy = node('div',''); box.appendChild(icon(fact[2]));
        copy.appendChild(node('span','em-fjp-label',fact[0])); copy.appendChild(node('strong','em-fjp-value',fact[1])); box.appendChild(copy); facts.appendChild(box);
      }); body.appendChild(facts);
      if (enabled(job.urgente) || enabled(job.contratacaoUrgente)) body.appendChild(node('p','em-fjp-urgent','Contratação urgente · Processo seletivo em andamento.'));
      var status = node('p','em-fjp-status'); status.setAttribute('role','status'); status.hidden = true;
      body.appendChild(status);
      if (info.demo) body.appendChild(node('p','em-fjp-demo','Vaga de demonstração. Esta oportunidade é fictícia e não recebe candidaturas reais.'));
      var contentGrid = node('div','em-fjp-content-grid em-fjp-model1'), sections = node('div','em-fjp-sections'), middle = node('div','em-fjp-middle'), sidebar = node('aside','em-fjp-sidebar');
      function section(label, text, target) {
        var block = node('section','em-fjp-section'); block.appendChild(node('h3','',label)); block.appendChild(node('p','',text)); (target || sections).appendChild(block); return block;
      }
      section('Descrição da vaga',info.description);
      section('Responsabilidades',info.activities && info.activities !== info.description ? info.activities : 'Consulte as atividades descritas na apresentação da vaga.');
      section('Requisitos',info.requirements,middle);
      var benefits = node('section','em-fjp-section'); benefits.appendChild(node('h3','','Benefícios'));
      if (info.benefits.length) {
        var list = node('ul','em-fjp-benefits'); info.benefits.forEach(function (item) { list.appendChild(node('li','',item)); }); benefits.appendChild(list);
      } else benefits.appendChild(node('p','','Não informados.'));
      middle.appendChild(benefits);
      var details = node('section','em-fjp-section'); details.appendChild(node('h3','','Informações da vaga'));
      if (info.facts.length) {
        var fields = node('dl','em-fjp-extra-facts'); info.facts.forEach(function (pair) {
          var field = node('div',''); field.appendChild(node('dt','',pair[0])); field.appendChild(node('dd','',pair[1])); fields.appendChild(field);
        }); details.appendChild(fields);
      } else details.appendChild(node('p','','Não foram informadas condições adicionais.'));
      sidebar.appendChild(details);
      if (info.about) section('Sobre a empresa',info.about,sidebar);
      contentGrid.appendChild(sections); contentGrid.appendChild(middle); contentGrid.appendChild(sidebar); body.appendChild(contentGrid);
      dialog.appendChild(body);
      var footer = node('footer','em-fjp-footer'), metadata = node('div','em-fjp-footer-meta'), publication = node('div','em-fjp-publication');
      publication.appendChild(node('span','','ID da vaga: '+info.id)); publication.appendChild(node('span','','Publicado em '+info.date)); metadata.appendChild(publication);
      if (typeof win.abrirPopupDenunciaEmpregaMais === 'function') {
        var report = node('button','em-fjp-report','Denunciar vaga'); report.type = 'button';
        report.onclick = function () { closePopup(false); win.abrirPopupDenunciaEmpregaMais(job.id); }; metadata.appendChild(report);
      }
      footer.appendChild(metadata);
      var actions = node('div','em-fjp-actions'), apply = node('button','em-fjp-apply','Candidatar-se'); apply.type = 'button';
      apply.onclick = function () {
        if (info.demo) { status.hidden = false; status.textContent = 'Esta vaga é de demonstração e não recebe candidaturas reais.'; body.scrollTop = 0; return; }
        closePopup(false);
        if (win.EmpregaMaisCandidaturaV94 && typeof win.EmpregaMaisCandidaturaV94.abrir === 'function') win.EmpregaMaisCandidaturaV94.abrir(job);
        else if (typeof win.abrirContatoExternoVaga === 'function') win.abrirContatoExternoVaga(job);
        else if (typeof win.irPara === 'function') win.irPara('vaga',job.id);
      }; actions.appendChild(apply);
      var save = node('button','em-fjp-secondary em-fjp-save'); save.type = 'button'; save.appendChild(icon('save'));
      var saveLabel = node('span','','Salvar vaga'); save.appendChild(saveLabel);
      function updateSaved() {
        var saved = typeof win.vagaEstaSalva === 'function' && win.vagaEstaSalva(job.id);
        var label = saved ? 'Vaga salva' : 'Salvar vaga'; saveLabel.textContent = label; save.setAttribute('aria-label',label); save.setAttribute('aria-pressed',String(!!saved)); save.title = label;
      }
      updateSaved(); save.onclick = function () {
        var original = card && card.querySelector('.dz-save-featured');
        if (typeof win.candidatoEstaLogado === 'function' && !win.candidatoEstaLogado()) closePopup(false);
        if (typeof win.alternarFavorito === 'function') { Promise.resolve(win.alternarFavorito(job.id)).then(updateSaved); }
        else if (original) { original.click(); updateSaved(); }
        else { status.hidden = false; status.textContent = 'Entre na sua conta para salvar esta vaga.'; body.scrollTop = 0; }
      }; actions.appendChild(save);
      var share = node('details','em-fjp-share'), toggle = node('summary','em-fjp-secondary'); toggle.setAttribute('aria-label','Compartilhar vaga'); toggle.appendChild(icon('share')); toggle.appendChild(node('span','','Compartilhar')); share.appendChild(toggle);
      var menu = node('div','em-fjp-share-menu');
      var url = new URL(String(win.location.pathname || '')+'?pagina=vaga&id='+encodeURIComponent(job.id),win.location.href).href;
      var whatsapp = node('a','','WhatsApp'); whatsapp.href = 'https://wa.me/?text='+encodeURIComponent(info.title+' — '+info.company+'\n'+url); whatsapp.target = '_blank'; whatsapp.rel = 'noopener noreferrer'; menu.appendChild(whatsapp);
      var email = node('a','','E-mail'); email.href = 'mailto:?subject='+encodeURIComponent(info.title)+'&body='+encodeURIComponent(url); menu.appendChild(email);
      var copy = node('button','','Copiar link'); copy.type = 'button';
      copy.onclick = async function () {
        try { await win.navigator.clipboard.writeText(url); copy.textContent = 'Link copiado'; }
        catch (error) { var field = node('input','em-fjp-copy-url'); field.value = url; field.readOnly = true; field.setAttribute('aria-label','Link da vaga'); menu.appendChild(field); field.focus(); field.select(); }
      }; menu.appendChild(copy); share.appendChild(menu); actions.appendChild(share); footer.appendChild(actions); dialog.appendChild(footer);
      current = {dialog:dialog,trigger:trigger,jobId:info.id};
      dialog.addEventListener('cancel',function (event) { event.preventDefault(); closePopup(); });
      dialog.addEventListener('close',function () { if (current && current.dialog === dialog) closePopup(); });
      dialog.addEventListener('click',function (event) {
        if (event.target !== dialog) return;
        var rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closePopup();
      });
      dialog.addEventListener('keydown',function (event) {
        if (event.key === 'Escape') { event.preventDefault(); closePopup(); return; }
        if (event.key !== 'Tab') return;
        var focusable = Array.from(dialog.querySelectorAll('button,a,summary,input')).filter(function (el) { return !el.disabled && el.getClientRects().length; });
        var first = focusable[0], last = focusable[focusable.length-1];
        if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first.focus(); }
      });
      doc.body.appendChild(dialog); doc.documentElement.classList.add('em-featured-popup-open'); doc.body.classList.add('em-featured-popup-open');
      if (trigger) trigger.setAttribute('aria-expanded','true');
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else { dialog.setAttribute('open',''); dialog.setAttribute('role','dialog'); dialog.setAttribute('data-fallback','true'); }
      close.focus({preventScroll:true});
      return true;
    }
    var makeCard = win.criarCardVaga;
    if (typeof makeCard === 'function') win.criarCardVaga = function (job, featured) {
      var card = makeCard.apply(this,arguments);
      if (card && featured) {
        card.__emFeaturedPopupJob = job;
        card.setAttribute('data-em-featured-popup','true');
        var button = card.querySelector('.dz-botao');
        if (button) { button.setAttribute('aria-haspopup','dialog'); button.setAttribute('aria-expanded','false'); button.setAttribute('aria-controls','emFeaturedJobPopup'); button.setAttribute('aria-label','Ver detalhes de '+publicText(job.cargo)); }
      }
      return card;
    };
    doc.querySelectorAll('#listaDestaques .dz-botao,#emFeaturedJobsList .dz-botao').forEach(function (button) {
      button.setAttribute('aria-haspopup','dialog'); button.setAttribute('aria-expanded','false'); button.setAttribute('aria-controls','emFeaturedJobPopup');
      var card = button.closest('.em-featured-reference');
      if (card) card.setAttribute('data-em-featured-popup','true');
      button.setAttribute('aria-label','Ver detalhes de '+publicText(card && card.getAttribute('data-titulo')));
    });
    doc.addEventListener('click',function (event) {
      var target = event.target, card = target && target.closest && target.closest('#listaDestaques .em-featured-reference,#emFeaturedJobsList .em-featured-reference');
      if (!card || target.closest('a,.dz-empresa,.dz-company-jobs,.dz-save-featured,.em-company-verification')) return;
      var trigger = target.closest('.dz-botao') || card.querySelector('.dz-botao');
      if (card.__emFeaturedPopupJob) {
        event.preventDefault(); event.stopImmediatePropagation(); openPopup(card.__emFeaturedPopupJob,card,trigger); return;
      }
      // Existing cards retain their closure's exact job ID through the synchronous router call.
      var context = {card:card,trigger:trigger}; pendingClick = context;
      win.setTimeout(function () { if (pendingClick === context) pendingClick = null; },0);
    },true);
    var route = win.irPara;
    if (typeof route === 'function') win.irPara = function (page,id) {
      var context = pendingClick; pendingClick = null;
      if (page === 'vaga' && context && typeof win.todasAsVagasPublicas === 'function') {
        var job = win.todasAsVagasPublicas().find(function (item) { return String(item.id) === String(id); });
        if (job) return openPopup(job,context.card,context.trigger);
      }
      return route.apply(this,arguments);
    };
    win.addEventListener('popstate',function () { closePopup(false); });
  }
  function install(win) {
    if (win.__emFeaturedVacanciesInstalled) return;
    win.__emFeaturedVacanciesInstalled = true;
    installPopup(win);
    var doc = win.document, previousKey = null, search = {term:'',city:''};
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
      var jobs = filterFeaturedJobs(selectFeaturedJobs(catalog), search), key = JSON.stringify([search, jobs]);
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
      if (empty) {
        empty.hidden = jobs.length > 0;
        empty.textContent = search.term || search.city ? 'Nenhuma vaga em destaque encontrada para esta busca.' : 'Nenhuma vaga em destaque disponível no momento.';
      }
      list.setAttribute('aria-busy', 'false');
    }
    var form = doc.getElementById('emFeaturedSearchForm');
    if (form) form.onsubmit = function (event) {
      event.preventDefault();
      var term = doc.getElementById('emFeaturedSearchTerm'), city = doc.getElementById('emFeaturedSearchCity');
      search = {term:term ? term.value.trim() : '',city:city ? city.value.trim() : ''};
      render();
    };
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
  return {selectFeaturedJobs:selectFeaturedJobs,filterFeaturedJobs:filterFeaturedJobs,jobDetails:jobDetails,publicText:publicText,install:install};
});

