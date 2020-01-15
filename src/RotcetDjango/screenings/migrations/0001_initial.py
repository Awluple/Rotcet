# Generated by Django 3.0.1 on 2019-12-30 14:07

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('shows', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('number', models.PositiveSmallIntegerField()),
                ('seats', models.PositiveSmallIntegerField()),
                ('room_image', models.FileField(upload_to='rooms/')),
            ],
        ),
        migrations.CreateModel(
            name='Show',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('MV', 'Movie'), ('MR', 'Marathon')], max_length=2)),
                ('marathon', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='shows.Marathon')),
                ('movie', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='shows.Movie')),
            ],
        ),
        migrations.CreateModel(
            name='Screening',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField()),
                ('occupied_seats', models.CharField(max_length=1000, validators=[django.core.validators.int_list_validator])),
                ('in_3D', models.BooleanField()),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='screenings', to='screenings.Room')),
                ('show', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='screenings', to='screenings.Show')),
            ],
        ),
    ]
