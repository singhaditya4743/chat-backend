import { z } from 'zod';

// Lowercased so the same UUID in a different case can't look like a different user
export const idSchema = z
  .uuid({ error: 'Must be a valid UUID' })
  .transform((id) => id.toLowerCase());

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
