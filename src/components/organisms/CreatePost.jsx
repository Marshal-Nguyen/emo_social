import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Send, Image, Smile, Hash } from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import { addPost } from "../../store/postsSlice";
import { generateAnonymousName, sanitizeInput } from "../../utils/helpers";
import { motion } from "framer-motion";

// Reusable CreatePostForm component
const CreatePostForm = ({ content, setContent, isPosting, handleSubmit, handleKeyPress, user, images, handleImageChange, removeImage }) => (
  <>
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
      {/* Image upload preview and input */}
      <div className="flex flex-col gap-2">
        {images && images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-fit">
                <img src={img} alt={`preview-${idx}`} className="max-h-32 rounded-lg border" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full px-2 py-1 text-xs text-red-500">X</button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          disabled={isPosting}
          className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
        />
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {/* Đã có input ảnh phía trên */}
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Smile className="w-4 h-4" />
            <span>Cảm xúc</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Hash className="w-4 h-4" />
            <span>Tag</span>
          </Button>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <span
            className={`text-sm font-medium ${content.length > 500
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
  </>
);

const CreatePost = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.posts);

  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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
        images: images || [],
      };
      dispatch(addPost(newPost));
      setContent("");
      setImages([]);
      setShowPopup(false);
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsPosting(false);
    }
  };

  // Xử lý chọn nhiều ảnh và chuyển sang base64
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const readers = files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      );
      Promise.all(readers).then((base64s) => {
        setImages((prev) => [...prev, ...base64s]);
      });
    }
  };
  const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  // Open popup on click anywhere in the mini input container
  const handleContainerClick = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  return (
    <>
      {/* Mini input container */}
      <div
        className="bg-[#F4F1F2]  dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow-sm transition"
        onClick={handleContainerClick}
      >
        <div className=" p-4 sm:p-6 flex items-center space-x-3 ">
          <Avatar
            username={user?.username || "You"}
            size="md"
            className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
          />
          <input
            className="w-full resize-none border-0 bg-white text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 text-base sm:text-lg leading-relaxed rounded-full px-4 py-2"
            placeholder="Chia sẻ cảm xúc của bạn..."
            value={content}
            readOnly
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className=" flex items-center gap-2 px-4 pb-3 ">
          <Button
            variant="ghost"
            size="sm"

            className="text-[#000000] dark:text-white flex items-center space-x-2 px-3 py-2 text-sm   font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Image className="w-4 h-4" />
            <span>Ảnh</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"

            className="text-[#000000] dark:text-white flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Smile className="w-4 h-4" />
            <span>Cảm xúc</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"

            className="text-[#000000] dark:text-white flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg">
            <Hash className="w-4 h-4" />
            <span>Tag</span>
          </Button>
          <div className="flex-1" />
          <Button
            variant="primary"
            size="sm"
            onClick={handleContainerClick}
            className="bg-gray-900  px-5 py-2 text-sm font-semibold rounded-full min-w-[80px] flex items-center justify-center space-x-2">
            <Send className="w-4 h-4" />
            <span>Chia sẻ</span>
          </Button>
        </div>
      </div>

      {/* Popup full form */}
      {showPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-xl p-6 relative"
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowPopup(false)}
              disabled={isPosting}
            >
              &times;
            </button>
            <CreatePostForm
              content={content}
              setContent={setContent}
              isPosting={isPosting}
              handleSubmit={handleSubmit}
              handleKeyPress={handleKeyPress}
              user={user}
              images={images}
              handleImageChange={handleImageChange}
              removeImage={removeImage}
            />
            <div className="mt-6 px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-t border-purple-100 dark:border-purple-800/30 rounded-b-xl sm:rounded-b-2xl">
              <div className="flex items-start space-x-2">
                <span className="text-purple-500 text-base flex-shrink-0">💡</span>
                <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
                  <span className="font-semibold">Gợi ý:</span> Bài viết sẽ hiển thị
                  với tên ẩn danh. Mọi người có thể tham gia nhóm chat hoặc nhắn riêng
                  với bạn.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default CreatePost;