import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CreatePost from "../components/organisms/CreatePost";
import Feed from "../components/organisms/Feed";
import { useOutletContext } from "react-router-dom";
import SearchBar from "../components/molecules/SearchBar";
import FeedNav from "../components/molecules/FeedNav";
import categories from "../data/categories.json"; // Adjust the path based on your file location

const HomePage = () => {
  const { handleNavigateToChat } = useOutletContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedTab, setSelectedTab] = useState("most_recent");
  const [anonymousPost, setAnonymousPost] = useState("");
  const [selectedMood, setSelectedMood] = useState(null);

  const tagSuggestions = [
    { value: "stress", label: "Stress", icon: "😣", count: 42 },
    { value: "mat-ngu", label: "Mất ngủ", icon: "🌙", count: 30 },
    { value: "tram-cam", label: "Trầm cảm", icon: "😔", count: 25 },
    { value: "lo-au", label: "Lo âu", icon: "😟", count: 18 },
    { value: "tu-ky", label: "Tự kỷ", icon: "🧩", count: 10 },
    { value: "hoc-duong", label: "Học đường", icon: "🎓", count: 15 },
  ];

  const quotes = [
    "Ngay cả trong đêm tối nhất, mặt trăng vẫn tỏa sáng.",
    "Mỗi ngày là một cơ hội để bắt đầu lại.",
    "Hãy mỉm cười, vì bạn xứng đáng với niềm vui.",
  ];

  const activities = [
    "Uống một cốc nước",
    "Đi bộ 5 phút",
    "Gửi tin nhắn cho một người bạn",
    "Hít thở sâu 10 lần",
    "Nghe một bài hát yêu thích",
  ];

  const moods = [
    { emoji: "😊", label: "Vui", count: 12 },
    { emoji: "😢", label: "Buồn", count: 5 },
    { emoji: "😴", label: "Mệt", count: 8 },
    { emoji: "😡", label: "Bực", count: 3 },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleAnonymousSubmit = () => {
    if (anonymousPost.trim()) {
      alert("Đã gửi ẩn danh: " + anonymousPost);
      setAnonymousPost("");
    }
  };

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
  };

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Main content */}
      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-none z-20 px-2">
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md pb-2 pt-2 mb-2 shadow-sm">
          {/* On mobile, FeedNav is above SearchBar */}
          {isMobile ? (
            <div className="flex flex-col gap-4">
              <FeedNav selected={selectedTab} onSelect={setSelectedTab} />
              <div className="w-full">
                <SearchBar
                  onSearch={(searchValue, filterValue) => {
                    setSearch(searchValue);
                    setSelectedFilters(filterValue ? [filterValue] : []);
                  }}
                  tags={tagSuggestions}
                  search={search}
                  setSearch={setSearch}
                  selectedFilter={selectedFilters}
                  setSelectedFilter={setSelectedFilters}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <FeedNav selected={selectedTab} onSelect={setSelectedTab} />
              <div className="flex-1 flex justify-end">
                <div className="w-full max-w-xs">
                  <SearchBar
                    onSearch={(searchValue, filterValue) => {
                      setSearch(searchValue);
                      setSelectedFilters(filterValue ? [filterValue] : []);
                    }}
                    tags={tagSuggestions}
                    search={search}
                    setSearch={setSearch}
                    selectedFilter={selectedFilters}
                    setSelectedFilter={setSelectedFilters}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={isMobile ? "flex justify-center" : ""}
        >
          <div className={isMobile ? "w-full max-w-md" : ""}>
            <CreatePost />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={isMobile ? "flex justify-center" : ""}
        >
          <div className={isMobile ? "w-full max-w-md" : ""}>
            <Feed
              onNavigateToChat={handleNavigateToChat}
              search={search}
              filter={selectedFilters}
            />
          </div>
        </motion.div>
      </div>
      {/* Right section: Fixed width (320px), hidden on mobile, scrollable */}
      {!isMobile && (
        <div className="w-80 flex flex-col h-full p-4 dark:from-neutral-800 dark:to-neutral-900 overflow-y-auto scrollbar-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-4 text-center"
          >
            <div className="flex items-center gap-2 mb-2 justify-center">
              <span className="text-2xl">🌟</span>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Quote hôm nay
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 italic">
              "{randomQuote}"
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌿</span>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Thử một điều nhỏ để cảm thấy tốt hơn
              </h3>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>✔ {randomActivity}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📌</span>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Lọc theo chủ đề
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleFilter(category.name)}
                  className={`flex items-center gap-2 p-2 rounded-xl dark:text-white text-sm ${selectedFilters.includes(category.name)
                    ? "bg-purple-100 dark:text-black"
                    : "bg-gray-50 dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-neutral-500"
                    } transition-colors`}
                >
                  <span>{category.icon}</span>
                  <span>{category.nameVi}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomePage;