
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Paperclip, Send, Image, FileText, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type MessageType = {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  attachment?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  };
};

interface ChatInterfaceProps {
  recipientId: string;
  recipientName: string;
  recipientRole: string;
  recipientAvatar?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  recipientId,
  recipientName,
  recipientRole,
  recipientAvatar,
}) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock initial messages
  useEffect(() => {
    const initialMessages: MessageType[] = [
      {
        id: '1',
        text: `Hello! I'm ${recipientName}. How can I help you today?`,
        sender: recipientId,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
    ];
    setMessages(initialMessages);
  }, [recipientId, recipientName]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if ((!newMessage.trim() && !attachment) || !user) return;

    const newMsg: MessageType = {
      id: `msg-${Date.now()}`,
      text: newMessage.trim(),
      sender: user.id,
      timestamp: new Date(),
      ...(attachment && attachmentPreview
        ? {
            attachment: {
              type: attachment.type.startsWith('image/') ? 'image' : 'file',
              url: attachmentPreview,
              name: attachment.name,
            },
          }
        : {}),
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
    clearAttachment();

    // Simulate reply after a short delay
    setTimeout(() => {
      const replyMessage: MessageType = {
        id: `msg-${Date.now() + 1}`,
        text: getAutoReply(recipientRole),
        sender: recipientId,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 2000);
  };

  const getAutoReply = (role: string): string => {
    const replies: Record<string, string[]> = {
      teacher: [
        "That's a great question! Let me explain...",
        "I understand your problem. Here's how you can approach it...",
        "I've seen this issue before. Try working through it step by step.",
        "Let me help you understand this concept better.",
      ],
      technician: [
        "I can help you fix that. First, let's diagnose the issue.",
        "That sounds like a common problem with that device. Here's what you should try...",
        "I've worked on similar issues. Have you tried restarting the device?",
        "Let me walk you through the troubleshooting steps.",
      ],
      student: [
        "I've faced that problem too. Maybe we can work on it together?",
        "I'm not sure I know the answer, but I'm happy to discuss it.",
        "That's interesting! Let's talk more about it.",
        "I've studied that topic recently. Let me share what I learned.",
      ],
    };

    const defaultReplies = [
      "Thanks for your message. I'll get back to you soon.",
      "I appreciate your question. Let me think about that.",
      "That's interesting. Can you tell me more?",
      "I'll help you with that as best I can.",
    ];

    const roleReplies = replies[role.toLowerCase()] || defaultReplies;
    return roleReplies[Math.floor(Math.random() * roleReplies.length)];
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setAttachment(file);
    const url = URL.createObjectURL(file);
    setAttachmentPreview(url);
  };

  const clearAttachment = () => {
    if (attachmentPreview) {
      URL.revokeObjectURL(attachmentPreview);
    }
    setAttachment(null);
    setAttachmentPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[70vh] bg-card rounded-md border overflow-hidden">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={recipientAvatar} />
            <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{recipientName}</h3>
            <p className="text-xs text-muted-foreground capitalize">{recipientRole}</p>
          </div>
        </div>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isCurrentUser = message.sender === user?.id;
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  isCurrentUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.attachment && (
                  <div className="mb-2">
                    {message.attachment.type === 'image' ? (
                      <img
                        src={message.attachment.url}
                        alt="Attachment"
                        className="max-h-60 rounded-md object-contain mb-2"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-background/50 rounded-md">
                        <FileText size={16} />
                        <span className="text-sm truncate">{message.attachment.name}</span>
                      </div>
                    )}
                  </div>
                )}
                {message.text && <p className="text-sm">{message.text}</p>}
                <div className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment preview */}
      {attachment && (
        <div className="p-2 border-t">
          <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
            {attachment.type.startsWith('image/') ? (
              <Image size={16} />
            ) : (
              <FileText size={16} />
            )}
            <span className="text-sm flex-1 truncate">{attachment.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={clearAttachment}
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Chat input area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAttachmentClick}
          >
            <Paperclip size={18} />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && !attachment}
          >
            <Send size={18} />
          </Button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />
      </div>
    </div>
  );
};

export default ChatInterface;
