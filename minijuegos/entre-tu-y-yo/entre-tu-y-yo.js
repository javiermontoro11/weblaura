/* Entre tú y yo · ocho rondas, un móvil, sin servicios externos. */
((host) => {
  'use strict';
  const TYPES = ['bet', 'duel', 'telepathy', 'choose2', 'bet', 'duel', 'telepathy', 'choose2'];
  const PREDICTORS = ['javi', 'laura', 'javi', 'laura', 'laura', 'javi', 'laura', 'javi'];
  const NAMES = { javi: 'Javi', laura: 'Laura' };
  const META = { bet: ['🎯', 'Apuesta por mí'], duel: ['⚡', 'Duelo'], telepathy: ['🔮', 'Telepatía'], choose2: ['✌️', 'Elige 2'] };
  const keys = { active: 'javieats_entre_tu_y_yo_active_v3', history: 'javieats_entre_tu_y_yo_history_v3' };
  const other = name => name === 'javi' ? 'laura' : 'javi';
  const copy = value => JSON.parse(JSON.stringify(value));
  const count = round => round.type === 'choose2' ? 2 : 1;
  const validAnswer = (round, answer) => Array.isArray(answer) && answer.length === count(round) && new Set(answer).size === answer.length && answer.every(id => round.options.includes(id));

  function createGame(data, history = {}, random = Math.random) {
    const used = new Set(), topics = new Set();
    const rounds = TYPES.map((type, index) => {
      let blocked = Array.isArray(history[type]) ? [...history[type]] : [];
      const available = data[type].filter(q => !used.has(q.id) && !topics.has(q.topic));
      if (!available.length) throw new Error('No hay suficientes preguntas diferentes para esta partida.');
      let candidates = available.filter(q => !blocked.includes(q.id));
      while (!candidates.length && blocked.length) { blocked.shift(); candidates = available.filter(q => !blocked.includes(q.id)); }
      const q = candidates[Math.min(candidates.length - 1, Math.max(0, Math.floor(random() * candidates.length)))];
      used.add(q.id); topics.add(q.topic);
      return { type, predictor: PREDICTORS[index], target: other(PREDICTORS[index]), questionId: q.id, topic: q.topic, options: q.options.map(o => o.id), prediction: null, answer: null };
    });
    return { version: 3, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, token: 0, roundIndex: 0, phase: 'ready', rounds };
  }

  function transition(game, action) {
    if (!game || action.token !== game.token || game.phase === 'final') return game;
    const r = game.rounds[game.roundIndex];
    let phase;
    if (action.type === 'ready' && game.phase === 'ready') phase = 'predict';
    if (action.type === 'ready' && game.phase === 'pass') phase = 'answer';
    if (action.type === 'submit' && ['predict', 'answer'].includes(game.phase) && validAnswer(r, action.answer)) phase = game.phase === 'predict' ? 'pass' : 'reveal';
    if (action.type === 'next' && game.phase === 'reveal') phase = game.roundIndex === 7 ? 'final' : 'ready';
    if (!phase) return game;
    const next = copy(game);
    next.token += 1; next.phase = phase;
    if (action.type === 'submit') next.rounds[next.roundIndex][game.phase === 'predict' ? 'prediction' : 'answer'] = [...action.answer];
    if (action.type === 'next' && phase !== 'final') next.roundIndex += 1;
    return next;
  }

  function scoreRound(round) {
    if (!round.prediction || !round.answer || round.type === 'telepathy') return 0;
    const hits = round.prediction.filter(id => round.answer.includes(id)).length;
    return round.type === 'choose2' ? hits : hits * 2;
  }

  function summarize(game) {
    const totals = { javi: 0, laura: 0 }; let telepathy = 0;
    game.rounds.forEach(r => {
      totals[r.predictor] += scoreRound(r);
      if (r.type === 'telepathy' && r.answer && r.prediction?.[0] === r.answer[0]) telepathy += 1;
    });
    return { javi: Math.round(totals.javi / 6 * 100), laura: Math.round(totals.laura / 6 * 100), javiPoints: totals.javi / 2, lauraPoints: totals.laura / 2, winner: totals.javi === totals.laura ? null : totals.javi > totals.laura ? 'javi' : 'laura', telepathy };
  }

  function validateSavedGame(value, data) {
    try {
      if (!value || value.version !== 3 || typeof value.id !== 'string' || !value.id || !Number.isSafeInteger(value.token) || value.token < 0 || !Number.isInteger(value.roundIndex) || value.roundIndex < 0 || value.roundIndex > 7 || !['ready', 'predict', 'pass', 'answer', 'reveal', 'final'].includes(value.phase) || !Array.isArray(value.rounds) || value.rounds.length !== 8) return null;
      if (value.phase === 'final' && value.roundIndex !== 7) return null;
      const ids = new Set(), topics = new Set();
      for (let i = 0; i < 8; i += 1) {
        const r = value.rounds[i], q = data[TYPES[i]].find(item => item.id === r.questionId);
        if (!q || r.type !== TYPES[i] || r.predictor !== PREDICTORS[i] || r.target !== other(PREDICTORS[i]) || r.topic !== q.topic || ids.has(q.id) || topics.has(q.topic) || JSON.stringify(r.options) !== JSON.stringify(q.options.map(o => o.id))) return null;
        ids.add(q.id); topics.add(q.topic);
        const completed = i < value.roundIndex || (i === value.roundIndex && ['reveal', 'final'].includes(value.phase));
        const predicted = completed || (i === value.roundIndex && ['pass', 'answer'].includes(value.phase));
        if (predicted ? !validAnswer(r, r.prediction) : r.prediction !== null) return null;
        if (completed ? !validAnswer(r, r.answer) : r.answer !== null) return null;
      }
      return copy(value);
    } catch (_) { return null; }
  }

  function remember(history, rounds) {
    const result = {};
    for (const type of Object.keys(META)) result[type] = Array.isArray(history?.[type]) ? history[type].filter(id => typeof id === 'string') : [];
    for (const r of rounds) result[r.type] = [...result[r.type].filter(id => id !== r.questionId), r.questionId].slice(-100);
    return result;
  }

  const engine = { createGame, transition, scoreRound, summarize, validateSavedGame, remember, keys };
  if (typeof module === 'object' && module.exports) module.exports = engine;
  if (!host || host.JaviEatsBetweenUs) return;
  host.JaviEatsBetweenUs = engine;
  const DATA = host.JAVIEATS_BETWEEN_US;
  const hub = document.getElementById('minigames-hub'), grid = hub?.querySelector('.minigames-grid');
  if (!DATA || !grid || document.querySelector('[data-minigame-panel="between-us"]')) return;
  const esc = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const art = (index, cls = '') => `<span aria-hidden="true" class="ety-art ${cls}" style="--art-x:${(index % 4) * 100 / 3}%;--art-y:${Math.floor(index / 4) * 50}%"></span>`;
  const avatar = person => `<span aria-hidden="true" class="ety-avatar ety-${person}">${person === 'javi' ? 'J' : 'L'}</span>`;
  const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'minijuegos/entre-tu-y-yo/entre-tu-y-yo.css?v=3.0.1-viewport'; document.head.appendChild(link);
  grid.insertAdjacentHTML('beforeend', `<button class="minigame-card between-us-hub-card" data-minigame-open="between-us" type="button">${art(10)}<span class="minigame-card-copy"><small>Juntos · un solo móvil</small><strong>Entre tú y yo</strong><span>¿Quién conoce mejor al otro?</span><em>8 rondas · muchas miradas cómplices</em></span><span class="ety-hub-arrow" aria-hidden="true">↗</span></button>`);
  const hubBadge = hub.querySelector('.minigames-hero-badge');
  const hubCopy = hub.querySelector('.minigames-hero p:last-child');
  if (hubBadge) hubBadge.textContent = '🎮 5 juegos';
  if (hubCopy) hubCopy.textContent = 'Cinco formas de jugar: retos diarios y partidas para compartir el mismo móvil.';
  hub.insertAdjacentHTML('afterend', '<section class="minigame-panel between-us-page hidden" data-minigame-panel="between-us"><button class="back-link minigame-back" data-minigame-back type="button">← Minijuegos</button><div id="between-us-root"></div></section>');
  const root = document.getElementById('between-us-root');
  const panel = root.parentElement;
  const gamePage = panel.closest('.page'), appScreen = panel.closest('.screen');
  const appHeader = document.querySelector('.v3-header, .app-header');
  const appNav = document.querySelector('.bottom-nav');
  let layoutFrame = 0;
  function layoutViewport() {
    layoutFrame = 0;
    const active = !panel.classList.contains('hidden') && (!gamePage || gamePage.classList.contains('active')) && (!appScreen || !appScreen.classList.contains('hidden'));
    const wasActive = panel.classList.contains('ety-viewport');
    panel.classList.toggle('ety-viewport', active);
    document.documentElement.classList.toggle('ety-playing', active);
    document.body.classList.toggle('ety-playing', active);
    if (!active) return;
    if (!wasActive) window.scrollTo({ top: 0, behavior: 'instant' });
    const viewport = window.visualViewport;
    const visibleTop = viewport?.offsetTop || 0;
    const visibleBottom = visibleTop + (viewport?.height || window.innerHeight);
    const headerBottom = appHeader?.getBoundingClientRect().bottom || visibleTop;
    const navTop = appNav?.getClientRects().length ? appNav.getBoundingClientRect().top : visibleBottom;
    const top = Math.max(visibleTop, headerBottom) + 4;
    panel.style.setProperty('--ety-viewport-top', `${top}px`);
    panel.style.setProperty('--ety-viewport-height', `${Math.max(0, Math.min(visibleBottom, navTop) - top - 8)}px`);
    root.dataset.overflow = 'false';
    const scroller = root.querySelector('.ety-scroll');
    if (scroller) root.dataset.overflow = String(scroller.scrollHeight > scroller.clientHeight + 1);
  }
  function queueLayout() { if (!layoutFrame) layoutFrame = requestAnimationFrame(layoutViewport); }
  const layoutObserver = new MutationObserver(queueLayout);
  for (const element of [panel, gamePage, appScreen]) if (element) layoutObserver.observe(element, { attributes: true, attributeFilter: ['class'] });
  if (window.ResizeObserver) {
    const sizeObserver = new ResizeObserver(queueLayout);
    for (const element of [appHeader, appNav]) if (element) sizeObserver.observe(element);
  }
  window.addEventListener('resize', queueLayout);
  window.visualViewport?.addEventListener('resize', queueLayout);
  window.visualViewport?.addEventListener('scroll', queueLayout);
  link.addEventListener('load', queueLayout);
  document.fonts?.ready.then(queueLayout);
  let notice = '', draft = [], home = true, confirming = false;
  function read(key, fallback) { try { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); } catch (_) { notice = 'No podemos recuperar lo guardado. Puedes jugar una partida nueva.'; return fallback; } }
  function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { notice = 'Puedes jugar, pero este móvil no permite guardar la partida. No cierres esta pantalla.'; } }
  const raw = read(keys.active, null);
  let game = validateSavedGame(raw, DATA);
  if (raw && !game) notice = 'La partida guardada no se puede recuperar. Empezamos otra cuando quieras.';
  let history = read(keys.history, {});
  if (!history || typeof history !== 'object') history = {};
  function save() { if (game) write(keys.active, game); }
  function protect() { if (game?.phase === 'predict' || game?.phase === 'answer') { game = { ...game, phase: game.phase === 'predict' ? 'ready' : 'pass', token: game.token + 1 }; save(); } draft = []; }
  protect();
  const button = (label, action, extra = '') => `<button type="button" class="ety-button" data-ety="${action}" data-token="${game?.token ?? 0}" ${extra}>${label}</button>`;
  const footer = text => `<p class="ety-signature">${text} <span aria-hidden="true">♡</span></p>`;
  function header(r) {
    return `<header class="ety-round-header"><div class="ety-progress" aria-label="Ronda ${game.roundIndex + 1} de 8">${TYPES.map((_, i) => `<i class="${i <= game.roundIndex ? 'is-done' : ''}"></i>`).join('')}</div><small>RONDA ${game.roundIndex + 1} / 8</small><p>${META[r.type][1]}</p></header>`;
  }
  function roleStrip(r) { return `<div class="ety-role">${avatar(game.phase === 'answer' ? r.target : r.predictor)}<strong>${NAMES[r.predictor]} <span aria-hidden="true">→</span> ${NAMES[r.target]}</strong><span class="ety-heart" aria-hidden="true">♡</span></div>`; }
  function homeView() {
    return `<div class="ety-home"><div class="ety-brand">JAVIEATS <span>·</span> SOLO VOSOTROS</div><div class="ety-home-art">${art(10)}<span class="ety-spark spark-one">✦</span><span class="ety-spark spark-two">✧</span>${avatar('javi')}${avatar('laura')}</div><span class="ety-label">PEQUEÑAS PREGUNTAS. GRANDES NOSOTROS.</span><h1>Entre tú<br>y yo<span class="ety-dot">.</span></h1><p class="ety-lead">¿Quién conoce<br><strong>mejor al otro?</strong></p><p>Gustos, manías y un poquito de intuición.<br>Ocho rondas para descubrirlo juntos.</p><div class="ety-home-badges"><span>🏆 Mejor novio/a</span><span>🔮 Vuestra conexión</span></div><div class="ety-mechanics">${Object.values(META).map(([icon, title]) => `<span><b>${icon}</b>${title}</span>`).join('')}</div>${game ? button(game.phase === 'final' ? 'Ver vuestro resultado' : 'Continuar partida', 'continue') : button('Vamos a descubrirlo <span aria-hidden="true">↗</span>', 'new')}${game ? '<button type="button" class="ety-text-button" data-ety="new">Empezar otra partida</button>' : ''}<small class="ety-home-note">Javi y Laura · Un móvil · Sin prisas</small>${footer('Tú y yo siempre sabe mejor')}</div>`;
  }
  function coverView(r) {
    const person = game.phase === 'pass' ? r.target : r.predictor;
    return `${header(r)}<div class="ety-cover">${art(11)}<span class="ety-label">UN MOMENTO SOLO PARA TI</span><h1>${game.phase === 'pass' ? 'Pasa el móvil<br>a ' : 'Empieza '}${NAMES[person]}<span class="ety-dot">.</span></h1><div class="ety-cover-avatar">${avatar(person)}</div><p>${game.phase === 'pass' ? `${NAMES[r.predictor]} ya ha elegido.<br>Ahora responde tú, sin pistas.` : `Vas a intentar acertar a ${NAMES[r.target]}.<br>${NAMES[r.target]}, ahora no mires.`}</p>${button(`Soy ${NAMES[person]}, ${person === 'laura' ? 'lista' : 'listo'}`, 'ready')}${footer('Hay cosas que solo tú sabes')}</div>`;
  }
  const artMap = { sushi: 0, pizza: 1, burger: 2, hamburguesa: 2, paella: 3, atracciones: 4, 'parque-atracciones': 4, concierto: 5, spa: 6, 'spa-masaje': 6, senderismo: 7, museo: 8 };
  function optionVisual(o) { return Object.hasOwn(artMap, o.id) ? art(artMap[o.id]) : `<span aria-hidden="true" class="ety-emoji">${esc(o.emoji)}</span>`; }
  function optionsView(r, q) {
    return `<div class="ety-options ety-options-${r.type}">${q.options.map((o, i) => `<button type="button" class="ety-option ety-color-${i} ${draft.includes(o.id) ? 'is-selected' : ''}" data-choice="${esc(o.id)}" data-token="${game.token}" ${r.type === 'choose2' ? `aria-pressed="${draft.includes(o.id)}"` : ''} aria-label="${esc(o.label)}">${optionVisual(o)}<span class="ety-option-label">${esc(o.label)}</span>${r.type === 'choose2' ? `<span class="ety-check" aria-hidden="true">${draft.includes(o.id) ? '✓' : '+'}</span>` : ''}</button>`).join('')}${r.type === 'duel' ? '<span class="ety-versus" aria-hidden="true">O</span>' : ''}</div>`;
  }
  function answerView(r, q) {
    const self = game.phase === 'answer', name = NAMES[self ? r.target : r.predictor];
    if (r.type === 'telepathy') return `${header(r)}<div class="ety-orbit" aria-hidden="true"><i></i><i></i>${avatar('javi')}<span>♥</span>${avatar('laura')}<b>✦</b><b>✧</b></div><div class="ety-telepathy-copy"><h1>No pienses<br>demasiado.</h1><p>${name}, ${self ? 'elige un emoji.' : `¿cuál elegirá ${NAMES[r.target]}?`}</p></div>${optionsView(r, q)}${footer('Un instante de intuición')}`;
    return `${header(r)}${roleStrip(r)}<div class="ety-question"><div class="ety-question-meta"><span class="ety-label">${self ? `${name}, tu respuesta` : `${name}, ${r.type === 'choose2' ? 'elige DOS sí o sí' : 'intenta acertar'}`}</span>${r.type === 'choose2' ? `<span class="ety-counter" role="status">${draft.length} de 2</span>` : ''}</div><h1>${esc(self ? q.prompt : q.prediction.replace('{name}', NAMES[r.target]))}</h1></div>${optionsView(r, q)}${r.type === 'choose2' ? '' : `<p class="ety-hint">${self ? 'Elige la que más va contigo.' : `Acierta lo que responderá ${NAMES[r.target]}.`}</p>`}${footer(r.type === 'duel' ? 'Dos opciones. Tú lo tienes claro.' : 'Tú y yo siempre sabe mejor')}`;
  }
  function chosen(q, ids) { return ids.map(id => { const o = q.options.find(item => item.id === id); return `<span class="ety-chosen">${optionVisual(o)}<strong>${esc(o.label)}</strong></span>`; }).join(''); }
  function revealView(r, q) {
    const hits = r.prediction.filter(id => r.answer.includes(id)).length;
    const full = hits === count(r), partial = hits > 0 && !full;
    const title = r.type === 'telepathy' ? full ? '¡TELEPATÍA!' : 'Cada uno en su órbita' : full ? '¡Lo tenías clarísimo!' : partial ? '¡Una de dos!' : 'Hoy te ha sorprendido';
    return `${header(r)}<div class="ety-reveal"><span class="ety-reveal-symbol" aria-hidden="true">${full ? '✨' : partial ? '✌️' : '🙃'}</span><span class="ety-label">EL MOMENTO DE LA VERDAD</span><h1>${title}</h1><p>${r.type === 'telepathy' ? 'Intuición compartida. Sin puntos de conocimiento.' : full ? `${NAMES[r.predictor]}, le tienes muy calado.` : 'Una cosa más que ya sabéis del otro.'}</p><div class="ety-comparison"><article><small>${NAMES[r.predictor]} imaginaba</small>${chosen(q, r.prediction)}</article><article><small>${NAMES[r.target]} eligió</small>${chosen(q, r.answer)}</article></div><div class="ety-points">${r.type === 'telepathy' ? full ? '🔮 Una coincidencia más' : '🔮 La próxima puede ser vuestra' : `<b>+${String(scoreRound(r) / 2).replace('.', ',')}</b> para ${NAMES[r.predictor]} · Te conozco`}</div>${button(game.roundIndex === 7 ? 'Ver nuestro resultado ✨' : 'Siguiente ronda →', 'next')}${footer('Lo bueno es descubrirnos')}</div>`;
  }
  function finalView() {
    const s = summarize(game);
    return `<div class="ety-final"><span class="ety-label">ASÍ HA IDO LA PARTIDA</span><div class="ety-winner-art">${art(9)}<span class="ety-winner-medal">${s.winner ? NAMES[s.winner][0] : 'J+L'}</span><span class="ety-confetti" aria-hidden="true">✦　♡　✧</span></div><h1>${s.winner ? `Hoy gana ${NAMES[s.winner]}` : 'Hoy ganáis los dos'}</h1><p class="ety-winner-subtitle">${s.winner ? `Mejor ${s.winner === 'javi' ? 'novio' : 'novia'} de la partida` : 'El título de mejor pareja es compartido'}.</p><div class="ety-scores">${['javi', 'laura'].map(p => `<article class="ety-score-${p}"><h2>${NAMES[p]} conoce a ${NAMES[other(p)]}</h2><strong>${s[p]}%</strong><small>${String(s[`${p}Points`]).replace('.', ',')} de 3 puntos</small><span aria-hidden="true">♥</span></article>`).join('')}</div><div class="ety-connection"><span aria-hidden="true">🔮</span><div><strong>Vuestra conexión</strong><span>Telepatía · ${s.telepathy} de 2 coincidencias</span></div></div><p class="ety-fineprint">El título lo deciden vuestros aciertos sobre el otro.<br>La telepatía tiene su propia magia.</p>${button('Otra partida', 'again')}${footer('Gracias por seguir eligiéndonos')}<div class="ety-brand">JAVIEATS</div></div>`;
  }
  function render(focus = true) {
    const previousScroll = root.querySelector('.ety-scroll')?.scrollTop || 0;
    const r = game?.rounds[game.roundIndex], q = r && DATA[r.type].find(item => item.id === r.questionId);
    const dark = !home && !confirming && r?.type === 'telepathy' && ['predict', 'answer'].includes(game.phase);
    const choosing = !home && !confirming && game && ['predict', 'answer'].includes(game.phase);
    root.className = `ety-scene${dark ? ' ety-night' : ''}`;
    root.dataset.view = confirming ? 'confirm' : home || !game ? 'home' : game.phase;
    root.dataset.type = choosing ? r.type : '';
    let content;
    if (confirming) content = `<div class="ety-cover">${art(10)}<h1>¿Otra partida?</h1><p>La partida actual se sustituirá por una nueva.</p>${button('Sí, empezar otra', 'restart')}<button type="button" class="ety-text-button" data-ety="cancel">Volver a mi partida</button></div>`;
    else if (home || !game) content = homeView();
    else if (game.phase === 'final') content = finalView();
    else if (['ready', 'pass'].includes(game.phase)) content = coverView(r);
    else if (game.phase === 'reveal') content = revealView(r, q);
    else content = answerView(r, q);
    root.innerHTML = `<div class="ety-scroll">${notice ? `<p class="ety-notice" role="status">${esc(notice)}</p>` : ''}${content}</div>${choosing && r.type === 'choose2' ? `<div class="ety-actions"><p class="ety-scroll-help">Desliza para ver todas las opciones ↕</p>${button('Confirmar las dos', 'confirm', draft.length !== 2 ? 'disabled' : '')}</div>` : ''}`;
    root.querySelector('.ety-scroll').scrollTop = focus ? 0 : previousScroll;
    if (focus) { const heading = root.querySelector('h1'); if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); } }
    queueLayout();
  }
  function start() {
    try { game = createGame(DATA, history); history = remember(history, game.rounds); write(keys.history, history); save(); home = false; confirming = false; draft = []; render(); }
    catch (error) { notice = error.message; render(); }
  }
  root.addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target || !root.contains(target) || target.disabled) return;
    const action = target.dataset.ety;
    if (action === 'new' || action === 'again') { if (game && game.phase !== 'final') { confirming = true; render(); } else start(); return; }
    if (action === 'restart') return start();
    if (action === 'cancel') { confirming = false; render(); return; }
    if (action === 'continue') { home = false; protect(); render(); return; }
    if (!game || home || confirming || Number(target.dataset.token) !== game.token) return;
    const r = game.rounds[game.roundIndex];
    if (target.dataset.choice && ['predict', 'answer'].includes(game.phase)) {
      if (r.type === 'choose2') {
        const choice = target.dataset.choice;
        draft = draft.includes(choice) ? draft.filter(id => id !== choice) : draft.length < 2 ? [...draft, choice] : draft;
        render(false); root.querySelector(`[data-choice="${CSS.escape(choice)}"]`)?.focus({ preventScroll: true });
        return;
      }
      dispatch('submit', [target.dataset.choice]);
    } else if (action === 'confirm') dispatch('submit', draft);
    else if (['ready', 'next'].includes(action)) dispatch(action);
  });
  function dispatch(type, answer) { const next = transition(game, { type, answer, token: game.token }); if (next !== game) { game = next; draft = []; save(); render(); } }
  // Cover private answers on reopening, tab switching or reloading; no timers.
  new MutationObserver(() => { if (panel.classList.contains('hidden')) { protect(); home = true; confirming = false; render(false); } }).observe(panel, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', () => { if (document.hidden) { protect(); if (!home) render(false); } });
  render(false);
})(typeof window === 'object' ? window : null);