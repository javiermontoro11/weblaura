# JaviEats 💌

**Versión actual: 2.5.1**

JaviEats es una aplicación web privada creada para Laura y Javi.

Permite proponer planes, consultar un calendario compartido, guardar mensajes y cartas, responder juntos a “¿Y si…?”, jugar a un reto de piedra, papel o tijera, completar el puzle del masaje y conservar recuerdos especiales.

---

## 🚀 Última versión — v2.5.1

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

El orden de entrada es:

```text
Preguntas privadas
↓
Correo y contraseña
↓
JaviEats
```

Las preguntas personales actúan como primer control de acceso.

Después se solicita el correo y la contraseña de una de las dos cuentas autorizadas.

Solo existen dos usuarios válidos:

- Javi
- Laura

---

# Apartados de la aplicación

El menú principal incluye:

```text
Inicio
Servicios
Calendario
Laura
Recuerdos
```

Los cinco botones aparecen en una sola línea en el menú inferior.

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
├── README.md
├── supabase-v2.5.1.sql
├── COMPROBACION-v2.5.1.sql
├── INSTALACION-v2.5.1.md
├── supabase/
│   ├── config.toml.snippet
│   └── functions/
│       └── turno-y-si/
│           └── index.ts
├── assets/
│   └── puzzle-masaje.svg
└── recuerdos/
    ├── carta-2026-04-24.txt
    ├── carta-2026-07-13.txt
    ├── ramo-2026-04-24.jpeg
    ├── ramo-2026-05-31.jpeg
    ├── ramo-2026-07-24.jpeg
    └── laura-ramo-2026-07-24.jpeg
```

---

# Historial de versiones

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
