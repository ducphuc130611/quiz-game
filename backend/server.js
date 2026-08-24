import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "db.json");
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;
const requests = new Map();

app.use(cors());
app.use(express.json({ limit: "256kb" }));

async function readDb() {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return { version: "5.3.0", players: {}, accounts: {}, sessions: {} };
  }
}

let db = await readDb();
db.version = "5.3.0";
if (!db.players || typeof db.players !== "object") db.players = {};
if (!db.accounts || typeof db.accounts !== "object") db.accounts = {};
if (!db.sessions || typeof db.sessions !== "object") db.sessions = {};

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

function normalizeUsername(value) {
  return String(value || "").trim().slice(0, 16);
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase().slice(0, 120);
}

function validUsername(value) {
  return /^[A-Za-z0-9_]{3,16}$/.test(value);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, expected) {
  const actual = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"));
}

function createToken() {
  return crypto.randomBytes(32).toString("hex");
}

function tokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function rateLimit(req, res, next) {
  const key = req.ip || "unknown";
  const now = Date.now();
  const old = requests.get(key);
  if (!old || now - old.started > RATE_WINDOW_MS) {
    requests.set(key, { started: now, count: 1 });
    return next();
  }
  old.count += 1;
  if (old.count > RATE_LIMIT) return res.status(429).json({ error: "Too many requests" });
  next();
}

function auth(req, res, next) {
  const header = String(req.headers.authorization || "");
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const session = token ? db.sessions[tokenHash(token)] : null;
  if (!session || Date.parse(session.expiresAt) <= Date.now()) {
    if (session) delete db.sessions[tokenHash(token)];
    return res.status(401).json({ error: "Authentication required" });
  }
  req.accountId = session.accountId;
  req.playerId = session.playerId;
  next();
}

function publicAccount(account) {
  return { accountId: account.accountId, playerId: account.playerId, username: account.username, createdAt: account.createdAt };
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
  res.json({ ok: true, service: "quiz-game-online", version: "5.3.0", persistence: "json", authentication: "session" });
});

app.post("/auth/register", rateLimit, async (req, res) => {
  const username = normalizeUsername(req.body?.username);
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  if (!validUsername(username)) return res.status(400).json({ error: "Username must be 3-16 letters, numbers or underscores" });
  if (!validEmail(email)) return res.status(400).json({ error: "Valid email is required" });
  if (password.length < 8 || password.length > 128) return res.status(400).json({ error: "Password must be 8-128 characters" });
  if (Object.values(db.accounts).some(a => a.email === email)) return res.status(409).json({ error: "Email already registered" });
  if (Object.values(db.accounts).some(a => a.username.toLowerCase() === username.toLowerCase())) return res.status(409).json({ error: "Username already taken" });

  const accountId = crypto.randomUUID();
  const playerId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const credentials = hashPassword(password);
  db.accounts[accountId] = { accountId, playerId, username, email, passwordSalt: credentials.salt, passwordHash: credentials.hash, createdAt };
  db.players[playerId] = { playerId, username, events: [], totalScore: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0, games: 0, updatedAt: createdAt };
  const token = createToken();
  db.sessions[tokenHash(token)] = { accountId, playerId, expiresAt: new Date(Date.now() + TOKEN_TTL_MS).toISOString() };
  await persistDb();
  res.status(201).json({ ok: true, token, account: publicAccount(db.accounts[accountId]) });
});

app.post("/auth/login", rateLimit, async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  const account = Object.values(db.accounts).find(a => a.email === email);
  if (!account || !verifyPassword(password, account.passwordSalt, account.passwordHash)) return res.status(401).json({ error: "Invalid email or password" });
  const token = createToken();
  db.sessions[tokenHash(token)] = { accountId: account.accountId, playerId: account.playerId, expiresAt: new Date(Date.now() + TOKEN_TTL_MS).toISOString() };
  await persistDb();
  res.json({ ok: true, token, account: publicAccount(account) });
});

app.get("/auth/me", auth, (req, res) => {
  const account = db.accounts[req.accountId];
  if (!account) return res.status(401).json({ error: "Account not found" });
  res.json({ ok: true, account: publicAccount(account) });
});

app.post("/auth/logout", auth, async (req, res) => {
  const header = String(req.headers.authorization || "");
  const token = header.slice(7).trim();
  delete db.sessions[tokenHash(token)];
  await persistDb();
  res.json({ ok: true });
});

app.post("/players/sync", auth, async (req, res) => {
  const { playerId, username, pending = [] } = req.body || {};
  if (playerId !== req.playerId) return res.status(403).json({ error: "Player identity mismatch" });
  const account = db.accounts[req.accountId];
  const safeName = normalizeUsername(username) || account.username;
  if (!validUsername(safeName)) return res.status(400).json({ error: "Invalid username" });
  const previous = db.players[playerId] || { playerId, username: safeName, events: [], totalScore: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0, games: 0 };
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
  account.username = safeName;
  db.players[playerId] = previous;
  await persistDb();
  res.json({ ok: true, playerId, username: safeName, accepted: incoming.length, games: previous.games, bestScore: previous.bestScore });
});

app.get("/leaderboard", (_req, res) => {
  const rows = Object.values(db.players).map(player => ({ playerId: player.playerId, username: player.username, score: player.totalScore, bestScore: player.bestScore, games: player.games, accuracy: player.totalQuestions ? Math.round((player.totalCorrect / player.totalQuestions) * 10000) / 100 : 0, updatedAt: player.updatedAt }));
  rows.sort((a, b) => b.score - a.score || b.bestScore - a.bestScore);
  res.json({ version: "5.3.0", leaderboard: rows.slice(0, 100) });
});

setInterval(() => {
  const now = Date.now();
  for (const [hash, session] of Object.entries(db.sessions)) if (Date.parse(session.expiresAt) <= now) delete db.sessions[hash];
}, 60 * 60 * 1000).unref();

app.listen(PORT, () => console.log(`Quiz Game Online API listening on ${PORT}`));
