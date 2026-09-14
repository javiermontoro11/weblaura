# CONTEXTO MAESTRO — JAVIEATS 3.3

> **Ámbito:** contexto funcional y técnico general de JaviEats.
>
> Para Supabase/base de datos usar `contextos/CONTEXTO_BASE_DATOS.md`.
>
> Para el juego Nuestra Vida usar `contextos/CONTEXTO_NUESTRA_VIDA.md`.
>
> **Repositorio:** `javiermontoro11/weblaura`
>
> **Rama:** `main`
>
> **Estado de referencia:** 14 de septiembre de 2026 · JaviEats 3.3.

---

# PROMPT PARA CONTINUAR EN UN CHAT NUEVO

Quiero que continúes el desarrollo y mantenimiento de mi proyecto privado **JaviEats 3.3** sin empezar de cero.

La prioridad es:

**ESTABILIDAD > CAMBIOS GRANDES**

Antes de modificar código, comprueba el estado real de `main`. No asumas que este documento sustituye al repositorio.

Si un cambio toca base de datos, RPC, RLS, triggers, Storage o persistencia, consulta y actualiza también `contextos/CONTEXTO_BASE_DATOS.md`.

Nuestra Vida mantiene su propio contexto en `contextos/CONTEXTO_NUESTRA_VIDA.md`.

---

# 1. ARQUITECTURA GENERAL

JaviEats es una aplicación web privada para Javi y Laura, construida en HTML/CSS/JavaScript vanilla, sin build system.

Ficheros principales:

- `index.html`
- `script.js`
- `style.css`
- `minigames-data.js`
- `minigames-core.js`
- `minigames.js`
- `nuestra-vida-launcher.js`
- `service-worker.js`
- `manifest.webmanifest`
- `assets/`
- `recuerdos/`
- `nuestra-vida/`
- `contextos/`

Supabase se usa para autenticación, planes, recuerdos, notificaciones, Push, reto diario, puzle/vales y `¿Y si…?`.

---

# 2. ESTADO DE LA 3.3

La 3.3 ya incluye en código:

- nueva capa visual de Inicio;
- tarjeta integrada de Nuestra Vida;
- agenda/próximo plan en Inicio;
- catálogo ampliado a 10 servicios;
- nuevos servicios:
  - `☕ Tomar algo`
  - `🍽️ Ir a comer / cenar`
- exportación `.ics` / Apple Calendar para planes confirmados;
- ampliación de Dibuja;
- ampliación de No lo Digas;
- corrección de la lógica de ganador de Dibuja;
- caché/versionado de minijuegos en 3.3.

Los ficheros que se cambiaron para esta parte fueron:

- `index.html`
- `minigames-core.js`
- `minigames.js`

No asumir que `script.js`, `style.css` o `minigames-data.js` han sido modificados para 3.3 salvo verificación posterior en `main`.

---

# 3. REGLAS DE DIBUJA

Reglas vigentes de la 3.3:

- 90 segundos por intento;
- pista a los 45 segundos;
- primero en 3 territorios gana;
- el territorio es para **quien adivina**, no para quien dibuja;
- si solo uno acierta, gana ese adivinador;
- si ambos aciertan, gana quien adivinó más rápido;
- si ninguno acierta o hay empate exacto, no hay propietario;
- el perdedor del territorio elige la siguiente categoría.

La batería se amplió editorialmente sin crear nuevas tablas de Supabase.

---

# 4. NO LO DIGAS

Mantiene la mecánica existente y se amplió la batería de cartas.

Reglas base:

- turnos de 90 segundos;
- 45 segundos la primera vez que aparece una carta;
- 30 segundos en repeticiones;
- penalización de 5 segundos por palabra prohibida;
- puntos para quien adivina.

---

# 5. PLANES Y CALENDARIO

JaviEats maneja propuestas/planes compartidos mediante Supabase.

Servicios actuales esperados en producto: **10**.

Los dos añadidos en 3.3 son:

- `Tomar algo`
- `Ir a comer / cenar`

Los planes confirmados pueden exportarse a un `.ics` compatible con Apple Calendar.

La exportación no sustituye el calendario interno de JaviEats.

---

# 6. `¿Y SI…?` — ESTADO FUNCIONAL 3.3

La regla de producto ya implementada es:

> **Una pregunta presentada una vez no vuelve a salir nunca.**

Estado verificado en Supabase al cerrar la 3.3:

- 450 preguntas totales;
- 431 activas;
- 19 inactivas por redundancia semántica;
- 60 preguntas históricas;
- las 60 históricas son distintas;
- 0 duplicados históricos;
- 0 preguntas abiertas en la verificación final;
- 374 preguntas activas todavía disponibles;
- protección global `UNIQUE (pregunta_id)` en `y_si_dias`;
- `obtener_y_si_actual()` usa historial global;
- no recicla temporadas.

El detalle exacto de índices, RPC y preguntas inactivas está en `contextos/CONTEXTO_BASE_DATOS.md`.

No volver a ejecutar las migraciones SQL provisionales usadas durante el desarrollo de esta regla.

---

# 7. NUESTRA VIDA

Nuestra Vida sigue siendo un proyecto/juego separado dentro del mismo repositorio.

La integración con JaviEats se mantiene mediante:

- `nuestra-vida-launcher.js`
- `/nuestra-vida/`

La lógica específica del juego, su release y su persistencia se documentan en `contextos/CONTEXTO_NUESTRA_VIDA.md`.

No rediseñar Nuestra Vida desde el contexto de JaviEats salvo que se pida expresamente.

---

# 8. RECUERDOS

JaviEats mantiene recuerdos privados mediante Supabase y Storage.

Para 3.3 la intención es mejorar presentación sin introducir una función tipo “Tal día como hoy” mientras no tenga sentido por antigüedad del contenido.

No cambiar Storage ni contratos de datos si el objetivo es solo visual.

---

# 9. FORMA DE TRABAJAR

Reglas permanentes:

1. `main` es la fuente de verdad.
2. Antes de escribir en GitHub, inspeccionar el estado actual.
3. Cambios pequeños y quirúrgicos.
4. No crear ficheros auxiliares innecesarios.
5. Si se toca un archivo de código y se entrega al usuario, preferir el archivo completo.
6. No afirmar que algo está probado si solo se revisó estáticamente.
7. Distinguir siempre entre:
   - código escrito;
   - código subido a GitHub;
   - despliegue de producción;
   - prueba real en navegador;
   - prueba real en iPad.
8. Si hay cambios de BD, actualizar `contextos/CONTEXTO_BASE_DATOS.md` en el mismo trabajo.
9. Si cambia funcionalidad general de JaviEats, actualizar este archivo.
10. Responder en español, de forma directa y técnica.

---

# 10. VERSIONADO Y ESTADO DE CIERRE

Producto actual:

**JaviEats 3.3**

Nuestra Vida mantiene versionado independiente.

La parte de Supabase de `¿Y si…?` está cerrada y verificada para 3.3 con la regla de no repetición global.

Todavía hay que distinguir eso de una prueba real completa de producción: que GitHub y Supabase estén correctos no implica por sí solo que Vercel/PWA/iPad hayan sido probados visualmente después de todos los cambios.

---

# 11. PRIMERA COMPROBACIÓN EN UN CHAT NUEVO

Antes de hacer cambios, confirmar:

- que JaviEats está en 3.3;
- que `main` es la fuente de verdad;
- que los contextos están separados en tres archivos;
- que la BD tiene contexto propio;
- que `¿Y si…?` no repite preguntas ya presentadas;
- que Nuestra Vida mantiene contexto independiente;
- y que cualquier modificación nueva debe ser incremental.

Después, inspeccionar GitHub real si la tarea depende del estado actual del código.
