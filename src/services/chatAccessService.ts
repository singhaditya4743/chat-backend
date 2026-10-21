import { isChatMember } from '@/repositories/chatMemberRepository';
import { findChatById } from '@/repositories/chatRepository';
import type { Chat } from '@/types/chatInterface';
import { AppError } from '@/utils/appError';

export const assertChatExists = async (chatId: string): Promise<Chat> => {
  const chat = await findChatById(chatId);
  if (!chat) throw AppError.notFound(`Chat ${chatId} not found`);
  return chat;
};

// 404 if the chat is missing, 403 if the user isn't in it
export const assertChatMember = async (chatId: string, userId: string): Promise<Chat> => {
  const chat = await assertChatExists(chatId);
  if (!(await isChatMember(chatId, userId))) {
    throw AppError.forbidden(`User ${userId} is not a member of chat ${chatId}`);
  }
  return chat;
};
