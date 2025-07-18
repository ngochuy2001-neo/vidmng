from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, TagViewSet, VideoViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'tags', TagViewSet)
router.register(r'videos', VideoViewSet)

urlpatterns = router.urls