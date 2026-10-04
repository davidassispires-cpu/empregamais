-- Preserve all data; enforce integrity at the API boundary.
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
      protected_keys:=array['id','user_id','empresa_id','criado_em','motivo_reprovacao'];
      if new.status is distinct from old.status and new.status not in ('pendente','encerrada') then raise exception 'Aprovação da vaga exige análise administrativa.' using errcode='42501'; end if;
    end if;
    if not exists(select 1 from public.empresas e where e.id=new.empresa_id and e.user_id=new.user_id) then raise exception 'Empresa responsável inválida.' using errcode='42501'; end if;
  elsif tg_table_name = 'candidaturas' then
    if tg_op = 'INSERT' then
      if new.status <> 'Em avaliação' or new.entrevista is not null or new.contratado_em is not null then raise exception 'Uma candidatura deve iniciar em avaliação.' using errcode='42501'; end if;
      if not exists(select 1 from public.vagas v where v.id::text=new.vaga_id and v.user_id=new.empresa_user_id and v.status='aprovada' and (v.data_encerramento is null or v.data_encerramento>=current_date)) then raise exception 'Vaga indisponível ou empresa responsável inválida.' using errcode='42501'; end if;
      new.criado_em := now(); new.atualizado_em := now();
    else protected_keys:=array['id','vaga_id','candidato_user_id','empresa_user_id','candidato_nome','candidato_email','candidato_telefone','curriculo','perfil_profissional','curriculo_origem','criado_em']; end if;
  end if;
  foreach key in array coalesce(protected_keys,array[]::text[]) loop
    if new_data->key is distinct from old_data->key then raise exception 'Campo protegido: %',key using errcode='42501'; end if;
  end loop;
  return new;
end $$;
revoke all on function private.proteger_integridade_portal() from public;
create trigger portal_empresas_integridade before insert or update on public.empresas for each row execute function private.proteger_integridade_portal();
create trigger portal_candidatos_integridade before insert or update on public.candidatos for each row execute function private.proteger_integridade_portal();
create trigger portal_vagas_integridade before insert or update on public.vagas for each row execute function private.proteger_integridade_portal();
create trigger portal_candidaturas_integridade before insert or update on public.candidaturas for each row execute function private.proteger_integridade_portal();
create unique index if not exists candidaturas_uma_por_vaga_usuario on public.candidaturas(vaga_id,candidato_user_id) where candidato_user_id is not null;
alter policy "Publico registra metricas conecta" on public.conecta_metricas_eventos with check (
 evento in ('visualizacao','clique_candidatar','envio_externo') and exists(
 select 1 from public.vagas v where v.id=conecta_metricas_eventos.vaga_id and v.empresa_id=conecta_metricas_eventos.empresa_id and v.status='aprovada'));
-- The public directory uses only these columns; personal and operational fields remain private.
revoke select on public.empresas from anon;
grant select(id,nome,nome_fantasia,cnpj,logo_url,plano,plano_id,plano_liberado_admin,verificada,verificacao_status) on public.empresas to anon;
