import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-2 px-5 py-3">
      <div 
        className="w-2 h-2 rounded-full bg-accent-purple/60 animate-bounce-dot"
        style={{ animationDelay: '0s' }}
      />
      <div 
        className="w-2 h-2 rounded-full bg-accent-purple/60 animate-bounce-dot"
        style={{ animationDelay: '0.2s' }}
      />
      <div 
        className="w-2 h-2 rounded-full bg-accent-purple/60 animate-bounce-dot"
        style={{ animationDelay: '0.4s' }}
      />
    </div>
  );
};

export default TypingIndicator;