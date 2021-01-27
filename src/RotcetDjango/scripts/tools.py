import os
import sys
import shutil
import re
import urllib
from urllib.error import HTTPError
import tempfile
from io import BytesIO
from pathlib import Path

from PIL import Image as PILImage
from django.core.files.uploadedfile import InMemoryUploadedFile

from django.utils.translation import gettext as _

def handle_test_file(path, filename):
    if re.match('test_+', filename):
            return f'tests/{filename}'
    else:
        return path

def string_list_to_python(string_list):
    if string_list == '':
        return []

    if string_list is not None:
        as_list = string_list.split(',')
    else:
        return []
    for index, value in enumerate(as_list):
        try:
            value = int(value)
        except ValueError:
            raise TypeError(f"An error accured while trying to convert '{value}' to integer'")
        as_list[index] = value # exchange string values to integer
    return as_list

def cleanup_tests_media():
    """ Cleanes up the folder with media from tests """
    path = Path(__file__).parents[1].joinpath('media', 'tests')
    shutil.rmtree(path)
    path.mkdir()

def create_thumbnail(image, max_size=450, quality=70):

    basename = os.path.basename(image.name)
    name, extension = os.path.splitext(basename)
    if re.match('test_+', image.name): # ignore fake testing images from django's SimpleUploadedFile
        return InMemoryUploadedFile(image,'ImageField', basename, f'image/{extension}', sys.getsizeof(image), None)

    original_image = PILImage.open(image)
    # scale image
    width, height = original_image.size
    if width > max_size:
        reduce = max_size / width
        width = width * reduce
        height = height * reduce
    elif height > max_size:
        reduce = max_size / height
        width = width * reduce
        height = height * reduce
    
    extension = extension.replace(".","")
    extension = extension if extension != 'jpg' else 'JPEG'

    thumb_io = BytesIO()
    thumb = original_image.resize((round(width), round(height)))
    thumb.save(thumb_io, format=extension, quality=quality)

    return InMemoryUploadedFile(thumb_io,'ImageField', basename, f'image/{extension}', sys.getsizeof(thumb_io), None)

def get_youtube_thubnail(youtube_id, filename):
    """ Downloads a thumbnail from youtube """
    image = None
    try:
        url = f'https://img.youtube.com/vi/{youtube_id}/maxresdefault.jpg'
        image = urllib.request.urlopen(url)
    except HTTPError as exc:
        return None

    temp = tempfile.TemporaryFile()
    temp.write(image.read())
    return InMemoryUploadedFile(temp,'ImageField', f'{filename}.jpg', f'image/JPEG', image.headers['content-length'], None)

def xstr(s):
    """ Converts None to an empty string """
    if s is None:
        return ''
    return str(s)