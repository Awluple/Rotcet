# Generated by Django 3.0.1 on 2020-07-18 16:38

from django.db import migrations, models
import shows.models


class Migration(migrations.Migration):

    dependencies = [
        ('shows', '0016_auto_20200718_1830'),
    ]

    operations = [
        migrations.AlterField(
            model_name='image',
            name='thumbnail',
            field=models.FileField(null=True, upload_to=shows.models.image_thumbnail_directory_path),
        ),
    ]
