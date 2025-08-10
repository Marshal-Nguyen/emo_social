import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "../components/molecules/LoginForm";
import RegisterForm from "../components/molecules/RegisterForm";
import LoadingSpinner from "../components/atoms/LoadingSpinner";
import { Sparkles, Heart, Shield } from "lucide-react";

const AuthPage = () => {
  const [currentForm, setCurrentForm] = useState("login"); // 'login' or 'register'
  const [isLoading, setIsLoading] = useState(false);

  const switchToRegister = () => {
    setCurrentForm("register");
  };

  const switchToLogin = () => {
    setCurrentForm("login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
        <LoadingSpinner breathing={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
        {/* Floating Background Elements */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 dark:from-purple-600/30 dark:to-pink-600/30 rounded-full filter blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 0],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-20 w-40 h-40 bg-gradient-to-br from-blue-400/15 to-purple-500/15 dark:from-blue-600/25 dark:to-purple-600/25 rounded-full filter blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [180, 360, 180],
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-1/4 w-36 h-36 bg-gradient-to-br from-emerald-400/10 to-cyan-500/10 dark:from-emerald-600/20 dark:to-cyan-600/20 rounded-full filter blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -180, 0],
            x: [0, 70, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Geometric Patterns */}
        <motion.div
          className="absolute top-1/4 left-1/3 w-8 h-8 bg-gradient-to-br from-purple-500/30 to-pink-500/30 dark:from-purple-400/20 dark:to-pink-400/20 rotate-45"
          animate={{ rotate: [45, 225, 45] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-gradient-to-br from-blue-500/25 to-cyan-500/25 dark:from-blue-400/15 dark:to-cyan-400/15 rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Enhanced Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-12">
            <div className="relative mx-auto mb-6 w-20 h-20">
              {/* Logo Container with Glow Effect */}
              <motion.div
                className="w-full h-full bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/30 relative overflow-hidden"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                <span className="text-white font-bold text-2xl relative z-10">
                  ES
                </span>

                {/* Floating Sparkles */}
                <motion.div
                  className="absolute top-2 right-2"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}>
                  <Sparkles className="w-4 h-4 text-white/60" />
                </motion.div>
              </motion.div>

              {/* Orbiting Elements */}
              <motion.div
                className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full shadow-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-2 -left-2 w-4 h-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full shadow-md"
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 bg-clip-text text-transparent mb-3">
                EmoSocial
              </h1>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Nền tảng chia sẻ cảm xúc ẩn danh
                </p>
                <Shield className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Kết nối - Chia sẻ - Hỗ trợ lẫn nhau
              </p>
            </motion.div>
          </motion.div>

          {/* Enhanced Auth Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="relative">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 dark:from-purple-600/20 dark:via-pink-600/20 dark:to-blue-600/20 rounded-3xl blur-xl" />

            {/* Main Card */}
            <div className="relative backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-8 overflow-hidden">
              {/* Card Background Pattern */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full filter blur-3xl" />
                <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full filter blur-2xl" />
              </div>

              {/* Form Content */}
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {currentForm === "login" ? (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}>
                      <LoginForm onSwitchToRegister={switchToRegister} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="register"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}>
                      <RegisterForm onSwitchToLogin={switchToLogin} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-12">
            <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-2xl p-6 border border-white/40 dark:border-gray-700/40">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Heart className="w-5 h-5 text-pink-500 animate-pulse" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tạo ra để hỗ trợ sức khỏe tinh thần cộng đồng
                </p>
                <Sparkles className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                © 2025 EmoSocial. All rights reserved.
              </p>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-600/50">
                <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400">
                  <Shield className="w-3 h-3" />
                  <span>Bảo mật</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400">
                  <Heart className="w-3 h-3" />
                  <span>Ẩn danh</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-purple-600 dark:text-purple-400">
                  <Sparkles className="w-3 h-3" />
                  <span>Miễn phí</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
