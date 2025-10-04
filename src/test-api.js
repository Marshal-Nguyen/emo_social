// Test file để kiểm tra các API với response mới
import { postsService } from './services/apiService.js';

// Test API Feed
const testFeedAPI = async () => {
    try {
        console.log('🧪 Testing Feed API...');
        const response = await postsService.getPosts(1, 10);
        console.log('✅ Feed API Response:', {
            pageIndex: response.posts.pageIndex,
            pageSize: response.posts.pageSize,
            totalCount: response.posts.totalCount,
            hasNextPage: response.posts.hasNextPage,
            postsCount: response.posts.data.length
        });

        // Test first post structure
        if (response.posts.data.length > 0) {
            const firstPost = response.posts.data[0];
            console.log('📝 First Post Structure:', {
                id: firstPost.id,
                title: firstPost.title,
                content: firstPost.content,
                author: firstPost.author.displayName,
                commentCount: firstPost.commentCount,
                reactionCount: firstPost.reactionCount,
                hasMedia: firstPost.hasMedia
            });
        }
    } catch (error) {
        console.error('❌ Feed API Error:', error.message);
    }
};

// Test API Post Detail
const testPostDetailAPI = async (postId) => {
    try {
        console.log('🧪 Testing Post Detail API...');
        const response = await postsService.getPostDetail(postId);
        console.log('✅ Post Detail API Response:', {
            id: response.postSummary.id,
            title: response.postSummary.title,
            content: response.postSummary.content,
            author: response.postSummary.author.displayName,
            commentCount: response.postSummary.commentCount,
            reactionCount: response.postSummary.reactionCount
        });
    } catch (error) {
        console.error('❌ Post Detail API Error:', error.message);
    }
};

// Test API Comments
const testCommentsAPI = async (postId) => {
    try {
        console.log('🧪 Testing Comments API...');
        const response = await postsService.getComments(postId, 1, 20);
        console.log('✅ Comments API Response:', {
            pageIndex: response.comments.pageIndex,
            totalCount: response.comments.totalCount,
            commentsCount: response.comments.data.length
        });

        // Test first comment structure
        if (response.comments.data.length > 0) {
            const firstComment = response.comments.data[0];
            console.log('💬 First Comment Structure:', {
                id: firstComment.id,
                content: firstComment.content,
                author: firstComment.author.displayName,
                replyCount: firstComment.replyCount,
                repliesCount: firstComment.replies.length
            });
        }
    } catch (error) {
        console.error('❌ Comments API Error:', error.message);
    }
};

// Test API Comment Replies
const testCommentRepliesAPI = async (parentCommentId) => {
    try {
        console.log('🧪 Testing Comment Replies API...');
        const response = await postsService.getCommentReplies(parentCommentId, 1, 20);
        console.log('✅ Comment Replies API Response:', {
            pageIndex: response.comments.pageIndex,
            totalCount: response.comments.totalCount,
            repliesCount: response.comments.data.length
        });
    } catch (error) {
        console.error('❌ Comment Replies API Error:', error.message);
    }
};

// Run all tests
const runAllTests = async () => {
    console.log('🚀 Starting API Tests...\n');

    // Test Feed API
    await testFeedAPI();
    console.log('');

    // Test Post Detail API with sample post ID
    await testPostDetailAPI('adc9a9f9-9dc7-4ec4-9c4d-921d6ef54f61');
    console.log('');

    // Test Comments API
    await testCommentsAPI('adc9a9f9-9dc7-4ec4-9c4d-921d6ef54f61');
    console.log('');

    // Test Comment Replies API
    await testCommentRepliesAPI('0ba7d257-be4d-4e82-b68d-c7ad9e2c4cdc');
    console.log('');

    console.log('✅ All API tests completed!');
};

// Export for use in browser console
if (typeof window !== 'undefined') {
    window.testAPIs = {
        testFeedAPI,
        testPostDetailAPI,
        testCommentsAPI,
        testCommentRepliesAPI,
        runAllTests
    };
}

export {
    testFeedAPI,
    testPostDetailAPI,
    testCommentsAPI,
    testCommentRepliesAPI,
    runAllTests
};
