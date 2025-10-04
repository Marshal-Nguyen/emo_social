import React, { useState, useEffect } from "react";
import { Clock, MoreHorizontal, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Avatar from "../atoms/Avatar";
import IconButton from "../atoms/IconButton";
import Badge from "../atoms/Badge";
import { formatTimeAgo } from "../../utils/helpers";
import { getEmotionTagsByIds, getUnicodeEmoji } from "../../utils/tagHelpers";

const PostHeader = ({
  post,
  showJoinedBadge = false,
  onMoreClick,
  className = "",
  onBack,
}) => {
  const author = {
    username: post.author?.displayName || post.author?.username || "Anonymous",
    isOnline: post.author?.isOnline ?? false,
  };

  // Lấy emotion tags từ post (xử lý cả emotionTagIds và emotionId)
  const emotionTagIds = post.emotionTagIds || post.emotionId || [];
  const [emotionTags, setEmotionTags] = useState([]);


  // Load emotion tags
  useEffect(() => {
    const loadEmotionTags = async () => {
      const tags = await getEmotionTagsByIds(emotionTagIds);
      setEmotionTags(tags);
    };
    loadEmotionTags();
  }, [emotionTagIds]);

  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
        {onBack && (
          <button
            className="mr-1 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none flex-shrink-0"
            onClick={onBack}
            title="Quay lại"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-200" />
          </button>
        )}
        <Avatar
          username={author.username}
          size="md"
          online={author.isOnline}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
              {author.username}
            </h4>
            {emotionTags.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">đang cảm thấy</span>
                {emotionTags.map((emotion, index) => (
                  <div key={emotion.id} className="flex items-center space-x-1">
                    <span className="text-sm">{getUnicodeEmoji(emotion.unicodeCodepoint)}</span>
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      {emotion.displayName}
                    </span>
                    {index < emotionTags.length - 1 && (
                      <span className="text-xs text-gray-400">,</span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {showJoinedBadge && (
              <Badge variant="success" size="sm">
                ✓ Đã tham gia
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{formatTimeAgo(post.createdAt)}</span>
          </div>
        </div>
      </div>
      {onMoreClick && (
        <IconButton
          icon={MoreHorizontal}
          variant="ghost"
          size="sm"
          onClick={onMoreClick}
          title="Tùy chọn khác"
          className="flex-shrink-0"
        />
      )}
    </div>
  );
};

export default PostHeader;