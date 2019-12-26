from django.db import models
from django.contrib.auth.models import User
from screenings.models import Screening

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
    seat = models.SmallIntegerField()
    #code = models.CharField(max_length=200)


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