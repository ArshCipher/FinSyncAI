import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onFileUpload?: (file: File) => void;
  showFileUpload?: boolean;
  quickReplies?: string[];
  onQuickReply?: (reply: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  isLoading, 
  input, 
  onInputChange, 
  onSend,
  onFileUpload,
  showFileUpload = false
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log('🟢 ChatWindow render - showFileUpload:', showFileUpload);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 lg:px-12 xl:px-20 py-4 sm:py-6 lg:py-8 safe-area">
      {/* Chat card with glassmorphism */}
      <div className="glass rounded-2xl sm:rounded-3xl w-full max-w-2xl flex flex-col shadow-2xl" style={{ height: 'calc(100% - 2rem)', maxHeight: 'calc(100vh - 2rem)' }}>
        {/* macOS-style window controls */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-sm font-medium text-white/60">FinSync AI Assistant</span>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto scrollbar-premium px-6 py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="glass rounded-3xl rounded-tl-lg">
                  <TypingIndicator />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Quick Reply Chips */}
        {quickReplies && quickReplies.length > 0 && (
          <div className="px-6 py-3 border-t border-white/5">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => onQuickReply?.(reply)}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="p-6 border-t border-white/5">
          {showFileUpload && (
            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-3 glass rounded-2xl px-5 py-4 text-sm text-white/70 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-300 border border-white/10 hover:border-accent-purple/50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload Salary Slip (PDF, Image)</span>
              </label>
            </div>
          )}
          
          <div className="relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about loan eligibility, approval process..."
              disabled={isLoading}
              rows={1}
              className="w-full glass rounded-2xl px-5 py-4 pr-14 text-sm text-white placeholder-white/30 resize-none focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all duration-300 disabled:opacity-50"
              style={{ maxHeight: '120px' }}
            />
            
            {/* Send button */}
            <button
              onClick={onSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-accent-purple to-accent-cyan rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed glow-purple"
            >
              <svg 
                className="w-5 h-5 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
