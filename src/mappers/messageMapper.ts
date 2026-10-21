import type {
  DeletedMessage,
  EditedMessage,
  Message,
  MessageListItem,
  ReadMessage,
  SentMessage,
} from '@/types/messageInterface';

export const toSentMessage = (message: Message): SentMessage => ({
  messageId: message.messageId,
  chatId: message.chatId,
  senderId: message.senderId,
  text: message.text,
  createdAt: message.createdAt,
});

export const toReadMessage = (message: Message): ReadMessage => ({
  ...toSentMessage(message),
  readBy: message.readBy,
});

export const toEditedMessage =(message: Message): EditedMessage => ({
  messageId: message.messageId,
  chatId: message.chatId,
  senderId: message.senderId,
  text: message.text,
  editedAt: message.editedAt,
});

export const toDeletedMessage = (message: Message): DeletedMessage => ({
  messageId: message.messageId,
  chatId: message.chatId,
  deletedAt: message.deletedAt,
});

export const toMessageListItem = (message: Message): MessageListItem => {
  if (message.deletedAt) {
    return {
      messageId: message.messageId,
      senderId: message.senderId,
      createdAt: message.createdAt,
      isDeleted: true,
    };
  }
  return {
    messageId: message.messageId,
    senderId: message.senderId,
    text: message.text,
    createdAt: message.createdAt,
    readBy: message.readBy,
    isEdited: message.editedAt !== null,
    isDeleted: false,
  };
};
