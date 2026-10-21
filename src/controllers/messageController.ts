import { deleteMessage, editMessage } from '@/services/messageEditService';
import { getMessages, markMessageRead, sendMessage } from '@/services/messageService';
import { createHandler } from '@/utils/createHandler';
import { sendSuccess } from '@/utils/response';
import {
  deleteMessageSchema,
  editMessageSchema,
  getMessagesSchema,
  markReadSchema,
  sendMessageSchema,
} from '@/validators/messageSchema';

export const sendMessageController = createHandler(
  sendMessageSchema,
  async ({ params, body }, res) => {
    const message = await sendMessage(params.chatId, body.senderId, body.text);
    sendSuccess(res, message, 201);
  },
);

export const getMessagesController = createHandler(
  getMessagesSchema,
  async ({ params, query }, res) => {
    const page = await getMessages(params.chatId, query.limit, query.before);
    sendSuccess(res, page);
  },
);

export const markReadController = createHandler(markReadSchema, async ({ params, body }, res) => {
  const message = await markMessageRead(params.chatId, params.messageId, body.userId);
  sendSuccess(res, message);
});

export const editMessageController = createHandler(
  editMessageSchema,
  async ({ params, body }, res) => {
    sendSuccess(res, await editMessage(params.chatId, params.messageId, body.userId, body.text));
  },
);

export const deleteMessageController = createHandler(
  deleteMessageSchema,
  async ({ params, body }, res) => {
    sendSuccess(res, await deleteMessage(params.chatId, params.messageId, body.userId));
  },
);
