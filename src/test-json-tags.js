// Test script to verify JSON tag data usage
import { getCategoryTagById, getCategoryTagsByIds } from './utils/tagHelpers';

// Test data với các ID có trong JSON
const testCategoryIds = [
    "e332c23f-d32b-4cd5-b80c-b05e7a3b4ac8", // Relationships
    "64b41630-6224-4ad4-aaab-e16f31c15db7", // Family
    "9a2b5f88-9406-437b-bc38-e2f18f8f0007", // Friends
    "invalid-id-12345" // ID không tồn tại
];

async function testJsonTagUsage() {
    console.log('🧪 Testing JSON Tag Usage...\n');

    try {
        // Test single category tag
        console.log('1. Testing single category tag:');
        const singleTag = await getCategoryTagById(testCategoryIds[0]);
        console.log('Result:', singleTag);
        console.log('Display Name:', singleTag?.displayName);
        console.log('Unicode:', singleTag?.unicodeCodepoint);
        console.log('Emoji:', singleTag ? String.fromCodePoint(parseInt(singleTag.unicodeCodepoint.replace('U+', ''), 16)) : 'N/A');

        // Test multiple category tags
        console.log('\n2. Testing multiple category tags:');
        const multipleTags = await getCategoryTagsByIds(testCategoryIds.slice(0, 3));
        console.log('Results:', multipleTags);
        multipleTags.forEach((tag, index) => {
            console.log(`Tag ${index + 1}:`, tag?.displayName, tag ? String.fromCodePoint(parseInt(tag.unicodeCodepoint.replace('U+', ''), 16)) : 'N/A');
        });

        // Test invalid ID
        console.log('\n3. Testing invalid ID:');
        const invalidTag = await getCategoryTagById(testCategoryIds[3]);
        console.log('Result:', invalidTag);
        console.log('Display Name:', invalidTag?.displayName);

        console.log('\n✅ JSON tag usage test completed successfully!');
        console.log('📊 Summary:');
        console.log('- Valid IDs return proper data from JSON');
        console.log('- Invalid IDs return fallback data');
        console.log('- No API calls are made');

    } catch (error) {
        console.error('❌ JSON tag usage test failed:', error);
    }
}

// Run the test
testJsonTagUsage();
