import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "../molecules/PostCard";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../atoms/LoadingSpinner";
import Button from "../atoms/Button";
import { fetchPostsSuccess } from "../../store/postsSlice";
import { image } from "framer-motion/client";

// Mock data for demo
const mockPosts = [
  {
    id: 1,
    images: ["https://chus.vn/images/Blog/CH%E1%BB%AEA%20L%C3%80NH%20B%E1%BA%A2N%20TH%C3%82N%20L%C3%80%20G%C3%8C/%E1%BA%A2nh%2001.%20Ch%E1%BB%AFa%20l%C3%A0nh%20b%E1%BA%A3n%20th%C3%A2n%2C%20ch%E1%BB%AFa%20l%C3%A0nh%2C%20xu%20h%C6%B0%E1%BB%9Bng%20ch%E1%BB%AFa%20l%C3%A0nh.png?1721633950094"],
    content:
      "Hôm nay cảm thấy khá buồn vì công việc. Ai cũng có những ngày khó khăn như vậy không? 😔",
    author: {
      id: "user1",
      username: "MysteriousFox42",
      isOnline: true,
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likesCount: 12,
    commentsCount: 3,
    liked: false,
    comments: [
      {
        id: 1,
        content: "Mình cũng vậy, cùng nhau vượt qua nhé! 💪",
        author: "GentleWolf89",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 2,
    images: ["https://bchannel.vn/wp-content/uploads/2023/08/tu-chua-lanhv-vet-thuong-tam-hon.jpg"],
    content:
      "Chia sẻ một tip nhỏ: Khi stress, thử ngồi thiền 10 phút hoặc nghe nhạc nhẹ nhàng. Mình thấy rất hiệu quả! 🧘‍♀️✨",
    author: {
      id: "user2",
      username: "PeacefulMoon16",
      isOnline: false,
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likesCount: 28,
    commentsCount: 7,
    liked: true,
    comments: [],
  },
  {
    id: 3,
    images: ["https://luxuo.vn/wp-content/uploads/2021/07/photo-1624137461186-b1e0196b8702.jpg"],
    content:
      "Có ai muốn tham gia nhóm chat về sách tâm lý học không? Mình muốn tìm những người cùng sở thích để thảo luận và học hỏi! 📚",
    author: {
      id: "user3",
      username: "WiseOwl23",
      isOnline: true,
    },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likesCount: 15,
    commentsCount: 12,
    liked: false,
    comments: [],
  },
  {
    id: 4,
    images: ["https://nguoiduatin.mediacdn.vn/thumb_w/642/media/dong-xuan-thuan/2024/05/06/shutterstock1803134719-2-870x522jpg-.jpeg"],
    content:
      "Gần đây cảm thấy rất cô đơn và tuyệt vọng. Không biết phải làm sao nữa... 😭",
    author: {
      id: "user4",
      username: "SilentStar77",
      isOnline: false,
    },
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    likesCount: 8,
    commentsCount: 15,
    liked: false,
    comments: [
      {
        id: 2,
        content:
          "Bạn không đơn độc đâu! Ở đây có rất nhiều người sẵn sàng lắng nghe và chia sẻ. Hãy tin rằng mọi thứ sẽ tốt lên! ❤️",
        author: "KindHeart91",
        createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];

const Feed = ({ onNavigateToChat }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { posts, loading, error, hasMore } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    // Initialize with mock data for demo
    if (posts.length === 0) {
      dispatch(
        fetchPostsSuccess({
          posts: mockPosts,
          page: 1,
          hasMore: true,
          reset: true,
        })
      );
    }
  }, [dispatch, posts.length]);

  const handleLoadMore = () => {
    // ...existing code...
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" text="Đang tải bài viết..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 max-w-md mx-auto">
          <p className="text-red-800 dark:text-red-200 font-medium">
            Không thể tải bài viết
          </p>
          <p className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
            }}>
            <PostCard
              post={post}
              onNavigateToChat={onNavigateToChat}
              index={index}
              onShowComment={() => navigate(`/post/${post.id}`)}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center py-6">
          {loading ? (
            <LoadingSpinner size="md" text="Đang tải thêm..." />
          ) : (
            <Button
              variant="secondary"
              size="lg"
              onClick={handleLoadMore}
              className="px-8">
              Xem thêm bài viết
            </Button>
          )}
        </div>
      )}

      {/* End of Feed */}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-sm">Bạn đã xem hết tất cả bài viết</span>
            <div className="w-8 h-px bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {posts.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Chưa có bài viết nào
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Hãy là người đầu tiên chia sẻ cảm xúc và câu chuyện của bạn với cộng
            đồng!
          </p>
        </div>
      )}
    </div>
  );
};

export default Feed;