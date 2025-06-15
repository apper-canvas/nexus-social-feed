import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { postService, userService } from '@/services';

const CreatePost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  React.useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await userService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to load current user:', error);
      }
    };
    
    loadCurrentUser();
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !imageFile) {
      toast.error('Please add some content to your post');
      return;
    }
    
    setLoading(true);
    
    try {
      // Mock image upload - in real app, you'd upload to a service
      let imageUrl = null;
      if (imageFile) {
        // Simulate image upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Use a placeholder image for demo
        imageUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop';
      }
      
      const postData = {
        content: content.trim(),
        imageUrl
      };
      
      await postService.create(postData);
      
      toast.success('Post created successfully!');
      navigate('/home');
    } catch (error) {
      toast.error(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const isValid = content.trim() || imageFile;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-secondary mb-2">
          Create Post
        </h1>
        <p className="text-gray-600">
          Share what's on your mind with your followers
        </p>
      </div>

      {/* Create Post Form */}
      <div className="bg-surface rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4">
            <Avatar 
              src={currentUser?.avatar} 
              alt={currentUser?.username}
              size="md"
            />
            <div>
              <h3 className="font-semibold text-secondary">
                {currentUser?.username || 'Loading...'}
              </h3>
              <p className="text-sm text-gray-500">Sharing publicly</p>
            </div>
          </div>

          {/* Content Input */}
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's happening?"
              rows={4}
              className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder-gray-400"
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {content.length}/500 characters
              </span>
            </div>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <img 
                src={imagePreview} 
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <ApperIcon name="X" size={16} />
              </button>
            </motion.div>
          )}

          {/* Post Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              {/* Image Upload */}
              <label className="flex items-center space-x-2 text-gray-600 hover:text-primary cursor-pointer transition-colors">
                <ApperIcon name="Image" size={20} />
                <span className="text-sm font-medium">Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={!isValid || loading}
              loading={loading}
            >
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePost;