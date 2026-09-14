(() => {
  "use strict";

  const WINDOW = 20;
  const THRESHOLD = 75;
  const RELEASE = "3.3.1";
  const $ = id => document.getElementById(id);
  const app = () => window.JaviEatsApp || null;
  const state = () => app()?.getState?.() || {};

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function madridDate() {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(new Date());
    const map = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${map.year}-${map.month}-${map.day}`;
  }

  function completed(history = state().ySiHistory) {
    return (Array.isArray(history) ? [...history] : [])
      .filter(item => item && item.javi_respuesta != null && item.laura_respuesta != null)
      .sort((a, b) => String(b.cerrada_at || `${b.fecha || ""}T00:00:00`).localeCompare(String(a.cerrada_at || `${a.fecha || ""}T00:00:00`)));
  }

  function stats(history = state().ySiHistory) {
    const items = completed(history).slice(0, WINDOW);
    const matches = items.filter(item => Boolean(item.coincide)).length;
    let streak = 0;
    let bestStreak = 0;
    [...items].reverse().forEach(item => {
      if (item.coincide) bestStreak = Math.max(bestStreak, ++streak);
      else streak = 0;
    });
    return {
      items,
      total: items.length,
      matches,
      bestStreak,
      compatibility: items.length ? Math.round(matches / items.length * 100) : 0
    };
  }

  function addStyles() {
    if ($("javieats-331-styles")) return;
    const style = document.createElement("style");
    style.id = "javieats-331-styles";
    style.textContent = `
      .javieats-v3 #v33-life-section{margin-top:4px}
      .javieats-v3 .v331-life{position:relative;overflow:hidden;min-height:174px;grid-template-columns:76px minmax(0,1fr) auto;padding:24px 25px;border:1px solid rgba(255,255,255,.1);background:linear-gradient(135deg,#1d1a1a,#30201f 56%,#5b302a);color:#fff;box-shadow:0 22px 44px rgba(35,24,23,.18)}
      .javieats-v3 .v331-life:before{content:"";position:absolute;inset:-55% -15% auto 42%;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(239,109,96,.34),transparent 68%);pointer-events:none}
      .javieats-v3 .v331-life .v33-life-icon{position:relative;z-index:1;width:76px;height:76px;border-radius:25px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.13);box-shadow:none;color:#ff9285;font-size:2rem}
      .javieats-v3 .v331-life .v33-life-copy{position:relative;z-index:1;gap:5px}.javieats-v3 .v331-life .v33-life-copy small{color:#ffaca1}.javieats-v3 .v331-life .v33-life-copy strong{color:#fff;font-size:1.48rem;line-height:1.04}.javieats-v3 .v331-life .v33-life-copy em{color:rgba(255,255,255,.7);font-size:.8rem;line-height:1.5}.v331-life-meta{display:block;margin-top:6px;color:rgba(255,255,255,.48);font-size:.66rem;font-weight:800}.javieats-v3 .v331-life .v33-life-go{position:relative;z-index:1;padding:10px 13px;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:rgba(255,255,255,.08);color:#fff}
      .y-si-perk-card{display:grid;grid-template-columns:44px minmax(0,1fr) auto;gap:12px;align-items:center;margin:12px 0 0;padding:13px 14px;border:1px solid rgba(89,79,72,.11);border-radius:18px;background:#faf8f5}.y-si-perk-card.is-active{border-color:rgba(239,109,96,.24);background:linear-gradient(135deg,#fff0ec,#fff9f5);box-shadow:0 10px 24px rgba(239,109,96,.08)}.y-si-perk-icon{width:44px;height:44px;display:grid;place-items:center;border-radius:14px;background:#eee9e4;font-size:1.2rem;font-weight:950}.y-si-perk-card.is-active .y-si-perk-icon{background:#ef6d60;color:#fff}.y-si-perk-copy{display:grid;gap:2px}.y-si-perk-copy small{font-size:.58rem;font-weight:950;letter-spacing:.12em;color:#8a8179}.y-si-perk-copy strong{font-size:.87rem}.y-si-perk-copy em{font-style:normal;font-size:.68rem;line-height:1.4;color:#817870}.y-si-perk-badge{padding:6px 8px;border-radius:999px;background:#eee9e4;font-size:.6rem;font-weight:1000}.y-si-perk-card.is-active .y-si-perk-badge{background:#ef6d60;color:#fff}.y-si-daily-summary.is-pleno{border-color:rgba(239,109,96,.28);background:linear-gradient(135deg,#fff4f0,#fffdf9);box-shadow:0 14px 28px rgba(239,109,96,.1)}
      .y-si-pleno-overlay{position:fixed;inset:0;z-index:12000;display:grid;place-items:center;padding:22px}.y-si-pleno-overlay.hidden{display:none!important}.y-si-pleno-backdrop{position:absolute;inset:0;background:rgba(20,15,14,.72);backdrop-filter:blur(9px)}.y-si-pleno-card{position:relative;z-index:1;width:min(100%,430px);padding:31px 25px 24px;border:1px solid rgba(255,255,255,.12);border-radius:30px;background:linear-gradient(155deg,#241d1c,#3b2421 64%,#68362f);color:#fff;text-align:center;box-shadow:0 28px 80px rgba(0,0,0,.34)}.y-si-pleno-close{position:absolute;right:14px;top:12px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(255,255,255,.09);color:#fff;font-size:1.35rem}.y-si-pleno-kicker{display:inline-flex;padding:6px 10px;border-radius:999px;background:rgba(255,146,133,.13);color:#ffb2a7;font-size:.6rem;font-weight:1000;letter-spacing:.16em}.y-si-pleno-icon{width:92px;height:92px;display:grid;place-items:center;margin:18px auto 14px;border-radius:30px;background:linear-gradient(145deg,#ef6d60,#cc4f46);box-shadow:0 18px 38px rgba(239,109,96,.28);font-size:1.75rem;font-weight:1000}.y-si-pleno-card h2{margin:0;font-size:1.65rem}.y-si-pleno-card>p{margin:8px auto 17px;max-width:330px;color:rgba(255,255,255,.72);font-size:.82rem;line-height:1.55}.y-si-pleno-metric{display:flex;align-items:center;justify-content:space-between;padding:13px 15px;border:1px solid rgba(255,255,255,.1);border-radius:16px;background:rgba(255,255,255,.06)}.y-si-pleno-metric strong{font-size:1.35rem;color:#ffb0a5}.y-si-pleno-unlock{display:grid;gap:3px;margin-top:10px;padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.07);text-align:left}.y-si-pleno-unlock span{color:rgba(255,255,255,.62);font-size:.68rem;line-height:1.4}.y-si-pleno-primary{width:100%;margin-top:16px}
      @media(max-width:559px){.javieats-v3 .v331-life{min-height:190px;grid-template-columns:60px minmax(0,1fr);padding:19px}.javieats-v3 .v331-life .v33-life-icon{width:60px;height:60px}.javieats-v3 .v331-life .v33-life-go{grid-column:2;justify-self:start}.y-si-perk-card{grid-template-columns:40px minmax(0,1fr)}.y-si-perk-badge{grid-column:2;justify-self:start}}
    `;
    document.head.appendChild(style);
  }

  function updateBranding() {
    const icon = `assets/apple-touch-icon.png?v=${RELEASE}`;
    document.querySelectorAll('link[rel="icon"],link[rel="shortcut icon"]').forEach(link => {
      link.href = icon;
      link.type = "image/png";
    });
    const apple = document.querySelector('link[rel="apple-touch-icon"]');
    const manifest = document.querySelector('link[rel="manifest"]');
    if (apple) apple.href = icon;
    if (manifest) manifest.href = `manifest.webmanifest?v=${RELEASE}`;
  }

  function ensureLifeHero() {
    const section = $("v33-life-section");
    const main = $("v3-home-main");
    const card = section?.querySelector("[data-v33-life]");
    if (!section || !main || !card) return;
    card.classList.add("v331-life");
    if (card.dataset.v331 !== "1") {
      card.dataset.v331 = "1";
      card.innerHTML = `<span class="v33-life-icon" aria-hidden="true">♥</span><span class="v33-life-copy"><small>JUEGO PRINCIPAL · NUESTRA VIDA</small><strong>Vuestra historia continúa aquí</strong><em>El mundo que construís juntos merece estar en primera línea.</em><span class="v331-life-meta">Partida compartida · Seguir donde lo dejasteis</span></span><span class="v33-life-go">Seguir jugando →</span>`;
    }
    if (main.nextElementSibling !== section) main.insertAdjacentElement("afterend", section);
  }

  function compatibilityTitle(percent, total) {
    if (!total) return "Aún está por descubrir";
    if (percent >= 85) return "Conexión altísima";
    if (percent >= THRESHOLD) return "Ventaja desbloqueada";
    if (percent >= 60) return "Muy buena sintonía";
    return "También mola no pensar siempre igual";
  }

  function ensurePerk() {
    const compatibility = document.querySelector(".y-si-compatibility-card");
    if (!compatibility) return null;
    let perk = $("y-si-compatibility-perk");
    if (perk) return perk;
    perk = document.createElement("div");
    perk.id = "y-si-compatibility-perk";
    perk.className = "y-si-perk-card";
    perk.innerHTML = `<span class="y-si-perk-icon">↻</span><span class="y-si-perk-copy"><small id="y-si-perk-eyebrow">VENTAJA COMPARTIDA</small><strong id="y-si-perk-title"></strong><em id="y-si-perk-text"></em></span><span class="y-si-perk-badge" id="y-si-perk-badge">75%</span>`;
    compatibility.insertAdjacentElement("afterend", perk);
    return perk;
  }

  function renderCompatibility() {
    const s = stats();
    const percent = Math.max(0, Math.min(100, s.compatibility));
    const active = s.total > 0 && percent >= THRESHOLD;
    if ($("y-si-compatibility")) $("y-si-compatibility").textContent = `${percent}%`;
    if ($("y-si-compatibility-title")) $("y-si-compatibility-title").textContent = compatibilityTitle(percent, s.total);
    if ($("y-si-compatibility-text")) $("y-si-compatibility-text").textContent = s.total ? `Se calcula con vuestras últimas ${s.total} respuestas compartidas.` : "Responded vuestra primera pregunta para empezar.";
    if ($("y-si-shared-count")) $("y-si-shared-count").textContent = String(s.total);
    if ($("y-si-match-count")) $("y-si-match-count").textContent = String(s.matches);
    if ($("y-si-best-streak")) $("y-si-best-streak").textContent = String(s.bestStreak);
    const fill = $("y-si-heart-fill");
    if (fill) {
      const h = 92 * percent / 100;
      fill.setAttribute("y", String(92 - h));
      fill.setAttribute("height", String(h));
    }

    const perk = ensurePerk();
    if (perk) {
      perk.classList.toggle("is-active", active);
      $("y-si-perk-eyebrow").textContent = active ? "VENTAJA ACTIVA" : "VENTAJA COMPARTIDA";
      $("y-si-perk-title").textContent = active ? "2 cambios de pregunta al día" : "2 cambios diarios al llegar al 75%";
      $("y-si-perk-text").textContent = active ? "Los dos compartís dos cambios cada día mientras mantengáis el 75% o más." : `Ahora tenéis 1 cambio diario. Os faltan ${Math.max(0, THRESHOLD - percent)} puntos.`;
      $("y-si-perk-badge").textContent = active ? "ACTIVA" : "75%";
    }

    const skip = $("y-si-skip");
    if (skip) skip.textContent = active ? "↻ Cambiar pregunta · hasta 2 al día" : "↻ Cambiar pregunta · 1 al día";
    if ($("v3-home-ysi-copy")) $("v3-home-ysi-copy").textContent = s.total ? `${percent}% · últimas ${s.total}` : "Compatibilidad por descubrir";
    if ($("v3-us-compat")) $("v3-us-compat").textContent = s.total ? `${percent}%` : "—";
    if ($("v3-us-compat-copy")) $("v3-us-compat-copy").textContent = s.total ? `${s.matches} coincidencias en las últimas ${s.total} preguntas` : "Responded ¿Y si…? para descubrir vuestra compatibilidad";
    $("v3-compat-ring")?.style.setProperty("--compat", `${percent}%`);
    const hubCopy = document.querySelector(".minigame-card-ysi .minigame-card-copy > span:last-child");
    if (hubCopy) hubCopy.textContent = active ? `Compatibilidad ${percent}% · 2 cambios diarios activos.` : `Compatibilidad ${percent}% · al 75% desbloqueáis 2 cambios diarios.`;
    return s;
  }

  function isFullHouse() {
    const today = madridDate();
    const items = completed().filter(item => String(item.fecha) === today).slice(0, 5);
    return items.length === 5 && items.every(item => Boolean(item.coincide));
  }

  function ensureFullHouseModal() {
    let modal = $("y-si-pleno-overlay");
    if (modal) return modal;
    modal = document.createElement("section");
    modal.id = "y-si-pleno-overlay";
    modal.className = "y-si-pleno-overlay hidden";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `<div class="y-si-pleno-backdrop" data-pleno-close></div><div class="y-si-pleno-card"><button class="y-si-pleno-close" type="button" data-pleno-close>×</button><span class="y-si-pleno-kicker">CONEXIÓN TOTAL</span><div class="y-si-pleno-icon">5/5</div><h2>¡Habéis hecho pleno! ❤️</h2><p>Las cinco respuestas de hoy han coincidido. Esto sí merecía una celebración.</p><div class="y-si-pleno-metric"><span>Compatibilidad actual</span><strong id="y-si-pleno-compat">—</strong></div><div class="y-si-pleno-unlock" id="y-si-pleno-unlock"></div><button class="btn btn-primary y-si-pleno-primary" type="button" data-pleno-open>Ver ¿Y si…?</button></div>`;
    document.body.appendChild(modal);
    modal.querySelectorAll("[data-pleno-close]").forEach(el => el.addEventListener("click", () => modal.classList.add("hidden")));
    modal.querySelector("[data-pleno-open]")?.addEventListener("click", () => {
      modal.classList.add("hidden");
      app()?.showPage?.("minigames");
      setTimeout(() => document.querySelector('[data-minigame-open="ysi"]')?.click(), 60);
    });
    return modal;
  }

  function renderFullHouse(s) {
    const full = isFullHouse();
    document.querySelector(".y-si-daily-summary")?.classList.toggle("is-pleno", full);
    if (!full) return;
    if ($("y-si-today-title")) $("y-si-today-title").textContent = "5 de 5 · ¡PLENO! ❤️";
    if ($("y-si-today-text")) $("y-si-today-text").textContent = "Habéis coincidido en las cinco situaciones de hoy. Conexión total.";
    if ($("app-screen")?.classList.contains("hidden")) return;
    const key = `javieats_y_si_pleno_${madridDate()}`;
    if (localStorage.getItem(key) === "1") return;

    const modal = ensureFullHouseModal();
    const active = s.total > 0 && s.compatibility >= THRESHOLD;
    $("y-si-pleno-compat").textContent = `${s.compatibility}%`;
    $("y-si-pleno-unlock").innerHTML = active
      ? `<strong>↻ Ventaja activa</strong><span>Tenéis 2 cambios de pregunta al día mientras mantengáis el 75% o más.</span>`
      : `<strong>Próximo objetivo: 75%</strong><span>Al llegar desbloquearéis 2 cambios diarios compartidos.</span>`;
    localStorage.setItem(key, "1");
    modal.classList.remove("hidden");
  }

  function refresh() {
    updateBranding();
    ensureLifeHero();
    const s = renderCompatibility();
    renderFullHouse(s);
  }

  function start() {
    let queued = false;
    const queue = delay => {
      if (delay) return void setTimeout(() => queue(0), delay);
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; refresh(); });
    };
    window.addEventListener("javieats:data", () => queue(0));
    document.addEventListener("click", event => {
      queue(100);
      if (event.target.closest?.("#y-si-submit,#y-si-skip")) { queue(700); queue(1600); }
    });
    document.addEventListener("visibilitychange", () => { if (!document.hidden) queue(100); });
    const appScreen = $("app-screen");
    if (appScreen) new MutationObserver(() => queue(80)).observe(appScreen, { attributes: true, attributeFilter: ["class"] });
    queue(0); queue(350); queue(1400);
  }

  addStyles();
  updateBranding();
  loadScript("minigames-core.js?v=3.3")
    .then(() => loadScript("nuestra-vida-launcher.js?v=1.0.2"))
    .then(start)
    .catch(error => console.error("JaviEats: no se ha podido cargar un modulo", error));
})();
