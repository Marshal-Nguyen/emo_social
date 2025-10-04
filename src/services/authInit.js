// Service để khởi tạo authentication state từ localStorage
import { store } from '../store';
import { loginSuccess, logout } from '../store/authSlice';

// Decode JWT token
const decodeJwt = (token) => {
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

        // // Validate token
        // const decoded = decodeJwt(token);
        // if (!decoded || !decoded.exp) {
        //     console.log("Invalid token format");
        //     localStorage.removeItem("access_token");
        //     localStorage.removeItem("refresh_token");
        //     localStorage.removeItem("auth_user");
        //     return false;
        // }

        // Check if token is expired
        // const currentTime = Math.floor(Date.now() / 1000);
        // if (decoded.exp <= currentTime) {
        //     console.log("Token expired, clearing auth data");
        //     localStorage.removeItem("access_token");
        //     localStorage.removeItem("refresh_token");
        //     localStorage.removeItem("auth_user");
        //     return false;
        // }

        // Update Redux store
        store.dispatch(loginSuccess({
            user: userData,
            token: token
        }));

        console.log("Authentication initialized from localStorage:", {
            userId: userData.id,
            email: userData.email,
            tokenExpiry: new Date(decoded.exp * 1000).toLocaleString()
        });

        return true;
    } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear potentially corrupted data
        try {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("auth_user");
        } catch { }
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
