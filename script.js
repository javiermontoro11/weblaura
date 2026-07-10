const CONFIG = {
  formspreeEndpoint: "https://formspree.io/f/xjgddbjw",
  emailDestino: "javiermontorogranados@gmail.com"
};

const STORAGE_KEY = "javieats_propuestas_v1";
const SESSION_KEY = "javieats_access_ok";
const QUESTION_COUNT = 2;

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
    id: "sushi",
    icon: "🍣",
    title: "Sushi Date",
    category: "Planes para comer",
    description: "Propuesta para comer o cenar sushi juntos. La elección del sitio se puede negociar.",
    eta: "1-2 h",
    durations: ["Comida", "Cena", "Plan completo"],
    bullets: [
      "Ideal para antojo serio de sushi.",
      "La hora final se habla entre los dos.",
      "Nivel de hambre obligatorio: medio o alto."
    ]
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
    ]
  },
  {
    id: "telenovio",
    icon: "📞",
    title: "Telenovio",
    category: "A distancia",
    description: "Llamada, videollamada o ratito de hablar cuando no podáis veros.",
    eta: "10-60 min",
    durations: ["10 minutos", "30 minutos", "1 hora"],
    bullets: [
      "Para contar cosas, desahogarse o hablar un rato.",
      "Modalidad llamada, audio o videollamada.",
      "Respuesta dependiente de batería y cobertura."
    ]
  },
  {
    id: "peli",
    icon: "🍿",
    title: "Peli & Sofá",
    category: "Plan tranquilo",
    description: "Peli, sofá, manta y algo rico. Plan sin demasiada logística.",
    eta: "2-3 h",
    durations: ["Una peli", "Peli + cena", "Tarde completa"],
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
    description: "Plan sencillo para veros, hablar y desconectar un rato.",
    eta: "45-90 min",
    durations: ["Café rápido", "Merienda", "Plan sin prisa"],
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
    description: "Laura elige fecha y Javi se encarga de proponer algo.",
    eta: "Variable",
    durations: ["Plan corto", "Plan medio", "Plan completo"],
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
    description: "Plan de coche, paseo o recogida si cuadra disponibilidad.",
    eta: "Variable",
    durations: ["Paseo corto", "Recogida", "Plan con coche"],
    bullets: [
      "Sujeto a horarios y gasolina emocional.",
      "Ideal para moverse sin complicarse.",
      "Destino negociable."
    ]
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

const modal = document.getElementById("modal");
const modalIcon = document.getElementById("modal-icon");
const modalCategory = document.getElementById("modal-category");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalList = document.getElementById("modal-list");

const proposalForm = document.getElementById("proposal-form");
const serviceId = document.getElementById("service-id");
const proposalDate = document.getElementById("proposal-date");
const proposalTime = document.getElementById("proposal-time");
const proposalDuration = document.getElementById("proposal-duration");
const proposalPriority = document.getElementById("proposal-priority");
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
const toast = document.getElementById("toast");

let selectedQuestions = [];
let questionIndex = 0;
let calendarDate = new Date();
let selectedDate = toDateKey(new Date());

init();

function init() {
  bindEvents();
  renderServices();
  setMinDate();

  if (sessionStorage.getItem(SESSION_KEY) === "true") {
    showApp();
  } else {
    startGate();
  }
}

function bindEvents() {
  gateForm.addEventListener("submit", handleGate);
  logoutBtn.addEventListener("click", logout);

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.page));
  });

  document.querySelectorAll("[data-go]").forEach(btn => {
    btn.addEventListener("click", () => showPage(btn.dataset.go));
  });

  document.querySelectorAll("[data-close]").forEach(el => {
    el.addEventListener("click", closeModal);
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
    if (!confirm("¿Seguro que quieres borrar el historial local de este móvil?")) return;

    localStorage.removeItem(STORAGE_KEY);
    refresh();
    showToast("Historial local borrado.");
  });
}

function startGate() {
  selectedQuestions = shuffle([...QUESTIONS]).slice(0, QUESTION_COUNT);
  questionIndex = 0;
  renderQuestion();
}

function renderQuestion() {
  const q = selectedQuestions[questionIndex];

  gateQuestion.textContent = q.text;
  gateError.textContent = "";
  progressBar.style.width = `${(questionIndex / QUESTION_COUNT) * 100}%`;

  gateInput.innerHTML = `
    <input
      id="answer-input"
      type="${q.type === "date" ? "date" : "text"}"
      ${q.type === "text" ? `placeholder="${q.placeholder || "Escribe aquí..."}"` : ""}
      autocomplete="off"
      required
    />
  `;

  setTimeout(() => document.getElementById("answer-input").focus(), 80);
}

function handleGate(event) {
  event.preventDefault();

  const q = selectedQuestions[questionIndex];
  const input = document.getElementById("answer-input");

  if (!q.validate(input.value)) {
    gateError.textContent = q.error;
    input.select?.();
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
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  appScreen.classList.add("hidden");
  gateScreen.classList.remove("hidden");
  startGate();
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.toggle("active", p.id === `page-${page}`);
  });

  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });

  if (page === "calendar") renderCalendar();
  if (page === "bookings") renderBookings();
}

function renderServices() {
  featuredServices.innerHTML = SERVICES.slice(0, 3).map(serviceTemplate).join("");
  allServices.innerHTML = SERVICES.map(serviceTemplate).join("");

  document.querySelectorAll("[data-service]").forEach(card => {
    card.addEventListener("click", () => openService(card.dataset.service));
  });
}

function serviceTemplate(service) {
  return `
    <button class="service-card" type="button" data-service="${service.id}">
      <div class="service-row">
        <div class="service-icon">${service.icon}</div>

        <div>
          <p class="eyebrow">${service.category}</p>
          <h3>${service.title}</h3>
          <p>${service.description}</p>

          <div class="chips">
            <span class="chip">⏱️ ${service.eta}</span>
            <span class="chip">Proponer plan</span>
          </div>
        </div>
      </div>
    </button>
  `;
}

function openService(id) {
  const service = SERVICES.find(s => s.id === id);
  if (!service) return;

  serviceId.value = service.id;
  modalIcon.textContent = service.icon;
  modalCategory.textContent = service.category;
  modalTitle.textContent = service.title;
  modalDescription.textContent = service.description;
  modalList.innerHTML = service.bullets.map(item => `<li>${item}</li>`).join("");
  proposalDuration.innerHTML = service.durations.map(item => `<option value="${item}">${item}</option>`).join("");

  proposalForm.reset();
  serviceId.value = service.id;
  proposalStatus.textContent = "";
  setMinDate();

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

async function handleProposal(event) {
  event.preventDefault();

  const service = SERVICES.find(s => s.id === serviceId.value);
  if (!service) return;

  const proposal = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
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

  proposalStatus.textContent = "Enviando propuesta...";

  saveProposal(proposal);
  refresh();

  try {
    await sendProposalByEmail(proposal);

    proposalStatus.textContent = "Propuesta enviada. Javi la recibe por correo.";
    showToast("Propuesta enviada a JaviEats.");

    setTimeout(() => {
      closeModal();

      selectedDate = proposal.date;

      const [year, month] = proposal.date.split("-").map(Number);
      calendarDate = new Date(year, month - 1, 1);

      showPage("calendar");
      renderCalendar();
    }, 850);
  } catch (error) {
    console.error(error);
    proposalStatus.textContent = "Guardada en calendario local, pero el correo no ha salido. Revisa Formspree.";
    showToast("Guardada localmente. Revisa Formspree.");
  }
}

async function sendProposalByEmail(proposal) {
  const payload = {
    _subject: `Nueva propuesta en JaviEats - ${proposal.serviceTitle}`,
    destino: CONFIG.emailDestino,
    servicio: proposal.serviceTitle,
    categoria: proposal.category,
    fecha: formatDate(proposal.date),
    hora: proposal.time,
    duracion: proposal.duration,
    nivel_de_ganas: proposal.priority,
    nota: proposal.note || "Sin nota",
    creada_en: new Date(proposal.createdAt).toLocaleString("es-ES")
  };

  const response = await fetch(CONFIG.formspreeEndpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Formspree no ha aceptado el envío");
  }
}

function saveProposal(proposal) {
  const proposals = getProposals();

  proposals.unshift(proposal);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
}

function getProposals() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function refresh() {
  const proposals = getProposals();

  totalProposals.textContent = proposals.length;

  const now = new Date();

  const future = proposals
    .filter(p => new Date(`${p.date}T${p.time}`) >= now)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  nextPlan.textContent = future[0] ? shortDate(future[0].date) : "—";

  renderBookings();
  renderCalendar();
}

function renderBookings() {
  const proposals = getProposals();

  if (!proposals.length) {
    bookingList.innerHTML = `<div class="empty">Todavía no hay propuestas guardadas en este móvil.</div>`;
    return;
  }

  bookingList.innerHTML = proposals.map(bookingTemplate).join("");
}

function bookingTemplate(p) {
  return `
    <article class="booking-card">
      <div class="booking-top">
        <div>
          <div class="booking-title">${p.serviceIcon} ${p.serviceTitle}</div>
          <p>${formatDate(p.date)} · ${p.time} · ${p.duration}</p>
        </div>

        <span class="status">Pendiente</span>
      </div>

      <p><strong>Nivel:</strong> ${p.priority}</p>

      ${p.note ? `<p><strong>Nota:</strong> ${escapeHTML(p.note)}</p>` : ""}
    </article>
  `;
}

function renderCalendar() {
  const proposals = getProposals();
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  calendarTitle.textContent = new Intl.DateTimeFormat("es-ES", {
    month: "long",
    year: "numeric"
  }).format(calendarDate);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const todayKey = toDateKey(new Date());

  let html = "";

  for (let i = 0; i < startOffset; i++) {
    html += `<button class="day is-empty" type="button"></button>`;
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const hasBooking = proposals.some(p => p.date === key);

    html += `
      <button
        class="day ${key === todayKey ? "is-today" : ""} ${key === selectedDate ? "is-selected" : ""} ${hasBooking ? "has-booking" : ""}"
        type="button"
        data-date="${key}"
      >
        ${day}
      </button>
    `;
  }

  calendarGrid.innerHTML = html;

  document.querySelectorAll("[data-date]").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedDate = btn.dataset.date;
      renderCalendar();
    });
  });

  renderDayDetail();
}

function renderDayDetail() {
  const proposals = getProposals()
    .filter(p => p.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  selectedTitle.textContent = formatDate(selectedDate);

  if (!proposals.length) {
    dayBookings.innerHTML = `<div class="empty">No hay propuestas para este día.</div>`;
    return;
  }

  dayBookings.innerHTML = proposals.map(bookingTemplate).join("");
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
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function toDateKey(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(year, month - 1, day));
}

function shortDate(dateKey) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short"
  }).format(new Date(year, month - 1, day));
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
