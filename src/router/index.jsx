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
import LoadingSpinner from "../components/atoms/LoadingSpinner";
import NotificationSystem from "../components/organisms/NotificationSystem";
import WellnessHub from "../pages/WellnessHub";
import { useAutoTheme, useTheme } from "../hooks/useTheme";

function AppRouter() {
    const { isAuthenticated, loading } = useSelector((state) => state.auth);
    useAutoTheme();
    useTheme();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <LoadingSpinner breathing={true} />
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
                        element={isAuthenticated ? <HomePage /> : <Navigate to="/auth" />}
                    />
                    <Route
                        path="/post/:id"
                        element={isAuthenticated ? <PostDetailPage /> : <Navigate to="/auth" />}
                    />
                    <Route
                        path="/chat"
                        element={isAuthenticated ? <ChatPage /> : <Navigate to="/auth" />}
                    />
                    <Route
                        path="/notifications"
                        element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/auth" />}
                    />
                    <Route
                        path="/profile"
                        element={isAuthenticated ? <ProfilePage /> : <Navigate to="/auth" />}
                    />
                    <Route
                        path="/wellness-hub"
                        element={isAuthenticated ? <WellnessHub /> : <Navigate to="/auth" />}
                    />
                    <Route
                        path="/settings"
                        element={isAuthenticated ? <SettingsPage /> : <Navigate to="/auth" />}
                    />
                    <Route
                        path="/icons"
                        element={isAuthenticated ? <IconEmotion /> : <Navigate to="/auth" />}
                    />
                    <Route
                        path="/"
                        element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/auth" />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;