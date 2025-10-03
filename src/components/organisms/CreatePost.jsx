// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Send, Image, Smile, Hash } from "lucide-react";
// import Button from "../atoms/Button";
// import Avatar from "../atoms/Avatar";
// import { addPost } from "../../store/postsSlice";
// import { generateAnonymousName, sanitizeInput } from "../../utils/helpers";
// import { motion } from "framer-motion";

// // Reusable CreatePostForm component
// const CreatePostForm = ({ content, setContent, isPosting, handleSubmit, handleKeyPress, user, images, handleImageChange, removeImage }) => (
//   <>
//     <div className="flex items-center space-x-3 mb-4">
//       <Avatar
//         username={user?.username || "You"}
//         size="md"
//         className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
//       />
//       <div className="flex-1 min-w-0">
//         <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
//           {user?.username || "Tài khoản ẩn danh"}
//         </h3>
//         <p className="text-xs text-gray-500 dark:text-gray-400">
//           Chia sẻ với cộng đồng
//         </p>
//       </div>
//     </div>
//     <div className="space-y-4">
//       <textarea
//         placeholder="Chia sẻ cảm xúc của bạn..."
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         onKeyPress={handleKeyPress}
//         rows={4}
//         className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 text-base sm:text-lg leading-relaxed"
//         disabled={isPosting}
//       />
//       {/* Image upload preview and input */}
//       <div className="flex flex-col gap-2">
//         {images && images.length > 0 && (
//           <div className="flex flex-wrap gap-2">
//             {images.map((img, idx) => (
//               <div key={idx} className="relative w-fit">
//                 <img src={img} alt={`preview-${idx}`} className="max-h-32 rounded-lg border" />
//                 <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full px-2 py-1 text-xs text-red-500">X</button>
//               </div>
//             ))}
//           </div>
//         )}
//         <input
//           type="file"
//           accept="image/*"
//           multiple
//           onChange={handleImageChange}
//           disabled={isPosting}
//           className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
//         />
//       </div>
//       <div className="space-y-3">
//         <div className="flex flex-wrap gap-2 sm:gap-3">
//           {/* Đã có input ảnh phía trên */}
//           <Button
//             variant="ghost"
//             size="sm"
//             disabled
//             className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
//             <Smile className="w-4 h-4" />
//             <span>Cảm xúc</span>
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"
//             disabled
//             className="flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
//             <Hash className="w-4 h-4" />
//             <span>Tag</span>
//           </Button>
//         </div>
//         <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
//           <span
//             className={`text-sm font-medium ${content.length > 500
//               ? "text-red-500"
//               : content.length > 400
//                 ? "text-yellow-500"
//                 : "text-gray-500 dark:text-gray-400"
//               }`}>
//             {content.length}/500
//           </span>
//           <Button
//             variant="primary"
//             size="md"
//             onClick={handleSubmit}
//             disabled={!content.trim() || content.length > 500 || isPosting}
//             loading={isPosting}
//             className="px-6 py-2.5 text-sm font-semibold rounded-full min-w-[100px] flex items-center justify-center space-x-2">
//             <Send className="w-4 h-4" />
//             <span>Chia sẻ</span>
//           </Button>
//         </div>
//       </div>
//     </div>
//   </>
// );

// const CreatePost = () => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const { loading } = useSelector((state) => state.posts);

//   const [content, setContent] = useState("");
//   const [isPosting, setIsPosting] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [images, setImages] = useState([]);

//   const handleSubmit = async (e) => {
//     if (e) e.preventDefault();
//     if (!content.trim() || isPosting) return;
//     setIsPosting(true);
//     try {
//       const sanitizedContent = sanitizeInput(content);
//       const newPost = {
//         id: Date.now(),
//         content: sanitizedContent,
//         author: {
//           id: user?.id || "anonymous",
//           username: user?.username || generateAnonymousName(),
//           isOnline: true,
//         },
//         createdAt: new Date().toISOString(),
//         likesCount: 0,
//         commentsCount: 0,
//         liked: false,
//         comments: [],
//         images: images || [],
//       };
//       dispatch(addPost(newPost));
//       setContent("");
//       setImages([]);
//       setShowPopup(false);
//     } catch (error) {
//       console.error("Failed to create post:", error);
//     } finally {
//       setIsPosting(false);
//     }
//   };

//   // Xử lý chọn nhiều ảnh và chuyển sang base64
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       const readers = files.map(
//         (file) =>
//           new Promise((resolve) => {
//             const reader = new FileReader();
//             reader.onloadend = () => resolve(reader.result);
//             reader.readAsDataURL(file);
//           })
//       );
//       Promise.all(readers).then((base64s) => {
//         setImages((prev) => [...prev, ...base64s]);
//       });
//     }
//   };
//   const removeImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
//       handleSubmit(e);
//     }
//   };

//   // Open popup on click anywhere in the mini input container
//   const handleContainerClick = (e) => {
//     e.preventDefault();
//     setShowPopup(true);
//   };

//   return (
//     <>
//       {/* Mini input container */}
//       <div
//         className="bg-[#F4F1F2]  dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl sm:rounded-2xl shadow-sm transition"
//         onClick={handleContainerClick}
//       >
//         <div className=" p-4 sm:p-6 flex items-center space-x-3 ">
//           <Avatar
//             username={user?.username || "You"}
//             size="md"
//             className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0"
//           />
//           <input
//             className="w-full resize-none border-0 bg-white text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 text-base sm:text-lg leading-relaxed rounded-full px-4 py-2"
//             placeholder="Chia sẻ cảm xúc của bạn..."
//             value={content}
//             readOnly
//             style={{ cursor: "pointer" }}
//           />
//         </div>
//         <div className=" flex items-center gap-2 px-4 pb-3 ">
//           <Button
//             variant="ghost"
//             size="sm"

//             className="text-[#000000] dark:text-white flex items-center space-x-2 px-3 py-2 text-sm   font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
//             <Image className="w-4 h-4" />
//             <span>Ảnh</span>
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"

//             className="text-[#000000] dark:text-white flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
//             <Smile className="w-4 h-4" />
//             <span>Cảm xúc</span>
//           </Button>
//           <Button
//             variant="ghost"
//             size="sm"

//             className="text-[#000000] dark:text-white flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg">
//             <Hash className="w-4 h-4" />
//             <span>Tag</span>
//           </Button>
//           <div className="flex-1" />
//           <Button
//             variant="primary"
//             size="sm"
//             onClick={handleContainerClick}
//             className="bg-gray-900  px-5 py-2 text-sm font-semibold rounded-full min-w-[80px] flex items-center justify-center space-x-2">
//             <Send className="w-4 h-4" />
//             <span>Chia sẻ</span>
//           </Button>
//         </div>
//       </div>

//       {/* Popup full form */}
//       {showPopup && (
//         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40">
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 40 }}
//             className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-xl p-6 relative"
//           >
//             <button
//               className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
//               onClick={() => setShowPopup(false)}
//               disabled={isPosting}
//             >
//               &times;
//             </button>
//             <CreatePostForm
//               content={content}
//               setContent={setContent}
//               isPosting={isPosting}
//               handleSubmit={handleSubmit}
//               handleKeyPress={handleKeyPress}
//               user={user}
//               images={images}
//               handleImageChange={handleImageChange}
//               removeImage={removeImage}
//             />
//             <div className="mt-6 px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-t border-purple-100 dark:border-purple-800/30 rounded-b-xl sm:rounded-b-2xl">
//               <div className="flex items-start space-x-2">
//                 <span className="text-purple-500 text-base flex-shrink-0">💡</span>
//                 <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
//                   <span className="font-semibold">Gợi ý:</span> Bài viết sẽ hiển thị
//                   với tên ẩn danh. Mọi người có thể tham gia nhóm chat hoặc nhắn riêng
//                   với bạn.
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CreatePost;

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Send, Image, Smile, Hash, Eye } from "lucide-react";  // Eye cho visibility
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import { addPost } from "../../store/postsSlice";  // Giữ để update Redux
import { generateAnonymousName, sanitizeInput } from "../../utils/helpers";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
// import toast from "react-hot-toast";  // Comment nếu chưa install, dùng console thay thế

// Hardcode tạm cho pickers (thay bằng fetch API sau nếu cần)
const TAGS = [
  { id: "tag-001", name: "Cảm xúc hàng ngày" },
  { id: "tag-002", name: "Sức khỏe tinh thần" },
  // Fetch thật: GET /v1/tags
];

const EMOTIONS = [
  { id: "emotion-001", name: "Vui vẻ", icon: "😊" },
  { id: "emotion-002", name: "Buồn", icon: "😢" },
  { id: "emotion-003", name: "Giận dữ", icon: "😠" },
  // Fetch thật: GET /v1/emotions (hoặc /profile-service/v1/emotions)
];

// Fixed token (hardcode theo yêu cầu)
const FIXED_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNWZhZTI2OC03YThhLTQ1ZWMtYTMyYi1mMzVlMDkzNDEwN2EiLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTkzODE1NTQsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.QQiuhb2SeBZIiHI1mXT0KAxfOqxFOQLLTnGDfILupcxF73q3vTaUdEVWNB-ZXB3_8BkF_mDZ8PoXKvJgCp54xjOg8z58I2ET95PM8tf13UfPIIhqlZAFAjwtMSw6PrZkOA-_6pSWNufX1WvX9RFeSNiAj-zsPWq3HlSUWx3H8eyhcmWwPc7EDIdk_x8JhgQNhL-tri7KxWE9LULifhQNDajcglnLuvu70Y4nenaQPHk8IJT7G4OwmZgmnafNN1cywBTpG-il4DZYSn-_PN2u7IQ9HpBinVX4BLjBhL2hXLbIj3JhhlQA83Eco7LJK1LgyNbfZHgHpAEyhc0f1zfM8w";

// Mock upload media → Trả UUID (thay bằng MediaService thật sau)
const uploadMedia = async (files) => {
  // Giả: POST /media-service/v1/upload (body: FormData)
  const promises = files.map(file =>
    new Promise(resolve => {
      // Mock delay + UUID
      setTimeout(() => resolve({ mediaId: uuidv4(), url: URL.createObjectURL(file) }), 500);
    })
  );
  return Promise.all(promises);
};

// Reusable CreatePostForm
const CreatePostForm = ({
  content, setContent, title, setTitle, visibility, setVisibility,
  categoryTagId, setCategoryTagId, emotionId, setEmotionId,
  isPosting, handleSubmit, handleKeyPress, user,
  images, handleImageChange, removeImage,
  mediaIds, setMediaIds  // Thêm cho UUIDs
}) => (
  <>
    <div className="flex items-center space-x-3 mb-4">
      <Avatar username={user?.username || "You"} size="md" className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {user?.username || "Tài khoản ẩn danh"}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">Chia sẻ với cộng đồng</p>
      </div>
    </div>
    <div className="space-y-4">
      {/* Title mới */}
      {/* <input
        type="text"
        placeholder="Tiêu đề bài viết (tùy chọn)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isPosting}
        maxLength={100}
      /> */}

      <textarea
        placeholder="Chia sẻ cảm xúc của bạn..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={handleKeyPress}
        rows={4}
        className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 text-base sm:text-lg leading-relaxed"
        disabled={isPosting}
      />

      {/* Visibility Picker */}
      <div className="flex items-center space-x-2">
        <Eye className="w-4 h-4 text-gray-500" />
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
          disabled={isPosting}
        >
          <option value="Public">Công khai (Mọi người thấy)</option>
          <option value="Draft">Nháp (Chỉ bạn)</option>
          <option value="Private">Riêng tư (Bạn bè)</option>
        </select>
      </div>

      {/* Category Tag Picker */}
      <div className="flex items-center space-x-2">
        <Hash className="w-4 h-4 text-gray-500" />
        <select
          value={categoryTagId}
          onChange={(e) => setCategoryTagId(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
          disabled={isPosting}
        >
          <option value="">Chọn danh mục (tùy chọn)</option>
          {TAGS.map(tag => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>
      </div>

      {/* Emotion Picker */}
      <div className="flex items-center space-x-2">
        <Smile className="w-4 h-4 text-gray-500" />
        <select
          value={emotionId}
          onChange={(e) => setEmotionId(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
          disabled={isPosting}
        >
          <option value="">Chọn cảm xúc (tùy chọn)</option>
          {EMOTIONS.map(emo => (
            <option key={emo.id} value={emo.id}>{emo.icon} {emo.name}</option>
          ))}
        </select>
      </div>

      {/* Image upload preview and input */}
      <div className="flex flex-col gap-2">
        {images && images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-fit">
                <img src={img.url || img} alt={`preview-${idx}`} className="max-h-32 rounded-lg border" />
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
          {/* Các button giờ enabled qua pickers trên */}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className={`text-sm font-medium ${content.length > 500 ? "text-red-500" : content.length > 400 ? "text-yellow-500" : "text-gray-500 dark:text-gray-400"
            }`}>
            {content.length}/500
          </span>
          <Button
            variant="primary"
            size="md"
            onClick={handleSubmit}
            disabled={!content.trim() || content.length > 500 || isPosting}
            loading={isPosting}
            className="px-6 py-2.5 text-sm font-semibold rounded-full min-w-[100px] flex items-center justify-center space-x-2"
          >
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
  const { user } = useSelector((state) => state.auth);  // Giữ user từ Redux
  const { loading } = useSelector((state) => state.posts);

  // State mở rộng (giữ nguyên)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [categoryTagId, setCategoryTagId] = useState("");
  const [emotionId, setEmotionId] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [images, setImages] = useState([]);  // { url: base64, mediaId: uuid }[]
  const [mediaIds, setMediaIds] = useState([]);  // UUIDs cho API

  // Fetch tags/emotions nếu cần (useEffect)
  useEffect(() => {
    // Ví dụ: GET /v1/tags hoặc /v1/emotions với axios tương tự
    // axios.get(`${BASE_URL}/v1/tags`, { headers: { Authorization: `Bearer ${FIXED_TOKEN}` } }).then(res => setTAGS(res.data));
    // Hiện hardcode
  }, []);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!content.trim() || isPosting) return;
    setIsPosting(true);
    try {
      const sanitizedContent = sanitizeInput(content) || '';  // Fallback empty string

      // Build body động: Chỉ include fields không null/empty
      const body = {
        content: sanitizedContent,
        visibility,
      };

      // Thêm optional fields chỉ nếu có giá trị
      if (title.trim()) body.title = title.trim();
      if (mediaIds.length > 0) body.mediaIds = mediaIds;
      if (categoryTagId) body.categoryTagId = categoryTagId;
      if (emotionId) body.emotionId = emotionId;

      // Gọi API thật với axios trực tiếp (hardcode token và baseUrl)
      const response = await axios.post("https://api.emoease.vn/post-service/v1/posts", body, {
        headers: {
          "Authorization": `Bearer ${FIXED_TOKEN}`,
          "Idempotency-Key": uuidv4(),  // Random UUID mỗi lần
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      // Map response.data để match shape cũ (tránh bug undefined ở feed/PostContent)
      const apiData = response.data || {};  // Fallback nếu response rỗng
      const newPost = {
        // Shape cũ: id, content, author, createdAt, likesCount, commentsCount, liked, comments, images
        id: apiData.postId || apiData.id || Date.now(),  // Ưu tiên postId từ BE, fallback cũ
        content: apiData.content || sanitizedContent,  // Đảm bảo content luôn có (fix toLowerCase bug)
        title: apiData.title || title.trim() || '',  // Thêm nếu BE trả
        visibility: apiData.visibility || visibility,  // Thêm nếu cần
        categoryTagId: apiData.categoryTagId || categoryTagId || '',  // Thêm nếu cần
        emotionId: apiData.emotionId || emotionId || '',  // Thêm nếu cần
        author: {
          id: user?.id || "anonymous",
          username: user?.username || generateAnonymousName(),
          isOnline: true,  // Giữ như cũ
        },
        createdAt: apiData.createdAt || new Date().toISOString(),  // Ưu tiên BE
        likesCount: apiData.likesCount || 0,  // 0 nếu BE chưa có
        commentsCount: apiData.commentsCount || 0,  // 0 nếu BE chưa có
        liked: apiData.liked || false,  // false nếu BE chưa có
        comments: apiData.comments || [],  // [] nếu BE chưa có
        images: images.map(img => img.url || img),  // Preview URLs như cũ (BE có thể có mediaUrls sau)
        // Các field extra từ BE nếu có (không ảnh hưởng shape cũ)
        ...apiData,  // Spread cuối để giữ data thật, nhưng override bằng shape cũ nếu conflict
      };

      dispatch(addPost(newPost));  // Update Redux store (giờ shape khớp cũ)

      // toast.success("Bài viết đã được tạo!");  // Uncomment nếu có react-hot-toast
      console.log("Bài viết đã được tạo!", newPost);  // Log để check shape

      // Reset form
      setTitle(""); setContent(""); setVisibility("Public"); setCategoryTagId(""); setEmotionId("");
      setImages([]); setMediaIds([]);
      setShowPopup(false);
    } catch (error) {
      console.error("Failed to create post:", error);
      const errMsg = error.response?.data?.title || error.message || "Lỗi tạo bài viết";
      // toast.error(errMsg);  // Uncomment nếu có react-hot-toast
      console.error(errMsg);  // Fallback
    } finally {
      setIsPosting(false);
    }
  };

  // Upload images → Lấy mediaIds (mock, giữ nguyên)
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Upload song song (thay bằng MediaService thật)
    const uploaded = await uploadMedia(files);
    const base64Promises = files.map(file =>
      new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      })
    );
    const base64s = await Promise.all(base64Promises);

    const newImages = uploaded.map((upload, idx) => ({
      url: base64s[idx],
      mediaId: upload.mediaId,
    }));

    setImages(prev => [...prev, ...newImages]);
    setMediaIds(prev => [...prev, ...uploaded.map(u => u.mediaId)]);
  };

  const removeImage = (idx) => {
    const removed = images[idx];
    setImages(prev => prev.filter((_, i) => i !== idx));
    setMediaIds(prev => prev.filter(id => id !== removed.mediaId));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit(e);
  };

  const handleContainerClick = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  // JSX giống gốc, chỉ thay CreatePostForm props (mini input giữ nguyên)
  return (
    <>
      {/* Mini input container */}
      <div
        className="bg-[#F4F1F2] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl shadow-sm transition"
        onClick={handleContainerClick}
      >
        <div className="p-3 sm:p-4 sm:p-6 flex items-center space-x-2 sm:space-x-3">
          <Avatar
            username={user?.username || "You"}
            size="md"
            className="w-8 h-8 sm:w-10 sm:h-10 sm:w-12 sm:h-12 flex-shrink-0"
          />
          <input
            className="w-full resize-none border-0 bg-white text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 text-sm sm:text-base sm:text-lg leading-relaxed rounded-full px-3 sm:px-4 py-2"
            placeholder="Chia sẻ cảm xúc của bạn..."
            value={content}
            readOnly
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 pb-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#000000] dark:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Image className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Ảnh</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#000000] dark:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <Smile className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Cảm xúc</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#000000] dark:text-white flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg">
            <Hash className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Tag</span>
          </Button>
          <div className="flex-1" />
          <Button
            variant="primary"
            size="sm"
            onClick={handleContainerClick}
            className="bg-gray-900 px-3 sm:px-5 py-2 text-xs sm:text-sm font-semibold rounded-full min-w-[60px] sm:min-w-[80px] flex items-center justify-center space-x-1 sm:space-x-2">
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Chia sẻ</span>
          </Button>
        </div>
      </div>

      {/* Popup full form */}
      {showPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-40 p-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-2xl shadow-2xl w-full max-w-xl p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-700 text-xl sm:text-2xl"
              onClick={() => setShowPopup(false)}
              disabled={isPosting}
            >
              &times;
            </button>
            <CreatePostForm
              title={title} setTitle={setTitle}
              content={content} setContent={setContent}
              visibility={visibility} setVisibility={setVisibility}
              categoryTagId={categoryTagId} setCategoryTagId={setCategoryTagId}
              emotionId={emotionId} setEmotionId={setEmotionId}
              isPosting={isPosting}
              handleSubmit={handleSubmit}
              handleKeyPress={handleKeyPress}
              user={user}
              images={images}
              handleImageChange={handleImageChange}
              removeImage={removeImage}
              mediaIds={mediaIds} setMediaIds={setMediaIds}
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