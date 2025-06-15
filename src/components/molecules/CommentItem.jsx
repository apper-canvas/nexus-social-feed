import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import { userService } from '@/services';

const CommentItem = ({ comment }) => {
  const [author, setAuthor] = useState(null);

  React.useEffect(() => {
    const loadAuthor = async () => {
      try {
        const userData = await userService.getById(comment.userId);
        setAuthor(userData);
      } catch (error) {
        console.error('Failed to load comment author:', error);
      }
    };
    
    if (comment.userId) {
      loadAuthor();
    }
  }, [comment.userId]);

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex space-x-3"
    >
      <Link to={`/profile/${comment.userId}`} className="flex-shrink-0">
        <Avatar 
          src={author?.avatar} 
          alt={author?.username}
          size="sm"
        />
      </Link>
      
      <div className="flex-1 min-w-0">
        <div className="bg-gray-50 rounded-lg px-3 py-2">
          <Link 
            to={`/profile/${comment.userId}`}
            className="font-semibold text-sm text-secondary hover:text-primary transition-colors"
          >
            {author?.username || 'Loading...'}
          </Link>
          <p className="text-sm text-gray-800 mt-1 break-words">
            {comment.content}
          </p>
        </div>
        
        <p className="text-xs text-gray-500 mt-1 ml-3">
          {formatTime(comment.createdAt)}
        </p>
      </div>
    </motion.div>
  );
};

export default CommentItem;