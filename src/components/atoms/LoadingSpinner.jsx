import React from "react";

const LoadingSpinner = ({
  size = "md",
  text = null,
  breathing = false,
  variant = "pulse",
  className = "",
}) => {
  const sizes = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
    "2xl": "w-20 h-20",
  };

  const sizeClasses = {
    xs: { spinner: "w-4 h-4", dots: "w-2 h-2", orbit: "w-8 h-8" },
    sm: { spinner: "w-6 h-6", dots: "w-2 h-2", orbit: "w-12 h-12" },
    md: { spinner: "w-8 h-8", dots: "w-3 h-3", orbit: "w-16 h-16" },
    lg: { spinner: "w-12 h-12", dots: "w-4 h-4", orbit: "w-24 h-24" },
    xl: { spinner: "w-16 h-16", dots: "w-5 h-5", orbit: "w-32 h-32" },
    "2xl": { spinner: "w-20 h-20", dots: "w-6 h-6", orbit: "w-40 h-40" },
  };

  // Breathing Animation (enhanced)
  if (breathing) {
    return (
      <div
        className={`flex flex-col items-center justify-center space-y-6 ${className}`}>
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
            <div className="w-10 h-10 bg-white rounded-full animate-pulse shadow-inner"></div>
          </div>
          <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 rounded-full animate-ping opacity-30"></div>
        </div>
        <div className="text-center space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold animate-pulse text-lg">
              Hít vào...
            </p>
            <div
              className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.5s" }}></div>
          </div>
          <p
            className="text-gray-500 dark:text-gray-400 text-sm animate-pulse opacity-70"
            style={{ animationDelay: "1.5s" }}>
            Thở ra...
          </p>
        </div>
      </div>
    );
  }

  // Quantum Dots Loader
  if (variant === "dots") {
    return (
      <div
        className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="flex space-x-1">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`${sizeClasses[size].dots} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce shadow-lg`}
              style={{ animationDelay: `${i * 0.2}s` }}></div>
          ))}
        </div>
        {text && (
          <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse font-medium">
            {text}
          </p>
        )}
      </div>
    );
  }

  // Orbital Loader
  if (variant === "orbital") {
    return (
      <div
        className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className={`relative ${sizeClasses[size].orbit}`}>
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-500 border-l-indigo-500 animate-spin"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
        </div>
        {text && (
          <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse font-medium">
            {text}
          </p>
        )}
      </div>
    );
  }

  // Morphing Loader
  if (variant === "morph") {
    return (
      <div
        className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="relative">
          <div
            className={`${sizeClasses[size].spinner} bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-lg animate-spin shadow-2xl`}
            style={{
              borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
              animation:
                "spin 2s linear infinite, morph 4s ease-in-out infinite",
            }}></div>
          <div
            className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-lg opacity-50 animate-ping"
            style={{
              borderRadius: "70% 30% 30% 70% / 70% 70% 30% 30%",
            }}></div>
        </div>
        {text && (
          <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600 animate-pulse font-semibold">
            {text}
          </p>
        )}
        <style jsx>{`
          @keyframes morph {
            0%,
            100% {
              border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            }
            25% {
              border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
            }
            50% {
              border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
            }
            75% {
              border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
            }
          }
        `}</style>
      </div>
    );
  }

  // Glitch Loader
  if (variant === "glitch") {
    return (
      <div
        className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="relative">
          <div
            className={`${sizeClasses[size].spinner} bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full animate-spin shadow-2xl`}></div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-green-500 to-purple-500 rounded-full animate-ping opacity-20"></div>
          <div className="absolute inset-1 bg-black rounded-full opacity-10 animate-pulse"></div>
        </div>
        {text && (
          <p className="text-sm font-mono text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 animate-pulse font-bold tracking-wider">
            {text}
          </p>
        )}
      </div>
    );
  }

  // Enhanced Pulse (default)
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className="relative">
        <svg
          className={`${sizes[size]} text-transparent`}
          fill="none"
          viewBox="0 0 24 24">
          <defs>
            <linearGradient
              id="spinnerGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="url(#spinnerGradient)"
            strokeWidth="4"
          />
          <path
            className="opacity-90 animate-spin"
            fill="url(#spinnerGradient)"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            style={{
              filter: "drop-shadow(0 0 8px rgba(139, 92, 246, 0.5))",
              animationDuration: "0.8s",
            }}
          />
        </svg>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 opacity-20 animate-ping"></div>
      </div>

      {text && (
        <div className="text-center space-y-1">
          <p className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-medium animate-pulse">
            {text}
          </p>
          <div className="flex justify-center space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.3}s` }}></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Demo Component
const LoadingDemo = () => {
  const variants = ["pulse", "dots", "orbital", "morph", "glitch"];
  const sizes = ["sm", "md", "lg"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Enhanced Loading Spinners ✨
        </h1>

        {/* Breathing Animation */}
        <div className="mb-16 p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">
            Breathing Animation
          </h2>
          <div className="flex justify-center">
            <LoadingSpinner breathing text="Đang thiền định..." />
          </div>
        </div>

        {/* All Variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {variants.map((variant) => (
            <div
              key={variant}
              className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-6 text-center capitalize">
                {variant} Loader
              </h3>
              <div className="flex justify-center">
                <LoadingSpinner
                  variant={variant}
                  size="lg"
                  text={`Loading ${variant}...`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Size Variations */}
        <div className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-8 text-center">
            Size Variations
          </h2>
          <div className="flex justify-center items-end space-x-12">
            {sizes.map((size) => (
              <div key={size} className="text-center">
                <LoadingSpinner size={size} text={size.toUpperCase()} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Sử dụng:{" "}
            <code className="bg-gray-800 px-2 py-1 rounded text-blue-400">
              &lt;LoadingSpinner variant="orbital" size="lg" text="Đang tải..."
              /&gt;
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingDemo;
