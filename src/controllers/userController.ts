import { createUser, getUserById } from '@/services/userService';
import { createHandler } from '@/utils/createHandler';
import { sendSuccess } from '@/utils/response';
import { createUserSchema, userIdParamSchema } from '@/validators/userSchema';

export const createUserController = createHandler(createUserSchema, async ({ body }, res) => {
  const user = await createUser(body.name);
  sendSuccess(res, user, 201);
});

export const getUserController = createHandler(userIdParamSchema, async ({ params }, res) => {
  const user = await getUserById(params.userId);
  sendSuccess(res, user);
});
