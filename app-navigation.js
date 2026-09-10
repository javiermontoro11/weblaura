/* JaviEats · Navegación principal y lanzamiento programado
   - Nosotros pasa al acceso de perfil de la cabecera.
   - Barra inferior: Inicio · Planes · acceso especial · Minijuegos · Recuerdos.
   - El acceso especial no revela su nombre antes de la fecha programada.
*/

(() => {
  "use strict";

  const REVEAL_AT = Date.parse("2026-09-12T12:00:00Z"); // 14:00 Europe/Madrid
  const SECRET_NAME_CODES = [78, 117, 101, 115, 116, 114, 97, 32, 86, 105, 100, 97];
  const secretName = () => SECRET_NAME_CODES.map(code => String.fromCharCode(code)).join("");

  let mounted = false;
  let timer = null;

  const $ = id => document.getElementById(id);

  function profileIcon() {
    return `<svg class="v3-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12.1a4.35 4.35 0 1 0 0-8.7 4.35 4.35 0 0 0 0 8.7Zm-7.35 8.3c.55-4.05 3.35-6.35 7.35-6.35s6.8 2.3 7.35 6.35" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  function sparkIcon() {
    return `<svg class="v3-mystery-spark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m12 2 1.55 5.35L19 9l-5.45 1.65L12 16l-1.55-5.35L5 9l5.45-1.65L12 2Zm6.2 12.2.65 2.05L21 17l-2.15.75-.65 2.05-.65-2.05L15.4 17l2.15-.75.65-2.05ZM5.2 14.2l.65 2.05L8 17l-2.15.75-.65 2.05-.65-2.05L2.4 17l2.15-.75.65-2.05Z"/>
    </svg>`;
  }

  function powerIcon() {
    return `<svg class="v3-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2v9m6.4-5.4a9 9 0 1 1-12.8 0" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
    </svg>`;
  }

  function bellIcon() {
    return `<svg class="v3-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM9.5 21h5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  function installStyles() {
    if ($("javieats-navigation-extra-styles")) return;
    const style = document.createElement("style");
    style.id = "javieats-navigation-extra-styles";
    style.textContent = `
      .javieats-v3 .v3-header .header-actions {
        display:flex;
        align-items:center;
        gap:8px;
      }

      .javieats-v3 .v3-profile-header-btn {
        position:relative;
      }

      .javieats-v3 .v3-bottom-nav {
        grid-template-columns:repeat(5,minmax(0,1fr)) !important;
        overflow:visible;
      }

      .javieats-v3 .v3-bottom-nav .nav-btn {
        min-width:0;
      }

      .javieats-v3 .v3-bottom-nav .nav-btn > span {
        overflow:visible;
        text-overflow:clip;
      }

      .javieats-v3 .v3-mystery-nav {
        position:relative;
        overflow:visible;
        isolation:isolate;
        color:#857d75;
      }

      .javieats-v3 .v3-mystery-nav::before {
        content:"";
        position:absolute;
        width:52px;
        height:52px;
        left:50%;
        top:50%;
        transform:translate(-50%,-61%);
        border-radius:20px;
        background:linear-gradient(145deg,#ffb59d,#ef7058);
        box-shadow:0 10px 24px rgba(218,92,67,.28), inset 0 1px 0 rgba(255,255,255,.55);
        z-index:-1;
        transition:transform .2s ease, box-shadow .2s ease, filter .2s ease;
      }

      .javieats-v3 .v3-mystery-nav::after {
        content:"";
        position:absolute;
        width:52px;
        height:52px;
        left:50%;
        top:50%;
        transform:translate(-50%,-61%);
        border-radius:20px;
        border:1px solid rgba(239,112,88,.42);
        z-index:-2;
        animation:v3MysteryPulse 2.2s ease-out infinite;
      }

      .javieats-v3 .v3-mystery-nav .v3-mystery-spark {
        width:22px;
        height:22px;
        fill:#fff;
        filter:drop-shadow(0 2px 4px rgba(110,42,31,.14));
        transform:translateY(-3px);
      }

      .javieats-v3 .v3-mystery-nav > span {
        margin-top:-1px;
        color:#443c37;
        font-size:.59rem;
        font-weight:950;
        letter-spacing:.02em;
      }

      .javieats-v3 .v3-mystery-nav:active::before {
        transform:translate(-50%,-61%) scale(.94);
      }

      .javieats-v3 .v3-mystery-nav.is-revealed::after {
        animation:none;
        opacity:0;
      }

      .javieats-v3 .v3-mystery-nav.is-revealed::before {
        background:linear-gradient(145deg,#f5987e,#e85d45);
        box-shadow:0 10px 26px rgba(218,92,67,.32), inset 0 1px 0 rgba(255,255,255,.52);
      }

      .javieats-v3 .v3-mystery-nav.is-revealed > span {
        font-size:.56rem;
        letter-spacing:-.015em;
      }

      .javieats-v3 .v3-profile-account {
        margin-top:22px;
        padding-bottom:8px;
      }

      .javieats-v3 .v3-profile-account-card {
        overflow:hidden;
        border:1px solid var(--v3-line,#e7dfd7);
        border-radius:24px;
        background:#fff;
        box-shadow:0 8px 28px rgba(44,36,30,.055);
      }

      .javieats-v3 .v3-profile-device-slot .push-settings {
        margin:0;
        border:0;
        border-radius:0;
        box-shadow:none;
        background:transparent;
      }

      .javieats-v3 .v3-profile-device-slot .push-settings + * {
        margin-top:0;
      }

      .javieats-v3 .v3-profile-account-divider {
        height:1px;
        margin:0 16px;
        background:var(--v3-line,#eee6df);
      }

      .javieats-v3 .v3-profile-logout {
        width:100%;
        min-height:66px;
        display:grid;
        grid-template-columns:40px minmax(0,1fr) auto;
        align-items:center;
        gap:12px;
        border:0;
        padding:12px 16px;
        background:transparent;
        color:#181614;
        text-align:left;
        border-radius:0;
        box-shadow:none;
      }

      .javieats-v3 .v3-profile-logout .v3-profile-action-icon {
        width:40px;
        height:40px;
        display:grid;
        place-items:center;
        border-radius:14px;
        background:#f6f1ec;
      }

      .javieats-v3 .v3-profile-logout .v3-profile-action-icon .v3-icon {
        width:20px;
        height:20px;
      }

      .javieats-v3 .v3-profile-logout .v3-profile-action-copy {
        display:grid;
        gap:2px;
      }

      .javieats-v3 .v3-profile-logout .v3-profile-action-copy strong {
        font-size:.9rem;
      }

      .javieats-v3 .v3-profile-logout .v3-profile-action-copy small {
        color:#8b837c;
        font-size:.72rem;
        font-weight:700;
      }

      .javieats-v3 .v3-profile-logout .v3-profile-action-go {
        color:#a49c95;
        font-size:1.15rem;
      }

      .v3-mystery-modal {
        position:fixed;
        inset:0;
        z-index:9999;
        display:grid;
        align-items:end;
        padding:18px;
      }

      .v3-mystery-modal.hidden {
        display:none !important;
      }

      .v3-mystery-backdrop {
        position:absolute;
        inset:0;
        border:0;
        background:rgba(20,17,15,.48);
        backdrop-filter:blur(5px);
      }

      .v3-mystery-sheet {
        position:relative;
        z-index:1;
        width:min(100%,500px);
        margin:0 auto max(4px,env(safe-area-inset-bottom));
        padding:24px;
        border-radius:30px;
        background:linear-gradient(155deg,#fffaf6,#fff);
        box-shadow:0 24px 70px rgba(0,0,0,.25);
        animation:v3MysterySheetIn .28s cubic-bezier(.16,1,.3,1) both;
      }

      .v3-mystery-sheet-close {
        position:absolute;
        top:14px;
        right:14px;
        width:36px;
        height:36px;
        border:0;
        border-radius:13px;
        background:#f5efea;
        color:#6f6761;
        font-size:1.15rem;
      }

      .v3-mystery-mark {
        width:66px;
        height:66px;
        display:grid;
        place-items:center;
        margin-bottom:18px;
        border-radius:23px;
        background:linear-gradient(145deg,#ffb59d,#ef7058);
        box-shadow:0 13px 30px rgba(218,92,67,.25);
      }

      .v3-mystery-mark .v3-mystery-spark {
        width:31px;
        height:31px;
        fill:#fff;
      }

      .v3-mystery-sheet .v3-mystery-kicker {
        margin:0 0 6px;
        color:#e85d45;
        font-size:.7rem;
        font-weight:950;
        letter-spacing:.12em;
        text-transform:uppercase;
      }

      .v3-mystery-sheet h2 {
        margin:0 42px 9px 0;
        font-size:1.65rem;
        letter-spacing:-.045em;
      }

      .v3-mystery-sheet-copy {
        margin:0;
        color:#746c66;
        font-size:.92rem;
        font-weight:650;
        line-height:1.5;
      }

      .v3-mystery-countdown {
        display:grid;
        grid-template-columns:repeat(4,1fr);
        gap:7px;
        margin-top:20px;
      }

      .v3-mystery-countdown > span {
        display:grid;
        gap:2px;
        place-items:center;
        min-width:0;
        padding:11px 5px;
        border-radius:17px;
        background:#f7f1ec;
      }

      .v3-mystery-countdown strong {
        font-size:1.05rem;
        letter-spacing:-.03em;
      }

      .v3-mystery-countdown small {
        color:#91877f;
        font-size:.58rem;
        font-weight:850;
        text-transform:uppercase;
      }

      .v3-mystery-release {
        margin-top:14px;
        color:#9a8f87;
        font-size:.72rem;
        font-weight:750;
      }

      @keyframes v3MysteryPulse {
        0% { opacity:.62; transform:translate(-50%,-61%) scale(1); }
        75%,100% { opacity:0; transform:translate(-50%,-61%) scale(1.32); }
      }

      @keyframes v3MysterySheetIn {
        from { opacity:0; transform:translateY(18px) scale(.98); }
        to { opacity:1; transform:translateY(0) scale(1); }
      }

      @media (min-width:700px) {
        .v3-mystery-modal { align-items:center; }
        .v3-mystery-sheet { margin:auto; }
      }

      @media (max-width:380px) {
        .javieats-v3 .v3-bottom-nav .nav-btn > span { font-size:.55rem; }
        .javieats-v3 .v3-mystery-nav::before,
        .javieats-v3 .v3-mystery-nav::after { width:48px; height:48px; border-radius:18px; }
        .javieats-v3 .v3-mystery-nav.is-revealed > span { font-size:.51rem; }
      }

      @media (prefers-reduced-motion:reduce) {
        .javieats-v3 .v3-mystery-nav::after { animation:none; }
        .v3-mystery-sheet { animation:none; }
      }
    `;
    document.head.appendChild(style);
  }

  function setupHeaderProfile() {
    const actions = document.querySelector(".v3-header .header-actions") || document.querySelector(".app-header .header-actions");
    if (!actions || $("v3-profile-header-btn")) return;

    const profile = document.createElement("button");
    profile.id = "v3-profile-header-btn";
    profile.className = "icon-btn v3-profile-header-btn";
    profile.type = "button";
    profile.title = "Perfil y Nosotros";
    profile.setAttribute("aria-label", "Abrir Perfil y Nosotros");
    profile.innerHTML = profileIcon();
    profile.addEventListener("click", () => window.JaviEatsApp?.showPage?.("us"));
    actions.appendChild(profile);
  }

  function setupProfilePage() {
    const page = $("page-us");
    if (!page || $("v3-profile-account")) return;

    page.insertAdjacentHTML("beforeend", `
      <section class="v3-section v3-profile-account" id="v3-profile-account">
        <div class="v3-block-title">
          <div><p class="v3-eyebrow">Perfil y ajustes</p><h3>Tu JaviEats</h3></div>
        </div>
        <div class="v3-profile-account-card">
          <div class="v3-profile-device-slot" id="v3-profile-device-slot"></div>
          <div class="v3-profile-account-divider"></div>
          <div id="v3-profile-logout-slot"></div>
        </div>
      </section>`);

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
        <span class="v3-profile-action-icon">${powerIcon()}</span>
        <span class="v3-profile-action-copy"><strong>Cerrar sesión</strong><small>Salir de esta cuenta en el dispositivo</small></span>
        <span class="v3-profile-action-go" aria-hidden="true">›</span>`;
      logoutSlot.appendChild(logout);
    }
  }

  function setupGamesLabel() {
    const page = $("page-minigames");
    if (!page) return;
    const hero = page.querySelector(".minigames-hero");
    const heading = hero?.querySelector("h2");
    if (heading) heading.textContent = "Minijuegos";
    const copy = hero?.querySelector("p:not(.eyebrow)");
    if (copy) copy.textContent = "Preguntas compartidas, retos rápidos y piques para cuando os apetezca jugar.";
    page.querySelectorAll(".minigame-back").forEach(button => {
      button.textContent = "← Volver a Minijuegos";
    });
  }

  function setupNav() {
    const nav = document.querySelector(".v3-bottom-nav") || document.querySelector(".bottom-nav");
    if (!nav || $("v3-mystery-nav")) return;

    const home = nav.querySelector('[data-page="home"]');
    const plans = nav.querySelector('[data-page="calendar"]');
    const games = nav.querySelector('[data-page="minigames"]');
    const memories = nav.querySelector('[data-page="memories"]');
    const us = nav.querySelector('[data-page="us"]');
    if (!home || !plans || !games || !memories) return;

    us?.remove();
    const gamesLabel = games.querySelector("span");
    if (gamesLabel) gamesLabel.textContent = "Minijuegos";

    const mystery = document.createElement("button");
    mystery.id = "v3-mystery-nav";
    mystery.className = "nav-btn v3-mystery-nav";
    mystery.type = "button";
    mystery.setAttribute("aria-label", "Descubrir próxima novedad");
    mystery.innerHTML = `${sparkIcon()}<span id="v3-mystery-nav-label">12·09</span>`;
    mystery.addEventListener("click", handleMysteryClick);

    nav.replaceChildren(home, plans, mystery, games, memories);
  }

  function setupMysteryModal() {
    if ($("v3-mystery-modal")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <section class="v3-mystery-modal hidden" id="v3-mystery-modal" role="dialog" aria-modal="true" aria-labelledby="v3-mystery-title">
        <button class="v3-mystery-backdrop" type="button" data-mystery-close aria-label="Cerrar"></button>
        <div class="v3-mystery-sheet">
          <button class="v3-mystery-sheet-close" type="button" data-mystery-close aria-label="Cerrar">×</button>
          <div class="v3-mystery-mark">${sparkIcon()}</div>
          <p class="v3-mystery-kicker" id="v3-mystery-kicker">Algo se está preparando</p>
          <h2 id="v3-mystery-title">Todavía no 👀</h2>
          <p class="v3-mystery-sheet-copy" id="v3-mystery-copy">Ese nuevo hueco de JaviEats no está ahí por casualidad. El sábado descubrirás qué es.</p>
          <div class="v3-mystery-countdown" id="v3-mystery-countdown" aria-label="Cuenta atrás">
            <span><strong id="v3-mystery-days">00</strong><small>días</small></span>
            <span><strong id="v3-mystery-hours">00</strong><small>horas</small></span>
            <span><strong id="v3-mystery-minutes">00</strong><small>min</small></span>
            <span><strong id="v3-mystery-seconds">00</strong><small>seg</small></span>
          </div>
          <p class="v3-mystery-release" id="v3-mystery-release">Se desbloquea el sábado a las 14:00.</p>
        </div>
      </section>`);

    document.querySelectorAll("[data-mystery-close]").forEach(button => {
      button.addEventListener("click", closeMysteryModal);
    });
  }

  function handleMysteryClick() {
    if (Date.now() >= REVEAL_AT && window.JAVIEATS_MAIN_GAME_URL) {
      window.location.href = window.JAVIEATS_MAIN_GAME_URL;
      return;
    }
    openMysteryModal();
  }

  function openMysteryModal() {
    const modal = $("v3-mystery-modal");
    if (!modal) return;
    updateRevealState();
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeMysteryModal() {
    $("v3-mystery-modal")?.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function updateCountdown(diff) {
    const total = Math.max(0, Math.floor(diff / 1000));
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    if ($("v3-mystery-days")) $("v3-mystery-days").textContent = String(days).padStart(2, "0");
    if ($("v3-mystery-hours")) $("v3-mystery-hours").textContent = String(hours).padStart(2, "0");
    if ($("v3-mystery-minutes")) $("v3-mystery-minutes").textContent = String(minutes).padStart(2, "0");
    if ($("v3-mystery-seconds")) $("v3-mystery-seconds").textContent = String(seconds).padStart(2, "0");
  }

  function updateRevealState() {
    const now = Date.now();
    const revealed = now >= REVEAL_AT;
    const nav = $("v3-mystery-nav");
    const label = $("v3-mystery-nav-label");
    if (!nav || !label) return;

    nav.classList.toggle("is-revealed", revealed);

    if (!revealed) {
      label.textContent = "12·09";
      nav.setAttribute("aria-label", "Descubrir próxima novedad");
      updateCountdown(REVEAL_AT - now);
      if ($("v3-mystery-kicker")) $("v3-mystery-kicker").textContent = "Algo se está preparando";
      if ($("v3-mystery-title")) $("v3-mystery-title").textContent = "Todavía no 👀";
      if ($("v3-mystery-copy")) $("v3-mystery-copy").textContent = "Ese nuevo hueco de JaviEats no está ahí por casualidad. El sábado descubrirás qué es.";
      $("v3-mystery-countdown")?.classList.remove("hidden");
      if ($("v3-mystery-release")) $("v3-mystery-release").textContent = "Se desbloquea el sábado a las 14:00.";
      return;
    }

    const name = secretName();
    label.textContent = name;
    nav.setAttribute("aria-label", `Abrir ${name}`);
    if ($("v3-mystery-kicker")) $("v3-mystery-kicker").textContent = "Ya está aquí";
    if ($("v3-mystery-title")) $("v3-mystery-title").textContent = name;
    if ($("v3-mystery-copy")) $("v3-mystery-copy").textContent = window.JAVIEATS_MAIN_GAME_URL
      ? "El nuevo juego principal de JaviEats ya está disponible."
      : "El nuevo juego principal de JaviEats ya se ha desvelado.";
    $("v3-mystery-countdown")?.classList.add("hidden");
    if ($("v3-mystery-release")) $("v3-mystery-release").textContent = window.JAVIEATS_MAIN_GAME_URL
      ? "Toca su pestaña para entrar."
      : "La entrada al juego se conectará desde esta misma pestaña.";
  }

  function mount() {
    if (mounted) return;
    const nav = document.querySelector(".v3-bottom-nav");
    const us = $("page-us");
    if (!nav || !us) {
      window.setTimeout(mount, 60);
      return;
    }

    mounted = true;
    installStyles();
    setupHeaderProfile();
    setupProfilePage();
    setupGamesLabel();
    setupNav();
    setupMysteryModal();
    updateRevealState();

    timer = window.setInterval(updateRevealState, 1000);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) updateRevealState();
    });
    window.addEventListener("pageshow", updateRevealState);
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !$("v3-mystery-modal")?.classList.contains("hidden")) closeMysteryModal();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => window.setTimeout(mount, 0), { once: true });
  } else {
    window.setTimeout(mount, 0);
  }

  window.addEventListener("beforeunload", () => {
    if (timer) window.clearInterval(timer);
  });
})();
