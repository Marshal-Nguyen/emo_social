import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Send, Image, Smile } from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import { addPost } from "../../store/postsSlice";
import { generateAnonymousName, sanitizeInput } from "../../utils/helpers";

const CreatePost = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.posts);

  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() || isPosting) return;

    setIsPosting(true);

    try {
      const sanitizedContent = sanitizeInput(content);

      const newPost = {
        id: Date.now(),
        content: sanitizedContent,
        author: {
          id: user?.id || "anonymous",
          username: user?.username || generateAnonymousName(),
          isOnline: true,
        },
        createdAt: new Date().toISOString(),
        likesCount: 0,
        commentsCount: 0,
        liked: false,
        comments: [],
      };

      dispatch(addPost(newPost));
      setContent("");

      // TODO: Call API to create post
      // await postsService.createPost(sanitizedContent, true)
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow-sm">
      <div className="p-4 sm:p-6">
        {/* Header with Avatar and Name */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar
            username={user?.username || "You"}
            size="md"
            className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.username || "Tài khoản ẩn danh"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Chia sẻ với cộng đồng
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          <textarea
            placeholder="Chia sẻ cảm xúc của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={4}
            className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 text-base sm:text-lg leading-relaxed"
            disabled={isPosting}
          />

          {/* Actions Area */}
          <div className="space-y-3">
            {/* Action buttons row */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Image className="w-4 h-4" />
                <span>Ảnh</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                disabled
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Smile className="w-4 h-4" />
                <span>Cảm xúc</span>
              </Button>
            </div>

            {/* Bottom row - Character count and post button */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <span
                className={`text-sm font-medium ${
                  content.length > 500
                    ? "text-red-500"
                    : content.length > 400
                    ? "text-yellow-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}>
                {content.length}/500
              </span>

              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                disabled={!content.trim() || content.length > 500 || isPosting}
                loading={isPosting}
                className="px-6 py-2.5 text-sm font-semibold rounded-full min-w-[100px] flex items-center justify-center space-x-2">
                <Send className="w-4 h-4" />
                <span>Chia sẻ</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced tips section for mobile */}
      <div className="px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-t border-purple-100 dark:border-purple-800/30 rounded-b-xl sm:rounded-b-2xl">
        <div className="flex items-start space-x-2">
          <span className="text-purple-500 text-base flex-shrink-0">💡</span>
          <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
            <span className="font-semibold">Gợi ý:</span> Bài viết sẽ hiển thị
            với tên ẩn danh. Mọi người có thể tham gia nhóm chat hoặc nhắn riêng
            với bạn.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
