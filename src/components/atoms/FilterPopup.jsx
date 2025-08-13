import React from "react";

const FilterPopup = ({ open, onClose, filters, selected, onSelect, children }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-99">
            {/* Overlay for click outside */}
            <div className="absolute inset-0 bg-gray-500 bg-opacity-50" onClick={onClose} />
            {/* Dropdown panel */}
            <div
                className="absolute left-1/2 top-[72px] -translate-x-1/2 w-full max-w-2xl mx-auto bg-white rounded-b-xl shadow-2xl border-t-0 border border-gray-200 p-6 z-[10000] animate-fadeIn"
                style={{ minWidth: 320 }}
            >
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h3 className="text-lg font-semibold mb-4">Tìm kiếm & Bộ lọc</h3>
                {children}
                <div className="space-y-2">
                    {filters.map((filter) => (
                        <button
                            key={filter.value}
                            className={`w-full text-left px-3 py-2 rounded transition border ${selected === filter.value ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-200'} hover:bg-blue-50`}
                            onClick={() => onSelect(filter.value)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>
            <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease; }
      `}</style>
        </div>
    );
};

export default FilterPopup;