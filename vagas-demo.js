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


  // Identidades vetoriais fictícias para as empresas de demonstração.
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
        empresa:item.confidencial ? 'Empresa confidencial' : item.empresa + ' (Demo)', empresaCnpj:'', empresaEmail:'',
        cargo:item.cargo, cidade:item.cidade, uf:'MG', area:item.area,
        modalidade:item.modalidade || 'Presencial', contrato:item.contrato || 'Efetivo – CLT',
        pcd:'Não exclusiva para PcD', salario:'R$ ' + item.salario.toLocaleString('pt-BR', {minimumFractionDigits:2}) + (item.comissao ? ' + comissão' : ''), salarioNumero:item.salario,
        descricao:item.descricao + '\n\nVaga de demonstração do +Empregos. Esta oportunidade é fictícia e não recebe candidaturas reais.',
        requisitos:item.requisitos, beneficios:item.beneficios || 'Vale-transporte; vale-alimentação; seguro de vida.',
        jornada:item.jornada || '44 horas semanais', horario:item.horario || 'Segunda a sexta, das 8h às 17h48',
        experiencia:/Aprendiz|Estágio/.test(item.cargo) ? 'Não exigida' : 'Desejável experiência na função',
        sobreEmpresa:'Empresa fictícia utilizada para demonstrar os recursos do +Empregos.',
        logo:item.destaque && !item.confidencial ? demoLogo(index) : '', tipoContato:'portal', contatoCandidatura:'',
        destaque:!!item.destaque, destaqueAte:item.destaque ? new Date(time + 15 * day).toISOString() : '',
        urgente:!!item.urgente, contratacaoUrgente:!!item.urgente, urgenteAte:item.urgente ? new Date(time + 7 * day).toISOString() : '',
        confidencial:!!item.confidencial, confidencialAte:item.confidencial ? new Date(time + 15 * day).toISOString() : '',
        dataPublicacao:dateOnly(published), criadoEm:published.toISOString(), expiraEm:dateOnly(new Date(published.getTime() + 45 * day)),
        status:'ativa', aprovacao:'aprovada', planoDias:45, totalCandidaturas:item.total, visualizacoes:0
      };
    });
  }
  function isDemo(job) { return !!job && job.demoPublica === true && /^demo-publica-\d{2}$/.test(String(job.id)); }

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
      card.classList.add('em-recent-model3');
      var highlighted = enabled(job.destaque) || enabled(job.emDestaque) || enabled(job.destacada);
      var confidential = typeof win.vagaEhConfidencialEM === 'function' ? win.vagaEhConfidencialEM(job) : enabled(job.confidencial);
      card.setAttribute('data-em-highlighted', String(highlighted));
      card.setAttribute('data-em-confidential', String(confidential));
      var logo = card.querySelector('.em-logo-destaque-previa,.em-lista-logo');
      if (logo && (!highlighted || confidential)) logo.remove();
      else if (logo) logo.classList.add('em-recent-logo');
      var header = card.querySelector('.em-lista-cab');
      var title = card.querySelector('.em-lista-titulo');
      var company = card.querySelector('.em-lista-empresa');
      if (!header || !title || !company) return card;
      var heading = doc.createElement('div'); heading.className = 'em-recent-heading';
      heading.appendChild(title); heading.appendChild(company); header.appendChild(heading);
      var labels = doc.createElement('div'); labels.className = 'em-recent-badges';
      ['.em-lista-urgente','.em-public-demo-badges','.em-lista-rapida'].forEach(function (selector) {
        var node = card.querySelector(selector); if (node) labels.appendChild(node);
      });
      if (highlighted && !labels.querySelector('.featured')) badge(labels, 'featured', 'Em destaque');
      if (confidential && !labels.querySelector('.confidential')) badge(labels, 'confidential', 'Confidencial');
      var published = new Date(job.criadoEm || job.dataPublicacao).getTime();
      if (Number.isFinite(published) && Date.now() >= published && Date.now() - published < 2 * day && !labels.querySelector('.new')) badge(labels, 'new', 'Nova vaga');
      var newBadge = labels.querySelector('.new'); if (newBadge) labels.appendChild(newBadge);
      if (labels.children.length) card.insertBefore(labels, header);
      var save = card.querySelector('.em-lista-fav');
      var originalSave = save && save.onclick;
      if (!save) { save = doc.createElement('button'); save.type = 'button'; }
      save.classList.add('em-recent-save'); save.setAttribute('data-vaga-id', String(job.id || ''));
      function updateSave() {
        var saved = typeof win.vagaEstaSalva === 'function' && win.vagaEstaSalva(job.id);
        save.setAttribute('aria-pressed', String(!!saved));
        save.setAttribute('aria-label', saved ? 'Remover vaga dos salvos' : 'Salvar vaga');
        save.title = saved ? 'Remover vaga dos salvos' : 'Salvar vaga';
        save.innerHTML = '<svg viewBox="0 0 24 24" fill="'+(saved?'currentColor':'none')+'" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z"/></svg><span>'+(saved?'Vaga salva':'Salvar vaga')+'</span>';
      }
      save.onclick = function (event) {
        event.preventDefault(); event.stopPropagation();
        if (typeof originalSave === 'function') originalSave.call(save, event);
        else if (typeof win.alternarFavorito === 'function') win.alternarFavorito(job.id);
        updateSave();
      };
      updateSave();
      var footer = card.querySelector('.em-lista-footer');
      if (!footer) { footer = doc.createElement('div'); footer.className = 'em-lista-footer'; card.appendChild(footer); }
      footer.insertBefore(save, footer.firstChild);
      var meta = card.querySelector('.em-lista-meta');
      var publication = card.querySelector('.em-lista-data');
      if (meta && publication) meta.appendChild(publication);

      var salary = meta && meta.querySelector('.em-lista-salario');
      if (salary && !salary.querySelector('.em-recent-salary-icon')) {
        var money = doc.createElement('span'); money.className = 'em-recent-salary-icon'; money.setAttribute('aria-hidden', 'true');
        money.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="9" cy="6" rx="6" ry="3"/><path d="M3 6v5c0 2 3 3 6 3m6-8v4M3 11v5c0 2 3 3 6 3"/><ellipse cx="16" cy="14" rx="5" ry="2.5"/><path d="M11 14v5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5v-5"/></svg>';
        salary.insertBefore(money, salary.firstChild);
      }
      var place = meta && meta.querySelector('.em-lista-meta-item b');
      if (place && job.cidade) {
        var uf = String(job.uf || '').trim();
        if (uf.length !== 2) { var suffix = /[/•–-]\s*([A-Za-z]{2})$/.exec(place.textContent.trim()); uf = suffix ? suffix[1] : ''; }
        place.textContent = String(job.cidade).trim() + (uf.length === 2 ? ' – ' + uf.toUpperCase() : '');
      }
      var actions = card.querySelector('.em-lista-acoes');
      if (actions && !actions.querySelector('.em-lista-detalhes')) {
        var details = doc.createElement('button'); details.type = 'button'; details.className = 'em-lista-detalhes';
        details.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 7h16M4 12h12M4 17h8"/></svg><span>Mais detalhes da vaga</span>';
        details.setAttribute('data-vaga-id', String(job.id || ''));
        details.onclick = function (event) {
          event.preventDefault(); event.stopPropagation();
          if (typeof win.irPara === 'function') win.irPara('vaga', job.id);
          else win.location.href = String(win.location.pathname || '') + '?pagina=vaga&id=' + encodeURIComponent(job.id);
        };
        actions.insertBefore(details, actions.firstChild);
      }
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
  }
  return {criarVagas:createJobs, ehDemo:isDemo, instalar:install};
});
