import { FieldPath, FieldValue } from 'firebase-admin/firestore';
import { MessageModel } from '@/models/messageModel';
import { messagesOf, toMessage } from '@/repositories/messageCollection';
import type { Message } from '@/types/messageInterface';

const { fields } = MessageModel;

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
    [fields.editedAt]: null,
    [fields.deletedAt]: null,
  });
  // read back to get the server timestamp
  return toMessage(chatId, await ref.get());
};

export const findMessageById = async (
  chatId: string,
  messageId: string,
): Promise<Message | null> => {
  const snapshot = await messagesOf(chatId).doc(messageId).get();
  return snapshot.exists ? toMessage(chatId, snapshot) : null;
};

export const setMessageReadAt = async (
  chatId: string,
  messageId: string,
  userId: string,
): Promise<void> => {
  await messagesOf(chatId)
    .doc(messageId)
    .update(new FieldPath(fields.readBy, userId), FieldValue.serverTimestamp());
};

// newest first, null if the cursor is not in this chat
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
