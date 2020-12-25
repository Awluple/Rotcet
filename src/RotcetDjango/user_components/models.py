from django.db import models
from django.contrib.auth.models import User

from scripts.tools import xstr, string_list_to_python

from screenings.models import Screening
from screenings.validators import validate_occupied_seats

from .validators import *

class Ticket(models.Model):

    user = models.ForeignKey(User, related_name='tickets', on_delete=models.CASCADE)
    type = models.PositiveSmallIntegerField(default=0)
    screening = models.ForeignKey(Screening, related_name='tickets', on_delete=models.CASCADE)
    seat = models.PositiveSmallIntegerField()
    #code = models.CharField(max_length=200)

    def __str__(self):
        return f'{self.user} - Seat {self.seat} - {self.screening.show} - {self.screening.date}'

    def clean(self, *args, **kwargs):
        old_instance = Ticket.objects.filter(pk=self.pk).first()

        validate_type(self.type)
        validate_ticket_for_member(self.type, self.user.membership.is_active)

        member_tickets = Ticket.objects.filter(screening=self.screening, type=2).count()
        validate_seat_in_range(self.seat, self.screening.room.seats)
        
        if old_instance is None:
            validate_seat_avaliable(self.seat, self.screening.occupied_seats)
            validate_member_tickets_count(self.type, member_tickets, self.user.membership.type)

        if old_instance is not None and old_instance.seat != self.seat:
            validate_seat_avaliable(self.seat, self.screening.occupied_seats)
        
        if old_instance is not None and old_instance.type != self.type:
            validate_member_tickets_count(self.type, member_tickets, self.user.membership.type)
    
    def save(self, *args, **kwargs):
        old_instance = Ticket.objects.filter(pk=self.pk).first()
    
        if old_instance is not None and old_instance.seat == self.seat:
            super().save(*args, **kwargs)
        elif old_instance is not None:
            # exchange seat in occupied_seats
            screening = Screening.objects.get(pk=self.screening.pk)

            seats = string_list_to_python(screening.occupied_seats)
            index = seats.index(old_instance.seat)
            seats[index] = self.seat
            screening.occupied_seats = ','.join(map(str, seats))

            screening.save()

            super().save(*args, **kwargs)
        else:
            # add seat to occupied_seats
            screening = Screening.objects.get(pk=self.screening.pk)

            if self.screening.occupied_seats is None or self.screening.occupied_seats == '':
                screening.occupied_seats = str(self.seat)
            else:
                screening.occupied_seats = (self.screening.occupied_seats + ',' + str(self.seat))

            screening.save()

            super().save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):

        screening = Screening.objects.get(pk=self.screening.pk)

        seats = string_list_to_python(screening.occupied_seats)
        new_seats = list(filter(lambda seat: seat is not self.seat, seats))

        if len(new_seats) == 0:
            screening.occupied_seats = None
        else:
            screening.occupied_seats = ','.join(map(str, new_seats))
        
        screening.save()

        super().delete(*args, **kwargs)
        

class Membership(models.Model):

    user = models.OneToOneField(User, related_name='membership', on_delete=models.CASCADE)
    type = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=False)
    is_continued = models.BooleanField(default=False)
    next_payment = models.DateField(null=True, blank=True)

    def __str__(self):
        return f'{self.user} {self.is_active}'