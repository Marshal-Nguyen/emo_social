import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PostCard from "../components/molecules/PostCard";

const PostDetailPage = () => {
    const { id } = useParams();
    const posts = useSelector((state) => state.posts.posts);
    const post = posts.find((p) => String(p.id) === String(id));

    if (!post) {
        return <div>Không tìm thấy bài viết.</div>;
    }

    return (
        <div className="max-w-xl mx-auto py-8">
            <PostCard post={post} showFullContent={true} />
            {/* Có thể thêm phần comment ở đây nếu muốn */}
        </div>
    );
};

export default PostDetailPage;
