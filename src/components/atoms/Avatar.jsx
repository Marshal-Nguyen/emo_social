import React from "react";

const Avatar = ({
  src,
  alt = "Avatar",
  size = "md",
  username = "Anonymous",
  online = false,
  className = "",
}) => {
  const sizes = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
  };

  const baseClasses = `relative inline-flex items-center justify-center rounded-full bg-purple-500 text-white font-medium ${sizes[size]} ${className}`;

  // Generate initials from username
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={baseClasses}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <span className="select-none">{getInitials(username)}</span>
      )}

      {online && (
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white dark:ring-gray-800"></span>
      )}
    </div>
  );
};

export default Avatar;
