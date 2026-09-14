# CONTEXTO MAESTRO — JAVIEATS 3.2 + NUESTRA VIDA 1.0

> **Uso:** si se pierde el contexto de este chat, pega este documento completo en una conversación nueva antes de continuar el proyecto.
>
> **Estado de referencia:** 12 de septiembre de 2026, integración de **Nuestra Vida 1.0** dentro de **JaviEats 3.2**.

---

# PROMPT PARA CONTINUAR EL PROYECTO EN UN CHAT NUEVO

Quiero que continúes conmigo el desarrollo y mantenimiento de mi proyecto privado **JaviEats**, actualmente en la versión lógica/producto **3.2**.

La novedad principal de JaviEats 3.2 es la integración del juego completo **Nuestra Vida 1.0** dentro del mismo repositorio y flujo de acceso.

No empieces el proyecto de cero. No rediseñes JaviEats ni Nuestra Vida sin que yo lo pida. Antes de modificar cualquier cosa, revisa siempre el estado real del repositorio GitHub y considera `main` como fuente de verdad.

Repositorio:

`javiermontoro11/weblaura`

Rama principal:

`main`

La filosofía sigue siendo:

**ESTABILIDAD > CAMBIOS GRANDES**

Cuando algo ya funciona, se toca únicamente de forma quirúrgica.

---

# 1. ESTADO GENERAL ACTUAL

## JaviEats

Versión actual de producto:

**JaviEats 3.2**

La 3.2 parte de la 3.1 y añade como hito principal:

- integración real de Nuestra Vida,
- acceso desde JaviEats,
- desbloqueo diferenciado por perfil,
- protección del acceso directo antes del estreno,
- identidad visual del juego dentro de la navegación.

Los ficheros principales de JaviEats siguen siendo, entre otros:

- `index.html`
- `script.js`
- `style.css`
- `minigames-data.js`
- `minigames.js`
- `minigames-core.js`
- `nuestra-vida-launcher.js`
- `service-worker.js`
- `manifest.webmanifest`
- `assets/`
- `recuerdos/`
- `nuestra-vida/`

IMPORTANTE: algunos query strings de assets pueden seguir indicando `v=3.1`. No asumir automáticamente que hay que cambiar todos esos valores solo porque el producto se denomine 3.2. La 3.2 identifica el estado funcional de la aplicación después de integrar Nuestra Vida.

---

# 2. NUESTRA VIDA — MASTER ACTUAL

La versión del juego integrada es:

**Nuestra Vida 1.0**

La release original fue:

`Nuestra_Vida_1.0_RELEASE.zip`

Nuestra Vida 1.0 se considera **MASTER**.

No rediseñar el juego ni modificar gameplay porque sí.

Si en el futuro aparece un bug del juego, las siguientes versiones deberán ser incrementales, por ejemplo:

- `Nuestra Vida 1.0.1`
- `Nuestra Vida 1.0.2`

El documento específico y detallado del juego está en:

`/nuestra-vida/CONTEXTO_NUESTRA_VIDA_1.0.md`

Ese documento contiene todo el historial de diseño, cámara, HUD, mapa, audio, economía, tutorial, jubilación, responsive, personajes, decisiones cerradas y filosofía de mantenimiento de Nuestra Vida.

Antes de cambiar el juego, leer ese archivo.

---

# 3. ESTRUCTURA ACTUAL DE `/nuestra-vida/`

Actualmente Nuestra Vida está físicamente dentro del repositorio.

La carpeta contiene la release y sus assets, incluyendo:

- `nuestra-vida/index.html`
- `nuestra-vida/nv-core-1-0-8c6f2a.html`
- `nuestra-vida/CONTEXTO_NUESTRA_VIDA_1.0.md`
- `nuestra-vida/README_1.0.txt`
- `nuestra-vida/QA_1.0.json`
- `nuestra-vida/manifest.webmanifest`
- `nuestra-vida/sw.js`
- `nuestra-vida/access-gate.js`
- `nuestra-vida/assets23/`
- `nuestra-vida/assets25/`
- `nuestra-vida/assets26/`
- `nuestra-vida/audio27/`
- `nuestra-vida/icons/`

Los assets de la release fueron subidos al repositorio por tandas desde GitHub web.

No volver a pedir el ZIP si los archivos siguen correctamente en `main`.

---

# 4. ARQUITECTURA DE LA INTEGRACIÓN DE NUESTRA VIDA

## Muy importante

El antiguo `nuestra-vida/index.html` de la release no es ahora el punto de entrada directo al gameplay.

Para proteger el estreno se hizo una separación:

### `nuestra-vida/index.html`

Es el **wrapper / puerta de acceso**.

Su función es:

1. detectar qué perfil de JaviEats tiene sesión,
2. decidir si ese perfil puede entrar,
3. enseñar cuenta atrás cuando corresponda,
4. cargar el juego real solo cuando el acceso está permitido.

### `nuestra-vida/nv-core-1-0-8c6f2a.html`

Contiene el **juego Nuestra Vida 1.0 real**.

Se creó a partir del `index.html` original del juego para no contaminar el gameplay con la lógica de estreno.

La filosofía es mantener este core lo más intacto posible.

El wrapper carga el core mediante `fetch(..., { cache: "no-store" })` y después sustituye el documento con el HTML del juego.

No reconstruir esta arquitectura sin necesidad.

---

# 5. FECHA DE ESTRENO Y ACCESO POR PERFIL

La hora de estreno acordada es:

**12 de septiembre de 2026 a las 14:00, hora de Madrid.**

En código se representa como:

`2026-09-12T12:00:00Z`

que corresponde a las 14:00 en Europe/Madrid ese día.

## Antes de las 14:00

### Perfil Javi

Javi puede:

- ver `Nuestra Vida` en la navegación,
- ver el icono final del juego,
- pulsar la pestaña,
- acceder al juego completo.

La preview privada de Javi existe para poder probar el estreno antes de Laura.

### Perfil Laura

Laura debe:

- seguir viendo `12·09` en la navegación,
- seguir viendo el teaser/cuenta atrás,
- NO poder entrar al juego desde la pestaña,
- NO poder saltarse el bloqueo escribiendo directamente `/nuestra-vida/`.

Si Laura accede directamente a `/nuestra-vida/` antes de las 14:00, el wrapper muestra una pantalla de Nuestra Vida con cuenta atrás y enlace para volver a JaviEats.

## A partir de las 14:00

Para Laura debe ocurrir automáticamente:

- termina la cuenta atrás,
- el acceso queda permitido,
- el nombre de navegación pasa a `Nuestra Vida`,
- aparece el icono final corazón + flecha,
- puede entrar al mismo juego que Javi,
- el acceso directo a `/nuestra-vida/` deja de estar bloqueado.

No debe hacer falta un commit ni un despliegue manual a las 14:00.

La lógica se basa en la hora del cliente y se vuelve a comprobar periódicamente.

---

# 6. NAVEGACIÓN DE JAVIEATS Y REVEAL

En `script.js` ya existe la lógica original del reveal mediante:

- `REVEAL_AT`
- `updateRevealState()`
- comprobación de rol
- temporizador periódico

La regla actual es aproximadamente:

- `revealed = ahora >= REVEAL_AT || perfil === "javi" antes del estreno`

Por eso Javi ve la versión final antes que Laura.

Para Laura antes del estreno:

- label: `12·09`
- teaser y contador activos.

Tras el estreno:

- label: `Nuestra Vida`
- estado `is-revealed`
- icono final del juego.

---

# 7. LOGO / ICONO APROBADO DE NUESTRA VIDA

La identidad visual aprobada es:

**corazón coral integrado con una flecha hacia arriba/derecha ↗**

Características:

- coral/salmón,
- limpio,
- plano,
- sin gradiente,
- sin halo gigante,
- sin cuadrado naranja enorme,
- mismo peso visual que el resto de pestañas de JaviEats.

En la navbar se usa el icono `life` que ya existe en `script.js`.

En estado revelado se ocultan los pseudo-elementos antiguos del teaser naranja y se utiliza el corazón + flecha coral.

No volver a la estética del gran botón naranja de misterio una vez revelado.

---

# 8. LANZADOR DE NUESTRA VIDA DESDE JAVIEATS

Existe:

`/nuestra-vida-launcher.js`

Su función es conectar JaviEats con:

`./nuestra-vida/`

Define la URL real mediante:

`window.JAVIEATS_MAIN_GAME_URL`

También sincroniza un marcador del rol actual para que la puerta de Nuestra Vida sepa si viene Javi o Laura.

El lanzador permite entrada inmediata a Javi y respeta el estreno de Laura.

Actualmente se carga desde la secuencia de minijuegos.

---

# 9. CAMBIO TÉCNICO EN `minigames.js`

Durante la integración se evitó editar de forma insegura un fichero grande desde el conector.

La estructura actual es deliberada:

### `minigames-core.js`

Contiene el código anterior completo de Minijuegos.

### `minigames.js`

Ahora es un cargador pequeño que hace:

1. cargar `minigames-core.js?v=3.1`,
2. cuando termina, cargar `nuestra-vida-launcher.js?v=1.0`.

No asumir que `minigames.js` está roto por ser corto.

No volver a fusionar `minigames-core.js` dentro de `minigames.js` salvo que haya una razón real y se valide todo después.

Los minijuegos existentes deben seguir funcionando igual.

---

# 10. CONTROL DE ACCESO DE NUESTRA VIDA

Existe también:

`/nuestra-vida/access-gate.js`

Pero la puerta de acceso que debe considerarse **autoritativa en el estado actual** está implementada directamente en:

`/nuestra-vida/index.html`

El wrapper detecta la sesión de JaviEats/Supabase y el perfil correspondiente.

Reglas:

- Javi → permitido antes y después de las 14:00.
- Laura → bloqueada antes de las 14:00; permitida después.
- perfil desconocido/sin sesión → no cargar juego; pedir volver a JaviEats e iniciar sesión.

No introducir IDs personales en documentación nueva si no son imprescindibles. El código ya contiene lo necesario para mapear las sesiones.

---

# 11. COMMITS IMPORTANTES DE LA INTEGRACIÓN

Commits relevantes alrededor de JaviEats 3.2:

### Subida de la release

Varios commits `Add files via upload` subieron los assets de Nuestra Vida a `/nuestra-vida/`.

Uno de los últimos commits de assets fue:

`63f5da7a9b2671fc28b8b4e04625c1b55bba7294`

### Control de acceso

`7988e2e311881ac4a6bdbcc536ea725b59bd1715`

Mensaje:

`Añadir control de acceso de Nuestra Vida`

### Lanzador

`fde6278415dbc6580b77c34ce993d0f34c524ccf`

Mensaje:

`Conectar lanzador de Nuestra Vida`

### Integración en JaviEats

`533938143a3c89c8fdfb473186c46f2dc3ad55f8`

Mensaje:

`Integrar acceso de Nuestra Vida en JaviEats`

### Puerta definitiva para Laura hasta las 14:00

`793cc2b2c4970af11c97eed169a2b79fdaf602e5`

Mensaje:

`Bloquear Nuestra Vida para Laura hasta las 14:00`

Este commit convirtió `nuestra-vida/index.html` en el wrapper de acceso y preservó el juego en `nv-core-1-0-8c6f2a.html`.

---

# 12. QUÉ ESTÁ CONFIRMADO Y QUÉ NO

## Confirmado en GitHub

Se comprobó que `main` contiene:

- `nuestra-vida/index.html`,
- el core del juego,
- carpetas `assets23`, `assets25`, `assets26`,
- `audio27`,
- `icons`,
- manifest,
- service worker,
- QA,
- README,
- contexto del juego,
- lanzador de JaviEats,
- control de acceso.

También está confirmada por inspección de código la lógica de:

- reveal de Javi/Laura,
- cuenta atrás,
- desbloqueo horario,
- cambio de icono/nombre,
- protección de `/nuestra-vida/`.

## Importante sobre producción

No confundir:

- **GitHub correcto**, con
- **Vercel desplegado y probado realmente en navegador**.

En el momento de cerrar este contexto, GitHub `main` contiene la integración.

Si algo no aparece en producción, antes de tocar código:

1. comprobar el deployment de Vercel,
2. comprobar que está sirviendo el último commit de `main`,
3. probar recarga fuerte / caché PWA,
4. comprobar consola y Network,
5. solo después modificar código.

Nunca afirmar que Vercel fue probado visualmente si no se ha abierto de verdad.

---

# 13. HOME DE JAVIEATS

No asumir que existe una tarjeta grande específica de Nuestra Vida en Inicio solo porque se habló de ella durante el diseño.

En el estado actual confirmado, la integración principal está realizada mediante la **pestaña especial de la navegación** y el launcher.

Si se desea añadir en el futuro una tarjeta de Inicio para Nuestra Vida, hacerlo como mejora posterior de JaviEats 3.2.x, sin romper la navegación existente.

Diseño deseado si se añade:

- tarjeta oscura elegante,
- icono coral corazón + flecha,
- título `Nuestra Vida`,
- copy breve,
- CTA `Jugar ahora →`,
- respetar exactamente las mismas reglas de acceso por perfil y fecha.

No añadir un CTA que permita saltarse la puerta de acceso.

---

# 14. NUESTRA VIDA: NO ROMPER LA RELEASE 1.0

Reglas fundamentales:

- `nv-core-1-0-8c6f2a.html` representa el juego MASTER integrado.
- No editar gameplay para implementar funciones de JaviEats si se puede resolver desde wrapper/launcher.
- No cambiar el schema interno de guardado solo porque el producto sea 1.0.
- El schema histórico de guardado de Nuestra Vida sigue teniendo compatibilidad con `0.18.29` según el contexto específico del juego.
- No rehacer mapa, HUD, cámara, economía, audio o tutorial por iniciativa propia.
- Si aparece un bug, sacar patch incremental.

Viewport prioritario del juego:

1. iPad 11 horizontal — `1180 × 820`
2. iPad Mini — `1024 × 768`
3. PC

---

# 15. JAVIEATS — COSAS QUE SIGUEN SIENDO IMPORTANTES

JaviEats mantiene:

- Supabase,
- autenticación persistente,
- roles Javi/Laura,
- propuestas/planes,
- calendario compartido,
- recuerdos,
- notificaciones,
- PWA,
- Push,
- minijuegos,
- ¿Y si…?,
- Piedra, papel o tijera,
- Dibuja,
- No lo digas,
- puzle/vales.

No romper estas funciones por tocar Nuestra Vida.

La navegación final relevante es:

`Inicio | Planes | Nuestra Vida | Minijuegos | Recuerdos`

Antes del estreno, para Laura, el tercer elemento sigue representado como `12·09`.

---

# 16. FORMA DE TRABAJAR CON EL USUARIO

El usuario quiere resultados reales, no propuestas ficticias.

Reglas:

1. Si puedes modificar GitHub directamente, hazlo cuando se haya pedido expresamente.
2. Antes de decir “ya está”, comprobar el repositorio.
3. Distinguir siempre entre:
   - código escrito,
   - código subido a GitHub,
   - despliegue de producción,
   - prueba real en navegador,
   - prueba real en iPad.
4. No afirmar que algo está probado si solo se ha revisado estáticamente.
5. Cambios pequeños e incrementales.
6. No romper algo aprobado al arreglar otra cosa.
7. Responder en español.
8. Tono natural y directo.
9. No generar mockups/imágenes cuando el usuario pide cambios reales de la aplicación.
10. Si el usuario dice que una versión le encanta o que algo queda cerrado, tratarlo como base estable.

---

# 17. VERSIONADO DESDE AHORA

La aplicación global queda identificada como:

**JaviEats 3.2**

Nuestra Vida integrada mantiene su propio versionado:

**Nuestra Vida 1.0**

Si el siguiente cambio es pequeño y afecta JaviEats:

- `3.2.1`

Si el siguiente cambio es un bug específico del juego:

- `Nuestra Vida 1.0.1`

No mezclar ambos versionados innecesariamente.

---

# 18. PRIMERA COMPROBACIÓN EN UN CHAT NUEVO

Si te doy este documento en otro chat, antes de hacer cambios debes confirmar brevemente que entiendes:

- que JaviEats está en 3.2,
- que Nuestra Vida 1.0 ya está integrada en GitHub,
- que `main` es la fuente de verdad,
- que Laura tiene estreno a las 14:00 del 12/09/2026,
- que Javi dispone de acceso previo,
- que `nuestra-vida/index.html` es la puerta de acceso,
- que `nv-core-1-0-8c6f2a.html` es el juego real,
- que el corazón + flecha coral es la identidad final,
- que el juego MASTER no debe rediseñarse,
- y que cualquier nueva modificación debe ser incremental.

Después, si la tarea implica el estado actual del código, **comprueba GitHub antes de responder basándote solo en este documento**, porque el repositorio puede haber avanzado después de su creación.

---

# 19. RESUMEN EJECUTIVO

Estado actual:

**JaviEats 3.2 = JaviEats 3.1 + integración de Nuestra Vida 1.0.**

Nuestra Vida está dentro de `/nuestra-vida/` con todos sus assets.

El acceso actual está diseñado así:

**Javi → puede jugar antes del estreno.**

**Laura → teaser `12·09` y cuenta atrás antes de las 14:00.**

**Laura → acceso automático a partir de las 14:00 del 12/09/2026.**

La URL directa del juego también está protegida antes del estreno.

El juego real está preservado en un core separado detrás de la puerta de acceso.

El siguiente trabajo debe centrarse en:

- prueba real de producción,
- feedback real de Javi/Laura,
- bugs concretos,
- patches pequeños,
- mantenimiento.

No hay que volver a empezar ni rehacer la integración.
