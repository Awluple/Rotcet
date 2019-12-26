from django.db import models

def main_image_directory_path(instance, filename):
    return f'movies/{instance.name}/main_image/{filename}'

class Movie(models.Model):
    name = models.CharField(max_length=400)
    short_description = models.CharField(max_length=200)
    description = models.CharField(max_length=1000, blank=True, null=True)
    main_image = models.FileField(upload_to=main_image_directory_path)
    relese_date = models.DateField()
    tickets_sale_date = models.DateField()
    highlight = models.BooleanField(default=False)
    has_3D = models.BooleanField()


def image_directory_path(instance, filename):
    return f'movies/{instance.movie.name}/images/{filename}'

class Image(models.Model):
    movie = models.ForeignKey(Movie, related_name='images', on_delete=models.CASCADE)
    image = models.FileField(upload_to=image_directory_path)

class Trailer(models.Model):
    movie = models.ForeignKey(Movie, related_name='trailers', on_delete=models.CASCADE)
    trailer_url = models.URLField()



def marathon_image_directory_path(instance, filename):
    return f'marathons/{instance.id}/main_image/{filename}'

def marathon_description_directory_path(instance, filename):
    return f'marathons/{instance.id}/description/{filename}'

class Marathon(models.Model):
    title = models.CharField(max_length=200)
    image = models.FileField(upload_to=marathon_image_directory_path, blank=True, null=True)
    short_description = models.CharField(max_length=200)
    description_html = models.FileField(upload_to=marathon_description_directory_path, blank=True, null=True)
    tickets_sale_date = models.DateField()
