# Generated by Django 3.0.1 on 2019-12-30 14:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('screenings', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Ticket',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('ST', 'Standard'), ('MB', 'Member'), ('RD', 'Reduced')], max_length=2)),
                ('seat', models.SmallIntegerField()),
                ('screening', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tickets', to='screenings.Screening')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tickets', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Membership',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('ST', 'Standard'), ('GO', 'Gold')], max_length=2)),
                ('is_active', models.BooleanField()),
                ('is_continued', models.BooleanField()),
                ('next_payment', models.DateField()),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='membership', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
