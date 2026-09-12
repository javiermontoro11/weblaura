/* JaviEats v2.8 · Minijuegos
   Hub + Dibuja revisado + No lo digas competitivo.
   Los juegos presenciales viven en memoria/localStorage y no añaden tablas a Supabase. */
(() => {
  'use strict';

  const DRAW_SECTIONS = Array.isArray(window.JAVIEATS_DRAW_SECTIONS) ? window.JAVIEATS_DRAW_SECTIONS : [];
  const TABOO_SECTIONS = Array.isArray(window.JAVIEATS_TABOO_SECTIONS) ? window.JAVIEATS_TABOO_SECTIONS : [];
  const UNLOCK_AT = new Date('2026-08-30T22:00:00+02:00').getTime();
  const PLAYERS = { javi: 'Javi', laura: 'Laura' };
  const $ = id => document.getElementById(id);
  const other = player => player === 'javi' ? 'laura' : 'javi';
  const playerName = player => PLAYERS[player] || 'Jugador';

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function currentRole() {
    return window.JaviEatsApp?.getRole?.() || 'unknown';
  }

  function isLockedForLaura(gameId) {
    return currentRole() === 'laura' && ['draw', 'taboo'].includes(gameId) && Date.now() < UNLOCK_AT;
  }

  function countdownParts() {
    const diff = Math.max(0, UNLOCK_AT - Date.now());
    const total = Math.floor(diff / 1000);
    return {
      diff,
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60
    };
  }

  function countdownText() {
    const { diff, days, hours, minutes, seconds } = countdownParts();
    if (!diff) return 'Ya disponible';
    return `${String(days).padStart(2, '0')}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  }

  /* ------------------------------------------------------------------
     HUB
     ------------------------------------------------------------------ */
  const hub = $('minigames-hub');
  const panels = [...document.querySelectorAll('[data-minigame-panel]')];
  const launchers = [...document.querySelectorAll('[data-minigame-open]')];

  function refreshAccess() {
    const role = currentRole();
    document.querySelectorAll('[data-minigame-lock]').forEach(card => {
      const gameId = card.dataset.minigameLock;
      const locked = role === 'laura' && Date.now() < UNLOCK_AT;
      card.classList.toggle('is-locked', locked);
      card.setAttribute('aria-disabled', locked ? 'true' : 'false');
      const state = card.querySelector('[data-minigame-lock-state]');
      const counter = card.querySelector('[data-minigame-countdown]');
      if (state) state.textContent = locked ? '🔒 Se desbloquea el 30 de agosto a las 22:00' : 'Disponible';
      if (counter) {
        counter.textContent = locked ? countdownText() : '¡Ya disponible!';
        counter.classList.toggle('hidden', !locked);
      }
      card.classList.toggle('is-unlocked', !locked && Boolean(gameId));
    });
  }

  function showHub() {
    hub?.classList.remove('hidden');
    panels.forEach(panel => panel.classList.add('hidden'));
    refreshAccess();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function open(gameId, { force = false } = {}) {
    if (!force && isLockedForLaura(gameId)) {
      window.JaviEatsApp?.showToast?.(`Se desbloquea en ${countdownText()} 🔒`);
      showHub();
      return false;
    }
    const panel = document.querySelector(`[data-minigame-panel="${gameId}"]`);
    if (!panel) return false;
    hub?.classList.add('hidden');
    panels.forEach(item => item.classList.toggle('hidden', item !== panel));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  }

  launchers.forEach(button => button.addEventListener('click', () => open(button.dataset.minigameOpen)));
  document.querySelectorAll('[data-minigame-back]').forEach(button => button.addEventListener('click', showHub));

  /* ------------------------------------------------------------------
     DIBUJA · dos dibujos equivalentes por territorio
     ------------------------------------------------------------------ */
  const draw = {
    lobby: $('draw-lobby'), board: $('draw-board'), startBtn: $('draw-start-btn'), resetBtn: $('draw-reset-btn'),
    coin: $('draw-coin'), turnTitle: $('draw-turn-title'), turnCopy: $('draw-turn-copy'),
    scoreJavi: $('draw-score-javi'), scoreLaura: $('draw-score-laura'),
    round: $('draw-round'), sectionChip: $('draw-section-chip'), attemptProgress: $('draw-attempt-progress'),
    drawerName: $('draw-drawer-name'), guesserName: $('draw-guesser-name'), duelState: $('draw-duel-state'),
    secretStage: $('draw-secret-stage'), secretWarning: $('draw-secret-warning'), secretTitle: $('draw-secret-title'),
    revealBtn: $('draw-reveal-card-btn'), cardReveal: $('draw-card-reveal'), cardWord: $('draw-card-word'),
    changeBtn: $('draw-change-word-btn'), beginBtn: $('draw-begin-card-btn'),
    canvasStage: $('draw-canvas-stage'), canvas: $('draw-canvas'), timer: $('draw-timer'), timerBar: $('draw-timer-bar'),
    hintBox: $('draw-hint-box'), hintText: $('draw-hint-text'),
    hitBtn: $('draw-hit-btn'), missBtn: $('draw-miss-btn'), eraserBtn: $('draw-eraser-btn'),
    undoBtn: $('draw-undo-btn'), clearBtn: $('draw-clear-btn'),
    result: $('draw-result'), resultIcon: $('draw-result-icon'), resultTitle: $('draw-result-title'), resultCopy: $('draw-result-copy'),
    nextBtn: $('draw-next-section-btn'), final: $('draw-final'), finalTitle: $('draw-final-title'), finalCopy: $('draw-final-copy'),
    finalBoard: $('draw-final-board'), rematchBtn: $('draw-rematch-btn')
  };

  const DRAW_SECONDS = 90;
  const DRAW_HINT_AFTER = 45;
  const DRAW_TO_WIN = 3;
  const DRAW_HISTORY_KEY = 'javieats_draw_recent_v3';

  let drawTimerId = null;
  let drawRemaining = DRAW_SECONDS;
  let drawStartedAt = 0;
  let drawDrawing = false;
  let drawPointerId = null;
  let brushColor = '#171414';
  let brushWidth = 6;
  let erasing = false;
  let drawStrokes = [];
  let currentStroke = null;
  const drawCtx = draw.canvas?.getContext('2d') || null;

  const drawGame = {
    started: false,
    flipping: false,
    chooser: null,
    blockedSectionId: null,
    currentSection: null,
    currentDifficulty: 2,
    firstDrawer: null,
    currentDrawer: null,
    attempts: [],
    currentCard: null,
    currentWords: [],
    changeAvailable: true,
    claimed: {},
    scores: { javi: 0, laura: 0 },
    finished: false
  };

  function drawRecent() {
    try { return JSON.parse(localStorage.getItem(DRAW_HISTORY_KEY) || '{}') || {}; }
    catch { return {}; }
  }

  function rememberDrawWord(sectionId, word) {
    try {
      const recent = drawRecent();
      recent[sectionId] = [...(recent[sectionId] || []), word].slice(-24);
      localStorage.setItem(DRAW_HISTORY_KEY, JSON.stringify(recent));
    } catch { /* El juego sigue aunque localStorage no esté disponible. */ }
  }

  function chooseDrawDifficulty(section) {
    // Un duelo puede llegar a consumir 4 cartas del mismo nivel (dos intentos + un cambio por intento).
    const counts = section.cards.reduce((acc, card) => {
      const level = Number(card.difficulty) || 2;
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
    const available = new Set(Object.entries(counts).filter(([, count]) => count >= 4).map(([level]) => Number(level)));
    const roll = Math.random();
    const wanted = roll < 0.30 ? 1 : (roll < 0.88 ? 2 : 3);
    if (available.has(wanted)) return wanted;
    if (available.has(2)) return 2;
    if (available.has(1)) return 1;
    return [...available][0] || 2;
  }

  function pickDrawCard(section, difficulty, excluded = []) {
    const recent = drawRecent();
    const excludedSet = new Set(excluded);
    const recentSet = new Set(recent[section.id] || []);
    const byDifficulty = section.cards.filter(card => (Number(card.difficulty) || 2) === difficulty && !excludedSet.has(card.word));
    const fallbackDifficulty = section.cards.filter(card => !excludedSet.has(card.word));
    let pool = byDifficulty.length ? byDifficulty : fallbackDifficulty;
    const fresh = pool.filter(card => !recentSet.has(card.word));
    if (fresh.length) pool = fresh;
    const card = shuffle(pool)[0] || section.cards[0] || null;
    if (card) rememberDrawWord(section.id, card.word);
    return card;
  }

  function formatDrawTime(ms) {
    if (!Number.isFinite(ms)) return 'sin acierto';
    return `${(ms / 1000).toFixed(1).replace('.0', '')}s`;
  }

  function renderDrawScores() {
    if (draw.scoreJavi) draw.scoreJavi.textContent = String(drawGame.scores.javi);
    if (draw.scoreLaura) draw.scoreLaura.textContent = String(drawGame.scores.laura);
  }

  function renderDrawBoard() {
    if (!draw.board) return;
    draw.board.innerHTML = DRAW_SECTIONS.map(section => {
      const owner = drawGame.claimed[section.id] || '';
      const temporarilyBlocked = drawGame.blockedSectionId === section.id && !owner;
      const selectable = drawGame.started && !drawGame.finished && !drawGame.currentSection && !owner && !temporarilyBlocked;
      const ownerLabel = owner ? `${playerName(owner)} · conquistado` : '';
      const blockedLabel = temporarilyBlocked ? '<span class="draw-section-wait">Espera 1 turno</span>' : '';
      return `<button class="draw-section-card${owner ? ` is-${owner}` : ''}${selectable ? ' is-selectable' : ''}${temporarilyBlocked ? ' is-waiting' : ''}" type="button" data-draw-section="${section.id}" data-owner-label="${ownerLabel}" ${selectable ? '' : 'disabled'}>
        <span class="draw-section-emoji">${section.emoji}</span>
        <span><span class="draw-section-title">${section.title}</span><span class="draw-section-subtitle">${section.subtitle}</span>${blockedLabel}</span>
      </button>`;
    }).join('');
  }

  function stopDrawTimer() {
    if (drawTimerId) clearInterval(drawTimerId);
    drawTimerId = null;
  }

  function clearDrawCanvas({ resetHistory = true } = {}) {
    if (!drawCtx || !draw.canvas) return;
    drawCtx.save();
    drawCtx.setTransform(1, 0, 0, 1, 0, 0);
    drawCtx.fillStyle = '#ffffff';
    drawCtx.fillRect(0, 0, draw.canvas.width, draw.canvas.height);
    drawCtx.restore();
    if (resetHistory) drawStrokes = [];
  }

  function renderStroke(stroke) {
    if (!drawCtx || !stroke?.points?.length) return;
    drawCtx.save();
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    drawCtx.lineWidth = stroke.erasing ? Math.max(24, stroke.width * 3) : stroke.width;
    drawCtx.strokeStyle = stroke.erasing ? '#ffffff' : stroke.color;
    drawCtx.fillStyle = stroke.erasing ? '#ffffff' : stroke.color;
    if (stroke.points.length === 1) {
      const p = stroke.points[0];
      drawCtx.beginPath();
      drawCtx.arc(p.x, p.y, drawCtx.lineWidth / 2, 0, Math.PI * 2);
      drawCtx.fill();
    } else {
      drawCtx.beginPath();
      drawCtx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i += 1) drawCtx.lineTo(stroke.points[i].x, stroke.points[i].y);
      drawCtx.stroke();
    }
    drawCtx.restore();
  }

  function redrawCanvas() {
    clearDrawCanvas({ resetHistory: false });
    drawStrokes.forEach(renderStroke);
  }

  function updateDrawHint(elapsedSeconds) {
    if (!draw.hintBox || !draw.hintText) return;
    if (elapsedSeconds >= DRAW_HINT_AFTER) {
      draw.hintBox.classList.add('is-revealed');
      draw.hintText.textContent = drawGame.currentCard?.hint || 'Piensa en la forma más reconocible del concepto.';
    } else {
      draw.hintBox.classList.remove('is-revealed');
      draw.hintText.textContent = `Pista en ${Math.max(0, DRAW_HINT_AFTER - elapsedSeconds)} s`;
    }
  }

  function updateDrawTimer() {
    if (!draw.timer || !draw.timerBar) return;
    draw.timer.textContent = String(drawRemaining);
    draw.timerBar.style.width = `${Math.max(0, (drawRemaining / DRAW_SECONDS) * 100)}%`;
    draw.timer.closest('.draw-timer-row')?.classList.toggle('is-urgent', drawRemaining <= 12);
    updateDrawHint(DRAW_SECONDS - drawRemaining);
  }

  function resetDrawGame() {
    stopDrawTimer();
    Object.assign(drawGame, {
      started: false, flipping: false, chooser: null, blockedSectionId: null, currentSection: null,
      currentDifficulty: 2, firstDrawer: null, currentDrawer: null, attempts: [], currentCard: null,
      currentWords: [], changeAvailable: true, claimed: {}, scores: { javi: 0, laura: 0 }, finished: false
    });
    draw.coin?.classList.remove('is-flipping', 'is-javi', 'is-laura');
    if (draw.turnTitle) draw.turnTitle.textContent = 'Lanzad la moneda para empezar';
    if (draw.turnCopy) draw.turnCopy.textContent = 'Decidirá quién elige la primera categoría y hace el primer dibujo.';
    if (draw.startBtn) { draw.startBtn.disabled = false; draw.startBtn.classList.remove('hidden'); }
    draw.resetBtn?.classList.add('hidden');
    draw.round?.classList.add('hidden');
    draw.result?.classList.add('hidden');
    draw.final?.classList.add('hidden');
    draw.lobby?.classList.remove('hidden');
    erasing = false;
    brushColor = '#171414';
    brushWidth = 6;
    document.querySelectorAll('[data-draw-color]').forEach(button => button.classList.toggle('is-active', button.dataset.drawColor === '#171414'));
    document.querySelectorAll('[data-draw-width]').forEach(button => button.classList.toggle('is-active', Number(button.dataset.drawWidth) === 6));
    draw.eraserBtn?.classList.remove('is-active');
    clearDrawCanvas();
    renderDrawScores();
    renderDrawBoard();
  }

  function flipDrawCoin() {
    if (drawGame.flipping || drawGame.started) return;
    drawGame.flipping = true;
    if (draw.startBtn) draw.startBtn.disabled = true;
    draw.coin?.classList.remove('is-javi', 'is-laura');
    void draw.coin?.offsetWidth;
    draw.coin?.classList.add('is-flipping');
    setTimeout(() => {
      const chosen = Math.random() < .5 ? 'javi' : 'laura';
      drawGame.started = true;
      drawGame.flipping = false;
      drawGame.chooser = chosen;
      draw.coin?.classList.remove('is-flipping');
      draw.coin?.classList.add(chosen === 'javi' ? 'is-javi' : 'is-laura');
      if (draw.turnTitle) draw.turnTitle.textContent = `${playerName(chosen)} elige primero`;
      if (draw.turnCopy) draw.turnCopy.textContent = `${playerName(chosen)}, escoge una categoría. Tú harás el primer dibujo del duelo.`;
      draw.startBtn?.classList.add('hidden');
      draw.resetBtn?.classList.remove('hidden');
      renderDrawBoard();
    }, 1200);
  }

  function startDrawSection(sectionId) {
    const section = DRAW_SECTIONS.find(item => item.id === sectionId);
    if (!section || !drawGame.started || drawGame.currentSection || drawGame.claimed[sectionId]) return;
    if (drawGame.blockedSectionId === sectionId) return;
    drawGame.blockedSectionId = null;
    drawGame.currentSection = section;
    drawGame.currentDifficulty = chooseDrawDifficulty(section);
    drawGame.firstDrawer = drawGame.chooser;
    drawGame.currentDrawer = drawGame.firstDrawer;
    drawGame.attempts = [];
    drawGame.currentWords = [];
    drawGame.currentCard = pickDrawCard(section, drawGame.currentDifficulty);
    if (drawGame.currentCard) drawGame.currentWords.push(drawGame.currentCard.word);
    drawGame.changeAvailable = true;
    draw.lobby?.classList.add('hidden');
    draw.result?.classList.add('hidden');
    draw.final?.classList.add('hidden');
    draw.round?.classList.remove('hidden');
    prepareDrawSecret();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function prepareDrawSecret() {
    stopDrawTimer();
    const drawer = drawGame.currentDrawer;
    const guesser = other(drawer);
    const attemptNo = drawGame.attempts.length + 1;
    if (draw.sectionChip) draw.sectionChip.textContent = `${drawGame.currentSection.emoji} ${drawGame.currentSection.title}`;
    if (draw.attemptProgress) draw.attemptProgress.textContent = `Dibujo ${attemptNo} de 2`;
    if (draw.drawerName) draw.drawerName.textContent = playerName(drawer);
    if (draw.guesserName) draw.guesserName.textContent = playerName(guesser);
    if (draw.duelState) {
      const first = drawGame.attempts[0];
      draw.duelState.textContent = first ? `${playerName(first.drawer)}: ${first.success ? formatDrawTime(first.elapsedMs) : 'sin acierto'}` : 'Primer intento';
    }
    if (draw.secretWarning) draw.secretWarning.textContent = `${playerName(guesser)}, no mires 👀`;
    if (draw.secretTitle) draw.secretTitle.textContent = `${playerName(drawer)}, mira lo que tienes que dibujar`;
    if (draw.cardWord) draw.cardWord.textContent = drawGame.currentCard?.word || '—';
    if (draw.changeBtn) {
      draw.changeBtn.disabled = !drawGame.changeAvailable;
      draw.changeBtn.textContent = drawGame.changeAvailable ? '🔄 Cambiar palabra (1)' : '🔄 Cambio usado';
    }
    draw.cardReveal?.classList.add('hidden');
    draw.revealBtn?.classList.remove('hidden');
    draw.secretStage?.classList.remove('hidden');
    draw.canvasStage?.classList.add('hidden');
    drawRemaining = DRAW_SECONDS;
    updateDrawTimer();
    clearDrawCanvas();
  }

  function changeDrawWord() {
    if (!drawGame.changeAvailable || !drawGame.currentSection || draw.secretStage?.classList.contains('hidden')) return;
    const next = pickDrawCard(drawGame.currentSection, drawGame.currentDifficulty, drawGame.currentWords);
    if (!next || next.word === drawGame.currentCard?.word) {
      window.JaviEatsApp?.showToast?.('No hay otra palabra equivalente disponible ahora.');
      return;
    }
    drawGame.currentCard = next;
    drawGame.currentWords.push(next.word);
    drawGame.changeAvailable = false;
    if (draw.cardWord) draw.cardWord.textContent = next.word;
    if (draw.changeBtn) {
      draw.changeBtn.disabled = true;
      draw.changeBtn.textContent = '🔄 Cambio usado';
    }
  }

  function beginDrawAttempt() {
    if (!drawGame.currentCard) return;
    draw.secretStage?.classList.add('hidden');
    draw.canvasStage?.classList.remove('hidden');
    drawRemaining = DRAW_SECONDS;
    drawStartedAt = Date.now();
    clearDrawCanvas();
    updateDrawTimer();
    stopDrawTimer();
    drawTimerId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - drawStartedAt) / 1000);
      drawRemaining = Math.max(0, DRAW_SECONDS - elapsed);
      updateDrawTimer();
      if (drawRemaining <= 0) finishDrawAttempt(false);
    }, 200);
  }

  function finishDrawAttempt(success) {
    if (!drawGame.currentSection || !draw.secretStage?.classList.contains('hidden')) return;
    stopDrawTimer();
    const elapsedMs = success ? Math.max(100, Math.min(DRAW_SECONDS * 1000, Date.now() - drawStartedAt)) : null;
    drawGame.attempts.push({
      drawer: drawGame.currentDrawer,
      success,
      elapsedMs,
      word: drawGame.currentCard?.word || ''
    });

    if (drawGame.attempts.length === 1) {
      drawGame.currentDrawer = other(drawGame.firstDrawer);
      drawGame.currentCard = pickDrawCard(drawGame.currentSection, drawGame.currentDifficulty, drawGame.currentWords);
      if (drawGame.currentCard) drawGame.currentWords.push(drawGame.currentCard.word);
      drawGame.changeAvailable = true;
      prepareDrawSecret();
      return;
    }
    resolveDrawDuel();
  }

  function resolveDrawDuel() {
    const [a, b] = drawGame.attempts;
    let winner = null;
    if (a.success && !b.success) winner = a.drawer;
    else if (!a.success && b.success) winner = b.drawer;
    else if (a.success && b.success && a.elapsedMs !== b.elapsedMs) winner = a.elapsedMs < b.elapsedMs ? a.drawer : b.drawer;

    if (winner) {
      drawGame.claimed[drawGame.currentSection.id] = winner;
      drawGame.scores[winner] += 1;
      drawGame.blockedSectionId = null;
      drawGame.chooser = other(winner); // El perdedor elige para favorecer remontadas.
    } else {
      drawGame.blockedSectionId = drawGame.currentSection.id; // No se puede repetir inmediatamente.
      drawGame.chooser = other(drawGame.chooser);
    }

    renderDrawScores();
    renderDrawBoard();
    draw.round?.classList.add('hidden');
    draw.result?.classList.remove('hidden');

    if (winner) {
      if (draw.resultIcon) draw.resultIcon.textContent = '🏆';
      if (draw.resultTitle) draw.resultTitle.textContent = `${playerName(winner)} conquista ${drawGame.currentSection.title}`;
      if (draw.resultCopy) draw.resultCopy.textContent = drawGame.attempts.map(item => `${playerName(item.drawer)}: ${item.success ? formatDrawTime(item.elapsedMs) : 'no acertado'}`).join(' · ');
    } else {
      if (draw.resultIcon) draw.resultIcon.textContent = '🤝';
      if (draw.resultTitle) draw.resultTitle.textContent = `${drawGame.currentSection.title} queda libre`;
      if (draw.resultCopy) {
        draw.resultCopy.textContent = a.success && b.success
          ? `Habéis clavado exactamente el mismo tiempo. La categoría descansará un turno.`
          : 'Ninguno consiguió el acierto. La categoría descansará un turno antes de poder volver a elegirse.';
      }
    }

    if (winner && drawGame.scores[winner] >= DRAW_TO_WIN) {
      setTimeout(() => finishDrawGame(winner), 650);
      return;
    }
    if (draw.nextBtn) draw.nextBtn.textContent = `${playerName(drawGame.chooser)}, elegir siguiente categoría`;
  }

  function returnDrawBoard() {
    drawGame.currentSection = null;
    drawGame.attempts = [];
    drawGame.currentCard = null;
    draw.result?.classList.add('hidden');
    draw.lobby?.classList.remove('hidden');
    if (draw.turnTitle) draw.turnTitle.textContent = `${playerName(drawGame.chooser)} elige categoría`;
    if (draw.turnCopy) draw.turnCopy.textContent = 'El que perdió el último territorio elige ahora. Cada duelo usa palabras de dificultad equivalente.';
    renderDrawBoard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function finishDrawGame(winner) {
    drawGame.finished = true;
    draw.result?.classList.add('hidden');
    draw.round?.classList.add('hidden');
    draw.lobby?.classList.add('hidden');
    draw.final?.classList.remove('hidden');
    if (draw.finalTitle) draw.finalTitle.textContent = `${playerName(winner)} gana Dibuja`;
    if (draw.finalCopy) draw.finalCopy.textContent = `Ha conquistado ${drawGame.scores[winner]} territorios. Partida terminada.`;
    if (draw.finalBoard) {
      draw.finalBoard.innerHTML = DRAW_SECTIONS.filter(section => drawGame.claimed[section.id]).map(section => {
        const owner = drawGame.claimed[section.id];
        return `<span class="draw-final-territory is-${owner}">${section.emoji} ${section.title} · ${playerName(owner)}</span>`;
      }).join('');
    }
  }

  if (draw.startBtn && DRAW_SECTIONS.length) {
    draw.startBtn.addEventListener('click', flipDrawCoin);
    draw.resetBtn?.addEventListener('click', () => confirm('¿Empezar una partida nueva?') && resetDrawGame());
    draw.board?.addEventListener('click', event => {
      const button = event.target.closest('[data-draw-section]');
      if (button && !button.disabled) startDrawSection(button.dataset.drawSection);
    });
    draw.revealBtn?.addEventListener('click', () => {
      draw.revealBtn.classList.add('hidden');
      draw.cardReveal?.classList.remove('hidden');
    });
    draw.changeBtn?.addEventListener('click', changeDrawWord);
    draw.beginBtn?.addEventListener('click', beginDrawAttempt);
    draw.hitBtn?.addEventListener('click', () => finishDrawAttempt(true));
    draw.missBtn?.addEventListener('click', () => finishDrawAttempt(false));
    draw.nextBtn?.addEventListener('click', returnDrawBoard);
    draw.rematchBtn?.addEventListener('click', resetDrawGame);
    draw.clearBtn?.addEventListener('click', () => {
      if (confirm('¿Borrar todo el dibujo?')) clearDrawCanvas();
    });
    draw.undoBtn?.addEventListener('click', () => {
      if (!drawStrokes.length) return;
      drawStrokes.pop();
      redrawCanvas();
    });
    draw.eraserBtn?.addEventListener('click', () => {
      erasing = !erasing;
      draw.eraserBtn.classList.toggle('is-active', erasing);
    });

    document.querySelectorAll('[data-draw-color]').forEach(button => button.addEventListener('click', () => {
      erasing = false;
      draw.eraserBtn?.classList.remove('is-active');
      brushColor = button.dataset.drawColor;
      document.querySelectorAll('[data-draw-color]').forEach(item => item.classList.toggle('is-active', item === button));
    }));
    document.querySelectorAll('[data-draw-width]').forEach(button => button.addEventListener('click', () => {
      brushWidth = Number(button.dataset.drawWidth) || 6;
      document.querySelectorAll('[data-draw-width]').forEach(item => item.classList.toggle('is-active', item === button));
    }));

    function canvasPoint(event) {
      const rect = draw.canvas.getBoundingClientRect();
      return {
        x: (event.clientX - rect.left) * (draw.canvas.width / rect.width),
        y: (event.clientY - rect.top) * (draw.canvas.height / rect.height)
      };
    }

    draw.canvas?.addEventListener('pointerdown', event => {
      if (draw.canvasStage?.classList.contains('hidden')) return;
      event.preventDefault();
      drawDrawing = true;
      drawPointerId = event.pointerId;
      draw.canvas.setPointerCapture?.(event.pointerId);
      const point = canvasPoint(event);
      currentStroke = { color: brushColor, width: brushWidth, erasing, points: [point] };
      renderStroke(currentStroke);
    });

    draw.canvas?.addEventListener('pointermove', event => {
      if (!drawDrawing || event.pointerId !== drawPointerId || !drawCtx || !currentStroke) return;
      event.preventDefault();
      const point = canvasPoint(event);
      const previous = currentStroke.points[currentStroke.points.length - 1];
      currentStroke.points.push(point);
      drawCtx.save();
      drawCtx.beginPath();
      drawCtx.moveTo(previous.x, previous.y);
      drawCtx.lineTo(point.x, point.y);
      drawCtx.lineCap = 'round';
      drawCtx.lineJoin = 'round';
      drawCtx.lineWidth = currentStroke.erasing ? Math.max(24, currentStroke.width * 3) : currentStroke.width;
      drawCtx.strokeStyle = currentStroke.erasing ? '#ffffff' : currentStroke.color;
      drawCtx.stroke();
      drawCtx.restore();
    });

    const stopPointer = event => {
      if (event.pointerId !== drawPointerId) return;
      if (currentStroke) drawStrokes.push(currentStroke);
      drawDrawing = false;
      drawPointerId = null;
      currentStroke = null;
    };
    draw.canvas?.addEventListener('pointerup', stopPointer);
    draw.canvas?.addEventListener('pointercancel', stopPointer);
    resetDrawGame();
  }

  /* ------------------------------------------------------------------
     NO LO DIGAS · gana quien más palabras ADIVINA
     ------------------------------------------------------------------ */
  const taboo = {
    lobby: $('taboo-lobby'), startBtn: $('taboo-start-btn'), resetBtn: $('taboo-reset-btn'), coin: $('taboo-coin'),
    turnTitle: $('taboo-turn-title'), turnCopy: $('taboo-turn-copy'), scoreJavi: $('taboo-score-javi'), scoreLaura: $('taboo-score-laura'),
    turnStage: $('taboo-turn-stage'), turnEyebrow: $('taboo-turn-eyebrow'), clueName: $('taboo-clue-name'), guessName: $('taboo-guess-name'),
    beginTurnBtn: $('taboo-begin-turn-btn'), playStage: $('taboo-play-stage'), timer: $('taboo-timer'), timerBar: $('taboo-timer-bar'),
    category: $('taboo-category'), word: $('taboo-word'), banned: $('taboo-banned'), hits: $('taboo-turn-hits'), passes: $('taboo-turn-passes'),
    bannedCount: $('taboo-turn-banned'), streak: $('taboo-streak'),
    correctBtn: $('taboo-correct-btn'), passBtn: $('taboo-pass-btn'), bannedBtn: $('taboo-banned-btn'),
    summary: $('taboo-summary'), summaryTitle: $('taboo-summary-title'), summaryCopy: $('taboo-summary-copy'), nextTurnBtn: $('taboo-next-turn-btn'),
    final: $('taboo-final'), finalTitle: $('taboo-final-title'), finalCopy: $('taboo-final-copy'), rematchBtn: $('taboo-rematch-btn')
  };

  const TABOO_SECONDS = 90;
  const TABOO_FIRST_TIE_SECONDS = 45;
  const TABOO_REPEAT_TIE_SECONDS = 30;
  const TABOO_PENALTY_SECONDS = 5;
  const TABOO_HISTORY_KEY = 'javieats_taboo_recent_v2';
  const TABOO_DECK_LENGTH = 30;

  let tabooTimerId = null;
  let tabooStartedAt = 0;
  let tabooPenaltyMs = 0;
  let tabooTurnActive = false;

  const tabooGame = {
    started: false,
    flipping: false,
    starter: null, // Primer jugador que ADIVINA.
    sequence: [],
    turnIndex: 0,
    phase: 'regular',
    tiebreakRound: 0,
    scores: { javi: 0, laura: 0 },
    turnHits: 0,
    turnPasses: 0,
    turnBanned: 0,
    streak: 0,
    currentCard: null,
    turnDecks: [],
    currentDeck: [],
    usedWords: new Set(),
    finished: false
  };

  const tabooAllCards = TABOO_SECTIONS.flatMap(section => section.cards.map(card => ({
    ...card,
    sectionId: section.id,
    emoji: section.emoji,
    sectionTitle: section.title,
    difficulty: Number(card.difficulty) || 2
  })));

  function tabooRecentSet() {
    try { return new Set(JSON.parse(localStorage.getItem(TABOO_HISTORY_KEY) || '[]') || []); }
    catch { return new Set(); }
  }

  function rememberTaboo(word) {
    try {
      const recent = JSON.parse(localStorage.getItem(TABOO_HISTORY_KEY) || '[]') || [];
      localStorage.setItem(TABOO_HISTORY_KEY, JSON.stringify([...recent, word].slice(-90)));
    } catch { /* ignore */ }
  }

  function buildTabooSpecPlan(length = TABOO_DECK_LENGTH) {
    const ids = TABOO_SECTIONS.map(section => section.id);
    const difficultyPattern = [2, 1, 2, 2, 3, 2, 1, 2, 2];
    const plan = [];
    let categories = shuffle(ids);
    for (let i = 0; i < length; i += 1) {
      if (i > 0 && i % categories.length === 0) categories = shuffle(ids);
      plan.push({
        sectionId: categories[i % categories.length],
        difficulty: difficultyPattern[i % difficultyPattern.length]
      });
    }
    return plan;
  }

  function pickTabooPair(spec) {
    const recent = tabooRecentSet();
    const unused = card => !tabooGame.usedWords.has(card.word);
    const fresh = card => !recent.has(card.word);

    // Seleccionamos LAS DOS cartas a la vez para garantizar que los jugadores
    // reciben la misma categoría y el mismo nivel en la misma posición del turno.
    let pool = tabooAllCards.filter(card => unused(card) && card.sectionId === spec.sectionId && card.difficulty === spec.difficulty);
    if (pool.length < 2) {
      const sameSection = tabooAllCards.filter(card => unused(card) && card.sectionId === spec.sectionId);
      const byLevel = [spec.difficulty, 2, 1, 3]
        .filter((value, index, arr) => arr.indexOf(value) === index)
        .map(level => sameSection.filter(card => card.difficulty === level))
        .find(group => group.length >= 2);
      pool = byLevel || sameSection;
    }
    if (pool.length < 2) pool = tabooAllCards.filter(unused);

    const freshPool = pool.filter(fresh);
    if (freshPool.length >= 2) pool = freshPool;
    const pair = shuffle(pool).slice(0, 2);
    if (pair.length < 2) {
      // Caso extremo: partida excepcionalmente larga. Permitimos reciclar batería.
      tabooGame.usedWords.clear();
      return pickTabooPair(spec);
    }
    pair.forEach(card => tabooGame.usedWords.add(card.word));
    return pair;
  }

  function buildTabooPairedDecks(plan) {
    const first = [];
    const second = [];
    plan.forEach(spec => {
      const pair = pickTabooPair(spec);
      first.push(pair[0]);
      second.push(pair[1]);
    });
    return [first, second];
  }

  function buildTabooEmergencyDeck(length = 10) {
    const plan = buildTabooSpecPlan(length);
    const [first] = buildTabooPairedDecks(plan);
    return first;
  }

  function ensureTabooPairDecks() {
    const pairStart = Math.floor(tabooGame.turnIndex / 2) * 2;
    if (tabooGame.turnDecks[pairStart] && tabooGame.turnDecks[pairStart + 1]) return;
    const length = tabooGame.phase === 'regular' ? TABOO_DECK_LENGTH : 22;
    const plan = buildTabooSpecPlan(length);
    const [first, second] = buildTabooPairedDecks(plan);
    tabooGame.turnDecks[pairStart] = first;
    tabooGame.turnDecks[pairStart + 1] = second;
  }

  function currentTabooGuesser() {
    return tabooGame.sequence[tabooGame.turnIndex];
  }

  function currentTabooClue() {
    return other(currentTabooGuesser());
  }

  function tabooTurnSeconds() {
    if (tabooGame.phase === 'regular') return TABOO_SECONDS;
    if (tabooGame.phase === 'tie45') return TABOO_FIRST_TIE_SECONDS;
    return TABOO_REPEAT_TIE_SECONDS;
  }

  function nextTabooCard() {
    if (!tabooGame.currentDeck.length) {
      tabooGame.currentDeck.push(...buildTabooEmergencyDeck(10));
    }
    tabooGame.currentCard = tabooGame.currentDeck.shift() || null;
    if (tabooGame.currentCard) rememberTaboo(tabooGame.currentCard.word);
    renderTabooCard();
  }

  function renderTabooScores() {
    if (taboo.scoreJavi) taboo.scoreJavi.textContent = String(tabooGame.scores.javi);
    if (taboo.scoreLaura) taboo.scoreLaura.textContent = String(tabooGame.scores.laura);
  }

  function updateTabooStreak() {
    if (!taboo.streak) return;
    if (tabooGame.streak >= 3) {
      taboo.streak.textContent = `🔥 ${playerName(currentTabooGuesser())} · racha x${tabooGame.streak}`;
      taboo.streak.classList.remove('hidden');
    } else {
      taboo.streak.classList.add('hidden');
    }
  }

  function renderTabooCard() {
    const card = tabooGame.currentCard;
    if (!card) return;
    if (taboo.category) taboo.category.textContent = `${card.emoji} ${card.sectionTitle}`;
    if (taboo.word) taboo.word.textContent = card.word;
    if (taboo.banned) taboo.banned.innerHTML = card.banned.map(word => `<span>${word}</span>`).join('');
    if (taboo.hits) taboo.hits.textContent = String(tabooGame.turnHits);
    if (taboo.passes) taboo.passes.textContent = String(tabooGame.turnPasses);
    if (taboo.bannedCount) taboo.bannedCount.textContent = String(tabooGame.turnBanned);
    updateTabooStreak();
  }

  function resetTabooGame() {
    if (tabooTimerId) clearInterval(tabooTimerId);
    tabooTimerId = null;
    tabooTurnActive = false;
    Object.assign(tabooGame, {
      started: false, flipping: false, starter: null, sequence: [], turnIndex: 0, phase: 'regular', tiebreakRound: 0,
      scores: { javi: 0, laura: 0 }, turnHits: 0, turnPasses: 0, turnBanned: 0, streak: 0,
      currentCard: null, turnDecks: [], currentDeck: [], usedWords: new Set(), finished: false
    });
    taboo.coin?.classList.remove('is-flipping', 'is-javi', 'is-laura');
    if (taboo.turnTitle) taboo.turnTitle.textContent = 'Sortead quién empieza adivinando';
    if (taboo.turnCopy) taboo.turnCopy.textContent = 'Cada acierto suma un punto a la persona que adivina.';
    taboo.startBtn?.classList.remove('hidden');
    if (taboo.startBtn) taboo.startBtn.disabled = false;
    taboo.resetBtn?.classList.add('hidden');
    taboo.turnStage?.classList.add('hidden');
    taboo.playStage?.classList.add('hidden');
    taboo.summary?.classList.add('hidden');
    taboo.final?.classList.add('hidden');
    taboo.lobby?.classList.remove('hidden');
    taboo.streak?.classList.add('hidden');
    renderTabooScores();
  }

  function flipTabooCoin() {
    if (tabooGame.flipping || tabooGame.started) return;
    tabooGame.flipping = true;
    if (taboo.startBtn) taboo.startBtn.disabled = true;
    taboo.coin?.classList.remove('is-javi', 'is-laura');
    void taboo.coin?.offsetWidth;
    taboo.coin?.classList.add('is-flipping');
    setTimeout(() => {
      const chosen = Math.random() < .5 ? 'javi' : 'laura';
      tabooGame.started = true;
      tabooGame.flipping = false;
      tabooGame.starter = chosen;
      tabooGame.sequence = [chosen, other(chosen), chosen, other(chosen)];
      tabooGame.turnIndex = 0;
      tabooGame.phase = 'regular';
      tabooGame.turnDecks = [];
      taboo.coin?.classList.remove('is-flipping');
      taboo.coin?.classList.add(chosen === 'javi' ? 'is-javi' : 'is-laura');
      taboo.startBtn?.classList.add('hidden');
      taboo.resetBtn?.classList.remove('hidden');
      if (taboo.turnTitle) taboo.turnTitle.textContent = `${playerName(chosen)} empieza adivinando`;
      if (taboo.turnCopy) taboo.turnCopy.textContent = 'Dos turnos para adivinar por persona. 90 segundos cada uno.';
      setTimeout(prepareTabooTurn, 450);
    }, 1200);
  }

  function prepareTabooTurn() {
    taboo.lobby?.classList.add('hidden');
    taboo.playStage?.classList.add('hidden');
    taboo.summary?.classList.add('hidden');
    taboo.final?.classList.add('hidden');
    taboo.turnStage?.classList.remove('hidden');
    const clue = currentTabooClue();
    const guesser = currentTabooGuesser();
    const roundNo = tabooGame.phase === 'regular'
      ? `Turno ${tabooGame.turnIndex + 1} de 4`
      : `${tabooGame.phase === 'tie45' ? 'Desempate' : 'Desempate relámpago'} · ${tabooGame.turnIndex + 1} de 2`;
    if (taboo.turnEyebrow) taboo.turnEyebrow.textContent = roundNo;
    if (taboo.clueName) taboo.clueName.textContent = playerName(clue);
    if (taboo.guessName) taboo.guessName.textContent = playerName(guesser);
    if (taboo.beginTurnBtn) taboo.beginTurnBtn.textContent = `${playerName(clue)}, empezar turno`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function tabooRemainingMs() {
    return Math.max(0, tabooTurnSeconds() * 1000 - (Date.now() - tabooStartedAt) - tabooPenaltyMs);
  }

  function updateTabooTimer() {
    if (!taboo.timer || !taboo.timerBar) return;
    const total = tabooTurnSeconds();
    const remainingMs = tabooRemainingMs();
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    taboo.timer.textContent = String(remainingSeconds);
    taboo.timerBar.style.width = `${Math.max(0, (remainingMs / (total * 1000)) * 100)}%`;
    taboo.timer.closest('.taboo-timer-row')?.classList.toggle('is-urgent', remainingSeconds <= 10);
  }

  function beginTabooTurn() {
    ensureTabooPairDecks();
    tabooGame.currentDeck = [...(tabooGame.turnDecks[tabooGame.turnIndex] || [])];
    tabooGame.turnHits = 0;
    tabooGame.turnPasses = 0;
    tabooGame.turnBanned = 0;
    tabooGame.streak = 0;
    taboo.turnStage?.classList.add('hidden');
    taboo.playStage?.classList.remove('hidden');
    tabooPenaltyMs = 0;
    tabooStartedAt = Date.now();
    tabooTurnActive = true;
    nextTabooCard();
    updateTabooTimer();
    if (tabooTimerId) clearInterval(tabooTimerId);
    tabooTimerId = setInterval(() => {
      updateTabooTimer();
      if (tabooRemainingMs() <= 0) finishTabooTurn();
    }, 150);
  }

  function applyTabooPenalty() {
    tabooPenaltyMs += TABOO_PENALTY_SECONDS * 1000;
    updateTabooTimer();
    return tabooRemainingMs() <= 0;
  }

  function handleTabooCard(result) {
    if (!tabooGame.started || !tabooTurnActive || taboo.playStage?.classList.contains('hidden')) return;
    const guesser = currentTabooGuesser();
    if (result === 'correct') {
      tabooGame.turnHits += 1;
      tabooGame.scores[guesser] += 1;
      tabooGame.streak += 1;
      renderTabooScores();
      nextTabooCard();
      return;
    }

    tabooGame.streak = 0;
    if (result === 'pass') tabooGame.turnPasses += 1;
    if (result === 'banned') tabooGame.turnBanned += 1;
    if (applyTabooPenalty()) {
      finishTabooTurn();
      return;
    }
    nextTabooCard();
  }

  function finishTabooTurn() {
    if (!tabooTurnActive) return;
    tabooTurnActive = false;
    if (tabooTimerId) clearInterval(tabooTimerId);
    tabooTimerId = null;
    taboo.playStage?.classList.add('hidden');
    taboo.streak?.classList.add('hidden');
    taboo.summary?.classList.remove('hidden');
    const guesser = currentTabooGuesser();
    if (taboo.summaryTitle) taboo.summaryTitle.textContent = `${playerName(guesser)} adivina ${tabooGame.turnHits} ${tabooGame.turnHits === 1 ? 'palabra' : 'palabras'}`;
    if (taboo.summaryCopy) {
      taboo.summaryCopy.textContent = `Pases: ${tabooGame.turnPasses} · Prohibidas: ${tabooGame.turnBanned} · marcador Javi ${tabooGame.scores.javi} - Laura ${tabooGame.scores.laura}`;
    }
    tabooGame.turnIndex += 1;

    if (tabooGame.turnIndex >= tabooGame.sequence.length) {
      if (tabooGame.scores.javi === tabooGame.scores.laura) {
        const seconds = tabooGame.phase === 'regular' ? TABOO_FIRST_TIE_SECONDS : TABOO_REPEAT_TIE_SECONDS;
        if (taboo.nextTurnBtn) taboo.nextTurnBtn.textContent = `${tabooGame.phase === 'regular' ? 'Ir al desempate' : 'Seguimos empatados'} · ${seconds} s cada uno`;
      } else if (taboo.nextTurnBtn) {
        taboo.nextTurnBtn.textContent = 'Ver ganador';
      }
    } else if (taboo.nextTurnBtn) {
      taboo.nextTurnBtn.textContent = `Siguiente · ${playerName(currentTabooGuesser())} adivina`;
    }
  }

  function setupNextTiebreak() {
    tabooGame.tiebreakRound += 1;
    tabooGame.phase = tabooGame.tiebreakRound === 1 ? 'tie45' : 'tie30';
    const first = tabooGame.tiebreakRound % 2 === 1 ? tabooGame.starter : other(tabooGame.starter);
    tabooGame.sequence = [first, other(first)];
    tabooGame.turnIndex = 0;
    tabooGame.turnDecks = [];
  }

  function nextTabooTurnOrFinish() {
    if (tabooGame.turnIndex < tabooGame.sequence.length) {
      taboo.summary?.classList.add('hidden');
      prepareTabooTurn();
      return;
    }
    if (tabooGame.scores.javi === tabooGame.scores.laura) {
      setupNextTiebreak();
      taboo.summary?.classList.add('hidden');
      prepareTabooTurn();
      return;
    }
    finishTabooGame();
  }

  function finishTabooGame() {
    tabooGame.finished = true;
    taboo.summary?.classList.add('hidden');
    taboo.turnStage?.classList.add('hidden');
    taboo.playStage?.classList.add('hidden');
    taboo.final?.classList.remove('hidden');
    const winner = tabooGame.scores.javi > tabooGame.scores.laura ? 'javi' : 'laura';
    const margin = Math.abs(tabooGame.scores.javi - tabooGame.scores.laura);
    if (taboo.finalTitle) taboo.finalTitle.textContent = `${playerName(winner)} gana No lo digas`;
    if (taboo.finalCopy) {
      taboo.finalCopy.textContent = `Marcador final: Javi ${tabooGame.scores.javi} · Laura ${tabooGame.scores.laura}${margin >= 5 ? ' · Paliza seria 😂' : margin === 1 ? ' · Por la mínima 🔥' : ''}`;
    }
  }

  if (taboo.startBtn && TABOO_SECTIONS.length) {
    taboo.startBtn.addEventListener('click', flipTabooCoin);
    taboo.resetBtn?.addEventListener('click', () => confirm('¿Empezar una partida nueva?') && resetTabooGame());
    taboo.beginTurnBtn?.addEventListener('click', beginTabooTurn);
    taboo.correctBtn?.addEventListener('click', () => handleTabooCard('correct'));
    taboo.passBtn?.addEventListener('click', () => handleTabooCard('pass'));
    taboo.bannedBtn?.addEventListener('click', () => handleTabooCard('banned'));
    taboo.nextTurnBtn?.addEventListener('click', nextTabooTurnOrFinish);
    taboo.rematchBtn?.addEventListener('click', resetTabooGame);
    resetTabooGame();
  }

  const accessTimer = setInterval(refreshAccess, 1000);
  window.addEventListener('beforeunload', () => clearInterval(accessTimer));

  window.JaviEatsMinigames = { open, showHub, refreshAccess, unlockAt: UNLOCK_AT };
  refreshAccess();
})();
