# WebSocket Integration Guide

## 🚀 **Tổng quan**

Hệ thống WebSocket đã được tích hợp vào comment system để cung cấp real-time updates cho:
- ✅ **New comments** - Bình luận mới
- ✅ **New replies** - Phản hồi mới  
- ✅ **Comment likes** - Lượt thích bình luận
- ✅ **Comment deletions** - Xóa bình luận

## 📁 **Files đã tạo/cập nhật**

### 1. **WebSocket Service** (`src/services/websocketService.js`)
- Singleton service quản lý WebSocket connection
- Auto-reconnect với exponential backoff
- Event subscription system
- Message handling và routing

### 2. **WebSocket Hook** (`src/hooks/useWebSocket.js`)
- React hook để sử dụng WebSocket trong components
- Tự động subscribe/unsubscribe events
- Redux integration cho real-time updates
- Fallback to API khi WebSocket không kết nối

### 3. **Updated PostComments** (`src/components/molecules/PostComments.jsx`)
- Tích hợp WebSocket hook
- Real-time comment/reply updates
- WebSocket status indicator
- Fallback to API khi cần thiết

### 4. **Updated Redux Store** (`src/store/postsSlice.js`)
- Enhanced `likeComment` reducer cho WebSocket support
- Backward compatibility với existing code

### 5. **Test Components**
- `src/test-websocket.jsx` - WebSocket testing interface
- Route: `/test-websocket`

## 🔧 **Cách sử dụng**

### **1. Kết nối WebSocket**

```javascript
import websocketService from './services/websocketService';

// Kết nối với postId và token
const wsUrl = `wss://api.emoease.vn/ws?postId=${postId}&token=${token}`;
websocketService.connect(wsUrl);
```

### **2. Sử dụng trong Component**

```javascript
import { useWebSocket } from '../hooks/useWebSocket';

const MyComponent = ({ postId }) => {
  const { sendComment, sendReply, sendLike, isConnected } = useWebSocket(postId, true);
  
  // WebSocket sẽ tự động handle real-time updates
  // isConnected cho biết trạng thái kết nối
};
```

### **3. Send Messages**

```javascript
// Gửi comment mới
sendComment(postId, content);

// Gửi reply
sendReply(postId, parentCommentId, content);

// Gửi like
sendLike(postId, commentId, isLiked);
```

## 📡 **WebSocket Events**

### **Incoming Events (từ server)**

| Event | Payload | Mô tả |
|-------|---------|-------|
| `NEW_COMMENT` | `{ postId, comment }` | Bình luận mới |
| `NEW_REPLY` | `{ postId, parentCommentId, reply }` | Phản hồi mới |
| `COMMENT_LIKED` | `{ postId, commentId, isLiked, reactionCount }` | Like comment |
| `COMMENT_DELETED` | `{ postId, commentId }` | Xóa comment |
| `REPLY_DELETED` | `{ postId, replyId }` | Xóa reply |

### **Outgoing Events (gửi lên server)**

| Event | Payload | Mô tả |
|-------|---------|-------|
| `SEND_COMMENT` | `{ postId, content }` | Gửi comment |
| `SEND_REPLY` | `{ postId, parentCommentId, content }` | Gửi reply |
| `LIKE_COMMENT` | `{ postId, commentId, isLiked }` | Like/unlike comment |

## 🎯 **Features**

### **✅ Real-time Updates**
- Comments và replies xuất hiện ngay lập tức
- Like counts cập nhật real-time
- Không cần refresh page

### **✅ Auto-reconnect**
- Tự động kết nối lại khi mất kết nối
- Exponential backoff (1s, 2s, 4s, 8s, 16s)
- Tối đa 5 lần thử

### **✅ Fallback Support**
- Tự động fallback về API khi WebSocket không kết nối
- Seamless user experience

### **✅ Status Indicator**
- Hiển thị trạng thái kết nối (🟢 Connected / 🔴 Disconnected)
- Real-time feedback cho user

## 🧪 **Testing**

### **1. Test WebSocket Connection**
Truy cập: `http://localhost:5173/test-websocket`

### **2. Test Comment Logic**
Truy cập: `http://localhost:5173/test-comments`

### **3. Test Real-time Updates**
1. Mở 2 tab browser
2. Tab 1: Post detail page
3. Tab 2: Test WebSocket page
4. Gửi comment từ tab 1 → Xem real-time update ở tab 2

## ⚙️ **Configuration**

### **WebSocket URL Format**
```
wss://api.emoease.vn/ws?postId={postId}&token={token}
```

### **Environment Variables** (recommended)
```env
VITE_WEBSOCKET_URL=wss://api.emoease.vn/ws
VITE_API_TOKEN=your_token_here
```

### **Custom Configuration**
```javascript
// Trong websocketService.js
const config = {
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  heartbeatInterval: 30000
};
```

## 🔒 **Security**

- ✅ **Token Authentication** - Mỗi connection cần token
- ✅ **Post-specific** - Chỉ nhận updates cho post hiện tại
- ✅ **Auto-disconnect** - Tự động ngắt kết nối khi component unmount

## 🚨 **Troubleshooting**

### **WebSocket không kết nối**
1. Kiểm tra URL và token
2. Kiểm tra network connectivity
3. Xem console logs để debug

### **Messages không được gửi**
1. Kiểm tra `isConnected` status
2. Kiểm tra message format
3. Xem network tab trong DevTools

### **Real-time updates không hoạt động**
1. Kiểm tra WebSocket connection
2. Kiểm tra Redux store updates
3. Kiểm tra component re-renders

## 📈 **Performance**

- ✅ **Efficient Updates** - Chỉ update những gì thay đổi
- ✅ **Memory Management** - Auto cleanup khi component unmount
- ✅ **Connection Pooling** - Reuse connections khi có thể
- ✅ **Debounced Updates** - Tránh spam updates

## 🎉 **Kết luận**

WebSocket system đã được tích hợp hoàn chỉnh với:
- **Real-time comment updates**
- **Automatic fallback to API**
- **User-friendly status indicators**
- **Comprehensive testing tools**
- **Production-ready error handling**

Hệ thống sẵn sàng cho production và có thể scale theo nhu cầu! 🚀
