import categoryTagsData from '../data/tagCategory.json';
import emotionTagsData from '../data/tagEmotions.json';

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

// Lấy thông tin category tag từ ID (chỉ dùng JSON data)
export const getCategoryTagById = async (categoryTagId) => {
    if (!categoryTagId) return null;

    // Chỉ tìm trong JSON data, không gọi API
    const jsonResult = categoryTagsData.categoryTags.find(tag => tag.id === categoryTagId);
    if (jsonResult) {
        return jsonResult;
    }

    // Fallback: tạo object với ID nếu không tìm thấy
    return {
        id: categoryTagId,
        displayName: `Category ${categoryTagId.slice(0, 8)}`,
        unicodeCodepoint: "U+1F3F7", // Tag emoji
        code: "unknown"
    };
};

// Lấy thông tin emotion tag từ ID (chỉ dùng JSON data)
export const getEmotionTagById = async (emotionTagId) => {
    if (!emotionTagId) return null;

    // Chỉ tìm trong JSON data, không gọi API
    const jsonResult = emotionTagsData.emotionTags.find(tag => tag.id === emotionTagId);
    if (jsonResult) {
        return jsonResult;
    }

    // Fallback: tạo object với ID nếu không tìm thấy
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
