(() => {
  "use strict";

  const STORAGE_KEY = "javieats:gallery-columns";
  const ALLOWED_COLUMNS = Object.freeze([3, 5, 10]);
  const DEFAULT_COLUMNS = 5;

  function normalizeColumns(value) {
    const parsed = Number(value);
    return ALLOWED_COLUMNS.includes(parsed) ? parsed : DEFAULT_COLUMNS;
  }

  function readColumns(storage) {
    try {
      return normalizeColumns(storage?.getItem?.(STORAGE_KEY));
    } catch {
      return DEFAULT_COLUMNS;
    }
  }

  function writeColumns(value, storage) {
    const normalized = normalizeColumns(value);
    try { storage?.setItem?.(STORAGE_KEY, String(normalized)); } catch {}
    return normalized;
  }

  function applyColumns(value, root) {
    const normalized = normalizeColumns(value);
    root?.style?.setProperty?.("--gallery-columns", String(normalized));
    return normalized;
  }

  function syncButtons(value, scope) {
    const normalized = normalizeColumns(value);
    scope?.querySelectorAll?.("[data-gallery-columns]")?.forEach?.(button => {
      const active = Number(button.dataset.galleryColumns) === normalized;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function bindUI({ storage = globalThis.localStorage, scope = globalThis.document } = {}) {
    const grid = scope?.getElementById?.("gallery-grid");
    if (!grid) return DEFAULT_COLUMNS;
    let current = readColumns(storage);
    applyColumns(current, grid);
    syncButtons(current, scope);
    scope.querySelectorAll?.("[data-gallery-columns]")?.forEach?.(button => {
      button.addEventListener("click", () => {
        current = writeColumns(button.dataset.galleryColumns, storage);
        applyColumns(current, grid);
        syncButtons(current, scope);
      });
    });
    return current;
  }

  const api = { STORAGE_KEY, ALLOWED_COLUMNS, DEFAULT_COLUMNS, normalizeColumns, readColumns, writeColumns, applyColumns, bindUI };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.JaviEatsGalleryLayout = Object.freeze(api);
})();