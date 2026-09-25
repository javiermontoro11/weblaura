/* =========================================================
   JaviEats 3.1 · interfaz unificada
   ========================================================= */
/* Capa de presentación mobile-first integrada en el core.
   Navegación final: Inicio · Planes · Nuestra Vida · Minijuegos · Recuerdos.
   Perfil/Nosotros vive en la cabecera.
*/

(() => {
  "use strict";

  const APP = () => window.JaviEatsApp;
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  let mounted = false;
  let editPlanId = null;

  function icon(name, className = "v3-icon") {
    const paths = {
      home: '<path d="M3.5 10.8 12 3.7l8.5 7.1V21h-5.8v-6.1H9.3V21H3.5V10.8Z"/>',
      calendar: '<path d="M7 2.5v3m10-3v3M4 8.5h16M5 4.5h14a2 2 0 0 1 2 2v13H3v-13a2 2 0 0 1 2-2Zm2 7h3v3H7v-3Zm5 0h3v3h-3v-3Z"/>',
      game: '<path d="M7 8h10c2.3 0 4.2 1.7 4.5 4l.6 4.3c.4 2.8-2.9 4.4-4.8 2.3L15 16H9l-2.3 2.6c-1.9 2.1-5.2.5-4.8-2.3l.6-4.3A4.6 4.6 0 0 1 7 8Zm0 2v2H5v2h2v2h2v-2h2v-2H9v-2H7Zm9.5 1.2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Zm2.3 3a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z"/>',
      memory: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-13Zm3 11 3.1-3.5 2.5 2.5 1.7-1.9L18 18H6l1-1.5ZM15.8 7.2a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4Z"/>',
      us: '<path d="M12 21s-8-4.7-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.3-8 11-8 11Z"/>',
      chevron: '<path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
      edit: '<path d="m4 16.5 9.9-9.9 3.5 3.5-9.9 9.9L4 21l.9-4.5ZM15.2 5.3l1.6-1.6a1.8 1.8 0 0 1 2.5 0l1 1a1.8 1.8 0 0 1 0 2.5l-1.6 1.6-3.5-3.5Z"/>',
      plus: '<path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
      bell: '<path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM9.5 21h5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
      power: '<path d="M12 2v9m6.4-5.4a9 9 0 1 1-12.8 0" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>',
      spark: '<path d="m12 2 1.4 5.1L18 9l-4.6 1.9L12 16l-1.4-5.1L6 9l4.6-1.9L12 2Zm6 12 .8 2.4L21 17l-2.2.6L18 20l-.8-2.4L15 17l2.2-.6L18 14ZM5 14l.8 2.4L8 17l-2.2.6L5 20l-.8-2.4L2 17l2.2-.6L5 14Z"/>',
      life: '<path d="M10.8 20.5C9.1 19.1 4 15.4 4 10.7A4.45 4.45 0 0 1 11.8 7.7a4.42 4.42 0 0 1 3.35-1.5c.48 0 .94.07 1.37.21l-2.22 2.22a2.36 2.36 0 0 0-2.5 1.32 2.37 2.37 0 0 0-4.55.75c0 2.77 3.1 5.55 4.55 6.75.75-.62 1.93-1.64 2.94-2.83l1.86 1.47c-1.72 2.08-4.3 4.03-5.8 5.2Z"/><path d="M14.4 3.25h6.35V9.6h-2.2V6.99l-5.22 5.22-1.56-1.56 5.22-5.22H14.4V3.25Z"/>',
      clock: '<path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3.2 1.8" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
      arrow: '<path d="M5 12h14m-5-5 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>'
    };
    return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.chevron}</svg>`;
  }

  function state() { return APP()?.getState?.() || {}; }
  function user() { return APP()?.getUser?.() || null; }
  function role() { return APP()?.getRole?.() || "unknown"; }
  function otherName() { return role() === "laura" ? "Javi" : "Laura"; }
  function ownName() { return role() === "laura" ? "Laura" : "Javi"; }

  function madridParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("es-ES", {
      timeZone: "Europe/Madrid",
      weekday: "long",
      day: "numeric",
      month: "long"
    }).formatToParts(date);
    return Object.fromEntries(parts.map(p => [p.type, p.value]));
  }

  function greeting() {
    const hour = Number(new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Madrid", hour: "2-digit", hour12: false
    }).format(new Date()));
    if (hour < 13) return "Buenos días";
    if (hour < 20) return "Buenas tardes";
    return "Buenas noches";
  }

  function niceToday() {
    const p = madridParts();
    const weekday = p.weekday ? p.weekday[0].toUpperCase() + p.weekday.slice(1) : "Hoy";
    return `${weekday}, ${p.day} de ${p.month}`;
  }

  function toDate(proposal) {
    const time = proposal?.is_all_day ? "12:00" : (proposal?.plan_time || "12:00").slice(0, 5);
    return new Date(`${proposal.plan_date}T${time}:00`);
  }

  function formatPlanDate(p) {
    if (!p?.plan_date) return "Fecha por decidir";
    const d = new Date(`${p.plan_date}T12:00:00`);
    const date = new Intl.DateTimeFormat("es-ES", { weekday: "short", day: "numeric", month: "short" }).format(d);
    const time = p.is_all_day ? "Todo el día" : (p.plan_time || "").slice(0, 5);
    return `${date}${time ? ` · ${time}` : ""}`;
  }

  function formatMemoryDate(memory) {
    const raw = memory?.fecha || memory?.id || "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" })
        .format(new Date(`${raw}T12:00:00`));
    }
    return memory?.dateLabel || raw;
  }

  function getFutureConfirmed() {
    const now = new Date();
    return [...(state().proposals || [])]
      .filter(p => p.status === "confirmada" && toDate(p) >= now)
      .sort((a, b) => toDate(a) - toDate(b));
  }

  function getPendingIncoming() {
    const uid = user()?.id;
    return [...(state().proposals || [])]
      .filter(p => p.status === "pendiente" && p.created_by !== uid)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  function getPendingOutgoing() {
    const uid = user()?.id;
    return [...(state().proposals || [])]
      .filter(p => p.status === "pendiente" && p.created_by === uid)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  function ysiStats() {
    const history = Array.isArray(state().ySiHistory) ? state().ySiHistory : [];
    const total = history.length;
    const matches = history.filter(x => Boolean(x.coincide)).length;
    return { total, matches, compatibility: total ? Math.round(matches / total * 100) : 0 };
  }

  function latestYsiMatch() {
    return [...(state().ySiHistory || [])]
      .filter(item => Boolean(item.coincide))
      .sort((a, b) => String(b.cerrada_at || b.fecha || "").localeCompare(String(a.cerrada_at || a.fecha || "")))[0] || null;
  }

  function puzzleTotal() {
    const configured = Number(state().puzzle?.total_piezas);
    if (Number.isFinite(configured) && configured > 0) return configured;
    return Number(window.JaviEatsRewards?.puzzleTotalPieces) || 6;
  }

  function puzzlePrize() {
    return state().puzzle?.premio || "Masaje de 30 minutos";
  }

  function puzzleCount() {
    const total = puzzleTotal();
    const direct = Number(state().puzzle?.piezas_conseguidas);
    if (Number.isFinite(direct)) return Math.max(0, Math.min(total, direct));
    return Math.max(0, Math.min(total, (state().puzzlePieces || []).length));
  }

  function formatVoucherDate(timestamp) {
    if (!timestamp) return "Fecha no disponible";
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) return "Fecha no disponible";
    return new Intl.DateTimeFormat("es-ES", {
      timeZone: "Europe/Madrid",
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(date);
  }

  function voucherCode(voucher) {
    if (!voucher?.id || !voucher?.created_at) return "";
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Madrid",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date(voucher.created_at));
    const values = Object.fromEntries(parts.filter(part => part.type !== "literal").map(part => [part.type, part.value]));
    return `JE-${values.year}${values.month}${values.day}-${String(voucher.id).slice(0, 6).toUpperCase()}`;
  }

  function puzzlePiecesSet() {
    return new Set((state().puzzlePieces || []).map(item => Number(item.numero_pieza)));
  }

  function allMemories() {
    const remote = Array.isArray(state().remoteMemories) ? state().remoteMemories : [];
    return remote
      .map(memory => ({ ...memory, _legacy: false }))
      .sort((a, b) => String(b.fecha || b.id || "").localeCompare(String(a.fecha || a.id || "")));
  }

function memoryImage(memory) {
    if (!memory) return "";
    const urls = Array.isArray(memory.signedUrls) ? memory.signedUrls : [];
    const idx = Number(memory.cover_index || 0);
    return urls[idx] || urls[0] || "";
  }

  function notificationVisual(type) {
    return ({
      plan_nuevo: "📅",
      plan_estado: "✓",
      plan_cambio: "📅",
      recuerdo_nuevo: "📸",
      ysi_resultado: "💭",
      puzzle_pieza: "🧩",
      puzzle_completado: "🎟️"
    })[type] || "•";
  }

  function serviceTheme(service) {
    const id = String(service?.id || "");
    if (["sushi", "cine"].includes(id)) return "sunset";
    if (["mimos", "masaje"].includes(id)) return "rose";
    if (["perritos", "telenovio"].includes(id)) return "sage";
    if (id === "sorpresa") return "violet";
    return "sand";
  }

  function mount() {
    if (mounted || !$('app-screen')) return;
    mounted = true;
    document.body.classList.add("javieats-v3");

    buildHeader();
    buildHome();
    buildPlans();
    buildGames();
    buildMemories();
    buildUs();
    buildNav();
    buildEditModal();
    bindGlobalEvents();
    renderAll();
  }

  function buildHeader() {
    const header = document.querySelector(".app-header");
    if (!header) return;
    header.classList.add("v3-header");
    const eyebrow = header.querySelector(".eyebrow");
    if (eyebrow) eyebrow.textContent = "JAVI + LAURA";
    const title = header.querySelector("h1");
    if (title) title.textContent = "JaviEats";

    const bell = $("notifications-btn");
    if (bell) bell.innerHTML = `${icon("bell")}<span class="notification-badge hidden" id="notifications-badge">0</span>`;

    const actions = header.querySelector(".header-actions");
    if (actions && !$("v3-profile-header-btn")) {
      const profile = document.createElement("button");
      profile.id = "v3-profile-header-btn";
      profile.className = "icon-btn v3-profile-header-btn";
      profile.type = "button";
      profile.title = "Perfil y Nosotros";
      profile.setAttribute("aria-label", "Abrir Perfil y Nosotros");
      profile.innerHTML = icon("us");
      profile.addEventListener("click", () => APP()?.showPage?.("us"));
      actions.appendChild(profile);
    }
  }
  function buildHome() {
    const home = $("page-home");
    if (!home) return;
    home.innerHTML = `
      <section class="v3-home-intro">
        <div>
          <p class="v3-eyebrow">Hoy en JaviEats</p>
          <h2 id="v3-home-title">${greeting()}, Javi</h2>
          <p id="v3-home-date">${niceToday()}</p>
        </div>
      </section>

      <section id="v3-home-main"></section>
      <section id="v3-home-activity"></section>
      <section class="v3-section" id="v3-home-next"></section>

      <section class="v3-section">
        <div class="v3-block-title"><div><p class="v3-eyebrow">Seguir</p><h3>Lo que tenéis en marcha</h3></div></div>
        <div class="v3-home-progress-grid">
          <button class="v3-progress-card v3-progress-ysi" type="button" data-v3-page="minigames" data-v3-minigame="ysi">
            <span class="v3-progress-top"><span class="v3-progress-icon">💭</span><small>¿Y si…?</small></span>
            <strong id="v3-home-ysi">Preparando…</strong>
            <em id="v3-home-ysi-copy">Vuestra pregunta compartida</em>
            <span class="v3-progress-track"><span id="v3-home-ysi-bar"></span></span>
          </button>
          <button class="v3-progress-card v3-progress-puzzle" type="button" data-v3-puzzle>
            <span class="v3-progress-top"><span class="v3-progress-icon">🧩</span><small>Puzle del masaje</small></span>
            <strong id="v3-home-puzzle">0/6 piezas</strong>
            <em id="v3-home-puzzle-copy">Premio en progreso</em>
            <span class="v3-progress-track"><span id="v3-home-puzzle-bar"></span></span>
          </button>
        </div>
      </section>

      <section class="v3-section" id="v3-home-memory"></section>

      <section class="v3-section">
        <div class="v3-block-title"><div><p class="v3-eyebrow">Ideas</p><h3>¿Qué hacemos?</h3></div><button class="v3-link" type="button" data-v3-page="calendar">Ver catálogo</button></div>
        <div class="v3-idea-strip" id="v3-home-ideas"></div>
      </section>

      <div class="v3-legacy-nodes" aria-hidden="true">
        <span id="home-greeting"></span><span id="total-proposals"></span><span id="next-plan"></span>
        <div id="featured-services"></div>
      </div>`;
  }

  function buildPlans() {
    const page = $("page-calendar");
    if (!page) return;
    page.classList.add("v3-plans-page");

    const originalTitle = page.querySelector(":scope > .section-title");
    const sync = page.querySelector(".calendar-sync-card");
    const add = page.querySelector(".calendar-add-plan");
    const history = page.querySelector(".history-title");
    if (originalTitle) originalTitle.classList.add("v3-hide");
    if (sync) sync.classList.add("v3-hide");
    if (add) add.classList.add("v3-hide");
    if (history) history.classList.add("v3-hide");
    $("booking-list")?.classList.add("v3-hide");
    $("clear-history")?.classList.add("v3-hide");

    page.insertAdjacentHTML("afterbegin", `
      <section class="v3-page-intro v3-page-intro-compact">
        <p class="v3-eyebrow">Agenda compartida</p>
        <h2>Planes</h2>
        <p>Proponed algo, decididlo entre los dos y que JaviEats se encargue de que no se pierda.</p>
      </section>
      <section id="v3-plan-pending"></section>
      <section id="v3-plan-next"></section>
    `);

    const selectedTitle = $("selected-title")?.closest(".section-title");
    if (selectedTitle) selectedTitle.classList.add("v3-selected-day-title");

    const calendarCard = page.querySelector(".calendar-card");
    if (calendarCard) {
      calendarCard.insertAdjacentHTML("beforebegin", `
        <section class="v3-section v3-catalog" id="v3-catalog">
          <div class="v3-block-title"><div><p class="v3-eyebrow">Catálogo</p><h3>¿Qué os apetece?</h3></div><span>Proponer en dos toques</span></div>
          <div class="v3-catalog-grid" id="v3-catalog-grid"></div>
        </section>
        <div class="v3-block-title v3-calendar-heading"><div><p class="v3-eyebrow">Calendario</p><h3>Todo lo que tenéis agendado</h3></div></div>`);
    }
  }

  function buildGames() {
    const page = $("page-minigames");
    if (!page) return;
    page.classList.add("v3-games-page");
    const hero = page.querySelector(".minigames-hero");
    if (hero) {
      hero.querySelector(".eyebrow") && (hero.querySelector(".eyebrow").textContent = "Para los dos");
      hero.querySelector("h2") && (hero.querySelector("h2").textContent = "Minijuegos");
      const copy = hero.querySelector("p:not(.eyebrow)");
      if (copy) copy.textContent = "Preguntas compartidas, retos rápidos y piques para cuando os apetezca jugar.";
      const badge = hero.querySelector(".minigames-hero-badge");
      if (badge) badge.textContent = "4 juegos";
    }
    page.querySelectorAll(".minigame-back").forEach(btn => btn.textContent = "← Volver a Minijuegos");
  }

  function buildMemories() {
    const page = $("page-memories");
    if (!page) return;
    page.classList.add("v3-memories-page");
    const hero = page.querySelector(".memories-hero");
    if (hero) {
      const eyebrow = hero.querySelector(".eyebrow");
      const title = hero.querySelector("h2");
      const copy = hero.querySelector("p:last-child");
      if (eyebrow) eyebrow.textContent = "Vuestro archivo";
      if (title) title.textContent = "Recuerdos";
      if (copy) copy.textContent = "Momentos que merece la pena volver a encontrar dentro de unos años.";
      const btn = $("add-memory-btn");
      if (btn) btn.textContent = "+ Añadir recuerdo";
    }
    if (!$("v3-memory-overview")) {
      const memoriesView = $("memories-view");
      if (memoriesView) memoriesView.insertAdjacentHTML("afterbegin", `<section id="v3-memory-overview" class="v3-memory-overview"></section>`);
      else hero?.insertAdjacentHTML("afterend", `<section id="v3-memory-overview" class="v3-memory-overview"></section>`);
    }
    page.querySelector(".vouchers-title")?.classList.add("v3-hide");
    $("voucher-list")?.classList.add("v3-hide");
  }

  function buildUs() {
    if ($("page-us")) return;
    const page = document.createElement("section");
    page.className = "page v3-us-page";
    page.id = "page-us";
    page.innerHTML = `
      <section class="v3-us-cover">
        <div class="v3-us-avatars" aria-hidden="true"><span>J</span><b>+</b><span>L</span></div>
        <div class="v3-us-cover-copy"><p class="v3-eyebrow">Vuestro espacio</p><h2>Javi + Laura</h2><p>Todo lo que habéis ido construyendo dentro de JaviEats.</p></div>
      </section>

      <section class="v3-us-metrics">
        <div><strong id="v3-us-metric-questions">0</strong><span>¿Y si…?</span></div>
        <div><strong id="v3-us-metric-memories">0</strong><span>recuerdos</span></div>
        <div><strong id="v3-us-metric-puzzle">0/6</strong><span>puzle</span></div>
      </section>

      <section class="v3-section v3-compat-card" id="v3-compat-card">
        <div class="v3-compat-ring" id="v3-compat-ring"><span id="v3-us-compat">—</span><small>compatibilidad</small></div>
        <div class="v3-compat-copy">
          <p class="v3-eyebrow">¿Y si…?</p>
          <h3 id="v3-us-compat-copy">Aún por descubrir</h3>
          <div class="v3-latest-match" id="v3-us-latest-match"></div>
          <button class="v3-link v3-link-inline" type="button" data-v3-page="minigames" data-v3-minigame="ysi">Abrir ¿Y si…? ${icon("arrow")}</button>
        </div>
      </section>

      <section class="v3-section v3-puzzle-feature">
        <div class="v3-puzzle-copy">
          <p class="v3-eyebrow">Premio en progreso</p>
          <h3>Puzle del masaje</h3>
          <p id="v3-us-puzzle-copy">Cada victoria suma una pieza.</p>
          <button class="v3-link v3-link-inline" type="button" data-v3-puzzle>Ver progreso ${icon("arrow")}</button>
        </div>
        <div class="puzzle-grid puzzle-grid-mini v3-us-puzzle-grid" id="v3-us-puzzle-grid" aria-label="Progreso del puzle"></div>
      </section>

      <section class="v3-section">
        <div class="v3-block-title"><div><p class="v3-eyebrow">Últimos momentos</p><h3>Vuestros recuerdos</h3></div><button class="v3-link" type="button" data-v3-page="memories">Ver todos</button></div>
        <div class="v3-us-collage" id="v3-us-collage"></div>
      </section>

      <section class="v3-section">
        <div class="v3-block-title"><div><p class="v3-eyebrow">Premios</p><h3>Vales desbloqueados</h3></div></div>
        <div id="v3-us-vouchers" class="v3-us-vouchers"></div>
      </section>

      <section class="v3-section v3-profile-account" id="v3-profile-account">
        <div class="v3-block-title"><div><p class="v3-eyebrow">Perfil y ajustes</p><h3>Tu JaviEats</h3></div></div>
        <div class="v3-profile-account-card">
          <div class="v3-profile-device-slot" id="v3-profile-device-slot"></div>
          <div class="v3-profile-account-divider"></div>
          <div id="v3-profile-logout-slot"></div>
        </div>
      </section>`;

    const app = $("app-screen");
    const nav = app?.querySelector(".bottom-nav");
    if (nav) nav.insertAdjacentElement("beforebegin", page);

    const pushSettings = $("push-settings");
    const pushSlot = $("v3-profile-device-slot");
    if (pushSettings && pushSlot) pushSlot.appendChild(pushSettings);

    const logout = $("logout-btn");
    const logoutSlot = $("v3-profile-logout-slot");
    if (logout && logoutSlot) {
      logout.className = "v3-profile-logout";
      logout.title = "Cerrar sesión";
      logout.setAttribute("aria-label", "Cerrar sesión de JaviEats");
      logout.innerHTML = `
        <span class="v3-profile-action-icon">${icon("power")}</span>
        <span class="v3-profile-action-copy"><strong>Cerrar sesión</strong><small>Salir de esta cuenta en el dispositivo</small></span>
        <span class="v3-profile-action-go" aria-hidden="true">›</span>`;
      logoutSlot.appendChild(logout);
    }
  }
  function buildNav() {
    const nav = document.querySelector(".bottom-nav");
    if (!nav) return;

    nav.classList.add("v3-bottom-nav");
    nav.innerHTML = `
      <button class="nav-btn active" data-page="home" type="button">${icon("home")}<span>Inicio</span></button>
      <button class="nav-btn" data-page="calendar" type="button">${icon("calendar")}<span>Planes</span></button>
      <button class="nav-btn v3-life-nav" id="v3-life-nav" type="button" aria-label="Abrir Nuestra Vida">${icon("life")}<span>Nuestra Vida</span></button>
      <button class="nav-btn" data-page="minigames" type="button">${icon("game")}<span>Minijuegos</span></button>
      <button class="nav-btn" data-page="memories" type="button">${icon("memory")}<span>Recuerdos</span></button>
    `;

    nav.querySelectorAll("[data-page]").forEach(button => {
      button.addEventListener("click", () => APP()?.showPage?.(button.dataset.page));
    });
  }

  function buildEditModal() {
    if ($("v3-edit-plan-modal")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <section class="modal hidden" id="v3-edit-plan-modal">
        <div class="modal-backdrop" data-v3-edit-close></div>
        <div class="modal-panel v3-edit-sheet">
          <button class="modal-close" data-v3-edit-close type="button" aria-label="Cerrar">×</button>
          <p class="v3-eyebrow">Editar plan</p>
          <h2 id="v3-edit-title">Plan</h2>
          <form class="form" id="v3-edit-form">
            <div class="form-row">
              <label>Fecha<input id="v3-edit-date" type="date" required></label>
              <label>Hora<input id="v3-edit-time" type="time" required></label>
            </div>
            <label>Descripción / nota<textarea id="v3-edit-note" rows="5" maxlength="2000" placeholder="Añade cualquier detalle..."></textarea></label>
            <button class="btn btn-primary" type="submit">Guardar cambios</button>
            <p class="note" id="v3-edit-status"></p>
          </form>
        </div>
      </section>`);
  }

  function bindGlobalEvents() {
    window.addEventListener("javieats:data", renderAll);
    window.addEventListener("javieats:edit-plan", event => openEditPlan(event.detail?.id));

    document.addEventListener("click", async event => {
      const pageBtn = event.target.closest("[data-v3-page]");
      if (pageBtn) {
        APP()?.showPage?.(pageBtn.dataset.v3Page);
        const mini = pageBtn.dataset.v3Minigame;
        if (mini) setTimeout(() => window.JaviEatsMinigames?.open?.(mini, { force: true }), 100);
        return;
      }

      const notificationsBtn = event.target.closest("[data-v3-notifications]");
      if (notificationsBtn) {
        $("notifications-btn")?.click();
        return;
      }

      const puzzleBtn = event.target.closest("[data-v3-puzzle]");
      if (puzzleBtn) { APP()?.openPuzzle?.(); return; }

      const voucherDownload = event.target.closest("[data-v3-voucher-download]");
      if (voucherDownload) {
        const voucher = (state().vouchers || []).find(item => String(item.id) === String(voucherDownload.dataset.v3VoucherDownload));
        if (voucher) window.JaviEatsRewards?.downloadVoucher?.(voucher);
        return;
      }

      const voucherRedeem = event.target.closest("[data-v3-voucher-redeem]");
      if (voucherRedeem) {
        const voucher = (state().vouchers || []).find(item => String(item.id) === String(voucherRedeem.dataset.v3VoucherRedeem));
        if (voucher) window.JaviEatsRewards?.proposeVoucherRedemption?.(voucher);
        return;
      }

      const voucherUse = event.target.closest("[data-v3-voucher-use]");
      if (voucherUse) {
        await window.JaviEatsRewards?.markVoucherAsUsed?.(voucherUse.dataset.v3VoucherUse);
        return;
      }

      const serviceBtn = event.target.closest("[data-v3-service]");
      if (serviceBtn) { APP()?.openService?.(serviceBtn.dataset.v3Service); return; }

      const accept = event.target.closest("[data-v3-accept]");
      if (accept) { await APP()?.updateProposalStatus?.(accept.dataset.v3Accept, "confirmada"); return; }

      const reject = event.target.closest("[data-v3-reject]");
      if (reject) { await APP()?.updateProposalStatus?.(reject.dataset.v3Reject, "cancelada"); return; }

      const edit = event.target.closest("[data-v3-edit]");
      if (edit) { openEditPlan(edit.dataset.v3Edit); return; }

      const remove = event.target.closest("[data-v3-delete]");
      if (remove) { await APP()?.deleteProposal?.(remove.dataset.v3Delete); return; }

      const memory = event.target.closest("[data-v3-open-memory]");
      if (memory) {
        APP()?.showPage?.("memories");
        setTimeout(() => document.querySelector(".memory-card")?.scrollIntoView?.({ behavior: "smooth", block: "center" }), 140);
      }
    });

    document.querySelectorAll("[data-v3-edit-close]").forEach(el => el.addEventListener("click", closeEditPlan));
    $("v3-edit-form")?.addEventListener("submit", saveEditPlan);
  }

  function renderAll() {
    if (!mounted) return;
    renderHeader();
    renderHome();
    renderPlans();
    renderCatalog();
    renderMemoryOverview();
    renderUs();
  }

  function renderHeader() {
    const sync = $("sync-status");
    if (sync && sync.textContent.includes("Sincronizado")) sync.textContent = "al día";
    const session = $("session-user-name");
    if (session) session.textContent = ownName();
  }

  function renderHome() {
    const title = $("v3-home-title");
    if (title) title.textContent = `${greeting()}, ${ownName()}`;
    if ($("v3-home-date")) $("v3-home-date").textContent = niceToday();

    const incoming = getPendingIncoming()[0];
    const outgoing = getPendingOutgoing()[0];
    const current = state().ySiCurrent;
    const otherAnswered = role() === "laura" ? Boolean(current?.javi_ha_respondido) : Boolean(current?.laura_ha_respondido);
    const myTurn = current && !current.limite_alcanzado && !current.mi_respuesta && otherAnswered;

    const main = $("v3-home-main");
    if (main) {
      if (incoming) {
        main.innerHTML = `
          <button class="v3-main-action v3-main-plan" type="button" data-v3-page="calendar">
            <span class="v3-main-kicker">PLAN PENDIENTE</span>
            <strong>${otherName()} te propone ${esc(incoming.service_title)}</strong>
            <span>${esc(formatPlanDate(incoming))}${incoming.note ? ` · ${esc(incoming.note)}` : ""}</span>
            <em>Revisar propuesta ${icon("arrow")}</em>
            <b class="v3-main-art">${esc(incoming.service_icon || "📌")}</b>
          </button>`;
      } else if (myTurn) {
        main.innerHTML = `
          <button class="v3-main-action v3-main-ysi" type="button" data-v3-page="minigames" data-v3-minigame="ysi">
            <span class="v3-main-kicker">TE TOCA</span>
            <strong>${otherName()} ya ha respondido a ¿Y si…?</strong>
            <span>Tu respuesta sigue oculta hasta que contestes.</span>
            <em>Responder ahora ${icon("arrow")}</em>
            <b class="v3-main-art">💭</b>
          </button>`;
      } else if (outgoing) {
        main.innerHTML = `
          <button class="v3-main-action v3-main-wait" type="button" data-v3-page="calendar">
            <span class="v3-main-kicker">ESPERANDO RESPUESTA</span>
            <strong>${esc(outgoing.service_title)}</strong>
            <span>La propuesta ya está en JaviEats de ${otherName()}.</span>
            <em>Ver en Planes ${icon("arrow")}</em>
            <b class="v3-main-art">${esc(outgoing.service_icon || "📌")}</b>
          </button>`;
      } else {
        const next = getFutureConfirmed()[0];
        main.innerHTML = `
          <article class="v3-main-action v3-main-calm">
            <span class="v3-main-kicker">TODO AL DÍA</span>
            <strong>${next ? `Lo próximo: ${esc(next.service_title)}` : "No tienes nada pendiente ahora mismo"}</strong>
            <span>${next ? esc(formatPlanDate(next)) : "Cuando haya una propuesta o un turno para ti, aparecerá aquí."}</span>
            <b class="v3-main-art">${next ? esc(next.service_icon || "✨") : "✨"}</b>
          </article>`;
      }
    }

    const unreadNotifications = (state().notifications || []).filter(item => !item.leido_at);
    const activity = $("v3-home-activity");
    if (activity) {
      const visible = unreadNotifications.filter(item => item.tipo !== "plan_nuevo" && item.tipo !== "mensaje_dia").slice(0, 3);
      if (!visible.length) {
        activity.innerHTML = "";
      } else {
        const first = visible[0];
        activity.innerHTML = `
          <button class="v3-home-activity" type="button" data-v3-notifications>
            <span class="v3-home-activity-icon">${notificationVisual(first.tipo)}</span>
            <span class="v3-home-activity-copy"><small>${visible.length === 1 ? "NUEVA ACTIVIDAD" : `${visible.length} NOVEDADES`}</small><strong>${esc(first.titulo || "Hay algo nuevo en JaviEats")}</strong><em>${esc(first.detalle || "Toca para verlo")}</em></span>
            <span class="v3-home-activity-go">${icon("arrow")}</span>
          </button>`;
      }
    }

    const next = getFutureConfirmed()[0];
    const nextWrap = $("v3-home-next");
    if (nextWrap) {
      const d = next ? new Date(`${next.plan_date}T12:00:00`) : null;
      const day = d ? d.getDate() : "—";
      const month = d ? new Intl.DateTimeFormat("es-ES", { month: "short" }).format(d).replace(".", "") : "";
      nextWrap.innerHTML = `
        <div class="v3-block-title"><div><p class="v3-eyebrow">Próximo plan</p><h3>${next ? "Lo siguiente en la agenda" : "Nada cerrado todavía"}</h3></div>${next ? `<button class="v3-link" type="button" data-v3-page="calendar">Ver Planes</button>` : ""}</div>
        ${next ? `<button class="v3-feature-plan" type="button" data-v3-page="calendar"><span class="v3-feature-date"><strong>${day}</strong><small>${esc(month)}</small></span><span class="v3-feature-plan-copy"><small>${esc(next.category || "Plan compartido")}</small><strong>${esc(next.service_title)}</strong><em>${esc(formatPlanDate(next))}</em>${next.note ? `<p>${esc(next.note)}</p>` : ""}</span><span class="v3-feature-plan-icon">${esc(next.service_icon || "📌")}</span></button>` : `<button class="v3-empty-cta" type="button" data-v3-page="calendar"><span>+</span><strong>Proponer un plan</strong><small>El catálogo está listo cuando os apetezca.</small></button>`}`;
    }

    const stats = ysiStats();
    const currentPos = Number(current?.posicion_dia) || Math.min(5, Number(current?.completadas_hoy || 0) + 1);
    const completedToday = Math.max(0, Math.min(5, Number(current?.completadas_hoy || (current?.limite_alcanzado ? 5 : currentPos - 1))));
    if ($("v3-home-ysi")) $("v3-home-ysi").textContent = current?.limite_alcanzado ? "5 de 5 completadas" : `${currentPos} de 5 hoy`;
    if ($("v3-home-ysi-copy")) $("v3-home-ysi-copy").textContent = stats.total ? `${stats.compatibility}% de compatibilidad` : "Compatibilidad por descubrir";
    if ($("v3-home-ysi-bar")) $("v3-home-ysi-bar").style.width = `${current?.limite_alcanzado ? 100 : Math.max(8, completedToday / 5 * 100)}%`;

    const pCount = puzzleCount();
    const pTotal = puzzleTotal();
    if ($("v3-home-puzzle")) $("v3-home-puzzle").textContent = `${pCount} de ${pTotal} piezas`;
    if ($("v3-home-puzzle-copy")) $("v3-home-puzzle-copy").textContent = pCount === pTotal ? `${puzzlePrize()} desbloqueado` : `Faltan ${Math.max(0, pTotal - pCount)} para el premio`;
    if ($("v3-home-puzzle-bar")) $("v3-home-puzzle-bar").style.width = `${Math.max(7, pCount / pTotal * 100)}%`;

    const memories = allMemories();
    const last = memories[0];
    const mem = $("v3-home-memory");
    if (mem) {
      const image = memoryImage(last);
      mem.innerHTML = `
        <div class="v3-block-title"><div><p class="v3-eyebrow">Último recuerdo</p><h3>${last ? "Un momento guardado" : "Todavía no hay recuerdos"}</h3></div><button class="v3-link" type="button" data-v3-page="memories">Ver todos</button></div>
        ${last ? `<button class="v3-memory-hero ${image ? "has-image" : ""}" type="button" data-v3-page="memories" ${image ? `style="--memory-image:url('${esc(image)}')"` : ""}><span class="v3-memory-hero-shade"></span><span class="v3-memory-hero-copy"><small>${esc(formatMemoryDate(last))}</small><strong>${esc(last.titulo || last.title)}</strong><em>${esc(last.descripcion || last.description || "")}</em><b>Ver recuerdo ${icon("arrow")}</b></span></button>` : `<div class="v3-empty-card">El próximo momento que guardéis aparecerá aquí.</div>`}`;
    }

    const ideas = $("v3-home-ideas");
    if (ideas) {
      const services = APP()?.getServices?.() || [];
      const seed = Number(new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid", day: "2-digit" }).format(new Date()).replace(/\D/g, "")) || 1;
      const featured = services.length ? [0, 1, 2].map(i => services[(seed + i * 3) % services.length]) : [];
      ideas.innerHTML = featured.map(service => `<button class="v3-idea-card theme-${serviceTheme(service)}" type="button" data-v3-service="${esc(service.id)}"><span>${esc(service.icon)}</span><small>${esc(service.category)}</small><strong>${esc(service.title)}</strong><em>Proponer ${icon("arrow")}</em></button>`).join("");
    }
  }

  function renderPlans() {
    const incoming = getPendingIncoming();
    const outgoing = getPendingOutgoing();
    const pending = $("v3-plan-pending");
    if (pending) {
      const incomingHtml = incoming.map(p => `
        <article class="v3-request-card">
          <div class="v3-request-visual"><span>${esc(p.service_icon || "📌")}</span><small>${otherName()} propone</small></div>
          <div class="v3-request-copy"><strong>${esc(p.service_title)}</strong><small>${esc(formatPlanDate(p))}</small>${p.note ? `<p>${esc(p.note)}</p>` : ""}</div>
          <div class="v3-request-actions"><button class="v3-accept" type="button" data-v3-accept="${p.id}">Aceptar</button><button class="v3-reject" type="button" data-v3-reject="${p.id}">Rechazar</button><button class="v3-edit" type="button" data-v3-edit="${p.id}">Editar</button></div>
        </article>`).join("");
      const outgoingHtml = outgoing.map(p => `
        <article class="v3-waiting-card"><span>${esc(p.service_icon || "📌")}</span><div><small>Esperando a ${otherName()}</small><strong>${esc(p.service_title)}</strong><em>${esc(formatPlanDate(p))}</em></div><button type="button" data-v3-edit="${p.id}">${icon("edit")}</button></article>`).join("");

      pending.innerHTML = `
        ${incoming.length ? `<section class="v3-section v3-pending-feature"><div class="v3-block-title"><div><p class="v3-eyebrow">Por aceptar</p><h3>${incoming.length === 1 ? "Tienes una propuesta" : `Tienes ${incoming.length} propuestas`}</h3></div></div><div class="v3-request-list">${incomingHtml}</div></section>` : ""}
        ${outgoing.length ? `<section class="v3-section v3-waiting-section"><div class="v3-block-title"><div><p class="v3-eyebrow">Enviados</p><h3>Esperando respuesta</h3></div></div><div class="v3-waiting-list">${outgoingHtml}</div></section>` : ""}`;
    }

    const next = getFutureConfirmed()[0];
    const wrap = $("v3-plan-next");
    if (wrap) {
      const d = next ? new Date(`${next.plan_date}T12:00:00`) : null;
      wrap.innerHTML = `<section class="v3-section"><div class="v3-block-title"><div><p class="v3-eyebrow">Próximo plan</p><h3>${next ? "Lo siguiente en vuestra agenda" : "Nada cerrado todavía"}</h3></div></div>${next ? `<article class="v3-next-plan-card"><div class="v3-plan-date-tile"><strong>${d.getDate()}</strong><span>${new Intl.DateTimeFormat("es-ES", { month: "short" }).format(d).replace(".", "")}</span></div><div class="v3-next-plan-copy"><small>${esc(next.category || "Plan compartido")}</small><strong><span>${esc(next.service_icon || "📌")}</span> ${esc(next.service_title)}</strong><em>${esc(formatPlanDate(next))}</em>${next.note ? `<p>${esc(next.note)}</p>` : ""}</div><button class="v3-circle-action" type="button" data-v3-edit="${next.id}" aria-label="Editar plan">${icon("edit")}</button></article>` : `<div class="v3-empty-card">Aceptad una propuesta y la siguiente cita aparecerá aquí.</div>`}</section>`;
    }
  }

  function renderCatalog() {
    const grid = $("v3-catalog-grid");
    if (!grid) return;
    const services = APP()?.getServices?.() || [];
    grid.innerHTML = services.map(service => `
      <button class="v3-catalog-card theme-${serviceTheme(service)}" type="button" data-v3-service="${esc(service.id)}">
        <span class="v3-catalog-icon">${esc(service.icon)}</span>
        <span class="v3-catalog-copy"><small>${esc(service.category)}</small><strong>${esc(service.title)}</strong><em>${esc(service.description)}</em></span>
        <span class="v3-catalog-go">Proponer ${icon("arrow")}</span>
      </button>`).join("");
    enableCatalogMouseDrag(grid);
  }

  function enableCatalogMouseDrag(grid) {
    if (!grid || grid.dataset.mouseDragBound === "true") return;
    grid.dataset.mouseDragBound = "true";

    const desktopPointer = window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;
    if (!desktopPointer) return;

    const hint = grid.closest(".v3-catalog")?.querySelector(".v3-block-title > span");
    if (hint) hint.textContent = "Arrastra para ver más";

    grid.style.cursor = "grab";
    grid.style.overscrollBehaviorInline = "contain";

    let dragging = false;
    let moved = false;
    let startX = 0;
    let startScroll = 0;

    grid.addEventListener("pointerdown", event => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startScroll = grid.scrollLeft;
      grid.style.cursor = "grabbing";
    });

    grid.addEventListener("pointermove", event => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      if (!moved && Math.abs(delta) > 6) {
        moved = true;
        grid.style.userSelect = "none";
        grid.setPointerCapture?.(event.pointerId);
      }
      if (moved) grid.scrollLeft = startScroll - delta;
    });

    const stopDrag = event => {
      if (!dragging) return;
      dragging = false;
      grid.style.cursor = "grab";
      grid.style.userSelect = "";
      try { grid.releasePointerCapture?.(event.pointerId); } catch (_) {}
      window.setTimeout(() => { moved = false; }, 0);
    };

    grid.addEventListener("pointerup", stopDrag);
    grid.addEventListener("pointercancel", stopDrag);
    grid.addEventListener("click", event => {
      if (!moved) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, true);
  }

  function renderMemoryOverview() {
    const holder = $("v3-memory-overview");
    if (!holder) return;
    const memories = allMemories();
    const cards = memories.slice(0, 3);
    const collage = cards.map((memory, index) => {
      const image = memoryImage(memory);
      return `<div class="v3-memory-overview-tile tile-${index + 1} ${image ? "has-image" : ""}" ${image ? `style="--memory-image:url('${esc(image)}')"` : ""}><span>${image ? "" : "📸"}</span><small>${esc(memory.titulo || memory.title || "Recuerdo")}</small></div>`;
    }).join("");
    holder.innerHTML = memories.length ? `
      <div class="v3-memory-overview-copy"><strong>${memories.length}</strong><span>${memories.length === 1 ? "recuerdo guardado" : "recuerdos guardados"}</span><small>Vuestro archivo va creciendo con vosotros.</small></div>
      <div class="v3-memory-overview-collage">${collage}</div>` : "";
  }

  function renderUs() {
    const stats = ysiStats();
    const count = puzzleCount();
    const total = puzzleTotal();
    const memories = allMemories();
    const vouchers = Array.isArray(state().vouchers) ? state().vouchers : [];
    const match = latestYsiMatch();

    if ($("v3-us-metric-questions")) $("v3-us-metric-questions").textContent = String(stats.total);
    if ($("v3-us-metric-memories")) $("v3-us-metric-memories").textContent = String(memories.length);
    if ($("v3-us-metric-puzzle")) $("v3-us-metric-puzzle").textContent = `${count}/${total}`;

    if ($("v3-us-compat")) $("v3-us-compat").textContent = stats.total ? `${stats.compatibility}%` : "—";
    if ($("v3-us-compat-copy")) $("v3-us-compat-copy").textContent = stats.total ? `${stats.matches} coincidencias de ${stats.total} preguntas compartidas` : "Responded ¿Y si…? para descubrir vuestra compatibilidad";
    if ($("v3-compat-ring")) $("v3-compat-ring").style.setProperty("--compat", `${stats.compatibility || 0}%`);
    if ($("v3-us-latest-match")) $("v3-us-latest-match").innerHTML = match ? `<small>Última coincidencia</small><strong>“${esc(match.pregunta)}”</strong>` : `<small>Última coincidencia</small><strong>Aún no hay una para enseñar aquí.</strong>`;

    const missing = Math.max(0, total - count);
    if ($("v3-us-puzzle-copy")) $("v3-us-puzzle-copy").textContent = count === total
      ? `Puzle completado. ${puzzlePrize()} ya está desbloqueado.`
      : `Lleváis ${count} de ${total} piezas. Faltan ${missing} para desbloquear ${puzzlePrize().toLowerCase()}.`;
    const puzzle = $("v3-us-puzzle-grid");
    if (puzzle) {
      const unlocked = puzzlePiecesSet();
      puzzle.innerHTML = Array.from({ length: total }, (_, i) => {
        const n = i + 1;
        return `<span class="puzzle-piece ${unlocked.has(n) ? "is-unlocked" : "is-locked"}" data-piece="${n}" aria-hidden="true"></span>`;
      }).join("");
      puzzle.classList.toggle("is-complete", count === total);
      puzzle.setAttribute("aria-label", `${count} de ${total} piezas conseguidas`);
    }

    const collage = $("v3-us-collage");
    if (collage) {
      const shown = memories.slice(0, 3);
      collage.innerHTML = shown.length ? shown.map((memory, index) => {
        const image = memoryImage(memory);
        return `<button class="v3-us-photo photo-${index + 1} ${image ? "has-image" : ""}" type="button" data-v3-page="memories" ${image ? `style="--memory-image:url('${esc(image)}')"` : ""}><span>${image ? "" : "📸"}</span><small>${esc(memory.titulo || memory.title)}</small></button>`;
      }).join("") + `<button class="v3-us-photo-more" type="button" data-v3-page="memories"><strong>${memories.length}</strong><span>momentos</span>${icon("arrow")}</button>` : `<div class="v3-empty-card">Los recuerdos que vayáis guardando aparecerán aquí.</div>`;
    }

    const holder = $("v3-us-vouchers");
    if (holder) {
      holder.innerHTML = vouchers.length ? vouchers.map((v, index) => {
        const active = v.estado === "activo";
        const unlockedAt = state().puzzle?.vale_id === v.id && state().puzzle?.completed_at
          ? state().puzzle.completed_at
          : v.created_at;
        const code = voucherCode(v);
        const secondaryAction = active
          ? (role() === "javi"
            ? `<button class="v3-ticket-action secondary" type="button" data-v3-voucher-use="${esc(v.id)}">Marcar canjeado</button>`
            : `<button class="v3-ticket-action secondary" type="button" data-v3-voucher-redeem="${esc(v.id)}">Proponer canje</button>`)
          : "";
        const usedDate = v.estado === "canjeado" && v.canjeado_at
          ? `<small class="v3-ticket-used-date">Canjeado el ${esc(formatVoucherDate(v.canjeado_at))}</small>`
          : "";

        return `
        <article class="v3-ticket ${active ? "" : "is-used"}">
          <span class="v3-ticket-cut cut-left"></span><span class="v3-ticket-cut cut-right"></span>
          <div class="v3-ticket-top"><small>PREMIO JAVIEATS</small><b>#${String(index + 1).padStart(3, "0")}</b></div>
          <strong>${esc(v.titulo || "Vale JaviEats")}</strong>
          <small class="v3-ticket-date">Conseguido el ${esc(formatVoucherDate(unlockedAt))}</small>
          ${v.descripcion ? `<p class="v3-ticket-description">${esc(v.descripcion)}</p>` : ""}
          <div class="v3-ticket-meta">
            <span class="v3-ticket-state">${active ? "Disponible para usar" : "Canjeado"}</span>
            ${code ? `<code>${esc(code)}</code>` : ""}
          </div>
          ${usedDate}
          <div class="v3-ticket-actions">
            <button class="v3-ticket-action primary" type="button" data-v3-voucher-download="${esc(v.id)}">Descargar vale</button>
            ${secondaryAction}
          </div>
        </article>`;
      }).join("") : `<div class="v3-empty-card">Los premios que desbloqueéis aparecerán aquí.</div>`;
    }
  }

  function openEditPlan(id) {
    const plan = (state().proposals || []).find(p => p.id === id);
    if (!plan) return;
    editPlanId = id;
    $("v3-edit-title").textContent = plan.service_title || "Plan";
    $("v3-edit-date").value = plan.plan_date || "";
    $("v3-edit-time").value = (plan.plan_time || "12:00").slice(0, 5);
    $("v3-edit-note").value = plan.note || "";
    $("v3-edit-status").textContent = "";
    $("v3-edit-plan-modal").classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeEditPlan() {
    editPlanId = null;
    $("v3-edit-plan-modal")?.classList.add("hidden");
    document.body.style.overflow = "";
  }

  async function saveEditPlan(event) {
    event.preventDefault();
    if (!editPlanId) return;
    const status = $("v3-edit-status");
    const client = APP()?.getClient?.();
    if (!client) return;
    const payload = {
      plan_date: $("v3-edit-date").value,
      plan_time: $("v3-edit-time").value,
      is_all_day: false,
      note: $("v3-edit-note").value.trim()
    };
    try {
      status.textContent = "Guardando…";
      await window.JaviEatsPlans.update(client, editPlanId, payload);
      status.textContent = "Guardado.";
      await APP()?.refresh?.({ silent: true });
      APP()?.showToast?.("Plan actualizado.");
      setTimeout(closeEditPlan, 320);
    } catch (error) {
      console.error(error);
      status.textContent = "No se han podido guardar los cambios.";
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount, { once: true });
  } else {
    mount();
  }
})();
