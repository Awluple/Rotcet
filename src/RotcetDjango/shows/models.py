import re

from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django.core.validators import FileExtensionValidator

from scripts.validators import validate_not_before_today
from scripts.tools import create_thumbnail, handle_test_file

def main_image_directory_path(instance, filename):
    path = f'movies/{instance.name}/{instance.relese_date}/main_image/{filename}'
    return handle_test_file(path, filename)

def thumbnail_image_directory_path(instance, filename):
    path = f'movies/{instance.name}/{instance.relese_date}/main_image/thumbnail_{filename}'
    return handle_test_file(path, filename)

class Movie(models.Model):
    name = models.CharField(max_length=400)
    short_description = models.CharField(max_length=250)
    description = models.CharField(max_length=1000, blank=True, null=True)
    main_image = models.FileField(upload_to=main_image_directory_path, validators=[FileExtensionValidator(['jpg', 'png', 'jpeg'])])
    main_trailer = models.CharField(max_length=1000, null=True, blank=True)
    thumbnail = models.FileField(upload_to=thumbnail_image_directory_path, blank=True, null=True, editable=False)
    relese_date = models.DateField()
    tickets_sale_date = models.DateField(null=True, blank=True)
    highlight = models.BooleanField(default=False)
    has_3D = models.BooleanField()

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        old_instance = Movie.objects.filter(pk=self.pk).first()

        if not re.search('test_*', self.main_image.name):
            if self.thumbnail is not None or old_instance.main_image != self.main_image:
                self.thumbnail = create_thumbnail(self.main_image, 450, 80)

        super().save(*args, **kwargs)
        
    def clean(self, *args, **kwargs):
        old_instance = Movie.objects.filter(pk=self.pk).first()
        if self.tickets_sale_date:
            validate_not_before_today(old_instance, 'tickets_sale_date', self.tickets_sale_date)

        highlights = Movie.objects.filter(highlight=True)
        if self.highlight == True and highlights.count() >= 3 and not highlights.filter(pk=self.pk).exists():
            raise ValidationError(_("There are 3 highlights already, delete one to add"), code='full')
    

def image_directory_path(instance, filename):
    path = f'movies/{instance.movie.name}/images/{filename}'
    return handle_test_file(path, filename)

class Image(models.Model):
    movie = models.ForeignKey(Movie, related_name='images', on_delete=models.CASCADE)
    image = models.FileField(upload_to=image_directory_path, validators=[FileExtensionValidator(['jpg', 'png', 'jpeg'])])

    def __str__(self):
        return self.movie.name

class Trailer(models.Model):
    movie = models.ForeignKey(Movie, related_name='trailers', on_delete=models.CASCADE)
    trailer_url = models.CharField(max_length=1000)

    def __str__(self):
        return self.movie.name


def marathon_image_directory_path(instance, filename):
    path = f'marathon/{instance.tickets_sale_date}_{instance.title}/main_image/{filename}'
    return handle_test_file(path, filename)

def marathon_thumbnail_directory_path(instance, filename):
    path = f'marathons/{instance.tickets_sale_date}_{instance.title}/main_image/thumbnail_{filename}'
    return handle_test_file(path, filename)

def marathon_description_directory_path(instance, filename):
    path = f'marathons/{instance.tickets_sale_date}_{instance.title}/description/{filename}'
    return handle_test_file(path, filename)


class Marathon(models.Model):
    title = models.CharField(max_length=200)
    main_image = models.FileField(upload_to=marathon_image_directory_path, blank=True, null=True, validators=[FileExtensionValidator(['jpg', 'png', 'jpeg'])])
    thumbnail = models.FileField(upload_to=marathon_thumbnail_directory_path, blank=True, null=True, editable=False)
    short_description = models.CharField(max_length=200)
    description_html = models.FileField(upload_to=marathon_description_directory_path, blank=True, null=True, validators=[FileExtensionValidator(['html'])])
    tickets_sale_date = models.DateField()

    def clean(self, *args, **kwargs):
        old_instance = Marathon.objects.filter(pk=self.pk).first()
        validate_not_before_today(old_instance, 'tickets_sale_date', self.tickets_sale_date)

    def save(self, *args, **kwargs):
        old_instance = Marathon.objects.filter(pk=self.pk).first()

        if self.main_image and not re.search('test_*', self.main_image.name):
            if self.thumbnail is not None or old_instance.main_image != self.main_image:
                self.thumbnail = create_thumbnail(self.main_image, 450, 80)

        if self.main_image.name == '' and self.thumbnail.name != '':
            self.thumbnail.delete(save=True)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
