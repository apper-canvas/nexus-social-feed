import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import PostFeed from '@/components/organisms/PostFeed';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import ErrorState from '@/components/organisms/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { userService } from '@/services';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Use current user if no userId provided
  const targetUserId = userId || 'current-user-id';
  const isOwnProfile = targetUserId === 'current-user-id';

  useEffect(() => {
    loadUser();
  }, [targetUserId]);

  const loadUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = isOwnProfile 
        ? await userService.getCurrentUser()
        : await userService.getById(targetUserId);
      
      setUser(userData);
      // Mock following status for demo
      setIsFollowing(Math.random() > 0.5);
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (followLoading) return;
    
    setFollowLoading(true);
    const prevFollowing = isFollowing;
    const prevCount = user.followersCount;
    
    // Optimistic update
    setIsFollowing(!isFollowing);
    setUser(prev => ({
      ...prev,
      followersCount: isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
    }));
    
    try {
      if (isFollowing) {
        await userService.unfollowUser(targetUserId);
        toast.success(`Unfollowed ${user.username}`);
      } else {
        await userService.followUser(targetUserId);
        toast.success(`Now following ${user.username}`);
      }
    } catch (error) {
      // Rollback on error
      setIsFollowing(prevFollowing);
      setUser(prev => ({ ...prev, followersCount: prevCount }));
      toast.error('Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleMessage = () => {
    window.location.href = `/chat/${targetUserId}`;
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-full"
      >
        <div className="animate-pulse space-y-6">
          {/* Profile Header Skeleton */}
          <div className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex space-x-6">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Posts Skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-surface rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadUser} />;
  }

  if (!user) {
    return <ErrorState message="User not found" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full"
    >
      {/* Profile Header */}
      <div className="bg-surface rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start space-x-4">
          <Avatar 
            src={user.avatar} 
            alt={user.username}
            size="2xl"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-heading font-bold text-secondary truncate">
                  {user.username}
                </h1>
                <p className="text-gray-600 mt-2 break-words">
                  {user.bio}
                </p>
              </div>
              
              {!isOwnProfile && (
                <div className="flex space-x-2 flex-shrink-0 ml-4">
                  <Button
                    variant={isFollowing ? 'outline' : 'primary'}
                    onClick={handleFollow}
                    loading={followLoading}
                    size="sm"
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={handleMessage}
                    size="sm"
                  >
                    <ApperIcon name="MessageCircle" size={16} />
                  </Button>
                </div>
              )}
            </div>
            
            {/* Stats */}
            <div className="flex items-center space-x-6 mt-4 text-sm">
              <div>
                <span className="font-semibold text-secondary">
                  {user.followersCount?.toLocaleString() || 0}
                </span>
                <span className="text-gray-500 ml-1">followers</span>
              </div>
              <div>
                <span className="font-semibold text-secondary">
                  {user.followingCount?.toLocaleString() || 0}
                </span>
                <span className="text-gray-500 ml-1">following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold text-secondary">
          {isOwnProfile ? 'Your Posts' : `${user.username}'s Posts`}
        </h2>
        
        <PostFeed userId={targetUserId} />
      </div>
    </motion.div>
  );
};

export default Profile;