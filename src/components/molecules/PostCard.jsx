import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostComments from "./PostComments";
import CommentForm from "./CommentForm";
import Button from "../atoms/Button";
import { MessageSquare } from "lucide-react";
import JoinGroupButton from "./JoinGroupButton";
import { addComment } from "../../store/postsSlice";
import { addConversation } from "../../store/chatSlice";
import { useParams } from "react-router-dom";

const baseUrl = "https://api.emoease.vn/post-service";
const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMDJlMjFjMS1mM3NmLTQ2MzItYTdjYy0wOTRkMzc3YTY0ZTQiLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk0MTQzMjAsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.d2Z7_TykLgWLu9l0FFDHy01x1OicghQZYcxy7Mwme1KfefDPnbsVlviXQyiOlLyyYrzrzBnNBgeyl8HnBDEivDd5tOt93BuMnFXUmKKxhbVxqTUxItwLc1BvPGqsmSugwKCG-J_bGKcsOFO6VkhDKtz8YdHgE4YIihzEIPMHmdK3q5t6Lix5f8mJFYFFtestUhf-_cUXF8MCwPysRKTe-rvXB8RtO9Deiqo3ak4QH-P2bTdt6LQrjWnPK77q6Rb1BR8MfynVsNAkanXnDGJsWovw5L-i466Zm2pa2xl3I0WlGhONwPlvbqoCWTmRqRUTeLZu4TegulgG1GZ_1pcpgg";

const PostCard = ({
  post,
  onNavigateToChat,
  index = 0,
  onShowComment,
  forceShowComments = false,
  onBack,
  hideRepliesByDefault = false,
}) => {
  const { id: postId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(forceShowComments);
  const [maxVisibleComments, setMaxVisibleComments] = useState(3);
  const [isCommenting, setIsCommenting] = useState(false);
  const commentEndRef = useRef(null);

  const bgColors = [
    "bg-white dark:bg-gray-800",
    "bg-gray-50 dark:bg-gray-900",
    "bg-blue-50 dark:bg-blue-900/20",
    "bg-green-50 dark:bg-green-900/20",
    "bg-purple-50 dark:bg-purple-900/20",
  ];

  useEffect(() => {
    if ((showComments || forceShowComments) && commentEndRef.current) {
      commentEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showComments, forceShowComments, post.comments]);

  const handleShowComments = () => {
    setShowComments(true);
    onShowComment?.();
  };

  const handleShowMoreComments = () => {
    setMaxVisibleComments((prev) => prev + 5);
  };

  const handleCommentSubmit = async (content) => {
    if (!content.trim() || isCommenting) return;
    setIsCommenting(true);

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
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể thêm bình luận: ${errorText}`);
      }
      const newComment = await response.json();
      dispatch(
        addComment({
          postId,
          comment: {
            id: newComment.id,
            content: newComment.content,
            author: newComment.author?.displayName || user?.username || "Anonymous",
            avatar: newComment.author?.avatarUrl || user?.avatar || null,
            createdAt: newComment.createdAt,
            likesCount: newComment.reactionCount || 0,
            replyCount: newComment.replyCount || 0,
            liked: false,
            replies: [],
          },
        })
      );
      commentEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleReply = (parentId, comment, update) => {
    dispatch(
      addComment({
        postId,
        comment,
        parentId,
        update,
      })
    );
  };

  const handleDirectMessage = () => {
    const conversationId = `${user.id}-${post.author.id}`;
    dispatch(addConversation({ id: conversationId, recipient: post.author }));
    onNavigateToChat(conversationId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl shadow-md p-4 ${bgColors[index % bgColors.length]} border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow`}
    >
      <PostHeader
        post={post}
        showJoinedBadge={post.type === "group"}
        onBack={onBack}
      />
      <PostContent post={post} isSafeMode={false} className="mt-4" />
      {post.type === "group" && (
        <JoinGroupButton
          groupId={post.id}
          status={post.joinStatus}
          className="mt-3"
        />
      )}
      <div className="flex items-center justify-between mt-4">
        <PostActions
          post={post}
          onComment={handleShowComments}
        />
        {post.author.id !== user?.id && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDirectMessage}
            title="Nhắn tin"
            className="!rounded-full"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
        )}
      </div>
      <PostComments
        comments={post.comments}
        show={showComments || forceShowComments}
        maxVisible={maxVisibleComments}
        onShowMore={handleShowMoreComments}
        onReply={handleReply}
        hideRepliesByDefault={hideRepliesByDefault}
        className="mt-4"
      />
      {(showComments || forceShowComments) && (
        <CommentForm
          onSubmit={handleCommentSubmit}
          isSubmitting={isCommenting}
          placeholder="Viết bình luận..."
        />
      )}
      <div ref={commentEndRef} />
    </motion.div>
  );
};

export default PostCard;