
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PhoneCall, Video, VideoOff, MicOff, Mic, PhoneOff } from 'lucide-react';

interface CallInterfaceProps {
  isOpen: boolean;
  callType: 'audio' | 'video';
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  callStatus: 'connecting' | 'ringing' | 'ongoing' | 'ended';
  onClose: () => void;
}

const CallInterface: React.FC<CallInterfaceProps> = ({
  isOpen,
  callType,
  recipientId,
  recipientName,
  recipientAvatar,
  callStatus,
  onClose
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  
  // Timer for call duration
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (callStatus === 'ongoing') {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callStatus]);
  
  const formatCallDuration = () => {
    const minutes = Math.floor(callDuration / 60);
    const seconds = callDuration % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleEndCall = () => {
    onClose();
  };
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  const toggleVideo = () => {
    setIsVideoOff(prev => !prev);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent 
        className="sm:max-w-md p-0 overflow-hidden"
        style={{ 
          height: callType === 'video' ? '80vh' : '400px',
          maxHeight: callType === 'video' ? '80vh' : '400px',
          background: callType === 'video' ? '#1A1F2C' : undefined,
        }}
      >
        <div className={`flex flex-col h-full ${callType === 'video' ? 'bg-dark-purple text-white' : ''}`}>
          {/* Call header */}
          <div className={`p-4 text-center ${callType === 'video' ? 'absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50' : 'border-b'}`}>
            <div className="mb-2 flex items-center justify-center gap-2">
              {callType === 'audio' ? <PhoneCall size={18} /> : <Video size={18} />}
              <span className="text-sm font-medium">
                {callStatus === 'connecting' && 'Connecting...'}
                {callStatus === 'ringing' && 'Calling...'}
                {callStatus === 'ongoing' && formatCallDuration()}
                {callStatus === 'ended' && 'Call ended'}
              </span>
            </div>
            <h3 className="text-lg font-semibold">{recipientName}</h3>
          </div>
          
          {/* Call body */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {callType === 'video' ? (
              // Video call interface
              <div className="relative h-full w-full">
                {/* Main video (recipient) - In a real app, this would be the video stream */}
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  {isVideoOff ? (
                    <VideoOff size={64} className="text-gray-600" />
                  ) : (
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={recipientAvatar} />
                      <AvatarFallback className="text-4xl">{recipientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
                
                {/* Small video (self) - In a real app, this would be your video stream */}
                <div className="absolute bottom-20 right-4 h-32 w-24 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center">
                  {isVideoOff ? (
                    <VideoOff size={24} className="text-gray-600" />
                  ) : (
                    <span className="text-xs text-gray-400">Your camera</span>
                  )}
                </div>
              </div>
            ) : (
              // Audio call interface
              <div className="flex flex-col items-center justify-center p-8 gap-4">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={recipientAvatar} />
                  <AvatarFallback className="text-4xl">{recipientName.charAt(0)}</AvatarFallback>
                </Avatar>
                {callStatus === 'ringing' && (
                  <p className="text-muted-foreground animate-pulse">Ringing...</p>
                )}
                {callStatus === 'connecting' && (
                  <p className="text-muted-foreground animate-pulse">Connecting...</p>
                )}
                {callStatus === 'ongoing' && (
                  <p className="text-muted-foreground">{formatCallDuration()}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Call actions */}
          <div className={`p-6 flex items-center justify-center gap-6 
            ${callType === 'video' ? 'absolute bottom-0 left-0 right-0 z-10 bg-black bg-opacity-50' : 'border-t'}`
          }>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-12 w-12 bg-muted hover:bg-muted"
              onClick={toggleMute}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </Button>
            
            {callType === 'video' && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-12 w-12 bg-muted hover:bg-muted"
                onClick={toggleVideo}
              >
                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              </Button>
            )}
            
            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-12 w-12 bg-red-600 hover:bg-red-700"
              onClick={handleEndCall}
            >
              <PhoneOff size={20} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallInterface;
