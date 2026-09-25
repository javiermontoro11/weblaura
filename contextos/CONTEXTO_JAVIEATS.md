# CONTEXTO MAESTRO — JAVIEATS 3.4.0 · PREVIEW NUESTRO 24

## Nuestra galería · 25/09/2026
- Ajuste 3.5.2: restaurado el diseño de tarjetas anterior; solo se cambia el encuadre a `contain` para evitar cortes. Se conservan descarga JPEG y borrado Storage→BD.
- Ajuste 3.5.1: grid tipo Instagram sin huecos visuales, miniaturas cuadradas con foto completa, 3 columnas en móvil, descarga JPEG y borrado Storage→BD para evitar objetos huérfanos.
- Nueva vista dentro de Recuerdos: **Nuestros recuerdos | Nuestra galería**.
- Grid: 6 columnas escritorio, 4/3 intermedio y 2 móvil.
- Subida compartida Javi/Laura: máximo 10 fotos por operación, fecha y descripción común inicialmente; después cada foto puede editarse individualmente.
- Visor privado con anterior/siguiente, swipe, descarga, edición y borrado.
- Frontend encapsulado en `app/js/gallery.js` + `app/css/gallery.css`.
- Persistencia en `public.galeria_app`; objetos en el bucket privado `recuerdos` bajo `gallery/`.
- Reutiliza `JaviEatsMemories.compressImage()`: máximo 1600 px y objetivo aproximado 700 KB.
- La carga es incremental en bloques de 24 fotos para contener lecturas, firmas y transferencia de Supabase.
- La tarjeta **Último recuerdo** de Inicio muestra la foto completa en primer plano sobre un fondo de relleno, evitando el recorte que impedía ver a Javi y Laura a la vez.


> **Ámbito:** contexto funcional y técnico general de JaviEats.
>
> Para Supabase/base de datos usar `contextos/CONTEXTO_BASE_DATOS.md`.
>
> Para Nuestra Vida usar `contextos/CONTEXTO_NUESTRA_VIDA.md`.
>
> **Repositorio:** `javiermontoro11/weblaura`
>
> **Rama de trabajo:** `feature/nuestro-24` · `main` sigue siendo la fuente estable
>
> **Estado de referencia:** 23 de septiembre de 2026 · preview de Nuestro 24 en desarrollo; sin merge a `main` hasta aprobación.

---

# NUESTRO 24 · 3.4.0

Experiencia mensual reutilizable a partir del 24/09/2026.

## Ajuste visual final · Nuestro 24 3.4.8
- Se mantiene la foto original completa del recuerdo usado como hero; el frontend solo desplaza `object-position` hacia arriba para que las caras queden dentro del recorte en hero, intro, portada, escena de reencuentro y tarjeta archivada de Recuerdos.
- La escena 08 (24/09, “Quién sabe qué deparará la tarde”) usa un carrusel de dos assets privados `moment-2026-09-24-bowling-1` y `moment-2026-09-24-bowling-2`.
- El carrusel tiene flechas, indicadores y swipe nativo en móvil con `scroll-snap`; si faltan los dos assets conserva la ilustración abstracta como fallback.
## Corrección final de preview · 3.4.7
- 21/09: la tarjeta usa el asset privado moment-2026-09-21-yellow-flowers en lugar de SVG/CSS de flores.
- 24/09: se elimina la ilustración de bolos; queda una composición abstracta crema/coral con corazones y destellos discretos, sin animación continua.
- Carta: el frontend conserva letter_markdown como única fuente de texto y recupera el layout estable de invitación, CTA, lectura y cierre.
- No se cambia la lógica de release, archivo, acceso anticipado ni Push; enabled=false y notification_armed=false hasta aprobación.

- Acceso anticipado exclusivamente para Javi; Laura no recibe el payload privado antes del release.
- Control de fecha/identidad en servidor con Europe/Madrid.
- Durante el día 24 Inicio muestra hero especial y ambientación global sin alterar navegación ni funcionalidades.
- `app/js/nuestro24.js` renderiza la experiencia y `app/css/nuestro24.css` encapsula tema, escenas y animaciones.
- Septiembre tiene ocho momentos curados: primera foto, volver a vernos el 1, Nuestra Vida, atardecer/Vallecas, tomar algo + Entre tú y yo, perritos, flores y bolos/helado.
- Las microescenas se activan mediante IntersectionObserver y respetan `prefers-reduced-motion`.
- Los momentos no crean Recuerdos individuales; el snapshot mensual completo se archiva como un único `kind=nuestro24`.
- La carta permanece literal y separada del resto del relato.

---

# PROMPT PARA CONTINUAR EN UN CHAT NUEVO

Quiero que continúes el desarrollo y mantenimiento de **JaviEats 3.3.7** sin empezar de cero.

La prioridad es:

**ESTABILIDAD > CAMBIOS GRANDES**

Antes de modificar código:

1. comprobar siempre `main`;
2. inspeccionar exactamente los archivos actuales;
3. hacer cambios quirúrgicos;
4. no crear archivos auxiliares innecesarios;
5. distinguir código escrito, código subido, despliegue de producción y pruebas reales.

Si un cambio toca Supabase o persistencia, leer y actualizar también `contextos/CONTEXTO_BASE_DATOS.md`.

---

# ARQUITECTURA GENERAL

Proyecto vanilla HTML/CSS/JS, sin build system.

Archivos principales:

- `index.html`
- `script.js`
- `style.css`
- `index.html`
- `script.js`
- `style.css`
- `manifest.webmanifest`
- `service-worker.js`
- `assets/`
- `contextos/`
- `minijuegos/`
  - `minigames-data.js`
  - `minigames-core.js`
  - `minigames.js`
  - `nuestra-vida-launcher.js`
  - `entre-tu-y-yo/`
- `nuestra-vida/`

`main` es la fuente de verdad.

---

# ESTADO FUNCIONAL DE 3.3

JaviEats incluye:

- autenticación persistente con Supabase;
- perfiles Javi y Laura;
- planes/propuestas y calendario compartido;
- Recuerdos;
- notificaciones y Push;
- PWA;
- `¿Y si…?`;
- Piedra, papel o tijera;
- Dibuja;
- No lo Digas;
- puzle/vales;
- Entre tú y yo;
- integración de Nuestra Vida 1.0.

En 3.3 se añadieron además:

- catálogo ampliado a 10 servicios;
- `☕ Tomar algo`;
- `🍽️ Ir a comer / cenar`;
- exportación `.ics` para planes confirmados;
- mejoras de Inicio/Agenda;
- más contenido para Dibuja y No lo Digas;
- corrección de Dibuja para que el territorio pertenezca a quien adivina antes;
- limpieza y endurecimiento de la lógica de no repetición de `¿Y si…?`.

En **3.3.2** queda consolidada además la nueva organización de minijuegos:

- los archivos de minijuegos de JaviEats viven bajo `/minijuegos/`;
- `minigames.js`, `minigames-core.js`, `minigames-data.js` y `nuestra-vida-launcher.js` se agrupan en esa carpeta;
- **Nuestra Vida** sigue siendo una aplicación independiente dentro de `/nuestra-vida/`;
- **Entre tú y yo** queda integrado en `main` dentro de `minijuegos/entre-tu-y-yo/`;
- el nuevo juego no requiere cambios de esquema en Supabase y persiste su estado localmente.

En **3.3.3** se añade un microevento frontend-only para el 21/09/2026:

- dirigido automáticamente solo a Laura;
- activo únicamente cuando la fecha en `Europe/Madrid` es `2026-09-21`;
- popup inicial con mensaje de flores amarillas;
- CTA `🌼 Ver mis flores` que revela un ramo animado y pétalos;
- persistencia de visto mediante `localStorage`;
- acceso posterior discreto `🌼 Tus flores` durante el mismo día;
- sin tablas, RPC, Storage ni cambios de Supabase;
- encapsulado en `index.html`, reutilizando el antiguo bloque temporal del plan del 16/09;
- modo de revisión `?preview=yellow-flowers` para comprobar la experiencia sin consumir el estado de visto.

En **3.3.4** la sorpresa se conserva además como recuerdo permanente:

- nuevo recuerdo estático con id `2026-09-21-yellow-flowers`;
- título `Las flores amarillas de JaviEats`;
- aparece en la cronología de Recuerdos con emoji 🌻;
- CTA `Volver a verlo`;
- `openMemory()` detecta el tipo `yellow-flowers` y delega en `window.JaviEatsYellowFlowers.openMemory()`;
- el popup de flores tiene un modo `memoryReplay` que ignora la restricción de fecha y perfil únicamente cuando se abre desde Recuerdos;
- durante la reproducción desde Recuerdos no se escribe el `localStorage` del evento temporal;
- no hay cambios en Supabase ni en `recuerdos_app`;
- `script.js` se referencia como `?v=3.3.4` para evitar caché antigua.

En **3.3.5** se corrige la reproducción móvil del recuerdo:

- el ramo se desplaza dentro de su contenedor para evitar recorte superior en Safari/iPhone;
- el estado revelado usa un layout móvil más compacto y con más margen superior;
- en viewports bajos se reduce ligeramente el ramo y el copy;
- `restartRevealAnimations()` reinicia tallos, flores, lazo y pétalos en cada pulsación de `Ver mis flores`;
- `resetRevealScroll()` fuerza el scroll interno del modal a 0 durante la transición;
- se hace `blur()` del botón de revelado antes de ocultarlo para evitar scroll asociado al foco en Safari;
- si el sistema solicita `prefers-reduced-motion`, no se fuerza el reinicio de animaciones.

---

# QA FINAL 3.3.7

Objetivo: cerrar regresiones detectadas después de la modularización sin introducir features nuevas ni cambios de esquema.

Correcciones aplicadas:

- `app/js/plans.js` contiene ya los 10 servicios reales del catálogo.
- Se elimina de `index.html` la mutación tardía de `SERVICES`, incompatible con el array congelado del módulo.
- El arrastre horizontal del catálogo no captura el puntero en un clic simple; `Proponer` vuelve a abrir correctamente el modal en escritorio.
- `app/css/interactions.css` corrige la ruta relativa de `assets/puzzle-masaje.svg` después de mover los estilos a `/app/css/`.
- La UI v3 del puzle consume `puzzles_premio.total_piezas` y `puzzles_premio.premio` cuando existen.
- La UI v3 de Vales vuelve a mostrar fecha de obtención, descripción, código y acciones.
- Las acciones de descarga, propuesta de canje y marcado como canjeado reutilizan `app/js/rewards.js`.
- Para el vale vinculado al puzle, la fecha mostrada prioriza `puzzles_premio.completed_at`; el fallback es `vales.created_at`.
- No se modifica el esquema de Supabase.

Estado de datos verificado tras la limpieza manual del vale histórico:

- 1 vale;
- 1 puzle;
- 6 piezas;
- puzle completado coherente con su `vale_id`;
- 0 referencias rotas entre puzle, piezas y vale.

QA adicional:

- 283 IDs HTML, 0 duplicados;
- sintaxis correcta en `plans.js`, `rewards.js`, `ui.js`, `script.js` y `minijuegos.js`;
- deployments preview de la rama de QA en estado READY;
- sin errores 5xx recientes en Supabase ligados a estos dominios.

---

# CAMBIOS DE 3.3.1

3.3.1 es un refinamiento de identidad, jerarquía y recompensa emocional.

## Identidad visual

La app reutiliza el icono real de instalación/PWA como identidad del navegador en lugar de un icono genérico.

Assets relevantes:

- `assets/apple-touch-icon.png`
- `assets/icon-192.png`
- `assets/icon-512.png`

`manifest.webmanifest` y `service-worker.js` se han versionado a `3.3.1` para refrescar iconografía.

## Nuestra Vida

Nuestra Vida pasa a tener más protagonismo en Inicio:

- tarjeta grande;
- estilo oscuro propio;
- posición inmediatamente después de la prioridad principal;
- copy: `Vuestra historia continúa aquí`;
- CTA: `Seguir jugando`.

No cambia el gameplay de Nuestra Vida ni su persistencia. Solo cambia la presentación en JaviEats.

## Compatibilidad JaviEats

La compatibilidad ya no representa todo el histórico completo. Se calcula con las **últimas 20 preguntas completadas por ambos**.

Objetivo: que sea dinámica, comprensible y tenga impacto real sin castigar desacuerdos.

Regla:

- `< 75%` → 1 cambio de pregunta diario compartido;
- `>= 75%` → 2 cambios diarios compartidos;
- no son 2 por persona;
- los cambios no penalizan compatibilidad;
- una pregunta cambiada sigue contando como usada y no vuelve a salir.

La última verificación de Supabase dio:

- compatibilidad últimas 20: **80%**;
- cambios diarios permitidos: **2**;
- 20 respuestas en la muestra;
- 1 cambio usado ese día;
- backend actualizado: `true`;
- no repetición global: `true`.

## Pleno 5/5

Cuando las cinco preguntas del día coinciden:

- se reconoce explícitamente `5 de 5 · ¡PLENO! ❤️`;
- aparece una celebración visual;
- se muestra la compatibilidad actual;
- si está activa la ventaja del 75%, se recuerda que hay 2 cambios diarios compartidos;
- la celebración se marca por dispositivo/día para no repetirse constantemente.

No hay recompensa en Nuestra Vida: esta idea se descartó expresamente.

---

# `¿Y SI…?` — REGLAS IMPORTANTES

- máximo 5 preguntas completadas al día;
- respuestas ocultas hasta que ambos contestan;
- una pregunta presentada no vuelve a salir nunca;
- saltar/cambiar una pregunta también la consume para siempre;
- compatibilidad basada en las últimas 20 completadas;
- 75% o más activa 2 cambios diarios compartidos;
- por debajo de 75% se mantiene 1;
- diferencias de opinión no restan puntos artificialmente: solo alteran de forma natural la ventana móvil.

La BD es la autoridad para el número real de cambios disponibles.

---

# NUESTRA VIDA

Nuestra Vida 1.0 sigue siendo el MASTER integrado.

Puntos importantes:

- acceso mediante `nuestra-vida/index.html`;
- core del juego preservado detrás del wrapper;
- no rediseñar gameplay sin petición expresa;
- viewport prioritario: iPad 11 horizontal `1180 × 820`, luego iPad Mini `1024 × 768`, luego PC;
- el schema interno histórico de guardado sigue siendo compatible con `0.18.29`;
- contexto específico: `contextos/CONTEXTO_NUESTRA_VIDA.md`.

La 3.3.1 solo aumenta su protagonismo visual dentro de JaviEats.

En **3.3.6** se completa la navegación de integración:
- `nuestra-vida/access-gate.js` sigue validando que el acceso proceda de un perfil autorizado;
- esa misma capa añade `← Volver a JaviEats` al `screenLanding`;
- el botón no se integra dentro del core del juego y no modifica gameplay ni partidas;
- al terminar una partida y volver al landing, el retorno sigue disponible.

---

# PLANES / SERVICIOS

Catálogo lógico actual: 10 servicios.

Incluye los 8 clásicos más:

- `Tomar algo`;
- `Ir a comer / cenar`.

Los planes confirmados pueden exportarse como `.ics` para Apple Calendar.

No tocar la estructura de `propuestas` sin revisar el contexto de BD.

---

# MINIJUEGOS

## Entre tú y yo

Minijuego local para Javi y Laura, pasando un único móvil. **Integrado en `main` el 19/09/2026**.

- 8 rondas: Apuesta/Javi, Duelo/Laura, Telepatía/Javi, Elige 2/Laura, Apuesta/Laura, Duelo/Javi, Telepatía/Laura, Elige 2/Javi. El nombre indica quién predice.
- Apuesta: 4 opciones; Duelo: 2. Acierto exacto = 1 punto.
- Elige 2: exactamente 2 de 5; 0, 1 o 2 coincidencias suman 0, 0,5 o 1 punto.
- Cada persona tiene 3 pruebas de conocimiento. Porcentaje = puntos / 3, redondeado. El título de mejor novio/a depende exclusivamente de esos puntos; empate compartido.
- Telepatía: 3 emojis idénticos para ambos, sin puntos de conocimiento. La conexión secundaria muestra coincidencias sobre 2; no existe fórmula combinada aprobada.
- Batería nueva: 100 apuestas, 100 duelos, 100 Elige 2 y 36 tríos de emojis. Sin rankings.
- Guardado local versionado, historial de últimas 100 propuestas por mecánica y cubierta de privacidad al retomar respuestas.
- UI marfil/coral/lila, tarjetas ilustradas, escena de Telepatía y resultado con corona.
- No utiliza Supabase ni modifica otros minijuegos.
- Archivos: `minijuegos/entre-tu-y-yo/entre-tu-y-yo-data.js`, `minijuegos/entre-tu-y-yo/entre-tu-y-yo.js`, `minijuegos/entre-tu-y-yo/entre-tu-y-yo.css`, `minijuegos/entre-tu-y-yo/assets/illustrations.png`.
- Carga desde `minijuegos/minigames.js`, antes del core histórico y del launcher de Nuestra Vida.
- No usa Supabase ni altera otros minijuegos.
- Las pruebas automatizadas del juego y de la reorganización se ejecutaron antes de integrar la rama.
- El merge a `main` corresponde al commit `6a57d128c87ba53a827664848f6c5e7fad64f177`.

## Dibuja

Reglas clave:

- 90 segundos;
- pista automática a 45 segundos;
- primero en 3 territorios gana;
- el territorio pertenece a **quien adivina**;
- si ambos adivinan, gana el territorio quien adivina antes;
- si ninguno acierta o hay empate exacto, no hay dueño;
- quien pierde el territorio elige la siguiente categoría.

## No lo Digas

Competitivo, con turnos de 90 segundos y penalización por palabra prohibida.

## Piedra, papel o tijera

Mantiene su flujo diario y su puzle/vale.

---

# MANTENIMIENTO TÉCNICO 3.3.6

- La modularización del frontend empieza de forma incremental bajo `/app/`; no se llenará la raíz de archivos sueltos.
- Modularización de Recuerdos completada: `app/js/memories.js` concentra datos, Storage, URLs firmadas, caché, compresión, render, galería, cartas, editor, alta, edición y borrado.
- `script.js` mantiene solo los puntos de integración necesarios para la sincronización general y la API global.
- Tras extraer Recuerdos, Notificaciones, Push, Sync, Auth, Planes, ¿Y si…?, Recompensas y la capa visual v3, `script.js` queda en torno a 21 KB.
- El antiguo `style.css` (~130 KB) se divide en seis hojas bajo `app/css/`, preservando exactamente contenido y orden de cascada; `style.css` se elimina de la raíz.
- `app/js/notifications.js` concentra fetch, badge, modal, render, leído/borrado/vaciado y navegación de avisos.
- `app/js/push.js` concentra registro de Service Worker, VAPID, suscripción/desuscripción, persistencia en `push_subscriptions`, compatibilidad iOS/PWA y estado visual de Push.
- `service-worker.js` permanece separado y no se ha modificado en este corte.
- `app/js/sync.js` concentra intervalo, single-flight, reintentos, red, refresh manual y reanudación; `script.js` mantiene `runDataSync()` como coordinador de dominios pendientes de modularizar.
- `app/js/auth.js` concentra perfiles, login, restauración de sesión, validación de rol, cambio de perfil dirigido y logout. El core recibe únicamente sesiones ya validadas.
- `app/js/plans.js` concentra catálogo, operaciones Supabase sobre `propuestas`, formularios, calendario, render de reservas, acciones de estado, borrado y ticket PNG. `script.js` mantiene solo wrappers de integración y la presentación v3.
- `app/js/ysi.js` concentra pregunta/historial, compatibilidad, responder, salto, render, reveal y filtros. Home/Perfil usan sus helpers públicos en vez de lógica duplicada.
- `app/js/rewards.js` concentra Laura vs Máquina, reto diario, rondas, puzzle del masaje, piezas, contador diario, vales, canje y descarga. El dominio se mantiene unido porque comparte estado y recompensas.
- `app/js/ui.js` contiene la capa visual v3 completa que antes vivía al final de `script.js`; se carga después del coordinador y consume `window.JaviEatsApp`.
- `app/js/debug.js` es el primer módulo independiente y solo se activa con `?debug=1`.
- El panel de diagnóstico muestra estado de sesión, perfil, red, PWA, Service Worker, Push y Cache Storage sin mostrar secretos.
- La auditoría confirmó que el Service Worker principal gestiona Push pero no implementa caché propia de HTML/JS/CSS.
- Se crea `/supabase/migrations/` como historial SQL reproducible.
- Hay dos migraciones 3.3.6 preparadas: hardening de permisos internos e índices de FKs.
- Los 5 recuerdos históricos ya fueron migrados y verificados en Supabase.
- `recuerdos_app` + Storage privado son la única fuente de Recuerdos.
- Las cartas históricas viven en `contenido`; las fotos históricas están comprimidas en WebP.
- Se eliminaron `MEMORIES`, `/recuerdos/` y el migrador temporal.
- El frontend conserva soporte remoto para galerías, cartas y la experiencia especial de flores amarillas.
- Esas migraciones no deben darse por aplicadas en producción hasta comprobar su ejecución real en Supabase.

---

# FORMA DE TRABAJAR

Reglas permanentes:

1. revisar `main` antes de cualquier write;
2. no inventar que algo está desplegado o probado;
3. no crear archivos auxiliares salvo necesidad real;
4. si se toca un archivo de código y el usuario pide reemplazo, entregar el archivo completo;
5. no romper comportamiento aprobado al arreglar otra cosa;
6. Supabase y frontend deben quedar sincronizados;
7. cualquier cambio de BD debe actualizar `CONTEXTO_BASE_DATOS.md`;
8. responder en español, directo y natural.

---

# ESTADO DE VERIFICACIÓN

A 22/09/2026:

- microevento de flores amarillas: **implementado en rama**;
- activación por fecha Madrid y perfil Laura: **implementada**;
- persistencia local de visto y acceso posterior: **implementada**;
- código temporal del 16/09: **sustituido**;
- Supabase/base de datos: **sin cambios**;
- README y contexto maestro: **actualizados**;
- integración prevista en `main` mediante PR #4;
- deployment de la rama: **Vercel success**;
- prueba real en iPhone/PWA: **verificación separada del deployment**.
- recuerdo permanente de flores amarillas: **implementado en rama 3.3.4**;
- reproducción fuera del día 21 mediante modo `memoryReplay`: **implementada**;
- Supabase/base de datos: **sin cambios**.
- composición móvil del recuerdo de flores amarillas: **corregida en rama 3.3.5**;
- animaciones de flores amarillas: **reinicio explícito implementado**.

# RESUMEN

**JaviEats 3.3.7 = JaviEats 3.3.6 + cierre de regresiones post-modularización en Planes, Puzle y Vales + QA de integración frontend ↔ Supabase.**

## CSS modular · 3.3.6

Estructura actual:

- `app/css/base.css`
- `app/css/interactions.css`
- `app/css/minigames.css`
- `app/css/memories.css`
- `app/css/notifications.css`
- `app/css/ui.css`

La concatenación de estas seis hojas en ese orden es exactamente equivalente al antiguo `style.css`. `index.html` las carga en ese mismo orden con `?v=3.3.6`.

## Mantenimiento 3.3.6 · seguridad aplicada

Migraciones aplicadas en producción:

1. `harden_internal_function_permissions`
2. `add_missing_fk_indexes`
3. `optimize_rls_auth_uid`

Resultado verificado con Supabase Advisors:

- 0 avisos de funciones internas `SECURITY DEFINER` ejecutables por `anon`;
- 0 avisos `auth_rls_initplan`;
- los RPC de negocio autenticados siguen ejecutables intencionadamente;
- `pg_net` en `public` y leaked-password protection quedan pendientes de revisión separada.

Limpieza legacy adicional:

- eliminado el sistema de estreno/contador del 12/09 para Nuestra Vida;
- eliminado el modal “misterio” y sus estilos;
- Nuestra Vida queda como acceso estable;
- el launcher ya no tiene release gate ni polling de desbloqueo.


## Service Worker/cache · mantenimiento 3.3.6

- SW principal: Push únicamente; no cachea HTML/JS/CSS.
- Nuestra Vida: SW propio con navegación network-first y assets cache-first.
- Cache actual: `nuestra-vida-1.0.2-maintenance`.
- El activate elimina caches `nuestra-vida-*` anteriores.
- Launcher actual: `./nuestra-vida/?v=1.0.2`.

Pendientes de seguridad separados:
- revisar movimiento de `pg_net` fuera de `public`;
- activar leaked-password protection desde Auth;
- decidir explícitamente el tratamiento de tablas internas con RLS sin policy.


## Cierre técnico 3.3.6 · diagnóstico/QA

- `app/js/debug.js` ampliado con sync, Push, módulos, contadores y errores recientes.
- `app/js/sync.js` mantiene diagnóstico de última sync, duración, motivo y fallos.
- `app/js/auth.js` recupera sesiones locales con refresh token obsoleto.
- `index.html` usa cache-busting 3.3.6 también en minigames.
- QA HTML: 283 IDs, 0 duplicados.
- Todos los recursos JS/CSS locales enlazados por index existen.
- Logs Supabase últimas 24 h: 0 errores sospechosos en Edge, Postgres, PostgREST, Storage y Functions.
- Auth: solo warnings esperables por credenciales inválidas/sesiones antiguas; se añadió recuperación específica.
- Vercel: builds recientes bloqueados por build-rate-limit; último deploy exitoso detectado en commit `ce1bae4`.


## QA integral post-modularización · 3.3.6

Hallazgos y correcciones verificadas:

- restaurado el helper `settledSyncValue()` del coordinador de sincronización;
- eliminadas referencias duplicadas `rewardsModule().rewardsModule()`;
- corregida la bienvenida de Laura para leer el total del puzzle desde `JaviEatsRewards`;
- eliminado código auxiliar muerto del antiguo monolito;
- eliminado el gate temporal del 30/08 de Dibuja/No lo digas y su polling de 1 s;
- cache-busting dinámico de minijuegos alineado con 3.3.6;
- Nuestra Vida y su MiniLab vuelven a estar realmente protegidos por sesión y tienen ruta explícita de salida a JaviEats.

## Nuestro 24 · Hero 3.4.2

El hero usa tres paneles reales: ramo izquierdo, selfie central y ramo derecho. Los ramos son assets privados obtenidos mediante RPC autenticado. Responsive: tríptico completo en tablet/escritorio y franjas florales laterales en móvil. La entrada del día incluye una intro full-screen automática una vez por sesión/edición antes de mostrar Inicio.

## Nuestro 24 · escenas fotográficas 3.4.3

Septiembre añade assets privados a cuatro escenas: 12/09 cocinitas, 16/09 atardecer, 19/09 Laura y 20/09 perritos. El 24/09 no tiene fotografía. En móvil la timeline elimina su carril lateral y renderiza cada escena a ancho completo para ganar espacio útil. Las fotos privadas se cargan por RPC autenticado y mantienen los efectos ligeros de cada escena.



## Nuestro 24 · 3.4.6
La experiencia queda consolidada en una única hoja CSS limpia. El hero mantiene el collage ramo/selfie/ramo y la intro automática. La cronología usa las cuatro fotografías privadas y tres ilustraciones SVG ligeras para 1/09, 21/09 y 24/09, sin animaciones infinitas.

Los assets privados se cargan por edición mediante public.obtener_nuestro24_assets(date) y se identifican por la clave compuesta (edition_date, asset_key), por lo que futuros meses pueden reutilizar nombres locales sin sobrescribir el histórico. El replay de un recuerdo archivado solicita los assets de su propia fecha. Se corrige además el fallback de medianoche para que Laura no vea preview tras el release.

send-push está en v4 y reconoce nuestro24. El preview de Javi se limita al día anterior y al propio 24; Laura sigue bloqueada hasta el release. Desde el día 25 los archivos históricos no dependen de enabled. El aviso continúa desarmado hasta aprobación explícita; main no se modifica hasta completar QA y validación visual.
