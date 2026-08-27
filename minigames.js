/* JaviEats v2.7 · Minijuegos
   Hub + desbloqueo Laura + Dibuja + No lo digas.
   No toca Supabase: son juegos presenciales y su estado vive en memoria/localStorage. */
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
    const days = Math.floor(total / 86400);
    const hours = Math.floor((total % 86400) / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;
    return { diff, days, hours, minutes, seconds };
  }

  function countdownText() {
    const { diff, days, hours, minutes, seconds } = countdownParts();
    if (!diff) return 'Ya disponible';
    const d = String(days).padStart(2, '0');
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');
    return `${d}d ${h}h ${m}m ${s}s`;
  }

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

  launchers.forEach(button => {
    button.addEventListener('click', () => open(button.dataset.minigameOpen));
  });
  document.querySelectorAll('[data-minigame-back]').forEach(button => button.addEventListener('click', showHub));

  /* ----------------------------------------------------------------------
     DIBUJA · duelo por categorías
     Cada territorio tiene dos intentos: uno dibuja Javi y otro Laura.
     Quien consiga que el otro acierte más rápido conquista la categoría.
     Primero a 3 territorios.
     ---------------------------------------------------------------------- */
  const draw = {
    lobby: $('draw-lobby'), board: $('draw-board'), startBtn: $('draw-start-btn'), resetBtn: $('draw-reset-btn'),
    coin: $('draw-coin'), turnTitle: $('draw-turn-title'), turnCopy: $('draw-turn-copy'),
    scoreJavi: $('draw-score-javi'), scoreLaura: $('draw-score-laura'),
    round: $('draw-round'), sectionChip: $('draw-section-chip'), attemptProgress: $('draw-attempt-progress'),
    drawerName: $('draw-drawer-name'), guesserName: $('draw-guesser-name'), duelState: $('draw-duel-state'),
    secretStage: $('draw-secret-stage'), secretWarning: $('draw-secret-warning'), secretTitle: $('draw-secret-title'),
    revealBtn: $('draw-reveal-card-btn'), cardReveal: $('draw-card-reveal'), cardWord: $('draw-card-word'), beginBtn: $('draw-begin-card-btn'),
    canvasStage: $('draw-canvas-stage'), canvas: $('draw-canvas'), timer: $('draw-timer'), timerBar: $('draw-timer-bar'),
    hitBtn: $('draw-hit-btn'), missBtn: $('draw-miss-btn'), eraserBtn: $('draw-eraser-btn'), clearBtn: $('draw-clear-btn'),
    result: $('draw-result'), resultIcon: $('draw-result-icon'), resultTitle: $('draw-result-title'), resultCopy: $('draw-result-copy'),
    nextBtn: $('draw-next-section-btn'), final: $('draw-final'), finalTitle: $('draw-final-title'), finalCopy: $('draw-final-copy'),
    finalBoard: $('draw-final-board'), rematchBtn: $('draw-rematch-btn')
  };

  const DRAW_SECONDS = 60;
  const DRAW_TO_WIN = 3;
  const DRAW_HISTORY_KEY = 'javieats_draw_recent_v2';
  let drawTimerId = null;
  let drawRemaining = DRAW_SECONDS;
  let drawStartedAt = 0;
  let drawDrawing = false;
  let drawPointerId = null;
  let drawLastPoint = null;
  let brushColor = '#171414';
  let brushWidth = 6;
  let erasing = false;
  const drawCtx = draw.canvas?.getContext('2d') || null;

  const drawGame = {
    started: false,
    flipping: false,
    chooser: null,
    currentSection: null,
    firstDrawer: null,
    currentDrawer: null,
    attempts: [],
    currentWord: null,
    currentWords: [],
    claimed: {},
    scores: { javi: 0, laura: 0 },
    finished: false
  };

  function drawRecent() {
    try { return JSON.parse(localStorage.getItem(DRAW_HISTORY_KEY) || '{}') || {}; }
    catch { return {}; }
  }

  function pickDrawWord(section, excluded = []) {
    const recent = drawRecent();
    const used = new Set([...(recent[section.id] || []), ...excluded]);
    let pool = section.cards.filter(word => !used.has(word));
    if (!pool.length) pool = section.cards.filter(word => !excluded.includes(word));
    const word = shuffle(pool)[0] || section.cards[0];
    try {
      const history = drawRecent();
      history[section.id] = [...(history[section.id] || []), word].slice(-18);
      localStorage.setItem(DRAW_HISTORY_KEY, JSON.stringify(history));
    } catch { /* juego sigue sin storage */ }
    return word;
  }

  function renderDrawScores() {
    if (draw.scoreJavi) draw.scoreJavi.textContent = String(drawGame.scores.javi);
    if (draw.scoreLaura) draw.scoreLaura.textContent = String(drawGame.scores.laura);
  }

  function renderDrawBoard() {
    if (!draw.board) return;
    draw.board.innerHTML = DRAW_SECTIONS.map(section => {
      const owner = drawGame.claimed[section.id] || '';
      const selectable = drawGame.started && !drawGame.finished && !drawGame.currentSection && !owner;
      const ownerLabel = owner ? `${playerName(owner)} · conquistado` : '';
      return `<button class="draw-section-card${owner ? ` is-${owner}` : ''}${selectable ? ' is-selectable' : ''}" type="button" data-draw-section="${section.id}" data-owner-label="${ownerLabel}" ${selectable ? '' : 'disabled'}>
        <span class="draw-section-emoji">${section.emoji}</span>
        <span><span class="draw-section-title">${section.title}</span><span class="draw-section-subtitle">${section.subtitle}</span></span>
      </button>`;
    }).join('');
  }

  function clearDrawCanvas() {
    if (!drawCtx || !draw.canvas) return;
    drawCtx.save();
    drawCtx.setTransform(1, 0, 0, 1, 0, 0);
    drawCtx.fillStyle = '#ffffff';
    drawCtx.fillRect(0, 0, draw.canvas.width, draw.canvas.height);
    drawCtx.restore();
  }

  function stopDrawTimer() {
    if (drawTimerId) clearInterval(drawTimerId);
    drawTimerId = null;
  }

  function updateDrawTimer() {
    if (!draw.timer || !draw.timerBar) return;
    draw.timer.textContent = String(drawRemaining);
    draw.timerBar.style.width = `${Math.max(0, (drawRemaining / DRAW_SECONDS) * 100)}%`;
    draw.timer.closest('.draw-timer-row')?.classList.toggle('is-urgent', drawRemaining <= 10);
  }

  function resetDrawGame() {
    stopDrawTimer();
    Object.assign(drawGame, {
      started: false, flipping: false, chooser: null, currentSection: null, firstDrawer: null,
      currentDrawer: null, attempts: [], currentWord: null, currentWords: [], claimed: {},
      scores: { javi: 0, laura: 0 }, finished: false
    });
    draw.coin?.classList.remove('is-flipping', 'is-javi', 'is-laura');
    if (draw.turnTitle) draw.turnTitle.textContent = 'Lanzad la moneda para empezar';
    if (draw.turnCopy) draw.turnCopy.textContent = 'Decidirá quién elige la primera categoría y dibuja primero.';
    if (draw.startBtn) { draw.startBtn.disabled = false; draw.startBtn.classList.remove('hidden'); }
    draw.resetBtn?.classList.add('hidden');
    draw.round?.classList.add('hidden');
    draw.result?.classList.add('hidden');
    draw.final?.classList.add('hidden');
    draw.lobby?.classList.remove('hidden');
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
    drawGame.currentSection = section;
    drawGame.firstDrawer = drawGame.chooser;
    drawGame.currentDrawer = drawGame.firstDrawer;
    drawGame.attempts = [];
    drawGame.currentWords = [];
    drawGame.currentWord = pickDrawWord(section);
    drawGame.currentWords.push(drawGame.currentWord);
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
      draw.duelState.textContent = first ? `${playerName(first.drawer)}: ${first.success ? `${first.elapsed}s` : 'sin acierto'}` : 'Primer intento';
    }
    if (draw.secretWarning) draw.secretWarning.textContent = `${playerName(guesser)}, no mires 👀`;
    if (draw.secretTitle) draw.secretTitle.textContent = `${playerName(drawer)}, mira lo que tienes que dibujar`;
    if (draw.cardWord) draw.cardWord.textContent = drawGame.currentWord || '—';
    draw.cardReveal?.classList.add('hidden');
    draw.revealBtn?.classList.remove('hidden');
    draw.secretStage?.classList.remove('hidden');
    draw.canvasStage?.classList.add('hidden');
    drawRemaining = DRAW_SECONDS;
    updateDrawTimer();
    clearDrawCanvas();
  }

  function beginDrawAttempt() {
    draw.secretStage?.classList.add('hidden');
    draw.canvasStage?.classList.remove('hidden');
    drawRemaining = DRAW_SECONDS;
    drawStartedAt = Date.now();
    updateDrawTimer();
    clearDrawCanvas();
    stopDrawTimer();
    drawTimerId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - drawStartedAt) / 1000);
      drawRemaining = Math.max(0, DRAW_SECONDS - elapsed);
      updateDrawTimer();
      if (drawRemaining <= 0) finishDrawAttempt(false);
    }, 200);
  }

  function finishDrawAttempt(success) {
    if (!drawGame.currentSection || draw.secretStage?.classList.contains('hidden') === false) return;
    stopDrawTimer();
    const elapsed = success ? Math.max(1, Math.min(DRAW_SECONDS, Math.ceil((Date.now() - drawStartedAt) / 1000))) : null;
    drawGame.attempts.push({ drawer: drawGame.currentDrawer, success, elapsed, word: drawGame.currentWord });

    if (drawGame.attempts.length === 1) {
      drawGame.currentDrawer = other(drawGame.firstDrawer);
      drawGame.currentWord = pickDrawWord(drawGame.currentSection, drawGame.currentWords);
      drawGame.currentWords.push(drawGame.currentWord);
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
    else if (a.success && b.success && a.elapsed !== b.elapsed) winner = a.elapsed < b.elapsed ? a.drawer : b.drawer;

    if (winner) {
      drawGame.claimed[drawGame.currentSection.id] = winner;
      drawGame.scores[winner] += 1;
    }
    renderDrawScores();
    renderDrawBoard();
    draw.round?.classList.add('hidden');
    draw.result?.classList.remove('hidden');

    if (winner) {
      if (draw.resultIcon) draw.resultIcon.textContent = '🏆';
      if (draw.resultTitle) draw.resultTitle.textContent = `${playerName(winner)} conquista ${drawGame.currentSection.title}`;
      if (draw.resultCopy) {
        const details = drawGame.attempts.map(item => `${playerName(item.drawer)}: ${item.success ? `${item.elapsed}s` : 'no acertado'}`).join(' · ');
        draw.resultCopy.textContent = details;
      }
    } else {
      if (draw.resultIcon) draw.resultIcon.textContent = '🤝';
      if (draw.resultTitle) draw.resultTitle.textContent = `${drawGame.currentSection.title} queda libre`;
      if (draw.resultCopy) draw.resultCopy.textContent = a.success && b.success ? `Empate exacto a ${a.elapsed}s. Podréis volver a elegirla.` : 'Ninguno consiguió que el otro acertara. Podréis volver a elegirla.';
    }

    if (winner && drawGame.scores[winner] >= DRAW_TO_WIN) {
      setTimeout(() => finishDrawGame(winner), 700);
      return;
    }
    drawGame.chooser = other(drawGame.chooser);
    if (draw.nextBtn) draw.nextBtn.textContent = `${playerName(drawGame.chooser)}, elegir siguiente categoría`;
  }

  function returnDrawBoard() {
    drawGame.currentSection = null;
    drawGame.attempts = [];
    drawGame.currentWord = null;
    draw.result?.classList.add('hidden');
    draw.lobby?.classList.remove('hidden');
    if (draw.turnTitle) draw.turnTitle.textContent = `${playerName(drawGame.chooser)} elige categoría`;
    if (draw.turnCopy) draw.turnCopy.textContent = 'Cada territorio se decide con un dibujo por persona. Gana quien lo consiga más rápido.';
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
    draw.revealBtn?.addEventListener('click', () => { draw.revealBtn.classList.add('hidden'); draw.cardReveal?.classList.remove('hidden'); });
    draw.beginBtn?.addEventListener('click', beginDrawAttempt);
    draw.hitBtn?.addEventListener('click', () => finishDrawAttempt(true));
    draw.missBtn?.addEventListener('click', () => finishDrawAttempt(false));
    draw.nextBtn?.addEventListener('click', returnDrawBoard);
    draw.rematchBtn?.addEventListener('click', resetDrawGame);
    draw.clearBtn?.addEventListener('click', clearDrawCanvas);
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
      drawDrawing = true;
      drawPointerId = event.pointerId;
      draw.canvas.setPointerCapture?.(event.pointerId);
      drawLastPoint = canvasPoint(event);
    });
    draw.canvas?.addEventListener('pointermove', event => {
      if (!drawDrawing || event.pointerId !== drawPointerId || !drawCtx) return;
      const point = canvasPoint(event);
      drawCtx.beginPath();
      drawCtx.moveTo(drawLastPoint.x, drawLastPoint.y);
      drawCtx.lineTo(point.x, point.y);
      drawCtx.lineCap = 'round';
      drawCtx.lineJoin = 'round';
      drawCtx.lineWidth = erasing ? Math.max(24, brushWidth * 3) : brushWidth;
      drawCtx.strokeStyle = erasing ? '#ffffff' : brushColor;
      drawCtx.stroke();
      drawLastPoint = point;
    });
    const stopPointer = event => {
      if (event.pointerId !== drawPointerId) return;
      drawDrawing = false;
      drawPointerId = null;
      drawLastPoint = null;
    };
    draw.canvas?.addEventListener('pointerup', stopPointer);
    draw.canvas?.addEventListener('pointercancel', stopPointer);
    resetDrawGame();
  }

  /* ----------------------------------------------------------------------
     NO LO DIGAS · pistas verbales contra reloj
     El jugador del turno da las pistas y gana 1 punto por cada acierto.
     2 turnos por persona · 45 s. Si hay empate: tandas de 30 s.
     ---------------------------------------------------------------------- */
  const taboo = {
    lobby: $('taboo-lobby'), startBtn: $('taboo-start-btn'), resetBtn: $('taboo-reset-btn'), coin: $('taboo-coin'),
    turnTitle: $('taboo-turn-title'), turnCopy: $('taboo-turn-copy'), scoreJavi: $('taboo-score-javi'), scoreLaura: $('taboo-score-laura'),
    turnStage: $('taboo-turn-stage'), turnEyebrow: $('taboo-turn-eyebrow'), clueName: $('taboo-clue-name'), guessName: $('taboo-guess-name'),
    beginTurnBtn: $('taboo-begin-turn-btn'), playStage: $('taboo-play-stage'), timer: $('taboo-timer'), timerBar: $('taboo-timer-bar'),
    category: $('taboo-category'), word: $('taboo-word'), banned: $('taboo-banned'), hits: $('taboo-turn-hits'), passes: $('taboo-turn-passes'),
    correctBtn: $('taboo-correct-btn'), passBtn: $('taboo-pass-btn'), bannedBtn: $('taboo-banned-btn'),
    summary: $('taboo-summary'), summaryTitle: $('taboo-summary-title'), summaryCopy: $('taboo-summary-copy'), nextTurnBtn: $('taboo-next-turn-btn'),
    final: $('taboo-final'), finalTitle: $('taboo-final-title'), finalCopy: $('taboo-final-copy'), rematchBtn: $('taboo-rematch-btn')
  };

  const TABOO_SECONDS = 45;
  const TABOO_TIE_SECONDS = 30;
  const TABOO_HISTORY_KEY = 'javieats_taboo_recent_v1';
  let tabooTimerId = null;
  let tabooRemaining = TABOO_SECONDS;
  let tabooStartedAt = 0;

  const tabooGame = {
    started: false, flipping: false, starter: null, sequence: [], turnIndex: 0, tiebreak: false,
    scores: { javi: 0, laura: 0 }, turnHits: 0, turnPasses: 0, currentCard: null, deck: [], finished: false
  };

  function flattenTabooDeck() {
    const all = [];
    TABOO_SECTIONS.forEach(section => section.cards.forEach(card => all.push({ ...card, sectionId: section.id, emoji: section.emoji, sectionTitle: section.title })));
    let recent = [];
    try { recent = JSON.parse(localStorage.getItem(TABOO_HISTORY_KEY) || '[]') || []; } catch { /* ignore */ }
    const recentSet = new Set(recent);
    const fresh = all.filter(card => !recentSet.has(card.word));
    const old = all.filter(card => recentSet.has(card.word));
    return [...shuffle(fresh), ...shuffle(old)];
  }

  function rememberTaboo(word) {
    try {
      const recent = JSON.parse(localStorage.getItem(TABOO_HISTORY_KEY) || '[]') || [];
      localStorage.setItem(TABOO_HISTORY_KEY, JSON.stringify([...recent, word].slice(-70)));
    } catch { /* ignore */ }
  }

  function nextTabooCard() {
    if (!tabooGame.deck.length) tabooGame.deck = flattenTabooDeck();
    tabooGame.currentCard = tabooGame.deck.shift() || null;
    if (tabooGame.currentCard) rememberTaboo(tabooGame.currentCard.word);
    renderTabooCard();
  }

  function renderTabooScores() {
    if (taboo.scoreJavi) taboo.scoreJavi.textContent = String(tabooGame.scores.javi);
    if (taboo.scoreLaura) taboo.scoreLaura.textContent = String(tabooGame.scores.laura);
  }

  function renderTabooCard() {
    const card = tabooGame.currentCard;
    if (!card) return;
    if (taboo.category) taboo.category.textContent = `${card.emoji} ${card.sectionTitle}`;
    if (taboo.word) taboo.word.textContent = card.word;
    if (taboo.banned) taboo.banned.innerHTML = card.banned.map(word => `<span>${word}</span>`).join('');
    if (taboo.hits) taboo.hits.textContent = String(tabooGame.turnHits);
    if (taboo.passes) taboo.passes.textContent = String(tabooGame.turnPasses);
  }

  function resetTabooGame() {
    if (tabooTimerId) clearInterval(tabooTimerId);
    Object.assign(tabooGame, {
      started: false, flipping: false, starter: null, sequence: [], turnIndex: 0, tiebreak: false,
      scores: { javi: 0, laura: 0 }, turnHits: 0, turnPasses: 0, currentCard: null, deck: flattenTabooDeck(), finished: false
    });
    taboo.coin?.classList.remove('is-flipping', 'is-javi', 'is-laura');
    if (taboo.turnTitle) taboo.turnTitle.textContent = 'Sortead quién empieza dando pistas';
    if (taboo.turnCopy) taboo.turnCopy.textContent = 'Cada acierto suma un punto a quien está dando las pistas.';
    taboo.startBtn?.classList.remove('hidden');
    if (taboo.startBtn) taboo.startBtn.disabled = false;
    taboo.resetBtn?.classList.add('hidden');
    taboo.turnStage?.classList.add('hidden');
    taboo.playStage?.classList.add('hidden');
    taboo.summary?.classList.add('hidden');
    taboo.final?.classList.add('hidden');
    taboo.lobby?.classList.remove('hidden');
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
      taboo.coin?.classList.remove('is-flipping');
      taboo.coin?.classList.add(chosen === 'javi' ? 'is-javi' : 'is-laura');
      taboo.startBtn?.classList.add('hidden');
      taboo.resetBtn?.classList.remove('hidden');
      if (taboo.turnTitle) taboo.turnTitle.textContent = `${playerName(chosen)} empieza dando pistas`;
      if (taboo.turnCopy) taboo.turnCopy.textContent = 'Dos turnos por persona. 45 segundos por turno.';
      setTimeout(prepareTabooTurn, 450);
    }, 1200);
  }

  function currentTabooPlayer() { return tabooGame.sequence[tabooGame.turnIndex]; }

  function prepareTabooTurn() {
    taboo.lobby?.classList.add('hidden');
    taboo.playStage?.classList.add('hidden');
    taboo.summary?.classList.add('hidden');
    taboo.final?.classList.add('hidden');
    taboo.turnStage?.classList.remove('hidden');
    const clue = currentTabooPlayer();
    const guesser = other(clue);
    const roundNo = tabooGame.tiebreak ? 'Desempate' : `Turno ${tabooGame.turnIndex + 1} de 4`;
    if (taboo.turnEyebrow) taboo.turnEyebrow.textContent = roundNo;
    if (taboo.clueName) taboo.clueName.textContent = playerName(clue);
    if (taboo.guessName) taboo.guessName.textContent = playerName(guesser);
    if (taboo.beginTurnBtn) taboo.beginTurnBtn.textContent = `${playerName(clue)}, empezar turno`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateTabooTimer() {
    if (!taboo.timer || !taboo.timerBar) return;
    const total = tabooGame.tiebreak ? TABOO_TIE_SECONDS : TABOO_SECONDS;
    taboo.timer.textContent = String(tabooRemaining);
    taboo.timerBar.style.width = `${Math.max(0, (tabooRemaining / total) * 100)}%`;
    taboo.timer.closest('.taboo-timer-row')?.classList.toggle('is-urgent', tabooRemaining <= 8);
  }

  function beginTabooTurn() {
    tabooGame.turnHits = 0;
    tabooGame.turnPasses = 0;
    taboo.turnStage?.classList.add('hidden');
    taboo.playStage?.classList.remove('hidden');
    tabooRemaining = tabooGame.tiebreak ? TABOO_TIE_SECONDS : TABOO_SECONDS;
    tabooStartedAt = Date.now();
    nextTabooCard();
    updateTabooTimer();
    if (tabooTimerId) clearInterval(tabooTimerId);
    tabooTimerId = setInterval(() => {
      const total = tabooGame.tiebreak ? TABOO_TIE_SECONDS : TABOO_SECONDS;
      tabooRemaining = Math.max(0, total - Math.floor((Date.now() - tabooStartedAt) / 1000));
      updateTabooTimer();
      if (tabooRemaining <= 0) finishTabooTurn();
    }, 200);
  }

  function handleTabooCard(result) {
    if (!tabooGame.started || taboo.playStage?.classList.contains('hidden')) return;
    const clue = currentTabooPlayer();
    if (result === 'correct') {
      tabooGame.turnHits += 1;
      tabooGame.scores[clue] += 1;
      renderTabooScores();
    } else {
      tabooGame.turnPasses += 1;
    }
    nextTabooCard();
  }

  function finishTabooTurn() {
    if (tabooTimerId) clearInterval(tabooTimerId);
    tabooTimerId = null;
    taboo.playStage?.classList.add('hidden');
    taboo.summary?.classList.remove('hidden');
    const clue = currentTabooPlayer();
    if (taboo.summaryTitle) taboo.summaryTitle.textContent = `${playerName(clue)} consigue ${tabooGame.turnHits} ${tabooGame.turnHits === 1 ? 'punto' : 'puntos'}`;
    if (taboo.summaryCopy) taboo.summaryCopy.textContent = `${tabooGame.turnPasses} cartas pasadas o anuladas · marcador ${tabooGame.scores.javi}-${tabooGame.scores.laura}`;
    tabooGame.turnIndex += 1;

    if (tabooGame.turnIndex >= tabooGame.sequence.length) {
      if (tabooGame.scores.javi === tabooGame.scores.laura) {
        tabooGame.tiebreak = true;
        tabooGame.sequence = [tabooGame.starter, other(tabooGame.starter)];
        tabooGame.turnIndex = 0;
        if (taboo.nextTurnBtn) taboo.nextTurnBtn.textContent = 'Ir al desempate · 30 s cada uno';
      } else {
        if (taboo.nextTurnBtn) taboo.nextTurnBtn.textContent = 'Ver ganador';
      }
    } else if (taboo.nextTurnBtn) {
      taboo.nextTurnBtn.textContent = `Siguiente · ${playerName(currentTabooPlayer())} da pistas`;
    }
  }

  function nextTabooTurnOrFinish() {
    if (tabooGame.turnIndex < tabooGame.sequence.length) {
      taboo.summary?.classList.add('hidden');
      prepareTabooTurn();
      return;
    }
    if (tabooGame.scores.javi === tabooGame.scores.laura) {
      tabooGame.tiebreak = true;
      tabooGame.sequence = [tabooGame.starter, other(tabooGame.starter)];
      tabooGame.turnIndex = 0;
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
    if (taboo.finalTitle) taboo.finalTitle.textContent = `${playerName(winner)} gana No lo digas`;
    if (taboo.finalCopy) taboo.finalCopy.textContent = `Marcador final: Javi ${tabooGame.scores.javi} · Laura ${tabooGame.scores.laura}`;
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
