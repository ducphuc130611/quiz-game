# Quiz Game Online Backend — v5.1.0

This optional Node.js server is the first runnable backend for the v5 online architecture.

## Endpoints

- `GET /health` — health/version check.
- `POST /players/sync` — accepts a Player ID, username and pending client events.
- `GET /leaderboard` — returns the current in-memory online player activity ranking.

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

This backend is intentionally minimal and uses memory storage. Restarting the server clears its data. A production deployment should replace the `Map` with a database, add authentication, rate limiting, validation, HTTPS and persistent leaderboard storage.
