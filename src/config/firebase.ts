import path from 'node:path';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import type { App } from 'firebase-admin/app';
import { env } from '@/config/env';

const getFirebaseApp = (): App => {
  const existing = getApps()[0];
  if (existing) return existing;

  const keyPath = path.resolve(process.cwd(), env.firebaseServiceAccountPath);
  return initializeApp({ credential: cert(keyPath) });
};

export const firestore = getFirestore(getFirebaseApp());

export const checkFirestoreConnection = async (): Promise<void> => {
  await firestore.listCollections();
};
