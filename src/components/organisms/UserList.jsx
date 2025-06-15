import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import UserCard from '@/components/molecules/UserCard';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import EmptyState from '@/components/organisms/EmptyState';
import ErrorState from '@/components/organisms/ErrorState';
import { userService } from '@/services';

const UserList = ({ searchQuery = '', showSuggestions = false }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [searchQuery, showSuggestions]);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      if (searchQuery) {
        result = await userService.searchUsers(searchQuery);
      } else if (showSuggestions) {
        result = await userService.getSuggestions();
      } else {
        result = await userService.getAll();
      }
      setUsers(result);
    } catch (err) {
      setError(err.message || 'Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = (userId, isFollowing) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              followersCount: isFollowing 
                ? user.followersCount + 1 
                : Math.max(0, user.followersCount - 1)
            }
          : user
      )
    );
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
            className="bg-surface rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <div className="animate-pulse flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadUsers} />;
  }

  if (users.length === 0) {
    if (searchQuery) {
      return (
        <EmptyState
          icon="SearchX"
          title="No users found"
          description={`No users match "${searchQuery}". Try a different search term.`}
        />
      );
    }
    
    return (
      <EmptyState
        icon="Users"
        title="No users to show"
        description="There are no users to display right now."
      />
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user, index) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <UserCard 
            user={user} 
            showFollowButton={true}
            onFollow={handleFollow}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default UserList;