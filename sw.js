const CACHE_NAME = "quiz-game-v5.3.0";
const ASSETS = [
  "./", "./index.html", "./style.css", "./supermajor.css", "./supermajor4.css", "./supermajor.js", "./supermajor4.js", "./online.js", "./questions.js", "./expansion-content.js", "./achievements.js",
  "./leaderboard.js", "./script.js", "./stats.js", "./shop.js", "./profile.js", "./keyboard.js", "./v2-system.js", "./manifest.json"
];
self.addEventListener("install", event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener("activate", event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))); self.clients.claim(); });
self.addEventListener("fetch", event => { if (event.request.method !== "GET") return; event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => { if (response.ok && new URL(event.request.url).origin === self.location.origin) { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy)); } return response; }).catch(() => caches.match("./index.html")))); });
