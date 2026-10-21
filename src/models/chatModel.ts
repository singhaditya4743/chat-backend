import type { ModelDefinition } from '@/types/modelInterface';
import type { Chat } from '@/types/chatInterface';

export const ChatModel = {
  table: 'chats',
  columns: {
    id: 'id',
    type: 'type',
    name: 'name',
    directKey: 'direct_key',
    createdBy: 'created_by',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
} as const satisfies ModelDefinition<Chat>;
