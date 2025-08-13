import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import MobileChatPage from "./MobileChatPage";
import DesktopChatSimple from "../components/organisms/DesktopChatSimple";

const ChatPage = () => {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const query = new URLSearchParams(location.search);
    const selectedConversationId = query.get("id");

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
            {isMobile ? (
                <MobileChatPage selectedConversationId={selectedConversationId} />
            ) : (
                <DesktopChatSimple selectedConversationId={selectedConversationId} />
            )}
        </motion.div>
    );
};

export default ChatPage;