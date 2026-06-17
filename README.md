# Web de reservas VIP con Javi

Web estática lista para subir a Vercel.

## Archivos

- `index.html`: estructura de la página.
- `style.css`: diseño visual.
- `script.js`: preguntas de acceso, servicios y reservas.

## Cómo subirla a Vercel con GitHub

1. Crea un repositorio en GitHub, por ejemplo `masajes-javi-web`.
2. Sube estos 3 archivos al repositorio.
3. En Vercel: `Add New` → `Project` → importa el repositorio.
4. Framework preset: `Other` o sin framework.
5. Build command: vacío.
6. Output directory: vacío o `.`.
7. Deploy.

Vercel te dará una URL pública tipo:

`https://masajes-javi-web.vercel.app`

## Cómo recibir las reservas por correo

La web ya guarda las reservas en el navegador del dispositivo, pero para recibirlas por email tienes dos opciones.

### Opción A: Formspree, recomendada

1. Entra en https://formspree.io/
2. Crea una cuenta gratuita.
3. Crea un formulario nuevo.
4. Copia el endpoint, algo tipo:

`https://formspree.io/f/abcdwxyz`

5. Abre `script.js` y cambia esta línea:

```js
formspreeEndpoint: "",
```

por:

```js
formspreeEndpoint: "https://formspree.io/f/abcdwxyz",
```

6. Sube el cambio a GitHub y Vercel actualizará la web.

### Opción B: mailto

Abre `script.js` y cambia:

```js
emailDestino: "TU_CORREO_AQUI@gmail.com"
```

por tu correo real.

Esta opción abre el correo del móvil/PC con el mensaje preparado, pero la persona tiene que pulsar enviar.

## Respuestas de acceso

Primera pregunta: acepta cualquier respuesta que contenga `javi`, da igual mayúsculas o minúsculas.

Segunda pregunta: aparece como calendario. La fecha correcta es `24/04/2026`.
