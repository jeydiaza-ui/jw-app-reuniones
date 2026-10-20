// Service worker: permite abrir la app sin conexión.
// Estrategia: primero red (para recibir cambios), y si no hay conexión, la copia guardada.
// También recibe el archivo .json que Android envía por «Compartir» (share_target).
const CACHE = "reunion-v3";
const SHARE_CACHE = "reunion-share-inbox";
const SHARE_KEY = new URL("./__share_inbox__", self.location.href).href;
const SHARE_PATH = new URL("./share-target", self.location.href).pathname;
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
        // no borrar la bandeja de entrada de archivos compartidos
        return Promise.all(
          keys
            .filter(function (k) { return k !== CACHE && k !== SHARE_CACHE; })
            .map(function (k) { return caches.delete(k); })
        );
      })
      .then(function () { return self.clients.claim(); })
  );
});

// Guarda el archivo compartido y manda a la app a recogerlo.
function handleShare(request) {
  return request.formData().then(function (form) {
    var file = form.get("backup");
    if (!file || typeof file === "string") {
      // por si el sistema usa otro nombre de campo
      var found = null;
      form.forEach(function (v) { if (!found && v && typeof v === "object" && typeof v.text === "function") found = v; });
      file = found;
    }
    if (!file || typeof file.text !== "function") return null;
    return file.text().then(function (text) {
      return caches.open(SHARE_CACHE).then(function (c) {
        return c.put(SHARE_KEY, new Response(text, {
          headers: { "Content-Type": "application/json; charset=utf-8" }
        }));
      });
    });
  }).catch(function () {
    return null;
  }).then(function () {
    return Response.redirect(new URL("./index.html?import=shared", self.location.href).href, 303);
  });
}

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  // «Compartir» de Android envía un POST multipart a ./share-target
  if (e.request.method === "POST" && url.pathname === SHARE_PATH) {
    e.respondWith(handleShare(e.request));
    return;
  }

  if (e.request.method !== "GET") return;

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
