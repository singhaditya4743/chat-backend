import { saveLastSeen } from '@/repositories/lastSeenRepository';
import { assertChatMember } from '@/services/chatAccessService';
import { getMessageOrThrow } from '@/services/messageService';
import type { LastSeen } from '@/types/lastSeenInterface';

export const updateLastSeen = async (
  chatId: string,
  userId: string,
  messageId: string,
): Promise<LastSeen> => {
  await assertChatMember(chatId, userId);
  const message = await getMessageOrThrow(chatId, messageId);
  return saveLastSeen(chatId, userId, message.messageId, message.createdAt);
};
