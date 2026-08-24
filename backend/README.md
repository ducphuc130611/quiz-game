# Quiz Game Online Backend — v5.2.0

This optional Node.js server upgrades the v5 online architecture with persistent JSON storage and a score-based leaderboard foundation.

## Endpoints

- `GET /health` — health/version and persistence check.
- `POST /players/sync` — accepts a Player ID, username and pending client events.
- `GET /leaderboard` — returns the top 100 players by accumulated score.

## Persistent storage

Player data is stored in `backend/db.json`.

The server keeps:

- Player ID and username
- Synced game events
- Total score
- Total correct answers
- Total questions
- Best single-run score
- Number of synced games
- Last update timestamp

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

## Important production note

The JSON database is persistent on a normal writable server filesystem, but it is still a development-scale database. A production deployment should add a real database, authentication, rate limiting, HTTPS, stronger schema validation, backups and transactional persistence before opening global accounts or competitive rankings to the public.
