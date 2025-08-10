import React from "react";
import { motion } from "framer-motion";
import {
  Bell,
  Heart,
  MessageCircle,
  UserPlus,
  Settings,
  Trash2,
} from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";

const DesktopNotifications = () => {
  const notifications = [
    {
      id: 1,
      type: "like",
      user: "Dream Seeker",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      message: "đã thích bài viết của bạn",
      content: "Feeling grateful today! 🌟",
      time: "2 phút trước",
      read: false,
    },
    {
      id: 2,
      type: "comment",
      user: "Midnight Thinker",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b829?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      message: "đã bình luận về bài viết của bạn",
      content: "Amazing perspective! Keep sharing...",
      time: "5 phút trước",
      read: false,
    },
    {
      id: 3,
      type: "follow",
      user: "Happy Wanderer",
      avatar:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      message: "đã bắt đầu theo dõi bạn",
      content: null,
      time: "1 giờ trước",
      read: true,
    },
    {
      id: 4,
      type: "like",
      user: "Creative Soul",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      message: "và 3 người khác đã thích bài viết của bạn",
      content: "Just shared my latest project...",
      time: "3 giờ trước",
      read: true,
    },
    {
      id: 5,
      type: "message",
      user: "Night Owl",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      message: "đã gửi tin nhắn cho bạn",
      content: "Hey! How's your day going?",
      time: "1 ngày trước",
      read: true,
    },
  ];

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-red-500" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case "follow":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Notifications
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                Mark all as read
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 ${
                !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
              }`}>
              <div className="flex items-start space-x-3">
                <Avatar src={notification.avatar} size="sm" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getNotificationIcon(notification.type)}
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{notification.user}</span>{" "}
                        <span className="text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {notification.time}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notifications
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              When someone interacts with your posts, you'll see it here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopNotifications;
