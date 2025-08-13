// CoinButton.jsx
import React from "react";

const CoinButton = ({ onClick }) => (
    <button
        onClick={onClick}
        title="Nhận xu"
        className="w-12 h-12 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 flex items-center justify-center text-yellow-800 font-bold shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
    >
        <span role="img" aria-label="coin" className="text-lg">🪙</span>
    </button>
);

export default CoinButton;
