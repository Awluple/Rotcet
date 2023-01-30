# Generated by Django 4.1.3 on 2023-01-30 21:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shows', '0023_rename_title_marathon_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='marathon',
            name='type',
            field=models.CharField(default='MR', editable=False, max_length=2),
        ),
        migrations.AddField(
            model_name='movie',
            name='type',
            field=models.CharField(default='MV', editable=False, max_length=2),
        ),
    ]
