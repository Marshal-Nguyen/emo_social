import React from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "./store";
import { useAutoTheme, useTheme } from "./hooks/useTheme";
import { useIntroStatus } from "./hooks/useIntroStatus";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import IntroPage from "./pages/IntroPage";
import LoadingSpinner from "./components/atoms/LoadingSpinner";
import NotificationSystem from "./components/organisms/NotificationSystem";

function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

function AppRouter() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const {
    hasSeenIntro,
    isLoading: introLoading,
    markIntroAsSeen,
  } = useIntroStatus();
  useAutoTheme();
  useTheme();

  if (loading || introLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner breathing={true} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Intro route */}
        <Route path="/intro" element={<IntroPage onSkip={markIntroAsSeen} />} />
        {/* Auth route */}
        <Route path="/auth" element={<AuthPage />} />
        {/* Home route (protected) */}
        <Route
          path="/home"
          element={isAuthenticated ? <HomePage /> : <Navigate to="/auth" />}
        />
        {/* Default route logic */}
        <Route
          path="/"
          element={
            !hasSeenIntro && !isAuthenticated ? (
              <Navigate to="/intro" />
            ) : isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
      </Routes>
      <NotificationSystem />
    </BrowserRouter>
  );
}

export default App;
