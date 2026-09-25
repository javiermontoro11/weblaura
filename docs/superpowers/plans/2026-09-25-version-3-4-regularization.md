# JaviEats 3.4 Version Regularization

**Fecha:** 25/09/2026

**Estado canónico:** JaviEats **3.4 — ESTABLE**, mantenimiento **3.4.13**.

## Motivo

La línea 3.4 ya existía como desarrollo de Nuestro 24 y llegó hasta 3.4.9, pero no se consolidó una versión independiente entre esa serie y la galería. Para no dejar un salto artificial a 3.5, la serie de Nuestra galería se renumera de forma continua:

- 3.5.0 → **3.4.10** — incorporación inicial de Nuestra galería.
- 3.5.1 → **3.4.11** — primer ajuste de encuadre/grid/limpieza.
- 3.5.2 → **3.4.12** — restauración del diseño de tarjetas y encuadre sin recortes.
- 3.5.3 → **3.4.13** — selector 3/5/10 fotos por fila y cierre de producción.

## Fuentes de verdad

- `README.md`: versión, historial y estado de producto.
- `contextos/CONTEXTO_JAVIEATS.md`: contexto funcional/técnico completo para continuidad con otro modelo o IA.
- `contextos/CONTEXTO_BASE_DATOS.md`: estado real de Supabase, Storage, RLS, RPC y migraciones.
- `main`: rama de producción.

No se modifica el esquema de Supabase por esta regularización; únicamente se corrige la nomenclatura y el estado documental.
