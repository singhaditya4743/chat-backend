import { z } from 'zod';

export const idSchema = z.uuid({ error: 'Must be a valid UUID' });

// Trimmed, non-empty string with a max length, e.g. a user name or message text
export const textSchema = (field: string, max: number) =>
  z
    .string({
      error: (issue) =>
        issue.input === undefined ? `${field} is required` : `${field} must be a string`,
    })
    .trim()
    .min(1, { error: `${field} cannot be empty` })
    .max(max, { error: `${field} cannot be longer than ${String(max)} characters` });
