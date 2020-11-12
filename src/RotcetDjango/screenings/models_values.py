from django.utils import timezone
from django.core.files.uploadedfile import SimpleUploadedFile


room_values = {
    'number': 1,
    'seats': 30,
}
screening_values = {
    'show': None,
    'date': timezone.now(),
    'room': None,
    'occupied_seats': '1,2,3,4,5,6,7,8,9',
    'in_3D': False
}