(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  if (params.get("debug") !== "1") return;

  const VERSION = "3.3.6";
  const PANEL_ID = "javieats-debug-panel";

  const escapeHtml = value => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  async function collect() {
    const app = window.JaviEatsApp;
    const registration = "serviceWorker" in navigator
      ? await navigator.serviceWorker.getRegistration().catch(() => null)
      : null;
    const cacheNames = "caches" in window
      ? await caches.keys().catch(() => [])
      : [];

    return {
      version: VERSION,
      online: navigator.onLine,
      role: app?.getRole?.() || "sin resolver",
      authenticated: Boolean(app?.getUser?.()),
      swSupported: "serviceWorker" in navigator,
      swControlled: Boolean(navigator.serviceWorker?.controller),
      swUrl: registration?.active?.scriptURL || registration?.waiting?.scriptURL || registration?.installing?.scriptURL || "sin registro activo",
      pushPermission: "Notification" in window ? Notification.permission : "no compatible",
      cacheNames,
      standalone: window.matchMedia?.("(display-mode: standalone)")?.matches || Boolean(navigator.standalone),
      url: window.location.href,
      updated: document.lastModified || "desconocido"
    };
  }

  function row(label, value) {
    return `<div class="je-debug-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
  }

  async function render() {
    document.getElementById(PANEL_ID)?.remove();
    const data = await collect();

    const panel = document.createElement("aside");
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="je-debug-head">
        <div><small>JAVIEATS · DIAGNÓSTICO</small><b>v${VERSION}</b></div>
        <button type="button" data-je-debug-close aria-label="Cerrar">×</button>
      </div>
      <div class="je-debug-grid">
        ${row("Sesión", data.authenticated ? "autenticada" : "no autenticada")}
        ${row("Perfil", data.role)}
        ${row("Red", data.online ? "online" : "offline")}
        ${row("PWA standalone", data.standalone ? "sí" : "no")}
        ${row("Service Worker", data.swSupported ? (data.swControlled ? "activo y controlando" : "compatible, no controla esta página") : "no compatible")}
        ${row("Push", data.pushPermission)}
        ${row("Última modificación", data.updated)}
        ${row("Caches", data.cacheNames.length ? data.cacheNames.join(", ") : "ninguna")}
      </div>
      <details>
        <summary>Detalles técnicos</summary>
        <div class="je-debug-details">
          <code>SW: ${escapeHtml(data.swUrl)}</code>
          <code>URL: ${escapeHtml(data.url)}</code>
        </div>
      </details>
      <div class="je-debug-actions">
        <button type="button" data-je-debug-refresh>Actualizar datos</button>
        <button type="button" data-je-debug-reload>Recargar página</button>
      </div>
    `;

    const style = document.createElement("style");
    style.id = "javieats-debug-style";
    style.textContent = `
      #${PANEL_ID}{position:fixed;z-index:2147483000;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));width:min(420px,calc(100vw - 24px));max-height:min(78dvh,680px);overflow:auto;padding:16px;border:1px solid rgba(17,17,17,.12);border-radius:22px;background:rgba(255,255,255,.97);color:#111;box-shadow:0 22px 60px rgba(0,0,0,.24);font:13px/1.35 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      #${PANEL_ID} .je-debug-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:12px}
      #${PANEL_ID} .je-debug-head small{display:block;color:#e85d45;font-size:10px;font-weight:900;letter-spacing:.08em}
      #${PANEL_ID} .je-debug-head b{font-size:20px}
      #${PANEL_ID} .je-debug-head button{width:34px;height:34px;border:0;border-radius:50%;background:#f4f0ea;font-size:22px;cursor:pointer}
      #${PANEL_ID} .je-debug-grid{display:grid;gap:7px}
      #${PANEL_ID} .je-debug-row{display:flex;justify-content:space-between;gap:14px;padding:9px 10px;border-radius:12px;background:#f7f3ee}
      #${PANEL_ID} .je-debug-row span{color:#6f6a64}
      #${PANEL_ID} .je-debug-row strong{text-align:right;overflow-wrap:anywhere}
      #${PANEL_ID} details{margin-top:10px}
      #${PANEL_ID} summary{cursor:pointer;font-weight:800}
      #${PANEL_ID} .je-debug-details{display:grid;gap:6px;margin-top:8px}
      #${PANEL_ID} code{display:block;padding:8px;border-radius:10px;background:#111;color:#fff;overflow-wrap:anywhere;white-space:normal;font-size:11px}
      #${PANEL_ID} .je-debug-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
      #${PANEL_ID} .je-debug-actions button{min-height:40px;border:0;border-radius:12px;background:#111;color:#fff;font-weight:850;cursor:pointer}
    `;
    document.getElementById("javieats-debug-style")?.remove();
    document.head.appendChild(style);
    document.body.appendChild(panel);

    panel.querySelector("[data-je-debug-close]")?.addEventListener("click", () => panel.remove());
    panel.querySelector("[data-je-debug-refresh]")?.addEventListener("click", render);
    panel.querySelector("[data-je-debug-reload]")?.addEventListener("click", () => window.location.reload());
  }

  const start = () => {
    render().catch(error => console.error("JaviEats debug:", error));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }

  window.addEventListener("javieats:data", () => {
    if (document.getElementById(PANEL_ID)) render().catch(() => {});
  });
})();
