import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Edit2,
  Settings,
  Heart,
  MessageCircle,
  Users,
  Calendar,
  MapPin,
  Link as LinkIcon,
} from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";

const DesktopProfile = () => {
  const [activeTab, setActiveTab] = useState("posts");

  const user = {
    id: 1,
    name: "Anonymous Soul",
    username: "@anonymous_soul",
    bio: "🌟 Living life one emotion at a time ✨\n💭 Sharing thoughts anonymously\n🎭 Real feelings, authentic connections",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    coverImage:
      "https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=300&q=80",
    location: "Digital Space",
    website: "anonymous-feels.com",
    joinDate: "October 2023",
    stats: {
      posts: 127,
      followers: 892,
      following: 456,
      likes: 2134,
    },
  };

  const posts = [
    {
      id: 1,
      content:
        "Sometimes the best conversations happen with strangers who understand your soul without knowing your name. 💫 #AnonymousConnections",
      timestamp: "2 hours ago",
      likes: 42,
      comments: 8,
      shares: 3,
      mood: "thoughtful",
    },
    {
      id: 2,
      content:
        "Today's mood: Coffee in one hand, dreams in the other ☕️✨ What's fueling your Monday motivation?",
      timestamp: "5 hours ago",
      likes: 76,
      comments: 15,
      shares: 5,
      mood: "energetic",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=300&q=80",
    },
    {
      id: 3,
      content:
        "Gentle reminder: Your feelings are valid, even if they don't make sense to others. 💙 #MentalHealth #SelfCare",
      timestamp: "1 day ago",
      likes: 158,
      comments: 23,
      shares: 12,
      mood: "caring",
    },
  ];

  const tabs = [
    { id: "posts", label: "Posts", icon: MessageCircle },
    { id: "likes", label: "Likes", icon: Heart },
    { id: "followers", label: "Followers", icon: Users },
  ];

  const getMoodEmoji = (mood) => {
    const moods = {
      thoughtful: "🤔",
      energetic: "⚡",
      caring: "💙",
      happy: "😊",
      sad: "😢",
      excited: "🎉",
    };
    return moods[mood] || "💭";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <Button
            variant="ghost"
            className="absolute top-4 right-4 text-white hover:bg-white/20">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Cover
          </Button>
        </div>

        {/* Profile Info */}
        <div className="relative px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-16 mb-4">
            <div className="relative">
              <Avatar
                src={user.avatar}
                size="xl"
                className="border-4 border-white dark:border-gray-800"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Edit2 className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button>
                <LinkIcon className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>

          {/* User Info */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {user.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-3">
              {user.username}
            </p>

            <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 mb-4">
              {user.bio}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <LinkIcon className="w-4 h-4" />
                <a
                  href={`https://${user.website}`}
                  className="text-blue-600 hover:underline">
                  {user.website}
                </a>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {user.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex space-x-6 mb-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">
                {user.stats.posts}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Posts</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">
                {user.stats.followers}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">
                {user.stats.following}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Following</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">
                {user.stats.likes}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Likes</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}>
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === "posts" && (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar src={user.avatar} size="sm" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {post.timestamp}
                          </span>
                          <span className="text-lg">
                            {getMoodEmoji(post.mood)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          {post.content}
                        </p>
                        {post.image && (
                          <img
                            src={post.image}
                            alt="Post content"
                            className="w-full h-48 object-cover rounded-lg mb-3"
                          />
                        )}
                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === "likes" && (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Liked Posts
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Posts you've liked will appear here.
                </p>
              </div>
            )}

            {activeTab === "followers" && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Followers
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  People following you will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopProfile;
