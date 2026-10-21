import express from 'express';
import type { Express } from 'express';
import { router } from '@/routes';
import { errorHandler } from '@/middlewares/errorHandler';
import { notFoundHandler } from '@/middlewares/notFoundHandler';
import { requestLogger } from '@/middlewares/requestLogger';

export const createApp = (): Express => {
  const app = express();

  // First, so every request is logged, including ones that fail JSON parsing
  app.use(requestLogger);
  app.use(express.json({ limit: '100kb' }));
  app.use(router);

  // Must stay last: unknown routes, then every thrown error
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
