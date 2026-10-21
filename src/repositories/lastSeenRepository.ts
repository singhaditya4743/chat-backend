import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import type { DocumentSnapshot } from 'firebase-admin/firestore';
import { firestore } from '@/config/firebase';
import { LastSeenModel, lastSeenDocSchema } from '@/models/lastSeenModel';
import type { LastSeen } from '@/types/lastSeenInterface';

const { fields } = LastSeenModel;

const memberRef = (chatId: string, userId: string) =>
  firestore
    .collection(LastSeenModel.parentCollection)
    .doc(chatId)
    .collection(LastSeenModel.collection)
    .doc(userId);

const toLastSeen = (chatId: string, userId: string, snapshot: DocumentSnapshot): LastSeen => {
  const doc = lastSeenDocSchema.parse(snapshot.data());
  return {
    chatId,
    userId,
    lastSeenMessageId: doc.lastSeenMessageId,
    lastSeenMessageAt: doc.lastSeenMessageAt.toDate(),
    updatedAt: doc.updatedAt.toDate(),
  };
};

// transaction so the pointer never moves back
export const saveLastSeen = async (
  chatId: string,
  userId: string,
  messageId: string,
  messageCreatedAt: Date,
): Promise<LastSeen> => {
  const ref = memberRef(chatId, userId);

  await firestore.runTransaction(async (tx) => {
    const current = await tx.get(ref);
    if (current.exists) {
      const doc = lastSeenDocSchema.parse(current.data());
      if (doc.lastSeenMessageAt.toMillis() > messageCreatedAt.getTime()) return;
    }

    tx.set(ref, {
      [fields.lastSeenMessageId]: messageId,
      [fields.lastSeenMessageAt]: Timestamp.fromDate(messageCreatedAt),
      [fields.updatedAt]: FieldValue.serverTimestamp(),
    });
  });

  return toLastSeen(chatId, userId, await ref.get());
};
