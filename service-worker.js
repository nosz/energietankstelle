const CACHE_NAME = "offline-cache-v1";
const OFFLINE_URL = "offline.html";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/index.js",
  "/images/icon.png",
  OFFLINE_URL
];

// Installations-Event
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Aktivierungs-Event
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch-Event (Netzwerk-Anfragen abfangen)
self.addEventListener("fetch", event => {
  if (!event.request.url.startsWith("http")) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => caches.match(event.request).then(response => {
        return response || caches.match(OFFLINE_URL);
      }))
  );
});
