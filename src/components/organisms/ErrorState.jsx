import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-12 px-4 ${className}`}
    >
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name="AlertCircle" size={32} className="text-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-secondary mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="primary" 
            onClick={onRetry}
          >
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorState;