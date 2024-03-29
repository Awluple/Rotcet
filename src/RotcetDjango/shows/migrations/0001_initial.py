# Generated by Django 3.0.1 on 2019-12-30 14:07

from django.db import migrations, models
import django.db.models.deletion
import shows.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Marathon',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('image', models.FileField(blank=True, null=True, upload_to=shows.models.marathon_image_directory_path)),
                ('short_description', models.CharField(max_length=200)),
                ('description_html', models.FileField(blank=True, null=True, upload_to=shows.models.marathon_description_directory_path)),
                ('tickets_sale_date', models.DateField()),
            ],
        ),
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=400)),
                ('short_description', models.CharField(max_length=200)),
                ('description', models.CharField(blank=True, max_length=1000, null=True)),
                ('main_image', models.FileField(upload_to=shows.models.main_image_directory_path)),
                ('relese_date', models.DateField()),
                ('tickets_sale_date', models.DateField()),
                ('highlight', models.BooleanField(default=False)),
                ('has_3D', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='Trailer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('trailer_url', models.URLField()),
                ('movie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trailers', to='shows.Movie')),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.FileField(upload_to=shows.models.image_directory_path)),
                ('movie', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='shows.Movie')),
            ],
        ),
    ]
