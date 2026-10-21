import type { Timestamp } from 'firebase-admin/firestore';

// Shape of chats/{chatId}/members/{userId} as stored in Firestore
export interface LastSeenDoc {
  lastSeenMessageId: string;
  // createdAt of that message, used to stop the pointer from moving backwards
  lastSeenMessageAt: Timestamp;
  updatedAt: Timestamp;
}

// Shape returned by the API
export interface LastSeen {
  chatId: string;
  userId: string;
  lastSeenMessageId: string;
  lastSeenMessageAt: Date;
  updatedAt: Date;
}
