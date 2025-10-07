import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  Heart,
  MessageCircle,
  Calendar,
  Shield,
} from "lucide-react";
import Button from "../components/atoms/Button";
import Avatar from "../components/atoms/Avatar";

const MobileProfilePage = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState("posts"); // posts, liked, stats

  // Mock user data
  const user = {
    id: "current-user",
    username: "EmoSocial User",
    email: "emo@gmail.com",
    joinDate: "2024-01-15",
    bio: "Chia sẻ cảm xúc một cách ẩn danh, tìm kiếm sự đồng cảm và hỗ trợ từ cộng đồng.",
    stats: {
      posts: 24,
      likes: 189,
      comments: 67,
      groups: 3,
    },
  };

  // Mock user posts
  const userPosts = [
    {
      id: 1,
      content:
        "Hôm nay là một ngày tốt lành. Cảm ơn mọi người đã luôn ở bên và lắng nghe.",
      createdAt: "2024-08-08T10:30:00Z",
      likesCount: 23,
      commentsCount: 8,
      isAnonymous: false,
    },
    {
      id: 2,
      content:
        "Đôi khi cảm thấy cô đơn, nhưng biết rằng có những người cùng cảm giác giúp mình bớt buồn.",
      createdAt: "2024-08-07T15:45:00Z",
      likesCount: 45,
      commentsCount: 12,
      isAnonymous: true,
    },
    {
      id: 3,
      content: "Chia sẻ một số tips giúp mình vượt qua những ngày khó khăn...",
      createdAt: "2024-08-06T09:15:00Z",
      likesCount: 67,
      commentsCount: 23,
      isAnonymous: false,
    },
  ];

  const likedPosts = [
    {
      id: 101,
      content: "Cảm ơn cộng đồng đã tạo ra một không gian an toàn để chia sẻ",
      author: "MysteriousFox42",
      createdAt: "2024-08-08T14:20:00Z",
      likesCount: 89,
      commentsCount: 15,
    },
    {
      id: 102,
      content: "Mỗi ngày là một cơ hội mới để bắt đầu lại",
      author: "GentleWolf89",
      createdAt: "2024-08-07T11:30:00Z",
      likesCount: 156,
      commentsCount: 34,
    },
  ];

  const tabs = [
    { id: "posts", label: "Bài viết", count: user.stats.posts },
    { id: "liked", label: "Đã thích", count: user.stats.likes },
    { id: "stats", label: "Thống kê", count: null },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      month: "long",
      year: "numeric",
    });
  };

  const renderPosts = (posts, showAuthor = false) => (
    <div className="space-y-4">
      {posts.map((post) => (
        <motion.div
          key={post.id}
          whileTap={{ scale: 0.98 }}
          className="bg-white dark:bg-[#1C1C1E] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              {showAuthor && (
                <>
                  <Avatar username={post.author} size="sm" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {post.author}
                  </span>
                </>
              )}
              {!showAuthor && post.isAnonymous && (
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                  Ẩn danh
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">
              {formatDate(post.createdAt)}
            </span>
          </div>

          <p className="text-gray-900 dark:text-white mb-3 leading-relaxed">
            {post.content}
          </p>

          <div className="flex items-center space-x-4 text-gray-500 text-sm">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{post.likesCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.commentsCount}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {user.stats.posts}
          </div>
          <div className="text-sm text-purple-700 dark:text-purple-300">
            Bài viết
          </div>
        </div>
        <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
            {user.stats.likes}
          </div>
          <div className="text-sm text-pink-700 dark:text-pink-300">
            Lượt thích
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {user.stats.comments}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            Bình luận
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {user.stats.groups}
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">
            Nhóm tham gia
          </div>
        </div>
      </div>

      {/* Activity Info */}
      <div className="bg-white dark:bg-[#1C1C1E] rounded-xl p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Hoạt động
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">
              Ngày tham gia
            </span>
            <span className="text-gray-900 dark:text-white flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatJoinDate(user.joinDate)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400">Safe Mode</span>
            <span className="text-green-600 dark:text-green-400 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Đang bật
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-[#1C1C1E] border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Hồ sơ
          </h1>
          <Button variant="ghost" size="sm" className="p-2">
            <Edit className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Info */}
        <div className="px-4 pb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar username={user.username} size="lg" />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.username}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            {user.bio}
          </p>

          {/* Quick Stats */}
          <div className="flex justify-around bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">
                {user.stats.posts}
              </div>
              <div className="text-xs text-gray-500">Bài viết</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">
                {user.stats.likes}
              </div>
              <div className="text-xs text-gray-500">Thích</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">
                {user.stats.comments}
              </div>
              <div className="text-xs text-gray-500">Bình luận</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">
                {user.stats.groups}
              </div>
              <div className="text-xs text-gray-500">Nhóm</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-0 bg-gray-100 dark:bg-gray-700">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 rounded-none ${activeTab === tab.id
                  ? "bg-white dark:bg-[#1C1C1E] border-b-2 border-purple-500 text-purple-600 dark:text-purple-400"
                  : "text-gray-600 dark:text-gray-400"
                }`}>
              {tab.label}
              {tab.count && (
                <span className="ml-1 text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "posts" && renderPosts(userPosts)}
        {activeTab === "liked" && renderPosts(likedPosts, true)}
        {activeTab === "stats" && renderStats()}
      </div>
    </motion.div>
  );
};

export default MobileProfilePage;
