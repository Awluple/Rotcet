# Generated by Django 3.0.1 on 2020-03-31 14:09

import django.core.validators
from django.db import migrations, models
import informations.models


class Migration(migrations.Migration):

    dependencies = [
        ('informations', '0007_auto_20200120_1559'),
    ]

    operations = [
        migrations.AlterField(
            model_name='news',
            name='image',
            field=models.FileField(default='static/images/logo.png', upload_to=informations.models.news_directory_path, validators=[django.core.validators.FileExtensionValidator(['jpg', 'png', 'jpeg'])]),
        ),
    ]
