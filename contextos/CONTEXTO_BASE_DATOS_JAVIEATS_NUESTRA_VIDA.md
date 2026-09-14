# CONTEXTO MAESTRO DE BASE DE DATOS — JAVIEATS + NUESTRA VIDA

> **Uso:** este archivo es la fuente de contexto técnico para Supabase/PostgreSQL y cualquier persistencia relevante de **JaviEats** y **Nuestra Vida**.
>
> **Repositorio:** `javiermontoro11/weblaura`
>
> **Rama de referencia:** `main`
>
> **Estado de referencia:** 14 de septiembre de 2026.
>
> **Regla principal:** antes de modificar base de datos, persistencia o lógica RPC, comprobar el estado real de `main` y el estado real de Supabase. No reconstruir el esquema por memoria.

---

# PROMPT PARA CONTINUAR EL TRABAJO DE BASE DE DATOS

Quiero que continúes el desarrollo y mantenimiento de la base de datos de mis proyectos privados **JaviEats** y **Nuestra Vida** sin empezar desde cero.

La prioridad es:

**ESTABILIDAD > CAMBIOS GRANDES**

No inventes tablas, columnas, RPC, policies, triggers, buckets ni migraciones. Antes de proponer o ejecutar un cambio estructural, inspecciona el estado real disponible y conserva compatibilidad con lo que ya funciona.

Nunca incluyas en este documento:

- contraseñas,
- claves `service_role`,
- secretos de webhooks,
- tokens,
- valores de Vault,
- credenciales privadas.

Los UUID concretos de los dos perfiles autorizados deben documentarse como:

- `JAVI_USER_ID`
- `LAURA_USER_ID`

No copiar sus valores reales a documentación nueva salvo necesidad técnica explícita.

---

# 1. REGLA OBLIGATORIA DE MANTENIMIENTO DEL CONTEXTO

Esta regla es permanente para **JaviEats** y **Nuestra Vida**:

## Si se modifica la base de datos de forma estructural o funcional relevante, el contexto se actualiza en el mismo trabajo.

Esto incluye, como mínimo:

- crear, borrar o renombrar tablas;
- crear, borrar o renombrar columnas;
- cambiar tipos, `DEFAULT`, `NULL/NOT NULL` o identidades;
- añadir, borrar o modificar PK, FK, `UNIQUE`, `CHECK` o índices relevantes;
- cambiar RLS o policies;
- crear, borrar o cambiar RPC/funciones PostgreSQL;
- crear, borrar o cambiar triggers;
- cambiar buckets o reglas relevantes de Storage;
- cambiar la arquitectura de Push, correo o Edge Functions cuando dependa de la base de datos;
- cambiar el schema/formato de guardado de Nuestra Vida;
- cambiar una regla de producto que dependa del historial de base de datos;
- ejecutar una migración que cambie el contrato esperado por el frontend.

También se actualizarán los datos de contexto cuando una carga de contenido cambie de forma material un módulo, por ejemplo el número, categorías o reglas de la batería de `¿Y si…?`.

## Procedimiento obligatorio

Cuando haya uno de esos cambios:

1. comprobar `main` antes de tocar nada;
2. comprobar el esquema/funciones reales de Supabase implicados;
3. realizar el cambio mínimo necesario;
4. verificar el estado resultante;
5. actualizar **este archivo** con el nuevo estado real;
6. actualizar además el contexto específico del proyecto afectado cuando corresponda:
   - JaviEats: `CONTEXTO_JAVIEATS_3.2.md` o su sucesor vigente;
   - Nuestra Vida: `nuestra-vida/CONTEXTO_NUESTRA_VIDA_1.0.md` o su sucesor vigente;
7. no declarar el cambio cerrado hasta que código/base de datos y documentación contextual sean coherentes.

Si el cambio afecta a ambos proyectos, actualizar ambos contextos específicos además de este archivo.

**La documentación contextual forma parte del cambio; no es una tarea opcional posterior.**

---

# 2. ARQUITECTURA GENERAL ACTUAL

JaviEats usa Supabase/PostgreSQL para:

- autenticación de los dos perfiles autorizados;
- propuestas/planes;
- recuerdos;
- notificaciones internas;
- Push;
- mensajes;
- preguntas/respuestas diarias;
- reto diario de piedra, papel o tijera;
- puzle y vales;
- `¿Y si…?`;
- recordatorios y fallbacks relacionados con correo.

La zona `public` tiene RLS activado en las tablas de aplicación auditadas.

Nuestra Vida está integrada dentro del ecosistema JaviEats y reutiliza el acceso/sesión de JaviEats, pero en la auditoría actual **no se han identificado tablas `public` específicas dedicadas al estado de partida de Nuestra Vida**.

Nuestra Vida sí mantiene un **schema interno de guardado identificado como `0.18.29`** por compatibilidad histórica. No cambiar ese schema únicamente porque cambie la versión visible del juego. Si alguna futura versión migra ese formato o mueve guardados a Supabase, deberá documentarse aquí y en el contexto específico de Nuestra Vida.

---

# 3. TABLAS `public` AUDITADAS

Tablas de aplicación existentes:

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

No borrar una tabla por parecer antigua sin revisar referencias de frontend, RPC, triggers, Edge Functions y relaciones.

---

# 4. PROPUESTAS / PLANES

Tabla principal: `public.propuestas`.

Campos relevantes:

- `id uuid` PK;
- `created_by uuid` → `auth.users(id)`;
- `service_id text`;
- `service_title text`;
- `service_icon text`;
- `category text`;
- `plan_date date`;
- `plan_time time`;
- `duration text`;
- `priority text`;
- `note text`;
- `status text`;
- `created_at timestamptz`;
- `updated_at timestamptz`;
- `entry_type text`;
- `is_all_day boolean`.

Reglas relevantes:

- `status` solo admite `pendiente`, `confirmada`, `realizada`, `cancelada`;
- `entry_type` admite `service` o `custom`;
- ambos perfiles autorizados pueden consultar y operar mediante las policies v3;
- el `INSERT` exige `created_by = auth.uid()` y estado inicial `pendiente`.

Índices relevantes:

- PK por `id`;
- índice por `created_at DESC`;
- índice por `plan_date`.

Triggers relevantes:

- notificación al insertar/cambiar estado mediante `notificar_propuesta`;
- actualización de `updated_at`;
- validación de cambios mediante `validar_actualizacion_propuesta_v3`.

---

# 5. RECUERDOS

Tabla principal: `public.recuerdos_app`.

Campos relevantes:

- `id uuid` PK;
- `created_by uuid`;
- `fecha date`;
- `titulo text`;
- `descripcion text`;
- `tipo text` (`gallery` o `letter`);
- `contenido text`;
- `image_paths text[]`;
- `cover_index integer`;
- `legacy_key text` único y nullable;
- timestamps de creación/actualización.

Restricciones importantes:

- título entre 1 y 140 caracteres;
- descripción máximo 1500;
- contenido máximo 30000;
- máximo 8 rutas de imagen;
- `cover_index >= 0`.

RLS permite operar a los dos perfiles autorizados, manteniendo `created_by = auth.uid()` en creación.

Triggers:

- `notificar_recuerdo_nuevo` tras insertar;
- `set_recuerdos_app_updated_at`;
- `proteger_autor_recuerdo_v3` antes de actualizar.

## Storage de recuerdos

Bucket:

`recuerdos`

Estado auditado:

- privado: `public = false`;
- límite por archivo: `5 MB` (`5242880` bytes);
- MIME permitidos:
  - `image/webp`
  - `image/jpeg`
  - `image/png`

---

# 6. NOTIFICACIONES Y PUSH

## `notificaciones`

Tabla de notificaciones internas.

Características relevantes:

- `destinatario_id` obligatorio;
- `actor_id` opcional;
- `tipo`, `titulo`, `detalle`, `destino`, `entidad_id`;
- `dedupe_key` obligatorio y único;
- `leido_at` nullable.

El destinatario solo consulta sus propias notificaciones mediante RLS.

RPC asociadas:

- `crear_notificacion(...)`
- `marcar_notificacion_leida(uuid)`
- `marcar_todas_notificaciones_leidas()`
- `eliminar_notificacion(uuid)`
- `vaciar_notificaciones()`

Existe un trigger de Push sobre `notificaciones` que llama a `supabase_functions.http_request`.

**Nunca documentar los argumentos/headers secretos de ese trigger.**

## `push_subscriptions`

Guarda suscripciones Web Push por usuario.

Campos principales:

- `id`
- `user_id`
- `endpoint`
- `p256dh`
- `auth`
- timestamps

`endpoint` es único. RLS limita SELECT/INSERT/UPDATE/DELETE al propio `user_id`.

---

# 7. MENSAJES Y PREGUNTAS DIARIAS

## `mensajes_laura`

Mensajes/carta/contenido de Laura con `author_id`, tipo, título y contenido.

Tipos permitidos:

- `mensaje`
- `carta`
- `contarte`
- `idea`

Javi y Laura pueden leer; las operaciones de escritura están restringidas a Laura como autora según las policies actuales.

## `marcas_mensajes_javi`

Marcas de Javi sobre mensajes: favorito/guardado en recuerdos.

## `mensajes_dia`

Mensaje diario con autor, destinatario, fecha, lectura y estado de email.

Regla importante: `UNIQUE (fecha, destinatario_id)`.

El estado de email admite:

- `pendiente`
- `procesando`
- `enviado`
- `error`

## `preguntas_diarias` / `respuestas_diarias`

Preguntas diarias tradicionales separadas del módulo `¿Y si…?`.

`respuestas_diarias` mantiene una única respuesta por `(user_id, fecha)`.

No confundir este módulo con `y_si_*`.

---

# 8. RETO DIARIO, PUZLE Y VALES

Tablas:

- `retos_diarios`
- `rondas_reto`
- `piezas_puzzle`
- `puzzles_premio`
- `vales`

RPC relevantes:

- `iniciar_reto_diario()`
- `jugar_ronda_reto(text)`
- `jugar_ronda_reto_v23(text)`
- `canjear_vale(uuid)`

Reglas destacadas:

- una partida por usuario y fecha;
- reto de hasta 5 rondas regulares, con posible desempate;
- elecciones de ronda: `piedra`, `papel`, `tijera`;
- puzle de premio con exactamente 6 piezas;
- una pieza por `(puzzle_id, numero_pieza)` y una pieza por `reto_id`;
- un solo puzle activo por beneficiaria mediante índice parcial;
- los vales admiten `activo` / `canjeado`.

Triggers de notificación:

- `notificar_pieza_puzzle`
- `notificar_puzzle_completado`

---

# 9. MÓDULO `¿Y SI…?` — MODELO DE DATOS

Este módulo está controlado principalmente mediante RPC `SECURITY DEFINER`.

Las cuatro tablas `y_si_*` tienen RLS activado y, en el estado auditado, no tienen policies directas de usuario. El acceso funcional se realiza mediante RPC autorizadas.

## `y_si_preguntas`

Campos:

- `id bigint GENERATED ALWAYS AS IDENTITY` PK;
- `categoria text`;
- `pregunta text`;
- `opciones text[]`;
- `destacada boolean`;
- `activa boolean`;
- `created_at timestamptz`.

Restricciones:

- `pregunta` es `UNIQUE`;
- cada pregunta tiene entre 2 y 4 opciones.

Estado exacto auditado:

- **450 preguntas totales**;
- **450 activas**.

Distribución actual:

| Categoría | Total | Destacadas |
|---|---:|---:|
| Absurdas | 46 | 6 |
| Comida | 34 | 2 |
| Dilemas | 42 | 7 |
| Dinero | 44 | 10 |
| Futuro | 44 | 12 |
| Mundo | 32 | 2 |
| Ocio | 34 | 1 |
| Ocio y comida | 10 | 1 |
| Tecnología | 34 | 1 |
| Tecnología y trabajo | 10 | 1 |
| Trabajo y tiempo | 32 | 1 |
| Viajes | 44 | 7 |
| Vida | 44 | 7 |

## `y_si_dias`

Registra cada pregunta presentada/creada por el juego.

Campos relevantes:

- `id uuid`;
- `fecha_inicio date`;
- `temporada integer`;
- `pregunta_id bigint`;
- `cerrada_at`;
- `posicion_dia` (1 a 5);
- `caducada_at`;
- `saltada_at`.

Restricciones/índices fundamentales:

- FK a `y_si_preguntas`;
- `UNIQUE (temporada, pregunta_id)`;
- índice parcial único que permite **una sola pregunta abierta globalmente** cuando no está cerrada/caducada/saltada.

## `y_si_respuestas`

Una respuesta por usuario y pregunta/día:

- `dia_id`
- `user_id`
- `opcion` entre 1 y 4
- `created_at`

Regla:

`UNIQUE (dia_id, user_id)`.

## `y_si_notificaciones`

Gestiona aviso al segundo jugador y fallback de correo.

Estados válidos:

- `pendiente`
- `procesando`
- `programada`
- `cancelada`
- `error`

Existe `UNIQUE (dia_id, destinatario_id)`.

Estado de uso exacto informado en la auditoría:

- 57 registros en `y_si_dias`;
- 91 respuestas;
- 49 notificaciones.

---

# 10. `¿Y SI…?` — RPC Y LÓGICA ACTUAL

RPC/funciones principales:

- `_y_si_estado_limite(uuid)`
- `_y_si_payload(uuid, uuid)`
- `obtener_y_si_actual()`
- `obtener_y_si_historial()`
- `responder_y_si(integer)`
- `saltar_y_si_actual()`
- `notificar_y_si_resultado()`
- `trigger_turno_y_si()`

Todas las RPC funcionales importantes del módulo validan que el usuario sea uno de los dos perfiles autorizados.

## Límite diario

Máximo:

**5 preguntas completadas por día.**

El payload devuelve, entre otros:

- posición del día;
- respuestas de ambos cuando ya están disponibles;
- coincidencia;
- completadas del día;
- coincidencias del día;
- si se alcanzó el límite;
- si hay salto disponible.

## Salto

Actualmente se permite un salto cuando:

- la pregunta es de hoy;
- sigue abierta;
- nadie ha respondido;
- no se ha usado ya el salto del día.

No puede saltarse una pregunta después de que alguien haya respondido.

## Respuesta

`responder_y_si()`:

1. obtiene la pregunta actual;
2. bloquea concurrencia mediante advisory lock;
3. impide segunda respuesta del mismo usuario;
4. valida que la pregunta siga disponible;
5. valida el número de opción real;
6. inserta la respuesta;
7. si solo ha respondido una persona, crea aviso al otro usuario;
8. si ya respondieron ambos, cierra el día/pregunta, cancela notificación programada pendiente y devuelve resultado + siguiente pregunta.

## Push / correo

`trigger_turno_y_si()`:

- si el destinatario tiene Push, genera notificación interna/Push y no programa email;
- si no hay Push, utiliza el secreto `y_si_webhook_secret` almacenado en **Supabase Vault** y llama mediante `pg_net` a la Edge Function `turno-y-si`;
- el valor real del secreto nunca debe documentarse.

## Resultado

`notificar_y_si_resultado()` notifica cuando una pregunta acaba de cerrarse.

En la quinta pregunta del día genera un resultado final con el número de coincidencias.

---

# 11. `¿Y SI…?` — REGLA DE NO REPETICIÓN

## Comportamiento implementado actualmente

`obtener_y_si_actual()` selecciona una pregunta activa que **no haya aparecido en la temporada actual**.

También desprioriza repetir inmediatamente la misma categoría.

Si se agotan todas las preguntas de la temporada:

1. incrementa `temporada`;
2. vuelve a hacer elegibles las preguntas antiguas;
3. comienza otro ciclo.

Por tanto, en el estado actual una pregunta **no puede repetirse dentro de la misma temporada**, pero sí puede volver a aparecer en una temporada futura.

## Requisito de producto acordado para la evolución 3.3

**Una pregunta que ya haya sido presentada alguna vez no debe volver a salir nunca.**

La fuente de verdad para saber si una pregunta ya salió será el historial de `y_si_dias`.

La selección futura debe excluir globalmente cualquier `pregunta_id` que ya exista en `y_si_dias`, sin filtrar por temporada.

La columna `temporada` puede conservarse por compatibilidad histórica; no es necesario borrarla para implementar esta regla.

**IMPORTANTE:** esta regla está documentada como requisito acordado, pero no debe considerarse implementada hasta que se modifique y verifique la RPC real en Supabase.

## Calidad de la batería

Antes de ampliar de nuevo la batería:

- revisar duplicados exactos;
- revisar duplicados semánticos/conceptuales;
- evitar reformulaciones del mismo dilema;
- mantener variedad de categorías y opciones;
- actualizar aquí los totales/categorías tras una carga material de preguntas.

---

# 12. FUNCIONES `public` AUDITADAS

Catálogo actual conocido:

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

No asumir que esta lista seguirá vigente si se realizan migraciones posteriores: volver a inspeccionarla antes de cambios importantes.

---

# 13. TRIGGERS DE APLICACIÓN AUDITADOS

Relaciones principales conocidas:

- `marcas_mensajes_javi` UPDATE → `actualizar_updated_at`
- `mensajes_dia` INSERT → `trigger_mensaje_dia_email`
- `mensajes_dia` INSERT → `notificar_mensaje_dia_insert`
- `mensajes_dia` UPDATE → `set_mensajes_dia_updated_at`
- `mensajes_laura` UPDATE → `actualizar_updated_at`
- `notificaciones` INSERT → `supabase_functions.http_request` para Push
- `piezas_puzzle` INSERT → `notificar_pieza_puzzle`
- `propuestas` INSERT/UPDATE → `notificar_propuesta`
- `propuestas` UPDATE → `actualizar_updated_at`
- `propuestas` UPDATE → `validar_actualizacion_propuesta_v3`
- `push_subscriptions` UPDATE → `actualizar_updated_at`
- `puzzles_premio` UPDATE → `notificar_puzzle_completado`
- `recuerdos_app` INSERT → `notificar_recuerdo_nuevo`
- `recuerdos_app` UPDATE → `set_recuerdos_app_updated_at`
- `recuerdos_app` UPDATE → `proteger_autor_recuerdo_v3`
- `respuestas_diarias` UPDATE → `actualizar_updated_at`
- `retos_diarios` UPDATE → `actualizar_updated_at`
- `vales` UPDATE → `actualizar_updated_at`
- `y_si_dias` UPDATE → `notificar_y_si_resultado`
- `y_si_notificaciones` INSERT/UPDATE → `trigger_turno_y_si`

Cuando se auditen triggers, evitar consultas que expongan argumentos de webhooks con secretos.

---

# 14. EXTENSIONES AUDITADAS

Extensiones activas conocidas:

- `pg_net` 0.20.4
- `pg_stat_statements` 1.11
- `pgcrypto` 1.3
- `plpgsql` 1.0
- `supabase_vault` 0.3.1
- `uuid-ossp` 1.1

`pg_net` y `supabase_vault` son especialmente relevantes para la integración de `¿Y si…?` con Edge Functions/correo.

---

# 15. RLS — PRINCIPIOS ACTUALES

Principio general:

- solo existen dos perfiles funcionales autorizados;
- varias tablas permiten lectura a ambos;
- algunas operaciones están restringidas al autor/usuario propietario;
- módulos sensibles escriben mediante RPC `SECURITY DEFINER` en lugar de conceder escritura directa mediante policies.

Caso especialmente importante:

- `y_si_dias`
- `y_si_notificaciones`
- `y_si_preguntas`
- `y_si_respuestas`

Tienen RLS activo pero no policies directas en el estado auditado. No añadir policies amplias a estas tablas sin comprender antes por qué las RPC `SECURITY DEFINER` son la frontera de escritura/lectura funcional.

---

# 16. NUESTRA VIDA — REGLAS DE PERSISTENCIA

Estado documentado de Nuestra Vida 1.0:

- el juego tiene un formato/schema de guardado interno compatible con `0.18.29`;
- ese número no debe cambiar por un simple bump de versión del juego;
- solo debe cambiar cuando exista una migración real de datos/estado;
- antes de cambiar persistencia de Nuestra Vida, revisar el MASTER vigente y el contexto específico del juego;
- no se han identificado en esta auditoría tablas `public` dedicadas específicamente a la partida de Nuestra Vida.

Si en el futuro Nuestra Vida incorpora tablas, RPC, Storage propio, sincronización cloud o migración de guardados:

1. documentarlas en esta sección;
2. actualizar `nuestra-vida/CONTEXTO_NUESTRA_VIDA_1.0.md` o su sucesor;
3. definir compatibilidad/migración de partidas existentes;
4. no sobrescribir el MASTER sin versionado incremental y verificación.

---

# 17. QUÉ NO CONFUNDIR

No confundir:

- estructura de BD inspeccionada con migración ya aplicada;
- SQL preparado con SQL ejecutado;
- GitHub actualizado con Supabase actualizado;
- Supabase actualizado con producción probada;
- revisión estática con prueba real en navegador;
- prueba de escritorio con prueba real en iPad.

Cada cierre de tarea debe indicar explícitamente qué capas se han modificado y cuáles se han probado.

---

# 18. CHECKLIST PARA CAMBIOS DE BASE DE DATOS

Antes:

- [ ] comprobar `main`;
- [ ] identificar tablas/RPC/triggers/policies afectadas;
- [ ] comprobar dependencias del frontend;
- [ ] evitar exponer secretos;
- [ ] preparar cambio mínimo y reversible cuando sea posible.

Después:

- [ ] verificar que la migración se ejecutó realmente;
- [ ] volver a consultar estructura/funciones afectadas;
- [ ] comprobar constraints e índices;
- [ ] comprobar RLS/policies;
- [ ] comprobar triggers;
- [ ] comprobar comportamiento del frontend afectado;
- [ ] actualizar este `.md`;
- [ ] actualizar el contexto específico de JaviEats y/o Nuestra Vida;
- [ ] indicar si hubo prueba real de producción/navegador/iPad.

---

# 19. INSTRUCCIÓN FINAL PARA UN CHAT NUEVO

Si recibes este archivo en una conversación futura:

1. trátalo como contexto, no como sustituto del estado real;
2. comprueba GitHub y Supabase antes de cambiar estructura;
3. conserva la filosofía de cambios quirúrgicos;
4. no inventes esquemas;
5. no expongas secretos;
6. recuerda que cualquier cambio estructural/funcional relevante de BD obliga a actualizar este archivo y el contexto específico del proyecto afectado;
7. para `¿Y si…?`, no consideres implementada la regla de “no repetir jamás” hasta verificar que la RPC real ya fue migrada.

La fuente de verdad final siempre es el estado real combinado de:

**GitHub `main` + Supabase real + documentación contextual actualizada.**
