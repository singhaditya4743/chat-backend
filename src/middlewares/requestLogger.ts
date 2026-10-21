import type { RequestHandler } from 'express';
import { logger } from '@/utils/logger';

export const requestLogger: RequestHandler = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  // 'close' also fires for streams the client hangs up on, unlike 'finish'
  res.on('close', () => {
    const ms = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const line = `${req.method} ${req.originalUrl} ${String(res.statusCode)} - ${ms.toFixed(0)}ms`;

    if (res.statusCode >= 500) logger.error(line);
    else if (res.statusCode >= 400) logger.warn(line);
    else logger.info(line);
  });

  next();
};
