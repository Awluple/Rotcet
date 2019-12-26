from django.db import models
from django.core.validators import int_list_validator
from shows.models import Movie, Marathon

class Room(models.Model):
    number = models.PositiveSmallIntegerField()
    seats = models.PositiveSmallIntegerField()
    room_image = models.FileField(upload_to='rooms/')

class Show(models.Model):
    MOVIE = 'MV'
    MARATHON = 'MR'

    SHOWS_CHOICES = [
        (MOVIE, 'Movie'),
        (MARATHON, 'Marathon')
    ]

    type = models.CharField(max_length=2, choices=SHOWS_CHOICES)
    movie = models.OneToOneField(Movie, on_delete=models.CASCADE)
    marathon = models.OneToOneField(Marathon, on_delete=models.CASCADE)

class Screening(models.Model):
    show = models.ForeignKey(Show, related_name='screenings', on_delete=models.CASCADE)
    date = models.DateTimeField()
    room = models.ForeignKey(Room, related_name='screenings', on_delete=models.CASCADE)
    occupied_seats = models.CharField(max_length=1000, validators=[int_list_validator])
    in_3D = models.BooleanField()
    
    