from django.db import models
from django.urls import reverse
from django.utils import timezone
from moviepy.editor import VideoFileClip
from django.core.files.base import ContentFile
from io import BytesIO
from PIL import Image
import os


class Category(models.Model):
    """Danh mục video"""
    name = models.CharField(max_length=100, verbose_name="Tên danh mục")
    slug = models.SlugField(max_length=100, unique=True, verbose_name="Slug")
    description = models.TextField(blank=True, verbose_name="Mô tả")
    image = models.ImageField(upload_to='categories', blank=True, verbose_name="Hình ảnh minh họa")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Ngày tạo")
    
    class Meta:
        verbose_name = "Danh mục"
        verbose_name_plural = "Danh mục"
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return reverse('category_detail', kwargs={'slug': self.slug})


class Tag(models.Model):
    """Thẻ tag cho video"""
    name = models.CharField(max_length=50, unique=True, verbose_name="Tên tag")
    slug = models.SlugField(max_length=50, unique=True, verbose_name="Slug")
    
    class Meta:
        verbose_name = "Tag"
        verbose_name_plural = "Tags"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Video(models.Model):
    """Model chính cho video"""
    
    # Các trạng thái video
    STATUS_CHOICES = [
        ('draft', 'Bản nháp'),
        ('published', 'Đã xuất bản'),
        ('archived', 'Đã lưu trữ'),
    ]
    
    # Thông tin cơ bản
    title = models.CharField(max_length=200, verbose_name="Tiêu đề")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
    description = models.TextField(blank=True, verbose_name="Mô tả")
    
    # File video
    video_file = models.FileField(upload_to='videos', verbose_name="File video")
    thumbnail = models.ImageField(upload_to='thumbnails', blank=True, verbose_name="Ảnh thumbnail")
    
    # Phân loại
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Danh mục")
    tags = models.ManyToManyField(Tag, blank=True, verbose_name="Tags")
    
    # Trạng thái
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft', verbose_name="Trạng thái")
    is_favorite = models.BooleanField(verbose_name="Yêu thích")
    
    # Thời gian
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Ngày tạo")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Ngày cập nhật")
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Ngày xuất bản")
    
    # Thống kê
    view_count = models.PositiveIntegerField(verbose_name="Lượt xem")
    
    class Meta:
        verbose_name = "Video"
        verbose_name_plural = "Videos"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('video_detail', kwargs={'slug': self.slug})
    
    def increment_view_count(self):
        self.view_count = models.F('view_count') + 1
        self.save(update_fields=['view_count'])
    
    def save(self, *args, **kwargs):
        # Tự động set published_at khi chuyển sang trạng thái published
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        
        # Gọi save lần đầu để đảm bảo file đã được lưu vào hệ thống
        super().save(*args, **kwargs)

        # Nếu chưa có thumbnail và đã có video file, tạo thumbnail
        if self.video_file and not self.thumbnail:
            self.generate_thumbnail()
            
    def generate_thumbnail(self):
        try:
            clip = VideoFileClip(self.video_file.path)
            frame = clip.get_frame(1.0)  # Lấy frame ở giây thứ 1
            image = Image.fromarray(frame)

            thumb_io = BytesIO()
            image.save(thumb_io, format='JPEG')

            thumb_name = os.path.splitext(os.path.basename(self.video_file.name))[0] + '_thumb.jpg'
            self.thumbnail.save(thumb_name, ContentFile(thumb_io.getvalue()), save=False)

            # Lưu lại model lần nữa để update thumbnail
            super().save(update_fields=['thumbnail'])

        except Exception as e:
            print(f"Lỗi tạo thumbnail: {e}")
