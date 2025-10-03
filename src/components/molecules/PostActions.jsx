import React, { useState, useEffect } from "react";
import Button from "../atoms/Button";
import { Heart, MessageCircle, Eye } from "lucide-react";

const PostActions = ({ post, onComment, isLiking = false, className = "" }) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [reactionCount, setReactionCount] = useState(post.reactionCount || 0);
  const [error, setError] = useState(null);
  const baseUrl = "https://api.emoease.vn/post-service";
  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZWVlZWY1NC0zNzQ1LTRkODAtYTc1OC02NWFlNWQ2YTFiODUiLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk0NzM3NTcsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.TXKohDzV54uglcDGzk-D9ySdEo_3tSKaLcssTOwZwJC9m8GRlKmlv9-vrfSLALpdw69KFFNyJep3AW5ZuYQCDf4NJmTcrusVo6m0EER17A6kFv7QAKOkjUxEvo5MCl3QhXy1Yh34534x6HeoxjQcc8nvR2Ngj-g27hUxZckPMogiAh9fIxyEyvyqPRlGV9wlm6fqWlvtxEzDxBiUiLzXV7JMVMBLhp6GpK4_-kKNPpGsn3ne1ytZJ9gjMgYsImMQhWP2AWEOelHkRbh7fG_C51hUxd-y_hsTgG70U4Qib71qTbxEky5VwBv9Ly__Dv1jY5-htT_LNgHWVYPWuFiFgQ";

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
          {post.commentCount || 0}
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