import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const players = new Map();

app.use(cors());
app.use(express.json({ limit: "256kb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "quiz-game-online", version: "5.1.0" });
});

app.post("/players/sync", (req, res) => {
  const { playerId, username, pending = [] } = req.body || {};
  if (typeof playerId !== "string" || !playerId.trim()) {
    return res.status(400).json({ error: "playerId is required" });
  }

  const safeName = String(username || "Player").trim().slice(0, 16) || "Player";
  const previous = players.get(playerId) || { playerId, events: [] };
  const events = Array.isArray(pending) ? pending.slice(-100) : [];

  players.set(playerId, {
    playerId,
    username: safeName,
    events: [...previous.events, ...events].slice(-500),
    updatedAt: new Date().toISOString()
  });

  return res.json({ ok: true, playerId, username: safeName, accepted: events.length });
});

app.get("/leaderboard", (_req, res) => {
  const rows = [...players.values()].map(p => ({
    playerId: p.playerId,
    username: p.username,
    events: p.events.length,
    updatedAt: p.updatedAt
  }));
  rows.sort((a, b) => b.events - a.events);
  res.json({ version: "5.1.0", leaderboard: rows.slice(0, 100) });
});

app.listen(PORT, () => console.log(`Quiz Game Online API listening on ${PORT}`));
