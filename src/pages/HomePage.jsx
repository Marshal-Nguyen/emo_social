import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CreatePost from "../components/organisms/CreatePost";
import Feed from "../components/organisms/Feed";
import { useOutletContext } from "react-router-dom";
import SearchBar from "../components/molecules/SearchBar";
import FeedNav from "../components/molecules/FeedNav";
import tagCategoryData from "../data/tagCategory.json"; // Use tagCategory.json instead
import { getUnicodeEmoji } from "../utils/tagHelpers";

const HomePage = () => {
  const { handleNavigateToChat } = useOutletContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Single category selection
  const [selectedTab, setSelectedTab] = useState("feed");
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
    const handleSelectCategory = (e) => {
      try {
        const { categoryId } = e.detail || {};
        if (!categoryId) return;

        // Mapping ID mới từ API với ID cũ trong JSON (theo thứ tự)
        const API_ID_MAPPING = {
          "772eec7e-55f7-4729-b6d1-c99d9d21fe2b": 0, // relationships
          "f2ad307c-d771-4c09-98f3-13691c51d6da": 1, // family
          "8bc81ddd-66e6-4dfc-bfc4-7fd87ca10b5c": 2, // habits
          "7f6569b0-b1fe-4c0b-b8bc-fed8aabb10d4": 3, // friends
          "3ab22d69-183d-4f21-b866-c81b7433f6d1": 4, // hopes
          "69a318c3-6a0c-41a2-941b-56b8e4d65e31": 5, // bullying
          "de70373a-5070-4556-afa5-611689b52d8a": 6, // health
          "0cc7adc5-b40b-433c-8513-642b5289eff0": 7, // work
          "e7b0476a-714a-4d41-892c-e83d8f819263": 8, // music
          "7bfc4693-ec77-4e05-9d21-79d7ae000e69": 9, // helpful tips
          "294bff61-5f42-48de-b514-96988e25fe84": 10, // parenting
          "dbe2fe15-bc5e-4a7d-ac87-23692aa1fc80": 11, // education
          "79e84978-886f-47ef-a724-ee5d990cb4dd": 12, // religion
          "b7b48afe-4300-43a4-8748-530a8b493565": 13, // lgbtq
          "e8dcb402-e04f-4a84-882f-883b6c05bdc1": 14, // pregnancy
          "357a2878-c0a6-4f65-be7d-8bc23cf391af": 15, // positive
          "a12a2d6d-5984-4858-a055-aec62c6e3550": 16, // wellbeing
          "e88d107a-86b1-495c-869c-d1e2d1c28831": 17, // my story
        };

        const allCategories = Array.isArray(tagCategoryData?.categoryTags) ? tagCategoryData.categoryTags : [];

        // Thử tìm trực tiếp trước
        let found = allCategories.find((c) => c.id === categoryId);

        // Nếu không tìm thấy, thử mapping với ID mới
        if (!found) {
          const mappedIndex = API_ID_MAPPING[categoryId];
          if (mappedIndex !== undefined && allCategories[mappedIndex]) {
            found = allCategories[mappedIndex];
          }
        }

        setSelectedCategory(found || null);
        setSelectedTab("feed");
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch { }
      } catch { }
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("app:selectCategory", handleSelectCategory);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("app:selectCategory", handleSelectCategory);
    };
  }, []);

  const handleAnonymousSubmit = () => {
    if (anonymousPost.trim()) {
      alert("Đã gửi ẩn danh: " + anonymousPost);
      setAnonymousPost("");
    }
  };

  // Helper function để so sánh category (xử lý ID khác nhau)
  const isSameCategory = (cat1, cat2) => {
    if (!cat1 || !cat2) return false;

    // So sánh trực tiếp ID trước
    if (cat1.id === cat2.id) return true;

    // Mapping ID mới từ API với ID cũ trong JSON
    const API_ID_MAPPING = {
      "772eec7e-55f7-4729-b6d1-c99d9d21fe2b": 0, // relationships
      "f2ad307c-d771-4c09-98f3-13691c51d6da": 1, // family
      "8bc81ddd-66e6-4dfc-bfc4-7fd87ca10b5c": 2, // habits
      "7f6569b0-b1fe-4c0b-b8bc-fed8aabb10d4": 3, // friends
      "3ab22d69-183d-4f21-b866-c81b7433f6d1": 4, // hopes
      "69a318c3-6a0c-41a2-941b-56b8e4d65e31": 5, // bullying
      "de70373a-5070-4556-afa5-611689b52d8a": 6, // health
      "0cc7adc5-b40b-433c-8513-642b5289eff0": 7, // work
      "e7b0476a-714a-4d41-892c-e83d8f819263": 8, // music
      "7bfc4693-ec77-4e05-9d21-79d7ae000e69": 9, // helpful tips
      "294bff61-5f42-48de-b514-96988e25fe84": 10, // parenting
      "dbe2fe15-bc5e-4a7d-ac87-23692aa1fc80": 11, // education
      "79e84978-886f-47ef-a724-ee5d990cb4dd": 12, // religion
      "b7b48afe-4300-43a4-8748-530a8b493565": 13, // lgbtq
      "e8dcb402-e04f-4a84-882f-883b6c05bdc1": 14, // pregnancy
      "357a2878-c0a6-4f65-be7d-8bc23cf391af": 15, // positive
      "a12a2d6d-5984-4858-a055-aec62c6e3550": 16, // wellbeing
      "e88d107a-86b1-495c-869c-d1e2d1c28831": 17, // my story
    };

    // Kiểm tra xem có phải cùng một category không dựa trên mapping
    const allCategories = Array.isArray(tagCategoryData?.categoryTags) ? tagCategoryData.categoryTags : [];
    const cat1Index = allCategories.findIndex(c => c.id === cat1.id);
    const cat2Index = allCategories.findIndex(c => c.id === cat2.id);

    // Nếu cả hai đều có trong JSON và cùng index
    if (cat1Index !== -1 && cat2Index !== -1 && cat1Index === cat2Index) return true;

    // Kiểm tra mapping với API ID
    const cat1MappedIndex = API_ID_MAPPING[cat1.id];
    const cat2MappedIndex = API_ID_MAPPING[cat2.id];

    if (cat1MappedIndex !== undefined && cat2MappedIndex !== undefined && cat1MappedIndex === cat2MappedIndex) return true;

    // Kiểm tra nếu một là API ID và một là JSON ID
    if (cat1MappedIndex !== undefined && cat2Index !== -1 && cat1MappedIndex === cat2Index) return true;
    if (cat2MappedIndex !== undefined && cat1Index !== -1 && cat2MappedIndex === cat1Index) return true;

    return false;
  };

  const toggleFilter = (category) => {
    // Single category selection - toggle on/off
    if (selectedCategory && isSameCategory(selectedCategory, category)) {
      setSelectedCategory(null); // Deselect if same category clicked
    } else {
      setSelectedCategory(category); // Select new category
    }
  };

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];

  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Main content */}
      <div className="flex-1 space-y-3 sm:space-y-4 overflow-y-auto scrollbar-none z-20 px-1 sm:px-2">
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md pb-2 pt-2 mb-2 shadow-sm">
          {/* On mobile, FeedNav is above SearchBar */}
          {isMobile ? (
            <div className="flex flex-col gap-3 sm:gap-4">
              <FeedNav selected={selectedTab} onSelect={setSelectedTab} />
              {/* <div className="w-full">
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
              </div> */}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <FeedNav selected={selectedTab} onSelect={setSelectedTab} />
              {/* <div className="flex-1 flex justify-end">
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
              </div> */}
            </div>
          )}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={isMobile ? "flex justify-center" : ""}
        >
          {selectedTab !== "mine" && (
            <div
              className={`${isMobile ? "w-full max-w-sm sm:max-w-md" : ""} border-2 border-purple-200 rounded-2xl`}
            >
              <CreatePost />
            </div>

          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={isMobile ? "flex justify-center" : ""}
        >
          <div className={isMobile ? "w-full max-w-sm sm:max-w-md" : ""}>
            <Feed
              onNavigateToChat={handleNavigateToChat}
              search={search}
              filter={selectedFilters}
              selectedCategory={selectedCategory}
              selectedTab={selectedTab}
            />
          </div>
        </motion.div>
      </div>
      {/* Right section: always reserve width; when tab is "Của tôi" show a blank placeholder */}
      {!isMobile && (
        <div className="w-80 flex flex-col h-full p-4 dark:from-neutral-800 dark:to-neutral-900 overflow-y-auto scrollbar-none">
          {selectedTab === "mine" ? (
            <div className="flex-1 bg-white dark:bg-[#1C1C1E] rounded-2xl" />
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-lg p-4 mb-4 text-center"
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
                className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-lg p-4 mb-4"
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
                className="bg-white dark:bg-[#1C1C1E] rounded-2xl shadow-lg p-4 mb-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">📌</span>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Lọc theo chủ đề
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {tagCategoryData.categoryTags.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => toggleFilter(category)}
                      className={`flex items-center gap-2 p-2 rounded-xl dark:text-white text-sm ${selectedCategory && isSameCategory(selectedCategory, category)
                        ? "bg-purple-100 dark:bg-purple-500 dark:text-black"
                        : "bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-500"
                        } transition-colors`}
                    >
                      <span>{getUnicodeEmoji(category.unicodeCodepoint)}</span>
                      <span>{category.displayNameVi || category.displayName}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;