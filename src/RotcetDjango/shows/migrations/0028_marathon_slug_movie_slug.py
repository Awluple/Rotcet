# Generated by Django 4.1.3 on 2023-02-08 04:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shows', '0027_alter_image_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='marathon',
            name='slug',
            field=models.SlugField(blank=True, editable=False, max_length=400, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='movie',
            name='slug',
            field=models.SlugField(blank=True, editable=False, max_length=400, null=True, unique=True),
        ),
    ]
