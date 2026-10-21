import { toDeletedMessage, toEditedMessage } from '@/mappers/messageMapper';
import { softDeleteMessage, updateMessageText } from '@/repositories/messageEditRepository';
import { assertChatMember } from '@/services/chatAccessService';
import { getMessageOrThrow } from '@/services/messageService';
import type { DeletedMessage, EditedMessage, Message } from '@/types/messageInterface';
import { AppError } from '@/utils/appError';

const getOwnMessage = async (chatId: string, messageId: string, userId: string): Promise<Message> => {
  await assertChatMember(chatId, userId);
  const message = await getMessageOrThrow(chatId, messageId);
  if (message.senderId !== userId) {
    throw AppError.forbidden('Only the sender can edit or delete this message');
  }
  return message;
};

export const editMessage = async (
  chatId: string,
  messageId: string,
  userId: string,
  text: string,
): Promise<EditedMessage> => {
  const message = await getOwnMessage(chatId, messageId, userId);
  if (message.deletedAt) throw AppError.conflict('A deleted message cannot be edited');

  await updateMessageText(chatId, messageId, text);
  return toEditedMessage(await getMessageOrThrow(chatId, messageId));
};

export const deleteMessage = async (
  chatId: string,
  messageId: string,
  userId: string,
): Promise<DeletedMessage> => {
  const message = await getOwnMessage(chatId, messageId, userId);
  if (message.deletedAt) return toDeletedMessage(message);

  await softDeleteMessage(chatId, messageId);
  return toDeletedMessage(await getMessageOrThrow(chatId, messageId));
};
