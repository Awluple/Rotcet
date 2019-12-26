from django.db import models

def news_directory_path(instance, filename):
    return f'news/{instance.id}/{filename}'


class News(models.Model):
    day_posted = models.DateField(auto_now_add=True)
    image = models.FileField(upload_to=news_directory_path, blank=True, null=True)
    title = models.CharField(max_length=120)
    short_description = models.CharField(max_length=250)
    description_html = models.FileField(upload_to=news_directory_path, blank=True, null=True)

class FAQ(models.Model):
    question = models.CharField(max_length=200)
    anwser = models.CharField(max_length=500)