import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, "db.json");
const BACKUP_DIR = path.join(__dirname, "backups");
const VERSION = "5.8.0";

let state = null;
let writeChain = Promise.resolve();

const emptyState = () => ({ version: VERSION, players: {}, accounts: {}, sessions: {} });

export async function initDatabase() {
  try {
    state = JSON.parse(await fs.readFile(DB_FILE, "utf8"));
  } catch {
    state = emptyState();
  }
  if (!state || typeof state !== "object") state = emptyState();
  for (const key of ["players", "accounts", "sessions"]) {
    if (!state[key] || typeof state[key] !== "object") state[key] = {};
  }
  state.version = VERSION;
  return state;
}

export function getDatabase() {
  if (!state) throw new Error("Database has not been initialized");
  return state;
}

export function queuePersist() {
  const snapshot = JSON.stringify(state, null, 2) + "\n";
  writeChain = writeChain.then(() => fs.writeFile(DB_FILE, snapshot, "utf8"));
  return writeChain;
}

export async function createBackup(label = "manual") {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const file = path.join(BACKUP_DIR, `db-${label}-${stamp}.json`);
  await fs.writeFile(file, JSON.stringify(getDatabase(), null, 2) + "\n", "utf8");
  return file;
}

export async function migrateDatabase() {
  const db = getDatabase();
  db.version = VERSION;
  await queuePersist();
  return { version: db.version, players: Object.keys(db.players).length, accounts: Object.keys(db.accounts).length };
}

export const databaseInfo = {
  engine: "persistent-json-adapter",
  productionTarget: "PostgreSQL",
  version: VERSION
};
