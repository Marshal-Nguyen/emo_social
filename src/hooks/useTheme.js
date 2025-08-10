import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../store/themeSlice";

export const useAutoTheme = () => {
  const dispatch = useDispatch();
  const { autoTheme } = useSelector((state) => state.theme);

  useEffect(() => {
    if (!autoTheme) return;

    const updateTheme = () => {
      const now = new Date();
      const hour = now.getHours();

      // 6:00 AM = Light Mode, 6:00 PM = Dark Mode
      const isDarkTime = hour >= 18 || hour < 6;
      dispatch(setTheme(isDarkTime));
    };

    // Update immediately
    updateTheme();

    // Check every minute
    const interval = setInterval(updateTheme, 60000);

    return () => clearInterval(interval);
  }, [dispatch, autoTheme]);
};

export const useTheme = () => {
  const { isDarkMode } = useSelector((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  return isDarkMode;
};
