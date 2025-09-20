import React from "react";
import Button from "../atoms/Button";
import { Repeat2, Share2, MessageCircle, Heart } from "lucide-react";

const PostActions = ({ post, onLike, onComment, isLiking = false, className = "" }) => {
  return (
    <div className={`flex items-center justify-end gap-3 ${className}`}>
      {/* Like */}
      <div className="flex items-center gap-1">
        {post.likesCount > 0 && (
          <span className="text-md text-gray-600 dark:text-gray-400">{post.likesCount}</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={`!rounded-full ${post.liked ? 'text-red-500 dark:text-red-500' : 'text-gray-500 hover:text-red-500'} `}
          title={post.liked ? "Bỏ thích" : "Thích"}
          onClick={onLike}
        >
          <Heart className="w-5 h-5" fill={post.liked ? 'currentColor' : 'none'} />
        </Button>

      </div>
      {/* Comment */}
      <Button variant="ghost" size="icon" className="!rounded-full" title="Bình luận" onClick={onComment}>
        <MessageCircle className="w-5 h-5" />
      </Button>
      {/* Đăng lại */}
      <Button variant="ghost" size="icon" className="!rounded-full" title="Đăng lại">
        <Repeat2 className="w-5 h-5" />
      </Button>
      {/* Chia sẻ */}
      <Button variant="ghost" size="icon" className="!rounded-full" title="Chia sẻ">
        <Share2 className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default PostActions;