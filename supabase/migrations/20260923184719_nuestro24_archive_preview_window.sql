create or replace function public.obtener_nuestro24_assets(p_event_date date default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  c private.nuestro24_settings%rowtype;
  actor uuid := auth.uid();
  today date := (now() at time zone 'Europe/Madrid')::date;
  current_edition date := make_date(extract(year from today)::int, extract(month from today)::int, 24);
  requested date;
  release_at timestamptz;
  archive_at timestamptz;
  archive_ready boolean := false;
  allowed boolean := false;
  result jsonb;
begin
  select * into c from private.nuestro24_settings where singleton;

  if not found or actor is null or actor not in (c.javi_id,c.laura_id) then
    raise exception 'Unauthorized' using errcode='42501';
  end if;

  requested := coalesce(p_event_date,current_edition);

  if requested < c.first_event
     or extract(day from requested) <> 24
     or requested > current_edition then
    raise exception 'Invalid edition date' using errcode='22023';
  end if;

  release_at := requested::timestamp at time zone 'Europe/Madrid';
  archive_at := (requested + 1)::timestamp at time zone 'Europe/Madrid';

  if requested < current_edition or today > requested then
    select exists(
      select 1
      from public.recuerdos_app
      where nuestro24_fecha = requested
    ) into archive_ready;

    allowed := archive_ready and now() >= archive_at;
  else
    allowed := (
      actor = c.javi_id
      and today >= requested - 1
      and today <= requested
    ) or (
      actor = c.laura_id
      and c.enabled
      and now() >= release_at
    );
  end if;

  if not allowed then
    return jsonb_build_object(
      'allowed',false,
      'event_date',requested,
      'assets',jsonb_build_object()
    );
  end if;

  select jsonb_object_agg(
    asset_key,
    'data:' || mime_type || ';base64,' || content_base64
  )
  into result
  from private.nuestro24_assets
  where edition_date = requested
    and content_base64 <> '';

  return jsonb_build_object(
    'allowed',true,
    'event_date',requested,
    'assets',coalesce(result,'{}'::jsonb)
  );
end;
$function$;

revoke all on function public.obtener_nuestro24_assets(date) from public, anon;
grant execute on function public.obtener_nuestro24_assets(date) to authenticated, service_role;

create or replace function public.obtener_nuestro24(p_event_date date default null)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $function$
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

  result := jsonb_build_object(
    'server_now', now(),
    'next_check_at', next_check,
    'show_hero', false,
    'preview', false,
    'event', null
  );

  if requested < c.first_event then
    return result;
  end if;

  if extract(day from requested) <> 24 or requested > current_edition then
    raise exception 'Invalid edition date' using errcode = '22023';
  end if;

  release_at := requested::timestamp at time zone 'Europe/Madrid';
  end_at := (requested + 1)::timestamp at time zone 'Europe/Madrid';

  preview := actor = c.javi_id
    and requested = current_edition
    and today >= requested - 1
    and today <= requested
    and (now() < release_at or not c.enabled);

  if not preview
     and requested = current_edition
     and today <= requested
     and (not c.enabled or now() < release_at) then
    return result;
  end if;

  select contenido::jsonb
  into payload
  from public.recuerdos_app
  where nuestro24_fecha = requested;

  if payload is null
     and requested = current_edition
     and today <= requested then
    payload := private.nuestro24_snapshot(requested);

    preview := actor = c.javi_id
      and today >= requested - 1
      and (now() < release_at or not c.enabled);
  end if;

  if payload is null then
    return result;
  end if;

  show_hero := requested = current_edition
    and today <= requested
    and (
      (
        actor = c.javi_id
        and today >= requested - 1
      )
      or (
        c.enabled
        and now() >= release_at
      )
    );

  return result || jsonb_build_object(
    'show_hero',show_hero,
    'preview',preview,
    'event',payload,
    'expires_at',end_at
  );
end;
$function$;

revoke all on function public.obtener_nuestro24(date) from public, anon;
grant execute on function public.obtener_nuestro24(date) to authenticated, service_role;

notify pgrst, 'reload schema';
