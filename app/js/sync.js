(() => {
  "use strict";

  const INTERVAL_MS = 60_000;
  const RETRY_DELAYS = [2000, 5000, 10000];

  let timer = null;
  let inFlight = null;
  let retryTimer = null;
  let retryIndex = 0;
  let bound = false;
  let lastStartedAt = null;
  let lastFinishedAt = null;
  let lastDurationMs = null;
  let lastReason = null;
  let lastOk = null;
  let lastFailures = [];

  const app = () => window.JaviEatsApp;
  const $ = id => document.getElementById(id);

  function ready() {
    return Boolean(app()?.isReady?.() && app()?.getUser?.() && app()?.getClient?.());
  }

  function currentTimeLabel() {
    return new Intl.DateTimeFormat("es-ES", {
      timeZone: "Europe/Madrid",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date());
  }

  function setStatus(type, text) {
    const status = $("sync-status");
    if (!status) return;
    status.textContent = text;
    status.classList.toggle("is-loading", type === "loading");
    status.classList.toggle("is-error", type === "error");
  }

  function cancelRetry() {
    if (retryTimer) window.clearTimeout(retryTimer);
    retryTimer = null;
  }

  function scheduleRetry(reason = "retry") {
    cancelRetry();
    if (!ready() || retryIndex >= RETRY_DELAYS.length) return;

    const delayMs = RETRY_DELAYS[retryIndex];
    retryIndex += 1;

    retryTimer = window.setTimeout(() => {
      retryTimer = null;
      if (!ready() || document.hidden) return;
      run({ silent: true, reason });
    }, delayMs);
  }

  async function run({ silent = false, reason = "normal" } = {}) {
    if (!ready()) return;
    if (inFlight) return inFlight;

    const startedAtMs = Date.now();
    lastStartedAt = new Date(startedAtMs).toISOString();
    lastReason = reason;

    if (navigator.onLine === false) {
      lastFinishedAt = new Date().toISOString();
      lastDurationMs = Date.now() - startedAtMs;
      lastOk = false;
      lastFailures = ["offline"];
      setStatus("error", "Sin conexión · reintentando…");
      return { ok: false, failures: ["offline"] };
    }

    if (!silent || reason === "manual" || reason === "online") {
      setStatus("loading", "Sincronizando…");
    }

    inFlight = Promise.resolve()
      .then(() => app()?.runDataSync?.({ silent, reason }))
      .then(result => {
        const normalized = result || { ok: true, failures: [] };
        const failures = Array.isArray(normalized.failures) ? normalized.failures : [];

        if (!failures.length && normalized.ok !== false) {
          retryIndex = 0;
          cancelRetry();
          lastOk = true;
          lastFailures = [];
          setStatus("ok", `Sincronizado · ${currentTimeLabel()}`);
          return { ...normalized, ok: true, failures: [] };
        }

        lastOk = false;
        lastFailures = [...failures];
        setStatus("error", "Sincronización parcial · reintentando…");
        scheduleRetry("partial");
        return { ...normalized, ok: false, failures };
      })
      .catch(error => {
        console.error("JaviEats 3.3.6: error de sincronización", error);
        setStatus(
          "error",
          navigator.onLine === false
            ? "Sin conexión · reintentando…"
            : "Error de sincronización · reintentando…"
        );
        lastOk = false;
        lastFailures = ["sync"];
        scheduleRetry("error");
        if (!silent) {
          app()?.showToast?.("No se han podido cargar todos los datos. JaviEats volverá a intentarlo.");
        }
        return { ok: false, failures: ["sync"] };
      })
      .finally(() => {
        lastFinishedAt = new Date().toISOString();
        lastDurationMs = Date.now() - startedAtMs;
        inFlight = null;
        window.dispatchEvent(new CustomEvent("javieats:sync-diagnostics"));
      });

    return inFlight;
  }

  function start() {
    stopTimer();
    timer = window.setInterval(() => {
      if (!document.hidden && ready()) run({ silent: true });
    }, INTERVAL_MS);
  }

  function stopTimer() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  function reset() {
    stopTimer();
    cancelRetry();
    retryIndex = 0;
    inFlight = null;
    lastStartedAt = null;
    lastFinishedAt = null;
    lastDurationMs = null;
    lastReason = null;
    lastOk = null;
    lastFailures = [];
    setStatus("", "");
  }

  function bindUI() {
    if (bound) return;
    bound = true;

    const status = $("sync-status");
    if (status) {
      status.setAttribute("role", "button");
      status.setAttribute("tabindex", "0");
      status.setAttribute("title", "Actualizar ahora");
      status.setAttribute("aria-label", "Estado de sincronización. Pulsa para actualizar ahora.");

      const refreshNow = () => run({ silent: false, reason: "manual" });
      status.addEventListener("click", refreshNow);
      status.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          refreshNow();
        }
      });
    }

    window.addEventListener("online", () => {
      retryIndex = 0;
      cancelRetry();
      if (ready()) {
        window.setTimeout(() => run({ silent: false, reason: "online" }), 250);
      }
    });

    window.addEventListener("offline", () => {
      if (ready()) setStatus("error", "Sin conexión · reintentando…");
    });

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && ready()) {
        window.setTimeout(() => run({ silent: true, reason: "resume" }), 450);
      }
    });

    window.addEventListener("pageshow", event => {
      if (event.persisted && ready()) {
        window.setTimeout(() => run({ silent: true, reason: "pageshow" }), 250);
      }
    });
  }

  function getDiagnostics() {
    return {
      lastStartedAt,
      lastFinishedAt,
      lastDurationMs,
      lastReason,
      lastOk,
      lastFailures: [...lastFailures],
      inFlight: Boolean(inFlight),
      retryIndex,
      retryScheduled: Boolean(retryTimer)
    };
  }

  window.JaviEatsSync = Object.freeze({
    bindUI,
    run,
    start,
    reset,
    setStatus,
    getDiagnostics
  });
})();