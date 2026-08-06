const CONFIG = {
  supabaseUrl: "https://rqycylggsqgmqugxygwr.supabase.co",
  supabasePublishableKey:
    "sb_publishable_RNkvgx5IAbWnKG13hGiMUw_XFpym_S2",
  formspreeEndpoint: "https://formspree.io/f/xjgddbjw",
  emailDestino: "javiermontorogranados@gmail.com"
};

const USER_IDS = {
  JAVI: "ed529e36-5f68-4326-a658-00cfe22d4f01",
  LAURA: "ef4258bf-5897-4594-86ac-a134fcd1feec"
};

const PRE_AUTH_GATE_KEY = "javieats_gate_before_login_v1";
const QUESTION_COUNT = 2;
const REGULAR_GAME_ROUNDS = 5;
const SYNC_INTERVAL_MS = 60_000;

const CHOICES = {
  piedra: {
    label: "Piedra",
    emoji: "✊"
  },
  papel: {
    label: "Papel",
    emoji: "✋"
  },
  tijera: {
    label: "Tijera",
    emoji: "✌️"
  }
};

const QUESTIONS = [
  {
    text: "¿Cómo le gusta que le llamen al mejor novio del mundo?",
    type: "text",
    placeholder: "Escribe la respuesta...",
    error: "Pista: empieza por J y acaba por avi.",
    validate: value => normalize(value).includes("javi")
  },
  {
    text: "¿Cuándo empezaste a tener el privilegio de tener al mejor novio del mundo?",
    type: "date",
    error: "Esa no es la fecha buena.",
    validate: value => value === "2026-04-24"
  },
  {
    text: "¿Cómo se llaman los perros de Javier?",
    type: "text",
    placeholder: "Ej: nombre y nombre",
    error: "Casi. Son dos y tienen mucho nivel.",
    validate: value => {
      const clean = normalize(value).replace(/&/g, " y ");
      return clean.includes("randy") && clean.includes("nala");
    }
  },
  {
    text: "¿Cuál fue el sitio donde cenamos antes de que te pidiese salir?",
    type: "text",
    placeholder: "Nombre del sitio...",
    error: "No es ese sitio. Pista: hamburguesas.",
    validate: value => normalize(value).includes("distrito burger")
  }
];

const SERVICES = [
  {
    id: "mimos",
    icon: "🫂",
    title: "Mimos",
    category: "Cariño y desconexión",
    description:
      "Un rato tranquilo de caricias, abrazos y desconexión. Sin planes complicados y sin necesidad de justificar el pedido.",
    eta: "15-60 min",
    durations: [
      "Mimos express · 15 minutos",
      "Sesión estándar · 30 minutos",
      "Modo sin prisa"
    ],
    bullets: [
      "Caricias en el pelo, la espalda o donde se solicite razonablemente.",
      "Abrazos, sofá o peli de fondo.",
      "Conversación opcional y derecho a quedarse dormida sin penalización."
    ],
    notePlaceholder:
      "Puedes indicar si te apetecen abrazos, caricias, peli, sofá o modo sin hablar..."
  },
  {
    id: "masaje",
    icon: "💆",
    title: "Masaje",
    category: "Relax",
    description:
      "Espalda, cuello o modo relax. Duración y presión negociables.",
    eta: "20-45 min",
    durations: ["20 minutos", "30 minutos", "45 minutos"],
    bullets: [
      "Para espalda cargada, cuello o cansancio acumulado.",
      "Se aceptan indicaciones de presión.",
      "Servicio sujeto a energía disponible."
    ],
    notePlaceholder:
      "Ej: cuello cargado, espalda, presión suave..."
  },
  {
    id: "sushi",
    icon: "🍣",
    title: "Sushi Date",
    category: "Planes para comer",
    description:
      "Propuesta para comer o cenar sushi juntos. La elección del sitio se puede negociar.",
    eta: "1-2 h",
    durations: ["Comida", "Cena", "Plan completo"],
    bullets: [
      "Ideal para un antojo serio de sushi.",
      "La hora y el restaurante se hablan entre los dos.",
      "Nivel de hambre obligatorio: medio o alto."
    ],
    notePlaceholder:
      "Ej: quiero buffet, prefiero pedir a casa, tengo antojo de salmón..."
  },
  {
    id: "telenovio",
    icon: "🏠",
    title: "Telenovio",
    category: "Cuidado a domicilio",
    description:
      "Novio a domicilio para días malos, enfermedad, bajón o necesidad de compañía y cuidados en casa.",
    eta: "Visita variable",
    durations: [
      "Visita rápida",
      "Un par de horas",
      "Tarde de cuidados",
      "Modo sin prisa"
    ],
    bullets: [
      "Compañía, manta, peli y cuidados básicos.",
      "Posibilidad de ir a por comida, medicinas o lo que haga falta.",
      "Para urgencias reales hay que llamar a un profesional; para lo demás, JaviEats intentará acudir."
    ],
    notePlaceholder:
      "Cuéntale a Javi cómo te encuentras o qué necesitas..."
  },
  {
    id: "cine",
    icon: "🎬",
    title: "Peli en el cine",
    category: "Plan de cine",
    description:
      "Plan para ir juntos al cine, elegir una película y acompañarla con palomitas o algo rico.",
    eta: "2-4 h",
    durations: [
      "Sesión de tarde",
      "Sesión de noche",
      "Cine + cena",
      "Cine + picoteo"
    ],
    bullets: [
      "La película y el cine se negocian.",
      "Palomitas altamente recomendadas.",
      "Se puede completar el plan comiendo antes o después."
    ],
    notePlaceholder:
      "Ej: película que quieres ver, cine preferido, palomitas dulces o saladas..."
  },
  {
    id: "plan-diferente",
    icon: "💡",
    title: "Plan diferente",
    category: "Propuesta libre",
    description:
      "Para cuando Laura tenga una idea distinta que no aparezca entre los servicios de JaviEats.",
    eta: "A decidir",
    durations: [
      "Plan corto",
      "Media tarde",
      "Día completo",
      "Por decidir"
    ],
    bullets: [
      "Laura propone la idea.",
      "Puede ser cualquier plan razonable.",
      "Los detalles se terminan de hablar entre los dos."
    ],
    requiresNote: true,
    notePlaceholder:
      "Cuéntale a Javi qué plan diferente te apetece hacer..."
  },
  {
    id: "sorpresa",
    icon: "🎁",
    title: "Plan Sorpresa",
    category: "Sorpresa",
    description:
      "Laura elige una fecha y Javi se encarga de preparar una propuesta.",
    eta: "Variable",
    durations: ["Plan corto", "Plan medio", "Plan completo"],
    bullets: [
      "La clienta propone la fecha.",
      "El proveedor prepara la idea.",
      "Puede incluir comida, paseo o un plan inesperado."
    ],
    notePlaceholder:
      "Puedes indicar presupuesto, tiempo disponible o cosas que no te apetezcan..."
  },
  {
    id: "perritos",
    icon: "🐶",
    title: "Paseo con los perritos",
    category: "Plan con Randy y Nala",
    description:
      "Para cuando Laura quiera ver a Randy y Nala, sacarlos de paseo o pasar un rato con ellos.",
    eta: "30 min-3 h",
    durations: [
      "Paseo corto",
      "Paseo largo",
      "Tarde con los perritos",
      "Visita y mimos"
    ],
    bullets: [
      "Randy y Nala, sujetos a disponibilidad perruna.",
      "Paseo y tiempo para jugar con ellos.",
      "Posibilidad de añadir merienda o paseo juntos."
    ],
    notePlaceholder:
      "Ej: paseo largo, quiero ver a Randy y Nala, merienda después..."
  }
];

const MEMORIES = [
  {
    id: "2026-04-24",
    dateLabel: "24/04/2026",
    title: "El día que empezó oficialmente lo nuestro",
    description:
      "Las primeras flores y la carta con la que empezó todo.",
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
    description:
      "El primer mes nos pilló con kilómetros de por medio. Este ramo llegó al volver de Alemania.",
    type: "gallery",
    cover: "recuerdos/ramo-2026-05-31.jpeg",
    images: ["recuerdos/ramo-2026-05-31.jpeg"],
    actionLabel: "Ver recuerdo"
  },
  {
    id: "2026-07-13",
    dateLabel: "13/07/2026",
    title: "La primera entrega secreta de JaviEats",
    description:
      "La carta de nuestros dos primeros meses, guardada para volver a leerla cuando quieras.",
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
    description:
      "El tercer ramo y la foto con la que quedó oficialmente entregado.",
    type: "gallery",
    cover: "recuerdos/ramo-2026-07-24.jpeg",
    images: [
      "recuerdos/ramo-2026-07-24.jpeg",
      "recuerdos/laura-ramo-2026-07-24.jpeg"
    ],
    actionLabel: "Ver 2 fotos"
  }
];

const authScreen = document.getElementById("auth-screen");
const loginForm = document.getElementById("login-form");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginSubmit = document.getElementById("login-submit");
const loginStatus = document.getElementById("login-status");

const gateScreen = document.getElementById("gate-screen");
const appScreen = document.getElementById("app-screen");
const gateForm = document.getElementById("gate-form");
const gateQuestion = document.getElementById("gate-question");
const gateInput = document.getElementById("gate-input");
const gateError = document.getElementById("gate-error");
const progressBar = document.getElementById("progress-bar");
const logoutBtn = document.getElementById("logout-btn");

const sessionUserName = document.getElementById("session-user-name");
const syncStatus = document.getElementById("sync-status");
const homeGreeting = document.getElementById("home-greeting");

const featuredServices = document.getElementById("featured-services");
const allServices = document.getElementById("all-services");
const totalProposals = document.getElementById("total-proposals");
const nextPlan = document.getElementById("next-plan");

const gameHomeStatus = document.getElementById("game-home-status");
const gameHomeButton = document.getElementById("game-home-button");
const gameModal = document.getElementById("game-modal");
const gameRoundLabel = document.getElementById("game-round-label");
const gameDraws = document.getElementById("game-draws");
const playerScore = document.getElementById("player-score");
const machineScore = document.getElementById("machine-score");
const playerChoiceVisual = document.getElementById("player-choice-visual");
const playerChoiceLabel = document.getElementById("player-choice-label");
const machineChoiceVisual = document.getElementById("machine-choice-visual");
const machineChoiceLabel = document.getElementById("machine-choice-label");
const gameRoundResult = document.getElementById("game-round-result");
const gameChoices = document.getElementById("game-choices");
const gameFinal = document.getElementById("game-final");
const gameFinalIcon = document.getElementById("game-final-icon");
const gameFinalTitle = document.getElementById("game-final-title");
const gameFinalText = document.getElementById("game-final-text");
const prizeReveal = document.getElementById("prize-reveal");
const prizeTitle = document.getElementById("prize-title");
const prizeDescription = document.getElementById("prize-description");
const downloadVoucherBtn = document.getElementById("download-voucher-btn");
const redeemVoucherBtn = document.getElementById("redeem-voucher-btn");
const gameDailyNote = document.getElementById("game-daily-note");

const serviceModal = document.getElementById("service-modal");
const modalIcon = document.getElementById("modal-icon");
const modalCategory = document.getElementById("modal-category");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalList = document.getElementById("modal-list");
const proposalForm = document.getElementById("proposal-form");
const proposalSubmit = document.getElementById("proposal-submit");
const serviceId = document.getElementById("service-id");
const proposalDate = document.getElementById("proposal-date");
const proposalTime = document.getElementById("proposal-time");
const proposalDuration = document.getElementById("proposal-duration");
const proposalPriority = document.getElementById("proposal-priority");
const proposalNote = document.getElementById("proposal-note");
const proposalNoteHint = document.getElementById("proposal-note-hint");
const proposalStatus = document.getElementById("proposal-status");
const proposalSuccess = document.getElementById("proposal-success");
const proposalTicketPreview = document.getElementById(
  "proposal-ticket-preview"
);
const downloadProposalTicket = document.getElementById(
  "download-proposal-ticket"
);

const calendarTitle = document.getElementById("calendar-title");
const calendarGrid = document.getElementById("calendar-grid");
const prevMonth = document.getElementById("prev-month");
const nextMonth = document.getElementById("next-month");
const selectedTitle = document.getElementById("selected-title");
const dayBookings = document.getElementById("day-bookings");
const bookingList = document.getElementById("booking-list");
const clearHistory = document.getElementById("clear-history");

const lauraComposeCard = document.getElementById("laura-compose-card");
const lauraMessageForm = document.getElementById("laura-message-form");
const lauraMessageType = document.getElementById("laura-message-type");
const lauraMessageTitle = document.getElementById("laura-message-title");
const lauraMessageContent = document.getElementById(
  "laura-message-content"
);
const saveLauraMessage = document.getElementById("save-laura-message");
const lauraMessageStatus = document.getElementById("laura-message-status");
const dailyQuestionDate = document.getElementById("daily-question-date");
const dailyQuestionText = document.getElementById("daily-question-text");
const dailyAnswerForm = document.getElementById("daily-answer-form");
const dailyAnswer = document.getElementById("daily-answer");
const saveDailyAnswer = document.getElementById("save-daily-answer");
const dailyAnswerStatus = document.getElementById("daily-answer-status");
const dailyAnswerView = document.getElementById("daily-answer-view");
const dailyAnswerContent = document.getElementById("daily-answer-content");
const lauraMessagesList = document.getElementById("laura-messages-list");

const memoriesList = document.getElementById("memories-list");
const voucherList = document.getElementById("voucher-list");
const letterEyebrow = document.getElementById("letter-eyebrow");
const letterTitle = document.getElementById("letter-title");
const letterContent = document.getElementById("letter-content");

const memoryModal = document.getElementById("memory-modal");
const memoryModalDate = document.getElementById("memory-modal-date");
const memoryModalTitle = document.getElementById("memory-modal-title");
const memoryModalDescription = document.getElementById(
  "memory-modal-description"
);
const galleryImage = document.getElementById("gallery-image");
const galleryPrev = document.getElementById("gallery-prev");
const galleryNext = document.getElementById("gallery-next");
const galleryCounter = document.getElementById("gallery-counter");

const lauraMessageModal = document.getElementById("laura-message-modal");
const lauraMessageModalIcon = document.getElementById(
  "laura-message-modal-icon"
);
const lauraMessageModalType = document.getElementById(
  "laura-message-modal-type"
);
const lauraMessageModalTitle = document.getElementById(
  "laura-message-modal-title"
);
const lauraMessageModalDate = document.getElementById(
  "laura-message-modal-date"
);
const lauraMessageModalContent = document.getElementById(
  "laura-message-modal-content"
);
const lauraMessageModalActions = document.getElementById(
  "laura-message-modal-actions"
);

const toast = document.getElementById("toast");

let supabaseClient = null;
let pendingSession = null;
let currentUser = null;
let currentRole = "unknown";
let selectedQuestions = [];
let questionIndex = 0;
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

const state = {
  proposals: [],
  messages: [],
  marks: [],
  questions: [],
  dailyResponse: null,
  vouchers: []
};

init();

async function init() {
  bindEvents();
  renderServices();
  renderMemories();
  renderVouchers();
  setMinDate();
  startClock();

  if (!window.supabase?.createClient) {
    showAuthError(
      "No se ha podido cargar Supabase. Revisa la conexión a internet."
    );
    return;
  }

  supabaseClient = window.supabase.createClient(
    CONFIG.supabaseUrl,
    CONFIG.supabasePublishableKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      resetAppSession();
      pendingSession = null;

      sessionStorage.removeItem(
        PRE_AUTH_GATE_KEY
      );

      showGateScreen();
    }

    if (event === "TOKEN_REFRESHED" && session?.user) {
      currentUser = session.user;
      pendingSession = session;
    }

    if (event === "SIGNED_IN" && session?.user) {
      pendingSession = session;
    }
  });

  try {
    const {
      data: { session },
      error
    } = await supabaseClient.auth.getSession();

    if (error) {
      throw error;
    }

    pendingSession = session || null;

    const gatePassed =
      sessionStorage.getItem(
        PRE_AUTH_GATE_KEY
      ) === "true";

    if (!gatePassed) {
      showGateScreen();
      return;
    }

    await continueAfterGate();
  } catch (error) {
    console.error(error);

    sessionStorage.removeItem(
      PRE_AUTH_GATE_KEY
    );

    showGateScreen();
  }
}

async function continueAfterGate() {
  if (pendingSession?.user) {
    await handleAuthenticatedSession(
      pendingSession
    );

    return;
  }

  showAuthScreen();
}

function bindEvents() {
  loginForm.addEventListener("submit", handleLogin);
  gateForm.addEventListener("submit", handleGate);
  logoutBtn.addEventListener("click", logout);

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.addEventListener("click", () => {
      showPage(button.dataset.page);
    });
  });

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
      showPage(button.dataset.go);
    });
  });

  document.querySelectorAll("[data-service-close]").forEach(element => {
    element.addEventListener("click", closeServiceModal);
  });

  document.querySelectorAll("[data-game-close]").forEach(element => {
    element.addEventListener("click", closeGameModal);
  });

  document.querySelectorAll("[data-memory-close]").forEach(element => {
    element.addEventListener("click", closeMemoryModal);
  });

  document
    .querySelectorAll("[data-laura-message-close]")
    .forEach(element => {
      element.addEventListener("click", closeLauraMessageModal);
    });
    gameHomeButton.addEventListener("click", openGameModal);

  document.querySelectorAll("[data-choice]").forEach(button => {
    button.addEventListener("click", () => {
      playGameRound(button.dataset.choice);
    });
  });

  downloadVoucherBtn.addEventListener("click", () => {
    const voucher = getVoucherForCurrentGame();

    if (voucher) {
      downloadVoucher(voucher);
    }
  });

  redeemVoucherBtn.addEventListener("click", () => {
    const voucher = getVoucherForCurrentGame();

    if (voucher) {
      proposeVoucherRedemption(voucher);
    }
  });

  proposalForm.addEventListener("submit", handleProposal);

  downloadProposalTicket.addEventListener("click", () => {
    if (lastProposalTicket) {
      downloadTicket(lastProposalTicket);
    }
  });

  prevMonth.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonth.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
  });

  clearHistory.addEventListener("click", clearSharedCalendar);

  [bookingList, dayBookings].forEach(container => {
    container.addEventListener("click", handleBookingAction);
  });

  lauraMessageForm.addEventListener("submit", handleLauraMessage);
  dailyAnswerForm.addEventListener("submit", handleDailyAnswer);
  lauraMessagesList.addEventListener(
    "click",
    handleLauraMessageListClick
  );

  lauraMessageModalActions.addEventListener(
    "click",
    handleLauraMessageModalAction
  );

  memoriesList.addEventListener("click", event => {
    const staticButton = event.target.closest("[data-memory-id]");
    const lauraButton = event.target.closest("[data-laura-memory-id]");

    if (staticButton) {
      openMemory(staticButton.dataset.memoryId);
    }

    if (lauraButton) {
      openLauraMessageModal(lauraButton.dataset.lauraMemoryId);
    }
  });

  voucherList.addEventListener("click", handleVoucherAction);

  galleryPrev.addEventListener("click", () => {
    changeGalleryImage(-1);
  });

  galleryNext.addEventListener("click", () => {
    changeGalleryImage(1);
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && appReady && currentUser) {
      loadAllData({
        silent: true
      });
    }
  });
}

async function handleLogin(event) {
  event.preventDefault();

  loginStatus.textContent = "Iniciando sesión...";
  loginSubmit.disabled = true;

  try {
    const { data, error } =
      await supabaseClient.auth.signInWithPassword({
        email: loginEmail.value.trim(),
        password: loginPassword.value
      });

    if (error) {
      throw error;
    }

    if (!data.session?.user) {
      throw new Error(
        "La sesión no se ha creado correctamente."
      );
    }

    loginForm.reset();
    loginStatus.textContent = "";

    await handleAuthenticatedSession(data.session);
  } catch (error) {
    console.error(error);
    loginStatus.textContent = friendlyAuthError(error);
  } finally {
    loginSubmit.disabled = false;
  }
}

async function handleAuthenticatedSession(session) {
  const role = getRoleFromUser(
    session.user
  );

  if (role === "unknown") {
    await supabaseClient.auth.signOut();

    showAuthError(
      "Esta cuenta no tiene acceso a JaviEats."
    );

    return;
  }

  currentUser = session.user;
  currentRole = role;
  pendingSession = session;

  await showApp();
}

function getRoleFromUser(user) {
  if (user?.id === USER_IDS.JAVI) {
    return "javi";
  }

  if (user?.id === USER_IDS.LAURA) {
    return "laura";
  }

  return "unknown";
}

function getGateSessionKey() {
  return `${SESSION_KEY}:${currentUser?.id || "none"}`;
}

function showAuthScreen() {
  authScreen.classList.remove("hidden");
  gateScreen.classList.add("hidden");
  appScreen.classList.add("hidden");

  loginStatus.textContent = "";
  appReady = false;
}

function showAuthError(message) {
  showAuthScreen();
  loginStatus.textContent = message;
}

function showGateScreen() {
  authScreen.classList.add("hidden");
  appScreen.classList.add("hidden");
  gateScreen.classList.remove("hidden");

  startGate();
}

function startGate() {
  selectedQuestions = shuffle([...QUESTIONS]).slice(
    0,
    QUESTION_COUNT
  );

  questionIndex = 0;
  renderQuestion();
}

function renderQuestion() {
  const question = selectedQuestions[questionIndex];

  gateQuestion.textContent = question.text;
  gateError.textContent = "";

  progressBar.style.width =
    `${(questionIndex / QUESTION_COUNT) * 100}%`;

  gateInput.innerHTML = `
    <input
      id="answer-input"
      type="${question.type === "date" ? "date" : "text"}"
      ${
        question.type === "text"
          ? `placeholder="${escapeHTML(
              question.placeholder || "Escribe aquí..."
            )}"`
          : ""
      }
      autocomplete="off"
      required
    />
  `;

  setTimeout(() => {
    document.getElementById("answer-input")?.focus();
  }, 80);
}

function handleGate(event) {
  event.preventDefault();

  const question = selectedQuestions[questionIndex];
  const input = document.getElementById("answer-input");

  if (!question.validate(input.value)) {
    gateError.textContent = question.error;
    input.select?.();

    return;
  }

  questionIndex++;

if (questionIndex >= QUESTION_COUNT) {
  progressBar.style.width = "100%";

  sessionStorage.setItem(
    PRE_AUTH_GATE_KEY,
    "true"
  );

  setTimeout(() => {
    continueAfterGate();
  }, 220);

  return;
}

  renderQuestion();
}

async function showApp() {
  authScreen.classList.add("hidden");
  gateScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");

  applyRoleUI();

  appReady = true;
  startSyncTimer();

  await loadAllData();
}

function applyRoleUI() {
  const isLaura = currentRole === "laura";

  sessionUserName.textContent = isLaura
    ? "Laura"
    : "Javi";

  homeGreeting.textContent = isLaura
    ? "Hola Laura 👋"
    : "Hola Javi 👋";

  lauraComposeCard.classList.toggle(
    "hidden",
    !isLaura
  );

  clearHistory.classList.toggle(
    "hidden",
    currentRole !== "javi"
  );

  renderServices();
  renderDailyQuestion();
  updateDailyGameCard();
}

async function logout() {
  sessionStorage.removeItem(
    PRE_AUTH_GATE_KEY
  );

  pendingSession = null;

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
  state.questions = [];
  state.dailyResponse = null;
  state.vouchers = [];
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(section => {
    section.classList.toggle(
      "active",
      section.id === `page-${page}`
    );
  });

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === page
    );
  });

  if (page === "calendar") {
    renderCalendar();
    renderBookings();
  }

  if (page === "laura") {
    renderLauraMessages();
    renderDailyQuestion();
  }

  if (page === "memories") {
    renderMemories();
    renderVouchers();
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function startSyncTimer() {
  stopSyncTimer();

  syncTimer = setInterval(() => {
    if (
      !document.hidden &&
      appReady &&
      currentUser
    ) {
      loadAllData({
        silent: true
      });
    }
  }, SYNC_INTERVAL_MS);
}

function stopSyncTimer() {
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = null;
  }
}

function startClock() {
  updateDailyGameCard();

  clockTimer = setInterval(() => {
    updateDailyGameCard();

    if (!gameModal.classList.contains("hidden")) {
      renderGameModal();
    }
  }, 1000);
}

async function loadAllData({ silent = false } = {}) {
  if (!currentUser || !supabaseClient) {
    return;
  }

  if (!silent) {
    setSyncState(
      "loading",
      "Sincronizando…"
    );
  }

  try {
    const today = toDateKeyMadrid(new Date());

    const questionsPromise =
      state.questions.length
        ? Promise.resolve(state.questions)
        : fetchQuestions();

    const [
      proposals,
      messages,
      marks,
      questions,
      dailyResponse,
      vouchers,
      gameData
    ] = await Promise.all([
      fetchProposals(),
      fetchMessages(),
      fetchMarks(),
      questionsPromise,
      fetchDailyResponse(today),
      fetchVouchers(),
      fetchTodayGame(today)
    ]);

    state.proposals = proposals;
    state.messages = messages;
    state.marks = marks;
    state.questions = questions;
    state.dailyResponse = dailyResponse;
    state.vouchers = vouchers;

    dailyGame = gameData.game;
    dailyRounds = gameData.rounds;

    refreshUI();

    setSyncState(
      "ok",
      `Sincronizado · ${currentTimeLabel()}`
    );
  } catch (error) {
    console.error(error);

    setSyncState(
      "error",
      "Error de sincronización"
    );

    if (!silent) {
      showToast(
        "No se han podido cargar todos los datos."
      );
    }
  }
}

async function fetchProposals() {
  const { data, error } = await supabaseClient
    .from("propuestas")
    .select("*")
    .order("plan_date", {
      ascending: true
    })
    .order("plan_time", {
      ascending: true
    });

  if (error) {
    throw error;
  }

  return data || [];
}

async function fetchMessages() {
  const { data, error } = await supabaseClient
    .from("mensajes_laura")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (error) {
    throw error;
  }

  return data || [];
}

async function fetchMarks() {
  const { data, error } = await supabaseClient
    .from("marcas_mensajes_javi")
    .select("*");

  if (error) {
    throw error;
  }

  return data || [];
}

async function fetchQuestions() {
  const { data, error } = await supabaseClient
    .from("preguntas_diarias")
    .select("*")
    .eq("activa", true)
    .order("orden", {
      ascending: true
    });

  if (error) {
    throw error;
  }

  return data || [];
}

async function fetchDailyResponse(dateKey) {
  const { data, error } = await supabaseClient
    .from("respuestas_diarias")
    .select("*")
    .eq("fecha", dateKey)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data || null;
}

async function fetchVouchers() {
  const { data, error } = await supabaseClient
    .from("vales")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (error) {
    throw error;
  }

  return data || [];
}

async function fetchTodayGame(dateKey) {
  const { data: game, error } = await supabaseClient
    .from("retos_diarios")
    .select("*")
    .eq("fecha", dateKey)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!game) {
    return {
      game: null,
      rounds: []
    };
  }

  const {
    data: rounds,
    error: roundsError
  } = await supabaseClient
    .from("rondas_reto")
    .select("*")
    .eq("reto_id", game.id)
    .order("numero", {
      ascending: true
    });

  if (roundsError) {
    throw roundsError;
  }

  return {
    game,
    rounds: rounds || []
  };
}

function setSyncState(type, text) {
  syncStatus.textContent = text;

  syncStatus.classList.toggle(
    "is-loading",
    type === "loading"
  );

  syncStatus.classList.toggle(
    "is-error",
    type === "error"
  );
}

function refreshUI() {
  renderStats();
  renderBookings();
  renderCalendar();
  renderLauraMessages();
  renderDailyQuestion();
  renderMemories();
  renderVouchers();
  updateDailyGameCard();
}

function renderServices() {
  featuredServices.innerHTML = SERVICES
    .slice(0, 3)
    .map(serviceTemplate)
    .join("");

  allServices.innerHTML = SERVICES
    .map(serviceTemplate)
    .join("");

  document.querySelectorAll("[data-service]").forEach(card => {
    card.addEventListener("click", () => {
      if (currentRole !== "laura") {
        showToast(
          "Las propuestas las crea Laura desde su cuenta."
        );

        return;
      }

      openService(card.dataset.service);
    });
  });
}

function serviceTemplate(service) {
  const viewOnlyClass =
    currentRole === "javi"
      ? "is-view-only"
      : "";

  const actionText =
    currentRole === "javi"
      ? "Solo Laura propone"
      : "Proponer plan";

  return `
    <button
      class="service-card ${viewOnlyClass}"
      type="button"
      data-service="${service.id}"
    >
      <div class="service-row">
        <div class="service-icon">
          ${service.icon}
        </div>

        <div>
          <p class="eyebrow">
            ${escapeHTML(service.category)}
          </p>
                    <h3>
            ${escapeHTML(service.title)}
          </h3>

          <p>
            ${escapeHTML(service.description)}
          </p>

          <div class="chips">
            <span class="chip">
              ⏱️ ${escapeHTML(service.eta)}
            </span>

            <span class="chip">
              ${actionText}
            </span>
          </div>
        </div>
      </div>
    </button>
  `;
}

function openService(id, options = {}) {
  if (currentRole !== "laura") {
    showToast("Solo Laura puede crear propuestas.");
    return;
  }

  const service = SERVICES.find(item => item.id === id);

  if (!service) {
    return;
  }

  proposalForm.reset();
  proposalForm.classList.remove("hidden");
  proposalSuccess.classList.add("hidden");

  lastProposalTicket = null;

  serviceId.value = service.id;
  modalIcon.textContent = service.icon;
  modalCategory.textContent = service.category;
  modalTitle.textContent = service.title;
  modalDescription.textContent = service.description;

  modalList.innerHTML = service.bullets
    .map(item => `<li>${escapeHTML(item)}</li>`)
    .join("");

  proposalDuration.innerHTML = service.durations
    .map(
      item => `
        <option value="${escapeHTML(item)}">
          ${escapeHTML(item)}
        </option>
      `
    )
    .join("");

  proposalNote.required = Boolean(service.requiresNote);

  proposalNote.placeholder =
    service.notePlaceholder ||
    "Cuéntale a Javi cualquier detalle...";

  proposalNoteHint.textContent =
    service.requiresNote
      ? "Obligatorio en este servicio"
      : "Opcional";

  proposalStatus.textContent = "";

  setMinDate();

  if (
    options.duration &&
    service.durations.includes(options.duration)
  ) {
    proposalDuration.value = options.duration;
  }

  if (options.note) {
    proposalNote.value = options.note;
  }

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

  if (currentRole !== "laura") {
    proposalStatus.textContent =
      "Solo Laura puede enviar propuestas.";

    return;
  }

  const service = SERVICES.find(
    item => item.id === serviceId.value
  );

  if (!service) {
    return;
  }

  if (
    service.requiresNote &&
    !proposalNote.value.trim()
  ) {
    proposalStatus.textContent =
      "En este servicio tienes que explicar qué plan te apetece.";

    proposalNote.focus();

    return;
  }

  proposalSubmit.disabled = true;

  proposalStatus.textContent =
    "Guardando en el calendario compartido...";

  const payload = {
    created_by: currentUser.id,
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
    const { data, error } = await supabaseClient
      .from("propuestas")
      .insert(payload)
      .select()
      .single();

    if (error) {
      throw error;
    }

    state.proposals.push(data);
    state.proposals.sort(sortProposalsByDate);

    lastProposalTicket = data;

    renderStats();
    renderBookings();
    renderCalendar();
    renderProposalSuccess(data);

    try {
      await sendProposalByEmail(data);
      proposalStatus.textContent = "";
    } catch (emailError) {
      console.error(emailError);

      showToast(
        "El plan está guardado, aunque el aviso por correo no ha salido."
      );
    }

    proposalForm.classList.add("hidden");
    proposalSuccess.classList.remove("hidden");

    showToast(
      "Propuesta guardada en el calendario compartido."
    );
  } catch (error) {
    console.error(error);

    proposalStatus.textContent =
      "No se ha podido guardar la propuesta. Revisa la conexión e inténtalo otra vez.";
  } finally {
    proposalSubmit.disabled = false;
  }
}

function renderProposalSuccess(proposal) {
  proposalTicketPreview.innerHTML = `
    <strong>
      ${proposal.service_icon}
      ${escapeHTML(proposal.service_title)}
    </strong>

    <p>
      📅 ${formatDate(proposal.plan_date)}
    </p>

    <p>
      🕒 ${formatTime(proposal.plan_time)} ·
      ${escapeHTML(proposal.duration)}
    </p>

    <p>
      💭 ${escapeHTML(proposal.priority)}
    </p>

    ${
      proposal.note
        ? `
          <p>
            📝 ${escapeHTML(proposal.note)}
          </p>
        `
        : ""
    }
  `;
}

async function sendProposalByEmail(proposal) {
  const payload = {
    _subject:
      `Nueva propuesta en JaviEats - ` +
      proposal.service_title,

    destino: CONFIG.emailDestino,
    servicio: proposal.service_title,
    categoria: proposal.category,
    fecha: formatDate(proposal.plan_date),
    hora: formatTime(proposal.plan_time),
    duracion: proposal.duration,
    nivel_de_ganas: proposal.priority,
    nota: proposal.note || "Sin nota",
    estado: proposal.status,

    creada_en:
      new Date(
        proposal.created_at
      ).toLocaleString("es-ES")
  };

  const response = await fetch(
    CONFIG.formspreeEndpoint,
    {
      method: "POST",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },

      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error(
      "Formspree no ha aceptado el envío."
    );
  }
}

function renderStats() {
  totalProposals.textContent =
    state.proposals.length;

  const now = new Date();

  const futureProposals = state.proposals
    .filter(proposal => {
      if (
        ["cancelada", "realizada"].includes(
          proposal.status
        )
      ) {
        return false;
      }

      return proposalToDate(proposal) >= now;
    })
    .sort(sortProposalsByDate);

  nextPlan.textContent =
    futureProposals[0]
      ? shortDate(
          futureProposals[0].plan_date
        )
      : "—";
}

function renderBookings() {
  const proposals = [...state.proposals].sort(
    (proposalA, proposalB) => {
      return (
        new Date(proposalB.created_at) -
        new Date(proposalA.created_at)
      );
    }
  );

  if (!proposals.length) {
    bookingList.innerHTML = `
      <div class="empty">
        Todavía no hay propuestas
        en el calendario compartido.
      </div>
    `;

    return;
  }

  bookingList.innerHTML = proposals
    .map(bookingTemplate)
    .join("");
}

function bookingTemplate(proposal) {
  return `
    <article class="booking-card">
      <div class="booking-top">
        <div>
          <div class="booking-title">
            ${proposal.service_icon}
            ${escapeHTML(proposal.service_title)}
          </div>

          <p>
            ${formatDate(proposal.plan_date)} ·
            ${formatTime(proposal.plan_time)} ·
            ${escapeHTML(proposal.duration)}
          </p>
        </div>

        <span class="status status-${proposal.status}">
          ${statusLabel(proposal.status)}
        </span>
      </div>

      <p>
        <strong>Nivel:</strong>
        ${escapeHTML(proposal.priority)}
      </p>

      ${
        proposal.note
          ? `
            <p>
              <strong>Nota:</strong>
              ${escapeHTML(proposal.note)}
            </p>
          `
          : ""
      }

      ${bookingActionsTemplate(proposal)}
    </article>
  `;
}

function bookingActionsTemplate(proposal) {
  const actions = [];

  if (currentRole === "javi") {
    if (proposal.status === "pendiente") {
      actions.push(
        actionButton(
          proposal.id,
          "confirmada",
          "Confirmar",
          "action-confirm"
        )
      );
    }

    if (
      ["pendiente", "confirmada"].includes(
        proposal.status
      )
    ) {
      actions.push(
        actionButton(
          proposal.id,
          "realizada",
          "Marcar realizada",
          "action-complete"
        )
      );

      actions.push(
        actionButton(
          proposal.id,
          "cancelada",
          "Cancelar",
          "action-cancel"
        )
      );
    }

    actions.push(
      deleteProposalButton(proposal.id)
    );
  }

  if (
    currentRole === "laura" &&
    proposal.status === "pendiente"
  ) {
    actions.push(
      actionButton(
        proposal.id,
        "cancelada",
        "Cancelar propuesta",
        "action-cancel"
      )
    );

    actions.push(
      deleteProposalButton(proposal.id)
    );
  }

  if (!actions.length) {
    return "";
  }

  return `
    <div class="booking-actions">
      ${actions.join("")}
    </div>
  `;
}

function actionButton(
  id,
  status,
  text,
  className
) {
  return `
    <button
      class="${className}"
      type="button"
      data-proposal-status="${status}"
      data-proposal-id="${id}"
    >
      ${text}
    </button>
  `;
}

function deleteProposalButton(id) {
  return `
    <button
      class="action-delete"
      type="button"
      data-proposal-delete="${id}"
    >
      Eliminar
    </button>
  `;
}

async function handleBookingAction(event) {
  const statusButton = event.target.closest(
    "[data-proposal-status]"
  );

  const deleteButton = event.target.closest(
    "[data-proposal-delete]"
  );

  if (statusButton) {
    await updateProposalStatus(
      statusButton.dataset.proposalId,
      statusButton.dataset.proposalStatus
    );
  }

  if (deleteButton) {
    await deleteProposal(
      deleteButton.dataset.proposalDelete
    );
  }
}

async function updateProposalStatus(
  id,
  newStatus
) {
  try {
    const { data, error } = await supabaseClient
      .from("propuestas")
      .update({
        status: newStatus
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    state.proposals = state.proposals.map(
      item =>
        item.id === id
          ? data
          : item
    );

    refreshUI();

    showToast(
      `Propuesta ${statusLabel(
        newStatus
      ).toLowerCase()}.`
    );
  } catch (error) {
    console.error(error);

    showToast(
      "No se ha podido actualizar la propuesta."
    );
  }
}

async function deleteProposal(id) {
  const confirmed = confirm(
    "¿Seguro que quieres eliminar esta propuesta del calendario compartido?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const { error } = await supabaseClient
      .from("propuestas")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    state.proposals =
      state.proposals.filter(
        item => item.id !== id
      );

    refreshUI();

    showToast("Propuesta eliminada.");
  } catch (error) {
    console.error(error);

    showToast(
      "No se ha podido eliminar la propuesta."
    );
  }
}

async function clearSharedCalendar() {
  if (currentRole !== "javi") {
    return;
  }

  const confirmed = confirm(
    "Esto borrará todas las propuestas del calendario compartido para los dos. ¿Continuar?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const { error } = await supabaseClient
      .from("propuestas")
      .delete()
      .neq(
        "id",
        "00000000-0000-0000-0000-000000000000"
      );

    if (error) {
      throw error;
    }

    state.proposals = [];

    refreshUI();

    showToast(
      "Calendario compartido limpiado."
    );
  } catch (error) {
    console.error(error);

    showToast(
      "No se ha podido limpiar el calendario."
    );
  }
}

function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  calendarTitle.textContent =
    new Intl.DateTimeFormat(
      "es-ES",
      {
        month: "long",
        year: "numeric"
      }
    ).format(calendarDate);

  const firstDay = new Date(
    year,
    month,
    1
  );

  const lastDay = new Date(
    year,
    month + 1,
    0
  );

  const startOffset =
    (firstDay.getDay() + 6) % 7;

  const todayKey =
    toDateKeyMadrid(new Date());

  let html = "";

  for (
    let index = 0;
    index < startOffset;
    index++
  ) {
    html += `
      <button
        class="day is-empty"
        type="button"
      ></button>
    `;
  }

  for (
    let day = 1;
    day <= lastDay.getDate();
    day++
  ) {
    const key =
      `${year}-` +
      `${String(month + 1).padStart(2, "0")}-` +
      `${String(day).padStart(2, "0")}`;

    const hasBooking = state.proposals.some(
      proposal =>
        proposal.plan_date === key &&
        proposal.status !== "cancelada"
    );

    const todayClass =
      key === todayKey
        ? "is-today"
        : "";

    const selectedClass =
      key === selectedDate
        ? "is-selected"
        : "";

    const bookingClass =
      hasBooking
        ? "has-booking"
        : "";

    html += `
      <button
        class="
          day
          ${todayClass}
          ${selectedClass}
          ${bookingClass}
        "
        type="button"
        data-date="${key}"
      >
        ${day}
      </button>
    `;
  }

  calendarGrid.innerHTML = html;

  calendarGrid
    .querySelectorAll("[data-date]")
    .forEach(button => {
      button.addEventListener("click", () => {
        selectedDate = button.dataset.date;
        renderCalendar();
      });
    });

  renderDayDetail();
}

function renderDayDetail() {
  const proposals = state.proposals
    .filter(
      proposal =>
        proposal.plan_date === selectedDate
    )
    .sort(sortProposalsByDate);

  selectedTitle.textContent =
    formatDate(selectedDate);

  if (!proposals.length) {
    dayBookings.innerHTML = `
      <div class="empty">
        No hay propuestas para este día.
      </div>
    `;

    return;
  }

  dayBookings.innerHTML = proposals
    .map(bookingTemplate)
    .join("");
}

async function handleLauraMessage(event) {
  event.preventDefault();
    if (currentRole !== "laura") {
    return;
  }

  const content =
    lauraMessageContent.value.trim();

  if (!content) {
    lauraMessageStatus.textContent =
      "Escribe algo antes de guardarlo.";

    return;
  }

  saveLauraMessage.disabled = true;

  lauraMessageStatus.textContent =
    editingMessageId
      ? "Guardando cambios..."
      : "Guardando para Javi...";

  const payload = {
    tipo: lauraMessageType.value,
    titulo: lauraMessageTitle.value.trim(),
    contenido: content
  };

  try {
    let data;

    if (editingMessageId) {
      const response = await supabaseClient
        .from("mensajes_laura")
        .update(payload)
        .eq("id", editingMessageId)
        .select()
        .single();

      if (response.error) {
        throw response.error;
      }

      data = response.data;

      state.messages = state.messages.map(
        item =>
          item.id === data.id
            ? data
            : item
      );

      showToast("Texto actualizado.");
    } else {
      const response = await supabaseClient
        .from("mensajes_laura")
        .insert({
          ...payload,
          author_id: currentUser.id
        })
        .select()
        .single();

      if (response.error) {
        throw response.error;
      }

      data = response.data;

      state.messages.unshift(data);

      showToast("Guardado para Javi.");
    }

    lauraMessageForm.reset();

    editingMessageId = null;

    saveLauraMessage.textContent =
      "Guardar para Javi";

    lauraMessageStatus.textContent =
      "Guardado correctamente.";

    renderLauraMessages();
    renderMemories();
  } catch (error) {
    console.error(error);

    lauraMessageStatus.textContent =
      "No se ha podido guardar. Revisa la conexión.";
  } finally {
    saveLauraMessage.disabled = false;
  }
}

function renderLauraMessages() {
  if (!state.messages.length) {
    lauraMessagesList.innerHTML = `
      <div class="empty">
        Todavía no hay mensajes ni cartas guardados.
      </div>
    `;

    return;
  }

  lauraMessagesList.innerHTML =
    state.messages
      .map(message => {
        const mark =
          getMessageMark(message.id);

        const title =
          message.titulo ||
          defaultMessageTitle(message.tipo);

        const preview =
          truncateText(
            message.contenido,
            150
          );

        const badges = [];

        if (mark?.favorito) {
          badges.push(
            '<span class="message-badge favorite">❤️ Favorito</span>'
          );
        }

        if (mark?.guardado_recuerdos) {
          badges.push(
            '<span class="message-badge saved">🗃️ En recuerdos</span>'
          );
        }

        return `
          <article class="laura-message-card">
            <div class="laura-message-top">
              <div>
                <span class="laura-message-type">
                  ${messageTypeLabel(message.tipo)}
                </span>

                <h3>
                  ${escapeHTML(title)}
                </h3>
              </div>

              <span class="laura-message-date">
                ${formatDateTime(message.created_at)}
              </span>
            </div>

            <p class="laura-message-preview">
              ${escapeHTML(preview)}
            </p>

            ${
              badges.length
                ? `
                  <div class="message-badges">
                    ${badges.join("")}
                  </div>
                `
                : ""
            }

            <div class="laura-message-buttons">
              <button
                class="btn btn-secondary btn-small"
                type="button"
                data-laura-message-open="${message.id}"
              >
                Abrir
              </button>

              ${
                currentRole === "laura"
                  ? `
                    <button
                      class="btn btn-secondary btn-small"
                      type="button"
                      data-laura-message-edit="${message.id}"
                    >
                      Editar
                    </button>

                    <button
                      class="btn btn-danger btn-small"
                      type="button"
                      data-laura-message-delete="${message.id}"
                    >
                      Eliminar
                    </button>
                  `
                  : ""
              }
            </div>
          </article>
        `;
      })
      .join("");
}

async function handleLauraMessageListClick(event) {
  const openButton = event.target.closest(
    "[data-laura-message-open]"
  );

  const editButton = event.target.closest(
    "[data-laura-message-edit]"
  );

  const deleteButton = event.target.closest(
    "[data-laura-message-delete]"
  );

  if (openButton) {
    openLauraMessageModal(
      openButton.dataset.lauraMessageOpen
    );
  }

  if (editButton) {
    startEditingMessage(
      editButton.dataset.lauraMessageEdit
    );
  }

  if (deleteButton) {
    await deleteLauraMessage(
      deleteButton.dataset.lauraMessageDelete
    );
  }
}

function startEditingMessage(id) {
  const message = state.messages.find(
    item => item.id === id
  );

  if (
    !message ||
    currentRole !== "laura"
  ) {
    return;
  }

  editingMessageId = id;

  lauraMessageType.value =
    message.tipo;

  lauraMessageTitle.value =
    message.titulo;

  lauraMessageContent.value =
    message.contenido;

  saveLauraMessage.textContent =
    "Guardar cambios";

  lauraMessageStatus.textContent =
    "Estás editando este texto.";

  lauraComposeCard.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

async function deleteLauraMessage(id) {
  if (currentRole !== "laura") {
    return;
  }

  const confirmed = confirm(
    "¿Seguro que quieres eliminar este texto? No se podrá recuperar."
  );

  if (!confirmed) {
    return;
  }

  try {
    const { error } = await supabaseClient
      .from("mensajes_laura")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    state.messages =
      state.messages.filter(
        item => item.id !== id
      );

    state.marks =
      state.marks.filter(
        item => item.mensaje_id !== id
      );

    if (editingMessageId === id) {
      lauraMessageForm.reset();

      editingMessageId = null;

      saveLauraMessage.textContent =
        "Guardar para Javi";
    }

    closeLauraMessageModal();
    renderLauraMessages();
    renderMemories();

    showToast("Texto eliminado.");
  } catch (error) {
    console.error(error);

    showToast(
      "No se ha podido eliminar el texto."
    );
  }
}

function openLauraMessageModal(id) {
  const message = state.messages.find(
    item => item.id === id
  );

  if (!message) {
    return;
  }

  openedLauraMessageId = id;

  const title =
    message.titulo ||
    defaultMessageTitle(message.tipo);

  lauraMessageModalIcon.textContent =
    messageTypeIcon(message.tipo);

  lauraMessageModalType.textContent =
    messageTypeLabel(message.tipo);

  lauraMessageModalTitle.textContent =
    title;

  lauraMessageModalDate.textContent =
    formatDateTimeLong(
      message.created_at
    );

  lauraMessageModalContent.textContent =
    message.contenido;

  renderLauraMessageModalActions();

  lauraMessageModal.classList.remove(
    "hidden"
  );

  document.body.style.overflow =
    "hidden";
}

function closeLauraMessageModal() {
  lauraMessageModal.classList.add(
    "hidden"
  );

  document.body.style.overflow = "";

  openedLauraMessageId = null;
}

function renderLauraMessageModalActions() {
  const message = state.messages.find(
    item =>
      item.id === openedLauraMessageId
  );

  if (!message) {
    lauraMessageModalActions.innerHTML = "";
    return;
  }

  if (currentRole === "javi") {
    const mark =
      getMessageMark(message.id);

    lauraMessageModalActions.innerHTML = `
      <button
        class="btn btn-secondary"
        type="button"
        data-message-favorite="${message.id}"
      >
        ${
          mark?.favorito
            ? "Quitar favorito"
            : "❤️ Marcar favorito"
        }
      </button>

      <button
        class="btn btn-secondary"
        type="button"
        data-message-memory="${message.id}"
      >
        ${
          mark?.guardado_recuerdos
            ? "Quitar de recuerdos"
            : "🗃️ Guardar en recuerdos"
        }
      </button>
    `;

    return;
  }

  lauraMessageModalActions.innerHTML = `
    <button
      class="btn btn-secondary"
      type="button"
      data-message-edit-modal="${message.id}"
    >
      Editar
    </button>

    <button
      class="btn btn-danger"
      type="button"
      data-message-delete-modal="${message.id}"
    >
      Eliminar
    </button>
  `;
}

async function handleLauraMessageModalAction(event) {
  const favoriteButton = event.target.closest(
    "[data-message-favorite]"
  );

  const memoryButton = event.target.closest(
    "[data-message-memory]"
  );

  const editButton = event.target.closest(
    "[data-message-edit-modal]"
  );

  const deleteButton = event.target.closest(
    "[data-message-delete-modal]"
  );

  if (favoriteButton) {
    await toggleMessageMark(
      favoriteButton.dataset.messageFavorite,
      "favorito"
    );
  }

  if (memoryButton) {
    await toggleMessageMark(
      memoryButton.dataset.messageMemory,
      "guardado_recuerdos"
    );
  }

  if (editButton) {
    const id =
      editButton.dataset.messageEditModal;

    closeLauraMessageModal();
    startEditingMessage(id);
  }

  if (deleteButton) {
    await deleteLauraMessage(
      deleteButton.dataset.messageDeleteModal
    );
  }
}

async function toggleMessageMark(
  messageId,
  field
) {
  if (currentRole !== "javi") {
    return;
  }

  const existing =
    getMessageMark(messageId);

  const payload = {
    mensaje_id: messageId,
    marked_by: currentUser.id,
    favorito:
      existing?.favorito || false,

    guardado_recuerdos:
      existing?.guardado_recuerdos ||
      false
  };

  payload[field] = !payload[field];

  try {
    const { data, error } = await supabaseClient
      .from("marcas_mensajes_javi")
      .upsert(payload, {
        onConflict: "mensaje_id"
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    state.marks = [
      data,
      ...state.marks.filter(
        item =>
          item.mensaje_id !== messageId
      )
    ];

    renderLauraMessages();
    renderMemories();
    renderLauraMessageModalActions();

    showToast(
      field === "favorito"
        ? data.favorito
          ? "Marcado como favorito."
          : "Favorito retirado."
        : data.guardado_recuerdos
          ? "Guardado en recuerdos."
          : "Quitado de recuerdos."
    );
  } catch (error) {
    console.error(error);

    showToast(
      "No se ha podido guardar la marca."
    );
  }
}

function getMessageMark(messageId) {
  return (
    state.marks.find(
      item =>
        item.mensaje_id === messageId
    ) || null
  );
}

function getDailyQuestion() {
  if (!state.questions.length) {
    return null;
  }

  if (state.dailyResponse) {
    const answeredQuestion =
      state.questions.find(
        question =>
          question.id ===
          state.dailyResponse.pregunta_id
      );

    if (answeredQuestion) {
      return answeredQuestion;
    }
  }

  const dateKey =
    toDateKeyMadrid(new Date());

  const [year, month, day] =
    dateKey.split("-").map(Number);

  const dayNumber = Math.floor(
    Date.UTC(
      year,
      month - 1,
      day
    ) / 86400000
  );

  const index =
    dayNumber % state.questions.length;

  return state.questions[index];
}

function renderDailyQuestion() {
  const question = getDailyQuestion();
  const isLaura = currentRole === "laura";

  dailyQuestionDate.textContent =
    new Intl.DateTimeFormat(
      "es-ES",
      {
        timeZone: "Europe/Madrid",
        weekday: "long",
        day: "2-digit",
        month: "long"
      }
    ).format(new Date());

  if (!question) {
    dailyQuestionText.textContent =
      "No se ha podido cargar la pregunta de hoy.";

    dailyAnswerForm.classList.add(
      "hidden"
    );

    dailyAnswerView.classList.add(
      "hidden"
    );

    return;
  }

  dailyQuestionText.textContent =
    question.pregunta;

  dailyAnswerStatus.textContent = "";

  if (isLaura) {
    dailyAnswerForm.classList.remove(
      "hidden"
    );

    dailyAnswerView.classList.add(
      "hidden"
    );

    dailyAnswer.value =
      state.dailyResponse?.respuesta ||
      "";

    saveDailyAnswer.textContent =
      state.dailyResponse
        ? "Actualizar respuesta"
        : "Guardar respuesta";

    return;
  }

  dailyAnswerForm.classList.add(
    "hidden"
  );

  dailyAnswerView.classList.remove(
    "hidden"
  );

  dailyAnswerContent.textContent =
    state.dailyResponse?.respuesta
      ? state.dailyResponse.respuesta
      : "Laura todavía no ha respondido la pregunta de hoy.";
}

async function handleDailyAnswer(event) {
  event.preventDefault();

  if (currentRole !== "laura") {
    return;
  }

  const question = getDailyQuestion();
  const answer = dailyAnswer.value.trim();

  if (!question) {
    dailyAnswerStatus.textContent =
      "No se ha podido cargar la pregunta.";

    return;
  }

  if (!answer) {
    dailyAnswerStatus.textContent =
      "Escribe una respuesta antes de guardarla.";

    return;
  }

  saveDailyAnswer.disabled = true;

  dailyAnswerStatus.textContent =
    "Guardando respuesta...";

  try {
    const { data, error } = await supabaseClient
      .from("respuestas_diarias")
      .upsert(
        {
          pregunta_id: question.id,
          user_id: currentUser.id,
          fecha:
            toDateKeyMadrid(new Date()),
          respuesta: answer
        },
        {
          onConflict: "user_id,fecha"
        }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    state.dailyResponse = data;

    renderDailyQuestion();

    dailyAnswerStatus.textContent =
      "Respuesta guardada.";

    showToast(
      "Respuesta del día guardada."
    );
  } catch (error) {
    console.error(error);

    dailyAnswerStatus.textContent =
      "No se ha podido guardar la respuesta. Revisa la conexión.";
  } finally {
    saveDailyAnswer.disabled = false;
  }
}

async function openGameModal() {
  if (currentRole === "laura") {
    try {
      gameHomeButton.disabled = true;

      gameHomeStatus.textContent =
        "Preparando la partida...";

      const { data, error } =
        await supabaseClient.rpc(
          "iniciar_reto_diario"
        );

      if (error) {
        throw error;
      }

      dailyGame = data?.reto || null;

      if (dailyGame) {
        const gameData =
          await fetchTodayGame(
            dailyGame.fecha
          );

        dailyGame = gameData.game;
        dailyRounds = gameData.rounds;
              }
    } catch (error) {
      console.error(error);

      showToast(
        friendlyGameError(error)
      );

      updateDailyGameCard();

      return;
    } finally {
      gameHomeButton.disabled = false;
    }
  }

  if (
    !dailyGame &&
    currentRole === "javi"
  ) {
    showToast(
      "Laura todavía no ha empezado el reto de hoy."
    );

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
  if (
    currentRole !== "laura" ||
    !dailyGame ||
    dailyGame.estado === "finalizado" ||
    roundLocked
  ) {
    return;
  }

  roundLocked = true;

  setChoiceButtonsDisabled(true);

  playerChoiceVisual.textContent =
    CHOICES[choice].emoji;

  playerChoiceLabel.textContent =
    CHOICES[choice].label;

  machineChoiceVisual.textContent =
    "❔";

  machineChoiceLabel.textContent =
    "Eligiendo...";

  machineChoiceVisual.classList.add(
    "thinking"
  );

  gameRoundResult.textContent =
    "La máquina está eligiendo desde Supabase...";

  try {
    const { data, error } =
      await supabaseClient.rpc(
        "jugar_ronda_reto",
        {
          p_eleccion: choice
        }
      );

    if (error) {
      throw error;
    }

    dailyGame = data.reto;

    dailyRounds.push(data.ronda);

    if (data.vale) {
      state.vouchers = [
        data.vale,
        ...state.vouchers.filter(
          item =>
            item.id !== data.vale.id
        )
      ];
    }

    renderGameModal();
    renderVouchers();
    updateDailyGameCard();
  } catch (error) {
    console.error(error);

    gameRoundResult.textContent =
      friendlyGameError(error);
  } finally {
    machineChoiceVisual.classList.remove(
      "thinking"
    );

    roundLocked = false;

    setChoiceButtonsDisabled(false);
  }
}

function renderGameModal() {
  machineChoiceVisual.classList.remove(
    "thinking"
  );

  if (!dailyGame) {
    playerScore.textContent = "0";
    machineScore.textContent = "0";

    gameDraws.textContent =
      "Empates: 0";

    gameRoundLabel.textContent =
      "Partida no iniciada";

    gameRoundResult.textContent =
      "Laura todavía no ha empezado la partida.";

    gameChoices.classList.add(
      "hidden"
    );

    gameFinal.classList.add(
      "hidden"
    );

    prizeReveal.classList.add(
      "hidden"
    );

    return;
  }

  playerScore.textContent =
    dailyGame.victorias_laura;

  machineScore.textContent =
    dailyGame.victorias_maquina;

  gameDraws.textContent =
    `Empates: ${dailyGame.empates}`;

  renderGameRoundHeading();
  renderLastGameRound();

  const finished =
    dailyGame.estado === "finalizado";

  const canPlay =
    currentRole === "laura" &&
    !finished;

  gameChoices.classList.toggle(
    "hidden",
    !canPlay
  );

  gameFinal.classList.toggle(
    "hidden",
    !finished
  );

  prizeReveal.classList.add(
    "hidden"
  );

  if (!finished) {
    if (dailyGame.en_desempate) {
      gameDailyNote.textContent =
        "Muerte súbita: el primer resultado que no sea empate decide la partida.";
    } else if (
      dailyGame.rondas_totales > 0
    ) {
      gameDailyNote.textContent =
        "La partida está guardada en Supabase y puedes continuarla desde otro dispositivo.";
    } else {
      gameDailyNote.textContent =
        "El intento de hoy queda asociado a la cuenta de Laura.";
    }

    setChoiceButtonsDisabled(
      roundLocked ||
      currentRole !== "laura"
    );

    return;
  }

  setChoiceButtonsDisabled(true);

  if (
    dailyGame.resultado === "ganada"
  ) {
    const voucher =
      getVoucherForCurrentGame();

    gameFinalIcon.textContent = "🏆";

    gameFinalTitle.textContent =
      "Laura ha ganado el reto diario";

    gameFinalText.textContent =
      `Resultado final: Laura ` +
      `${dailyGame.victorias_laura} - ` +
      `${dailyGame.victorias_maquina} Máquina.`;

    prizeReveal.classList.remove(
      "hidden"
    );

    prizeTitle.textContent =
      voucher?.titulo ||
      "Vale por un masaje de 30 minutos";

    prizeDescription.textContent =
      voucher?.descripcion ||
      "Premio conseguido al ganar el reto diario de JaviEats.";

    redeemVoucherBtn.classList.toggle(
      "hidden",
      currentRole !== "laura"
    );
  } else {
    gameFinalIcon.textContent = "🤖";

    gameFinalTitle.textContent =
      "La máquina gana hoy";

    gameFinalText.textContent =
      `Resultado final: Laura ` +
      `${dailyGame.victorias_laura} - ` +
      `${dailyGame.victorias_maquina} Máquina. ` +
      "Mañana habrá un nuevo intento.";
  }

  gameDailyNote.textContent =
    `Nuevo intento en ${timeUntilTomorrow()}.`;
}

function renderGameRoundHeading() {
  if (
    dailyGame.estado === "finalizado"
  ) {
    gameRoundLabel.textContent =
      dailyGame.rondas_totales >
      REGULAR_GAME_ROUNDS
        ? "Partida finalizada en muerte súbita"
        : "Partida finalizada";

    return;
  }

  if (dailyGame.en_desempate) {
    const extraRound = Math.max(
      1,
      dailyGame.rondas_totales -
        REGULAR_GAME_ROUNDS +
        1
    );

    gameRoundLabel.textContent =
      `Muerte súbita · ronda extra ${extraRound}`;

    return;
  }

  gameRoundLabel.textContent =
    `Ronda ${dailyGame.rondas_regulares + 1} ` +
    `de ${REGULAR_GAME_ROUNDS}`;
}

function renderLastGameRound() {
  if (!dailyRounds.length) {
    playerChoiceVisual.textContent =
      "❔";

    playerChoiceLabel.textContent =
      "Sin elegir";

    machineChoiceVisual.textContent =
      "❔";

    machineChoiceLabel.textContent =
      "Esperando";

    gameRoundResult.textContent =
      currentRole === "laura"
        ? "Elige tu jugada para empezar."
        : "Laura todavía no ha realizado ninguna jugada.";

    return;
  }

  const lastRound =
    dailyRounds[
      dailyRounds.length - 1
    ];

  const playerChoice =
    CHOICES[lastRound.eleccion_laura];

  const machineChoice =
    CHOICES[lastRound.eleccion_maquina];

  playerChoiceVisual.textContent =
    playerChoice?.emoji || "❔";

  playerChoiceLabel.textContent =
    playerChoice?.label || "Sin elegir";

  machineChoiceVisual.textContent =
    machineChoice?.emoji || "❔";

  machineChoiceLabel.textContent =
    machineChoice?.label || "Esperando";

  gameRoundResult.textContent =
    gameRoundMessage(
      lastRound.resultado
    );
}

function gameRoundMessage(result) {
  const messages = {
    laura:
      "Laura gana esta ronda.",

    maquina:
      "La máquina gana esta ronda.",

    empate:
      "Empate. La ronda cuenta, pero nadie suma victoria."
  };

  return (
    messages[result] ||
    "Ronda guardada."
  );
}

function updateDailyGameCard() {
  if (
    !gameHomeStatus ||
    !gameHomeButton
  ) {
    return;
  }

  if (!currentUser) {
    gameHomeStatus.textContent =
      "Inicia sesión para ver el reto diario.";

    gameHomeButton.disabled = true;

    return;
  }

  if (!dailyGame) {
    if (currentRole === "laura") {
      gameHomeStatus.textContent =
        "Partida disponible. El premio seguirá oculto hasta que ganes.";

      gameHomeButton.textContent =
        "Jugar partida de hoy";

      gameHomeButton.disabled = false;
    } else {
      gameHomeStatus.textContent =
        "Laura todavía no ha jugado hoy.";

      gameHomeButton.textContent =
        "Esperando a Laura";

      gameHomeButton.disabled = true;
    }

    return;
  }

  gameHomeButton.disabled = false;

  if (
    dailyGame.estado !== "finalizado"
  ) {
    const roundText =
      dailyGame.en_desempate
        ? "Muerte súbita"
        : `${dailyGame.rondas_regulares} de 5 rondas jugadas`;

    gameHomeStatus.textContent =
      `${roundText} · Laura ` +
      `${dailyGame.victorias_laura} - ` +
      `${dailyGame.victorias_maquina} Máquina · ` +
      `${dailyGame.empates} empates`;

    gameHomeButton.textContent =
      currentRole === "laura"
        ? "Continuar partida"
        : "Ver partida";

    return;
  }

  if (
    dailyGame.resultado === "ganada"
  ) {
    gameHomeStatus.textContent =
      "Reto superado · premio desbloqueado · " +
      `nuevo intento en ${timeUntilTomorrow()}`;

    gameHomeButton.textContent =
      "Ver premio";
  } else {
    gameHomeStatus.textContent =
      "Intento agotado · " +
      `nuevo reto en ${timeUntilTomorrow()}`;

    gameHomeButton.textContent =
      "Ver resultado";
  }
}

function setChoiceButtonsDisabled(disabled) {
  document
    .querySelectorAll("[data-choice]")
    .forEach(button => {
      button.disabled = disabled;
    });
}

function getVoucherForCurrentGame() {
  if (!dailyGame) {
    return null;
  }

  return (
    state.vouchers.find(
      voucher =>
        voucher.reto_id === dailyGame.id
    ) || null
  );
}

function renderVouchers() {
  if (!state.vouchers.length) {
    voucherList.innerHTML = `
      <div class="empty">
        Todavía no hay vales ganados.
        El reto diario puede cambiar eso.
      </div>
    `;

    return;
  }

  voucherList.innerHTML =
    state.vouchers
      .map(voucher => {
        const code =
          voucherCode(voucher);

        const isActive =
          voucher.estado === "activo";

        const secondButton =
          isActive
            ? currentRole === "javi"
              ? `
                <button
                  class="btn btn-secondary"
                  type="button"
                  data-voucher-use="${voucher.id}"
                >
                  Marcar canjeado
                </button>
              `
              : `
                <button
                  class="btn btn-secondary"
                  type="button"
                  data-voucher-redeem="${voucher.id}"
                >
                  Proponer canje
                </button>
              `
            : "";

        return `
          <article class="voucher-card">
            <div class="voucher-mark">
              JaviEats
            </div>

            <p class="eyebrow">
              Premio conseguido ·
              ${shortDate(
                dateFromTimestamp(
                  voucher.created_at
                )
              )}
            </p>

            <h3>
              ${escapeHTML(voucher.titulo)}
            </h3>

            <p>
              ${escapeHTML(voucher.descripcion)}
            </p>

            <span
              class="
                voucher-state
                ${isActive ? "" : "is-used"}
              "
            >
              ${
                isActive
                  ? "Vale activo"
                  : "Vale canjeado"
              }
            </span>

            <br />

            <span class="voucher-code">
              ${code}
            </span>

            <div class="voucher-buttons">
              <button
                class="btn btn-primary"
                type="button"
                data-voucher-download="${voucher.id}"
              >
                Descargar vale
              </button>

              ${secondButton}
            </div>
          </article>
        `;
      })
      .join("");
}

async function handleVoucherAction(event) {
  const downloadButton =
    event.target.closest(
      "[data-voucher-download]"
    );

  const redeemButton =
    event.target.closest(
      "[data-voucher-redeem]"
    );

  const useButton =
    event.target.closest(
      "[data-voucher-use]"
    );

  if (downloadButton) {
    const voucher =
      state.vouchers.find(
        item =>
          item.id ===
          downloadButton.dataset
            .voucherDownload
      );

    if (voucher) {
      downloadVoucher(voucher);
    }
  }

  if (redeemButton) {
    const voucher =
      state.vouchers.find(
        item =>
          item.id ===
          redeemButton.dataset
            .voucherRedeem
      );

    if (voucher) {
      proposeVoucherRedemption(
        voucher
      );
    }
  }

  if (useButton) {
    await markVoucherAsUsed(
      useButton.dataset.voucherUse
    );
  }
}

function proposeVoucherRedemption(voucher) {
  if (currentRole !== "laura") {
    return;
  }

  closeGameModal();
  showPage("services");

  openService("masaje", {
    duration: "30 minutos",

    note:
      `Canje del vale ` +
      `${voucherCode(voucher)} ` +
      "ganado en JaviEats."
  });
}

async function markVoucherAsUsed(id) {
  if (currentRole !== "javi") {
    return;
  }

  const confirmed = confirm(
    "¿Marcar este vale como canjeado?"
  );

  if (!confirmed) {
    return;
  }

  try {
    const { data, error } =
      await supabaseClient.rpc(
        "canjear_vale",
        {
          p_vale_id: id
        }
      );

    if (error) {
      throw error;
    }

    state.vouchers =
      state.vouchers.map(
        item =>
          item.id === id
            ? data
            : item
      );

    renderVouchers();

    showToast(
      "Vale marcado como canjeado."
    );
  } catch (error) {
    console.error(error);

    showToast(
      "No se ha podido canjear el vale."
    );
  }
}

function downloadVoucher(voucher) {
  const canvas =
    document.createElement("canvas");

  canvas.width = 1200;
  canvas.height = 1600;

  const context =
    canvas.getContext("2d");

  if (!context) {
    showToast(
      "No se ha podido generar el vale."
    );

    return;
  }

  context.fillStyle = "#f4f0ea";

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.fillStyle = "#111111";

  drawRoundedRectangle(
    context,
    90,
    90,
    1020,
    1420,
    54
  );

  context.fill();

  context.fillStyle = "#ffffff";

  drawRoundedRectangle(
    context,
    120,
    120,
    960,
    1360,
    42
  );

  context.fill();

  context.fillStyle = "#e85d45";

  drawRoundedRectangle(
    context,
    180,
    180,
    840,
    120,
    60
  );

  context.fill();

  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.font = "900 54px Arial";

  context.fillText(
    "JaviEats",
    600,
    258
  );

  context.fillStyle = "#111111";
  context.font = "900 44px Arial";

  context.fillText(
    "VALE DESBLOQUEADO",
    600,
    430
  );

  context.fillStyle = "#e85d45";
  context.font = "900 76px Arial";

  wrapCanvasText(
    context,
    voucher.titulo,
    600,
    610,
    820,
    88
  );

  context.fillStyle = "#6f6a64";
  context.font = "600 40px Arial";

  wrapCanvasText(
    context,
    voucher.descripcion,
    600,
    840,
    760,
    56
  );

  context.fillStyle = "#111111";
  context.font = "700 34px Arial";

  context.fillText(
    `Ganado el ${formatDateCompact(
      dateFromTimestamp(
        voucher.created_at
      )
    )}`,
    600,
    1040
  );

  context.strokeStyle = "#e6ddd3";
  context.lineWidth = 4;
  context.setLineDash([18, 14]);

  context.beginPath();
  context.moveTo(220, 1120);
  context.lineTo(980, 1120);
  context.stroke();

  context.setLineDash([]);

  context.fillStyle = "#111111";
  context.font = "900 36px monospace";

  context.fillText(
    voucherCode(voucher),
    600,
    1215
  );

  context.fillStyle = "#6f6a64";
  context.font = "500 28px Arial";

  wrapCanvasText(
    context,
    "Canjeable bajo disponibilidad. Enséñaselo a Javi para hacerlo oficial.",
    600,
    1330,
    780,
    42
  );

  downloadCanvas(
    canvas,
    `vale-javieats-${dateFromTimestamp(
      voucher.created_at
    )}.png`
  );

  showToast("Vale descargado.");
}

function downloadTicket(proposal) {
  const canvas =
    document.createElement("canvas");

  canvas.width = 1200;
  canvas.height = 1500;

  const context =
    canvas.getContext("2d");

  if (!context) {
    showToast(
      "No se ha podido generar el ticket."
    );

    return;
  }

  context.fillStyle = "#f4f0ea";

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  context.fillStyle = "#ffffff";

  drawRoundedRectangle(
    context,
    100,
    90,
    1000,
    1320,
    56
  );

  context.fill();

  context.strokeStyle = "#111111";
  context.lineWidth = 8;

  drawRoundedRectangle(
    context,
    100,
    90,
    1000,
    1320,
    56
  );

  context.stroke();

  context.fillStyle = "#111111";

  drawRoundedRectangle(
    context,
    160,
    150,
    880,
    140,
    50
  );

  context.fill();

  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.font = "900 58px Arial";

  context.fillText(
    "JaviEats",
    600,
    238
  );

  context.fillStyle = "#e85d45";
  context.font = "900 42px Arial";

  context.fillText(
    "PROPUESTA DE PLAN",
    600,
    390
  );

  context.fillStyle = "#111111";
  context.font = "900 76px Arial";

  wrapCanvasText(
    context,
    `${proposal.service_icon} ${proposal.service_title}`,
        600,
    520,
    830,
    88
  );

  context.textAlign = "left";
  context.font = "700 39px Arial";
  context.fillStyle = "#111111";

  const details = [
    `Fecha: ${formatDateCompact(
      proposal.plan_date
    )}`,

    `Hora: ${formatTime(
      proposal.plan_time
    )}`,

    `Duración: ${proposal.duration}`,

    `Nivel de ganas: ${proposal.priority}`,

    `Estado: ${statusLabel(
      proposal.status
    )}`
  ];

  details.forEach((line, index) => {
    context.fillText(
      line,
      190,
      800 + index * 80
    );
  });

  if (proposal.note) {
    context.fillStyle = "#6f6a64";
    context.font = "600 34px Arial";
    context.textAlign = "center";

    wrapCanvasText(
      context,
      `Nota: ${proposal.note}`,
      600,
      1220,
      800,
      48
    );
  }

  downloadCanvas(
    canvas,
    `ticket-javieats-${proposal.plan_date}.png`
  );

  showToast("Ticket descargado.");
}

function renderMemories() {
  const staticMemories =
    MEMORIES
      .map(memoryTemplate)
      .join("");

  const savedMessages =
    state.messages.filter(message => {
      return getMessageMark(
        message.id
      )?.guardado_recuerdos;
    });

  const dynamicMemories =
    savedMessages
      .map(message => {
        const title =
          message.titulo ||
          defaultMessageTitle(
            message.tipo
          );

        return `
          <article class="memory-card">
            <div class="timeline-dot"></div>

            <div class="memory-date">
              ${formatDateCompact(
                dateFromTimestamp(
                  message.created_at
                )
              )}
            </div>

            <div class="memory-placeholder">
              ${messageTypeIcon(message.tipo)}
            </div>

            <div class="memory-body">
              <p class="eyebrow">
                Escrito por Laura
              </p>

              <h3>
                ${escapeHTML(title)}
              </h3>

              <p>
                ${escapeHTML(
                  truncateText(
                    message.contenido,
                    150
                  )
                )}
              </p>

              <button
                class="btn btn-secondary memory-open-btn"
                type="button"
                data-laura-memory-id="${message.id}"
              >
                Abrir recuerdo
              </button>
            </div>
          </article>
        `;
      })
      .join("");

  memoriesList.innerHTML =
    staticMemories +
    dynamicMemories;
}

function memoryTemplate(memory) {
  return `
    <article class="memory-card">
      <div class="timeline-dot"></div>

      <div class="memory-date">
        ${memory.dateLabel}
      </div>

      ${
        memory.cover
          ? `
            <img
              class="memory-cover"
              src="${memory.cover}"
              alt="${escapeHTML(memory.title)}"
              loading="lazy"
            />
          `
          : `
            <div class="memory-placeholder">
              ${memory.emoji || "💌"}
            </div>
          `
      }

      <div class="memory-body">
        <h3>
          ${escapeHTML(memory.title)}
        </h3>

        <p>
          ${escapeHTML(memory.description)}
        </p>

        <button
          class="btn btn-secondary memory-open-btn"
          type="button"
          data-memory-id="${memory.id}"
        >
          ${memory.actionLabel}
        </button>
      </div>
    </article>
  `;
}

function openMemory(id) {
  const memory = MEMORIES.find(
    item => item.id === id
  );

  if (!memory) {
    return;
  }

  if (memory.type === "letter") {
    letterEyebrow.textContent =
      memory.letterEyebrow;

    letterTitle.textContent =
      memory.letterTitle;

    showPage("letter");

    loadLetter(memory.letterFile);

    return;
  }

  currentGallery =
    memory.images || [];

  currentGalleryIndex = 0;

  memoryModalDate.textContent =
    memory.dateLabel;

  memoryModalTitle.textContent =
    memory.title;

  memoryModalDescription.textContent =
    memory.description;

  renderGalleryImage();

  memoryModal.classList.remove(
    "hidden"
  );

  document.body.style.overflow =
    "hidden";
}

async function loadLetter(file) {
  if (
    loadedLetterFile === file &&
    letterContent.dataset.loaded === "true"
  ) {
    return;
  }

  letterContent.dataset.loaded = "false";

  letterContent.innerHTML =
    "<p>Cargando carta...</p>";

  try {
    const response = await fetch(
      file,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        `No se ha podido cargar ${file}`
      );
    }

    const text =
      await response.text();

    letterContent.innerHTML =
      renderLetterText(text);

    letterContent.dataset.loaded =
      "true";

    loadedLetterFile = file;
  } catch (error) {
    console.error(error);

    letterContent.innerHTML = `
      <p>
        No se ha podido cargar esta carta.
      </p>

      <p>
        Revisa que el archivo
        <strong>${escapeHTML(file)}</strong>
        exista en GitHub y que el nombre coincida
        exactamente.
      </p>
    `;
  }
}

function renderLetterText(text) {
  const cleanText =
    String(text || "").trim();

  if (!cleanText) {
    return "<p>La carta está vacía.</p>";
  }

  return cleanText
    .split(/\n\s*\n/)
    .map(paragraph =>
      paragraph.trim()
    )
    .filter(Boolean)
    .map(
      paragraph => `
        <p>
          ${escapeHTML(
            paragraph
          ).replace(/\n/g, "<br>")}
        </p>
      `
    )
    .join("");
}

function closeMemoryModal() {
  memoryModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function changeGalleryImage(direction) {
  if (currentGallery.length <= 1) {
    return;
  }

  currentGalleryIndex =
    (
      currentGalleryIndex +
      direction +
      currentGallery.length
    ) % currentGallery.length;

  renderGalleryImage();
}

function renderGalleryImage() {
  if (!currentGallery.length) {
    return;
  }

  galleryImage.src =
    currentGallery[
      currentGalleryIndex
    ];

  galleryCounter.textContent =
    `${currentGalleryIndex + 1} de ` +
    `${currentGallery.length}`;

  const showArrows =
    currentGallery.length > 1;

  galleryPrev.classList.toggle(
    "hidden",
    !showArrows
  );

  galleryNext.classList.toggle(
    "hidden",
    !showArrows
  );

  galleryCounter.classList.toggle(
    "hidden",
    !showArrows
  );
}

function setMinDate() {
  const today =
    toDateKeyMadrid(new Date());

  proposalDate.min = today;

  if (!proposalDate.value) {
    proposalDate.value = today;
  }
}

function statusLabel(status) {
  const labels = {
    pendiente: "Pendiente",
    confirmada: "Confirmada",
    realizada: "Realizada",
    cancelada: "Cancelada"
  };

  return labels[status] || status;
}

function messageTypeLabel(type) {
  const labels = {
    mensaje: "Mensaje",
    carta: "Carta",
    contarte:
      "Algo que quiero contarte",
    idea: "Idea para nosotros"
  };

  return labels[type] || "Mensaje";
}

function messageTypeIcon(type) {
  const icons = {
    mensaje: "💬",
    carta: "💌",
    contarte: "🫶",
    idea: "💡"
  };

  return icons[type] || "💌";
}

function defaultMessageTitle(type) {
  const titles = {
    mensaje:
      "Un mensaje para Javi",

    carta:
      "Una carta para Javi",

    contarte:
      "Algo que Laura quiere contarte",

    idea:
      "Una idea para los dos"
  };

  return titles[type] || "Para Javi";
}

function voucherCode(voucher) {
  const date =
    dateFromTimestamp(
      voucher.created_at
    ).replaceAll("-", "");

  return (
    `JE-${date}-` +
    voucher.id
      .slice(0, 6)
      .toUpperCase()
  );
}

function sortProposalsByDate(
  proposalA,
  proposalB
) {
  const dateA =
    `${proposalA.plan_date}T` +
    normalizeTimeForDate(
      proposalA.plan_time
    );

  const dateB =
    `${proposalB.plan_date}T` +
    normalizeTimeForDate(
      proposalB.plan_time
    );

  return dateA.localeCompare(dateB);
}

function proposalToDate(proposal) {
  return new Date(
    `${proposal.plan_date}T` +
    normalizeTimeForDate(
      proposal.plan_time
    )
  );
}

function normalizeTimeForDate(time) {
  const clean =
    String(time || "00:00").slice(
      0,
      8
    );

  return clean.length === 5
    ? `${clean}:00`
    : clean;
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .replace(/\s+/g, " ");
}

function shuffle(array) {
  return array
    .map(value => ({
      value,
      sort: Math.random()
    }))
    .sort(
      (itemA, itemB) =>
        itemA.sort - itemB.sort
    )
    .map(({ value }) => value);
}

function toDateKeyMadrid(date) {
  const parts =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone: "Europe/Madrid",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }
    ).formatToParts(
      new Date(date)
    );

  const values =
    Object.fromEntries(
      parts
        .filter(
          part =>
            part.type !== "literal"
        )
        .map(
          part => [
            part.type,
            part.value
          ]
        )
    );

  return (
    `${values.year}-` +
    `${values.month}-` +
    `${values.day}`
  );
}

function dateFromTimestamp(timestamp) {
  return toDateKeyMadrid(
    new Date(timestamp)
  );
}

function formatDate(dateKey) {
  const [year, month, day] =
    dateKey.split("-").map(Number);

  return new Intl.DateTimeFormat(
    "es-ES",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    }
  ).format(
    new Date(
      year,
      month - 1,
      day
    )
  );
}

function formatDateCompact(dateKey) {
  const [year, month, day] =
    dateKey.split("-").map(Number);

  return new Intl.DateTimeFormat(
    "es-ES",
    {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }
  ).format(
    new Date(
      year,
      month - 1,
      day
    )
  );
}

function shortDate(dateKey) {
  const [year, month, day] =
    dateKey.split("-").map(Number);

  return new Intl.DateTimeFormat(
    "es-ES",
    {
      day: "2-digit",
      month: "short"
    }
  ).format(
    new Date(
      year,
      month - 1,
      day
    )
  );
}

function formatTime(time) {
  return String(time || "").slice(
    0,
    5
  );
}

function formatDateTime(timestamp) {
  return new Intl.DateTimeFormat(
    "es-ES",
    {
      timeZone: "Europe/Madrid",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(
    new Date(timestamp)
  );
}

function formatDateTimeLong(timestamp) {
  return new Intl.DateTimeFormat(
    "es-ES",
    {
      timeZone: "Europe/Madrid",
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(
    new Date(timestamp)
  );
}

function currentTimeLabel() {
  return new Intl.DateTimeFormat(
    "es-ES",
    {
      timeZone: "Europe/Madrid",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(
    new Date()
  );
}

function timeUntilTomorrow() {
  const now = new Date();
  const tomorrow = new Date(now);

  tomorrow.setHours(
    24,
    0,
    0,
    0
  );

  const difference = Math.max(
    0,
    tomorrow.getTime() -
      now.getTime()
  );

  const hours = Math.floor(
    difference / 3600000
  );

  const minutes = Math.floor(
    (
      difference %
      3600000
    ) / 60000
  );

  const seconds = Math.floor(
    (
      difference %
      60000
    ) / 1000
  );

  return (
    `${String(hours).padStart(
      2,
      "0"
    )} h · ` +
    `${String(minutes).padStart(
      2,
      "0"
    )} min · ` +
    `${String(seconds).padStart(
      2,
      "0"
    )} s`
  );
}

function truncateText(
  text,
  maxLength
) {
  const clean =
    String(text || "").trim();

  if (clean.length <= maxLength) {
    return clean;
  }

  return (
    `${clean
      .slice(0, maxLength)
      .trim()}…`
  );
}

function escapeHTML(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function friendlyAuthError(error) {
  const message =
    String(
      error?.message || ""
    ).toLowerCase();

  if (
    message.includes(
      "invalid login credentials"
    )
  ) {
    return (
      "Correo o contraseña incorrectos."
    );
  }

  if (
    message.includes(
      "email not confirmed"
    )
  ) {
    return (
      "La cuenta todavía no está confirmada en Supabase."
    );
  }

  if (
    message.includes(
      "failed to fetch"
    )
  ) {
    return (
      "No hay conexión con Supabase."
    );
  }

  return (
    "No se ha podido iniciar sesión. Revisa los datos."
  );
}

function friendlyGameError(error) {
  const message =
    String(
      error?.message || ""
    );

  if (
    message.includes(
      "intento de hoy"
    )
  ) {
    return (
      "Laura ya ha utilizado su intento de hoy."
    );
  }

  if (
    message.includes(
      "solamente puede jugarlo Laura"
    )
  ) {
    return (
      "Este reto solamente puede jugarlo Laura."
    );
  }

  return (
    "No se ha podido guardar la jugada. Revisa la conexión."
  );
}

function drawRoundedRectangle(
  context,
  x,
  y,
  width,
  height,
  radius
) {
  const adjustedRadius = Math.min(
    radius,
    width / 2,
    height / 2
  );

  context.beginPath();

  context.moveTo(
    x + adjustedRadius,
    y
  );

  context.arcTo(
    x + width,
    y,
    x + width,
    y + height,
    adjustedRadius
  );

  context.arcTo(
    x + width,
    y + height,
    x,
    y + height,
    adjustedRadius
  );

  context.arcTo(
    x,
    y + height,
    x,
    y,
    adjustedRadius
  );

  context.arcTo(
    x,
    y,
    x + width,
    y,
    adjustedRadius
  );

  context.closePath();
}

function wrapCanvasText(
  context,
  text,
  centerX,
  startY,
  maxWidth,
  lineHeight
) {
  const words =
    String(text).split(" ");

  const lines = [];

  let line = "";

  words.forEach(word => {
    const testLine =
      line
        ? `${line} ${word}`
        : word;

    const testWidth =
      context.measureText(
        testLine
      ).width;

    if (
      testWidth > maxWidth &&
      line
    ) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  });

  if (line) {
    lines.push(line);
  }

  lines.forEach(
    (lineText, index) => {
      context.fillText(
        lineText,
        centerX,
        startY +
          index * lineHeight
      );
    }
  );
}

function downloadCanvas(
  canvas,
  filename
) {
  const link =
    document.createElement("a");

  link.download = filename;

  link.href =
    canvas.toDataURL("image/png");

  document.body.appendChild(link);

  link.click();
  link.remove();
}

function showToast(message) {
  toast.textContent = message;

  toast.classList.remove("hidden");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(
    () => {
      toast.classList.add("hidden");
    },
    2800
  );
}
