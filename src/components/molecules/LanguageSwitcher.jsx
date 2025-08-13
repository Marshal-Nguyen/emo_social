import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, ChevronDown, Check } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext.jsx";
import Button from "../atoms/Button";

const LanguageSwitcher = ({ variant = "default", className = "" }) => {
  const { currentLanguage, changeLanguage, getAvailableLanguages } =
    useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const languages = getAvailableLanguages();

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsOpen(false);
  };

  const currentLang =
    languages.find((lang) => lang.code === currentLanguage) || languages[0];

  if (variant === "compact") {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 min-w-0">
          <span className="text-lg">{currentLang.flag}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9998] bg-black/10"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-[9999] max-h-64 overflow-y-auto">
                {languages.map((language) => (
                  <motion.button
                    key={language.code}
                    whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLanguageChange(language.code)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{language.flag}</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {language.name}
                      </span>
                    </div>
                    {currentLanguage === language.code && (
                      <Check className="w-4 h-4 text-purple-500" />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full variant for settings page
  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="md"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 w-full justify-between">
        <div className="flex items-center space-x-3">
          <Languages className="w-5 h-5 text-gray-500" />
          <div className="flex items-center space-x-2">
            <span className="text-lg">{currentLang.flag}</span>
            <span className="text-sm font-medium">{currentLang.name}</span>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9998] bg-black/20"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-[9999] max-h-64 overflow-y-auto">
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLanguageChange(language.code)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{language.flag}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {language.name}
                    </span>
                  </div>
                  {currentLanguage === language.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center w-5 h-5 bg-purple-500 rounded-full">
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
