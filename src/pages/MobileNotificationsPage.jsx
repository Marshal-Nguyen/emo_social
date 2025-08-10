import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, MessageCircle, Users, Bell } from "lucide-react";
import Button from "../components/atoms/Button";
import Avatar from "../components/atoms/Avatar";

const MobileNotificationsPage = ({ onBack }) => {
  const [filter, setFilter] = useState("all"); // all, likes, comments, mentions, groups

  // Mock notifications data
  const notifications = [
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
      user: { username: "SoftRain23", isOnline: true },
      content: "đã nhắc đến bạn trong một bình luận",
      comment: "@you Bạn có thể chia sẻ kinh nghiệm không?",
      postPreview: "Cách vượt qua căng thẳng công việc...",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: 5,
      type: "like",
      user: { username: "QuietMoon88", isOnline: false },
      content: "và 5 người khác đã thích bài viết của bạn",
      postPreview: "Cảm ơn mọi người đã lắng nghe...",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      read: true,
    },
  ];

  const filters = [
    { id: "all", label: "Tất cả", icon: Bell },
    { id: "likes", label: "Lượt thích", icon: Heart },
    { id: "comments", label: "Bình luận", icon: MessageCircle },
    { id: "groups", label: "Nhóm", icon: Users },
  ];

  const getFilteredNotifications = () => {
    if (filter === "all") return notifications;
    return notifications.filter((notif) => {
      switch (filter) {
        case "likes":
          return notif.type === "like";
        case "comments":
          return notif.type === "comment" || notif.type === "mention";
        case "groups":
          return notif.type === "group_join";
        default:
          return true;
      }
    });
  };

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

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            Thông báo
          </h1>
          <Button variant="ghost" size="sm" className="text-sm text-purple-600">
            Đánh dấu đã đọc
          </Button>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {filters.map((filterItem) => {
            const Icon = filterItem.icon;
            return (
              <Button
                key={filterItem.id}
                variant={filter === filterItem.id ? "primary" : "secondary"}
                size="sm"
                onClick={() => setFilter(filterItem.id)}
                className="flex items-center space-x-2 whitespace-nowrap px-3 py-2">
                <Icon className="w-4 h-4" />
                <span>{filterItem.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {getFilteredNotifications().length === 0 ? (
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
          getFilteredNotifications().map((notification) => (
            <motion.div
              key={notification.id}
              whileTap={{ scale: 0.98 }}
              className={`flex items-start p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                !notification.read ? "bg-purple-50 dark:bg-purple-900/10" : ""
              }`}>
              <div className="relative mr-3">
                <Avatar
                  username={notification.user.username}
                  size="md"
                  online={notification.user.isOnline}
                />
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1">
                  {getNotificationIcon(notification.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-semibold">
                        {notification.user.username}
                      </span>{" "}
                      {notification.content}
                    </p>

                    {notification.comment && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
                        "{notification.comment}"
                      </p>
                    )}

                    {notification.postPreview && (
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        {notification.postPreview.length > 50
                          ? `${notification.postPreview.substring(0, 50)}...`
                          : notification.postPreview}
                      </p>
                    )}

                    {notification.groupName && (
                      <p className="text-sm text-purple-600 dark:text-purple-400 mt-1 font-medium">
                        {notification.groupName}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end ml-2">
                    <span className="text-xs text-gray-500">
                      {formatTime(notification.timestamp)}
                    </span>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1"></div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default MobileNotificationsPage;
