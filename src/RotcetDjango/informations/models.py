from django.db import models
from django.core.validators import FileExtensionValidator
from scripts.decorators import handle_test_file
from scripts.tools import handle_test_file

def news_directory_path(instance, filename):
    path = f'news/{instance.day_posted}_{instance.title[:20]}/{filename}'
    return handle_test_file(path, filename)

class News(models.Model):
    day_posted = models.DateField(auto_now_add=True)
    image = models.FileField(upload_to=news_directory_path, default='static/images/logo.png', validators=[FileExtensionValidator(['jpg', 'png', 'jpeg'])])
    title = models.CharField(max_length=120)
    short_description = models.CharField(max_length=250)
    description_html = models.FileField(upload_to=news_directory_path, blank=True, null=True, validators=[FileExtensionValidator(['html'])])

    def __str__(self):
        return self.title

class FAQs(models.Model):
    number = models.PositiveSmallIntegerField(unique=True)
    question = models.CharField(max_length=200)
    anwser = models.CharField(max_length=500)

    def __str__(self):
        return self.question