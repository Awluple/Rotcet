from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

def validate_show(SHOWS_CHOICES, type, **fields):
    """Validates if correct show was selected and if multiple values are not selected"""
    fields = list(fields.items())
    relation = None
    # check if multiple values are not selected
    for field in fields:
        if field[1] and relation:
            raise ValidationError(_("You mustn't select more them one show"), code='invalid') 
        if field[1]:
            relation = field
    
    expected_relation = [item for item in SHOWS_CHOICES if item[0] == type][0]
    if relation == None:
        raise ValidationError(_("You must chose a %(expected)s"), params={'expected': expected_relation[1]}, code='empty')

    # check if correct show was selected
    if expected_relation[1].capitalize() != relation[0].capitalize():
        raise ValidationError(_("You must chose a %(expected)s not a given"), params={'expected': expected_relation[1], 'given': relation[0]}, code='invalid')

def validate_occupied_seats(room_seats, occupied_seats):
    """Validates if occupied_seats field has correct form, occupied_seats lenght is smaller then room seats, seat is in room seats range, no dubles"""
    # correct form and in range
    if occupied_seats:
        as_list = occupied_seats.split(',')
    else:
        as_list = []
    for index, seat in enumerate(as_list):
        try:
            seat = int(seat)
        except ValueError:
            raise ValidationError(_("An error accured while trying to convert '%(wrong_seat)s' to integer'"), params={'wrong_seat': seat}, code='invalid')
        if not (seat > 0 and seat <= room_seats):
            raise ValidationError(_("Seat is out of range"), code='invalid')
        as_list[index] = seat # exchange string values to integer
    no_dubles = set(as_list)

    if len(no_dubles) != len(as_list):
        raise ValidationError(_("Seat already occupied"), code='full')
    
    if len(no_dubles) > room_seats:
        raise ValidationError(_("No free seats"), code='full')

if __name__ == '__main__':
    pass