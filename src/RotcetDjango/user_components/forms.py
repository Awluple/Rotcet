from django import forms
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from django.utils.translation import gettext as _
from django.contrib import messages
from django.contrib.auth.password_validation import get_default_password_validators

def validate_password(password, user=None, password_validators=None):
    """
    Django password validator which returns errors instead of calling them

    """
    errors = []
    if password_validators is None:
        password_validators = get_default_password_validators()
    for validator in password_validators:
        try:
            validator.validate(password, user)
        except ValidationError as error:
            errors.append(error)
    
    return errors

class UserRegistrationForm(forms.Form):
    email = forms.EmailField(max_length=150, widget=forms.TextInput(attrs={'placeholder': 'Email'}))
    password = forms.CharField(max_length=24, min_length=8, widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))
    password_confirmation = forms.CharField(max_length=24, min_length=8, widget=forms.PasswordInput(attrs={'placeholder': 'Confirm password'}))

    def clean_email(self):
        email = self.cleaned_data['email']
        user = User.objects.filter(email=email)
        if user.exists():
            raise ValidationError(_("There is already an account with this email"), code='invalid')
        return email


    def clean(self):
        cleaned_data = super().clean()
        password = self.cleaned_data.get('password')
        password_confirmation = self.cleaned_data.get('password_confirmation')

        errors = []

        if password and password_confirmation:
            if password != password_confirmation:
                errors.append(ValidationError(_("Passwords do not match"), code='invalid'))
        else:
            errors.append(ValidationError(_("Enter both the password and the password confirmation"), code='empty'))
        
        password_errors = validate_password(password)

        if password_errors:
            errors.append(password_errors)

        if errors:
            raise ValidationError(errors)