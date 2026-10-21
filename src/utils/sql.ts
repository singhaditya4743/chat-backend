import type { QueryResult, QueryResultRow } from 'pg';
import type { ModelDefinition } from '@/types/modelInterface';

export const firstRowOrThrow = <T extends QueryResultRow>(result: QueryResult<T>): T => {
  const row = result.rows[0];
  if (row === undefined) throw new Error('Query returned no rows');
  return row;
};

// created_at AS "createdAt", ... so rows match the interface
export const selectColumns = <T>(model: ModelDefinition<T>, alias?: string): string => {
  const prefix = alias === undefined ? '' : `${alias}.`;

  return Object.entries<string>(model.columns)
    .map(([field, column]) => `${prefix}${column} AS "${field}"`)
    .join(', ');
};
