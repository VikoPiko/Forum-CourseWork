# Instructor notes

These are notes for the instructor running the *Forum MSE 2026* course. They
are not student-facing.

## What this UI is meant to teach

The UI is deliberately small. The interesting code is **not** the Angular
application; it is the surrounding tooling.

Concrete exercises this repo is designed to support:

1. **`npm` lifecycle** — install, lint, unit test, e2e test, production build.
2. **Multi-stage Docker** — separate build & runtime images, leaving a small
   nginx-served artefact.
3. **Runtime configuration** — the `public/config.js` + entrypoint pattern lets
   the *same* image talk to dev/uat/prod backends without rebuilding.
4. **Reverse-proxy basics** — `/api/*` is forwarded by both the Angular dev
   proxy and the nginx runtime, which sidesteps the lack of backend CORS.
5. **End-to-end testing without a live backend** — Cypress `cy.intercept`
   demonstrates a network mock pattern that fits perfectly into a CI matrix.
6. **GitHub Actions wiring** — left empty for the students.
7. **Docker Compose integration** — lives in a separate repo (see below).

## Backend files inspected

The following files of `forum-mse-2026-be` were read while designing this UI:

* `src/main/resources/openapi/openapi.yaml` — full Forum API contract.
* `src/main/resources/application.yaml` — server port (`9000`), actuator
  exposure (`health,info`), `show-details: never`, health probes enabled with
  additional paths.
* `src/main/resources/application-dev.yaml` and `application-uat.yaml`.
* `src/main/java/com/mse/edu/forum/security/SecurityConfig.java` — confirmed
  which endpoints are reachable **without** a JWT.
* `docker-compose.yaml` — postgres + adminer only; the backend itself is not
  yet containerised in that repo.
* `.env.dev.example`, `.env.uat.example`, `.env.prod.example`, `.env.test.example`.
* `pom.xml` — Spring Boot starter set, springdoc, openapi-generator-maven-plugin.

## Selected backend endpoint(s) for status & API demo

| UI feature | Endpoint | Why |
| --- | --- | --- |
| Status panel | `GET /actuator/health` | Exposed in `application.yaml` (`management.endpoints.web.exposure.include: health,info`) and allow-listed in `SecurityConfig`. Returns `{ "status": "UP" }` because `show-details: never` is set — perfectly sufficient for the panel. |
| API demo | `GET /posts` | Permitted without auth: `SecurityConfig.requestMatchers(GET, "/posts", "/posts/**").permitAll()`. Read-only, returns `PostResponse[]` per the OpenAPI spec. No JWT, no side effects. |

A note on CORS: the backend does **not** configure CORS. Letting the browser
hit the backend cross-origin directly would be blocked. The UI sidesteps this
by using a same-origin `/api/*` prefix and relying on a reverse proxy (Angular
dev proxy locally, nginx in the container). If a future lesson needs direct
browser-to-backend traffic, the backend will need a `WebMvcConfigurer` or an
explicit `CorsConfigurationSource` bean — that's a separate teaching topic.

If the backend later closes off `/actuator/health` or `/posts`, the frontend
still functions: `BackendStatusService.checkHealth()` reports `unavailable`
and the posts demo shows an error message. The service is also injection-
friendly so it can be replaced with a fake in any test or environment.

## What students should later implement in GitHub Actions

The repo intentionally has **no** `.github/workflows/`. Suggested student
deliverables, in roughly increasing difficulty:

1. `ci.yml`
   * `actions/checkout`, `actions/setup-node@v4` with Node 22.
   * `npm ci`
   * `npm run lint`
   * `npm run test:ci`
   * `npm run build:prod` (upload `dist/` as an artifact)
   * `npm run cy:ci` (use `cypress/github-action` for caching).
2. `docker.yml`
   * Build the image with `docker/build-push-action`.
   * Tag with the short SHA and `latest`.
   * (Stretch) push to GHCR / Docker Hub after a manual `workflow_dispatch`.
3. Branch protection
   * Require `ci.yml` to pass before merge.
4. (Stretch) Release pipeline
   * Tag-triggered, builds a semver-tagged image.

## How this UI will later connect to the backend in a Compose / UAT repo

The intent is a **separate** repository — e.g. `forum-mse-2026-uat` — that
references both images and wires them together. A teaching-friendly shape
looks like:

```yaml
# excerpt — lives in the UAT repo, NOT here
services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: forum
      POSTGRES_USER: forum_app
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

  backend:
    image: ghcr.io/<org>/forum-mse-2026-be:latest
    environment:
      SPRING_PROFILES_ACTIVE: uat
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/forum
      SPRING_DATASOURCE_USERNAME: forum_app
      SPRING_DATASOURCE_PASSWORD: ${POSTGRES_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      db:
        condition: service_healthy

  ui:
    image: ghcr.io/<org>/forum-mse-2026-ui:latest
    environment:
      BACKEND_UPSTREAM: http://backend:9000
    ports:
      - "8080:80"
    depends_on:
      - backend
```

Key points the students should observe:

* The UI image takes `BACKEND_UPSTREAM` (used by nginx) — *the same image*
  works in dev, uat and prod.
* `BACKEND_BASE_URL` stays empty in this scenario so the browser uses the
  same-origin nginx proxy and CORS does not appear in the lesson.
* The UAT repo is where deployment-shaped concerns live (env files, smoke
  tests, image pinning, secrets). Both `*-ui` and `*-be` stay pure
  build-and-publish repos.
