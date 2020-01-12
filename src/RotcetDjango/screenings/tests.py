from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ValidationError

from scripts.tools import cleanup_tests_media

from .models import Room, Show, Screening
from .models_values import screening_values, room_values

from shows.models_values import movie_values, marathon_values
from shows.models import Movie, Marathon

from .validators import validate_occupied_seats, validate_positive_integers_list, validate_show

class ShowValidatorTestCase(TestCase):

    @classmethod
    def tearDownClass(cls):
        cleanup_tests_media()
        
    def setUp(self):
        Movie.objects.create(**movie_values)
        Marathon.objects.create(**marathon_values)
        movie = Movie.objects.get(pk=1)
        Show.objects.create(type='MV', movie=movie)
        self.SHOWS_CHOICES = [
            ('MV', 'Movie'),
            ('MR', 'Marathon')
        ]
    def test_no_multiple_relations(self):
        movie = Marathon.objects.get(pk=1)
        marathon = Movie.objects.get(pk=1)
        show = Show.objects.get(pk=1)
        
        with self.assertRaisesRegex(ValidationError, 'You cannot select more them one show'):
            validate_show(self.SHOWS_CHOICES, show.type, movie=movie, marathon=marathon)

    def test_no_relation(self):
        show = Show.objects.get(pk=1)
        with self.assertRaisesRegex(ValidationError, 'You must chose a .*'):
            validate_show(self.SHOWS_CHOICES, show.type)
    
    def test_wrong_type(self):
        movie = Marathon.objects.get(pk=1)
        show = Show.objects.get(pk=1)
        with self.assertRaisesRegex(ValidationError, 'You must chose a .*? not a *'):
            validate_show(self.SHOWS_CHOICES, 'MR', movie=movie)

class OccupiedSeatsValidatorTestCase(TestCase):

    def test_seats_in_range(self):
        validate_occupied_seats(30, '1,4,8,30')
    
    def test_seat_out_of_range_upper(self):
        with self.assertRaisesRegex(ValidationError, 'Seat is out of range'):
            validate_occupied_seats(30, '1,4,8,37')
    
    def test_seat_out_of_range_below(self):
        with self.assertRaisesRegex(ValidationError, 'Seat is out of range'):
            validate_occupied_seats(30, '1,4,8,0')
    
    def test_no_dubles(self):
        with self.assertRaisesRegex(ValidationError, 'Seat already occupied'):
            validate_occupied_seats(30, '1,1')
    
