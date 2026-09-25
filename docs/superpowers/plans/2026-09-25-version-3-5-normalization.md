> **SUPERSEDED (25/09/2026):** este plan fijó provisionalmente JaviEats 3.5/3.5.3. La numeración canónica se regularizó después a **JaviEats 3.4 / mantenimiento 3.4.13**. Mapeo: 3.5.0→3.4.10, 3.5.1→3.4.11, 3.5.2→3.4.12, 3.5.3→3.4.13. Se conserva este archivo únicamente como historial de la decisión anterior.

# JaviEats 3.5 Version Normalization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unificar la documentación de producción para que JaviEats figure como producto 3.5 estable y mantenimiento actual 3.5.3.

**Architecture:** No cambia código de producto ni Supabase. Se corrigen únicamente las fuentes de contexto y documentación que describen el estado actual, conservando el historial 3.4.x y 3.5.x.

**Tech Stack:** Markdown / GitHub.

**Spec:** Conversación de cierre de JaviEats 3.5.

## Global Constraints

- `main` es la fuente de verdad en producción.
- Versión de producto: **3.5 — ESTABLE**.
- Mantenimiento actual: **3.5.3**.
- Nuestro 24 3.4.x queda como historial ya integrado, no como preview activa.
- No cambiar query strings de assets ni código funcional por un ajuste puramente documental.

## Review Focus

- No convertir referencias históricas 3.3.x/3.4.x en 3.5 por error.
- El README no debe afirmar que 3.3.7 sigue siendo el estado actual.
- El contexto maestro no debe afirmar que `feature/nuestro-24` sigue siendo la rama de trabajo activa.
- La descripción de la galería debe reflejar selector 3/5/10, no el grid antiguo 6/4/2.
- README y contexto maestro deben coincidir en versión y estado de producción.

---

### Task 1: Normalizar versión y estado documental

**Files:**
- Modify: `README.md`
- Modify: `contextos/CONTEXTO_JAVIEATS.md`

**Interfaces:**
- Consumes: estado real de `main` tras PR #8.
- Produces: documentación coherente para continuar mantenimiento desde JaviEats 3.5.

- [ ] **Step 1:** Actualizar cabeceras de versión y estado actual.
- [ ] **Step 2:** Corregir referencias actuales obsoletas a 3.3.7, preview y rama feature.
- [ ] **Step 3:** Corregir la descripción actual de columnas de la galería.
- [ ] **Step 4:** Añadir una entrada de historial 3.5.3 que consolide el release.
- [ ] **Step 5:** Verificar por lectura directa que README y contexto maestro coinciden.
