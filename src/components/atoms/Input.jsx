import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import EmojiPicker from "emoji-picker-react";
import ApperIcon from "@/components/ApperIcon";

const Input = ({ 
  label, 
  error, 
  className = '', 
  value = '',
  onChange,
  onFocus,
  onBlur,
  showEmojiPicker = false,
  ...props 
}) => {
const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = useRef(null);

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

  const handleEmojiClick = (emojiData) => {
    const input = inputRef.current;
    if (input && onChange) {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      const newValue = value.slice(0, start) + emojiData.emoji + value.slice(end);
      
      // Create synthetic event
      const event = {
        target: { value: newValue }
      };
      onChange(event);
      
      // Set cursor position after emoji
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start + emojiData.emoji.length, start + emojiData.emoji.length);
      }, 0);
    }
    setShowEmojis(false);
  };

  return (
    <div className={`relative ${className}`}>
    {label && <motion.label
        className={`absolute left-3 transition-all duration-200 pointer-events-none ${isFocused || hasValue || value ? "top-2 text-xs text-primary" : "top-1/2 -translate-y-1/2 text-gray-500"}`}
        animate={{
            y: isFocused || hasValue || value ? -20 : 0,
            scale: isFocused || hasValue || value ? 0.875 : 1
        }}>
        {label}
    </motion.label>}
    <div className="relative">
        <input
            ref={inputRef}
            className={`w-full px-3 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${error ? "border-error focus:ring-error/50 focus:border-error" : "border-gray-300"} ${label ? "pt-6 pb-2" : ""} ${showEmojiPicker ? "pr-12" : ""}`}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props} />
        {showEmojiPicker && <button
            type="button"
            onClick={() => setShowEmojis(!showEmojis)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors duration-200">
            <ApperIcon name="Smile" size={20} />
        </button>}
    </div>
    {error && <motion.p
        initial={{
            opacity: 0,
            y: -10
        }}
        animate={{
            opacity: 1,
            y: 0
        }}
        className="mt-1 text-sm text-error">
        {error}
    </motion.p>}
    {showEmojiPicker && showEmojis && <div className="absolute top-full left-0 z-50 mt-2">
        <div className="relative">
            <EmojiPicker
                onEmojiClick={handleEmojiClick}
                width={300}
                height={400}
                previewConfig={{
                    showPreview: false
                }}
                skinTonesDisabled
                searchDisabled={false} />
            <button
                type="button"
                onClick={() => setShowEmojis(false)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs hover:bg-gray-700 transition-colors">×
                            </button>
        </div>
    </div>}
</div>
  );
};