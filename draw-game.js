(() => {
  const sections = Array.isArray(window.DRAW_GAME_SECTIONS) ? window.DRAW_GAME_SECTIONS : [];
  if (!sections.length) return;

  const $ = id => document.getElementById(id);
  const lobby = $("draw-lobby");
  const board = $("draw-board");
  const startBtn = $("draw-start-btn");
  const resetBtn = $("draw-reset-btn");
  const coin = $("draw-coin");
  const turnTitle = $("draw-turn-title");
  const turnCopy = $("draw-turn-copy");
  const scoreJavi = $("draw-score-javi");
  const scoreLaura = $("draw-score-laura");
  const round = $("draw-round");
  const sectionChip = $("draw-section-chip");
  const cardProgress = $("draw-card-progress");
  const guesserName = $("draw-guesser-name");
  const drawerName = $("draw-drawer-name");
  const sectionHits = $("draw-section-hits");
  const secretStage = $("draw-secret-stage");
  const secretWarning = $("draw-secret-warning");
  const secretTitle = $("draw-secret-title");
  const revealBtn = $("draw-reveal-card-btn");
  const cardReveal = $("draw-card-reveal");
  const cardWord = $("draw-card-word");
  const beginBtn = $("draw-begin-card-btn");
  const canvasStage = $("draw-canvas-stage");
  const canvas = $("draw-canvas");
  const timerEl = $("draw-timer");
  const timerBar = $("draw-timer-bar");
  const hitBtn = $("draw-hit-btn");
  const missBtn = $("draw-miss-btn");
  const eraserBtn = $("draw-eraser-btn");
  const clearBtn = $("draw-clear-btn");
  const backBoardBtn = $("draw-back-board-btn");
  const result = $("draw-result");
  const resultIcon = $("draw-result-icon");
  const resultTitle = $("draw-result-title");
  const resultCopy = $("draw-result-copy");
  const nextSectionBtn = $("draw-next-section-btn");
  const final = $("draw-final");
  const finalTitle = $("draw-final-title");
  const finalCopy = $("draw-final-copy");
  const finalBoard = $("draw-final-board");
  const rematchBtn = $("draw-rematch-btn");

  if (!lobby || !board || !canvas) return;

  const ctx = canvas.getContext("2d");
  const PLAYERS = {
    javi: { name: "Javi" },
    laura: { name: "Laura" }
  };
  const CARD_SECONDS = 40;
  const CARDS_PER_SECTION = 3;
  const HITS_TO_WIN = 2;
  const SECTIONS_TO_WIN = 5;
  const HISTORY_KEY = "javieats_draw_recent_v1";

  let timerId = null;
  let drawing = false;
  let brushColor = "#171414";
  let brushWidth = 6;
  let erasing = false;
  let pointerId = null;
  let lastPoint = null;

  const game = {
    started: false,
    flipping: false,
    currentGuesser: null,
    currentSection: null,
    cards: [],
    cardIndex: 0,
    hits: 0,
    claimed: {},
    scores: { javi: 0, laura: 0 },
    finished: false,
    resultWinner: null
  };

  function otherPlayer(player) {
    return player === "javi" ? "laura" : "javi";
  }

  function playerName(player) {
    return PLAYERS[player]?.name || "Jugador";
  }

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function shuffle(items) {
    const output = [...items];
    for (let i = output.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [output[i], output[j]] = [output[j], output[i]];
    }
    return output;
  }

  function getRecentHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }

  function rememberCards(sectionId, cards) {
    try {
      const history = getRecentHistory();
      const previous = Array.isArray(history[sectionId]) ? history[sectionId] : [];
      history[sectionId] = [...previous, ...cards].slice(-24);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // Si el navegador bloquea storage, el juego sigue funcionando normalmente.
    }
  }

  function pickCards(section) {
    const history = getRecentHistory();
    const recent = new Set(Array.isArray(history[section.id]) ? history[section.id] : []);
    let pool = section.cards.filter(card => !recent.has(card));
    if (pool.length < CARDS_PER_SECTION) pool = [...section.cards];
    const picked = shuffle(pool).slice(0, CARDS_PER_SECTION);
    rememberCards(section.id, picked);
    return picked;
  }

  function renderScores() {
    scoreJavi.textContent = String(game.scores.javi);
    scoreLaura.textContent = String(game.scores.laura);
  }

  function renderBoard() {
    board.innerHTML = sections.map(section => {
      const owner = game.claimed[section.id] || "";
      const selectable = game.started && !game.finished && !owner && !game.currentSection;
      const ownerClass = owner ? ` is-${owner}` : "";
      const selectClass = selectable ? " is-selectable" : "";
      const ownerLabel = owner ? `${playerName(owner)} · conquistado` : "";
      return `
        <button class="draw-section-card${ownerClass}${selectClass}" type="button"
          data-draw-section="${section.id}" data-owner-label="${ownerLabel}"
          ${selectable ? "" : "disabled"}>
          <span class="draw-section-emoji">${section.emoji}</span>
          <span><span class="draw-section-title">${section.title}</span><span class="draw-section-subtitle">${section.subtitle}</span></span>
        </button>`;
    }).join("");
  }

  function showLobby() {
    stopTimer();
    lobby.classList.remove("hidden");
    round.classList.add("hidden");
    result.classList.add("hidden");
    final.classList.add("hidden");
    renderScores();
    renderBoard();
  }

  function resetGame() {
    stopTimer();
    Object.assign(game, {
      started: false,
      flipping: false,
      currentGuesser: null,
      currentSection: null,
      cards: [],
      cardIndex: 0,
      hits: 0,
      claimed: {},
      scores: { javi: 0, laura: 0 },
      finished: false,
      resultWinner: null
    });
    coin.classList.remove("is-flipping", "is-javi", "is-laura");
    turnTitle.textContent = "Lanzad la moneda para empezar";
    turnCopy.textContent = "La persona elegida escogerá la primera categoría.";
    startBtn.textContent = "Lanzar moneda";
    startBtn.disabled = false;
    startBtn.classList.remove("hidden");
    resetBtn.classList.add("hidden");
    clearCanvas();
    showLobby();
  }

  function flipCoin() {
    if (game.flipping || game.started) return;
    game.flipping = true;
    startBtn.disabled = true;
    coin.classList.remove("is-javi", "is-laura");
    void coin.offsetWidth;
    coin.classList.add("is-flipping");

    setTimeout(() => {
      const chosen = Math.random() < 0.5 ? "javi" : "laura";
      game.started = true;
      game.flipping = false;
      game.currentGuesser = chosen;
      coin.classList.remove("is-flipping");
      coin.classList.add(chosen === "javi" ? "is-javi" : "is-laura");
      turnTitle.textContent = `${playerName(chosen)} empieza adivinando`;
      turnCopy.textContent = `${playerName(chosen)}, elige el primer territorio del tablero.`;
      startBtn.classList.add("hidden");
      resetBtn.classList.remove("hidden");
      renderBoard();
    }, 1280);
  }

  function startSection(sectionId) {
    if (!game.started || game.finished || game.currentSection || game.claimed[sectionId]) return;
    const section = sections.find(item => item.id === sectionId);
    if (!section) return;

    game.currentSection = section;
    game.cards = pickCards(section);
    game.cardIndex = 0;
    game.hits = 0;
    game.resultWinner = null;

    lobby.classList.add("hidden");
    result.classList.add("hidden");
    final.classList.add("hidden");
    round.classList.remove("hidden");
    prepareSecretStage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prepareSecretStage() {
    stopTimer();
    const drawer = otherPlayer(game.currentGuesser);
    sectionChip.textContent = `${game.currentSection.emoji} ${game.currentSection.title}`;
    cardProgress.textContent = `Carta ${game.cardIndex + 1} de ${CARDS_PER_SECTION}`;
    guesserName.textContent = playerName(game.currentGuesser);
    drawerName.textContent = playerName(drawer);
    sectionHits.textContent = `${game.hits}/${HITS_TO_WIN}`;
    secretWarning.textContent = `${playerName(game.currentGuesser)}, no mires 👀`;
    secretTitle.textContent = `${playerName(drawer)}, mira tu concepto`;
    cardWord.textContent = game.cards[game.cardIndex] || "—";
    cardReveal.classList.add("hidden");
    revealBtn.classList.remove("hidden");
    secretStage.classList.remove("hidden");
    canvasStage.classList.add("hidden");
    clearCanvas();
  }

  function revealCard() {
    revealBtn.classList.add("hidden");
    cardReveal.classList.remove("hidden");
  }

  function beginCard() {
    secretStage.classList.add("hidden");
    canvasStage.classList.remove("hidden");
    clearCanvas();
    startTimer();
  }

  function startTimer() {
    stopTimer();
    let remaining = CARD_SECONDS;
    const row = timerEl.closest(".draw-timer-row");
    timerEl.textContent = String(remaining);
    timerBar.style.width = "100%";
    row?.classList.remove("is-urgent");

    timerId = setInterval(() => {
      remaining -= 1;
      timerEl.textContent = String(Math.max(0, remaining));
      timerBar.style.width = `${Math.max(0, (remaining / CARD_SECONDS) * 100)}%`;
      row?.classList.toggle("is-urgent", remaining <= 10);
      if (remaining <= 0) {
        stopTimer();
        finishCard(false, true);
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
    const row = timerEl?.closest(".draw-timer-row");
    row?.classList.remove("is-urgent");
  }

  function finishCard(hit, timedOut = false) {
    if (!game.currentSection || canvasStage.classList.contains("hidden")) return;
    stopTimer();
    if (hit) game.hits += 1;
    const solvedWord = game.cards[game.cardIndex];
    game.cardIndex += 1;

    if (typeof window.showToast === "function") {
      window.showToast(hit ? `✓ ${solvedWord} · acierto` : `${timedOut ? "⏱ Tiempo" : "✕ Fallo"} · era ${solvedWord}`);
    }

    if (game.cardIndex >= CARDS_PER_SECTION) {
      resolveSection();
      return;
    }

    prepareSecretStage();
  }

  function resolveSection() {
    stopTimer();
    round.classList.add("hidden");
    const guesser = game.currentGuesser;
    const drawer = otherPlayer(guesser);
    const winner = game.hits >= HITS_TO_WIN ? guesser : drawer;
    game.claimed[game.currentSection.id] = winner;
    game.scores[winner] += 1;
    game.resultWinner = winner;
    game.finished = game.scores[winner] >= SECTIONS_TO_WIN;

    resultIcon.textContent = game.finished ? "🏆" : (winner === "javi" ? "⚫" : "❤️");
    resultTitle.textContent = `${playerName(winner)} conquista ${game.currentSection.title}`;
    resultCopy.textContent = game.hits >= HITS_TO_WIN
      ? `${playerName(guesser)} acertó ${game.hits} de ${CARDS_PER_SECTION} y se queda el territorio.`
      : `${playerName(guesser)} acertó ${game.hits} de ${CARDS_PER_SECTION}. ${playerName(drawer)} defiende y conquista el territorio.`;
    nextSectionBtn.textContent = game.finished ? "Ver resultado final" : `${playerName(winner)} elige la siguiente`;
    result.classList.remove("hidden");
    renderScores();
  }

  function continueAfterSection() {
    const winner = game.resultWinner;
    const finished = game.finished;
    game.currentSection = null;
    game.cards = [];
    game.cardIndex = 0;
    game.hits = 0;
    game.currentGuesser = winner;
    game.resultWinner = null;

    if (finished) {
      showFinal();
      return;
    }

    turnTitle.textContent = `${playerName(winner)} elige ahora`;
    turnCopy.textContent = `${playerName(winner)} ganó el último territorio y empieza adivinando en el siguiente.`;
    showLobby();
  }

  function showFinal() {
    lobby.classList.add("hidden");
    round.classList.add("hidden");
    result.classList.add("hidden");
    final.classList.remove("hidden");
    const winner = game.scores.javi > game.scores.laura ? "javi" : "laura";
    finalTitle.textContent = `${playerName(winner)} gana ${game.scores[winner]}–${game.scores[otherPlayer(winner)]}`;
    finalCopy.textContent = `${playerName(winner)} ha conquistado ${game.scores[winner]} territorios y se lleva la partida.`;
    finalBoard.innerHTML = sections
      .filter(section => game.claimed[section.id])
      .map(section => `<span class="draw-final-territory is-${game.claimed[section.id]}">${section.emoji} ${section.title} · ${playerName(game.claimed[section.id])}</span>`)
      .join("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearCanvas() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height
    };
  }

  function startDrawing(event) {
    if (canvasStage.classList.contains("hidden")) return;
    drawing = true;
    pointerId = event.pointerId;
    canvas.setPointerCapture?.(event.pointerId);
    lastPoint = canvasPoint(event);
  }

  function moveDrawing(event) {
    if (!drawing || event.pointerId !== pointerId || !lastPoint) return;
    const point = canvasPoint(event);
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = erasing ? Math.max(28, brushWidth * 2.5) : brushWidth;
    ctx.strokeStyle = erasing ? "#ffffff" : brushColor;
    ctx.stroke();
    lastPoint = point;
  }

  function stopDrawing(event) {
    if (event.pointerId !== pointerId) return;
    drawing = false;
    lastPoint = null;
    pointerId = null;
  }

  function setColor(button) {
    document.querySelectorAll("[data-draw-color]").forEach(item => item.classList.remove("is-active"));
    button.classList.add("is-active");
    brushColor = button.dataset.drawColor || "#171414";
    erasing = false;
    eraserBtn.classList.remove("is-active");
  }

  function setWidth(button) {
    document.querySelectorAll("[data-draw-width]").forEach(item => item.classList.remove("is-active"));
    button.classList.add("is-active");
    brushWidth = Number(button.dataset.drawWidth) || 6;
    erasing = false;
    eraserBtn.classList.remove("is-active");
  }

  board.addEventListener("click", event => {
    const button = event.target.closest("[data-draw-section]");
    if (!button || button.disabled) return;
    startSection(button.dataset.drawSection);
  });
  startBtn.addEventListener("click", flipCoin);
  resetBtn.addEventListener("click", () => {
    if (!game.started || confirm("¿Empezar una partida nueva? Se perderá el marcador actual.")) resetGame();
  });
  rematchBtn.addEventListener("click", resetGame);
  revealBtn.addEventListener("click", revealCard);
  beginBtn.addEventListener("click", beginCard);
  hitBtn.addEventListener("click", () => finishCard(true));
  missBtn.addEventListener("click", () => finishCard(false));
  nextSectionBtn.addEventListener("click", continueAfterSection);
  backBoardBtn.addEventListener("click", () => {
    if (!game.currentSection) return showLobby();
    if (!confirm("¿Abandonar esta categoría? No se asignará a nadie.")) return;
    stopTimer();
    game.currentSection = null;
    game.cards = [];
    game.cardIndex = 0;
    game.hits = 0;
    showLobby();
  });

  document.querySelectorAll("[data-draw-color]").forEach(button => button.addEventListener("click", () => setColor(button)));
  document.querySelectorAll("[data-draw-width]").forEach(button => button.addEventListener("click", () => setWidth(button)));
  eraserBtn.addEventListener("click", () => {
    erasing = !erasing;
    eraserBtn.classList.toggle("is-active", erasing);
  });
  clearBtn.addEventListener("click", clearCanvas);

  canvas.addEventListener("pointerdown", startDrawing);
  canvas.addEventListener("pointermove", moveDrawing);
  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointercancel", stopDrawing);
  canvas.addEventListener("pointerleave", event => {
    if (drawing && event.pointerId === pointerId && event.buttons === 0) stopDrawing(event);
  });

  clearCanvas();
  renderBoard();
  renderScores();
})();
