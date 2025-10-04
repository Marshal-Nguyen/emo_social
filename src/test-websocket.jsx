import React, { useState, useEffect } from 'react';
import websocketService from './services/websocketService';

const TestWebSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Subscribe to WebSocket events
        const handleConnected = () => {
            setIsConnected(true);
            addMessage('✅ Connected to WebSocket');
        };

        const handleDisconnected = () => {
            setIsConnected(false);
            addMessage('❌ Disconnected from WebSocket');
        };

        const handleError = (error) => {
            addMessage(`❌ WebSocket error: ${error.message}`);
        };

        const handleNewComment = (data) => {
            addMessage(`📨 New comment: ${data.comment.content}`);
        };

        const handleNewReply = (data) => {
            addMessage(`📨 New reply: ${data.reply.content}`);
        };

        const handleCommentLiked = (data) => {
            addMessage(`👍 Comment liked: ${data.commentId}`);
        };

        websocketService.subscribe('connected', handleConnected);
        websocketService.subscribe('disconnected', handleDisconnected);
        websocketService.subscribe('error', handleError);
        websocketService.subscribe('newComment', handleNewComment);
        websocketService.subscribe('newReply', handleNewReply);
        websocketService.subscribe('commentLiked', handleCommentLiked);

        return () => {
            websocketService.unsubscribe('connected', handleConnected);
            websocketService.unsubscribe('disconnected', handleDisconnected);
            websocketService.unsubscribe('error', handleError);
            websocketService.unsubscribe('newComment', handleNewComment);
            websocketService.unsubscribe('newReply', handleNewReply);
            websocketService.unsubscribe('commentLiked', handleCommentLiked);
        };
    }, []);

    const addMessage = (text) => {
        setMessages(prev => [...prev, {
            id: Date.now(),
            text,
            timestamp: new Date().toLocaleTimeString()
        }]);
    };

    const connect = () => {
        const wsUrl = 'wss://api.emoease.vn/ws?postId=test&token=test';
        websocketService.connect(wsUrl);
    };

    const disconnect = () => {
        websocketService.disconnect();
    };

    const sendTestMessage = () => {
        if (message.trim()) {
            websocketService.send({
                type: 'TEST_MESSAGE',
                payload: { message: message.trim() }
            });
            addMessage(`📤 Sent: ${message}`);
            setMessage('');
        }
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto bg-white dark:bg-gray-900 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                WebSocket Test
            </h1>

            {/* Connection Status */}
            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>

                <div className="space-x-2">
                    <button
                        onClick={connect}
                        disabled={isConnected}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Connect
                    </button>
                    <button
                        onClick={disconnect}
                        disabled={!isConnected}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Disconnect
                    </button>
                </div>
            </div>

            {/* Send Message */}
            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="font-medium mb-2">Send Test Message</h3>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter test message..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        onKeyPress={(e) => e.key === 'Enter' && sendTestMessage()}
                    />
                    <button
                        onClick={sendTestMessage}
                        disabled={!isConnected || !message.trim()}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Messages</h3>
                    <button
                        onClick={clearMessages}
                        className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                    >
                        Clear
                    </button>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-1">
                    {messages.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No messages yet</p>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className="text-sm p-2 bg-white dark:bg-gray-700 rounded">
                                <span className="text-gray-500 dark:text-gray-400">[{msg.timestamp}]</span> {msg.text}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* WebSocket Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-medium mb-2">WebSocket Configuration</h3>
                <div className="text-sm space-y-1">
                    <p><strong>URL:</strong> wss://api.emoease.vn/ws</p>
                    <p><strong>Events:</strong> connected, disconnected, error, newComment, newReply, commentLiked</p>
                    <p><strong>Auto-reconnect:</strong> Yes (up to 5 attempts)</p>
                </div>
            </div>
        </div>
    );
};

export default TestWebSocket;
