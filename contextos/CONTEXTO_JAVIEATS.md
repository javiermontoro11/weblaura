# CONTEXTO MAESTRO — JAVIEATS 3.3.6

> **Ámbito:** contexto funcional y técnico general de JaviEats.
>
> Para Supabase/base de datos usar `contextos/CONTEXTO_BASE_DATOS.md`.
>
> Para Nuestra Vida usar `contextos/CONTEXTO_NUESTRA_VIDA.md`.
>
> **Repositorio:** `javiermontoro11/weblaura`
>
> **Rama:** `main`
>
> **Estado de referencia:** 22 de septiembre de 2026 · JaviEats 3.3.6 · inicio de fase de mantenimiento técnico; Nuestra Vida mantiene su core 1.0 y ya dispone de retorno explícito a JaviEats desde su menú principal.

---

# PROMPT PARA CONTINUAR EN UN CHAT NUEVO

Quiero que continúes el desarrollo y mantenimiento de **JaviEats 3.3.6** sin empezar de cero.

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
- `recuerdos/`

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

**JaviEats 3.3.6 = JaviEats 3.3.5 + inicio de mantenimiento técnico y retorno explícito desde el menú de Nuestra Vida a JaviEats, sin cambios de gameplay ni Supabase.**