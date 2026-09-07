const JAVIEATS_DEFAULT_URL = './';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch (_) {
    payload = { body: event.data ? event.data.text() : '' };
  }

  const title = payload.title || 'JaviEats';
  const options = {
    body: payload.body || payload.detalle || 'Tienes una novedad en JaviEats.',
    icon: payload.icon || './assets/icon-192.png',
    badge: payload.badge || './assets/icon-192.png',
    tag: payload.tag || payload.notificationId || undefined,
    renotify: Boolean(payload.renotify),
    data: {
      url: payload.url || JAVIEATS_DEFAULT_URL,
      notificationId: payload.notificationId || null
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = new URL(event.notification?.data?.url || JAVIEATS_DEFAULT_URL, self.location.origin).href;

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of windows) {
      if ('navigate' in client) {
        await client.navigate(target);
        return client.focus();
      }
    }
    return self.clients.openWindow(target);
  })());
});
