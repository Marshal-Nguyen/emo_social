# Logic Comment với Replies - Giải thích

## Tổng quan
Logic comment được implement để hiển thị replies từ API và có nút "xem thêm phản hồi" khi cần thiết.

## Cấu trúc dữ liệu

### Comment Object
```javascript
{
  id: "comment-1",
  content: "Nội dung comment",
  author: "Tên người dùng",
  avatar: "URL avatar",
  createdAt: "2024-01-01T00:00:00Z",
  reactionCount: 5,
  replyCount: 8,        // Tổng số replies từ API
  isReactedByCurrentUser: false,
  replies: [            // Array replies đã load
    {
      id: "reply-1",
      content: "Nội dung reply",
      author: "Tên người dùng",
      // ... các field khác
    }
  ]
}
```

## Logic hiển thị

### 1. Kiểm tra có replies không
```javascript
const totalReplyCount = comment.replyCount || 0;  // Từ API
const loadedReplies = comment.replies?.length || 0;  // Đã load
const hasReplies = totalReplyCount > 0;
```

### 2. Auto-hiển thị replies có sẵn
- **Replies từ API**: Tự động hiển thị khi có `comment.replies.length > 0`
- **Auto-open**: Tự động mở section replies khi có replies sẵn

### 3. Logic nút "Xem phản hồi"
- **Có replies sẵn**: Hiển thị "Xem {totalReplyCount} phản hồi" (toggle hiển thị)
- **Chưa load replies**: Hiển thị "Xem {totalReplyCount} phản hồi" (gọi API)
- **Đã load hết**: Hiển thị "Ẩn {totalReplyCount} phản hồi"

### 4. Logic nút "Xem thêm phản hồi"
```javascript
const hasMoreReplies = totalReplyCount > loadedReplies && loadedReplies > 0;
```

- Chỉ hiển thị khi: `replyCount > replies.length` VÀ `replies.length > 0`
- Text: "Xem thêm {totalReplyCount - loadedReplies} phản hồi"
- Click → Gọi API để load thêm replies

## API Calls

### 1. Load comments ban đầu
```javascript
postsService.getComments(postId, 1, 20) // Load 20 comments đầu tiên
```

### 2. Load replies
```javascript
postsService.getComments(postId, pageIndex, 20, parentCommentId)
```

### 3. Load thêm replies
```javascript
// Tính page dựa trên số replies đã load
const pageIndex = Math.floor(existingRepliesCount / 20) + 1;
postsService.getComments(postId, pageIndex, 20, commentId)
```

## Redux Actions

### 1. setComments
- Load comments ban đầu từ API
- Map structure từ API sang internal structure
- Set `replies` array từ API response

### 2. fetchRepliesSuccess
- Append replies mới vào existing replies
- Filter duplicates dựa trên ID
- Không replace toàn bộ replies array

### 3. addComment
- Thêm comment/reply mới
- Update `replyCount` và `commentCount`
- Support optimistic updates

## UI States

### 1. Comment không có replies
- Không hiển thị nút gì

### 2. Comment có replies chưa load
- Hiển thị: "Xem {totalReplyCount} phản hồi"
- Click → Load replies từ API

### 3. Comment có replies đã load một phần
- Hiển thị replies đã load
- Hiển thị: "Xem thêm {remaining} phản hồi"
- Click → Load thêm replies

### 4. Comment có replies đã load hết
- Hiển thị tất cả replies
- Hiển thị: "Ẩn {totalReplyCount} phản hồi"
- Click → Ẩn replies

## Test Cases

### Test 1: Comment có 8 replies, đã load 3
- `replyCount = 8`
- `replies.length = 3`
- Hiển thị: "Xem thêm 5 phản hồi"

### Test 2: Comment có 15 replies, chưa load
- `replyCount = 15`
- `replies.length = 0`
- Hiển thị: "Xem 15 phản hồi"

### Test 3: Comment không có replies
- `replyCount = 0`
- `replies.length = 0`
- Không hiển thị nút

## Cách test
1. Truy cập `/test-comments` để xem demo
2. Kiểm tra các trường hợp khác nhau
3. Test API calls với real data

## Files đã thay đổi
- `src/components/molecules/PostComments.jsx` - Logic chính
- `src/store/postsSlice.js` - Redux actions
- `src/test-comment-logic.jsx` - Test component
- `src/router/index.jsx` - Thêm route test
