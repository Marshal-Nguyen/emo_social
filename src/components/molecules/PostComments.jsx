import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "../atoms/Avatar";
import { Heart } from "lucide-react";
import CommentForm from "./CommentForm";
import { formatTimeAgo } from "../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { addComment, fetchRepliesSuccess, finalizeComment, removeComment } from "../../store/postsSlice";

const baseUrl = "https://api.emoease.vn/post-service";
const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZWVlZWY1NC0zNzQ1LTRkODAtYTc1OC02NWFlNWQ2YTFiODUiLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk0NzM3NTcsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.TXKohDzV54uglcDGzk-D9ySdEo_3tSKaLcssTOwZwJC9m8GRlKmlv9-vrfSLALpdw69KFFNyJep3AW5ZuYQCDf4NJmTcrusVo6m0EER17A6kFv7QAKOkjUxEvo5MCl3QhXy1Yh34534x6HeoxjQcc8nvR2Ngj-g27hUxZckPMogiAh9fIxyEyvyqPRlGV9wlm6fqWlvtxEzDxBiUiLzXV7JMVMBLhp6GpK4_-kKNPpGsn3ne1ytZJ9gjMgYsImMQhWP2AWEOelHkRbh7fG_C51hUxd-y_hsTgG70U4Qib71qTbxEky5VwBv9Ly__Dv1jY5-htT_LNgHWVYPWuFiFgQ";

const PostComments = ({
  comments = [],
  show = false,
  maxVisible = 3,
  onShowMore,
  className = "",
  onReply,
  hideRepliesByDefault = false,
  postId,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showReplyForm, setShowReplyForm] = useState({});
  const [openReplies, setOpenReplies] = useState(
    comments.reduce((acc, comment) => ({
      ...acc,
      [comment.id]: !hideRepliesByDefault,
    }), {})
  );
  const commentEndRef = useRef(null);

  const syncedRef = useRef(false);

  useEffect(() => {
    // Only sync once per mount or when postId changes
    if (!syncedRef.current && postId && Array.isArray(comments)) {
      comments.forEach((comment) => {
        dispatch(addComment({
          postId,
          comment: {
            id: comment.id,
            content: comment.content,
            author: comment.author,
            avatar: comment.avatar,
            createdAt: comment.createdAt,
            reactionCount: comment.reactionCount,
            replyCount: comment.replyCount,
            liked: comment.liked,
            replies: comment.replies,
          },
          parentId: null,
        }));
      });
      syncedRef.current = true;
    }
  }, [show, comments, dispatch, postId]);

  const handleReplySubmit = async (commentId, content) => {
    try {
      // Optimistic reply
      const tempId = `temp-${Date.now()}`;
      const optimistic = {
        id: tempId,
        content,
        author: user?.username || "Anonymous",
        avatar: user?.avatar || null,
        createdAt: new Date().toISOString(),
        reactionCount: 0,
        replyCount: 0,
        liked: false,
        replies: [],
      };
      onReply(commentId, optimistic);
      // Ensure the replies section opens when first reply is added
      setOpenReplies((prev) => ({ ...prev, [commentId]: true }));

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
        throw new Error(`Không thể thêm phản hồi: ${errorText}`);
      }
      const payload = await response.json();
      const realId = payload?.commentId || payload?.id;
      if (realId) {
        // finalize optimistic reply id
        dispatch(
          finalizeComment({ postId, tempId, newData: { id: realId } })
        );
      } else {
        // rollback if API didn't return id
        dispatch(removeComment({ postId, commentId: tempId }));
      }
      setShowReplyForm((prev) => ({ ...prev, [commentId]: false }));
      // Do not auto scroll to keep viewport stable per UX request
    } catch (error) {
      console.error("Lỗi khi thêm phản hồi:", error);
      // rollback optimistic if failed
      // We don't have tempId here if error before declaration; ignore
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
        onReply(commentId, null, {
          liked: true,
          reactionCount: (comments.find((c) => c.id === commentId)?.reactionCount || 0) + 1,
        });
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
        onReply(commentId, null, {
          liked: false,
          reactionCount: (comments.find((c) => c.id === commentId)?.reactionCount || 0) - 1,
        });
      }
    } catch (error) {
      console.error("Lỗi khi xử lý lượt thích bình luận:", error);
    }
  };

  const handleFetchReplies = async (commentId) => {
    try {
      const response = await fetch(
        `${baseUrl}/v1/comments/post/${postId}?PageIndex=1&PageSize=20&ParentCommentId=${commentId}&SortBy=CreatedAt&SortDescending=false`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể tải phản hồi: ${errorText}`);
      }

      const repliesData = await response.json();
      // console.debug("Replies API response:", repliesData);
      const mappedReplies = repliesData.data.map((reply) => ({
        id: reply.id,
        content: reply.content,
        author: reply.author.displayName,
        avatar: reply.author.avatarUrl || null,
        createdAt: reply.createdAt,
        reactionCount: reply.reactionCount || 0,
        replyCount: reply.replyCount || 0,
        liked: false,
        replies: [],
      }));

      dispatch(
        fetchRepliesSuccess({
          postId,
          parentId: commentId,
          replies: mappedReplies,
        })
      );
      // console.debug("Dispatched fetchRepliesSuccess:", { postId, parentId: commentId, replies: mappedReplies });
      setOpenReplies((prev) => {
        const newState = { ...prev, [commentId]: true };
        // console.debug("Updated openReplies:", newState);
        return newState;
      });
    } catch (error) {
      console.error("Lỗi khi tải phản hồi:", error);
    }
  };

  const toggleReplyForm = (commentId) => {
    setShowReplyForm((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => {
      const newState = { ...prev, [commentId]: !prev[commentId] };
      // console.debug("Toggled openReplies:", newState);
      return newState;
    });
  };

  // Filter out invalid comments without id
  const validComments = Array.isArray(comments)
    ? comments.filter((c) => c && c.id)
    : [];

  if (!show || validComments.length === 0) return null;

  const renderComments = (commentsList, level = 0) => {
    return commentsList.map((comment) => {
      const totalReplyCount = comment.replyCount || 0;
      const loadedReplies = Array.isArray(comment.replies) ? comment.replies.length : 0;
      const hasReplies = totalReplyCount > 0;
      const isOpen = openReplies[comment.id] ?? !hideRepliesByDefault;
      const areRepliesLoaded = loadedReplies >= totalReplyCount && loadedReplies > 0;
      console.log(`Comment ${comment.id}: hasReplies=${hasReplies}, isOpen=${isOpen}, areRepliesLoaded=${areRepliesLoaded}, replies=`, comment.replies);

      return (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative ${level > 0 ? "ml-4 sm:ml-8" : ""}`}
        >
          <div className="flex space-x-2 sm:space-x-3">
            <Avatar
              username={comment.author}
              avatarUrl={comment.avatar}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                  {comment.author}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {formatTimeAgo(comment.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm sm:text-base text-gray-900 dark:text-gray-200 break-words">
                {comment.content}
              </p>
              <div className="flex items-center space-x-2 sm:space-x-4 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <button
                  className={`flex items-center space-x-1 ${comment.liked
                    ? "text-red-500 dark:text-red-500"
                    : "hover:text-red-500"
                    }`}
                  onClick={() => handleLikeComment(comment.id, comment.liked)}
                >
                  <Heart
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill={comment.liked ? "currentColor" : "none"}
                  />
                  <span>{comment.reactionCount}</span>
                </button>
                <button
                  className="hover:text-gray-700 dark:hover:text-gray-200"
                  onClick={() => toggleReplyForm(comment.id)}
                >
                  Trả lời
                </button>
                {hasReplies && (
                  <button
                    className="hover:text-gray-700 dark:hover:text-gray-200"
                    onClick={() =>
                      areRepliesLoaded
                        ? toggleReplies(comment.id)
                        : handleFetchReplies(comment.id)
                    }
                  >
                    {isOpen && areRepliesLoaded
                      ? `Ẩn ${totalReplyCount} phản hồi`
                      : `Xem ${totalReplyCount} phản hồi`}
                  </button>
                )}
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
          {hasReplies && isOpen && areRepliesLoaded && (
            <div className="mt-2">
              {renderComments(comment.replies, level + 1)}
            </div>
          )}
        </motion.div>
      );
    });
  };

  // console.debug("PostComments props.comments:", comments);
  return (
    <div className={`space-y-4 ${className}`}>
      {renderComments(validComments.slice(0, maxVisible))}
      {validComments.length > maxVisible && (
        <button
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm"
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