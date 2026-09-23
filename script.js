const CONFIG = {
  supabaseUrl: "https://rqycylggsqgmqugxygwr.supabase.co",
  supabasePublishableKey: "sb_publishable_RNkvgx5IAbWnKG13hGiMUw_XFpym_S2",
  vapidPublicKey: "BN_vNhQDzo_W9c70WpG1SYGVwBRAkWzamhGBcB_1Z_fiSCLiw7nHS1DRcAromxeX2Tcon_AhJO3Pf1T0b_NkGqc"
};



const USER_IDS = {
  JAVI: "ed529e36-5f68-4326-a658-00cfe22d4f01",
  LAURA: "ef4258bf-5897-4594-86ac-a134fcd1feec"
};

const WELCOME_MIN_LOAD_MS = 650;
const WELCOME_SUMMARY_MS = 850;


const SERVICES = window.JaviEatsPlans?.services || [];

const $ = id => document.getElementById(id);

const bootScreen = $("boot-screen");
const authScreen = $("auth-screen");
const welcomeScreen = $("welcome-screen");
const welcomeCard = welcomeScreen?.querySelector(".welcome-card");
const welcomeAvatar = $("welcome-avatar");
const welcomeTitle = $("welcome-title");
const welcomeMessage = $("welcome-message");
const welcomeSummaryPrimary = $("welcome-summary-primary");
const welcomeSummarySecondary = $("welcome-summary-secondary");
const appScreen = $("app-screen");
const sessionUserName = $("session-user-name");
const homeGreeting = $("home-greeting");









const toast = $("toast");

let supabaseClient = null;
let currentUser = null;
let currentRole = "unknown";
let appReady = false;

const state = {
  proposals: [],
  vouchers: [],
  puzzle: null,
  puzzlePieces: [],
  puzzleLoadError: false,
  ySiCurrent: null,
  ySiLastResult: null,
  ySiHistory: [],
  ySiLoadError: false,
  remoteMemories: [],
  memoryLoadError: false,
  notifications: [],
  notificationLoadError: false
};

function memoriesModule() {
  if (!window.JaviEatsMemories) throw new Error("JaviEatsMemories no está cargado.");
  return window.JaviEatsMemories;
}

function notificationsModule() {
  if (!window.JaviEatsNotifications) throw new Error("JaviEatsNotifications no está cargado.");
  return window.JaviEatsNotifications;
}

function pushModule() {
  if (!window.JaviEatsPush) throw new Error("JaviEatsPush no está cargado.");
  return window.JaviEatsPush;
}

function syncModule() {
  if (!window.JaviEatsSync) throw new Error("JaviEatsSync no está cargado.");
  return window.JaviEatsSync;
}

function authModule() {
  if (!window.JaviEatsAuth) throw new Error("JaviEatsAuth no está cargado.");
  return window.JaviEatsAuth;
}

function plansModule() {
  if (!window.JaviEatsPlans) throw new Error("JaviEatsPlans no está cargado.");
  return window.JaviEatsPlans;
}

function ysiModule() {
  if (!window.JaviEatsYSi) throw new Error("JaviEatsYSi no está cargado.");
  return window.JaviEatsYSi;
}

function rewardsModule() {
  if (!window.JaviEatsRewards) throw new Error("JaviEatsRewards no está cargado.");
  return window.JaviEatsRewards;
}

window.JaviEatsApp = {
  getRole: () => currentRole,
  getUser: () => currentUser,
  getState: () => state,
  getServices: () => SERVICES,
  getClient: () => supabaseClient,
  getVapidPublicKey: () => CONFIG.vapidPublicKey,
  isReady: () => appReady,
  runDataSync: (options = {}) => runDataSync(options),
  refreshUI: () => refreshUI(),
  acceptAuthenticatedSession: async (session, role) => {
    currentUser = session?.user || null;
    currentRole = role || "unknown";
    await showApp();
  },
  handleSignedOut: () => resetAppSession(),
  updateAuthenticatedUser: user => {
    if (user) currentUser = user;
  },
  showPage: page => showPage(page),
  showToast: message => showToast(message),
  openGameModal: () => rewardsModule().openGameModal(),
  openService: (id, options = {}) => openService(id, options),
  openPuzzle: () => rewardsModule().openPuzzleModal(),
  openMemoryEditor: (id = null) => memoriesModule().openEditor(id),
  openRemoteMemory: id => memoriesModule().open(id),
  refresh: (options = {}) => syncModule().run(options),
  updateProposalStatus: (id, status) => updateProposalStatus(id, status),
  deleteProposal: id => deleteProposal(id)
};

init();

async function init() {
  bindEvents();
  memoriesModule().bindUI();
  notificationsModule().bindUI();
  pushModule().bindUI();
  syncModule().bindUI();
  plansModule().bindUI();
  ysiModule().bindUI();
  rewardsModule().bindUI();
  renderServices();
  renderMemories();
  rewardsModule().renderVouchers();
  rewardsModule().renderPuzzleProgress();
  rewardsModule().startClock();

  if (!window.supabase?.createClient) {
    authModule().showError("No se ha podido cargar Supabase. Revisa la conexión a internet.");
    return;
  }

  supabaseClient = window.supabase.createClient(
    CONFIG.supabaseUrl,
    CONFIG.supabasePublishableKey,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
  );

  await authModule().init(supabaseClient);
}

function bindEvents() {

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.page));
  });
  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.go));
  });







}

async function showApp() {
  authScreen.classList.add("hidden");
  bootScreen?.classList.add("hidden");
  appScreen.classList.add("hidden");
  showWelcomeScreen();
  applyRoleUI();
  appReady = true;
  syncModule().start();

  const startedAt = Date.now();
  await syncModule().run();
  const remainingLoadTime = Math.max(0, WELCOME_MIN_LOAD_MS - (Date.now() - startedAt));
  if (remainingLoadTime) await delay(remainingLoadTime);

  updateWelcomeSummary();
  await delay(WELCOME_SUMMARY_MS);

  welcomeScreen?.classList.add("hidden");
  appScreen.classList.remove("hidden");
  pushModule().register();
  pushModule().render();

  const params = new URLSearchParams(window.location.search);
  const requestedOpen = params.get("open");
  if (requestedOpen === "message") {
    // Compatibilidad con enlaces antiguos ya retirados de la interfaz.
    cleanLegacyMessageUrl(params);
    rewardsModule().maybeShowPuzzleWelcome();
  } else if (requestedOpen === "nuestro24") {
    showPage("home");
    cleanLegacyMessageUrl(params);
    void window.JaviEatsNuestro24?.refresh(true);
  } else if (requestedOpen === "ysi") {
    maybeFocusYSiFromUrl();
  } else if (requestedOpen === "plans" || requestedOpen === "calendar") {
    maybeFocusPlansFromUrl(params);
  } else {
    rewardsModule().maybeShowPuzzleWelcome();
  }
}

function maybeFocusPlansFromUrl(params = new URLSearchParams(window.location.search)) {
  const requested = params.get("open");
  if (requested !== "plans" && requested !== "calendar") return;

  showPage("calendar");
  params.delete("open");
  const query = params.toString();
  const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState({}, "", cleanUrl);

  window.setTimeout(() => {
    const target = $("v3-plan-pending") || $("page-calendar");
    target?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }, 160);
}

function showWelcomeScreen() {
  const isLaura = currentRole === "laura";
  const name = isLaura ? "Laura" : "Javi";
  welcomeScreen?.classList.remove("hidden");
  welcomeCard?.classList.toggle("is-laura", isLaura);
  if (welcomeAvatar) welcomeAvatar.textContent = isLaura ? "L" : "J";
  if (welcomeTitle) welcomeTitle.textContent = `Buenas, ${name}`;
  if (welcomeMessage) welcomeMessage.textContent = "Preparando lo vuestro…";
  if (welcomeSummaryPrimary) welcomeSummaryPrimary.textContent = "Sincronizando…";
  if (welcomeSummarySecondary) welcomeSummarySecondary.textContent = "Un momento";
}

function updateWelcomeSummary() {
  if (!currentUser) return;
  const isLaura = currentRole === "laura";
  const otherName = isLaura ? "Javi" : "Laura";
  const current = state.ySiCurrent;
  const stats = calculateYSiStats();
  const otherAnswered = current
    ? (isLaura ? Boolean(current.javi_ha_respondido) : Boolean(current.laura_ha_respondido))
    : false;

  if (current && !current.limite_alcanzado && !current.mi_respuesta && otherAnswered) {
    welcomeMessage.textContent = `${otherName} ya ha respondido. Ahora te toca a ti 👀`;
  } else if (current && !current.limite_alcanzado && current.mi_respuesta && !otherAnswered) {
    welcomeMessage.textContent = `Tu respuesta está guardada. Esperando a ${otherName}.`;
  } else if (current?.limite_alcanzado) {
    welcomeMessage.textContent = "Las cinco preguntas de hoy están completadas ❤️";
  } else {
    welcomeMessage.textContent = "Todo lo vuestro está preparado.";
  }

  welcomeSummaryPrimary.textContent = stats.total
    ? `❤️ Compatibilidad ${stats.compatibility}%`
    : "❤️ Compatibilidad por descubrir";

  if (isLaura) {
    welcomeSummarySecondary.textContent = `🧩 Puzle ${rewardsModule().getPuzzlePieceCount()}/${rewardsModule().puzzleTotalPieces}`;
  } else if (current && !current.limite_alcanzado) {
    const position = Number(current.posicion_dia) || Math.min(5, (Number(current.completadas_hoy) || 0) + 1);
    welcomeSummarySecondary.textContent = `💭 ¿Y si…? ${position}/5`;
  } else {
    welcomeSummarySecondary.textContent = `📅 ${state.proposals.length} planes guardados`;
  }
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function maybeFocusYSiFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("open") !== "ysi") return;
  const card = $("y-si-card");
  if (!card) return;

  const requestedTurnId = params.get("turn");
  if (requestedTurnId) {
    const current = state.ySiCurrent;
    const alreadyResolved = !current?.id || current.id !== requestedTurnId || Boolean(current.mi_respuesta);
    if (alreadyResolved) {
      setTimeout(() => showToast("Ese turno ya está resuelto. Te mostramos el estado actual de ¿Y si…?"), 350);
    }
  }

  showPage("minigames");
  window.JaviEatsMinigames?.open?.("ysi", { force: true });
  setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "start" }), 250);
  params.delete("open");
  params.delete("for");
  params.delete("turn");
  const query = params.toString();
  const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState({}, "", cleanUrl);
}

function applyRoleUI() {
  const isLaura = currentRole === "laura";
  sessionUserName.textContent = isLaura ? "Laura" : "Javi";
  homeGreeting.textContent = isLaura ? "Hola Laura 👋" : "Hola Javi 👋";
  plansModule().renderRoleControls();
  renderServices();
  renderYSi();
  rewardsModule().updateDailyGameCard();
  window.JaviEatsMinigames?.refreshAccess?.();
}

function resetAppSession() {
  window.JaviEatsNuestro24?.reset();
  syncModule().reset();
  currentUser = null;
  currentRole = "unknown";
  appReady = false;
  state.proposals = [];
  state.vouchers = [];
  state.puzzle = null;
  state.puzzlePieces = [];
  state.puzzleLoadError = false;
  state.ySiCurrent = null;
  state.ySiLastResult = null;
  state.ySiHistory = [];
  state.ySiLoadError = false;
  state.remoteMemories = [];
  state.memoryLoadError = false;
  state.notifications = [];
  state.notificationLoadError = false;
  memoriesModule().reset();
  notificationsModule().reset();
  plansModule().reset();
  ysiModule().reset();
  rewardsModule().reset();
}

function showPage(page) {
  if (page === "draw") page = "minigames";
  if (page === "services") page = "calendar";
  if (page === "laura") page = "memories";
  document.querySelectorAll(".page").forEach(section => {
    section.classList.toggle("active", section.id === `page-${page}`);
  });
  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });
  if (page === "calendar") {
    plansModule().renderCalendar();
    plansModule().renderBookings();
  }
  if (page === "memories") {
    renderMemories();
    rewardsModule().renderVouchers();
  }
  if (page === "minigames") {
    window.JaviEatsMinigames?.showHub?.();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function settledSyncValue(results, jobs, key) {
  const index = jobs.findIndex(job => job.key === key);
  if (index < 0) return { ok: false, value: null, error: new Error(`Sync job no encontrado: ${key}`) };

  const result = results[index];
  if (!result) return { ok: false, value: null, error: new Error(`Sync result no encontrado: ${key}`) };

  if (result.status === "fulfilled") {
    return { ok: true, value: result.value, error: null };
  }

  return { ok: false, value: null, error: result.reason };
}

async function runDataSync({ silent = false, reason = "normal" } = {}) {
  if (!currentUser || !supabaseClient) return { ok: false, failures: ["session"] };

  const today = toDateKeyMadrid(new Date());
  const jobs = [
    { key: "proposals", run: () => fetchProposals() },
    { key: "vouchers", run: () => fetchVouchers() },
    { key: "game", run: () => fetchTodayGame(today) },
    { key: "puzzle", run: () => fetchPuzzleProgress() },
    { key: "ysiCurrent", run: () => fetchYSiCurrent() },
    { key: "ysiHistory", run: () => fetchYSiHistory() },
    { key: "memories", run: () => fetchRemoteMemories() },
    { key: "notifications", run: () => fetchNotifications() }
  ];

  const results = await Promise.allSettled(jobs.map(job => job.run()));
  const failures = [];

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      failures.push(jobs[index].key);
      console.error(`JaviEats 3.3.6: fallo parcial en ${jobs[index].key}`, result.reason);
    }
  });

  const proposals = settledSyncValue(results, jobs, "proposals");
  if (proposals.ok && Array.isArray(proposals.value)) state.proposals = proposals.value;

  const vouchers = settledSyncValue(results, jobs, "vouchers");
  if (vouchers.ok && Array.isArray(vouchers.value)) state.vouchers = vouchers.value;

  const game = settledSyncValue(results, jobs, "game");
  if (game.ok && game.value) {
    rewardsModule().applyGameSync(game.value);
  }

  const puzzle = settledSyncValue(results, jobs, "puzzle");
  if (puzzle.ok && puzzle.value) {
    state.puzzle = puzzle.value.puzzle || null;
    state.puzzlePieces = Array.isArray(puzzle.value.pieces) ? puzzle.value.pieces : [];
    state.puzzleLoadError = false;
  } else if (failures.includes("puzzle")) {
    state.puzzleLoadError = true;
  }

  const ysiCurrent = settledSyncValue(results, jobs, "ysiCurrent");
  if (ysiCurrent.ok) state.ySiCurrent = ysiCurrent.value || null;

  const ysiHistory = settledSyncValue(results, jobs, "ysiHistory");
  if (ysiHistory.ok && Array.isArray(ysiHistory.value)) state.ySiHistory = ysiHistory.value;
  state.ySiLoadError = failures.includes("ysiCurrent") || failures.includes("ysiHistory");
  state.ySiLastResult = getTodayLatestYSiResult(state.ySiHistory);

  const memories = settledSyncValue(results, jobs, "memories");
  if (memories.ok && memories.value) {
    state.remoteMemories = Array.isArray(memories.value.memories)
      ? memories.value.memories
      : state.remoteMemories;
    state.memoryLoadError = Boolean(memories.value.loadError);
  } else if (failures.includes("memories")) {
    state.memoryLoadError = true;
  }

  const notifications = settledSyncValue(results, jobs, "notifications");
  if (notifications.ok && notifications.value) {
    state.notifications = Array.isArray(notifications.value.notifications)
      ? notifications.value.notifications
      : state.notifications;
    state.notificationLoadError = Boolean(notifications.value.loadError);
  } else if (failures.includes("notifications")) {
    state.notificationLoadError = true;
  }

  refreshUI();
  maybeRevealYSiResult();

  return { ok: !failures.length, failures };
}

async function fetchProposals() {
  return plansModule().fetchAll(supabaseClient);
}
async function fetchYSiCurrent() {
  return ysiModule().fetchCurrent(supabaseClient);
}
async function fetchYSiHistory() {
  return ysiModule().fetchHistory(supabaseClient);
}
async function fetchVouchers() {
  return rewardsModule().fetchVouchers(supabaseClient);
}

async function fetchNotifications() {
  return notificationsModule().fetchAll(supabaseClient);
}


async function fetchRemoteMemories() {
  return memoriesModule().fetchAll(supabaseClient);
}

async function fetchPuzzleProgress() {
  return rewardsModule().fetchPuzzleProgress(supabaseClient, USER_IDS.LAURA);
}
async function fetchTodayGame(dateKey) {
  return rewardsModule().fetchTodayGame(supabaseClient, dateKey);
}

function refreshUI() {
  renderStats();
  renderBookings();
  renderCalendar();
  renderYSi();
  renderMemories();
  rewardsModule().renderVouchers();
  rewardsModule().renderPuzzleProgress();
  renderNotifications();
  rewardsModule().updateDailyGameCard();
  window.dispatchEvent(new CustomEvent("javieats:data"));
}

function renderServices() {
  plansModule().renderServices();
}

function renderStats() {
  plansModule().renderStats();
}

function renderBookings() {
  plansModule().renderBookings();
}

function renderCalendar() {
  plansModule().renderCalendar();
}

function openService(id, options = {}) {
  plansModule().openService(id, options);
}

async function updateProposalStatus(id, newStatus) {
  return plansModule().updateStatus(id, newStatus);
}

async function deleteProposal(id) {
  return plansModule().deleteProposal(id);
}

function calculateYSiStats() {
  return ysiModule().stats();
}

function getTodayLatestYSiResult(history = state.ySiHistory) {
  return ysiModule().latestResult(history);
}

function renderYSi() {
  ysiModule().render();
}

function maybeRevealYSiResult(options = {}) {
  ysiModule().maybeReveal(options);
}

function renderMemories() {
  memoriesModule().render();
}

/* =========================================================
   Centro de actividad y compatibilidad con enlaces legacy
   ========================================================= */
function cleanLegacyMessageUrl(params = new URLSearchParams(window.location.search)) {
  params.delete("open");
  params.delete("for");
  params.delete("message");
  const query = params.toString();
  const cleanUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState({}, "", cleanUrl);
}

function renderNotifications() {
  notificationsModule().render();
}

function toDateKeyMadrid(date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(date));
  const values = Object.fromEntries(parts.filter(p => p.type !== "literal").map(p => [p.type, p.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
function showToast(message) { toast.textContent = message; toast.classList.remove("hidden"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.add("hidden"), 2800); }
