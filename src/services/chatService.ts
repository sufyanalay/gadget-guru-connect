
import { Message, ChatSession } from '@/types/chat';
import { fetchWithAuth, uploadWithAuth } from '@/utils/apiClient';

// Base API URL for WebSocket connections
const API_URL = import.meta.env.VITE_API_URL;

// Chat API services
export const chatService = {
  // Get all chat sessions for the current user
  getUserChats: async (): Promise<ChatSession[]> => {
    return fetchWithAuth('/chats/');
  },
  
  // Get messages for a specific chat
  getChatMessages: async (chatId: string): Promise<Message[]> => {
    return fetchWithAuth(`/chats/${chatId}/messages/`);
  },
  
  // Send a new message
  sendMessage: async (chatId: string, message: Partial<Message>): Promise<Message> => {
    return fetchWithAuth(`/chats/${chatId}/messages/`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  },
  
  // Upload an attachment
  uploadAttachment: async (chatId: string, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${API_URL}/chats/${chatId}/attachments/`, {
      method: 'POST',
      headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload attachment');
    }
    
    const data = await response.json();
    return data.url;
  },
  
  // Mark messages as read
  markMessagesAsRead: async (chatId: string, messageIds: string[]): Promise<void> => {
    return fetchWithAuth(`/chats/${chatId}/messages/read/`, {
      method: 'POST',
      body: JSON.stringify({ messageIds }),
    });
  },
  
  // Create a new chat session
  createChatSession: async (recipientId: string): Promise<ChatSession> => {
    return fetchWithAuth('/chats/', {
      method: 'POST',
      body: JSON.stringify({ recipientId }),
    });
  },
};

export default chatService;
