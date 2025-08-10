import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  // Mock notifications for demo
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: "success",
        title: "Chào mừng đến với EmoSocial!",
        message: "Hãy bắt đầu chia sẻ cảm xúc của bạn với cộng đồng.",
        duration: 5000,
      },
    ];

    setNotifications(mockNotifications);

    // Auto remove notifications
    mockNotifications.forEach((notification) => {
      setTimeout(() => {
        removeNotification(notification.id);
      }, notification.duration);
    });
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "info":
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200";
      case "error":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200";
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200";
      case "info":
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200";
    }
  };

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.3 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{
              opacity: 0,
              x: 300,
              scale: 0.3,
              transition: { duration: 0.2 },
            }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={`max-w-sm w-full border rounded-xl p-4 shadow-lg ${getStyles(
              notification.type
            )}`}>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">{getIcon(notification.type)}</div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium">{notification.title}</h4>
                {notification.message && (
                  <p className="text-sm opacity-90 mt-1">
                    {notification.message}
                  </p>
                )}
              </div>

              <button
                onClick={() => removeNotification(notification.id)}
                className="flex-shrink-0 rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationSystem;
