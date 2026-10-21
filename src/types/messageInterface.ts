import type { Timestamp } from 'firebase-admin/firestore';

// Shape of a message document as stored in Firestore
export interface MessageDoc {
  senderId: string;
  text: string;
  createdAt: Timestamp;
  // Read receipts: userId -> when that user read the message
  readBy: Record<string, Timestamp>;
}

// Shape returned by the API
export interface Message {
  messageId: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  readBy: Record<string, Date>;
}

export interface MessagePage {
  // Oldest first, like a chat screen
  messages: Message[];
  // Pass as ?before= to load older messages; null when there are none
  nextCursor: string | null;
}
