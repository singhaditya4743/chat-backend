import type { ModelDefinition } from '@/types/modelInterface';
import type { ChatMember } from '@/types/chatMemberInterface';

export const ChatMemberModel = {
  table: 'chat_members',
  columns: {
    chatId: 'chat_id',
    userId: 'user_id',
    role: 'role',
    joinedAt: 'joined_at',
  },
} as const satisfies ModelDefinition<ChatMember>;
