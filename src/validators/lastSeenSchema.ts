import { z } from 'zod';
import { idSchema } from '@/validators/commonSchema';
import { messageIdSchema } from '@/validators/messageSchema';

export const updateLastSeenSchema = z.object({
  params: z.object({
    chatId: idSchema,
  }),
  body: z.object({
    userId: idSchema,
    messageId: messageIdSchema,
  }),
});
