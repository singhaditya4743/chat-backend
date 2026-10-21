import { z } from 'zod';
import { chatIdParamsSchema, idSchema, textSchema } from '@/validators/commonSchema';

export const messageIdSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined ? 'messageId is required' : 'messageId must be a string',
  })
  .trim()
  .min(1, { error: 'messageId cannot be empty' })
  .max(128, { error: 'messageId is too long' });

const messageTextSchema = textSchema('text', 2000);
const messageParams = chatIdParamsSchema.extend({ messageId: messageIdSchema });

export const sendMessageSchema = z.object({
  params: chatIdParamsSchema,
  body: z.object({
    senderId: idSchema,
    text: messageTextSchema,
  }),
});

export const markReadSchema = z.object({
  params: messageParams,
  body: z.object({ userId: idSchema }),
});

export const editMessageSchema = z.object({
  params: messageParams,
  body: z.object({
    userId: idSchema,
    text: messageTextSchema,
  }),
});

export const deleteMessageSchema = z.object({
  params: messageParams,
  body: z.object({ userId: idSchema }),
});

export const streamMessagesSchema = z.object({
  params: chatIdParamsSchema,
  query: z.object({ userId: idSchema }),
});

export const getMessagesSchema = z.object({
  params: chatIdParamsSchema,
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
