import type { Chat } from '@/types/chatInterface';

export type MemberRole = 'admin' | 'member';

export interface ChatMember {
  chatId: string;
  userId: string;
  role: MemberRole;
  joinedAt: Date;
}

export interface ChatMembership {
  chat: Chat;
  role: MemberRole;
}
