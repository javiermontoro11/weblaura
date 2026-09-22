-- JaviEats 3.3.6
-- Hardening de funciones internas SECURITY DEFINER.
-- Estas funciones no se invocan directamente desde el frontend.
-- Se revoca EXECUTE a PUBLIC/anon/authenticated y se conserva el acceso del owner/service_role.

begin;

revoke execute on function public._y_si_compatibilidad_20() from public, anon, authenticated;
revoke execute on function public._y_si_compatibilidad_historica() from public, anon, authenticated;
revoke execute on function public._y_si_saltos_permitidos() from public, anon, authenticated;

revoke execute on function public.notificar_mensaje_dia_insert() from public, anon, authenticated;
revoke execute on function public.notificar_pieza_puzzle() from public, anon, authenticated;
revoke execute on function public.notificar_propuesta() from public, anon, authenticated;
revoke execute on function public.notificar_puzzle_completado() from public, anon, authenticated;
revoke execute on function public.notificar_recuerdo_nuevo() from public, anon, authenticated;
revoke execute on function public.notificar_y_si_resultado() from public, anon, authenticated;
revoke execute on function public.trigger_mensaje_dia_email() from public, anon, authenticated;
revoke execute on function public.trigger_turno_y_si() from public, anon, authenticated;

commit;
