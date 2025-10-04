import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import Avatar from "../atoms/Avatar";
import { Heart } from "lucide-react";
import CommentForm from "./CommentForm";
import { formatTimeAgo } from "../../utils/helpers";
import { postsService } from "../../services/apiService";
import { useWebSocket } from "../../hooks/useWebSocket";
import websocketService from "../../services/websocketService";

const baseUrl = "https://api.emoease.vn/post-service";
const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhZWVlZWY1NC0zNzQ1LTRkODAtYTc1OC02NWFlNWQ2YTFiODUiLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk0NzM3NTcsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.TXKohDzV54uglcDGzk-D9ySdEo_3tSKaLcssTOwZwJC9m8GRlKmlv9-vrfSLALpdw69KFFNyJep3AW5ZuYQCDf4NJmTcrusVo6m0EER17A6kFv7QAKOkjUxEvo5MCl3QhXy1Yh34534x6HeoxjQcc8nvR2Ngj-g27hUxZckPMogiAh9fIxyEyvyqPRlGV9wlm6fqWlvtxEzDxBiUiLzXV7JMVMBLhp6GpK4_-kKNPpGsn3ne1ytZJ9gjMgYsImMQhWP2AWEOelHkRbh7fG_C51hUxd-y_hsTgG70U4Qib71qTbxEky5VwBv9Ly__Dv1jY5-htT_LNgHWVYPWuFiFgQ";

const PostComments = ({
  comments = [],
  show = false,
  maxVisible = 3,
  onShowMore,
  className = "",
  onReply,
  hideRepliesByDefault = false,
  postId,
  autoLoadComments = false,
}) => {
  // Get user info from Redux
  const user = useSelector((state) => state.auth.user);

  // Local state management (no Redux needed with WebSocket)
  const [localComments, setLocalComments] = useState(comments);
  const [showReplyForm, setShowReplyForm] = useState({});
  const [openReplies, setOpenReplies] = useState({});
  const [replyVisibleCount, setReplyVisibleCount] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [fetchingReplies, setFetchingReplies] = useState(new Set());
  const commentEndRef = useRef(null);

  // WebSocket hook with callback for real-time updates
  const handleCommentUpdate = useCallback((type, data) => {
    switch (type) {
      case 'newComment':
        setLocalComments(prev => [data, ...prev]);
        break;
      case 'newReply':
        setLocalComments(prev => {
          const addReplyToComment = (comments) => {
            return comments.map(comment => {
              if (comment.id === data.parentId) {
                return {
                  ...comment,
                  replies: [data.reply, ...(comment.replies || [])],
                  replyCount: (comment.replyCount || 0) + 1
                };
              }
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: addReplyToComment(comment.replies)
                };
              }
              return comment;
            });
          };
          return addReplyToComment(prev);
        });
        break;
      case 'commentLiked':
        setLocalComments(prev => {
          const updateLike = (comments) => {
            return comments.map(comment => {
              if (comment.id === data.commentId) {
                return {
                  ...comment,
                  isReactedByCurrentUser: data.isLiked,
                  reactionCount: data.reactionCount || (comment.reactionCount || 0) + (data.isLiked ? 1 : -1)
                };
              }
              if (comment.replies && comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: updateLike(comment.replies)
                };
              }
              return comment;
            });
          };
          return updateLike(prev);
        });
        break;
      case 'commentDeleted':
        setLocalComments(prev => prev.filter(comment => comment.id !== data.commentId));
        break;
      case 'replyDeleted':
        setLocalComments(prev => {
          const removeReply = (comments) => {
            return comments.map(comment => {
              if (comment.replies && comment.replies.length > 0) {
                const filteredReplies = comment.replies.filter(reply => reply.id !== data.replyId);
                return {
                  ...comment,
                  replies: filteredReplies,
                  replyCount: Math.max((comment.replyCount || 0) - 1, 0)
                };
              }
              return comment;
            });
          };
          return removeReply(prev);
        });
        break;
    }
  }, []);

  const { sendComment, sendReply, sendLike, isConnected } = useWebSocket(postId, show, handleCommentUpdate);

  // Sync local comments with props
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);

  // Load comments when component mounts or postId changes (only if autoLoadComments is true)
  useEffect(() => {
    if (postId && !commentsLoaded && autoLoadComments) {
      loadComments();
    }
  }, [postId, commentsLoaded, autoLoadComments]);

  // Reset state when postId changes
  useEffect(() => {
    setFetchingReplies(new Set());
    setShowReplyForm({}); // Close all reply forms when postId changes
  }, [postId]);

  // Initialize WebSocket connection (disabled for now due to connection issues)
  useEffect(() => {
    if (postId && show) {
      // Temporarily disable WebSocket due to connection issues
      // const wsUrl = `wss://api.emoease.vn/ws?postId=${postId}&token=${token}`;
      // websocketService.connect(wsUrl);

      console.log('🔌 WebSocket disabled - using API fallback only');

      return () => {
        // websocketService.disconnect();
      };
    }
  }, [postId, show]);

  const loadComments = async () => {
    try {
      const response = await postsService.getComments(postId, 1, 20);
      if (response.comments && response.comments.data) {
        // Map comments to local format
        const mappedComments = response.comments.data.map((comment) => ({
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
          replies: comment.replies ? comment.replies.map((reply) => ({
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
            replies: [], // Replies don't have nested replies in this structure
          })) : [],
        }));

        setLocalComments(mappedComments);
        setCommentsLoaded(true);
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  };

  // Handle comment submission for post
  const handleCommentSubmit = async (content) => {
    if (!postId) {
      console.warn("Cannot submit comment without postId");
      return;
    }

    if (!content.trim()) return;

    try {
      // Optimistic update
      const optimisticComment = {
        id: `temp-${Date.now()}`,
        content: content.trim(),
        author: user?.username || user?.displayName || "Anonymous",
        avatar: user?.avatar || user?.avatarUrl || null,
        createdAt: new Date().toISOString(),
        reactionCount: 0,
        replyCount: 0,
        isReactedByCurrentUser: false,
        replies: [],
      };

      // Add optimistic comment to local state
      setLocalComments(prev => [optimisticComment, ...prev]);

      // Send via WebSocket if connected, otherwise use API
      if (isConnected) {
        sendComment(content);
      } else {
        // API fallback
        const response = await postsService.addComment(postId, content, null);
        console.log("Comment created via API:", response);

        // Update optimistic comment with real ID from API
        if (response.commentId) {
          setLocalComments(prev =>
            prev.map(comment =>
              comment.id === optimisticComment.id
                ? { ...comment, id: response.commentId }
                : comment
            )
          );
        }
      }
    } catch (error) {
      console.error("Error creating comment:", error);
      // Revert optimistic update on error
      setLocalComments(prev => prev.filter(comment => comment.id !== optimisticComment.id));
    }
  };

  const handleReplySubmit = async (commentId, content) => {
    if (!postId) {
      console.warn("Cannot submit reply without postId");
      return;
    }

    try {
      // Optimistic reply
      const tempId = `temp-${Date.now()}`;
      const optimistic = {
        id: tempId,
        content,
        author: user?.username || user?.displayName || "Anonymous",
        avatar: user?.avatar || user?.avatarUrl || null,
        createdAt: new Date().toISOString(),
        reactionCount: 0,
        replyCount: 0,
        isReactedByCurrentUser: false,
        replies: [],
      };

      // Add optimistic reply to local state
      setLocalComments(prev => {
        const addReplyToComment = (comments) => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [optimistic, ...(comment.replies || [])],
                replyCount: (comment.replyCount || 0) + 1
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: addReplyToComment(comment.replies)
              };
            }
            return comment;
          });
        };
        return addReplyToComment(prev);
      });

      // Ensure the replies section opens when first reply is added
      setOpenReplies((prev) => ({ ...prev, [commentId]: true }));
      setReplyVisibleCount((prev) => ({ ...prev, [commentId]: Math.max(prev[commentId] || 0, 3) }));

      // Close the reply form after submitting
      setShowReplyForm((prev) => ({ ...prev, [commentId]: false }));

      // Send via WebSocket if connected, otherwise fallback to API
      if (isConnected) {
        sendReply(postId, commentId, content);
        // WebSocket will handle the real-time update
      } else {
        // Fallback to API
        const response = await postsService.addComment(postId, content, commentId);
        const realId = response?.commentId || response?.id;

        if (realId) {
          // Update optimistic reply with real ID
          setLocalComments(prev => {
            const updateReplyId = (comments) => {
              return comments.map(comment => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    replies: comment.replies.map(reply =>
                      reply.id === tempId ? { ...reply, id: realId } : reply
                    )
                  };
                }
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    replies: updateReplyId(comment.replies)
                  };
                }
                return comment;
              });
            };
            return updateReplyId(prev);
          });
        } else {
          // Remove optimistic reply if failed
          setLocalComments(prev => {
            const removeReply = (comments) => {
              return comments.map(comment => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    replies: comment.replies.filter(reply => reply.id !== tempId),
                    replyCount: Math.max((comment.replyCount || 0) - 1, 0)
                  };
                }
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    replies: removeReply(comment.replies)
                  };
                }
                return comment;
              });
            };
            return removeReply(prev);
          });
        }
      }
    } catch (error) {
      console.error("Lỗi khi thêm phản hồi:", error);
      // Remove optimistic reply on error
      setLocalComments(prev => {
        const removeReply = (comments) => {
          return comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.filter(reply => reply.id !== tempId),
                replyCount: Math.max((comment.replyCount || 0) - 1, 0)
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: removeReply(comment.replies)
              };
            }
            return comment;
          });
        };
        return removeReply(prev);
      });
    }
  };

  const handleLikeComment = async (commentId, isReacted) => {
    if (!postId) {
      console.warn("Cannot like comment without postId");
      return;
    }

    try {
      // Send via WebSocket if connected, otherwise fallback to API
      if (isConnected) {
        sendLike(postId, commentId, !isReacted);
        // WebSocket will handle the real-time update
      } else {
        // Fallback to API
        if (!isReacted) {
          const response = await fetch(`${baseUrl}/v1/reactions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
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

          // Update local state
          setLocalComments(prev => {
            const updateLike = (comments) => {
              return comments.map(comment => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    isReactedByCurrentUser: true,
                    reactionCount: (comment.reactionCount || 0) + 1
                  };
                }
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    replies: updateLike(comment.replies)
                  };
                }
                return comment;
              });
            };
            return updateLike(prev);
          });
        } else {
          const response = await fetch(
            `${baseUrl}/v1/reactions?TargetType=Comment&TargetId=${commentId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Không thể bỏ thích bình luận: ${errorText}`);
          }

          // Update local state
          setLocalComments(prev => {
            const updateLike = (comments) => {
              return comments.map(comment => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    isReactedByCurrentUser: false,
                    reactionCount: Math.max((comment.reactionCount || 0) - 1, 0)
                  };
                }
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    replies: updateLike(comment.replies)
                  };
                }
                return comment;
              });
            };
            return updateLike(prev);
          });
        }
      }
    } catch (error) {
      console.error("Lỗi khi xử lý lượt thích bình luận:", error);
    }
  };

  const handleFetchReplies = async (commentId) => {
    if (!postId) {
      console.warn("Cannot fetch replies without postId");
      return;
    }

    // Prevent duplicate API calls
    if (fetchingReplies.has(commentId)) {
      console.log(`⏳ Already fetching replies for comment ${commentId}, skipping...`);
      return;
    }


    console.log(`🔄 Fetching replies for comment ${commentId}`);

    try {
      setFetchingReplies(prev => new Set([...prev, commentId]));
      setLoadingReplies(prev => ({ ...prev, [commentId]: true }));

      // Get current page based on existing replies - search in nested structure
      // Recursive function to find comment in nested structure
      const findComment = (comments) => {
        for (let comment of comments) {
          if (comment.id === commentId) {
            return comment;
          }
          if (comment.replies && comment.replies.length > 0) {
            const found = findComment(comment.replies);
            if (found) return found;
          }
        }
        return null;
      };

      const currentComment = findComment(localComments);
      const existingRepliesCount = currentComment?.replies?.length || 0;
      const pageIndex = Math.floor(existingRepliesCount / 20) + 1;

      console.log(`📊 Comment ${commentId}: existingReplies=${existingRepliesCount}, pageIndex=${pageIndex}, totalReplyCount=${currentComment?.replyCount}`);

      // Chỉ gọi API nếu có replyCount > 0
      if (!currentComment?.replyCount || currentComment.replyCount === 0) {
        console.log(`❌ Comment ${commentId} không có replies (replyCount=0), không gọi API`);
        return;
      }

      // Nếu đã load hết replies thì không gọi API
      if (existingRepliesCount >= currentComment.replyCount) {
        console.log(`✅ Comment ${commentId} đã load hết replies (${existingRepliesCount}/${currentComment.replyCount}), không gọi API`);
        return;
      }

      // Gọi API riêng cho replies của comment
      const responseData = await postsService.getCommentReplies(commentId, pageIndex, 20);
      console.log(`📡 API Response for ${commentId}:`, responseData);

      if (responseData.comments && responseData.comments.data) {
        const mappedReplies = responseData.comments.data.map((reply) => ({
          id: reply.id,
          content: reply.content,
          author: reply.author.displayName,
          avatar: reply.author.avatarUrl || null,
          createdAt: reply.createdAt,
          reactionCount: reply.reactionCount || 0,
          replyCount: reply.replyCount || 0,
          isReactedByCurrentUser: reply.isReactedByCurrentUser || false,
          replies: [],
        }));

        // Filter chỉ lấy replies mới (chưa có trong existingReplies)
        const existingReplyIds = new Set(currentComment?.replies?.map(r => r.id) || []);
        const newReplies = mappedReplies.filter(reply => !existingReplyIds.has(reply.id));

        console.log(`✅ Mapped replies for ${commentId}:`, mappedReplies);
        console.log(`🔍 Existing reply IDs:`, Array.from(existingReplyIds));
        console.log(`🆕 New replies after filtering:`, newReplies);

        // Update local state with new replies
        if (newReplies.length > 0) {
          setLocalComments(prev => {
            const addRepliesToComment = (comments) => {
              return comments.map(comment => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    replies: [...(comment.replies || []), ...newReplies]
                  };
                }
                if (comment.replies && comment.replies.length > 0) {
                  return {
                    ...comment,
                    replies: addRepliesToComment(comment.replies)
                  };
                }
                return comment;
              });
            };
            return addRepliesToComment(prev);
          });

        } else {
          console.log(`⚠️ No new replies to add for comment ${commentId}`);
          setOpenReplies((prev) => {
            const newState = { ...prev, [commentId]: true };
            return newState;
          });
        }

        // Open replies section when first batch is loaded
        if (existingRepliesCount === 0) {
          setOpenReplies((prev) => {
            const newState = { ...prev, [commentId]: true };
            console.log(`🔓 Opening replies for ${commentId}:`, newState);
            return newState;
          });
          // Set initial visible count to 3 (social media style)
          setReplyVisibleCount((prev) => ({
            ...prev,
            [commentId]: 3,
          }));
        }
      } else {
        console.warn(`⚠️ No replies data for comment ${commentId}`);
      }
    } catch (error) {
      console.error(`❌ Error fetching replies for ${commentId}:`, error);
    } finally {
      setFetchingReplies(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
      setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const toggleReplyForm = (commentId) => {
    setShowReplyForm((prev) => {
      // Close all other reply forms first
      const newState = {};
      newState[commentId] = !prev[commentId];
      console.log(`🔄 Toggle reply form for ${commentId}:`, newState);
      return newState;
    });
  };

  const toggleReplies = (commentId) => {
    setOpenReplies((prev) => {
      const newState = { ...prev, [commentId]: !prev[commentId] };
      return newState;
    });
    setReplyVisibleCount((prev) => ({
      ...prev,
      [commentId]: prev[commentId] || 3, // Bắt đầu với 3 replies
    }));
  };

  const handleShowMoreReplies = (commentId, total) => {
    setReplyVisibleCount((prev) => {
      const current = prev[commentId] || 3; // Bắt đầu với 3 replies
      const next = Math.min(current + 5, total || current + 5);
      return { ...prev, [commentId]: next };
    });
  };

  // Use local comments instead of Redux
  const validComments = localComments;

  // Auto-open replies that have replies from API (social media style)
  useEffect(() => {
    if (localComments.length > 0) {
      const commentsWithReplies = localComments.filter(comment =>
        comment.replies && comment.replies.length > 0
      );

      if (commentsWithReplies.length > 0) {
        setOpenReplies(prev => {
          const newOpenReplies = { ...prev };
          let hasChanges = false;

          commentsWithReplies.forEach(comment => {
            // Chỉ auto-open nếu có ít hơn 3 replies (giống social media)
            if (!newOpenReplies[comment.id] && comment.replies.length <= 3) {
              newOpenReplies[comment.id] = true;
              hasChanges = true;
            }
          });

          return hasChanges ? newOpenReplies : prev;
        });
      }
    }
  }, [localComments.length]);

  if (!show || localComments.length === 0) return null;

  const renderComments = (commentsList, level = 0) => {
    return commentsList.map((comment) => {
      const totalReplyCount = comment.replyCount || 0;
      const loadedReplies = Array.isArray(comment.replies) ? comment.replies.length : 0;
      const hasReplies = totalReplyCount > 0;
      const isOpen = openReplies[comment.id] ?? false;
      const areRepliesLoaded = loadedReplies >= totalReplyCount && loadedReplies > 0;
      const hasLoadedAny = loadedReplies > 0;
      const shouldShowReplies = isOpen;
      const isLoading = loadingReplies[comment.id] || false;
      // Hiển thị nút nếu có replyCount > loadedReplies và không đang loading
      const hasMoreReplies = totalReplyCount > loadedReplies && !isLoading;

      // Giới hạn chiều sâu comment chỉ có 5 level
      const isMaxDepth = level >= 5;

      // Debug log chi tiết
      if (hasReplies) {
        console.log(`🔍 Comment ${comment.id} (level ${level}): total=${totalReplyCount}, loaded=${loadedReplies}, hasMore=${hasMoreReplies}, isOpen=${isOpen}`);
      }

      return (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`relative ${level > 0 ? "ml-4 sm:ml-8" : ""}`}
        >
          <div className="flex space-x-2 sm:space-x-3">
            <Avatar
              username={comment.author}
              avatarUrl={comment.avatar}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <span className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white truncate">
                  {comment.author}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {formatTimeAgo(comment.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm sm:text-base text-gray-900 dark:text-gray-200 break-words">
                {comment.content}
              </p>
              <div className="flex items-center space-x-2 sm:space-x-4 mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <button
                  className={`flex items-center space-x-1 ${comment.isReactedByCurrentUser
                    ? "text-red-500 dark:text-red-500"
                    : "hover:text-red-500"
                    }`}
                  onClick={() => handleLikeComment(comment.id, comment.isReactedByCurrentUser)}
                >
                  <Heart
                    className="w-3 h-3 sm:w-4 sm:h-4"
                    fill={comment.isReactedByCurrentUser ? "currentColor" : "none"}
                  />
                  <span>{comment.reactionCount}</span>
                </button>
                {!isMaxDepth && (
                  <button
                    className="hover:text-gray-700 dark:hover:text-gray-200"
                    onClick={() => toggleReplyForm(comment.id)}
                  >
                    Trả lời
                  </button>
                )}
                {hasReplies && (
                  <button
                    className="hover:text-gray-700 dark:hover:text-gray-200 flex items-center space-x-1"
                    onClick={() => {
                      if (isLoading) {
                        // Đang loading -> Không làm gì
                        return;
                      }
                      if (isOpen) {
                        // Đã mở -> Ẩn
                        toggleReplies(comment.id);
                      } else {
                        // Chưa mở -> Load từ API nếu cần, rồi mở
                        if (!hasLoadedAny) {
                          handleFetchReplies(comment.id);
                        } else {
                          toggleReplies(comment.id);
                        }
                      }
                    }}
                    disabled={loadingReplies[comment.id]}
                  >
                    {loadingReplies[comment.id] ? (
                      <span>Đang tải...</span>
                    ) : isOpen ? (
                      <span>Ẩn phản hồi</span>
                    ) : (
                      <span>Xem thêm phản hồi</span>
                    )}
                  </button>
                )}
              </div>
              {!isMaxDepth && (
                <AnimatePresence>
                  {showReplyForm[comment.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2"
                    >
                      <CommentForm
                        onSubmit={(content) => handleReplySubmit(comment.id, content)}
                        placeholder={`Trả lời ${comment.author}...`}
                        isSubmitting={false}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
          {/* Show replies when opened (social media style) - only if not at max depth */}
          {!isMaxDepth && shouldShowReplies && comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {(() => {
                const total = comment.replies.length;
                const initialVisible = 3; // Chỉ hiển thị 3 replies đầu tiên
                const visible = replyVisibleCount[comment.id] || initialVisible;
                const toRender = comment.replies.slice(0, visible);
                const remaining = total - visible;

                return (
                  <>
                    {renderComments(toRender, level + 1)}
                    {remaining > 0 && !hasMoreReplies && (
                      <button
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm mt-1 font-medium"
                        onClick={() => handleShowMoreReplies(comment.id, total)}
                      >
                        Xem thêm phản hồi
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          )}


        </motion.div>
      );
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* WebSocket status indicator */}
      {postId && (
        <div className="flex items-center space-x-2 text-xs">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-gray-500 dark:text-gray-400">
            {isConnected ? 'Kết nối real-time' : 'Chế độ offline'}
          </span>
        </div>
      )}

      {/* Comment form for post */}
      {postId && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <CommentForm
            onSubmit={handleCommentSubmit}
            placeholder="Viết bình luận..."
            isSubmitting={false}
          />
        </div>
      )}


      {renderComments(validComments.slice(0, maxVisible))}

      {validComments.length > maxVisible && (
        <button
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
          onClick={onShowMore}
        >
          Xem thêm bình luận
        </button>
      )}
      <div ref={commentEndRef} />
    </div>
  );
};

export default PostComments;