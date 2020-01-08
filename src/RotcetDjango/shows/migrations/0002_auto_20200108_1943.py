# Generated by Django 3.0.1 on 2020-01-08 18:43

import django.core.validators
from django.db import migrations, models
import shows.models


class Migration(migrations.Migration):

    dependencies = [
        ('shows', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='marathon',
            name='description_html',
            field=models.FileField(blank=True, null=True, upload_to=shows.models.marathon_description_directory_path, validators=[django.core.validators.FileExtensionValidator(['html'])]),
        ),
    ]