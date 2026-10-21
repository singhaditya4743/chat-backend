import { updateLastSeen } from '@/services/lastSeenService';
import { createHandler } from '@/utils/createHandler';
import { sendSuccess } from '@/utils/response';
import { updateLastSeenSchema } from '@/validators/lastSeenSchema';

export const updateLastSeenController = createHandler(
  updateLastSeenSchema,
  async ({ params, body }, res) => {
    const lastSeen = await updateLastSeen(params.chatId, body.userId, body.messageId);
    sendSuccess(res, lastSeen);
  },
);
