import datetime
from django.core.files.uploadedfile import SimpleUploadedFile

news_values = {
    'day_posted': datetime.date.today(),
    'image': SimpleUploadedFile(name='test_image.jpg', content="", content_type='image/jpeg'),
    'title': 'Test title',
    'short_description': 'Test short description',
    'description_html': SimpleUploadedFile(name='test_html.html', content="", content_type='text/html')
}

faqs_values = {
    'number': 1,
    'question': 'Test question',
    'anwser': 'Test anwster'
}