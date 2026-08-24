import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "db.json");

app.use(cors());
app.use(express.json({ limit: "256kb" }));

async function readDb() {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return { version: "5.2.0", players: {} };
  }
}

let db = await readDb();
if (!db.players || typeof db.players !== "object") db.players = {};

let writeChain = Promise.resolve();
function persistDb() {
  const snapshot = JSON.stringify(db, null, 2) + "\n";
  writeChain = writeChain.then(() => fs.writeFile(DB_FILE, snapshot, "utf8"));
  return writeChain;
}

function safeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeEvent(event) {
  const source = event && typeof event === "object" ? event : {};
  return {
    score: Math.max(0, safeNumber(source.score)),
    correct: Math.max(0, safeNumber(source.correct)),
    total: Math.max(0, safeNumber(source.total)),
    mode: String(source.mode || "unknown").slice(0, 32),
    createdAt: String(source.createdAt || new Date().toISOString()).slice(0, 40)
  };
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "quiz-game-online", version: "5.2.0", persistence: "json" });
});

app.post("/players/sync", async (req, res) => {
  const { playerId, username, pending = [] } = req.body || {};
  if (typeof playerId !== "string" || !playerId.trim()) {
    return res.status(400).json({ error: "playerId is required" });
  }

  const safeName = String(username || "Player").trim().slice(0, 16) || "Player";
  const previous = db.players[playerId] || {
    playerId,
    username: safeName,
    events: [],
    totalScore: 0,
    totalCorrect: 0,
    totalQuestions: 0,
    bestScore: 0,
    games: 0
  };

  const incoming = Array.isArray(pending) ? pending.slice(-100).map(normalizeEvent) : [];
  for (const event of incoming) {
    previous.events.push(event);
    previous.totalScore += event.score;
    previous.totalCorrect += event.correct;
    previous.totalQuestions += event.total;
    previous.bestScore = Math.max(previous.bestScore, event.score);
    previous.games += 1;
  }

  previous.events = previous.events.slice(-500);
  previous.username = safeName;
  previous.updatedAt = new Date().toISOString();
  db.players[playerId] = previous;

  await persistDb();
  return res.json({
    ok: true,
    playerId,
    username: safeName,
    accepted: incoming.length,
    games: previous.games,
    bestScore: previous.bestScore
  });
});

app.get("/leaderboard", (_req, res) => {
  const rows = Object.values(db.players).map(player => ({
    playerId: player.playerId,
    username: player.username,
    score: player.totalScore,
    bestScore: player.bestScore,
    games: player.games,
    accuracy: player.totalQuestions ? Math.round((player.totalCorrect / player.totalQuestions) * 10000) / 100 : 0,
    updatedAt: player.updatedAt
  }));

  rows.sort((a, b) => b.score - a.score || b.bestScore - a.bestScore);
  res.json({ version: "5.2.0", leaderboard: rows.slice(0, 100) });
});

app.listen(PORT, () => console.log(`Quiz Game Online API listening on ${PORT}`));
