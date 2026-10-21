import { FieldPath, FieldValue } from 'firebase-admin/firestore';
import type { DocumentSnapshot } from 'firebase-admin/firestore';
import { firestore } from '@/config/firebase';
import { MessageModel, messageDocSchema } from '@/models/messageModel';
import type { Message } from '@/types/messageInterface';

const { fields } = MessageModel;

const messagesOf = (chatId: string) =>
  firestore.collection(MessageModel.parentCollection).doc(chatId).collection(MessageModel.collection);

const toMessage = (chatId: string, snapshot: DocumentSnapshot): Message => {
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
  };
};

export const insertMessage = async (
  chatId: string,
  senderId: string,
  text: string,
): Promise<Message> => {
  const ref = await messagesOf(chatId).add({
    [fields.senderId]: senderId,
    [fields.text]: text,
    [fields.createdAt]: FieldValue.serverTimestamp(),
    [fields.readBy]: {},
  });
  // Read back to get the timestamp Firestore actually assigned
  return toMessage(chatId, await ref.get());
};

export const findMessageById = async (
  chatId: string,
  messageId: string,
): Promise<Message | null> => {
  const snapshot = await messagesOf(chatId).doc(messageId).get();
  return snapshot.exists ? toMessage(chatId, snapshot) : null;
};

// FieldPath keeps the userId as one key even if it contains dots or dashes
export const setMessageReadAt = async (
  chatId: string,
  messageId: string,
  userId: string,
): Promise<void> => {
  await messagesOf(chatId)
    .doc(messageId)
    .update(new FieldPath(fields.readBy, userId), FieldValue.serverTimestamp());
};

// Newest first; `null` means the `before` cursor doesn't exist in this chat
export const findLatestMessages = async (
  chatId: string,
  limit: number,
  before?: string,
): Promise<Message[] | null> => {
  let query = messagesOf(chatId).orderBy(fields.createdAt, 'desc').limit(limit);

  if (before !== undefined) {
    const cursor = await messagesOf(chatId).doc(before).get();
    if (!cursor.exists) return null;
    query = query.startAfter(cursor);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => toMessage(chatId, doc));
};
