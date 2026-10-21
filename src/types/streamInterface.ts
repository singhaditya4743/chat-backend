import type { Message, MessageListItem } from '@/types/messageInterface';

export type MessageEventType = 'message.created' | 'message.updated';

export interface MessageChange {
  type: MessageEventType;
  message: Message;
}

export interface MessageStreamEvent {
  type: MessageEventType;
  chatId: string;
  message: MessageListItem;
}

export type StopStream = () => void;
