import { Router } from 'express';
import { listUserChatsController } from '@/controllers/chatController';
import { createUserController, getUserController } from '@/controllers/userController';

export const userRouter = Router();

userRouter.post('/create', createUserController);
userRouter.get('/:userId', getUserController);
userRouter.get('/:userId/chats', listUserChatsController);
