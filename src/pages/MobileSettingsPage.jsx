import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Moon,
  Sun,
  Shield,
  Bell,
  Lock,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  User,
  Eye,
  Smartphone,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../components/atoms/Button";
import { toggleTheme, toggleSafeMode } from "../store/themeSlice";
import { logout } from "../store/authSlice";

const MobileSettingsPage = ({ onBack }) => {
  const dispatch = useDispatch();
  const { isDarkMode, isSafeMode } = useSelector((state) => state.theme);
  const { user } = useSelector((state) => state.auth);

  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    messages: true,
    groups: false,
  });

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      dispatch(logout());
    }
  };

  const SettingItem = ({
    icon: Icon,
    title,
    description,
    action,
    actionType = "navigate",
    value,
  }) => {
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="flex items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
        onClick={action}>
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full mr-3">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>

        <div className="flex-1">
          <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center">
          {actionType === "toggle" && (
            <div
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                value ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
              }`}>
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  value ? "translate-x-6" : "translate-x-0"
                }`}></div>
            </div>
          )}

          {actionType === "navigate" && (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}

          {actionType === "info" && value && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {value}
            </span>
          )}
        </div>
      </motion.div>
    );
  };

  const SettingSection = ({ title, children }) => (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2">
        {title}
      </h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        {children}
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
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Cài đặt
          </h1>
          <div className="w-9"></div> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Account Section */}
        <SettingSection title="Tài khoản">
          <SettingItem
            icon={User}
            title="Thông tin cá nhân"
            description="Quản lý thông tin tài khoản của bạn"
            actionType="navigate"
            action={() => console.log("Navigate to profile edit")}
          />
          <SettingItem
            icon={Lock}
            title="Bảo mật"
            description="Đổi mật khẩu và cài đặt bảo mật"
            actionType="navigate"
            action={() => console.log("Navigate to security")}
          />
        </SettingSection>

        {/* Appearance Section */}
        <SettingSection title="Giao diện">
          <SettingItem
            icon={isDarkMode ? Sun : Moon}
            title="Chế độ tối"
            description="Bật/tắt chế độ tối cho ứng dụng"
            actionType="toggle"
            value={isDarkMode}
            action={() => dispatch(toggleTheme())}
          />
          <SettingItem
            icon={Shield}
            title="Safe Mode"
            description="Ẩn nội dung có thể nhạy cảm"
            actionType="toggle"
            value={isSafeMode}
            action={() => dispatch(toggleSafeMode())}
          />
          <SettingItem
            icon={Eye}
            title="Hiển thị"
            description="Tùy chỉnh cách hiển thị nội dung"
            actionType="navigate"
            action={() => console.log("Navigate to display settings")}
          />
        </SettingSection>

        {/* Privacy Section */}
        <SettingSection title="Quyền riêng tư">
          <SettingItem
            icon={Globe}
            title="Quyền riêng tư"
            description="Quản lý ai có thể xem nội dung của bạn"
            actionType="navigate"
            action={() => console.log("Navigate to privacy")}
          />
          <SettingItem
            icon={Bell}
            title="Thông báo"
            description="Quản lý thông báo và âm thanh"
            actionType="navigate"
            action={() => console.log("Navigate to notifications")}
          />
        </SettingSection>

        {/* App Section */}
        <SettingSection title="Ứng dụng">
          <SettingItem
            icon={Smartphone}
            title="Phiên bản ứng dụng"
            description="Kiểm tra cập nhật và thông tin phiên bản"
            actionType="info"
            value="v1.0.0"
            action={() => console.log("Check for updates")}
          />
          <SettingItem
            icon={HelpCircle}
            title="Trợ giúp & Hỗ trợ"
            description="Tìm hiểu cách sử dụng và nhận trợ giúp"
            actionType="navigate"
            action={() => console.log("Navigate to help")}
          />
        </SettingSection>

        {/* Account Actions */}
        <SettingSection title="Hành động">
          <motion.div
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg cursor-pointer"
            onClick={handleLogout}>
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full mr-3">
              <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-red-600 dark:text-red-400">
                Đăng xuất
              </h3>
              <p className="text-sm text-red-500 dark:text-red-400 mt-1">
                Đăng xuất khỏi tài khoản hiện tại
              </p>
            </div>

            <ChevronRight className="w-5 h-5 text-red-400" />
          </motion.div>
        </SettingSection>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 pb-4">
          <p>EmoSocial v1.0.0</p>
          <p className="mt-1">Nền tảng chia sẻ cảm xúc ẩn danh</p>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileSettingsPage;
