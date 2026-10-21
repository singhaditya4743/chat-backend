import { Router } from 'express';
import { createChatController } from '@/controllers/chatController';
import { updateLastSeenController } from '@/controllers/lastSeenController';
import {
  deleteMessageController,
  editMessageController,
  getMessagesController,
  markReadController,
  sendMessageController,
} from '@/controllers/messageController';
import { streamMessagesController } from '@/controllers/messageStreamController';

export const chatRouter = Router();

chatRouter.post('/create', createChatController);
chatRouter.post('/:chatId/message/send', sendMessageController);
chatRouter.get('/:chatId/messages', getMessagesController);
chatRouter.get('/:chatId/stream', streamMessagesController);
chatRouter.patch('/:chatId/message/:messageId', editMessageController);
chatRouter.delete('/:chatId/message/:messageId', deleteMessageController);
chatRouter.post('/:chatId/message/:messageId/read', markReadController);
chatRouter.post('/:chatId/lastseen', updateLastSeenController);
