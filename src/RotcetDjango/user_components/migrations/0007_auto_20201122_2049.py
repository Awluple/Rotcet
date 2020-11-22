# Generated by Django 3.0.1 on 2020-11-22 20:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_components', '0006_membership_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='membership',
            name='type',
        ),
        migrations.AlterField(
            model_name='membership',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='membership',
            name='is_continued',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='membership',
            name='next_payment',
            field=models.DateField(blank=True, null=True),
        ),
    ]
