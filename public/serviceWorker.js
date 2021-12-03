const cacheName = "PSaude.V1";

const resources2Precache = [
    '/',
    'index.html',
    'img/icons/android-chrome-192x192.png',
    'img/icons/android-chrome-512x512.png'
];

self.addEventListener('install', (event) => {
    console.log('install sw')
    event.waitUntil(
        caches.open(cacheName)
            .then (cache => (cache.addAll(resources2Precache)))
    );
});

/*
self.addEventListener('fetch', (event) => {
    console.log('event.request', event.request)
    event.respondWith(
        caches.match(event.request)
            .then(cacheResponse => (cacheResponse || fetch(event.request)))
    )
})
*/
