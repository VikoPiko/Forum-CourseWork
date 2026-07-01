// Runtime configuration consumed by the Angular app on startup.
// An empty backendBaseUrl means "same origin" — the dev server proxies /api/*
// to the backend, and the nginx runtime image does the same in production.
// To point the UI at a different backend, override this file (the docker
// entrypoint rewrites it from BACKEND_BASE_URL).
window.__APP_CONFIG__ = {
  backendBaseUrl: ''
};
