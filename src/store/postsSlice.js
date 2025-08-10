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
    addComment: (state, action) => {
      const post = state.posts.find(
        (post) => post.id === action.payload.postId
      );
      if (post) {
        if (!post.comments) post.comments = [];
        post.comments.push(action.payload.comment);
        post.commentsCount = (post.commentsCount || 0) + 1;
      }
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
} = postsSlice.actions;

export default postsSlice.reducer;
