# Nuestra galería Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir una galería privada compartida dentro de Recuerdos, con cuadrícula responsive, subida múltiple, fecha, descripción, visor, descarga, edición y borrado, reutilizando la compresión y Storage existentes.

**Architecture:** `app/js/gallery.js` encapsula toda la lógica de la galería y consume `window.JaviEatsMemories.compressImage` y `window.JaviEatsApp.getClient()`. Los metadatos viven en `public.galeria_app`; los binarios se guardan en el bucket privado `recuerdos` bajo `gallery/`. La vista se carga en bloques de 24 fotos y solo firma las URLs del bloque cargado.

**Tech Stack:** HTML/CSS/JavaScript vanilla, Supabase Postgres + RLS, Supabase Storage privado, Node test runner para helpers.

**Spec:** `docs/superpowers/specs/2026-09-25-nuestra-galeria-design.md`

## Global Constraints

- Mantener `main` intacto; trabajar sobre `feature/nuestro-24`.
- Reutilizar el bucket privado `recuerdos`; no crear buckets adicionales.
- Reutilizar la compresión de Recuerdos: máximo 1600 px y objetivo aproximado de 700 KB.
- Cargar 24 fotos por bloque.
- Máximo 10 imágenes por operación de subida.
- Grid: 6 columnas en escritorio, 3–4 en tablet, 2 en móvil.
- No añadir álbumes, favoritos, comentarios, etiquetas, búsqueda ni miniaturas persistidas.
- Un fallo de Galería no debe romper Recuerdos ni el resto de JaviEats.

## Review Focus

- Selección de más de 10 fotos: rechazar el exceso con mensaje claro sin subir nada.
- Fallo de base de datos después de subir objetos: limpiar los objetos recién subidos para evitar huérfanos.
- URL firmada caducada: volver a firmar al recargar el bloque, sin duplicar filas.
- Eliminación: borrar metadato y objeto y actualizar grid/visor sin recarga completa.
- Móvil: 2 columnas, visor usable y swipe sin bloquear el scroll vertical.

---

### Task 1: Corregir el recorte del último recuerdo de Inicio

**Files:**
- Modify: `app/css/ui.css`
- Modify: `index.html`
- Test: `tests/home-memory-framing.test.cjs`

**Interfaces:**
- Consumes: `--memory-image` ya inyectada por `app/js/ui.js`.
- Produces: tarjeta de Inicio que conserva la foto completa en primer plano y rellena el ancho sin volver a cortar una de las caras.

- [ ] **Step 1: Write the failing test**

El test debe exigir que `.v3-memory-hero.has-image` use dos capas de la misma imagen: una capa `contain` para mostrar la foto completa y una capa `cover` para rellenar el fondo.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/home-memory-framing.test.cjs`  
Expected: FAIL porque la regla actual solo usa `cover`.

- [ ] **Step 3: Implement minimal CSS**

Usar pseudo-elementos/layers para que la foto completa quede visible centrada y el fondo cubra el resto del hero. Mantener el sombreado y el texto por encima.

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/home-memory-framing.test.cjs`  
Expected: PASS.

### Task 2: Crear persistencia privada de Galería

**Files:**
- Create: `supabase/migrations/20260925_01_gallery.sql`

**Interfaces:**
- Produces: tabla `public.galeria_app` con columnas `id, created_by, fecha, descripcion, image_path, created_at, updated_at`.

- [ ] **Step 1: Crear SQL con RLS**

Crear tabla, índice por `fecha desc, created_at desc`, activar RLS y políticas limitadas a las dos cuentas de JaviEats. Restringir UPDATE a `fecha, descripcion, updated_at`.

- [ ] **Step 2: Ejecutar SQL en el proyecto conectado**

Run mediante Supabase MCP `execute_sql`.

- [ ] **Step 3: Verificar**

Consultar esquema, RLS, políticas e índice; ejecutar advisors y revisar que no se introducen errores nuevos.

### Task 3: Implementar módulo de Galería

**Files:**
- Create: `app/js/gallery.js`
- Test: `tests/gallery.test.cjs`

**Interfaces:**
- Consumes: `window.JaviEatsApp.getClient()`, `window.JaviEatsApp.getRole()`, `window.JaviEatsMemories.compressImage(file)`.
- Produces: `window.JaviEatsGallery.bindUI()`, `reset()`, `refresh({reset})`, `show(mode)`.

- [ ] **Step 1: Escribir tests de helpers**

Probar paginación, normalización de filas, límite de archivos y wrapping del índice del visor.

- [ ] **Step 2: Ejecutar y comprobar RED**

Run: `node --test tests/gallery.test.cjs`.

- [ ] **Step 3: Implementar helpers y módulo**

Implementar fetch por bloques de 24, caché de signed URLs, render, subida múltiple, edición, borrado, descarga, visor y swipe.

- [ ] **Step 4: Ejecutar tests y comprobar GREEN**

Run: `node --test tests/gallery.test.cjs`.

### Task 4: Integrar la interfaz dentro de Recuerdos

**Files:**
- Create: `app/css/gallery.css`
- Modify: `index.html`
- Modify: `script.js`
- Test: `tests/gallery-markup.test.cjs`

**Interfaces:**
- Consumes: módulo de Task 3.
- Produces: selector `Nuestros recuerdos | Nuestra galería`, grid, botones de subida/cargar más, visor y editor.

- [ ] **Step 1: Escribir test de estructura**

El test debe comprobar IDs de tabs, grid, botón subir, cargar más, viewer/editor y carga de `gallery.js/gallery.css`.

- [ ] **Step 2: Ejecutar y comprobar RED**

Run: `node --test tests/gallery-markup.test.cjs`.

- [ ] **Step 3: Integrar HTML/CSS/JS**

Añadir el selector y vistas sin romper los IDs que usa `memories.js`. Registrar `galleryModule().bindUI()` en `init()`, `reset()` al cerrar sesión y refrescar al entrar en Recuerdos cuando la pestaña Galería esté activa.

- [ ] **Step 4: Ejecutar tests y comprobar GREEN**

Run: `node --test tests/gallery-markup.test.cjs tests/gallery.test.cjs tests/home-memory-framing.test.cjs`.

### Task 5: Documentación y verificación final

**Files:**
- Modify: `README.md`
- Modify: `contextos/CONTEXTO_JAVIEATS.md`

- [ ] **Step 1: Actualizar documentación**

Documentar Galería, coste contenido de Supabase y nueva estructura.

- [ ] **Step 2: Ejecutar suite completa disponible**

Run: `node --test tests/*.test.cjs tests/*.test.js`.

- [ ] **Step 3: Verificar rama y diff**

Confirmar que solo `feature/nuestro-24` cambió, revisar el commit y comprobar esquema/policies de Supabase.
