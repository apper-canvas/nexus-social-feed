import React from 'react';
import { motion } from 'framer-motion';
import PostFeed from '@/components/organisms/PostFeed';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-secondary mb-2">
          Your Feed
        </h1>
        <p className="text-gray-600">
          Stay connected with the latest from people you follow
        </p>
      </div>

      {/* Post Feed */}
      <PostFeed />
    </motion.div>
  );
};

export default Home;