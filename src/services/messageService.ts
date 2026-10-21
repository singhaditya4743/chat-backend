import { touchChat } from '@/repositories/chatRepository';
import {
  findLatestMessages,
  findMessageById,
  insertMessage,
  setMessageReadAt,
} from '@/repositories/messageRepository';
import { assertChatExists, assertChatMember } from '@/services/chatAccessService';
import type { Message, MessagePage } from '@/types/messageInterface';
import { AppError } from '@/utils/appError';

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
): Promise<Message> => {
  await assertChatMember(chatId, senderId);
  const message = await insertMessage(chatId, senderId, text);
  await touchChat(chatId);
  return message;
};

export const getMessages = async (
  chatId: string,
  limit: number,
  before?: string,
): Promise<MessagePage> => {
  await assertChatExists(chatId);

  // Fetch one extra to know whether older messages exist
  const newestFirst = await findLatestMessages(chatId, limit + 1, before);
  if (!newestFirst) throw AppError.badRequest(`Message ${before ?? ''} not found in this chat`);

  const page = newestFirst.slice(0, limit);
  const hasMore = newestFirst.length > limit;

  return {
    messages: page.reverse(),
    nextCursor: hasMore ? (page[0]?.messageId ?? null) : null,
  };
};

export const getMessageOrThrow = async (chatId: string, messageId: string): Promise<Message> => {
  const message = await findMessageById(chatId, messageId);
  if (!message) throw AppError.notFound(`Message ${messageId} not found in chat ${chatId}`);
  return message;
};

// Idempotent: the first read time is kept, and your own messages are never marked
export const markMessageRead = async (
  chatId: string,
  messageId: string,
  userId: string,
): Promise<Message> => {
  await assertChatMember(chatId, userId);
  const message = await getMessageOrThrow(chatId, messageId);

  if (message.senderId === userId || userId in message.readBy) return message;

  await setMessageReadAt(chatId, messageId, userId);
  return getMessageOrThrow(chatId, messageId);
};
