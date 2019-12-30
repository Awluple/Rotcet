from django.db import models
from django.core.validators import int_list_validator
from shows.models import Movie, Marathon

class Room(models.Model):
    number = models.PositiveSmallIntegerField()
    seats = models.PositiveSmallIntegerField()
    room_image = models.FileField(upload_to='rooms/')

    def __str__(self):
        return str(self.number)

class Show(models.Model):
    MOVIE = 'MV'
    MARATHON = 'MR'

    SHOWS_CHOICES = [
        (MOVIE, 'Movie'),
        (MARATHON, 'Marathon')
    ]

    type = models.CharField(max_length=2, choices=SHOWS_CHOICES)
    movie = models.OneToOneField(Movie, blank=True, null=True, on_delete=models.CASCADE)
    marathon = models.OneToOneField(Marathon, blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        if self.movie:
            return self.movie.name
        return self.marathon.title

class Screening(models.Model):
    show = models.ForeignKey(Show, related_name='screenings', on_delete=models.CASCADE)
    date = models.DateTimeField()
    room = models.ForeignKey(Room, related_name='screenings', on_delete=models.CASCADE)
    occupied_seats = models.CharField(max_length=1000, blank=True, null=True, validators=[int_list_validator])
    in_3D = models.BooleanField()
    
    def __str__(self):
        return f'{self.date} {self.room}'
    