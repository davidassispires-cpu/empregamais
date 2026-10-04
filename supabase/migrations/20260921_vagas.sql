-- EMPREGAMAIS — MIGRAÇÃO DE VAGAS PARA SUPABASE
-- Execute este arquivo UMA VEZ no Supabase > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.vagas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  empresa text,
  empresa_cnpj text,
  cargo text not null,
  area text,
  contrato text,
  modalidade text,
  cep text,
  estado text,
  cidade text,
  data_encerramento date,
  escolaridade text,
  experiencia text,
  jornada text,
  pcd text,
  salario text,
  salario_max text,
  salario_combinar boolean default false,
  horario_entrada text,
  horario_saida text,
  descricao text,
  requisitos text,
  beneficios text,
  beneficios_lista jsonb default '[]'::jsonb,
  beneficios_outros text,
  sobre_empresa text,
  senior50 boolean default false,
  confidencial boolean default false,
  destaque boolean default false,
  urgente boolean default false,
  destaque_solicitado boolean default false,
  urgencia_solicitada boolean default false,
  status text not null default 'pendente',
  criado_em timestamptz not null default now(),
  editado_em timestamptz,
  destaque_ate timestamptz,
  motivo_reprovacao text,
  edicoes_apos_aprovacao integer not null default 0
);

create index if not exists vagas_status_idx on public.vagas(status);
create index if not exists vagas_empresa_idx on public.vagas(empresa_id);
create index if not exists vagas_user_idx on public.vagas(user_id);
create index if not exists vagas_criado_idx on public.vagas(criado_em desc);

alter table public.vagas enable row level security;

drop policy if exists "Vagas publicadas são públicas" on public.vagas;
create policy "Vagas publicadas são públicas"
on public.vagas for select to anon, authenticated
using (status = 'aprovada');

drop policy if exists "Empresa vê suas próprias vagas" on public.vagas;
create policy "Empresa vê suas próprias vagas"
on public.vagas for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Empresa cria sua própria vaga" on public.vagas;
create policy "Empresa cria sua própria vaga"
on public.vagas for insert to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1 from public.empresas e
    where e.id = empresa_id
      and e.user_id = auth.uid()
  )
  and status = 'pendente'
);

drop policy if exists "Empresa edita sua própria vaga" on public.vagas;
create policy "Empresa edita sua própria vaga"
on public.vagas for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.admin_aprovar_vaga(p_vaga_id uuid)
returns public.vagas
language plpgsql
security definer
set search_path = public
as $$
declare r public.vagas;
begin
  update public.vagas
     set status = 'aprovada',
         motivo_reprovacao = null
   where id = p_vaga_id
   returning * into r;
  if r.id is null then raise exception 'Vaga não encontrada.'; end if;
  return r;
end;
$$;

create or replace function public.admin_reprovar_vaga(p_vaga_id uuid, p_motivo text default null)
returns public.vagas
language plpgsql
security definer
set search_path = public
as $$
declare r public.vagas;
begin
  update public.vagas
     set status = 'reprovada',
         motivo_reprovacao = p_motivo
   where id = p_vaga_id
   returning * into r;
  if r.id is null then raise exception 'Vaga não encontrada.'; end if;
  return r;
end;
$$;

revoke all on function public.admin_aprovar_vaga(uuid) from public;
revoke all on function public.admin_reprovar_vaga(uuid,text) from public;

-- IMPORTANTE: estas duas RPCs serão protegidas pela camada de administrador
-- quando conectarmos o painel admin ao Supabase. Não conceda execute a anon/authenticated agora.
select 'Tabela public.vagas criada/configurada.' as resultado;
