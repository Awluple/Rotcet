# Generated by Django 3.0.1 on 2020-11-22 18:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_components', '0002_auto_20191230_1546'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='membership',
            name='type',
        ),
    ]