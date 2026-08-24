# Quiz Game Online Backend — v5.6.0

This optional Node.js server provides persistent JSON storage, authenticated accounts, protected player sync, security hardening, global leaderboard and server-authoritative ranked runs.

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

### Ranked Online v5.6

- `POST /runs/start` — starts an authenticated server-authoritative ranked run.
- `POST /runs/:runId/answer` — validates a question ID, answer index and answer timing.
- `POST /runs/:runId/finish` — validates completion and persists the authoritative result.

Ranked runs use `question-bank.js`, which is server-side and contains the correct answers. The client never sends a score for a ranked result; the server calculates the score from validated answers and timing.

### Global leaderboard v5.5

- `GET /leaderboard/global?season=all&limit=25&offset=0` — public paginated global ranking.
- `GET /leaderboard/me?season=all` — authenticated player's current rank.
- `GET /leaderboard/seasons` — list of seasons represented in stored events.

## v5.6.0 Server-Authoritative Ranked

`anti-cheat.js` contains the validation rules used by the ranked run service.

- Server-issued run ID and nonce.
- Server-selected question set.
- Server-side correct answers.
- Answer/question binding.
- Duplicate-answer protection.
- Minimum and maximum timing validation.
- Run expiration.
- Incomplete-run rejection.
- Server-calculated score.
- Authoritative result marker in stored events.
- One active ranked run per player.
- Ranked-run request rate limiting.

This is an **anti-cheat foundation**, not a complete anti-cheat system. Client-side automation, account sharing and infrastructure-level abuse still require additional detection and monitoring.

## Security

- Security response headers.
- `X-Powered-By` disabled.
- Configurable CORS allowlist through `CORS_ORIGIN`.
- 128 KB JSON request body limit.
- Authentication and ranked-run rate limits.
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

Then open **🌐 ONLINE**, authenticate and use **⚔️ RANKED ONLINE**.

## Production status

v5.6.0 moves ranked scoring to the server, but the JSON database remains development-scale. Before public competitive scale, use HTTPS, a production database, distributed rate limiting, audit logs, backups, monitoring, secret management and additional abuse/anti-cheat detection.

GitHub Pages only hosts the frontend; deploy the backend separately.
