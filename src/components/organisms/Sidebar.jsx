import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Home, LogOut, MessageCircle, Bell, User, Settings } from "lucide-react";
import ThemeToggle from "../molecules/ThemeToggle";
import Avatar from "../atoms/Avatar";
import { logout } from "../../store/authSlice";
import LanguageSwitcher from "../molecules/LanguageSwitcher";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, onTabChange, unreadMessages, unreadNotifications }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isFirstMount } = useSelector((state) => state.auth);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { t } = useTranslation();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
    };

    const navigationItems = [
        {
            key: "home",
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
            badge: unreadMessages,
        },
        {
            key: "notifications",
            icon: Bell,
            label: t("nav.notifications"),
            gradient: "from-orange-500 to-red-600",
            bgColor: "bg-orange-100 dark:bg-orange-900/30",
            hoverBg: "group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50",
            badge: unreadNotifications,
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

    if (isMobile) return null;

    return (
        <motion.div
            initial={isFirstMount ? { x: -100, opacity: 0 } : false}
            animate={isFirstMount ? { x: 0, opacity: 1 } : false}
            transition={isFirstMount ? { duration: 0.6, ease: "easeOut" } : {}}
            className="w-80 h-screen fixed left-0 top-0 z-20"
        >
            <div className="h-full backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-r border-white/20 dark:border-gray-700/20 shadow-2xl flex flex-col">
                <div className="p-6 flex-shrink-0">
                    <motion.div
                        initial={isFirstMount ? { scale: 0.8, opacity: 0 } : false}
                        animate={isFirstMount ? { scale: 1, opacity: 1 } : false}
                        transition={isFirstMount ? { delay: 0.3, duration: 0.5 } : {}}
                        className="flex items-center space-x-3 mb-6"
                    >
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
                </div>
                <div className="flex-1 px-4 overflow-y-auto">
                    <div className="space-y-2">
                        {navigationItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.key;
                            return (
                                <motion.button
                                    key={item.key}
                                    initial={isFirstMount ? { opacity: 0, x: -20 } : false}
                                    animate={isFirstMount ? { opacity: 1, x: 0 } : false}
                                    transition={isFirstMount ? { delay: index * 0.1 + 0.4, duration: 0.4 } : {}}
                                    onClick={() => onTabChange(item.key)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${isActive
                                        ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-${item.key === "home"
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
                                        }`}
                                >
                                    {isActive && (
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-50" />
                                    )}
                                    <div
                                        className={`p-2 rounded-lg transition-all duration-300 ${isActive
                                            ? "bg-white/20 shadow-lg"
                                            : `${item.bgColor} ${item.hoverBg} shadow-md group-hover:shadow-lg group-hover:scale-105`
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="font-semibold flex-1 text-sm">{item.label}</span>
                                    {item.badge > 0 && (
                                        <motion.div
                                            initial={isFirstMount ? { scale: 0, opacity: 0 } : false}
                                            animate={isFirstMount ? { scale: 1, opacity: 1 } : false}
                                            className="relative"
                                        >
                                            <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg shadow-red-500/30">
                                                {item.badge}
                                            </div>
                                            <motion.div
                                                className="absolute inset-0 bg-red-400 rounded-full"
                                                animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        </motion.div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                    <div className="mt-8 flex justify-center">
                        <LanguageSwitcher variant="default" />
                    </div>
                </div>
                <motion.div
                    initial={isFirstMount ? { opacity: 0, y: 20 } : false}
                    animate={isFirstMount ? { opacity: 1, y: 0 } : false}
                    transition={isFirstMount ? { delay: 0.8, duration: 0.5 } : {}}
                    className="p-4 flex-shrink-0"
                >
                    <div className="backdrop-blur-xl bg-white/60 dark:bg-gray-700/60 border border-white/30 dark:border-gray-600/30 rounded-xl p-4 shadow-xl">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Avatar username={user?.username || "Anonymous"} size="md" online={true} />
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
                                    initial={isFirstMount ? { opacity: 0 } : false}
                                    animate={isFirstMount ? { opacity: 1 } : false}
                                    className="text-xs text-green-500 dark:text-green-400 flex items-center font-medium"
                                >
                                    <motion.span
                                        className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 shadow-sm"
                                        animate={{ opacity: [1, 0.3, 1] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    Online
                                </motion.p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-600/50">
                            <ThemeToggle />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-3 py-1.5 text-red-500 hover:text-red-600 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-lg transition-all duration-300 group backdrop-blur-sm shadow-sm hover:shadow-md"
                                title="Đăng xuất"
                            >
                                <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                <span className="text-xs font-semibold">Logout</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Sidebar;