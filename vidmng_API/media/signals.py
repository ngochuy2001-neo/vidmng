from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver
from .models import Category, Video
from .utils import delete_file

# XÓA FILE KHI XÓA OBJECT
@receiver(pre_delete, sender=Category)
def delete_category_image(sender, instance, **kwargs):
    delete_file(instance.image)

@receiver(pre_delete, sender=Video)
def delete_video_files(sender, instance, **kwargs):
    delete_file(instance.video_file)
    delete_file(instance.thumbnail)

# XÓA FILE CŨ KHI UPDATE FILE MỚI
@receiver(pre_save, sender=Category)
def delete_old_category_image(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        old = Category.objects.get(pk=instance.pk)
        if old.image and old.image != instance.image:
            delete_file(old.image)
    except Category.DoesNotExist:
        pass

@receiver(pre_save, sender=Video)
def delete_old_video_files(sender, instance, **kwargs):
    if not instance.pk:
        return
    try:
        old = Video.objects.get(pk=instance.pk)
        if old.video_file and old.video_file != instance.video_file:
            delete_file(old.video_file)
        if old.thumbnail and old.thumbnail != instance.thumbnail:
            delete_file(old.thumbnail)
    except Video.DoesNotExist:
        pass
