from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django.utils import timezone
import datetime

def validate_not_before_today(old_instance, field_name, new_date):
    def check():
        if new_date < timezone.now().date():
            raise ValidationError(_("You cannot set date before today on %(field_name)s field"), params={'field_name': field_name}, code='invalid')

    # datatime to date
    if isinstance(new_date, datetime.datetime):
        new_date = new_date.date()
    if not old_instance:
       check()
       return
    
    old_date = getattr(old_instance, field_name)
    # datatime to date
    if isinstance(old_date, datetime.datetime):
        old_date = old_date.date()
   # prevent an error rise on edit wihout date change
    if old_date != new_date:
        check()
    