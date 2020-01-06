from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator
from .validators import validate_show, validate_occupied_seats, validate_positive_integers_list
from shows.models import Movie, Marathon

class Room(models.Model):
    number = models.PositiveSmallIntegerField(unique=True)
    seats = models.PositiveSmallIntegerField()
    room_scheme = models.FileField(upload_to='rooms/', validators=[FileExtensionValidator(['html'])])

    def __str__(self):
        return str(self.number)

class Show(models.Model):
    # MOVIE = 'MV'
    # MARATHON = 'MR'

    SHOWS_CHOICES = [
        ('MV', 'Movie'),
        ('MR', 'Marathon')
    ]
    type = models.CharField(max_length=2, choices=SHOWS_CHOICES)
    movie = models.OneToOneField(Movie, blank=True, null=True, on_delete=models.CASCADE)
    marathon = models.OneToOneField(Marathon, blank=True, null=True, on_delete=models.CASCADE)

    def __str__(self):
        if self.movie:
            return self.movie.name
        elif self.marathon:
            return self.marathon.title
        return self.type
    
    def clean(self, *args, **kwargs):
        validate_show(self.SHOWS_CHOICES, self.type, movie=self.movie, marathon=self.marathon)

class Screening(models.Model):
    show = models.ForeignKey(Show, related_name='screenings', on_delete=models.CASCADE)
    date = models.DateTimeField()
    room = models.ForeignKey(Room, related_name='screenings', on_delete=models.CASCADE)
    occupied_seats = models.CharField(max_length=1000, blank=True, null=True, validators=[validate_positive_integers_list])
    in_3D = models.BooleanField()
    
    def __str__(self):
        return f'{self.date} {self.room}'
    def clean(self, *args, **kwargs):
        validate_occupied_seats(self.room.seats, self.occupied_seats)
    