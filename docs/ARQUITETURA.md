# Arquitetura — EmpregaMais

## Frontend
Aplicação principal em `novo/`.
- `novo/index.html`: página principal.
- `novo/assets/js/app.js`: lógica principal.
- `novo/assets/css/app.css`: estilos principais.

O projeto possui código legado/acumulado. Antes de adicionar novos overrides, procurar implementações existentes para evitar duplicidade.

## Banco
Supabase/PostgreSQL, projeto `empregamais`.

Tabelas públicas identificadas em 24/09/2026:
- empresas
- verificacoes_empresas
- admins
- assinaturas_empresas
- vagas
- candidaturas
- candidatos

RLS está habilitado nessas tabelas. Alterações de políticas devem ser revisadas antes de aplicação.

## Vagas e localização
A tabela `public.vagas` possui `cep`, `cidade`, `estado`, `latitude` e `longitude`.
Latitude/longitude foram adicionadas para cálculo de distância entre candidato e vaga.

## Regra de segurança
Chaves administrativas, senhas e tokens nunca devem ser commitados. O frontend deve usar somente credenciais próprias para exposição pública e respeitar RLS.
