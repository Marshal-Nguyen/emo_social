// Service để khởi tạo authentication state từ localStorage
import { store } from '../store';
import { loginSuccess, logout } from '../store/authSlice';

// Decode JWT token
const decodeJwt = (token) => {
    try {
        // Check if token is a valid JWT format (should have 3 parts separated by dots)
        if (!token || typeof token !== 'string') return null;

        const parts = token.split(".");
        if (parts.length !== 3) {
            console.log("Token is not a valid JWT format (should have 3 parts)");
            return null;
        }

        const payload = parts[1];
        if (!payload) return null;

        // Add padding if needed
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);

        // Try to decode base64 first
        let decodedPayload;
        try {
            decodedPayload = atob(padded);
        } catch (base64Error) {
            console.log("Error decoding base64:", base64Error.message);
            return null;
        }

        // Try to parse JSON
        try {
            const decoded = JSON.parse(decodedPayload);
            return decoded;
        } catch (jsonError) {
            console.log("Error parsing JWT payload as JSON:", jsonError.message);
            console.log("Payload content:", decodedPayload.substring(0, 100) + "...");
            return null;
        }
    } catch (error) {
        console.log("Error decoding JWT:", error.message);
        return null;
    }
};

// Khởi tạo authentication state từ localStorage
export const initializeAuth = () => {
    try {
        const token = localStorage.getItem("access_token");
        const userStr = localStorage.getItem("auth_user");

        if (!token || !userStr) {
            console.log("No auth data found in localStorage");
            return false;
        }

        // Parse user data
        let userData;
        try {
            userData = JSON.parse(userStr);
        } catch (e) {
            console.error("Invalid user data in localStorage:", e);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("auth_user");
            return false;
        }

        // Debug token information
        debugToken(token);

        // Validate token - check if it's a valid JWT format first
        const decoded = decodeJwt(token);
        if (!decoded) {
            // Check if it's a demo token or other non-JWT token
            if (token.startsWith("demo-") || token.startsWith("test-") || token.includes("demo")) {
                console.log("Using demo/test token, skipping JWT validation");
            } else {
                console.log("Invalid token format - not a valid JWT and not a demo token");
                // Clear corrupted token
                clearCorruptedAuth();
                return false;
            }
        } else {
            // Valid JWT token - check expiration
            if (decoded.exp) {
                const currentTime = Math.floor(Date.now() / 1000);
                if (decoded.exp <= currentTime) {
                    console.log("Token expired, clearing auth data");
                    clearAuth();
                    return false;
                }
            } else {
                console.log("JWT token has no expiration claim, assuming valid");
            }
        }

        // Update Redux store
        store.dispatch(loginSuccess({
            user: userData,
            token: token
        }));

        console.log("Authentication initialized from localStorage:", {
            userId: userData.id,
            email: userData.email,
            tokenExpiry: decoded?.exp ? new Date(decoded.exp * 1000).toLocaleString() : "No expiration"
        });

        return true;
    } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear potentially corrupted data
        clearCorruptedAuth();
        return false;
    }
};

// Clear authentication data
export const clearAuth = () => {
    try {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("auth_user");
        store.dispatch(logout());
        console.log("Authentication cleared");
    } catch (error) {
        console.error("Error clearing auth:", error);
    }
};

// Clear corrupted auth data
export const clearCorruptedAuth = () => {
    try {
        console.log("Clearing corrupted authentication data");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("auth_user");
        store.dispatch(logout());
    } catch (error) {
        console.error("Error clearing corrupted auth:", error);
    }
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const state = store.getState();
    return state.auth.isAuthenticated;
};

// Get current user
export const getCurrentUser = () => {
    const state = store.getState();
    return state.auth.user;
};

// Get current token
export const getCurrentToken = () => {
    const state = store.getState();
    return state.auth.token;
};

// Debug token information
export const debugToken = (token) => {
    console.log("=== Token Debug Info ===");
    console.log("Token length:", token?.length);
    console.log("Token preview:", token?.substring(0, 50) + "...");
    console.log("Token ends with:", token?.substring(token.length - 10));

    if (token) {
        const parts = token.split(".");
        console.log("JWT parts count:", parts.length);
        if (parts.length === 3) {
            console.log("Header length:", parts[0]?.length);
            console.log("Payload length:", parts[1]?.length);
            console.log("Signature length:", parts[2]?.length);
        }
    }
    console.log("========================");
};
