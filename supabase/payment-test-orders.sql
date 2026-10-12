-- Test-only payment records; clients cannot create or approve orders.
create table if not exists public.em_payment_test_orders (
  id uuid primary key,
  user_id uuid not null references auth.users(id),
  empresa_id uuid not null references public.empresas(id),
  vaga_id uuid not null references public.vagas(id),
  service text not null check (service in ('destaque','urgente','confidencial')),
  days integer not null check (days in (7,30)),
  amount_cents integer not null default 990 check (amount_cents=990),
  seller_id text not null,
  status text not null default 'pending' check (status in ('pending','approved_test')),
  preference_id text,
  payment_id text unique,
  checkout_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.em_payment_test_orders enable row level security;
revoke all on public.em_payment_test_orders from anon,authenticated;
grant select on public.em_payment_test_orders to authenticated;
grant all on public.em_payment_test_orders to service_role;
drop policy if exists "Empresa consulta seus pedidos de teste" on public.em_payment_test_orders;
create policy "Empresa consulta seus pedidos de teste" on public.em_payment_test_orders for select to authenticated using ((select auth.uid())=user_id);
create index if not exists em_payment_test_orders_user_created_idx on public.em_payment_test_orders(user_id,created_at);
