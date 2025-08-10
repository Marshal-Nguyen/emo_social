# 🎯 DEMO Features Guide - EmoSocial

## 🌟 Tính năng chính đã hoàn thành

### 1. 🔐 Authentication System

**Trang đăng nhập/đăng ký:**

- Form validation với error handling
- Anonymous name generator (VD: MysteriousFox42)
- Smooth transition giữa login/register
- Breathing animation loading
- Mock authentication (bất kỳ email/password nào cũng được)

**Cách test:**

- Mở http://localhost:5173
- Thử đăng ký với email bất kỳ
- Xem tên ẩn danh được tạo tự động
- Hoặc đăng nhập với email/password bất kỳ

### 2. 🛡️ Safe Mode

**Chế độ an toàn:**

- Toggle ở header (icon Shield)
- Tự động blur nội dung nhạy cảm
- Badge "Safe Mode" khi bật
- Lưu trạng thái trong localStorage

**Cách test:**

- Đăng nhập vào trang chính
- Click icon 🛡️ ở header
- Xem post có từ khóa nhạy cảm bị làm mờ
- Hover để xem tạm thời

### 3. 📝 Post System

**Tạo và tương tác bài viết:**

- Tạo post với character counter
- Like/Unlike posts
- Comment system
- Join group từ post
- Direct message từ post

**Cách test:**

- Viết bài viết mới (tối đa 500 ký tự)
- Click "Chia sẻ" để đăng
- Tương tác với các post có sẵn
- Thử "Tham gia nhóm" và "Nhắn riêng"

### 4. 💬 Chat System

**Sidebar chat:**

- Danh sách Direct Messages
- Danh sách Groups
- Search functionality
- Online status indicators
- Unread message counters

**Cách test:**

- Click icon chat ở sidebar (desktop) hoặc floating button (mobile)
- Xem danh sách conversations
- Switch giữa tab "Tin nhắn" và "Nhóm"
- Search conversations

### 5. 🌙 Auto Theme System

**Dark/Light mode tự động:**

- 6:00 AM → Light Mode
- 6:00 PM → Dark Mode
- Manual toggle option
- Smooth transitions

**Cách test:**

- Click icon Sun/Moon ở header
- Thay đổi thời gian system để test auto switch
- Xem theme transition smooth

### 6. 📱 Responsive Design

**Multi-device support:**

- Mobile: Bottom nav, fullscreen chat
- Tablet: Adaptive layout
- Desktop: 3-column layout

**Cách test:**

- Resize browser window
- Test trên mobile device
- Check floating chat button trên mobile

## 🎨 UI/UX Features

### ✨ Animations

- **Framer Motion**: Page transitions, card animations
- **Breathing Effect**: Loading spinner nhỏ → to → nhỏ
- **Hover Effects**: Buttons, cards, interactive elements
- **Micro Interactions**: Like button, theme toggle

### 🎯 Interactive Elements

- **Smart Buttons**: Loading states, disabled states
- **Form Validation**: Real-time error display
- **Toast Notifications**: Welcome message khi đăng nhập
- **Keyboard Shortcuts**: Enter to submit forms

### 🖼️ Visual Design

- **Purple Pastel Theme**: Calming, mental health focused
- **Gradient Backgrounds**: Subtle, non-distracting
- **Typography**: Inter font, readable hierarchy
- **Spacing**: Consistent, clean layout

## 📊 Mock Data Demo

### Sample Posts

1. **Post buồn**: "Hôm nay cảm thấy khá buồn..." (có comment)
2. **Post tip**: "Chia sẻ tip thiền..." (nhiều likes)
3. **Post tìm nhóm**: "Có ai muốn tham gia nhóm sách..." (join group)
4. **Post nhạy cảm**: "...tuyệt vọng..." (bị blur trong safe mode)

### Sample Conversations

- **MysteriousFox42**: Recent DM với unread messages
- **PeacefulMoon16**: Older conversation
- **Nhóm Sách Tâm Lý**: Group chat với nhiều unread
- **Hỗ trợ & Chia sẻ**: Pending group approval

### Anonymous Names Generated

- MysteriousFox42, PeacefulMoon16, WiseOwl23, SilentStar77
- GentleWolf89, KindHeart91, etc.

## 🔧 Technical Features

### State Management

- **Redux Toolkit**: Modern Redux với slices
- **Persistent State**: Theme, safe mode trong localStorage
- **Real-time Updates**: Like, comment, join status

### Performance

- **Lazy Loading**: Components load khi cần
- **Optimized Rendering**: React.memo cho heavy components
- **Smooth Scrolling**: Custom scrollbar design

### Accessibility

- **Keyboard Navigation**: Tab through elements
- **Screen Reader**: ARIA labels
- **Color Contrast**: WCAG compliant
- **Focus Management**: Clear focus indicators

## 🎮 Demo Scenarios

### Scenario 1: First Time User

1. Mở app → Thấy auth page với animation
2. Đăng ký → Xem tên ẩn danh được tạo
3. Đăng nhập → Welcome notification
4. Thấy feed với mock posts
5. Tạo post đầu tiên

### Scenario 2: Safe Mode User

1. Bật Safe Mode ở header
2. Scroll feed → Thấy sensitive content bị blur
3. Hover để xem temporary
4. Tắt Safe Mode → Content hiển thị normal

### Scenario 3: Social Features

1. Like/comment posts
2. Click "Tham gia nhóm" → Thấy status change
3. Click "Nhắn riêng" → Mở chat sidebar
4. Browse conversations

### Scenario 4: Theme Experience

1. Thay đổi theme manual
2. Để auto mode
3. Thay thời gian system → Thấy auto switch
4. Xem smooth transitions

## 🐛 Demo Limitations

### Mock Data Only

- Không có real backend
- Data reset khi refresh
- Không có persistence (trừ theme)

### Simplified Features

- Chat chỉ có UI, không send được
- Join group chỉ change status
- No real-time updates

### Future Enhancements

- WebSocket integration
- Real API endpoints
- Database persistence
- File upload
- Push notifications

## 🚀 Getting Started

1. **Clone & Install**

   ```bash
   npm install
   npm run dev
   ```

2. **Open Browser**

   - Navigate to http://localhost:5173
   - Best experience on desktop Chrome/Firefox
   - Mobile testing trên device thật

3. **Try All Features**
   - Đăng ký/đăng nhập
   - Tạo posts
   - Toggle safe mode
   - Open chat sidebar
   - Switch themes
   - Test responsive

## 💡 Tips for Demo

### For Developers

- Check Redux DevTools extension
- Inspect component structure
- Monitor console for API calls (mock)
- Test responsive breakpoints

### For Users

- Try different screen sizes
- Test keyboard navigation
- Experience smooth animations
- Notice attention to detail

### For Stakeholders

- Focus on UX flow
- Mental health considerations
- Anonymous but safe environment
- Community-focused features

---

**🎉 Enjoy exploring EmoSocial!**

_Nền tảng được thiết kế với tâm huyết để hỗ trợ sức khỏe tinh thần cộng đồng một cách an toàn và ẩn danh._
