import type { LogLevel } from '@/types/loggerInterface';

const write = (level: LogLevel, message: string, error?: unknown): void => {
  const line = `${new Date().toISOString()} ${level.padEnd(5)} ${message}`;

  if (level === 'ERROR') {
    console.error(line, ...(error === undefined ? [] : [error]));
  } else if (level === 'WARN') {
    console.warn(line);
  } else {
    console.log(line);
  }
};

export const logger = {
  info: (message: string): void => {
    write('INFO', message);
  },
  warn: (message: string): void => {
    write('WARN', message);
  },
  error: (message: string, error?: unknown): void => {
    write('ERROR', message, error);
  },
};
