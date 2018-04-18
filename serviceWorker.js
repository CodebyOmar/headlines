var staticCacheName = 'headlines-static-v4';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        'index.html',
        'js/main.js',
        'js/mainController.js',
        'js/countries.js',
        'js/Toast.min.js',
        'js/http.js',
        'css/app.css',
        'css/Toast.min.css',
        'img/news.jpg',
        'css/materialdesignicons.min.css',
        'css/materialdesignicons.min.css.map',
        'https://fonts.googleapis.com/css?family=Poppins',
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('headlines-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('/index.html'));
      return;
    }
  }

  event.respondWith(
    fetch(event.request).then(function(response) {
      return response;
    }).catch(function() {
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'notWaiting') {
    self.skipWaiting();
  }
});