/* JaviEats 3.1 · presentación del acceso especial tras el lanzamiento */
(() => {
  "use strict";

  const RELEASE_AT = Date.parse("2026-09-12T12:00:00Z"); // 14:00 Europe/Madrid
  const NAV_ID = "v3-mystery-nav";
  const STYLE_ID = "v3-release-nav-style";
  const ICON_CLASS = "v3-release-mark";

  function installStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .javieats-v3 #${NAV_ID}.is-revealed {
        isolation: auto;
        color: #857d75;
      }
      .javieats-v3 #${NAV_ID}.is-revealed::before,
      .javieats-v3 #${NAV_ID}.is-revealed::after {
        content: none !important;
        display: none !important;
        animation: none !important;
      }
      .javieats-v3 #${NAV_ID}.is-revealed .v3-mystery-spark {
        display: none !important;
      }
      .javieats-v3 #${NAV_ID}.is-revealed .${ICON_CLASS} {
        width: 20px;
        height: 20px;
        display: block;
        flex: 0 0 auto;
        fill: var(--v3-accent, #ef6d60);
        color: var(--v3-accent, #ef6d60);
        filter: none;
        transform: none;
      }
      .javieats-v3 #${NAV_ID}.is-revealed > span {
        margin-top: 0;
        color: #857d75;
        font-size: .56rem;
        font-weight: 850;
        letter-spacing: -.015em;
        white-space: nowrap;
      }
      @media (max-width: 380px) {
        .javieats-v3 #${NAV_ID}.is-revealed > span { font-size: .51rem; }
      }
    `;
    document.head.appendChild(style);
  }

  function releaseIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", ICON_CLASS);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `
      <path d="M10.8 20.5C9.1 19.1 4 15.4 4 10.7A4.45 4.45 0 0 1 11.8 7.7a4.42 4.42 0 0 1 3.35-1.5c.48 0 .94.07 1.37.21l-2.22 2.22a2.36 2.36 0 0 0-2.5 1.32 2.37 2.37 0 0 0-4.55.75c0 2.77 3.1 5.55 4.55 6.75.75-.62 1.93-1.64 2.94-2.83l1.86 1.47c-1.72 2.08-4.3 4.03-5.8 5.2Z"/>
      <path d="M14.4 3.25h6.35V9.6h-2.2V6.99l-5.22 5.22-1.56-1.56 5.22-5.22H14.4V3.25Z"/>
    `;
    return svg;
  }

  function applyReleasedLook() {
    if (Date.now() < RELEASE_AT) return;
    installStyles();
    const nav = document.getElementById(NAV_ID);
    if (!nav || !nav.classList.contains("is-revealed")) return;
    if (!nav.querySelector(`.${ICON_CLASS}`)) {
      nav.querySelector(".v3-mystery-spark")?.insertAdjacentElement("afterend", releaseIcon());
    }
  }

  function start() {
    applyReleasedLook();
    window.setInterval(applyReleasedLook, 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
