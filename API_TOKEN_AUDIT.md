# API Token Audit Report

## Vấn đề phát hiện

Có một số API calls vẫn chưa sử dụng authentication token đúng cách:

### ❌ **API calls KHÔNG sử dụng token:**

1. **AuthPage.jsx - Health check** (line 266)
   ```javascript
   const response = await axios.get(`${apiBase}/health`, { timeout: 5000 });
   ```
   - **Vấn đề**: Sử dụng axios trực tiếp, không có token
   - **Impact**: Health check không cần token (OK)

2. **AuthPage.jsx - Login test** (line 271)
   ```javascript
   await axios.post(`${apiBase}/Auth/v2/login`, {
     email: "test@example.com",
     password: "test123"
   }, { timeout: 5000 });
   ```
   - **Vấn đề**: Test login không cần token (OK)

3. **AuthPage.jsx - Login/Register** (lines 505, 519)
   ```javascript
   const resp = await axios.post(`${apiBase}/Auth/v2/login`, ...);
   const resp = await axios.post(`${apiBase}/Auth/v2/register`, ...);
   ```
   - **Vấn đề**: Login/Register không cần token (OK)

4. **AuthPage.jsx - Google login** (line 601)
   ```javascript
   const response = await axios.post(`${apiAuth}/Auth/v2/google/login`, ...);
   ```
   - **Vấn đề**: Google login không cần token (OK)

5. **AuthPage.jsx - Logout** (line 663)
   ```javascript
   await axios.post(`${apiBase}/Auth/v2/logout`, { refreshToken }, ...);
   ```
   - **Vấn đề**: Logout chỉ cần refresh token (OK)

6. **CreatePost.jsx - Create post** (line 506)
   ```javascript
   const response = await axios.post("https://api.emoease.vn/post-service/v1/posts", body, {
     headers: { ...createApiHeaders(), "Idempotency-Key": uuidv4() }
   });
   ```
   - **Vấn đề**: Sử dụng axios trực tiếp thay vì `api` instance
   - **Impact**: Không có auto token refresh, không có error handling

### ✅ **API calls ĐÃ sử dụng token đúng:**

1. **api.js** - Tất cả calls qua `api` instance
   - Có request interceptor thêm token
   - Có response interceptor xử lý 401

2. **apiService.js** - Tất cả postsService methods
   - Sử dụng `getCurrentToken()` và `createApiHeaders()`
   - Có validation token trước khi gọi API

3. **CreatePost.jsx** - Đã sử dụng `createApiHeaders()`
   - Nhưng vẫn dùng axios trực tiếp thay vì `api` instance

## Cần sửa

### 1. **CreatePost.jsx** - Sử dụng `api` instance thay vì axios trực tiếp

**Hiện tại:**
```javascript
const response = await axios.post("https://api.emoease.vn/post-service/v1/posts", body, {
  headers: { ...createApiHeaders(), "Idempotency-Key": uuidv4() }
});
```

**Nên sửa thành:**
```javascript
const response = await api.post("/post-service/v1/posts", body, {
  headers: { "Idempotency-Key": uuidv4() }
});
```

### 2. **Tạo centralized API service cho post-service**

Thay vì hardcode URL, nên tạo service riêng.

## Kết luận

- **AuthPage**: Tất cả API calls đều đúng (login/register không cần token)
- **apiService.js**: Đã sử dụng token đúng cách
- **CreatePost.jsx**: Cần sửa để sử dụng `api` instance
- **api.js**: Đã có interceptor hoàn chỉnh

## Recommendation

1. Sửa CreatePost.jsx để sử dụng `api` instance
2. Tạo centralized post service
3. Đảm bảo tất cả API calls đều qua `api` instance hoặc có token validation
