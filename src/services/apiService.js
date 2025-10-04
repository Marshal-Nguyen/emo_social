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
  // Lấy danh sách posts từ API thực tế
  getPosts: async (pageIndex = 1, pageSize = 10, sortBy = "CreatedAt", sortDescending = true) => {
    const baseUrl = "https://api.emoease.vn/post-service";
    const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwYjFkYTIzMi0wYjcyLTQ0ZjUtYWQyMy1jNzhmYjZlNmNmM2EiLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk1NDAyNzcsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.QuB4RasK160OgdAjeDAtjFJO31kqZhBL0BACaXToURDrA_6twcUNJqWqXZhEprM0_AWt5omLzwYLZ4N06ujKPp09vSvIr-nvA0uzvXArvW2wrp8RULevVRQMrcdjW5cnrjp9CPMqHxHtsE2tIOxhsCfeRJu6JodkBYuPUMfMNm9bYZtYZp9Rnb6_g4bMqUd_g4586VWkkBGm03ZDrACqPQ9IBcq5v-GuOBnRN9fheRHjCzn4AiBAFus6fzNlVv_-ZnX1kv4-nNshbxnz0rEJ14oBfemdyqiMBXIV6Hdt4vvJr9gm-pR24eH-rJ6XDpBEEFGnqZpseDWQ1B_5Tc2b-Q";

    const response = await fetch(`${baseUrl}/v1/posts?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=${sortBy}&SortDescending=${sortDescending}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
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
