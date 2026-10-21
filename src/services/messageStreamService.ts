import { toMessageListItem } from '@/mappers/messageMapper';
import { watchMessages } from '@/repositories/messageStreamRepository';
import { assertChatMember } from '@/services/chatAccessService';
import type { MessageStreamEvent, StopStream } from '@/types/streamInterface';

export const openMessageStream = async (
  chatId: string,
  userId: string,
  onEvent: (event: MessageStreamEvent) => void,
  onError: (error: Error) => void,
): Promise<StopStream> => {
  await assertChatMember(chatId, userId);

  return watchMessages(
    chatId,
    ({ type, message }) => {
      onEvent({ type, chatId, message: toMessageListItem(message) });
    },
    onError,
  );
};
