# Hướng dẫn sử dụng Idempotency-Key trong API

## Tổng quan
Idempotency-Key được thêm vào các API requests để đảm bảo tính idempotent (không thay đổi kết quả khi gọi nhiều lần). Điều này giúp tránh việc tạo duplicate data khi có lỗi network hoặc user click nhiều lần.

## Các API đã được cập nhật

### 1. Post Service
- ✅ `createPost()` - Tạo bài viết mới
- ✅ `toggleLike()` - Like/Unlike bài viết
- ✅ `addComment()` - Thêm bình luận

### 2. Chat Service
- ✅ `createConversation()` - Tạo cuộc trò chuyện mới
- ✅ `sendMessage()` - Gửi tin nhắn
- ✅ `requestJoinGroup()` - Yêu cầu tham gia nhóm
- ✅ `handleJoinRequest()` - Xử lý yêu cầu tham gia
- ✅ `leaveGroup()` - Rời khỏi nhóm

### 3. Notification Service
- ✅ `markAsRead()` - Đánh dấu thông báo đã đọc
- ✅ `markAllAsRead()` - Đánh dấu tất cả thông báo đã đọc

## Cách hoạt động

### 1. UUID Generation
```javascript
import { generateIdempotencyKey } from '../utils/uuid';

const idempotencyKey = generateIdempotencyKey();
// Tạo ra: "550e8400-e29b-41d4-a716-446655440000"
```

### 2. Sử dụng trong API Request
```javascript
const response = await api.post("/posts", 
    { content, isAnonymous },
    {
        headers: {
            'Idempotency-Key': idempotencyKey
        }
    }
);
```

### 3. Fallback cho browser cũ
- Sử dụng `crypto.randomUUID()` nếu có sẵn
- Fallback về custom UUID generator cho browser cũ

## Lợi ích

### 1. Tránh Duplicate Data
- User click "Tạo bài viết" nhiều lần → Chỉ tạo 1 bài viết
- Network timeout → Retry không tạo duplicate

### 2. Cải thiện UX
- User không lo lắng về việc click nhiều lần
- Giảm confusion khi có lỗi network

### 3. Data Integrity
- Đảm bảo tính nhất quán của dữ liệu
- Tránh race conditions

## Lưu ý

### 1. Server-side Implementation
Server cần implement logic để:
- Lưu trữ Idempotency-Key
- Kiểm tra duplicate requests
- Trả về kết quả cũ nếu request đã được xử lý

### 2. Key Uniqueness
- Mỗi request có Idempotency-Key duy nhất
- Key được generate mới cho mỗi lần gọi API
- Không reuse key giữa các requests khác nhau

### 3. Expiration
- Server có thể set expiration time cho Idempotency-Key
- Thường là 24-48 giờ
- Sau khi expire, key có thể được reuse

## Testing

### 1. Test Duplicate Prevention
```javascript
// Gọi API 2 lần với cùng Idempotency-Key
const key = generateIdempotencyKey();
const response1 = await createPost("Test content", true, key);
const response2 = await createPost("Test content", true, key);

// response1 và response2 phải giống nhau
```

### 2. Test Network Retry
```javascript
// Simulate network error và retry
try {
    await createPost("Test content", true);
} catch (error) {
    // Retry với cùng Idempotency-Key
    await createPost("Test content", true);
}
```

## Monitoring

### 1. Log Idempotency-Key
- Log key trong request logs
- Track duplicate requests
- Monitor key usage patterns

### 2. Metrics
- Số lượng duplicate requests được prevent
- Response time impact
- Error rates

## Kết luận

Idempotency-Key là một pattern quan trọng để đảm bảo tính nhất quán và cải thiện trải nghiệm người dùng. Việc implement đúng cách sẽ giúp ứng dụng robust hơn và tránh được nhiều vấn đề về data integrity.
