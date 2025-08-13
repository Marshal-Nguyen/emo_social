import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostComments from "./PostComments";
import CommentForm from "./CommentForm";
import JoinGroupButton from "./JoinGroupButton";
import Divider from "../atoms/Divider";
import { likePost, addComment } from "../../store/postsSlice";
import { addConversation } from "../../store/chatSlice";

const PostCard = ({ post, onNavigateToChat, index }) => {
  const dispatch = useDispatch();
  const { isSafeMode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);

  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;

    setIsLiking(true);
    try {
      dispatch(
        likePost({
          postId: post.id,
          liked: !post.liked,
          likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1,
        })
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
    } finally {
      setTimeout(() => setIsLiking(false), 300);
    }
  };

  const handleComment = async (commentText) => {
    if (!commentText.trim() || isCommenting) return;

    setIsCommenting(true);
    try {
      const newComment = {
        id: Date.now(),
        content: commentText,
        author: user.username,
        createdAt: new Date().toISOString(),
        avatar: user.avatar,
      };

      dispatch(
        addComment({
          postId: post.id,
          comment: newComment,
        })
      );
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDirectMessage = async () => {
    try {
      const conversationId = `dm_${user.id}_${post.author.id}`;
      const conversation = {
        id: conversationId,
        type: "dm",
        participant: post.author,
        lastMessage: null,
        updatedAt: new Date().toISOString(),
      };

      dispatch(addConversation(conversation));

      if (onNavigateToChat) {
        onNavigateToChat(conversationId);
      }
    } catch (error) {
      console.error("Failed to create DM:", error);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // Determine background color based on index
  // const bgColor = index % 2 === 0 ? "bg-[#E0EDFF]" : "bg-[#FFF5DF]";
  const bgColors = [
    "#FFF5DF", // Original warm beige
    "#E0EDFF", // Original light blue
    "#FFE6CC", // Soft lavender
    "#E6FFE6", // Pale green
    "#FFE8F0", // Light pink
  ];

  // Cycle through colors based on index
  const bgColor = bgColors[index % bgColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={`bg-[${bgColor}] dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow`}
    >
      {/* Post Header */}
      <div className="p-4 sm:p-6">
        <PostHeader
          post={post}
          showJoinedBadge={post.joinStatus === "joined"}
          className="mb-4"
        />

        {/* Post Content */}
        <PostContent post={post} isSafeMode={isSafeMode} className="mb-4" />

        {/* Group Join Button */}
        {post.type === "group" && (
          <div className="mb-4">
            <JoinGroupButton
              initialStatus={post.joinStatus}
              groupName={post.groupName}
            />
          </div>
        )}

        <Divider className="my-4" />

        {/* Post Actions */}
        <PostActions
          post={post}
          onLike={handleLike}
          onComment={toggleComments}
          onDirectMessage={handleDirectMessage}
          isLiking={isLiking}
          showComments={showComments}
        />
      </div>

      {/* Comments Section */}
      <PostComments
        comments={post.comments || []}
        show={showComments}
        maxVisible={3}
      />

      {/* Comment Form */}
      {showComments && (
        <div className="px-4 sm:px-6 pb-4">
          <CommentForm onSubmit={handleComment} isSubmitting={isCommenting} />
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;