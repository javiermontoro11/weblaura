-- Nuestro 24. Private content is seeded separately, never in source control.
-- Additive migration; release and notification remain disabled until preview approval.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table private.nuestro24_settings (
  singleton boolean primary key default true check (singleton),
  enabled boolean not null default false,
  relationship_date date not null default date '2026-04-24',
  first_event date not null default date '2026-09-24',
  javi_id uuid not null references auth.users(id),
  laura_id uuid not null references auth.users(id),
  hero_path text not null,
  letter_month date,
  letter_markdown text not null default '' check (char_length(letter_markdown) <= 12000),
  notification_month date,
  notification_title text not null default '' check (char_length(notification_title) <= 180),
  notification_body text not null default '' check (char_length(notification_body) <= 500),
  notification_armed boolean not null default false,
  notification_enqueued_at timestamptz,
  check (javi_id <> laura_id),
  check (extract(day from relationship_date) = 24 and extract(day from first_event) = 24),
  check (letter_month is null or extract(day from letter_month) = 24),
  check (notification_month is null or extract(day from notification_month) = 24)
);
alter table private.nuestro24_settings enable row level security;
revoke all on private.nuestro24_settings from public, anon, authenticated;

alter table public.recuerdos_app add column nuestro24_fecha date;
alter table public.recuerdos_app add constraint recuerdos_app_nuestro24_ck check (
  nuestro24_fecha is null or (
    extract(day from nuestro24_fecha) = 24 and tipo = 'letter'
    and legacy_key is not null and legacy_key = 'nuestro24:' || to_char(nuestro24_fecha, 'YYYY-MM')
  )
);
create unique index recuerdos_app_nuestro24_unique on public.recuerdos_app(nuestro24_fecha)
where nuestro24_fecha is not null;

-- The ordinary Memories query only sees archived editions from the 25th.
-- Javi's advance view and both profiles' day-24 view use the checked RPC instead.
create policy nuestro24_archive_visibility on public.recuerdos_app
as restrictive for select to authenticated
using (nuestro24_fecha is null or now() >= ((nuestro24_fecha + 1)::timestamp at time zone 'Europe/Madrid'));
create policy nuestro24_archive_insert on public.recuerdos_app
as restrictive for insert to authenticated with check (nuestro24_fecha is null and coalesce(legacy_key,'') not like 'nuestro24:%');
create policy nuestro24_archive_update on public.recuerdos_app
as restrictive for update to authenticated
using (nuestro24_fecha is null) with check (nuestro24_fecha is null and coalesce(legacy_key,'') not like 'nuestro24:%');
create policy nuestro24_archive_delete on public.recuerdos_app
as restrictive for delete to authenticated using (nuestro24_fecha is null);

-- Preserve the existing notification trigger/function for all ordinary memories.
create or replace trigger recuerdos_app_notificacion
  after insert on public.recuerdos_app for each row
  when (new.nuestro24_fecha is null)
  execute function public.notificar_recuerdo_nuevo();

create or replace function private.nuestro24_snapshot(p_day date)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  c private.nuestro24_settings%rowtype;
  lower_day date := (p_day - interval '1 month')::date;
  lower_at timestamptz := lower_day::timestamp at time zone 'Europe/Madrid';
  upper_at timestamptz := p_day::timestamp at time zone 'Europe/Madrid';
  memory_count bigint;
  plan_count bigint;
  question_count bigint;
  selected jsonb;
  month_count integer;
  result jsonb;
begin
  select * into strict c from private.nuestro24_settings where singleton;
  if p_day is null or extract(day from p_day) <> 24 or p_day < c.first_event then
    raise exception 'Invalid edition date' using errcode = '22023';
  end if;
  month_count := (extract(year from p_day)::int - extract(year from c.relationship_date)::int) * 12
    + extract(month from p_day)::int - extract(month from c.relationship_date)::int;
  select count(*) into memory_count from public.recuerdos_app
    where nuestro24_fecha is null and fecha >= lower_day and fecha < p_day
    and created_at < upper_at;
  select count(*) into plan_count from public.propuestas
    where created_at >= lower_at and created_at < upper_at;
  select count(*) into question_count from public.y_si_dias d
    where d.cerrada_at >= lower_at and d.cerrada_at < upper_at
    and exists (select 1 from public.y_si_respuestas r where r.dia_id = d.id and r.user_id = c.javi_id)
    and exists (select 1 from public.y_si_respuestas r where r.dia_id = d.id and r.user_id = c.laura_id);
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', m.id, 'title', m.titulo, 'date', m.fecha, 'description', m.descripcion,
    'photo_path', coalesce(m.image_paths[m.cover_index + 1], m.image_paths[1]),
    'type', m.tipo
  ) order by cardinality(m.image_paths) > 0 desc, m.fecha desc, m.id), '[]'::jsonb)
  into selected from (
    select id, titulo, fecha, descripcion, image_paths, cover_index, tipo
    from public.recuerdos_app where nuestro24_fecha is null
      and fecha >= lower_day and fecha < p_day and created_at < upper_at
    order by cardinality(image_paths) > 0 desc, fecha desc, id limit 4
  ) m;
  result := jsonb_build_object(
    'schema', 'javieats-memory-v1', 'kind', 'nuestro24', 'version', 1,
    'actionLabel', 'Volver a nuestro mes',
    'event_date', p_day, 'months', month_count,
    'period_start', lower_day, 'period_end', p_day,
    'period_start_at', lower_at, 'period_end_at', upper_at,
    'captured_at', now(), 'hero_path', c.hero_path,
    'metrics', jsonb_build_array(
      jsonb_build_object('key','memories','value',memory_count,'label','Recuerdos de este mes'),
      jsonb_build_object('key','plans','value',plan_count,'label','Planes propuestos'),
      jsonb_build_object('key','questions','value',question_count,'label','Preguntas entre los dos')
    ),
    'memories', selected,
    'letter_markdown', case when c.letter_month = p_day then c.letter_markdown else '' end
  );
  if char_length(result::text) > 30000 then
    raise exception 'Monthly snapshot exceeds the existing Memories limit';
  end if;
  return result;
end;
$$;
revoke all on function private.nuestro24_snapshot(date) from public, anon, authenticated;

-- Small policy helper. It cannot disclose paths or the private configuration.
create or replace function public.nuestro24_foto_protegida(p_path text)
returns boolean language plpgsql stable security definer set search_path = '' as $$
declare c private.nuestro24_settings%rowtype;
begin
  select * into c from private.nuestro24_settings where singleton;
  if not found then return false; end if;
  if auth.uid() is null or auth.uid() not in (c.javi_id, c.laura_id) then return true; end if;
  return p_path = c.hero_path or exists (
    select 1 from public.recuerdos_app
    where nuestro24_fecha is not null and p_path = any(image_paths)
  );
end;
$$;
revoke all on function public.nuestro24_foto_protegida(text) from public, anon;
grant execute on function public.nuestro24_foto_protegida(text) to authenticated;
create policy nuestro24_keep_photos_delete on storage.objects
as restrictive for delete to authenticated
using (bucket_id <> 'recuerdos' or not public.nuestro24_foto_protegida(name));
create policy nuestro24_keep_photos_update on storage.objects
as restrictive for update to authenticated
using (bucket_id <> 'recuerdos' or not public.nuestro24_foto_protegida(name))
with check (bucket_id <> 'recuerdos' or not public.nuestro24_foto_protegida(name));

create or replace function public.obtener_nuestro24(p_event_date date default null)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  c private.nuestro24_settings%rowtype;
  actor uuid := auth.uid();
  today date := (now() at time zone 'Europe/Madrid')::date;
  current_edition date;
  requested date;
  release_at timestamptz;
  end_at timestamptz;
  next_check timestamptz;
  result jsonb;
  payload jsonb;
  preview boolean := false;
  show_hero boolean := false;
begin
  select * into c from private.nuestro24_settings where singleton;
  if not found or actor is null or actor not in (c.javi_id,c.laura_id) then
    raise exception 'Unauthorized' using errcode = '42501';
  end if;
  current_edition := make_date(extract(year from today)::int, extract(month from today)::int, 24);
  requested := coalesce(p_event_date, current_edition);
  next_check := (today + 1)::timestamp at time zone 'Europe/Madrid';
  result := jsonb_build_object('server_now', now(), 'next_check_at', next_check,
    'show_hero', false, 'preview', false, 'event', null);
  if requested < c.first_event then return result; end if;
  if extract(day from requested) <> 24 or requested > current_edition then
    raise exception 'Invalid edition date' using errcode = '22023';
  end if;
  release_at := requested::timestamp at time zone 'Europe/Madrid';
  end_at := (requested + 1)::timestamp at time zone 'Europe/Madrid';
  -- No client-provided clock or profile can authorize this call.
  preview := actor = c.javi_id and requested = current_edition
    and (now() < release_at or not c.enabled) and today <= requested;
  if not preview and (not c.enabled or now() < release_at) then return result; end if;
  select contenido::jsonb into payload from public.recuerdos_app where nuestro24_fecha = requested;
  if payload is null and requested = current_edition and today <= requested then
    payload := private.nuestro24_snapshot(requested);
    -- This fallback is read-only; it never finalizes an edition or sends notifications.
    preview := true;
  end if;
  if payload is null then return result; end if;
  show_hero := requested = current_edition and today <= requested
    and (actor = c.javi_id or (c.enabled and now() >= release_at));
  return result || jsonb_build_object('show_hero',show_hero,'preview',preview,
    'event',payload,'expires_at',end_at);
end;
$$;
revoke all on function public.obtener_nuestro24(date) from public, anon;
grant execute on function public.obtener_nuestro24(date) to authenticated;

create or replace function private.nuestro24_tick()
returns void language plpgsql security definer set search_path = '' as $$
declare
  c private.nuestro24_settings%rowtype;
  today date := (now() at time zone 'Europe/Madrid')::date;
  edition date;
  payload jsonb;
  paths text[];
  month_name text;
begin
  -- Also serializes manual calls and Cron, keeping each monthly snapshot/notice unique.
  select * into c from private.nuestro24_settings where singleton for update;
  if not found or not c.enabled then return; end if;
  edition := make_date(extract(year from today)::int,extract(month from today)::int,24);
  if today < edition or edition < c.first_event then return; end if;
  if not exists (select 1 from public.recuerdos_app where nuestro24_fecha=edition) then
    payload := private.nuestro24_snapshot(edition);
    select coalesce(array_agg(x.path order by x.rank), '{}'::text[]) into paths from (
      select path,min(rank) as rank from (
        select c.hero_path as path,0::bigint as rank
        union all
        select item->>'photo_path',ordinality
        from jsonb_array_elements(payload->'memories') with ordinality as s(item,ordinality)
      ) candidates where path is not null and path <> '' group by path
    ) x;
    month_name := (array['Enero','Febrero','Marzo','Abril','Mayo','Junio',
      'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'])[extract(month from edition)::int];
    insert into public.recuerdos_app(created_by,fecha,titulo,descripcion,tipo,contenido,
      image_paths,cover_index,legacy_key,nuestro24_fecha)
    values(c.javi_id,edition,E'Nuestro 24 \u00b7 '||month_name||' '||extract(year from edition)::int,
      (payload->>'months')||' meses juntos','letter',payload::text,paths,0,
      'nuestro24:'||to_char(edition,'YYYY-MM'),edition)
    on conflict (legacy_key) do nothing;
  end if;
  if c.notification_armed and c.notification_month=edition
    and c.notification_enqueued_at is null and today=edition
    and btrim(c.notification_title) <> '' then
    perform public.crear_notificacion(c.laura_id,c.javi_id,'nuestro24',
      c.notification_title,c.notification_body,
      'home',edition::text,'nuestro24:'||to_char(edition,'YYYY-MM')||':laura');
    update private.nuestro24_settings set notification_enqueued_at=now() where singleton;
  end if;
end;
$$;
revoke all on function private.nuestro24_tick() from public, anon, authenticated;

-- Minute resolution: release at 00:00 Europe/Madrid in both winter and summer.
-- Disabled configuration makes this job a no-op during preview validation.
create extension if not exists pg_cron with schema pg_catalog;
select cron.schedule('nuestro24-calendar','* * * * *','select private.nuestro24_tick();');
notify pgrst, 'reload schema';