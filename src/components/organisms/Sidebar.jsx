import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Home, LogOut, MessageCircle, Bell, User, Settings, Smile, ChevronLeft, ChevronRight, Leaf, Shield } from "lucide-react";

import ThemeToggle from "../molecules/ThemeToggle";
import Avatar from "../atoms/Avatar";
import { logout } from "../../store/authSlice";
import LanguageSwitcher from "../molecules/LanguageSwitcher";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, onTabChange, unreadMessages, unreadNotifications, onCollapseChange }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isFirstMount } = useSelector((state) => state.auth);
    const { t } = useTranslation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleCollapse = () => {
        setIsCollapsed((prev) => {
            onCollapseChange(!prev);
            return !prev;
        });
    };

    const navigationItems = [
        { key: "home", icon: Home, label: t("nav.home"), gradient: "from-indigo-500 to-purple-600", textColor: "text-indigo-600 dark:text-indigo-400", bgColor: "bg-indigo-100 dark:bg-indigo-900/30", hoverBg: "group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50", enabled: true },
        // { key: "chat", icon: MessageCircle, label: t("nav.chat"), gradient: "from-blue-500 to-cyan-600", textColor: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-100 dark:bg-blue-900/30", hoverBg: "group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50", badge: unreadMessages, enabled: false, soonLabel: "Soon" },
        // { key: "notifications", icon: Bell, label: t("nav.notifications"), gradient: "from-orange-500 to-red-600", textColor: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-100 dark:bg-orange-900/30", hoverBg: "group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50", badge: unreadNotifications, enabled: false, soonLabel: "Soon" },
        { key: "profile", icon: User, label: t("nav.profile"), gradient: "from-green-500 to-emerald-600", textColor: "text-green-600 dark:text-green-400", bgColor: "bg-green-100 dark:bg-green-900/30", hoverBg: "group-hover:bg-green-200 dark:group-hover:bg-green-900/50", enabled: true },
        // { key: "wellness-hub", icon: Leaf, label: t("nav.wellness-hub"), gradient: "from-gray-500 to-slate-600", textColor: "text-gray-600 dark:text-gray-400", bgColor: "bg-gray-100 dark:bg-gray-700/30", hoverBg: "group-hover:bg-gray-200 dark:group-hover:bg-gray-700/50", enabled: false, soonLabel: "Soon" },
        // { key: "settings", icon: Settings, label: t("nav.settings"), gradient: "from-gray-500 to-slate-600", textColor: "text-gray-600 dark:text-gray-400", bgColor: "bg-gray-100 dark:bg-gray-700/30", hoverBg: "group-hover:bg-gray-200 dark:group-hover:bg-gray-700/50", enabled: false, soonLabel: "Soon" },
        // { key: "icons", icon: Smile, label: t("nav.icons"), gradient: "from-red-500 to-slate-600", textColor: "text-red-600 dark:text-red-400", bgColor: "bg-red-100 dark:bg-red-700/30", hoverBg: "group-hover:bg-red-200 dark:group-hover:bg-red-700/50", enabled: false, soonLabel: "Soon" },
    ];

    const communityRulesItem = {
        key: "community-rules",
        icon: Shield,
        label: "Quy tắc cộng đồng",
        gradient: "from-purple-500 to-pink-600",
        textColor: "text-purple-600 dark:text-purple-400",
        bgColor: "bg-purple-100 dark:bg-purple-900/30",
        hoverBg: "group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50",
        enabled: true
    };


    if (isMobile) return null;

    const buttonStyles = "w-full flex items-center rounded-xl transition-all duration-300 group relative overflow-hidden";
    const hoverStyles = "text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:scale-[1.01] backdrop-blur-sm";
    const iconStyles = (item, isActive) => `p-2 rounded-lg transition-all duration-300 ${isActive ? item.bgColor : item.hoverBg} group-hover:scale-105`;

    return (
        <motion.div
            initial={isFirstMount ? { x: -100, opacity: 0 } : false}
            animate={{ x: 0, opacity: 1, width: isCollapsed ? 80 : 320 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-screen fixed left-0 top-0 z-20 "
        >
            <div className="h-full backdrop-blur-xl dark:bg-black flex flex-col">
                <div className="p-2 flex-shrink-0 relative">
                    {isCollapsed ? (
                        <motion.div
                            initial={isFirstMount ? { scale: 0.8, opacity: 0 } : false}
                            animate={isFirstMount ? { scale: 1, opacity: 1 } : false}
                            transition={isFirstMount ? { delay: 0.3, duration: 0.5 } : {}}
                            className="flex flex-col items-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleCollapse}
                                className="w-full flex items-center justify-center rounded-lg transition-all duration-300 group relative overflow-hidden text-gray-700 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/50 hover:scale-[1.01] backdrop-blur-sm"
                                title="Mở rộng"
                            >
                                <div className="p-2 rounded-lg transition-all duration-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-700/50 group-hover:scale-105">
                                    <ChevronRight className="w-5 h-5" />
                                </div>
                            </motion.button>
                            <div className="relative group mb-2">
                                <img
                                    src="./emo-qc-d.png"
                                    alt="Emo QC"
                                    onClick={() => navigate("/home")}
                                    className="w-14 h-14 rounded-2xl object-cover transition-all duration-300 group-hover:scale-105 shadow-lg dark:bg-gray-600"
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={isFirstMount ? { scale: 0.8, opacity: 0 } : false}
                            animate={isFirstMount ? { scale: 1, opacity: 1 } : false}
                            transition={isFirstMount ? { delay: 0.3, duration: 0.5 } : {}}
                            className="flex flex-col items-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleCollapse}
                                className="absolute top-2 right-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                                title="Thu gọn"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </motion.button>
                            <div className="relative group mb-2">
                                <img
                                    src="./emo-qc-d.png"
                                    alt="Emo QC"
                                    className="w-32 h-32 rounded-2xl object-cover transition-all duration-300 group-hover:scale-105 shadow-lg dark:bg-gray-600"
                                />
                            </div>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent">
                                    EmoSocial
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Mental Social Network</p>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="flex-1 px-4 overflow-y-auto scrollbar-none">
                    <div className="space-y-2">
                        {navigationItems.map((item, index) => {
                            const Icon = item.icon;
                            const isActive = location.pathname.startsWith(`/${item.key}`);
                            const isDisabled = !item.enabled;
                            return (
                                <motion.button
                                    key={item.key}
                                    initial={isFirstMount ? { opacity: 0, x: -20 } : false}
                                    animate={isFirstMount ? { opacity: 1, x: 0 } : false}
                                    transition={isFirstMount ? { delay: index * 0.1 + 0.4, duration: 0.4 } : {}}
                                    onClick={isDisabled ? undefined : () => onTabChange(item.key)}
                                    disabled={isDisabled}
                                    className={`${buttonStyles} ${isCollapsed ? "justify-center" : "space-x-3 px-4"} py-3 text-left ${isDisabled
                                        ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600"
                                        : isActive
                                            ? `${item.textColor} transform scale-[1.02]`
                                            : hoverStyles
                                        }`}
                                >
                                    {isActive && item.enabled && <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-50" />}
                                    <div className={`${iconStyles(item, isActive)} ${isDisabled ? "opacity-50" : ""}`}>
                                        <Icon className="w-5 h-5" />
                                        {isDisabled && (
                                            <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[8px]">
                                                {item.soonLabel}
                                            </span>
                                        )}
                                    </div>
                                    {!isCollapsed && (
                                        <>
                                            <span className="font-semibold flex-1 text-sm">{item.label}</span>
                                            {item.badge > 0 && item.enabled && (
                                                <motion.div initial={isFirstMount ? { scale: 0, opacity: 0 } : false} animate={isFirstMount ? { scale: 1, opacity: 1 } : false} className="relative">
                                                    <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                                                        {item.badge}
                                                    </div>
                                                    <motion.div
                                                        className="absolute inset-0 bg-red-400 rounded-full"
                                                        animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    />
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Gạch ngang phân cách */}
                    <div className="my-4 w-full h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

                    {/* Tab Quy tắc cộng đồng */}
                    <div className="space-y-2">
                        {(() => {
                            const Icon = communityRulesItem.icon;
                            const isActive = location.pathname.startsWith(`/${communityRulesItem.key}`);
                            const isDisabled = !communityRulesItem.enabled;
                            return (
                                <motion.button
                                    initial={isFirstMount ? { opacity: 0, x: -20 } : false}
                                    animate={isFirstMount ? { opacity: 1, x: 0 } : false}
                                    transition={isFirstMount ? { delay: 0.8, duration: 0.4 } : {}}
                                    onClick={isDisabled ? undefined : () => onTabChange(communityRulesItem.key)}
                                    disabled={isDisabled}
                                    className={`${buttonStyles} ${isCollapsed ? "justify-center" : "space-x-3 px-4"} py-3 text-left ${isDisabled
                                        ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600"
                                        : isActive
                                            ? `${communityRulesItem.textColor} transform scale-[1.02]`
                                            : hoverStyles
                                        }`}
                                >
                                    {isActive && communityRulesItem.enabled && <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-50" />}
                                    <div className={`${iconStyles(communityRulesItem, isActive)} ${isDisabled ? "opacity-50" : ""}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    {!isCollapsed && (
                                        <span className="font-semibold flex-1 text-sm">{communityRulesItem.label}</span>
                                    )}
                                </motion.button>
                            );
                        })()}
                    </div>
                </div>

                <motion.div
                    initial={isFirstMount ? { opacity: 0, y: 20 } : false}
                    animate={isFirstMount ? { opacity: 1, y: 0 } : false}
                    transition={isFirstMount ? { delay: 0.8, duration: 0.5 } : {}}
                    className="p-4 flex-shrink-0"
                >
                    <div className={`backdrop-blur-xl bg-white/60 dark:bg-gray-700/60 border border-white/30 dark:border-gray-600/30 rounded-xl p-4 ${isCollapsed ? "flex flex-col items-center space-y-2" : ""}`}>
                        <div className={isCollapsed ? "flex flex-col items-center" : "flex items-center space-x-3"}>
                            <div className="relative">
                                <Avatar username={user?.aliasLabel || user?.fullName || user?.username || "Anonymous"} size={isCollapsed ? "sm" : "md"} />
                                <motion.div
                                    key={`online-indicator-${isCollapsed}`}
                                    className={`absolute -bottom-0.5 -right-0.5 w-${isCollapsed ? "3" : "4"} h-${isCollapsed ? "3" : "4"} bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800`}
                                    initial={{ scale: 1 }}
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.aliasLabel || user?.fullName || user?.username || "Anonymous User"}</p>
                                    <motion.p
                                        initial={isFirstMount ? { opacity: 0 } : false}
                                        animate={isFirstMount ? { opacity: 1 } : false}
                                        className="text-xs text-green-500 dark:text-green-400 flex items-center font-medium"
                                    >
                                        <motion.span
                                            className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"
                                            animate={{ opacity: [1, 0.3, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        />
                                        Online
                                    </motion.p>
                                </div>
                            )}
                        </div>
                        <div className={`${isCollapsed ? "mt-2 flex justify-center" : "flex items-center justify-between mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-600/50 space-x-2"}`}>
                            {!isCollapsed && <ThemeToggle />}
                            {!isCollapsed && <LanguageSwitcher variant="no-icon" />}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => dispatch(logout())}
                                className={`${buttonStyles} text-red-500 hover:text-red-600 hover:bg-red-50/80 dark:hover:bg-red-900/20 p-2 justify-center`}
                                title="Đăng xuất"
                            >
                                <div className={`p-2 rounded-lg transition-all duration-300 ${isCollapsed ? "group-hover:bg-gray-200 dark:group-hover:bg-gray-700/50 group-hover:scale-105" : ""}`}>
                                    <LogOut className={`w-4 h-4 group-hover:scale-110 transition-transform duration-200 ${isCollapsed ? "" : "mr-2"}`} />
                                </div>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Sidebar;