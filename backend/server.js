import express from "express";
import cors from "cors";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { registerGlobalLeaderboardRoutes } from "./global-leaderboard.js";
import { QUESTION_BANK, publicQuestion } from "./question-bank.js";
import { createRun, validateAnswer, validateRun } from "./anti-cheat.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "db.json");
const VERSION = "5.6.0";
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const RATE_WINDOW_MS = 60_000;
const GENERAL_RATE_LIMIT = 60;
const AUTH_RATE_LIMIT = 10;
const RUN_RATE_LIMIT = 20;
const LOGIN_LOCKOUT_MS = 15 * 60 * 1000;
const MAX_LOGIN_FAILURES = 5;
const requests = new Map();
const loginFailures = new Map();
const activeRuns = new Map();

const allowedOrigins = new Set(String(process.env.CORS_ORIGIN || "").split(",").map(v => v.trim()).filter(Boolean));
app.disable("x-powered-by");
app.set("trust proxy", process.env.TRUST_PROXY === "1");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});
app.use(cors({ origin(origin, callback) { if (!origin || allowedOrigins.size === 0 || allowedOrigins.has(origin)) return callback(null, true); return callback(new Error("Origin not allowed")); }, methods: ["GET", "POST", "OPTIONS"], allowedHeaders: ["Content-Type", "Authorization"] }));
app.use(express.json({ limit: "128kb" }));

async function readDb() {
  try { return JSON.parse(await fs.readFile(DB_FILE, "utf8")); }
  catch { return { version: VERSION, players: {}, accounts: {}, sessions: {} }; }
}
let db = await readDb();
db.version = VERSION;
if (!db.players || typeof db.players !== "object") db.players = {};
if (!db.accounts || typeof db.accounts !== "object") db.accounts = {};
if (!db.sessions || typeof db.sessions !== "object") db.sessions = {};
let writeChain = Promise.resolve();
function persistDb() { const snapshot = JSON.stringify(db, null, 2) + "\n"; writeChain = writeChain.then(() => fs.writeFile(DB_FILE, snapshot, "utf8")); return writeChain; }
function safeNumber(value, fallback = 0) { const n = Number(value); return Number.isFinite(n) ? n : fallback; }
function normalizeUsername(value) { return String(value || "").trim().slice(0, 16); }
function normalizeEmail(value) { return String(value || "").trim().toLowerCase().slice(0, 120); }
function validUsername(value) { return /^[A-Za-z0-9_]{3,16}$/.test(value); }
function validEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) { const hash = crypto.scryptSync(password, salt, 64).toString("hex"); return { salt, hash }; }
function verifyPassword(password, salt, expected) { const actualBuffer = Buffer.from(crypto.scryptSync(password, salt, 64).toString("hex"), "hex"); const expectedBuffer = Buffer.from(expected, "hex"); if (actualBuffer.length !== expectedBuffer.length) return false; return crypto.timingSafeEqual(actualBuffer, expectedBuffer); }
function createToken() { return crypto.randomBytes(32).toString("hex"); }
function tokenHash(token) { return crypto.createHash("sha256").update(token).digest("hex"); }
function requestRateLimit(limit) { return (req, res, next) => { const key = `${limit}:${req.ip || "unknown"}`; const now = Date.now(); const old = requests.get(key); if (!old || now - old.started > RATE_WINDOW_MS) { requests.set(key, { started: now, count: 1 }); return next(); } old.count += 1; if (old.count > limit) return res.status(429).json({ error: "Too many requests" }); next(); }; }
function auth(req, res, next) { const header = String(req.headers.authorization || ""); const token = header.startsWith("Bearer ") ? header.slice(7).trim() : ""; const hash = token ? tokenHash(token) : ""; const session = hash ? db.sessions[hash] : null; if (!session || Date.parse(session.expiresAt) <= Date.now()) { if (session) delete db.sessions[hash]; return res.status(401).json({ error: "Authentication required" }); } req.sessionHash = hash; req.accountId = session.accountId; req.playerId = session.playerId; next(); }
function publicAccount(account) { return { accountId: account.accountId, playerId: account.playerId, username: account.username, createdAt: account.createdAt }; }
function normalizeEvent(event) { const source = event && typeof event === "object" ? event : {}; return { score: Math.max(0, Math.min(1000000, safeNumber(source.score))), correct: Math.max(0, Math.min(1000, safeNumber(source.correct))), total: Math.max(0, Math.min(1000, safeNumber(source.total))), mode: String(source.mode || "unknown").slice(0, 32), season: String(source.season || "all").slice(0, 32), createdAt: String(source.createdAt || new Date().toISOString()).slice(0, 40) }; }
function loginKey(req, email) { return `${req.ip || "unknown"}:${email}`; }
function isLocked(key) { const state = loginFailures.get(key); if (!state) return false; if (state.lockedUntil && state.lockedUntil > Date.now()) return true; if (state.lockedUntil && state.lockedUntil <= Date.now()) loginFailures.delete(key); return false; }
function recordLoginFailure(key) { const state = loginFailures.get(key) || { count: 0, lockedUntil: 0 }; state.count += 1; if (state.count >= MAX_LOGIN_FAILURES) state.lockedUntil = Date.now() + LOGIN_LOCKOUT_MS; loginFailures.set(key, state); }
function clearLoginFailures(key) { loginFailures.delete(key); }

app.get("/health", (_req, res) => res.json({ ok: true, service: "quiz-game-online", version: VERSION, persistence: "json", authentication: "session", security: "5.4", globalLeaderboard: "5.5", authoritativeRuns: "5.6" }));

app.post("/auth/register", requestRateLimit(AUTH_RATE_LIMIT), async (req, res) => {
  const username = normalizeUsername(req.body?.username), email = normalizeEmail(req.body?.email), password = String(req.body?.password || "");
  if (!validUsername(username)) return res.status(400).json({ error: "Username must be 3-16 letters, numbers or underscores" });
  if (!validEmail(email)) return res.status(400).json({ error: "Valid email is required" });
  if (password.length < 8 || password.length > 128) return res.status(400).json({ error: "Password must be 8-128 characters" });
  if (Object.values(db.accounts).some(a => a.email === email)) return res.status(409).json({ error: "Email already registered" });
  if (Object.values(db.accounts).some(a => a.username.toLowerCase() === username.toLowerCase())) return res.status(409).json({ error: "Username already taken" });
  const accountId = crypto.randomUUID(), playerId = crypto.randomUUID(), createdAt = new Date().toISOString(), credentials = hashPassword(password);
  db.accounts[accountId] = { accountId, playerId, username, email, passwordSalt: credentials.salt, passwordHash: credentials.hash, createdAt };
  db.players[playerId] = { playerId, username, events: [], totalScore: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0, games: 0, updatedAt: createdAt };
  const token = createToken(); db.sessions[tokenHash(token)] = { accountId, playerId, expiresAt: new Date(Date.now() + TOKEN_TTL_MS).toISOString() };
  await persistDb(); res.status(201).json({ ok: true, token, account: publicAccount(db.accounts[accountId]) });
});

app.post("/auth/login", requestRateLimit(AUTH_RATE_LIMIT), async (req, res) => {
  const email = normalizeEmail(req.body?.email), password = String(req.body?.password || ""), key = loginKey(req, email);
  if (isLocked(key)) return res.status(429).json({ error: "Login temporarily locked. Try again later." });
  const account = Object.values(db.accounts).find(a => a.email === email);
  if (!account || !verifyPassword(password, account.passwordSalt, account.passwordHash)) { recordLoginFailure(key); return res.status(401).json({ error: "Invalid email or password" }); }
  clearLoginFailures(key); const token = createToken(); db.sessions[tokenHash(token)] = { accountId: account.accountId, playerId: account.playerId, expiresAt: new Date(Date.now() + TOKEN_TTL_MS).toISOString() }; await persistDb();
  res.json({ ok: true, token, account: publicAccount(account) });
});
app.get("/auth/me", auth, (req, res) => { const account = db.accounts[req.accountId]; if (!account) return res.status(401).json({ error: "Account not found" }); res.json({ ok: true, account: publicAccount(account) }); });
app.post("/auth/logout", auth, async (req, res) => { delete db.sessions[req.sessionHash]; await persistDb(); res.json({ ok: true }); });
app.post("/auth/logout-all", auth, async (req, res) => { for (const [hash, session] of Object.entries(db.sessions)) if (session.accountId === req.accountId) delete db.sessions[hash]; await persistDb(); res.json({ ok: true }); });
app.post("/auth/change-password", auth, requestRateLimit(AUTH_RATE_LIMIT), async (req, res) => { const account = db.accounts[req.accountId], currentPassword = String(req.body?.currentPassword || ""), newPassword = String(req.body?.newPassword || ""); if (!account || !verifyPassword(currentPassword, account.passwordSalt, account.passwordHash)) return res.status(401).json({ error: "Current password is incorrect" }); if (newPassword.length < 8 || newPassword.length > 128) return res.status(400).json({ error: "Password must be 8-128 characters" }); if (newPassword === currentPassword) return res.status(400).json({ error: "New password must be different" }); const credentials = hashPassword(newPassword); account.passwordSalt = credentials.salt; account.passwordHash = credentials.hash; for (const [hash, session] of Object.entries(db.sessions)) if (session.accountId === req.accountId && hash !== req.sessionHash) delete db.sessions[hash]; await persistDb(); res.json({ ok: true, message: "Password changed. Other sessions were revoked." }); });

app.post("/players/sync", auth, async (req, res) => {
  const { playerId, username, pending = [] } = req.body || {}; if (playerId !== req.playerId) return res.status(403).json({ error: "Player identity mismatch" });
  const account = db.accounts[req.accountId], safeName = normalizeUsername(username) || account.username; if (!validUsername(safeName)) return res.status(400).json({ error: "Invalid username" });
  const previous = db.players[playerId] || { playerId, username: safeName, events: [], totalScore: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0, games: 0 };
  const incoming = Array.isArray(pending) ? pending.slice(-100).map(normalizeEvent) : [];
  for (const event of incoming) { previous.events.push(event); previous.totalScore += event.score; previous.totalCorrect += event.correct; previous.totalQuestions += event.total; previous.bestScore = Math.max(previous.bestScore, event.score); previous.games += 1; }
  previous.events = previous.events.slice(-500); previous.username = safeName; previous.updatedAt = new Date().toISOString(); account.username = safeName; db.players[playerId] = previous; await persistDb();
  res.json({ ok: true, playerId, username: safeName, accepted: incoming.length, games: previous.games, bestScore: previous.bestScore });
});

app.post("/runs/start", auth, requestRateLimit(RUN_RATE_LIMIT), async (req, res) => {
  const mode = String(req.body?.mode || "ranked").slice(0, 24); if (mode !== "ranked") return res.status(400).json({ error: "Only ranked runs use the authoritative server" });
  if (activeRuns.has(req.playerId)) return res.status(409).json({ error: "An active ranked run already exists" });
  const count = Math.max(5, Math.min(12, Number(req.body?.count) || 10));
  const shuffled = [...QUESTION_BANK].sort(() => crypto.randomInt(-1000, 1001));
  const questions = shuffled.slice(0, Math.min(count, QUESTION_BANK.length));
  const run = createRun(req.playerId, questions, mode); activeRuns.set(run.runId, run);
  res.status(201).json({ ok: true, runId: run.runId, nonce: run.nonce, expiresAt: new Date(run.expiresAt).toISOString(), questions: questions.map(publicQuestion) });
});

app.post("/runs/:runId/answer", auth, requestRateLimit(RUN_RATE_LIMIT), async (req, res) => {
  const run = activeRuns.get(req.params.runId); if (!run || run.playerId !== req.playerId) return res.status(404).json({ error: "Run not found" });
  const questionId = String(req.body?.questionId || ""); const question = QUESTION_BANK.find(q => q.id === questionId);
  if (!question || !run.questions.includes(questionId)) return res.status(400).json({ error: "Invalid question" });
  if (run.answers.some(a => a.questionId === questionId)) return res.status(409).json({ error: "Question already answered" });
  const result = validateAnswer(run, question, Number(req.body?.answer), Number(req.body?.elapsedMs)); if (!result.ok) return res.status(400).json({ error: result.error });
  run.answers.push({ questionId, correct: result.correct, points: result.points }); run.score += result.points; if (result.correct) run.correct += 1;
  res.json({ ok: true, correct: result.correct, points: result.points, answered: run.answers.length, total: run.questions.length });
});

app.post("/runs/:runId/finish", auth, async (req, res) => {
  const run = activeRuns.get(req.params.runId); if (!run || run.playerId !== req.playerId) return res.status(404).json({ error: "Run not found" });
  const valid = validateRun(run, run.questions.length); if (!valid.ok) return res.status(400).json({ error: valid.error });
  run.finished = true; activeRuns.delete(run.runId);
  const player = db.players[req.playerId] || { playerId: req.playerId, username: db.accounts[req.accountId].username, events: [], totalScore: 0, totalCorrect: 0, totalQuestions: 0, bestScore: 0, games: 0 };
  const event = { score: run.score, correct: run.correct, total: run.questions.length, mode: "ranked", season: String(req.body?.season || "all").slice(0, 32), createdAt: new Date().toISOString(), authoritative: true };
  player.events.push(event); player.events = player.events.slice(-500); player.totalScore += run.score; player.totalCorrect += run.correct; player.totalQuestions += run.questions.length; player.bestScore = Math.max(player.bestScore, run.score); player.games += 1; player.updatedAt = event.createdAt; db.players[req.playerId] = player; await persistDb();
  res.json({ ok: true, runId: run.runId, score: run.score, correct: run.correct, total: run.questions.length, authoritative: true });
});

app.get("/leaderboard", (_req, res) => { const rows = Object.values(db.players).map(player => ({ playerId: player.playerId, username: player.username, score: player.totalScore, bestScore: player.bestScore, games: player.games, accuracy: player.totalQuestions ? Math.round((player.totalCorrect / player.totalQuestions) * 10000) / 100 : 0, updatedAt: player.updatedAt })); rows.sort((a, b) => b.score - a.score || b.bestScore - a.bestScore); res.json({ version: VERSION, leaderboard: rows.slice(0, 100) }); });
registerGlobalLeaderboardRoutes(app, { db, auth, version: VERSION });

setInterval(() => { const now = Date.now(); for (const [hash, session] of Object.entries(db.sessions)) if (Date.parse(session.expiresAt) <= now) delete db.sessions[hash]; for (const [key, state] of loginFailures.entries()) if (state.lockedUntil && state.lockedUntil <= now) loginFailures.delete(key); for (const [key, state] of requests.entries()) if (now - state.started > RATE_WINDOW_MS) requests.delete(key); for (const [id, run] of activeRuns.entries()) if (run.expiresAt <= now) activeRuns.delete(id); }, 60 * 60 * 1000).unref();
app.use((err, _req, res, _next) => { if (err?.message === "Origin not allowed") return res.status(403).json({ error: "Origin not allowed" }); console.error(err); res.status(500).json({ error: "Internal server error" }); });
app.listen(PORT, () => console.log(`Quiz Game Online API v${VERSION} listening on ${PORT}`));
