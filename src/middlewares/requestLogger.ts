import type { RequestHandler } from 'express';
import { logger } from '@/utils/logger';

// One line per request once the response is sent: method, URL, status, duration
export const requestLogger: RequestHandler = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const line = `${req.method} ${req.originalUrl} ${String(res.statusCode)} - ${ms.toFixed(0)}ms`;

    if (res.statusCode >= 500) logger.error(line);
    else if (res.statusCode >= 400) logger.warn(line);
    else logger.info(line);
  });

  next();
};
