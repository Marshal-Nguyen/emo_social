import React from 'react';
import LeftSection from '../components/molecules/WellnessLeft';
import RightSection from '../components/molecules/WellnessRight';

export default function WellnessHub() {
    return (
        <div className="p-4 rounded-lg min-h-screen flex flex-col">
            {/* Header Section */}
            {/* <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg shadow-md">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <div className="flex space-x-2">
                    <input
                        className="p-2 border rounded-lg placeholder-gray-400"
                        type="text"
                        placeholder="Search"
                    />
                </div>
            </div> */}

            {/* Body Section (2 parts left, 3 parts right) */}
            <div className="flex flex-1 gap-4 mt-4">
                <LeftSection />
                <RightSection />
            </div>
        </div>
    );
}