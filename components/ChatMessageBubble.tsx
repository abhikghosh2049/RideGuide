import React from 'react';
import { ChatMessage } from '../types';
import { UserIcon } from './icons/UserIcon';
import { RideGuideIcon } from './icons/RideGuideIcon';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const alignment = isUser ? 'justify-end' : 'justify-start';
  const bubbleColor = isUser
    ? 'bg-purple-600'
    : 'bg-gray-700';

  const Icon = isUser ? UserIcon : RideGuideIcon;

  return (
    <div className={`flex items-end gap-3 ${alignment}`}>
      {!isUser && (
        <div className="flex-shrink-0">
          <Icon />
        </div>
      )}
      <div className="flex flex-col max-w-xs md:max-w-md">
        <div className={`rounded-2xl p-4 text-white ${bubbleColor}`}>
          {typeof message.content === 'string' ? (
             <p className="text-base">{message.content}</p>
          ) : (
            message.content
          )}
        </div>
        <span className={`text-xs text-gray-500 mt-1 px-2 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp}
        </span>
      </div>
       {isUser && (
        <div className="flex-shrink-0">
          <Icon />
        </div>
      )}
    </div>
  );
};

export default ChatMessageBubble;