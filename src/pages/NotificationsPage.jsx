import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DesktopNotificationsNew from "../components/organisms/DesktopNotificationsNew";
import MobileNotificationsPage from "./MobileNotificationsPage";

const NotificationsPage = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
            className="p-8"
        >
            {isMobile ? <MobileNotificationsPage /> : <DesktopNotificationsNew />}
        </motion.div>
    );
};

export default NotificationsPage;