import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';
import type { MessageDoc } from '@/types/messageInterface';
import type { SubcollectionModel } from '@/types/modelInterface';

// chats/{chatId}/messages/{messageId}
export const MessageModel = {
  parentCollection: 'chats',
  collection: 'messages',
  fields: {
    senderId: 'senderId',
    text: 'text',
    createdAt: 'createdAt',
    readBy: 'readBy',
    editedAt: 'editedAt',
    deletedAt: 'deletedAt',
  },
} as const satisfies SubcollectionModel<MessageDoc>;

const timestamp = z.instanceof(Timestamp);

// defaults cover docs saved before these fields existed
export const messageDocSchema = z.object({
  senderId: z.string(),
  text: z.string(),
  createdAt: timestamp,
  readBy: z.record(z.string(), timestamp).default({}),
  editedAt: timestamp.nullable().default(null),
  deletedAt: timestamp.nullable().default(null),
}) satisfies z.ZodType<MessageDoc>;
