-- Persist previously local publication fields, application answers and messages.
alter table public.vagas add column if not exists dados_publicacao jsonb not null default '{}'::jsonb;
alter table public.candidaturas add column if not exists mensagem text not null default '';
alter table public.candidaturas add column if not exists respostas_eliminatorias jsonb not null default '[]'::jsonb;
alter table public.candidaturas add column if not exists triagem_eliminatoria text not null default 'sem_perguntas';
create table public.mensagens_candidaturas (
 id uuid primary key default gen_random_uuid(),
 candidatura_id text not null references public.candidaturas(id),
 remetente_user_id uuid not null default auth.uid() references auth.users(id),
 autor text not null check(autor in ('empresa','candidato')),
 texto text not null check(length(btrim(texto)) between 1 and 4000),
 criado_em timestamptz not null default now()
);
alter table public.mensagens_candidaturas enable row level security;
grant select,insert on public.mensagens_candidaturas to authenticated;
create policy mensagens_participantes_leem on public.mensagens_candidaturas for select to authenticated using(exists(
 select 1 from public.candidaturas c where c.id=candidatura_id and (
 c.candidato_user_id=auth.uid() or c.empresa_user_id=auth.uid() or exists(select 1 from public.empresas e where e.user_id=c.empresa_user_id and private.usuario_pertence_empresa(e.id))
 )));
create policy mensagens_participantes_enviam on public.mensagens_candidaturas for insert to authenticated with check(
 remetente_user_id=auth.uid() and criado_em between now()-interval '1 minute' and now()+interval '1 minute' and exists(
 select 1 from public.candidaturas c where c.id=candidatura_id and (
 (autor='candidato' and c.candidato_user_id=auth.uid()) or
 (autor='empresa' and c.criado_em<=now()-interval '10 minutes' and (c.empresa_user_id=auth.uid() or exists(select 1 from public.empresas e where e.user_id=c.empresa_user_id and private.usuario_pertence_empresa(e.id))))
 )));
create index mensagens_candidaturas_conversa_data on public.mensagens_candidaturas(candidatura_id,criado_em);
create policy admin_visualiza_candidaturas on public.candidaturas for select to authenticated using(public.is_admin());
-- Company paid/free selections become real requests, never client-granted entitlements.
create table public.solicitacoes_planos (
 id uuid primary key default gen_random_uuid(),user_id uuid not null default auth.uid() references auth.users(id),
 empresa_id uuid references public.empresas(id),tipo text not null check(tipo in ('empresa','candidato')),
 plano text not null,valor numeric(10,2) not null check(valor>=0),
 forma_pagamento text not null check(forma_pagamento in ('pix','cartao')),
 status text not null default 'aguardando_atendimento' check(status in ('aguardando_atendimento','cancelado','concluido')),
 criado_em timestamptz not null default now(),atualizado_em timestamptz not null default now()
);
alter table public.solicitacoes_planos enable row level security;
grant select on public.solicitacoes_planos to authenticated;
create policy solicitacao_plano_leitura on public.solicitacoes_planos for select to authenticated using(user_id=auth.uid() or public.is_admin());
create or replace function public.solicitar_plano(p_tipo text,p_plano text,p_forma text default 'pix')
returns public.solicitacoes_planos language plpgsql security definer set search_path='' as $$
declare owner_id uuid:=auth.uid(); company_id uuid; amount numeric; result public.solicitacoes_planos;
begin
 if owner_id is null then raise exception 'Autenticação necessária.' using errcode='42501'; end if;
 if p_forma not in ('pix','cartao') then raise exception 'Forma de pagamento inválida.'; end if;
 if p_tipo='empresa' then
  select id into company_id from public.empresas where user_id=owner_id limit 1;
  if company_id is null then raise exception 'Apenas o responsável da empresa pode solicitar um plano.' using errcode='42501'; end if;
  amount:=case p_plano when 'mensal' then 49.90 when 'trimestral' then 99 when 'semestral' then 179.90 when 'anual' then 329 else null end;
 elsif p_tipo='candidato' then
  if not exists(select 1 from public.candidatos where user_id=owner_id) then raise exception 'Perfil de candidato necessário.' using errcode='42501'; end if;
  amount:=case p_plano when 'mensal' then 29.90 when 'trimestral' then 79.90 when 'semestral' then 149.90 else null end;
 else raise exception 'Tipo de plano inválido.'; end if;
 if amount is null then raise exception 'Plano inválido.'; end if;
 perform pg_advisory_xact_lock(hashtextextended(owner_id::text||p_tipo,0));
 select * into result from public.solicitacoes_planos where user_id=owner_id and tipo=p_tipo and plano=p_plano and status='aguardando_atendimento' order by criado_em desc limit 1;
 if result.id is not null then return result; end if;
 if p_tipo='empresa' and p_forma='pix' then amount:=round(amount*.94,2); end if;
 insert into public.solicitacoes_planos(user_id,empresa_id,tipo,plano,valor,forma_pagamento) values(owner_id,company_id,p_tipo,p_plano,amount,p_forma) returning * into result;
 return result;
end $$;
revoke all on function public.solicitar_plano(text,text,text) from public,anon;
grant execute on function public.solicitar_plano(text,text,text) to authenticated;

create or replace function private.proteger_integridade_portal()
returns trigger language plpgsql set search_path = '' as $$
declare
  old_data jsonb; new_data jsonb := to_jsonb(new); key text;
  protected_keys text[];
begin
  -- Trusted maintenance/service and guarded SECURITY DEFINER RPCs are unaffected.
  if current_user not in ('anon','authenticated') then return new; end if;
  if public.is_admin() then return new; end if;
  if tg_op = 'UPDATE' then old_data := to_jsonb(old); end if;
  if tg_table_name = 'empresas' then
    if tg_op = 'INSERT' then
      if coalesce(new.plano,'basico') <> 'basico' or coalesce(new.plano_id,'basico') <> 'basico'
         or new.verificada or new.plano_liberado_admin or new.plano_sem_cobranca
         or new.publicacao_automatica_liberada or new.cnpj_validado_automaticamente then
        raise exception 'Benefícios e verificação exigem autorização administrativa.' using errcode='42501';
      end if;
    else
      protected_keys := array['id','user_id','plano','plano_id','plano_nome','plano_inicio','plano_valido_ate','plano_liberado_admin','plano_sem_cobranca','plano_liberado_em','verificacao_analisada_em','aprovacao_automatica_suspensa','situacao_cnpj','cnpj_validado_automaticamente','cnpj_validado_em','publicacao_automatica_liberada','publicacao_automatica_motivo'];
      if new.verificada and not old.verificada then raise exception 'Verificação exige análise administrativa.' using errcode='42501'; end if;
      if new.verificacao_status is distinct from old.verificacao_status and new.verificacao_status not in ('nao_verificada','em_analise','pendente') then raise exception 'Status de verificação não autorizado.' using errcode='42501'; end if;
    end if;
  elsif tg_table_name = 'candidatos' then
    if tg_op = 'INSERT' then
      if new.premium or new.premium_cortesia_admin or new.premium_ativado_em is not null or new.premium_valido_ate is not null then raise exception 'Premium exige autorização administrativa.' using errcode='42501'; end if;
    else protected_keys:=array['id','user_id','premium','premium_cortesia_admin','premium_ativado_em','premium_valido_ate']; end if;
  elsif tg_table_name = 'vagas' then
    if tg_op = 'UPDATE' then
      protected_keys:=array['id','user_id','empresa_id','criado_em'];
      if new.status is distinct from old.status and new.status not in ('pendente','encerrada') then raise exception 'Aprovação da vaga exige análise administrativa.' using errcode='42501'; end if;
    end if;
    if not exists(select 1 from public.empresas e where e.id=new.empresa_id and e.user_id=new.user_id) then raise exception 'Empresa responsável inválida.' using errcode='42501'; end if;
  elsif tg_table_name = 'candidaturas' then
    if tg_op = 'INSERT' then
      if new.status <> 'Em avaliação' or new.entrevista is not null or new.contratado_em is not null then raise exception 'Uma candidatura deve iniciar em avaliação.' using errcode='42501'; end if;
      if not exists(select 1 from public.vagas v where v.id::text=new.vaga_id and v.user_id=new.empresa_user_id and v.status='aprovada' and (v.data_encerramento is null or v.data_encerramento>=current_date)) then raise exception 'Vaga indisponível ou empresa responsável inválida.' using errcode='42501'; end if;
      new.criado_em := now(); new.atualizado_em := now();
    else protected_keys:=array['id','vaga_id','candidato_user_id','empresa_user_id','candidato_nome','candidato_email','candidato_telefone','curriculo','perfil_profissional','curriculo_origem','mensagem','respostas_eliminatorias','triagem_eliminatoria','criado_em']; end if;
  end if;
  foreach key in array coalesce(protected_keys,array[]::text[]) loop
    if new_data->key is distinct from old_data->key then raise exception 'Campo protegido: %',key using errcode='42501'; end if;
  end loop;
  return new;
end $$;
