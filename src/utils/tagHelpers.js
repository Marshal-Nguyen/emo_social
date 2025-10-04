import categoryTagsData from '../data/tagCategory.json';
import emotionTagsData from '../data/tagEmotions.json';
import { tagService } from '../services/apiService';

// Helper function để convert Unicode codepoint thành emoji
export const getUnicodeEmoji = (unicodeCodepoint) => {
    if (!unicodeCodepoint || typeof unicodeCodepoint !== 'string') return '';

    try {
        // Xử lý trường hợp có nhiều codepoint (như "U+1F60A U+1F44D")
        const codepoints = unicodeCodepoint.split(' ').map(cp => {
            const cleanCp = cp.replace('U+', '');
            const parsed = parseInt(cleanCp, 16);
            if (isNaN(parsed) || parsed < 0 || parsed > 0x10FFFF) {
                throw new Error(`Invalid codepoint: ${cleanCp}`);
            }
            return parsed;
        });

        return String.fromCodePoint(...codepoints);
    } catch (error) {
        console.warn('Error parsing unicode codepoint:', unicodeCodepoint, error);
        return '';
    }
};

// Cache để lưu data từ API
let categoryTagsCache = null;
let emotionTagsCache = null;

// Fetch category tags từ API
const fetchCategoryTagsFromAPI = async () => {
    if (categoryTagsCache) return categoryTagsCache;
    try {
        const data = await tagService.getCategoryTags();
        console.log('API Category Tags Response:', data);
        categoryTagsCache = data.categoryTags || [];
        console.log('Cached Category Tags:', categoryTagsCache);
        return categoryTagsCache;
    } catch (error) {
        console.error('Error fetching category tags from API:', error);
        return [];
    }
};

// Fetch emotion tags từ API
const fetchEmotionTagsFromAPI = async () => {
    if (emotionTagsCache) return emotionTagsCache;
    try {
        const data = await tagService.getEmotionTags();
        emotionTagsCache = data.emotionTags || [];
        return emotionTagsCache;
    } catch (error) {
        console.error('Error fetching emotion tags from API:', error);
        return [];
    }
};

// Lấy thông tin category tag từ ID
export const getCategoryTagById = async (categoryTagId) => {
    if (!categoryTagId) return null;

    // Tìm trong JSON data trước
    const jsonResult = categoryTagsData.categoryTags.find(tag => tag.id === categoryTagId);
    if (jsonResult) {
        console.log('getCategoryTagById - found in JSON:', jsonResult);
        return jsonResult;
    }

    // Nếu không tìm thấy, fetch từ API
    console.log('getCategoryTagById - not found in JSON, fetching from API:', categoryTagId);
    try {
        const apiTags = await fetchCategoryTagsFromAPI();
        const apiResult = apiTags.find(tag => tag.id === categoryTagId);

        if (apiResult) {
            console.log('getCategoryTagById - found in API:', apiResult);
            return apiResult;
        }
    } catch (error) {
        console.error('Error fetching category tags from API:', error);
    }

    // Fallback: tạo object với ID nếu không tìm thấy
    console.log('getCategoryTagById - not found anywhere, creating fallback for:', categoryTagId);
    return {
        id: categoryTagId,
        displayName: `Category ${categoryTagId.slice(0, 8)}`,
        unicodeCodepoint: "U+1F3F7", // Tag emoji
        code: "unknown"
    };
};

// Lấy thông tin emotion tag từ ID
export const getEmotionTagById = async (emotionTagId) => {
    if (!emotionTagId) return null;

    // Tìm trong JSON data trước
    const jsonResult = emotionTagsData.emotionTags.find(tag => tag.id === emotionTagId);
    if (jsonResult) {
        console.log('getEmotionTagById - found in JSON:', jsonResult);
        return jsonResult;
    }

    // Nếu không tìm thấy, fetch từ API
    console.log('getEmotionTagById - not found in JSON, fetching from API:', emotionTagId);
    const apiTags = await fetchEmotionTagsFromAPI();
    const apiResult = apiTags.find(tag => tag.id === emotionTagId);

    if (apiResult) {
        console.log('getEmotionTagById - found in API:', apiResult);
        return apiResult;
    }

    // Fallback: tạo object với ID nếu không tìm thấy
    console.log('getEmotionTagById - not found anywhere, creating fallback for:', emotionTagId);
    return {
        id: emotionTagId,
        displayName: `Emotion ${emotionTagId.slice(0, 8)}`,
        unicodeCodepoint: "U+1F60A", // Smile emoji
        code: "unknown"
    };
};

// Lấy danh sách category tags từ array IDs hoặc single ID
export const getCategoryTagsByIds = async (categoryTagIds) => {
    // Xử lý cả array và single value
    let ids = categoryTagIds;
    if (!Array.isArray(ids)) {
        ids = ids ? [ids] : [];
    }
    if (ids.length === 0) return [];

    const results = await Promise.all(ids.map(id => getCategoryTagById(id)));
    return results.filter(tag => tag !== null);
};

// Lấy danh sách emotion tags từ array IDs hoặc single ID
export const getEmotionTagsByIds = async (emotionTagIds) => {
    // Xử lý cả array và single value
    let ids = emotionTagIds;
    if (!Array.isArray(ids)) {
        ids = ids ? [ids] : [];
    }
    if (ids.length === 0) return [];

    const results = await Promise.all(ids.map(id => getEmotionTagById(id)));
    return results.filter(tag => tag !== null);
};
