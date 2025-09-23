import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import Button from "../atoms/Button";
import { MessageSquare } from "lucide-react";
import PostComments from "./PostComments";
import CommentForm from "./CommentForm";
import JoinGroupButton from "./JoinGroupButton";
import { likePost, addComment, likeComment } from "../../store/postsSlice";
import { addConversation } from "../../store/chatSlice";

const PostCard = ({ post, onNavigateToChat, index, onShowComment, forceShowComments, onBack, hideRepliesByDefault }) => {
  const dispatch = useDispatch();
  const { isSafeMode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);

  const [showComments, setShowComments] = useState(!!forceShowComments);
  const [maxVisibleComments, setMaxVisibleComments] = useState(3);
  const commentsBoxRef = useRef(null);
  // Nếu forceShowComments thay đổi (ví dụ khi vào trang chi tiết), luôn mở khung bình luận
  React.useEffect(() => {
    if (forceShowComments) setShowComments(true);
  }, [forceShowComments]);
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

  // Hỗ trợ gửi comment hoặc reply (nhiều tầng)
  const handleComment = async (commentText, parentId = null) => {
    if (!commentText.trim() || isCommenting) return;
    setIsCommenting(true);
    try {
      const newComment = {
        id: Date.now(),
        content: commentText,
        author: user.username,
        createdAt: new Date().toISOString(),
        avatar: user.avatar,
        likesCount: 0,
        liked: false,
        replies: [],
      };
      dispatch(
        addComment({
          postId: post.id,
          comment: newComment,
          parentId: parentId || null,
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



  const bgColors = ["#FFF5DF", "#E0EDFF", "#FFE6CC", "#E6FFE6", "#FFE8F0"];
  const bgColor = bgColors[index % bgColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-[${bgColor}]  rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow p-4 flex flex-col h-full`}
      style={{ minHeight: 0 }}
    >
      {/* PostHeader luôn hiển thị, không cuộn */}
      <PostHeader
        post={post}
        showJoinedBadge={post.joinStatus === "joined"}
        className=" flex-shrink-0"
        onBack={onBack}
      />

      {/* Vùng cuộn chung cho PostContent + bình luận */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none flex flex-col gap-1">
        {/* Post Content */}
        <PostContent post={post} isSafeMode={isSafeMode} className=" dark:bg-gray-900 rounded-lg p-2" />

        {/* Group Join Button */}
        {post.type === "group" && (
          <div className="">
            <JoinGroupButton
              initialStatus={post.joinStatus}
              groupName={post.groupName}
            />
          </div>
        )}

        {/* Direct Message Button and Post Actions */}
        <div className="flex justify-between items-center px-4">

          <PostActions
            post={post}
            onLike={handleLike}
            onComment={() => {
              // toggleComments();
              if (onShowComment) onShowComment(post);
            }}
            isLiking={isLiking}
          />
          <Button
            variant="ghost"
            className="bg-[#FB88AA] hover:bg-[#E94B7D] text-white text-sm dark:text-white flex items-center space-x-2 p-1 rounded-full"
            title="Nhắn tin"
            onClick={handleDirectMessage}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Nhóm chat</span>
          </Button>
        </div>

        {/* Comments Section */}
        <div ref={commentsBoxRef}>
          <PostComments
            comments={post.comments || []}
            show={showComments}
            maxVisible={maxVisibleComments}
            hideRepliesByDefault={hideRepliesByDefault}
            onShowMore={() => {
              setMaxVisibleComments((prev) => prev + 10);
              setTimeout(() => {
                if (commentsBoxRef.current) {
                  commentsBoxRef.current.scrollTop = commentsBoxRef.current.scrollHeight;
                }
              }, 100);
            }}
            onReply={handleComment}
            onLike={(comment, parentId) => {
              dispatch(likeComment({
                postId: post.id,
                commentId: comment.id,
                parentId: parentId || null,
              }));
            }}
          />
        </div>

        {/* Comment Form */}
        {showComments && (
          <div className="mt-4">
            <CommentForm onSubmit={handleComment} isSubmitting={isCommenting} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PostCard;