(() => {
  "use strict";

  const RELEASE_AT = Date.parse("2026-09-12T12:00:00Z"); // 14:00 Europe/Madrid
  const GAME_URL = "./nuestra-vida/";
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

  function canOpen() {
    return Date.now() >= RELEASE_AT || role() === "javi";
  }

  function handleNavClick(event) {
    const nav = event.target.closest?.("#v3-mystery-nav");
    if (!nav || !canOpen()) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    syncRoleMarker();
    window.location.href = GAME_URL;
  }

  document.addEventListener("click", handleNavClick, true);
  document.addEventListener("DOMContentLoaded", syncRoleMarker, { once: true });
  window.addEventListener("javieats:data", syncRoleMarker);
  window.setInterval(syncRoleMarker, 1000);
})();
