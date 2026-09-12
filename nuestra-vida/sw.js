const CACHE='nuestra-vida-1.0.1-release';
const CORE=[
  './','./index.html','./manifest.webmanifest',
  './icons/icon-180.png','./icons/icon-192.png','./icons/icon-512.png',
  './assets23/javi_headcut.png','./assets23/laura_headcut.png',
  './assets25/javi_portrait.webp','./assets25/javi_full_arms.webp','./assets25/javi_full_relaxed.webp',
  './assets25/laura_portrait_glasses.webp','./assets25/laura_portrait_noglasses.webp',
  './assets25/laura_full_glasses.webp','./assets25/laura_full_noglasses.webp','./assets25/laura_full_pink.webp',
  './assets25/scene_javi_baby.webp','./assets25/scene_javi_graduation.webp','./assets25/scene_javi_wedding.webp','./assets25/scene_javi_retirement.webp',
  './assets25/scene_laura_baby.webp','./assets25/scene_laura_graduation.webp','./assets25/scene_laura_wedding.webp','./assets25/scene_laura_retirement.webp',
  './assets26/javi_outfit_capital.webp',
  './assets26/javi_outfit_jacket.webp',
  './assets26/javi_outfit_tee.webp',
  './assets26/laura_outfit_navy.webp',
  './assets26/laura_outfit_pink.webp',
  './assets26/laura_outfit_white.webp',
  './assets26/scene_farewell_together.webp',
  './assets26/scene_javi_cat_grey.webp',
  './assets26/scene_javi_cat_orange.webp',
  './assets26/scene_javi_dog_nala.webp',
  './assets26/scene_javi_dog_randy.webp',
  './assets26/scene_javi_home.webp',
  './assets26/scene_javi_roots.webp',
  './assets26/scene_javi_university.webp',
  './assets26/scene_javi_world.webp',
  './assets26/scene_laura_cat_grey.webp',
  './assets26/scene_laura_cat_orange.webp',
  './assets26/scene_laura_dog_nala.webp',
  './assets26/scene_laura_dog_randy.webp',
  './assets26/scene_laura_home.webp',
  './assets26/scene_laura_roots.webp',
  './assets26/scene_laura_university.webp',
  './assets26/scene_laura_world.webp'
];
const AUDIO_CORE=[
  './audio27/bgIntro.mp3','./audio27/bgBoard.mp3','./audio27/cash.mp3','./audio27/pay.mp3','./audio27/brake.mp3',
  './audio27/ui_tap1.mp3','./audio27/ui_tap2.mp3','./audio27/wheel_tick1.mp3','./audio27/wheel_whoosh.mp3',
  './audio27/coin_flip.mp3','./audio27/coin_land.mp3','./audio27/dream_pick.mp3'
];
const AUDIO_OPTIONAL=[
  './audio27/applause.mp3','./audio27/victory.mp3','./audio27/baby.mp3','./audio27/dog.mp3','./audio27/cat.mp3',
  './audio27/wedding.mp3','./audio27/graduation.mp3','./audio27/university.mp3','./audio27/retirement.mp3',
  './audio27/keys.mp3','./audio27/travel.mp3','./audio27/bingo.mp3','./audio27/count.mp3','./audio27/lucky.mp3',
  './audio27/debt_pay.mp3','./audio27/debt_clear.mp3','./audio27/success_safe.mp3','./audio27/success_risk.mp3',
  './audio27/ui_back.mp3','./audio27/ui_tap3.mp3','./audio27/wheel_tick2.mp3','./audio27/wheel_tick3.mp3',
  './audio27/move_tick1.mp3','./audio27/move_tick2.mp3','./audio27/wheel_result.mp3',
  './audio27/good1.mp3','./audio27/good2.mp3','./audio27/good3.mp3','./audio27/duel_win.mp3',
  './audio27/loan.mp3','./audio27/interest.mp3','./audio27/introHit.mp3','./audio27/drumroll.mp3',
  './audio27/bgMinigame.mp3','./audio27/bgFinal.mp3','./audio27/bgRetirement.mp3','./audio27/wrong.mp3'
];

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(async c=>{await c.addAll([...CORE,...AUDIO_CORE]);c.addAll(AUDIO_OPTIONAL).catch(()=>{})}).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('nuestra-vida-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;

  // Las navegaciones siempre consultan primero la red. Esto evita que una
  // pantalla temporal de lanzamiento quede fijada en Safari/PWA.
  if(e.request.mode==='navigate'){
    e.respondWith(
      fetch(e.request).then(r=>{
        const copy=r.clone();
        caches.open(CACHE).then(c=>c.put(e.request,copy));
        return r;
      }).catch(async()=>{
        return (await caches.match(e.request)) || (await caches.match('./index.html')) || new Response('Sin conexión',{status:503,statusText:'Offline'});
      })
    );
    return;
  }

  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>hit||new Response('Sin conexión',{status:503,statusText:'Offline'}))));
});