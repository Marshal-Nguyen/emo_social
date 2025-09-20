import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "../atoms/Avatar";
import Divider from "../atoms/Divider";
import { formatTimeAgo } from "../../utils/helpers";
import CommentForm from "./CommentForm";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Repeat2, Share2, MessageCircle, Heart } from "lucide-react";

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
  const [openReplies, setOpenReplies] = useState({});

  if (!show || comments.length === 0) return null;

  const visibleComments = comments.slice(0, maxVisible);
  const hasMore = comments.length > maxVisible;

  const renderContent = (content) => {
    if (!content) return null;

    const codeBlocks = content.split(/```(.+?)```/s).map((part, index) => {
      if (index % 2 === 0) {
        return part.split('\n').map((line, i) => (
          <p key={i} className="text-sm text-gray-900 dark:text-white break-words max-w-full">
            {line}
          </p>
        ));
      } else {
        return (
          <SyntaxHighlighter language="javascript" style={docco} key={index}>
            {part.trim()}
          </SyntaxHighlighter>
        );
      }
    });

    return <div>{codeBlocks}</div>;
  };

  const renderComments = (commentsList, level = 0) => {
    return commentsList.map((comment) => {
      const hasReplies = comment.replies && comment.replies.length > 0;
      const isOpen =
        openReplies[comment.id] !== undefined
          ? openReplies[comment.id]
          : !hideRepliesByDefault;

      return (
        <div
          key={comment.id}
          className={`flex space-x-3 ${level > 0 ? "ml-8" : ""} mt-2`}
        >
          <Avatar username={comment.author} size="sm" className="flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg" style={{ padding: '4px 8px', display: 'inline-block' }}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                  {comment.author}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTimeAgo(comment.createdAt)}
                </span>
              </div>
              {renderContent(comment.content)}
            </div>
            <div className="flex items-center space-x-4 mt-1 ml-4">
              <button
                className={`flex items-center gap-1 text-xs ${comment.liked ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
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