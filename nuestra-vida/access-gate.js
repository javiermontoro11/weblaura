(() => {
  "use strict";

  const RELEASE_AT = Date.parse("2026-09-12T12:00:00Z"); // 14:00 Europe/Madrid
  const JAVI_ID = "ed529e36-5f68-4326-a658-00cfe22d4f01";
  const LAURA_ID = "ef4258bf-5897-4594-86ac-a134fcd1feec";

  function safeGet(storage, key) {
    try { return storage.getItem(key); } catch (_) { return null; }
  }

  function decodeJwtSub(token) {
    try {
      const payload = token.split(".")[1];
      if (!payload) return null;
      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(atob(normalized).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
      return JSON.parse(json)?.sub || null;
    } catch (_) {
      return null;
    }
  }

  function getSupabaseUserId() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || "";
        if (!/^sb-.*-auth-token$/.test(key)) continue;
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const data = JSON.parse(raw);
        const direct = data?.user?.id || data?.currentSession?.user?.id || data?.session?.user?.id;
        if (direct) return direct;
        const token = data?.access_token || data?.currentSession?.access_token || data?.session?.access_token;
        const sub = token ? decodeJwtSub(token) : null;
        if (sub) return sub;
      }
    } catch (_) {}
    return null;
  }

  const userId = getSupabaseUserId();
  const marker = safeGet(sessionStorage, "javieats:nv-role") || safeGet(localStorage, "javieats:nv-role");
  const role = userId === JAVI_ID ? "javi" : userId === LAURA_ID ? "laura" : marker;
  const knownProfile = role === "javi" || role === "laura";
  const released = Date.now() >= RELEASE_AT;
  const allowed = knownProfile && (released || role === "javi");

  if (!allowed) {
    location.replace("../");
    return;
  }

  document.documentElement.dataset.nvAccess = "granted";
  document.documentElement.dataset.nvRole = role;
})();
