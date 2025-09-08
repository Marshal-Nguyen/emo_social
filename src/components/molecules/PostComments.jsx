import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "../atoms/Avatar";
import Divider from "../atoms/Divider";
import { formatTimeAgo } from "../../utils/helpers";
import CommentForm from "./CommentForm";

import { Heart } from "lucide-react";

const PostComments = ({
  comments = [],
  show = false,
  maxVisible = 3,
  onShowMore,
  className = "",
  onReply,
  onLike,
  parentId = null,
  hideRepliesByDefault = false,
}) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const [openReplies, setOpenReplies] = useState({}); // { [commentId]: true/false }

  if (!show || comments.length === 0) return null;

  const visibleComments = comments.slice(0, maxVisible);
  const hasMore = comments.length > maxVisible;

  // Đệ quy render comment và reply
  const renderComments = (commentsList, level = 0) => {
    return commentsList.map((comment, index) => {
      const hasReplies = comment.replies && comment.replies.length > 0;
      // Nếu hideRepliesByDefault=true và chưa từng mở thì mặc định đóng replies
      const isOpen = openReplies[comment.id] !== undefined
        ? openReplies[comment.id]
        : !hideRepliesByDefault;
      return (
        <div key={comment.id} className={`flex space-x-3 ${level > 0 ? 'ml-8' : ''} mt-2`}>
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
            {/* Các nút Like, Reply, View Replies nằm ngoài div nội dung */}
            <div className="flex items-center space-x-4 mt-1 ml-4">
              <button
                className={`flex items-center gap-1 text-xs ${comment.liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                  }`}
                onClick={() => onLike && onLike(comment, parentId)}
              >
                <Heart
                  className="w-4 h-4"
                  fill={comment.liked ? "currentColor" : "none"}
                />
                {comment.likesCount || 0}
              </button>

              <button
                className="text-xs text-blue-500 hover:underline"
                onClick={() => {
                  setReplyingTo(comment.id);
                  // Khi nhấn trả lời thì mở replies nếu đang bị ẩn
                  setOpenReplies((prev) => ({ ...prev, [comment.id]: true }));
                }}
              >
                Trả lời
              </button>

              {hasReplies && (
                <button
                  className="text-xs text-gray-700 dark:text-gray-300 hover:underline"
                  onClick={() => setOpenReplies((prev) => ({ ...prev, [comment.id]: !isOpen }))}
                >
                  {isOpen ? 'Ẩn phản hồi' : `Xem phản hồi (${comment.replies.length})`}
                </button>
              )}
            </div>
            {/* Form trả lời */}
            {replyingTo === comment.id && (
              <div className="mt-2">
                <CommentForm
                  placeholder={`Trả lời ${comment.author}...`}
                  onSubmit={(text) => {
                    if (onReply) onReply(text, comment.id);
                    setReplyingTo(null);
                  }}
                />
              </div>
            )}
            {/* Đệ quy hiển thị reply */}
            {hasReplies && isOpen && (
              <div className="mt-2">
                {renderComments(comment.replies, level + 1)}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className={`border-t border-gray-100 dark:border-gray-700 ${className}`}
      >
        <div className="pt-4 space-y-4">
          {renderComments(visibleComments)}
          {/* Show More Button */}
          {hasMore && (
            <div className="pt-2">
              <button
                onClick={onShowMore}
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
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