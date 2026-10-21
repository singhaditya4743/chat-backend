import { MessageModel } from '@/models/messageModel';
import { messagesOf, toMessage } from '@/repositories/messageCollection';
import type { MessageChange, StopStream } from '@/types/streamInterface';

const WATCH_WINDOW = 50;

export const watchMessages = (
  chatId: string,
  onChange: (change: MessageChange) => void,
  onError: (error: Error) => void,
): StopStream => {
  let isFirstSnapshot = true;

  return messagesOf(chatId)
    .orderBy(MessageModel.fields.createdAt, 'desc')
    .limit(WATCH_WINDOW)
    .onSnapshot((snapshot) => {
      // first snapshot is just the current state, not new activity
      if (isFirstSnapshot) {
        isFirstSnapshot = false;
        return;
      }
      for (const change of snapshot.docChanges()) {
        // "removed" only means a message slid out of the window
        if (change.type === 'removed') continue;
        onChange({
          type: change.type === 'added' ? 'message.created' : 'message.updated',
          message: toMessage(chatId, change.doc),
        });
      }
    }, onError);
};
