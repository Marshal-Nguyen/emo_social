import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { aliasService } from '../../services/apiService';

// Compact modal-style alias picker with 1 visible name, dice to cycle
const AliasSelection = ({ onAliasSelected, onError }) => {
    const [queue, setQueue] = useState([]); // cached suggestions
    const [current, setCurrent] = useState(null); // { label, reservationToken, expiredAt }
    const [loading, setLoading] = useState(true);
    const [selecting, setSelecting] = useState(false);
    const [error, setError] = useState(null);
    const shouldReduceMotion = useReducedMotion();

    useEffect(() => {
        refillQueue();
    }, []);

    const refillQueue = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await aliasService.getAliasSuggestions();
            const list = Array.isArray(data?.aliases) ? data.aliases : [];
            if (list.length > 0) {
                setCurrent(list[0]);
                setQueue(list.slice(1));
            } else {
                setCurrent(null);
                setQueue([]);
            }
        } catch (err) {
            console.error('Error loading alias suggestions:', err);
            setError(err.message || 'Không thể tải danh sách tên gợi ý');
            onError?.(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDice = async () => {
        if (queue.length > 0) {
            const [next, ...rest] = queue;
            setCurrent(next);
            setQueue(rest);
            return;
        }
        await refillQueue();
    };

    const handleConfirm = async () => {
        if (!current) return;
        try {
            setSelecting(true);
            setError(null);
            await aliasService.issueAlias(current.label, current.reservationToken);
            await new Promise(r => setTimeout(r, 800));
            const aliasInfo = await aliasService.getCurrentAlias();
            onAliasSelected?.(aliasInfo);
        } catch (err) {
            console.error('Error selecting alias:', err);
            setError(err.message || 'Không thể chọn tên này');
            onError?.(err);
        } finally {
            setSelecting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <motion.div
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.96 }}
                animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-md rounded-2xl border border-purple-200/60 dark:border-purple-800/40 bg-white dark:bg-neutral-900 shadow-2xl"
            >
                <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
                            <span className="text-xl">🎭</span>
                            <span className="font-semibold">Chọn tên của bạn</span>
                        </div>
                        <button
                            className="p-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-300"
                            onClick={handleDice}
                            title="Đổi tên khác (🎲)"
                            aria-label="Đổi tên khác"
                        >
                            🎲
                        </button>
                    </div>

                    {error && (
                        <div className="mb-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
                            {error}
                        </div>
                    )}

                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 rounded-xl px-4 py-3 border border-purple-200/50 dark:border-purple-800/30">
                        <span className="text-gray-900 dark:text-gray-100 font-semibold truncate">
                            {loading ? 'Đang tải...' : (current?.label || 'Không có tên khả dụng')}
                        </span>
                        <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                            {current?.expiredAt ? `Hết hạn: ${new Date(current.expiredAt).toLocaleTimeString('vi-VN')}` : ''}
                        </div>
                    </div>

                    <button
                        className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-md hover:shadow-lg hover:opacity-95 disabled:opacity-60"
                        disabled={loading || selecting || !current}
                        onClick={handleConfirm}
                    >
                        XÁC NHẬN
                    </button>
                </div>

                {selecting && (
                    <div className="absolute inset-0 rounded-2xl bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="bg-white dark:bg-neutral-800 border border-purple-200/60 dark:border-purple-800/40 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                            Đang tạo tên của bạn...
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AliasSelection;
