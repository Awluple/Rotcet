import re

from django.db import models
from django.core.validators import FileExtensionValidator
from scripts.decorators import handle_test_file
from scripts.tools import handle_test_file, create_thumbnail

def news_directory_path(instance, filename):
    path = f'news/{instance.day_posted}_{instance.title[:20]}/{filename}'
    return handle_test_file(path, filename)

def news_thumbnail_directory_path(instance, filename):
    path = f'news/{instance.day_posted}_{instance.title[:20]}/thumbnail_{filename}'
    return handle_test_file(path, filename)

class News(models.Model):
    day_posted = models.DateField(auto_now_add=True)
    image = models.FileField(upload_to=news_directory_path, blank=True, null=True, validators=[FileExtensionValidator(['jpg', 'png', 'jpeg'])])
    thumbnail = models.FileField(upload_to=news_thumbnail_directory_path, blank=True, null=True)
    title = models.CharField(max_length=120)
    short_description = models.CharField(max_length=250)
    full_description = models.TextField(max_length=3500, blank=True, null=True)

    def save(self, *args, **kwargs):
        old_instance = News.objects.filter(pk=self.pk).first()
        if bool(self.image):
            if self.thumbnail is not None or old_instance.image != self.image:
                self.thumbnail = create_thumbnail(self.image, 325, 70)
        elif bool(self.thumbnail):
            self.thumbnail.delete()

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class FAQs(models.Model):
    number = models.PositiveSmallIntegerField(unique=True)
    question = models.CharField(max_length=200)
    answer = models.CharField(max_length=500)

    def __str__(self):
        return self.question