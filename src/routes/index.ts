import { Router } from 'express';
import { chatRouter } from '@/routes/chatRoutes';
import { groupRouter } from '@/routes/groupRoutes';
import { healthRouter } from '@/routes/healthRoutes';
import { userRouter } from '@/routes/userRoutes';

export const router = Router();

router.use('/health', healthRouter);
router.use('/user', userRouter);
router.use('/chat', chatRouter);
router.use('/group', groupRouter);
