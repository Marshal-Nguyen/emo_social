import React from "react";
import { Clock, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import Avatar from "../atoms/Avatar";
import IconButton from "../atoms/IconButton";
import Badge from "../atoms/Badge";
import { formatTimeAgo } from "../../utils/helpers";

const PostHeader = ({
  post,
  showJoinedBadge = false,
  onMoreClick,
  className = "",
}) => {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div className="flex items-center space-x-3">
        <Avatar
          username={post.author.username}
          size="md"
          online={post.author.isOnline}
        />

        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {post.author.username}
            </h4>

            {showJoinedBadge && (
              <Badge variant="success" size="sm">
                ✓ Đã tham gia
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{formatTimeAgo(post.createdAt)}</span>
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
        />
      )}
    </div>
  );
};

export default PostHeader;
