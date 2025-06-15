import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import { userService } from '@/services';

const UserCard = ({ user, showFollowButton = true, onFollow }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(user.followersCount || 0);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (loading) return;
    
    setLoading(true);
    const prevFollowing = isFollowing;
    const prevCount = followersCount;
    
    // Optimistic update
    setIsFollowing(!isFollowing);
    setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
    
    try {
      if (isFollowing) {
        await userService.unfollowUser(user.id);
        toast.success(`Unfollowed ${user.username}`);
      } else {
        await userService.followUser(user.id);
        toast.success(`Now following ${user.username}`);
      }
      onFollow?.(user.id, !isFollowing);
    } catch (error) {
      // Rollback on error
      setIsFollowing(prevFollowing);
      setFollowersCount(prevCount);
      toast.error('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-surface rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start space-x-3">
        <Link to={`/profile/${user.id}`}>
          <Avatar 
            src={user.avatar} 
            alt={user.username}
            size="lg"
          />
        </Link>
        
        <div className="flex-1 min-w-0">
          <Link 
            to={`/profile/${user.id}`}
            className="block hover:text-primary transition-colors"
          >
            <h3 className="font-semibold text-secondary truncate">
              {user.username}
            </h3>
          </Link>
          
          <p className="text-sm text-gray-500 mt-1 line-clamp-2 break-words">
            {user.bio}
          </p>
          
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <span>{followersCount.toLocaleString()} followers</span>
            <span>{user.followingCount?.toLocaleString() || 0} following</span>
          </div>
        </div>
        
        {showFollowButton && user.id !== 'current-user-id' && (
          <Button
            variant={isFollowing ? 'outline' : 'primary'}
            size="sm"
            onClick={handleFollow}
            loading={loading}
            className="flex-shrink-0"
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default UserCard;