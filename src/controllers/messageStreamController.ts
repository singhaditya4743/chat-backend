import { openMessageStream } from '@/services/messageStreamService';
import { createHandler } from '@/utils/createHandler';
import { logger } from '@/utils/logger';
import { openSse, sendSse } from '@/utils/sse';
import { streamMessagesSchema } from '@/validators/messageSchema';

export const streamMessagesController = createHandler(
  streamMessagesSchema,
  async ({ params, query }, res) => {
    // access is checked before any headers go out, so 403/404 still work normally
    const stopWatching = await openMessageStream(
      params.chatId,
      query.userId,
      (event) => {
        sendSse(res, event);
      },
      (error) => {
        logger.error(`Message stream for chat ${params.chatId} failed`, error);
        res.end();
      },
    );
    const stopHeartbeat = openSse(res);

    res.on('close', () => {
      stopWatching();
      stopHeartbeat();
    });
  },
);
