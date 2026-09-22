(() => {
  "use strict";

  // Versión de navegación de Nuestra Vida; se incrementa cuando cambia su shell/PWA.
  const GAME_URL = "./nuestra-vida/?v=1.0.3";
  const MINILAB_URL = "./nuestra-vida/minijuegos.html?v=1.0.3";
  window.JAVIEATS_MAIN_GAME_URL = GAME_URL;

  function role() {
    return window.JaviEatsApp?.getRole?.() || "unknown";
  }

  function syncRoleMarker() {
    const currentRole = role();
    if (currentRole !== "javi" && currentRole !== "laura") return;
    try {
      sessionStorage.setItem("javieats:nv-role", currentRole);
      localStorage.setItem("javieats:nv-role", currentRole);
    } catch (_) {}
  }

  function handleNavClick(event) {
    const nav = event.target.closest?.("#v3-life-nav");
    if (!nav) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    syncRoleMarker();
    window.location.href = GAME_URL;
  }

  function handleMiniLabClick(event) {
    const launcher = event.target.closest?.("[data-nv-minilab-open]");
    if (!launcher) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    syncRoleMarker();
    window.location.href = MINILAB_URL;
  }

  function injectMiniLabCard() {
    const hub = document.getElementById("minigames-hub");
    const grid = hub?.querySelector(".minigames-grid");
    if (!hub || !grid || grid.querySelector("[data-nv-minilab-open]")) return;

    grid.insertAdjacentHTML("beforeend", `
      <button class="minigame-card v3-life-card" data-nv-minilab-open type="button">
        <span class="minigame-card-icon">🎲</span>
        <span class="minigame-card-copy">
          <small>Nuestra Vida · laboratorio</small>
          <strong>Minijuegos de Nuestra Vida</strong>
          <span>Prueba directamente los minijuegos del tablero sin empezar una partida completa.</span>
        </span>
        <span class="minigame-card-status">10 minijuegos</span>
      </button>
    `);

    const badge = hub.querySelector(".minigames-hero-badge");
    if (badge) badge.textContent = "🎮 5 juegos";

    const heroCopy = hub.querySelector(".minigames-hero p:last-of-type");
    if (heroCopy && heroCopy.textContent.trim().startsWith("Cuatro formas")) {
      heroCopy.textContent = "Cinco formas de jugar, incluida una zona de pruebas con los minijuegos de Nuestra Vida.";
    }
  }

  function init() {
    syncRoleMarker();
    injectMiniLabCard();
  }

  document.addEventListener("click", handleNavClick, true);
  document.addEventListener("click", handleMiniLabClick, true);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  window.addEventListener("javieats:data", () => {
    syncRoleMarker();
    injectMiniLabCard();
  });

})();