import React from 'react';
import { MessageCircleMore, BotMessageSquare } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-500' : 'bg-gray-600'
        }`}>
        {isUser ? <MessageCircleMore className="w-5 h-5 text-white" /> : <BotMessageSquare className="w-5 h-5 text-white" />}
      </div>
      <div className={`flex-1 px-4 py-2 rounded-lg ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
        }`}>
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}