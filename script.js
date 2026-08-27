const CONFIG = {
  supabaseUrl: "https://rqycylggsqgmqugxygwr.supabase.co",
  supabasePublishableKey: "sb_publishable_RNkvgx5IAbWnKG13hGiMUw_XFpym_S2",
  formspreeEndpoint: "https://formspree.io/f/xjgddbjw",
  emailDestino: "javiermontorogranados@gmail.com"
};

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
    notePlaceholder: "Cuéntale a Javi cómo te encuentras o qué necesitas..."
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
    description: "Para cuando Laura tenga una idea distinta que no aparezca entre los servicios de JaviEats.",
    eta: "A decidir",
    durations: ["Plan corto", "Media tarde", "Día completo", "Por decidir"],
    bullets: [
      "Laura propone la idea.",
      "Puede ser cualquier plan razonable.",
      "Los detalles se terminan de hablar entre los dos."
    ],
    requiresNote: true,
    notePlaceholder: "Cuéntale a Javi qué plan diferente te apetece hacer..."
  },
  {
    id: "sorpresa",
    icon: "🎁",
    title: "Plan Sorpresa",
    category: "Sorpresa",
    description: "Laura elige una fecha y Javi se encarga de preparar una propuesta.",
    eta: "Variable",
    durations: ["Plan corto", "Plan medio", "Plan completo"],
    bullets: [
      "La clienta propone la fecha.",
      "El proveedor prepara la idea.",
      "Puede incluir comida, paseo o un plan inesperado."
    ],
    notePlaceholder: "Puedes indicar presupuesto, tiempo disponible o cosas que no te apetezcan..."
  },
  {
    id: "perritos",
    icon: "🐶",
    title: "Paseo con los perritos",
    category: "Plan con Randy y Nala",
    description: "Para cuando Laura quiera ver a Randy y Nala, sacarlos de paseo o pasar un rato con ellos.",
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

const lauraComposeCard = $("laura-compose-card");
const lauraMessageForm = $("laura-message-form");
const lauraMessageType = $("laura-message-type");
const lauraMessageTitle = $("laura-message-title");
const lauraMessageContent = $("laura-message-content");
const saveLauraMessage = $("save-laura-message");
const lauraMessageStatus = $("laura-message-status");

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

const lauraMessagesList = $("laura-messages-list");

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

const lauraMessageModal = $("laura-message-modal");
const lauraMessageModalIcon = $("laura-message-modal-icon");
const lauraMessageModalType = $("laura-message-modal-type");
const lauraMessageModalTitle = $("laura-message-modal-title");
const lauraMessageModalDate = $("laura-message-modal-date");
const lauraMessageModalContent = $("laura-message-modal-content");
const lauraMessageModalActions = $("laura-message-modal-actions");
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
let loadedLetterFile = "";
let editingMessageId = null;
let openedLauraMessageId = null;
let lastProposalTicket = null;
let dailyGame = null;
let dailyRounds = [];
let roundLocked = false;
let syncTimer = null;
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
  messages: [],
  marks: [],
  vouchers: [],
  puzzle: null,
  puzzlePieces: [],
  puzzleLoadError: false,
  ySiCurrent: null,
  ySiLastResult: null,
  ySiHistory: [],
  ySiLoadError: false
};

window.JaviEatsApp = {
  getRole: () => currentRole,
  showPage: page => showPage(page),
  showToast: message => showToast(message),
  openGameModal: () => openGameModal()
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

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.page));
  });
  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => showPage(button.dataset.go));
  });
  document.querySelectorAll("[data-service-close]").forEach(el => el.addEventListener("click", closeServiceModal));
  document.querySelectorAll("[data-game-close]").forEach(el => el.addEventListener("click", closeGameModal));
  document.querySelectorAll("[data-memory-close]").forEach(el => el.addEventListener("click", closeMemoryModal));
  document.querySelectorAll("[data-laura-message-close]").forEach(el => el.addEventListener("click", closeLauraMessageModal));
  document.querySelectorAll("[data-custom-plan-close]").forEach(el => el.addEventListener("click", closeCustomPlanModal));
  document.querySelectorAll("[data-puzzle-close]").forEach(el => el.addEventListener("click", closePuzzleModal));
  document.querySelectorAll("[data-y-si-history-close]").forEach(el => el.addEventListener("click", closeYSiHistoryModal));

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

  lauraMessageForm.addEventListener("submit", handleLauraMessage);
  lauraMessagesList.addEventListener("click", handleLauraMessageListClick);
  lauraMessageModalActions.addEventListener("click", handleLauraMessageModalAction);

  memoriesList.addEventListener("click", event => {
    const staticButton = event.target.closest("[data-memory-id]");
    const lauraButton = event.target.closest("[data-laura-memory-id]");
    if (staticButton) openMemory(staticButton.dataset.memoryId);
    if (lauraButton) openLauraMessageModal(lauraButton.dataset.lauraMemoryId);
  });
  voucherList.addEventListener("click", handleVoucherAction);
  galleryPrev.addEventListener("click", () => changeGalleryImage(-1));
  galleryNext.addEventListener("click", () => changeGalleryImage(1));

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && appReady && currentUser) loadAllData({ silent: true });
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
  maybeShowPuzzleWelcome();
  maybeFocusYSiFromUrl();
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
  lauraComposeCard.classList.toggle("hidden", !isLaura);
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
  currentUser = null;
  currentRole = "unknown";
  dailyGame = null;
  dailyRounds = [];
  appReady = false;
  state.proposals = [];
  state.messages = [];
  state.marks = [];
  state.vouchers = [];
  state.puzzle = null;
  state.puzzlePieces = [];
  state.puzzleLoadError = false;
  state.ySiCurrent = null;
  state.ySiLastResult = null;
  state.ySiHistory = [];
  state.ySiLoadError = false;
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
  if (page === "laura") {
    renderLauraMessages();
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

async function loadAllData({ silent = false } = {}) {
  if (!currentUser || !supabaseClient) return;
  if (!silent) setSyncState("loading", "Sincronizando…");
  try {
    const today = toDateKeyMadrid(new Date());
    const puzzlePromise = fetchPuzzleProgress().catch(error => {
      console.error("No se ha podido cargar el puzle de la versión 2.4:", error);
      return { puzzle: null, pieces: [], loadError: true };
    });
    const ySiCurrentPromise = fetchYSiCurrent().catch(error => {
      console.error("No se ha podido cargar ¿Y si...?:", error);
      return { loadError: true };
    });
    const ySiHistoryPromise = fetchYSiHistory().catch(error => {
      console.error("No se ha podido cargar el historial de ¿Y si...?:", error);
      return [];
    });
    const [proposals, messages, marks, vouchers, gameData, puzzleProgress, ySiCurrent, ySiHistory] = await Promise.all([
      fetchProposals(),
      fetchMessages(),
      fetchMarks(),
      fetchVouchers(),
      fetchTodayGame(today),
      puzzlePromise,
      ySiCurrentPromise,
      ySiHistoryPromise
    ]);
    state.proposals = proposals;
    state.messages = messages;
    state.marks = marks;
    state.vouchers = vouchers;
    dailyGame = gameData.game;
    dailyRounds = gameData.rounds;
    state.puzzle = puzzleProgress.puzzle;
    state.puzzlePieces = puzzleProgress.pieces;
    state.puzzleLoadError = Boolean(puzzleProgress.loadError);
    state.ySiCurrent = ySiCurrent?.loadError ? null : ySiCurrent;
    state.ySiHistory = Array.isArray(ySiHistory) ? ySiHistory : [];
    state.ySiLastResult = getTodayLatestYSiResult(state.ySiHistory);
    state.ySiLoadError = Boolean(ySiCurrent?.loadError);
    refreshUI();
    maybeRevealYSiResult();
    setSyncState("ok", `Sincronizado · ${currentTimeLabel()}`);
    if (state.puzzleLoadError && !silent) {
      showToast("JaviEats funciona, pero falta aplicar o revisar la migración del puzle v2.4.");
    }
    if (state.ySiLoadError && !silent) {
      showToast("La sección ¿Y si...? necesita la migración de Supabase v2.5.1.");
    }
  } catch (error) {
    console.error(error);
    setSyncState("error", "Error de sincronización");
    if (!silent) showToast("No se han podido cargar todos los datos.");
  }
}

async function fetchProposals() {
  const { data, error } = await supabaseClient.from("propuestas").select("*").order("plan_date", { ascending: true }).order("plan_time", { ascending: true });
  if (error) throw error;
  return data || [];
}
async function fetchMessages() {
  const { data, error } = await supabaseClient.from("mensajes_laura").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}
async function fetchMarks() {
  const { data, error } = await supabaseClient.from("marcas_mensajes_javi").select("*");
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
  renderLauraMessages();
  renderYSi();
  renderMemories();
  renderVouchers();
  renderPuzzleProgress();
  updateDailyGameCard();
}

function renderServices() {
  featuredServices.innerHTML = SERVICES.slice(0, 3).map(serviceTemplate).join("");
  allServices.innerHTML = SERVICES.map(serviceTemplate).join("");
  document.querySelectorAll("[data-service]").forEach(card => {
    card.addEventListener("click", () => {
      if (currentRole !== "laura") {
        showToast("Las propuestas de servicio las crea Laura desde su cuenta.");
        return;
      }
      openService(card.dataset.service);
    });
  });
}
function serviceTemplate(service) {
  const actionText = currentRole === "javi" ? "Solo Laura propone" : "Proponer plan";
  return `<button class="service-card" type="button" data-service="${service.id}">
    <div class="service-row"><div class="service-icon">${service.icon}</div><div>
      <p class="eyebrow">${escapeHTML(service.category)}</p><h3>${escapeHTML(service.title)}</h3>
      <p>${escapeHTML(service.description)}</p>
      <div class="chips"><span class="chip">⏱️ ${escapeHTML(service.eta)}</span><span class="chip">${actionText}</span></div>
          </div></div></button>`;
}

function openService(id, options = {}) {
  if (currentRole !== "laura") return;
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
  if (currentRole !== "laura") return;
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
    renderStats(); renderBookings(); renderCalendar(); renderProposalSuccess(data);
    try { await sendProposalByEmail(data); } catch (emailError) { console.error(emailError); showToast("El plan está guardado, aunque el aviso por correo no ha salido."); }
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

async function sendProposalByEmail(proposal) {
  const payload = {
    _subject: `Nueva propuesta en JaviEats - ${proposal.service_title}`,
    destino: CONFIG.emailDestino,
    servicio: proposal.service_title,
    categoria: proposal.category,
    fecha: formatDate(proposal.plan_date),
    hora: formatTime(proposal.plan_time),
    duracion: proposal.duration,
    nivel_de_ganas: proposal.priority,
    nota: proposal.note || "Sin nota",
    estado: proposal.status,
    creada_en: new Date(proposal.created_at).toLocaleString("es-ES")
  };
  const response = await fetch(CONFIG.formspreeEndpoint, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error("Formspree no ha aceptado el envío.");
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
    status: "confirmada"
  };
  try {
    const { data, error } = await supabaseClient.from("propuestas").insert(payload).select().single();
    if (error) throw error;
    state.proposals.push(data);
    state.proposals.sort(sortProposalsByDate);
    selectedDate = data.plan_date;
    const [year, month] = data.plan_date.split("-").map(Number);
    calendarDate = new Date(year, month - 1, 1);
    renderStats(); renderBookings(); renderCalendar();
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
  const isCustom = proposal.entry_type === "custom";
  if (isCustom) {
    const ownsPlan = proposal.created_by === currentUser?.id;
    if (ownsPlan || currentRole === "javi") actions.push(deleteProposalButton(proposal.id));
    return actions.length ? `<div class="booking-actions">${actions.join("")}</div>` : "";
  }
  if (currentRole === "javi") {
    if (proposal.status === "pendiente") actions.push(actionButton(proposal.id, "confirmada", "Confirmar", "action-confirm"));
    if (["pendiente", "confirmada"].includes(proposal.status)) {
      actions.push(actionButton(proposal.id, "realizada", "Marcar realizada", "action-complete"));
      actions.push(actionButton(proposal.id, "cancelada", "Cancelar", "action-cancel"));
    }
    actions.push(deleteProposalButton(proposal.id));
  }
  if (currentRole === "laura" && proposal.status === "pendiente") {
    actions.push(actionButton(proposal.id, "cancelada", "Cancelar propuesta", "action-cancel"));
    actions.push(deleteProposalButton(proposal.id));
  }
  return actions.length ? `<div class="booking-actions">${actions.join("")}</div>` : "";
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
  if (statusButton) await updateProposalStatus(statusButton.dataset.proposalId, statusButton.dataset.proposalStatus);
  if (deleteButton) await deleteProposal(deleteButton.dataset.proposalDelete);
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

async function handleLauraMessage(event) {
  event.preventDefault();
  if (currentRole !== "laura") return;
  const content = lauraMessageContent.value.trim();
  if (!content) { lauraMessageStatus.textContent = "Escribe algo antes de guardarlo."; return; }
  saveLauraMessage.disabled = true;
  lauraMessageStatus.textContent = editingMessageId ? "Guardando cambios..." : "Guardando para Javi...";
  const payload = { tipo: lauraMessageType.value, titulo: lauraMessageTitle.value.trim(), contenido: content };
  try {
    let data;
    if (editingMessageId) {
      const response = await supabaseClient.from("mensajes_laura").update(payload).eq("id", editingMessageId).select().single();
      if (response.error) throw response.error;
      data = response.data;
      state.messages = state.messages.map(item => item.id === data.id ? data : item);
      showToast("Texto actualizado.");
    } else {
      const response = await supabaseClient.from("mensajes_laura").insert({ ...payload, author_id: currentUser.id }).select().single();
      if (response.error) throw response.error;
      data = response.data;
      state.messages.unshift(data);
      showToast("Guardado para Javi.");
    }
    lauraMessageForm.reset();
    editingMessageId = null;
    saveLauraMessage.textContent = "Guardar para Javi";
    lauraMessageStatus.textContent = "Guardado correctamente.";
    renderLauraMessages(); renderMemories();
  } catch (error) { console.error(error); lauraMessageStatus.textContent = "No se ha podido guardar. Revisa la conexión."; }
  finally { saveLauraMessage.disabled = false; }
}

function renderLauraMessages() {
  if (!state.messages.length) {
    lauraMessagesList.innerHTML = `<div class="empty">Todavía no hay mensajes ni cartas guardados.</div>`;
    return;
  }
  lauraMessagesList.innerHTML = state.messages.map(message => {
    const mark = getMessageMark(message.id);
    const title = message.titulo || defaultMessageTitle(message.tipo);
    const badges = [];
    if (mark?.favorito) badges.push('<span class="message-badge favorite">❤️ Favorito</span>');
    if (mark?.guardado_recuerdos) badges.push('<span class="message-badge saved">🗃️ En recuerdos</span>');
    return `<article class="laura-message-card">
      <div class="laura-message-top"><div><span class="laura-message-type">${messageTypeLabel(message.tipo)}</span><h3>${escapeHTML(title)}</h3></div><span class="laura-message-date">${formatDateTime(message.created_at)}</span></div>
      <p class="laura-message-preview">${escapeHTML(truncateText(message.contenido, 150))}</p>
      ${badges.length ? `<div class="message-badges">${badges.join("")}</div>` : ""}
      <div class="laura-message-buttons"><button class="btn btn-secondary btn-small" type="button" data-laura-message-open="${message.id}">Abrir</button>
      ${currentRole === "laura" ? `<button class="btn btn-secondary btn-small" type="button" data-laura-message-edit="${message.id}">Editar</button><button class="btn btn-danger btn-small" type="button" data-laura-message-delete="${message.id}">Eliminar</button>` : ""}</div>
    </article>`;
  }).join("");
}

async function handleLauraMessageListClick(event) {
  const openButton = event.target.closest("[data-laura-message-open]");
  const editButton = event.target.closest("[data-laura-message-edit]");
  const deleteButton = event.target.closest("[data-laura-message-delete]");
  if (openButton) openLauraMessageModal(openButton.dataset.lauraMessageOpen);
  if (editButton) startEditingMessage(editButton.dataset.lauraMessageEdit);
  if (deleteButton) await deleteLauraMessage(deleteButton.dataset.lauraMessageDelete);
}
function startEditingMessage(id) {
  const message = state.messages.find(item => item.id === id);
  if (!message || currentRole !== "laura") return;
  editingMessageId = id;
  lauraMessageType.value = message.tipo;
  lauraMessageTitle.value = message.titulo;
  lauraMessageContent.value = message.contenido;
  saveLauraMessage.textContent = "Guardar cambios";
  lauraMessageStatus.textContent = "Estás editando este texto.";
  lauraComposeCard.scrollIntoView({ behavior: "smooth", block: "start" });
}
async function deleteLauraMessage(id) {
  if (currentRole !== "laura" || !confirm("¿Seguro que quieres eliminar este texto? No se podrá recuperar.")) return;
  try {
    const { error } = await supabaseClient.from("mensajes_laura").delete().eq("id", id);
    if (error) throw error;
    state.messages = state.messages.filter(item => item.id !== id);
    state.marks = state.marks.filter(item => item.mensaje_id !== id);
    if (editingMessageId === id) { lauraMessageForm.reset(); editingMessageId = null; saveLauraMessage.textContent = "Guardar para Javi"; }
    closeLauraMessageModal(); renderLauraMessages(); renderMemories(); showToast("Texto eliminado.");
  } catch (error) { console.error(error); showToast("No se ha podido eliminar el texto."); }
}

function openLauraMessageModal(id) {
  const message = state.messages.find(item => item.id === id);
  if (!message) return;
  openedLauraMessageId = id;
  lauraMessageModalIcon.textContent = messageTypeIcon(message.tipo);
  lauraMessageModalType.textContent = messageTypeLabel(message.tipo);
  lauraMessageModalTitle.textContent = message.titulo || defaultMessageTitle(message.tipo);
  lauraMessageModalDate.textContent = formatDateTimeLong(message.created_at);
  lauraMessageModalContent.textContent = message.contenido;
  renderLauraMessageModalActions();
  lauraMessageModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeLauraMessageModal() {
  lauraMessageModal.classList.add("hidden");
  document.body.style.overflow = "";
  openedLauraMessageId = null;
}
function renderLauraMessageModalActions() {
  const message = state.messages.find(item => item.id === openedLauraMessageId);
  if (!message) { lauraMessageModalActions.innerHTML = ""; return; }
  if (currentRole === "javi") {
    const mark = getMessageMark(message.id);
    lauraMessageModalActions.innerHTML = `<button class="btn btn-secondary" type="button" data-message-favorite="${message.id}">${mark?.favorito ? "Quitar favorito" : "❤️ Marcar favorito"}</button><button class="btn btn-secondary" type="button" data-message-memory="${message.id}">${mark?.guardado_recuerdos ? "Quitar de recuerdos" : "🗃️ Guardar en recuerdos"}</button>`;
    return;
  }
  lauraMessageModalActions.innerHTML = `<button class="btn btn-secondary" type="button" data-message-edit-modal="${message.id}">Editar</button><button class="btn btn-danger" type="button" data-message-delete-modal="${message.id}">Eliminar</button>`;
}
async function handleLauraMessageModalAction(event) {
  const favoriteButton = event.target.closest("[data-message-favorite]");
  const memoryButton = event.target.closest("[data-message-memory]");
  const editButton = event.target.closest("[data-message-edit-modal]");
  const deleteButton = event.target.closest("[data-message-delete-modal]");
  if (favoriteButton) await toggleMessageMark(favoriteButton.dataset.messageFavorite, "favorito");
  if (memoryButton) await toggleMessageMark(memoryButton.dataset.messageMemory, "guardado_recuerdos");
  if (editButton) { const id = editButton.dataset.messageEditModal; closeLauraMessageModal(); startEditingMessage(id); }
  if (deleteButton) await deleteLauraMessage(deleteButton.dataset.messageDeleteModal);
}
async function toggleMessageMark(messageId, field) {
  if (currentRole !== "javi") return;
  const existing = getMessageMark(messageId);
  const payload = { mensaje_id: messageId, marked_by: currentUser.id, favorito: existing?.favorito || false, guardado_recuerdos: existing?.guardado_recuerdos || false };
  payload[field] = !payload[field];
  try {
    const { data, error } = await supabaseClient.from("marcas_mensajes_javi").upsert(payload, { onConflict: "mensaje_id" }).select().single();
    if (error) throw error;
    state.marks = [data, ...state.marks.filter(item => item.mensaje_id !== messageId)];
    renderLauraMessages(); renderMemories(); renderLauraMessageModalActions();
    showToast(field === "favorito" ? (data.favorito ? "Marcado como favorito." : "Favorito retirado.") : (data.guardado_recuerdos ? "Guardado en recuerdos." : "Quitado de recuerdos."));
  } catch (error) { console.error(error); showToast("No se ha podido guardar la marca."); }
}
function getMessageMark(messageId) { return state.marks.find(item => item.mensaje_id === messageId) || null; }

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
    ySiStatusNote.textContent = `Tu respuesta está guardada. Si ${otherName} no responde en unos 2 minutos, recibirá un correo avisando de que es su turno.`;
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
  const staticMemories = MEMORIES.map(memoryTemplate).join("");
  const dynamic = state.messages.filter(message => getMessageMark(message.id)?.guardado_recuerdos).map(message => {
    const title = message.titulo || defaultMessageTitle(message.tipo);
    return `<article class="memory-card"><div class="timeline-dot"></div><div class="memory-date">${formatDateCompact(dateFromTimestamp(message.created_at))}</div><div class="memory-placeholder">${messageTypeIcon(message.tipo)}</div><div class="memory-body"><p class="eyebrow">Escrito por Laura</p><h3>${escapeHTML(title)}</h3><p>${escapeHTML(truncateText(message.contenido, 150))}</p><button class="btn btn-secondary memory-open-btn" type="button" data-laura-memory-id="${message.id}">Abrir recuerdo</button></div></article>`;
  }).join("");
  memoriesList.innerHTML = staticMemories + dynamic;
}
function memoryTemplate(memory) {
  return `<article class="memory-card"><div class="timeline-dot"></div><div class="memory-date">${memory.dateLabel}</div>${memory.cover ? `<img class="memory-cover" src="${memory.cover}" alt="${escapeHTML(memory.title)}" loading="lazy" />` : `<div class="memory-placeholder">${memory.emoji || "💌"}</div>`}<div class="memory-body"><h3>${escapeHTML(memory.title)}</h3><p>${escapeHTML(memory.description)}</p><button class="btn btn-secondary memory-open-btn" type="button" data-memory-id="${memory.id}">${memory.actionLabel}</button></div></article>`;
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

function setMinDate() {
  const today = toDateKeyMadrid(new Date());
  proposalDate.min = today;
  if (!proposalDate.value) proposalDate.value = today;
}
function statusLabel(status) { return ({ pendiente: "Pendiente", confirmada: "Confirmada", realizada: "Realizada", cancelada: "Cancelada" })[status] || status; }
function messageTypeLabel(type) { return ({ mensaje: "Mensaje", carta: "Carta", contarte: "Algo que quiero contarte", idea: "Idea para nosotros" })[type] || "Mensaje"; }
function messageTypeIcon(type) { return ({ mensaje: "💬", carta: "💌", contarte: "🫶", idea: "💡" })[type] || "💌"; }
function defaultMessageTitle(type) { return ({ mensaje: "Un mensaje para Javi", carta: "Una carta para Javi", contarte: "Algo que Laura quiere contarte", idea: "Una idea para los dos" })[type] || "Para Javi"; }
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
function formatDateTimeLong(timestamp) { return new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(timestamp)); }
function currentTimeLabel() { return new Intl.DateTimeFormat("es-ES", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit" }).format(new Date()); }
function timeUntilTomorrow() {
  const now = new Date(); const tomorrow = new Date(now); tomorrow.setHours(24, 0, 0, 0);
  const diff = Math.max(0, tomorrow - now); const h = Math.floor(diff / 3600000); const m = Math.floor((diff % 3600000) / 60000); const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, "0")} h · ${String(m).padStart(2, "0")} min · ${String(s).padStart(2, "0")} s`;
}
function truncateText(text, maxLength) { const clean = String(text || "").trim(); return clean.length <= maxLength ? clean : `${clean.slice(0, maxLength).trim()}…`; }
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
      
