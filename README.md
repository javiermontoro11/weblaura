# JaviEats

Web privada tipo app de delivery para proponer planes entre Laura y Javi.

---

# Novedades / Historial de versiones

## Versión 2.0 — Actualización JaviEats

Rediseño completo de la web.

### Novedades principales

* Nuevo nombre de la app: **JaviEats**.
* Cambio de concepto:

  * Antes era una web de reservas.
  * Ahora es una app tipo delivery para proponer planes.
* Nuevo diseño mucho más parecido a una aplicación móvil.
* Nueva pantalla principal con estilo app.
* Menú inferior de navegación:

  * Inicio
  * Servicios
  * Calendario
  * Propuestas
* Nuevo catálogo de servicios.
* Nuevos servicios añadidos:

  * Sushi Date
  * Masaje
  * Telenovio
  * Peli & Sofá
  * Café y Charla
  * Plan Sorpresa
  * Paseo / Recogida
* Nuevo enfoque:

  * Laura propone un plan.
  * Javi recibe la propuesta por correo.
  * El plan se confirma hablando entre los dos.
* Se añade calendario local.
* Se añade historial local de propuestas.
* Se añade contador de propuestas enviadas.
* Se añade indicador de próximo plan.
* Mejoras visuales generales.
* La web sigue siendo simple, gratuita y sin base de datos.

---

## Versión 1.3 — Integración con correo

Se configura el envío de propuestas por correo mediante Formspree.

### Novedades

* Añadido endpoint de Formspree.
* Configurado el correo destino de Javi.
* Las propuestas llegan por email con:

  * Servicio elegido.
  * Categoría.
  * Fecha.
  * Hora.
  * Duración aproximada.
  * Nivel de ganas.
  * Nota opcional.

### Configuración actual

Endpoint Formspree:

```text
https://formspree.io/f/xjgddbjw
```

Correo destino:

```text
javiermontorogranados@gmail.com
```

---

## Versión 1.2 — Segunda pregunta con calendario

Mejora del sistema de acceso.

### Novedades

* La segunda pregunta deja de responderse escribiendo.
* Ahora se responde seleccionando la fecha en un calendario.
* Fecha correcta:

```text
24/04/2026
```

---

## Versión 1.1 — Cambio de primera pregunta

Ajuste del texto de la primera pregunta de acceso.

### Novedades

* La primera pregunta pasa a ser:

```text
¿Cómo le gusta que le llamen al mejor novio del mundo?
```

* La respuesta válida sigue siendo cualquier texto que contenga:

```text
javi
```

* Acepta mayúsculas y minúsculas.

---

## Versión 1.0 — Primera versión

Primera versión funcional de la web.

### Funciones iniciales

* Web inicial de reservas VIP con Javi.
* Acceso privado con dos preguntas.
* Servicios básicos:

  * Telenovio
  * Masajes
  * Ir a comer sushi
* Formulario de reserva.
* Diseño sencillo.
* Preparada para subir a Vercel mediante GitHub.

---

# Información general

JaviEats es una web privada para proponer planes entre Laura y Javi.

La idea no es pedir servicios como si fuese una app cualquiera, sino elegir un plan, proponer una fecha y una hora, y que Javi reciba la propuesta por correo.

---

# Archivos

* `index.html`: estructura de la página.
* `style.css`: diseño visual.
* `script.js`: preguntas de acceso, servicios, calendario, historial local y envío por correo.
* `README.md`: documentación y registro de versiones.

---

# Cómo subirla a Vercel con GitHub

1. Crea o usa el repositorio de GitHub, por ejemplo `weblaura`.
2. Sube estos archivos al repositorio:

   * `index.html`
   * `style.css`
   * `script.js`
   * `README.md`
3. En Vercel: `Add New` → `Project` → importa el repositorio.
4. Framework preset: `Other` o sin framework.
5. Build command: vacío.
6. Output directory: vacío o `.`.
7. Deploy.

Vercel dará una URL pública tipo:

```text
https://weblaura.vercel.app
```

---

# Cómo recibir las propuestas por correo

La web envía las propuestas mediante Formspree.

La configuración está en `script.js`:

```javascript
const CONFIG = {
  formspreeEndpoint: "https://formspree.io/f/xjgddbjw",
  emailDestino: "javiermontorogranados@gmail.com"
};
```

Cuando Laura envía una propuesta, Javi recibe un correo con los datos del plan.

---

# Importante sobre el calendario

El calendario y el historial son locales.

Esto significa que:

* Si Laura hace una propuesta desde su móvil, se guarda en su móvil.
* A Javi le llega igualmente por correo.
* No hay base de datos externa.
* No hay Supabase.
* No hay panel de administración.
* La web sigue siendo gratuita y sencilla.

---

# Respuestas de acceso

La web muestra 2 preguntas aleatorias de la lista disponible.

## Pregunta 1

```text
¿Cómo le gusta que le llamen al mejor novio del mundo?
```

Respuesta válida:

```text
javi
```

Acepta cualquier respuesta que contenga `javi`, da igual mayúsculas o minúsculas.

---

## Pregunta 2

```text
¿Cuándo empezaste a tener el privilegio de tener al mejor novio del mundo?
```

Respuesta válida:

```text
24/04/2026
```

Se responde mediante calendario.

---

## Pregunta 3

```text
¿Cómo se llaman los perros de Javier?
```

Respuestas válidas:

```text
Randy y Nala
Nala y Randy
```

Acepta mayúsculas y minúsculas.

---

## Pregunta 4

```text
¿Cuál fue el sitio donde cenamos antes de que te pidiese salir?
```

Respuesta válida:

```text
Distrito Burger
```

Acepta mayúsculas y minúsculas.

---

# Servicios incluidos

Actualmente la web incluye estos servicios:

* Sushi Date
* Masaje
* Telenovio
* Peli & Sofá
* Café y Charla
* Plan Sorpresa
* Paseo / Recogida

---

# Funcionamiento actual

1. Laura entra en la URL pública de Vercel.
2. Responde correctamente 2 preguntas aleatorias.
3. Accede a JaviEats.
4. Elige un servicio.
5. Selecciona fecha, hora, duración y nivel de ganas.
6. Puede añadir una nota opcional.
7. Envía la propuesta.
8. La propuesta llega al correo de Javi.
9. La propuesta queda guardada en el historial local y en el calendario del dispositivo.
