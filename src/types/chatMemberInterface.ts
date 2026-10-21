export type MemberRole = 'admin' | 'member';

export interface ChatMember {
  chatId: string;
  userId: string;
  role: MemberRole;
  joinedAt: Date;
}
