# Estabilização do +Empregos — 4 de outubro de 2026

Trabalho realizado diretamente na `main`, mantendo GitHub Pages, Supabase e os registros existentes. Nenhuma vaga, empresa ou candidato foi removido.

## Versões publicadas

1. `532a62f`: corrigiu erro de inicialização em perfil da empresa e sintaxe de Minhas Vagas; removeu reescrita de respostas pelo service worker.
2. `e384264`: restaurou acesso/cadastro da empresa e cadastro do candidato, com autenticação real, renovação de sessão, recuperação de senha e logout remoto; incluiu validação no deploy.
3. `3c0ab78`: consolidou catálogo público, paginação de consultas ao Supabase, busca sem acentos, ordenação por data e URLs de vagas; extraiu 235 blocos CSS do HTML preservando a ordem. HTML reduzido em aproximadamente 80%.

## Persistência e segurança

- Perfis e candidaturas continuam no Supabase. Tokens de acesso são verificados no servidor; um papel no navegador não basta para acessar páginas privadas.
- Nenhuma senha é salva nos novos cadastros ou logins. Os campos de senha dos caches antigos são removidos sem apagar os perfis.
- Campos administrativos de empresa/candidato e aprovação de vagas são protegidos por triggers e RLS.
- Leitura pública de empresas é limitada aos campos usados no diretório público; e-mail privado e configuração operacional ficam indisponíveis para visitantes.
- Candidaturas começam em avaliação, exigem vaga disponível e empresa correta; índice impede duplicidade por vaga/usuário.
- Mensagens, perguntas/respostas da candidatura, dados complementares de publicação, solicitações de planos e histórico administrativo têm persistência real.
- Limites e créditos de publicação são validados no banco, com bloqueio de concorrência por empresa.
- Mudanças de plano por cortesia administrativa geram registro em assinaturas e histórico. Solicitar plano não ativa assinatura.

## Validação executada

- Sintaxe dos JS externos e inline, IDs únicos, referências de arquivos e telas obrigatórias.
- 11 testes: acesso sem sessão, renovação concorrente, falha de rede, logout, catálogo paginado/cache, busca/contrato/coordenadas, catálogo da empresa, mensagem sem confirmação, destinos de candidatura e plano expirado.
- Testes SQL com rollback: rejeição de alteração de plano pela empresa, moderação por empregador, Premium pelo candidato e créditos pela própria empresa.
- Permissões verificadas: visitante pode ler nome público, não pode ler e-mail privado ou a tabela completa de empresas.
- Contagem preservada após migrações: 940 vagas, 3 empresas, 1 candidato, 0 candidaturas existentes.
- Versões 1–3 publicadas pelo Actions com sucesso. Navegador confirmou Home, busca por “sao paulo”, acesso da empresa e acesso direto à página da vaga. Verificações adicionais continuam a cada publicação.

## Pontos que ainda exigem conclusão ou verificação

- Checkout existente não tinha provedor de pagamento conectado. Solicitações agora são reais e persistidas, mas cobrança automática ainda depende de configurar um provedor e webhook; a interface informa isso.
- Fluxos autenticados completos precisam ser verificados com sessões autorizadas de candidato, empresa e administrador. Não foi criada conta fictícia nem candidatura de teste em produção.
- Há 3 vagas antigas cuja referência à empresa não coincide com o usuário responsável. Os registros foram preservados; uma revisão administrativa de propriedade é necessária antes de alterar seus vínculos.
- Denúncias e solicitações de extras têm persistência no Supabase; caches históricos de extras locais são arquivados sem ativação automática.
- A extração de CSS preserva regras históricas; a remoção das regras conflitantes deve continuar com verificação visual por página, especialmente em mobile.

## Comandos de validação

```sh
python3 scripts/validate_portal.py
node --test tests/*.test.cjs
python3 scripts/build_pages.py
```

O deploy valida antes de publicar e monta um artefato público separado, sem incluir testes, migrações ou arquivos de manutenção.

## Autenticação por CNPJ e recuperação

Funções existentes atualizadas no Supabase, versão 2: consulta por CNPJ exige senha e retorna somente sessão autenticada; recuperação usa o e-mail registrado em Auth, sem alterar usuário ou confirmar e-mail, com retorno fixo ao portal. Frontend integrado ao novo contrato. Redirecionamento de confirmação/recuperação enviado em query `redirect_to`, conforme cliente oficial. Validação de entrega de e-mail e acesso autenticado ainda depende de conta real e configuração de URLs do Auth.
## Continuação — denúncias

- Denúncias passam a ser gravadas no Supabase, inclusive para visitantes. Somente administradores podem lê-las e resolvê-las; campos de status não podem ser definidos por quem envia.
- Suspensão da vaga, resolução da denúncia e histórico administrativo são atômicos.
- Dados de teste são revertidos com rollback; 940 vagas, 3 empresas e 1 candidato preservados.
- O envio mantém o formulário em caso de erro e só confirma após resposta do servidor; envios concorrentes são bloqueados.
- Checkout automático permanece pendente de provedor e webhook.

## Continuação — destaque e urgência

- Solicitações de extras têm RLS por empresa; visitante não pode ler pedidos, e empresas não podem definir preço ou ativar recursos.
- Publicação e pedidos opcionais são gravados na mesma transação por trigger interno. Valores preservados: destaque R$ 19,90 por 7 dias e urgência R$ 9,90.
- Índice impede pedidos pendentes duplicados. Ativação/cancelamento administrativo, flags da vaga e histórico são atômicos. A ativação requer vaga aprovada e dentro do prazo.
- Minhas Vagas oferece solicitação e acompanhamento reais. Pedidos antigos apenas no navegador são arquivados para referência. Nenhum é tratado como pagamento confirmado.
- 18 testes de frontend passaram. SQL com rollback verificou preço/duração, bloqueio de autoativação, duplicidade, geração de dois pedidos por publicação, ativação com histórico e cancelamento.
- Depois dos testes: 940 vagas, 3 empresas, 1 candidato e nenhum pedido fictício persistido. Cobrança online continua dependendo de configuração de provedor/webhook.

## Continuação — Minhas Vagas e encerramento

- A página aguarda o catálogo real da empresa antes de renderizar, inclusive em acesso direto. Falhas de rede não apresentam cache antigo como atualização confirmada.
- Cabeçalho identifica Minhas Vagas; as ações são editar, encerrar e visualizar o anúncio ativo. A gestão de candidaturas permanece em Candidaturas.
- Encerramento só modifica o cache ou anuncia sucesso quando o Supabase devolve a vaga encerrada. A lista é atualizada após a confirmação.
- 21 testes passaram; sintaxe, referências de arquivos e artefato público validados. Verificação visual integral das áreas privadas continua dependendo de uma sessão autorizada no navegador.
