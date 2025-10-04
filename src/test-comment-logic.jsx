import React, { useState } from 'react';
import PostComments from './components/molecules/PostComments';

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
                    replyCount: 0,
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
                    replyCount: 1,
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
            createdAt: "2025-10-04T10:27:49.309314+00:00",
            reactionCount: 0,
            replyCount: 3, // Có 3 replies nhưng chỉ load 2
            isReactedByCurrentUser: false,
            replies: [
                {
                    id: "fe169182-4e14-4da1-90fd-d75c1375e513",
                    content: "18đ thui",
                    author: "Gấu Ngốc Nghếch #163",
                    avatar: null,
                    createdAt: "2025-10-04T10:27:53.147862+00:00",
                    reactionCount: 0,
                    replyCount: 0,
                    isReactedByCurrentUser: false,
                    replies: []
                },
                {
                    id: "85f60d85-10ce-4c0e-8d56-7da5d18f64b1",
                    content: "oke á chứ",
                    author: "Gấu Ngốc Nghếch #163",
                    avatar: null,
                    createdAt: "2025-10-04T10:27:58.702136+00:00",
                    reactionCount: 0,
                    replyCount: 0,
                    isReactedByCurrentUser: false,
                    replies: []
                }
            ]
        },
        {
            id: "71d4b1b6-1e7e-4ae9-9f4e-f9f76979422f",
            content: "sss",
            author: "Gấu Ngốc Nghếch #163",
            avatar: null,
            createdAt: "2025-10-04T11:47:00.878307+00:00",
            reactionCount: 0,
            replyCount: 0, // Không có replies
            isReactedByCurrentUser: false,
            replies: []
        },
        {
            id: "0d9ff4e3-8a5e-4b24-88d8-b2de8487cfb5",
            content: "hay",
            author: "Gấu Ngốc Nghếch #163",
            avatar: null,
            createdAt: "2025-10-04T11:50:05.682106+00:00",
            reactionCount: 0,
            replyCount: 1, // Có 1 reply và đã load hết
            isReactedByCurrentUser: false,
            replies: [
                {
                    id: "74970abd-1655-4197-b87e-9caf12951b06",
                    content: "10đ",
                    author: "Gấu Ngốc Nghếch #163",
                    avatar: null,
                    createdAt: "2025-10-04T11:50:10.273504+00:00",
                    reactionCount: 0,
                    replyCount: 0,
                    isReactedByCurrentUser: false,
                    replies: []
                }
            ]
        }
    ]
};

const TestCommentLogic = () => {
    const [showComments, setShowComments] = useState(true);

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Test Comment Logic với Replies</h1>

            <div className="mb-4">
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {showComments ? 'Ẩn' : 'Hiện'} Comments
                </button>
            </div>

            {showComments && (
                <PostComments
                    comments={mockPost.comments}
                    show={true}
                    maxVisible={10}
                    postId="test-post-1"
                    autoLoadComments={false}
                />
            )}

            <div className="mt-8 p-4 bg-gray-100 rounded">
                <h2 className="font-bold mb-2">Logic Test với data thực tế:</h2>
                <ul className="text-sm space-y-1">
                    <li>• Comment "ê nha": Có 3 replies, đã load 2 → Hiển thị nút "Xem thêm 1 phản hồi"</li>
                    <li>• Comment "19đ nha": Có 3 replies, đã load 2 → Hiển thị nút "Xem thêm 1 phản hồi"</li>
                    <li>• Comment "sss": Không có replies → Không hiển thị nút</li>
                    <li>• Comment "hay": Có 1 reply, đã load hết → Hiển thị "Ẩn 1 phản hồi"</li>
                </ul>
                <div className="mt-2 text-xs text-gray-600">
                    <strong>Lưu ý:</strong> Replies có sẵn từ API sẽ tự động hiển thị, chỉ gọi API khi cần load thêm.
                </div>
            </div>
        </div>
    );
};

export default TestCommentLogic;
