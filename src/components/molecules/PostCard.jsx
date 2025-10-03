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
import { addComment, finalizeComment, removeComment } from "../../store/postsSlice";
import { addConversation } from "../../store/chatSlice";
import { useParams } from "react-router-dom";

const baseUrl = "https://api.emoease.vn/post-service";
const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZWVlZWY1NC0zNzQ1LTRkODAtYTc1OC02NWFlNWQ2YTFiODUiLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk0NzM3NTcsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.TXKohDzV54uglcDGzk-D9ySdEo_3tSKaLcssTOwZwJC9m8GRlKmlv9-vrfSLALpdw69KFFNyJep3AW5ZuYQCDf4NJmTcrusVo6m0EER17A6kFv7QAKOkjUxEvo5MCl3QhXy1Yh34534x6HeoxjQcc8nvR2Ngj-g27hUxZckPMogiAh9fIxyEyvyqPRlGV9wlm6fqWlvtxEzDxBiUiLzXV7JMVMBLhp6GpK4_-kKNPpGsn3ne1ytZJ9gjMgYsImMQhWP2AWEOelHkRbh7fG_C51hUxd-y_hsTgG70U4Qib71qTbxEky5VwBv9Ly__Dv1jY5-htT_LNgHWVYPWuFiFgQ";

const PostCard = ({
  post,
  onNavigateToChat,
  index = 0,
  onShowComment,
  forceShowComments = false,
  onBack,
  hideRepliesByDefault = false,
}) => {
  const { id: routePostId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const postFromStore = useSelector((state) =>
    state.posts?.posts?.find((p) => p.id === post?.id)
  );
  const effectivePost = postFromStore || post;
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
  }, [showComments, forceShowComments]);

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
      const resolvedPostId = post?.id || routePostId;
      // Optimistic add
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
      dispatch(
        addComment({
          postId: resolvedPostId,
          comment: optimistic,
        })
      );
      const response = await fetch(`${baseUrl}/v1/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId: resolvedPostId,
          content,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể thêm bình luận: ${errorText}`);
      }
      const payload = await response.json();
      const apiComment = payload?.data || payload || {};
      const newId = apiComment.commentId || apiComment.id;
      if (newId) {
        // Only need to replace temp id with real id; keep optimistic fields
        dispatch(
          finalizeComment({
            postId: resolvedPostId,
            tempId,
            newData: { id: newId },
          })
        );
      } else {
        dispatch(removeComment({ postId: resolvedPostId, commentId: tempId }));
      }
      // Keep viewport stable; no auto scroll after submit
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
      const resolvedPostId = post?.id || routePostId;
      dispatch(removeComment({ postId: resolvedPostId, commentId: tempId }));
    } finally {
      setIsCommenting(false);
    }
  };

  const handleReply = (parentId, comment, update) => {
    dispatch(
      addComment({
        postId: post?.id || routePostId,
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
      className={`rounded-lg sm:rounded-xl shadow-md p-3 sm:p-4 ${bgColors[index % bgColors.length]} border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow`}
    >
      <PostHeader
        post={effectivePost}
        showJoinedBadge={post.type === "group"}
        onBack={onBack}
      />
      <PostContent post={effectivePost} isSafeMode={false} className="mt-4" />
      {post.type === "group" && (
        <JoinGroupButton
          groupId={post.id}
          status={post.joinStatus}
          className="mt-3"
        />
      )}
      <div className="flex items-center justify-between mt-3 sm:mt-4">
        <PostActions
          post={effectivePost}
          onComment={handleShowComments}
        />
        {post.author.id !== user?.id && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDirectMessage}
            title="Nhắn tin"
            className="!rounded-full !p-2"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        )}
      </div>
      <PostComments
        comments={effectivePost?.comments}
        show={showComments || forceShowComments}
        maxVisible={maxVisibleComments}
        onShowMore={handleShowMoreComments}
        onReply={handleReply}
        postId={effectivePost?.id || routePostId}
        hideRepliesByDefault={hideRepliesByDefault}
        className="mt-3 sm:mt-4"
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