export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Use relative path ./service-worker.js instead of absolute /service-worker.js
      // This fixes issues where the app is hosted in a subdirectory or preview environment
      const swUrl = './service-worker.js';
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch((error) => {
          // Log warning but do not crash. This commonly fails in online editors due to file serving policies.
          console.warn('ServiceWorker registration failed. PWA features may be disabled in this environment.', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}