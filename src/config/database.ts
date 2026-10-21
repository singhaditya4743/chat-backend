import { Pool } from 'pg';
import type { PoolClient } from 'pg';
import { env } from '@/config/env';

export const pool = new Pool({
  connectionString: env.databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

// Neon closes idle connections; log instead of crashing the process
pool.on('error', (error) => {
  console.error('PostgreSQL pool error:', error.message);
});

export const checkDatabaseConnection = async (): Promise<void> => {
  await pool.query('SELECT 1');
};

export const withTransaction = async <T>(work: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const closeDatabase = async (): Promise<void> => {
  await pool.end();
};
