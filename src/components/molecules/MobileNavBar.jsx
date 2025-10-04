import React from "react";
import { motion } from "framer-motion";
import { Home, MessageCircle, Bell, User, Settings, Shield } from "lucide-react";
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
      enabled: true,
    },
    {
      id: "chat",
      icon: MessageCircle,
      label: "Tin nhắn",
      badge: unreadMessages > 0 ? unreadMessages : null,
      enabled: false,
      soonLabel: "Soon",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Thông báo",
      badge: unreadNotifications > 0 ? unreadNotifications : null,
      enabled: false,
      soonLabel: "Soon",
    },
    {
      id: "profile",
      icon: User,
      label: "Cá nhân",
      badge: null,
      enabled: false,
      soonLabel: "Soon",
    },
    {
      id: "settings",
      icon: Settings,
      label: "Cài đặt",
      badge: null,
      enabled: false,
      soonLabel: "Soon",
    },
  ];


  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 md:hidden pb-safe-area-inset-bottom">
      {/* Gạch ngang phân cách */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

      <div className="flex items-center justify-around px-2 sm:px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDisabled = !item.enabled;

          return (
            <motion.div
              key={item.id}
              whileTap={isDisabled ? {} : { scale: 0.9 }}
              className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={isDisabled ? undefined : () => onTabChange?.(item.id)}
                disabled={isDisabled}
                className={`flex flex-col items-center space-y-1 p-1 sm:p-2 min-w-[50px] sm:min-w-[60px] relative ${isDisabled
                  ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600"
                  : isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-500 dark:text-gray-400"
                  }`}>
                <div className="relative">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  {item.badge && item.enabled && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center text-[8px] sm:text-[10px]">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                  {isDisabled && (
                    <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs rounded-full w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center text-[8px] sm:text-[10px]">
                      {item.soonLabel}
                    </span>
                  )}
                </div>
                <span className="text-[10px] sm:text-xs font-medium hidden sm:block">{item.label}</span>
              </Button>
              {isActive && item.enabled && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-0 right-0 mx-auto w-6 sm:w-8 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Tab Quy tắc cộng đồng ở dưới */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
        <motion.div
          whileTap={{ scale: 0.9 }}
          className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTabChange?.("community-rules")}
            className={`w-full flex items-center justify-center space-x-2 p-3 rounded-lg transition-all duration-200 ${activeTab === "community-rules"
                ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              }`}>
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Quy tắc cộng đồng</span>
          </Button>
          {activeTab === "community-rules" && (
            <motion.div
              layoutId="activeCommunityRulesTab"
              className="absolute top-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full"
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MobileNavBar;
