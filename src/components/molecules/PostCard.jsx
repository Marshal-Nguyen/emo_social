// import React, { useState, useRef } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { motion } from "framer-motion";
// import PostHeader from "./PostHeader";
// import PostContent from "./PostContent";
// import PostActions from "./PostActions";
// import PostComments from "./PostComments";
// import CommentForm from "./CommentForm";
// import Button from "../atoms/Button";
// import { MessageSquare } from "lucide-react";
// import JoinGroupButton from "./JoinGroupButton";
// import { likePost, addComment, likeComment } from "../../store/postsSlice";
// import { addConversation } from "../../store/chatSlice";

// const PostCard = ({ post, onNavigateToChat, index, onShowComment, forceShowComments, onBack, hideRepliesByDefault }) => {
//   const dispatch = useDispatch();
//   const { isSafeMode } = useSelector((state) => state.theme);
//   const { user } = useSelector((state) => state.auth);

//   const [showComments, setShowComments] = useState(!!forceShowComments);
//   const [maxVisibleComments, setMaxVisibleComments] = useState(3);
//   const commentsBoxRef = useRef(null);
//   // Nếu forceShowComments thay đổi (ví dụ khi vào trang chi tiết), luôn mở khung bình luận
//   React.useEffect(() => {
//     if (forceShowComments) setShowComments(true);
//   }, [forceShowComments]);
//   const [isLiking, setIsLiking] = useState(false);
//   const [isCommenting, setIsCommenting] = useState(false);

//   const handleLike = async () => {
//     if (isLiking) return;
//     setIsLiking(true);
//     try {
//       dispatch(
//         likePost({
//           postId: post.id,
//           liked: !post.liked,
//           likesCount: post.liked ? post.likesCount - 1 : post.likesCount + 1,
//         })
//       );
//     } catch (error) {
//       console.error("Failed to toggle like:", error);
//     } finally {
//       setTimeout(() => setIsLiking(false), 300);
//     }
//   };

//   // Hỗ trợ gửi comment hoặc reply (nhiều tầng)
//   const handleComment = async (commentText, parentId = null) => {
//     if (!commentText.trim() || isCommenting) return;
//     setIsCommenting(true);
//     try {
//       const newComment = {
//         id: Date.now(),
//         content: commentText,
//         author: user.username,
//         createdAt: new Date().toISOString(),
//         avatar: user.avatar,
//         likesCount: 0,
//         liked: false,
//         replies: [],
//       };
//       dispatch(
//         addComment({
//           postId: post.id,
//           comment: newComment,
//           parentId: parentId || null,
//         })
//       );
//     } catch (error) {
//       console.error("Failed to add comment:", error);
//     } finally {
//       setIsCommenting(false);
//     }
//   };

//   const handleDirectMessage = async () => {
//     try {
//       const conversationId = `dm_${user.id}_${post.author.id}`;
//       const conversation = {
//         id: conversationId,
//         type: "dm",
//         participant: post.author,
//         lastMessage: null,
//         updatedAt: new Date().toISOString(),
//       };
//       dispatch(addConversation(conversation));
//       if (onNavigateToChat) {
//         onNavigateToChat(conversationId);
//       }
//     } catch (error) {
//       console.error("Failed to create DM:", error);
//     }
//   };



//   const bgColors = ["#FFF5DF", "#E0EDFF", "#FFE6CC", "#E6FFE6", "#FFE8F0"];
//   const bgColor = bgColors[index % bgColors.length];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -2 }}
//       transition={{ duration: 0.3 }}
//       className={`relative bg-[${bgColor}]  rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow p-4 flex flex-col h-full`}
//       style={{ minHeight: 0 }}
//     >
//       {/* PostHeader luôn hiển thị, không cuộn */}
//       <PostHeader
//         post={post}
//         showJoinedBadge={post.joinStatus === "joined"}
//         className=" flex-shrink-0"
//         onBack={onBack}
//       />

//       {/* Vùng cuộn chung cho PostContent + bình luận */}
//       <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none flex flex-col gap-1">
//         {/* Post Content */}
//         <PostContent post={post} isSafeMode={isSafeMode} className=" dark:bg-gray-900 rounded-lg p-2" />

//         {/* Group Join Button */}
//         {post.type === "group" && (
//           <div className="">
//             <JoinGroupButton
//               initialStatus={post.joinStatus}
//               groupName={post.groupName}
//             />
//           </div>
//         )}

//         {/* Direct Message Button and Post Actions */}
//         <div className="flex justify-between items-center px-4">

//           <PostActions
//             post={post}
//             onLike={handleLike}
//             onComment={() => {
//               // toggleComments();
//               if (onShowComment) onShowComment(post);
//             }}
//             isLiking={isLiking}
//           />
//           <Button
//             variant="ghost"
//             className="bg-[#FB88AA] hover:bg-[#E94B7D] text-white text-sm dark:text-white flex items-center space-x-2 p-1 rounded-full"
//             title="Nhắn tin"
//             onClick={handleDirectMessage}
//           >
//             <MessageSquare className="w-4 h-4" />
//             <span className="hidden sm:inline">Nhóm chat</span>
//           </Button>
//         </div>

//         {/* Comments Section */}
//         <div ref={commentsBoxRef}>
//           <PostComments
//             comments={post.comments || []}
//             show={showComments}
//             maxVisible={maxVisibleComments}
//             hideRepliesByDefault={hideRepliesByDefault}
//             onShowMore={() => {
//               setMaxVisibleComments((prev) => prev + 10);
//               setTimeout(() => {
//                 if (commentsBoxRef.current) {
//                   commentsBoxRef.current.scrollTop = commentsBoxRef.current.scrollHeight;
//                 }
//               }, 100);
//             }}
//             onReply={handleComment}
//             onLike={(comment, parentId) => {
//               dispatch(likeComment({
//                 postId: post.id,
//                 commentId: comment.id,
//                 parentId: parentId || null,
//               }));
//             }}
//           />
//         </div>

//         {/* Comment Form */}
//         {showComments && (
//           <div className="mt-4">
//             <CommentForm onSubmit={handleComment} isSubmitting={isCommenting} />
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default PostCard;


// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { motion } from "framer-motion";
// import { MessageSquare } from "lucide-react";
// import PostHeader from "./PostHeader";
// import PostContent from "./PostContent";
// import PostActions from "./PostActions";
// import PostComments from "./PostComments";
// import CommentForm from "./CommentForm";
// import JoinGroupButton from "./JoinGroupButton";
// import Button from "../atoms/Button";
// import { addComment } from "../../store/postsSlice";
// import { addConversation } from "../../store/chatSlice";

// const baseUrl = "https://api.emoease.vn/post-service";
// const token =
//   "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNGJlN2RjYS1lNDM5LTQxNGEtYWRmZC00M2Y5ZWRmOThmZDciLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk0Mjg1MzMsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.RBtQeGTMko48pp1eAk-CfuaGR9ybcnFkK8fphM5hEFeVHPoG3q8KynbRAaf4ZqOAv72Lj7AoM9pCbuJ_ncY8J-UKnK_01ulQ_soKvtz3GBIxg0C45sjiKSuJ_Xv1-exjCHVFWmLKnZoX15t1-BAX7bd7aZtigEWtcvTLaVLcfmca-8_Qh3J1SQGQtg1C1E-XuqwCr1u-UJaVAkV67k0Jw3G7hZ9e3aUhlYHnec_Fl7AjRZacjb5X9vsb0ecOhjwAZ5-vBl8_h0SZr5-Kp73mYHoFe2YABbuU5JIDHp5y5nyb7dDcytti86nn7zgQRYmO3Wiu4FWEU3KiTYMOnl4JeQ";

// const PostCard = ({
//   post,
//   onNavigateToChat,
//   index = 0,
//   onShowComment,
//   forceShowComments = false,
//   onBack,
//   hideRepliesByDefault = false,
// }) => {
//   const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
//   const [showComments, setShowComments] = useState(forceShowComments);
//   const [maxVisibleComments, setMaxVisibleComments] = useState(3);
//   const [isLiking, setIsLiking] = useState(false);
//   const [isCommenting, setIsCommenting] = useState(false);
//   const commentEndRef = useRef(null);

//   const bgColors = [
//     "bg-white dark:bg-gray-800",
//     "bg-gray-50 dark:bg-gray-900",
//     "bg-blue-50 dark:bg-blue-900/20",
//     "bg-green-50 dark:bg-green-900/20",
//     "bg-purple-50 dark:bg-purple-900/20",
//   ];

//   useEffect(() => {
//     if ((showComments || forceShowComments) && commentEndRef.current) {
//       commentEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [showComments, forceShowComments, post.comments]);

//   const handleShowComments = () => {
//     setShowComments(true);
//     onShowComment?.();
//   };

//   const handleShowMoreComments = () => {
//     setMaxVisibleComments((prev) => prev + 5);
//   };

//   const handleCommentSubmit = async (content) => {
//     if (!content.trim() || isCommenting) return;
//     setIsCommenting(true);

//     try {
//       const response = await fetch(`${baseUrl}/v1/comments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           postId: post.id,
//           content,
//         }),
//       });

//       if (!response.ok) throw new Error("Không thể thêm bình luận");
//       const newComment = await response.json();
//       dispatch(
//         addComment({
//           postId: post.id,
//           comment: {
//             id: newComment.id,
//             content: newComment.content,
//             author: newComment.author?.displayName || user?.username || "Anonymous",
//             avatar: newComment.author?.avatarUrl || user?.avatar || null,
//             createdAt: newComment.createdAt,
//             likesCount: 0,
//             liked: false,
//             replies: [],
//           },
//         })
//       );
//     } catch (error) {
//       console.error("Lỗi khi thêm bình luận:", error);
//     } finally {
//       setIsCommenting(false);
//     }
//   };

//   const handleReply = (parentId, comment) => {
//     dispatch(
//       addComment({
//         postId: post.id,
//         comment,
//         parentId,
//       })
//     );
//   };

//   const handleLikeComment = (commentId) => {
//     // Implement comment liking logic if needed
//   };

//   const handleDirectMessage = () => {
//     const conversationId = `${user.id}-${post.author.id}`;
//     dispatch(addConversation({ id: conversationId, recipient: post.author }));
//     onNavigateToChat(conversationId);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.3 }}
//       className={`rounded-xl shadow-md p-4 ${bgColors[index % bgColors.length]} border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow`}
//     >
//       <PostHeader
//         post={post}
//         showJoinedBadge={post.type === "group"}
//         onBack={onBack}
//       />
//       <PostContent post={post} isSafeMode={false} className="mt-4" />
//       {post.type === "group" && (
//         <JoinGroupButton
//           groupId={post.id}
//           status={post.joinStatus}
//           className="mt-3"
//         />
//       )}
//       <div className="flex items-center justify-between mt-4">
//         <PostActions
//           post={post}
//           onLike={() => { }}
//           onComment={handleShowComments}
//           isLiking={isLiking}
//         />
//         {post.author.id !== user?.id && (
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={handleDirectMessage}
//             title="Nhắn tin"
//             className="!rounded-full"
//           >
//             <MessageSquare className="w-5 h-5" />
//           </Button>
//         )}
//       </div>
//       <PostComments
//         comments={post.comments}
//         show={showComments || forceShowComments}
//         maxVisible={maxVisibleComments}
//         onShowMore={handleShowMoreComments}
//         onReply={handleReply}
//         onLike={handleLikeComment}
//         hideRepliesByDefault={hideRepliesByDefault}
//         className="mt-4"
//       />
//       {(showComments || forceShowComments) && (
//         <CommentForm
//           onSubmit={handleCommentSubmit}
//           isSubmitting={isCommenting}
//           placeholder="Viết bình luận..."
//         />
//       )}
//       <div ref={commentEndRef} />
//     </motion.div>
//   );
// };

// export default PostCard;

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostComments from "./PostComments";
import CommentForm from "./CommentForm";
import JoinGroupButton from "./JoinGroupButton";
import Button from "../atoms/Button";
import { addComment } from "../../store/postsSlice";
import { addConversation } from "../../store/chatSlice";
import { useParams } from "react-router-dom";

const baseUrl = "https://api.emoease.vn/post-service";
const token =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMDJlMjFjMS1mM3NmLTQ2MzItYTdjYy0wOTRkMzc3YTY0ZTQiLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk0MTQzMjAsImlzcyI6imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.d2Z7_TykLgWLu9l0FFDHy01x1OicghQZYcxy7Mwme1KfefDPnbsVlviXQyiOlLyyYrzrzBnNBgeyl8HnBDEivDd5tOt93BuMnFXUmKKxhbVxqTUxItwLc1BvPGqsmSugwKCG-J_bGKcsOFO6VkhDKtz8YdHgE4YIihzEIPMHmdK3q5t6Lix5f8mJFYFFtestUhf-_cUXF8MCwPysRKTe-rvXB8RtO9Deiqo3ak4QH-P2bTdt6LQrjWnPK77q6Rb1BR8MfynVsNAkanXnDGJsWovw5L-i466Zm2pa2xl3I0WlGhONwPlvbqoCWTmRqRUTeLZu4TegulgG1GZ_1pcpgg";

const PostCard = ({
  post,
  onNavigateToChat,
  index = 0,
  onShowComment,
  forceShowComments = false,
  onBack,
  hideRepliesByDefault = false,
}) => {
  const { id: postId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(forceShowComments);
  const [maxVisibleComments, setMaxVisibleComments] = useState(3);
  const [isCommenting, setIsCommenting] = useState(false);
  const commentEndRef = useRef(null);

  const bgColors = [
    "bg-white dark:bg-gray-800",
    "bg-gray-50 dark:bg-gray-900",
    "bg-blue-50 dark:bg-blue-900/20",
    "bg-green-50 dark:bg-green-900/20",
    "bg-purple-50 dark:bg-purple-900/20",
  ];

  useEffect(() => {
    if ((showComments || forceShowComments) && commentEndRef.current) {
      commentEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showComments, forceShowComments, post.comments]);

  const handleShowComments = () => {
    setShowComments(true);
    onShowComment?.();
  };

  const handleShowMoreComments = () => {
    setMaxVisibleComments((prev) => prev + 5);
  };

  const handleCommentSubmit = async (content) => {
    if (!content.trim() || isCommenting) return;
    setIsCommenting(true);

    try {
      const response = await fetch(`${baseUrl}/v1/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId,
          content,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Không thể thêm bình luận: ${errorText}`);
      }
      const newComment = await response.json();
      dispatch(
        addComment({
          postId,
          comment: {
            id: newComment.id,
            content: newComment.content,
            author: newComment.author?.displayName || user?.username || "Anonymous",
            avatar: newComment.author?.avatarUrl || user?.avatar || null,
            createdAt: newComment.createdAt,
            likesCount: 0,
            liked: false,
            replies: [],
          },
        })
      );
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
    } finally {
      setIsCommenting(false);
    }
  };

  const handleReply = (parentId, comment, update) => {
    dispatch(
      addComment({
        postId,
        comment,
        parentId,
        update,
      })
    );
  };

  const handleDirectMessage = () => {
    const conversationId = `${user.id}-${post.author.id}`;
    dispatch(addConversation({ id: conversationId, recipient: post.author }));
    onNavigateToChat(conversationId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-xl shadow-md p-4 ${bgColors[index % bgColors.length]} border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow`}
    >
      <PostHeader
        post={post}
        showJoinedBadge={post.type === "group"}
        onBack={onBack}
      />
      <PostContent post={post} isSafeMode={false} className="mt-4" />
      {post.type === "group" && (
        <JoinGroupButton
          groupId={post.id}
          status={post.joinStatus}
          className="mt-3"
        />
      )}
      <div className="flex items-center justify-between mt-4">
        <PostActions
          post={post}
          onComment={handleShowComments}
        />
        {post.author.id !== user?.id && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDirectMessage}
            title="Nhắn tin"
            className="!rounded-full"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>
        )}
      </div>
      <PostComments
        comments={post.comments}
        show={showComments || forceShowComments}
        maxVisible={maxVisibleComments}
        onShowMore={handleShowMoreComments}
        onReply={handleReply}
        hideRepliesByDefault={hideRepliesByDefault}
        className="mt-4"
      />
      {(showComments || forceShowComments) && (
        <CommentForm
          onSubmit={handleCommentSubmit}
          isSubmitting={isCommenting}
          placeholder="Viết bình luận..."
        />
      )}
      <div ref={commentEndRef} />
    </motion.div>
  );
};

export default PostCard;