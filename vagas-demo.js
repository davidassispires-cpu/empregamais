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
        logo:'', tipoContato:'portal', contatoCandidatura:'',
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

    var paths = {
      demo:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
      featured:'<path d="m12 3 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3L3 9.6l6.2-.9Z"/>',
      confidential:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
      new:'<path d="m13 2-9 12h7l-1 8 10-12h-7Z"/>'
    };
    function badge(bar, kind, label) {
      var span = doc.createElement('span');
      span.className = 'em-public-demo-badge ' + kind;
      span.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths[kind] + '</svg>';
      var text = doc.createElement('span'); text.textContent = label; span.appendChild(text); bar.appendChild(span);
    }
    var makeCard = win.criarCardVaga;
    if (typeof makeCard === 'function') win.criarCardVaga = function (job, featured) {
      var card = makeCard.apply(this, arguments);
      if (!card || !isDemo(job)) return card;
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
      return card;
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
