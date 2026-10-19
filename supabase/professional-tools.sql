-- Professional knowledge tests, invitations and private interview practice.
-- Additive schema: existing interview scorecards are not used by this feature.
create schema if not exists private;

create table if not exists private.em_professional_catalog (
 topic text primary key,
 title text not null,
 description text not null,
 icon text not null,
 version integer not null default 1 check(version>0),
 minutes integer not null check(minutes between 5 and 60),
 questions jsonb not null check(jsonb_typeof(questions)='array' and jsonb_array_length(questions) between 1 and 30)
);
create table if not exists private.em_professional_assignments (
 id uuid primary key default gen_random_uuid(),
 empresa_id uuid not null references public.empresas(id) on delete cascade,
 candidate_uid uuid not null references auth.users(id) on delete cascade,
 created_by uuid not null references auth.users(id),
 application_ref text not null,
 job_ref text not null,
 candidate_name text not null,
 job_title text not null,
 company_name text not null,
 topic text not null references private.em_professional_catalog(topic),
 version integer not null,
 cancelled boolean not null default false,
 created_at timestamptz not null default now(),
 unique(empresa_id,candidate_uid,job_ref,topic,version)
);
create table if not exists private.em_professional_attempts (
 id uuid primary key default gen_random_uuid(),
 candidate_uid uuid not null references auth.users(id) on delete cascade,
 assignment_id uuid unique references private.em_professional_assignments(id) on delete cascade,
 topic text not null references private.em_professional_catalog(topic),
 version integer not null,
 title text not null,
 questions jsonb not null,
 answers jsonb not null default '[]'::jsonb check(jsonb_typeof(answers)='array'),
 result jsonb,
 started_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 completed_at timestamptz
);
create table if not exists private.em_professional_simulations (
 id uuid primary key default gen_random_uuid(),
 candidate_uid uuid not null references auth.users(id) on delete cascade,
 mode text not null check(mode in ('primeira','cargo','situacoes')),
 role text not null check(length(role) between 1 and 100),
 questions jsonb not null check(jsonb_typeof(questions)='array'),
 answers jsonb not null check(jsonb_typeof(answers)='array'),
 completed_at timestamptz,
 updated_at timestamptz not null default now()
);
alter table private.em_professional_catalog enable row level security;
alter table private.em_professional_assignments enable row level security;
alter table private.em_professional_attempts enable row level security;
alter table private.em_professional_simulations enable row level security;
revoke all on private.em_professional_catalog,private.em_professional_assignments,private.em_professional_attempts,private.em_professional_simulations from public,anon,authenticated;
create index if not exists em_professional_assignments_company_idx on private.em_professional_assignments(empresa_id,created_at desc);
create index if not exists em_professional_assignments_candidate_idx on private.em_professional_assignments(candidate_uid,created_at desc);
create index if not exists em_professional_assignments_creator_idx on private.em_professional_assignments(created_by);
create index if not exists em_professional_assignments_topic_idx on private.em_professional_assignments(topic);
create index if not exists em_professional_attempts_candidate_idx on private.em_professional_attempts(candidate_uid,started_at desc);
create index if not exists em_professional_attempts_topic_idx on private.em_professional_attempts(topic);
create index if not exists em_professional_simulations_candidate_idx on private.em_professional_simulations(candidate_uid,updated_at desc);

create or replace function private.em_professional_grade(p_questions jsonb,p_answers jsonb)
returns jsonb language plpgsql immutable set search_path='' as $$
declare item jsonb; answer jsonb; feedback jsonb:='[]'::jsonb; skill_rows jsonb; marks jsonb:='[]'::jsonb;
 idx integer:=0; total integer:=0; correct integer:=0; is_correct boolean; numeric_answer numeric; percent integer; objective boolean;
begin
 for item in select value from jsonb_array_elements(p_questions) loop
  answer:=p_answers->idx; objective:=item->>'type'<>'open'; is_correct:=false;
  if objective then
   total:=total+1;
   if item->>'type'='choice' then
    is_correct:=jsonb_typeof(answer)='number' and answer=item->'correct';
   elsif item->>'type'='number' then
    begin
     if trim(answer#>>'{}')~'^-?[0-9]+([.,][0-9]+)?$' then
      numeric_answer:=replace(trim(answer#>>'{}'),',','.')::numeric;
      is_correct:=numeric_answer=(item->>'correct')::numeric;
     end if;
    exception when invalid_text_representation or numeric_value_out_of_range then is_correct:=false; end;
   elsif item->>'type'='formula' then
    select exists(select 1 from jsonb_array_elements_text(item->'correct') allowed
      where regexp_replace(upper(allowed),'[[:space:]]','','g')=regexp_replace(upper(answer#>>'{}'),'[[:space:]]','','g')) into is_correct;
   end if;
   if coalesce(is_correct,false) then correct:=correct+1;end if;
   marks:=marks||jsonb_build_array(jsonb_build_object('skill',item->>'skill','correct',coalesce(is_correct,false)));
  end if;
  feedback:=feedback||jsonb_build_array(jsonb_build_object('index',idx,'type',item->>'type','skill',item->>'skill','prompt',item->>'prompt','answer',answer,'correct',case when objective then to_jsonb(coalesce(is_correct,false)) else null end,'expected',case when objective then item->'correct' else null end,'explanation',item->>'explanation','rubric',item->'rubric'));
  idx:=idx+1;
 end loop;
 select coalesce(jsonb_agg(jsonb_build_object('skill',skill,'correct',hits,'total',quantity) order by skill),'[]'::jsonb) into skill_rows
 from(select value->>'skill' skill,count(*) quantity,count(*) filter(where(value->>'correct')::boolean) hits from jsonb_array_elements(marks) group by value->>'skill') grouped;
 percent:=case when total>0 then round(100.0*correct/total)::integer else null end;
 return jsonb_build_object('correct',correct,'total',total,'percent',percent,'open_count',idx-total,'skills',skill_rows,'feedback',feedback,'criteria','O percentual considera somente as questões objetivas. Respostas abertas são apresentadas para leitura e não recebem nota automática.');
end;
$$;
revoke all on function private.em_professional_grade(jsonb,jsonb) from public,anon,authenticated;

create or replace function private.em_professional_payload(p_attempt private.em_professional_attempts)
returns jsonb language sql stable set search_path='' as $$
 select(to_jsonb(p_attempt)-'questions')||jsonb_build_object('questions',
  (select coalesce(jsonb_agg(case when(p_attempt).completed_at is null then value-'correct'-'explanation' else value end),'[]'::jsonb) from jsonb_array_elements((p_attempt).questions)))
$$;
revoke all on function private.em_professional_payload(private.em_professional_attempts) from public,anon,authenticated;

create or replace function private.em_professional_tools(p_action text,p_data jsonb default '{}'::jsonb)
returns jsonb language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); company public.empresas%rowtype; vacancy public.vagas%rowtype; application public.candidaturas%rowtype;
 invitation private.em_professional_assignments%rowtype; attempt private.em_professional_attempts%rowtype; catalog private.em_professional_catalog%rowtype;
 simulation private.em_professional_simulations%rowtype; recipient uuid; company_mode boolean:=coalesce(p_data->>'role','candidate')='company';
 rows jsonb; attempts jsonb; simulations jsonb; submitted_answers jsonb; question_count integer; is_submit boolean; requested_id uuid;
begin
 if uid is null then raise exception 'Entre novamente na sua conta.' using errcode='42501';end if;
 if p_data is null or jsonb_typeof(p_data)<>'object' or octet_length(p_data::text)>70000 then raise exception 'Dados inválidos.';end if;
 if p_action='catalog' then
  select coalesce(jsonb_agg(jsonb_build_object('topic',topic,'title',title,'description',description,'icon',icon,'minutes',minutes,'version',version,'count',jsonb_array_length(questions),'objective',(select count(*) from jsonb_array_elements(questions) q where q->>'type'<>'open')) order by title),'[]'::jsonb) into rows from private.em_professional_catalog;
  return rows;
 end if;
 if p_action in ('assign','cancel') or(p_action='list' and company_mode) then
  select * into company from public.empresas where regexp_replace(cnpj,'[^0-9]','','g')=regexp_replace(p_data->>'company_cnpj','[^0-9]','','g') and private.usuario_pertence_empresa(id) limit 1;
  if company.id is null or coalesce(company.suspensa_admin,false) then raise exception 'Empresa sem autorização.' using errcode='42501';end if;
 end if;
 if p_action='assign' then
  select * into catalog from private.em_professional_catalog where topic=p_data->>'topic';
  if catalog.topic is null then raise exception 'Teste não encontrado.';end if;
  select * into vacancy from public.vagas where id::text=p_data->>'job_ref' and empresa_id=company.id;
  if vacancy.id is null then raise exception 'A vaga não pertence à sua empresa.' using errcode='42501';end if;
  select * into application from public.candidaturas where id=p_data->>'application_ref';
  if application.id is not null then
   if application.vaga_id<>vacancy.id::text then raise exception 'A candidatura não pertence à vaga.' using errcode='42501';end if;
   if application.status~*'cancelad' then raise exception 'A candidatura foi cancelada pelo candidato.';end if;
   recipient:=application.candidato_user_id;
  else
   -- Legacy application references are labels. Ownership is checked against the actual vacancy above.
   select id into recipient from auth.users where lower(email)=lower(trim(p_data->>'candidate_email')) and email_confirmed_at is not null and deleted_at is null;
  end if;
  if recipient is null or recipient=uid then raise exception 'O candidato precisa ter uma conta confirmada no portal para receber o teste.';end if;
  if length(trim(coalesce(p_data->>'application_ref',''))) not between 1 and 200 then raise exception 'Escolha uma candidatura válida.';end if;
  insert into private.em_professional_assignments(empresa_id,candidate_uid,created_by,application_ref,job_ref,candidate_name,job_title,company_name,topic,version)
  values(company.id,recipient,uid,trim(p_data->>'application_ref'),vacancy.id::text,coalesce(nullif(application.candidato_nome,''),nullif(left(trim(p_data->>'candidate_name'),160),''),'Candidato'),vacancy.cargo,coalesce(nullif(company.nome_fantasia,''),nullif(company.nome,''),'Empresa'),catalog.topic,catalog.version)
  on conflict(empresa_id,candidate_uid,job_ref,topic,version) do update set cancelled=false
  returning * into invitation;
  return to_jsonb(invitation);
 elsif p_action='cancel' then
  select * into invitation from private.em_professional_assignments where id=(p_data->>'id')::uuid and empresa_id=company.id for update;
  if invitation.id is null then raise exception 'Convite não encontrado.' using errcode='42501';end if;
  if exists(select 1 from private.em_professional_attempts a where a.assignment_id=invitation.id and a.completed_at is not null) then raise exception 'O teste já foi concluído.';end if;
  update private.em_professional_assignments set cancelled=true where id=invitation.id;
  return jsonb_build_object('cancelled',true);
 elsif p_action='list' then
  select coalesce(jsonb_agg(to_jsonb(s) order by s.created_at desc),'[]'::jsonb) into rows from(
   select i.id,i.application_ref,i.job_ref,i.job_title,i.company_name,i.candidate_name,i.topic,i.cancelled,i.created_at,c.title,
    a.id attempt_id,a.started_at,a.completed_at,a.result->'percent' percent,a.result->'correct' correct,a.result->'total' total
   from private.em_professional_assignments i join private.em_professional_catalog c on c.topic=i.topic left join private.em_professional_attempts a on a.assignment_id=i.id
   where case when company_mode then i.empresa_id=company.id else i.candidate_uid=uid end order by i.created_at desc limit 500
  )s;
  if not company_mode then
   select coalesce(jsonb_agg(to_jsonb(s) order by s.started_at desc),'[]'::jsonb) into attempts from(select a.id,a.topic,a.title,a.started_at,a.updated_at,a.completed_at,a.result->'percent' percent,a.result->'correct' correct,a.result->'total' total from private.em_professional_attempts a where a.candidate_uid=uid and a.assignment_id is null order by a.started_at desc limit 100)s;
  end if;
  select coalesce(jsonb_agg(to_jsonb(s) order by s.updated_at desc),'[]'::jsonb) into simulations from(select id,mode,role,completed_at,updated_at from private.em_professional_simulations where candidate_uid=uid order by updated_at desc limit 100)s;
  return jsonb_build_object('assignments',rows,'attempts',coalesce(attempts,'[]'::jsonb),'simulations',simulations);
 elsif p_action='start' then
  if nullif(p_data->>'assignment_id','') is not null then
   select * into invitation from private.em_professional_assignments where id=(p_data->>'assignment_id')::uuid and candidate_uid=uid for update;
   if invitation.id is null or invitation.cancelled then raise exception 'Este convite não está disponível para sua conta.' using errcode='42501';end if;
   select * into attempt from private.em_professional_attempts where assignment_id=invitation.id;
   if attempt.id is not null then return private.em_professional_payload(attempt);end if;
   select * into catalog from private.em_professional_catalog where topic=invitation.topic and version=invitation.version;
  else
   select * into catalog from private.em_professional_catalog where topic=p_data->>'topic';
   if catalog.topic is null then raise exception 'Teste não encontrado.';end if;
   select * into attempt from private.em_professional_attempts where candidate_uid=uid and assignment_id is null and topic=catalog.topic and completed_at is null order by started_at desc limit 1;
   if attempt.id is not null then return private.em_professional_payload(attempt);end if;
  end if;
  if catalog.topic is null then raise exception 'Esta versão do teste não está disponível.';end if;
  insert into private.em_professional_attempts(candidate_uid,assignment_id,topic,version,title,questions) values(uid,invitation.id,catalog.topic,catalog.version,catalog.title,catalog.questions) returning * into attempt;
  return private.em_professional_payload(attempt);
 elsif p_action in ('get','save','submit') then
  select * into attempt from private.em_professional_attempts where id=(p_data->>'id')::uuid for update;
  if attempt.id is null then raise exception 'Teste não encontrado.' using errcode='42501';end if;
  if attempt.candidate_uid<>uid then
   if p_action<>'get' or attempt.completed_at is null or not exists(select 1 from private.em_professional_assignments i where i.id=attempt.assignment_id and private.usuario_pertence_empresa(i.empresa_id)) then raise exception 'Este resultado não está disponível para sua conta.' using errcode='42501';end if;
  end if;
  if p_action='get' or attempt.completed_at is not null then return private.em_professional_payload(attempt);end if;
  if attempt.assignment_id is not null and exists(select 1 from private.em_professional_assignments i where i.id=attempt.assignment_id and i.cancelled) then raise exception 'Este convite foi cancelado pela empresa.';end if;
  if nullif(p_data->>'expected_updated_at','') is not null and(p_data->>'expected_updated_at')::timestamptz<>attempt.updated_at then raise exception 'O teste foi atualizado em outra janela. Reabra para continuar.';end if;
  submitted_answers:=p_data->'answers';question_count:=jsonb_array_length(attempt.questions);is_submit:=p_action='submit';
  if submitted_answers is null or jsonb_typeof(submitted_answers)<>'array' or jsonb_array_length(submitted_answers)>question_count then raise exception 'Respostas inválidas.';end if;
  if exists(select 1 from jsonb_array_elements(submitted_answers) a where jsonb_typeof(a) not in ('number','string','null') or length(a#>>'{}')>4000) then raise exception 'Uma resposta excede o tamanho permitido.';end if;
  if is_submit and(jsonb_array_length(submitted_answers)<>question_count or exists(select 1 from jsonb_array_elements(submitted_answers) a where a='null'::jsonb or trim(a#>>'{}')='')) then raise exception 'Responda todas as questões antes de concluir.';end if;
  update private.em_professional_attempts set answers=submitted_answers,updated_at=clock_timestamp(),completed_at=case when is_submit then now() else null end,result=case when is_submit then private.em_professional_grade(attempt.questions,submitted_answers) else null end where id=attempt.id returning * into attempt;
  return private.em_professional_payload(attempt);
 elsif p_action='simulation_save' then
  if nullif(p_data->>'id','') is not null then
   select * into simulation from private.em_professional_simulations where id=(p_data->>'id')::uuid and candidate_uid=uid and completed_at is null for update;
   if simulation.id is null then raise exception 'Treino não disponível para edição.' using errcode='42501';end if;
   p_data:=p_data||jsonb_build_object('questions',simulation.questions,'mode',simulation.mode,'job_role',simulation.role);
  end if;
  if p_data->>'mode' not in ('primeira','cargo','situacoes') or length(trim(coalesce(p_data->>'job_role',''))) not between 1 and 100 then raise exception 'Escolha a modalidade e o cargo.';end if;
  if jsonb_typeof(p_data->'questions')<>'array' or jsonb_typeof(p_data->'answers')<>'array' or jsonb_array_length(p_data->'questions') not between 1 and 10 or jsonb_array_length(p_data->'answers')>jsonb_array_length(p_data->'questions') then raise exception 'Simulação inválida.';end if;
  if exists(select 1 from jsonb_array_elements(p_data->'answers') a where jsonb_typeof(a) not in ('null','string') or length(a#>>'{}')>4000) then raise exception 'Resposta inválida.';end if;
  if coalesce((p_data->>'complete')::boolean,false) and(jsonb_array_length(p_data->'answers')<>jsonb_array_length(p_data->'questions') or exists(select 1 from jsonb_array_elements(p_data->'answers') a where coalesce(length(trim(a#>>'{}')),0)<20)) then raise exception 'Responda todas as perguntas com pelo menos 20 caracteres.';end if;
  if nullif(p_data->>'id','') is not null then
   update private.em_professional_simulations set answers=p_data->'answers',updated_at=clock_timestamp(),completed_at=case when coalesce((p_data->>'complete')::boolean,false) then now() else null end where id=(p_data->>'id')::uuid and candidate_uid=uid and completed_at is null returning * into simulation;
   if simulation.id is null then raise exception 'Treino não disponível para edição.' using errcode='42501';end if;
  else
   insert into private.em_professional_simulations(candidate_uid,mode,role,questions,answers,completed_at) values(uid,p_data->>'mode',trim(p_data->>'job_role'),p_data->'questions',p_data->'answers',case when coalesce((p_data->>'complete')::boolean,false) then now() else null end) returning * into simulation;
  end if;
  return to_jsonb(simulation);
 elsif p_action='simulation_get' then
  select * into simulation from private.em_professional_simulations where id=(p_data->>'id')::uuid and candidate_uid=uid;
  if simulation.id is null then raise exception 'Treino não encontrado.' using errcode='42501';end if;
  return to_jsonb(simulation);
 end if;
 raise exception 'Ação não encontrada.';
end;
$$;
revoke all on function private.em_professional_tools(text,jsonb) from public,anon;
grant usage on schema private to authenticated;
grant execute on function private.em_professional_tools(text,jsonb) to authenticated;
create or replace function public.em_professional_tools(p_action text,p_data jsonb default '{}'::jsonb)
returns jsonb language sql security invoker set search_path='' as $$select private.em_professional_tools(p_action,p_data)$$;
revoke all on function public.em_professional_tools(text,jsonb) from public,anon;
grant execute on function public.em_professional_tools(text,jsonb) to authenticated;

insert into private.em_professional_catalog(topic,title,description,icon,version,minutes,questions) select j->>'topic',j->>'title',j->>'description',j->>'icon',(j->>'version')::integer,(j->>'minutes')::integer,j->'questions' from (select $exam${"topic":"comunicacao","title":"Comunicação profissional","description":"Interpretação, clareza e mensagens de trabalho.","icon":"text","minutes":12,"questions":[{"type":"choice","skill":"Concordância","prompt":"Escolha a frase adequada para enviar três documentos.","options":["Seguem os documentos solicitados.","Segue os documentos solicitado.","Seguem o documento solicitados."],"correct":0,"explanation":"O verbo e os adjetivos concordam com “documentos”."},{"type":"choice","skill":"Clareza","prompt":"Um relatório será entregue amanhã às 15h. Qual confirmação evita dúvidas?","options":["Está quase pronto.","Confirmo o envio do relatório amanhã, às 15h.","Depois eu envio."],"correct":1,"explanation":"A confirmação apresenta a entrega e o prazo exato."},{"type":"choice","skill":"Interpretação","prompt":"A instrução é: confira os valores, obtenha a aprovação e só então envie a proposta. O que deve acontecer antes do envio?","options":["Enviar primeiro para ganhar tempo.","Conferir apenas os valores.","Conferir os valores e obter a aprovação."],"correct":2,"explanation":"As duas etapas são prévias ao envio."},{"type":"choice","skill":"Comunicação de prazo","prompt":"Você percebe que não conseguirá cumprir um prazo. O que deve comunicar?","options":["Avisar antes do vencimento, explicar o impacto e propor um novo prazo realista.","Esperar que alguém pergunte.","Prometer o mesmo prazo sem conferir."],"correct":0,"explanation":"Uma comunicação antecipada permite reorganizar o trabalho."},{"type":"choice","skill":"Objetividade","prompt":"Qual assunto de e-mail facilita localizar uma solicitação de aprovação?","options":["Olá!!!","Aprovação da proposta 128 — retorno até 20/11","Importante"],"correct":1,"explanation":"O assunto identifica a ação, o documento e o prazo."},{"type":"choice","skill":"Revisão","prompt":"Antes de enviar uma mensagem com anexo, o que conferir?","options":["Somente a assinatura.","Apenas o tamanho do texto.","Destinatário, arquivo correto e informações citadas."],"correct":2,"explanation":"A revisão inclui o destinatário e o conteúdo do envio."},{"type":"choice","skill":"Cordialidade","prompt":"Escolha a solicitação mais clara e respeitosa.","options":["Envie isso agora.","Poderia confirmar o recebimento da proposta até as 16h?","Já era para ter respondido."],"correct":1,"explanation":"A solicitação explicita a ação e o prazo com cordialidade."},{"type":"open","skill":"Redação","prompt":"Escreva um e-mail de 4 a 6 linhas informando a um cliente que a entrega prevista para terça-feira será feita na quarta-feira. Explique a atualização e ofereça um canal de contato.","rubric":["Identificar a atualização de prazo","Informar a nova previsão sem ambiguidade","Usar tom respeitoso e oferecer contato"]}],"version":1}$exam$::jsonb j) source on conflict(topic) do update set title=excluded.title,description=excluded.description,icon=excluded.icon,version=excluded.version,minutes=excluded.minutes,questions=excluded.questions;
insert into private.em_professional_catalog(topic,title,description,icon,version,minutes,questions) select j->>'topic',j->>'title',j->>'description',j->>'icon',(j->>'version')::integer,(j->>'minutes')::integer,j->'questions' from (select $exam${"topic":"excel","title":"Excel e planilhas","description":"Fórmulas, conferência de dados e cálculos práticos.","icon":"grid","minutes":15,"questions":[{"type":"formula","skill":"Fórmulas","prompt":"A tabela registra as vendas: B2 = 120, B3 = 80 e B4 = 150. Escreva uma fórmula que some o intervalo B2:B4.","correct":["=SOMA(B2:B4)","=SUM(B2:B4)","=B2+B3+B4"],"explanation":"SOMA ou SUM adiciona todas as células do intervalo."},{"type":"number","skill":"Cálculo","prompt":"Usando B2 = 120, B3 = 80 e B4 = 150, qual é o total de vendas?","correct":350,"explanation":"120 + 80 + 150 = 350."},{"type":"choice","skill":"Filtros","prompt":"Qual recurso mostra apenas pedidos com status “Pendente”, sem excluir os demais?","options":["Filtro","Excluir linhas","Mesclar células"],"correct":0,"explanation":"O filtro controla a visualização e preserva os registros."},{"type":"number","skill":"Média","prompt":"As notas em C2, C3 e C4 são 6, 8 e 10. Qual é a média?","correct":8,"explanation":"(6 + 8 + 10) ÷ 3 = 8."},{"type":"choice","skill":"Referências","prompt":"O que significa $A$1 ao copiar uma fórmula?","options":["Referência relativa","Referência fixa à coluna A e à linha 1","Formatação de moeda"],"correct":1,"explanation":"Os dois sinais $ fixam a coluna e a linha."},{"type":"number","skill":"Percentuais","prompt":"Um pedido de R$ 240 tem desconto de 15%. Qual é o valor final em reais?","correct":204,"explanation":"15% de 240 é 36. O preço final é 240 − 36 = 204."},{"type":"choice","skill":"Organização","prompt":"Como ordenar uma lista de nomes de A a Z?","options":["Congelar painéis","Quebrar texto","Classificar em ordem crescente"],"correct":2,"explanation":"A classificação crescente ordena os textos alfabeticamente."},{"type":"number","skill":"Conferência","prompt":"O estoque inicial é 50. Houve entrada de 18 e saída de 23 unidades. Informe o saldo final.","correct":45,"explanation":"50 + 18 − 23 = 45."}],"version":1}$exam$::jsonb j) source on conflict(topic) do update set title=excluded.title,description=excluded.description,icon=excluded.icon,version=excluded.version,minutes=excluded.minutes,questions=excluded.questions;
insert into private.em_professional_catalog(topic,title,description,icon,version,minutes,questions) select j->>'topic',j->>'title',j->>'description',j->>'icon',(j->>'version')::integer,(j->>'minutes')::integer,j->'questions' from (select $exam${"topic":"atendimento","title":"Atendimento ao cliente","description":"Escuta, solução de problemas e acompanhamento.","icon":"message","minutes":12,"questions":[{"type":"choice","skill":"Escuta","prompt":"O cliente informa que recebeu um item diferente. Qual deve ser a primeira resposta?","options":["Afirmar que isso não acontece.","Confirmar o relato e solicitar os dados necessários para verificar o pedido.","Encerrar e pedir que compre novamente."],"correct":1,"explanation":"Primeiro é necessário entender e conferir o ocorrido."},{"type":"choice","skill":"Precisão","prompt":"Você não sabe responder a uma dúvida sobre o produto. O que fazer?","options":["Consultar uma fonte confiável e combinar o retorno.","Inventar uma resposta plausível.","Ignorar a mensagem."],"correct":0,"explanation":"Uma resposta verificada evita transmitir uma informação incorreta."},{"type":"choice","skill":"Responsabilidade","prompt":"A solução solicitada depende da autorização de outra equipe. Como agir?","options":["Prometer sem consultar.","Dizer que não é seu problema.","Explicar o limite, encaminhar e acompanhar o retorno."],"correct":2,"explanation":"O encaminhamento deve ter continuidade e uma previsão honesta."},{"type":"choice","skill":"Prioridade","prompt":"Uma falha impede vários clientes de concluir uma compra. Qual conduta faz sentido?","options":["Tratar como uma dúvida comum sem avisar a equipe.","Comunicar a falha e priorizar o incidente pelo impacto.","Pedir aos clientes que tentem indefinidamente."],"correct":1,"explanation":"O impacto coletivo justifica a priorização do incidente."},{"type":"choice","skill":"Confirmação","prompt":"Como encerrar um atendimento resolvido?","options":["Confirmar a solução e informar os próximos passos, quando houver.","Finalizar sem perguntar nada.","Oferecer uma promessa adicional que não foi autorizada."],"correct":0,"explanation":"A confirmação reduz dúvidas sobre o resultado do atendimento."},{"type":"choice","skill":"Registro","prompt":"Que informação ajuda a equipe em um próximo contato?","options":["Uma opinião pessoal sobre o cliente.","Somente o primeiro nome.","Problema relatado, providências, protocolo e retorno combinado."],"correct":2,"explanation":"O registro útil descreve fatos e o acompanhamento."},{"type":"choice","skill":"Expectativas","prompt":"A investigação ainda não foi concluída no horário combinado. O que fazer?","options":["Não enviar nenhuma atualização.","Informar o andamento e combinar uma nova previsão realista.","Marcar como resolvido sem confirmar."],"correct":1,"explanation":"O cliente precisa receber a atualização mesmo antes da solução final."},{"type":"open","skill":"Resposta ao cliente","prompt":"Um cliente escreveu: “Meu pedido deveria ter chegado ontem e ninguém me informa nada”. Redija uma resposta inicial que reconheça a situação, peça os dados necessários e explique o próximo passo.","rubric":["Reconhecer o problema com respeito","Solicitar apenas os dados necessários","Explicar uma verificação e um retorno viáveis"]}],"version":1}$exam$::jsonb j) source on conflict(topic) do update set title=excluded.title,description=excluded.description,icon=excluded.icon,version=excluded.version,minutes=excluded.minutes,questions=excluded.questions;
insert into private.em_professional_catalog(topic,title,description,icon,version,minutes,questions) select j->>'topic',j->>'title',j->>'description',j->>'icon',(j->>'version')::integer,(j->>'minutes')::integer,j->'questions' from (select $exam${"topic":"administrativo","title":"Rotinas administrativas","description":"Documentos, prioridades e conferência de informações.","icon":"briefcase","minutes":12,"questions":[{"type":"choice","skill":"Conferência","prompt":"Uma nota apresenta valor diferente do pedido aprovado. Qual é a conduta adequada?","options":["Autorizar e corrigir depois.","Suspender o encaminhamento e conferir a divergência com os responsáveis.","Alterar o valor aprovado sem avisar."],"correct":1,"explanation":"A divergência precisa ser esclarecida antes de prosseguir."},{"type":"choice","skill":"Prioridade","prompt":"Você tem uma obrigação com vencimento hoje e uma tarefa interna sem prazo imediato. O que considerar primeiro?","options":["Urgência, impacto e dependências da obrigação com vencimento.","A tarefa mais fácil, sempre.","A tarefa recebida por último, sempre."],"correct":0,"explanation":"A prioridade depende de prazo, impacto e dependências."},{"type":"choice","skill":"Organização","prompt":"Qual nome de arquivo facilita localizar um contrato?","options":["Documento_final_novo2.pdf","Arquivo.pdf","2026-11_Contrato_Fornecedor-Alfa.pdf"],"correct":2,"explanation":"Data, tipo e identificação tornam o arquivo localizável."},{"type":"number","skill":"Conferência numérica","prompt":"Foram registrados pagamentos de R$ 120, R$ 85 e R$ 95. Qual é o total?","correct":300,"explanation":"120 + 85 + 95 = 300."},{"type":"choice","skill":"Agenda","prompt":"Duas reuniões foram agendadas para o mesmo horário com participantes essenciais em comum. Como agir?","options":["Manter as duas e aguardar.","Confirmar as prioridades e negociar um novo horário com os envolvidos.","Cancelar uma sem avisar."],"correct":1,"explanation":"O conflito deve ser resolvido e comunicado aos participantes."},{"type":"choice","skill":"Documentação","prompt":"Um documento obrigatório está faltando em um cadastro. O que registrar?","options":["A pendência, quem deve enviar e o prazo de acompanhamento.","Que está completo, para liberar a fila.","Uma informação inventada."],"correct":0,"explanation":"Uma pendência rastreável permite acompanhar a regularização."},{"type":"choice","skill":"Precisão","prompt":"Ao copiar dados de um pedido para uma planilha, qual conferência reduz erros?","options":["Somente revisar a cor da planilha.","Apenas contar as linhas.","Comparar identificador, valores e quantidades com a origem."],"correct":2,"explanation":"Os dados essenciais devem ser conferidos com o documento de origem."},{"type":"open","skill":"Planejamento","prompt":"Você precisa conferir um pedido com divergência, organizar documentos para amanhã e enviar uma confirmação de reunião hoje. Explique sua ordem de execução e como acompanharia as pendências.","rubric":["Justificar as prioridades por prazo e impacto","Indicar responsáveis ou dependências","Definir como acompanhar a conclusão"]}],"version":1}$exam$::jsonb j) source on conflict(topic) do update set title=excluded.title,description=excluded.description,icon=excluded.icon,version=excluded.version,minutes=excluded.minutes,questions=excluded.questions;
insert into private.em_professional_catalog(topic,title,description,icon,version,minutes,questions) select j->>'topic',j->>'title',j->>'description',j->>'icon',(j->>'version')::integer,(j->>'minutes')::integer,j->'questions' from (select $exam${"topic":"vendas","title":"Vendas e negociação","description":"Necessidades do cliente, proposta e objeções.","icon":"target","minutes":12,"questions":[{"type":"choice","skill":"Diagnóstico","prompt":"Antes de recomendar um produto, qual informação é mais útil?","options":["A necessidade, o uso esperado e as restrições do cliente.","Somente o produto mais caro.","Uma conclusão sem ouvir o cliente."],"correct":0,"explanation":"Uma recomendação deve considerar a necessidade apresentada."},{"type":"choice","skill":"Objeções","prompt":"O cliente diz: “Está caro”. Qual resposta ajuda a entender a objeção?","options":["Oferecer qualquer desconto imediatamente.","Perguntar com o que ele compara e quais benefícios são importantes.","Afirmar que ele não entende o produto."],"correct":1,"explanation":"Entender a comparação permite discutir valor e alternativas."},{"type":"number","skill":"Desconto","prompt":"Um produto custa R$ 180 e o desconto autorizado é 10%. Qual é o preço final?","correct":162,"explanation":"10% de 180 é 18. O preço final é 162."},{"type":"choice","skill":"Transparência","prompt":"O produto não possui um recurso solicitado pelo cliente. O que fazer?","options":["Afirmar que possui para fechar.","Omitir a informação.","Explicar a limitação e oferecer uma alternativa adequada."],"correct":2,"explanation":"A proposta deve corresponder ao que pode ser entregue."},{"type":"choice","skill":"Proposta","prompt":"Qual conjunto de informações deve estar claro em uma proposta?","options":["Produto, preço, condições, prazo e validade da oferta.","Somente o total.","Somente a foto do produto."],"correct":0,"explanation":"As condições essenciais devem estar disponíveis para decisão."},{"type":"choice","skill":"Acompanhamento","prompt":"O cliente pediu tempo para decidir. Qual abordagem respeita esse momento?","options":["Enviar mensagens insistentes sem combinar.","Combinar uma data e um canal para retomar a conversa.","Registrar a venda como concluída."],"correct":1,"explanation":"O acompanhamento deve ser combinado e respeitoso."},{"type":"number","skill":"Quantidades","prompt":"O cliente precisa de 12 unidades a R$ 25 cada, sem desconto. Qual é o valor total?","correct":300,"explanation":"12 × 25 = 300."},{"type":"open","skill":"Negociação","prompt":"O cliente precisa receber em três dias, mas o prazo disponível é de cinco dias. Escreva como apresentaria a situação e buscaria uma alternativa sem prometer o que não pode cumprir.","rubric":["Explicar o prazo disponível","Investigar uma alternativa possível","Confirmar as condições antes de fechar"]}],"version":1}$exam$::jsonb j) source on conflict(topic) do update set title=excluded.title,description=excluded.description,icon=excluded.icon,version=excluded.version,minutes=excluded.minutes,questions=excluded.questions;
insert into private.em_professional_catalog(topic,title,description,icon,version,minutes,questions) select j->>'topic',j->>'title',j->>'description',j->>'icon',(j->>'version')::integer,(j->>'minutes')::integer,j->'questions' from (select $exam${"topic":"ecommerce","title":"E-commerce e pedidos","description":"Cadastro de produtos, estoque e acompanhamento de pedidos.","icon":"cart","minutes":15,"questions":[{"type":"choice","skill":"Cadastro","prompt":"Qual informação evita confusão entre dois tamanhos de um mesmo produto?","options":["Um único SKU para tudo, sem variação.","SKU e atributos consistentes para cada variação.","Apenas mudar a cor da foto."],"correct":1,"explanation":"A identificação das variações precisa ser consistente."},{"type":"number","skill":"Estoque","prompt":"O estoque físico é 20. Há 4 unidades reservadas em pedidos e 3 indisponíveis por avaria. Quantas unidades podem ser oferecidas?","correct":13,"explanation":"20 − 4 − 3 = 13 unidades disponíveis."},{"type":"choice","skill":"Pedidos","prompt":"Um pedido foi pago, mas o endereço está incompleto. Qual é o próximo passo?","options":["Confirmar o dado faltante antes de despachar.","Inventar o complemento.","Despachar para qualquer endereço anterior."],"correct":0,"explanation":"O endereço precisa ser validado antes da expedição."},{"type":"choice","skill":"Preço","prompt":"Você identificou preço diferente entre o anúncio e a tabela aprovada. Como agir?","options":["Ignorar até alguém reclamar.","Alterar outros anúncios sem conferir.","Verificar a origem da divergência e corrigir conforme a orientação responsável."],"correct":2,"explanation":"A correção deve ter uma fonte e um responsável identificados."},{"type":"number","skill":"Conferência","prompt":"Um pedido tem 3 itens de R$ 40 e frete de R$ 18. Sem desconto, qual é o total?","correct":138,"explanation":"3 × 40 + 18 = 138."},{"type":"choice","skill":"Expedição","prompt":"Antes de embalar um pedido, o que deve ser comparado com a separação física?","options":["Somente o número de volumes.","SKU, quantidade e variação de cada item.","A popularidade do produto."],"correct":1,"explanation":"A conferência precisa identificar o item e a quantidade corretos."},{"type":"choice","skill":"Acompanhamento","prompt":"O rastreio apresenta uma ocorrência de entrega. O que fazer?","options":["Investigar com o transportador e atualizar o cliente com informação verificada.","Informar que foi entregue sem conferir.","Encerrar o pedido automaticamente."],"correct":0,"explanation":"Uma ocorrência exige verificação e comunicação do andamento."},{"type":"open","skill":"Resolução de problema","prompt":"Você descobriu que o último item vendido ficou indisponível no estoque. Explique as providências internas e a comunicação que enviaria ao cliente antes de definir uma solução.","rubric":["Conferir e corrigir o saldo","Buscar alternativas autorizadas","Comunicar opções verificadas ao cliente"]}],"version":1}$exam$::jsonb j) source on conflict(topic) do update set title=excluded.title,description=excluded.description,icon=excluded.icon,version=excluded.version,minutes=excluded.minutes,questions=excluded.questions;
