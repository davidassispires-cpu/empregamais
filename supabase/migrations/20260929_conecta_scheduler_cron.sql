-- +Empregos Conecta: agendador do worker.
-- Requer os segredos abaixo no Supabase Vault:
--   conecta_project_url
--   conecta_publishable_key
--
-- Em producao, o worker roda a cada 1 minuto e processa ate 2 empresas por chamada.

do $$
declare j record;
begin
  for j in
    select jobid
    from cron.job
    where jobname in ('conecta-worker-every-5m','conecta-worker-every-1m')
  loop
    perform cron.unschedule(j.jobid);
  end loop;
end $$;

select cron.schedule(
  'conecta-worker-every-1m',
  '* * * * *',
  $cron$
    select net.http_post(
      url := (
        select decrypted_secret
        from vault.decrypted_secrets
        where name='conecta_project_url'
      ) || '/functions/v1/conecta-worker',
      headers := jsonb_build_object(
        'Content-Type','application/json',
        'Authorization','Bearer ' || (
          select decrypted_secret
          from vault.decrypted_secrets
          where name='conecta_publishable_key'
        )
      ),
      body := '{"batch":2}'::jsonb,
      timeout_milliseconds := 60000
    );
  $cron$
);
