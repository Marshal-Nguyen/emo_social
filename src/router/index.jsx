import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import HomePage from "../pages/HomePage";
import ChatPage from "../pages/ChatPage";
import NotificationsPage from "../pages/NotificationsPage";
import ProfilePage from "../pages/ProfilePage";
import IconEmotion from "../pages/IconEmotion";
import SettingsPage from "../pages/SettingsPage";
import PostDetailPage from "../pages/PostDetailPage";
import Layout from "../components/layouts/Layout";
import NotificationSystem from "../components/organisms/NotificationSystem";
import WellnessHub from "../pages/WellnessHub";
import CommunityRulesPage from "../pages/CommunityRulesPage";
import TagDemoPage from "../pages/TagDemoPage";
import { useAutoTheme, useTheme } from "../hooks/useTheme";

function AppRouter() {
    const { isAuthenticated, loading, aliasStatus, isCheckingAlias } = useSelector((state) => state.auth);
    useAutoTheme();
    useTheme();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <NotificationSystem />
            <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route element={<Layout />}>
                    <Route
                        path="/home"
                        element={
                            isAuthenticated ? (
                                isCheckingAlias ? (
                                    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                                        <div className="text-center">
                                            <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
                                            <p className="mt-4 text-gray-600 dark:text-gray-400">Đang kiểm tra thông tin tài khoản...</p>
                                        </div>
                                    </div>
                                ) : aliasStatus === false ? (
                                    <Navigate to="/auth" />
                                ) : (
                                    <HomePage />
                                )
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                    <Route
                        path="/post/:id"
                        element={
                            isAuthenticated ? (
                                aliasStatus === false ? <Navigate to="/auth" /> : <PostDetailPage />
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                    <Route
                        path="/chat"
                        element={
                            isAuthenticated ? (
                                aliasStatus === false ? <Navigate to="/auth" /> : <ChatPage />
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                    <Route
                        path="/notifications"
                        element={
                            isAuthenticated ? (
                                aliasStatus === false ? <Navigate to="/auth" /> : <NotificationsPage />
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            isAuthenticated ? (
                                aliasStatus === false ? <Navigate to="/auth" /> : <ProfilePage />
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                    <Route
                        path="/wellness-hub"
                        element={
                            isAuthenticated ? (
                                aliasStatus === false ? <Navigate to="/auth" /> : <WellnessHub />
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            isAuthenticated ? (
                                aliasStatus === false ? <Navigate to="/auth" /> : <SettingsPage />
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                    <Route
                        path="/icons"
                        element={
                            isAuthenticated ? (
                                aliasStatus === false ? <Navigate to="/auth" /> : <IconEmotion />
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                    <Route
                        path="/community-rules"
                        element={
                            isAuthenticated ? (
                                aliasStatus === false ? <Navigate to="/auth" /> : <CommunityRulesPage />
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                    <Route
                        path="/tag-demo"
                        element={
                            isAuthenticated ? (
                                aliasStatus === false ? <Navigate to="/auth" /> : <TagDemoPage />
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? (
                                aliasStatus === false ? <Navigate to="/auth" /> : <Navigate to="/home" />
                            ) : (
                                <Navigate to="/auth" />
                            )
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;