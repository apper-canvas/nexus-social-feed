import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import MessageBubble from '@/components/molecules/MessageBubble';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { messageService, userService } from '@/services';

const ChatThread = () => {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const currentUserId = 'current-user-id';

  useEffect(() => {
    if (userId) {
      loadPartner();
      loadMessages();
    }
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadPartner = async () => {
    try {
      const userData = await userService.getById(userId);
      setPartner(userData);
    } catch (err) {
      console.error('Failed to load partner:', err);
    }
  };

  const loadMessages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const messagesData = await messageService.getMessages(currentUserId, userId);
      setMessages(messagesData);
      
      // Mark conversation as read
      await messageService.markConversationAsRead(currentUserId, userId);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      return;
    }
    
    setSending(true);
    const messageContent = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX
    
    try {
      const sentMessage = await messageService.sendMessage(
        currentUserId,
        userId,
        messageContent
      );
      
      setMessages(prev => [...prev, sentMessage]);
      toast.success('Message sent!');
    } catch (error) {
      setNewMessage(messageContent); // Restore message on error
      toast.error(error.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-full h-96 flex items-center justify-center"
      >
        <LoadingSpinner size="lg" />
      </motion.div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadMessages} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full"
    >
      {/* Chat Header */}
      <div className="bg-surface rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex items-center space-x-3">
          <Link to="/chat" className="text-gray-500 hover:text-secondary md:hidden">
            <ApperIcon name="ArrowLeft" size={20} />
          </Link>
          
          <Link to={`/profile/${userId}`} className="flex items-center space-x-3 group">
            <Avatar 
              src={partner?.avatar} 
              alt={partner?.username}
              size="md"
              online={true}
            />
            <div>
              <h2 className="font-semibold text-secondary group-hover:text-primary transition-colors">
                {partner?.username || 'Loading...'}
              </h2>
              <p className="text-sm text-gray-500">Active now</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Messages Container */}
      <div className="bg-surface rounded-xl shadow-sm border border-gray-100 flex flex-col h-96">
        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto chat-scroll">
          {messages.length === 0 ? (
            <EmptyState
              icon="MessageCircle"
              title="Start the conversation"
              description={`Send a message to ${partner?.username || 'this user'} to get started.`}
            />
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isCurrentUser = message.senderId === currentUserId;
                const showAvatar = index === 0 || 
                  messages[index - 1].senderId !== message.senderId;
                
                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isCurrentUser={isCurrentUser}
                    showAvatar={showAvatar}
                    author={isCurrentUser ? null : partner}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-100 p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${partner?.username || ''}...`}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              disabled={sending}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!newMessage.trim() || sending}
              loading={sending}
              className="rounded-full px-6"
            >
              <ApperIcon name="Send" size={16} />
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatThread;