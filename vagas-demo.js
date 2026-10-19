/* Public sample vacancies. No sample is saved to the production job store. */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root && root.document) api.instalar(root);
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';
  var day = 86400000;
  var examples = [
    {cargo:'Assistente Administrativo',empresa:'Horizonte Serviços',cidade:'Belo Horizonte',area:'Administração',salario:2500,idade:.05,destaque:true,total:8,
      descricao:'Apoio às rotinas administrativas, atendimento e organização de documentos.',requisitos:'Ensino médio completo, organização e conhecimentos de Excel.'},
    {cargo:'Analista de Recursos Humanos',empresa:'Conecta Pessoas',cidade:'Contagem',area:'Administração',salario:3800,idade:.15,destaque:true,modalidade:'Híbrido',total:24,
      descricao:'Condução de processos seletivos, integração de profissionais e apoio aos indicadores de RH.',requisitos:'Superior em Administração, Psicologia ou áreas afins e experiência com recrutamento.'},
    {cargo:'Auxiliar de E-commerce',empresa:'Vitrine Digital',cidade:'Betim',area:'Comercial, Vendas',salario:2200,idade:.25,destaque:true,urgente:true,total:5,
      descricao:'Cadastro de produtos, acompanhamento de pedidos e atendimento nos marketplaces.',requisitos:'Ensino médio completo, boa escrita e familiaridade com compras online.'},
    {cargo:'Vendedor de Loja',empresa:'Estação Varejo',cidade:'Belo Horizonte',area:'Comercial, Vendas',salario:2100,comissao:true,idade:3,urgente:true,total:18,
      descricao:'Atendimento consultivo, apresentação de produtos e organização da loja.',requisitos:'Boa comunicação e experiência com atendimento ao público.'},
    {cargo:'Auxiliar de Logística',empresa:'Operação Logística',cidade:'Contagem',area:'Logística',salario:2350,idade:3.5,confidencial:true,total:6,
      descricao:'Separação, conferência e organização de mercadorias no centro de distribuição.',requisitos:'Ensino médio completo e disponibilidade para atuar em escala.'},
    {cargo:'Operador de Caixa',empresa:'Mercado da Praça',cidade:'Betim',area:'Comercial, Vendas',salario:1950,idade:.35,total:4,
      descricao:'Registro de compras, recebimento de pagamentos e fechamento de caixa.',requisitos:'Ensino médio completo e atenção ao atendimento e aos valores recebidos.'},
    {cargo:'Assistente Financeiro',empresa:'Gestão Horizonte',cidade:'Belo Horizonte',area:'Contábil, Finanças, Economia',salario:2900,idade:4,destaque:true,modalidade:'Híbrido',total:12,
      descricao:'Controle de contas a pagar e receber, conciliação bancária e atualização de planilhas.',requisitos:'Excel intermediário e experiência em rotinas financeiras.'},
    {cargo:'Recepcionista',empresa:'Atendimento Integrado',cidade:'Belo Horizonte',area:'Administração',salario:2000,idade:4.5,confidencial:true,total:16,
      descricao:'Recepção de visitantes, atendimento telefônico e organização da agenda.',requisitos:'Ensino médio completo, cordialidade e boa comunicação.'},
    {cargo:'Auxiliar de Produção',empresa:'Indústria Serra Azul',cidade:'Contagem',area:'Industrial, Produção, Fábrica',salario:2180,idade:2.5,urgente:true,total:32,
      descricao:'Apoio à linha de produção, embalagem e conferência de qualidade dos produtos.',requisitos:'Ensino médio completo e disponibilidade para trabalho presencial.'},
    {cargo:'Analista de Marketing',empresa:'Ideia Digital',cidade:'Belo Horizonte',area:'Marketing',salario:4200,idade:6,destaque:true,modalidade:'Remoto',total:22,
      descricao:'Planejamento de conteúdo, acompanhamento de campanhas e análise de resultados digitais.',requisitos:'Experiência com redes sociais, métricas e ferramentas de marketing digital.'},
    {cargo:'Atendente de Relacionamento',empresa:'Conexão Atendimento',cidade:'Betim',area:'Comercial, Vendas',salario:1980,idade:.4,urgente:true,total:9,
      descricao:'Atendimento ao cliente por chat e telefone, registro de solicitações e acompanhamento de soluções.',requisitos:'Ensino médio completo, empatia e boa digitação.'},
    {cargo:'Estágio em Administração',empresa:'Primeiro Passo Gestão',cidade:'Belo Horizonte',area:'Administração',salario:1400,idade:.5,contrato:'Estágio',modalidade:'Híbrido',jornada:'30 horas semanais',horario:'Segunda a sexta, das 9h às 15h',total:3,
      descricao:'Apoio no controle de documentos, organização de planilhas e atendimento interno.',requisitos:'Cursando Administração a partir do segundo período.',beneficios:'Vale-transporte; seguro de vida; bolsa de estudos.'},
    {cargo:'Jovem Aprendiz de Logística',empresa:'Rota Certa Distribuição',cidade:'Contagem',area:'Logística',salario:1050,idade:.6,contrato:'Jovem Aprendiz',jornada:'20 horas semanais',horario:'Segunda a sexta, das 8h às 12h',total:7,
      descricao:'Aprendizado e apoio às rotinas de recebimento, estoque e expedição.',requisitos:'Ensino médio em andamento ou completo. Não exige experiência.',beneficios:'Vale-transporte; vale-alimentação; formação profissional.'},
    {cargo:'Técnico de Suporte de TI',empresa:'Nexo Tecnologia',cidade:'Belo Horizonte',area:'Informática, TI, Telecomunicações',salario:3100,idade:7,destaque:true,modalidade:'Híbrido',total:14,
      descricao:'Suporte a usuários, configuração de equipamentos e acompanhamento de chamados técnicos.',requisitos:'Curso técnico em informática e conhecimentos de sistemas operacionais e redes.'},
    {cargo:'Conferente de Mercadorias',empresa:'Via Minas Logística',cidade:'Betim',area:'Logística',salario:2550,idade:2,urgente:true,total:21,
      descricao:'Conferência de notas fiscais, volumes e movimentações de entrada e saída de mercadorias.',requisitos:'Experiência com conferência e conhecimentos de controle de estoque.'},
    {cargo:'Auxiliar de Cozinha',empresa:'Sabor Mineiro',cidade:'Belo Horizonte',area:'Alimentação / Gastronomia',salario:1850,idade:3,urgente:true,jornada:'44 horas semanais',horario:'Escala 6x1, das 7h às 15h20',total:17,
      descricao:'Pré-preparo de alimentos, organização de insumos e higienização da área de trabalho.',requisitos:'Organização, trabalho em equipe e boas práticas de higiene.',beneficios:'Vale-transporte; alimentação no local; seguro de vida.'},
    {cargo:'Assistente de Compras',empresa:'Suprimentos Corporativos',cidade:'Contagem',area:'Compras',salario:3200,idade:5,destaque:true,confidencial:true,total:10,
      descricao:'Cotação com fornecedores, acompanhamento de pedidos e controle de prazos de entrega.',requisitos:'Experiência com compras e domínio de planilhas.'},
    {cargo:'Analista de Dados',empresa:'Horizonte Analytics',cidade:'Belo Horizonte',area:'Informática, TI, Telecomunicações',salario:6500,idade:8,destaque:true,modalidade:'Remoto',contrato:'Prestador de Serviços',jornada:'Horário flexível',horario:'Atuação por entregas, de segunda a sexta',total:26,
      descricao:'Construção de relatórios e painéis, análise de indicadores e apoio à tomada de decisões.',requisitos:'Experiência com SQL, Power BI e análise de dados.',beneficios:'Trabalho remoto; horário flexível; capacitação profissional.'},
    {cargo:'Auxiliar de Serviços Gerais',empresa:'Serviços Operacionais',cidade:'Betim',area:'Administração',salario:1800,idade:4,confidencial:true,contrato:'Temporário',total:11,
      descricao:'Limpeza e conservação de ambientes, reposição de materiais e organização dos espaços.',requisitos:'Responsabilidade e disponibilidade para atuação presencial.'},
    {cargo:'Estoquista',empresa:'Ponto Certo Comércio',cidade:'Belo Horizonte',area:'Logística',salario:2150,idade:.7,total:15,
      descricao:'Recebimento de mercadorias, organização do estoque e separação de pedidos.',requisitos:'Ensino médio completo e atenção à organização e à conferência de produtos.'}
  ];


  // Marcas usadas exclusivamente como exemplos visuais, sem vínculo ou vaga real.
  var demoBrands = [
    {name:'Drogaria Araujo',domain:'araujo.com.br'},
    {name:'Carrefour',domain:'carrefour.com.br',logo:'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/carrefour/default.svg'},
    {name:'Postos Ipiranga',domain:'ipiranga.com.br',logo:'https://www.ipiranga.com.br/wps/contenthandler/pt-br/!ut/p/digest!jrNKL_3isuc4kfF0Av0GfQ/dav/fs-type1/themes/ipiranga.institucionalv4.theme/assets/img/logo-ipiranga-azul.svg'},
    {name:'Magazine Luiza',domain:'magazineluiza.com.br'}
  ];
  function demoBrand(index) { return demoBrands[index % demoBrands.length]; }
  // Fallback vetorial para identidades de demonstração.
  function demoLogo(index) {
    var colors = ['#126ca0','#6553a2','#d27625','#127c80','#425b85','#54725a','#a65b72','#304c72'];
    var marks = [
      '<path d="M17 47V25l15-8 15 8v22M25 47V33h14v14M23 27h2m14 0h2"/>',
      '<circle cx="24" cy="25" r="6"/><circle cx="41" cy="25" r="6"/><path d="M13 47v-5a11 11 0 0 1 22 0v5m1-15a11 11 0 0 1 16 10v5"/>',
      '<path d="M16 27h32l-3 22H19l-3-22Zm8 0v-5a8 8 0 0 1 16 0v5"/><path d="m26 37 5 5 9-11"/>',
      '<path d="M13 44 25 20l9 18 7-13 10 19M20 44h25"/>',
      '<path d="m13 23 19-10 19 10v20L32 53 13 43V23Zm0 0 19 11 19-11M32 34v19"/>',
      '<path d="M15 19h34v28H15zM15 27h34M24 19v28M33 34h8m-8 6h8"/>',
      '<path d="M16 46V32h8v14m4 0V23h8v23m4 0V15h8v31M12 50h40"/>',
      '<path d="m32 12 20 12v16L32 52 12 40V24l20-12Zm0 11 10 6v7l-10 6-10-6v-7l10-6Z"/>'
    ];
    var color=colors[index % colors.length];
    var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="'+color+'"/><g fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">'+marks[index % marks.length]+'</g></svg>';
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  }

  function dateOnly(value) {
    return new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(value);
  }
  function createJobs(now) {
    var time = now == null ? Date.now() : new Date(now).getTime();
    return examples.map(function (item, index) {
      var published = new Date(time - item.idade * day);
      return {
        id:'demo-publica-' + String(index + 1).padStart(2, '0'), demo:true, demoPublica:true,
        empresa:item.confidencial ? 'Empresa confidencial' : demoBrand(index).name + ' (Demo)', empresaCnpj:'', empresaEmail:'',
        cargo:item.cargo, cidade:item.cidade, uf:'MG', area:item.area,
        modalidade:item.modalidade || 'Presencial', contrato:item.contrato || 'Efetivo – CLT',
        pcd:'Não exclusiva para PcD', salario:'R$ ' + item.salario.toLocaleString('pt-BR', {minimumFractionDigits:2}) + (item.comissao ? ' + comissão' : ''), salarioNumero:item.salario,
        descricao:item.descricao + '\n\nVaga de demonstração do +Empregos. Esta oportunidade é fictícia e não recebe candidaturas reais.',
        requisitos:item.requisitos, beneficios:item.beneficios || 'Vale-transporte; vale-alimentação; seguro de vida.',
        jornada:item.jornada || '44 horas semanais', horario:item.horario || 'Segunda a sexta, das 8h às 17h48',
        experiencia:/Aprendiz|Estágio/.test(item.cargo) ? 'Não exigida' : 'Desejável experiência na função',
        sobreEmpresa:'Demonstração visual do +Empregos. A marca é usada apenas como exemplo, sem vínculo com a empresa e sem anúncio real de contratação.',
        logo:!item.confidencial ? (demoBrand(index).logo || 'https://www.google.com/s2/favicons?domain=' + demoBrand(index).domain + '&sz=128') : '', tipoContato:'portal', contatoCandidatura:'',
        destaque:!!item.destaque, destaqueAte:item.destaque ? new Date(time + 15 * day).toISOString() : '',
        urgente:!!item.urgente, contratacaoUrgente:!!item.urgente, urgenteAte:item.urgente ? new Date(time + 7 * day).toISOString() : '',
        confidencial:!!item.confidencial, confidencialAte:item.confidencial ? new Date(time + 15 * day).toISOString() : '',
        dataPublicacao:dateOnly(published), criadoEm:published.toISOString(), expiraEm:dateOnly(new Date(published.getTime() + 45 * day)),
        status:'ativa', aprovacao:'aprovada', planoDias:45, totalCandidaturas:item.total, visualizacoes:0
      };
    });
  }
  function isDemo(job) { return !!job && job.demoPublica === true && /^demo-publica-\d{2}$/.test(String(job.id)); }

  function installAreaCarousel(win) {
    var doc = win.document;
    function mount() {
      var sidebar = doc.getElementById('filtrosLateral');
      var areas = doc.getElementById('emCategoriasHomeV2');
      var track = doc.getElementById('emCatTrackV2');
      var up = doc.getElementById('emCatPrevV2'), down = doc.getElementById('emCatNextV2');
      if (!sidebar || !areas || !track || !up || !down || areas.dataset.verticalCarousel) return;
      var viewport = areas.querySelector('.em-cat-viewport'), heading = areas.querySelector('h2');
      if (!viewport || !heading) return;

      // Keep the actual form nodes, event handlers and mobile filter toggle intact.
      var panel = doc.createElement('div'); panel.className = 'em-home-filter-panel';
      while (sidebar.firstChild) panel.appendChild(sidebar.firstChild);
      sidebar.appendChild(panel); sidebar.insertBefore(areas, panel);
      sidebar.classList.add('em-home-sidebar-areas');
      areas.dataset.verticalCarousel = '1';
      heading.id = 'emAreaCarouselHeading'; areas.setAttribute('aria-labelledby', heading.id);
      viewport.id = 'emAreaCarouselViewport'; viewport.tabIndex = 0;
      viewport.setAttribute('role', 'group'); viewport.setAttribute('aria-roledescription', 'carrossel');
      viewport.setAttribute('aria-label', 'Áreas profissionais. Use as setas para cima e para baixo para navegar.');
      var nav = areas.querySelector('.em-cat-nav');
      areas.insertBefore(up, viewport); areas.appendChild(down);
      if (nav) nav.remove();
      [up, down].forEach(function (button, index) {
        button.classList.add('em-area-carousel-control');
        button.setAttribute('aria-label', index ? 'Próximas áreas' : 'Áreas anteriores');
        button.setAttribute('aria-controls', viewport.id);
        button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(index ? 'm6 9 6 6 6-6' : 'm6 15 6-6 6 6')+'"/></svg>';
      });
      var status = doc.createElement('p'); status.className = 'em-area-carousel-status';
      status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite'); status.setAttribute('aria-atomic', 'true');
      areas.appendChild(status);
      var cards = Array.from(track.children), visible = 4;
      cards.forEach(function (card) {
        var arrow = card.querySelector('.em-cat-arrow');
        if (arrow) {
          arrow.setAttribute('aria-hidden', 'true');
          arrow.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>';
        }
      });
      function pitch() { return cards.length > 1 && cards[1].offsetTop - cards[0].offsetTop || 72; }
      function current() { return Math.min(Math.max(0, cards.length - visible), Math.max(0, Math.round(viewport.scrollTop / pitch()))); }
      function update() {
        var first = current(), last = Math.min(first + visible, cards.length);
        up.disabled = first === 0; down.disabled = last === cards.length;
        var text = cards.length ? (first + 1) + '–' + last + ' de ' + cards.length + ' áreas' : 'Sem áreas disponíveis';
        if (status.textContent !== text) status.textContent = text;
      }
      function move(index) {
        var first = Math.max(0, Math.min(cards.length - visible, index));
        var reduced = win.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
        viewport.scrollTo({top:first * pitch(), behavior:reduced ? 'auto' : 'smooth'});
      }
      up.onclick = function () { move(current() - 1); };
      down.onclick = function () { move(current() + 1); };
      viewport.addEventListener('scroll', update, {passive:true});
      viewport.addEventListener('keydown', function (event) {
        var index = current();
        if (event.key === 'ArrowUp') index--;
        else if (event.key === 'ArrowDown') index++;
        else if (event.key === 'PageUp') index -= visible;
        else if (event.key === 'PageDown') index += visible;
        else if (event.key === 'Home') index = 0;
        else if (event.key === 'End') index = cards.length - visible;
        else return;
        event.preventDefault(); move(index);
      });
      win.addEventListener('resize', update);
      update();
    }
    // The legacy filter initializer replaces the aside contents at DOMContentLoaded.
    // Mount after all of those callbacks, then retain the existing aside on mobile.
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', function () { win.setTimeout(mount, 0); }, {once:true});
    else mount();
    win.addEventListener('load', mount, {once:true});
  }

  function install(win) {
    var route = new URLSearchParams(win.location.search).get('pagina');
    if (win.__emPublicDemoJobs || route === 'demo-candidato' || route === 'demo-recrutador') return;
    win.__emPublicDemoJobs = true;
    var doc = win.document;
    // Replace only the two old built-in samples; remote and locally saved jobs stay intact.
    win.vagasPadrao = (Array.isArray(win.vagasPadrao) ? win.vagasPadrao : []).filter(function (job) {
      return job.id !== 'vaga1' && job.id !== 'vaga2' && !isDemo(job);
    }).concat(createJobs());

    // Legacy startup callbacks also request the home list while a detail page is open.
    // Build its cards when the visitor actually opens the home page.
    var renderHome = win.renderizarVagas;
    if (typeof renderHome === 'function') win.renderizarVagas = function () {
      var home = doc.getElementById('pagina-home');
      if (!home || !home.classList.contains('ativa')) return;
      return renderHome.apply(this, arguments);
    };

    var paths = {
      demo:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
      featured:'<path d="m12 3 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3L3 9.6l6.2-.9Z"/>',
      confidential:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
      new:'<path d="m10 3 2.2 5.8L18 11l-5.8 2.2L10 19l-2.2-5.8L2 11l5.8-2.2L10 3Z"/><path d="m19 2 .8 2.2L22 5l-2.2.8L19 8l-.8-2.2L16 5l2.2-.8L19 2Z"/>'
    };
    function badge(bar, kind, label) {
      var span = doc.createElement('span');
      span.className = 'em-public-demo-badge ' + kind;
      span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[kind] + '</svg>';
      var text = doc.createElement('span'); text.textContent = label; span.appendChild(text); bar.appendChild(span);
    }
    function enabled(value) { return value === true || value === 1 || /^(true|1)$/i.test(String(value)); }
    function recentCard(card, job, featured) {
      if (!card || featured || !card.classList.contains('em-lista-final')) return card;
      var home = doc.getElementById('pagina-home');
      if (!home || !home.classList.contains('ativa')) return card;
      job = job || {};
      var title = card.querySelector('.em-lista-titulo');
      var company = card.querySelector('.em-lista-empresa');
      var apply = card.querySelector('.em-lista-ver');
      if (!title || !company || !apply) return card;
      var highlighted = enabled(job.destaque) || enabled(job.emDestaque) || enabled(job.destacada);
      var confidential = typeof win.vagaEhConfidencialEM === 'function' ? win.vagaEhConfidencialEM(job) : enabled(job.confidencial);
      var originalLogo = card.querySelector('.em-logo-destaque-previa img,.em-lista-logo img');
      var originalSalary = card.querySelector('.em-lista-salario strong');
      var salaryValue = originalSalary && originalSalary.textContent.trim() || 'A combinar';
      var save = card.querySelector('.em-lista-fav');
      var originalSave = save && save.onclick;
      function node(tag, className, text) { var el = doc.createElement(tag); el.className = className; if (text != null) el.textContent = text; return el; }
      function svg(path) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>'; }
      function fact(className, path, text) { var el = node('span',className); el.innerHTML = svg(path); el.appendChild(node('span','',text)); return el; }
      var identity = node('div','em-r4-identity');
      var logo = node('div','em-r4-logo'); logo.setAttribute('aria-hidden','true');
      var copy = node('div','em-r4-copy');
      if (confidential) {
        company.textContent = 'Empresa confidencial'; company.onclick = null;
        card.setAttribute('data-empresa','Empresa confidencial');
        logo.innerHTML = svg('<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>');
      } else {
        var publicName = company.querySelector('span'); publicName = publicName ? publicName.textContent : company.textContent;
        if (originalLogo) { originalLogo.alt = ''; logo.appendChild(originalLogo); }
        else logo.textContent = String(publicName || 'Empresa').replace(/\(demo\)/ig,'').trim().split(/\s+/).slice(0,2).map(function(part){return part.charAt(0);}).join('').toLocaleUpperCase('pt-BR');
      }
      title.classList.add('em-r4-title'); title.title = title.textContent;
      company.classList.add('em-r4-company');
      company.querySelectorAll('.em-lista-nota-empresa').forEach(function(el){el.remove();});
      copy.appendChild(title); copy.appendChild(company);
      var rawDate = String(job.dataPublicacao || job.publicadaEm || job.criadoEm || '');
      var dateMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(rawDate);
      var date = node('div','em-r4-date',dateMatch ? 'Publicada em '+dateMatch[3]+'/'+dateMatch[2]+'/'+dateMatch[1] : 'Data de publicação não informada');
      if (isDemo(job)) date.appendChild(node('span','em-r4-demo',' · Demonstração'));
      copy.appendChild(date); identity.appendChild(logo); identity.appendChild(copy);
      var facts = node('div','em-r4-facts');
      var city = String(job.cidade || 'Localidade não informada').trim();
      var originalPlace = card.querySelector('.em-lista-meta-item b');
      var uf = String(job.uf || job.estado || '').trim();
      if (uf.length !== 2) { var suffix = originalPlace && /[/•–-]\s*([A-Za-z]{2})$/.exec(originalPlace.textContent.trim()); uf = suffix ? suffix[1] : ''; }
      facts.appendChild(fact('em-r4-location','<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',city+(uf.length===2?' – '+uf.toUpperCase():'')));
      var terms = node('div','em-r4-terms');
      terms.appendChild(fact('em-r4-modality','<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18"/>',job.modalidade || 'Modalidade não informada'));
      terms.appendChild(fact('em-r4-contract','<path d="M5 3h10l4 4v14H5ZM14 3v5h5M8 12h8M8 16h6"/>',String(job.contrato || job.tipoContrato || 'Contrato não informado').replace(/^Efetivo\s*[–-]\s*CLT$/i,'CLT')));
      facts.appendChild(terms);
      var distance = card.querySelector('.em-lista-distancia');
      if (distance) { distance.classList.add('em-r4-distance'); facts.appendChild(distance); }
      var actions = node('div','em-r4-actions');
      actions.appendChild(node('strong','em-r4-salary',salaryValue));
      apply.classList.add('em-r4-apply'); apply.textContent = 'Candidatar-se'; actions.appendChild(apply);
      var details = node('button','em-r4-details','Ver detalhes'); details.type = 'button'; details.setAttribute('data-vaga-id',String(job.id || ''));
      details.onclick = function(event){event.preventDefault();event.stopPropagation();if(typeof win.irPara==='function')win.irPara('vaga',job.id);else win.location.href=String(win.location.pathname || '')+'?pagina=vaga&id='+encodeURIComponent(job.id);};
      actions.appendChild(details);
      if (!save) { save = doc.createElement('button'); save.type = 'button'; }
      save.classList.add('em-r4-save'); save.setAttribute('data-vaga-id',String(job.id || ''));
      function updateSave(){var saved=typeof win.vagaEstaSalva==='function'&&win.vagaEstaSalva(job.id);save.setAttribute('aria-pressed',String(!!saved));save.setAttribute('aria-label',saved?'Remover vaga dos salvos':'Salvar vaga');save.title=saved?'Remover vaga dos salvos':'Salvar vaga';save.innerHTML=svg('<path d="M6 3h12v18l-6-4-6 4V3Z"/>');}
      save.onclick=function(event){event.preventDefault();event.stopPropagation();if(typeof originalSave==='function')originalSave.call(save,event);else if(typeof win.alternarFavorito==='function')win.alternarFavorito(job.id);updateSave();};
      updateSave();
      card.replaceChildren(identity,facts,actions,save);
      var label = highlighted ? 'Em destaque' : enabled(job.urgente) || enabled(job.contratacaoUrgente) ? 'Contratação urgente' : '';
      if (label) { var status=node('span','em-r4-status',label); status.setAttribute('data-kind',highlighted?'featured':'urgent'); card.appendChild(status); }
      card.classList.add('em-recent-model3','em-recent-discreet');
      card.setAttribute('data-em-highlighted',String(highlighted)); card.setAttribute('data-em-confidential',String(confidential));
      return card;
    }
    var makeCard = win.criarCardVaga;
    if (typeof makeCard === 'function') win.criarCardVaga = function (job, featured) {
      var card = makeCard.apply(this, arguments);
      if (!card || !isDemo(job)) return recentCard(card, job, featured);
      card.classList.add('em-public-demo-card');
      var bar = featured && card.querySelector('.em-featured-badges');
      if (!bar) {
        bar = doc.createElement('div');
        var heading = card.querySelector('.em-lista-cab,.dz-cab');
        if (heading) heading.appendChild(bar); else card.insertBefore(bar, card.firstChild);
      }
      bar.classList.add('em-public-demo-badges');
      badge(bar, 'demo', 'Demonstração');
      if (job.destaque && !featured) badge(bar, 'featured', 'Em destaque');
      if (job.confidencial) badge(bar, 'confidential', 'Confidencial');
      if (featured && Date.now() - new Date(job.criadoEm).getTime() < 2 * day) badge(bar, 'new', 'Nova vaga');
      return recentCard(card, job, featured);
    };

    function currentDemo() { return isDemo(win.vagaAtual); }
    function detailNotice() {
      var page = doc.getElementById('pagina-vaga'), notice = doc.getElementById('emPublicDemoJobNotice');
      if (!page) return;
      if (!currentDemo()) { if (notice) notice.remove(); return; }
      if (!notice) {
        notice = doc.createElement('p'); notice.id = 'emPublicDemoJobNotice'; notice.className = 'em-public-demo-notice'; notice.setAttribute('role', 'note');
        notice.textContent = 'Vaga de demonstração. Esta oportunidade é fictícia e não recebe candidaturas reais.';
        page.insertBefore(notice, page.firstChild);
      }
    }
    var openJob = win.abrirVaga;
    if (typeof openJob === 'function') win.abrirVaga = function () {
      var result = openJob.apply(this, arguments); detailNotice(); return result;
    };
    function explainDemo() {
      var message = 'Esta vaga é fictícia e serve para conhecer o +Empregos. Nenhum currículo será enviado.';
      if (typeof win.mostrarModalSite === 'function') win.mostrarModalSite('Vaga de demonstração', message, 'info', 'Entendi');
      else win.alert(message);
    }
    var contact = win.abrirContatoExternoVaga;
    if (typeof contact === 'function') win.abrirContatoExternoVaga = function (job) {
      if (isDemo(job || win.vagaAtual)) { explainDemo(); return; }
      return contact.apply(this, arguments);
    };
    // Window capture runs before the legacy document-level application handler.
    win.addEventListener('click', function (event) {
      var button = event.target && event.target.closest && event.target.closest('button,a');
      if (!currentDemo() || !button || !button.closest('#pagina-vaga') || !/candidatar/i.test(button.textContent || '')) return;
      event.preventDefault(); event.stopImmediatePropagation(); explainDemo();
    }, true);
    if (typeof win.renderizarVagas === 'function') win.renderizarVagas();
    detailNotice();
    installAreaCarousel(win);
  }
  return {criarVagas:createJobs, ehDemo:isDemo, instalar:install};
});

