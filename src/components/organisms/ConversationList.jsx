import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import EmptyState from '@/components/organisms/EmptyState';
import ErrorState from '@/components/organisms/ErrorState';
import { messageService, userService } from '@/services';

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const convs = await messageService.getConversations();
      
      // Load partner details for each conversation
      const conversationsWithUsers = await Promise.all(
        convs.map(async (conv) => {
          try {
            const partner = await userService.getById(conv.partnerId);
            return { ...conv, partner };
          } catch (err) {
            console.error('Failed to load partner details:', err);
            return { ...conv, partner: null };
          }
        })
      );
      
      setConversations(conversationsWithUsers);
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center space-x-3 p-4 bg-surface rounded-xl border border-gray-100"
          >
            <div className="animate-pulse flex items-center space-x-3 w-full">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadConversations} />;
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon="MessageCircle"
        title="No conversations yet"
        description="Start a conversation by searching for users and sending them a message."
        actionLabel="Find Users"
        onAction={() => window.location.href = '/search'}
      />
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation, index) => (
        <motion.div
          key={conversation.partnerId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link 
            to={`/chat/${conversation.partnerId}`}
            className="block"
          >
            <motion.div
              whileHover={{ backgroundColor: '#f8fafc' }}
              className="flex items-center space-x-3 p-4 bg-surface hover:bg-gray-50 rounded-xl border border-gray-100 transition-all duration-200"
            >
              <div className="flex-shrink-0 relative">
                <Avatar 
                  src={conversation.partner?.avatar} 
                  alt={conversation.partner?.username}
                  size="lg"
                />
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-secondary truncate">
                    {conversation.partner?.username || 'Unknown User'}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatTime(conversation.lastMessage.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 truncate mt-1">
                  {conversation.lastMessage.senderId === 'current-user-id' && 'You: '}
                  {conversation.lastMessage.content}
                </p>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default ConversationList;