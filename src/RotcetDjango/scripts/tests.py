import os
from pathlib import Path
import datetime
from django.utils import timezone
from io import BytesIO

from django.test import TestCase
from django.core.exceptions import ValidationError
from PIL import Image

from .decorators import handle_test_file as handle_test_file_decorator
from .tools import string_list_to_python, cleanup_tests_media, create_thumbnail, handle_test_file
from .validators import validate_not_before_today

class HandleTestFileDecoratorTestCase(TestCase):

    def path_to_create(self, instance, filename):
        return f'path/{instance}/{filename}'

    def test_path_redirection(self):
        path = handle_test_file_decorator(self.path_to_create)
        path = path('instance', 'test_image.jpg')
        self.assertEqual(path, 'tests/test_image.jpg')
    
    def test_no_redirection(self):
        path = handle_test_file_decorator(self.path_to_create)
        path = path('instance', 'image.jpg')
        self.assertEqual(path, 'path/instance/image.jpg')

class HandleTestFileTestCase(TestCase):

    def test_path_redirection(self):
        path = '/test/path/image.jpg'
        new_path = handle_test_file(path, 'image.jpg')
        self.assertEqual(new_path, path)
    
    def test_no_redirection(self):
        path = '/test/path/testing_image.jpg'
        new_path = handle_test_file(path, 'test_image.jpg')
        self.assertEqual(new_path, 'tests/test_image.jpg')

class TringListToPythonTestCase(TestCase):
    
    def test_ok(self):
        python_list = string_list_to_python('1,2,3,6,7,8,9,44,66,1,24')
        self.assertTrue(isinstance(python_list, list))
    
    def test_handles_not_number(self):
        with self.assertRaises(TypeError):
            string_list_to_python('1,2,3,z,1,2,3')
    
    def test_empty_string(self):
        string_list_to_python('')

class CleanupTestsMediaTestCase(TestCase):

    def test_cleanes_up(self):
        path = Path(__file__).parents[1].joinpath('media', 'tests')

        # creating a file for testing
        path.joinpath('test_file.txt').touch()   
        files = os.listdir(path)
        self.assertGreater(len(files), 0, msg='Failed on test file creation')

        cleanup_tests_media()
        files = os.listdir(path)
        self.assertEqual(len(files), 0)


class OldInstance:
        def __init__(self, date):
            self.date = date

class NotBeforeTodayValidatorTestCase(TestCase):

    def setUp(self):
        self.old_instance = OldInstance(timezone.now().date())
        self.new_date = self.old_instance.date + datetime.timedelta(2)

    def test_ok(self):
        validate_not_before_today(self.old_instance, 'date', self.new_date)
    
    def test_no_instance(self):
        validate_not_before_today(None, 'date', self.new_date)
    
    def test_wrong_field(self):
        with self.assertRaises(AttributeError):
            validate_not_before_today(self.old_instance, 'wrong_date', self.new_date)
    
    def test_date_as_datatime(self):
        old_instance = OldInstance(timezone.now())
        new_date = timezone.now() + datetime.timedelta(2)
        validate_not_before_today(old_instance, 'date', new_date)

    def test_today(self):
        new_date = timezone.now().date()
        validate_not_before_today(self.old_instance, 'date', new_date)
    
    def test_before_today(self):
        new_date = timezone.now().date() - datetime.timedelta(1)
        with self.assertRaises(ValidationError):
            validate_not_before_today(self.old_instance, 'date', new_date)

class ThumbnailsTestCase(TestCase):

    def setUp(self):
        self.image = Path(__file__).parent.joinpath('tests_materials/testing_img.jpg')
    
    def test_thumbnail_create(self):
        tumb = Image.open(create_thumbnail(self.image))
        
        tumb_io = BytesIO()
        tumb.save(tumb_io, 'png')

        original_image = os.path.getsize(self.image)

        self.assertLess(tumb_io.tell(), original_image)
    
    def test_resize(self):
        tumb = Image.open(create_thumbnail(self.image, 500))
        tumb_width, tumb_height = tumb.size

        original_image = Image.open(self.image)
        original_width, original_height = original_image.size

        self.assertLess(tumb_width, original_width)
        self.assertLess(tumb_height, original_height)
    

