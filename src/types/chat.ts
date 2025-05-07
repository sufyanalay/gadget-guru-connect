
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Attachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
  size?: number;
  contentType?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: string;
  recipient: string;
  timestamp: Date;
  status: MessageStatus;
  attachments?: Attachment[];
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}
