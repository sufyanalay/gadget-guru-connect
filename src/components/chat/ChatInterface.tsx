import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Paperclip, Send, Image, FileText, X, Check, CheckCheck, Smile } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Message, MessageStatus, Attachment } from '@/types/chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import MessageBubble from '@/components/chat/MessageBubble';
import TypingIndicator from '@/components/chat/TypingIndicator';
import CallButton from '@/components/chat/CallButton';
import CallInterface from '@/components/chat/CallInterface';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentPreview, setAttachmentPreview] = useState<string>('');
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calling states
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState<'audio' | 'video'>('audio');
  const [callStatus, setCallStatus] = useState<'connecting' | 'ringing' | 'ongoing' | 'ended'>('connecting');

  // Mock initial messages - in real implementation, fetch messages from API
  useEffect(() => {
    // In real implementation, this would be an API call
    const fetchMessages = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const initialMessages: Message[] = [
          {
            id: '1',
            text: `Assalam Alaikum! I'm ${recipientName}. How can I help you today?`,
            sender: recipientId,
            recipient: user?.id || '',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            status: 'read'
          },
        ];
        
        setMessages(initialMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: 'Error',
          description: 'Could not load messages. Please try again later.',
          variant: 'destructive',
        });
      }
    };

    if (user && recipientId) {
      fetchMessages();
    }
  }, [recipientId, recipientName, user]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulate typing indicator from the recipient
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setIsRecipientTyping(false);
    }, 5000);

    return () => clearTimeout(typingTimeout);
  }, [isRecipientTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !attachment) || !user) return;

    setIsSending(true);

    // Create attachment if file is selected
    let messageAttachment: Attachment | undefined;
    if (attachment) {
      messageAttachment = {
        id: `attachment-${Date.now()}`,
        type: attachment.type.startsWith('image/') ? 'image' : 'file',
        url: attachmentPreview,
        name: attachment.name,
        size: attachment.size,
        contentType: attachment.type,
      };
    }

    // Create new message object
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage.trim(),
      sender: user.id,
      recipient: recipientId,
      timestamp: new Date(),
      status: 'sending',
      ...(messageAttachment ? { attachments: [messageAttachment] } : {}),
    };

    // Add message to UI immediately
    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    clearAttachment();

    try {
      // Simulate API call to send message
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update message status to 'sent' after successful API call
      setMessages(prevMessages =>
        prevMessages.map(msg => 
          msg.id === newMsg.id ? { ...msg, status: 'sent' as MessageStatus } : msg
        )
      );

      // After a short delay, update to 'delivered'
      setTimeout(() => {
        setMessages(prevMessages =>
          prevMessages.map(msg => 
            msg.id === newMsg.id ? { ...msg, status: 'delivered' as MessageStatus } : msg
          )
        );
      }, 1000);

      // Show typing indicator
      setTimeout(() => {
        setIsRecipientTyping(true);
      }, 1500);

      // Simulate a reply after typing
      setTimeout(() => {
        const replyMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          text: getAutoReply(recipientRole),
          sender: recipientId,
          recipient: user.id,
          timestamp: new Date(),
          status: 'delivered'
        };
        
        setIsRecipientTyping(false);
        setMessages(prev => [...prev, replyMessage]);
        
        // Update the reply to 'read' status after a short delay
        setTimeout(() => {
          setMessages(prevMessages =>
            prevMessages.map(msg => 
              msg.id === replyMessage.id ? { ...msg, status: 'read' as MessageStatus } : msg
            )
          );
        }, 1000);
      }, 3500);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update message status to 'failed'
      setMessages(prevMessages =>
        prevMessages.map(msg => 
          msg.id === newMsg.id ? { ...msg, status: 'failed' as MessageStatus } : msg
        )
      );
      
      toast({
        title: 'Message failed',
        description: 'Could not send your message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const getAutoReply = (role: string): string => {
    const replies: Record<string, string[]> = {
      teacher: [
        "That's a great question! Let me explain...",
        "Subhan Allah, I understand your problem. Here's how you can approach it...",
        "Mashallah, I've seen this issue before. Try working through it step by step.",
        "Jazak Allah Khair for your question. Let me help you understand this concept better.",
      ],
      technician: [
        "I can help you fix that. First, let's diagnose the issue Insha'Allah.",
        "That's a common problem with that device. Bismillah, here's what you should try...",
        "Alhamdulillah, I've worked on similar issues. Have you tried restarting the device?",
        "Let me walk you through the troubleshooting steps in detail.",
      ],
      student: [
        "I've faced that problem too. Maybe we can work on it together In Sha Allah?",
        "I'm not sure I know the answer, but Bismillah, I'm happy to discuss it.",
        "That's interesting! SubhanAllah, let's talk more about it.",
        "Masha Allah, I've studied that topic recently. Let me share what I learned.",
      ],
    };

    const defaultReplies = [
      "Jazak Allah Khair for your message. I'll get back to you soon.",
      "Alhamdulillah, I appreciate your question. Let me think about that.",
      "SubhanAllah, that's interesting. Can you tell me more?",
      "In Sha Allah, I'll help you with that as best I can.",
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

  // Call functions
  const handleInitiateCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setIsCallActive(true);
    setCallStatus('connecting');
    
    // Simulate the call being connected after a delay
    setTimeout(() => {
      setCallStatus('ringing');
      
      // Simulate call being answered after a delay
      setTimeout(() => {
        setCallStatus('ongoing');
        
        toast({
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} call started`,
          description: `You are in a ${type} call with ${recipientName}`,
        });
        
      }, 3000);
    }, 1000);
  };
  
  const handleEndCall = () => {
    setIsCallActive(false);
    setCallStatus('ended');
    
    toast({
      title: "Call ended",
      description: `Call with ${recipientName} has ended`,
    });
  };

  return (
    <div className="flex flex-col h-[70vh] bg-card rounded-md border overflow-hidden">
      {/* Chat header */}
      <div className="p-4 border-b bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="border-2 border-emerald-200 dark:border-emerald-700">
            <AvatarImage src={recipientAvatar} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200">
              {recipientName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium">{recipientName}</h3>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
              <p className="text-xs text-muted-foreground capitalize">{recipientRole}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CallButton 
            recipientId={recipientId}
            recipientName={recipientName}
            type="audio"
            onCallInitiated={handleInitiateCall}
          />
          <CallButton 
            recipientId={recipientId}
            recipientName={recipientName}
            type="video"
            onCallInitiated={handleInitiateCall}
          />
          <div className="text-xs text-muted-foreground">
            {isRecipientTyping ? 'typing...' : 'online'}
          </div>
        </div>
      </div>

      {/* Chat messages area */}
      <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-gray-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="space-y-1">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.sender === user?.id}
              recipientName={recipientName}
              userName={user?.name || ''}
            />
          ))}
          {isRecipientTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl p-3 bg-gray-100 dark:bg-slate-800 shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Attachment preview */}
      {attachment && (
        <div className="p-2 border-t bg-gray-50 dark:bg-slate-800">
          <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-700 rounded-md shadow-sm">
            {attachment.type.startsWith('image/') ? (
              <Image size={16} className="text-blue-500" />
            ) : (
              <FileText size={16} className="text-amber-500" />
            )}
            <span className="text-sm flex-1 truncate">{attachment.name}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900"
              onClick={clearAttachment}
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Chat input area */}
      <div className="p-4 border-t bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700">
        <div className="flex gap-2 items-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleAttachmentClick}
            disabled={isSending}
            className="bg-white hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <Paperclip size={18} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isSending}
            className="bg-white hover:bg-gray-100 dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <Smile size={18} />
          </Button>
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-white dark:bg-slate-700 border-gray-200 focus-visible:ring-emerald-500"
            disabled={isSending}
          />
          <Button
            type="button"
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && !attachment) || isSending}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
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

      {/* Call interface */}
      <CallInterface
        isOpen={isCallActive}
        callType={callType}
        recipientId={recipientId}
        recipientName={recipientName}
        recipientAvatar={recipientAvatar}
        callStatus={callStatus}
        onClose={handleEndCall}
      />
    </div>
  );
};

export default ChatInterface;
