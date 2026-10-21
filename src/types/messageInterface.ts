import type { Timestamp } from 'firebase-admin/firestore';

export interface MessageDoc {
  senderId: string;
  text: string;
  createdAt: Timestamp;
  // userId -> readAt
  readBy: Record<string, Timestamp>;
  editedAt: Timestamp | null;
  deletedAt: Timestamp | null;
}

export interface Message {
  messageId: string;
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  readBy: Record<string, Date>;
  editedAt: Date | null;
  deletedAt: Date | null;
}

export type SentMessage = Pick<Message, 'messageId' | 'chatId' | 'senderId' | 'text' | 'createdAt'>;

export type ReadMessage = Pick<
  Message,
  'messageId' | 'chatId' | 'senderId' | 'text' | 'createdAt' | 'readBy'
>;

export type EditedMessage = Pick<Message, 'messageId' | 'chatId' | 'senderId' | 'text' | 'editedAt'>;

export type DeletedMessage = Pick<Message, 'messageId' | 'chatId' | 'deletedAt'>;

export interface ActiveMessageItem {
  messageId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  readBy: Record<string, Date>;
  isEdited: boolean;
  isDeleted: false;
}

export interface DeletedMessageItem {
  messageId: string;
  senderId: string;
  createdAt: Date;
  isDeleted: true;
}

export type MessageListItem = ActiveMessageItem | DeletedMessageItem;

export interface MessagePage {
  chatId: string;
  // oldest first
  messages: MessageListItem[];
  // pass as ?before= for older messages
  nextCursor: string | null;
}
