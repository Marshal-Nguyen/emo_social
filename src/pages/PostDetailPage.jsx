import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../components/molecules/PostCard";
import { fetchPostsStart, fetchPostsSuccess, setComments } from "../store/postsSlice";
import { postsService } from "../services/apiService";

const baseUrl = "https://api.emoease.vn/post-service";
const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNGJlN2RjYS1lNDM5LTQxNGEtYWRmZC00M2Y5ZWRmOThmZDciLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk0Mjg1MzMsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.RBtQeGTMko48pp1eAk-CfuaGR9ybcnFkK8fphM5hEFeVHPoG3q8KynbRAaf4ZqOAv72Lj7AoM9pCbuJ_ncY8J-UKnK_01ulQ_soKvtz3GBIxg0C45sjiKSuJ_Xv1-exjCHVFWmLKnZoX15t1-BAX7bd7aZtigEWtcvTLaVLcfmca-8_Qh3J1SQGQtg1C1E-XuqwCr1u-UJaVAkV67k0Jw3G7hZ9e3aUhlYHnec_Fl7AjRZacjb5X9vsb0ecOhjwAZ5-vBl8_h0SZr5-Kp73mYHoFe2YABbuU5JIDHp5y5nyb7dDcytti86nn7zgQRYmO3Wiu4FWEU3KiTYMOnl4JeQ";


const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const post = useSelector((state) => state.posts.posts.find(p => p.id === id));

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                dispatch(fetchPostsStart());

                // Fetch post data
                const postResponse = await fetch(`${baseUrl}/v1/posts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!postResponse.ok) throw new Error("Không thể tải bài viết");
                const postData = await postResponse.json();

                // Fetch comments using the new API service
                const commentsData = await postsService.getComments(id, 1, 20);

                // Map post data
                const mappedPost = {
                    id: postData.id,
                    content: postData.content,
                    author: {
                        id: postData.author.aliasId,
                        username: postData.author.displayName,
                        avatar: postData.author.avatarUrl || null,
                    },
                    createdAt: postData.createdAt,
                    reactionCount: postData.reactionCount,
                    commentCount: postData.commentCount,
                    viewCount: postData.viewCount,
                    liked: postData.isReactedByCurrentUser || false,
                    comments: [], // Will be loaded separately
                    images: postData.mediaUrls || [],
                    isEnhanced: false,
                    type: postData.visibility?.toLowerCase() || 'public',
                };

                dispatch(fetchPostsSuccess({
                    posts: [mappedPost],
                    reset: true,
                    page: 1,
                    hasMore: false,
                }));

                // Load comments separately using the new structure
                if (commentsData.comments && commentsData.comments.data) {
                    dispatch(setComments({
                        postId: id,
                        comments: commentsData.comments.data
                    }));
                }
            } catch (err) {
                console.error(err.message);
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