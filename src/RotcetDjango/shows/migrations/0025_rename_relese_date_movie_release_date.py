# Generated by Django 4.1.3 on 2023-02-06 05:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shows', '0024_marathon_type_movie_type'),
    ]

    operations = [
        migrations.RenameField(
            model_name='movie',
            old_name='relese_date',
            new_name='release_date',
        ),
    ]
