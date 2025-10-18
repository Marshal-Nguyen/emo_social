import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Edit2,
  Heart,
  MessageCircle,
  Users,
  Calendar,
  MapPin,
  Link as LinkIcon,
  Settings,
} from "lucide-react";
import Button from "../components/atoms/Button";
import Avatar from "../components/atoms/Avatar";
import Feed from "../components/organisms/Feed";

const MobileProfilePage = ({ onBack }) => {
  const navigate = useNavigate();
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

  const tabs = [
    { id: "posts", label: "Posts", icon: MessageCircle },
    { id: "likes", label: "Likes", icon: Heart },
    { id: "followers", label: "Followers", icon: Users },
  ];


  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-[#1C1C1E] border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Profile
          </h1>
          <Button variant="ghost" size="sm" className="p-2">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <Button
          variant="ghost"
          className="absolute top-2 right-2 text-white hover:bg-white/20">
          <Edit2 className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </div>

      {/* Profile Info */}
      <div className="relative px-4 pb-4">
        {/* Avatar */}
        <div className="flex items-end justify-between -mt-12 mb-4">
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
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-[#1C1C1E] border-2 border-white dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm">
              <Edit2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* User Info */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {user.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-3 text-sm">
            {user.username}
          </p>

          <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 mb-4 text-sm">
            {user.bio}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {user.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center space-x-1">
                <LinkIcon className="w-3 h-3" />
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
              <Calendar className="w-3 h-3" />
              <span>Joined {user.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex space-x-4 mb-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-gray-900 dark:text-white">
              {user.stats.posts}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">Posts</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900 dark:text-white">
              {user.stats.followers}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900 dark:text-white">
              {user.stats.following}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">Following</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900 dark:text-white">
              {user.stats.likes}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">Likes Received</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-gray-900 dark:text-white">
              {user.stats.likesGiven}
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs">Likes Given</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
          <nav className="flex space-x-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}>
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto px-4">
        {activeTab === "posts" && (
          <div className="space-y-4">
            <Feed selectedTab="mine" />
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

    </motion.div>
  );
};

export default MobileProfilePage;
