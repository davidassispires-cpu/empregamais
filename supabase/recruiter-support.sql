-- Company support: private mutations, authenticated per-company reads.
create table public.em_support_tickets (
 id uuid primary key default gen_random_uuid(), protocol text not null unique default ('EM-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,12))),
 empresa_id uuid not null references public.empresas(id), company_name text not null, contact_name text not null, contact_email text not null,
 category text not null check(category in ('Vagas','Candidatos','Entrevistas','Pagamentos','Cadastro','Problema técnico')),
 subject text not null check(length(trim(subject)) between 3 and 160), description text not null check(length(trim(description)) between 10 and 6000), job_ref text,
 attachment jsonb, state text not null default 'aberto' check(state in ('aberto','atendimento','aguardando','resolvido')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), company_unread boolean not null default false, admin_unread boolean not null default true
);
create table public.em_support_messages (
 id uuid primary key default gen_random_uuid(), ticket_id uuid not null references public.em_support_tickets(id), sender_uid uuid not null references auth.users(id),
 sender_role text not null check(sender_role in ('company','support')), body text not null check(length(trim(body)) between 1 and 6000), created_at timestamptz not null default now()
);
create index em_support_company_updated on public.em_support_tickets(empresa_id,updated_at desc);
create index em_support_state_updated on public.em_support_tickets(state,updated_at desc);
create index em_support_message_ticket on public.em_support_messages(ticket_id,created_at);
alter table public.em_support_tickets enable row level security;
alter table public.em_support_messages enable row level security;
revoke all on public.em_support_tickets,public.em_support_messages from anon,authenticated;
grant select on public.em_support_tickets,public.em_support_messages to authenticated;
create policy "company or admin reads support" on public.em_support_tickets for select to authenticated using(public.is_admin() or private.usuario_pertence_empresa(empresa_id));
create policy "company or admin reads support messages" on public.em_support_messages for select to authenticated using(exists(select 1 from public.em_support_tickets t where t.id=ticket_id and (public.is_admin() or private.usuario_pertence_empresa(t.empresa_id))));
create or replace function private.em_support_action(p_action text,p_payload jsonb default '{}') returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid(); adm boolean; t public.em_support_tickets; e public.empresas; n uuid; att jsonb:=p_payload->'attachment'; msg text; result jsonb;
begin
 if u is null then raise exception 'Entre novamente na sua conta.' using errcode='42501'; end if;
 adm:=coalesce(public.is_admin(),false);
 if p_action='list' then
  select coalesce(jsonb_agg(to_jsonb(q)),'[]') into result from (select id,protocol,empresa_id,company_name,contact_name,contact_email,category,subject,job_ref,state,created_at,updated_at,company_unread,admin_unread from public.em_support_tickets where adm or private.usuario_pertence_empresa(empresa_id) order by updated_at desc limit 200) q;return result;
 end if;
 if p_action='create' then
  select * into e from public.empresas where cnpj=regexp_replace(p_payload->>'cnpj','[^0-9]','','g') and private.usuario_pertence_empresa(id) limit 1;
  if e.id is null then raise exception 'Não foi possível identificar sua empresa.' using errcode='42501'; end if;
  if nullif(trim(p_payload->>'contact_email'),'') is null then raise exception 'Informe o e-mail de contato.';end if;
  if att is not null and att<>'null'::jsonb then
   if length(att->>'data')>350000 or coalesce(att->>'data','')!~'^data:image/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$' then raise exception 'Anexe uma imagem PNG, JPG ou WebP de até 250 KB.';end if;
  end if;
  insert into public.em_support_tickets(empresa_id,company_name,contact_name,contact_email,category,subject,description,job_ref,attachment)
   values(e.id,coalesce(e.nome_fantasia,e.nome,e.razao_social,'Empresa'),left(coalesce(p_payload->>'contact_name',e.responsavel,'Responsável'),120),left(trim(p_payload->>'contact_email'),250),p_payload->>'category',trim(p_payload->>'subject'),trim(p_payload->>'description'),left(p_payload->>'job_ref',120),att) returning * into t;
  return to_jsonb(t);
 end if;
 select * into t from public.em_support_tickets where id=(p_payload->>'id')::uuid for update;
 if t.id is null or not(adm or private.usuario_pertence_empresa(t.empresa_id)) then raise exception 'Chamado não encontrado.' using errcode='42501';end if;
 if p_action='detail' then
  if adm then update public.em_support_tickets set admin_unread=false where id=t.id;else update public.em_support_tickets set company_unread=false where id=t.id;end if;
  select coalesce(jsonb_agg(to_jsonb(m) order by m.created_at),'[]') into result from public.em_support_messages m where m.ticket_id=t.id;
  return jsonb_build_object('ticket',to_jsonb(t),'messages',result);
 elsif p_action='reply' then
  msg:=trim(p_payload->>'body');if msg is null or length(msg) not between 1 and 6000 then raise exception 'Escreva uma resposta de até 6.000 caracteres.';end if;
  insert into public.em_support_messages(ticket_id,sender_uid,sender_role,body) values(t.id,u,case when adm then 'support' else 'company' end,msg);
  update public.em_support_tickets set updated_at=now(),state=case when adm then 'aguardando' else 'aberto' end,company_unread=adm,admin_unread=not adm where id=t.id;
  return jsonb_build_object('success',true);
 elsif p_action='state' then
  if not adm then raise exception 'Acesso administrativo necessário.' using errcode='42501';end if;
  update public.em_support_tickets set state=p_payload->>'state',updated_at=now(),company_unread=true where id=t.id;
  return jsonb_build_object('success',true);
 end if;
 raise exception 'Operação inválida.';
end $$;
revoke all on function private.em_support_action(text,jsonb) from public,anon;
grant usage on schema private to authenticated;
grant execute on function private.em_support_action(text,jsonb) to authenticated;
create or replace function public.em_support_action(p_action text,p_payload jsonb default '{}') returns jsonb language sql security invoker set search_path='' as $$select private.em_support_action(p_action,p_payload)$$;
revoke all on function public.em_support_action(text,jsonb) from public,anon;
grant execute on function public.em_support_action(text,jsonb) to authenticated;
