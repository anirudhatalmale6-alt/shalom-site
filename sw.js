var CACHE_NAME = 'shalom-v2';
var urlsToCache = [
  './',
  './index.html',
  './about.html',
  './donate.html',
  './membership.html',
  './agriculture.html',
  './opportunities.html',
  './events.html',
  './contact.html',
  './js/events-data.js',
  './js/forms.js',
  './assets/shalom-logo.jpg',
  './assets/icon-192.png'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

// Pages and event data must never be served stale, or visitors keep seeing
// old events and old totals long after the site is updated.
function isFreshnessCritical(request) {
  return request.mode === 'navigate' ||
         request.destination === 'document' ||
         request.url.indexOf('events-data.js') !== -1;
}

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  if (isFreshnessCritical(event.request)) {
    event.respondWith(
      fetch(event.request).then(function(response) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });
        return response;
      }).catch(function() {
        return caches.match(event.request).then(function(cached) {
          return cached || caches.match('./index.html');
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) return response;
      return fetch(event.request).then(function(response) {
        if (!response || response.status !== 200) return response;
        var responseClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(name) { return name !== CACHE_NAME; })
          .map(function(name) { return caches.delete(name); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});
