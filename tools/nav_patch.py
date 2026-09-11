from pathlib import Path

path = Path("script.js")
text = path.read_text(encoding="utf-8")

icon_old = """      spark: '<path d=\"m12 2 1.4 5.1L18 9l-4.6 1.9L12 16l-1.4-5.1L6 9l4.6-1.9L12 2Zm6 12 .8 2.4L21 17l-2.2.6L18 20l-.8-2.4L15 17l2.2-.6L18 14ZM5 14l.8 2.4L8 17l-2.2.6L5 20l-.8-2.4L2 17l2.2-.6L5 14Z\"/>',
      clock:"""
icon_new = """      spark: '<path d=\"m12 2 1.4 5.1L18 9l-4.6 1.9L12 16l-1.4-5.1L6 9l4.6-1.9L12 2Zm6 12 .8 2.4L21 17l-2.2.6L18 20l-.8-2.4L15 17l2.2-.6L18 14ZM5 14l.8 2.4L8 17l-2.2.6L5 20l-.8-2.4L2 17l2.2-.6L5 14Z\"/>',
      life: '<path d=\"M10.8 20.5C9.1 19.1 4 15.4 4 10.7A4.45 4.45 0 0 1 11.8 7.7a4.42 4.42 0 0 1 3.35-1.5c.48 0 .94.07 1.37.21l-2.22 2.22a2.36 2.36 0 0 0-2.5 1.32 2.37 2.37 0 0 0-4.55.75c0 2.77 3.1 5.55 4.55 6.75.75-.62 1.93-1.64 2.94-2.83l1.86 1.47c-1.72 2.08-4.3 4.03-5.8 5.2Z\"/><path d=\"M14.4 3.25h6.35V9.6h-2.2V6.99l-5.22 5.22-1.56-1.56 5.22-5.22H14.4V3.25Z\"/>',
      clock:"""
if "life:" not in text:
    if icon_old not in text:
        raise SystemExit("No se encontró el bloque de iconos esperado")
    text = text.replace(icon_old, icon_new, 1)

build_old = """  function buildNav() {
    const nav = document.querySelector(\".bottom-nav\");
    if (!nav) return;
    nav.classList.add(\"v3-bottom-nav\");"""
build_new = """  function ensureMainGameNavStyles() {
    if ($(\"v3-main-game-nav-styles\")) return;
    const style = document.createElement(\"style\");
    style.id = \"v3-main-game-nav-styles\";
    style.textContent = `
      .javieats-v3 .v3-mystery-nav.is-revealed {
        isolation: auto;
        color: #857d75;
      }
      .javieats-v3 .v3-mystery-nav.is-revealed::before,
      .javieats-v3 .v3-mystery-nav.is-revealed::after {
        content: none !important;
        display: none !important;
        animation: none !important;
      }
      .javieats-v3 .v3-mystery-nav.is-revealed .v3-main-game-icon {
        width: 20px;
        height: 20px;
        color: var(--v3-accent, #ef6d60);
        fill: currentColor;
        filter: none;
        transform: none;
      }
      .javieats-v3 .v3-mystery-nav.is-revealed > span {
        margin-top: 0;
        color: #857d75;
        font-size: .56rem;
        font-weight: 850;
        letter-spacing: -.015em;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(style);
  }

  function updateMainGameNavIcon(revealed) {
    const nav = $(\"v3-mystery-nav\");
    if (!nav) return;
    const wantedClass = revealed ? \"v3-main-game-icon\" : \"v3-mystery-spark\";
    if (nav.querySelector(`.${wantedClass}`)) return;
    const currentIcon = nav.querySelector(\"svg\");
    const markup = revealed ? icon(\"life\", wantedClass) : icon(\"spark\", wantedClass);
    if (currentIcon) currentIcon.outerHTML = markup;
    else nav.insertAdjacentHTML(\"afterbegin\", markup);
  }

  function buildNav() {
    const nav = document.querySelector(\".bottom-nav\");
    if (!nav) return;
    nav.classList.add(\"v3-bottom-nav\");
    ensureMainGameNavStyles();"""
if "function ensureMainGameNavStyles()" not in text:
    if build_old not in text:
        raise SystemExit("No se encontró buildNav esperado")
    text = text.replace(build_old, build_new, 1)

reveal_old = """    nav.classList.toggle(\"is-revealed\", revealed);

    if (!revealed) {"""
reveal_new = """    nav.classList.toggle(\"is-revealed\", revealed);
    updateMainGameNavIcon(revealed);

    if (!revealed) {"""
if "updateMainGameNavIcon(revealed);" not in text:
    if reveal_old not in text:
        raise SystemExit("No se encontró updateRevealState esperado")
    text = text.replace(reveal_old, reveal_new, 1)

path.write_text(text, encoding="utf-8")
