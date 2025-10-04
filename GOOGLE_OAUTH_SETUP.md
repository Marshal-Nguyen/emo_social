# Hướng dẫn cấu hình Google OAuth

## Lỗi hiện tại
```
[GSI_LOGGER]: The given origin is not allowed for the given client ID.
```

## Cách sửa lỗi

### 1. Truy cập Google Cloud Console
- Vào [Google Cloud Console](https://console.cloud.google.com/)
- Chọn project có Client ID: `379308644495-8pp0rmhmb57i4j3it5n6t3j9c9tijpj0.apps.googleusercontent.com`

### 2. Cấu hình Authorized Origins
- Vào **APIs & Services** > **Credentials**
- Tìm OAuth 2.0 Client ID của bạn
- Click vào để chỉnh sửa
- Trong phần **Authorized JavaScript origins**, thêm:
  ```
  http://localhost:3000
  http://localhost:5173
  http://127.0.0.1:3000
  http://127.0.0.1:5173
  ```

### 3. Cấu hình Authorized Redirect URIs
- Trong cùng trang, thêm vào **Authorized redirect URIs**:
  ```
  http://localhost:3000
  http://localhost:5173
  http://127.0.0.1:3000
  http://127.0.0.1:5173
  ```

### 4. Cập nhật file .env
```env
VITE_API_AUTH_URL=https://api.emoeease.vn
VITE_GOOGLE_CLIENT_ID=379308644495-8pp0rmhmb57i4j3it5n6t3j9c9tijpj0.apps.googleusercontent.com
```

### 5. Restart development server
```bash
npm run dev
```

## Kiểm tra cấu hình

1. Mở Developer Tools (F12)
2. Vào tab Console
3. Refresh trang
4. Nếu thấy "Google OAuth chưa được cấu hình" → Client ID chưa đúng
5. Nếu thấy lỗi 403 → Origin chưa được thêm vào Google Console

## Troubleshooting

### Lỗi CORS
```
Cross-Origin-Opener-Policy policy would block the window.postMessage call
```
- Đây là lỗi bảo mật của browser
- Thường tự động resolve khi cấu hình đúng origins

### Lỗi 403 Forbidden
- Kiểm tra Client ID có đúng không
- Kiểm tra domain có được thêm vào Authorized Origins không
- Đảm bảo không có typo trong URL

### Google Button không hiển thị
- Kiểm tra file .env có đúng format không
- Restart server sau khi thay đổi .env
- Kiểm tra console có lỗi JavaScript không
