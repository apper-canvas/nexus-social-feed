import React from 'react';
import { motion } from 'framer-motion';
import ConversationList from '@/components/organisms/ConversationList';

const Chat = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-secondary mb-2">
          Messages
        </h1>
        <p className="text-gray-600">
          Stay in touch with your connections
        </p>
      </div>

      {/* Conversations List */}
      <ConversationList />
    </motion.div>
  );
};

export default Chat;