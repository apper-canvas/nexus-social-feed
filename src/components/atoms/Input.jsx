import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Input = ({ 
  label, 
  error, 
  className = '', 
  value = '',
  onChange,
  onFocus,
  onBlur,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    onBlur?.(e);
  };

  const handleChange = (e) => {
    setHasValue(e.target.value.length > 0);
    onChange?.(e);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <motion.label
          className={`absolute left-3 transition-all duration-200 pointer-events-none ${
            isFocused || hasValue || value
              ? 'top-2 text-xs text-primary'
              : 'top-1/2 -translate-y-1/2 text-gray-500'
          }`}
          animate={{
            y: isFocused || hasValue || value ? -20 : 0,
            scale: isFocused || hasValue || value ? 0.875 : 1,
          }}
        >
          {label}
        </motion.label>
      )}
      
      <input
        className={`w-full px-3 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
          error 
            ? 'border-error focus:ring-error/50 focus:border-error' 
            : 'border-gray-300'
        } ${label ? 'pt-6 pb-2' : ''}`}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;