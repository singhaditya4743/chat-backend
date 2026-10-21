import { FieldValue } from 'firebase-admin/firestore';
import { MessageModel } from '@/models/messageModel';
import { messagesOf } from '@/repositories/messageCollection';

const { fields } = MessageModel;

export const updateMessageText = async (
  chatId: string,
  messageId: string,
  text: string,
): Promise<void> => {
  await messagesOf(chatId)
    .doc(messageId)
    .update({ [fields.text]: text, [fields.editedAt]: FieldValue.serverTimestamp() });
};

export const softDeleteMessage = async (chatId: string, messageId: string): Promise<void> => {
  await messagesOf(chatId)
    .doc(messageId)
    .update({ [fields.text]: '', [fields.deletedAt]: FieldValue.serverTimestamp() });
};
