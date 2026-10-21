import { withTransaction } from '@/config/database';
import { findMembers, insertMembers } from '@/repositories/chatMemberRepository';
import { insertGroupChat, updateGroupName } from '@/repositories/groupRepository';
import { assertChatExists, assertChatMember } from '@/services/chatAccessService';
import { assertUsersExist } from '@/services/userService';
import type { Chat } from '@/types/chatInterface';
import type { GroupDetails } from '@/types/groupInterface';
import { AppError } from '@/utils/appError';

export const assertIsGroup = (chat: Chat): void => {
  if (chat.type !== 'group') throw AppError.badRequest(`Chat ${chat.id} is not a group chat`);
};

export const assertGroupAdmin = async (chatId: string, userId: string): Promise<void> => {
  const { chat, role } = await assertChatMember(chatId, userId);
  assertIsGroup(chat);
  if (role !== 'admin') throw AppError.forbidden('Only group admins can do this');
};

export const getGroupDetails = async (chatId: string): Promise<GroupDetails> => {
  const chat = await assertChatExists(chatId);
  assertIsGroup(chat);
  const members = await findMembers(chatId);

  return {
    chatId: chat.id,
    name: chat.name ?? '',
    createdBy: chat.createdBy,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt,
    members: members.map(({ chatId: _chatId, ...member }) => member),
  };
};

export const createGroup = async (
  creatorId: string,
  name: string,
  memberIds: string[],
): Promise<GroupDetails> => {
  const others = [...new Set(memberIds)].filter((id) => id !== creatorId);
  if (others.length === 0) {
    throw AppError.badRequest('A group needs at least one member besides the creator');
  }
  await assertUsersExist([creatorId, ...others]);

  const group = await withTransaction(async (client) => {
    const chat = await insertGroupChat(client, name, creatorId);
    await insertMembers(client, chat.id, [creatorId], 'admin');
    await insertMembers(client, chat.id, others, 'member');
    return chat;
  });
  return getGroupDetails(group.id);
};

export const renameGroup = async (
  chatId: string,
  userId: string,
  name: string,
): Promise<GroupDetails> => {
  await assertGroupAdmin(chatId, userId);
  await updateGroupName(chatId, name);
  return getGroupDetails(chatId);
};
