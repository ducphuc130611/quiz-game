import pg from "pg";

const { Pool } = pg;
const VERSION = "5.9.0";

let pool = null;

function getConnectionString() {
  return process.env.DATABASE_URL || "";
}

export function isPostgresConfigured() {
  return Boolean(getConnectionString());
}

export async function initPostgres() {
  if (!isPostgresConfigured()) return null;

  pool = new Pool({
    connectionString: getConnectionString(),
    max: Number(process.env.DB_POOL_MAX || 10),
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS || 30000),
    connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS || 5000)
  });

  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
  } finally {
    client.release();
  }

  return pool;
}

export function getPostgresPool() {
  if (!pool) throw new Error("PostgreSQL has not been initialized");
  return pool;
}

export async function closePostgres() {
  if (!pool) return;
  await pool.end();
  pool = null;
}

export async function withTransaction(callback) {
  const db = getPostgresPool();
  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export const postgresInfo = {
  engine: "postgresql",
  version: VERSION,
  configuredBy: "DATABASE_URL"
};
