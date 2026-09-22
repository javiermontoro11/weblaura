# JaviEats 💌

**Versión de producto: 3.3 — ESTABLE**  
**Mantenimiento actual: 3.3.6**

JaviEats es una aplicación web privada creada para Laura y Javi. Reúne planes compartidos, recuerdos, minijuegos, actividad, notificaciones y un espacio común pensado para funcionar como una PWA en móvil, tablet y escritorio.

JaviEats 3.3.6 mantiene **Nuestra Vida 1.0** como experiencia principal independiente y abre una fase de mantenimiento técnico. Como primer ajuste, completa la navegación de Nuestra Vida con un retorno explícito a JaviEats desde su menú principal, sin modificar el core del juego.

> **Estado actual:** `main` es la fuente de verdad. JaviEats 3.3.6 inicia una fase centrada en mantenimiento, seguridad, arquitectura y estabilidad. Nuestra Vida conserva su core 1.0 y añade el retorno a JaviEats desde la capa de integración `access-gate.js`.

---

## 🚀 JaviEats 3.3.6

La 3.3 mantiene la filosofía del proyecto:

**ESTABILIDAD > CAMBIOS GRANDES**

Cuando una función ya está validada, los cambios deben ser pequeños, incrementales y compatibles con lo que ya funciona.

### Estado actual de la 3.3.6

- base funcional de JaviEats 3.1 conservada;
- navegación final `Inicio · Planes · Nuestra Vida · Minijuegos · Recuerdos`;
- Perfil/Nosotros desde la cabecera;
- integración de Nuestra Vida dentro del mismo repositorio;
- launcher independiente entre JaviEats y Nuestra Vida;
- estreno programado originalmente para el 12/09/2026 a las 14:00 en Madrid;
- restauración del acceso jugable después del estreno mediante hotfix 3.2.1;
- control de caché añadido al acceso a Nuestra Vida;
- zona de pruebas de los minijuegos de Nuestra Vida accesible desde el hub de Minijuegos;
- Push de Planes y `¿Y si…?`;
- sincronización resistente con fallos parciales y reintentos;
- Planes compartidos en Supabase;
- Recuerdos privados con varias fotografías;
- PWA instalable con Service Worker y Web Push;
- autenticación persistente para Javi y Laura;
- catálogo de 10 servicios, incluyendo `☕ Tomar algo` y `🍽️ Ir a comer / cenar`;
- exportación `.ics` para planes confirmados;
- mejoras de Inicio/Agenda y refinamientos de `¿Y si…?`;
- reorganización física de todos los archivos propios de minijuegos bajo `/minijuegos/`;
- integración en producción de **Entre tú y yo**, con 8 rondas y cuatro mecánicas, sin dependencia de Supabase.
- microevento efímero de flores amarillas para Laura el 21/09/2026, limitado por fecha de Madrid, con persistencia local de visto y sin tocar Supabase.
- recuerdo permanente `Las flores amarillas de JaviEats`, accesible desde Recuerdos y capaz de volver a reproducir la experiencia animada fuera del 21/09.
- corrección de la reproducción móvil del recuerdo: ramo centrado sin recorte superior, layout compacto y reinicio explícito de tallos, flores, lazo y pétalos en cada reproducción.

---

## 🧭 Navegación actual

### Cabecera

- Actividad / notificaciones.
- Perfil / Nosotros.

### Barra inferior

```text
Inicio
Planes
Nuestra Vida
Minijuegos
Recuerdos
```

`Nosotros` permanece dentro de Perfil y no ocupa una pestaña inferior.

La pestaña central se utilizó antes del estreno como acceso especial `12·09`. Tras el lanzamiento de la 3.2 representa directamente **Nuestra Vida**.

---

## ❤️ Integración de Nuestra Vida

Nuestra Vida se mantiene como módulo independiente dentro del repositorio para evitar acoplar su gameplay al core principal de JaviEats.

### Piezas principales

- `minijuegos/nuestra-vida-launcher.js` conecta la navegación de JaviEats con el juego;
- `window.JAVIEATS_MAIN_GAME_URL` contiene la URL utilizada para abrir Nuestra Vida;
- el launcher sincroniza el perfil activo de JaviEats antes de entrar;
- `/nuestra-vida/` contiene la release y sus recursos;
- `nuestra-vida/nv-core-1-0-8c6f2a.html` se conserva como core/master de referencia de Nuestra Vida 1.0;
- `nuestra-vida/minijuegos.html` permite abrir una zona de pruebas de los minijuegos del juego principal;
- `nuestra-vida/access-gate.js` mantiene la validación de acceso y añade la integración de salida `← Volver a JaviEats` en el menú principal de Nuestra Vida, sin alterar su gameplay.

Durante el estreno se utilizó una puerta de acceso específica para controlar la revelación por fecha y perfil. Después del lanzamiento se aplicaron hotfixes 3.2.1 para restaurar el acceso jugable y evitar que Safari/PWA reutilizara una versión antigua cacheada.

Por ese motivo, la arquitectura provisional descrita durante el estreno no debe asumirse automáticamente como el estado actual: **antes de modificar Nuestra Vida hay que comprobar siempre `main`.**

### Carga desde JaviEats

`minijuegos/minigames.js` actúa actualmente como un cargador pequeño:

1. carga `minijuegos/minigames-core.js`, donde vive la lógica histórica de los minijuegos de JaviEats;
2. carga `minijuegos/nuestra-vida-launcher.js`, que conecta JaviEats con Nuestra Vida y su zona de pruebas.

Esta separación es deliberada. No se debe volver a fusionar todo dentro de `minijuegos/minigames.js` sin una razón técnica real y QA posterior.

### Versionado independiente

JaviEats y Nuestra Vida mantienen versionados distintos:

```text
JaviEats 3.3 / mantenimiento 3.3.6
Nuestra Vida 1.0 / patches propios cuando sean necesarios
```

Un bug de Nuestra Vida no obliga a cambiar el número principal de JaviEats, y un ajuste del shell de JaviEats no debe implicar rediseñar el juego.

---

## 🔔 Push y Actividad

### Planes

Los avisos importantes contemplados son:

- nueva propuesta;
- aceptación;
- rechazo;
- cancelación;
- cambio importante de fecha u hora.

Los cambios menores y el estado `realizada` no generan Push.

### ¿Y si…?

Se utiliza Push para:

- avisar de que el otro ya respondió y ahora te toca;
- avisar del resultado final después de completar la quinta pregunta del día.

El correo de turno queda únicamente como respaldo cuando el destinatario no dispone de Push activo.

### Destinos

```text
Push de Planes → ?open=plans → Planes
Push de ¿Y si…? → ?open=ysi → ¿Y si…?
Push de prueba → Inicio
```

---

## 🔄 Sincronización robusta

La sincronización principal vive directamente dentro de `script.js`.

Características:

- cargas relevantes independientes;
- `Promise.allSettled` para evitar que un fallo parcial rompa toda la actualización;
- conservación del último dato válido cuando falla una sección;
- bloqueo de sincronizaciones simultáneas;
- reintentos automáticos a 2 s, 5 s y 10 s;
- reacción al evento `online`;
- actualización al volver a primer plano;
- recuperación desde BFCache mediante `pageshow`;
- refresco manual pulsando el estado de sincronización.

Estados previstos:

```text
Sincronizando…
Sin conexión · reintentando…
Sincronización parcial · reintentando…
Sincronizado · HH:MM
```

---

## 🗓️ Planes

El catálogo principal mantiene **diez servicios**. A los ocho servicios históricos se añadieron `☕ Tomar algo` y `🍽️ Ir a comer / cenar`.

Los planes confirmados pueden exportarse como archivo `.ics`, pensado para añadirlos con facilidad a Apple Calendar y otros calendarios compatibles.

En móvil el catálogo se recorre con swipe y en escritorio puede desplazarse manteniendo pulsado el botón izquierdo del ratón y arrastrando lateralmente.

Formspree ya no forma parte del flujo actual de propuestas. Los Planes se guardan en Supabase y utilizan el sistema de Actividad/Push.

Ambos perfiles pueden trabajar con propuestas y planes compartidos desde el calendario de JaviEats.

---

## 🎮 Minijuegos

JaviEats mantiene cinco minijuegos propios:

- `¿Y si…?`;
- `Piedra, papel o tijera`;
- `Dibuja`;
- `No lo digas`;
- `Entre tú y yo`.

Además, se mantiene una entrada de laboratorio para probar directamente los minijuegos de Nuestra Vida sin iniciar una partida completa del juego principal.

### Separación actual

- `minijuegos/minigames-data.js` contiene las baterías y datos históricos;
- `minijuegos/entre-tu-y-yo/` contiene íntegramente el nuevo juego Entre tú y yo;
- `minijuegos/minigames-core.js` contiene la lógica histórica de los minijuegos de JaviEats;
- `minijuegos/minigames.js` carga el core y después el launcher de Nuestra Vida;
- Nuestra Vida conserva su lógica propia dentro de `/nuestra-vida/`.

El juego principal no debe mezclarse dentro del core de los minijuegos salvo que exista una necesidad técnica concreta.

### Entre tú y yo

Integrado en `main` el **19/09/2026**.

- partida presencial para Javi y Laura pasando un único móvil;
- 8 rondas;
- cuatro mecánicas: **Apuesta**, **Duelo**, **Telepatía** y **Elige 2**;
- batería propia: 100 apuestas, 100 duelos, 100 propuestas de Elige 2 y 36 tríos de emojis;
- estado e historial guardados localmente;
- no utiliza Supabase ni modifica la persistencia de los demás minijuegos;
- interfaz marfil/coral/lila con ilustraciones propias;
- archivos encapsulados dentro de `minijuegos/entre-tu-y-yo/`.

La carga se realiza desde `minijuegos/minigames.js`: primero se cargan los datos y la lógica de Entre tú y yo, después el core histórico y finalmente el launcher de Nuestra Vida.

---

## 📸 Recuerdos

Recuerdos utiliza ahora una única fuente de verdad en Supabase:

- metadatos y contenido en `public.recuerdos_app`;
- fotografías en el bucket privado `recuerdos`;
- creación, edición y eliminación compartida para Javi y Laura;
- varias fotografías por recuerdo;
- compresión en dispositivo;
- URLs firmadas temporales;
- cartas almacenadas en `contenido`;
- flores amarillas registradas en Supabase pero con experiencia visual especial en frontend.

Los cinco recuerdos históricos que antes vivían en `script.js` + `/recuerdos/` fueron migrados y sus copias locales se retiraron del repositorio.

---

## 👤 Perfil / Nosotros

Perfil/Nosotros reúne:

- compatibilidad acumulada de `¿Y si…?`;
- progreso del puzle;
- recuerdos;
- vales/premios;
- configuración Push del dispositivo;
- cierre de sesión.

La campana de Actividad continúa separada en la cabecera.

---

## 📱 PWA

JaviEats mantiene:

- `manifest.webmanifest`;
- `display: standalone`;
- Apple Web App metadata;
- `viewport-fit=cover`;
- safe areas;
- `service-worker.js`;
- Web Push;
- iconos de 192 px, 512 px y Apple Touch Icon.

El Service Worker principal gestiona la recepción de Push y la apertura de los destinos correspondientes dentro de JaviEats. En la auditoría 3.3.6 se confirmó que el Service Worker principal **no implementa actualmente una caché propia de HTML/JS/CSS**.

Algunas referencias de assets continúan utilizando query strings `?v=3.1`. Esto no significa que la aplicación siga en 3.1: esas referencias se mantienen mientras no exista una razón técnica para invalidarlas.

Las variantes maskable independientes continúan aplazadas para una fase posterior de pulido.

---

## 🧩 Estructura actual

```text
JaviEats/
├── README.md
├── index.html
├── style.css
├── script.js
├── manifest.webmanifest
├── service-worker.js
├── favicon.ico
├── app/\n│   └── js/\n│       ├── debug.js
│       ├── memories.js
│       ├── notifications.js
│       ├── push.js
│       ├── sync.js
│       ├── auth.js
│       ├── plans.js
│       ├── ysi.js
│       ├── rewards.js
│       └── ui.js\n├── assets/
│   ├── apple-touch-icon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   └── puzzle-masaje.svg
├── contextos/
│   ├── CONTEXTO_JAVIEATS.md
│   ├── CONTEXTO_BASE_DATOS.md
│   └── CONTEXTO_NUESTRA_VIDA.md
├── minijuegos/
│   ├── minigames-data.js
│   ├── minigames-core.js
│   ├── minigames.js
│   ├── nuestra-vida-launcher.js
│   └── entre-tu-y-yo/
│       ├── entre-tu-y-yo-data.js
│       ├── entre-tu-y-yo.js
│       ├── entre-tu-y-yo.css
│       └── assets/
│           └── illustrations.png
└── nuestra-vida/
    ├── README_1.0.txt
    ├── QA_1.0.json
    ├── index.html
    ├── nv-core-1-0-8c6f2a.html
    ├── minijuegos.html
    ├── access-gate.js
    ├── manifest.webmanifest
    ├── sw.js
    ├── assets23/
    ├── assets25/
    ├── assets26/
    ├── audio27/
    └── icons/
```

La lógica general de JaviEats permanece principalmente en `script.js`, la presentación en `style.css` y el núcleo histórico de minijuegos en `minijuegos/minigames-core.js` / `minijuegos/minigames-data.js`.

El microevento de flores amarillas no crea archivos nuevos: estilos, marcado y activación temporal viven encapsulados en `index.html`, sustituyendo el bloque ya caducado del plan especial del 16 de septiembre.

Los tres contextos maestros viven juntos dentro de `/contextos/`. **Nuestra Vida** conserva su aplicación y recursos dentro de `/nuestra-vida/`; únicamente su launcher de integración con JaviEats vive en `/minijuegos/`.

`/app/` concentra el frontend modular de JaviEats. En 3.3.6 se divide en `app/js/` para lógica funcional y `app/css/` para estilos por responsabilidad. Se evita crear archivos pequeños sin una responsabilidad clara.

`app/js/memories.js` concentra todo el dominio de Recuerdos: acceso a `recuerdos_app`, Storage privado, URLs firmadas, caché temporal, compresión, render, galerías, cartas, editor, alta, edición y borrado.

`app/js/notifications.js` concentra el centro de actividad: carga, badge, modal, render, marcar leído, borrar, vaciar y navegación al destino del aviso.

`app/js/push.js` concentra Web Push del frontend: compatibilidad iOS/PWA, registro del Service Worker, VAPID, suscripción/desuscripción, persistencia en `push_subscriptions` y estado visual del ajuste. `service-worker.js` sigue independiente.

`app/js/sync.js` concentra el motor de sincronización: intervalo periódico, single-flight, reintentos 2/5/10 s, estado online/offline, actualización manual y reanudación por visibility/pageshow. `script.js` conserva `runDataSync()` como coordinador de los dominios todavía no extraídos.

`app/js/auth.js` concentra perfiles autorizados, selector Javi/Laura, login, restauración de sesión, validación de rol, cambio de perfil en enlaces dirigidos, logout y errores de autenticación. El core recibe únicamente una sesión ya validada.

`app/js/plans.js` concentra ya el dominio clásico de Planes: catálogo de servicios, acceso Supabase a `propuestas`, formularios de propuesta y plan libre, calendario compartido, render de reservas/día, aceptar/rechazar/cancelar/completar, editar/borrar y ticket PNG. La capa v3 sigue presentando Planes visualmente, pero consume la API del módulo.

`app/js/ysi.js` concentra todo el flujo de ¿Y si…?: carga de pregunta e historial, estadísticas de compatibilidad, respuestas, cambio de pregunta, render, resultado/reveal, filtros e historial. Home/Perfil consumen únicamente sus helpers públicos de estadísticas y último resultado.

`app/js/rewards.js` concentra Laura vs Máquina, reto diario, rondas, puzzle del masaje, progreso/piezas, modales, contador diario, vales, canje y descarga del vale. Este dominio comparte ciclo de vida y recompensas, por lo que se mantiene unido en un solo módulo.

`app/js/ui.js` contiene la capa de presentación v3 mobile-first que antes ocupaba el tramo final de `script.js`: navegación, composición visual de Inicio/Planes/Minijuegos/Recuerdos/Perfil-Nosotros, edición visual de planes y adaptadores de presentación. Se carga después de `script.js` y consume `window.JaviEatsApp`.

/supabase/ contiene desde 3.3.6 el historial SQL reproducible. Las migraciones creadas en GitHub no deben confundirse con cambios ya aplicados a producción: su estado debe verificarse explícitamente.


---

## 🛠️ Diagnóstico técnico 3.3.6

JaviEats dispone de un panel técnico oculto cargado desde `app/js/debug.js`.


Se activa únicamente añadiendo:

```text
?debug=1
```

Muestra versión, sesión, perfil, estado de red, modo PWA, Service Worker, permiso Push y Cache Storage. No muestra tokens, credenciales ni secretos.

---

## 🧪 QA y mantenimiento 3.3.6

La integración de Nuestra Vida no elimina la necesidad de comprobar las funciones ya estables de JaviEats.

Puntos críticos ante cualquier cambio:

- Inicio;
- Planes y catálogo horizontal;
- propuesta y gestión de Planes;
- calendario compartido;
- Minijuegos;
- entrada de laboratorio de Nuestra Vida;
- Recuerdos;
- Perfil/Nosotros;
- acceso a Nuestra Vida;
- Push y destinos de notificación;
- recuperación de conexión;
- sesión persistente;
- cierre de sesión.

### Producción

No se debe confundir:

- código correcto en GitHub;
- deployment correcto en Vercel;
- caché correcta en la PWA;
- prueba real en navegador;
- prueba real en iPhone/iPad.

Si aparece una diferencia entre `main` y producción, comprobar primero el deployment, la caché y los recursos cargados antes de modificar código estable.

---

## ⏭️ Backlog de pulido

Estas mejoras continúan pendientes de pulido:

- limpieza profunda del frontend legacy de `Mensaje del día` y otros nodos antiguos ya no visibles;
- revisión de código legacy que pueda eliminarse sin afectar funcionalidad;
- iconos maskable independientes;
- pulidos no críticos de PWA/iPad;
- QA exhaustivo de pequeñas funciones administrativas.

El arrastre de escritorio, la retirada de Formspree y la unificación de la navegación antigua ya quedaron completados antes de 3.2.

---

# Base de datos

JaviEats 3.3.2 **no reconstruye la base de datos principal** por la reorganización de minijuegos ni por la integración de Entre tú y yo.

Tablas principales existentes de JaviEats:

- `marcas_mensajes_javi`
- `mensajes_dia` *(legacy, no visible)*
- `mensajes_laura` *(legacy, no visible)*
- `notificaciones`
- `piezas_puzzle`
- `preguntas_diarias` *(legacy)*
- `propuestas`
- `puzzles_premio`
- `recordatorios_email`
- `recuerdos_app`
- `respuestas_diarias` *(legacy)*
- `retos_diarios`
- `rondas_reto`
- `vales`
- `y_si_dias`
- `y_si_notificaciones`
- `y_si_preguntas`
- `y_si_respuestas`
- `push_subscriptions`

Las tablas legacy no se eliminan simplemente por no aparecer en la experiencia actual.

---

# Seguridad

JaviEats continúa utilizando Supabase Auth y Row Level Security.

Principios relevantes:

- solo las dos cuentas autorizadas deben utilizar la aplicación;
- cada suscripción Push queda asociada a `auth.uid()`;
- un usuario autenticado solo puede gestionar sus propias suscripciones Push;
- la clave VAPID privada nunca aparece en el frontend ni en GitHub;
- el bucket `recuerdos` continúa privado;
- las respuestas de `¿Y si…?` siguen protegidas mediante RPC;
- no se publican claves `service_role`, contraseñas de base de datos ni cadenas de conexión privadas.

La clave pública de Supabase y la VAPID pública pueden vivir en el frontend; los secretos privados deben permanecer fuera del repositorio.

---

# Tecnologías utilizadas

- HTML
- CSS
- JavaScript
- Supabase
- Supabase Auth
- Supabase Storage
- Supabase Edge Functions
- Supabase Database Webhooks
- PostgreSQL
- Row Level Security
- Web App Manifest
- Service Worker
- Web Push / VAPID
- Brevo *(correo transaccional de fallback para ¿Y si…?)*
- GitHub
- Vercel

JaviEats no utiliza actualmente un framework frontend ni un proceso de build obligatorio: la aplicación principal funciona con HTML, CSS y JavaScript cargados directamente en navegador.

---

# Convención de commits

Para modificar un archivo existente:

```text
ACTUALIZACION <archivo> VERSION <versión>
```

Para crear un archivo nuevo:

```text
CREACIÓN <archivo> VERSION <versión>
```

---

# Versionado

## JaviEats

La línea actual es:

```text
3.2   → integración de Nuestra Vida
3.2.1 → hotfixes posteriores al estreno
3.3   → catálogo, agenda, .ics y mejoras de minijuegos
3.3.1 → identidad, protagonismo de Nuestra Vida y refinamientos de ¿Y si…?
3.3.2 → mantenimiento actual, reorganización de minijuegos e integración de Entre tú y yo
3.3.3 → microevento efímero de flores amarillas del 21/09/2026
3.3.4 → recuerdo permanente de las flores amarillas con reproducción de la experiencia
3.3.5 → ajuste móvil y reinicio fiable de animaciones del recuerdo de flores amarillas
3.3.6 → inicio de mantenimiento técnico y navegación de retorno desde Nuestra Vida
```

`3.3.6` es la referencia actual de mantenimiento: inicia la fase de hardening/orden técnico y completa la navegación de Nuestra Vida con un retorno explícito a JaviEats desde su menú principal. Los siguientes cambios deben seguir siendo incrementales y quedar reflejados tanto aquí como en `contextos/CONTEXTO_JAVIEATS.md`.

## Nuestra Vida

Nuestra Vida conserva su propio versionado. Los bugs o ajustes internos del juego deben resolverse como patches del juego cuando corresponda, evitando usar una actualización general de JaviEats como excusa para rediseñar su gameplay.

---

# Historial de versiones

## v3.3.6 — Mantenimiento técnico y retorno desde Nuestra Vida

- Creada la estructura `/supabase/migrations/` para empezar a versionar cambios de base de datos.
- Preparada una migración de hardening para retirar `EXECUTE` público/anon de funciones internas y triggers que no usa directamente el frontend.
- Preparada una migración con índices para las claves foráneas que carecen de un índice útil como prefijo.
- Estas migraciones están versionadas en GitHub y **no deben considerarse aplicadas a producción hasta verificar su ejecución en Supabase**.
- Añadido `app/js/debug.js`, activable solo con `?debug=1`, para diagnosticar sesión, PWA, Service Worker, Push, red y Cache Storage.
- Migrados los 5 recuerdos históricos a `recuerdos_app` + Storage privado.
- Las imágenes históricas se guardan en WebP comprimido dentro del bucket privado `recuerdos`.
- Las cartas viven ahora en `recuerdos_app.contenido`.
- La experiencia de flores amarillas sigue abriéndose desde su registro remoto sin perder su comportamiento especial.
- Eliminados `MEMORIES`, las fotos/cartas históricas de GitHub y el migrador temporal: Supabase es ya la única fuente de Recuerdos.
- Confirmado que el Service Worker principal no cachea actualmente HTML/JS/CSS.
- Añadido `← Volver a JaviEats` en el menú principal de Nuestra Vida.
- El botón se inyecta desde `nuestra-vida/access-gate.js`, manteniendo intacto el core de Nuestra Vida 1.0.
- El retorno también queda disponible cuando una partida termina y se vuelve al menú principal.
- No cambia gameplay, persistencia ni esquema de guardado de Nuestra Vida.
- Se inicia una fase centrada en seguridad, limpieza de código, estructura y estabilidad, sin nuevas features de producto.

## v3.3.5 — Ajuste móvil del recuerdo de flores amarillas

- Ajustada la composición del ramo para evitar que las flores queden recortadas en la parte superior en iPhone y navegadores embebidos.
- Refinado el espaciado del estado revelado en móvil y en viewports de poca altura.
- El ramo queda ligeramente más compacto para mantener título, mensaje y botón dentro de una composición equilibrada.
- Añadido reinicio explícito de las animaciones `yellowStemGrow`, `yellowBloom`, `yellowRibbonPop` y `yellowPetalFall` cada vez que se pulsa `Ver mis flores`.
- Se fuerza el scroll del panel al inicio tras la transición para evitar que Safari conserve desplazamientos internos.
- Se respeta `prefers-reduced-motion`: en ese caso no se fuerza la animación.


## v3.3.4 — Recuerdo permanente de las flores amarillas

- Añadido el recuerdo estático `Las flores amarillas de JaviEats` con fecha 21/09/2026.
- Se muestra dentro de la cronología de Recuerdos con icono 🌻 y CTA `Volver a verlo`.
- Al abrirlo se reutiliza la experiencia original: mensaje inicial, botón `🌼 Ver mis flores`, ramo animado, pétalos y dedicatoria.
- La reproducción desde Recuerdos funciona también después del 21/09/2026 y para ambos perfiles.
- El modo recuerdo no altera el estado `localStorage` del evento efímero.
- No se añaden tablas ni cambios de Supabase.
- `script.js` se versiona como `?v=3.3.4` para evitar caché antigua en PWA/navegador.


## v3.3.3 — Microevento de flores amarillas · 21/09/2026

- Sorpresa temporal para Laura al entrar en JaviEats durante el 21 de septiembre de 2026, usando zona horaria Europe/Madrid.
- Primer estado con mensaje dedicado y CTA `🌼 Ver mis flores`.
- Segundo estado con ramo animado, pétalos y mensaje personal.
- Tras verla, se recuerda localmente y queda disponible un acceso discreto `🌼 Tus flores` durante el resto del día.
- El evento desaparece automáticamente al terminar el 21/09/2026.
- No utiliza Supabase, no modifica Planes, Recuerdos ni Minijuegos y no añade archivos nuevos.
- Se reutiliza el hueco del antiguo evento temporal del 16 de septiembre, eliminando ese código ya caducado.
- Modo de revisión disponible mediante `?preview=yellow-flowers` una vez autenticado, sin marcar la sorpresa como vista.


## v3.3.2 — Mantenimiento actual, reorganización de minijuegos y Entre tú y yo

- Reorganización de los archivos propios de minijuegos bajo `/minijuegos/`.
- `minigames.js`, `minigames-core.js`, `minigames-data.js` y `nuestra-vida-launcher.js` quedan agrupados en esa carpeta.
- Nuestra Vida permanece en `/nuestra-vida/` como aplicación independiente.
- Integración de **Entre tú y yo** en `main`.
- Nuevo módulo `minijuegos/entre-tu-y-yo/` con lógica, batería, estilos e ilustraciones propias.
- 8 rondas y mecánicas Apuesta, Duelo, Telepatía y Elige 2.
- Persistencia local del nuevo juego, sin cambios de esquema de Supabase.
- Rutas de carga de `index.html` y del loader adaptadas a la nueva estructura.
- README y contexto maestro alineados con la estructura real de `main`.

## v3.3.1 — Identidad y recompensa emocional

- Reutilización del icono real de la PWA como identidad visual.
- Nuestra Vida gana protagonismo en Inicio con una tarjeta principal propia.
- Refinamientos de compatibilidad y ventaja compartida en `¿Y si…?`.
- Celebración específica para el pleno de 5/5.

## v3.3 — Catálogo, Agenda y mejoras de juego

- Catálogo ampliado de 8 a 10 servicios.
- Nuevos servicios `☕ Tomar algo` y `🍽️ Ir a comer / cenar`.
- Exportación `.ics` para planes confirmados.
- Mejoras de Inicio/Agenda.
- Más contenido para Dibuja y No lo Digas.
- Corrección de Dibuja para que el territorio pertenezca a quien adivina antes.
- Limpieza y endurecimiento de la lógica de no repetición de `¿Y si…?`.

## v3.2.1 — Hotfixes posteriores al estreno

- Restauración del acceso a Nuestra Vida después de la hora de lanzamiento.
- Ajustes para evitar reutilizar el wrapper de estreno desde caché.
- Renovación de referencias de caché del launcher.
- Incorporación de una zona de pruebas de minijuegos de Nuestra Vida.
- Carga de `minigames-core.js` y `nuestra-vida-launcher.js` mediante el loader actual `minijuegos/minigames.js`.

## v3.2 — Integración de Nuestra Vida

- Integración de Nuestra Vida 1.0 dentro del repositorio de JaviEats.
- Nueva navegación final `Inicio · Planes · Nuestra Vida · Minijuegos · Recuerdos`.
- Acceso desde la pestaña central de JaviEats.
- Lanzador independiente mediante `minijuegos/nuestra-vida-launcher.js`.
- Revelación programada originalmente para el 12/09/2026 a las 14:00 en Madrid.
- Acceso previo de Javi para pruebas antes del estreno.
- Protección de la experiencia de Laura antes de la revelación.
- Identidad visual final de Nuestra Vida integrada en la navegación.
- Gameplay principal mantenido separado del core histórico de JaviEats.

## v3.1 — Navegación, estabilidad y limpieza antes del juego principal

- Nueva arquitectura `Inicio · Planes · acceso especial · Minijuegos · Recuerdos`.
- Perfil/Nosotros pasa a la cabecera.
- `Juegos` pasa a llamarse `Minijuegos`.
- Acceso central especial con cuenta atrás y revelación programada.
- Push de Planes enriquecido.
- Push de `¿Y si…?` para turno y resultado final 5/5.
- Email de turno de `¿Y si…?` únicamente como fallback si no hay Push.
- Deep links de Push a Planes y `¿Y si…?`.
- Sincronización robusta con fallo parcial, reintentos, recuperación `online` y control de concurrencia.
- Refresco manual desde el estado de sincronización.
- Arrastre del catálogo con ratón en escritorio.
- Formspree retirado físicamente del frontend de propuestas.
- `v3.1.js` absorbido por `script.js` y eliminado.
- `app-navigation.js` absorbido por `script.js` / `style.css` y eliminado.
- Referencias principales versionadas a `?v=3.1`.
- Identidad PWA actualizada en iconos principales.
- Base final validada antes de 3.2.

## v3.0 — Rediseño mobile-first, Planes compartidos, Recuerdos compartidos y PWA

- Rediseño visual completo con prioridad a móvil y aspecto de aplicación.
- Nueva navegación inferior: `Inicio · Planes · Juegos · Recuerdos · Nosotros`.
- Inicio simplificado para priorizar actividad real, próximo plan, juegos y último recuerdo.
- Planes con pendientes, próximo plan, catálogo y calendario.
- Ambos perfiles preparados para proponer, aceptar/rechazar, editar y borrar planes.
- Recuerdos compartidos con creación, edición y borrado.
- `Mensaje del día` y el antiguo apartado de mensajes/cartas dejan la experiencia visible.
- Centro de Actividad conectado a `public.notificaciones`.
- PWA preparada para iPhone/iPad.
- `manifest.webmanifest`, iconos y `service-worker.js`.
- `push_subscriptions` y Web Push.
- VAPID configurado con la clave privada únicamente en Supabase Secrets.
- Correo de turno de `¿Y si…?` conservado como fallback cuando no hay Push.

## v2.9 — Mensaje del día y notificaciones

- `Mensaje del día` escrito por Javi desde Inicio.
- Popup prioritario para Laura y estado de lectura.
- Edge Function `mensaje-dia`.
- Campana de notificaciones y Centro de Actividad.
- Avisos internos para mensajes, ¿Y si…?, puzle, planes y recuerdos.

## v2.8 — Recuerdos privados

- Formulario `Añadir recuerdo`.
- Hasta 8 fotos por recuerdo.
- Compresión y redimensionado en navegador.
- Bucket privado `recuerdos` y tabla `recuerdos_app` con RLS.
- URLs firmadas temporales.
- Edición y eliminación.
- Revisión de Dibuja y No lo digas tras pruebas reales.

## v2.7.1 — Favicon y ajuste final del puzle

- Favicon de JaviEats con corazón y flecha.
- ICO y Apple Touch Icon.
- Imagen SVG ligera para el puzle.
- Precarga del recurso visual.

## v2.7 — Minijuegos

- Hub general `Minijuegos`.
- `¿Y si…?`, `Piedra, papel o tijera`, `Dibuja` y `No lo digas`.
- Baterías y lógica separadas dentro de `minijuegos/`.
- Eliminados `draw-data.js` y `draw-game.js`.

## v2.6 — Primera versión de Dibuja

- Primera incorporación de Dibuja como juego presencial.
- Tablero por categorías.
- Corrección de enlaces de email de `¿Y si…?` y detección de perfil equivocado.

## v2.5.2 — Entrada rápida Javi / Laura

- Sesión persistente.
- Selector visual de perfil.
- Correo asociado internamente a Javi o Laura.
- Bienvenida personalizada durante la sincronización.
- Conservación de `?open=ysi`.

## v2.5.1 — Cinco preguntas al día y turnos por correo

- Batería de 300 preguntas.
- Hasta cinco preguntas completadas al día.
- Caducidad diaria de pendientes.
- Compatibilidad histórica acumulada.
- Email de turno programado y cancelación si el otro responde antes.
- Database Webhook + `turno-y-si` + Brevo.

## v2.5 — ¿Y si…? compartido

- Preguntas cerradas para Javi y Laura.
- Respuestas privadas hasta que ambos participan.
- Compatibilidad, estadísticas e historial.
- RPC protegidas.

## v2.4 — Puzle del masaje

- Una pieza por cada partida diaria ganada.
- Puzle visual de seis piezas.
- Progreso persistente en Supabase.
- Vale creado al completar el puzle.

## v2.3 — Conexión compartida

- Supabase Auth.
- Calendario compartido.
- Datos sincronizados entre dispositivos.
- Mensajes/cartas, pregunta diaria, reto y vales sincronizados.
- Permisos diferenciados.

## v2.2 — Mejoras de contenido

- Revisión de servicios.
- Nota obligatoria para Plan diferente.
- Historial debajo del calendario.

## v2.1 — Reto diario

- Piedra, papel o tijera.
- Cinco rondas, muerte súbita y premio secreto.
- Vale por un masaje.

## v2.0 — Recuerdos

- Línea temporal.
- Galería.
- Lector de cartas.
- Fotografías y textos externos.

## v1.2 — Calendario local

- Calendario mensual.
- Historial local.
- Próximo plan y total de propuestas.
- Persistencia con `localStorage`.

## v1.1 — Acceso privado

- Preguntas personales antes de entrar.
- Dos preguntas por acceso.
- Sesión temporal con `sessionStorage`.

## v1.0 — Primera versión

- Inicio y catálogo de servicios.
- Modal para proponer planes.
- Fecha, hora, duración, ganas y nota.
- Envío mediante Formspree.
- Diseño móvil y menú inferior.

---

Hecho con cariño para Laura y Javi. ❤️

### CSS modular · 3.3.6

El antiguo `style.css` de ~130 KB se dividió preservando exactamente el mismo contenido y orden:

- `app/css/base.css` — base histórica y estilos generales.
- `app/css/interactions.css` — puzzle, ¿Y si…? y autenticación/interacciones previas.
- `app/css/minigames.css` — Dibuja, No lo digas y hub de minijuegos.
- `app/css/memories.css` — Recuerdos y editor.
- `app/css/notifications.css` — centro de actividad/notificaciones.
- `app/css/ui.css` — interfaz v3, navegación, Inicio, Planes, Recuerdos, Nosotros y Push.

La concatenación de estas seis hojas, en ese orden, es idéntica al `style.css` anterior.

### Seguridad y rendimiento Supabase · 3.3.6

Aplicado en producción el 22/09/2026:

- `harden_internal_function_permissions`: revoca `EXECUTE` a `PUBLIC/anon/authenticated` sobre 11 funciones internas `SECURITY DEFINER`.
- `add_missing_fk_indexes`: añade 10 índices para claves foráneas sin índice como prefijo.
- `optimize_rls_auth_uid`: mantiene exactamente la misma lógica RLS, sustituyendo `auth.uid()` por `(select auth.uid())` en 16 políticas para evitar reevaluación por fila.

Tras aplicar las migraciones:
- desaparece el aviso de funciones internas ejecutables por `anon`;
- desaparece el aviso `auth_rls_initplan`;
- permanecen como asuntos separados `pg_net` en `public`, leaked-password protection desactivado y algunas tablas internas con RLS sin policy deliberada.


### Service Worker y caché · 3.3.6

- El `service-worker.js` principal de JaviEats no cachea HTML/JS/CSS; se usa para Web Push y control de notificaciones.
- Nuestra Vida mantiene su SW independiente y sí cachea assets.
- El namespace de cache de Nuestra Vida se actualiza a `nuestra-vida-1.0.2-maintenance`.
- Al activar el nuevo SW se eliminan automáticamente caches antiguas cuyo nombre empieza por `nuestra-vida-`.
- El launcher navega a `./nuestra-vida/?v=1.0.2` para evitar reutilización de wrappers antiguos en Safari/PWA.
