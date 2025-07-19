# Video Management System

Hệ thống quản lý video với giao diện admin được xây dựng bằng Next.js và kết nối với Django REST API.

## Tính năng

### Quản lý Video
- ✅ Xem danh sách tất cả video
- ✅ Tìm kiếm video theo tiêu đề và mô tả
- ✅ Chỉnh sửa thông tin video (tiêu đề, mô tả, danh mục, trạng thái)
- ✅ Xóa video
- ✅ Toggle trạng thái yêu thích
- ✅ Hiển thị thống kê (lượt xem, trạng thái, tags)

### Giao diện
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Confirmation dialogs

## Cấu hình API

### Base URL
```typescript
const API_BASE_URL = 'http://192.168.10.83/api'
```

### Endpoints chính
- `GET /api/videos/` - Lấy danh sách video
- `GET /api/videos/{id}/` - Lấy chi tiết video
- `PATCH /api/videos/{id}/` - Cập nhật video
- `DELETE /api/videos/{id}/` - Xóa video
- `PATCH /api/videos/{id}/toggle_favorite/` - Toggle yêu thích
- `GET /api/categories/` - Lấy danh sách danh mục

## Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy development server
```bash
npm run dev
```

### 3. Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:3000`

## Cấu trúc dự án

```
vidmng_UI/
├── app/
│   ├── admin/
│   │   └── videos/
│   │       └── page.tsx          # Trang quản lý video
│   └── layout.tsx                # Layout chính
├── components/
│   ├── admin/
│   │   ├── admin-sidebar.tsx     # Sidebar admin
│   │   └── video-management.tsx  # Component quản lý video
│   └── ui/                       # UI components
├── lib/
│   └── api.ts                    # API service
└── hooks/
    └── use-toast.ts              # Toast hook
```

## API Service

File `lib/api.ts` chứa tất cả các function gọi API:

```typescript
// Lấy danh sách video
const videos = await videoAPI.getVideos({ search: "keyword" })

// Cập nhật video
const updatedVideo = await videoAPI.updateVideo(id, {
  title: "New Title",
  description: "New Description",
  category: 1,
  status: "published"
})

// Xóa video
await videoAPI.deleteVideo(id)
```

## Xử lý lỗi

Hệ thống có xử lý lỗi toàn diện:
- Loading states cho tất cả operations
- Error messages với toast notifications
- Fallback UI khi không có dữ liệu
- Retry mechanism cho API calls

## Responsive Design

Giao diện được thiết kế responsive:
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Adaptive table layout
- Touch-friendly interactions

## Performance

- Lazy loading cho images
- Optimized API calls
- Debounced search
- Efficient state management
- Minimal re-renders 