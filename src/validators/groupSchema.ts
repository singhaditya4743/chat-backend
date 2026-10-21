import { z } from 'zod';
import { chatIdParamsSchema, idSchema, textSchema } from '@/validators/commonSchema';

const memberIdsSchema = z
  .array(idSchema, { error: 'memberIds must be an array of user IDs' })
  .min(1, { error: 'memberIds must contain at least one user' })
  .max(100, { error: 'memberIds cannot contain more than 100 users' });

const groupNameSchema = textSchema('name', 100);

export const createGroupSchema = z.object({
  body: z.object({
    creatorId: idSchema,
    name: groupNameSchema,
    memberIds: memberIdsSchema,
  }),
});

export const groupIdParamSchema = z.object({
  params: chatIdParamsSchema,
});

export const renameGroupSchema = z.object({
  params: chatIdParamsSchema,
  body: z.object({
    userId: idSchema,
    name: groupNameSchema,
  }),
});

export const addMembersSchema = z.object({
  params: chatIdParamsSchema,
  body: z.object({
    userId: idSchema,
    memberIds: memberIdsSchema,
  }),
});

export const removeMemberSchema = z.object({
  params: chatIdParamsSchema.extend({ memberId: idSchema }),
  body: z.object({
    userId: idSchema,
  }),
});
