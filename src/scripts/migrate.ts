import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pool, withTransaction } from '@/config/database';
import { runScript } from '@/scripts/runScript';

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'database', 'migrations');

const ensureMigrationsTable = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name       VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const getAppliedMigrations = async (): Promise<Set<string>> => {
  const result = await pool.query<{ name: string }>('SELECT name FROM schema_migrations');
  return new Set(result.rows.map((row) => row.name));
};

const applyMigration = async (file: string): Promise<void> => {
  const sql = await readFile(path.join(MIGRATIONS_DIR, file), 'utf8');

  await withTransaction(async (client) => {
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
  });
  console.log(`Applied ${file}`);
};

const migrate = async (): Promise<void> => {
  await ensureMigrationsTable();
  const applied = await getAppliedMigrations();

  const files = (await readdir(MIGRATIONS_DIR)).filter((file) => file.endsWith('.sql')).sort();
  const pending = files.filter((file) => !applied.has(file));

  if (pending.length === 0) {
    console.log('No pending migrations');
    return;
  }

  // one by one, later files can depend on earlier ones
  for (const file of pending) {
    await applyMigration(file);
  }
};

runScript('Migration', migrate);
