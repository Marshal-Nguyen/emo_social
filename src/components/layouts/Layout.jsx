import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../organisms/Sidebar";
import MobileNavBar from "../molecules/MobileNavBar";
import ChatSidebar from "../organisms/ChatSidebar";
import { setFirstMountFalse } from "../../store/authSlice";
import { NotificationService } from "../../services/notificationService";

const Layout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { isFirstMount } = useSelector((state) => state.auth);
    const authUser = useSelector((state) => state.auth.user);
    const aliasId = useMemo(() => authUser?.aliasId || authUser?.id, [authUser]);
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
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        const handleUnread = (e) => {
            const { count } = e.detail || {};
            if (typeof count === 'number') setUnreadNotificationsCount(count);
        };
        window.addEventListener("resize", handleResize);
        window.addEventListener('app:noti:unread', handleUnread);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Global notifications listener (realtime + REST) mounted for whole app
    useEffect(() => {
        if (!aliasId) return;
        const service = new NotificationService(aliasId);
        let mounted = true;

        (async () => {
            // Try realtime; if fails, we still poll REST below
            try {
                await service.connect((n) => {
                    if (!mounted) return;
                    // Toast 2s
                    try {
                        window.dispatchEvent(new CustomEvent('app:toast', { detail: { type: 'info', title: n.actorDisplayName || 'Thông báo', message: n.snippet || '', duration: 2000 } }));
                    } catch { }
                    // Increase badge by 1
                    setUnreadNotificationsCount((c) => {
                        const next = (c || 0) + 1;
                        try { window.dispatchEvent(new CustomEvent('app:noti:unread', { detail: { count: next } })); } catch { }
                        return next;
                    });
                });
            } catch { }

            // Initial unread count via REST
            try {
                const count = await service.getUnreadCount();
                if (mounted) {
                    setUnreadNotificationsCount(count || 0);
                }
            } catch { }
        })();

        return () => {
            mounted = false;
            try { service.disconnect(); } catch { }
        };
    }, [aliasId]);

    useEffect(() => {
        if (isFirstMount) {
            dispatch(setFirstMountFalse());
        }
    }, [dispatch, isFirstMount]);

    // Update activeTab based on current location
    useEffect(() => {
        const path = location.pathname;
        if (path === "/home") {
            setActiveTab("home");
        } else if (path === "/notifications") {
            setActiveTab("notifications");
        } else if (path === "/profile") {
            setActiveTab("profile");
        } else if (path === "/community-rules") {
            setActiveTab("community-rules");
        }
    }, [location.pathname]);

    const handleTabChange = (tab) => {
        // Allow navigation to supported pages
        if (tab === "home" || tab === "community-rules" || tab === "profile" || tab === "notifications") {
            setActiveTab(tab);
            navigate(`/${tab}`);
            return;
        }
        // For other tabs, do nothing (they may be disabled)
    };

    const handleCollapseChange = (isCollapsed) => {
        setIsSidebarCollapsed(isCollapsed);
    };

    return (
        <div className="min-h-screen dark:bg-black pb-16 md:pb-0 relative overflow-hidden z-10">
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    className="absolute -top-32 -left-32 w-64 h-64 sm:w-96 sm:h-96 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full filter blur-3xl opacity-30"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/2 -right-32 w-64 h-64 sm:w-96 sm:h-96 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full filter blur-3xl opacity-30"
                    animate={{ scale: [1.2, 1, 1.2], rotate: [90, 180, 90] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-32 left-1/2 w-64 h-64 sm:w-96 sm:h-96 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full filter blur-3xl opacity-30"
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
                    <div className="w-full">
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