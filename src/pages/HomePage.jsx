import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CreatePost from "../components/organisms/CreatePost";
import Feed from "../components/organisms/Feed";
import Comment from "../components/organisms/Comment";
import { useOutletContext } from "react-router-dom";

const HomePage = () => {
  const { handleNavigateToChat } = useOutletContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="grid grid-cols-9 gap-4 h-screen">
      {/* 6-column region (spans 9 columns on mobile) */}
      <div className={`col-span-6 ${isMobile ? 'col-span-9' : ''} space-y-4 overflow-y-auto scrollbar-none`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CreatePost />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Feed onNavigateToChat={handleNavigateToChat} />
        </motion.div>
      </div>
      {/* 3-column region (hidden on mobile) */}
      {!isMobile && (
        <div className="col-span-3 space-y-4 overflow-hidden">
          <motion.div
            className="bg-red-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Comment />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomePage;