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
        post.reactionCount = action.payload.reactionCount;
      }
    },
    addComment: (state, action) => {
      const { postId, comment, parentId, update } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (!post) return;
      if (!post.comments) post.comments = [];

      if (comment) {
        if (!parentId) {
          post.comments.unshift(comment);
          post.commentCount = (post.commentCount || 0) + 1;
        } else {
          const addReplyRecursive = (comments) => {
            for (let c of comments) {
              if (c.id === parentId) {
                if (!c.replies) c.replies = [];
                c.replies.unshift(comment);
                c.replyCount = (c.replyCount || 0) + 1;
                return true;
              }
              if (c.replies && c.replies.length > 0) {
                if (addReplyRecursive(c.replies)) return true;
              }
            }
            return false;
          };
          addReplyRecursive(post.comments);
          post.commentCount = (post.commentCount || 0) + 1;
        }
      } else if (update && parentId) {
        const updateRecursive = (comments) => {
          for (let c of comments) {
            if (c.id === parentId) {
              Object.assign(c, update);
              return true;
            }
            if (c.replies && c.replies.length > 0) {
              if (updateRecursive(c.replies)) return true;
            }
          }
          return false;
        };
        updateRecursive(post.comments);
      }
    },
    likeComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (!post || !post.comments) return;

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
    fetchRepliesSuccess: (state, action) => {
      const { postId, parentId, replies } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (!post || !post.comments) return;

      const addRepliesRecursive = (comments) => {
        for (let c of comments) {
          if (c.id === parentId) {
            c.replies = replies;
            return true;
          }
          if (c.replies && c.replies.length > 0) {
            if (addRepliesRecursive(c.replies)) return true;
          }
        }
        return false;
      };
      addRepliesRecursive(post.comments);
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
  fetchRepliesSuccess,
} = postsSlice.actions;

export default postsSlice.reducer;