import { Router } from 'express';
import {
  addMembersController,
  createGroupController,
  getGroupController,
  removeMemberController,
  renameGroupController,
} from '@/controllers/groupController';

export const groupRouter = Router();

groupRouter.post('/create', createGroupController);
groupRouter.get('/:chatId', getGroupController);
groupRouter.patch('/:chatId', renameGroupController);
groupRouter.post('/:chatId/members', addMembersController);
groupRouter.delete('/:chatId/members/:memberId', removeMemberController);
