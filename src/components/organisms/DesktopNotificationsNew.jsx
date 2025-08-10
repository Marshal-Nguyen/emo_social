import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Bell, Heart, MessageCircle, Users, Check, Filter } from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";

const DesktopNotificationsNew = () => {
  const notifications = useSelector((state) => state.chat?.notifications || []);
  const [filter, setFilter] = useState("all");

  // Filter options for notifications
  const filters = [
    { id: "all", label: "Tất cả", icon: Bell },
    { id: "like", label: "Lượt thích", icon: Heart },
    { id: "comment", label: "Bình luận", icon: MessageCircle },
    { id: "group", label: "Nhóm", icon: Users },
  ];

  // Filter notifications based on selected filter
  const getFilteredNotifications = () => {
    // Use mock data for demonstration since notifications aren't implemented in Redux yet
    const mockNotifications = [
      {
        id: 1,
        type: "like",
        user: { username: "MysteriousFox42", isOnline: true },
        content: "đã thích bài viết của bạn",
        postPreview: "Hôm nay cảm thấy khá buồn vì công việc...",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: 2,
        type: "comment",
        user: { username: "GentleWolf89", isOnline: false },
        content: "đã bình luận về bài viết của bạn",
        comment: "Mình cũng vậy, cùng nhau vượt qua nhé! 💪",
        postPreview: "Hôm nay cảm thấy khá buồn vì công việc...",
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: 3,
        type: "group_join",
        user: { username: "CalmButterfly12", isOnline: true },
        content: 'đã tham gia nhóm "Hỗ trợ tâm lý 💙"',
        groupName: "Hỗ trợ tâm lý 💙",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
      {
        id: 4,
        type: "mention",
        user: { username: "QuietOwl77", isOnline: true },
        content: "đã nhắc đến bạn trong một bình luận",
        comment: "@user Bạn có thể chia sẻ thêm không?",
        postPreview: "Làm thế nào để vượt qua stress...",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
      },
    ];

    // If we have notifications from Redux, use them, otherwise use mock data
    const notificationsToFilter =
      notifications.length > 0 ? notifications : mockNotifications;

    switch (filter) {
      case "like":
        return notificationsToFilter.filter((n) => n.type === "like");
      case "comment":
        return notificationsToFilter.filter(
          (n) => n.type === "comment" || n.type === "mention"
        );
      case "group":
        return notificationsToFilter.filter((n) => n.type === "group_join");
      default:
        return notificationsToFilter;
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-red-500" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "mention":
        return <MessageCircle className="w-4 h-4 text-purple-500" />;
      case "group_join":
        return <Users className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = (now - time) / (1000 * 60);

    if (diffInMinutes < 60) {
      return `${Math.floor(diffInMinutes)} phút trước`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
      return `${Math.floor(diffInMinutes / (24 * 60))} ngày trước`;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = filteredNotifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Thông báo
              </h1>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm">
                  <Check className="w-4 h-4 mr-2" />
                  Đánh dấu tất cả đã đọc
                </Button>
              )}
            </div>
          </div>

          {/* Filter buttons */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filters.map((filterItem) => {
              const Icon = filterItem.icon;
              return (
                <Button
                  key={filterItem.id}
                  variant={filter === filterItem.id ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setFilter(filterItem.id)}
                  className="flex items-center space-x-2 whitespace-nowrap px-4 py-2">
                  <Icon className="w-4 h-4" />
                  <span>{filterItem.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Không có thông báo
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Khi có thông báo mới, chúng sẽ xuất hiện ở đây
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${
                  !notification.read
                    ? "bg-purple-50/50 dark:bg-purple-900/10"
                    : ""
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}>
                <div className="flex items-start space-x-4">
                  <div className="relative flex-shrink-0">
                    <Avatar
                      username={notification.user.username}
                      size="md"
                      className="w-12 h-12"
                      online={notification.user.isOnline}
                    />
                    <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1 border-2 border-white dark:border-gray-800">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <p className="text-sm text-gray-900 dark:text-white">
                          <span className="font-semibold">
                            {notification.user.username}
                          </span>
                          <span className="ml-1">{notification.content}</span>
                        </p>

                        {notification.comment && (
                          <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              "{notification.comment}"
                            </p>
                          </div>
                        )}

                        {notification.postPreview && (
                          <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {notification.postPreview.length > 80
                                ? `"${notification.postPreview.substring(
                                    0,
                                    80
                                  )}..."`
                                : `"${notification.postPreview}"`}
                            </p>
                          </div>
                        )}

                        {notification.groupName && (
                          <p className="text-sm text-purple-600 dark:text-purple-400 mt-2 font-medium">
                            {notification.groupName}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>

                      {!notification.read && (
                        <div className="ml-2 w-2 h-2 bg-purple-500 rounded-full mt-1 flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopNotificationsNew;
