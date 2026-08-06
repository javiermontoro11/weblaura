# JaviEats 💌

**Versión actual: 2.3**

JaviEats es una aplicación web privada creada para Laura y Javi.

Permite proponer planes, consultar un calendario compartido, guardar mensajes y cartas, responder una pregunta diaria, jugar a un reto de piedra, papel o tijera y conservar recuerdos especiales.

---

# Versión actual

## JaviEats 2.3 — Conexión compartida

La versión 2.3 introduce la conexión real entre las cuentas de Laura y Javi mediante Supabase.

### Novedades principales

- Inicio mediante preguntas privadas antes del login.
- Inicio de sesión con correo y contraseña después de superar las preguntas.
- Sesión persistente mediante Supabase Auth.
- Calendario compartido entre Laura y Javi.
- Propuestas guardadas en la nube.
- Estados para los planes.
- Apartado propio de Laura.
- Mensajes, cartas, pensamientos e ideas sincronizados.
- Pregunta diaria opcional.
- Respuestas sincronizadas entre dispositivos.
- Piedra, papel o tijera con un intento diario real.
- Partida validada desde Supabase.
- Vales sincronizados.
- Tickets descargables en PNG.
- Menú inferior con cinco apartados en una sola línea.

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
- Reto diario.
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

# Pregunta diaria

Dentro del apartado Laura aparece una pregunta diferente cada día.

Laura puede responderla si le apetece.

Características:

- Una pregunta diaria.
- Una única respuesta por día.
- Respuesta editable.
- Sin obligación de responder.
- Sin conversación posterior.
- Javi puede leer la respuesta.
- Javi no puede responder desde la aplicación.

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

---

# Vales

Cuando Laura gana el reto diario recibe:

> Vale por un masaje de 30 minutos

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

También utiliza estas funciones PostgreSQL:

```text
iniciar_reto_diario()
jugar_ronda_reto(text)
canjear_vale(uuid)
```

---

# Seguridad

La aplicación utiliza Supabase Auth y políticas Row Level Security.

Permisos principales:

- Solo Laura puede crear propuestas.
- Solo Laura puede escribir mensajes y cartas.
- Solo Laura puede responder la pregunta diaria.
- Solo Laura puede jugar al reto.
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
- PostgreSQL
- Row Level Security
- Formspree
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

## JaviEats 1.0 — Primera versión

- Página de inicio.
- Catálogo de servicios.
- Modal para proponer planes.
- Fecha, hora, duración, nivel de ganas y nota.
- Envío mediante Formspree.
- Diseño móvil.
- Menú inferior.

## JaviEats 1.1 — Acceso privado

- Preguntas personales antes de entrar.
- Selección aleatoria de preguntas.
- Validación de respuestas.
- Dos preguntas por acceso.
- Sesión temporal con `sessionStorage`.
- Botón para cerrar el acceso.

## JaviEats 1.2 — Calendario local

- Calendario mensual.
- Selección de días.
- Indicador de días con planes.
- Historial local.
- Próximo plan.
- Total de propuestas.
- Persistencia mediante `localStorage`.

## JaviEats 2.0 — Recuerdos

- Línea temporal de recuerdos.
- Galería de fotografías.
- Lector de cartas.
- Archivos de texto externos.
- Fotografías guardadas en el repositorio.
- Navegación entre recuerdos.

## JaviEats 2.1 — Reto diario

- Minijuego de piedra, papel o tijera.
- Cinco rondas.
- Empates que consumen ronda.
- Contador de victorias.
- Muerte súbita.
- Premio secreto.
- Vale por un masaje.
- Descarga del vale en PNG.

## JaviEats 2.2 — Mejoras de contenido

- Revisión de todos los servicios.
- Nota obligatoria para Plan diferente.
- Historial debajo del calendario.
- Mejoras visuales en el reto y en los vales.

## JaviEats 2.3 — Conexión compartida

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

---

Hecho con cariño para Laura y Javi. ❤️
