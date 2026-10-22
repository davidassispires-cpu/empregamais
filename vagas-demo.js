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
    {id:3,marca:'araujo',cargo:'Auxiliar de E-commerce',empresa:'Vitrine Digital',cidade:'Betim',area:'Comercial, Vendas',salario:2200,idade:.25,destaque:true,urgente:true,total:5,
      descricao:'Cadastro de produtos, acompanhamento de pedidos e atendimento nos marketplaces.',requisitos:'Ensino médio completo, boa escrita e familiaridade com compras online.'},
    {id:5,cargo:'Auxiliar de Logística',empresa:'Operação Logística',cidade:'Contagem',area:'Logística',salario:2350,idade:3.5,confidencial:true,total:6,
      descricao:'Separação, conferência e organização de mercadorias no centro de distribuição.',requisitos:'Ensino médio completo e disponibilidade para atuar em escala.'},
    {id:6,marca:'bh',cargo:'Operador de Caixa',empresa:'Mercado da Praça',cidade:'Betim',area:'Comercial, Vendas',salario:1950,idade:.35,total:4,
      descricao:'Registro de compras, recebimento de pagamentos e fechamento de caixa.',requisitos:'Ensino médio completo e atenção ao atendimento e aos valores recebidos.'},
    {id:7,marca:'vianney',cargo:'Balconista de Padaria',empresa:'Gestão Horizonte',cidade:'Belo Horizonte',area:'Comercial, Vendas',salario:2900,idade:4,destaque:true,modalidade:'Presencial',total:12,
      descricao:'Atendimento no balcão, organização de produtos de panificação e apoio aos pedidos dos clientes.',requisitos:'Ensino médio completo e experiência com atendimento ao público.'},
    {id:8,cargo:'Recepcionista',empresa:'Atendimento Integrado',cidade:'Belo Horizonte',area:'Administração',salario:2000,idade:4.5,confidencial:true,total:16,
      descricao:'Recepção de visitantes, atendimento telefônico e organização da agenda.',requisitos:'Ensino médio completo, cordialidade e boa comunicação.'},
    {id:10,marca:'bh',cargo:'Analista de Marketing',empresa:'Ideia Digital',cidade:'Belo Horizonte',area:'Marketing',salario:4200,idade:6,destaque:true,modalidade:'Remoto',total:22,
      descricao:'Planejamento de conteúdo, acompanhamento de campanhas e análise de resultados digitais.',requisitos:'Experiência com redes sociais, métricas e ferramentas de marketing digital.'},
    {id:11,marca:'ipiranga',cargo:'Atendente de Relacionamento',empresa:'Conexão Atendimento',cidade:'Betim',area:'Comercial, Vendas',salario:1980,idade:.4,urgente:true,total:9,
      descricao:'Atendimento ao cliente por chat e telefone, registro de solicitações e acompanhamento de soluções.',requisitos:'Ensino médio completo, empatia e boa digitação.'},
    {id:14,marca:'varejao',cargo:'Técnico de Suporte de TI',empresa:'Nexo Tecnologia',cidade:'Belo Horizonte',area:'Informática, TI, Telecomunicações',salario:3100,idade:7,destaque:true,modalidade:'Híbrido',total:14,
      descricao:'Suporte a usuários, configuração de equipamentos e acompanhamento de chamados técnicos.',requisitos:'Curso técnico em informática e conhecimentos de sistemas operacionais e redes.'},
    {id:15,marca:'ipiranga',cargo:'Conferente de Mercadorias',empresa:'Via Minas Logística',cidade:'Betim',area:'Logística',salario:2550,idade:2,urgente:true,total:21,
      descricao:'Conferência de notas fiscais, volumes e movimentações de entrada e saída de mercadorias.',requisitos:'Experiência com conferência e conhecimentos de controle de estoque.'},
    {id:17,cargo:'Assistente de Compras',empresa:'Suprimentos Corporativos',cidade:'Contagem',area:'Compras',salario:3200,idade:5,destaque:true,confidencial:true,total:10,
      descricao:'Cotação com fornecedores, acompanhamento de pedidos e controle de prazos de entrega.',requisitos:'Experiência com compras e domínio de planilhas.'},
    {id:18,marca:'cocobambu',cargo:'Gerente de Restaurante',empresa:'Horizonte Analytics',cidade:'Belo Horizonte',area:'Alimentação / Gastronomia',salario:6500,idade:8,destaque:true,modalidade:'Presencial',contrato:'Efetivo – CLT',jornada:'44 horas semanais',horario:'Escala de trabalho a combinar',total:26,
      descricao:'Gestão da equipe do restaurante, acompanhamento do atendimento e organização da operação.',requisitos:'Experiência com gestão de restaurantes, liderança e atendimento.',beneficios:'Refeição no local; vale-transporte; capacitação profissional.'},
    {id:19,cargo:'Auxiliar de Serviços Gerais',empresa:'Serviços Operacionais',cidade:'Betim',area:'Administração',salario:1800,idade:4,confidencial:true,contrato:'Temporário',total:11,
      descricao:'Limpeza e conservação de ambientes, reposição de materiais e organização dos espaços.',requisitos:'Responsabilidade e disponibilidade para atuação presencial.'},
    {"id":21,"cargo":"Auxiliar Administrativo","empresa":"Horizonte Serviços","cidade":"Belo Horizonte","area":"Administração","salario":2400,"idade":0.03,"total":4,
      "descricao":"Organização de documentos, atualização de planilhas e apoio às rotinas do escritório.","requisitos":"Ensino médio completo, boa comunicação e conhecimentos básicos de Excel."},
    {"id":22,"cargo":"Assistente Comercial","empresa":"Ponto Certo Comércio","cidade":"Contagem","area":"Comercial, Vendas","salario":2600,"idade":0.06,"total":6,
      "descricao":"Apoio à equipe comercial, elaboração de propostas e acompanhamento de pedidos.","requisitos":"Ensino médio completo e experiência com atendimento e rotinas comerciais."},
    {"id":23,marca:'mercado',"cargo":"Analista de Logística","empresa":"Rota Certa Distribuição","cidade":"Betim","area":"Logística","salario":3900,"idade":0.1,"destaque":true,"total":11,
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
    carrefour:{name:'Carrefour',logo:'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDA0RTlGIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+Q2FycmVmb3VyPC90aXRsZT48cGF0aCBkPSJNMTIuMTQgNC4wNDVjLTIuNTY5IDAtMy41NzIgMy42NC0zLjU3MiA3Ljk3OSAwIDQuMzQgMS4wMDMgNy45MzEgMy41NzIgNy45MzEgMS41NDEgMCAyLjg1NS0uOTAzIDIuODYtMS42NDVhLjYyNS42MjUgMCAwIDAtLjE5OS0uNDUzYy0uNzMtLjcwNi0xLjAxNi0xLjQxMi0xLjAxOC0yLjAzNC0uMDA1LTEuMTg5IDEuMDI2LTIuMDc0IDEuOTc3LTIuMDc0IDEuMzA2IDAgMi4wNzcgMS4wMjcgMi4wNzcgMi4zNTcgMCAxLjI2LS41MzcgMi4zMS0xLjEyMSAzLjE1YS4xOTMuMTkzIDAgMCAwLS4wMzQuMTA3YzAgLjA2NS4wNC4xMi4wOTguMTIuMDM1IDAgLjA3Ni0uMDIuMTIyLS4wNjVsNi41NjEtNi4zNDRjLjMyOC0uMjguNTM3LS42MDguNTM3LTEuMDczIDAtLjQ2OC0uMjEtLjc5NC0uNTM3LTEuMDczbC02LjU2MS02LjM0NmMtLjA0NS0uMDQ1LS4wODctLjA2NC0uMTIyLS4wNjQtLjA1OSAwLS4wOTcuMDU1LS4wOTguMTIgMCAuMDM1LjAxLjA3My4wMzQuMTA3LjU4NC44NCAxLjEyIDEuODkgMS4xMiAzLjE1IDAgMS4zMjktLjc3IDIuMzU2LTIuMDc2IDIuMzU2LS45NSAwLTEuOTgyLS44ODQtMS45NzctMi4wNzMuMDAyLS42MjIuMjg4LTEuMzI4IDEuMDE4LTIuMDMzQS42MjQuNjI0IDAgMCAwIDE1IDUuNjljLS4wMDQtLjc0My0xLjMxOS0xLjY0Ni0yLjg2LTEuNjQ2bS01LjA0My41MzdMLjUzNyAxMC45M0MuMjA5IDExLjIwNyAwIDExLjUzNCAwIDEyYzAgLjQ2NS4yMS43OTMuNTM3IDEuMDczbDYuNTYgNi4zNDVjLjA0Mi4wNDMuMDgzLjA2LjExNy4wNi4wNjIgMCAuMTA1LS4wNTcuMTAzLS4xMjNhLjE4OC4xODggMCAwIDAtLjA1Ny0uMTIzQzUuNzIgMTcuMzIgNC42IDE1LjEyNiA0LjYgMTIuMDI0YzAtMy4xMDQgMS4xMi01LjM0MSAyLjY2LTcuMjU1YS4xODUuMTg1IDAgMCAwIC4wNTctLjEyM2MuMDAyLS4wNjgtLjA0LS4xMjMtLjEwMy0uMTIzLS4wMzQgMC0uMDc1LjAxNy0uMTE3LjA2Ii8+PC9zdmc+'},
    araujo:{name:'Drogaria Araujo',logo:'data:image/webp;base64,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'},
    mercado:{name:'Mercado Livre',logo:'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5NDcuNjUgNzk0LjY5Ij48cGF0aCBkPSJNNzI2Ljc3LDE4Mi41NkM3MjYuNzcsODIsNjAxLjgxLDAsNDQ3LjY1LDBTMTY4LjU0LDgyLDE2OC41NCwxODIuNTZjMCwyLjYsMCw5Ljc4LDAsMTAuNywwLDEwNi43LDEwOS4yMywxOTMuMTEsMjc5LjEsMTkzLjExLDE3MC45MywwLDI3OS4xNi04Ni4zOSwyNzkuMTYtMTkzLjFaIiBmaWxsPSIjMmQzMjc3Ii8+PHBhdGggZD0iTTcxNi4wOSwxODIuNDdjMCw5NC44Mi0xMjAuMTYsMTcxLjY4LTI2OC40LDE3MS42OFMxNzkuMzIsMjc3LjI5LDE3OS4zMiwxODIuNDcsMjk5LjQ4LDEwLjc4LDQ0Ny42OSwxMC43OHMyNjguNCw3Ni44NywyNjguNCwxNzEuNjkiIGZpbGw9IiNmN2QwMzIiLz48cGF0aCBkPSJNMzU4LjU4LDEyOC4zYy0uMTMuMjgtMi44MSwzLTEuMDksNS4yNyw0LjI1LDUuNDEsMTcuMzMsOC41MiwzMC41Niw1LjU1LDcuODctMS43NywxOC05LjgsMjcuNzUtMTcuNTYsMTAuNi04LjQyLDIxLjEyLTE2Ljg1LDMxLjY4LTIwLjIxLDExLjItMy41NywxOC4zNi0yLDIzLjEtLjU5LDUuMiwxLjU1LDExLjMyLDUsMjEuMDYsMTIuMjgsMTguMzgsMTMuOCw5Mi4yMiw3OC4yNiwxMDUsODkuNDEsMTAuMjctNC42NSw1NS45NC0yNC4zMSwxMTgtMzgtNS40LTMzLjA5LTI1LjUyLTYzLjM2LTU2LTg4LjEzQzYxNiw5NC4xOSw1NjQuMDUsMTAzLjUyLDUxMy4yMSw3OC42OGMtLjI2LS4xLTI3Ljc3LTEzLjEzLTU0LjkyLTEyLjQ5QzQxOCw2Ny4xMyw0MDAuNSw4NC41OSwzODIsMTAzLjA2WiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik01OTMuNjEsMjA5LjQ1Yy0uODctLjc3LTg2LjgyLTc2LTEwNi4zLTkwLjYyLTExLjI2LTguNDYtMTcuNTQtMTAuNjEtMjQuMTItMTEuNDRhMzIuNjEsMzIuNjEsMCwwLDAtMTEuNDYsMS4wOWMtOS4wNywyLjQ2LTIwLjkyLDEwLjM4LTMxLjQyLDE4LjcyLTEwLjksOC42OC0yMS4xNywxNi44NS0zMC42OSwxOS0xMi4xNywyLjczLTI3LS40OS0zMy44MS01LjA3YTE1LDE1LDAsMCwxLTUuNjItNi4xNWMtMi40OS01LjgyLDIuMTEtMTAuNDYsMi44OC0xMS4yM2wyMy43MS0yNS42NmMyLjc2LTIuNzYsNS41NC01LjUxLDguMzktOC4yMWExNTAuNDIsMTUwLjQyLDAsMCwwLTIxLjYxLDQuODdjLTguNiwyLjQxLTE2Ljg3LDQuNzEtMjUuMjMsNC43MS0zLjUsMC0yMi4yLTMuMDctMjUuNzUtNC0yMS40Ny01Ljg4LTQwLjMxLTExLjU5LTY4LjQ0LTI0LjczLTMzLjczLDI1LjA5LTU2LjI5LDU2LjQ4LTYyLjgsOTEuMDYsNC44NCwxLjI5LDEyLjY2LDMuNjEsMTUuOTMsNC4zMyw3Ni4zMSwxNywxMDAuMDksMzQuNDYsMTA0LjQsMzguMTFhMjUuMjMsMjUuMjMsMCwwLDEsMzkuNiwyLjMyLDI4Ljc2LDI4Ljc2LDAsMCwxLDE4LjE5LTYuNCwzMy44OSwzMy44OSwwLDAsMSwxMC45LDEuOTEsMjUuMTMsMjUuMTMsMCwwLDEsMTUuMzcsMTMuODgsMjUuMTQsMjUuMTQsMCwwLDEsMTAuNjEtMi4yNSwzMiwzMiwwLDAsMSwxMi42OSwyLjhjMTQuMDgsNiwxNi4yNiwxOS44NSwxNSwzMC4yN2EyNS4zNCwyNS4zNCwwLDAsMSwzLS4xNywzMC4yMywzMC4yMywwLDAsMSwyNi42Myw0NC41NmM0LjUyLDIuNTQsMTYuMTEsOC4zMiwyNi4yNiw3LDguMTItMSwxMS4yLTMuODEsMTIuMzEtNS4zNi43NC0xLjA5LDEuNTUtMi4zMi44MS0zLjIzTDQ3MS41NCwyNjUuNnMtMy41NS0zLjM0LTIuMzgtNC42NCwzLjQuNTgsNC45NSwxLjg3YzExLDkuMTUsMjQuMzUsMjMsMjQuMzUsMjMsLjIyLjE2LDEuMTEsMS44OSw2LjA2LDIuNzgsNC4yNS43NywxMS43OC4zMiwxNy00YTI2LjY5LDI2LjY5LDAsMCwwLDMuNzQtMy44NCwxLjI2LDEuMjYsMCwwLDEtLjI0LjJjNS41LTcuMDUtLjYyLTE0LjE3LS42Mi0xNC4xN2wtMjUuMTMtMjguMjRzLTMuNi0zLjMxLTIuMzctNC42NWMxLjA4LTEuMTYsMy40MS41OSw1LDEuODksOCw2LjY2LDE5LjIxLDE3Ljk0LDMwLDI4LjUsMi4xMSwxLjU0LDExLjU4LDcuNDEsMjQuMTItLjgzLDcuNjItNSw5LjE0LTExLjEzLDguOTMtMTUuNzYtLjUzLTYuMTItNS4zMS0xMC40OS01LjMxLTEwLjQ5bC0zNC4zNC0zNC41MnMtMy42My0zLjA5LTIuMzUtNC42NmMxLjA1LTEuMzEsMy40LjU5LDQuOTQsMS44NywxMSw5LjE2LDQwLjU2LDM2LjMxLDQwLjU2LDM2LjMxLjQxLjI5LDEwLjY0LDcuNTcsMjMuMy0uNDgsNC41MS0yLjg4LDcuNDEtNy4yMyw3LjY2LTEyLjNhMTguMjEsMTguMjEsMCwwLDAtNS43Ny0xNCIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik00MjcuMDUsMjUzLjIxYy01LjMyLS4wNi0xMS4xNSwzLjExLTExLjksMi42NC0uNDQtLjI4LjMyLTIuNDEuODItMy42NXM3LjUyLTIyLjMxLTkuNTgtMjkuNjVjLTEzLjA3LTUuNjEtMjEuMDcuNy0yMy44MywzLjU3LS43Ljc0LTEsLjY4LTEuMTEtLjI4LS4yNy0zLjc5LTItMTQuMDgtMTMuMjYtMTcuNTEtMTYuMTItNC45NC0yNi41MSw2LjMxLTI5LjEyLDEwLjM3YTE4LjY4LDE4LjY4LDAsMSwwLTUuNTYsMTUuODhjLjEuMTEuMTQuMjguMS42NC0uNzksNC42My0yLjI0LDIxLjQ2LDE1LjM4LDI4LjMyLDcuMDYsMi43MywxMy4wOC43LDE4LjA2LTIuOCwxLjQ4LTEuMDUsMS43Mi0uNjEsMS41MS43OS0uNjQsNC4zMy4xNywxMy41OSwxMy4xNiwxOC44Nyw5LjksNCwxNS43NS0uMDksMTkuNTctMy42NSwxLjY4LTEuNTEsMi4xMy0xLjI3LDIuMjIsMS4wOWEyMy41NiwyMy41NiwwLDEsMCwyMy41NC0yNC42MyIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik00MjcuMDUsMjk4LjY0YTIxLjcyLDIxLjcyLDAsMCwxLTIxLjgzLTIwLjg3YzAtMS0uMTMtMy42Ni0yLjM5LTMuNjZhNC4xOSw0LjE5LDAsMCwwLTIuNjUsMS4zOWMtMi42LDIuNDItNS45LDQuODYtMTAuNzIsNC44NmExOC44MywxOC44MywwLDAsMS03LjA3LTEuNTRjLTEyLjQ2LTUtMTIuNjItMTMuNi0xMi4xMi0xN2EzLjEyLDMuMTIsMCwwLDAtLjQ2LTIuNjNsLS43Ni0uNjdoLS43OGEzLjc2LDMuNzYsMCwwLDAtMi4xNi44NywxOC4xOCwxOC4xOCwwLDAsMS0xMC41OCwzLjc3LDE2LjIyLDE2LjIyLDAsMCwxLTUuOS0xLjE3Yy0xNi40LTYuMzgtMTUuMTItMjEuODYtMTQuMzItMjYuNTJhMi4yNSwyLjI1LDAsMCwwLS43LTIuMTZsLTEuMTctMS0xLjA4LDEuMDVhMTcuMDUsMTcuMDUsMCwxLDEsNS4wNS0xNC40MmwuNTksNC41NiwyLjUxLTMuODdjLjI4LS40NSw3LjE3LTEwLjg2LDE5LjgyLTEwLjg0YTI1LjIsMjUuMiwwLDAsMSw3LjQsMS4xNWMxMC4wOCwzLjA4LDExLjc5LDEyLjI0LDEyLjA2LDE2LC4xOCwyLjIyLDEuNzYsMi4zMywyLjA3LDIuMzNhMi44MiwyLjgyLDAsMCwwLDItMUExNy4xNSwxNy4xNSwwLDAsMSwzOTYuMzYsMjIyYTIzLjc1LDIzLjc1LDAsMCwxLDkuMzksMi4xMmMxNiw2Ljg4LDguNzcsMjcuMjYsOC42OCwyNy40Ny0xLjM4LDMuMzctMS40Myw0Ljg1LS4xMyw1LjcybC42Mi4zaC40OGExMS43LDExLjcsMCwwLDAsMy4xLS44MSwyNy40NCwyNy40NCwwLDAsMSw4LjU1LTEuODhoMGEyMS44NywyMS44NywwLDEsMSwwLDQzLjczbTE2OS44OS05OC4yYy0yNi40OC0yMy4xLTg3LjY4LTc2LjMxLTEwNC4yNS04OC43NC05LjQ4LTcuMTItMTUuOTItMTAuODktMjEuNi0xMi41OGEzNS42NiwzNS42NiwwLDAsMC0xMC42LTEuNjRBNDQuNzUsNDQuNzUsMCwwLDAsNDQ3LDk5LjczYy0xMC43MSwzLjQtMjEuMzgsMTEuODgtMzEuNywyMC4wOGwtLjUzLjQyYy05LjYxLDcuNjUtMTkuNTUsMTUuNTUtMjcuMDcsMTcuMjRhNDYuMzYsNDYuMzYsMCwwLDEtMTAsMS4xMWMtOC40MiwwLTE2LTIuNDQtMTguODMtNi4wNi0uNDctLjYtLjE2LTEuNTcuOTQtM2wuMTMtLjE5LDIzLjMtMjUuMUM0MDEuNDcsODYsNDE4LjcsNjguOCw0NTguMzYsNjcuODlsMiwwYzI0LjY5LDAsNDkuMzksMTEuMDcsNTIuMTUsMTIuMzUsMjMuMTUsMTEuMyw0NywxNyw3MS4wNiwxNy4wNSwyNSwwLDUwLjg3LTYuMTksNzgtMTguNjktMy0yLjU1LTYuMTktNS05LjQ0LTcuNDctMjMuODUsMTAuMzQtNDYuNTksMTUuNTYtNjguNTIsMTUuNTUtMjIuNCwwLTQ0Ljc3LTUuMzktNjYuNS0xNi0xLjE0LS41Ni0yOC40MS0xMy40LTU2Ljc3LTEzLjQxbC0yLjIzLDBjLTMzLjMxLjc5LTUyLjA5LDEyLjYxLTY0LjcxLDIzLTEyLjI3LjMtMjIuODYsMy4yNy0zMi4yOSw1Ljg4LTguNCwyLjM1LTE1LjY2LDQuMzgtMjIuNzYsNC4zNy0yLjksMC04LjE2LS4yNy04LjYyLS4yOC04LjE1LS4yNS00OS4xOS0xMC4zMS04MS44Mi0yMi42OC0zLjMzLDIuMzctNi41NCw0LjgxLTkuNjYsNy4yOSwzNC4xLDE0LDc1LjYsMjQuNzgsODguNjksMjUuNjMsMy42NC4yNCw3LjUyLjY1LDExLjQuNjcsOC42NiwwLDE3LjMxLTIuNDMsMjUuNjctNC43OCw1LTEuMzksMTAuNDEtMi44OSwxNi4xNS00LTEuNTQsMS40OS0zLjA2LDMtNC42LDQuNTVMMzUxLjksMTIyLjUzYy0xLjg2LDEuODctNS45MSw2Ljg4LTMuMjQsMTMuMDdhMTYuNTUsMTYuNTUsMCwwLDAsNi4yMiw2LjljNS42NSwzLjgxLDE1Ljc1LDYuMzcsMjUuMTMsNi4zN2E0NSw0NSwwLDAsMCwxMC0xLjA1YzkuOTItMi4yMiwyMC4zMy0xMC41MSwzMS4zNC0xOS4yNyw4LjgtNywyMS4yNy0xNS44NCwzMC44Mi0xOC40NGEzNS4xMSwzNS4xMSwwLDAsMSw4LjU5LTEuMTgsMjEuMzUsMjEuMzUsMCwwLDEsMi4yMS4xMmM2LjMzLjgxLDEyLjQyLDMsMjMuMzIsMTEuMTMsMTkuNDMsMTQuNiwxMDUuMzksODkuOCwxMDYuMjQsOTAuNTRhMTYuNTMsMTYuNTMsMCwwLDEsNS4xNiwxMi42NGMtLjIsNC4zOS0yLjY0LDguMjgtNi44NywxMWEyMSwyMSwwLDAsMS0xMS4yOCwzLjUxLDE4LjgsMTguOCwwLDAsMS0xMC0yLjg4Yy0uMzItLjI2LTI5Ljc2LTI3LjI3LTQwLjYtMzYuMzUtMS43Mi0xLjQzLTMuNDEtMi43Mi01LjA5LTIuNzJhMi44NSwyLjg1LDAsMCwwLTIuMjYsMS4wNmMtMS43MSwyLjExLjIsNSwyLjQ2LDYuOTNsMzQuNCwzNC41OGMwLC4wNSw0LjI5LDQsNC43NSw5LjMzLjI4LDUuNzMtMi40NywxMC41Mi04LjE3LDE0LjI2YTIyLjEsMjIuMSwwLDAsMS0xMi4yLDQsMTcuNzksMTcuNzksMCwwLDEtOS44LTNsLTQuOTQtNC44N2MtOS04Ljg3LTE4LjMzLTE4LTI1LjE0LTIzLjc0LTEuNjctMS4zOC0zLjQ1LTIuNjYtNS4xNC0yLjY2YTMsMywwLDAsMC0yLjE3LjkxYy0uNzcuODgtMS4zMiwyLjQzLjYyLDVhMTYuNjYsMTYuNjYsMCwwLDAsMS43NCwxLjkzbDI1LjEsMjguMjFjLjIyLjI1LDUuMTgsNi4xMy41NywxMmwtLjg5LDEuMTNhMjQuMzEsMjQuMzEsMCwwLDEtMi4zMywyLjI0Yy00LjI5LDMuNTItMTAsMy44OS0xMi4yNywzLjg5YTE4Ljc1LDE4Ljc1LDAsMCwxLTMuMzktLjI4Yy0yLjQ4LS40NC00LjE0LTEuMTQtNC45NS0yLjA5bC0uMy0uMzFjLTEuMzctMS40Mi0xNC0xNC4zNC0yNC41LTIzLjA5LTEuMzgtMS4xNS0zLjEtMi42LTQuODktMi42YTMsMywwLDAsMC0yLjI2LDFjLTIuMDcsMi4yNywxLDUuNjcsMi4zNiw2LjlsMjEuNDIsMjMuNjJhNS4zNyw1LjM3LDAsMCwxLS44MiwxLjQzYy0uNzcsMS4wOC0zLjM3LDMuNjgtMTEuMTMsNC42NWEyMi4zMiwyMi4zMiwwLDAsMS0yLjg0LjE3Yy04LDAtMTYuNTYtMy44OS0yMS02LjIyQTMxLjU5LDMxLjU5LDAsMCwwLDQ1OSwyNzYuOGEzMiwzMiwwLDAsMC0zMS45My0zMmwtMS4xNSwwYy41Ni04LS41Ny0yMy4yOS0xNi4yMS0zMGEzMy41MiwzMy41MiwwLDAsMC0xMy4zNS0yLjk0LDI2Ljg5LDI2Ljg5LDAsMCwwLTkuNzksMS43OCwyNi43OSwyNi43OSwwLDAsMC0xNS42NC0xMy4yOSwzNS4xMywzNS4xMywwLDAsMC0xMS40NS0yLDMwLjI2LDMwLjI2LDAsMCwwLTE3Ljg2LDUuNywyNi45MywyNi45MywwLDAsMC00MC4wOS0yLjI0Yy02LjY2LTUuMDktMzMuMTItMjEuODktMTAzLjg4LTM4LTMuNDItLjc4LTExLjI5LTMtMTYuMTEtNC40NWExMTYuNjgsMTE2LjY4LDAsMCwwLTEuOCwxMS42MXMxMywzLjE0LDE1LjYyLDMuNzJjNzIuMjgsMTYuMDUsOTYuMTgsMzIuNzUsMTAwLjIxLDM1LjlhMjcuMSwyNy4xLDAsMCwwLDI1LDM3LjUxLDI2LjUzLDI2LjUzLDAsMCwwLDUtLjQ1YzIuMjYsMTEsOS40NSwxOS4zMiwyMC40NCwyMy42YTI3LDI3LDAsMCwwLDkuNjYsMS44NywyNSwyNSwwLDAsMCw2LjE3LS43N2MyLDUuMTYsNi41OSwxMS41OCwxNi44MSwxNS43MmEyOC4yNywyOC4yNywwLDAsMCwxMC42MywyLjIsMjMuODQsMjMuODQsMCwwLDAsOC4yNi0xLjQ3QTMxLjkxLDMxLjkxLDAsMCwwLDQ0OS45NCwyOTljNS4xNSwyLjg3LDE2LDguMDYsMjcsOC4wN2EzNiwzNiwwLDAsMCw0LjA5LS4yNmMxMC45My0xLjM4LDE2LTUuNjYsMTguMzUtOWExMy4zOSwxMy4zOSwwLDAsMCwxLjEyLTEuODUsMzAuODUsMzAuODUsMCwwLDAsOC42NywxLjM1YzYsMCwxMS42OS0yLDE3LjQ3LTYuMjRzOS43My0xMCwxMC4zMS0xNWEuOTEuOTEsMCwwLDAsMC0uMjMsMjguNzUsMjguNzUsMCwwLDAsNS44NS42LDMyLjQ0LDMyLjQ0LDAsMCwwLDE4LTUuN2MxMS4xNC03LjI5LDEzLjA3LTE2LjgzLDEyLjg5LTIzLjA4YTI4Ljg0LDI4Ljg0LDAsMCwwLDUuOTMuNjIsMzEuMTEsMzEuMTEsMCwwLDAsMTYuODItNS4xNywyNC42LDI0LjYsMCwwLDAsMTEuNjgtMTksMjUuNjUsMjUuNjUsMCwwLDAtMy43LTE1LjM3YzE4LjY1LTgsNjEuMy0yMy42LDExMS41MS0zNC45MmExMTUuNjUsMTE1LjY1LDAsMCwwLTEuNTctMTEuNTcsNjQwLjA2LDY0MC4wNiwwLDAsMC0xMTcuNDQsMzguMTYiIGZpbGw9IiMyZDMyNzciLz48cGF0aCBkPSJNOTA0LjUsNTU5LjM3cS03LjksMTAuNDktMjIuNjIsMTAuNDd0LTIyLjctMTAuNDdxLTcuOTUtMTAuNDctNy45NC0yOS43OXQ3Ljk0LTI5LjcycTgtMTAuNDEsMjIuNy0xMC40MXQyMi42MiwxMC40MXE3Ljg5LDEwLjQ0LDcuOSwyOS43MnQtNy45LDI5Ljc5bTI2Ljg3LTc3Ljk1UTkxNS4xMyw0NjEuMDUsODgyLDQ2MS4wNVQ4MzIuNiw0ODEuNDJxLTE2LjI3LDIwLjM3LTE2LjI4LDQ4LjE2LDAsMjguMjcsMTYuMjgsNDguMzhUODgyLDU5OHEzMy4xNiwwLDQ5LjQxLTIwLjA2dDE2LjI4LTQ4LjM4cTAtMjcuNzctMTYuMjgtNDguMTYiIGZpbGw9IiMyZDMyNzciLz48cGF0aCBkPSJNNjM3LjEzLDU0My41Yy0uMjMsMTEuMjktMy40NywxOS05LjY1LDIzLjNhMzUuMjcsMzUuMjcsMCwwLDEtMjAuMzQsNi40LDE4LjUxLDE4LjUxLDAsMCwxLTExLjg0LTMuODZjLTMuMjUtMi41Ni00Ljg2LTYuNzMtNC44Ni0xMi40NywwLTYuNDcsMi42NC0xMS4yMyw4LTE0LjMxLDMuMTMtMS44LDguMy0zLjM2LDE1LjQ4LTQuNmw3LjY3LTEuNDFhNTguMTksNTguMTksMCwwLDAsOS0yLjM1LDM0LjA4LDM0LjA4LDAsMCwwLDYuNTMtMy4yMlptMTcuMDgtNzMuNDRxLTE2LjUtOC4zNS0zNy43My04LjM4LTMyLjcsMC00Ni4xMSwxNy04LjQyLDEwLjg5LTkuNTEsMjcuOEg1OTMuNGMuOC01LDIuMzgtOC45Miw0LjgtMTEuODNxNS01LjkxLDE3LjEyLTUuOTFjNy4yMSwwLDEyLjY2LDEsMTYuMzcsM3M1LjU3LDUuNjYsNS41NywxMC45NGMwLDQuMzQtMi40Miw3LjUxLTcuMjYsOS41Ny0yLjcsMS4xOS03LjE4LDIuMTctMTMuNDcsM0w2MDUsNTE2LjY3Yy0xMy4wOSwxLjY0LTIzLDQuNDItMjkuNzcsOC4yOHEtMTguNDgsMTAuNjUtMTguNDksMzQuNDEsMCwxOC4zMiwxMS41LDI4LjNjNy42Myw2LjY3LDE3LjM0LDkuNDYsMjkuMDcsMTAsNzMuNTcsMy4yOCw3Mi43NC0zOC43Nyw3My40Mi00Ny41MlY1MDEuNzdxMC0yMy4yOS0xNi41MS0zMS43MSIgZmlsbD0iIzJkMzI3NyIvPjxwYXRoIGQ9Ik00ODYuNDgsNDkwLjUxcTEyLjYsMCwxOC41Nyw3Ljc4YTI4Ljk0LDI4Ljk0LDAsMCwxLDUuMSwxM2gzNi4zcS0zLTI3LjQzLTE5LjIyLTM4LjMyVDQ4NS41LDQ2Mi4xcS0zMCwwLTQ3LDE4LjM4dC0xNy4wNiw1MS40NnEwLDI5LjI5LDE1LjQ0LDQ3LjY5VDQ4NSw1OThxMzIuNzIsMCw0OS40LTIyLjA2LDEwLjQ2LTEzLjY2LDExLjY5LTI5SDUwOS45Yy0uNzQsNi43Ni0yLjg1LDEyLjI2LTYuMzcsMTYuNXMtOS4zNSw2LjM3LTE3LjY2LDYuMzdxLTE3LjU2LDAtMjMuOTMtMTZjLTIuMzEtNS43MS0zLjUtMTMuMjgtMy41LTIyLjY4LDAtOS44NywxLjE5LTE3Ljc4LDMuNS0yMy43N3E2LjYtMTYuODMsMjQuNTQtMTYuODUiIGZpbGw9IiMyZDMyNzciLz48cGF0aCBkPSJNNDExLjcsNDYyLjFjLTc0LjU0LDAtNzAuMTMsNjYtNzAuMTMsNjZ2NjdoMzMuODJWNTMyLjI1cTAtMTUuNDUsMy44OC0yMi44OGM0LjY1LTguOCwxMy43MS0xMy4yMSwyNy4yNS0xMy4yMSwxLDAsMi4zNS4wNiw0LC4xM3MzLjUyLjIzLDUuNjcuNDdWNDYyLjM1Yy0xLjUtLjEtMi40OC0uMTQtMi44OC0uMThzLTEtLjA3LTEuNjEtLjA3IiBmaWxsPSIjMmQzMjc3Ii8+PHBhdGggZD0iTTI0Miw0OTcuMTNxNy4xMy03LjMzLDIwLjA1LTcuMzQsMTEuOSwwLDE5Ljk0LDYuOTJ0OC45NCwyMC4zSDIzM2MxLjIxLTguMzcsNC4yMS0xNSw5LTE5Ljg4bTQ1LjQ2LDYzYTI0Ljg5LDI0Ljg5LDAsMCwxLTQuNjMsNS4xM2MtNC43OSwzLjkyLTExLjI3LDUuMTItMTguOTEsNS4xMi03LjIzLDAtMTIuODgtMS4xLTE4LTQuMzItOC40My01LjE5LTEzLjE4LTE0LTEzLjctMjYuODZoOTMuNjFjLjExLTExLjA5LS4yMy0xOS41OS0xLjEzLTI1LjQ5YTYzLjQxLDYzLjQxLDAsMCwwLTEwLjIzLTI2LjU4LDUyLjYyLDUyLjYyLDAsMCwwLTIyLjItMTksNzMuMzcsNzMuMzcsMCwwLDAtMzAuMjEtNnEtMjguMjgsMC00NiwxNy44MXQtMTcuNzIsNTEuMnEwLDM1LjY1LDE5LjYyLDUxLjQ1YTcwLDcwLDAsMCwwLDQ1LjI1LDE1LjgycTMxLjA2LDAsNDguMzYtMTguNzVjNi4yLTYuNTksMTAuMDgtMTMuMDgsMTEuNzItMTkuNTFaIiBmaWxsPSIjMmQzMjc3Ii8+PHBhdGggZD0iTTE4NC43OSw1OTUuMTJoLTMwLjlWNTE3LjMxYzAtNy4xLTIuMzUtMjQtMjIuNzItMjQtMTMuNiwwLTIzLjQyLDkuNzgtMjMuNDIsMjR2NzcuODFINzYuOFY1MTcuMzFjMC03LjEtMi4wOS0yNC0yMi40Ny0yNC0xMy44MywwLTIzLjQyLDkuNzgtMjMuNDIsMjR2NzcuODFIMFY1MTguMDZjMC0zMi4xMywyMS4zMS01Ni40MSw1NC4zMy01Ni40MSwxNi40LDAsMjkuNzUsNi44OSwzOC40MywxNy45MWE0OS4yNSw0OS4yNSwwLDAsMSwzOC40MS0xNy45MWMzMy43MiwwLDUzLjYyLDIzLjMsNTMuNjIsNTYuNDFaIiBmaWxsPSIjMmQzMjc3Ii8+PHBhdGggZD0iTTc2NS42OSw1NTkuNjVjLTQuOTQsNy4wOC0xMi4yLDEwLjYxLTIxLjY4LDEwLjYxcy0xNi42MS0zLjU2LTIxLjI4LTEwLjY3LTctMTcuNS03LTI5LjM1cTAtMTYuNSw2Ljg4LTI3LjY0dDIxLjY0LTExLjE1YTI1Ljc0LDI1Ljc0LDAsMCwxLDE3LDYuMTNjNy45Myw2Ljc3LDExLjksMTguODksMTEuOSwzNC42cTAsMTYuODUtNy40MywyNy40N200MC41OC0xMzguMTlzLTM0LjA4LTMuNjQtMzQuMDgsMjMuNzNsMCwzNi4yNWE0MC43MSw0MC43MSwwLDAsMC0xNC43Mi0xNC4yMSw0MS42LDQxLjYsMCwwLDAtMjAuNzYtNS4xM3EtMjUuMzMsMC00MC40OSwxOC44NWMtMTAuMDksMTIuNi0xNS4xMiwzMC43Mi0xNS4xMiw1Mi42M3EwLDI4LjU0LDE1LjM3LDQ2Ljc2YzEwLjI3LDEyLjEzLDMwLjM4LDE3LjQ2LDQ4LjIzLDE3LjQ2LDYyLjI4LDAsNjEuNTYtNTMuNDEsNjEuNTYtNTMuNDFaIiBmaWxsPSIjMmQzMjc3Ii8+PHBhdGggZD0iTTYwNy4xMiw2OTQuMzVxNy4wNy03LjI3LDE5Ljg4LTcuMjcsMTEuNzYsMCwxOS43NCw2Ljg1VDY1NS42Miw3MTRINTk4LjI0cTEuODItMTIuNDIsOC44OC0xOS42OW00NS4wNiw2Mi40MmEyMy44OCwyMy44OCwwLDAsMS00LjYsNS4wN2MtNC43NCwzLjktMTEuNDEsNS4zNS0xOSw1LjM1LTcuMTYsMC0xMi43Ny0xLjA5LTE3Ljg0LTQuM3EtMTIuNTctNy43LTEzLjMyLTI2Ljg3SDY5MC4yYy4xMy0xMS0uMjMtMTkuNDEtMS4xMy0yNS4yNmE2Mi42Nyw2Mi42NywwLDAsMC0xMC4xMy0yNi4zNCw1Miw1MiwwLDAsMC0yMi0xOC44NSw3Mi42NSw3Mi42NSwwLDAsMC0yOS45Mi02Yy0xOC43LDAtMzMuODUsNS44OS00NS41OCwxNy42NVM1NjMuODksNzA2LDU2My44OSw3MjhxMCwzNS4zMiwxOS40NSw1MWE2OS4zNCw2OS4zNCwwLDAsMCw0NC44NiwxNS42OHEzMC43NiwwLDQ3Ljg5LTE4LjU4YzYuMTUtNi41MiwxMC0xMywxMS42NS0xOS4zNFoiIGZpbGw9IiMyZDMyNzciLz48cGF0aCBkPSJNNTU3LjQzLDY1OS43NGMtLjQ0LDAtMSwwLTEuNTksMC03NC41NiwwLTcwLjE0LDY2LTcwLjE0LDY2djY2aDMzLjg0VjcyOS44M3EwLTE1LjQ1LDMuODgtMjIuODgsNi45My0xMy4yLDI3LjIzLTEzLjIyYzEsMCwyLjM1LDAsNCwuMTVzMy41NC4yMSw1LjY3LjQ1VjY1OS45MWMtMS41LS4wOC0yLjQ2LS4xMi0yLjg5LS4xNyIgZmlsbD0iIzJkMzI3NyIvPjxwYXRoIGQ9Ik0yNTcuNCw2NDIuNTdWNzkxLjQzaDMxLjc0VjYxOC4yOVMyNTcuNCw2MTcsMjU3LjQsNjQyLjU3IiBmaWxsPSIjMmQzMjc3Ii8+PHBhdGggZD0iTTM0OS4wNSw2NTEuN2gtMzRWNjE4LjA1aDM0WiIgZmlsbD0iIzJkMzI3NyIvPjxwYXRoIGQ9Ik0zMTUuMDcsNzkxLjY3aDM0LjA1VjY2My4xN0gzMTUuMDdaIiBmaWxsPSIjMmQzMjc3Ii8+PHBhdGggZD0iTTQ0MC4xNCw3OTEuNEg0MDUuOTFMMzYxLDY2My4xNWgzNS43MmwyNS41NCw5MC4xNywyMi42NC03OC42MXEzLjktMTEuNTgsMTUuNDQtMTEuNTZoMjUuMVoiIGZpbGw9IiMyZDMyNzciLz48L3N2Zz4='},
    bh:{name:'Supermercados BH',logo:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAABtlUlEQVR42u29d7xk2VXf+93hnFPh5ty5p7unJ2pmNJIQCkhIIoMBIRDGxgkwBgPGGPuZ52c/8LMND2NjMDwDJtnG2BaYYAxICAkQCKUZjWY0sWc6p5vvrVvxpL33+2Ofqjr39u2eGaGRhKj1+ZxP3Xsqnaraa6/0W78FIxnJSEYykpGMZCQjGclIRjKSkYxkJCMZyUhGMpKRjGQkIxnJSEYykpGMZCQjGclIRjKSkYxkJCMZyUhGMpKRjGQkIxnJSEYykpGMZCQjGclIRjKSkYxkJCMZyUhGMpKRjGQkIxnJSEYykpGMZCQjGclIRjKSkYxkJCMZyUhGMpKRjGQkIxnJSEYykpGMZCQjGclIRjKSkYxkJCMZyUhGMpKRjGQkIxnJSEYykpGMZCQjGclIRjKSkYxkJCMZyUhGMpKRfLaJGH0FL90XqxRkuRNA5XGofPRJoifOxVXVadScsVEmdDXpxNU0s1pZq3JjlTFGKqWsVtIgpVFBkKsw6FV13hNKJqY+1b33ZKX3intIXgYxEAdaOGPAjb72kYJ8JkmgIc1c7T8+ydy5pzaX1pabBzZW2wfSNDnSa8UHuu14KU2S+aSTTuZpOpbEaZTGSeTSPHTOKGeRNjc453DOgfW3QgiQwt8KgZQCpaVFSCN0kOowSCq1KNFR0KnUKo0wCter45XV2li0HETBlbnZ8eUDB8eWT92xtPLND7IeBrKb526kQCMFeWlEa8gyV//X70sOnjuzfnpjrXPPyrXt053NxvFus30sbnYWk253PO2kJL2ELE4waYrLMjAZ5Dk4C0IWryhBAkL4c9IrAgh/3jrAeZNgnX8uDoz1T3cOsP51lPZHGKKDEF2NiKoRQUUT1Wqt2uTYWmVy/FJ9euziwoGp5w4emXji1J1Lz/61z4uuHw5lO8tGajNSkBf5hVjnoh/8k+Tkkx9evnNrbeuVW9c3X7m9sXOqs91c6jZ71aTdJW23MXECaQLW+icGAbJaJaxVqY7XqY7XqE/VGZscozJeoTZWoTZeoVYPiSJNWNFEUYAOJFIKpPS3zlmscRjrMLklSXLSJCeNMzqdlF4rptuO6bVj2o027UaHXqtD3OoSt7u4OIYs84okJYQRIqwQ1utUxmvUJqq92sTY6tTS9Nm5pemPzizNPnT/Kw4/84/fHJ5TQsR2tAxGCrJHIao/8K7OXU89fPk1y5c3Pqex1njV1ur2ic52O+o1dkhbOxD3/G6uNaJWozY1xcTCFDOL0ywcnmX+4BRT82PMztWZnK4wMRExVlNEoSIKBGEgCRSEWqALo6GEj1OkGB4ASvq1bfubuwPj/LnMQGogt5Dljl5qiRNDq5PTaqdsbcasr3fYXm+xfr3B6tUttpa3aa5t09lu4Dpdb9WEhKhCMD5FNDnGxOxEOr04fX52cerhuYOzH37Zyw9/6Ae+avIpKUTXjRTkL5aEoeInP5Lf9qfvu/D6K+fWv3D1yvrnbF5dP9XZbKju5jam24YsgSBCjY8zMT/L/LFFDp9a4tBtcxw4MsXigTEmJ0PqNU0tlIRaEEi/uJUsPCbpHSEHmOI2c5Bb5xd4YSWc848T1vlb/MavhEBKCJRXKq0EgfTvEypBUHhkUoCwfWWHJPdKlOTQji3NTs7mVsLaWptrlxpcPb/O1bMrrF9aobm6Rd5q+c+rI2StTmVyivGFaTNzeP7coWMzDx0+Pv37L3/Dwff/o9fNnksTM1KQz0Zxzqn/993dBz78oStfeP3C6pesXbz2YGN5c7y9vkXe2gGTgw6JZmaYO7rE0buPcPyug9x2+ywHD44xPRkyXpVUg6EFQEBqHRnQMdBJLd3U0YwNOx1DOza02zmdrqHTzkliQxob4p4hTwwmt+SpxRqLs2CN9T9I6VeRUiC1RGmJDgQqkFSqmmpVUa1panXFeF0zMa6ZHtNM1RQTNc1kRVIPJZV+iIPAWohziI2j2TFsNVKuX29x8ewG55+6zpWnr7J+aYV4cwvSFKRCjU1Qn59lcmmmvXTiwMcOn1x41ytePfee/+uLlz4mhMhGCvLnWynEv3hP+sAjH7zwldefu/bly2evvXzz+qaOtzex7SYIiZqcYv62wxy79xi333eYk3fMc/hQnakxzVgkqQaFjyMFRkDTOJqZY71tWNvJWNvM2NxIaGwkdHZSkmZK0svIY0OeGkxmigyVxRU+Uz9rJQX+nHMgQDhweIuCcwgcIPzjS/6WRAx+OSEFQkqEEuhAE9YCglpIfapCfarC1GyFufkKi3Mhi1MBs2OK6UhSVQIlBLl1hbVxbLdyri23ufTcBs88eoULj19i7ewVsq0GWAPVcWpzc0wfmjbzxxYfPXbP4Xfe98qp3/p/vvTIx4QQ+UhB/hyIFPDTT7vb/vA3z375hWevfcO15669cvPKetjbWMV1O6ACaosLHL7nNm5/+W3c/eBhDhyeYHYqYLqmqGqoBGAVdB1sZZbrbcv1jYzryzFryz1aGzHtrZikmZL2MvIkx+bGf5nO4qwF5/xtoRAUSoIoElS2SLta6wNzrwpY60AIhHOFn+YfA87HDcVrClEoUWHKnPPWRyjlfTlRBDhCElQjwnpEWA8Zm64wvVBndqHKgcUKB2ZD5ic0U1VJIARSCIwtrEw748q1Fk8/do0zD5/n8scv0Li6CkkCYZXa/CLTB2fzo3cc+OjhOw+849Wvm/qdf/zGw88aN1KQz0RrEf6DX11782MfuPLXrz57/UtXnrsy1V5dwbYaoEOqS4sce9lJ7nv9aU7de4DFpTqTY5qxACZrgjASxAK2jeNKy3JlNeXqtR5rl7tsXuvQ2eySthNsanDGIJzF5rlf7M4OlMAZi6BY/CUlwbmBIjjTX+TSP9INV5SQRSrYWbAOISXODfNKzlpvNYQYWCaEKPSnSBcX54RSw9dVCiEkaI0KAggDwrEq9ekqU3NVZueqLC1VOLxY4cCUZrwiCZVASUFqITGO9e0ezzy9xpMfPsfZj55l+9IKeaeHUlVqc4vMHV9snnrZwXefvmfyl//yVz333tfPf3VrpCCfZvk95xb+y7+/9PVnHr3yTVceP/dA48oyyfY6GIOamuXofbfzss+7k3tecYT5pTGCQDBZEcyPCVRFkAWC1cRxadtw9mrC1Qtt1i+2aC13yFsxJs5wJvcL3VpsbgZ/C1zh/nirIYTwblFRwsBZvyhFyYr0F7O/wVk3WPB9ZaNwoURhKtzAapQsihD+9WXx+n1XTcriuvrPdV45pLcODhBKg1IIrVFagdLoiq+h1KYqTMzVWFiscmipwuH5kIVxxVhFogQILUmBzXbK2fMbfOzDFzj76AUal1bJGz0CqkwemGfp9OEn73pg7pde+2D3f3znW153aaQgn+KL/g+PuNt/7/fOfvNzHzn7jdeevXqoeeUyttsEXWH6tqPc+fp7ePWbT7N4aIIw0gQKxqowM62xVcFqDucblouXY5afa7N5vkXzWpO83cOmmbcOxuCstxgDJXCl3GthGQYaIfqujhg8xuuE3+2Fj7qLBV/s9s4VnlRhEURZEfpulhu4U86WHtO3WkIMgvuBZekrWV8T+69JkU8WEqRCKIlUChUFXnG0V5YgCgirAbWJiKnZKgcOVjm6FLE0HTBZk1QCIJDoimS7m/LU2S0eeewK55+6SvPMMun1DvX6FIsnD6yefNnir9z3gP75f/W2Bx9zIwV5aS/2hz7o7vrQe575zqcfvvgN15+6ON26dgnSHqI2ydEH7+KVX3Qf9zx4iPGpCp2eIYwEszOa8RnFjhas9hwXVzIuP9Nh9ekGO5capI02NklwxmBzA8ZgjSmsgRsogTPevXGAKCyHkKLsIQ0siY/AGQTguxZp8QTvPhVPHiiLwCEG1XIhZaEfBQTFFe5T35GzFqFk8ZKFYpTgKoP/pX/dPnylX7kXUnoFk3JgWXQ1RCqNigJ0FAyUJaoGTEyFLC1WOHaowuJMwFhdMjmmqNYkUsNGK+ehc9t89LFrXHjoLO0nV9C9kKXjc62T9x/6tVe+svoT/+Jt9z9iRwryyZWffMKdes9vPPs9T3zk/F+7/sT58d7qJVySEs4tcNur7+W1X/Yyjp+eQ2rNTs8QVQQLS5pgUtGQimsty+WzPVaebLBxZpPeWous3cPlhbWwBpfnJRem2LiNKWoawmOlSjEFUvoFXQTlfeUZuFLW+l26cIGcc8MYYxg8FbGDHChhX5H6lqQfgPehKs6awX3DIH2oLH2l6F/z4FxfgbX2StZXFId3uZTyBRgEMgi8NSmURIUBYSVAh4qgElCpBUxOhRxYjDh+qMLsjGZqUjJZVyzUBDaHp9dT3vvUGh/54zNsvP857Kbj4KmD3dsfPPQrb3x9/d/+oy+++4mRgvwZ5T0rbvGn/uuV7z7z8HN/58JDZ2Y61y9BnhLOLnDX5z/IK7/wbm67fYZeJujEBhXB+Lwmr0laVrC+bdi43OP641s0LmwTb7awcQI2x2b5wH3CWqQaLiLX9/Nt3wK4UoDsA+d+/EAp4+SM9Yoj98QUuCIeKaxAacH3LYpzDqmk3+n7Ab4UQwNEyZIM3s94BSgsVD8uAjE4769bDpVCiuElKOWtCCCl9Aoi+8oiQCpkEKBCryxhxSuMDnVRm1HUxgJm5yIOHaxy9FDIzIziwKTkeF0yIeGxLct/+9gqH3nvk2z+0dPQDjhw+5Gdez/32C98w9dO/ejbTh+5OlKQTyAr9c0/v/43Pv6BZ//J2YfOHm9cOAtpl2ByhtNveAWv+6r7OXB4nHbPsdM1EEAwpRE1STt2bK8nbFzusHWxRfPaDkmj7a1FlhUBtvWL2bmiANEvZzO0EqIUEJcWMoOFKgvPqIg1+spS+P/e3ZID98n1rUV/tdO3MoW70w+2+z+OELuux1sfXxMZxCmDyqIrWYvhz9u3aIPz1iGU3oUa7sdDPtNV/K8kolAUob1lEUqjIo0ONWE1Iog0QaiQSqK1r8VMTEUsHahy9GiFw0uahUnJ0TFFTcIfLuf81kev8cw7H2H7T89TUZMcvv+2q694w7F//fN/59TPCSF6IwV5ARf0f/xW8/Uf+eOLP/j0B8983tpTz2Dbm4jKBCff8Ape8xUPcPT2GdodQ6Njacc51CRRXZFmjnYjZfVim8a1Ft2NFnkvwcQxLi+KvtYMrYIxOL9f+53elYLvgT64YQp1sNNTWIRyDUIUQbobeC2iH3f0laUfIJfjjv619J9UvO6umIIikO8H4G743nvdtQGgq29R+gauiJUEQwXxZkMU1yULK+NTz96yeOsyUBCpkKFGSIkqrEo/NglChdJyAM8PI8XiUoUjR6scPhRyYFoxV5ckTvCeC23e+67Huf7Ox+id22Hy0GHufN3pD7/hLUf+z3/5FQf+0I0UZH/5E+emf+JHL/6Txz5w9jsvfOiJSrZ1DeckCy+7h9d8zas59bIlnJBcW41ptHKP9pNgrSPu5DS3YpprbbrbHbJOz6NtrfHHINA2RZWaQYpWCO8aDVySUkp2sMAK338QU+wJwAfxhyncon5M0VcGx66iXr8OQqkO4nbVQVzJNaKEXCxZlsLFklINfslBlosh+rFsycqWx1mQWg1Swv5+6b+HvuUTAqE1Uvuiowh8PUWFAUIrdKC9olQ0YSUgiBRayeJyHWGkWFiscOBQlUMHQg7OKiZqgisdy//6vWf52Ds+SPfJyyAmOPqqu9OXv+G2n/muv3r4X7zh4MT6SEFK8o9+Y/stH/zTKz/2xHs+fu/OuadxaY/K/CEe/OrX8Yo3n0aHiqsrMduNDCu8N4RxJD1Dt5XS3GgTt7okrS42y3BZhrMOKRzWGFxuBtXnfiGuHxCLgQtkSzWKYhGaor5R+OmD1Kpzw0JcucbB7oyWVGrX84YBeOECGTMI9r37NOwbGXh2/cxYXzGMKTJQJdesXzSUapg4KN5DyGGK18csapjVcoUNHViQonYSaK8Qg/OA8ooitfI4rVAjpEAF3u3SofYp9UgRVgKkFBhjyTNHVFEsHKhy6FCVhTnN0rREh5L3/OEV3vUzf0jzqefAKcaPn+Jlb7nvmde/4eD3/PDbDr7L/UVXEOdc9a/+9PI//ci7n/qHlx96LMw2l3GE3PaGV/Hqr3yQg8enubrcY2MzJUlzwsmQUElaOzntnZTmVpduo0vS7mKSBJtmRRXa+h3fuWEmaoBpKtcwhv77UFlsAVsR/TU5VJZ+5qrvovS/xV1FPDlM7eJ2uTxla+AXrhsaol1ZLjewapkVe7oBHR7H63xGq29BSi5hH3fTVxYhBE7IQdZMONDClZIOQ9iKjz0EDjkI5FGKjCIeEQIZDJVFKIUO/f9KS58WrnhlUUWvi8ktcS+nVg9ZOljn0KEK85OS8dCxfLHB773jEc6+/2Ho9SCc5Ojn3pe/5kvu/LH/+h0nfkAI0fkLqSA//MH49nf99sWfefqPn37T2hOPYbstwtkDvPovv5l7XnOMXgLXrndpbMVEUyEzB6pkXUNjLaHaaiCbLZJ2j6wX47LcxxnOV7ixtnCn7LAYt6vJYs96w+GkwjhJagUJitgpekbQM4LMCYzxAEOFQzlTxLdiV0zQb2wViFLGqb9uXf+eYo3LQUr5BgPUt3RScHstZkLmRbRUCsydK+Gxyj9pUZQcBP7WN2MJn4gQwtHNLU/2xshRw2LiQFmKv6Xym4pS1JXlnnqHsJQOlgW2XyCQgQ/WlZZIKQtFUYSRRhdoZGscWWrJMsvEZMTsbEA0N0Z26BB5mvHIw1d5/zveT+PMeayImD19Jw980cve/9avPP6t3/Gaiaf/QinId/y3ra98+IMXf+rJP3jsYOfSs7jMsPSKl/P6b/w86uMR282c65fbWAmzR+uMTQR0tjI2lnt0t7r8wqV/zcTlR4hdf0GIQXZpvw/Z9/IFuwvhpe0dpEBKDVJjVECuInqqSkuNscYk1+QMl+Qsz5gZzplxdlyIMQ7tDFrYUqBdeu9SlqlfVd9tQUvuU991KxTEIhjXOb85+evkmxdJrEP207t7f8IBwFfs+WUF5YSXBXSomV28gzdf+yLaucdbDa5NSh/XaF3URKDnFH9j+jI/WHk3T11dZdcVlKxk+avffZXihh8jcY7pakT8mrfz7+7/Zo5OOw4vaq6utHjXL32EZ37ng1hrqCwd594veGD1jV908jv+zdcu/tqnep3qT/UbKgXf+NPXv/e9v/vMD57/ow+H+dYyqjrOqS9/La/8knvIrOC5cy2ajZTqhObIHZOEoWTzWo/Viy0aWzGLySYHts6z8twZpA5QSu3GL5VWzGAn3bWI9jcizjly57DOYa3FOot2jinhmJKSu7QirFTQY9O0xg5ypXaM9+sT/KE7zkU7ibWO0GUDN6yPwfLGSyCUGEbHg7qFd3tc//r6LpY15MZyOGhT27nOc5evUo0iVLFjDz/i7qKi6J8r3ZaAXWRZRiwtzYOvpZEKQjW0WA6HcIWSFGBJHFghuSPYJt7aJtvYoFapDnBd++64ZeW8yQOybpfMVHg8m+GppxvEhyJ22iEHZyu8/Ts/jw+cXOQ9P/0uelfP8dH/ub24vdH9H9/681f+2c980+EfFkK4z0oFcc6FX/sT13/sA+8+8+0X/vhDmJ0twtlFXv72N3PygSOsbyasXOuQxhlzx8Y5eHocCVw712HjcovWRodWK+W1eplqa4OlsQkm5ueRLih8cvapD3BD8HxDarT8tysBEItA3tqcLM9Is5ReN6Gzcx1nLnFYfoBvqtf4pulDPDX/Kt4RPcgf26NkFkI8wldq/xWLMlykuNZhnaW/6IssW1G5d0JxiG1qwnJydpb52VkUGmHkQAFEH281wGOJwfn+38PHCpIkxmRd/tNalV5WI08zEAKtDFFk/YVaB0IV2ubQNuN02CKUivuOHac+Po40EsxuJRE30RTB7jAMBK2dHSw57zCLtFqCpx9vszw/xtaxCkfnLa/74tuZWJzgnT/+LtpXr3HuvX+iezvdH3p70550zn2XECL+rFKQ31x342/98Wu/8PDvPfW1yx/5MK7XZvy223nw6z+f2YOTnD/XZHOlQ1DVHLprhgMnahjjWL7UZeX8Dt2tLkk3Jsscd2cXMK0dkBLrBPq1CrXUT5uye9cUL8KRdCXnwEgw4HKH60REHYdrOiZ3LG7HkDcykmZMs92lsXWOExfP8K9m38nZI5/HT058CR8yB4icGSzafppXIEqJAuF/gX4MVBT6BA5ncqwx3FVpk2/2EMLDN/QdksorM7/TD6xEyTSWFGWQxSrhFMPcgNDcq6/zT3ofJJQGKS0PP32E937gMDoYppYFDmMtdZdylB16SUa9EmBz4BU58nTsr8PdwmEve52lv8M0xUnBmw69nzuCJzFxRp6nPLNyH09deD3HDghO3zXP1A+8ld/5mT/h+sOPc+3DH+GPetm3fFUvm7/g3N+8TYjGZ4WC/PIlN/1zP3fhHY++79kvXP7IhzFxzPRdL+NVb38dKgp57ultOq2E+lSFI3dNsXioQmIc1y51WTnToL3RIe3G2CxDITm5fYZuq40iIM26TH6vwc616K01B/Dym29tw0yPu/HUrjB30K1XpDulVWijUHkAzQC3PMbMcxNkj+e0Pt5l9VyDpdXf5N8ffIjfOP2X+cnwDaRGoPdYs12ORwkN3IfI+yyaQQu43azQandRQtNqdFj4YkP22is0r8RIzb4ujNir8/uE8A/yJJ+DpdtxzJ+q86P6G3nn+44RhAxqM85ajDUsVnrM5Q3avZhQheRZi8m3dmmMXaW72qPUdsILp6/zV/JK81GEs/ScY/7OGv++83383iMvI0siOoshB6arfM3ffwvv/E9jnHvPh9h44mN8wNiv+vac3/jDpvu6N02IjT/XCvLbDTf9H37q8q9+7L3PvGX90YewuWXxla/k3i97BamVLD+7TdJJmTk4zpE7J5meD2l1DcuXuyw/tUW30cOkqe/FMIaKSDlu1uglGRUEajJGLdQhriPcNEImHkYygI2XdtJb/Xy7gk03SA+7zGCMBzLaPMbmWVEwdMgjAnU6IPy6CvN5nfkLB2j+XsLF/73BWx/6Ke64/QL/56G/RiMPCEoI2mFVb+h29ZXDWV9dN8CYshy1G3TimHpYpScS1GGN2DEszI0hZeoDabH7M+4N0kvYlj2aJAi32igR8cjHZ1G6XHfxfqEVjgWzTdXGbKUZeZaRhzkTkxnjPZhaGgPywk38BNI+DtCa3noLKWpc3TmKsCkrl7r0umPEaY2D05Kv+KZX855axJPv+iCbTz3KBzLz+T+I+/Vfeda97e2nxfqfSwX5zfX18Z/62Qu/8vgfn3nL2qMPY3PHzMvu484vepBeDitXGrjEsHh8ioOnxhmfDGh3DFfPtdm40KLXjDGZb2e1xmCAY0GP+d4qndwSOoM6KZATGiE0kwePQesJX80uu1slcN++scdw+959n5NFvBD0Cws+lSs0xkpMkpG1emSNLkmyhpizVL+rxn3fMcvaH1ke+C9/wI+uab5z5q+QqgA1wGX132JYpBTO+UBeqgIdLJkyHabSBtuZoabBTUAwnxCEVYIgL2iISp9tvxU6OLfnvATqE0T1gJ6ocfH6NEoNUQDO5uBy8jzjjskettPCWYfJLCwY1HiOkhVkmIMMhop6y3ypYF/TPTZNEEiSaJyd/ADTs4peM2Xj2g5ZkhMfHOPwHLzp7Q8gAs1T7/ow7fNP89HfUZ8XhsGv/uG2++o3Tb807tZLpiDOufDLf/jsLz79wUtfsPLoY7jUMHv//Zx60/10DaxfbyIyy+yRCQ6eGGd8XNPcyVi51GH9cou4nWDSvNhVC3PvBKfyVcL2Fm3ncBbCuyQEClQFsgZuc9Xn+vvZICH2d7NubUqG9zt3g/8ihEArhQ5DovkIDszgrCJvJSRbLbrtFaZeFzH9hVPc9u4P8E/fs8A/y96K1AYhhpDyPjREFIwNzjmPMLYWJwJuU4baepftwnnXCxo1niNS6bmtBotS7Bch7z63N2khBegK0GKtPcP1xjQqkAjpsKZw+4QFaThtN8hM5luGc4dYMEid+UDeJqCC4Qaz7/XcwgeUEmQILqORz7PZrFGrWqIgYnvTIyTSXo4xExyaF7zhq+8jyyzPvucjNJ55gg//ln7jjzj3n51zX/9SBO4viYJIAW///y79u2cfuf62qx/5KKbVZuz2Ozn5+feTKcHGehdpYenYJEvHxxif0HTaOdcvdNi+1ibr+R4Naz1EhKIfwgrB6dYFbK9DKCRSKyp3V8Ap0JOQrxXBcLEIxU0yWEK8GE3foySFWAdx7A8lEWFAUAsIJiZwdopks0uyukb2pohveeO7+Pj/OM6vP/O5VEMDSG8tCsvmM2betVFa4AxkueD2fBuR9Ai1RqGongxRYYy0gWeSKyAfuw2E2MfF2ptr77tlGpTl4uo0naSKklmRlnY4YXE2Q9sed0QdupsxSvpiX3jcIMmHwEghdlticZNym9i7OTlPm4oCabi6PU+jqajWMnQUMDkT0m7mdFsxVy840mSMI0uKN771PvLUcv6PPszWmcd5bLz2lV8T8JNaiW/JP8mMES+JgvyVnz7/9x5/ZO3vXvngw5hul+rRExx/04OkgWRnJ0XljpmFOotH69TrilYr5/r5NjtrPZJeSpZk2NwOAYbO46mEkJwWG1hjiHRAMB4S3RlCBkLXIWl75Qj0/m4Vz1MMeaG1U7HXwjhPdegKKL0OqBycIFqaJ7myQtI7x4/8nZ+k+r8M73j/G6lVbFF174MXi85CJ3FG4JRFYbnbbWPyjFoUEYqQ+p0h0uWIIPS7dxQOinn7Wo0bLna33+9vBeeuL5CmUK3YgeVwJsXmCfW8yRHRJk4yAqWwmSE84SB3Q5IIsTsDyPMY512PV9q7xBqeuz5LmloqUQZSUIk0airAOejs9FgxFmvHOLIU8Nqvuo+40eT6Rx9n7bFHeHJ2/Ju/8WdXnvlP37T4bz6pm/0nWzm+9b9ffcuzZ5o/fPZ9XjkqM3Msvfo+5EyNRjtHpIbpmQqLR+qM1TWtnZyVix2amzFZnJGnecESYotmpmIZScGYMtyptsiSHCUk6oBCH44gLXg8047fVfv5RFvk9Pu4KVeyCDcc+9zH3mN34b1fr0Cq4n2LukaeQa+DcB0qp45RXboNceUiP/y1/4G/9MqPkLkKOlLoUKEC33SkA40K/P9SS6JQcNJtk6Q5URgilaJ6e39huqGb5srx036fy+5/TmnP36slT5yZ8ShdKXyCw2UIciwZ80HMtExJ0wwhJEYZwuMO0qJmUoLps7dff3cZ9saEiMC7Z1kKSnF1awGb+0QAziKFJQwFE1O+Nz7tJqxcbnFlJcNJweve/rnUl5awvQ4X/ugDfPQjy//qu/7b6pd8xirI9//2haVnntr5mYsfPlPJGk2QITOvfDmVIzN0YovCMTkWsnCozuREQK9j2Fzu0W4kZKkhz/IBXkrsTrZgEBxSXWab10izHJtZ5FGLnNS4XICIIev53SjL/Y+f5f5I+/8XR1o6+o8ZPD7zCzzPS/cVR146BufM8H/j+9nJc8/UmMTQWUMtTFI5fhfZhYv84Nf/R+47cR0nI8JKQFQLCashQaVAw9ZCdCVkpgIH3Q5JmvnaXQjBYobLAZt5xTfGf97++w4Ou89Rut9aH1hnCZiAsxtHUNIU/KUGIQyQYmzMUdEkSjoY4/tobDUnnMd/55jhxkKp113sDX721GrKpk4FkMYgIy5sLCHIMblfC85atHZEFcnYREBlLCLpxFy/sMOlqwlBPeRz/9pbQFexvRbn/uAj4Ucf3f7pf/uejUOfcQrinBMPPZ392JUnlk9un79I1k2ZuOcu6icWiZ1EasF4qFg8WGdiPCCNLY3NlHYzI+nl5Ek2TK9aO+SOKnxcIyTHklX09iomN1jjCG7Xxc4dgm37xW1LzUjlXV7sd8j9z3Ozx+85pNidJROlZqW8WIjGQmcdNTdJuHSK8a0n+d4v+89MTPgeiiCURBVFVA2o1n3jkYwCjkYx0c4aeQH3ENOCYD5HoMCW07ui9PnkcJyCLJ2XpfsKvBUqAJPQise4eH0cpTOfriXF2RibdzGmx+mghc3Toh9GwIxBjxdQGWuKIHvP++069kkWlIqaSA15Qs+Mc+HaOJIcITxK2VrPShkGklpdMzYREtUj0m7K9YtNrl6NmTsyzZ1f9jqsgXRnnXMPPXfsPQ83f8I5Jz+jFOQbfvrcX75+sfn1K48/jcss1cNHGL/jOLEKqNQUNQVT4wHjExprHDs7Gc1GQtJNyTODtQ5rPE/tsFW0HC0FnMxXcGkPXfQoVO4P/e6lKpDteOXos0dL6YFffSKC8tE/r+Q+9/WfL25yTux+j/4C6TcZlZ/TL/oZC7019OFjWDHB65f+kNfc/ghCRVQiRRAqwlChA0UUKXQl4HC8gU7aKKkQThIeVuhailCBf02t979+WbqOXbdi92cSGshYa0+zsa2RIgGX4EyMM12wXTBd7pQt0jRDK4WwAn3Eoit9qiK7J5MmXlwdRAqfSncJK80p1hp1cEVDmyw3tDmCQDA2ETA25WefJJ2Ea5dbrK3FnHr1SRYfuAeb5uycf5bLZzbf+k2/sPyNnzEK8vf+27nFldXsh6889DRZuwdhherJ27D1MaKxgGoEdSWZnIoQCNrNnE6rsByZGZA2uxJBghAU8Om+b+y4P9gkT1NCqVDjmuiuCqR+JAHJznB3LN+Wd9nB4iifE7sXz2CojdyzK8rdu/CuHbv0nnKPcvV3yiwFu0N4+E5ke4uvefD3vY4GCqUFOpAEQQEXDzR32HXyJCbUGokiul0hRFYooitlosqfkRsth9zHWvbpSZXl7JVJOj2LdL1CMXpgezjTQ+Vt7hiDOEkJAx8sh6cEos+essviso+ZELcO1qXym5o0XNmYptMLAL9RGuOKmUFuwFOslWB8IqQ2WSGqBrQ321y92KLbs9z5lgcIxyewWcaVR57k2eeaP/TD714/+BmhIOevpd+3dmHzSLy9jZKS8MAh9PwCeqLCxLQiyhwTYyFRJOl1DL1eTpoYstQMGAFtyaUaMA323RcpmYjgZO8qWZqjhUYvKsIjAS4xviaYdoqU557C2S4XaO9vt9dnLgWZzu2fptz1vP1ev/z+YndqOdlBjE9CMMHLD3yU25Y2kEoTRsofFW9FAi24QzdIioUpEEQnQOQG0Q+M9y5McYsFufcuqXycpBzPXpsjS3vguggXg+ngTAdre0zKmAMiJU0ytNY4DJVTws9W6Luu+6MUn6fYVATtUvnYTToubS2R5bLgLO6T3/nfwRhX6LUgDCVj4yGVsYgw0jTXW1y92ETXIk686ZVkrRjT22HtwsbBP32y+3992hXkrT/y6L2NzfRbrj16BptajIzQCwfRUxNMHAioYqkHilpNkaaOODakqSVLPf1/n7l8GH8UPdVFRVcUGPkF2WO+s4LNLUpIgiMaOSH9RBmRQ54MWQhfEBSotLikwoOQxO6kSz+G6JNH75cm3qsEe/8ut/maDESCGD/IRLTByfnzRJWQakURhZJAC6o1xUzVsbizTG4sgdYQCKLjQO58KlmIF5+aLit8P4OlAj5+poq0TcjbONPB2S7C9jCmx5LoMqctufV970YbwkMCMo8V2z+N7m6tHOXT/QBda565ujBIiNlB8VSglBywxkgBgS7GP4yFVMYq4Byb13dYW+mycPshJk8eJ+/ENC6dY/1652/93f+6+sCnVUHiPPo/ls9ujaWtLnE7JpxfQk4uMH60ytSEQPcsUeTJELLMkiSGpJeTJbmvbxTK4farWEvP7eSU5kC2STVu+DqDk4R3aQiLUo7tDljPdy0Wd4vNrNSxx/gSLpqFmUVYWITFRZifh5lpGB/z7ozdqygvFJC3B5hoOlCdBpdx/7HLOCfQnvGTMPAu0WTaZKqzTm4sUkjEuCQ8kIMp4pobYB3uhkzqzWE1DDJYzkacuywh38FmbVzWxuVdnOmS5zEnZExoPaRFOIEdy4kWHS63FK2J7A9wc7e4Drc7QE9jnKjy7JXZIsXsvzNbykoHgRq8Td+K1MdDorrPAJo0Z+1yg3Y75+jn3oPNIcsT1s+vVi9e6/xj8WdoC/wzFQrf/mNP3Xv1eva2jecukqc5ulZHTC0yfmKa6UOasN1DIggCSZY70sSSJqaIO9yQXaSUFhdS+FZOJwbkbVZK7tHbEHeRwpMnRPcWhS4ZQdYsM6vdvFK+t8orihqGs2Bjzj6j+OBD3o1RyrEwDfeeDlg8EUG3NxzDJl9kMOqGM0AwCQQTkEtmaqsEwTCcsHjI/sF0k7DTKEgVBGJBoCdTiMUAGHjjB9rT++64eU2igIg0OlNcuZwgTNOftznOJNg8xtmUu2uOPEl8c5QBFnPCCQ2NojdRyDK/0fMXCG/YO3wGa8fOcGVtEiVdqQQlBh3SxjpPatdv/JSCQEtqYyFpr0LSS+ltd1i7qpg/NMnYoQNk7QY7q9fY2lh469/8D1fu/8VvP/LYp1xBtnbct25da9bSTg+bGfTUDLVjh5k4ETFdtyTXDZH2O0KeG9LUkGdFAMawPbbPUOicQCrlAdnKE5EJQOuAe3pXSTsdlBAQCcI7NSSZdxfS1q1/HFFyj/b2LqigYPqw/N//rsZ//1+WUKWkNufz8y7fEjZwfyniK39okYnAQdqjgAq/8Gp8eQ07U2TWQmq6TSV0BEpgnSPHYYTitmwd022jpMQZCI8KlE6LBelKCvICLUb5u5DCXz8Zl9YqrG2lOJuRuYIV0mVYl2Ftxu0V6MUxUkpsbgmOO5Q0OLEPQtjtU7jfS1yx63GyuI6U1dYkzXhsoG92gGcU+3gCjiBQWGt9erwWEtV8EbFxvUFUi5i96wSX3/ch6gctW1cb0cpM7duBb/uUulhf+L2/t5Abvm7j3OUCSySIFg4wdmqG6UMS1clRuUNpH3jlxpHnljy3GGMHymHMsCjo+y+Ep5XBZ7FkoKkFjuPNi6RJikQiJwX6kMal1m+/afdGV+aFbGXOgQoQ1tBpKZ45J6iNAzXBkQnN35/ULCUa+0tNHvqHq7hqvSA8cbd4j+ezJnawe06O+TJOGEAUeOSIUpbjvWXiOEErhbMQHBcIk/kKunAvLA6+KcyjGJyoHNcuaeY6TY6pFkdll+NBzLEg43hkubNiubcm6fa8guS5ITzh6zv766e7sZru3P7KQYEEyA0Iw8XNxSKD5ZdknzhigHguJW36fGRR5FPjUVVTqUfoMMBkOVvXtpD1MYLJafLMELfW2W7Eb/vmnz23+Cm1IMHcoS/bvJ4u9bab5IlB12rUTh1j7FTEVNWSXc5QSqKU9yf7bBbG2OGEJTvku8W4ITOOKH0pUjDlesw1r5GnOQEh6ohCzUlcbJGhgTzdH84uxI27Wxkn0oc6pDlrjYjVLcFiCK9G8LddxnySshF3OQYkv9MmXl2gOlnzz816wy2yTE16q921vHCkZLulqUR+7oa1YIWjJg0za5dJ8gylQpyF6HY81utm+LLn8XB2L8wic6Q1J5/a5j9mq9SooIMApfWwnx6o96AdJ4xFEanLiI4Ljz4Qzwf4dLe+hnKiQAuevrKEMUUrgaOIQwqOrgIwoJRAKbGr9z4IJJWKplcNCKshcVPS227TrlcYO7hEd+MKtdmM7nZv7so1/ZXAz35KFMSB+PweX7t1cXUwhy9amGP83kXGZgSV3A+xrAQ+XkgSS5752d99KHV/Fp9QApdbZGFphvMxfE3AaM2hdJmJtMF2YXvD0wpRlbieKPL2xgd8e+MPt0/W8QYlUTiRoK5KfujqNU5FjjlnSbKMPEmYCwLSNEfnQK5AV/2Pl3ZLrpN7Ab0QAx+n6BgUWDWHc8LX+5RXEt1qsdRbo5kZxgIJAURHrc9gqRKc3N0koyqex7JIDXECYUB2pofqdkB0QekhoZwDYy0NHOOVKlpqulGP6lHhx/SKEsXp82on+8dDUvsZ8zrkqUtz3ioVdSU3gNANNzLrHLIc3+NQCrQWBKF3tYJKSNru0tloUqnXsCmEkxE7m1tML9S/Tgh+9sUa/k9IQd7w7b9xOE3c65rLG9jcIJWiduIQEydqTI077LUMlztURWIN3rUyXkko0nhDetqiqIYrYg6BLHYKIcDogLvzDUR7p6BKE0WAbnFoyNrP09shbo4olYUfrMF9PObuzhYqkaRaUwkCZK1GnueY1DB+vEo457CxQNai5/dtbrZuZFQ0OoUsNw8Qao8bkFiEgrl0m0pri4YD4STMCML5HHIByuwP33hB1qS0c+dtLCFczJiu1qnVqlSqVcIwRKkhM2NuDFmWkcc5biqnshDiuhYRlL1zsf97upv803+s1JC1yKlwaXUWJd1u3FZhTax1u7KBA7JwvEXRuiiwBpqg4sc0xNs7qGgOZIQMFDqIabeTV7/9R5478o5/ePuVl1xBbDj3qqSVTSWtDja3iLDC9N0HiOYU05WcnUZaIC882ZqHkQxTukPigmEQJ8tDYESRySpGfp1snCftdjwnlILglILcw8pJN9mfee35dnfvbjgLFoF5IiNEEgQBYRAOAlPbteiJiMP/cgmRbWE5gcw3Su6SuMWCFHuiVQl6zFfVZY3zGyephmYwAhocx7J1bKflNw4LekmgKwm0+8Nz1AuPN/aekBKCKbBbmLSOmzeoCYmsKGQkIHAg3eDrUlbgcomLBWOnI4IqECtQ7CmuijLP9guIgwSgwMRs20Msb02glCgKhCXL4XP9gw3V4deFLZI8UgiCUFKtB7SaCh0FCCmxeU68tYOKavR2Eibm6/Q6ZmK7aV4LvOOld7HC6pvyVuaBocZSGasxc98stRqIzJK0DPWqLgjUHXnujyHi2g1ikL1ZH1HQf/qWBYlUcLhxkbSXoJCIcUF4IsTlwk9ESnt73Cp363ikXMRTgaf1MZrOo9sk5NATCCNRNY06oJj43Gmmv61OeHyHtDFGdLgGO1tFevj5vAu3OxMTBCBqwBZXtg+y1jqOJANhEcKiNUwuXyJLigDdgL5NIkU+dA3FrbRB3FpbhASrcWmGkQ1O/kifvaQ3yCqKm3wOIcGsxujJk8CKz8bt/ZzuFlpRvk8W2TgyLm3O0ehUCaL+XEXJXromOSD0ZjD6QZSGDEkpCEPlOYKjgMxB1ulCoEh2YmZedYSNp1N2mvJNnwoFkSIIXtFcWfOwBwe1wzPMHqujKiDWc59dCiSmAB/2rYgrYghXIkrDgdSyMBzekkgtUQWOqG5jDsYrZLkhcgp1UBEsKQ8xCa2vTiOe32rsOtdPqGtcmiK1ZOEf1LE7IUFVEswpgiWJXjBQSzE7a+SNWaKFg4jmE3xChJQCiGY9xEPnfPDCG8lsjUClGGsH3ZOHdq4TDxTEUbkdyHNPOid2Ez7sryy32MadhWwTUR1Dbbf9d2eyUuZpnwBGAEEFsggVVhF2G8j8BvFC3nu/S5HSxzLa8ezKEkkaFGwqYjh8tG9NrHezlBaD1O+gsi4lSji0FuhAIZXwViQIsM0GVtRJmim1qRqq0kQG4f3OOfFiiOdetILc+ZYfnHZOHOk1WsX3Kpk4Psv4tCQ3lnQnH+CqbEE4bo0tfEkfnlvrRyJbMxwEo7Q3pT57VQTvWnPIbTHVWqVhLFhNeEohxiV2yyBtMmA0f0HBcvlHUwIqUwgTE1+7TO0VbjDWwFkwTmLbASqdIBibR+sedD7uXRwlb12DKBNR9RdNNA5yAkyH69tLPHT5CwlkgnAO4XxbcZR1WWiukOQ51TDAaYhOUmCf1B6FcM9vMW7wjS3EOxAqgoUxAuM7IHHu1ru/UEXMYcC1b1GHcS/gMnxqnSQBLXn83LynQpKqUApBeay8K4qe1jhPZVywwFjrEz2DZKSWBKGf2ivDAAPk3Q7CebrWyoQk7iS3/fUfenoG2HzJFKR+8v6DcSdb6O10yBOfLpw+Nk1YBdEWxL10cMHOOIz1CjFAQ+wDKenTOvczWFL5VKORkmOt66j2djEfEMI7JEjfnkrWeYELtXyueCProLmC1BNEU1PYLGfIbO7fXwoDrgtmC1KPCdu1+F+QIXEQjUG0BHlGhuV/Pvo3sWISJdIite0h3ZNZi7H2Nt0CYuLqEC3lRf95iamlvFl/IjCKEqn3LuClc9y8wmmGuz/Pkyl8viBEBZB0IKxwYW0epYazSWTBQ4YTN0zo7bvnssQkOdhg+8jooCDXFhKXxhgceZwzPhPS7Lq5y1dbR15SBUm6LEVVGUpZIC6VYnqh6oFk0tFo+4v1bhW74o7+mDMhBLZfMOvzQjm3m19WgEVydPsCWbuFLBZkeDrwNQEV+B4Q5G6FcPvVJfaprFv/YUg6KARKl4pctvTcPhzlZvRBt1JIqaA6CeEsGEHmOvzmo3+DS9uvRKtkOKDHOIxzTOysQ6ftFdUJxKwgmDDQLS5K6BvdGSdeJHMku2s37Dn3idQ/3Qu4XwwnWvlaTJeOmOLyWj+D1a+D3NiwZi0o3Y9HxMA76VMday2L7Bu7YfjWgBEknZTZ2THWLsQqQBwAHn3JFKQ2VT+QW4FJM5yxyErA5EyVIIDYUBSSfAyR92MP+lNed1sRX1MTWGt930cJ/CakQCk42rpMmqZeDWoQndaQGoSMIIt376RuD3pW7Bl3tusHdTdCxMuPkaUd9JaFMbd7xLMQHnkYVCGcAMYASzMx/OpD38ITa59PNUoAiXF95KpDKJjZWMbGXaT01jc4JlFhDrEstPYFpHb3xuzuVg8onxa7i6mfFHIQt38Gy3ks2HJ7lpWtMT88tT/+es/IuAEqxTqcdFjjM9VikAKmcNkL5XFDJcJabGrJuymzpypEY+A69kX1iLx4CxLbcRENAyqhNVM1jZYgrM9WCTd0rfoZK28l7I0oV+GQpYlKsgArOgcVk3C0dZk4y72HMe9h7jYxIC3O5LtrcMLdOI987wBO8QIgKWIPXf+urEo/wC8sxKAJS/ncvgp9MVFHgCXLcj783D38wZm3sZ0cJQpTnPNNT/1ajzUeUXC0tUwcx2jp60fRaYkw6XD+x63g5W4ft8i9mG1+H+/K/RkV42YBunGgLM9eWaATV6jV+4Tbw4Y0a0EhSp6gGGywA+D2Lt5xNwS6lmprzhjSTsr0WECatSHLJl9SBckyKlrZXSn+euAzDArftyxL2t9Pxbkyc0j5Qw1uRYl0w+G0ZDbfYXrnGs3UoCzoowI1KTBNgwxS70uX5vPdHMHKrRXl+ZSj1LhFEEI4Bjr0RT/qBRFCz7McKsi6lt7ZLu/deh2PXXst6507qFQDKmGKELqwlHI49BOHMhkHOuvESYoOQpxxVG/HE07sywz5PAXBP4tL9AkriXv+15cK0hQ0nLm2iEUNOh77MYdP3cohb1i5qMxwBH2/C1WU11hxDgfCWRyQxRlRUMxNlDJ4SRWkWg8w/QAKh8sznymQvsATKIszAq29i7V3eIorK4nzWQmcw8nyGnbkTnCot4JqrpMaQ4BEn5AQOJyVkMdDbttdJQCx/855Q3bJ7a8UezFcAyWRUKlBfRqIYGcFwpMQLGG6l5H1HquPJGy8o8nKO3dwZw2tr3wtq191klqUE2iFIyhGDciCmR5s7lkgx2xMuLlJy1pCBC50RIesbwjr97vf4Nq9WNj9zUCbLzYT9UJe5yZ3KO3HrOmQZ68sFKiJ4XxEUU6ECI+q6NdByooiZb9F2yOh++ftoABt/HAia703IwS18Yi0sfPSQk1ajXZcmRofQACcEfS6OVULUjqs0GCzEmK3NMG17PL3xyVbt2tWX/8BVkgWNi+StpsY58iwRHcHg3kaLu0Wu0QR0wy+U7c7w+TEPlkst9tt2mtV9sYwoqghpAnQ8PWM8RO+t4MnkW6T7HqbqaUK43+7xsLr61z83x3m3v1fiA4s8Sev/wqUE2gpkVLhCmZFn30RJEZQW9+k0t6mUTQnuSkI562vFyh3E8Uo/X3TrK97EebAvXgr417E6wm8C5o0yStjnF1dQkk3AEgKUZ7xIkoAYR/E94Gs1rhdXoMQPik0zNMUFgRHMYCMTurothICKbOXVEECLVqqmPUtpMDlGZs7KQcd5EKgtSNzYhAru3JY4Eoz9vqTWAcF4r6SuMLvdBzbOU/XGCweilS9U0OcgwhxWewDNWOHwT2ltTMwFm7XRKahwribZ5/2xjC20MQs9cjhXstn0XQNdAURjaPCFNfpoNhh8gHJg28cp7e8xNFf+U0urd/P8tIpD7ZzAllkbKzzGazcCQ521nHddrH5OdRhSVDLYOf5hgC5IUvhLQPyT4bV+AStSzlAFxpMwnpviasbk/jp0kPmFQ91F7sY60sOxyDWsIVrZR3keRGsG4vJ+9xfnu/AGYMMJK3UEIUa6/IXZUJedD+ISborYJBaegXJDBtrPYyBzAnCSkGjWUAAdv2ORQXUGTfMahWL3JqCpNr4oS3SZBzduUg3y/33O6mo3KYwvczn5PNsYKFuWuNy5ffd3fu+i23RlitTbjcfb2l+Rz9NXeD3IW5AewXaa6jAEU1XqSxOEUxMYZs5YbTC9N+7xtd8wS9R0ztkNsANsjVeQXLrj8Xt68S9LlIITO6ITooChrKfMrib4K3cPn/v/53s+7gXohzuRcYluyAm/fndKRfX59np1IZBtRBI6QeB9utgshi9rbTcNW5uGNf2eQZ9r5ErU0cVSiIEqFDT6Bi0y4nb3esvqYJsrW+uaO1SXa36xiZj2L6yTR4X3kAtAmeLKjloNRwHNgii8MMr+/0gPjPh/zfGYCxMZG3mm1dIcj+lSR+QBDNgE4NwxbwOW7hx/Zl/u0zyzQuIQyyYLWaj76Ef7StKucq893bw45fGPxsDWYp0KeHcGOHSMUzDcFv9d/nW1/xL5sa2PYpWgHWleenWMrW1MujeM8ZSOQmk6e7Qw+1JU++iVN1HP3bRrd6wa9yUWXXXi+zdTJ5XG8obyp7zUvsygHY8tzJPbkOvIJSCclfuBypQ9c4DE32Gc1g09M/x9zmLb+XO+5S1uceQaY2qaFrtlF4rNi7Pll9SBele/sBylrMWVaPBwt+8tEPc9XWQoCoxrh9cFR2CotzG4HZVRX3WoQ9NcQUPtGO6vUatuYYpFKR6QiOr+BSpzQZwluFvOGRI2d2Q5UoZtNIHUcrv5sV45htAlDe1JuzP57sL0uGg10aYHYKjx3HMc6T7B3zDAz8Ctot1aqB/ae5QSY+xjWXS4rNaZakcLzJYzu4fUzhuXPTcilPY3UIZuAlX8YtQiJu+fukfHeDiHmjNU1cP05+PIkt0Tf1C32DuYrGG+niL/tfRjzWshdzYAe4vTzJcnhcYPf+caCyktdFDS7Gh2ptXXlIFaZ/9xW2tuVqZHCvIFSzNq5s011K6uUPUtQ+aCnZ2KUrpucExZDEpp+acsb4PwQkOtK4h8x6i8DXH7g37rA64LNnfKpRec/C/8zW2vqIIrRGzS7jKJLI+gZycRIyNI+pVRLWCqET+h1QFNqhP+7NXYW6wJvv4+1kGnWX0ocMYMcfx7J18we3/g06iya3zP6wTVFrbjDXXSXLPdevGHJVDFpe7PfUXd+N7uRdz3Iy4297ETLl94pgXa4FK96kA4hgnazxz9YAn4e8H6IgiRh32ApVfRohh/GoLl7hPEeQc5GlOGmd+vkqagPGFbBUFqEiRtBzG2AvPvPdvbL2kCgLkSbf3cGV60l+0ksRr22yebZIlkAYKGclBc5SSYjdLjSt9QGt3td7aYifIjeO25kXyLB1cYP1u7VOeUvovYO8E2/4gzIGi7FaWQXZEK7/e85xmGnB+ucKFtSqXNmpc26mzk9dhYgwxPYbwTeJDi3IzJbH7WJP+bZ5D9xrB4VMkO47XLbyD+fp50kyRZpbMwtj6dWg3PKo3c8hFCCcLEmr2sxjsw0B/q/SrG9ZwtN4H9LjHKg74wPYyxD+PMjyfSyYUIuuxk05yaW0GHfSLg0NrMYxdC4WQpTnvQtwAGbMF6WBWdLbmaYpLUw8zsQ5dC0mTHNcTmE7nsRdb2fmE+kHaK6vvmzpy8jtVFCJ1TN5ssv7xa8yemGVbSKJxjdnOC9iN7/zqu1vDpKPYXWmX/e/Xgsg51btEL8t8vicQ1E76CrpA+kUnb8IcMlAMUWSwSinOoovQ9WKczfj2f36M93+sglYZ2BzpMnSU85dmG3zDqzuc+mtjjI+H2J2W5+OSxeLZNTBG7DPn2A3jEikh6UGliZ67jWDnWV516Pf4jSf+DgpDYh1zO9fpNlvgHFlmqB5TKJXus9heSDdS//OWUAvV8YLNPvEM7nn+/HWS/mfpT+h09oUjpfdTUinBCnAJV3dm2WqNIbQrhqVKZNHuO1COAXkgu5I9/cRiP1Zz1nm+g9SQJTkmyXBxx/9eQUA4HtFc7xKkVbo73T96sWv9E2I1uX7mIw9LlTdqU+OowOvYxkfPkqxltFOHnaiQpLmHC0gIQt9fPsD+SbnrhygHzdY6qiZmcesicW6RgJ5VRIsCm/rGImfNcB76vghUsSc+KWW6gghnLI1uhcfP1cmMIk4UnZ5gpw2X1yXND1ge+YEe//WrV2htCUQYDrJsJbKmwqKUXLD+YdyNs0l6m6jpWbKe5IH5D4DZIc8MeZZRuXSB1GQIvD8dnRCIogC7yw2ye1/X7T43OOzwVgdAHbezDVFAJiOysD48An+kQY08qGGDGkbXyYM6JqoXRdkiAeGe573638femSTFRuHSDKThuZUlkryClCX07qAOUpr9jhhgrvoK0/ezbCkLmmWWNM7Iegk27vnxEIVOV2dqpNsZNsuaOkv+9MWu9U/IgiRnfvhy+3O//AO12akv2750HZSidXWD7nNbuBPT1McUTiuyzBCEClUAD5WSQ7fnhhjC3xpgIm8y2V2jYQwRUDmuCaYk6Q4egr4fJKL0R7kOMqj5DbYEjbAdrm/U2NoRCFFUXLHkzjItHV9YtXQSQevxnI/9+x3e8EMzuHYXJ9xgfriPEsuFRG7ssO0H7BI/i6OeIaIJJuw5FsaWOb+6QBy3WGpeo5fmg12xflri0hwp9gTYN631iZunZLXGJR1EYPj3//MQv/RrdQKd+/ECWYxJu+R5wlgW808DT47XiXtcyw33fv8B3vz61JM8VKLnp1O6lZVTGheniEDy1LUjWCdLE6pubLIfxCGlcoHrk/YVZsQYR5oakl5G2svJewkujn2tSipPhxYoXBxgyD587t1vvfIpURDApq3tX588dOzLVp+pYjJD1mnTfuIS4cQkO4GkXtckzcxbDyUIAkWibJHjNrvwWMOCoSNHMN9ZpmY6NIzzw1jvCEAXU2BNdgvgUNkLGPo9/RkjQkocEiVyzl6OaHcNYZCR25zUOKaU4h+lOyzkCZeThEWg+eEU50LQIc4kCKGKWmO/d1vsBkqWi42DXbQoNtoUWZug4raYiK7T7s5QaW4w1lilawyRVrgK1I8DSX4LGMlemMnNaHaKa+q2IIr444cneeJCnUCl2DzFZmDijDTLuStzjE+FLG80SRPLtjHMzmtPCl6OtcSLAGvtmkUYQOx7QJ6+dthX0Et9H4Os1R5S7hu+Ajscm53nliy1JN2MtBtjerF3r5zD5obKdN2P4hifIt1s/OonstA/YV6slSff/87JA4dXpg/MLG0lMXEzZfvxZ1k4eZJmJSIaC3HbKXnmCCJFGEp04Fko8lLg5QbWww/NyaTmVLaCzHoo5xVk/J5ijh147NdNO+nEHmqf3WTsFG2sQjmePldBpCnTMuWgzbgvj/mSpMVc3GWl2WTOOVIgzMDlnk1QSjnsW3HDSv2NpAX7wO1x4HJkpYrMcly6RZxmzDdXCNoNn7iwoBahMmdxPQOBvAWN0U2wWPsExqQxXTHGpZUJKjWFQmAVWJGSW0XmJPeEiskxzVZTEsiIyUnF4dsULrMILV48zmTvZiEDSLp01Tjnrk4XLbSimEYshq63GLL7l8niyj3oFNkrYx1xL/dzLTsxttP2LRB4lshoIkLZACnsxs7V5d/6lCpI78yPXE9e85d+rX7w0HdsXV5FCEF3fZ383GUSdYLeKUUllCRJjipmX0SRJukZn9orgnYxqIOIIs/tuL11gSzLCQuEcO2kHx4phPMB5mCTEYOmo5vsNyXeWN+nYXODEQGvenyDH1veZFE7ppxFW0vsHJ08Z9Y5+vmjiYMBwsZYKzztqXUlXfS4qd3ctLdo83PODxlVkkqY0+slRCvXEGnsMUa5o3JQElRyROd5UMc8/9sVHUQIk3CtcZCVxgQ6NGCKuRwi8NAPobirGoDLCYMAYyzTpxQTExa3ZhH9oaifqBTuqDQ9rrduY7055S0I5bqHLL4fuau1xvcF+bVB6bt2DpLY0Gsn9FoxeaeD7bbB+NhXaj8FuT53kKzT+7W1D/+V1U/k0v9M7O4bT3785ypTUTcYqyGjEJun7Dz1NHKtw86qI61p4sQPyJECwlASRgodFMGZLBWHCndAu5yjnSskaYYGdF0RHdXYrHBpnC2B28omeWii99438Gd14BUkD6if2WYp6xD0uqRxTJ5lVI1hUkqiAuKgEdz2tWNk7QQRVHDGfGItroNuxKLxSWk2twy9OGZx8zLWWk8zZBzVU6oYQ7YnmNp3x96nJlFOuco+zajhuZUZOkkdoUJQIUIOlSOQinuqAZmxRFrjEMzcGRKQ7uHgcs+fSNvvOpTy47yl4dz6QdpJtZgKJwa9QsNKshuGdW5YFuiTnTvnXateN6PXyei1U9JmB9tu4dKCnSUzRJNVICCsV5LNC6s/9Ymu8T+Tgqw/9J2PZt32byzcdbvHZilJe3UZe/UivYsZXatJpaDbyQdUkVExJEZpVSoK+S/GOkct7zLfWyU2HoKiD0jCRYHLnO/dxhNcC+Hfr4/dkVJ66HT5KBFA+DFpAdictCFJrvoUcgBUEIQIpGXQRx/pkLv+3jxzX+zI2qHPdlq7J4iUe+YA7pkytXfSlQz9fA8ZstMKSLsdlnaWSYp0dm4MY3cpRJoPA1h5i4E8e2cjijJk2o9Ydqmn93zm6gyZCfEzI7xyOCQGxaSD2yJNL/ODcjIHc/dEkGaDQPkFj8cW+/yjNS7JIBA8tXKc3MghQLFYA0NUtxh0/opSEbgcs2aZJYkNnWZMb6eLaXfI220wpqCydcggYOLIbWTd7m+s/+nbHvu0KAjA5lNP/EhtptaeWJojrEaYzNB49klY26Z5zZCEmm4vI0stSkFUUUMrouSuKzAI5tIGE+kWsbFkgDqlUTUfBwiT7y4Eut1V813wkpvMHRHC0L5saTfSolIgQWpUrUJ4oE7t/gkWvmmeO359lvl/kNPbMERT47jO1j5UN+yPAi67e+UFI727lpg61zbH0Z0GM61VulmOMYZUGSZul9i4tDBFaYzbLubBWySy+jGY1rheD4KIJ85OIVWAkAHWSayVBZ+j4pAWTCuK1mZBGlgW7gqgfB238GKfFyWsAlyvC0HIE+cXPUlD8VkG3kAfltRn1Sy5WFLKwdua3Nc9ep2MXjMm2WmS7zRwSeZnu2c54UQdXalRm53otVZW/vWfZX3rP6uCrH/k2x+bPf2+n1+4+/R3t1Y3wRp62w2qV58C7qcVRggp6XYzxnVIoAW1ui4yEDkyE9hil7RCcjRfh16DpNitK7erAvxoEXk2qAl40+xuldAaAheFQEnlyxdxzsTJgDv/4xRRAEEgCKqCcFKgJxyybhBhjIkdWatGZbqKa172rp0q+INlv5NN7BrLJsodiOX7HEU9QgExq+3buLBSp9a9jm5uEWcZGoWZhNqSK3ZbNZwkuyuz8yLYVKSGXoO4WuXZyzOeWglVkD9IfF+84EQgIEvIjUE7gZ2EmSMC08tQ/URBnwHFvYhGkUEPiMZ1O8T1Mc6tLKCEj8X6iF2KW1lSDFUgep11OOH6HbRkuaXbSWltd+k12mQ7TUw7h6yLc6CjABkEzJw+jem1/9P1937dxz6tCgJw6aEP/evjr3/z10wcXDqyk8ZkvZTGxXNMj83SPn8YeUwis8yTDEeKMJBEkSKrBH6kc25xRR/6sfYlkjz1XM1A5aTCpbnXi9wU8wzNDcHpjVPJStVXY7FSInQFR4+8vc3Sy3e7ys4JMquQXY3OA4JQIFwXs70xiJesNQPMkCcZcKVkgSv1ogxdIiElSAs6wqUJQud85NlDbLcVM+tXCfOYnrXYHMIFRVQ3uE3DgPLd3ExBxPO7O0jIYlbyRa5tTCCFwxmJc3LIP4XkTmVIU7/55JlFH4f6mMGtGdDFdC3h9reQz5dmVsp/X2mPFY6wvD2LDhhA/sUe6zRg1iz4d30R3itmmlu6nZxWI6Hb6BJvNrDNDJt2ccLgMoOohOj6FNFE5fr6Bz78L/+sa/uToiC9M//4euPIb3zf0r0nfjlp7mBX18m7KZ0LT1AParT0JHIB5HaPmdkaUgqiiiJLFVmiMFphjfe7D3Wu0klTn8qTgrFTCpPaQW7bObdPzeNWrgYY55tn5Po1wiBE1KSHRA+ITfpFKYNwmU8pdy2uSCA4hsBEV6BIhwwsJSaWIj/fH9gjVKmCGE1CpwEq5L2P3k633eFg+xrOZD7wzCwzpyKUykv4rtJR5ogqEzTcTE+kwuUO4VIubs2xtaMJZAbIotjtkbHaOe6QGb00RUpJmhiqJzVapEV2cQ++TDwffby7gWbU5RYpci5sH2anW6dakzfQhw7+lqVQyrlBat3kjiQ2tHdiWlsd4s1tTCvD9HKwTU+WrkCogIX77qKztvpPNs981/U/69r+pM1JX37PW98hTPorSy+7m6BWRUjobTVJVs5gN1rsbFpaPUOrmeCKASjVWkBY0ehQIZUiJOdItkpc/Op6SlI7KMhjM+gxcWaY3tgPUOrKf5SgITY35F2PGxN5inC+r0RY44uPpugWNKZY7fKWPFGOvT0WpT6UASFhMTIpqoKIEK7Dc9cP8EePHEBk2xxqLmOsRRWgu6m7fVAtd1nBT5BaRClcmiECePL8JFkmcfjqc79ZzTrHmDOcqEp6aYqWksRYZu4NEFlWyi7tA7e/tekaShBg4xSpHU9eOURudWEpikxmP8Ei/cBOwZCZpM+7a40lywyddkq70aO7sU2ynWK7CttbxuZ+RoyTmpm77sFmvd+88jt/6Zc+Gev6k6YggDn7pw9/T20yPD9x/DhBvQLW0Lm+Cu2LJNeatJqG7UZCt53hrKNSVYyNR4QVjQw1UyJmvrdMUkydqhyWhNMCE3tXwxZDdtwN8O0b+5j2Q3jvfZwQuzM/Yo8bU27lvTEev7HyK0qjCWRQsK1oBeOL2G4LIsHP/u4DbG6luPYGi91NcmP9qDUN03coXJwV5IX9biFxY8Zq79zzXWOhi9sgxHZ7EIY89uzc8LMPrIfFWFhUjmlpyfIcJSWxNMzdrbG9gm5I7hk1vd+E3X2vrcjm6QDT6UIY+gq69tgrqf39ffdVKjmoeRQ9l74yVkwnazdTdjY6NFe3SLcT8k6VvH0V52JcnqNrNaZOnWLq4PjlnWef/k5uSST26VEQeme+6/rW5dVvO3D3sTicnEZFGtPr0bpwhdAu07veYnszYXOzS6/rwXhhJKmNBahKwKJpUE+2scbvqmPHJOiiHbcfd5RAiDeYDedu2fPjni8BtZ9y9BNJRTwx+DFFEVQKuavq2x/ZMEjxTi7gUodUMR9+4hD/4/dvw8UbqO0V5k2XvE9RUxOMHZYFxET4GOSFKsWeuRr9+RsujkmocebyLALjW51LAM7cwUmREpiCZMM40jHL9FGJi4tU816q0Vvi4PYodJFqtt0uPTnOmeuHUNIOrIeUQyshlfCdgW43/irLDK1GSmOzS2utQbIVY7qT2M41nG3irEBXI/TkNDOnj6at5dVv23rs2699stb0J1VBAK6888t/f2dt+/sOPvgydLWOlJask9C+eIVQb9FbabGx0mVzrUOvlyMlVKqaaCziWL6KTNpo69DAxClVZIscNrND/1TuHtO2++CmM3Oe3ykojZ+WlGbjlRSg9Oj9Mpp9hUEKmJzDESHyhEY74B/8+OfQ2GqT9hpMd9cZswmZsZjcouYl9VlwuS1DLnfvCLtQsvbmzU995pekx0Y8xYWVcSReAVxe9GwXbtYdrkeSJlhrSZIcFmFswuIys5uz192kJ2aAYjY3HtgiQI9Zj+e53pgnCIbV837tShau1WBRimG9o93KaGx02FnZprvRw2VzZDsr2GwVmxs/USKsMX//feQ7zX967fe/5p2fzPX8SVcQgIu//uYfd2nvp46+9lWEU1Mo7cjbGb0r16iNteit7LBxvcXmaps0MWgtqNRDjqUr5HnRAwKM36mH9QxrfY5cDhfwrk2LfbB7+zTA3TR1v6cZaS9/V5nsoVyL2dWQ1UcHKAmTszgqiMSQOsPf/aGX88gzdZTZIem1ONjbQJqM3FrSzFI7rggi4wdbloB5g+YlY4ZZrcGR73OYArPmEDbh8vokW5sS4eyg/8a7qxZpDHcGKe1eAs7RSzLqtysCnQ+BiXYfRRycs3uUZE/3pZB+Y7MpF7YP0uiMobSPNfoFXqUKS1JQhyrtNyST+YxVXzl6WzF5ukS6tY5LL/jJxCbByAoz996PFOnPX/ztL/03n+y1/JIoCMBzv/I/v0cp++sL99+P0AEuaZNs9UiuLjM+nxBvNFi7uMXGcou4l1GpSI7sXCDpt1JqQf02iekZnLHs6cBkH5AndtCTfpPDlnrP94tbCoYTZ9yQecXeqBjO7iV+KMbHSSDQMDmLNSEih8TEfMe/uoNf+4PDhKLt4eVpj2PpDr0swzpHai1TdynIshJ4s+g5MW4368q+nY17DikwRWD8+HPTJJkuOjh9W3MB2KeO4bA2dGIP8OukGbMvCyBJh1bsZn33+zBl7v5B/FgK042R2vHM8hGM04XVUAMl6RcIdaEoOMhTQ6eds73WYfvaJp2tDGOOkG2vYTpnvOLmCao2xsJ99zM2pf/3xV/77e/ik8Qo/ClREPiJ5OkPPfy3alP198zffQ8yinBJm3itTXJljckjkLa2Wb+wzsZyi2ynxZHeNXaMIwfUnCRaFOSJVxCKCWR92p1d1fL+36bUr7PPGto1hHuXRdgHTuT6ilJkz/qt2/3nFP3zCOEDT62gXsfVpjCxRmrL6naPv/p9d/OL//s2QtXDpgkmyxB5xkLeYTPNSKyhh2XqdoWN0yEd1F5GErtnd7ilgijyboIINI+eXRi0NlPK2honOSBzpl3KRrdHL8tokjN/l8J202EF/YW+5w1ftk9QZO0uIgp54uptxZAbOayOC1FMQpaDD21yS6edsXG9ydaVddoNyMUxss0VXPcpwEDSRkQ1xk/eTW1h7I83PvLYX4d/13spVrHmpZSz3918Zu3ffv2db339r0p9/5tXHvs4Jm7RWxVYYOaeA3SutVk7m1DvBsysnCWNArJAUD2m0TVIN+0g29kfnlLOTziex3cqBZE3DLntlyzk/jFLv82DAQF34XlIrxQy8Nk3whCrQqytoF0FVYt59/uqfO+/fTlPnp+iWk2KJjeHtYqqhcO2x1QlJEYQBzB9IsDEHQJROOFK3HpQ503RAw6UxnTbJJUqT11ZRNjcKzt2UBTNCThOxpRyzE5PkXdjKjXB3GGJibNiZsfNIPQvBOLuofam0yMeG+fMyjEC7QZuVT84H5AxOEgTS7eVsr3eobm8RZxVceow+fp5XOtxXN5D5glORUyeOM3E4dn3r50597XtS9/TeKmW8EurIADN7926/tDPft3BV73sHXP33PcF6499DLOzToKhKWDy/sN012JWr2zzg7d9G7VxSSwkn/c5j/Ba8btY49B9HlYjfFfffj/YTWDfYhfsfR8SdDwrfX8gy01/8yJ415FGVwJEoLFSkzsNtoqO6sjI8tyzCT/8c0f45XceI7UBlcj4tlVR9GSLCBtM81O1BwlsSqocU9M5b104j4sNaOELlBY/KGhXU9ItMFGunLKW2LhHSy1x4WKIEv15kIWL5SSh0DzKPH9rx2JNlyRPOXUy5e2zG9g1i6joG/v+934p4vkdFJvENMIjXNueJQj7gbk/dKBKAbmjuR2zs9aiudYgdbNYuYRdeQbbfBqyDiJtg64ydee9TB2Zfd/ac499XfvR715/KZfvS68gQPOpv72l0x9/2+wrH/yF4FWvetvKxx7B7GyR2IyGcUw9cBAzM8UfnL/TjyOemOAL7nwGWQSdrsiGlKcPiJtUzW/sQ2A3OvQmjxfsTfMOU71C+syLjEKQmhyNsBodRMiqH+jzyBM9/vNvzvPL7zzKZrNOWIFQg3P98WUKIfyQFyMinqrUcC7HZJJXn9xgrPoMSdMQBZ68YMDiKPbsAreCmRSPd8aAzbi4NsX6dgWBHfIeCwXWIFFsizofdPNgW2AyXn5vm0heo2eLHhD5AoCR+21URSrKpDnCZVzaOUQnm6BSEX5EWj8GKTKESc/Q2olprOzQ2eqQhYewZgq38jh251lcZxtpEgjGmLjzPsYOTP+v8x9+6m9x+bu3X+q1+ylREICts9/d3Dr7/X/lzm/8oh9fevmD37by6MfJWxs4k7LtLBP3LLH04BSNJ1Zpb7c5PXOJXsuRJQ49rlGBKChghinXG9fKC2zWcK6YVSL2LYaI/gx1UYLTa+WDcO3dn7gLTz3reM+HavzO++f50ONzdHshOoQo8mOOHQrh9GDGn+ungHFoaQufW3P/iRVEr0eWWNx4QJ77HvkyjF2IFzDMp/D9s3aDsAJPPr1AnCgqoS31yHslcU4jRUikqn6RZjmfc9cWWatHnll/DSVoyYsH8TqSXpeoKnn6yh0YIqQ0KK0GsYgxjriV0tzq0Vxr0GkaTO0UZAq7/BCueRHX3EBKh6jNMHfPPYTj9Z+//Bu/+J3wn+NPxbr9lCmIl3+ePvNf//m3H/6qPzx36HMe+MG1x88E2eZ10iuX2TEZtVOLzL7iMOnVVU5Nnqc6aalOht7/19KnT8skW/vubi9ASfp5+/1++mIOg4dlSOJc0mpK1rcDVjYCzlys8/Azk3zs6QnOXR2n2w1BST82pKIKZdAeueskTmhECT3rXJGfln0LFfCy25pUZxwiqHqQ5IAjqlSpvtXnE7vHbIUGxNQYj/3qfJFYEKU4zIEruLGKjk4rAoKq4b7TPdRkSKi13wieFzjsbtyaBvSygjDQ6IkJHnv/CYKgaLkOFCBIY0OvndHcbNNe2yExddzUnbjmDm7lY7jGFVyngZASPbHA9F135JWpiX926dff+MMvRbbqBQJnPnVy/Kv/4KusUP9h+7mLB7tXz6HICBfnkYcXWXrVIl98x8Mk5y9hUwiiwLdiuJw8TTFJSp4k2MyPMXbWFBy7w/SVc3vpOEURJAt8p7vbVQMZ0Fjmkl4q6CWKbk+x09Y02gGtbkCcKN+uKgVogdYU07FkMcjHWwrRnzYl1MC1ckiE1MU8Mf/VCykxVnH/iRWOLLb92INdC835eMT1A2w3mNIlRHlIkSxZPzmgDH7o6SU2GlUEZg+Xly/iOZsXrC4GnOGVd20xMZ76LOFe9vvBkJvis0rl59QXPSZCh0gdIHVU3AboIACleWb9bnI5iQ78d5MlhvZOQmujSWerQ149BLUD2NVzuPWncDvLiLgJQY3K4lFm7zq1Ksm+4/Jvf8mvfarX6adNQQBmX/tLd0weOPgzOyvNNzaeeRKZtghnxhFHDlG96xiTh8bZPrNCb6VNNVJUqhJcThrHxO0uabdH2ul6qhdbFMpskQsuI1HdXmZndqNkxd6KoRtgkAR2OGWtbLmcGLhhHtFbKEb5cNIvIopRba6IAQZWwTcCZSbAWOmVoD86if7ULcsgfy3ccBMo46D6ZVLnB9D0P0aoc48273fpDTiq+opiweVeWZwjzUVhcfJSZq8/cq7vcmpQGiE1IgiRKkQGESqsoMIKMoxQQUQQVdCVkDAKqdel7/41EPcM7e0u7bUGcaJwUydxKNzVx3Gb53DNVYQzyMoEk6fuYuzQ3PvT7d63rvzxVzz96Vijn1YFAWD+744d+pwv/b9dbL576/zVMN9aJggd+vhhance5sADB8haPdafWsX1MmqRRitwzpD0EuJ2j6wbk/VibEE5KZzz7N574drcSF2zawycFCX9cfsAWd1ugGJpodO3JEhPzDCYLV7MLxTCK1A/3Tx4fPmnGA7f61tAP2TIDgsh+5FZDzodhz347oZpv/2uvMI6uKK4IkrKMhhsagdZvz5CoI8tE0p55dAaqUOEClBBhAxCdBiiwggdRQRRSBAFKOUJH7LE0m0ltDfbdBsdTGUexg7hWhvYqx/HNa5At4HQAdHMQcZvO55XZqd/7MpvPvQD8I86n67l+elXkEIWv+AXv1zrmR9pX2/c1bl2GWU7hIszhHceZ+lzjjNzoMbm+S3Wz26iU0s11EjpKe+TXkrcjsk6PUySgsk9w3dfQYoxB4NBogOut5tw2t50VNnupqGBO0PJgrg+WKywFPj+a+eGc/j6GSVRBo71d/hBm5AbKOlgRMMunHLZ7A3jMlG4cI7dk7aGU5vsIGYZvP6ucXSF9ZJQns8opASlENJnoYTSSB0gdIAOvXulKxFBWChGGHgivMwRxzmdrQ7dzSaZCXBTR0Fo7PJZ3NoZ3M4KwuWIyiS1A8eZOHH4GQvfs/K7X/iuT/e6/IxREIDa0b9/YPb+N35fr5H/nfbl5cg0VgnrmuDkISZfdZrjrzhIRQmuPL3G1qUmQeqIlEZISRrn9DoxaSch68bYJMHl2W4wnShVpoudWewa1zbsMxFid9DZr6WUGTf6nE4D3qa+NelbFkcRm8jSAF45CImEkP4a+s8tYox+45UY9JkMSayHFmXoYvm3GjZUlQdalh8z5D4Wu6H8xQd25XyAHCJDfcKgyOT1lUMphA5QWqOikCAMCCohulAMhyDt5fSaPTpbLdJOhq3NI8ZmsY117PIzuK1LiKQNOiKcWmL81G1pZXrqpxpXr//L9kf/6sZnwpr8jFKQgTX5vF94czA29y9aq+3X9q5eRmRNwoUxqvef5uDrT3PbXQvk7ZjzT2+wc7WD7jkC4Vs7k15O3ElI2j2yTheXpgNr4vsLzHA+4i6oPMPF1j+/F/3YJ6O+waKUYgFbuDNSlprrSrt7MXpO9Ec5FK8zyEMNxo4VsUbhGnnFYbfrVL6m/ny/wUQ2MWgH7g+7hCEHhCtZwV18e8KDLfvxlhuwxxTKof2GpMMQGWh0FBBEAUEYoAKFs5AlGXE7pbPVJGknuHAcqrNgMszyOez6OehsetLq2gxjR08wfmThg5l1/2T1d77wjz6T1uJnpIJ4+YrakS//238jj90/bl1vHEvWr6KIqZ5YYOp193DiDac5emiC1maX585ssX25jWwbAk8ZSNLL6bVj0m5M3ouxvZ53vYwZkEK7IiAuK0V5bmff7ekvnGFmTBTxwY3TV4e7dn9AaV9R+s8Ru776YfuuGEzLEkLucu8GrpcfJVwaWip2Z7QK4rXBNYmSKzf4jF6hytfh+p9FDntOhpxlPsEglUIGAVIrVKBRYUAQacJKMHitPPVEbt1Gm7QdY2WEqE2DE9itZezKc7jWKkI4RDRJZfEIE4cXrlCp/78rT176BS79rfgzbRV+BitI4Xa94mcOzB667e+nO62/3bm+OZ1uXEfXoX7PEebf9DLu+txTHJ2tsbnV5anntti80MJupahUIJ3Pt8fdlKTVI+v2cLtcLzMI0HFlrl1b7OZi12yR8sjp4fmSz19oV9/f77MBij14MMrBfoFeLr9+STVucn6fa9vnJxXlefViz3y/cgDef54Uw4C8GMcslEJq7RUjDNBhQFgJPHNhwfKSpzlxOyFudcm6CU5oP0teKO9ObVzG7Vz3cUY0TjR7kPqB+YaanPo5Y7Mf3fi9L13+TF1/n/EK0pe5t/z66Upt/Hu6641vTNY3x7LtVaIZzdgDxznw5vu57xXHOTZTYbsZ8+SlJlfONkhXeoi2gRRMYkl6GUk/RkkTXJZ6KlPnkbkeuCgGcPLdC49BgFvesct948NFW3Lmy1mzPcN+KOg298YCN0sKDLNuxawVtw8oSvbdPHHjtF7B7usvZ6j65N5Fq6x3qSQyDFGBQoeBx6EFPqayxpDHWcGsnpLHaVEPCjxKptXArl/GtdfAZohwjMrsAaqHDnSi6clfTrvZj27+4Zee+Uxfd39uFKQvS1/yu3cLEXxn3mp9Q7y6OZVurxDNB4w/eIJDb7yHBx44xt0LNbqp4fHlDmfO79C41MRuJLiOwSWOLDGkvZSsl3irkmWQ5ziTD2dysKff4YagfZg6dTdZzLuKbOW6S6kC7uMROcwsWbcbVlL2l/bDaMkyZacrWYR90AUD/1GWgIhiYDGk9gVAqX0aV0deKZQu7nPOM/knOVnqOyFNlmPTzLOXJCm21cBtL+M6G4BDVsapzB0kmJvbqc9PvsMQ/MTq77zpiT8v6+3PnYL05eCX/v5pofjmvNn5q93VrUN5ax09DmP3H+Hg593NK15xnM89OkFFC57cTHjkcofLF3boXmtjNmJcx2BTSxYb0jgl7yWYJPXul8k9k2OfpK7vypR3/TIxWinuGEyg2jXgZw/K0u0hpi4/RsgiU+WGtZny88tK1h8ULsXuu/uvXZx3A2soBhmpwfsX6VuptYfvBwEqHCqFFMJbi8xijCB3vtvPZak/0hSb9LCNDVxr3fdqKIWsTlGZP0RlfnJZT0z+cm7Mz2+++0ue+fO2zv7cKkhfFt78nkVVkV9P0v6m3urm/enODrKSUrl9joXX3MHLP+cEn396ltunA1YT+MhawqOX2ly7sEPvWhu7lWDaGTax5EleHFmhLP16ivHKYd0eKAt7gnrBnjGsu5XC7Y0LysoidyUEdo1B2zVOgT3Ktt/jb7Qc/cyW75f3GSmKrJTUPuiWWg1GoDlrfZemUFihsU7isgwbe+SC7XWw7R1cawvX3QabIcMaemKOyuwM4fTM47JW/0+W/L9/JscYn/UKMpBTvxvN3R6+WabZX7etxpem2zuT1vYIliqM33eYk686xRvuP8hrDo8zURNc7MJD6ylPXu+ycrlF+0qLdK1LvpNguzkmNf7IjHcjcp8B86PISiPJ2NNFx57Jt/3UsS25ao4bYpZ+wU6USoX9rNRuxRlW+fuA5P3qHv34wkERcMthmlYphFaDOGMwHBNwUuF0BGGEk56ny3bbmGYT223hOi1sawvX24FioJCqTxNOz6EnJ5vB9Oy7dBT8l9WOeC/ve1P8531ZffYoSEkm3/L7J2oBX562O99g2zuvzDudQFQNwZEJZu87wl0vP8arb5/n3qUa1YriWgpPNnLOrCWsrHRoXm3TW+6QbXqFMb0cmxpMbrG5JzywhbI4W5ofSInQYO/E13K47/YZsNO/leIWo8zEjXENw3qK6IPG6Ncy5NCFUmpPu0CRsdIaWa0gajUII6wTmF6C3Wlimg1sawfb3MZ1d3BxE/IYITWyMk4wMUs4NZEHU9MPh/XaO3Jrf3v93V9y9rNpLX1WKshQvl/OvflzHxDOfqXrdb4873Ze7vJMUbXopRpTdyxx7O6D3H1intsPjDM+FtEVkuup42IrZ3UjprHao7PaIV7tkm52Ma0U08uwSY7NLTZ3xYBPe8NY69KAi2EQXSjDwFo4t5vgx+1NF98k2C5SxlJKXHnB91G3cnhO9huftEZWQkStiqjXELWqT8UmOabZxmw1MFsbmMYWtrOD6zX9CDabI6RC1SZR4zOE42NGj48/qsfq77SB/l+b7/zCR/z43M8++SxXkJK88fv1rH71ywObf3He6XyJzeIHTJrXXWBR05rK4Wlmb5vjyIk5jh2eYXqmTmUsoqc0mwa2Y0ujmdHaSuisdYk3emTbPbLtGNNOsLG3Mi4rGCB3jWAY1lpciXllONpwD2tE+ZcpuT/9O/Yykg44wpT07CpaIwKFqEaIWgVZqyLqVUSlgnMC080wjRb5+iZmfYN8a8Nnn3o7kPbApP61dAVVn0SPTRJN1NuiUntU1OrvQoe/v5WoR3jfm/LP9mXzF0dB9nzu8Tf8z1MB8vPIzBeJLH5l3uueEFIIFzrUZEg0X2X84BRzB6aYXphgcnaM2lQdahWSICBG0TWCdsfQbWfEzZRkOybbiTHNGNNKMN0UF+fYOMelBpf7OYyeUsgOALV9yzGEvojSuQKVJbwLJbVABgoZaWQlQFQDZC1C1CI/ibZSQVRCnFC4HEwnxTQ65Ovb5KsbmPV1zM4WrrWNS9qej9gZr2BhFVUZQ1fHkNXI6vHJc7Jaf0hUK7+fK/0nzXe95dxfuIXCSODunxwbn567N0S+DmdfbZPsQZcmx3BWOwVO5ciqJBgPqUxUqE3VGJsZozpVJ5wcQ4zXEeM1bFTFVkJMoMmQ5FaQW4fJLGQGmxhskuPS3DPVpwabGRjMYGfAEt9vykIqz+8bKFygIdRYNNZKT2CYWPJ2hmnFmK0O+UYDs76N2dzGbG5id7ZwvRakMZiE/mg2oTQyqqIq46hqFVGppro+dkFVKw+LIPqwMHxoc2LhSX77ld2/yEtjpCD7Ksz3j01N33VSW3u3se5VwroHsfZEnmULzpgIk2PyFDAgDFI7pPKMJ6oaoaMAVYl88BtVoFJBVmuISgXCCFGpIEKNU9rfFnGERXjyxNxiM+ezaL0M28swnQTTjrGtLrbZwbbbuE4b22njOh1c0i2UwFsEhKf/EUojgwgRVJCVGjKqoKpRLKPqig6Cc0LpjxJWH0owz3SS2XN86LW90QIYKciLl8/5pYmxavWgzuxpKeQ9LstuF9Yec3l6LE+zBawZd6bIcqW+4Ojy4jZLPYqYIt1r3QCePmAb2cWyXe6A3MMYJ9wuaIjQAegQoQNkECHDyBf8tAQZtHUUrjmpLsmwetFK9ZwM9ROqGjxLNH5987de3xr9sCMFeWnlK36rNtWR89KxJJw9YI07IMiP2tQs5WmypHDzwplJY8yYy/PQWVsRzgTgtDWIQX2kxE4vdmG3+rP7cCBy68iE0onUOkHKjpO6gZDrUutVFYbLUgdXnBbLGLVsZbTcqE+u/0V3k0YK8hktTvB1H6xM7DSroXBRlptqxZqqRFVyJasmzapSC41xygmUs1IKaa1wGJwwVrtcImN02FVJmsS60g103kudSJqTEz1+5TXxzYc1jmQkIxnJSEYykpGMZCQjGclIRjKSkYxkJCMZyUhGMpKRjGQkIxnJSEYykpGMZCQjGclIRjKSkYxkJCMZyUhGMpKRjGQkIxnJSEYykpGMZCQjGclIRjKSkYxkJCMZyUhGMpKRjGQkIxnJSEYykpGMZCQjGclIRjKSkYxkJCMZyUhGMpKRjGQkIxnJSEYykpGMZCQjGclIRjKSkYxkJCMZyUhGMpKRjGQkIxnJSEYykpGMZCQjGclIRjKSkYxkJCMZyUhGMpKR7JX/H5kVDt1YjOk6AAAAAElFTkSuQmCC'},
    varejao:{name:'Varejão das Tintas',logo:'data:image/png;base64,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'},
    vianney:{name:'Padaria Vianney',logo:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJoAAABVCAYAAACxQf12AAAdiUlEQVR4nO2ddUBUWRuHnwligAEVYQ0Ua1VUwMBa1y5s1gRFRcVYRUwwUETBAhHsxDU+ay3srrV17e6OFVRESYnvj9Gr49AzMKzL8w+cG+e8c+c357znPXFFdqWLJpPHD8PPhRMIixQTESXWtilK5C5r8lCbuy+lNLaOpYLFJ22bokSe0H5ANp8xwKluFL+Ui9O2KQI/rNB0dXURi3/Yj5cmycmwcJ+c8Z3fY22ZO2o2qbYN0ASFLYrRo+8ASv1cDsuSpZGbmKCrq0tycjLvI97x4ulTrl66wJF9uzl/5hTJyT++W/r8jYTLj3Txc4qg+2xTIqO1+6MT/QidgaLFilO/SXNevXxO+OvXxMbEkN/UFIvilvxSvyG/NmiMWCIB4NH9ewRMGs/ZE8e0bHX241w/in5NP7LzvIzpW4y1assPIbT0KFaiJL6Bc6hoW1k4tmz+bBbM9NeeUTmA46/RDLT/QFISOAYV5NU7idZs+U84MU8fPaSfU3uuXb4oHOs90B1n1wFatCr7KV9U4Z+JxdCwUqxWbflPCA0gPj4e7+GDSUpMFI79PtyTnwoX0aJV2UdR00TqVfgqrkrFtdspyHGhyWQG1GnQiEEjR+PQpWuO9gyfPn7EmW98M11dXdp2csyx8nMKQ/1kJjlGIP2mpTQzTtKeQeSQ0AqYFqRdJyeClqzgwPlrzFi4jDfhYWz9cy1JSTn7AC6eO6OUrlqjVo6Wn90UypdIUK93/Fw4Qem4tjva2RbeKGhuTrNW7WjWuh1W1jZCzfX61UtGDeqn5C/lJOFhr5XShYtaaMUOTSMRQ8uqMQxs8QFDPVVVabMjABoWmlgspn7T5rR3cqbGL3VVmsW7t24ypE93wv55pcliM4VYpGzTtz7bvw2xGH4u9Im6FeJoVjmWQvlS/ywXHurmoGWqaERoEomUFg7tcek/CMtSpVXOv3j2hJWLF7Btwzo+fdKuU2peuLBS+vsaLrdhoJeMoV4SpvIkTAySKZw/keJmCZQwT8DK4lOKtdf3xCeIOHxNLwesTR21hdakZRsGjRyNRXFLlXMXz53hz5V/cGjf7lxTc5QsXUYpffv6tRwpVywCS/MEyhRKwNIsAXOTRArKkzA3ScLYIAkdSTJ6Osl8ShShr5OMSKS5sjeflml9ZCDLQitTrjyePpOpUr2m0vHo6Ch2bdnIxtUruX/nNgCt23fi/JlTvHz+TD1r1UQskVCzTj2lY2dO/JVt5RWUJ/GrVRy1y8VhYxmPoX76tY9Uolmv/c0HMcsPG2k0z6yQaaHp6OjQ6/fB9B7kjkTy9fYnDx+wdvlSdoVuJjrqo9I93fv+zoBhHji1asKHyEj1rc4i1WvXwThfPiH9JiyMU38d1WgZYhHUKhtH+1rRVC8Tr9GaKbMkJcOUTSZEx2nRiM9kSmjFLEswedZ8rCrZCMduXr3C8kVzObJvT4qhCpnMgBKlyyAWi+nSsw9L5wSpb3UW6f7dSMDG1StITExI5erMU610PAPtP6iEFrRF0HZjzt3TbifgCxkWWpMWrRk/PRADA0MAzp44xvJF8zh38nia95WvZC30Pus0aKQ1oVWyrULNX782m+8j3rFm2RKN5G2gl8yItpE0tdXuMM8X4hNETN9izP7L+to2RSBdoYlEIgYM86D3QHcArl66wOxpflz6+2yGCqhgbSv8X7iIdmJWUqmUcVNnKB0LnupLdHSU2nmbGScys1cElma5oxa79VyHqZuMefg6d80AS9MaiUSK9/RAWjp0IDIiAv+J49i3Y2um5nN9O2NCR1c71XifQUMoXbackD64Zyc7Nv2pdr6m8iTm9X1Hofza71E/DZew9IARR67ra30UICVSFZqOjg7T5y2mbqOmnDhyCN8xI3gTFpbpAqy+qdHeR7zLmpVqULdRU/q4DRXSt29cw8djaKrXZxSJGPycIrQqsk+JIk7d1mXrWQPO39clKRcK7AspCk0skTBp5hzqNmrK6mWLmT19cpbiYPkLmCrF1549fpRlQ7PCz+Wt8Auag+hz1+/+ndsMdulGbEyM2nl3rB1NRS3MiHgaLuHqE11O3dbj3D3dXNGjzAgpCm3Y2Ak0adGa4CmTWL1scZYzt7WrrpS+ee1KlvPKLGXKlWf+qvUYGCpiSLeuX8W9lzPv3r5RO2+ZbjLdG6jv36VGbLyIsEgx/0RIeBkh4dFrKQ9fS7n7Qsp7LQdes4qK0Np07IJjz96EzJullsgAKtvVUEpf+m7mRHZRvGQp5i5fS778BQA4ceQQYwYPICYmWiP5N7KOxVimGspJSobHYVKev5Hw/K2EF28lRMaIiYoV8TFW8VcsVsTaxKJkDPSS+RgrJikZouJEJCaKeB8tIj7h31FLpUbhohbUbdSUwhYWhL16xe6tm5WFVqxESTwn+HHu1AkWBc9ILZ8MU8Xu66hBdHQU58+cUjvPdMusXpMZC0KEwOzaP5YSPM1Xo0Ng9Sp8Xcb2/I2Eg1f1ufRQl+tPdYiJ/3eLRB1MzcwYMno89m1/E9wVgGat230VmkgkYmJAMImJCfh4DFV7pZBMZkD5ipWE9InDB4mPj1crz/Ro0a493tNnIpVKifr4gcleo9i/cxs2Ve0oYmHBXwf2aySkUan4J/6+p8sfh424+lhHA5b/+6n+y69Mnb0Ak3z5Vc5VsLH9KrQW7dpjXaUai2YF8vrVS7ULtq5aTVh5BLB3+1a180wNHR0d3EeNw9GlDwBXLvyN9wh3nj99wmDPsfToNxCAlYvnM8d/ilplGeonM2+3EbsuyNS2+0ehSYvW+AbN5czxv9jwv+XcuXEdqa4uNlWqMWjkaEzy51cITSKRMnDEKD5ERrImRD2/7AuVq33tCERGRHDy6CGN5Ps9RSyKM3X2AirY2JKYmMDiWTNZvmgeSYmJVKtZWxAZQEy0+j5aVKwoT2TfYN/uN8ZMmsq4oYM4uGen0rmXz54SHx9Hp249FUJr1rotPxUuwpZ1qzXStIByR2D/ru3ZMg+tdYfOjBw/EUMjOTevXsF3zAju3ropnG/YvKXwf8S7t2xZv1rjNvyXadDUHg9vPwZ065xqROHIvj1cvXheIbROzj0BhSA0gUQixbpKNSG9e+tmjeT7BbOfCuE12Z86DRoRFxtL8JRJrF0RouLw37t9k6SkJO7fuY33iMEZDjjry2TUqlufMuWsiIyIYMfmDQA4dHbi0YN7nDx6OMX7fi5vxeOHD4iPU93zooBpQdp2cuT8mVNcvXg+xfsNjeSY/1SIh/fvpni+dt36lKtozZo/lqRYRloY58uHXa1fqPVrfQwMDfEeOUStDpJNVTu8p89kqGuPNMNWycnJhL9+jdSiuCXWVaqRlJjIlQt/Z7ngb7GuUhV9maJ5efnsqcbyFYvFtHfqzqCRozGSyzl++CD+E8fx8tnTFK8PXb+GbRvXZ/iBGsnl9OzvRifnHhgayYXjDZu3QF8mo5JtFR7dT1loDZrZEzB/KXdv3sDZoYVQpkgkok3HLgwZPR5jExNOHDnEUNceKZYfvHQFle1q4DtmJNs2rBOOFzQ3Z6S3L43tWwFw/cqldCczgGKM16FLV1r+1pGKNpWVptbPC5ye6nOTSKTUqluPt2/CuXlVVUSWpUozc/EfzJ7mm+HvVlq3cVMAHty7S1ysZmYf1KxTV/h/z/ZQjex18bNVBcb6TaeSbRXCXv+D35iRKj7BF2yrVafv4GEYyY1x6dA6Q/nXb9KcsX7TKFDQjMj375k+YSw7N2/EzXMMnbv3Eq7b+udalXulUinunl4AvH0TLoisoLk53tNmUrteg6/3b1C9H6CRfUvB3Qh//Y9wvGmrtoyeOEUI1zx+cJ/LGZjQYFHckoAFIZQpV56QebP43bkze05dxEiu+AG9f/tW5Z6fChehXSdHfnN0pqC5OZERETS2q6R0jdzYmMCFyzh74hihKTyL1JBWq1kbUMzr1xQ1vhHa7lD1mk0DQyP6ug+jq4sriESsX/kHC2b6E/XxQ4rXV7StzMLVG5BKpRzZvyfd/MUSCUNHj8eplysAD+/fZUjv7sJs4Ih3X8dnr12+yJrlS1Xy6NC1O8VKlAQQ4o91GzXFxz9IaaLlnm2hHN67W+V+HR0d3DzGCmWcPHoYAwNDRk2aQkuHDsJ1SUlJTPQclm6YqGSZsixas4H8BUw5vHc3i4JnIDcxEUR2/85twRc3zpePxvataN7Ggao1ainFv/Zs36LyrHxnzsXAyIhpE8amacP3iMtaVQQUPUNNYCSXU8m2CqAYckrN30gPkUhEi3bt2XzgGM59+nPn1g1cOrRmxqTxqYpMJjPAd+ZcpFIpsTExzPTzSbMMHR0d/OctFkR2/fIl+nZpL4hMT1+fNh06AxAfF8dEz2EqzbCRXI7r4GEAXDh7mpvXrjBkzHjGT5vBlvVrhOvehocxY9L4FO1o7+RMMcsSACybN4tSP5dlZegu5MYmSutQVy5ewNVLF9L8TAUKmjErZCX5C5jyNjyMyV6eJCcnKwl26dxgAFwGuLH39CW69urLwd07OXZov3DNjSuXCZ4ySSnvgcNHUadBI/x9vDKtF6l5oUIAfPyQ8peXWexq1RHiZ3u2bknn6pQpV6ESHhN8sa1W/XMz5sXmdf9L19dyH+0lfGGLgmekuUbh29kpoJiKPqxvT6UZJt1dBwjrPhcGz+DR/Xsq+fToN1AY6tr651rmr1pPXFwsXewbMXSst3DddB+vFGevGBgY0td9OKCoafT0ZSxZu5k5AVM4cfgg2/5SCO3xg/ssmR2Y5ucXiUT4+AcJNgf6+fA+4h2WpUrTz30EAEvnBHHgc6fv0YN7uPd25u9TJyhR+meGj/MBIPL9e0YP7q8UKWhk35Ke/QdyeO9ujuxLv6X4HumXef9SHc1EuOs0bAwoqvl9OzMXpC1gWpABwzxo19kJkUhE6J9rmRcwlYh3qv7E99hWq07Hbore873bt1i7PCTVa0UiEd7TZgoii42JwWOgq9KAu9zYmG59+gOK5nTtH6qzcfMXMBWCxHGxsQwY5sGebVtYGDyDIkUtsG/jAMCpY0c5tGdXirZ07dNPiKaLxSLcR3kxqKcTt65fZcS4iUiliu8nYNL4dJvMDl27C/7gxXNn2LdjKw2a2jNuagBRHz/gPWIwxw8fFK7/VjCePn5CWYG+3ko/UovilnhPCyQ66iMBE8elaUNqSKOjPmJgaISRXP39s8RiMXUbNgHg3MnjhL/O2JpJXV1dnHq50nugOwaGRty8egV/H68Mr2aXSqV4TZ4upOf4T05zLYDLADfs2/0mpCeP8+TB3TtK1zi5uAo+TYDPOBISVPPrPdAdmcwAUNSQS+cGC73FPm5DEUskfPr0KdUvx9jEhG69+wnphE8J9OnRjrDX/1CoSFHaOzkDiomaZ46nvVqrQEEzBo/yEtKX/j7L/JXrsLK2Zc0fS1i1ZEGq06Oat3HArtYvAJw+fpRdoZuEc7p6ekydsxBDIzkBE8cT9k1HJTNI79y8QWW7GliWLJWlDL7FytoGUzMzIGOxM5FIRGP7VgweNZYiFsV5H/GOyV6ebNuwLlN7cnTq7kLJMmUBhcBTi3OBYtxtwDAPIb1zy0aVJr5AQTO6uSpqs6MH9nLu1AmVfL4VQlJSEh4D+/LXwX2A4jm0+q0jABv+t5ynjx6maEuvge6CmK9fvoSbi5Pgwrh5jEFXT4+EhARmTfVN9xn0HTxUWM+RnJxMrV/rs2/HVka59Utz5ZmhkZxhYycAipp9yrjRSud/H+ZB+YrW3LhymY2rV6RrR2pId27ZSGW7GpQuVx6JRKrWqqB6jZsBimYkpd7Vt1hZ2+AxwQ/rylVJSkxk3YplLJkdSOT795kq09jEBFe3YUJ6YRqzTkQiEWP9pgvxpH9eviDQ11vlut+He2JgYEhycjILgwJSzMcnIBhdPcXq70mjhgsiE4lEjBg3EZFIRExMNH/Mn5OiLRVsbBU9aRT+1+BeXQWRWVeuSvPPzW7o+jXproet26gp7R2dhbTH764cPbA3zXu+0G/IcKFyCJkXrBRbq1K9Jl179yMpMZHJXp5qbcgjDV2/hoSEBMqUK49YLEKd2TT1mzQHFLVAakNZpmZmuI0cQ6v2nRCJRJw+fpSZvj5Z7p326DcIYxMTQDGYnlYAsV7jZpSr8DUu5DtmpMqv3bpyVdp93srqwK7t3Lt9SyWfTs4ufAkLHdm3h51bNgrnmrRsg+3ncd71K5al6F/q6ukxacZsodPkN9ZDsEMkEjF8/ERAsadbyLzgND9/9dp1mDp7gZDX2zfhSn5YWpQoXQbHHr0BxWaFq78Z59aXyRg/LRCxWMz/QhZx5+b1DOWZGlJAIws1SpYpKywASanZ1NXTo2svV3oNdMfAwJCnjx8RNHmiUpc6s+TLX4DOPVyE9P9CFqV5fZeevYX/D+/dreL3FC5qQcCCECGWtGrpQpU8ipUoiftnXyguNpaZk32Ec7p6egz2VMSXEhISUu2QDBo5WtijZFfoJqUVZc3bOgjhoX3bQ9P0cxs0tWeYlzdRUR/R01csrTt+6ECGWyU3jzGCQOfP9FfqZXpO8KOYZQlevXjO4uC0e7sZQWNrsuzbOgDw7u0bTh/7uvpbJBLRvE07Bo4YTeGiFkRHfWT29MmsW75U7YH2zt1dBGc88v17jh1MXbT58hcQaqGEhARmTVP2e/IXMGX+qvVCM3Lt8kWV4RexRIKPf5DwpS6bP1upWXPs2UcILRzYtYO34apjq1Wq18Tpc5P58cMHZk3zE87p6OjgNnKMkF63YlmKn0UkEtGtdz8cunTFrWdX1u3+OjPmcgaHhGyrVRdaoCcPH3Bw9w7hnMsAN9p07ALANO8xGpmZrDGhffEpDuzaLvTQqtaoxdAx3lhZ25CcnMy2DeuYFzg9xS8gs4jFYlp/DqZ+X+73KBapzBN8sz1bN/P86deRELmxMXOWr1ZaSPPtWOMXuvXuh01VOwDu3rzBysXzhXMSiVQQEMD2TetV7jcwMMQnIEioMQP9Jig9i2at2wlbnd69eYPbN1Q3oPkyrCWVSunduR1JiYnofrOM8cnDByk+g+9x/6aHumX9GmGY0GWAG4NGKjoE+3du48QRzUzv0shKh0q2VSharDigGHKyLFWawEXLWLRmI1bWNty8doWev7XCd8xIjYgMFM3ct5vo/X36pMo1evr6uA4exoyFIUozDP7833KlfJas26LkuwFKQgRFkzlg6EgAxSxkz2FKwrapWo2C5uZC+sV39/9sVYHgkJUUsVA8p1PHjqq4LA2btxD+f/bksdI5HR0dHF36sHr7Pi6eO4Nbr25ERkQQGxOTblMpkUhp7+QsdF5sq1UXfjCg8G0NDI0YNzVAEFlkRAQBE1MeycgKGqnRWrXvBCiar9YdOuPQ2QmxREJ8XByLZgWyOmSxRve4ADA1M1dKSyRffzNSqZTmbRzoP2QEt65fo4dDKyrb1aDVbx2Ji43l5tUriMViWjp0UHTtRSKWzgkShpJAMSz0z8sXFDAtSLPW7WjbsYvwRS2bN1vFOS5iUUwp3am7CxtXr6SoRXFate9EvcZNiI5SNEHRUR+Z4uWp8pmKWZYU/q9W6xfsav3Cm7Awqv/yK44ufYh49xY3l67cvXlDuC4hIYGTR49Qt5Eiflm6bDkln69oseJM8A/i3Zs3Qi3dtFVbpXLH+E6jUJGiGBgaCsdmTvbRyIqxL6j9ngGZzIA9py8Iy9q+cOHsafzGeqQaQ1IXPX19Qg+dFGqRqI8fOHHkEPoyGZXtavLi2RPmB07n1F9HAMXg8Y5jZ5HJDDiwewdWlWwoWqw4u0I3MW/GNJKTk9lx7KzKLpVJSUkc3L2D/4UsYtHqjbx49hTnts1V/EubqnaE/BmqYmd8fDyh61fzx4I5tHToyGDPsUz28iT0m3HQL0yfu5hG9i1Vjj+8f5elc4LZv3NbijNhilgUZ9GaDRQqUpR3b98wL2AaHz68p3a9htRv0ozlC+aydvlS4V6/oLmCqwOKfVT2bA9lxDgfDI3knDp2FPde3dJ8/plFbaH95tiNsX5fo/Lx8fHMnubLn6uWZ/urcCyKW9Kj30DKlLdCX1/G2/Awrl+5xLGD+1McVahSvSaOPftgJJdz5+Z1doVuUpqR26x1O9o7OSM3Nub1q1ecP32SvdtDhWh4tZq1efLoYapbozr27E2Tlm3Q09fn5bNnnD15jH07twkD0Hr6+tSu1yDVsULzQoVxH+WFZanSxMbEcOvaVY4e2Juh1wrJjY3p3L0XNX+th5GRnPDwMM6dPM7OzRt4+yZc6dqSZcri6jaE1/+8Ysu61Tx5+ICABUtp0NSemJhoutg30vhedmoJTSQSsWHvEaGr/vD+XbyGDFT68vLI/TRs3gL/eYqx3EBf71R7u+qgVmegXSdHQWTHDu3HpX2bPJH9yzCSy/GcMBlQ7BT156rl2VJOloWWL38Bhn2eVrJn6xZGDuijstNjHrkf91HjKGhuTnx8PL6jR2bbex+yLLS2nRwxMDDk4f27+I7NPgPzyD6qVK/Jb44Kp39B4HQe3ruTzh1ZJ8tCs7JWbC8a4DMu0yty8tA+X8YyQREhWJPCfDtNkmWhxUZHc//O7RSn0OSR+xk0YjTFLEsQHfURH4+h2d4iZTlge/r4X0ileftO/BupUr2mMMEgYOL4HNmWP8tC279zG2Y/FdKkLXnkALp6enhN9kckEnFk/x5hcXR2o3Yc7b/wfvIfiSGjx+HsOoC3b8JxbNFYo8NMaaFWHC1PZP8urCtXpevnNQoTPYflmMjgP/QG4v86unp6TPAPQiwWs2rJgjTXVWQHeUL7jzB0zHgsS5Xm6qULzA+cnv4NGiZPaP8BGtu3opOzCxHv3jLW/fdUJ4hmJ3lC+8GxKG7J+GkzSEpKwmvoIF69eK4VO/KE9gOjq6srLP6dHziNsyeOac2WPKH9wHhM8KN8RWt2b93MikXz078hG8kT2g9Klx69cOjSlasXz+M31iP9G7KZPKH9gNSoU5fhXj48fnCf4f165YpJD3lCywANm7cQNtrL7RQvWYppcxbxJjyMwb2dM7QTU06QJ7QM4OHtq5FNcLKbgubmzApZRULCJ/p37ZjqHrXaIHe9PTQXYlHcElMzc41t+JxdGMnlzF2+FiO5nN+dO/M0h98kmB55QkuHEqXLcPvGtUzvcpST6MtkzApZhZn5T/Tv1jHFjWm0TV7TmQ7GJvl4/CBj2wxoA32ZDP/5SylRqgxD+nTPlSKDvBotXSRSKcnJuXM9hL5MRtCSFViWKp1ra7Iv5AktHaI/fsS0oJm2zVDBSC4naMkKzH4qRH+nDrnOJ/uePKGlw4tnTylXsRJisTjXrPT6qXARgpasQCKR0M+pg0beRpjd5Plo6fD4wX3kcmNq/FI3/YtzgAo2tizfpNh7zbWLw79CZJAntHSJjo7iysXz9HEbom1TcOjsxNL1oRzauxP3Pt3T3AQ5t5EntAxwdP9eKtvVEN6wktMYGsnxC5rLqElTCfT1JmDieI2+ujsnyBNaBtixeQPxcXEMHeOt9H6CnKBOg0as330QmyrVcO3iwKY1q3K0fE2RJ7QMEPHuLetXLkMsFjNpxmz6Dx3JlzfOZBeFLYrhP28JwUtXcv7MKbq2acb1y5eytczsRO390f4ryI2NWb/7kLCW9e6tm8z0m5DilqbqUKhIUZxdB9Cha3fCX/+Dv48Xxw4d0GgZ2iBPaJnApqodi9ZsFN6ZBHD14nk2rVnFXwf3Zdk5F0skVK9dB4fOTjRs3oLEhETWrQghZO4sjb16XNvkCS2TNGnZBt+Zc5TEBooNlC/9fY6zJ47x4O4d7t+9zT8vnqu8KEwkEmFqZkbRYpaUtaqIbTU7atdtgHG+fCQmJrA7dDOLZgVqbW5/dpEntCxgXbkqEwNnC69sTIuEhASio6KIj4tDXyZDZiBT8e8+REaybeM61i0P+eEE9oU8oWURfZmMTs4uOPVyxcz8p0zfHx31kTPHFXvc/nVgb7qvSPy3kyc0NZFIpFS2q06dBo0oa1WREqXLYJIvP/oyGQCfPn3iQ+R7Xj1/zrMnj7h1/RrXLl3g2qULar855t/E/wG6hCp5b56hywAAAABJRU5ErkJggg=='},
    cocobambu:{name:'Coco Bambu',logo:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAABSCAMAAABNNnL1AAAAM1BMVEVHcExEGQ5EGQ5EGQ5EGQ5EGQ5EGQ5EGQ5EGQ5EGQ5EGQ5EGQ5EGQ5EGQ5EGQ5EGQ5EGQ5xA/aMAAAAEHRSTlMAoNAw8BBggMBA4CBQkHCwHcttrgAABfJJREFUeNrtnNmWgyAMQEFFxK38/9dOXToVDSSArdhDHqZnKLLkQgiByhhR9CScZUlDJhrV87Mtsy4SkHaeHhMVxvIkSWN6TCzmP1kuF/kPREyzJButi0UsPHTLNGt0niWJGKwZxCh1JpIMj3UVyUCS4VEwXWYgFwt/85ATHcaqDOTyDciLyLSCDGpKU1k1l0ix5aE7tu4PJwfY8ZRasivUky4crt0yFEZHGcOcozmhm4QGz+6lfgBPyS/yqAwe65rO2ROG3WrV2ydqHDO2cJlKgEwpWIYGJLjBUCmG6UBqfti9JEca3ql55K5fUZ9RtuHoaME+Q+PGQSpjkeO8LnFqUHP2aTVW8xlAnuvF9DECWR+UJQeuAMhhbv37oDJqEhBKSRUYpjBkcBVsqVhGA+nNZnMmtvaUND2AGsAc3G4myWVUNCDas8G1pgq55nCTNbxzmJZHcdBsEXRgycERHpQyBA3Idj7iDe619iXik8HXZIHKeC7Ka3yrcroA2w0lqiZhW2DIJoE09s18RURl9qd8MngBMfJwsXH+LM/iKmgjhtfooWlEk3geEcJjfcqRoY0BsutBo4HKlKcKfNoaUEZPbI2mNpj7AdG0YsOAHMqZ/zr80S5OA3hnHlRFnwFEBUyQ1dVDaz4JCHsHe8EZEjl25oUmtgxFbA6nNXjwBaI/BwQYm8WzH1SjXe/9xaMHeVhUoVoRIAer4jM+9ua/R1QLFDrApuTjQP7T9rsk2/4bXIWYRrO4MzQ7t4AfTSXYgWVLNrqagze4AxaVo68mId06sIYBeacdhxW4RwcKGeAypbWpghGRGd62A4hB5Fg1pBbEpWBoE6kZcCDCBoRRLBbe0gfcEK8yOmdngKCFudhU7soUXLAC0kasE108kAZ+yHyUhQNRZCBNYGfcQCTaYOlRmc+oCgSi7UD+nY/yxkDGGwPZhj2Jofr0gaivAlEnAjHS2lsDeaDuwaeA6POAmGnME0izkVAgg7UMTyBcXwVEnweE7eO8fkDsWehACLY0bGOI7LlPAXLaxlBuw6v/vh37GSDj3YAA6et57m8AYTcE8tw51XSDlYHQgASG36dUYewz8NuKdwLCbgZEllPErDVP+lkGEg8k/AjXy+O9HZDxbiZLzMnah0deQz64qC/JuyjvTwGpbwXkxaM88ujyxjASiAwEIjaBmO21Uf0jQOqrgOhAIPXrC7GLslc3BCKBK3h3imWJ1xsC9OTv7hXyG+H3rwIx4poyPHQyTEdRh29KNtwViLgKiH0o0HfqWjwnA4fsGdN3BcIuAzLGAVndLMmAX2vZeGQgriaWUUD4+lgBwap0dQaQmtyX9heAFBFA1hFZK+C7bm6mDAHS4Fl8rwFV8N0uOxCewhrSGv/1uI+6dla/z0S6ZnGD3R6pdAbR9tecXs40eqwq8YNXTQQiLvOydoog92H7XdsyJGaJXj49JGxvGSzbTefu+bB5UPuE3nbpFQBS6qv2IRztZY2pdz4PmT/aZn5ZAOW34OgGFclSnVBG7dGcbwCBax7wXh5VO52G9K+RPq8cAwKEY4GI2N+HUHMkDcSrD5tlfdkRLodUmlGivbG/ftLEMiQyyYLC7wkBkfC13la/4yTU95pwvJYoZOQcCQORXn14nZ7/t0cgEV7yFMGzFCeUUXrN10uArA/0dB6QNWaxRMyzyDB14zOxohrQ8jIg+2GPGyws+h1EhJnXJYJW4+1vgwrK4MJ4XAEEbd7uDbwKP44IIXI8r3dnQfxZG1Wq/SSGFs4Hgs/g/etee3hAeklFt4qH9QPc9BPLkETz2bCrgOwbOBB3IDxmghw1AeVQaBbzjQ+d5WKMESAiAZH04NvJQBjay+P34xJ1jwWyif7bXwf3cCnbgGZ/sXnrNK8HlTyEVzT0PCDNiI/eAsnBsqQiGUiKPKqsiKR45AmSivAMJMkJ0mVNJMUjT5DEeGQgmUcW18426yLzyLKT1hmny/JdUYRLV1m+KUvoVcUdhGT5zCqS9ZB5ZMk8kheZeaS4B8maSMrvzXpIRP4AGVfzhngE38AAAAAASUVORK5CYII='},
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
      var name = summaryText(job.empresa || displayName || company.textContent || 'Empresa');
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
      if (isDemo(job)) {
        var rating = browserNode('span', 'em-company-demo-rating');
        rating.setAttribute('aria-label', 'Nota ilustrativa de demonstração: 4,1 de 5. Não representa avaliações reais.');
        rating.title = 'Avaliação ilustrativa de demonstração. Não representa avaliações reais da empresa.';
        rating.innerHTML = '<span class="em-company-rating-value">4,1</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1Z"/></svg>';
        company.replaceChildren(link, rating);
      }
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
        var pointer = card.querySelector('.em-r4-selection-pointer');
        if (!pointer) { pointer = browserNode('span', 'em-r4-selection-pointer'); pointer.setAttribute('aria-hidden', 'true'); card.appendChild(pointer); }
        pointer.hidden = !active;
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
      var jobId = browserNode('p', 'em-jb-job-id', 'ID da vaga: ' + String(job.id || ''));
      jobId.title = jobId.textContent;
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
        if (win.EmpregaMaisCandidaturaV94 && typeof win.EmpregaMaisCandidaturaV94.abrir === 'function') win.EmpregaMaisCandidaturaV94.abrir(job);
        else if (typeof win.abrirContatoExternoVaga === 'function') win.abrirContatoExternoVaga(job);
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
      var selectionLabel = browserNode('span', 'em-jb-selection-label');
      selectionLabel.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg><span>VAGA SELECIONADA</span>';
      topMeta.appendChild(selectionLabel);
      var publicationFact = headerMeta.querySelector('.em-jb-header-published');
      if (publicationFact) {
        publicationFact.className = 'em-jb-footer-published';
        publicationFact.remove();
      }
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
      var footerMeta = browserNode('div', 'em-jb-footer-meta');
      footerMeta.appendChild(jobId);
      if (publicationFact) footerMeta.appendChild(publicationFact);
      footer.appendChild(footerMeta);
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
        var publicName = (company.querySelector('.em-company-name') || company.querySelector('span')); publicName = job.empresa || (publicName ? publicName.textContent : company.textContent);
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
      if (!confidential && (highlighted || urgent)) identity.appendChild(logo);
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
        var publicCompany = (company.querySelector('.em-company-name') || company.querySelector('span'));
        openJobSummary(job, {
          title:title.textContent,
          company:confidential ? 'Empresa confidencial' : (job.empresa || (publicCompany ? publicCompany.textContent : company.textContent)),
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
      var excerptStyles = {'display':'-webkit-box','-webkit-box-orient':'vertical','-webkit-line-clamp':'2','line-clamp':'2','overflow':'hidden','max-height':'44px','margin':'0','padding':'0','font-size':'15px','font-weight':'400','line-height':'22px','color':'#52657b','grid-column':'1 / -1','width':'100%','min-width':'0','overflow-wrap':'anywhere'};
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
      var publicCompany = (company.querySelector('.em-company-name') || company.querySelector('span'));
      card.__emJobEntry = {job:job, apply:apply, save:save, openState:openState, titleButton:titleButton, company:company, highlighted:highlighted, confidential:confidential,
        info:{title:title.textContent, company:confidential ? 'Empresa confidencial' : summaryText(publicName || (job.empresa || (publicCompany ? publicCompany.textContent : company.textContent))), location:city+(uf.length===2?' – '+uf.toUpperCase():''), salary:salaryValue, date:date.textContent}};
      card.onclick = function (event) {
        if (event.target && event.target.closest && event.target.closest('button,a,input,select,textarea,label,.em-r4-company,.em-r4-similar')) return;
        showDetails(event);
      };
      return card;
    }
    var makeCard = win.criarCardVaga;
    if (typeof makeCard === 'function') win.criarCardVaga = function (job, featured) {
      var card = makeCard.apply(this, arguments);
      if (card) {
        var confidentialLogo = typeof win.vagaEhConfidencialEM === 'function' ? win.vagaEhConfidencialEM(job) : enabled(job.confidencial);
        var promotedLogo = enabled(job.destaque) || enabled(job.emDestaque) || enabled(job.destacada) || enabled(job.urgente) || enabled(job.contratacaoUrgente);
        card.setAttribute('data-em-show-logo', String(!confidentialLogo && promotedLogo));
        if (confidentialLogo || !promotedLogo) card.querySelectorAll('.dz-logo,.em-lista-logo').forEach(function(logo){logo.remove();});
      }

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
      if (button && button.closest('#emJobPanel') && button.classList.contains('em-jb-apply')) {
        event.preventDefault(); event.stopImmediatePropagation();
        if (typeof button.onclick === 'function') button.onclick();
        return;
      }
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


