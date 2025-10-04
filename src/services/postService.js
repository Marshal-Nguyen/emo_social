import api from "./api";

// Post Service - Centralized API calls for post operations
export const postService = {
    // Create new post
    createPost: async (postData) => {
        const response = await api.post("https://api.emoease.vn/post-service/v1/posts", postData, {
            headers: {
                "Idempotency-Key": crypto.randomUUID(),  // Random UUID mỗi lần
            },
        });
        return response.data;
    },

    // Get post detail
    getPostDetail: async (postId) => {
        const response = await api.get(`https://api.emoease.vn/post-service/v1/posts/${postId}`);
        return response.data;
    },

    // Get posts by IDs
    getPostsByIds: async (postIds, pageIndex = 1, pageSize = 10) => {
        const idsParam = postIds.map(id => `Ids=${id}`).join('&');
        const url = `https://api.emoease.vn/post-service/v1/posts?PageIndex=${pageIndex}&PageSize=${pageSize}&${idsParam}`;
        const response = await api.get(url);
        return response.data;
    },

    // Get posts list
    getPosts: async (pageIndex = 1, pageSize = 10, sortBy = "CreatedAt", sortDescending = true) => {
        const url = `https://api.emoease.vn/post-service/v1/posts?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=${sortBy}&SortDescending=${sortDescending}`;
        const response = await api.get(url);
        return response.data;
    },

    // Add comment
    addComment: async (postId, content, parentCommentId = null) => {
        const response = await api.post("https://api.emoease.vn/post-service/v1/comments", {
            postId,
            content,
            parentCommentId,
        });
        return response.data;
    },

    // Get comments
    getComments: async (postId, pageIndex = 1, pageSize = 20, parentCommentId = null) => {
        let url = `https://api.emoease.vn/post-service/v1/comments/post/${postId}?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=CreatedAt&SortDescending=true`;
        if (parentCommentId) {
            url += `&ParentCommentId=${parentCommentId}`;
        }
        const response = await api.get(url);
        return response.data;
    },

    // Get comment replies
    getCommentReplies: async (parentCommentId, pageIndex = 1, pageSize = 20) => {
        const url = `https://api.emoease.vn/post-service/v1/comments/${parentCommentId}/replies?PageIndex=${pageIndex}&PageSize=${pageSize}&SortBy=CreatedAt&SortDescending=false`;
        const response = await api.get(url);
        return response.data;
    },

    // Delete post
    deletePost: async (postId) => {
        const response = await api.delete(`https://api.emoease.vn/post-service/v1/posts/${postId}`);
        return response.data;
    },

    // Like/Unlike post
    toggleLike: async (postId) => {
        const response = await api.post(`https://api.emoease.vn/post-service/v1/posts/${postId}/like`);
        return response.data;
    },
};
