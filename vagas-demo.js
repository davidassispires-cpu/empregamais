/* Public sample vacancies. No sample is saved to the production job store. */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root && root.document) api.instalar(root);
})(typeof window === 'undefined' ? null : window, function () {
  'use strict';
  var day = 86400000;

  function publicationLabel(value, now) {
    if (!value) return 'Não informada';
    var formatter = new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'});
    function calendar(date) {
      var p = formatter.formatToParts(date), result = {};
      p.forEach(function (part) { result[part.type] = part.value; });
      return [Number(result.year),Number(result.month),Number(result.day)];
    }
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
    var date = match ? [Number(match[1]),Number(match[2]),Number(match[3])] : null;
    if (!date) { var parsed = new Date(value); if (isNaN(parsed.getTime())) return 'Não informada'; date = calendar(parsed); }
    var current = calendar(now || new Date());
    var delta = (Date.UTC(current[0],current[1]-1,current[2])-Date.UTC(date[0],date[1]-1,date[2])) / 86400000;
    if (delta === 0) return 'Hoje';
    if (delta === 1) return 'Ontem';
    return String(date[2]).padStart(2,'0')+'/'+String(date[1]).padStart(2,'0')+'/'+date[0];
  }

  var examples = [
    {id:2,marca:'carrefour',cargo:'Analista de Recursos Humanos',empresa:'Conecta Pessoas',cidade:'Contagem',area:'Administração',salario:3800,idade:.15,destaque:true,modalidade:'Híbrido',total:24,
      descricao:'Condução de processos seletivos, integração de profissionais e apoio aos indicadores de RH.',requisitos:'Superior em Administração, Psicologia ou áreas afins e experiência com recrutamento.'},
    {id:3,marca:'ipiranga',cargo:'Auxiliar de E-commerce',empresa:'Vitrine Digital',cidade:'Betim',area:'Comercial, Vendas',salario:2200,idade:.25,destaque:true,urgente:true,total:5,
      descricao:'Cadastro de produtos, acompanhamento de pedidos e atendimento nos marketplaces.',requisitos:'Ensino médio completo, boa escrita e familiaridade com compras online.'},
    {id:5,cargo:'Auxiliar de Logística',empresa:'Operação Logística',cidade:'Contagem',area:'Logística',salario:2350,idade:3.5,confidencial:true,total:6,
      descricao:'Separação, conferência e organização de mercadorias no centro de distribuição.',requisitos:'Ensino médio completo e disponibilidade para atuar em escala.'},
    {id:6,marca:'carrefour',cargo:'Operador de Caixa',empresa:'Mercado da Praça',cidade:'Betim',area:'Comercial, Vendas',salario:1950,idade:.35,total:4,
      descricao:'Registro de compras, recebimento de pagamentos e fechamento de caixa.',requisitos:'Ensino médio completo e atenção ao atendimento e aos valores recebidos.'},
    {id:7,marca:'ipiranga',cargo:'Assistente Financeiro',empresa:'Gestão Horizonte',cidade:'Belo Horizonte',area:'Contábil, Finanças, Economia',salario:2900,idade:4,destaque:true,modalidade:'Híbrido',total:12,
      descricao:'Controle de contas a pagar e receber, conciliação bancária e atualização de planilhas.',requisitos:'Excel intermediário e experiência em rotinas financeiras.'},
    {id:8,cargo:'Recepcionista',empresa:'Atendimento Integrado',cidade:'Belo Horizonte',area:'Administração',salario:2000,idade:4.5,confidencial:true,total:16,
      descricao:'Recepção de visitantes, atendimento telefônico e organização da agenda.',requisitos:'Ensino médio completo, cordialidade e boa comunicação.'},
    {id:10,marca:'carrefour',cargo:'Analista de Marketing',empresa:'Ideia Digital',cidade:'Belo Horizonte',area:'Marketing',salario:4200,idade:6,destaque:true,modalidade:'Remoto',total:22,
      descricao:'Planejamento de conteúdo, acompanhamento de campanhas e análise de resultados digitais.',requisitos:'Experiência com redes sociais, métricas e ferramentas de marketing digital.'},
    {id:11,marca:'ipiranga',cargo:'Atendente de Relacionamento',empresa:'Conexão Atendimento',cidade:'Betim',area:'Comercial, Vendas',salario:1980,idade:.4,urgente:true,total:9,
      descricao:'Atendimento ao cliente por chat e telefone, registro de solicitações e acompanhamento de soluções.',requisitos:'Ensino médio completo, empatia e boa digitação.'},
    {id:14,marca:'carrefour',cargo:'Técnico de Suporte de TI',empresa:'Nexo Tecnologia',cidade:'Belo Horizonte',area:'Informática, TI, Telecomunicações',salario:3100,idade:7,destaque:true,modalidade:'Híbrido',total:14,
      descricao:'Suporte a usuários, configuração de equipamentos e acompanhamento de chamados técnicos.',requisitos:'Curso técnico em informática e conhecimentos de sistemas operacionais e redes.'},
    {id:15,marca:'ipiranga',cargo:'Conferente de Mercadorias',empresa:'Via Minas Logística',cidade:'Betim',area:'Logística',salario:2550,idade:2,urgente:true,total:21,
      descricao:'Conferência de notas fiscais, volumes e movimentações de entrada e saída de mercadorias.',requisitos:'Experiência com conferência e conhecimentos de controle de estoque.'},
    {id:17,cargo:'Assistente de Compras',empresa:'Suprimentos Corporativos',cidade:'Contagem',area:'Compras',salario:3200,idade:5,destaque:true,confidencial:true,total:10,
      descricao:'Cotação com fornecedores, acompanhamento de pedidos e controle de prazos de entrega.',requisitos:'Experiência com compras e domínio de planilhas.'},
    {id:18,marca:'carrefour',cargo:'Analista de Dados',empresa:'Horizonte Analytics',cidade:'Belo Horizonte',area:'Informática, TI, Telecomunicações',salario:6500,idade:8,destaque:true,modalidade:'Remoto',contrato:'Prestador de Serviços',jornada:'Horário flexível',horario:'Atuação por entregas, de segunda a sexta',total:26,
      descricao:'Construção de relatórios e painéis, análise de indicadores e apoio à tomada de decisões.',requisitos:'Experiência com SQL, Power BI e análise de dados.',beneficios:'Trabalho remoto; horário flexível; capacitação profissional.'},
    {id:19,cargo:'Auxiliar de Serviços Gerais',empresa:'Serviços Operacionais',cidade:'Betim',area:'Administração',salario:1800,idade:4,confidencial:true,contrato:'Temporário',total:11,
      descricao:'Limpeza e conservação de ambientes, reposição de materiais e organização dos espaços.',requisitos:'Responsabilidade e disponibilidade para atuação presencial.'},
    {"id":21,"cargo":"Auxiliar Administrativo","empresa":"Horizonte Serviços","cidade":"Belo Horizonte","area":"Administração","salario":2400,"idade":0.03,"total":4,
      "descricao":"Organização de documentos, atualização de planilhas e apoio às rotinas do escritório.","requisitos":"Ensino médio completo, boa comunicação e conhecimentos básicos de Excel."},
    {"id":22,"cargo":"Assistente Comercial","empresa":"Ponto Certo Comércio","cidade":"Contagem","area":"Comercial, Vendas","salario":2600,"idade":0.06,"total":6,
      "descricao":"Apoio à equipe comercial, elaboração de propostas e acompanhamento de pedidos.","requisitos":"Ensino médio completo e experiência com atendimento e rotinas comerciais."},
    {"id":23,"cargo":"Analista de Logística","empresa":"Rota Certa Distribuição","cidade":"Betim","area":"Logística","salario":3900,"idade":0.1,"destaque":true,"total":11,
      "descricao":"Planejamento de entregas, acompanhamento de indicadores e melhoria das rotas de distribuição.","requisitos":"Superior em Logística ou áreas afins e experiência com indicadores operacionais."},
    {"id":24,"cargo":"Recepcionista de Clínica","empresa":"Clínica Bem Viver","cidade":"Belo Horizonte","area":"Administração","salario":2100,"idade":0.18,"total":8,
      "descricao":"Recepção de pacientes, agendamento de consultas e organização dos atendimentos.","requisitos":"Ensino médio completo, cordialidade e familiaridade com sistemas de agenda."},
    {"id":25,"cargo":"Desenvolvedor Front-end","empresa":"Nexo Tecnologia","cidade":"Belo Horizonte","area":"Informática, TI, Telecomunicações","salario":5500,"idade":0.22,"destaque":true,"modalidade":"Remoto","total":13,
      "descricao":"Desenvolvimento de interfaces web acessíveis, manutenção de componentes e integração com APIs.","requisitos":"Experiência com JavaScript, HTML, CSS e desenvolvimento de interfaces responsivas.","beneficios":"Trabalho remoto; vale-alimentação; plano de saúde; capacitação profissional."},
    {"id":26,"cargo":"Auxiliar de Departamento Pessoal","empresa":"Conecta Pessoas","cidade":"Contagem","area":"Administração","salario":2500,"idade":0.28,"confidencial":true,"total":7,
      "descricao":"Apoio ao controle de ponto, organização de documentos e conferência de benefícios.","requisitos":"Conhecimentos de departamento pessoal e atenção à conferência de informações."},
    {"id":27,"cargo":"Operador de Empilhadeira","empresa":"Via Minas Logística","cidade":"Betim","area":"Logística","salario":2850,"idade":0.32,"urgente":true,"total":9,"horario":"Escala 6x1, das 14h às 22h20",
      "descricao":"Movimentação segura de cargas, organização do estoque e inspeção diária do equipamento.","requisitos":"Curso de operador de empilhadeira e experiência na função."},
    {"id":28,"cargo":"Analista Financeiro","empresa":"Gestão Horizonte","cidade":"Belo Horizonte","area":"Contábil, Finanças, Economia","salario":4100,"idade":0.38,"modalidade":"Híbrido","total":12,
      "descricao":"Análise de fluxo de caixa, conciliação bancária e preparação de relatórios financeiros.","requisitos":"Superior em Administração, Ciências Contábeis ou áreas afins e Excel intermediário."},
    {"id":29,"cargo":"Assistente de Mídias Sociais","empresa":"Ideia Digital","cidade":"Belo Horizonte","area":"Marketing","salario":2800,"idade":0.45,"modalidade":"Remoto","total":10,
      "descricao":"Programação de publicações, acompanhamento de comentários e apoio à produção de conteúdo.","requisitos":"Boa escrita, organização e familiaridade com ferramentas de redes sociais.","beneficios":"Trabalho remoto; vale-alimentação; auxílio-internet; cursos de aperfeiçoamento."},
    {"id":30,"cargo":"Técnico de Segurança do Trabalho","empresa":"Indústria Serra Azul","cidade":"Contagem","area":"Industrial, Produção, Fábrica","salario":3600,"idade":0.55,"confidencial":true,"total":5,
      "descricao":"Inspeções preventivas, orientação sobre segurança e acompanhamento dos registros da área.","requisitos":"Formação técnica em Segurança do Trabalho e experiência em ambiente industrial."},
    {"id":31,"cargo":"Assistente de Compras","empresa":"Suprimentos Minas","cidade":"Betim","area":"Compras","salario":2950,"idade":0.65,"total":7,
      "descricao":"Pesquisa de fornecedores, cotações e acompanhamento de pedidos e entregas.","requisitos":"Experiência em compras, organização e conhecimentos de planilhas."},
    {"id":32,"cargo":"Cozinheiro","empresa":"Sabor Mineiro","cidade":"Belo Horizonte","area":"Alimentação / Gastronomia","salario":2650,"idade":0.75,"total":6,"horario":"Escala 6x1, das 7h às 15h20",
      "descricao":"Preparo de refeições, controle de insumos e organização da cozinha conforme boas práticas.","requisitos":"Experiência em cozinha profissional e conhecimento de higiene e manipulação de alimentos.","beneficios":"Vale-transporte; alimentação no local; seguro de vida."},
    {"id":33,"cargo":"Vendedor Interno","empresa":"Nova Rota Comercial","cidade":"Betim","area":"Comercial, Vendas","salario":2300,"comissao":true,"idade":0.85,"total":14,
      "descricao":"Atendimento a clientes, apresentação de soluções e acompanhamento de propostas comerciais.","requisitos":"Boa comunicação, experiência com vendas e facilidade para trabalhar com metas."},
    {"id":34,"cargo":"Estoquista","empresa":"Armazém Central","cidade":"Contagem","area":"Logística","salario":2250,"idade":0.95,"confidencial":true,"total":8,
      "descricao":"Recebimento de mercadorias, organização do estoque e separação de pedidos.","requisitos":"Ensino médio completo e atenção à conferência e organização de produtos."},
    {"id":35,"cargo":"Estágio em Tecnologia da Informação","empresa":"Nuvem Soluções","cidade":"Belo Horizonte","area":"Informática, TI, Telecomunicações","salario":1500,"idade":1.05,"contrato":"Estágio","modalidade":"Híbrido","jornada":"30 horas semanais","horario":"Segunda a sexta, das 9h às 15h","total":5,
      "descricao":"Apoio ao atendimento de chamados, configuração de computadores e documentação técnica.","requisitos":"Cursando ensino superior em tecnologia. Não exige experiência.","beneficios":"Vale-transporte; seguro de vida; bolsa de estudos."},
    {"id":36,"cargo":"Jovem Aprendiz Administrativo","empresa":"Primeiro Passo Gestão","cidade":"Belo Horizonte","area":"Administração","salario":1100,"idade":1.15,"contrato":"Jovem Aprendiz","jornada":"20 horas semanais","horario":"Segunda a sexta, das 8h às 12h","total":6,
      "descricao":"Aprendizado em rotinas administrativas, arquivo de documentos e apoio ao atendimento interno.","requisitos":"Ensino médio em andamento ou completo. Não exige experiência.","beneficios":"Vale-transporte; vale-alimentação; formação profissional."},
    {"id":37,"cargo":"Auxiliar de Qualidade","empresa":"Vertex Industrial","cidade":"Betim","area":"Industrial, Produção, Fábrica","salario":2450,"idade":1.25,"confidencial":true,"total":7,
      "descricao":"Inspeção visual de produtos, registro de resultados e apoio às melhorias da produção.","requisitos":"Ensino médio completo, atenção aos detalhes e conhecimentos básicos de qualidade."},
    {"id":38,"cargo":"Supervisor Operacional","empresa":"Estrutura Serviços","cidade":"Contagem","area":"Administração","salario":4300,"idade":1.35,"confidencial":true,"destaque":true,"total":9,
      "descricao":"Acompanhamento das equipes, organização de escalas e análise dos indicadores de operação.","requisitos":"Experiência com liderança de equipes e organização de processos operacionais."},
    {"id":39,"cargo":"Auxiliar de Manutenção","empresa":"Base Tec Manutenção","cidade":"Belo Horizonte","area":"Industrial, Produção, Fábrica","salario":2400,"idade":1.45,"total":4,
      "descricao":"Apoio à manutenção preventiva, organização de ferramentas e registro de serviços executados.","requisitos":"Conhecimentos básicos de manutenção predial e disponibilidade para atuação presencial."},
    {"id":40,"cargo":"Assistente de Atendimento","empresa":"Conexão Atendimento","cidade":"Betim","area":"Comercial, Vendas","salario":2200,"idade":1.55,"confidencial":true,"urgente":true,"total":8,
      "descricao":"Atendimento por telefone e chat, registro de solicitações e acompanhamento das soluções.","requisitos":"Ensino médio completo, boa digitação, empatia e comunicação clara."}
  ];

  // Marcas mantidas apenas nas demonstrações existentes, sem vínculo ou anúncio real.
  var demoBrands = {
    carrefour:{name:'Carrefour',logo:'https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/carrefour/default.svg'},
    ipiranga:{name:'Postos Ipiranga',logo:'https://www.ipiranga.com.br/wps/contenthandler/pt-br/!ut/p/digest!jrNKL_3isuc4kfF0Av0GfQ/dav/fs-type1/themes/ipiranga.institucionalv4.theme/assets/img/logo-ipiranga-azul.svg'}
  };
  // Fallback vetorial para identidades de demonstração.
  function demoLogo(index) {
    var colors = ['#16658f','#566193','#b56f2a','#15777b','#53698b','#50745e','#9b596c','#355775','#785b92','#427b83','#74624a','#626d92'];
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
    var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="'+color+'10"/><g fill="none" stroke="'+color+'" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">'+marks[index % marks.length]+'</g></svg>';
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  }

  function dateOnly(value) {
    return new Intl.DateTimeFormat('en-CA', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(value);
  }
  function createJobs(now) {
    var time = now == null ? Date.now() : new Date(now).getTime();
    return examples.map(function (item) {
      var published = new Date(time - item.idade * day);
      var brand = !item.confidencial && (demoBrands[item.marca] || {name:item.empresa,logo:demoLogo(item.id)});
      return {
        id:'demo-publica-' + String(item.id).padStart(2, '0'), demo:true, demoPublica:true,
        empresa:item.confidencial ? 'Empresa confidencial' : brand.name + ' (Demo)', empresaCnpj:'', empresaEmail:'',
        cargo:item.cargo, cidade:item.cidade, uf:'MG', area:item.area,
        modalidade:item.modalidade || 'Presencial', contrato:item.contrato || 'Efetivo – CLT',
        pcd:'Não exclusiva para PcD', salario:'R$ ' + item.salario.toLocaleString('pt-BR', {minimumFractionDigits:2}) + (item.comissao ? ' + comissão' : ''), salarioNumero:item.salario,
        descricao:item.descricao + '\n\nVaga de demonstração do +Empregos. Esta oportunidade é fictícia e não recebe candidaturas reais.',
        requisitos:item.requisitos, beneficios:item.beneficios || 'Vale-transporte; vale-alimentação; seguro de vida.',
        jornada:item.jornada || '44 horas semanais', horario:item.horario || 'Segunda a sexta, das 8h às 17h48',
        experiencia:/Aprendiz|Estágio/.test(item.cargo) ? 'Não exigida' : 'Desejável experiência na função',
        sobreEmpresa:'Demonstração visual do +Empregos. A marca é usada apenas como exemplo, sem vínculo com a empresa e sem anúncio real de contratação.',
        logo:brand ? brand.logo : '', tipoContato:'portal', contatoCandidatura:'',
        destaque:!!item.destaque, destaqueAte:item.destaque ? new Date(time + 15 * day).toISOString() : '',
        urgente:!!item.urgente, contratacaoUrgente:!!item.urgente, urgenteAte:item.urgente ? new Date(time + 7 * day).toISOString() : '',
        confidencial:!!item.confidencial, confidencialAte:item.confidencial ? new Date(time + 15 * day).toISOString() : '',
        dataPublicacao:dateOnly(published), criadoEm:published.toISOString(), expiraEm:dateOnly(new Date(published.getTime() + 45 * day)),
        status:'ativa', aprovacao:'aprovada', planoDias:45, totalCandidaturas:item.total, visualizacoes:0
      };
    });
  }
  function isDemo(job) { return !!job && job.demoPublica === true && /^demo-publica-\d{2}$/.test(String(job.id)); }

  function excludedPublicCompany(job) {
    var name = String(job && job.empresa || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return /\b(?:drogaria\s+araujo|magazine\s+luiza|magalu)\b/.test(name);
  }

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
    // Keep the stylesheet version supplied by the page/deployment.
    var route = new URLSearchParams(win.location.search).get('pagina');
    if (win.__emPublicDemoJobs || route === 'demo-candidato' || route === 'demo-recrutador') return;
    win.__emPublicDemoJobs = true;
    var doc = win.document;
    // Replace only the two old built-in samples; remote and locally saved jobs stay intact.
    win.vagasPadrao = (Array.isArray(win.vagasPadrao) ? win.vagasPadrao : []).filter(function (job) {
      return job.id !== 'vaga1' && job.id !== 'vaga2' && !isDemo(job);
    }).concat(createJobs());

    var publicJobs = win.todasAsVagasPublicas;
    if (typeof publicJobs === 'function') win.todasAsVagasPublicas = function () {
      return publicJobs.apply(this, arguments).filter(function (job) { return !excludedPublicCompany(job); });
    };

    // Legacy startup callbacks also request the home list while a detail page is open.
    // Build its cards when the visitor actually opens the home page.
    var jobBrowser = null;
    var renderHome = win.renderizarVagas;
    if (typeof renderHome === 'function') win.renderizarVagas = function () {
      var home = doc.getElementById('pagina-home');
      if (!home || !home.classList.contains('ativa')) return;
      var result = renderHome.apply(this, arguments);
      syncJobBrowser();
      return result;
    };
    var filterHome = win.filtrarVagas;
    if (typeof filterHome === 'function') win.filtrarVagas = function () {
      var result = filterHome.apply(this, arguments);
      syncJobBrowser();
      return result;
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
    function companyIsConfidential(job) {
      return typeof win.vagaEhConfidencialEM === 'function' ? win.vagaEhConfidencialEM(job) : enabled(job && job.confidencial);
    }
    function companyRecord(job) {
      if (typeof win.empresaDaVagaEM === 'function') return win.empresaDaVagaEM(job);
      return job && job.empresaCnpj && typeof win.empresaPorCnpj === 'function' ? win.empresaPorCnpj(job.empresaCnpj) : null;
    }
    function demoCompanyKey(name) {
      return 'demo-empresa-' + String(name || '').replace(/\(demo\)/ig, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    var knownDemoCompanies = Object.create(null), verificationTrigger = null, verificationCard = null, verificationCloseTimer = null;
    function closeVerification() {
      if (verificationCloseTimer != null) { (win.clearTimeout || clearTimeout)(verificationCloseTimer); verificationCloseTimer = null; }
      if (verificationTrigger) { verificationTrigger.setAttribute('aria-expanded', 'false'); verificationTrigger.removeAttribute('aria-describedby'); }
      if (verificationCard) verificationCard.hidden = true;
      verificationTrigger = null;
    }
    function deferVerificationClose() {
      if (verificationCloseTimer != null) (win.clearTimeout || clearTimeout)(verificationCloseTimer);
      verificationCloseTimer = (win.setTimeout || setTimeout)(closeVerification, 150);
    }
    function openVerification(trigger, job) {
      closeVerification();
      if (!verificationCard) {
        verificationCard = browserNode('div', 'em-company-verification-card'); verificationCard.id = 'emCompanyVerificationCard';
        verificationCard.setAttribute('role', 'tooltip');
        verificationCard.onmouseenter = function () { if (verificationCloseTimer != null) { (win.clearTimeout || clearTimeout)(verificationCloseTimer); verificationCloseTimer = null; } };
        verificationCard.onmouseleave = deferVerificationClose;
      }
      verificationCard.replaceChildren(browserNode('strong', 'em-company-verification-heading', 'Empresa verificada'));
      verificationCard.appendChild(browserNode('p', '', 'Este selo indica que a empresa foi consultada, verificada e aprovada pelo +Empregos, sendo considerada idônea conforme os critérios de análise da plataforma.'));
      if (isDemo(job)) verificationCard.appendChild(browserNode('p', 'em-company-verification-demo', 'Demonstração: neste exemplo, o selo é ilustrativo. A marca é apresentada sem vínculo com a empresa e as vagas são fictícias.'));
      (trigger.closest('dialog') || doc.body).appendChild(verificationCard);
      verificationCard.hidden = false; verificationTrigger = trigger;
      trigger.setAttribute('aria-expanded', 'true'); trigger.setAttribute('aria-describedby', verificationCard.id);
      var rect = trigger.getBoundingClientRect(), viewportWidth = win.innerWidth || 1024, viewportHeight = win.innerHeight || 800;
      var width = Math.min(310, viewportWidth - 24); verificationCard.style.width = width + 'px';
      var height = verificationCard.getBoundingClientRect().height || 190;
      verificationCard.style.left = Math.max(12, Math.min(rect.left, viewportWidth - width - 12)) + 'px';
      verificationCard.style.top = Math.max(12, rect.bottom + height + 20 > viewportHeight ? rect.top - height - 8 : rect.bottom + 8) + 'px';
    }
    function verificationSeal(job) {
      var seal = browserNode('button', 'em-company-verification' + (isDemo(job) ? ' em-demo-verified' : '')); seal.type = 'button';
      seal.setAttribute('aria-label', 'Entender o selo de empresa verificada' + (isDemo(job) ? ' (demonstração)' : ''));
      seal.setAttribute('aria-controls', 'emCompanyVerificationCard'); seal.setAttribute('aria-expanded', 'false');
      seal.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" fill="currentColor"/><path d="m7.5 12 3 3 6-6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      seal.appendChild(browserNode('span', 'em-company-verification-label', 'Empresa verificada'));
      seal.onmouseenter = seal.onfocus = function () { openVerification(seal, job); };
      seal.onmouseleave = seal.onblur = deferVerificationClose;
      seal.onclick = function (event) { event.preventDefault(); event.stopPropagation(); openVerification(seal, job); };
      return seal;
    }
    function companyIdentity(company, job, displayName, originalClick) {
      if (!company || !job) return;
      if (companyIsConfidential(job)) { company.textContent = 'Empresa confidencial'; company.onclick = null; return; }
      var name = summaryText(displayName || job.empresa || company.textContent || 'Empresa');
      var record = isDemo(job) ? null : companyRecord(job), target = '';
      var legacyClick = originalClick || company.__emOriginalCompanyClick || company.onclick;
      company.__emOriginalCompanyClick = legacyClick; company.onclick = null;
      if (isDemo(job)) { target = demoCompanyKey(name); knownDemoCompanies[target] = {name:name, job:job}; }
      else if (record && record.cnpj && (typeof win.empresaPodeTerPerfilPublicoEM !== 'function' || win.empresaPodeTerPerfilPublicoEM(record))) target = String(record.cnpj);
      var link = browserNode(target ? 'a' : typeof legacyClick === 'function' ? 'button' : 'span', 'em-company-profile-link');
      link.appendChild(browserNode('span', 'em-company-name', name));
      if (target) {
        link.href = String(win.location.pathname || '') + '?pagina=empresa-publica&id=' + encodeURIComponent(target);
        link.setAttribute('href', link.href); link.setAttribute('aria-label', 'Ver página de ' + name);
        link.onclick = function (event) {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault(); event.stopPropagation(); closeVerification(); if (activeSummaryClose) activeSummaryClose(false);
          if (typeof win.irPara === 'function') win.irPara('empresa-publica', target); else win.location.href = link.href;
        };
      } else if (typeof legacyClick === 'function') {
        link.type = 'button'; link.onclick = function (event) { event.preventDefault(); event.stopPropagation(); closeVerification(); if (activeSummaryClose) activeSummaryClose(false); legacyClick.call(company, event); };
      }
      company.replaceChildren(link);
      var verified = isDemo(job) || record && typeof win.empresaEstaVerificada === 'function' && win.empresaEstaVerificada(record);
      if (verified) company.appendChild(verificationSeal(job));
    }
    function renderDemoCompanyProfile(id) {
      if (!/^demo-empresa-/.test(String(id || ''))) return false;
      var jobs = (Array.isArray(win.vagasPadrao) ? win.vagasPadrao : []).filter(function (job) { return isDemo(job) && !companyIsConfidential(job) && demoCompanyKey(job.empresa) === id; });
      var saved = knownDemoCompanies[id], base = jobs[0] || saved && saved.job;
      var page = doc.getElementById('pagina-empresa-publica');
      if (!base || !page) return false;
      if (!jobs.length) jobs = [base];
      closeVerification();
      if (typeof win.mostrarPagina === 'function') win.mostrarPagina('empresa-publica');
      var old = doc.getElementById('emDemoCompanyProfile'); if (old) old.remove();
      page.setAttribute('data-em-demo-profile', 'true');
      var root = browserNode('section', 'em-demo-company-profile'); root.id = 'emDemoCompanyProfile';
      var back = browserNode('a', 'em-dc-back', '← Voltar às vagas'); back.href = String(win.location.pathname || '') + '?pagina=home';
      back.onclick = function (event) { event.preventDefault(); if (typeof win.irPara === 'function') win.irPara('home'); };
      root.appendChild(back);
      var header = browserNode('header', 'em-dc-header');
      if (base.logo || base.logoEmpresa) { var logo = browserNode('img', 'em-dc-logo'); logo.src = base.logo || base.logoEmpresa; logo.alt = ''; header.appendChild(logo); }
      var heading = browserNode('div', 'em-dc-heading');
      heading.appendChild(browserNode('p', 'em-dc-eyebrow', 'Perfil de demonstração'));
      var name = browserNode('h1', '', base.empresa); name.id = 'emDemoCompanyTitle'; heading.appendChild(name); header.appendChild(heading); header.appendChild(verificationSeal(base));
      root.appendChild(header); root.setAttribute('aria-labelledby', name.id);
      var about = browserNode('section', 'em-dc-about'); about.appendChild(browserNode('h2', '', 'Sobre a empresa'));
      about.appendChild(browserNode('p', '', 'Esta página é um exemplo visual do +Empregos. A marca é apresentada sem vínculo com a empresa. As oportunidades abaixo são fictícias e não recebem candidaturas reais.')); root.appendChild(about);
      var vacancies = browserNode('section', 'em-dc-vacancies'); vacancies.appendChild(browserNode('h2', '', 'Vagas de demonstração (' + jobs.length + ')'));
      var list = browserNode('div', 'em-dc-jobs');
      jobs.forEach(function (job) {
        var card = browserNode('article', 'em-dc-job'), title = browserNode('h3', ''), link = browserNode('a', '', job.cargo);
        link.href = String(win.location.pathname || '') + '?pagina=vaga&id=' + encodeURIComponent(job.id);
        link.onclick = function (event) { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); if (typeof win.irPara === 'function') win.irPara('vaga', job.id); };
        title.appendChild(link); card.appendChild(title);
        card.appendChild(browserNode('p', '', [job.cidade + (job.uf ? ' – ' + job.uf : ''), job.modalidade, job.contrato].filter(Boolean).join(' · ')));
        card.appendChild(browserNode('strong', 'em-dc-salary', job.salario || 'A combinar')); list.appendChild(card);
      });
      vacancies.appendChild(list); root.appendChild(vacancies); page.appendChild(root);
      if (typeof win.scrollTo === 'function') win.scrollTo(0, 0);
      return true;
    }
    var originalPublicCompany = win.abrirPerfilEmpresaPublica;
    win.abrirPerfilEmpresaPublica = function (id) {
      if (renderDemoCompanyProfile(String(id || ''))) return;
      var page = doc.getElementById('pagina-empresa-publica'), demoProfile = doc.getElementById('emDemoCompanyProfile');
      if (page) page.removeAttribute('data-em-demo-profile'); if (demoProfile) demoProfile.remove();
      if (typeof originalPublicCompany === 'function') return originalPublicCompany.apply(this, arguments);
    };
    win.addEventListener('click', function (event) { if (verificationTrigger && event.target && typeof event.target.closest === 'function' && !event.target.closest('.em-company-verification,.em-company-verification-card')) closeVerification(); }, true);
    win.addEventListener('keydown', function (event) { if (event.key === 'Escape' && verificationTrigger) { event.preventDefault(); event.stopPropagation(); closeVerification(); } }, true);
    win.addEventListener('scroll', closeVerification, true);
    win.addEventListener('resize', closeVerification);
    var activeSummaryClose = null;
    function summaryText(value, limit) {
      var text = Array.isArray(value) ? value.join('; ') : String(value == null ? '' : value);
      text = text.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '').replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|li)>/gi, '\n').replace(/<\/?[a-z][^>]*>/gi, '')
        .replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&quot;/gi, '"').replace(/&#39;/g, "'")
        .replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').replace(/\n{3,}/g, '\n\n').trim();
      return limit && text.length > limit ? text.slice(0, limit).replace(/\s+\S*$/, '') + '…' : text;
    }
    function openJobSummary(job, info, apply, trigger) {
      if (activeSummaryClose) activeSummaryClose(false);
      function node(tag, className, text) {
        var el = doc.createElement(tag); el.className = className;
        if (text != null) el.textContent = text;
        return el;
      }
      var dialog = node('dialog', 'em-job-summary'); dialog.id = 'emRecentJobSummary';
      dialog.setAttribute('aria-labelledby', 'emRecentSummaryTitle');
      dialog.setAttribute('aria-describedby', 'emRecentSummaryCompany');
      var fallback = null, disposed = false;
      function cleanup(restoreFocus) {
        if (disposed) return;
        disposed = true;
        if (activeSummaryClose === dismiss) activeSummaryClose = null;
        trigger.setAttribute('aria-expanded', 'false');
        dialog.remove(); if (fallback) fallback.remove();
        if (restoreFocus && trigger.isConnected !== false && typeof trigger.focus === 'function') trigger.focus();
      }
      function dismiss(restoreFocus) {
        if (dialog.open && typeof dialog.close === 'function') dialog.close();
        cleanup(restoreFocus !== false);
      }
      function openFullJob() {
        dismiss(false);
        if (typeof win.irPara === 'function') win.irPara('vaga', job.id);
        else win.location.href = String(win.location.pathname || '') + '?pagina=vaga&id=' + encodeURIComponent(job.id);
      }
      activeSummaryClose = dismiss;
      var header = node('header', 'em-js-header');
      var heading = node('div', 'em-js-heading');
      heading.appendChild(node('span', 'em-js-eyebrow', 'Resumo da vaga'));
      var title = node('h2', 'em-js-title', summaryText(info.title)); title.id = 'emRecentSummaryTitle';
      heading.appendChild(title);
      var company = node('p', 'em-js-company', summaryText(info.company)); company.id = 'emRecentSummaryCompany';
      companyIdentity(company, job, info.company);
      heading.appendChild(company); header.appendChild(heading);
      var close = node('button', 'em-js-close', '×'); close.type = 'button';
      close.setAttribute('aria-label', 'Fechar resumo da vaga'); close.setAttribute('autofocus', '');
      close.onclick = function () { dismiss(true); }; header.appendChild(close); dialog.appendChild(header);
      var body = node('div', 'em-js-body'), facts = node('dl', 'em-js-facts');
      function addFact(label, value, salary) {
        var text = summaryText(value, 180); if (!text) return;
        var fact = node('div', 'em-js-fact' + (salary ? ' em-js-pay' : ''));
        fact.appendChild(node('dt', '', label)); fact.appendChild(node('dd', '', text)); facts.appendChild(fact);
      }
      addFact('Local', info.location); addFact('Salário', info.salary, true);
      addFact('Modalidade', job.modalidade || 'Não informada');
      addFact('Contrato', job.contrato || job.tipoContrato || 'Não informado');
      addFact('Jornada', job.jornada); addFact('Horário', job.horario);
      body.appendChild(facts);
      function addSection(label, value, limit) {
        var text = summaryText(value, limit); if (!text) return;
        var section = node('section', 'em-js-section');
        section.appendChild(node('h3', '', label)); section.appendChild(node('p', '', text)); body.appendChild(section);
      }
      addSection('Sobre a vaga', job.descricao || job.descricaoVaga || job.resumo || 'A empresa não informou a descrição desta vaga.', 650);
      addSection('Requisitos', job.requisitos, 420); addSection('Benefícios', job.beneficios, 350);
      if (info.date) body.appendChild(node('p', 'em-js-date', summaryText(info.date)));
      if (isDemo(job)) {
        var note = node('p', 'em-js-demo', 'Vaga de demonstração. Esta oportunidade é fictícia e não recebe candidaturas reais.');
        note.setAttribute('role', 'note'); body.appendChild(note);
      }
      dialog.appendChild(body);
      var footer = node('footer', 'em-js-footer');
      var full = node('button', 'em-js-full', 'Ver vaga completa'); full.type = 'button'; full.onclick = openFullJob;
      var candidate = node('button', 'em-js-apply', 'Candidatar-se'); candidate.type = 'button';
      candidate.onclick = function () { dismiss(false); apply.click(); };
      footer.appendChild(full); footer.appendChild(candidate); dialog.appendChild(footer);
      dialog.addEventListener('close', function () { cleanup(true); });
      dialog.addEventListener('cancel', function (event) { event.preventDefault(); dismiss(true); });
      dialog.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') { event.preventDefault(); dismiss(true); return; }
        if (event.key !== 'Tab') return;
        var buttons = Array.prototype.filter.call(dialog.querySelectorAll('button'), function (button) { return !button.disabled; });
        var first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && doc.activeElement === last) { event.preventDefault(); first.focus(); }
      });
      dialog.addEventListener('click', function (event) {
        if (event.target !== dialog) return;
        var rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dismiss(true);
      });
      doc.body.appendChild(dialog); trigger.setAttribute('aria-expanded', 'true');
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else {
        fallback = node('div', 'em-job-summary-backdrop'); fallback.setAttribute('aria-hidden', 'true');
        fallback.onclick = function () { dismiss(true); }; doc.body.insertBefore(fallback, dialog);
        dialog.setAttribute('open', ''); dialog.setAttribute('role', 'dialog');
        dialog.setAttribute('aria-modal', 'true'); dialog.setAttribute('data-fallback', 'true');
      }
      close.focus();
    }
    function browserNode(tag, className, text) {
      var el = doc.createElement(tag); el.className = className;
      if (text != null) el.textContent = text;
      return el;
    }
    function narrowJobBrowser() {
      return win.matchMedia ? win.matchMedia('(max-width:900px)').matches : win.innerWidth <= 900;
    }
    function updateJobPanelInset(state) {
      var top = 24;
      var header = typeof doc.querySelector === 'function' ? doc.querySelector('body > header') : null;
      if (header && typeof win.getComputedStyle === 'function') {
        var position = win.getComputedStyle(header).position;
        if (position === 'fixed' || position === 'sticky') top = Math.max(top, Math.ceil(header.getBoundingClientRect().bottom) + 16);
      }
      if (typeof state.root.style.setProperty === 'function') state.root.style.setProperty('--em-job-panel-top', top + 'px');
    }
    function mountJobBrowser() {
      if (jobBrowser) return jobBrowser;
      var home = doc.getElementById('pagina-home'), list = doc.getElementById('listaVagas');
      var column = list && list.parentNode, area = column && column.parentNode;
      if (!home || !list || !column || !area) return null;
      var root = browserNode('div', 'em-job-browser'); root.id = 'emJobBrowser';
      root.setAttribute('data-view', 'list');
      root.setAttribute('data-layout', 'model-one');
      root.setAttribute('data-presentation', 'priority');
      var panel = browserNode('section', 'em-job-panel'); panel.id = 'emJobPanel';
      panel.setAttribute('aria-label', 'Detalhes da vaga');
      var status = browserNode('p', 'em-job-selection-status');
      status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
      var controls = browserNode('div', 'em-job-browser-controls');
      var toolbar = column.querySelector('.vagas-toolbar');
      if (toolbar) controls.appendChild(toolbar);
      area.insertBefore(controls, column); area.insertBefore(root, column);
      column.classList.add('em-job-results'); root.appendChild(column); root.appendChild(panel); root.appendChild(status);
      area.classList.add('em-job-browser-layout'); home.classList.add('em-job-browser-active');
      jobBrowser = {root:root, list:list, panel:panel, status:status, selected:null, trigger:null, scroll:0, filters:null};
      updateJobPanelInset(jobBrowser);
      var sidebar = doc.getElementById('filtrosLateral');
      if (sidebar && sidebar.parentNode === area) {
        var filters = browserNode('details', 'em-job-browser-filters'); filters.id = 'emJobBrowserFilters';
        filters.appendChild(browserNode('summary', '', 'Filtros e áreas'));
        filters.appendChild(sidebar); controls.appendChild(filters); jobBrowser.filters = filters;
        var toggleFilters = win.alternarFiltrosMobile;
        win.alternarFiltrosMobile = function () {
          if (home.classList.contains('ativa')) { filters.open = !filters.open; return; }
          if (typeof toggleFilters === 'function') return toggleFilters.apply(this, arguments);
        };
        var focusFilter = win.abrirFiltrosEFocar;
        if (typeof focusFilter === 'function') win.abrirFiltrosEFocar = function () {
          filters.open = true; return focusFilter.apply(this, arguments);
        };
      }
      if (typeof win.MutationObserver === 'function') {
        var pending = false;
        var observer = new win.MutationObserver(function () {
          if (pending) return;
          pending = true;
          (win.requestAnimationFrame || win.setTimeout).call(win, function () { pending = false; syncJobBrowser(); });
        });
        observer.observe(list, {childList:true, subtree:true, attributes:true, attributeFilter:['style','hidden']});
      }
      win.addEventListener('resize', function () { updateJobPanelInset(jobBrowser); syncJobBrowser(); });
      win.addEventListener('load', function () { updateJobPanelInset(jobBrowser); }, {once:true});
      return jobBrowser;
    }
    function browserCards(state) {
      return Array.prototype.filter.call(state.list.children, function (card) {
        if (!card.__emJobEntry || card.hidden || card.getAttribute('hidden') != null || card.style.display === 'none') return false;
        return !win.getComputedStyle || win.getComputedStyle(card).display !== 'none';
      });
    }
    function similarText(value) {
      return summaryText(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    }
    function similarCompanyKey(job) {
      if (companyIsConfidential(job)) return '';
      var name = similarText(job.empresa);
      if (!name || /^(empresa|empresa confidencial|empresa nao informada)$/.test(name)) return '';
      if (isDemo(job)) return demoCompanyKey(job.empresa);
      var cnpj = String(job.empresaCnpj || '').replace(/\D/g, '');
      if (cnpj) return 'cnpj:' + cnpj;
      if (job.empresaEmail) return 'email:' + String(job.empresaEmail).trim().toLowerCase();
      return 'company:' + name;
    }
    function similarJobIsPublic(job) {
      if (!job || !job.id || excludedPublicCompany(job) || companyIsConfidential(job)) return false;
      if (job.aprovacao && job.aprovacao !== 'aprovada') return false;
      var status = typeof win.statusDaVaga === 'function' ? win.statusDaVaga(job) : job.status || 'ativa';
      if (!/^(ativa|ativo|publicada|publicado)$/i.test(String(status))) return false;
      if (typeof win.vagaExpirada === 'function') return !win.vagaExpirada(job);
      var expiry = String(job.expiraEm || '');
      if (/^\d{4}-\d{2}-\d{2}$/.test(expiry)) expiry += 'T23:59:59';
      return !expiry || !isFinite(new Date(expiry).getTime()) || new Date(expiry).getTime() >= Date.now();
    }
    var similarListSequence = 0;
    function syncSimilarVacancies(state) {
      var catalog = typeof win.todasAsVagasPublicas === 'function' ? win.todasAsVagasPublicas() :
        Array.from(state.list.children).filter(function (card) { return card.__emJobEntry; }).map(function (card) { return card.__emJobEntry.job; });
      var groups = Object.create(null), seen = Object.create(null);
      (Array.isArray(catalog) ? catalog : []).forEach(function (job) {
        if (!similarJobIsPublic(job) || seen[String(job.id)]) return;
        seen[String(job.id)] = true;
        var key = similarCompanyKey(job); if (key) (groups[key] || (groups[key] = [])).push(job);
      });
      Array.from(state.list.children).forEach(function (card) {
        var entry = card.__emJobEntry; if (!entry) return;
        var job = entry.job, key = similarCompanyKey(job), area = similarText(job.area), title = similarText(job.cargo);
        var peers = (similarJobIsPublic(job) && key ? groups[key] || [] : []).filter(function (other) {
          return String(other.id) !== String(job.id) && isDemo(other) === isDemo(job) &&
            ((area && area === similarText(other.area)) || (title && title === similarText(other.cargo)));
        });
        var signature = JSON.stringify(peers.map(function (peer) { return [peer.id,peer.cargo,peer.empresa,peer.cidade,peer.uf,peer.salario]; }));
        if (signature === entry.similarSignature) return;
        entry.similarSignature = signature;
        if (entry.similarBox) entry.similarBox.remove();
        entry.similarBox = null;
        if (!peers.length) return;
        var box = browserNode('div', 'em-r4-similar'), toggle = browserNode('button', 'em-r4-similar-toggle', 'Exibir vagas similares dessa empresa');
        var list = browserNode('div', 'em-r4-similar-list'); list.id = 'emSimilarJobs' + (++similarListSequence); list.hidden = true;
        list.setAttribute('role', 'list'); list.setAttribute('aria-label', 'Vagas similares dessa empresa');
        toggle.type = 'button'; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-controls', list.id);
        toggle.onclick = function (event) {
          event.preventDefault(); event.stopPropagation(); list.hidden = !list.hidden;
          toggle.setAttribute('aria-expanded', String(!list.hidden));
          toggle.textContent = list.hidden ? 'Exibir vagas similares dessa empresa' : 'Ocultar vagas similares dessa empresa';
        };
        peers.forEach(function (peer) {
          var item = browserNode('article', 'em-r4-similar-card'); item.setAttribute('role', 'listitem');
          var link = browserNode('a', 'em-r4-similar-open', summaryText(peer.cargo));
          link.href = String(win.location.pathname || '') + '?pagina=vaga&id=' + encodeURIComponent(peer.id);
          link.setAttribute('href', link.href); item.appendChild(link);
          item.appendChild(browserNode('p', 'em-r4-similar-company', summaryText(peer.empresa).replace(/\s*\(demo\)/ig, '') + (isDemo(peer) ? ' · Demo' : '')));
          var uf = summaryText(peer.uf || peer.estado), city = summaryText(peer.cidade || 'Localidade não informada');
          item.appendChild(browserNode('p', 'em-r4-similar-location', city + (uf.length === 2 ? ' – ' + uf.toUpperCase() : '')));
          item.appendChild(browserNode('strong', 'em-r4-similar-salary', summaryText(peer.salario || 'A combinar')));
          if (typeof win.alternarFavorito === 'function') {
            var save = browserNode('button', 'em-r4-similar-save'); save.type = 'button';
            function updateSimilarSave() {
              var saved = typeof win.vagaEstaSalva === 'function' && win.vagaEstaSalva(peer.id);
              save.setAttribute('aria-pressed', String(!!saved));
              save.setAttribute('aria-label', (saved ? 'Remover vaga dos salvos: ' : 'Salvar vaga: ') + summaryText(peer.cargo));
              save.innerHTML = '<svg viewBox="0 0 24 24" fill="' + (saved ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z"/></svg><span class="em-jb-save-label">'+(saved ? 'Vaga salva' : 'Salvar vaga')+'</span>';
            }
            save.onclick = function (event) { event.preventDefault(); event.stopPropagation(); win.alternarFavorito(peer.id); updateSimilarSave(); };
            updateSimilarSave(); item.appendChild(save);
          }
          list.appendChild(item);
        });
        box.appendChild(toggle); box.appendChild(list); entry.similarBox = box; card.appendChild(box);
      });
    }
    function markBrowserSelection(state, selected) {
      Array.prototype.forEach.call(state.list.children, function (card) {
        var entry = card.__emJobEntry; if (!entry) return;
        var active = card === selected;
        card.setAttribute('data-em-selected', String(active));
        entry.titleButton.setAttribute('aria-controls', 'emJobPanel');
        entry.titleButton.setAttribute('aria-expanded', String(active));
        entry.titleButton.setAttribute('aria-current', String(active));
        entry.titleButton.removeAttribute('aria-haspopup');
        if (entry.openState) entry.openState.setAttribute('aria-hidden', String(!active));
      });
    }
    function returnToJobList(state) {
      state.root.setAttribute('data-view', 'list');
      if (state.trigger && state.trigger.isConnected && typeof state.trigger.focus === 'function') state.trigger.focus({preventScroll:true});
      if (typeof win.scrollTo === 'function') win.scrollTo(0, state.scroll);
    }
    function locateSelectedJob(state) {
      var card = state.selected;
      if (!card || browserCards(state).indexOf(card) === -1) return;
      if (narrowJobBrowser()) state.root.setAttribute('data-view', 'list');
      if (typeof card.scrollIntoView === 'function') card.scrollIntoView({block:'nearest', inline:'nearest', behavior:'auto'});
      state.trigger = card.__emJobEntry.titleButton;
      state.trigger.focus({preventScroll:true});
      state.status.textContent = 'Vaga em visualização localizada na lista: ' + card.__emJobEntry.info.title;
    }
    function fillJobPanel(state, card) {
      closeVerification();
      var entry = card.__emJobEntry, job = entry.job, info = entry.info;
      var panel = state.panel; panel.replaceChildren(); panel.scrollTop = 0;
      panel.setAttribute('data-vaga-id', String(job.id || ''));
      panel.setAttribute('data-em-highlighted', String(entry.highlighted));
      panel.setAttribute('data-em-priority', enabled(job.urgente) || enabled(job.contratacaoUrgente) ? 'urgent' : entry.highlighted ? 'featured' : 'standard');
      panel.setAttribute('aria-labelledby', 'emJobPanelTitle');
      var back = browserNode('button', 'em-jb-back', '← Voltar às vagas'); back.type = 'button';
      back.onclick = function () { returnToJobList(state); }; panel.appendChild(back);
      var context = browserNode('div', 'em-jb-context'); context.setAttribute('role', 'group'); context.setAttribute('aria-label', 'Vaga em visualização');
      var contextCopy = browserNode('div', 'em-jb-context-copy');
      contextCopy.appendChild(browserNode('span', 'em-jb-context-label', 'Em visualização'));
      var contextTitle = browserNode('span', 'em-jb-context-title', summaryText(info.title)); contextTitle.title = summaryText(info.title);
      contextCopy.appendChild(contextTitle); context.appendChild(contextCopy);
      var locate = browserNode('button', 'em-jb-locate', 'Localizar na lista'); locate.type = 'button';
      locate.setAttribute('aria-label', 'Localizar ' + summaryText(info.title) + ' na lista');
      locate.onclick = function () { locateSelectedJob(state); }; context.appendChild(locate);
      var header = browserNode('header', 'em-jb-header em-jb-header-model2 em-jb-info-model2');
      header.appendChild(browserNode('p', 'em-jb-job-id', 'ID da vaga: ' + String(job.id || '')));
      var headerContent = browserNode('div', 'em-jb-header-content'); header.appendChild(headerContent);
      var logo = browserNode('div', 'em-jb-logo'); logo.setAttribute('aria-hidden', 'true');
      var sourceLogo = entry.confidential ? null : card.querySelector('.em-r4-logo img');
      var initials = entry.confidential ? '' : summaryText(info.company).replace(/\(demo\)/ig, '').trim().split(/\s+/).slice(0,2).map(function (word) { return word.charAt(0); }).join('').toLocaleUpperCase('pt-BR');
      if (sourceLogo) {
        var image = doc.createElement('img'); image.src = sourceLogo.getAttribute('src') || sourceLogo.src; image.alt = '';
        image.onerror = function () { logo.textContent = initials; }; logo.appendChild(image);
      } else if (entry.confidential) {
        logo.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg>';
      } else logo.textContent = initials;
      headerContent.appendChild(logo);
      var identity = browserNode('div', 'em-jb-identity'); headerContent.appendChild(identity);
      identity.appendChild(header.querySelector('.em-jb-job-id'));
      var badges = browserNode('div', 'em-jb-badges');
      if (entry.highlighted) badges.appendChild(browserNode('span', 'em-jb-badge', 'Destaque'));

      var title = browserNode('h2', 'em-jb-title', summaryText(info.title)); title.id = 'emJobPanelTitle'; title.tabIndex = -1;
      var titleLine = browserNode('div', 'em-jb-title-line'); titleLine.appendChild(title);
      if (badges.children.length) titleLine.appendChild(badges);
      identity.appendChild(titleLine);
      var company = browserNode('div', 'em-jb-company');
      companyIdentity(company, job, info.company, entry.company.__emOriginalCompanyClick);
      var companyName = company.querySelector('.em-company-name');
      if (isDemo(job) && companyName) companyName.textContent = companyName.textContent.replace(/\s*\(demo\)/ig, '');
      identity.appendChild(company);
      var headerMeta = browserNode('div', 'em-jb-header-meta');
      function headerFact(className, label, text, path) {
        var fact = browserNode('p', className);
        fact.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>';
        var copy = browserNode('span', 'em-jb-fact-copy');
        copy.appendChild(browserNode('small', 'em-jb-fact-label', label));
        copy.appendChild(browserNode('span', 'em-jb-fact-value', summaryText(text)));
        fact.appendChild(copy); headerMeta.appendChild(fact);
      }
      var contract = String(job.contrato || job.tipoContrato || '').replace(/^Efetivo\s*[–-]\s*CLT$/i, 'CLT');
      var rawPublished = job.dataPublicacao || job.publicadaEm || job.criadoEm || '';
      var publishedLabel = publicationLabel(rawPublished);
      headerFact('em-jb-location', 'Local', info.location, '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>');
      headerFact('em-jb-header-modality', 'Modalidade', [job.modalidade || 'Não informada', contract].filter(Boolean).join(' · '), '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18"/>');
      headerFact('em-jb-header-pay', 'Salário', info.salary, '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M5 8h1M18 16h1"/>');
      headerFact('em-jb-header-published', 'Publicado em', publishedLabel, '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h2M13 14h2M7 18h2"/>');
      var candidate = browserNode('button', 'em-jb-apply', 'Candidatar-se'); candidate.type = 'button';
      candidate.onclick = function () {
        if (isDemo(job)) { explainDemo(); return; }
        if (typeof win.abrirContatoExternoVaga === 'function') win.abrirContatoExternoVaga(job);
        else entry.apply.click();
      };
      var save = browserNode('button', 'em-jb-save'); save.type = 'button';
      function savedState() {
        var saved = typeof win.vagaEstaSalva === 'function' ? win.vagaEstaSalva(job.id) : entry.save.getAttribute('aria-pressed') === 'true';
        var label = saved ? 'Remover vaga dos salvos' : 'Salvar vaga';
        save.setAttribute('aria-label', label); save.title = label; save.setAttribute('aria-pressed', String(!!saved));
        save.innerHTML = '<svg viewBox="0 0 24 24" fill="'+(saved ? 'currentColor' : 'none')+'" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z"/></svg><span class="em-jb-save-label">'+(saved ? 'Vaga salva' : 'Salvar vaga')+'</span>';
      }
      savedState(); save.onclick = function () { entry.save.click(); savedState(); };
      var headerActions = browserNode('div', 'em-jb-header-actions');
      headerActions.appendChild(candidate); headerActions.appendChild(save); headerContent.appendChild(headerActions);
      if (enabled(job.urgente) || enabled(job.contratacaoUrgente)) {
        var urgentNotice = browserNode('aside','em-jb-urgency-notice');
        urgentNotice.setAttribute('aria-label','Contratação urgente');
        urgentNotice.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>';
        var urgentCopy = browserNode('div','em-jb-urgency-copy');
        urgentCopy.appendChild(browserNode('strong','','Contratação urgente'));
        urgentCopy.appendChild(browserNode('p','','Processo seletivo em andamento. Candidate-se o quanto antes.'));
        urgentNotice.appendChild(urgentCopy); headerContent.appendChild(urgentNotice);
        headerActions.classList.add('em-jb-has-urgency');
      }

      var share = browserNode('details', 'em-jb-share');
      share.setAttribute('aria-label', 'Compartilhar esta vaga');
      var shareToggle = browserNode('summary', 'em-jb-share-title', 'Compartilhar');
      share.appendChild(shareToggle);
      var shareButtons = browserNode('div', 'em-jb-share-buttons');
      var shareUrl = new URL(String(win.location.pathname || '') + '?pagina=vaga&id=' + encodeURIComponent(job.id), win.location.href || doc.baseURI || 'https://davidassispires-cpu.github.io/empregamais/').href;
      var shareText = summaryText(info.title) + ' — ' + summaryText(info.company);
      function shareControl(tag, className, label, path) {
        var control = browserNode(tag, 'em-jb-share-button ' + className);
        control.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
        control.appendChild(browserNode('span', '', label));
        shareButtons.appendChild(control); return control;
      }
      var whatsapp = shareControl('a', 'em-jb-share-whatsapp', 'WhatsApp', '<path d="M20 11.5a8 8 0 0 1-11.8 7L3 20l1.5-5.1A8 8 0 1 1 20 11.5Z"/><path d="M8 7c0 5 4 9 8 9l1-3-3-1-1 1c-1.5-.6-2.4-1.5-3-3l1-1-1-3Z"/>');
      whatsapp.href = 'https://wa.me/?text=' + encodeURIComponent(shareText + '\n' + shareUrl);
      whatsapp.target = '_blank'; whatsapp.rel = 'noopener noreferrer';
      var copy = shareControl('button', 'em-jb-share-copy', 'Copiar link', '<path d="m10 13 4-4M8 15l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0M16 9l1-1a3.5 3.5 0 0 1 5 5l-4 4a3.5 3.5 0 0 1-5 0"/>');
      copy.type = 'button';
      var shareStatus = browserNode('span', 'em-jb-share-status'); shareStatus.setAttribute('role', 'status');
      copy.onclick = async function () {
        try {
          if (win.navigator.clipboard && win.navigator.clipboard.writeText) await win.navigator.clipboard.writeText(shareUrl);
          else {
            var field = browserNode('textarea', 'em-jb-copy-field'); field.value = shareUrl;
            share.appendChild(field); field.select();
            var copied = doc.execCommand('copy'); field.remove();
            if (!copied) throw new Error('copy');
          }
          copy.querySelector('span').textContent = 'Link copiado';
          shareStatus.textContent = 'Link da vaga copiado.';
        } catch (error) {
          shareStatus.textContent = 'Copie o link: ' + shareUrl;
        }
      };
      var email = shareControl('a', 'em-jb-share-email', 'E-mail', '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>');
      email.href = 'mailto:?subject=' + encodeURIComponent(shareText) + '&body=' + encodeURIComponent('Confira esta vaga: ' + shareText + '\n' + shareUrl);
      share.appendChild(shareButtons); share.appendChild(shareStatus); headerActions.appendChild(share);
      var topMeta = browserNode('div', 'em-jb-top-meta');
      topMeta.appendChild(identity.querySelector('.em-jb-job-id'));
      var publicationFact = headerMeta.querySelector('.em-jb-header-published');
      if (publicationFact) topMeta.appendChild(publicationFact);
      headerContent.appendChild(topMeta);
      header.appendChild(headerMeta);
      header.appendChild(headerActions);
      panel.appendChild(header);
      var body = browserNode('div', 'em-jb-body'), facts = browserNode('div', 'em-jb-facts');
      var detailIcons = {
        'Salário':'<circle cx="12" cy="12" r="9"/><path d="M12 6v12M15 8H10a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H9"/>',
        'Contrato':'<path d="M5 3h10l4 4v14H5ZM14 3v5h5M8 12h8M8 16h6"/>',
        'Modalidade':'<path d="m3 11 9-8 9 8M5 10v11h14V10M9 21v-7h6v7"/>',
        'Jornada':'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
        'Horário':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h2M12 14h2M7 17h2"/>',
        'Experiência':'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18"/>',
        'Escolaridade':'<path d="m2 8 10-5 10 5-10 5ZM6 10v7c4 3 8 3 12 0v-7M22 8v8"/>',
        'Área':'<path d="M4 21V12h4v9M10 21V7h4v14M16 21V3h4v18"/>'
      };
      function detailIcon(path) {
        var icon = browserNode('span', 'em-jb-icon'); icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">'+path+'</svg>'; return icon;
      }
      function addFact(label, value, salary) {
        var text = summaryText(value); if (!text) return;
        var fact = browserNode('div', 'em-jb-fact' + (salary ? ' em-jb-pay' : ''));
        fact.setAttribute('data-em-primary', String(['Salário','Contrato','Modalidade','Jornada'].indexOf(label) !== -1));
        fact.appendChild(detailIcon(detailIcons[label] || detailIcons['Área']));
        fact.appendChild(browserNode('dt', '', label)); fact.appendChild(browserNode('dd', '', text)); facts.appendChild(fact);
      }
      // Salary, contract, modality and location already appear once in the header.
      addFact('Jornada', job.jornada); addFact('Horário', job.horario);
      addFact('Experiência', job.experiencia); addFact('Escolaridade', typeof win.textoEscolaridadeVaga === 'function' ? win.textoEscolaridadeVaga(job) : job.escolaridade);
      addFact('Área', job.area); if (job.pcd && job.pcd !== 'Não exclusiva para PcD') addFact('Vaga para PcD', job.pcd);
      var factNodes = Array.from(facts.children); facts.replaceChildren();
      function fillFactPairs(container, nodes) {
        for (var i = 0; i < nodes.length; i += 2) {
          var pair = browserNode('dl', 'em-jb-fact-pair'); pair.appendChild(nodes[i]);
          if (nodes[i + 1]) pair.appendChild(nodes[i + 1]); container.appendChild(pair);
        }
      }
      var secondary = factNodes;
      var extra = null;
      if (secondary.length) {
        extra = browserNode('details', 'em-jb-extra');
        extra.appendChild(browserNode('summary', '', 'Mais informações'));
        var secondaryFacts = browserNode('div', 'em-jb-facts'); fillFactPairs(secondaryFacts, secondary);
        extra.appendChild(secondaryFacts);
      }
      function addSection(label, value) {
        var text = summaryText(value); if (!text) return;
        var kind = label === 'Requisitos' ? 'requirements' : label === 'Benefícios' ? 'benefits' : 'description';
        var section = browserNode('section', 'em-jb-section em-jb-' + kind);
        section.appendChild(detailIcon(kind === 'benefits' ? '<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M3 12h18M12 8H7a3 3 0 1 1 3-3l2 3 2-3a3 3 0 1 1 3 3Z"/>' : kind === 'requirements' ? detailIcons['Escolaridade'] : detailIcons['Contrato']));
        section.appendChild(browserNode('h3', '', label));
        if (kind === 'benefits') {
          var list = browserNode('ul', 'em-jb-benefit-list');
          text.split('\n').forEach(function (benefit) {
            var item = browserNode('li', '');
            item.appendChild(detailIcon('<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>')); item.appendChild(browserNode('span', '', benefit)); list.appendChild(item);
          }); section.appendChild(list);
        } else {
          var lines = text.split(/\n+/).filter(function (line) { return line.trim(); });
          if (lines.length > 1) {
            var contentList = browserNode('ul', 'em-jb-content-list');
            lines.forEach(function (line) { contentList.appendChild(browserNode('li', '', line.replace(/^\s*[•·*-]\s*/, ''))); });
            section.appendChild(contentList);
          } else section.appendChild(browserNode('p', '', text));
        }
        body.appendChild(section);
      }
      var description = job.descricao || job.descricaoVaga || job.resumo || 'A empresa não informou a descrição desta vaga.';
      if (isDemo(job)) description = String(description).replace(/\s*Vaga de demonstração do \+Empregos\.[\s\S]*?candidaturas reais\./g, '');
      var summary = summaryText(job.resumo);
      if (summary && summary !== summaryText(description)) {
        var intro = browserNode('section', 'em-jb-intro');
        intro.appendChild(browserNode('h3', '', 'Sobre a vaga')); intro.appendChild(browserNode('p', '', summary)); body.appendChild(intro);
      }
      addSection('Responsabilidades', description);
      addSection('Requisitos', job.requisitos || 'Não informados.');
      var benefits = [], seen = Object.create(null);
      [job.beneficiosTags, job.beneficios, job.beneficiosSelecionados, job.benefits].forEach(function (source) {
        (Array.isArray(source) ? source : String(source || '').split(/[;|\n]+/)).forEach(function (value) {
          var text = summaryText(value), key = text.toLocaleLowerCase('pt-BR');
          if (text && !seen[key]) { seen[key] = true; benefits.push(text); }
        });
      });
      addSection('Benefícios', benefits.length ? benefits.join('\n') : 'Não informados.');
      if (extra) body.appendChild(extra);

      var footer = browserNode('div', 'em-jb-footer'); footer.setAttribute('role', 'group');
      footer.setAttribute('aria-label', 'Candidatura à vaga');
      var report = browserNode('button', 'em-jb-report', 'Denunciar vaga'); report.type = 'button'; report.setAttribute('data-vaga-id', String(job.id || ''));
      report.onclick = function () {
        if (typeof win.abrirPopupDenunciaEmpregaMais === 'function') win.abrirPopupDenunciaEmpregaMais(job.id);
      };
      footer.appendChild(report);
      var footerCandidate = browserNode('button', 'em-jb-apply em-jb-apply-bottom', 'Candidatar-se'); footerCandidate.type = 'button';
      footerCandidate.onclick = candidate.onclick; footer.appendChild(footerCandidate);
      var navigation = browserNode('div', 'em-jb-tabs'); navigation.setAttribute('role', 'tablist'); navigation.setAttribute('aria-label', 'Informações da vaga');
      panel.appendChild(navigation);
      var companyPanel = browserNode('div', 'em-jb-body');
      companyPanel.appendChild(browserNode('h3', '', 'Sobre a empresa'));
      companyPanel.appendChild(browserNode('p', '', entry.confidential ? 'A identidade da empresa é confidencial.' : summaryText(job.sobreEmpresa || job.descricaoEmpresa || 'A empresa ainda não disponibilizou uma apresentação.')));
      var reviewPanel = browserNode('div', 'em-jb-body');
      reviewPanel.appendChild(browserNode('h3', '', 'Avaliações da empresa'));
      reviewPanel.appendChild(browserNode('p', '', 'Ainda não há avaliações disponíveis para esta empresa no portal.'));
      var comparisonPanel = browserNode('div', 'em-jb-body');
      comparisonPanel.appendChild(browserNode('h3', '', 'Comparativo de vagas'));
      var peers = Array.from(state.list.children).filter(function (item) {
        var other = item.__emJobEntry;
        return other && other.job.id !== job.id && isDemo(other.job) === isDemo(job) &&
          ((job.area && other.job.area === job.area) || summaryText(other.info.title).toLowerCase() === summaryText(info.title).toLowerCase());
      }).slice(0, 2);
      if (peers.length) {
        var table = browserNode('table', 'em-jb-comparison'), head = browserNode('tr', '');
        ['Vaga', 'Salário', 'Modalidade', 'Contrato'].forEach(function (label) { head.appendChild(browserNode('th', '', label)); });
        table.appendChild(head);
        [card].concat(peers).forEach(function (item) {
          var other = item.__emJobEntry, row = browserNode('tr', '');
          [other.info.title, other.info.salary, other.job.modalidade || 'Não informada', other.job.contrato || other.job.tipoContrato || 'Não informado'].forEach(function (value) { row.appendChild(browserNode('td', '', summaryText(value))); });
          table.appendChild(row);
        });
        comparisonPanel.appendChild(table);
        comparisonPanel.appendChild(browserNode('p', '', 'Comparação com oportunidades da mesma área disponíveis nesta lista.'));
      } else comparisonPanel.appendChild(browserNode('p', '', 'Não há outras vagas da mesma área nesta lista para comparar.'));
      var tabs = [], views = [body, companyPanel, reviewPanel, comparisonPanel];
      function selectTab(index) {
        views.forEach(function (view, i) { view.hidden = i !== index; view.setAttribute('aria-hidden', String(i !== index)); });
        tabs.forEach(function (tab, i) { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
      }
      ['Vaga', 'Empresa', 'Avaliações', 'Comparativo'].forEach(function (label, index) {
        var tab = browserNode('button', 'em-jb-tab', label); tab.type = 'button'; tab.id = 'emJobTab' + index;
        var view = views[index]; view.id = 'emJobTabPanel' + index;
        tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', view.id);
        view.setAttribute('role', 'tabpanel'); view.setAttribute('aria-labelledby', tab.id);
        tab.onclick = function () { selectTab(index); };
        tab.addEventListener('keydown', function (event) {
          var next = event.key === 'ArrowRight' ? (index + 1) % 4 : event.key === 'ArrowLeft' ? (index + 3) % 4 : event.key === 'Home' ? 0 : event.key === 'End' ? 3 : -1;
          if (next < 0) return; event.preventDefault(); selectTab(next); tabs[next].focus();
        });
        tabs.push(tab); navigation.appendChild(tab); panel.appendChild(view);
      });
      selectTab(0); panel.appendChild(footer);
    }
    function selectBrowserJob(card, trigger, manual) {
      var state = mountJobBrowser(); if (!state || !card.__emJobEntry) return false;
      if (activeSummaryClose) activeSummaryClose(false);
      if (manual && narrowJobBrowser()) {
        if (state.root.getAttribute('data-view') !== 'details') state.scroll = win.scrollY || 0;
        state.root.setAttribute('data-view', 'details');
      }
      state.trigger = trigger || card.__emJobEntry.titleButton;
      if (state.selected !== card) { state.selected = card; fillJobPanel(state, card); }
      markBrowserSelection(state, card);
      if (manual) {
        state.status.textContent = 'Vaga selecionada: ' + card.__emJobEntry.info.title;
        var heading = doc.getElementById('emJobPanelTitle');
        if (heading) heading.focus({preventScroll:true});
        if (narrowJobBrowser() && typeof state.panel.scrollIntoView === 'function') state.panel.scrollIntoView({block:'start', behavior:'auto'});
      }
      return true;
    }
    function syncJobBrowser() {
      var home = doc.getElementById('pagina-home'); if (!home || !home.classList.contains('ativa')) return;
      var state = mountJobBrowser(); if (!state) return;
      syncSimilarVacancies(state);
      var cards = browserCards(state), old = state.selected;
      var id = old && old.__emJobEntry.job.id;
      var current = cards.find(function (card) { return String(card.__emJobEntry.job.id) === String(id); });
      if (!current && !narrowJobBrowser()) current = cards[0];
      if (current) { selectBrowserJob(current, null, false); return; }
      closeVerification();
      state.selected = null; markBrowserSelection(state, null); state.root.setAttribute('data-view', 'list');
      state.panel.removeAttribute('data-vaga-id'); state.panel.removeAttribute('data-em-highlighted'); state.panel.removeAttribute('aria-labelledby');
      state.panel.removeAttribute('data-em-priority');
      state.panel.replaceChildren(browserNode('p', 'em-jb-empty', cards.length ? 'Selecione uma vaga para ver todos os detalhes.' : 'Nenhuma vaga corresponde aos filtros. Altere sua busca para ver outras oportunidades.'));
    }
    function recentCard(card, job, featured) {
      if (!card || featured || !card.classList.contains('em-lista-final')) return card;
      var home = doc.getElementById('pagina-home');
      if (!home || !home.classList.contains('ativa')) return card;
      job = job || {};
      var title = card.querySelector('.em-lista-titulo');
      var company = card.querySelector('.em-lista-empresa');
      // Keep the original action only as a fallback for the full job details.
      var apply = card.querySelector('.em-lista-ver');
      if (!title || !company || !apply) return card;
      var highlighted = enabled(job.destaque) || enabled(job.emDestaque) || enabled(job.destacada);
      var urgent = enabled(job.urgente) || enabled(job.contratacaoUrgente);
      var confidential = typeof win.vagaEhConfidencialEM === 'function' ? win.vagaEhConfidencialEM(job) : enabled(job.confidencial);
      var originalLogo = card.querySelector('.em-logo-destaque-previa img,.em-lista-logo img');
      var originalSalary = card.querySelector('.em-lista-salario strong');
      var salaryValue = (originalSalary && originalSalary.textContent.trim() || 'A combinar').replace(/^(?:R\$\s*){2,}/i, 'R$ ');
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
        var initials = String(publicName || 'Empresa').replace(/\(demo\)/ig,'').trim().split(/\s+/).slice(0,2).map(function(part){return part.charAt(0);}).join('').toLocaleUpperCase('pt-BR');
        if (!originalLogo && typeof win.logoPreviaDestaqueEM === 'function') {
          originalLogo = win.logoPreviaDestaqueEM(job).querySelector('img');
        }
        if (!originalLogo && (job.logo || job.logoEmpresa)) {
          originalLogo = doc.createElement('img'); originalLogo.src = job.logo || job.logoEmpresa;
        }
        if (originalLogo) {
          originalLogo.alt = ''; originalLogo.loading = 'lazy';
          originalLogo.onerror = function(){ logo.textContent = initials; };
          logo.appendChild(originalLogo);
        } else logo.textContent = initials;
      }
      title.textContent = String(job.cargo || title.textContent).trim();
      title.classList.add('em-r4-title'); title.title = title.textContent;
      var titleButton = browserNode('button', 'em-r4-title-select', title.textContent); titleButton.type = 'button';
      titleButton.setAttribute('aria-haspopup', 'dialog'); titleButton.setAttribute('aria-controls', 'emRecentJobSummary'); titleButton.setAttribute('aria-expanded', 'false');
      title.replaceChildren(titleButton);
      company.classList.add('em-r4-company');
      company.querySelectorAll('.em-lista-nota-empresa').forEach(function(el){el.remove();});
      if (isDemo(job)) {
        var visibleName = company.querySelector('.em-company-name');
        if (visibleName) visibleName.textContent = visibleName.textContent.replace(/\s*\(demo\)/ig, '');
        company.appendChild(node('span', 'em-r4-demo-label', 'Demo'));
      }
      var titleLine = node('div','em-r4-title-line');
      titleLine.appendChild(title);
      copy.appendChild(titleLine); copy.appendChild(company);
      var rawDate = String(job.dataPublicacao || job.publicadaEm || job.criadoEm || '');
      var date = node('div','em-r4-date');
      date.innerHTML = svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>');
      date.appendChild(node('span','',publicationLabel(rawDate)));
      date.setAttribute('aria-label','Publicado em '+publicationLabel(rawDate));
      if (!confidential) identity.appendChild(logo);
      identity.appendChild(copy);
      var heading = node('div','em-r4-heading');
      heading.appendChild(identity);
      var facts = node('div','em-r4-facts');
      var city = String(job.cidade || 'Localidade não informada').trim();
      var originalPlace = card.querySelector('.em-lista-meta-item b');
      var uf = String(job.uf || job.estado || '').trim();
      if (uf.length !== 2) { var suffix = originalPlace && /[/•–-]\s*([A-Za-z]{2})$/.exec(originalPlace.textContent.trim()); uf = suffix ? suffix[1] : ''; }
      facts.appendChild(fact('em-r4-location','<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',city+(uf.length===2?' – '+uf.toUpperCase():'')));
      var terms = node('div','em-r4-terms');
      var areaName = String(job.area || job.areaAtuacao || job.areaProfissional || '').trim() || 'Área não informada';
      var areaLabel = node('span','em-r4-area',areaName); areaLabel.title = areaName;
      var areaDivider = node('span','em-r4-area-divider','·'); areaDivider.setAttribute('aria-hidden','true');
      terms.appendChild(areaLabel); terms.appendChild(areaDivider);
      terms.appendChild(fact('em-r4-modality','<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18"/>',job.modalidade || 'Modalidade não informada'));
      terms.appendChild(node('span','em-r4-contract',' · '+String(job.contrato || job.tipoContrato || 'Contrato não informado').replace(/^Efetivo\s*[–-]\s*CLT$/i,'CLT')));
      facts.appendChild(terms);
      var distance = card.querySelector('.em-lista-distancia');
      if (distance) { distance.classList.add('em-r4-distance'); facts.appendChild(distance); }
      var actions = node('div','em-r4-actions');
      var salary = node('strong','em-r4-salary',salaryValue);
      actions.appendChild(salary);
      var metaRow = node('div','em-r4-meta-row');
      metaRow.appendChild(facts); metaRow.appendChild(actions);
      var educationValue = typeof win.textoEscolaridadeVaga === 'function' ? win.textoEscolaridadeVaga(job) : job.escolaridade;
      if (!educationValue && typeof job.escolaridadeMinima === 'string') educationValue = job.escolaridadeMinima;
      var educationText = summaryText(educationValue || 'Não informada');
      var educationPath = '<path d="m2 8 10-5 10 5-10 5ZM6 10v7c4 3 8 3 12 0v-7M22 8v8"/>';
      var educationInline = fact('em-r4-education-inline', educationPath, educationText);
      educationInline.setAttribute('aria-label', 'Escolaridade: ' + educationText);
      educationInline.title = 'Escolaridade: ' + educationText;
      terms.appendChild(educationInline);
      var education = fact('em-r4-education', educationPath, educationText);
      education.setAttribute('aria-label', 'Escolaridade: ' + educationText);
      metaRow.appendChild(education);
      function showDetails(event){
        event.preventDefault(); event.stopPropagation();
        if (selectBrowserJob(card, titleButton, true)) return;
        var publicCompany = company.querySelector('span');
        openJobSummary(job, {
          title:title.textContent,
          company:confidential ? 'Empresa confidencial' : (publicCompany ? publicCompany.textContent : company.textContent),
          location:city+(uf.length===2?' – '+uf.toUpperCase():''),
          salary:salaryValue,
          date:date.textContent
        }, apply, titleButton);
      }
      titleButton.onclick = showDetails;
      var footer = node('div','em-r4-footer');
      var openState = fact('em-r4-open-state','<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>','Em visualização');
      openState.setAttribute('aria-hidden', 'true'); footer.appendChild(date); footer.appendChild(openState);
      if (!save) { save = doc.createElement('button'); save.type = 'button'; }
      save.classList.add('em-r4-save'); save.setAttribute('data-vaga-id',String(job.id || ''));
      function updateSave(){var saved=typeof win.vagaEstaSalva==='function'&&win.vagaEstaSalva(job.id);save.setAttribute('aria-pressed',String(!!saved));save.setAttribute('aria-label',saved?'Remover vaga dos salvos':'Salvar vaga');save.title=saved?'Remover vaga dos salvos':'Salvar vaga';save.innerHTML=svg('<path d="M6 3h12v18l-6-4-6 4V3Z"/>');}
      save.onclick=function(event){event.preventDefault();event.stopPropagation();if(typeof originalSave==='function')originalSave.call(save,event);else if(typeof win.alternarFavorito==='function')win.alternarFavorito(job.id);updateSave();};
      updateSave();
      // Saving and applying stay in the full details; previews show only essential facts.
      var excerptText = summaryText(job.descricao || job.descricaoVaga || job.resumo || '')
        .replace(/Vaga de demonstração do \+Empregos\.[\s\S]*$/i, '').replace(/\s+/g, ' ').trim();
      var excerpt = node('p', 'em-r4-excerpt', excerptText);
      var excerptStyles = {'display':'-webkit-box','-webkit-box-orient':'vertical','-webkit-line-clamp':'2','line-clamp':'2','overflow':'hidden','max-height':'40px','margin':'0','padding':'0','font-size':'14px','font-weight':'400','line-height':'20px','color':'#52657b','grid-column':'1 / -1','width':'100%','min-width':'0','overflow-wrap':'anywhere'};
      Object.keys(excerptStyles).forEach(function (key) { excerpt.style.setProperty(key, excerptStyles[key], 'important'); });
      if (excerptText) card.replaceChildren(heading,excerpt,metaRow,footer);
      else card.replaceChildren(heading,metaRow,footer);
      card.classList.add('em-recent-blocks');
      var footerBadges=node('div','em-r4-footer-badges');
      function footerBadge(kind,label,path){
        var badge=node('span','em-r4-footer-badge em-r4-footer-'+kind);
        badge.innerHTML=svg(path);badge.appendChild(node('span','',label));footerBadges.appendChild(badge);
      }
      if(highlighted)footerBadge('featured','Destaque',paths.featured);
      if(urgent)footerBadge('urgent','Urgente','<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>');
      footer.appendChild(footerBadges);
      card.classList.add('em-recent-discreet');
      card.setAttribute('data-em-priority',urgent?'urgent':highlighted?'featured':'standard');
      card.setAttribute('data-em-highlighted',String(highlighted)); card.setAttribute('data-em-confidential',String(confidential));
      var publicCompany = company.querySelector('span');
      card.__emJobEntry = {job:job, apply:apply, save:save, openState:openState, titleButton:titleButton, company:company, highlighted:highlighted, confidential:confidential,
        info:{title:title.textContent, company:confidential ? 'Empresa confidencial' : summaryText(publicName || (publicCompany ? publicCompany.textContent : company.textContent)), location:city+(uf.length===2?' – '+uf.toUpperCase():''), salary:salaryValue, date:date.textContent}};
      card.onclick = function (event) {
        if (event.target && event.target.closest && event.target.closest('button,a,input,select,textarea,label,.em-r4-company,.em-r4-similar')) return;
        showDetails(event);
      };
      return card;
    }
    var makeCard = win.criarCardVaga;
    if (typeof makeCard === 'function') win.criarCardVaga = function (job, featured) {
      var card = makeCard.apply(this, arguments);
      if (card) companyIdentity(card.querySelector('.em-lista-empresa,.em-featured-company,.dz-empresa,.vaga-empresa'), job);
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
      page.querySelectorAll('.em-demo-verified').forEach(function(seal) { seal.remove(); });
      if (!currentDemo()) { if (notice) notice.remove(); return; }
      page.querySelectorAll('#emV63Nome,#detalheEmpresaCab,#vagaEmpresa').forEach(function(company) { companyIdentity(company, win.vagaAtual); });
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
    if (route === 'empresa-publica') renderDemoCompanyProfile(new URLSearchParams(win.location.search).get('id'));
    if (typeof win.renderizarVagas === 'function') win.renderizarVagas();
    detailNotice();
    installAreaCarousel(win);
  }
  return {criarVagas:createJobs, ehDemo:isDemo, instalar:install, publicationLabel:publicationLabel};
});


