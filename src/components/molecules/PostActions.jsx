import React from "react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import { Repeat2, Share2, MessageCircle, Heart } from "lucide-react";

const PostActions = ({ post, onLike, onComment, isLiking = false, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-start ml-2 mt-4 gap-3 ${className}`}>

      {/* Like */}
      <div className="flex flex-col items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className={`!rounded-full ${post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
          title={post.liked ? "Bỏ thích" : "Thích"}
          onClick={onLike}
          disabled={isLiking}
        >
          <Heart className="w-5 h-5" />
        </Button>
        {post.likesCount > 0 && (
          <span className="text-xs text-gray-600 dark:text-gray-400">{post.likesCount}</span>
        )}
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
