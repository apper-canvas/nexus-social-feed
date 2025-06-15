import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PostCard from '@/components/molecules/PostCard';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import EmptyState from '@/components/organisms/EmptyState';
import ErrorState from '@/components/organisms/ErrorState';
import { postService } from '@/services';

const PostFeed = ({ userId = null }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, [userId]);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (userId) {
        result = await postService.getByUserId(userId);
      } else {
        result = await postService.getFeed();
      }
      setPosts(result);
    } catch (err) {
      setError(err.message || 'Failed to load posts');
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-xl shadow-sm border border-gray-100 p-4"
          >
            <div className="animate-pulse space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="h-40 bg-gray-200 rounded-lg"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadPosts} />;
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon="FileText"
        title={userId ? "No posts yet" : "Your feed is empty"}
        description={
          userId 
            ? "This user hasn't shared anything yet. Check back later!"
            : "Follow some users to see their posts in your feed, or create your first post!"
        }
        actionLabel="Create Post"
        onAction={() => window.location.href = '/create'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PostCard 
            post={post} 
            onUpdate={handlePostUpdate}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default PostFeed;