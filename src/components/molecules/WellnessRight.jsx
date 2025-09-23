import React from 'react';

const RightSection = () => {
    return (
        <div className="w-3/5 grid grid-cols-2 gap-4">
            {/* Courses */}
            <div className="bg-yellow-200 p-4 rounded-lg text-center">
                <p className="text-gray-600">Courses</p>
                <p className="text-2xl font-bold">121</p>
            </div>

            {/* Hours */}
            <div className="bg-purple-200 p-4 rounded-lg text-center">
                <p className="text-gray-600">Hours</p>
                <p className="text-2xl font-bold">40</p>
            </div>

            {/* Progress */}
            <div className="bg-pink-200 p-4 rounded-lg text-center col-span-2">
                <p className="text-gray-600">Progress</p>
                <p className="text-2xl font-bold">78%</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                </div>
            </div>

            {/* Learnings Today */}
            <div className="bg-blue-200 p-4 rounded-lg col-span-2">
                <p className="text-gray-600">Learnings today</p>
                <p className="text-lg font-bold">58% / 28min</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '58%' }}></div>
                </div>
            </div>

            {/* Business Analytics */}
            <div className="bg-purple-300 p-4 rounded-lg col-span-2 flex items-center">
                <div>
                    <p className="text-gray-600">Business Analytics</p>
                    <p className="text-lg font-bold">78%</p>
                    <p className="text-gray-500">37/40 Places</p>
                </div>
                <div className="ml-4">
                    <img src="https://via.placeholder.com/50" alt="Analytics" className="w-12 h-12" />
                </div>
            </div>

            {/* Question Section */}
            <div className="bg-gray-200 p-4 rounded-lg col-span-2">
                <p className="text-gray-600">Name a country that shares a border with Germany?</p>
                <input
                    className="w-full p-2 mt-2 border rounded-lg placeholder-gray-400"
                    type="text"
                    placeholder="Type your answer..."
                />
            </div>
        </div>
    );
};

export default RightSection;