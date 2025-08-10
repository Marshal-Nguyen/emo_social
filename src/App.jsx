import React, { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "./store";
import { useAutoTheme, useTheme } from "./hooks/useTheme";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import LoadingSpinner from "./components/atoms/LoadingSpinner";
import NotificationSystem from "./components/organisms/NotificationSystem";

const AppContent = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // Initialize theme hooks
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
    <>
      {isAuthenticated ? <HomePage /> : <AuthPage />}
      <NotificationSystem />
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
