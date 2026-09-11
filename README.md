# JaviEats 💌

**Versión actual: 3.1 — ESTABLE**

JaviEats es una aplicación web privada creada para Laura y Javi. La versión 3.1 queda cerrada como base estable y limpia antes de la integración del juego principal en **JaviEats 3.2**.

> **Estado actual:** 3.1 validada en uso real. La navegación, Perfil/Nosotros, sincronización, Planes, Minijuegos, Recuerdos y el acceso especial funcionan tras la unificación final. Los antiguos archivos auxiliares `v3.1.js` y `app-navigation.js` han sido absorbidos por el core y eliminados del repositorio.

---

## 🚀 JaviEats 3.1 — cierre final

La 3.1 consolida la base de 3.0 y reduce deuda técnica antes de integrar el juego principal.

### Incluido y validado

- navegación inferior `Inicio · Planes · acceso especial · Minijuegos · Recuerdos`;
- Perfil/Nosotros desde la cabecera;
- configuración Push y cierre de sesión dentro de Perfil;
- acceso central especial con cuenta atrás y revelación programada;
- Push enriquecido de Planes;
- Push de turno y resultado final de `¿Y si…?`;
- email de turno de `¿Y si…?` únicamente como fallback si no existe Push;
- enlaces directos Push a Planes y `¿Y si…?`;
- sincronización resistente mediante cargas independientes y `Promise.allSettled`;
- reintentos automáticos a 2 s, 5 s y 10 s;
- recuperación al volver a tener Internet y al regresar a la PWA;
- bloqueo de sincronizaciones simultáneas;
- refresco manual desde el estado de sincronización;
- arrastre horizontal del catálogo con ratón en escritorio;
- pista `Arrastra para ver más` en equipos con puntero fino;
- iconos principales PWA 3.1 y referencias versionadas;
- Formspree eliminado físicamente del frontend de propuestas;
- sincronización y deep links integrados directamente en `script.js`;
- navegación 3.1 integrada directamente en `script.js`;
- estilos de navegación y del acceso especial integrados en `style.css`;
- retirada definitiva de `v3.1.js`;
- retirada definitiva de `app-navigation.js`;
- `index.html` cargando únicamente los scripts principales con referencias `?v=3.1`.

---

## 🧭 Navegación 3.1

### Cabecera

- Actividad / notificaciones.
- Perfil / Nosotros.

### Barra inferior

```text
Inicio
Planes
Acceso especial
Minijuegos
Recuerdos
```

`Nosotros` deja de ocupar una pestaña inferior y se abre desde el icono de Perfil. `Juegos` pasa a llamarse **Minijuegos** para diferenciar los juegos cortos del futuro juego principal.

El acceso central queda reservado para el juego principal. Hasta el **12/09/2026 a las 14:00 (Europe/Madrid)** muestra `12·09`, una cuenta atrás y una pantalla de misterio. La integración jugable pertenece a 3.2.

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

La sincronización 3.1 vive ya directamente dentro de `script.js`.

Características:

- cargas relevantes independientes;
- `Promise.allSettled` para evitar que un fallo parcial rompa toda la actualización;
- conservación del último dato válido cuando falla una sección;
- bloqueo de sincronizaciones simultáneas;
- reintentos a 2 s, 5 s y 10 s;
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

El catálogo actual mantiene ocho servicios. En móvil se recorre con swipe y en escritorio puede desplazarse manteniendo pulsado el botón izquierdo del ratón y arrastrando lateralmente.

Formspree ya no forma parte del flujo de propuestas. Los Planes se guardan en Supabase y utilizan el sistema actual de Actividad/Push.

---

## 🎮 Minijuegos

Se mantienen los cuatro minijuegos actuales:

- `¿Y si…?`;
- `Piedra, papel o tijera`;
- `Dibuja`;
- `No lo digas`.

El juego principal de 3.2 no se mezclará dentro de `minigames.js` ni dentro del hub de Minijuegos.

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

Las variantes maskable independientes quedan aplazadas a 3.3.

---

## 🧩 Estructura final de 3.1

```text
JaviEats/
├── index.html
├── style.css
├── script.js
├── minigames-data.js
├── minigames.js
├── manifest.webmanifest
├── service-worker.js
├── favicon.ico
├── README.md
├── assets/
│   ├── apple-touch-icon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   └── puzzle-masaje.svg
└── recuerdos/
```

La raíz ya no contiene capas temporales de 3.1. La lógica general y de navegación está consolidada en `script.js`, mientras que la presentación permanece en `style.css`.

---

## ⏭️ Aplazado expresamente a JaviEats 3.3

Estas mejoras siguen aprobadas, pero no bloquean 3.2:

- ampliar el catálogo de 8 a 10 planes;
- añadir `☕ Tomar algo`;
- añadir `🍽️ Ir a comer / cenar`;
- exportación `.ics` a Apple Calendar;
- limpieza profunda del frontend legacy de `Mensaje del día` y otros nodos antiguos ya no visibles;
- revisión de código legacy que pueda eliminarse sin afectar funcionalidad;
- iconos maskable independientes;
- pulidos no críticos de PWA/iPad;
- QA exhaustivo de pequeñas funciones administrativas.

El arrastre de escritorio, la retirada de Formspree y la unificación de `v3.1.js` / `app-navigation.js` **ya no forman parte de este backlog: quedaron completados en 3.1**.

---

## 🧪 QA de cierre 3.1

La versión se ha validado después de la unificación final. Se han comprobado en uso real los elementos críticos de la experiencia y la aplicación continúa funcionando correctamente después de retirar las capas auxiliares.

Para futuras regresiones, los puntos críticos a comprobar son:

- Inicio;
- Planes y catálogo horizontal;
- propuesta/gestión de Planes;
- Minijuegos;
- Recuerdos;
- Perfil/Nosotros;
- acceso especial central;
- Push y destinos de notificación;
- recuperación de conexión;
- cierre de sesión.

---

# Base de datos

JaviEats 3.1 **no reconstruye la base de datos**.

Tablas principales existentes:

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

No se borran tablas legacy durante el cierre de 3.1 y no se crean todavía tablas específicas para el juego principal.

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

# Próximas versiones

## v3.2 — Juego principal de JaviEats

La 3.2 tendrá como gran novedad la integración completa del juego principal dentro de JaviEats. Se mantendrá como módulo independiente del hub de Minijuegos para evitar acoplar su lógica al core principal.

Hasta el momento de la revelación programada, el frontend evita mostrar el nombre del juego en claro antes de tiempo.

## v3.3 — Pulido de JaviEats

La 3.3 recuperará mejoras no prioritarias como el catálogo ampliado, Calendar `.ics`, limpieza profunda de código legacy, maskables y pequeños pulidos que no deben bloquear 3.2.

---

# Historial de versiones

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
- Baterías y lógica separadas en `minigames-data.js` y `minigames.js`.
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
