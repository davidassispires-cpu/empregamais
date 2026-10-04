-- +Empregos Conecta: fila, sincronizacao automatica e controle de origem.
-- Aplicado em producao em 2026-09-29.

alter table public.empresas
  add column if not exists conecta_sync_enabled boolean not null default false,
  add column if not exists conecta_next_sync_at timestamptz,
  add column if not exists conecta_last_sync_at timestamptz,
  add column if not exists conecta_last_sync_status text,
  add column if not exists conecta_last_sync_error text;

alter table public.vagas
  add column if not exists conecta_managed boolean not null default false,
  add column if not exists conecta_source_key text,
  add column if not exists conecta_source_url text,
  add column if not exists conecta_source_provider text,
  add column if not exists conecta_source_hash text,
  add column if not exists conecta_source_payload jsonb not null default '{}'::jsonb,
  add column if not exists conecta_last_seen_at timestamptz,
  add column if not exists conecta_last_synced_at timestamptz,
  add column if not exists conecta_missing_count integer not null default 0;

create unique index if not exists vagas_conecta_source_unique
  on public.vagas(empresa_id, conecta_source_key);

create index if not exists vagas_conecta_managed_idx
  on public.vagas(empresa_id, conecta_managed, conecta_last_seen_at desc);

create table if not exists public.conecta_sync_queue (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending','running','success','error')),
  trigger_type text not null default 'schedule'
    check (trigger_type in ('schedule','manual','retry')),
  source_url text,
  provider text,
  run_after timestamptz not null default now(),
  attempts integer not null default 0,
  started_at timestamptz,
  finished_at timestamptz,
  stats jsonb not null default '{}'::jsonb,
  error text,
  created_at timestamptz not null default now()
);

alter table public.conecta_sync_queue enable row level security;

create index if not exists conecta_sync_queue_pending_idx
  on public.conecta_sync_queue(status, run_after, created_at);

create index if not exists conecta_sync_queue_empresa_idx
  on public.conecta_sync_queue(empresa_id, created_at desc);

create unique index if not exists conecta_sync_queue_one_active_per_company
  on public.conecta_sync_queue(empresa_id)
  where status in ('pending','running');

drop policy if exists "empresa le propria fila conecta" on public.conecta_sync_queue;
create policy "empresa le propria fila conecta"
on public.conecta_sync_queue
for select
to authenticated
using (
  exists (
    select 1
    from public.empresas e
    where e.id = conecta_sync_queue.empresa_id
      and e.user_id = (select auth.uid())
  )
);

create or replace function public.conecta_enqueue_due(p_limit integer default 25)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
  v_count integer := 0;
  v_freq integer;
  v_url text;
  v_provider text;
begin
  for r in
    select e.*
    from public.empresas e
    where
      (
        e.conecta_sync_enabled = true
        or lower(coalesce(e.conecta_config->>'ativo','false')) in ('true','1','yes','sim')
      )
      and coalesce(e.conecta_config->>'url','') <> ''
      and (e.conecta_next_sync_at is null or e.conecta_next_sync_at <= now())
    order by coalesce(e.conecta_next_sync_at, e.atualizado_em, e.criado_em)
    limit greatest(1, least(coalesce(p_limit,25),100))
  loop
    v_url := nullif(trim(r.conecta_config->>'url'),'');
    if v_url is null then
      continue;
    end if;

    v_provider := coalesce(nullif(trim(r.conecta_config->>'sistema'),''),'auto');

    begin
      v_freq := greatest(5, least(1440, coalesce((r.conecta_config->>'frequencia')::integer,60)));
    exception when others then
      v_freq := 60;
    end;

    if not exists (
      select 1
      from public.conecta_sync_queue q
      where q.empresa_id = r.id
        and q.status in ('pending','running')
    ) then
      insert into public.conecta_sync_queue(
        empresa_id,status,trigger_type,source_url,provider,run_after
      )
      values(r.id,'pending','schedule',v_url,v_provider,now());

      v_count := v_count + 1;
    end if;

    update public.empresas
    set conecta_next_sync_at = now() + make_interval(mins => v_freq)
    where id = r.id;
  end loop;

  return v_count;
end
$$;

revoke all on function public.conecta_enqueue_due(integer) from public, anon, authenticated;
grant execute on function public.conecta_enqueue_due(integer) to service_role;

create or replace function public.conecta_claim_sync_jobs(p_limit integer default 5)
returns setof public.conecta_sync_queue
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conecta_sync_queue
  set status='pending',
      run_after=now(),
      error=coalesce(error,'') ||
        case when coalesce(error,'')='' then '' else E'\n' end ||
        'Execucao anterior expirou e voltou para a fila.'
  where status='running'
    and started_at < now() - interval '20 minutes'
    and attempts < 4;

  update public.conecta_sync_queue
  set status='error',
      finished_at=now(),
      error=coalesce(error,'') ||
        case when coalesce(error,'')='' then '' else E'\n' end ||
        'Numero maximo de tentativas atingido.'
  where status='running'
    and started_at < now() - interval '20 minutes'
    and attempts >= 4;

  return query
  with picked as (
    select q.id
    from public.conecta_sync_queue q
    where q.status='pending'
      and q.run_after <= now()
      and q.attempts < 4
    order by q.run_after, q.created_at
    for update skip locked
    limit greatest(1, least(coalesce(p_limit,5),20))
  )
  update public.conecta_sync_queue q
  set status='running',
      started_at=now(),
      attempts=q.attempts+1,
      error=null
  from picked
  where q.id=picked.id
  returning q.*;
end
$$;

revoke all on function public.conecta_claim_sync_jobs(integer) from public, anon, authenticated;
grant execute on function public.conecta_claim_sync_jobs(integer) to service_role;

create or replace function public.conecta_apply_sync(
  p_empresa_id uuid,
  p_jobs jsonb,
  p_provider text,
  p_run_at timestamptz default now(),
  p_allow_close boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  e public.empresas%rowtype;
  j jsonb;
  v_existing uuid;
  v_key text;
  v_url text;
  v_title text;
  v_seen text[] := array[]::text[];
  v_inserted integer := 0;
  v_updated integer := 0;
  v_closed integer := 0;
begin
  select * into e from public.empresas where id=p_empresa_id;

  if e.id is null then
    raise exception 'empresa_not_found';
  end if;

  if e.user_id is null then
    raise exception 'empresa_without_user';
  end if;

  if jsonb_typeof(coalesce(p_jobs,'[]'::jsonb)) <> 'array' then
    raise exception 'jobs_must_be_array';
  end if;

  for j in select value from jsonb_array_elements(coalesce(p_jobs,'[]'::jsonb))
  loop
    v_url := nullif(trim(j->>'url'),'');
    if v_url is null then continue; end if;

    v_key := coalesce(
      nullif(trim(j->>'key'),''),
      encode(digest(v_url,'sha256'),'hex')
    );

    v_seen := array_append(v_seen,v_key);
    v_title := coalesce(nullif(trim(j->>'title'),''),'Vaga integrada');

    select id into v_existing
    from public.vagas
    where empresa_id=p_empresa_id
      and conecta_source_key=v_key
    limit 1;

    if v_existing is null then
      insert into public.vagas(
        user_id,empresa_id,empresa,empresa_cnpj,cargo,area,contrato,modalidade,
        cep,estado,cidade,data_encerramento,descricao,requisitos,beneficios,
        salario,status,logo,candidatura_tipo,candidatura_link,
        conecta_managed,conecta_source_key,conecta_source_url,
        conecta_source_provider,conecta_source_hash,conecta_source_payload,
        conecta_last_seen_at,conecta_last_synced_at,conecta_missing_count
      )
      values(
        e.user_id,e.id,coalesce(e.nome_fantasia,e.nome,e.razao_social,'Empresa'),
        e.cnpj,v_title,nullif(j->>'area',''),nullif(j->>'contrato',''),
        nullif(j->>'modalidade',''),nullif(j->>'cep',''),nullif(j->>'estado',''),
        nullif(j->>'cidade',''),
        case
          when coalesce(j->>'data_encerramento','') ~ '^\d{4}-\d{2}-\d{2}$'
          then (j->>'data_encerramento')::date
          else null
        end,
        coalesce(
          nullif(j->>'descricao',''),
          'Consulte a pagina de origem para os detalhes completos desta oportunidade.'
        ),
        nullif(j->>'requisitos',''),nullif(j->>'beneficios',''),
        nullif(j->>'salario',''),'aprovada',e.logo_url,'externo',v_url,
        true,v_key,v_url,coalesce(nullif(p_provider,''),'generic'),
        nullif(j->>'hash',''),j,p_run_at,p_run_at,0
      );

      v_inserted := v_inserted + 1;
    else
      update public.vagas
      set cargo=v_title,
          area=coalesce(nullif(j->>'area',''),area),
          contrato=coalesce(nullif(j->>'contrato',''),contrato),
          modalidade=coalesce(nullif(j->>'modalidade',''),modalidade),
          cep=coalesce(nullif(j->>'cep',''),cep),
          estado=coalesce(nullif(j->>'estado',''),estado),
          cidade=coalesce(nullif(j->>'cidade',''),cidade),
          data_encerramento=case
            when coalesce(j->>'data_encerramento','') ~ '^\d{4}-\d{2}-\d{2}$'
            then (j->>'data_encerramento')::date
            else data_encerramento
          end,
          descricao=coalesce(nullif(j->>'descricao',''),descricao),
          requisitos=coalesce(nullif(j->>'requisitos',''),requisitos),
          beneficios=coalesce(nullif(j->>'beneficios',''),beneficios),
          salario=coalesce(nullif(j->>'salario',''),salario),
          status='aprovada',
          logo=coalesce(logo,e.logo_url),
          candidatura_link=case
            when coalesce(candidatura_tipo,'externo') in ('externo','link','portal')
            then v_url
            else candidatura_link
          end,
          conecta_managed=true,
          conecta_source_url=v_url,
          conecta_source_provider=coalesce(
            nullif(p_provider,''),conecta_source_provider,'generic'
          ),
          conecta_source_hash=coalesce(
            nullif(j->>'hash',''),conecta_source_hash
          ),
          conecta_source_payload=j,
          conecta_last_seen_at=p_run_at,
          conecta_last_synced_at=p_run_at,
          conecta_missing_count=0,
          editado_em=now()
      where id=v_existing;

      v_updated := v_updated + 1;
    end if;
  end loop;

  if p_allow_close and cardinality(v_seen) > 0 then
    update public.vagas
    set conecta_missing_count=conecta_missing_count+1,
        conecta_last_synced_at=p_run_at,
        status=case
          when conecta_missing_count+1 >= 2 then 'encerrada'
          else status
        end,
        data_encerramento=case
          when conecta_missing_count+1 >= 2
          then coalesce(data_encerramento,current_date)
          else data_encerramento
        end,
        editado_em=case
          when conecta_missing_count+1 >= 2 then now()
          else editado_em
        end
    where empresa_id=p_empresa_id
      and conecta_managed=true
      and conecta_source_key is not null
      and not (conecta_source_key = any(v_seen));

    select count(*) into v_closed
    from public.vagas
    where empresa_id=p_empresa_id
      and conecta_managed=true
      and status='encerrada'
      and conecta_missing_count>=2
      and conecta_last_synced_at=p_run_at;
  end if;

  update public.empresas
  set conecta_last_sync_at=p_run_at,
      conecta_last_sync_status='success',
      conecta_last_sync_error=null
  where id=p_empresa_id;

  return jsonb_build_object(
    'inserted',v_inserted,
    'updated',v_updated,
    'closed',v_closed,
    'seen',cardinality(v_seen)
  );
end
$$;

revoke all on function public.conecta_apply_sync(uuid,jsonb,text,timestamptz,boolean)
from public, anon, authenticated;
grant execute on function public.conecta_apply_sync(uuid,jsonb,text,timestamptz,boolean)
to service_role;

create or replace function public.conecta_enqueue_my_company()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  e public.empresas%rowtype;
  v_id uuid;
  v_url text;
  v_provider text;
begin
  if auth.uid() is null then
    raise exception 'authentication_required';
  end if;

  select * into e
  from public.empresas
  where user_id=auth.uid()
  limit 1;

  if e.id is null then
    raise exception 'empresa_not_found';
  end if;

  v_url := nullif(trim(e.conecta_config->>'url'),'');
  if v_url is null then
    raise exception 'conecta_source_not_configured';
  end if;

  v_provider := coalesce(
    nullif(trim(e.conecta_config->>'sistema'),''),
    'auto'
  );

  select q.id into v_id
  from public.conecta_sync_queue q
  where q.empresa_id=e.id
    and q.status in ('pending','running')
  order by q.created_at desc
  limit 1;

  if v_id is null then
    insert into public.conecta_sync_queue(
      empresa_id,status,trigger_type,source_url,provider,run_after
    )
    values(
      e.id,'pending','manual',v_url,v_provider,now()
    )
    returning id into v_id;
  end if;

  update public.empresas
  set conecta_sync_enabled=true,
      conecta_next_sync_at=now()
  where id=e.id;

  return v_id;
end
$$;

revoke all on function public.conecta_enqueue_my_company() from public, anon;
grant execute on function public.conecta_enqueue_my_company() to authenticated;
