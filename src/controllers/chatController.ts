import { createOrGetDirectChat, listUserChats } from '@/services/chatService';
import { createHandler } from '@/utils/createHandler';
import { sendSuccess } from '@/utils/response';
import { createChatSchema } from '@/validators/chatSchema';
import { userIdParamSchema } from '@/validators/userSchema';

export const createChatController = createHandler(createChatSchema, async ({ body }, res) => {
  const { chat, created } = await createOrGetDirectChat(body.userAId, body.userBId);
  sendSuccess(res, { chatId: chat.id, created }, created ? 201 : 200);
});

export const listUserChatsController = createHandler(userIdParamSchema, async ({ params }, res) => {
  const chats = await listUserChats(params.userId);
  sendSuccess(res, chats);
});
