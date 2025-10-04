import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import AppRouter from "./router/index.jsx";
import { initializeAuth } from "./services/authInit";

function App() {
  useEffect(() => {
    // Initialize authentication state from localStorage
    initializeAuth();
  }, []);

  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}

export default App;