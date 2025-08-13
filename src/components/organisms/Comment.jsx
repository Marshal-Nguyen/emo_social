import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Comment({ comments = [], post }) {
    const [input, setInput] = useState("");
    const [localComments, setLocalComments] = useState([]);
    const [likes, setLikes] = useState({});
    const [replyInput, setReplyInput] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);

    const list = [...(post?.comments || comments), ...localComments];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setLocalComments([
            ...localComments,
            {
                id: Date.now(),
                content: input,
                author: "Bạn",
                createdAt: new Date().toISOString(),
                avatar: undefined,
                replies: [],
            },
        ]);
        setInput("");
    };

    const handleReplySubmit = (e, parentId) => {
        e.preventDefault();
        if (!replyInput.trim()) return;
        setLocalComments(localComments.map(comment =>
            comment.id === parentId
                ? {
                    ...comment,
                    replies: [
                        ...(comment.replies || []),
                        {
                            id: Date.now(),
                            content: replyInput,
                            author: "Bạn",
                            createdAt: new Date().toISOString(),
                            avatar: undefined,
                        }
                    ]
                }
                : comment
        ));
        setReplyInput("");
        setReplyingTo(null);
    };

    const handleLike = (commentId) => {
        setLikes(prev => ({
            ...prev,
            [commentId]: (prev[commentId] || 0) + 1
        }));
    };

    return (
        <div className="h-full flex flex-col px-4 py-6 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm">
            <h2 className="font-bold text-xl mb-4 text-gray-900 dark:text-gray-100">Bình luận</h2>
            <div className="flex-1 overflow-y-auto pr-2">
                {!post && (!comments || comments.length === 0) ? (
                    <motion.div
                        className="flex flex-col items-center justify-center h-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img
                            src="/emo-qc.png"
                            alt="No comments"
                            className="max-w-full max-h-80 object-contain mb-4"
                        />
                        <div className="text-gray-400 text-center text-lg">Chưa có bình luận</div>
                    </motion.div>
                ) : list.length === 0 ? (
                    <motion.div
                        className="flex flex-col items-center justify-center h-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <img
                            src="/emo-qc.png"
                            alt="No comments"
                            className="max-w-full max-h-80 object-contain mb-4"
                        />
                        <div className="text-gray-400 text-center text-lg">Chưa có bình luận</div>
                    </motion.div>
                ) : (
                    <ul className="space-y-6">
                        {list.map((c) => (
                            <li key={c.id} className="flex items-start gap-3">
                                <div className="flex-shrink-0">
                                    {c.avatar ? (
                                        <img
                                            src={c.avatar}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                            {c.author[0]}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold text-gray-900 dark:text-gray-100">{c.author}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {new Date(c.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-700 dark:text-gray-200 mt-1">{c.content}</div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <button
                                            onClick={() => handleLike(c.id)}
                                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                            {likes[c.id] || 0}
                                        </button>
                                        <button
                                            onClick={() => setReplyingTo(c.id)}
                                            className="text-sm text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                        >
                                            Trả lời
                                        </button>
                                    </div>
                                    {replyingTo === c.id && (
                                        <form onSubmit={(e) => handleReplySubmit(e, c.id)} className="mt-3 flex gap-2">
                                            <input
                                                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                                placeholder="Viết trả lời..."
                                                value={replyInput}
                                                onChange={e => setReplyInput(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm"
                                            >
                                                Gửi
                                            </button>
                                        </form>
                                    )}
                                    {c.replies?.length > 0 && (
                                        <ul className="mt-4 space-y-4 pl-8 border-l-2 border-gray-200 dark:border-gray-700">
                                            {c.replies.map(reply => (
                                                <li key={reply.id} className="flex items-start gap-3">
                                                    <div className="flex-shrink-0">
                                                        {reply.avatar ? (
                                                            <img
                                                                src={reply.avatar}
                                                                alt="avatar"
                                                                className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">
                                                                {reply.author[0]}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-semibold text-gray-900 dark:text-gray-100">{reply.author}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {new Date(reply.createdAt).toLocaleString()}
                                                            </div>
                                                        </div>
                                                        <div className="text-sm text-gray-700 dark:text-gray-200 mt-1">{reply.content}</div>
                                                        <button
                                                            onClick={() => handleLike(reply.id)}
                                                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors mt-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                            </svg>
                                                            {likes[reply.id] || 0}
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
                <input
                    className="flex-1 border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    placeholder="Viết bình luận..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium transition-colors"
                >
                    Gửi
                </button>
            </form>
        </div>
    );
}