const CACHE_NAME = 'aya-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/favicon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it's a stream and can only be consumed once.
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || !response.type === 'basic') {
              return response;
            }

            // Clone the response because it also is a stream.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

let reminderTimeoutIds = [];

const clearReminders = () => {
    reminderTimeoutIds.forEach(id => clearTimeout(id));
    reminderTimeoutIds = [];
    if (self.registration.getNotifications) {
        self.registration.getNotifications({ tag: 'aya-reminder' }).then(notifications => {
            notifications.forEach(notification => notification.close());
        });
    }
};

self.addEventListener('message', event => {
    if (event.data.command === 'cancel-notifications') {
        clearReminders();
    } else if (event.data.command === 'schedule-notifications') {
        clearReminders();
        const notifications = event.data.notifications;

        notifications.forEach(notificationInfo => {
            const id = setTimeout(() => {
                self.registration.showNotification(notificationInfo.title, {
                    body: notificationInfo.body,
                    icon: '/icons/icon-192x192.png',
                    badge: '/icons/icon-192x192.png',
                    tag: 'aya-reminder'
                });
            }, notificationInfo.delay);
            reminderTimeoutIds.push(id);
        });
    }
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus();
            }
            return clients.openWindow('/');
        })
    );
});
