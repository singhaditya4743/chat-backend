import { Router } from 'express';
import { healthRouter } from '@/routes/healthRoutes';
import { userRouter } from '@/routes/userRoutes';

export const router = Router();

router.use('/health', healthRouter);
router.use('/user', userRouter);
