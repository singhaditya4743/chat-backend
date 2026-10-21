import { pool, withTransaction } from '@/config/database';
import {
  deleteMember,
  ensureGroupHasAdmin,
  findMemberRole,
  insertMembers,
} from '@/repositories/chatMemberRepository';
import { touchChat } from '@/repositories/chatRepository';
import { assertChatMember } from '@/services/chatAccessService';
import { assertGroupAdmin, assertIsGroup, getGroupDetails } from '@/services/groupService';
import { assertUsersExist } from '@/services/userService';
import type { GroupDetails } from '@/types/groupInterface';
import { AppError } from '@/utils/appError';

export const addGroupMembers = async (
  chatId: string,
  userId: string,
  memberIds: string[],
): Promise<GroupDetails> => {
  await assertGroupAdmin(chatId, userId);
  const ids = [...new Set(memberIds)];
  await assertUsersExist(ids);

  await insertMembers(pool, chatId, ids, 'member');
  await touchChat(chatId);
  return getGroupDetails(chatId);
};

// admins can remove anyone, members can only remove themselves
export const removeGroupMember = async (
  chatId: string,
  actorId: string,
  memberId: string,
): Promise<GroupDetails> => {
  if (actorId === memberId) {
    assertIsGroup((await assertChatMember(chatId, actorId)).chat);
  } else {
    await assertGroupAdmin(chatId, actorId);
  }

  if (!(await findMemberRole(chatId, memberId))) {
    throw AppError.notFound(`User ${memberId} is not a member of this group`);
  }

  await withTransaction(async (client) => {
    await deleteMember(client, chatId, memberId);
    await ensureGroupHasAdmin(client, chatId);
  });
  await touchChat(chatId);
  return getGroupDetails(chatId);
};
