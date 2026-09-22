-- JaviEats 3.3.6
-- Cierra RPC legacy de Mensaje del día que ya no usa el frontend actual.
-- Se conservan las funciones por compatibilidad/histórico, pero no quedan expuestas vía PostgREST.

begin;

revoke execute on function public.guardar_mensaje_dia(text)
  from public, anon, authenticated;

revoke execute on function public.marcar_mensaje_dia_leido(uuid)
  from public, anon, authenticated;

grant execute on function public.guardar_mensaje_dia(text)
  to service_role;

grant execute on function public.marcar_mensaje_dia_leido(uuid)
  to service_role;

commit;
