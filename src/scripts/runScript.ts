import { closeDatabase } from '@/config/database';

// Runs a one-off CLI task, closes the DB pool and sets the exit code
export const runScript = (name: string, task: () => Promise<void>): void => {
  task()
    .then(() => {
      console.log(`${name} finished`);
    })
    .catch((error: unknown) => {
      console.error(`${name} failed:`, error instanceof Error ? error.message : error);
      process.exitCode = 1;
    })
    .finally(() => {
      void closeDatabase();
    });
};
