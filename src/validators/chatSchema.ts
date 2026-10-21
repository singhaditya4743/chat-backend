import { z } from 'zod';
import { idSchema } from '@/validators/commonSchema';

export const createChatSchema = z.object({
  body: z
    .object({
      userAId: idSchema,
      userBId: idSchema,
    })
    .refine((body) => body.userAId !== body.userBId, {
      error: 'userAId and userBId must be different users',
      path: ['userBId'],
    }),
});
