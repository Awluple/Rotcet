# Generated by Django 4.1.3 on 2023-02-06 05:15

import django.core.validators
from django.db import migrations, models
import shows.models


class Migration(migrations.Migration):

    dependencies = [
        ('shows', '0026_alter_movie_main_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='image',
            field=models.FileField(upload_to=shows.models.image_directory_path, validators=[django.core.validators.FileExtensionValidator(['jpg', 'png', 'jpeg', 'webp'])]),
        ),
    ]
