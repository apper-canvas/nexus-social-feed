import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = 'Search users...', 
  onSearch, 
  value = '',
  onChange,
  className = '' 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl transition-all duration-200 focus:outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 ${
            isFocused ? 'shadow-md' : ''
          }`}
        />
        
        {value && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => onChange?.('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={16} />
          </motion.button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;