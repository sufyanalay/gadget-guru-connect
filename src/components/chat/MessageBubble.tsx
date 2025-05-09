
import React from 'react';
import { Check, CheckCheck, FileText } from 'lucide-react';
import { Message } from '@/types/chat';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  recipientName: string;
  userName: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  recipientName,
  userName,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderStatusIcon = () => {
    if (!isCurrentUser) return null;
    
    switch (message.status) {
      case 'sending':
        return <span className="text-muted-foreground/70 text-[10px]">sending</span>;
      case 'sent':
        return <Check size={14} className="text-muted-foreground/70" />;
      case 'delivered':
        return <CheckCheck size={14} className="text-muted-foreground/70" />;
      case 'read':
        return <CheckCheck size={14} className="text-primary" />;
      case 'failed':
        return <span className="text-destructive text-[10px]">failed</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`flex gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>{recipientName[0]}</AvatarFallback>
        </Avatar>
      )}
      
      <div
        className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
          isCurrentUser
            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
            : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800'
        }`}
      >
        {message.attachments && message.attachments.length > 0 && (
          <>
            {message.attachments.map(attachment => (
              <div key={attachment.id} className="mb-2">
                {attachment.type === 'image' ? (
                  <img
                    src={attachment.url}
                    alt="Attachment"
                    className="max-h-60 rounded-md object-contain mb-2"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-background/50 rounded-md mb-2">
                    <FileText size={16} />
                    <span className="text-sm truncate">{attachment.name}</span>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
        
        {message.text && <p className="text-sm">{message.text}</p>}
        
        <div className={`flex items-center gap-1 mt-1 ${isCurrentUser ? 'justify-end' : ''}`}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={`text-xs ${isCurrentUser ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {formatTime(message.timestamp)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {message.timestamp.toLocaleString()}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <span className="ml-1">{renderStatusIcon()}</span>
        </div>
      </div>
      
      {isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>{userName[0]}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageBubble;
