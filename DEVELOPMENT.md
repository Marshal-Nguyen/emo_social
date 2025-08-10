# 🚀 EmoSocial Development Guide

## Cấu trúc thư mục hoàn chỉnh

```
src/
├── components/
│   ├── atoms/              # Thành phần cơ bản nhất
│   │   ├── Avatar.jsx      # Component hiển thị avatar user
│   │   ├── Badge.jsx       # Component badge/tag
│   │   ├── Button.jsx      # Component button tùy biến
│   │   ├── Input.jsx       # Component input form
│   │   └── LoadingSpinner.jsx # Loading spinner với animation
│   │
│   ├── molecules/          # Kết hợp các atoms
│   │   ├── LoginForm.jsx   # Form đăng nhập
│   │   ├── PostCard.jsx    # Card hiển thị bài viết
│   │   ├── RegisterForm.jsx # Form đăng ký
│   │   └── ThemeToggle.jsx # Toggle dark/light mode
│   │
│   ├── organisms/          # Kết hợp molecules + atoms
│   │   ├── ChatSidebar.jsx # Sidebar chat với danh sách
│   │   ├── CreatePost.jsx  # Component tạo bài viết mới
│   │   ├── Feed.jsx        # Feed hiển thị danh sách bài viết
│   │   ├── Header.jsx      # Header chính của app
│   │   └── NotificationSystem.jsx # Hệ thống thông báo
│   │
│   └── templates/          # Layout templates (chưa có)
│
├── pages/                  # Các trang chính
│   ├── AuthPage.jsx       # Trang login/register
│   └── HomePage.jsx       # Trang chính sau khi login
│
├── store/                 # Redux store management
│   ├── authSlice.js       # Auth state (login, user info)
│   ├── chatSlice.js       # Chat state (messages, conversations)
│   ├── postsSlice.js      # Posts state (feed, like, comment)
│   ├── themeSlice.js      # Theme state (dark/light, safe mode)
│   └── index.js           # Store configuration
│
├── services/              # API và external services
│   ├── api.js             # Axios configuration + interceptors
│   └── apiService.js      # API service methods
│
├── hooks/                 # Custom React hooks
│   └── useTheme.js        # Hook for theme management
│
├── utils/                 # Utility functions
│   └── helpers.js         # Helper functions (format, validate, etc.)
│
├── App.jsx               # Main App component
├── main.jsx              # React app entry point
└── index.css             # Global styles với TailwindCSS
```

## 🎯 Các tính năng đã implement

### ✅ Hoàn thành

1. **Authentication System**

   - Login/Register forms với validation
   - Anonymous name generation
   - Redux state management
   - Token-based auth (mock)

2. **Theme System**

   - Auto dark/light mode (6AM/6PM)
   - Manual toggle option
   - Safe mode với blur effect
   - Purple pastel color scheme

3. **Post System**

   - Create post với character limit
   - Post feed với mock data
   - Like/comment functionality
   - Join group từ post
   - Direct message từ post
   - Sensitive content detection

4. **Chat System**

   - Chat sidebar với DM và Groups
   - Conversation list
   - Online status indicators
   - Typing indicators (mock)
   - Mobile responsive

5. **UI/UX**
   - Responsive design (Mobile/Tablet/Desktop)
   - Smooth animations với Framer Motion
   - Breathing loading animation
   - Custom components theo Atomic Design
   - Notification system

### 🚧 Backend Integration Needed

- Real API endpoints thay cho mock data
- WebSocket cho real-time messaging
- Database integration
- File upload cho images
- Push notifications

## 🎨 Design System

### Colors

```css
Primary Purple: #a855f7 → #6366f1
Secondary Pink: #ec4899 → #f97316
Success: #10b981
Warning: #f59e0b
Danger: #ef4444
Neutral Gray: #f9fafb → #111827
```

### Typography

- Font: Inter (Google Fonts)
- Sizes: text-xs (12px) → text-3xl (30px)
- Weights: font-light (300) → font-bold (700)

### Spacing

- Padding/Margin: p-2 (8px) → p-8 (32px)
- Gaps: gap-2 (8px) → gap-8 (32px)
- Rounded: rounded-lg (8px) → rounded-3xl (24px)

## 📱 Responsive Design

### Mobile (<768px)

- Bottom navigation
- Full-screen chat
- Single column layout
- Touch-optimized buttons

### Tablet (768px-1024px)

- Icon-only sidebar
- 2-column layout
- Adaptive spacing

### Desktop (>1024px)

- 3-column layout
- Fixed sidebar
- Hover states
- Keyboard shortcuts

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Custom scripts (có thể thêm vào package.json)
npm run format       # Format code với Prettier
npm run test         # Run tests
npm run type-check   # TypeScript checking
```

## 🚀 Deployment Checklist

### Environment Variables

```env
VITE_API_BASE_URL=https://api.emosocial.com
VITE_WS_URL=wss://ws.emosocial.com
VITE_APP_NAME=EmoSocial
VITE_APP_VERSION=1.0.0
```

### Build Optimization

- [ ] Tree shaking unused code
- [ ] Image optimization
- [ ] Lazy loading components
- [ ] Bundle size analysis
- [ ] Performance testing

### SEO & Accessibility

- [ ] Meta tags
- [ ] Open Graph tags
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Screen reader support

## 🧪 Testing Strategy

### Unit Tests

- Components rendering
- Helper functions
- Redux slices
- Custom hooks

### Integration Tests

- User authentication flow
- Post creation/interaction
- Chat functionality
- Theme switching

### E2E Tests

- Complete user journey
- Cross-browser testing
- Mobile testing
- Performance testing

## 📈 Future Enhancements

### Phase 2

- [ ] Voice messages
- [ ] Image/video posts
- [ ] Advanced emoji reactions
- [ ] Group management
- [ ] Content moderation tools

### Phase 3

- [ ] AI-powered content filtering
- [ ] Mental health resources
- [ ] Crisis support integration
- [ ] Analytics dashboard
- [ ] Multi-language support

## 🐛 Known Issues

1. **TailwindCSS CSS Errors**: Lỗi compile time, nhưng không ảnh hưởng runtime
2. **Mock Data**: Cần thay thế bằng real API
3. **WebSocket**: Chưa implement real-time features
4. **Image Upload**: Component đã có nhưng chưa functional

## 💡 Tips cho Development

### Performance

- Sử dụng React.memo cho components nặng
- Lazy load các routes
- Optimize images và assets
- Debounce search inputs

### Code Quality

- Follow ESLint rules
- Sử dụng TypeScript (tương lai)
- Write meaningful commit messages
- Document complex functions

### UX/UI

- Consistent spacing và typography
- Accessibility-first approach
- Progressive enhancement
- Graceful degradation

---

Happy coding! 🎉
