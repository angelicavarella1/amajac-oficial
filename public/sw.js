// Service Worker placeholder - AMAJAC
// Registra cache básico para futuras funcionalidades offline
const CACHE_NAME = "amajac-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Pass-through: não interfere no site neste momento
  event.respondWith(fetch(event.request));
});
