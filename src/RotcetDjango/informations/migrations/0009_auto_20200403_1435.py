# Generated by Django 3.0.1 on 2020-04-03 12:35

import django.core.validators
from django.db import migrations, models
import informations.models


class Migration(migrations.Migration):

    dependencies = [
        ('informations', '0008_auto_20200331_1609'),
    ]

    operations = [
        migrations.AddField(
            model_name='news',
            name='thumbnail',
            field=models.FileField(blank=True, null=True, upload_to=informations.models.news_thumbnail_directory_path),
        ),
        migrations.AlterField(
            model_name='news',
            name='image',
            field=models.FileField(default='/assets/placeholders/logo.png', upload_to=informations.models.news_directory_path, validators=[django.core.validators.FileExtensionValidator(['jpg', 'png', 'jpeg'])]),
        ),
    ]
