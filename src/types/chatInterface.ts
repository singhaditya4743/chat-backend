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

export interface ChatWithMembers extends Chat {
  memberIds: string[];
}

// What the API returns: `chatId` like POST /chat/create, and no internal directKey
export type ChatSummary = { chatId: string } & Omit<ChatWithMembers, 'id' | 'directKey'>;

export interface CreateChatResult {
  chat: Chat;
  // false when the chat already existed and was returned as is
  created: boolean;
}
