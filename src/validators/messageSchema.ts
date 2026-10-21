import { z } from 'zod';
import { idSchema, textSchema } from '@/validators/commonSchema';

const chatIdParams = z.object({ chatId: idSchema });

// Firestore auto IDs are 20 characters; allow some room
export const messageIdSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? 'messageId is required' : 'messageId must be a string',
  })
  .trim()
  .min(1, { error: 'messageId cannot be empty' })
  .max(128, { error: 'messageId is too long' });

export const sendMessageSchema = z.object({
  params: chatIdParams,
  body: z.object({
    senderId: idSchema,
    text: textSchema('text', 2000),
  }),
});

export const markReadSchema = z.object({
  params: chatIdParams.extend({ messageId: messageIdSchema }),
  body: z.object({
    userId: idSchema,
  }),
});

export const getMessagesSchema = z.object({
  params: chatIdParams,
  query: z.object({
    limit: z.coerce
      .number({ error: 'limit must be a number' })
      .int({ error: 'limit must be a whole number' })
      .min(1, { error: 'limit must be at least 1' })
      .max(100, { error: 'limit cannot be more than 100' })
      .default(50),
    before: messageIdSchema.optional(),
  }),
});
