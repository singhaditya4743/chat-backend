import { Router } from 'express';
import { createChatController } from '@/controllers/chatController';
import { updateLastSeenController } from '@/controllers/lastSeenController';
import {
  getMessagesController,
  markReadController,
  sendMessageController,
} from '@/controllers/messageController';

export const chatRouter = Router();

chatRouter.post('/create', createChatController);
chatRouter.post('/:chatId/message/send', sendMessageController);
chatRouter.get('/:chatId/messages', getMessagesController);
chatRouter.post('/:chatId/message/:messageId/read', markReadController);
chatRouter.post('/:chatId/lastseen', updateLastSeenController);
