// ---- Versionierung ----
// Bei jedem neuen Release diese Nummer erhöhen. Das ändert den Cache-Namen,
// wodurch der Browser den Service Worker als "neu" erkennt und alte Caches
// beim Aktivieren automatisch gelöscht werden.
const APP_VERSION = "3";
const CACHE_NAME = "energietankstelle-cache-v" + APP_VERSION;
const OFFLINE_URL = "offline.html";
const FILES_TO_CACHE = [
  "index.html",
  "info.html",
  "impressum.html",
  "languages.js",
  "energystation.js",
  "css/style.css",
  "css/bootstrap.min.css",
  "js/index.js",
  "js/hammer.min.js",
  "js/html2canvas.min.js",
  "js/jquery.min.js",
  "js/particles.min.js",
  "img/icon.png",
  "img/share.svg",
  OFFLINE_URL
];

// Installations-Event
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const file of FILES_TO_CACHE) {
        try {
          await cache.add(file);
          console.log(`✅ Erfolgreich gecacht: ${file}`);
        } catch (error) {
          console.error(`❌ Fehler beim Cachen von ${file}:`, error);
        }
      }
    })
  );
  // Neue Version sofort aktivieren, statt zu warten, bis alle offenen Tabs
  // mit der alten Version geschlossen wurden.
  self.skipWaiting();
});




// Aktivierungs-Event
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log(`🗑️ Alter Cache wird gelöscht: ${cache}`);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      // Übernimmt sofort die Kontrolle über bereits offene Tabs/Seiten,
      // damit die neue Version ohne manuellen Neustart der App greift.
      return self.clients.claim();
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
