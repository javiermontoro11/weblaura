# CONTEXTO MAESTRO — BASE DE DATOS JAVIEATS

> **Ámbito:** exclusivamente Supabase/PostgreSQL, Storage, RLS, RPC, triggers y persistencia de JaviEats.
>
> Para la app usar `contextos/CONTEXTO_JAVIEATS.md`.
>
> Para Nuestra Vida usar `contextos/CONTEXTO_NUESTRA_VIDA.md`.
>
> **Estado de referencia:** 25 de septiembre de 2026 · JaviEats 3.4.13 en producción. Nuestra galería aplicada y verificada en Supabase; Nuestro 24 activo para la edición de septiembre.

---

# NUESTRA GALERÍA · JaviEats 3.4.10–3.4.13 · 25/09/2026

Tabla: `public.galeria_app`.

- Metadatos por foto: `id`, `created_by`, `fecha`, `descripcion`, `image_path`, `created_at`, `updated_at`.
- RLS activado; SELECT/INSERT/UPDATE/DELETE limitados a las dos cuentas autorizadas de JaviEats.
- La autorización reutiliza las identidades privadas ya mantenidas en `private.nuestro24_settings` mediante `private.galeria_usuario_permitido()`.
- INSERT exige `created_by = auth.uid()`.
- UPDATE está restringido por permisos de columna a `fecha`, `descripcion` y `updated_at`; no permite cambiar autor ni ruta.
- Índice de lectura: `(fecha DESC, created_at DESC)`.
- Bucket: reutiliza `recuerdos` (privado), bajo prefijo `gallery/`; no existe un bucket adicional.
- El frontend carga 24 filas por bloque y firma únicamente las rutas cargadas.
- Migración: `supabase/migrations/20260925_01_gallery.sql`; ejecutada y verificada el 25/09/2026.

# NUESTRO 24 · PERSISTENCIA

Aplicado el 23/09/2026.
- Estado verificado el 25/09/2026: `private.nuestro24_settings.enabled=true`, `notification_armed=true` y la notificación de septiembre ya figura encolada; las dos identidades autorizadas están configuradas.

- `private.nuestro24_settings`: configuración privada, identidades autorizadas, foto hero, carta y estado de release/aviso.
- `private.nuestro24_moments`: selección editorial por mes con fecha, orden, tipo, visual, texto y referencia opcional a Plan/Recuerdo. RLS activado y permisos directos revocados.
- `private.nuestro24_snapshot(date)`: snapshot de métricas, recuerdos, planes, momentos y carta.
- Los Planes del resumen se cuentan por `plan_date` y solo si están `confirmada` o `realizada`.
- `private.nuestro24_tick()`: crea un único archivo mensual `Nuestro 24 · Mes Año` en `public.recuerdos_app`; se vuelve visible desde el día 25.
- `public.obtener_nuestro24(date)`: RPC autenticado que controla identidad y release con hora del servidor.
- El Cron `nuestro24-calendar` es no-op mientras `enabled=false`; el aviso exige además `notification_armed=true`.
- Las fotografías usadas por el archivo mensual quedan protegidas frente al borrado normal.

---

# REGLA DE TRABAJO

Prioridad:

**ESTABILIDAD > CAMBIOS GRANDES**

Antes de modificar BD, inspeccionar siempre el estado real. No inventar tablas, columnas, RPC, policies o triggers. No documentar secretos, tokens, `service_role`, valores de Vault ni credenciales. Para perfiles usar `JAVI_USER_ID` y `LAURA_USER_ID`.

Cada cambio relevante de BD obliga a actualizar este archivo y, si cambia comportamiento de producto, también `contextos/CONTEXTO_JAVIEATS.md`.

Desde 3.3.6, todo cambio SQL nuevo debe quedar además versionado bajo `supabase/migrations/`. La existencia de un archivo de migración en GitHub **no implica que ya se haya ejecutado en Supabase**.

---

# TABLAS `public` AUDITADAS

1. `galeria_app`
2. `marcas_mensajes_javi`
3. `mensajes_dia`
4. `mensajes_laura`
5. `notificaciones`
6. `piezas_puzzle`
7. `preguntas_diarias`
8. `propuestas`
9. `push_subscriptions`
10. `puzzles_premio`
11. `recordatorios_email`
12. `recuerdos_app`
13. `respuestas_diarias`
14. `retos_diarios`
15. `rondas_reto`
16. `vales`
17. `y_si_dias`
18. `y_si_notificaciones`
19. `y_si_preguntas`
20. `y_si_respuestas`

No eliminar nada por parecer legacy sin revisar frontend, RPC, triggers y dependencias.

---

# PROPUESTAS / PLANES

Tabla principal: `public.propuestas`.

Estados: `pendiente`, `confirmada`, `realizada`, `cancelada`.

`entry_type`: `service` o `custom`.

Triggers relevantes:

- `notificar_propuesta`
- `actualizar_updated_at`
- `validar_actualizacion_propuesta_v3`

---

# RECUERDOS

Tabla: `public.recuerdos_app`.

Tipos: `gallery` y `letter`.

Bucket Storage: `recuerdos`.

Estado auditado:

- privado;
- máximo 5 MB por archivo;
- MIME permitidos: WebP, JPEG y PNG.

Triggers relevantes:

- `notificar_recuerdo_nuevo`
- `set_recuerdos_app_updated_at`
- `proteger_autor_recuerdo_v3`

## Migración de recuerdos históricos · 3.3.6

Completada y verificada el 22/09/2026.

Estado final:

- 5 recuerdos históricos migrados a `public.recuerdos_app`;
- imágenes históricas convertidas a WebP y almacenadas en el bucket privado `recuerdos`;
- cartas almacenadas en `contenido`;
- `legacy_key` UNIQUE conserva trazabilidad e impide duplicados;
- flores amarillas registradas como recuerdo remoto con metadato interno `kind=yellow-flowers`;
- no existen duplicados de `legacy_key`;
- las copias locales históricas y el migrador temporal fueron retirados de GitHub;
- Supabase es la única fuente de verdad para Recuerdos.

---

# NOTIFICACIONES / PUSH

`notificaciones` usa `dedupe_key` único y RLS orientado al destinatario.

RPC relevantes:

- `crear_notificacion(...)`
- `marcar_notificacion_leida(uuid)`
- `marcar_todas_notificaciones_leidas()`
- `eliminar_notificacion(uuid)`
- `vaciar_notificaciones()`

`push_subscriptions` almacena las suscripciones Web Push por usuario.

No extraer ni documentar cabeceras o secretos de triggers HTTP.

---

# `¿Y SI…?` — ESTADO DE DATOS

## `y_si_preguntas`

Campos clave:

- `id bigint` identity PK;
- `categoria text`;
- `pregunta text UNIQUE`;
- `opciones text[]` de 2 a 4 elementos;
- `destacada boolean`;
- `activa boolean`.

Estado verificado:

- **450 preguntas totales**;
- **431 activas**;
- **19 inactivas** por limpieza semántica.

IDs inactivos:

`27, 76, 305, 382, 386, 414, 416, 431, 434, 453, 456, 465, 466, 479, 484, 497, 503, 517, 520`.

No se borraron; solo `activa = false`.

## `y_si_dias`

Registra cada pregunta presentada.

Campos clave:

- `id uuid`;
- `fecha_inicio date`;
- `temporada integer`;
- `pregunta_id bigint`;
- `cerrada_at`;
- `posicion_dia` 1–5;
- `caducada_at`;
- `saltada_at`.

Estado comprobado durante 3.3:

- 60 registros históricos;
- 60 preguntas usadas distintas;
- 0 repeticiones históricas;
- 0 preguntas abiertas en aquella verificación;
- 374 preguntas activas disponibles en aquella verificación.

Existe:

`y_si_dias_pregunta_id_unique_global UNIQUE (pregunta_id)`

También se conserva `UNIQUE (temporada, pregunta_id)` por compatibilidad histórica.

## `y_si_respuestas`

`UNIQUE (dia_id, user_id)`.

## `y_si_notificaciones`

Estados: `pendiente`, `procesando`, `programada`, `cancelada`, `error`.

`UNIQUE (dia_id, destinatario_id)`.

---

# NO REPETICIÓN GLOBAL — IMPLEMENTADO

Regla:

> **Una pregunta presentada una vez no vuelve a salir nunca.**

La fuente de verdad es todo `public.y_si_dias`.

`public.obtener_y_si_actual()` está verificada con estas propiedades:

- excluye preguntas por `d.pregunta_id = q.id` en todo el historial;
- no filtra por temporada;
- no incrementa temporada para reciclar batería;
- el índice UNIQUE global refuerza la regla a nivel PostgreSQL.

La columna `temporada` se conserva solo por compatibilidad/histórico.

Si se agota la batería, ampliar preguntas; nunca reciclar antiguas.

---

# COMPATIBILIDAD Y CAMBIOS DE PREGUNTA — 3.3.1

Cambio aplicado y verificado el 14/09/2026.

La **Compatibilidad JaviEats** se calcula con las **últimas 20 preguntas completadas por ambos**.

Regla de ventaja compartida:

- compatibilidad `< 75%` → **1 cambio de pregunta al día**;
- compatibilidad `>= 75%` → **2 cambios de pregunta al día**;
- los cambios son **compartidos entre Javi y Laura**, no 2 por persona;
- una pregunta cambiada sigue registrada en `y_si_dias` y no puede volver a aparecer.

La lógica de backend fue modificada en `_y_si_payload(...)`/flujo de salto para comparar los cambios usados hoy con el límite permitido por compatibilidad.

Verificación posterior a la migración:

- `compatibilidad_ultimas_20 = 80`
- `cambios_diarios_permitidos = 2`
- `muestra_compatibilidad = 20`
- `cambios_usados_hoy = 1`
- `payload_actualizado = true`
- `no_repeticion_global_ok = true`

Por tanto, en ese estado concreto quedaba **1 cambio compartido adicional disponible ese día**.

La compatibilidad puede subir o bajar según entren nuevas respuestas en la ventana móvil de 20. No se resta ningún recurso ni se penaliza a la pareja: simplemente activa o desactiva la ventaja de dos cambios.

---

# RPC PRINCIPALES DE `¿Y SI…?`

- `_y_si_estado_limite(uuid)`
- `_y_si_payload(uuid, uuid)`
- `obtener_y_si_actual()`
- `obtener_y_si_historial()`
- `responder_y_si(integer)`
- `saltar_y_si_actual()`
- `notificar_y_si_resultado()`
- `trigger_turno_y_si()`

Reglas funcionales:

- máximo 5 preguntas completadas al día;
- una sola pregunta abierta globalmente;
- una respuesta por usuario y pregunta;
- el cambio solo es posible antes de respuestas;
- cambios diarios compartidos: 1 o 2 según compatibilidad;
- al responder ambos, se cierra la pregunta y se devuelve resultado + siguiente;
- se desprioriza repetir inmediatamente categoría.

---

# FUNCIONES `public` AUDITADAS

- `_y_si_estado_limite`
- `_y_si_payload`
- `actualizar_fecha_respuesta`
- `actualizar_updated_at`
- `canjear_vale`
- `crear_notificacion`
- `eliminar_notificacion`
- `guardar_mensaje_dia`
- `iniciar_reto_diario`
- `jugar_ronda_reto`
- `jugar_ronda_reto_v23`
- `marcar_mensaje_dia_leido`
- `marcar_notificacion_leida`
- `marcar_todas_notificaciones_leidas`
- `notificar_mensaje_dia_insert`
- `notificar_pieza_puzzle`
- `notificar_propuesta`
- `notificar_puzzle_completado`
- `notificar_recuerdo_nuevo`
- `notificar_y_si_resultado`
- `obtener_y_si_actual`
- `obtener_y_si_historial`
- `proteger_autor_recuerdo_v3`
- `responder_y_si`
- `saltar_y_si_actual`
- `set_mensajes_dia_updated_at`
- `set_recuerdos_app_updated_at`
- `trigger_mensaje_dia_email`
- `trigger_turno_y_si`
- `vaciar_notificaciones`
- `validar_actualizacion_propuesta_v3`

---

# EXTENSIONES AUDITADAS

- `pg_net` 0.20.4
- `pg_stat_statements` 1.11
- `pgcrypto` 1.3
- `plpgsql` 1.0
- `supabase_vault` 0.3.1
- `uuid-ossp` 1.1

---

# HARDENING 3.3.6

Auditoría realizada el 22/09/2026:

- las RPC usadas directamente por el frontend son las funcionales esperadas: `canjear_vale`, `eliminar_notificacion`, `iniciar_reto_diario`, `jugar_ronda_reto`, `marcar_notificacion_leida`, `marcar_todas_notificaciones_leidas`, `obtener_y_si_actual`, `obtener_y_si_historial`, `responder_y_si`, `saltar_y_si_actual` y `vaciar_notificaciones`;
- varias funciones internas/trigger `SECURITY DEFINER` conservan permisos heredados para `anon`/PUBLIC aunque no se invocan desde el frontend;
- se ha preparado `supabase/migrations/20260922_01_harden_internal_function_permissions.sql` para retirar esos permisos sin tocar las RPC públicas necesarias;
- se han verificado claves foráneas sin índice útil como prefijo y se ha preparado `supabase/migrations/20260922_02_add_missing_fk_indexes.sql`;
- las migraciones están **preparadas y versionadas, no aplicadas todavía a producción**;
- no se ha cambiado `verify_jwt=false` de las Edge Functions porque las funciones webhook auditadas disponen de su propio control por secreto y cambiar JWT a ciegas podría romper los flujos;
- `pg_net` en `public`, optimización de políticas RLS y protección de contraseñas filtradas quedan como revisiones posteriores, no como cambios automáticos.

Índices preparados para:

- `marcas_mensajes_javi(marked_by)`;
- `mensajes_dia(autor_id)`;
- `mensajes_laura(author_id)`;
- `notificaciones(actor_id)`;
- `propuestas(created_by)`;
- `recuerdos_app(created_by)`;
- `respuestas_diarias(pregunta_id)`;
- `y_si_notificaciones(destinatario_id)`;
- `y_si_notificaciones(remitente_id)`;
- `y_si_respuestas(user_id)`.

---

# CHECKLIST DESPUÉS DE CAMBIOS DE BD

1. Verificar ejecución real del SQL.
2. Consultar de nuevo la función/estructura afectada.
3. Comprobar índices/constraints/RLS/triggers relevantes.
4. Actualizar este documento.
5. Actualizar `CONTEXTO_JAVIEATS.md` si cambia UX/producto.
6. No confundir revisión estática con prueba real en producción, navegador o iPad.

---

# RESUMEN ACTUAL

`¿Y si…?` tiene no repetición global, batería de 450 preguntas con 431 activas y una compatibilidad móvil basada en las últimas 20 preguntas. Con 75% o más se permiten 2 cambios diarios compartidos; por debajo, 1. La última verificación dio 80% de compatibilidad y confirmó backend actualizado y protección global de no repetición activa.


## Seguridad y rendimiento aplicados · 22/09/2026

Supabase registra actualmente tres migraciones de mantenimiento 3.3.6:

- `harden_internal_function_permissions`
- `add_missing_fk_indexes`
- `optimize_rls_auth_uid`

Verificación posterior:

- desaparecen los 11 avisos de ejecución anónima de funciones internas `SECURITY DEFINER`;
- desaparecen los 16 avisos `auth_rls_initplan`;
- los índices FK recién creados pueden aparecer temporalmente como `unused_index` hasta acumular uso real.


## Migración adicional · 3.3.6

Aplicada en producción:

- `harden_legacy_message_rpcs`

Revoca ejecución directa a `PUBLIC/anon/authenticated` de:
- `guardar_mensaje_dia(text)`
- `marcar_mensaje_dia_leido(uuid)`

Ambos RPC ya no aparecen en el frontend actual ni son llamados por otras funciones del backend. Se conservan únicamente por compatibilidad/histórico y quedan disponibles para `service_role`.

Resultado del advisor: warnings `authenticated_security_definer_function_executable` reducidos de 13 a 11, correspondientes a RPC de negocio que sí consume el frontend actual.

QA de integridad:
- 0 recuerdos duplicados por `legacy_key`.
- 0 cover_index inválidos.
- 0 estados inválidos en `propuestas`.
- 0 endpoints Push duplicados.
- 0 respuestas duplicadas en `y_si_respuestas`.
- 0 preguntas abiertas de más hoy.
- 0 `y_si_notificaciones` en error.
- 0 `mensajes_dia.email_estado='error'`.
- 0 piezas de puzzle duplicadas por puzzle/número.

## Nuestro 24 · assets privados de hero

`private.nuestro24_assets` almacena los dos ramos del hero fuera del repositorio público. RLS está activado y no existen permisos directos para `anon`/`authenticated`. `public.obtener_nuestro24_assets()` autoriza a Javi en preview y a Laura únicamente después del release de servidor. Las fotografías se cargan como WebP privados y sus bytes no se incluyen en las migraciones versionadas.

## Nuestro 24 · assets de momentos

`private.nuestro24_moments.asset_key` vincula una escena editorial con un asset privado de `private.nuestro24_assets`. Para septiembre 2026 existen assets para 12/09, 16/09, 19/09 y 20/09. Los bytes WebP no se versionan en GitHub; la migración solo versiona esquema, claves y asociaciones. `private.nuestro24_snapshot(date)` incluye `asset_key` en cada momento.


## Nuestro 24 · Hardening de release · 23/09/2026
- Migración aplicada: nuestro24_release_hardening (20260923183134).
- private.nuestro24_assets incorpora edition_date NOT NULL; cada asset queda asociado a una edición de día 24.
- public.obtener_nuestro24_assets(date) autoriza por identidad, fecha y estado de archivo/release y devuelve solo los assets de la edición solicitada.
- public.obtener_nuestro24(date) conserva preview para Javi, bloquea a Laura antes del release y no marca como preview el fallback una vez publicado.
- Ambos RPC mantienen SECURITY DEFINER de forma intencionada, EXECUTE solo para authenticated/service_role y validación interna de auth.uid().
- Edge Function send-push v4 reconoce tipo nuestro24 y mantiene los tipos previos; su TTL especial dura hasta el siguiente cambio de día en Europe/Madrid.
- Pendiente de aprobación: enabled=false y notification_armed=false.


### Ajuste de ventana preview/archivo
Migración aplicada: nuestro24_archive_preview_window (20260923184719).

- Preview de Javi: solo desde el día 23 hasta el final del 24 de cada edición.
- Laura: no recibe contenido ni assets antes del release del 24.
- Desde el día 25 un archivo ya creado se puede abrir aunque enabled se haya desactivado para un evento futuro.
- El hero especial nunca continúa activo el día 25.


### Namespace de assets por edición
Migración aplicada: nuestro24_asset_keys_per_edition (20260923185259).

- La PK de private.nuestro24_assets pasa de asset_key a (edition_date, asset_key).
- Cada edición puede reutilizar claves locales como ramo-izquierda, ramo-derecha o nombres equivalentes sin sobrescribir meses anteriores.
- Se eliminó el índice simple edition_date porque la PK compuesta ya lo cubre por prefijo.
- Verificación transaccional: se pudo insertar ramo-izquierda para 2026-10-24 coexistiendo con septiembre y la prueba fue revertida.
