import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Avatar = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md', 
  className = '',
  online = false 
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  };

  const iconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 40
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizes[size]} rounded-full overflow-hidden bg-gray-200 flex items-center justify-center`}>
        {src ? (
          <img 
            src={src} 
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{ display: src ? 'none' : 'flex' }}>
          <ApperIcon name="User" size={iconSizes[size]} className="text-gray-500" />
        </div>
      </div>
      
      {online && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-white rounded-full"></div>
      )}
    </div>
  );
};

export default Avatar;