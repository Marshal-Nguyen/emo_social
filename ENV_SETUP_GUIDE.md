# Hướng dẫn cấu hình môi trường cho AuthPage

## Tạo file .env

Tạo file `.env` trong thư mục gốc của project với nội dung sau:

```env
# API Configuration
VITE_API_AUTH_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here

# Development settings
VITE_APP_ENV=development
```

## Cấu hình API Backend

1. **VITE_API_AUTH_URL**: URL của API backend
   - Ví dụ: `http://localhost:5000/api` (cho development)
   - Ví dụ: `https://your-api-domain.com/api` (cho production)

2. **VITE_GOOGLE_CLIENT_ID**: Client ID từ Google Cloud Console
   - Truy cập [Google Cloud Console](https://console.cloud.google.com/)
   - Tạo project mới hoặc chọn project hiện có
   - Bật Google+ API
   - Tạo OAuth 2.0 Client ID
   - Copy Client ID vào file .env

## Chế độ Demo

Nếu không cấu hình API, AuthPage sẽ tự động chuyển sang chế độ demo:
- Có thể đăng nhập với bất kỳ email nào
- Tạo user demo trong localStorage
- Hiển thị thông báo cảnh báo màu vàng

## Các endpoint API cần thiết

Backend cần có các endpoint sau:

### 1. Login
```
POST /Auth/v2/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "deviceType": "Web",
  "clientDeviceId": "device-id"
}
```

### 2. Register
```
POST /Auth/v2/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "user@example.com",
  "phone": "+84123456789",
  "password": "password123",
  "confirmPassword": "password123",
  "deviceType": "Web",
  "clientDeviceId": "device-id"
}
```

### 3. Google Login
```
POST /Auth/v2/google/login
Content-Type: application/json

{
  "googleIdToken": "google-jwt-token",
  "deviceType": "Web",
  "clientDeviceId": "device-id",
  "intent": "login"
}
```

### 4. Token Refresh
```
POST /Auth/v2/token/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token"
}
```

### 5. Logout
```
POST /Auth/v2/logout
Content-Type: application/json

{
  "refreshToken": "refresh-token"
}
```

## Response Format

Tất cả endpoint thành công nên trả về:

```json
{
  "token": "access-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "avatar": "avatar-url"
  }
}
```

## Kiểm tra cấu hình

1. Khởi động ứng dụng: `npm run dev`
2. Truy cập trang đăng nhập
3. Nếu thấy thông báo "Chế độ Demo" màu vàng, nghĩa là chưa cấu hình API
4. Nếu không thấy thông báo, nghĩa là đã cấu hình thành công

## Troubleshooting

### Lỗi "Cấu hình API chưa được thiết lập"
- Kiểm tra file .env có tồn tại không
- Kiểm tra biến VITE_API_AUTH_URL có được set không
- Restart development server sau khi tạo file .env

### Lỗi CORS
- Cấu hình CORS trong backend để cho phép origin của frontend
- Thêm headers cần thiết trong response

### Lỗi Google Login
- Kiểm tra VITE_GOOGLE_CLIENT_ID có đúng không
- Kiểm tra domain được cấu hình trong Google Console
- Đảm bảo Google+ API đã được bật
