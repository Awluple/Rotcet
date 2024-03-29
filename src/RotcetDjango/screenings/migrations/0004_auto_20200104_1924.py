# Generated by Django 3.0.1 on 2020-01-04 18:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('screenings', '0003_auto_20191230_1546'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='number',
            field=models.PositiveSmallIntegerField(unique=True),
        ),
        migrations.AlterField(
            model_name='screening',
            name='occupied_seats',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
