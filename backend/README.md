# Quiz Game Online Backend — v5.8.0

This optional Node.js server provides authenticated accounts, protected player sync, security hardening, global leaderboard and server-authoritative ranked runs. v5.8 adds a database adapter and migration/backup tooling so the storage layer can be moved away from direct `db.json` access without losing existing data.

## v5.8.0 Database Layer

- `database.js` — persistent storage adapter around the existing JSON store.
- `migrate.js` — migration entry point with an automatic pre-migration backup.
- `npm run migrate` — validates and rewrites the current database using the v5.8 schema metadata.
- `backups/` — generated backup directory; do not commit generated backups.
- `.env.example` — deployment settings for the current JSON mode and future PostgreSQL deployment.

The current server runtime still uses `db.json` directly for compatibility. PostgreSQL is the declared production target, but it is **not falsely advertised as active in v5.8.0**. The next database integration step must move the runtime read/write operations behind this adapter and add real PostgreSQL migrations before production cutover.

## Endpoints

### Authentication

- `POST /auth/register` — create an account.
- `POST /auth/login` — authenticate and receive a session token.
- `GET /auth/me` — inspect the authenticated account.
- `POST /auth/logout` — revoke the current session.
- `POST /auth/logout-all` — revoke every session for the account.
- `POST /auth/change-password` — change password and revoke other sessions.

### Game data

- `GET /health` — health/version and online feature status.
- `POST /players/sync` — authenticated Player ID and offline event sync.
- `GET /leaderboard` — legacy top-100 accumulated score endpoint.

### Ranked Online

- `POST /runs/start` — starts an authenticated server-authoritative ranked run.
- `POST /runs/:runId/answer` — validates a question ID, answer index and answer timing.
- `POST /runs/:runId/finish` — validates completion and persists the authoritative result.

## Storage and migration

Current runtime storage:

```text
backend/db.json
       ↓
v5.8 database adapter
       ↓
future PostgreSQL adapter
```

Run locally:

```bash
cd backend
npm install
npm run check
npm run migrate
npm start
```

`npm run migrate` creates a timestamped backup before updating the database schema metadata.

For production, configure a real persistent database service and complete the PostgreSQL runtime adapter before switching `DATABASE_MODE` away from `json`.

## Environment

```text
PORT=3000
CORS_ORIGIN=https://your-github-pages-site.example
TRUST_PROXY=0
DATABASE_MODE=json
DATABASE_URL=postgresql://quiz_user:change_me@localhost:5432/quiz_game
DATABASE_SSL=false
```

Never commit real database credentials.

## Security

- Security response headers.
- `X-Powered-By` disabled.
- Configurable CORS allowlist.
- Request body size limit.
- Authentication and ranked-run rate limits.
- Login lockout after repeated failures.
- `scrypt` password hashing and constant-time comparison.
- Session revocation.
- Server-side validation for synced event fields.
- Server-authoritative ranked scoring.

## Production status

v5.8 is a **database infrastructure transition release**, not a claim that the current JSON storage is production-scale. Before opening competitive play to a large public audience, the runtime still needs PostgreSQL integration, transactional writes, indexes, backups, monitoring, distributed rate limiting, secret management and additional abuse detection.

GitHub Pages hosts the frontend; deploy the backend and its database separately.
