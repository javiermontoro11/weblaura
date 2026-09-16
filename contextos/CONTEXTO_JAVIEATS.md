# CONTEXTO MAESTRO — JAVIEATS 3.3.1

> **Ámbito:** contexto funcional y técnico general de JaviEats.
>
> Para Supabase/base de datos usar `contextos/CONTEXTO_BASE_DATOS.md`.
>
> Para Nuestra Vida usar `contextos/CONTEXTO_NUESTRA_VIDA.md`.
>
> **Repositorio:** `javiermontoro11/weblaura`
>
> **Rama:** `main`
>
> **Estado de referencia:** 14 de septiembre de 2026 · JaviEats 3.3.1.

---

# PROMPT PARA CONTINUAR EN UN CHAT NUEVO

Quiero que continúes el desarrollo y mantenimiento de **JaviEats 3.3.1** sin empezar de cero.

La prioridad es:

**ESTABILIDAD > CAMBIOS GRANDES**

Antes de modificar código:

1. comprobar siempre `main`;
2. inspeccionar exactamente los archivos actuales;
3. hacer cambios quirúrgicos;
4. no crear archivos auxiliares innecesarios;
5. distinguir código escrito, código subido, despliegue de producción y pruebas reales.

Si un cambio toca Supabase o persistencia, leer y actualizar también `contextos/CONTEXTO_BASE_DATOS.md`.

---

# ARQUITECTURA GENERAL

Proyecto vanilla HTML/CSS/JS, sin build system.

Archivos principales:

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
- `nuestra-vida/`
- `recuerdos/`
- `contextos/`

`main` es la fuente de verdad.

---

# ESTADO FUNCIONAL DE 3.3

JaviEats incluye:

- autenticación persistente con Supabase;
- perfiles Javi y Laura;
- planes/propuestas y calendario compartido;
- Recuerdos;
- notificaciones y Push;
- PWA;
- `¿Y si…?`;
- Piedra, papel o tijera;
- Dibuja;
- No lo Digas;
- puzle/vales;
- integración de Nuestra Vida 1.0.

En 3.3 se añadieron además:

- catálogo ampliado a 10 servicios;
- `☕ Tomar algo`;
- `🍽️ Ir a comer / cenar`;
- exportación `.ics` para planes confirmados;
- mejoras de Inicio/Agenda;
- más contenido para Dibuja y No lo Digas;
- corrección de Dibuja para que el territorio pertenezca a quien adivina antes;
- limpieza y endurecimiento de la lógica de no repetición de `¿Y si…?`.

---

# CAMBIOS DE 3.3.1

3.3.1 es un refinamiento de identidad, jerarquía y recompensa emocional.

## Identidad visual

La app reutiliza el icono real de instalación/PWA como identidad del navegador en lugar de un icono genérico.

Assets relevantes:

- `assets/apple-touch-icon.png`
- `assets/icon-192.png`
- `assets/icon-512.png`

`manifest.webmanifest` y `service-worker.js` se han versionado a `3.3.1` para refrescar iconografía.

## Nuestra Vida

Nuestra Vida pasa a tener más protagonismo en Inicio:

- tarjeta grande;
- estilo oscuro propio;
- posición inmediatamente después de la prioridad principal;
- copy: `Vuestra historia continúa aquí`;
- CTA: `Seguir jugando`.

No cambia el gameplay de Nuestra Vida ni su persistencia. Solo cambia la presentación en JaviEats.

## Compatibilidad JaviEats

La compatibilidad ya no representa todo el histórico completo. Se calcula con las **últimas 20 preguntas completadas por ambos**.

Objetivo: que sea dinámica, comprensible y tenga impacto real sin castigar desacuerdos.

Regla:

- `< 75%` → 1 cambio de pregunta diario compartido;
- `>= 75%` → 2 cambios diarios compartidos;
- no son 2 por persona;
- los cambios no penalizan compatibilidad;
- una pregunta cambiada sigue contando como usada y no vuelve a salir.

La última verificación de Supabase dio:

- compatibilidad últimas 20: **80%**;
- cambios diarios permitidos: **2**;
- 20 respuestas en la muestra;
- 1 cambio usado ese día;
- backend actualizado: `true`;
- no repetición global: `true`.

## Pleno 5/5

Cuando las cinco preguntas del día coinciden:

- se reconoce explícitamente `5 de 5 · ¡PLENO! ❤️`;
- aparece una celebración visual;
- se muestra la compatibilidad actual;
- si está activa la ventaja del 75%, se recuerda que hay 2 cambios diarios compartidos;
- la celebración se marca por dispositivo/día para no repetirse constantemente.

No hay recompensa en Nuestra Vida: esta idea se descartó expresamente.

---

# `¿Y SI…?` — REGLAS IMPORTANTES

- máximo 5 preguntas completadas al día;
- respuestas ocultas hasta que ambos contestan;
- una pregunta presentada no vuelve a salir nunca;
- saltar/cambiar una pregunta también la consume para siempre;
- compatibilidad basada en las últimas 20 completadas;
- 75% o más activa 2 cambios diarios compartidos;
- por debajo de 75% se mantiene 1;
- diferencias de opinión no restan puntos artificialmente: solo alteran de forma natural la ventana móvil.

La BD es la autoridad para el número real de cambios disponibles.

---

# NUESTRA VIDA

Nuestra Vida 1.0 sigue siendo el MASTER integrado.

Puntos importantes:

- acceso mediante `nuestra-vida/index.html`;
- core del juego preservado detrás del wrapper;
- no rediseñar gameplay sin petición expresa;
- viewport prioritario: iPad 11 horizontal `1180 × 820`, luego iPad Mini `1024 × 768`, luego PC;
- el schema interno histórico de guardado sigue siendo compatible con `0.18.29`;
- contexto específico: `contextos/CONTEXTO_NUESTRA_VIDA.md`.

La 3.3.1 solo aumenta su protagonismo visual dentro de JaviEats.

---

# PLANES / SERVICIOS

Catálogo lógico actual: 10 servicios.

Incluye los 8 clásicos más:

- `Tomar algo`;
- `Ir a comer / cenar`.

Los planes confirmados pueden exportarse como `.ics` para Apple Calendar.

No tocar la estructura de `propuestas` sin revisar el contexto de BD.

---

# MINIJUEGOS

## Entre tú y yo

`Entre tú y yo` es un minijuego presencial para Javi y Laura que se juega pasando un único móvil.

- cada partida tiene 12 rondas con orden fijo de mecánicas;
- combina `¿Quién de los dos?`, `Apuesta por mí`, ranking normal y ranking inverso;
- la sincronía final pertenece solo a este juego y no modifica la compatibilidad de `¿Y si…?`;
- la partida activa y las últimas 100 propuestas de cada batería se guardan exclusivamente en `localStorage`;
- no utiliza Supabase ni añade tablas, RPC, políticas o Edge Functions;
- sus 450 propuestas se reparten en 150 preguntas, 150 apuestas y 150 rankings;
- los datos, la lógica y los estilos viven en módulos propios y se cargan desde `minigames.js` antes del core histórico.

Archivos:

- `entre-tu-y-yo-data.js`;
- `entre-tu-y-yo.js`;
- `entre-tu-y-yo.css`.

## Dibuja

Reglas clave:

- 90 segundos;
- pista automática a 45 segundos;
- primero en 3 territorios gana;
- el territorio pertenece a **quien adivina**;
- si ambos adivinan, gana el territorio quien adivina antes;
- si ninguno acierta o hay empate exacto, no hay dueño;
- quien pierde el territorio elige la siguiente categoría.

## No lo Digas

Competitivo, con turnos de 90 segundos y penalización por palabra prohibida.

## Piedra, papel o tijera

Mantiene su flujo diario y su puzle/vale.

---

# FORMA DE TRABAJAR

Reglas permanentes:

1. revisar `main` antes de cualquier write;
2. no inventar que algo está desplegado o probado;
3. no crear archivos auxiliares salvo necesidad real;
4. si se toca un archivo de código y el usuario pide reemplazo, entregar el archivo completo;
5. no romper comportamiento aprobado al arreglar otra cosa;
6. Supabase y frontend deben quedar sincronizados;
7. cualquier cambio de BD debe actualizar `CONTEXTO_BASE_DATOS.md`;
8. responder en español, directo y natural.

---

# ESTADO DE VERIFICACIÓN

A 14/09/2026:

- lógica de Supabase 3.3.1 para compatibilidad/cambios: **aplicada y verificada**;
- no repetición global de `¿Y si…?`: **verificada**;
- código 3.3.1 de refinamiento: **subido a GitHub**;
- producción real: no afirmar hasta comprobar deployment;
- prueba real en navegador/iPad: pendiente salvo comprobación posterior explícita.

---

# RESUMEN

**JaviEats 3.3.1 = JaviEats 3.3 + mejor identidad visual + Nuestra Vida con más protagonismo + compatibilidad móvil de 20 preguntas + ventaja compartida de 2 cambios al 75% + reconocimiento real del pleno 5/5.**
