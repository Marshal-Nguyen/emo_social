import React from 'react';
import blooksData from '../../data/avtBlooket.json'; // Assuming the JSON file is named blooks.json

const AvtBlooket = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Blooket Avatar Gallery</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {blooksData.blooks.map((blook, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center transform transition duration-300 hover:scale-105"
                    >
                        <img
                            src={blook.url}
                            alt={blook.name}
                            className="w-32 h-32 object-contain mb-4"
                        />
                        <h2 className="text-xl font-semibold text-gray-800">{blook.name}</h2>
                        <p className="text-sm text-gray-500">Rarity: {blook.rarity}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AvtBlooket;