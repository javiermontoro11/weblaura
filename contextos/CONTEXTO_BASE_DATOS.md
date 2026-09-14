# CONTEXTO MAESTRO — BASE DE DATOS JAVIEATS

> **Ámbito:** únicamente Supabase/PostgreSQL, Storage, RLS, RPC, triggers y persistencia de JaviEats.
>
> Para el contexto funcional de la app usar `contextos/CONTEXTO_JAVIEATS.md`.
>
> Para el juego Nuestra Vida usar `contextos/CONTEXTO_NUESTRA_VIDA.md`.
>
> **Estado de referencia:** 14 de septiembre de 2026 · JaviEats 3.3.

---

# PROMPT PARA UN CHAT NUEVO

Quiero que continúes el mantenimiento de la base de datos Supabase/PostgreSQL de JaviEats sin reconstruir el esquema ni inventar tablas, columnas, RPC, policies o triggers.

La prioridad es:

**ESTABILIDAD > CAMBIOS GRANDES**

Antes de cualquier modificación estructural, inspecciona el estado real de Supabase y conserva compatibilidad con el frontend actual.

Nunca incluyas en documentación:

- contraseñas;
- claves `service_role`;
- tokens;
- secretos de webhook;
- valores de Vault;
- credenciales privadas.

Los UUID reales de los dos perfiles autorizados deben representarse como `JAVI_USER_ID` y `LAURA_USER_ID`.

---

# 1. REGLA OBLIGATORIA DE MANTENIMIENTO

Cada cambio relevante de base de datos obliga a actualizar este archivo en el mismo trabajo.

Incluye, como mínimo:

- crear, borrar o renombrar tablas;
- crear, borrar o renombrar columnas;
- cambiar tipos, defaults o nullability;
- modificar PK, FK, UNIQUE, CHECK o índices relevantes;
- cambiar RLS o policies;
- crear, borrar o modificar RPC/funciones;
- crear, borrar o modificar triggers;
- cambiar Storage/buckets;
- cambiar Push/correo/Edge Functions dependientes de BD;
- cargas de contenido que alteren materialmente un módulo;
- cambios del contrato entre frontend y backend.

Después de un cambio:

1. verificar que el SQL se ejecutó realmente;
2. volver a consultar la estructura/función afectada;
3. comprobar índices, constraints, RLS y triggers;
4. actualizar este `.md`;
5. actualizar también `contextos/CONTEXTO_JAVIEATS.md` si cambia comportamiento de producto.

---

# 2. TABLAS `public` AUDITADAS

1. `marcas_mensajes_javi`
2. `mensajes_dia`
3. `mensajes_laura`
4. `notificaciones`
5. `piezas_puzzle`
6. `preguntas_diarias`
7. `propuestas`
8. `push_subscriptions`
9. `puzzles_premio`
10. `recordatorios_email`
11. `recuerdos_app`
12. `respuestas_diarias`
13. `retos_diarios`
14. `rondas_reto`
15. `vales`
16. `y_si_dias`
17. `y_si_notificaciones`
18. `y_si_preguntas`
19. `y_si_respuestas`

No eliminar tablas por parecer legacy sin revisar frontend, RPC, triggers, Edge Functions y relaciones.

---

# 3. PROPUESTAS / PLANES

Tabla principal: `public.propuestas`.

Campos funcionales principales:

- `id uuid` PK;
- `created_by uuid` → `auth.users(id)`;
- `service_id`, `service_title`, `service_icon`, `category`;
- `plan_date`, `plan_time`, `duration`, `priority`, `note`;
- `status`;
- `entry_type`;
- `is_all_day`;
- timestamps.

Estados permitidos:

- `pendiente`
- `confirmada`
- `realizada`
- `cancelada`

`entry_type`: `service` o `custom`.

Triggers relevantes:

- `notificar_propuesta`;
- `actualizar_updated_at`;
- `validar_actualizacion_propuesta_v3`.

---

# 4. RECUERDOS

Tabla principal: `public.recuerdos_app`.

Campos principales:

- `id`, `created_by`, `fecha`, `titulo`, `descripcion`;
- `tipo` (`gallery` o `letter`);
- `contenido`;
- `image_paths text[]`;
- `cover_index`;
- `legacy_key`;
- timestamps.

Bucket Storage:

`recuerdos`

Estado auditado:

- privado;
- máximo 5 MB por archivo;
- MIME: `image/webp`, `image/jpeg`, `image/png`.

Triggers:

- `notificar_recuerdo_nuevo`;
- `set_recuerdos_app_updated_at`;
- `proteger_autor_recuerdo_v3`.

---

# 5. NOTIFICACIONES Y PUSH

`notificaciones` usa `dedupe_key` único y RLS orientado al destinatario.

RPC relacionadas:

- `crear_notificacion(...)`
- `marcar_notificacion_leida(uuid)`
- `marcar_todas_notificaciones_leidas()`
- `eliminar_notificacion(uuid)`
- `vaciar_notificaciones()`

`push_subscriptions` guarda suscripciones Web Push por usuario.

Existe un trigger de Push sobre `notificaciones` que llama a `supabase_functions.http_request`.

**No extraer ni documentar headers o credenciales de ese trigger.**

---

# 6. MENSAJES, RETO, PUZLE Y VALES

Módulos/tablas:

- `mensajes_laura`
- `marcas_mensajes_javi`
- `mensajes_dia`
- `preguntas_diarias`
- `respuestas_diarias`
- `retos_diarios`
- `rondas_reto`
- `piezas_puzzle`
- `puzzles_premio`
- `vales`

RPC relevantes:

- `guardar_mensaje_dia(text)`
- `marcar_mensaje_dia_leido(uuid)`
- `iniciar_reto_diario()`
- `jugar_ronda_reto(text)`
- `jugar_ronda_reto_v23(text)`
- `canjear_vale(uuid)`

No confundir `preguntas_diarias/respuestas_diarias` con `y_si_*`.

---

# 7. `¿Y SI…?` — MODELO Y ESTADO ACTUAL

El módulo está controlado principalmente por RPC `SECURITY DEFINER`.

Las tablas `y_si_*` tienen RLS activo y el flujo normal pasa por RPC.

## `y_si_preguntas`

- `id bigint GENERATED ALWAYS AS IDENTITY` PK;
- `categoria text`;
- `pregunta text UNIQUE`;
- `opciones text[]` de 2 a 4 elementos;
- `destacada boolean`;
- `activa boolean`;
- `created_at`.

### Estado verificado tras JaviEats 3.3

- **450 preguntas totales**;
- **431 activas**;
- **19 inactivas** por limpieza de duplicados semánticos;
- **374 preguntas activas todavía disponibles** para aparecer.

IDs inactivos:

`27, 76, 305, 382, 386, 414, 416, 431, 434, 453, 456, 465, 466, 479, 484, 497, 503, 517, 520`.

No se borraron filas: se marcaron `activa = false`.

## `y_si_dias`

Registra cada pregunta presentada.

Campos relevantes:

- `id uuid`;
- `fecha_inicio date`;
- `temporada integer`;
- `pregunta_id bigint`;
- `cerrada_at`;
- `posicion_dia` 1–5;
- `caducada_at`;
- `saltada_at`.

Estado verificado tras 3.3:

- **60 registros históricos**;
- **60 preguntas usadas distintas**;
- **0 repeticiones históricas**;
- **0 preguntas abiertas** en la comprobación final.

Índices/reglas relevantes:

- FK a `y_si_preguntas`;
- se conserva `UNIQUE (temporada, pregunta_id)` por compatibilidad;
- existe `y_si_dias_pregunta_id_unique_global UNIQUE (pregunta_id)`.

## `y_si_respuestas`

`UNIQUE (dia_id, user_id)`.

## `y_si_notificaciones`

Estados válidos:

- `pendiente`
- `procesando`
- `programada`
- `cancelada`
- `error`

`UNIQUE (dia_id, destinatario_id)`.

---

# 8. `¿Y SI…?` — NO REPETICIÓN IMPLEMENTADA EN 3.3

Regla ya implementada y verificada:

> **Una pregunta que haya sido presentada una vez no vuelve a salir nunca.**

La fuente de verdad es todo `public.y_si_dias`.

`public.obtener_y_si_actual()` fue verificada con estas propiedades:

- usa exclusión global mediante `d.pregunta_id = q.id`;
- no filtra el historial por `temporada`;
- no contiene `v_temporada := v_temporada + 1`;
- no recicla preguntas cuando se agota una temporada.

La columna `temporada` se conserva por compatibilidad histórica.

El índice `y_si_dias_pregunta_id_unique_global` refuerza la regla a nivel PostgreSQL.

La comprobación final confirmó además:

- `preguntas_totales = 450`;
- `preguntas_activas = 431`;
- `preguntas_presentadas = 60`;
- `preguntas_presentadas_unicas = 60`;
- `duplicados_historicos = 0`;
- `preguntas_abiertas = 0`;
- `preguntas_disponibles = 374`;
- `proteccion_unique_global = true`.

Si se agotan las preguntas activas no usadas, hay que ampliar la batería. **No reciclar preguntas antiguas.**

---

# 9. RPC PRINCIPALES DE `¿Y SI…?`

- `_y_si_estado_limite(uuid)`
- `_y_si_payload(uuid, uuid)`
- `obtener_y_si_actual()`
- `obtener_y_si_historial()`
- `responder_y_si(integer)`
- `saltar_y_si_actual()`
- `notificar_y_si_resultado()`
- `trigger_turno_y_si()`

Reglas conservadas:

- máximo 5 preguntas completadas al día;
- una sola pregunta abierta globalmente;
- una respuesta por usuario y pregunta;
- un salto diario solo antes de que alguien responda;
- aviso al segundo jugador;
- al responder ambos se cierra la pregunta y se devuelve resultado + siguiente;
- se desprioriza repetir inmediatamente categoría.

`trigger_turno_y_si()` usa `y_si_webhook_secret` desde Supabase Vault para el fallback de email. Nunca documentar el valor.

---

# 10. FUNCIONES `public` AUDITADAS

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

# 11. EXTENSIONES AUDITADAS

- `pg_net` 0.20.4
- `pg_stat_statements` 1.11
- `pgcrypto` 1.3
- `plpgsql` 1.0
- `supabase_vault` 0.3.1
- `uuid-ossp` 1.1

---

# 12. RESUMEN EJECUTIVO

Estado de `¿Y si…?` a 14/09/2026:

**450 totales · 431 activas · 19 inactivas semánticas · 60 históricas distintas · 0 repetidas · 0 abiertas en la verificación final · 374 activas disponibles · no reciclaje entre temporadas · UNIQUE global por `pregunta_id`.**

Este documento es exclusivamente el contexto de **base de datos**.
