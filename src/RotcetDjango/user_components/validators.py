import collections

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

def multiple_tickets_creation_validation(user, screening, types, member_tickets, seats, occupied_seats):
    """
    Returns None if no error accured
    Errors codes: 1: error with ticket type, 2: seat already occupied, 3: error with seat number
    """

    if len(types) != len(seats):
        return {'details': {'code': 3, 'details': 'Lenght of types and seats is not equal'}, 'status': 400}

    types_valid = map(lambda type: type in [0,1,2], types)

    if False in types_valid:
        return {'details': {'code': 1,'details': 'Incorrect ticket type'}, 'status': 400}

    # check if all seats are free
    if len(set(seats + occupied_seats)) < (len(seats) + len(occupied_seats)):
        return {'details': {'code': 2,'details': f'Seats already booked', 'seats': set(occupied_seats).intersection(seats)}, 'status': 400}

    if 2 in types and not user.membership.is_active:
        return {'details': {'code': 1,'details': 'Requested member ticket for non member user'}, 'status': 400}
    
    types_number = collections.Counter(types)
    # check if a member still has free member tickets for this screening
    if 2 in types and not member_tickets + types_number[2] <= user.membership.type:
        return {'details': {'code': 1,'details': 'User has already used member tickets for this show', 'left': member_tickets - user.membership.type}, 'status': 400}        

    in_range = map(lambda seat: seat in range(1, screening.room.seats + 1), seats)

    if False in in_range:
        return {'details': {'code': 3,'details': 'There is no seat with one of given numbers'}, 'status': 400}
    
    return None
