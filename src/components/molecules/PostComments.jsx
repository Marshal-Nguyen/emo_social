import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "../atoms/Avatar";
import { Heart } from "lucide-react";
import CommentForm from "./CommentForm";
import { formatTimeAgo } from "../../utils/helpers";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addComment, fetchRepliesSuccess } from "../../store/postsSlice";

const baseUrl = "https://api.emoease.vn/post-service";
const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMDJlMjFjMS1mM3NmLTQ2MzItYTdjYy0wOTRkMzc3YTY0ZTQiLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk0MTQzMjAsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.d2Z7_TykLgWLu9l0FFDHy01x1OicghQZYcxy7Mwme1KfefDPnbsVlviXQyiOlLyyYrzrzBnNBgeyl8HnBDEivDd5tOt93BuMnFXUmKKxhbVxqTUxItwLc1BvPGqsmSugwKCG-J_bGKcsOFO6VkhDKtz8YdHgE4YIihzEIPMHmdK3q5t6Lix5f8mJFYFFtestUhf-_cUXF8MCwPysRKTe-rvXB8RtO9Deiqo3ak4QH-P2bTdt6LQrjWnPK77q6Rb1BR8MfynVsNAkanXnDGJsWovw5L-i466Zm2pa2xl3I0WlGhONwPlvbqoCWTmRqRUTeLZu4TegulgG1GZ_1pcpgg";

const PostComments = ({
  comments = [],
  show = false,
  maxVisible = 3,
  onShowMore,
  className = "",
  onReply,
  hideRepliesByDefault = false,
}) => {
  const { id: postId } = useParams();
  const dispatch = useDispatch();
  const [showReplyForm, setShowReplyForm] = useState({});
  const [openReplies, setOpenReplies] = useState(
    comments.reduce((acc, comment) => ({
      ...acc,
      [comment.id]: !hideRepliesByDefault,
    }), {})
  );
  const commentEndRef = useRef(null);

  useEffect(() => {
    if (show && commentEndRef.current) {
      commentEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // Sync initial comments with Redux state
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
  }, [show, comments, dispatch, postId]);

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
        throw new Error(`Không thể thêm phản hồi: ${errorText}`);
      }
      const newComment = await response.json();
      onReply(commentId, {
        id: newComment.id,
        content: newComment.content,
        author: newComment.author?.displayName || "Anonymous",
        avatar: newComment.author?.avatarUrl || null,
        createdAt: newComment.createdAt,
        reactionCount: newComment.reactionCount || 0,
        replyCount: newComment.replyCount || 0,
        liked: false,
        replies: [],
      });
      setShowReplyForm((prev) => ({ ...prev, [commentId]: false }));
      commentEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Lỗi khi thêm phản hồi:", error);
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
      console.log("Replies API response:", repliesData);
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
      console.log("Dispatched fetchRepliesSuccess:", { postId, parentId: commentId, replies: mappedReplies });
      setOpenReplies((prev) => {
        const newState = { ...prev, [commentId]: true };
        console.log("Updated openReplies:", newState);
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
      console.log("Toggled openReplies:", newState);
      return newState;
    });
  };

  if (!show || !comments?.length) return null;

  const renderComments = (commentsList, level = 0) => {
    return commentsList.map((comment) => {
      const hasReplies = (comment.replyCount || 0) > 0;
      const isOpen = openReplies[comment.id] ?? !hideRepliesByDefault;
      const areRepliesLoaded = comment.replies && comment.replies.length > 0;
      console.log(`Comment ${comment.id}: hasReplies=${hasReplies}, isOpen=${isOpen}, areRepliesLoaded=${areRepliesLoaded}, replies=`, comment.replies);

      return (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative ${level > 0 ? "ml-8" : ""}`}
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
                  {formatTimeAgo(comment.createdAt)}
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
                      ? `Ẩn ${comment.replyCount} phản hồi`
                      : `Xem ${comment.replyCount} phản hồi`}
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

  console.log("PostComments props.comments:", comments);
  return (
    <div className={`space-y-4 ${className}`}>
      {renderComments(comments.slice(0, maxVisible))}
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