import React, { memo, forwardRef } from "react";

const Card = memo(
    forwardRef(({ item, isActive, circumference, setActiveId }, ref) => (
        <div
            ref={ref}
            style={{
                backgroundImage: `url(${item.bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
            className={`relative bg-purple-100 rounded-3xl p-4 flex flex-col justify-between snap-center transition-all duration-300 ${isActive ? "scale-100 z-20 opacity-100 w-full brightness-125" : "scale-90 z-10 w-11/12 -mb-20 brightness-75  cursor-pointer"
                }`}
            onClick={() => setActiveId(item.id)}
        >
            <div className="relative z-10">
                <h3 className="text-lg font-semibold text-gray-900 mb-8">{item.title}</h3>
                <p className="text-sm text-gray-900">{item.places}</p>
                <div className="flex mt-2">
                    {item.avatars.map((avt, idx) => (
                        <img
                            key={idx}
                            src={avt}
                            alt={`avatar-${idx}`}
                            className={`w-8 h-8 rounded-full border-2 border-white ${idx === 0 ? "-ml-0" : "-ml-2"}`}
                        />
                    ))}
                    <div className="w-8 h-8 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center -ml-2">
                        +{item.more}
                    </div>
                </div>
            </div>
            <div className="absolute top-4 right-4 z-10">
                <div className="relative w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-14 h-14 transform -rotate-90">
                        <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-gray-300"
                            fill="transparent"
                        />
                        <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-blue-500"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference * (1 - item.percent / 100)}
                            fill="transparent"
                            strokeLinecap="round"
                        />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
                        {item.percent}%
                    </span>
                </div>
            </div>
        </div>
    ))
);

export default Card;