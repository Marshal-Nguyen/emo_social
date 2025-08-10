import React, { useState } from "react";
import { Heart, MessageCircle, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import IconButton from "../atoms/IconButton";
import Button from "../atoms/Button";

const PostActions = ({
  post,
  onLike,
  onComment,
  onDirectMessage,
  isLiking = false,
  showComments = false,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-4">
        {/* Like Button */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-1">
          <IconButton
            icon={Heart}
            variant="ghost"
            size="sm"
            onClick={onLike}
            disabled={isLiking}
            className={`transition-colors ${
              post.liked
                ? "text-red-500 hover:text-red-600"
                : "text-gray-500 hover:text-red-500"
            }`}
            title={post.liked ? "Bỏ thích" : "Thích"}
          />
          {post.likesCount > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {post.likesCount}
            </span>
          )}
        </motion.div>

        {/* Comment Button */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-1">
          <IconButton
            icon={MessageCircle}
            variant="ghost"
            size="sm"
            onClick={onComment}
            className="text-gray-500 hover:text-blue-500"
            title="Bình luận"
          />
          {post.commentsCount > 0 && (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {post.commentsCount}
            </span>
          )}
        </motion.div>
      </div>

      {/* Direct Message Button */}
      {onDirectMessage && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDirectMessage}
          className="text-gray-500 hover:text-purple-500 flex items-center space-x-2">
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Nhắn riêng</span>
        </Button>
      )}
    </div>
  );
};

export default PostActions;
