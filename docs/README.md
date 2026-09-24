# EmpregaMais — Documentação do Projeto

Este diretório é o ponto de partida para manutenção e recuperação do EmpregaMais.

## Fontes oficiais
- Código: repositório GitHub `davidassispires-cpu/empregamais`
- Branch publicada: `reconstrucao-limpa`
- Aplicação principal: `novo/`
- Banco/autenticação/storage: projeto Supabase `empregamais`

## Antes de qualquer alteração
1. Ler `docs/ARQUITETURA.md`.
2. Verificar a versão atual do arquivo no GitHub antes de editar.
3. Para mudanças estruturais no banco, criar/aplicar migration SQL.
4. Nunca gravar senhas, service_role, tokens privados ou credenciais neste repositório.
5. Testar mudanças sem apagar dados de produção.

## Recuperação
Leia `docs/RECUPERACAO-E-BACKUP.md`.

## Histórico do banco
Migrations e scripts SQL versionados no repositório são parte da documentação do banco. Eles não substituem backup dos dados.
