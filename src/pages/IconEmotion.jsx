import React, { useState } from 'react';
import EmojiList from '../components/organisms/EmojiList';
import GiftList from '../components/organisms/GiftList';
import CategoriList from '../components/organisms/CategoriList';
import WellnessHub from '../components/organisms/WellnessHub';
import EmojiCmt from '../components/organisms/EmojiCmt';
import AvtBlooket from '../components/organisms/AvtBlooket';
function EmojiGiftPage() {
    const [activeTab, setActiveTab] = useState('emoji');

    return (
        <div className="min-h-screen  dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Tab Buttons */}
                <div className="tab-buttons flex justify-center gap-4 mb-2">
                    <button
                        className={`px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 transform hover:scale-105 ${activeTab === 'emoji'
                            ? 'bg-[#A855F7] text-white shadow-lg shadow-purple-500/30'
                            : 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-purple-100 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => setActiveTab('emoji')}
                    >
                        Emoji
                    </button>
                    <button
                        className={`px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 transform hover:scale-105 ${activeTab === 'iconCmt'
                            ? 'bg-[#A855F7] text-white shadow-lg shadow-purple-500/30'
                            : 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-purple-100 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => setActiveTab('iconCmt')}
                    >
                        Icon Comment
                    </button>
                    <button
                        className={`px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 transform hover:scale-105 ${activeTab === 'categories'
                            ? 'bg-[#A855F7] text-white shadow-lg shadow-purple-500/30'
                            : 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-purple-100 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => setActiveTab('categories')}
                    >
                        Categories
                    </button>
                    <button
                        className={`px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 transform hover:scale-105 ${activeTab === 'gift'
                            ? 'bg-[#A855F7] text-white shadow-lg shadow-purple-500/30'
                            : 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-purple-100 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => setActiveTab('gift')}
                    >
                        Quà tặng
                    </button>
                    <button
                        className={`px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 transform hover:scale-105 ${activeTab === 'wellness'
                            ? 'bg-[#A855F7] text-white shadow-lg shadow-purple-500/30'
                            : 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-purple-100 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => setActiveTab('wellness')}
                    >
                        Wellness Hub
                    </button>
                    <button
                        className={`px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 transform hover:scale-105 ${activeTab === 'avtBlooket'
                            ? 'bg-[#A855F7] text-white shadow-lg shadow-purple-500/30'
                            : 'bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 backdrop-blur-md hover:bg-purple-100 dark:hover:bg-gray-600'
                            }`}
                        onClick={() => setActiveTab('avtBlooket')}
                    >
                        Avatar Blooket
                    </button>
                </div>
                {/* Tab Content */}
                <div className="tab-content bg-white/60 dark:bg-gray-800/60 backdrop-blur-lg rounded-2xl p-6 shadow-xl transition-all duration-300">
                    {activeTab === 'emoji' && (
                        <div className="animate-fadeIn">
                            <EmojiList />
                        </div>
                    )}
                    {activeTab === 'iconCmt' && (
                        <div className="animate-fadeIn">
                            <EmojiCmt />
                        </div>
                    )}
                    {activeTab === 'categories' && (
                        <div className="animate-fadeIn">
                            <CategoriList />
                        </div>
                    )}
                    {activeTab === 'gift' && (
                        <div className="animate-fadeIn">
                            <GiftList />
                        </div>
                    )}
                    {activeTab === 'wellness' && (
                        <div className="animate-fadeIn">
                            <WellnessHub />
                        </div>
                    )}
                    {activeTab === 'avtBlooket' && (
                        <div className="animate-fadeIn">
                            <AvtBlooket />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EmojiGiftPage;