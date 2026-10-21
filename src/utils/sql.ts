import type { QueryResult, QueryResultRow } from 'pg';
import type { ModelDefinition } from '@/types/modelInterface';

// For INSERT ... RETURNING, where a missing row means something is badly wrong
export const firstRowOrThrow = <T extends QueryResultRow>(result: QueryResult<T>): T => {
  const row = result.rows[0];
  if (row === undefined) throw new Error('Query returned no rows');
  return row;
};

// Builds `alias.created_at AS "createdAt", ...` so query rows match the interface fields
export const selectColumns = <T>(model: ModelDefinition<T>, alias?: string): string => {
  const prefix = alias === undefined ? '' : `${alias}.`;

  return Object.entries<string>(model.columns)
    .map(([field, column]) => `${prefix}${column} AS "${field}"`)
    .join(', ');
};
