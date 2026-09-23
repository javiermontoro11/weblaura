
alter table private.nuestro24_moments
  add column if not exists asset_key text;

alter table private.nuestro24_moments
  drop constraint if exists nuestro24_moments_asset_key_check;

alter table private.nuestro24_moments
  add constraint nuestro24_moments_asset_key_check
  check (asset_key is null or asset_key ~ '^[a-z0-9-]+$');

insert into private.nuestro24_assets(asset_key,mime_type,content_base64)
values
  ('moment-2026-09-12-cooking','image/webp',''),
  ('moment-2026-09-16-sunset','image/webp',''),
  ('moment-2026-09-19-laura','image/webp',''),
  ('moment-2026-09-20-dogs','image/webp','')
on conflict (asset_key) do update
set mime_type=excluded.mime_type,
    updated_at=now();

update private.nuestro24_moments
set asset_key='moment-2026-09-12-cooking',
    title='Nuestra Vida y modo cocinitas',
    body='Nuestra Vida se estrenó en JaviEats como una experiencia propia dentro de la aplicación. Y ese día también nos pusimos modo cocinitas juntos.'
where edition_date=date '2026-09-24'
  and moment_date=date '2026-09-12';

update private.nuestro24_moments
set asset_key='moment-2026-09-16-sunset'
where edition_date=date '2026-09-24'
  and moment_date=date '2026-09-16';

update private.nuestro24_moments
set asset_key='moment-2026-09-19-laura'
where edition_date=date '2026-09-24'
  and moment_date=date '2026-09-19';

update private.nuestro24_moments
set asset_key='moment-2026-09-20-dogs'
where edition_date=date '2026-09-24'
  and moment_date=date '2026-09-20';

create or replace function private.nuestro24_snapshot(p_day date)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  c private.nuestro24_settings%rowtype;
  lower_day date := (p_day - interval '1 month')::date;
  lower_at timestamptz := lower_day::timestamp at time zone 'Europe/Madrid';
  upper_at timestamptz := p_day::timestamp at time zone 'Europe/Madrid';
  memory_count bigint;
  plan_count bigint;
  question_count bigint;
  selected_memories jsonb;
  selected_plans jsonb;
  curated_moments jsonb;
  fallback_moments jsonb;
  month_count integer;
  result jsonb;
begin
  select * into strict c from private.nuestro24_settings where singleton;

  if p_day is null or extract(day from p_day) <> 24 or p_day < c.first_event then
    raise exception 'Invalid edition date' using errcode = '22023';
  end if;

  month_count := (extract(year from p_day)::int - extract(year from c.relationship_date)::int) * 12
    + extract(month from p_day)::int - extract(month from c.relationship_date)::int;

  select count(*) into memory_count
  from public.recuerdos_app
  where nuestro24_fecha is null
    and fecha >= lower_day
    and fecha < p_day
    and created_at < upper_at;

  select count(*) into plan_count
  from public.propuestas
  where plan_date >= lower_day
    and plan_date <= p_day
    and status in ('confirmada','realizada');

  select count(*) into question_count
  from public.y_si_dias d
  where d.cerrada_at >= lower_at
    and d.cerrada_at < upper_at
    and exists (
      select 1 from public.y_si_respuestas r
      where r.dia_id = d.id and r.user_id = c.javi_id
    )
    and exists (
      select 1 from public.y_si_respuestas r
      where r.dia_id = d.id and r.user_id = c.laura_id
    );

  select coalesce(
    jsonb_agg(jsonb_build_object(
      'id', m.id,
      'title', m.titulo,
      'date', m.fecha,
      'description', m.descripcion,
      'photo_path', coalesce(m.image_paths[m.cover_index + 1], m.image_paths[1]),
      'type', m.tipo,
      'kind', 'memory'
    ) order by cardinality(m.image_paths) > 0 desc, m.fecha desc, m.id),
    '[]'::jsonb
  )
  into selected_memories
  from (
    select id, titulo, fecha, descripcion, image_paths, cover_index, tipo
    from public.recuerdos_app
    where nuestro24_fecha is null
      and fecha >= lower_day
      and fecha < p_day
      and created_at < upper_at
    order by cardinality(image_paths) > 0 desc, fecha desc, id
    limit 4
  ) m;

  select coalesce(
    jsonb_agg(jsonb_build_object(
      'id', p.id,
      'title', p.service_title,
      'date', p.plan_date,
      'time', p.plan_time,
      'description', p.note,
      'icon', p.service_icon,
      'status', p.status,
      'entry_type', p.entry_type,
      'kind', 'plan'
    ) order by p.plan_date desc, p.plan_time desc nulls last, p.id),
    '[]'::jsonb
  )
  into selected_plans
  from (
    select id, service_title, plan_date, plan_time, note, service_icon, status, entry_type
    from public.propuestas
    where plan_date >= lower_day
      and plan_date <= p_day
      and status in ('confirmada','realizada')
    order by plan_date desc, plan_time desc nulls last, created_at desc
    limit 4
  ) p;

  select coalesce(
    jsonb_agg(jsonb_build_object(
      'id', nm.id,
      'date', nm.moment_date,
      'kind', nm.kind,
      'visual', nm.visual_key,
      'eyebrow', nm.eyebrow,
      'title', nm.title,
      'description', nm.body,
      'source_type', nm.source_type,
      'source_id', nm.source_id,
      'photo_path', nm.photo_path,
      'asset_key', nm.asset_key
    ) order by nm.sort_order, nm.id),
    '[]'::jsonb
  )
  into curated_moments
  from private.nuestro24_moments nm
  where nm.edition_date = p_day;

  if jsonb_array_length(curated_moments) = 0 then
    select coalesce(jsonb_agg(item order by item->>'date'), '[]'::jsonb)
    into fallback_moments
    from (
      select item
      from jsonb_array_elements(selected_memories || selected_plans) as q(item)
      order by item->>'date' desc
      limit 6
    ) fallback;
  else
    fallback_moments := curated_moments;
  end if;

  result := jsonb_build_object(
    'schema', 'javieats-memory-v1',
    'kind', 'nuestro24',
    'version', 4,
    'actionLabel', 'Volver a nuestro mes',
    'event_date', p_day,
    'months', month_count,
    'period_start', lower_day,
    'period_end', p_day,
    'period_start_at', lower_at,
    'period_end_at', upper_at,
    'captured_at', now(),
    'hero_path', c.hero_path,
    'metrics', jsonb_build_array(
      jsonb_build_object('key','memories','value',memory_count,'label','Recuerdos guardados'),
      jsonb_build_object('key','plans','value',plan_count,'label','Planes confirmados'),
      jsonb_build_object('key','questions','value',question_count,'label','Preguntas entre los dos')
    ),
    'memories', selected_memories,
    'plans', selected_plans,
    'moments', fallback_moments,
    'letter_markdown', case when c.letter_month = p_day then c.letter_markdown else '' end
  );

  if char_length(result::text) > 30000 then
    raise exception 'Monthly snapshot exceeds the existing Memories limit';
  end if;

  return result;
end;
$$;

revoke all on function private.nuestro24_snapshot(date) from public, anon, authenticated;
notify pgrst, 'reload schema';
