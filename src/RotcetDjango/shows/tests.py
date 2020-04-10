from datetime import timedelta

from django.urls import reverse
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from rest_framework.test import APITestCase

from scripts.tools import cleanup_tests_media

from .models_values import movie_values, marathon_values
from .models import Movie, Marathon

class MovieTestCase(TestCase):

    @classmethod
    def tearDownClass(cls):
        cleanup_tests_media()
    
    def setUp(self):
        values = movie_values.copy()
        values['highlight'] = True
        Movie.objects.create(**values)
        Movie.objects.create(**values)
        Movie.objects.create(**values)
    
    def test_max_3_highlights(self):
        values = movie_values.copy()
        values['highlight'] = True
        with self.assertRaisesRegex(ValidationError, "There are 3 highlights already, delete one to add"):
            movie = Movie(**values)
            movie.full_clean()
    
    def test_add_not_highlight(self):
        values = movie_values.copy()
        values['highlight'] = False
        movie = Movie(**values)
        movie.full_clean()

    def test_can_edit_highlight_movie(self):
        """ Test if highlighted movie can be edited if there are already 3 highlights """
        movie = Movie.objects.get(pk=1)
        movie.name = "Test2"
        movie.full_clean()

class MovieAPITestCase(APITestCase):

    @classmethod
    def tearDownClass(cls):
        cleanup_tests_media()
    
    def setUp(self):
        self.url = reverse('api:movie-list')

        values = movie_values.copy()
        Movie.objects.create(**values)

        values['tickets_sale_date'] = values['tickets_sale_date'] + timedelta(1)
        Movie.objects.create(**values)

        values['tickets_sale_date'] = values['tickets_sale_date'] - timedelta(2)
        values['name'] = 'Test_2'
        Movie.objects.create(**values)

        values['name'] = 'Test_3'
        values['tickets_sale_date'] = None
        Movie.objects.create(**values)
    
    def test_has_tickets_sale_date(self):
        response = self.client.get(self.url, {'has_tickets_sale_date': False})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        self.assertEqual(1, len(data))
        self.assertEqual(data[0]['name'], 'Test_3')

    def test_default_fields(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        keys = data[0].keys()
        self.assertEqual(3, len(keys))
        self.assertListEqual(['id', 'url', 'name'], list(keys))

    def test_dynamic_fields(self):
        response = self.client.get(self.url, {'fields':'id,main_image,tickets_sale_date,has_3D'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        keys = data[0].keys()
        self.assertEqual(4, len(keys))
        self.assertListEqual(['id', 'main_image', 'tickets_sale_date', 'has_3D'], list(keys))
    
    def test_dynamic_related_fields(self):
        response = self.client.get(self.url, {'fields':'id,images,trailers'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        keys = data[0].keys()
        self.assertEqual(3, len(keys))
        self.assertListEqual(['id', 'trailers', 'images'], list(keys))

    def test_ordering(self):
        response = self.client.get(self.url, {'fields':'id,tickets_sale_date'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        self.assertLess(data[2]['tickets_sale_date'], data[0]['tickets_sale_date'])
        self.assertGreater(data[0]['tickets_sale_date'], data[1]['tickets_sale_date'])

    def test_filtering(self):
        response = self.client.get(self.url, {'name':'Test_2'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        self.assertEqual(1, len(data))
        self.assertEqual(data[0]['name'], 'Test_2')

class MarathonAPITestCase(APITestCase):

    @classmethod
    def tearDownClass(cls):
        cleanup_tests_media()
    
    def setUp(self):
        self.url = reverse('api:marathon-list')

        values = marathon_values.copy()
        Marathon.objects.create(**values)

        values['tickets_sale_date'] = values['tickets_sale_date'] + timedelta(1)
        Marathon.objects.create(**values)

        values['tickets_sale_date'] = values['tickets_sale_date'] - timedelta(2)
        values['title'] = 'Test_2'
        Marathon.objects.create(**values)

    
    def test_default_fields(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        keys = data[0].keys()
        self.assertEqual(3, len(keys))
        self.assertListEqual(['id', 'url', 'title'], list(keys))

    def test_dynamic_fields(self):
        response = self.client.get(self.url, {'fields':'id,title,tickets_sale_date,image'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        keys = data[0].keys()
        self.assertEqual(4, len(keys))
        self.assertListEqual(['id', 'title', 'image', 'tickets_sale_date'], list(keys))

    def test_ordering(self):
        response = self.client.get(self.url, {'fields':'id,tickets_sale_date'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        self.assertLess(data[2]['tickets_sale_date'], data[0]['tickets_sale_date'])
        self.assertGreater(data[0]['tickets_sale_date'], data[1]['tickets_sale_date'])

    def test_filtering(self):
        response = self.client.get(self.url, {'title':'Test_2'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data['results']
        self.assertEqual(1, len(data))
        self.assertEqual(data[0]['title'], 'Test_2')