(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  if (params.get("migrate") !== "legacy-memories") return;

  const BUCKET = "recuerdos";
  const MAX_DIMENSION = 1600;
  const TARGET_BYTES = 700 * 1024;

  const LEGACY = [
    {
      legacyKey: "2026-04-24",
      fecha: "2026-04-24",
      titulo: "El día que empezó oficialmente lo nuestro",
      descripcion: "Las primeras flores y la carta con la que empezó todo.",
      tipo: "letter",
      images: ["recuerdos/ramo-2026-04-24.jpeg"],
      letterFile: "recuerdos/carta-2026-04-24.txt",
      letterEyebrow: "24 de abril de 2026",
      letterTitle: "La carta con la que te pedí salir",
      actionLabel: "Leer carta"
    },
    {
      legacyKey: "2026-05-31",
      fecha: "2026-05-31",
      titulo: "Las flores llegaron a la vuelta",
      descripcion: "El primer mes nos pilló con kilómetros de por medio. Este ramo llegó al volver de Alemania.",
      tipo: "gallery",
      images: ["recuerdos/ramo-2026-05-31.jpeg"]
    },
    {
      legacyKey: "2026-07-13",
      fecha: "2026-07-13",
      titulo: "La primera entrega secreta de JaviEats",
      descripcion: "La carta de nuestros dos primeros meses, guardada para volver a leerla cuando quieras.",
      tipo: "letter",
      images: [],
      letterFile: "recuerdos/carta-2026-07-13.txt",
      letterEyebrow: "13 de julio de 2026",
      letterTitle: "Nuestra carta de los dos primeros meses",
      actionLabel: "Volver a leer"
    },
    {
      legacyKey: "2026-07-24",
      fecha: "2026-07-24",
      titulo: "Nuestro tercer mes",
      descripcion: "El tercer ramo y la foto con la que quedó oficialmente entregado.",
      tipo: "gallery",
      images: [
        "recuerdos/ramo-2026-07-24.jpeg",
        "recuerdos/laura-ramo-2026-07-24.jpeg"
      ]
    },
    {
      legacyKey: "2026-09-21-yellow-flowers",
      fecha: "2026-09-21",
      titulo: "Las flores amarillas de JaviEats",
      descripcion: "Un 21 de septiembre, JaviEats también encontró su propia forma de regalarte flores amarillas.",
      tipo: "letter",
      images: [],
      specialKind: "yellow-flowers",
      actionLabel: "Volver a verlo"
    }
  ];

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async function waitForJavi() {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const app = window.JaviEatsApp;
      const user = app?.getUser?.();
      const role = app?.getRole?.();
      if (user && role === "javi" && app?.getClient?.()) return app;
      if (user && role && role !== "unknown" && role !== "javi") {
        throw new Error("Esta migración solo se puede ejecutar con el perfil Javi.");
      }
      await sleep(250);
    }
    throw new Error("No se ha podido detectar una sesión de Javi autenticada.");
  }

  async function fetchBlob(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`No se ha podido cargar ${path}`);
    return response.blob();
  }

  async function fetchText(path) {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`No se ha podido cargar ${path}`);
    return response.text();
  }

  function loadImage(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.onload = () => {
        URL.revokeObjectURL(url);
        resolve(image);
      };
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("No se ha podido decodificar una imagen."));
      };
      image.src = url;
    });
  }

  function drawImage(image, width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("Canvas no disponible.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    return canvas;
  }

  function canvasBlob(canvas, type, quality) {
    return new Promise(resolve => canvas.toBlob(resolve, type, quality));
  }

  async function compressImage(sourceBlob) {
    const image = await loadImage(sourceBlob);
    let width = image.naturalWidth || image.width;
    let height = image.naturalHeight || image.height;
    if (!width || !height) throw new Error("Dimensiones de imagen no válidas.");

    const initialScale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    width = Math.max(1, Math.round(width * initialScale));
    height = Math.max(1, Math.round(height * initialScale));

    let canvas = drawImage(image, width, height);
    let quality = 0.84;
    let blob = await canvasBlob(canvas, "image/webp", quality);
    if (!blob) blob = await canvasBlob(canvas, "image/jpeg", 0.84);
    if (!blob) throw new Error("El navegador no puede comprimir la imagen.");

    while (blob.size > TARGET_BYTES && quality > 0.56) {
      quality -= 0.07;
      blob = await canvasBlob(
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
      blob = await canvasBlob(
        canvas,
        blob.type === "image/jpeg" ? "image/jpeg" : "image/webp",
        Math.max(0.58, quality - 0.04)
      );
    }

    return blob;
  }

  async function buildContent(item) {
    if (item.specialKind === "yellow-flowers") {
      return JSON.stringify({
        schema: "javieats-memory-v1",
        kind: "yellow-flowers",
        actionLabel: item.actionLabel || "Volver a verlo"
      });
    }

    if (item.tipo !== "letter") return "";

    const text = await fetchText(item.letterFile);
    return JSON.stringify({
      schema: "javieats-memory-v1",
      kind: "letter",
      letterEyebrow: item.letterEyebrow || "",
      letterTitle: item.letterTitle || item.titulo,
      actionLabel: item.actionLabel || "Leer carta",
      text
    });
  }

  async function uploadImages(client, item) {
    const uploaded = [];

    for (let index = 0; index < item.images.length; index += 1) {
      const source = await fetchBlob(item.images[index]);
      const optimized = await compressImage(source);
      const extension = optimized.type === "image/jpeg" ? "jpg" : "webp";
      const path = `legacy/${item.legacyKey}/${String(index + 1).padStart(2, "0")}.${extension}`;

      const { error } = await client.storage
        .from(BUCKET)
        .upload(path, optimized, {
          cacheControl: "31536000",
          contentType: optimized.type,
          upsert: true
        });

      if (error) throw error;
      uploaded.push(path);
    }

    return uploaded;
  }

  async function migrateOne(app, item) {
    const client = app.getClient();
    const imagePaths = await uploadImages(client, item);
    const contenido = await buildContent(item);

    const payload = {
      fecha: item.fecha,
      titulo: item.titulo,
      descripcion: item.descripcion,
      tipo: item.tipo,
      contenido,
      image_paths: imagePaths,
      cover_index: 0,
      legacy_key: item.legacyKey
    };

    const { data, error } = await client
      .from("recuerdos_app")
      .upsert(payload, { onConflict: "legacy_key" })
      .select("id, legacy_key, titulo, image_paths")
      .single();

    if (error) throw error;
    return data;
  }

  function installPanel() {
    const panel = document.createElement("section");
    panel.id = "legacy-memory-migrator";
    panel.innerHTML = `
      <div class="legacy-migrate-card">
        <div class="legacy-migrate-head">
          <div>
            <small>JAVIEATS 3.3.6 · MIGRACIÓN</small>
            <h2>Recuerdos históricos → Supabase</h2>
          </div>
          <button type="button" data-migrate-close aria-label="Cerrar">×</button>
        </div>
        <p>Se migrarán 5 recuerdos históricos. Las fotos se comprimirán con el mismo criterio que los recuerdos nuevos y se guardarán en el bucket privado.</p>
        <div class="legacy-migrate-list">
          ${LEGACY.map(item => `<div data-migrate-row="${escapeHtml(item.legacyKey)}"><span>○</span><b>${escapeHtml(item.fecha)}</b><em>${escapeHtml(item.titulo)}</em></div>`).join("")}
        </div>
        <div class="legacy-migrate-status" data-migrate-status>Preparado. Inicia sesión como Javi y pulsa Migrar.</div>
        <div class="legacy-migrate-actions">
          <button type="button" class="primary" data-migrate-run>Migrar 5 recuerdos</button>
          <button type="button" data-migrate-exit>Salir del modo migración</button>
        </div>
      </div>
    `;

    const style = document.createElement("style");
    style.id = "legacy-memory-migrator-style";
    style.textContent = `
      #legacy-memory-migrator{position:fixed;inset:0;z-index:2147483200;display:grid;place-items:center;padding:18px;background:rgba(17,17,17,.58);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      #legacy-memory-migrator .legacy-migrate-card{width:min(680px,100%);max-height:88dvh;overflow:auto;padding:22px;border-radius:26px;background:#fff;color:#111;box-shadow:0 30px 80px rgba(0,0,0,.28)}
      #legacy-memory-migrator .legacy-migrate-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
      #legacy-memory-migrator small{color:#e85d45;font-weight:950;letter-spacing:.08em}
      #legacy-memory-migrator h2{margin:4px 0 0;font-size:1.45rem}
      #legacy-memory-migrator p{color:#6f6a64;line-height:1.5}
      #legacy-memory-migrator [data-migrate-close]{width:36px;height:36px;border:0;border-radius:50%;background:#f4f0ea;font-size:22px}
      #legacy-memory-migrator .legacy-migrate-list{display:grid;gap:7px;margin:16px 0}
      #legacy-memory-migrator .legacy-migrate-list div{display:grid;grid-template-columns:22px 86px 1fr;gap:8px;align-items:center;padding:10px 12px;border-radius:13px;background:#f7f3ee}
      #legacy-memory-migrator .legacy-migrate-list span{font-weight:950}
      #legacy-memory-migrator .legacy-migrate-list em{font-style:normal;color:#6f6a64}
      #legacy-memory-migrator .legacy-migrate-status{padding:12px;border-radius:13px;background:#fff1c9;font-weight:750;line-height:1.4}
      #legacy-memory-migrator .legacy-migrate-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px}
      #legacy-memory-migrator .legacy-migrate-actions button{min-height:44px;border:0;border-radius:13px;padding:10px 12px;font-weight:900;cursor:pointer}
      #legacy-memory-migrator .legacy-migrate-actions .primary{background:#111;color:#fff}
      #legacy-memory-migrator button:disabled{opacity:.55;cursor:wait}
      @media(max-width:620px){#legacy-memory-migrator .legacy-migrate-actions{grid-template-columns:1fr}#legacy-memory-migrator .legacy-migrate-list div{grid-template-columns:22px 78px 1fr;font-size:.8rem}}
    `;

    document.head.appendChild(style);
    document.body.appendChild(panel);
    return panel;
  }

  function leaveMigrationMode() {
    const url = new URL(window.location.href);
    url.searchParams.delete("migrate");
    window.location.href = url.toString();
  }

  async function run(panel) {
    const button = panel.querySelector("[data-migrate-run]");
    const status = panel.querySelector("[data-migrate-status]");
    button.disabled = true;

    try {
      status.textContent = "Comprobando sesión de Javi…";
      const app = await waitForJavi();

      let done = 0;
      for (const item of LEGACY) {
        const row = panel.querySelector(`[data-migrate-row="${CSS.escape(item.legacyKey)}"]`);
        const icon = row?.querySelector("span");
        if (icon) icon.textContent = "…";
        status.textContent = `Migrando ${item.fecha} · ${item.titulo}`;

        await migrateOne(app, item);

        done += 1;
        if (icon) icon.textContent = "✓";
      }

      status.textContent = `Migración completada: ${done} de ${LEGACY.length} recuerdos guardados en Supabase. Actualizando JaviEats…`;
      await app.refresh?.({ silent: false, reason: "legacy-memory-migration" });
      status.textContent = "Migración completada. Comprueba los recuerdos y, cuando todo esté correcto, podremos retirar las copias antiguas de GitHub.";
      button.textContent = "Migración completada";
    } catch (error) {
      console.error("Migración de recuerdos:", error);
      status.textContent = `Error: ${error?.message || error}. Puedes volver a ejecutarla; no duplicará los recuerdos.`;
      button.disabled = false;
      button.textContent = "Reintentar migración";
    }
  }

  function init() {
    const panel = installPanel();
    panel.querySelector("[data-migrate-close]")?.addEventListener("click", () => panel.remove());
    panel.querySelector("[data-migrate-exit]")?.addEventListener("click", leaveMigrationMode);
    panel.querySelector("[data-migrate-run]")?.addEventListener("click", () => run(panel));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();