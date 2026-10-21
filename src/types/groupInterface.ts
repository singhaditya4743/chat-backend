import type { ChatMember } from '@/types/chatMemberInterface';

export type GroupMember = Omit<ChatMember, 'chatId'>;

export interface GroupDetails {
  chatId: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  members: GroupMember[];
}
