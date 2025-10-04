import React, { useState, useEffect } from "react";
import Button from "../atoms/Button";
import { Heart, MessageCircle, Eye } from "lucide-react";
import { postsService } from "../../services/apiService";

const PostActions = ({ post, onComment, isLiking = false, className = "" }) => {
  const [liked, setLiked] = useState(post.liked || post.isReactedByCurrentUser || false);
  const [reactionCount, setReactionCount] = useState(post.reactionCount || post.likesCount || 0);
  const [error, setError] = useState(null);
  const baseUrl = "https://api.emoease.vn/post-service";

  // Removed initial reaction status fetch on mount to avoid triggering
  // reactions API when entering the feed. We now rely on `post.liked`
  // from the feed data and only call the API upon explicit user action.

  const handleLike = async () => {
    if (isLiking) return;
    const newLikedState = !liked;
    try {
      if (newLikedState) {
        await postsService.likePost(post.id);
        setReactionCount((prev) => prev + 1);
        setLiked(true);
      } else {
        await postsService.unlikePost(post.id);
        setReactionCount((prev) => prev - 1);
        setLiked(false);
      }
      setError(null);
    } catch (error) {
      console.error("Lỗi khi xử lý lượt thích:", error.message);
      setError(error.message);
    }
  };

  return (
    <div className={`flex items-center justify-end gap-2 sm:gap-3 ${className}`}>
      <div className="flex items-center gap-1">
        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {reactionCount}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className={`!rounded-full !p-2 ${liked ? "text-red-500 dark:text-red-500" : "text-gray-500 hover:text-red-500"}`}
          title={liked ? "Bỏ thích" : "Thích"}
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart className="w-4 h-4 sm:w-5 sm:h-5" fill={liked ? "currentColor" : "none"} />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {post.commentCount || post.commentsCount || 0}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="!rounded-full !p-2"
          title="Bình luận"
          onClick={onComment}
        >
          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          {post.viewCount || 0}
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="!rounded-full !p-2"
          title="Lượt xem"
          disabled
        >
          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-xs sm:text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default PostActions;