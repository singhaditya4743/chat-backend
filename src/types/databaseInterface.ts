import type { PoolClient } from 'pg';

// Anything that can run a query: the shared pool, or a client inside a transaction
export type Queryable = Pick<PoolClient, 'query'>;
