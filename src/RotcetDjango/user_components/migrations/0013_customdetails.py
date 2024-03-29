# Generated by Django 3.0.1 on 2021-01-24 03:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('user_components', '0012_auto_20210124_0303'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomDetails',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('surname', models.CharField(max_length=100)),
                ('address', models.CharField(max_length=250)),
                ('postcode', models.CharField(max_length=8)),
                ('ticket', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='custom_details', to='user_components.Ticket')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
