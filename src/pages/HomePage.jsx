import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Bell,
  User,
  Settings,
  Home,
  LogOut,
  Sparkles,
  Shield,
} from "lucide-react";
import CreatePost from "../components/organisms/CreatePost";
import Feed from "../components/organisms/Feed";
import ChatSidebar from "../components/organisms/ChatSidebar";
import MobileNavBar from "../components/molecules/MobileNavBar";
import ThemeToggle from "../components/molecules/ThemeToggle";
import Avatar from "../components/atoms/Avatar";
import { logout } from "../store/authSlice";
import LanguageSwitcher from "../components/molecules/LanguageSwitcher";

// Mobile Pages
import MobileChatPage from "./MobileChatPage";
import MobileNotificationsPage from "./MobileNotificationsPage";
import MobileProfilePage from "./MobileProfilePage";
import MobileSettingsPage from "./MobileSettingsPage";

// Desktop Pages
import DesktopChatSimple from "../components/organisms/DesktopChatSimple";
import DesktopNotificationsNew from "../components/organisms/DesktopNotificationsNew";
import DesktopProfile from "../components/organisms/DesktopProfile";
import DesktopSettings from "../components/organisms/DesktopSettings";

const HomePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isSafeMode } = useSelector((state) => state.theme);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home"); // Mobile navigation
  const [activeView, setActiveView] = useState("feed"); // Desktop navigation
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // Get data from Redux for consistent counts
  const storeConversations = useSelector(
    (state) => state.chat.conversations || []
  );

  // Calculate unread counts from actual data
  const mockConversations = [
    { id: "dm_1", unreadCount: 2 },
    { id: "group_1", unreadCount: 5 },
  ];

  const totalUnreadMessages = mockConversations.reduce(
    (total, conv) => total + conv.unreadCount,
    0
  );
  const unreadNotificationsCount = 2; // Based on notifications data

  // Listen for window resize to determine mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Reset states when switching between mobile/desktop
      if (mobile) {
        setIsChatOpen(false);
        setActiveView("feed");
      } else {
        setActiveTab("home");
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavigateToChat = (conversationId = null) => {
    console.log("Navigate to chat called:", { conversationId, isMobile });
    setSelectedConversationId(conversationId);
    if (isMobile) {
      // Mobile: use activeTab for bottom navigation
      setActiveTab("chat");
    } else {
      // Desktop: use activeView for sidebar navigation
      setActiveView("chat");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset selectedConversationId when manually changing to chat tab
    if (tab === "chat") {
      setSelectedConversationId(null);
    }
  };

  const handleBackToHome = () => {
    setActiveTab("home");
    // Reset selectedConversationId when going back to home
    setSelectedConversationId(null);
  };

  const handleDesktopNavigation = (view) => {
    setActiveView(view);
    setIsChatOpen(false); // Close chat when switching views
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // i18n
  const { t } = useTranslation();
  // Navigation items configuration
  const navigationItems = [
    {
      key: "feed",
      icon: Home,
      label: t("nav.home"),
      gradient: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      hoverBg: "group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50",
    },
    {
      key: "chat",
      icon: MessageCircle,
      label: t("nav.chat"),
      gradient: "from-blue-500 to-cyan-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      hoverBg: "group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50",
      badge: totalUnreadMessages,
    },
    {
      key: "notifications",
      icon: Bell,
      label: t("nav.notifications"),
      gradient: "from-orange-500 to-red-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      hoverBg: "group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50",
      badge: unreadNotificationsCount,
    },
    {
      key: "profile",
      icon: User,
      label: t("nav.profile"),
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      hoverBg: "group-hover:bg-green-200 dark:group-hover:bg-green-900/50",
    },
    {
      key: "settings",
      icon: Settings,
      label: t("nav.settings"),
      gradient: "from-gray-500 to-slate-600",
      bgColor: "bg-gray-100 dark:bg-gray-700/30",
      hoverBg: "group-hover:bg-gray-200 dark:group-hover:bg-gray-700/50",
    },
  ];

  // Mobile: Show different pages based on active tab
  if (isMobile && activeTab !== "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
        {/* Mobile content area - takes remaining space above nav */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "chat" && (
            <MobileChatPage
              onBack={handleBackToHome}
              selectedConversationId={selectedConversationId}
            />
          )}
          {activeTab === "notifications" && (
            <MobileNotificationsPage onBack={handleBackToHome} />
          )}
          {activeTab === "profile" && (
            <MobileProfilePage onBack={handleBackToHome} />
          )}
          {activeTab === "settings" && (
            <MobileSettingsPage onBack={handleBackToHome} />
          )}
        </div>

        {/* Mobile Navigation Bar - Always visible and fixed */}
        <MobileNavBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          unreadMessages={totalUnreadMessages}
          unreadNotifications={unreadNotificationsCount}
        />
      </div>
    );
  }

  // Desktop/Mobile Home View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pb-16 md:pb-0 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 -right-32 w-96 h-96 bg-gradient-to-r from-blue-200 to-cyan-200 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full filter blur-3xl opacity-30"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 180, 90],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-32 left-1/2 w-96 h-96 bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full filter blur-3xl opacity-30"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [180, 270, 180],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="flex relative z-10">
        {/* Desktop Sidebar Navigation - Only visible on desktop */}
        {!isMobile && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-80 h-screen fixed left-0 top-0 z-20">
            {/* Glassmorphism Sidebar */}
            <div className="h-full backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-r border-white/20 dark:border-gray-700/20 shadow-2xl flex flex-col">
              {/* Header Section in Sidebar */}
              <div className="p-6 flex-shrink-0">
                {/* Logo Section with enhanced styling */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="flex items-center space-x-3 mb-6">
                  <div className="relative group">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105">
                      <span className="text-white font-bold text-lg">ES</span>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                      EmoSocial
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Social Network
                    </p>
                  </div>
                </motion.div>

                {/* Enhanced Safe Mode Indicator */}
                {/* <AnimatePresence>
                  {isSafeMode && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      transition={{ duration: 0.4 }}
                      className="relative overflow-hidden bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-green-900/30 border border-green-200/50 dark:border-green-700/50 px-4 py-3 rounded-xl mb-6 shadow-lg shadow-green-500/10">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-400/5 dark:to-emerald-400/5" />
                      <div className="relative flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 rounded-lg flex items-center justify-center shadow-md">
                          <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-1">
                            <span className="text-green-700 dark:text-green-300 text-xs font-semibold">
                              Safe Mode Active
                            </span>
                            <Sparkles className="w-3 h-3 text-green-500 animate-pulse" />
                          </div>
                          <p className="text-green-600 dark:text-green-400 text-xs font-medium">
                            Protected browsing
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence> */}
              </div>

              {/* Enhanced Navigation Items - Scrollable if needed */}
              <div className="flex-1 px-4 overflow-y-auto">
                <div className="space-y-2">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.key;

                    return (
                      <motion.button
                        key={item.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.4, duration: 0.4 }}
                        onClick={() => handleDesktopNavigation(item.key)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${
                          isActive
                            ? `bg-gradient-to-r ${
                                item.gradient
                              } text-white shadow-lg shadow-${
                                item.key === "feed"
                                  ? "purple"
                                  : item.key === "chat"
                                  ? "blue"
                                  : item.key === "notifications"
                                  ? "orange"
                                  : item.key === "profile"
                                  ? "green"
                                  : "gray"
                              }-500/25 transform scale-[1.02]`
                            : "text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:shadow-lg hover:scale-[1.01] backdrop-blur-sm"
                        }`}>
                        {/* Background glow effect for active state */}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-50" />
                        )}

                        <div
                          className={`p-2 rounded-lg transition-all duration-300 ${
                            isActive
                              ? "bg-white/20 shadow-lg"
                              : `${item.bgColor} ${item.hoverBg} shadow-md group-hover:shadow-lg group-hover:scale-105`
                          }`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <span className="font-semibold flex-1 text-sm">
                          {item.label}
                        </span>

                        {/* Enhanced unread badge */}
                        <AnimatePresence>
                          {item.badge > 0 && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="relative">
                              <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-red-500/30">
                                {item.badge}
                              </div>
                              <motion.div
                                className="absolute inset-0 bg-red-400 rounded-full"
                                animate={{
                                  scale: [1, 1.4, 1],
                                  opacity: [0.7, 0, 0.7],
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.button>
                    );
                  })}
                </div>
                {/* Language Switcher Desktop */}
                <div className="mt-8 flex justify-center">
                  <LanguageSwitcher variant="default" />
                </div>
              </div>

              {/* Enhanced User Profile Section - Fixed at bottom */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="p-4 flex-shrink-0">
                <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-700/60 border border-white/30 dark:border-gray-600/30 rounded-xl p-4 shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar
                        username={user?.username || "Anonymous"}
                        size="md"
                        online={true}
                      />
                      <motion.div
                        className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {user?.username || "Anonymous User"}
                      </p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-green-500 dark:text-green-400 flex items-center font-medium">
                        <motion.span
                          className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 shadow-sm"
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        Online
                      </motion.p>
                    </div>
                  </div>

                  {/* Enhanced Quick Actions */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-600/50">
                    <ThemeToggle />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-3 py-1.5 text-red-500 hover:text-red-600 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 group backdrop-blur-sm shadow-sm hover:shadow-md"
                      title="Đăng xuất">
                      <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-xs font-semibold">Logout</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Main Content Area */}
        <div className={`flex-1 ${!isMobile ? "ml-80" : ""} relative z-10`}>
          {/* Desktop Content Views */}
          {!isMobile && activeView !== "feed" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8">
              {activeView === "chat" && (
                <DesktopChatSimple
                  selectedConversationId={selectedConversationId}
                />
              )}
              {activeView === "notifications" && <DesktopNotificationsNew />}
              {activeView === "profile" && <DesktopProfile />}
              {activeView === "settings" && <DesktopSettings />}
            </motion.div>
          )}

          {/* Feed View (Mobile always, Desktop when activeView === "feed") */}
          {(isMobile || (!isMobile && activeView === "feed")) && (
            <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Create Post */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}>
                  <CreatePost />
                </motion.div>

                {/* Feed */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}>
                  <Feed onNavigateToChat={handleNavigateToChat} />
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Sidebar - Desktop only */}
      <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Mobile Navigation Bar - Only show on mobile home */}
      {isMobile && (
        <MobileNavBar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          unreadMessages={totalUnreadMessages}
          unreadNotifications={unreadNotificationsCount}
        />
      )}
    </div>
  );
};

export default HomePage;
