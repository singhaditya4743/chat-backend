import type { PoolClient } from 'pg';

// pool or a transaction client
export type Queryable = Pick<PoolClient, 'query'>;
