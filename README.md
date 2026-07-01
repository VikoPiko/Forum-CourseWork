# Forum MSE 2026

Small forum application with a Spring Boot backend, Angular frontend, PostgreSQL, Flyway migrations, JWT login, and OpenAPI-generated backend interfaces.

## Project Layout

- `forum-mse-2026` - Spring Boot API on port `9000`
- `forum-mse-2026-ui` - Angular UI on port `4200`
- `docker-compose.yaml` - runs PostgreSQL, backend, frontend, and Adminer together

## Run Everything With Docker

From this folder:

```powershell
docker compose up --build
```

Open:

- UI: http://localhost:4200
- Backend API: http://localhost:9000
- API docs: http://localhost:9000/scalar
- Health: http://localhost:9000/actuator/health
- Adminer: http://localhost:8090

Adminer settings:

- System: `PostgreSQL`
- Server: `postgres`
- Username: `forum_app`
- Password: `change-me-dev-db-password`
- Database: `forum_app`

Default app login:

- Username: `admin`
- Password: `admin`

The Compose database is exposed on host port `5433` to avoid clashing with a local PostgreSQL running on `5432`.

To stop the stack:

```powershell
docker compose down
```

To delete the local Compose database volume too:

```powershell
docker compose down -v
```

## Run Locally Without Docker For The App

Start PostgreSQL yourself, then run the backend from `forum-mse-2026`.

Useful local environment values:

```powershell
$env:SPRING_PROFILES_ACTIVE="dev"
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://localhost:5432/forum-app"
$env:SPRING_DATASOURCE_USERNAME="postgres"
$env:SPRING_DATASOURCE_PASSWORD="<your-local-password>"
$env:JWT_SECRET="change-me-to-a-long-random-secret-at-least-32-chars"
```

Backend:

```powershell
cd "forum-mse-2026"
mvn spring-boot:run
```

Frontend:

```powershell
cd "forum-mse-2026-ui"
npm ci
npm start
```

The Angular dev server runs at http://localhost:4200 and proxies `/api/*` to `http://localhost:9000`.

## Build And Check

Backend:

```powershell
cd "forum-mse-2026"
mvn clean compile -DskipTests
mvn clean package -DskipTests
```

Frontend:

```powershell
cd "forum-mse-2026-ui"
npm.cmd run build
```

If the frontend links seem dead, restart `npm start` after changing Angular config. The routes are `/topics`, `/topics/new`, `/topics/:id`, and `/login`.
