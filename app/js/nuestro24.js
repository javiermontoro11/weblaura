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
  let userId = null, epoch = 0, response = null, receivedAt = 0, lastFetch = -Infinity;
  let inFlight = null, timer = null, mounted = false, opening = false, previousFocus = null;
  let returnPage = 'home';

  function clearPrivateView() {
    epoch += 1; userId = null; response = null; signed.clear(); inFlight = null;
    opening = false; lastFetch = -Infinity;
    clearTimeout(timer);
    $('n24-home')?.remove();
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
  function renderHome() {
    const home = $('page-home');
    if (!home) return;
    if (!heroActive()) { $('n24-home')?.remove(); theme(); return; }
    const e = response.event;
    let hero = $('n24-home');
    if (!hero) { hero = document.createElement('section'); hero.id='n24-home'; hero.className='n24-home'; home.prepend(hero); }
    const image = photoMarkup(e.hero_path,'Javi y Laura','n24-hero-photo',true);
    const signature = [e.event_date,image,response.preview].join('|');
    if (hero.dataset.signature !== signature) {
      hero.dataset.signature = signature;
      hero.innerHTML = `${image}<div class="n24-hero-ambient" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div><div class="n24-hero-shade"></div><div class="n24-hero-copy"><p class="n24-hero-date">${esc(dateLabel(e.event_date))} \u00b7 ${monthsTogether(e.event_date)} meses juntos</p><h2>Otro 24 contigo.<span>Y queri\u00e9ndonos cada vez m\u00e1s.</span></h2><button class="n24-button n24-button-light" type="button" data-n24-open>Ver nuestro mes \u2192</button>${response.preview && app()?.getRole?.()==='javi'?'<small class="n24-preview-tag">Vista anticipada \u00b7 Solo para Javi</small>':''}</div>`;
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
        await signPhotos(ctx,data?.event);
        if (!isCurrent(ctx)) return;
        renderHome(); schedule();
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
  function sceneVisual(moment) {
    const visual = String(moment?.visual || 'generic');
    const photo = moment?.photo_path ? photoMarkup(moment.photo_path,moment.title,'n24-scene-photo',visual==='reunion') : '';
    if (visual === 'reunion') return `<div class="n24-scene-art n24-art-reunion">${photo}<span class="n24-photo-glow"></span><span class="n24-photo-heart" aria-hidden="true">♥</span></div>`;
    if (visual === 'home') return '<div class="n24-scene-art n24-art-home" aria-hidden="true"><span class="n24-home-moon"></span><span class="n24-house"><i></i><b></b></span><span class="n24-home-heart">♥</span></div>';
    if (visual === 'life') return '<div class="n24-scene-art n24-art-life" aria-hidden="true"><span class="n24-life-path"></span><span class="n24-life-pin">♥</span><span class="n24-life-spark n24-life-spark-a">✦</span><span class="n24-life-spark n24-life-spark-b">✦</span></div>';
    if (visual === 'sunset') return '<div class="n24-scene-art n24-art-sunset" aria-hidden="true"><span class="n24-sun"></span><span class="n24-horizon"></span><span class="n24-stadium"><i></i><i></i><i></i><i></i></span></div>';
    if (visual === 'together') return '<div class="n24-scene-art n24-art-together" aria-hidden="true"><span class="n24-cup n24-cup-a">☕</span><span class="n24-cup n24-cup-b">☕</span><span class="n24-duel-card n24-duel-a">J</span><span class="n24-duel-card n24-duel-b">L</span><span class="n24-together-heart">♥</span></div>';
    if (visual === 'dogs') return '<div class="n24-scene-art n24-art-dogs" aria-hidden="true"><span class="n24-paw p1">🐾</span><span class="n24-paw p2">🐾</span><span class="n24-paw p3">🐾</span><span class="n24-dog-orb d1">R</span><span class="n24-dog-orb d2">N</span></div>';
    if (visual === 'flowers') return '<div class="n24-scene-art n24-art-flowers" aria-hidden="true"><span class="n24-flower f1">🌼</span><span class="n24-flower f2">🌼</span><span class="n24-flower f3">🌼</span><span class="n24-flower f4">🌼</span><span class="n24-petal pt1">●</span><span class="n24-petal pt2">●</span><span class="n24-petal pt3">●</span></div>';
    if (visual === 'bowling') return '<div class="n24-scene-art n24-art-bowling" aria-hidden="true"><span class="n24-ball">●</span><span class="n24-pin pin1">♙</span><span class="n24-pin pin2">♙</span><span class="n24-pin pin3">♙</span><span class="n24-icecream">🍦</span><span class="n24-bow-heart">♥</span></div>';
    return '<div class="n24-scene-art n24-art-generic" aria-hidden="true"><span>♥</span></div>';
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
    const preview=data.preview?'<p class="n24-preview-note">Vista previa. El resumen se cerrar\u00e1 al comenzar el d\u00eda 24; los datos todav\u00eda pueden cambiar.</p>':'';
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
      await signPhotos(ctx,data.event);
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
