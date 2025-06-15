import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { postService, userService } from '@/services';

const PostCard = ({ post, onUpdate }) => {
  const [isLiked, setIsLiked] = useState(post.likes?.includes('current-user-id') || false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const loadAuthor = async () => {
      try {
        const userData = await userService.getById(post.userId);
        setAuthor(userData);
      } catch (error) {
        console.error('Failed to load author:', error);
      }
    };
    
    if (post.userId) {
      loadAuthor();
    }
  }, [post.userId]);

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    const prevLiked = isLiked;
    const prevCount = likeCount;
    
    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    
    try {
      const updatedPost = await postService.toggleLike(post.id, 'current-user-id');
      onUpdate?.(updatedPost);
    } catch (error) {
      // Rollback on error
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error('Failed to update like');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      {/* Post Header */}
      <div className="p-4 pb-3">
        <Link to={`/profile/${post.userId}`} className="flex items-center space-x-3 group">
          <Avatar 
            src={author?.avatar} 
            alt={author?.username}
            size="md"
          />
          <div>
            <h3 className="font-semibold text-secondary group-hover:text-primary transition-colors">
              {author?.username || 'Loading...'}
            </h3>
            <p className="text-sm text-gray-500">
              {formatTime(post.createdAt)}
            </p>
          </div>
        </Link>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 leading-relaxed break-words">
          {post.content}
        </p>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div className="px-4 pb-3">
          <div className="rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={post.imageUrl} 
              alt="Post content"
              className="w-full h-auto object-cover max-h-96"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              disabled={loading}
              className={`flex items-center space-x-2 transition-colors duration-200 ${
                isLiked ? 'text-accent' : 'text-gray-500 hover:text-accent'
              }`}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ApperIcon 
                  name={isLiked ? 'Heart' : 'Heart'} 
                  size={20}
                  className={isLiked ? 'fill-current' : ''}
                />
              </motion.div>
              <span className="text-sm font-medium">{likeCount}</span>
            </motion.button>

            {/* Comment Button */}
            <Link 
              to={`/post/${post.id}`}
              className="flex items-center space-x-2 text-gray-500 hover:text-secondary transition-colors duration-200"
            >
              <ApperIcon name="MessageCircle" size={20} />
              <span className="text-sm font-medium">{post.comments?.length || 0}</span>
            </Link>
          </div>

          {/* Share Button */}
          <button 
            className="text-gray-500 hover:text-secondary transition-colors duration-200"
            onClick={() => toast.info('Share feature coming soon!')}
          >
            <ApperIcon name="Share" size={20} />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default PostCard;