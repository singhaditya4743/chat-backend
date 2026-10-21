export type ChatType = 'direct' | 'group';

export interface Chat {
  id: string;
  type: ChatType;
  // Only set for group chats
  name: string | null;
  // Sorted "userA:userB" pair, only set for direct chats
  directKey: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
