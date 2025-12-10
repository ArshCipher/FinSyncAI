import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

// Agent display names and colors
const agentInfo: Record<string, { name: string; color: string }> = {
  master: { name: 'Master', color: 'from-purple-500/20 to-purple-600/20' },
  sales: { name: 'Sales', color: 'from-blue-500/20 to-blue-600/20' },
  verification: { name: 'Verification', color: 'from-green-500/20 to-green-600/20' },
  underwriting: { name: 'Underwriting', color: 'from-orange-500/20 to-orange-600/20' },
  sanction: { name: 'Sanction', color: 'from-pink-500/20 to-pink-600/20' },
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { sender, content, meta } = message;

  // System messages
  if (sender === 'system') {
    return (
      <div className="flex justify-center py-4">
        <div className="text-sm text-white/40 text-center max-w-md">
          {content}
        </div>
      </div>
    );
  }

  // User messages
  if (sender === 'user') {
    return (
      <div className="flex justify-end py-2">
        <div className="max-w-md">
          <div className="glass px-5 py-3 rounded-3xl rounded-tr-lg bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 border-accent-purple/20">
            <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{content}</p>
          </div>
        </div>
      </div>
    );
  }

  // Assistant messages
  const agentData = meta?.agent ? agentInfo[meta.agent] : null;

  return (
    <div className="flex justify-start py-2">
      <div className="max-w-2xl w-full">
        {/* Agent tag */}
        {agentData && (
          <div className="mb-2 ml-1">
            <span className={`inline-block text-xs px-3 py-1 rounded-full bg-gradient-to-r ${agentData.color} text-white/60 font-medium`}>
              {agentData.name} Agent
            </span>
          </div>
        )}
        
        {/* Message bubble */}
        <div className="glass px-5 py-3 rounded-3xl rounded-tl-lg transition-all duration-300 hover:bg-white/5">
          <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap font-mono">{content}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
