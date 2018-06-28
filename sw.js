'use strict';

var currentCache = 'currency-converter-v2';

self.addEventListener('install', function (installation) {
    installation.waitUntil(caches.open(currentCache).then(function (cache) {
        return cache.addAll(['/', '/dist/bundle.js', '/dist/style.css', '/dist/logo.png']);
    }));
});

self.addEventListener('activate', function (event) {
    event.waitUntil(caches.keys().then(function (cacheNames) {
        cacheNames.forEach(function (name) {
            if (name.startsWith('currency-converter') && name != currentCache) {
                caches.delete(name);
            }
        });
    }));
});

self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
    }));
});
