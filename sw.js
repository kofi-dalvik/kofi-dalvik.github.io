'use strict';

//cache version name
var currentCache = 'currency-converter-v2';

/**
 * on installation, cache the asset files
 */
self.addEventListener('install', function (installation) {
    installation.waitUntil(caches.open(currentCache).then(function (cache) {
        return cache.addAll(['/', '/dist/bundle.js', '/dist/style.css', '/dist/logo.png']);
    }));
});

/**
 * on activate, delete old caches
 */
self.addEventListener('activate', function (event) {
    event.waitUntil(caches.keys().then(function (cacheNames) {
        cacheNames.forEach(function (name) {
            if (name.startsWith('currency-converter') && name != currentCache) {
                caches.delete(name);
            }
        });
    }));
});

/**
 * on fetch response with a cached data or fetch data
 */
self.addEventListener('fetch', function (event) {
    event.respondWith(caches.match(event.request).then(function (response) {
        return response || fetch(event.request);
    }));
});
