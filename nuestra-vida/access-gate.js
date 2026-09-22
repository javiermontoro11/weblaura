(() => {
  "use strict";

  const JAVI_ID = "ed529e36-5f68-4326-a658-00cfe22d4f01";
  const LAURA_ID = "ef4258bf-5897-4594-86ac-a134fcd1feec";

  function decodeJwtSub(token) {
    try {
      const payload = token.split(".")[1];
      if (!payload) return null;
      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = decodeURIComponent(
        atob(normalized)
          .split("")
          .map(char => "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(json)?.sub || null;
    } catch (_) {
      return null;
    }
  }

  function getSupabaseUserId() {
    try {
      for (let index = 0; index < localStorage.length; index += 1) {
        const key = localStorage.key(index) || "";
        if (!/^sb-.*-auth-token$/.test(key)) continue;

        const raw = localStorage.getItem(key);
        if (!raw) continue;

        const data = JSON.parse(raw);
        const direct =
          data?.user?.id ||
          data?.currentSession?.user?.id ||
          data?.session?.user?.id;
        if (direct) return direct;

        const token =
          data?.access_token ||
          data?.currentSession?.access_token ||
          data?.session?.access_token;
        const subject = token ? decodeJwtSub(token) : null;
        if (subject) return subject;
      }
    } catch (_) {}

    return null;
  }

  const userId = getSupabaseUserId();
  const role =
    userId === JAVI_ID ? "javi" :
    userId === LAURA_ID ? "laura" :
    null;

  const knownProfile = role === "javi" || role === "laura";
  const allowed = knownProfile;

  if (!allowed) {
    location.replace("../");
    return;
  }

  document.documentElement.dataset.nvAccess = "granted";
  document.documentElement.dataset.nvRole = role;
})();
