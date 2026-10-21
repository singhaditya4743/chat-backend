import { Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';
import type { LastSeenDoc } from '@/types/lastSeenInterface';
import type { SubcollectionModel } from '@/types/modelInterface';

// Firestore layout: chats/{chatId}/members/{userId}
export const LastSeenModel = {
  parentCollection: 'chats',
  collection: 'members',
  fields: {
    lastSeenMessageId: 'lastSeenMessageId',
    lastSeenMessageAt: 'lastSeenMessageAt',
    updatedAt: 'updatedAt',
  },
} as const satisfies SubcollectionModel<LastSeenDoc>;

export const lastSeenDocSchema = z.object({
  lastSeenMessageId: z.string(),
  lastSeenMessageAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
}) satisfies z.ZodType<LastSeenDoc>;
