import datetime
from django.core.files.uploadedfile import SimpleUploadedFile

movie_values = {
    'name': 'Test',
    'short_description': 'test',
    'description': 'test',
    'relese_date': datetime.date.today(),
    'tickets_sale_date': datetime.date.today() + datetime.timedelta(2),
    'main_image': SimpleUploadedFile(name='test_image.jpg', content="", content_type='image/jpeg'),
    'highlight': False,
    'has_3D': False,
}

marathon_values = {
    'title': 'Test',
    'image': None,
    'short_description': 'test',
    'tickets_sale_date': datetime.date.today() + datetime.timedelta(2),
}