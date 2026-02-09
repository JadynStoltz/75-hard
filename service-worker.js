const CACHE_NAME = '75-hard-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Add other essential static assets here if known and stable (e.g., specific CSS/JS files that don't change often)
  // For Vite, dynamic JS/CSS bundles often have hashes in their names, making pre-caching difficult.
  // The fetch strategy below will dynamically cache them after the first request.
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache during install');
        return cache.addAll(urlsToCache).catch(err => {
          console.warn('Failed to pre-cache some URLs (this is common for dynamic assets):', err);
        });
      })
  );
  self.skipWaiting();
});

// Cache and return requests with network fallback and dynamic caching
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached response if found
      if (response) {
        return response;
      }

      // Clone the request to allow it to be read by both the browser and the cache
      const fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(
        response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response to allow it to be read by both the browser and the cache
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });

          return response;
        }
      ).catch(error => {
        // This catch is for network errors.
        // You might want to return an offline page here if appropriate.
        console.error('Fetch failed:', error);
        // If an offline page is available, return it.
        // For now, simply re-throw or return a network error.
        throw error; // Or return new Response("<h1>Offline</h1>", {headers: {'Content-Type': 'text/html'}});
      });
    })
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // This makes the service worker take control of the page immediately
  );
});