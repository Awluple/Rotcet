# Generated by Django 3.0.1 on 2021-02-16 15:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('informations', '0009_auto_20200403_1435'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='news',
            name='description_html',
        ),
        migrations.AddField(
            model_name='news',
            name='full_description',
            field=models.CharField(blank=True, max_length=2500, null=True),
        ),
    ]
