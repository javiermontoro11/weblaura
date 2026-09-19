# JaviEats 💌

**Versión de producto: 3.2 — ESTABLE**  
**Mantenimiento actual: 3.2.1**

JaviEats es una aplicación web privada creada para Laura y Javi. Reúne planes compartidos, recuerdos, minijuegos, actividad, notificaciones y un espacio común pensado para funcionar como una PWA en móvil, tablet y escritorio.

JaviEats 3.2 parte de la base estable de 3.1 e integra **Nuestra Vida 1.0** como experiencia principal independiente, sin rehacer el core de JaviEats ni mezclar el juego completo con la lógica de los minijuegos existentes.

> **Estado actual:** la base funcional de JaviEats 3.1 se mantiene, Nuestra Vida está integrada y accesible desde la navegación principal, y los hotfixes posteriores al estreno quedan dentro del mantenimiento 3.2.1. `main` es la fuente de verdad del proyecto.

---

## 🚀 JaviEats 3.2

La 3.2 mantiene la filosofía del proyecto:

**ESTABILIDAD > CAMBIOS GRANDES**

Cuando una función ya está validada, los cambios deben ser pequeños, incrementales y compatibles con lo que ya funciona.

### Incluido en la rama 3.2

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
- autenticación persistente para Javi y Laura.

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
- `nuestra-vida/minijuegos.html` permite abrir una zona de pruebas de los minijuegos del juego principal.

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
JaviEats 3.2 / mantenimiento 3.2.1
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

El catálogo principal mantiene ocho servicios.

En móvil se recorre con swipe y en escritorio puede desplazarse manteniendo pulsado el botón izquierdo del ratón y arrastrando lateralmente.

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

Además, en la rama 3.2 existe una entrada adicional de laboratorio para probar directamente los minijuegos de Nuestra Vida sin iniciar una partida completa del juego principal.

### Separación actual

- `minijuegos/minigames-data.js` contiene las baterías y datos históricos;
- `minijuegos/entre-tu-y-yo/` contiene íntegramente el nuevo juego Entre tú y yo;
- `minijuegos/minigames-core.js` contiene la lógica histórica de los minijuegos de JaviEats;
- `minijuegos/minigames.js` carga el core y después el launcher de Nuestra Vida;
- Nuestra Vida conserva su lógica propia dentro de `/nuestra-vida/`.

El juego principal no debe mezclarse dentro del core de los minijuegos salvo que exista una necesidad técnica concreta.

---

## 📸 Recuerdos

Recuerdos mantiene:

- creación;
- edición;
- eliminación;
- varias fotografías;
- compresión en dispositivo;
- bucket privado `recuerdos`;
- URLs firmadas temporales.

Los recuerdos históricos del repositorio permanecen intactos.

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

El Service Worker principal gestiona la recepción de Push y la apertura de los destinos correspondientes dentro de JaviEats.

Algunas referencias de assets continúan utilizando query strings `?v=3.1`. Esto no significa que la aplicación siga en 3.1: esas referencias se mantienen mientras no exista una razón técnica para invalidarlas.

Las variantes maskable independientes continúan aplazadas para una fase posterior de pulido.

---

## 🧩 Estructura actual

```text
JaviEats/
├── CONTEXTO_JAVIEATS_3.2.md
├── README.md
├── index.html
├── style.css
├── script.js
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
│           └── illustrations.webp
├── manifest.webmanifest
├── service-worker.js
├── favicon.ico
├── assets/
│   ├── apple-touch-icon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   └── puzzle-masaje.svg
├── recuerdos/
└── nuestra-vida/
    ├── CONTEXTO_NUESTRA_VIDA_1.0.md
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

La lógica general de JaviEats permanece principalmente en `script.js`, la presentación en `style.css` y los minijuegos históricos en `minigames-core.js` / `minigames-data.js`.

Nuestra Vida conserva sus archivos y assets dentro de su propia carpeta.

---

## 🧪 QA y mantenimiento 3.2

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

Estas mejoras continúan fuera del núcleo de 3.2:

- ampliar el catálogo de 8 a 10 planes;
- añadir `☕ Tomar algo`;
- añadir `🍽️ Ir a comer / cenar`;
- exportación `.ics` a Apple Calendar;
- limpieza profunda del frontend legacy de `Mensaje del día` y otros nodos antiguos ya no visibles;
- revisión de código legacy que pueda eliminarse sin afectar funcionalidad;
- iconos maskable independientes;
- pulidos no críticos de PWA/iPad;
- QA exhaustivo de pequeñas funciones administrativas.

El arrastre de escritorio, la retirada de Formspree y la unificación de la navegación antigua ya quedaron completados antes de 3.2.

---

# Base de datos

JaviEats 3.2 **no reconstruye la base de datos principal** para integrar Nuestra Vida.

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
3.2.1 → hotfixes y mantenimiento posterior al estreno
```

Los siguientes cambios pequeños deben continuar de forma incremental antes de plantear una nueva versión mayor.

## Nuestra Vida

Nuestra Vida conserva su propio versionado. Los bugs o ajustes internos del juego deben resolverse como patches del juego cuando corresponda, evitando usar una actualización general de JaviEats como excusa para rediseñar su gameplay.

---

# Historial de versiones

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