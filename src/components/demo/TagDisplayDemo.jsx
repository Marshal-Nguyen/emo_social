import React from 'react';
import { getCategoryTagsByIds, getEmotionTagsByIds, getUnicodeEmoji } from '../../utils/tagHelpers';

const TagDisplayDemo = () => {
    // Mock post data với categoryTagIds và emotionTagIds
    const mockPost = {
        id: 'demo-post',
        author: {
            username: 'Demo User',
            displayName: 'Demo User'
        },
        categoryTagIds: ['e332c23f-d32b-4cd5-b80c-b05e7a3b4ac8'], // Relationships
        emotionTagIds: ['fb30d818-d83e-47ff-a662-7f98e8684562'], // Afraid
        content: 'This is a demo post to test tag display',
        createdAt: new Date().toISOString()
    };

    const categoryTags = getCategoryTagsByIds(mockPost.categoryTagIds);
    const emotionTags = getEmotionTagsByIds(mockPost.emotionTagIds);

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Tag Display Demo
            </h3>

            {/* Post Header với Emotion Tags */}
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {mockPost.author.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                            {mockPost.author.username}
                        </h4>
                        {emotionTags.length > 0 && (
                            <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">đang cảm thấy</span>
                                {emotionTags.map((emotion, index) => (
                                    <div key={emotion.id} className="flex items-center space-x-1">
                                        <span className="text-sm">{getUnicodeEmoji(emotion.unicodeCodepoint)}</span>
                                        <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                                            {emotion.displayNameVi || emotion.displayName}
                                        </span>
                                        {index < emotionTags.length - 1 && (
                                            <span className="text-xs text-gray-400">,</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(mockPost.createdAt).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="mb-4 text-gray-900 dark:text-white">
                {mockPost.content}
            </div>

            {/* Post Actions với Category Tags */}
            <div className="flex items-center justify-between">
                {/* Category Tags */}
                {categoryTags.length > 0 && (
                    <div className="flex items-center space-x-2">
                        {categoryTags.map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center space-x-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-full"
                            >
                                <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                                    #{category.displayName}
                                </span>
                                <span className="text-sm">{getUnicodeEmoji(category.unicodeCodepoint)}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
                        <span className="text-xs">0</span>
                        <span>❤️</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                        <span className="text-xs">0</span>
                        <span>💬</span>
                    </button>
                </div>
            </div>

            {/* Debug Info */}
            <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                <div><strong>Category Tags:</strong> {JSON.stringify(categoryTags, null, 2)}</div>
                <div><strong>Emotion Tags:</strong> {JSON.stringify(emotionTags, null, 2)}</div>
            </div>
        </div>
    );
};

export default TagDisplayDemo;
