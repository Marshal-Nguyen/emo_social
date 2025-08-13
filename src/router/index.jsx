import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import HomePage from "../pages/HomePage";
import LoadingSpinner from "../components/atoms/LoadingSpinner";
import NotificationSystem from "../components/organisms/NotificationSystem";
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
            <Routes>
                {/* Auth route */}
                <Route path="/auth" element={<AuthPage />} />
                {/* Home route (protected) */}
                <Route
                    path="/home"
                    element={isAuthenticated ? <HomePage /> : <Navigate to="/auth" />}
                />
                {/* Default route: luôn chuyển về đăng nhập nếu chưa đăng nhập */}
                <Route
                    path="/"
                    element={
                        isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/auth" />
                    }
                />
            </Routes>
            <NotificationSystem />
        </BrowserRouter>
    );
}

export default AppRouter;