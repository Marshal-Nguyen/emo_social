import React, { useState, useEffect } from "react";
import Button from "../atoms/Button";
import { Heart, MessageCircle, Eye, Hash } from "lucide-react";
import { postsService } from "../../services/apiService";
import { getCategoryTagsByIds, getUnicodeEmoji, getCategoryColorClasses } from "../../utils/tagHelpers";

const PostActions = ({ post, onComment, isLiking = false, className = "" }) => {
  const [liked, setLiked] = useState(post.liked || post.isReactedByCurrentUser || false);
  const [reactionCount, setReactionCount] = useState(post.reactionCount || post.likesCount || 0);
  const [error, setError] = useState(null);
  const baseUrl = "https://api.emoease.vn/post-service";

  // Lấy category tags từ post (xử lý cả categoryTagIds và categoryTagId)
  const categoryTagIds = post.categoryTagIds || post.categoryTagId || [];
  const [categoryTags, setCategoryTags] = useState([]);


  // Load category tags
  useEffect(() => {
    const loadCategoryTags = async () => {
      const tags = await getCategoryTagsByIds(categoryTagIds);
      setCategoryTags(tags);
    };
    loadCategoryTags();
  }, [categoryTagIds]);

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
    <div className={`flex items-center justify-between ${className}`}>
      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
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
      </div>

      {/* Category Tags - Cuối hàng, bên phải */}
      {categoryTags.length > 0 && (
        <div className="flex items-center space-x-2">
          {categoryTags.map((category) => {
            const colors = getCategoryColorClasses(category);
            return (
              <button
                key={category.id}
                type="button"
                className={`flex items-center space-x-1 px-2 py-1 rounded-full transition ${colors.container}`}
                title={`Lọc theo chủ đề: ${category.displayName}`}
                onClick={(e) => {
                  try {
                    window.dispatchEvent(
                      new CustomEvent("app:selectCategory", { detail: { categoryId: category.id } })
                    );
                  } catch { }
                }}
              >
                <Hash className={`w-3 h-3 ${colors.icon}`} />
                <span className={`text-xs font-medium ${colors.text}`}>
                  {category.displayName}
                </span>
                <span className="text-sm">{getUnicodeEmoji(category.unicodeCodepoint)}</span>
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <div className="text-red-500 text-xs sm:text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default PostActions;