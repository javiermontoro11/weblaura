/* JaviEats 3.1 - Estabilidad y enlaces directos
   Capa pequena de compatibilidad para la 3.1 reducida:
   - sincronizacion resistente
   - recuperacion online / foreground
   - enlace directo a Planes
   - texto real de aviso de turno de ¿Y si...?

   Las mejoras no prioritarias (catalogo 10, ICS, drag, limpieza legacy profunda)
   quedan aplazadas a JaviEats 3.3.
*/

(() => {
  "use strict";

  if (window.__JAVIEATS_V31_LOADED__) return;
  window.__JAVIEATS_V31_LOADED__ = true;

  const APP = () => window.JaviEatsApp;
  const $ = id => document.getElementById(id);
  const RETRY_DELAYS = [2000, 5000, 10000];

  let syncInFlight = null;
  let syncRetryTimer = null;
  let syncRetryIndex = 0;
  let ySiObserver = null;

  function installStyles() {
    if ($("javieats-v31-styles")) return;
    const style = document.createElement("style");
    style.id = "javieats-v31-styles";
    style.textContent = `
      .javieats-v3 .sync-status.v31-sync-action {
        cursor:pointer;
        border-radius:8px;
        outline:none;
      }

      .javieats-v3 .sync-status.v31-sync-action:focus-visible {
        box-shadow:0 0 0 3px rgba(232,93,69,.17);
      }
    `;
    document.head.appendChild(style);
  }

  function disableLegacyFormspree() {
    try {
      if (typeof CONFIG !== "undefined" && CONFIG) {
        delete CONFIG.formspreeEndpoint;
        delete CONFIG.emailDestino;
      }
      if (typeof sendProposalByEmail === "function") {
        sendProposalByEmail = async () => ({
          disabled: true,
          reason: "JaviEats usa Actividad y Push para las propuestas."
        });
      }
    } catch (error) {
      console.warn("JaviEats 3.1: no se pudo neutralizar Formspree.", error);
    }
  }

  function cancelRetry() {
    if (syncRetryTimer) window.clearTimeout(syncRetryTimer);
    syncRetryTimer = null;
  }

  function scheduleRetry(reason = "retry") {
    cancelRetry();
    if (syncRetryIndex >= RETRY_DELAYS.length) return;

    const delay = RETRY_DELAYS[syncRetryIndex++];
    syncRetryTimer = window.setTimeout(() => {
      syncRetryTimer = null;
      if (document.hidden) return scheduleRetry(reason);
      if (typeof currentUser === "undefined" || !currentUser) return;
      loadAllData({ silent: true, reason });
    }, delay);
  }

  function settledValue(results, jobs, key) {
    const index = jobs.findIndex(job => job.key === key);
    if (index < 0) return { ok: false, value: undefined };
    const result = results[index];
    return result?.status === "fulfilled"
      ? { ok: true, value: result.value }
      : { ok: false, value: undefined, error: result?.reason };
  }

  async function loadAllDataV31({ silent = false, reason = "normal" } = {}) {
    if (
      typeof currentUser === "undefined" ||
      typeof supabaseClient === "undefined" ||
      !currentUser ||
      !supabaseClient
    ) return;

    if (syncInFlight) return syncInFlight;

    if (navigator.onLine === false) {
      if (typeof setSyncState === "function") {
        setSyncState("error", "Sin conexión · reintentando…");
      }
      scheduleRetry("offline");
      return;
    }

    syncInFlight = (async () => {
      if (
        typeof setSyncState === "function" &&
        (!silent || reason === "manual" || reason === "online")
      ) {
        setSyncState("loading", "Sincronizando…");
      }

      const today = typeof toDateKeyMadrid === "function"
        ? toDateKeyMadrid(new Date())
        : new Date().toISOString().slice(0, 10);

      const jobs = [];
      const add = (key, fn) => {
        if (typeof fn === "function") jobs.push({ key, run: fn });
      };

      add("proposals", typeof fetchProposals === "function" ? () => fetchProposals() : null);
      add("vouchers", typeof fetchVouchers === "function" ? () => fetchVouchers() : null);
      add("game", typeof fetchTodayGame === "function" ? () => fetchTodayGame(today) : null);
      add("puzzle", typeof fetchPuzzleProgress === "function" ? () => fetchPuzzleProgress() : null);
      add("ysiCurrent", typeof fetchYSiCurrent === "function" ? () => fetchYSiCurrent() : null);
      add("ysiHistory", typeof fetchYSiHistory === "function" ? () => fetchYSiHistory() : null);
      add("memories", typeof fetchRemoteMemories === "function" ? () => fetchRemoteMemories() : null);
      add("notifications", typeof fetchNotifications === "function" ? () => fetchNotifications() : null);

      const results = await Promise.allSettled(jobs.map(job => job.run()));
      const failures = [];

      results.forEach((result, index) => {
        if (result.status === "rejected") {
          failures.push(jobs[index].key);
          console.error(`JaviEats 3.1: fallo parcial en ${jobs[index].key}`, result.reason);
        }
      });

      const proposals = settledValue(results, jobs, "proposals");
      if (proposals.ok && Array.isArray(proposals.value)) state.proposals = proposals.value;

      const vouchers = settledValue(results, jobs, "vouchers");
      if (vouchers.ok && Array.isArray(vouchers.value)) state.vouchers = vouchers.value;

      const game = settledValue(results, jobs, "game");
      if (game.ok && game.value) {
        dailyGame = game.value.game || null;
        dailyRounds = Array.isArray(game.value.rounds) ? game.value.rounds : [];
      }

      const puzzle = settledValue(results, jobs, "puzzle");
      if (puzzle.ok && puzzle.value) {
        state.puzzle = puzzle.value.puzzle || null;
        state.puzzlePieces = Array.isArray(puzzle.value.pieces) ? puzzle.value.pieces : [];
        state.puzzleLoadError = Boolean(puzzle.value.loadError);
      } else if (failures.includes("puzzle")) {
        state.puzzleLoadError = true;
      }

      const ysiCurrent = settledValue(results, jobs, "ysiCurrent");
      if (ysiCurrent.ok) state.ySiCurrent = ysiCurrent.value || null;

      const ysiHistory = settledValue(results, jobs, "ysiHistory");
      if (ysiHistory.ok && Array.isArray(ysiHistory.value)) state.ySiHistory = ysiHistory.value;
      state.ySiLoadError = failures.includes("ysiCurrent") || failures.includes("ysiHistory");

      if (typeof getTodayLatestYSiResult === "function" && Array.isArray(state.ySiHistory)) {
        state.ySiLastResult = getTodayLatestYSiResult(state.ySiHistory);
      }

      const memories = settledValue(results, jobs, "memories");
      if (memories.ok && memories.value) {
        state.remoteMemories = Array.isArray(memories.value.memories)
          ? memories.value.memories
          : state.remoteMemories;
        state.memoryLoadError = Boolean(memories.value.loadError);
      } else if (failures.includes("memories")) {
        state.memoryLoadError = true;
      }

      const notifications = settledValue(results, jobs, "notifications");
      if (notifications.ok && notifications.value) {
        state.notifications = Array.isArray(notifications.value.notifications)
          ? notifications.value.notifications
          : state.notifications;
        state.notificationLoadError = Boolean(notifications.value.loadError);
      } else if (failures.includes("notifications")) {
        state.notificationLoadError = true;
      }

      if (typeof refreshUI === "function") refreshUI();
      if (typeof maybeRevealYSiResult === "function") maybeRevealYSiResult();

      if (!failures.length) {
        syncRetryIndex = 0;
        cancelRetry();

        if (typeof setSyncState === "function") {
          const stamp = typeof currentTimeLabel === "function"
            ? currentTimeLabel()
            : new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
          setSyncState("ok", `Sincronizado · ${stamp}`);
        }
      } else {
        if (typeof setSyncState === "function") {
          setSyncState("error", "Sincronización parcial · reintentando…");
        }
        scheduleRetry("partial");
      }

      window.dispatchEvent(new CustomEvent("javieats:v31-sync", {
        detail: { ok: !failures.length, failures, reason }
      }));

      return { ok: !failures.length, failures };
    })()
      .catch(error => {
        console.error("JaviEats 3.1: error de sincronización", error);

        if (typeof setSyncState === "function") {
          setSyncState(
            "error",
            navigator.onLine === false
              ? "Sin conexión · reintentando…"
              : "Error de sincronización · reintentando…"
          );
        }

        scheduleRetry("error");
        return { ok: false, failures: ["sync"] };
      })
      .finally(() => {
        syncInFlight = null;
      });

    return syncInFlight;
  }

  function patchSynchronization() {
    if (window.__JAVIEATS_V31_SYNC_PATCHED__) return;
    if (typeof loadAllData !== "function") return;

    window.__JAVIEATS_V31_SYNC_PATCHED__ = true;
    loadAllData = loadAllDataV31;

    const status = $("sync-status");
    if (status) {
      status.classList.add("v31-sync-action");
      status.setAttribute("role", "button");
      status.setAttribute("tabindex", "0");
      status.setAttribute("title", "Actualizar ahora");
      status.setAttribute("aria-label", "Estado de sincronización. Pulsa para actualizar ahora.");

      const refreshNow = () => loadAllDataV31({ silent: false, reason: "manual" });
      status.addEventListener("click", refreshNow);
      status.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          refreshNow();
        }
      });
    }

    window.addEventListener("online", () => {
      syncRetryIndex = 0;
      cancelRetry();
      window.setTimeout(() => loadAllDataV31({ silent: false, reason: "online" }), 250);
    });

    window.addEventListener("offline", () => {
      if (typeof setSyncState === "function") {
        setSyncState("error", "Sin conexión · reintentando…");
      }
      scheduleRetry("offline");
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) return;
      window.setTimeout(() => loadAllDataV31({ silent: true, reason: "resume" }), 900);
    });

    window.addEventListener("pageshow", event => {
      if (event.persisted) {
        window.setTimeout(() => loadAllDataV31({ silent: true, reason: "pageshow" }), 250);
      }
    });

    window.setTimeout(() => {
      if (
        typeof appReady !== "undefined" &&
        appReady &&
        typeof currentUser !== "undefined" &&
        currentUser
      ) {
        loadAllDataV31({ silent: true, reason: "v31-mount" });
      }
    }, 1500);
  }

  function patchYSiCopy() {
    const note = $("y-si-status-note");
    if (!note) return;

    const text = note.textContent || "";
    if (!text.includes("recibira un correo") && !text.includes("recibirá un correo")) return;

    const role = APP()?.getRole?.();
    const other = role === "javi" ? "Laura" : "Javi";
    note.textContent = `Tu respuesta está guardada. JaviEats avisará a ${other} por Push si lo tiene activo; si no, usará el correo de turno.`;
  }

  function watchYSiCopy() {
    const note = $("y-si-status-note");
    if (!note || ySiObserver) return;

    ySiObserver = new MutationObserver(patchYSiCopy);
    ySiObserver.observe(note, { childList: true, characterData: true, subtree: true });
    patchYSiCopy();
  }

  function handleDeepLink() {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("open");
    if (requested !== "plans" && requested !== "calendar") return;

    let tries = 0;
    const go = () => {
      tries += 1;

      if (APP()?.showPage && $("page-calendar")) {
        APP().showPage("calendar");
        params.delete("open");

        const query = params.toString();
        history.replaceState(
          {},
          "",
          `${location.pathname}${query ? `?${query}` : ""}${location.hash}`
        );

        window.setTimeout(() => {
          $("v3-plan-pending")?.scrollIntoView?.({ behavior: "smooth", block: "start" });
        }, 160);
        return;
      }

      if (tries < 30) window.setTimeout(go, 100);
    };

    go();
  }

  function mount() {
    installStyles();
    disableLegacyFormspree();
    patchSynchronization();
    watchYSiCopy();
    handleDeepLink();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
