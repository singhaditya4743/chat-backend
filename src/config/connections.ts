import { checkDatabaseConnection, closeDatabase } from '@/config/database';
import { checkFirestoreConnection } from '@/config/firebase';

const verify = async (name: string, check: () => Promise<void>): Promise<void> => {
  try {
    await check();
    console.log(`${name} connected`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`${name} connection failed: ${reason}`, { cause: error });
  }
};

export const connectServices = async (): Promise<void> => {
  await Promise.all([
    verify('PostgreSQL', checkDatabaseConnection),
    verify('Firestore', checkFirestoreConnection),
  ]);
};

export const disconnectServices = async (): Promise<void> => {
  await closeDatabase();
};
