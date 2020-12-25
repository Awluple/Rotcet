from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

from scripts.tools import string_list_to_python

def validate_type(type):
    if type not in [0,1,2]:
        raise ValidationError(_("Incorrect ticket type"), code='invalid') 

def validate_ticket_for_member(type, user_membership_status):
    if type == 2 and not user_membership_status:
        raise ValidationError(_("Selected member ticket for non member user"), code='forbidden')

def validate_member_tickets_count(type, member_tickets_count, user_membership_type):
    if type == 2 and not member_tickets_count + 1 <= user_membership_type:
        raise ValidationError(_("User already used all member tickets for this show"), code='full')

def validate_seat_in_range(seat, screening_room_seats):
    if not seat in range(1, screening_room_seats + 1):
        raise ValidationError(_("There is no seat with number %(seat)s"), params={'seat': seat}, code='invalid')

def validate_seat_avaliable(seat, occupied_seats):
    occupied_seats = string_list_to_python(occupied_seats)
    if seat in occupied_seats:
        raise ValidationError(_("Seat %(seat)s already booked"), params={'seat': seat}, code='full') 