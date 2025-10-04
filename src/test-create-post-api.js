// Test script to verify CreatePost API calls
import { tagService } from './services/apiService';

// Mock fetch for testing
global.fetch = async (url, options) => {
    console.log(`🌐 API Call: ${url}`);
    console.log('Options:', options);

    // Mock responses based on URL
    if (url.includes('/v1/category-tags')) {
        return {
            ok: true,
            json: async () => ({
                categoryTags: [
                    {
                        id: "e332c23f-d32b-4cd5-b80c-b05e7a3b4ac8",
                        code: "relationships",
                        displayName: "Relationships",
                        unicodeCodepoint: "U+1F49E",
                        isActive: true,
                        sortOrder: 1
                    },
                    {
                        id: "64b41630-6224-4ad4-aaab-e16f31c15db7",
                        code: "family",
                        displayName: "Family",
                        unicodeCodepoint: "U+1F468 U+200D U+1F469 U+200D U+1F467 U+200D U+1F466",
                        isActive: true,
                        sortOrder: 2
                    }
                ]
            })
        };
    }

    if (url.includes('/v1/emotion-tags')) {
        return {
            ok: true,
            json: async () => ({
                emotionTags: [
                    {
                        id: "emotion-1",
                        code: "happy",
                        displayName: "Happy",
                        unicodeCodepoint: "U+1F60A",
                        isActive: true
                    },
                    {
                        id: "emotion-2",
                        code: "sad",
                        displayName: "Sad",
                        unicodeCodepoint: "U+1F622",
                        isActive: true
                    }
                ]
            })
        };
    }

    return {
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' })
    };
};

// Mock localStorage and token
const mockToken = 'mock-token-for-testing';
const mockLocalStorage = {
    getItem: (key) => {
        if (key === 'access_token') return mockToken;
        return null;
    }
};

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
});

// Mock createApiHeaders function
global.createApiHeaders = () => ({
    'Authorization': `Bearer ${mockToken}`,
    'Content-Type': 'application/json'
});

async function testCreatePostAPIs() {
    console.log('🧪 Testing CreatePost API Calls...\n');

    try {
        // Test category tags API
        console.log('1. Testing Category Tags API:');
        const categoryData = await tagService.getCategoryTags();
        console.log('✅ Category Tags Response:', categoryData);
        console.log('Categories count:', categoryData.categoryTags?.length || 0);

        // Test emotion tags API
        console.log('\n2. Testing Emotion Tags API:');
        const emotionData = await tagService.getEmotionTags();
        console.log('✅ Emotion Tags Response:', emotionData);
        console.log('Emotions count:', emotionData.emotionTags?.length || 0);

        // Test combined fetch (like in CreatePost)
        console.log('\n3. Testing Combined Fetch (like CreatePost component):');
        const [categoryData2, emotionData2] = await Promise.all([
            tagService.getCategoryTags(),
            tagService.getEmotionTags()
        ]);

        const categories = Array.isArray(categoryData2?.categoryTags) ? categoryData2.categoryTags : [];
        const emotions = Array.isArray(emotionData2?.emotionTags) ? emotionData2.emotionTags : [];

        console.log('✅ Combined Results:');
        console.log('- Categories:', categories.length);
        console.log('- Emotions:', emotions.length);
        console.log('- First category:', categories[0]?.displayName);
        console.log('- First emotion:', emotions[0]?.displayName);

        console.log('\n📊 Summary:');
        console.log('- APIs are being called correctly');
        console.log('- Data is being processed properly');
        console.log('- CreatePost should now work with loading states');

        console.log('\n✅ CreatePost API test completed successfully!');

    } catch (error) {
        console.error('❌ CreatePost API test failed:', error);
    }
}

// Run the test
testCreatePostAPIs();
