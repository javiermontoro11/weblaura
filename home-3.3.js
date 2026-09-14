(() => {
  "use strict";

  const STYLE_ID = "javieats-home-33-css";
  const ROOT_ID = "v33-home-actions";
  let bound = false;

  const app = () => window.JaviEatsApp;
  const state = () => app()?.getState?.() || {};

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const link = document.createElement("link");
    link.id = STYLE_ID;
    link.rel = "stylesheet";
    link.href = "home-3.3.css?v=3.3";
    document.head.appendChild(link);
  }

  function planDate(plan) {
    if (!plan?.plan_date) return null;
    const time = plan.is_all_day ? "12:00" : String(plan.plan_time || "12:00").slice(0, 5);
    const date = new Date(`${plan.plan_date}T${time}:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function upcomingPlans() {
    const now = new Date();
    return (state().proposals || [])
      .filter(plan => plan.status === "confirmada")
      .filter(plan => {
        const date = planDate(plan);
        return date && date >= now;
      });
  }

  function pendingIncoming() {
    const uid = app()?.getUser?.()?.id;
    return (state().proposals || []).filter(plan => plan.status === "pendiente" && plan.created_by !== uid);
  }

  function memoryCount() {
    const remote = Array.isArray(state().remoteMemories) ? state().remoteMemories.length : 0;
    const legacyMemories = app()?.getStaticMemories?.();
    const legacy = Array.isArray(legacyMemories) ? legacyMemories.length : 0;
    return remote + legacy;
  }

  function ysiStatus() {
    const current = state().ySiCurrent;
    if (!current) return "Listo para jugar";
    if (current.limite_alcanzado) return "5/5 completadas";

    const role = app()?.getRole?.();
    const otherAnswered = role === "laura"
      ? Boolean(current.javi_ha_respondido)
      : Boolean(current.laura_ha_respondido);

    if (!current.mi_respuesta && otherAnswered) return "Te toca ahora";

    const position = Number(current.posicion_dia) || Math.min(5, Number(current.completadas_hoy || 0) + 1);
    return `${Math.max(1, Math.min(5, position))}/5 hoy`;
  }

  function mount() {
    ensureStyles();
    const home = document.getElementById("page-home");
    const main = document.getElementById("v3-home-main");
    if (!home || !main || !app()) return false;

    if (!document.getElementById(ROOT_ID)) {
      main.insertAdjacentHTML("afterend", `
        <section class="v3-section v33-home-actions" id="${ROOT_ID}" aria-label="Accesos rápidos de JaviEats">
          <div class="v3-block-title v33-home-actions-title">
            <div>
              <p class="v3-eyebrow">A mano</p>
              <h3>Lo útil, en un toque</h3>
            </div>
          </div>
          <div class="v33-home-actions-grid">
            <button class="v33-home-action v33-home-action-plan" type="button" data-v33-plan>
              <span class="v33-home-action-icon" aria-hidden="true">📅</span>
              <span class="v33-home-action-copy"><strong>Proponer plan</strong><small id="v33-home-plan-status">Catálogo listo</small></span>
            </button>
            <button class="v33-home-action v33-home-action-ysi" type="button" data-v33-ysi>
              <span class="v33-home-action-icon" aria-hidden="true">💭</span>
              <span class="v33-home-action-copy"><strong>¿Y si…?</strong><small id="v33-home-ysi-status">Preparando…</small></span>
            </button>
            <button class="v33-home-action v33-home-action-memory" type="button" data-v33-memory>
              <span class="v33-home-action-icon" aria-hidden="true">📸</span>
              <span class="v33-home-action-copy"><strong>Guardar recuerdo</strong><small id="v33-home-memory-status">Vuestro archivo</small></span>
            </button>
          </div>
        </section>`);
    }

    if (!bound) {
      bound = true;
      document.addEventListener("click", handleClick);
    }

    render();
    return true;
  }

  function render() {
    if (!document.getElementById(ROOT_ID)) return;

    const pending = pendingIncoming().length;
    const upcoming = upcomingPlans().length;
    const planStatus = document.getElementById("v33-home-plan-status");
    if (planStatus) {
      planStatus.textContent = pending
        ? `${pending} por responder`
        : upcoming
          ? `${upcoming} ${upcoming === 1 ? "próximo" : "próximos"}`
          : "Catálogo listo";
    }

    const ysiLabel = ysiStatus();
    const ysi = document.getElementById("v33-home-ysi-status");
    if (ysi) ysi.textContent = ysiLabel;

    const memories = memoryCount();
    const memory = document.getElementById("v33-home-memory-status");
    if (memory) memory.textContent = memories ? `${memories} ${memories === 1 ? "guardado" : "guardados"}` : "Primer recuerdo";

    document.getElementById(ROOT_ID)?.classList.toggle("has-pending-plan", pending > 0);
    document.getElementById(ROOT_ID)?.classList.toggle("has-ysi-turn", ysiLabel === "Te toca ahora");
  }

  function handleClick(event) {
    const plan = event.target.closest?.("[data-v33-plan]");
    if (plan) {
      app()?.showPage?.("calendar");
      window.setTimeout(() => {
        (document.getElementById("v3-catalog") || document.getElementById("page-calendar"))?.scrollIntoView?.({ behavior: "smooth", block: "start" });
      }, 120);
      return;
    }

    const ysi = event.target.closest?.("[data-v33-ysi]");
    if (ysi) {
      app()?.showPage?.("minigames");
      window.setTimeout(() => window.JaviEatsMinigames?.open?.("ysi", { force: true }), 120);
      return;
    }

    const memory = event.target.closest?.("[data-v33-memory]");
    if (memory) {
      app()?.showPage?.("memories");
      window.setTimeout(() => app()?.openMemoryEditor?.(), 120);
    }
  }

  function start(attempt = 0) {
    if (mount()) return;
    if (attempt < 80) window.setTimeout(() => start(attempt + 1), 50);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => start(), { once: true });
  } else {
    start();
  }

  window.addEventListener("javieats:data", () => {
    if (!document.getElementById(ROOT_ID)) mount();
    render();
  });
  window.addEventListener("pageshow", render);
})();
