import React, { useState, useEffect } from "react";
import Button from "../atoms/Button";
import { Heart, MessageCircle, Eye } from "lucide-react";

const PostActions = ({ post, onComment, isLiking = false, className = "" }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [reactionCount, setReactionCount] = useState(post.reactionCount || 0);
  const [error, setError] = useState(null);
  const baseUrl = "https://api.emoease.vn/post-service";
  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMDJlMjFjMS1mM3NmLTQ2MzItYTdjYy0wOTRkMzc3YTY0ZTQiLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk0MTQzMjAsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.d2Z7_TykLgWLu9l0FFDHy01x1OicghQZYcxy7Mwme1KfefDPnbsVlviXQyiOlLyyYrzrzBnNBgeyl8HnBDEivDd5tOt93BuMnFXUmKKxhbVxqTUxItwLc1BvPGqsmSugwKCG-J_bGKcsOFO6VkhDKtz8YdHgE4YIihzEIPMHmdK3q5t6Lix5f8mJFYFFtestUhf-_cUXF8MCwPysRKTe-rvXB8RtO9Deiqo3ak4QH-P2bTdt6LQrjWnPK77q6Rb1BR8MfynVsNAkanXnDGJsWovw5L-i466Zm2pa2xl3I0WlGhONwPlvbqoCWTmRqRUTeLZu4TegulgG1GZ_1pcpgg";

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/v1/reactions?TargetType=Post&TargetId=${post.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const userLiked = data.some(
            (reaction) =>
              reaction.reactionCode === "Like" &&
              reaction.userId === "4c46a75a-3172-4447-9b69-4f5f07210f4a"
          );
          setLiked(userLiked);
        } else {
          console.warn("Không thể kiểm tra trạng thái thích:", response.status);
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra trạng thái thích:", err);
      }
    };

    checkIfLiked();
  }, [post.id]);

  const handleLike = async () => {
    if (isLiking) return;
    const newLikedState = !liked;
    try {
      if (newLikedState) {
        const response = await fetch(`${baseUrl}/v1/reactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            targetType: "Post",
            targetId: post.id,
            reactionCode: "Like",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Không thể thích bài viết: ${response.status} - ${errorText}`);
        }
        setReactionCount((prev) => prev + 1);
        setLiked(true);
      } else {
        const response = await fetch(
          `${baseUrl}/v1/reactions?TargetType=Post&TargetId=${post.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Không thể bỏ thích bài viết: ${response.status} - ${errorText}`);
        }
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
    <div className={`flex items-center justify-end gap-3 ${className}`}>
      <div className="flex items-center gap-1">
        <span className="text-md text-gray-600 dark:text-gray-400">
          {reactionCount}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className={`!rounded-full ${liked ? "text-red-500 dark:text-red-500" : "text-gray-500 hover:text-red-500"}`}
          title={liked ? "Bỏ thích" : "Thích"}
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart className="w-5 h-5" fill={liked ? "currentColor" : "none"} />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-md text-gray-600 dark:text-gray-400">
          {post.commentCount || 0}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="!rounded-full"
          title="Bình luận"
          onClick={onComment}
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-md text-gray-600 dark:text-gray-400">
          {post.viewCount || 0}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="!rounded-full"
          title="Lượt xem"
          disabled
        >
          <Eye className="w-5 h-5" />
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default PostActions;