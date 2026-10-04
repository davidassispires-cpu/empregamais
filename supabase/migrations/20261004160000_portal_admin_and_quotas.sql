alter table public.empresas add column if not exists recursos_admin jsonb not null default '{}'::jsonb;
alter table public.empresas add column if not exists suspensa_admin boolean not null default false;
create policy admin_atualiza_empresas on public.empresas for update to authenticated using(public.is_admin()) with check(public.is_admin());
alter policy admin_atualiza_todas_vagas on public.vagas using(public.is_admin()) with check(public.is_admin());
alter policy admin_visualiza_todas_vagas on public.vagas using(public.is_admin());
alter policy admin_atualiza_candidatos on public.candidatos using(public.is_admin()) with check(public.is_admin());
alter policy admin_visualiza_candidatos on public.candidatos using(public.is_admin());
create table public.historico_administrativo(
 id uuid primary key default gen_random_uuid(),admin_user_id uuid not null default auth.uid() references auth.users(id),
 acao text not null check(length(acao) between 1 and 200),detalhe text not null default '' check(length(detalhe)<=4000),criado_em timestamptz not null default now()
);
alter table public.historico_administrativo enable row level security;
grant select,insert on public.historico_administrativo to authenticated;
create policy auditoria_admin_leitura on public.historico_administrativo for select to authenticated using(public.is_admin());
create policy auditoria_admin_registro on public.historico_administrativo for insert to authenticated with check(public.is_admin() and admin_user_id=auth.uid());
create or replace function public.admin_conceder_plano_portal(p_empresa_id uuid,p_plano text,p_dias integer default 30)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.is_admin() then raise exception 'Acesso administrativo necessário.' using errcode='42501'; end if;
 if p_plano not in ('basico','mensal','trimestral','semestral','anual') or p_dias not between 1 and 730 then raise exception 'Plano ou duração inválidos.'; end if;
 perform 1 from public.empresas where id=p_empresa_id for update;
 if not found then raise exception 'Empresa não encontrada.'; end if;
 update public.assinaturas_empresas set status='cancelada',atualizado_em=now() where empresa_id=p_empresa_id and status='ativa';
 if p_plano<>'basico' then
  insert into public.assinaturas_empresas(empresa_id,plano_id,valor_pago,status,inicio_em,termina_em,origem)
  values(p_empresa_id,p_plano,0,'ativa',now(),now()+make_interval(days=>p_dias),'cortesia_admin');
 end if;
 update public.empresas set plano=p_plano,plano_id=p_plano,plano_nome=case p_plano when 'basico' then 'Grátis' when 'mensal' then 'Mensal' when 'trimestral' then 'Trimestral' when 'semestral' then 'Semestral' else 'Anual' end,
 plano_inicio=now(),plano_valido_ate=now()+make_interval(days=>p_dias),plano_liberado_admin=p_plano<>'basico',plano_sem_cobranca=p_plano<>'basico',plano_liberado_em=case when p_plano<>'basico' then now() else null end where id=p_empresa_id;
 insert into public.historico_administrativo(acao,detalhe) values('Plano concedido',p_empresa_id::text||' · '||p_plano||' · '||p_dias::text||' dias');
end $$;
revoke all on function public.admin_conceder_plano_portal(uuid,text,integer) from public,anon;
grant execute on function public.admin_conceder_plano_portal(uuid,text,integer) to authenticated;
create or replace function private.proteger_cotas_publicacao()
returns trigger language plpgsql security definer set search_path='' as $$
declare e public.empresas; plan text; start_date timestamptz; limit_jobs integer; limit_feature integer; used integer; feature text;
begin
 if auth.uid() is null or public.is_admin() then return new; end if;
 select * into e from public.empresas where id=new.empresa_id for update;
 if e.id is null or not (e.user_id=auth.uid() or private.usuario_pertence_empresa(e.id)) or e.suspensa_admin then raise exception 'Publicação indisponível para esta empresa.' using errcode='42501'; end if;
 plan:=case when e.plano_valido_ate>now() then coalesce(e.plano_id,e.plano,'basico') else 'basico' end;
 start_date:=case when plan='basico' then date_trunc('month',now()) else coalesce(e.plano_inicio,date_trunc('month',now())) end;
 limit_jobs:=case plan when 'mensal' then 6 when 'trimestral' then 12 when 'semestral' then 25 when 'anual' then 60 else 3 end+coalesce((e.recursos_admin->>'vagas')::integer,0);
 if tg_op='INSERT' then
  select count(*) into used from public.vagas where empresa_id=e.id and criado_em>=start_date;
  if used>=limit_jobs then raise exception 'Limite de publicações do plano atingido.' using errcode='42501'; end if;
  new.criado_em:=now();
 end if;
 foreach feature in array array['destaque','urgente','confidencial'] loop
  if coalesce((to_jsonb(new)->>feature)::boolean,false) and (tg_op='INSERT' or not coalesce((to_jsonb(old)->>feature)::boolean,false)) then
   limit_feature:=case when feature='confidencial' then case plan when 'trimestral' then 2 when 'semestral' then 4 when 'anual' then 8 else 0 end else case plan when 'mensal' then 1 when 'trimestral' then 3 when 'semestral' then 5 when 'anual' then 10 else 0 end end;
   limit_feature:=limit_feature+coalesce((e.recursos_admin->>case feature when 'destaque' then 'destaques' when 'urgente' then 'urgentes' else 'confidenciais' end)::integer,0);
   select count(*) into used from public.vagas v where empresa_id=e.id and criado_em>=start_date and coalesce((to_jsonb(v)->>feature)::boolean,false) and v.id<>new.id;
   if used>=limit_feature then raise exception 'Recurso fora do saldo do plano: %',feature using errcode='42501'; end if;
  end if;
 end loop;
 return new;
end $$;
revoke all on function private.proteger_cotas_publicacao() from public;
create trigger portal_cotas_publicacao before insert or update on public.vagas for each row execute function private.proteger_cotas_publicacao();

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
         or new.suspensa_admin or new.recursos_admin<>'{}'::jsonb or new.publicacao_automatica_liberada or new.cnpj_validado_automaticamente then
        raise exception 'Benefícios e verificação exigem autorização administrativa.' using errcode='42501';
      end if;
    else
      protected_keys := array['id','user_id','recursos_admin','suspensa_admin','plano','plano_id','plano_nome','plano_inicio','plano_valido_ate','plano_liberado_admin','plano_sem_cobranca','plano_liberado_em','verificacao_analisada_em','aprovacao_automatica_suspensa','situacao_cnpj','cnpj_validado_automaticamente','cnpj_validado_em','publicacao_automatica_liberada','publicacao_automatica_motivo'];
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
