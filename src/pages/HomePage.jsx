import React from "react";
import { motion } from "framer-motion";
import CreatePost from "../components/organisms/CreatePost";
import Feed from "../components/organisms/Feed";
import { useOutletContext } from "react-router-dom";

const HomePage = () => {
  const { handleNavigateToChat } = useOutletContext();

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
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
  );
};

export default HomePage;