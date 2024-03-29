# Generated by Django 3.0.1 on 2020-01-08 18:52

import django.core.validators
from django.db import migrations, models
import informations.models


class Migration(migrations.Migration):

    dependencies = [
        ('informations', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='news',
            name='description_html',
            field=models.FileField(blank=True, null=True, upload_to=informations.models.news_directory_path, validators=[django.core.validators.FileExtensionValidator(['html'])]),
        ),
    ]
