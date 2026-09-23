/* Nuestro 24: the server authorizes every edition. No local clock/profile bypass. */
(function (root) {
  'use strict';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function validDay(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return false;
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value;
  }
  function monthsTogether(day) {
    if (!validDay(day)) return null;
    const [year, month] = day.split('-').map(Number);
    return (year - 2026) * 12 + month - 4;
  }
  function canShowHero(value) { return value?.show_hero === true && validDay(value?.event?.event_date); }
  function serverTimeAt(iso, receivedAt, currentAt) { return Date.parse(iso) + Math.max(0, currentAt - receivedAt); }
  function dateLabel(day, options = {day:'numeric',month:'long'}) {
    if (!validDay(day)) return '';
    return new Intl.DateTimeFormat('es-ES', {timeZone:'Europe/Madrid',...options}).format(new Date(`${day}T12:00:00Z`));
  }
  function renderLetter(text) {
    if (!String(text || '').trim()) return '';
    return String(text).split(/\r?\n\r?\n/).map(p => `<p>${esc(p).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\r?\n/g,'<br>')}</p>`).join('');
  }
  function renderMetrics(metrics) {
    const visible = (Array.isArray(metrics) ? metrics : []).filter(m => Number.isSafeInteger(m?.value) && m.value > 0).slice(0,3);
    if (!visible.length) return '';
    return `<section class="n24-section" aria-labelledby="n24-stats-heading"><p class="n24-kicker">Lo que hemos ido guardando</p><h2 id="n24-stats-heading">Este mes en JaviEats</h2><div class="n24-metrics">${visible.map(m => `<div><strong>${m.value}</strong><span>${esc(m.label)}</span></div>`).join('')}</div></section>`;
  }
  function renderLetterSection(text) {
    if (!String(text || '').trim()) return '';
    return `<section class="n24-letter-invitation"><span class="n24-seal" aria-hidden="true">J + L</span><p class="n24-kicker">Y ahora s\u00ed\u2026</p><h2>Hay algo que Javi<br>quer\u00eda decirte.</h2><button class="n24-button" type="button" data-n24-letter aria-controls="n24-letter" aria-expanded="false">Abrir mi carta \u2764\ufe0f</button></section><section class="n24-letter" id="n24-letter" hidden aria-label="Carta de Javi"><div class="n24-letter-paper" tabindex="-1">${renderLetter(text)}</div></section>`;
  }
  const helpers = {monthsTogether,canShowHero,renderLetter,renderMetrics,renderLetterSection,serverTimeAt};
  if (typeof module === 'object' && module.exports) { module.exports = helpers; return; }
  if (!root?.document || root.JaviEatsNuestro24) return;
  const $ = id => document.getElementById(id);
  const app = () => root.JaviEatsApp;
  const now = () => performance.now();
  const signed = new Map();
  const heroAssets = new Map();
  let userId = null, epoch = 0, response = null, receivedAt = 0, lastFetch = -Infinity;
  let inFlight = null, timer = null, mounted = false, opening = false, previousFocus = null;
  let assetsFetchedFor = null, entryTimer = null;
  let returnPage = 'home';

  function clearPrivateView() {
    epoch += 1; userId = null; response = null; signed.clear(); heroAssets.clear(); inFlight = null;
    opening = false; lastFetch = -Infinity; assetsFetchedFor = null;
    clearTimeout(timer); clearTimeout(entryTimer);
    $('n24-home')?.remove();
    $('n24-entry')?.remove();
    closePhoto();
    const page = $('page-nuestro24');
    if (page?.classList.contains('active')) app()?.showPage?.('home');
    if (page) page.innerHTML = '';
    document.body.classList.remove('n24-day', 'n24-replay');
  }
  function context() {
    const id = app()?.getUser?.()?.id;
    const client = app()?.getClient?.();
    if (!id || !client || !app()?.isReady?.()) { if (userId) clearPrivateView(); return null; }
    if (id !== userId) { clearPrivateView(); userId = id; }
    return {id,client,epoch};
  }
  function isCurrent(ctx) { return epoch === ctx.epoch && userId === ctx.id && app()?.getUser?.()?.id === ctx.id; }
  function heroActive() {
    if (!canShowHero(response) || !userId) return false;
    return !response.expires_at || serverTimeAt(response.server_now, receivedAt, now()) < Date.parse(response.expires_at);
  }
  function theme() {
    document.body.classList.toggle('n24-day', heroActive());
    const replay = Boolean(userId && $('page-nuestro24')?.classList.contains('active'));
    document.body.classList.toggle('n24-replay', replay);
    if (!replay) closePhoto();
  }
  function photoMarkup(path, alt, className, eager = false) {
    const url = signed.get(path)?.url;
    return url ? `<img class="${className}" data-n24-image="${esc(path)}" src="${esc(url)}" alt="${esc(alt)}" loading="${eager?'eager':'lazy'}" decoding="async" referrerpolicy="no-referrer">` : '';
  }
  async function signPhotos(ctx, edition) {
    const paths = [...new Set([edition?.hero_path,...(edition?.memories || []).map(m => m.photo_path),...(edition?.moments || []).map(m => m.photo_path)].filter(p => typeof p === 'string' && p))];
    const missing = paths.filter(path => !signed.has(path) || signed.get(path).expires < now());
    if (!missing.length) return;
    try {
      const {data,error} = await ctx.client.storage.from('recuerdos').createSignedUrls(missing,3600);
      if (!isCurrent(ctx)) return;
      if (error) return;
      (data || []).forEach((item,index) => {
        if (item?.signedUrl && /^https:\/\//.test(item.signedUrl)) signed.set(item.path || missing[index],{url:item.signedUrl,expires:now()+55*60*1000});
      });
      document.querySelectorAll('[data-n24-image]').forEach(img => {
        const url = signed.get(img.dataset.n24Image)?.url;
        if (url && img.src !== url) { img.hidden = false; img.src = url; }
      });
    } catch (_) { /* Missing photos must never prevent reading the month or letter. */ }
  }
  async function fetchHeroAssets(ctx,eventDate) {
    if (!ctx || !validDay(eventDate)) return;
    const cacheKey = `${ctx.id}|${eventDate}`;
    if (assetsFetchedFor === cacheKey) return;
    heroAssets.clear();
    try {
      const {data,error} = await ctx.client.rpc('obtener_nuestro24_assets',{p_event_date:eventDate});
      if (!isCurrent(ctx)) return;
      if (error || data?.allowed !== true || data?.event_date !== eventDate) return;
      const assets = data.assets && typeof data.assets === 'object' ? data.assets : {};
      Object.entries(assets).forEach(([key,url]) => {
        const allowedKey = key === 'ramo-izquierda' ||
          key === 'ramo-derecha' ||
          /^moment-\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(key);
        if (
          allowedKey &&
          typeof url === 'string' &&
          /^data:image\/webp;base64,[A-Za-z0-9+/=]+$/.test(url) &&
          url.length < 100000
        ) heroAssets.set(key,url);
      });
      assetsFetchedFor = cacheKey;
    } catch (_) { /* Private assets are optional decoration, never a content gate. */ }
  }
  function heroSide(key, className, alt) {
    const url = heroAssets.get(key);
    return url ? `<img class="n24-hero-side ${className}" src="${esc(url)}" alt="${esc(alt)}" decoding="async">` : '';
  }
  function entrySeenKey(eventDate) {
    return `n24:intro:${eventDate}:${userId || 'unknown'}`;
  }
  function maybeShowEntry(edition) {
    if (!heroActive() || !edition?.event_date || $('n24-entry')) return;
    let alreadySeen = false;
    try { alreadySeen = sessionStorage.getItem(entrySeenKey(edition.event_date)) === '1'; } catch (_) {}
    if (alreadySeen) return;
    try { sessionStorage.setItem(entrySeenKey(edition.event_date),'1'); } catch (_) {}
    const centre = signed.get(edition.hero_path)?.url || '';
    const left = heroAssets.get('ramo-izquierda') || '';
    const right = heroAssets.get('ramo-derecha') || '';
    const overlay = document.createElement('div');
    overlay.id = 'n24-entry';
    overlay.className = 'n24-entry';
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML = `<div class="n24-entry-stage">
      <div class="n24-entry-pane n24-entry-left">${left?`<img src="${esc(left)}" alt="">`:''}</div>
      <div class="n24-entry-pane n24-entry-centre">${centre?`<img src="${esc(centre)}" alt="">`:''}</div>
      <div class="n24-entry-pane n24-entry-right">${right?`<img src="${esc(right)}" alt="">`:''}</div>
      <div class="n24-entry-shade"></div>
      <div class="n24-entry-copy"><small>JAVI + LAURA</small><strong>Otro 24 contigo.</strong><span>Y queriéndonos cada vez más.</span></div>
      <div class="n24-entry-heart">♥</div>
    </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(()=>requestAnimationFrame(()=>overlay.classList.add('is-ready')));
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    entryTimer = setTimeout(()=>{
      overlay.classList.add('is-leaving');
      entryTimer = setTimeout(()=>overlay.remove(),reduced?350:700);
    },reduced?800:2450);
  }
  function renderHome() {
    const home = $('page-home');
    if (!home) return;
    if (!heroActive()) { $('n24-home')?.remove(); $('n24-entry')?.remove(); theme(); return; }
    const e = response.event;
    let hero = $('n24-home');
    if (!hero) { hero = document.createElement('section'); hero.id='n24-home'; hero.className='n24-home'; home.prepend(hero); }
    const centre = photoMarkup(e.hero_path,'Javi y Laura','n24-hero-photo n24-hero-centre',true);
    const left = heroSide('ramo-izquierda','n24-hero-left','Ramo de flores');
    const right = heroSide('ramo-derecha','n24-hero-right','Ramo de flores');
    const signature = [e.event_date,e.hero_path,Boolean(left),Boolean(right),response.preview].join('|');
    if (hero.dataset.signature !== signature) {
      hero.dataset.signature = signature;
      hero.innerHTML = `<div class="n24-hero-media" aria-hidden="true"><div class="n24-hero-panel n24-hero-panel-left">${left}</div><div class="n24-hero-panel n24-hero-panel-centre">${centre}</div><div class="n24-hero-panel n24-hero-panel-right">${right}</div></div><div class="n24-hero-ambient" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><div class="n24-hero-shade"></div><div class="n24-hero-copy"><p class="n24-hero-date">${esc(dateLabel(e.event_date))} \u00b7 ${monthsTogether(e.event_date)} meses juntos</p><h2>Otro 24 contigo.<span>Y queri\u00e9ndonos cada vez m\u00e1s.</span></h2><button class="n24-button n24-button-light" type="button" data-n24-open>Ver nuestro mes \u2192</button>${response.preview && app()?.getRole?.()==='javi'?'<small class="n24-preview-tag">Vista anticipada \u00b7 Solo para Javi</small>':''}</div>`;
    }
    theme();
  }
  function schedule() {
    clearTimeout(timer);
    if (!response || !userId) return;
    const at = serverTimeAt(response.server_now,receivedAt,now());
    const boundary = Date.parse(response.next_check_at);
    const delay = Number.isFinite(boundary) ? Math.max(200,Math.min(60000,boundary-at+150)) : 60000;
    timer = setTimeout(() => {
      renderHome();
      if (document.visibilityState === 'hidden') return;
      void refresh(true);
    },delay);
  }
  async function refresh(force = false) {
    const ctx = context();
    if (!ctx) return;
    mount(); renderHome();
    if (inFlight) return inFlight;
    if (!force && now()-lastFetch<30000) return;
    const task = (async () => {
      try {
        const {data,error} = await ctx.client.rpc('obtener_nuestro24');
        if (!isCurrent(ctx)) return;
        if (error) throw error;
        const previouslyActive = heroActive();
        response = data; receivedAt = now(); lastFetch = now();
        await Promise.all([signPhotos(ctx,data?.event),fetchHeroAssets(ctx,data?.event?.event_date)]);
        if (!isCurrent(ctx)) return;
        renderHome(); maybeShowEntry(data?.event); schedule();
        if (previouslyActive && !heroActive()) void app()?.refresh?.({silent:true,reason:'nuestro24-archive'});
      } catch (_) {
        if (!isCurrent(ctx)) return;
        lastFetch = now(); renderHome();
        timer = setTimeout(() => { if (document.visibilityState!=='hidden') void refresh(true); },30000);
      }
    })();
    inFlight=task;
    try { await task; } finally { if (inFlight===task) inFlight=null; }
  }
  function privateMomentPhoto(moment) {
    const url = moment?.asset_key ? heroAssets.get(moment.asset_key) : '';
    if (!url) return '';
    return `<img class="n24-scene-photo n24-scene-photo-private" src="${esc(url)}" alt="${esc(moment.title || 'Momento de septiembre')}" loading="lazy" decoding="async">`;
  }
  function homeIllustration() {
    return '<div class="n24-scene-art n24-illustration n24-illustration-home" aria-hidden="true"><svg viewBox="0 0 320 220" role="presentation"><circle class="n24-i-moon" cx="248" cy="48" r="27" fill="#FFF0CF"/><g class="n24-i-house"><path d="M93 118L160 61l67 57v77H93z" fill="#F4E7DC"/><path d="M82 119l78-67 78 67-12 14-66-56-66 56z" fill="#815B68"/><rect x="111" y="137" width="30" height="31" rx="5" fill="#FFD894"/><rect x="176" y="145" width="29" height="50" rx="5" fill="#715360"/></g><path class="n24-i-heart" d="M241 137c-8-10-25 2-11 15l11 10 11-10c14-13-3-25-11-15z" fill="#F3A7B0"/></svg></div>';
  }
  function flowersIllustration() {
    return '<div class="n24-scene-art n24-illustration n24-illustration-flowers" aria-hidden="true"><svg viewBox="0 0 320 220" role="presentation"><g stroke="#6F8D61" stroke-width="5" stroke-linecap="round" fill="none"><path class="n24-i-stem s1" d="M106 190L101 119"/><path class="n24-i-stem s2" d="M160 194L160 101"/><path class="n24-i-stem s3" d="M214 190L221 121"/></g><g class="n24-i-flower f1" transform="translate(101 111)"><g fill="#F4CE4B"><ellipse rx="13" ry="24" transform="rotate(0) translate(0 -15)"/><ellipse rx="13" ry="24" transform="rotate(60) translate(0 -15)"/><ellipse rx="13" ry="24" transform="rotate(120) translate(0 -15)"/></g><circle r="10" fill="#B47A24"/></g><g class="n24-i-flower f2" transform="translate(160 93)"><g fill="#F6D85F"><ellipse rx="14" ry="26" transform="rotate(0) translate(0 -16)"/><ellipse rx="14" ry="26" transform="rotate(60) translate(0 -16)"/><ellipse rx="14" ry="26" transform="rotate(120) translate(0 -16)"/></g><circle r="11" fill="#AE7521"/></g><g class="n24-i-flower f3" transform="translate(221 113)"><g fill="#F3C844"><ellipse rx="12" ry="23" transform="rotate(0) translate(0 -14)"/><ellipse rx="12" ry="23" transform="rotate(60) translate(0 -14)"/><ellipse rx="12" ry="23" transform="rotate(120) translate(0 -14)"/></g><circle r="9" fill="#B47A24"/></g><path class="n24-i-flower-heart" d="M160 45c-7-9-21 1-10 13l10 9 10-9c11-12-3-22-10-13z" fill="#D4A326"/></svg></div>';
  }
  function bowlingIllustration() {
    return '<div class="n24-scene-art n24-illustration n24-illustration-bowling" aria-hidden="true"><svg viewBox="0 0 320 220" role="presentation"><g class="n24-i-pins" transform="translate(176 62)"><g transform="translate(0 15)"><path d="M14 0c8 0 12 7 10 17-1 8-7 14-7 24 0 8 7 14 7 25 0 13-9 20-24 20s-24-7-24-20c0-11 7-17 7-25 0-10-6-16-7-24C-26 7-22 0-14 0z" transform="translate(18)" fill="#FFFDF8"/><rect x="6" y="20" width="24" height="7" rx="3.5" fill="#D97D88"/></g><g transform="translate(44 0) scale(.92)"><path d="M14 0c8 0 12 7 10 17-1 8-7 14-7 24 0 8 7 14 7 25 0 13-9 20-24 20s-24-7-24-20c0-11 7-17 7-25 0-10-6-16-7-24C-26 7-22 0-14 0z" transform="translate(18)" fill="#FFFDF8"/><rect x="6" y="20" width="24" height="7" rx="3.5" fill="#D97D88"/></g><g transform="translate(88 15)"><path d="M14 0c8 0 12 7 10 17-1 8-7 14-7 24 0 8 7 14 7 25 0 13-9 20-24 20s-24-7-24-20c0-11 7-17 7-25 0-10-6-16-7-24C-26 7-22 0-14 0z" transform="translate(18)" fill="#FFFDF8"/><rect x="6" y="20" width="24" height="7" rx="3.5" fill="#D97D88"/></g></g><g transform="translate(78 150)"><g class="n24-i-ball"><circle r="34" fill="#684E69"/><circle cx="-7" cy="-9" r="4" fill="#BDA9BD"/><circle cx="7" cy="-10" r="4" fill="#BDA9BD"/><circle cy="3" r="4" fill="#BDA9BD"/></g></g><g class="n24-i-ice" transform="translate(260 42)"><path d="M-14 14h28L0 48z" fill="#DCA66C"/><circle cy="4" r="17" fill="#F4B49D"/><circle cy="-8" r="12" fill="#FFF1D0"/></g><path class="n24-i-bow-heart" d="M232 54c-5-7-16 1-8 10l8 7 8-7c8-9-3-17-8-10z" fill="#D67B8D"/></svg></div>';
  }
  function sceneVisual(moment) {
    const visual = String(moment?.visual || 'generic');
    const privatePhoto = privateMomentPhoto(moment);
    const memoryPhoto = moment?.photo_path ? photoMarkup(moment.photo_path,moment.title,'n24-scene-photo',visual==='reunion') : '';
    const photo = privatePhoto || memoryPhoto;
    if (photo) return `<div class="n24-scene-art n24-art-photo">${photo}<span class="n24-photo-vignette" aria-hidden="true"></span></div>`;
    if (visual === 'home') return homeIllustration();
    if (visual === 'flowers') return flowersIllustration();
    if (visual === 'bowling') return bowlingIllustration();
    return '<div class="n24-scene-art n24-illustration n24-illustration-generic" aria-hidden="true"><span>♥</span></div>';
  }
  function renderMoments(moments) {
    const list = (Array.isArray(moments) ? moments : []).slice(0,10);
    if (!list.length) return '';
    return `<section class="n24-story n24-section" aria-labelledby="n24-story-heading"><div class="n24-story-heading"><p class="n24-kicker">Nuestro septiembre</p><h2 id="n24-story-heading">Un mes contado<br>por momentos</h2><p>No todo vive en Recuerdos. También hay planes, estrenos y pequeños ratitos que hicieron septiembre muy nuestro.</p></div><div class="n24-story-line">${list.map((m,index) => `<article class="n24-scene scene-${esc(m.visual || 'generic')}" data-n24-scene style="--n24-i:${index}"><div class="n24-scene-index" aria-hidden="true">${String(index+1).padStart(2,'0')}</div>${sceneVisual(m)}<div class="n24-scene-copy"><p class="n24-scene-date">${esc(m.eyebrow || dateLabel(m.date))}</p><h3>${esc(m.title)}</h3>${m.description?`<p>${esc(m.description)}</p>`:''}</div></article>`).join('')}</div></section>`;
  }
  function activateMomentAnimations() {
    const scenes = [...document.querySelectorAll('[data-n24-scene]')];
    if (!scenes.length) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in root)) {
      scenes.forEach(scene => scene.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {threshold:.32,rootMargin:'0px 0px -8% 0px'});
    scenes.forEach(scene => observer.observe(scene));
  }
  function renderExperience(data) {
    const e=data.event, page=$('page-nuestro24');
    if (!page) return;
    const letter=renderLetterSection(e.letter_markdown);
    const preview=data.preview?'<p class="n24-preview-note">Vista anticipada solo para Javi. Los datos pueden cambiar hasta la publicaci\\u00f3n.</p>':'';
    page.innerHTML=`<div class="n24-topline"><button class="n24-back" type="button" data-n24-back>\u2190 Volver</button><span>Javi + Laura</span></div><article class="n24-month"><header class="n24-intro"><p class="n24-kicker">${esc(dateLabel(e.event_date))} \u00b7 ${monthsTogether(e.event_date)} meses juntos</p><h1 tabindex="-1">Un mes m\u00e1s<br>para recordar</h1><p>Entre planes, recuerdos y peque\u00f1os momentos, JaviEats ha ido guardando un poquito m\u00e1s de vuestra historia.</p>${preview}</header><figure class="n24-cover">${photoMarkup(e.hero_path,'Javi y Laura','n24-cover-photo',true)}<figcaption>Otro 24 contigo.</figcaption></figure>${renderMetrics(e.metrics)}${renderMoments(e.moments)}${letter}<footer class="n24-ending" ${letter?'hidden':''}><p>Otro 24 m\u00e1s.<br>Y todav\u00eda quedan muchos. \u2764\ufe0f</p><div class="n24-end-buttons"><button class="n24-button" type="button" data-n24-home>Volver a JaviEats</button><button class="n24-text-button" type="button" data-n24-memories>Ver nuestros recuerdos</button></div></footer></article>`;
  }
  async function open(eventDate = null) {
    if (opening) return;
    const ctx=context();
    if (!ctx) return;
    opening=true;
    const target=document.activeElement;
    if (target?.matches('[data-n24-open]')) target.setAttribute('aria-busy','true');
    try {
      const args=eventDate?{p_event_date:eventDate}:{};
      const {data,error}=await ctx.client.rpc('obtener_nuestro24',args);
      if (!isCurrent(ctx)) return;
      if (error || !data?.event) { app()?.showToast?.('Este mes todav\u00eda no est\u00e1 disponible.'); return; }
      await Promise.all([signPhotos(ctx,data.event),fetchHeroAssets(ctx,data.event.event_date)]);
      if (!isCurrent(ctx)) return;
      mount(); previousFocus=target;
      returnPage=$('page-memories')?.classList.contains('active')?'memories':'home';
      renderExperience(data);
      app()?.showPage?.('nuestro24'); theme(); activateMomentAnimations();
      requestAnimationFrame(()=>{$('page-nuestro24')?.querySelector('h1')?.focus({preventScroll:true});});
    } catch (_) { if(isCurrent(ctx)) app()?.showToast?.('No se ha podido abrir el mes. Revisa la conexi\u00f3n e int\u00e9ntalo de nuevo.'); }
    finally { if(isCurrent(ctx)) opening=false; target?.removeAttribute('aria-busy'); }
  }
  function openMemory(memory) {
    let e;
    try { e=JSON.parse(memory?.contenido || '{}'); } catch (_) { return; }
    if(e.kind==='nuestro24' && validDay(e.event_date)) return open(e.event_date);
  }
  function leave(page='home') {
    closePhoto(); app()?.showPage?.(page); theme();
    if (page===returnPage && previousFocus?.isConnected) requestAnimationFrame(()=>previousFocus.focus({preventScroll:true}));
  }
  function revealLetter(button) {
    const letter=$('n24-letter');
    if (!letter || !letter.hidden) return;
    letter.hidden=false; button.setAttribute('aria-expanded','true');
    button.textContent='Carta abierta \u2764\ufe0f';
    const ending=$('page-nuestro24')?.querySelector('.n24-ending'); if(ending) ending.hidden=false;
    const paper=letter.querySelector('.n24-letter-paper');
    paper?.focus({preventScroll:true});
    letter.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  }
  function closePhoto() { const d=$('n24-photo-dialog'); if(d?.open)d.close(); }
  function showPhoto(path) {
    const url=signed.get(path)?.url, d=$('n24-photo-dialog');
    if(!url || !d)return;
    const source=[...document.querySelectorAll('[data-n24-image]')].find(img=>img.dataset.n24Image===path);
    d.querySelector('img').src=url;d.querySelector('img').alt=source?.alt||'Recuerdo';
    d.querySelector('p').textContent=source?.alt||'Recuerdo';d.showModal();
  }
  async function filterRemovablePhotos(client,paths) {
    const results=await Promise.all((paths||[]).map(async path=>{
      try{const {data,error}=await client.rpc('nuestro24_foto_protegida',{p_path:path});return !error && data===false?path:null;}catch(_){return null;}
    }));
    return results.filter(Boolean);
  }
  function mount() {
    if(mounted || !$('app-screen'))return;
    mounted=true;
    const section=document.createElement('section'); section.id='page-nuestro24';section.className='page n24-page';
    const nav=$('app-screen').querySelector('.bottom-nav');
    if(nav)nav.before(section);else $('app-screen').appendChild(section);
    new MutationObserver(theme).observe(section,{attributes:true,attributeFilter:['class']});
    const dialog=document.createElement('dialog');dialog.id='n24-photo-dialog';dialog.className='n24-photo-dialog';
    dialog.innerHTML='<button class="n24-photo-close" type="button" data-n24-close-photo aria-label="Cerrar foto">\u00d7</button><img alt=""><p></p>';
    document.body.appendChild(dialog);
    dialog.addEventListener('close',()=>dialog.querySelector('img').removeAttribute('src'));
    dialog.addEventListener('click',event=>{if(event.target===dialog)closePhoto();});
    const home=$('page-home');
    if(home)new MutationObserver(()=>{if(heroActive()&&!$('n24-home'))renderHome();}).observe(home,{childList:true});
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-n24-open],[data-n24-back],[data-n24-home],[data-n24-memories],[data-n24-letter],[data-n24-photo],[data-n24-close-photo]');
    if(!button)return;
    if(button.hasAttribute('data-n24-open'))void open();
    else if(button.hasAttribute('data-n24-back'))leave(returnPage);
    else if(button.hasAttribute('data-n24-home'))leave('home');
    else if(button.hasAttribute('data-n24-memories'))leave('memories');
    else if(button.hasAttribute('data-n24-letter'))revealLetter(button);
    else if(button.hasAttribute('data-n24-photo'))showPhoto(button.dataset.n24Photo);
    else closePhoto();
  });
  document.addEventListener('error',event=>{
    if(event.target instanceof HTMLImageElement && event.target.hasAttribute('data-n24-image')) {
      signed.delete(event.target.dataset.n24Image); event.target.hidden=true;
    }
  },true);
  const resume=()=>{renderHome();void refresh(true);};
  root.addEventListener('javieats:data',()=>{void refresh();});
  root.addEventListener('pageshow',resume);
  root.addEventListener('online',resume);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')resume();});
  root.JaviEatsNuestro24=Object.freeze({open,openMemory,renderHome,refresh,reset:clearPrivateView,filterRemovablePhotos});
  mount(); void refresh();
})(typeof window!=='undefined'?window:null);
