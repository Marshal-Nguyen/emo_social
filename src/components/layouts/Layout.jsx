import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../organisms/Sidebar";
import MobileNavBar from "../molecules/MobileNavBar";
import ChatSidebar from "../organisms/ChatSidebar";
import { setFirstMountFalse } from "../../store/authSlice";

const Layout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isFirstMount } = useSelector((state) => state.auth);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("home");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { t } = useTranslation();

    // Mock data for unread counts
    const mockConversations = [
        { id: "dm_1", unreadCount: 2 },
        { id: "group_1", unreadCount: 5 },
    ];
    const totalUnreadMessages = mockConversations.reduce(
        (total, conv) => total + conv.unreadCount,
        0
    );
    const unreadNotificationsCount = 2;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isFirstMount) {
            dispatch(setFirstMountFalse());
        }
    }, [dispatch, isFirstMount]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/${tab}`);
    };

    const handleCollapseChange = (isCollapsed) => {
        setIsSidebarCollapsed(isCollapsed);
    };

    return (
        <div className="min-h-screen dark:bg-gray-900 pb-16 md:pb-0 relative overflow-hidden z-10">
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    className="absolute -top-32 -left-32 w-96 h-96 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full filter blur-3xl opacity-30"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/2 -right-32 w-96 h-96 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full filter blur-3xl opacity-30"
                    animate={{ scale: [1.2, 1, 1.2], rotate: [90, 180, 90] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-32 left-1/2 w-96 h-96 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full filter blur-3xl opacity-30"
                    animate={{ scale: [1, 1.3, 1], rotate: [180, 270, 180] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
            <div className="flex relative z-20">
                <Sidebar
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    unreadMessages={totalUnreadMessages}
                    unreadNotifications={unreadNotificationsCount}
                    onCollapseChange={handleCollapseChange}
                />
                <div className={`flex-1 ${!isMobile ? (isSidebarCollapsed ? "ml-20" : "ml-80") : ""} relative z-20 transition-all duration-300`}>
                    <div className="mx-auto">
                        <Outlet context={{ handleNavigateToChat: (id) => navigate(`/chat${id ? `?id=${id}` : ""}`) }} />
                    </div>
                </div>
            </div>
            <ChatSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
            {isMobile && (
                <MobileNavBar
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    unreadMessages={totalUnreadMessages}
                    unreadNotifications={unreadNotificationsCount}
                />
            )}
        </div>
    );
};

export default Layout;