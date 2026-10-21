import express from 'express';
import type { Express } from 'express';
import { router } from '@/routes';
import { errorHandler } from '@/middlewares/errorHandler';
import { notFoundHandler } from '@/middlewares/notFoundHandler';

export const createApp = (): Express => {
  const app = express();

  app.use(express.json({ limit: '100kb' }));
  app.use(router);

  // Must stay last: unknown routes, then every thrown error
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
