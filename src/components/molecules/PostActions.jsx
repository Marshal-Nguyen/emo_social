// import React from "react";
// import Button from "../atoms/Button";
// import { Repeat2, Share2, MessageCircle, Heart } from "lucide-react";

// const PostActions = ({ post, onLike, onComment, isLiking = false, className = "" }) => {
//   return (
//     <div className={`flex items-center justify-end gap-3 ${className}`}>
//       {/* Like */}
//       <div className="flex items-center gap-1">
//         {post.likesCount > 0 && (
//           <span className="text-md text-gray-600 dark:text-gray-400">{post.likesCount}</span>
//         )}
//         <Button
//           variant="ghost"
//           size="icon"
//           className={`!rounded-full ${post.liked ? 'text-red-500 dark:text-red-500' : 'text-gray-500 hover:text-red-500'} `}
//           title={post.liked ? "Bỏ thích" : "Thích"}
//           onClick={onLike}
//         >
//           <Heart className="w-5 h-5" fill={post.liked ? 'currentColor' : 'none'} />
//         </Button>

//       </div>
//       {/* Comment */}
//       <Button variant="ghost" size="icon" className="!rounded-full" title="Bình luận" onClick={onComment}>
//         <MessageCircle className="w-5 h-5" />
//       </Button>
//       {/* Đăng lại */}
//       <Button variant="ghost" size="icon" className="!rounded-full" title="Đăng lại">
//         <Repeat2 className="w-5 h-5" />
//       </Button>
//       {/* Chia sẻ */}
//       <Button variant="ghost" size="icon" className="!rounded-full" title="Chia sẻ">
//         <Share2 className="w-5 h-5" />
//       </Button>
//     </div>
//   );
// };

// export default PostActions;


// import React, { useState, useEffect } from "react";
// import Button from "../atoms/Button";
// import { Heart, MessageCircle, Eye } from "lucide-react";

// const PostActions = ({ post, onComment, isLiking = false, className = "" }) => {
//   const [liked, setLiked] = useState(false);
//   const [likesCount, setLikesCount] = useState(post.reactionCount || 0);
//   const baseUrl = "https://api.emoease.vn/post-service";
//   const token =
//     "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNGJlN2RjYS1lNDM5LTQxNGEtYWRmZC00M2Y5ZWRmOThmZDciLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk0Mjg1MzMsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.RBtQeGTMko48pp1eAk-CfuaGR9ybcnFkK8fphM5hEFeVHPoG3q8KynbRAaf4ZqOAv72Lj7AoM9pCbuJ_ncY8J-UKnK_01ulQ_soKvtz3GBIxg0C45sjiKSuJ_Xv1-exjCHVFWmLKnZoX15t1-BAX7bd7aZtigEWtcvTLaVLcfmca-8_Qh3J1SQGQtg1C1E-XuqwCr1u-UJaVAkV67k0Jw3G7hZ9e3aUhlYHnec_Fl7AjRZacjb5X9vsb0ecOhjwAZ5-vBl8_h0SZr5-Kp73mYHoFe2YABbuU5JIDHp5y5nyb7dDcytti86nn7zgQRYmO3Wiu4FWEU3KiTYMOnl4JeQ";
//   const [error, setError] = useState(null);

//   // Kiểm tra trạng thái liked ban đầu
//   useEffect(() => {
//     const checkIfLiked = async () => {
//       try {
//         const response = await fetch(
//           `${baseUrl}/v1/reactions?TargetType=Post&TargetId=${post.id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         if (response.ok) {
//           const data = await response.json();
//           // Giả định API trả về danh sách phản ứng, kiểm tra nếu user có reaction "Like"
//           const userLiked = data.some(
//             (reaction) =>
//               reaction.reactionCode === "Like" &&
//               reaction.userId === "4c46a75a-3172-4447-9b69-4f5f07210f4a" // Lấy từ token
//           );
//           setLiked(userLiked);
//         } else {
//           console.warn("Không thể kiểm tra trạng thái thích:", response.status);
//         }
//       } catch (err) {
//         console.error("Lỗi khi kiểm tra trạng thái thích:", err);
//       }
//     };

//     checkIfLiked();
//   }, [post.id]);

//   const handleLike = async () => {
//     if (isLiking) return;
//     const newLikedState = !liked;
//     console.log(`Thực hiện ${newLikedState ? "thích" : "bỏ thích"} bài đăng ${post.id}`);

//     try {
//       if (newLikedState) {
//         const response = await fetch(`${baseUrl}/v1/reactions`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             targetType: "Post",
//             targetId: post.id,
//             reactionCode: "Like",
//           }),
//         });

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Không thể thích bài viết: ${response.status} - ${errorText}`);
//         }
//         console.log("Thích bài viết thành công");
//         setLikesCount((prev) => prev + 1);
//         setLiked(true);
//       } else {
//         const response = await fetch(
//           `${baseUrl}/v1/reactions?TargetType=Post&TargetId=${post.id}`,
//           {
//             method: "DELETE",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Không thể bỏ thích bài viết: ${response.status} - ${errorText}`);
//         }
//         console.log("Bỏ thích bài viết thành công");
//         setLikesCount((prev) => prev - 1);
//         setLiked(false);
//       }
//       setError(null);
//     } catch (error) {
//       console.error("Lỗi khi xử lý lượt thích:", error.message);
//       setError(error.message);
//     } finally {
//       setIsLiking(false);
//     }
//   };

//   return (
//     <div className={`flex items-center justify-end gap-3 ${className}`}>
//       {/* Like */}
//       <div className="flex items-center gap-1">
//         <span className="text-md text-gray-600 dark:text-gray-400">
//           {likesCount}
//         </span>
//         <Button
//           variant="ghost"
//           size="icon"
//           className={`!rounded-full ${liked ? "text-red-500 dark:text-red-500" : "text-gray-500 hover:text-red-500"
//             }`}
//           title={liked ? "Bỏ thích" : "Thích"}
//           onClick={handleLike}
//           disabled={isLiking}
//         >
//           <Heart className="w-5 h-5" fill={liked ? "currentColor" : "none"} />
//         </Button>
//       </div>

//       {/* Comment */}
//       <div className="flex items-center gap-1">
//         <span className="text-md text-gray-600 dark:text-gray-400">
//           {post.commentCount || 0}
//         </span>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="!rounded-full"
//           title="Bình luận"
//           onClick={onComment}
//         >
//           <MessageCircle className="w-5 h-5" />
//         </Button>
//       </div>

//       {/* View */}
//       <div className="flex items-center gap-1">
//         <span className="text-md text-gray-600 dark:text-gray-400">
//           {post.viewCount || 0}
//         </span>
//         <Button
//           variant="ghost"
//           size="icon"
//           className="!rounded-full"
//           title="Lượt xem"
//           disabled
//         >
//           <Eye className="w-5 h-5" />
//         </Button>
//       </div>

//       {/* Hiển thị lỗi nếu có */}
//       {error && (
//         <div className="text-red-500 text-sm mt-2">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostActions;



import React, { useState, useEffect } from "react";
import Button from "../atoms/Button";
import { Heart, MessageCircle, Eye } from "lucide-react";

const PostActions = ({ post, onComment, isLiking = false, className = "" }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.reactionCount || 0);
  const baseUrl = "https://api.emoease.vn/post-service";
  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjMDJlMjFjMS1mM3NmLTQ2MzItYTdjYy0wOTRkMzc3YTY0ZTQiLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk0MTQzMjAsImlzcyI6imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.d2Z7_TykLgWLu9l0FFDHy01x1OicghQZYcxy7Mwme1KfefDPnbsVlviXQyiOlLyyYrzrzBnNBgeyl8HnBDEivDd5tOt93BuMnFXUmKKxhbVxqTUxItwLc1BvPGqsmSugwKCG-J_bGKcsOFO6VkhDKtz8YdHgE4YIihzEIPMHmdK3q5t6Lix5f8mJFYFFtestUhf-_cUXF8MCwPysRKTe-rvXB8RtO9Deiqo3ak4QH-P2bTdt6LQrjWnPK77q6Rb1BR8MfynVsNAkanXnDGJsWovw5L-i466Zm2pa2xl3I0WlGhONwPlvbqoCWTmRqRUTeLZu4TegulgG1GZ_1pcpgg";
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkIfLiked = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/v1/reactions?TargetType=Post&TargetId=${post.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          const userLiked = data.some(
            (reaction) =>
              reaction.reactionCode === "Like" &&
              reaction.userId === "4c46a75a-3172-4447-9b69-4f5f07210f4a"
          );
          setLiked(userLiked);
        } else {
          console.warn("Không thể kiểm tra trạng thái thích:", response.status);
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra trạng thái thích:", err);
      }
    };

    checkIfLiked();
  }, [post.id]);

  const handleLike = async () => {
    if (isLiking) return;
    const newLikedState = !liked;
    console.log(`Thực hiện ${newLikedState ? "thích" : "bỏ thích"} bài đăng ${post.id}`);

    try {
      if (newLikedState) {
        const response = await fetch(`${baseUrl}/v1/reactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            targetType: "Post",
            targetId: post.id,
            reactionCode: "Like",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Không thể thích bài viết: ${response.status} - ${errorText}`);
        }
        console.log("Thích bài viết thành công");
        setLikesCount((prev) => prev + 1);
        setLiked(true);
      } else {
        const response = await fetch(
          `${baseUrl}/v1/reactions?TargetType=Post&TargetId=${post.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Không thể bỏ thích bài viết: ${response.status} - ${errorText}`);
        }
        console.log("Bỏ thích bài viết thành công");
        setLikesCount((prev) => prev - 1);
        setLiked(false);
      }
      setError(null);
    } catch (error) {
      console.error("Lỗi khi xử lý lượt thích:", error.message);
      setError(error.message);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className={`flex items-center justify-end gap-3 ${className}`}>
      <div className="flex items-center gap-1">
        <span className="text-md text-gray-600 dark:text-gray-400">
          {likesCount}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className={`!rounded-full ${liked ? "text-red-500 dark:text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
          title={liked ? "Bỏ thích" : "Thích"}
          onClick={handleLike}
          disabled={isLiking}
        >
          <Heart className="w-5 h-5" fill={liked ? "currentColor" : "none"} />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-md text-gray-600 dark:text-gray-400">
          {post.commentCount || 0}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="!rounded-full"
          title="Bình luận"
          onClick={onComment}
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <span className="text-md text-gray-600 dark:text-gray-400">
          {post.viewCount || 0}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="!rounded-full"
          title="Lượt xem"
          disabled
        >
          <Eye className="w-5 h-5" />
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default PostActions;