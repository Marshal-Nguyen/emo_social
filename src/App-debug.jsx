import React from "react";
import { Provider, useSelector } from "react-redux";
import { store } from "./store";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";

const AppContent = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  console.log("Auth state:", { isAuthenticated, loading });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {isAuthenticated ? (
        <div className="p-4">
          <h1 className="text-xl font-bold">Authenticated - Home Page</h1>
          <HomePage />
        </div>
      ) : (
        <div className="p-4">
          <h1 className="text-xl font-bold">Not Authenticated - Auth Page</h1>
          <AuthPage />
        </div>
      )}
    </div>
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
