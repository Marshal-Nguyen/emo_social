import React, { useMemo, useState } from "react";
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
import { useSelector } from "react-redux";
import Feed from "./Feed";

const DesktopProfile = ({ onNavigateToChat }) => {
  const [activeTab, setActiveTab] = useState("posts");
  const authUser = useSelector((state) => state.auth.user);
  const allPosts = useSelector((state) => state.posts.posts);
  const totalPostsCount = useSelector((state) => state.posts.totalCount);

  const user = useMemo(() => {
    const displayName = authUser?.aliasLabel || authUser?.fullName || authUser?.username || "Anonymous";
    const joinedAt = authUser?.aliasCreatedAt ? new Date(authUser.aliasCreatedAt).toLocaleDateString() : "";
    return {
      id: authUser?.id,
      name: displayName,
      username: authUser?.aliasLabel ? `@${authUser.aliasLabel}` : (authUser?.email ? `@${(authUser.email.split("@")[0] || "user").slice(0, 20)}` : ""),
      bio: authUser?.bio || "",
      avatar: authUser?.avatarUrl || authUser?.avatar || undefined,
      coverImage: authUser?.coverImageUrl || undefined,
      location: authUser?.location || "",
      website: authUser?.website || "",
      joinDate: joinedAt,
      stats: {
        posts: authUser?.postsCount || 0,
        followers: authUser?.followers || 0,
        following: authUser?.followings || 0,
        likes: authUser?.reactionReceivedCount || 0,
        likesGiven: authUser?.reactionGivenCount || 0,
      },
    };
  }, [authUser, allPosts, totalPostsCount]);

  const posts = useMemo(() => {
    const mine = (allPosts || []).filter(p => p?.author?.id === authUser?.id);
    return mine.map(p => ({
      id: p.id,
      content: p.content || p.body || "",
      timestamp: p.createdAt ? new Date(p.createdAt).toLocaleString() : "",
      likes: p.reactionCount || p.likesCount || 0,
      comments: p.commentCount || p.commentsCount || 0,
      shares: p.shareCount || 0,
      mood: p.emotionCode || p.mood || undefined,
      image: p.imageUrl || p.mediaUrl || undefined,
    }));
  }, [allPosts, authUser]);

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
      <div className="bg-white dark:bg-[#1C1C1E] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                username={user.name}
                size="xl"
                className="border-4 border-white dark:border-gray-800"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
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
              {user.website && (
                <div className="flex items-center space-x-1">
                  <LinkIcon className="w-4 h-4" />
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline">
                    {user.website}
                  </a>
                </div>
              )}
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
              <div className="text-gray-500 dark:text-gray-400">Likes Received</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900 dark:text-white">
                {user.stats.likesGiven}
              </div>
              <div className="text-gray-500 dark:text-gray-400">Likes Given</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
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
                <Feed onNavigateToChat={onNavigateToChat} selectedTab="mine" />
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
