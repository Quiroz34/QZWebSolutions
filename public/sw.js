const CACHE_NAME = 'qzwebsolutions-v2';
const ASSETS_TO_CACHE = [
    '/',
    '/css/styles.css',
    '/js/script.js',
    '/assets/logofv2.jpg',
    '/offline.html'
];

// Install Event
self.addEventListener('install', (event) => {
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // Take control of all clients immediately
            self.clients.claim(),
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// Fetch Event - NETWORK FIRST STRATEGY
self.addEventListener('fetch', (event) => {
    // Skip for non-GET requests or different origins if needed, but for now apply to all
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // If network fetch is successful, clone it and update the cache
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // If network fails (offline), try to serve from cache
                return caches.match(event.request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // If not in cache and offline (e.g. navigation), return offline page
                        if (event.request.mode === 'navigate') {
                            return caches.match('/offline.html');
                        }
                    });
            })
    );
});
