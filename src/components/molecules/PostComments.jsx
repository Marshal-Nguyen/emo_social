import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "../atoms/Avatar";
import Divider from "../atoms/Divider";
import { formatTimeAgo } from "../../utils/helpers";

const PostComments = ({
  comments = [],
  show = false,
  maxVisible = 3,
  onShowMore,
  className = "",
}) => {
  if (!show || comments.length === 0) return null;

  const visibleComments = comments.slice(0, maxVisible);
  const hasMore = comments.length > maxVisible;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className={`border-t border-gray-100 dark:border-gray-700 ${className}`}>
        <div className="pt-4 space-y-4">
          {visibleComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex space-x-3">
              <Avatar
                username={comment.author}
                size="sm"
                className="flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {comment.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Show More Button */}
          {hasMore && (
            <div className="pt-2">
              <button
                onClick={onShowMore}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium">
                Xem thêm {comments.length - maxVisible} bình luận khác
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostComments;
