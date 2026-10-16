CREATE OR REPLACE FUNCTION private.preparar_solicitacao_extra()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare job public.vagas; suspended boolean;
begin
 select * into job from public.vagas where id=new.vaga_id;
 if not found or job.empresa_id is null then raise exception 'Vaga não encontrada.'; end if;
 if current_user in ('anon','authenticated') and not private.usuario_pertence_empresa(job.empresa_id) then raise exception 'Esta vaga não pertence à sua empresa.' using errcode='42501'; end if;
 select suspensa_admin into suspended from public.empresas where id=job.empresa_id;
 if suspended or job.status not in ('pendente','aprovada') or (job.data_encerramento is not null and job.data_encerramento<current_date) then raise exception 'A vaga precisa estar em análise ou publicada e dentro do prazo.'; end if;
 if new.tipo='destaque' and job.destaque and (job.destaque_ate is null or job.destaque_ate>now()) then raise exception 'Esta vaga já possui destaque ativo.'; end if;
 if new.tipo='urgencia' and job.urgente and (job.urgente_ate is null or job.urgente_ate>now()) then raise exception 'Esta vaga já possui urgência ativa.'; end if;
 if new.tipo='confidencial' and job.confidencial and (job.confidencial_ate is null or job.confidencial_ate>now()) then raise exception 'Esta vaga já possui confidencialidade ativa.'; end if;
 new.empresa_id:=job.empresa_id;new.user_id:=coalesce(auth.uid(),job.user_id);
 if new.tipo not in ('destaque','urgencia','confidencial') then raise exception 'Serviço inválido.'; end if;
 new.valor:=case new.tipo when 'destaque' then 29.90 when 'urgencia' then 19.90 when 'confidencial' then 17.90 end;
 new.dias:=case when new.tipo='urgencia' then 7 else 15 end;
 new.status:='aguardando_pagamento';new.criado_em:=now();new.ativado_em:=null;new.cancelado_em:=null;
 return new;
end $function$

