# JaviEats 💌

**Versión actual: 2.7.1**

JaviEats es una aplicación web privada creada para Laura y Javi.

Permite proponer planes, consultar un calendario compartido, guardar mensajes y cartas, responder juntos a “¿Y si…?”, jugar al reto diario de piedra, papel o tijera, completar el puzle del masaje, conservar recuerdos y abrir una zona de minijuegos pensada tanto para jugar por separado como cuando Javi y Laura están juntos.

---

## 🚀 Última versión — v2.7.1

### Ajuste visual del puzle y favicon

La versión 2.7.1 es una actualización visual y de mantenimiento sobre la v2.7. No cambia la lógica de los minijuegos, Supabase ni el backend.

- Se añade un **favicon propio de JaviEats**, con un corazón atravesado por una flecha, para sustituir el icono genérico de la pestaña del navegador.
- El favicon vive en `assets/favicon.svg` y se enlaza desde el `<head>` de `index.html`.
- El puzle del masaje pasa a utilizar `assets/puzzle-masaje.png`.
- Se incorpora una nueva imagen completa de masaje, diseñada para revelarse progresivamente en las seis piezas del puzle.
- `style.css` actualiza la referencia del antiguo `puzzle-masaje.svg` al nuevo PNG.
- Se actualiza la versión de caché del CSS y de los recursos visuales a `2.7.1`.
- No hay cambios en `script.js`, `minigames.js`, `minigames-data.js`, SQL, Supabase, Brevo, Vault, Formspree ni Edge Functions.

---

## v2.7 — Minijuegos · nueva sección general

### Minijuegos · nueva sección general

La versión 2.7 convierte la antigua pestaña **Dibuja** en una sección completa de **🎮 Minijuegos**. La idea es que JaviEats tenga un único lugar desde el que abrir todos los juegos actuales y los que se añadan en el futuro.

### Novedades principales

- La pestaña inferior `Dibuja` pasa a llamarse **🎮 Minijuegos**.
- La página Inicio incorpora un **acceso rápido a Minijuegos**.
- La portada de Minijuegos reúne cuatro experiencias:
  - `💭 ¿Y si…?`
  - `✊ Piedra, papel o tijera`
  - `🎨 Dibuja`
  - `🚫 No lo digas`
- `¿Y si…?` conserva toda su lógica, historial, compatibilidad y límite de hasta cinco preguntas diarias.
- `Piedra, papel o tijera` conserva el intento diario, las cinco rondas, la muerte súbita, el puzle de seis piezas y el vale de masaje.
- `Dibuja` se rehace con una batería diseñada específicamente para cosas que **sí tienen sentido dibujar**.
- `No lo digas` estrena una batería distinta para futbolistas, artistas, famosos, personajes, series, películas, tendencias y conceptos que funcionan mejor mediante pistas verbales.
- La lógica de los dos juegos presenciales vive en `minigames.js`.
- Las dos baterías completas viven en `minigames-data.js`.
- Los antiguos `draw-data.js` y `draw-game.js` dejan de utilizarse y se eliminan del proyecto.
- No hay migraciones SQL ni cambios en Supabase, Brevo, Vault, Formspree o Edge Functions para instalar la v2.7.

### Acceso por perfil y estreno para Laura

**Javi** puede abrir los cuatro minijuegos desde el momento en que se despliega la versión, para poder probarlos antes del estreno.

**Laura**, hasta el **30 de agosto de 2026 a las 22:00 (Europe/Madrid)**, solo puede abrir:

- `¿Y si…?`
- `Piedra, papel o tijera`

Mientras tanto, `Dibuja` y `No lo digas` aparecen visibles pero bloqueados con una cuenta atrás en tiempo real. El bloqueo no es solo visual: la navegación también impide abrir esos juegos antes de la fecha.

Al llegar la hora indicada, ambos se desbloquean automáticamente sin necesidad de publicar una nueva versión.

### 🎨 Dibuja · duelos rápidos por territorios

Dibuja deja de intentar utilizar nombres o referencias difíciles de representar y se centra en conceptos visuales.

Reglas actuales:

- Hay **9 categorías** disponibles.
- Una moneda decide quién elige la primera categoría y quién hace el primer dibujo del duelo.
- Cada categoría se resuelve con **dos intentos**: uno dibuja Javi y otro dibuja Laura.
- Cada intento utiliza una palabra distinta de la misma categoría.
- Hay **60 segundos** como máximo por dibujo.
- Si solo uno consigue que el otro acierte, esa persona conquista la categoría.
- Si los dos lo consiguen, gana quien haya necesitado menos tiempo.
- Si ninguno lo consigue o los dos tardan exactamente lo mismo, la categoría queda libre y puede volver a elegirse.
- Después de cada territorio cambia quién elige la siguiente categoría.
- Gana la partida quien conquista **3 territorios**.
- El juego registra localmente conceptos recientes para reducir repeticiones entre partidas.
- El lienzo funciona con ratón, móvil y stylus e incluye colores, goma y borrado completo.

Categorías de Dibuja:

```text
Fútbol
Pop & Disney
Series & TV
Películas
Música
Héroes & Sagas
Comida & Casa
Internet & Juegos
Mix
```

La batería contiene **225 conceptos visuales**, 25 por categoría.

### 🚫 No lo digas · pistas contra reloj

No lo digas aprovecha justamente las referencias que no funcionan bien dibujando.

Ejemplo de carta:

```text
Objetivo: JOHN B
Prohibidas: Outer Banks · Sarah · Pogues
```

La persona que da las pistas debe conseguir que la otra diga la palabra objetivo sin utilizar ninguna de las tres palabras prohibidas.

Reglas actuales:

- Sorteo inicial para decidir quién da pistas primero.
- **2 turnos por persona**.
- **45 segundos por turno**.
- Cada acierto suma **1 punto** a quien está dando las pistas.
- Cada carta contiene una palabra objetivo y **3 palabras prohibidas**.
- Se puede pasar una carta y continuar con la siguiente.
- Si se utiliza una palabra prohibida, esa carta queda anulada.
- Al terminar los cuatro turnos gana quien tenga más puntos.
- Si hay empate, se juegan tandas de desempate de **30 segundos** hasta romperlo.
- Se guarda un historial local de cartas recientes para reducir repeticiones.

Categorías de No lo digas:

```text
Fútbol
Pop & Disney
Series
Películas
Música
Marvel & Sagas
Famosos & públicos
Internet & Tendencias
Mix
```

La batería contiene **225 cartas**, 25 por categoría. Cada una incluye su objetivo y tres palabras prohibidas.

### Batería total v2.7

```text
Dibuja       225 conceptos
No lo digas  225 cartas
-----------------------
Total         450 retos
```

La separación entre ambas baterías es deliberada: una palabra puede ser muy buena para un juego verbal y pésima para dibujar. La v2.7 prioriza que cada concepto esté en el juego donde realmente funciona.

---

## v2.6 — Dibuja original y enlaces inteligentes de “¿Y si…?”

La v2.6 introdujo la primera versión de Dibuja y dejó preparada la corrección de los enlaces de turno de “¿Y si…?”. La mecánica original de Dibuja queda sustituida por la v2.7, pero la corrección de los enlaces se conserva.

### Corrección de “¿Y si…?” incluida desde v2.6

- Los correos de turno pueden enlazar a `?open=ysi&for=javi|laura&turn=<id>`.
- Si el navegador tiene abierta la cuenta equivocada, JaviEats avisa antes de entrar.
- Permite cambiar al perfil destinatario conservando el destino del enlace.
- Si no existe sesión, el enlace puede seleccionar automáticamente el perfil correcto y pedir solo su contraseña.
- Si el turno ya está resuelto, la aplicación lo indica y muestra el estado actual de “¿Y si…?”.

---

## v2.5.2

### Entrada rápida y personalizada

La versión 2.5.2 elimina el antiguo gate de preguntas privadas y convierte el acceso en una experiencia mucho más rápida para Javi y Laura.

### Novedades principales

- Eliminadas las preguntas privadas previas al login.
- Si el dispositivo conserva una sesión válida de Supabase, **JaviEats entra automáticamente** sin pedir correo ni contraseña otra vez.
- Nueva pantalla breve de bienvenida personalizada para Javi o Laura mientras se sincronizan los datos.
- La bienvenida muestra un pequeño resumen del estado actual, como Compatibilidad JaviEats, turno de “¿Y si…?”, progreso del puzle o planes guardados.
- Cuando no existe sesión, aparece un selector visual **Javi / Laura**.
- El correo queda asociado internamente al perfil elegido y el usuario solo escribe su contraseña.
- Botón para volver atrás si se ha elegido el perfil equivocado.
- Los enlaces `?open=ysi` de los correos mantienen su comportamiento y, tras autenticar, llevan directamente a “¿Y si…?”.
- Se mantiene `persistSession`, `autoRefreshToken`, control de acceso por UUID y todas las reglas de Supabase existentes.
- No hay cambios de tablas, RLS, RPC, Edge Functions, Brevo ni Formspree en esta versión.

---

## v2.5.1

### ¿Y si…? en modo asíncrono real

La versión 2.5.1 convierte “¿Y si…?” en una experiencia compartida con ritmo propio: Javi y Laura pueden completar hasta cinco preguntas cerradas al día, recibir otra en cuanto ambos responden y avisarse por correo cuando el turno queda pendiente.

### Novedades principales

- Batería ampliada de **80 a 300 preguntas cerradas**.
- Máximo de **5 preguntas completadas por día**.
- Al responder ambos, aparece inmediatamente una nueva pregunta mientras queden huecos del día.
- Contador diario `0/5 → 5/5` y resumen de coincidencias del día.
- Las preguntas pendientes **caducan al cambiar de día**: no se arrastran.
- El contador diario se reinicia cada día en horario `Europe/Madrid`.
- La Compatibilidad JaviEats histórica **no se reinicia**.
- Las preguntas ya vistas, aunque caduquen o se salten, no se repiten dentro de la misma temporada.
- Se intenta alternar categorías para evitar varias preguntas parecidas seguidas.
- **1 cambio de pregunta al día**, disponible solo mientras nadie haya respondido.
- El último resultado permanece visible mientras aparece la siguiente pregunta.
- Historial con fecha y posición de la pregunta dentro del día.
- Nueva cola `y_si_notificaciones` para avisos de turno.
- Cuando una persona responde primero, se programa un correo al otro para **2 minutos después**.
- Si la otra persona responde antes de esos 2 minutos, el correo se cancela.
- El correo nunca revela la respuesta del primero; solo muestra la pregunta y avisa de que toca responder.
- El enlace del correo abre JaviEats y lleva directamente a “¿Y si…?”.
- El aviso se envía mediante **Supabase Database Webhook + Edge Function + Brevo**; no hace falta un Cron permanente.
- El recordatorio fijo de las 18:00 para piedra, papel o tijera queda aplazado.
- Formspree sigue intacto para los avisos de nuevos planes.

---

# Flujo de acceso

## Dispositivo con sesión válida

```text
Abrir JaviEats
↓
Supabase recupera la sesión
↓
Bienvenida personalizada
↓
JaviEats
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
Bienvenida personalizada
↓
JaviEats
```

El correo no se escribe manualmente: JaviEats utiliza el correo asociado al perfil seleccionado. La autenticación sigue realizándose con Supabase Auth y únicamente se admiten los UUID autorizados de Javi y Laura.

---

# Apartados de la aplicación

El menú principal incluye:

```text
Inicio
Servicios
Calendario
Laura
Recuerdos
Minijuegos
```

Los seis botones aparecen en una sola línea en el menú inferior. `Minijuegos` sustituye a la antigua entrada independiente de `Dibuja`.

---

# Inicio

La pantalla de inicio muestra:

- Saludo personalizado según el usuario.
- Estado de sincronización.
- “¿Y si…?” compartido y Compatibilidad JaviEats.
- Reto diario.
- Progreso del puzle del masaje.
- Número total de propuestas.
- Próximo plan.
- Servicios destacados.
- Acceso rápido al catálogo.
- Acceso rápido a Minijuegos.

---

# Servicios

Laura puede proponer diferentes servicios:

- Mimos
- Masaje
- Sushi Date
- Telenovio
- Peli en el cine
- Plan diferente
- Plan sorpresa
- Paseo con Randy y Nala

Cada propuesta puede incluir:

- Fecha
- Hora
- Duración
- Nivel de ganas
- Nota opcional

El servicio `Plan diferente` requiere una explicación obligatoria.

Javi puede consultar los servicios, pero las propuestas las crea Laura desde su cuenta.

---

# Calendario compartido

El calendario ya no depende del navegador ni del móvil.

Los planes se guardan en Supabase y aparecen en las cuentas de Javi y Laura.

Cada propuesta incluye:

- Servicio
- Categoría
- Fecha
- Hora
- Duración
- Nivel de ganas
- Nota
- Estado
- Usuario que la creó
- Fecha de creación

## Estados disponibles

- Pendiente
- Confirmada
- Realizada
- Cancelada

## Permisos de Laura

Laura puede:

- Crear propuestas.
- Ver todas las propuestas.
- Cancelar propuestas pendientes.
- Eliminar propuestas pendientes.

## Permisos de Javi

Javi puede:

- Ver todas las propuestas.
- Confirmarlas.
- Marcarlas como realizadas.
- Cancelarlas.
- Eliminarlas.
- Limpiar el calendario completo.

---

# Tickets de propuestas

Después de crear una propuesta, Laura puede descargar un ticket en formato PNG.

El ticket incluye:

- Servicio
- Fecha
- Hora
- Duración
- Nivel de ganas
- Estado
- Nota

La propuesta queda guardada en Supabase antes de generar el ticket.

---

# Apartado Laura

La sección Laura es un espacio privado donde Laura puede escribirle cosas a Javi.

Tipos de escritos disponibles:

- Mensaje
- Carta
- Algo que quiero contarte
- Idea para nosotros

Laura puede:

- Crear escritos.
- Editarlos.
- Eliminarlos.
- Consultarlos desde cualquier dispositivo.

Javi puede:

- Leerlos.
- Marcarlos como favoritos.
- Guardarlos en Recuerdos.

Javi no puede:

- Modificar el contenido.
- Escribir una respuesta desde este apartado.
- Crear mensajes en nombre de Laura.

No existe estado de lectura ni sistema de chat.

---


# Minijuegos

La sección **Minijuegos** funciona como hub de las experiencias jugables de JaviEats.

Desde una única pantalla permite abrir:

- `¿Y si…?`
- `Piedra, papel o tijera`
- `Dibuja`
- `No lo digas`

Los dos primeros continúan utilizando Supabase porque su estado debe mantenerse entre dispositivos y entre las cuentas de Javi y Laura.

`Dibuja` y `No lo digas` están pensados para jugar juntos en un mismo dispositivo. Su partida es local y no necesita tablas nuevas ni sincronización en tiempo real.

## Dibuja

- 9 categorías.
- Dos dibujos por territorio, uno por persona.
- 60 segundos por dibujo.
- Si ambos consiguen un acierto, decide el tiempo.
- Primero en conquistar 3 territorios gana.
- 225 conceptos dibujables.

## No lo digas

- 2 turnos por persona.
- 45 segundos por turno.
- 1 punto por cada objetivo acertado.
- 3 palabras prohibidas por carta.
- Desempate en tandas de 30 segundos.
- 225 cartas completas.

## Desbloqueo de Laura

Hasta el `30/08/2026 22:00 Europe/Madrid`, Laura ve `Dibuja` y `No lo digas` bloqueados con cuenta atrás. Javi puede utilizarlos antes para pruebas. El desbloqueo se produce automáticamente al llegar la fecha.

---

# ¿Y si…?

“¿Y si…?” es una experiencia compartida para Javi y Laura. Ambos reciben exactamente la misma situación y eligen una respuesta cerrada sin conocer la elección del otro.

Características:

- Batería de **300 preguntas cerradas**.
- Entre 2 y 4 opciones por pregunta.
- Hasta **5 preguntas completadas al día** entre los dos.
- En cuanto ambos responden, el resultado se revela y queda disponible la siguiente pregunta del día.
- Una única respuesta por usuario y pregunta; después de guardarla queda bloqueada.
- La elección del otro permanece oculta hasta que ambos contestan.
- Si una pregunta queda pendiente al cambiar de día, caduca y la jornada siguiente comienza en `0/5`.
- La Compatibilidad JaviEats y el historial acumulado no se reinician al cambiar de día.
- Las preguntas vistas, saltadas o caducadas no se repiten dentro de la misma temporada.
- Se intenta alternar categorías para no encadenar preguntas demasiado parecidas.
- Existe **un cambio compartido de pregunta al día**, disponible únicamente antes de que alguien responda.
- Cuando el primero responde, se prepara un aviso por email para el otro a los dos minutos; si el segundo responde antes, el aviso se cancela.
- El historial solo muestra preguntas completadas por los dos y permite distinguir coincidencias y respuestas diferentes.
- Al terminar la batería activa comienza automáticamente una nueva temporada.

## Compatibilidad JaviEats

El corazón de compatibilidad es un indicador lúdico basado únicamente en las preguntas de “¿Y si…?”. No pretende medir una relación real.

```text
compatibilidad = coincidencias / preguntas completadas por ambos × 100
```

También se muestran el número de preguntas compartidas, las coincidencias acumuladas y la mejor racha consecutiva.

---

# Reto diario

La aplicación incluye una partida diaria de piedra, papel o tijera.

## Reglas

- Se juegan cinco rondas normales.
- Los empates consumen ronda.
- Gana quien consiga más victorias.
- Si hay empate tras cinco rondas, comienza la muerte súbita.
- En muerte súbita, los empates continúan la partida.
- El primer resultado que no sea empate decide el ganador.

## Control real del intento

El reto se controla desde Supabase.

Laura solo puede utilizar un intento diario aunque:

- Cambie de móvil.
- Cambie de navegador.
- Use navegación privada.
- Borre los datos del navegador.
- Cambie la hora del dispositivo.

La jugada de la máquina se genera dentro de Supabase.

Javi puede ver la partida y el resultado, pero no puede jugar.

## Premio acumulado

- Cada partida completa ganada entrega una pieza del puzle.
- El puzle contiene seis piezas.
- Las piezas no se pierden al perder una partida.
- Una misma partida no puede entregar más de una pieza.
- Al conseguir la sexta pieza se crea el vale del masaje.
- La siguiente victoria después de completar un puzle inicia un nuevo ciclo.

---

# Puzle del masaje

El progreso se guarda en Supabase y se muestra:

- En un popup automático para Laura al entrar en JaviEats.
- En la tarjeta del reto de la página Inicio.
- Dentro del modal del juego al terminar una partida ganada.

El puzle revela una ilustración completa de JaviEats al reunir las seis piezas.

---

# Vales

Laura recibe un vale de masaje de 30 minutos solamente cuando completa las seis piezas del puzle.

Los vales se guardan en Supabase.

Laura puede:

- Consultarlos.
- Descargarlos en PNG.
- Proponer su canje.

Javi puede:

- Consultarlos.
- Marcarlos como canjeados.

---

# Recuerdos

La sección Recuerdos contiene cartas, flores y momentos especiales.

Archivos actuales:

- `recuerdos/carta-2026-04-24.txt`
- `recuerdos/ramo-2026-04-24.jpeg`
- `recuerdos/ramo-2026-05-31.jpeg`
- `recuerdos/carta-2026-07-13.txt`
- `recuerdos/ramo-2026-07-24.jpeg`
- `recuerdos/laura-ramo-2026-07-24.jpeg`

Los escritos de Laura que Javi marque como recuerdo también aparecen en esta sección.

---

# Base de datos

La aplicación utiliza las siguientes tablas:

- `propuestas`
- `mensajes_laura`
- `marcas_mensajes_javi`
- `preguntas_diarias`
- `respuestas_diarias`
- `retos_diarios`
- `rondas_reto`
- `vales`
- `puzzles_premio`
- `piezas_puzzle`
- `y_si_preguntas`
- `y_si_dias`
- `y_si_respuestas`
- `y_si_notificaciones`

`preguntas_diarias` y `respuestas_diarias` se conservan como estructura legacy de versiones anteriores, pero el frontend actual ya no las utiliza. Si `recordatorios_email` llegó a crearse durante las pruebas de v2.5, puede conservarse: la v2.5.1 no lo consulta ni lo necesita.

También utiliza estas funciones PostgreSQL:

```text
iniciar_reto_diario()
jugar_ronda_reto(text)
canjear_vale(uuid)
obtener_y_si_actual()
responder_y_si(integer)
saltar_y_si_actual()
obtener_y_si_historial()
```

---

# Seguridad

La aplicación utiliza Supabase Auth y políticas Row Level Security.

Permisos principales:

- Solo Laura puede crear propuestas.
- Solo Laura puede escribir mensajes y cartas.
- Javi y Laura pueden responder “¿Y si…?” desde sus propias cuentas.
- La respuesta del otro no se expone hasta que ambos han contestado.
- Solo Laura puede jugar al reto.
- Solo la función segura del reto puede crear piezas y completar puzles.
- Javi y Laura pueden consultar el calendario.
- Javi y Laura pueden leer los escritos.
- Solo Javi puede administrar estados de propuestas.
- Solo Javi puede marcar favoritos.
- Solo Javi puede guardar escritos en Recuerdos.
- Solo Javi puede marcar vales como canjeados.
- Los usuarios no autenticados no pueden acceder a las tablas.

Nunca se debe publicar:

- Una clave `sb_secret`.
- La clave `service_role`.
- La contraseña de la base de datos.
- Una cadena de conexión privada.

---

# Tecnologías utilizadas

- HTML
- CSS
- JavaScript
- Supabase
- Supabase Auth
- Supabase Edge Functions
- Supabase Database Webhooks
- PostgreSQL
- Row Level Security
- Formspree
- Brevo (correo transaccional)
- GitHub
- Vercel

---

# Estructura del proyecto

```text
JaviEats/
├── index.html
├── style.css
├── script.js
├── minigames-data.js
├── minigames.js
├── README.md
├── INSTALACION-v2.7.md
├── INSTALACION-v2.6.md
├── INSTALACION-v2.5.2.md
├── supabase-v2.5.1.sql
├── COMPROBACION-v2.5.1.sql
├── INSTALACION-v2.5.1.md
├── supabase/
│   ├── config.toml.snippet
│   └── functions/
│       └── turno-y-si/
│           └── index.ts
├── assets/
│   ├── favicon.svg
│   └── puzzle-masaje.png
└── recuerdos/
    ├── carta-2026-04-24.txt
    ├── carta-2026-07-13.txt
    ├── ramo-2026-04-24.jpeg
    ├── ramo-2026-05-31.jpeg
    ├── ramo-2026-07-24.jpeg
    └── laura-ramo-2026-07-24.jpeg
```

Los archivos `draw-data.js` y `draw-game.js` pertenecían a la implementación de la v2.6 y ya no forman parte de la versión actual.

---

# Historial de versiones

## v2.7.1 — Favicon y nuevo arte del puzle

- Nuevo favicon de JaviEats con corazón y flecha.
- Nueva imagen PNG para el puzle de seis piezas del masaje.
- Actualizada la referencia visual del puzle en `style.css`.
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
