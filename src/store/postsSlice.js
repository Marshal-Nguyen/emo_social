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
      if (!post) {
        console.error(`Post not found for postId: ${postId}`);
        return;
      }
      if (!post.comments) post.comments = [];

      if (comment) {
        if (!parentId) {
          // Add top-level comment
          const existsIndex = post.comments.findIndex((c) => c.id === comment.id);
          if (existsIndex === -1) {
            post.comments.unshift(comment);
            post.commentCount = (post.commentCount || 0) + 1;
          } else {
            // Merge/update existing to avoid duplicates
            post.comments[existsIndex] = { ...post.comments[existsIndex], ...comment };
          }
        } else {
          // Add reply to existing comment
          const addReplyRecursive = (comments) => {
            for (let c of comments) {
              if (c.id === parentId) {
                if (!c.replies) c.replies = [];
                const existsReplyIndex = c.replies.findIndex((r) => r.id === comment.id);
                if (existsReplyIndex === -1) {
                  c.replies.unshift(comment);
                  c.replyCount = (c.replyCount || 0) + 1;
                } else {
                  c.replies[existsReplyIndex] = { ...c.replies[existsReplyIndex], ...comment };
                }
                console.log(`Added reply to comment ${parentId}:`, comment);
                return true;
              }
              if (c.replies && c.replies.length > 0) {
                if (addReplyRecursive(c.replies)) return true;
              }
            }
            console.warn(`Comment with parentId ${parentId} not found`);
            return false;
          };
          addReplyRecursive(post.comments);
        }
      } else if (update && parentId) {
        const updateRecursive = (comments) => {
          for (let c of comments) {
            if (c.id === parentId) {
              Object.assign(c, update);
              console.log(`Updated comment ${parentId}:`, update);
              return true;
            }
            if (c.replies && c.replies.length > 0) {
              if (updateRecursive(c.replies)) return true;
            }
          }
          console.warn(`Comment with parentId ${parentId} not found for update`);
          return false;
        };
        updateRecursive(post.comments);
      }
    },
    likeComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const post = state.posts.find((post) => post.id === postId);
      if (!post || !post.comments) {
        console.error(`Post or comments not found for postId: ${postId}`);
        return;
      }

      const toggleLikeRecursive = (comments) => {
        for (let c of comments) {
          if (c.id === commentId) {
            c.liked = !c.liked;
            c.reactionCount = (c.reactionCount || 0) + (c.liked ? 1 : -1);
            console.log(`Toggled like for comment ${commentId}:`, c);
            return true;
          }
          if (c.replies && c.replies.length > 0) {
            if (toggleLikeRecursive(c.replies)) return true;
          }
        }
        console.warn(`Comment with id ${commentId} not found for like`);
        return false;
      };
      toggleLikeRecursive(post.comments);
    },
    finalizeComment: (state, action) => {
      const { postId, tempId, newData } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post || !post.comments) return;
      const replaceRecursive = (comments) => {
        for (let i = 0; i < comments.length; i++) {
          const c = comments[i];
          if (c.id === tempId) {
            comments[i] = { ...c, ...newData };
            return true;
          }
          if (c.replies && c.replies.length > 0) {
            if (replaceRecursive(c.replies)) return true;
          }
        }
        return false;
      };
      replaceRecursive(post.comments);
    },
    removeComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const post = state.posts.find((p) => p.id === postId);
      if (!post || !post.comments) return;
      const removeRecursive = (comments) => {
        const idx = comments.findIndex((c) => c.id === commentId);
        if (idx !== -1) {
          comments.splice(idx, 1);
          return true;
        }
        for (let c of comments) {
          if (c.replies && c.replies.length > 0) {
            if (removeRecursive(c.replies)) return true;
          }
        }
        return false;
      };
      removeRecursive(post.comments);
    },
    fetchRepliesSuccess: (state, action) => {
      const { postId, parentId, replies } = action.payload;
      let post = state.posts.find((post) => post.id === postId);
      if (!post) {
        console.warn(`Post not found for postId: ${postId}, creating new post`);
        post = { id: postId, comments: [] };
        state.posts.push(post);
      }
      if (!post.comments) post.comments = [];
      console.log(`Processing fetchRepliesSuccess for postId: ${postId}, parentId: ${parentId}, replies:`, replies);

      const addRepliesRecursive = (comments) => {
        for (let c of comments) {
          console.log(`Checking comment id: ${c.id}`);
          if (c.id === parentId) {
            c.replies = replies;
            console.log(`Assigned replies to comment ${parentId}:`, replies);
            return true;
          }
          if (c.replies && c.replies.length > 0) {
            if (addRepliesRecursive(c.replies)) return true;
          }
        }
        console.warn(`Comment with parentId ${parentId} not found in comments`);
        return false;
      };
      addRepliesRecursive(post.comments);
    },
    // New action to handle the new comment API structure
    setComments: (state, action) => {
      const { postId, comments } = action.payload;
      let post = state.posts.find((post) => post.id === postId);
      if (!post) {
        console.warn(`Post not found for postId: ${postId}, creating new post`);
        post = { id: postId, comments: [] };
        state.posts.push(post);
      }

      // Map the new API structure to our internal structure
      const mappedComments = comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        author: comment.author.displayName,
        avatar: comment.author.avatarUrl,
        createdAt: comment.createdAt,
        editedAt: comment.editedAt,
        reactionCount: comment.reactionCount || 0,
        replyCount: comment.replyCount || 0,
        isReactedByCurrentUser: comment.isReactedByCurrentUser || false,
        isDeleted: comment.isDeleted || false,
        hierarchy: comment.hierarchy,
        replies: comment.replies ? comment.replies.map(reply => ({
          id: reply.id,
          content: reply.content,
          author: reply.author.displayName,
          avatar: reply.author.avatarUrl,
          createdAt: reply.createdAt,
          editedAt: reply.editedAt,
          reactionCount: reply.reactionCount || 0,
          replyCount: reply.replyCount || 0,
          isReactedByCurrentUser: reply.isReactedByCurrentUser || false,
          isDeleted: reply.isDeleted || false,
          hierarchy: reply.hierarchy,
          replies: [] // Replies don't have nested replies in this structure
        })) : []
      }));

      post.comments = mappedComments;
      post.commentCount = mappedComments.length;
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
  finalizeComment,
  removeComment,
  fetchRepliesSuccess,
  setComments,
} = postsSlice.actions;

export default postsSlice.reducer;