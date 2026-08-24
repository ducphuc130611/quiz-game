# Quiz Game Online Backend — v5.4.0

This optional Node.js server upgrades the v5 online architecture with persistent JSON storage, authenticated accounts, protected player sync and a hardened security layer.

## Endpoints

### Authentication

- `POST /auth/register` — create an account with email, username and password.
- `POST /auth/login` — authenticate and receive a session token.
- `GET /auth/me` — inspect the authenticated account.
- `POST /auth/logout` — revoke the current session.
- `POST /auth/logout-all` — revoke every session for the account.
- `POST /auth/change-password` — change the password and revoke other sessions.

### Game data

- `GET /health` — health/version, persistence, authentication and security status.
- `POST /players/sync` — accepts authenticated Player ID, username and pending client events.
- `GET /leaderboard` — returns the top 100 players by accumulated score.

`/players/sync` requires `Authorization: Bearer <session-token>` and rejects a Player ID that does not belong to the authenticated account.

## v5.4.0 Security Layer

- Security response headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`.
- `X-Powered-By` is disabled.
- Configurable CORS allowlist through `CORS_ORIGIN`.
- Smaller JSON request body limit (`128kb`).
- Separate in-memory rate limits for authentication traffic.
- Temporary login lockout after repeated failed attempts.
- Password verification uses constant-time comparison after `scrypt` derivation.
- Session logout and password change revoke sessions server-side.
- Password change generates a new salt/hash and keeps only the current session alive.
- Expired-session and rate-limit memory cleanup runs periodically.
- Server-side numeric bounds are applied to synced score/event fields.
- Generic server errors do not expose internal exception details.

Passwords are never stored as plaintext. Node.js `crypto.scryptSync()` derives a 64-byte password hash with a per-account random salt. Session tokens are random 32-byte values; only their SHA-256 hashes are stored in `db.json`.

## Environment

Optional production-oriented settings:

```text
PORT=3000
CORS_ORIGIN=https://your-github-pages-site.example,https://another-allowed-origin.example
TRUST_PROXY=1
```

Leave `CORS_ORIGIN` empty for local development if you need permissive development CORS. For a deployed service, set an explicit allowlist.

Only set `TRUST_PROXY=1` when the server is actually behind a trusted reverse proxy.

## Persistent storage

Player and account data are stored in `backend/db.json`.

The server keeps:

- Player ID and username
- Synced game events
- Total score
- Total correct answers
- Total questions
- Best single-run score
- Number of synced games
- Last update timestamp
- Account credentials (salt + derived password hash)
- Account/player relationship
- Hashed session tokens

Only the latest 500 events per player are retained. Writes are serialized to avoid overlapping file writes.

## Run

```bash
cd backend
npm install
npm start
```

The default port is `3000`. Set `PORT` to change it.

## Connect the frontend

The frontend's `QuizOnline.configure()` expects the API base URL. For example:

```js
QuizOnline.configure("http://localhost:3000");
```

Then open the **ONLINE** panel, create an account or log in, and use **SYNC NOW**.

## Production status

v5.4.0 is a stronger development/security foundation, but it is **not a production security audit** and the JSON database remains development-scale. Before public ranked competition, deploy behind HTTPS, use a production database, add persistent distributed rate limiting, email verification, password reset, secret management, backups, monitoring/audit logs and server-authoritative scoring/anti-cheat.

GitHub Pages only hosts the frontend; deploy the backend separately.
