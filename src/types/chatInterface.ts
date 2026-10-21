export type ChatType = 'direct' | 'group';

export interface Chat {
  id: string;
  type: ChatType;
  // group only
  name: string | null;
  // direct only
  directKey: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatWithMembers extends Chat {
  memberIds: string[];
}

export type ChatSummary = { chatId: string } & Omit<ChatWithMembers, 'id' | 'directKey'>;

export interface CreateChatResult {
  chat: Chat;
  created: boolean;
}
