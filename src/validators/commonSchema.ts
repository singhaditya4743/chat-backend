import { z } from 'zod';

// lowercase so the same id always matches
export const idSchema = z
  .uuid({ error: (issue) => (issue.input === undefined ? 'Required' : 'Must be a valid UUID') })
  .transform((id) => id.toLowerCase());

export const chatIdParamsSchema = z.object({ chatId: idSchema });

export const textSchema = (field: string, max: number) =>
  z
    .string({
      error: (issue) =>
        issue.input === undefined ? `${field} is required` : `${field} must be a string`,
    })
    .trim()
    .min(1, { error: `${field} cannot be empty` })
    .max(max, { error: `${field} cannot be longer than ${String(max)} characters` });
