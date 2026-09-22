(() => {
  "use strict";

  const services = Object.freeze([
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
].map(service => Object.freeze({
    ...service,
    durations: Object.freeze([...(service.durations || [])]),
    bullets: Object.freeze([...(service.bullets || [])])
  })));

  function getService(id) {
    return services.find(service => service.id === id) || null;
  }

  async function fetchAll(client) {
    if (!client) throw new Error("Supabase client unavailable");
    const { data, error } = await client
      .from("propuestas")
      .select("*")
      .order("plan_date", { ascending: true })
      .order("plan_time", { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async function create(client, payload) {
    if (!client) throw new Error("Supabase client unavailable");
    const { data, error } = await client
      .from("propuestas")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async function update(client, id, payload) {
    if (!client || !id) throw new Error("Plan update unavailable");
    const { data, error } = await client
      .from("propuestas")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async function remove(client, id) {
    if (!client || !id) throw new Error("Plan delete unavailable");
    const { error } = await client
      .from("propuestas")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return true;
  }

  async function clear(client) {
    if (!client) throw new Error("Supabase client unavailable");
    const { error } = await client
      .from("propuestas")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) throw error;
    return true;
  }


  let calendarDate = new Date();
  let selectedDate = toDateKeyMadrid(new Date());
  let lastProposalTicket = null;
  let bound = false;

  const $ = id => document.getElementById(id);
  const app = () => window.JaviEatsApp;
  const state = () => app()?.getState?.() || { proposals: [] };

  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function toDateKeyMadrid(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Madrid",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date(date));
    const values = Object.fromEntries(
      parts.filter(part => part.type !== "literal").map(part => [part.type, part.value])
    );
    return `${values.year}-${values.month}-${values.day}`;
  }

  function formatDate(dateKey) {
    const [year, month, day] = String(dateKey || "").split("-").map(Number);
    if (!year || !month || !day) return String(dateKey || "");
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(new Date(year, month - 1, day));
  }

  function formatDateCompact(dateKey) {
    const [year, month, day] = String(dateKey || "").split("-").map(Number);
    if (!year || !month || !day) return String(dateKey || "");
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(new Date(year, month - 1, day));
  }

  function shortDate(dateKey) {
    const [year, month, day] = String(dateKey || "").split("-").map(Number);
    if (!year || !month || !day) return String(dateKey || "");
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short"
    }).format(new Date(year, month - 1, day));
  }

  function formatTime(time) {
    return String(time || "").slice(0, 5);
  }

  function normalizeTimeForDate(time) {
    const clean = String(time || "00:00").slice(0, 8);
    return clean.length === 5 ? `${clean}:00` : clean;
  }

  function sortByDate(a, b) {
    return `${a.plan_date}T${normalizeTimeForDate(a.plan_time)}`
      .localeCompare(`${b.plan_date}T${normalizeTimeForDate(b.plan_time)}`);
  }

  function toDate(proposal) {
    return new Date(`${proposal.plan_date}T${normalizeTimeForDate(proposal.plan_time)}`);
  }

  function statusLabel(status) {
    return ({
      pendiente: "Pendiente",
      confirmada: "Confirmada",
      realizada: "Realizada",
      cancelada: "Cancelada"
    })[status] || status;
  }

  function notifyUI() {
    app()?.refreshUI?.();
  }

  function setMinDate() {
    const input = $("proposal-date");
    if (!input) return;
    const today = toDateKeyMadrid(new Date());
    input.min = today;
    if (!input.value) input.value = today;
  }

  function serviceTemplate(service) {
    return `<button class="service-card" type="button" data-service="${service.id}">
      <div class="service-row"><div class="service-icon">${service.icon}</div><div>
        <p class="eyebrow">${escapeHtml(service.category)}</p><h3>${escapeHtml(service.title)}</h3>
        <p>${escapeHtml(service.description)}</p>
        <div class="chips"><span class="chip">⏱️ ${escapeHtml(service.eta)}</span><span class="chip">Proponer plan</span></div>
      </div></div>
    </button>`;
  }

  function renderServices() {
    const featured = $("featured-services");
    const all = $("all-services");
    if (featured) featured.innerHTML = services.slice(0, 3).map(serviceTemplate).join("");
    if (all) all.innerHTML = services.map(serviceTemplate).join("");
  }

  function openService(id, options = {}) {
    const service = getService(id);
    if (!service) return;

    const form = $("proposal-form");
    const success = $("proposal-success");
    form?.reset();
    form?.classList.remove("hidden");
    success?.classList.add("hidden");
    lastProposalTicket = null;

    if ($("service-id")) $("service-id").value = service.id;
    if ($("modal-icon")) $("modal-icon").textContent = service.icon;
    if ($("modal-category")) $("modal-category").textContent = service.category;
    if ($("modal-title")) $("modal-title").textContent = service.title;
    if ($("modal-description")) $("modal-description").textContent = service.description;
    if ($("modal-list")) {
      $("modal-list").innerHTML = service.bullets.map(item => `<li>${escapeHtml(item)}</li>`).join("");
    }
    if ($("proposal-duration")) {
      $("proposal-duration").innerHTML = service.durations
        .map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`)
        .join("");
    }

    const note = $("proposal-note");
    if (note) {
      note.required = Boolean(service.requiresNote);
      note.placeholder = service.notePlaceholder || "Cuéntale a Javi cualquier detalle...";
    }
    if ($("proposal-note-hint")) {
      $("proposal-note-hint").textContent = service.requiresNote ? "Obligatorio en este servicio" : "Opcional";
    }
    if ($("proposal-status")) $("proposal-status").textContent = "";

    setMinDate();

    if (options.duration && service.durations.includes(options.duration) && $("proposal-duration")) {
      $("proposal-duration").value = options.duration;
    }
    if (options.note && note) note.value = options.note;

    $("service-modal")?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeServiceModal() {
    $("service-modal")?.classList.add("hidden");
    document.body.style.overflow = "";
    $("proposal-form")?.classList.remove("hidden");
    $("proposal-success")?.classList.add("hidden");
    if ($("proposal-status")) $("proposal-status").textContent = "";
    lastProposalTicket = null;
  }

  async function handleProposal(event) {
    event.preventDefault();

    const user = app()?.getUser?.();
    const client = app()?.getClient?.();
    if (!user || !client) return;

    const service = getService($("service-id")?.value);
    if (!service) return;

    const note = $("proposal-note");
    const status = $("proposal-status");
    const submit = $("proposal-submit");

    if (service.requiresNote && !note?.value?.trim()) {
      if (status) status.textContent = "En este servicio tienes que explicar qué plan te apetece.";
      note?.focus();
      return;
    }

    if (submit) submit.disabled = true;
    if (status) status.textContent = "Guardando en el calendario compartido...";

    const payload = {
      created_by: user.id,
      entry_type: "service",
      is_all_day: false,
      service_id: service.id,
      service_title: service.title,
      service_icon: service.icon,
      category: service.category,
      plan_date: $("proposal-date")?.value || "",
      plan_time: $("proposal-time")?.value || "",
      duration: $("proposal-duration")?.value || "",
      priority: $("proposal-priority")?.value || "",
      note: note?.value?.trim() || "",
      status: "pendiente"
    };

    try {
      const data = await create(client, payload);
      state().proposals.push(data);
      state().proposals.sort(sortByDate);
      lastProposalTicket = data;
      renderProposalSuccess(data);
      $("proposal-form")?.classList.add("hidden");
      $("proposal-success")?.classList.remove("hidden");
      notifyUI();
      app()?.showToast?.("Propuesta guardada en el calendario compartido.");
    } catch (error) {
      console.error(error);
      if (status) status.textContent = "No se ha podido guardar la propuesta. Revisa la conexión.";
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  function renderProposalSuccess(proposal) {
    const preview = $("proposal-ticket-preview");
    if (!preview) return;

    preview.innerHTML = `
      <strong>${proposal.service_icon} ${escapeHtml(proposal.service_title)}</strong>
      <p>📅 ${formatDate(proposal.plan_date)}</p>
      <p>🕒 ${formatTime(proposal.plan_time)} · ${escapeHtml(proposal.duration)}</p>
      <p>💭 ${escapeHtml(proposal.priority)}</p>
      ${proposal.note ? `<p>📝 ${escapeHtml(proposal.note)}</p>` : ""}
    `;
  }

  function openCustomPlanModal() {
    $("custom-plan-form")?.reset();
    if ($("custom-plan-status")) $("custom-plan-status").textContent = "";

    const date = $("custom-plan-date");
    if (date) {
      date.value = selectedDate || toDateKeyMadrid(new Date());
      date.min = toDateKeyMadrid(new Date());
    }

    if ($("custom-plan-all-day")) $("custom-plan-all-day").checked = false;
    if ($("custom-plan-time")) $("custom-plan-time").value = "";

    updateCustomPlanTimeVisibility();
    $("custom-plan-modal")?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    setTimeout(() => $("custom-plan-title")?.focus(), 100);
  }

  function closeCustomPlanModal() {
    $("custom-plan-modal")?.classList.add("hidden");
    document.body.style.overflow = "";
    if ($("custom-plan-status")) $("custom-plan-status").textContent = "";
  }

  function updateCustomPlanTimeVisibility() {
    const isAllDay = Boolean($("custom-plan-all-day")?.checked);
    $("custom-plan-time-label")?.classList.toggle("hidden", isAllDay);
    if (isAllDay && $("custom-plan-time")) $("custom-plan-time").value = "";
  }

  async function handleCustomPlan(event) {
    event.preventDefault();

    const user = app()?.getUser?.();
    const client = app()?.getClient?.();
    if (!user || !client) return;

    const titleInput = $("custom-plan-title");
    const timeInput = $("custom-plan-time");
    const status = $("custom-plan-status");
    const submit = $("custom-plan-submit");

    const title = titleInput?.value?.trim() || "";
    const description = $("custom-plan-description")?.value?.trim() || "";
    const isAllDay = Boolean($("custom-plan-all-day")?.checked);

    if (!title) {
      if (status) status.textContent = "Escribe un título para el plan.";
      titleInput?.focus();
      return;
    }

    if (!isAllDay && !timeInput?.value) {
      if (status) status.textContent = "Elige una hora o marca Todo el día.";
      timeInput?.focus();
      return;
    }

    if (submit) submit.disabled = true;
    if (status) status.textContent = "Guardando en el calendario compartido...";

    const payload = {
      created_by: user.id,
      entry_type: "custom",
      service_id: "custom",
      service_title: title,
      service_icon: "📌",
      category: "Plan libre",
      plan_date: $("custom-plan-date")?.value || "",
      plan_time: isAllDay ? "12:00" : (timeInput?.value || ""),
      is_all_day: isAllDay,
      duration: isAllDay ? "Todo el día" : "Plan libre",
      priority: "Compartido",
      note: description,
      status: "pendiente"
    };

    try {
      const data = await create(client, payload);
      state().proposals.push(data);
      state().proposals.sort(sortByDate);

      selectedDate = data.plan_date;
      const [year, month] = data.plan_date.split("-").map(Number);
      calendarDate = new Date(year, month - 1, 1);

      notifyUI();
      if (status) status.textContent = "Plan guardado.";
      app()?.showToast?.("Plan añadido al calendario.");
      setTimeout(closeCustomPlanModal, 550);
    } catch (error) {
      console.error(error);
      if (status) status.textContent = "No se ha podido guardar el plan.";
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  function renderStats() {
    const proposals = Array.isArray(state().proposals) ? state().proposals : [];
    if ($("total-proposals")) $("total-proposals").textContent = String(proposals.length);

    const now = new Date();
    const future = proposals
      .filter(proposal => !["cancelada", "realizada"].includes(proposal.status) && toDate(proposal) >= now)
      .sort(sortByDate);

    if ($("next-plan")) $("next-plan").textContent = future[0] ? shortDate(future[0].plan_date) : "—";
  }

  function bookingTemplate(proposal) {
    const isCustom = proposal.entry_type === "custom";
    const timeText = proposal.is_all_day ? "Todo el día" : formatTime(proposal.plan_time);

    return `<article class="booking-card">
      <div class="booking-top"><div>
        <div class="booking-title">${proposal.service_icon} ${escapeHtml(proposal.service_title)}</div>
        <p>${formatDate(proposal.plan_date)} · ${timeText}${!isCustom ? ` · ${escapeHtml(proposal.duration)}` : ""}</p>
        ${isCustom ? '<span class="booking-type">Plan compartido</span>' : ""}
      </div>${!isCustom ? `<span class="status status-${proposal.status}">${statusLabel(proposal.status)}</span>` : ""}</div>
      ${!isCustom ? `<p><strong>Nivel:</strong> ${escapeHtml(proposal.priority)}</p>` : ""}
      ${proposal.note ? `<p><strong>${isCustom ? "Descripción:" : "Nota:"}</strong> ${escapeHtml(proposal.note)}</p>` : ""}
      ${bookingActionsTemplate(proposal)}
    </article>`;
  }

  function bookingActionsTemplate(proposal) {
    const actions = [];
    const ownsPlan = proposal.created_by === app()?.getUser?.()?.id;
    const role = app()?.getRole?.();
    const isSharedUser = role === "javi" || role === "laura";
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

    actions.push(`<button class="action-delete" type="button" data-proposal-delete="${proposal.id}">Eliminar</button>`);
    return `<div class="booking-actions">${actions.join("")}</div>`;
  }

  function actionButton(id, status, text, className) {
    return `<button class="${className}" type="button" data-proposal-status="${status}" data-proposal-id="${id}">${text}</button>`;
  }

  function renderBookings() {
    const list = $("booking-list");
    if (!list) return;

    const proposals = [...(state().proposals || [])]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    list.innerHTML = proposals.length
      ? proposals.map(bookingTemplate).join("")
      : '<div class="empty">Todavía no hay planes en el calendario compartido.</div>';
  }

  function renderDayDetail() {
    const title = $("selected-title");
    const holder = $("day-bookings");
    if (!holder) return;

    const proposals = (state().proposals || [])
      .filter(proposal => proposal.plan_date === selectedDate)
      .sort(sortByDate);

    if (title) title.textContent = formatDate(selectedDate);
    holder.innerHTML = proposals.length
      ? proposals.map(bookingTemplate).join("")
      : '<div class="empty">No hay planes para este día.</div>';
  }

  function renderCalendar() {
    const title = $("calendar-title");
    const grid = $("calendar-grid");
    if (!grid) return;

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    if (title) {
      title.textContent = new Intl.DateTimeFormat("es-ES", {
        month: "long",
        year: "numeric"
      }).format(calendarDate);
    }

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = (firstDay.getDay() + 6) % 7;
    const todayKey = toDateKeyMadrid(new Date());

    let html = "";
    for (let i = 0; i < startOffset; i += 1) {
      html += '<button class="day is-empty" type="button"></button>';
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const hasBooking = (state().proposals || [])
        .some(proposal => proposal.plan_date === key && proposal.status !== "cancelada");

      html += `<button class="day ${key === todayKey ? "is-today" : ""} ${key === selectedDate ? "is-selected" : ""} ${hasBooking ? "has-booking" : ""}" type="button" data-date="${key}">${day}</button>`;
    }

    grid.innerHTML = html;
    grid.querySelectorAll("[data-date]").forEach(button => {
      button.addEventListener("click", () => {
        selectedDate = button.dataset.date;
        renderCalendar();
      });
    });

    renderDayDetail();
  }

  function renderRoleControls() {
    $("clear-history")?.classList.toggle("hidden", app()?.getRole?.() !== "javi");
  }

  function renderAll() {
    renderStats();
    renderBookings();
    renderCalendar();
    renderRoleControls();
  }

  async function updateStatus(id, newStatus) {
    const client = app()?.getClient?.();
    if (!client) return;

    try {
      const data = await update(client, id, { status: newStatus });
      state().proposals = (state().proposals || []).map(item => item.id === id ? data : item);
      notifyUI();
      app()?.showToast?.(`Propuesta ${statusLabel(newStatus).toLowerCase()}.`);
    } catch (error) {
      console.error(error);
      app()?.showToast?.("No se ha podido actualizar la propuesta.");
    }
  }

  async function deleteProposal(id) {
    if (!window.confirm("¿Seguro que quieres eliminar este plan del calendario compartido?")) return;

    const client = app()?.getClient?.();
    if (!client) return;

    try {
      await remove(client, id);
      state().proposals = (state().proposals || []).filter(item => item.id !== id);
      notifyUI();
      app()?.showToast?.("Plan eliminado.");
    } catch (error) {
      console.error(error);
      app()?.showToast?.("No se ha podido eliminar el plan.");
    }
  }

  async function clearSharedCalendar() {
    if (app()?.getRole?.() !== "javi") return;
    if (!window.confirm("Esto borrará todos los planes del calendario compartido para los dos. ¿Continuar?")) return;

    const client = app()?.getClient?.();
    if (!client) return;

    try {
      await clear(client);
      state().proposals = [];
      notifyUI();
      app()?.showToast?.("Calendario compartido limpiado.");
    } catch (error) {
      console.error(error);
      app()?.showToast?.("No se ha podido limpiar el calendario.");
    }
  }

  async function handleBookingAction(event) {
    const statusButton = event.target.closest("[data-proposal-status]");
    const deleteButton = event.target.closest("[data-proposal-delete]");
    const editButton = event.target.closest("[data-proposal-edit]");

    if (statusButton) {
      await updateStatus(statusButton.dataset.proposalId, statusButton.dataset.proposalStatus);
      return;
    }
    if (deleteButton) {
      await deleteProposal(deleteButton.dataset.proposalDelete);
      return;
    }
    if (editButton) {
      window.dispatchEvent(new CustomEvent("javieats:edit-plan", {
        detail: { id: editButton.dataset.proposalEdit }
      }));
    }
  }

  function drawRoundedRectangle(context, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    context.beginPath();
    context.moveTo(x + r, y);
    context.arcTo(x + width, y, x + width, y + height, r);
    context.arcTo(x + width, y + height, x, y + height, r);
    context.arcTo(x, y + height, x, y, r);
    context.arcTo(x, y, x + width, y, r);
    context.closePath();
  }

  function wrapCanvasText(context, text, centerX, startY, maxWidth, lineHeight) {
    const words = String(text).split(" ");
    const lines = [];
    let line = "";

    words.forEach(word => {
      const test = line ? `${line} ${word}` : word;
      if (context.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });

    if (line) lines.push(line);
    lines.forEach((lineText, index) => {
      context.fillText(lineText, centerX, startY + index * lineHeight);
    });
  }

  function downloadCanvas(canvas, filename) {
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function downloadTicket(proposal) {
    if (!proposal) return;

    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1500;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "#f4f0ea";
    context.fillRect(0, 0, 1200, 1500);

    context.fillStyle = "#fff";
    drawRoundedRectangle(context, 100, 90, 1000, 1320, 56);
    context.fill();

    context.strokeStyle = "#111";
    context.lineWidth = 8;
    drawRoundedRectangle(context, 100, 90, 1000, 1320, 56);
    context.stroke();

    context.fillStyle = "#111";
    drawRoundedRectangle(context, 160, 150, 880, 140, 50);
    context.fill();

    context.fillStyle = "#fff";
    context.textAlign = "center";
    context.font = "900 58px Arial";
    context.fillText("JaviEats", 600, 238);

    context.fillStyle = "#e85d45";
    context.font = "900 42px Arial";
    context.fillText("PROPUESTA DE PLAN", 600, 390);

    context.fillStyle = "#111";
    context.font = "900 76px Arial";
    wrapCanvasText(context, `${proposal.service_icon} ${proposal.service_title}`, 600, 520, 830, 88);

    context.textAlign = "left";
    context.font = "700 39px Arial";

    [
      `Fecha: ${formatDateCompact(proposal.plan_date)}`,
      `Hora: ${formatTime(proposal.plan_time)}`,
      `Duración: ${proposal.duration}`,
      `Nivel de ganas: ${proposal.priority}`,
      `Estado: ${statusLabel(proposal.status)}`
    ].forEach((line, index) => {
      context.fillText(line, 190, 800 + index * 80);
    });

    if (proposal.note) {
      context.fillStyle = "#6f6a64";
      context.font = "600 34px Arial";
      context.textAlign = "center";
      wrapCanvasText(context, `Nota: ${proposal.note}`, 600, 1220, 800, 48);
    }

    downloadCanvas(canvas, `ticket-javieats-${proposal.plan_date}.png`);
    app()?.showToast?.("Ticket descargado.");
  }

  function bindUI() {
    if (bound) return;
    bound = true;

    document.addEventListener("click", event => {
      const serviceCard = event.target.closest("[data-service]");
      if (serviceCard) {
        openService(serviceCard.dataset.service);
      }
    });

    document.querySelectorAll("[data-service-close]").forEach(element => {
      element.addEventListener("click", closeServiceModal);
    });
    document.querySelectorAll("[data-custom-plan-close]").forEach(element => {
      element.addEventListener("click", closeCustomPlanModal);
    });

    $("proposal-form")?.addEventListener("submit", handleProposal);
    $("download-proposal-ticket")?.addEventListener("click", () => {
      if (lastProposalTicket) downloadTicket(lastProposalTicket);
    });

    $("add-custom-plan-btn")?.addEventListener("click", openCustomPlanModal);
    $("custom-plan-all-day")?.addEventListener("change", updateCustomPlanTimeVisibility);
    $("custom-plan-form")?.addEventListener("submit", handleCustomPlan);

    $("prev-month")?.addEventListener("click", () => {
      calendarDate.setMonth(calendarDate.getMonth() - 1);
      renderCalendar();
    });
    $("next-month")?.addEventListener("click", () => {
      calendarDate.setMonth(calendarDate.getMonth() + 1);
      renderCalendar();
    });

    $("clear-history")?.addEventListener("click", clearSharedCalendar);
    $("booking-list")?.addEventListener("click", handleBookingAction);
    $("day-bookings")?.addEventListener("click", handleBookingAction);

    setMinDate();
  }

  function reset() {
    calendarDate = new Date();
    selectedDate = toDateKeyMadrid(new Date());
    lastProposalTicket = null;
    closeServiceModal();
    closeCustomPlanModal();
  }

  window.JaviEatsPlans = Object.freeze({
    services,
    getService,
    fetchAll,
    create,
    update,
    remove,
    clear,
    bindUI,
    reset,
    renderServices,
    renderStats,
    renderBookings,
    renderCalendar,
    renderAll,
    renderRoleControls,
    openService,
    updateStatus,
    deleteProposal,
    clearSharedCalendar,
    setMinDate,
    statusLabel,
    sortByDate,
    toDate
  });
})();