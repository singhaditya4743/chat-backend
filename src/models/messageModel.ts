import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';
import type { MessageDoc } from '@/types/messageInterface';
import type { SubcollectionModel } from '@/types/modelInterface';

// Firestore layout: chats/{chatId}/messages/{messageId}
export const MessageModel = {
  parentCollection: 'chats',
  collection: 'messages',
  fields: {
    senderId: 'senderId',
    text: 'text',
    createdAt: 'createdAt',
    readBy: 'readBy',
  },
} as const satisfies SubcollectionModel<MessageDoc>;

// Checks documents read back from Firestore, so bad data never reaches the API untyped
export const messageDocSchema = z.object({
  senderId: z.string(),
  text: z.string(),
  createdAt: z.instanceof(Timestamp),
  readBy: z.record(z.string(), z.instanceof(Timestamp)).default({}),
}) satisfies z.ZodType<MessageDoc>;
