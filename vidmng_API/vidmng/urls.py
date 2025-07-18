from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from media.views import CategoryViewSet, TagViewSet, VideoViewSet
from django.conf import settings
from django.conf.urls.static import static

# Thêm Swagger
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

# Router đăng ký ViewSets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'tags', TagViewSet)
router.register(r'videos', VideoViewSet)

# Swagger schema config
schema_view = get_schema_view(
   openapi.Info(
      title="Vidmng API",
      default_version='v1',
      description="API documentation for Vidmng system",
      contact=openapi.Contact(email="your-email@example.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

# URL patterns
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # Swagger UI
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    
    # ReDoc UI (tùy chọn)
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Schema dạng raw JSON/YAML (tùy chọn)
    path('swagger.json', schema_view.without_ui(cache_timeout=0), name='schema-json'),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
