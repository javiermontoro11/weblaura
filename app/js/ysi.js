(() => {
  "use strict";

  const REVEAL_MS = 900;

  let selectedOption = null;
  let selectedDayId = null;
  let historyFilter = "all";
  let revealTimer = null;
  let revealInProgress = false;
  let bound = false;

  const $ = id => document.getElementById(id);
  const app = () => window.JaviEatsApp;
  const state = () => app()?.getState?.() || {};

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

  function formatDateCompact(dateKey) {
    const [year, month, day] = String(dateKey || "").split("-").map(Number);
    if (!year || !month || !day) return String(dateKey || "");
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }).format(new Date(year, month - 1, day));
  }

  async function fetchCurrent(client) {
    if (!client) throw new Error("Supabase client unavailable");
    const { data, error } = await client.rpc("obtener_y_si_actual");
    if (error) throw error;
    return data || null;
  }

  async function fetchHistory(client) {
    if (!client) throw new Error("Supabase client unavailable");
    const { data, error } = await client.rpc("obtener_y_si_historial");
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  }

  function optionLabel(current, optionNumber) {
    const options = Array.isArray(current?.opciones) ? current.opciones : [];
    const index = Number(optionNumber) - 1;
    return index >= 0 && index < options.length ? String(options[index]) : "—";
  }

  function stats(history = state().ySiHistory) {
    const items = Array.isArray(history) ? [...history] : [];
    items.sort((a, b) => {
      const aKey = String(a.cerrada_at || `${a.fecha}T00:00:00`);
      const bKey = String(b.cerrada_at || `${b.fecha}T00:00:00`);
      return aKey.localeCompare(bKey);
    });

    const total = items.length;
    const matches = items.filter(item => Boolean(item.coincide)).length;
    const compatibility = total ? Math.round((matches / total) * 100) : 0;

    let streak = 0;
    let bestStreak = 0;
    for (const item of items) {
      if (item.coincide) {
        streak += 1;
        bestStreak = Math.max(bestStreak, streak);
      } else {
        streak = 0;
      }
    }

    return { total, matches, compatibility, bestStreak };
  }

  function latestResult(history = state().ySiHistory) {
    const today = toDateKeyMadrid(new Date());
    return (Array.isArray(history) ? history : [])
      .find(item => item?.fecha === today) || null;
  }

  function updateCompatibility() {
    const values = stats();
    const percent = Math.min(100, Math.max(0, values.compatibility));

    if ($("y-si-compatibility")) $("y-si-compatibility").textContent = `${percent}%`;
    if ($("y-si-shared-count")) $("y-si-shared-count").textContent = String(values.total);
    if ($("y-si-match-count")) $("y-si-match-count").textContent = String(values.matches);
    if ($("y-si-best-streak")) $("y-si-best-streak").textContent = String(values.bestStreak);

    const heart = $("y-si-heart-fill");
    if (heart) {
      const heartHeight = 92 * (percent / 100);
      heart.setAttribute("y", String(92 - heartHeight));
      heart.setAttribute("height", String(heartHeight));
    }

    const title = $("y-si-compatibility-title");
    const text = $("y-si-compatibility-text");
    if (!title || !text) return;

    if (!values.total) {
      title.textContent = "Aún está por descubrir";
      text.textContent = "Responded vuestra primera pregunta para empezar a llenar el corazón.";
    } else if (percent >= 80) {
      title.textContent = "Muchas coincidencias";
      text.textContent = `Coincidís en ${values.matches} de ${values.total} preguntas compartidas.`;
    } else if (percent >= 60) {
      title.textContent = "Bastantes puntos en común";
      text.textContent = `Coincidís en ${values.matches} de ${values.total} preguntas compartidas.`;
    } else if (percent >= 40) {
      title.textContent = "Una mezcla interesante";
      text.textContent = `Coincidís en ${values.matches} de ${values.total} preguntas compartidas.`;
    } else {
      title.textContent = "Muchas respuestas distintas";
      text.textContent = `Coincidís en ${values.matches} de ${values.total} preguntas compartidas.`;
    }
  }

  function renderDailySummary(current) {
    const completed = Math.min(5, Math.max(0, Number(current?.completadas_hoy) || 0));
    const matches = Math.min(completed, Math.max(0, Number(current?.coincidencias_hoy) || 0));

    if ($("y-si-today-title")) $("y-si-today-title").textContent = `${completed} de 5 completadas`;
    if ($("y-si-today-text")) {
      $("y-si-today-text").textContent = completed
        ? `${matches} ${matches === 1 ? "coincidencia" : "coincidencias"} hoy · cada resultado cuenta para vuestra compatibilidad.`
        : "Podéis completar hasta cinco situaciones juntos hoy.";
    }

    const dots = $("y-si-daily-dots");
    if (dots) {
      dots.innerHTML = Array.from({ length: 5 }, (_, index) => {
        const done = index < completed;
        return `<span class="y-si-daily-dot${done ? " is-done" : ""}" aria-hidden="true">${done ? "♥" : ""}</span>`;
      }).join("");
    }
  }

  function renderOptions(current) {
    const holder = $("y-si-options");
    const submit = $("y-si-submit");
    const skip = $("y-si-skip");
    if (!holder || !submit || !skip) return;

    if (!current || current.limite_alcanzado || !Array.isArray(current.opciones)) {
      holder.innerHTML = "";
      submit.classList.add("hidden");
      skip.classList.add("hidden");
      return;
    }

    const ownAnswer = Number(current.mi_respuesta) || null;
    const locked = Boolean(ownAnswer || current.ambos_respondieron);

    holder.innerHTML = current.opciones.map((option, index) => {
      const number = index + 1;
      const selected = number === (ownAnswer || selectedOption);
      return `<button class="y-si-option${selected ? " is-selected" : ""}" type="button" role="radio" aria-checked="${selected ? "true" : "false"}" data-y-si-option="${number}" ${locked ? "disabled" : ""}><span class="y-si-option-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHtml(String(option))}</span></button>`;
    }).join("");

    submit.disabled = locked || !selectedOption;
    submit.classList.toggle("hidden", locked);
    skip.classList.toggle("hidden", locked || !current.salto_disponible);
    skip.disabled = !current.salto_disponible;
  }

  function renderResult() {
    const result = state().ySiLastResult;
    const holder = $("y-si-result");
    if (!holder) return;

    const loading = $("y-si-result-loading");
    const content = $("y-si-result-content");

    if (!result?.id) {
      holder.classList.add("hidden");
      loading?.classList.add("hidden");
      content?.classList.remove("hidden");
      return;
    }

    const match = Boolean(result.coincide);
    holder.classList.remove("hidden");

    if ($("y-si-result-meta")) {
      $("y-si-result-meta").textContent = `Último resultado · pregunta ${Number(result.posicion_dia) || "—"} de 5`;
    }
    if ($("y-si-result-icon")) $("y-si-result-icon").textContent = match ? "💞" : "👀";
    if ($("y-si-result-title")) $("y-si-result-title").textContent = match ? "¡Coincidencia!" : "Esta vez pensáis diferente";
    if ($("y-si-result-copy")) {
      $("y-si-result-copy").textContent = match
        ? "Habéis elegido exactamente la misma opción."
        : "Dos respuestas distintas para la misma situación.";
    }
    if ($("y-si-javi-answer")) $("y-si-javi-answer").textContent = optionLabel(result, result.javi_respuesta);
    if ($("y-si-laura-answer")) $("y-si-laura-answer").textContent = optionLabel(result, result.laura_respuesta);
    $("y-si-special")?.classList.toggle("hidden", !(match && result.destacada));

    if (revealInProgress) {
      loading?.classList.remove("hidden");
      content?.classList.add("hidden");
    } else {
      loading?.classList.add("hidden");
      content?.classList.remove("hidden");
    }
  }

  function render() {
    updateCompatibility();

    const current = state().ySiCurrent;
    const questionDate = $("y-si-question-date");
    const questionText = $("y-si-question-text");
    const badge = $("y-si-status-badge");
    const note = $("y-si-status-note");
    const options = $("y-si-options");
    const submit = $("y-si-submit");
    const skip = $("y-si-skip");
    const result = $("y-si-result");

    if (!current) {
      if (questionDate) questionDate.textContent = "¿Y si…?";
      if (options) options.innerHTML = "";
      submit?.classList.add("hidden");
      skip?.classList.add("hidden");
      result?.classList.add("hidden");
      renderDailySummary(null);

      if (state().ySiLoadError) {
        if (badge) badge.textContent = "No disponible";
        if (questionText) questionText.textContent = "No se ha podido cargar la pregunta compartida.";
        if (note) note.textContent = "No se ha podido cargar ¿Y si…?.";
      } else {
        if (badge) badge.textContent = "Preparando…";
        if (questionText) questionText.textContent = "Cargando pregunta…";
        if (note) note.textContent = "";
      }

      renderHistory();
      return;
    }

    renderDailySummary(current);
    renderResult();

    if (current.limite_alcanzado) {
      selectedDayId = null;
      selectedOption = null;
      if (badge) badge.textContent = "5/5 completadas";
      if (questionDate) questionDate.textContent = "Ronda de hoy terminada";
      if (questionText) questionText.textContent = "Ya habéis completado las cinco preguntas de hoy ❤️";
      if (note) {
        note.textContent = `Habéis coincidido ${Number(current.coincidencias_hoy) || 0} de 5 veces. Mañana el contador vuelve a 0/5 con una pregunta nueva.`;
      }
      if (options) options.innerHTML = "";
      submit?.classList.add("hidden");
      skip?.classList.add("hidden");
      renderHistory();
      return;
    }

    if (selectedDayId !== current.id) {
      selectedDayId = current.id;
      selectedOption = null;
    }

    const position = Number(current.posicion_dia)
      || Math.min(5, (Number(current.completadas_hoy) || 0) + 1);

    if (questionDate) questionDate.textContent = `Pregunta ${position} de 5 de hoy · ${current.categoria || "General"}`;
    if (questionText) questionText.textContent = current.pregunta;

    const iAmJavi = app()?.getRole?.() === "javi";
    const otherName = iAmJavi ? "Laura" : "Javi";
    const otherAnswered = iAmJavi ? current.laura_ha_respondido : current.javi_ha_respondido;

    if (current.mi_respuesta) {
      if (badge) badge.textContent = `Esperando a ${otherName}`;
      if (note) note.textContent = `Tu respuesta está guardada. JaviEats avisará a ${otherName} cuando le toque.`;
    } else if (otherAnswered) {
      if (badge) badge.textContent = "Te toca";
      if (note) note.textContent = `${otherName} ya ha respondido. Su elección permanece oculta hasta que tú contestes.`;
    } else {
      if (badge) badge.textContent = "Nueva pregunta";
      if (note) {
        note.textContent = current.salto_disponible
          ? "Elige una opción. También tenéis un cambio de pregunta disponible hoy."
          : "Elige una opción. Tu respuesta no se enseñará hasta que ambos hayáis contestado.";
      }
    }

    renderOptions(current);
    renderHistory();
  }

  function friendlyError(error) {
    const message = String(error?.message || "").toLowerCase();
    if (message.includes("ya has respondido")) return "Ya has respondido esta pregunta.";
    if (message.includes("5 preguntas")) return "Ya habéis completado las cinco preguntas de hoy.";
    if (message.includes("cambiar") || message.includes("salto")) return "El cambio de pregunta de hoy ya no está disponible.";
    if (message.includes("no esta disponible") || message.includes("no está disponible")) return "Esta pregunta ya ha caducado. Cargando una nueva…";
    if (message.includes("opcion") || message.includes("opción")) return "Esa opción no es válida.";
    if (message.includes("acceso")) return "Esta cuenta no puede participar en ¿Y si…?.";
    return "No se ha podido guardar la respuesta. Revisa la conexión.";
  }

  function handleOptionClick(event) {
    const button = event.target.closest("[data-y-si-option]");
    if (!button || button.disabled || state().ySiCurrent?.mi_respuesta) return;
    selectedOption = Number(button.dataset.ySiOption);
    renderOptions(state().ySiCurrent);
  }

  async function answer() {
    const current = state().ySiCurrent;
    const user = app()?.getUser?.();
    const client = app()?.getClient?.();

    if (!user || !client || !current || current.limite_alcanzado || !selectedOption || current.mi_respuesta) return;

    const submit = $("y-si-submit");
    const skip = $("y-si-skip");
    const note = $("y-si-status-note");
    if (submit) submit.disabled = true;
    if (skip) skip.disabled = true;
    if (note) note.textContent = "Guardando tu respuesta…";

    try {
      const { data, error } = await client.rpc("responder_y_si", { p_opcion: selectedOption });
      if (error) throw error;

      state().ySiCurrent = data?.actual || current;
      if (data?.resultado?.id) state().ySiLastResult = data.resultado;

      state().ySiHistory = await fetchHistory(client);
      if (!data?.resultado?.id) state().ySiLastResult = latestResult(state().ySiHistory);

      selectedOption = null;
      render();
      app()?.showToast?.(
        data?.resultado?.id
          ? "¡Los dos habéis respondido! Ya tenéis otra pregunta."
          : "Respuesta guardada. Ahora le toca a la otra persona."
      );

      if (data?.resultado?.id) maybeReveal({ force: true });
      app()?.refreshUI?.();
    } catch (error) {
      console.error(error);
      if (note) note.textContent = friendlyError(error);
      if (submit) submit.disabled = false;
      if (skip) skip.disabled = false;
    }
  }

  async function skip() {
    const current = state().ySiCurrent;
    const client = app()?.getClient?.();
    if (!client || !current?.id || !current.salto_disponible) return;

    const skipButton = $("y-si-skip");
    const submit = $("y-si-submit");
    const note = $("y-si-status-note");

    if (skipButton) skipButton.disabled = true;
    if (submit) submit.disabled = true;
    if (note) note.textContent = "Buscando otra pregunta…";

    try {
      const { data, error } = await client.rpc("saltar_y_si_actual");
      if (error) throw error;

      state().ySiCurrent = data;
      selectedOption = null;
      selectedDayId = data?.id || null;
      render();
      app()?.showToast?.("Pregunta cambiada. Este era el cambio disponible de hoy.");
      app()?.refreshUI?.();
    } catch (error) {
      console.error(error);
      if (note) note.textContent = friendlyError(error);
      renderOptions(state().ySiCurrent);
    }
  }

  function maybeReveal({ force = false } = {}) {
    const result = state().ySiLastResult;
    if (!result?.id) return;

    const key = `javieats_y_si_revealed_${result.id}`;
    if (!force && sessionStorage.getItem(key) === "true") return;

    if (revealTimer) clearTimeout(revealTimer);
    revealInProgress = true;
    renderResult();

    revealTimer = setTimeout(() => {
      revealInProgress = false;

      const loading = $("y-si-result-loading");
      const content = $("y-si-result-content");
      loading?.classList.add("hidden");
      content?.classList.remove("hidden");
      content?.classList.remove("is-revealed");

      if (content) {
        void content.offsetWidth;
        content.classList.add("is-revealed");
      }

      sessionStorage.setItem(key, "true");
      revealTimer = null;
    }, REVEAL_MS);
  }

  function openHistory() {
    renderHistory();
    $("y-si-history-modal")?.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeHistory() {
    $("y-si-history-modal")?.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function setHistoryFilter(filter) {
    historyFilter = ["all", "match", "different"].includes(filter) ? filter : "all";

    document.querySelectorAll("[data-y-si-filter]").forEach(button => {
      button.classList.toggle("is-active", button.dataset.ySiFilter === historyFilter);
    });

    renderHistory();
  }

  function renderHistory() {
    const list = $("y-si-history-list");
    const summary = $("y-si-history-summary");
    if (!list || !summary) return;

    const history = Array.isArray(state().ySiHistory) ? state().ySiHistory : [];
    const values = stats(history);

    summary.textContent = values.total
      ? `${values.matches} coincidencias en ${values.total} preguntas compartidas · ${values.compatibility}% de compatibilidad JaviEats.`
      : "Aquí aparecerán las preguntas que ya habéis respondido los dos.";

    const filtered = history.filter(item => {
      if (historyFilter === "match") return Boolean(item.coincide);
      if (historyFilter === "different") return !item.coincide;
      return true;
    });

    if (!filtered.length) {
      list.innerHTML = `<div class="empty">${history.length ? "No hay resultados con este filtro." : "Todavía no habéis completado ninguna pregunta entre los dos."}</div>`;
      return;
    }

    list.innerHTML = filtered.map(item => {
      const javi = optionLabel(item, item.javi_respuesta);
      const laura = optionLabel(item, item.laura_respuesta);
      const position = Number(item.posicion_dia) || 1;

      return `<article class="y-si-history-item ${item.coincide ? "is-match" : "is-different"}">
        <div class="y-si-history-item-top"><span>${item.coincide ? "💞 Coincidencia" : "👀 Diferentes"}</span><time>${escapeHtml(formatDateCompact(item.fecha))} · ${position}/5</time></div>
        <h3>${escapeHtml(item.pregunta)}</h3>
        <div class="y-si-history-answers"><span><b>Javi</b>${escapeHtml(javi)}</span><span><b>Laura</b>${escapeHtml(laura)}</span></div>
        ${item.coincide && item.destacada ? '<p class="y-si-history-special">Coincidencia destacada 👀</p>' : ""}
      </article>`;
    }).join("");
  }

  function bindUI() {
    if (bound) return;
    bound = true;

    $("y-si-options")?.addEventListener("click", handleOptionClick);
    $("y-si-submit")?.addEventListener("click", answer);
    $("y-si-skip")?.addEventListener("click", skip);
    $("y-si-history-btn")?.addEventListener("click", openHistory);

    document.querySelectorAll("[data-y-si-history-close]").forEach(element => {
      element.addEventListener("click", closeHistory);
    });

    document.querySelectorAll("[data-y-si-filter]").forEach(button => {
      button.addEventListener("click", () => setHistoryFilter(button.dataset.ySiFilter));
    });
  }

  function reset() {
    selectedOption = null;
    selectedDayId = null;
    historyFilter = "all";
    revealInProgress = false;

    if (revealTimer) clearTimeout(revealTimer);
    revealTimer = null;

    closeHistory();
  }

  window.JaviEatsYSi = Object.freeze({
    fetchCurrent,
    fetchHistory,
    stats,
    latestResult,
    render,
    maybeReveal,
    bindUI,
    reset,
    openHistory,
    closeHistory
  });
})();