from django.db import models
from django.contrib.auth.models import User

from scripts.tools import xstr

from screenings.models import Screening
from screenings.validators import validate_occupied_seats

class Ticket(models.Model):

    STANDARD = 'ST'
    MEMBER = 'MB'
    REDUCED = 'RD'

    TICKETS_CHOICES = [
        (STANDARD, 'Standard'),
        (MEMBER, 'Member'),
        (REDUCED, 'Reduced')
    ]

    user = models.ForeignKey(User, related_name='tickets', on_delete=models.CASCADE)
    type = models.CharField(max_length=2, choices=TICKETS_CHOICES)
    screening = models.ForeignKey(Screening, related_name='tickets', on_delete=models.CASCADE)
    seat = models.PositiveSmallIntegerField()
    #code = models.CharField(max_length=200)

    def __str__(self):
        return f'{self.user} {self.screening.show} {self.screening.date}'

    def clean(self, *args, **kwargs):
        validate_occupied_seats(self.screening.room.seats, xstr(self.screening.occupied_seats) + ',' + str(self.seat))
    
    def save(self, *args, **kwargs):
        screening = Screening.objects.get(pk=self.screening.pk)

        if self.screening.occupied_seats is None:
            screening.occupied_seats=str(self.seat)
        else:
            screening.occupied_seats=(xstr(self.screening.occupied_seats) + ',' + str(self.seat))
        screening.save()

        super().save(*args, **kwargs)
        

class Membership(models.Model):

    STANDARD = 'ST'
    GOLD = 'GO'

    MEMBERSHIP_CHOICES = [
        (STANDARD, 'Standard'),
        (GOLD, 'Gold')
    ]

    user = models.OneToOneField(User, related_name='membership', on_delete=models.CASCADE)
    type = models.CharField(max_length=2, choices=MEMBERSHIP_CHOICES)
    is_active = models.BooleanField()
    is_continued = models.BooleanField()
    next_payment = models.DateField()

    def __str__(self):
        return f'{self.user} {self.type}'