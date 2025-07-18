from django.apps import AppConfig


class MediaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'media'
    def ready(self):
        import media.signals  # thay your_app_name bằng tên app thực tế

