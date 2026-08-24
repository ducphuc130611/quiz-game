import { initDatabase, migrateDatabase, createBackup, databaseInfo } from "./database.js";

await initDatabase();
const backup = await createBackup("pre-migration");
const result = await migrateDatabase();

console.log(JSON.stringify({
  ok: true,
  database: databaseInfo,
  backup,
  migrated: result
}, null, 2));
