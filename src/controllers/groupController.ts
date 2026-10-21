import { addGroupMembers, removeGroupMember } from '@/services/groupMemberService';
import { createGroup, getGroupDetails, renameGroup } from '@/services/groupService';
import { createHandler } from '@/utils/createHandler';
import { sendSuccess } from '@/utils/response';
import {
  addMembersSchema,
  createGroupSchema,
  groupIdParamSchema,
  removeMemberSchema,
  renameGroupSchema,
} from '@/validators/groupSchema';

export const createGroupController = createHandler(createGroupSchema, async ({ body }, res) => {
  const group = await createGroup(body.creatorId, body.name, body.memberIds);
  sendSuccess(res, group, 201);
});

export const getGroupController = createHandler(groupIdParamSchema, async ({ params }, res) => {
  sendSuccess(res, await getGroupDetails(params.chatId));
});

export const renameGroupController = createHandler(
  renameGroupSchema,
  async ({ params, body }, res) => {
    sendSuccess(res, await renameGroup(params.chatId, body.userId, body.name));
  },
);

export const addMembersController = createHandler(
  addMembersSchema,
  async ({ params, body }, res) => {
    sendSuccess(res, await addGroupMembers(params.chatId, body.userId, body.memberIds));
  },
);

export const removeMemberController = createHandler(
  removeMemberSchema,
  async ({ params, body }, res) => {
    sendSuccess(res, await removeGroupMember(params.chatId, body.userId, params.memberId));
  },
);
