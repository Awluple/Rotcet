# Generated by Django 3.0.1 on 2020-01-20 14:54

import django.core.validators
from django.db import migrations, models
import screenings.models
import screenings.validators


class Migration(migrations.Migration):

    dependencies = [
        ('screenings', '0004_auto_20200104_1924'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='room',
            name='room_image',
        ),
        migrations.AddField(
            model_name='room',
            name='room_scheme',
            field=models.FileField(default='a', upload_to=screenings.models.room_scheme_path, validators=[django.core.validators.FileExtensionValidator(['html'])]),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='screening',
            name='occupied_seats',
            field=models.CharField(blank=True, max_length=1000, null=True, validators=[screenings.validators.validate_positive_integers_list]),
        ),
    ]
