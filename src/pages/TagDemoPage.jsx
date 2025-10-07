import React from 'react';
import TagDisplayDemo from '../components/demo/TagDisplayDemo';

const TagDemoPage = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                    Tag Display Demo
                </h1>

                <div className="flex justify-center">
                    <TagDisplayDemo />
                </div>

                <div className="mt-8 max-w-2xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                        Cách hoạt động:
                    </h2>
                    <div className="bg-white dark:bg-[#1C1C1E] p-4 rounded-lg shadow-md">
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li>• <strong>Emotion Tags:</strong> Hiển thị bên cạnh tên tác giả với format "đang cảm thấy 😊 Happy"</li>
                            <li>• <strong>Category Tags:</strong> Hiển thị bên trái của PostActions với format "#CategoryName 🏷️"</li>
                            <li>• <strong>Data Source:</strong> Lấy từ tagCategory.json và tagEmotions.json</li>
                            <li>• <strong>API Integration:</strong> Sử dụng categoryTagIds và emotionTagIds từ post response</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TagDemoPage;
