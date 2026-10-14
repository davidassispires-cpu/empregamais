create table if not exists public.candidato_dados_privados (
 user_id uuid primary key references auth.users(id) on delete cascade,
 nome_social text not null default '' check (char_length(nome_social)<=120),
 data_nascimento date check (data_nascimento<=current_date and data_nascimento>=date '1900-01-01'),
 identidade_genero text not null default '' check (identidade_genero in ('','Mulher cisgênero','Homem cisgênero','Mulher transgênero','Homem transgênero','Não binário','Outra','Prefiro não responder')),
 orientacao_sexual text not null default '' check (orientacao_sexual in ('','Assexual','Bissexual','Heterossexual','Homossexual','Pansexual','Outra','Prefiro não responder')),
 cor_raca text not null default '' check (cor_raca in ('','Branca','Preta','Parda','Amarela','Indígena','Prefiro não responder')),
 consentimento_em timestamptz,
 consentimento_versao text,
 atualizado_em timestamptz not null default now(),
 check ((identidade_genero='' and orientacao_sexual='' and cor_raca='') or (consentimento_em is not null and consentimento_versao='perfil-diversidade-v1'))
);
alter table public.candidato_dados_privados enable row level security;
revoke all on public.candidato_dados_privados from anon;
grant select,insert,update,delete on public.candidato_dados_privados to authenticated;
create policy candidato_le_dados_privados on public.candidato_dados_privados for select to authenticated using ((select auth.uid())=user_id);
create policy candidato_insere_dados_privados on public.candidato_dados_privados for insert to authenticated with check ((select auth.uid())=user_id);
create policy candidato_atualiza_dados_privados on public.candidato_dados_privados for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
create policy candidato_exclui_dados_privados on public.candidato_dados_privados for delete to authenticated using ((select auth.uid())=user_id);
notify pgrst,'reload schema';