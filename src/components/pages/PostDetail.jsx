import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import CommentItem from '@/components/molecules/CommentItem';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorState from '@/components/organisms/ErrorState';
import EmptyState from '@/components/organisms/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { postService, commentService, userService } from '@/services';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (id) {
      loadPost();
      loadComments();
    }
  }, [id]);

  const loadPost = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const postData = await postService.getById(id);
      setPost(postData);
      setIsLiked(postData.likes?.includes('current-user-id') || false);
      setLikeCount(postData.likes?.length || 0);
      
      // Load author
      const authorData = await userService.getById(postData.userId);
      setAuthor(authorData);
    } catch (err) {
      setError(err.message || 'Failed to load post');
      toast.error('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const commentsData = await commentService.getByPostId(id);
      setComments(commentsData);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    
    const prevLiked = isLiked;
    const prevCount = likeCount;
    
    // Optimistic update
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    
    try {
      const updatedPost = await postService.toggleLike(post.id, 'current-user-id');
      setPost(updatedPost);
    } catch (error) {
      // Rollback on error
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error('Failed to update like');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    setCommentLoading(true);
    
    try {
      const commentData = {
        postId: id,
        content: newComment.trim()
      };
      
      const createdComment = await commentService.create(commentData);
      setComments(prev => [...prev, createdComment]);
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-full"
      >
        <div className="animate-pulse space-y-6">
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-40 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (error || !post) {
    return <ErrorState message={error || 'Post not found'} onRetry={loadPost} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full"
    >
      {/* Post Detail */}
      <article className="bg-surface rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Post Header */}
        <div className="p-6 pb-4">
          <Link to={`/profile/${post.userId}`} className="flex items-center space-x-3 group">
            <Avatar 
              src={author?.avatar} 
              alt={author?.username}
              size="lg"
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
        <div className="px-6 pb-4">
          <p className="text-gray-800 leading-relaxed break-words text-lg">
            {post.content}
          </p>
        </div>

        {/* Post Image */}
        {post.imageUrl && (
          <div className="px-6 pb-4">
            <div className="rounded-lg overflow-hidden bg-gray-100">
              <img 
                src={post.imageUrl} 
                alt="Post content"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Post Actions */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Like Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`flex items-center space-x-2 transition-colors duration-200 ${
                  isLiked ? 'text-accent' : 'text-gray-500 hover:text-accent'
                }`}
              >
                <motion.div
                  animate={isLiked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ApperIcon 
                    name="Heart" 
                    size={24}
                    className={isLiked ? 'fill-current' : ''}
                  />
                </motion.div>
                <span className="font-medium">{likeCount}</span>
              </motion.button>

              {/* Comment Count */}
              <div className="flex items-center space-x-2 text-gray-500">
                <ApperIcon name="MessageCircle" size={24} />
                <span className="font-medium">{comments.length}</span>
              </div>
            </div>

            {/* Share Button */}
            <button 
              className="text-gray-500 hover:text-secondary transition-colors duration-200"
              onClick={() => toast.info('Share feature coming soon!')}
            >
              <ApperIcon name="Share" size={24} />
            </button>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-surface rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-secondary mb-4">
          Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
<form onSubmit={handleAddComment} className="mb-6">
          <div className="space-y-3">
            <Input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full"
              showEmojiPicker={true}
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!newComment.trim() || commentLoading}
                loading={commentLoading}
              >
                Comment
              </Button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        {comments.length === 0 ? (
          <EmptyState
            icon="MessageCircle"
            title="No comments yet"
            description="Be the first to share your thoughts on this post."
          />
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PostDetail;