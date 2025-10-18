import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DesktopProfile from "../components/organisms/DesktopProfile";
import MobileProfilePage from "./MobileProfilePage";
import { useOutletContext } from "react-router-dom";

const ProfilePage = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { handleNavigateToChat } = useOutletContext();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {isMobile ? <MobileProfilePage /> : <DesktopProfile onNavigateToChat={handleNavigateToChat} />}
        </motion.div>
    );
};

export default ProfilePage;