# forum-mse-2026-ui

Minimal Angular 21 frontend used as the **CI/CD, Docker, Docker Compose and UAT
teaching companion** to the backend project
[`forum-mse-2026-be`](https://github.com/teodossidossev/forum-mse-2026-be).

This is intentionally **not** a complete forum UI. It contains just enough to
exercise: an `npm` build, unit tests, end-to-end tests, a production bundle and
a multi-stage Docker image served by nginx.

---

## What the page shows

* Title — *Forum MSE 2026*
* Description — *CI/CD teaching frontend*
* **Backend status panel** with a `Check backend status` button that calls the
  backend health endpoint and renders one of:
  * `Backend is reachable`
  * `Backend is unavailable`
  * `Backend status unknown`
* **Posts demo** with a `Load posts` button that lists posts returned from the
  backend's public read-only endpoint (`GET /posts`).
* A clear error message when the backend cannot be reached.

No login, no routing, no posting, no editing. By design.

---

## Requirements

* Node.js **22.x** (the Docker build image uses `node:22-alpine`)
* npm **10.x**
* For Docker tasks: Docker **24+**

## Install

```bash
npm ci
```

## Local development

```bash
npm start
```

The dev server runs on <http://localhost:4200> and is started with
`--proxy-config src/proxy.conf.json`, so browser calls to `/api/*` are forwarded
to the backend at `http://localhost:9000` (the default port from the backend's
`application.yaml`).

Start the backend separately:

```bash
# in the forum-mse-2026-be checkout
docker compose up -d postgres
./mvnw spring-boot:run
```

---

## Backend URL configuration

The frontend uses a **runtime-friendly** configuration object loaded by the
browser before Angular bootstraps. It lives at `public/config.js`:

```js
window.__APP_CONFIG__ = {
  backendBaseUrl: ''
};
```

The Angular service prepends `backendBaseUrl` to every request and uses the
fixed prefix `/api/...`. An **empty** `backendBaseUrl` means "same origin",
which is exactly what we want when:

* the dev server proxies `/api/*` to the backend, **or**
* the nginx runtime image proxies `/api/*` to the backend.

| Scenario | How to set the URL |
| --- | --- |
| Local `ng serve` | Edit `src/proxy.conf.json` if the backend isn't on `localhost:9000`. Leave `backendBaseUrl` empty. |
| Docker container, backend at `http://backend:9000` (Compose) | Default — set `BACKEND_UPSTREAM=http://backend:9000` (or leave it; that *is* the default in `nginx/docker-entrypoint.sh`). |
| Docker container, backend somewhere else | `docker run -e BACKEND_UPSTREAM=http://api.example.test:9000 ...` |
| Direct browser-to-backend (no nginx proxy) | `docker run -e BACKEND_BASE_URL=https://api.example.test ...` — the rewritten `config.js` makes Angular call the absolute URL. Requires CORS on the backend. |
| Cypress | Don't set anything. Tests use `cy.intercept` and never hit a real backend. |

---

## Scripts

| Script | Purpose |
| --- | --- |
| `npm start` | Dev server on `:4200` with backend proxy. |
| `npm run build` | Development-mode build (`dist/forum-mse-2026-ui/`). |
| `npm run build:prod` | Production build with budgets & hashing. |
| `npm test` | Unit tests (watch mode, Angular's vitest runner). |
| `npm run test:ci` | Unit tests, one-shot, suitable for CI. |
| `npm run lint` | ESLint over `src/` and `cypress/`. |
| `npm run cy:open` | Open the Cypress runner (needs the app running). |
| `npm run cy:run` | Headless Cypress run (needs the app already on `:4200`). |
| `npm run cy:ci` | Boot the dev server, wait for it, run Cypress, shut it down. |

---

## Unit tests

Angular 21 ships with `vitest` as the default test runner. The two specs are:

* `src/app/app.spec.ts` — root component renders title, description, and idle status label.
* `src/app/backend-status.service.spec.ts` — `BackendStatusService` mapped through `HttpTestingController` for UP / non-UP / network-error / base-URL-prefix cases.

```bash
npm run test:ci
```

## Cypress tests

Cypress specs live under `cypress/e2e/`.

* `home.cy.ts` — smoke test that the page renders.
* `backend-status.cy.ts` — uses `cy.intercept` to mock the health endpoint and
  the posts endpoint, verifying both happy and unavailable states. **It never
  depends on a real backend** so it's safe to run in CI.

```bash
npm run cy:ci
```

## Production build

```bash
npm run build:prod
# output: dist/forum-mse-2026-ui/browser
```

---

## Docker

Multi-stage build: Node compiles the app, nginx serves the static files and
proxies `/api/*` to the backend.

```bash
docker build -t forum-mse-2026-ui .

# default: proxies /api/* to http://backend:9000 (matches Compose service name)
docker run --rm -p 8080:80 forum-mse-2026-ui

# point at a backend reachable on the host
docker run --rm -p 8080:80 \
  -e BACKEND_UPSTREAM=http://host.docker.internal:9000 \
  forum-mse-2026-ui
```

Two env vars are recognised at container start (see
`nginx/docker-entrypoint.sh`):

* `BACKEND_UPSTREAM` — where nginx forwards `/api/*`. Default `http://backend:9000`.
* `BACKEND_BASE_URL` — written into the browser's `config.js`. Default empty
  (= same origin = use the nginx proxy).

No image is pushed anywhere by this repository. Publishing is part of the CI/CD
exercise.

---

## Intentionally left for CI/CD exercises

The repository deliberately stops here so students can wire up the rest:

* No `.github/workflows/*` — no GitHub Actions yet.
* No image push, no registry credentials, no version tagging.
* No deployment manifests.
* No `docker-compose.yaml` — the UAT/Compose setup lives in a separate repo.

See [`INSTRUCTOR_NOTES.md`](./INSTRUCTOR_NOTES.md) for the teaching plan.
