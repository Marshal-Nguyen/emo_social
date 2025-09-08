
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PostCard from "../components/molecules/PostCard";

const PostDetailPage = () => {
    const { id } = useParams();
    const posts = useSelector((state) => state.posts.posts);
    const post = posts.find((p) => String(p.id) === String(id));

    const navigate = useNavigate();
    if (!post) {
        return <div>Không tìm thấy bài viết.</div>;
    }

    // Trick: truyền prop index=0 để PostCard luôn mở khung comment (sẽ sửa PostCard nếu cần)
    return (
        <div className="max-w-3xl mx-auto py-8">
            <PostCard
                post={post}
                index={0}
                showFullContent={true}
                forceShowComments={true}
                hideRepliesByDefault={true}
                onBack={() => navigate(-1)}
                onNavigateToChat={(conversationId) => {
                    navigate(`/chat?id=${conversationId}`);
                }}
            />
        </div>
    );
};

export default PostDetailPage;
