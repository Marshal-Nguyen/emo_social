import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CreatePost from "../components/organisms/CreatePost";
import Feed from "../components/organisms/Feed";
import Comment from "../components/organisms/Comment";
import { useOutletContext } from "react-router-dom";
import SearchInput from "../components/atoms/SearchInput";
import FilterList from "../components/molecules/FilterList";
import TagSuggestionList from "../components/molecules/TagSuggestionList";

// Custom Search Component with expandable filter
const SearchBar = ({ onSearch, tags, search, setSearch, selectedFilter, setSelectedFilter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const filterOptions = [
    { value: "all", label: "Tất cả bài viết" },
    { value: "my", label: "Bài viết của tôi" },
    { value: "liked", label: "Bài viết đã thích" },
    { value: "group", label: "Bài viết trong nhóm" },
  ];
  return (
    // <div className="fixed top-0  bg-white z-50 w-full py-2 px-16">
    <div className="relative w-full mb-4 px-16 pt-4">
      <SearchInput
        value={search}
        onChange={e => setSearch(e.target.value)}
        onClick={() => setIsExpanded(true)}
        onEnter={() => onSearch(search, selectedFilter)}
        onSearch={() => onSearch(search, selectedFilter)}
      />
      {isExpanded && (
        <div className="fixed inset-0 bg-gray-500  bg-opacity-50 dark:bg-gray-900 dark:bg-opacity-50 flex items-center justify-center z-50 ">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"
          >
            <SearchInput
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={() => { }}
              onEnter={() => onSearch(search, selectedFilter)}
              onSearch={() => onSearch(search, selectedFilter)}
            />
            <FilterList options={filterOptions} selected={selectedFilter} onSelect={setSelectedFilter} />
            <TagSuggestionList tags={tags} onSelect={setSearch} />
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
      <div className={`col-span-6 ${isMobile ? 'col-span-9' : ''} space-y-4 overflow-y-auto no-scrollbar z-20`}>
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