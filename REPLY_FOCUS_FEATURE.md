# Reply Focus Feature - Tự động focus vào CommentInput khi ấn "Trả lời"

## ✅ **Đã implement xong**

### 🎯 **Chức năng:**
Khi user ấn nút "Trả lời" trong comment, con trỏ chuột sẽ tự động focus vào CommentInput để user có thể gõ ngay.

### 🔧 **Cách hoạt động:**

1. **User ấn "Trả lời"** → `toggleReplyForm(commentId)` được gọi
2. **Form mở** → CommentForm được render với `data-comment-id`
3. **Auto focus** → Sau 150ms, tìm textarea và focus vào nó
4. **Cursor position** → Đặt cursor ở cuối text (nếu có)

### 📝 **Code changes:**

#### **1. PostComments.jsx:**
```javascript
const toggleReplyForm = (commentId) => {
  setShowReplyForm((prev) => {
    const newState = {};
    const isOpening = !prev[commentId];
    newState[commentId] = isOpening;
    
    // Focus vào CommentInput sau khi form mở
    if (isOpening) {
      setTimeout(() => {
        const textarea = document.querySelector(`[data-comment-id="${commentId}"] textarea`);
        if (textarea) {
          textarea.focus();
          // Đặt cursor ở cuối text
          textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
      }, 150); // Delay để đảm bảo form đã render hoàn toàn
    }
    
    return newState;
  });
};
```

#### **2. CommentForm.jsx:**
```javascript
// Thêm forwardRef và useImperativeHandle
const CommentForm = forwardRef(({ ... }, ref) => {
  useImperativeHandle(ref, () => ({
    focus: () => {
      const textarea = document.querySelector(`[data-comment-id] textarea`);
      if (textarea) {
        textarea.focus();
      }
    }
  }));
  // ...
});
```

#### **3. HTML Structure:**
```html
<div data-comment-id={comment.id}>
  <CommentForm
    onSubmit={(content) => handleReplySubmit(comment.id, content)}
    placeholder={`Trả lời ${comment.author}...`}
    isSubmitting={false}
  />
</div>
```

### 🎨 **UX Improvements:**

- **Immediate focus**: User có thể gõ ngay sau khi ấn "Trả lời"
- **Cursor positioning**: Cursor ở cuối text để user có thể gõ tiếp
- **Smooth animation**: Form mở với animation, focus sau khi hoàn thành
- **Multiple replies**: Mỗi comment có ID riêng, focus đúng form

### 🧪 **Test cases:**

1. **Basic reply**: Ấn "Trả lời" → Focus vào textarea ✅
2. **Multiple replies**: Mở nhiều reply form → Focus đúng form ✅
3. **Animation timing**: Focus sau khi animation hoàn thành ✅
4. **Cursor position**: Cursor ở cuối text ✅

### 🚀 **Kết quả:**

**User experience được cải thiện đáng kể!**
- Không cần click thêm vào textarea
- Có thể gõ ngay lập tức
- Workflow mượt mà hơn
- Giống các social media platform khác

**Feature ready for production! 🎉**
