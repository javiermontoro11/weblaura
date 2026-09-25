(() => {
  "use strict";

  const STORAGE_BUCKET = "recuerdos";
  const PAGE_SIZE = 24;
  const MAX_UPLOAD_FILES = 10;
  const SIGNED_URL_SECONDS = 60 * 60;
  const SIGNED_URL_REFRESH_MARGIN_MS = 5 * 60 * 1000;

  const $ = id => typeof document === "undefined" ? null : document.getElementById(id);
  const app = () => typeof window === "undefined" ? null : window.JaviEatsApp;

  const signedUrlCache = new Map();
  let rows = [];
  let offset = 0;
  let hasMore = true;
  let loading = false;
  let loadedOnce = false;
  let activeMode = "memories";
  let viewerIndex = 0;
  let selectedFiles = [];
  let editorBusy = false;
  let editingId = null;
  let touchStartX = 0;
  let bound = false;

  function pageRange(offsetValue = 0, size = PAGE_SIZE) {
    const from = Math.max(0, Number(offsetValue) || 0);
    const safeSize = Math.max(1, Number(size) || PAGE_SIZE);
    return { from, to: from + safeSize - 1 };
  }

  function clampFiles(files, max = MAX_UPLOAD_FILES) {
    const list = Array.from(files || []);
    if (list.length > max) return { ok: false, files: [] };
    return { ok: true, files: list };
  }

  function wrapIndex(index, length) {
    const safeLength = Math.max(0, Number(length) || 0);
    if (!safeLength) return 0;
    return ((Number(index) || 0) % safeLength + safeLength) % safeLength;
  }

  function normalizeRow(row = {}) {
    return {
      id: String(row.id || ""),
      fecha: String(row.fecha || ""),
      descripcion: String(row.descripcion || ""),
      image_path: String(row.image_path || ""),
      created_at: String(row.created_at || ""),
      updated_at: String(row.updated_at || ""),
      signedUrl: String(row.signedUrl || "")
    };
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[char]);
  }

  function madridDateKey(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(date);
    const value = type => parts.find(part => part.type === type)?.value || "";
    return `${value("year")}-${value("month")}-${value("day")}`;
  }

  function formatDate(dateKey) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateKey || ""))) return String(dateKey || "");
    return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })
      .format(new Date(`${dateKey}T12:00:00`));
  }

  function canManage() {
    const role = app()?.getRole?.();
    return role === "javi" || role === "laura";
  }

  async function ensureSignedUrls(client, items) {
    const now = Date.now();
    const paths = [...new Set(items.map(item => item.image_path).filter(Boolean))];
    const missing = paths.filter(path => {
      const cached = signedUrlCache.get(path);
      return !cached || cached.expiresAt - now <= SIGNED_URL_REFRESH_MARGIN_MS;
    });
    if (missing.length) {
      const { data, error } = await client.storage.from(STORAGE_BUCKET).createSignedUrls(missing, SIGNED_URL_SECONDS);
      if (error) throw error;
      (data || []).forEach((item, index) => {
        const path = item?.path || missing[index];
        if (!path || !item?.signedUrl) return;
        signedUrlCache.set(path, { url: item.signedUrl, expiresAt: now + SIGNED_URL_SECONDS * 1000 });
      });
    }
    items.forEach(item => { item.signedUrl = signedUrlCache.get(item.image_path)?.url || ""; });
  }

  function setStatus(message = "", type = "") {
    const el = $("gallery-status");
    if (!el) return;
    el.textContent = message;
    el.classList.toggle("is-error", type === "error");
    el.classList.toggle("is-ok", type === "ok");
  }

  function renderGrid() {
    const grid = $("gallery-grid");
    const empty = $("gallery-empty");
    const loadMore = $("gallery-load-more");
    if (!grid) return;

    grid.innerHTML = rows.map((item, index) => `
      <button class="couple-gallery-card" type="button" data-gallery-open="${index}" aria-label="Abrir foto del ${escapeHtml(formatDate(item.fecha))}">
        <span class="couple-gallery-photo-wrap"><img src="${escapeHtml(item.signedUrl)}" alt="${escapeHtml(item.descripcion || `Foto del ${formatDate(item.fecha)}`)}" loading="lazy" decoding="async" /></span>
        <span class="couple-gallery-meta"><small>${escapeHtml(formatDate(item.fecha))}</small><strong>${escapeHtml(item.descripcion || "Nuestro momento")}</strong></span>
      </button>`).join("");

    empty?.classList.toggle("hidden", rows.length > 0 || loading);
    loadMore?.classList.toggle("hidden", !hasMore || !rows.length);
    if (loadMore) loadMore.disabled = loading;
  }

  async function refresh({ reset = false } = {}) {
    if (loading) return;
    const client = app()?.getClient?.();
    if (!client) return;
    if (reset) {
      rows = [];
      offset = 0;
      hasMore = true;
      renderGrid();
    }
    if (!hasMore) return;

    loading = true;
    setStatus(reset ? "Cargando vuestra galería…" : "Cargando más fotos…");
    try {
      const range = pageRange(offset, PAGE_SIZE);
      const { data, error } = await client
        .from("galeria_app")
        .select("id,fecha,descripcion,image_path,created_at,updated_at")
        .order("fecha", { ascending: false })
        .order("created_at", { ascending: false })
        .range(range.from, range.to);
      if (error) throw error;
      const batch = (Array.isArray(data) ? data : []).map(normalizeRow);
      await ensureSignedUrls(client, batch);
      rows = reset ? batch : [...rows, ...batch.filter(item => !rows.some(existing => existing.id === item.id))];
      offset = rows.length;
      hasMore = batch.length === PAGE_SIZE;
      loadedOnce = true;
      setStatus("");
      renderGrid();
    } catch (error) {
      console.error("Error cargando Nuestra galería:", error);
      setStatus("No se ha podido cargar la galería. Revisa la conexión e inténtalo de nuevo.", "error");
    } finally {
      loading = false;
      renderGrid();
    }
  }

  function show(mode = "memories") {
    activeMode = mode === "gallery" ? "gallery" : "memories";
    const memoriesView = $("memories-view");
    const galleryView = $("couple-gallery-view");
    memoriesView?.classList.toggle("hidden", activeMode !== "memories");
    galleryView?.classList.toggle("hidden", activeMode !== "gallery");
    document.querySelectorAll("[data-memory-mode]").forEach(button => {
      const active = button.dataset.memoryMode === activeMode;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });
    const addMemory = $("add-memory-btn");
    if (addMemory) addMemory.classList.toggle("hidden", activeMode === "gallery" || !canManage());
    if (activeMode === "gallery" && !loadedOnce) void refresh({ reset: true });
  }

  function isGalleryActive() {
    return activeMode === "gallery";
  }

  function openViewer(index) {
    if (!rows.length) return;
    viewerIndex = wrapIndex(index, rows.length);
    renderViewer();
    $("couple-gallery-modal")?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeViewer() {
    $("couple-gallery-modal")?.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function changeViewer(delta) {
    if (!rows.length) return;
    viewerIndex = wrapIndex(viewerIndex + delta, rows.length);
    renderViewer();
  }

  function renderViewer() {
    const item = rows[viewerIndex];
    if (!item) return;
    const image = $("couple-gallery-viewer-image");
    if (image) {
      image.src = item.signedUrl;
      image.alt = item.descripcion || `Foto del ${formatDate(item.fecha)}`;
    }
    if ($("couple-gallery-viewer-date")) $("couple-gallery-viewer-date").textContent = formatDate(item.fecha);
    if ($("couple-gallery-viewer-description")) $("couple-gallery-viewer-description").textContent = item.descripcion || "Nuestro momento";
    if ($("couple-gallery-viewer-counter")) $("couple-gallery-viewer-counter").textContent = `${viewerIndex + 1} de ${rows.length}`;
    $("couple-gallery-prev")?.classList.toggle("hidden", rows.length <= 1);
    $("couple-gallery-next")?.classList.toggle("hidden", rows.length <= 1);
  }

  function resetEditor() {
    selectedFiles.forEach(item => item.previewUrl && URL.revokeObjectURL(item.previewUrl));
    selectedFiles = [];
    editingId = null;
    const input = $("couple-gallery-photo-input");
    if (input) input.value = "";
    const previews = $("couple-gallery-upload-previews");
    if (previews) previews.innerHTML = "";
  }

  function renderPreviews() {
    const holder = $("couple-gallery-upload-previews");
    if (!holder) return;
    holder.innerHTML = selectedFiles.map((item, index) => `
      <div class="couple-gallery-upload-preview"><img src="${item.previewUrl}" alt="Foto ${index + 1}"/><button type="button" data-gallery-remove-file="${item.id}" aria-label="Quitar foto">×</button></div>`).join("");
  }

  function openUploader() {
    if (!canManage()) return;
    resetEditor();
    editingId = null;
    if ($("couple-gallery-editor-title")) $("couple-gallery-editor-title").textContent = "Subir fotos";
    if ($("couple-gallery-editor-date")) $("couple-gallery-editor-date").value = madridDateKey();
    if ($("couple-gallery-editor-description")) $("couple-gallery-editor-description").value = "";
    $("couple-gallery-photo-section")?.classList.remove("hidden");
    if ($("couple-gallery-save-btn")) $("couple-gallery-save-btn").textContent = "Guardar fotos";
    $("couple-gallery-editor-modal")?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function openEditorForCurrent() {
    const item = rows[viewerIndex];
    if (!item || !canManage()) return;
    resetEditor();
    editingId = item.id;
    if ($("couple-gallery-editor-title")) $("couple-gallery-editor-title").textContent = "Editar foto";
    if ($("couple-gallery-editor-date")) $("couple-gallery-editor-date").value = item.fecha;
    if ($("couple-gallery-editor-description")) $("couple-gallery-editor-description").value = item.descripcion || "";
    $("couple-gallery-photo-section")?.classList.add("hidden");
    if ($("couple-gallery-save-btn")) $("couple-gallery-save-btn").textContent = "Guardar cambios";
    $("couple-gallery-editor-modal")?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeEditor(force = false) {
    if (editorBusy && !force) return;
    $("couple-gallery-editor-modal")?.classList.add("hidden");
    document.body.style.overflow = $("couple-gallery-modal")?.classList.contains("hidden") ? "" : "hidden";
    resetEditor();
  }

  function handleFileSelection(event) {
    const result = clampFiles(event.target.files, MAX_UPLOAD_FILES);
    if (!result.ok) {
      event.target.value = "";
      app()?.showToast?.(`Puedes subir un máximo de ${MAX_UPLOAD_FILES} fotos cada vez.`);
      return;
    }
    selectedFiles.forEach(item => item.previewUrl && URL.revokeObjectURL(item.previewUrl));
    selectedFiles = result.files.map(file => ({ id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file) }));
    renderPreviews();
  }

  async function saveEditor(event) {
    event.preventDefault();
    if (editorBusy || !canManage()) return;
    const client = app()?.getClient?.();
    if (!client) return;
    const fecha = $("couple-gallery-editor-date")?.value || "";
    const descripcion = $("couple-gallery-editor-description")?.value?.trim() || "";
    if (!fecha) return app()?.showToast?.("Añade una fecha.");

    editorBusy = true;
    const saveButton = $("couple-gallery-save-btn");
    if (saveButton) saveButton.disabled = true;
    const uploadedPaths = [];
    let persisted = false;
    try {
      if (editingId) {
        const { error } = await client.from("galeria_app").update({ fecha, descripcion, updated_at: new Date().toISOString() }).eq("id", editingId);
        if (error) throw error;
        const item = rows.find(row => row.id === editingId);
        if (item) { item.fecha = fecha; item.descripcion = descripcion; item.updated_at = new Date().toISOString(); }
        renderGrid();
        renderViewer();
        closeEditor(true);
        app()?.showToast?.("Foto actualizada ❤️");
        return;
      }

      if (!selectedFiles.length) return app()?.showToast?.("Selecciona al menos una foto.");
      const inserts = [];
      for (let i = 0; i < selectedFiles.length; i += 1) {
        const current = selectedFiles[i];
        if (saveButton) saveButton.textContent = `Subiendo ${i + 1} de ${selectedFiles.length}…`;
        const optimized = await window.JaviEatsMemories.compressImage(current.file);
        const extension = optimized.type === "image/jpeg" ? "jpg" : "webp";
        const path = `gallery/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await client.storage.from(STORAGE_BUCKET).upload(path, optimized, {
          cacheControl: "31536000", contentType: optimized.type, upsert: false
        });
        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
        inserts.push({ fecha, descripcion, image_path: path });
      }
      const { error: insertError } = await client.from("galeria_app").insert(inserts);
      if (insertError) throw insertError;
      persisted = true;
      const count = selectedFiles.length;
      closeEditor(true);
      await refresh({ reset: true });
      app()?.showToast?.(count === 1 ? "Foto guardada ❤️" : "Fotos guardadas ❤️");
    } catch (error) {
      console.error("Error guardando Nuestra galería:", error);
      if (!persisted && uploadedPaths.length) {
        try { await client.storage.from(STORAGE_BUCKET).remove(uploadedPaths); }
        catch (cleanupError) { console.warn("No se pudieron limpiar archivos de una subida fallida:", cleanupError); }
      }
      app()?.showToast?.("No se han podido guardar las fotos. Revisa la conexión.");
    } finally {
      editorBusy = false;
      if (saveButton) { saveButton.disabled = false; saveButton.textContent = editingId ? "Guardar cambios" : "Guardar fotos"; }
    }
  }

  async function deleteCurrent() {
    const item = rows[viewerIndex];
    const client = app()?.getClient?.();
    if (!item || !client || !canManage()) return;
    if (!confirm("¿Eliminar esta foto de Nuestra galería? Esta acción no se puede deshacer.")) return;
    try {
      const { error: rowError } = await client.from("galeria_app").delete().eq("id", item.id);
      if (rowError) throw rowError;
      const { error: storageError } = await client.storage.from(STORAGE_BUCKET).remove([item.image_path]);
      if (storageError) console.warn("La fila se eliminó, pero el archivo no pudo limpiarse:", storageError);
      signedUrlCache.delete(item.image_path);
      rows.splice(viewerIndex, 1);
      if (!rows.length) closeViewer();
      else { viewerIndex = wrapIndex(viewerIndex, rows.length); renderViewer(); }
      renderGrid();
      app()?.showToast?.("Foto eliminada.");
    } catch (error) {
      console.error(error);
      app()?.showToast?.("No se ha podido eliminar la foto.");
    }
  }

  async function downloadCurrent() {
    const item = rows[viewerIndex];
    const client = app()?.getClient?.();
    if (!item || !client) return;
    try {
      const { data, error } = await client.storage.from(STORAGE_BUCKET).download(item.image_path);
      if (error) throw error;
      const url = URL.createObjectURL(data);
      const anchor = document.createElement("a");
      anchor.href = url;
      const ext = item.image_path.split(".").pop() || "webp";
      anchor.download = `JaviEats-${item.fecha || "foto"}.${ext}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error(error);
      app()?.showToast?.("No se ha podido descargar la foto.");
    }
  }

  function bindUI() {
    if (bound || typeof document === "undefined") return;
    bound = true;
    document.querySelectorAll("[data-memory-mode]").forEach(button => {
      button.addEventListener("click", () => show(button.dataset.memoryMode));
    });
    $("gallery-upload-btn")?.addEventListener("click", openUploader);
    $("gallery-load-more")?.addEventListener("click", () => refresh({ reset: false }));
    $("gallery-grid")?.addEventListener("click", event => {
      const card = event.target.closest("[data-gallery-open]");
      if (card) openViewer(Number(card.dataset.galleryOpen));
    });
    document.querySelectorAll("[data-couple-gallery-close]").forEach(el => el.addEventListener("click", closeViewer));
    $("couple-gallery-prev")?.addEventListener("click", () => changeViewer(-1));
    $("couple-gallery-next")?.addEventListener("click", () => changeViewer(1));
    $("couple-gallery-download")?.addEventListener("click", downloadCurrent);
    $("couple-gallery-edit")?.addEventListener("click", openEditorForCurrent);
    $("couple-gallery-delete")?.addEventListener("click", deleteCurrent);
    $("couple-gallery-photo-picker")?.addEventListener("click", () => $("couple-gallery-photo-input")?.click());
    $("couple-gallery-photo-input")?.addEventListener("change", handleFileSelection);
    $("couple-gallery-upload-previews")?.addEventListener("click", event => {
      const remove = event.target.closest("[data-gallery-remove-file]");
      if (!remove) return;
      const index = selectedFiles.findIndex(item => item.id === remove.dataset.galleryRemoveFile);
      if (index >= 0) {
        const [removed] = selectedFiles.splice(index, 1);
        if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
        renderPreviews();
      }
    });
    $("couple-gallery-editor-form")?.addEventListener("submit", saveEditor);
    document.querySelectorAll("[data-couple-gallery-editor-close]").forEach(el => el.addEventListener("click", closeEditor));
    const viewer = $("couple-gallery-viewer");
    viewer?.addEventListener("touchstart", event => { touchStartX = event.changedTouches?.[0]?.clientX || 0; }, { passive: true });
    viewer?.addEventListener("touchend", event => {
      const end = event.changedTouches?.[0]?.clientX || 0;
      const delta = end - touchStartX;
      if (Math.abs(delta) >= 55) changeViewer(delta < 0 ? 1 : -1);
    }, { passive: true });
    window.addEventListener("javieats:data", () => { if (activeMode === "gallery") show("gallery"); });
    show("memories");
  }

  function reset() {
    signedUrlCache.clear();
    rows = [];
    offset = 0;
    hasMore = true;
    loading = false;
    loadedOnce = false;
    activeMode = "memories";
    viewerIndex = 0;
    resetEditor();
    renderGrid();
    show("memories");
  }

  const api = { pageRange, clampFiles, wrapIndex, normalizeRow, bindUI, refresh, show, reset, isGalleryActive };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.JaviEatsGallery = Object.freeze(api);
})();