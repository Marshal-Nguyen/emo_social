// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Avatar from "../atoms/Avatar";
// import Divider from "../atoms/Divider";
// import { formatTimeAgo } from "../../utils/helpers";
// import CommentForm from "./CommentForm";
// import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
// import { Repeat2, Share2, MessageCircle, Heart } from "lucide-react";

// const PostComments = ({
//   comments = [],
//   show = false,
//   maxVisible = 3,
//   onShowMore,
//   className = "",
//   onReply,
//   onLike,
//   parentId = null,
//   hideRepliesByDefault = false,
// }) => {
//   const [replyingTo, setReplyingTo] = useState(null);
//   const [openReplies, setOpenReplies] = useState({});

//   if (!show || comments.length === 0) return null;

//   const visibleComments = comments.slice(0, maxVisible);
//   const hasMore = comments.length > maxVisible;

//   const renderContent = (content) => {
//     if (!content) return null;

//     const codeBlocks = content.split(/```(.+?)```/s).map((part, index) => {
//       if (index % 2 === 0) {
//         return part.split('\n').map((line, i) => (
//           <p key={i} className="text-sm text-gray-900 dark:text-white break-words max-w-full">
//             {line}
//           </p>
//         ));
//       } else {
//         return (
//           <SyntaxHighlighter language="javascript" style={docco} key={index}>
//             {part.trim()}
//           </SyntaxHighlighter>
//         );
//       }
//     });

//     return <div>{codeBlocks}</div>;
//   };

//   const renderComments = (commentsList, level = 0) => {
//     return commentsList.map((comment) => {
//       const hasReplies = comment.replies && comment.replies.length > 0;
//       const isOpen =
//         openReplies[comment.id] !== undefined
//           ? openReplies[comment.id]
//           : !hideRepliesByDefault;

//       return (
//         <div
//           key={comment.id}
//           className={`flex space-x-3 ${level > 0 ? "ml-8" : ""} mt-2`}
//         >
//           <Avatar username={comment.author} size="sm" className="flex-shrink-0" />
//           <div className="flex-1 min-w-0">
//             <div className="bg-gray-100 dark:bg-gray-800 rounded-lg" style={{ padding: '4px 8px', display: 'inline-block' }}>
//               <div className="flex items-center space-x-2 mb-1">
//                 <span className="font-semibold text-sm text-gray-900 dark:text-white">
//                   {comment.author}
//                 </span>
//                 <span className="text-xs text-gray-500 dark:text-gray-400">
//                   {formatTimeAgo(comment.createdAt)}
//                 </span>
//               </div>
//               {renderContent(comment.content)}
//             </div>
//             <div className="flex items-center space-x-4 mt-1 ml-4">
//               <button
//                 className={`flex items-center gap-1 text-xs ${comment.liked ? "text-red-500" : "text-gray-500 hover:text-red-500"}`}
//                 onClick={() => onLike && onLike(comment, parentId)}
//               >
//                 <Heart
//                   className="w-4 h-4"
//                   fill={comment.liked ? "currentColor" : "none"}
//                 />
//                 {comment.likesCount || 0}
//               </button>
//               <button
//                 className="text-xs text-blue-500 hover:underline"
//                 onClick={() => {
//                   setReplyingTo(comment.id);
//                   setOpenReplies((prev) => ({ ...prev, [comment.id]: true }));
//                 }}
//               >
//                 Trả lời
//               </button>
//               {hasReplies && (
//                 <button
//                   className="text-xs text-gray-700 dark:text-gray-300 hover:underline"
//                   onClick={() => setOpenReplies((prev) => ({ ...prev, [comment.id]: !isOpen }))}
//                 >
//                   {isOpen ? 'Ẩn phản hồi' : `Xem phản hồi (${comment.replies.length})`}
//                 </button>
//               )}
//             </div>
//             {replyingTo === comment.id && (
//               <div className="mt-2">
//                 <CommentForm
//                   placeholder={`Trả lời ${comment.author}...`}
//                   onSubmit={(text) => {
//                     if (onReply) onReply(text, comment.id);
//                     setReplyingTo(null);
//                   }}
//                 />
//               </div>
//             )}
//             {hasReplies && isOpen && (
//               <div className="mt-2">
//                 {renderComments(comment.replies, level + 1)}
//               </div>
//             )}
//           </div>
//         </div>
//       );
//     });
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, height: 0 }}
//         animate={{ opacity: 1, height: "auto" }}
//         exit={{ opacity: 0, height: 0 }}
//         transition={{ duration: 0.3 }}
//         className={`border-t border-gray-100 dark:border-gray-700 ${className}`}
//       >
//         <div className="pt-4 space-y-4">
//           {renderComments(visibleComments)}
//           {hasMore && (
//             <div className="pt-2">
//               <button
//                 onClick={onShowMore}
//                 className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
//               >
//                 Xem thêm {comments.length - maxVisible} bình luận khác
//               </button>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default PostComments;

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import Avatar from "../atoms/Avatar";
import CommentForm from "./CommentForm";

const baseUrl = "https://api.emoease.vn/post-service";
const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlNmMyMjE1ZS1hMDhmLTQwOWYtOGQ0Mi00ZTc0NDRkYmM5NmQiLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk0MzM2NDUsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.TDyBvjGJkE2LZiLJ1a_fpcBy0NMHQLc1TasorBl7qXcgH9jco7WtQCGdkjs8EV1SuKqWUd548-iGFm9sJeQYKyPDsIXtZ8WgfRH9HJ4jv3amVwliESLhYYPVzNuhoxa20Z25TeL3J6PeZ7XbunVFkmQ_yKNTKymvPSgt9VinnO_jUmrib70cNRK7H-whBU3w8iNk4XTxCDqnaBbgDTFTngianIGRXK1ud4h-2DOYqGHd2nN5LQi7cYMUumd5HTVN598qvcbXbsYpi6eUiERHJeXJpWrnBhDj1kzqstHx1IIUWaXNPCR0mbFb1yL88uwM3X9Y_hCk-JDDOM6SRM7bdA";

const PostComments = ({
  comments,
  show = false,
  maxVisible = 3,
  onShowMore,
  onReply,
  className = "",
}) => {
  const { id: postId } = useParams();
  const [showReplyForm, setShowReplyForm] = useState({});
  const commentEndRef = useRef(null);

  useEffect(() => {
    if (show && commentEndRef.current) {
      commentEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [show, comments]);

  const handleReplySubmit = async (commentId, content) => {
    try {
      const response = await fetch(`${baseUrl}/v1/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId,
          content,
          parentCommentId: commentId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể thêm bình luận: ${errorText}`);
      }
      const newComment = await response.json();
      onReply(commentId, {
        id: newComment.id,
        content: newComment.content,
        author: newComment.author?.displayName || "Anonymous",
        avatar: newComment.author?.avatarUrl || null,
        createdAt: newComment.createdAt,
        likesCount: 0,
        liked: false,
        replies: [],
      });
      setShowReplyForm((prev) => ({ ...prev, [commentId]: false }));
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
    }
  };

  const handleLikeComment = async (commentId, liked) => {
    try {
      if (!liked) {
        const response = await fetch(`${baseUrl}/v1/reactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            targetType: "Comment",
            targetId: commentId,
            reactionCode: "Like",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Không thể thích bình luận: ${errorText}`);
        }
        onReply(commentId, null, { liked: true, likesCount: (comments.find(c => c.id === commentId)?.likesCount || 0) + 1 });
      } else {
        const response = await fetch(
          `${baseUrl}/v1/reactions?TargetType=Comment&TargetId=${commentId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Không thể bỏ thích bình luận: ${errorText}`);
        }
        onReply(commentId, null, { liked: false, likesCount: (comments.find(c => c.id === commentId)?.likesCount || 0) - 1 });
      }
    } catch (error) {
      console.error("Lỗi khi xử lý lượt thích bình luận:", error);
    }
  };

  const toggleReplyForm = (commentId) => {
    setShowReplyForm((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  if (!show || !comments?.length) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      {comments.slice(0, maxVisible).map((comment) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="flex space-x-3">
            <Avatar
              username={comment.author}
              avatarUrl={comment.avatar}
              size="sm"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {comment.author}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="mt-1 text-gray-900 dark:text-gray-200">
                {comment.content}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                <button
                  className={`flex items-center space-x-1 ${comment.liked
                    ? "text-red-500 dark:text-red-500"
                    : "hover:text-red-500"
                    }`}
                  onClick={() => handleLikeComment(comment.id, comment.liked)}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={comment.liked ? "currentColor" : "none"}
                  />
                  <span>{comment.likesCount}</span>
                </button>
                <button
                  className="hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => toggleReplyForm(comment.id)}
                >
                  Trả lời
                </button>
              </div>
              <AnimatePresence>
                {showReplyForm[comment.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2"
                  >
                    <CommentForm
                      onSubmit={(content) => handleReplySubmit(comment.id, content)}
                      placeholder={`Trả lời ${comment.author}...`}
                      isSubmitting={false}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      ))}
      {comments.length > maxVisible && (
        <button
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          onClick={onShowMore}
        >
          Xem thêm bình luận
        </button>
      )}
      <div ref={commentEndRef} />
    </div>
  );
};

export default PostComments;