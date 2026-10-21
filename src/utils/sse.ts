import type { Response } from 'express';
import type { StopStream } from '@/types/streamInterface';

const HEARTBEAT_MS = 25_000;

export const openSse = (res: Response): StopStream => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    // stop proxies like nginx from buffering the stream
    'X-Accel-Buffering': 'no',
  });
  res.write(': connected\n\n');

  // comment lines keep idle connections from being cut by proxies
  const heartbeat = setInterval(() => res.write(': ping\n\n'), HEARTBEAT_MS);
  return () => {
    clearInterval(heartbeat);
  };
};

export const sendSse = (res: Response, data: unknown): void => {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};
