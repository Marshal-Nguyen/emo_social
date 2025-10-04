import api from "./api";
import { getCurrentToken, createApiHeaders } from "./tokenService";
import { postService } from "./postService";
import { generateIdempotencyKey } from "../utils/uuid";

export const authService = {
    // Đăng ký
    register: async (email, password) => {
        const response = await api.post("/auth/register", { email, password });
        return response.data;
    },

    // Đăng nhập
    login: async (email, password) => {
        // Cơ chế đặc biệt cho demo
        if (email === "emo@gmail.com" && password === "emo@123") {
            return {
                success: true,
                token: "demo-emo-token-67890",
                refreshToken: "demo-refresh-token-67890",
                user: {
                    id: "b6a76f02-be77-4ef9-b8f9-ca5c88736cbf",
                    email: "emo@gmail.com",
                    username: "Anonymous",
                    avatar: null,
                    createdAt: new Date().toISOString(),
                },
                message: "Chào mừng đến với EmoSocial!",
            };
        }

        const response = await api.post("/auth/login", { email, password });
        return response.data;
    },

    // Đăng xuất
    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data;
    },

    // Lấy thông tin profile
    getProfile: async () => {
        const response = await api.get("/auth/profile");
        return response.data;
    },

    // Refresh token
    refreshToken: async () => {
        const response = await api.post("/auth/refresh");
        return response.data;
    },
};

export const postsService = {
    // Lấy feed data từ API feed endpoint với cursor pagination
    getFeed: async (limit = 2, cursor = null) => {
        const baseUrl = "https://api.emoease.vn/Feed-service";
        const token = getCurrentToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        // Build URL with cursor if provided
        let url = `${baseUrl}/v1/feed?limit=${limit}`;
        if (cursor) {
            url += `&cursor=${encodeURIComponent(cursor)}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: createApiHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    },

    // Lấy chi tiết posts theo danh sách IDs
    getPostsByIds: async (postIds, pageIndex = 1, pageSize = 10) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = getCurrentToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        // Tạo query string với multiple IDs
        const idsParam = postIds.map(id => `Ids=${id}`).join('&');
        const url = `${baseUrl}/v1/posts?PageIndex=${pageIndex}&PageSize=${pageSize}&${idsParam}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: createApiHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    },

    // Lấy danh sách posts từ API thực tế (legacy method)
    getPosts: async (pageIndex = 1, pageSize = 10, sortBy = "CreatedAt", sortDescending = true) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = getCurrentToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/posts?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=${sortBy}&SortDescending=${sortDescending}`, {
            method: 'GET',
            headers: createApiHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    },

    // Lấy chi tiết bài viết
    getPostDetail: async (postId) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = getCurrentToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/posts/${postId}`, {
            method: 'GET',
            headers: createApiHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    },

    // Tạo post mới
    createPost: async (content, isAnonymous = true) => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post("/posts",
            {
                content,
                isAnonymous,
                medias: []
            },
            {
                headers: {
                    'Idempotency-Key': idempotencyKey
                }
            }
        );
        return response.data;
    },

    // Like/Unlike post
    toggleLike: async (postId) => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post(`/posts/${postId}/like`, {}, {
            headers: {
                'Idempotency-Key': idempotencyKey
            }
        });
        return response.data;
    },

    // Thêm comment
    addComment: async (postId, content, parentCommentId = null) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = getCurrentToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const idempotencyKey = generateIdempotencyKey();
        const headers = createApiHeaders();
        headers['Idempotency-Key'] = idempotencyKey;

        const response = await fetch(`${baseUrl}/v1/comments`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                postId,
                content,
                parentCommentId,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể thêm bình luận: ${errorText}`);
        }

        return await response.json();
    },

    // Lấy comments với pagination
    getComments: async (postId, pageIndex = 1, pageSize = 20, parentCommentId = null) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = getCurrentToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        let url = `${baseUrl}/v1/comments/post/${postId}?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=CreatedAt&SortDescending=true`;
        if (parentCommentId) {
            url += `&ParentCommentId=${parentCommentId}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: createApiHeaders(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể tải bình luận: ${errorText}`);
        }

        return await response.json();
    },

    // Lấy replies của comment
    getCommentReplies: async (parentCommentId, pageIndex = 1, pageSize = 20) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = getCurrentToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/comments/${parentCommentId}/replies?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=CreatedAt&SortDescending=false`, {
            method: "GET",
            headers: createApiHeaders(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể tải replies: ${errorText}`);
        }

        return await response.json();
    },

    // Xóa post
    deletePost: async (postId) => {
        const response = await api.delete(`/posts/${postId}`);
        return response.data;
    },

    // Like post
    likePost: async (postId) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = getCurrentToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/reactions`, {
            method: "POST",
            headers: createApiHeaders(),
            body: JSON.stringify({
                targetType: "Post",
                targetId: postId,
                reactionCode: "Like",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể thích bài viết: ${errorText}`);
        }

        return await response.json();
    },

    // Unlike post
    unlikePost: async (postId) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = getCurrentToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/reactions?TargetType=Post&TargetId=${postId}`, {
            method: "DELETE",
            headers: createApiHeaders(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể bỏ thích bài viết: ${errorText}`);
        }

        return await response.json();
    },

    // Like comment
    likeComment: async (commentId) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = getCurrentToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/reactions`, {
            method: "POST",
            headers: createApiHeaders(),
            body: JSON.stringify({
                targetType: "Comment",
                targetId: commentId,
                reactionCode: "Like",
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể thích bình luận: ${errorText}`);
        }

        return await response.json();
    },

    // Unlike comment
    unlikeComment: async (commentId) => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = getCurrentToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/reactions?TargetType=Comment&TargetId=${commentId}`, {
            method: "DELETE",
            headers: createApiHeaders(),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể bỏ thích bình luận: ${errorText}`);
        }

        return await response.json();
    },
};

export const chatService = {
    // Lấy danh sách conversations
    getConversations: async () => {
        const response = await api.get("/chat/conversations");
        return response.data;
    },

    // Tạo conversation mới (DM)
    createConversation: async (userId) => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post("/chat/conversations", { userId }, {
            headers: {
                'Idempotency-Key': idempotencyKey
            }
        });
        return response.data;
    },

    // Lấy messages của conversation
    getMessages: async (conversationId, page = 1) => {
        const response = await api.get(
            `/chat/conversations/${conversationId}/messages?page=${page}`
        );
        return response.data;
    },

    // Gửi message
    sendMessage: async (conversationId, content, type = "text") => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post(
            `/chat/conversations/${conversationId}/messages`,
            {
                content,
                type,
            },
            {
                headers: {
                    'Idempotency-Key': idempotencyKey
                }
            }
        );
        return response.data;
    },

    // Lấy danh sách groups
    getGroups: async () => {
        const response = await api.get("/chat/groups");
        return response.data;
    },

    // Request join group từ post
    requestJoinGroup: async (postId) => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post(`/chat/groups/request-join`, { postId }, {
            headers: {
                'Idempotency-Key': idempotencyKey
            }
        });
        return response.data;
    },

    // Approve/reject join request (cho chủ post)
    handleJoinRequest: async (requestId, action) => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post(`/chat/groups/handle-request`, {
            requestId,
            action, // 'approve' hoặc 'reject'
        }, {
            headers: {
                'Idempotency-Key': idempotencyKey
            }
        });
        return response.data;
    },

    // Leave group
    leaveGroup: async (groupId) => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post(`/chat/groups/${groupId}/leave`, {}, {
            headers: {
                'Idempotency-Key': idempotencyKey
            }
        });
        return response.data;
    },
};

export const tagService = {
    // Lấy danh sách category tags
    getCategoryTags: async () => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = getCurrentToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/category-tags`, {
            method: 'GET',
            headers: createApiHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    },

    // Lấy danh sách emotion tags
    getEmotionTags: async () => {
        const baseUrl = "https://api.emoease.vn/post-service";
        const token = getCurrentToken();

        if (!token) {
            throw new Error("No authentication token found. Please login first.");
        }

        const response = await fetch(`${baseUrl}/v1/emotion-tags`, {
            method: 'GET',
            headers: createApiHeaders()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    },
};

export const notificationService = {
    // Lấy notifications
    getNotifications: async (page = 1) => {
        const response = await api.get(`/notifications?page=${page}`);
        return response.data;
    },

    // Đánh dấu đã đọc
    markAsRead: async (notificationId) => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post(`/notifications/${notificationId}/read`, {}, {
            headers: {
                'Idempotency-Key': idempotencyKey
            }
        });
        return response.data;
    },

    // Đánh dấu tất cả đã đọc
    markAllAsRead: async () => {
        const idempotencyKey = generateIdempotencyKey();
        const response = await api.post("/notifications/read-all", {}, {
            headers: {
                'Idempotency-Key': idempotencyKey
            }
        });
        return response.data;
    },
};
