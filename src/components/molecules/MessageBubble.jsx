import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';

const MessageBubble = ({ message, isCurrentUser, showAvatar = true, author }) => {
  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end space-x-2 max-w-full ${
        isCurrentUser ? 'flex-row-reverse space-x-reverse ml-auto' : 'mr-auto'
      }`}
    >
      {/* Avatar */}
      {showAvatar && !isCurrentUser && (
        <Avatar 
          src={author?.avatar} 
          alt={author?.username}
          size="sm"
          className="flex-shrink-0"
        />
      )}
      
      {/* Message Content */}
      <div className={`flex flex-col max-w-xs md:max-w-md ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`px-4 py-2 rounded-2xl break-words ${
            isCurrentUser
              ? 'bg-primary text-white rounded-br-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        
        {/* Timestamp */}
        <span className="text-xs text-gray-500 mt-1 px-2">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </motion.div>
  );
};

export default MessageBubble;