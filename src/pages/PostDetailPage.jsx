import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/molecules/PostCard";

const baseUrl = "https://api.emoease.vn/post-service";
const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhNGJlN2RjYS1lNDM5LTQxNGEtYWRmZC00M2Y5ZWRmOThmZDciLCJzdWIiOiI0YzQ2YTc1YS0zMTcyLTQ0NDctOWI2OS00ZjVmMDcyMTBmNGEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9hdXRoZW50aWNhdGlvbiI6IkNvbXBsZXRlZCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlVzZXIiLCJleHAiOjE3NTk0Mjg1MzMsImlzcyI6Imh0dHBzOi8vYXBpLmVtb2Vhc2Uudm4iLCJhdWQiOiJodHRwczovL2FwaS5lbW9lYXNlLnZuIn0.RBtQeGTMko48pp1eAk-CfuaGR9ybcnFkK8fphM5hEFeVHPoG3q8KynbRAaf4ZqOAv72Lj7AoM9pCbuJ_ncY8J-UKnK_01ulQ_soKvtz3GBIxg0C45sjiKSuJ_Xv1-exjCHVFWmLKnZoX15t1-BAX7bd7aZtigEWtcvTLaVLcfmca-8_Qh3J1SQGQtg1C1E-XuqwCr1u-UJaVAkV67k0Jw3G7hZ9e3aUhlYHnec_Fl7AjRZacjb5X9vsb0ecOhjwAZ5-vBl8_h0SZr5-Kp73mYHoFe2YABbuU5JIDHp5y5nyb7dDcytti86nn7zgQRYmO3Wiu4FWEU3KiTYMOnl4JeQ";

const mapPostFromApi = (postData, commentsData) => {
    const buildCommentHierarchy = (comments) => {
        const commentMap = {};
        const rootComments = [];

        comments.forEach((comment) => {
            commentMap[comment.id] = {
                id: comment.id,
                content: comment.content,
                author: comment.author.displayName,
                avatar: comment.author.avatarUrl || null,
                createdAt: comment.createdAt,
                likesCount: comment.reactionCount || 0,
                replyCount: comment.replyCount || 0,
                liked: false,
                replies: [],
            };
        });

        comments.forEach((comment) => {
            if (comment.hierarchy.parentCommentId === null) {
                rootComments.push(commentMap[comment.id]);
            } else {
                const parent = commentMap[comment.hierarchy.parentCommentId];
                if (parent) {
                    parent.replies.push(commentMap[comment.id]);
                    parent.replyCount = (parent.replyCount || 0) + 1;
                }
            }
        });

        return rootComments;
    };

    return {
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
        liked: false,
        comments: commentsData ? buildCommentHierarchy(commentsData.data) : [],
        images: postData.mediaUrls || [],
        isEnhanced: false,
        type: postData.visibility.toLowerCase(),
    };
};

const PostDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                setLoading(true);

                const postResponse = await fetch(`${baseUrl}/v1/posts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!postResponse.ok) {
                    throw new Error("Không thể tải bài viết");
                }
                const postData = await postResponse.json();

                const commentsResponse = await fetch(
                    `${baseUrl}/v1/comments/post/${id}?PageIndex=1&PageSize=20&SortBy=CreatedAt&SortDescending=false`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (!commentsResponse.ok) {
                    throw new Error("Không thể tải bình luận");
                }
                const commentsData = await commentsResponse.json();

                const mappedPost = mapPostFromApi(postData, commentsData);
                setPost(mappedPost);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostData();
    }, [id]);

    if (loading) return <div className="text-center py-8">Đang tải bài viết...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Lỗi: {error}</div>;
    if (!post) return <div className="text-center py-8">Không tìm thấy bài viết.</div>;

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