-- JaviEats 3.3.6
-- Índices para claves foráneas sin índice con la FK como prefijo.
-- Objetivo: evitar scans innecesarios en joins, cascadas y comprobaciones de integridad.

begin;

create index if not exists marcas_mensajes_javi_marked_by_idx
  on public.marcas_mensajes_javi (marked_by);

create index if not exists mensajes_dia_autor_id_idx
  on public.mensajes_dia (autor_id);

create index if not exists mensajes_laura_author_id_idx
  on public.mensajes_laura (author_id);

create index if not exists notificaciones_actor_id_idx
  on public.notificaciones (actor_id);

create index if not exists propuestas_created_by_idx
  on public.propuestas (created_by);

create index if not exists recuerdos_app_created_by_idx
  on public.recuerdos_app (created_by);

create index if not exists respuestas_diarias_pregunta_id_idx
  on public.respuestas_diarias (pregunta_id);

create index if not exists y_si_notificaciones_destinatario_id_idx
  on public.y_si_notificaciones (destinatario_id);

create index if not exists y_si_notificaciones_remitente_id_idx
  on public.y_si_notificaciones (remitente_id);

create index if not exists y_si_respuestas_user_id_idx
  on public.y_si_respuestas (user_id);

commit;
