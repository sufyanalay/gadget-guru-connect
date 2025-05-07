
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1">
      <div className="animate-bounce h-1.5 w-1.5 bg-muted-foreground rounded-full delay-0"></div>
      <div className="animate-bounce h-1.5 w-1.5 bg-muted-foreground rounded-full delay-150"></div>
      <div className="animate-bounce h-1.5 w-1.5 bg-muted-foreground rounded-full delay-300"></div>
    </div>
  );
};

export default TypingIndicator;
