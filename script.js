const CONFIG = {
  formspreeEndpoint: "https://formspree.io/f/xjgddbjw",
  emailDestino: "javiermontorogranados@gmail.com"
};

const STORAGE_KEY = "javieats_propuestas_v1";
const SESSION_KEY = "javieats_access_ok";
const GAME_STORAGE_KEY = "javieats_reto_diario_v1";
const VOUCHER_STORAGE_KEY = "javieats_vales_v1";
const QUESTION_COUNT = 2;

const SECRET_PRIZE = {
  id: "masaje-30",
  title: "Vale por un masaje",
  description: "Un masaje de 30 minutos",
  serviceId: "masaje",
  duration: "30 minutos"
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
    ]
  },
  {
    id: "masaje",
    icon: "💆",
    title: "Masaje",
    category: "Relax",
    description:
      "Espalda, cuello o modo relax. Duración y presión negociables.",
    eta: "20-45 min",
    durations: [
      "20 minutos",
      "30 minutos",
      "45 minutos"
    ],
    bullets: [
      "Para espalda cargada, cuello o cansancio acumulado.",
      "Se aceptan indicaciones de presión.",
      "Servicio sujeto a energía disponible."
    ]
  },
  {
    id: "sushi",
    icon: "🍣",
    title: "Sushi Date",
    category: "Planes para comer",
    description:
      "Propuesta para comer o cenar sushi juntos. La elección del sitio se puede negociar.",
    eta: "1-2 h",
    durations: [
      "Comida",
      "Cena",
      "Plan completo"
    ],
    bullets: [
      "Ideal para antojo serio de sushi.",
      "La hora final se habla entre los dos.",
      "Nivel de hambre obligatorio: medio o alto."
    ]
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
      "Para urgencias reales toca llamar a un profesional; para lo demás, JaviEats intentará acudir."
    ]
  },
  {
    id: "peli",
    icon: "🍿",
    title: "Peli & Sofá",
    category: "Plan tranquilo",
    description:
      "Peli, sofá, manta y algo rico. Plan sin demasiada logística.",
    eta: "2-3 h",
    durations: [
      "Una peli",
      "Peli + cena",
      "Tarde completa"
    ],
    bullets: [
      "La peli se negocia.",
      "Snack recomendado.",
      "Drama opcional, comodidad obligatoria."
    ]
  },
  {
    id: "cafe",
    icon: "☕",
    title: "Café y Charla",
    category: "Plan corto",
    description:
      "Plan sencillo para veros, hablar y desconectar un rato.",
    eta: "45-90 min",
    durations: [
      "Café rápido",
      "Merienda",
      "Plan sin prisa"
    ],
    bullets: [
      "Perfecto para días con poco tiempo.",
      "Sirve para actualizar vida.",
      "Puede convertirse en cena si se lía."
    ]
  },
  {
    id: "sorpresa",
    icon: "🎁",
    title: "Plan Sorpresa",
    category: "Sorpresa",
    description:
      "Laura elige fecha y Javi se encarga de proponer algo.",
    eta: "Variable",
    durations: [
      "Plan corto",
      "Plan medio",
      "Plan completo"
    ],
    bullets: [
      "La clienta propone fecha.",
      "El proveedor prepara idea.",
      "Puede incluir comida, paseo o plan random."
    ]
  },
  {
    id: "paseo",
    icon: "🚗",
    title: "Paseo / Recogida",
    category: "Movimiento",
    description:
      "Plan de coche, paseo o recogida si cuadra disponibilidad.",
    eta: "Variable",
    durations: [
      "Paseo corto",
      "Recogida",
      "Plan con coche"
    ],
    bullets: [
      "Sujeto a horarios y gasolina emocional.",
      "Ideal para moverse sin complicarse.",
      "Destino negociable."
    ]
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
    images: [
      "recuerdos/ramo-2026-05-31.jpeg"
    ],
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

const gateScreen = document.getElementById("gate-screen");
const appScreen = document.getElementById("app-screen");
const gateForm = document.getElementById("gate-form");
const gateQuestion = document.getElementById("gate-question");
const gateInput = document.getElementById("gate-input");
const gateError = document.getElementById("gate-error");
const progressBar = document.getElementById("progress-bar");
const logoutBtn = document.getElementById("logout-btn");

const featuredServices = document.getElementById("featured-services");
const allServices = document.getElementById("all-services");
const totalProposals = document.getElementById("total-proposals");
const nextPlan = document.getElementById("next-plan");

const gameHomeStatus = document.getElementById("game-home-status");
const gameHomeButton = document.getElementById("game-home-button");
const gameModal = document.getElementById("game-modal");
const playerScore = document.getElementById("player-score");
const machineScore = document.getElementById("machine-score");
const gameRoundResult = document.getElementById("game-round-result");
const gameChoices = document.getElementById("game-choices");
const gameFinal = document.getElementById("game-final");
const gameFinalIcon = document.getElementById("game-final-icon");
const gameFinalTitle = document.getElementById("game-final-title");
const gameFinalText = document.getElementById("game-final-text");
const prizeReveal = document.getElementById("prize-reveal");
const prizeTitle = document.getElementById("prize-title");
const prizeDescription = document.getElementById("prize-description");
const downloadVoucherBtn = document.getElementById(
  "download-voucher-btn"
);
const redeemVoucherBtn = document.getElementById(
  "redeem-voucher-btn"
);
const gameDailyNote = document.getElementById("game-daily-note");

const serviceModal = document.getElementById("service-modal");
const modalIcon = document.getElementById("modal-icon");
const modalCategory = document.getElementById("modal-category");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById(
  "modal-description"
);
const modalList = document.getElementById("modal-list");

const proposalForm = document.getElementById("proposal-form");
const serviceId = document.getElementById("service-id");
const proposalDate = document.getElementById("proposal-date");
const proposalTime = document.getElementById("proposal-time");
const proposalDuration = document.getElementById(
  "proposal-duration"
);
const proposalPriority = document.getElementById(
  "proposal-priority"
);
const proposalNote = document.getElementById("proposal-note");
const proposalStatus = document.getElementById("proposal-status");

const calendarTitle = document.getElementById("calendar-title");
const calendarGrid = document.getElementById("calendar-grid");
const prevMonth = document.getElementById("prev-month");
const nextMonth = document.getElementById("next-month");
const selectedTitle = document.getElementById("selected-title");
const dayBookings = document.getElementById("day-bookings");
const bookingList = document.getElementById("booking-list");
const clearHistory = document.getElementById("clear-history");

const memoriesList = document.getElementById("memories-list");
const voucherList = document.getElementById("voucher-list");
const letterEyebrow = document.getElementById("letter-eyebrow");
const letterTitle = document.getElementById("letter-title");
const letterContent = document.getElementById("letter-content");

const memoryModal = document.getElementById("memory-modal");
const memoryModalDate = document.getElementById(
  "memory-modal-date"
);
const memoryModalTitle = document.getElementById(
  "memory-modal-title"
);
const memoryModalDescription = document.getElementById(
  "memory-modal-description"
);
const galleryImage = document.getElementById("gallery-image");
const galleryPrev = document.getElementById("gallery-prev");
const galleryNext = document.getElementById("gallery-next");
const galleryCounter = document.getElementById(
  "gallery-counter"
);

const toast = document.getElementById("toast");

let selectedQuestions = [];
let questionIndex = 0;
let calendarDate = new Date();
let selectedDate = toDateKey(new Date());

let currentGallery = [];
let currentGalleryIndex = 0;
let loadedLetterFile = "";
let dailyTimer = null;

init();

function init() {
  bindEvents();
  renderServices();
  renderMemories();
  renderVouchers();
  setMinDate();
  updateDailyGameCard();

  dailyTimer = setInterval(updateDailyGameCard, 1000);

  if (sessionStorage.getItem(SESSION_KEY) === "true") {
    showApp();
  } else {
    startGate();
  }
}

function bindEvents() {
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

  document
    .querySelectorAll("[data-service-close]")
    .forEach(element => {
      element.addEventListener("click", closeServiceModal);
    });

  document
    .querySelectorAll("[data-game-close]")
    .forEach(element => {
      element.addEventListener("click", closeGameModal);
    });

  document
    .querySelectorAll("[data-memory-close]")
    .forEach(element => {
      element.addEventListener("click", closeMemoryModal);
    });

  gameHomeButton.addEventListener("click", openGameModal);

  document.querySelectorAll("[data-choice]").forEach(button => {
    button.addEventListener("click", () => {
      playRound(button.dataset.choice);
    });
  });

  downloadVoucherBtn.addEventListener("click", () => {
    const voucher = getTodayVoucher();

    if (voucher) {
      downloadVoucher(voucher);
    }
  });

  redeemVoucherBtn.addEventListener("click", () => {
    const voucher = getTodayVoucher();

    if (voucher) {
      redeemVoucher(voucher);
    }
  });

  proposalForm.addEventListener("submit", handleProposal);

  prevMonth.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
  });

  nextMonth.addEventListener("click", () => {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
  });

  clearHistory.addEventListener("click", () => {
    const confirmed = confirm(
      "¿Seguro que quieres borrar el historial local de este móvil?"
    );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    refresh();
    showToast("Historial local borrado.");
  });

  memoriesList.addEventListener("click", event => {
    const button = event.target.closest("[data-memory-id]");

    if (!button) {
      return;
    }

    openMemory(button.dataset.memoryId);
  });

  voucherList.addEventListener("click", event => {
    const downloadButton = event.target.closest(
      "[data-voucher-download]"
    );

    const redeemButton = event.target.closest(
      "[data-voucher-redeem]"
    );

    if (downloadButton) {
      const voucher = getVouchers().find(
        item =>
          item.id === downloadButton.dataset.voucherDownload
      );

      if (voucher) {
        downloadVoucher(voucher);
      }
    }

    if (redeemButton) {
      const voucher = getVouchers().find(
        item =>
          item.id === redeemButton.dataset.voucherRedeem
      );

      if (voucher) {
        redeemVoucher(voucher);
      }
    }
  });

  galleryPrev.addEventListener("click", () => {
    changeGalleryImage(-1);
  });

  galleryNext.addEventListener("click", () => {
    changeGalleryImage(1);
  });
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
          ? `placeholder="${question.placeholder || "Escribe aquí..."}"`
          : ""
      }
      autocomplete="off"
      required
    />
  `;

  setTimeout(() => {
    document.getElementById("answer-input").focus();
  }, 80);
}

function handleGate(event) {
  event.preventDefault();

  const question = selectedQuestions[questionIndex];
  const input = document.getElementById("answer-input");

  if (!question.validate(input.value)) {
    gateError.textContent = question.error;

    if (typeof input.select === "function") {
      input.select();
    }

    return;
  }

  questionIndex++;

  if (questionIndex >= QUESTION_COUNT) {
    progressBar.style.width = "100%";

    sessionStorage.setItem(SESSION_KEY, "true");

    setTimeout(showApp, 220);

    return;
  }

  renderQuestion();
}

function showApp() {
  gateScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");

  refresh();
  updateDailyGameCard();
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);

  appScreen.classList.add("hidden");
  gateScreen.classList.remove("hidden");

  startGate();
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(section => {
    const isActive = section.id === `page-${page}`;

    section.classList.toggle("active", isActive);
  });

  document.querySelectorAll(".nav-btn").forEach(button => {
    const isActive = button.dataset.page === page;

    button.classList.toggle("active", isActive);
  });

  if (page === "calendar") {
    renderCalendar();
    renderBookings();
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
      openService(card.dataset.service);
    });
  });
}

function serviceTemplate(service) {
  return `
    <button
      class="service-card"
      type="button"
      data-service="${service.id}"
    >
      <div class="service-row">
        <div class="service-icon">
          ${service.icon}
        </div>

        <div>
          <p class="eyebrow">
            ${service.category}
          </p>

          <h3>
            ${service.title}
          </h3>

          <p>
            ${service.description}
          </p>

          <div class="chips">
            <span class="chip">
              ⏱️ ${service.eta}
            </span>

            <span class="chip">
              Proponer plan
            </span>
          </div>
        </div>
      </div>
    </button>
  `;
}

function openService(id, options = {}) {
  const service = SERVICES.find(item => item.id === id);

  if (!service) {
    return;
  }

  proposalForm.reset();

  serviceId.value = service.id;
  modalIcon.textContent = service.icon;
  modalCategory.textContent = service.category;
  modalTitle.textContent = service.title;
  modalDescription.textContent = service.description;

  modalList.innerHTML = service.bullets
    .map(item => `<li>${item}</li>`)
    .join("");

  proposalDuration.innerHTML = service.durations
    .map(
      item =>
        `<option value="${item}">${item}</option>`
    )
    .join("");

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
}

function getDailyGame() {
  const today = toDateKey(new Date());

  try {
    const saved = JSON.parse(
      localStorage.getItem(GAME_STORAGE_KEY)
    );

    if (saved && saved.date === today) {
      return saved;
    }
  } catch (error) {
    console.error(
      "No se ha podido leer la partida guardada.",
      error
    );
  }

  return {
    date: today,
    started: false,
    completed: false,
    playerScore: 0,
    machineScore: 0,
    rounds: [],
    result: null
  };
}

function saveDailyGame(game) {
  localStorage.setItem(
    GAME_STORAGE_KEY,
    JSON.stringify(game)
  );
}

function openGameModal() {
  renderGameModal();

  gameModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeGameModal() {
  gameModal.classList.add("hidden");
  document.body.style.overflow = "";

  updateDailyGameCard();
}

function playRound(playerChoice) {
  const game = getDailyGame();

  if (game.completed) {
    return;
  }

  game.started = true;

  const choices = [
    "piedra",
    "papel",
    "tijera"
  ];

  const randomIndex = Math.floor(
    Math.random() * choices.length
  );

  const machineChoice = choices[randomIndex];

  const outcome = getRoundOutcome(
    playerChoice,
    machineChoice
  );

  if (outcome === "win") {
    game.playerScore++;
  }

  if (outcome === "lose") {
    game.machineScore++;
  }

  game.rounds.push({
    playerChoice,
    machineChoice,
    outcome
  });

  if (game.playerScore >= 3) {
    game.completed = true;
    game.result = "win";

    createVoucherForWin(game.date);
  } else if (game.machineScore >= 2) {
    game.completed = true;
    game.result = "lose";
  }

  saveDailyGame(game);
  renderGameModal();
  updateDailyGameCard();
  renderVouchers();
}

function getRoundOutcome(playerChoice, machineChoice) {
  if (playerChoice === machineChoice) {
    return "draw";
  }

  const wins = {
    piedra: "tijera",
    papel: "piedra",
    tijera: "papel"
  };

  if (wins[playerChoice] === machineChoice) {
    return "win";
  }

  return "lose";
}

function renderGameModal() {
  const game = getDailyGame();

  playerScore.textContent = game.playerScore;
  machineScore.textContent = game.machineScore;

  if (game.rounds.length > 0) {
    const lastRound =
      game.rounds[game.rounds.length - 1];

    gameRoundResult.textContent =
      roundMessage(lastRound);
  } else {
    gameRoundResult.textContent =
      "Elige tu jugada para empezar.";
  }

  gameChoices.classList.toggle(
    "hidden",
    game.completed
  );

  gameFinal.classList.toggle(
    "hidden",
    !game.completed
  );

  prizeReveal.classList.add("hidden");

  if (!game.completed) {
    if (game.started) {
      gameDailyNote.textContent =
        "Partida en curso. Si cierras la web, el marcador se conservará.";
    } else {
      gameDailyNote.textContent =
        "El intento de hoy comienza cuando hagas la primera jugada.";
    }

    return;
  }

  if (game.result === "win") {
    const voucher = getTodayVoucher();

    gameFinalIcon.textContent = "🏆";

    gameFinalTitle.textContent =
      "Has ganado el reto diario";

    gameFinalText.textContent =
      "La máquina ha sido derrotada. Ya puedes descubrir el premio de hoy.";

    prizeReveal.classList.remove("hidden");

    prizeTitle.textContent =
      voucher?.title || SECRET_PRIZE.title;

    prizeDescription.textContent =
      voucher?.description ||
      SECRET_PRIZE.description;
  } else {
    gameFinalIcon.textContent = "🤖";

    gameFinalTitle.textContent =
      "La máquina gana hoy";

    gameFinalText.textContent =
      "El intento diario se ha agotado. Mañana habrá una partida nueva y una secuencia diferente.";
  }

  gameDailyNote.textContent =
    `Nuevo intento en ${timeUntilTomorrow()}.`;
}

function roundMessage(round) {
  const labels = {
    piedra: "Piedra ✊",
    papel: "Papel ✋",
    tijera: "Tijera ✌️"
  };

  const resultText = {
    win: "Punto para Laura.",
    lose: "Punto para la máquina.",
    draw: "Empate. No suma nadie."
  };

  return (
    `Laura: ${labels[round.playerChoice]} · ` +
    `Máquina: ${labels[round.machineChoice]}. ` +
    resultText[round.outcome]
  );
}

function updateDailyGameCard() {
  const game = getDailyGame();

  if (!game.started) {
    gameHomeStatus.textContent =
      "Partida disponible. El premio seguirá oculto hasta que ganes.";

    gameHomeButton.textContent =
      "Jugar partida de hoy";

    return;
  }

  if (!game.completed) {
    gameHomeStatus.textContent =
      `Partida en curso · Laura ${game.playerScore} - ` +
      `${game.machineScore} Máquina`;

    gameHomeButton.textContent =
      "Continuar partida";

    return;
  }

  if (game.result === "win") {
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

function timeUntilTomorrow() {
  const now = new Date();
  const tomorrow = new Date(now);

  tomorrow.setHours(24, 0, 0, 0);

  const difference = Math.max(
    0,
    tomorrow.getTime() - now.getTime()
  );

  const hours = Math.floor(
    difference / 3600000
  );

  const minutes = Math.floor(
    (difference % 3600000) / 60000
  );

  const seconds = Math.floor(
    (difference % 60000) / 1000
  );

  return (
    `${String(hours).padStart(2, "0")} h · ` +
    `${String(minutes).padStart(2, "0")} min · ` +
    `${String(seconds).padStart(2, "0")} s`
  );
}

function createVoucherForWin(date) {
  const vouchers = getVouchers();

  const id =
    `vale-${SECRET_PRIZE.id}-${date}`;

  const alreadyExists = vouchers.some(
    item => item.id === id
  );

  if (alreadyExists) {
    return;
  }

  vouchers.unshift({
    id,
    date,
    title: SECRET_PRIZE.title,
    description: SECRET_PRIZE.description,
    serviceId: SECRET_PRIZE.serviceId,
    duration: SECRET_PRIZE.duration,
    code: `JE-${date.replaceAll("-", "")}`
  });

  localStorage.setItem(
    VOUCHER_STORAGE_KEY,
    JSON.stringify(vouchers)
  );
}

function getVouchers() {
  try {
    return (
      JSON.parse(
        localStorage.getItem(VOUCHER_STORAGE_KEY)
      ) || []
    );
  } catch (error) {
    console.error(
      "No se han podido cargar los vales.",
      error
    );

    return [];
  }
}

function getTodayVoucher() {
  const today = toDateKey(new Date());

  return (
    getVouchers().find(
      item => item.date === today
    ) || null
  );
}

function renderVouchers() {
  const vouchers = getVouchers();

  if (!vouchers.length) {
    voucherList.innerHTML = `
      <div class="empty">
        Todavía no hay vales ganados.
        El reto diario puede cambiar eso.
      </div>
    `;

    return;
  }

  voucherList.innerHTML = vouchers
    .map(
      voucher => `
        <article class="voucher-card">
          <div class="voucher-mark">
            JaviEats
          </div>

          <p class="eyebrow">
            Premio conseguido ·
            ${shortDate(voucher.date)}
          </p>

          <h3>
            ${escapeHTML(voucher.title)}
          </h3>

          <p>
            ${escapeHTML(voucher.description)}
          </p>

          <span class="voucher-code">
            ${escapeHTML(voucher.code)}
          </span>

          <div class="voucher-buttons">
            <button
              class="btn btn-primary"
              type="button"
              data-voucher-download="${voucher.id}"
            >
              Descargar vale
            </button>

            <button
              class="btn btn-secondary"
              type="button"
              data-voucher-redeem="${voucher.id}"
            >
              Proponer canje
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function redeemVoucher(voucher) {
  closeGameModal();
  showPage("services");

  openService(voucher.serviceId, {
    duration: voucher.duration,
    note:
      `Vale ${voucher.code} ganado en el ` +
      "reto diario de JaviEats."
  });
}

function downloadVoucher(voucher) {
  const canvas = document.createElement("canvas");

  canvas.width = 1200;
  canvas.height = 1600;

  const context = canvas.getContext("2d");

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

  roundRect(
    context,
    90,
    90,
    1020,
    1420,
    54
  );

  context.fill();

  context.fillStyle = "#ffffff";

  roundRect(
    context,
    120,
    120,
    960,
    1360,
    42
  );

  context.fill();

  context.fillStyle = "#e85d45";

  roundRect(
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
  context.font = "900 82px Arial";

  wrapCanvasText(
    context,
    voucher.title,
    600,
    610,
    820,
    92
  );

  context.fillStyle = "#6f6a64";
  context.font = "600 42px Arial";

  wrapCanvasText(
    context,
    voucher.description,
    600,
    840,
    760,
    58
  );

  context.fillStyle = "#111111";
  context.font = "700 34px Arial";

  context.fillText(
    `Ganado el ${formatDateCompact(voucher.date)}`,
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
    voucher.code,
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

  const link = document.createElement("a");

  link.download =
    `vale-javieats-${voucher.date}.png`;

  link.href =
    canvas.toDataURL("image/png");

  document.body.appendChild(link);

  link.click();
  link.remove();

  showToast("Vale descargado.");
}

function roundRect(
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
  const words = String(text).split(" ");
  const lines = [];

  let line = "";

  words.forEach(word => {
    const testLine = line
      ? `${line} ${word}`
      : word;

    const testWidth =
      context.measureText(testLine).width;

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

  lines.forEach((lineText, index) => {
    context.fillText(
      lineText,
      centerX,
      startY + index * lineHeight
    );
  });
}

function renderMemories() {
  memoriesList.innerHTML = MEMORIES
    .map(
      memory => `
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
      `
    )
    .join("");
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

  currentGallery = memory.images || [];
  currentGalleryIndex = 0;

  memoryModalDate.textContent =
    memory.dateLabel;

  memoryModalTitle.textContent =
    memory.title;

  memoryModalDescription.textContent =
    memory.description;

  renderGalleryImage();

  memoryModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

async function loadLetter(file) {
  if (
    loadedLetterFile === file &&
    letterContent.dataset.loaded === "true"
  ) {
    return;
  }

  letterContent.dataset.loaded = "false";

  letterContent.innerHTML = `
    <p>Cargando carta...</p>
  `;

  try {
    const response = await fetch(file, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `No se ha podido cargar ${file}`
      );
    }

    const text = await response.text();

    letterContent.innerHTML =
      renderLetterText(text);

    letterContent.dataset.loaded = "true";
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
  const cleanText = String(text || "").trim();

  if (!cleanText) {
    return `
      <p>La carta está vacía.</p>
    `;
  }

  const paragraphs = cleanText
    .split(/\n\s*\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean);

  return paragraphs
    .map(
      paragraph => `
        <p>
          ${escapeHTML(paragraph).replace(/\n/g, "<br>")}
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
    currentGallery[currentGalleryIndex];

  galleryCounter.textContent =
    `${currentGalleryIndex + 1} de ` +
    currentGallery.length;

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

async function handleProposal(event) {
  event.preventDefault();

  const service = SERVICES.find(
    item => item.id === serviceId.value
  );

  if (!service) {
    return;
  }

  const proposal = {
    id:
      `${Date.now()}-` +
      Math.random().toString(16).slice(2),

    serviceId: service.id,
    serviceTitle: service.title,
    serviceIcon: service.icon,
    category: service.category,
    date: proposalDate.value,
    time: proposalTime.value,
    duration: proposalDuration.value,
    priority: proposalPriority.value,
    note: proposalNote.value.trim(),
    createdAt: new Date().toISOString()
  };

  proposalStatus.textContent =
    "Enviando propuesta...";

  saveProposal(proposal);
  refresh();

  try {
    await sendProposalByEmail(proposal);

    proposalStatus.textContent =
      "Propuesta enviada. Javi la recibe por correo.";

    showToast(
      "Propuesta enviada a JaviEats."
    );

    setTimeout(() => {
      closeServiceModal();

      selectedDate = proposal.date;

      const [year, month] =
        proposal.date.split("-").map(Number);

      calendarDate = new Date(
        year,
        month - 1,
        1
      );

      showPage("calendar");
      renderCalendar();
    }, 850);
  } catch (error) {
    console.error(error);

    proposalStatus.textContent =
      "Guardada en calendario local, pero el correo no ha salido. Revisa Formspree.";

    showToast(
      "Guardada localmente. Revisa Formspree."
    );
  }
}

async function sendProposalByEmail(proposal) {
  const payload = {
    _subject:
      `Nueva propuesta en JaviEats - ` +
      proposal.serviceTitle,

    destino:
      CONFIG.emailDestino,

    servicio:
      proposal.serviceTitle,

    categoria:
      proposal.category,

    fecha:
      formatDate(proposal.date),

    hora:
      proposal.time,

    duracion:
      proposal.duration,

    nivel_de_ganas:
      proposal.priority,

    nota:
      proposal.note || "Sin nota",

    creada_en:
      new Date(
        proposal.createdAt
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
      "Formspree no ha aceptado el envío"
    );
  }
}

function saveProposal(proposal) {
  const proposals = getProposals();

  proposals.unshift(proposal);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(proposals)
  );
}

function getProposals() {
  try {
    return (
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      ) || []
    );
  } catch (error) {
    console.error(
      "No se han podido cargar las propuestas.",
      error
    );

    return [];
  }
}

function refresh() {
  const proposals = getProposals();

  totalProposals.textContent =
    proposals.length;

  const now = new Date();

  const futureProposals = proposals
    .filter(proposal => {
      const proposalDateTime = new Date(
        `${proposal.date}T${proposal.time}`
      );

      return proposalDateTime >= now;
    })
    .sort((proposalA, proposalB) => {
      const dateA =
        `${proposalA.date}T${proposalA.time}`;

      const dateB =
        `${proposalB.date}T${proposalB.time}`;

      return dateA.localeCompare(dateB);
    });

  nextPlan.textContent =
    futureProposals[0]
      ? shortDate(futureProposals[0].date)
      : "—";

  renderBookings();
  renderCalendar();
  renderVouchers();
}

function renderBookings() {
  const proposals = getProposals();

  if (!proposals.length) {
    bookingList.innerHTML = `
      <div class="empty">
        Todavía no hay propuestas guardadas
        en este móvil.
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
            ${proposal.serviceIcon}
            ${proposal.serviceTitle}
          </div>

          <p>
            ${formatDate(proposal.date)} ·
            ${proposal.time} ·
            ${proposal.duration}
          </p>
        </div>

        <span class="status">
          Pendiente
        </span>
      </div>

      <p>
        <strong>Nivel:</strong>
        ${proposal.priority}
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
    </article>
  `;
}

function renderCalendar() {
  const proposals = getProposals();

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  calendarTitle.textContent =
    new Intl.DateTimeFormat("es-ES", {
      month: "long",
      year: "numeric"
    }).format(calendarDate);

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
    toDateKey(new Date());

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

    const hasBooking = proposals.some(
      proposal => proposal.date === key
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

  document
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
  const proposals = getProposals()
    .filter(
      proposal =>
        proposal.date === selectedDate
    )
    .sort(
      (proposalA, proposalB) =>
        proposalA.time.localeCompare(
          proposalB.time
        )
    );

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

function setMinDate() {
  const today = toDateKey(new Date());

  proposalDate.min = today;

  if (!proposalDate.value) {
    proposalDate.value = today;
  }
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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

function toDateKey(date) {
  const currentDate = new Date(date);

  const year =
    currentDate.getFullYear();

  const month = String(
    currentDate.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    currentDate.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
    new Date(year, month - 1, day)
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
    new Date(year, month - 1, day)
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
    new Date(year, month - 1, day)
  );
}

function escapeHTML(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 2600);
}
