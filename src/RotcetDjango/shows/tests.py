import datetime
from django.test import TestCase
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile

from scripts.tools import cleanup_tests_media

from .models_values import movie_values
from .models import Movie

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
    
    def test_can_edit_highlight_movie(self):
        """ Test if highlighted movie can be edited if there are already 3 highlights """
        movie = Movie.objects.get(pk=1)
        movie.name = "Test2"
        movie.full_clean()
