import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  isFirstMount: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.isFirstMount = true; // Reset isFirstMount khi đăng nhập
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      state.isFirstMount = true; // Reset isFirstMount khi đăng nhập thất bại
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      state.isFirstMount = true; // Reset isFirstMount khi đăng xuất
    },
    clearError: (state) => {
      state.error = null;
    },
    setFirstMountFalse: (state) => {
      state.isFirstMount = false; // Đặt isFirstMount thành false sau lần mount đầu
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError, setFirstMountFalse } =
  authSlice.actions;

export default authSlice.reducer;