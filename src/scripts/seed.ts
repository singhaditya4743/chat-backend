import { pool } from '@/config/database';
import { runScript } from '@/scripts/runScript';

// fixed ids so they stay the same after a reseed
const SEED_USERS = [
  { id: '11111111-1111-4111-8111-111111111111', name: 'Alice' },
  { id: '22222222-2222-4222-8222-222222222222', name: 'Bob' },
  { id: '33333333-3333-4333-8333-333333333333', name: 'Charlie' },
  { id: '44444444-4444-4444-8444-444444444444', name: 'David' },
] as const;

const seed = async (): Promise<void> => {
  const result = await pool.query(
    `INSERT INTO users (id, name)
     SELECT * FROM UNNEST($1::uuid[], $2::text[])
     ON CONFLICT (id) DO NOTHING`,
    [SEED_USERS.map((user) => user.id), SEED_USERS.map((user) => user.name)],
  );
  console.log(`Inserted ${String(result.rowCount ?? 0)} of ${String(SEED_USERS.length)} users`);
};

runScript('Seed', seed);
