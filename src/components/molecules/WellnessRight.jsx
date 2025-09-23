import React from 'react';
import data from '../../data/wellnessCentre.json'; // Assuming the JSON data is saved in a file named data.json


const RightSection = () => {
    return (
        <div className="w-full max-w-4xl dark:bg-gray-900 p-6 rounded-lg h-[700px] overflow-y-auto scrollbar-none">

            {data.map((danhMuc) => (
                <div key={danhMuc.id} className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold dark:text-white">{danhMuc.name}</h2>
                        <span className="dark:text-white text-sm">Swipe →</span>
                    </div>
                    <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-none">
                        {danhMuc.modules.map((modul) => {
                            const progress = (modul.completedDuration / modul.totalDuration) * 100;

                            return (
                                <div
                                    key={modul.id}
                                    className="relative aspect-video w-[280px] rounded-xl overflow-hidden flex-shrink-0"
                                >
                                    {/* Background image */}
                                    <img
                                        src={modul.imageURL}
                                        alt={modul.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                                    {/* Content */}
                                    <div className="relative z-10 flex flex-col justify-between h-full p-4">
                                        {/* Title */}
                                        <h3 className="text-white text-lg font-semibold truncate">
                                            {modul.name}
                                        </h3>

                                        {/* Progress bar + Time + Status */}
                                        <div>
                                            <div className="w-full bg-white/30 rounded-full h-1.5 mb-2">
                                                <div
                                                    className="bg-gradient-to-r from-blue-400 to-pink-400 h-1.5 rounded-full"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between items-center text-white text-xs">
                                                <span>{modul.totalDuration} MINS</span>
                                                {progress === 100 ? (
                                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-white text-sm">
                                                        ✓
                                                    </span>
                                                ) : (
                                                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 text-white text-sm">
                                                        ▶
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button className=" px-6 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
                        Xem Tất Cả
                    </button>
                </div>
            ))}
        </div>
    );
};

export default RightSection;