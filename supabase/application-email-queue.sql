
create table if not exists private.em_application_email_settings (
 id boolean primary key default true check(id),
 enabled boolean not null default false,
 activated_at timestamptz,
 check (not enabled or activated_at is not null)
);
insert into private.em_application_email_settings(id) values(true) on conflict do nothing;
create table if not exists private.em_application_email_outbox (
 id uuid primary key default gen_random_uuid(),
 application_id text not null unique references public.candidaturas(id) on delete cascade,
 company_id uuid not null references public.empresas(id) on delete cascade,
 job_id uuid not null references public.vagas(id) on delete cascade,
 state text not null default 'blocked_setup' check(state in ('blocked_setup','pending','processing','sent','failed','skipped')),
 created_at timestamptz not null default now(),
 sent_at timestamptz,
 attempts integer not null default 0 check(attempts>=0),
 provider_message_id text,
 last_error text,
 check(state<>'sent' or sent_at is not null)
);
alter table private.em_application_email_settings enable row level security;
alter table private.em_application_email_outbox enable row level security;
revoke all on private.em_application_email_settings,private.em_application_email_outbox from public,anon,authenticated;
create or replace function private.em_enqueue_application_email()
returns trigger language plpgsql security definer set search_path='' as $$
declare job public.vagas%rowtype; company public.empresas%rowtype; ready boolean;
begin
 -- Only persisted applications create events; the client supplies no recipient.
 -- Authenticated inserts must belong to the logged-in candidate.
 if auth.uid() is not null and auth.uid() is distinct from new.candidato_user_id
    and coalesce(auth.role(),'')<>'service_role' then return new; end if;
 select * into job from public.vagas where id::text=new.vaga_id and user_id=new.empresa_user_id;
 if not found then return new; end if;
 select * into company from public.empresas where id=job.empresa_id and user_id=new.empresa_user_id;
 if not found then return new; end if;
 select enabled and activated_at<=now() into ready from private.em_application_email_settings where id;
 insert into private.em_application_email_outbox(application_id,company_id,job_id,state)
 values(new.id,company.id,job.id,case when coalesce(ready,false) then 'pending' else 'blocked_setup' end)
 on conflict(application_id) do nothing;
 return new;
end $$;
revoke all on function private.em_enqueue_application_email() from public,anon,authenticated;
create or replace trigger em_enqueue_application_email after insert on public.candidaturas
for each row execute function private.em_enqueue_application_email();
comment on table private.em_application_email_outbox is 'Transactional email events. No sending while blocked_setup. Never auto-release historical blocked events on activation.';
