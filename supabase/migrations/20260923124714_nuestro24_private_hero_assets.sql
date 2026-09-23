create table if not exists private.nuestro24_assets (
  asset_key text primary key check (asset_key ~ '^[a-z0-9-]+$'),
  mime_type text not null default 'image/webp',
  content_base64 text not null default '',
  updated_at timestamptz not null default now(),
  check (char_length(content_base64) <= 1000000)
);

alter table private.nuestro24_assets enable row level security;
revoke all on private.nuestro24_assets from public, anon, authenticated;

insert into private.nuestro24_assets(asset_key,mime_type,content_base64)
values
  ('ramo-izquierda','image/webp',''),
  ('ramo-derecha','image/webp','')
on conflict (asset_key) do update
set mime_type = excluded.mime_type,
    content_base64 = '',
    updated_at = now();

create or replace function public.obtener_nuestro24_assets()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  c private.nuestro24_settings%rowtype;
  actor uuid := auth.uid();
  today date := (now() at time zone 'Europe/Madrid')::date;
  current_edition date := make_date(extract(year from today)::int, extract(month from today)::int, 24);
  release_at timestamptz := current_edition::timestamp at time zone 'Europe/Madrid';
  allowed boolean := false;
  result jsonb;
begin
  select * into c from private.nuestro24_settings where singleton;
  if not found or actor is null or actor not in (c.javi_id,c.laura_id) then
    raise exception 'Unauthorized' using errcode='42501';
  end if;
  allowed := actor = c.javi_id or (actor = c.laura_id and c.enabled and now() >= release_at);
  if not allowed then
    return jsonb_build_object('allowed',false,'assets',jsonb_build_object());
  end if;
  select jsonb_object_agg(asset_key,'data:' || mime_type || ';base64,' || content_base64)
  into result
  from private.nuestro24_assets
  where content_base64 <> '';
  return jsonb_build_object('allowed',true,'assets',coalesce(result,'{}'::jsonb));
end;
$$;

revoke all on function public.obtener_nuestro24_assets() from public, anon;
grant execute on function public.obtener_nuestro24_assets() to authenticated;
notify pgrst, 'reload schema';
