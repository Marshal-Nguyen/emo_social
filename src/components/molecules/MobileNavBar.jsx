import React from "react";
import { motion } from "framer-motion";
import { Home, MessageCircle, Bell, User, Settings } from "lucide-react";
import Button from "../atoms/Button";

const MobileNavBar = ({
  activeTab = "home",
  onTabChange,
  unreadMessages = 0,
  unreadNotifications = 0,
}) => {
  const navItems = [
    {
      id: "home",
      icon: Home,
      label: "Trang chủ",
      badge: null,
    },
    {
      id: "chat",
      icon: MessageCircle,
      label: "Tin nhắn",
      badge: unreadMessages > 0 ? unreadMessages : null,
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Thông báo",
      badge: unreadNotifications > 0 ? unreadNotifications : null,
    },
    {
      id: "profile",
      icon: User,
      label: "Cá nhân",
      badge: null,
    },
    {
      id: "settings",
      icon: Settings,
      label: "Cài đặt",
      badge: null,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 md:hidden pb-safe-area-inset-bottom">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.9 }}
              className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onTabChange?.(item.id)}
                className={`flex flex-col items-center space-y-1 p-2 min-w-[60px] ${isActive
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-gray-500 dark:text-gray-400"
                  }`}>
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>
              </Button>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-0 right-0 mx-auto w-8 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full"
                />

              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavBar;
