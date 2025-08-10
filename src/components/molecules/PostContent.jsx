import React, { useState } from "react";
import { Shield, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "../atoms/Badge";
import { isContentSensitive } from "../../utils/helpers";

const PostContent = ({ post, isSafeMode = false, className = "" }) => {
  const [isBlurred, setIsBlurred] = useState(true);
  const isSensitive = isContentSensitive(post.content);
  const shouldBlur = isSafeMode && isSensitive && isBlurred;

  const handleRevealContent = () => {
    setIsBlurred(false);
  };

  return (
    <div className={`${className}`}>
      {/* Sensitive Content Warning */}
      {isSafeMode && isSensitive && isBlurred && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="font-medium text-yellow-800 dark:text-yellow-300">
              Nội dung nhạy cảm
            </span>
          </div>
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">
            Bài viết này có thể chứa nội dung nhạy cảm. Bạn có muốn xem không?
          </p>
          <button
            onClick={handleRevealContent}
            className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors">
            Hiển thị nội dung
          </button>
        </motion.div>
      )}

      {/* Post Content */}
      <AnimatePresence mode="wait">
        {!shouldBlur && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}>
            <div className="mb-4">
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                {post.content}
              </p>

              {/* Enhancement Badge */}
              {post.isEnhanced && (
                <div className="flex items-center space-x-1 mt-3">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <Badge variant="purple" size="sm">
                    Đã tối ưu bởi AI
                  </Badge>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blurred Content Preview */}
      {shouldBlur && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative mb-4">
          <div className="blur-sm select-none pointer-events-none">
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap leading-relaxed">
              {post.content.length > 100
                ? `${post.content.substring(0, 100)}...`
                : post.content}
            </p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-gray-900"></div>
        </motion.div>
      )}
    </div>
  );
};

export default PostContent;
