// chia 6:3
// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import CreatePost from "../components/organisms/CreatePost";
// import Feed from "../components/organisms/Feed";
// import Comment from "../components/organisms/Comment";
// // ...existing code...
// import { useOutletContext } from "react-router-dom";
// import SearchBar from "../components/molecules/SearchBar";
// import FeedNav from "../components/molecules/FeedNav";


// const HomePage = () => {
//   const { handleNavigateToChat } = useOutletContext();
//   const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
//   const [search, setSearch] = useState("");
//   const [selectedFilter, setSelectedFilter] = useState("all");
//   const [selectedTab, setSelectedTab] = useState("most_recent");
//   const [showComment, setShowComment] = useState(true);
//   const [selectedPost, setSelectedPost] = useState(null);
//   const [localComments, setLocalComments] = useState({});
//   const user = { username: "User", avatar: undefined };

//   const tagSuggestions = [
//     { value: "stress", label: "Stress", icon: "😣", count: 42 },
//     { value: "mat-ngu", label: "Mất ngủ", icon: "🌙", count: 30 },
//     { value: "tram-cam", label: "Trầm cảm", icon: "😔", count: 25 },
//     { value: "lo-au", label: "Lo âu", icon: "😟", count: 18 },
//     { value: "tu-ky", label: "Tự kỷ", icon: "🧩", count: 10 },
//     { value: "hoc-duong", label: "Học đường", icon: "🎓", count: 15 },
//   ];

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   return (
//     <div className="grid grid-cols-9 gap-4 h-screen">
//       {/* 6-column region (spans 9 columns on mobile) */}
//       <div className={`col-span-6 ${isMobile ? 'col-span-9' : ''} space-y-4 overflow-y-auto no-scrollbar z-20`}>
//         {/* Sticky header with FeedNav and SearchBar side by side */}
//         <div className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md pb-2 pt-2 mb-2 flex items-center gap-4 shadow-sm px-2">
//           <FeedNav selected={selectedTab} onSelect={setSelectedTab} />
//           <div className="flex-1 flex justify-end">
//             <div className="w-full max-w-xs">
//               <SearchBar
//                 onSearch={(searchValue, filterValue) => {
//                   setSearch(searchValue);
//                   setSelectedFilter(filterValue);
//                   // ...existing code...
//                 }}
//                 tags={tagSuggestions}
//                 search={search}
//                 setSearch={setSearch}
//                 selectedFilter={selectedFilter}
//                 setSelectedFilter={setSelectedFilter}
//               />
//             </div>
//           </div>
//         </div>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <CreatePost />
//         </motion.div>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           <Feed
//             onNavigateToChat={handleNavigateToChat}
//             search={search}
//             filter={selectedFilter}
//             onSelectPost={post => {
//               setSelectedPost(post);
//               setShowComment(true);
//             }}
//           />
//         </motion.div>
//       </div>
//       {/* 3-column region (hidden on mobile) */}
//       {!isMobile && (
//         <div className="col-span-3 overflow-hidden  flex flex-col h-full">
//           {/* Atomic action buttons group at top */}
//           <div className="flex items-center bg-gray-900 dark:bg-gray-500  text-white rounded-full p-1 gap-4 mt-4 mb-2 mr-10 shadow-lg">
//             <button
//               onClick={() => alert("Nhận xu!")}
//               className="flex items-center gap-2 hover:bg-neutral-800 px-3 py-1 rounded-full transition"
//             >
//               <span role="img" aria-label="coin">🪙</span>
//               <span className="text-sm font-medium">Nhận Xu</span>
//             </button>
//             <button
//               onClick={() => alert("Tải app!")}
//               className="flex items-center gap-2 hover:bg-neutral-800 px-3 py-1 rounded-full transition"
//             >
//               <span role="img" aria-label="app">📱</span>
//               <span className="text-sm font-medium truncate max-w-[100px]">Tải ứng dụng</span>
//             </button>
//             <div className="w-px h-6 bg-gray-500/40"></div>
//             <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-700">
//               <img
//                 src={user.avatar}
//                 alt={user.username}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>

//           {/* Comment or emo-light.png in the middle, stretches to fill */}
//           {showComment && selectedPost ? (
//             <motion.div
//               className="flex-1 min-h-0"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//             >
//               <Comment
//                 post={selectedPost}
//                 localComments={localComments[selectedPost.id] || []}
//                 onAddComment={comment => {
//                   setLocalComments(prev => ({
//                     ...prev,
//                     [selectedPost.id]: [...(prev[selectedPost.id] || []), comment],
//                   }));
//                 }}
//               />
//             </motion.div>
//           ) : (
//             <motion.div
//               className="flex flex-col items-center justify-center h-full"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               <div className="text-center text-lg animate-blink">Đây là quảng cáo</div>
//               <img
//                 src="/emo-light.png"
//                 alt="No comments"
//                 className="max-w-full max-h-full object-contain mb-4"
//               />

//             </motion.div>
//           )}

//           {/* Chat at the bottom */}
//           <div className="py-4 px-2">
//             <div className="w-full rounded-lg bg-white shadow p-4 flex items-center justify-center text-gray-700 font-semibold">
//               Chat
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HomePage;


// giữ nguyên bên phải 3 cột
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CreatePost from "../components/organisms/CreatePost";
import Feed from "../components/organisms/Feed";
import Comment from "../components/organisms/Comment";
import { useOutletContext } from "react-router-dom";
import SearchBar from "../components/molecules/SearchBar";
import FeedNav from "../components/molecules/FeedNav";

const HomePage = () => {
  const { handleNavigateToChat } = useOutletContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTab, setSelectedTab] = useState("most_recent");
  const [showComment, setShowComment] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [localComments, setLocalComments] = useState({});
  const user = { username: "User", avatar: undefined };

  const tagSuggestions = [
    { value: "stress", label: "Stress", icon: "😣", count: 42 },
    { value: "mat-ngu", label: "Mất ngủ", icon: "🌙", count: 30 },
    { value: "tram-cam", label: "Trầm cảm", icon: "😔", count: 25 },
    { value: "lo-au", label: "Lo âu", icon: "😟", count: 18 },
    { value: "tu-ky", label: "Tự kỷ", icon: "🧩", count: 10 },
    { value: "hoc-duong", label: "Học đường", icon: "🎓", count: 15 },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Left section: Expands to fill available space */}
      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar z-20 px-2">
        {/* Sticky header with FeedNav and SearchBar side by side */}
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md pb-2 pt-2 mb-2 flex items-center gap-4 shadow-sm">
          <FeedNav selected={selectedTab} onSelect={setSelectedTab} />
          <div className="flex-1 flex justify-end">
            <div className="w-full max-w-xs">
              <SearchBar
                onSearch={(searchValue, filterValue) => {
                  setSearch(searchValue);
                  setSelectedFilter(filterValue);
                }}
                tags={tagSuggestions}
                search={search}
                setSearch={setSearch}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
              />
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CreatePost />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Feed
            onNavigateToChat={handleNavigateToChat}
            search={search}
            filter={selectedFilter}
            onSelectPost={post => {
              setSelectedPost(post);
              setShowComment(true);
            }}
          />
        </motion.div>
      </div>
      {/* Right section: Fixed width (320px), hidden on mobile */}
      {!isMobile && (
        <div className="w-80 flex flex-col h-full">
          {/* Atomic action buttons group at top */}
          <div className="flex items-center bg-gray-900 dark:bg-gray-500 text-white rounded-full p-1 gap-4 mt-4 mb-2 mr-2 shadow-lg">
            <button
              onClick={() => alert("Nhận xu!")}
              className="flex items-center gap-2 hover:bg-neutral-800 px-3 py-1 rounded-full transition"
            >
              <span role="img" aria-label="coin">🪙</span>
              <span className="text-sm font-medium">Nhận Xu</span>
            </button>
            <button
              onClick={() => alert("Tải app!")}
              className="flex items-center gap-2 hover:bg-neutral-800 px-3 py-1 rounded-full transition"
            >
              <span role="img" aria-label="app">📱</span>
              <span className="text-sm font-medium truncate max-w-[100px]">Tải ứng dụng</span>
            </button>
            <div className="w-px h-6 bg-gray-500/40"></div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden bg-gray-700">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Comment or emo-light.png in the middle, stretches to fill */}
          {showComment && selectedPost ? (
            <motion.div
              className="flex-1 min-h-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Comment
                post={selectedPost}
                localComments={localComments[selectedPost.id] || []}
                onAddComment={comment => {
                  setLocalComments(prev => ({
                    ...prev,
                    [selectedPost.id]: [...(prev[selectedPost.id] || []), comment],
                  }));
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center text-lg animate-blink">Đây là quảng cáo</div>
              <img
                src="/emo-light.png"
                alt="No comments"
                className="max-w-full max-h-full object-contain mb-4"
              />
            </motion.div>
          )}

          {/* Chat at the bottom */}
          <div className="py-4 px-2">
            <div className="w-full rounded-lg bg-white shadow p-4 flex items-center justify-center text-gray-700 font-semibold">
              Chat
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;