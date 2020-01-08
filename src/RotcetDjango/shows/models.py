from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django.core.validators import FileExtensionValidator
from scripts.validators import validate_not_before_today
def main_image_directory_path(instance, filename):
    return f'movies/{instance.name}/main_image/{filename}'

class Movie(models.Model):
    name = models.CharField(max_length=400)
    short_description = models.CharField(max_length=200)
    description = models.CharField(max_length=1000, blank=True, null=True)
    main_image = models.FileField(upload_to=main_image_directory_path, validators=[FileExtensionValidator(['jpg', 'png', 'jpeg'])])
    relese_date = models.DateField()
    tickets_sale_date = models.DateField()
    highlight = models.BooleanField(default=False)
    has_3D = models.BooleanField()

    def __str__(self):
        return self.name
    def clean(self, *args, **kwargs):
        old_instance = Movie.objects.filter(pk=self.pk).first()
        if not old_instance:
            validate_not_before_today(self.tickets_sale_date)
        # prevent an error rise on edit wihout date change
        elif old_instance.tickets_sale_date != self.tickets_sale_date:
            validate_not_before_today(self.tickets_sale_date)
        
        # Check if there are already 3 highlights
        highlights = Movie.objects.filter(highlight=True)
        if highlights.count() >= 3 and not highlights.filter(pk=self.pk).exists():
            raise ValidationError(_("There are 3 highlights already, delete one to add"), code='full')
    

def image_directory_path(instance, filename):
    return f'movies/{instance.movie.name}/images/{filename}'

class Image(models.Model):
    movie = models.ForeignKey(Movie, related_name='images', on_delete=models.CASCADE)
    image = models.FileField(upload_to=image_directory_path, validators=[FileExtensionValidator(['jpg', 'png', 'jpeg'])])

    def __str__(self):
        return self.movie.name

class Trailer(models.Model):
    movie = models.ForeignKey(Movie, related_name='trailers', on_delete=models.CASCADE)
    trailer_url = models.URLField()

    def __str__(self):
        return self.movie.name


def marathon_image_directory_path(instance, filename):
    return f'marathons/{instance.id}/main_image/{filename}'

def marathon_description_directory_path(instance, filename):
    return f'marathons/{instance.id}/description/{filename}'

class Marathon(models.Model):
    title = models.CharField(max_length=200)
    image = models.FileField(upload_to=marathon_image_directory_path, blank=True, null=True, validators=[FileExtensionValidator(['jpg', 'png', 'jpeg'])])
    short_description = models.CharField(max_length=200)
    description_html = models.FileField(upload_to=marathon_description_directory_path, blank=True, null=True, validators=[FileExtensionValidator(['html'])])
    tickets_sale_date = models.DateField()

    def clean(self, *args, **kwargs):
        old_instance = Marathon.objects.filter(pk=self.pk).first()
        if not old_instance:
            validate_not_before_today(self.tickets_sale_date)
        # prevent an error rise on edit wihout date change
        elif old_instance.tickets_sale_date != self.tickets_sale_date:
            validate_not_before_today(self.tickets_sale_date) 

    def __str__(self):
        return self.title
