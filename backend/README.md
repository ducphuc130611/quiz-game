# Quiz Game Online Backend — v5.3.0

This optional Node.js server upgrades the v5 online architecture with persistent JSON storage, authenticated accounts, protected player sync and a score-based leaderboard foundation.

## Endpoints

### Authentication

- `POST /auth/register` — create an account with email, username and password.
- `POST /auth/login` — authenticate and receive a session token.
- `GET /auth/me` — inspect the authenticated account.
- `POST /auth/logout` — revoke the current session.

### Game data

- `GET /health` — health/version, persistence and authentication status.
- `POST /players/sync` — accepts authenticated Player ID, username and pending client events.
- `GET /leaderboard` — returns the top 100 players by accumulated score.

`/players/sync` requires `Authorization: Bearer <session-token>` and rejects a Player ID that does not belong to the authenticated account.

## Security foundation

Passwords are never stored as plaintext. Node.js `crypto.scryptSync()` derives a 64-byte password hash with a per-account random salt. Session tokens are random 32-byte values; only their SHA-256 hashes are stored in `db.json`.

Authentication requests have a simple in-memory rate limit. Sessions expire after 30 days and expired sessions are periodically removed.

This is a foundation, not a production security audit. Production should add HTTPS, a production database, persistent rate limiting, email verification, password reset, CSRF/origin policy, audit logging, secret management and stronger abuse prevention.

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

## Production note

The JSON database is persistent on a normal writable server filesystem, but it remains development-scale. GitHub Pages only hosts the frontend; deploy the backend separately.
