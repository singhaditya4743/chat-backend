import { findMemberRole } from '@/repositories/chatMemberRepository';
import { findChatById } from '@/repositories/chatRepository';
import type { Chat } from '@/types/chatInterface';
import type { ChatMembership } from '@/types/chatMemberInterface';
import { AppError } from '@/utils/appError';

export const assertChatExists = async (chatId: string): Promise<Chat> => {
  const chat = await findChatById(chatId);
  if (!chat) throw AppError.notFound(`Chat ${chatId} not found`);
  return chat;
};

export const assertChatMember = async (chatId: string, userId: string): Promise<ChatMembership> => {
  const chat = await assertChatExists(chatId);
  const role = await findMemberRole(chatId, userId);
  if (!role) throw AppError.forbidden(`User ${userId} is not a member of chat ${chatId}`);
  return { chat, role };
};
