# Test Authentication Flow

## Luồng hoạt động đã được sửa

### 1. **App Startup**
- `App.jsx` gọi `initializeAuth()` từ `authInit.js`
- Kiểm tra localStorage có token và user không
- Nếu có và hợp lệ → cập nhật Redux store
- Nếu không hoặc hết hạn → clear data

### 2. **Router Logic**
- `router/index.jsx` kiểm tra `isAuthenticated` từ Redux
- Nếu `isAuthenticated = true` → hiển thị app bình thường
- Nếu `isAuthenticated = false` → redirect về `/auth`

### 3. **AuthPage Logic**
- Kiểm tra Redux state trước
- Nếu đã authenticated → redirect về home
- Nếu chưa → kiểm tra localStorage và sync với Redux
- Login thành công → cập nhật cả localStorage và Redux

## Test Cases

### ✅ **Test 1: Fresh Start (Chưa đăng nhập)**
1. Clear localStorage
2. Refresh trang
3. **Expected**: Hiển thị AuthPage
4. **Expected**: Debug panel hiển thị "Redux Auth: ✗ Chưa đăng nhập"

### ✅ **Test 2: Login Success**
1. Đăng nhập với email/password hợp lệ
2. **Expected**: 
   - Console log "Authentication successful"
   - Redirect về home page
   - localStorage có token và user
   - Redux state có isAuthenticated = true

### ✅ **Test 3: Refresh After Login**
1. Sau khi login thành công
2. Refresh trang (F5)
3. **Expected**: 
   - Vẫn ở home page (không quay lại login)
   - Redux state được khôi phục từ localStorage
   - Debug panel hiển thị "Redux Auth: ✓ Đã đăng nhập"

### ✅ **Test 4: Token Expired**
1. Đăng nhập thành công
2. Chờ token hết hạn (hoặc manually clear token)
3. Refresh trang
4. **Expected**: 
   - Redirect về AuthPage
   - localStorage được clear
   - Redux state reset

### ✅ **Test 5: Logout**
1. Đang ở home page
2. Dispatch logout event hoặc click logout button
3. **Expected**: 
   - Redirect về AuthPage
   - localStorage cleared
   - Redux state reset

## Debug Tools

### Debug Panel trong AuthPage
- **Redux Auth**: Trạng thái authentication từ Redux
- **Redux Loading**: Trạng thái loading từ Redux
- **LocalStorage Token**: Token trong localStorage
- **LocalStorage User**: User data trong localStorage
- **API Status**: Trạng thái kết nối API

### Console Logs
- `Authentication successful`: Login thành công
- `Found valid authentication in localStorage, initializing Redux`: Khôi phục từ localStorage
- `Already authenticated via Redux, redirecting to home`: Đã authenticated, redirect
- `Token expired, clearing auth data`: Token hết hạn

## Các file đã sửa

1. **`src/services/authInit.js`** - Service khởi tạo auth từ localStorage
2. **`src/App.jsx`** - Khởi tạo auth khi app start
3. **`src/pages/AuthPage.jsx`** - Sử dụng Redux actions thay vì chỉ localStorage
4. **`src/store/authSlice.js`** - Redux slice cho authentication (đã có sẵn)

## Cách test

1. **Mở Developer Tools** (F12)
2. **Vào tab Console** để xem logs
3. **Refresh trang** để test initialization
4. **Sử dụng Debug Panel** để kiểm tra state
5. **Test login/logout** để verify flow

## Troubleshooting

### Nếu vẫn không hoạt động:
1. Check console có lỗi không
2. Check Redux DevTools extension
3. Check localStorage có data không
4. Check network tab có API calls không

### Common Issues:
- **Redux state không sync**: Check `initializeAuth()` có được gọi không
- **Login không redirect**: Check `handleAuthSuccess()` có dispatch action không
- **Refresh mất auth**: Check token validation logic
