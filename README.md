# JaviEats 💌

**Versión actual: 3.1 — CANDIDATA FINAL**

JaviEats es una aplicación web privada creada para Laura y Javi. La 3.1 queda reducida a lo prioritario para consolidar la base de 3.0 antes de integrar el futuro juego principal en la **versión 3.2**.

> **Estado actual:** el desarrollo técnico de 3.1 está cerrado en GitHub. Queda únicamente la validación corta en dispositivo real —especialmente PWA/iPhone, Push y recuperación de conexión— antes de considerarla estable. Las mejoras que no bloquean 3.2 se han movido expresamente a **3.3**.

---

## 🚀 JaviEats 3.1 — objetivo de cierre

La 3.1 no es un rediseño ni una versión de funciones nuevas. Su objetivo es dejar una base más fiable y una navegación preparada para que 3.2 pueda centrarse en la integración del juego principal.

### Incluido en 3.1

- navegación inferior `Inicio · Planes · acceso especial · Minijuegos · Recuerdos`;
- Perfil/Nosotros desde la cabecera;
- configuración Push y cierre de sesión dentro del espacio de Perfil;
- acceso central especial con cuenta atrás y revelación programada;
- Push enriquecido de Planes;
- Push de turno y resultado final de `¿Y si…?`;
- email de turno de `¿Y si…?` únicamente como fallback si no existe Push;
- enlaces Push directos a Planes y `¿Y si…?`;
- sincronización resistente con fallo parcial, reintentos y recuperación de conexión;
- refresco al recuperar Internet y al volver a la PWA;
- bloqueo de sincronizaciones simultáneas;
- refresco manual desde el estado de sincronización;
- iconos principales PWA 3.1 y favicon sin la referencia SVG antigua;
- Formspree neutralizado en runtime para que las propuestas no dupliquen avisos.

### Decisión de alcance

Todo lo que no era imprescindible para arrancar 3.2 se aplaza a **JaviEats 3.3**. Esto evita alargar el cierre de 3.1 y, sobre todo, evita refactors grandes justo antes de integrar el juego principal.

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

`Nosotros` deja de ocupar una pestaña inferior y se abre desde el icono de perfil. `Juegos` pasa a llamarse **Minijuegos** para separar claramente los juegos cortos del futuro juego principal.

El acceso central se mantiene como espacio reservado para el juego principal. Hasta el **12/09/2026 a las 14:00 (Europe/Madrid)** muestra `12·09`, una cuenta atrás y una pantalla de misterio. La integración real del juego pertenece a 3.2.

---

## 🔔 Push y Actividad

La infraestructura Web Push existente se conserva; 3.1 mejora contenido y destino.

### Planes

Se contemplan Push para:

- nueva propuesta;
- aceptación;
- rechazo;
- cancelación;
- cambio importante de fecha u hora.

Los textos incluyen actor, plan, fecha/hora y nota cuando existe.

Ejemplo:

```text
Laura te propone un plan 📅
🍣 Sushi Date · sábado 12 sep · 21:30
“Me apetece ir al buffet…”
```

Los cambios menores y el estado `realizada` no deben generar Push.

### ¿Y si…?

Se utiliza Push para:

- avisar de que el otro ya respondió y ahora te toca;
- resultado final después de completar la quinta pregunta del día.

Las preguntas 1–4 pueden generar Actividad interna, pero no Push individual.

```text
Laura ya ha respondido 💭
Te toca en ¿Y si…? 👀
```

```text
¿Y si…? completado ❤️
Hoy habéis coincidido 4 de 5
```

### Destinos

```text
Push de Planes → ?open=plans → Planes
Push de ¿Y si…? → ?open=ysi → ¿Y si…?
Push de prueba → Inicio
```

### Email de turno

```text
¿El destinatario tiene Push activo?
├─ Sí  → Push; no programar email duplicado.
└─ No  → mantener el email de turno existente.
```

Este sistema es independiente de Formspree.

---

## 🔄 Sincronización robusta

La fiabilidad de sincronización es la mejora técnica principal de 3.1.

La capa `v3.1.js` sustituye en runtime la sincronización general por una versión que:

- ejecuta las cargas relevantes de forma independiente mediante `Promise.allSettled`;
- conserva el último dato válido cuando falla solo una sección;
- evita que un fallo en Recuerdos o `¿Y si…?` tire abajo toda la actualización;
- bloquea sincronizaciones simultáneas;
- reintenta con esperas de 2 s, 5 s y 10 s;
- reacciona al evento `online`;
- actualiza al volver a primer plano;
- recupera la PWA después de restaurarla desde memoria;
- permite pulsar el estado de sincronización para refrescar manualmente.

Estados previstos:

```text
Sincronizando…
Sin conexión · reintentando…
Sincronización parcial · reintentando…
Sincronizado · HH:MM
```

La consolidación completa de esta capa dentro del `script.js` histórico se aplaza a 3.3 para no hacer un refactor de un archivo de más de 200 KB justo antes de 3.2.

---

## 🎮 Minijuegos

Se mantienen los cuatro minijuegos actuales:

- `¿Y si…?`;
- `Piedra, papel o tijera`;
- `Dibuja`;
- `No lo digas`.

El futuro juego principal no se mezcla dentro de `minigames.js` ni dentro del hub de Minijuegos.

---

## 📸 Recuerdos

Recuerdos mantiene la implementación de 3.0:

- creación por Javi y Laura;
- edición;
- eliminación;
- varias fotografías;
- compresión en dispositivo;
- bucket privado `recuerdos`;
- URLs firmadas temporales.

Los recuerdos históricos del repositorio permanecen intactos.

---

## 👤 Perfil / Nosotros

Perfil/Nosotros conserva:

- compatibilidad acumulada de `¿Y si…?`;
- progreso del puzle;
- recuerdos;
- vales/premios;
- configuración Push del dispositivo;
- cierre de sesión.

La campana de Actividad continúa separada en la cabecera.

---

## 📱 PWA

JaviEats continúa como PWA mobile-first y mantiene:

- `manifest.webmanifest`;
- `display: standalone`;
- Apple Web App metadata;
- `viewport-fit=cover`;
- safe areas;
- `service-worker.js`;
- Web Push;
- iconos de 192 px, 512 px y Apple Touch Icon.

El manifest 3.1 declara los iconos actuales como `purpose: "any"`. Las variantes maskable independientes quedan aplazadas a 3.3.

---

## 🧩 Estructura de 3.1

```text
JaviEats/
├── index.html
├── style.css
├── script.js
├── app-navigation.js
├── v3.1.js
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

`app-navigation.js` mantiene aislada la navegación nueva y el acceso especial. `v3.1.js` queda deliberadamente reducido a compatibilidad crítica de 3.1: sincronización, deep link de Planes, texto de turno de `¿Y si…?` y neutralización runtime de Formspree.

No se añaden más archivos auxiliares para cerrar esta versión.

---

## ⏭️ Aplazado expresamente a JaviEats 3.3

Estas mejoras siguen aprobadas, pero no bloquean la integración de 3.2:

- ampliar físicamente el catálogo de 8 a 10 planes;
- añadir `☕ Tomar algo`;
- añadir `🍽️ Ir a comer / cenar`;
- drag de escritorio y pistas adicionales del carrusel;
- exportación `.ics` a Apple Calendar;
- retirar físicamente Formspree del `script.js`;
- eliminar físicamente el frontend muerto de Mensaje del día;
- consolidar `v3.1.js` dentro del core y retirar la capa de compatibilidad;
- refactorizar la navegación si merece la pena después de integrar 3.2;
- iconos maskable independientes;
- pulidos no críticos de PWA/iPad;
- QA exhaustivo de pequeñas funciones administrativas.

Formspree continúa desactivado funcionalmente en 3.1 aunque su código histórico permanezca dentro de `script.js` hasta 3.3.

---

## 🧪 QA de cierre 3.1

Antes de etiquetar la candidata como estable se valida únicamente lo que puede bloquear 3.2:

- Inicio carga correctamente;
- Planes carga, propone y acepta/rechaza;
- Push de Planes llega y abre Planes;
- turno de `¿Y si…?` llega por Push cuando corresponde;
- `?open=ysi` abre `¿Y si…?`;
- resultado final 5/5 no se duplica;
- Push toggle sigue funcionando desde Perfil;
- Minijuegos siguen abriendo;
- Recuerdos siguen cargando;
- Perfil/Nosotros sigue accesible;
- cerrar sesión funciona;
- PWA recupera datos al volver del segundo plano;
- modo avión → recuperar conexión vuelve a sincronizar;
- una carga parcial fallida no vacía los datos buenos.

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

No se borran tablas legacy durante el cierre de 3.1 y no se crean todavía tablas específicas para el futuro juego principal.

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

La 3.2 tendrá como gran novedad la integración completa del juego principal dentro de JaviEats. La arquitectura concreta —archivos, navegación interna, persistencia y cualquier necesidad de Supabase— se decidirá cuando la build estable esté lista.

Hasta el momento de su revelación pública, la documentación evita mostrar su nombre en claro.

## v3.3 — Pulido aplazado de JaviEats

La 3.3 recuperará las mejoras no prioritarias retiradas del alcance final de 3.1: catálogo ampliado, Calendar `.ics`, limpieza física legacy, maskables y refactors que no debían retrasar 3.2.

---

# Historial de versiones

## v3.1 — Navegación, Push y estabilidad antes del juego principal

- Nueva arquitectura `Inicio · Planes · acceso especial · Minijuegos · Recuerdos`.
- Perfil/Nosotros pasa a la cabecera.
- `Juegos` pasa a llamarse `Minijuegos`.
- Acceso central especial con cuenta atrás y revelación programada.
- Preparación del hueco del futuro juego principal; integración completa reservada a 3.2.
- Push de Planes enriquecido con actor, plan, fecha/hora y nota.
- Push de `¿Y si…?` para turno y resultado final 5/5.
- Email de turno de `¿Y si…?` únicamente como fallback si no hay Push.
- Deep links de Push a Planes y `¿Y si…?`.
- Sincronización robusta con fallo parcial, reintentos, recuperación `online` y control de concurrencia.
- Refresco manual desde el estado de sincronización.
- Identidad PWA actualizada en iconos principales y retirada de la referencia al favicon SVG 2.7.1.
- Formspree neutralizado funcionalmente; limpieza física aplazada a 3.3.
- Catálogo 10, `.ics`, drag avanzado, maskables y limpieza legacy profunda aplazados a 3.3.

## v3.0 — Rediseño mobile-first, Planes compartidos, Recuerdos compartidos y PWA

- Rediseño visual completo con prioridad a móvil y aspecto de aplicación.
- Nueva navegación inferior: `Inicio · Planes · Juegos · Recuerdos · Nosotros`.
- Juegos permanece como botón central sin sobredimensionarse.
- Inicio se simplifica para priorizar actividad real, próximo plan, juegos y último recuerdo.
- Planes recupera protagonismo con pendientes, próximo plan, catálogo y calendario.
- Ambos perfiles quedan preparados para proponer, aceptar/rechazar, editar y borrar planes.
- Recuerdos queda preparado para creación, edición y borrado por Javi y Laura.
- `Mensaje del día` y el antiguo apartado de mensajes/cartas dejan de formar parte de la experiencia visible.
- El futuro juego principal se mantiene fuera de la interfaz pública de 3.0.
- `Nosotros` reúne compatibilidad, puzle, recuerdos y vales con una presentación más visual.
- Centro de Actividad renovado y conectado a `public.notificaciones`.
- PWA preparada para instalación desde Safari en iPhone/iPad.
- Nuevo `manifest.webmanifest`, iconos específicos y `service-worker.js`.
- Nueva tabla `push_subscriptions` para Web Push.
- Frontend preparado para activar/desactivar Push y registrar el dispositivo automáticamente.
- VAPID configurado: pública en frontend; privada únicamente en Supabase Secrets.
- Infraestructura Push posteriormente validada con notificaciones reales en iPhone.
- Push reservado para Planes importantes, turnos de `¿Y si…?` y resumen final del día de `¿Y si…?`.
- Correo de turno de `¿Y si…?` conservado como fallback cuando el destinatario no disponga de Push.

---

## v2.9 — Mensaje del día y notificaciones

- Nuevo `Mensaje del día` escrito por Javi desde Inicio.
- Un mensaje principal por día, editable solo hasta que Laura lo lea.
- Popup prioritario para Laura con sobre cerrado y revelado voluntario.
- Estado de lectura visible para Javi.
- Email genérico por Brevo sin incluir el contenido del mensaje.
- Nueva Edge Function `mensaje-dia`, separada de `turno-y-si`.
- Reutilización de los Secrets y del Vault ya existentes; no se crean nuevas claves.
- Campana de notificaciones con contador de no leídas.
- Avisos internos para Mensaje del día, resultado de ¿Y si…?, puzle, planes y recuerdos.
- Navegación directa desde cada notificación y opción `Marcar todo leído`.
- `supabase-v2.9.sql` incluye también la instalación de Recuerdos v2.8 para permitir actualizar directamente desde v2.7.x con un único SQL.

## v2.8 — Recuerdos privados

- Nuevo formulario `Añadir recuerdo` disponible únicamente para Javi.
- Nuevos recuerdos con fecha, título, descripción y hasta 8 fotos.
- Compresión y redimensionado de imágenes en el navegador antes de subirlas.
- Bucket privado `recuerdos` en Supabase Storage.
- Tabla `recuerdos_app` con RLS.
- URLs firmadas temporales para visualizar las fotos.
- Edición y eliminación desde la propia web.
- Los recuerdos antiguos de GitHub permanecen intactos y conviven con los nuevos.
- Migración de los recuerdos antiguos aplazada expresamente a v2.8.1.
- Revisión de `Dibuja` tras la primera prueba real: 90 s, pista a 45 s, cambio de palabra, más colores, deshacer y cartas emparejadas por dificultad.
- El perdedor de cada territorio elige la siguiente categoría; si ambos fallan, esa categoría descansa una elección.
- Revisión de `No lo digas`: 90 s por turno, puntos para quien adivina, pasar/prohibida = −5 s, 2–4 prohibidas por carta, rachas visuales y turnos equilibrados por dificultad.
- Desempates de No lo digas: 45 s cada uno y, si sigue el empate, tandas de 30 s.
- Las baterías siguen completas: 225 retos por juego, 450 en total.

## v2.7.1 — Favicon y ajuste final del puzle

- Nuevo favicon de JaviEats con corazón y flecha, incluyendo SVG, ICO y Apple Touch Icon.
- Imagen SVG ligera para el puzle de seis piezas del masaje.
- Precarga del recurso visual para evitar retrasos al abrir el popup.
- Puzle responsive mediante una imagen completa que se va destapando por casillas.
- Sin cambios de lógica, base de datos o backend.

## v2.7 — Minijuegos

- `Dibuja` pasa a integrarse dentro de una nueva pestaña general `Minijuegos`.
- Acceso rápido a Minijuegos desde Inicio.
- Hub con `¿Y si…?`, `Piedra, papel o tijera`, `Dibuja` y `No lo digas`.
- Dibuja rehecho como duelo de dos intentos por categoría.
- 60 segundos por dibujo.
- Victoria al conquistar 3 territorios.
- Batería de 225 conceptos realmente dibujables.
- Nuevo juego `No lo digas` con 225 cartas y tres palabras prohibidas por carta.
- Dos turnos de 45 segundos por persona en No lo digas.
- Desempate en tandas de 30 segundos.
- Baterías y lógica separadas en `minigames-data.js` y `minigames.js`.
- Eliminados `draw-data.js` y `draw-game.js`.
- Laura mantiene bloqueados los dos juegos nuevos hasta el 30/08/2026 a las 22:00, con cuenta atrás y desbloqueo automático.
- Javi puede probarlos antes del estreno.
- Sin cambios de base de datos ni backend.

## v2.6 — Primera versión de Dibuja

- Primera incorporación de Dibuja como juego presencial.
- Tablero de nueve categorías y batería propia.
- Introducción de la idea de conquistar territorios.
- Corrección de enlaces de email de “¿Y si…?” con destinatario explícito.
- Detección de sesión abierta con el perfil equivocado.
- Conservación del destino al cambiar de usuario.
- La mecánica original de Dibuja queda sustituida por la implementación simplificada de v2.7.

## v2.5.2 — Entrada rápida Javi / Laura

- Fuera el gate antiguo de preguntas privadas.
- Sesión persistente: si Supabase conserva la sesión, entrada automática.
- Selector visual de perfil cuando no existe sesión.
- Correo asociado internamente a Javi o Laura.
- Solo se solicita contraseña tras elegir perfil.
- Bienvenida personalizada mientras se sincroniza la aplicación.
- Resumen de Compatibilidad, turno de “¿Y si…?”, puzle o planes durante la bienvenida.
- Los enlaces `?open=ysi` siguen llevando a la pregunta pendiente después de entrar.
- Sin cambios de base de datos ni infraestructura de correo.

## v2.5.1 — Cinco preguntas al día y turnos por correo

- Batería total de 300 preguntas cerradas.
- Hasta cinco preguntas completadas por día.
- Nueva pregunta inmediata al completar una entre los dos.
- Caducidad diaria de preguntas pendientes.
- Reinicio diario del contador, sin reiniciar la compatibilidad histórica.
- Un cambio de pregunta conjunto al día.
- Alternancia de categorías.
- Resumen diario y progreso 0/5.
- Último resultado visible junto a la nueva pregunta.
- Aviso de turno por email programado 2 minutos después de la primera respuesta.
- Cancelación automática del email si la otra persona responde antes.
- Supabase Database Webhook + Edge Function `turno-y-si` + Brevo.
- Sin recordatorio fijo de las 18:00 en esta versión.

## v2.5 — ¿Y si…? compartido y recordatorios

- 80 preguntas cerradas para Javi y Laura.
- Respuestas privadas hasta que ambos participan.
- Preguntas sin repetición dentro de la temporada.
- Arrastre automático de preguntas pendientes.
- Resultado con animación de comparación.
- Corazón de Compatibilidad JaviEats.
- Estadísticas de coincidencias y mejor racha.
- Historial filtrable.
- Nuevas tablas y RPC protegidas para que no se pueda espiar la respuesta del otro.
- Preparación de recordatorio del reto mediante Edge Function.
- Control de máximo un correo cada 3 días.
- Ejecución compatible con Europe/Madrid y cambios CET/CEST.
- Formspree permanece para las propuestas de planes.

## v2.4 — Puzle del masaje

- Una pieza por cada partida diaria ganada.
- Puzle visual de seis piezas.
- Progreso persistente y compartido mediante Supabase.
- Popup automático para Laura al entrar.
- Piezas aleatorias sin repeticiones.
- Las derrotas no restan progreso.
- Vale de masaje creado únicamente al completar el puzle.
- Inicio automático de un nuevo puzle con la siguiente victoria.
- Animación al descubrir una pieza.
- Conservación de los vales anteriores.
- Nuevas tablas y políticas RLS.
- Actualización de la función `jugar_ronda_reto(text)`.

## v2.3 — Conexión compartida

- Supabase Auth.
- Preguntas privadas antes del login.
- Login con correo después de las preguntas.
- Calendario compartido.
- Datos sincronizados entre dispositivos.
- Apartado Laura.
- Mensajes, cartas e ideas.
- Favoritos.
- Guardado en Recuerdos.
- Pregunta diaria.
- Respuesta diaria sincronizada.
- Un intento diario real para Laura.
- Lógica del reto en Supabase.
- Vales sincronizados.
- Tickets descargables.
- Permisos diferenciados.
- Menú de cinco botones en una sola línea.

## v2.2 — Mejoras de contenido

- Revisión de todos los servicios.
- Nota obligatoria para Plan diferente.
- Historial debajo del calendario.
- Mejoras visuales en el reto y en los vales.

## v2.1 — Reto diario

- Minijuego de piedra, papel o tijera.
- Cinco rondas.
- Empates que consumen ronda.
- Contador de victorias.
- Muerte súbita.
- Premio secreto.
- Vale por un masaje.
- Descarga del vale en PNG.

## v2.0 — Recuerdos

- Línea temporal de recuerdos.
- Galería de fotografías.
- Lector de cartas.
- Archivos de texto externos.
- Fotografías guardadas en el repositorio.
- Navegación entre recuerdos.

## v1.2 — Calendario local

- Calendario mensual.
- Selección de días.
- Indicador de días con planes.
- Historial local.
- Próximo plan.
- Total de propuestas.
- Persistencia mediante `localStorage`.

## v1.1 — Acceso privado

- Preguntas personales antes de entrar.
- Selección aleatoria de preguntas.
- Validación de respuestas.
- Dos preguntas por acceso.
- Sesión temporal con `sessionStorage`.
- Botón para cerrar el acceso.

## v1.0 — Primera versión

- Página de inicio.
- Catálogo de servicios.
- Modal para proponer planes.
- Fecha, hora, duración, nivel de ganas y nota.
- Envío mediante Formspree.
- Diseño móvil.
- Menú inferior.

---

Hecho con cariño para Laura y Javi. ❤️
