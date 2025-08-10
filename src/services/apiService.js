import api from "./api";

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
        user: {
          id: "emo-user-001",
          email: "emo@gmail.com",
          username: "EmoSocial User",
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
  // Lấy danh sách posts
  getPosts: async (page = 1, limit = 10) => {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  // Tạo post mới
  createPost: async (content, isAnonymous = true) => {
    const response = await api.post("/posts", { content, isAnonymous });
    return response.data;
  },

  // Like/Unlike post
  toggleLike: async (postId) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  // Thêm comment
  addComment: async (postId, content) => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },

  // Lấy comments
  getComments: async (postId, page = 1) => {
    const response = await api.get(`/posts/${postId}/comments?page=${page}`);
    return response.data;
  },

  // Xóa post
  deletePost: async (postId) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
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
    const response = await api.post("/chat/conversations", { userId });
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
    const response = await api.post(
      `/chat/conversations/${conversationId}/messages`,
      {
        content,
        type,
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
    const response = await api.post(`/chat/groups/request-join`, { postId });
    return response.data;
  },

  // Approve/reject join request (cho chủ post)
  handleJoinRequest: async (requestId, action) => {
    const response = await api.post(`/chat/groups/handle-request`, {
      requestId,
      action, // 'approve' hoặc 'reject'
    });
    return response.data;
  },

  // Leave group
  leaveGroup: async (groupId) => {
    const response = await api.post(`/chat/groups/${groupId}/leave`);
    return response.data;
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
    const response = await api.post(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Đánh dấu tất cả đã đọc
  markAllAsRead: async () => {
    const response = await api.post("/notifications/read-all");
    return response.data;
  },
};
