console.log("hello from sw.js");
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
    workbox.routing.registerRoute(
        /\.(?:js|css|html)$/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'static-resources',
        })
    );
    workbox.routing.registerRoute(
        new RegExp('/img/'),
        new workbox.strategies.StaleWhileRevalidate({ 
            cacheName: 'images' }
        )
    );
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}
