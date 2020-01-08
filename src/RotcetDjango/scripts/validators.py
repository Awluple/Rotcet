from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
import datetime
def validate_not_before_today(date):
    if date != datetime.date.today():
        raise ValidationError(_("You cannot set date before today"), code='invalid')
    
    