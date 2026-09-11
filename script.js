const CONFIG = {
  supabaseUrl: "https://rqycylggsqgmqugxygwr.supabase.co",
  supabasePublishableKey: "sb_publishable_RNkvgx5IAbWnKG13hGiMUw_XFpym_S2",
  vapidPublicKey: "BN_vNhQDzo_W9c70WpG1SYGVwBRAkWzamhGBcB_1Z_fiSCLiw7nHS1DRcAromxeX2Tcon_AhJO3Pf1T0b_NkGqc"
};



// -----------------------------------------------------------------------------
// PUSH NOTIFICATIONS (PWA / Web Push)
// -----------------------------------------------------------------------------
const PUSH_SW_URL = "./service-worker.js";

function pushIsIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent || "") || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function pushIsStandalone() {
  return window.matchMedia?.("(display-mode: standalone)")?.matches || navigator.standalone === true;
}

function pushSupported() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

function vapidKeyToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

async function registerPushServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    await navigator.serviceWorker.register(PUSH_SW_URL, { scope: "./" });
    return await navigator.serviceWorker.ready;
  } catch (error) {
    console.error("No se ha podido registrar el Service Worker de JaviEats:", error);
    return null;
  }
}

async function currentPushSubscription() {
  const registration = await registerPushServiceWorker();
  return registration ? registration.pushManager.getSubscription() : null;
}

async function savePushSubscription(subscription) {
  if (!subscription || !currentUser || !supabaseClient) throw new Error("No hay sesión válida para guardar Push.");
  const json = subscription.toJSON();
  const p256dh = json?.keys?.p256dh;
  const auth = json?.keys?.auth;
  if (!json.endpoint || !p256dh || !auth) throw new Error("La suscripción Push está incompleta.");

  const payload = {
    user_id: currentUser.id,
    endpoint: json.endpoint,
    p256dh,
    auth,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabaseClient
    .from("push_subscriptions")
    .upsert(payload, { onConflict: "endpoint" });
  if (error) throw error;
}

async function deletePushSubscription(endpoint) {
  if (!endpoint || !currentUser || !supabaseClient) return;
  const { error } = await supabaseClient
    .from("push_subscriptions")
    .delete()
    .eq("endpoint", endpoint)
    .eq("user_id", currentUser.id);
  if (error) throw error;
}

async function enablePushNotifications() {
  if (!pushSupported()) throw new Error("Este dispositivo no soporta notificaciones Push web.");
  if (pushIsIOS() && !pushIsStandalone()) {
    throw new Error("En iPhone/iPad, añade primero JaviEats a la pantalla de inicio y ábrela desde su icono.");
  }

  let permission = Notification.permission;
  if (permission !== "granted") permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error(permission === "denied" ? "Has bloqueado las notificaciones para JaviEats." : "No se ha concedido permiso para notificaciones.");

  const registration = await registerPushServiceWorker();
  if (!registration) throw new Error("No se ha podido preparar JaviEats para recibir notificaciones.");

  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKeyToUint8Array(CONFIG.vapidPublicKey)
    });
  }

  await savePushSubscription(subscription);
  await renderPushSettings();
  return subscription;
}

async function disablePushNotifications() {
  const subscription = await currentPushSubscription();
  if (!subscription) {
    await renderPushSettings();
    return;
  }
  const endpoint = subscription.endpoint;
  try { await deletePushSubscription(endpoint); } catch (error) { console.error(error); }
  await subscription.unsubscribe();
  await renderPushSettings();
}

async function renderPushSettings() {
  const holder = document.getElementById("push-settings");
  const status = document.getElementById("push-status");
  const button = document.getElementById("push-toggle");
  if (!holder || !status || !button) return;

  if (!pushSupported()) {
    holder.dataset.state = "unsupported";
    status.textContent = "Este navegador no permite notificaciones Push.";
    button.textContent = "No disponible";
    button.disabled = true;
    return;
  }

  if (pushIsIOS() && !pushIsStandalone()) {
    holder.dataset.state = "install";
    status.textContent = "Para activarlas en iPhone o iPad, añade JaviEats a la pantalla de inicio y ábrela desde su icono.";
    button.textContent = "Instálala primero";
    button.disabled = true;
    return;
  }

  if (Notification.permission === "denied") {
    holder.dataset.state = "denied";
    status.textContent = "Las notificaciones están bloqueadas en los ajustes del dispositivo.";
    button.textContent = "Bloqueadas";
    button.disabled = true;
    return;
  }

  const subscription = await currentPushSubscription();
  if (subscription) {
    holder.dataset.state = "enabled";
    status.textContent = "Este dispositivo recibirá avisos importantes de JaviEats.";
    button.textContent = "Desactivar";
    button.disabled = false;
  } else {
    holder.dataset.state = "disabled";
    status.textContent = "Actívalas para recibir avisos importantes aunque JaviEats esté cerrada.";
    button.textContent = "Activar notificaciones";
    button.disabled = false;
  }
}

async function handlePushToggle() {
  const button = document.getElementById("push-toggle");
  if (!button || button.disabled) return;
  button.disabled = true;
  try {
    const subscription = await currentPushSubscription();
    if (subscription) {
      await disablePushNotifications();
      showToast("Notificaciones desactivadas en este dispositivo.");
    } else {
      await enablePushNotifications();
      showToast("Notificaciones activadas en este dispositivo.");
    }
  } catch (error) {
    console.error(error);
    showToast(error?.message || "No se han podido configurar las notificaciones.");
    await renderPushSettings();
  } finally {
    if (button) button.disabled = false;
  }
}

const USER_IDS = {
  JAVI: "ed529e36-5f68-4326-a658-00cfe22d4f01",
  LAURA: "ef4258bf-5897-4594-86ac-a134fcd1feec"
};

const AUTH_PROFILES = {
  javi: {
    name: "Javi",
    email: "javiermontorogranados@gmail.com",
    initial: "J"
  },
  laura: {
    name: "Laura",
    email: "lauramoramegal@gmail.com",
    initial: "L"
  }
};

const REGULAR_GAME_ROUNDS = 5;
const SYNC_INTERVAL_MS = 60_000;
const PUZZLE_TOTAL_PIECES = 6;
const Y_SI_REVEAL_MS = 900;
const WELCOME_MIN_LOAD_MS = 650;
const WELCOME_SUMMARY_MS = 850;

const MEMORY_STORAGE_BUCKET = "recuerdos";
const MEMORY_MAX_PHOTOS = 8;
const MEMORY_MAX_SOURCE_BYTES = 25 * 1024 * 1024;
const MEMORY_MAX_DIMENSION = 1600;
const MEMORY_TARGET_BYTES = 700 * 1024;
const MEMORY_SIGNED_URL_SECONDS = 60 * 60;
const MEMORY_SIGNED_URL_REFRESH_MARGIN_MS = 5 * 60 * 1000;

const CHOICES = {
  piedra: { label: "Piedra", emoji: "✊" },
  papel: { label: "Papel", emoji: "✋" },
  tijera: { label: "Tijera", emoji: "✌️" }
};

const SERVICES = [
  {
    id: "mimos",
    icon: "🫂",
    title: "Mimos",
    category: "Cariño y desconexión",
    description: "Un rato tranquilo de caricias, abrazos y desconexión. Sin planes complicados y sin necesidad de justificar el pedido.",
    eta: "15-60 min",
    durations: ["Mimos express · 15 minutos", "Sesión estándar · 30 minutos", "Modo sin prisa"],
    bullets: [
      "Caricias en el pelo, la espalda o donde se solicite razonablemente.",
      "Abrazos, sofá o peli de fondo.",
      "Conversación opcional y derecho a quedarse dormida sin penalización."
    ],
    notePlaceholder: "Puedes indicar si te apetecen abrazos, caricias, peli, sofá o modo sin hablar..."
  },
  {
    id: "masaje",
    icon: "💆",
    title: "Masaje",
    category: "Relax",
    description: "Espalda, cuello o modo relax. Duración y presión negociables.",
    eta: "20-45 min",
    durations: ["20 minutos", "30 minutos", "45 minutos"],
    bullets: [
      "Para espalda cargada, cuello o cansancio acumulado.",
      "Se aceptan indicaciones de presión.",
      "Servicio sujeto a energía disponible."
    ],
    notePlaceholder: "Ej: cuello cargado, espalda, presión suave..."
  },
  {
    id: "sushi",
    icon: "🍣",
    title: "Sushi Date",
    category: "Planes para comer",
    description: "Propuesta para comer o cenar sushi juntos. La elección del sitio se puede negociar.",
    eta: "1-2 h",
    durations: ["Comida", "Cena", "Plan completo"],
    bullets: [
      "Ideal para un antojo serio de sushi.",
      "La hora y el restaurante se hablan entre los dos.",
      "Nivel de hambre obligatorio: medio o alto."
    ],
    notePlaceholder: "Ej: quiero buffet, prefiero pedir a casa, tengo antojo de salmón..."
  },
  {
    id: "telenovio",
    icon: "🏠",
    title: "Telenovio",
    category: "Cuidado a domicilio",
    description: "Novio a domicilio para días malos, enfermedad, bajón o necesidad de compañía y cuidados en casa.",
    eta: "Visita variable",
    durations: ["Visita rápida", "Un par de horas", "Tarde de cuidados", "Modo sin prisa"],
    bullets: [
      "Compañía, manta, peli y cuidados básicos.",
      "Posibilidad de ir a por comida, medicinas o lo que haga falta.",
      "Para urgencias reales hay que llamar a un profesional; para lo demás, JaviEats intentará acudir."
    ],
    notePlaceholder: "Cuenta cómo te encuentras o qué necesitas..."
  },
  {
    id: "cine",
    icon: "🎬",
    title: "Peli en el cine",
    category: "Plan de cine",
    description: "Plan para ir juntos al cine, elegir una película y acompañarla con palomitas o algo rico.",
    eta: "2-4 h",
    durations: ["Sesión de tarde", "Sesión de noche", "Cine + cena", "Cine + picoteo"],
    bullets: [
      "La película y el cine se negocian.",
      "Palomitas altamente recomendadas.",
      "Se puede completar el plan comiendo antes o después."
    ],
    notePlaceholder: "Ej: película que quieres ver, cine preferido, palomitas dulces o saladas..."
  },
  {
    id: "plan-diferente",
    icon: "💡",
    title: "Plan diferente",
    category: "Propuesta libre",
    description: "Para cuando tengáis una idea distinta que no aparezca en el catálogo de JaviEats.",
    eta: "A decidir",
    durations: ["Plan corto", "Media tarde", "Día completo", "Por decidir"],
    bullets: [
      "Quien propone explica la idea.",
      "Puede ser cualquier plan que os apetezca.",
      "Los detalles se terminan de hablar entre los dos."
    ],
    requiresNote: true,
    notePlaceholder: "Describe el plan diferente que te apetece proponer..."
  },
  {
    id: "sorpresa",
    icon: "🎁",
    title: "Plan Sorpresa",
    category: "Sorpresa",
    description: "Uno propone la fecha y el otro se encarga de preparar la sorpresa.",
    eta: "Variable",
    durations: ["Plan corto", "Plan medio", "Plan completo"],
    bullets: [
      "Quien propone elige la fecha.",
      "La otra persona prepara la idea.",
      "Puede incluir comida, paseo o un plan inesperado."
    ],
    notePlaceholder: "Puedes indicar presupuesto, tiempo disponible o cosas que no te apetezcan..."
  },
  {
    id: "perritos",
    icon: "🐶",
    title: "Paseo con los perritos",
    category: "Plan con Randy y Nala",
    description: "Para cuando os apetezca ver a Randy y Nala, sacarlos de paseo o pasar un rato con ellos.",
    eta: "30 min-3 h",
    durations: ["Paseo corto", "Paseo largo", "Tarde con los perritos", "Visita y mimos"],
    bullets: [
      "Randy y Nala, sujetos a disponibilidad perruna.",
      "Paseo y tiempo para jugar con ellos.",
      "Posibilidad de añadir merienda o paseo juntos."
    ],
    notePlaceholder: "Ej: paseo largo, quiero ver a Randy y Nala, merienda después..."
  }
];

const MEMORIES = [
  {
    id: "2026-04-24",
    dateLabel: "24/04/2026",
    title: "El día que empezó oficialmente lo nuestro",
    description: "Las primeras flores y la carta con la que empezó todo.",
    type: "letter",
    cover: "recuerdos/ramo-2026-04-24.jpeg",
    letterFile: "recuerdos/carta-2026-04-24.txt",
    letterEyebrow: "24 de abril de 2026",
    letterTitle: "La carta con la que te pedí salir",
    actionLabel: "Leer carta"
  },
  {
    id: "2026-05-31",
    dateLabel: "31/05/2026",
    title: "Las flores llegaron a la vuelta",
    description: "El primer mes nos pilló con kilómetros de por medio. Este ramo llegó al volver de Alemania.",
    type: "gallery",
    cover: "recuerdos/ramo-2026-05-31.jpeg",
    images: ["recuerdos/ramo-2026-05-31.jpeg"],
    actionLabel: "Ver recuerdo"
  },
  {
    id: "2026-07-13",
    dateLabel: "13/07/2026",
    title: "La primera entrega secreta de JaviEats",
    description: "La carta de nuestros dos primeros meses, guardada para volver a leerla cuando quieras.",
    type: "letter",
    emoji: "💌",
    letterFile: "recuerdos/carta-2026-07-13.txt",
    letterEyebrow: "13 de julio de 2026",
    letterTitle: "Nuestra carta de los dos primeros meses",
    actionLabel: "Volver a leer"
  },
  {
    id: "2026-07-24",
    dateLabel: "24/07/2026",
    title: "Nuestro tercer mes",
    description: "El tercer ramo y la foto con la que quedó oficialmente entregado.",
    type: "gallery",
    cover: "recuerdos/ramo-2026-07-24.jpeg",
    images: ["recuerdos/ramo-2026-07-24.jpeg", "recuerdos/laura-ramo-2026-07-24.jpeg"],
    actionLabel: "Ver 2 fotos"
  }
];

const $ = id => document.getElementById(id);

const bootScreen = $("boot-screen");
const authScreen = $("auth-screen");
const turnProfileMismatch = $("turn-profile-mismatch");
const turnProfileMismatchTitle = $("turn-profile-mismatch-title");
const turnProfileMismatchCopy = $("turn-profile-mismatch-copy");
const turnProfileSwitchBtn = $("turn-profile-switch-btn");
const turnProfileContinueBtn = $("turn-profile-continue-btn");
const profileSelector = $("profile-selector");
const passwordPanel = $("password-panel");
const authGlobalStatus = $("auth-global-status");
const authBackBtn = $("auth-back-btn");
const authBackName = $("auth-back-name");
const authSelectedAvatar = $("auth-selected-avatar");
const authSelectedName = $("auth-selected-name");
const authSelectedHint = $("auth-selected-hint");
const loginForm = $("login-form");
const loginEmail = $("login-email");
const loginPassword = $("login-password");
const loginSubmit = $("login-submit");
const loginStatus = $("login-status");
const welcomeScreen = $("welcome-screen");
const welcomeCard = welcomeScreen?.querySelector(".welcome-card");
const welcomeAvatar = $("welcome-avatar");
const welcomeTitle = $("welcome-title");
const welcomeMessage = $("welcome-message");
const welcomeSummaryPrimary = $("welcome-summary-primary");
const welcomeSummarySecondary = $("welcome-summary-secondary");
const appScreen = $("app-screen");
const logoutBtn = $("logout-btn");
const notificationsBtn = $("notifications-btn");
const notificationsBadge = $("notifications-badge");
const notificationsModal = $("notifications-modal");
const notificationsList = $("notifications-list");
const notificationsReadAll = $("notifications-read-all");
const sessionUserName = $("session-user-name");
const syncStatus = $("sync-status");
const homeGreeting = $("home-greeting");
const featuredServices = $("featured-services");
const allServices = $("all-services");
const totalProposals = $("total-proposals");
const nextPlan = $("next-plan");

const gameHomeStatus = $("game-home-status");
const gameHomeButton = $("game-home-button");
const gameModal = $("game-modal");
const gameRoundLabel = $("game-round-label");
const gameDraws = $("game-draws");
const playerScore = $("player-score");
const machineScore = $("machine-score");
const playerChoiceVisual = $("player-choice-visual");
const playerChoiceLabel = $("player-choice-label");
const machineChoiceVisual = $("machine-choice-visual");
const machineChoiceLabel = $("machine-choice-label");
const gameRoundResult = $("game-round-result");
const gameChoices = $("game-choices");
const gameFinal = $("game-final");
const gameFinalIcon = $("game-final-icon");
const gameFinalTitle = $("game-final-title");
const gameFinalText = $("game-final-text");
const prizeReveal = $("prize-reveal");
const prizeTitle = $("prize-title");
const prizeDescription = $("prize-description");
const downloadVoucherBtn = $("download-voucher-btn");
const redeemVoucherBtn = $("redeem-voucher-btn");
const gameDailyNote = $("game-daily-note");
const pieceReveal = $("piece-reveal");
const pieceRevealTitle = $("piece-reveal-title");
const pieceRevealText = $("piece-reveal-text");
const gamePuzzleGrid = $("game-puzzle-grid");
const gamePuzzleCount = $("game-puzzle-count");

const homePuzzleGrid = $("home-puzzle-grid");
const homePuzzleCount = $("home-puzzle-count");
const homePuzzleText = $("home-puzzle-text");
const openPuzzleBtn = $("open-puzzle-btn");
const puzzleModal = $("puzzle-modal");
const puzzleModalGrid = $("puzzle-modal-grid");
const puzzleModalTitle = $("puzzle-modal-title");
const puzzleModalText = $("puzzle-modal-text");
const puzzleModalCount = $("puzzle-modal-count");
const puzzleModalReward = $("puzzle-modal-reward");
const puzzleModalPrimary = $("puzzle-modal-primary");

const serviceModal = $("service-modal");
const modalIcon = $("modal-icon");
const modalCategory = $("modal-category");
const modalTitle = $("modal-title");
const modalDescription = $("modal-description");
const modalList = $("modal-list");
const proposalForm = $("proposal-form");
const proposalSubmit = $("proposal-submit");
const serviceId = $("service-id");
const proposalDate = $("proposal-date");
const proposalTime = $("proposal-time");
const proposalDuration = $("proposal-duration");
const proposalPriority = $("proposal-priority");
const proposalNote = $("proposal-note");
const proposalNoteHint = $("proposal-note-hint");
const proposalStatus = $("proposal-status");
const proposalSuccess = $("proposal-success");
const proposalTicketPreview = $("proposal-ticket-preview");
const downloadProposalTicket = $("download-proposal-ticket");

const calendarTitle = $("calendar-title");
const calendarGrid = $("calendar-grid");
const prevMonth = $("prev-month");
const nextMonth = $("next-month");
const selectedTitle = $("selected-title");
const dayBookings = $("day-bookings");
const bookingList = $("booking-list");
const clearHistory = $("clear-history");

const addCustomPlanBtn = $("add-custom-plan-btn");
const customPlanModal = $("custom-plan-modal");
const customPlanForm = $("custom-plan-form");
const customPlanTitle = $("custom-plan-title");
const customPlanDate = $("custom-plan-date");
const customPlanAllDay = $("custom-plan-all-day");
const customPlanTimeLabel = $("custom-plan-time-label");
const customPlanTime = $("custom-plan-time");
const customPlanDescription = $("custom-plan-description");
const customPlanSubmit = $("custom-plan-submit");
const customPlanStatus = $("custom-plan-status");

const ySiStatusBadge = $("y-si-status-badge");
const ySiCompatibility = $("y-si-compatibility");
const ySiCompatibilityTitle = $("y-si-compatibility-title");
const ySiCompatibilityText = $("y-si-compatibility-text");
const ySiHeartFill = $("y-si-heart-fill");
const ySiSharedCount = $("y-si-shared-count");
const ySiMatchCount = $("y-si-match-count");
const ySiBestStreak = $("y-si-best-streak");
const ySiTodayTitle = $("y-si-today-title");
const ySiTodayText = $("y-si-today-text");
const ySiDailyDots = $("y-si-daily-dots");
const ySiQuestionDate = $("y-si-question-date");
const ySiQuestionText = $("y-si-question-text");
const ySiOptions = $("y-si-options");
const ySiSubmit = $("y-si-submit");
const ySiSkip = $("y-si-skip");
const ySiStatusNote = $("y-si-status-note");
const ySiResult = $("y-si-result");
const ySiResultLoading = $("y-si-result-loading");
const ySiResultContent = $("y-si-result-content");
const ySiResultMeta = $("y-si-result-meta");
const ySiResultIcon = $("y-si-result-icon");
const ySiResultTitle = $("y-si-result-title");
const ySiResultCopy = $("y-si-result-copy");
const ySiJaviAnswer = $("y-si-javi-answer");
const ySiLauraAnswer = $("y-si-laura-answer");
const ySiSpecial = $("y-si-special");
const ySiHistoryBtn = $("y-si-history-btn");
const ySiHistoryModal = $("y-si-history-modal");
const ySiHistorySummary = $("y-si-history-summary");
const ySiHistoryList = $("y-si-history-list");

const memoriesList = $("memories-list");
const voucherList = $("voucher-list");
const letterEyebrow = $("letter-eyebrow");
const letterTitle = $("letter-title");
const letterContent = $("letter-content");
const memoryModal = $("memory-modal");
const memoryModalDate = $("memory-modal-date");
const memoryModalTitle = $("memory-modal-title");
const memoryModalDescription = $("memory-modal-description");
const galleryImage = $("gallery-image");
const galleryPrev = $("gallery-prev");
const galleryNext = $("gallery-next");
const galleryCounter = $("gallery-counter");

const addMemoryBtn = $("add-memory-btn");
const memoryStorageNote = $("memory-storage-note");
const memoryEditorModal = $("memory-editor-modal");
const memoryEditorForm = $("memory-editor-form");
const memoryEditorEyebrow = $("memory-editor-eyebrow");
const memoryEditorTitle = $("memory-editor-title");
const memoryEditorDate = $("memory-editor-date");
const memoryEditorName = $("memory-editor-name");
const memoryEditorDescription = $("memory-editor-description");
const memoryPhotoInput = $("memory-photo-input");
const memoryPhotoPicker = $("memory-photo-picker");
const memoryPhotoGrid = $("memory-photo-grid");
const memoryPhotoCounter = $("memory-photo-counter");
const memoryUploadStatus = $("memory-upload-status");
const memorySaveBtn = $("memory-save-btn");
const memoryDeleteBtn = $("memory-delete-btn");

const toast = $("toast");

let supabaseClient = null;
let pendingSession = null;
let currentUser = null;
let currentRole = "unknown";
let selectedAuthProfile = null;
let calendarDate = new Date();
let selectedDate = toDateKeyMadrid(new Date());
let currentGallery = [];
let currentGalleryIndex = 0;
let memoryEditorBusy = false;
let memoryEditorState = createEmptyMemoryEditorState();
const memorySignedUrlCache = new Map();
let loadedLetterFile = "";
let lastProposalTicket = null;
let dailyGame = null;
let dailyRounds = [];
let roundLocked = false;
let syncTimer = null;
let syncInFlight = null;
let syncRetryTimer = null;
let syncRetryIndex = 0;
let clockTimer = null;
let appReady = false;
let puzzleWelcomeShown = false;
let recentPuzzlePieceNumber = null;
let puzzlePieceAnimationTimer = null;
let ySiSelectedOption = null;
let ySiSelectedDayId = null;
let ySiHistoryFilter = "all";
let ySiRevealTimer = null;
let ySiRevealInProgress = false;

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

window.JaviEatsApp = {
  getRole: () => currentRole,
  getUser: () => currentUser,
  getState: () => state,
  getServices: () => SERVICES,
  getStaticMemories: () => MEMORIES,
  getClient: () => supabaseClient,
  showPage: page => showPage(page),
  showToast: message => showToast(message),
  openGameModal: () => openGameModal(),
  openService: (id, options = {}) => openService(id, options),
  openPuzzle: () => openPuzzleModal(),
  openMemoryEditor: (id = null) => openMemoryEditor(id),
  openRemoteMemory: id => openRemoteMemory(id),
  refresh: (options = {}) => loadAllData(options),
  updateProposalStatus: (id, status) => updateProposalStatus(id, status),
  deleteProposal: id => deleteProposal(id)
};

init();

async function init() {
  bindEvents();
  renderServices();
  renderMemories();
  renderVouchers();
  renderPuzzleProgress();
  setMinDate();
  startClock();

  if (!window.supabase?.createClient) {
    showAuthError("No se ha podido cargar Supabase. Revisa la conexión a internet.");
    return;
  }

  supabaseClient = window.supabase.createClient(
    CONFIG.supabaseUrl,
    CONFIG.supabasePublishableKey,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
  );

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      resetAppSession();
      pendingSession = null;
      showAuthScreen({ resetProfile: true });
    }
    if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && session?.user) {
      pendingSession = session;
      if (event === "TOKEN_REFRESHED") currentUser = session.user;
    }
  });

  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    pendingSession = session || null;
    const requestedRole = getRequestedTurnRole();

    if (pendingSession?.user) {
      const sessionRole = getRoleFromUser(pendingSession.user);
      if (requestedRole && sessionRole !== "unknown" && requestedRole !== sessionRole) {
        showTurnProfileMismatch(pendingSession, requestedRole);
        return;
      }
      await handleAuthenticatedSession(pendingSession);
      return;
    }

    showAuthScreen({ resetProfile: true });
    if (requestedRole) {
      selectAuthProfile(requestedRole);
      loginStatus.textContent = `Este turno es para ${AUTH_PROFILES[requestedRole].name}. Introduce tu contraseña para continuar.`;
    }
  } catch (error) {
    console.error(error);
    showAuthScreen({ resetProfile: true });
  }
}

function bindEvents() {
  loginForm.addEventListener("submit", handleLogin);
  document.querySelectorAll("[data-auth-profile]").forEach(button => {
    button.addEventListener("click", () => selectAuthProfile(button.dataset.authProfile));
  });
  authBackBtn.addEventListener("click", () => showAuthProfileSelector());
  turnProfileSwitchBtn?.addEventListener("click", handleTurnProfileSwitch);
  turnProfileContinueBtn?.addEventListener("click", handleTurnProfileContinue);
  logoutBtn.addEventListener("click", logout);
  notificationsBtn?.addEventListener("click", openNotificationsModal);
  notificationsReadAll?.addEventListener("click", handleNotificationsBulkAction);
  document.getElementById("push-toggle")?.addEventListener("click", handlePushToggle);
  notificationsList?.addEventListener("click", handleNotificationClick);

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.page));
  });
  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.go));
  });
  document.querySelectorAll("[data-service-close]").forEach(el => el.addEventListener("click", closeServiceModal));
  document.querySelectorAll("[data-game-close]").forEach(el => el.addEventListener("click", closeGameModal));
  document.querySelectorAll("[data-memory-close]").forEach(el => el.addEventListener("click", closeMemoryModal));
  document.querySelectorAll("[data-memory-editor-close]").forEach(el => el.addEventListener("click", closeMemoryEditor));
  document.querySelectorAll("[data-custom-plan-close]").forEach(el => el.addEventListener("click", closeCustomPlanModal));
  document.querySelectorAll("[data-puzzle-close]").forEach(el => el.addEventListener("click", closePuzzleModal));
  document.querySelectorAll("[data-y-si-history-close]").forEach(el => el.addEventListener("click", closeYSiHistoryModal));
  document.querySelectorAll("[data-notifications-close]").forEach(el => el.addEventListener("click", closeNotificationsModal));

  gameHomeButton.addEventListener("click", openGameModal);
  openPuzzleBtn.addEventListener("click", () => openPuzzleModal());
  puzzleModalPrimary.addEventListener("click", handlePuzzlePrimaryAction);
  ySiOptions.addEventListener("click", handleYSiOptionClick);
  ySiSubmit.addEventListener("click", handleYSiAnswer);
  ySiSkip.addEventListener("click", handleYSiSkip);
  ySiHistoryBtn.addEventListener("click", openYSiHistoryModal);
  document.querySelectorAll("[data-y-si-filter]").forEach(button => {
    button.addEventListener("click", () => setYSiHistoryFilter(button.dataset.ySiFilter));
  });
  document.querySelectorAll("[data-choice]").forEach(button => {
    button.addEventListener("click", () => playGameRound(button.dataset.choice));
  });
  downloadVoucherBtn.addEventListener("click", () => {
    const voucher = getVoucherForCurrentGame();
    if (voucher) downloadVoucher(voucher);
  });
  redeemVoucherBtn.addEventListener("click", () => {
    const voucher = getVoucherForCurrentGame();
    if (voucher) proposeVoucherRedemption(voucher);
  });

  proposalForm.addEventListener("submit", handleProposal);
  downloadProposalTicket.addEventListener("click", () => {
    if (lastProposalTicket) downloadTicket(lastProposalTicket);
  });

  addCustomPlanBtn.addEventListener("click", openCustomPlanModal);
  customPlanAllDay.addEventListener("change", updateCustomPlanTimeVisibility);
  customPlanForm.addEventListener("submit", handleCustomPlan);

  prevMonth.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
  });
  nextMonth.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
  });
  clearHistory.addEventListener("click", clearSharedCalendar);
  [bookingList, dayBookings].forEach(container => container.addEventListener("click", handleBookingAction));


  addMemoryBtn?.addEventListener("click", () => openMemoryEditor());
  memoryPhotoPicker?.addEventListener("click", () => memoryPhotoInput?.click());
  memoryPhotoInput?.addEventListener("change", handleMemoryPhotoSelection);
  memoryPhotoGrid?.addEventListener("click", handleMemoryPhotoGridClick);
  memoryEditorForm?.addEventListener("submit", saveRemoteMemory);
  memoryDeleteBtn?.addEventListener("click", deleteRemoteMemory);

  memoriesList.addEventListener("click", event => {
    const staticButton = event.target.closest("[data-memory-id]");
    const remoteButton = event.target.closest("[data-remote-memory-id]");
    const editRemoteButton = event.target.closest("[data-edit-remote-memory]");
    if (editRemoteButton) { openMemoryEditor(editRemoteButton.dataset.editRemoteMemory); return; }
    if (staticButton) openMemory(staticButton.dataset.memoryId);
    if (remoteButton) openRemoteMemory(remoteButton.dataset.remoteMemoryId);
  });
  voucherList.addEventListener("click", handleVoucherAction);
  galleryPrev.addEventListener("click", () => changeGalleryImage(-1));
  galleryNext.addEventListener("click", () => changeGalleryImage(1));

  if (syncStatus) {
    syncStatus.setAttribute("role", "button");
    syncStatus.setAttribute("tabindex", "0");
    syncStatus.setAttribute("title", "Actualizar ahora");
    syncStatus.setAttribute("aria-label", "Estado de sincronización. Pulsa para actualizar ahora.");
    const refreshNow = () => loadAllData({ silent: false, reason: "manual" });
    syncStatus.addEventListener("click", refreshNow);
    syncStatus.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        refreshNow();
      }
    });
  }

  window.addEventListener("online", () => {
    syncRetryIndex = 0;
    cancelSyncRetry();
    if (appReady && currentUser) {
      window.setTimeout(() => loadAllData({ silent: false, reason: "online" }), 250);
    }
  });

  window.addEventListener("offline", () => {
    if (appReady && currentUser) setSyncState("error", "Sin conexión · reintentando…");
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && appReady && currentUser) {
      window.setTimeout(() => loadAllData({ silent: true, reason: "resume" }), 450);
    }
  });

  window.addEventListener("pageshow", event => {
    if (event.persisted && appReady && currentUser) {
      window.setTimeout(() => loadAllData({ silent: true, reason: "pageshow" }), 250);
    }
  });
}


function getRequestedTurnRole() {
  const params = new URLSearchParams(window.location.search);
  const role = String(params.get("for") || "").toLowerCase();
  return role === "javi" || role === "laura" ? role : null;
}

function showTurnProfileMismatch(session, requestedRole) {
  const currentRoleFromSession = getRoleFromUser(session?.user);
  const requested = AUTH_PROFILES[requestedRole];
  const current = AUTH_PROFILES[currentRoleFromSession];
  if (!requested || !current) {
    handleAuthenticatedSession(session);
    return;
  }

  pendingSession = session;
  bootScreen?.classList.add("hidden");
  welcomeScreen?.classList.add("hidden");
  appScreen.classList.add("hidden");
  authScreen.classList.remove("hidden");
  profileSelector.classList.add("hidden");
  passwordPanel.classList.add("hidden");
  turnProfileMismatch?.classList.remove("hidden");
  turnProfileMismatchTitle.textContent = `Este turno es para ${requested.name}`;
  turnProfileMismatchCopy.textContent = `Ahora mismo este navegador está abierto como ${current.name}. Puedes cambiar a ${requested.name} o seguir con la sesión actual.`;
  turnProfileSwitchBtn.textContent = `Cambiar a ${requested.name}`;
  turnProfileContinueBtn.textContent = `Seguir como ${current.name}`;
}

async function handleTurnProfileSwitch() {
  const requestedRole = getRequestedTurnRole();
  if (!requestedRole) return;
  turnProfileSwitchBtn.disabled = true;
  try {
    pendingSession = null;
    await supabaseClient.auth.signOut();
    showAuthScreen({ resetProfile: true });
    selectAuthProfile(requestedRole);
    loginStatus.textContent = `Este turno es para ${AUTH_PROFILES[requestedRole].name}. Introduce tu contraseña para continuar.`;
  } finally {
    turnProfileSwitchBtn.disabled = false;
  }
}

async function handleTurnProfileContinue() {
  if (!pendingSession?.user) return;
  turnProfileMismatch?.classList.add("hidden");
  await handleAuthenticatedSession(pendingSession);
}

function showAuthScreen({ resetProfile = false } = {}) {
  bootScreen?.classList.add("hidden");
  welcomeScreen?.classList.add("hidden");
  appScreen.classList.add("hidden");
  authScreen.classList.remove("hidden");
  turnProfileMismatch?.classList.add("hidden");
  loginStatus.textContent = "";
  authGlobalStatus.textContent = "";
  appReady = false;
  if (resetProfile || !selectedAuthProfile) showAuthProfileSelector();
}

function showAuthProfileSelector() {
  turnProfileMismatch?.classList.add("hidden");
  selectedAuthProfile = null;
  loginEmail.value = "";
  loginPassword.value = "";
  loginStatus.textContent = "";
  authGlobalStatus.textContent = "";
  profileSelector.classList.remove("hidden");
  passwordPanel.classList.add("hidden");
}

function selectAuthProfile(profileKey) {
  turnProfileMismatch?.classList.add("hidden");
  const profile = AUTH_PROFILES[profileKey];
  if (!profile) return;
  selectedAuthProfile = profileKey;
  loginEmail.value = profile.email;
  loginPassword.value = "";
  loginStatus.textContent = "";
  authBackName.textContent = profile.name;
  authSelectedAvatar.textContent = profile.initial;
  authSelectedName.textContent = `Hola, ${profile.name}`;
  authSelectedHint.textContent = "JaviEats ya sabe tu correo. Solo falta tu contraseña.";
  passwordPanel.querySelector(".selected-profile-card")?.classList.toggle("is-laura", profileKey === "laura");
  profileSelector.classList.add("hidden");
  passwordPanel.classList.remove("hidden");
  setTimeout(() => loginPassword.focus(), 90);
}

function showAuthError(message) {
  showAuthScreen({ resetProfile: false });
  if (selectedAuthProfile) loginStatus.textContent = message;
  else authGlobalStatus.textContent = message;
}

async function handleLogin(event) {
  event.preventDefault();
  const profile = AUTH_PROFILES[selectedAuthProfile];
  if (!profile) {
    showAuthProfileSelector();
    return;
  }

  loginStatus.textContent = "Entrando…";
  loginSubmit.disabled = true;
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: profile.email,
      password: loginPassword.value
    });
    if (error) throw error;
    if (!data.session?.user) throw new Error("La sesión no se ha creado correctamente.");

    const actualRole = getRoleFromUser(data.session.user);
    if (actualRole !== selectedAuthProfile) {
      await supabaseClient.auth.signOut();
      throw new Error("Esta contraseña no corresponde al perfil seleccionado.");
    }

    loginPassword.value = "";
    loginStatus.textContent = "";
    pendingSession = data.session;
    await handleAuthenticatedSession(data.session);
  } catch (error) {
    console.error(error);
    loginStatus.textContent = friendlyAuthError(error);
    loginPassword.select?.();
  } finally {
    loginSubmit.disabled = false;
  }
}

async function handleAuthenticatedSession(session) {
  const role = getRoleFromUser(session.user);
  if (role === "unknown") {
    await supabaseClient.auth.signOut();
    showAuthError("Esta cuenta no tiene acceso a JaviEats.");
    return;
  }
  currentUser = session.user;
  currentRole = role;
  pendingSession = session;
  await showApp();
}

function getRoleFromUser(user) {
  if (user?.id === USER_IDS.JAVI) return "javi";
  if (user?.id === USER_IDS.LAURA) return "laura";
  return "unknown";
}

async function showApp() {
  authScreen.classList.add("hidden");
  bootScreen?.classList.add("hidden");
  appScreen.classList.add("hidden");
  showWelcomeScreen();
  applyRoleUI();
  appReady = true;
  startSyncTimer();

  const startedAt = Date.now();
  await loadAllData();
  const remainingLoadTime = Math.max(0, WELCOME_MIN_LOAD_MS - (Date.now() - startedAt));
  if (remainingLoadTime) await delay(remainingLoadTime);

  updateWelcomeSummary();
  await delay(WELCOME_SUMMARY_MS);

  welcomeScreen?.classList.add("hidden");
  appScreen.classList.remove("hidden");
  registerPushServiceWorker();
  renderPushSettings();

  const params = new URLSearchParams(window.location.search);
  const requestedOpen = params.get("open");
  if (requestedOpen === "message") {
    // Compatibilidad con enlaces antiguos ya retirados de la interfaz.
    cleanLegacyMessageUrl(params);
    maybeShowPuzzleWelcome();
  } else if (requestedOpen === "ysi") {
    maybeFocusYSiFromUrl();
  } else if (requestedOpen === "plans" || requestedOpen === "calendar") {
    maybeFocusPlansFromUrl(params);
  } else {
    maybeShowPuzzleWelcome();
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
    welcomeSummarySecondary.textContent = `🧩 Puzle ${getPuzzlePieceCount()}/${PUZZLE_TOTAL_PIECES}`;
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
  clearHistory.classList.toggle("hidden", currentRole !== "javi");
  renderServices();
  renderYSi();
  updateDailyGameCard();
  window.JaviEatsMinigames?.refreshAccess?.();
}

async function logout() {
  pendingSession = null;
  selectedAuthProfile = null;
  await supabaseClient.auth.signOut();
}

function resetAppSession() {
  stopSyncTimer();
  cancelSyncRetry();
  syncInFlight = null;
  syncRetryIndex = 0;
  currentUser = null;
  currentRole = "unknown";
  dailyGame = null;
  dailyRounds = [];
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
  memorySignedUrlCache.clear();
  resetMemoryEditorState();
  ySiSelectedOption = null;
  ySiSelectedDayId = null;
  ySiHistoryFilter = "all";
  ySiRevealInProgress = false;
  if (ySiRevealTimer) clearTimeout(ySiRevealTimer);
  ySiRevealTimer = null;
  puzzleWelcomeShown = false;
  recentPuzzlePieceNumber = null;
  if (puzzlePieceAnimationTimer) clearTimeout(puzzlePieceAnimationTimer);
  puzzlePieceAnimationTimer = null;
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
    renderCalendar();
    renderBookings();
  }
  if (page === "memories") {
    renderMemories();
    renderVouchers();
  }
  if (page === "minigames") {
    window.JaviEatsMinigames?.showHub?.();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startSyncTimer() {
  stopSyncTimer();
  syncTimer = setInterval(() => {
    if (!document.hidden && appReady && currentUser) loadAllData({ silent: true });
  }, SYNC_INTERVAL_MS);
}
function stopSyncTimer() {
  if (syncTimer) clearInterval(syncTimer);
  syncTimer = null;
}
function startClock() {
  updateDailyGameCard();
  clockTimer = setInterval(() => {
    updateDailyGameCard();
    if (!gameModal.classList.contains("hidden")) renderGameModal();
  }, 1000);
}

const SYNC_RETRY_DELAYS = [2000, 5000, 10000];

function cancelSyncRetry() {
  if (syncRetryTimer) window.clearTimeout(syncRetryTimer);
  syncRetryTimer = null;
}

function scheduleSyncRetry(reason = "retry") {
  cancelSyncRetry();
  if (!appReady || !currentUser || syncRetryIndex >= SYNC_RETRY_DELAYS.length) return;

  const delayMs = SYNC_RETRY_DELAYS[syncRetryIndex];
  syncRetryIndex += 1;
  syncRetryTimer = window.setTimeout(() => {
    syncRetryTimer = null;
    if (!appReady || !currentUser || document.hidden) return;
    loadAllData({ silent: true, reason });
  }, delayMs);
}

function settledSyncValue(results, jobs, key) {
  const index = jobs.findIndex(job => job.key === key);
  if (index < 0) return { ok: false, value: undefined };
  const result = results[index];
  return result?.status === "fulfilled"
    ? { ok: true, value: result.value }
    : { ok: false, value: undefined, error: result?.reason };
}

async function loadAllData({ silent = false, reason = "normal" } = {}) {
  if (!currentUser || !supabaseClient) return;
  if (syncInFlight) return syncInFlight;

  if (navigator.onLine === false) {
    setSyncState("error", "Sin conexión · reintentando…");
    return { ok: false, failures: ["offline"] };
  }

  syncInFlight = (async () => {
    if (!silent || reason === "manual" || reason === "online") {
      setSyncState("loading", "Sincronizando…");
    }

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
        console.error(`JaviEats 3.1: fallo parcial en ${jobs[index].key}`, result.reason);
      }
    });

    const proposals = settledSyncValue(results, jobs, "proposals");
    if (proposals.ok && Array.isArray(proposals.value)) state.proposals = proposals.value;

    const vouchers = settledSyncValue(results, jobs, "vouchers");
    if (vouchers.ok && Array.isArray(vouchers.value)) state.vouchers = vouchers.value;

    const game = settledSyncValue(results, jobs, "game");
    if (game.ok && game.value) {
      dailyGame = game.value.game || null;
      dailyRounds = Array.isArray(game.value.rounds) ? game.value.rounds : [];
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

    if (!failures.length) {
      syncRetryIndex = 0;
      cancelSyncRetry();
      setSyncState("ok", `Sincronizado · ${currentTimeLabel()}`);
    } else {
      setSyncState("error", "Sincronización parcial · reintentando…");
      scheduleSyncRetry("partial");
    }

    return { ok: !failures.length, failures };
  })()
    .catch(error => {
      console.error("JaviEats 3.1: error de sincronización", error);
      setSyncState(
        "error",
        navigator.onLine === false
          ? "Sin conexión · reintentando…"
          : "Error de sincronización · reintentando…"
      );
      scheduleSyncRetry("error");
      if (!silent) showToast("No se han podido cargar todos los datos. JaviEats volverá a intentarlo.");
      return { ok: false, failures: ["sync"] };
    })
    .finally(() => {
      syncInFlight = null;
    });

  return syncInFlight;
}

async function fetchProposals() {
  const { data, error } = await supabaseClient.from("propuestas").select("*").order("plan_date", { ascending: true }).order("plan_time", { ascending: true });
  if (error) throw error;
  return data || [];
}
async function fetchYSiCurrent() {
  const { data, error } = await supabaseClient.rpc("obtener_y_si_actual");
  if (error) throw error;
  return data || null;
}
async function fetchYSiHistory() {
  const { data, error } = await supabaseClient.rpc("obtener_y_si_historial");
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}
async function fetchVouchers() {
  const { data, error } = await supabaseClient.from("vales").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchNotifications() {
  const { data, error } = await supabaseClient
    .from("notificaciones")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return { notifications: data || [], loadError: false };
}


async function fetchRemoteMemories() {
  const { data, error } = await supabaseClient
    .from("recuerdos_app")
    .select("*")
    .order("fecha", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;

  const rows = Array.isArray(data) ? data : [];
  const allPaths = [...new Set(rows.flatMap(memory => Array.isArray(memory.image_paths) ? memory.image_paths : []).filter(Boolean))];
  await ensureMemorySignedUrls(allPaths);

  return {
    memories: rows.map(memory => ({
      ...memory,
      signedUrls: (Array.isArray(memory.image_paths) ? memory.image_paths : []).map(path => memorySignedUrlCache.get(path)?.url || "")
    })),
    loadError: false
  };
}

async function ensureMemorySignedUrls(paths) {
  const now = Date.now();
  const missing = paths.filter(path => {
    const cached = memorySignedUrlCache.get(path);
    return !cached || cached.expiresAt - now <= MEMORY_SIGNED_URL_REFRESH_MARGIN_MS;
  });
  if (!missing.length) return;

  const { data, error } = await supabaseClient.storage
    .from(MEMORY_STORAGE_BUCKET)
    .createSignedUrls(missing, MEMORY_SIGNED_URL_SECONDS);
  if (error) throw error;

  (data || []).forEach((item, index) => {
    const path = item?.path || missing[index];
    if (!path || !item?.signedUrl) return;
    memorySignedUrlCache.set(path, {
      url: item.signedUrl,
      expiresAt: now + (MEMORY_SIGNED_URL_SECONDS * 1000)
    });
  });
}

async function refreshRemoteMemories() {
  const result = await fetchRemoteMemories();
  state.remoteMemories = result.memories;
  state.memoryLoadError = false;
  renderMemories();
}

async function fetchPuzzleProgress() {
  const { data: puzzle, error } = await supabaseClient
    .from("puzzles_premio")
    .select("*")
    .eq("beneficiaria_id", USER_IDS.LAURA)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!puzzle) return { puzzle: null, pieces: [] };

  const { data: pieces, error: piecesError } = await supabaseClient
    .from("piezas_puzzle")
    .select("*")
    .eq("puzzle_id", puzzle.id)
    .order("numero_pieza", { ascending: true });
  if (piecesError) throw piecesError;
  return { puzzle, pieces: pieces || [] };
}
async function fetchTodayGame(dateKey) {
  const { data: game, error } = await supabaseClient.from("retos_diarios").select("*").eq("fecha", dateKey).maybeSingle();
  if (error) throw error;
  if (!game) return { game: null, rounds: [] };
  const { data: rounds, error: roundsError } = await supabaseClient.from("rondas_reto").select("*").eq("reto_id", game.id).order("numero", { ascending: true });
  if (roundsError) throw roundsError;
  return { game, rounds: rounds || [] };
}

function setSyncState(type, text) {
  syncStatus.textContent = text;
  syncStatus.classList.toggle("is-loading", type === "loading");
  syncStatus.classList.toggle("is-error", type === "error");
}
function refreshUI() {
  renderStats();
  renderBookings();
  renderCalendar();
  renderYSi();
  renderMemories();
  renderVouchers();
  renderPuzzleProgress();
  renderNotifications();
  updateDailyGameCard();
  window.dispatchEvent(new CustomEvent("javieats:data"));
}

function renderServices() {
  featuredServices.innerHTML = SERVICES.slice(0, 3).map(serviceTemplate).join("");
  allServices.innerHTML = SERVICES.map(serviceTemplate).join("");
  document.querySelectorAll("[data-service]").forEach(card => {
    card.addEventListener("click", () => openService(card.dataset.service));
  });
}
function serviceTemplate(service) {
  const actionText = "Proponer plan";
  return `<button class="service-card" type="button" data-service="${service.id}">
    <div class="service-row"><div class="service-icon">${service.icon}</div><div>
      <p class="eyebrow">${escapeHTML(service.category)}</p><h3>${escapeHTML(service.title)}</h3>
      <p>${escapeHTML(service.description)}</p>
      <div class="chips"><span class="chip">⏱️ ${escapeHTML(service.eta)}</span><span class="chip">${actionText}</span></div>
          </div></div></button>`;
}

function openService(id, options = {}) {
  const service = SERVICES.find(item => item.id === id);
  if (!service) return;
  proposalForm.reset();
  proposalForm.classList.remove("hidden");
  proposalSuccess.classList.add("hidden");
  lastProposalTicket = null;
  serviceId.value = service.id;
  modalIcon.textContent = service.icon;
  modalCategory.textContent = service.category;
  modalTitle.textContent = service.title;
  modalDescription.textContent = service.description;
  modalList.innerHTML = service.bullets.map(item => `<li>${escapeHTML(item)}</li>`).join("");
  proposalDuration.innerHTML = service.durations.map(item => `<option value="${escapeHTML(item)}">${escapeHTML(item)}</option>`).join("");
  proposalNote.required = Boolean(service.requiresNote);
  proposalNote.placeholder = service.notePlaceholder || "Cuéntale a Javi cualquier detalle...";
  proposalNoteHint.textContent = service.requiresNote ? "Obligatorio en este servicio" : "Opcional";
  proposalStatus.textContent = "";
  setMinDate();
  if (options.duration && service.durations.includes(options.duration)) proposalDuration.value = options.duration;
  if (options.note) proposalNote.value = options.note;
  serviceModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeServiceModal() {
  serviceModal.classList.add("hidden");
  document.body.style.overflow = "";
  proposalForm.classList.remove("hidden");
  proposalSuccess.classList.add("hidden");
  proposalStatus.textContent = "";
  lastProposalTicket = null;
}

async function handleProposal(event) {
  event.preventDefault();
  if (!currentUser) return;
  const service = SERVICES.find(item => item.id === serviceId.value);
  if (!service) return;
  if (service.requiresNote && !proposalNote.value.trim()) {
    proposalStatus.textContent = "En este servicio tienes que explicar qué plan te apetece.";
    proposalNote.focus();
    return;
  }
  proposalSubmit.disabled = true;
  proposalStatus.textContent = "Guardando en el calendario compartido...";
  const payload = {
    created_by: currentUser.id,
    entry_type: "service",
    is_all_day: false,
    service_id: service.id,
    service_title: service.title,
    service_icon: service.icon,
    category: service.category,
    plan_date: proposalDate.value,
    plan_time: proposalTime.value,
    duration: proposalDuration.value,
    priority: proposalPriority.value,
    note: proposalNote.value.trim(),
    status: "pendiente"
  };
  try {
    const { data, error } = await supabaseClient.from("propuestas").insert(payload).select().single();
    if (error) throw error;
    state.proposals.push(data);
    state.proposals.sort(sortProposalsByDate);
    lastProposalTicket = data;
    refreshUI(); renderProposalSuccess(data);
    proposalForm.classList.add("hidden");
    proposalSuccess.classList.remove("hidden");
    showToast("Propuesta guardada en el calendario compartido.");
  } catch (error) {
    console.error(error);
    proposalStatus.textContent = "No se ha podido guardar la propuesta. Revisa la conexión.";
  } finally {
    proposalSubmit.disabled = false;
  }
}

function renderProposalSuccess(proposal) {
  proposalTicketPreview.innerHTML = `<strong>${proposal.service_icon} ${escapeHTML(proposal.service_title)}</strong>
    <p>📅 ${formatDate(proposal.plan_date)}</p><p>🕒 ${formatTime(proposal.plan_time)} · ${escapeHTML(proposal.duration)}</p>
    <p>💭 ${escapeHTML(proposal.priority)}</p>${proposal.note ? `<p>📝 ${escapeHTML(proposal.note)}</p>` : ""}`;
}

function openCustomPlanModal() {
  customPlanForm.reset();
  customPlanStatus.textContent = "";
  customPlanDate.value = selectedDate || toDateKeyMadrid(new Date());
  customPlanDate.min = toDateKeyMadrid(new Date());
  customPlanAllDay.checked = false;
  customPlanTime.value = "";
  updateCustomPlanTimeVisibility();
  customPlanModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => customPlanTitle.focus(), 100);
}
function closeCustomPlanModal() {
  customPlanModal.classList.add("hidden");
  document.body.style.overflow = "";
  customPlanStatus.textContent = "";
}
function updateCustomPlanTimeVisibility() {
  const isAllDay = customPlanAllDay.checked;
  customPlanTimeLabel.classList.toggle("hidden", isAllDay);
  if (isAllDay) customPlanTime.value = "";
}
async function handleCustomPlan(event) {
  event.preventDefault();
  if (!currentUser) return;
  const title = customPlanTitle.value.trim();
  const description = customPlanDescription.value.trim();
  const isAllDay = customPlanAllDay.checked;
  if (!title) {
    customPlanStatus.textContent = "Escribe un título para el plan.";
    customPlanTitle.focus();
    return;
  }
  if (!isAllDay && !customPlanTime.value) {
    customPlanStatus.textContent = "Elige una hora o marca Todo el día.";
    customPlanTime.focus();
    return;
  }
  customPlanSubmit.disabled = true;
  customPlanStatus.textContent = "Guardando en el calendario compartido...";
  const payload = {
    created_by: currentUser.id,
    entry_type: "custom",
    service_id: "custom",
    service_title: title,
    service_icon: "📌",
    category: "Plan libre",
    plan_date: customPlanDate.value,
    plan_time: isAllDay ? "12:00" : customPlanTime.value,
    is_all_day: isAllDay,
    duration: isAllDay ? "Todo el día" : "Plan libre",
    priority: "Compartido",
    note: description,
    status: "pendiente"
  };
  try {
    const { data, error } = await supabaseClient.from("propuestas").insert(payload).select().single();
    if (error) throw error;
    state.proposals.push(data);
    state.proposals.sort(sortProposalsByDate);
    selectedDate = data.plan_date;
    const [year, month] = data.plan_date.split("-").map(Number);
    calendarDate = new Date(year, month - 1, 1);
    refreshUI();
    customPlanStatus.textContent = "Plan guardado.";
    showToast("Plan añadido al calendario.");
    setTimeout(closeCustomPlanModal, 550);
  } catch (error) {
    console.error(error);
    customPlanStatus.textContent = "No se ha podido guardar el plan.";
  } finally {
    customPlanSubmit.disabled = false;
  }
}

function renderStats() {
  totalProposals.textContent = state.proposals.length;
  const now = new Date();
  const future = state.proposals.filter(p => !["cancelada", "realizada"].includes(p.status) && proposalToDate(p) >= now).sort(sortProposalsByDate);
  nextPlan.textContent = future[0] ? shortDate(future[0].plan_date) : "—";
}

function renderBookings() {
  const proposals = [...state.proposals].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  bookingList.innerHTML = proposals.length ? proposals.map(bookingTemplate).join("") : `<div class="empty">Todavía no hay planes en el calendario compartido.</div>`;
}

function bookingTemplate(proposal) {
  const isCustom = proposal.entry_type === "custom";
  const timeText = proposal.is_all_day ? "Todo el día" : formatTime(proposal.plan_time);
  return `<article class="booking-card">
    <div class="booking-top"><div>
      <div class="booking-title">${proposal.service_icon} ${escapeHTML(proposal.service_title)}</div>
      <p>${formatDate(proposal.plan_date)} · ${timeText}${!isCustom ? ` · ${escapeHTML(proposal.duration)}` : ""}</p>
      ${isCustom ? `<span class="booking-type">Plan compartido</span>` : ""}
    </div>${!isCustom ? `<span class="status status-${proposal.status}">${statusLabel(proposal.status)}</span>` : ""}</div>
    ${!isCustom ? `<p><strong>Nivel:</strong> ${escapeHTML(proposal.priority)}</p>` : ""}
    ${proposal.note ? `<p><strong>${isCustom ? "Descripción:" : "Nota:"}</strong> ${escapeHTML(proposal.note)}</p>` : ""}
    ${bookingActionsTemplate(proposal)}
  </article>`;
}

function bookingActionsTemplate(proposal) {
  const actions = [];
  const ownsPlan = proposal.created_by === currentUser?.id;
  const isSharedUser = currentRole === "javi" || currentRole === "laura";
  if (!isSharedUser) return "";

  actions.push(`<button class="action-edit" type="button" data-proposal-edit="${proposal.id}">Editar</button>`);
  if (proposal.status === "pendiente" && !ownsPlan) {
    actions.push(actionButton(proposal.id, "confirmada", "Aceptar", "action-confirm"));
    actions.push(actionButton(proposal.id, "cancelada", "Rechazar", "action-cancel"));
  } else if (proposal.status === "pendiente" && ownsPlan) {
    actions.push(actionButton(proposal.id, "cancelada", "Cancelar propuesta", "action-cancel"));
  } else if (proposal.status === "confirmada") {
    actions.push(actionButton(proposal.id, "realizada", "Marcar realizado", "action-complete"));
    actions.push(actionButton(proposal.id, "cancelada", "Cancelar", "action-cancel"));
  }
  actions.push(deleteProposalButton(proposal.id));
  return `<div class="booking-actions">${actions.join("")}</div>`;
}
function actionButton(id, status, text, className) {
  return `<button class="${className}" type="button" data-proposal-status="${status}" data-proposal-id="${id}">${text}</button>`;
}
function deleteProposalButton(id) {
  return `<button class="action-delete" type="button" data-proposal-delete="${id}">Eliminar</button>`;
}

async function handleBookingAction(event) {
  const statusButton = event.target.closest("[data-proposal-status]");
  const deleteButton = event.target.closest("[data-proposal-delete]");
  const editButton = event.target.closest("[data-proposal-edit]");
  if (statusButton) await updateProposalStatus(statusButton.dataset.proposalId, statusButton.dataset.proposalStatus);
  if (deleteButton) await deleteProposal(deleteButton.dataset.proposalDelete);
  if (editButton) window.dispatchEvent(new CustomEvent("javieats:edit-plan", { detail: { id: editButton.dataset.proposalEdit } }));
}
async function updateProposalStatus(id, newStatus) {
  try {
    const { data, error } = await supabaseClient.from("propuestas").update({ status: newStatus }).eq("id", id).select().single();
    if (error) throw error;
    state.proposals = state.proposals.map(item => item.id === id ? data : item);
    refreshUI();
    showToast(`Propuesta ${statusLabel(newStatus).toLowerCase()}.`);
  } catch (error) { console.error(error); showToast("No se ha podido actualizar la propuesta."); }
}
async function deleteProposal(id) {
  if (!confirm("¿Seguro que quieres eliminar este plan del calendario compartido?")) return;
  try {
    const { error } = await supabaseClient.from("propuestas").delete().eq("id", id);
    if (error) throw error;
    state.proposals = state.proposals.filter(item => item.id !== id);
    refreshUI();
    showToast("Plan eliminado.");
      } catch (error) { console.error(error); showToast("No se ha podido eliminar el plan."); }
}
async function clearSharedCalendar() {
  if (currentRole !== "javi") return;
  if (!confirm("Esto borrará todos los planes del calendario compartido para los dos. ¿Continuar?")) return;
  try {
    const { error } = await supabaseClient.from("propuestas").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;
    state.proposals = [];
    refreshUI();
    showToast("Calendario compartido limpiado.");
  } catch (error) { console.error(error); showToast("No se ha podido limpiar el calendario."); }
}

function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  calendarTitle.textContent = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(calendarDate);
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const todayKey = toDateKeyMadrid(new Date());
  let html = "";
  for (let i = 0; i < startOffset; i++) html += `<button class="day is-empty" type="button"></button>`;
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const hasBooking = state.proposals.some(p => p.plan_date === key && p.status !== "cancelada");
    html += `<button class="day ${key === todayKey ? "is-today" : ""} ${key === selectedDate ? "is-selected" : ""} ${hasBooking ? "has-booking" : ""}" type="button" data-date="${key}">${day}</button>`;
  }
  calendarGrid.innerHTML = html;
  calendarGrid.querySelectorAll("[data-date]").forEach(button => {
    button.addEventListener("click", () => { selectedDate = button.dataset.date; renderCalendar(); });
  });
  renderDayDetail();
}
function renderDayDetail() {
  const proposals = state.proposals.filter(p => p.plan_date === selectedDate).sort(sortProposalsByDate);
  selectedTitle.textContent = formatDate(selectedDate);
  dayBookings.innerHTML = proposals.length ? proposals.map(bookingTemplate).join("") : `<div class="empty">No hay planes para este día.</div>`;
}


function ySiOptionLabel(current, optionNumber) {
  const options = Array.isArray(current?.opciones) ? current.opciones : [];
  const index = Number(optionNumber) - 1;
  return index >= 0 && index < options.length ? String(options[index]) : "—";
}

function calculateYSiStats() {
  const history = Array.isArray(state.ySiHistory) ? [...state.ySiHistory] : [];
  history.sort((a, b) => {
    const aKey = String(a.cerrada_at || `${a.fecha}T00:00:00`);
    const bKey = String(b.cerrada_at || `${b.fecha}T00:00:00`);
    return aKey.localeCompare(bKey);
  });
  const total = history.length;
  const matches = history.filter(item => Boolean(item.coincide)).length;
  const compatibility = total ? Math.round((matches / total) * 100) : 0;
  let streak = 0;
  let bestStreak = 0;
  for (const item of history) {
    if (item.coincide) {
      streak += 1;
      bestStreak = Math.max(bestStreak, streak);
    } else {
      streak = 0;
    }
  }
  return { total, matches, compatibility, bestStreak };
}

function updateYSiCompatibility() {
  const stats = calculateYSiStats();
  const percent = Math.min(100, Math.max(0, stats.compatibility));
  ySiCompatibility.textContent = `${percent}%`;
  ySiSharedCount.textContent = String(stats.total);
  ySiMatchCount.textContent = String(stats.matches);
  ySiBestStreak.textContent = String(stats.bestStreak);

  const heartHeight = 92 * (percent / 100);
  ySiHeartFill.setAttribute("y", String(92 - heartHeight));
  ySiHeartFill.setAttribute("height", String(heartHeight));

  if (!stats.total) {
    ySiCompatibilityTitle.textContent = "Aún está por descubrir";
    ySiCompatibilityText.textContent = "Responded vuestra primera pregunta para empezar a llenar el corazón.";
  } else if (percent >= 80) {
    ySiCompatibilityTitle.textContent = "Muchas coincidencias";
    ySiCompatibilityText.textContent = `Coincidís en ${stats.matches} de ${stats.total} preguntas compartidas.`;
  } else if (percent >= 60) {
    ySiCompatibilityTitle.textContent = "Bastantes puntos en común";
    ySiCompatibilityText.textContent = `Coincidís en ${stats.matches} de ${stats.total} preguntas compartidas.`;
  } else if (percent >= 40) {
    ySiCompatibilityTitle.textContent = "Una mezcla interesante";
    ySiCompatibilityText.textContent = `Coincidís en ${stats.matches} de ${stats.total} preguntas compartidas.`;
  } else {
    ySiCompatibilityTitle.textContent = "Muchas respuestas distintas";
    ySiCompatibilityText.textContent = `Coincidís en ${stats.matches} de ${stats.total} preguntas compartidas.`;
  }
}

function getTodayLatestYSiResult(history = state.ySiHistory) {
  const today = toDateKeyMadrid(new Date());
  return (Array.isArray(history) ? history : []).find(item => item?.fecha === today) || null;
}

function renderYSiDailySummary(current) {
  const completed = Math.min(5, Math.max(0, Number(current?.completadas_hoy) || 0));
  const matches = Math.min(completed, Math.max(0, Number(current?.coincidencias_hoy) || 0));
  ySiTodayTitle.textContent = `${completed} de 5 completadas`;
  ySiTodayText.textContent = completed
    ? `${matches} ${matches === 1 ? "coincidencia" : "coincidencias"} hoy · cada resultado cuenta para vuestra compatibilidad.`
    : "Podéis completar hasta cinco situaciones juntos hoy.";

  ySiDailyDots.innerHTML = Array.from({ length: 5 }, (_, index) => {
    const done = index < completed;
    return `<span class="y-si-daily-dot${done ? " is-done" : ""}" aria-hidden="true">${done ? "♥" : ""}</span>`;
  }).join("");
}

function renderYSiOptions(current) {
  if (!current || current.limite_alcanzado || !Array.isArray(current.opciones)) {
    ySiOptions.innerHTML = "";
    ySiSubmit.classList.add("hidden");
    ySiSkip.classList.add("hidden");
    return;
  }
  const ownAnswer = Number(current.mi_respuesta) || null;
  const locked = Boolean(ownAnswer || current.ambos_respondieron);
  ySiOptions.innerHTML = current.opciones.map((option, index) => {
    const number = index + 1;
    const selected = number === (ownAnswer || ySiSelectedOption);
    return `<button class="y-si-option${selected ? " is-selected" : ""}" type="button" role="radio" aria-checked="${selected ? "true" : "false"}" data-y-si-option="${number}" ${locked ? "disabled" : ""}><span class="y-si-option-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHTML(String(option))}</span></button>`;
  }).join("");

  ySiSubmit.disabled = locked || !ySiSelectedOption;
  ySiSubmit.classList.toggle("hidden", locked);
  ySiSkip.classList.toggle("hidden", locked || !current.salto_disponible);
  ySiSkip.disabled = !current.salto_disponible;
}

function renderYSiResult() {
  const result = state.ySiLastResult;
  if (!result?.id) {
    ySiResult.classList.add("hidden");
    ySiResultLoading.classList.add("hidden");
    ySiResultContent.classList.remove("hidden");
    return;
  }

  const match = Boolean(result.coincide);
  ySiResult.classList.remove("hidden");
  ySiResultMeta.textContent = `Último resultado · pregunta ${Number(result.posicion_dia) || "—"} de 5`;
  ySiResultIcon.textContent = match ? "💞" : "👀";
  ySiResultTitle.textContent = match ? "¡Coincidencia!" : "Esta vez pensáis diferente";
  ySiResultCopy.textContent = match
    ? "Habéis elegido exactamente la misma opción."
    : "Dos respuestas distintas para la misma situación.";
  ySiJaviAnswer.textContent = ySiOptionLabel(result, result.javi_respuesta);
  ySiLauraAnswer.textContent = ySiOptionLabel(result, result.laura_respuesta);
  ySiSpecial.classList.toggle("hidden", !(match && result.destacada));

  if (ySiRevealInProgress) {
    ySiResultLoading.classList.remove("hidden");
    ySiResultContent.classList.add("hidden");
  } else {
    ySiResultLoading.classList.add("hidden");
    ySiResultContent.classList.remove("hidden");
  }
}

function renderYSi() {
  updateYSiCompatibility();
  const current = state.ySiCurrent;

  if (!current) {
    ySiQuestionDate.textContent = "¿Y si…?";
    ySiOptions.innerHTML = "";
    ySiSubmit.classList.add("hidden");
    ySiSkip.classList.add("hidden");
    ySiResult.classList.add("hidden");
    renderYSiDailySummary(null);
    if (state.ySiLoadError) {
      ySiStatusBadge.textContent = "No disponible";
      ySiQuestionText.textContent = "No se ha podido cargar la pregunta compartida.";
      ySiStatusNote.textContent = "Aplica la migración v2.5.1 de Supabase y vuelve a intentarlo.";
    } else {
      ySiStatusBadge.textContent = "Preparando…";
      ySiQuestionText.textContent = "Cargando pregunta…";
      ySiStatusNote.textContent = "";
    }
    renderYSiHistory();
    return;
  }

  renderYSiDailySummary(current);
  renderYSiResult();

  if (current.limite_alcanzado) {
    ySiSelectedDayId = null;
    ySiSelectedOption = null;
    ySiStatusBadge.textContent = "5/5 completadas";
    ySiQuestionDate.textContent = "Ronda de hoy terminada";
    ySiQuestionText.textContent = "Ya habéis completado las cinco preguntas de hoy ❤️";
    ySiStatusNote.textContent = `Habéis coincidido ${Number(current.coincidencias_hoy) || 0} de 5 veces. Mañana el contador vuelve a 0/5 con una pregunta nueva.`;
    ySiOptions.innerHTML = "";
    ySiSubmit.classList.add("hidden");
    ySiSkip.classList.add("hidden");
    renderYSiHistory();
    return;
  }

  if (ySiSelectedDayId !== current.id) {
    ySiSelectedDayId = current.id;
    ySiSelectedOption = null;
  }

  const position = Number(current.posicion_dia) || Math.min(5, (Number(current.completadas_hoy) || 0) + 1);
  ySiQuestionDate.textContent = `Pregunta ${position} de 5 de hoy · ${current.categoria || "General"}`;
  ySiQuestionText.textContent = current.pregunta;

  const iAmJavi = currentRole === "javi";
  const otherName = iAmJavi ? "Laura" : "Javi";
  const otherAnswered = iAmJavi ? current.laura_ha_respondido : current.javi_ha_respondido;

  if (current.mi_respuesta) {
    ySiStatusBadge.textContent = `Esperando a ${otherName}`;
    ySiStatusNote.textContent = `Tu respuesta está guardada. JaviEats avisará a ${otherName} por Push si lo tiene activo; si no, usará el correo de turno.`;
  } else if (otherAnswered) {
    ySiStatusBadge.textContent = "Te toca";
    ySiStatusNote.textContent = `${otherName} ya ha respondido. Su elección permanece oculta hasta que tú contestes.`;
  } else {
    ySiStatusBadge.textContent = "Nueva pregunta";
    ySiStatusNote.textContent = current.salto_disponible
      ? "Elige una opción. También tenéis un cambio de pregunta disponible hoy."
      : "Elige una opción. Tu respuesta no se enseñará hasta que ambos hayáis contestado.";
  }

  renderYSiOptions(current);
  renderYSiHistory();
}

function handleYSiOptionClick(event) {
  const button = event.target.closest("[data-y-si-option]");
  if (!button || button.disabled || state.ySiCurrent?.mi_respuesta) return;
  ySiSelectedOption = Number(button.dataset.ySiOption);
  renderYSiOptions(state.ySiCurrent);
}

async function handleYSiAnswer() {
  if (!currentUser || !state.ySiCurrent || state.ySiCurrent.limite_alcanzado || !ySiSelectedOption || state.ySiCurrent.mi_respuesta) return;
  ySiSubmit.disabled = true;
  ySiSkip.disabled = true;
  ySiStatusNote.textContent = "Guardando tu respuesta…";
  try {
    const { data, error } = await supabaseClient.rpc("responder_y_si", { p_opcion: ySiSelectedOption });
    if (error) throw error;

    state.ySiCurrent = data?.actual || state.ySiCurrent;
    if (data?.resultado?.id) state.ySiLastResult = data.resultado;
    state.ySiHistory = await fetchYSiHistory();
    if (!data?.resultado?.id) state.ySiLastResult = getTodayLatestYSiResult(state.ySiHistory);
    ySiSelectedOption = null;
    renderYSi();
    showToast(data?.resultado?.id ? "¡Los dos habéis respondido! Ya tenéis otra pregunta." : "Respuesta guardada. Ahora le toca a la otra persona.");
    if (data?.resultado?.id) maybeRevealYSiResult({ force: true });
  } catch (error) {
    console.error(error);
    ySiStatusNote.textContent = friendlyYSiError(error);
    ySiSubmit.disabled = false;
    ySiSkip.disabled = false;
  }
}

async function handleYSiSkip() {
  if (!currentUser || !state.ySiCurrent?.id || !state.ySiCurrent.salto_disponible) return;
  ySiSkip.disabled = true;
  ySiSubmit.disabled = true;
  ySiStatusNote.textContent = "Buscando otra pregunta…";
  try {
    const { data, error } = await supabaseClient.rpc("saltar_y_si_actual");
    if (error) throw error;
    state.ySiCurrent = data;
    ySiSelectedOption = null;
    ySiSelectedDayId = data?.id || null;
    renderYSi();
    showToast("Pregunta cambiada. Este era el cambio disponible de hoy.");
  } catch (error) {
    console.error(error);
    ySiStatusNote.textContent = friendlyYSiError(error);
    renderYSiOptions(state.ySiCurrent);
  }
}

function maybeRevealYSiResult({ force = false } = {}) {
  const result = state.ySiLastResult;
  if (!result?.id) return;
  const key = `javieats_y_si_revealed_${result.id}`;
  if (!force && sessionStorage.getItem(key) === "true") return;
  if (ySiRevealTimer) clearTimeout(ySiRevealTimer);
  ySiRevealInProgress = true;
  renderYSiResult();
  ySiRevealTimer = setTimeout(() => {
    ySiRevealInProgress = false;
    ySiResultLoading.classList.add("hidden");
    ySiResultContent.classList.remove("hidden");
    ySiResultContent.classList.remove("is-revealed");
    void ySiResultContent.offsetWidth;
    ySiResultContent.classList.add("is-revealed");
    sessionStorage.setItem(key, "true");
    ySiRevealTimer = null;
  }, Y_SI_REVEAL_MS);
}

function openYSiHistoryModal() {
  renderYSiHistory();
  ySiHistoryModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeYSiHistoryModal() {
  ySiHistoryModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function setYSiHistoryFilter(filter) {
  ySiHistoryFilter = ["all", "match", "different"].includes(filter) ? filter : "all";
  document.querySelectorAll("[data-y-si-filter]").forEach(button => {
    button.classList.toggle("is-active", button.dataset.ySiFilter === ySiHistoryFilter);
  });
  renderYSiHistory();
}

function renderYSiHistory() {
  if (!ySiHistoryList || !ySiHistorySummary) return;
  const history = Array.isArray(state.ySiHistory) ? state.ySiHistory : [];
  const stats = calculateYSiStats();
  ySiHistorySummary.textContent = stats.total
    ? `${stats.matches} coincidencias en ${stats.total} preguntas compartidas · ${stats.compatibility}% de compatibilidad JaviEats.`
    : "Aquí aparecerán las preguntas que ya habéis respondido los dos.";

  const filtered = history.filter(item => {
    if (ySiHistoryFilter === "match") return Boolean(item.coincide);
    if (ySiHistoryFilter === "different") return !item.coincide;
    return true;
  });

  if (!filtered.length) {
    ySiHistoryList.innerHTML = `<div class="empty">${history.length ? "No hay resultados con este filtro." : "Todavía no habéis completado ninguna pregunta entre los dos."}</div>`;
    return;
  }

  ySiHistoryList.innerHTML = filtered.map(item => {
    const javi = ySiOptionLabel(item, item.javi_respuesta);
    const laura = ySiOptionLabel(item, item.laura_respuesta);
    const position = Number(item.posicion_dia) || 1;
    return `<article class="y-si-history-item ${item.coincide ? "is-match" : "is-different"}">
      <div class="y-si-history-item-top"><span>${item.coincide ? "💞 Coincidencia" : "👀 Diferentes"}</span><time>${escapeHTML(formatDateCompact(item.fecha))} · ${position}/5</time></div>
      <h3>${escapeHTML(item.pregunta)}</h3>
      <div class="y-si-history-answers"><span><b>Javi</b>${escapeHTML(javi)}</span><span><b>Laura</b>${escapeHTML(laura)}</span></div>
      ${item.coincide && item.destacada ? '<p class="y-si-history-special">Coincidencia destacada 👀</p>' : ""}
    </article>`;
  }).join("");
}

function friendlyYSiError(error) {
  const message = String(error?.message || "").toLowerCase();
  if (message.includes("ya has respondido")) return "Ya has respondido esta pregunta.";
  if (message.includes("5 preguntas")) return "Ya habéis completado las cinco preguntas de hoy.";
  if (message.includes("cambiar") || message.includes("salto")) return "El cambio de pregunta de hoy ya no está disponible.";
  if (message.includes("no esta disponible") || message.includes("no está disponible")) return "Esta pregunta ya ha caducado. Cargando una nueva…";
  if (message.includes("opcion") || message.includes("opción")) return "Esa opción no es válida.";
  if (message.includes("acceso")) return "Esta cuenta no puede participar en ¿Y si…?.";
  return "No se ha podido guardar la respuesta. Revisa la conexión.";
}


async function openGameModal() {
  if (currentRole === "laura") {
    try {
      gameHomeButton.disabled = true;
      gameHomeStatus.textContent = "Preparando la partida...";
      const { data, error } = await supabaseClient.rpc("iniciar_reto_diario");
      if (error) throw error;
      dailyGame = data?.reto || null;
      if (dailyGame) {
        const gameData = await fetchTodayGame(dailyGame.fecha);
        dailyGame = gameData.game;
        dailyRounds = gameData.rounds;
      }
    } catch (error) {
      console.error(error);
      showToast(friendlyGameError(error));
      updateDailyGameCard();
      return;
    } finally {
      gameHomeButton.disabled = false;
    }
  }

  if (!dailyGame && currentRole === "javi") {
    showToast("Laura todavía no ha empezado el reto de hoy.");
    return;
  }

  renderGameModal();
  gameModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeGameModal() {
  gameModal.classList.add("hidden");
  document.body.style.overflow = "";
  updateDailyGameCard();
}

async function playGameRound(choice) {
  if (currentRole !== "laura" || !dailyGame || dailyGame.estado === "finalizado" || roundLocked) return;

  roundLocked = true;
  setChoiceButtonsDisabled(true);
  playerChoiceVisual.textContent = CHOICES[choice].emoji;
  playerChoiceLabel.textContent = CHOICES[choice].label;
  machineChoiceVisual.textContent = "❔";
  machineChoiceLabel.textContent = "Eligiendo...";
  machineChoiceVisual.classList.add("thinking");
  gameRoundResult.textContent = "La máquina está eligiendo desde Supabase...";

  try {
    const { data, error } = await supabaseClient.rpc("jugar_ronda_reto", { p_eleccion: choice });
    if (error) throw error;

    dailyGame = data?.reto || dailyGame;
    if (data?.ronda && !dailyRounds.some(round => round.id === data.ronda.id)) {
      dailyRounds.push(data.ronda);
    }

    if (data?.puzzle) {
      if (state.puzzle?.id !== data.puzzle.id) state.puzzlePieces = [];
      state.puzzle = data.puzzle;
    }

    if (data?.pieza) {
      state.puzzlePieces = [
        ...state.puzzlePieces.filter(item => item.id !== data.pieza.id),
        data.pieza
      ].sort((a, b) => a.numero_pieza - b.numero_pieza);
      animatePuzzlePiece(data.pieza.numero_pieza);
    }

    if (data?.vale) {
      state.vouchers = [
        data.vale,
        ...state.vouchers.filter(item => item.id !== data.vale.id)
      ];
    }

    renderGameModal();
    renderVouchers();
    renderPuzzleProgress();
    updateDailyGameCard();

    if (data?.pieza && data?.vale) {
      showToast("¡Puzle completado! Has desbloqueado el masaje de 30 minutos.");
    } else if (data?.pieza) {
      showToast(`¡Nueva pieza! Ya tienes ${getPuzzlePieceCount()} de ${PUZZLE_TOTAL_PIECES}.`);
    }
  } catch (error) {
    console.error(error);
    gameRoundResult.textContent = friendlyGameError(error);
  } finally {
    machineChoiceVisual.classList.remove("thinking");
    roundLocked = false;
    setChoiceButtonsDisabled(false);
  }
}

function renderGameModal() {
  machineChoiceVisual.classList.remove("thinking");
  pieceReveal.classList.add("hidden");
  prizeReveal.classList.add("hidden");

  if (!dailyGame) {
    playerScore.textContent = "0";
    machineScore.textContent = "0";
    gameDraws.textContent = "Empates: 0";
    gameRoundLabel.textContent = "Partida no iniciada";
    gameRoundResult.textContent = "Laura todavía no ha empezado la partida.";
    gameChoices.classList.add("hidden");
    gameFinal.classList.add("hidden");
    return;
  }

  playerScore.textContent = dailyGame.victorias_laura;
  machineScore.textContent = dailyGame.victorias_maquina;
  gameDraws.textContent = `Empates: ${dailyGame.empates}`;
  renderGameRoundHeading();
  renderLastGameRound();

  const finished = dailyGame.estado === "finalizado";
  const canPlay = currentRole === "laura" && !finished;
  gameChoices.classList.toggle("hidden", !canPlay);
  gameFinal.classList.toggle("hidden", !finished);

  if (!finished) {
    gameDailyNote.textContent = dailyGame.en_desempate
      ? "Muerte súbita: el primer resultado que no sea empate decide la partida."
      : dailyGame.rondas_totales > 0
        ? "La partida está guardada en Supabase y puedes continuarla desde otro dispositivo."
        : "El intento de hoy queda asociado a la cuenta de Laura.";
    setChoiceButtonsDisabled(roundLocked || currentRole !== "laura");
    return;
  }

  setChoiceButtonsDisabled(true);

  if (dailyGame.resultado === "ganada") {
    const piece = getPuzzlePieceForCurrentGame();
    const voucher = getVoucherForCurrentGame();
    const completedNow = Boolean(piece && voucher && state.puzzle?.estado === "completado");

    gameFinalIcon.textContent = completedNow ? "💆" : "🧩";
    gameFinalTitle.textContent = completedNow
      ? "Laura ha completado el puzle"
      : "Laura ha ganado el reto diario";
    gameFinalText.textContent = `Resultado final: Laura ${dailyGame.victorias_laura} - ${dailyGame.victorias_maquina} Máquina.`;

    if (piece) {
      pieceReveal.classList.remove("hidden");
      pieceRevealTitle.textContent = completedNow
        ? "¡La sexta pieza está colocada!"
        : `¡Pieza ${piece.numero_pieza} conseguida!`;
      pieceRevealText.textContent = completedNow
        ? "Has reunido las seis piezas. El vale del masaje ya está disponible."
        : `El progreso se ha guardado. Ya tienes ${getPuzzlePieceCount()} de ${PUZZLE_TOTAL_PIECES} piezas.`;
      renderPuzzleGrid(gamePuzzleGrid, { highlightPiece: recentPuzzlePieceNumber });
      gamePuzzleCount.textContent = puzzleCountLabel();
    }

    // Compatibilidad con vales antiguos: si ya existía un vale vinculado a la
    // partida, se sigue mostrando aunque no tenga una pieza del nuevo sistema.
    if (voucher) {
      prizeReveal.classList.remove("hidden");
      prizeTitle.textContent = voucher.titulo || "Masaje de 30 minutos";
      prizeDescription.textContent = voucher.descripcion || "Premio conseguido en JaviEats.";
      redeemVoucherBtn.classList.toggle("hidden", currentRole !== "laura");
    }

    if (completedNow) {
      gameDailyNote.textContent = `Puzle completado. Nuevo intento en ${timeUntilTomorrow()}.`;
    } else if (piece) {
      gameDailyNote.textContent = `La pieza se ha guardado. Nuevo intento en ${timeUntilTomorrow()}.`;
    } else {
      gameDailyNote.textContent = `Victoria registrada. Nuevo intento en ${timeUntilTomorrow()}.`;
    }
  } else {
    gameFinalIcon.textContent = "🤖";
    gameFinalTitle.textContent = "La máquina gana hoy";
    gameFinalText.textContent = `Resultado final: Laura ${dailyGame.victorias_laura} - ${dailyGame.victorias_maquina} Máquina. Mañana habrá un nuevo intento.`;
    gameDailyNote.textContent = state.puzzle?.estado === "completado"
      ? `El puzle completado sigue guardado. Nuevo intento en ${timeUntilTomorrow()}.`
      : `No pierdes ninguna pieza. Nuevo intento en ${timeUntilTomorrow()}.`;
  }
}

function renderGameRoundHeading() {
  if (dailyGame.estado === "finalizado") {
    gameRoundLabel.textContent = dailyGame.rondas_totales > REGULAR_GAME_ROUNDS
      ? "Partida finalizada en muerte súbita"
      : "Partida finalizada";
    return;
  }
  if (dailyGame.en_desempate) {
    gameRoundLabel.textContent = `Muerte súbita · ronda extra ${Math.max(1, dailyGame.rondas_totales - REGULAR_GAME_ROUNDS + 1)}`;
    return;
  }
  gameRoundLabel.textContent = `Ronda ${dailyGame.rondas_regulares + 1} de ${REGULAR_GAME_ROUNDS}`;
}

function renderLastGameRound() {
  if (!dailyRounds.length) {
    playerChoiceVisual.textContent = "❔";
    playerChoiceLabel.textContent = "Sin elegir";
    machineChoiceVisual.textContent = "❔";
    machineChoiceLabel.textContent = "Esperando";
    gameRoundResult.textContent = currentRole === "laura"
      ? "Elige tu jugada para empezar."
      : "Laura todavía no ha realizado ninguna jugada.";
    return;
  }

  const last = dailyRounds[dailyRounds.length - 1];
  playerChoiceVisual.textContent = CHOICES[last.eleccion_laura]?.emoji || "❔";
  playerChoiceLabel.textContent = CHOICES[last.eleccion_laura]?.label || "Sin elegir";
  machineChoiceVisual.textContent = CHOICES[last.eleccion_maquina]?.emoji || "❔";
  machineChoiceLabel.textContent = CHOICES[last.eleccion_maquina]?.label || "Esperando";
  gameRoundResult.textContent = {
    laura: "Laura gana esta ronda.",
    maquina: "La máquina gana esta ronda.",
    empate: "Empate. La ronda cuenta, pero nadie suma victoria."
  }[last.resultado] || "Ronda guardada.";
}

function updateDailyGameCard() {
  if (!gameHomeStatus || !gameHomeButton) return;
  if (!currentUser) {
    gameHomeStatus.textContent = "Inicia sesión para ver el reto diario.";
    gameHomeButton.disabled = true;
    return;
  }

  if (!dailyGame) {
    if (currentRole === "laura") {
      gameHomeStatus.textContent = state.puzzle?.estado === "completado"
        ? "Tu puzle anterior está completo. La próxima victoria empezará uno nuevo."
        : `Partida disponible. Si ganas, sumarás una pieza (${getPuzzlePieceCount()}/${PUZZLE_TOTAL_PIECES}).`;
      gameHomeButton.textContent = "Jugar partida de hoy";
      gameHomeButton.disabled = false;
    } else {
      gameHomeStatus.textContent = "Laura todavía no ha jugado hoy.";
      gameHomeButton.textContent = "Esperando a Laura";
      gameHomeButton.disabled = true;
    }
    updatePuzzleModalContent();
    return;
  }

  gameHomeButton.disabled = false;
  if (dailyGame.estado !== "finalizado") {
    const roundText = dailyGame.en_desempate
      ? "Muerte súbita"
      : `${dailyGame.rondas_regulares} de 5 rondas jugadas`;
    gameHomeStatus.textContent = `${roundText} · Laura ${dailyGame.victorias_laura} - ${dailyGame.victorias_maquina} Máquina · ${dailyGame.empates} empates`;
    gameHomeButton.textContent = currentRole === "laura" ? "Continuar partida" : "Ver partida";
    updatePuzzleModalContent();
    return;
  }

  if (dailyGame.resultado === "ganada") {
    const piece = getPuzzlePieceForCurrentGame();
    const voucher = getVoucherForCurrentGame();
    if (piece && voucher) {
      gameHomeStatus.textContent = `Reto superado · puzle completado · masaje desbloqueado · nuevo intento en ${timeUntilTomorrow()}`;
      gameHomeButton.textContent = "Ver premio";
    } else if (piece) {
      gameHomeStatus.textContent = `Reto superado · pieza conseguida · ${puzzleCountLabel()} · nuevo intento en ${timeUntilTomorrow()}`;
      gameHomeButton.textContent = "Ver pieza";
    } else if (voucher) {
      gameHomeStatus.textContent = `Reto superado · premio desbloqueado · nuevo intento en ${timeUntilTomorrow()}`;
      gameHomeButton.textContent = "Ver premio";
    } else {
      gameHomeStatus.textContent = `Reto superado · nuevo intento en ${timeUntilTomorrow()}`;
      gameHomeButton.textContent = "Ver resultado";
    }
  } else {
    gameHomeStatus.textContent = state.puzzle?.estado === "completado"
      ? `Intento agotado · el puzle completado sigue guardado · nuevo reto en ${timeUntilTomorrow()}`
      : `Intento agotado · conservas ${getPuzzlePieceCount()} de ${PUZZLE_TOTAL_PIECES} piezas · nuevo reto en ${timeUntilTomorrow()}`;
    gameHomeButton.textContent = "Ver resultado";
  }

  updatePuzzleModalContent();
}

function getPuzzlePieceCount() {
  const storedCount = Number(state.puzzle?.piezas_conseguidas);
  if (Number.isFinite(storedCount)) return Math.min(PUZZLE_TOTAL_PIECES, Math.max(0, storedCount));
  return Math.min(PUZZLE_TOTAL_PIECES, state.puzzlePieces.length);
}

function puzzleCountLabel() {
  return `${getPuzzlePieceCount()} de ${PUZZLE_TOTAL_PIECES} piezas`;
}

function getPuzzlePieceForCurrentGame() {
  if (!dailyGame) return null;
  return state.puzzlePieces.find(piece => piece.reto_id === dailyGame.id) || null;
}

function renderPuzzleGrid(container, { highlightPiece = null } = {}) {
  if (!container) return;
  const unlocked = new Set(state.puzzlePieces.map(piece => Number(piece.numero_pieza)));
  const count = getPuzzlePieceCount();

  container.innerHTML = Array.from({ length: PUZZLE_TOTAL_PIECES }, (_, index) => {
    const number = index + 1;
    const isUnlocked = unlocked.has(number);
    const isNew = isUnlocked && Number(highlightPiece) === number;
    return `<span class="puzzle-piece ${isUnlocked ? "is-unlocked" : "is-locked"}${isNew ? " is-new" : ""}" data-piece="${number}" aria-hidden="true"></span>`;
  }).join("");

  container.classList.toggle("is-complete", count === PUZZLE_TOTAL_PIECES);
  container.setAttribute("aria-label", `${count} de ${PUZZLE_TOTAL_PIECES} piezas conseguidas`);
}

function renderPuzzleProgress() {
  const count = getPuzzlePieceCount();
  renderPuzzleGrid(homePuzzleGrid);
  renderPuzzleGrid(puzzleModalGrid);
  renderPuzzleGrid(gamePuzzleGrid, { highlightPiece: recentPuzzlePieceNumber });

  if (homePuzzleCount) homePuzzleCount.textContent = puzzleCountLabel();
  if (gamePuzzleCount) gamePuzzleCount.textContent = puzzleCountLabel();

  if (homePuzzleText) {
    if (state.puzzleLoadError) {
      homePuzzleText.textContent = "No se ha podido cargar el progreso del puzle.";
    } else if (state.puzzle?.estado === "completado") {
      homePuzzleText.textContent = "Puzle completado. El masaje ya está en Mis vales.";
    } else if (count === 0) {
      homePuzzleText.textContent = "La primera victoria descubrirá la primera pieza.";
    } else {
      const remaining = PUZZLE_TOTAL_PIECES - count;
      homePuzzleText.textContent = `Te ${remaining === 1 ? "falta" : "faltan"} ${remaining} ${remaining === 1 ? "pieza" : "piezas"} para desbloquear el masaje.`;
    }
  }

  updatePuzzleModalContent();
}

function updatePuzzleModalContent() {
  if (!puzzleModalTitle || !puzzleModalText || !puzzleModalPrimary) return;
  const count = getPuzzlePieceCount();
  const completed = state.puzzle?.estado === "completado";

  renderPuzzleGrid(puzzleModalGrid);
  puzzleModalCount.textContent = puzzleCountLabel();
  puzzleModalReward.textContent = completed
    ? "Premio desbloqueado: masaje de 30 minutos"
    : "Premio: masaje de 30 minutos";

  if (state.puzzleLoadError) {
    puzzleModalTitle.textContent = "Puzle pendiente de conexión";
    puzzleModalText.textContent = "El resto de JaviEats sigue disponible, pero no se ha podido leer el progreso. Revisa que el SQL de la versión 2.4 esté aplicado.";
  } else if (completed) {
    puzzleModalTitle.textContent = "¡Puzle completado!";
    puzzleModalText.textContent = "Las seis piezas están colocadas y el vale del masaje ya está guardado. Tu próxima victoria comenzará un puzle nuevo.";
  } else if (count === 0) {
    puzzleModalTitle.textContent = "Puzle del masaje";
    puzzleModalText.textContent = "Cada partida diaria ganada descubre una pieza. Reúne las seis para desbloquear un masaje de 30 minutos.";
  } else {
    const remaining = PUZZLE_TOTAL_PIECES - count;
    puzzleModalTitle.textContent = "Tu puzle sigue creciendo";
    puzzleModalText.textContent = `Ya has descubierto ${count} ${count === 1 ? "pieza" : "piezas"}. Te ${remaining === 1 ? "falta" : "faltan"} ${remaining} para conseguir el masaje.`;
  }

  if (currentRole === "laura") {
    puzzleModalPrimary.disabled = false;
    if (!dailyGame) puzzleModalPrimary.textContent = "Jugar reto de hoy";
    else if (dailyGame.estado !== "finalizado") puzzleModalPrimary.textContent = "Continuar reto de hoy";
    else puzzleModalPrimary.textContent = "Ver resultado de hoy";
  } else if (dailyGame) {
    puzzleModalPrimary.disabled = false;
    puzzleModalPrimary.textContent = "Ver reto de hoy";
  } else {
    puzzleModalPrimary.disabled = true;
    puzzleModalPrimary.textContent = "Esperando a Laura";
  }
}

function openPuzzleModal() {
  puzzleWelcomeShown = true;
  renderPuzzleProgress();
  puzzleModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closePuzzleModal() {
  puzzleModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function maybeShowPuzzleWelcome() {
  if (currentRole !== "laura" || puzzleWelcomeShown || !currentUser || state.puzzleLoadError) return;
  puzzleWelcomeShown = true;
  setTimeout(() => {
    if (currentUser && currentRole === "laura" && puzzleModal.classList.contains("hidden")) {
      openPuzzleModal();
    }
  }, 280);
}

function handlePuzzlePrimaryAction() {
  if (puzzleModalPrimary.disabled) return;
  closePuzzleModal();
  openGameModal();
}

function animatePuzzlePiece(pieceNumber) {
  recentPuzzlePieceNumber = Number(pieceNumber);
  if (puzzlePieceAnimationTimer) clearTimeout(puzzlePieceAnimationTimer);
  puzzlePieceAnimationTimer = setTimeout(() => {
    recentPuzzlePieceNumber = null;
    renderPuzzleProgress();
    if (!gameModal.classList.contains("hidden")) renderGameModal();
  }, 2200);
}

function setChoiceButtonsDisabled(disabled) { document.querySelectorAll("[data-choice]").forEach(button => button.disabled = disabled); }

function getVoucherForCurrentGame() { return dailyGame ? state.vouchers.find(v => v.reto_id === dailyGame.id) || null : null; }
function renderVouchers() {
  if (!state.vouchers.length) { voucherList.innerHTML = `<div class="empty">Todavía no hay vales ganados. Completa las 6 piezas del puzle del masaje para conseguir el primero.</div>`; return; }
  voucherList.innerHTML = state.vouchers.map(voucher => {
    const active = voucher.estado === "activo";
    const second = active ? (currentRole === "javi" ? `<button class="btn btn-secondary" type="button" data-voucher-use="${voucher.id}">Marcar canjeado</button>` : `<button class="btn btn-secondary" type="button" data-voucher-redeem="${voucher.id}">Proponer canje</button>`) : "";
    return `<article class="voucher-card"><div class="voucher-mark">JaviEats</div><p class="eyebrow">Premio conseguido · ${shortDate(dateFromTimestamp(voucher.created_at))}</p><h3>${escapeHTML(voucher.titulo)}</h3><p>${escapeHTML(voucher.descripcion)}</p><span class="voucher-state ${active ? "" : "is-used"}">${active ? "Vale activo" : "Vale canjeado"}</span><br><span class="voucher-code">${voucherCode(voucher)}</span><div class="voucher-buttons"><button class="btn btn-primary" type="button" data-voucher-download="${voucher.id}">Descargar vale</button>${second}</div></article>`;
  }).join("");
}
async function handleVoucherAction(event) {
  const downloadButton = event.target.closest("[data-voucher-download]");
  const redeemButton = event.target.closest("[data-voucher-redeem]");
  const useButton = event.target.closest("[data-voucher-use]");
  if (downloadButton) { const v = state.vouchers.find(i => i.id === downloadButton.dataset.voucherDownload); if (v) downloadVoucher(v); }
  if (redeemButton) { const v = state.vouchers.find(i => i.id === redeemButton.dataset.voucherRedeem); if (v) proposeVoucherRedemption(v); }
  if (useButton) await markVoucherAsUsed(useButton.dataset.voucherUse);
}
function proposeVoucherRedemption(voucher) {
  if (currentRole !== "laura") return;
  closeGameModal(); showPage("services");
  openService("masaje", { duration: "30 minutos", note: `Canje del vale ${voucherCode(voucher)} ganado en JaviEats.` });
}
async function markVoucherAsUsed(id) {
  if (currentRole !== "javi" || !confirm("¿Marcar este vale como canjeado?")) return;
  try {
    const { data, error } = await supabaseClient.rpc("canjear_vale", { p_vale_id: id });
    if (error) throw error;
    state.vouchers = state.vouchers.map(item => item.id === id ? data : item);
    renderVouchers(); showToast("Vale marcado como canjeado.");
  } catch (error) { console.error(error); showToast("No se ha podido canjear el vale."); }
}

function renderMemories() {
  const canManage = currentRole === "javi" || currentRole === "laura";
  addMemoryBtn?.classList.toggle("hidden", !canManage);
  memoryStorageNote?.classList.toggle("hidden", !canManage);
  if (memoryStorageNote && canManage) {
    memoryStorageNote.textContent = state.memoryLoadError
      ? "Falta ejecutar una vez supabase-v3.0.sql para activar los recuerdos privados."
      : "Los dos podéis añadir y editar recuerdos. Las fotos se optimizan en el dispositivo y se guardan de forma privada.";
  }

  const staticMemories = MEMORIES.map(memoryTemplate).join("");
  const remoteMemories = state.remoteMemories.map(remoteMemoryTemplate).join("");
  const dynamic = ""; // JaviEats 3.0: los antiguos mensajes de Laura ya no forman parte de Recuerdos.
  memoriesList.innerHTML = staticMemories + remoteMemories + dynamic;
}

function memoryTemplate(memory) {
  return `<article class="memory-card"><div class="timeline-dot"></div><div class="memory-date">${memory.dateLabel}</div>${memory.cover ? `<img class="memory-cover" src="${memory.cover}" alt="${escapeHTML(memory.title)}" loading="lazy" />` : `<div class="memory-placeholder">${memory.emoji || "💌"}</div>`}<div class="memory-body"><h3>${escapeHTML(memory.title)}</h3><p>${escapeHTML(memory.description)}</p><button class="btn btn-secondary memory-open-btn" type="button" data-memory-id="${memory.id}">${memory.actionLabel}</button></div></article>`;
}

function remoteMemoryTemplate(memory) {
  const urls = Array.isArray(memory.signedUrls) ? memory.signedUrls.filter(Boolean) : [];
  const requestedIndex = Number.isInteger(memory.cover_index) ? memory.cover_index : Number(memory.cover_index || 0);
  const cover = urls[requestedIndex] || urls[0] || "";
  const photoCount = Array.isArray(memory.image_paths) ? memory.image_paths.length : urls.length;
  const actionLabel = photoCount > 1 ? `Ver ${photoCount} fotos` : "Ver recuerdo";
  const media = cover
    ? `<img class="memory-cover" src="${cover}" alt="${escapeHTML(memory.titulo)}" loading="lazy" referrerpolicy="no-referrer" />`
    : `<div class="memory-placeholder">📸</div>`;
  const edit = (currentRole === "javi" || currentRole === "laura")
    ? `<button class="btn btn-secondary memory-edit-btn" type="button" data-edit-remote-memory="${memory.id}" aria-label="Editar ${escapeHTML(memory.titulo)}">✎</button>`
    : "";

  return `<article class="memory-card is-remote"><div class="timeline-dot"></div><div class="memory-date">${formatDateCompact(memory.fecha)}</div>${media}<div class="memory-body"><p class="eyebrow">Guardado en JaviEats</p><h3>${escapeHTML(memory.titulo)}</h3><p>${escapeHTML(memory.descripcion || "")}</p><div class="memory-card-actions"><button class="btn btn-secondary memory-open-btn" type="button" data-remote-memory-id="${memory.id}">${actionLabel}</button>${edit}</div></div></article>`;
}

function openMemory(id) {
  const memory = MEMORIES.find(item => item.id === id);
  if (!memory) return;
  if (memory.type === "letter") { letterEyebrow.textContent = memory.letterEyebrow; letterTitle.textContent = memory.letterTitle; showPage("letter"); loadLetter(memory.letterFile); return; }
  currentGallery = memory.images || [];
  currentGalleryIndex = 0;
  memoryModalDate.textContent = memory.dateLabel;
  memoryModalTitle.textContent = memory.title;
  memoryModalDescription.textContent = memory.description;
  renderGalleryImage();
  memoryModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function openRemoteMemory(id) {
  const memory = state.remoteMemories.find(item => item.id === id);
  if (!memory) return;
  currentGallery = (memory.signedUrls || []).filter(Boolean);
  if (!currentGallery.length) {
    showToast("No se ha podido cargar la foto de este recuerdo.");
    return;
  }
  currentGalleryIndex = 0;
  memoryModalDate.textContent = formatDateCompact(memory.fecha);
  memoryModalTitle.textContent = memory.titulo;
  memoryModalDescription.textContent = memory.descripcion || "";
  renderGalleryImage();
  memoryModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function createEmptyMemoryEditorState() {
  return {
    id: null,
    existingPaths: [],
    removedPaths: new Set(),
    newFiles: []
  };
}

function resetMemoryEditorState() {
  for (const item of memoryEditorState?.newFiles || []) {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
  }
  memoryEditorState = createEmptyMemoryEditorState();
  if (memoryPhotoInput) memoryPhotoInput.value = "";
}

function openMemoryEditor(id = null) {
  if (currentRole !== "javi" && currentRole !== "laura") return;
  if (state.memoryLoadError) {
    showToast("Primero aplica supabase-v3.0.sql en Supabase.");
    return;
  }

  resetMemoryEditorState();
  const memory = id ? state.remoteMemories.find(item => item.id === id) : null;
  memoryEditorState.id = memory?.id || null;
  memoryEditorState.existingPaths = Array.isArray(memory?.image_paths) ? [...memory.image_paths] : [];

  memoryEditorEyebrow.textContent = memory ? "Editar recuerdo" : "Nuevo recuerdo";
  memoryEditorTitle.textContent = memory ? "Actualizar este momento" : "Guardar un momento";
  memoryEditorDate.value = memory?.fecha || toDateKeyMadrid(new Date());
  memoryEditorName.value = memory?.titulo || "";
  memoryEditorDescription.value = memory?.descripcion || "";
  memoryDeleteBtn.classList.toggle("hidden", !memory);
  setMemoryUploadStatus("");
  renderMemoryPhotoGrid();

  memoryEditorModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  setTimeout(() => memoryEditorName.focus(), 80);
}

function closeMemoryEditor() {
  if (memoryEditorBusy) return;
  memoryEditorModal?.classList.add("hidden");
  document.body.style.overflow = "";
  resetMemoryEditorState();
  setMemoryUploadStatus("");
}

function getRetainedMemoryPaths() {
  return memoryEditorState.existingPaths.filter(path => !memoryEditorState.removedPaths.has(path));
}

function renderMemoryPhotoGrid() {
  if (!memoryPhotoGrid) return;
  const retained = getRetainedMemoryPaths();
  const existingHtml = retained.map((path, index) => {
    const url = memorySignedUrlCache.get(path)?.url || "";
    return `<div class="memory-photo-item">${url ? `<img src="${url}" alt="Foto guardada ${index + 1}" />` : `<div class="memory-placeholder">📷</div>`}<span class="memory-photo-badge">Guardada</span><button class="memory-photo-remove" type="button" data-remove-existing-photo="${escapeHTML(path)}" aria-label="Quitar foto">×</button></div>`;
  }).join("");
  const newHtml = memoryEditorState.newFiles.map((item, index) => `<div class="memory-photo-item"><img src="${item.previewUrl}" alt="Nueva foto ${index + 1}"/><span class="memory-photo-badge">Nueva</span><button class="memory-photo-remove" type="button" data-remove-new-photo="${item.id}" aria-label="Quitar foto">×</button></div>`).join("");
  const total = retained.length + memoryEditorState.newFiles.length;
  memoryPhotoCounter.textContent = `${total} de ${MEMORY_MAX_PHOTOS}`;
  memoryPhotoGrid.innerHTML = total
    ? existingHtml + newHtml
    : `<div class="memory-photo-empty">Añade entre 1 y ${MEMORY_MAX_PHOTOS} fotos.<br>JaviEats las optimizará antes de subirlas.</div>`;
  memoryPhotoPicker.disabled = total >= MEMORY_MAX_PHOTOS || memoryEditorBusy;
}

function handleMemoryPhotoSelection(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  const currentCount = getRetainedMemoryPaths().length + memoryEditorState.newFiles.length;
  let slots = Math.max(0, MEMORY_MAX_PHOTOS - currentCount);
  let rejected = 0;

  for (const file of files) {
    if (!slots) { rejected += 1; continue; }
    if (!String(file.type || "").startsWith("image/") || file.size > MEMORY_MAX_SOURCE_BYTES) { rejected += 1; continue; }
    memoryEditorState.newFiles.push({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file)
    });
    slots -= 1;
  }
  memoryPhotoInput.value = "";
  renderMemoryPhotoGrid();
  if (rejected) setMemoryUploadStatus(`Se han omitido ${rejected} archivo(s) por límite, tamaño o formato.`, "error");
  else setMemoryUploadStatus("Las fotos se comprimirán únicamente cuando pulses Guardar.");
}

function handleMemoryPhotoGridClick(event) {
  const removeExisting = event.target.closest("[data-remove-existing-photo]");
  const removeNew = event.target.closest("[data-remove-new-photo]");
  if (removeExisting) {
    memoryEditorState.removedPaths.add(removeExisting.dataset.removeExistingPhoto);
    renderMemoryPhotoGrid();
  }
  if (removeNew) {
    const index = memoryEditorState.newFiles.findIndex(item => item.id === removeNew.dataset.removeNewPhoto);
    if (index >= 0) {
      const [removed] = memoryEditorState.newFiles.splice(index, 1);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      renderMemoryPhotoGrid();
    }
  }
}

function setMemoryUploadStatus(message, type = "") {
  if (!memoryUploadStatus) return;
  memoryUploadStatus.textContent = message || "";
  memoryUploadStatus.classList.toggle("is-error", type === "error");
  memoryUploadStatus.classList.toggle("is-ok", type === "ok");
}

function setMemoryEditorBusy(busy) {
  memoryEditorBusy = busy;
  memorySaveBtn.disabled = busy;
  memoryDeleteBtn.disabled = busy;
  memoryEditorDate.disabled = busy;
  memoryEditorName.disabled = busy;
  memoryEditorDescription.disabled = busy;
  memoryPhotoInput.disabled = busy;
  renderMemoryPhotoGrid();
}

async function saveRemoteMemory(event) {
  event.preventDefault();
  if ((currentRole !== "javi" && currentRole !== "laura") || memoryEditorBusy) return;

  const fecha = memoryEditorDate.value;
  const titulo = memoryEditorName.value.trim();
  const descripcion = memoryEditorDescription.value.trim();
  const retainedPaths = getRetainedMemoryPaths();
  const totalPhotos = retainedPaths.length + memoryEditorState.newFiles.length;

  if (!fecha || !titulo) {
    setMemoryUploadStatus("Completa la fecha y el título.", "error");
    return;
  }
  if (!totalPhotos) {
    setMemoryUploadStatus("Añade al menos una foto al recuerdo.", "error");
    return;
  }

  const isEditing = Boolean(memoryEditorState.id);
  const memoryId = memoryEditorState.id || crypto.randomUUID();
  const uploadedPaths = [];
  let persisted = false;
  setMemoryEditorBusy(true);
  memorySaveBtn.textContent = isEditing ? "Guardando cambios…" : "Guardando recuerdo…";

  try {
    for (let i = 0; i < memoryEditorState.newFiles.length; i += 1) {
      const item = memoryEditorState.newFiles[i];
      setMemoryUploadStatus(`Optimizando foto ${i + 1} de ${memoryEditorState.newFiles.length}…`);
      const optimized = await compressMemoryImage(item.file);
      const extension = optimized.type === "image/jpeg" ? "jpg" : "webp";
      const path = `${memoryId}/${Date.now()}-${String(i + 1).padStart(2, "0")}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
      setMemoryUploadStatus(`Subiendo foto ${i + 1} de ${memoryEditorState.newFiles.length}…`);
      const { error: uploadError } = await supabaseClient.storage
        .from(MEMORY_STORAGE_BUCKET)
        .upload(path, optimized, {
          cacheControl: "31536000",
          contentType: optimized.type,
          upsert: false
        });
      if (uploadError) throw uploadError;
      uploadedPaths.push(path);
    }

    const finalPaths = [...retainedPaths, ...uploadedPaths];
    const payload = {
      fecha,
      titulo,
      descripcion,
      tipo: "gallery",
      contenido: "",
      image_paths: finalPaths,
      cover_index: 0
    };

    let dbError = null;
    if (isEditing) {
      const result = await supabaseClient.from("recuerdos_app").update(payload).eq("id", memoryId);
      dbError = result.error;
    } else {
      const result = await supabaseClient.from("recuerdos_app").insert({ id: memoryId, ...payload });
      dbError = result.error;
    }
    if (dbError) throw dbError;
    persisted = true;

    const pathsToRemove = [...memoryEditorState.removedPaths].filter(Boolean);
    if (pathsToRemove.length) {
      const { error: removeError } = await supabaseClient.storage.from(MEMORY_STORAGE_BUCKET).remove(pathsToRemove);
      if (removeError) console.warn("El recuerdo se guardó, pero no se pudieron limpiar algunas fotos antiguas:", removeError);
      pathsToRemove.forEach(path => memorySignedUrlCache.delete(path));
    }

    memoryEditorState.newFiles.forEach(item => item.previewUrl && URL.revokeObjectURL(item.previewUrl));
    memoryEditorState = createEmptyMemoryEditorState();
    memoryEditorModal.classList.add("hidden");
    document.body.style.overflow = "";
    setMemoryUploadStatus("");
    try {
      await refreshRemoteMemories();
    } catch (refreshError) {
      console.error("El recuerdo se guardó pero no se pudo refrescar la lista:", refreshError);
      showToast("Recuerdo guardado. Recarga la página para verlo.");
      return;
    }
    showToast(isEditing ? "Recuerdo actualizado ❤️" : "Recuerdo guardado ❤️");
  } catch (error) {
    console.error("Error guardando recuerdo v2.8:", error);
    if (!persisted && uploadedPaths.length) {
      try { await supabaseClient.storage.from(MEMORY_STORAGE_BUCKET).remove(uploadedPaths); } catch (cleanupError) { console.warn(cleanupError); }
    }
    setMemoryUploadStatus(memoryUploadErrorMessage(error), "error");
  } finally {
    setMemoryEditorBusy(false);
    memorySaveBtn.textContent = "Guardar recuerdo";
  }
}

async function deleteRemoteMemory() {
  if ((currentRole !== "javi" && currentRole !== "laura") || memoryEditorBusy || !memoryEditorState.id) return;
  const memory = state.remoteMemories.find(item => item.id === memoryEditorState.id);
  if (!memory) return;
  if (!confirm(`¿Eliminar "${memory.titulo}" y sus fotos? Esta acción no se puede deshacer.`)) return;

  setMemoryEditorBusy(true);
  setMemoryUploadStatus("Eliminando recuerdo…");
  try {
    const { error } = await supabaseClient.from("recuerdos_app").delete().eq("id", memory.id);
    if (error) throw error;
    const paths = Array.isArray(memory.image_paths) ? memory.image_paths.filter(Boolean) : [];
    if (paths.length) {
      const { error: removeError } = await supabaseClient.storage.from(MEMORY_STORAGE_BUCKET).remove(paths);
      if (removeError) console.warn("Se eliminó el recuerdo, pero quedaron archivos huérfanos:", removeError);
      paths.forEach(path => memorySignedUrlCache.delete(path));
    }
    memoryEditorModal.classList.add("hidden");
    document.body.style.overflow = "";
    resetMemoryEditorState();
    try {
      await refreshRemoteMemories();
    } catch (refreshError) {
      console.error("El recuerdo se eliminó pero no se pudo refrescar la lista:", refreshError);
      showToast("Recuerdo eliminado. Recarga la página para actualizar la lista.");
      return;
    }
    showToast("Recuerdo eliminado.");
  } catch (error) {
    console.error(error);
    setMemoryUploadStatus(memoryUploadErrorMessage(error), "error");
  } finally {
    setMemoryEditorBusy(false);
  }
}

function memoryUploadErrorMessage(error) {
  const message = String(error?.message || error?.error || "").toLowerCase();
  if (message.includes("row-level security") || message.includes("policy")) return "Supabase ha bloqueado la operación. Revisa que supabase-v3.0.sql esté aplicado.";
  if (message.includes("payload") || message.includes("too large")) return "Una de las fotos sigue siendo demasiado grande después de optimizarla.";
  if (message.includes("mime") || message.includes("format") || message.includes("decode")) return "No se ha podido procesar una imagen. Prueba con JPG, PNG o WebP.";
  return "No se ha podido guardar el recuerdo. Revisa la conexión e inténtalo de nuevo.";
}

async function compressMemoryImage(file) {
  const image = await loadMemoryImage(file);
  let width = image.naturalWidth || image.width;
  let height = image.naturalHeight || image.height;
  if (!width || !height) throw new Error("decode image failed");

  const initialScale = Math.min(1, MEMORY_MAX_DIMENSION / Math.max(width, height));
  width = Math.max(1, Math.round(width * initialScale));
  height = Math.max(1, Math.round(height * initialScale));

  let canvas = drawMemoryImageToCanvas(image, width, height);
  let quality = 0.84;
  let blob = await canvasToMemoryBlob(canvas, "image/webp", quality);
  if (!blob) blob = await canvasToMemoryBlob(canvas, "image/jpeg", 0.84);
  if (!blob) throw new Error("image format unsupported");

  while (blob.size > MEMORY_TARGET_BYTES && quality > 0.56) {
    quality -= 0.07;
    blob = await canvasToMemoryBlob(canvas, blob.type === "image/jpeg" ? "image/jpeg" : "image/webp", quality);
  }

  if (blob.size > MEMORY_TARGET_BYTES * 1.35) {
    const scale = 0.82;
    canvas = drawMemoryImageToCanvas(image, Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale)));
    blob = await canvasToMemoryBlob(canvas, blob.type === "image/jpeg" ? "image/jpeg" : "image/webp", Math.max(0.58, quality - 0.04));
  }

  return blob;
}

function loadMemoryImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("decode image failed")); };
    image.src = url;
  });
}

function drawMemoryImageToCanvas(image, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("canvas unavailable");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  return canvas;
}

function canvasToMemoryBlob(canvas, type, quality) {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality));
}

async function loadLetter(file) {
  if (loadedLetterFile === file && letterContent.dataset.loaded === "true") return;
  letterContent.dataset.loaded = "false";
  letterContent.innerHTML = "<p>Cargando carta...</p>";
  try {
    const response = await fetch(file, { cache: "no-store" });
    if (!response.ok) throw new Error(`No se ha podido cargar ${file}`);
    const text = await response.text();
    letterContent.innerHTML = renderLetterText(text);
    letterContent.dataset.loaded = "true";
    loadedLetterFile = file;
  } catch (error) { console.error(error); letterContent.innerHTML = `<p>No se ha podido cargar esta carta.</p><p>Revisa que el archivo <strong>${escapeHTML(file)}</strong> exista en GitHub.</p>`; }
}
function renderLetterText(text) {
  const clean = String(text || "").trim();
  if (!clean) return "<p>La carta está vacía.</p>";
  return clean.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean).map(p => `<p>${escapeHTML(p).replace(/\n/g, "<br>")}</p>`).join("");
}
function closeMemoryModal() { memoryModal.classList.add("hidden"); document.body.style.overflow = ""; }
function changeGalleryImage(direction) {
  if (currentGallery.length <= 1) return;
  currentGalleryIndex = (currentGalleryIndex + direction + currentGallery.length) % currentGallery.length;
  renderGalleryImage();
}
function renderGalleryImage() {
  if (!currentGallery.length) return;
  galleryImage.src = currentGallery[currentGalleryIndex];
  galleryCounter.textContent = `${currentGalleryIndex + 1} de ${currentGallery.length}`;
  const show = currentGallery.length > 1;
  galleryPrev.classList.toggle("hidden", !show); galleryNext.classList.toggle("hidden", !show); galleryCounter.classList.toggle("hidden", !show);
}

function downloadVoucher(voucher) {
  const canvas = document.createElement("canvas"); canvas.width = 1200; canvas.height = 1600;
  const c = canvas.getContext("2d"); if (!c) return;
  c.fillStyle = "#f4f0ea"; c.fillRect(0, 0, 1200, 1600);
  c.fillStyle = "#111"; drawRoundedRectangle(c, 90, 90, 1020, 1420, 54); c.fill();
  c.fillStyle = "#fff"; drawRoundedRectangle(c, 120, 120, 960, 1360, 42); c.fill();
  c.fillStyle = "#e85d45"; drawRoundedRectangle(c, 180, 180, 840, 120, 60); c.fill();
  c.fillStyle = "#fff"; c.textAlign = "center"; c.font = "900 54px Arial"; c.fillText("JaviEats", 600, 258);
  c.fillStyle = "#111"; c.font = "900 44px Arial"; c.fillText("VALE DESBLOQUEADO", 600, 430);
  c.fillStyle = "#e85d45"; c.font = "900 76px Arial"; wrapCanvasText(c, voucher.titulo, 600, 610, 820, 88);
  c.fillStyle = "#6f6a64"; c.font = "600 40px Arial"; wrapCanvasText(c, voucher.descripcion, 600, 840, 760, 56);
  c.fillStyle = "#111"; c.font = "700 34px Arial"; c.fillText(`Ganado el ${formatDateCompact(dateFromTimestamp(voucher.created_at))}`, 600, 1040);
  c.font = "900 36px monospace"; c.fillText(voucherCode(voucher), 600, 1215);
  c.fillStyle = "#6f6a64"; c.font = "500 28px Arial"; wrapCanvasText(c, "Canjeable bajo disponibilidad. Enséñaselo a Javi para hacerlo oficial.", 600, 1330, 780, 42);
  downloadCanvas(canvas, `vale-javieats-${dateFromTimestamp(voucher.created_at)}.png`);
  showToast("Vale descargado.");
}
function downloadTicket(proposal) {
  const canvas = document.createElement("canvas"); canvas.width = 1200; canvas.height = 1500;
  const c = canvas.getContext("2d"); if (!c) return;
  c.fillStyle = "#f4f0ea"; c.fillRect(0, 0, 1200, 1500);
  c.fillStyle = "#fff"; drawRoundedRectangle(c, 100, 90, 1000, 1320, 56); c.fill();
  c.strokeStyle = "#111"; c.lineWidth = 8; drawRoundedRectangle(c, 100, 90, 1000, 1320, 56); c.stroke();
  c.fillStyle = "#111"; drawRoundedRectangle(c, 160, 150, 880, 140, 50); c.fill();
  c.fillStyle = "#fff"; c.textAlign = "center"; c.font = "900 58px Arial"; c.fillText("JaviEats", 600, 238);
  c.fillStyle = "#e85d45"; c.font = "900 42px Arial"; c.fillText("PROPUESTA DE PLAN", 600, 390);
  c.fillStyle = "#111"; c.font = "900 76px Arial"; wrapCanvasText(c, `${proposal.service_icon} ${proposal.service_title}`, 600, 520, 830, 88);
  c.textAlign = "left"; c.font = "700 39px Arial";
  [`Fecha: ${formatDateCompact(proposal.plan_date)}`, `Hora: ${formatTime(proposal.plan_time)}`, `Duración: ${proposal.duration}`, `Nivel de ganas: ${proposal.priority}`, `Estado: ${statusLabel(proposal.status)}`].forEach((line, i) => c.fillText(line, 190, 800 + i * 80));
  if (proposal.note) { c.fillStyle = "#6f6a64"; c.font = "600 34px Arial"; c.textAlign = "center"; wrapCanvasText(c, `Nota: ${proposal.note}`, 600, 1220, 800, 48); }
  downloadCanvas(canvas, `ticket-javieats-${proposal.plan_date}.png`);
  showToast("Ticket descargado.");
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

function refreshNotificationUI() {
  renderNotifications();
  window.dispatchEvent(new CustomEvent("javieats:data"));
}

function renderNotifications() {
  if (!notificationsBadge || !notificationsList) return;

  const notifications = Array.isArray(state.notifications)
    ? state.notifications.filter(item => item.tipo !== "mensaje_dia")
    : [];
  const unread = notifications.filter(item => !item.leido_at).length;

  notificationsBadge.textContent = unread > 99 ? "99+" : String(unread);
  notificationsBadge.classList.toggle("hidden", unread === 0 || state.notificationLoadError);

  if (notificationsReadAll) {
    const hasNotifications = notifications.length > 0 && !state.notificationLoadError;
    notificationsReadAll.classList.toggle("hidden", !hasNotifications);

    if (hasNotifications) {
      const clearMode = unread === 0;
      notificationsReadAll.textContent = clearMode ? "Borrar todo" : "Marcar todo leído";
      notificationsReadAll.dataset.notificationAction = clearMode ? "clear" : "read";
      notificationsReadAll.classList.toggle("is-danger", clearMode);
    } else {
      notificationsReadAll.classList.remove("is-danger");
      delete notificationsReadAll.dataset.notificationAction;
    }
  }

  if (state.notificationLoadError) {
    notificationsList.innerHTML = '<div class="notification-empty">Las notificaciones todavía no están disponibles.</div>';
    return;
  }

  if (!notifications.length) {
    notificationsList.innerHTML = '<div class="notification-empty">Todo al día. Cuando el otro haga algo que te afecte, aparecerá aquí.</div>';
    return;
  }

  notificationsList.innerHTML = notifications.map(notification => {
    const unreadClass = notification.leido_at ? "" : " is-unread";
    const detail = notification.detalle ? `<p>${escapeHTML(notification.detalle)}</p>` : "";
    return `<div class="notification-row">
      <button class="notification-item${unreadClass}" type="button" data-notification-id="${notification.id}">
        <span class="notification-item-icon">${notificationIcon(notification.tipo)}</span>
        <span class="notification-item-copy"><strong>${escapeHTML(notification.titulo)}</strong>${detail}</span>
        <span class="notification-item-time">${notificationTimeLabel(notification.created_at)}${notification.leido_at ? "" : '<span class="notification-unread-dot" aria-label="Sin leer"></span>'}<span class="notification-open-mark" aria-hidden="true">›</span></span>
      </button>
      <button class="notification-delete-btn" type="button" data-notification-delete="${notification.id}" aria-label="Eliminar notificación" title="Eliminar">&times;</button>
    </div>`;
  }).join("");
}

function notificationIcon(type) {
  return ({
    mensaje_dia: "💌",
    ysi_resultado: "💭",
    ysi_turno: "💭",
    ysi_resultado_final: "❤️",
    puzzle_pieza: "🧩",
    puzzle_completado: "🎁",
    plan_nuevo: "📅",
    plan_estado: "📅",
    plan_cambio: "📅",
    recuerdo_nuevo: "📸"
  })[type] || "🔔";
}

function notificationTimeLabel(timestamp) {
  const date = new Date(timestamp);
  const diff = Math.max(0, Date.now() - date.getTime());
  if (diff < 60_000) return "Ahora";
  if (diff < 3_600_000) return `Hace ${Math.max(1, Math.floor(diff / 60_000))} min`;
  if (diff < 86_400_000) return `Hace ${Math.floor(diff / 3_600_000)} h`;
  if (diff < 172_800_000) return "Ayer";
  return shortDate(toDateKeyMadrid(date));
}

function openNotificationsModal() {
  renderNotifications();
  notificationsModal?.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeNotificationsModal() {
  notificationsModal?.classList.add("hidden");
  document.body.style.overflow = "";
}

async function markNotificationRead(id) {
  const notification = state.notifications.find(item => item.id === id);
  if (!notification || notification.leido_at) return;
  const { error } = await supabaseClient.rpc("marcar_notificacion_leida", { p_id: id });
  if (error) throw error;
  notification.leido_at = new Date().toISOString();
  refreshNotificationUI();
}


async function markAllNotificationsRead() {
  if (state.notificationLoadError || !notificationsReadAll) return;
  notificationsReadAll.disabled = true;
  try {
    const { error } = await supabaseClient.rpc("marcar_todas_notificaciones_leidas");
    if (error) throw error;
    const now = new Date().toISOString();
    state.notifications.forEach(item => { if (!item.leido_at) item.leido_at = now; });
    refreshNotificationUI();
  } catch (error) {
    console.error(error);
    showToast("No se han podido marcar las notificaciones.");
  } finally {
    notificationsReadAll.disabled = false;
  }
}

async function deleteNotification(id) {
  if (!id || state.notificationLoadError) return;

  try {
    const { data, error } = await supabaseClient.rpc("eliminar_notificacion", { p_id: id });
    if (error) throw error;
    if (data !== true) throw new Error("Notification not owned by current user");

    state.notifications = state.notifications.filter(item => item.id !== id);
    refreshNotificationUI();
    showToast("Notificación eliminada.");
  } catch (error) {
    console.error(error);
    showToast("No se ha podido eliminar la notificación.");
  }
}

async function clearAllNotifications() {
  if (state.notificationLoadError || !notificationsReadAll) return;
  const visibleNotifications = state.notifications.filter(item => item.tipo !== "mensaje_dia");
  if (!visibleNotifications.length) return;

  if (!window.confirm("¿Quieres borrar toda la actividad? Esta acción no se puede deshacer.")) return;

  notificationsReadAll.disabled = true;
  try {
    const { error } = await supabaseClient.rpc("vaciar_notificaciones");
    if (error) throw error;

    state.notifications = [];
    refreshNotificationUI();
    showToast("Actividad borrada.");
  } catch (error) {
    console.error(error);
    showToast("No se ha podido borrar la actividad.");
  } finally {
    notificationsReadAll.disabled = false;
  }
}

async function handleNotificationsBulkAction() {
  const notifications = state.notifications.filter(item => item.tipo !== "mensaje_dia");
  const unread = notifications.filter(item => !item.leido_at).length;

  if (unread > 0) {
    await markAllNotificationsRead();
    return;
  }

  if (notifications.length > 0) await clearAllNotifications();
}

async function handleNotificationClick(event) {
  const deleteButton = event.target.closest("[data-notification-delete]");
  if (deleteButton) {
    event.preventDefault();
    event.stopPropagation();
    deleteButton.disabled = true;
    try {
      await deleteNotification(deleteButton.dataset.notificationDelete);
    } finally {
      if (deleteButton.isConnected) deleteButton.disabled = false;
    }
    return;
  }

  const button = event.target.closest("[data-notification-id]");
  if (!button) return;
  const notification = state.notifications.find(item => item.id === button.dataset.notificationId);
  if (!notification) return;

  try {
    await markNotificationRead(notification.id);
  } catch (error) {
    console.error(error);
    showToast("No se ha podido marcar la notificación.");
  }

  closeNotificationsModal();
  await openNotificationDestination(notification);
}

async function openNotificationDestination(notification) {
  const destination = notification.destino || "home";
  if (destination === "mensaje") {
    // Compatibilidad con avisos antiguos: llevar a Inicio sin reactivar la función retirada.
    showPage("home");
    return;
  }
  if (destination === "ysi" || destination === "rps") {
    showPage("minigames");
    window.JaviEatsMinigames?.open?.(destination, { force: true });
    return;
  }
  if (destination === "calendar") {
    showPage("calendar");
    setTimeout(() => {
      const target = notification.tipo === "plan_nuevo" ? document.getElementById("v3-plan-pending") : document.getElementById("v3-plan-next");
      target?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    }, 120);
    return;
  }
  if (destination === "memories") {
    showPage("memories");
    if (notification.entidad_id) setTimeout(() => openRemoteMemory(notification.entidad_id), 160);
    return;
  }
  if (["minigames", "home"].includes(destination)) {
    showPage(destination);
    return;
  }
  showPage("home");
}

function setMinDate() {
  const today = toDateKeyMadrid(new Date());
  proposalDate.min = today;
  if (!proposalDate.value) proposalDate.value = today;
}
function statusLabel(status) { return ({ pendiente: "Pendiente", confirmada: "Confirmada", realizada: "Realizada", cancelada: "Cancelada" })[status] || status; }
function voucherCode(voucher) { return `JE-${dateFromTimestamp(voucher.created_at).replaceAll("-", "")}-${voucher.id.slice(0, 6).toUpperCase()}`; }
function sortProposalsByDate(a, b) { return `${a.plan_date}T${normalizeTimeForDate(a.plan_time)}`.localeCompare(`${b.plan_date}T${normalizeTimeForDate(b.plan_time)}`); }
function proposalToDate(p) { return new Date(`${p.plan_date}T${normalizeTimeForDate(p.plan_time)}`); }
function normalizeTimeForDate(time) { const clean = String(time || "00:00").slice(0, 8); return clean.length === 5 ? `${clean}:00` : clean; }
function toDateKeyMadrid(date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(date));
  const values = Object.fromEntries(parts.filter(p => p.type !== "literal").map(p => [p.type, p.value]));
  return `${values.year}-${values.month}-${values.day}`;
}
function dateFromTimestamp(timestamp) { return toDateKeyMadrid(new Date(timestamp)); }
function formatDate(dateKey) { const [y, m, d] = dateKey.split("-").map(Number); return new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }).format(new Date(y, m - 1, d)); }
function formatDateCompact(dateKey) { const [y, m, d] = dateKey.split("-").map(Number); return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(y, m - 1, d)); }
function shortDate(dateKey) { const [y, m, d] = dateKey.split("-").map(Number); return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short" }).format(new Date(y, m - 1, d)); }
function formatTime(time) { return String(time || "").slice(0, 5); }
function formatDateTime(timestamp) { return new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(timestamp)); }
function currentTimeLabel() { return new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit" }).format(new Date()); }
function timeUntilTomorrow() {
  const now = new Date(); const tomorrow = new Date(now); tomorrow.setHours(24, 0, 0, 0);
  const diff = Math.max(0, tomorrow - now); const h = Math.floor(diff / 3600000); const m = Math.floor((diff % 3600000) / 60000); const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, "0")} h · ${String(m).padStart(2, "0")} min · ${String(s).padStart(2, "0")} s`;
}
function escapeHTML(text) { return String(text ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function friendlyAuthError(error) {
  const message = String(error?.message || "").toLowerCase();
  if (message.includes("invalid login credentials")) return "Contraseña incorrecta para este perfil.";
  if (message.includes("email not confirmed")) return "La cuenta todavía no está confirmada en Supabase.";
  if (message.includes("failed to fetch")) return "No hay conexión con Supabase.";
  if (message.includes("no corresponde al perfil")) return "Esta contraseña no corresponde al perfil seleccionado.";
  return "No se ha podido iniciar sesión. Revisa los datos.";
}
function friendlyGameError(error) {
  const message = String(error?.message || "");
  if (message.includes("intento de hoy")) return "Laura ya ha utilizado su intento de hoy.";
  if (message.includes("solamente puede jugarlo Laura")) return "Este reto solamente puede jugarlo Laura.";
  return "No se ha podido guardar la jugada. Revisa la conexión.";
}
function drawRoundedRectangle(context, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2); context.beginPath(); context.moveTo(x + r, y); context.arcTo(x + width, y, x + width, y + height, r); context.arcTo(x + width, y + height, x, y + height, r); context.arcTo(x, y + height, x, y, r); context.arcTo(x, y, x + width, y, r); context.closePath();
}
function wrapCanvasText(context, text, centerX, startY, maxWidth, lineHeight) {
  const words = String(text).split(" "); const lines = []; let line = "";
  words.forEach(word => { const test = line ? `${line} ${word}` : word; if (context.measureText(test).width > maxWidth && line) { lines.push(line); line = word; } else line = test; });
  if (line) lines.push(line); lines.forEach((lineText, index) => context.fillText(lineText, centerX, startY + index * lineHeight));
}
function downloadCanvas(canvas, filename) { const link = document.createElement("a"); link.download = filename; link.href = canvas.toDataURL("image/png"); document.body.appendChild(link); link.click(); link.remove(); }
function showToast(message) { toast.textContent = message; toast.classList.remove("hidden"); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.add("hidden"), 2800); }
      


/* =========================================================
   JaviEats 3.1 · interfaz unificada
   ========================================================= */
/* Capa de presentación mobile-first integrada en el core.
   Navegación final: Inicio · Planes · acceso especial · Minijuegos · Recuerdos.
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

  const REVEAL_AT = Date.parse("2026-09-12T12:00:00Z"); // 14:00 Europe/Madrid
  const SECRET_NAME_CODES = [78, 117, 101, 115, 116, 114, 97, 32, 86, 105, 100, 97];
  const secretName = () => SECRET_NAME_CODES.map(code => String.fromCharCode(code)).join("");

  let mounted = false;
  let editPlanId = null;
  let revealTimer = null;

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

  function puzzleCount() {
    const direct = Number(state().puzzle?.piezas_conseguidas);
    if (Number.isFinite(direct)) return Math.max(0, Math.min(6, direct));
    return Math.max(0, Math.min(6, (state().puzzlePieces || []).length));
  }

  function puzzlePiecesSet() {
    return new Set((state().puzzlePieces || []).map(item => Number(item.numero_pieza)));
  }

  function allMemories() {
    const remote = Array.isArray(state().remoteMemories) ? state().remoteMemories : [];
    const legacy = APP()?.getStaticMemories?.() || [];
    return [...legacy.map(x => ({ ...x, _legacy: true })), ...remote.map(x => ({ ...x, _legacy: false }))]
      .sort((a, b) => String(b.fecha || b.id || "").localeCompare(String(a.fecha || a.id || "")));
  }

  function memoryImage(memory) {
    if (!memory) return "";
    if (memory._legacy) return memory.cover || "";
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
    buildMysteryModal();
    buildEditModal();
    bindGlobalEvents();
    bindRevealEvents();
    updateRevealState();
    revealTimer = window.setInterval(updateRevealState, 1000);
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
      hero?.insertAdjacentHTML("afterend", `<section id="v3-memory-overview" class="v3-memory-overview"></section>`);
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
  function ensureMainGameNavStyles() {
    if ($("v3-main-game-nav-styles")) return;
    const style = document.createElement("style");
    style.id = "v3-main-game-nav-styles";
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
    const nav = $("v3-mystery-nav");
    if (!nav) return;
    const wantedClass = revealed ? "v3-main-game-icon" : "v3-mystery-spark";
    if (nav.querySelector(`.${wantedClass}`)) return;
    const currentIcon = nav.querySelector("svg");
    const markup = revealed ? icon("life", wantedClass) : icon("spark", wantedClass);
    if (currentIcon) currentIcon.outerHTML = markup;
    else nav.insertAdjacentHTML("afterbegin", markup);
  }

  function buildNav() {
    const nav = document.querySelector(".bottom-nav");
    if (!nav) return;
    nav.classList.add("v3-bottom-nav");
    ensureMainGameNavStyles();
    nav.innerHTML = `
      <button class="nav-btn active" data-page="home" type="button">${icon("home")}<span>Inicio</span></button>
      <button class="nav-btn" data-page="calendar" type="button">${icon("calendar")}<span>Planes</span></button>
      <button class="nav-btn v3-mystery-nav" id="v3-mystery-nav" type="button" aria-label="Descubrir próxima novedad">${icon("spark", "v3-mystery-spark")}<span id="v3-mystery-nav-label">12·09</span></button>
      <button class="nav-btn" data-page="minigames" type="button">${icon("game")}<span>Minijuegos</span></button>
      <button class="nav-btn" data-page="memories" type="button">${icon("memory")}<span>Recuerdos</span></button>`;

    nav.querySelectorAll("[data-page]").forEach(btn => {
      btn.addEventListener("click", () => APP()?.showPage?.(btn.dataset.page));
    });
    $("v3-mystery-nav")?.addEventListener("click", handleMysteryClick);
  }

  function buildMysteryModal() {
    if ($("v3-mystery-modal")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <section class="v3-mystery-modal hidden" id="v3-mystery-modal" role="dialog" aria-modal="true" aria-labelledby="v3-mystery-title">
        <button class="v3-mystery-backdrop" type="button" data-mystery-close aria-label="Cerrar"></button>
        <div class="v3-mystery-sheet">
          <button class="v3-mystery-sheet-close" type="button" data-mystery-close aria-label="Cerrar">×</button>
          <div class="v3-mystery-mark">${icon("spark", "v3-mystery-spark")}</div>
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
    updateMainGameNavIcon(revealed);

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

  function bindRevealEvents() {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) updateRevealState();
    });
    window.addEventListener("pageshow", updateRevealState);
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !$("v3-mystery-modal")?.classList.contains("hidden")) closeMysteryModal();
    });
    window.addEventListener("beforeunload", () => {
      if (revealTimer) window.clearInterval(revealTimer);
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
    if ($("v3-home-puzzle")) $("v3-home-puzzle").textContent = `${pCount} de 6 piezas`;
    if ($("v3-home-puzzle-copy")) $("v3-home-puzzle-copy").textContent = pCount === 6 ? "Premio desbloqueado" : `Faltan ${6 - pCount} para el premio`;
    if ($("v3-home-puzzle-bar")) $("v3-home-puzzle-bar").style.width = `${Math.max(7, pCount / 6 * 100)}%`;

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
      grid.style.userSelect = "none";
      grid.setPointerCapture?.(event.pointerId);
    });

    grid.addEventListener("pointermove", event => {
      if (!dragging) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 5) moved = true;
      grid.scrollLeft = startScroll - delta;
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
    const memories = allMemories();
    const vouchers = Array.isArray(state().vouchers) ? state().vouchers : [];
    const match = latestYsiMatch();

    if ($("v3-us-metric-questions")) $("v3-us-metric-questions").textContent = String(stats.total);
    if ($("v3-us-metric-memories")) $("v3-us-metric-memories").textContent = String(memories.length);
    if ($("v3-us-metric-puzzle")) $("v3-us-metric-puzzle").textContent = `${count}/6`;

    if ($("v3-us-compat")) $("v3-us-compat").textContent = stats.total ? `${stats.compatibility}%` : "—";
    if ($("v3-us-compat-copy")) $("v3-us-compat-copy").textContent = stats.total ? `${stats.matches} coincidencias de ${stats.total} preguntas compartidas` : "Responded ¿Y si…? para descubrir vuestra compatibilidad";
    if ($("v3-compat-ring")) $("v3-compat-ring").style.setProperty("--compat", `${stats.compatibility || 0}%`);
    if ($("v3-us-latest-match")) $("v3-us-latest-match").innerHTML = match ? `<small>Última coincidencia</small><strong>“${esc(match.pregunta)}”</strong>` : `<small>Última coincidencia</small><strong>Aún no hay una para enseñar aquí.</strong>`;

    const missing = Math.max(0, 6 - count);
    if ($("v3-us-puzzle-copy")) $("v3-us-puzzle-copy").textContent = count === 6 ? "Puzle completado. El premio ya está desbloqueado." : `Lleváis ${count} de 6 piezas. Faltan ${missing} para desbloquear el premio.`;
    const puzzle = $("v3-us-puzzle-grid");
    if (puzzle) {
      const unlocked = puzzlePiecesSet();
      puzzle.innerHTML = Array.from({ length: 6 }, (_, i) => {
        const n = i + 1;
        return `<span class="puzzle-piece ${unlocked.has(n) ? "is-unlocked" : "is-locked"}" data-piece="${n}" aria-hidden="true"></span>`;
      }).join("");
      puzzle.classList.toggle("is-complete", count === 6);
      puzzle.setAttribute("aria-label", `${count} de 6 piezas conseguidas`);
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
      holder.innerHTML = vouchers.length ? vouchers.map((v, index) => `
        <article class="v3-ticket ${v.estado === "canjeado" ? "is-used" : ""}">
          <span class="v3-ticket-cut cut-left"></span><span class="v3-ticket-cut cut-right"></span>
          <div class="v3-ticket-top"><small>PREMIO JAVIEATS</small><b>#${String(index + 1).padStart(3, "0")}</b></div>
          <strong>${esc(v.titulo || "Vale JaviEats")}</strong>
          <span>${v.estado === "canjeado" ? "Canjeado" : "Disponible para usar"}</span>
        </article>`).join("") : `<div class="v3-empty-card">Los premios que desbloqueéis aparecerán aquí.</div>`;
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
      const { error } = await client.from("propuestas").update(payload).eq("id", editPlanId);
      if (error) throw error;
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
