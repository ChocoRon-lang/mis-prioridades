// Minimal service worker for Prisma.
// Enables system-style notification banners (via showNotification) and is
// ready to receive real push messages in the future if a backend is added.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});

// Reserved for future real server-sent push notifications.
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {}
  const title = data.title || 'Prisma';
  const options = {
    body: data.body || '',
    icon: 'icon-180.png',
    tag: data.tag || 'prisma-notification',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
