// Test script để kiểm tra token JWT
function decodeJwt(token) {
    try {
        const payload = token?.split(".")?.[1];
        if (!payload) return null;
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const decoded = JSON.parse(
            decodeURIComponent(
                atob(normalized)
                    .split("")
                    .map((c) => ` %${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
                    .join("")
            )
        );
        return decoded;
    } catch {
        return null;
    }
}

// Test với token từ localStorage
const token = localStorage.getItem("access_token");
if (token) {
    console.log("🔍 Testing token:", token.substring(0, 50) + "...");

    const decoded = decodeJwt(token);
    if (decoded) {
        console.log("✅ Token decoded successfully:");
        console.log("User ID:", decoded.sub || decoded.userId);
        console.log("Email:", decoded.email);
        console.log("Name:", decoded.name || decoded.fullName);
        console.log("Expires:", new Date(decoded.exp * 1000).toLocaleString());
        console.log("Is expired:", decoded.exp < Math.floor(Date.now() / 1000));
    } else {
        console.log("❌ Failed to decode token");
    }
} else {
    console.log("❌ No token found in localStorage");
}

// Test với user data
const user = localStorage.getItem("auth_user");
if (user) {
    try {
        const userData = JSON.parse(user);
        console.log("✅ User data found:", userData);
    } catch (e) {
        console.log("❌ Invalid user data format");
    }
} else {
    console.log("❌ No user data found");
}
