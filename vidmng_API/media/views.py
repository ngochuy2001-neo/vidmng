from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404

from .models import Category, Tag, Video
from .serializers import (
    CategorySerializer, CategoryDetailSerializer, TagSerializer, TagDetailSerializer, VideoListSerializer,
    VideoDetailSerializer, VideoCreateUpdateSerializer,
    VideoStatsSerializer, VideoViewCountSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet cho Category - Hỗ trợ CRUD đầy đủ
    
    list: GET /api/categories/ - Danh sách categories
    create: POST /api/categories/ - Tạo category mới
    retrieve: GET /api/categories/{id}/ - Chi tiết category
    update: PUT /api/categories/{id}/ - Cập nhật category (toàn bộ)
    partial_update: PATCH /api/categories/{id}/ - Cập nhật category (một phần)
    destroy: DELETE /api/categories/{id}/ - Xóa category
    """
    
    queryset = Category.objects.all()
    lookup_field = 'id'
    
    def get_serializer_class(self):
        """Chọn serializer theo action và tham số"""
        include_videos = self.request.query_params.get('include_videos', 'false').lower() == 'true'
        
        if include_videos:
            return CategoryDetailSerializer
        return CategorySerializer
    
    # Thêm filter và search
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_queryset(self):
        """Customize queryset"""
        queryset = Category.objects.all()
        
        # Filter theo slug
        slug = self.request.query_params.get('slug', None)
        if slug:
            queryset = queryset.filter(slug=slug)
        
        # Filter theo tham số query
        has_videos = self.request.query_params.get('has_videos', None)
        if has_videos is not None:
            if has_videos.lower() == 'true':
                queryset = queryset.filter(video__isnull=False).distinct()
            elif has_videos.lower() == 'false':
                queryset = queryset.filter(video__isnull=True)
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def videos(self, request, id=None):
        """Lấy danh sách video trong category"""
        category = self.get_object()
        videos = category.video_set.select_related('category').prefetch_related('tags')
        
        # Filter theo status
        status = request.query_params.get('status', None)
        if status:
            videos = videos.filter(status=status)
        
        # Filter theo tags
        tags = request.query_params.get('tags', None)
        if tags:
            tag_ids = [int(x) for x in tags.split(',') if x.isdigit()]
            videos = videos.filter(tags__id__in=tag_ids).distinct()
        
        # Search
        search = request.query_params.get('search', None)
        if search:
            videos = videos.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        
        # Date filters
        date_from = request.query_params.get('date_from', None)
        date_to = request.query_params.get('date_to', None)
        if date_from:
            videos = videos.filter(created_at__gte=date_from)
        if date_to:
            videos = videos.filter(created_at__lte=date_to)
        
        # Ordering
        ordering = request.query_params.get('ordering', '-created_at')
        if ordering:
            videos = videos.order_by(ordering)
        
        # Phân trang
        page = self.paginate_queryset(videos)
        if page is not None:
            serializer = VideoListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = VideoListSerializer(videos, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def stats(self, request, id=None):
        """Thống kê category"""
        category = self.get_object()
        stats = {
            'total_videos': category.video_set.count(),
            'published_videos': category.video_set.filter(status='published').count(),
            'draft_videos': category.video_set.filter(status='draft').count(),
            'favorite_videos': category.video_set.filter(is_favorite=True).count(),
            'total_views': sum(video.view_count for video in category.video_set.all()),
        }
        return Response(stats)
    
    def destroy(self, request, *args, **kwargs):
        """Xóa category với kiểm tra"""
        category = self.get_object()
        video_count = category.video_set.count()
        
        if video_count > 0:
            return Response(
                {'error': f'Không thể xóa category này vì có {video_count} video đang sử dụng'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return super().destroy(request, *args, **kwargs)


class TagViewSet(viewsets.ModelViewSet):
    """
    ViewSet cho Tag - Hỗ trợ CRUD đầy đủ
    
    list: GET /api/tags/ - Danh sách tags
    create: POST /api/tags/ - Tạo tag mới
    retrieve: GET /api/tags/{id}/ - Chi tiết tag
    update: PUT /api/tags/{id}/ - Cập nhật tag (toàn bộ)
    partial_update: PATCH /api/tags/{id}/ - Cập nhật tag (một phần)
    destroy: DELETE /api/tags/{id}/ - Xóa tag
    """
    
    queryset = Tag.objects.all()
    lookup_field = 'id'
    
    def get_serializer_class(self):
        """Chọn serializer theo action và tham số"""
        include_videos = self.request.query_params.get('include_videos', 'false').lower() == 'true'
        
        if include_videos:
            return TagDetailSerializer
        return TagSerializer
    
    # Thêm filter và search
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']
    ordering = ['name']
    
    def get_queryset(self):
        """Customize queryset"""
        queryset = Tag.objects.all()
        
        # Filter theo slug
        slug = self.request.query_params.get('slug', None)
        if slug:
            queryset = queryset.filter(slug=slug)
        
        # Filter theo tham số query
        has_videos = self.request.query_params.get('has_videos', None)
        if has_videos is not None:
            if has_videos.lower() == 'true':
                queryset = queryset.filter(video__isnull=False).distinct()
            elif has_videos.lower() == 'false':
                queryset = queryset.filter(video__isnull=True)
        
        return queryset
    
    @action(detail=True, methods=['get'])
    def videos(self, request, id=None):
        """Lấy danh sách video có tag này"""
        tag = self.get_object()
        videos = tag.video_set.all()
        
        # Phân trang
        page = self.paginate_queryset(videos)
        if page is not None:
            serializer = VideoListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = VideoListSerializer(videos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Lấy danh sách tag phổ biến (có nhiều video nhất)"""
        tags = Tag.objects.annotate(
            video_count=Count('video')
        ).filter(video_count__gt=0).order_by('-video_count')[:10]
        
        serializer = self.get_serializer(tags, many=True)
        return Response(serializer.data)


class VideoViewSet(viewsets.ModelViewSet):
    """
    ViewSet cho Video - Hỗ trợ CRUD đầy đủ
    
    list: GET /api/videos/ - Danh sách videos
    create: POST /api/videos/ - Tạo video mới
    retrieve: GET /api/videos/{id}/ - Chi tiết video
    update: PUT /api/videos/{id}/ - Cập nhật video (toàn bộ)
    partial_update: PATCH /api/videos/{id}/ - Cập nhật video (một phần)
    destroy: DELETE /api/videos/{id}/ - Xóa video
    """
    
    queryset = Video.objects.all()
    lookup_field = 'id'
    
    # Thêm filter và search
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'status', 'is_favorite']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'created_at', 'view_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Chọn serializer theo action"""
        if self.action == 'list':
            return VideoListSerializer
        elif self.action == 'retrieve':
            return VideoDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return VideoCreateUpdateSerializer
        elif self.action == 'stats':
            return VideoStatsSerializer
        elif self.action == 'increment_view':
            return VideoViewCountSerializer
        else:
            return VideoDetailSerializer
    
    def get_queryset(self):
        """Customize queryset với filters"""
        queryset = Video.objects.select_related('category').prefetch_related('tags')
        
        # Filter theo tags
        tags = self.request.query_params.get('tags', None)
        if tags:
            tag_ids = [int(x) for x in tags.split(',') if x.isdigit()]
            queryset = queryset.filter(tags__id__in=tag_ids).distinct()
        
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        
        date_from = self.request.query_params.get('date_from', None)
        date_to = self.request.query_params.get('date_to', None)
        if date_from:
            queryset = queryset.filter(created_at__gte=date_from)
        if date_to:
            queryset = queryset.filter(created_at__lte=date_to)
        
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        """Chỉ trả về chi tiết video, không tăng view_count"""
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def favorites(self, request):
        """Lấy danh sách video yêu thích"""
        videos = self.get_queryset().filter(is_favorite=True)
        
        page = self.paginate_queryset(videos)
        if page is not None:
            serializer = VideoListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = VideoListSerializer(videos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Lấy danh sách video phổ biến"""
        videos = self.get_queryset().order_by('-view_count')[:20]
        serializer = VideoListSerializer(videos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Lấy danh sách video mới nhất"""
        videos = self.get_queryset().order_by('-created_at')[:20]
        serializer = VideoListSerializer(videos, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Thống kê tổng quan"""
        queryset = self.get_queryset()
        
        stats = {
            'total_videos': queryset.count(),
            'published_videos': queryset.filter(status='published').count(),
            'draft_videos': queryset.filter(status='draft').count(),
            'archived_videos': queryset.filter(status='archived').count(),
            'favorite_videos': queryset.filter(is_favorite=True).count(),
            'total_views': sum(video.view_count for video in queryset),
            'categories_count': Category.objects.count(),
            'tags_count': Tag.objects.count(),
        }
        
        return Response(stats)
    
    @action(detail=False, methods=['post'])
    def bulk_update_status(self, request):
        """Cập nhật trạng thái hàng loạt"""
        video_ids = request.data.get('video_ids', [])
        new_status = request.data.get('status')
        
        if not video_ids or not new_status:
            return Response(
                {'error': 'Cần cung cấp video_ids và status'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if new_status not in ['draft', 'published', 'archived']:
            return Response(
                {'error': 'Trạng thái không hợp lệ'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        updated_count = Video.objects.filter(id__in=video_ids).update(status=new_status)
        
        return Response({
            'updated_count': updated_count,
            'message': f'Đã cập nhật {updated_count} video'
        })
    
    @action(detail=False, methods=['delete'])
    def bulk_delete(self, request):
        """Xóa hàng loạt"""
        video_ids = request.data.get('video_ids', [])
        
        if not video_ids:
            return Response(
                {'error': 'Cần cung cấp video_ids'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        deleted_count, _ = Video.objects.filter(id__in=video_ids).delete()
        
        return Response({
            'deleted_count': deleted_count,
            'message': f'Đã xóa {deleted_count} video'
        })
    
    def destroy(self, request, *args, **kwargs):
        """Override destroy để xóa files"""
        instance = self.get_object()
        
        # Xóa file video và thumbnail
        if instance.video_file:
            instance.video_file.delete(save=False)
        if instance.thumbnail:
            instance.thumbnail.delete(save=False)
        
        return super().destroy(request, *args, **kwargs)