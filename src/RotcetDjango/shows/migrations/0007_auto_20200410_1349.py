# Generated by Django 3.0.1 on 2020-04-10 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shows', '0006_auto_20200321_2009'),
    ]

    operations = [
        migrations.AlterField(
            model_name='movie',
            name='tickets_sale_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]