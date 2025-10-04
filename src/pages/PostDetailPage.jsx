import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../components/molecules/PostCard";
import { fetchPostsStart, fetchPostsSuccess, setComments } from "../store/postsSlice";
import { postsService } from "../services/apiService";


const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const post = useSelector((state) => state.posts.posts.find(p => p.id === id));

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                dispatch(fetchPostsStart());

                // Fetch post data using the new API service
                const postData = await postsService.getPostDetail(id);

                // Fetch comments using the new API service
                const commentsData = await postsService.getComments(id, 1, 20);

                // Map post data based on the new API response structure
                const mappedPost = {
                    id: postData.postSummary.id,
                    content: postData.postSummary.content,
                    title: postData.postSummary.title,
                    author: {
                        id: postData.postSummary.author.aliasId,
                        username: postData.postSummary.author.displayName,
                        avatar: postData.postSummary.author.avatarUrl || null,
                    },
                    createdAt: postData.postSummary.publishedAt,
                    editedAt: postData.postSummary.editedAt,
                    likesCount: postData.postSummary.reactionCount,
                    commentCount: postData.postSummary.commentCount,
                    commentsCount: postData.postSummary.commentCount, // Sync with PostActions display - lấy từ commentCount của API
                    viewCount: postData.postSummary.viewCount,
                    liked: postData.postSummary.isReactedByCurrentUser || false,
                    comments: [], // Will be loaded separately
                    images: postData.postSummary.medias || [],
                    hasMedia: postData.postSummary.hasMedia,
                    visibility: postData.postSummary.visibility,
                    categoryTagIds: postData.postSummary.categoryTagIds || [],
                    emotionTagIds: postData.postSummary.emotionTagIds || [],
                };

                dispatch(fetchPostsSuccess({
                    posts: [mappedPost],
                    reset: true,
                    page: 1,
                    hasMore: false,
                }));

                // Load comments separately using the new structure
                if (commentsData.comments && commentsData.comments.data) {
                    // Transform comments to handle replies structure
                    const transformedComments = commentsData.comments.data.map(comment => ({
                        id: comment.id,
                        postId: comment.postId,
                        content: comment.content,
                        author: {
                            id: comment.author.aliasId,
                            username: comment.author.displayName,
                            avatar: comment.author.avatarUrl,
                        },
                        createdAt: comment.createdAt,
                        editedAt: comment.editedAt,
                        likesCount: comment.reactionCount,
                        liked: comment.isReactedByCurrentUser,
                        replies: comment.replies || [],
                        replyCount: comment.replyCount,
                        isDeleted: comment.isDeleted,
                        hierarchy: comment.hierarchy,
                    }));

                    dispatch(setComments({
                        postId: id,
                        comments: transformedComments
                    }));
                }
            } catch (err) {
                console.error("Error loading post detail:", err.message);
            }
        };
        fetchPostData();
    }, [dispatch, id]);

    if (!post) return <div className="text-center py-8">Đang tải bài viết...</div>;

    return (
        <div className="max-w-3xl mx-auto py-8">
            <PostCard
                post={post}
                index={0}
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