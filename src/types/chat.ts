
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type CallType = 'audio' | 'video';
export type CallStatus = 'connecting' | 'ringing' | 'ongoing' | 'ended';

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

export interface Call {
  id: string;
  type: CallType;
  status: CallStatus;
  initiator: string;
  recipient: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}
