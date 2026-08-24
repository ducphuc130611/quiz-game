# Quiz Game Online Backend — v5.5.0

This optional Node.js server provides persistent JSON storage, authenticated accounts, protected player sync, security hardening and the v5.5 global leaderboard service.

## Endpoints

### Authentication

- `POST /auth/register` — create an account with email, username and password.
- `POST /auth/login` — authenticate and receive a session token.
- `GET /auth/me` — inspect the authenticated account.
- `POST /auth/logout` — revoke the current session.
- `POST /auth/logout-all` — revoke every session for the account.
- `POST /auth/change-password` — change the password and revoke other sessions.

### Game data

- `GET /health` — health/version and online feature status.
- `POST /players/sync` — accepts authenticated Player ID, username and pending client events.
- `GET /leaderboard` — legacy top-100 accumulated score endpoint.

### Global leaderboard v5.5

- `GET /leaderboard/global?season=all&limit=25&offset=0` — public paginated global ranking.
- `GET /leaderboard/me?season=all` — authenticated player's current rank.
- `GET /leaderboard/seasons` — list of seasons represented in synced events.

`/leaderboard/me` requires `Authorization: Bearer <session-token>`.

Global leaderboard rows expose rank, username, score, best score, games, accuracy and last update time. The server never exposes account email, password hash or session data through public leaderboard endpoints.

## v5.5.0 Global Leaderboard

The service is implemented in `global-leaderboard.js` and registered by `server.js`.

- Public ranking with pagination.
- All-time or season-specific views.
- Stable deterministic tie ordering.
- Authenticated personal rank lookup.
- Season discovery endpoint.
- Global Leaderboard UI is provided by the frontend `global-leaderboard.js`.

## v5.4.0 Security Layer

- Security response headers.
- `X-Powered-By` disabled.
- Configurable CORS allowlist through `CORS_ORIGIN`.
- 128 KB JSON request body limit.
- Authentication rate limits.
- Temporary login lockout after repeated failed attempts.
- Constant-time password hash comparison after `scrypt` derivation.
- Session logout and password-change revocation.
- Expired-session and rate-limit cleanup.
- Server-side numeric bounds for synced event fields.
- Generic server errors.

Passwords are never stored as plaintext. Session tokens are random values; only SHA-256 token hashes are stored in `db.json`.

## Environment

```text
PORT=3000
CORS_ORIGIN=https://your-github-pages-site.example
TRUST_PROXY=1
```

Leave `CORS_ORIGIN` empty for local development if needed. Set an explicit allowlist in deployment.

## Persistent storage

Player and account data are stored in `backend/db.json`.

Only the latest 500 events per player are retained. Writes are serialized to avoid overlapping file writes.

## Run

```bash
cd backend
npm install
npm start
```

The default port is `3000`.

## Connect the frontend

```js
QuizOnline.configure("http://localhost:3000");
```

Then open **🌐 ONLINE**, authenticate and use **🌍 GLOBAL LEADERBOARD**.

## Production status

v5.5.0 is a **global leaderboard foundation**, not a production competitive service. The JSON database remains development-scale and synced scores are still client-originated. Before public ranked competition, deploy HTTPS, a production database, persistent/distributed rate limiting, audit logs, backups, monitoring, secret management and server-authoritative scoring/anti-cheat.

GitHub Pages only hosts the frontend; deploy the backend separately.
