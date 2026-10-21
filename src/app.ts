import express from 'express';
import type { Express } from 'express';
import { router } from '@/routes';
import { errorHandler } from '@/middlewares/errorHandler';
import { notFoundHandler } from '@/middlewares/notFoundHandler';
import { requestLogger } from '@/middlewares/requestLogger';

export const createApp = (): Express => {
  const app = express();

  // before json() so bad bodies get logged too
  app.use(requestLogger);
  app.use(express.json({ limit: '100kb' }));
  app.use(router);

  // keep these last
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
