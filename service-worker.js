console.log("hello from service-worker.js");
var CACHE_NAME = "static-cache";
var urlsToCache = [
    ".",
    "index.html",
    "languages.js",
    "energystation.js",
    "js/hammer.min.js",
    "js/index.js",
    "js/jquery.min.js",
    "js/particles.min.js",
    "css/style.css",
    "css/bootstrap.min.css",
    "schriften/dancing_script.css",
    "schriften/tangerine_script.css",
    "img/xhumor.jpg"

];

self.addEventListener("load", function(event) {
    console.log("service-worker.js load");
})

self.addEventListener("install", function(event) {
    console.log("neu service-worker.js listener install")
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            console.log("in then...service-worker.js")
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function(event) {
    console.log("fetch");
    event.respondWith(
        caches.match(event.request)
        .then(function(response){
            return response || fetchAndCache(event.request);
        })
    );
});

function fetchAndCache(url) {
    console.log("fetchAndCache");
    return fetch(url)
    .then(function(response) {
      // Check if we received a valid response
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return caches.open(CACHE_NAME)
      .then(function(cache) {
        cache.put(url, response.clone());
        return response;
      });
    })
    .catch(function(error) {
      console.log('Request failed:', error);
      // You could return a custom offline 404 page here
    });
  
}





