import type { Timestamp } from 'firebase-admin/firestore';

export interface LastSeenDoc {
  lastSeenMessageId: string;
  // the message's createdAt, used to stop the pointer going back
  lastSeenMessageAt: Timestamp;
  updatedAt: Timestamp;
}

export interface LastSeen {
  chatId: string;
  userId: string;
  lastSeenMessageId: string;
  lastSeenMessageAt: Date;
  updatedAt: Date;
}
