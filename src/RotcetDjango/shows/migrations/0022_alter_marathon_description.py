# Generated by Django 4.1.3 on 2023-01-30 21:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shows', '0021_rename_description_html_marathon_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='marathon',
            name='description',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
