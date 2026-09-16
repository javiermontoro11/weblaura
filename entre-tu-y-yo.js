/* Entre tu y yo · juego local para un solo dispositivo. */
(() => {
  'use strict';

  const DATA = window.JAVIEATS_BETWEEN_US;
  if (!DATA) throw new Error('Entre tu y yo: no se han cargado los datos');

  const ACTIVE_KEY = 'javieats_entre_tu_y_yo_active_v1';
  const HISTORY_KEY = 'javieats_entre_tu_y_yo_history_v1';
  const MECHANICS = ['who', 'bet', 'rank', 'who', 'inverse', 'bet', 'rank', 'inverse'];
  const ROUND_COUNT = MECHANICS.length;
  const MECHANIC_META = {
    who: { icon: '♥', title: '¿Quién de los dos?', intro: 'Primero intuición. Luego explicaciones.' },
    bet: { icon: '🎯', title: 'Apuesta por mí', intro: '¿La vas a clavar?' },
    rank: { icon: '≡', title: 'Ranking normal', intro: 'Poned en orden lo que os importa.' },
    inverse: { icon: '🔮', title: 'Ranking inverso', intro: '¿La tienes calada?' }
  };
  const NAMES = { javi: 'Javi', laura: 'Laura' };
  const other = person => person === 'javi' ? 'laura' : 'javi';
  const $ = id => document.getElementById(id);
  const randomItem = items => items[Math.floor(Math.random() * items.length)];
  const shuffle = items => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch (_) { return fallback; }
  }

  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (_) { return false; }
  }

  function loadGame() {
    const saved = read(ACTIVE_KEY, null);
    const valid = saved?.version === 2 && saved.rounds?.length === ROUND_COUNT && saved.rounds.every((round, index) => round.type === MECHANICS[index]);
    if (saved && !valid) localStorage.removeItem(ACTIVE_KEY);
    return valid ? saved : null;
  }

  function rankingScore(a, b) {
    const positions = new Map(b.map((id, index) => [id, index]));
    const difference = a.reduce((sum, id, index) => sum + Math.abs(index - positions.get(id)), 0);
    return Math.round(100 * (1 - difference / 12));
  }

  function history() {
    return { who: [], bet: [], ranking: [], ...read(HISTORY_KEY, {}) };
  }

  function remember(type, ids) {
    const all = history();
    const key = type === 'rank' || type === 'inverse' ? 'ranking' : type;
    all[key] = [...all[key], ...ids].filter((id, index, values) => values.indexOf(id) === index).slice(-100);
    write(HISTORY_KEY, all);
  }

  function selectQuestions(pool, count, recent, used, previousCategory) {
    const selected = [];
    let blocked = [...recent];
    while (selected.length < count) {
      let candidates = pool.filter(item => !used.has(item.id) && !selected.some(chosen => chosen.id === item.id) && !blocked.includes(item.id));
      const lastCategory = selected.at(-1)?.category || previousCategory;
      const varied = candidates.filter(item => item.category !== lastCategory);
      if (varied.length) candidates = varied;
      if (!candidates.length && blocked.length) { blocked = blocked.slice(1); continue; }
      if (!candidates.length) candidates = pool.filter(item => !selected.some(chosen => chosen.id === item.id));
      if (!candidates.length) throw new Error('Entre tu y yo: bateria insuficiente');
      selected.push(randomItem(candidates));
    }
    return selected;
  }

  function createGame() {
    const past = history();
    const chosen = new Set();
    const buckets = {
      who: selectQuestions(DATA.who, 2, past.who, chosen),
      bet: selectQuestions(DATA.bet, 2, past.bet, chosen),
      ranking: selectQuestions(DATA.ranking, 4, past.ranking, chosen)
    };
    Object.values(buckets).flat().forEach(item => chosen.add(item.id));
    remember('who', buckets.who.map(item => item.id));
    remember('bet', buckets.bet.map(item => item.id));
    remember('rank', buckets.ranking.map(item => item.id));

    const betStars = shuffle(['javi', 'laura']);
    const inverseTargets = Math.random() < .5 ? ['laura', 'javi'] : ['javi', 'laura'];
    const cursors = { who: 0, bet: 0, ranking: 0, inverse: 0 };
    let inverseIndex = 0;
    const rounds = MECHANICS.map((type, index) => {
      const bucket = type === 'rank' || type === 'inverse' ? 'ranking' : type;
      const item = buckets[bucket][cursors[bucket]++];
      const round = { index, type, item, answers: {}, score: null };
      if (type === 'who' || type === 'rank') round.order = Math.random() < .5 ? ['javi', 'laura'] : ['laura', 'javi'];
      if (type === 'bet') {
        round.protagonist = betStars[cursors.bet - 1];
        round.predictor = other(round.protagonist);
        round.order = [round.predictor, round.protagonist];
      }
      if (type === 'inverse') {
        round.target = inverseTargets[inverseIndex++];
        round.predictor = other(round.target);
        round.order = [round.predictor, round.target];
      }
      return round;
    });
    return { version: 2, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, createdAt: new Date().toISOString(), roundIndex: 0, phase: 'intro', actorIndex: 0, rounds };
  }

  function inject() {
    const hub = $('minigames-hub');
    const grid = hub?.querySelector('.minigames-grid');
    if (!hub || !grid || $('[data-minigame-panel="between-us"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = 'entre-tu-y-yo.css?v=1.0.0'; document.head.appendChild(link);
    grid.insertAdjacentHTML('beforeend', `<button class="minigame-card between-us-hub-card" data-minigame-open="between-us" type="button"><span class="minigame-card-icon">↔</span><span class="minigame-card-copy"><small>Juntos · un solo móvil</small><strong>Entre tú y yo</strong><span>8 rondas para descubrir cuánto os conocéis.</span></span><span class="minigame-card-status">Nuevo</span></button>`);
    const heroCopy = hub.querySelector('.minigames-hero p:last-child');
    const heroBadge = hub.querySelector('.minigames-hero-badge');
    if (heroCopy) heroCopy.textContent = 'Cinco formas distintas de jugar, desde retos diarios hasta partidas para compartir el mismo móvil.';
    if (heroBadge) heroBadge.textContent = '🎮 5 juegos';
    hub.insertAdjacentHTML('afterend', `<section class="minigame-panel between-us-page hidden" data-minigame-panel="between-us"><button class="back-link minigame-back" data-minigame-back type="button">← Volver a Minijuegos</button><div id="between-us-root" aria-live="polite"></div></section>`);
  }

  inject();
  const root = $('between-us-root');
  let game = loadGame();
  let draftOrder = [];
  let introTimer = null;

  function save() { if (game) write(ACTIVE_KEY, game); }
  function current() { return game?.rounds?.[game.roundIndex]; }
  function mechanicLabel(type) { return MECHANIC_META[type].title; }
  function personReady(person) { return person === 'laura' ? 'Estoy lista' : 'Estoy listo'; }
  function optionLabel(round, option) { return round.type === 'who' ? ({ javi: 'Javi', laura: 'Laura', both: 'Los dos' })[option] : option; }
  function personalized(text, round) { return text.replaceAll('{name}', NAMES[round.protagonist || round.target] || ''); }

  function shell(content, showProgress = true) {
    const round = current();
    let progress = '';
    if (showProgress && round) {
      const steps = MECHANICS.map((type, index) => `<span class="${index < game.roundIndex ? 'is-done' : index === game.roundIndex ? 'is-current' : 'is-next'}" aria-label="Ronda ${index + 1}: ${mechanicLabel(type)}"><b>${MECHANIC_META[type].icon}</b></span>`).join('');
      progress = `<header class="between-progress"><div><span>RONDA ${game.roundIndex + 1} DE ${ROUND_COUNT}</span><strong>${mechanicLabel(round.type)}</strong></div><div class="between-progress-steps" aria-label="Progreso de la partida">${steps}</div></header>`;
    }
    root.innerHTML = `<div class="between-shell">${progress}${content}</div>`;
  }

  function renderHome() {
    const resumable = Boolean(loadGame());
    shell(`<section class="between-home"><div class="between-home-mark"><span>J</span><i></i><span>L</span></div><p class="between-kicker">UN JUEGO PARA DOS</p><h2>ENTRE TÚ Y YO</h2><p>8 rondas para descubrir cuánto os conocéis</p><div class="between-facts"><span><b>8</b> rondas</span><span><b>1</b> móvil</span><span><b>8–10</b> min</span></div><div class="between-home-actions">${resumable ? '<button class="btn between-primary" data-between="continue">Continuar partida</button><button class="btn btn-secondary" data-between="new">Empezar una nueva</button>' : '<button class="btn between-primary" data-between="new">Empezar partida</button>'}</div></section>`, false);
  }

  function renderIntro() {
    const round = current();
    const meta = MECHANIC_META[round.type];
    const intro = round.type === 'inverse' ? (round.target === 'laura' ? '¿La tienes calada?' : '¿Lo tienes calado?') : meta.intro;
    shell(`<section class="between-round-intro between-intro-${round.type}"><span class="between-intro-icon">${meta.icon}</span><p>RONDA ${game.roundIndex + 1}</p><h2>${meta.title}</h2><strong>${intro}</strong></section>`);
    const id = game.id, index = game.roundIndex;
    clearTimeout(introTimer);
    introTimer = setTimeout(() => {
      if (!game || game.id !== id || game.roundIndex !== index || game.phase !== 'intro') return;
      game.phase = 'answer'; save(); render();
    }, 900);
  }

  function renderNewConfirmation() {
    shell(`<section class="between-pass"><div class="between-pass-phone">↺</div><p class="between-kicker">PARTIDA EN CURSO</p><h2>¿Empezamos de cero?</h2><p>La partida guardada se sustituirá por una nueva. El historial de preguntas recientes se conservará.</p><div class="between-home-actions"><button class="btn between-primary" data-between="start-new">Sí, nueva partida</button><button class="btn btn-secondary" data-between="continue">Volver a la partida</button></div></section>`, false);
  }

  function renderPass() {
    const round = current();
    const next = round.order[game.actorIndex];
    shell(`<section class="between-pass"><div class="between-pass-phone">↔</div><p class="between-kicker">CAMBIO DE TURNO</p><h2>Pásale el móvil a ${NAMES[next]}</h2><p>No mires todavía. La respuesta anterior ya está guardada.</p><button class="btn between-primary" data-between="ready">${personReady(next)}</button></section>`);
  }

  function renderAnswer() {
    const round = current();
    const actor = round.order[game.actorIndex];
    const isPrediction = round.type === 'bet' && actor === round.predictor || round.type === 'inverse' && actor === round.predictor;
    let instruction = `${NAMES[actor]}, elige tu respuesta`;
    if (round.type === 'bet') instruction = isPrediction ? `${NAMES[actor]}, ¿qué crees que responderá ${NAMES[round.protagonist]}?` : `${NAMES[actor]}, ahora responde de verdad`;
    if (round.type === 'inverse') instruction = isPrediction ? `${NAMES[actor]}, ordénalo como crees que lo hará ${NAMES[round.target]}` : `${NAMES[actor]}, ordénalo según tu gusto real`;
    if (round.type === 'rank') instruction = `${NAMES[actor]}, crea tu orden personal`;
    const prompt = personalized(round.item.prompt, round);
    const sceneClass = `between-scene-${round.type}`;
    if (round.type === 'rank' || round.type === 'inverse') {
      draftOrder = round.item.options.map(option => option.id);
      const prediction = round.type === 'inverse' ? `<div class="between-prediction-banner"><span>🔮</span><strong>${isPrediction ? `Así creo que ${NAMES[round.target]} lo ordenaría` : `${NAMES[round.target]} · ranking real`}</strong></div>` : '';
      shell(`<section class="between-question ${sceneClass}">${prediction}<p class="between-kicker">${round.item.category}</p><h2>${prompt}</h2><p class="between-instruction">${instruction}</p><p class="between-rank-guide">${round.item.direction || '1 = lo que pondrías primero · 5 = lo que pondrías último'}</p><ol class="between-ranking" id="between-ranking"></ol><button class="btn between-primary" data-between="rank-submit">Guardar ranking</button></section>`);
      renderRanking();
      return;
    }
    const choices = round.type === 'who' ? ['javi', 'laura', 'both'] : round.item.options;
    const matchup = round.type === 'bet' ? `<div class="between-bet-matchup"><span>${NAMES[round.predictor]}</span><b>apuesta sobre</b><span>${NAMES[round.protagonist]}</span></div>` : '';
    const optionsClass = round.type === 'who' ? 'between-who-options' : 'between-bet-options';
    const optionMarkup = choices.map(option => {
      const icon = round.type === 'who' ? `<i>${option === 'javi' ? 'J' : option === 'laura' ? 'L' : '♥'}</i>` : '<i>🎯</i>';
      return `<button class="${round.type === 'who' ? `is-${option}` : ''}" type="button" data-between-answer="${option}">${icon}<strong>${optionLabel(round, option)}</strong></button>`;
    }).join('');
    shell(`<section class="between-question ${sceneClass}">${matchup}<p class="between-kicker">${round.item.category}</p><h2>${prompt}</h2><p class="between-instruction">${instruction}</p><div class="between-options ${optionsClass}">${optionMarkup}</div></section>`);
  }

  function renderRanking() {
    const round = current();
    const list = $('between-ranking');
    if (!list) return;
    list.innerHTML = draftOrder.map((id, index) => {
      const option = round.item.options.find(item => item.id === id);
      return `<li draggable="true" data-rank-id="${id}"><span class="between-rank-number">${index + 1}</span><strong>${option.label}</strong><span class="between-rank-actions"><button type="button" data-rank-move="up" aria-label="Subir ${option.label}" ${index === 0 ? 'disabled' : ''}>↑</button><button type="button" data-rank-move="down" aria-label="Bajar ${option.label}" ${index === draftOrder.length - 1 ? 'disabled' : ''}>↓</button></span><span class="between-drag" aria-hidden="true">⠿</span></li>`;
    }).join('');
    let dragged = null;
    list.querySelectorAll('li').forEach(item => {
      item.addEventListener('dragstart', () => { dragged = item.dataset.rankId; item.classList.add('is-dragging'); });
      item.addEventListener('dragend', () => item.classList.remove('is-dragging'));
      item.addEventListener('dragover', event => event.preventDefault());
      item.addEventListener('drop', event => {
        event.preventDefault();
        const target = item.dataset.rankId;
        if (!dragged || dragged === target) return;
        const from = draftOrder.indexOf(dragged), to = draftOrder.indexOf(target);
        draftOrder.splice(to, 0, draftOrder.splice(from, 1)[0]); renderRanking();
      });
    });
  }

  function scoreRound(round) {
    const [first, second] = round.order;
    if (round.type === 'who') {
      const a = round.answers[first], b = round.answers[second];
      round.score = a === b ? 100 : (a === 'both' || b === 'both' ? 50 : 0);
    } else if (round.type === 'bet') round.score = round.answers[round.predictor] === round.answers[round.protagonist] ? 100 : 0;
    else round.score = rankingScore(round.answers[first], round.answers[second]);
  }

  function rankingMessage(score) {
    return score === 100 ? 'Clavados ❤️' : score >= 80 ? 'Casi clavados' : score >= 60 ? 'Muy parecidos' : score >= 35 ? 'Bastantes puntos en común' : 'Aquí pensáis distinto';
  }

  function revealMessage(round) {
    if (round.type === 'who') return round.score === 100 ? randomItem(DATA.messages.match) : round.score === 50 ? randomItem(DATA.messages.close) : randomItem(DATA.messages.opposite);
    if (round.type === 'bet') return round.score === 100 ? randomItem(DATA.messages.hit) : randomItem(DATA.messages.miss);
    return rankingMessage(round.score);
  }

  function renderReveal() {
    const round = current();
    const [first, second] = round.order;
    const ranking = round.type === 'rank' || round.type === 'inverse';
    const answer = person => ranking ? `<ol>${round.answers[person].map(id => `<li>${round.item.options.find(option => option.id === id).label}</li>`).join('')}</ol>` : `<strong>${optionLabel(round, round.answers[person])}</strong>`;
    const labels = round.type === 'bet'
      ? [`Tu apuesta · ${NAMES[first]}`, `Respuesta real · ${NAMES[second]}`]
      : round.type === 'inverse'
        ? [`Predicción · ${NAMES[first]}`, `Ranking real · ${NAMES[second]}`]
        : round.type === 'who'
          ? [`Elección de ${NAMES[first]}`, `Elección de ${NAMES[second]}`]
          : [NAMES[first], NAMES[second]];
    const resultClass = round.score === 100 ? 'is-perfect' : round.score === 0 ? 'is-opposite' : 'is-close';
    shell(`<section class="between-reveal between-reveal-${round.type} ${resultClass}"><div class="between-reveal-icon">${round.score === 100 ? '♥' : round.score >= 50 ? '≈' : '↯'}</div><p class="between-kicker">REVELACIÓN</p><h2>${revealMessage(round)}</h2>${ranking ? `<div class="between-similarity"><strong>${round.score}%</strong><span>de similitud</span></div>` : ''}<div class="between-comparison"><article><span>${labels[0]}</span>${answer(first)}</article><article><span>${labels[1]}</span>${answer(second)}</article></div><button class="btn between-primary" data-between="next">${game.roundIndex === ROUND_COUNT - 1 ? 'Ver nuestra sincronía' : 'Siguiente ronda'}</button></section>`);
  }

  function renderFinal() {
    const scores = game.rounds.map(round => round.score);
    const sync = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    const bets = game.rounds.filter(round => round.type === 'bet');
    const hits = bets.filter(round => round.score === 100).length;
    const best = [...game.rounds.filter(round => round.type === 'rank')].sort((a, b) => b.score - a.score)[0];
    const surprises = game.rounds.filter(round => round.type === 'bet' && round.score === 0 || round.type === 'who' && round.score === 0);
    const surprise = surprises.length ? randomItem(surprises) : null;
    localStorage.removeItem(ACTIVE_KEY);
    shell(`<section class="between-final"><p class="between-kicker">PARTIDA COMPLETADA</p><h2>Sincronía de la partida</h2><div class="between-final-score">${sync}<span>%</span></div><div class="between-final-grid"><article><span>APUESTAS ACERTADAS</span><strong>${hits} de ${bets.length}</strong><p>${hits === 1 ? 'predicción acertada' : 'predicciones acertadas'}</p></article><article><span>MOMENTO MÁS PARECIDO</span><strong>${best.score}%</strong><p>${best.item.prompt}</p></article><article class="between-final-surprise"><span>MAYOR SORPRESA</span><strong>${surprise ? 'Esto pide conversación' : 'Muy bien calados'}</strong><p>${surprise ? personalized(surprise.item.prompt, surprise) : 'Hoy os teníais bastante calados 😏'}</p></article></div><button class="btn between-primary" data-between="again">Otra partida</button></section>`, false);
    game = null;
  }

  function render() {
    if (!game) return renderHome();
    if (game.phase === 'intro') return renderIntro();
    if (game.phase === 'pass') return renderPass();
    if (game.phase === 'reveal') return renderReveal();
    if (game.phase === 'final') return renderFinal();
    renderAnswer();
  }

  function submit(value) {
    const round = current();
    const actor = round.order[game.actorIndex];
    round.answers[actor] = value;
    if (game.actorIndex === 0) { game.actorIndex = 1; game.phase = 'pass'; }
    else { scoreRound(round); game.phase = 'reveal'; }
    save(); render();
  }

  root?.addEventListener('click', event => {
    const action = event.target.closest('[data-between]')?.dataset.between;
    const answer = event.target.closest('[data-between-answer]')?.dataset.betweenAnswer;
    const move = event.target.closest('[data-rank-move]');
    if (answer) return submit(answer);
    if (move) {
      const id = move.closest('[data-rank-id]').dataset.rankId;
      const from = draftOrder.indexOf(id), to = move.dataset.rankMove === 'up' ? from - 1 : from + 1;
      if (to >= 0 && to < draftOrder.length) [draftOrder[from], draftOrder[to]] = [draftOrder[to], draftOrder[from]];
      return renderRanking();
    }
    if (action === 'new' && loadGame()) return renderNewConfirmation();
    if (action === 'new' || action === 'start-new' || action === 'again') { game = createGame(); save(); return render(); }
    if (action === 'continue') { game = loadGame(); return render(); }
    if (action === 'ready') { game.phase = 'answer'; save(); return render(); }
    if (action === 'rank-submit') return submit([...draftOrder]);
    if (action === 'next') {
      if (game.roundIndex === ROUND_COUNT - 1) game.phase = 'final';
      else { game.roundIndex += 1; game.actorIndex = 0; game.phase = 'intro'; }
      save(); return render();
    }
  });

  renderHome();
  window.JaviEatsBetweenUs = { createGame, rankingScore, rankingMessage, keys: { active: ACTIVE_KEY, history: HISTORY_KEY } };
})();
