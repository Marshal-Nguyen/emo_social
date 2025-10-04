import React, { useState } from 'react';
import PostCommentsWebSocket from './components/molecules/PostCommentsWebSocket';

// Mock data dựa trên API response thực tế
const mockPost = {
    id: 'adc9a9f9-9dc7-4ec4-9c4d-921d6ef54f61',
    comments: [
        {
            id: "9ecbdb95-9976-4e75-858a-d1a5d46864c6",
            content: "ê nha",
            author: "Gấu Ngốc Nghếch #163",
            avatar: null,
            createdAt: "2025-10-04T10:27:46.65572+00:00",
            reactionCount: 0,
            replyCount: 3, // Có 3 replies nhưng chỉ load 2
            isReactedByCurrentUser: false,
            replies: [
                {
                    id: "f392ab56-e37d-4d97-a620-a93d6bd19768",
                    content: "ee",
                    author: "Gấu Ngốc Nghếch #163",
                    avatar: null,
                    createdAt: "2025-10-04T11:47:03.277289+00:00",
                    reactionCount: 1,
                    replyCount: 4, // Có 4 nested replies
                    isReactedByCurrentUser: true,
                    replies: []
                },
                {
                    id: "cefdb39b-66b8-4b73-91ac-5c6db2cb8b63",
                    content: "a",
                    author: "Gấu Ngốc Nghếch #163",
                    avatar: null,
                    createdAt: "2025-10-04T11:47:05.036364+00:00",
                    reactionCount: 1,
                    replyCount: 2, // Có 2 nested replies
                    isReactedByCurrentUser: true,
                    replies: []
                }
            ]
        },
        {
            id: "0ba7d257-be4d-4e82-b68d-c7ad9e2c4cdc",
            content: "19đ nha",
            author: "Gấu Ngốc Nghếch #163",
            avatar: null,
            createdAt: "2025-10-04T10:27:46.65572+00:00",
            reactionCount: 0,
            replyCount: 3, // Có 3 replies nhưng chỉ load 2
            isReactedByCurrentUser: false,
            replies: [
                {
                    id: "71d4b1b6-1e7e-4ae9-9f4e-f9f76979422f",
                    content: "reply 1",
                    author: "User 1",
                    avatar: null,
                    createdAt: "2025-10-04T11:47:03.277289+00:00",
                    reactionCount: 0,
                    replyCount: 0,
                    isReactedByCurrentUser: false,
                    replies: []
                },
                {
                    id: "0d9ff4e3-8a5e-4b24-88d8-b2de8487cfb5",
                    content: "reply 2",
                    author: "User 2",
                    avatar: null,
                    createdAt: "2025-10-04T11:47:05.036364+00:00",
                    reactionCount: 0,
                    replyCount: 0,
                    isReactedByCurrentUser: false,
                    replies: []
                }
            ]
        },
        {
            id: "sss-comment",
            content: "sss",
            author: "Gấu Ngốc Nghếch #163",
            avatar: null,
            createdAt: "2025-10-04T10:27:46.65572+00:00",
            reactionCount: 1,
            replyCount: 0, // Không có replies
            isReactedByCurrentUser: true,
            replies: []
        },
        {
            id: "hay-comment",
            content: "hay",
            author: "Gấu Ngốc Nghếch #163",
            avatar: null,
            createdAt: "2025-10-04T10:27:46.65572+00:00",
            reactionCount: 0,
            replyCount: 1, // Có 1 reply và đã load hết
            isReactedByCurrentUser: false,
            replies: [
                {
                    id: "hay-reply-1",
                    content: "reply hay",
                    author: "User 3",
                    avatar: null,
                    createdAt: "2025-10-04T11:47:03.277289+00:00",
                    reactionCount: 0,
                    replyCount: 0,
                    isReactedByCurrentUser: false,
                    replies: []
                }
            ]
        }
    ]
};

const TestWebSocketComments = () => {
    const [showComments, setShowComments] = useState(true);

    return (
        <div className="p-4 max-w-2xl mx-auto bg-white dark:bg-gray-900 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Test WebSocket Comments (No Redux)
            </h1>
            <button
                onClick={() => setShowComments(!showComments)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                {showComments ? "Hide Comments" : "Show Comments"}
            </button>

            {showComments && (
                <PostCommentsWebSocket
                    comments={mockPost.comments} // Pass mock comments directly
                    show={true}
                    postId={mockPost.id} // Pass postId for WebSocket integration
                    autoLoadComments={false} // Prevent auto-loading from API for mock data
                />
            )}

            <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
                <h2 className="font-bold mb-2">WebSocket Features Test:</h2>
                <ul className="text-sm space-y-1">
                    <li>• <strong>No Redux:</strong> Sử dụng local state thay vì Redux</li>
                    <li>• <strong>WebSocket Real-time:</strong> Comments/replies cập nhật real-time</li>
                    <li>• <strong>Nested Replies:</strong> Hỗ trợ replies của replies</li>
                    <li>• <strong>Optimistic Updates:</strong> UI cập nhật ngay lập tức</li>
                    <li>• <strong>API Fallback:</strong> Tự động fallback khi WebSocket không kết nối</li>
                    <li>• <strong>Social Media Style:</strong> Logic giống các platform phổ biến</li>
                </ul>
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                    <strong>Lưu ý:</strong> WebSocket có thể không kết nối được (sẽ hiển thị "Chế độ offline"),
                    nhưng vẫn hoạt động bình thường với API fallback.
                </div>
            </div>
        </div>
    );
};

export default TestWebSocketComments;
