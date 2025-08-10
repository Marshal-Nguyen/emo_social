import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "../molecules/PostCard";
import LoadingSpinner from "../atoms/LoadingSpinner";
import Button from "../atoms/Button";
import { fetchPostsSuccess } from "../../store/postsSlice";

// Mock data for demo
const mockPosts = [
  {
    id: 1,
    content:
      "Hôm nay cảm thấy khá buồn vì công việc. Ai cũng có những ngày khó khăn như vậy không? 😔",
    author: {
      id: "user1",
      username: "MysteriousFox42",
      isOnline: true,
    },
    type: "group",
    groupName: "Nhóm Hỗ trợ Cảm xúc",
    joinStatus: "not_requested",
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
    content:
      "Chia sẻ một tip nhỏ: Khi stress, thử ngồi thiền 10 phút hoặc nghe nhạc nhẹ nhàng. Mình thấy rất hiệu quả! 🧘‍♀️✨",
    author: {
      id: "user2",
      username: "PeacefulMoon16",
      isOnline: false,
    },
    type: "group",
    groupName: "Nhóm Thiền & Thư giãn",
    joinStatus: "not_requested",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likesCount: 28,
    commentsCount: 7,
    liked: true,
    comments: [],
  },
  {
    id: 3,
    content:
      "Có ai muốn tham gia nhóm chat về sách tâm lý học không? Mình muốn tìm những người cùng sở thích để thảo luận và học hỏi! 📚",
    author: {
      id: "user3",
      username: "WiseOwl23",
      isOnline: true,
    },
    type: "group",
    groupName: "Nhóm Tâm lý học",
    joinStatus: "not_requested",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likesCount: 15,
    commentsCount: 12,
    liked: false,
    comments: [],
  },
  {
    id: 4,
    content:
      "Gần đây cảm thấy rất cô đơn và tuyệt vọng. Không biết phải làm sao nữa... 😭",
    author: {
      id: "user4",
      username: "SilentStar77",
      isOnline: false,
    },
    type: "group",
    groupName: "Nhóm Hỗ trợ Tinh thần",
    joinStatus: "not_requested",
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
  {
    id: 5,
    content:
      "🎨 Tạo nhóm chia sẻ về nghệ thuật trị liệu! Ai quan tâm đến việc dùng vẽ tranh, làm thủ công để giảm stress thì tham gia nha! 🖌️✨",
    author: {
      id: "user5",
      username: "ArtisticSoul88",
      isOnline: true,
    },
    type: "group",
    groupName: "Nghệ thuật Trị liệu",
    joinStatus: "not_requested",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likesCount: 24,
    commentsCount: 8,
    liked: true,
    comments: [],
  },
  {
    id: 6,
    content:
      "💼 Nhóm chia sẻ kinh nghiệm công việc và phát triển sự nghiệp. Cùng nhau học hỏi và phát triển! 🚀",
    author: {
      id: "user6",
      username: "CareerGuru24",
      isOnline: true,
    },
    type: "group",
    groupName: "Phát triển Sự nghiệp",
    joinStatus: "joined",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    likesCount: 35,
    commentsCount: 12,
    liked: false,
    comments: [],
  },
  {
    id: 7,
    content:
      "🏃‍♀️ Ai cũng biết tập thể dục tốt cho sức khỏe tinh thần. Tạo nhóm motivate nhau tập luyện hàng ngày nha! 💪",
    author: {
      id: "user7",
      username: "FitnessMotivator",
      isOnline: false,
    },
    type: "group",
    groupName: "Thể dục & Sức khỏe",
    joinStatus: "pending",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    likesCount: 42,
    commentsCount: 18,
    liked: true,
    comments: [],
  },
];

const Feed = ({ onNavigateToChat }) => {
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
    // TODO: Implement load more posts
    console.log("Load more posts...");
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
            <PostCard post={post} onNavigateToChat={onNavigateToChat} />
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
