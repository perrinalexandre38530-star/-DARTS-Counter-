const CACHE_NAME = "dc-cache-v5"; // 🔁 Change la version à chaque build
const URLS_TO_CACHE = ["/"];

// Installation du SW
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Gestion des requêtes réseau
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    // Pour les pages : toujours chercher sur le réseau d'abord
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/index.html"))
    );
  } else {
    // Pour les ressources statiques
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((res) => {
            if (res.ok && event.request.url.startsWith(self.location.origin)) {
              const resClone = res.clone();
              caches.open(CACHE_NAME).then((cache) =>
                cache.put(event.request, resClone)
              );
            }
            return res;
          })
        );
      })
    );
  }
});
