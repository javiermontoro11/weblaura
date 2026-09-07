# JaviEats 💌

**Versión actual: 3.0 — EN DESARROLLO**

JaviEats es una aplicación web privada creada para Laura y Javi. La versión 3.0 mantiene la base funcional que ya estaba probada —Supabase, autenticación, planes, calendario, recuerdos, juegos, puzle y vales— pero rehace la experiencia visual con prioridad absoluta al móvil y a que se comporte como una aplicación.

> **Estado de esta rama:** todavía no sustituye a la web pública. La página pública puede continuar en mantenimiento hasta terminar pruebas de Javi, activar los permisos definitivos de Laura y verificar las notificaciones Push.

---

## 🚀 Última versión — v3.0

### 🎨 Rediseño visual completo

La v3.0 no nace para añadir funciones por añadir. Su objetivo principal es que JaviEats deje de sentirse como una web formada por tarjetas y pase a sentirse como una aplicación privada, cuidada y coherente.

Cambios principales:

- Diseño **mobile-first**: el móvil es la referencia principal y escritorio adapta la misma experiencia.
- Navegación inferior fija con cinco secciones: **Inicio · Planes · Juegos · Recuerdos · Nosotros**.
- `Juegos` permanece en el centro de la barra, con el mismo peso visual que el resto de pestañas.
- Se elimina `Perfil` como pestaña principal; las acciones de cuenta quedan asociadas a la cabecera/avatar.
- Se retiran de la experiencia visible de 3.0 `Mensaje del día` y el antiguo apartado de mensajes/cartas de Laura.
- Se conservan por ahora sus tablas y parte del código legacy para no realizar borrados de backend durante el rediseño.
- Se elimina cualquier referencia visible a **Nuestra Vida**. El proyecto no aparece como juego, próximamente, secreto ni pista dentro de JaviEats.
- Menos tarjetas idénticas, jerarquía visual más clara, bloques protagonistas, fotografías, iconografía coherente y microinteracciones suaves.
- Paleta cálida y neutra con coral como acento, manteniendo un tono personal sin convertir JaviEats en una interfaz excesivamente romántica.

### 🏠 Inicio

Inicio deja de ser un resumen de todas las tablas y pasa a responder a una idea sencilla: **qué está pasando ahora mismo**.

La pantalla prioriza:

- acción pendiente importante, especialmente una propuesta de plan que requiera respuesta;
- próximo plan confirmado;
- acceso/progreso de `¿Y si…?` y puzle;
- último recuerdo con peso visual y fotografía cuando exista;
- ideas del catálogo para proponer un plan.

No se utiliza una vista semanal `L M X J V S D`: JaviEats no presupone que haya planes todas las semanas y evita mostrar bloques vacíos que empobrezcan la pantalla.

### 📅 Planes

Planes vuelve a ser una de las funciones centrales de JaviEats.

La pantalla se organiza por prioridad:

1. **Planes pendientes de aceptar o rechazar**.
2. **Próximo plan** confirmado/agendado.
3. **Catálogo** de ideas y servicios.
4. **Calendario mensual**, que continúa siendo la referencia para consultar fechas e historial.

El catálogo mantiene el enfoque original de JaviEats —Mimos, Masaje, Sushi Date, Cine, Plan sorpresa, Paseo, etc.— pero deja de plantearse como un servicio exclusivo que Laura solicita a Javi. En 3.0 ambos pueden proponer planes al otro.

Flujo previsto cuando se active la migración completa:

```text
Javi o Laura propone un plan
↓
Estado pendiente
↓
El otro recibe la propuesta
↓
Aceptar / Rechazar
↓
Si se acepta, pasa al calendario como plan confirmado
```

Ambos perfiles podrán crear, editar y borrar planes. También podrán gestionar el estado de las propuestas. Los cambios importantes de fecha/hora y las cancelaciones generan actividad para el otro usuario.

### 🎮 Juegos

La pestaña Juegos reúne únicamente los juegos actualmente públicos de JaviEats:

- `¿Y si…?`
- `Piedra, papel o tijera`
- `Dibuja`
- `No lo digas`

`Nuestra Vida` **no forma parte del frontend público de esta versión** y no existe ninguna referencia visible para Laura.

Los juegos mantienen su backend y reglas ya probadas. El rediseño modifica principalmente presentación, navegación y coherencia visual.

### 📸 Recuerdos compartidos

Recuerdos pasa a tener un papel mucho más importante y visual.

La intención definitiva de 3.0 es que **Javi y Laura puedan crear, editar y borrar recuerdos**, incluyendo sus fotografías. El bucket `recuerdos` sigue siendo privado y las imágenes se siguen sirviendo mediante URLs firmadas temporales.

La sección prioriza la fotografía y la sensación de galería/archivo compartido frente a una lista administrativa.

La migración `supabase-v3.0.sql` contiene las políticas necesarias para dar a ambos perfiles permisos equivalentes sobre `recuerdos_app` y sus archivos de Storage.

### ❤️ Nosotros

`Nosotros` sustituye a la idea de utilizar una pestaña de Perfil que aportaba poco a la experiencia compartida.

Agrupa información que sí tiene sentido consultar como espacio conjunto:

- Compatibilidad acumulada de `¿Y si…?`.
- Coincidencias y respuestas compartidas.
- Progreso visual del puzle.
- Recuerdos recientes.
- Vales/premios desbloqueados.

La sección no pretende convertirse en un panel de estadísticas. Se priorizan progreso, recuerdos y elementos visuales que tengan valor aunque JaviEats no se abra todos los días.

---

## 🔔 Centro de Actividad

La campana deja de ser un elemento decorativo y pasa a utilizar la tabla real `public.notificaciones`.

El centro de Actividad:

- muestra el número de avisos no leídos;
- se presenta como una hoja inferior en móvil;
- permite abrir el destino correspondiente;
- permite marcar un aviso o todos como leídos;
- utiliza los eventos ya generados por Supabase en lugar de crear un segundo historial paralelo.

Actividad interna puede incluir más información que Push. Por ejemplo, recuerdos nuevos o progreso del puzle pueden aparecer dentro de JaviEats aunque no hagan vibrar el móvil.

### Eventos de Planes preparados en 3.0

- Nueva propuesta para el otro usuario.
- Aceptación/rechazo o cambio de estado.
- Cambio de fecha, hora o condición de día completo.
- Cancelación.

### Recuerdos

Al crear un recuerdo, la base de datos puede generar una notificación interna para el otro usuario. Esto **no implica que se envíe Push**.

---

## 📱 PWA · iPhone / iPad

La v3.0 queda preparada para instalarse desde Safari como una web app independiente.

Incluye:

- `manifest.webmanifest`;
- `display: standalone`;
- `apple-mobile-web-app-capable=yes`;
- `apple-mobile-web-app-title`;
- `apple-touch-icon`;
- iconos de 192 px y 512 px;
- `viewport-fit=cover`;
- tratamiento de zonas seguras del iPhone/iPad;
- `service-worker.js`.

### Instalación en iPhone/iPad

Con JaviEats desplegado por HTTPS:

1. Abrir JaviEats en **Safari**.
2. Pulsar **Compartir**.
3. Seleccionar **Añadir a pantalla de inicio**.
4. Abrir JaviEats desde el nuevo icono.

La aplicación se abre en modo independiente, sin la interfaz normal de una pestaña de Safari.

---

## 📲 Web Push — estado actual

La infraestructura Push se está incorporando durante el desarrollo de 3.0.

### Ya preparado

- Tabla `public.push_subscriptions` para registrar una suscripción por instalación/dispositivo.
- RLS: cada usuario autenticado solo puede gestionar sus propias suscripciones.
- Registro de `service-worker.js`.
- Detección de compatibilidad con Web Push.
- En iPhone/iPad se exige abrir JaviEats desde el icono instalado antes de ofrecer la activación.
- Botón `Activar notificaciones` / `Desactivar` dentro de Actividad.
- Solicitud de permiso únicamente a partir de una acción del usuario.
- Alta automática en `push_subscriptions` con `endpoint`, `p256dh` y `auth`.
- Baja de la suscripción al desactivar notificaciones.
- Apertura de JaviEats al tocar una futura notificación.
- Clave **VAPID pública** integrada en el frontend.
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` y `VAPID_SUBJECT` guardados externamente como **Supabase Edge Function Secrets**. La clave privada no forma parte del repositorio ni del ZIP.

### Pendiente antes de activar Push real

- Crear/desplegar la Edge Function de envío (`send-push` o equivalente).
- Hacer una prueba manual con JaviEats cerrado en un iPhone.
- Conectar los eventos seleccionados al emisor Push.
- Implementar la sustitución del email de turno de `¿Y si…?` por Push cuando el destinatario tenga una suscripción activa.
- Verificar comportamiento y limpieza de suscripciones caducadas.
- Valorar badge del icono una vez el flujo básico esté estable.

### Push que se ha decidido enviar

La regla de diseño es evitar convertir JaviEats en una app pesada. Push se reserva para eventos que requieren acción o son especialmente relevantes.

#### Planes

- Te han propuesto un plan.
- Han aceptado o rechazado un plan que propusiste.
- Cambio importante de fecha/hora de un plan confirmado.
- Cancelación de un plan confirmado.

#### ¿Y si…?

- **Tu turno:** el otro ya ha respondido y ahora te toca contestar.
- **Fin del día:** al completar la quinta pregunta, se envía al usuario que no acaba de realizar la última respuesta un resumen con el resultado del día, por ejemplo `4/5 coincidencias`.

No se enviará Push por cada coincidencia, cada resultado individual, un nuevo recuerdo, una pieza del puzle, una edición de texto ni acciones administrativas.

### Email de ¿Y si…?

El correo actual se conserva durante la transición.

Objetivo final:

```text
¿El destinatario tiene Push activo?
├─ Sí  → Push de turno; no duplicar por email.
└─ No  → mantener el email de turno actual.
```

El resumen final diario de `¿Y si…?` no necesita fallback por correo; si no existe Push, puede consultarse dentro de JaviEats.

---

# Flujo de acceso

## Dispositivo con sesión válida

```text
Abrir JaviEats
↓
Supabase recupera la sesión
↓
Sincronización de datos
↓
JaviEats 3.0
```

No es necesario volver a introducir credenciales mientras la sesión siga siendo válida.

## Dispositivo sin sesión

```text
¿Quién está entrando?
↓
Javi / Laura
↓
Contraseña
↓
Sincronización
↓
JaviEats 3.0
```

El correo continúa asociado internamente al perfil seleccionado y solo se admiten los UUID autorizados de Javi y Laura.

---

# Apartados de JaviEats 3.0

El menú principal es:

```text
Inicio
Planes
Juegos
Recuerdos
Nosotros
```

Los cinco botones se mantienen en la barra inferior también en resoluciones amplias para conservar la identidad de aplicación móvil.

---

# Base de datos

JaviEats 3.0 **no reconstruye la base de datos**. Parte del backend funcional existente y añade únicamente los cambios que necesita la nueva experiencia.

Tablas principales existentes:

- `marcas_mensajes_javi`
- `mensajes_dia` *(legacy, no visible en 3.0)*
- `mensajes_laura` *(legacy, no visible en 3.0)*
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

Nueva tabla de 3.0 Push:

- `push_subscriptions`

`notificaciones` continúa siendo la fuente interna de actividad. No se crea una segunda tabla de historial para Push.

---

# Migración `supabase-v3.0.sql`

El archivo se ha preparado como migración incremental sobre el backend existente. No sustituye a la base de datos completa y no borra datos.

Incluye:

1. políticas compartidas de `propuestas`;
2. permisos compartidos de `recuerdos_app`;
3. permisos equivalentes del bucket privado `recuerdos`;
4. notificaciones más útiles de planes;
5. notificación interna al otro usuario cuando se crea un recuerdo;
6. creación/configuración idempotente de `push_subscriptions`.

Durante las pruebas puede ejecutarse de forma progresiva. La tabla `push_subscriptions` ya puede existir antes de ejecutar el resto del SQL; el bloque utiliza `IF NOT EXISTS` y policies recreables.

---

# Seguridad

JaviEats continúa utilizando Supabase Auth y Row Level Security.

Principios relevantes en 3.0:

- Solo las dos cuentas autorizadas deben utilizar la aplicación.
- Cada suscripción Push queda asociada a `auth.uid()`.
- Un usuario autenticado solo puede consultar/modificar sus propias filas de `push_subscriptions`.
- La futura Edge Function de envío podrá consultar las suscripciones del destinatario desde backend con permisos de servicio.
- La clave VAPID pública puede aparecer en frontend.
- La **clave VAPID privada nunca debe aparecer en HTML, JS, GitHub ni en un ZIP desplegable**.
- El bucket `recuerdos` continúa privado.
- Las respuestas de `¿Y si…?` siguen protegidas por las RPC existentes y no se exponen antes de que ambos hayan respondido.
- No se deben publicar claves `service_role`, contraseñas de base de datos ni cadenas de conexión privadas.

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
- Web Push / VAPID *(en integración)*
- Brevo *(correo transaccional existente)*
- Formspree *(legacy de propuestas antiguas; revisar antes de limpieza definitiva)*
- GitHub
- Vercel

---

# Estructura del proyecto 3.0

```text
JaviEats-3.0/
├── index.html
├── style.css
├── script.js
├── minigames-data.js
├── minigames.js
├── manifest.webmanifest
├── service-worker.js
├── favicon.ico
├── README.md
├── supabase-v3.0.sql
├── assets/
│   ├── favicon.svg
│   ├── apple-touch-icon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   └── puzzle-masaje.svg
└── recuerdos/
    └── README.md
```

No se incluyen dentro del paquete limpio los antiguos `README-v2.9.md`, `INSTALACION-v2.9.md`, `COMPROBACION-v2.9.sql`, `supabase-v2.9.sql` ni copias de rollback. El historial se conserva aquí, dentro del README principal.

---

# Estado de despliegue

- La web pública puede continuar mostrando la página simple de mantenimiento.
- `index_backup` permanece como copia de seguridad de la web anterior.
- Esta rama continúa llamándose **JaviEats 3.0 — en desarrollo**; no se numeran cada una de las pruebas como 3.0.1, 3.0.2, etc.
- Antes de publicar definitivamente: probar Javi, activar permisos definitivos de Laura, verificar PWA en iPhone/iPad, terminar Push y realizar regresión general de juegos/planes/recuerdos.

---

# Historial de versiones

## v3.0 — Rediseño mobile-first, Planes compartidos, Recuerdos compartidos y PWA

- Rediseño visual completo con prioridad a móvil y aspecto de aplicación.
- Nueva navegación inferior: `Inicio · Planes · Juegos · Recuerdos · Nosotros`.
- Juegos permanece como botón central sin sobredimensionarse.
- Inicio se simplifica para priorizar actividad real, próximo plan, juegos y último recuerdo.
- Planes recupera protagonismo con pendientes, próximo plan, catálogo y calendario.
- Ambos perfiles quedan preparados para proponer, aceptar/rechazar, editar y borrar planes.
- Recuerdos queda preparado para creación, edición y borrado por Javi y Laura.
- `Mensaje del día` y el antiguo apartado de mensajes/cartas dejan de formar parte de la experiencia visible.
- `Nuestra Vida` se mantiene completamente fuera de la interfaz pública.
- `Nosotros` reúne compatibilidad, puzle, recuerdos y vales con una presentación más visual.
- Centro de Actividad renovado y conectado a `public.notificaciones`.
- PWA preparada para instalación desde Safari en iPhone/iPad.
- Nuevo `manifest.webmanifest`, iconos específicos y `service-worker.js`.
- Nueva tabla `push_subscriptions` para Web Push.
- Frontend preparado para activar/desactivar Push y registrar el dispositivo automáticamente.
- VAPID configurado: pública en frontend; privada únicamente en Supabase Secrets.
- Push real todavía en integración: queda pendiente Edge Function de envío y conexión de eventos.
- Push previstos únicamente para Planes importantes, turnos de `¿Y si…?` y resumen final del día de `¿Y si…?`.
- Correo de turno de `¿Y si…?` se conservará como fallback cuando el destinatario no disponga de Push.
- El paquete 3.0 se limpia de documentación y SQL duplicados de v2.9; el histórico permanece en este README.

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
