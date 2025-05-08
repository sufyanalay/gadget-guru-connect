
import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneCall, Video } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CallButtonProps {
  recipientId: string;
  recipientName: string;
  type: 'audio' | 'video';
  onCallInitiated: (type: 'audio' | 'video') => void;
}

const CallButton: React.FC<CallButtonProps> = ({ 
  recipientId, 
  recipientName, 
  type,
  onCallInitiated 
}) => {
  const { toast } = useToast();
  
  const handleCallClick = () => {
    // In a real app, this would initiate the actual call
    onCallInitiated(type);
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCallClick}
      title={`${type === 'audio' ? 'Audio' : 'Video'} call ${recipientName}`}
    >
      {type === 'audio' ? <PhoneCall size={18} /> : <Video size={18} />}
    </Button>
  );
};

export default CallButton;
