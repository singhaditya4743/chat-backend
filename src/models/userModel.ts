import type { ModelDefinition } from '@/types/modelInterface';
import type { User } from '@/types/userInterface';

export const UserModel = {
  table: 'users',
  columns: {
    id: 'id',
    name: 'name',
    createdAt: 'created_at',
  },
} as const satisfies ModelDefinition<User>;
