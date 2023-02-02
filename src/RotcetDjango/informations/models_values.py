import datetime
from django.core.files.uploadedfile import SimpleUploadedFile

news_values = {
    'day_posted': datetime.date.today(),
    'title': 'Test title',
    'short_description': 'Test short description',
    'full_description': 'Test full description'
}

faqs_values = {
    'number': 1,
    'question': 'Test question',
    'answer': 'Test anwster'
}