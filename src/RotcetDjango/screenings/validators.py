from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from scripts.tools import string_list_to_python

def validate_show(SHOWS_CHOICES, type, **fields):
    """Validates if correct show was selected and if multiple values are not selected"""
    fields = list(fields.items())
    relation = None
    # check if multiple values are not selected
    for field in fields:
        if field[1] and relation:
            raise ValidationError(_("You cannot select more them one show"), code='invalid') 
        if field[1]:
            relation = field
    
    expected_relation = [item for item in SHOWS_CHOICES if item[0] == type][0]
    if relation is None:
        raise ValidationError(_("You must chose a %(expected)s"), params={'expected': expected_relation[1]}, code='empty')

    # check if correct show was selected
    if expected_relation[1].capitalize() != relation[0].capitalize():
        raise ValidationError(_("You must chose a %(expected)s not a %(given)s"),
            params={'expected': expected_relation[1], 'given': relation[0]}, code='invalid')


def validate_positive_integers_list(string_list):
    """Validates if occupied_seats field has correct form"""
    try:
        string_list_to_python(string_list)
    except:
        raise ValidationError(_("An error accured while trying to convert seat to integer"),
            code='invalid')

def validate_occupied_seats(room_seats, occupied_seats, raise_list_error=False):
    """Validates if occupied_seats field has correct form, occupied_seats lenght is smaller then room seats,
    seat is in room seats range, no dubles"""
    try:
        occupied_seats = string_list_to_python(occupied_seats)
    except:
        if raise_list_error:
            raise ValidationError(_("An error accured while trying to convert seat to integer"),
            code='invalid')
        else:
            return
    
    for seat in occupied_seats:
        if not (seat > 0 and seat <= room_seats):
            raise ValidationError(_("Seat is out of range"), code='invalid')
     
    no_dubles = set(occupied_seats)

    if len(no_dubles) != len(occupied_seats):
        raise ValidationError(_("Seat already occupied"), code='full')
    
    if len(no_dubles) > room_seats:
        raise ValidationError(_("No free seats"), code='full')

if __name__ == '__main__':
    pass

def validate_available_in_3D(show, in_3D):
    if show.type == 'MV':
        if not show.movie.has_3D == in_3D:
            raise ValidationError(_("Movie %(movie_name)s is not 3D"), params={'movie_name': show.movie.name}, code='invalid')