(() => {
  "use strict";

  const STORAGE_BUCKET = "recuerdos";
  const MAX_PHOTOS = 8;
  const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
  const MAX_DIMENSION = 1600;
  const TARGET_BYTES = 700 * 1024;
  const SIGNED_URL_SECONDS = 60 * 60;
  const SIGNED_URL_REFRESH_MARGIN_MS = 5 * 60 * 1000;

  const signedUrlCache = new Map();
  let editorBusy = false;
  let editorState = createEmptyEditorState();
  let currentGallery = [];
  let currentGalleryIndex = 0;
  let bound = false;

  const $ = id => document.getElementById(id);
  const app = () => window.JaviEatsApp;
  const state = () => app()?.getState?.() || {};

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[char]);
  }

  function formatDate(dateKey) {
    const match = String(dateKey || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return match ? `${match[3]}/${match[2]}/${match[1]}` : String(dateKey || "");
  }

  function madridDateKey(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Madrid",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(date);
    const value = type => parts.find(part => part.type === type)?.value || "";
    return `${value("year")}-${value("month")}-${value("day")}`;
  }

  function canManage() {
    const role = app()?.getRole?.();
    return role === "javi" || role === "laura";
  }

  async function ensureSignedUrls(client, paths) {
    const now = Date.now();
    const uniquePaths = [...new Set((paths || []).filter(Boolean))];
    const missing = uniquePaths.filter(path => {
      const cached = signedUrlCache.get(path);
      return !cached || cached.expiresAt - now <= SIGNED_URL_REFRESH_MARGIN_MS;
    });
    if (!missing.length) return;

    const { data, error } = await client.storage
      .from(STORAGE_BUCKET)
      .createSignedUrls(missing, SIGNED_URL_SECONDS);
    if (error) throw error;

    (data || []).forEach((item, index) => {
      const path = item?.path || missing[index];
      if (!path || !item?.signedUrl) return;
      signedUrlCache.set(path, {
        url: item.signedUrl,
        expiresAt: now + (SIGNED_URL_SECONDS * 1000)
      });
    });
  }

  async function fetchAll(client) {
    if (!client) throw new Error("Supabase client unavailable");

    const { data, error } = await client
      .from("recuerdos_app")
      .select("*")
      .order("fecha", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;

    const rows = Array.isArray(data) ? data : [];
    const allPaths = rows
      .flatMap(memory => Array.isArray(memory.image_paths) ? memory.image_paths : [])
      .filter(Boolean);

    await ensureSignedUrls(client, allPaths);

    return {
      memories: rows.map(memory => ({
        ...memory,
        signedUrls: (Array.isArray(memory.image_paths) ? memory.image_paths : [])
          .map(path => signedUrlCache.get(path)?.url || "")
      })),
      loadError: false
    };
  }

  async function refresh() {
    const client = app()?.getClient?.();
    if (!client) throw new Error("Supabase client unavailable");
    try {
      const result = await fetchAll(client);
      const shared = state();
      shared.remoteMemories = result.memories;
      shared.memoryLoadError = false;
      render();
      window.dispatchEvent(new CustomEvent("javieats:data"));
      return result;
    } catch (error) {
      state().memoryLoadError = true;
      render();
      throw error;
    }
  }

  function getSignedUrl(path) {
    return signedUrlCache.get(path)?.url || "";
  }

  function deleteCached(path) {
    if (path) signedUrlCache.delete(path);
  }

  function clearCache() {
    signedUrlCache.clear();
  }

  function parseContent(memory) {
    const raw = String(memory?.contenido || "").trim();
    if (!raw) return { kind: memory?.tipo === "letter" ? "letter" : "gallery", text: "" };
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.schema === "javieats-memory-v1") return parsed;
    } catch (_) {}
    return { kind: memory?.tipo === "letter" ? "letter" : "gallery", text: raw };
  }

  function template(memory) {
    const urls = Array.isArray(memory.signedUrls) ? memory.signedUrls.filter(Boolean) : [];
    const requestedIndex = Number.isInteger(memory.cover_index) ? memory.cover_index : Number(memory.cover_index || 0);
    const cover = urls[requestedIndex] || urls[0] || "";
    const photoCount = Array.isArray(memory.image_paths) ? memory.image_paths.length : urls.length;
    const content = parseContent(memory);
    const kind = content.kind || (memory.tipo === "letter" ? "letter" : "gallery");
    const actionLabel = content.actionLabel
      || (kind === "yellow-flowers" ? "Volver a verlo"
        : kind === "letter" ? "Leer carta"
        : photoCount > 1 ? `Ver ${photoCount} fotos`
        : "Ver recuerdo");
    const placeholder = kind === "yellow-flowers" ? "🌻" : kind === "letter" ? "💌" : "📸";
    const media = cover
      ? `<img class="memory-cover" src="${cover}" alt="${escapeHtml(memory.titulo)}" loading="lazy" referrerpolicy="no-referrer" />`
      : `<div class="memory-placeholder">${placeholder}</div>`;
    const edit = canManage() && kind === "gallery"
      ? `<button class="btn btn-secondary memory-edit-btn" type="button" data-edit-remote-memory="${memory.id}" aria-label="Editar ${escapeHtml(memory.titulo)}">✎</button>`
      : "";

    return `<article class="memory-card is-remote${kind === "nuestro24" ? " is-nuestro24" : ""}"><div class="timeline-dot"></div><div class="memory-date">${formatDate(memory.fecha)}</div>${media}<div class="memory-body"><p class="eyebrow">Guardado en JaviEats</p><h3>${escapeHtml(memory.titulo)}</h3><p>${escapeHtml(memory.descripcion || "")}</p><div class="memory-card-actions"><button class="btn btn-secondary memory-open-btn" type="button" data-remote-memory-id="${memory.id}">${actionLabel}</button>${edit}</div></div></article>`;
  }

  function render() {
    const list = $("memories-list");
    const addButton = $("add-memory-btn");
    const note = $("memory-storage-note");
    if (!list) return;

    const manageable = canManage();
    addButton?.classList.toggle("hidden", !manageable);
    note?.classList.toggle("hidden", !manageable);

    if (note && manageable) {
      note.textContent = state().memoryLoadError
        ? "No se han podido cargar los recuerdos privados."
        : "Los dos podéis añadir y editar recuerdos. Las fotos se optimizan en el dispositivo y se guardan de forma privada.";
    }

    const memories = Array.isArray(state().remoteMemories) ? state().remoteMemories : [];
    list.innerHTML = memories.map(template).join("");
  }

  function renderLetterText(text) {
    const clean = String(text || "").trim();
    if (!clean) return "<p>La carta está vacía.</p>";
    return clean
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(Boolean)
      .map(p => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  function open(id) {
    const memory = (state().remoteMemories || []).find(item => item.id === id);
    if (!memory) return;

    const content = parseContent(memory);
    const kind = content.kind || (memory.tipo === "letter" ? "letter" : "gallery");

    if (kind === "nuestro24") {
      if (window.JaviEatsNuestro24?.openMemory) {
        void window.JaviEatsNuestro24.openMemory(memory);
      } else {
        app()?.showToast?.("No se ha podido abrir este recuerdo.");
      }
      return;
    }

    if (kind === "yellow-flowers") {
      if (window.JaviEatsYellowFlowers?.openMemory) {
        window.JaviEatsYellowFlowers.openMemory();
      } else {
        app()?.showToast?.("No se ha podido abrir este recuerdo.");
      }
      return;
    }

    if (kind === "letter") {
      const eyebrow = $("letter-eyebrow");
      const title = $("letter-title");
      const body = $("letter-content");
      if (eyebrow) eyebrow.textContent = content.letterEyebrow || formatDate(memory.fecha);
      if (title) title.textContent = content.letterTitle || memory.titulo;
      app()?.showPage?.("letter");
      if (body) {
        body.innerHTML = renderLetterText(content.text || "");
        body.dataset.loaded = "true";
      }
      return;
    }

    currentGallery = (memory.signedUrls || []).filter(Boolean);
    if (!currentGallery.length) {
      app()?.showToast?.("No se ha podido cargar la foto de este recuerdo.");
      return;
    }
    currentGalleryIndex = 0;
    if ($("memory-modal-date")) $("memory-modal-date").textContent = formatDate(memory.fecha);
    if ($("memory-modal-title")) $("memory-modal-title").textContent = memory.titulo;
    if ($("memory-modal-description")) $("memory-modal-description").textContent = memory.descripcion || "";
    renderGallery();
    $("memory-modal")?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    $("memory-modal")?.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function changeGallery(direction) {
    if (currentGallery.length <= 1) return;
    currentGalleryIndex = (currentGalleryIndex + direction + currentGallery.length) % currentGallery.length;
    renderGallery();
  }

  function renderGallery() {
    if (!currentGallery.length) return;
    const image = $("gallery-image");
    const counter = $("gallery-counter");
    const prev = $("gallery-prev");
    const next = $("gallery-next");
    if (image) image.src = currentGallery[currentGalleryIndex];
    if (counter) counter.textContent = `${currentGalleryIndex + 1} de ${currentGallery.length}`;
    const show = currentGallery.length > 1;
    prev?.classList.toggle("hidden", !show);
    next?.classList.toggle("hidden", !show);
    counter?.classList.toggle("hidden", !show);
  }

  function createEmptyEditorState() {
    return {
      id: null,
      existingPaths: [],
      removedPaths: new Set(),
      newFiles: []
    };
  }

  function resetEditorState() {
    for (const item of editorState?.newFiles || []) {
      if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    }
    editorState = createEmptyEditorState();
    const input = $("memory-photo-input");
    if (input) input.value = "";
  }

  function setUploadStatus(message, type = "") {
    const status = $("memory-upload-status");
    if (!status) return;
    status.textContent = message || "";
    status.classList.toggle("is-error", type === "error");
    status.classList.toggle("is-ok", type === "ok");
  }

  function retainedPaths() {
    return editorState.existingPaths.filter(path => !editorState.removedPaths.has(path));
  }

  function renderPhotoGrid() {
    const grid = $("memory-photo-grid");
    const counter = $("memory-photo-counter");
    const picker = $("memory-photo-picker");
    if (!grid) return;

    const retained = retainedPaths();
    const existingHtml = retained.map((path, index) => {
      const url = getSignedUrl(path);
      return `<div class="memory-photo-item">${url ? `<img src="${url}" alt="Foto guardada ${index + 1}" />` : '<div class="memory-placeholder">📷</div>'}<span class="memory-photo-badge">Guardada</span><button class="memory-photo-remove" type="button" data-remove-existing-photo="${escapeHtml(path)}" aria-label="Quitar foto">×</button></div>`;
    }).join("");

    const newHtml = editorState.newFiles.map((item, index) =>
      `<div class="memory-photo-item"><img src="${item.previewUrl}" alt="Nueva foto ${index + 1}"/><span class="memory-photo-badge">Nueva</span><button class="memory-photo-remove" type="button" data-remove-new-photo="${item.id}" aria-label="Quitar foto">×</button></div>`
    ).join("");

    const total = retained.length + editorState.newFiles.length;
    if (counter) counter.textContent = `${total} de ${MAX_PHOTOS}`;
    grid.innerHTML = total
      ? existingHtml + newHtml
      : `<div class="memory-photo-empty">Añade entre 1 y ${MAX_PHOTOS} fotos.<br>JaviEats las optimizará antes de subirlas.</div>`;
    if (picker) picker.disabled = total >= MAX_PHOTOS || editorBusy;
  }

  function setEditorBusy(busy) {
    editorBusy = busy;
    const ids = ["memory-save-btn", "memory-delete-btn", "memory-editor-date", "memory-editor-name", "memory-editor-description", "memory-photo-input"];
    ids.forEach(id => {
      const element = $(id);
      if (element) element.disabled = busy;
    });
    renderPhotoGrid();
  }

  function openEditor(id = null) {
    if (!canManage()) return;
    if (state().memoryLoadError) {
      app()?.showToast?.("No se han podido cargar los recuerdos privados.");
      return;
    }

    resetEditorState();
    const memory = id ? (state().remoteMemories || []).find(item => item.id === id) : null;
    editorState.id = memory?.id || null;
    editorState.existingPaths = Array.isArray(memory?.image_paths) ? [...memory.image_paths] : [];

    if ($("memory-editor-eyebrow")) $("memory-editor-eyebrow").textContent = memory ? "Editar recuerdo" : "Nuevo recuerdo";
    if ($("memory-editor-title")) $("memory-editor-title").textContent = memory ? "Actualizar este momento" : "Guardar un momento";
    if ($("memory-editor-date")) $("memory-editor-date").value = memory?.fecha || madridDateKey();
    if ($("memory-editor-name")) $("memory-editor-name").value = memory?.titulo || "";
    if ($("memory-editor-description")) $("memory-editor-description").value = memory?.descripcion || "";
    $("memory-delete-btn")?.classList.toggle("hidden", !memory);

    setUploadStatus("");
    renderPhotoGrid();
    $("memory-editor-modal")?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    setTimeout(() => $("memory-editor-name")?.focus(), 80);
  }

  function closeEditor() {
    if (editorBusy) return;
    $("memory-editor-modal")?.classList.add("hidden");
    document.body.style.overflow = "";
    resetEditorState();
    setUploadStatus("");
  }

  function handlePhotoSelection(event) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const currentCount = retainedPaths().length + editorState.newFiles.length;
    let slots = Math.max(0, MAX_PHOTOS - currentCount);
    let rejected = 0;

    for (const file of files) {
      if (!slots) {
        rejected += 1;
        continue;
      }
      if (!String(file.type || "").startsWith("image/") || file.size > MAX_SOURCE_BYTES) {
        rejected += 1;
        continue;
      }
      editorState.newFiles.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file)
      });
      slots -= 1;
    }

    event.target.value = "";
    renderPhotoGrid();
    if (rejected) setUploadStatus(`Se han omitido ${rejected} archivo(s) por límite, tamaño o formato.`, "error");
    else setUploadStatus("Las fotos se comprimirán únicamente cuando pulses Guardar.");
  }

  function handlePhotoGridClick(event) {
    const removeExisting = event.target.closest("[data-remove-existing-photo]");
    const removeNew = event.target.closest("[data-remove-new-photo]");

    if (removeExisting) {
      editorState.removedPaths.add(removeExisting.dataset.removeExistingPhoto);
      renderPhotoGrid();
    }

    if (removeNew) {
      const index = editorState.newFiles.findIndex(item => item.id === removeNew.dataset.removeNewPhoto);
      if (index >= 0) {
        const [removed] = editorState.newFiles.splice(index, 1);
        if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
        renderPhotoGrid();
      }
    }
  }

  function uploadErrorMessage(error) {
    const message = String(error?.message || error?.error || "").toLowerCase();
    if (message.includes("row-level security") || message.includes("policy")) return "Supabase ha bloqueado la operación. Revisa los permisos de Recuerdos.";
    if (message.includes("payload") || message.includes("too large")) return "Una de las fotos sigue siendo demasiado grande después de optimizarla.";
    if (message.includes("mime") || message.includes("format") || message.includes("decode")) return "No se ha podido procesar una imagen. Prueba con JPG, PNG o WebP.";
    return "No se ha podido guardar el recuerdo. Revisa la conexión e inténtalo de nuevo.";
  }

  async function save(event) {
    event.preventDefault();
    if (!canManage() || editorBusy) return;

    const client = app()?.getClient?.();
    if (!client) return;

    const fecha = $("memory-editor-date")?.value || "";
    const titulo = $("memory-editor-name")?.value?.trim() || "";
    const descripcion = $("memory-editor-description")?.value?.trim() || "";
    const retained = retainedPaths();
    const totalPhotos = retained.length + editorState.newFiles.length;

    if (!fecha || !titulo) {
      setUploadStatus("Completa la fecha y el título.", "error");
      return;
    }
    if (!totalPhotos) {
      setUploadStatus("Añade al menos una foto al recuerdo.", "error");
      return;
    }

    const isEditing = Boolean(editorState.id);
    const memoryId = editorState.id || crypto.randomUUID();
    const uploadedPaths = [];
    let persisted = false;
    setEditorBusy(true);
    if ($("memory-save-btn")) $("memory-save-btn").textContent = isEditing ? "Guardando cambios…" : "Guardando recuerdo…";

    try {
      for (let i = 0; i < editorState.newFiles.length; i += 1) {
        const item = editorState.newFiles[i];
        setUploadStatus(`Optimizando foto ${i + 1} de ${editorState.newFiles.length}…`);
        const optimized = await compressImage(item.file);
        const extension = optimized.type === "image/jpeg" ? "jpg" : "webp";
        const path = `${memoryId}/${Date.now()}-${String(i + 1).padStart(2, "0")}-${crypto.randomUUID().slice(0, 8)}.${extension}`;

        setUploadStatus(`Subiendo foto ${i + 1} de ${editorState.newFiles.length}…`);
        const { error: uploadError } = await client.storage
          .from(STORAGE_BUCKET)
          .upload(path, optimized, {
            cacheControl: "31536000",
            contentType: optimized.type,
            upsert: false
          });
        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
      }

      const finalPaths = [...retained, ...uploadedPaths];
      const payload = {
        fecha,
        titulo,
        descripcion,
        tipo: "gallery",
        contenido: "",
        image_paths: finalPaths,
        cover_index: 0
      };

      const result = isEditing
        ? await client.from("recuerdos_app").update(payload).eq("id", memoryId)
        : await client.from("recuerdos_app").insert({ id: memoryId, ...payload });
      if (result.error) throw result.error;
      persisted = true;

      const removed = [...editorState.removedPaths].filter(Boolean);
      const pathsToRemove = window.JaviEatsNuestro24
        ? await window.JaviEatsNuestro24.filterRemovablePhotos(client, removed)
        : removed;
      if (pathsToRemove.length) {
        const { error: removeError } = await client.storage.from(STORAGE_BUCKET).remove(pathsToRemove);
        if (removeError) console.warn("El recuerdo se guardó, pero no se pudieron limpiar algunas fotos antiguas:", removeError);
        pathsToRemove.forEach(deleteCached);
      }

      resetEditorState();
      $("memory-editor-modal")?.classList.add("hidden");
      document.body.style.overflow = "";
      setUploadStatus("");

      try {
        await refresh();
      } catch (refreshError) {
        console.error("El recuerdo se guardó pero no se pudo refrescar la lista:", refreshError);
        app()?.showToast?.("Recuerdo guardado. Recarga la página para verlo.");
        return;
      }

      app()?.showToast?.(isEditing ? "Recuerdo actualizado ❤️" : "Recuerdo guardado ❤️");
    } catch (error) {
      console.error("Error guardando recuerdo:", error);
      if (!persisted && uploadedPaths.length) {
        try {
          await client.storage.from(STORAGE_BUCKET).remove(uploadedPaths);
        } catch (cleanupError) {
          console.warn(cleanupError);
        }
      }
      setUploadStatus(uploadErrorMessage(error), "error");
    } finally {
      setEditorBusy(false);
      if ($("memory-save-btn")) $("memory-save-btn").textContent = "Guardar recuerdo";
    }
  }

  async function remove() {
    if (!canManage() || editorBusy || !editorState.id) return;

    const client = app()?.getClient?.();
    const memory = (state().remoteMemories || []).find(item => item.id === editorState.id);
    if (!client || !memory) return;
    if (!confirm(`¿Eliminar "${memory.titulo}" y sus fotos? Esta acción no se puede deshacer.`)) return;

    setEditorBusy(true);
    setUploadStatus("Eliminando recuerdo…");

    try {
      const { error } = await client.from("recuerdos_app").delete().eq("id", memory.id);
      if (error) throw error;

      const originalPaths = Array.isArray(memory.image_paths) ? memory.image_paths.filter(Boolean) : [];
      const paths = window.JaviEatsNuestro24
        ? await window.JaviEatsNuestro24.filterRemovablePhotos(client, originalPaths)
        : originalPaths;
      if (paths.length) {
        const { error: removeError } = await client.storage.from(STORAGE_BUCKET).remove(paths);
        if (removeError) console.warn("Se eliminó el recuerdo, pero quedaron archivos huérfanos:", removeError);
        paths.forEach(deleteCached);
      }

      $("memory-editor-modal")?.classList.add("hidden");
      document.body.style.overflow = "";
      resetEditorState();

      try {
        await refresh();
      } catch (refreshError) {
        console.error("El recuerdo se eliminó pero no se pudo refrescar la lista:", refreshError);
        app()?.showToast?.("Recuerdo eliminado. Recarga la página para actualizar la lista.");
        return;
      }

      app()?.showToast?.("Recuerdo eliminado.");
    } catch (error) {
      console.error(error);
      setUploadStatus(uploadErrorMessage(error), "error");
    } finally {
      setEditorBusy(false);
    }
  }

  function bindUI() {
    if (bound) return;
    bound = true;

    $("add-memory-btn")?.addEventListener("click", () => openEditor());
    $("memory-photo-picker")?.addEventListener("click", () => $("memory-photo-input")?.click());
    $("memory-photo-input")?.addEventListener("change", handlePhotoSelection);
    $("memory-photo-grid")?.addEventListener("click", handlePhotoGridClick);
    $("memory-editor-form")?.addEventListener("submit", save);
    $("memory-delete-btn")?.addEventListener("click", remove);

    $("memories-list")?.addEventListener("click", event => {
      const editButton = event.target.closest("[data-edit-remote-memory]");
      const openButton = event.target.closest("[data-remote-memory-id]");
      if (editButton) {
        openEditor(editButton.dataset.editRemoteMemory);
        return;
      }
      if (openButton) open(openButton.dataset.remoteMemoryId);
    });

    $("gallery-prev")?.addEventListener("click", () => changeGallery(-1));
    $("gallery-next")?.addEventListener("click", () => changeGallery(1));
    document.querySelectorAll("[data-memory-close]").forEach(element => element.addEventListener("click", closeModal));
    document.querySelectorAll("[data-memory-editor-close]").forEach(element => element.addEventListener("click", closeEditor));
  }

  function reset() {
    clearCache();
    resetEditorState();
    editorBusy = false;
    currentGallery = [];
    currentGalleryIndex = 0;
    closeModal();
    closeEditor();
  }

  function loadImage(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("decode image failed"));
      };
      image.src = url;
    });
  }

  function drawImage(image, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("canvas unavailable");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return canvas;
  }

  function canvasToBlob(canvas, type, quality) {
    return new Promise(resolve => canvas.toBlob(resolve, type, quality));
  }

  async function compressImage(file) {
    const image = await loadImage(file);
    let width = image.naturalWidth || image.width;
    let height = image.naturalHeight || image.height;
    if (!width || !height) throw new Error("decode image failed");

    const initialScale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    width = Math.max(1, Math.round(width * initialScale));
    height = Math.max(1, Math.round(height * initialScale));

    let canvas = drawImage(image, width, height);
    let quality = 0.84;
    let blob = await canvasToBlob(canvas, "image/webp", quality);
    if (!blob) blob = await canvasToBlob(canvas, "image/jpeg", 0.84);
    if (!blob) throw new Error("image format unsupported");

    while (blob.size > TARGET_BYTES && quality > 0.56) {
      quality -= 0.07;
      blob = await canvasToBlob(
        canvas,
        blob.type === "image/jpeg" ? "image/jpeg" : "image/webp",
        quality
      );
    }

    if (blob.size > TARGET_BYTES * 1.35) {
      const scale = 0.82;
      canvas = drawImage(
        image,
        Math.max(1, Math.round(width * scale)),
        Math.max(1, Math.round(height * scale))
      );
      blob = await canvasToBlob(
        canvas,
        blob.type === "image/jpeg" ? "image/jpeg" : "image/webp",
        Math.max(0.58, quality - 0.04)
      );
    }

    return blob;
  }

  window.JaviEatsMemories = Object.freeze({
    storageBucket: STORAGE_BUCKET,
    maxPhotos: MAX_PHOTOS,
    maxSourceBytes: MAX_SOURCE_BYTES,
    fetchAll,
    refresh,
    render,
    bindUI,
    open,
    openEditor,
    closeEditor,
    closeModal,
    reset,
    getSignedUrl,
    deleteCached,
    clearCache,
    compressImage
  });
})();