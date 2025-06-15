import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  icon = 'Inbox', 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-12 px-4 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="inline-block"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} size={32} className="text-gray-400" />
        </div>
      </motion.div>
      
      <h3 className="text-lg font-semibold text-secondary mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="primary" 
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EmptyState;