import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CreatePost from "../components/organisms/CreatePost";
import Feed from "../components/organisms/Feed";
import Comment from "../components/organisms/Comment";
import { useOutletContext } from "react-router-dom";

// Custom Search Component with expandable filter
const SearchBar = ({ onSearch, tags, search, setSearch, selectedFilter, setSelectedFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterOptions = [
    { value: "all", label: "Tất cả bài viết" },
    { value: "my", label: "Bài viết của tôi" },
    { value: "liked", label: "Bài viết đã thích" },
    { value: "group", label: "Bài viết trong nhóm" },
  ];

  const handleSearchClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative w-full mb-4">
      <div
        className="w-full p-2 pl-4 pr-10 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 transition-all duration-300"
        onClick={handleSearchClick}
      >
        <input
          type="text"
          className="w-full outline-none bg-transparent"
          placeholder="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch(search, selectedFilter)}
        />
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800"
          onClick={() => onSearch(search, selectedFilter)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
      {isExpanded && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
          >
            <div className="mb-4">
              <input
                type="text"
                className="w-full outline-none px-3 py-2 border border-gray-300 rounded"
                placeholder="Nhập từ khóa tìm kiếm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <h4 className="text-base font-semibold mb-2">Bộ lọc</h4>
              <div className="space-y-2">
                {filterOptions.map((filter) => (
                  <button
                    key={filter.value}
                    className={`w-full text-left px-3 py-2 rounded transition border ${selectedFilter === filter.value ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-200'} hover:bg-blue-50`}
                    onClick={() => setSelectedFilter(filter.value)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h4 className="text-base font-semibold mb-2">Gợi ý tag phổ biến</h4>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <button
                    key={tag.value}
                    className="flex items-center px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-blue-50 transition shadow-sm min-w-[120px]"
                    onClick={() => setSearch(tag.label)}
                  >
                    <span className="mr-2 text-xl">{tag.icon}</span>
                    <span className="font-medium text-gray-700">{tag.label}</span>
                    <span className="ml-auto text-xs text-gray-500 bg-gray-200 rounded px-2 py-0.5">{tag.count}</span>
                  </button>
                ))}
              </div>
            </div>
            <button
              className="w-full p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              onClick={() => {
                onSearch(search, selectedFilter);
                setIsExpanded(false);
              }}
            >
              Áp dụng
            </button>
            <button
              className="mt-4 w-full p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              onClick={() => setIsExpanded(false)}
            >
              Đóng
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const HomePage = () => {
  const { handleNavigateToChat } = useOutletContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Tag suggestions (mock data)
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
    <div className="grid grid-cols-9 gap-4 h-screen">
      {/* 6-column region (spans 9 columns on mobile) */}
      <div className={`col-span-6 ${isMobile ? 'col-span-9' : ''} space-y-4 overflow-y-auto scrollbar-none z-20`}>
        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SearchBar
            onSearch={(searchValue, filterValue) => {
              setSearch(searchValue);
              setSelectedFilter(filterValue);
              console.log("Search:", searchValue, "Filter:", filterValue);
            }}
            tags={tagSuggestions}
            search={search}
            setSearch={setSearch}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        </motion.div>
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
          <Feed onNavigateToChat={handleNavigateToChat} search={search} filter={selectedFilter} />
        </motion.div>
      </div>
      {/* 3-column region (hidden on mobile) */}
      {!isMobile && (
        <div className="col-span-3 space-y-4 overflow-hidden z-20">
          <motion.div
            className="bg-red-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Comment />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomePage;