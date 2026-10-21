import 'dotenv/config';

const readString = (key: string): string => {
  const value = process.env[key];
  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required environment variable ${key}`);
  }
  return value.trim();
};

const readNumber = (key: string, fallback: number): number => {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return fallback;

  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`Environment variable ${key} must be a positive integer`);
  }
  return value;
};

export const env = {
  port: readNumber('PORT', 3000),
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  databaseUrl: readString('DATABASE_URL'),
  firebaseServiceAccountPath: readString('FIREBASE_SERVICE_ACCOUNT_PATH'),
} as const;
