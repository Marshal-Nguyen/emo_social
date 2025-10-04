import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aliasService } from '../../services/apiService';

const AliasSelection = ({ onAliasSelected, onError }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selecting, setSelecting] = useState(false);
    const [error, setError] = useState(null);

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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-2xl"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        Chọn tên của bạn
                    </h1>
                    <p className="text-slate-600">
                        Hãy chọn một tên để sử dụng trong cộng đồng
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
                <div className="space-y-3 mb-6">
                    {suggestions.map((alias, index) => (
                        <motion.button
                            key={`${alias.label}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            onClick={() => handleSelectAlias(alias)}
                            disabled={selecting}
                            className="w-full p-4 bg-white rounded-xl border border-slate-200 hover:border-violet-300 hover:shadow-lg transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-violet-600 transition-colors">
                                        {alias.label}
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Hết hạn: {new Date(alias.expiredAt).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                                <div className="text-violet-500 group-hover:text-violet-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Randomize button */}
                <div className="text-center">
                    <button
                        onClick={handleRandomize}
                        disabled={loading || selecting}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                Đang tải...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Tạo tên khác
                            </>
                        )}
                    </button>
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
