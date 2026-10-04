# Recuperação e Backup — EmpregaMais

## O que precisa existir fora do ChatGPT
O projeto não depende do histórico de uma conversa para existir.

### 1. Código
Fonte oficial: GitHub.
Mantenha acesso ao e-mail/2FA da conta GitHub e uma cópia local periódica do repositório.

### 2. Banco e arquivos
Fonte oficial: Supabase.
Dados de produção devem possuir backup independente. Código e migrations não substituem os registros reais do banco nem arquivos do Storage.

### 3. Credenciais
Guardar em um gerenciador de senhas:
- acesso à conta GitHub;
- acesso à conta Supabase;
- e-mail administrativo;
- segredos/chaves privadas usados pelo backend;
- dados do domínio/hospedagem, quando aplicável.

Não guardar credenciais em README, documentos públicos, commits ou capturas de tela.

## Rotina recomendada
- Após mudanças importantes: confirmar commit no GitHub.
- Mudança de schema: manter migration SQL versionada.
- Semanalmente enquanto o projeto estiver em desenvolvimento ativo: gerar/verificar backup dos dados.
- Antes de alteração grande no banco: fazer backup adicional.
- Periodicamente: testar se a cópia realmente pode ser restaurada.

## Cópia local do código
No GitHub, também é possível obter uma cópia do repositório para armazenamento local. Guarde uma cópia em local separado do computador principal, como armazenamento em nuvem pessoal ou disco externo.

## Se perder este chat
Em uma nova conversa, informe:
"Projeto EmpregaMais. Código no GitHub davidassispires-cpu/empregamais, branch reconstrucao-limpa. Banco no Supabase, projeto empregamais. Leia a pasta docs antes de alterar qualquer coisa."

Nunca envie senhas ou chaves privadas na mensagem.
