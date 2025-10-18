import React from "react";
import { motion } from "framer-motion";
import { Home, Shield, Bell, User } from "lucide-react";
import Button from "../atoms/Button";
import ThemeToggle from "./ThemeToggle";

const MobileNavBar = ({
  activeTab = "home",
  onTabChange,
  unreadMessages = 0,
  unreadNotifications = 0,
}) => {
  const navItems = [
    { id: "home", icon: Home, label: "Trang chủ", enabled: true },
    { id: "profile", icon: User, label: "Hồ sơ", enabled: true },
    { id: "notifications", icon: Bell, label: "Thông báo", enabled: true },
  ];


  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1C1C1E] border-t border-gray-200 dark:border-gray-700 z-40 md:hidden pb-safe-area-inset-bottom">
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
                  {/* Notification badge */}
                  {item.id === "notifications" && unreadNotifications > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </div>
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
        {/* Theme toggle as middle icon (no Safe mode button) */}
        <div className="relative">
          <div className="flex flex-col items-center space-y-1 p-1 sm:p-2 min-w-[50px] sm:min-w-[60px]">
            <ThemeToggle showSafeToggle={false} />
          </div>
        </div>
        {/* Community rules icon on the same row */}
        <motion.div whileTap={{ scale: 0.9 }} className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTabChange?.("community-rules")}
            className={`flex flex-col items-center space-y-1 p-1 sm:p-2 min-w-[50px] sm:min-w-[60px] ${activeTab === "community-rules"
              ? "text-purple-600 dark:text-purple-400"
              : "text-gray-500 dark:text-gray-400"}`}>
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-xs font-medium hidden sm:block">Quy tắc</span>
          </Button>
          {activeTab === "community-rules" && (
            <motion.div
              layoutId="activeCommunityRulesTab"
              className="absolute top-0 left-0 right-0 mx-auto w-6 sm:w-8 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full"
            />
          )}
        </motion.div>
      </div>

    </div>
  );
};

export default MobileNavBar;
