import React, { useState, useEffect, useRef } from "react";
import Card from "../atoms/CardWellness";
import data from "../../data/wellnessHubSeen.json";
import { FaCertificate, FaBriefcase, FaClock, FaBookOpen, FaArrowRight } from "react-icons/fa"; // Ensure icons are imported

const LearningStats = () => {
    const [activeId, setActiveId] = useState(data[0].id);
    const itemRefs = useRef(new Map());

    useEffect(() => {
        const activeElement = itemRefs.current.get(activeId);
        if (activeElement) {
            activeElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [activeId]);

    return (
        <div className="w-full max-w-md mx-auto h-[400px] overflow-y-auto snap-y snap-mandatory flex flex-col px-4 scrollbar-none">
            {data.map((item) => (
                <Card
                    key={item.id}
                    item={item}
                    isActive={item.id === activeId}
                    circumference={2 * Math.PI * 24}
                    setActiveId={setActiveId}
                    ref={(el) => itemRefs.current.set(item.id, el)}
                />
            ))}
        </div>
    );
};

const Dashboard = () => {
    return (
        <div className="w-full max-w-md mx-auto p-4">
            {/* Three rounded rectangles for statistics */}
            <div className="grid grid-cols-3 gap-4 mb-3">
                {/* Certificates */}
                <div className="bg-green-100 rounded-2xl p-4 text-center relative overflow-hidden">
                    <div className="flex justify-center mb-2">
                        <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 transform -rotate-90">
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className="text-green-200"
                                    fill="transparent"
                                />
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className="text-green-500"
                                    strokeDasharray="125"
                                    strokeDashoffset="50"
                                    fill="transparent"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <FaCertificate className="absolute inset-0 m-auto text-green-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">5</p>
                    <p className="text-gray-600 text-sm">Certificates</p>
                </div>

                {/* Courses */}
                <div className="bg-orange-100 rounded-2xl p-4 text-center relative overflow-hidden">
                    <div className="flex justify-center mb-2">
                        <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 transform -rotate-90">
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className="text-orange-200"
                                    fill="transparent"
                                />
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className="text-orange-500"
                                    strokeDasharray="125"
                                    strokeDashoffset="30"
                                    fill="transparent"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <FaBriefcase className="absolute inset-0 m-auto text-orange-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">12</p>
                    <p className="text-gray-600 text-sm">Courses</p>
                </div>

                {/* Hours */}
                <div className="bg-purple-100 rounded-2xl p-4 text-center relative overflow-hidden">
                    <div className="flex justify-center mb-2">
                        <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 transform -rotate-90">
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className="text-purple-200"
                                    fill="transparent"
                                />
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    className="text-purple-500"
                                    strokeDasharray="125"
                                    strokeDashoffset="80"
                                    fill="transparent"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <FaClock className="absolute inset-0 m-auto text-purple-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">40</p>
                    <p className="text-gray-600 text-sm">Hours</p>
                </div>
            </div>

            {/* Learning Hours */}
            <div className="relative bg-purple-200 dark:bg-purple-300 p-4 rounded-2xl overflow-hidden mb-3">
                <div className="flex items-center gap-2 mb-2">
                    <FaBookOpen className="text-purple-700" />
                    <p className="text-sm font-medium text-gray-700">Learnings today</p>
                </div>
                <p className="text-xl font-bold text-gray-900 mb-3">58% / 28min</p>
                <div className="relative w-[80%] h-1 bg-white rounded-full">
                    <div
                        className="absolute top-0 left-0 h-1 bg-gray-900 rounded-full"
                        style={{ width: "58%" }}
                    />
                    <div
                        className="absolute top-1/2"
                        style={{ left: "58%", transform: "translate(-50%, -50%)" }}
                    >
                        <div className="w-3 h-3 bg-gray-900 rounded-full border-2 border-purple-200"></div>
                    </div>
                </div>
                <button className="absolute right-4 bottom-3 bg-white rounded-full p-3 shadow flex items-center justify-center">
                    <FaArrowRight className="text-purple-600" />
                </button>
            </div>

            {/* LearningStats Component */}
            <LearningStats />

        </div>
    );
};

export default Dashboard;