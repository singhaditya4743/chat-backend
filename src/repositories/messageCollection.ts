import type { DocumentSnapshot, Timestamp } from 'firebase-admin/firestore';
import { firestore } from '@/config/firebase';
import { MessageModel, messageDocSchema } from '@/models/messageModel';
import type { Message } from '@/types/messageInterface';

export const messagesOf = (chatId: string) =>
  firestore.collection(MessageModel.parentCollection).doc(chatId).collection(MessageModel.collection);

const toDate = (value: Timestamp | null): Date | null => (value ? value.toDate() : null);

export const toMessage = (chatId: string, snapshot: DocumentSnapshot): Message => {
  const doc = messageDocSchema.parse(snapshot.data());
  return {
    messageId: snapshot.id,
    chatId,
    senderId: doc.senderId,
    text: doc.text,
    createdAt: doc.createdAt.toDate(),
    readBy: Object.fromEntries(
      Object.entries(doc.readBy).map(([userId, readAt]) => [userId, readAt.toDate()]),
    ),
    editedAt: toDate(doc.editedAt),
    deletedAt: toDate(doc.deletedAt),
  };
};
