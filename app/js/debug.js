(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  if (params.get("debug") !== "1") return;

  const VERSION = "3.3.6";
  const PANEL_ID = "javieats-debug-panel";
  const recentErrors = [];

  const escapeHtml = value => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const formatDateTime = value => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat("es-ES", {
      timeZone: "Europe/Madrid",
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(date);
  };

  const rememberError = value => {
    const message = String(value?.message || value?.reason?.message || value?.reason || value || "Error desconocido");
    recentErrors.unshift({
      at: new Date().toISOString(),
      message: message.slice(0, 240)
    });
    recentErrors.splice(5);
  };

  window.addEventListener("error", event => rememberError(event.error || event.message));
  window.addEventListener("unhandledrejection", event => rememberError(event.reason));

  async function collect() {
    const app = window.JaviEatsApp;
    const state = app?.getState?.() || {};
    const sync = window.JaviEatsSync?.getDiagnostics?.() || null;

    const registration = "serviceWorker" in navigator
      ? await navigator.serviceWorker.getRegistration().catch(() => null)
      : null;

    const cacheNames = "caches" in window
      ? await caches.keys().catch(() => [])
      : [];

    let pushSubscribed = null;
    if (window.JaviEatsPush?.isSupported?.()) {
      try {
        pushSubscribed = Boolean(await window.JaviEatsPush.currentSubscription());
      } catch (_) {
        pushSubscribed = false;
      }
    }

    const modules = {
      auth: Boolean(window.JaviEatsAuth),
      memories: Boolean(window.JaviEatsMemories),
      notifications: Boolean(window.JaviEatsNotifications),
      plans: Boolean(window.JaviEatsPlans),
      push: Boolean(window.JaviEatsPush),
      rewards: Boolean(window.JaviEatsRewards),
      sync: Boolean(window.JaviEatsSync),
      ui: Boolean(window.JaviEatsApp),
      ysi: Boolean(window.JaviEatsYSi)
    };

    return {
      version: VERSION,
      online: navigator.onLine,
      role: app?.getRole?.() || "sin resolver",
      authenticated: Boolean(app?.getUser?.()),
      swSupported: "serviceWorker" in navigator,
      swControlled: Boolean(navigator.serviceWorker?.controller),
      swState: registration?.active?.state || registration?.waiting?.state || registration?.installing?.state || "sin registro activo",
      swUrl: registration?.active?.scriptURL || registration?.waiting?.scriptURL || registration?.installing?.scriptURL || "sin registro activo",
      pushPermission: "Notification" in window ? Notification.permission : "no compatible",
      pushSubscribed,
      cacheNames,
      standalone: window.matchMedia?.("(display-mode: standalone)")?.matches || Boolean(navigator.standalone),
      url: window.location.href,
      updated: document.lastModified || "desconocido",
      sync,
      modules,
      counts: {
        plans: Array.isArray(state.proposals) ? state.proposals.length : 0,
        memories: Array.isArray(state.remoteMemories) ? state.remoteMemories.length : 0,
        notifications: Array.isArray(state.notifications) ? state.notifications.length : 0,
        ysiHistory: Array.isArray(state.ySiHistory) ? state.ySiHistory.length : 0,
        vouchers: Array.isArray(state.vouchers) ? state.vouchers.length : 0,
        puzzlePieces: Array.isArray(state.puzzlePieces) ? state.puzzlePieces.length : 0
      },
      ysi: {
        loaded: Boolean(state.ySiCurrent),
        loadError: Boolean(state.ySiLoadError),
        lastResult: Boolean(state.ySiLastResult)
      },
      recentErrors: [...recentErrors]
    };
  }

  function row(label, value) {
    return `<div class="je-debug-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`;
  }

  async function render() {
    document.getElementById(PANEL_ID)?.remove();
    const data = await collect();
    const loadedModules = Object.entries(data.modules).filter(([, value]) => value).map(([key]) => key);
    const missingModules = Object.entries(data.modules).filter(([, value]) => !value).map(([key]) => key);

    const syncLabel = !data.sync
      ? "sin módulo"
      : data.sync.inFlight
        ? "en curso"
        : data.sync.lastOk === true
          ? "OK"
          : data.sync.lastOk === false
            ? "con fallos"
            : "sin ejecutar";

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
        ${row("Service Worker", data.swSupported ? `${data.swControlled ? "controlando" : "sin controlar"} · ${data.swState}` : "no compatible")}
        ${row("Push permiso", data.pushPermission)}
        ${row("Push suscripción", data.pushSubscribed === null ? "no compatible" : (data.pushSubscribed ? "activa" : "no activa"))}
        ${row("Sync", syncLabel)}
        ${row("Última sync", data.sync?.lastFinishedAt ? formatDateTime(data.sync.lastFinishedAt) : "—")}
        ${row("Duración sync", Number.isFinite(data.sync?.lastDurationMs) ? `${data.sync.lastDurationMs} ms` : "—")}
        ${row("Motivo sync", data.sync?.lastReason || "—")}
        ${row("Fallos sync", data.sync?.lastFailures?.length ? data.sync.lastFailures.join(", ") : "ninguno")}
        ${row("Planes", data.counts.plans)}
        ${row("Recuerdos", data.counts.memories)}
        ${row("Notificaciones", data.counts.notifications)}
        ${row("Historial ¿Y si…?", data.counts.ysiHistory)}
        ${row("Piezas puzzle", data.counts.puzzlePieces)}
        ${row("Vales", data.counts.vouchers)}
        ${row("¿Y si…?", data.ysi.loadError ? "error de carga" : (data.ysi.loaded ? "cargado" : "sin cargar"))}
        ${row("Última modificación", data.updated)}
        ${row("Caches", data.cacheNames.length ? data.cacheNames.join(", ") : "ninguna")}
      </div>

      <details>
        <summary>Módulos</summary>
        <div class="je-debug-details">
          <code>Cargados: ${escapeHtml(loadedModules.join(", ") || "ninguno")}</code>
          <code>Ausentes: ${escapeHtml(missingModules.join(", ") || "ninguno")}</code>
        </div>
      </details>

      <details>
        <summary>Errores recientes (${data.recentErrors.length})</summary>
        <div class="je-debug-details">
          ${data.recentErrors.length
            ? data.recentErrors.map(item => `<code>${escapeHtml(formatDateTime(item.at))} · ${escapeHtml(item.message)}</code>`).join("")
            : "<code>Ningún error capturado en esta sesión debug.</code>"}
        </div>
      </details>

      <details>
        <summary>Detalles técnicos</summary>
        <div class="je-debug-details">
          <code>SW: ${escapeHtml(data.swUrl)}</code>
          <code>URL: ${escapeHtml(data.url)}</code>
          <code>Retry sync: ${escapeHtml(data.sync?.retryScheduled ? `sí · intento ${data.sync.retryIndex}` : "no")}</code>
        </div>
      </details>

      <div class="je-debug-actions">
        <button type="button" data-je-debug-refresh>Actualizar datos</button>
        <button type="button" data-je-debug-sync>Forzar sync</button>
        <button type="button" data-je-debug-reload>Recargar página</button>
      </div>
    `;

    const style = document.createElement("style");
    style.id = "javieats-debug-style";
    style.textContent = `
      #${PANEL_ID}{position:fixed;z-index:2147483000;right:max(12px,env(safe-area-inset-right));bottom:max(12px,env(safe-area-inset-bottom));width:min(440px,calc(100vw - 24px));max-height:min(82dvh,740px);overflow:auto;padding:16px;border:1px solid rgba(17,17,17,.12);border-radius:22px;background:rgba(255,255,255,.97);color:#111;box-shadow:0 22px 60px rgba(0,0,0,.24);font:13px/1.35 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
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
      #${PANEL_ID} .je-debug-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}
      #${PANEL_ID} .je-debug-actions button{min-height:40px;border:0;border-radius:12px;background:#111;color:#fff;font-weight:850;cursor:pointer;padding:8px}
      @media(max-width:430px){#${PANEL_ID} .je-debug-actions{grid-template-columns:1fr}}
    `;

    document.getElementById("javieats-debug-style")?.remove();
    document.head.appendChild(style);
    document.body.appendChild(panel);

    panel.querySelector("[data-je-debug-close]")?.addEventListener("click", () => panel.remove());
    panel.querySelector("[data-je-debug-refresh]")?.addEventListener("click", render);
    panel.querySelector("[data-je-debug-sync]")?.addEventListener("click", async () => {
      await window.JaviEatsSync?.run?.({ silent: false, reason: "debug" });
      render().catch(() => {});
    });
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

  ["javieats:data", "javieats:sync-diagnostics"].forEach(eventName => {
    window.addEventListener(eventName, () => {
      if (document.getElementById(PANEL_ID)) render().catch(() => {});
    });
  });
})();