/* JaviEats 3.1 - Pulido funcional
   Catalogo ampliado, sincronizacion resistente, exportacion ICS,
   limpieza funcional de Formspree y mejoras de UX.
*/

(() => {
  "use strict";

  if (window.__JAVIEATS_V31_LOADED__) return;
  window.__JAVIEATS_V31_LOADED__ = true;

  const APP = () => window.JaviEatsApp;
  const $ = id => document.getElementById(id);

  const NEW_SERVICES = [
    {
      id: "tomar-algo",
      icon: "☕",
      title: "Tomar algo",
      category: "Salir un rato",
      description: "Cafe, merienda, refresco o tardeo para salir un rato juntos sin montar un plan enorme.",
      eta: "45 min-2 h",
      durations: ["Cafe rapido", "Merienda", "Tardeo", "Sin prisa"],
      bullets: [
        "Perfecto para improvisar sin organizar demasiado.",
        "Puede ser cafe, merienda, refresco o unas tapas.",
        "El sitio se decide entre los dos."
      ],
      notePlaceholder: "Ej: me apetece merendar, tomar un cafe, ir de tardeo..."
    },
    {
      id: "comer-cenar",
      icon: "🍽️",
      title: "Ir a comer / cenar",
      category: "Comer fuera",
      description: "Una comida o cena juntos donde lo importante es salir a comer fuera, sin limitar el plan al sushi.",
      eta: "1-3 h",
      durations: ["Comida", "Cena", "Comer + paseo", "Cena + algo despues"],
      bullets: [
        "Restaurante, bar, terraza o sitio nuevo por descubrir.",
        "La cocina y el presupuesto se hablan entre los dos.",
        "Se puede completar con paseo, postre o algo despues."
      ],
      notePlaceholder: "Ej: italiana, hamburguesas, terraza, quiero probar un sitio nuevo..."
    }
  ];

  const RETRY_DELAYS = [2000, 5000, 10000];
  let syncInFlight = null;
  let syncRetryTimer = null;
  let syncRetryIndex = 0;
  let decorationObserver = null;
  let ySiObserver = null;

  function installStyles() {
    if ($("javieats-v31-styles")) return;
    const style = document.createElement("style");
    style.id = "javieats-v31-styles";
    style.textContent = `
      .javieats-v3 .v31-catalog-hint {
        display:flex;
        align-items:center;
        gap:6px;
        margin:-2px 0 8px;
        color:#948a82;
        font-size:.69rem;
        font-weight:800;
      }

      .javieats-v3 .v3-catalog-grid {
        cursor:grab;
        overscroll-behavior-inline:contain;
        -webkit-overflow-scrolling:touch;
        scroll-padding-inline:2px 28px;
      }

      .javieats-v3 .v3-catalog-grid.is-dragging {
        cursor:grabbing;
        scroll-snap-type:none;
        user-select:none;
      }

      .javieats-v3 .v3-catalog-grid.is-dragging * {
        pointer-events:none;
      }

      .javieats-v3 .v3-catalog-grid::after {
        content:"";
        flex:0 0 18px;
      }

      .javieats-v3 .v31-calendar-btn {
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:7px;
        min-height:38px;
        border:1px solid rgba(232,93,69,.18);
        border-radius:14px;
        padding:8px 12px;
        background:#fff8f4;
        color:#ba4937;
        font:inherit;
        font-size:.74rem;
        font-weight:900;
        cursor:pointer;
        box-shadow:0 5px 14px rgba(92,55,45,.055);
      }

      .javieats-v3 .v31-calendar-btn:active {
        transform:scale(.98);
      }

      .javieats-v3 .v3-next-plan-card .v31-calendar-btn {
        grid-column:2 / -1;
        justify-self:start;
        margin-top:4px;
      }

      .javieats-v3 .booking-actions .v31-calendar-btn {
        width:auto;
      }

      .javieats-v3 .sync-status.v31-sync-action {
        cursor:pointer;
        border-radius:8px;
        outline:none;
      }

      .javieats-v3 .sync-status.v31-sync-action:focus-visible {
        box-shadow:0 0 0 3px rgba(232,93,69,.17);
      }

      @media (max-width:520px) {
        .javieats-v3 .v3-catalog-card {
          flex-basis:min(74vw,210px);
        }
        .javieats-v3 .v31-catalog-hint {
          padding-right:8px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function installNewServices() {
    if (typeof SERVICES === "undefined" || !Array.isArray(SERVICES)) return;

    const missing = NEW_SERVICES.filter(item => !SERVICES.some(service => service.id === item.id));
    if (!missing.length) return;

    const insertAt = SERVICES.findIndex(service => service.id === "plan-diferente");
    if (insertAt >= 0) SERVICES.splice(insertAt, 0, ...missing);
    else SERVICES.push(...missing);

    if (typeof renderServices === "function") renderServices();
    window.dispatchEvent(new CustomEvent("javieats:data"));
  }

  function disableLegacyFormspree() {
    try {
      if (typeof CONFIG !== "undefined" && CONFIG) {
        delete CONFIG.formspreeEndpoint;
        delete CONFIG.emailDestino;
      }
      if (typeof sendProposalByEmail === "function") {
        sendProposalByEmail = async () => ({ disabled: true, reason: "JaviEats 3.1 uses internal notifications and Push." });
      }
    } catch (error) {
      console.warn("JaviEats 3.1: no se pudo retirar Formspree en runtime.", error);
    }
  }

  function removeDailyMessageLegacyUI() {
    ["daily-message-card", "daily-message-compose-modal", "daily-message-reveal-modal"].forEach(id => {
      const element = $(id);
      if (element) element.remove();
    });
    try {
      if (typeof state !== "undefined" && state) {
        state.dailyMessage = null;
        state.dailyMessageLoadError = false;
      }
    } catch (_) {}
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
    if (typeof currentUser === "undefined" || typeof supabaseClient === "undefined" || !currentUser || !supabaseClient) return;
    if (syncInFlight) return syncInFlight;

    if (navigator.onLine === false) {
      if (typeof setSyncState === "function") setSyncState("error", "Sin conexion · reintentando…");
      scheduleRetry("offline");
      return;
    }

    syncInFlight = (async () => {
      if (typeof setSyncState === "function" && (!silent || reason === "manual" || reason === "online")) {
        setSyncState("loading", "Sincronizando…");
      }

      const today = typeof toDateKeyMadrid === "function" ? toDateKeyMadrid(new Date()) : new Date().toISOString().slice(0, 10);
      const jobs = [];
      const add = (key, fn) => { if (typeof fn === "function") jobs.push({ key, run: fn }); };

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
        state.remoteMemories = Array.isArray(memories.value.memories) ? memories.value.memories : state.remoteMemories;
        state.memoryLoadError = Boolean(memories.value.loadError);
      } else if (failures.includes("memories")) {
        state.memoryLoadError = true;
      }

      const notifications = settledValue(results, jobs, "notifications");
      if (notifications.ok && notifications.value) {
        state.notifications = Array.isArray(notifications.value.notifications) ? notifications.value.notifications : state.notifications;
        state.notificationLoadError = Boolean(notifications.value.loadError);
      } else if (failures.includes("notifications")) {
        state.notificationLoadError = true;
      }

      state.dailyMessage = null;
      state.dailyMessageLoadError = false;

      if (typeof refreshUI === "function") refreshUI();
      if (typeof maybeRevealYSiResult === "function") maybeRevealYSiResult();

      if (!failures.length) {
        syncRetryIndex = 0;
        cancelRetry();
        if (typeof setSyncState === "function") {
          const stamp = typeof currentTimeLabel === "function" ? currentTimeLabel() : new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
          setSyncState("ok", `Sincronizado · ${stamp}`);
        }
      } else {
        if (typeof setSyncState === "function") setSyncState("error", "Sincronizacion parcial · reintentando…");
        scheduleRetry("partial");
      }

      window.dispatchEvent(new CustomEvent("javieats:v31-sync", { detail: { ok: !failures.length, failures, reason } }));
      return { ok: !failures.length, failures };
    })().catch(error => {
      console.error("JaviEats 3.1: error de sincronizacion", error);
      if (typeof setSyncState === "function") {
        setSyncState("error", navigator.onLine === false ? "Sin conexion · reintentando…" : "Error de sincronizacion · reintentando…");
      }
      scheduleRetry("error");
      return { ok: false, failures: ["sync"] };
    }).finally(() => {
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
      status.setAttribute("aria-label", "Estado de sincronizacion. Pulsa para actualizar ahora.");
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
      if (typeof setSyncState === "function") setSyncState("error", "Sin conexion · reintentando…");
      scheduleRetry("offline");
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) return;
      window.setTimeout(() => loadAllDataV31({ silent: true, reason: "resume" }), 900);
    });

    window.addEventListener("pageshow", event => {
      if (event.persisted) window.setTimeout(() => loadAllDataV31({ silent: true, reason: "pageshow" }), 250);
    });

    window.setTimeout(() => {
      if (typeof appReady !== "undefined" && appReady && typeof currentUser !== "undefined" && currentUser) {
        loadAllDataV31({ silent: true, reason: "v31-mount" });
      }
    }, 1500);
  }

  function enhanceCatalog() {
    const grid = $("v3-catalog-grid");
    if (!grid) return;

    const section = grid.closest(".v3-catalog");
    if (section && !section.querySelector(".v31-catalog-hint")) {
      const hint = document.createElement("div");
      hint.className = "v31-catalog-hint";
      hint.innerHTML = "<span aria-hidden=\"true\">↔️</span><span>Desliza para ver mas planes</span>";
      grid.before(hint);
    }

    if (grid.dataset.v31DragBound === "true") return;
    grid.dataset.v31DragBound = "true";

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    grid.addEventListener("pointerdown", event => {
      if (event.pointerType !== "mouse") return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startScroll = grid.scrollLeft;
      grid.classList.add("is-dragging");
      grid.setPointerCapture?.(event.pointerId);
    });

    grid.addEventListener("pointermove", event => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 5) moved = true;
      grid.scrollLeft = startScroll - delta;
    });

    const endDrag = event => {
      if (!dragging) return;
      dragging = false;
      grid.classList.remove("is-dragging");
      try { grid.releasePointerCapture?.(event.pointerId); } catch (_) {}
      window.setTimeout(() => { moved = false; }, 0);
    };

    grid.addEventListener("pointerup", endDrag);
    grid.addEventListener("pointercancel", endDrag);
    grid.addEventListener("click", event => {
      if (!moved) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  }

  function escapeIcs(value) {
    return String(value ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/\r?\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
  }

  function compactDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}${m}${d}`;
  }

  function compactDateTime(date) {
    return `${compactDate(date)}T${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}00`;
  }

  function utcStamp(date = new Date()) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  }

  function estimateMinutes(duration) {
    const text = String(duration || "").toLowerCase();
    const minute = text.match(/(\d+)\s*min/);
    if (minute) return Math.max(15, Number(minute[1]));
    const hourRange = text.match(/(\d+)\s*-\s*(\d+)\s*h/);
    if (hourRange) return Number(hourRange[2]) * 60;
    const hour = text.match(/(\d+)\s*h/);
    if (hour) return Number(hour[1]) * 60;
    if (text.includes("cine") && text.includes("cena")) return 240;
    if (text.includes("cine")) return 180;
    if (text.includes("comida") || text.includes("cena")) return 120;
    if (text.includes("tarde")) return 180;
    if (text.includes("rapida") || text.includes("rapido")) return 60;
    return 120;
  }

  function addDays(date, days) {
    const copy = new Date(date.getTime());
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  function buildIcs(plan) {
    const dateParts = String(plan.plan_date || "").split("-").map(Number);
    if (dateParts.length !== 3 || dateParts.some(n => !Number.isFinite(n))) throw new Error("El plan no tiene una fecha valida.");

    const baseDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], 12, 0, 0, 0);
    const title = `${plan.service_icon || "📌"} ${plan.service_title || "Plan JaviEats"}`.trim();
    const descriptionParts = [];
    if (plan.note) descriptionParts.push(plan.note);
    if (plan.duration) descriptionParts.push(`Duracion: ${plan.duration}`);
    if (plan.priority && plan.entry_type !== "custom") descriptionParts.push(`Ganas: ${plan.priority}`);
    descriptionParts.push("Creado desde JaviEats ❤️");

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//JaviEats//JaviEats 3.1//ES",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-TIMEZONE:Europe/Madrid",
      "BEGIN:VEVENT",
      `UID:${escapeIcs(plan.id || `${plan.plan_date}-${plan.service_title}`)}@javieats`,
      `DTSTAMP:${utcStamp()}`,
      `SUMMARY:${escapeIcs(title)}`
    ];

    if (plan.is_all_day || !plan.plan_time) {
      lines.push(`DTSTART;VALUE=DATE:${compactDate(baseDate)}`);
      lines.push(`DTEND;VALUE=DATE:${compactDate(addDays(baseDate, 1))}`);
    } else {
      const [hours, minutes] = String(plan.plan_time).split(":").map(Number);
      const start = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], Number.isFinite(hours) ? hours : 12, Number.isFinite(minutes) ? minutes : 0, 0, 0);
      const end = new Date(start.getTime() + estimateMinutes(plan.duration) * 60000);
      lines.push(`DTSTART:${compactDateTime(start)}`);
      lines.push(`DTEND:${compactDateTime(end)}`);
    }

    lines.push(`DESCRIPTION:${escapeIcs(descriptionParts.join("\n\n"))}`);
    lines.push("STATUS:CONFIRMED");
    lines.push("END:VEVENT");
    lines.push("END:VCALENDAR");
    return `${lines.join("\r\n")}\r\n`;
  }

  function slug(value) {
    return String(value || "plan")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "plan";
  }

  function exportPlanToCalendar(id) {
    const proposals = APP()?.getState?.()?.proposals || [];
    const plan = proposals.find(item => String(item.id) === String(id));
    if (!plan) return APP()?.showToast?.("No encuentro ese plan. Actualiza JaviEats y prueba otra vez.");
    if (plan.status !== "confirmada" && plan.entry_type !== "custom") {
      return APP()?.showToast?.("Solo se pueden anadir al calendario los planes confirmados.");
    }

    try {
      const ics = buildIcs(plan);
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent || "") || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      anchor.href = url;
      anchor.rel = "noopener";
      if (isIOS) anchor.target = "_blank";
      else anchor.download = `JaviEats-${slug(plan.service_title)}.ics`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      APP()?.showToast?.("Calendario preparado 📅");
    } catch (error) {
      console.error(error);
      APP()?.showToast?.(error?.message || "No se ha podido preparar el calendario.");
    }
  }

  function decorateCalendarButtons() {
    const proposals = APP()?.getState?.()?.proposals || [];

    document.querySelectorAll(".v3-next-plan-card").forEach(card => {
      if (card.querySelector("[data-v31-calendar]")) return;
      const edit = card.querySelector("[data-v3-edit]");
      const id = edit?.dataset?.v3Edit;
      if (!id) return;
      const plan = proposals.find(item => String(item.id) === String(id));
      if (!plan || plan.status !== "confirmada") return;
      card.insertAdjacentHTML("beforeend", `<button class="v31-calendar-btn" type="button" data-v31-calendar="${String(id).replace(/\"/g, "")}">📅 Anadir al calendario</button>`);
    });

    document.querySelectorAll(".booking-card").forEach(card => {
      if (card.querySelector("[data-v31-calendar]")) return;
      const idNode = card.querySelector("[data-proposal-id]");
      const id = idNode?.dataset?.proposalId;
      if (!id) return;
      const plan = proposals.find(item => String(item.id) === String(id));
      if (!plan || (plan.status !== "confirmada" && plan.entry_type !== "custom")) return;
      const actions = card.querySelector(".booking-actions");
      if (!actions) return;
      actions.insertAdjacentHTML("afterbegin", `<button class="v31-calendar-btn" type="button" data-v31-calendar="${String(id).replace(/\"/g, "")}">📅 Anadir al calendario</button>`);
    });
  }

  function patchYSiCopy() {
    const note = $("y-si-status-note");
    if (!note) return;
    const text = note.textContent || "";
    if (!text.includes("recibira un correo") && !text.includes("recibirá un correo")) return;
    const role = APP()?.getRole?.();
    const other = role === "javi" ? "Laura" : "Javi";
    note.textContent = `Tu respuesta esta guardada. JaviEats avisara a ${other} por Push si lo tiene activo; si no, usara el correo de turno.`;
  }

  function watchYSiCopy() {
    const note = $("y-si-status-note");
    if (!note || ySiObserver) return;
    ySiObserver = new MutationObserver(() => patchYSiCopy());
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
        history.replaceState({}, "", `${location.pathname}${query ? `?${query}` : ""}${location.hash}`);
        window.setTimeout(() => $("v3-plan-pending")?.scrollIntoView?.({ behavior: "smooth", block: "start" }), 160);
        return;
      }
      if (tries < 30) window.setTimeout(go, 100);
    };
    go();
  }

  function decorate() {
    enhanceCatalog();
    decorateCalendarButtons();
    watchYSiCopy();
    patchYSiCopy();
  }

  function bindEvents() {
    document.addEventListener("click", event => {
      const calendar = event.target.closest("[data-v31-calendar]");
      if (calendar) {
        event.preventDefault();
        event.stopPropagation();
        exportPlanToCalendar(calendar.dataset.v31Calendar);
      }
    });

    window.addEventListener("javieats:data", () => window.setTimeout(decorate, 0));
    window.addEventListener("javieats:v31-sync", () => window.setTimeout(decorate, 0));

    decorationObserver = new MutationObserver(() => {
      window.requestAnimationFrame(decorate);
    });
    decorationObserver.observe(document.body, { childList: true, subtree: true });
  }

  function mount() {
    installStyles();
    disableLegacyFormspree();
    removeDailyMessageLegacyUI();
    installNewServices();
    patchSynchronization();
    bindEvents();
    decorate();
    handleDeepLink();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();
