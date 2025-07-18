from rest_framework import serializers
from django.db.models import F
from .models import Category, Tag, Video


class CategorySerializer(serializers.ModelSerializer):
    """Serializer cho Category"""
    video_count = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'created_at', 'video_count']
        read_only_fields = ['id', 'created_at', 'video_count']
    
    def get_video_count(self, obj):
        """Đếm số video trong category"""
        return obj.video_set.count()
    
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def validate_name(self, value):
        """Validate tên category"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Tên danh mục phải có ít nhất 2 ký tự")
        return value.strip()
    
    def validate_slug(self, value):
        """Validate slug"""
        if not value.replace('-', '').replace('_', '').isalnum():
            raise serializers.ValidationError("Slug chỉ được chứa chữ cái, số, dấu gạch ngang và gạch dưới")
        return value.lower()



class TagSerializer(serializers.ModelSerializer):
    """Serializer cho Tag"""
    video_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'video_count']
        read_only_fields = ['id', 'video_count']
    
    def get_video_count(self, obj):
        """Đếm số video có tag này"""
        return obj.video_set.count()
    
    def validate_name(self, value):
        """Validate tên tag"""
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Tên tag phải có ít nhất 2 ký tự")
        return value.strip()
    
    def validate_slug(self, value):
        """Validate slug"""
        if not value.replace('-', '').replace('_', '').isalnum():
            raise serializers.ValidationError("Slug chỉ được chứa chữ cái, số, dấu gạch ngang và gạch dưới")
        return value.lower()


class VideoListSerializer(serializers.ModelSerializer):
    """Serializer cho danh sách video (GET list)"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    tag_names = serializers.SerializerMethodField()
    
    class Meta:
        model = Video
        fields = [
            'id', 'title', 'slug', 'thumbnail', 'category_name', 
            'tag_names', 'status', 'is_favorite', 'view_count', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'view_count', 'created_at', 'updated_at']
    
    def get_tag_names(self, obj):
        """Lấy danh sách tên tags"""
        return [tag.name for tag in obj.tags.all()]


class VideoDetailSerializer(serializers.ModelSerializer):
    """Serializer cho chi tiết video (GET detail)"""
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = Video
        fields = [
            'id', 'title', 'slug', 'description', 'video_file', 
            'thumbnail', 'category', 'tags', 'status', 'is_favorite', 
            'view_count', 'created_at', 'updated_at', 'published_at'
        ]
        read_only_fields = ['id', 'view_count', 'created_at', 'updated_at', 'published_at']


class VideoCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer cho tạo/sửa video (POST/PUT/PATCH)"""
    tag_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False,
        help_text="Danh sách ID của tags"
    )
    
    class Meta:
        model = Video
        fields = [
            'title', 'slug', 'description', 'video_file', 'thumbnail', 
            'category', 'tag_ids', 'status', 'is_favorite'
        ]
        extra_kwargs = {
            'thumbnail': {'required': False, 'allow_null': True}
        }
    
    def validate_title(self, value):
        """Validate tiêu đề"""
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Tiêu đề phải có ít nhất 3 ký tự")
        return value.strip()
    
    def validate_slug(self, value):
        """Validate slug"""
        if not value.replace('-', '').replace('_', '').isalnum():
            raise serializers.ValidationError("Slug chỉ được chứa chữ cái, số, dấu gạch ngang và gạch dưới")
        return value.lower()
    
    def validate_video_file(self, value):
        """Validate file video"""
        if value:
            # Kiểm tra kích thước file (giới hạn 500MB)
            if value.size > 500 * 1024 * 1024:
                raise serializers.ValidationError("File video không được vượt quá 500MB")
            
            # Kiểm tra định dạng file
            allowed_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm']
            if not any(value.name.lower().endswith(ext) for ext in allowed_extensions):
                raise serializers.ValidationError("Định dạng file không được hỗ trợ")
        
        return value
    
    def validate_thumbnail(self, value):
        """Validate thumbnail"""
        if value:
            # Kiểm tra kích thước file (giới hạn 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError("Thumbnail không được vượt quá 5MB")
            
            # Kiểm tra định dạng ảnh
            allowed_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
            if not any(value.name.lower().endswith(ext) for ext in allowed_extensions):
                raise serializers.ValidationError("Định dạng ảnh không được hỗ trợ")
        
        return value
    
    def validate_tag_ids(self, value):
        """Validate tag IDs"""
        if value:
            # Kiểm tra tất cả tag IDs có tồn tại không
            existing_tags = Tag.objects.filter(id__in=value).count()  # type: ignore
            if existing_tags != len(value):
                raise serializers.ValidationError("Một hoặc nhiều tag không tồn tại")
        return value
    
    def create(self, validated_data):
        """Tạo video mới"""
        tag_ids = validated_data.pop('tag_ids', [])
        
        # Set default values
        validated_data['view_count'] = 0
        if 'is_favorite' not in validated_data:
            validated_data['is_favorite'] = False
        
        video = Video.objects.create(**validated_data)  # type: ignore
        
        # Thêm tags
        if tag_ids:
            video.tags.add(*tag_ids)
        
        return video
    
    def update(self, instance, validated_data):
        """Cập nhật video"""
        tag_ids = validated_data.pop('tag_ids', None)
        
        # Cập nhật các field khác
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        
        # Cập nhật tags nếu có
        if tag_ids is not None:
            instance.tags.clear()
            instance.tags.add(*tag_ids)
        
        return instance
    
    def to_representation(self, instance):
        """Customize output khi trả về"""
        data = super().to_representation(instance)
        
        # Thêm thông tin category và tags
        if instance.category:
            data['category'] = {
                'id': instance.category.id,
                'name': instance.category.name
            }
        
        data['tags'] = [
            {'id': tag.id, 'name': tag.name} 
            for tag in instance.tags.all()
        ]
        
        return data


class VideoStatsSerializer(serializers.ModelSerializer):
    """Serializer cho thống kê video"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    tag_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Video
        fields = [
            'id', 'title', 'category_name', 'tag_count', 
            'view_count', 'is_favorite', 'status', 'created_at'
        ]
        read_only_fields = ['id', 'view_count', 'created_at']
    
    def get_tag_count(self, obj):
        """Đếm số tags"""
        return obj.tags.count()


class VideoViewCountSerializer(serializers.ModelSerializer):
    """Serializer cho cập nhật lượt xem"""
    
    class Meta:
        model = Video
        fields = ['view_count']
        read_only_fields = ['view_count']
    
    def update(self, instance, validated_data):
        """Tăng lượt xem"""
        instance.increment_view_count()
        return instance
