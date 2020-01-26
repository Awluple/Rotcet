import datetime

from django.utils import timezone
from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ValidationError
from rest_framework import status
from rest_framework.test import APITestCase

from scripts.tools import cleanup_tests_media

from .models import Room, Show, Screening
from .models_values import screening_values, room_values

from shows.models_values import movie_values, marathon_values
from shows.models import Movie, Marathon

from .validators import validate_occupied_seats, validate_positive_integers_list, validate_show, validate_available_in_3D

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
    
    def test_ok(self):
        movie = Marathon.objects.get(pk=1)
        show = Show.objects.get(pk=1)
        validate_show(self.SHOWS_CHOICES, show.type, movie=movie)

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
    
    def test_raise_list_error(self):
        with self.assertRaisesRegex(ValidationError, 'An error accured while trying to convert seat to integer'):
            validate_occupied_seats(30, '1,1f', raise_list_error=True)

class AvailableIn3DTestCase(TestCase):

    @classmethod
    def tearDownClass(cls):
        cleanup_tests_media()

    def setUp(self):
        Movie.objects.create(**movie_values)
        movie = Movie.objects.get(pk=1)
        Show.objects.create(type='MV', movie=movie)
    
    def test_not_available(self):
        show = Show.objects.get(pk=1)
        validate_available_in_3D(show, False)
    
    def test_available(self):
        Movie.objects.all().update(has_3D=True)
        show = Show.objects.get(pk=1)
        validate_available_in_3D(show, True)
    
    def test_colision(self):
        show = Show.objects.get(pk=1)
        with self.assertRaises(ValidationError):
            validate_available_in_3D(show, True)

class ScreeningApiViewCase(APITestCase):

    @classmethod
    def tearDownClass(cls):
        cleanup_tests_media()

    def setUp(self):
        Movie.objects.create(**movie_values)
        Room.objects.create(**room_values)
        movie = Movie.objects.get(pk=1)
        Show.objects.create(type='MV', movie=movie)

        show = Show.objects.get(pk=1)
        room = Room.objects.get(pk=1)
        values = screening_values.copy()
        values['show'] = show
        values['room'] = room

        Screening.objects.create(**values)
        values['in_3D'] = True
        values['date'] = timezone.now() + datetime.timedelta(1.5)
        Screening.objects.create(**values)

        values['date'] = timezone.now() - datetime.timedelta(1.5)
        Screening.objects.create(**values)

    
    def test_defalut_ordering(self):
        url = reverse('api:screening-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        self.assertLess(data[0]['date'], data[1]['date'])
        self.assertGreater(data[2]['date'], data[0]['date'])
    
    def test_ordering(self):
        url = reverse('api:screening-list')
        response = self.client.get(url, {'ordering':'-date'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        self.assertGreater(data[0]['date'], data[1]['date'])
        self.assertLess(data[2]['date'], data[0]['date'])
    
    def test_has_default_fields(self):
        url = reverse('api:screening-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        keys = data[0].keys()
        self.assertEqual(4, len(keys))
        self.assertListEqual(['id', 'name', 'url', 'date'], list(keys))

    def test_dynamic_fields(self):
        url = reverse('api:screening-list')
        response = self.client.get(url, {'fields': 'id,date'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        keys = data[0].keys()
        self.assertEqual(2, len(keys))
        self.assertListEqual(['id', 'date'], list(keys))
    
    def test_url(self):
        url = reverse('api:screening-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results'][0]
        url_response = self.client.get(data['url'])
        self.assertEqual(url_response.status_code, status.HTTP_200_OK)