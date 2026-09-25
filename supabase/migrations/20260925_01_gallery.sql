create table if not exists public.galeria_app (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null default auth.uid(),
  fecha date not null default ((now() at time zone 'Europe/Madrid')::date),
  descripcion text not null default '',
  image_path text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint galeria_app_description_length check (char_length(descripcion) <= 1000),
  constraint galeria_app_gallery_path check (image_path like 'gallery/%')
);

create index if not exists galeria_app_fecha_created_at_idx
  on public.galeria_app (fecha desc, created_at desc);

alter table public.galeria_app enable row level security;

revoke all on table public.galeria_app from anon;
revoke all on table public.galeria_app from authenticated;
grant select, insert, delete on table public.galeria_app to authenticated;
grant update (fecha, descripcion, updated_at) on table public.galeria_app to authenticated;

create or replace function private.galeria_usuario_permitido()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from private.nuestro24_settings s
    where s.singleton
      and auth.uid() is not null
      and auth.uid() in (s.javi_id, s.laura_id)
  );
$$;

revoke all on function private.galeria_usuario_permitido() from public;
grant usage on schema private to authenticated;
grant execute on function private.galeria_usuario_permitido() to authenticated;

drop policy if exists galeria_app_select_javi_laura on public.galeria_app;
create policy galeria_app_select_javi_laura
on public.galeria_app for select to authenticated
using (private.galeria_usuario_permitido());

drop policy if exists galeria_app_insert_javi_laura on public.galeria_app;
create policy galeria_app_insert_javi_laura
on public.galeria_app for insert to authenticated
with check (
  private.galeria_usuario_permitido()
  and created_by = (select auth.uid())
);

drop policy if exists galeria_app_update_javi_laura on public.galeria_app;
create policy galeria_app_update_javi_laura
on public.galeria_app for update to authenticated
using (private.galeria_usuario_permitido())
with check (private.galeria_usuario_permitido());

drop policy if exists galeria_app_delete_javi_laura on public.galeria_app;
create policy galeria_app_delete_javi_laura
on public.galeria_app for delete to authenticated
using (private.galeria_usuario_permitido());
