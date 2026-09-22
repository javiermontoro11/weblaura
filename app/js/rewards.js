(() => {
  "use strict";

  const REGULAR_GAME_ROUNDS = 5;
  const PUZZLE_TOTAL_PIECES = 6;
  const CHOICES = Object.freeze({
    piedra: Object.freeze({ label: "Piedra", emoji: "✊" }),
    papel: Object.freeze({ label: "Papel", emoji: "✋" }),
    tijera: Object.freeze({ label: "Tijera", emoji: "✌️" })
  });

  const $ = id => document.getElementById(id);
  const app = () => window.JaviEatsApp;
  const role = () => app()?.getRole?.() || "unknown";
  const user = () => app()?.getUser?.() || null;
  const client = () => app()?.getClient?.() || null;
  const shared = () => app()?.getState?.() || {};

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
  const voucherList = $("voucher-list");

  let dailyGame = null;
  let dailyRounds = [];
  let roundLocked = false;
  let puzzleWelcomeShown = false;
  let recentPuzzlePieceNumber = null;
  let puzzlePieceAnimationTimer = null;
  let clockTimer = null;
  let bound = false;

  function escapeHTML(text) {
    return String(text ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function toDateKeyMadrid(date) {
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

  function dateFromTimestamp(timestamp) {
    return toDateKeyMadrid(new Date(timestamp));
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

  function timeUntilTomorrow() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setHours(24, 0, 0, 0);
    const diff = Math.max(0, tomorrow - now);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${String(hours).padStart(2, "0")} h · ${String(minutes).padStart(2, "0")} min · ${String(seconds).padStart(2, "0")} s`;
  }

  function friendlyGameError(error) {
    const message = String(error?.message || "");
    if (message.includes("intento de hoy")) return "Laura ya ha utilizado su intento de hoy.";
    if (message.includes("solamente puede jugarlo Laura")) return "Este reto solamente puede jugarlo Laura.";
    return "No se ha podido guardar la jugada. Revisa la conexión.";
  }

  function voucherCode(voucher) {
    return `JE-${dateFromTimestamp(voucher.created_at).replaceAll("-", "")}-${voucher.id.slice(0, 6).toUpperCase()}`;
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

  async function fetchVouchers(clientArg) {
    if (!clientArg) throw new Error("Supabase client unavailable");
    const { data, error } = await clientArg
      .from("vales")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async function fetchPuzzleProgress(clientArg, beneficiaryId) {
    if (!clientArg || !beneficiaryId) throw new Error("Puzzle fetch unavailable");

    const { data: puzzle, error } = await clientArg
      .from("puzzles_premio")
      .select("*")
      .eq("beneficiaria_id", beneficiaryId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    if (!puzzle) return { puzzle: null, pieces: [] };

    const { data: pieces, error: piecesError } = await clientArg
      .from("piezas_puzzle")
      .select("*")
      .eq("puzzle_id", puzzle.id)
      .order("numero_pieza", { ascending: true });
    if (piecesError) throw piecesError;

    return { puzzle, pieces: pieces || [] };
  }

  async function fetchTodayGame(clientArg, dateKey) {
    if (!clientArg) throw new Error("Supabase client unavailable");

    const { data: game, error } = await clientArg
      .from("retos_diarios")
      .select("*")
      .eq("fecha", dateKey)
      .maybeSingle();
    if (error) throw error;
    if (!game) return { game: null, rounds: [] };

    const { data: rounds, error: roundsError } = await clientArg
      .from("rondas_reto")
      .select("*")
      .eq("reto_id", game.id)
      .order("numero", { ascending: true });
    if (roundsError) throw roundsError;

    return { game, rounds: rounds || [] };
  }

  function applyGameSync(value) {
    dailyGame = value?.game || null;
    dailyRounds = Array.isArray(value?.rounds) ? value.rounds : [];
  }

async function openGameModal() {
  if (role() === "laura") {
    try {
      gameHomeButton.disabled = true;
      gameHomeStatus.textContent = "Preparando la partida...";
      const { data, error } = await client().rpc("iniciar_reto_diario");
      if (error) throw error;
      dailyGame = data?.reto || null;
      if (dailyGame) {
        const gameData = await fetchTodayGame(dailyGame.fecha);
        dailyGame = gameData.game;
        dailyRounds = gameData.rounds;
      }
    } catch (error) {
      console.error(error);
      app()?.showToast?.(friendlyGameError(error));
      updateDailyGameCard();
      return;
    } finally {
      gameHomeButton.disabled = false;
    }
  }

  if (!dailyGame && role() === "javi") {
    app()?.showToast?.("Laura todavía no ha empezado el reto de hoy.");
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
  if (role() !== "laura" || !dailyGame || dailyGame.estado === "finalizado" || roundLocked) return;

  roundLocked = true;
  setChoiceButtonsDisabled(true);
  playerChoiceVisual.textContent = CHOICES[choice].emoji;
  playerChoiceLabel.textContent = CHOICES[choice].label;
  machineChoiceVisual.textContent = "❔";
  machineChoiceLabel.textContent = "Eligiendo...";
  machineChoiceVisual.classList.add("thinking");
  gameRoundResult.textContent = "La máquina está eligiendo desde Supabase...";

  try {
    const { data, error } = await client().rpc("jugar_ronda_reto", { p_eleccion: choice });
    if (error) throw error;

    dailyGame = data?.reto || dailyGame;
    if (data?.ronda && !dailyRounds.some(round => round.id === data.ronda.id)) {
      dailyRounds.push(data.ronda);
    }

    if (data?.puzzle) {
      if (shared().puzzle?.id !== data.puzzle.id) shared().puzzlePieces = [];
      shared().puzzle = data.puzzle;
    }

    if (data?.pieza) {
      shared().puzzlePieces = [
        ...shared().puzzlePieces.filter(item => item.id !== data.pieza.id),
        data.pieza
      ].sort((a, b) => a.numero_pieza - b.numero_pieza);
      animatePuzzlePiece(data.pieza.numero_pieza);
    }

    if (data?.vale) {
      shared().vouchers = [
        data.vale,
        ...shared().vouchers.filter(item => item.id !== data.vale.id)
      ];
    }

    renderGameModal();
    renderVouchers();
    renderPuzzleProgress();
    updateDailyGameCard();

    if (data?.pieza && data?.vale) {
      app()?.showToast?.("¡Puzle completado! Has desbloqueado el masaje de 30 minutos.");
    } else if (data?.pieza) {
      app()?.showToast?.(`¡Nueva pieza! Ya tienes ${getPuzzlePieceCount()} de ${PUZZLE_TOTAL_PIECES}.`);
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
  const canPlay = role() === "laura" && !finished;
  gameChoices.classList.toggle("hidden", !canPlay);
  gameFinal.classList.toggle("hidden", !finished);

  if (!finished) {
    gameDailyNote.textContent = dailyGame.en_desempate
      ? "Muerte súbita: el primer resultado que no sea empate decide la partida."
      : dailyGame.rondas_totales > 0
        ? "La partida está guardada en Supabase y puedes continuarla desde otro dispositivo."
        : "El intento de hoy queda asociado a la cuenta de Laura.";
    setChoiceButtonsDisabled(roundLocked || role() !== "laura");
    return;
  }

  setChoiceButtonsDisabled(true);

  if (dailyGame.resultado === "ganada") {
    const piece = getPuzzlePieceForCurrentGame();
    const voucher = getVoucherForCurrentGame();
    const completedNow = Boolean(piece && voucher && shared().puzzle?.estado === "completado");

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
      redeemVoucherBtn.classList.toggle("hidden", role() !== "laura");
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
    gameDailyNote.textContent = shared().puzzle?.estado === "completado"
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
    gameRoundResult.textContent = role() === "laura"
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
  if (!user()) {
    gameHomeStatus.textContent = "Inicia sesión para ver el reto diario.";
    gameHomeButton.disabled = true;
    return;
  }

  if (!dailyGame) {
    if (role() === "laura") {
      gameHomeStatus.textContent = shared().puzzle?.estado === "completado"
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
    gameHomeButton.textContent = role() === "laura" ? "Continuar partida" : "Ver partida";
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
    gameHomeStatus.textContent = shared().puzzle?.estado === "completado"
      ? `Intento agotado · el puzle completado sigue guardado · nuevo reto en ${timeUntilTomorrow()}`
      : `Intento agotado · conservas ${getPuzzlePieceCount()} de ${PUZZLE_TOTAL_PIECES} piezas · nuevo reto en ${timeUntilTomorrow()}`;
    gameHomeButton.textContent = "Ver resultado";
  }

  updatePuzzleModalContent();
}

function getPuzzlePieceCount() {
  const storedCount = Number(shared().puzzle?.piezas_conseguidas);
  if (Number.isFinite(storedCount)) return Math.min(PUZZLE_TOTAL_PIECES, Math.max(0, storedCount));
  return Math.min(PUZZLE_TOTAL_PIECES, shared().puzzlePieces.length);
}

function puzzleCountLabel() {
  return `${getPuzzlePieceCount()} de ${PUZZLE_TOTAL_PIECES} piezas`;
}

function getPuzzlePieceForCurrentGame() {
  if (!dailyGame) return null;
  return shared().puzzlePieces.find(piece => piece.reto_id === dailyGame.id) || null;
}

function renderPuzzleGrid(container, { highlightPiece = null } = {}) {
  if (!container) return;
  const unlocked = new Set(shared().puzzlePieces.map(piece => Number(piece.numero_pieza)));
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
    if (shared().puzzleLoadError) {
      homePuzzleText.textContent = "No se ha podido cargar el progreso del puzle.";
    } else if (shared().puzzle?.estado === "completado") {
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
  const completed = shared().puzzle?.estado === "completado";

  renderPuzzleGrid(puzzleModalGrid);
  puzzleModalCount.textContent = puzzleCountLabel();
  puzzleModalReward.textContent = completed
    ? "Premio desbloqueado: masaje de 30 minutos"
    : "Premio: masaje de 30 minutos";

  if (shared().puzzleLoadError) {
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

  if (role() === "laura") {
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
  if (role() !== "laura" || puzzleWelcomeShown || !user() || shared().puzzleLoadError) return;
  puzzleWelcomeShown = true;
  setTimeout(() => {
    if (user() && role() === "laura" && puzzleModal.classList.contains("hidden")) {
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

function getVoucherForCurrentGame() { return dailyGame ? shared().vouchers.find(v => v.reto_id === dailyGame.id) || null : null; }
function renderVouchers() {
  if (!shared().vouchers.length) { voucherList.innerHTML = `<div class="empty">Todavía no hay vales ganados. Completa las 6 piezas del puzle del masaje para conseguir el primero.</div>`; return; }
  voucherList.innerHTML = shared().vouchers.map(voucher => {
    const active = voucher.estado === "activo";
    const second = active ? (role() === "javi" ? `<button class="btn btn-secondary" type="button" data-voucher-use="${voucher.id}">Marcar canjeado</button>` : `<button class="btn btn-secondary" type="button" data-voucher-redeem="${voucher.id}">Proponer canje</button>`) : "";
    return `<article class="voucher-card"><div class="voucher-mark">JaviEats</div><p class="eyebrow">Premio conseguido · ${shortDate(dateFromTimestamp(voucher.created_at))}</p><h3>${escapeHTML(voucher.titulo)}</h3><p>${escapeHTML(voucher.descripcion)}</p><span class="voucher-state ${active ? "" : "is-used"}">${active ? "Vale activo" : "Vale canjeado"}</span><br><span class="voucher-code">${voucherCode(voucher)}</span><div class="voucher-buttons"><button class="btn btn-primary" type="button" data-voucher-download="${voucher.id}">Descargar vale</button>${second}</div></article>`;
  }).join("");
}
async function handleVoucherAction(event) {
  const downloadButton = event.target.closest("[data-voucher-download]");
  const redeemButton = event.target.closest("[data-voucher-redeem]");
  const useButton = event.target.closest("[data-voucher-use]");
  if (downloadButton) { const v = shared().vouchers.find(i => i.id === downloadButton.dataset.voucherDownload); if (v) downloadVoucher(v); }
  if (redeemButton) { const v = shared().vouchers.find(i => i.id === redeemButton.dataset.voucherRedeem); if (v) proposeVoucherRedemption(v); }
  if (useButton) await markVoucherAsUsed(useButton.dataset.voucherUse);
}
function proposeVoucherRedemption(voucher) {
  if (role() !== "laura") return;
  closeGameModal(); app()?.showPage?.("services");
  window.JaviEatsPlans?.openService?.("masaje", { duration: "30 minutos", note: `Canje del vale ${voucherCode(voucher)} ganado en JaviEats.` });
}
async function markVoucherAsUsed(id) {
  if (role() !== "javi" || !confirm("¿Marcar este vale como canjeado?")) return;
  try {
    const { data, error } = await client().rpc("canjear_vale", { p_vale_id: id });
    if (error) throw error;
    shared().vouchers = shared().vouchers.map(item => item.id === id ? data : item);
    renderVouchers();
    app()?.refreshUI?.();
    app()?.showToast?.("Vale marcado como canjeado.");
  } catch (error) { console.error(error); app()?.showToast?.("No se ha podido canjear el vale."); }
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
  app()?.showToast?.("Vale descargado.");
}


  function startClock() {
    stopClock();
    updateDailyGameCard();
    clockTimer = window.setInterval(() => {
      updateDailyGameCard();
      if (gameModal && !gameModal.classList.contains("hidden")) renderGameModal();
    }, 1000);
  }

  function stopClock() {
    if (clockTimer) window.clearInterval(clockTimer);
    clockTimer = null;
  }

  function bindUI() {
    if (bound) return;
    bound = true;

    document.querySelectorAll("[data-game-close]").forEach(element => {
      element.addEventListener("click", closeGameModal);
    });
    document.querySelectorAll("[data-puzzle-close]").forEach(element => {
      element.addEventListener("click", closePuzzleModal);
    });

    gameHomeButton?.addEventListener("click", openGameModal);
    openPuzzleBtn?.addEventListener("click", openPuzzleModal);
    puzzleModalPrimary?.addEventListener("click", handlePuzzlePrimaryAction);

    document.querySelectorAll("[data-choice]").forEach(button => {
      button.addEventListener("click", () => playGameRound(button.dataset.choice));
    });

    downloadVoucherBtn?.addEventListener("click", () => {
      const voucher = getVoucherForCurrentGame();
      if (voucher) downloadVoucher(voucher);
    });

    redeemVoucherBtn?.addEventListener("click", () => {
      const voucher = getVoucherForCurrentGame();
      if (voucher) proposeVoucherRedemption(voucher);
    });

    voucherList?.addEventListener("click", handleVoucherAction);
  }

  function reset() {
    stopClock();
    dailyGame = null;
    dailyRounds = [];
    roundLocked = false;
    puzzleWelcomeShown = false;
    recentPuzzlePieceNumber = null;

    if (puzzlePieceAnimationTimer) clearTimeout(puzzlePieceAnimationTimer);
    puzzlePieceAnimationTimer = null;

    closeGameModal();
    closePuzzleModal();
  }

  window.JaviEatsRewards = Object.freeze({
    puzzleTotalPieces: PUZZLE_TOTAL_PIECES,
    bindUI,
    reset,
    startClock,
    stopClock,
    fetchVouchers,
    fetchPuzzleProgress,
    fetchTodayGame,
    applyGameSync,
    renderVouchers,
    renderPuzzleProgress,
    updateDailyGameCard,
    renderGameModal,
    openGameModal,
    openPuzzleModal,
    maybeShowPuzzleWelcome,
    getPuzzlePieceCount,
    getVoucherForCurrentGame,
    downloadVoucher,
    proposeVoucherRedemption,
    markVoucherAsUsed
  });
})();