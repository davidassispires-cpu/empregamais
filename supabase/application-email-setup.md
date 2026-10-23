# Avisos de novas candidaturas
## Estado atual
- Fila privada criada no Supabase, ligada por trigger AFTER INSERT à tabela candidaturas.
- Envio desativado: eventos novos ficam em blocked_setup, sem disparos.
- Nenhuma candidatura antiga foi adicionada à fila.
- Currículo continua na candidatura; a fila armazena somente referências.
- Template de texto/HTML em application-email-template.mjs, com acesso pelo painel autenticado.
## Ativação futura
1. Definir domínio e remetente e verificar DNS no serviço de entrega escolhido.
2. Implementar e publicar o worker do provedor: ainda não há worker nem credenciais.
3. Resolver destinatário no servidor a partir de vagas.candidatura_email (quando aplicável) ou empresas.email_candidaturas, usando somente a empresa proprietária da vaga; validar destinatário e tratar ausência como skipped. Não aceitar destinatário enviado pelo navegador.
4. Consultar candidatura/vaga/empresa no servidor e renderizar o template. Não anexar currículo nem expor URL pública de arquivo neste fluxo.
5. Consumir eventos pending com bloqueio e lease, chave idempotente por evento, tentativas limitadas, status sent somente após aceite do provedor. Falha de entrega não deve desfazer candidatura.
6. Validar login/abertura do painel e envio em ambiente de teste.
7. Só então definir enabled=true e activated_at=now(). Não liberar automaticamente eventos antigos blocked_setup.
8. Registrar respostas de entrega e bounces; respeitar cancelamentos e preferências antes de enviar.
## Validação
Teste transacional em tests/application-email-queue.sql: insere candidatura de teste e reverte tudo, verifica um único evento bloqueado e ausência de acesso anon/authenticated.
O teste não envia e-mail e não valida entrega externa. Fluxo completo navegador → candidatura → painel ainda precisa de teste com contas de candidato e empresa.
