from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile


room_values = {
    'number': 1,
    'seats': 30,
    'room_scheme': SimpleUploadedFile(name='test_html.html', content="", content_type='text/html'),

}
screening_values = {
    'show': None,
    'date': timezone.now(),
    'room': None,
    'occupied_seats': '1,2,3,4,5,6,7,8,9',
    'in_3D': False
}