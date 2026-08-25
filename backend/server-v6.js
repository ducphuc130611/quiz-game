import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ownerStatus, requireOwner } from "./owner-service.js";

const app = express();
const VERSION = "6.2.0";
const PORT = Number(process.env.PORT || 3000);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "db-v6.json");
const TOKEN_TTL = 30 * 24 * 60 * 60 * 1000;
const attempts = new Map();

const allowedOrigins = new Set(
  String(process.env.CORS_ORIGIN || "")
    .split(",")
    .map(value => value.trim())
    .filter(Boolean)
);

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.size === 0 || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed"));
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "128kb" }));

async function loadDb() {
  try {
    return JSON.parse(await fs.readFile(DB_FILE, "utf8"));
  } catch {
    return { version: VERSION, accounts: {}, players: {}, sessions: {}, announcements: [] };
  }
}

let db = await loadDb();
db.version = VERSION;
db.accounts ||= {};
db.players ||= {};
db.sessions ||= {};
db.announcements ||= [];

let writeChain = Promise.resolve();
function saveDb() {
  const snapshot = JSON.stringify(db, null, 2) + "\n";
  writeChain = writeChain.then(() => fs.writeFile(DB_FILE, snapshot, "utf8"));
  return writeChain;
}

function clean(value, max = 120) {
  return String(value ?? "").trim().slice(0, max);
}
function username(value) { return clean(value, 16); }
function email(value) { return clean(value, 120).toLowerCase(); }
function validUsername(value) { return /^[A-Za-z0-9_]{3,16}$/.test(value); }
function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function passwordHash(password, salt = crypto.randomBytes(16).toString("hex")) {
  return { salt, hash: crypto.scryptSync(password, salt, 64).toString("hex") };
}
function verifyPassword(password, salt, expected) {
  try {
    const actual = Buffer.from(crypto.scryptSync(password, salt, 64).toString("hex"), "hex");
    const wanted = Buffer.from(expected, "hex");
    return actual.length === wanted.length && crypto.timingSafeEqual(actual, wanted);
  } catch {
    return false;
  }
}
function token() { return crypto.randomBytes(32).toString("hex"); }
function tokenHash(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function publicAccount(account) {
  return {
    accountId: account.accountId,
    playerId: account.playerId,
    username: account.username,
    createdAt: account.createdAt
  };
}
function rateLimit(key, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const state = attempts.get(key);
  if (!state || now - state.started >= windowMs) {
    attempts.set(key, { started: now, count: 1 });
    return true;
  }
  state.count += 1;
  return state.count <= limit;
}

function auth(req, res, next) {
  const header = clean(req.headers.authorization, 200);
  const raw = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const hash = raw ? tokenHash(raw) : "";
  const session = hash ? db.sessions[hash] : null;
  if (!session || Date.parse(session.expiresAt) <= Date.now()) {
    if (session) delete db.sessions[hash];
    return res.status(401).json({ error: "Authentication required" });
  }
  req.sessionHash = hash;
  req.accountId = session.accountId;
  req.playerId = session.playerId;
  next();
}

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "quiz-game-online",
    version: VERSION,
    backend: "v6",
    persistence: "json-v6",
    authentication: "session",
    ownerAuthorization: "server-side"
  });
});

app.get("/api/version", (_req, res) => res.json({ version: VERSION, api: "v6" }));

app.post("/api/auth/register", async (req, res) => {
  if (!rateLimit(`register:${req.ip}`, 10)) return res.status(429).json({ error: "Too many registration attempts" });
  const user = username(req.body?.username);
  const mail = email(req.body?.email);
  const password = String(req.body?.password || "");
  if (!validUsername(user)) return res.status(400).json({ error: "Username must be 3-16 letters, numbers or underscores" });
  if (!validEmail(mail)) return res.status(400).json({ error: "Valid email is required" });
  if (password.length < 8 || password.length > 128) return res.status(400).json({ error: "Password must be 8-128 characters" });
  if (Object.values(db.accounts).some(account => account.email === mail)) return res.status(409).json({ error: "Email already registered" });
  if (Object.values(db.accounts).some(account => account.username.toLowerCase() === user.toLowerCase())) return res.status(409).json({ error: "Username already taken" });

  const accountId = crypto.randomUUID();
  const playerId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const credentials = passwordHash(password);
  db.accounts[accountId] = { accountId, playerId, username: user, email: mail, passwordSalt: credentials.salt, passwordHash: credentials.hash, createdAt };
  db.players[playerId] = { playerId, username: user, xp: 0, coins: 0, games: 0, wins: 0, losses: 0, createdAt, updatedAt: createdAt };

  const rawToken = token();
  db.sessions[tokenHash(rawToken)] = { accountId, playerId, expiresAt: new Date(Date.now() + TOKEN_TTL).toISOString() };
  await saveDb();
  res.status(201).json({ ok: true, token: rawToken, account: publicAccount(db.accounts[accountId]), owner: ownerStatus(playerId) });
});

app.post("/api/auth/login", async (req, res) => {
  if (!rateLimit(`login:${req.ip}`, 20)) return res.status(429).json({ error: "Too many login attempts" });
  const mail = email(req.body?.email);
  const password = String(req.body?.password || "");
  const account = Object.values(db.accounts).find(item => item.email === mail);
  if (!account || !verifyPassword(password, account.passwordSalt, account.passwordHash)) return res.status(401).json({ error: "Invalid email or password" });
  const rawToken = token();
  db.sessions[tokenHash(rawToken)] = { accountId: account.accountId, playerId: account.playerId, expiresAt: new Date(Date.now() + TOKEN_TTL).toISOString() };
  await saveDb();
  res.json({ ok: true, token: rawToken, account: publicAccount(account), owner: ownerStatus(account.playerId) });
});

app.get("/api/auth/me", auth, (req, res) => {
  const account = db.accounts[req.accountId];
  if (!account) return res.status(401).json({ error: "Account not found" });
  res.json({ ok: true, account: publicAccount(account), owner: ownerStatus(req.playerId) });
});

app.post("/api/auth/logout", auth, async (req, res) => {
  delete db.sessions[req.sessionHash];
  await saveDb();
  res.json({ ok: true });
});

app.get("/api/owner/status", auth, (req, res) => {
  res.json({ ok: true, ...ownerStatus(req.playerId) });
});

app.get("/api/owner/dashboard", auth, requireOwner, (_req, res) => {
  const players = Object.values(db.players);
  res.json({
    ok: true,
    version: VERSION,
    role: "owner",
    statistics: {
      players: players.length,
      accounts: Object.keys(db.accounts).length,
      activeSessions: Object.keys(db.sessions).length,
      announcements: db.announcements.length
    },
    features: ["player-control", "global-announcements", "economy", "maintenance"]
  });
});

app.get("/api/owner/players", auth, requireOwner, (_req, res) => {
  res.json({ ok: true, players: Object.values(db.players).map(player => ({ ...player })) });
});

app.post("/api/owner/players/:playerId/reward", auth, requireOwner, async (req, res) => {
  const player = db.players[req.params.playerId];
  if (!player) return res.status(404).json({ error: "Player not found" });
  const xp = Math.max(0, Math.min(1_000_000, Number(req.body?.xp) || 0));
  const coins = Math.max(0, Math.min(1_000_000, Number(req.body?.coins) || 0));
  player.xp += xp;
  player.coins += coins;
  player.updatedAt = new Date().toISOString();
  await saveDb();
  res.json({ ok: true, playerId: player.playerId, xp: player.xp, coins: player.coins });
});

app.post("/api/owner/announce", auth, requireOwner, async (req, res) => {
  const message = clean(req.body?.message, 240);
  if (!message) return res.status(400).json({ error: "Announcement message is required" });
  const announcement = { id: crypto.randomUUID(), message, createdAt: new Date().toISOString(), by: req.playerId };
  db.announcements.unshift(announcement);
  db.announcements = db.announcements.slice(0, 50);
  await saveDb();
  res.status(201).json({ ok: true, announcement });
});

app.get("/api/announcements", (_req, res) => res.json({ ok: true, announcements: db.announcements.slice(0, 20) }));

app.use((err, _req, res, _next) => {
  if (err?.message === "Origin not allowed") return res.status(403).json({ error: "Origin not allowed" });
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const server = app.listen(PORT, () => console.log(`Quiz Game Online API v${VERSION} listening on ${PORT}`));

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
