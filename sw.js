// Service worker: permite abrir la app sin conexión.
// Estrategia: primero red (para recibir cambios), y si no hay conexión, la copia guardada.
const CACHE = "reunion-v1";
const FILES = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(FILES); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then(function (res) {
        if (res && res.ok) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      })
      .catch(function () {
        return caches.match(e.request).then(function (r) { return r || caches.match("./index.html"); });
      })
  );
});
