import { Router } from 'express';
import { createUserController, getUserController } from '@/controllers/userController';

export const userRouter = Router();

userRouter.post('/create', createUserController);
userRouter.get('/:userId', getUserController);
