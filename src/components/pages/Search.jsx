import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SearchBar from '@/components/molecules/SearchBar';
import UserList from '@/components/organisms/UserList';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');

  const handleSearch = (query) => {
    setActiveQuery(query);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-secondary mb-2">
          Discover People
        </h1>
        <p className="text-gray-600">
          Find and connect with interesting people on Nexus
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          placeholder="Search for users..."
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
        />
      </div>

      {/* Search Results or Suggestions */}
      <div className="space-y-4">
        {activeQuery ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-secondary">
                Search Results for "{activeQuery}"
              </h2>
              <button
                onClick={() => {
                  setActiveQuery('');
                  setSearchQuery('');
                }}
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Clear search
              </button>
            </div>
            <UserList searchQuery={activeQuery} />
          </>
        ) : (
          <>
            <h2 className="text-lg font-semibold text-secondary">
              Suggested for You
            </h2>
            <UserList showSuggestions={true} />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Search;