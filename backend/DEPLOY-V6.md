# Quiz Game v6.2.0 — Online Backend

## Deploy

This backend is designed to run as a Node web service. The repository root includes `render.yaml` as a deployment blueprint.

### Required settings

Set these environment variables in the hosting provider:

```text
CORS_ORIGIN=https://YOUR-GITHUB-PAGES-DOMAIN
TRUST_PROXY=1
```

`PORT` is provided by the hosting platform when available.

## Start

```bash
npm install
npm start
```

Health check:

```text
GET /health
```

Expected:

```json
{
  "ok": true,
  "version": "6.2.0",
  "backend": "v6"
}
```

## Frontend configuration

Open the game's Online Hub and configure the API base URL to the deployed backend URL, for example:

```text
https://YOUR-BACKEND.example.com
```

Do not put passwords, database credentials or private secrets into the frontend repository.

## Owner

The server recognizes exactly one Owner Player ID:

```text
97a6d561-9c6e-45fd-959e-6ccb00674187
```

Owner access is checked server-side from the authenticated session. The frontend Owner button does not grant permission.

Protected endpoints include:

```text
GET  /api/owner/status
GET  /api/owner/dashboard
GET  /api/owner/players
POST /api/owner/players/:playerId/reward
POST /api/owner/announce
```

A non-owner receives `403 Owner access required`.
