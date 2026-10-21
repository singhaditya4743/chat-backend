import { z } from 'zod';
import { idSchema, textSchema } from '@/validators/commonSchema';

export const createUserSchema = z.object({
  body: z.object({
    name: textSchema('name', 100),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: idSchema,
  }),
});
