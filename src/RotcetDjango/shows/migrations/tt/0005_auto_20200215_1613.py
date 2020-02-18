# Generated by Django 3.0.1 on 2020-02-15 15:13

from django.db import migrations, models
import shows.models


class Migration(migrations.Migration):

    dependencies = [
        ('shows', '0004_movie_thumbnail'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='thumbnail',
            field=models.FileField(blank=True, null=True, upload_to=shows.models.thumbnail_image_directory_path),
        ),
    ]
