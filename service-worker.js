const CACHE_NAME = "music-player-cache-v1";
const assetsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./offline.html",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./images/album.jpg",
  "./songs/song1.mp3",
  "./songs/song2.mp3",
  "./songs/song3.mp3"
  // Add other static assets here (e.g., default music, album art)
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).catch(() => caches.match("offline.html"))
      );
    })
  );
});