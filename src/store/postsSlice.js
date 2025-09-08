import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  loading: false,
  error: null,
  currentPage: 1,
  hasMore: true,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    fetchPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action) => {
      state.loading = false;
      state.posts = action.payload.reset
        ? action.payload.posts
        : [...state.posts, ...action.payload.posts];
      state.currentPage = action.payload.page;
      state.hasMore = action.payload.hasMore;
    },
    fetchPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...action.payload };
      }
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    likePost: (state, action) => {
      const post = state.posts.find(
        (post) => post.id === action.payload.postId
      );
      if (post) {
        post.liked = action.payload.liked;
        post.likesCount = action.payload.likesCount;
      }
    },
    // Thêm comment hoặc reply nhiều tầng
    addComment: (state, action) => {
      const { postId, comment, parentId } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (!post) return;
      if (!post.comments) post.comments = [];

      // Nếu không có parentId, thêm vào comment gốc
      if (!parentId) {
        post.comments.push(comment);
        post.commentsCount = (post.commentsCount || 0) + 1;
        return;
      }

      // Đệ quy tìm parent comment và thêm vào replies
      const addReplyRecursive = (comments) => {
        for (let c of comments) {
          if (c.id === parentId) {
            if (!c.replies) c.replies = [];
            c.replies.push(comment);
            return true;
          }
          if (c.replies && c.replies.length > 0) {
            if (addReplyRecursive(c.replies)) return true;
          }
        }
        return false;
      };
      addReplyRecursive(post.comments);
      post.commentsCount = (post.commentsCount || 0) + 1;
    },

    // Like/unlike từng comment hoặc reply (nhiều tầng)
    likeComment: (state, action) => {
      const { postId, commentId, parentId } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (!post || !post.comments) return;

      // Đệ quy tìm comment cần like
      const toggleLikeRecursive = (comments) => {
        for (let c of comments) {
          if (c.id === commentId) {
            c.liked = !c.liked;
            c.likesCount = (c.likesCount || 0) + (c.liked ? 1 : -1);
            return true;
          }
          if (c.replies && c.replies.length > 0) {
            if (toggleLikeRecursive(c.replies)) return true;
          }
        }
        return false;
      };
      toggleLikeRecursive(post.comments);
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  addPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  likeComment,
} = postsSlice.actions;

export default postsSlice.reducer;
