import { withTransaction } from '@/config/database';
import { insertMembers } from '@/repositories/chatMemberRepository';
import {
  findChatByDirectKey,
  findChatsByUserId,
  insertDirectChat,
} from '@/repositories/chatRepository';
import { assertUsersExist, getUserById } from '@/services/userService';
import type { ChatSummary, CreateChatResult } from '@/types/chatInterface';

// Same key for A-B and B-A, so a pair can only ever have one 1:1 chat
const buildDirectKey = (userAId: string, userBId: string): string =>
  [userAId, userBId].sort().join(':');

export const createOrGetDirectChat = async (
  userAId: string,
  userBId: string,
): Promise<CreateChatResult> => {
  await assertUsersExist([userAId, userBId]);
  const directKey = buildDirectKey(userAId, userBId);

  const existing = await findChatByDirectKey(directKey);
  if (existing) return { chat: existing, created: false };

  const created = await withTransaction(async (client) => {
    const chat = await insertDirectChat(client, directKey, userAId);
    if (chat) await insertMembers(client, chat.id, [userAId, userBId], 'member');
    return chat;
  });
  if (created) return { chat: created, created: true };

  // A parallel request won the race; return the chat it created
  const winner = await findChatByDirectKey(directKey);
  if (!winner) throw new Error(`Chat for ${directKey} vanished after a conflict`);
  return { chat: winner, created: false };
};

export const listUserChats = async (userId: string): Promise<ChatSummary[]> => {
  await getUserById(userId);
  const chats = await findChatsByUserId(userId);
  return chats.map(({ id, directKey: _directKey, ...chat }) => ({ chatId: id, ...chat }));
};
