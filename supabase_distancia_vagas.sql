-- EmpregaMais — suporte à distância das vagas
-- Execute uma vez no SQL Editor do Supabase.
alter table public.vagas
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

create index if not exists vagas_latitude_longitude_idx
  on public.vagas (latitude, longitude);
