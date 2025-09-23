import React from 'react';
import { motion } from 'framer-motion';
import LeftSection from '../components/molecules/WellnessLeft';
import RightSection from '../components/molecules/WellnessRight';

export default function WellnessHub() {
    return (
        <motion.div
            className=" rounded-lg min-h-screen flex flex-col scrollbar-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Header Section */}
            {/* <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    Emo's care corner
                </h1>

            </div> */}

            {/* Body Section (2 parts left, 3 parts right) */}
            <div className="flex flex-1 gap-4 mt-4">
                <RightSection />

                <LeftSection />
            </div>
        </motion.div>
    );
}