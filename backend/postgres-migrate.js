import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "db.json");
const SCHEMA_FILE = path.join(__dirname, "schema.sql");
const VERSION = "5.9.0";

function requireDatabaseUrl() {
  const url = String(process.env.DATABASE_URL || "").trim();
  if (!url) throw new Error("DATABASE_URL is required for PostgreSQL migration");
  return url;
}

async function loadJsonDatabase() {
  const raw = await fs.readFile(DB_FILE, "utf8");
  const data = JSON.parse(raw);
  return {
    accounts: data.accounts && typeof data.accounts === "object" ? data.accounts : {},
    players: data.players && typeof data.players === "object" ? data.players : {},
    sessions: data.sessions && typeof data.sessions === "object" ? data.sessions : {}
  };
}

async function migrate() {
  const pool = new Pool({
    connectionString: requireDatabaseUrl(),
    max: Number(process.env.DB_POOL_MAX || 10),
    connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS || 5000)
  });

  const data = await loadJsonDatabase();
  const schema = await fs.readFile(SCHEMA_FILE, "utf8");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(schema);

    for (const account of Object.values(data.accounts)) {
      await client.query(
        `INSERT INTO accounts (id, email, username, password_hash, created_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email, username = EXCLUDED.username,
           password_hash = EXCLUDED.password_hash, created_at = EXCLUDED.created_at`,
        [account.accountId, account.email, account.username, JSON.stringify({ salt: account.passwordSalt, hash: account.passwordHash }), account.createdAt]
      );
    }

    for (const player of Object.values(data.players)) {
      await client.query(
        `INSERT INTO players (id, username, total_score, total_correct, total_questions, best_score, games, last_update)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username,
           total_score = EXCLUDED.total_score, total_correct = EXCLUDED.total_correct,
           total_questions = EXCLUDED.total_questions, best_score = EXCLUDED.best_score,
           games = EXCLUDED.games, last_update = EXCLUDED.last_update`,
        [player.playerId, player.username, player.totalScore || 0, player.totalCorrect || 0, player.totalQuestions || 0, player.bestScore || 0, player.games || 0, player.updatedAt || new Date().toISOString()]
      );
    }

    for (const session of Object.entries(data.sessions)) {
      const [tokenHash, value] = session;
      await client.query(
        `INSERT INTO sessions (token_hash, account_id, expires_at)
         VALUES ($1, $2, $3)
         ON CONFLICT (token_hash) DO UPDATE SET account_id = EXCLUDED.account_id, expires_at = EXCLUDED.expires_at`,
        [tokenHash, value.accountId, value.expiresAt]
      );
    }

    await client.query("COMMIT");
    console.log(JSON.stringify({ ok: true, version: VERSION, accounts: Object.keys(data.accounts).length, players: Object.keys(data.players).length, sessions: Object.keys(data.sessions).length }, null, 2));
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(error => {
  console.error(JSON.stringify({ ok: false, version: VERSION, error: error.message }, null, 2));
  process.exitCode = 1;
});
