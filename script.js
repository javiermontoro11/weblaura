/****************************************************
 * CONFIGURACIÓN RÁPIDA
 ****************************************************/
const CONFIG = {
  // Opción recomendada: crea un formulario gratis en https://formspree.io/
  // y pega aquí el endpoint. Ejemplo: "https://formspree.io/f/abcdwxyz"
  formspreeEndpoint: "https://formspree.io/f/xjgddbjw",

  // Si no configuras Formspree, se intentará abrir el correo del dispositivo
  // con un email ya preparado. Cambia este correo por el tuyo.
  emailDestino: "javiermontorogranados@gmail.com"
};

/****************************************************
 * PREGUNTAS DE ACCESO
 ****************************************************/
const QUESTIONS = [
  {
    text: "¿Cómo le gusta que le llamen al mejor novio del mundo?",
    inputType: "text",
    placeholder: "Escribe aquí la respuesta...",
    validate: (answer) => normalize(answer).includes("javi"),
    error: "Casi... pista: empieza por J y acaba por avi 😌"
  },
  {
    text: "¿Cuándo empezaste a tener el privilegio de tener al mejor novio del mundo?",
    inputType: "date",
    placeholder: "Selecciona la fecha...",
    validate: (answer) => answer === "2026-04-24",
    error: "Mmm... esa fecha es sagrada. Busca bien en el calendario 💘"
  }
];

/****************************************************
 * SERVICIOS
 ****************************************************/
const SERVICES = {
  telenovio: {
    icon: "📞",
    title: "Telenovio",
    themeClass: "theme-telenovio",
    description: "Servicio premium de novio a distancia. Incluye llamada, atención personalizada, tonterías bonitas, apoyo emocional y disponibilidad para escuchar dramas, chismes o simplemente hacer compañía."
  },
  masajes: {
    icon: "💆‍♀️",
    title: "Masajes",
    themeClass: "theme-masajes",
    description: "Sesión de relax con el mejor novio del mundo. Espalda, cuello, hombros o modo completo: tú eliges el nivel de mimos y Javi pone las manos mágicas."
  },
  sushi: {
    icon: "🍣",
    title: "Ir a comer sushi",
    themeClass: "theme-sushi",
    description: "Plan oficial de cita bonita: sushi, risas, conversación y compañía insuperable. Servicio recomendado para novias con antojo de makis y ganas de pasar tiempo con Javi."
  }
};

const STORAGE_KEY = "reservas_vip_javi";
let currentQuestionIndex = 0;
let selectedService = "telenovio";

const gateSection = document.getElementById("gate-section");
const servicesSection = document.getElementById("services-section");
const gateForm = document.getElementById("gate-form");
const gateQuestion = document.getElementById("gate-question");
const gateAnswer = document.getElementById("gate-answer");
const gateError = document.getElementById("gate-error");
const progressFill = document.getElementById("progress-fill");

const bookingPanel = document.getElementById("booking-panel");
const serviceTitle = document.getElementById("service-title");
const serviceDescription = document.getElementById("service-description");
const serviceKicker = document.getElementById("service-kicker");
const bookingForm = document.getElementById("booking-form");
const bookingStatus = document.getElementById("booking-status");
const bookingsList = document.getElementById("bookings-list");
const clearBookingsButton = document.getElementById("clear-bookings");
const logoutButton = document.getElementById("logout-button");

init();

function init() {
  if (sessionStorage.getItem("accesoVipJavi") === "true") {
    showServices();
  } else {
    renderQuestion();
  }

  document.querySelectorAll(".service-card").forEach((card) => {
    card.addEventListener("click", () => selectService(card.dataset.service));
  });

  gateForm.addEventListener("submit", handleGateSubmit);
  bookingForm.addEventListener("submit", handleBookingSubmit);
  clearBookingsButton.addEventListener("click", clearBookings);
  logoutButton.addEventListener("click", logout);

  renderBookings();
  selectService(selectedService);
}

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isCorrectDate(answer) {
  const cleaned = normalize(answer)
    .replace(/\s+/g, "")
    .replace(/de/g, "")
    .replace(/abril/g, "04")
    .replace(/[.]/g, "/");

  const accepted = [
    "24/04/2026",
    "24-04-2026",
    "24042026",
    "2026-04-24",
    "2026/04/24",
    "24/4/2026",
    "24-4-2026"
  ];

  return accepted.includes(cleaned);
}

function renderQuestion() {
  const question = QUESTIONS[currentQuestionIndex];
  gateQuestion.textContent = question.text;
  gateAnswer.type = question.inputType || "text";
  gateAnswer.placeholder = question.placeholder || "";

  if (question.inputType === "date") {
    gateAnswer.min = "2026-01-01";
    gateAnswer.max = "2026-12-31";
  } else {
    gateAnswer.removeAttribute("min");
    gateAnswer.removeAttribute("max");
  }

  gateAnswer.value = "";
  gateAnswer.focus();
  gateError.textContent = "";
  progressFill.style.width = currentQuestionIndex === 0 ? "50%" : "100%";
}

function handleGateSubmit(event) {
  event.preventDefault();
  const question = QUESTIONS[currentQuestionIndex];
  const answer = gateAnswer.value;

  if (!question.validate(answer)) {
    gateError.textContent = question.error;
    gateAnswer.select();
    return;
  }

  currentQuestionIndex += 1;

  if (currentQuestionIndex >= QUESTIONS.length) {
    sessionStorage.setItem("accesoVipJavi", "true");
    showServices();
    return;
  }

  renderQuestion();
}

function showServices() {
  gateSection.classList.add("hidden");
  servicesSection.classList.remove("hidden");
  selectService(selectedService);
  renderBookings();
}

function logout() {
  sessionStorage.removeItem("accesoVipJavi");
  currentQuestionIndex = 0;
  servicesSection.classList.add("hidden");
  gateSection.classList.remove("hidden");
  renderQuestion();
}

function selectService(serviceKey) {
  selectedService = serviceKey;
  const service = SERVICES[serviceKey];

  document.querySelectorAll(".service-card").forEach((card) => {
    card.classList.toggle("active", card.dataset.service === serviceKey);
  });

  bookingPanel.classList.remove("theme-telenovio", "theme-masajes", "theme-sushi");
  bookingPanel.classList.add(service.themeClass);
  serviceKicker.textContent = `${service.icon} Servicio seleccionado`;
  serviceTitle.textContent = service.title;
  serviceDescription.textContent = service.description;
  bookingStatus.textContent = "";
}

async function handleBookingSubmit(event) {
  event.preventDefault();

  const service = SERVICES[selectedService];
  const booking = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    service: service.title,
    person: document.getElementById("booker-name").value.trim(),
    date: document.getElementById("booking-date").value,
    time: document.getElementById("booking-time").value,
    notes: document.getElementById("booking-notes").value.trim(),
    createdAt: new Date().toISOString()
  };

  saveBooking(booking);
  renderBookings();
  bookingStatus.textContent = "Reserva guardada 💘";

  try {
    if (CONFIG.formspreeEndpoint && CONFIG.formspreeEndpoint.startsWith("https://formspree.io/")) {
      await sendWithFormspree(booking);
      bookingStatus.textContent = "Reserva guardada y enviada por correo 💌";
    } else {
      openMailFallback(booking);
    }
  } catch (error) {
    console.error(error);
    bookingStatus.textContent = "Reserva guardada. El envío por correo ha fallado, revisa la configuración de Formspree.";
  }

  bookingForm.reset();
  document.getElementById("booker-name").value = "Laura la quejica";
}

function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveBooking(booking) {
  const bookings = getBookings();
  bookings.unshift(booking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

function renderBookings() {
  const bookings = getBookings();

  if (!bookings.length) {
    bookingsList.innerHTML = `<div class="booking-item"><strong>Aún no hay reservas.</strong><p>Cuando se reserve algo, aparecerá aquí.</p></div>`;
    return;
  }

  bookingsList.innerHTML = bookings.map((booking) => {
    const notes = booking.notes ? `<p><strong>Notas:</strong> ${escapeHTML(booking.notes)}</p>` : "";
    return `
      <article class="booking-item">
        <strong>${escapeHTML(booking.service)} · ${formatDate(booking.date)} a las ${escapeHTML(booking.time)}</strong>
        <p><strong>Reserva:</strong> ${escapeHTML(booking.person)}</p>
        ${notes}
      </article>
    `;
  }).join("");
}

function clearBookings() {
  const confirmed = confirm("¿Seguro que quieres borrar el historial local de reservas?");
  if (!confirmed) return;
  localStorage.removeItem(STORAGE_KEY);
  renderBookings();
}

async function sendWithFormspree(booking) {
  const response = await fetch(CONFIG.formspreeEndpoint, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      asunto: `Nueva reserva VIP: ${booking.service}`,
      servicio: booking.service,
      reserva_de: booking.person,
      dia: booking.date,
      hora: booking.time,
      notas: booking.notes || "Sin notas especiales",
      creado: booking.createdAt
    })
  });

  if (!response.ok) {
    throw new Error("No se pudo enviar el formulario.");
  }
}

function openMailFallback(booking) {
  if (!CONFIG.emailDestino || CONFIG.emailDestino.includes("TU_CORREO_AQUI")) {
    bookingStatus.textContent = "Reserva guardada. Para recibir correos, cambia TU_CORREO_AQUI en script.js o configura Formspree.";
    return;
  }

  const subject = encodeURIComponent(`Nueva reserva VIP: ${booking.service}`);
  const body = encodeURIComponent(
`Nueva reserva VIP con Javi

Servicio: ${booking.service}
Reserva de: ${booking.person}
Día: ${formatDate(booking.date)}
Hora: ${booking.time}
Notas: ${booking.notes || "Sin notas especiales"}

Generado desde la web de reservas.`
  );

  window.location.href = `mailto:${CONFIG.emailDestino}?subject=${subject}&body=${body}`;
}

function formatDate(value) {
  if (!value) return "sin fecha";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function escapeHTML(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
