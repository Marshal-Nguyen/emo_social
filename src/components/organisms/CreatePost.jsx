import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Send, Smile, Hash, X, Search } from "lucide-react";
import Button from "../atoms/Button";
import Avatar from "../atoms/Avatar";
import { addPost } from "../../store/postsSlice";
import { generateAnonymousName, sanitizeInput } from "../../utils/helpers";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { postService } from "../../services/postService";
import { tagService } from "../../services/apiService";

// Helper function để xử lý Unicode codepoint an toàn
const getUnicodeEmoji = (unicodeCodepoint) => {
    if (!unicodeCodepoint || typeof unicodeCodepoint !== 'string') return '';

    try {
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

// Mock upload media
const uploadMedia = async (files) => {
    const promises = files.map(file =>
        new Promise(resolve => {
            setTimeout(() => resolve({ mediaId: uuidv4(), url: URL.createObjectURL(file) }), 500);
        })
    );
    return Promise.all(promises);
};

// Reusable CreatePostForm
const CreatePostForm = ({
    content, setContent, title, setTitle,
    categoryTagId, setCategoryTagId, emotionId, setEmotionId,
    isPosting, handleSubmit, handleKeyPress, user,
    categoryTags, emotionTags,
    loadingTags,
    categorySearch, setCategorySearch,
    emotionSearch, setEmotionSearch,
    showCategoryModal, setShowCategoryModal,
    showEmotionModal, setShowEmotionModal,
    selectedCategory, selectedEmotion
}) => (
    <>
        <div className="flex items-center space-x-3 mb-4">
            <Avatar username={user?.username || "Bạn"} size="md" className="w-10 h-10 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                    <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">Công khai</span>
                    <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">Chia sẻ với cộng đồng</span>
                </div>
            </div>
        </div>
        <div className="space-y-4">
            <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700 shadow-sm">
                <textarea
                    placeholder="Viết gì đó..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows={4}
                    className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-0 text-sm leading-relaxed"
                    disabled={isPosting}
                />
            </div>

            {/* Category & Emotion Selection */}
            <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-800 dark:text-gray-200 text-sm font-semibold">Thẻ & Cảm xúc</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setShowCategoryModal(true)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${categoryTagId
                            ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-600"
                            : "bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-purple-200 dark:border-purple-600 shadow-sm hover:shadow-md"
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${categoryTagId ? "bg-purple-500" : "bg-purple-100 dark:bg-purple-900/30"}`}>
                            {selectedCategory && <span className="text-lg">{getUnicodeEmoji(selectedCategory.unicodeCodepoint)}</span>}
                            {!selectedCategory && <Hash className={`w-4 h-4 ${categoryTagId ? "text-white" : "text-purple-600 dark:text-purple-400"}`} />}
                        </div>
                        <div className="text-left">
                            <div className={`text-sm font-medium ${categoryTagId ? "text-purple-800 dark:text-purple-200" : "text-gray-800 dark:text-gray-200"}`}>
                                {selectedCategory ? selectedCategory.displayName : "Danh mục"}
                            </div>
                            <div className={`text-xs ${categoryTagId ? "text-purple-600 dark:text-purple-300" : "text-gray-500 dark:text-gray-400"}`}>
                                {categoryTagId ? "Đã chọn" : "Chọn danh mục"}
                            </div>
                        </div>
                    </button>
                    <button
                        onClick={() => setShowEmotionModal(true)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${emotionId
                            ? "bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-600"
                            : "bg-white dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-purple-200 dark:border-purple-600 shadow-sm hover:shadow-md"
                            }`}
                    >
                        <div className={`p-2 rounded-lg ${emotionId ? "bg-purple-500" : "bg-purple-100 dark:bg-purple-900/30"}`}>
                            {selectedEmotion && <span className="text-lg">{getUnicodeEmoji(selectedEmotion.unicodeCodepoint)}</span>}
                            {!selectedEmotion && <Smile className={`w-4 h-4 ${emotionId ? "text-white" : "text-purple-600 dark:text-purple-400"}`} />}
                        </div>
                        <div className="text-left">
                            <div className={`text-sm font-medium ${emotionId ? "text-purple-800 dark:text-purple-200" : "text-gray-800 dark:text-gray-200"}`}>
                                {selectedEmotion ? selectedEmotion.displayName : "Cảm xúc"}
                            </div>
                            <div className={`text-xs ${emotionId ? "text-purple-600 dark:text-purple-300" : "text-gray-500 dark:text-gray-400"}`}>
                                {emotionId ? "Đã chọn" : "Chọn cảm xúc"}
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            {/* Submit Section */}
            <div className="bg-gradient-to-r from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700 shadow-sm">
                <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${content.length > 500 ? "text-red-500 dark:text-red-400" : content.length > 400 ? "text-amber-500 dark:text-amber-400" : "text-gray-500 dark:text-gray-400"}`}>
                        {content.length}/500
                    </span>
                    <button
                        onClick={handleSubmit}
                        disabled={!content.trim() || content.length > 500 || isPosting}
                        className={`px-6 py-3 text-sm font-semibold rounded-xl flex items-center space-x-2 transition-all duration-200 ${!content.trim() || content.length > 500 || isPosting
                            ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                            }`}
                    >
                        <Send className="w-4 h-4" />
                        <span>{isPosting ? "Đang đăng..." : "Đăng bài"}</span>
                    </button>
                </div>
            </div>
        </div>

        {/* Category Modal */}
        {showCategoryModal && (
            <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between p-4 border-b border-purple-200 dark:border-purple-700 bg-gradient-to-r from-white to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <Hash className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">Chọn Danh mục</h2>
                        </div>
                        <button
                            onClick={() => setShowCategoryModal(false)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/20"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-4 border-b border-purple-200 dark:border-purple-700">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Tìm danh mục..."
                                value={categorySearch}
                                onChange={(e) => setCategorySearch(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 text-sm border border-purple-200 dark:border-purple-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            />
                            {categorySearch && (
                                <button
                                    onClick={() => setCategorySearch("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                            {categoryTags?.filter(tag =>
                                !categorySearch || tag.displayName.toLowerCase().includes(categorySearch.toLowerCase())
                            ).map(tag => {
                                if (!tag || !tag.id || !tag.displayName) return null;
                                const isSelected = categoryTagId === tag.id;
                                return (
                                    <button
                                        key={tag.id}
                                        onClick={() => {
                                            setCategoryTagId(isSelected ? "" : tag.id);
                                            setShowCategoryModal(false);
                                        }}
                                        className={`flex flex-col items-center space-y-1 px-2 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${isSelected
                                            ? "bg-purple-500 text-white shadow-lg transform scale-105"
                                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 hover:shadow-md border border-purple-200 dark:border-purple-600"
                                            }`}
                                    >
                                        <span className="text-lg">{getUnicodeEmoji(tag.unicodeCodepoint)}</span>
                                        <span className="text-center leading-tight text-xs">{tag.displayName}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Emotion Modal */}
        {showEmotionModal && (
            <div className="fixed inset-0 z-[10000] bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl">
                    <div className="flex items-center justify-between p-4 border-b border-purple-200 dark:border-purple-700 bg-gradient-to-r from-white to-purple-50 dark:from-purple-900/20 dark:to-purple-800/20">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <Smile className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">Chọn Cảm xúc</h2>
                        </div>
                        <button
                            onClick={() => setShowEmotionModal(false)}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-800/20"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-4 border-b border-purple-200 dark:border-purple-700">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                placeholder="Tìm cảm xúc..."
                                value={emotionSearch}
                                onChange={(e) => setEmotionSearch(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 text-sm border border-purple-200 dark:border-purple-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            />
                            {emotionSearch && (
                                <button
                                    onClick={() => setEmotionSearch("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                            {emotionTags?.filter(emo =>
                                !emotionSearch || emo.displayName.toLowerCase().includes(emotionSearch.toLowerCase())
                            ).map(emo => {
                                if (!emo || !emo.id || !emo.displayName) return null;
                                const isSelected = emotionId === emo.id;
                                return (
                                    <button
                                        key={emo.id}
                                        onClick={() => {
                                            setEmotionId(isSelected ? "" : emo.id);
                                            setShowEmotionModal(false);
                                        }}
                                        className={`flex flex-col items-center space-y-1 px-2 py-3 rounded-xl text-xs font-medium transition-all duration-200 ${isSelected
                                            ? "bg-purple-500 text-white shadow-lg transform scale-105"
                                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400 hover:shadow-md border border-purple-200 dark:border-purple-600"
                                            }`}
                                    >
                                        <span className="text-lg">{getUnicodeEmoji(emo.unicodeCodepoint)}</span>
                                        <span className="text-center leading-tight text-xs">{emo.displayName}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </>
);

// Error Boundary Component
class CreatePostErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('CreatePost Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-red-500">⚠️</span>
                        <p className="text-red-700 dark:text-red-300 text-sm">
                            Có lỗi xảy ra khi tải form tạo bài viết. Vui lòng thử lại.
                        </p>
                    </div>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="mt-2 text-xs text-red-600 dark:text-red-400 underline"
                    >
                        Thử lại
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

const CreatePost = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.posts);

    // State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [categoryTagId, setCategoryTagId] = useState("");
    const [emotionId, setEmotionId] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showEmotionModal, setShowEmotionModal] = useState(false);
    const [categoryTags, setCategoryTags] = useState([]);
    const [emotionTags, setEmotionTags] = useState([]);
    const [loadingTags, setLoadingTags] = useState(false);
    const [categorySearch, setCategorySearch] = useState("");
    const [emotionSearch, setEmotionSearch] = useState("");

    // Fetch tags/emotions từ API
    useEffect(() => {
        const fetchTags = async () => {
            setLoadingTags(true);
            try {
                const [categoryData, emotionData] = await Promise.all([
                    tagService.getCategoryTags(),
                    tagService.getEmotionTags()
                ]);

                const categories = Array.isArray(categoryData?.categoryTags) ? categoryData.categoryTags : [];
                const emotions = Array.isArray(emotionData?.emotionTags) ? emotionData.emotionTags : [];

                setCategoryTags(categories);
                setEmotionTags(emotions);
            } catch (error) {
                console.error("Failed to fetch tags:", error);
                setCategoryTags([]);
                setEmotionTags([]);
            } finally {
                setLoadingTags(false);
            }
        };

        if (user?.id) {
            fetchTags();
        }
    }, [user?.id]);

    // Lấy thông tin danh mục và cảm xúc đã chọn
    const selectedCategory = categoryTags.find(tag => tag.id === categoryTagId);
    const selectedEmotion = emotionTags.find(emo => emo.id === emotionId);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!content.trim() || isPosting) return;
        setIsPosting(true);
        try {
            const sanitizedContent = sanitizeInput(content) || '';

            const body = {
                content: sanitizedContent,
                visibility: "Public",
            };

            if (title.trim()) body.title = title.trim();
            if (categoryTagId) body.categoryTagId = categoryTagId;
            if (emotionId) body.emotionId = emotionId;

            body.medias = [];

            const apiData = await postService.createPost(body);

            const responseData = apiData || {};
            const newPost = {
                id: responseData.postId || responseData.id || Date.now(),
                content: responseData.content || sanitizedContent,
                title: responseData.title || title.trim() || '',
                visibility: responseData.visibility || "Public",
                categoryTagId: responseData.categoryTagId || categoryTagId || '',
                emotionId: responseData.emotionId || emotionId || '',
                author: {
                    id: user?.id || "anonymous",
                    username: user?.username || generateAnonymousName(),
                    isOnline: true,
                },
                createdAt: apiData.createdAt || new Date().toISOString(),
                likesCount: apiData.likesCount || 0,
                commentsCount: apiData.commentsCount || 0,
                liked: apiData.liked || false,
                comments: apiData.comments || [],
                images: [],
                ...apiData,
            };

            dispatch(addPost(newPost));
            console.log("Bài viết đã được tạo!", newPost);

            setTitle(""); setContent(""); setCategoryTagId(""); setEmotionId("");
            setCategorySearch(""); setEmotionSearch("");
            setShowPopup(false);
        } catch (error) {
            console.error("Failed to create post:", error);
            const errMsg = error.response?.data?.title || error.message || "Lỗi tạo bài viết";
            console.error(errMsg);
        } finally {
            setIsPosting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit(e);
    };

    const handleContainerClick = (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    return (
        <CreatePostErrorBoundary>
            <div
                onClick={handleContainerClick}
                className="bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-600 
             rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
                <div className="flex items-start p-4 space-x-3">
                    {/* Avatar */}
                    <Avatar
                        username={user?.username || "Bạn"}
                        size="md"
                        className="w-10 h-10 flex-shrink-0"
                    />

                    {/* Nội dung */}
                    <div className="flex-1">
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span className="flex items-center space-x-1">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {user?.username || "Bạn"}
                                </span>
                                <span>•</span>
                                <span className="text-green-500">Công khai</span>
                            </span>
                        </div>

                        {/* Ô input */}
                        <div className="relative">
                            <input
                                readOnly
                                onClick={handleContainerClick}
                                placeholder="Bạn đang nghĩ gì thế?"
                                value={content}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-purple-200 dark:border-purple-600 
                     text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 
                     rounded-xl px-4 py-3 focus:outline-none text-base leading-relaxed transition-all 
                     hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                            />
                            <button
                                onClick={handleContainerClick}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-500 hover:bg-purple-600 
                     w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                            >
                                <Send className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>


            {showPopup && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center p-4"
                >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between p-4 border-b border-purple-200 dark:border-purple-600">
                            <h2 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">Tạo bài viết</h2>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                disabled={isPosting}
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                            <CreatePostForm
                                title={title} setTitle={setTitle}
                                content={content} setContent={setContent}
                                categoryTagId={categoryTagId} setCategoryTagId={setCategoryTagId}
                                emotionId={emotionId} setEmotionId={setEmotionId}
                                isPosting={isPosting}
                                handleSubmit={handleSubmit}
                                handleKeyPress={handleKeyPress}
                                user={user}
                                categoryTags={categoryTags}
                                emotionTags={emotionTags}
                                loadingTags={loadingTags}
                                categorySearch={categorySearch} setCategorySearch={setCategorySearch}
                                emotionSearch={emotionSearch} setEmotionSearch={setEmotionSearch}
                                showCategoryModal={showCategoryModal} setShowCategoryModal={setShowCategoryModal}
                                showEmotionModal={showEmotionModal} setShowEmotionModal={setShowEmotionModal}
                                selectedCategory={selectedCategory}
                                selectedEmotion={selectedEmotion}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </CreatePostErrorBoundary>
    );
};

export default CreatePost;