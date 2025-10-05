import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { aliasService } from '../../services/apiService';

const AliasSelection = ({ onAliasSelected, onError }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selecting, setSelecting] = useState(false);
    const [error, setError] = useState(null);
    const shouldReduceMotion = useReducedMotion();

    // Load alias suggestions on component mount
    useEffect(() => {
        loadSuggestions();
    }, []);

    const loadSuggestions = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await aliasService.getAliasSuggestions();
            setSuggestions(data.aliases || []);
        } catch (err) {
            console.error('Error loading alias suggestions:', err);
            setError(err.message || 'Không thể tải danh sách tên gợi ý');
            if (onError) onError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAlias = async (alias) => {
        try {
            setSelecting(true);
            setError(null);

            // Issue the selected alias
            await aliasService.issueAlias(alias.label, alias.reservationToken);

            // Wait a bit for the alias to be processed
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get the current alias info to save to localStorage
            const aliasInfo = await aliasService.getCurrentAlias();

            // Call the callback with the alias information
            if (onAliasSelected) {
                onAliasSelected(aliasInfo);
            }
        } catch (err) {
            console.error('Error selecting alias:', err);
            setError(err.message || 'Không thể chọn tên này');
            if (onError) onError(err);
        } finally {
            setSelecting(false);
        }
    };

    const handleRandomize = () => {
        loadSuggestions();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-600 text-lg">Đang tải danh sách tên gợi ý...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-fuchsia-50 p-4">
            <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { duration: 0.6 }}
                className="w-full max-w-2xl"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={shouldReduceMotion ? {} : { scale: 0.8, opacity: 0 }}
                        animate={shouldReduceMotion ? {} : { scale: 1, opacity: 1 }}
                        transition={shouldReduceMotion ? {} : { duration: 0.6, delay: 0.2 }}
                        className="mb-6"
                    >
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center">
                            <span className="text-3xl">🎭</span>
                        </div>
                    </motion.div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent mb-3">
                        Chọn tên của bạn
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Hãy chọn một tên độc đáo để sử dụng trong cộng đồng
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                    >
                        <p className="text-red-600 text-center">{error}</p>
                    </motion.div>
                )}

                {/* Alias suggestions */}
                <div className="space-y-4 mb-8">
                    {suggestions.map((alias, index) => (
                        <motion.button
                            key={`${alias.label}-${index}`}
                            initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                            animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                            transition={shouldReduceMotion ? {} : { duration: 0.4, delay: index * 0.1 }}
                            onClick={() => handleSelectAlias(alias)}
                            disabled={selecting}
                            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                            whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                            className="w-full p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-violet-300 hover:shadow-xl transition-all duration-300 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center">
                                        <span className="text-xl">🎭</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-violet-600 transition-colors mb-1">
                                            {alias.label}
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Hết hạn: {new Date(alias.expiredAt).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-violet-500 group-hover:text-violet-600 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Randomize button */}
                <div className="text-center">
                    <motion.button
                        onClick={handleRandomize}
                        disabled={loading || selecting}
                        whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold rounded-2xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                        {loading ? (
                            <>
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                <span className="text-lg">Đang tải...</span>
                            </>
                        ) : (
                            <>
                                <motion.div
                                    animate={shouldReduceMotion ? {} : { rotate: 360 }}
                                    transition={shouldReduceMotion ? {} : { duration: 0.5 }}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </motion.div>
                                <span className="text-lg">🎲 Tạo tên khác</span>
                            </>
                        )}
                    </motion.button>
                    <p className="mt-3 text-sm text-slate-500">
                        Không thích? Hãy thử tạo tên mới!
                    </p>
                </div>

                {/* Loading overlay for selection */}
                {selecting && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl p-6 text-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-slate-600">Đang tạo tên của bạn...</p>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AliasSelection;
