import os
import sys
import shutil
from io import BytesIO
from pathlib import Path

from PIL import Image as PILImage
from django.core.files.uploadedfile import InMemoryUploadedFile

from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

def string_list_to_python(string_list):
    if string_list:
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

def create_thumbnail(image, max_size=450, quality=80):

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
    
    basename = os.path.basename(image.name)
    name, extension = os.path.splitext(basename)
    extension = extension.replace(".","")
    extension = extension if extension != 'jpg' else 'JPEG'

    thumb = PILImage.open(image)
    thumb_io = BytesIO()
    thumb = thumb.resize((round(width), round(height)))
    thumb.save(thumb_io, format=extension, quality=quality)

    return InMemoryUploadedFile(thumb_io,'ImageField', basename, f'image/{extension}', sys.getsizeof(thumb_io), None)