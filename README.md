# JaviEats 💌

**Versión actual: 3.1 — EN DESARROLLO**

JaviEats es una aplicación web privada creada para Laura y Javi. La versión 3.1 parte de la base visual y funcional de 3.0 y se centra en pulir la experiencia real de uso: navegación más clara, mejor sincronización, notificaciones Push más útiles, catálogo de planes ampliado, integración con el calendario del iPhone y preparación del acceso al futuro juego principal de JaviEats.

> **Estado actual:** JaviEats 3.0 ya está desplegado y funcionando como aplicación web/PWA. La 3.1 tiene el alcance funcional cerrado y se está implementando sobre esa base sin rehacer lo que ya funciona. La integración completa del juego principal queda reservada para la **versión 3.2**, que será su gran novedad.

---

## 🚀 Última versión — v3.1

### 🎯 Objetivo de la versión

La 3.1 no es otro rediseño completo. Su objetivo es convertir la base de 3.0 en una versión más sólida, cómoda y coherente en el uso diario, especialmente desde iPhone/iPad instalados como PWA.

Principios de esta versión:

- mantener el diseño **mobile-first**;
- no romper los flujos ya probados;
- priorizar fiabilidad y claridad frente a añadir funciones sin necesidad;
- mejorar navegación, sincronización y notificaciones;
- preparar el hueco del juego principal sin mezclarlo con los minijuegos;
- conservar Supabase, autenticación, planes, recuerdos y juegos actuales como base estable.

### 🧭 Nueva navegación principal

La estructura de navegación cambia para dar más aire a la barra inferior y separar claramente el futuro juego principal de los minijuegos.

La barra inferior pasa a tener cinco accesos:

```text
Inicio
Planes
Acceso especial
Minijuegos
Recuerdos
```

Cambios importantes:

- `Nosotros` deja de ocupar una pestaña inferior.
- `Nosotros` pasa a abrirse desde un **icono de perfil en la cabecera**.
- El espacio de Perfil/Nosotros conserva compatibilidad, puzle, recuerdos y vales.
- Dentro del mismo espacio se integran también acciones de cuenta y dispositivo como:
  - activar/desactivar notificaciones Push;
  - cerrar sesión.
- `Juegos` pasa a llamarse **Minijuegos** para diferenciarlo del juego principal.
- Se reserva un acceso central especial en la barra inferior para el futuro juego principal.

### ✨ Acceso especial y lanzamiento programado

Antes del lanzamiento, el acceso central no muestra el nombre del juego.

Hasta el **12/09/2026 a las 14:00 (Europe/Madrid)**:

- se muestra como un botón especial con identidad propia;
- aparece `12·09` como pista visual;
- utiliza una animación/pulso suave para generar curiosidad;
- al tocarlo abre una pantalla de misterio;
- incluye una cuenta atrás real hasta el desbloqueo;
- no enlaza todavía con una build del juego.

Al llegar la fecha/hora programada, el propio frontend puede cambiar automáticamente el estado del botón y revelar el juego.

La **integración completa del juego pertenece a JaviEats 3.2**. La 3.1 únicamente prepara su hueco, su jerarquía dentro de la navegación y el lanzamiento visual previo. De momento no se crean tablas específicas de Supabase para ese juego, ya que la idea inicial es jugarlo cuando Javi y Laura estén juntos en el mismo dispositivo. Si más adelante se necesita persistencia entre dispositivos o partidas remotas, se reevaluará entonces.

---

## 🏠 Inicio

La filosofía de Inicio introducida en 3.0 se mantiene: mostrar qué está pasando ahora mismo y evitar convertir la pantalla en un panel lleno de datos.

Se conservan como elementos prioritarios:

- acción pendiente importante;
- próximo plan confirmado;
- progreso de `¿Y si…?`;
- progreso del puzle;
- último recuerdo;
- ideas del catálogo.

La integración visual completa del juego principal en Inicio se deja para 3.2. No se añade en 3.1 un bloque falso o una portada sin contenido funcional.

---

## 📅 Planes

Planes sigue siendo una de las funciones principales de JaviEats.

La pantalla mantiene este orden:

1. planes pendientes de aceptar o rechazar;
2. próximo plan confirmado;
3. catálogo;
4. calendario mensual.

### Catálogo 3.1

Se mantiene el catálogo actual y se amplía de 8 a 10 propuestas.

Nuevos planes:

- ☕ **Tomar algo** — café, merienda, refresco o tardeo.
- 🍽️ **Ir a comer / cenar** — opción genérica para salir a comer fuera, independiente de Sushi Date.

El catálogo seguirá siendo un **carrusel horizontal de tarjetas**.

Mejoras previstas:

- swipe natural en móvil;
- arrastre horizontal con ratón en ordenador;
- feedback visual al arrastrar;
- pista visual para que quede claro que existen más tarjetas fuera de la pantalla;
- mantener el diseño de tarjetas en lugar de cambiar a una rejilla de dos columnas.

---

## 📆 Añadir un plan al calendario del iPhone

Los planes confirmados incorporarán una acción:

**Añadir al calendario 📅**

El flujo generará un archivo `.ics` compatible con el calendario del dispositivo.

El evento incluirá cuando exista:

- nombre del plan;
- fecha;
- hora;
- duración;
- modalidad `Todo el día`;
- nota/comentario;
- referencia a JaviEats.

La primera implementación será una exportación puntual. Si el plan se modifica después dentro de JaviEats, el evento ya importado en Calendar no se actualizará automáticamente.

---

## 🔔 Centro de Actividad y Push

La infraestructura de Web Push introducida en 3.0 ya ha sido probada con éxito en iPhone, incluyendo una notificación de prueba y una notificación real de Planes.

La 3.1 no reconstruye esa infraestructura; mejora su contenido y navegación.

### Planes

Las notificaciones Push deben incluir información útil, no solo el nombre del plan.

Ejemplo de nueva propuesta:

```text
Laura te propone un plan 📅
🍣 Sushi Date · sábado 12 · 21:30
“Me apetece ir al buffet…”
```

Se personalizarán también:

- aceptación;
- rechazo;
- cancelación;
- cambio importante de fecha/hora.

Reglas:

- incluir nombre del actor (`Javi` / `Laura`);
- incluir icono y nombre del plan;
- incluir fecha;
- incluir hora si existe;
- indicar `Todo el día` cuando corresponda;
- incluir nota cuando exista, truncada si es necesario;
- no enviar Push por cambios menores o administrativos.

### ¿Y si…?

Push se utilizará para:

- avisar cuando el otro ya ha respondido y ahora te toca;
- enviar el resumen al terminar la quinta pregunta del día únicamente a la persona que no acaba de enviar la quinta respuesta.

No se enviará Push por cada pregunta/respuesta intermedia.

Ejemplos:

```text
💭 Laura ya ha respondido
Te toca en ¿Y si…? 👀
```

```text
❤️ ¿Y si…? completado
Hoy habéis coincidido 4 de 5
```

### Destinos de las notificaciones

Las notificaciones deben abrir directamente la zona útil:

- Push de Planes → **Planes**;
- Push de `¿Y si…?` → **¿Y si…?**.

El `service-worker.js` ya admite URLs de destino. La 3.1 debe aprovechar esa capacidad desde el emisor Push.

### Email de ¿Y si…?

El aviso de turno por correo se mantiene únicamente como fallback:

```text
¿El destinatario tiene Push activo?
├─ Sí  → Push de turno; no enviar email duplicado.
└─ No  → mantener el email de turno existente.
```

El resumen final diario no necesita fallback por email.

---

## 🔄 Sincronización robusta

La sincronización es una prioridad alta de 3.1.

Problema detectado en 3.0: una petición secundaria puede fallar de forma transitoria y hacer que una carga completa termine como error, dejando datos antiguos visibles hasta la siguiente sincronización.

La 3.1 debe mejorar este comportamiento con:

- reintento automático después de un fallo inicial;
- backoff progresivo y limitado;
- sincronización inmediata al recuperar conexión (`online`);
- sincronización al volver a primer plano;
- recuperación tras despertar la PWA en iPhone/iPad;
- evitar que el fallo de una sección secundaria invalide todos los datos;
- conservar el último estado válido mientras se reintenta;
- impedir cargas simultáneas que puedan pisarse entre sí;
- estado de sincronización más claro;
- posibilidad de refresco manual desde el estado de sincronización.

Estados previstos:

```text
Sincronizando…
Sin conexión · reintentando…
Sincronizado · HH:MM
```

Pruebas específicas:

- apertura en frío de la PWA;
- vuelta desde segundo plano;
- modo avión → conexión recuperada;
- red lenta/inestable;
- reintentos sin vaciar datos válidos.

---

## 🎮 Minijuegos

La sección pasa a llamarse **Minijuegos**.

Mantiene los cuatro juegos actuales:

- `¿Y si…?`
- `Piedra, papel o tijera`
- `Dibuja`
- `No lo digas`

No se mezclará el juego principal dentro de esta sección. La separación de navegación es intencionada: los minijuegos son partidas cortas y el futuro juego principal tiene entidad propia dentro de JaviEats.

---

## 📸 Recuerdos

La estructura visual de Recuerdos se mantiene.

Javi y Laura pueden seguir:

- creando recuerdos;
- editándolos;
- eliminándolos;
- añadiendo varias fotografías;
- utilizando el bucket privado `recuerdos` con URLs firmadas temporales.

La 3.1 no plantea reconstruir esta parte salvo correcciones encontradas durante QA.

---

## 👤 Perfil / Nosotros

`Nosotros` deja de ser un destino de la barra inferior y pasa a estar accesible desde el icono de perfil de la cabecera.

El contenido compartido se mantiene:

- compatibilidad acumulada de `¿Y si…?`;
- coincidencias;
- progreso del puzle;
- recuerdos recientes;
- vales/premios desbloqueados.

Además, el espacio incorpora acciones de aplicación que antes estaban dispersas:

- configuración de notificaciones del dispositivo;
- cierre de sesión.

La campana de Actividad continúa en la cabecera y no se sustituye por el icono de perfil.

---

## 🧹 Limpieza de código 3.1

### Formspree

Formspree deja de ser necesario para las propuestas de Planes porque JaviEats ya dispone de notificaciones internas y Web Push.

La limpieza de 3.1 debe eliminar:

- `formspreeEndpoint`;
- `emailDestino` si no tiene otro uso;
- `sendProposalByEmail()`;
- la llamada a Formspree tras guardar una propuesta;
- documentación legacy asociada al envío de propuestas por Formspree.

Esto **no afecta** al sistema de correo de `¿Y si…?`, que sigue siendo un fallback independiente cuando el destinatario no tenga Push.

### Mensaje del día legacy

`Mensaje del día` ya está retirado de la interfaz visible de 3.0.

En 3.1 se puede eliminar de forma cuidadosa código frontend muerto y peticiones innecesarias, sin borrar tablas del backend por el simple hecho de limpiar la interfaz.

### Notificaciones

El frontend ya permite:

- eliminar una notificación individual;
- marcar todas como leídas;
- borrar toda la actividad cuando ya no quedan no leídas.

En 3.1 se debe verificar el comportamiento real contra Supabase durante QA, no reimplementar algo que ya existe si funciona correctamente.

---

## 🎨 Identidad visual 3.1

La 3.1 incorpora el nuevo logo elegido para JaviEats.

Assets previstos:

- icono maestro;
- `icon-512.png`;
- `icon-192.png`;
- `apple-touch-icon.png`;
- favicon;
- variantes maskable para PWA.

El `manifest.webmanifest` debe separar correctamente iconos `any` y `maskable`.

Al cambiar el icono de la PWA, iPhone/iPad pueden mantener el anterior en caché. Puede ser necesario eliminar y volver a añadir JaviEats a la pantalla de inicio para ver el nuevo icono.

---

## 📱 PWA · iPhone / iPad

JaviEats continúa funcionando como PWA instalable desde Safari.

Incluye:

- `manifest.webmanifest`;
- `display: standalone`;
- `apple-mobile-web-app-capable=yes`;
- `apple-mobile-web-app-title`;
- `apple-touch-icon`;
- iconos de 192 px y 512 px;
- `viewport-fit=cover`;
- soporte de safe areas;
- `service-worker.js`;
- Web Push en instalaciones compatibles.

El formato app debe seguir funcionando correctamente en:

- iPhone;
- iPad;
- ordenador.

La referencia de diseño continúa siendo el móvil; iPad y escritorio adaptan la misma arquitectura sin crear una interfaz completamente distinta.

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
JaviEats 3.1
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
JaviEats 3.1
```

El correo continúa asociado internamente al perfil seleccionado y solo se admiten las cuentas autorizadas de Javi y Laura.

---

# Apartados de JaviEats 3.1

La arquitectura principal queda preparada así:

```text
CABECERA
├─ Actividad / notificaciones
└─ Perfil / Nosotros

BARRA INFERIOR
├─ Inicio
├─ Planes
├─ Acceso especial / juego principal
├─ Minijuegos
└─ Recuerdos
```

La barra inferior mantiene cinco botones también en resoluciones amplias para conservar una navegación coherente entre iPhone, iPad y ordenador.

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

`notificaciones` continúa siendo la fuente interna de Actividad y `push_subscriptions` almacena las instalaciones/dispositivos que han activado Push.

No se crean por ahora tablas específicas para el futuro juego principal. Su integración de datos se decidirá en 3.2 cuando exista una versión final suficientemente estable y únicamente si la forma real de jugar lo necesita.

---

# Seguridad

JaviEats continúa utilizando Supabase Auth y Row Level Security.

Principios relevantes:

- solo las dos cuentas autorizadas deben utilizar la aplicación;
- cada suscripción Push queda asociada a `auth.uid()`;
- un usuario autenticado solo puede gestionar sus propias suscripciones Push;
- la clave VAPID privada nunca debe aparecer en HTML, JS, GitHub ni archivos entregables;
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

Formspree queda marcado para retirada definitiva en 3.1.

---

# Estructura del proyecto 3.1

```text
JaviEats/
├── index.html
├── style.css
├── script.js
├── app-navigation.js
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

`app-navigation.js` concentra la reorganización de navegación y el acceso especial programado sin mezclar esa lógica con el núcleo histórico de `script.js`.

---

# QA previsto antes de cerrar 3.1

La versión debe probar al menos:

- propuesta Javi → Laura;
- propuesta Laura → Javi;
- aceptar;
- rechazar;
- cancelar;
- cambio de fecha/hora;
- contenido completo de Push;
- destino correcto de Push de Planes;
- turno de `¿Y si…?`;
- resultado final 5/5 de `¿Y si…?`;
- destino correcto de Push de `¿Y si…?`;
- activación/desactivación Push desde Perfil;
- eliminación de notificaciones;
- catálogo horizontal móvil/escritorio;
- exportación `.ics` desde iPhone;
- nueva identidad PWA;
- arranque en frío;
- reanudación desde segundo plano;
- pérdida y recuperación de conexión;
- ausencia de regresiones en Minijuegos y Recuerdos.

---

# Convención de commits

A partir de 3.1, los commits del proyecto deben utilizar una nomenclatura simple y consistente.

Para modificar un archivo existente:

```text
ACTUALIZACION <archivo> VERSION <versión>
```

Ejemplo:

```text
ACTUALIZACION index.html VERSION 3.1
```

Para crear un archivo nuevo:

```text
CREACIÓN <archivo> VERSION <versión>
```

Ejemplo:

```text
CREACIÓN app-navigation.js VERSION 3.1
```

No se utilizarán mensajes genéricos de commit para los cambios normales de versión salvo que exista una razón concreta.

---

# Estado de despliegue

- JaviEats 3.0 está desplegado y usable.
- La 3.1 se desarrolla directamente sobre la base actual.
- El alcance funcional de 3.1 está **cerrado**: cualquier idea nueva pasa a 3.2 salvo decisión explícita de reabrir la versión.
- El acceso especial de navegación ya está preparado para generar hype antes del lanzamiento.
- La conexión definitiva del juego principal pertenece a **JaviEats 3.2** y se realizará únicamente cuando la build esté lista.
- No se realizan cambios adicionales en ese juego desde este frente hasta que Javi indique lo contrario.

---

# Próxima gran versión

## v3.2 — Juego principal de JaviEats

La 3.2 tendrá como gran novedad la integración completa del juego principal dentro de JaviEats.

La arquitectura prevista parte del hueco reservado en 3.1 y mantendrá el juego separado de `Minijuegos`. La integración concreta —archivos, navegación interna, persistencia y cualquier necesidad de Supabase— se decidirá cuando la build estable esté lista para entrar en la aplicación.

Hasta el momento de su revelación pública, la documentación evita mostrar su nombre en claro.

---

# Historial de versiones

## v3.1 — Pulido de la PWA, navegación, Push, sincronización y preparación del juego principal

- Nueva arquitectura de navegación con Perfil/Nosotros en la cabecera.
- Barra inferior preparada como `Inicio · Planes · acceso especial · Minijuegos · Recuerdos`.
- `Juegos` pasa a llamarse `Minijuegos`.
- Nuevo acceso central especial con cuenta atrás y revelación programada para el 12/09/2026 a las 14:00.
- Preparación del hueco del futuro juego principal sin integrarlo todavía ni crear backend específico; la integración completa pasa a 3.2.
- Catálogo de Planes ampliado de 8 a 10 opciones con `Tomar algo` e `Ir a comer / cenar`.
- Carrusel de catálogo preparado para swipe móvil y arrastre con ratón en escritorio.
- Push de Planes previsto con actor, plan, fecha/hora y nota.
- Push de `¿Y si…?` personalizado para turno y resultado final 5/5.
- Destinos de Push preparados para abrir directamente Planes o `¿Y si…?`.
- Email de turno de `¿Y si…?` conservado únicamente como fallback si el destinatario no tiene Push.
- Formspree marcado para retirada definitiva de las propuestas de Planes.
- Limpieza prevista del código frontend muerto de `Mensaje del día`.
- Sincronización robusta como prioridad alta: reintentos, recuperación `online`, preservación de datos y control de concurrencia.
- Exportación `.ics` para añadir planes confirmados al calendario del iPhone/iPad.
- Integración del nuevo logo elegido en iconos PWA, Apple Touch Icon, favicon y variantes maskable.
- Verificación del centro de Actividad y eliminación de notificaciones sin duplicar lógica existente.
- Alcance de 3.1 cerrado; nuevas funciones posteriores pasan a 3.2.

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
